# Caffoot Lite v1.3.0 Technical Workflows

**Status:** Extended v1.3.0 audit administratively closed with product owner approval on 23 October 2026, with incomplete individual workflow coverage explicitly retained. This is not a fully verified specification.
**Source:** Published v1.3.0 HTML and published ZIP/HTML assets. The earlier matching source blob comparison below was historical; subsequent audit corrections on `main` must not be confused with the immutable published v1.3.0 release. Published ZIP integrity and representative v1.2.1 backup compatibility were verified in GitHub Actions run [39961182872](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39961182872).
**Purpose:** Describe actual implemented behaviour, data relationships, safeguards, error paths and tests for contributors. Future proposals belong in separate architecture documentation.

## Published HTML provenance reconciliation, 22 October 2026

Read-only GitHub comparison confirms `app/caffoot-lite.html` on `main` and at tag `v1.3.0` share the exact blob SHA `e8a24f6370a1bb572287aad91a314a3e4a189d94` and contain 8,634 lines. Earlier WF-01 through WF-04 source observations citing `main` therefore refer to identical HTML content **at the time of this comparison**. Historical notes retain their original inspection wording for traceability. This check does not establish the contents of other release assets, prove any runtime behaviour or close outstanding workflow questions.

## Documentation standard

For each workflow record: entry point and trigger; source path and function names; inputs and state read; ordered operations; validation and authorisation checks; changes to related records; persistence; error and rollback behaviour; interface response; tests; verified source revision; open questions. Never infer a successful runtime test from source inspection. Mark unknowns explicitly. Update documentation with each significant code change.

## Workflow register

**Current position: 23 October 2026.** This register supersedes the outdated 22 October table. Administrative audit closure is distinct from the completion of individual P12 gates. Evidence in the dated sections below remains historical and must be read against the newer findings and CI runs.

| ID | Area | Source and documentation assessment | P12 completion gate | Executed browser evidence |
| --- | --- | --- | --- | --- |
| WF-01 | Startup, load and recovery | Assessed with recorded recovery source tracing and fault findings | Partially assessed; full caller and documentation gate not evidenced as closed | Targeted recovery reset scenarios passed, run [39944710633](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39944710633); M-014 usability improvement deferred |
| WF-02 | Saving and integrity | Assessed with save caller and rollback findings | Partially assessed; exhaustive caller review not certified | Targeted failed save and recovery assertions passed in runs [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113) and [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469) |
| WF-03 | Device lifecycle | Source and workflow paths assessed with recorded findings | Partially assessed; full P12 sign-off not evidenced | Targeted device graphic failure scenario passed in run 39957395113; not exhaustive device lifecycle coverage |
| WF-04 | Subnets, VLANs and IPAM | Source and workflow paths assessed with recorded findings | Partially assessed; full P12 sign-off not evidenced | Targeted bulk IPAM M-031 scenarios passed in runs 39957395113 and 39959581469; not full network matrix |
| WF-05 | Rack placement and accessories | Source and workflow paths assessed with recorded findings | Partially assessed; complete P12 gate not evidenced | Targeted rack unassignment failure scenario passed in run 39957395113; not full rack matrix |
| WF-06 | Backup, import and restore | Substantial source inspection and published compatibility verification | Partially assessed; full failure matrix not certified | Published v1.2.1 export into published v1.3.0 passed in run [39961182872](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39961182872); targeted M-011 rollback evidence passed in run 39959581469 |
| WF-07 | Navigation and forms | Source traced; outstanding accessibility and interface paths | Partially assessed; accessibility gate not certified | Targeted custom location failed save passed in run 39957395113; not complete UI coverage |
| WF-08 | Catalogues and services | Source review progressed; coverage remains incomplete | Not demonstrated as a complete P12 assessment | No comprehensive browser matrix evidenced by this register |
| WF-09 | Audit history and preferences | Source review progressed; coverage remains incomplete | Not demonstrated as a complete P12 assessment | No comprehensive browser matrix evidenced by this register |
| WF-10 | Security, build and release | Source review and release provenance assessed | Partially assessed; full P12 gate not certified | Published release asset checks passed in run 39961182872; release checks are not comprehensive browser security tests |
| WF-11 | Data schema and migrations | Source and fixture migration reconciliation recorded | Partially assessed; full P12 gate not certified | Representative published version backup migration passed in run 39961182872 |
| WF-12 | Failure and recovery | Failure matrix and targeted correction evidence recorded | Partially assessed; full P12 gate not certified | Targeted M-011 and M-031 fault scenarios passed in run 39959581469 |
| WF-13 | Test traceability | Existing CI evidence and release provenance linked | Partially assessed; full cross-workflow coverage not certified | Recorded targeted Chromium and published asset runs above; no claim of exhaustive coverage |

**Status rule:** A targeted PASS is not a pass for an entire workflow or its P12 gate. Historical phrases such as “not executed” in dated sections refer to the evidence available at the time, not to this updated register. M-014 remains deferred to v1.3.1. M-031 is technically corrected with targeted passing evidence. Outstanding coverage is retained for maintenance prioritisation.


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


### WF-07 follow-up: catalogue form routing and save boundaries (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`: `phase120ManufacturerSave()`, `phase120ModelSave()`, `phase120SoftwareSaveCustom()`, `phase120SaveServerService()` and their modal form markup. Source inspection only; detailed catalogue lifecycle and device compatibility belong to WF-08.

- Manufacturer, model, custom software and server service editor forms carry `data-form-action` values `manufacturer`, `model`, `software` and `server-service`. These are included in `closeModal()`'s dirty-form snapshot selectors. Their form markup uses `onsubmit="return false"`; saving is performed by explicit catalogue action buttons and their specialised functions, **not** by the document-level submit dispatcher (which has no catalogue cases). This distinction matters when reviewing Enter-key behaviour and accessibility.
- `phase120ManufacturerSave()` validates the name and device-type associations, preserves built-in manufacturer restrictions, and changes only manufacturer-only catalogue entries rather than model entries. It remembers the previous `appState.hardwareCatalogue` value and restores it if `saveState()` fails.
- `phase120ModelSave()` validates the model/manufacturer/type relationship, including duplicate and built-in suggestions. It restores the prior hardware catalogue on failed `saveState()` and closes the modal only after success.
- `phase120SoftwareSaveCustom()` validates name, uniqueness and at least one device type; it restores `appState.installedSoftware` after failed save. `phase120SaveServerService()` validates name and uniqueness, and similarly restores `appState.serverFunctions` on failure. Their success paths force-close the modal and rerender.
- These forms generally separate catalogue availability from already recorded device assignments. The software removal confirmation explicitly says existing device records remain and the entry is retained for historical reference; WF-08 must verify the full archive, restore and device-reference paths before claiming complete preservation guarantees.
- **UI boundary:** Clicking a catalogue Save button invokes specialised logic and should not trigger the ordinary unsaved-changes prompt when the save succeeds. Closing an edited form through the normal modal action does invoke the snapshot comparison. Browser checks should verify whether pressing Enter does nothing, triggers a button, or submits unexpectedly; do not infer keyboard behaviour solely from the form markup.

**WF-07 browser checks:** Edit and cancel each catalogue form; attempt invalid and duplicate entries; inject a failed save and verify modal remains open and original catalogue remains intact; check keyboard Enter and Escape, focus restoration and user feedback. Pass catalogue semantics, archive/restore, built-in suggestions and legacy device references to WF-08 for comprehensive treatment. No runtime test or code change in this audit.

### WF-07 follow-up: IP address, bulk IP and rack assignment forms (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, `openIpModal()`, `handleIpSubmit()`, `openBulkIpModal()`, `handleBulkIpSubmit()`, `phase12BApply()`, `openAssignDeviceModal()`, `handleAssignSubmit()`, and delegated `cancel-subnet-modal` action. Source inspection only; no fault injection or browser confirmation.

- **Individual IP address:** `openIpModal()` refuses protected gateway editing. `handleIpSubmit()` also refuses gateways and device primary IP addresses, and checks linked ownership before making an address Available. It remembers the previous allocation, updates or deletes the selected IP allocation, then calls `saveState()`. On failure it restores the previous allocation (or removes the newly created one), reports an error and leaves the modal open. On success it forces closure and rerenders. The rollback is specific to the edited allocation, not a full inventory snapshot.
- **Bulk IP preview:** `handleBulkIpSubmit()` validates and plans the requested range through `phase12BBulkPlan()`, then replaces the editing form with a separate confirmation modal listing change and protected-address counts. It sets `phase12BPending` to the proposed request; merely reaching this preview does not apply changes to `appState.ipAllocations`.
- **Bulk IP application:** `phase12BApply()` clears the pending request, recalculates the plan, serialises current inventory, and requires a prebulk safety snapshot write before changing allocations. If snapshot writing throws, the operation is cancelled. It then applies the plan and calls `saveState()`; on failure it restores inventory **in memory** and reports the failure. The snapshot write is not explicitly read back here, so do not describe it as verified; distinguish this from WF-06 restore snapshot readback. The pending request is not cleared by the ordinary preview Cancel action; the next Apply requires an available confirmation control, but stale pending state deserves browser review before making a safety claim.
- **Rack assignment:** `handleAssignSubmit()` validates device eligibility, rack U position and overlap through `validateRackPlacement()` before changing placement. It snapshots the full inventory and restores it on failed `saveState()`; successful saves close the modal, set the active rack face and rerender. It deliberately preserves the device's physical location while moving racks.
- **Device-to-subnet cancellation:** The delegated `cancel-subnet-modal` action invokes `closeModal(true)` and returns to a pending device draft, if present. This bypasses the generic subnet dirty-field prompt even when the user has edited the subnet form. Escape from the same nested flow also forces closure. This is a **source-confirmed difference in confirmation behaviour**, not yet a demonstrated loss-of-data defect. Decide whether an explicit discard prompt is desirable only after browser verification and owner review.

**Targeted browser checks:** Edit an ordinary IP and attempt a protected gateway/primary IP; inject failed save and inspect rollback. Preview bulk reservations, cancel, reopen and confirm; inject safety snapshot write failure and main save failure; confirm untouched protected addresses and actual recovery options. Test rack assignment save failure and cancellation. From an unsaved device draft, open and modify a subnet then use both its Cancel button and Escape; confirm whether the absence of a discard prompt is understandable and whether the parent device draft survives. Use disposable inventories and preserve existing backup compatibility.

### WF-07 coverage reconciliation and remaining gates (22 October 2026)

**Review basis:** Reconciled the existing dated WF-07 source notes with the workflow register. This is a documentation coverage check, not a browser test or accessibility certification.

| WF-07 area | Recorded source coverage | Remaining work before source sign-off |
| --- | --- | --- |
| Main and inner navigation | `switchTab()`, `renderContent()`, delegated actions, dashboard/rack/IPAM/device drilldowns | Trace all remaining inner navigation actions and verify return/back behaviour |
| Modal opening and closing | `openModal()`, `closeModal()`, focus restoration, form snapshots and discard alert | Check all direct `closeModal(true)` and modal replacement callers for intentional bypasses |
| Device, subnet and rack editing | Opening functions, submission boundaries, failure rollback, independently saved child records | Reconcile specialised device draft and correction paths with WF-03 to WF-05 |
| Other editable forms | Known snapshot selectors for IP, bulk IP, rack assignment, manufacturer, model, software and service | Trace each handler's cancel, validation, save and rollback paths; coordinate with WF-04, WF-05 and WF-08 |
| Keyboard and accessibility | Escape precedence, Tab cycling, modal labels and focus, Enter for custom locations | Browser keyboard and assistive technology checks, including nested dialogs |
| Search and filters | Device/IPAM filter rerenders, rack DOM search, duplicated IPAM Overview listeners | Verify actual DOM structure, matching semantics, counts, focus and no-match feedback |
| Settings, backup and recovery controls | Settings sections and existing WF-06 recovery paths | Cross-check settings actions and user-facing copy against WF-06 and M-025 |
| Responsive and error feedback | Selected error and toast paths recorded | Review loading/disabled states, mobile layout, empty states and feedback consistency |

**Status:** WF-07 is substantially progressed but **not complete**. Source coverage remains uneven for catalogue forms, other IPAM/rack editors, forced modal closure and responsive feedback. All proposed browser scenarios are **not executed in this audit**. Do not declare the workflow verified or close the audit solely because the major paths are documented. Reuse existing roadmap references M-018 and M-022 and assess the duplicate IPAM Overview handlers separately before proposing a new maintenance item.

### WF-07 follow-up: search and filter event routing (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, document-level `input` and `change` listeners, IPAM Overview search handlers, `renderDevicesHTML()`, `renderIpamHTML()`, and rack search handling. Source inspection only; browser outcomes unverified.

- Device inventory search (`#device-search`) and IPAM address search (`#ipam-address-search`) update local query variables and call `renderContent()`. Their handlers then seek the replacement input, restore focus and attempt to restore the caret. Device inventory filters for assignment, status, type, location, mount and sorting, plus the IPAM status filter, update UI selection variables and rerender. These paths do not directly call `saveState()`.
- Rack list search (`#v13-rack-search`) filters existing DOM rows using `data-search` and updates the empty-results indicator, without a full rerender or inventory mutation.
- **Source-confirmed duplication:** Two independent document-level `input` listeners respond to `#ipam-overview-search`. The first hides/shows matching `[data-ipam-network-group]` elements and reports matching cards. The second also filters nested `[data-ipam-network-row]` elements, controls group visibility and disclosure, updates group counters, and replaces the same `#ipam-overview-search-status` text with a network/group count. Because listeners run in registration order, the second listener's status normally replaces the first's; these handlers implement different matching/counting rules. This is maintainability and potential user-feedback inconsistency, **not** a reproduced search defect. Before any consolidation, check the actual rendered DOM: IPAM Overview groups may be buttons rather than nested disclosure elements, so do not assume the second handler's selectors match the current view.
- A further modal `input` listener clears `aria-invalid` from a form control when its native validity becomes valid. This is presentation feedback only; it does not establish that all application-specific validation errors have been resolved.

**Browser verification:** Search IPAM Overview for block name, network name, CIDR and no-match text, checking which groups and rows appear and what status is announced. Verify device/IPAM search focus and caret after rerender; combine filters and clear them; search racks with and without matches; inspect keyboard and screen-reader announcements where practical. Compare observed behaviour with the current rendered structure before suggesting a change. Any cleanup must preserve existing search semantics and historical inventory compatibility.

### WF-07 follow-up: modal keyboard handling and nested editing (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, modal `keydown` listener, `closeModal()`, `phase120ConfirmDiscard()`, `phase120KeepEditing()`, `phase120DiscardChanges()`, `addCustomLocationOption()`, and document-level input/change listeners. Source inspection, not browser accessibility certification.

- **Escape precedence:** When a modal is open, Escape first handles specialised delete, device conversion, restore, rack correction, and discard-confirmation dialogs, then catalogue rename editing. In a subnet editor opened from a device draft it instead closes the subnet modal and schedules reopening the device editor. Otherwise it calls `closeModal()`, which can prompt before discarding changed form fields.
- **Discard confirmation:** Escape while the discard alert is visible chooses Keep Editing; it does not silently discard. The alert has explicit Keep Editing and Discard Changes actions, and its initial focus is moved to Keep Editing.
- **Tab and Shift+Tab:** The modal keydown listener builds a list of visible, enabled links/buttons/fields and moves focus forward or backward, wrapping at the ends. When a recognised confirmation overlay is active, it uses that overlay's controls. This is an intentional keyboard safeguard, including a Safari-specific comment, but actual focus order and screen-reader behaviour still require browser checks.
- **Nested device options:** `closeModal()` returns from the device-options subview to the device form, collecting software/function selections. It is not equivalent to abandoning the parent device edit. Test whether the parent form's unsaved-change comparison captures nested selections; `modalFormSnapshot()` only serialises input/select/textarea values present in the form when sampled.
- **Enter on custom location:** The modal keyboard handler intercepts Enter when focus is on `#dev-custom-location` and calls `addCustomLocationOption()` rather than submitting the device. Because that function separately mutates and saves the location list, pressing Enter can commit a location while the device form remains unsaved. This is the previously recorded M-018 save-feedback boundary, not a new issue.
- **Input and change routing:** The document-level input handler rerenders device and IPAM searches, then restores input focus and caret where possible. The change handler rerenders several inventory filters and dispatches other `data-action` changes. Rerendering replaces view elements; check keyboard focus and form state for dynamically replaced controls rather than assuming they survive unchanged.

**Browser scenarios:** Escape from a modified form and both discard choices; Escape from each nested confirmation; forward and reverse Tab wrapping with disabled/hidden controls; returning from device options with unsaved software changes; Enter to add a custom location then cancelling the device; changing a search/filter while navigating by keyboard. Capture actual focus destinations and inventory changes. No code change authorised.

### WF-07 follow-up: submit failure boundaries and UI selection state (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, `handleDeviceSubmit()`, `handleSubnetSubmit()` and `handleRackSubmit()`. Source inspection only; no injected browser storage failure.

- **Device:** After validating entered fields and any required conversion confirmation, `handleDeviceSubmit()` captures `beforeDeviceSave`, mutates the device and associated IPAM records, then checks `saveState()`. An IPAM exception or failed save restores `appState` from the pre-save copy and reports an error. The modal closes only after a successful save. This does not reverse separately committed custom location creation (M-018).
- **Network/VLAN subnet:** `handleSubnetSubmit()` validates CIDR, VLAN, gateway, uniqueness and hierarchy before changing live records. It captures `beforeSubnetSave`, `selectedSubnetId` and `deviceFormDraft?.subnetId`. On failed `saveState()` it restores all three. On success it closes and, if opened from a device draft, returns to that device editor.
- **IP Address Block:** The container branch builds a proposed subnet array, checks hierarchy, then replaces `appState.subnets` and saves. On failure it restores the inventory and previous `selectedSubnetId`. Unlike the network branch, the container success path closes and renders content without explicitly returning to a pending device draft. Test this workflow only where the UI actually permits it; do not assume a defect.
- **Rack:** `handleRackSubmit()` validates identity and, when appropriate, physical dimensions and mounted-equipment limits. It captures `before`, changes the rack or appends a new one, then checks `saveState()`. On failure it restores `appState` and shows an error, leaving the modal open. For a new rack it sets `selectedRackId` before saving, but does **not** restore that selection on failed save. This is the already recorded M-022 source concern, not a new finding or proven browser failure.
- **Independent save boundary:** When a rack is created from a pending device form, a successful rack save can return to the device editor with its new rack selected. Cancelling the subsequent device form does not undo the independently saved rack. This is consistent with the separately saved subnet and custom location patterns, but should be made clear in user-facing flows.

**Browser verification plan:** Use fictional disposable inventories and storage fault injection. Check failure at each save boundary; ensure existing inventory survives, the modal remains usable, selection state does not point at a nonexistent record, and the user sees accurate success/failure feedback. Check device-to-subnet and device-to-rack return paths, including cancelling the parent device form after independently saving the child record. Keep M-018 and M-022 as the existing roadmap references. No code change or release approval implied.

### WF-07 follow-up: when device, subnet and rack forms change inventory (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, `openDeviceModal()`, `openSubnetModal()`, `openRackModal()`, `handleDeviceSubmit()`, `handleSubnetSubmit()`, `handleRackSubmit()`, and `addCustomLocationOption()`. Source inspection only; no browser cancellation/failure reproduction.

- The three main open functions populate form fields from existing inventory (or a device draft) and open a modal. The inspected opening paths do not themselves commit a new device, subnet or rack. Their respective submit handlers collect and validate form values before making the corresponding inventory changes. Device submission takes a JSON copy before mutation, updates related IPAM state, and restores that copy if the IPAM operation or `saveState()` fails. Subnet and rack submission also take pre-save copies and contain their own validation and rollback paths; their complete edge cases remain governed by WF-04 and WF-05 respectively.
- **Important exception to a blanket “Cancel changes nothing” claim:** `addCustomLocationOption()`, invoked while editing a device, immediately adds a new value to `appState.deviceLocations` and calls `saveState()` before the user submits the device form. Closing or discarding the device form does not, by itself, undo this separately saved location. This may be intentional because location creation is a distinct action, but it must be explained and tested as such. It is not evidence that the device itself was saved.
- **Existing safeguard concern, M-018:** `addCustomLocationOption()` does not inspect the return value of `saveState()`; it displays an “Added location” success toast even if persistence failed. In-memory `deviceLocations` is already modified at that point. This is a source-confirmed feedback/rollback concern, not a browser-reproduced storage failure. Avoid adding a duplicate roadmap item.
- A device can temporarily leave its form to create a subnet using `deviceFormDraft`; cancellation and return to the device editor follow a specialised path. The general modal discard mechanism must not be assumed to undo a subnet that was independently saved. Confirm draft restoration and explicit save boundaries in browser tests.

**Focused checks:** (1) open and cancel unchanged and edited device, subnet and rack forms; (2) add a custom device location then discard the device and check whether the location persists; (3) simulate failed storage during custom location creation and verify actual toast/in-memory behaviour; (4) open subnet creation from a device draft, cancel and return; (5) successfully create a subnet from that path, then discard the device and check the independently saved subnet; (6) test failed device/subnet/rack saves with disposable inventory. Document the intended behaviour before proposing UI or code changes.

### WF-07 follow-up: unsaved form detection and discard confirmation (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, `modalFormSnapshot()`, `rememberModalForm()`, `phase120ConfirmDiscard()`, `phase120KeepEditing()`, `phase120DiscardChanges()`, `closeModal()`, `openModal()`. Source inspection only; no browser interaction performed.

- `modalFormSnapshot(form)` records an ordered JSON array of each input/select/textarea's identifier, type and current value or checked state. Button, submit, reset and hidden input types are excluded. This is a comparison of visible/editable form fields, **not** an inventory snapshot or persistence transaction.
- `rememberModalForm()` registers a baseline for the first matching form inside `#modal-content` when `openModal()` runs. Explicitly covered selectors are device forms and `data-form-action` values `subnet`, `rack`, `ip`, `assign`, `bulk-ip`, `manufacturer`, `model`, `software`, and `server-service`.
- `closeModal(force=false)` checks whether a covered form has changed from its baseline. If so, `phase120ConfirmDiscard()` overlays a two-choice alert dialog and defers closing. **Keep Editing** removes the overlay and returns focus to the previously focused element when still connected. **Discard Changes** invokes the saved callback to `closeModal(true)`, bypassing a repeat prompt, then returns focus to the element that opened the modal when available.
- `phase120ConfirmDiscard()` refuses to create a second discard overlay while one already exists. The modal Escape handler recognises the discard overlay and routes Escape to Keep Editing rather than silently discarding changes.
- `closeModal()` has a separate first branch for the device-options subview: it reads software/function selections and restores the parent device form rather than immediately closing. This path must be evaluated independently of ordinary form closure.
- **Coverage limitation:** Forms not matching the explicit selector list, controls whose state is not represented by input/select/textarea values, and edits to excluded hidden fields are not guaranteed to trigger this discard prompt. Also, this comparison does not prove that an individual form handler has never changed `appState` before submission. Review mutation and rollback behaviour separately before claiming cancellation is always non-destructive.

**Targeted browser checks:** For each covered form family, open, change a field, attempt close using the close button and Escape, choose Keep Editing, then Discard Changes; confirm focus, no unexpected persistence and unchanged inventory. Include unchanged forms, nested device options, and at least one form outside the selector list. For custom widgets or dynamically added controls, confirm that edits are represented in the form snapshot. Do not infer a defect without reproducing it.

### WF-07 follow-up: delegated navigation and dashboard shortcuts (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, delegated `document.addEventListener('click', ...)` action switch, `document.addEventListener('submit', ...)`, `switchTab()` and `renderContent()`. Source review only, no browser click-through yet.

- One document-level click listener resolves the closest `[data-action]` element and dispatches by its `data-action` value. This survives `renderContent()` replacing the main view and keeps most controls from requiring inline JavaScript. Unrecognised actions log a console warning; they are not silently mapped to another page.
- Main tab actions `tab-dashboard`, `tab-devices`, `tab-ipam` and `tab-racks` call `switchTab()`. The dashboard rack overview shortcut `dashboard-racks-overview` explicitly sets `v13RackSection='overview'` and `v13RackDetailOpen=false` before switching to Racks. This preserves the intended overview destination rather than opening the previously selected rack. The `tab-racks` action alone does not reset the inner rack section; check intended behaviour for that different control.
- Rack sidebar actions choose overview, inventory or accessories. `sidebar-racks-inventory` closes rack detail; `v13-open-rack` checks the rack exists, selects it, opens its inventory detail and sets the rack view tab. The ordinary `sidebar-racks-overview` changes the section but does not explicitly reset `v13RackDetailOpen`; inspect renderer handling before treating that as a navigation defect.
- IPAM sidebar actions set `phase12CIpamTab` to overview or addresses. The `ipam-open-block` action checks the requested container exists, selects Manage, expands matching hierarchy entries and scrolls the selected entry into view.
- Device sidebar overview resets `phase14DeviceTab`; device intelligence drilldowns clear other device filters before setting their intended filter and switching to inventory. These are UI-state changes, not inventory writes.
- Dashboard alert action `phase15e-open-alert` selects Devices, Racks, IPAM or Settings according to the supplied destination. For a valid device it can open details, and for an IP it can open the IP modal. Rack alerts only switch to the Racks main tab in the inspected branch; they do not use the available `rackId` to select/open the specific rack. **Potential usability improvement, not a reproduced defect:** determine whether a rack alert should navigate directly to the affected rack.
- Dashboard inner tab action `phase15c-dashboard-tab` accepts only overview, insights or activity, rerenders and restores focus to the selected tab control when present.
- A document-level submit listener dispatches device, bulk IP, subnet, IP, rack and rack assignment forms to their respective handlers. Save/validation/rollback guarantees belong to those handlers, not to the routing listener; verify each relevant form path separately.

**Targeted browser matrix:** (1) dashboard rack overview from an open rack detail; (2) Racks sidebar overview after opening detail; (3) rack alert destination with a specific rack; (4) IPAM block drilldown; (5) device intelligence drilldown with pre-existing filters; (6) keyboard focus after dashboard inner-tab switching; (7) modal cancel and unsaved-edit confirmation for each supported form family. Record expected and observed destinations and whether any inventory changes occur. Do not change code to satisfy an assumed navigation expectation without owner agreement.

### WF-07 initial source trace: main navigation, screen rendering and modal lifecycle (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`: `switchTab(tabId)`, `renderContent()`, `openModal()`, `closeModal(force = false)`, modal keyboard handler, and `phase16ARenderSettings()`. This is a source inspection, not a completed browser interaction audit.

- `switchTab(tabId)` updates `currentTab`, toggles IPAM/rack/device sidebar actions, updates selected navigation button classes and relevant `aria-current` attributes, changes the page heading, then calls `renderContent()`. The known main tabs are Dashboard, IPAM, Devices, Racks, Change History and Settings. It does not itself persist inventory.
- `renderContent()` selects one main HTML renderer based on `currentTab`: `renderDashboardHTML()`, `renderIpamHTML()`, `renderDevicesHTML()`, `renderRackHubV13()`, `renderAuditHTML()` or `phase16ARenderSettings()`. It replaces the `#main-content` HTML once, then sets up a scroll hint for a rack scroll container if present. State for inner sections is tracked separately (for example `v13RackSection`, `phase14DeviceTab`, `phase12CIpamTab`, and `phase16ASection`).
- `openModal(htmlContent)` remembers the previously focused element on first opening, inserts modal content, shows the container, assigns an accessible heading or fallback label, focuses the first enabled field/control (or the content container), and records an initial form snapshot for discard detection.
- `closeModal(force = false)` first handles return from the device-options subview. For recognised editable forms it compares the current form snapshot with the initial snapshot and may ask for confirmation before discarding edits; when closure proceeds it hides the modal and returns focus to the previous connected element. This is not evidence that *all* modal types receive the same unsaved-changes prompt.
- The modal keyboard handler has dedicated Escape paths for delete, conversion, restore, rack-correction and discard dialogs, as well as catalogue editing and temporary device/subnet creation. It also implements explicit Tab handling for active dialogs. Review the full handler and test keyboard focus in a browser before claiming comprehensive accessibility compliance.
- `phase16ARenderSettings()` uses four inner sections: backup, preferences, help and about. The backup section already separates primary backup/restore controls, maintenance/safety and advanced recovery. Current public wording still includes `Recovery Snapshot` and `Download Safety Snapshot`; the approved plain-English redesign is separately tracked under M-025 and is **not** implemented in v1.3.0.

**Next WF-07 checks:** Trace the delegated click/change/submit event routing; verify that dashboard shortcuts land on the intended screen and inner section; map form opening, save, cancel and discard paths; check modal focus/keyboard handling with disposable browser scenarios. Do not assume a render-only navigation change writes inventory. Distinguish confirmed UI issues from code-review questions.

### WF-06 backup import, legacy compatibility and verified restore

**Source:** `app/caffoot-lite.html` on `main`, approximately lines 7460–7848. Code inspection only; browser regression tests pending.

- Export writes a JSON inventory with `caffootBackup` metadata, format `caffoot-inventory`, schema version 1 and application version 1.3.0. Older exports without metadata are recognised as legacy; newer schema versions are rejected.
- Import rejects files over 10 MB, invalid JSON, dangerous nested property keys, missing required arrays/tables, excessive collection sizes, invalid backup metadata, unsupported mounting types and application integrity failures.
- Validation and legacy normalisation run on a detached copy. Limited desktop mounting/location compatibility repairs are proposed for explicit review, not silently applied to the active inventory.
- Access Point mounting conflicts require a user-selected supported mounting type for each affected device. Rack assignment and rack positions are cleared in the detached candidate. Cancel leaves the current inventory unchanged.
- Before replacement, the user sees counts for imported and current inventory and an explicit confirmation that restore replaces existing data.
- The pre-restore snapshot is stored under `caffoot_phase11_pre_restore` and read back for verification before inventory replacement. Failure to store or verify it prevents the restore.
- After saving the candidate, the code reads saved inventory and verifies it matches the normalised candidate. On save or verification failure, it restores the original in-memory inventory, attempts to restore original browser storage and prior safety snapshot, and verifies rollback. If rollback verification fails, recovery mode blocks further saves and offers the original data for download.
- The v1.3.0 snapshot panel uses technical wording and explains that the pre-restore copy is retained until the next successful restore. **Future UI direction (M-025):** replace user-facing “snapshot” language with plain English, retain the underlying safety copy, and make recovery secondary to the main Back up and Restore actions. This is a proposal for v1.3.1, not current v1.3.0 behaviour.
- **Follow-up:** Investigate gateway ownership and virtual host relationships in imported inventories, since the restore checks use the existing application integrity validator; check whether these relationships are covered before asserting they are fully validated.


### WF-06 source audit completion checkpoint and remaining verification (22 October 2026)

**Covered by source review:** Current inventory export and backup metadata; 10 MB limit and JSON parsing; unsafe-key, required-collection and backup-version checks; Access Point mounting review; detached migration and legacy mount review; confirmation before replacement; pre-restore safety-copy creation and exact readback; candidate save and verification; original inventory rollback and recovery-mode entry; startup recovery banner and destructive reset; separate downloads of normal backup, pre-restore safety copy and original unreadable text. These steps are documented above and in the dated WF-06 follow-ups. **This is not a claim that WF-06 browser regression testing is complete.**

**Remaining questions and targeted checks:**

1. **Import compatibility:** Test an older backup without `rackAccessories` and a malformed explicitly present `rackAccessories` collection separately; confirm expected preservation and error wording before any stricter validation is considered (M-019). Check rack occupancy conflicts separately (M-010).
2. **Restore rollback:** In disposable browser storage, simulate candidate save/readback failure, successful main inventory rollback, failure to restore the previous safety copy, and unverified main rollback. Confirm recovery mode protects the original data (M-011).
3. **Recovery and exports:** Confirm all three download paths produce the intended files; simulate unavailable storage and silent reset write mismatch. Check whether the recovery copy is clearly identified as potentially unreadable data, not a guaranteed importable backup (M-014).
4. **User experience:** Agree final wording and placement for the plain-English **Back up your inventory**, **Restore an inventory**, and secondary **Recover previous inventory** options before any application change. Preserve automatic safety-copy creation and existing recovery access (M-025).
5. **Related relationships:** Verify virtual host and gateway ownership questions already recorded as M-005 and M-009; avoid claiming the import integrity validator covers them until verified.

**WF-06 status:** Substantial source documentation complete; browser fault-injection and compatibility checks outstanding. Keep v1.3.0 facts distinct from v1.3.1 proposed changes. No production change, merge or release authorised by this checkpoint.

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


### WF-06 follow-up: startup recovery banner and user recovery choices (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html` startup `loadStoredState()`, `phase17ARecoveryBanner()`, `saveState()`, and `window.onload`. Source review only; browser scenarios not executed for this follow-up.

- `loadStoredState()` reads `STORAGE_KEY`. On a storage-read exception it sets `phase17AStorageRecovery = {reason, raw:null}` and loads default state in memory. When stored text exists but fails JSON parsing, required collection checks, unsafe-key checks or `normaliseState()`, it sets recovery state with the exact original stored text as `raw` and loads default state in memory. It does **not** overwrite the stored key on startup.
- `saveState()` refuses to save while `phase17AStorageRecovery` is set. `window.onload` calls `phase17ARecoveryBanner()`, which explains that the saved inventory was not loaded and changes are disabled.
- The recovery banner offers `Download original stored data`, disabled if `raw === null`. It exports `raw` as a plain-text `.txt` file. This preserves available bytes/text for inspection, but does not guarantee valid JSON or successful reimport. Where storage itself could not be read, no original text is available to export through this control.
- The banner also offers `Reset to empty inventory`, guarded by two native confirmation dialogs. On approval it calls `localStorage.setItem(STORAGE_KEY, JSON.stringify(cloneDefaultData()))` and reloads. Unlike `saveState()`, this reset path does **not** check exact storage readback before reload; thrown storage errors are alerted. This is a source-supported verification gap and should be cross-referenced to M-014, without asserting an observed reset failure.
- The banner reset does not itself create a fresh pre-reset safety snapshot or require a successful download. The text advises downloading first; both confirmations are user decisions. Treat this as an intentional destructive recovery escape hatch requiring clear documentation and focused design review, not an invitation to remove the ability to recover.
- Separate from recovery mode, a structurally readable state can yield `startupIntegrityErrors` from `validateApplicationState()`. Those errors are logged to the console, but do not by themselves set `phase17AStorageRecovery`; `saveState()` performs its own integrity check and can block persistence. Do not conflate these two startup states.

**Focused future tests/design questions:** In a disposable browser profile, test unreadable JSON, storage-read exception, download availability, cancel at either reset confirmation, reset write exception, and a simulated silent reset write mismatch. Verify that original storage is not overwritten by initial load and that saving is blocked in recovery mode. Consider verifying the reset write before reload and clearer wording about preservation-copy limitations; do not require users to lose access to the reset escape hatch. No changes to production behaviour authorised by this documentation entry.


### WF-06 follow-up: normal backup export and pre-restore snapshot download (22 October 2026)

**Evidence:** Published `v1.3.0` `app/caffoot-lite.html`, `phase20CreateBackup()`, `exportData()`, `phase11DownloadSnapshot()`, `phase11SafetyPanelHTML()`, Settings event dispatch. Source review only; no browser download executed in this audit step.

- The Settings and browser-storage notice `phase11-export-backup` actions call `exportData()`. It serialises `phase20CreateBackup(appState)` to pretty-printed JSON, URI-encodes it and triggers a browser download named `caffoot_lite_backup_YYYY-MM-DD.json`. `phase20CreateBackup()` makes a JSON-detached copy of current in-memory inventory and adds `caffootBackup` metadata: `format: 'caffoot-inventory'`, `schemaVersion: 1`, `app: 'Caffoot Lite'`, `appVersion: '1.3.0'`, and an ISO timestamp. This export is not itself a separate save or readback of the persisted storage key; if the active state differs from the last saved state, the export reflects active in-memory state.
- The Settings `phase11-download-snapshot` action calls `phase11DownloadSnapshot()`. It reads `SAFETY_SNAPSHOT_KEY` directly, shows a toast when no snapshot exists, otherwise creates a JSON-typed Blob and downloads the exact stored text as `caffoot_lite_pre_restore_safety_snapshot.json`. It does not call `phase20CreateBackup()`, attach current metadata, or normalise the snapshot. The source does not guarantee the stored snapshot text is valid JSON; the `.json` filename alone is not validation.
- The Settings safety panel enables the snapshot download button based on `personalSafeStorageGet(SAFETY_SNAPSHOT_KEY)`, a guarded optional storage read. The download function itself reads `localStorage.getItem` directly without its own try/catch; a storage-read exception is not handled locally by that function. This is a narrow robustness observation, not evidence of data loss.
- Standard inventory export, pre-restore safety snapshot, and the startup recovery banner's `.txt` preservation download serve distinct purposes. None is a substitute for retaining independent backup copies outside browser storage.

**Documentation/test follow-up:** Keep these three downloads distinct in user guidance. If browser checks are later run, verify JSON metadata and record preservation using disposable data; check that the safety snapshot download is byte-for-byte equivalent to the stored text; test unavailable browser storage and confirm the user receives a useful error rather than a silent failure. Do not claim that an exported in-memory state was independently saved or validated on disk.

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


### WF-07 follow-up: forced modal closes and nested editing routes (source audit, 22 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` on `main`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, lines 5282 to 5323, 5333 to 5350, 5479 to 5489, 6963 to 6991 and 8607 to 8608. Source inspection only; browser outcomes have not been verified.

- `closeModal(force = false)` checks a snapshot of recognised editable forms before ordinary closure. `closeModal(true)` skips that comparison. The close function also has a higher-priority `deviceOptionsReturnContent` branch which restores device options instead of closing, even if `force` is true.
- Successful catalogue, subnet, rack, IP and device commits intentionally force-close after `saveState()` succeeds. These are not by themselves evidence of discarded work.
- `createRackFromDevice()` and `createSubnetFromDevice()` capture the parent device draft before force-closing it. That bypass is intentional, but browser tests must verify complete draft restoration.
- When a subnet editor is opened from a device draft, the Escape handler (lines 5344 to 5349) and delegated `cancel-subnet-modal` action (line 8607) force-close it and reopen the parent device without the ordinary subnet dirty-form prompt. This is a source-confirmed inconsistency, not a demonstrated loss of persisted data. Test whether unsaved subnet fields are discarded and whether the parent device draft survives intact.
- `cancelRackFromDevice()` force-closes and returns to the parent draft (lines 6972 to 6979), also without checking the rack form snapshot. Test dirty rack fields and draft restoration. A successful rack save remains an independent saved child record.
- `openModal(htmlContent)` replaces modal content via `innerHTML` and remembers the new form snapshot (lines 5304 to 5323); it does not itself ask for permission to discard edits in the previous modal. Audit its callers and replacement paths before concluding any particular user route is unsafe.
- Dedicated restore-review dialogs force-close on completion (around lines 7680 and 7740); assess these as review decisions rather than ordinary editable-form cancellations.

**Targeted browser regression matrix:** (1) edit dirty subnet from a device draft, press Escape; (2) repeat using Cancel; (3) edit dirty rack from a device draft, press Cancel; (4) complete and save a child subnet/rack, then cancel the parent device and confirm independent child persistence; (5) verify parent draft fields and focus on return; (6) test modal replacement with dirty form content; (7) test catalogue Save, Cancel, Enter and Escape. Use disposable inventories and distinguish observed results from source expectations.

**Decision:** No production code change authorised. Evaluate consistent dirty-form cancellation alongside M-026 and existing maintenance candidates, without weakening specialised save validation or compatibility with older inventories. WF-07 remains in progress pending remaining route inspection and browser verification.


### WF-07 follow-up: catalogue keyboard and device-options modal replacement (source audit, 22 October 2026)

**Evidence:** Published v1.3.0 source blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, approximately lines 3297 to 3303, 3394 to 3400, 3455 to 3458, 3531 to 3535, 5187 to 5206, 5282 to 5323, 6159 to 6173, 6328 to 6342 and 8396 to 8422. Source inspection, not browser verification.

- Manufacturer, model, custom software and server service editors use forms with `onsubmit="return false"` and dedicated `type="button"` Save actions routed through the delegated click dispatcher. There is no basis to claim Enter performs the same save action; check each editor in a browser with focus on text fields and selections.
- Their ordinary Cancel buttons use `closeModal()`, which compares recognised form snapshots and can display the unsaved changes confirmation. Server service forms rely on the snapshot created by `openModal()`; manufacturer, model and software forms also explicitly remember their initial form state.
- `phase19BKeepDeviceForm()` moves the live device form into a document fragment before opening the software or server service manager. `closeModal()` first restores that fragment and reads option selections when `deviceOptionsReturnContent` is set. This is a deliberate modal replacement safeguard, not an ordinary discard. Check preservation of every edited device field, option selection and focus in browser testing.
- `openModal()` itself replaces content without dirty-form confirmation. Its remaining callers should be assessed in context rather than labelled unsafe wholesale.

**Browser regression additions:** Enter in manufacturer/model/software/service text fields; Escape and Cancel after edits; Tab and Shift+Tab focus movement; opening and closing device software/service managers with a dirty parent device form; keyboard navigation at narrow viewport widths. Record actual results before treating a source concern as a defect. Keep WF-07 open until remaining modal callers and visual states are reviewed.


### WF-07 follow-up: modal caller inventory and bulk IP preview transition (source audit, 22 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, approximately lines 2813, 3815, 4444 to 4515, 4567, 4902, 4983, 5103, 5389, 5545, 5893, 6233, 6818, 7300 to 7304 and 7628 to 7740. Source inspection only.

- Modal callers include device and rack editors, IPAM individual and bulk editors, subnet deletion and other confirmations, device detail views, catalogue managers, help/licence dialogs and import recovery/review dialogs. Their existence is not evidence of unsafe replacement; caller context matters.
- `handleBulkIpSubmit()` captures the user's range, status, hostname and notes, then calls `openModal()` to replace the bulk editor with a confirmation preview. `phase12BPending` retains the request values for Apply, and `phase12BApply()` recalculates the plan before writing. The confirmation has Cancel and Apply but no explicit Back/Edit action to reconstruct the previous editor. This is a source-confirmed usability limitation: cancelling the preview closes it rather than returning to the filled form. Browser verification remains outstanding.
- `phase12BPending` is not cleared by the generic Cancel handler. An old request remains in memory until another preview replaces it or Apply consumes it. No reachable unintended Apply path has been established; check whether this stale state has any observable impact before proposing a defect.
- Import error messaging explicitly states the existing inventory was not replaced. Import legacy mounting and access point review dialogs are separate decisions and should be tested for cancellation and focus, not treated as ordinary editable forms.
- Management dialogs for device types/locations and hardware/software/services contain controls that act on individual records. Their unsaved input and independent commit semantics require separate consideration under WF-08.

**Recommended targeted checks:** Enter bulk IP values, preview, cancel and check whether the entries are recoverable; repeat with changed preview and protected addresses; verify a new preview supersedes the previous pending request; check modal focus and keyboard cancellation; review narrow-screen confirmation layout. No production changes authorised. Keep WF-07 browser verification open and carry catalogue mutation semantics into WF-08.


### WF-07 checkpoint: keyboard focus, failure feedback and verification boundary (22 October 2026)

**Published source:** `app/caffoot-lite.html`, v1.3.0 blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, lines 1825–1853, 5185–5232, 5282–5364, 6805–6828 and 8103–8115. Source inspection only.

- Opening a normal modal remembers the triggering element when the container was hidden, sets dialog labelling from its heading and focuses the first enabled control. Closing normally returns focus to that trigger when it remains connected. Nested device option managers restore the retained parent form instead of closing the outer dialog.
- The global Escape handler prioritises nested confirmations, then manager rename cancellation, then the device-to-subnet return path, then ordinary close. Ordinary close can prompt to discard dirty recognised forms; the nested subnet return bypass is documented separately.
- The global Tab/Shift+Tab handler cycles through focusable elements within the modal container, or within a selected confirmation overlay. The source explicitly accounts for Safari keyboard settings. This does not establish accessibility compliance without keyboard and assistive technology tests. Inspect whether any other overlay, notably rack accessory deletion, is appropriately isolated, and test focus on return from nested dialogs.
- `saveState()` provides a success toast and error feedback for recovery mode, validation rejection and browser storage failure, with storage readback verification. Therefore a caller without its own second error message is not automatically silent. Distinguish feedback from correct rollback and retry experience.
- Rack accessory save restores the inventory snapshot on failed `saveState()` and leaves its editor open, but its independent overlay and focus handling require separate browser tests. The central recognised-form snapshot selector does not itself list the rack accessory form; do not infer its Cancel semantics from the central selector.

**WF-07 source checkpoint:** Main modal opening/closing, dirty-form comparison, selected nested editing transitions, catalogue Save/Cancel patterns, bulk IP preview and shared save feedback have been traced. **Not browser verified and not a completed accessibility or responsive design audit.** Outstanding: targeted keyboard and screen-reader checks, narrow viewport layouts, empty/error/loading states by workflow, rack accessory modal cancellation and remaining special overlays. Carry catalogue mutation and legacy preservation detail into WF-08. Keep the technical workflow source description distinct from maintenance proposals M-026 and M-027.


### WF-08 opening checkpoint: catalogue storage and independent saves (source audit, 22 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, lines 3297–3338, 3387–3423, 3455–3470, 3528–3543, 6220–6268. Source inspection only.

- Hardware suggestions use `appState.hardwareCatalogue` with manufacturer-only and model entries. `phase120ManufacturerSave()`, `phase120ModelSave()` and the older device-form hardware catalogue manager update candidate arrays and check `saveState()`; on failure they restore the prior catalogue reference. Built-in manufacturer/model suggestions are distinguished from user-managed entries. Do not confuse removing a suggestion with deleting or rewriting an existing device.
- Custom software uses `appState.installedSoftware`; `phase120SoftwareSaveCustom()` copies catalogue entries, checks name uniqueness and at least one device type, then checks `saveState()` and restores the prior array on failure.
- Custom server services use `appState.serverFunctions`; `phase120SaveServerService()` checks name and duplicate rules, copies entries, saves and restores the previous array on failure. Service removal/archiving and legacy device selections require separate tracing.
- The older in-device hardware catalogue manager edits entries using browser `prompt()` and confirms removal using `confirm()`, whereas dedicated manufacturer/model pages use styled editors. This is a source-confirmed user-interface inconsistency, not proof of a data defect. Evaluate consistent Edit/Cancel controls under M-026 without changing existing catalogue identity or stored values.

**Next WF-08 checks:** Trace built-in, inventory-derived and user-created suggestion precedence; archive/restore versus deletion; how existing device selections survive catalogue changes; type-specific software availability; migration and backup compatibility; failed-save rollback and independent child saves. Browser testing is outstanding. No production changes authorised.


### WF-08 follow-up: catalogue removal, archiving and existing device references (source audit, 22 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, lines 3310–3359, 3400–3423, 3472–3494, 3545–3563, 6175–6208, 6344–6361. Source inspection, not browser verification.

- Manufacturer manager changes manufacturer-only association rows; the implementation explicitly leaves model rows untouched. The manufacturers overview merges built-in suggestions, custom catalogue entries and values from existing device records. Removing a custom suggestion does not itself rewrite a device's manufacturer field.
- Model manager edits/removes copied hardware catalogue rows, with a checked save and previous-array restoration on failure. It does not directly rewrite saved device records. The models overview includes inventory-derived values, so a removed suggestion may remain visible because a device still uses it.
- The dedicated Software screen archives a custom software option by setting `archived:true`, retaining its catalogue key and existing device selections. The older device-form software manager's `phase19BUpdateSoftware('delete')` instead splices the entry from `appState.installedSoftware` after confirmation, while saying existing device details are retained. **Source-confirmed catalogue lifecycle inconsistency:** archive versus delete. Whether historical selections remain fully legible and editable in all views requires runtime testing; do not assert actual device data loss.
- Server service removal uses `archived:true` and the Server Services page exposes a restore action. Existing device selections are keyed independently and the page explicitly counts retained assignments. The older server manager routes deletion to the archive confirmation rather than splicing its catalogue entry.
- All inspected catalogue mutations check `saveState()` and restore prior state or a captured state snapshot on failure. Distinguish persisted inventory integrity from usability of orphaned or archived option labels after reload.

**Targeted WF-08 regression plan:** Create disposable devices using custom manufacturer/model/software/service values; edit, remove or archive each catalogue entry from both the dedicated screen and in-device manager; inspect device detail, Edit, filters, export, reload and import; restore archived services; force a failed save; verify old backups and legacy keys retain their meaning. Consider a maintenance candidate for consistent software archive behaviour only after observing the effect and checking compatibility. No code changes authorised.


### WF-08 follow-up: archived software and services may be hidden in device details (source audit, 22 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, lines 5868–5888, 6148–6157, 6324–6361, 6381–6410. Source inspection only.

- Device detail rendering deliberately combines available software with archived software, and available server services with archived services, and has explicit **Archived** labels (lines 5883–5887).
- Both combined lists are then filtered by `activeFields = new Set(phase19BFieldsFor(d.type))`. That helper uses `phase120SoftwareFieldsFor(type)`, which takes only `phase120SoftwareOptions()` (active configured software and built-in suggestions), and `phase19BServerFunctionFields()`, which takes only `phase120AvailableServerServices()` (non-archived services). **Consequently an archived custom entry is normally excluded from the active field set before its Archived badge can render.** This is a source-supported display filtering defect candidate, not proof of lost stored device data. Other type-specific field rules may affect particular legacy keys.
- The older in-device software manager deletes a custom catalogue row outright rather than archiving it (lines 6354–6359). A device's existing Boolean value may remain stored under that removed key, but without a catalogue row its label cannot be resolved by the device detail software list. This is a separate orphaned-label visibility concern; do not claim all views lose the data without checking them.
- Existing records and backup compatibility must remain intact. Do not automatically delete archived/orphaned keys or tighten validation in a way that blocks existing inventory saves.

**Browser regression:** Create a disposable device with custom software and server service selected. Archive each via dedicated pages, reload, open device details and edit form, check archived labels and historical assignment, export/import, restore service, and test the older manager's outright software removal separately. Check whether an archived service/software can be marked uninstalled without silently altering other selections. Verify data in exported JSON without using real inventory. No production code change authorised.


### WF-08 follow-up: archived assignments in the device edit form (source audit, 23 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` lines 6403–6425 and 5882–5887. Source inspection only, not browser testing.

- `phase19BRenderFields()` constructs editable controls from `phase19BFieldsFor(type)` (lines 6420–6425). The latter includes software keys from `phase120SoftwareFieldsFor(type)` and service keys from `phase19BServerFunctionFields()`, both based on active catalogue entries (lines 6403–6410). An archived custom software or server service entry is therefore generally absent from ordinary device edit controls as well as from device details.
- `phase120IsSoftwareField()` and the edit section filters also consult active software/service catalogues (lines 6413–6423). This reinforces the need to check that historical Boolean keys remain untouched by saving unrelated device changes; the source excerpt alone does not prove a destructive save.
- Verify archived assignment visibility, explicit uninstall options, edit-and-save preservation, reload, export/import and older backups with disposable data. Preserve unknown historical keys. Do not conflate absence from UI with loss of stored values.


### WF-08 follow-up: ordinary device edits preserve hidden historical keys (source audit, 23 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` lines 6539–6547, 6804–6813, 6938–6959 and 5928–5956. Source inspection, not browser verification.

- Opening an existing device copies its full `typeDetails` object into `phase19BFormValues` (line 6812). `phase19BReadFields()` updates this object only for controls present in the DOM and returns a shallow copy (lines 6542–6547). The device draft receives that returned object (line 6958). Therefore the form read itself does **not** discard an archived or unrecognised key merely because the corresponding control is hidden. Trace the subsequent device save/type conversion paths and confirm with browser tests before making an end-to-end preservation claim.
- A dedicated archived software uninstall path exists (lines 5933–5956). It confirms intent, sets the selected key false in `typeDetails` and any matching legacy top-level field, checks `saveState()`, and restores prior values on failure. Its trigger is rendered only as part of the archived software device detail row (line 5884), which the earlier active-fields filter may suppress. This is an apparent reachability issue rather than absence of uninstall logic.
- The archived server service detail display has an Archived badge but no equivalent direct disable control in that detail row (lines 5886–5887). Confirm intended service removal through edit forms or catalogue restoration; avoid assuming a missing function is a defect without user-flow testing.

**Regression:** Archive custom software/service on a disposable device; make unrelated device edits, save and reload; inspect exported JSON for preserved true values; test the archived uninstall action once made reachable; check failed saves, legacy top-level values and previous type configurations. Keep historical inventory readable and avoid unexpected mutation of hidden keys.


### WF-08 follow-up: final device save and type conversion (source audit, 23 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` lines 6541–6547, 6804–6813, 7045–7060 and 7105–7184. Source inspection, not browser testing.

- On opening an existing device, `phase19BFormValues` is seeded with a copy of its full `typeDetails`. `phase19BReadFields()` overwrites only currently rendered fields and returns the whole working object. `handleDeviceSubmit()` uses this returned object when saving. For an ordinary same-type edit, this source path preserves hidden archived and unrecognised keys, subject to any intervening form interactions or other validation not covered by this source trace.
- Before mutating a device, `handleDeviceSubmit()` captures `JSON.stringify(appState)`. Both device/IPAM exceptions and a failed `saveState()` restore the captured state; the latter displays an explicit failure toast (lines 7166–7182). Successful saves force-close the modal only after persistence succeeds.
- On type change, `phase130ObsoleteDeviceFields()` identifies **populated** keys that are in its recognised-key set but invalid for the destination type. Its recognised set includes configured software keys, including archived custom software via `phase19BSoftwareFields()`, and available service keys via `phase19BServerFunctionFields()`. Unknown legacy keys remain untouched by design (lines 7045–7060).
- The conversion path requires user confirmation, stores removed recognised values in `previousTypeDetails`, and aborts if the form or underlying device has changed while awaiting confirmation (lines 7150–7164). Therefore **do not claim all archived assignments are always retained in current `typeDetails` after a device-type change**: some recognised archived software keys may be moved to history; archived service keys absent from the available-service recognised set may instead remain. The exact outcome depends on destination type and keys. Check in browser and backup exports.

**Verification:** Test ordinary same-type edit with archived software and service keys, then type changes in both directions, cancellation, confirmation, history display, restoring previous configuration, failed save and export/import. Verify archived software and services are understandable and manageable, while preserving legacy unknown keys. No production code change authorised.


### WF-08 follow-up: restoring previous configurations with archived catalogue entries (source audit, 23 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` lines 5844–5850, 5998–6053, 6403–6410 and 7045–7060. Source inspection, not browser verification.

- `phase130RestoreHistory()` validates the selected historical configuration and computes restorable entries by intersecting snapshot keys with `phase19BFieldsFor(snapshot.type)`, adding only the platform/version/licence exceptions for computer/server types (lines 6015–6020). Because the field list normally excludes archived custom software and archived server services, their saved historical values can be excluded from a restore even while remaining present in the historical snapshot. This is a **source-supported incomplete restoration candidate**, not proof of data deletion.
- The restore confirmation describes eligible changes and incompatible current fields, but does not explicitly identify historical entries skipped because their catalogue options are archived or unknown (lines 6020–6025). Check whether users could mistakenly believe the entire prior configuration was restored.
- The restoration path checks the device and snapshot are still current after confirmation, starts from a copy of current details, records overwritten or obsolete current values as another history entry, does not consume the selected snapshot, and rolls back all state if `saveState()` fails (lines 6026–6047). These are important existing safeguards to preserve.
- `phase19CDetailLabel()` resolves saved custom server service labels from all configured services, including archived ones, but software labels via active software options only; archived custom software therefore may fall back to its raw key in historical rows (lines 5846–5850). This is a separate historical readability concern within the same catalogue lifecycle issue.

**Verification:** With fictional devices, record custom software and service selections, change type to create a previous configuration, archive catalogue entries, inspect History labels, restore and inspect both current and historical keys, export/reload, and test Cancel and failed saves. Include old backups and unknown legacy keys. Do not silently re-enable archived options for new assignments, lose existing history or alter physical devices.


### WF-08 checkpoint: catalogue identity, legacy compatibility and remaining verification (source audit, 23 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` lines 3303–3338, 3400–3423, 3458–3485, 3533–3551, 6202–6223, 6324–6361 and 6381–6410. Source inspection only.

- Custom manufacturer and model rows are advisory suggestions in `appState.hardwareCatalogue`. Dedicated manufacturer changes target manufacturer-only rows and leave model rows untouched; model changes update/remove their catalogue rows. Neither path directly rewrites saved device manufacturer/model strings. The older hardware manager offers a second editing route using browser prompts; test equivalent results and keyboard behaviour before standardisation.
- Dedicated custom software edits update `label` and `deviceTypes` while preserving the existing `key`; server service edits update `label` while preserving `key`. This is important for retaining device associations across renames. Their changes are copy-on-write with checked `saveState()` and rollback on failure.
- Software and service availability are derived from configured entries plus built-in suggestions. Archived custom entries are excluded from new assignment choices, while their stored catalogue keys remain available for historical reference. The older in-device software manager deletes the catalogue row outright, so its behaviour is not equivalent to dedicated-screen archiving; see M-028.
- Existing safeguards include built-in manufacturer protection, duplicate-name checks, type association validation for model suggestions, preservation of legacy model association during an unchanged edit, and retained device detail keys during ordinary saves. The audit has not established that all legacy backup permutations are correctly displayed or restored; these require actual test fixtures and browser verification.

**WF-08 source checkpoint:** Catalogue CRUD, independent saves, device reference identity, archive/delete paths, ordinary device edit preservation, device-type conversion and previous-configuration restore have been traced. Main unresolved source-supported candidate: M-028, covering archived assignment visibility, editability, historical labels, restoration eligibility and legacy manager deletion. Do not reopen previously closed M-021 without new contrary evidence. No browser, accessibility or import/export regression suite has been executed in this checkpoint. WF-08 may move to a source-audit checkpoint while these tests remain explicitly outstanding; do not describe it as fully verified.


### WF-08 naming and responsibility review (source audit, 23 October 2026)

**Scope:** Targeted inventory of WF-08 catalogue, software and service functions in published v1.3.0 `app/caffoot-lite.html`. Existing names below are actual identifiers. Proposed names are **documentation suggestions only**, not renames or migration commitments. Names containing `phase120`, `phase19B` and `phase130` reflect historical development phases rather than current user-facing concepts.

| Existing function | Responsibility observed | Possible descriptive name |
| --- | --- | --- |
| `phase120HardwareCatalogue()` (6221) | Read saved custom manufacturer/model suggestion rows | `getCustomHardwareSuggestions()` |
| `phase120ManufacturerSave()` (3303) | Create, update or remove manufacturer-only catalogue associations | `saveManufacturerSuggestionChanges()` |
| `phase120ModelSave()` (3400) | Create, update or remove model suggestions | `saveModelSuggestionChanges()` |
| `phase120UpdateHardwareCatalogue()` (6241) | Legacy in-device hardware catalogue add/edit/remove via prompts | `updateHardwareSuggestionsFromDeviceEditor()` |
| `phase19BSoftware()` (6324) | Read all saved custom software entries, including archived | `getSavedSoftwareCatalogue()` |
| `phase120SoftwareOptions()` (6381) | Combine active custom software and built-in suggestions | `getAvailableSoftwareOptions()` |
| `phase19BSoftwareFields()` (6327) | Return keys for **all** custom software, including archived | `getSavedSoftwareKeys()` |
| `phase120SoftwareFieldsFor()` (6403) | Return available software keys applicable to a device type | `getAssignableSoftwareKeysForType()` |
| `phase120SoftwareSaveCustom()` (3458) | Create/update custom software and check persistence | `saveCustomSoftwareEntry()` |
| `phase120SoftwareRemove()` (3472) | Open removal confirmation; does **not** itself remove | `confirmSoftwareArchive()` |
| `phase120SoftwareArchive()` (3478) | Archive custom software while retaining catalogue entry | `archiveCustomSoftware()` |
| `phase19BUpdateSoftware()` (6344) | Legacy manager add/rename/**permanent catalogue row removal** | `updateSoftwareFromDeviceManager()` |
| `phase19BServerFunctions()` (6148) | Read all saved custom server services | `getSavedServerServices()` |
| `phase120AvailableServerServices()` (6153) | Combine active saved and starter services | `getAvailableServerServices()` |
| `phase19BServerFunctionFields()` (6158) | Return available service keys, **not** archived keys | `getAssignableServerServiceKeys()` |
| `phase120SaveServerService()` (3533) | Create/rename custom server service | `saveCustomServerService()` |
| `phase120ArchiveServerService()` (6202) | Archive service with saved device records preserved | `archiveCustomServerService()` |
| `phase130ObsoleteDeviceFields()` (7049) | Identify populated recognised keys incompatible with destination type | `getIncompatibleDeviceDetailsForTypeChange()` |
| `phase130RestoreHistory()` (6007) | Restore selected previous device type configuration | `restorePreviousDeviceConfiguration()` |

**Responsibility overlaps:** The dedicated catalogue screens and older in-device managers both mutate hardware and software suggestions, but the software removal semantics differ (archive versus catalogue row deletion). `phase19BSoftwareFields()` and `phase19BServerFunctionFields()` look symmetrical but one returns all saved custom keys while the other returns only currently available keys; this matters in conversion and restore. `phase120SoftwareRemove()` names a confirmation dialog as if it performs removal. Some managers use `prompt()` and `confirm()` while newer editors use structured modals. These are concrete maintainability and consistency candidates, not evidence that a mass rename is safe.

**Future change rule:** Preserve saved catalogue keys, legacy import/export compatibility, event-handler wiring, function references, active versus archived selection semantics, and all save/rollback protections. Consider naming changes incrementally alongside approved workflow fixes and regression tests, not as a broad cosmetic refactor. No application source changed during this audit.


## WF-09: change history, preferences and settings (source audit opened, 23 October 2026)

**Basis:** Published v1.3.0 `app/caffoot-lite.html`, source inspection only. Browser, storage-denial and accessibility testing outstanding.

### Change history and its boundaries

- `AUDIT_KEY='caffoot_audit_v1'` and `AUDIT_LIMIT=200` (lines 1738–1749) keep a separate, browser-local best-effort log. `readAuditHistory()` returns at most the latest 200 entries and falls back to an empty array on unavailable, malformed or unexpected storage.
- `auditChanges()` (1751–1787) summarises created, updated and deleted devices, subnets, racks and VLANs, IP allocation changes and managed device type/location list changes. It records labels and changed field names, not previous/current field values; it does not provide exhaustive per-field tracking for all settings and catalogues.
- `recordAudit()` (1788–1797) keeps at most 200 events and at most 60 change entries per event, with an omitted count. If history persistence fails, the code warns and shows a toast saying the inventory saved but history could not be stored. Verify interaction with `saveState()` before concluding that a history entry always corresponds to a confirmed inventory save.
- `exportAuditHistory()` (1798–1805) downloads the local log separately. `renderAuditHTML()` (1806–1822) explicitly states that this is not a tamper-proof or multi-user audit system and is not included in standard inventory JSON backups. History therefore cannot be treated as an authoritative, portable inventory version record.

### Appearance and settings boundaries

- `caffootThemePreference()` (1701–1707) reads `caffoot_theme_preference` when valid, otherwise falls back to legacy `caffoot_dark`, defaulting to Light when storage is unavailable. `caffootApplyTheme()` uses the system colour scheme only for the explicit System choice (1708–1713).
- `caffootSetTheme()` (1714–1722) writes the modern preference and compatibility key, catches storage errors with a console warning, then applies and rerenders the interface. Potential usability question: if browser storage rejects the write, the user is not given a visible persistence warning and the selected mode may not persist across reload. Verify in a storage-denied browser scenario before assigning a maintenance item.
- The system appearance change listener updates the display only when System is selected and writes the legacy compatibility key best-effort (1723–1735). The old quick toggle explicitly chooses Light or Dark rather than System.
- `phase16ARenderSettings()` (7203–7272) organises Data Management, Preferences, Help & Guides and About; Data Management links to established backup, restore, safety, update and destructive reset flows rather than introducing separate save implementations. Optional storage indicator reads are guarded. User guidance states that inventory remains browser-local and exports are necessary for long-term backups.

**Next WF-09 source checks:** Trace `saveState()` to audit logging and its failure semantics, inventory replacement/reset and audit baseline handling, audit export versus inventory export, preference persistence after reload, and the names/responsibilities of settings and history functions. Check for user-visible confusion between change history, previous device configurations and safety snapshots. Record genuine candidates only after establishing their actual behaviour.


### WF-09 follow-up: audit log ordering and reset/restore rollback (source audit, 23 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` lines 1825–1853, 7388–7437 and 7802–7845. Source inspection, not browser verification.

- `saveState()` first validates the inventory, serialises and writes it, then checks storage readback equality. Only after that initial success does it call `recordAudit(JSON.parse(auditBaseline), appState, nextAuditReason)`. Audit diff exceptions are caught separately; history persistence failures are nonfatal and explicitly warn that the inventory saved but history could not be stored. On successful completion `auditBaseline` advances and `nextAuditReason` clears.
- Clean Start sets `nextAuditReason='Clean inventory reset'`, calls `saveState()`, and then independently reads and normalises stored inventory to verify the clean state. If this later verification fails, the catch restores in-memory and prior storage/safety values, but no corresponding rollback of `auditHistory` or `auditBaseline` is visible in this function (lines 7417–7436). **Candidate:** a recorded reset event could survive an unsuccessful final reset verification, and the baseline could then be out of step with restored inventory. Needs a forced-failure test; do not claim this happens in normal use.
- Backup restore similarly calls `saveState()` with `nextAuditReason='Backup restored'`, then independently verifies normalised stored inventory. If that later verification fails, it restores the original in-memory inventory and saved/safety snapshots and explicitly resets `auditBaseline=currentSnapshot`, but does not visibly retract a previously recorded audit event (lines 7818–7840). **Candidate:** a false successful-restore event in the best-effort local history after an ultimately cancelled restore. This is not evidence of inventory corruption.
- Both flows have safety snapshots, failure handling and storage rollback safeguards. Any correction must preserve these safeguards and never allow audit-history failure to block a successful inventory save. The audit trail is explicitly not tamper-proof or a transaction journal.

**Verification:** Use disposable data and controlled failures specifically after `saveState()` returns true but before final reset/restore verification finishes; compare inventory, `auditBaseline`, visible history and separately exported history. Verify normal success, initial storage failure, rollback failure/recovery mode, reload and browser storage denial. Do not infer a defect from source alone without exercising these unusual failure paths.


### WF-09 follow-up: reload, export and recovery boundaries (source audit, 23 October 2026)

**Evidence:** Published v1.3.0 `app/caffoot-lite.html` lines 1614–1647, 1670–1677, 1740–1750, 1798–1805, 1825–1853, 7460–7503 and 7802–7840.

- Startup loads the inventory from `caffoot_state`, but separately reads up to 200 local history entries from `caffoot_audit_v1`. The in-memory audit comparison baseline is freshly derived from the loaded inventory on every reload, rather than reconstructed from the last history entry. This prevents normal reloads from treating the whole saved inventory as a new change.
- Standard inventory export uses `phase20CreateBackup()` to copy `appState` and attach version metadata; it does not include the separate audit-history storage key. Audit history has its own JSON export and is not imported by the ordinary inventory restore. Users changing browsers must export the inventory separately and should not expect the local change log to follow.
- Unreadable stored inventory triggers recovery mode and prevents ordinary saves, preserving original bytes for download. The explicit recovery-banner reset writes a default inventory and reloads directly (lines 1670–1677); it does not call `saveState()` and therefore does not create a normal 'Clean inventory reset' audit event. This is a distinct emergency recovery action, not the normal Clean Start workflow. Verify user-facing clarity; do not change emergency recovery behaviour casually.
- A history-storage write failure leaves the in-memory history entry present for the current session, while `recordAudit()` displays a warning. After a reload, the separately persisted history may lack that event. This is consistent with a best-effort log, but the distinction between visible session history and durable history warrants a controlled storage-denial test.
- `readAuditHistory()` accepts any parsed JSON array, truncating it to the newest 200 entries, without schema validation of each event. `renderAuditHTML()` expects event fields including `changes` and `at`. A malformed but array-shaped local history payload could therefore affect the history screen. This is a **source-supported resilience candidate**, not a confirmed browser crash. Test deliberately malformed local history separately from the protected inventory data; do not allow history problems to block access to inventory.

**Next:** Review settings/history function naming and any duplicated concepts; reconcile actionable candidates with existing maintenance roadmap before declaring the WF-09 source checkpoint. Browser testing remains outstanding.


### WF-09 function naming and responsibility review (source audit, 23 October 2026)

Names below are existing published v1.3.0 identifiers. Proposed alternatives are documentation suggestions only, not authorised renames.

| Existing function | Actual responsibility | Proposed descriptive name |
| --- | --- | --- |
| `caffootThemePreference()` (1701) | Read current appearance preference with legacy fallback | `getAppearancePreference()` |
| `caffootApplyTheme()` (1708) | Apply current preference to document and icon | `applyAppearancePreference()` |
| `caffootSetTheme()` (1714) | Persist chosen appearance and refresh display | `setAppearancePreference()` |
| `toggleDarkMode()` (1734) | Toggle explicit light/dark choice | `toggleLightDarkAppearance()` |
| `readAuditHistory()` (1742) | Read local best-effort change events | `loadLocalChangeHistory()` |
| `auditChanges()` (1751) | Calculate a summary of inventory changes | `summariseInventoryChanges()` |
| `recordAudit()` (1788) | Append bounded local change event | `recordLocalInventoryChange()` |
| `exportAuditHistory()` (1798) | Download separate change-history JSON | `downloadLocalChangeHistory()` |
| `renderAuditHTML()` (1806) | Build change-history screen markup | `renderChangeHistoryView()` |
| `personalSafeStorageGet()` (7206) | Guard optional localStorage read for settings | `readOptionalBrowserStorage()` |
| `phase16ARenderSettings()` (7211) | Build all settings sections and navigation | `renderSettingsWorkspace()` |
| `phase16AClearSystem()` (7382) | Confirm and execute normal Clean Start with recovery copy | `resetInventoryWithSafetyCopy()` |
| `phase20CreateBackup()` (7460) | Create inventory export payload with version metadata | `createVersionedInventoryBackup()` |
| `phase11DownloadSnapshot()` (7540) | Download previously saved safety-copy text | `downloadRecoverySafetyCopy()` |
| `phase130RestoreHistory()` (6007) | Restore previous **device configuration**, not change log | `restorePreviousDeviceConfiguration()` |

**Responsibility boundaries:** `readAuditHistory()` / `exportAuditHistory()` concern a separate local change log; `phase130RestoreHistory()` concerns a device's prior type configuration; `phase11DownloadSnapshot()` concerns a safety copy of an inventory. None is a substitute for `exportData()`, the standard complete inventory backup. The current phase-numbered names obscure these differences. Appearance preference writes and legacy fallback should remain distinct from inventory `saveState()`, which validates and verifies saved inventory.

**Maintenance reconciliation:** M-025 already covers plain-language backup/recovery terminology; M-026 already covers shared form conventions. Avoid duplicating these. The two additional WF-09 investigation candidates are (1) malformed array-shaped local audit events affecting the history view and (2) possible stale success events or baseline after a later restore/reset verification failure. Record together as a scoped history reliability candidate, with browser fault injection required before implementation. Also test whether appearance selection silently fails to persist under blocked browser storage. No application changes or browser tests performed.

**WF-09 source checkpoint:** Local change-history lifecycle, reload, export boundaries, inventory save ordering, restore/reset interaction, recovery mode, settings/appearance preferences, and targeted naming review have been inspected. This is a **source checkpoint only**, not a browser or accessibility sign-off. Preserve compatibility with existing browser storage and older inventory backups, and keep history failures non-blocking for inventory use.


## WF-10: security, build and release process (source audit opened, 23 October 2026)

**Scope:** Published `main` repository scripts, package manifest and GitHub workflows. Source/configuration inspection only; no build, browser execution or workflow run was performed in this checkpoint.

### Build and packaging path

- `app/package.json` identifies v1.3.0 and defines `npm run release` as a chain of source, security, inventory, rack, restore, catalogue, subnet, update and backup checks followed by `npm run build`, `npm run check:build` and `npm run package`. The chain stops on a failed command. A script being defined does not prove that it has passed on the current commit.
- `app/build-offline.cjs` builds `app/dist/Caffoot-Lite.html` from `app/caffoot-lite.html`, compiling Tailwind locally, embedding Font Awesome CSS/webfonts and branding images, replacing external runtime CSS dependencies and embedding licence notices. It rejects unexpected source layout and remaining remote runtime resources. The developer source and distributed standalone HTML are distinct artifacts.
- `app/verify-build.cjs` checks for embedded styles, fonts and branding, absence of selected remote or parent-directory resource references, expected app markers and licence notices. Its own final output says it does not replace browser testing.
- `app/package-release.cjs` checks source/package/build version alignment, installed dependency licence copies, expected notice text, exact release ZIP membership, extracted file hashes and SHA256SUMS. Packaging creates a release candidate locally; it does **not** itself publish a GitHub release.

### GitHub automation boundaries

- `.github/workflows/caffoot-lite.yml` runs on pushes to `main` affecting `app/**` or that workflow, plus manual dispatch. It installs dependencies, runs the release chain, parses inline JavaScript syntax, installs Playwright Chromium, executes four browser scripts (offline, import, restore, upgrade), and uploads preview HTML/ZIP/checksums as a testing artifact. This workflow is not configured to run automatically for documentation-only branch pushes.
- `.github/workflows/validate-hotfix.yml` runs on pull requests affecting `app/**`, release notes or its workflow, plus manual dispatch. It runs `npm run release` and uploads a candidate package. **It does not invoke the four Playwright browser scripts in `caffoot-lite.yml`.** A green hotfix workflow therefore is not, by itself, proof of a full browser regression run.
- `.github/workflows/git-history-secrets.yml` scans reachable Git history using Gitleaks on pull requests, pushes to `main` and manual dispatch. This is a repository history secret check, not a guarantee that the application has no security flaws.
- `.github/workflows/publish-v1.0.0.yml` is a historical, version-specific publishing workflow, restricted by repository/ref and pinned approved v1.0.0 source/artifact. Do **not** treat it as a generic current-release publishing mechanism. Verify actual current publication procedure separately.

### First review findings and next checks

- **Release assurance boundary:** Pull-request validation and main-branch build automation exercise different test sets. Establish which checks must pass before approving each future maintenance release and whether a documented browser-test gate is needed. No workflow change is authorised by this audit.
- **Naming/responsibility review:** `build-offline.cjs` creates the distributed standalone HTML; `verify-build.cjs` verifies its structure; `package-release.cjs` creates and verifies the release ZIP; `npm run release` is a *local build and verification pipeline*, not a publication command. Documentation and future function/script names should make that distinction clear.
- **Next:** Inspect security/privacy/network checks and their limitations, current release instructions and GitHub publication path, dependency pinning, workflow permissions, offline test scope and any test gaps. Record source evidence and remaining manual release checks before the WF-10 checkpoint. Never claim CI success without inspecting the relevant run.


### WF-10 security, browser coverage and public release documentation follow-up (23 October 2026)

**Verified release reference:** GitHub Releases latest endpoint reports `v1.3.0` at `https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.0`. This is a repository release record, not evidence of tests passing in this audit session.

- `app/check-network-surface.cjs` is a static guard against unexpected `fetch`, XMLHttpRequest, WebSocket, EventSource, sendBeacon, eval, Function and dynamic script injection. It permits one explicitly credential-free GitHub release metadata fetch for manual update checks. It does **not** capture runtime traffic or comprehensively inspect all HTML injection sinks.
- `app/check-release-privacy.cjs` rejects suspicious tracked path names, checks two fictional example fixtures and asserts the build package is private. If Git metadata is unavailable, it checks extracted folder paths instead. It does **not** scan the content of all tracked files for secrets or inspect full Git history or finished HTML/ZIP.
- `app/check-app.cjs` and the many `test-security-*.cjs` scripts are targeted source/behaviour regression checks; coverage must be understood individually, not treated as a blanket security certification.
- `app/test-browser-offline.cjs` opens built HTML via `file://`, blocks outbound requests and checks UI navigation, browser persistence, corrupted-inventory recovery and other scenarios. `test-browser-import.cjs` rejects malformed, unsafe and oversized imports without altering inventory. `test-browser-restore.cjs` covers cancelled restore, simulated save failure, successful restore and reload. `test-browser-upgrade.cjs` exercises exported backup restoration after moving/renaming the standalone HTML and does not assume browser storage follows the file. These four scripts run on the main-branch build workflow but not in the pull-request hotfix workflow. They do not constitute exhaustive cross-browser/manual testing.
- `SECURITY.md` states the stable release is v1.1.2 as of 19 October 2026. `INSTALLATION.md` states v1.2.1 is stable and v1.3.0 is still in preparation. Both are **stale relative to the verified latest GitHub v1.3.0 release**. This is a confirmed public-documentation consistency defect, not a source-code fault. Update these release references and recheck any other version-specific wording in the post-audit documentation tidy-up. Preserve all safety warnings and never infer that a stale version line invalidates the rest of the guidance.
- `SECURITY.md` correctly warns that browser-local inventories are not encrypted or shared server-side, reverse proxying alone is not authentication, and manual GitHub update checks are optional. It explicitly requires manual source/history, dependencies, exact artifact and approval review before publication.
- `docs/standards/DEVELOPMENT-WORKFLOW.md` explicitly requires focused tests, full release validation, manual opening of the freshly built HTML, recording test results, owner approval for merge/tag/publish, and continuity in handovers. Its Windows PowerShell examples are platform-specific guidance, not a requirement that the owner must use Windows on a Mac.

**Open checks before WF-10 completion:** Inspect current release notes/README/user guide for stale version claims; establish exact current publication path and release assets; check remaining automated test scope and security boundary; reconcile findings into the maintenance register without duplicate items. No application code, CI workflows or published files changed during this source audit.


### WF-10 final release-document reconciliation checkpoint, 23 October 2026

The latest public GitHub release record identifies v1.3.0 as published on 21 October 2026, with `Caffoot-Lite-1.3.0.zip`, `Caffoot-Lite.html` and `SHA256SUMS`. Root README correctly says v1.3.0 is published. Four other root documents are out of step: `SECURITY.md` says v1.1.2 is current; `INSTALLATION.md` says v1.2.1 is current and v1.3.0 unreleased; `USER-GUIDE.md` calls v1.3.0 rack features an upcoming development build; `ROADMAP.md` says v1.3.0 is unpublished. These are confirmed documentation drift and recorded in M-030. They must be corrected without altering accurate historical release records.

The current release checklist and archive policy already require review of public guides, release packaging and obsolete documents. They now explicitly call for an inventory of mandatory root files, stable-version statements, website feature descriptions and a documented decision about which files are updated or archived. The current `package-release.cjs` explicitly reads release notes, installation/user guides and backup format from the repository root. Moving those inputs requires separate approval and verified tooling changes; archiving old material must not break inbound links or delete historical evidence.

**WF-10 source-inspection status:** Reviewed the release chain, GitHub build and hotfix workflows, network/privacy static checks, representative browser tests, release checklist, archive policy, public version claims and public release assets list. No current CI run or downloaded asset hashes were verified during this audit. No application code, release scripts or published files were changed. Source inspection is complete for the documented WF-10 scope; full release assurance remains dependent on later execution of targeted tests, automated CI, manual browser and accessibility checks where relevant, and owner-approved publication controls. Follow-up improvement M-030 remains proposed for the post-audit roadmap review.

## WF-13 consolidated targeted verification coordination, 23 October 2026

The owner agreed to run remaining safety failure scenarios as one coordinated disposable-browser regression round. The authoritative scenario IDs and evidence requirements are in [WF-13 consolidated evidence plan](../audits/WF-13-CONSOLIDATED-EVIDENCE-PLAN.md). Relevant workflows remain WF-01 and WF-02 (M-001, M-018, M-020), WF-06 (M-011), WF-11 (M-012), and WF-12 (M-031). Verify both throwing and silently ignored storage writes, exact persisted bytes and reload; do not infer persistent rollback from an in-memory reset. The grouped scenarios are **not executed** at this planning checkpoint; no change to existing application behaviour or workflow acceptance status.

**WF-13 combined browser implementation, 23 October 2026:** `app/test-browser-consolidated-audit.cjs` on the audit branch defines isolated fictional inventory fault cases across WF-01, WF-02, WF-06, WF-11 and WF-12 and is wired to main-push CI. This checkpoint records test source only. **No new browser run or passed assertions have been verified**; existing workflow acceptance remains in progress. See [WF-13 consolidated evidence plan](../audits/WF-13-CONSOLIDATED-EVIDENCE-PLAN.md).

**23 October 2026 bulk IPAM audit evidence:** Executed Chromium run 39948681541 shows `phase12BApply()` may continue to persist a bulk reservation when the prebulk safety snapshot storage write is silently ignored. The code catches thrown write errors but does not verify the stored snapshot by reading it back. M-031 remains open for product owner decision and regression coverage; no application behaviour changed. Other combined scenarios remain pending.

Proposed M-031 bulk IPAM safeguard, 23 October 2026:** Before changing any allocation, `phase12BApply()` writes `caffoot_phase12b_prebulk_snapshot` and reads it back. If the stored text does not match the original `JSON.stringify(appState)`, the operation is cancelled with an error and no in-memory allocation change is applied. This is a proposed behaviour correction awaiting executed Chromium verification and explicit product owner approval before merge. See WF-13 consolidated evidence plan and WF-02 test matrix.

**M-018 confirmed source reference issue, 23 October 2026:** `phase130HandleLocationChange()`, `phase130CancelCustomLocation()` and `addCustomLocationOption()` call `toggleRackLocationFields(select.value)`, but there is no corresponding function definition in `app/caffoot-lite.html`. Main Chromium run 39952033135 reproduced the reference error while testing custom location creation. User-path impact and correct replacement behaviour require further investigation. M-031 bulk safety snapshot regression scenarios passed in that same run. No M-018 application change made.

**23 October 2026:** M-018 proposed device location behaviour: location selection, cancellation and creation update the location selection without invoking a rack location filter. Rack mounting remains independently controlled by device mounting type and rack selector. Verification pending.

## Verified main Chromium checkpoint, 23 October 2026

Verified in main Chromium run 39953195636: M-031 bulk snapshot readback blocks ignored writes; M-018 location actions no longer call the undefined rack handler, and selection/cancellation tests pass. Repair workflow M-012 still permits mutation after a silently ignored safety snapshot, requiring a safeguard decision. Failed saves in M-001, M-020 and M-018 leave in-memory changes even though stored bytes remain unchanged. Import rollback M-011 preserved original inventory in three tested cases; secondary snapshot handling needs inspection.


## M-012 repair snapshot safeguard, 23 October 2026

Source change proposed on branch `fix/m012-ipam-repair-snapshot-readback-20261023`: `phase11CApplyRepair()` now compares the stored pre-repair safety snapshot with the exact original inventory before changing IPAM allocations. A silently ignored snapshot write cancels repair and preserves the original inventory. The consolidated Chromium test now requires unchanged stored and in-memory inventory for this failure case. This is a source change and revised test assertion, **not yet executed browser evidence**. Existing throw-snapshot, throw-main, success, old-snapshot and reload scenarios remain in the suite. M-012 stays open until the revised suite passes and the results are reconciled. Other findings and the overall audit remain open. No release authorised.


### M-012 Chromium execution evidence, 23 October 2026

GitHub Actions `Audit consolidated Chromium regression` run [39955252665](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39955252665), job `120419381282`, executed `node test-browser-consolidated-audit.cjs` successfully at commit `810ca43721fa09bb82c33369780e428f82056f69`. The job log explicitly records PASS for all five M-012 cases: throwing snapshot write, silently ignored snapshot write, throwing main save, successful repair and pre-existing snapshot. It also records passing scenario execution for M-031, M-001, M-018, M-020 and M-011; the latter four findings remain open because a passing observation scenario is not proof of corrected behaviour. M-012 targeted regression evidence is now satisfied; final finding disposition and cross-reference reconciliation remain required before audit closure. This evidence does not claim a published release or independent execution on v1.3.0.


### PR #77 merged and combined regression approach, 23 October 2026

PR [#77](https://github.com/Caffoot/Caffoot-Lite/pull/77) was merged to `main` as commit `103a7bafe8b8fd0139777462f2d6250f647b2f62`, with owner approval for audit merges. Latest head `ae3d270f9d0d3f48d55ac3b4e48ea4580f885247` passed all four GitHub checks, including consolidated Chromium run [39955498407](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39955498407). The M-012 repair safeguard and its five targeted browser scenarios are verified and merged; M-012 can be recorded as corrected in repository source, but not published in a new release. The user agreed that remaining findings should share one consolidated Chromium regression suite wherever practical, retaining independent assertions and finding dispositions. M-001, M-011, M-014, M-018, M-020 and M-031 require individual resolution or explicit deferral. WF-13 and the master audit remain in progress pending final evidence and cross-reference reconciliation. Historical pre-merge notes above remain as chronology, not current status.


### Coordinated integrity correction candidate, 23 October 2026

On branch `fix/audit-remaining-save-integrity-20261023`, source changes proposed for M-001 rack unassignment, M-018 custom location creation and M-020 device graphic selection restore the original in-memory inventory when `saveState()` fails, instead of displaying unsaved changes. M-011 import rollback now verifies readback of the previously held safety snapshot, including the absence case, and enters the existing recovery protection path when restoration cannot be verified. The consolidated Chromium script has been updated to assert rollback for M-001, M-018 and M-020 and inject a silently ignored secondary safety snapshot restoration for M-011. These are proposed source and test changes, **not executed test evidence**. No existing inventory validation rules were tightened. M-014 usability disposition and M-031 final closure review remain open. All four correction findings remain open until passing execution and final documentation reconciliation. No merge or release authorised at this checkpoint.


### PR #79 executed regression and merge reconciliation, 23 October 2026

PR [#79](https://github.com/Caffoot/Caffoot-Lite/pull/79) merged into `main` as `c140ff330f3309b7d99d46f01c075b40819617d3` following four successful checks on head `41b879b0dfe35b66afe55f99bf7f2deb8f6b195b`. GitHub Actions consolidated Chromium run [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113), job `120426540667`, executed and logged PASS for M-001 failed rack unassignment, M-018 failed custom location save and location cancellation, M-020 failed graphic save, M-011 import rollback throwing main save, ignored secondary snapshot restoration and earlier safety copy; M-012 and M-031 scenarios also passed. This supersedes the earlier **not executed** note for these revised scenarios. M-001, M-018 and M-020 source corrections are verified and merged, subject to final finding register disposition. M-011 primary inventory preservation and secondary restoration detection are covered, but recovery banner and further-save blocking behaviour in the ignored-secondary-write scenario were not explicitly asserted by this suite; retain that narrow verification item. M-014 already has executed recovery tests and requires product disposition. M-031 passed its targeted scenarios and needs register closure review. WF-13 and the master audit remain in progress pending independent release asset provenance evidence and final cross-reference reconciliation. No new release was published; published v1.3.0 is unchanged.


### M-011 recovery mode final assertion candidate, 23 October 2026

The consolidated Chromium test on branch `test/audit-m011-recovery-mode-evidence-20261023` now additionally asserts that an ignored previous safety snapshot restoration activates recovery mode, displays the recovery banner, retains exact original stored bytes for recovery export and blocks a subsequent `saveState()` call. This is a **test-only proposed change, not yet executed evidence**. M-011 final closure remains pending a passing browser run. M-014 requires its separate product usability disposition, M-031 its final finding status review, and independent release asset provenance and overall documentation reconciliation remain open. No application behaviour change, merge or release is claimed by this checkpoint.


### Final consolidated audit gate, 23 October 2026

PR [#81](https://github.com/Caffoot/Caffoot-Lite/pull/81) merged to `main` as `4c3585436dcd4a02eeefb41ea310ddd2ee1799d4`. All four checks succeeded on head `93663a5e84da980c45e191d902358506d2c6f60e`, including consolidated Chromium run [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469), job `120433890571`. The executed log records PASS for M-011 `throw-main`, `ignore-restore-snapshot` and `old-snapshot`; the updated ignored-restoration scenario explicitly asserts recovery mode, visible banner, original stored bytes and blocked subsequent saves. Earlier **not yet executed** wording above is historical and superseded by this evidence. M-011 is corrected and browser verified in merged source, pending final master finding disposition. M-001, M-018, M-020 and M-012 likewise have merged corrections and executed Chromium evidence. M-031's five scenarios passed and its formal disposition remains to be reconciled. M-014's previously executed recovery reset evidence requires a product usability disposition rather than an invented new test pass. Outstanding final gates include independent published v1.3.0 ZIP asset and checksum provenance, explicit v1.2.1 backup import compatibility on the published v1.3.0 HTML (not yet executed in this final gate), review of other WF-01 to WF-13 incomplete coverage entries, and full cross-reference reconciliation. A single final PR can record the evidence and explicit deferrals, but cannot claim tests not run or mark the entire audit complete prematurely. Published v1.3.0 assets must not be modified.


### Final evidence and finding disposition reconciliation, 23 October 2026

**Current authoritative checkpoint, superseding earlier pending and candidate notes above:** PR #83 merged into `main` as `dd834c0b5a23663e52a69bb289dbd0bd8b182e68`. Four GitHub checks succeeded. Published release compatibility workflow run `39961182872`, job `120439275189`, recorded PASS for published v1.2.1 and v1.3.0 SHA256SUMS verification and ZIP integrity, populated inventory import and genuine export using the published v1.2.1 HTML, and subsequent import into the published v1.3.0 HTML with core device, rack, subnet and location collection preservation and persistence across reload. This is **executed Chromium evidence**, not merely source inspection. It tests a representative populated fixture exported through the original published application, not every historical user backup. The published assets were not changed.

**M-031 disposition:** corrected in merged source and verified by the five previously executed targeted Chromium scenarios (including runs `39957395113` and `39959581469`). Close the technical correction and targeted test finding; do not imply exhaustive coverage of all bulk IPAM operations.

**M-014 disposition, product owner approved 23 October 2026:** defer recovery reset usability improvement to the v1.3.1 maintenance roadmap. Existing recovery safety behaviour has six previously executed browser scenarios in run `39944710633`; the possibility of unclear user feedback when a reset write is ignored remains a documented usability limitation. This is a **deferred improvement**, not a corrected defect or an unqualified pass. Do not change the published v1.3.0 application.

**Remaining master audit scope:** The historical WF-01 to WF-13 coverage rows contain partial or pending areas. Prior successful targeted tests remain valid, but those rows must not silently become complete. Treat unverified paths and broader accessibility, catalogue, recovery and failure coverage as explicitly outstanding or as scoped v1.3.1 follow-up, subject to product owner acceptance. This reconciliation does not itself prove full WF-01 to WF-13 coverage or constitute final audit sign-off. No new tests were executed for this documentation change. The v1.3.0 extended audit is **closed with documented limitations by explicit product owner approval on 23 October 2026**. This is an administrative audit closure, not a claim that every WF-01 to WF-13 path was exhaustively tested. The historical partial coverage rows remain accurate as evidence coverage records. Unverified paths, broader accessibility and catalogue checks, and recovery and failure scenarios not covered by the cited targeted evidence are carried forward for prioritisation in v1.3.1 maintenance planning. M-014 is an approved deferred usability improvement; M-031 is technically corrected and verified by targeted Chromium evidence. The release compatibility gate passed for the representative populated inventory in run 39961182872. No additional tests were executed for this closure decision. No application behaviour, published asset or release was changed. No release was created.



### Final P12 coverage disposition for the closed v1.3.0 audit, 23 October 2026

**Decision basis:** The product owner approved administrative closure of the extended v1.3.0 audit with documented limitations on 23 October 2026. This decision closes the audit programme, **not** each individual P12 completion gate. The 13 workflow areas below have an explicit disposition so that outstanding verification is not mistaken for a passed test or lost during future maintenance.

| Workflow | Evidence retained from v1.3.0 audit | Outstanding P12 or broader verification disposition |
| --- | --- | --- |
| WF-01 Startup and recovery | Recovery reset fault scenarios, run 39944710633 | Carry incomplete caller and recovery usability coverage into maintenance; M-014 deferred with owner approval |
| WF-02 Saving and integrity | Targeted failure and rollback scenarios, runs 39957395113 and 39959581469 | Carry unverified save callers and full failure matrix into maintenance |
| WF-03 Device lifecycle | Targeted failed device graphic save evidence, run 39957395113 | Carry full lifecycle, relationships and form coverage into maintenance |
| WF-04 IPAM | Targeted bulk snapshot integrity, runs 39957395113 and 39959581469 | Carry unverified subnet, VLAN and allocation matrix coverage into maintenance; M-031 technical finding closed |
| WF-05 Racks | Targeted rack unassignment failure evidence, run 39957395113 | Carry accessory, placement and imported collision matrix coverage into maintenance |
| WF-06 Backup and restore | Published v1.2.1 export and v1.3.0 import, run 39961182872; targeted rollback, run 39959581469 | Carry other historical backup shapes and failure matrix coverage into maintenance |
| WF-07 Interface | Targeted custom location save failure evidence, run 39957395113 | Carry accessibility, keyboard, modal and form coverage into maintenance |
| WF-08 Catalogues | Source notes and identified coverage gaps | Carry complete catalogue and services P12 assessment and browser evidence into maintenance; no comprehensive browser PASS claimed |
| WF-09 History and preferences | Source notes and identified coverage gaps | Carry complete history, settings and persistence P12 assessment and browser evidence into maintenance |
| WF-10 Security and release | Published package checks, run 39961182872, and existing release checks | Carry remaining security and release checklist coverage into maintenance; package verification is not comprehensive security testing |
| WF-11 Schema and migrations | Published backup migration test, run 39961182872 | Carry other migration shapes and complete schema gate into maintenance |
| WF-12 Failure and recovery | Targeted rollback and snapshot fault scenarios, run 39959581469 | Carry unverified error paths and failure matrix into maintenance |
| WF-13 Traceability | Source to test mapping and CI run references recorded | Carry unverified coverage mapping and outstanding workflow completion gates into maintenance |

**Risk and stop rule:** No further browser tests are claimed for this document only checkpoint. Previously corrected high risk integrity findings have targeted executed evidence, but this is not a guarantee that no undiscovered defects exist. Any newly demonstrated risk to existing inventory data must be triaged separately before a future release. Do not reopen the v1.3.0 audit merely to rerun successful checks. Before any v1.3.1 release, the product owner must agree priorities and explicit acceptance criteria for remaining P12 coverage, with completed tests recorded against their exact revision. The authoritative at a glance source and browser status is the register in `docs/workflows/TECHNICAL-WORKFLOWS.md`. No application change or release is authorised by this disposition.


## Current merged-source integrity safeguards, 23 October 2026

**Reading rule:** The earlier workflow narrative documents the published v1.3.0 baseline and the dated audit history. This section summarises safeguards now present on `main` after the publication. Do not attribute these corrections to the published v1.3.0 download. The [function reference](../standards/FUNCTION-NAMING-AND-REFERENCE.md) records the concrete functions and state changes. The [remediation programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md) tracks follow-up and release decisions.

| Workflow | Current merged-source behaviour and relevant finding | Evidence already executed | Outstanding |
| --- | --- | --- | --- |
| WF-02 and WF-05 | `unassignDevice()` now restores the earlier in-memory rack placement if persistence fails (M-001) | PR #79; Chromium 39957395113 | Full save-caller and rack matrix |
| WF-03 and WF-07 | Custom location creation restores inventory and form selection on failed save (M-018); `phase13GSaveGraphics()` restores device type graphic choice on failed save (M-020) | PR #79; Chromium 39957395113 | Complete device and form lifecycle coverage |
| WF-02, WF-04 and WF-12 | `phase11CApplyRepair()` checks the pre-repair safety copy by readback before changing allocations (M-012); `phase12BApply()` checks the pre-bulk safety copy before applying bulk changes (M-031) | PR #77, Chromium 39955498407; Chromium 39957395113 and 39959581469 | Other integrity and IPAM scenarios |
| WF-01, WF-06 and WF-12 | Import rollback verifies previous safety copy restoration and activates recovery protection on ignored restoration, retaining original bytes and blocking subsequent saves (M-011) | PR #81; Chromium 39959581469 | Full import helper caller tracing and broader backup matrix |

**Source and evidence distinction:** The named functions above were inspected in the current repository HTML. M-011's broader restoration behaviour is supported by the recorded merged PR and executed Chromium assertions; the full helper-level call chain has not been newly inspected in this documentation checkpoint. Historical tests are not new executions. The individual P12 gates remain partial as stated in the workflow register above.

**Maintenance release distinction:** Published v1.3.0 remains unchanged. These merged corrections require explicit inclusion, package verification, relevant regression evidence and product owner approval before any v1.3.1 release.


### WF-06 and WF-12 M-011 current source trace, 23 October 2026

The top-level `importData(event)` implementation on current `main` was inspected, including its backup parsing and validation calls, mounting conflict review, candidate confirmation, exact safety copy readback, candidate save and normalised readback, and both original inventory and previous safety copy rollback checks. On an unverified rollback, it sets `phase17AStorageRecovery`, shows `phase17ARecoveryBanner()` and relies on the existing recovery guard to block subsequent saves. See the [M-011 function call chain](../standards/FUNCTION-NAMING-AND-REFERENCE.md#m-011-import-rollback-call-chain-source-inspection-23-october-2026) for ordered steps and dependencies.

**Verified previously by execution:** PR #81, Chromium run 39959581469, including ignored restoration, recovery banner and save blocking. **Checked in this checkpoint:** source inspection of `importData()` and identification of its called helpers. **Not checked:** all helper internals, historical backup variations and exhaustive rollback fault combinations. These remain part of the partial WF-06 and WF-12 gates.
