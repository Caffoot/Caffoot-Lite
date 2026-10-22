# Caffoot Lite v1.3.0 P11 Explanatory Comment Improvement Register

**Status:** Source review proposals only, 22 October 2026. No application source changes or P12 sign-off authorised.
**Baseline:** Published `app/caffoot-lite.html` at tag `v1.3.0`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`.
**Purpose:** Help a future developer understand *why* important safeguards and compatibility rules exist. Avoid comments that merely repeat the code.

## Priority definitions

- **Essential:** An easily misunderstood data-protection or compatibility rule. Review wording when the relevant code is next edited.
- **Useful:** A non-obvious workflow decision whose explanation would reduce maintenance risk.
- **Retain:** Existing explanation is adequate; avoid unnecessary edits.
- **Hold:** Do not explain an unresolved potential defect as though it were intended design.

## Proposed comments and rationale

| Priority | Workflow | Source location | Why a comment would help | Proposed intent, not final code wording |
| --- | --- | --- | --- | --- |
| Essential | WF-02 | `saveState()`, 1838–1847 | Inventory is read back and verified before audit history is attempted; audit recording may fail without making the inventory save fail. | Explain inventory durability versus best-effort local history, and why readback precedes success |
| Essential | WF-01 | `phase120SeparateLegacyRackLocation()`, 1380–1389 | Old `Racked` location is replaced only for rack-mounted records, while rack mounting remains separate. | Explain physical location versus mounting and preservation of older data |
| Essential | WF-01/WF-06 | `normaliseState()`, 1392–1417 | Required collections are rejected when malformed, while optional rack accessories currently default to empty. | Explain historical schema assumptions only after M-019 compatibility policy is resolved; do not justify silent loss |
| Useful | WF-04 | `phase12BApply()`, 4494–4505 | Recomputes bulk plan on confirmation and stores snapshot before mutation. | Explain protection against stale previews and why no mutation starts before snapshot storage |
| Useful | WF-04 | Network subnet save, 4836–4842 | On failed save, restores selected subnet and device-form draft as well as inventory. | Explain why returning the user to the same editing context matters |
| Useful | WF-04 | `confirmDeleteSubnet()`, 5020–5035 | Rechecks a signature before destructive commit. | Explain why prior confirmation is invalid after dependent records change |
| Useful | WF-03/WF-05 | Rack accessory save/delete, 8103–8138 | Inventory rolls back but confirmation/modal behaviour needs UX testing. | Add rationale only after M-023 decision; avoid comments masking an unresolved issue |
| Retain | WF-01 | `loadStoredState()`, 1617–1647 | Explains preserving raw unreadable data and avoiding automatic startup overwrite. | No change |
| Retain | WF-06 | Import restore, 7803–7834 | Explains safety snapshot, verification and rollback order. | No change |
| Retain | WF-03 | Rack move/unassignment, 5651–5679 | Explains preserving physical location. | Keep comment; investigate unchecked unassignment save separately (M-001) |
| Retain | WF-04 | VLAN deletion, 5073–5086 | Explains parent-block ownership rather than number alone. | No change |
| Retain | WF-04 | IPAM repair, 2257–2262 | Explains snapshot before mutation. | No change; M-012 still investigates verification |
| Hold | WF-02/WF-05 | `validateApplicationState()`, 1556–1612 | Accessories and virtual-host references are not comprehensively checked. | Do not add a comment suggesting these omissions are intentional; investigate M-019 and M-005 |
| Hold | WF-03 | `unassignDevice()`, 5670–5680 | The save result is ignored. | Do not explain an unchecked save as policy; investigate M-001 |

## Review and implementation rules

1. Keep this as a **documentation proposal**. No comments have been inserted into published application code.
2. When an affected function is legitimately edited under an approved change, add only the explanatory comments that still match its final behaviour.
3. Recheck the exact source lines and dependencies first. Comments must describe the implementation, not an intended future feature.
4. Never claim that P11 or P12 has passed merely because a proposed comment exists. Browser failure tests remain pending.
5. Use the existing WF-01 to WF-04 test matrices; avoid creating a separate comment-only test suite.

**Cross references:** `docs/audits/WF-01-TO-WF-04-FUNCTION-AND-COMMENT-RECONCILIATION.md`, `docs/audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md`, `docs/roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md`, `docs/standards/DEVELOPMENT-PRINCIPLES-AND-STANDARDS.md`.
