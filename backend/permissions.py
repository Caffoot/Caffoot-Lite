"""Account permissions and administrative safeguards used by the HTTP server.

Callers must establish an active administrator and the required authenticator
protection before passing the actor identity to administrative operations."""
from backend.accounts import hash_password
from backend.audit_events import record_actor_event
from backend.profiles import validate_profile_details
from backend.role_policy import assign_staff_member, evaluate_role_policy, SECTIONS, LEVELS


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


def create_user(connection, actor_id, username, password, profile=None):
    if not isinstance(username, str) or not username.strip():
        raise ValueError("Username is required")
    # Validate before beginning a transaction, so an invalid optional field
    # never creates part of an account or accidentally verifies an email.
    details = validate_profile_details(profile) if profile is not None else None
    connection.execute("BEGIN IMMEDIATE")
    try:
        _admin(connection, actor_id)
        cursor = connection.execute(
            "INSERT INTO accounts(username,password_hash) VALUES(?,?)",
            (username.strip(), hash_password(password)),
        )
        assign_staff_member(connection, cursor.lastrowid)
        if details is not None:
            connection.execute(
                "INSERT INTO account_profiles(account_id,first_name,last_name,"
                "display_name,email,email_verified) VALUES(?,?,?,?,?,0)",
                (cursor.lastrowid, details["firstName"], details["lastName"],
                 details["displayName"], details["email"]),
            )
        record_actor_event(
            connection, actor_id, kind="Account", action="Created",
            label=username.strip(), reason="Account created",
            fields=["Account"] + (["Personal details"] if details is not None else []),
        )
        connection.commit()
        return cursor.lastrowid
    except BaseException:
        connection.rollback()
        raise


def set_permission(connection, actor_id, target_id, section, level, *, session_token=None, proof=None):
    """Require the same reviewed confirmation for older internal callers too."""
    if session_token is None or proof is None:
        raise PermissionError("Role preview and confirmation required")
    from backend.roles import confirm_role_change

    return confirm_role_change(connection, actor_id, session_token,
                               {"type": "override.set", "userId": target_id,
                                "section": section, "level": level}, proof)


def can_access(connection, account_id, section, *, edit=False):
    return feature_enabled(connection, section) and evaluate_role_policy(
        connection, account_id).allows(section, edit=edit)


def feature_enabled(connection, section):
    """Unknown or missing organisation choices deny access, including for admins."""
    feature = {"Devices": "devices", "IPAM": "ipam", "Racks": "racks"}.get(section)
    if feature is None:
        return False
    return connection.execute(
        "SELECT enabled FROM organisation_features WHERE feature=?", (feature,)
    ).fetchone() == (1,)


def set_account_active(connection, actor_id, target_id, active):
    if not isinstance(active, bool):
        raise ValueError("Invalid account status")
    connection.execute("BEGIN IMMEDIATE")
    try:
        _admin(connection, actor_id)
        _target(connection, target_id)
        if actor_id == target_id:
            raise ValueError("Administrators cannot disable themselves")
        target_admin, target_active = _target(connection, target_id)
        target_name = connection.execute(
            "SELECT username FROM accounts WHERE id=?", (target_id,)
        ).fetchone()[0]
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
        if not active:
            connection.execute("DELETE FROM account_email_proofs WHERE account_id=?", (target_id,))
        if bool(target_active) != active:
            record_actor_event(
                connection, actor_id, kind="Account", action="Updated",
                label=target_name, reason="Account status changed",
                fields=["Account status"],
                before={"Account status": "Active" if target_active else "Disabled"},
                after={"Account status": "Active" if active else "Disabled"},
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
        target_name = connection.execute(
            "SELECT username FROM accounts WHERE id=?", (target_id,)
        ).fetchone()[0]
        if actor_id == target_id:
            raise ValueError("Administrators cannot delete themselves")
        target_admin, target_active = _target(connection, target_id)
        if target_admin and target_active and connection.execute(
            "SELECT count(*) FROM accounts WHERE is_admin=1 AND active=1"
        ).fetchone()[0] <= 1:
            raise ValueError("Cannot delete the last active administrator")
        connection.execute("DELETE FROM account_permission_overrides WHERE account_id=?", (target_id,))
        connection.execute("DELETE FROM account_roles WHERE account_id=?", (target_id,))
        connection.execute("DELETE FROM accounts WHERE id=?", (target_id,))
        record_actor_event(
            connection, actor_id, kind="Account", action="Deleted",
            label=target_name, reason="Account deleted", fields=["Account"],
        )
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
        target_name = connection.execute(
            "SELECT username FROM accounts WHERE id=?", (target_id,)
        ).fetchone()[0]
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
        if bool(target_admin) != is_admin:
            record_actor_event(
                connection, actor_id, kind="Account", action="Updated",
                label=target_name, reason="Administrator role changed",
                fields=["Administrator role"],
                before={"Administrator role": "Administrator" if target_admin else "User"},
                after={"Administrator role": "Administrator" if is_admin else "User"},
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
