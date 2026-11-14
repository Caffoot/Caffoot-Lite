"""Shared account role rules used by account creation and access checks."""
from dataclasses import dataclass

STAFF_ROLE_KEY = "staff_member"
SECTIONS = ("Devices", "IPAM", "Racks", "Staff Members", "Departments", "IT Assets")
LEVELS = ("read", "edit")


@dataclass(frozen=True)
class AccountRolePolicy:
    """Keep configured access separate from access allowed before MFA enrolment."""

    active: bool
    is_admin: bool
    mfa_enrolled: bool
    requires_mfa: bool
    permissions: dict
    mfa_mandatory: bool = False

    def allows(self, section, *, edit=False):
        """Check the account's section access, including its sign-in safeguards."""
        if section not in SECTIONS or not self.active:
            return False
        if self.requires_mfa and not self.mfa_enrolled:
            return False
        if self.is_admin:
            return True
        level = self.permissions.get(section)
        return level == "edit" if edit else level in LEVELS


def evaluate_role_policy(connection, account_id):
    """Combine enabled roles, then apply each deliberate individual choice.

    Missing overrides inherit the highest role grant. An explicit No Access
    blocks it, while Read or Edit replaces it. Unknown sections never grant
    access. An enrolled authenticator remains required even if grants change.
    """
    account = connection.execute(
        "SELECT active,is_admin,mfa_confirmed,mfa_secret FROM accounts WHERE id=?",
        (account_id,),
    ).fetchone()
    if account is None:
        return AccountRolePolicy(False, False, False, False, {})
    permissions = {}
    additional_role = False
    for section, level in connection.execute(
        "SELECT g.section,g.level FROM account_roles a JOIN roles r ON r.id=a.role_id "
        "LEFT JOIN role_grants g ON g.role_id=r.id "
        "WHERE a.account_id=? AND r.enabled=1 AND r.role_key!=?",
        (account_id, STAFF_ROLE_KEY),
    ):
        additional_role = True
        if section in SECTIONS and (level == "edit" or section not in permissions):
            permissions[section] = level
    for section, level in connection.execute(
        "SELECT section,level FROM account_permission_overrides WHERE account_id=?",
        (account_id,),
    ):
        if section not in SECTIONS:
            continue
        if level == "deny":
            permissions.pop(section, None)
        else:
            permissions[section] = level
    enrolled = bool(account[2] and account[3])
    mandatory = bool(account[1] or additional_role or permissions)
    return AccountRolePolicy(
        bool(account[0]), bool(account[1]), enrolled,
        bool(mandatory or account[2]), permissions, mandatory,
    )


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
