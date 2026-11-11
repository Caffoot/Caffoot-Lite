"""Optional verified-email recovery with single-use, expiring proofs.

Recovery changes a password only; it cannot create a session or change MFA.
Mail is best-effort and bounded so an unavailable server cannot stop normal use.
"""
from concurrent.futures import ThreadPoolExecutor
import hashlib
import hmac
import json
import os
from pathlib import Path
import stat
import tempfile
import secrets
import threading
import time

from .accounts import hash_password, verify_password
from .audit_events import record_actor_event
from .login_throttle import LoginThrottle
from .mfa import verify_code
from .role_policy import evaluate_role_policy
from .smtp_settings import send_account_email

TOKEN_SECONDS = 15 * 60
MAX_CONFIRMATION_FAILURES = 5
MAIL_REQUESTS = LoginThrottle()
MAIL_EXECUTOR = ThreadPoolExecutor(max_workers=2, thread_name_prefix="account-mail")
MAIL_CAPACITY = threading.BoundedSemaphore(16)
REQUEST_MESSAGE = "If recovery is available, instructions will be emailed. Otherwise, contact your Caffoot Lite administrator."


def queue_email(path, recipient, subject, body):
    """Queue a bounded delivery; never log message bodies or delivery exceptions."""
    if not MAIL_CAPACITY.acquire(blocking=False):
        return False

    def deliver():
        try:
            send_account_email(path, recipient, subject, body)
        except Exception:
            # Account operations remain valid even when delivery is unavailable.
            pass
        finally:
            MAIL_CAPACITY.release()

    try:
        MAIL_EXECUTOR.submit(deliver)
    except RuntimeError:
        MAIL_CAPACITY.release()
        return False
    return True


def email_proof_secret(connection, *, create=False):
    """Keep the short-code signing key beside the database, outside SQLite.

    A private backup must include this file. Never replace a missing key while
    usable challenges remain: the operator must restore the matching backup.
    """
    database = connection.execute("PRAGMA database_list").fetchone()[2]
    if not database:
        raise OSError("Email confirmation requires persistent private storage")
    path = Path(database).parent / "account-email-secret.key"
    if create and not path.exists():
        if connection.execute("SELECT 1 FROM account_email_proofs WHERE expires_at>? LIMIT 1", (int(time.time()),)).fetchone():
            raise OSError("Restore the email confirmation secret from the private backup")
        # Linking a completed file prevents concurrent requests from seeing a partial key.
        descriptor, temporary = tempfile.mkstemp(prefix=".account-email-", dir=path.parent)
        try:
            with os.fdopen(descriptor, "wb") as stream:
                stream.write(secrets.token_bytes(32))
                stream.flush()
                os.fsync(stream.fileno())
            try:
                os.link(temporary, path)
            except FileExistsError:
                pass
        finally:
            os.unlink(temporary)
    descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW)
    with os.fdopen(descriptor, "rb") as stream:
        details = os.fstat(stream.fileno())
        if not stat.S_ISREG(details.st_mode) or stat.S_IMODE(details.st_mode) & 0o077:
            raise OSError("Email confirmation secret must be a private regular file")
        key = stream.read(33)
    if len(key) != 32:
        raise OSError("Email confirmation secret is unavailable")
    return key


def _digest(code, challenge_id, account_id, purpose, email, key):
    if isinstance(code, str):
        code = code.strip()
    if not isinstance(code, str) or len(code) != 8 or not code.isascii() or not code.isdigit():
        raise ValueError("Invalid or expired confirmation")
    message = json.dumps([challenge_id, account_id, purpose, email, code], separators=(",", ":")).encode("utf-8")
    return hmac.new(key, message, hashlib.sha256).hexdigest()


def email_attempts_remaining(connection, account_id, purpose, now):
    """Keep the five-failure budget across resends, peers and server restarts."""
    failures = connection.execute(
        "SELECT count(*) FROM account_email_attempts WHERE account_id=? AND purpose=? AND attempted_at>?",
        (account_id, purpose, now - TOKEN_SECONDS),
    ).fetchone()[0]
    return max(0, MAX_CONFIRMATION_FAILURES - failures)


def issue_email_proof(connection, account_id, purpose, *, now=None):
    """Replace one challenge without resetting its account's failed-attempt budget."""
    if purpose not in ("verify", "recover"):
        raise ValueError("Invalid confirmation purpose")
    now = int(time.time() if now is None else now)
    key = email_proof_secret(connection, create=True)
    connection.execute("BEGIN IMMEDIATE")
    try:
        connection.execute("DELETE FROM account_email_attempts WHERE attempted_at<=?", (now - TOKEN_SECONDS,))
        connection.execute("DELETE FROM account_email_proofs WHERE expires_at<=?", (now,))
        row = connection.execute(
            "SELECT p.email,p.email_verified FROM account_profiles p JOIN accounts a "
            "ON a.id=p.account_id WHERE p.account_id=? AND a.active=1", (account_id,)
        ).fetchone()
        if not row or not row[0] or (purpose == "recover" and not row[1]) or not email_attempts_remaining(connection, account_id, purpose, now):
            connection.commit()
            return None
        code = f"{secrets.randbelow(100_000_000):08d}"
        challenge_id = secrets.token_hex(32)
        connection.execute("DELETE FROM account_email_proofs WHERE account_id=? AND purpose=?", (account_id, purpose))
        connection.execute(
            "INSERT INTO account_email_proofs(token_hash,account_id,purpose,email,expires_at,challenge_id,attempts) VALUES(?,?,?,?,?,?,0)",
            (_digest(code, challenge_id, account_id, purpose, row[0], key), account_id, purpose, row[0], now + TOKEN_SECONDS, challenge_id),
        )
        connection.commit()
        return code, row[0], challenge_id
    except BaseException:
        connection.rollback()
        raise


def confirm_email_proof(connection, token, purpose, *, challenge_id, account_id=None,
                        password=None, mfa_code=None, now=None):
    """Consume one account-bound code atomically; failed guesses are durable."""
    now = int(time.time() if now is None else now)
    if not isinstance(challenge_id, str) or len(challenge_id) != 64 or any(char not in "0123456789abcdef" for char in challenge_id):
        raise ValueError("Invalid or expired confirmation")
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT t.account_id,t.email,a.username,a.mfa_secret,a.mfa_confirmed,a.is_admin,t.token_hash,t.attempts "
            "FROM account_email_proofs t JOIN accounts a ON a.id=t.account_id "
            "JOIN account_profiles p ON p.account_id=a.id "
            "WHERE t.challenge_id=? AND t.purpose=? AND t.expires_at>? AND t.email=p.email AND a.active=1",
            (challenge_id, purpose, now),
        ).fetchone()
        if not row or (account_id is not None and account_id != row[0]):
            raise ValueError("Invalid or expired confirmation")
        target, email, username, secret, confirmed, admin, digest, attempts = row
        if attempts >= MAX_CONFIRMATION_FAILURES or not email_attempts_remaining(connection, target, purpose, now):
            connection.execute("DELETE FROM account_email_proofs WHERE account_id=? AND purpose=?", (target, purpose))
            connection.commit()
            raise ValueError("Invalid or expired confirmation")
        try:
            candidate = _digest(token, challenge_id, target, purpose, email, email_proof_secret(connection))
            valid = hmac.compare_digest(candidate, digest)
        except ValueError:
            valid = False
        if purpose == "recover":
            profile = connection.execute("SELECT email_verified FROM account_profiles WHERE account_id=?", (target,)).fetchone()
            policy = evaluate_role_policy(connection, target)
            valid = valid and bool(profile[0]) and (not policy.requires_mfa or bool(confirmed and secret and verify_code(secret, mfa_code, timestamp=now)))
        elif purpose == "verify":
            valid = valid and account_id == target
        else:
            valid = False
        if not valid:
            connection.execute("INSERT INTO account_email_attempts(account_id,purpose,attempted_at) VALUES(?,?,?)", (target, purpose, now))
            connection.execute("UPDATE account_email_proofs SET attempts=attempts+1 WHERE challenge_id=?", (challenge_id,))
            if attempts + 1 >= MAX_CONFIRMATION_FAILURES or not email_attempts_remaining(connection, target, purpose, now):
                connection.execute("DELETE FROM account_email_proofs WHERE account_id=? AND purpose=?", (target, purpose))
            connection.commit()
            raise ValueError("Invalid or expired confirmation")
        if purpose == "verify":
            connection.execute("UPDATE account_profiles SET email_verified=1 WHERE account_id=?", (target,))
            reason = "Email ownership verified"
        else:
            connection.execute("UPDATE accounts SET password_hash=? WHERE id=?", (hash_password(password), target))
            connection.execute("DELETE FROM account_sessions WHERE account_id=?", (target,))
            reason = "Password recovered using verified email and required authenticator proof"
        connection.execute("DELETE FROM account_email_proofs WHERE account_id=?", (target,))
        record_actor_event(connection, target, kind="Security", action="Updated", label=username, reason=reason,
                           fields=["Email verification" if purpose == "verify" else "Password"])
        connection.commit()
        return target
    except BaseException:
        connection.rollback()
        raise


def security_recipients(connection, account_id=None, *, administrators=False):
    """Only verified addresses receive account-security notices."""
    condition = "a.is_admin=1" if administrators else "a.id=?"
    parameters = () if administrators else (account_id,)
    return {row[0] for row in connection.execute(
        "SELECT p.email FROM account_profiles p JOIN accounts a ON a.id=p.account_id "
        "WHERE a.active=1 AND p.email_verified=1 AND p.email<>'' AND " + condition,
        parameters,
    )}


_NOTICE_LOCK = threading.Lock()
_NOTICE_NEXT = {}


def notify_security_change(path, recipients):
    """Report queue admission only; delivery remains optional and untracked."""
    result = {"queued": 0, "coalesced": 0, "notQueued": 0}
    for address in recipients:
        now = time.monotonic()
        with _NOTICE_LOCK:
            for key in list(_NOTICE_NEXT):
                if _NOTICE_NEXT[key] <= now:
                    del _NOTICE_NEXT[key]
            if _NOTICE_NEXT.get(address, 0) > now:
                result["coalesced"] += 1
                continue
            # Coalesce frequent security changes into a single Audit Trail prompt.
            _NOTICE_NEXT[address] = now + 60
        try:
            queued = queue_email(path, address, "Caffoot Lite account security notice",
                    "An important account, password, email, MFA, role or permission change occurred. "
                    "Active sessions may have ended and MFA may be required before continuing. "
                    "Sign in to your Caffoot Lite installation to review its protected Audit Trail. "
                    "Contact your administrator if you did not expect this change.")
        except Exception:
            queued = False
        result["queued" if queued else "notQueued"] += 1
    return result


def role_change_notifications(connection, path, account_ids):
    """Attempt existing notices after commit without affecting the saved change."""
    from .smtp_settings import public_settings

    result = {"smtpConfigured": False, "eligibleAccountCount": 0,
              "accountCount": len(account_ids), "recipientCount": 0,
              "queued": 0, "coalesced": 0, "notQueued": 0,
              "guidance": "Use Settings → Email/SMTP and verify account email addresses."}
    try:
        recipients = set()
        for account_id in account_ids:
            addresses = security_recipients(connection, account_id)
            result["eligibleAccountCount"] += bool(addresses)
            recipients.update(addresses)
        recipients.update(security_recipients(connection, administrators=True))
        result["recipientCount"] = len(recipients)
        result["smtpConfigured"] = public_settings(path)["configured"]
        if result["smtpConfigured"] and recipients:
            result.update(notify_security_change(path, recipients))
    except Exception:
        # Notification configuration, queue and mail failures cannot undo access.
        result["notQueued"] = result["recipientCount"]
    return result


_ALERT_LOCK = threading.Lock()
_ALERTED_LOGINS = {}


def record_blocked_sign_in(connection, peer, username, *, now=None):
    """Record one blocked-attempt alert per peer/account window, without secrets."""
    from datetime import datetime, timezone
    import json
    now = time.monotonic() if now is None else now
    key = (peer, username.strip().casefold())
    with _ALERT_LOCK:
        for item in list(_ALERTED_LOGINS):
            if _ALERTED_LOGINS[item] <= now - TOKEN_SECONDS:
                del _ALERTED_LOGINS[item]
        if key in _ALERTED_LOGINS:
            return False
        if len(_ALERTED_LOGINS) >= 4096:
            del _ALERTED_LOGINS[min(_ALERTED_LOGINS, key=_ALERTED_LOGINS.get)]
        _ALERTED_LOGINS[key] = now
    event = {"at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
             "actor": "Unauthenticated", "outcome": "Blocked", "reason": "Repeated sign-in failures; temporary login throttle applied",
             "changes": [{"kind": "Security", "action": "Blocked", "label": "Sign In", "fields": []}], "omitted": 0}
    connection.execute("INSERT INTO inventory_change_history(record_json) VALUES(?)", (json.dumps(event),))
    return True
