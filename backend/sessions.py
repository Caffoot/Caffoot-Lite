"""Opaque, expiring SQLite sessions for the authenticated HTTPS service.

Raw bearer tokens are returned once and only their digests are stored. The
HTTP layer supplies secure cookies, origin/request-proof checks, throttling
and logout; account security changes revoke affected sessions."""
import hashlib
import hmac
import json
import secrets
import sqlite3
import time

from backend.accounts import hash_password, verify_password
from backend.audit_events import record_actor_event
from backend.authentication import authenticate
from backend.role_policy import evaluate_role_policy

SESSION_SECONDS = 12 * 60 * 60
PASSWORD_CHANGE_SECONDS = 5 * 60


class PasswordChangeRequired(Exception):
    """Full sign-in proof allows only a temporary password change."""

    def __init__(self, proof):
        super().__init__('Password change required')
        self.proof = proof


def _digest(token):
    if not isinstance(token, str) or len(token) != 64:
        return None
    try:
        bytes.fromhex(token)
    except ValueError:
        return None
    return hashlib.sha256(token.encode("ascii")).hexdigest()


def password_change_state_available(connection):
    """Identify accounts written before the additive schema 30 migration."""
    if connection.execute(
        "SELECT 1 FROM pragma_table_info('accounts') WHERE name='must_change_password'"
    ).fetchone():
        return True
    if connection.execute('SELECT 1 FROM schema_migrations WHERE version>=30').fetchone():
        raise sqlite3.DatabaseError('Schema 30 account security state is unavailable')
    return False


def revoke_password_change_proof(connection, account_id):
    if password_change_state_available(connection):
        connection.execute('DELETE FROM account_password_change_proofs WHERE account_id=?', (account_id,))


def login_session(connection, username, password, *, mfa_code=None, now=None,
                  report_enrolment=False, report_mfa_challenge=False,
                  report_password_change=False):
    """Issue a fresh session only after credential and MFA verification."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        now = time.time() if now is None else now
        # Check credentials and current access together, so account changes cannot
        # slip between verification and creation of the session.
        account_id = authenticate(
            connection, username, password, mfa_code=mfa_code, timestamp=now,
            report_enrolment=report_enrolment, report_mfa_challenge=report_mfa_challenge,
        )
        if account_id is None:
            connection.rollback()
            return None
        pending = password_change_state_available(connection) and connection.execute(
            'SELECT must_change_password FROM accounts WHERE id=?', (account_id,)
        ).fetchone()[0]
        if pending:
            if not report_password_change:
                connection.rollback()
                return None
            token = _issue_password_change_proof(connection, account_id, now)
        else:
            token = secrets.token_hex(32)
            connection.execute(
                "INSERT INTO account_sessions(token_hash,account_id,expires_at,created_at) "
                "VALUES(?,?,?,?)",
                (_digest(token), account_id, int(now) + SESSION_SECONDS, int(now)),
            )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
    if pending:
        raise PasswordChangeRequired(token)
    return token


def _password_change_account(connection, account_id):
    row = connection.execute(
        'SELECT username,password_hash,mfa_secret,mfa_confirmed FROM accounts '
        'WHERE id=? AND active=1 AND is_admin=0 AND must_change_password=1', (account_id,),
    ).fetchone()
    if row is None:
        raise PermissionError('Password change proof no longer valid')
    policy = evaluate_role_policy(connection, account_id)
    if policy.requires_mfa and not policy.mfa_enrolled:
        raise PermissionError('Password change proof no longer valid')
    # Bind the proof to the current credentials and policy without storing
    # a second copy of either the password hash or authenticator secret.
    state = json.dumps([row, policy.requires_mfa, policy.mfa_mandatory, policy.permissions], sort_keys=True)
    return row[0], row[1], hashlib.sha256(state.encode()).hexdigest()


def _issue_password_change_proof(connection, account_id, now):
    _, _, state = _password_change_account(connection, account_id)
    proof = secrets.token_hex(32)
    connection.execute('DELETE FROM account_password_change_proofs WHERE expires_at<=?', (now,))
    connection.execute(
        'INSERT INTO account_password_change_proofs(account_id,token_hash,account_state,expires_at) VALUES(?,?,?,?) '
        'ON CONFLICT(account_id) DO UPDATE SET token_hash=excluded.token_hash, '
        'account_state=excluded.account_state,expires_at=excluded.expires_at',
        (account_id, _digest(proof), state, int(now) + PASSWORD_CHANGE_SECONDS),
    )
    return proof


def complete_password_change(connection, proof, password, confirmation, *, now=None):
    digest = _digest(proof)
    if digest is None:
        raise PermissionError('Password change proof no longer valid')
    connection.execute('BEGIN IMMEDIATE')
    try:
        now = time.time() if now is None else now
        row = connection.execute(
            'SELECT account_id,account_state FROM account_password_change_proofs '
            'WHERE token_hash=? AND expires_at>?', (digest, now),
        ).fetchone()
        if row is None:
            raise PermissionError('Password change proof no longer valid')
        account_id, expected_state = row
        username, current_hash, state = _password_change_account(connection, account_id)
        if not hmac.compare_digest(state, expected_state):
            raise PermissionError('Password change proof no longer valid')
        if password != confirmation:
            raise ValueError('The passwords do not match.')
        if verify_password(password, current_hash):
            raise ValueError('Choose a password different from your temporary password.')
        connection.execute('UPDATE accounts SET password_hash=?,must_change_password=0 WHERE id=?',
                           (hash_password(password), account_id))
        connection.execute('DELETE FROM account_password_change_proofs WHERE account_id=?', (account_id,))
        connection.execute('DELETE FROM account_email_proofs WHERE account_id=?', (account_id,))
        connection.execute('DELETE FROM account_sessions WHERE account_id=?', (account_id,))
        record_actor_event(connection, account_id, kind='Security', action='Updated', label=username,
                           reason='Temporary password changed', fields=['Password', 'Mandatory password change'])
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def session_account(connection, token, *, now=None):
    """Resolve a live session; re-check account and current MFA requirements."""
    digest = _digest(token)
    if digest is None:
        return None
    if now is None:
        now = time.time()
    pending_guard = ' AND a.must_change_password=0' if password_change_state_available(connection) else ''
    row = connection.execute(
        "SELECT a.id,a.active,a.is_admin,a.mfa_confirmed,s.expires_at "
        "FROM account_sessions s JOIN accounts a ON a.id=s.account_id "
        "WHERE s.token_hash=?" + pending_guard, (digest,)
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
