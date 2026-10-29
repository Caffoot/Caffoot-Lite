# Next — verified v1.3.3 compatibility investigation

**Status:** Technical evidence and open checks only. **No implementation authorised.**
**Sole Next scope/acceptance authority:** [Issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215).
**Behavioural baseline:** [Published v1.3.3 application](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html).
**Working branch:** `Next`. If this reference conflicts with #215 or the published source, correct this reference; never infer approval from it.

## 1. Scope boundary

Next replaces authoritative browser inventory storage with a backend and central SQLite database, deployed simply via Docker Compose/Portainer. Only #215's approved accounts, MFA, RBAC, first-run setup and simultaneous device edit-reservation behaviour may be added. Existing Devices, IPAM and Racks functionality, appearance, terminology, validations and outcomes remain those of published v1.3.3.

No new inventory features, device-type change workflow, ticketing, public registration, UI redesign or unapproved repair flows. Do not reproduce browser safety snapshots/recovery banners or ongoing in-app JSON export: #215 deliberately replaces those storage-specific mechanisms. Legacy JSON **import** remains for fresh backups exported from published v1.3.3 only, with applicable validation/review/confirmation. Users on older HTML releases must first upgrade to v1.3.3, check their inventory, and export a new JSON backup. Direct schema-0/schema-1 import is no longer required by revised #215. No implementation, new tests, merge or release is authorised by this document.

## 2. Verified published-source inventory and relationships

Published state includes `devices`, `subnets`, `vlans`, `racks`, `rackAccessories`, `ipAllocations`, `deviceTypes`, `deviceTypeGraphics`, `deviceLocations`, `serverFunctions`, `installedSoftware`, `managedOptionsCleared` and `softwareTypeExclusions`. These are **observed** keys, not a claim of an exhaustive field inventory. `normaliseState` merges default data with supported incoming state and performs legacy repairs; field-specific retention must be verified rather than assumed.

- **Devices:** observed core fields include `id`, `name`, `type`, `mountType`, `location`, `notes`, `status`, `manufacturer`, `model`, `serialNumber`, `typeDetails`, `virtualPlatform`, `virtualHostId`, `isVirtual`, `ipReserved`, `primaryIp`, `rackId`, `face`, `rackUStart`, `rackUEnd`, `rackUHeight`. Host changes may record `previousVirtualHosts` (`hostId`, `changedAt`, `action`) and `previousVirtualPlatforms` (`platform`, `hostId`, `changedAt`). Existing `handleDeviceSubmit` **rejects changing an existing device's type or virtual identity** with “Device identity cannot be changed. Create a new device instead.” No type-change workflow exists to migrate.
- **Variable details:** `getDetailFieldsForDeviceType` derives fields from device-type profiles and configured catalogues. `typeDetails` can contain supported historical booleans, numbers, strings and other type-specific values; historical top-level service flags such as `serverService_Hypervisor` are read by eligibility/platform logic. Preserve verified legacy and historical values without inventing controls for hidden fields. Replacement hypervisor hosts must meet published active physical-server/Hypervisor-service eligibility.
- **IPAM:** subnets include `id`, `cidr`, `name`, `vlan`, `gateway`, `description` and possible `parentId`/`kind`; VLANs include `id`, `vlanId`, `name`, `description`, `color`, possible `parentId`. `normaliseState` validation requires VLAN number integer 1–4094, unique VLAN record ID, and unique **(parent domain, VLAN number)** combination; the unassigned domain is shared. Subnet save matches VLAN by number **and** parent domain. Legacy VLAN ownership reconciliation refuses ambiguous/orphaned records and checks duplicate numbers within a domain. IP allocations are keyed by IP and can hold `status`, `deviceId`, `hostname`, `notes`, `reservedForDeviceId` and supported historical metadata. Preserve published primary-IP, gateway, subnet membership, reservation and competing-owner checks, including rollback on failed save.
- **Racks:** racks have observed `id`, `name`, `heightU`, `widthMm`, `depthMm`, `depth`, `type`, `location`; accessories include `id`, `rackId`, `type`, `name`, `face`, `startU`, `heightU`, `side`, `portCount`. Preserve device/accessory collisions, U range and face occupancy; vertical `pdu_vertical` and `cable_vertical` use independent left/right 0U rails. Existing alias normalisation maps `fan`→`fan_tray`, `pdu`→`pdu_horizontal`, `vent`→`ventilation`; no other aliases are authorised.
- **Managed catalogues:** configured software/services use stable keys, labels, applicability and archived state. Built-in software suggestions are derived, not automatically saved catalogue entries; `softwareTypeExclusions` affects available suggestions. Renaming a configured service retains its key. Software/service archival is **blocked while assigned** (checks nested and historical top-level flags); otherwise the entry is archived, not hard-deleted. Restoring archived software checks for conflicting available names. Published device details show assigned archived entries, supported by later test evidence.
- **History:** `recordAudit` retains at most 200 events, up to 60 change entries per event plus omitted count; existing categories include devices, subnets, racks, VLANs, allocations, device types and locations. Preserve existing Change History behaviour, not enterprise auditing. Published v1.3.3 History shows historical device details but deliberately **does not** include the removed “Restore Configuration” action.

## 3. Legacy JSON import — verified sequence and boundaries

Published `importData`:
1. Rejects files over 10 MiB; reads UTF-8 JSON and reports parse errors; recursively rejects unsafe object keys `__proto__`, `prototype`, `constructor`.
2. Validates required `devices`, `subnets`, `racks` arrays (50,000 maximum each), `ipAllocations` object (100,000 maximum), optional `rackAccessories` type and backup version metadata. Published v1.3.3 historically recognises missing `caffootBackup` metadata as schema 0 and validates supported metadata-bearing versions. **This describes source history, not Next's newly narrowed import contract:** #215 now supports only fresh v1.3.3 exports.
3. Detects incompatible Access Point mounting/rack assignments **before** normalisation; only when present, asks for explicit mounting choices and applies them to a deep copy. Cancel leaves inventory intact.
4. `normaliseImportedBackupAndPlanLegacyMountRepairs` creates another detached copy. For qualifying desktop/laptop/tablet legacy mount/location inconsistencies, it plans the existing correction (valid non-rack/Desktop mounting, Unknown location, cleared rack placement). It does not change device type or accept unknown mounts/dangling references.
5. `validateAndNormaliseBackupForImport` checks invalid mounts, complete application integrity and rack placement conflicts on the candidate. Only when planned legacy corrections exist does it show the existing review; cancellation stops import.
6. Presents the existing final confirmation with file name and incoming/current inventory counts. Cancel or validation failure leaves current inventory untouched. Published browser code then uses a verified safety snapshot, save verification and rollback. **Next must instead perform an atomic, inventory-only database replacement, leaving accounts, passwords, MFA and permissions untouched, per #215.** Do not reproduce browser snapshot/recovery machinery or its obsolete confirmation wording.

These conditional reviews are not guaranteed for every backup or particular schema version. Do not infer additional correction choices or universal acceptance of arbitrary unknown fields.

## 4. #215 architectural constraints — not additional functionality

- Device owns identity and host/guest relations; IPAM owns allocation, reservation and primary IP; Racks owns placement. Published device objects contain IP and rack fields, but Next must reconstruct the same displayed representation from **one** authoritative database model, not competing copies.
- Backend enforces existing validations atomically, including stale/competing IP and rack writes. Viewing is never locked; #215's short-lived exclusive **device** edit reservation spans Devices/IPAM/Racks, released on Save/Cancel/expiry.
- First administrator chooses credentials and enrols MFA; no hard-coded example username or public signup. Admins manage users; newly created users initially have no inventory access. Enforce approved role permissions and MFA, password changes and self/last-admin safeguards.
- SQLite table names, flexible field storage and API shapes are **unapproved implementation choices**, not requirements. Do not freeze DDL from this reference alone.

## 5. Historical evidence reconciled against later fixes

These are recorded test results, **not tests run during this investigation**. Earlier dated documents may describe draft PRs/open findings subsequently resolved; never use their historical status as current status.

| Behaviour | Recorded evidence and limitation |
| --- | --- |
| Guest unassign/retire/reassign, history and custom values | Legacy import matrix: #91 Chromium `40179316087` and historical missing-host JSON import/reload `40178800515`. Fictional fixtures, not every real backup. |
| Archived custom software/service backup/reload | Workflow coverage: #157 Chromium `40338184346`. That test alone did not prove display of archived assignments. |
| Archived assigned software/service **device-detail display** | **Later** #97 focused Chromium `40343778804`, followed by recorded regression `40348476895`. Supersedes the earlier display-evidence gap for tested cases. |
| Legacy accessory aliases and import/startup normalisation | #97 reconciliation and Chromium `40348476895`; corroborates the three published aliases, not arbitrary aliases. |
| Rack accessory import and collisions | Test-only PR #201: six fictional Chromium cases, including legacy no-accessory backup, malformed accessories, collisions and independent rails. |
| History persistence and late restore/reset rollback | Technical workflows: focused v1.3.3 Chromium `40594804262` (five scenarios). Browser-specific mechanism is **not** to be reproduced in Next. |
| Device History read-only and absent Restore Configuration | v1.3.3 browser upgrade test recorded in workflow coverage/audit programme; historical snapshots retained, restoration action removed. |
| Older schema-v1 import | Owner-reported manual v1.2.0 import in workflow register; explicitly **not** exhaustive field-by-field acceptance. |

Evidence sources: [legacy backup compatibility matrix](testing--LEGACY-BACKUP-IMPORT-COMPATIBILITY-MATRIX.md), [workflow verification coverage register](testing--WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md), [technical workflows](workflows--TECHNICAL-WORKFLOWS.md), [audit remediation programme](audits--AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md). Historical recommendations for extra startup recovery UI are **not** approved by #215.

## 6. Outstanding verification before design approval

1. Verify that fresh v1.3.3 JSON exports import completely and atomically, including inventory relationships, optional historical fields, and negative validation cases. Older schema-0/schema-1 direct import is out of Next scope after the product-owner decision; it remains a v1.3.3 upgrade concern.
2. Verify full save-time treatment of supported historical/hidden `typeDetails`, software/service rename/archive/restore variants and legacy top-level flags against source and tests; do not assume arbitrary unknown values are supported.
3. Verify exact existing IPAM, rack, device save and Change History outcomes, including failure/rollback, against retained tests and subsequent fixes.
4. Only then propose minimal field mapping, transaction/API boundaries and database DDL that implement #215 without changing v1.3.3 workflows. Seek product-owner decisions on genuine ambiguities, **never guess**.

**Provenance:** source-level findings above were read from the published v1.3.3 HTML; test claims are attributed to retained GitHub records, not independently rerun. This reference does not authorise implementation.

## Product-owner scope clarification — 2026-10-29

#215 was updated to require **v1.3.3-exported JSON only** for Next import. Older HTML users must upgrade to v1.3.3 first, verify inventory, and create a fresh export. Earlier paragraphs discussing older schema import are retained solely as historical source/evidence context, not Next acceptance requirements. The current User Guide notice was merged to `main` through [PR #216](https://github.com/Caffoot/Caffoot-Lite/pull/216), then changed to the release-neutral wording “the next version of Caffoot Lite” through [PR #217](https://github.com/Caffoot/Caffoot-Lite/pull/217). Published release assets/tags were not modified.

## Verified v1.3.3 export identification — 2026-10-29

Published v1.3.3 defines `CAFFOOT_BACKUP_FORMAT = 'caffoot-inventory'`, `CAFFOOT_BACKUP_SCHEMA_VERSION = 1` and `CAFFOOT_LITE_VERSION = '1.3.3'`. `createInventoryBackup(state)` deep-copies the current inventory and adds `caffootBackup: { format, schemaVersion, app: 'Caffoot Lite', appVersion, exportedAt }`. **Schema version 1 alone does not prove that a backup was exported by v1.3.3.** The approved Next import contract is a fresh v1.3.3 export, not arbitrary schema-v1 files. Implementation should validate the agreed export metadata and inventory integrity; do not claim this metadata is cryptographic proof of provenance. The documentation notice for existing users is merged in `main` (PRs #216 and #217).

## Preliminary authoritative data boundaries — source and #215 alignment (2026-10-29)

This is an **ownership map for review**, not database DDL, a new workflow, or approval to implement. Published v1.3.3 embeds cross-section fields within browser state; #215 requires one authoritative database owner and the same visible results.

| Existing displayed/edited information | One authoritative owner in Next | Cross-section consequence |
| --- | --- | --- |
| Device identity, name, type, attributes, status, type-specific/historical fields, host/guest links | Devices | IPAM and Racks reference stable device IDs; existing edit-time identity restriction remains |
| Subnets, VLAN domains, IP allocation status, reservation, assigned device and primary IP | IPAM | Device forms read and save through IPAM ownership; never store a second authoritative device primary IP |
| Rack definition, device face/U placement, accessories and independent vertical side rails | Racks | Device forms read and save through Racks ownership; never store a second authoritative device rack placement |
| Configured device types, managed options, service/software catalogue and exclusions | Shared inventory configuration, with one backend authority | Device forms derive the same available fields and labels; archive and assignment guards remain |
| Change History events | Backend Change History | Preserve existing event semantics/limits and existing visible history; no new enterprise audit feature |
| User credentials, MFA, roles and access grants | Separate authentication/authorisation data | Inventory import replaces **only inventory**; never touches accounts or grants |

**Save boundary:** a device save may affect Devices, IPAM and Racks together. #215 requires the backend to validate the effective user's permissions, exclusive device edit reservation and revision, plus existing allocation/placement constraints, and commit all affected records in one SQLite transaction or none. A cross-section update must not be split into independent commits. Reading or editing another device remains possible subject to existing rules and approved RBAC.

**Remaining source-verification gate:** enumerate exact save-path field writes and error/rollback outcomes for published `handleDeviceSubmit`, subnet/IP allocation handlers and rack/accessory handlers, and reconcile with retained tests before proposing physical tables or APIs. Do not derive a new data relationship from a field name alone.
