# GitHub issue migration register

**Status:** Mapping in progress. v1.3.1 issues #91 to #95, v1.3.2 issues #96 to #99 and v1.3.3 issues #100 to #103 created; cross release issues #104 and #105 created; release approval issues #106 to #109 created. All release-specific issues assigned to GitHub milestones #1 to #4; central Project board created with 19 issues imported and seven workflow stages configured; public visibility shown by GitHub globe icon; permissions confirmed in GitHub: public visibility, organisation base role Read, product owner Admin. **Date:** 24 October 2026. **Published baseline:** v1.3.0.

## Rules

This register is a proposed GitHub planning index derived from the [central findings programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md), not a replacement for it. The release allocations are provisional. Keep original M identifiers, finding dispositions, browser evidence, historical decisions and test IDs. A merged correction is not a published release. M-030 is a mandatory gate for every release. Issue #104 tracks establishing and verifying the permanent gate and can close after approved evidence of that setup; each release must still independently complete its own documentation checks through [v1.3.1 #106](https://github.com/Caffoot/Caffoot-Lite/issues/106), [v1.3.2 #107](https://github.com/Caffoot/Caffoot-Lite/issues/107), [v1.3.3 #108](https://github.com/Caffoot/Caffoot-Lite/issues/108) and [v1.4.0 #109](https://github.com/Caffoot/Caffoot-Lite/issues/109). Do not convert closed M-021 into new implementation work.

Before creating a GitHub issue, check whether an existing issue or PR already represents it. Earlier inventory described #50 as an issue; live verification confirmed #50 is a draft pull request. PR #90 is also a draft pull request. The product owner created milestones v1.3.1 through v1.4.0 with numbers #1 through #4, confirmed their numbering, and GitHub accepted issue assignments. The Project board remains unverified.

## Proposed v1.3.1 inventory integrity issues

| Candidate issue group | Findings | Scope and preservation requirement |
| --- | --- | --- |
| [Host relationships and hypervisor eligibility, issue #91](https://github.com/Caffoot/Caffoot-Lite/issues/91) | M-005 | Explicit host dependant review, safe reassignment or unassignment with provenance or retirement, backup compatibility, save rollback, Chromium evidence; no silent deletion |
| [IP ownership and gateways, issue #92](https://github.com/Caffoot/Caffoot-Lite/issues/92) | M-006, M-009, M-024 | Correct ownership, reservations and gateway behaviour, including imported inventories |
| [Rack and accessory import integrity, issue #93](https://github.com/Caffoot/Caffoot-Lite/issues/93) | M-010, M-019 | Shared rack occupancy policy and imported fixture compatibility |
| [Save and startup recovery, issue #94](https://github.com/Caffoot/Caffoot-Lite/issues/94) | M-004, M-017, M-022 | Preserve prior inventory and recovery options on failed saves or invalid startup state |
| [Carry merged fixes into release acceptance, issue #95](https://github.com/Caffoot/Caffoot-Lite/issues/95) | M-001, M-011, M-012, M-018, M-020, M-031 | Verify exact release package and existing targeted evidence; do not reopen corrected source findings automatically |

## Proposed v1.3.2 usability and editing issues

| Candidate issue group | Findings | Scope |
| --- | --- | --- |
| [Device type conversions and preservation, issue #96](https://github.com/Caffoot/Caffoot-Lite/issues/96) | M-008 | Historical and custom values, software and server service compatibility, cancelled conversion |
| [Rack, accessories and device details, issue #97](https://github.com/Caffoot/Caffoot-Lite/issues/97) | M-002, M-013, M-028 | Retained mounting fields, occupancy reporting and archived selections |
| [Recovery and startup explanations, issue #98](https://github.com/Caffoot/Caffoot-Lite/issues/98) | M-014, M-015 | Explain existing protections and automatic normalisation |
| [Editing and backup interface consistency, issue #99](https://github.com/Caffoot/Caffoot-Lite/issues/99) | M-023, M-025, M-026, M-027 | Consistent controls, safe return to editing, user facing clarity |

## Proposed v1.3.3 clarity and closeout issues

| Candidate issue group | Findings | Scope |
| --- | --- | --- |
| [Save and local history guarantees, issue #100](https://github.com/Caffoot/Caffoot-Lite/issues/100) | M-003, M-029 | Define and verify history semantics and resilience |
| [Function and caller clarity, issue #101](https://github.com/Caffoot/Caffoot-Lite/issues/101) | M-007 | Naming, P11 explanatory comments and compatibility of callers |
| [Historical documentation closure, issue #102](https://github.com/Caffoot/Caffoot-Lite/issues/102) | M-016, M-021 | Reconcile already closed or historical evidence without inventing implementation work |
| [Final WF and audit evidence reconciliation, issue #103](https://github.com/Caffoot/Caffoot-Lite/issues/103) | WF-01 to WF-13, P11, P12 | Confirm remaining verification gates and cross references before closeout |

## Cross release and v1.4

| Group | Findings or source | Scope |
| --- | --- | --- |
| [Permanent documentation gate setup, issue #104](https://github.com/Caffoot/Caffoot-Lite/issues/104) | M-030 | Verify and establish the ongoing rule, then close #104 only with approval; separate documentation reconciliation is mandatory for each release |
| [Optional Docker and database architecture, issue #105](https://github.com/Caffoot/Caffoot-Lite/issues/105) | Existing draft [PR #50](https://github.com/Caffoot/Caffoot-Lite/pull/50), [root roadmap](../../ROADMAP.md) | Preserve standalone HTML indefinitely; optional user management and migration; no implementation implied |
| Future optional inventory component links | [v1.3.x design review](V1.3X-MAINTENANCE-DESIGN-REVIEW.md) | One level optional components and connected device links, no mandatory recursive hierarchy |

## Reconciliation

All original M-001 through M-031 identifiers are represented in the candidate groups: M-001 to M-029 and M-031 have one primary allocation, M-030 is cross release. M-021 is retained as a closed evidence item. Existing draft PR #50 is retained as architecture documentation and linked from new development issue #105; it is not an issue. Draft PR #90 remains the existing documentation change surface and must not be mistaken for a release.

GitHub issues [#91](https://github.com/Caffoot/Caffoot-Lite/issues/91) through [#95](https://github.com/Caffoot/Caffoot-Lite/issues/95) track v1.3.1; [#96](https://github.com/Caffoot/Caffoot-Lite/issues/96) through [#99](https://github.com/Caffoot/Caffoot-Lite/issues/99) track proposed v1.3.2 work; [#100](https://github.com/Caffoot/Caffoot-Lite/issues/100) through [#103](https://github.com/Caffoot/Caffoot-Lite/issues/103) track proposed v1.3.3 work. Release specific approval gates [#106](https://github.com/Caffoot/Caffoot-Lite/issues/106), [#107](https://github.com/Caffoot/Caffoot-Lite/issues/107), [#108](https://github.com/Caffoot/Caffoot-Lite/issues/108) and [#109](https://github.com/Caffoot/Caffoot-Lite/issues/109) remain open. Cross release documentation gate [#104](https://github.com/Caffoot/Caffoot-Lite/issues/104) and v1.4 architecture issue [#105](https://github.com/Caffoot/Caffoot-Lite/issues/105) are open. Four milestones were created by the product owner, and release-specific issues have been assigned as follows: milestone #1 v1.3.1 issues #91 to #95 and #106; milestone #2 v1.3.2 issues #96 to #99 and #107; milestone #3 v1.3.3 issues #100 to #103 and #108; milestone #4 v1.4.0 issues #105 and #109. Issue #104 remains unassigned because it is cross release. The product owner confirmed creation of the Caffoot Lite Development Project, import of 19 open issues, and saved board display options; The GitHub screenshot shows public visibility, approved by the product owner; the Project URL remains to be independently verified through the connector; the GitHub Manage access screenshot confirms organisation base role Read and the product owner's Admin access. No new branch is claimed. This mapping does not authorise application changes. Before implementation or publication, verify current GitHub Project and milestone configuration, review proposed issue grouping with the product owner, and reconcile any created items back to this register and the central audit. No browser tests executed for this planning change.

## Project workflow checkpoint, 24 October 2026

The product owner visually verified that the Project automatically includes matching open Caffoot Lite issues, places newly added issues and pull requests into Backlog, and includes sub-issues. These three workflows are enabled. Automatic issue closure, closed item status updates, linked pull request progress and merged pull request completion workflows are disabled, as are the other optional workflows shown in the Project settings. The Project interface showed three enabled workflows. No end to end automation trigger was executed as part of this checkpoint. Issue #104 remains the cross release documentation gate setup item, while #106 to #109 remain release specific approval gates. None of these issues is complete merely because the Project configuration is recorded.

## Milestone assignment verification discrepancy, 24 October 2026

A live GitHub issue read after the Project automation documentation commits returned **no milestone** for sampled issues #91, #96, #100, #105 and release gates #106 to #109; cross release issue #104 also returned no milestone as intended. This conflicts with earlier planning statements that release issue assignments had been accepted. The earlier milestone assignment claim is therefore **not verified as current** and must not be treated as a completed gate. Verify all 18 release specific issue associations through GitHub and correct the status summaries before closing the planning checkpoint. No milestone was changed during this read only verification.

## Milestone repair and board membership checkpoint, 24 October 2026

The product owner's issue #91 screenshot confirmed **No milestone** and **No projects**. The GitHub issue connector also returned empty milestone assignments before repair. Milestones were then explicitly assigned through the authorised issue update action to all 18 release specific issues: #91 to #95 and #106 to milestone #1 (v1.3.1); #96 to #99 and #107 to #2 (v1.3.2); #100 to #103 and #108 to #3 (v1.3.3); #105 and #109 to #4 (v1.4.0). A subsequent live read of every issue #91 to #109 verified these 18 numeric assignments. Cross release #104 correctly has no milestone. **This resolves the milestone discrepancy noted above; the earlier observation remains as historical evidence.**

Project board membership remains **unverified and apparently missing for #91**: the owner's screenshot explicitly showed No projects. The issue connector does not expose a usable current Project association in the returned issue payload, so do not claim all 19 issues are linked to the board. Confirm the board items in the GitHub interface and add missing issues using the approved auto-add workflow or manual import; then verify the resulting associations. No application tests were run and no merge or release was performed.

## Project board screenshot verification, 24 October 2026

The product owner supplied a screenshot of the public **Caffoot Lite Development** GitHub Project board. Its **Backlog** column shows **19 items**, and the visible cards include issues #91 to #95 with v1.3.1 milestone badges. This confirms that the intended set of 19 issues is represented by the board count and that those five named cards are visible. The earlier issue #91 screenshot showed **No projects**, so the issue sidebar and Project board disagree; treat this as an unresolved display or association discrepancy rather than evidence that the board is empty. The screenshot does not independently identify all remaining 14 cards, and a full individual board association audit remains outstanding. Do not reimport the 19 issues based solely on the issue sidebar. The verified milestone assignments remain as recorded in the previous checkpoint. No application tests, merge or release were performed.

## GitHub issue and workflow verification, 24 October 2026

A fresh read of the GitHub REST issue resources confirmed **all 19 issues #91 to #109 remain open**. The **18 release specific issues** have the intended milestones: v1.3.1 (#91 to #95 and #106), v1.3.2 (#96 to #99 and #107), v1.3.3 (#100 to #103 and #108), and v1.4.0 (#105 and #109). Cross release issue **#104 has no milestone by design**. The Project board screenshot displays a Backlog count of 19 and visibly identifies #91 to #95, but individual Project membership for all 19 items has not been independently retrieved. GitHub Actions for documentation branch commit `7273a9306a0d66500dc13798790b4cff025daf4b` reported success for release candidate validation, release documentation consistency, consolidated Chromium regression, and Git history secret scan. These are CI runs, not locally executed tests. The issue sidebar and Project board discrepancy remains an open verification item. No application behaviour was changed, and no merge or release was performed.


## Proposed v1.5.0 to v1.9.0 GitHub planning checkpoint, 24 October 2026

The original proposed scopes in the root roadmap are preserved without reallocation or implementation approval. Planning issues and independent release evidence gates were created as follows:

| Proposed release | Planning issue | Release documentation and evidence gate |
| --- | --- | --- |
| v1.5.0 | [#110](https://github.com/Caffoot/Caffoot-Lite/issues/110) | [#115](https://github.com/Caffoot/Caffoot-Lite/issues/115) |
| v1.6.0 | [#111](https://github.com/Caffoot/Caffoot-Lite/issues/111) | [#116](https://github.com/Caffoot/Caffoot-Lite/issues/116) |
| v1.7.0 | [#112](https://github.com/Caffoot/Caffoot-Lite/issues/112) | [#117](https://github.com/Caffoot/Caffoot-Lite/issues/117) |
| v1.8.0 | [#113](https://github.com/Caffoot/Caffoot-Lite/issues/113) | [#118](https://github.com/Caffoot/Caffoot-Lite/issues/118) |
| v1.9.0 | [#114](https://github.com/Caffoot/Caffoot-Lite/issues/114) | [#119](https://github.com/Caffoot/Caffoot-Lite/issues/119) |

These ten issues were created without milestones because the available GitHub connection cannot create milestones. Create and assign proposed v1.5.0 through v1.9.0 milestones through authorised GitHub access, then verify all ten associations. The existing Project auto add workflow is configured but membership of these ten new issues has not been independently verified. Check the Project board before manually adding any issue to avoid duplicates. The roadmap remains the authoritative scope; v1.8.0 is research and design only, and v1.9.0 is provisional planning. Dependencies, data preservation, standalone HTML compatibility, testing and release approvals remain open. This was GitHub issue and documentation planning only; no application tests, code changes, merge or release.


### Milestone assignment verification, 24 October 2026

The product owner confirmed the creation of GitHub milestones #5 to #9 for proposed releases v1.5.0 to v1.9.0. GitHub then accepted the milestone assignments for all ten new issues: v1.5.0 milestone #5 issues #110 and #115; v1.6.0 milestone #6 issues #111 and #116; v1.7.0 milestone #7 issues #112 and #117; v1.8.0 milestone #8 issues #113 and #118; v1.9.0 milestone #9 issues #114 and #119. Each update response returned the intended numeric milestone. This supersedes the earlier statement that milestone creation and assignment remained outstanding. A separate read back and Project membership check remain to be completed. No application tests were executed; no application code was changed, merged or released.
