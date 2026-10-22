# Caffoot Lite v1.3.0 Technical Workflows

**Status:** Baseline audit in progress. Not yet a complete or verified specification.
**Source:** Published v1.3.0 baseline, examined from `main`. Before final approval, verify the precise release tag and source commit.
**Purpose:** Describe actual implemented behaviour, data relationships, safeguards, error paths and tests for contributors. Future proposals belong in separate architecture documentation.

## Documentation standard

For each workflow record: entry point and trigger; source path and function names; inputs and state read; ordered operations; validation and authorisation checks; changes to related records; persistence; error and rollback behaviour; interface response; tests; verified source revision; open questions. Never infer a successful runtime test from source inspection. Mark unknowns explicitly. Update documentation with each significant code change.

## Workflow register

| ID | Area | Status |
| --- | --- | --- |
| WF-01 | Startup, load and recovery | Source inspected, runtime verification pending |
| WF-02 | Save and integrity validation | Source inspected, runtime verification pending |
| WF-03 | Device create, edit, convert and delete | Pending |
| WF-04 | Subnets, VLANs and IPAM | Pending |
| WF-05 | Rack placement and accessories | Pending |
| WF-06 | Backup, import and restore | Pending |
| WF-07 | UI navigation and forms | Pending |
| WF-08 | Catalogues, software and services | Pending |
| WF-09 | Audit history and preferences | Pending |
| WF-10 | Security, build, tests and release | Pending |

## WF-01 Startup, load and recovery

**Source:** `app/caffoot-lite.html`, approximately lines 1615 to 1680 on `main` at initial inspection. Line numbers are navigational aids, not immutable identifiers.

- `STORAGE_KEY` is `caffoot_state`.
- `loadStoredState()` calls `localStorage.getItem(STORAGE_KEY)`.
- If no saved value exists, it returns `cloneDefaultData()`.
- If a value exists, it parses JSON, requires a plain object with `devices`, `subnets` and `racks` arrays plus an `ipAllocations` object, rejects unsafe keys through `phase16CRejectUnsafeKeys()`, then calls `normaliseState()`.
- Storage read failures or parsing/structure failures set `phase17AStorageRecovery` and return defaults in memory. The original stored value is not overwritten during startup.
- `appState` is initialised from `loadStoredState()`; `validateApplicationState()` runs afterwards. Startup integrity errors are logged.
- `phase17ARecoveryBanner()` builds a recovery notice with a download option for readable raw stored text and an explicitly confirmed reset path.
- **Important distinction:** Default data appearing in memory during recovery does not mean the original inventory has been replaced in browser storage. Saves are blocked while recovery mode is active.

**Unverified:** Browser behaviour across storage denial, malformed JSON, malformed relationships and reset. Exact invocation of the recovery banner and all UI disabling paths remain to be traced.

## WF-02 Saving and integrity checks

**Source:** `app/caffoot-lite.html`, approximately lines 1556 to 1610 and 1825 to 1855 on `main`.

- `saveState()` refuses to save when `phase17AStorageRecovery` is set.
- It runs `validateApplicationState()` and rejects a save if integrity errors are returned.
- On the valid path, it sets `appState.stateVersion`, serialises `appState`, writes the result to `localStorage` and reads it back to compare the stored string.
- After the write, it attempts `recordAudit()` using the previous audit baseline. Audit recording failures are caught and logged rather than failing the already completed inventory write.
- It updates the audit baseline, shows a success notification and returns `true`. Write or verification failures produce an error notification and `false`.
- `validateApplicationState()` checks subnet hierarchy and type rules, subnet IDs, VLAN numbers within their parent domain, device IDs, duplicate primary IP addresses, IPAM consistency, and device references to racks and rack U range consistency.

**Important limitations to investigate:** A browser write followed by a matching read is not a database transaction. The audit trail is attempted after the inventory write, so its success is not guaranteed by a successful inventory save. Determine whether all callers restore their in-memory state on `saveState() === false` and whether partial updates to related browser keys can occur.

## Evidence and issue log

| ID | Observation | Classification | Follow-up |
| --- | --- | --- | --- |
| E-001 | Startup avoids overwriting unreadable saved inventory | Source verified | Exercise recovery paths in a browser |
| E-002 | Save checks relationships and verifies browser storage readback | Source verified | Trace all mutation callers |
| R-001 | Audit history is recorded separately after inventory write and may fail independently | Potential consistency limitation | Assess intended guarantees and tests |
| R-002 | In-memory rollback after failed save may depend on individual callers | Investigation question | Audit create, edit and delete paths |
| R-003 | Precise published v1.3.0 tag or commit not yet matched to branch source | Verification gap | Confirm release provenance before signing off |

## Completion criteria

This document is not complete until each workflow has source evidence, failure behaviour, cross-record effects, relevant tests and an explicit review outcome. Confirm release provenance and ensure no unresolved material ambiguities remain. Where a defect requires code changes, use an approved maintenance branch and record both baseline behaviour and the corrected release version. Do not rewrite history to suggest the original v1.3.0 behaved differently.
