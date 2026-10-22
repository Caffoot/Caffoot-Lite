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
