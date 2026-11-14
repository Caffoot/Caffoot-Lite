# Milestone 01 Development Handover — v2.2 Target

> **Current status, 14 November 2026:** v2.2 remains the future Milestone 01 target; the published release is **v2.1**. Stage 1 was accepted and merged into `main` at `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a`. Stage 2, including native Pi/Safari corrective retests, was accepted through PR #376 on `milestone-1` at `519842b46861c85fde0eebf78298117c2346599d`. Stage 3 Batch 3.1 is an authorised review candidate; later batches and Stages 4–6 remain pending. No merge to `main`, publication or real deployment is authorised. Track remaining work in [#351](https://github.com/Caffoot/Caffoot-Lite/issues/351) and [#366](https://github.com/Caffoot/Caffoot-Lite/issues/366). Dated sections below preserve earlier checkpoints.

## Ongoing v2.2 checklist

- [x] Agree target version v2.2; distinguish from published v2.1
- [x] Stage 1 — accepted and merged (PR #358); documented real Pi and isolated restore evidence
- [x] Stage 2 — optional-feature foundation (issue #238), accepted through PR #376
- [ ] Stage 3 — People, Assets and equipment handovers (#232, #352, #292)
- [ ] Stage 4 — Suppliers and lifecycle (#349, #286)
- [ ] Stage 5 — Service Desk and notifications (#233, #355)
- [ ] Stage 6 — fixes, integrated verification and milestone-wide acceptance (#347, plus cross-feature checks)
- [ ] Draft and verify v2.2 release notes, installation/upgrade/rollback guidance, source-compatible examples and screenshots based on delivered work
- [ ] Obtain separate final milestone merge approval; verify the resulting `main` build
- [ ] Obtain separate v2.2 publication approval and verify published image/platforms, release notes and installation links before changing current-release instructions

## Stage 3 Batch 3.1 — Staff Members And Departments Foundation

Started from verified `milestone-1` at `519842b46861c85fde0eebf78298117c2346599d`,
the accepted Stage 2 correction merge. Dedicated branch:
`feat/staff-departments-foundation`. Scope follows the
[Batch 3.1 authorisation](https://github.com/Caffoot/Caffoot-Lite/issues/368#issuecomment-6877271755).

The first checkpoint adds schema 14, independent Staff/flat Department records,
unique optional account links and atomic one-time backfill. It recognises the three
new RBAC sections without granting them and explicitly retains the original three
inventory-import requirements. The existing account-delete contract and approved
Staff retention are combined through a nullable link; no profile synchronisation
or account creation change is added. See
[implementation contract](../development-guide/Staff-Directory-Foundation.md).

Initial focused check: **24 tests passed**, no failures/skips, covering the new
migration plus existing schema and feature-settings tests. This includes exact
all-table/account-policy preservation, blanks, constraints, retry/reopen, concurrent
upgrade, rollback and conflict handling. New-section security and wider regression
checks are still pending at this checkpoint. No visual changes or design pins changed.

The first migration checkpoint was committed and pushed as
`42397f54e8518a04997fbd25ecdbf4c584b2f058`.
The completed focused selection passed **95 tests**, no failures/skips:
`test_staff_directory_migration`, `test_staff_section_permissions`, `test_schema`,
`test_feature_settings`, `test_permissions`, `test_role_policy`, `test_role_migration`,
`test_builtin_roles`, `test_roles`, `test_import_http`,
`test_optional_features_persistence` and `test_history_permissions`.
It exercises partial backfill, login-deletion rollback, the real role-confirmation
service, MFA/session/proof revocation, inheritance/overrides and directory privacy.
Import and inventory history now explicitly keep their original three-section
requirements. A development run caught a removed history import; its correction
and the complete-admin-history regression are included in the passing selection.
Final candidate backend CI, documentation, source-pin and hosted-check outcomes
are recorded in the Batch 3.1 PR. No browser/Docker/Azure setup or deployment was
performed locally; the unchanged interface does not require a new visual approval.

Stop for product-owner review after the final PR. No later batch, merge, release,
Docker publication or deployment is authorised.

## Stage 2 Raspberry Pi Acceptance Corrections

Baseline `bda35d73398820f49c8c1cf0647aa1c8c92bbf2e`; branch `stage-2-pi-acceptance-corrections`. The [owner approved four corrections](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6874767163) after twelve native Pi/Safari tests. This is a new acceptance correction batch, not Stage 3 or repeated Stage 2 implementation.

The real browser reproduced all four findings before the patch: false missing Rack/Shelf/IPAM Dashboard warnings, an inline-only Device error with no visible toast, Edit Rack selection retaining the old Location and misleading inaccessible-shelf wording. The initial patch corrects those paths, keeps existing form components and changes no backend/schema/permission or pinned design source.

Intermediate local checks: 97 focused Python tests passed without failures/skips. The focused Chromium matrix passed feature/read combinations and genuine warnings, Rack/Shelf/manual Location changes, Cancel/data preservation, inaccessible versus missing shelf wording and native Start U error focus/paint order. The expanded run also passed native Subnet/Rack/nested Rack/Users/Role/Settings forms and application password-mismatch feedback. A first test incorrectly tried to fill a select; it was corrected to select its blank option. Broader regression and final visual/CI evidence remain pending. WebKit was downloaded once but cannot start without missing host libraries; no system dependency retry was made. Native Safari is not certified by these checks.

### Final Correction Verification

The first checkpoint was committed/pushed as `2006f84cc1c73d6a8c2862cbf5f4cf3adcf62f99`; [draft PR #376](https://github.com/Caffoot/Caffoot-Lite/pull/376) targets `milestone-1`. The focused correction passed in all three hosted browser engines; full Firefox/WebKit, backend and Compose jobs passed at that checkpoint. The wider Chromium run found a prior #332 Edit Location expectation superseded by the new approval. Both relevant old Edit expectations now follow the explicit Rack default; the diagnostic wrapper forwards explicit selection intent. Opening, manual override, Duplicate and Cancel checks remain.

Final local evidence includes **98 distinct focused Python passes**, no failures/skips in those selections, the real correction browser flow and all four Rack Location/seven Device follow-up groups. The browser checks invalid Subnet/Rack/nested Rack/Users/Role/Settings forms, application password mismatch, native Start U focus/inline/toast paint and a successful Notes-only save retaining Location/placement. One native-control test setup and one asynchronous Settings-loading race were corrected. Seventeen fresh desktop/mobile light/dark images and the baseline observations are in the [correction report](evidence/stage-2-pi-corrections/Report.md).

Error notifications now suppress competing native bubbles, retain accessible inline feedback and use one existing toast above modal layers. No additional validation rule, backend, schema, grant, data repair or design-source change. Template-boundary checks and all twelve source hashes pass. The Function Index and code reference are updated. Final-head CI results and remaining skips are recorded in the PR after the final push; no final acceptance is implied by an intermediate pass. Local WebKit lacked host libraries, and the incomplete local Firefox attempt is not counted as a pass; hosted engine evidence is separate from native Pi/Safari. No repeated environment setup or unrelated Azure work.

See [implementation notes](../development-guide/Pi-Acceptance-Corrections.md). Stop for product-owner review; no merge, tag, release, website change or deployment.

## Stage 2 Batch 5 — Final Integration Verification

Verified `milestone-1` baseline `8192bb4438a1615f3b3c640d59deff2dfdde07be`; published `main` remains `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a`. Branch: `stage-2-batch-5-final-verification`. Scope follows the [approved contract](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821230015), [verified Batch 4 merge](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6873486389) and the owner's explicit verification-only instruction. No application implementation changes are authorised in this batch.

Initial verification checkpoint: **236 focused Python tests passed**, with no failures or skips. The four affected persistence/import checks also passed after adding HTTP import assertions for feature/grant retention and renaming one test for clarity. New file-backed tests cover close/reopen and SQLite database-copy restoration, basic addresses without automatic linking, grants retained across feature toggles, inventory replacement and Clean Start without mocked permission decisions. One initial test callback omitted its connection argument; the test setup was corrected before the passing runs. This was not an application defect.

The existing feature-combination Chromium test passed all eight combinations, essential all-off administration/My Account and deep-link denial without page errors. The Batch 4 final-feature CI jobs were independently checked as successful: backend, Chromium, Firefox, WebKit, Compose lifecycle, release documentation and Git history scan. Those results apply to `ab51bb194adccbc69f134f4412073008528595f7`; the merged baseline differs from the earlier reviewed Batch 4 checkpoint only in its first-run browser test.

The first checkpoint was committed and pushed as `46cf108169c78f7bd8cc01f11d541d282b3d5e85` before final visual review.

### Batch 5 Final Local Verification

All three existing focused Chromium flows passed: `feature-access.cjs`, `optional-ip.cjs` and `optional-features-interface.cjs`. They cover feature combinations and essential paths, no-IP/basic addresses, Rack-off mounted/shelf saves, type-specific choices, confirmation/cancellation, count permissions and no-subnet/cancel/stale/successful linking. No page errors were reported. The interface flow generated 34 new desktop/mobile source/light/dark captures, checked modal focus and found no checked horizontal document overflow.

The [final verification report](evidence/stage-2-batch-5/Report.md) includes the exact commands, Python/browser logs, coverage matrix, screenshots, source comparisons, measurements and CI references. All twelve pinned HTML hashes were verified; the three existing Settings panels and relevant CSS remain unchanged. Settings geometry matches the pinned source in both themes at 1440 and 390 pixels. Narrow mobile feature descriptions wrap within the existing card layout; the captures preserve this for owner appearance review. Python compilation, JavaScript syntax, links, whitespace and unchanged runtime/design boundaries passed.

[Draft PR #375](https://github.com/Caffoot/Caffoot-Lite/pull/375) targets `milestone-1`. The existing path-selected CI runs automatically; results for the final evidence commit are recorded in that PR. Broader browser/Firefox/WebKit/Compose evidence is the independently verified Batch 4 CI, not new local runs. No whole-suite local run, automated accessibility audit, local Docker/Azure, private-data or deployed-volume restoration was attempted. Full backup/restore and wider legacy compatibility remain Stage 6; the new database-copy test does not certify deployed-volume restoration.

No material application defect or contract conflict was found, and no implementation change was made. Stage 2 is ready to present for final product-owner acceptance once applicable PR checks pass. Owner visual approval and final acceptance remain outstanding. Stop after Batch 5; no Stage 3, merge, tag, release or deployment.

## Stage 2 Batch 4 — Interface And Rack Preservation

Starts from verified merge `89ad05eab13f7a429dcbd5f4266a26e52f5de8d2` on `stage-2-batch-4-interface-rack-preservation`, following the [approved contract](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821230015) and [Batch 4 handover](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6863207632). Published `main` remains unchanged.

The first implementation adds locked omission-merging for hidden Rack placement, shelf and original Location fields; explicit changes are refused while Racks is off. New placements are blocked, while type-specific non-Rack choices remain. The existing Settings screen gains its fourth Optional Features tab using its own cards/toggles and secured API, with confirmation on disable and inactive future cards. The existing IPAM statistic component shows the authorised saved-data outside-subnet count. The Device Details Network context gains a Link action and chooser using existing Device dialog components and the Batch 3 backend.

Initial focused selection passed 100 tests; the expanded omission/shelf/count/permission/modular selection passed 20 tests. One Batch 2 expectation that omission must be rejected was replaced by the newly approved merge behaviour, with explicit forgery checks retained. A new count test fixture required its setup transaction to commit before account creation; it was corrected before the 20 passing checks. Browser behaviour and source comparisons are pending at this intermediate checkpoint; no visual acceptance is claimed.

### Batch 4 Final Review Checkpoint

Intermediate checkpoint `32160a5` was committed and pushed before browser verification. The completed browser flow also exposed two integration issues: an unchanged blank-IP reservation flag could require IPAM Edit on a no-IP shelf Device, and the existing generic submit guard disabled the new Link form. The save now retains the saved flag when IPAM is read-only, blank-to-blank saves need only Devices Edit, and the Link form is allowed only with both effective Edit permissions. Focused backend tests and the real browser flow cover the corrections.

- The final focused Python selection passed **145 tests**, with no failures or skips: `test_racks_off_preservation`, `test_feature_access`, `test_feature_settings_http`, `test_optional_ip_http`, `test_reserved_device_saves`, `test_rack_shelf_associations`, `test_modular_interface`, `test_optional_device_addresses`, `test_collection_saves`, `test_settings_saves` and `test_optional_features_visual_boundary`. This includes omitted-field merging, exact null/absent-field preservation, forged changes, all feature combinations, real API security, count disclosure, existing linking atomicity/conflicts and unchanged Settings/design boundaries.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/optional-features-interface.cjs` passed against local HTTPS and fictional SQLite data. It checks confirmation including empty inventories, cancellation, all-off administration, Device-only mounted/shelf saves, non-Rack choices, count permissions, no-subnet guidance, stale/cancel/success linking, modal keyboard focus and enabled-Rack/Rack-only boundaries. No browser page errors or checked document overflow were found.
- [Visual evidence and comparison limits](evidence/stage-2-batch-4/Report.md) include 34 desktop/mobile captures: six relevant pinned-source views and 28 light/dark application views. The existing Settings panels/buttons, relevant CSS and all twelve design pins are unchanged. Source/application Settings geometry matches at 1440 and 390 pixels. This is a focused visual comparison, not owner acceptance or full milestone visual certification.
- Python compilation, JavaScript syntax, Function Index declarations, changed Markdown links and whitespace were checked before the final push. No whole suite, wider existing browser suite, Firefox/WebKit, automated accessibility audit, Docker/Azure, private-data or deployed restore check was run. Final-head hosted CI remains outstanding; Batch 5 integrated acceptance is not claimed.

Batch 4 is implemented for product-owner review with no known implementation blocker. Existing data, grants and Batch 3 backend linking authority are preserved. No schema, stylesheet or pinned design source changes are included.

Stop after Batch 4 for owner review. No Batch 5, merge, release or deployment.

## Stage 2 Batch 3 — Optional Addresses And Explicit IPAM Linking

Verified baseline: `milestone-1` merge `339ed5f1d7f7415e126553ad06a89411d34cc0f9`, following the [approved contract](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821230015) and [merge handover](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6862456347). Branch: `stage-2-batch-3-optional-ip-linking`.

Initial backend checkpoint: no-IP Device creation requires Devices Edit only. Basic addresses use `primaryIpMode: "basic"` in the existing Device JSON; existing unmarked addresses retain their managed meaning. Basic values bypass only the subnet/allocation requirements of live validation. Published v1.3.3 import validation still rejects the marker and does not gain that exemption. Basic addresses are excluded from automatic allocation reconciliation and repair. Managed allocations remain unchanged while IPAM is disabled.

The explicit session-bound `POST /api/devices/ipam/link` operation requires effective Devices Edit and IPAM Edit, an unchanged basic address/revision, no active Device edit, a suitable existing network subnet and conflict checks. Device, allocation, revision and audit commit together. Cancellation sends no request; there is no automatic linking or new subnet creation.

At this intermediate checkpoint, 11 new backend tests and 74 existing Device/integrity/reconciliation tests passed. The first existing run found one mocked-permission boundary missing at the caller; it was restored and all 74 passed. Device form integration, HTTP and broader focused regressions remain pending. No visible Link control, IPAM card, Optional Features tab or Rack form changes are included. Stop after Batch 3 for review; no merge/release/deployment is authorised.

### Batch 3 Final Review Checkpoint

Backend checkpoint `c2d98d1` was committed and pushed after the first 85 passing tests. The completed batch also adapts the existing Device form: blank IP is allowed, the same IPv4 input serves basic addresses when appropriate, managed controls are hidden while unavailable, and existing managed references remain read-only. Layout, stylesheets and pinned HTML are unchanged. No Batch 4 control/card/tab or Rack form work is included.

Saved basic mode survives clearing and re-entry after IPAM is enabled; ordinary edits cannot turn it into managed mode. Both backend and existing client repair/reconciliation paths exclude basic addresses. Subnet changes/deletion do not detach unlinked basic addresses. Existing managed interpretation and strict v1.3.3 import checks remain intact. The Link operation additionally handles numeric address aliases, protected gateways and Device edit reservations; safe missing-subnet guidance remains available when Racks is off.

Focused evidence (fictional temporary data only):

- The initial Device/integrity/reconciliation selection passed **74** tests after restoring the mocked managed-IP permission boundary at the writer.
- The Device/IPAM/feature/subnet selection passed **84** tests. A further **157**-test legacy/import/data regression initially found the old no-IP shelf fixture still expected IPAM Edit, producing a failure and a subsequent duplicate-ID error in that same fixture. Its corrected contract retains Devices/Racks requirements while allowing a no-IP save without IPAM Edit. The affected security/Device/shelf/session selection then passed **68** tests.
- Final new address/API selection: `PYTHONPATH=tests:. python -m unittest test_optional_device_addresses test_optional_ip_http -v` passed **20** tests, including no-IP Devices Edit only, basic creation/edit/toggle/restart, marker persistence, duplicate/alias/gateway/reservation checks, managed reference protection, strict import rejection, non-administrator linking, both feature/grant checks, session/MFA/Origin/CSRF, input shape/duplicate-field/size checks, stale revisions, replay, cancellation/no GET side effect, edit reservations, real SQLite lock-wait revocation and audit-failure rollback.
- Across the recorded focused runs, **268 distinct Python tests passed**; **one test was skipped**: the opt-in isolated two-image restore rehearsal (`CAFFOOT_UPGRADE_RESTORE=1`). No whole-suite run was made and no outstanding failure remains in these selections.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/optional-ip.cjs` passed: a Devices-only editor creates no-IP Devices with IPAM on/off, enters basic IPv4 without a subnet, edits it after enablement, and retains no allocations. Adding a matching subnet does not infer an assigned count or repair; next-available avoids the basic address. The initial browser assertion expected the closed modal DOM to be removed; it now checks the existing hidden-modal lifecycle and passed. No browser infrastructure change was required.
- Compilation, JavaScript syntax, changed guide links, regenerated backend/application Function Index locations and whitespace are checked before the final push. The source diff preserves schema 13, stored role policy, pinned HTML/CSS and all twelve design sources.

Ready for Batch 3 product-owner review with no known implementation blocker. Final-head CI, whole-suite/wider browser and full visual acceptance, Docker/two-image/deployed/private-data restore checks were not run or claimed. The visible Link control, IPAM Overview count, Optional Features tab and Rack preservation/form work remain Batch 4. No Batch 4, merge, release or deployment is authorised.

## Stage 2 Batch 2 — Feature Permissions And Security

Starts from verified Batch 1 merge `1541916e1720da51a1757c6831daae37d775bd24` on branch `stage-2-batch-2-feature-permissions`, following the [corrected owner handover](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6861557679). No change to `main` or `milestone-1` is authorised.

The shared gate now combines enabled feature state with existing RBAC/account/MFA rules. Writers recheck after their lock; cross-feature operations cannot remove hidden relationships. Read snapshots, history (including administrator history), device-catalogue settings and IPAM Device-derived names are filtered. Existing administrator essentials and My Account remain available. Saved grants and authoritative inventory/history stay intact; no schema or feature-settings reseeding is added. Existing security/navigation logic changes only; pinned HTML/CSS, Optional Features UI, basic IPs, linking and Rack form integration remain untouched.

Initial focused checks: 142 tests passed across feature combinations, HTTP denial, unchanged role rules, real SQLite feature-revocation contention, device/IPAM/Rack writes, import/reset, history and Batch 1 settings. The first eight-test run exposed an incorrect reset request fixture and an unchanged-allocation rewrite; both were corrected before the passing run. The latter now avoids any write to an unchanged hidden allocation. Existing inventory test fixtures explicitly enable the three implemented features; production fresh-install defaults stay all off. Checkpoint `03bfa81` was committed and pushed after that run; it was an intermediate review checkpoint.

Final focused evidence:

- The affected-file rerun `PYTHONPATH=tests:. python -m unittest test_feature_access test_role_policy test_session_http -v` passed 43 tests. It includes 11 new feature-access checks, all eight feature combinations, all-off administrator essentials, ordinary-user boundaries, hidden relationship preservation/forgery rejection, error redaction, every affected writer's post-lock check and real lock contention. An earlier 49-test security regression exposed enabled-feature fixture assumptions, a speculative future-section assertion and the established empty revision-map response contract. Fixtures now enable inventory explicitly, hypothetical role grants remain separate from implemented feature availability, and the empty revision map remains compatible. All affected tests passed on rerun; the other security regressions had already passed.
- `PYTHONPATH=tests:. python -m unittest test_account_security test_request_auth test_rack_shelf_associations test_subnet_first test_import_drafts test_required_mfa_http -v` passed 67 tests after their existing-inventory fixtures were made explicit. Across the recorded focused runs, **261 distinct Python tests have passed**, with no outstanding failure or skip in those selections. No whole-suite run was made.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/feature-access.cjs` passed the eight feature combinations, hidden section navigation, all-off Settings/Users/My Account, filtered state and a denied Devices deep link, with no page errors. Earlier browser assertions were corrected to use the real current-tab variable, wait for asynchronous navigation and distinguish a fragment navigation from a reload; one immediate reload also encountered `ERR_TOO_MANY_RETRIES`. The final test uses a fresh page per combination and passed without changing browser infrastructure.
- Compilation, JavaScript syntax, changed guide links, regenerated backend/JavaScript Function Index links, whitespace and the source diff are checked before the final push. Existing browser/visual fixtures now explicitly enable inventory for their historical enabled-installation scenarios; those wider browser suites were not run. No Azure, Docker, private-data, deployed restore or full visual acceptance run was attempted.

Batch 2 is ready for product-owner review, with no known implementation blocker. It is still an intermediate Stage 2 build. The later basic-IP/Link workflow, omitted Rack-field merge/form integration and three approved interface additions remain unimplemented; no final Stage 2, merge or deployment acceptance is claimed.

See [Optional Features](../development-guide/Optional-Features.md) for storage/API/security behaviour and remaining integration limits. Stop after Batch 2 for owner review. No merge, release or deployment.

## Stage 2 Batch 1 — Optional Features Foundation

Authorised by the owner's 13 November 2026 instruction, following the [approved technical contract](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821230015). Branch `stage-2-batch-1-optional-features` starts at `milestone-1` commit `d0e23deafc9267afaf1769d219b4eddce5c246bf`; verified `main` remains `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a`, with documentation-only differences at the start.

- Schema 13 stores organisation feature booleans separately from inventory settings. New databases start all off; existing installations, including empty inventories, retain Devices/IPAM/Racks on with future features off.
- The administrator-only GET/POST API validates session, MFA, Origin, CSRF and inputs, requires disable acknowledgement, rechecks identity after the write lock, and audits real transitions atomically. Suppliers and Lifecycle cannot be activated.
- Existing records, roles and grants are unchanged. Focused tests verify imports, Clean Start and SQLite backup/reinitialisation retain choices.
- First committed/pushed checkpoint: `744324c` (abbreviated; final exact commit is reported at hand-off). Initial checks passed 10 new migration/service tests, five new HTTP tests and three existing schema tests.
- Final focused evidence: `PYTHONPATH=tests:. python -m unittest test_feature_settings test_feature_settings_http test_schema test_role_migration test_builtin_roles test_inventory test_import_boundary test_reset_inventory test_request_auth test_sessions -v` ran 94 tests: 93 passed and one old schema-version assertion failed because it expected schema 12. Its expectation now follows the current schema version; its legacy grant checks remain intact. The affected files were rerun with `PYTHONPATH=tests:. python -m unittest test_builtin_roles test_feature_settings test_feature_settings_http -v`: all 26 passed, including all 16 new feature-settings checks. Across these focused runs, all 94 distinct tests have passed; no outstanding failures or skips.
- Real SQLite lock-wait checks cover session deletion/expiry and administrator deactivation, demotion and MFA removal. Waiting changes fail without a setting or audit write. Duplicate JSON fields are rejected. Compilation of backend/new tests, changed documentation links, backend Function Index declaration locations and `git diff --check` passed.
- Batch 1 is implemented for product-owner review with no known blocker. No owner acceptance or later-batch completion is claimed.

See [Optional Features](../development-guide/Optional-Features.md) for the API and storage contract. **Saved choices do not yet enforce feature access:** effective permission guards/projections are Batch 2. Optional/basic IPs, linking, rack preservation and all UI additions remain later batches. No interface or pinned design source is changed. Whole-suite, browser, Docker, private-data and deployed restore checks have not been run for this backend-only batch. Stop after Batch 1 for owner review; no merge, release or deployment is authorised.

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
