# Optional Features — Development Foundation

<a id="current-baseline-and-historical-scope--26-november-2026"></a>
## Current Baseline And Historical Scope — 27 November 2026

The current owner-approved application baseline is `0251b43a3b5d41d626aa022c6d7f9b4d860433da` (schema 31). All six switches are live: Devices, IPAM, Network Racks, Suppliers, Equipment Lifecycle and IT Assets. Earlier Stage 2/3 checkpoints and unavailable Stage 4 labels below are retained historical implementation descriptions, not the current availability table. Stages 4–5 are integrated at this baseline; final release/acceptance gates remain outstanding. No separate Service Desk switch exists.

Use the [reconciled Optional Features guide](../how-tos/features-and-instructions/v2.2-draft/Optional-Features-and-Link-To-IPAM.md) for current administrator procedures and independent access/retention requirements, and the standalone [Devices](../how-tos/features-and-instructions/v2.2-draft/Devices.md), [IPAM](../how-tos/features-and-instructions/v2.2-draft/IPAM.md) and [Network Racks](../how-tos/features-and-instructions/v2.2-draft/Racks.md) drafts for inventory work. Equipment Lifecycle uses Devices rights for physical Device information and administrator rights for settings/manual replacement overrides; it has no independent permission column.

All-off administrators retain authorised security/account/role history through the underlying history API, but Dashboard/Audit Trail navigation is unavailable without readable Devices, IPAM or Racks. Current Audit Trail timestamps remain ISO-style UTC (`YYYY-MM-DD HH:mm:ss UTC`), despite UK calendar-date entry elsewhere. Stock specification metadata remains foundation-only, with no general screen/API. These documented boundaries do not authorise application changes.

[Batch 2 source, links and screenshot review](Milestone-01-Batch-2-Review.md) records the reconciliation. Native acceptance stays deferred at Test 70; supported upgrades, complete-volume restoration, independent audit #443 and release gates remain outstanding. No published v2.2 image or upgrade acceptance is implied.

## Preserved Foundation And Dated Checkpoints

This is unpublished v2.2 development under [issue #238](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821230015). At the verified `milestone-1` integration HEAD `753b3266893987addb11406ef8303adb03c3c112` (17 November 2026, schema 20), Stage 2 and Stage 3 Batches 3.1–3.12 are merged. The implementation includes Staff/Departments, assignments, stock intake and readiness, issue/return/write-off, Device registration/reissue, Associated Equipment, Correct Movement and dashboard/Minimum Stock Level reporting. Dated development reports retain their original review checkpoints; use [Development Status](Development-Status.md) for current integration and acceptance boundaries. Batch 3.4 manual/native acceptance and wider Stage 6 verification remain deferred; Stages 4–6 are not completed. No published v2.2 installation, release or deployment is established by these merges.

[Stock Circulation](IT-Assets-Issue-Return-and-Write-Off.md) updates the existing IT Assets card description to match implemented workflows: “Receive, issue and return equipment, record checks and write off unusable items.” The card remains in Additional Features with the same styling, controls and disable confirmation. See the expanded [draft Optional Features guide](../how-tos/features-and-instructions/v2.2-draft/Optional-Features-and-Link-To-IPAM.md) for administrator procedures, independent section use, basic IPv4, explicit linking, Rack preservation and troubleshooting.

## Storage And Upgrade

Schema 13 adds `organisation_features`, separate from `inventory_settings`. Schema 16 adds `it_assets` to `devices`, `ipam`, `racks`, `suppliers` and `equipment_lifecycle`; values are booleans. SQLite still prevents enabling Suppliers and Equipment Lifecycle. See [IT Assets Foundation](IT-Assets-Foundation.md) for the transaction and stock safeguards.

A database with no application tables before initialisation starts with all optional features off. An existing database upgrading to schema 13 starts with Devices, IPAM and Network Racks on, even if its inventory is empty. Schema 16 preserves those saved choices and always adds IT Assets off. Suppliers and Equipment Lifecycle stay off. The migrations seed once, in the existing schema transaction. Restart and later upgrades retain choices.

Inventory imports replace inventory settings. Clean Start also clears operational module data and restores standard catalogues. Both retain the choices in this table. Existing whole-database backup/restore includes it; there is no separate backup mechanism. No toggle changes inventory records, roles, grants or sessions. Successful transitions append attributable history with the previous and new boolean; repeated unchanged values add no event. Existing inventory history retention rules still apply.

## Administrator API

`GET /api/settings/features` returns `{"features":{"devices":false,"ipam":false,"racks":false,"suppliers":false,"equipment_lifecycle":false,"it_assets":false}}` on a fresh database, including the current schema 20 implementation. It requires a live session for an active administrator with confirmed MFA. Responses use the existing no-store policy. Cross-site requests and any supplied foreign Origin are rejected; ordinary same-origin browser GET requests need no Origin header.

`POST /api/settings/features` uses the same identity, plus the existing configured Origin, session cookie and `X-CSRF-Token` checks. Send JSON of at most 4096 bytes:

```json
{"feature":"devices","enabled":true}
```

Every disable request must explicitly confirm the action:

```json
{"feature":"devices","enabled":false,"confirmDisable":true}
```

The interface asks for confirmation every time, including empty inventories; cancellation sends no request. `confirmDisable` is a boolean acknowledgement, not a new security proof. Unknown keys, duplicate JSON fields, non-boolean values, extra fields and any Suppliers/Lifecycle mutation are rejected. Devices, IPAM, Network Racks and IT Assets can change. Success returns the current `features` object. Missing/invalid GET authentication returns 401; insufficient rights or failed POST authentication/Origin/CSRF returns 403; invalid JSON/shape/size/choice returns 400; non-JSON POST returns 415.

The service owns a write transaction, rechecks session validity and administrator/MFA status after obtaining the database lock, and commits the setting with its audit entry. A failure rolls both back. These endpoints do not depend on inventory section permissions.

## Review Checks

The [Stage 2 final verification report](../development-handovers/evidence/stage-2-batch-5/Report.md) records the Batch 5 focused migration, persistence, security, Device/IPAM/Rack and browser evidence. It preserves the then-current checks and acceptance limits. Stage 2 acceptance is now recorded in the current summary above; Stage 6 integration and complete-volume restore verification remain pending.

Focused tests are in `tests/test_feature_settings.py`, `tests/test_feature_settings_http.py`, `tests/test_feature_access.py` and `tests/feature-access.cjs`. They use temporary fictional data. The active [milestone handover](../development-handovers/milestone-01.md) records completed checks and the remaining batch boundary.

## Effective Access And Response Filtering

`permissions.can_access` requires the organisation feature to be enabled and the existing account/role/override/MFA policy to allow the operation. Missing and unknown choices deny access. Feature switches never change saved grants or MFA requirements. Administrator identity remains separate for Settings & Data, Users & Permissions and My Account.

Existing inventory writers recheck their section after obtaining a write lock. Import and Clean Start require all three enabled sections and existing Edit rights; feature-off cannot be bypassed through those operations. Device mutations through IPAM/Racks also require Devices to be enabled, without adding a new user grant. Independent Rack and IPAM record operations retain their existing permissions.

Read APIs use a single SQLite snapshot. Disabled collections, revision/editor metadata and device catalogue settings are excluded from unauthorised projections. IPAM-only allocation responses retain references but omit Device-derived hostnames. History is filtered for administrators too when a feature is disabled; full administrator history remains unchanged when all features are available. Partial-access validation errors do not expose hidden inventory names or addresses. No stored records or history are redacted or rewritten.

A device's existing primary address and placement references remain device-owned data; no hidden subnet, allocation collection or rack record is included in its response. Unrelated Device saves retain hidden relationships and leave disabled IPAM allocations untouched. Forged relationship changes and operations which would remove hidden relationships are refused. Omitted-field Rack form merging is described below. Optional/basic IP workflows are covered below.

The existing shell, navigation guards and permission display use effective access. An all-off administrator enters the existing Settings screen; ordinary users retain My Account. Batch 4 adds the approved tab, statistic, Link control and Rack form integration described below.

## Optional Device Addresses And Explicit Linking

Devices Edit can create a Device with an empty `primaryIp`, with IPAM on or off. New nonempty addresses while IPAM is off are saved as `primaryIpMode: "basic"`; no subnet or allocation is created. Basic addresses remain basic and editable with Devices Edit after IPAM is enabled, including when their subnet later exists. A normal Device save cannot remove their marker to link them. Clearing a basic address retains its mode so a Devices editor can enter another basic address after IPAM has been enabled; only explicit linking changes it to managed. Existing nonempty unmarked records remain managed; they cannot be silently converted to basic. Managed changes still require effective IPAM Edit, and existing managed addresses are read-only while IPAM is off.

The live validator permits basic addresses only with canonical, valid, unique IPv4 and no incompatible assignment/reservation or reservation flag. All other Device/inventory integrity checks remain. The published v1.3.3 normalisation/import validator remains separate and rejects this internal marker; this is not a new portable import format. Reconciliation and repair never create allocations for basic addresses.

`POST /api/devices/ipam/link` uses the existing Origin, session and CSRF controls, with a 4096-byte JSON limit and duplicate-field rejection. Its exact payload is:

```json
{"deviceId":"device-id","revision":0,"subnetId":"existing-network-id","primaryIp":"192.0.2.10"}
```

The supplied subnet must already exist, be a managed network and contain the usable host address. Both effective Devices Edit and IPAM Edit and a live session are rechecked under the write lock. A changed revision/address, non-basic record, active Device edit, unavailable feature, protected gateway, conflicting address representation or incompatible reservation saves nothing. Existing allocation notes are retained when an available record is linked. The marker is removed, the existing allocation authority is updated and the Device revision advances atomically with attributable history. Success returns `{"revision":1}`. Cancel = no POST and no change. The Batch 4 visible control is described below.

The existing Device form keeps its layout and styles. IP and subnet are no longer mandatory for a no-IP save. While IPAM is off, the same address field accepts optional basic IPv4 and managed subnet/allocation controls are hidden. Already-basic records keep that field after IPAM is enabled; unmarked managed references are read-only without effective IPAM Edit. The ordinary IPAM allocation display/repair logic does not infer an assignment from a basic address, and next-available suggestions avoid known basic addresses. The Batch 4 interface additions are described below.

## Optional Features Interface And Rack Preservation

The fourth Settings & Data tab uses the existing administrator-only feature API. Devices, IPAM, Network Racks and IT Assets have live switches, descriptions and saved Enabled/Disabled states. IT Assets remains independently off by default. Its existing Additional Features card now says “Receive, issue and return equipment, record checks and write off unusable items.” Disabling hides its navigation and denies stock reads/writes, while preserving all records and grants. Every disable asks for confirmation, even with no inventory; cancelling sends no mutation. Suppliers and Equipment Lifecycle stay disabled with Coming in Stage 4 status. All-off administrators keep Settings and Users access. Existing Data & Backups, Email Settings and System Maintenance panels are retained.

With Racks off, Device forms hide Rack-only selectors/actions and retain type-specific non-Rack choices. Existing mounted/shelf-linked Devices keep their exact saved placement and Location on unrelated edits. The server supplies omitted fields under the write lock and refuses explicit changes to protected values. Hidden fields are omitted by the form adapter, but preservation does not rely on the browser. No rack, shelf or allocation is created or detached by this merge. Enabled Racks retain their current workflows and permissions.

The saved combined snapshot includes `basicIpsOutsideSubnets` only with both effective Devices Read and IPAM Read. It counts nonblank basic addresses outside all configured managed network ranges, including network/broadcast boundaries as inside; containers do not substitute for managed network subnets. The existing IPAM Overview statistic reads this value, without a repair or write.

Device Details → Network shows Link to IPAM only for a nonblank basic address with IPAM enabled and both effective Edit grants. Its chooser lists suitable existing subnets. No candidate gives clear existing-IPAM setup guidance and disables submission. Cancel saves nothing; submission uses the existing revision/address-bound operation. Stale/conflicting requests show validation without silently adopting a new address or revision. No new grants or alternate linking operation are introduced.

## Approved Design Correction

The Optional Features panel follows the actual
[approved integrated design](https://github.com/Caffoot/Caffoot-Lite/blob/159424b56bb770ea6ab260764c4e9357d9c8667c/future-design/stage-2-previews/caffoot-optional-features-integrated-settings-review.html)
and [owner approval in #238](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6820547757).
It restores the Optional Features heading and explanation, the exact Your Information
Stays Safe banner, Infrastructure and Additional Features groups, and the source
card icons, descriptions, dividers, bottom status badges and contextual switch labels.
Suppliers and Equipment Lifecycle retain their unavailable Stage 4 indications.
That Stage 2 correction added no Staff, Department or IT Assets switches.

`hydrateOptionalFeatureSettings` still reads the live feature API and displays its
saved values. The existing disable confirmation, cancellation, pending controls,
error handling and secured save path are retained. `settings/optional-feature-card`
contains the approved article structure; integration rules in `components.css` are
scoped to `.optional-features-panel`. The pinned `settings.css`, three existing tab
panels, navigation, logo and header remain unchanged. The illustrative review badge,
sidebar, default state and footer are not copied into the application.

The [visual mapping, before/after/source captures and focused results](../development-handovers/evidence/optional-features-design-correction/Report.md)
record the correction and retained differences.

The linked report preserves its original pre-acceptance review checkpoint.
Subsequent [owner-reported Stage 2 native Raspberry Pi/Safari acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6875770728)
records the focused correction retests and retained Rack/Shelf relationships.
That evidence does not establish acceptance of later Stage 3 workflows, full
upgrade/restore verification or a v2.2 release or deployment.
