# Roles, Section Permissions And MFA

> **Draft v2.2 — Not Published / Not Production Guidance.** This guide includes the separate Batch 3.6 review branch (schema 16), based on `milestone-1` at `2e6c50ba4777b7500258d2a1a28317764d806020`. Batch 3.6 is not merged or released. Batch 3.4 manual acceptance remains deferred. Use the published v2.1 guides for production; these are not installation, upgrade or restore instructions.

Only authorised administrators manage Caffoot accounts, roles, section permissions and MFA administration through **Staff → Permissions**. Directory editing is not account administration.

## Independent Section Access

The existing permission controls cover **Devices**, **IPAM**, **Racks**, **Staff Members**, **Departments** and **IT Assets**. The Racks permission controls access to Network Racks. Each section has No Access, Read or Edit rights. Read does not permit writes.

- **Staff Members** and **Departments** are core sections, but still require their own permissions.
- **Devices**, **IPAM** and **Network Racks** also require their organisation feature switches to be enabled.
- **IT Assets** uses its own organisation switch and existing Read/Edit rights on the Batch 3.6 review branch. The switch defaults off and a grant cannot enable it. Enabling the switch grants no Staff Members, Departments or Devices access. Stock screens and actions are not available yet.
- **Devices Edit** permits eligible initial Device assignments. Its restricted recipient search does not grant access to Staff contacts, general directory records or account details.
- A normal linked employee can use **My Equipment** without inventory Read/Edit. Department membership gives no general section access.

## Roles And Individual Choices

Every ordinary account receives the protected **Staff Member** baseline role. It grants no general section access. **IT Staff** is an additional configurable built-in role; Administrator is a separate account status. Administrators can also manage custom roles.

Enabled roles contribute their grants; the highest inherited access applies. An individual **No Access**, **Read** or **Edit** override takes precedence. **Inherit** resumes using role grants. Disabling a role retains its settings and memberships but stops its grants contributing.

In **Permissions**, use **Manage Roles** for role settings or **User List → Manage User** for an account's memberships and individual choices. Read **Review Access Change** before selecting **Confirm Change**. Cancel saves nothing. If the preview becomes outdated, review the refreshed consequences and confirm again. The preview explains session and MFA effects; account access changes can end sessions and require a fresh sign-in.

## MFA And Personal Access

MFA means multi-factor authentication: a password plus an authenticator code. Administrator status, any enabled additional role, or wider effective section access requires MFA. Existing voluntary enrolment also remains required until eligible removal is completed.

Follow the existing enrolment prompt, then sign in again with the password and current code. In **My Account → Security**, eligible users can choose **Remove MFA** and confirm with their current password and code. Required MFA cannot be removed. Successful removal ends sessions and requires sign-in again.

Staff-only users retain personal/account access and [My Equipment](Device-Assignments-and-My-Equipment.md). Users granted only Staff Members or Departments Read can enter that permitted workspace without loading Devices, IPAM or Racks data. Staff profile status and login enabled/disabled status remain independent.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
