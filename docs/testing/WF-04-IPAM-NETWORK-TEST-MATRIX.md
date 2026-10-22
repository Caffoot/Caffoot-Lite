# WF-04 Subnets, VLANs and IPAM: Controlled Test Matrix

**Baseline:** Published Caffoot Lite v1.3.0. **Status:** Planned browser tests, not executed. Grounded in WF-04 source findings in `TECHNICAL-WORKFLOWS.md`. No application changes authorised.

## Safety and evidence

Use fictional data in an isolated browser profile. Keep a verified export before deletion, bulk actions and failed-save tests. Record fixture, browser, published release, expected and actual outcome, saved state after reload, error messages, snapshot handling and links to source findings. Protect the user's actual inventory.

## Scenarios

| ID | Scenario | Expected check and evidence |
| --- | --- | --- |
| N01 | Create valid IP Address Block | Parent container persists with correct hierarchy |
| N02 | Create valid network subnet with aligned CIDR, gateway and VLAN | Subnet and scoped VLAN persist |
| N03 | Reject misaligned or duplicate CIDR, invalid gateway and VLAN range | No partial records |
| N04 | Reject invalid parent-child hierarchy and forbidden network-to-container conversion | Existing hierarchy preserved |
| N05 | Reject duplicate VLAN in same parent domain | No duplicate scoped assignment |
| N06 | Open subnet editor through VLAN stable ID | Correct scoped subnet selected |
| N07 | Open ambiguous legacy VLAN association | No arbitrary subnet chosen |
| N08 | Edit subnet name or description without CIDR change | Valid changes persist without unexpected gateway conflict |
| N09 | Edit subnet with gateway owned by permitted router | Check source-identified M-009 collision concern |
| N10 | Change gateway to conflicting or unusable address | Reject conflicting change; preserve old gateway |
| N11 | Attempt CIDR change while device primary IP or IPAM allocation depends on old range | Reject; keep dependencies |
| N12 | Delete unused subnet | Confirmation, correct subnet/VLAN removal, no unrelated changes |
| N13 | Delete subnet with child subnets or blocks | Reject deletion |
| N14 | Delete subnet with independent reservations or ambiguous ownership | Block and explain dependencies |
| N15 | Preview subnet deletion with dependent device primary IPs | Show exact affected records; preserve devices and rack data |
| N16 | Change dependencies between preview and confirmation | Cancel stale deletion using refreshed signature |
| N17 | Confirm permitted subnet deletion | Device primary allocations released, prior IP recorded as designed, rollback safe |
| N18 | Force save failure during subnet deletion | Restore inventory and selected subnet |
| N19 | Delete VLAN used by a network subnet | Reject deletion |
| N20 | Delete unused VLAN and force save failure | Confirmation; rollback on failure |
| N21 | Open standalone IP editor for gateway or device primary IP | Editing protected |
| N22 | Reserve, assign or release independent IPAM address | Valid record update; Available removes standalone allocation |
| N23 | Force save failure during standalone IP edit | Restore previous allocation |
| N24 | Bulk reserve or release a valid small range | Preview matches applied eligible addresses |
| N25 | Bulk range exceeding 512 addresses or invalid host offsets | Reject safely |
| N26 | Bulk range containing gateway, device-owned or Assigned IPs | Protected addresses excluded |
| N27 | Change eligible allocations after bulk preview before confirmation | Verify whether recomputation can apply a different set; document design decision |
| N28 | Block writing bulk safety snapshot | Cancel operation without changes |
| N29 | Force inventory save failure after bulk snapshot | Restore inventory; inspect retained safety snapshot |
| N30 | Repeat bulk operation and reload | Check safety snapshot retention and recovery semantics |
| N31 | Import legacy IPAM/VLAN/gateway records | Validate ownership, scope and backward compatibility; cross-reference WF-01, WF-02 and WF-06 |
| N32 | Verify IPAM summary for gateway without explicit allocation | Protected display count without creating phantom record |
| N33 | Delete or edit network data while device links exist | Validate all affected relationships and audit history |

## Exit criteria

Cross-check WF-03 primary IP tests, WF-01 storage and WF-02 rollback checks without duplicating their evidence. Reconcile significant functions and P11 comments with the naming reference. Record M-009 and any new source-supported findings in the roadmap with explicit status. Every scenario starts **planned**, not passed; browser sign-off requires actual evidence.
