# Caffoot Lite Technical Documentation Policy

**Status:** Agreed policy, introduced during the v1.3.0 technical baseline investigation on 22 October 2026.

## Mandatory rules

1. Every significant change to Caffoot Lite must review the affected technical workflow documentation.
2. Any new or changed functionality, processing, storage, validation, error handling, dependency or data relationship **must be added to or updated in** the technical workflow documentation as part of that change.
3. Documentation must describe actual implemented behaviour and must distinguish verified code inspection, verified tests, unresolved questions and proposals.
4. Documentation changes are part of the definition of done. Significant work is not ready for release until its relevant technical documentation has been updated and reviewed.
5. Record source file paths, function names, ordered processing steps, relevant dependencies, failure behaviour, validation and data protection safeguards, applicable version and verification evidence.
6. Preserve an accurate baseline for each published release. Never silently replace historical descriptions with later behaviour.
7. Keep the current published release documentation accessible from `main`. Develop and review updates on branches before merging them.
8. Use British English for public facing writing. Do not use dashes as punctuation. Preserve required technical identifiers exactly.
9. Explain work to the product owner in plain English first. Technical documentation may use precise developer terminology.
10. If a significant defect, unsafe behaviour or ambiguity is found, log its evidence and severity. Investigate and propose a remedy before declaring the relevant workflow verified. Any application code fix requires explicit approval and separate testing and release control.

## Baseline project sequence

- First, inspect the exact v1.3.0 release and document all existing workflows.
- Second, reconcile gaps against tests and runtime behaviour. Correct confirmed significant defects through separately approved maintenance work.
- Third, review and merge verified baseline documentation into `main`.
- Fourth, resume the v1.4.0 feasibility investigation using the verified baseline.

This policy does not itself authorise modifications to application code, a database, Docker deployment or a release.


## Discovery and roadmap discussion during audits

During every technical workflow investigation, identify potential defects, missing safeguards, inconsistencies, usability improvements and new capabilities. Explain meaningful findings to the product owner in plain British English, including the existing behaviour, potential impact, evidence and recommended next step. Discuss the roadmap disposition as the audit proceeds, rather than waiting until the end.

Record source-supported candidates in the maintenance or future roadmap with an explicit status such as proposed, investigation required, deferred, rejected or approved. Recording a candidate does not approve implementation. Distinguish confirmed defects from hypotheses and product suggestions. Prioritise data protection concerns for prompt discussion. Do not interrupt the read-only v1.3.0 baseline audit with application changes without explicit approval. Keep existing behaviour in baseline documentation and prospective behaviour in roadmap documents. Review roadmap entries and their disposition with the product owner before declaring the audit complete.

## Mandatory workflow audit completion gate

Before beginning the next workflow, complete and review the current workflow's documentation package. This is a **documentation completeness gate**, not a claim that all runtime tests have passed or that every discovered defect has been fixed.

1. **Technical workflow:** Describe existing published behaviour, source revision and relevant function locations, inputs, state changes, dependencies, safeguards, error handling, recovery and known limitations in `docs/workflows/TECHNICAL-WORKFLOWS.md`.
2. **Function reference and comments:** Reconcile every significant function encountered with `docs/standards/FUNCTION-NAMING-AND-REFERENCE.md`, including functions whose names should be retained. Record proposed clearer names, dependencies, callers, evidence status and P11 comment improvements without changing application code.
3. **Dedicated test matrix:** Create or update a workflow-specific test matrix or test plan, covering normal operation, invalid input, failure, rollback, persistence, reload, imports and recovery where applicable. Cross-reference other matrices instead of duplicating tests. Mark planned, automated, browser-verified and failed scenarios separately.
4. **Findings and roadmap:** Log each source-confirmed issue, suspected issue, design choice and proposed improvement in the coverage audit and appropriate maintenance or future roadmap. Include severity, impact, evidence, decision and owner or next action where known. No proposed item is automatically approved.
5. **Documentation consistency:** Cross-check terminology, current versus proposed behaviour, user-facing British English, source references, function names, safeguards and links across all relevant documents. Record unresolved questions explicitly.
6. **Completion record:** Add a dated workflow checkpoint to the coverage audit identifying documents reviewed, missing items, test execution status, open findings and whether the workflow is **documentation complete**, **documentation incomplete**, or **verified by tests**. Do not call a workflow verified merely because its documentation exists.

**Progression rule:** Do not begin the next workflow until all required documents exist, the reference reconciliation is complete, and any exceptions or outstanding evidence are explicitly recorded and discussed. If urgent data protection concerns require a change of sequence, record the reason and obtain approval. Continue to protect user inventory and maintain application change control.

**Retrospective application:** Recheck WF-01 through WF-04 against this gate before treating their documentation packages as complete. WF-03 and WF-04 require dedicated test matrices. WF-05 has a matrix but still requires completion review. Keep the distinction between documentation completion and unexecuted browser tests visible.

## One mandatory development and audit process

This is the single permanent process for Caffoot Lite audits, documentation changes, bug fixes, improvements, new features and releases. Contributors and AI-assisted development must follow it. Individual tasks do **not** require a separate formal process or plan document. Use the existing issue, roadmap entry, audit register or change record to capture the specific scope and evidence, in proportion to risk.

1. **Understand:** Read the relevant current code, published behaviour, technical workflows, safeguards and dependencies. Identify the source revision and any uncertainty.
2. **Agree:** Record the intended outcome, scope, acceptance criteria, risks and required approval in the existing work record. Do not begin unauthorised application changes.
3. **Implement:** Make only approved changes. Record unexpected findings, explain their impact and obtain approval before materially changing scope.
4. **Verify:** Perform checks appropriate to the change's risk, including negative cases, persistence, rollback and browser or release testing where relevant. Distinguish planned tests from executed results. Reuse valid evidence for unchanged code rather than repeating checks for appearances.
5. **Document:** Update affected technical workflows, function naming references, P11 explanatory comment assessments, user guidance, test matrices, roadmap and release records as applicable. Document existing behaviour separately from proposed behaviour.
6. **Reconcile:** Compare the work record against the original agreed scope and acceptance criteria. Account for every requirement as completed with evidence, partially completed, not completed or explicitly deferred with reason and approval. Preserve original identifiers, record any conflicts and never silently shorten a checklist.
7. **Approve and release:** Record the completion decision and remaining risks. Obtain the product owner's explicit approval before merging, tagging or publishing. Confirm that required documentation is present on `main` after an approved merge.

### Mandatory pull request and merge gate

Before **any** pull request is merged into `main`, its change record and pull request must demonstrate that the seven stages above were followed at a level appropriate to the change. The reviewer must check:

1. The agreed scope and acceptance criteria are recorded, and any scope changes are explained and approved.
2. Affected technical workflows, function references, explanatory comment assessments, user-facing documentation, tests, roadmap and release guidance have been reviewed and updated where relevant. Record **not applicable** with a brief reason where a category genuinely does not apply.
3. Relevant automated and manual checks have passed, with evidence linked; unexecuted or blocked checks are disclosed, not treated as passed.
4. Open risks, deferred work and known limitations are recorded and have an explicit disposition.
5. The pull request is reviewed, the change record is reconciled against its original scope, and the product owner has explicitly authorised the merge.

**No merge before this gate is satisfied.** Keep documentation changes in the same pull request as the change they describe wherever practical, so `main` remains consistent. A release also requires its separate packaging, version, licence and publication checks. For documentation-only work, application-specific tests may be not applicable when justified.

**Enforcement:** Repository guidance alone cannot block a GitHub merge. Maintain a pull request template reflecting this gate, add suitable automated checks and configure branch protection or repository rules to require checks and reviews where supported. Verify these controls are active before describing the gate as technically enforced. Any exception requires an explicit, recorded product-owner decision; do not silently bypass the gate.

**Always-required safeguards:** No claims of passed tests without execution evidence; no source inspection presented as browser verification; no undocumented scope changes; no misleading comments explaining unresolved defects as intended design; no unapproved application changes or release actions. Every significant code change must review its technical workflow documentation. Explain findings to the product owner in plain British English, with precise technical evidence retained for contributors.

**Proportionate application:** A small text correction needs a short record and focused checks. A change affecting inventory saving, migration, recovery or user data requires deeper source review, failure testing and explicit safeguards. The seven stages remain the same; the evidence needed within each stage varies.

**Audit-specific completion:** The original v1.3.0 coverage audit includes WF-01 through WF-13 and must be reconciled against its own original requirements, including P11 comments, P12 completion checks, function references and outstanding test evidence. The proposed public repository experience review must not reuse the original WF-11 identifier until the conflict is resolved. This audit register is the task's evidence record, not a competing process.

**Main branch requirement:** This policy becomes binding repository guidance once reviewed and merged into `main`. Until then, it remains on the documentation branch for review.

## Release documentation archiving

As part of every release tidy-up, review documentation for material that has been superseded. Follow the [historical documentation archive policy](../../archive/README.md). Keep current descriptions accurate, preserve historical evidence, retain shared standards where still valid and check all links and release packaging dependencies before moving files. Archive changes must be reviewed and merged before the source branch is deleted.


## Workstream identifier clarification, 23 October 2026

The original v1.3.0 documentation audit retains WF-01 through WF-13. The separately agreed public repository and first-time user experience review is **WF-14**, tracked in [the WF-14 scope document](../../audits/WF-14-PUBLIC-REPOSITORY-AND-FIRST-TIME-USER-EXPERIENCE.md). It is planned work, not a replacement for WF-11 or evidence that the original audit is complete. This clarification supersedes earlier provisional references to an unnamed public repository review.


## Documentation consistency gate, proposed 23 October 2026

Every pull request must identify which technical workflows, test matrices, findings, function references, roadmap entries and release documents were checked. For any unchanged document, explain why it is unaffected. A documentation-only change requires link and consistency checks, not an invented application test pass.

A lightweight automated documentation job should check that mandatory documents exist, relative Markdown links resolve, and current release references are internally consistent. It must not rewrite historical release evidence or treat historic version strings as errors. Automation cannot establish whether a workflow description accurately matches application behaviour; reviewers remain responsible for that judgement and for reconciling master audit status. Keep M-030 open until the check has been implemented and executed successfully.

Do not change repository branch protections or required status checks without separate explicit product owner approval. Existing approval rules for application behaviour, merging and publication remain in force.


## Non-negotiable documentation accuracy and change gate

Documentation accuracy is a **mandatory acceptance criterion**, not optional maintenance. Before designing a new safeguard, feature, test or CI job, inventory existing implementations and checks; record their location, purpose, observed coverage and remaining gap. Do not introduce duplicates based on an incomplete search.

Every proposed change must identify the exact published baseline and current development revision. Record the affected workflow IDs, functions, data contracts, test scenarios, findings and public descriptions. For each affected document, either update it in the same pull request or explain explicitly why it remains correct. Never silently change historical evidence. If the evidence is incomplete, mark the relevant claim or gate pending rather than claiming verification.

Before approval, reconcile the master audit, current findings, workflow register, test matrices, roadmap, release checklist and pull request evidence. Confirm that status summaries, links, source revisions and test claims agree. Automated checks must cover objectively testable requirements; technical accuracy still requires a reviewer to inspect source and actual test evidence. If any mandatory reconciliation is outstanding, **do not call the change documentation complete or ready to merge**.

This policy is proposed on the current review branch. Existing GitHub documentation CI already checks links and version statements; additional automated checks must extend it rather than duplicate it. Making a check compulsory through branch protection requires separate owner approval.


## Automated audit register coverage, 23 October 2026

The existing release documentation consistency workflow has been extended on the PR #89 review branch to check the presence of six mandatory audit and policy files and the current table identifiers for M-001 through M-031, WF-01 through WF-13 and WF02-T01 through WF02-T18. The checker has isolated self-test fixtures for missing files and entries. This gate checks objective structural completeness only. It does **not** certify that statuses agree, that cited tests ran, or that technical explanations match application source. Reviewers must still reconcile the master audit, workflow documentation, evidence registers, roadmap and release records before approval. The new checks have been committed but their GitHub Actions outcome is pending. No branch protection change is authorised.


## Automated coverage execution evidence, 23 October 2026

The PR #89 structural coverage gate and existing documentation checks passed in [GitHub Actions run 39984994151](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39984994151) at commit `1c42846fad63cc1acc189c9ab2a4c0284cc279d9`. The history secret scan also passed in run 39984994558. This is evidence of objective automated checks only. The mandatory reviewer reconciliation of current statuses, technical behaviour, test provenance and release descriptions remains a separate approval gate. The audit programme records the corrected labelled workflow parser regression. No branch protection, application behaviour, merge or release was changed.

## Proposed interface design standard cross-reference, 24 October 2026

The product owner agreed a consistent, reusable interface design direction. The proposed [Design and Interaction Standards](../design/DESIGN-AND-INTERACTION-STANDARDS.md) define shared visual patterns, accessible relationship diagrams, common form and review behaviours, and documentation and verification expectations. This is a proposed standard, not evidence of implemented shared components or executed tests.
