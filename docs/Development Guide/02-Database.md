# 02 — SQLite database

## In simple terms

SQLite is a database stored in a file rather than a separate database server. Caffoot Lite opens that file when handling requests. The data survives container replacement **only if the `/data` mount is preserved**.

The code keeps Devices, IPAM and Racks records in separate tables, along with account and session tables. Variable fields are retained as JSON within the appropriate record, preserving the published application's custom and historical data. There is **no competing whole-inventory JSON authority**.

## Source and schema version

The exact definitions are in [`backend/schema.py`](../../backend/schema.py). The published v2.0.1 baseline used schema **7**; the unreleased v2.1 profile implementation uses `SCHEMA_VERSION = 8`. The function `initialise_database(connection)` applies missing numbered migrations in a transaction and rejects databases marked newer than this application.

| Table | Primary key and relevant columns | What it contains |
| --- | --- | --- |
| `schema_migrations` | `version`, `applied_at` | Applied schema versions |
| `inventory_devices` | `id`, case-insensitive unique `name`, `record_json`, `revision`, `ordinal` | Device identity, variable device properties, optimistic revision and original list order |
| `inventory_subnets` | `id`, `record_json`, `ordinal` | Subnet records |
| `inventory_vlans` | `id`, `record_json`, `ordinal` | VLAN records |
| `inventory_racks` | `id`, `record_json`, `ordinal` | Rack definitions |
| `inventory_rack_accessories` | `id`, `rack_id`, `record_json`, `ordinal` | Accessories attached to racks; index on `rack_id` |
| `inventory_ip_allocations` | `ip`, `record_json` | Authoritative IP allocation/reservation entries |
| `inventory_settings` | `key`, `value_json` | Managed lists, optional/historical top-level inventory settings |
| `inventory_change_history` | auto-increment `id`, `record_json` | Change History records |
| `accounts` | numeric `id`, unique `username`, `password_hash`, `is_admin`, `mfa_secret`, `mfa_confirmed`, `active` | Local users and account security |
| `account_profiles` | `account_id` (foreign key to `accounts`), names, unverified email, photo MIME and bounded image bytes | Optional per-user personal details and private photographs; cascade removal when its account is deleted |
| `account_permissions` | (`account_id`, `section`), `level` | `Devices`/`IPAM`/`Racks` read or edit grants |
| `account_sessions` | `token_hash`, `account_id`, `expires_at`, `created_at` | Expiring sessions; expiry index |
| `device_edit_reservations` | `device_id`, `account_id`, `expires_at`, `base_revision` | Current exclusive per-device editing reservation |

The `record_json`/`value_json` columns have SQLite JSON-validity checks. The schema uses relational keys for identities, unique names, revisions, sessions, permissions and editing reservations. Some inventory relationships are checked in application validation rather than represented solely by SQL foreign keys; **do not mistake a missing SQL foreign key for permission to remove a dependency check**.

## Which area owns what?

- **Devices:** device identities, properties and host/guest/device relationships. The device record may carry a `primaryIp` or rack presentation fields, but those must agree with shared authority.
- **IPAM:** authoritative IP allocations, assignments and reservations; device updates alter allocation records in the **same transaction**.
- **Racks:** definitions and accessory records; device placement is validated against shared rack occupancy, faces, collisions and capacity.
- **Accounts and optional profiles:** user/password/MFA/permissions are separate from inventory. Schema 8 adds `account_profiles` for first/last/display names, optional unverified email and optional image bytes. The existing `accounts.username` stays the login identity. Importing v1.3.3 inventory does not overwrite accounts or profiles. Profile photo bytes are private and included in the same SQLite backup.

## How writing works

`server.connect()` opens SQLite with foreign keys enabled and a busy timeout. Save modules such as [`device_saves.py`](../../backend/device_saves.py), [`ipam_saves.py`](../../backend/ipam_saves.py) and [`collection_saves.py`](../../backend/collection_saves.py) use `BEGIN IMMEDIATE` and commit or roll back their changes as one operation. The device writer checks the stored revision and reservation before committing.

[`inventory.py`](../../backend/inventory.py) reconstructs the established inventory-shaped representation from the tables for validation/UI compatibility. Its `stage_inventory` replaces the **inventory** tables transactionally for an approved import; account and security tables are outside that replacement. Read [migration details](05-Inventory-and-Migration.md) before touching this path.

The database also holds Change History separately. Record-specific event behaviour is implemented by the related save operations; it is not an invitation to invent a new audit platform.

## Operational limits

The container mount is the persistence boundary. Back up and restore the deployed database using the user's existing **external container/volume backup process**, per #215; importing a v1.3.3 JSON file is not the application's regular backup method. Read [deployment instructions](../../INSTALLATION.md) for the mount and TLS files. Do not advise deleting the data directory to reset certificates or repair a database.

### Related reading

[Architecture](01-Architecture.md) · [Inventory and migration](05-Inventory-and-Migration.md) · [Code reference](07-Function-and-Code-Reference.md)
