"""Offline password changes and MFA enrolment for existing Next accounts.

HTTP authentication/session checks must precede any use of these primitives.
"""
from backend.accounts import hash_password, verify_password
from backend.mfa import new_secret, verify_code


def change_own_password(connection, account_id, current_password, new_password):
    """Require the current password; update the hash in one transaction."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT password_hash,active FROM accounts WHERE id=?", (account_id,)
        ).fetchone()
        if row is None or not row[1] or not verify_password(current_password, row[0]):
            raise PermissionError("Current credentials are invalid")
        new_hash = hash_password(new_password)
        connection.execute(
            "UPDATE accounts SET password_hash=? WHERE id=?", (new_hash, account_id)
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def begin_mfa_enrolment(connection, account_id, password):
    """Generate a pending secret, never mark MFA confirmed before proof."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT password_hash,active,mfa_confirmed FROM accounts WHERE id=?",
            (account_id,),
        ).fetchone()
        if row is None or not row[1] or not verify_password(password, row[0]):
            raise PermissionError("Current credentials are invalid")
        if row[2]:
            raise ValueError("MFA is already enrolled")
        secret = new_secret()
        connection.execute(
            "UPDATE accounts SET mfa_secret=?,mfa_confirmed=0 WHERE id=?",
            (secret, account_id),
        )
        connection.commit()
        return secret
    except BaseException:
        connection.rollback()
        raise


def complete_mfa_enrolment(connection, account_id, code, *, timestamp=None):
    """Confirm a pending authenticator secret only after valid TOTP proof."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT mfa_secret,mfa_confirmed,active FROM accounts WHERE id=?",
            (account_id,),
        ).fetchone()
        if row is None or not row[2] or row[1] or not row[0]:
            raise ValueError("No pending MFA enrolment")
        if not verify_code(row[0], code, timestamp=timestamp):
            raise ValueError("Invalid authenticator code")
        connection.execute(
            "UPDATE accounts SET mfa_confirmed=1 WHERE id=?", (account_id,)
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
