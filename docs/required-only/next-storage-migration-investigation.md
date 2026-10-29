# Next — v1.3.3 storage migration investigation (working reference)

**Status:** Read-only technical investigation and planning; **not an implementation authorisation**.  
**Authority:** [Issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215) alone defines approved scope and acceptance. If this reference conflicts with #215 or published v1.3.3 behaviour, the latter evidence and #215 prevail.  
**Baseline:** [Published v1.3.3 HTML](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html).  
**Branch:** Next. No application changes are authorised by this document.

## Prior handover and work retained

Earlier sessions established the published v1.3.3 baseline, Next branch, required-only technical documentation, and reconciliation of historical audits and fixes. Preserve existing screens, workflows, import correction choices, custom/historical data, tests and safeguards. Do not re-open closed findings or introduce new inventory features. Earlier preparation was not lost; this file consolidates **the recent source-level mapping** rather than claiming to reproduce every prior chat or test result. Consult existing GitHub documents and test evidence before implementation.

## Verified published-source storage

The browser state includes `devices`, `subnets`, `vlans`, `racks`, `rackAccessories`, `ipAllocations`, `deviceTypes`, `deviceTypeGraphics`, `deviceLocations`, `serverFunctions`, `installedSoftware`, `managedOptionsCleared`, and other supported fields identified by source/test evidence. Normalisation merges original root data; preservation and validation of individual fields must be verified, not assumed.

- **New device:** `id`, `name`, `type`, `mountType`, `location`, `notes`, `status`, `manufacturer`, `model`, `serialNumber`, `typeDetails`, `virtualPlatform`, `virtualHostId`, `isVirtual`, `ipReserved`, `primaryIp`, `rackId`, `face`, `rackUStart`, `rackUEnd`, `rackUHeight`. Host changes can append `previousVirtualHosts` entries containing `hostId`, `changedAt`, `action`.
- **New rack:** `id`, `name`, `heightU`, `widthMm`, `depthMm`, formatted `depth`, `type`, `location`.
- **Rack accessory:** `id`, `rackId`, `type`, `name`, `face`, `startU`, `heightU`, `side`, `portCount`. Vertical `pdu_vertical` and `cable_vertical` use left/right 0U side rails, separately from horizontal face occupancy. Placement validation rejects overlaps and out-of-range U positions.
- **Subnet:** existing fields are spread into the proposed record on edit; known fields include `id`, `cidr`, `name`, `vlan`, `gateway`, `description`, optional `parentId` and historical hierarchy attributes such as `kind`.
- **VLAN:** observed fields include `id`, `vlanId`, `name`, `description`, `color`, optional `parentId`. Exact uniqueness scope remains to be verified against the published validators and tests.
- **IP allocation:** keyed by IP; includes `status`, `deviceId`, `hostname`, `notes`, and possible `reservedForDeviceId` and other preserved fields. Existing code validates gateway/device-type restrictions, configured subnet membership, reservations and conflicting owners before releasing an old address; released addresses retain address-specific metadata.
- **Managed settings:** device types, locations, graphics, software and server service catalogues; software/service entries have stable `key`, `label`, optional `deviceTypes` and archival data. Removing a catalogue option does not imply erasing existing device values. Built-in suggestions are not automatically saved options.

These are observed fields, **not an exhaustive assertion that no other historical fields exist**.

## Proposed ownership mapping (subject to review)

| SQLite logical records | Authority and reconstruction |
| --- | --- |
| `devices` | Device identity, attributes, host–guest relationships and record-scoped historical/custom fields |
| `subnets`, `vlans`, `ip_allocations` | IPAM owns hierarchy, VLANs, allocations, reservations and primary device IP assignment |
| `racks`, `rack_device_placements`, `rack_accessories` | Racks owns definitions and all placement facts |
| `managed_settings` | Existing managed lists, catalogues and graphics with stable keys |
| `change_history` | Existing event content and retention semantics |
| Separate authentication/permissions tables | Never overwritten by inventory migration |

The current v1.3.3 device object includes primary IP and rack position, and normalisation repairs IPAM from device fields. **Next intentionally changes internal authority** under #215: the backend must assemble the same user-visible device representation from authoritative IPAM and Racks relations. No competing stored copies or whole-inventory JSON authority. Record-specific flexible attributes are permissible for supported variable/historical values; they must not duplicate authoritative allocation/placement fields. The table names above are provisional, not approved DDL.

## Existing validation and migration behaviour to preserve

- Legacy Settings JSON import accepts supported schema 0 and schema 1, validates version metadata, rejects unsafe object keys (`__proto__`, `prototype`, `constructor`), requires arrays for devices/subnets/racks and object `ipAllocations`, checks 50,000 maximum per required collection and 100,000 allocations, and limits input files to 10 MiB.
- Import runs on detached candidate data; Retain the source-supported Access Point/legacy mounting correction choices and their applicable review steps; verify which steps apply to each supported import schema. Validate inventory integrity and rack collisions, show the existing preview and require the existing final confirmation. Cancellation or failure leaves inventory intact. Preserve IDs, managed options, supported historical/custom attributes and relationships as established by published source and tests.
- In Next, perform an inventory-only atomic database replacement; never overwrite accounts, passwords, MFA or permissions. Browser safety snapshots, recovery banners and ongoing JSON export/backup are **not** carried forward. Ongoing backup/restore uses external Docker/volume/database tools, per #215.
- IPAM checks include primary-IP uniqueness, subnet membership, gateway eligibility and independent reservation ownership; stale/competing writes must be rejected. Rack checks include front/rear face, U range, device/accessory collisions, and independent vertical side-rail occupancy.
- Published `auditChanges` compares devices, subnets, racks, VLANs, IPAM allocations, device types and locations; do not invent new tracked categories. `recordAudit` retains up to 200 events, up to 60 change entries per event and `omitted` count, with timestamp/reason/action/kind/label/changed fields. Backend must preserve outcomes and limits without an enterprise audit redesign.
- New first administrator chooses credentials and enrols mandatory MFA; admins create users, no public registration, default new-user inventory access denied until granted, MFA mandatory for effective editors/admins, read-only optional, and protect own/last active admin. Two viewers can view concurrently; one short-lived device edit reservation across Devices/IPAM/Racks; save/cancel/expiry and stale-save rules per #215.

## Design checkpoints remaining before implementation approval

1. Verify all nested `typeDetails` and historical field variants against tests and retained technical workflows, including orphaned catalogue keys and legacy schema 0/1.
2. Define precise field-to-table and reverse reconstruction mapping, preserving supported unknown fields and data types without duplicate authorities.
3. Define atomic device save, IP/rack conflict validation, device edit reservation/revision and permission checks at the backend boundary.
4. Define legacy import conversion and review sequence, transaction boundaries and rollback; explicitly test that user accounts remain untouched.
5. Compare compatibility outcomes against published v1.3.3 and existing passing test evidence; reconcile historical findings against later fixes.
6. Review proposed SQLite DDL and API only after this evidence pass. **No coding, new tests, merges or releases until separately authorised.**

## Provenance / confidence

This reference records verified observations from direct reads of the published v1.3.3 HTML during the current investigation, plus explicitly labelled proposals and #215 requirements. It is not a claim that tests have been executed or that every source field has been catalogued. GitHub source and issue #215 remain authoritative.


## Additional verified compatibility findings — nested device history and legacy aliases (2026-10-29)

- **Virtual platform history:** when a guest changes host or a host's hypervisor product changes, published code can append `previousVirtualPlatforms` entries with `platform`, `hostId`, `changedAt`. This is separate from `previousVirtualHosts` and must be preserved in order, without inventing a new user-facing history workflow.
- **Hypervisor eligibility:** a replacement host must be an active `Server - Physical` with the Hypervisor service enabled. Published code checks both `typeDetails.serverService_Hypervisor` and the historical top-level `serverService_Hypervisor` boolean. The migration must not silently discard or ignore historical top-level service flags when reconstructing eligibility.
- **Legacy rack accessory type aliases:** published `normaliseLegacyRackAccessoryTypes` converts `fan` → `fan_tray`, `pdu` → `pdu_horizontal`, and `vent` → `ventilation` on a detached copy. Unknown types are not silently accepted. Preserve these accepted conversions and the resulting placement validations.
- **Legacy device location:** published `migrateLegacyRackLocation` converts `location: "Racked"` to `"Unknown"` when the device is rack-mounted or has a rack ID. Do not treat that historical display location as a rack-placement authority.
- **History tab:** published device-detail rendering distinguishes current type-compatible fields from historical fields; do not flatten or discard values just because the active form for a device type no longer exposes them.

**Open verification:** enumerate all historical top-level service/software flags and type-specific detail keys from source and retained tests before freezing a device attribute schema. The above findings are source-verified; any proposed table representation remains provisional.


## Additional verified findings — dynamic device fields and software preferences (2026-10-29)

Published v1.3.3 dynamically derives `getDetailFieldsForDeviceType(type)` from `deviceTypeDetailGroups`, `deviceDetailFieldProfiles`, configured server services, and available software catalogue entries. Device `typeDetails` is therefore variable by device type and catalogue state, not a universal fixed set of SQL columns. Preserve supported historical/custom keys and their value types as verified by published validation and import behaviour; do not treat arbitrary unrecognised keys as automatically approved functionality.

- `booleanDeviceDetailFields` includes legacy software and server-service flags (e.g. `Swan`, `SQLServer`, `ActiveDirectory`, `DNS`, `DHCP`, `BackupSoftware`) plus hardware booleans `serialPort` and `usbPort`. `numericDeviceDetailFields` includes `memory`, `storage`, `driveCount`, `handsetCount`, `powerOutlets`. Other device detail values use existing field choices/labels; do not coerce historical types without matching published normalisation.
- `getAvailableSoftwareCatalogueEntries` merges non-archived configured entries with built-in suggestions. Built-in entries have generated `catalogSoftware_...` keys and `builtin:true`; configured keys/labels can override or suppress suggestions. Do not persist inferred built-in suggestions as if they were explicitly configured catalogue records.
- `getSoftwareFieldsForDeviceType` filters entries by `deviceTypes` (case-insensitive) and, for built-in suggestions, by `appState.softwareTypeExclusions`. This top-level map is an additional preserved managed inventory setting not listed in the original default-data inventory; preserve it and any supported historical settings rather than reducing migration to a fixed default-data key list.
- `getEffectiveDevicePlatform` and `getEffectiveDevicePlatformVersion` choose hypervisor product/version for physical hypervisors, otherwise software platform/OS/version; they also recognise historical top-level `serverService_Hypervisor`. This is a derived read behaviour and must be reconstructed without changing filters or labels.
- Device details and historical tabs depend on current type compatibility and retained values. **Existing device identity/type cannot be changed through the edit workflow**: `handleDeviceSubmit` rejects any edit where `type !== originalDevice.type` or the virtual identity differs, with `Device identity cannot be changed. Create a new device instead.` Hidden fields can arise from historical imports, managed catalogue changes, or older representations; they must not be described as arising from a supported device-type change.

**Proposed mapping refinement:** keep device identity/host relationship in relational core, consider proportionate device-scoped storage for verified variable `typeDetails` and supported historical attributes, and preserve `softwareTypeExclusions` within managed inventory settings. Maintain the v1.3.3 read projection for software/service availability. These are implementation proposals, not approved SQL or permission to code.

**Still to verify:** full `deviceDetailFieldProfiles` by device category, save-time coercion/retention of hidden keys, catalogue rename/delete behaviours and tests; distinguish every persisted managed setting from view-only suggestions.

## Correction — immutable device identity (2026-10-29)

Product owner identified an inaccurate earlier explanation that historical fields must survive *device-type changes*. Published v1.3.3 does **not** permit changing an existing device's type. Verified in `handleDeviceSubmit`: on edit, the submitted type and virtual identity are checked against the original device and a mismatch produces `Device identity cannot be changed. Create a new device instead.` Next must retain this validation and outcome. Preserve historical/custom fields from supported imports and catalogue changes without inventing a device-type-change workflow. This corrects the earlier narrative; no scope change is authorised.

## Scope discipline and review disposition (2026-10-29)

**Mandatory:** #215 is the only approved Next specification; published v1.3.3 and existing test evidence establish baseline behaviour. No inferred feature, schema choice or historic workaround is authorised by this investigation. Where evidence is incomplete, mark **unverified** and investigate or ask the product owner. Never silently promote a proposal to a requirement.

**Explicitly excluded:** editing an existing device's type or virtual identity (published edit handler prohibits it); new controls for hidden historical fields; automatic promotion of built-in catalogue suggestions to saved options; any new inventory workflow, UI redesign or browser-era backup/recovery feature not authorised by #215.

**Retained solely as compatibility evidence:** historical field names, old accessory aliases, old location repairs and prior virtual host/platform histories. These document how existing supported data is read or imported; they are **not** invitations to expose additional workflows.

**Open verification before design:** exact VLAN uniqueness scope; schema-specific import review/correction paths; whether a given unknown field is supported by published validation; catalogue rename/remove behaviour; save-time handling of hidden detail keys. Do not resolve these by assumption.

**Provisional only:** table names, flexible attribute representation and other database mapping suggestions in this document. Their sole purpose is to evaluate a minimal implementation of #215, not to prescribe extra architecture.


## Verified source checks — VLAN reconciliation, catalogue archive, import mounting (2026-10-29)

These findings are **existing v1.3.3 behaviours only**, not new requirements or workflows.

1. **Legacy VLAN ownership reconciliation:** `reconcileLegacyVlanOwnership` first refuses ambiguous/orphaned records. It proposes ownership for uniquely matched records and checks uniqueness using `(parentId || '__unassigned__') + ':' + String(vlanId)`; a duplicate in the same domain blocks that reconciliation. This **does not establish** the complete VLAN create/edit uniqueness rules; those remain unverified.
2. **Server-service archive:** `confirmServerServiceArchive` shows assigned-device counts/names. `archiveServerService` independently blocks archival if any device uses the service, checking both `typeDetails[key]` and historical top-level `device[key]`. Otherwise it archives the configured record or records an archived override for a built-in option; the stable key and existing device values are not deleted. Renaming an existing configured service changes its label while retaining its key.
3. **Installed-software removal:** `confirmSoftwareCatalogueRemoval` displays assigned-device information; `archiveSoftwareCatalogueEntry` blocks removal while any device has the software assigned (nested or historical top-level), then archives the entry, retaining its key and existing records. `restoreArchivedSoftwareEntry` checks for a conflicting available label before restoring. Do not collapse these into a generic delete.
4. **Legacy computer mounting:** `planLegacyComputerMountingCorrections` targets specifically desktop/laptop/tablet legacy `Racked` location or incompatible/orphaned rack mounting. For qualifying cases it proposes a Desktop mount or retains a valid non-rack mount, sets location to Unknown and clears rack placement on a detached import candidate; unknown mount values and dangling references still fail validation. These corrections are import compatibility only, **not** device-type changes or a general repair feature.

**Pending evidence:** locate and compare VLAN create/edit validation; verify the import UI review/confirmation and schema applicability; review installed-software and service rename/restore tests. No implementation authorised.


## Verified source checks — VLAN validation and exact legacy import sequence (2026-10-29)

**VLAN validation:** published `normaliseState` validation requires each VLAN to have an ID and name, an integer `vlanId` from 1 through 4094, a unique record ID, and a unique combination of `parentId || '__unassigned__'` and VLAN number. This confirms **parent-domain-scoped** uniqueness for persisted VLAN records. The subnet edit path `handleSubnetSubmit` looks up existing VLANs by number **and parent domain**, updates matching name/description or creates a new scoped VLAN. Separate live-state integrity checks also enforce subnet VLAN uniqueness within the parent IP Address Block. These are the source-observed rules; do not infer a new standalone VLAN editor.

**Legacy JSON import order, as implemented in `importData`:**
1. Reject file over 10 MiB; read UTF-8; parse JSON with existing error handling.
2. Reject unsafe object keys; validate backup structure and version metadata.
3. Detect Access Point mounting conflicts; if present, obtain explicit per-conflict user choices. Cancel stops import. Apply chosen corrections on a deep copy.
4. Validate/normalise reviewed backup into a detached candidate, including legacy mounting repair planning and inventory validation.
5. If legacy mounting repairs are proposed, display the existing compatibility review; cancellation stops import.
6. Show a final native confirmation with file name, incoming device/rack/subnet/IPAM counts and current device/rack/subnet counts; cancellation stops import.
7. Published browser implementation then creates/verifies a safety snapshot, persists and verifies the replacement, rolls back on failure, and shows success/failure. **For Next, #215 replaces this browser-specific persistence machinery with atomic inventory-only SQLite replacement**; do not recreate safety snapshots, recovery banners, JSON backup workflow, or obsolete snapshot wording. Preserve the applicable user decisions, validation, preview/confirmation and no-partial-replacement outcome.

The AP and legacy mounting reviews are **conditional on actual detected conflicts/repairs**, not mandatory screens for every import or schema version. The source does not establish that a particular schema version always triggers either review. No new import repair options are authorised.

**Open:** reconcile these exact rules with retained test evidence, including schema 0/1 fixtures and negative import cases, before drafting API/DDL.
