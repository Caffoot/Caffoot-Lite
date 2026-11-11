# Milestone 01 Development Handover

The published baseline remains v2.1. Work is on `milestone-1` in [draft PR #358](https://github.com/Caffoot/Caffoot-Lite/pull/358), starting at `b13e5ce919d825280a6fa5450f04ff26c356eb11`. [Issue #351, Batch 01](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790154284) is the scope and checkpoint record. No merge, deployment or publication is authorised.

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
- The migration checkpoint's actual GitHub backend, Chromium/Firefox/WebKit, Docker, documentation and history-scan checks passed. The publication jobs were skipped. Final-commit automatic results are recorded in issue #351, so this handover does not assume their outcome.

No real installation database, private export, production email delivery or deployed backup restoration was used. A complete private backup/restore rehearsal and owner acceptance remain future deployment gates, not claims made by these tests.

## Review Boundary

Stop after Batch 01 for review. This is an intermediate development state and must not be deployed. Unenrolled legacy readers keep their grants but cannot obtain an ordinary session until the separately authorised Batch 02 pre-login MFA enrolment flow exists. The approved role-management interface/API belongs to later work. No later batch has been started here.
