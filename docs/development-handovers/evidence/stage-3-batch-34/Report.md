# Device Assignments And My Equipment — Review Evidence

Draft [PR #382](https://github.com/Caffoot/Caffoot-Lite/pull/382) targets
`milestone-1` from the verified `7ec4ac27eddb1f798fdfcf9fff09b761c7bebd86`
baseline. Runtime checkpoint: `d91629bdb308c3012b08e2b3ed724a85d0cfa774`.
The later report commit changes documentation/evidence only.

## Delivered Behaviour

Schema 15 adds one retained allocation relationship referencing existing Device,
Staff and Department IDs. It records dates and responsible actors, protects
current/history relationships from deletion and prevents duplicate allocations.
Multi-Device allocation rechecks sessions, effective Devices Edit, recipients,
Device revisions and edit reservations under one SQLite write transaction.
Current names follow recipient renames; historical labels remain as recorded.

The accepted Staff Details screen gains Assigned Equipment and Assignment
History below its existing profile/login content. The original Device Details
modal gains Assigned To. Both entry points share the same backend operation.
Department holders use that relationship without creating personal copies.

My Equipment has the two approved sections, with current account/Staff and
Department resolution on the server. Employee responses contain only Device ID,
name, type, manufacturer, model and assignment date. They never contain network
settings, private notes, other employees' histories or administration rights.

## Checks Actually Performed

| Check | Actual Result |
| --- | --- |
| Full Python discovery | **698 tests: 694 passed, four skipped**, no failures, 178.758 seconds. |
| Final assignment/HTTP tests after current-name preservation | **17 passed**, 2.114 seconds. Covers schema-14 upgrade/idempotence, canonical IDs, multi-allocation rollback, concurrency, lifecycle eligibility, audit attribution/failure rollback, permissions, private personal/shared views, deletion/reset safety, waiting-write session/MFA/permission revocation, requests/CSRF/Origin and current/historical names. |
| Existing Staff browser test on final runtime | **Passed**: accepted form layout, CRUD, optional login, grouped navigation and Permissions. |
| New assignment browser test | **Passed**: real HTTPS/SQLite multi-allocation from Staff, Department allocation from Device Details, shared history, private Staff-only equipment, membership refresh, light/dark at 1440px and 390px, no document overflow, modal keyboard containment and visible selected Assigned To tab after resizing. |
| JavaScript syntax / Python compilation / whitespace | **Passed** for affected scripts, backend/tests and `git diff --check`. |
| Function Index | **837 definitions**; every indexed declaration points at a source line containing its callable name. |
| Existing Docker Compose lifecycle | **Passed**, 118.615 seconds, using supported `CAFFOOT_BUILD_CA`. Initial attempt failed because Alpine could not trust the environment proxy certificate. No certificate verification was disabled. |
| Final local Docker build and provenance | **Passed**: all 12 changed runtime files match the built image byte-for-byte; schema 15 initialises with no inferred allocation. See `image-provenance.json`. No image was pushed or deployed. |
| Release documentation verifier | **Passed** for published v2.1 consistency; nothing published. |
| Pinned HTML contract | **Failed on the identical pre-existing `.ipam-modal-body` CSS difference on both untouched baseline and feature branch.** IPAM files were not changed. This is not reported as a pass or repaired outside scope. |

The four full-suite skips were the ordinary opt-in Compose lifecycle test (run
separately and passed above), the two genuine-v1.3.3-export tests requiring the
private fixture, and the separate opt-in complete-volume upgrade/restore
rehearsal. The latter three remain unverified here.

The first full backend run had two failures because old preservation assertions
had not accounted for the new empty assignment table. Those assertions now
explicitly verify that it is empty and still compare every original table.
Their focused 23-test run and the subsequent full run passed.

Hosted CI is separate from these local results. No successful hosted run on the
final head is claimed; check the PR's current Checks page.

## Design Compliance Review

The three original archived functional HTML files were read from archive commit
`2dd0f86e008a7018926b6c4b866c7122263bec58`. The original Staff and Assigned To
references were also rendered and visually compared with the live screenshots.
The twelve pinned v2.1 originals were retrieved by the contract check.

`source-preservation.json` verifies that removing only the approved additions
recovers the baseline Staff script, navigation and Device Details markup. The
existing Device Details renderer also matches after removing its new tab entry.
Staff styles, Device Details/Inventory styles, Device Inventory markup and My
Account markup/styles are unchanged. The flat Departments and Add/Edit Staff
renderers/login controls are therefore retained, not reconstructed.

The live Staff assignment table and two-column history rows use the archived
Staff component structure below the accepted Batch 3.3 profile/login cards.
The Device panel uses the current modal's cards, tab strip and footer, with
Current Assignment and Assignment History from its reference. History retains
the original Movement heading, with actor attribution alongside the event.
The existing horizontal-tab helper reveals the selected new tab on mobile.

The live My Equipment view uses existing personal-workspace cards/list rows,
with exactly **Assigned to Me** and **Shared with My Department**, following the
later owner decision. Existing My Account/MFA controls and planned cards remain.
Headings/actions/labels follow Title Case except the owner's exact two section
names. Explanatory text uses sentence case. Light/dark screenshots and responsive
checks cover each new view; keyboard focus remains inside the existing dialog.

The screenshots contain fictional fixture data. They are application test
captures, not replacement designs. Owner visual/functional acceptance, native
Pi/Safari acceptance and comprehensive assistive-technology testing are still
pending. Automated tests and this comparison do not constitute owner acceptance.

## Blocked And Deferred

The archived Assigned To preview excludes its Switch example and explicitly
leaves other Device-type eligibility for separate approval. The current code
therefore enables only its reviewed **Desktop, Laptop and Printer** examples.
Other types are blocked, and the owner has been asked whether all active
physical Device types should be eligible. This is an unresolved scope question,
not a claimed new approved type policy. No broader allocation will be enabled
without the answer.

Return Equipment, reassignment, stock receipts/balances, preparation/Ready,
write-off/correction, Get From Stock, accessories and Service Desk remain
excluded. Existing unassigned Devices never become stock or Ready automatically.
Referenced inventory cannot be deleted, reset or replaced in a way that loses
assignment history. Later workflows need their separately approved operations.

`main` remains `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a`; the permanent archive
remains `2dd0f86e008a7018926b6c4b866c7122263bec58`. Only the authorised feature
branch was pushed. The PR remains draft and unmerged; no deployment/publication.
