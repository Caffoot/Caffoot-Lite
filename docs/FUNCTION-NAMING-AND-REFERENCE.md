# Caffoot Lite Function Naming and Reference

**Status:** Draft documentation standard and initial source-verified examples. No application functions renamed.
**Baseline:** v1.3.0 source inspection on `main`; exact published release provenance remains to be confirmed.

## Purpose

Future contributors should understand what each important function does without needing to know the development phase in which it was introduced. Existing historical names must remain documented until an approved and tested change replaces them.

## Proposed naming convention

- Prefer descriptive JavaScript `camelCase` names that explain the operation, such as `unassignDeviceFromRack()`.
- Prefer a verb and a clear object or outcome: `validateRackPlacement()`, `syncDeviceIpamRecord()`, `confirmDeviceTypeConversion()`.
- Avoid phase numbers, release numbers, unexplained abbreviations and generic names that hide scope.
- Use the same domain terms consistently across functions, workflows, tests and documentation.
- Name a function for its *verified behaviour*, not what its author originally intended.
- Do not rename published v1.3.0 code as part of this documentation exercise. Any approved rename requires updating every caller, test and reference, with regression testing.

## Initial function reference

| Current function | Purpose established by source inspection | Workflow | Suggested name for review |
| --- | --- | --- | --- |
| `handleDeviceSubmit(e, deviceId)` | Validate and save a new or edited device, synchronising IPAM and restoring an in-memory snapshot on reported failure | WF-03 | `saveDeviceFromForm()` |
| `phase130ObsoleteDeviceFields()` | Find populated recognised fields incompatible with the proposed device type | WF-03 | `getIncompatibleDeviceFields()` |
| `phase130ConfirmDeviceConversion()` | Display and await explicit confirmation before archiving incompatible device details | WF-03 | `confirmDeviceTypeConversion()` |
| `phase11BCommitDelete(before, label)` | Save an already-applied deletion; restore the prior in-memory snapshot if saving reports failure | WF-03, WF-04 and others pending call-site review | `commitDeletionWithRollback()` |
| `phase11BIntegrityIssues(state)` | Find duplicate device primary IPs, device IPAM mismatches and missing device, reservation or rack references | WF-02, WF-03, WF-04 | `findInventoryIntegrityIssues()` |
| `handleAssignSubmit(e, rackId, defaultSlot)` | Validate and save rack placement, with in-memory rollback on failed save | WF-03, WF-05 | `saveDeviceRackAssignment()` |
| `unassignDevice(deviceId)` | Clear a device's rack assignment and set its mount type to Desktop; save result currently unchecked | WF-03, WF-05 | `unassignDeviceFromRack()` |
| `deleteDevice(deviceId)` | Confirm deletion, remove device-linked allocations, clear reservations and delegate persistence and rollback | WF-03 | Existing name is already descriptive |

**Caution:** Proposed names are suggestions, not a refactoring plan. Review complete behaviour, call sites and naming collisions before selecting replacements.

## Reference entry requirements

For every significant function record its current name, location, purpose in plain English, inputs, state read or changed, dependencies and callers, validation, failure handling, related workflows, source revision, runtime test status and any proposed rename.

## Change control

Add proposed renames to the maintenance roadmap for investigation. Do not bundle broad cosmetic renaming with urgent data protection fixes unless explicitly approved. A successful rename must preserve behaviour and pass relevant regression tests.

## Additional verified function references

| Current function | Purpose established by source inspection | Workflow | Suggested name for review |
| --- | --- | --- | --- |
| `setDevicePrimaryIp(device, newIp)` | Validate a new primary IP, reject conflicting ownership or reservations, release the old device-owned allocation and update the new IPAM record | WF-03, WF-04 | Existing name is descriptive |
| `syncDeviceIpamRecord(device)` | Synchronise the device's current primary IPAM record with its reservation status, ID, name and notes | WF-03, WF-04 | Existing name is descriptive |
| `findDeviceUsingIp(ip, excludeDeviceId)` | Find a different device with the specified primary IP | WF-03, WF-04 | Existing name is descriptive |
| `phase11BCommitDelete(before, label)` | Persist a deletion already applied in memory; restore the snapshot and display an error if the save fails | WF-03, WF-04 | `commitDeletionWithRollback()` remains a proposal |

The initial reference table and this addition are incremental, not a complete function inventory.
