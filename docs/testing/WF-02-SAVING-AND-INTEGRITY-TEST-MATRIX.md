# WF-02 Saving and Integrity: Controlled Regression Matrix

**Baseline:** Published Caffoot Lite v1.3.0, commit `92d6a60b0e4bc9f73589b27820cb283def377dbd`. **Status:** Source-based planned scenarios, none executed in a browser by this audit. **Companion:** `WF-02-IMPORTED-RACK-TEST-MATRIX.md` covers imported rack and accessory fixtures in greater detail. WF-06 owns the full backup and restore lifecycle.

## Purpose

Verify that invalid data cannot silently replace a healthy inventory, successful saves are actually persisted, and failed writes do not appear successful. Check whether each caller handles the return value of `saveState()` and restores in-memory state or otherwise makes the failure visible.

## Safety and evidence

Use a separate disposable browser profile and fictional inventory with the exact published standalone HTML. Export and verify a safety backup. Simulate storage failures only in that isolated profile. Record source revision, browser, fixture, action, prior and resulting `caffoot_state` bytes, screen response, console messages, audit effects and outcome after reload. Do not use genuine inventory.

## Test matrix

| ID | Scenario | Expected safeguard and observation |
| --- | --- | --- |
| S01 | Save valid fictional inventory | Stored JSON passes validation; write and readback match |
| S02 | Force `localStorage.setItem` failure | No false success; previously stored bytes unchanged |
| S03 | Simulate a successful write followed by mismatching readback | Save reports failure; caller handles uncertainty; preserve recoverable state |
| S04 | Save inventory with duplicate device ID or invalid reference | Validator rejects; stored bytes unchanged |
| S05 | Save device with duplicate primary IP or IPAM ownership mismatch | Reject inconsistent state |
| S06 | Test invalid rack reference, mounting relationship, face, U range, rack bounds and placement overlap separately | Record which rules are rejected by the central save validator versus form-level placement checks; preserve stored data on rejected saves and flag any central validation gaps |
| S07 | Edit device then force save failure | `handleDeviceSubmit()` restores prior in-memory snapshot and displays failure |
| S08 | Assign device to rack then force save failure | `handleAssignSubmit()` restores prior state |
| S09 | Unassign device then force save failure | Investigate source-observed unchecked `saveState()` result, visible outcome and reload discrepancy (M-001/M-002) |
| S10 | Add custom location then force save failure | Investigate unchecked result and false success risk (M-018) |
| S11 | Delete device then force save failure | `phase11BCommitDelete()` restores previous state |
| S12 | Delete subnet or VLAN then force save failure | Restore inventory and selected subnet as applicable |
| S13 | Change independent IPAM allocation then force save failure | Restore prior allocation |
| S14 | Bulk IPAM update with unavailable safety snapshot storage | Cancel without mutation; see WF-04 |
| S15 | Bulk IPAM update with save failure after snapshot | Restore memory and inspect safety snapshot; see WF-04 |
| S16 | Create or edit rack then force save failure | Restore inventory; check whether selected rack ID changes prematurely |
| S17 | Delete empty rack then force save failure | Check confirmation, rollback and UI selection |
| S18 | Create, edit or move horizontal rack accessory then force save failure | No partial persistence; previous placement restored |
| S19 | Move device in rack then force save failure | Prior placement restored |
| S20 | Create, edit or archive catalogue entry then force save failure | Inspect each caller and ensure no false success; follow up in WF-08 |
| S21 | Start with malformed raw `caffoot_state` | Recovery mode preserves original bytes; cross-reference WF-01 |
| S22 | Start with readable JSON containing integrity errors | Document actual warning path and whether data remains untouched (M-017); WF-01 |
| S23 | Import overlapping devices or accessories | Check import validation and safety rollback; see companion WF-02 imported rack matrix |
| S24 | Import malformed or missing accessory collection | Distinguish legacy omission from malformed present data; avoid silent loss (M-019) |
| S25 | Restore backup with write failure or readback mismatch | Verify safety snapshot and rollback, unverified rollback recovery; WF-06 |
| S26 | Trigger emergency recovery reset with failed write | Confirm exact outcome and whether readback is checked (M-014); WF-01 |
| S27 | Save, reload and compare audit history for an accepted change | Audit record consistency and storage isolation; WF-09 |
| S28 | Failed save then reload | Confirm stored inventory remains recoverable and UI does not falsely promise success |
| S29 | Restore older compatible fictional backup and resave | Compatibility preserved; migration and normalisation do not silently discard valid records |
| S30 | Run release automated checks against published source and compare with manual outcomes | Record exact commands and outputs, distinguishing automated checks from browser evidence |

## Completion criteria

For each test, record **planned**, **passed**, **failed**, **blocked** or **not applicable**, with actual evidence and source revision. Cross-check `saveState()`, `validateApplicationState()`, `normaliseState()`, `phase11BCommitDelete()`, all mutation callers and their P11 comments against the Function Naming and Reference document. Reconcile issues with the maintenance roadmap, especially M-001, M-002, M-014, M-017, M-018 and M-019. The matrix closes a documentation gap only; it does not prove these safeguards work in a browser.

## Focused regression additions, 22 October 2026

These are **subcases of existing scenarios**, not extra mandatory test runs. They preserve P13's proportional testing rule.

| Parent scenario | Subcase | Evidence to collect | Roadmap link |
| --- | --- | --- | --- |
| S20 | Change a device type graphic with a simulated failed save | Compare selected graphic in memory, error notification, stored bytes and reloaded selection | M-020 |
| S20 | Edit an existing hardware model with a simulated failed save | Compare the edited model before/after failure and after reload; distinguish edit from add/remove | M-021 |
| S09 | Unassign a rack device with failed save | Compare rack fields, screen, stored bytes and reload | M-001, M-002 |
| S10 | Add custom device location with failed save | Inspect any success message and in-memory versus stored location | M-018 |

**Execution status:** All remain planned and unexecuted. A shared storage-failure fixture can cover these branches efficiently without treating each row as a separate testing framework.

**M-021 source correction, 22 October 2026:** The model editor copies catalogue entries before editing and restores the previous reference on failed save. The specific suspected aliasing defect has been closed without change on source evidence. Keep the existing failed-save subcase as ordinary regression coverage, not a defect reproduction requirement.

**S06 source-scope clarification, 22 October 2026:** The published `validateApplicationState()` explicitly checks rack existence, compatible mounting and U range consistency (HTML lines 1583–1599), but does not itself comprehensively check rack face, rack bounds or overlapping placements. Test these separately and distinguish form-level protection from save-level protection. Do not claim a test has passed or a browser defect has been reproduced.

## Combined targeted browser verification, 23 October 2026

The remaining source-observed save gaps will be tested together under [WF-13 consolidated evidence plan](../audits/WF-13-CONSOLIDATED-EVIDENCE-PLAN.md), with separate named results for S09/M-001, S10/M-018 and S20/M-020. The same coordinated run includes M-031 bulk IPAM, M-011 import secondary snapshot and M-012 repair snapshot fault injection. Compare stored bytes, in-memory state, user feedback and reload independently. All new cases are **planned, not executed**. Existing M-014 R1 to R6 have already run successfully in GitHub Actions 39944710633, with R4's confusing reload recorded as an observation. Do not mark the entire WF-02 matrix passed from these subset checks.

**Combined suite implementation status, 23 October 2026:** A dedicated fictional-data Chromium script now defines fault scenarios for M-001/S09, M-018/S10 and M-020/S20 alongside M-011, M-012 and M-031. It is connected to the main-push CI workflow on a working branch. **No new test execution has been verified.** Results remain pending, not passed. See [WF-13 consolidated evidence plan](../audits/WF-13-CONSOLIDATED-EVIDENCE-PLAN.md).

**23 October 2026 M-031 executed evidence:** Main Chromium run 39948681541 passed throw-snapshot but failed the silent snapshot verification assertion, observing a persisted IPAM reservation with no prebulk snapshot (`allocated=true, savedChanged=true`). This is a confirmed safeguard failure. The later combined test scenarios did not execute. Do not report the consolidated suite as passed; see WF-13 evidence plan.

M-031 proposed fix branch, 23 October 2026:** `phase12BApply()` now reads back its prebulk safety snapshot and refuses the operation if the stored bytes differ from the prechange inventory. The existing consolidated Chromium M-031 `ignore-snapshot` scenario explicitly requires unchanged saved and in-memory inventory; the `throw-snapshot`, `throw-main`, `success` and `old-snapshot` cases remain in the same suite. **No new browser tests have executed for this fix yet.** No result is marked passed and no release is proposed.

**Executed main Chromium run 39952033135 (23 October 2026):** M-031 `throw-snapshot`, `ignore-snapshot`, `throw-main`, `success` and `old-snapshot` passed, including ignored snapshot unchanged inventory (`allocated=false, savedChanged=false`). M-001 and M-020 current assertions passed while exposing in-memory divergence on rejected saves. M-018 failed at `addCustomLocationOption()` due to undefined `toggleRackLocationFields`; M-012 and M-011 were not executed. Overall suite **FAILED**. Do not interpret individual passes as complete audit closure.

**23 October 2026:** M-018 new regression scenario exercises selecting an existing location, starting a new location and cancelling. Existing failed-save custom location scenario still checks in-memory divergence. Neither corrected scenario has executed yet.

## Verified main Chromium checkpoint, 23 October 2026

Executed main Chromium run 39953195636: overall PASS. M-031 five scenarios PASS; M-018 failed custom location save and selection/cancellation PASS, with in-memory divergence observed on failed save. M-001 and M-020 assertions PASS with in-memory divergence observations. M-012 five repair scenarios PASS against current expectations, but `ignore-snapshot` proves repair persists without confirmed safety snapshot and is an OPEN defect. M-011 three import rollback scenarios PASS with original inventory retained; secondary snapshot outcome pending review. A passing assertion does not establish safety where an unsafe outcome is explicitly expected.


## M-012 repair snapshot safeguard, 23 October 2026

Source change proposed on branch `fix/m012-ipam-repair-snapshot-readback-20261023`: `phase11CApplyRepair()` now compares the stored pre-repair safety snapshot with the exact original inventory before changing IPAM allocations. A silently ignored snapshot write cancels repair and preserves the original inventory. The consolidated Chromium test now requires unchanged stored and in-memory inventory for this failure case. This is a source change and revised test assertion, **not yet executed browser evidence**. Existing throw-snapshot, throw-main, success, old-snapshot and reload scenarios remain in the suite. M-012 stays open until the revised suite passes and the results are reconciled. Other findings and the overall audit remain open. No release authorised.
