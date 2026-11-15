# IT Assets: Issue, Return And Write Off

> **Unreleased v2.2 — Work In Progress.** Batch 3.8 starts from `milestone-1`
> at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba`, following merged and visually
> accepted Batch 3.7/PR #388. This branch is not merged or visually accepted.

## Authority And Scope

Follow [#368](https://github.com/Caffoot/Caffoot-Lite/issues/368),
[#352](https://github.com/Caffoot/Caffoot-Lite/issues/352),
[#232](https://github.com/Caffoot/Caffoot-Lite/issues/232),
[#292](https://github.com/Caffoot/Caffoot-Lite/issues/292) and the
[narrow migration/checkpoint approval](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6900071456).

The approved batch covers issue, partial/mixed-condition return, later preparation,
write-off and permission-safe equipment projections. Device stock registration and
reissue remain Batch 3.9; associations, corrections and dashboards remain later work.
No published v2.1 instruction or production upgrade procedure changes here.

## Interface Mapping Before Implementation

The functional references are the original
[Return Equipment](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-3-previews/caffoot-it-assets-return-equipment-review.html),
[equipment journey](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-3-previews/caffoot-stage3-equipment-journey-stock-availability-review.html),
[Staff assignments](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-3-previews/caffoot-staff-directory-assignments-preview.html)
and [Device Assigned To](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-3-previews/caffoot-devices-assigned-to-tab-review.html)
previews. Their standalone shells, styles, sample records and scripts are not application code.

| New Interaction | Existing Production Source |
| --- | --- |
| Issue/Return forms and current-item availability | `interface/stock-intake.js`, existing Staff field grids and cards in `interface/styles/staff.css` |
| Mixed return dispositions and calculated Awaiting quantity | Existing stock form/summary pattern; the Return preview supplies the approved fields and calculation |
| Write Off controls and validation | Existing stock detail form/action conventions, reason field and inline feedback |
| Preparation and item states | Existing Stock Inventory View / Update and stock table scroll wrappers |
| Movement history | Existing Receipt History table/details pattern, retaining original receipt facts |
| Staff/Department and employee projections | `interface/equipment.js`, `interface/staff-directory.js`, existing Device Assigned To tab and protected equipment APIs |
| Themes, navigation and responsive layout | Existing shared component/theme styles and IT grouping; no replacement screen or design system |

## Checkpoint 1: Guarded Schema 17 Closure

The historical Schema 15 and Schema 16 definitions remain intact. Schema 17 adds
one nullable `closure_movement_id` column to `device_assignments`, referencing the
permanent stock journal through a deferred foreign key. No stock table changes.
All existing rows and choices remain; old completed assignments remain historical.

The replacement UPDATE guard permits only outstanding → closed. Device, recipient,
label, assignment date and original technician fields cannot change. Closed rows
cannot reopen or be edited; deletion remains forbidden. A new INSERT guard also
prevents closed-row insertion and replacement of an existing/current assignment.
The unique-current-assignment index remains unchanged.

A closing operation must insert a matching new Device stock entry and attributed
inventory audit first. The guard checks the Device, original assignment/recipient,
closing movement, end time and matching audit reference. The existing journal
validates return/write-off transitions when its immutable header is published.
The deferred reference prevents committing closure without that header. Failure
rolls back the stock entries, audit and closure together. Live permissions and
session/MFA checks belong to the protected application operation, not SQL alone.

Migration checks reject unexpected assignment columns, indexes or guards rather
than adopting them. Initialisation owns the transaction, writes marker 17 last,
checks foreign keys and validates definitions again on restart. No Device is
inferred to be stock during migration. No destructive downgrade is provided.

**Actual focused result:** 44 tests passed (closure, existing allocation and
historical stock-foundation suites). See [checkpoint evidence](../development-handovers/evidence/stock-circulation/Report.md).
Issue/return/write-off APIs and interface work are still pending at this checkpoint.

## Checkpoint 2: Issue Equipment Backend

`POST /api/it-assets/issue` uses existing session, Origin, CSRF and IT Assets Edit
checks and rechecks access after taking the write lock. A request selects the
stock item/version, positive whole quantity, eligible Staff/Department recipient,
Date Issued and optional note. Individual stock also names each ready unit.
Registered Device reissue is deliberately outside this stock-issue path.

The live selected-item Ready quantity is authoritative. Awaiting, already-issued
or written-off units cannot be issued. The immutable issue entries retain original
recipient IDs/labels and unit identities; their entry IDs anchor future partial
returns. The journal and existing attributed audit commit together. Identical
operation-reference retries return the original result; stale or changed requests
are refused without changes. No Device is created or modified.

`GET /api/it-assets/issues` exposes genuine issue/outstanding records to authorised
stock readers. `GET /api/it-assets/recipients` requires IT Assets Edit and reuses the
existing restricted eligible-recipient lookup with only ID, name label and kind.
It grants no Staff/Department directory or Devices access. Existing Device lookup
still requires Devices Edit. No new permission or role is introduced.

**Actual focused result:** 51 tests passed across stock circulation, stock intake,
closure and existing Device allocations. Return, preparation, write-off and UI
remain pending at this checkpoint.
