# Workflow verification coverage register

**Status:** Draft reconciliation, 23 October 2026. The extended v1.3.0 audit was administratively closed with incomplete individual P12 workflow gates. This register does not declare them complete.
**Sources:** [Technical workflow register](../workflows/TECHNICAL-WORKFLOWS.md), [master audit](../audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md), [WF-13 consolidated evidence](../audits/WF-13-CONSOLIDATED-EVIDENCE-PLAN.md), and [remediation programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md).

## Existing evidence and gaps

| Workflow | Recorded executed evidence | What remains unverified or requires a disposition |
| --- | --- | --- |
| WF-01 Startup and recovery | Recovery reset fault scenarios, run [39944710633](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39944710633) | Complete startup and recovery caller review; M-014 usability improvement deferred |
| WF-02 Saving and integrity | Failed save and rollback assertions, runs [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113), [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469); M-012 [39955498407](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39955498407) | Other save callers and complete failure matrix; M-004 and M-022 review |
| WF-03 Device lifecycle | Device graphic rollback M-020, run 39957395113 | Full device lifecycle, relationships and form conversion paths; M-005 and M-008 |
| WF-04 IPAM and networks | Bulk snapshot readback M-031, runs 39957395113 and 39959581469 | Subnet, VLAN, allocation and ownership combinations; M-006, M-009, M-024 |
| WF-05 Racks and accessories | Rack unassignment rollback M-001, run 39957395113 | Imported collisions, accessory occupancy and placement combinations; M-010, M-013, M-019 |
| WF-06 Backup and restore | Published v1.2.1 export to published v1.3.0 import, run [39961182872](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39961182872); import rollback M-011, run 39959581469 | Other historic backup shapes, helper internals and broader failure conditions |
| WF-07 Navigation and forms | Custom location failed save M-018, run 39957395113 | Accessibility, keyboard, modal and common form behaviour; M-026 |
| WF-08 Catalogues and services | No comprehensive browser matrix evidenced in the workflow register | Catalogue and service lifecycle, archived assignment display; M-028 |
| WF-09 Audit history and preferences | No comprehensive browser matrix evidenced in the workflow register | History and preferences scenarios; M-003, M-029 |
| WF-10 Security, build and release | Published asset integrity, run 39961182872; earlier release candidate validation, run [39605067641](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39605067641) | Complete release documentation/version gate and other security checks; M-030 |
| WF-11 Data schema and migrations | Representative published backup compatibility, run 39961182872 | Other historical schemas and migration edge cases |
| WF-12 Failure and recovery | Import and bulk IPAM fault scenarios, run 39959581469; recovery reset scenarios, run 39944710633 | Other failure paths, storage outcomes and recovery messaging |
| WF-13 Test traceability | Targeted Chromium runs above and published release provenance, run 39961182872 | Link each remaining workflow gate to exact assertions, runs or explicit untested status |

## Decision and evidence rules

1. Before scheduling a test, check whether a prior execution covers the same behaviour, revision and failure condition. Do not repeat work merely because the audit was long or a chat ended.
2. An inspected source function, a test script, a green documentation pull request and an executed Chromium test are different kinds of evidence. Record which one applies.
3. New runtime checks should use disposable fictional inventories and identify source revision, command, browser environment, assertions, outcome and run URL.
4. Do not call a workflow complete until its documented P12 gate is explicitly reconciled with the master audit and living technical workflow.
5. Application changes, merges and releases require explicit product owner approval.

## Current checkpoint

This table is a **planning and cross-reference summary** of recorded evidence, not newly executed test results. Individual matrices still need to be reconciled with these rows and each outstanding scenario. Existing matrices: [WF-01 recovery](WF-01-RECOVERY-TEST-PLAN.md), [WF-02 saving](WF-02-SAVING-AND-INTEGRITY-TEST-MATRIX.md), [WF-02 imported racks](WF-02-IMPORTED-RACK-TEST-MATRIX.md), [WF-03 devices](WF-03-DEVICE-LIFECYCLE-TEST-MATRIX.md), [WF-04 networks](WF-04-IPAM-NETWORK-TEST-MATRIX.md), [WF-05 racks](WF-05-RACK-OCCUPANCY-REGRESSION-MATRIX.md). No application tests executed for this document.


## Imported rack matrix note

The 18 specific WF02-T01 to WF02-T18 scenarios remain pending. Earlier backup compatibility and rollback tests do not cover the exact imported rack accessory fixtures. See [imported rack test matrix](WF-02-IMPORTED-RACK-TEST-MATRIX.md). M-010 and M-019 remain open. No new browser tests were executed.


## Documentation checker evidence, 23 October 2026

PR #89 [release documentation consistency run 39984994151](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39984994151) passed structural checks that each WF-01 through WF-13 table entry exists and that WF02-T01 through WF02-T18 are present in the imported rack test matrix. This verifies **document structure only**, not individual workflow execution or completion. The earlier failed run 39984762571 exposed a checker parsing defect for labelled workflow rows, subsequently corrected. Existing targeted browser run evidence in this register is unchanged. Individual P12 completion gates and all 18 imported rack fixtures remain outstanding.
