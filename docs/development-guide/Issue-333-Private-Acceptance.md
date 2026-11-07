# Issue #333 — Hypervisor Choices And Rack Feedback

The [authorised follow-up](https://github.com/Caffoot/Caffoot-Lite/issues/333) starts from clean local/GitHub `42cb8168375c0507b57206113d21a6efafce61b9` on `feat/approved-modular-html-282`. It addresses the remaining #327 host/rack checks and #330 native select review. Accepted #328/#331/#332 behaviour remains protected; #329 and withdrawn UPS complaints are outside scope.

## Confirmed Failures

A real, trusted keyboard change reproduces the owner's missing Proxmox versions in Chromium too. One change listener queued a version refresh; a later listener copied the selected product into the underlying form field. Native browser events can run the queued refresh between these listeners, so it read the previous product. Proxmox initially showed only Select/Custom; Hyper-V after VMware displayed ESXi versions. Earlier tests used `selectOption()` and did not expose this ordering.

The correction copies the product, clears a deliberately replaced product's draft version and refreshes versions in the same existing handler. It keeps the approved lists, Custom/Other, stored historical values and separate guest OS. No catalogue or backend change is needed.

Rack Mounted Save without a rack previously asked for Start U even though that field could not be used. Rack selection is now required for physical Rack Mounted equipment, using the existing modal-local validation, tab selection and field focus. Explicit missing/stale rack checks precede U validation; a backend missing-rack response maps to Rack rather than Start U. Shelf rules, disabled permission controls, saved inventory and five-minute editing reservations remain unchanged.

## Select Appearance

Settled live/source IPAM Subnet Type controls match in Chromium, Firefox 153 and Linux WebKit 26.5 at four widths and both themes. Chromium/Firefox render both at 42px high; Linux WebKit renders both at 47px. All use 13px text, 10px/11px padding, 9px corners and native `appearance: auto`. No persistent styling mismatch has been demonstrated and no CSS has been changed. Functional option timing and native select appearance are separate checks.

The visual test now foregrounds the live tab and waits for the actual modal transition before measuring. Earlier WebKit captures measured the opening state while the reference tab was active. The test also uses current isolated Firefox/WebKit tools; older Firefox did not apply the existing scoped styles. These test corrections do not change application layout or browser support policy.

Local Linux WebKit could not launch because required system libraries are unavailable; Firefox could not initialise its rendering surface. Focused Firefox/WebKit checks run on the existing GitHub Ubuntu infrastructure instead. Neither Linux WebKit nor Chromium certifies native macOS Safari. The owner must recheck Subnet Type spacing/chevron at their actual Safari zoom and display scale, alongside the corrected host version options.

## Verification And Resumption

- [x] Reproduced trusted-event Proxmox/Hyper-V failures and missing-rack feedback before edits.
- [x] Applied narrow ordered-handler and rack-validation corrections; syntax checks passed.
- [x] Focused backend: 92 passed, including permissions, saved metadata, rack/shelf associations, reservations and all twelve pinned-source/template checks.
- [x] Focused Chromium: six groups passed, including native-keyboard, Save/Edit/Duplicate/Cancel, responsive/theme and select comparisons.
- [x] Current Firefox 153: six groups passed, including matching live/source select widths.
- [x] Current Linux WebKit 26.5: six groups passed through actual IPAM entry paths after waiting for modal transitions.
- [ ] Complete Firefox/WebKit CI and existing Chromium/#331/#332/full backend/security/documentation checks.
- [ ] Record final evidence, exact delivery SHA and owner private recheck instructions in #333/#327/#330/#282.
- [ ] Owner native Raspberry Pi/Safari acceptance; do not close either parent on automation alone.

[Consolidated evidence and private acceptance instructions](../development-handovers/evidence/issue-333/Report.md). The next step is to inspect the remaining final Chromium job for `e802dab034dcb04f3173f3e7248c5564386ee912`, then record exact delivery-commit sign-off in #333. There is no image publication, merge, release or installation change.
