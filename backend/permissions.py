"""Offline account permissions and administrative safeguards.

This module is not connected to HTTP. All callers must authenticate an active
MFA-verified administrator before passing their account ID.
"""
from backend.accounts import hash_password

SECTIONS = ("Devices", "IPAM", "Racks")
LEVELS = ("read", "edit")


def _admin(connection, actor_id):
    row = connection.execute(
        "SELECT is_admin,active,mfa_confirmed FROM accounts WHERE id=?",
        (actor_id,),
    ).fetchone()
    if row != (1, 1, 1):
        raise PermissionError("Verified active administrator required")


def _target(connection, target_id):
    row = connection.execute(
        "SELECT is_admin,active FROM accounts WHERE id=?", (target_id,)
    ).fetchone()
    if row is None:
        raise ValueError("Account not found")
    return row


def create_user(connection, actor_id, username, password):
    if not isinstance(username, str) or not username.strip():
        raise ValueError("Username is required")
    connection.execute("BEGIN IMMEDIATE")
    try:
        _admin(connection, actor_id)
        cursor = connection.execute(
            "INSERT INTO accounts(username,password_hash) VALUES(?,?)",
            (username.strip(), hash_password(password)),
        )
        connection.commit()
        return cursor.lastrowid
    except BaseException:
        connection.rollback()
        raise


def set_permission(connection, actor_id, target_id, section, level):
    if section not in SECTIONS or level not in (*LEVELS, None):
        raise ValueError("Invalid section or permission")
    connection.execute("BEGIN IMMEDIATE")
    try:
        _admin(connection, actor_id)
        _target(connection, target_id)
        if level == "edit":
            enrolled = connection.execute(
                "SELECT mfa_confirmed FROM accounts WHERE id=?", (target_id,)
            ).fetchone()[0]
            if not enrolled:
                raise ValueError("MFA enrolment required for editing")
        if level is None:
            connection.execute(
                "DELETE FROM account_permissions WHERE account_id=? AND section=?",
                (target_id, section),
            )
        else:
            connection.execute(
                "INSERT INTO account_permissions(account_id,section,level) "
                "VALUES(?,?,?) ON CONFLICT(account_id,section) "
                "DO UPDATE SET level=excluded.level",
                (target_id, section, level),
            )
        connection.execute(
            "DELETE FROM account_sessions WHERE account_id=?", (target_id,)
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def can_access(connection, account_id, section, *, edit=False):
    if section not in SECTIONS:
        return False
    row = connection.execute(
        "SELECT active,is_admin,mfa_confirmed FROM accounts WHERE id=?",
        (account_id,),
    ).fetchone()
    if not row or not row[0]:
        return False
    if row[1]:
        return bool(row[2])
    permission = connection.execute(
        "SELECT level FROM account_permissions WHERE account_id=? AND section=?",
        (account_id, section),
    ).fetchone()
    if not permission:
        return False
    if edit:
        return permission[0] == "edit" and bool(row[2])
    return permission[0] in LEVELS and (permission[0] != "edit" or bool(row[2]))


def set_account_active(connection, actor_id, target_id, active):
    if not isinstance(active, bool):
        raise ValueError("Invalid account status")
    connection.execute("BEGIN IMMEDIATE")
    try:
        _admin(connection, actor_id)
        _target(connection, target_id)
        if actor_id == target_id:
            raise ValueError("Administrators cannot disable themselves")
        target_admin, _ = _target(connection, target_id)
        if not active and target_admin and connection.execute(
            "SELECT count(*) FROM accounts WHERE is_admin=1 AND active=1"
        ).fetchone()[0] <= 1:
            raise ValueError("Cannot disable the last active administrator")
        connection.execute(
            "UPDATE accounts SET active=? WHERE id=?", (int(active), target_id)
        )
        connection.execute(
            "DELETE FROM account_sessions WHERE account_id=?", (target_id,)
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def delete_user(connection, actor_id, target_id):
    connection.execute("BEGIN IMMEDIATE")
    try:
        _admin(connection, actor_id)
        _target(connection, target_id)
        if actor_id == target_id:
            raise ValueError("Administrators cannot delete themselves")
        target_admin, target_active = _target(connection, target_id)
        if target_admin and target_active and connection.execute(
            "SELECT count(*) FROM accounts WHERE is_admin=1 AND active=1"
        ).fetchone()[0] <= 1:
            raise ValueError("Cannot delete the last active administrator")
        connection.execute("DELETE FROM account_permissions WHERE account_id=?", (target_id,))
        connection.execute("DELETE FROM accounts WHERE id=?", (target_id,))
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def set_administrator(connection, actor_id, target_id, is_admin):
    """Manage administrator status without self-demotion or last-admin removal."""
    if not isinstance(is_admin, bool):
        raise ValueError("Invalid administrator status")
    connection.execute("BEGIN IMMEDIATE")
    try:
        _admin(connection, actor_id)
        target_admin, target_active = _target(connection, target_id)
        if not is_admin and actor_id == target_id:
            raise ValueError("Administrators cannot demote themselves")
        if is_admin and not connection.execute(
            "SELECT mfa_confirmed FROM accounts WHERE id=?", (target_id,)
        ).fetchone()[0]:
            raise ValueError("MFA enrolment required for administrators")
        if target_admin and target_active and not is_admin and connection.execute(
            "SELECT count(*) FROM accounts WHERE is_admin=1 AND active=1"
        ).fetchone()[0] <= 1:
            raise ValueError("Cannot demote the last active administrator")
        connection.execute(
            "UPDATE accounts SET is_admin=? WHERE id=?", (int(is_admin), target_id)
        )
        connection.execute(
            "DELETE FROM account_sessions WHERE account_id=?", (target_id,)
        )
        connection.commit()
    except BaseException:
        connection.rollback()
        raise


def can_replace_inventory(connection, account_id):
    """Full v1.3.3 import replaces Devices, IPAM and Racks together.

    Reuse established section permissions; never allow a partial-section
    editor to replace inventory belonging to other sections.
    Authentication and CSRF checks remain the responsibility of the request
    boundary. No import route or persistence is enabled by this predicate.
    """
    return all(can_access(connection, account_id, section, edit=True)
               for section in SECTIONS)
