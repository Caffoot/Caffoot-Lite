# GitHub planning and contributor handover

**Status:** Four release milestones created and issues assigned; central Project board created with all 19 issues imported and seven workflow stages configured; public visibility shown by GitHub globe icon; permissions confirmed in GitHub: public visibility, organisation base role Read, product owner Admin. **Baseline:** Published v1.3.0. **Recorded:** 24 October 2026.

## Purpose

Make Caffoot Lite's work understandable to the product owner, maintainers and future contributors without replacing or losing existing decisions, audit findings, tests or technical documentation. GitHub is a planning and delivery view, not an independent authority for current application behaviour.

## Agreed structure

Use one GitHub Project for the development programme, with proposed release milestones v1.3.1, v1.3.2, v1.3.3 and v1.4.0. Use one issue per distinct actionable change, investigation or verification deliverable, linking related findings rather than duplicating them. Use focused issue branches and pull requests. Dedicated release branches may be created when release stabilisation genuinely needs them; milestones do not automatically create branches. Keep `main` protected and do not merge, release or change repository protections without explicit product owner approval.

Configured board states: Backlog, Agreed, In Progress, Verification, Documentation Reconciliation, Ready for approval, Done. The product owner confirmed the shared board view was saved on 24 October 2026. All 19 imported issues remain in Backlog; no implementation work has been advanced by this setup. Milestone labels and linked pull requests are enabled as visible card fields. The product owner explicitly approved public Project visibility on 24 October 2026. GitHub Manage access subsequently confirmed public visibility, organisation base role Read with changes saved, and the product owner's individual Admin role. No additional collaborators were displayed. The latest GitHub screenshot shows a globe icon beside the Project name, consistent with public visibility. Public visibility does not grant public editing rights. Additional collaborators may receive higher permissions only when explicitly authorised. Do not move an issue to Done solely because its code or a test passed. Record outstanding checks, linked evidence and explicit approval. Optional labels: `good first issue` and `help wanted`, applied only after safety and complexity review.

## Existing scope and source of truth

| Planning group | Existing controlling records | Planning boundary |
| --- | --- | --- |
| v1.3.1 | [Maintenance roadmap](V1.3.1-MAINTENANCE-ROADMAP.md), [findings programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md) | Inventory safety, existing merged but unpublished corrections, host relationships, import and rollback |
| v1.3.2 | [Findings programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md), [design review](V1.3X-MAINTENANCE-DESIGN-REVIEW.md) | Consistent editing, forms, compatibility and usability, subject to individual agreement |
| v1.3.3 | [Findings programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md), [master audit](../audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md) | Code clarity, technical coverage and outstanding audit reconciliation |
| v1.4.0 | [Root roadmap](../../ROADMAP.md), [design review](V1.3X-MAINTENANCE-DESIGN-REVIEW.md) | Optional Docker/database and user management; standalone HTML remains supported indefinitely |

All 31 original M findings retain their IDs and recorded disposition. M-030 documentation reconciliation applies to every release. Published release status is independent of a finding corrected in `main`. Original WF-01 to WF-13 evidence and test matrices must remain linked, not rewritten as newly passed.

## M-005 decision and evidence preservation example

The host relationship issue must link the existing findings programme, WF-03 test matrix, technical workflows and backup compatibility matrix. Record the browser baseline evidence [run 40077572183](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40077572183) and subsequent [run 40077792668](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40077792668) separately from proposed safeguards. The baseline confirms host deletion can leave dependent virtual servers referencing a missing host and that central validation does not report an orphaned `virtualHostId`. The later backup candidate and conversion guard checks are narrower than full import and form conversion tests.

Preserve the later agreed design choices: never silently delete or reassign dependent devices; for host removal or incompatible conversion, explicitly review each dependant and permit eligible reassignment, unassignment with former host provenance, or retirement retaining history. Keep host retirement separate from deletion. A selected host hypervisor determines host eligibility and the inherited VM platform, but the guest operating system remains independent. Confirmed hypervisor changes require consistent dependent metadata and rollback on failed save. Preserve historical, custom and older backup values, and do not block unrelated saves through strict global validation. Record any older contradictory wording as superseded in the operative decision summary, retaining historical evidence.

These are design agreements, not implemented application behaviour. Full conversion, import, cancellation and save failure tests remain outstanding. The M-005 issue must not be closed until those safeguards are implemented with explicit approval, verified and documented.

## Issue and pull request template for planning

Every actionable issue should identify: plain English outcome; finding or workflow IDs; proposed release milestone; current source and published behaviour; owner agreed decisions versus open questions; data compatibility and rollback requirements; precise acceptance scenarios; technical workflow and documentation links; evidence links; and outstanding checks. A contributor should be able to start without reading a chat history.

Pull requests must link their issue and follow the existing [pull request checklist](../../.github/PULL_REQUEST_TEMPLATE.md) and [development workflow](../standards/technical/DEVELOPMENT-WORKFLOW.md). Explain executed tests separately from source inspection. Reconcile findings, test matrices, technical workflows, master audit and roadmap before owner approval. Keep public documentation in British English and avoid hyphens as punctuation.

## Migration sequence and safeguards

1. Inventory existing GitHub issues, milestones and Projects using authorised access. Do not assume that an unavailable API result means none exist.
2. Cross reference the 31 finding IDs, design review, root roadmap, existing PRs and tests. Identify duplicates and already merged work before creating any new issue.
3. Prepare the proposed four milestone allocations, retaining provisional status and outstanding decisions. Obtain owner review for substantive scope changes.
4. Create or configure the Project and milestones only through authorised GitHub access, then link existing issues first and create missing focused issues as needed.
5. Review the board against the central audit register and roadmaps. Do not mark anything done without implementation, verification, documentation reconciliation and required approval.

**Current checkpoint:** Planning issues #91 to #105 have been created, including the finite permanent documentation gate setup #104 and v1.4 planning issue #105. Release specific documentation and evidence approval issues #106 to #109 are also open for v1.3.1, v1.3.2, v1.3.3 and v1.4.0 respectively. M-030 remains a permanent policy after #104 eventually closes; each release must complete its own gate. Existing draft PR #50 is architecture documentation, not a tracking issue; draft PR #90 remains the documentation change surface. The product owner created milestones #1 to #4 and GitHub confirmed release-specific issue assignments: v1.3.1 (#91 to #95, #106), v1.3.2 (#96 to #99, #107), v1.3.3 (#100 to #103, #108), and v1.4.0 (#105, #109). Cross release issue #104 has no milestone. The product owner created the GitHub Project named Caffoot Lite Development and imported all 19 open planning issues. The seven stage board was configured and its display options saved. The Project URL has not been independently verified through the available connector. The GitHub Manage access screenshot confirms public visibility, organisation base role Read, and the product owner's Admin role. No release branch or application behaviour change has been created. The available connector cannot list or create Projects or milestones, so the Project board setup still requires authorised GitHub interface access.

## Proposed issue inventory

The [GitHub issue migration register](GITHUB-ISSUE-MIGRATION-REGISTER.md) maps all 31 original audit findings into proposed issue groups and release milestones without changing finding status. Review existing issues and Project configuration before creating duplicates.

## GitHub Project automation verification, 24 October 2026

The product owner supplied screenshots of the Project workflow settings. Three workflows were confirmed enabled: **Auto-add to project** (repository `Caffoot-Lite`, filter `is:issue is:open`), **Item added to project** (sets status to Backlog for issues and pull requests), and **Auto-add sub-issues to project** (adds child issues of existing Project items). The following were confirmed disabled: **Auto-close issue**, **Item closed**, **Pull request linked to issue**, and **Pull request merged**. The screenshots show three enabled workflows after the owner disabled automatic issue closure. These are configuration observations, not proof that each automation has been exercised end to end.

Moving a card to Done does not itself establish completed verification, documentation reconciliation or product owner approval. GitHub Project status changes remain possible for users with editing permission; the workflow settings are not an access control mechanism. Closing issues and merging or publishing releases require the existing documented approval and evidence gates. The Project configuration was reviewed visually, without application tests. The Project URL and a live automated trigger test remain independently unverified.

## Milestone assignment verification discrepancy, 24 October 2026

A live GitHub issue read after the Project automation documentation commits returned **no milestone** for sampled issues #91, #96, #100, #105 and release gates #106 to #109; cross release issue #104 also returned no milestone as intended. This conflicts with earlier planning statements that release issue assignments had been accepted. The earlier milestone assignment claim is therefore **not verified as current** and must not be treated as a completed gate. Verify all 18 release specific issue associations through GitHub and correct the status summaries before closing the planning checkpoint. No milestone was changed during this read only verification.

## Milestone repair and board membership checkpoint, 24 October 2026

The product owner's issue #91 screenshot confirmed **No milestone** and **No projects**. The GitHub issue connector also returned empty milestone assignments before repair. Milestones were then explicitly assigned through the authorised issue update action to all 18 release specific issues: #91 to #95 and #106 to milestone #1 (v1.3.1); #96 to #99 and #107 to #2 (v1.3.2); #100 to #103 and #108 to #3 (v1.3.3); #105 and #109 to #4 (v1.4.0). A subsequent live read of every issue #91 to #109 verified these 18 numeric assignments. Cross release #104 correctly has no milestone. **This resolves the milestone discrepancy noted above; the earlier observation remains as historical evidence.**

Project board membership remains **unverified and apparently missing for #91**: the owner's screenshot explicitly showed No projects. The issue connector does not expose a usable current Project association in the returned issue payload, so do not claim all 19 issues are linked to the board. Confirm the board items in the GitHub interface and add missing issues using the approved auto-add workflow or manual import; then verify the resulting associations. No application tests were run and no merge or release was performed.

## Project board screenshot verification, 24 October 2026

The product owner supplied a screenshot of the public **Caffoot Lite Development** GitHub Project board. Its **Backlog** column shows **19 items**, and the visible cards include issues #91 to #95 with v1.3.1 milestone badges. This confirms that the intended set of 19 issues is represented by the board count and that those five named cards are visible. The earlier issue #91 screenshot showed **No projects**, so the issue sidebar and Project board disagree; treat this as an unresolved display or association discrepancy rather than evidence that the board is empty. The screenshot does not independently identify all remaining 14 cards, and a full individual board association audit remains outstanding. Do not reimport the 19 issues based solely on the issue sidebar. The verified milestone assignments remain as recorded in the previous checkpoint. No application tests, merge or release were performed.

## GitHub issue and workflow verification, 24 October 2026

A fresh read of the GitHub REST issue resources confirmed **all 19 issues #91 to #109 remain open**. The **18 release specific issues** have the intended milestones: v1.3.1 (#91 to #95 and #106), v1.3.2 (#96 to #99 and #107), v1.3.3 (#100 to #103 and #108), and v1.4.0 (#105 and #109). Cross release issue **#104 has no milestone by design**. The Project board screenshot displays a Backlog count of 19 and visibly identifies #91 to #95, but individual Project membership for all 19 items has not been independently retrieved. GitHub Actions for documentation branch commit `7273a9306a0d66500dc13798790b4cff025daf4b` reported success for release candidate validation, release documentation consistency, consolidated Chromium regression, and Git history secret scan. These are CI runs, not locally executed tests. The issue sidebar and Project board discrepancy remains an open verification item. No application behaviour was changed, and no merge or release was performed.
