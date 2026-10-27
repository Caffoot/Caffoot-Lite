**Issue #100 focused history verification, 27 October 2026:** GitHub Actions [run 40581762241](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40581762241) passed all three Chromium scenarios on `release/v1.3.3`: history survives save/reload; denied audit-history writes do not block verified inventory saves; malformed array-shaped history does not crash the history view. The first two also passed in [run 40579602044](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40579602044), which identified the third scenario's defect. Approved rendering fix `88cf672` filters malformed display records without rewriting history or inventory. Unrelated consolidated, #99 and #157 browser scenarios were skipped. Existing passing inventory recovery evidence is retained; no broad regression was run. The separate late restore/reset audit-consistency question remains unverified and must not be marked passed.

# WF-02 Saving and Integrity: Controlled Regression Matrix

> **Issue #99, PR #158 verification checkpoint, 26 October 2026.** Draft PR #158 targets `release/v1.3.2`. Commit `0c83d59f5120b9bbc36fa0c308128d74be58f7bb` passed [focused Chromium regression 40310778637](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40310778637), including simulated accessory Add/Edit retry, move rollback and removal rollback with error feedback. Release validation 40310778526, documentation consistency 40310778444 and secret scan 40310778443 passed. Documentation evidence commit `3d42b63421cbd48eae3140da6b4d00df1ec63e1e` also passed all four workflows, including [Chromium 40311142262](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40311142262). Existing nested subnet and bulk IP return tests passed in Chromium run 40301918992; product owner manual acceptance is separately recorded in the workflow verification register. Backup help layout has visual acceptance only, not a dedicated open/Close/Escape interaction test. Wider common form consistency remains under review. These are v1.3.2 candidate findings, not changes to the published v1.3.1 baseline. Master audit and issue #99 remain open until remaining acceptance, cross-document reconciliation and approvals are complete. Nothing merged or released.


> **Issue #94 acceptance evidence reconciliation, 26 October 2026.** Existing browser evidence verifies the targeted M-017 startup recovery and M-022 failed rack creation selection safeguards in [Chromium run 40234411647](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40234411647) on PR #139. Earlier [run 39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113) verified representative failed rack unassignment, graphic and location saves, while [run 39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469) verified import rollback and snapshot recovery. PR #143 added passing representative S11 failed device deletion and S20 failed service restoration tests, [Chromium run 40274662353](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40274662353); its merged release branch was verified in [run 40281361866](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40281361866) and [release validation 40281390029](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40281390029). Existing source traces show rollback checks for other major callers but are **source inspection, not passing browser tests**. The three issue #94 concerns have targeted correction or representative evidence; **M-004 remains partially assessed as a broad all-caller finding**, and S07, S08, S12, S17, S18 and the full WF-02 matrix remain unverified rather than failed. Preserve these wider coverage gaps separately from issue #94 targeted acceptance. This documentation-only reconciliation proposes no new tests or application changes and does not itself approve closure, main merge or release. Historical dated statements below are retained as chronology.


**Baseline:** Published Caffoot Lite v1.3.0, commit `92d6a60b0e4bc9f73589b27820cb283def377dbd`. **Status:** Historical source-based matrix, with targeted browser scenarios subsequently executed and recorded in the current register. Full matrix not certified as executed. **Companion:** `WF-02-IMPORTED-RACK-TEST-MATRIX.md` covers imported rack and accessory fixtures in greater detail. WF-06 owns the full backup and restore lifecycle.

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


### Final evidence and finding disposition reconciliation, 23 October 2026

**Current authoritative checkpoint, superseding earlier pending and candidate notes above:** PR #83 merged into `main` as `dd834c0b5a23663e52a69bb289dbd0bd8b182e68`. Four GitHub checks succeeded. Published release compatibility workflow run `39961182872`, job `120439275189`, recorded PASS for published v1.2.1 and v1.3.0 SHA256SUMS verification and ZIP integrity, populated inventory import and genuine export using the published v1.2.1 HTML, and subsequent import into the published v1.3.0 HTML with core device, rack, subnet and location collection preservation and persistence across reload. This is **executed Chromium evidence**, not merely source inspection. It tests a representative populated fixture exported through the original published application, not every historical user backup. The published assets were not changed.

**M-031 disposition:** corrected in merged source and verified by the five previously executed targeted Chromium scenarios (including runs `39957395113` and `39959581469`). Close the technical correction and targeted test finding; do not imply exhaustive coverage of all bulk IPAM operations.

**M-014 disposition, product owner approved 23 October 2026:** defer recovery reset usability improvement to the v1.3.1 maintenance roadmap. Existing recovery safety behaviour has six previously executed browser scenarios in run `39944710633`; the possibility of unclear user feedback when a reset write is ignored remains a documented usability limitation. This is a **deferred improvement**, not a corrected defect or an unqualified pass. Do not change the published v1.3.0 application.

**Remaining master audit scope:** The historical WF-01 to WF-13 coverage rows contain partial or pending areas. Prior successful targeted tests remain valid, but those rows must not silently become complete. Treat unverified paths and broader accessibility, catalogue, recovery and failure coverage as explicitly outstanding or as scoped v1.3.1 follow-up, subject to product owner acceptance. This reconciliation does not itself prove full WF-01 to WF-13 coverage or constitute final audit sign-off. No new tests were executed for this documentation change. The v1.3.0 extended audit is **closed with documented limitations by explicit product owner approval on 23 October 2026**. This is an administrative audit closure, not a claim that every WF-01 to WF-13 path was exhaustively tested. The historical partial coverage rows remain accurate as evidence coverage records. Unverified paths, broader accessibility and catalogue checks, and recovery and failure scenarios not covered by the cited targeted evidence are carried forward for prioritisation in v1.3.1 maintenance planning. M-014 is an approved deferred usability improvement; M-031 is technically corrected and verified by targeted Chromium evidence. The release compatibility gate passed for the representative populated inventory in run 39961182872. No additional tests were executed for this closure decision. No application behaviour, published asset or release was changed. No release was created.



### P12 and browser evidence register correction, 23 October 2026

The authoritative current workflow register in [TECHNICAL-WORKFLOWS.md](../workflows/TECHNICAL-WORKFLOWS.md) has been corrected to cover WF-01 through WF-13 and to separate source assessment, P12 completion and actually executed browser evidence. This resolves the misleading 22 October at-a-glance statements that all browser tests were not executed and several P12 areas had not been assessed, while **not** claiming every P12 gate passed. Published v1.2.1 to v1.3.0 compatibility and asset verification passed in run [39961182872](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39961182872); targeted recovery and integrity evidence is recorded in runs [39944710633](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39944710633), [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113) and [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469). Earlier planned or not executed statements remain dated historical evidence only. The extended audit is owner approved as administratively closed **with incomplete individual P12 and workflow coverage carried forward**, not as a certification of full P12 completion. No new browser tests were run for this documentation correction. M-014 remains deferred; M-031 is corrected with targeted evidence. The remaining P12 gaps must be prioritised in v1.3.1 planning before they can be individually closed.


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


## Consolidated evidence update, 23 October 2026

Targeted failed save, safety copy readback and recovery assertions were previously executed in [Chromium run 39955498407](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39955498407), [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113) and [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469), covering specific M-001, M-011, M-012, M-018, M-020 and M-031 conditions. They do not certify every save caller or all cases in this original matrix. M-004 and M-022 still require source and existing evidence reconciliation. See [coverage register](WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md). No new browser tests were executed for this documentation update.


## Issue #94 targeted browser evidence, 26 October 2026

Draft PR [#143](https://github.com/Caffoot/Caffoot-Lite/pull/143), source revision `dc55c2096719984f5de06c7a87afa5fb71febb31`, added two isolated fictional-inventory Chromium scenarios to the existing consolidated suite. The [Chromium run 40274662353](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40274662353), job `121414745752`, explicitly logged `PASS` for both:

- **S11 representative device deletion failure:** Simulated ignored `caffoot_state` write through `phase11BCommitDelete()`; confirmed failed commit, identical in-memory inventory and stored bytes, and the device remaining after reload.
- **S20 representative archived server service restoration failure:** Simulated ignored `caffoot_state` write through `phase120RestoreServerService()`; confirmed catalogue rollback, identical stored bytes and archived service retained after reload.

All four PR checks passed on that revision: Chromium `40274662353`, release validation `40274662360`, documentation consistency `40274662324` and secret scan `40274662372`. These checks **do not** certify every deletion entry point, catalogue variant, storage exception or the full S01 to S30 matrix. PR #143 was subsequently squash merged into `release/v1.3.1` as commit `3ceccddcc75c19a09c9bb3076f8aaa327e060a12`. The integrated release branch passed manually dispatched [consolidated Chromium run 40281361866](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40281361866) and [release candidate validation run 40281390029](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40281390029); both runs independently report success on that exact merge commit. No application behaviour was changed. The historical matrix and prior evidence remain valid; WF-02 and broader M-004 remain partially assessed.
