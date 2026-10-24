# GitHub issue migration register

**Status:** Mapping in progress. v1.3.1 tracking issues #91 to #95 created; later candidate issues and milestones pending. **Date:** 24 October 2026. **Published baseline:** v1.3.0.

## Rules

This register is a proposed GitHub planning index derived from the [central findings programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md), not a replacement for it. The release allocations are provisional. Keep original M identifiers, finding dispositions, browser evidence, historical decisions and test IDs. A merged correction is not a published release. M-030 is a mandatory gate for every release. Do not convert closed M-021 into new implementation work.

Before creating a GitHub issue, check whether an existing issue or PR already represents it. The only open repository entries seen in the current issue listing were PR #90 and issue #50. Project and milestone existence have not yet been verified through the available connector.

## Proposed v1.3.1 inventory integrity issues

| Candidate issue group | Findings | Scope and preservation requirement |
| --- | --- | --- |
| [Host relationships and hypervisor eligibility, issue #91](https://github.com/Caffoot/Caffoot-Lite/issues/91) | M-005 | Explicit host dependant review, safe reassignment or unassignment with provenance or retirement, backup compatibility, save rollback, Chromium evidence; no silent deletion |
| [IP ownership and gateways, issue #92](https://github.com/Caffoot/Caffoot-Lite/issues/92) | M-006, M-009, M-024 | Correct ownership, reservations and gateway behaviour, including imported inventories |
| [Rack and accessory import integrity, issue #93](https://github.com/Caffoot/Caffoot-Lite/issues/93) | M-010, M-019 | Shared rack occupancy policy and imported fixture compatibility |
| [Save and startup recovery, issue #94](https://github.com/Caffoot/Caffoot-Lite/issues/94) | M-004, M-017, M-022 | Preserve prior inventory and recovery options on failed saves or invalid startup state |
| [Carry merged fixes into release acceptance, issue #95](https://github.com/Caffoot/Caffoot-Lite/issues/95) | M-001, M-011, M-012, M-018, M-020, M-031 | Verify exact release package and existing targeted evidence; do not reopen corrected source findings automatically |

## Proposed v1.3.2 usability and editing issues

| Candidate issue group | Findings | Scope |
| --- | --- | --- |
| Device type conversions and preservation | M-008 | Historical and custom values, software and server service compatibility, cancelled conversion |
| Rack, accessories and device details | M-002, M-013, M-028 | Retained mounting fields, occupancy reporting and archived selections |
| Recovery and startup explanations | M-014, M-015 | Explain existing protections and automatic normalisation |
| Editing and backup interface consistency | M-023, M-025, M-026, M-027 | Consistent controls, safe return to editing, user facing clarity |

## Proposed v1.3.3 clarity and closeout issues

| Candidate issue group | Findings | Scope |
| --- | --- | --- |
| Save and local history guarantees | M-003, M-029 | Define and verify history semantics and resilience |
| Function and caller clarity | M-007 | Naming, P11 explanatory comments and compatibility of callers |
| Historical documentation closure | M-016, M-021 | Reconcile already closed or historical evidence without inventing implementation work |
| Final WF and audit evidence reconciliation | WF-01 to WF-13, P11, P12 | Confirm remaining verification gates and cross references before closeout |

## Cross release and v1.4

| Group | Findings or source | Scope |
| --- | --- | --- |
| Mandatory documentation gate for every release | M-030 | Technical workflows, test matrices, master audit, findings, roadmap, version statements and release evidence must agree |
| Optional Docker and database architecture | Existing issue [#50](https://github.com/Caffoot/Caffoot-Lite/issues/50), [root roadmap](../../ROADMAP.md) | Preserve standalone HTML indefinitely; optional user management and migration; no implementation implied |
| Future optional inventory component links | [v1.3.x design review](V1.3X-MAINTENANCE-DESIGN-REVIEW.md) | One level optional components and connected device links, no mandatory recursive hierarchy |

## Reconciliation

All original M-001 through M-031 identifiers are represented in the candidate groups: M-001 to M-029 and M-031 have one primary allocation, M-030 is cross release. M-021 is retained as a closed evidence item. Existing issue #50 is linked rather than duplicated. Draft PR #90 remains the existing documentation change surface and must not be mistaken for a release.

GitHub issues [#91](https://github.com/Caffoot/Caffoot-Lite/issues/91) through [#95](https://github.com/Caffoot/Caffoot-Lite/issues/95) were created as open v1.3.1 tracking and release verification issues. No GitHub Project, milestone or new branch is claimed. This mapping does not authorise application changes. Before implementation or publication, verify current GitHub Project and milestone configuration, review proposed issue grouping with the product owner, and reconcile any created items back to this register and the central audit. No browser tests executed for this planning change.
