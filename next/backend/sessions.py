"""Opaque, expiring SQLite-backed session primitives; no HTTP routes yet.

Raw bearer tokens are returned once, never stored in the database. The future
HTTP layer must use secure HttpOnly SameSite cookies, CSRF defences, TLS at the
reverse proxy, request throttling, and logout/session invalidation.
"""
import hashlib
import secrets
import time

from backend.authentication import authenticate

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
    editing = connection.execute(
        "SELECT 1 FROM account_permissions WHERE account_id=? AND level='edit' LIMIT 1",
        (row[0],),
    ).fetchone() is not None
    if (row[2] or editing) and not row[3]:
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
