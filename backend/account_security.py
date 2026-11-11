"""Password changes and MFA enrolment/removal for existing accounts.

The HTTP server checks origin and request limits. Signed-in operations use
session-bound request proof; pre-login enrolment rechecks the password."""
from backend.accounts import hash_password, verify_password
from backend.authentication import verify_active_password
from backend.audit_events import record_actor_event
from backend.mfa import new_secret, verify_code
from backend.role_policy import evaluate_role_policy
from backend.sessions import session_account


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
        connection.execute(
            "DELETE FROM account_sessions WHERE account_id=?", (account_id,)
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


def _pending_mandatory_mfa_account(connection, username, password):
    """Recheck the password and current setup requirement while writes are locked."""
    account_id = verify_active_password(connection, username, password)
    policy = evaluate_role_policy(connection, account_id)
    row = connection.execute(
        "SELECT username,mfa_secret,mfa_confirmed FROM accounts WHERE id=?",
        (account_id,),
    ).fetchone()
    if not row or not policy.active or not policy.mfa_mandatory or row[2]:
        raise PermissionError("Invalid credentials or MFA request")
    return account_id, row[0], row[1]


def start_required_mfa_enrolment(connection, username, password):
    """Return a pending authenticator only after fresh, eligible password proof."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        account_id, account_name, secret = _pending_mandatory_mfa_account(
            connection, username, password,
        )
        if not secret:
            secret = new_secret()
            connection.execute(
                "UPDATE accounts SET mfa_secret=? WHERE id=?", (secret, account_id),
            )
        connection.commit()
        return account_name, secret
    except BaseException:
        connection.rollback()
        raise


def _record_mfa_change(connection, account_id, *, enrolled):
    """Record only the enrolment status, then revoke sessions and email proofs."""
    username = connection.execute(
        "SELECT username FROM accounts WHERE id=?", (account_id,),
    ).fetchone()[0]
    record_actor_event(
        connection, account_id, kind="Security", action="Updated", label=username,
        reason="MFA enrolment confirmed" if enrolled else "MFA removed by account owner",
        fields=["Multi-factor authentication"],
        before={"MFA status": "Not enrolled" if enrolled else "Enabled"},
        after={"MFA status": "Enabled" if enrolled else "Not enrolled"},
    )
    connection.execute("DELETE FROM account_sessions WHERE account_id=?", (account_id,))
    connection.execute("DELETE FROM account_email_proofs WHERE account_id=?", (account_id,))


def confirm_required_mfa_enrolment(connection, username, password, code, *, timestamp=None):
    """Confirm password and authenticator together; require a fresh normal sign-in."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        account_id, _, secret = _pending_mandatory_mfa_account(connection, username, password)
        if not secret or not verify_code(secret, code, timestamp=timestamp):
            raise PermissionError("Invalid credentials or MFA request")
        connection.execute("UPDATE accounts SET mfa_confirmed=1 WHERE id=?", (account_id,))
        _record_mfa_change(connection, account_id, enrolled=True)
        connection.commit()
        return account_id
    except BaseException:
        connection.rollback()
        raise


def remove_own_mfa(connection, account_id, password, code, *, session_token, timestamp=None):
    """Allow an eligible account owner to remove MFA with both current proofs."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        policy = evaluate_role_policy(connection, account_id)
        row = connection.execute(
            "SELECT password_hash,mfa_secret FROM accounts WHERE id=?", (account_id,),
        ).fetchone()
        if (not row or not policy.active or not policy.mfa_enrolled
                or policy.mfa_mandatory
                or session_account(connection, session_token, now=timestamp) != account_id
                or not verify_password(password, row[0])
                or not verify_code(row[1], code, timestamp=timestamp)):
            raise PermissionError("Invalid credentials or MFA request")
        connection.execute(
            "UPDATE accounts SET mfa_secret=NULL,mfa_confirmed=0 WHERE id=?", (account_id,),
        )
        _record_mfa_change(connection, account_id, enrolled=False)
        connection.commit()
    except BaseException:
        connection.rollback()
        raise
