# 07 — Function and code reference

## In simple terms

This page tells you where to look. Search for a function's exact name, then read the source and its callers before changing anything. Line numbers change, so this guide uses file paths and searchable identifiers.

For the full source-pinned list of named functions, line locations and clearly qualified reference counts, see the [Function Index](Function-Index.md). It complements this short maintainer reference; static counts are not a verified runtime call graph.

## Entry points

| Source | Search terms | Responsibility |
| --- | --- | --- |
| [`backend/server.py`](../../backend/server.py) | `Handler.do_GET`, `Handler.do_POST`, `Handler.handle_import`, `main` | HTTPS entry point and request routing |
| [`backend/schema.py`](../../backend/schema.py) | `SCHEMA_VERSION`, `initialise_database` | SQLite definitions and migrations |
| [`backend/inventory.py`](../../backend/inventory.py) | `reconstruct_inventory`, `stage_inventory`, `inspect_export` | Source-shaped inventory, import storage, export format |
| [`inventory.html`](../../inventory.html) | `renderDevicesHTML`, `renderRackHubV13`, `refreshCentralInventory`, `postInventory`, `applyAllowedControls` | Familiar inventory UI and server integration |
| [`setup.html`](../../setup.html) | `/api/setup`, `/api/login` | Account setup and sign-in |

## Inventory writers and validators

| File | Search terms |
| --- | --- |
| [`device_saves.py`](../../backend/device_saves.py) | `save_reserved_device`, `create_device`, `delete_reserved_device` |
| [`ipam_saves.py`](../../backend/ipam_saves.py) | `change_independent_allocation`, `change_bulk_allocations` |
| [`collection_saves.py`](../../backend/collection_saves.py) | `change_inventory_record`, `change_ipam_subnet_and_vlan_records`, `delete_subnet_with_dependencies` |
| [`device_catalogue.py`](../../backend/device_catalogue.py) | `change_device_catalogue` |
| [`settings_saves.py`](../../backend/settings_saves.py) | `save_inventory_setting` |
| [`reset_inventory.py`](../../backend/reset_inventory.py) | `reset_inventory` |
| [`ipam_repair.py`](../../backend/ipam_repair.py) | `apply_ipam_repairs` |
| [`application_integrity.py`](../../backend/application_integrity.py) | `validate_detached_application_state` |
| [`rack_validation.py`](../../backend/rack_validation.py) | `find_rack_import_conflicts` |

## Accounts and editing

| File | Search terms |
| --- | --- |
| [`accounts.py`](../../backend/accounts.py) | `bootstrap_first_admin`, `confirm_admin_mfa` |
| [`authentication.py`](../../backend/authentication.py) | `authenticate` |
| [`mfa.py`](../../backend/mfa.py) | `new_secret`, `provisioning_uri`, `verify_code` |
| [`sessions.py`](../../backend/sessions.py) | `login_session`, `session_account`, `revoke_account_sessions` |
| [`request_auth.py`](../../backend/request_auth.py) | `authorised_mutation`, `authorised_inventory_import` |
| [`permissions.py`](../../backend/permissions.py) | `can_access`, `set_permission`, `can_replace_inventory` |
| [`account_security.py`](../../backend/account_security.py) | `change_own_password`, `begin_mfa_enrolment` |
| [`http_security.py`](../../backend/http_security.py) | `session_cookie`, `require_same_origin` |
| [`tls.py`](../../backend/tls.py) | `ensure_certificate` |

## Migration path

Start in [`import_drafts.py`](../../backend/import_drafts.py) (`ImportDrafts.begin` and `confirm`), follow [`import_review.py`](../../backend/import_review.py) (`prepare_published_export_review`) and [`import_service.py`](../../backend/import_service.py) (`preview_published_export` and `replace_from_published_export`). Existing conditional corrections are in [`access_point_review.py`](../../backend/access_point_review.py) and [`legacy_mounting.py`](../../backend/legacy_mounting.py).

Published inventory behaviour comes from [tagged v1.3.3 source](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html), including `createInventoryBackup`, `validateBackupVersion` and `normaliseImportedBackupAndPlanLegacyMountRepairs`. For current Next declarations and search locations use the [Function Index](Function-Index.md). Older source investigations remain in the [historical Git snapshot](https://github.com/Caffoot/Caffoot-Lite/tree/049262f196be494074f698a72f377153f202171b/docs/required-only), not as new specifications.

See [coding conventions](06-Coding-and-Naming-Conventions.md) and [tests](08-Testing-and-Maintenance.md).
