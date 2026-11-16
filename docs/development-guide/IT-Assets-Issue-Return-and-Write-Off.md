# IT Assets: Issue, Return And Write Off

> **Unreleased v2.2 — Implemented For Draft Review.** Batch 3.8 starts from `milestone-1`
> at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba`, following merged and visually
> accepted Batch 3.7/PR #388. This branch is not merged or visually accepted.

## Unassigned Device Return Correction — 16 November 2026

The owner approved this narrow completion in [PR #389](https://github.com/Caffoot/Caffoot-Lite/pull/389#issuecomment-6907931718)
and [#352](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6907932153).
The protected return operation now accepts exactly one `deviceId` alternative to
`issueEntryId` or `deviceAssignmentId`. This alternative requires the Boolean
`physicalReturnConfirmed: true`, both effective Edit permissions, independent
features and the existing session/MFA/Origin/CSRF protections. It rejects active
assignments, virtual Devices, any previous stock-entry history, stale versions,
future dates, non-unit quantities and Ready/write-off dispositions. An identical
operation retry is idempotent; another return cannot add a second held unit.

The existing canonical stock link is reused, or one permanent link is created.
The sole movement is an actual return into `awaiting_preparation`, with confirmed
physical receipt, Device revision/identity, date, authenticated actor and audit.
No original issue, holder, receipt, stock item or assignment is invented. Existing
completed assignments, Device JSON, security and relationships remain untouched.
Later preparation still requires the approved type-specific confirmations.
Schema 17 and all stock-table definitions/guards are unchanged.

**Backend checkpoint:** 73 focused tests passed. The integrated interface now also
passes the focused new browser flow and the existing complete circulation flow.
Final full-suite/CI verification and committed-source captures remain pending. The first added empty-unit fixture used a non-UUID ID;
it was corrected without changing the schema constraint. See [correction evidence](../development-handovers/evidence/unassigned-device-return/Report.md).

### Existing Interface Integration

Device Details reuses its existing Return Equipment action, gated by the protected
assignment read. An `unassigned-device:<id>` context opens the same stock form with
one preselected canonical Device; it does not introduce a general Device picker.
The context forces a fresh protected stock read. Missing/stale eligibility cannot
fall back to another issue. Quantity is fixed at one and Ready/write-off/check
controls are disabled for this path. Original assigned/quantity forms retain their
existing controls and calculation.

A visible declaration immediately above Record Return, also associated with the
button for accessibility, states that submission confirms physical possession.
Only that explicit form submission sends `physicalReturnConfirmed: true`; opening
the form sends no confirmation or stock mutation. The permanent journal and audit
retain the confirmation. Movement Details displays it under the existing independent
Read gates. Original records and all Schema 17 definitions remain unchanged.

The following sections retain the earlier reviewed Batch 3.8 source/capture
checkpoint. Current correction results are in the separate report linked above.

## Current Implementation

Issue, partial/mixed return, preparation, held/issued write-off and protected
Staff/Department/My Equipment projections are implemented in [draft PR #389](https://github.com/Caffoot/Caffoot-Lite/pull/389).
Runtime/capture source: `11cf6beaf39e53c1abaad9c2649a64b5edfb93c6`.
Full backend at `c205cfa`: 790 run, 786 passed, four documented skips. The final
read-only holder-label projection passed all 62 affected tests at `11cf6be`; final
PR CI also checks the complete backend. The real browser flow
passed with 52 desktop/mobile light/dark captures. Docker passed separately at
`e78358b`; the final display-only change is also checked in PR CI. See the
[final evidence, commands and limits](../development-handovers/evidence/stock-circulation/Report.md)
and [draft user instructions](../how-tos/features-and-instructions/v2.2-draft/IT-Assets-Issue-Return-and-Write-Off.md).
Product-owner visual acceptance and merge approval remain pending.

The dated checkpoint sections below preserve the implementation sequence.
Preparation type mapping was clarified by the owner and implemented in checkpoint
5B; earlier open-question wording describes that earlier checkpoint only.

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

## Checkpoint 3: Return And Preparation Backend

`POST /api/it-assets/return` selects an original issue entry or current legacy
Device assignment, its version, Date Returned, Returned/Ready/Written Off quantities,
checks, damaged reason and optional note. It rejects over-returns, closed/stale
issues and contradictory quantities. Inactive/archived original holders can return
outstanding equipment; their unreturned quantities remain linked to them.

All returned units first enter the existing `awaiting_preparation` state. Explicit
Ready and damaged dispositions append separate readiness/write-off movements in
the same transaction. Final Awaiting quantity is Returned minus Ready minus Written
Off; damaged units do not remain held. The original issue is reduced only once.
There is no new receipt, inferred stock or arbitrary balance editor.

A real assigned Device return requires both effective Devices Edit and IT Assets
Edit. It creates at most one permanent stock link to the same Device, closes the
original assignment through Schema 17 and leaves Device JSON, IP, Rack, Location
and operational status unchanged. Registered Device projections require Devices
Read as well as stock access. Cross-feature audit projections omit Device stock
facts when Devices access is unavailable.

`POST /api/it-assets/preparation` confirms selected returned units or quantities
ready with Date Checked and appropriate checks. It creates no second physical
receipt. Existing receipt-readiness cannot bypass returned-equipment preparation;
a reasoned readiness reversal for returned equipment re-enters preparation.
The original three balance keys remain compatible; additive `stateBalances`
distinguishes checks, preparation, issued and written-off quantities.

**Open type-mapping clarification:** Desktop, Laptop and physical Server require
wipe/reset plus cleaned/working confirmation. Monitor, Keyboard, Mouse and Docking
Station require cleaned/working confirmation without compulsory wipe. Mandatory
checks for other canonical Device types (including Printer) need owner clarification;
the current WIP blocks their preparation/Ready transition rather than assuming a
rule. Physical return into preparation and write-off remain independently possible.
No new data-bearing field or screen is introduced by this checkpoint.

**Actual focused result:** 56 tests passed across circulation, intake, closure and
history privacy. Standalone Write Off, equipment projections, UI and final complete
verification remain pending. The open clarification is not final acceptance.

## Checkpoint 4: Standalone Write Off Backend

`POST /api/it-assets/write-off` records a mandatory reason, Date Written Off,
quantity, selected state and optional note. It supports held quantity/individual
stock, an original outstanding individual issue, or a canonical physical Device.
The server verifies the exact state and version and records permanent attributed
facts atomically. It cannot make stock negative or process an identity twice.

An issued identified item goes directly to Written Off; no physical return or
Ready state is invented. A canonical Device requires both Edit permissions and
enabled features. Its original assignment closes under the guarded journal/audit
contract. An explicitly written-off Device which was never recorded as stock gets
only its permanent identity link and write-off fact: no held balance, receipt or
return is fabricated. Device JSON/status, addresses, Rack and Location are retained.
Other accessories/issued equipment are not written off automatically.

Recorded Device stock history blocks the ordinary initial-allocation path, even
when IT Assets is later disabled. This does not enable Device reissue or alter
unrelated initial-allocation eligibility. The sanctioned reissue path remains
Batch 3.9. Canonical Device choices expose only permitted equipment identity/state
fields, with no notes, account details or unrelated Device properties.

**Actual focused result:** 61 tests passed across circulation, closure, existing
Device allocations and history privacy. The outstanding type-check clarification
still applies to preparation; it does not prevent Write Off. Equipment projections,
interface, full final verification and screenshots remain pending.

## Checkpoint 5A: Protected Equipment Projections

Existing assignment reads now return permitted outstanding IT Assets and genuine
movement history alongside permitted Devices. Each section keeps its own access;
Staff/Department directory access is not granted. Department equipment includes
only Department-held issues, not personal equipment owned by its members. Historical
stock references prevent unsafe Department deletion after equipment has returned.

My Equipment resolves the signed-in account's real Staff link and current Department.
It projects only safe equipment identity, type, shared model, assigned date and
outstanding quantity. It does not require or grant general stock/directory rights.
Personal and Department-shared lists stay separate. Canonical Devices remain on
the original Device relationship, without duplicate Asset rows. Disabling a feature
hides its corresponding equipment while retaining records.

`GET /api/it-assets/history` projects real immutable receipt/issue/return/preparation/
write-off facts under existing effective Read and independent Device gates. It omits
request digests, private fields and hidden Device history. It never invents a holder
for interchangeable quantities after return.

**Actual focused result:** 76 tests passed, including stock circulation, existing
Device allocation/HTTP, Staff directory and history privacy. This is the backend
part of checkpoint 5; the new interface and browser verification are still pending.

## Checkpoint 5B: Integrated Interface And Owner Clarification

Issue Equipment, Return Equipment, Write Off and Movement History extend the
existing IT Assets tab strip; Receive Stock, Stock Inventory and Receipt History
remain. Forms, summaries, field grids, actions and table scrolling reuse existing
production styles. Stock Inventory distinguishes checks, preparation, issued and
written-off quantities, with real canonical Device history kept separate from
unregistered quantity stock. Its totals count each physical unit once.

Staff and Department views show outstanding Asset quantities and real history in
their existing equipment areas. Issue Equipment can begin with the viewed recipient
preselected. The restricted lookup resolves that exact eligible ID, including
recipients beyond the first search page, without returning directory/contact data.
Device Assigned To offers the authorised Return/Write Off entry points; the existing
Details modal closes before moving to the stock form. My Equipment keeps safe
personal/shared quantities and the existing employee navigation.

The owner resolved the earlier preparation question in this implementation session:

| Type | Mandatory Confirmation Before Ready |
| --- | --- |
| Desktop, Laptop, physical Server | Checked Working and Data Wiped / Reset |
| Printer | Cleaned And Checked Working; stored documents, credentials and user data cleared where applicable, without requiring every Printer to undergo a factory reset |
| Monitor, Keyboard, Mouse, Docking Station | Cleaned And Checked Working; no data-wipe requirement |
| Other types | Working/condition checks and confirmation that applicable preparation, including data clearing where needed, has been completed |

The same existing two check controls use type-specific wording. No data-bearing
column or new layout is introduced. Metadata stores the exact confirmation labels
and values with the original actor/date. Return/preparation requests use
`checks.cleanedWorking` and `checks.dataPreparationConfirmed`; a checked confirmation
is never inferred from a type or a prior event. Receipt checks remain unchanged.

**Actual focused result:** 107 backend tests passed, and the complete real HTTPS/
SQLite Chromium circulation flow passed without page errors. The focused browser
run did not capture screenshots; pinned-source captures and final complete checks
belong to checkpoint 6. Initial harness navigation mistakes and the Device modal
navigation defect were corrected before this passing run. No visual acceptance
or merge is claimed.

## Final Verification And History Display

Schema 17 definitions and stock-operation rules remain as documented above. An
assignment read includes the journal’s closure kind, event date and actor only
when both Devices and IT Assets are available to the reader. Staff, Department
and Device views can therefore attribute genuine returns/write-offs without
inventing an actor for old completed rows or leaking stock-derived facts when
IT Assets is off. Original allocation attribution remains unchanged. Movement History also resolves
the original holder label from the existing assignment reference, with the same
independent Device/IT Assets access checks.

The complete backend suite covers Devices/IPAM/Racks, accounts, MFA, effective
roles/overrides, migrations, import protections, stock constraints, closure and
circulation. Existing browser regressions run through the PR workflow alongside
the new circulation test. The four stock tables, existing screen fragments,
shared styling and published v2.1 guides/install instructions are unchanged.
The Function Index records 945 verified declarations. Detailed pass/skip counts,
source hashes, screenshot hashes and exact commands are in the linked report.
No owner acceptance, native hardware test, Stage 6 restore or later batch is claimed.
