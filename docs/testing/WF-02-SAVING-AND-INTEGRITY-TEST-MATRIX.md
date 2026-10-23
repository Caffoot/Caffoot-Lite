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


### Published release compatibility test candidate, 23 October 2026

A dedicated GitHub Actions workflow `audit-published-backup-compatibility.yml` and Chromium script `test-published-backup-compatibility.cjs` have been proposed. The workflow downloads the official v1.2.1 and v1.3.0 ZIP, HTML and SHA256SUMS assets without altering them, verifies the published checksums and ZIP integrity, then uses the original published v1.2.1 HTML to import a tracked populated example inventory and export a genuine v1.2.1 backup. It then imports that export into the published v1.3.0 HTML, checks device, rack, subnet and location collections, persistence after reload and offline execution. This is a **candidate test, not yet executed evidence**. It does not cover every possible real world historical backup. M-014 disposition, M-031 closure and final master audit reconciliation remain outstanding. No release or application behaviour change is proposed.
