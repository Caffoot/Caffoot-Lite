# Device Stock Registration And Reissue

> Draft v2.2 — Not Yet Published. Batch 3.9 is in development; no visual acceptance,
> merge, release or deployment is claimed.

## Preflight And Approved Approach

Verified starting integration HEAD: `7f11598b50bbb1fbd11893a2ad34bc152ff12ed1`.
Work belongs on `feat/it-assets-device-registration-reissue`, targeting `milestone-1`.
The supplied owner instruction authorises this combined batch. Decisions are in
[#368](https://github.com/Caffoot/Caffoot-Lite/issues/368),
[#352](https://github.com/Caffoot/Caffoot-Lite/issues/352),
[#232](https://github.com/Caffoot/Caffoot-Lite/issues/232),
[#292](https://github.com/Caffoot/Caffoot-Lite/issues/292) and
[#351](https://github.com/Caffoot/Caffoot-Lite/issues/351).
The [Ubiquiti amendment](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6909396062)
applies to both UPS and PDU suggestions.

| Existing Entry Point | Transaction, Validation And Controls To Preserve |
| --- | --- |
| `backend/server.py` Device create/edit routes | Existing session, MFA, Origin and CSRF authentication; direct creation needs Devices Edit only, with independent IPAM/Racks checks where applicable |
| `backend/device_saves.py:create_device` | Owns `BEGIN IMMEDIATE`, commit and rollback; prepares rack/address fields, checks Device ID, validates normalised/live inventory and rack conflicts, inserts canonical Device, IPAM allocation and attributed audit |
| `backend/device_saves.py:save_reserved_device` | Requires original revision and unexpired actor-owned reservation; rechecks effective permissions, restricts section-specific writes and preserves related guests |
| `backend/stock_intake.py` | `stock_write_access` checks live session and IT Assets Edit; `stock_item` derives actual quantity and unit balances from closed journal entries; version/digest and operation replay protect stale/repeated writes |
| `backend/stock_schema.py` | Existing `registered` header closes exactly two entries: one quantity Ready out and one linked Device unit Ready in, on the same item; identity/source permanence, deferred references, non-negative balances and immutable history remain intact |
| `backend/device_assignments.py:assign_devices` | Owns immediate transaction; initial allocation rejects any assignment or stock history. Keep this rule. Restricted recipient lookup returns eligible names/IDs only |
| `backend/assignment_closure.py` | Schema 17 permits only one-way audited closure against a matching new return/write-off. Original assignments and unique current-holder constraint remain intact |
| `backend/stock_circulation.py` | Existing physical return/preparation establishes genuine held/Ready states. Reuse recipient, Device edit-reservation, movement, snapshot and audit helpers; never infer possession from operational Status |
| `interface/application.js` | `openDeviceModal`, `captureDeviceFormDraft`, `captureDeviceDetailFieldValues`, existing submit handler and central `saveDevice` bridge own approved Add/Edit validation, five tabs, rack/IPAM controls and draft preservation |
| `interface/stock-intake.js` | Existing stock cards/forms, inventory detail actions, registered Device views, recipient picker and movement history supply source selection and reissue patterns |
| `interface/equipment.js`, `interface/screens/device-details.html` | Existing Assigned To tab, Staff/Department relationships and employee-safe My Equipment use canonical assignments; no second assignment store |

## Planned Technical Boundaries

Extract only the existing Device creation transaction body into a helper that
requires an active transaction and never commits. Direct creation retains its
public transaction-owning wrapper. Stock registration calls the helper under its
own immediate transaction, then links one stock unit and appends one registered
movement plus audit. Failure rolls back Device, IPAM, stock and audit together.
Compatible selection is quantity-tracked Desktop, Laptop or physical Server with
positive **unregistered Ready** balance. Shared prefill excludes name, serial,
network, location, rack and assignment. Save revalidates compatibility and balance.

Reissue is a separate session-verified operation requiring Devices Edit and IT
Assets Edit. It checks actual unit Ready/held balance, canonical physical identity,
current assignment, revision/history version and edit reservations under the write
lock, inserts a new permanent assignment and matching issue movement atomically.
It preserves Device configuration and operational Status. Identical operation
retries return their saved result; changed/stale requests fail without mutation.

Hardware additions use optional `typeDetails` data in the existing JSON Device
record, without a migration or another database. Storage Type is separate from
capacity/unit. Physical Server Boot Storage and pool/VDEV records are optional;
an existing boot pool is referenced once. Legacy RAID Type, drive count and
Storage Size/Unit remain independently entered historical fields: no automatic
calculation, overwrite or reinterpretation. The preview's unresolved relationship
does not require a new relationship to deliver these independent documentation
fields. Any need to alter that boundary must return to the owner.

## Interface Authority

The current accepted v2.1 editor and Details layout, shared styles and navigation
remain authoritative. The pinned source is
`c26db4a56bbc30f95b56201e81a7a76d13c6037b:future-design/approved/devices-details-forms-batch-04.html`,
indexed in [Approved HTML Integration](Approved-HTML-Integration.md).
The functional equipment journey and Server storage previews are read from
`docs/milestone-01-stage-2-3-previews:future-design/stage-3-previews/`.
They supply behaviour only; no demo shell, example data or replacement style is
to be copied. New controls must use existing local patterns, Title Case,
keyboard access, responsive layout and both themes.

## Checkpoints And Verification

1. Preflight/source mapping (this document).
2. Atomic registration backend with focused tests; open one draft PR.
3. Existing Add Device integration with real-browser checks.
4. Separate reissue backend/interface with permission/history tests.
5. Optional hardware and exact manufacturer suggestions with type-specific checks.
6. Draft instructions, genuine changed-screen captures and final applicable checks.

Commit and push each coherent checkpoint. Full final-head backend, browser,
Docker, documentation and existing Actions gates remain required before acceptance.
Native Pi/Safari, private legacy export and Stage 6 full-volume restore remain
deferred. No testing is claimed by this preflight-only checkpoint.

## Registration Backend Checkpoint

The normal Device creation body now has a transaction-requiring, non-committing
helper; direct creation keeps its transaction-owning wrapper. Protected
`GET /api/it-assets/device-sources` and `POST /api/it-assets/register-device` reuse
stock request parsing, effective permissions, session/MFA, Origin and CSRF checks.
Registration rechecks the source/version/Ready balance and unique canonical name,
ID and optional supplied serial under the lock. The existing journal publishes
the matching two-entry transfer. Identical actor-scoped retries return the saved
result; changed requests cannot reuse a reference. Schema 16/17 are unchanged.

Actual focused run: **152 tests passed** using
`PYTHONPATH=tests:. python -m unittest test_device_stock test_reserved_device_saves test_optional_device_addresses test_stock_intake test_stock_circulation test_it_asset_stock_schema -q`.
This covers rollback after Device/IPAM persistence, accounting, competing writes,
retry/stale selection, physical compatibility, optional serial, feature/session
gates, existing direct creation, stock circulation and schema protections.
An initial new-test import/fixture error was corrected before this passing run.
Interface, reissue, hardware, screenshots and final checks remain pending.

## Existing Add Device Integration Checkpoint

Brand New — Get From Stock is an optional control inside the existing General
card of Add Device. It loads only the protected compatible-source projection and
prefills common fields. The existing five-tab editor and save validation remain.
A matching authorised Stock Item Details action opens that same editor. Source
selection, cancellation and editing fields do not write anything. A stale-source
failure remains inline beside the stock control. Direct creation remains available.

The real HTTPS/SQLite Chromium check passed via
`CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/device-stock-interface.cjs`:
both entry points, shared prefill, blank individual identity/networking, unchanged
quantity before save/cancel, and the 10 → 9 unregistered / 10 held save result.
No page errors. Initial harness selectors were corrected for the existing fixed
footer and hidden-on-close modal before the passing run. Both changed JavaScript
files passed `node --check`. Reissue, hardware, captures and final gates remain.
