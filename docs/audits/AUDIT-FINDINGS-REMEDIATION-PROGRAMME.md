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
| M-030 | Documentation completeness and release version checks | Partially implemented: automated structural and version checks passed; manual reconciliation open | Reconcile technical accuracy, evidence and release readiness before approval |
| M-031 | Bulk IPAM safety copy readback | Corrected in main, targeted Chromium pass | Preserve closure and targeted evidence |

**Evidence:** M-001, M-018 and M-020: [PR #79](https://github.com/Caffoot/Caffoot-Lite/pull/79), [Chromium run 39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113). M-011: [PR #81](https://github.com/Caffoot/Caffoot-Lite/pull/81), [run 39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469). M-012: [PR #77](https://github.com/Caffoot/Caffoot-Lite/pull/77), [run 39955498407](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39955498407). M-031: runs [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113) and [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469). The master audit records the formal M-014 deferral and M-021 source correction. These are previous executions, not tests run for this document.

## Workflow verification carried forward

The [current workflow register](../workflows/TECHNICAL-WORKFLOWS.md) records source assessment, individual P12 completion and executed browser evidence separately. The extended audit was administratively closed by the product owner, **not** certified as fully tested. Each of WF-01, WF-02, WF-03, WF-04, WF-05, WF-06, WF-07, WF-08, WF-09, WF-10, WF-11, WF-12 and WF-13 must receive an explicit completion decision supported by its existing or new evidence. Do not repeat passing tests without a real coverage gap. Do not mark source inspection as an executed test.

## Proposed maintenance sequence, subject to owner approval

1. **v1.3.1:** Confirm the already merged corrections for inclusion in the next published package. Investigate priority data safety and relationship concerns M-005, M-006, M-009, M-010/M-019, M-014, M-017, M-024, M-028 and M-030. Reconcile M-004, M-022 and related failed save evidence. Release scope is not yet approved.
2. **Later v1.3.x releases:** Resolve remaining confirmed defects, design and verify the agreed usability improvements, and perform separately controlled function naming or form consistency work. Assign specific versions only after evidence and impact review.
3. **Before v1.4:** Record an evidenced disposition for every M finding, reconcile all individual workflow gates and public documentation, and obtain product owner approval for the next development phase.

The [historical v1.3.1 investigation register](../roadmaps/V1.3.1-MAINTENANCE-INVESTIGATION-HISTORY.md) contains a 23 October planning split that proposed deferring some findings to v1.4. The product owner's subsequent direction is to complete original audit remediation in v1.3.x. This document records that updated direction **as a proposal for reconciliation**, without silently rewriting the historical decision or assigning unapproved fixes.

## Single work plan and completeness controls, 23 October 2026

This programme is the central planning register. Detailed evidence remains in the linked specialist records. The 31 M entries above are the complete numbered maintenance finding inventory, but **not** the entire audit work inventory. The following cross-cutting workstreams must also be accounted for. A proposed release allocation is not approval to implement.

| Workstream | Authoritative detailed record | Current status | Required next decision and completion evidence | Proposed sequence |
| --- | --- | --- | --- | --- |
| M-001 to M-031 | Findings table above and historical maintenance register | All numbered findings recorded; individual dispositions vary | Verify each finding against original evidence, assign an approved release or explicit deferral, preserve closures and record verification | Review throughout; prioritise data safety first |
| WF-01 to WF-13 and P12 | [Workflow verification coverage register](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md) and [master audit](V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md) | Individual completion gates incomplete despite administrative audit closure | For each workflow record source coverage, previously executed evidence, untested scenarios, owner disposition and release gate | Alongside relevant M findings, then final P12 reconciliation |
| Imported rack fixtures WF02-T01 to WF02-T18 | [Imported rack test matrix](../testing/WF-02-IMPORTED-RACK-TEST-MATRIX.md) | Fixture-specific execution outstanding | Confirm expected compatibility policy and execute or explicitly defer each scenario with evidence | With M-010 and M-019 |
| Function naming and caller reference, M-007 | [Function naming and reference](../standards/FUNCTION-NAMING-AND-REFERENCE.md) | Partial inventory and proposed names; no renames implemented | Complete significant declaration and caller coverage, decide retain versus rename, assess dependencies and tests; schedule approved renames separately | After urgent integrity work; before substantial v1.4 development |
| P11 explanatory comments | [P11 comment improvement register](P11-EXPLANATORY-COMMENT-IMPROVEMENT-REGISTER.md) | Proposals recorded; final completeness and source accuracy outstanding | Review essential, useful, retain and hold entries per workflow; only implement comments when accurate and approved | With affected workflow changes, then final review |
| Documentation accuracy, links, release provenance and M-030 | [Master audit](V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md), [relocation register](DOCUMENTATION-RELOCATION-REGISTER.md) and [release checklist](../releases/RELEASE-CHECKLIST.md) | Automated PR checks previously passed; manual semantic reconciliation and some compatibility checks outstanding | Align operative status summaries, preserve historical evidence, check references and verify release readiness | First, after each change, and before release |
| v1.3.1 versus later maintenance versus v1.4 | [v1.3.1 roadmap](../roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md) and [root roadmap](../../ROADMAP.md) | Prioritisation proposed, individual allocations not fully approved | Record explicit owner disposition for every finding and cross-cutting workstream; do not silently transfer incomplete work | After evidence-based investigations and before implementation batches |

### Ordered checkpoints

1. Reconcile PR #89 merge status, documentation summaries, the master audit and CI evidence without rewriting historical checkpoints.
2. Investigate M-005 physical host relationships using existing WF-03 scenarios D10 to D13 and D26. Agree a non-destructive compatibility policy before any code change.
3. Investigate and prioritise remaining data protection findings, including M-004, M-006, M-009, M-010, M-017, M-019, M-022 and M-024. Reuse prior evidence where applicable.
4. Complete or explicitly disposition the imported rack fixtures and relevant targeted regression coverage. Do not claim unexecuted tests passed.
5. Review the remaining M findings, usability proposals, M-007 function names and P11 comments. Give each an explicit retain, fix, defer or close decision and approved release destination.
6. Reconcile all thirteen individual P12 workflow gates, function references, master audit, roadmap, documentation and release checklist. Preserve legitimate partial statuses.
7. Agree the exact v1.3.1 release scope and acceptance criteria. Implement only separately approved changes, verify the built release, seek explicit owner approval before merging or publishing, and carry approved deferrals into a named later plan.

**No omission rule:** An item is not complete merely because it appears in a register. Its evidence, current disposition, next action, planned release or approved deferral, tests actually executed and affected documentation must agree. An unresolved entry remains visible and cannot be silently dropped from a shortened roadmap.

**Current limitation:** This table reconciles the existence and planning destination of the known registers. It does not yet prove exhaustive function declaration coverage, all P11 comment assessments, every P12 test or full agreement of every historical and operative status statement. Those checks remain open.

## Proposed v1.3.x release allocation, 23 October 2026

**Planning agreement:** The product owner agreed to document a three release planning structure. These allocations are **provisional**, not permission to modify application behaviour, merge or publish. Investigations may change scope. Published v1.3.0 remains unchanged.

| Proposed release | Primary outcome | Findings allocated for investigation or delivery | Cross-cutting requirements |
| --- | --- | --- | --- |
| v1.3.1 | Data safety and inventory integrity | Already merged, not yet published: M-001, M-011, M-012, M-018, M-020, M-031. Investigate M-004, M-005, M-006, M-009, M-010, M-017, M-019, M-022, M-024 | WF-02, WF-03, WF-04, WF-05, WF-06, WF-11 and WF-12 relevant evidence; WF02-T01 to WF02-T18 imported rack fixtures; historical backup compatibility and release package checks |
| v1.3.2 | Usability, relationships and consistent editing | M-002, M-008, M-013, M-014, M-015, M-023, M-025, M-026, M-027, M-028 | Review UI consistency, historical data preservation, device conversion and relevant workflow/browser tests |
| v1.3.3 | Code clarity, history and outstanding audit reconciliation | M-003, M-007, M-016, M-029. M-021 remains closed without change and is carried for evidence reconciliation only, not implementation | Complete significant function and caller review, P11 explanatory comments, remaining P12 decisions across WF-01 to WF-13 and final documentation consistency |
| Every release | Documentation and safety gate | M-030 spans all releases; it is **not deferred** to v1.3.3 | Update technical workflows, function references, test matrices, master audit, findings, roadmap and release documents with each change; retain evidence of executed tests |

**Completeness check:** Every original finding M-001 through M-031 appears in the allocation above exactly once as a primary allocation, except M-030 which is explicitly cross-cutting. M-021 is a closure record, not a planned fix. All thirteen workflow gates, P11, P12 and the eighteen imported rack scenarios remain tracked separately; no scenario is deemed passed by allocation alone.

**Priority override:** If an investigation identifies a confirmed threat to inventory data, reconsider its release placement immediately. Do not defer required safety work to preserve this schedule. Conversely, do not make older inventories impossible to save through stricter validation. Scope, acceptance criteria, tests and individual fixes require separate agreement.

**Before each release:** Review the entire findings register for open risks, assign every incomplete item to an approved later release or explicit deferral, reconcile all affected documents and obtain explicit product owner approval before merging or publication.

## M-005 current source investigation checkpoint, 23 October 2026

**Source inspected:** Current `main` `app/caffoot-lite.html`, fetched during this checkpoint (8,656 lines; file blob `8e97cd82863d9a7b84d640c89962619065db0c3b`). This is inspection of current repository source, not a newly executed browser test or proof of published package behaviour.

- The virtual host selector at approximately line 6864 lists other devices of type `Server - Physical`. `handleDeviceSubmit()` at approximately lines 7125–7145 rejects a nonempty `virtualHostId` unless it points to an existing physical server other than the edited device.
- The physical device conversion update at approximately lines 7189–7195 assigns the new `type` without an explicit incoming dependency check for virtual devices that still reference its ID.
- `deleteDevice()` starts at approximately line 7209 and constructs a deletion summary from IPAM ownership, reservations and rack placement. The previously recorded source review found no explicit incoming `virtualHostId` dependency check.
- `validateApplicationState()` starts at approximately line 1556; the earlier workflow and audit source traces record that it does not validate `virtualHostId` referential integrity.

**Assessment:** The absence of incoming host relationship safeguards remains a source-supported risk under M-005. Do not claim a reproduced orphan link or a passed browser test. The existing WF-03 test matrix scenarios D10, D11, D12, D13 and D26 cover creation, invalid selection, host deletion, host conversion and malformed imports. All M-005 scenarios remain unexecuted at this checkpoint.

**Recommended product decision, not yet approved:** Prevent deletion or conversion of a physical host while dependent virtual servers remain assigned, show their names and offer a clear path to reassign them first. Preserve historical imported relationships and avoid silently removing links or blocking unrelated saves of older inventories. Agree how existing orphaned references should be displayed and repaired before implementation.

**Next verification:** Inspect the full deletion, import and validation caller paths against the exact intended maintenance revision, then execute the existing scenarios with disposable fictional inventories, including save failure, reload and backup compatibility. Update WF-03, WF-06, function references, test evidence, the master audit and roadmap when evidence or decisions change.

**Documentation checkpoint:** Central remediation programme updated. Existing technical workflows, master audit and WF-03 matrix were inspected and already record this gap, so their historical findings have not been rewritten. No application code changed, no tests executed, and no merge or release authorised. The master audit remains administratively closed with individual P12 gaps open.

### M-005 full deletion and import caller trace, 23 October 2026

A follow-up read of current `main` confirms the specific paths and sharpens the decision:

- `deleteDevice(deviceId)` at lines 7207 to 7219 calculates linked IPAM allocations and reservations, asks for confirmation, removes those records, removes the device and calls `phase11BCommitDelete(before, 'Device')`. It contains **no scan of dependent devices' `virtualHostId` values** and does not mention those dependencies in the confirmation.
- `handleDeviceSubmit()` at lines 7170 to 7205 performs obsolete field confirmation for some type conversions, then writes the new device type and saves. It does **not** check whether other virtual servers use the existing physical server as their host. Its save failure branch restores the prior inventory snapshot.
- `normaliseState(raw)` at lines 1392 to 1429 preserves imported device records and performs legacy field normalisation; no virtual host repair or rejection is visible in this inspected portion. `validateApplicationState()` at lines 1581 to 1600 checks device identity, mount, location, IPAM and rack links, not `virtualHostId`.
- `importData(event)` at lines 7794 to 7877 calls `phase11ValidateBackupShape`, `phase20ValidateBackupVersion`, `phase16CCheckBackup`, confirms replacement, verifies a safety snapshot, saves the candidate and checks persisted readback. The full internals of `phase16CCheckBackup` and its helper validators still need review before concluding precisely which imported orphan references can pass.

**Design recommendation pending owner decision:** Block deletion or conversion of a physical host with dependent virtual servers and show a helpful list of affected names. Require reassignment first; do not silently clear references. Treat imported legacy orphan references as a separate compatibility and repair decision so an existing inventory is not locked out of unrelated saves. Preserve current rollback and safety snapshot protections.

**Verification boundary:** This checkpoint is source inspection only. No browser scenarios D10, D11, D12, D13 or D26 were executed. M-005 remains open; M-008 conversion policy and WF-06 import compatibility must be considered together.

### M-005 product owner decision, 23 October 2026

**Agreed behaviour for new deletion and conversion safeguards, not yet implemented:** A physical server with virtual servers currently assigned to it must not be deleted or converted to another device type. The user must first deliberately reassign each dependent virtual server to a different valid physical server. If no alternative physical server exists, the user may create one and reassign the virtual servers, or deliberately delete the virtual servers individually before proceeding. Caffoot Lite must never automatically delete dependent virtual servers or silently remove their host assignments. Cancellation and failed saves must preserve existing devices and relationships. Show the names of affected virtual servers and explain the necessary action. Apply the same rule to both physical server deletion and conversion.

**Compatibility boundary:** The existing optional host selection for a virtual server is not itself being removed by this decision. Existing malformed or orphaned imported references need a separately agreed, non-destructive review and repair policy. Do not impose stricter global validation that prevents unrelated saves of older inventories.

**Implementation gate:** This records an approved *product rule*, not approval to change application code, merge or release. Complete import validator inspection and agree implementation scope, then execute existing WF-03 D10 to D13 and D26 plus relevant save failure, reload and backup tests before closure. M-005 remains open.

### M-005 hypervisor eligibility and platform design agreement, 23 October 2026

**Product owner agreed design, not implemented:** Physical server eligibility for new virtual server hosting is controlled by one selected hypervisor product. The physical server form should offer a hypervisor selection with recognised choices such as Proxmox VE, VMware ESXi, Microsoft Hyper-V, XCP-ng and KVM, plus a custom option. Selecting a product automatically enables the existing Hypervisor server service; clearing the product disables that service only where it is safe to do so. The service and selected product must not become contradictory independent controls.

A virtual server's host selector should normally offer only physical servers with a saved eligible hypervisor selection. On choosing a host, the virtual server's virtualisation platform should derive from that host's selected hypervisor, rather than allow a conflicting value. The existing optional unassigned host state remains possible for virtual servers unless a separate policy changes it.

**Relationship safeguard:** A physical host with dependent virtual servers cannot be deleted, converted to another device type or have its hypervisor eligibility removed until the dependants have been deliberately reassigned to an eligible physical server or individually deleted. Never automatically delete virtual servers or silently clear existing relationships. Cancelled or failed saves must preserve previous data.

**Compatibility and design questions still open:** Existing physical hosts marked with the Hypervisor service but no named product, imported custom or archived software, historical virtual platform values and malformed host references must remain readable and repairable without blocking unrelated inventory saves. Agree how the software catalogue and custom product choices map to stable identifiers, how platform changes propagate to dependants, and what warnings or migration prompts are appropriate. Inspect the full form render and persistence path before implementation.

**Verification required:** Existing WF-03 D10 to D13 and D26, plus scenarios for eligible/ineligible hosts, automatic service and platform synchronisation, hypervisor removal, custom and archived products, failed saves, reload and legacy backup restore. This is an approved design direction only. No application code change, browser execution, merge or release is authorised by this record.

### M-005 device form and software catalogue source checkpoint, 23 October 2026

Read-only inspection of current `main` source `app/caffoot-lite.html` (blob `8e97cd82863d9a7b84d640c89962619065db0c3b`) confirms:

- The shared Hypervisor server service is `serverService_Hypervisor` (line 6155). `phase120AvailableServerServices()` exposes active services, while `phase19BServerFunctionFields()` and `phase19BFieldsFor(type)` include them in server device details (lines 6165 to 6170, 6418 to 6422).
- `phase19BSoftware()`, `phase120SoftwareOptions()` and `phase120SoftwareFieldsFor(type)` provide saved and suggested installed software choices, including custom options (lines 6335 to 6339, 6392 to 6397, 6415 to 6416). `phase19BRenderFields()` currently renders software and service choices as independent checkboxes (lines 6432 to 6442). There is no single active hypervisor selection in this inspected form path.
- The virtual server form separately offers a manually selected virtualisation platform and all physical servers as host candidates, without checking hypervisor service or software (lines 6856 to 6865). `handleDeviceSubmit()` checks that a selected host exists and is a physical server, but not whether it is hypervisor eligible (lines 7142 to 7144).
- `captureDeviceFormDraft()` retains `virtualPlatform`, `virtualHostId` and `typeDetails` (lines 6947 to 6972). Device save retains these values with rollback on persistence failure (lines 7186 to 7205).

**Design implications:** Use a single active hypervisor product choice with a stable saved identifier, mapped to the existing software catalogue where feasible; derive the existing Hypervisor service state from that choice. Keep other installed software selections independent. Host eligibility and derived virtualisation platform must be enforced at save time, not just by hiding ineligible dropdown entries. A host's hypervisor change must also consider dependent virtual servers and existing custom or archived software.

**Not yet settled:** Whether a host's hypervisor product may be changed in place when dependants exist, and how to handle existing host records with only the legacy Hypervisor service checked. These require explicit compatibility decisions before implementation.

**Evidence limit:** Source inspection only, not an executed browser test. No application code changed. M-005 remains open and WF-03 test matrix scenarios still require execution.

### M-005 hypervisor change propagation decision, 23 October 2026

**Product owner agreed:** When a physical server's selected hypervisor changes, for example from VMware ESXi to Proxmox VE, Caffoot Lite must first show a confirmation identifying the physical host, old and new hypervisors, and all assigned virtual servers. On confirmation, the physical host's selected hypervisor and the recorded virtualisation platform of **every virtual server assigned to that host** must be updated together. Cancellation leaves all records unchanged. A failed save must roll back the host and all dependent virtual servers together, with no partial changes. This is an inventory metadata update; it does not migrate or reconfigure real virtual machines.

Removing hypervisor eligibility entirely remains different: it is blocked until all dependent virtual servers have been reassigned to eligible physical hosts or deliberately deleted individually. Existing legacy records must not be silently rewritten during unrelated edits, imports or reads.

**Verification to add:** Confirmed and cancelled VMware ESXi to Proxmox VE changes with multiple dependants; no dependants; save failure rollback; reload persistence; custom hypervisor choice; legacy platform mismatches and backups. This decision is documented only; implementation, tests and release remain outstanding.

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


## PR #89 checker verification and remaining limits

GitHub Actions run [39983484456](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39983484456) completed successfully for PR #89 head `e395dbd5fbe4169ca1b06beca131f325c00d3c1a`, verifying the existing release documentation consistency workflow on that revision. History secret scan [39983484358](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39983484358) also succeeded. This does not prove semantic accuracy of technical workflows, completeness of finding statuses, or coverage of all mandatory document changes. M-030 remains partially implemented pending an agreed objective coverage check and review gate. No application tests were executed for this checkpoint.


## M-030 objective documentation gate extension, 23 October 2026

PR #89 now includes a proposed extension to the existing release documentation consistency workflow. The checker requires six living audit and policy documents, exactly one current table entry for each finding M-001 through M-031 and each workflow WF-01 through WF-13, and table entries for imported rack scenarios WF02-T01 through WF02-T18. Separate positive and deliberately broken self-test fixtures exercise these checks. This is **structural coverage**, not automatic proof of technical accuracy, test execution, or consistency of every status claim. Existing link and release version checks remain in place. The new GitHub Actions result and final document reconciliation are pending at this checkpoint. M-030 remains **partially implemented** until verification and review are complete. No application behaviour was changed.


## Documentation coverage checker correction, 23 October 2026

GitHub Actions run [39984762571](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39984762571) failed the new structural coverage step because the checker expected a workflow table cell to contain only `WF-01`, whereas the living register uses labels such as `WF-01 Startup and recovery`. The existing release checker self-tests and new audit coverage fixture tests passed in that run; later workflow steps were skipped after the failure. Commit `07c90d21385811ac563f1ea618165936d472b2db` updates the parser to recognise an identifier at the beginning of a labelled cell and adds a representative regression fixture. This is a checker defect, not evidence that all thirteen workflow entries were absent. The corrected CI result and final reconciliation remain pending; M-030 remains partially implemented.


## M-030 corrected CI evidence, 23 October 2026

PR #89 commit `1c42846fad63cc1acc189c9ab2a4c0284cc279d9` passed [release documentation consistency run 39984994151](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39984994151) and [history secret scan run 39984994558](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39984994558). The structural coverage checker and its negative fixtures are now executed within the existing documentation workflow. The failed earlier run 39984762571 was caused by incorrectly parsing labelled workflow table cells and is preserved above as regression evidence. Automated coverage does not prove that all finding statuses, workflow explanations or test claims agree. M-030 remains **partially implemented** pending full semantic reconciliation and owner review. No application tests were executed for this documentation change.

### M-005 and WF-06 backup validator trace, 23 October 2026

**Current main source evidence:** `phase11ValidateBackupShape()` (lines 7543 to 7559) checks required arrays and IP allocation table shape and limits. `phase20ValidateBackupVersion()` (lines 7492 to 7505) checks backup metadata and rejects newer schema versions. `phase20MigrateBackup()` (lines 7507 to 7514) clones the backup, performs limited legacy mounting repair and calls `normaliseState()`. `phase16CCheckBackup()` (lines 7626 to 7643) rejects unsafe keys, checks shape and version, migrates, rejects unsupported mounting, then temporarily validates the candidate with `validateApplicationState()` and restores the original `appState` in a `finally` block. The inspected `validateApplicationState()` path does not check `virtualHostId`. Thus the current import integrity gate does **not** establish that a virtual server's referenced physical host exists or has hypervisor eligibility. This is a source-supported gap, not a browser-reproduced import failure.

**Catalogue evidence:** `phase120SoftwareSuggestions` (line 3455) already includes VMware ESXi, Proxmox VE and Microsoft Hyper-V for physical servers. These should be considered for the proposed single active hypervisor selector; other choices including XCP-ng, KVM and custom hypervisors require an explicit catalogue mapping decision.

**Recommended compatibility design for agreement:** On import, preserve legacy host references and platform values and present a non-destructive review of missing hosts, ineligible hosts and platform mismatches. Do not silently rewrite them or globally prevent unrelated saves. Confirm precise handling, error versus warning criteria and repair actions with the product owner before implementing. Cross-reference WF-03 D26 and WF-06 import verification. Source inspection only; no runtime test executed.


### M-005 hypervisor product and version catalogue proposal, 23 October 2026

**Product owner suggestion, proposed for design review:** Follow the existing server operating system pattern by offering a hypervisor product selector and a separate version selector, including historical versions. Extend the suggested products beyond the existing VMware ESXi, Proxmox VE and Microsoft Hyper-V to consider XCP-ng, XenServer/Citrix Hypervisor, KVM, VMware vSphere Hypervisor historical naming, Nutanix AHV, Oracle VM Server, oVirt and other relevant products. Validate exact product names, support histories and version values before adding any starter catalogue entries. Include a custom product and custom version for uncommon or older installations.

**Recommended data model for agreement:** Store a stable hypervisor product identifier and a separately recorded version string on the physical server. The selected product determines eligibility and the dependent virtual servers' platform identity. A version-only update should not reassign virtual servers or change their platform identity. A change of product triggers the already agreed confirmation and atomic update of all dependent virtual server platform metadata. Avoid inferring installed versions from arbitrary software checkbox labels. Reuse or reconcile existing software catalogue choices and preserve legacy software and Hypervisor service selections.

**Status:** Proposed enhancement, not yet approved as an exact catalogue or schema, implemented or tested. Review server OS selector source and version catalogue before finalising design. Existing M-005 safeguards and WF-03 planned tests remain open.


### M-005 guest operating system independence decision, 23 October 2026

**Product owner agreed design:** Each virtual machine retains its own independently selected guest operating system and version, regardless of the physical host's hypervisor product and version. Guest choices must accommodate server operating systems and virtual network appliances such as OPNsense and pfSense, as well as custom or historical operating systems. Changing the physical host's hypervisor product updates the assigned virtual machines' recorded hypervisor platform only, following the agreed confirmation and atomic save rule; it must **never** overwrite their guest operating systems, versions or other unrelated device details. Changing only the physical host's hypervisor version does not alter dependent virtual machines.

**Design detail requiring further inspection:** The existing device type and OS catalogue may classify firewalls and routers separately from virtual servers. Inspect and reconcile the current OS selector and device type rules before implementing cross-category guest OS selection. Preserve legacy values and avoid blocking unrelated inventory saves.

**Status:** Product design approved, application implementation not approved or started. No tests executed. Add guest OS independence and appliance OS scenarios to WF-03 verification before implementation.


### WF-03 and WF-08 targeted device type consistency review, 24 October 2026

**Product owner requested a further check before assuming other device types are sound.** Extend the existing WF-03 device lifecycle and WF-08 catalogue coverage, without reopening or duplicating the entire historical audit. Review physical and virtual servers, desktop, laptop, tablet, firewall, router, switch, wireless equipment, NAS, printer and any additional configured device types. For each, trace current form fields, operating system and firmware choices, software and service applicability, edit and conversion behaviour, save failure recovery, import compatibility, archived or custom catalogue values and preservation of existing records.

**Reason:** Earlier source assessment and the absence of recorded defects are not proof that every device type is correct. Give each reviewed type an evidence status: source inspected, test executed, issue found, or further verification required. Cross-reference WF-03, WF-08, M-005, M-008 and the relevant test matrices. Do not claim passing tests without execution.

**Scope and approval:** Investigation and documentation only. No application behaviour changes, merge or release authorised. Reconcile findings into the master audit register and roadmap before closing this review.

