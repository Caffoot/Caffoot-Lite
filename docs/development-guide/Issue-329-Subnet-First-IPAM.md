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
- [ ] Single IPAM form, approved generation/review, visible purpose and row errors.
- [ ] Device Networking subnet-first integration and derived VLAN.
- [ ] Focused browser and source/desktop/mobile/theme/accessibility comparison.
- [ ] Full backend/browser/security/backup/import/compatibility/documentation/Docker checks and exact final GitHub sign-off.
- [ ] Private owner Safari/Pi acceptance, separately recorded.

[Model regression results](../development-handovers/evidence/issue-329/model-regression.txt). The initial full backend run found five old creation fixtures missing the now-required purpose and one obsolete missing-VLAN expectation; these fixtures/expectations were corrected. They are not counted as a passing full suite. The next step is the Single/Bulk IPAM interface batch, followed by Device Networking and full regression. This is an intermediate implementation checkpoint, not a private acceptance build.

No public-IP/WAN/MSP/website changes, merge, image publication, Portainer stack change, deployment or release are authorised.
