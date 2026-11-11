# Milestone 01 Development Handover

The published baseline remains v2.1. Work is on `milestone-1` in [draft PR #358](https://github.com/Caffoot/Caffoot-Lite/pull/358), starting at `b13e5ce919d825280a6fa5450f04ff26c356eb11`. [Issue #351](https://github.com/Caffoot/Caffoot-Lite/issues/351) holds the Batch 01/02 scopes, approvals and checkpoint evidence. No merge, deployment or publication is authorised.

## Batch 01

- Schema 11 adds four role tables, retains the old grants as historical data, assigns Staff Member to all accounts, preserves exact Read/Edit overrides and missing-row inheritance, and revokes all old sessions within one checked transaction.
- First-administrator setup and ordinary creation assign Staff Member atomically. No People links are inferred.
- A single shared policy resolves enabled roles and individual overrides for access, sign-in, sessions, recovery and the existing Users response. Read and Edit both require MFA. Independent administrators and last-administrator safeguards remain protected.
- The existing No Access control stores a deliberate deny through its server adapter. No approved interface, pinned design source or inventory contract is changed.
- The migration checkpoint is `94d02df84c8f08b99939f2cb424043a5e5c81c2f`; its 14 focused checks passed. Later checkpoint SHAs and actual local/automatic results are recorded in issue #351.

See [Shared Roles And Account Permissions](../development-guide/Role-Permissions.md) for storage, precedence, MFA, compatibility and full private backup/rollback requirements. Tests use fictional temporary data, including a schema fixture captured from the verified v2.1 starting source.

## Checks On 11 November 2026

- `python -m compileall -q backend tests` passed.
- `python -m unittest discover -s tests -v`: 513 tests, no failures or errors, three skips. The skips are the separately run opt-in Docker test and two checks requiring a private genuine v1.3.3 export. The run includes eight migration checks and ten shared-policy checks.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-compat.cjs` passed against local HTTPS/SQLite, including Staff sign-in, required MFA for Read, restricted controls, shared viewing, reservations, reset and import.
- `CAFFOOT_DOCKER_SMOKE=1 CAFFOOT_BUILD_CA=/etc/ssl/certs/ca-certificates.crt python -m unittest discover -s tests -p 'test_compose_lifecycle.py' -v` passed its one real lifecycle test using a disposable Compose project. Local Docker endpoint selectors were cleared before the run.
- `python scripts/verify_release.py`, `git diff --check`, changed guide links, matching old/new user-guide copies and regenerated Function Index locations passed review.
- Automatic Firefox/WebKit checks at application checkpoint `07dea380445b92c565095a61c99a8956f55ec13f` found that the existing IPAM browser fixture still tried password-only Read login. Its test-only correction enrols both reader and editor. The focused local check passed: `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_SUBNET_FIRST=1 CAFFOOT_SUBNET_FIRST_ROLES_ONLY=1 CAFFOOT_VISUAL_FILTER='^$' node tests/approved-visual.cjs` (with evidence written outside the source tree). JavaScript syntax and whitespace checks passed. No application or interface change was needed.
- The migration checkpoint's actual GitHub backend, Chromium/Firefox/WebKit, Docker, documentation and history-scan checks passed. The publication jobs were skipped. Final-commit automatic results are recorded in issue #351, so this handover does not assume their outcome.

No real installation database, private export, production email delivery or deployed backup restoration was used. A complete private backup/restore rehearsal and owner acceptance remain future deployment gates, not claims made by these tests.

## Review Boundary

Batches 01 and 02 are accepted. [Batch 03 is authorised](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6792588383), starting at `ac2f2c473e9dc054dd06e7ab508e1dac5d40b992`. Stop after Batch 03 for review. This remains an intermediate build; Batch 04, merge, protected `main` changes and publication are not authorised.

## Batch 02

Starting SHA: `0131801e4886eb4ac9c5a5af50bdce768d11b3eb`. Scope: [existing-account mandatory enrolment and eligible voluntary removal](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790154888), with no presentation changes.

- Valid-password mandatory enrolment returns a setup-required response without a session. Pending setup does not count as failed login or reset earlier code failures.
- Separate pre-login start/confirm operations independently verify credentials and current policy under a write transaction, reuse pending secrets, enforce existing Origin/JSON/size/throttle controls, and require fresh normal sign-in after audited confirmation and revocation.
- Session creation now holds the write transaction throughout credential/policy verification and insertion. Existing live-session, section and recovery checks retain the shared policy.
- Optional removal verifies session, password, code and current access under one transaction, then clears MFA, audits and revokes sessions/email proofs. Roles/grants are unchanged. First-admin setup and confirmed-MFA promotion remain protected.
- Focused checks and final automatic evidence are recorded in issue #351. A first HTTP test run exposed an overly strict assertion about cookie attribute ordering; it is corrected without changing cookie behaviour. The corrected focused run passed all 18 new tests (`python -m unittest discover -s tests -p 'test_required_mfa*.py' -v`), as did Python compilation, release-document consistency and whitespace checks. Full backend checks and final CI are pending at this checkpoint.

### Batch 02 Checks And Remaining Work

- Implementation checkpoint: `776a6e19cb675110da821090c2d41b24c078f394`. The first full local backend run passed 531 tests with three skips.
- The expanded focused command, `python -m unittest discover -s tests -p 'test_*mfa*.py' -v`, passed 29 tests. Together with the final deleted-account HTTP regression, coverage includes 25 added checks across service, HTTP and real SQLite concurrency tests. The legacy-reader HTTP check upgrades the published schema-v10 fixture and confirms that Read access is preserved after enrolment.
- Concurrency checks hold a real SQLite write lock while account/role/session changes occur, then verify the waiting operation uses the newly committed state. They cover role disable/removal, new role/Read/Edit assignment, account disable, pending/confirmed MFA changes, session revocation and new-session creation.
- A second full backend run passed 537 tests with three skips. The final small request-guard amendment handles an account deleted immediately after request authentication; its HTTP regression and the complete 11-test MFA HTTP file are checked separately after that amendment. Final-commit Actions runs the whole resulting 538-test backend suite.
- Python compilation, release consistency, changed local documentation links, all compatibility guide copies, all 704 Function Index declaration locations and `git diff --check` passed. Approved presentation, pinned sources, inventory contracts, migration schema, deployment configuration and protected `main` are untouched by Batch 02.
- GitHub Actions supplies browser and Docker coverage; no duplicate local browser suite was run. The implementation checkpoint's Docker, Firefox and WebKit jobs passed; Chromium was still running when this evidence entry was written. Final-commit Actions results and review SHA are recorded in issue #351, without assuming their outcome here.

The three local skips are the opt-in real Docker test (covered by branch Actions) and two private genuine-export tests. No private installation data, production mail delivery or complete backup/restore rehearsal was used. No Batch 02 implementation blocker is known. Later UI integration remains required before deployment; it has not been started. Stop for Batch 02 owner review.

## Batch 03

Administrator role lifecycle, multiple assignments and individual overrides now use server-computed preview and session/action-bound confirmation. The shared policy supplies exact inheritance, overriding choices, effective/retained access, MFA and session consequences. Confirmation rechecks dependencies while holding SQLite's write lock. Values, history and precisely affected revocation commit together. The old direct permission endpoint is retired; presentation files remain unchanged. Existing best-effort verified-email security notices run after commit and expose queue admission only.

The [role guide](../development-guide/Role-Permissions.md) documents the endpoint contract for Batch 04. Initial focused checks cover lifecycle, precedence, retained rights, stale/forged/expired/wrong-session proofs, safeguards and atomic rollback. Further HTTP, notification and concurrency checks and final Actions evidence are pending at this implementation checkpoint. No review or deployment readiness is claimed.
