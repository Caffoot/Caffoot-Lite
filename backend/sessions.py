"""Opaque, expiring SQLite sessions for the authenticated HTTPS service.

Raw bearer tokens are returned once and only their digests are stored. The
HTTP layer supplies secure cookies, origin/request-proof checks, throttling
and logout; account security changes revoke affected sessions."""
import hashlib
import secrets
import time

from backend.authentication import authenticate
from backend.role_policy import evaluate_role_policy

SESSION_SECONDS = 12 * 60 * 60


def _digest(token):
    if not isinstance(token, str) or len(token) != 64:
        return None
    try:
        bytes.fromhex(token)
    except ValueError:
        return None
    return hashlib.sha256(token.encode("ascii")).hexdigest()


def login_session(connection, username, password, *, mfa_code=None, now=None):
    """Issue a fresh session only after credential and MFA verification."""
    if now is None:
        now = time.time()
    account_id = authenticate(
        connection, username, password, mfa_code=mfa_code, timestamp=now
    )
    if account_id is None:
        return None
    token = secrets.token_hex(32)
    connection.execute("BEGIN IMMEDIATE")
    try:
        connection.execute(
            "INSERT INTO account_sessions(token_hash,account_id,expires_at,created_at) "
            "VALUES(?,?,?,?)",
            (_digest(token), account_id, int(now) + SESSION_SECONDS, int(now)),
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
    return token


def session_account(connection, token, *, now=None):
    """Resolve a live session; re-check account and current MFA requirements."""
    digest = _digest(token)
    if digest is None:
        return None
    if now is None:
        now = time.time()
    row = connection.execute(
        "SELECT a.id,a.active,a.is_admin,a.mfa_confirmed,s.expires_at "
        "FROM account_sessions s JOIN accounts a ON a.id=s.account_id "
        "WHERE s.token_hash=?", (digest,)
    ).fetchone()
    if not row or not row[1] or row[4] <= now:
        return None
    policy = evaluate_role_policy(connection, row[0])
    if not policy.active or (policy.requires_mfa and not policy.mfa_enrolled):
        return None
    return row[0]


def logout_session(connection, token):
    """Revoke exactly one session; invalid or unknown tokens are harmless."""
    digest = _digest(token)
    if digest is None:
        return
    connection.execute("DELETE FROM account_sessions WHERE token_hash=?", (digest,))
    connection.commit()


def revoke_account_sessions(connection, account_id):
    """Invalidate all sessions after security-sensitive account changes."""
    connection.execute("DELETE FROM account_sessions WHERE account_id=?", (account_id,))
    connection.commit()
