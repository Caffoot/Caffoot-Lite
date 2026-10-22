# WF-01 to WF-04: Function and Comment Reconciliation

**Checkpoint:** 22 October 2026. **Source:** `app/caffoot-lite.html` at published tag `v1.3.0`, blob SHA `e8a24f6370a1bb572287aad91a314a3e4a189d94`. **Status:** Targeted declaration and caller count review, not an exhaustive source inventory and not browser testing.

## What was checked

A targeted list of 23 important functions was searched in the published HTML for function declarations and textual call occurrences. All 23 have a declaration. Textual occurrence counts include the declaration and may include markup or incidental mentions; they do not prove that every caller has been semantically traced. This document deliberately does not invent unverified dependencies.

| Workflow | Function | Definition line | Textual occurrences |
| --- | --- | ---: | ---: |
| WF-01 | `loadStoredState` | 1619 | 2 |
| WF-02 | `saveState` | 1825 | 36 |
| WF-02 | `validateApplicationState` | 1556 | 6 |
| WF-01 / WF-02 | `normaliseState` | 1392 | 7 |
| WF-03 | `handleDeviceSubmit` | 7105 | 2 |
| WF-03 | `handleAssignSubmit` | 5625 | 2 |
| WF-03 | `unassignDevice` | 5670 | 2 |
| WF-03 | `deleteDevice` | 7187 | 3 |
| WF-03 / WF-04 | `phase11BCommitDelete` | 4884 | 5 |
| WF-03 / WF-04 | `setDevicePrimaryIp` | 1866 | 4 |
| WF-03 / WF-04 | `syncDeviceIpamRecord` | 1917 | 3 |
| WF-04 | `phase11BSubnetDependencies` | 4858 | 4 |
| WF-04 | `deleteSubnet` | 4927 | 2 |
| WF-04 | `confirmDeleteSubnet` | 5010 | 2 |
| WF-04 | `deleteSubnetCommit` | 5038 | 2 |
| WF-04 | `deleteVlan` | 5073 | 2 |
| WF-04 | `openIpModal` | 5095 | 4 |
| WF-04 | `handleIpSubmit` | 5137 | 2 |
| WF-04 | `phase12BBulkPlan` | 4418 | 3 |
| WF-04 | `handleBulkIpSubmit` | 4474 | 2 |
| WF-04 | `phase12BApply` | 4494 | 2 |
| WF-04 | `handleSubnetSubmit` | 4671 | 2 |
| WF-04 | `openSubnetModalByVlanId` | 4651 | 2 |

## Source-confirmed safeguard and P11 comment observations

- **WF-01:** `loadStoredState()` is preceded by a comment explaining why unreadable stored data must not be overwritten at startup. Check that all recovery paths, including emergency reset, have equally clear comments.
- **WF-02:** `saveState()` validates, serialises, writes, checks readback, then records the audit difference. It catches failures and returns `false`. The function has no adjacent explanatory comment describing why readback and the ordering protect user data. **P11 improvement proposed:** add a short human-readable comment explaining validation, readback and why callers must respect `false`.
- **WF-03:** `unassignDevice()` has a useful comment about retaining the physical location, but calls `saveState()` without inspecting its return. This is a source-confirmed safeguard difference from rollback-aware mutation handlers. **P11 improvement proposed:** document the intended rollback contract when an approved fix is made; do not add a misleading comment asserting protection that is absent.
- **WF-03 / WF-04:** `syncDeviceIpamRecord()` has a comment stating the device is the source of truth for primary IP ownership. Preserve this important relationship explanation when refactoring.
- **WF-04:** `phase11BSubnetDependencies()` has comments explaining the refusal to delete records with dependencies; `confirmDeleteSubnet()` comments on revalidation of stale previews. These communicate safeguards effectively.
- **WF-04:** `phase12BBulkPlan()` has a short comment on bounded CIDR-aware edits. `phase12BApply()` writes a safety snapshot before mutation and rolls back memory if saving fails. **P11 improvement proposed:** explicitly explain why the snapshot precedes mutation and distinguish in-memory rollback from durable recovery. Do not claim that the safety snapshot is automatically restored.
- **WF-04:** `openSubnetModalByVlanId()` has a helpful comment on stable record IDs and VLAN scope. Retain this explanation.

## Remaining work under P12

1. Enumerate **all** function declarations relevant to WF-01 through WF-04, including anonymous callbacks and shared helpers where significant, and trace callers and mutation effects.
2. Compare each important function's existing name, proposed name or retention decision, dependencies and P11 comments with `docs/standards/FUNCTION-NAMING-AND-REFERENCE.md`.
3. Reconcile M-001, M-002, M-009, M-014, M-017, M-018, M-019 and any other confirmed findings with the maintenance roadmap and test matrices.
4. Record dated workflow-by-workflow completion decisions only when the documentation package is complete. Browser execution remains a separate verification gate.

**No application source changed.** Proposed comments and renames are documentation candidates, not approved patches.

## Save caller trace, 22 October 2026

The published v1.3.0 HTML has **35 textual `saveState()` call sites** outside the function definition. This is a whole-file textual inventory, not a runtime branch coverage claim. Calls fall into these groups:

| Source line(s) | Area | Source-observed save result handling |
| --- | --- | --- |
| 1370 | Legacy VLAN reconciliation | Checks result; restores snapshot on failure |
| 2270 | Confirmed IPAM repair | Throws on failure within enclosing recovery flow; inspect snapshot and error path |
| 2821 | Device type graphic choice | **Return value ignored**, then interface refreshed; investigate separately |
| 3335, 3422 | Hardware catalogue | Checks result; restores previous catalogue reference |
| 3469, 3483, 3507 | Software catalogue | Checks result; restores previous collection or full snapshot |
| 3542, 3550 | Server services | Checks result; restores previous collection |
| 3927 | Device type/name catalogue changes | Checks result; restores full snapshot |
| 4510 | Bulk IPAM | Checks result; restores in-memory snapshot; durable safety snapshot saved before mutation |
| 4700, 4836 | Subnet editing | Checks result; restores prior state and selection |
| 4885 | Shared deletion commit | Checks result; restores prior snapshot |
| 5175 | IP allocation editing | Checks result; restores previous allocation |
| 5474 | Rack editing | Checks result; restores state; verify UI selection after failed new rack save |
| 5660 | Rack assignment | Checks result; restores prior state |
| 5678 | Rack unassignment | **Return value ignored**; no snapshot restoration (M-001) |
| 5947, 6045 | Device details | Checks result; restores prior values or snapshot |
| 6193, 6207 | Server services | Checks result; restores prior state |
| 6266 | Hardware catalogue | Checks result; restores previous collection reference |
| 6360, 6396 | Software and preferences | Checks result; restores prior values or snapshot |
| 7035 | Custom device location | **Return value ignored**; follows with success toast (M-018) |
| 7179 | Device create/edit | Checks result; restores prior snapshot |
| 7418 | Clean inventory reset | Throws on failure; further verifies stored candidate in surrounding flow |
| 7821 | Backup restore | Throws on failure; surrounding flow verifies and handles rollback |
| 8113, 8137, 8148 | Rack accessory changes | Checks result; restores prior snapshot |
| 8168 | Drag-and-drop device placement | Checks result; restores prior snapshot |
| 8291 | Accessory drag-and-drop | Checks result; restores prior snapshot |

**Interpretation:** Exactly three call sites in this source scan visibly ignore the Boolean result: lines 2821, 5678 and 7035. This is a static source finding, **not proof of data loss**. In the device type graphic and custom location paths, inspect whether a failed write leaves the changed in-memory object and a misleading success message. In rack unassignment, inspect the discrepancy between in-memory and persisted placement. These should receive failure-injection regression cases.

**Further scrutiny needed:** Some catalogue handlers store a `previous` reference to an array, then mutate an entry before calling `saveState()`. A reference restoration may not reverse mutations made to an object inside that same array. Check the exact edit paths and consider a controlled failed-save test; do not declare a defect until confirmed. Check the caller's UI refresh and audit reason reset separately from the save return check. The 35-call inventory does not establish that every rollback is complete.

## Correction to hardware model rollback observation, 22 October 2026

The earlier note suggesting that the hardware model editor might mutate an original catalogue item before taking its prior reference was **incorrect**. At line 3401, `phase120ModelSave()` first makes a new array of shallow-copied model entries. Its edits at lines 3417–3419 affect those copies, not the original entries. On save failure, the old catalogue reference is restored at line 3422. This resolves the particular aliasing concern recorded earlier. M-021 is closed without change on source evidence; routine failure regression testing is still worthwhile. The earlier observation is retained above solely as an audit trail, not a current finding.

## Focused IPAM, device and rack rollback review, 22 October 2026

Published HTML, source-only inspection:

| Handler | Lines | Source-observed protection | Remaining limitation or test |
| --- | --- | --- | --- |
| `handleIpSubmit()` | 5140–5182 | Copies the prior allocation before mutation; refuses gateway and device-primary-IP conflicts; restores prior allocation if `saveState()` fails | Check form remains usable and that no unrelated state changes occur; failed-save browser test pending |
| `handleAssignSubmit()` | 5642–5667 | Checks rack placement before assignment; restores serialised inventory snapshot on failed save | Check selected face, modal and rack view after failure |
| `unassignDevice()` | 5670–5680 | Preserves device physical location in its comment | Save return ignored and rack fields are mutated without rollback, as M-001 and M-002 |
| Rack creation/edit handler | 5459–5477 | Serialised state snapshot restored if saving fails | For **new rack**, `selectedRackId` is set before save and not restored in the failure branch; assess whether selection can point to a rack no longer in inventory. Source-supported investigation, not a confirmed browser defect |
| `handleDeviceSubmit()` | 7166–7184 | Snapshots inventory before changes; restores snapshot if IPAM update throws or save fails | Verify draft/modal behaviour and relationships after conversion; virtual host integrity remains M-005 |
| `phase11CApplyRepair()` | 2250–2283 | Checks preview freshness, writes safety snapshot before mutation, restores in-memory state and attempts previous snapshot restoration on failure | Snapshot write has no readback verification and catch ignores snapshot restoration errors; already tracked as M-012 |

**Important scope correction:** A check for `saveState()` success does not prove that auxiliary UI state, selection, recovery snapshots or other side effects have been restored. Conversely, no failure should be asserted from code structure alone without reproducing its user-visible effect. Prioritise targeted failure-injection tests within existing WF-02 scenarios and record actual results separately.

## Additional mutation and interface side-effect review, 22 October 2026

| Handler | Published HTML lines | Observed safeguards and limitations |
| --- | --- | --- |
| Managed device type/location add, rename, delete | 3912–3932 | Takes full JSON snapshot before editing managed lists, device fields and type graphics; on failed save restores prior object contents. This is distinct from the unchecked **custom device location quick-add** at line 7035 (M-018). |
| Bulk IPAM apply | 4494–4515 | Recalculates eligible changes at confirmation, stores a safety snapshot before mutation, restores in-memory inventory on save failure. **Snapshot write is not read back**; assess alongside existing snapshot-verification candidates, not as proved loss. |
| Container subnet save | 4684–4707 | Builds candidate separately, validates hierarchy, restores inventory and `selectedSubnetId` on failure. |
| Network subnet/VLAN save | 4815–4842 | On failed save restores inventory, `selectedSubnetId` and the device-form draft subnet selection. |
| Rack accessory form | 8103–8115 | Validates candidate and restores inventory on failed save, but **does not show an explicit handler-level error message** before returning. Determine whether `saveState()` itself provides sufficient visible feedback. |
| Rack accessory deletion | 8133–8138 | Removes confirmation overlay **before** attempting save, restores inventory on failure, but does not reopen confirmation or render in this branch. Check whether user can recognise the failure and retry. |
| Rack accessory move | 8140–8148 | Validates placement, snapshots and restores inventory on failed save, returns false. Inspect invoking UI for failure feedback. |

These are static source observations only. In particular, distinguish correct inventory rollback from missing confirmation or stale interface presentation. Use existing WF-02 and WF-05 failure scenarios rather than duplicating large test suites.

## P11 explanatory comment review, 22 October 2026

This review judges whether source comments explain **why** a safeguard or exception exists, not simply whether comments are present. Published v1.3.0 HTML is the reference.

| Area | Source location | Comment finding | P11 action |
| --- | --- | --- | --- |
| Save and verification | `saveState()`, 1825–1853 | Validation, storage write, byte-for-byte readback, and non-fatal audit logging are implemented. No adjacent explanation distinguishes why audit logging may fail without invalidating the already verified inventory save. | Propose explanatory comment at inventory versus audit boundary and why readback matters; documentation proposal only |
| Import protection | 7803–7834 | Comments explain why original inventory and safety snapshot are captured, why a failed snapshot blocks replacement, and why rollback is verified. | Retain; sufficiently explanatory in inspected region |
| Bulk IPAM | `phase12BApply()`, 4494–4515 | UI text mentions safety snapshot, but code has no adjacent comment explaining why plan is recalculated at confirmation or why snapshot must precede mutation. | Propose two concise comments; do not duplicate implementation in prose |
| Rack move and unassignment | 5651–5679 | Both paths explain why physical location is preserved. Unassignment comment does not explain ignored save result, which is a candidate defect rather than intended policy. | Retain location comment; investigate M-001, do not document unchecked save as deliberate |
| Subnet save | 4819–4842 | Comments explain stable VLAN ownership and deliberate legacy reconciliation; rollback also restores selected subnet and draft subnet but that reason is not locally explained. | Propose comment about preserving user's form context on failed save |
| IPAM repair | 2257–2282 | Explicit comment says snapshot must persist before mutation. It does not explain the unverified snapshot readback and catch restoration handling. | Investigate M-012 before proposing rationale |
| Accessory create and delete | 8103–8138 | No adjacent explanation for restore-on-save-failure or why confirmation overlay is removed before persistence. | Consider a brief comment after UX behaviour is agreed; investigate M-023 |

**P11 assessment:** Several significant decisions already have useful explanatory comments. The gaps above are proposals for later **code comments**, not authorisation to change published v1.3.0 or a claim that every comment must narrate each line. Avoid comment churn on straightforward code. All browser tests remain unexecuted.

**M-023 feedback precision:** `saveState()` itself calls `showToast()` on validation failure (1834), storage failure (1851), and recovery mode (1827). Therefore the accessory handlers' lack of an *additional* message is not evidence of no error notification. The remaining question is modal/confirmation clarity and retry after failure.

## P11 review of startup integrity and destructive network actions, 22 October 2026

| Decision | Published HTML lines | Source evidence and explanatory-comment assessment |
| --- | --- | --- |
| Normalise legacy location | 1380–1389 | Converts the old `Racked` location to `Unknown` when rack mounting is separately recorded. No adjacent comment explains the distinction between physical location and mounting; a concise rationale would help. |
| Normalise imported collections | 1392–1420 | Rejects missing required collections, but defaults missing/malformed optional `rackAccessories` to an empty array. The policy distinction is not explained nearby; document the risk without presuming a fix (M-019). |
| Shared integrity validator | 1556–1612 | Existing comments explain subnet hierarchy and non-network kinds. No adjacent explanation of the intentional limits of validation; accessory and virtual-host relationship coverage are currently missing. Do not write a comment suggesting omissions are intended. |
| Startup load | 1617–1647 | Clear comments explain preserving unreadable raw inventory, rejecting unsafe keys and avoiding startup overwrite. Retain as strong P11 examples. Readable but inconsistent inventory is logged rather than automatically entering recovery (M-017). |
| Network dependency deletion | 4856–4862, 5020–5070 | Comments explain why dependent records block deletion and why prior IP is retained as informational metadata. Source rechecks a preview signature and dependencies before commit. Add concise explanation of stale-preview recheck if editing comments later. |
| VLAN deletion | 5073–5086 | Existing comments clearly explain why matching VLAN number and parent block prevents unrelated dependencies. Retain. |

**Assessment:** Startup recovery, VLAN ownership and destructive network protections already have useful 'why' comments. Missing rationale around legacy location separation and optional collection defaulting should be documented as P11 candidates. Any comment about a suspected gap must wait for a policy decision; do not disguise a possible omission as deliberate design. No runtime tests performed.
