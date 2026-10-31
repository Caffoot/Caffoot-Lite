# 05 — Inventory behaviour and v1.3.3 migration

## In simple terms

The Docker application should feel familiar to somebody who uses published **Caffoot Lite v1.3.3**. Devices, IPAM, Racks, their relationships and Change History are still the foundation. What changed is *where data is saved and who may change it*. The permitted import lets someone move their existing inventory into the shared database **once**, using a fresh backup exported by v1.3.3.

**This is not a new inventory design and not a general-purpose JSON restore system.**

## The published baseline

Use the source from [published tag `v1.3.3`](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html), not simply the current `app/` file on a changing development branch. Important published identifiers include:

- `createInventoryBackup` and `validateBackupVersion` for the v1.3.3 export contract.
- `normaliseImportedBackupAndPlanLegacyMountRepairs` and `planLegacyComputerMountingCorrections` for existing import reviews.
- `findAccessPointMountConflictsInBackup` for Access Point mounting choices.
- `renderDevicesHTML` and `renderRackHubV13` for the established device and rack interface.

The source of truth is the published v1.3.3 tag and the current Docker source/tests. The earlier v1.3.0 audits, workflow matrices and initial Next migration investigation are kept in [this exact Git history snapshot](https://github.com/Caffoot/Caffoot-Lite/tree/049262f196be494074f698a72f377153f202171b/docs/required-only), not as live requirements. Their findings and proposed changes must be checked against later published fixes before being treated as outstanding.

## Data and relationships

- **Devices:** names, types, locations, hardware/software details, host/guest relationships, optional and historical fields, and device identity.
- **IPAM:** blocks/subnets, VLANs, primary device IPs, independent allocations/reservations, gateway restrictions, notes, dependent and bulk operations.
- **Racks:** rack definitions, placement, faces, capacity, rack accessories and vertical side-rail items, with collision/dependency rules.
- **Change History:** retains existing event information and limits while moving event storage to SQLite.

### Preserved data contracts — carried forward from source review

The published v1.3.3 export and the current [SQLite projection](../../next/backend/inventory.py) use the inventory collections `devices`, `subnets`, `vlans`, `racks`, `rackAccessories` and `ipAllocations`. The backend's `SETTINGS` fields include `deviceTypes`, `deviceTypeGraphics`, `deviceLocations`, `serverFunctions`, `installedSoftware`, `managedOptionsCleared`, `stateVersion`, `hardwareCatalogue`, `hardwareSeedPreferences` and `softwareTypeExclusions`. These and unknown supported historical/custom values must not be silently dropped.

Device records may carry `typeDetails`, `virtualHostId`, `primaryIp`, mounting/location fields and other optional historical properties. The exact available fields and relationships come from the published application and its current validators, not a fixed list in this guide. Importing retains the existing Access Point and legacy mounting reviews when triggered by the supplied v1.3.3 export, without adding support for older direct imports.

Source-shaped records are reconstructed by [`inventory.reconstruct_inventory`](../../next/backend/inventory.py) for compatibility checks and display. Core authoritative data remains divided across SQLite tables; save modules must keep linked IP/rack outcomes consistent. See [database ownership](02-Database.md).

## Supported one-way import

The **only supported source** is a fresh JSON inventory export from the published v1.3.3 application. Someone on an older HTML version must first upgrade their HTML application to v1.3.3, verify the inventory and export from there. There is no direct older-format import promise and no reverse migration.

The implemented route chain is:

1. `server.Handler.handle_import` receives `/api/import/preview`, checks a logged-in administrator and forwards to [`ImportDrafts.begin`](../../next/backend/import_drafts.py).
2. [`inventory.inspect_export`](../../next/backend/inventory.py) checks the JSON and published-export metadata. Metadata is a **format gate**, not cryptographic proof of where a file originated.
3. [`import_review.prepare_published_export_review`](../../next/backend/import_review.py) preserves the existing Access Point mounting review *before* the remaining detached normalisation, legacy mounting review and integrity checks.
4. [`import_service.preview_published_export`](../../next/backend/import_service.py) produces a non-persistent preview and replacement counts when the review is ready. The server retains original file bytes in a **short-lived in-memory draft** tied to the session; the UI cannot submit its own candidate inventory for saving.
5. `/api/import/access-point-choices` collects any required Access Point corrections. `/api/import/cancel` discards the draft without replacing inventory.
6. `/api/import/confirm` requires the documented reviews and explicit replacement confirmation. [`import_service.replace_from_published_export`](../../next/backend/import_service.py) re-derives and validates the candidate, checks permission again inside the database write transaction, and calls [`inventory.stage_inventory`](../../next/backend/inventory.py).
7. The transaction replaces inventory-only tables and either commits or rolls back. It does **not** overwrite accounts, passwords, MFA, permissions or sessions.

The server's `/api/import/*` routes are **live**. Several module docstrings still say “offline only” because they describe an earlier checkpoint; always check the current handler and tests rather than repeating that obsolete status. Avoid changing those modules as part of documentation work.

## What the import is not

There is **no application-managed ongoing backup/export and restore scheme** for the Docker version. Back up the deployed SQLite data and supporting persistent files with an existing external container/volume backup tool. Do not add pre-import snapshots, browser recovery keys or reverse-export machinery without express approval.

## Acceptance status

Automated tests exercise the published exporter, import review, cancellation and confirmation, preserved fields and account retention. The product owner has completed the agreed **Stage 2 v1.3.3 inventory compatibility acceptance** on the Raspberry Pi, supported by the existing browser/backend evidence and recorded in [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218). This is not an exhaustive retest of every historical workflow and does **not** authorise a release. Final release preparation and approval remain outstanding.

### Related reading

[Database](02-Database.md) · [Frontend and API](03-Frontend-and-Backend.md) · [Testing](08-Testing-and-Maintenance.md)
