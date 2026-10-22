# Caffoot Lite v1.3.0 WF-01 to WF-04 Cross-Reference Reconciliation

**Date:** 22 October 2026
**Status:** Documentation cross-check in progress. Published v1.3.0 source reviewed; no browser scenarios executed during this audit.
**Source:** `app/caffoot-lite.html` at tag `v1.3.0`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`.

## Purpose

Check that each workflow's documented safeguards, source functions, maintenance candidates and planned tests agree. A documented test is not a passed test. Reuse existing scenarios across workflows rather than multiplying scripts.

## Reconciled links

| Workflow | Source entry points and safeguards | Existing test coverage | Roadmap candidates and open checks |
| --- | --- | --- | --- |
| WF-01 Startup and recovery | `loadStoredState()` 1619, `normaliseState()` 1392, startup integrity validation 1645–1647, recovery banner 1648 onward | WF-01 recovery T01–T16; WF-02 S21, S22, S26, S29 | M-014 emergency reset readback, M-015 legacy normalisation visibility, M-017 readable inconsistent startup, M-019 accessory import handling; confirm actual browser paths |
| WF-02 Save and integrity | `validateApplicationState()` 1556; `saveState()` 1825; 35 textual `saveState()` calls inspected in function reconciliation | WF-02 S01–S30; imported rack T01–T18; shared failure cases S09, S10, S16, S18, S20 | M-001, M-004, M-011, M-012, M-018, M-020, M-022, M-023; M-021 closed for alleged model aliasing, retained as regression |
| WF-03 Device lifecycle | `handleDeviceSubmit()` 7105, `handleAssignSubmit()` 5625, `unassignDevice()` 5670, `deleteDevice()` 7187, `setDevicePrimaryIp()` 1866, `syncDeviceIpamRecord()` 1917 | WF-03 D01–D26; WF-02 S07–S11, S19; WF-04 primary IP scenarios | M-001 unchecked rack unassignment, M-002 legacy rack fields, M-005 virtual host references, M-008 conversion policy, M-018 custom location |
| WF-04 Subnets, VLANs and IPAM | `phase11BSubnetDependencies()` 4858, `confirmDeleteSubnet()` 5010, `deleteSubnetCommit()` 5038, `handleIpSubmit()` 5137, `phase12BApply()` 4494, `handleSubnetSubmit()` 4671 | WF-04 N01–N33; WF-02 S12–S15; WF-03 primary IP tests | M-006 IPAM primary ownership, M-009 gateway ownership, M-012 repair snapshot verification; bulk snapshot readback question covered by existing snapshot integrity work |

## Focused matrix validation

The four appended WF-02 failure-injection subcases are correctly grouped under the original scenario descriptions:

- **S09:** rack unassignment failed save, M-001/M-002.
- **S10:** custom location failed save, M-018.
- **S20:** device graphic failed save, M-020; hardware model failed save as regression after M-021 source correction.

The WF-02 matrix explicitly records all as planned and unexecuted. M-022 is already anticipated by S16's selected-rack-ID check. M-023 fits S18 and the WF-05 accessory regression work. **No new scenario identifiers are needed.**

## Important distinction needing further reconciliation

**S06 wording is broader than the shared validator's source-observed checks.** The WF-02 matrix currently expects a save with an invalid rack, face or U range to be rejected. `validateApplicationState()` (1556–1612) explicitly checks missing rack, mount type and numerical rack U range consistency, but does not itself explicitly check every face value, rack height bound or placement overlap. Those may be enforced by entry-point validators elsewhere. Therefore do not describe all S06 protections as guaranteed by `saveState()` alone. The test must distinguish **form-level placement validation** from **central save-level integrity validation** and identify gaps with a deliberately constructed invalid state. This is a documentation precision issue, not a browser-confirmed defect.

## P11 comment references

`P11-EXPLANATORY-COMMENT-IMPROVEMENT-REGISTER.md` consolidates proposed rationale comments, existing strong comments and items held pending investigation. No application comments have been inserted.

## Remaining P12 conditions

1. Reconcile every workflow description with the complete source behaviour and ensure unresolved edge cases are explicitly noted.
2. Resolve the S06 validation-scope wording and assess its effect on imported rack tests.
3. Complete source caller/comment checks and roadmap links, including cross-workflow dependencies.
4. Execute and record appropriate browser and automated regression evidence separately. Do not infer execution from this document.
5. Update `TECHNICAL-WORKFLOWS.md` workflow register only when its status materially changes.

**No application code, merge or release authorised by this reconciliation.**

## Imported rack validation reconciliation, 22 October 2026

Compared WF-02 S06 with imported rack scenarios WF02-T13 and WF02-T14 against published `validateApplicationState()` lines 1581–1599. The central validator checks mounted device rack existence, mounting consistency and U-range arithmetic, but does not explicitly enforce rack-height bounds or physical collision rules. Interactive placement checks exist separately. The imported rack test matrix now separates missing rack, inconsistent end U and out-of-bounds height observations, and distinguishes rejected saves from accepted but potentially invalid imports. Existing WF02-T13 tests device overlap. No new scenarios added and none executed.

**Implication for v1.4:** Document the boundary between form validation and shared persistence/import validation before introducing a second storage implementation. This is an architectural caution, not approval to change application code.

## Device relationships and catalogue rollback, 22 October 2026

Published-source review confirms the following distinctions:

- `deleteDevice()` (7187–7199) identifies direct IPAM ownership and reservations, removes those links and delegates persistence to `phase11BCommitDelete()`. It does **not** explicitly check other devices' `virtualHostId` references before deleting a physical host. The shared `validateApplicationState()` (1556–1612) likewise does not validate `virtualHostId` references. This is source evidence supporting the existing M-005 investigation, **not** proof of a browser reproduction.
- The shared validator checks IPAM ownership, device ID uniqueness and basic rack references, but not rack accessory records or physical collisions. Those remain M-019 and imported-rack scenario questions, rather than newly discovered separate defects.
- `phase120UpdateHardwareCatalogue()` (6241–6267) clones each catalogue entry before edits and restores the prior catalogue reference on failed save. This agrees with the M-021 source correction for the other hardware model editor; do not reopen M-021 on the same aliasing assumption.
- `phase19BManageSoftware` mutation path (6345–6361) clones software entries, captures the full inventory and restores it on failed save. `phase120SoftwareToggle()` (6388–6397) copies the exclusions map and changed type set before saving, then restores the previous map on failure. These are source-level rollback observations only.

**Risk boundary:** Deleting a physical host can leave dependent virtual server links unless another path intervenes. Before a fix is proposed, agree whether deletion should be blocked, reassignment required, or links intentionally detached, and how existing backups are treated. Reuse WF-03 scenarios and WF-02 failure injection; do not approve a policy change by documentation alone.

## Physical-host type conversion and virtual-server dependency, 22 October 2026

The published `handleDeviceSubmit()` (7122–7124) reads `virtualHostId` only for a device whose new type is `Server - Virtual` and checks that the chosen host exists, has type `Server - Physical` and is not the same device. This protects the **virtual-server form submission**.

The same handler (7149–7179) permits an existing device's type to be changed after the applicable type-field conversion review. That review addresses obsolete type-specific fields, but the examined path does not explicitly search for other virtual devices referencing the edited device as `virtualHostId`. Thus a physical server may be converted to another type while its dependants retain their old host link. `deleteDevice()` (7187–7199) likewise does not check those incoming links. `validateApplicationState()` (1556–1612) does not verify `virtualHostId` relationships. These are **source-confirmed gaps in cross-record checking**, not browser-tested outcomes.

**Policy decision required under M-005 and M-008:** Should conversion or deletion be blocked until hosted virtual servers are reassigned, or should there be an explicit reviewed detachment workflow? Do not choose a policy implicitly. Preserve historical records and backups, and test both successful and failed saves before implementing any change.

## Rack deletion, rack resize and IPAM reservation integrity, 22 October 2026

Published source shows additional cross-record safeguards that must not be overlooked:

- `deleteRack()` (5492–5505) refuses to remove a rack containing either mounted devices **or rack accessories**. On a failed deletion save, it restores the previous selected rack ID; `phase11BCommitDelete()` restores the inventory. This contrasts with M-022, which concerns **new rack creation** selection on failed save.
- Rack physical correction (5452–5456) checks that the new height does not cut off a mounted device or accessory before saving. It checks the upper extent of recorded placements; this does not replace complete central validation of malformed imported placement records.
- `phase11BIntegrityIssues()` (4863–4883) checks missing rack references, duplicate primary IPs, device/IPAM ownership mismatches and dangling `reservedForDeviceId` references. By contrast, `validateApplicationState()` (1556–1612) checks IPAM `deviceId` ownership but does not explicitly check dangling `reservedForDeviceId`. **Different validators cover different rules**; document the actual call path before claiming a safeguard applies to all saves or imports.
- `deleteDevice()` (7187–7199) explicitly clears `reservedForDeviceId` references pointing to the deleted device, which helps preserve reservation integrity during that workflow. This does not address incoming virtual-host links.

**Follow-up:** Trace all callers of `phase11BIntegrityIssues()` and whether import, ordinary saving and safety checks use it. Reuse WF-02/03 existing scenarios for dangling reservation references and rack deletion/resize. These are source observations only, not browser test outcomes.

## Integrity helper caller search, 22 October 2026

A full literal source occurrence search of the 8,634-line published HTML found `phase11BIntegrityIssues(` **once**, at its declaration (4863). No textual call site was found. Therefore its extra dangling `reservedForDeviceId` check is **not evidence of an active runtime safeguard** in this published source. This is a static call-site finding, not proof that a dynamic invocation is impossible.

In contrast, `validateApplicationState()` appears at its declaration and in startup (1645), save (1831), the dashboard/safety display (2526, 7350, 7617), and other inspection paths. `phase16CCheckBackup()` (7606–7623) explicitly swaps in the migrated candidate, runs `validateApplicationState()`, and restores the original state in `finally`. Its validator does not explicitly check dangling `reservedForDeviceId`, incoming `virtualHostId`, or accessory placement. This strengthens the need for M-019 and the virtual-host dependency review and identifies a **new reservation-integrity coverage question** for the post-audit maintenance review.

Do not label the unused helper itself a bug or assume deleting it is safe. First determine its historical purpose and whether tests rely on it. Reuse existing WF-02 S04/S23–S25 and WF-03 D22/D26 fixtures to check dangling reservation references, with no new mandatory scenario identifiers.

## Central validator entry-point reconciliation, 22 October 2026

The published HTML uses `validateApplicationState()` at startup (1644–1647), before writing in `saveState()` (1825–1853), for the dashboard integrity indicator (2526–2528), in the manual Inventory Safety Check (7348 onward), and while examining a migrated import candidate in `phase16CCheckBackup()` (7606–7623). This is an important **shared rule set**, not evidence that every relationship is checked.

The startup path logs readable inventory integrity errors and intentionally does not write automatically. The save path refuses invalid state and checks the exact stored snapshot by reading it back. The import path temporarily assigns the candidate for validation and restores the original `appState` in `finally`. The manual safety check also compares normalised stored and displayed inventories. These are source-reviewed behaviours, not browser pass results.

**Design implication for the post-audit v1.3.1 review:** Consider whether missing incoming virtual-host, accessory and orphaned reservation rules should be added to shared validation, but assess legacy inventory compatibility and recovery first. Tightening a shared validator could prevent users with existing imperfect data from saving, so any proposal needs explicit compatibility policy, test fixtures and recovery handling. No implementation approved.
