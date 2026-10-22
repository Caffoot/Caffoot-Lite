# Patch-release reconciliation checklist

**Purpose:** Prevent maintenance fixes on a published release branch from being lost in active feature development. Use this checklist for **every patch release** and again before the next feature release.

## Release record

- [ ] Record patch version, release tag, release commit SHA and publication date.
- [ ] Record active development branch and its starting commit SHA.
- [ ] List every patch commit, affected file, user-visible change and related issue.
- [ ] Note any security, backup, import/export, data migration or storage changes separately.

## Compare and classify

- [ ] Compare the patch tag against the active development branch, including files changed on *both* sides.
- [ ] Classify each patch fix: **already present**, **needs port**, **superseded with evidence**, or **not applicable with rationale**.
- [ ] Inspect overlapping code paths; never assume matching function names mean identical behaviour.
- [ ] Compare tests, documentation, dependency/lockfiles, package versions, release scripts and licence/notice files.
- [ ] Capture any deliberate differences and their justification in the reconciliation record.

## Port safely

- [ ] Create focused commits on the **development branch only**; do not alter published release tags or artifacts.
- [ ] Port behaviour rather than blindly copying whole files or reverting feature work.
- [ ] Preserve newer feature functionality, data formats, validation, safety checks and user-facing flows.
- [ ] Add or update automated regression coverage for each carried-forward fix.
- [ ] Review any changes to backup restoration, pre-restore snapshots, rollback, import validation and historical data compatibility.
- [ ] Confirm UI consistency, accessibility, keyboard handling and unsaved-change protection where relevant.

## Verify

- [ ] Run dependency installation and project checks on the updated development commit.
- [ ] Run JavaScript/build syntax checks and the full automated regression suite.
- [ ] Test each ported patch fix with the original reproduction case.
- [ ] Test neighbouring feature workflows for regressions.
- [ ] Test backup export, import, validation, restore cancellation, safety snapshot and rollback using disposable test data.
- [ ] Verify the version displayed in About, packaging contents, SHA256 hashes and licence notices as applicable.
- [ ] Record exact test commands, results, tester, date and commit SHA. **No CI result or local test evidence means not yet verified.**
- [ ] Prepare a separate test build for user acceptance; do not describe it as published.

## Release gate

- [ ] Confirm every patch change has a recorded disposition and supporting evidence.
- [ ] Review outstanding failures and blockers; do not publish while critical regressions remain.
- [ ] Update release notes and roadmap with carried-forward fixes.
- [ ] Obtain user approval before merging or publishing.
- [ ] Tag/publish only after checks pass and approval is given.

## Reconciliation log template

| Patch commit / issue | Affected behaviour | Disposition | Development commit | Test evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| _SHA / issue_ | _what changed_ | _present / port / superseded / N/A_ | _SHA_ | _command + result_ | _reason_ |

## Current reconciliation: v1.2.1 → v1.3.0 (in progress)

- Published maintenance baseline: **v1.2.1**. Active development: **feature/v1.3.0-rack-management**.
- Rack-mounted device with a valid rack/U placement must not be incorrectly flagged solely because physical room/site is unknown: ported in `5c5406a`.
- Legacy backup mounting/location review text and clearer proposed corrections: reconciled in `703832f`.
- Backup-validation entry point and AP mounting conflict check were compared and found matching at the time of review.
- Import routine and all restore edge cases still require focused regression verification.
- Device Type Catalogue and inline Location Area workflow are ongoing v1.3.0 changes, **not** part of the published v1.2.1 release.
- Full test suite, test-build verification and publication approval: **outstanding**.

**Rule:** Never mark a patch reconciled solely because the code compiles; require behaviour-level test evidence.
