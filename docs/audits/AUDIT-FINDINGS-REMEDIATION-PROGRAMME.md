# Caffoot Lite audit findings remediation programme

**Status:** Draft for product owner review. This programme does not authorise application changes, merging or publication.
**Baseline:** Published v1.3.0. Planning source: `main` at `6c72c35a49ce7ff161877f14ac2fe18ed5f09f41`, 23 October 2026.
**Scope:** All 31 original maintenance findings and the incomplete individual WF-01 to WF-13 verification gates.

## Purpose

Finish the outstanding work discovered during the v1.3.0 audit through controlled v1.3.x maintenance releases, before beginning substantial v1.4 development. Preserve the original audit evidence and chronology. A finding may be corrected in repository source without appearing in the published v1.3.0 download. Do not describe such work as released.

The [preserved original maintenance register](../roadmaps/V1.3.1-MAINTENANCE-INVESTIGATION-HISTORY.md), [master audit](../audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md), [technical workflows](../workflows/TECHNICAL-WORKFLOWS.md) and [WF-13 evidence plan](../audits/WF-13-CONSOLIDATED-EVIDENCE-PLAN.md) retain the detailed source observations and test history. Earlier investigation wording in those records is historical, not necessarily the latest disposition.

## Findings register

Statuses here are intentionally conservative. **Corrected in main** means merged source with the cited targeted evidence, not a published maintenance release. **Review** means reconcile the detailed record before deciding whether to implement, test, or close. **Deferred improvement** is not a completed correction.

| ID | Plain English subject | Current evidence-based disposition | Next action |
| --- | --- | --- | --- |
| M-001 | Failed save after removing a device from a rack | Corrected in main, targeted Chromium pass, PR #79 | Carry into maintenance release verification |
| M-002 | Leftover rack mounting fields after unassignment | Review | Determine effect on existing data and later mounting |
| M-003 | Inventory save and audit history consistency | Review | Agree intended audit guarantees |
| M-004 | Failed save rollback across editing paths | Review | Reconcile individual callers and previous tests |
| M-005 | Physical host deletion or conversion breaking virtual server links | Open investigation | Prioritise non-destructive relationship safeguards |
| M-006 | Primary IP ownership and allocation consistency | Open investigation | Verify changes, metadata and failed saves |
| M-007 | Historical function names obscure responsibilities | Proposed improvement | Complete function reference before controlled renames |
| M-008 | Device type changes and preservation of related records | Proposed policy decision | Agree safe correction and conversion rules |
| M-009 | Legitimate gateway ownership preventing subnet edits | Open investigation | Reproduce with existing and imported inventories |
| M-010 | Rack occupancy checks during import | Open investigation | Coordinate with M-019 and protect older backups |
| M-011 | Import rollback and safety copy restoration | Corrected in main, targeted Chromium pass, PR #81 | Carry into maintenance release verification |
| M-012 | Integrity repair safety and failed save handling | Corrected in main, targeted Chromium pass, PR #77 | Carry into maintenance release verification |
| M-013 | Rack accessories omitted from occupancy reporting | Proposed improvement | Agree common occupancy rules |
| M-014 | Unclear recovery reset feedback on ignored storage writes | Deferred improvement | Improve feedback without weakening recovery protections |
| M-015 | Visibility of automatic inventory normalisation | Proposed improvement | Decide what changes need explanation |
| M-016 | Published v1.3.0 documentation consistency | Historical documentation finding | Confirm final disposition against original register |
| M-017 | Readable but invalid inventory at startup | Open investigation | Explain failure without automatic overwrite |
| M-018 | Failed save after creating a location | Corrected in main, targeted Chromium pass, PR #79 | Carry into maintenance release verification |
| M-019 | Imported rack accessory integrity checks | Open investigation | Coordinate with M-010 |
| M-020 | Failed save after selecting device graphics | Corrected in main, targeted Chromium pass, PR #79 | Carry into maintenance release verification |
| M-021 | Suspected hardware model edit rollback defect | Closed without change after complete function inspection | Retain original finding and closure evidence |
| M-022 | Rack selection after a failed new rack save | Review | Reconcile existing test and source evidence |
| M-023 | Rack accessory failure feedback and retry | Review | Check impact and proposed user experience |
| M-024 | IP reservations referring to missing devices | Open investigation | Verify imports and preserve existing records |
| M-025 | Backup and restore language and controls | Agreed user experience direction, not implemented | Design clear controls and retain safety copies |
| M-026 | Consistent save, cancel and edit behaviour | Proposed improvement | Review form families and exceptions |
| M-027 | Return to editing from bulk IP confirmation | Agreed user experience direction, not implemented | Design and test return without applying changes |
| M-028 | Archived catalogue selections hidden from device details | Open investigation | Verify display, reload and historical records |
| M-029 | Local change history accuracy and resilience | Proposed improvement | Agree scope and data guarantees |
| M-030 | Documentation completeness and release version checks | Open documentation and release gate | Reconcile public wording, workflow and automation |
| M-031 | Bulk IPAM safety copy readback | Corrected in main, targeted Chromium pass | Preserve closure and targeted evidence |

**Evidence:** M-001, M-018 and M-020: [PR #79](https://github.com/Caffoot/Caffoot-Lite/pull/79), [Chromium run 39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113). M-011: [PR #81](https://github.com/Caffoot/Caffoot-Lite/pull/81), [run 39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469). M-012: [PR #77](https://github.com/Caffoot/Caffoot-Lite/pull/77), [run 39955498407](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39955498407). M-031: runs [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113) and [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469). The master audit records the formal M-014 deferral and M-021 source correction. These are previous executions, not tests run for this document.

## Workflow verification carried forward

The [current workflow register](../workflows/TECHNICAL-WORKFLOWS.md) records source assessment, individual P12 completion and executed browser evidence separately. The extended audit was administratively closed by the product owner, **not** certified as fully tested. Each of WF-01, WF-02, WF-03, WF-04, WF-05, WF-06, WF-07, WF-08, WF-09, WF-10, WF-11, WF-12 and WF-13 must receive an explicit completion decision supported by its existing or new evidence. Do not repeat passing tests without a real coverage gap. Do not mark source inspection as an executed test.

## Proposed maintenance sequence, subject to owner approval

1. **v1.3.1:** Confirm the already merged corrections for inclusion in the next published package. Investigate priority data safety and relationship concerns M-005, M-006, M-009, M-010/M-019, M-014, M-017, M-024, M-028 and M-030. Reconcile M-004, M-022 and related failed save evidence. Release scope is not yet approved.
2. **Later v1.3.x releases:** Resolve remaining confirmed defects, design and verify the agreed usability improvements, and perform separately controlled function naming or form consistency work. Assign specific versions only after evidence and impact review.
3. **Before v1.4:** Record an evidenced disposition for every M finding, reconcile all individual workflow gates and public documentation, and obtain product owner approval for the next development phase.

The [historical v1.3.1 investigation register](../roadmaps/V1.3.1-MAINTENANCE-INVESTIGATION-HISTORY.md) contains a 23 October planning split that proposed deferring some findings to v1.4. The product owner's subsequent direction is to complete original audit remediation in v1.3.x. This document records that updated direction **as a proposal for reconciliation**, without silently rewriting the historical decision or assigning unapproved fixes.

## Permanent change and closure rules

For each change, review the current workflow, function references and explanatory comments, test matrices, data and backup compatibility, audit and development findings, user guidance, roadmap and release notes. Update affected living documents in the same pull request. Record a short reason where an area is not applicable.

A finding closes only with its original observation retained, an explicit disposition, exact source revision, test commands or browser evidence actually executed where relevant, documentation links and owner approval. Source inspection and unexecuted tests must never be reported as passing. Historical audit records remain accessible; new post-audit findings should receive separate development identifiers rather than reusing M numbers.

No application behaviour, branch protection, merge into main or published release may be changed without explicit product owner approval.

## Draft checkpoint, 23 October 2026

Reviewed the master audit, original roadmap, technical workflow register, development and documentation policies, function reference and WF-13 evidence plan. This document is a **documentation proposal**, not a full reconciliation or completion certificate. No application tests were executed for its creation. Remaining tasks include verifying individual dispositions against all detailed audit notes, reconciling documentation indexes and status summaries, reviewing automated documentation checks and reconciling the release-specific roadmap with each individual finding. No merge or release is authorised by this draft.


### M-011 tracing progress, 23 October 2026

The top-level `importData(event)` caller sequence, candidate validation, verified pre-restore safety copy, saved candidate readback, original inventory rollback, previous safety copy restoration and recovery mode activation have now been inspected in current `main` source and documented in the [function reference](../standards/FUNCTION-NAMING-AND-REFERENCE.md#m-011-import-rollback-call-chain-source-inspection-23-october-2026) and [WF-06 and WF-12](../workflows/TECHNICAL-WORKFLOWS.md#wf-06-and-wf-12-m-011-current-source-trace-23-october-2026). This is source inspection, not a newly executed test. Complete helper internals and untested backup variants remain outstanding. Historical passing run 39959581469 remains the executed evidence.


## Test matrix reconciliation, 23 October 2026

The [workflow verification coverage register](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md) summarises WF-01 through WF-13. Dated evidence notes were added to the existing WF-01, WF-02 saving, WF-03, WF-04 and WF-05 test matrices, preserving their historical plans while identifying previously executed targeted Chromium assertions. Individual matrix completion remains unverified, and the imported rack matrix and other workflow test cases still require detailed review. No new application tests were executed during this documentation update.


## Imported rack verification boundary

The [imported rack test matrix](../testing/WF-02-IMPORTED-RACK-TEST-MATRIX.md) retains 18 pending fixture-specific scenarios. Previous release compatibility and M-011 rollback runs are related evidence, not proof that the imported accessory collision and malformed placement cases were executed. M-010 and M-019 remain open. The [coverage register](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md) records this distinction.


## M-030 automation assessment, 23 October 2026

Source inspection of `.github/workflows/caffoot-lite.yml` shows the existing build and Chromium workflow runs on pushes to `main` that change `app/**` or that workflow itself, plus manual dispatch. Its steps build the standalone HTML, validate inline JavaScript and run six browser scripts. **The inspected workflow does not automatically run on documentation-only pull requests and contains no explicit documentation cross-reference or version consistency check.** This is a workflow configuration inspection, not an executed CI test. The [release checklist](../releases/RELEASE-CHECKLIST.md) now records a manual documentation and version gate, but M-030 remains open until automated coverage is agreed, implemented and tested. No CI workflow was changed in this checkpoint.


## Correction to M-030 automation assessment, 23 October 2026

The preceding assessment examined only `.github/workflows/caffoot-lite.yml` and must **not** be read as saying the repository has no documentation CI. The separate `.github/workflows/release-documentation.yml` already runs on `pull_request` and manual dispatch. It executes self-tests and repository checks through `scripts/check-documentation-links.cjs` and `scripts/check-release-documentation.cjs`, covering local Markdown targets, heading anchors and published or candidate release statements. This was verified by inspection of the current workflow and both checker scripts, not by executing them at this checkpoint. M-030 is therefore **partially implemented**, not wholly absent. Remaining work is to confirm successful PR #89 execution and assess gaps such as mandatory documentation coverage and human reconciliation of technical accuracy. Do not duplicate the existing workflow or treat a link check as proof that workflow content is correct.


## Documentation accuracy acceptance gate, 23 October 2026

The [technical documentation policy](../standards/TECHNICAL-DOCUMENTATION-POLICY.md) and pull request template now require an inventory of existing safeguards before proposing replacements, explicit impact assessment, and final reconciliation of workflow, test, finding, roadmap, release and master audit records. A pull request with unresolved mandatory documentation discrepancies is **not ready for approval to merge**. The existing release documentation CI is retained. M-030 remains partially implemented because these additional requirements have not yet been enforced or verified automatically. No application tests were executed for this policy change.
