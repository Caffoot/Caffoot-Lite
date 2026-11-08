# Issue #329 — Private Acceptance Corrections

Authority: [8 November correction batch](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6725970600). Starting clean local/remote SHA: `028c4edc73ca09640703713c1099fba52316a6a4`, branch `feat/approved-modular-html-282`. Preserve the owner's [partial acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6725918893); previous implementation evidence is not acceptance of these corrections.

## Current Checklist

- [x] Latest branch, working tree, owner decisions, accepted features and original evidence reviewed.
- [x] New/renamed subnet names validated within the existing transactions; trimmed/case-insensitive, blocks separate, historical duplicates preserved. Seventeen focused model tests passed.
- [ ] Browser name checks, field-linked errors and plain-English hierarchy feedback.
- [ ] Four-field-first generator with optional planning, Consecutive/Every 10th/Custom and preserved manual entries.
- [ ] Available-IP before manual IP, with existing cascade/reservation safeguards.
- [ ] Whole-app select inventory/minimal presentation correction, explicit Gateway Convention comparison.
- [ ] Full backend/browser/security/compatibility/source/Docker verification and private acceptance report.
- [ ] Native Safari/Pi owner acceptance.

## Address Block Decision — Proposal Only

Current `hierarchyValidate` and `backend/subnet_validation.py::validate_subnet_hierarchy` permit overlapping ranges only when their stored `parentId` chain establishes ancestry. Consequently a proposed `10.128.0.0/16` containing the independent `10.128.10.0/24` is rejected even when all proposed new children are disjoint (`10.128.60.0/24`–`10.128.65.0/24`). The rejection is reproduced in a permanent model test. No rule change is implemented.

Proposed precise exception, requiring explicit approval:

1. Allow an organisational container to strictly contain an addressable network with **no stored parent**. The network remains independent: do not add/change `parentId`, ID, VLAN, allocations, names, ownership, permissions or history.
2. Continue to reject partial overlaps, equal CIDRs, network/network overlaps, unrelated container/container overlaps and a network assigned to a different unrelated block. Existing valid explicit ancestry remains unchanged. No multi-customer overlapping address space is introduced.
3. Only explicitly linked networks appear when filtering Device Networking by that block. Independent contained networks remain available under All Address Blocks / Standalone Subnets. Read-only hierarchy and bulk counts continue to use stored relationships, not inferred geography.
4. New children must be strictly within the selected block and must not overlap **any** existing network, including independent contained ones. Existing VLAN uniqueness domains remain based on stored parent links; do not silently reconcile catalogues.
5. Deleting or editing a block must never delete, reparent or rewrite an independent contained network. Existing explicit-child/dependency checks remain. Backups/imports preserve these representations without migration.
6. Apply the identical exception in browser/server hierarchy checks, import/restore and diagnostics only after approval; test old states, new parents, independent networks, assigned other parents, nesting, equality, partial overlap, VLANs, block filtering, deletion, backup/import and atomic failure.

This permits the owner's example without changing ownership or automatically adopting inventory. Its visible consequence is deliberate: an independent network inside the same numeric range does **not** become a displayed child of the new block. If the owner wants automatic adoption or geographic filtering, that is a different decision requiring a separate exact proposal.

Until approved, existing validation remains authoritative and only clearer explanations are authorised. Continue all other corrections while the decision is pending.
