"""Credential verification called by the session and authenticated request code.

This module does not issue sessions or HTTP responses. The surrounding request
service supplies throttling, secure cookies and request-forgery protection."""
import hmac
from backend.accounts import verify_password
from backend.mfa import verify_code
from backend.role_policy import evaluate_role_policy

# Hash dummy credentials even when the username does not exist, avoiding an
# obvious fast-path for account enumeration.
_DUMMY_HASH = "pbkdf2_sha256$600000$00000000000000000000000000000000$" + "00" * 32


def authenticate(connection, username, password, *, mfa_code=None, timestamp=None):
    """Return an active account ID only after required credential proofs.

    Wider Read or Edit access, additional enabled roles and administrators
    require MFA. Staff Member alone may use a password unless already enrolled.
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
    account_id, _, _, secret, confirmed, _ = row
    policy = evaluate_role_policy(connection, account_id)
    if not policy.active:
        return None
    if policy.requires_mfa:
        if not confirmed or not secret or not verify_code(secret, mfa_code, timestamp=timestamp):
            return None
    return account_id
