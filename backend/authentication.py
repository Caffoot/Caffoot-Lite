"""Credential verification called by the session and authenticated request code.

This module does not issue sessions or HTTP responses. The surrounding request
service supplies throttling, secure cookies and request-forgery protection."""
from backend.accounts import verify_password
from backend.mfa import verify_code
from backend.role_policy import evaluate_role_policy

# Hash dummy credentials even when the username does not exist, avoiding an
# obvious fast-path for account enumeration.
_DUMMY_HASH = "pbkdf2_sha256$600000$00000000000000000000000000000000$" + "00" * 32


class MFAEnrolmentRequired(Exception):
    """A valid password requires authenticator setup before a session is allowed."""


def verify_active_password(connection, username, password):
    """Check a password without revealing whether an unknown account exists."""
    if not isinstance(username, str) or not username.strip():
        return None
    if not isinstance(password, str):
        return None
    row = connection.execute(
        "SELECT id,password_hash,active FROM accounts WHERE username=? COLLATE NOCASE",
        (username.strip(),),
    ).fetchone()
    password_ok = verify_password(password, row[1] if row else _DUMMY_HASH)
    return row[0] if row and password_ok and row[2] else None


def authenticate(connection, username, password, *, mfa_code=None, timestamp=None,
                 report_enrolment=False):
    """Return an active account ID only after required credential proofs.

    Wider Read or Edit access, additional enabled roles and administrators
    require MFA. Staff Member alone may use a password unless already enrolled.
    """
    account_id = verify_active_password(connection, username, password)
    if account_id is None:
        return None
    row = connection.execute(
        "SELECT mfa_secret,mfa_confirmed FROM accounts WHERE id=?", (account_id,)
    ).fetchone()
    if row is None:
        return None
    secret, confirmed = row
    policy = evaluate_role_policy(connection, account_id)
    if not policy.active:
        return None
    if policy.requires_mfa:
        if report_enrolment and policy.mfa_mandatory and not confirmed:
            raise MFAEnrolmentRequired()
        if not confirmed or not secret or not verify_code(secret, mfa_code, timestamp=timestamp):
            return None
    return account_id
