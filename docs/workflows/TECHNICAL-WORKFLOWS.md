# Caffoot Lite v1.3.0 Technical Workflows

**Status:** Baseline audit in progress. Not yet a complete or verified specification.
**Source:** Published v1.3.0 HTML at tag `v1.3.0`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`; this matches the inspected `main` HTML. Other release assets and runtime behaviour are not yet fully verified.
**Purpose:** Describe actual implemented behaviour, data relationships, safeguards, error paths and tests for contributors. Future proposals belong in separate architecture documentation.

## Published HTML provenance reconciliation, 22 October 2026

Read-only GitHub comparison confirms `app/caffoot-lite.html` on `main` and at tag `v1.3.0` share the exact blob SHA `e8a24f6370a1bb572287aad91a314a3e4a189d94` and contain 8,634 lines. Earlier WF-01 through WF-04 source observations citing `main` therefore refer to identical HTML content **at the time of this comparison**. Historical notes retain their original inspection wording for traceability. This check does not establish the contents of other release assets, prove any runtime behaviour or close outstanding workflow questions.

## Documentation standard

For each workflow record: entry point and trigger; source path and function names; inputs and state read; ordered operations; validation and authorisation checks; changes to related records; persistence; error and rollback behaviour; interface response; tests; verified source revision; open questions. Never infer a successful runtime test from source inspection. Mark unknowns explicitly. Update documentation with each significant code change.

## Workflow register

**Current position: 22 October 2026.** This is the authoritative at-a-glance status of the documentation audit. Detailed dated notes below provide the evidence and history. A planned test is not a passed test.

| ID | Area | Documentation and source position | P12 completion gate | Browser tests |
| --- | --- | --- | --- | --- |
| WF-01 | Startup, load and recovery | Technical workflow recorded; 16-scenario recovery plan; published HTML matched; targeted function and comment review started | Open: complete callers, comments, roadmap and cross-checks | Not executed in this audit |
| WF-02 | Save and integrity validation | Technical workflow recorded; 30 saving scenarios plus 18 imported rack scenarios; published HTML matched; targeted function review started | Open: complete save caller and rollback coverage, comments, roadmap and cross-checks | Not executed in this audit |
| WF-03 | Device create, edit, convert and delete | Technical workflow and 26-scenario device matrix recorded; targeted source and naming review started | Open: complete caller/comment review and reconcile findings | Not executed in this audit |
| WF-04 | Subnets, VLANs and IPAM | Technical workflow and 33-scenario network matrix recorded; targeted source and naming review started | Open: complete caller/comment review and reconcile findings | Not executed in this audit |
| WF-05 | Rack placement and accessories | Source findings and 20-scenario regression matrix recorded | In progress, paused while WF-01 to WF-04 P12 retrospective checks finish | Not executed in this audit |
| WF-06 | Backup, import and restore | Preliminary technical workflow notes recorded; overlaps with WF-02 import scenarios | Not assessed under P12 | Not executed in this audit |
| WF-07 | UI navigation and forms | Not yet comprehensively audited | Not assessed under P12 | Not executed in this audit |
| WF-08 | Catalogues, software and services | Not yet comprehensively audited | Not assessed under P12 | Not executed in this audit |
| WF-09 | Audit history and preferences | Preliminary technical workflow notes recorded | Not assessed under P12 | Not executed in this audit |
| WF-10 | Security, build, tests and release | Not yet comprehensively audited | Not assessed under P12 | Not executed in this audit |

**Maintenance rule:** Update this register whenever the documentation or audit status changes, in the same documentation commit wherever practical. Keep detailed dated findings below, but do not rely on append-only notes to communicate current status. Only mark a P12 gate closed after its documented requirements are met; record browser execution independently.

## WF-01 Startup, load and recovery

**Source:** `app/caffoot-lite.html`, approximately lines 1615 to 1680 on `main` at initial inspection. Line numbers are navigational aids, not immutable identifiers.

- `STORAGE_KEY` is `caffoot_state`.
- `loadStoredState()` calls `localStorage.getItem(STORAGE_KEY)`.
- If no saved value exists, it returns `cloneDefaultData()`.
- If a value exists, it parses JSON, requires a plain object with `devices`, `subnets` and `racks` arrays plus an `ipAllocations` object, rejects unsafe keys through `phase16CRejectUnsafeKeys()`, then calls `normaliseState()`.
- Storage read failures or parsing/structure failures set `phase17AStorageRecovery` and return defaults in memory. The original stored value is not overwritten during startup.
- `appState` is initialised from `loadStoredState()`; `validateApplicationState()` runs afterwards. Startup integrity errors are logged.
- `phase17ARecoveryBanner()` builds a recovery notice with a download option for readable raw stored text and an explicitly confirmed reset path.
- **Important distinction:** Default data appearing in memory during recovery does not mean the original inventory has been replaced in browser storage. Saves are blocked while recovery mode is active.

**Unverified:** Browser behaviour across storage denial, malformed JSON, malformed relationships and reset. Exact invocation of the recovery banner and all UI disabling paths remain to be traced.

## WF-02 Saving and integrity checks

**Source:** `app/caffoot-lite.html`, approximately lines 1556 to 1610 and 1825 to 1855 on `main`.

- `saveState()` refuses to save when `phase17AStorageRecovery` is set.
- It runs `validateApplicationState()` and rejects a save if integrity errors are returned.
- On the valid path, it sets `appState.stateVersion`, serialises `appState`, writes the result to `localStorage` and reads it back to compare the stored string.
- After the write, it attempts `recordAudit()` using the previous audit baseline. Audit recording failures are caught and logged rather than failing the already completed inventory write.
- It updates the audit baseline, shows a success notification and returns `true`. Write or verification failures produce an error notification and `false`.
- `validateApplicationState()` checks subnet hierarchy and type rules, subnet IDs, VLAN numbers within their parent domain, device IDs, duplicate primary IP addresses, IPAM consistency, and device references to racks and rack U range consistency.

**Important limitations to investigate:** A browser write followed by a matching read is not a database transaction. The audit trail is attempted after the inventory write, so its success is not guaranteed by a successful inventory save. Determine whether all callers restore their in-memory state on `saveState() === false` and whether partial updates to related browser keys can occur.

## Evidence and issue log

| ID | Observation | Classification | Follow-up |
| --- | --- | --- | --- |
| E-001 | Startup avoids overwriting unreadable saved inventory | Source verified | Exercise recovery paths in a browser |
| E-002 | Save checks relationships and verifies browser storage readback | Source verified | Trace all mutation callers |
| R-001 | Audit history is recorded separately after inventory write and may fail independently | Potential consistency limitation | Assess intended guarantees and tests |
| R-002 | In-memory rollback after failed save may depend on individual callers | Investigation question | Audit create, edit and delete paths |
| R-003 | Precise published v1.3.0 tag or commit not yet matched to branch source | Verification gap | Confirm release provenance before signing off |

## Completion criteria

This document is not complete until each workflow has source evidence, failure behaviour, cross-record effects, relevant tests and an explicit review outcome. Confirm release provenance and ensure no unresolved material ambiguities remain. Where a defect requires code changes, use an approved maintenance branch and record both baseline behaviour and the corrected release version. Do not rewrite history to suggest the original v1.3.0 behaved differently.

## WF-03 Device lifecycle (incremental source findings)

**Evidence:** Read-only inspection of `app/caffoot-lite.html` on `main`, blob SHA `e8a24f6370a1bb572287aad91a314a3e4a189d94`, approximately lines 5626–5684 and 7049–7205. This is not yet confirmation of the published release tag or runtime behaviour.

### Create and edit

- `handleDeviceSubmit(e, deviceId)` reads form values and rejects missing names, duplicate case-insensitive device names, invalid status, incompatible mounting choices, missing locations, missing subnet or primary IP, IP outside the selected subnet and an IP assigned to another device.
- Virtual host selection requires an existing physical server other than the device being edited.
- Rack-mounted devices require a valid physical location, integer start U and height, and a successful `validateRackPlacement()` check.
- Before changing `appState`, the handler serialises a snapshot. Existing devices are updated in place; new devices receive an ID based on `Date.now()` and are appended to `appState.devices`.
- `setDevicePrimaryIp()` and `syncDeviceIpamRecord()` maintain linked IPAM information. If either throws, the handler restores the prior in-memory snapshot and shows an error. If `saveState()` returns false, it likewise restores the snapshot and reports that changes were not saved.
- On success, the handler closes the modal and rerenders content.

### Device type conversion

- `phase130ObsoleteDeviceFields()` identifies populated, catalogue-recognised fields incompatible with the destination type. Unrecognised legacy fields are retained.
- If incompatible fields exist, `phase130ConfirmDeviceConversion()` asks for explicit confirmation. The handler checks that the form's selected type and underlying device are unchanged before applying confirmation.
- Confirmed incompatible details are appended to `previousTypeDetails` and removed from active `typeDetails`. Shared details remain active.

### Rack assignment and removal

- `handleAssignSubmit()` verifies an inventory device configured for rack mounting, validates placement, updates rack position and mounting details, and restores the prior in-memory snapshot if `saveState()` returns false. Physical location is retained.
- `unassignDevice()` clears rack ID and U bounds, preserves physical location, changes mount type to `Desktop`, calls `saveState()` and rerenders. It does **not** check the save result or restore the prior in-memory state. It also does not explicitly clear `rackUHeight` or `face` here. Determine whether those retained fields are benign and whether failed saves create visible inconsistencies.

### Delete

- `deleteDevice()` obtains the device, counts linked IPAM allocations and other reservations, and uses a browser `confirm()` with an irreversible deletion warning and backup advice.
- On confirmation, it snapshots the state, removes allocations owned by the device, clears reservation references pointing to the device, removes the device, then delegates to `phase11BCommitDelete(before, 'Device')`.
- **Verified additional source finding:** `phase11BCommitDelete(before, label)` calls `saveState()` and, when it returns false, restores `appState` from the provided snapshot, rerenders and shows an error. Dependent virtual-host relationships and other references remain unverified.

### Outstanding investigation and test requirements

1. Trace `phase11BCommitDelete()`, `setDevicePrimaryIp()`, `syncDeviceIpamRecord()`, `validateRackPlacement()` and all other device mutation entry points.
2. Investigate `unassignDevice()` save-failure handling and retained rack fields; do not classify as a runtime defect without reproduction.
3. Check cross-record effects of deleting a physical host referenced by virtual devices.
4. Verify how changing the primary IP releases or retains previous allocations and reservations.
5. Review form cancellation, duplicate/invalid identifiers, and failed browser storage behaviour in runtime tests.
6. Match source to exact published v1.3.0 release before final approval.

**Status:** Partial source-verified documentation only. No runtime tests executed and no application code changed.

### Primary IP and IPAM synchronisation (additional WF-03 source findings)

**Source:** `app/caffoot-lite.html`, approximately lines 1866–1930 on `main`; exact release provenance and runtime testing remain outstanding.

- `setDevicePrimaryIp(device, newIp)` trims the proposed IP and checks for another device using it.
- Before removing the previous allocation, it checks that a nonempty proposed address belongs to a configured subnet, is not owned or reserved for another device in IPAM, and is not an otherwise occupied Reserved or Assigned IPAM record. For gateway addresses it restricts changed assignments to Firewall, Router or Layer 3 Switch types.
- If the old address has an IPAM record whose `deviceId` matches the device, that entire old record is deleted. An old record not owned by that device is not deleted by this condition.
- The device's primary IP is updated, and the new address's IPAM record is created or updated using any existing record as a base. Status follows `ipReserved`; device ID, hostname and notes are populated.
- `syncDeviceIpamRecord(device)` updates the current primary IP's record with status, device ID, hostname and notes. It returns without changes if the device has no primary IP.
- `handleDeviceSubmit()` snapshots in-memory state and restores it if these helpers throw or `saveState()` reports failure.

**Open questions:** Verify the intended handling of old IPAM notes and reservation metadata when an old owned allocation is deleted; test reassignment, reserved addresses, gateway restrictions and failed persistence. Do not assume a confirmed defect from these source observations.

### Physical host and virtual server relationships (additional WF-03 source finding)

**Source:** `app/caffoot-lite.html`, approximately lines 6852, 7123–7124 and 7187–7200 on `main`; runtime verification pending.

- The device form offers physical servers as host options for virtual servers.
- `handleDeviceSubmit()` validates a nonempty `virtualHostId` against an existing `Server - Physical` device other than the edited device.
- `deleteDevice()` removes the selected device and its associated IPAM records but contains no explicit check for other devices whose `virtualHostId` refers to the deleted device, and no explicit cleanup of those references.
- **Investigation required:** Trace all other relationship validation and deletion entry points, then reproduce deleting a physical server hosting virtual servers. Determine whether orphaned host references persist and how they are displayed or exported. Do not treat source inspection alone as runtime verification.

### Main integrity validation and virtual host links

**Source verified:** `validateApplicationState()`, `app/caffoot-lite.html` approximately lines 1556–1610 on `main`, checks device IDs, mounting compatibility, location, primary IP and IPAM consistency, rack references and U ranges, plus subnet and VLAN rules. It does not inspect `virtualHostId` or verify that a virtual server's host still exists and remains a physical server.

Together with the explicit absence of dependent host checks in `deleteDevice()`, this is a source-supported safeguard gap. Confirm complete runtime behaviour and any other validation paths before classifying the end-to-end issue as reproduced. Investigate whether physical server type conversion can also leave virtual host references behind.

### Physical host type conversion (additional WF-03 source finding)

**Source verified:** `handleDeviceSubmit()`, `app/caffoot-lite.html`, approximately lines 7123–7185 on `main`. The selected virtual host is validated when saving a virtual server, but changing an existing physical server to another type does not explicitly check whether other devices reference its ID in `virtualHostId`. The conversion confirmation focuses on the converted device's own incompatible `typeDetails`, not relationships held by other devices. `validateApplicationState()` does not inspect `virtualHostId`.

**Implication to test:** A physical host type conversion may preserve virtual server references to a device that is no longer a physical server. Reproduce in a controlled browser test after documentation, assess whether backup imports already contain such links, and design a non-destructive handling strategy before an approved maintenance change.

## WF-04 Subnets, VLANs and IPAM (initial source findings)

**Status:** Source inspection in progress. Runtime verification pending.
**Source:** `app/caffoot-lite.html` on `main`, approximately lines 4858–4889 and 4927–5040; exact published release provenance pending.

- `phase11BSubnetDependencies(subnet, state)` identifies devices whose primary IP lies in the subnet and IPAM allocation keys in that range.
- `deleteSubnet(subId)` blocks deletion when child subnets or blocks exist.
- It distinguishes device-owned primary allocations, which may be detached through the deletion workflow, from independent reservations, ambiguous ownership and unresolved IPAM links, which block deletion.
- For network subnets it checks linked VLAN records, ambiguous legacy VLAN ownership and other subnet users of the VLAN.
- The confirmation screen previews affected devices and addresses, with a warning that their primary IP allocations will be released while device inventory and rack/hardware information remain.
- A preview signature includes subnet identity, dependent devices, allocations and linked VLANs. `confirmDeleteSubnet(subId)` recalculates this signature and cancels deletion if dependencies changed after the preview.
- **Not yet verified:** Full `deleteSubnetCommit()` mutation sequence, rollback, VLAN deletion paths, subnet editing, bulk IPAM operations and browser test outcomes.

**Design observation:** Dependency previews followed by confirmation-time revalidation are useful safeguards to consider for other destructive workflows, subject to approved design and testing.

### WF-04 confirmed subnet deletion and individual IP editing

**Source:** `app/caffoot-lite.html`, approximately lines 5038–5180 on `main`. Source inspected only; runtime verification pending.

- `deleteSubnetCommit(subId)` rechecks independent IPAM records, child subnets and VLAN ownership. It snapshots `appState` before changing records.
- For affected devices, it sets `previousPrimaryIp` to the former primary address, then calls `setDevicePrimaryIp(device, '')` to release their active device-owned allocation. Device inventory remains.
- It removes the subnet, removes one matching linked VLAN where applicable and changes the selected subnet. `phase11BCommitDelete()` saves the change and restores the prior in-memory snapshot on reported failure. The caller restores the prior selected subnet on failure.
- `deleteVlan(vId)` refuses deletion while network subnets in the same parent domain use that VLAN; otherwise it asks for confirmation and delegates persistence and rollback to `phase11BCommitDelete()`.
- `openIpModal(ip)` blocks gateway editing. `handleIpSubmit(e, ip)` refuses gateway changes and changes to a device's primary IP through the standalone IP editor.
- Marking an independently managed IP Available deletes its IPAM record. Assigned or Reserved selections update the record, retaining valid device ownership only where appropriate. If `saveState()` returns false, the previous IPAM allocation is restored in memory.

**Still to verify:** Runtime deletion and rollback, behaviour with mixed IPAM reservations, editing subnets and VLANs, bulk allocation workflows, and whether former primary IP metadata is displayed or exported as intended.

### WF-04 bulk IPAM reservation and release

**Source:** `app/caffoot-lite.html` on `main`, approximately lines 4418–4523. Source inspected; runtime testing pending.

- `phase12BBulkPlan()` validates a CIDR-aware range of host offsets and permits at most 512 addresses per batch. Only Reserved and Available actions are supported.
- Gateway addresses and addresses used as a device primary IP or by an existing valid IPAM device owner are excluded. Existing Assigned records are blocked from bulk reservation.
- `handleBulkIpSubmit()` creates a preview showing counts of changes and blocked addresses and up to six example addresses.
- `phase12BApply()` recalculates the plan at confirmation time, writes a full pre-change snapshot to `localStorage` under `caffoot_phase12b_prebulk_snapshot`, applies eligible changes, and calls `saveState()`. A failed snapshot write cancels the operation. A reported failed inventory save restores the previous in-memory inventory.
- **Review question:** Unlike subnet deletion's exact preview signature comparison, bulk IPAM recomputes the plan without requiring it to match the previewed changes. If eligible addresses change between preview and confirmation, the applied set may differ from the preview. Verify in runtime tests and consider whether exact preview consistency is required.
- **Review question:** Determine the intended retention and recovery behaviour of the separate bulk safety snapshot, especially after successful operations and across repeated bulk changes.

### WF-04 subnet creation and editing

**Source:** `app/caffoot-lite.html`, approximately lines 4651–4854 on `main`. Source inspected; runtime tests pending.

- `openSubnetModalByVlanId()` resolves a VLAN card by stable record ID and parent-block domain. For legacy VLANs without ownership metadata, it only infers a subnet when there is exactly one match; ambiguous matches are rejected.
- `handleSubnetSubmit()` treats IP Address Block containers separately from network subnets. It rejects conversion of an existing network into a container and validates proposed parent-child hierarchy before changing live state.
- For network subnets, it checks CIDR size and alignment, name, VLAN range, usable gateway, duplicate CIDR, hierarchy constraints and duplicate VLAN use in the same parent domain.
- Existing network CIDR changes are blocked while any device primary IP or IPAM allocation depends on the old subnet range.
- The handler updates the associated VLAN, removing the old scoped VLAN record when appropriate, or creates a new scoped VLAN record. A failed `saveState()` restores the previous inventory and relevant UI selection or draft state in memory.
- **Investigation candidate:** The gateway collision check rejects a proposed gateway when any device primary IP or IPAM allocation already uses it. Verify whether saving an otherwise unchanged subnet with an already device-owned gateway is intentionally supported or unexpectedly blocked, and assess gateway changes separately from CIDR changes. Do not classify as a reproduced defect without testing.

### WF-04 gateway ownership and editing interaction

**Source:** `handleSubnetSubmit()`, approximately lines 4755–4830, and `setDevicePrimaryIp()`, approximately lines 1866–1920 in `app/caffoot-lite.html` on `main`. Source inspected; browser verification pending.

- `setDevicePrimaryIp()` permits a gateway IP as a primary address for Firewall, Router or Layer 3 Switch devices when the address is newly assigned, subject to IPAM ownership checks.
- `handleSubnetSubmit()` rejects saving a network subnet whenever its proposed gateway matches **any** device primary IP or existing IPAM allocation. This check does not distinguish a changed gateway from the subnet's unchanged current gateway.
- **Potential user-facing issue to reproduce:** If a router legitimately owns an existing subnet gateway, editing only that subnet's name or description may be blocked by the gateway collision check.
- **Design question:** Define whether a gateway can legitimately be device-owned, and distinguish valid existing ownership from attempts to reassign a gateway to a conflicting address. Preserve existing inventory during any future correction.

### WF-04 gateway display, ownership and startup context

**Source:** `phase10GatewaySubnet()` and `phase10SubnetSummary()`, approximately lines 3987–4010; `setDevicePrimaryIp()`, approximately lines 1866–1917; and startup loading, approximately lines 1620–1652 of `app/caffoot-lite.html` on `main`.

- Gateway recognition derives from a configured network subnet's `gateway` field and a usable address check; no separate IPAM record is required merely to identify the gateway.
- IPAM summary counts an unallocated gateway as protected/reserved for display, without writing a new allocation record. A gateway with an explicit Assigned or Reserved IPAM record is counted according to that record's status.
- A permitted network device can own a gateway as its primary IP, with a device-linked IPAM record. The subnet form's unconditional gateway collision check is therefore a potential conflict with a legitimate existing owner (M-009).
- Browser startup parses and normalises stored inventory, checks integrity and deliberately avoids automatically writing over stored data. Unreadable data enters recovery mode. The normal integrity validator does not explicitly verify gateway ownership policy beyond subnet gateway validity and primary IP/IPAM consistency.
- **Remaining WF-04 work:** Inspect backup import validation and reconciliation paths, then verify gateway ownership and subnet edits in a browser before treating M-009 as a reproduced defect.

### WF-06 backup import, legacy compatibility and verified restore

**Source:** `app/caffoot-lite.html` on `main`, approximately lines 7460–7848. Code inspection only; browser regression tests pending.

- Export writes a JSON inventory with `caffootBackup` metadata, format `caffoot-inventory`, schema version 1 and application version 1.3.0. Older exports without metadata are recognised as legacy; newer schema versions are rejected.
- Import rejects files over 10 MB, invalid JSON, dangerous nested property keys, missing required arrays/tables, excessive collection sizes, invalid backup metadata, unsupported mounting types and application integrity failures.
- Validation and legacy normalisation run on a detached copy. Limited desktop mounting/location compatibility repairs are proposed for explicit review, not silently applied to the active inventory.
- Access Point mounting conflicts require a user-selected supported mounting type for each affected device. Rack assignment and rack positions are cleared in the detached candidate. Cancel leaves the current inventory unchanged.
- Before replacement, the user sees counts for imported and current inventory and an explicit confirmation that restore replaces existing data.
- The pre-restore snapshot is stored under `caffoot_phase11_pre_restore` and read back for verification before inventory replacement. Failure to store or verify it prevents the restore.
- After saving the candidate, the code reads saved inventory and verifies it matches the normalised candidate. On save or verification failure, it restores the original in-memory inventory, attempts to restore original browser storage and prior safety snapshot, and verifies rollback. If rollback verification fails, recovery mode blocks further saves and offers the original data for download.
- The snapshot panel explains that the snapshot is retained until the next successful restore and that exported backups remain essential.
- **Follow-up:** Investigate gateway ownership and virtual host relationships in imported inventories, since the restore checks use the existing application integrity validator; check whether these relationships are covered before asserting they are fully validated.

### WF-06 imported inventory relationship validation and normalisation

**Source:** `normaliseState()` approximately lines 1392–1554, `validateApplicationState()` approximately lines 1556–1610, and `phase16CCheckBackup()` approximately lines 7606–7627 of `app/caffoot-lite.html` on `main`. Source review, not a browser reproduction.

- Imported data is normalised and validated before replacing active inventory. Normalisation retains older managed type and location values, converts retired Blank locations to Unknown and applies limited legacy rack-location compatibility handling.
- Network and VLAN identifiers, subnet hierarchy, primary IP uniqueness, rack references and placement, IP allocation structure and ownership are checked. Normalisation also repairs certain device/IPAM discrepancies, treating device primary IP as authoritative.
- Neither `normaliseState()` nor `validateApplicationState()` explicitly validates `virtualHostId` against an existing physical server. Consequently, import relies on a validation path that does not reject this particular broken relationship (existing M-005). Confirm behaviour in browser tests before describing it as reproduced.
- The integrity checks verify gateway usability within a subnet, but do not explicitly require a gateway IP owner to be a permitted network device type. This is a policy and testing question under M-009, not an independently confirmed import defect.
- **Important distinction:** Repair of recoverable IPAM drift is part of normalisation; no equivalent automatic repair should be assumed for virtual host links. Do not introduce inferred host assignments during import.

### WF-05 rack creation, placement, deletion and unassignment

**Source:** `validateRackPlacement()` approximately lines 1930–1967, `handleRackSubmit()` 5429–5490, `deleteRack()` 5492–5506, `handleAssignSubmit()` 5625–5668 and `unassignDevice()` 5670–5682 in `app/caffoot-lite.html` on `main`. Source inspection only; runtime tests pending.

- Placement checks whole-number U positions, rack bounds, end not below start, overlapping devices on the same face, and overlapping non-vertical rack accessories. Front and rear device placements are checked independently.
- Rack creation validates name, type, height (1–100U), width and depth. Existing rack physical corrections require confirmation and cannot shrink below mounted equipment or accessories. Failed saves restore the previous in-memory inventory.
- Rack deletion refuses any rack with mounted devices or accessories, asks for confirmation, and uses the shared deletion commit/rollback helper.
- Rack assignment requires an existing device configured with an allowed Rack Mounted type, validates the full height of its intended placement, preserves physical location, and rolls back on failed save.
- **Existing M-001/M-002 concerns:** `unassignDevice()` clears rack ID and U start/end and switches mount type to Desktop, but does not clear `rackUHeight` or `face`. It calls `saveState()` without checking the return value or restoring the previous state if saving fails. This differs from the guarded assignment path. Confirm in browser tests before declaring a reproduced defect.
- **Follow-up:** Trace rack accessories, dragging, occupancy display and rack export/print; compare all paths with the same collision and persistence safeguards.

### WF-05 rack accessories, availability and movement

**Source:** `app/caffoot-lite.html` on `main`, approximately lines 7988–8175 and 8177–8296. Source inspection; browser verification pending.

- `phase13CAccessoryError()` validates rack, face, height, start U and collisions. Normal accessories cannot overlap mounted devices or other normal accessories on the same face. Vertical 0U PDUs and cable managers occupy independent left/right side rails, checked for overlap against other vertical accessories on the same rail and face.
- `refreshAccessoryOptions()` rebuilds available starting U choices from the full height and collision rules, showing a multi-U range such as U3–U4 for equipment taller than 1U. It recalculates on type, face, side and height changes.
- The accessory editor validates again at submission, supports patch panels with 12, 24 or 48 ports, and snapshots inventory before add/edit. A failed `saveState()` restores the in-memory snapshot.
- Accessory deletion requires explicit confirmation and restores the prior inventory on save failure. Horizontal accessory movement also revalidates and rolls back on failure.
- `phase13MoveDevice()` is the shared validated device movement path for rack interactions, checking full height, selected face, bounds and collisions, and restoring the previous placement on save failure.
- Vertical accessory drag/drop uses `phase13VTarget()` to calculate and validate a proposed side rail position, provides valid/invalid previews, then revalidates at drop and rolls back on save failure.
- `phase17dTrackDrag()` scrolls the rack viewport when dragging near its visible top or bottom, with special handling for partially visible Safari viewports; it does not change placement rules.
- **Follow-up:** Compare stored accessory validity with `validateApplicationState()`, since user interaction validation does not by itself guarantee imported accessory data is checked equivalently.

### WF-05 and WF-06 cross-workflow finding: imported rack occupancy

**Source:** `app/caffoot-lite.html` on `main`: `normaliseState()` approximately 1392–1554; `validateApplicationState()` 1556–1610; `validateRackPlacement()` 1930–1967; `phase11BIntegrityIssues()` 4863–4882; `phase16CCheckBackup()` 7606–7623; `phase13CAccessoryError()` 7988–8003. Source inspection only, not browser reproduced.

The rack editor rejects device and accessory collisions through dedicated placement validators. In contrast, imported backups are checked through `normaliseState()` and `validateApplicationState()`, neither of which invokes those placement validators or independently checks pairwise rack occupancy. The latter validates a mounted device's rack reference and U range consistency but not whether two devices occupy the same U range on the same face. Neither routine comprehensively validates `rackAccessories` entries for existence of their rack, legal face/rail, bounds or collisions. `phase11BIntegrityIssues()` likewise checks only missing rack references among its rack-related checks.

**Risk requiring confirmation:** a structurally acceptable imported backup could contain overlapping devices or accessories, or invalid accessory placement, without this being rejected by import integrity checks. Do not claim an observed restore failure or data loss; reproduce safely with a disposable test inventory and backups before agreeing any correction. Preserve compatibility with legitimate front/rear placements and vertical 0U rails when defining expected behaviour.


### WF-05/WF-06 follow-up: accessory collection compatibility and migration trace (22 October 2026)

**Evidence and status:** Source inspection of published `v1.3.0` `app/caffoot-lite.html`; no new browser test or application change. This clarifies the previously recorded M-010/M-019 import integrity concern, rather than claiming observed inventory loss.

1. `importData()` parses the selected backup, rejects unsafe keys, checks required backup shape and version, offers explicit Access Point mounting choices where applicable, then calls `phase16CCheckBackup()` before asking for final restore confirmation.
2. `phase16CCheckBackup()` calls `phase20MigrateBackup()`, which checks backup version, makes a detached JSON copy, assesses legacy mounting repairs, and calls `normaliseState()`. Migration does not add rack accessory validation. The supplied backup object is not mutated by this step.
3. `phase11ValidateBackupShape()` requires valid `devices`, `subnets`, `racks` arrays and an `ipAllocations` object, but does not validate `rackAccessories` as a required or optional array.
4. `normaliseState()` sets `rackAccessories: Array.isArray(raw.rackAccessories) ? raw.rackAccessories : []`. A missing collection (legitimate for historical backups) and an explicitly present malformed collection therefore both become an empty accessory array in the candidate. Existing valid arrays are retained; their individual entries do not receive the interactive accessory editor's complete collision, rack-reference, face, rail and bounds checks.
5. `validateApplicationState()` does not run `validateRackPlacement()` or `phase13CAccessoryError()` over the candidate. As a result, pairwise device occupancy conflicts and accessory placement conflicts are not comprehensively rejected by this import path. This is a source-supported validation gap, not a browser-reproduced outcome.
6. After validation, restore still requires user confirmation, a verified pre-restore safety snapshot, and a verified inventory write. Those safeguards protect the previous inventory against many failures but do not identify accessory records already omitted during candidate normalisation.

**Compatibility decision proposed for v1.3.1, not approved:** Continue accepting absent `rackAccessories` in historical backups. Consider rejecting a *present but non-array* `rackAccessories` value with a clear message before restore, rather than silently substituting `[]`. Separately assess invalid individual accessory entries and overlapping rack positions using fictional backups and a disposable browser profile. Do not automatically move/delete equipment or introduce strict validation that prevents users with legitimate legacy inventories from saving their work. Agree whether review, warnings, or safe repair are needed before implementation.

**Follow-up scope:** Link the collection-shape and accessory-entry question to M-019 and overlapping rack occupancy to M-010; keep display-only occupancy calculations under M-013. Any future tests should be focused on the affected import scenarios and evidence of preservation, not a blanket rerun of unrelated suites. WF-06 should reuse this import trace and concentrate next on restore snapshot and rollback behaviour.


### WF-06 follow-up: restore write failure, rollback and recovery (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, `importData()` approximately lines 7774–7859, `saveState()` approximately lines 1822–1855. Source review only; no browser fault injection performed.

- Import validates the candidate before final confirmation, captures `original = appState`, and reads the current persisted inventory as `currentSnapshot` (falling back to serialising `original` when storage is absent). It remembers the previous value of `SAFETY_SNAPSHOT_KEY`.
- Before replacing active state, it writes `currentSnapshot` to `SAFETY_SNAPSHOT_KEY` and verifies an exact readback. Failure here cancels restore before `appState = candidate`.
- It sets `appState = candidate`, invokes `saveState()`, then checks the stored data by parsing and normalising the persisted JSON and comparing its serialisation to the candidate. `saveState()` itself checks application integrity, writes the active storage key and verifies exact readback; audit-history recording is best effort.
- If candidate save or subsequent verification fails, the catch block restores the original in-memory object, writes `currentSnapshot` to the active storage key, and verifies exact readback. It then attempts to reinstate the previous safety snapshot (or remove the newly created snapshot if none previously existed).
- **Verification asymmetry:** The active inventory rollback is verified by readback, but the reinstatement/removal of the *previous safety snapshot* is not independently verified after its write/removal. A storage implementation that silently fails this secondary operation without throwing could leave the wrong safety snapshot while the code reports that the original inventory was retained. This is a source-supported risk, not a reproduced browser defect. Track under M-011; do not describe the primary inventory rollback as unverified.
- If any rollback operation throws or active-inventory rollback verification fails, `phase17AStorageRecovery` is populated with the original snapshot, the recovery banner is displayed, and subsequent `saveState()` calls are blocked. The error directs the user to download the original stored data from the recovery banner.

**Targeted future verification:** Using disposable browser storage and fictional inventories, exercise safety-snapshot write failure, candidate save failure, candidate post-save mismatch, successful rollback, secondary snapshot restoration failure, and primary rollback failure. Assert preservation of the original active inventory and the intended pre-existing safety snapshot separately. Confirm recovery mode blocks further saves when primary rollback cannot be verified. Do not use an owner's live browser profile or real inventory for fault injection.

### WF-01 and WF-02 startup recovery and verified persistence

**Source:** `app/caffoot-lite.html` on `main`, approximately lines 1618–1693 and 1818–1855. Source inspection, browser tests pending.

- `loadStoredState()` reads the `caffoot_state` browser storage key. Missing data starts with defaults. Malformed JSON, invalid required collection shapes, unsafe object keys or normalisation failures cause `phase17AStorageRecovery` to retain the original raw string (where available) and a reason, while the displayed in-memory state falls back to defaults. Startup does not save this fallback over the original.
- `phase17ARecoveryBanner()` warns that existing data has not been overwritten, offers a raw text download when raw bytes are available, and requires two native confirmations before explicitly replacing stored data with defaults and reloading. A browser storage read failure can set recovery mode with `raw:null`, disabling the download button.
- `saveState()` refuses all saves while recovery mode is active. Otherwise it validates the current inventory, serialises it, writes it to browser storage and reads it back for an exact string comparison. It returns true only after the inventory write verifies. Audit history is a separate best-effort write and can fail independently.
- **Important distinction:** When loading succeeds but `validateApplicationState()` reports startup integrity errors, the application logs those errors and does not write automatically; it does **not** set `phase17AStorageRecovery` solely on this condition. Later saves are subject to integrity validation. Do not describe all startup integrity errors as recovery mode.
- **Test questions:** Confirm download and two-confirmation reset on malformed stored data; confirm no startup overwrite; simulate blocked browser storage; confirm a readable but invalid inventory cannot be saved and that the user-facing behaviour is clear.

### WF-06 restore transaction, safety snapshot and rollback

**Source:** `app/caffoot-lite.html` on `main`, approximately lines 7523–7560 and 7774–7859. Source inspection only; failure injection tests pending.

1. The selected file is limited to 10 MB. JSON, unsafe keys, required collection shapes, backup version and known mounting compatibility are checked. Access Point mount conflicts and limited legacy corrections require user review. A final native confirmation displays imported and current inventory counts and warns that restore replaces the current inventory.
2. After confirmation, Caffoot captures the current in-memory inventory and reads the current saved `caffoot_state` string (falling back to serialised in-memory state if absent). It also remembers any previous `caffoot_phase11_pre_restore` snapshot.
3. The pre-restore safety snapshot is written under its own storage key and verified by exact readback. A failed snapshot write or readback prevents replacement.
4. The candidate becomes the active in-memory inventory immediately before calling `saveState()`. That routine validates, writes and verifies the candidate; the restore then reads saved data again, normalises it and compares it with the candidate. Successful restore updates selection and screen and reports success.
5. On failure after replacement begins, Caffoot restores the original in-memory object, writes back the original stored inventory string and verifies exact readback. It attempts to restore the previous safety snapshot value or remove the newly written one if none previously existed. It resets the audit baseline and reports the restore as cancelled.
6. If rollback storage operations fail, recovery mode is activated, further saves are blocked, and the recovery banner offers the original stored inventory for download. The failure is not silently treated as success.
7. The backup and restore safety panel can export current inventory and download the latest retained pre-restore snapshot. It explicitly warns that browser storage is not a substitute for an exported backup.

**Nuance to test:** The rollback path verifies the main inventory's readback, but restoring the *previous safety snapshot* is not followed by a separate readback comparison. A failure to write that snapshot should enter recovery mode through the enclosing catch; a storage implementation that silently fails a snapshot write would not be detected by an explicit snapshot readback here. Also assess audit history if candidate persistence succeeds but the restore's additional verification fails. Do not claim observed corruption or data loss without a controlled browser reproduction.


## WF-02 integrity repair, Phase 11C (additional source inspection)

**Evidence:** `app/caffoot-lite.html` on `main`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, around lines 2201 to 2305. Runtime verification and exact release provenance remain pending.

- `phase11CPlan()` prepares IPAM synchronisation proposals without changing inventory. It creates missing allocations and corrects status, device ID, hostname and notes for uniquely owned device primary IPs within a known subnet.
- Duplicate primary IPs, absent matching subnets, conflicting IPAM ownership, independently allocated addresses, orphaned allocation or reservation references and missing racks are reported for manual review, not automatically changed.
- `phase11CPreviewRepair()` retains a JSON snapshot and proposed plan in memory and rerenders the interface. `phase11CApplyRepair()` refuses to proceed without a preview or if the inventory JSON differs from the preview snapshot.
- A nonempty repair plan requires browser `confirm()`. Before editing the in-memory allocations, the handler reads the previous value of `caffoot_phase11c_pre_repair_v1` and writes the current inventory JSON to that browser storage key. This snapshot write has no explicit readback comparison in this function.
- The handler applies only the previewed IPAM changes, sets an audit reason and calls `saveState()`. On success it clears the preview and rerenders. `saveState()` performs inventory validation and exact readback verification of the main inventory key as documented above.
- On a thrown error or a reported unsuccessful save, it restores the pre-repair inventory in memory, clears the audit reason, attempts to reinstate the previous repair snapshot (or remove the newly created one), clears the preview and shows an error. Failure to reinstate the previous snapshot is silently ignored. This catch path does not itself verify the main stored inventory or the restored snapshot.
- `phase11CDownloadSnapshot()` exports the browser-local pre-repair JSON snapshot. `phase11CPanelHTML()` displays proposed repairs and manual review items. The snapshot download is available only when the storage key is readable through the safe storage helper.

**Follow-up:** Browser-test successful repairs, blocked conflicts, changed inventory after preview, storage write and readback failures, snapshot persistence, snapshot download and failure recovery. Assess whether snapshot readback verification or a stronger rollback guarantee is needed. Do not classify data loss without reproduction. No application changes authorised.


## WF-09 network reports and CSV exports (source inspection)

**Evidence:** `app/caffoot-lite.html` on `main`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, approximately lines 2304 to 2425. Runtime tests pending.

- `phase10DReportData()` reads current in-memory devices, racks and subnets. Device location totals use the location string or `Unknown` and are sorted by count. Rack summaries separately sum front and rear mounted device U ranges; the reported occupancy percentage is the larger face total divided by rack height, rounded to an integer. It counts devices, not accessory occupancy, and sums lengths rather than unique occupied U slots.
- Subnet rows delegate to `phase10SubnetSummary()` for assigned, reserved, available, capacity, utilisation and supported-range calculations. That helper requires a separate detailed trace.
- `phase10DCsvCell()` quotes fields, doubles embedded quotation marks and prefixes a single quote when a value begins with optional whitespace followed by `=`, `+`, `-` or `@`, reducing spreadsheet formula injection risk.
- `phase10DDownloadCsv(kind)` supports devices, subnets and racks, ignores unknown kinds, emits UTF-8 CSV with BOM and CRLF row separators, and creates a date-stamped download. Unsupported subnet statistics are blanked and the supported flag is included.
- `phase10DReportsHTML()` renders device counts by location, subnet utilisation, front/rear rack occupancy and capacity warnings at 85 percent or higher. Subnet utilisation outside the supported /23 to /30 range is displayed as unavailable.
- Reports are generated from the current in-memory inventory without saving it. Confirm export/download behaviour, output escaping, spreadsheet compatibility, occupancy interpretation and source helper consistency in browser tests.

**Interpretation caution:** Rack occupancy is a sum of device lengths on each face, not a collision-aware measurement of uniquely occupied positions or installed accessories. Do not describe this report as comprehensive physical rack capacity without verifying its intended meaning.


### WF-01 second-pass findings: normalisation and startup controls

**Source:** `app/caffoot-lite.html` on `main`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, approximately lines 1380 to 1535, 1615 to 1700 and 8590 to 8634. Browser verification outstanding.

- On load, `normaliseState()` works on a constructed state object, merges default fields and performs legacy migration, including retired location replacement, discovered type/location list entries and repair of device-owned IPAM links. Startup does not call `saveState()` automatically. The resulting in-memory inventory can therefore differ from the unchanged stored JSON until a subsequent save.
- `normaliseState()` requires `vlans` as well as devices, subnets, racks and IPAM. The preliminary structural check in `loadStoredState()` does not list `vlans`, but normalisation rejects it if missing. Document the combined requirement, not just the preliminary check.
- `window.onload` calls `switchTab('dashboard')` followed by `phase17ARecoveryBanner()`. Recovery mode blocks `saveState()`; the recovery banner offers the raw stored text when readable and a two-confirmation reset.
- Reset writes a fresh default inventory directly to `caffoot_state` and reloads. Unlike normal `saveState()`, this handler does not compare a readback before reloading. A thrown write error produces an alert. This is a source observation requiring disposable-browser failure tests.
- Theme preference uses separate browser keys `caffoot_theme_preference` and legacy `caffoot_dark`; audit history uses `caffoot_audit_v1` with a 200-entry limit. These keys must be covered in the full storage-key inventory under WF-11.

**Open questions:** Whether migrated fields should be disclosed to users before a later save, whether reset verification should match normal persistence safeguards, and how the interface behaves for readable inventory with integrity errors. No application change approved.


### WF-01 second-pass follow-up: startup wiring and audit storage

**Source:** `app/caffoot-lite.html` on `main`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, approximately lines 1160 to 1195, 1720 to 1805, 1820 to 1855 and 8600 to 8634.

- The `window.onload` handler first opens the dashboard through `switchTab('dashboard')`, then mounts the recovery banner using `phase17ARecoveryBanner()`. The banner has alert semantics and offers download when raw saved text is available. The dashboard still initially renders from the in-memory state, which may be defaults in recovery mode. Runtime checks must confirm this is sufficiently clear to users.
- `cloneDefaultData()` provides empty collections, including devices, racks, subnets, VLANs, rack accessories and IP allocations. The default state version is assigned during normalisation or saving, not as a startup write.
- Audit history is a separate browser key `caffoot_audit_v1`, limited to the most recent 200 events. `readAuditHistory()` returns an empty list if the stored audit JSON cannot be parsed. `recordAudit()` catches audit write failures, so inventory persistence may succeed while audit history persistence fails. The UI explicitly states that history is local, not tamper-proof, and excluded from standard inventory backups.
- `auditChanges()` compares devices, subnets, racks, VLANs, IP allocations and managed device type/location lists, but not every field or collection in the state. The change history is a compact summary, not a complete mutation ledger.

**Remaining evidence:** Browser verification of recovery banner ordering, reset failures, unreadable audit data and malformed but parseable inventory; review available automated tests. No source-only finding should be labelled a runtime defect.


### WF-01 second-pass: IPAM migration precedence and unresolved verification

**Source inspected:** `app/caffoot-lite.html` on `main`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, approximately lines 1490 to 1550. Source inspection only.

During `normaliseState()`, each device's primary IP is treated as authoritative for device ownership, hostname and notes in the corresponding IPAM allocation. Missing allocation entries are created, mismatched `deviceId` or `status` fields are corrected, and hostname/notes are refreshed. For existing allocations, allocation-specific fields outside those refreshed properties are preserved. In a subsequent pass, allocation links to absent devices or devices whose primary IP no longer matches are cleared; `Assigned` becomes `Available` for such links. The input saved JSON is not immediately rewritten at startup. The distinction between routine normalisation and material correction is relevant to proposed M-015.

**Verification required:** Exercise older valid inventories, stale IPAM ownership, reserved device IPs, missing allocations and mismatched status using disposable test data. Check whether any data is unexpectedly changed on first subsequent save, and whether recovery messaging remains clear. Confirm exact released v1.3.0 artefact and automated test coverage. Do not mark WF-01 complete.


### WF-01 second-pass: emergency recovery reset exact sequence

**Source evidence:** `app/caffoot-lite.html` on `main`, approximately lines 1646 to 1687. The `phase17ARecoveryBanner()` handler is distinct from the Settings clean-start handler.

1. A recovery banner is shown only when `phase17AStorageRecovery` exists. The heading explains that the saved inventory was not loaded, and the message says the existing browser data was not overwritten and changes are disabled.
2. The original stored text may be downloaded as `caffoot_lite_unreadable_recovery.txt`. Download is disabled when browser storage could not be read and the original text is unavailable.
3. Reset requires two successive native confirmation dialogs. Cancellation at either confirmation stops the reset.
4. After confirmation, the handler directly calls `localStorage.setItem(STORAGE_KEY, JSON.stringify(cloneDefaultData()))` and then `location.reload()`. It catches thrown exceptions and displays an alert.
5. **There is no readback verification** between the write and reload. A storage implementation that silently fails to retain the write would still trigger reload. This is a source-established safeguard gap, not a demonstrated user-visible defect.

**Testing still needed:** Simulate cancellation at each confirmation, successful reset, throwing storage writes, silent non-persistence, download availability, and page reload into continued recovery. Verify behaviour in a browser using disposable inventory. Do not change production code without owner approval.


### WF-01 second-pass: readable inventory with integrity errors

At startup, `loadStoredState()` creates `appState`, then `validateApplicationState()` runs and writes any findings to `console.error('Startup integrity issues:', ...)`. This is distinct from the recovery banner, which is shown only when `phase17AStorageRecovery` is set. A readable inventory with integrity errors can therefore render its dashboard without a corresponding startup warning for ordinary users. On a later `saveState()` call, the application revalidates the working inventory and blocks persistence, displaying the first integrity error in a toast. The initial startup check does not itself write the stored inventory. Source evidence: `app/caffoot-lite.html` approximately lines 1643 to 1651 and 1830 to 1867. Browser confirmation remains outstanding.
