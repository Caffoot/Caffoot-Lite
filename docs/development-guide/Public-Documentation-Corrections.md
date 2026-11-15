# Published v2.1 documentation corrections

This record follows the [completed audit](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-6891935516) and [product-owner authorisation](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-6891968612). It continues correction commit `bffa60acfaeb223a720bf42391b0b935d086b2b4`; it does not repeat the repository-wide audit. The product owner subsequently approved all ten screenshot candidates for use in this correction; merge approval remains separate.

Published user instructions are checked against [tagged v2.1 source](https://github.com/Caffoot/Caffoot-Lite/tree/v2.1), not the unreleased code on either working branch. See [Development Status](Development-Status.md) for the exact source checkpoints and schemas. The installation guide, deployment files, original screenshots and historical evidence are preserved. No interface or executable behaviour is changed; two import docstrings are corrected.

## Corrections and remaining work

| Audit finding | Treatment in this correction |
| --- | --- |
| I1 — nine obsolete guide images | All nine published v2.1 captures were visually approved and are now linked from both maintained copies of their guides. Original illustrations remain available at their established paths. |
| I2 — mixed Users rules | Published guide describes direct Devices/IPAM/Racks grants only. Configurable roles and wider-access MFA are explicitly unreleased in developer references. |
| I3 — Edit before MFA | Example grants Read first, enrols through My Account, then grants IPAM Edit. Checked against published `backend/permissions.py` and the account/security controls. |
| I4 — Appearance route | Corrected to My Account → Overview → Personal Preferences → Appearance. Email configuration uses Settings & Data → Email Settings. |
| I5 — README IPAM crop | Replaced the incorrect crop with the approved genuine v2.1 IPAM capture, without browser controls. The original image remains unchanged in the repository. |
| I6 — mandatory/Core Assets | Current direction states independently optional IT Assets and core Staff Members/Departments, with the later #352 amendment linked. Original planning dates and context remain visible. |
| I7 — approved work called unscheduled | Roadmap distinguishes released v2.1, accepted/merged unreleased work, deferred manual acceptance, approved pending stages and later proposals. |
| I8 — version-dependent architecture/permissions | Main at the authorised base really has schema 12; the audit target milestone has schema 15, and published v2.1 has schema 10. Guides distinguish all three instead of replacing version references mechanically. |
| I9 — schema-12 rehearsal | Historical Stage 1 test is pinned to `fcc529f51ccc39f696058abf58f00967515a55e1`, not later milestone HEAD. No new rehearsal was run and no v2.2 production upgrade/rollback is certified. |
| I10 — modular interface status | v2.1 modular UI is identified as published; later own-account/Staff-only entry and role policy are labelled separately. |
| I11 — disconnected import descriptions | `backend/import_service.py` and `backend/inventory.py` now describe the protected live import helper and its transaction. Only docstrings change; declaration locations stay fixed. |
| I12 — development Help & Guides | Deferred to a separate version-aware milestone change with screen review. Published v2.1 Help links and all eight legacy destinations remain supported. No Staff/Department/My Equipment instructions or interface changes are added to v2.1. |

Editorial corrections cover the real feature-request label, actual Rack/Device form controls, current historical-navigation index wording, British English and removal of the published Device guide's development disclaimer. The unclear Device assignment docstring belongs to milestone source, which is not present on this main-based branch. Function Index false entries identified in the earlier milestone review are not imported into main; the existing main index is checked in place, without inventing or renaming definitions.

## Approved published v2.1 screenshots

The product owner visually approved all **ten** genuine v2.1 captures on 15 November 2026: nine guide images and the README IPAM image. They are now referenced from the maintained public guides and README on this correction branch. The [screenshot gallery](../screenshots/v2.1-review/README.md) records source revision, fictional fixtures, capture conditions, captions and hashes. The earlier images are preserved at their original public paths. Approval does not extend to a PR merge or to untested dark/mobile captures.

## Coverage of this correction

| Area | Files reviewed for the authorised corrections |
| --- | --- |
| Public entry points | README.md, ROADMAP.md, INSTALLATION.md, CONTRIBUTING.md, AGENTS.md, SECURITY.md and Community-Participation.md; installation/security/contribution procedures retained |
| Published user help | All eight files in `docs/how-tos/features-and-instructions/` and their eight matching legacy copies; published application Help destinations checked in tagged source |
| Product direction | VISION.md, PROPOSED-MILESTONES.md and FEATURE-BRAINSTORM.md; current operative wording reconciled with #351/#368/#232/#352/#292/#238 and documentation decision #366 |
| Developer chapters | README.md, 01–08, Function-Index.md, Modular-Interface.md, Role-Permissions.md, Account-Recovery.md and Upgrade-And-Restore-Rehearsal.md; unaffected source-reference entries retained |
| Active status/navigation | Development-Status.md, development-handovers/README.md and milestone-01.md; dated checkpoint bodies retained beneath a current summary |
| Historical navigation and evidence | Historical README index corrected; historical release notes, completed handovers, design records and original screenshot bytes retained |
| Source wording | Two demonstrably false import docstrings, checked against protected HTTP callers and transaction implementation; no function or interface changes |
| Approved images | Ten genuine light-theme desktop PNGs, including the README IPAM replacement, visually approved by the owner and linked from current documentation |

The prior comprehensive inventory and image audit remains the coverage authority for unchanged historical material, templates and other public documents. This correction does not claim a new repository-wide security, functional or visual audit.

## Verification record

The following focused checks passed on 15 November 2026:

- The existing `release-documentation` workflow's Python check ran unchanged: published version files and all eight byte-identical guide pairs passed.
- All affected Markdown file targets, local fragments, source-line links and image paths resolved. The pull request records the final reference counts. The initial check found the stale Role Permissions link to the removed unreleased user-guide section; this was corrected and rechecked.
- All 734 Function Index declaration names still occur on their linked lines. No declarations moved, so regeneration was unnecessary.
- Both changed Python files parse and compile. Comparing their syntax trees with the authorised main base after excluding docstrings gives identical executable statements; their line counts are also unchanged. All other runtime and interface files are untouched.
- INSTALLATION.md, Dockerfile, Compose/Portainer files, original image bytes and historical evidence records are byte-identical to the main base. Dated active-handover bodies are retained beneath the added summary. README changes affect only the screenshot caption and development-status paragraph.
- All ten candidate PNGs decode, have matching recorded hashes and come from the exact v2.1 source. The disposable capture database was confirmed at schema 10; no horizontal page overflow or JavaScript page errors were recorded at the captured width. Each PNG was inspected during preparation; the owner subsequently approved all ten captures for documentation use.
- Changed explanations were reviewed for British English, actual released UI wording, accessible image descriptions and clear published/unreleased boundaries. This editorial review is not an automated guarantee of writing quality.
- `git diff --check` passed against the authorised main base.

The capture instance was stopped after use. No broad unit/browser suite, Docker build, upgrade/restore rehearsal, Pi test, release or deployment is required for these textual changes. Existing published recovery evidence remains limited to what the original records actually verified; it is not a new recovery guarantee.

External websites and every historic GitHub fragment are not exhaustively live-checked. Human editorial and product-owner visual review remain necessary even when automated checks pass.

## Review sequence

1. Review the published wording, release/development boundaries and original evidence preservation.
2. Verify the ten approved screenshots are linked from the correct guide/README locations and that both compatibility guide paths remain identical.
3. Review updated documentation links, presentation and automated check results for the final correction commit.
4. Obtain explicit merge approval. Later milestone reconciliation, PR #383, Department Details and Batch 3.5 are separate work.
