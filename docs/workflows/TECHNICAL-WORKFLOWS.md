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
