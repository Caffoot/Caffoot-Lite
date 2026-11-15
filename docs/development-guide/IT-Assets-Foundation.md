# IT Assets Foundation

> Unreleased v2.2 development. Batch 3.6 is on the separate
> `feat/it-assets-foundation` review branch, based on `milestone-1` at
> `2e6c50ba4777b7500258d2a1a28317764d806020`. It is not merged or released.
> Published v2.1 remains unchanged. Batch 3.4 native acceptance remains deferred.

This foundation adds an independent organisation choice and empty stock tables.
It does not provide stock screens, receipts, issues, returns, readiness, write-off,
corrections, Device registration, dashboards or associated equipment.

The scope follows [#368](https://github.com/Caffoot/Caffoot-Lite/issues/368),
[#352](https://github.com/Caffoot/Caffoot-Lite/issues/352) and
[#232](https://github.com/Caffoot/Caffoot-Lite/issues/232), with the owner's
Minimum Stock Level and specification-correction amendments.

## Schema 16

[The initializer](../../backend/schema.py) applies the upgrade in its existing
`BEGIN IMMEDIATE` transaction. [Stock definitions](../../backend/stock_schema.py)
are executed one complete statement at a time, including triggers; no separate
commit is made within the upgrade.

The existing five feature choices are copied unchanged into a replacement
`organisation_features` table. `it_assets` is inserted as disabled on both fresh
installations and upgrades. Suppliers and Equipment Lifecycle remain constrained
to disabled. Earlier fresh-install and upgrade defaults remain unchanged.

The upgrade rejects unexpected stock objects, an unfinished replacement feature
table, unexpected feature definitions/dependencies, invalid choices and broken
foreign-key relationships. It does not adopt pre-existing stock tables. The
migration marker is written last. Failure rolls back the feature replacement,
all stock definitions and the marker together.

On restart, an existing Schema 16 is checked against the expected definitions
without reseeding choices or rewriting data. Missing or unexpected guards require
review. An application with an older schema version rejects the newer database;
there is no destructive downgrade procedure.

## Tables And Identity

| Table | Purpose |
| --- | --- |
| `it_asset_stock_items` | Catalogue identity, tracking mode, equipment type, Manufacturer, Model, shared computer specifications and optional Minimum Stock Level |
| `it_asset_stock_units` | Individually identified equipment, or a unique stock link to an existing canonical Device |
| `it_asset_stock_movements` | Permanent dated facts, actor snapshots, receipt Supplier and correction relationships |
| `it_asset_stock_entries` | Whole-unit transfers between states, recipients, original issues and canonical Device assignments |

All four tables start empty. Existing Devices, imports, direct Device creation
and unassignment never create stock units, receipts or balances.

Quantity entries reference a quantity-tracked item. Individual entries reference
one unit and always have quantity one. Optional serial numbers are not identity
keys: two units without serial numbers remain distinct. Device-linked units read
the canonical Device's identifiers instead of copying them. A Device can have
only one stock-unit link, which cannot be rebound or deleted.

Tracking mode is locked once movement or linked Device assignment history exists.
Changing an unused item to quantity tracking is also refused while it has
non-Device individual units. Device Type remains protected once units or entries
exist; correcting catalogue specifications does not change a canonical Device's
identity or record.

## Shared Computer Specifications

Manufacturer and Model are separate text fields. `shared_spec_json` permits:

| Key | Stored value |
| --- | --- |
| `processor` | Optional nonblank text |
| `memory` and `memoryUnit` | Positive finite number paired with MB, GB or TB |
| `storage` and `storageUnit` | Positive finite number paired with GB, TB or PB |
| `storageMedium` | Optional nonblank stock-only text, separate from capacity |

Computer fields apply to Desktop, Laptop and physical Server items. Other
equipment retains an empty shared-computer object and uses appropriate name,
category, Manufacturer and Model fields. Duplicate/unknown keys and incomplete
capacity/unit pairs are rejected.

No serial number, hostname, IP address, location or recipient is shared.
No Device Add/Edit control is added. Future compatible prefill must use the
existing Device field conventions; storage-medium and Server boot/ZFS interface
integration remain separate work.

## Permanent History And Quantity Corrections

Future protected writers must take the write lock, recheck the live actor,
effective rights, MFA and feature state, and publish all changes atomically.
There is no stock writer API in this batch.

For ordinary movement records, insert entries first and their movement header
last. Allocate the next movement ID while holding the write lock. The deferred
foreign key prevents orphan entries committing; the header validates and closes
the entry set. Closed entries and movements cannot be updated, deleted, replaced
or extended.

The states are `awaiting_checks`, `awaiting_preparation`, `ready`, `issued`
and `written_off`. Held totals include the first three only. Future registration
transfers one unregistered quantity into one registered Device unit without
changing the total physically held. No registration workflow is implemented.

A future quantity correction uses `kind='corrected'` and points through
`corrects_entry_id` to the original entry. Its previous quantity must match
the latest effective quantity; its corrected quantity, reason, actor and dates
are retained. A compensating entry changes the balance without rewriting the
original. Corrections conflicting with subsequent recorded movements are rejected.
Several corrections belonging to one future operation must share one transaction.

Receipt Supplier is optional free text on the original receipt, separate from
Manufacturer and independent of the Stage 4 Supplier directory. It cannot be
silently replaced. The model does not guess delivery provenance for interchangeable
quantity units.

Historical actor IDs and labels are snapshots without an account foreign key,
so removing an account cannot erase attribution.

## Specification Corrections

The owner's amendment is supported within the same four tables. A reserved
`specification_corrected` header is a metadata audit record, separate from
quantity-based Correct Movement. It must contain **no stock entries or quantities**.

The header references its item and stores a mandatory reason, actor and dates,
plus exact `specification_before_json` and `specification_after_json` objects.
Each object contains Manufacturer, Model and shared specifications. The before
object must match the current values. A no-op or stale correction is rejected.

An insertion trigger applies the new values and records
`specification_movement_id` on the item in the same statement. Existing history
requires this matching, advancing journal reference for specification changes.
Reusing an old correction or directly editing historical specifications fails.
Invalid replacement specifications roll back both the header and item update.

Original journal values remain immutable. Later corrections preserve a chain of
before/after values. Existing Device records and stock quantities are unaffected.
Unused items without history may still have ordinary specification edits.

These database guards do not authenticate a person executing SQL. A future
authorised correction writer must use existing IT Assets Edit, session/MFA and
feature checks. This batch supplies no correction API, button, screen or extension
to the user-facing Correct Movement workflow.

## Minimum Stock Level

`minimum_stock_level` is nullable and permitted only for quantity tracking.
A configured value must be a whole number from zero to 9,007,199,254,740,991.
`NULL` means no threshold; zero is a configured threshold.

The approved future rule is **Ready To Issue quantity < Minimum Stock Level**.
Equality is not Low Stock. No dashboard, warning, threshold editor or calculation
endpoint is introduced here.

## Feature And Permission Integration

Settings & Data → Optional Features reuses the existing card template and styles.
IT Assets appears after Suppliers and Equipment Lifecycle in Additional Features.
Its description explicitly says stock screens and actions are unavailable.

The existing secured feature API accepts `it_assets`. Administrator/MFA/session,
Origin, CSRF, disable confirmation, cancellation, atomic audit and no-op rules are
unchanged. A switch grants no section rights and changes no MFA requirement.

`can_access` combines the flag with existing IT Assets Read/Edit roles and
overrides. Missing/off flags deny access, including for administrators. Staff
Members and Departments remain core; Devices remain independent. No new role or
stock navigation is introduced. Current APIs do not project the new stock tables.

## Checks And Remaining Work

The [implementation evidence](../development-handovers/evidence/it-assets-foundation/Report.md)
records focused tests, genuine screenshots and limits.

The current assignment update/delete guards are retained. A later Device return
or write-off needs a separately approved change allowing audited assignment
closure. Receiving, preparation, issue/return, corrections, associated equipment,
Device registration, dashboards, Suppliers and Service Desk remain unimplemented.

Complete-milestone import compatibility and full-volume upgrade/restore acceptance
remain Stage 6 work. This guide is not a tested production upgrade procedure.
