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

## Mandatory plan control and evidence-led completion

This policy applies to audits, documentation work, maintenance, new features and releases. It must be followed by contributors and AI-assisted development alike. Keep one authoritative, version-controlled plan for each workstream, linked from the relevant repository index. The plan must state the agreed scope, numbered requirements, deliverables, verification criteria, owner or decision-maker and current status. Do not replace the original scope with a shorter progress list.

1. **Start from the agreed plan:** Before work begins or resumes, read the authoritative plan and applicable repository policies. At each handover, identify the current plan, completed requirements, outstanding checks, decisions and evidence links. A conversation summary is not a substitute for the repository record.
2. **Track every requirement:** Maintain one completion register covering every original requirement and later approved addition. Use explicit statuses: completed with evidence, partially completed, not completed, or deliberately deferred with reason and approval. Never silently omit or renumber a requirement. If an identifier conflicts with an existing one, resolve it in the plan before reuse.
3. **Separate evidence levels:** Record source inspection, documentation reconciliation, automated tests, browser verification, owner review and release verification independently. Never describe a proposed or unexecuted test as passed. Preserve the source version and the exact evidence for each conclusion.
4. **Control changes to scope:** When a gap, defect or new idea appears, explain its impact and recommended disposition to the product owner. Record the decision, date and updated scope in the authoritative plan before treating the change as agreed. Urgent safety work may interrupt the sequence only with a recorded reason and appropriate approval.
5. **Make completion an explicit decision:** Before calling any workstream complete, reconcile every planned requirement against its evidence and acceptance criteria, review relevant function names, P11 explanatory comments, safeguards, tests, documentation and roadmap findings, and record outstanding or deferred work. An incomplete requirement cannot be disguised as completed by a summary statement.
6. **Reuse evidence and scale verification to risk:** Do not repeat unchanged checks solely for process compliance. Reuse trustworthy evidence tied to the same source revision, but recheck affected behaviour when code, dependencies or assumptions change. Documentation-only edits and data-protection changes require different levels of testing.
7. **Protect the published baseline:** Keep descriptions of released behaviour separate from proposed changes. Do not modify application code, merge, tag or publish without the product owner's explicit approval. Documentation policy changes follow branch review and merge controls too.
8. **Keep the process accessible:** Explain status and decisions in plain British English for the product owner, with precise technical detail for contributors. Prefer improving the existing authoritative register over creating parallel checklists.

**Current audit reconciliation:** The original v1.3.0 coverage audit includes WF-01 through WF-13. Its WF-11 data schema, WF-12 failure and recovery, and WF-13 test traceability requirements must be reconciled before any new public repository experience workstream reuses those identifiers. The P11 comment register and P12 completion requirements are separate gates. The published v1.3.0 documentation audit remains open until its original sign-off requirements are accounted for.

**Main branch requirement:** This policy becomes binding as repository guidance once reviewed and merged into `main`. Until then, the working branch is a proposal and must not be represented as already published policy.

## Release documentation archiving

As part of every release tidy-up, review documentation for material that has been superseded. Follow the [historical documentation archive policy](../archive/README.md). Keep current descriptions accurate, preserve historical evidence, retain shared standards where still valid and check all links and release packaging dependencies before moving files. Archive changes must be reviewed and merged before the source branch is deleted.
