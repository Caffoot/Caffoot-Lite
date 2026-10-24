# WF-03 Device Lifecycle: Controlled Test Matrix

**Baseline:** Published Caffoot Lite v1.3.0. **Status:** Test design only. No browser tests executed. Source findings are recorded in `docs/workflows/TECHNICAL-WORKFLOWS.md`. This matrix does not authorise application changes.

## Safety and evidence

Use a disposable browser profile and fictional inventory. Export a backup before destructive tests. Record the exact HTML version, fixture, expected and actual results, screenshots, console errors, save and reload outcome, and whether the previous inventory survived a failure. Never run destructive scenarios against a user's real inventory.

## Scenarios

| ID | Scenario | Expected check and evidence |
| --- | --- | --- |
| D01 | Create a valid device and reload | All fields and linked records persist correctly |
| D02 | Reject empty or duplicate device name, including case changes | Clear error; no inventory mutation |
| D03 | Reject invalid status, location or mounting choice | No partial save |
| D04 | Set valid subnet and primary IP | Correct device and IPAM ownership after reload |
| D05 | Attempt duplicate or out-of-subnet primary IP | Reject without modifying old IPAM record |
| D06 | Change an owned primary IP | Old owned allocation handled safely; new allocation consistent |
| D07 | Change primary IP when old IPAM record belongs to another device | Other owner's allocation remains intact |
| D08 | Assign a permitted router, firewall or Layer 3 switch to gateway IP | Ownership consistent with subnet and IPAM policy; see WF-04 |
| D09 | Attempt gateway primary IP on disallowed device type | Reject without changing records |
| D10 | Create virtual server with valid physical host | Host reference persists and displays correctly |
| D11 | Set missing, self-referential or nonphysical virtual host | Reject invalid reference |
| D12 | Delete physical host referenced by virtual server | Determine whether orphan link is blocked, repaired or persists; record source safeguard gap |
| D13 | Convert physical host with dependent virtual servers to another type | Check dependent references; record source safeguard gap |
| D14 | Convert device type with incompatible catalogue details | Explicit confirmation, retained compatible fields, archived incompatible fields |
| D15 | Cancel type conversion | No loss of existing details |
| D16 | Duplicate device | New identity, appropriate unique fields, no accidental shared allocation |
| D17 | Assign rack-mounted device to valid U and face | Placement, location and saved state consistent |
| D18 | Reject invalid rack, out-of-bounds or overlapping placement | No partial change; cross-reference WF-05 |
| D19 | Unassign device and reload | Rack reference cleared, location preserved; investigate unchecked save and retained rack fields |
| D20 | Force storage failure during device create or edit | Previous state restored in memory and persistent storage; visible error |
| D21 | Force storage failure during rack unassignment | Verify source-observed unchecked save result and actual recovery behaviour |
| D22 | Delete device with IPAM allocations and reservations | Confirmation, linked cleanup and retained unrelated records |
| D23 | Cancel deletion | Inventory unchanged |
| D24 | Force save failure during deletion | Full snapshot restored; no false success |
| D25 | Edit form, cancel or press Escape | Correct unsaved-change protection and no data loss |
| D26 | Import legacy or malformed device/host links in fictional backup | Clear validation outcome; no silent loss; cross-reference WF-02 and WF-06 |

## Exit criteria

Review every function and caller encountered against `docs/standards/technical/FUNCTION-NAMING-AND-REFERENCE.md` and P11 comments. Record defects and improvement candidates in the coverage audit and maintenance roadmap, distinguishing source-confirmed gaps from browser-reproduced issues. Mark each scenario **planned**, **passed**, **failed**, **blocked** or **not applicable**, with evidence. Documentation completeness does not mean test verification.

## Host dependency test precision, 22 October 2026

D10 and D11 exercise the explicit `handleDeviceSubmit()` check that a chosen virtual host is an existing, different `Server - Physical` device. D12 and D13 deliberately exercise **incoming** host dependencies when that physical device is deleted or converted; the published handler does not explicitly inspect those incoming references. D26 covers malformed imported relationships, where the central validator also lacks a `virtualHostId` check. Keep these distinct: a valid virtual-host selector on one form does not guarantee referential integrity when the host changes later. Existing D10–D13 and D26 already cover the issue, so no new scenario IDs are required. All remain planned and unexecuted.


## Evidence update, 23 October 2026

The opening statement that no browser tests were executed is historical wording from the original matrix design. **A targeted M-020 failed device graphic save scenario was subsequently executed and passed** in [Chromium run 39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113), after the correction merged through [PR #79](https://github.com/Caffoot/Caffoot-Lite/pull/79). This does **not** certify the wider device lifecycle, host relationships, device conversion or the whole matrix. M-005 and M-008 remain subject to investigation and product decisions. See [coverage register](WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md). No tests were run for this documentation update.

### Proposed M-005 hypervisor design test additions, 23 October 2026

These scenarios are **planned, not executed**, and concern future approved application behaviour, not the published v1.3.0 baseline:

| ID | Proposed scenario | Expected result |
| --- | --- | --- |
| H01 | Select recognised or custom hypervisor on physical server | Exactly one active hypervisor, existing Hypervisor service synchronised |
| H02 | Create virtual server and choose eligible host | Only eligible new hosts offered; platform matches selected host |
| H03 | Attempt to select physical server without hypervisor | New invalid assignment blocked at save, not only in selector |
| H04 | Confirm host VMware ESXi to Proxmox VE change with several VMs | All dependent platform metadata changes in one verified save |
| H05 | Cancel hypervisor change or force save failure | Host and every dependent VM remain unchanged |
| H06 | Remove hypervisor or delete or convert host with dependants | Require an explicit reviewed outcome for every dependant: eligible reassignment, unassignment with former host provenance, or retirement retaining history. Block unsafe changes and preserve state on cancellation or failed save |
| H07 | Import legacy host links, missing hosts and platform mismatches | Non-destructive review and repair policy, no silent loss or unrelated save lockout |
| H08 | Reload, export and reimport custom or archived hypervisor choices | Stable selection and relationships survive round trip |

Retain D10 to D13 and D26 as the original baseline scenarios; do not treat H01 to H08 as passed or as implementation approval.


## Proposed conversion and server software regression cases, 24 October 2026

**Pending, not executed:** Edit a historical/custom type without changing type and preserve all `typeDetails`; change device type and cancel conversion without mutation; confirm conversion and verify active values and `previousTypeDetails`; preserve archived custom software and server services; distinguish OS/firmware, host hypervisor, installed applications and service roles; confirm physical and virtual servers share ordinary service eligibility; ensure host hypervisor setting and legacy `serverService_Hypervisor` remain compatible; verify guest OS independence and dependent VM host protection; test save failure rollback, backup/export/import and duplicate round trips; check keyboard and confirmation behaviour with WF-07. These are proposed regression scenarios for approved future implementation, not successful test results. See [design review](../roadmaps/V1.3X-MAINTENANCE-DESIGN-REVIEW.md) and [compatibility matrix](../workflows/DEVICE-SOFTWARE-COMPATIBILITY-MATRIX.md).

**Additional unexecuted M-005 scenarios, 24 October 2026:** For host deletion and incompatible conversion, verify each dependent virtual server can be explicitly reassigned, left unassigned with former host provenance, or retired without losing history; mixed outcomes, cancellation and failed persistence must not alter records. Check orphaned and historical imported host IDs without preventing unrelated saves. Future virtual device categories require separate fixture coverage when their host model exists. These are planned scenarios, not test results.

**M-005 source trace and pending runtime evidence, 24 October 2026:** Source inspected: virtual host form save `handleDeviceSubmit` lines 7142 to 7144, conversion lines 7173 to 7192, deletion `deleteDevice` lines 7207 to 7218. The latter two paths have no incoming virtual host dependency scan. Execute dependent host deletion and conversion scenarios, mixed reassignment/unassignment/retirement, cancellation, failed persistence, reload, and historical host IDs before any implementation claim. No browser test executed in this checkpoint.

**Execution route reviewed, 24 October 2026:** The existing `.github/workflows/audit-consolidated-chromium.yml` runs on `workflow_dispatch` or a pull request changing the HTML, consolidated test script or workflow itself. The existing `app/test-browser-consolidated-audit.cjs` has no `virtualHostId` coverage. A documentation-only PR does not automatically run these host scenarios. Add isolated fictional M-005 cases to the browser suite on a separately reviewed test change, or explicitly dispatch a suitable workflow after coverage is present. Do not mark D10 to D13, D26 or H01 to H08 as executed on the strength of documentation CI.

**M-005 browser baseline test preparation, 24 October 2026:** Commit `90364f6` adds two disposable fictional Chromium scenarios to `app/test-browser-consolidated-audit.cjs`: deleting a physical host referenced by two virtual servers (D12 baseline), and validating a virtual server referencing a missing host (D26 related integrity baseline). Assertions deliberately characterise the current source observed gaps, not the agreed future behaviour; they must be replaced or extended with protection acceptance assertions after implementation. No test execution or pass is claimed until the GitHub Chromium workflow reports a result. Physical host conversion D13, full backup import D26, save failure, rehost, explicit unassignment and retirement remain untested. No application code changed; M-005 remains open.

**M-005 executed Chromium baseline, 24 October 2026:** [Consolidated Chromium run 40077572183](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40077572183) completed successfully against test commit `90364f680b9d94282948d2f3eb655f22d5b0be27`. Two new fictional inventory characterisation cases executed: deleting physical host `fictional-host-001` leaves both dependent virtual servers with orphaned `virtualHostId` references (D12 baseline); `validateApplicationState()` does not report the deliberately missing `virtualHostId` on a virtual server (D26 related validator baseline). These passing baseline assertions **confirm the unsafe existing behaviour**, not the proposed safeguard. Other pre-existing consolidated suite scenarios also ran within the successful workflow, but this evidence does not certify D10, D11, D13, full D26 backup import, or H01 to H08. M-005 stays open, with future acceptance tests required. No application code change, merge or release.

**M-005 next baseline test change, 24 October 2026:** Test commit `919bf866543d82d7860703100fc8e57403b930c3` adds a detached legacy backup candidate test with a fictional orphan `virtualHostId`, checking import validation and source JSON preservation, plus a Chromium executed *source function inspection* of the conversion handler for a direct incoming host guard. The latter is not a full form submission or conversion reproduction; WF-03 D13 remains unexecuted. The backup candidate check does not exercise full FileReader restore or safety snapshot; full WF-06 import remains outstanding. Both new checks await Chromium results. M-005 stays open; no application behaviour changes, merge or release.


## PR #90 latest Chromium evidence, 24 October 2026

[GitHub Actions consolidated Chromium run 40083327937](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40083327937) completed successfully against documentation commit `12cfa287ab36458b2b73b5632ab501068f609228`. This supersedes the historical statement above that the checks added at `919bf866` were awaiting results. The detached legacy backup candidate check and conversion handler source inspection are limited baseline evidence, not full FileReader import, device conversion form submission, safety snapshot, rehost, explicit unassignment, retirement or failed save acceptance tests. The earlier executed baseline confirms unsafe existing behaviour; it does not fix M-005. M-005 and the relevant WF-03/WF-06 acceptance gates remain open. These are GitHub Actions results, not locally executed tests. No application behaviour change, merge or release.
