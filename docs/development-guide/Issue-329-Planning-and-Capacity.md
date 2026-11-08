# Issue #329 — Planning, Capacity And Safe Containment

Authority: [coordinated batch](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6726734220), [planning/capacity approval](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6726666217), [exact containment approval](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6726714311). Preserve the owner's [native Safari acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6726683947) at starting clean local/GitHub `da199cddb51ccc53dafb20892dfd5e52303d01cd`. All work stays on `feat/approved-modular-html-282`.

## Implemented Scope

The existing optional planning disclosure moves above Create Your Subnets and starts collapsed. Explicitly opened/closed planning state survives Preview/Back. Existing controls, styles, quick fills, no-block path, scrolling and fixed actions remain.

`calculateSubnetCapacity` calculates equal-sized CIDR capacity from the parent range, child prefix, count and spacing. Every 10th uses a ten-subnet stride, not ten addresses. `updateSubnetCapacityGuidance` shows theoretical capacity and the shortest compatible /23–/30 child prefix for that count/spacing. It never changes selected inputs. Custom calculations explicitly assume equal-sized children; actual edited CIDRs remain individually validated. Guidance warns that capacity is not free space, and flags actual start/stride extending outside a range. Existing field/row errors and server checks remain authoritative.

The identical browser/server hierarchy exception permits a container to strictly contain an unparented addressable network without adoption. It applies to stored relationships consistently during save/import/reload, regardless of record order. Equal/partial ranges, overlapping networks, unrelated blocks and networks assigned to an unrelated block remain rejected. Explicit ancestry still supports existing nested hierarchies. Independent names, VLANs, device/IP records, IDs and parent absence are preserved; filters continue to follow explicit parent chains.

Reviewed block deletion now treats containers as organisational records, even when their prefix falls within /23–/30. It never derives ownership of independent devices/allocations from the block's geographic range. Existing explicit-child deletion protection remains. Network deletion and its review/reservation rules are unchanged. This narrow guard is necessary to meet the approved preservation rule for small blocks.

No schema, dependency, route, security policy, pinned-source or unrelated screen change. The Single form's existing block explanation is corrected to describe the newly approved rule. Earlier proposal/pending records remain historical evidence; the cited approval supersedes their pending status.

## Checkpoint

- [x] Read approvals and native acceptance; clean local/remote branch verified.
- [x] Form order, live capacity/suggestions and preserved selections.
- [x] Symmetric browser/server containment exception, ownership-safe deletion and explicit-only filters.
- [x] Focused model/collection/hierarchy: **43 passed**.
- [x] Focused Chromium: four groups passed, including actual parent/six-child save, independent preservation, filtered Device options, backup/import, rejection/deletion paths and four widths/both themes before/after Back.
- [x] Full backend: **494 run, 491 passed, three established skips**.
- [ ] Final integrated browser/engine, security, documentation/source and Docker workflow receipt.
- [ ] Native private Pi/Safari owner acceptance and two genuine private backup fixtures.

Exact pushed SHAs, final workflow results and resumption instructions are recorded in #329. Do not treat a pending run as a pass or repeat accepted earlier batches.

## Evidence And Final Checks

[Permanent report, logs, source measurements and reviewed images](../development-handovers/evidence/issue-329-capacity/Report.md). The implementation checkpoint passed backend, Firefox, Linux WebKit, Docker lifecycle and history scanning; full Chromium and the final delivery-SHA receipt are recorded in #329. Pending runs are not accepted results. This evidence update changes documentation only; native owner acceptance remains outstanding.

All four application-checkpoint workflows passed. The final test/evidence-only follow-up corrects capture timing by explicitly waiting for the displayed, settled generator; its focused four groups passed again. The final delivery SHA and its exact workflow results are recorded in #329. Application files remain identical to `8cd2b53`.
