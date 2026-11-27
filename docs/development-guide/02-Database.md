# 02 — SQLite database

> **Version boundary:** Published v2.1 uses schema 10. The owner-approved unreleased v2.2 application checkpoint is `0251b43a3b5d41d626aa022c6d7f9b4d860433da`, schema 31, including Stages 1–5 and subsequent integrated corrections. See [Development Status](Development-Status.md) for exact checkpoints and outstanding acceptance. Integration is not production upgrade or release approval.

> **Historical Stage 6.2 checkpoint — 24 November 2026:** `2107de3668b08c5abdfdae6fe231a3114bbfc380` used schema 28. Its isolated schema-10 → 28 result remains in the [Stage 6.2 evidence](../development-handovers/evidence/stage-6-2/README.md). It does not establish current schema-31 upgrade/recovery acceptance.

> **Historical Batch 3.12 review branch:** Schema 20 updates the built-in IT Staff default and preserves existing account levels through compatibility overrides. No stock tables or journal entries are migrated. See [dashboard and upgrade contract](IT-Assets-Dashboard.md). Earlier dated checkpoints below retain their historical scope.

## In simple terms

SQLite is a database stored in a file rather than a separate database server. Caffoot Lite opens that file when handling requests. The data survives container replacement **only if the `/data` mount is preserved**.

The code keeps Devices, IPAM and Racks records in separate tables, along with account and session tables. Variable fields are retained as JSON within the appropriate record, preserving the published application's custom and historical data. There is **no competing whole-inventory JSON authority**.

## Source and schema version

**Historical Batch 3.10 Checkpoint D:** Schema 19 adds nullable `handover_event_id` and
`successor_assignment_id` references to the canonical `device_assignments` table.
The audited direct closure is separate from the existing physical-return guard.
Referenced preparation audits and assignment links are immutable. Registered
custody uses a guarded pair of existing stock entries, without held/Ready stock
or a receipt; Devices-only handovers create no stock. The upgrade preserves
Schema 18, existing records, grants and feature choices, and rejects altered
definitions transactionally. See [the approved sequence](Direct-Handover-Decision.md)
and [the writer contract](Associated-Equipment.md#direct-handover-checkpoint-d).

**Historical Batch 3.10 Checkpoint A:** Schema 18 adds one empty, permanent explicit
`device_equipment_associations` table and protected history reads. Stock and
assignment schemas remain unchanged. No existing recipient match creates an
association. See [Associated Equipment](Associated-Equipment.md) for migration,
privacy, transaction boundaries and remaining work. The earlier checkpoints
below retain their historical scope; this is not a production upgrade guide.

**Historical Stage 3.8 version boundary (15 November 2026):** Published v2.1 remains the tagged schema-10 release. `main` includes accepted but unreleased Stage 1/schema 12. Stage 3 Batches 3.1–3.7 are merged on `milestone-1` at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` (schema 16, PR #388). Batch 3.7 stock intake is visually accepted. Batch 3.8 issue, return, preparation and write-off are implemented for review on `feat/it-assets-issue-return-writeoff` (draft PR #389), including the narrow Schema 17 assignment-closure migration. Batch 3.8 is not merged, visually accepted or released. Batch 3.4 manual/native acceptance remains deferred. Device stock registration/reissue, associations, corrections, dashboards/warnings and Stages 4–6 remain pending. See [Development Status](Development-Status.md); these are not production upgrade instructions.

Stage 2 adds schema 13; Batch 3.1 adds independent Staff Members and flat Departments at schema 14; Batch 3.4 adds current and historical Device assignments at schema 15. Batch 3.6 adds schema 16: an independently disabled IT Assets choice and stock-foundation tables, an optional quantity-stock minimum and attributed specification-correction safeguards. Batch 3.7 adds receipt/readiness writers without changing these definitions. Batch 3.8 adds Schema 17: one nullable closure-movement reference and narrow one-way assignment guards. The four stock tables remain unchanged; no stock or closure is inferred for existing Devices. See [the closure contract](IT-Assets-Issue-Return-and-Write-Off.md#checkpoint-1-guarded-schema-17-closure). Earlier migrations are retained. See [Staff Directory Foundation](Staff-Directory-Foundation.md), [Staff Directory APIs](Staff-Directory-APIs.md), [Device Assignments](Device-Assignments.md), [IT Assets Foundation](IT-Assets-Foundation.md) and [Stock Intake](IT-Assets-Stock-Intake.md).

The exact definitions are in [`backend/schema.py`](../../backend/schema.py). The 30 October 2026 checkpoint had schema 7. The later modular v2.1 baseline used schema 9: migration 8 added profiles/photos and migration 9 added email proofs. The published v2.1 database uses schema 10, adding challenge identifiers, attempt counters and durable failed-attempt timestamps; it explicitly invalidates outstanding old-format email proofs at upgrade. The function `initialise_database(connection)` applies missing numbered migrations in a transaction and rejects databases marked newer than this application.

| Table | Primary key and relevant columns | What it contains |
| --- | --- | --- |
| `schema_migrations` | `version`, `applied_at` | Applied schema versions |
| `organisation_features` | `feature`, Boolean `enabled` | Independent organisation choices. IT Assets, Suppliers and Equipment Lifecycle start disabled on upgrade from v2.1. |
| `it_asset_stock_items` | text `id`, tracking mode, shared specifications, nullable `minimum_stock_level` | Stock catalogue; no opening balances |
| `it_asset_stock_units` | text `id`, optional source item, unique optional canonical `device_id` | Permanent individual identities and Device stock links |
| `it_asset_stock_movements` | numbered `id`, dates, actor snapshots, correction references | Immutable journal and separate specification audit records |
| `it_asset_stock_entries` | numbered `id`, movement, item/unit, quantity, states, recipient/assignment references | Immutable whole-unit transfers; receipt, readiness, issue, return and write-off APIs |
| `departments` | independent text `id`, unique `name`, `archived` | Flat Department records |
| `staff_members` | independent text `id`, optional unique `account_id`, optional `department_id`, profile details, `active` | Directory records independent of logins |
| `device_assignments` | numbered `id`, canonical `device_id`, Staff or Department custody, dated recipient/actor snapshots | One open custody period per Device; schema-17 guarded closure, schema-19 handover links, schema-29 equal Department relationships |
| `device_equipment_associations` | numbered `id`, original `device_assignment_id`, unique accessory `issue_entry_id`, operation key/hash, dated actor snapshot | Schema 18 explicit links only; no copied quantities, automatic association or stock movement |
| `device_assignment_departments` | assignment/Department relationship and attributed add/remove fields | Schema 29 equal current and retained Department links within one custody period |
| `inventory_devices` | `id`, case-insensitive unique `name`, `record_json`, `revision`, `ordinal` | Device identity, variable device properties, optimistic revision and original list order |
| `inventory_subnets` | `id`, `record_json`, `ordinal` | Subnet records |
| `inventory_vlans` | `id`, `record_json`, `ordinal` | VLAN records |
| `inventory_racks` | `id`, `record_json`, `ordinal` | Rack definitions |
| `inventory_rack_accessories` | `id`, `rack_id`, `record_json`, `ordinal` | Accessories attached to racks; index on `rack_id` |
| `inventory_ip_allocations` | `ip`, `record_json` | Authoritative IP allocation/reservation entries |
| `inventory_settings` | `key`, `value_json` | Managed lists, optional/historical top-level inventory settings |
| `inventory_change_history` | auto-increment `id`, `record_json` | Change History records |
| `accounts` | numeric `id`, unique `username`, `password_hash`, `is_admin`, `mfa_secret`, `mfa_confirmed`, `active` | Local users and account security |
| `account_permissions` | (`account_id`, `section`), `level` | Historical v2.1 grants; current role policy uses role permissions and account overrides |
| `account_sessions` | `token_hash`, `account_id`, `expires_at`, `created_at` | Expiring sessions; expiry index |
| `device_edit_reservations` | `device_id`, `account_id`, `expires_at`, `base_revision` | Current exclusive per-device editing reservation |

The `record_json`/`value_json` columns have SQLite JSON-validity checks. The schema uses relational keys for identities, unique names, revisions, sessions, permissions and editing reservations. Some inventory relationships are checked in application validation rather than represented solely by SQL foreign keys; **do not mistake a missing SQL foreign key for permission to remove a dependency check**.

## Which area owns what?

- **Devices:** device identities, properties and host/guest/device relationships. The device record may carry a `primaryIp` or rack presentation fields, but those must agree with shared authority.
- **IPAM:** authoritative IP allocations, assignments and reservations; device updates alter allocation records in the **same transaction**.
- **Racks:** definitions and accessory records; device placement is validated against shared rack occupancy, faces, collisions and capacity.
- **Accounts:** not part of exported/migrated inventory; user passwords, MFA, sessions and permissions are never overwritten by a v1.3.3 inventory import.

## How writing works

`server.connect()` opens SQLite with foreign keys enabled and a busy timeout. Save modules such as [`device_saves.py`](../../backend/device_saves.py), [`ipam_saves.py`](../../backend/ipam_saves.py) and [`collection_saves.py`](../../backend/collection_saves.py) use `BEGIN IMMEDIATE` and commit or roll back their changes as one operation. The device writer checks the stored revision and reservation before committing.

[`inventory.py`](../../backend/inventory.py) reconstructs the established inventory-shaped representation from the tables for validation/UI compatibility. Its `stage_inventory` checks durable Device dependencies under the write lock. Identical protected rows retain their identities and revisions. A changed or missing protected Device rejects the whole replacement. Account and security rows are outside the transaction's replacement scope. [Migration details](05-Inventory-and-Migration.md)

The database also holds Change History separately. Record-specific event behaviour is implemented by the related save operations; it is not an invitation to invent a new audit platform.

## Profile, Mail And Audit Storage

`account_profiles` holds optional personal details, saved verification status and bounded photo bytes. `account_email_proofs` binds a keyed code digest to an opaque challenge, account, purpose, saved email and expiry. `account_email_attempts` retains failed confirmation timestamps for the rolling budget. No plain code is stored. See [Account Recovery](Account-Recovery.md) for limits, resend and upgrade behaviour.

Protected account/security events are stored with the shared audit history and filtered by server-side visibility rules. The private SMTP configuration is a separate file beside SQLite; the installation email-proof secret is `account-email-secret.key` in that private directory. Back up the whole persistent directory, including those files and TLS, rather than SQLite alone.

## Operational limits

The container mount is the persistence boundary. Back up and restore the deployed database using the user's existing **external container/volume backup process**, per #215; importing a v1.3.3 JSON file is not the application's regular backup method. Read [deployment instructions](../../INSTALLATION.md) for the mount and TLS files. Do not advise deleting the data directory to reset certificates or repair a database.

### Related reading

[Architecture](01-Architecture.md) · [Inventory and migration](05-Inventory-and-Migration.md) · [Code reference](07-Function-and-Code-Reference.md)

Schema 15 adds [Device Assignments](Device-Assignments.md) without changing any
existing records or inferring stock/readiness. Referenced Devices and recipients
are protected from ordinary deletion. Legacy inventory replacement is also blocked
where it would remove referenced Devices. Clean Start clears the operational records
and their dependencies within a single authorised transaction.

## Service Desk Ticket Storage

Schema 25 adds `service_desk_categories`, `service_desk_tickets`, `service_desk_events`, `service_desk_messages`, `service_desk_attachments` and `service_desk_closures`. Equipment foreign keys retain the canonical record. The original assignment remains linked to the ticket, and Clean Start removes each ticket and its dependent records in the inventory transaction. See [Service Desk Foundation](Service-Desk-Foundation.md).

Schema 26 adds the nullable `affected_software` label to `service_desk_tickets`. Existing tickets retain their contents and start with an empty software field. Employee ticket creation validates the optional selection against the authorised Laptop or Desktop. Category corrections record the previous software and category in attributed ticket history before clearing a selection that no longer applies. [Service Desk Foundation](Service-Desk-Foundation.md#employee-tickets)

## Later Integrated Storage

Schema 27 stores effective Service Desk calendars and per-account reporting preferences. Schema 28 adds `email_templates` and `email_branding`, including managed logo bytes. Schema 29 adds `device_assignment_departments` and the shared-custody safeguards. Schema 30 adds temporary-password change state and limited password-change proofs. Schema 31 adds `service_desk_message_reads`, with independent account/message read receipts. The exact table definitions remain in [schema.py](../../backend/schema.py), [shared_device_schema.py](../../backend/shared_device_schema.py), [service_desk_schema.py](../../backend/service_desk_schema.py) and [email_templates.py](../../backend/email_templates.py).

Staff offboarding reconciliation runs at schema 31 without adding a new migration number. It disables enabled logins linked to inactive Staff and revokes sessions/proofs transactionally, retaining identities and equipment history; a last-active-administrator conflict rolls back startup. See [upgrade safeguards](../how-tos/features-and-instructions/v2.2-draft/Legacy-Import-and-Docker-Upgrade.md#left-company-linked-login-reconciliation). No current production upgrade/recovery result is implied.
