"""Offline credential verification for Next accounts.

This module does not issue sessions, tokens or HTTP responses. The future
authenticated service must add throttling, secure cookies and CSRF protection.
"""
import hmac
from backend.accounts import verify_password
from backend.mfa import verify_code

# Hash dummy credentials even when the username does not exist, avoiding an
# obvious fast-path for account enumeration.
_DUMMY_HASH = "pbkdf2_sha256$600000$00000000000000000000000000000000$" + "00" * 32


def authenticate(connection, username, password, *, mfa_code=None, timestamp=None):
    """Return an active account ID only after required credential proofs.

    All admins and all accounts holding edit access require confirmed MFA.
    Read-only users may authenticate with their password alone.
    """
    if not isinstance(username, str) or not username.strip():
        return None
    if not isinstance(password, str):
        return None
    row = connection.execute(
        "SELECT id,password_hash,is_admin,mfa_secret,mfa_confirmed,active "
        "FROM accounts WHERE username=? COLLATE NOCASE", (username.strip(),)
    ).fetchone()
    encoded = row[1] if row else _DUMMY_HASH
    password_ok = verify_password(password, encoded)
    if not row or not password_ok or not row[5]:
        return None
    account_id, _, admin, secret, confirmed, _ = row
    editing = connection.execute(
        "SELECT 1 FROM account_permissions WHERE account_id=? AND level='edit' LIMIT 1",
        (account_id,),
    ).fetchone() is not None
    requires_mfa = bool(admin or editing or confirmed)
    if requires_mfa:
        if not confirmed or not secret or not verify_code(secret, mfa_code, timestamp=timestamp):
            return None
    return account_id
