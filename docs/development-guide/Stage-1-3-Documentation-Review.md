# Stage 1–3 Documentation Review — Draft v2.2

## Scope And Source Checkpoint

This documentation-only continuation was prepared on 17 November 2026 for independent review under [#366](https://github.com/Caffoot/Caffoot-Lite/issues/366). The verified remote `milestone-1` HEAD was **`753b3266893987addb11406ef8303adb03c3c112`**, matching the supplied starting checkpoint. The documentation branch is `docs/stage-1-3-comprehensive-guides`; its draft PR targets `milestone-1`.

The source is schema 20. Stage 1 and Stage 2 are accepted; Stage 3 Batches 3.1–3.12 and subsequent focused corrections are integrated. [Development Status](Development-Status.md) records merge checkpoints without treating integration as completed manual or release acceptance. The [draft user index](../how-tos/features-and-instructions/v2.2-draft/README.md) remains separate from published v2.1 instructions.

## Authoritative References

The review used original owner decisions and subsequent amendments, existing technical contracts and the implementation at the verified HEAD. Earlier proposals were read as dated history where later approval superseded them. This was a workflow/documentation comparison, not a repeated application or security audit.

| Reference | Documentation Use |
| --- | --- |
| [AGENTS.md](../../AGENTS.md), [CONTRIBUTING.md](../../CONTRIBUTING.md), [naming conventions](06-Coding-and-Naming-Conventions.md) | Authorised scope, British English, exact controls, compatibility and delivery boundaries |
| [#351](https://github.com/Caffoot/Caffoot-Lite/issues/351), [#366](https://github.com/Caffoot/Caffoot-Lite/issues/366), [#368](https://github.com/Caffoot/Caffoot-Lite/issues/368) | Reading order, source-faithful Stage 1–3 scope, documentation and version boundaries |
| [#350](https://github.com/Caffoot/Caffoot-Lite/issues/350), [#365](https://github.com/Caffoot/Caffoot-Lite/issues/365), [Role Permissions](Role-Permissions.md) | Staff Member baseline, IT Staff, shared-role inheritance/overrides, preview/confirmation, MFA, administrator and session safeguards |
| [#238](https://github.com/Caffoot/Caffoot-Lite/issues/238), [Optional Features](Optional-Features.md) | Independent feature/permission gates, basic IPv4, explicit linking and Rack preservation |
| [#232](https://github.com/Caffoot/Caffoot-Lite/issues/232), [Staff APIs](Staff-Directory-APIs.md), [Device Assignments](Device-Assignments.md) | Staff/Department lifecycle, linked accounts, individual/shared holders and restricted My Equipment |
| [#352](https://github.com/Caffoot/Caffoot-Lite/issues/352), [#292](https://github.com/Caffoot/Caffoot-Lite/issues/292) | Receipts, stock, returns, readiness, canonical Devices, associations and attributed history |
| [Stock Intake](IT-Assets-Stock-Intake.md), [Stock Circulation](IT-Assets-Issue-Return-and-Write-Off.md), [Device Registration](Device-Stock-Registration-and-Reissue.md) | Exact stock controls, registration/reissue accounting and ordinary save validation |
| [Associated Equipment](Associated-Equipment.md), [direct-handover decision](Direct-Handover-Decision.md), [Correct Movement](IT-Assets-Correct-Movement.md) | Explicit links, missing accessories, checked handover, original history and chronological correction constraints |
| [#396](https://github.com/Caffoot/Caffoot-Lite/issues/396), [Dashboard contract](IT-Assets-Dashboard.md), [PR #398](https://github.com/Caffoot/Caffoot-Lite/pull/398) | Complete permitted aggregates, protected Device details, schema-20 IT Staff defaults, current Overview terminology and per-item warnings |
| [#400](https://github.com/Caffoot/Caffoot-Lite/issues/400), [PR #406](https://github.com/Caffoot/Caffoot-Lite/pull/406) | Existing sign-in destination and session-ended feedback; no promise to recover unsaved work |

The comparison included the current `backend/` permission, account, feature, Staff, assignment, stock/circulation, Device-stock, association, correction and reporting modules; `interface/` navigation, screen fragments and feature controllers; published/draft guides; approved capture records; and existing development evidence. Application tests were consulted as supporting behaviour references, not rerun for prose changes.

## Guides And Entry Points

All twelve existing files in `docs/how-tos/features-and-instructions/v2.2-draft/` are expanded in place: the index plus Roles/Permissions/MFA, Optional Features/IPAM linking, Staff Members, Departments, Device Assignments/My Equipment, Stock Intake, Issue/Return/Write Off, Device Registration/Reissue, Associated Equipment, Correct Movement and IT Assets Overview. They add prerequisites, exact navigation, numbered procedures, explanations of fields and statuses, fictional worked examples, save/cancel/rejection outcomes, permissions/privacy and troubleshooting. Related workflows cross-link rather than introduce a second feature guide.

Current summaries are corrected in root `README.md`, `ROADMAP.md` and the release/next-work paragraph of `AGENTS.md`; Development Guide `README.md`, `Development-Status.md`, `04-Authentication-and-Permissions.md`, `Role-Permissions.md` and `Optional-Features.md`; and both active-handover entry points. This review record is the only new maintained document. Existing detailed evidence remains dated history, including its original incomplete-test and pending-review statements.

## Screenshot Provenance And Acceptance

Use only genuine application captures whose relevant approval can be identified. Images are inspected before reuse and captions identify the feature/state they illustrate. The accepted functional HTML previews remain design references, not application screenshots. No image is generated, recaptured, edited, replaced or removed in this documentation task.

| Existing Capture Set | Approval Or Limitation |
| --- | --- |
| Published v2.1 screenshots | [Approval/provenance](../screenshots/v2.1-review/README.md); retained in both published guide paths without alteration |
| Stock intake | [PR #388 owner approval](https://github.com/Caffoot/Caffoot-Lite/pull/388#issuecomment-6899646571); reuse only where the captured controls still describe the current operation |
| Circulation and Staff/Department/My Equipment | [PR #389 owner approval](https://github.com/Caffoot/Caffoot-Lite/pull/389#issuecomment-6908629303); earlier captures do not illustrate later confirmation or refresh controls |
| Device registration/reissue | [Accepted merged checkpoint](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6912071679); preserve changed-screen provenance and existing identity/accounting scope |
| Correct Movement | [Original approved captures retained byte-for-byte](../development-handovers/evidence/stock-corrections/return-equipment/Report.md); later Return Equipment integration images still need separate acceptance |
| IT Assets Overview | [Owner approval of all four captures](https://github.com/Caffoot/Caffoot-Lite/pull/398#issuecomment-6929275962); later reporting/test changes do not establish new screenshot evidence |
| Optional Features foundation | Earlier approved image contains superseded wording that stock operations are unavailable; retain as history rather than present it as the current screen |

Documentation acceptance still needs suitable approved, current images for Optional Features/basic-IP linking; the complete current account/role/MFA journey where older evidence no longer matches; later Issue Equipment confirmation; stale Staff refresh; and session-ended feedback. Existing private Pi screenshots require separate public-use review. A developer-inspected capture or a file promised in an Actions artifact is not silently treated as owner-approved publication evidence. Initial Device allocation and Associated Equipment/direct-handover illustrations also need verified current publication approval; the final association gallery records agent inspection separately from owner acceptance. Earlier approved correction images retain their original scope, while later Return Equipment integration captures remain separate acceptance items. Refreshing receipt/registration illustrations to include current navigation and Cancel labels would improve presentation; reused images explicitly caption those historical differences.

## Wording Discrepancies And Deferred Acceptance

Two current application hints conflict with the implemented workflows:

- [`interface/staff-directory.js`](../../interface/staff-directory.js) still says that returns are not yet available. Return Equipment is implemented; the guides explain the actual permitted return routes.
- [`interface/stock-intake.js`](../../interface/stock-intake.js) still says Low Stock warnings are unavailable in one readiness/detail hint. Stock Inventory and Overview implement the per-item warnings; the guides explain those controls and the Ready-based threshold.

These are application-copy acceptance items, not permission to change the application in this PR. No new stock rule or workflow is inferred from them. The older planning label **Dashboard** versus the implemented **Overview** is resolved by the later [owner-approved Overview record](https://github.com/Caffoot/Caffoot-Lite/pull/398#issuecomment-6931030910); guides use **Overview**. Historical IT Staff migration proposals are superseded by accepted access-preserving decisions and schema-20 behaviour.

Batch 3.4 manual/native acceptance, broader native Safari/private-installation evidence, private legacy-export compatibility and completed-milestone full upgrade/restore remain deferred. Suppliers, Service Desk and Stages 4–6 are separate. This documentation review does not establish a published v2.2 image, production upgrade procedure or release acceptance.

## Verification And Protected Files

The following focused documentation checks completed successfully:

- The exact Python consistency check embedded in `.github/workflows/release-documentation.yml` passed, including current release documents, historical Portainer/release-note agreement and all eight byte-identical legacy/official guide pairs.
- All 23 changed Markdown files passed local-target and Markdown-anchor checks: 410 local link/image references, including 11 image references and 22 Markdown anchors. Image descriptions are non-empty. Seven draft-guide image embeds were inspected for relevant controls and approval/caption scope; the other four references are unchanged README illustrations.
- The final changed-file scope and protected-file comparison passed: only the authorised 23 Markdown files changed; all 16 published guide files remain byte-identical to the integration baseline, along with protected application, evidence, screenshot and release files.
- Workflow/UI wording, worked stock balances, permissions/privacy, naming and British English were reviewed against the linked decisions and current source. Small navigation/checkbox-label corrections were applied during review. No material unresolved product-rule contradiction was found; the two stale application hints above remain explicitly recorded.
- `git diff --check` passed.

No unrelated backend, Docker, browser, native Safari or private-installation suite was run for these documentation-only edits. GitHub Actions were not polled or awaited. Independent ChatGPT review and product-owner approval of this PR remain outstanding. Existing application test results in linked evidence retain their original revision and limitations; they are not results of this documentation task.

The eight official/legacy published guide pairs, `INSTALLATION.md`, historical evidence, approved screenshot bytes, source code, database/schema, tests, interface, Docker configuration, release workflows and Function Index are deliberately preserved. No functions change, so regenerating the Function Index is unnecessary. The temporary private security fork and advisory are not accessed or altered; this record introduces no advisory detail. No merge, release, website publication or deployment is performed.

The delivery boundary is one pushed documentation branch and one **draft PR against `milestone-1`**, followed by independent ChatGPT review and explicit product-owner approval before any merge.
