# 06 — Coding and naming conventions

## In simple terms

Names are signposts: a developer should be able to search for a function and understand what it does. Caffoot Lite already has established naming conventions, so preserve them instead of introducing a new style.

The [existing v1.3.x naming reference](../required-only/standards--coding--DEVELOPER-CODING-AND-NAMING-REFERENCE.md) is useful source evidence, but its older browser-storage and release notes do not all apply to the Docker application.

## JavaScript and HTML

| Kind | Existing examples | Convention |
| --- | --- | --- |
| Functions | `getDeviceById`, `renderDevicesHTML`, `validateRackPlacement` | Lower camel case, descriptive verb and domain noun |
| Reading and display | `get…` / `render…` | Distinguish fetching data from building markup |
| Checking and planning | `validate…` / `plan…` | Check or propose before applying |
| Changing state | `save…` / `apply…` | Make side effects recognisable |
| Variables | `activeSettingsSection`, `selectedRackId` | Lower camel case with meaningful names |
| Constants | `STORAGE_KEY` and other historical examples | Upper snake case for shared immutable configuration; old browser keys are not Next's storage authority |
| HTML hooks | `id`, `data-action`, `data-form-action` | Keep selectors, delegated handlers and accessibility attributes synchronised |
| CSS classes | `rack-accessory-item`, `rack-accessory-port` | Name the component and its role |

The current [`next/inventory.html`](../../next/inventory.html) also uses `refreshCentralInventory`, `postInventory` and `applyAllowedControls`. Reuse existing handlers and functions rather than duplicating their job. Do not rename established inventory IDs, functions or CSS hooks for cosmetic reasons: even a tidy-looking rename could change v1.3.3 behaviour.

## Python

The backend uses `snake_case` functions/modules and `UPPER_SNAKE_CASE` constants. Verified examples include `initialise_database`, `reconstruct_inventory`, `save_reserved_device`, `set_permission`, `SCHEMA_VERSION` and `SESSION_SECONDS`. Classes/exceptions use names such as `Handler`, `ImportDrafts` and `ImportRejected`.

Place code with its established owner: [`server.py`](../../next/backend/server.py) handles requests, [`permissions.py`](../../next/backend/permissions.py) determines access, [`device_saves.py`](../../next/backend/device_saves.py) handles device writes and [`schema.py`](../../next/backend/schema.py) defines SQLite migrations. Do not create extra layers without an approved need.

## Preserving data contracts

JavaScript inventory fields such as `rackAccessories`, `ipAllocations`, `primaryIp`, `rackId`, `deviceId` and `virtualHostId` must retain their established meaning and serialised names. Python/SQL columns can follow snake case (for example `record_json` and `base_revision`), but never silently rename the published inventory fields. An API payload name must match both its UI caller and the Python handler.

## Comments, evidence and changes

Write comments in plain British English explaining *why* a validation or compatibility rule exists, not a diary of development phases. Search by function name or path instead of hard-coded line numbers.

Several current module docstrings still say “offline” or “future” although the HTTP server now calls them. Treat actual call paths and current tests as evidence. Correct stale descriptions without changing behaviour, and do not turn this guide into a new product specification.

**Before editing:** read [#215](https://github.com/Caffoot/Caffoot-Lite/issues/215), inspect current Next code, compare inventory work with [published v1.3.3](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html), then consult [the code reference](07-Function-and-Code-Reference.md) and [testing guide](08-Testing-and-Maintenance.md).
