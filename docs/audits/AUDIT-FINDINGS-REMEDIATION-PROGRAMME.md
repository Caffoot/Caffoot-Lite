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
| All numbered maintenance findings | Findings table above and historical maintenance register | All numbered findings recorded; individual dispositions vary | Verify each finding against original evidence, assign an approved release or explicit deferral, preserve closures and record verification | Review throughout; prioritise data safety first |
| WF-01 to WF-13 and P12 | [Workflow verification coverage register](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md) and [master audit](V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md) | Individual completion gates incomplete despite administrative audit closure | For each workflow record source coverage, previously executed evidence, untested scenarios, owner disposition and release gate | Alongside relevant M findings, then final P12 reconciliation |
| Imported rack fixtures WF02-T01 to WF02-T18 | [Imported rack test matrix](../testing/WF-02-IMPORTED-RACK-TEST-MATRIX.md) | Fixture-specific execution outstanding | Confirm expected compatibility policy and execute or explicitly defer each scenario with evidence | With M-010 and M-019 |
| Function naming and caller reference, M-007 | [Function naming and reference](../standards/technical/FUNCTION-NAMING-AND-REFERENCE.md) | Partial inventory and proposed names; no renames implemented | Complete significant declaration and caller coverage, decide retain versus rename, assess dependencies and tests; schedule approved renames separately | After urgent integrity work; before substantial v1.4 development |
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

The top-level `importData(event)` caller sequence, candidate validation, verified pre-restore safety copy, saved candidate readback, original inventory rollback, previous safety copy restoration and recovery mode activation have now been inspected in current `main` source and documented in the [function reference](../standards/technical/FUNCTION-NAMING-AND-REFERENCE.md#m-011-import-rollback-call-chain-source-inspection-23-october-2026) and [WF-06 and WF-12](../workflows/TECHNICAL-WORKFLOWS.md#wf-06-and-wf-12-m-011-current-source-trace-23-october-2026). This is source inspection, not a newly executed test. Complete helper internals and untested backup variants remain outstanding. Historical passing run 39959581469 remains the executed evidence.


## Test matrix reconciliation, 23 October 2026

The [workflow verification coverage register](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md) summarises WF-01 through WF-13. Dated evidence notes were added to the existing WF-01, WF-02 saving, WF-03, WF-04 and WF-05 test matrices, preserving their historical plans while identifying previously executed targeted Chromium assertions. Individual matrix completion remains unverified, and the imported rack matrix and other workflow test cases still require detailed review. No new application tests were executed during this documentation update.


## Imported rack verification boundary

The [imported rack test matrix](../testing/WF-02-IMPORTED-RACK-TEST-MATRIX.md) retains 18 pending fixture-specific scenarios. Previous release compatibility and M-011 rollback runs are related evidence, not proof that the imported accessory collision and malformed placement cases were executed. M-010 and M-019 remain open. The [coverage register](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md) records this distinction.


## M-030 automation assessment, 23 October 2026

Source inspection of `.github/workflows/caffoot-lite.yml` shows the existing build and Chromium workflow runs on pushes to `main` that change `app/**` or that workflow itself, plus manual dispatch. Its steps build the standalone HTML, validate inline JavaScript and run six browser scripts. **The inspected workflow does not automatically run on documentation-only pull requests and contains no explicit documentation cross-reference or version consistency check.** This is a workflow configuration inspection, not an executed CI test. The [release checklist](../releases/RELEASE-CHECKLIST.md) now records a manual documentation and version gate, but M-030 remains open until automated coverage is agreed, implemented and tested. No CI workflow was changed in this checkpoint.


## Correction to M-030 automation assessment, 23 October 2026

The preceding assessment examined only `.github/workflows/caffoot-lite.yml` and must **not** be read as saying the repository has no documentation CI. The separate `.github/workflows/release-documentation.yml` already runs on `pull_request` and manual dispatch. It executes self-tests and repository checks through `scripts/check-documentation-links.cjs` and `scripts/check-release-documentation.cjs`, covering local Markdown targets, heading anchors and published or candidate release statements. This was verified by inspection of the current workflow and both checker scripts, not by executing them at this checkpoint. M-030 is therefore **partially implemented**, not wholly absent. Remaining work is to confirm successful PR #89 execution and assess gaps such as mandatory documentation coverage and human reconciliation of technical accuracy. Do not duplicate the existing workflow or treat a link check as proof that workflow content is correct.


## Documentation accuracy acceptance gate, 23 October 2026

The [technical documentation policy](../standards/technical/TECHNICAL-DOCUMENTATION-POLICY.md) and pull request template now require an inventory of existing safeguards before proposing replacements, explicit impact assessment, and final reconciliation of workflow, test, finding, roadmap, release and master audit records. A pull request with unresolved mandatory documentation discrepancies is **not ready for approval to merge**. The existing release documentation CI is retained. M-030 remains partially implemented because these additional requirements have not yet been enforced or verified automatically. No application tests were executed for this policy change.


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


## 24 October 2026 design decisions and open verification

The [maintenance design review](../roadmaps/V1.3X-MAINTENANCE-DESIGN-REVIEW.md) and [device/software compatibility matrix](../workflows/DEVICE-SOFTWARE-COMPATIBILITY-MATRIX.md) record owner-agreed proposals for physical and virtual device types, historical/custom compatibility, hypervisor host relationships, software and server services. These are **not implemented or tested**. M-005 and WF-03/WF-08 must verify host/guest separation, conversion preservation, historical values, catalogue eligibility, service archive and backup round trips. WF-07 covers form clarity and confirmation interaction. Do not close any finding based solely on design agreement. Refer to [workflow verification coverage](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md) and [WF-03 matrix](../testing/WF-03-DEVICE-LIFECYCLE-TEST-MATRIX.md). Master audit remains administratively closed with incomplete P12 coverage.

## WF-06 backwards compatible import decision, 24 October 2026

**Owner agreed design:** Apply lossless, unambiguous older-format mappings silently on JSON import, preserve custom/unknown data, and ask for approval for ambiguous or potentially destructive changes. Retain source backup unchanged and safeguard existing inventory. Cross-reference [design review](../roadmaps/V1.3X-MAINTENANCE-DESIGN-REVIEW.md) and [verification register](../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md). Pending WF-06 implementation and tests; no finding closed.

## Legacy import mapping plan cross-reference, 24 October 2026

The [legacy import compatibility matrix](../testing/LEGACY-BACKUP-IMPORT-COMPATIBILITY-MATRIX.md) records source-inspected backup export/import entry points, mapping categories and missing fixture evidence. WF-06 migration verification remains open; no finding closed.

## Open investigation: hosted virtual device relationship integrity, 24 October 2026

Source inspection identified a potential gap: `deleteDevice` does not inspect virtual dependants, and the general integrity validator does not appear to validate `virtualHostId`, although the virtual server edit form checks a selected physical host. Historical source inspection shows the field from v1.2.0, but not v1.0.0. This is an **open investigation**, not a reproduced defect, passed test, closed finding or change to the administratively closed v1.3.0 audit.

Owner agreed design: prevent silent loss of hosted relationships for all virtual device categories, permit explicit unassignment where no replacement host exists, preserve former host identity and history, offer retirement, and use a clear relationship diagram during review. A broader virtual device hosting model requires separate implementation approval. See [legacy compatibility and host relationship test plan](../testing/LEGACY-BACKUP-IMPORT-COMPATIBILITY-MATRIX.md) and [maintenance roadmap](../roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md). Runtime verification, implementation, priority and release placement remain open.

## Open design consistency work, 24 October 2026

The proposed [Design and Interaction Standards](../standards/design/DESIGN-AND-INTERACTION-STANDARDS.md) record owner agreed reusable patterns and a design review gate. Existing component duplication and implementation consistency have not been audited in this checkpoint. This is an open design and investigation item, not a verified defect, passed test or closed finding. See the [maintenance roadmap](../roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md).

**M-005 decision reconciliation, 24 October 2026:** The 23 October rule requiring all dependants to be reassigned or deleted is historical and is superseded by the later owner agreed choice of valid reassignment, explicit unassignment with previous host provenance, or dependant retirement with retained history. A host's own retirement is not equivalent to deleting it. All affected dependants must be reviewed before host deletion or incompatible conversion; cancellation and failed persistence must leave records unchanged. No silent deletion, inferred host or automatic repair is permitted. This supersession changes the proposed design only, not current v1.3.0 behaviour or the status of M-005. Source inspection does not count as an executed browser test.

## M-005 full current source recheck, 24 October 2026

Read directly from `app/caffoot-lite.html` on branch `docs/post-pr89-status-reconciliation` at commit `065d32bb5fb6525cb82fbdb38802deb5ce6aaf4a`. The virtual server form lists physical servers as optional hosts (lines 6856 to 6865). `handleDeviceSubmit` reads `virtualHostId` only for `Server - Virtual` and checks a nonempty selected host against an existing `Server - Physical` (lines 7142 to 7144). The same save can convert an existing physical host to another type without checking incoming host references (lines 7173 to 7192). `deleteDevice` checks IPAM links and rack state but not dependent `virtualHostId` references (lines 7207 to 7218). `normaliseState` preserves device records and does not resolve virtual hosts (lines 1392 to 1429). `validateApplicationState` checks device identity, mounting, location, IPAM and rack references but does not check virtual host relationships in its device loop (lines 1581 to 1600). `phase16CCheckBackup` calls that validator against a detached candidate (lines 7626 to 7642), so it does not independently establish host referential integrity. `importData` retains its pre-restore safety snapshot, persistence readback and rollback protections (lines 7823 to 7862). This is source evidence of missing relationship checks, not a browser reproduction. M-005 remains open. Do not introduce global strict rejection of older orphaned links; use explicit repair and provenance preserving decisions.

**M-005 browser baseline test preparation, 24 October 2026:** Commit `90364f6` adds two disposable fictional Chromium scenarios to `app/test-browser-consolidated-audit.cjs`: deleting a physical host referenced by two virtual servers (D12 baseline), and validating a virtual server referencing a missing host (D26 related integrity baseline). Assertions deliberately characterise the current source observed gaps, not the agreed future behaviour; they must be replaced or extended with protection acceptance assertions after implementation. No test execution or pass is claimed until the GitHub Chromium workflow reports a result. Physical host conversion D13, full backup import D26, save failure, rehost, explicit unassignment and retirement remain untested. No application code changed; M-005 remains open.

**M-005 executed Chromium baseline, 24 October 2026:** [Consolidated Chromium run 40077572183](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40077572183) completed successfully against test commit `90364f680b9d94282948d2f3eb655f22d5b0be27`. Two new fictional inventory characterisation cases executed: deleting physical host `fictional-host-001` leaves both dependent virtual servers with orphaned `virtualHostId` references (D12 baseline); `validateApplicationState()` does not report the deliberately missing `virtualHostId` on a virtual server (D26 related validator baseline). These passing baseline assertions **confirm the unsafe existing behaviour**, not the proposed safeguard. Other pre-existing consolidated suite scenarios also ran within the successful workflow, but this evidence does not certify D10, D11, D13, full D26 backup import, or H01 to H08. M-005 stays open, with future acceptance tests required. No application code change, merge or release.

**M-005 next baseline test change, 24 October 2026:** Test commit `919bf866543d82d7860703100fc8e57403b930c3` adds a detached legacy backup candidate test with a fictional orphan `virtualHostId`, checking import validation and source JSON preservation, plus a Chromium executed *source function inspection* of the conversion handler for a direct incoming host guard. The latter is not a full form submission or conversion reproduction; WF-03 D13 remains unexecuted. The backup candidate check does not exercise full FileReader restore or safety snapshot; full WF-06 import remains outstanding. Both new checks await Chromium results. M-005 stays open; no application behaviour changes, merge or release.


## PR #90 Chromium evidence reconciliation, 24 October 2026

GitHub Actions [consolidated Chromium run 40082999108](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40082999108) completed successfully for documentation branch commit `9dd15ae263713effe632a7cbcceb7df69b43bbf0`. The release documentation consistency, release candidate validation and Git history secret scan runs for the same commit also completed successfully (runs 40082998977, 40082999092 and 40082998997 respectively). This supersedes the earlier *awaiting Chromium results* statement for test changes introduced at `919bf866`, without rewriting the historical checkpoint. GitHub Actions evidence is not a locally executed test. The added checks cover detached legacy candidate validation and conversion handler source inspection; they do not constitute a complete device conversion submission, full FileReader backup restore, safety snapshot or rollback verification. M-005 remains open. D13, full D26, rehosting, explicit unassignment, retirement and save failure acceptance tests remain outstanding. Project membership verification and final PR #90 cross document approval gates remain open. No application behaviour change, merge or release is authorised by this evidence.

### M-006 implementation checkpoint, 24 October 2026

Product owner approved the limited M-006 implementation scope, not merge or release. Branch `fix/m006-ipam-note-ownership` changes device primary IP updates so address notes are not populated from device notes, releases device-owned and manually or bulk released IPAM records to Available without deleting address information, and clarifies the subnet description and IPAM notes form labels. Bulk reservation entry continues to apply entered notes to eligible addresses; the preview now warns that existing address notes will be replaced. This is an initial implementation requiring source review, historical backup and browser regression tests, particularly IPAM consistency validation, Available records with retained metadata, reservation references, failed saves, gateway handling and bulk edit preview accuracy. WF-03 and WF-04 matrices require case-by-case updates with actual evidence. M-006 and issue #92 remain open. M-009 and M-024 remain separate open investigations. No test is claimed as passed, and no merge or release is authorised.

M-006 follow-up, 24 October 2026: source inspection found IPAM repair proposals copying device notes into address notes. Commit `466b76c` removes notes from proposed repair fields. Individual IP release form edits were retained in commit `2feb7db`. These are committed but untested corrections. Browser checks, historical JSON imports, reservation semantics and final cross-document reconciliation remain outstanding. M-006, M-009 and M-024 remain open. No merge or release.

M-006 normalisation checkpoint, 24 October 2026: `normaliseState()` was confirmed to overwrite existing IPAM notes from device notes on startup and JSON import. Commit `ef2c42b` preserves existing address notes and initialises new missing IPAM records with blank address notes. Source inspection of `validateApplicationState()` shows that Available allocations with retained metadata are not intrinsically rejected; reservation reference behaviour still requires M-024 policy and regression tests. No browser or historical JSON tests executed. M-006, M-009 and M-024 remain open, master audit sign-off pending, no merge or release.

M-006 device deletion and reservation checkpoint, 24 October 2026: `deleteDevice()` previously deleted IPAM records linked to a deleted device, including address notes. Commit `1134149` changes those records to Available and clears active `deviceId` while retaining address metadata. Source inspection confirms that individual and bulk release paths currently retain `reservedForDeviceId`, potentially leaving an Available address with an active reservation reference. No policy change to reservation references has been implemented pending explicit product owner agreement and M-024 investigation. Device deletion, rollback, subnet deletion and historical backup tests remain NOT EXECUTED. M-006, M-009 and M-024 remain open. No merge or release. Master audit final sign-off pending.

M-006 agreed release semantics, 24 October 2026: product owner approved clearing active `reservedForDeviceId` on deliberate individual and bulk release while preserving IPAM address notes and descriptive metadata. Commit `5207a41` implements these two release paths. Device deletion address preservation was committed in `1134149`. Historical import reservation references remain untouched pending M-024. Source changes committed, but targeted browser, rollback, import and automated regression tests have NOT been executed. M-006, M-009 and M-024 remain open. No merge or release; final master audit reconciliation pending.

M-006 CI checkpoint, 24 October 2026: GitHub release candidate validation run `40121762957` failed in `check:personal` (`app/check-app.cjs`, `notes sync`), because the legacy test expected device notes to overwrite IPAM notes. Earlier source contract checks in that run passed; later release checks were not executed because the job stopped. Commit `d7f031d` updates assertions to require independent IPAM notes and retained Available records after release. This correction has not yet been confirmed by a new CI run. Consolidated Chromium run `40121762915` was in progress at the time of inspection. No merge or release. M-006, M-009 and M-024 remain open, final reconciliation pending.

M-006 verification checkpoint, 24 October 2026: GitHub release candidate run `40122070808` failed at `app/check-app.cjs:392`, where an outdated fixture expected a previous allocation to be deleted when a device claimed its own reserved IP. Earlier device deletion, rollback, backup, source parsing and subnet checks in that run passed. Commit `1126ade` now expects the old allocation to remain Available with cleared `deviceId`. Source inspection found no further `ipAllocations` versus `undefined` assertions in this test file, but this is not proof all legacy assumptions have been removed. New CI run and targeted historical import tests pending. M-006, M-009 and M-024 remain open; no merge or release; master audit final reconciliation pending.

M-006 CI checkpoint, 24 October 2026: release validation run `40122208391` failed at `app/check-app.cjs:503` because a structural fixture still required `notes: device.notes || ''` in `syncDeviceIpamRecord()`. Commit `8d58f33` updates the fixture to require `notes: existing.notes || ''`, preserving independent address notes while retaining ownership, hostname and rollback checks. Chromium regression and history secret scan on preceding commit passed. This new test correction has NOT yet passed a fresh release validation run. M-006, M-009 and M-024 remain open; historical import and final reconciliation outstanding; no merge or release.

M-006 focused historical backup and Available address review, 24 October 2026: source inspection confirmed `normaliseState()` preserves existing allocation notes and the device assignment path retains address notes. A further edge case was identified in `handleIpSubmit()`: saving notes for an Available address with no prior allocation record silently discarded those notes. Commit `a7a4cee` creates an Available allocation record when hostname or notes are supplied, retaining the existing no-record behaviour for blank entries. This is a source-reviewed correction, not a passed browser or backup import test. All four CI workflows passed on earlier commit `6dd4ad9`; new CI after this change is pending. M-006, M-009 and M-024 remain open. Master audit final reconciliation outstanding; no merge or release.

M-006 regression test checkpoint, 24 October 2026: commit `cc7cd89` adds a source contract to `app/check-app.cjs` requiring the Available IP editor to create a record when new notes or hostname are supplied and retain failed-save rollback. This is a source contract, NOT an executed end-to-end browser or historical JSON import test. Await fresh CI results. The full assign, move, reload and legacy import scenario remains to be implemented and executed. M-006, M-009 and M-024 remain open; final audit reconciliation pending; no merge or release.

M-006 test checkpoint, 24 October 2026: commit `56e4b6d` strengthens the executable Node device/IPAM fixture with distinct existing notes on two Available addresses, assignment, device rename and notes change, IP move, release preservation and JSON serialisation round trip. This is not a real browser reload or legacy backup import test. At the previous checkpoint release candidate validation, documentation consistency and secret scan passed; Chromium was in progress. Fresh CI for this commit is pending. M-006, M-009 and M-024 remain open; master audit final reconciliation outstanding; no merge or release.

M-006/M-024 bulk release checkpoint, 24 October 2026: source review found `phase12BBulkPlan()` skipped Available records carrying stale `reservedForDeviceId`. Commit `71aed13` now plans explicit bulk release when status, ownership or active reservation requires clearing, retaining address notes via object spread. Commit `8f100df` adds a source contract for this path; not an executed browser scenario. Historical backup normalisation was inspected but historical import has NOT been exercised end to end. Fresh CI pending. M-006, M-009 and M-024 remain open; master audit final reconciliation pending; no merge or release.

M-006 historical backup fixture, 24 October 2026: commit `78a8291` adds an isolated Node VM test invoking the production `normaliseState()` on representative older JSON. It asserts preservation of IPAM address notes, repair of a current primary IP owner, and preservation of an unrelated historical `reservedForDeviceId` and notes. Fixture is synthetic, not a user backup and not a browser import. Execution pending fresh release validation. M-006, M-009 and M-024 remain open; final master audit reconciliation outstanding; no merge or release.

M-006 legacy migration checkpoint, 24 October 2026: commit `ca22a6f` adds an executable Node VM fixture calling production `phase20MigrateBackup()` with a synthetic unversioned historical inventory. It checks that the input JSON is not mutated and that both address notes and historical reservation reference/notes survive migration. Backup version validation and mount repairs are stubbed in this isolated fixture, so this does NOT establish a full browser restore, saved storage or reload. CI execution pending. M-006, M-009 and M-024 remain open; master audit reconciliation outstanding; no merge or release.

M-006 restore persistence checkpoint, 24 October 2026: commit `b8d3653` extends existing `app/test-restore.cjs` executable restore success fixture to assert IPAM notes, historical `reservedForDeviceId` and notes persist in simulated browser storage, including a JSON reload round trip. The restore harness stubs migration and validation and uses fake FileReader and storage, so it does NOT constitute a real Chromium file import. Fresh CI pending. All four CI workflows passed for preceding commit `d69baa9`. M-006, M-009 and M-024 remain open; master audit final reconciliation outstanding; no merge or release.

Documentation reconciliation checkpoint, 24 October 2026: WF-04 test matrix N22 was corrected to preserve IPAM address notes and historical metadata on explicit release, rather than expecting allocation deletion; its heading now distinguishes executed targeted Chromium regressions from the unexecuted full browser matrix. Release validation run 40128949449 and Chromium run 40128949458 passed on commit `65cd711`. Dedicated browser N22 and historical import N31 remain outstanding. This is documentation work only. M-006, M-009 and M-024 remain open; full cross-reference reconciliation still outstanding; no merge or release.

25 October 2026 browser import checkpoint: commit `a45ae6a` adds a disposable Playwright Chromium N31 scenario that uses the real file input to import an unversioned fictional JSON inventory with two distinct Available address notes, accepts the restore confirmation, and checks browser storage and notes after reload. CI execution is pending. This does not yet test historical missing device reservation references or N22 release. M-006, M-009 and M-024 remain open; final audit reconciliation outstanding; no merge or release.

25 October 2026 N31 diagnostic checkpoint: real Chromium import test run [40166696469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40166696469) failed waiting for expected notes in saved browser storage after 10 seconds; all earlier consolidated scenarios passed. Root cause is not yet known. Commit `13ccd3a` adds failure diagnostics for import modal, stored allocations, in-memory notes and selected file, without changing application behaviour or relaxing assertions. Rerun pending. N31 not passed; M-006, M-009 and M-024 remain open; master audit final reconciliation pending; no merge or release.

25 October 2026 N31 root cause checkpoint: Chromium run [40166851883](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40166851883) exposed an invalid synthetic backup: IP allocations `10.88.77.2` and `.3` lacked a parent subnet. The real import validator rejected it without replacing the inventory, as designed. Commit `8af4808` adds the matching fictional `10.88.77.0/29` subnet to the test fixture; application behaviour and assertions unchanged. New CI execution pending. N31 remains unverified; M-006, M-009 and M-024 open; final master audit reconciliation pending; no merge or release.

25 October 2026 M-024 historical reservation browser verification: commit `c24366a` extended the real Chromium N31 JSON import and reload test to assert that an Available address's `reservedForDeviceId` referencing a missing fictional device survives in memory and persisted storage. [Consolidated Chromium run 40167139071](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40167139071) passed; release validation 40167139149, documentation consistency 40167139076 and secret scan 40167139069 also passed. This is targeted executed evidence, not full N31 matrix completion or N22 release verification. M-006, M-009 and M-024 remain open; final master audit reconciliation pending; no merge or release.

25 October 2026 N22 Chromium regression checkpoint: commit `845ebd7` adds an isolated browser scenario exercising the production individual IP save handler and bulk release path on fictional allocations, including a stale historical reservation on an already Available address. It asserts address notes, legacy metadata, cleared ownership and reservation, persisted storage and reload. This uses production handlers in a real browser but synthesises input controls rather than clicking through the entire IPAM UI. Execution pending; do not mark N22 passed. M-006, M-009 and M-024 remain open; final master audit reconciliation outstanding; no merge or release.

25 October 2026 N22 verification checkpoint: [Chromium run 40167357274](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40167357274) passed on commit `2956459`, including individual and bulk IPAM release handler tests with persistence and reload. [Release validation 40167357281](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40167357281), documentation consistency 40167357227 and secret scan 40167357232 also passed. This is executed handler-level browser evidence, not a complete UI click-through or all N22 permutations. Published v1.2.1 to v1.3.0 compatibility workflow exists but was not executed in this checkpoint; current candidate compatibility against those releases remains to verify. M-006, M-009 and M-024 open; final audit reconciliation pending; no merge or release.
