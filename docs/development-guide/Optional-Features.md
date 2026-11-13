# Optional Features — Development Foundation

This is unpublished v2.2 development under [issue #238](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821230015). Schema/settings storage and API are implemented in Batch 1; Batch 2 adds effective feature guards and filtered responses. Batch 3 adds optional/basic Device addresses, the existing form behaviour and explicit backend linking. Batch 4 integrates Rack preservation and the three approved interface additions described below. This branch is for review, not deployment.

## Storage And Upgrade

Schema 13 adds `organisation_features`, separate from `inventory_settings`. The allowlisted keys are `devices`, `ipam`, `racks`, `suppliers` and `equipment_lifecycle`; values are booleans. SQLite also prevents enabling the two future features.

A database with no application tables before initialisation starts with all five off. An existing database upgrading to schema 13 starts with Devices, IPAM and Network Racks on, even if its inventory is empty. Suppliers and Equipment Lifecycle stay off. The migration seeds once, in the existing schema transaction. Restart and later upgrades retain choices.

Inventory imports and Clean Start replace inventory settings, but never this table. Existing whole-database backup/restore includes it; there is no separate backup mechanism. No toggle changes inventory records, roles, grants or sessions. Successful transitions append attributable history with the previous and new boolean; repeated unchanged values add no event. Existing inventory history retention rules still apply.

## Administrator API

`GET /api/settings/features` returns `{"features":{"devices":false,"ipam":false,"racks":false,"suppliers":false,"equipment_lifecycle":false}}` on a fresh installation. It requires a live session for an active administrator with confirmed MFA. Responses use the existing no-store policy. Cross-site requests and any supplied foreign Origin are rejected; ordinary same-origin browser GET requests need no Origin header.

`POST /api/settings/features` uses the same identity, plus the existing configured Origin, session cookie and `X-CSRF-Token` checks. Send JSON of at most 4096 bytes:

```json
{"feature":"devices","enabled":true}
```

Every disable request must explicitly confirm the action:

```json
{"feature":"devices","enabled":false,"confirmDisable":true}
```

The interface asks for confirmation every time, including empty inventories; cancellation sends no request. `confirmDisable` is a boolean acknowledgement, not a new security proof. Unknown keys, duplicate JSON fields, non-boolean values, extra fields and any Suppliers/Lifecycle mutation are rejected. Only Devices, IPAM and Network Racks can change. Success returns the current `features` object. Missing/invalid GET authentication returns 401; insufficient rights or failed POST authentication/Origin/CSRF returns 403; invalid JSON/shape/size/choice returns 400; non-JSON POST returns 415.

The service owns a write transaction, rechecks session validity and administrator/MFA status after obtaining the database lock, and commits the setting with its audit entry. A failure rolls both back. These endpoints do not depend on inventory section permissions.

## Review Checks

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

The fourth Settings & Data tab uses the existing administrator-only feature API. Devices, IPAM and Network Racks have live switches, descriptions and saved Enabled/Disabled states. Every disable asks for confirmation, even with no inventory; cancelling sends no mutation. Suppliers and Equipment Lifecycle stay disabled with Coming in Stage 4 status. All-off administrators keep Settings and Users access. Existing Data & Backups, Email Settings and System Maintenance panels are retained.

With Racks off, Device forms hide Rack-only selectors/actions and retain type-specific non-Rack choices. Existing mounted/shelf-linked Devices keep their exact saved placement and Location on unrelated edits. The server supplies omitted fields under the write lock and refuses explicit changes to protected values. Hidden fields are omitted by the form adapter, but preservation does not rely on the browser. No rack, shelf or allocation is created or detached by this merge. Enabled Racks retain their current workflows and permissions.

The saved combined snapshot includes `basicIpsOutsideSubnets` only with both effective Devices Read and IPAM Read. It counts nonblank basic addresses outside all configured managed network ranges, including network/broadcast boundaries as inside; containers do not substitute for managed network subnets. The existing IPAM Overview statistic reads this value, without a repair or write.

Device Details → Network shows Link to IPAM only for a nonblank basic address with IPAM enabled and both effective Edit grants. Its chooser lists suitable existing subnets. No candidate gives clear existing-IPAM setup guidance and disables submission. Cancel saves nothing; submission uses the existing revision/address-bound operation. Stale/conflicting requests show validation without silently adopting a new address or revision. No new grants or alternate linking operation are introduced.
