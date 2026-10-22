# WF-01 Startup, Storage and Recovery: Controlled Test Plan

**Baseline:** Published Caffoot Lite v1.3.0, tag `v1.3.0`, commit `92d6a60b0e4bc9f73589b27820cb283def377dbd`.
**Status:** Planned tests only. No execution or browser verification is claimed.
**Purpose:** Verify the released application's actual startup and recovery behaviour, then separately specify future maintenance acceptance criteria.

## Plain English overview

Caffoot stores its inventory in browser storage. We need to check that it does not destroy original information when that storage is damaged, unavailable or inconsistent. Some warnings currently appear only in the browser's developer console. An emergency reset uses two confirmations but does not read back the replacement inventory before reloading. These are observations from the published source, not reproduced faults.

## Safety rules and preparation

1. Use a **disposable browser profile**, a separate local test copy of the **published v1.3.0 HTML**, and **fictional inventory only**. Never use the owner's everyday browser profile or real inventory.
2. Before each scenario, capture the initial `caffoot_state` string and record whether `caffoot_audit_v1` or other Caffoot keys are present. Do not include real credentials or personal data in evidence.
3. Reset the disposable profile between scenarios. Record the browser and version, storage settings, source tag, exact fixture, steps, visible outcome, developer-console output and final stored bytes.
4. A test is **passed** only after it is actually executed and observed. An expected result based on source inspection is not a test result.
5. Where a failure requires intercepting `localStorage`, use a separately reviewed test harness. Do not paste unreviewed scripts into a browser containing genuine inventory. A test harness must distinguish thrown writes, silent write failures, blocked reads and readback mismatches.
6. Preserve the six audit gates separately: source inspected, documentation reconciled, roadmap discussed, automated tests executed, browser verified and owner approved.

## Released v1.3.0 browser scenarios

| ID | Setup in disposable profile | Action | Expected observation from source | Evidence to collect |
| --- | --- | --- | --- | --- |
| WF01-T01 | No `caffoot_state` key | Open standalone HTML | Default empty inventory; no recovery banner; no automatic startup write | Screenshot, key presence before/after |
| WF01-T02 | Valid fictional inventory | Open HTML and inspect data | Inventory loads; stored bytes not rewritten merely by startup | Screenshots, before/after exact text |
| WF01-T03 | Malformed JSON text | Open HTML | Recovery banner; original text preserved; ordinary saving disabled | Banner, raw key unchanged, save attempt |
| WF01-T04 | Valid JSON missing a required collection | Open HTML | Recovery banner and unchanged raw text | Banner, exact storage comparison |
| WF01-T05 | JSON with a nested unsafe property such as `__proto__` | Open HTML | Rejected for recovery; raw data preserved | Banner, raw text comparison, console |
| WF01-T06 | Fictional readable inventory with an integrity problem that survives normalisation | Open HTML, then attempt a save | Integrity error logged; no dedicated integrity banner; unsafe save rejected | Console, visible save warning, raw key |
| WF01-T07 | Recovery state with readable raw text | Click download original data | Text download offered; original storage not changed | File bytes, browser behaviour, key comparison |
| WF01-T08 | Recovery state | Start reset, cancel first confirmation | No reset and no reload | Storage and page state |
| WF01-T09 | Recovery state | Accept first, cancel second confirmation | No reset and no reload | Storage and page state |
| WF01-T10 | Recovery state with disposable raw text | Accept both confirmations | Default inventory written and page reload requested; no explicit readback in current source | Storage after reload, original test text archived |
| WF01-T11 | Simulate `localStorage.getItem` throwing at startup | Open HTML | Recovery protection activates with no downloadable raw text | Banner, disabled download, console |
| WF01-T12 | Simulate emergency reset `setItem` throwing | Accept both confirmations | Alert reporting reset failure; reload should not be requested | Alert, reload count, original bytes |
| WF01-T13 | Simulate emergency reset write returning without persisting | Accept both confirmations | Current source requests reload without detecting silent failure; verify actual runtime result | Write trace, reload count, original bytes |
| WF01-T14 | Simulate readback returning unexpected bytes after emergency reset | Accept both confirmations | Current emergency handler performs no readback; test demonstrates verification gap, not a previously proven incident | Read trace, reload count, stored bytes |
| WF01-T15 | Valid legacy fictional inventory with known retired location/IPAM drift | Open HTML | In-memory normalisation; no immediate automatic write; meaningful changes not separately announced | UI, before/after storage, in-memory comparison via safe harness |
| WF01-T16 | Recovery mode active | Attempt ordinary inventory save | Save rejected without replacing original stored text | Warning, before/after bytes |

**Fixture design note:** T06 must use a *readable* state that `normaliseState()` does not automatically repair. For example, investigate a duplicate device ID in an otherwise valid fictional inventory. Verify fixture preconditions against the pinned source before treating the test as meaningful. T15 must be based on known, controlled migration examples, not guessed data.

## Automated test traceability

- `app/test-security-storage.cjs` exercises the extracted loader and unsafe-key guard, but substitutes a stub for `normaliseState()`.
- `app/test-security-reset.cjs` covers the separate Settings clean-start handler `phase16AClearSystem()`, not the emergency recovery-banner reset.
- `app/test-backup-contract.cjs` covers backup validation, legacy fixtures and normalisation without running the full browser startup sequence.
- Run the appropriate pinned v1.3.0 automated scripts in a disposable checkout and capture command, environment, exit code and output. Do not infer a pass from source inspection or previous release claims.

## Proposed future acceptance criteria, not current v1.3.0 behaviour

**M-014, agreed in principle:** After both emergency reset confirmations, verify that the exact expected replacement inventory was persisted before reloading. On thrown, silent or mismatched writes, do not reload as if reset succeeded. Preserve original recovery options and report failure clearly. Agree the exact response to storage faults before implementation.

**M-017, agreed in principle:** When a readable inventory fails startup integrity checks, show a friendly, non-destructive notice explaining that the inventory remains visible but cannot be safely saved. Provide a review path and backup guidance. Do not automatically delete, overwrite, reset or silently repair questionable data. Test wording, accessibility, repeated notices, save blocking and data preservation.

**M-015, design direction only:** Consider a small reviewable notice for meaningful legacy normalisation. Distinguish material corrections from routine defaults and do not write automatically at startup.

## Results register template

| Test ID | Run date and browser | Fixture / harness revision | Observed result | Stored bytes preserved? | Outcome | Evidence link |
| --- | --- | --- | --- | --- | --- | --- |
| WF01-T01 to WF01-T16 | Not run | Pending | Not observed | Not verified | Pending | Pending |

## Exit conditions

WF-01 may only be marked browser verified when the agreed scenarios have been executed, failures investigated and evidence recorded. Do not close M-014 or M-017 merely because a plan exists. Published asset byte verification, ZIP member checks and release-note reconciliation are separate outstanding release provenance tasks.
