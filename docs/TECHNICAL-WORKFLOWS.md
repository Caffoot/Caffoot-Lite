# Caffoot Lite v1.3.0 Technical Workflows

**Status:** Baseline audit in progress. Not yet a complete or verified specification.
**Source:** Published v1.3.0 baseline, examined from `main`. Before final approval, verify the precise release tag and source commit.
**Purpose:** Describe actual implemented behaviour, data relationships, safeguards, error paths and tests for contributors. Future proposals belong in separate architecture documentation.

## Documentation standard

For each workflow record: entry point and trigger; source path and function names; inputs and state read; ordered operations; validation and authorisation checks; changes to related records; persistence; error and rollback behaviour; interface response; tests; verified source revision; open questions. Never infer a successful runtime test from source inspection. Mark unknowns explicitly. Update documentation with each significant code change.

## Workflow register

| ID | Area | Status |
| --- | --- | --- |
| WF-01 | Startup, load and recovery | Source inspected, runtime verification pending |
| WF-02 | Save and integrity validation | Source inspected, runtime verification pending |
| WF-03 | Device create, edit, convert and delete | Source inspection in progress; runtime verification pending |
| WF-04 | Subnets, VLANs and IPAM | Pending |
| WF-05 | Rack placement and accessories | Pending |
| WF-06 | Backup, import and restore | Pending |
| WF-07 | UI navigation and forms | Pending |
| WF-08 | Catalogues, software and services | Pending |
| WF-09 | Audit history and preferences | Pending |
| WF-10 | Security, build, tests and release | Pending |

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
