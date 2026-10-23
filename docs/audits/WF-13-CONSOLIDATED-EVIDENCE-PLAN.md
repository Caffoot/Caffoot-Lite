# WF-13 consolidated evidence and minimal verification plan

**Date:** 23 October 2026  
**Baseline:** Published v1.3.0; audit branch based on `d78f0f99b7c203d7bbc35de37d97bc906b670e06`  
**Status:** In progress. This plan is not a claim of test completion.

## Purpose and evidence rules

Reuse historical CI, owner acceptance and inspected test assertions. Do not rerun a test solely because a conversation ended. A historical pass is valid only for its recorded revision and scope. An inspected script is not an executed test. A source gap is not automatically a demonstrated runtime defect. Use fictional inventories in disposable browser profiles for any destructive or storage fault testing. Do not change application behaviour without explicit owner approval.

## Existing evidence to retain without repetition

| Evidence | Recorded result | Limitation |
| --- | --- | --- |
| Release candidate validation, GitHub Actions run [39605067641](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39605067641), job 119239027726 | Passed 21 October 2026; `npm run release`, 29 named checks, build verification and packaging on `be778285e6d1180052802255d1c283abfbd5238e` | Not a recorded Chromium browser execution; no published asset hash readback |
| Git history secret scan, run [39605067721](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39605067721) | Passed | Not an application browser or storage test |
| GitHub comparison between tested source and v1.3.0 release merge `92d6a60b0e4bc9f73589b27820cb283def377dbd` | No file differences recorded | Does not independently verify downloaded release ZIP bytes |
| Owner v1.3.0 first-time browser walkthrough in [WF-14](WF-14-PUBLIC-REPOSITORY-AND-FIRST-TIME-USER-EXPERIENCE.md) | Owner reported fictional backup restore retaining device, IP, subnet, location and rack | Manual acceptance evidence, not injected storage failure coverage |
| Four existing Chromium scripts, mapped in [WF-11 to WF-13 reconciliation](WF-11-TO-WF-13-BASELINE-RECONCILIATION.md) | Source-inspected assertions for offline persistence, corrupt data, rejected import, restore rollback, moved HTML upgrade and device/IPAM rollback | Historical successful execution at published release not confirmed |
| Owner-reported earlier PowerShell and manual testing | Testing was performed during earlier sessions | Exact command logs and source revision not independently available; do not mark as verified CI |

## Remaining checks, grouped to avoid repeat work

| Priority | Targeted evidence still needed | Completion evidence | Related finding |
| --- | --- | --- | --- |
| 1 | Locate historical Chromium workflow execution for released revision, or run the four existing scripts **once** against an identified revision if no usable run exists | Run ID or local log, source SHA, command, environment, exit status and test results | WF-13 provenance |
| 1 | Exercise emergency recovery banner reset with fictional corrupt data: cancel either confirmation, throwing storage write, silently ignored write, successful write, and preservation/export of original raw text | Original and resulting stored bytes, banner/reload behaviour and user messages | M-014 |
| 1 | Exercise bulk IPAM with fictional allocations: throwing snapshot write, silently ignored snapshot write, failed main save and successful save | Snapshot bytes, persisted inventory bytes, in-memory allocations, reload result and messages | M-031 |
| 2 | Target secondary import safety snapshot byte preservation and rollback where existing restore scripts do not cover the exact condition | Before/after stored bytes, recovery mode and user feedback | M-011 |
| 2 | Reconcile source-to-assertion evidence for outstanding unchecked save paths and confirmed IPAM repair; design only missing fault scenarios | Existing test reference or new targeted assertion with recorded run | M-001, M-012, M-018, M-020 |
| 2 | Confirm exact published downloadable v1.3.0 ZIP/HTML checksums and package provenance | Published asset names, SHA256 values, release tag and comparison to recorded candidate where possible | WF-13 release provenance |

## Decision and stop rules

1. Check existing run logs, screenshots, earlier test records and script assertions before scheduling a test.
2. If a historical result covers the **same behaviour, revision and failure condition**, cite it and do not repeat it.
3. For each uncovered scenario, execute one focused disposable-data test and capture exact evidence. A failure may justify a proposed fix, but implementation requires separate product owner approval.
4. Keep M-014, M-031, M-011 and other roadmap findings open until their particular evidence is sufficient. Do not open duplicates.
5. A green documentation PR does not prove browser tests passed. Keep the master audit and WF-13 in progress until evidence and cross-references reconcile.
6. Before closing WF-13, reconcile this plan, [master audit](V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md), [WF-11 to WF-13 reconciliation](WF-11-TO-WF-13-BASELINE-RECONCILIATION.md), [technical workflows](../workflows/TECHNICAL-WORKFLOWS.md), [maintenance roadmap](../roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md) and [release checklist](../releases/RELEASE-CHECKLIST.md).

**Checkpoint:** Consolidation of existing documentation and source inspection only. No tests executed, application changes, merge or release in this plan creation. Published version remains v1.3.0. Outstanding findings remain open.


## Recovered GitHub browser execution and release asset metadata, 23 October 2026

**Executed evidence recovered, not newly run by this audit:** GitHub Actions [Build Caffoot Lite standalone HTML run 39940647187](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39940647187) completed successfully on 23 October 2026, push commit `d0a817f95711cf668d0c6ae26b0b66ef8725bef9`. Job `120370950406` was successful. Its retrieved log explicitly invokes `node test-browser-offline.cjs`, `node test-browser-import.cjs`, `node test-browser-restore.cjs` and `node test-browser-upgrade.cjs`; all four completed with passing assertions. Logs include corrupt-inventory recovery and raw-text export, rejected import persistence, failed device/IPAM save rollback, cancelled/failed/successful restore, reload and renamed HTML upgrade. The job uploaded preview artifact `12496072816`. This **satisfies the consolidated plan's alternative of a recorded successful run on an identified revision**, so do not repeat the four scripts solely for provenance. It does **not** establish a Chromium run on the exact 21 October release revision or cover M-014 emergency reset or M-031 bulk IPAM snapshot fault injection.

**Published asset metadata recovered:** GitHub release API for tag `v1.3.0`, published 21 October 2026, reports SHA256 digests: `Caffoot-Lite-1.3.0.zip` = `2b02d12f163c27a5a0b63ffdd11facde0dc713266ecb1f567bb689ed7ecbcfdb`; `Caffoot-Lite.html` = `585360a2e219bc2998b413daae51d4ce0c17928dcbb73669ab1dc86e3cfbf713`; `SHA256SUMS` = `12e023a30675fdfc80dfe689206eeb4a55ef3cb8448876daa0742d5f5ebc444e`. These are **GitHub-reported release asset digests**, not locally downloaded and independently calculated hashes. Comparing published bytes to the candidate artifact remains outstanding. No new test execution or release.

## M-014 and M-031 targeted verification design, 23 October 2026

**Checkpoint type:** source inspection and test design only. No fault injection or browser test was executed. This is not a defect confirmation or an implementation approval.

### M-014 recovery banner reset

Source: `app/caffoot-lite.html`, recovery banner reset handler. The reset requires two confirmations and writes default inventory to the primary storage key before reload. A thrown write is handled, but there is no immediate readback comparison. This is distinct from the Settings Clean Start path and its existing tests.

In a disposable Chromium profile only, prepare a fictional malformed primary inventory with a distinctive raw-text marker and confirm the recovery banner appears. Capture exact original storage bytes before each isolated scenario.

| Scenario | Test action | Required evidence |
| --- | --- | --- |
| R1 | Decline the first confirmation | No reset, no reload, original raw bytes preserved |
| R2 | Accept first and decline second confirmation | No reset, no reload, original raw bytes preserved |
| R3 | Inject a throwing `setItem` only for the primary inventory key | Error shown, no reload, original raw bytes preserved |
| R4 | Inject a silently ignored `setItem` only for the primary inventory key | Record banner, reload and bytes; check whether a false success or recovery loop occurs |
| R5 | Permit a successful write | Stored defaults survive reload and the banner clears |
| R6 | Export original raw text before reset | Download contains the exact pre-reset bytes and a clearly identified recovery copy |

Record the source SHA, Chromium version, script or manual steps, storage bytes before/after, UI message, reload result and pass/fail for each. Do not test against a real inventory.

### M-031 bulk IPAM safety snapshot

Source: `phase12BApply()` in `app/caffoot-lite.html`. The function writes `caffoot_phase12b_prebulk_snapshot` within a try/catch, mutates allocations, then calls `saveState()`; on save failure it restores the previous `appState` in memory. No snapshot readback occurs before mutation.

Prepare a disposable valid fictional subnet and eligible addresses. Capture primary inventory and prebulk snapshot bytes before each independent scenario.

| Scenario | Test action | Required evidence |
| --- | --- | --- |
| B1 | Inject a throwing write for the prebulk snapshot key | Bulk action cancelled, allocations and primary bytes unchanged, error shown |
| B2 | Silently ignore the prebulk snapshot write | Determine whether operation proceeds without a verified safety copy; record snapshot, primary bytes and reload |
| B3 | Permit snapshot but force primary inventory save failure | Verify previous in-memory allocations, saved primary bytes and recovery message after reload |
| B4 | Permit both writes | Snapshot equals the original inventory bytes; updated allocations persist after reload |
| B5 | Repeat with a pre-existing older prebulk snapshot | Confirm whether failure overwrites, retains or exposes that older snapshot |

**Decision rule:** Existing browser CI already passed four scripts on run 39940647187; do not repeat them. Execute only these missing failure conditions, once, and do not call any suspected issue a reproduced defect before evidence exists. Any behavioural fix requires separate product owner approval. Keep M-014 and M-031 open and WF-13 in progress.

## M-014 executable browser regression added, 23 October 2026

A new isolated Chromium test, `app/test-browser-recovery-reset.cjs`, exercises the recovery-banner reset using fictional malformed inventory bytes. It covers cancelling each confirmation (R1 and R2), throwing primary storage writes (R3), silently ignored writes and recovery after reload (R4), successful reset persistence (R5), and byte-exact recovery download (R6). The existing `.github/workflows/caffoot-lite.yml` browser step now invokes the dedicated test after the four historical scripts.

**Evidence status:** Script and CI invocation committed on the working branch only. No Chromium run or passing assertion is claimed for this new test until the GitHub Actions job actually completes and its logs are inspected. The prior four-script successful run remains valid historical evidence and need not be repeated for provenance, although the normal CI workflow invokes them on any app change. M-014 remains open pending execution evidence and interpretation of any observed silent-write behaviour. M-031 remains open and has no new executable scenario in this checkpoint. No application behaviour was changed.

## M-014 executed Chromium evidence, 23 October 2026

**Supersedes the pending-execution status above.** GitHub Actions [run 39944710633](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39944710633), job `120384408910`, completed successfully against main commit `28f335224b60052af888750760410b06435a9b2b`. Its actual job logs confirm execution of `app/test-browser-recovery-reset.cjs`: R1 and R2 both cancelled without modifying original bytes; R3 thrown storage write preserved bytes and displayed a failure; R4 silently ignored write triggered a reload back into recovery with the original bytes intact; R6 raw export matched the original bytes; R5 successful reset persisted a valid empty inventory. The four established Chromium scripts also passed in this same run. Companion Git history secret scan [run 39944710492](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39944710492) passed on the same SHA.

**Interpretation:** No data loss was demonstrated in the six tested recovery scenarios. R4 shows a possible confusing reload rather than an explicit failure notification; record as a usability and confirmation concern, not proven data loss. This targeted evidence resolves the M-014 *test execution gap*, but does not prove all storage implementations or circumstances safe. Keep M-014 open for finding disposition and any product decision. M-031 B1 to B5 remain unexecuted. WF-13 and the master audit remain **in progress**. This evidence update changes documentation only; no behaviour fix, merge or release is implied.
