# Issue #329 — Private Acceptance Corrections

Authority: [8 November correction batch](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6725970600). Starting clean local/remote SHA: `028c4edc73ca09640703713c1099fba52316a6a4`, branch `feat/approved-modular-html-282`. Preserve the owner's [partial acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6725918893); previous implementation evidence is not acceptance of these corrections.

## Current Checklist

- [x] Latest branch, working tree, owner decisions, accepted features and original evidence reviewed.
- [x] New/renamed subnet names validated within the existing transactions; trimmed/case-insensitive, blocks separate, historical duplicates preserved. Seventeen focused model tests passed.
- [x] Browser name checks, field-linked errors and plain-English hierarchy feedback.
- [x] Four-field-first generator with optional planning, Consecutive/Every 10th/Custom and preserved manual entries.
- [x] Available-IP before manual IP, with existing cascade/reservation safeguards.
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

## Interface Checkpoint

The four primary generator fields come first; optional block/private-range planning is collapsed on the normal path. Controls within it stay out of the focus order while closed. Every 10th advances by ten subnet sizes. Custom CIDRs can be edited per row; unchanged generation settings preserve them through Back, while deliberate start/prefix/mode changes regenerate the ranges. Automatically suggested gateways follow valid CIDR edits; manual gateways are retained and revalidated. Existing server CIDR/ownership/overlap checks remain authoritative.

Single and bulk errors stay in the modal, with field/row links and no raw internal IDs. Names are checked in both UI/server, with old duplicate records preserved. Available IP now precedes manual entry. Native selects retain existing dimensions/colours and real select semantics; appearance is explicitly removed and a consistent chevron supplied. Searchable widgets keep their existing popup and matching backing-select/trigger padding; listboxes are excluded from native-menu treatment. Static inventory covers 82 template selects plus generated preview controls.

Actual local results: 490 backend tests run, 487 passed, three established skips before the final two focused model additions; latest focused model has 19 passes. Original seven subnet-first browser groups passed. Four new focused correction groups passed, including Custom save, inline errors, main-page select checks and Gateway Convention at four widths/both themes. Expanded modal audit and final integrated engine/CI checks remain to run. The original first browser attempt correctly rejected reused test names; fixtures now name batches distinctly. A hidden searchable-native control was initially included in a visual sizing assertion; the corrected audit checks its visible widget separately through the existing device regressions.

[Checkpoint measurements, images and results](../development-handovers/evidence/issue-329-corrections/). Reviewed desktop/mobile images retain the existing form styling with the approved presentation amendments. Native Safari is not available on this Linux worker. Address Block semantics remain unchanged and pending approval.


## Small-window And Final Regression Follow-up

The generator now reuses the preview's internal-scroll/fixed-actions rules at its existing width, and its class is cleared before any other modal opens. Expanded audits include Rack, User, email settings and Active Subnet. Unchanged historical names retain their exact outer spaces. Preview validation retains its own accessibility markers rather than having generic native-input cleanup remove them. Custom errors are attached to every affected row; invalid Custom drafts can return through Back for correction without losing their CIDRs or permitting Save.

Final local backend: **492 run, 489 passed, three established skips**. Nineteen focused model tests pass. The expanded four-group correction audit passed locally, including four widths/two themes and visible actions. The final integrated browser/CI receipt and exact pushed SHA will be recorded in #329. [Consolidated correction report](../development-handovers/evidence/issue-329-corrections/Report.md) distinguishes these results from pending native owner acceptance.

The first interface checkpoint passed backend, Docker and secret CI but failed browser checks: searchable-trigger padding diverged from its backing control, Firefox sampled an asynchronously refreshed email form, and WebKit's native source select measured 47px while the corrected field is 42px. The fixes keep backing/trigger styles consistent, wait for email refresh, and compare the corrected field to the approved adjacent input while recording the native source difference. These failed runs are not reported as passes.
