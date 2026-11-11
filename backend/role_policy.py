"""Shared account role rules used by account creation and access checks."""

STAFF_ROLE_KEY = "staff_member"
SECTIONS = ("Devices", "IPAM", "Racks")
LEVELS = ("read", "edit")


def assign_staff_member(connection, account_id):
    """Assign the protected baseline within the caller's account transaction."""
    role = connection.execute(
        "SELECT id FROM roles WHERE role_key=? AND enabled=1 AND is_builtin=1",
        (STAFF_ROLE_KEY,),
    ).fetchone()
    if role is None:
        raise RuntimeError("Protected Staff Member role is missing")
    connection.execute(
        "INSERT INTO account_roles(account_id,role_id) VALUES(?,?)", (account_id, role[0])
    )
