"""Offline first-administrator bootstrap and authenticator enrolment.

No HTTP endpoints, sessions, or public registration. Authentication and RBAC
must be completed before this is connected to the application.
"""
import hashlib
import hmac
import secrets

from backend.mfa import new_secret, verify_code

ITERATIONS = 600_000


def hash_password(password):
    if not isinstance(password, str) or not password:
        raise ValueError("Password is required")
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS)
    return "pbkdf2_sha256$%d$%s$%s" % (ITERATIONS, salt.hex(), digest.hex())


def verify_password(password, encoded):
    if not isinstance(password, str) or not isinstance(encoded, str):
        return False
    try:
        method, count, salt, expected = encoded.split("$")
        if method != "pbkdf2_sha256" or int(count) != ITERATIONS:
            return False
        salt_bytes = bytes.fromhex(salt)
        expected_bytes = bytes.fromhex(expected)
        if len(salt_bytes) != 16 or len(expected_bytes) != 32:
            return False
    except (ValueError, TypeError):
        return False
    candidate = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt_bytes, ITERATIONS
    )
    return hmac.compare_digest(candidate, expected_bytes)


def bootstrap_first_admin(connection, username, password):
    """Create only the first administrator; enrolment remains mandatory."""
    if not isinstance(username, str) or not username.strip():
        raise ValueError("Username is required")
    if not isinstance(password, str) or not password:
        raise ValueError("Password is required")
    connection.execute("BEGIN IMMEDIATE")
    try:
        if connection.execute("SELECT 1 FROM accounts LIMIT 1").fetchone():
            raise ValueError("Initial administrator already exists")
        secret = new_secret()
        cursor = connection.execute(
            "INSERT INTO accounts(username,password_hash,is_admin,mfa_secret) "
            "VALUES(?,?,1,?)",
            (username.strip(), hash_password(password), secret),
        )
        connection.commit()
        return cursor.lastrowid, secret
    except BaseException:
        connection.rollback()
        raise


def confirm_admin_mfa(connection, account_id, code, *, timestamp=None):
    """Activate first-admin MFA only after an authenticator code verifies."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        row = connection.execute(
            "SELECT mfa_secret,mfa_confirmed,is_admin,active FROM accounts WHERE id=?",
            (account_id,),
        ).fetchone()
        if row is None or not row[2] or not row[3]:
            raise ValueError("Administrator not found")
        if row[1]:
            raise ValueError("MFA is already enrolled")
        if not verify_code(row[0], code, timestamp=timestamp):
            raise ValueError("Invalid authenticator code")
        connection.execute(
            "UPDATE accounts SET mfa_confirmed=1 WHERE id=?", (account_id,)
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
