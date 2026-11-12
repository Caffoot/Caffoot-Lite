# Milestone 01 Development Handover — v2.2 Target

> **Current status, 12 November 2026:** v2.2 is the agreed **future** release designation for Milestone 01, not a public release or Docker image. The latest published version remains **v2.1**. Stage 1 RBAC, individual overrides, IT Staff and schema 12 were formally accepted, with the isolated fictional-data full-volume restore rehearsal reported passed, and [PR #358](https://github.com/Caffoot/Caffoot-Lite/pull/358) merged into `main` at `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a`. **Stages 2–6 are still open.** Development and private acceptance continue on `milestone-1`; do not merge to `main`, publish v2.2 or deploy to a real installation without separate owner approval. Track remaining stages in [#351](https://github.com/Caffoot/Caffoot-Lite/issues/351) and release-preparation documentation in [#366](https://github.com/Caffoot/Caffoot-Lite/issues/366).

## Ongoing v2.2 checklist

- [x] Agree target version v2.2; distinguish from published v2.1
- [x] Stage 1 — accepted and merged (PR #358); documented real Pi and isolated restore evidence
- [ ] Stage 2 — optional-feature foundation (issue #238)
- [ ] Stage 3 — People, Assets and equipment handovers (#232, #352, #292)
- [ ] Stage 4 — Suppliers and lifecycle (#349, #286)
- [ ] Stage 5 — Service Desk and notifications (#233, #355)
- [ ] Stage 6 — fixes, integrated verification and milestone-wide acceptance (#347, plus cross-feature checks)
- [ ] Draft and verify v2.2 release notes, installation/upgrade/rollback guidance, source-compatible examples and screenshots based on delivered work
- [ ] Obtain separate final milestone merge approval; verify the resulting `main` build
- [ ] Obtain separate v2.2 publication approval and verify published image/platforms, release notes and installation links before changing current-release instructions

## Historical Stage 1 implementation record

**The notes below were written during Stage 1 and may describe then-pending checks or a then-draft PR. They are historical checkpoints, superseded by the current status above.**

## IT Staff — Issue #365

Original Stage 1 was [accepted by the owner](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6816955325)
at `53252613cf5302d8e526324c0982b8807472e251`. The separately authorised
[IT Staff feature](https://github.com/Caffoot/Caffoot-Lite/issues/365) follows
the issue's final active-account migration and schema-12 technical review;
the earlier exact-match and unassigned-upgrade proposals are superseded.

Schema 12 adds configurable protected built-in identities without weakening
Staff Member. IT Staff starts with Edit/Edit/Edit; active existing accounts
receive it while necessary ordinary overrides preserve exact prior section
access. Disabled users are not assigned; new ordinary users remain Staff-only.
Assigned active accounts are signed out and retain the existing mandatory-MFA
enrolment flow, including where preserved access is No Access throughout.
The existing role editor/membership controls expose permitted configuration,
protect name/deletion, and explain individual overrides without changing the
three-card permission layout. User instructions include Dave and Tim.

See [implementation and test evidence](evidence/it-staff/Report.md),
[role/security details](../development-guide/Role-Permissions.md#configurable-built-in-roles--schema-12)
and the updated Function Index. PR #358 must stay draft and unmerged. Stop for
private Raspberry Pi acceptance of this additional feature; no deployment,
release or Docker publication is authorised. Existing Stage 1 acceptance is
not claimed as acceptance of schema 12.

## Final Interface Corrections

Continued from the existing uncommitted corrections on
`7daa3555fe5d7c6ea90a4a79cde541ce487abbe9`, under
[owner checkpoint 6805479377](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6805479377)
and the owner's subsequent clarification: preserve existing Devices visibility;
do not add a rack-display projection or change rack API permissions.

My Account now displays Staff Member, additional and disabled assigned roles,
with Administrator status separate. The rack action filter hides unavailable
editing/removal actions, including unassignment and suggested mounting; readers
retain vertical accessories and empty-U geometry as non-interactive content.
Racks Edit controls, backend safeguards and all pinned HTML/CSS remain intact.

See the [focused correction evidence](evidence/interface-corrections/Report.md)
for actual results, failures, screenshots and the changed-file inventory. The
Function Index retains 733 definitions with updated declaration locations.
PR #358 remains draft. The earlier successful PR-merge browser checks at
[run 43066565241](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43066565241)
remain earlier-source evidence; final-head reconciliation and verification of
this new source are still required. No Stage 1 acceptance, merge or publication.

## Batch 05 Verification Checkpoint

The owner's 11 November 2026 resumption instruction authorises only the existing
[Batch 05 specification](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790171609),
using the [efficient testing procedure](https://github.com/Caffoot/Caffoot-Lite/issues/363#issuecomment-6800582534).
This supersedes earlier pauses below for this batch only. The starting remote
head is `689afd827ef3192379b6baf7ef6d289d8f73da04`, including merged rack-spacing
PR #359. Batches 01–04 are not repeated. PR #358 remains draft and unmerged.

Batch 05 adds only isolated verification and documentation. See the
[evidence report](evidence/milestone-01-batch-05/Report.md) and
[complete-volume rehearsal/owner preflight](../development-guide/Upgrade-And-Restore-Rehearsal.md).
Application code, approved designs and workflow definitions remain unchanged.
Batch 04's final Chromium, Firefox and WebKit requirement remains outstanding;
earlier/local evidence cannot replace it. No Stage 1 final acceptance, protected
`main` change, real Pi/private-data modification, merge or publication is authorised.

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

Batches 01–03 are accepted at `632fb5aebc7feb1415d0cfb6eb1c8e40258806b1`. Only the [corrected Batch 04](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790324888) is [authorised](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6793430504). Preserve the actual approved v2.1 interface and stop for explicit owner approval if implementation requires existing layout changes beyond the agreed additions. Stop after Batch 04 for owner review. This remains an intermediate build; Batch 05, merge, protected `main` changes and publication are not authorised.

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

Starting SHA: `ac2f2c473e9dc054dd06e7ab508e1dac5d40b992`. [Authorised scope](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790155451): administrator role operations, previews, atomic confirmation, audit and optional notifications. Stop after this batch for review; Batch 04 is not started.

- Custom role create/edit/rename/enable/disable/delete, multiple assignments and individual Inherit/No Access/Read/Edit choices use the shared access/MFA policy. Staff Member and separate Administrator safeguards remain protected. New roles are unassigned, keys survive rename, and existing MFA is never cleared by role changes.
- The server computes before/after inheritance, overriding choices, effective/retained rights, mandatory/pending MFA and account/session consequences. Five-minute proofs bind the current session, actor, exact action and security dependencies. A server-only process key prevents clients signing their own proof; restart requires a new preview. Confirmation checks the time after acquiring the write lock, so waiting cannot extend expiry.
- Values, attributable history and affected revocation commit together. Membership assignment/removal always ends that account's sessions; other role/override changes end sessions only where effective rights or MFA requirements change. Renames and hidden grants retain unaffected sessions. Stale/mismatched/replayed proofs save nothing and return refreshed impact; deleted targets return an unavailable preview. Unusually shaped historical inventory entries do not block administration, and deleted role definitions remain in history.
- The old direct HTTP permission route returns 410. Its retained Python adapter also requires session and preview proof. Fictional-account fixtures now use a test-only temporary session and the confirmed service; they are not an application mutation path.
- Existing optional security email runs after commit, using active verified recipients, eligible administrators, generic content, coalescing and the bounded queue. Configuration/queue/delivery failure cannot undo access changes. Responses report eligibility and queue admission, never delivery.
- The [role guide](../development-guide/Role-Permissions.md#administrator-role-operations) records exact endpoints, payloads and response semantics for Batch 04. Affected user/security/API/architecture guides, compatibility copies, code reference and Function Index are updated.

### Checkpoints And Evidence

- `0f0acf4f8f5b4374589d56fde95267cbbe838321`: initial implementation; eight role-service and five account/profile HTTP checks passed before push.
- `8cb6e0093aa53f478726c753f63edbea18ba5d11`: expanded request, notification and SQLite concurrency checks; local Chromium passed after its fixture moved to confirmed API requests. The first checkpoint's Chromium failure was an expected retired-endpoint mismatch in test setup, corrected without changing application interface files.
- The final local `python -m unittest discover -s tests -v` run passed **561 tests, no failures/errors, three existing skips**, including four real SQLite role concurrency tests. A subsequent strengthened four-test notification run passed, explicitly proving a committed permission survives an actual delivery exception through the queue helper. Twenty existing session HTTP tests also passed during focused validation.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-compat.cjs` passed: retired control rejection, confirmed permission setup, Staff/MFA sign-in, shared inventory, restricted controls, reservations, reset and one-way import. The subnet fixture also uses the confirmed service; final Actions supplies Firefox/WebKit and Docker coverage.
- Python compilation, release-document consistency, changed Markdown links, JavaScript syntax, all eight compatibility guide copies, all 720 Function Index declaration links and whitespace checks passed. Comparison with the starting SHA confirms no application presentation, pinned design source, schema, inventory-contract, workflow or deployment-file changes.

Final pushed SHA and final-commit Actions results are recorded in [issue #351](https://github.com/Caffoot/Caffoot-Lite/issues/351); do not infer them from earlier checkpoint runs. PR #358 remains draft and protected `main` is unchanged.

### Remaining Limits

Two tests need a private genuine v1.3.3 export; the third local skip is the opt-in Docker test, covered separately by Actions. No real installation data, complete private backup/restore rehearsal or production SMTP delivery was used. The existing TOTP verifier's adjacent-step allowance and lack of a replay cache are unchanged. Pending previews require renewal after restart. The approved sign-in/My Account/Users integration remains Batch 04 and is required before deployment. No Batch 03 implementation blocker is known.

**Stopped after Batch 03 for review. No Batch 04, merge, tag, deployment or publication.**

## Batch 04 — Before Implementation

Starting application SHA: `632fb5aebc7feb1415d0cfb6eb1c8e40258806b1`. The initial missing-reference blocker is resolved: both owner-supplied standalone HTML attachments match the approved sizes and SHA-256 hashes. The [comparison report and desktop/mobile evidence](evidence/milestone-01-batch-04-comparison/Report.md) compare both demonstrations with the current HTTPS/SQLite Users screen and exact pinned source.

The comparison identifies an additive route within the existing layout: retain the original Overview, list, form and full account-management dialog, add Manage Roles fourth, and extend the existing section-permission cards with inheritance/override/effective information. Do not copy the prototypes' shell, reordered tabs, replacement KPI categories, modal panels/footer, table-based permission layout, fictional data or local mutation handlers. No required alteration to an existing approved layout has been identified; the explicit owner-approval gate still applies if implementation reveals one.

Chromium captured the existing four Users views against the pinned source at desktop/mobile widths, plus editable non-owner account forms and lifecycle controls. Both prototypes rendered six views at each width: 24 captures, no JavaScript page errors or document overflow in the checked views. The report distinguishes different demonstration data from layout evidence. Integration, full keyboard/accessibility and regression tests remain outstanding. No runtime functions changed at this comparison-only checkpoint, so the Function Index remains unchanged.


## Batch 04 — Integration Checkpoint

Continued from comparison checkpoint `233780e198ae4bb67794b80969a5b51160c3d00b`; the pre-implementation comparison was not repeated. The [specific Staff-only `/account` approval](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6794069354) resolves access to the existing My Account surface without inventory privileges.

- Existing Users structure, original KPI categories, five-column list, filters, editable profiles, account activation, independent Administrator controls and deletion remain. Manage Roles is fourth; role memberships and inherited/override/effective values extend the existing permission cards. Add User requires password confirmation.
- Real catalogue, role lifecycle, membership and override operations use server-produced previews and explicit confirmation. Stale previews show renewed impact and require re-confirmation. Notice feedback reports eligibility and queue state only.
- Mandatory pre-login enrolment uses the existing sign-in QR/key form and ordinary-account endpoints, with no session before completion and fresh sign-in afterwards. The obsolete hidden sign-in account panel is removed in favour of the approved existing My Account entry; inventory users retain their destination.
- Staff-only `/account` loads own-account data and authenticated static interface files, never inventory state. Existing inventory, administrator and other-user endpoints retain their permission checks. Optional removal is shown only from server-derived eligibility and uses the existing password/TOTP transaction and session revocation.
- New runtime functions and declaration locations are regenerated in the Function Index; affected developer/security/user guides and compatibility copies are updated in this batch.

Focused Chromium checks passed role lifecycle, cancellation, real stale state, overrides, MFA enrolment, retained profile/lifecycle controls, 320/390/768/1440px fit and keyboard containment. The new role dialog passed axe WCAG 2 A/AA and 2.1 AA checks after correcting contrast in new controls only. Staff-only browser checks passed own-account entry, unauthenticated rejection, inventory/admin/other-user denial, ineligible removal rejection, optional removal and revocation of two sessions. The 21-test account HTTP file and updated existing Chromium compatibility suite passed. The final local backend run passed 562 tests with three existing skips (the separate opt-in Docker lifecycle test and two private genuine-export checks). Expanded axe checks passed the new role preview, membership/permission additions, required-enrolment QR area and optional-removal panel as well as the role editor. GitHub CI and final implemented visual evidence remain to be completed. This is a partially verified checkpoint, not Batch 04 acceptance. No Batch 05, merge, deployment or publication.

### Batch 04 Review Package

Implementation checkpoint `a5bafb6ba4eccdefa8293d7e7219289fe179961b` was committed and pushed with the integration, guides, Function Index and test wiring. All six PR workflows passed there: eight successful jobs covering backend, Chromium/Firefox/WebKit, real Docker lifecycle, documentation, history scanning and release-safety preflight; six release-only jobs were skipped. Publication did not run. Final SHA and final-head Actions outcomes are recorded in issue #351 separately from checkpoint outcomes.

The [final implementation report and 60 screenshots](evidence/milestone-01-batch-04/Report.md) supply actual post-integration desktop/mobile comparisons, new-role/shared-impact/stale previews, MFA enrolment/removal and dark-theme examples. The final focused browser suite also verifies multiple roles and highest inheritance, impact for two assigned accounts, retained Administrator promotion/demotion, actual user deletion and the approved account-route boundaries. Seven scoped axe scans report zero violations. Native-select arrow backgrounds and two dark-dialog text nodes required manual contrast completion; measured ratios and automated incomplete results are disclosed in the report. No complete-site accessibility certification is claimed.

The measured existing Users sidebar/header/main/KPI/profile-grid widths, columns, padding, gaps and border radii remain unchanged in the eight checked desktop/mobile views. Pinned stylesheets and design records remain unchanged. Added controls/content use existing form, card, list and dialog patterns; final appearance and behaviour still require owner review.

Local backend: 562 tests passed with three documented skips; local existing Chromium and expanded Users/MFA checks passed. Source/template provenance, 733 Function Index locations, compatibility copies, links, syntax, release consistency and whitespace checks passed. No production data, real SMTP delivery or complete private restore rehearsal was used. The existing TOTP verifier is unchanged.

**Batch 04 implementation is complete for review. Stop here; do not treat automated checks as owner acceptance. No Batch 05, PR #358/#359 merge, protected `main` change, deployment or publication.**
