# Shared Roles And Account Permissions

This is work on `milestone-1` under [Batch 01 in issue #351](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790154284). The published release remains v2.1. This development branch is **not ready to deploy**: the later pre-login MFA enrolment flow and approved Users integration are separate batches.

## Database Upgrade

Schema 11 adds `roles`, `role_grants`, `account_roles` and `account_permission_overrides`. Every existing account, including disabled accounts and independent administrators, receives the protected, enabled **Staff Member** role. First-administrator setup and ordinary account creation assign it within the account transaction. This role grants no Devices, IPAM or Racks access and does not create or infer a People link.

Existing Read and Edit rows become matching individual overrides. A previously missing row remains missing: it means **Inherit**, allowing a later authorised role to supply access. Because Staff Member has no inventory grants and no other memberships are added, this cannot initially widen access. Deliberate `deny` overrides are supported separately.

The upgrade runs within the existing single `BEGIN IMMEDIATE` transaction. Before recording version 11, it checks identities and account security fields, exact grant mapping, complete Staff Member membership, absence of additional grants, foreign keys and removal of **all** old sessions. Failure rolls back the complete upgrade, including session removal. Repeated startup does not repeat migration or revoke newly issued sessions. Unsupported newer schemas fail closed.

The old `account_permissions` table is retained for historical inspection. Moving all runtime consumers to the new policy is required before Batch 01 is complete; it must not become a second writable authority.

## Backup And Rollback

Use only disposable, fictional databases for development checks. Before a future authorised deployment, take a consistent private backup of the **entire `/data` directory**, including SQLite, SMTP configuration, the email-proof secret and TLS/private files, and retain the matching v2.1 application image. Rehearse restoration on an isolated copy. A v1.3.3 JSON inventory export cannot restore accounts or these private files.

Rolling back requires restoring that entire matching v2.1 directory and application image together. Never run the v2.1 application against a schema-11 database. See [Database](02-Database.md) and [Account Recovery](Account-Recovery.md).
