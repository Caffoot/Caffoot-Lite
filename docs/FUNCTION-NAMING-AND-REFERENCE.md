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

## Relationship note: virtual hosts

`handleDeviceSubmit()` validates a selected virtual server host against an existing physical server. `deleteDevice()` does not explicitly inspect other devices' `virtualHostId` references before removing a physical server. The complete relationship validation path and runtime behaviour remain under investigation. See WF-03 and maintenance candidate M-005.

## Initial WF-04 function references

| Current function | Source-verified purpose | Workflow | Naming observation |
| --- | --- | --- | --- |
| `phase11BSubnetDependencies(subnet, state)` | Find devices and IPAM records associated with a subnet range | WF-04 | Candidate `getSubnetDependencies()` |
| `deleteSubnet(subId)` | Check child and related records, then present a deletion preview | WF-04 | Name does not convey that this function starts a guarded workflow rather than immediately deleting |
| `confirmDeleteSubnet(subId)` | Recheck the previewed dependencies before committing deletion | WF-04 | Existing name is reasonably descriptive |
| `deleteSubnetCommit(subId)` | Entry point for committing a confirmed subnet deletion; implementation not yet fully traced | WF-04 | Review after complete source inspection |

Names are descriptive suggestions only. No code has been renamed.

## Additional WF-04 functions

| Current function | Source-verified purpose | Workflow | Naming observation |
| --- | --- | --- | --- |
| `deleteSubnetCommit(subId)` | Recheck dependencies, retain devices and former primary IP metadata, release active allocations, remove subnet and linked VLAN, then save with rollback | WF-04 | `commitSubnetDeletion()` is a possible clearer name |
| `deleteVlan(vId)` | Block deletion when a network subnet still uses the VLAN; otherwise confirm and save deletion with rollback | WF-04 | Existing name is descriptive |
| `openIpModal(ip)` | Display IPAM editing form except for protected gateway addresses | WF-04 | Existing name is descriptive |
| `handleIpSubmit(e, ip)` | Protect device primary IPs and gateways, change independent IPAM allocation, restore prior allocation on reported save failure | WF-04 | `saveIpAllocationFromForm()` is a possible clearer name |

Suggested names are not approved code changes.

## WF-04 bulk IPAM naming candidates

| Current function | Current responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `phase12BBulkPlan()` | Validate a requested range and calculate eligible, blocked and changed IPAM records | `planBulkIpChanges()` | Review required |
| `handleBulkIpSubmit()` | Read the bulk form and present the confirmation preview | `previewBulkIpChanges()` | Review required |
| `phase12BApply()` | Recalculate the bulk plan, store a safety snapshot, apply changes and save | `applyBulkIpChanges()` | Review required |

No function renames have been made.

## WF-04 subnet editing functions

| Current function | Source-verified responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `openSubnetModalByVlanId()` | Resolve the linked subnet for a VLAN card, refusing ambiguous legacy ownership | `openSubnetEditorForVlan()` | Review required |
| `handleSubnetSubmit()` | Validate and save a subnet or IP Address Block, maintaining scoped VLAN records and rollback | `saveSubnetFromForm()` | Review required; function has several responsibilities |

Proposals do not imply code changes or approved refactoring.

## WF-04 gateway relationship reference

`setDevicePrimaryIp()` owns device primary IP allocation changes and permits eligible network devices to use gateway addresses. `handleSubnetSubmit()` also checks gateway collisions but does not explicitly exempt unchanged gateway ownership. This cross-function interaction is recorded as maintenance candidate M-009; no renaming or behaviour changes are approved.

## WF-06 backup and restore naming candidates

| Current function | Responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `phase20CreateBackup()` | Build a versioned JSON backup payload | `createVersionedInventoryBackup()` | Review required |
| `phase20ValidateBackupVersion()` | Validate backup metadata and supported schema version | `validateBackupMetadata()` | Review required |
| `phase20MigrateBackup()` | Clone and normalise legacy backup data, recording supported repairs | `normaliseImportedBackup()` | Review required |
| `phase16CCheckBackup()` | Validate and normalise an imported backup without retaining candidate as active inventory | `validateImportedInventory()` | Review required |
| `phase16CAPMountConflicts()` | Find imported Access Points with incompatible mounting | `findImportedAccessPointMountConflicts()` | Review required |
| `phase16CChooseAPMounts()` | Ask user to select supported mounting types for conflicting Access Points | `reviewAccessPointMountChoices()` | Review required |
| `phase16CReviewLegacyMountRepairs()` | Show proposed legacy mounting corrections and request approval | `reviewLegacyMountingCorrections()` | Review required |
| `importData()` | Orchestrate file reading, validation, reviews, snapshot and verified restore | `restoreInventoryFromBackupFile()` | Review required |

Names are suggestions only; no code changes authorised.

## WF-05 rack management naming candidates

| Current function | Responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `validateRackPlacement()` | Check rack bounds and equipment overlap | `validateDeviceRackPlacement()` | Review required |
| `handleRackSubmit()` | Validate and save rack creation or edits | `saveRackFromForm()` | Review required |
| `deleteRack()` | Block deletion of occupied racks and confirm deletion | `deleteEmptyRack()` | Review required |
| `handleAssignSubmit()` | Validate and save device rack placement | `saveDeviceRackAssignment()` | Review required |
| `unassignDevice()` | Remove a device's rack assignment | `removeDeviceFromRack()` | Review required |

Naming suggestions only; no application code changes authorised.
