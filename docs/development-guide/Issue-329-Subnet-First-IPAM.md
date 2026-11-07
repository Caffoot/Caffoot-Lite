# Issue #329 — Subnet-first IPAM

Implementation is authorised by [6705848494](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6705848494), using the [consolidated contract](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6705641377), [visual amendment](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6705665769), [storage/audit approval](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6705738591) and [acceptance checklist](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6705807016). Development starts from clean local/GitHub `3ab47dd1f6aa9a566652120f9d8da20ba2fc3e2b` on `feat/approved-modular-html-282`.

## Data And Compatibility

The existing JSON records and atomic `/api/ipam/subnets/save` transaction are retained; no schema migration or new route is needed. New networks require an explicit name and LAN/Management/VPN purpose. Untagged new networks omit `vlan`; new VPN networks deliberately without a gateway omit `gateway`. Existing records without purpose remain unchanged and display Not assigned. LAN/Management and unclassified legacy networks retain required usable gateways. Explicit VLANs retain domain uniqueness and catalogue validation.

Both inventory save boundaries enforce new-record choices and protected gateway ownership. The combined route counts newly created addressable networks, excluding an optional parent block: no more than 50 per operation, with further batches allowed. Full-state validation and writes remain inside BEGIN IMMEDIATE. Failures roll back the parent, children, VLAN changes and audit together. The attributed summary reports the total and range/block context while retaining 16 detailed changes plus the omitted count. Purpose joins the existing bounded structural audit fields; descriptions/private allocations are not copied.

## Approved Interface Changes

Retain the pinned IPAM modal/cards/navigation, with separate Add Single Subnet and Add Multiple Subnets actions. Single creation gains initially blank required purpose, optional VLAN and purpose-dependent gateway. Bulk chooses new/existing/no block, optional deliberate RFC1918 fill, start/prefix/count and First/Last usable gateway convention, then individually editable named/purposed rows. Desktop uses a scrollable table; mobile stacks the same fields. Final Save is atomic; no silent gateway correction or partial success. Bulk Edit IP Range remains separate.

Device Networking alone changes to optional block → named subnet → read-only derived VLAN → IP, retaining the existing Network Identity/Guidance cards, permissions, draft and reservation behaviour. No unrelated Device, OS, VM or Rack work is included. All twelve pinned HTML files, directly extracted source styles and provenance remain unchanged.

## Checkpoints And Remaining Work

- [x] Read complete approval/specifications and current #282 register; clean local/remote branch verified.
- [x] Model/backend and matching browser validation implemented; focused model/transaction tests prove omission, legacy edits, gateway protections, counts, 150 subnets, rollback, concurrency and audit.
- [x] Single IPAM form, approved generation/review, visible purpose and row errors.
- [x] Device Networking subnet-first integration and derived VLAN.
- [ ] Focused browser and source/desktop/mobile/theme/accessibility comparison.
- [ ] Full backend/browser/security/backup/import/compatibility/documentation/Docker checks and exact final GitHub sign-off.
- [ ] Private owner Safari/Pi acceptance, separately recorded.

[Model regression results](../development-handovers/evidence/issue-329/model-regression.txt). The initial full backend run found five old creation fixtures missing the now-required purpose and one obsolete missing-VLAN expectation; these fixtures/expectations were corrected. They are not counted as a passing full suite. The next step is the Single/Bulk IPAM interface batch, followed by Device Networking and full regression. This is an intermediate implementation checkpoint, not a private acceptance build.

No public-IP/WAN/MSP/website changes, merge, image publication, Portainer stack change, deployment or release are authorised.

## Interface Integration Checkpoint

Single/Bulk IPAM and Device Networking are implemented. Five new Chromium groups passed, covering omitted VPN fields, historical numeric-string VLAN/empty parent representation, real row validation, 10 and 50 subnet saves, both gateway conventions/manual edits, four widths and themes, existing-block reuse, new backup/import normalisation, Device Add/Edit/Duplicate and direct API/CSRF rejections. The initial geometry failure sampled a resizing transition; settled capture/measurement passes without changing the approved layout.

Full backend before the final audit-projection addition: 482 run, 479 passed, three established skips. The new bounded batch summary projection is tested for non-admin IPAM readers; unrelated sections and free text remain redacted. The latest focused interface/backend/history regression is recorded in the evidence folder. The generic form permission and unsaved-change guards now recognise the new IPAM forms. A confirmed save is no longer reported as rolled back if only its subsequent inventory refresh fails.

Existing active browser tests have been updated only where the approved contract changes: new Purpose/Single Subnet label and removal of the VLAN-first prerequisite. Their full regressions and Firefox/WebKit jobs remain to be evaluated. Next: inspect CI, finish targeted history/security/data-preservation tests, compare live Single/Device controls against pinned HTML plus the approved amendments, update user/developer documentation and complete final acceptance evidence.
