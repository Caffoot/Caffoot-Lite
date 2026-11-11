# Shared Roles And Account Permissions

This is work on `milestone-1` under [Batch 01 in issue #351](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790154284). The published release remains v2.1. This development branch is **not ready to deploy**: the later pre-login MFA enrolment flow and approved Users integration are separate batches.

## Database Upgrade

Schema 11 adds `roles`, `role_grants`, `account_roles` and `account_permission_overrides`. Every existing account, including disabled accounts and independent administrators, receives the protected, enabled **Staff Member** role. First-administrator setup and ordinary account creation assign it within the account transaction. This role grants no Devices, IPAM or Racks access and does not create or infer a People link.

Existing Read and Edit rows become matching individual overrides. A previously missing row remains missing: it means **Inherit**, allowing a later authorised role to supply access. Because Staff Member has no inventory grants and no other memberships are added, this cannot initially widen access. Deliberate `deny` overrides are supported separately.

The upgrade runs within the existing single `BEGIN IMMEDIATE` transaction. Before recording version 11, it checks identities and account security fields, exact grant mapping, complete Staff Member membership, absence of additional grants, foreign keys and removal of **all** old sessions. Failure rolls back the complete upgrade, including session removal. Repeated startup does not repeat migration or revoke newly issued sessions. Unsupported newer schemas fail closed.

The old `account_permissions` table is retained for historical inspection. Runtime access checks, sign-in, session resolution, email recovery and the Users response now use `role_policy.py:evaluate_role_policy`. Permission changes write only `account_permission_overrides`. Deleting an account still allows its historical rows to be removed by the existing foreign-key relationship; they never supply access.

## Access And MFA

The shared policy takes the highest Read/Edit grant across enabled additional roles, then applies any individual override. A deliberate No Access (`deny`) blocks inherited access; Read or Edit sets that exact level. Disabled roles contribute neither grants nor an MFA requirement. Unknown sections are ignored until registered by the server, and newly registered sections start without ordinary-user access. Staff Member cannot hold inventory grants or be renamed, disabled or deleted; role keys cannot change.

Protected Administrator remains a separate account flag. It retains its existing inventory access after MFA, including where an individual section override would restrict an ordinary user. Disabled accounts and unknown sections are denied. Existing checks for related Devices, IPAM and Racks actions, edit reservations, imports and last-administrator protection remain in force.

MFA is required by any enabled additional role (even one with no grants), any effective wider Read **or** Edit grant, or independent Administrator status. Once enrolled voluntarily, an account must continue supplying authenticator codes even if its permissions are removed. Configured permissions are available to administrator account inspection while access remains blocked pending enrolment. Sign-in, live sessions, recovery and section access all use the same policy.

The existing Users interface and request shape are preserved. Its No Access control still sends `null`; the server adapter stores that deliberate choice as `deny`. The internal `set_permission(..., None)` restores Inherit by deleting the override. The existing Users response keeps its positive `permissions` map, now resolved from roles and overrides; the later approved role-management interface will distinguish inherited, configured and exercisable access explicitly. No role-management API is introduced here.

Existing Edit grants still require completed MFA before they can be assigned through the current account controls. A Read grant may be configured while enrolment is pending, but it cannot give an unenrolled account an application session or inventory access. Previously unenrolled legacy readers therefore cannot complete ordinary sign-in in this intermediate build. The restricted pre-login enrolment routes are the separately authorised Batch 02 dependency; do not bypass the requirement or deploy this batch alone.

## Backup And Rollback

Use only disposable, fictional databases for development checks. Before a future authorised deployment, take a consistent private backup of the **entire `/data` directory**, including SQLite, SMTP configuration, the email-proof secret and TLS/private files, and retain the matching v2.1 application image. Rehearse restoration on an isolated copy. A v1.3.3 JSON inventory export cannot restore accounts or these private files.

Rolling back requires restoring that entire matching v2.1 directory and application image together. Never run the v2.1 application against a schema-11 database. See [Database](02-Database.md) and [Account Recovery](Account-Recovery.md).
