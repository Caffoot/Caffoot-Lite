# Issue #329 — Private Acceptance Candidate

## Implemented Scope

The [approved contract and decisions](../../../development-guide/Issue-329-Subnet-First-IPAM.md) are implemented on `feat/approved-modular-html-282`. Exact delivery SHA and final workflow results are recorded in [#329](https://github.com/Caffoot/Caffoot-Lite/issues/329). Initial/model/interface checkpoints are preserved there; none is product-owner acceptance.

- Single and multiple subnet creation require names and deliberate purposes. VLAN is optional; VPN gateway is optional. New missing optional values are omitted; existing unclassified/custom records and historical representations remain unchanged during unrelated edits.
- Optional Address Blocks organise networks without allocating addresses. Bulk supports new/existing/no block, deliberate RFC1918 quick fills, First/Last usable gateways, editable review and manual gateway retention. Count is 1–50 per operation, enforced by the server. Three consecutive 50-row operations are tested.
- Parent, subnet, VLAN catalogue and Audit Trail writes are atomic. Invalid rows, permission failures and concurrent conflicts cannot produce partial batches. Existing gateway ownership, reservation, overlap, CSRF and access protections remain.
- Device Networking uses optional block → named subnet → read-only derived VLAN → IP within the existing cards. Existing reservations, edit locks, host/rack/OS rules and allocations remain.
- Bulk history retains the existing sixteen-detail bound and omitted count. Authorised IPAM readers see a bounded structural total/range; unrelated sections, descriptions and private allocations are not exposed.
- Save failures preserve editable drafts. A successful write followed by a refresh failure is reported as saved. Pending writes cannot be closed or duplicated. Preview Description expansion participates in the existing keyboard focus trap.

No schema change, new dependency, pinned-source change, public-IP/WAN/MSP/website work or unrelated redesign is included. User instructions and compatibility copies are synchronised; the Function Index is regenerated.

## Actual Verification

- [Full backend](backend-final.txt): **487 run, 484 passed, three established skips**. Includes security, authentication/MFA, permissions, locks, migrations, backup/import, hierarchy, reservations, historical data and HTTP routes. The Docker opt-in skip is covered separately by CI. Two genuine private v1.3.3 backup fixture tests remain unavailable.
- [Focused acceptance](focused-final.txt): 40 passed. [Final subnet model](model-final.txt): 14 passed, including tagged VPN without gateway, named-parent rollback, 1/10/50/150 networks, invalid rows and concurrency.
- [Real HTTP security](http-security.txt): two passed; real IPAM-only sessions and rejection of users without write access. CSRF checks, 50-row atomicity, safe reader history and saved legacy device metadata passed.
- Focused Chromium core: five groups passed including Single, 10/50-row preview/save, backup/import, Device Add/Edit/Duplicate and direct API rejection. The later failure/retry and successful-write/readback-failure cases passed in the same five-group core. [Restricted browser roles](browser-roles.txt) passed independently.
- [Visual and keyboard comparison](visual-final.txt): eight width/theme combinations, three views each, **24 measured cases**. Four viewports: 1440×950, 1366×600, 390×844 and 320×568. Both themes, labels, focus and Description keyboard expansion/collapse checked. [Raw measurements](source-comparisons.json).
- [Documentation compatibility](documentation.txt), JavaScript syntax, whitespace and source/provenance checks passed. All twelve approved HTML files, provenance and extracted source styles remain unchanged.
- Integration checkpoint `960637f925f2fbf59b7575ef4a05c6406556b904` passed backend, secret-history, real Docker lifecycle and full browser workflows: existing Chromium/editor/accepted-feature regression plus Firefox and Linux WebKit with focused #329/#333. Final candidate reruns these on its own SHA; consult #329 before treating pending runs as passed.

The first candidate history scan flagged ordinary HTTP test-result prose as a generic API key. The wording is clarified and `.gitleaksignore` excludes only that exact historical report-line fingerprint; no credential or general rule is excluded. A local full-history scan then passed. Final GitHub confirmation remains recorded in #329.

Test adjustments corrected obsolete new-subnet fixtures without Purpose and VLAN-first browser selectors. Initial geometry checks sampled transitions; settled measurements pass. A test initially assumed Devices navigation was hidden for an IPAM-only user; accepted navigation is unchanged and the corrected test checks actual permissions and data access. These failures are resolved, not counted as successful runs.

## Visual Findings

Reference revision: `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. Single uses the pinned IPAM Draft 01 frame and existing Name/VLAN grid; explicit amendments add Purpose and optional/conditional labels. At 1440px its width is exactly 575px, matching source; CIDR input is 42px high with 10px/11px padding, 9px corners and 13px text, matching source. Its extra required Purpose row legitimately increases content height; pixel-identical full-form height is not claimed.

Device Networking retains the Batch 04 modal dimensions: 1030×870px at the desktop viewport, zero measured outer-size difference. Only the approved subnet-first field order and derived VLAN change. No measured horizontal overflow occurs in any of the 24 cases. The new bulk review has no standalone pinned counterpart: it follows the explicitly approved desktop table/mobile stacked-row amendment, existing modal styling, internal scroll and fixed actions. The light source is compared structurally; live dark theme is checked separately.

Representative reviewed captures:

- [Single live](single-1440-light-live.png) / [pinned source](single-1440-light-source.png).
- [Mobile Device Networking](networking-390-dark-live.png) / [source structure](networking-390-dark-source.png).
- [Desktop review](preview-1440-light.png) / [mobile dark review](preview-390-dark.png).

Screenshots and geometry are automated evidence plus targeted visual review, not native Safari or owner approval.

## Private Owner Acceptance

Native Raspberry Pi and macOS/iOS Safari have not been run here. Linux WebKit is not native Safari. No ARM64 image has been built or published; no Portainer stack or installation has been changed. The two genuine private backup fixtures remain unavailable.

When the owner separately authorises the private build, use a clean checkout of the exact final SHA from #329 and run `python3 scripts/build_private_acceptance.py` natively on the Pi. The local tag is `caffoot-lite:private-<first 12 SHA characters>`. Verify `arm64` and the full `org.opencontainers.image.revision`. Follow the established private 8445 workflow, changing only the image line; retain ports, volumes, environment and private secrets. Keep a verified backup; do not assume an older application understands newly created subnet-first data.

Use fictional isolated acceptance records:

1. Create/edit/reload LAN, Management and VPN, tagged and untagged; required messages, optional VPN gateway and legacy Not assigned purpose. Confirm choosing VPN keeps VLAN.
2. Generate 1/10/50 rows with new/existing/no block. Check optional quick fills, both gateway conventions, Back/manual edits, row errors and no partial writes. Reject 51; allow later 50-row batches. Check Save feedback and keyboard/mobile internal scrolling in both themes and enlarged text.
3. Add/Edit/Duplicate a device: block/subnet cascade, derived VLAN, available/manual IP, reservations, rack shelves and existing host/OS workflows. Check manual and historical inventory values survive Save/reload.
4. Verify IPAM-only editor and read-only access, Audit Trail total/range/actor and omitted details, and a backup/export/import round trip without private data exposure.

All implementation and available automated verification must pass the exact final candidate CI before private acceptance. Resume an actual failed final check or owner finding, rather than repeating completed development. No merge, public deployment, image publication or release is authorised.
