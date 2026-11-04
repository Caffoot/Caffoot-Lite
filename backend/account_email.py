"""Optional verified-email recovery with single-use, expiring proofs.

Recovery changes a password only; it cannot create a session or change MFA.
Mail is best-effort and bounded so an unavailable server cannot stop normal use.
"""
from concurrent.futures import ThreadPoolExecutor
import hashlib
import secrets
import threading
import time

from .accounts import hash_password, verify_password
from .audit_events import record_actor_event
from .login_throttle import LoginThrottle
from .mfa import verify_code
from .smtp_settings import send_account_email

TOKEN_SECONDS = 15 * 60
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


def _digest(token):
    if not isinstance(token, str) or len(token) != 64:
        raise ValueError("Invalid or expired confirmation")
    return hashlib.sha256(token.encode("ascii")).hexdigest()


def issue_email_proof(connection, account_id, purpose, *, now=None):
    """Invalidate earlier proofs; store only a hash bound to the current address."""
    if purpose not in ("verify", "recover"):
        raise ValueError("Invalid confirmation purpose")
    now = int(time.time() if now is None else now)
    row = connection.execute(
        "SELECT p.email,p.email_verified FROM account_profiles p JOIN accounts a "
        "ON a.id=p.account_id WHERE p.account_id=? AND a.active=1", (account_id,)
    ).fetchone()
    if not row or not row[0] or (purpose == "recover" and not row[1]):
        return None
    token = secrets.token_hex(32)
    connection.execute("DELETE FROM account_email_proofs WHERE account_id=? AND purpose=?", (account_id, purpose))
    connection.execute("DELETE FROM account_email_proofs WHERE expires_at<=?", (now,))
    connection.execute(
        "INSERT INTO account_email_proofs(token_hash,account_id,purpose,email,expires_at) VALUES(?,?,?,?,?)",
        (_digest(token), account_id, purpose, row[0], now + TOKEN_SECONDS),
    )
    return token, row[0]


def confirm_email_proof(connection, token, purpose, *, account_id=None,
                        password=None, mfa_code=None, now=None):
    """Consume a proof atomically, retaining MFA and revoking password sessions."""
    now = int(time.time() if now is None else now)
    digest = _digest(token)
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT t.account_id,t.email,a.username,a.mfa_secret,a.mfa_confirmed,a.is_admin "
            "FROM account_email_proofs t JOIN accounts a ON a.id=t.account_id "
            "JOIN account_profiles p ON p.account_id=a.id "
            "WHERE t.token_hash=? AND t.purpose=? AND t.expires_at>? "
            "AND t.email=p.email AND a.active=1",
            (digest, purpose, now),
        ).fetchone()
        if not row or (account_id is not None and account_id != row[0]):
            raise ValueError("Invalid or expired confirmation")
        target, email, username, secret, confirmed, admin = row
        if purpose == "verify":
            if target != account_id:
                raise PermissionError("Own account required")
            connection.execute("UPDATE account_profiles SET email_verified=1 WHERE account_id=?", (target,))
            reason = "Email ownership verified"
        elif purpose == "recover":
            profile = connection.execute("SELECT email_verified FROM account_profiles WHERE account_id=?", (target,)).fetchone()
            editing = connection.execute("SELECT 1 FROM account_permissions WHERE account_id=? AND level='edit'", (target,)).fetchone()
            if not profile[0] or ((admin or editing or confirmed) and
                                  (not confirmed or not secret or not verify_code(secret, mfa_code, timestamp=now))):
                raise ValueError("Invalid or expired confirmation")
            connection.execute("UPDATE accounts SET password_hash=? WHERE id=?", (hash_password(password), target))
            connection.execute("DELETE FROM account_sessions WHERE account_id=?", (target,))
            reason = "Password recovered using verified email and required authenticator proof"
        else:
            raise ValueError("Invalid confirmation purpose")
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
    for address in recipients:
        now = time.monotonic()
        with _NOTICE_LOCK:
            for key in list(_NOTICE_NEXT):
                if _NOTICE_NEXT[key] <= now:
                    del _NOTICE_NEXT[key]
            if _NOTICE_NEXT.get(address, 0) > now:
                continue
            # Coalesce frequent security changes into a single Audit Trail prompt.
            _NOTICE_NEXT[address] = now + 60
        queue_email(path, address, "Caffoot Lite account security notice",
                    "An important account, password, email, MFA, role or permission change occurred. "
                    "Sign in to your Caffoot Lite installation to review its protected Audit Trail. "
                    "Contact your administrator if you did not expect this change.")


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
