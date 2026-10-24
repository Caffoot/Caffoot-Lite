# GitHub planning and contributor handover

**Status:** Four release milestones created and issues assigned; central Project board setup pending. **Baseline:** Published v1.3.0. **Recorded:** 24 October 2026.

## Purpose

Make Caffoot Lite's work understandable to the product owner, maintainers and future contributors without replacing or losing existing decisions, audit findings, tests or technical documentation. GitHub is a planning and delivery view, not an independent authority for current application behaviour.

## Agreed structure

Use one GitHub Project for the development programme, with proposed release milestones v1.3.1, v1.3.2, v1.3.3 and v1.4.0. Use one issue per distinct actionable change, investigation or verification deliverable, linking related findings rather than duplicating them. Use focused issue branches and pull requests. Dedicated release branches may be created when release stabilisation genuinely needs them; milestones do not automatically create branches. Keep `main` protected and do not merge, release or change repository protections without explicit product owner approval.

Suggested board states: Backlog, Agreed, In progress, Verification, Documentation reconciliation, Ready for approval, Done. Do not move an issue to Done solely because its code or a test passed. Record outstanding checks, linked evidence and explicit approval. Optional labels: `good first issue` and `help wanted`, applied only after safety and complexity review.

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

**Current checkpoint:** Planning issues #91 to #105 have been created, including the finite permanent documentation gate setup #104 and v1.4 planning issue #105. Release specific documentation and evidence approval issues #106 to #109 are also open for v1.3.1, v1.3.2, v1.3.3 and v1.4.0 respectively. M-030 remains a permanent policy after #104 eventually closes; each release must complete its own gate. Existing draft PR #50 is architecture documentation, not a tracking issue; draft PR #90 remains the documentation change surface. The product owner created milestones #1 to #4 and GitHub confirmed release-specific issue assignments: v1.3.1 (#91 to #95, #106), v1.3.2 (#96 to #99, #107), v1.3.3 (#100 to #103, #108), and v1.4.0 (#105, #109). Cross release issue #104 has no milestone. No GitHub Project, release branch or application behaviour change has been created. The available connector cannot list or create Projects or milestones, so the Project board setup still requires authorised GitHub interface access.

## Proposed issue inventory

The [GitHub issue migration register](GITHUB-ISSUE-MIGRATION-REGISTER.md) maps all 31 original audit findings into proposed issue groups and release milestones without changing finding status. Review existing issues and Project configuration before creating duplicates.
