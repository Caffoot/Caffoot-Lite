# WF-03 Device Lifecycle: Controlled Test Matrix

**Baseline:** Published Caffoot Lite v1.3.0. **Status:** Test design only. No browser tests executed. Source findings are recorded in `TECHNICAL-WORKFLOWS.md`. This matrix does not authorise application changes.

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

Review every function and caller encountered against `FUNCTION-NAMING-AND-REFERENCE.md` and P11 comments. Record defects and improvement candidates in the coverage audit and maintenance roadmap, distinguishing source-confirmed gaps from browser-reproduced issues. Mark each scenario **planned**, **passed**, **failed**, **blocked** or **not applicable**, with evidence. Documentation completeness does not mean test verification.
