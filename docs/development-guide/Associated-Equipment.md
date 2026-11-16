# Associated Equipment — Backend Operations

**Checkpoints A–D are complete for review on draft PR #391.** Schema 18
provides explicit associations; Schema 19 adds audited direct assignment closure
and successor links on the same canonical assignment table. Its separate
physical-return path keeps the original safeguards. Registered custody transfers
use the existing ledger without a receipt or held/Ready increase; Devices-only
handovers create no stock. No Device status, location, rack or IPAM changes occur.

The owner approved [the exact direct sequence](Direct-Handover-Decision.md).
The final documentation, permanent gallery and final-head Actions are Checkpoint
E; earlier dated verification below retains its original scope. This is draft
v2.2 development, not a published feature or production upgrade guide.

## Approved Scope And Source Preflight

The starting integration commit is `6276225e5d527c83f2ffaf36812ab7c7c5a5269f`,
which includes the completed PR #390. The approved contract is
[#368 Sections 1, 4 and 5](https://github.com/Caffoot/Caffoot-Lite/issues/368),
[#352 Associated Equipment](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6849749661),
[#232 accessory returns](https://github.com/Caffoot/Caffoot-Lite/issues/232#issuecomment-6849757018),
[#232 direct preparation](https://github.com/Caffoot/Caffoot-Lite/issues/232#issuecomment-6849806400),
[#292 canonical history](https://github.com/Caffoot/Caffoot-Lite/issues/292) and
the [Batch 3.10 preparation checkpoint](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6912182571).

Source inspection establishes these boundaries:

- `device_assignments.assign_devices` owns its transaction and accepts only
  initial allocations. It must not become the reassignment writer.
- `stock_circulation.issue_stock` and `return_stock` each acquire a write lock,
  validate the session and permissions, and commit their own operation.
  `issue_stock_in_transaction` now shares the existing issue validation and
  ledger writer without committing. The combined issue/link writer must own
  its enclosing write transaction; committing a link afterwards would be unsafe.
- `stock_circulation.publish_stock_movement` writes within its caller's
  transaction. Stock entries, original issue references and canonical assignment
  closures remain authoritative. Schema 16 stock guards and Schema 17 assignment
  guards are unchanged.
- `device_stock.reissue_stock_device` accepts a genuinely held, prepared Ready
  Device and reduces held stock. A direct handover cannot use it to invent a
  receipt or physical stock movement.
- `permissions.can_access` combines live effective grants, account/MFA status
  and independent feature choices. The existing equipment HTTP handler checks
  the session and same-origin request before opening the read projection.
- `application.openDeviceDetailView` builds the existing tab navigation;
  `screens/devices.html` contains the Assigned To panel, hydrated by
  `equipment.loadDeviceEquipment`. These approved forms, equipment/stock styles,
  tab scrolling and layout are untouched in this checkpoint. Later integration
  must add the separate tab within these existing controls.

## Data And Migration

Schema 18 adds **one empty table**, `device_equipment_associations`, its assignment
index and three history guards. The database's existing upgrade transaction owns
all creation and the version record. Unexpected existing objects, altered guards
or invalid foreign keys stop startup without silently repairing or adopting them.
Upgrading and restarting preserve stock, assignments, identity, account/security
records and feature choices. Matching recipients never create links during upgrade
or reads. Fresh installations keep IT Assets off.

Each permanent link references the workstation's canonical `device_assignments`
row and the accessory's original `it_asset_stock_entries` issue line. It stores
the association time and technician snapshot, plus a unique operation key and
request hash for the protected writer. It does not copy a stock item, unit,
quantity, recipient or issue date. Those remain on the original issue and ledger.
An original issue line has at most one workstation association, preventing the
same issued quantity being counted against multiple workstations. Separate issue
lines remain independently traceable. Checkpoint B retains this Schema 18
contract unchanged; there is no new schema migration or issue-line splitting.

The insert guard accepts only an open assignment with an active Staff Member or
non-archived Department and an outstanding, published accessory issue to that
exact recipient. Department membership alone is insufficient. Registered Device
issues cannot masquerade as accessories. Missing, returned, written-off,
incorrectly held and duplicate issue references are rejected. Updates, deletes
and replacement inserts cannot erase or rewrite links.

Partial returns reduce the linked issue's outstanding quantity through the
existing ledger. Complete returns and write-offs retain the link and original
issue history. Returning an accessory does not itself mark it Ready.

## Read API And Privacy

`GET /api/equipment/associations?deviceId=<canonical-id>` uses the existing
authenticated, same-origin, `no-store` equipment request handler and a consistent
read transaction. Exactly one non-empty `deviceId` parameter is required.

Both **Devices Read** and **IT Assets Read** must pass before looking up the
Device or history. This also denies disabled features, revoked grants and
unverified accounts, including administrators when either feature is off.
Authorised readers receive `current` and `history` arrays. Each record contains
the association ID, original assignment ID, association time/technician,
assignment end time and the canonical original issue projection (including its
item or unit identity, original quantity, outstanding quantity, recipient, dates,
technician, specification snapshot and version).

`current` contains outstanding issues linked to an open workstation assignment;
`history` retains every explicit link, including outstanding issues on closed
assignments. The later reassignment guard must examine **all outstanding linked
issues**, including historical assignments, rather than relying on `current`.
No operation key/hash, Device notes, passwords, network details or unrelated
directory contacts are returned.
Existing Assigned To and employee-safe My Equipment responses are unchanged.

## Atomic Write API

Both routes use the existing equipment HTTP handler, verified session cookie,
same-origin/CSRF checks, JSON-only body and request-size limit. The writer checks
the live session, effective **Devices Edit** and **IT Assets Edit** permissions
and both independent feature switches again inside `BEGIN IMMEDIATE`, which
prevents another writer from changing the facts during validation and saving.

| Route | Required selection fields beyond the common fields | Behaviour |
| --- | --- | --- |
| `POST /api/equipment/issue-and-associate` | `stockItemId`, `version`, `quantity`, `issuedOn`, `note`; `stockUnitIds` required only for individual tracking | Issue the selected Ready item/units and associate every original issue line in the same transaction |
| `POST /api/equipment/associations` | `issueEntryId`, `version` | Link an outstanding original accessory issue without creating any issue or changing the stock ledger |

Common required fields are `operationId`, `deviceId`, `deviceRevision` and
`deviceAssignmentId`. The operation reference follows the existing stock
contract: 16–80 letters, digits or hyphens. Device revision and assignment ID
must be whole integers, with revision zero or greater and assignment ID positive.
Unknown fields, including caller-supplied recipients, are rejected. POST routes
accept no query parameters. The existing Assigned To read supplies the Device
revision/current assignment, while the selected stock item or original issue
supplies its opaque `version`.

Before a new save, the Device revision and open assignment must still match,
and no active Device editing reservation may exist. The exact current Staff or
Department recipient is derived from that assignment and revalidated as active
or non-archived. Department membership does not substitute for the actual holder.
The stock issue helper applies the existing per-item Ready/unregistered balance,
whole-quantity, individually selected unit, date, snapshot and ledger checks.
The existing-issue route verifies the issue version, outstanding quantity and
exact recipient, and rejects registered Device issues and duplicate links.
Partial-return issues can be linked with a fresh version; their original quantity
and outstanding balance remain distinct and authoritative.

The response contains `deviceId`, `deviceAssignmentId`, `associationIds`,
`issueEntryIds` and `movementId` (null for an existing-issue association). Individual
units produce separate canonical issue lines and links. All issue movements,
links and the final attributed association audit commit together, or all roll
back, including a failure partway through several individual links. The stock
helper never commits on its own. The ordinary Issue Equipment endpoint retains
its existing result and transaction boundary.

The operation reference is scoped to the actor and the request comparison includes
the route. An identical completed retry returns the stored result without changing
stock, links or history; different values or a different route conflict. Live
session, permission and feature checks still apply to retries. A completed retry
returns its original result even if equipment has since been returned; this is
confirmation of the earlier save, not a new issue or current-stock projection.
The final audit uses the existing confirmation/replay mechanism, and includes
the Device ID so existing history filtering hides it when either inventory area
is unavailable. New writes leave Device properties, IPAM, racks, locations,
assignment history and employee-safe responses unchanged.

Invalid values return 400; denied requests return 403; a missing original issue
returns 404; stale versions, active editing reservations, duplicate links and
conflicting operation references return 409. Successful writes return 200 with
`Cache-Control: no-store`.

## Checkpoint A Verification

The focused command below passed **123 tests** on 16 November 2026:

```sh
PYTHONPATH=tests:. python -m unittest test_equipment_associations test_equipment_associations_http test_assignment_closure test_staff_directory_migration test_it_asset_stock_schema test_device_assignments test_device_assignments_http test_stock_circulation test_device_stock -q
```

This includes 16 new association/migration/HTTP tests and existing stock,
assignment, closure, registration/reissue and directory-upgrade regressions.
Python compilation and `git diff --check` also passed. The Function Index was
regenerated for the changed modules and contains 972 definitions.

No browser collection, Docker lifecycle, full backend suite or new screenshot
capture was run for this backend-only checkpoint. Full applicable final-head
Actions and genuine changed-screen evidence belong to final acceptance; existing
accepted screenshots remain intact. Raspberry Pi/native Safari, private legacy
data and the previously deferred native/restore acceptance remain unverified.

## Checkpoint B Verification

Continued from `51bd7a775e769888880729676973e25fd133ab8a`, following
[the independent Checkpoint A correction and green Actions](https://github.com/Caffoot/Caffoot-Lite/pull/391#issuecomment-6912747653).
The transaction-helper preparation was separately tested and pushed as
`417da41620921d42b0b8e71ff318b19ea837220e` (65 focused tests passed).

The completed B source passed **131 focused tests**, including **28 new**
transaction-helper/writer/HTTP tests:

```sh
PYTHONPATH=tests:. python -m unittest test_associated_equipment_writes test_associated_equipment_writes_http test_equipment_associations test_equipment_associations_http test_stock_circulation test_stock_intake test_device_stock test_device_assignments_http test_history_permissions test_feature_settings -q
```

Coverage includes both routes, quantity and individual identity, actual Staff/
Department recipients, inactive/archived holders, selected availability, stale
stock/issue/Device/assignment references, reservations, strict payloads, duplicate
prevention, live permissions/features/sessions, MFA, CSRF, same-origin checks,
idempotent and conflicting retries, partial/full returns and write-off, history
privacy, failure after audit persistence, failure on a second individual link,
and simultaneous writers/identical retries on separate database connections.
The existing issue, intake, registration and assignment HTTP regressions passed.
Python compilation and diff checks passed; the updated Function Index has 974
definitions. No full local suite, browser run, new screenshot, Docker run or
release was performed. Newly triggered Actions are separate from these local
results; previous green Checkpoint A Actions are not evidence for the new head.

## Earlier C And Partial D Checkpoints

**Safe partial D checkpoint:** the [missing-equipment approval](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6913302245)
is implemented through existing Write Off controls. A positive whole missing
quantity, no greater than the original issued line's outstanding balance, moves
directly from issued to written off. Original recipient, unit/item, quantity,
date/reason/technician and immutable history are retained; no physical return or
held/Ready increase occurs. Individually tracked issued write-off and returned
damage dispositions retain their existing behaviour. Associated Equipment adds
a shortcut to that same Write Off form.

Genuine held-stock reissue now checks **all** outstanding linked accessories,
including those on former closed assignments, under the existing write lock.
Choices and Assigned To's reissue control are withheld until resolution. Actual
physical return can still be recorded accurately before accessories are resolved.
Workstation working/data preparation remains mandatory before physical reissue;
accessories never follow the workstation automatically. The schema/ledger guards
are unchanged; existing ledger transitions support the approved quantity extension.

102 focused tests (seven new) and both Chromium journeys passed. See
[the partial D report and 16 captures](../development-handovers/evidence/associated-equipment-resolution/Report.md).
The new journey is added to the existing Chromium Actions workflow, with its
normal read-only evidence upload. The Function Index has 978 definitions.

**At the partial D checkpoint, direct handover was blocked on confirmation placement and sequence**, not on
the already settled requirement to prepare equipment or resolve accessories.
The existing closure guard requires a physical return/write-off, while the
existing preparation/reissue form offers held stock only. The precise proposed
reuse of those controls is in [the owner decision](Direct-Handover-Decision.md).
No direct-handover endpoint, new screen, automatic Ready state or fictitious
receipt is implemented. D is incomplete and E final acceptance remains deferred.

**Checkpoint C complete:** the additive Associated Equipment tab uses the same
panels, table scrolling, typography and tab navigation as the existing Device
Details. Assigned To is unchanged. The protected read projection now provides
`canAdd`, a versioned eligible-holder `context` and unlinked `existingIssues` to
editors only; read-only users receive no edit context/choices. History includes
the original issue's actual return, readiness and write-off movements, read
directly from the canonical ledger. Add Equipment reuses the stock issue form,
keeps its recipient fixed and returns to the Device after saving either route.
Both original backend writer contracts and Schema 18 are unchanged.

78 focused backend/HTTP tests and both new/existing stock Chromium journeys
passed. Twelve genuine desktop/mobile light/dark captures, source hashes and
limits are in [the C evidence report](../development-handovers/evidence/associated-equipment/Report.md).
The Function Index contains 977 definitions; JavaScript/Python syntax and diff
checks passed. [Draft user instructions](../how-tos/features-and-instructions/v2.2-draft/Associated-Equipment.md)
cover implemented behaviour. Existing accepted screenshots remain intact.

## Direct Handover Checkpoint D

The owner-approved **Reassign Device** action is in Device Details → Assigned To.
It reuses the Reissue Existing Device form, fixes the canonical Device and adds
the existing applicable preparation controls with unchecked defaults. **Confirm
Ready And Reassign** explicitly confirms preparation and saves. Cancel keeps the
old holder. Outstanding accessories hide the action and block the writer even
when their details are hidden by permissions or feature choices.

`POST /api/equipment/reassign` uses the existing session, JSON, same-origin and
CSRF equipment handler. Required fields are `operationId`, `deviceId`, `version`,
`recipientKind`, `recipientId`, `handedOverOn`, `checks`, `readyConfirmed` and
`note`; unknown fields/query parameters are rejected. `handoverContext` on the
existing assignment read supplies the opaque version and applicable checks to
eligible editors only. It never reveals stock identities or choices.

Inside `BEGIN IMMEDIATE`, the writer rechecks the verified live session, Devices
Edit, feature choice, Device reservation, version, physical Device/current
assignment, all explicit outstanding accessory issues and the new eligible
recipient. Any published stock provenance additionally requires live IT Assets
Edit; Devices-only operation remains available with IT Assets off. A backdated
handover cannot predate the original issue; future dates, the same recipient,
unchecked working/applicable data preparation and missing explicit Ready
confirmation fail. The outgoing Staff Member may be inactive; the new recipient
must be active/non-archived.

The existing Device audit records the actor, date, old/new canonical assignments,
recipient, checks, Ready confirmation and optional note. It contains no hidden
stock details. Schema 19 closes the old row only against that immutable audit and
an eligible successor, with deferred references verified before commit. A Device
without stock history creates no stock facts. For a registered issued Device,
two narrowly guarded existing-ledger entries discharge the old issue and issue
the same unit to the new canonical assignment, retaining an issued balance of
one. Movement history presents one **Reassigned** event, Issued → Issued. There
is no physical receipt, preparation-to-Ready stock movement or duplicate Device.
Actual later returns still use the original physical closure safeguards.

Everything commits together or rolls back, including late audit, stock-header
and successor failures. Identical completed retries return the original result;
conflicting requests fail. Live access still applies to retries. Separate writer
connections serialize through the existing lock; stale concurrent requests
cannot replace the successful holder. Accessory returns/write-offs already
recorded before starting the handover remain true historical facts if it fails.

### D Verification

The Schema 19 foundation was separately pushed at
`0fe2408fe46a73e60aa614bad95e265d5812d1be` after **58 focused tests**.
The complete D runtime passed **146 focused tests**:

```sh
PYTHONPATH=tests:. python -m unittest test_device_handovers test_device_handovers_http test_device_handover_schema test_associated_equipment_writes test_associated_equipment_writes_http test_equipment_associations test_equipment_associations_http test_stock_circulation test_device_reissue test_assignment_closure test_feature_settings test_staff_directory_migration -q
```

This includes 24 new migration/writer/HTTP tests, Devices-only and registered
handover, repeated transfers, actual later return, hidden/historical accessories,
partial return/missing disposition, live permissions/session/MFA/features, CSRF,
origin, eligibility, stale versions, reservations, strict requests, replay,
parallel writers and late-failure rollback. The real HTTPS/SQLite Chromium
handover journey passed with **20 desktop/mobile light/dark captures**; the
existing association/missing-quantity journey also passed. JavaScript syntax,
Python compilation and diff checks passed. No complete local backend suite or
compatibility collection was repeated. Permanent evidence and final-head Actions
are E's next step; native/private-data acceptance remains deferred.

## Remaining Acceptance

Checkpoint E records the final draft instructions, genuine changed-screen
gallery and applicable final-head GitHub Actions. Keep PR #391 draft; no merge,
release, deployment, unrelated batch or production change is authorised.
