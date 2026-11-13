# Optional Features — Development Foundation

This is unpublished v2.2 development under [issue #238](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821230015). Schema/settings storage and API are implemented in Batch 1; Batch 2 adds effective feature guards and filtered responses. Optional/basic IP workflows, Rack form/preservation work and the three approved interface additions remain later batches. This branch is for review, not deployment.

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

The later interface must ask for confirmation every time, including empty inventories; cancellation sends no request. `confirmDisable` is a boolean acknowledgement, not a new security proof. Unknown keys, duplicate JSON fields, non-boolean values, extra fields and any Suppliers/Lifecycle mutation are rejected. Only Devices, IPAM and Network Racks can change. Success returns the current `features` object. Missing/invalid GET authentication returns 401; insufficient rights or failed POST authentication/Origin/CSRF returns 403; invalid JSON/shape/size/choice returns 400; non-JSON POST returns 415.

The service owns a write transaction, rechecks session validity and administrator/MFA status after obtaining the database lock, and commits the setting with its audit entry. A failure rolls both back. These endpoints do not depend on inventory section permissions.

## Review Checks

Focused tests are in `tests/test_feature_settings.py` and `tests/test_feature_settings_http.py`. They use temporary fictional data. The active [milestone handover](../development-handovers/milestone-01.md) records completed checks and the remaining batch boundary.

## Effective Access And Response Filtering

`permissions.can_access` requires the organisation feature to be enabled and the existing account/role/override/MFA policy to allow the operation. Missing and unknown choices deny access. Feature switches never change saved grants or MFA requirements. Administrator identity remains separate for Settings & Data, Users & Permissions and My Account.

Existing inventory writers recheck their section after obtaining a write lock. Import and Clean Start require all three enabled sections and existing Edit rights; feature-off cannot be bypassed through those operations. Device mutations through IPAM/Racks also require Devices to be enabled, without adding a new user grant. Independent Rack and IPAM record operations retain their existing permissions.

Read APIs use a single SQLite snapshot. Disabled collections, revision/editor metadata and device catalogue settings are excluded from unauthorised projections. IPAM-only allocation responses retain references but omit Device-derived hostnames. History is filtered for administrators too when a feature is disabled; full administrator history remains unchanged when all features are available. Partial-access validation errors do not expose hidden inventory names or addresses. No stored records or history are redacted or rewritten.

A device's existing primary address and placement references remain device-owned data; no hidden subnet, allocation collection or rack record is included in its response. Unrelated Device saves retain hidden relationships and leave disabled IPAM allocations untouched. Forged relationship changes and operations which would remove hidden relationships are refused. Omitted-field Rack form merging and optional/basic IP workflows remain later authorised batches.

The existing shell, navigation guards and permission display use effective access. An all-off administrator enters the existing Settings screen; ordinary users retain My Account. No Optional Features tab, new card, Link to IPAM or Rack form change is added.
