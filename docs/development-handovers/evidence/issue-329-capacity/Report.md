# Issue #329 — Coordinated Planning, Capacity And Containment

[Authority and implementation checklist](../../../development-guide/Issue-329-Planning-and-Capacity.md). Starting accepted SHA: `da199cddb51ccc53dafb20892dfd5e52303d01cd`. Application checkpoint: `8cd2b5378286e1fcd860309ef89abb3ed5b6d675`. Exact delivery SHA and final workflow receipt are recorded in [#329](https://github.com/Caffoot/Caffoot-Lite/issues/329), branch `feat/approved-modular-html-282`.

## What Changed

- The existing optional planning disclosure is above Create Your Subnets, collapsed on first entry. Its explicit open/closed choice survives Preview/Back. Existing controls, quick fills, form styling, no-block path, scrolling and fixed actions remain.
- Capacity guidance calculates equal-sized ranges and offers a compatible /23–/30 child prefix for count/spacing. Every 10th consumes ten subnet-sized steps; Custom guidance states its equal-size assumption and actual rows are checked individually. Selected prefix, start and count are never changed by a suggestion. Capacity is explicitly distinguished from availability; actual range, alignment, overlap, gateway, ownership and reservation checks still run before atomic Save.
- A block may strictly contain an independent network without adopting it. Browser and server/import checks use the same exception in either record order. Equal ranges, overlapping networks, unrelated overlapping blocks, reserved/non-network conflicts and unrelated ownership remain rejected. Explicit ancestry still supports existing nested hierarchies. Independent IDs, names, VLANs, devices, allocations and parent absence remain intact; block filters follow explicit stored links.
- Reviewed deletion treats blocks as organisational records, including /23–/30 blocks. It does not detach independent devices or remove their allocations simply because their addresses lie within the block. Explicit children still block deletion, and network deletion retains all existing review, permission and reservation protections.

The Single form's existing explanatory text reflects the approved rule. No other screen, shared select styling, schema, dependency, route, authentication/MFA, permission, device edit-lock, WAN/MSP or website change is included. All twelve pinned HTML sources, provenance and extracted styles remain unchanged.

## Actual Local Checks

- [Focused model/hierarchy/collection](model.txt): **43 passed**, including the exact owner `/16` plus six-child example, unchanged independent data, both save boundaries, import, genuine overlap rejection, unrelated block/owned network rejection, nested ancestry and safe small-block deletion with independent devices/reservations.
- [Full backend](backend.txt): **494 run, 491 passed, three established skips**. The Docker opt-in skip is covered by a passing dedicated lifecycle job when confirmed in the final receipt. Two genuine private v1.3.3 backup fixtures remain unavailable.
- [Focused Chromium](browser.txt): four new groups passed. Eight calculations include `/12`→`/24` capacity, Every 10th capacity/suggestion, equal-size strict-child rejection, no compatible allowed prefix, invalid CIDR, `/0` arithmetic and invalid count. Real UI checks prove no silent prefix change, real block/six-child Save around an independent record, standalone versus explicit-child filtering, backup/import preservation, direct API conflict rejection and empty/linked-block deletion behaviour.
- [Measurements](capacity-planning.json): eight width/theme cases at 1440×950, 1366×600, 390×844 and 320×568. Actual Gateway Convention geometry is measured before and after Back, retaining the accepted appearance and adjacent input height. Fixed actions remain in view; no horizontal overflow is measured.
- [Documentation compatibility](documentation.txt), syntax, whitespace and staged secret checks passed; Function Index regenerated and canonical/compatibility IPAM guides agree.

The initial focused model run correctly failed the old blanket-rejection assertion; that historical-policy test is replaced with the explicitly approved exception and preservation cases. No failed run is labelled passed.

The final integrated browser/engine, source, security and Docker workflow receipt must be consulted in #329. A candidate-stage pending check is not a pass. Native Safari/Pi is not available on this Linux AMD64 worker; Linux WebKit is not a native Safari test.

## Visual Evidence

The pinned reference remains `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. These three refinements are explicit amendments to the live IPAM template. [Single/Device source measurements](source-comparisons.json) retain the existing frames. Existing header/body/footer, grid, controls and accepted dropdown CSS are retained; the capacity paragraph uses the existing explanatory-text treatment. No new cards or navigation are introduced.

[Collapsed-first entry](default-planning.png) is captured separately. Representative reviewed captures show [desktop planning](capacity-1440-light.png), [mobile dark](capacity-390-dark.png) and [small-window fixed actions](capacity-320-dark.png). The integrated artifact also records collapsed-first entry and the existing Single/Device pinned structural comparison. The larger optional disclosure can scroll out of view on a small screen while the header and actions remain fixed; this preserves access rather than squeezing controls.

## Private Owner Acceptance

The owner accepted the prior correction scenarios on native Safari at the starting SHA; that acceptance is preserved as history and is not asserted for this new build. Build from a clean checkout of the exact final SHA in #329, natively on the Pi with `python3 scripts/build_private_acceptance.py`. Expected local tag: `caffoot-lite:private-<first 12 SHA characters>`. Verify ARM64 and the full revision label. No ARM64 image has been built or published here.

Follow the established private 8445 workflow only when authorised, retaining ports, volumes, environment and secrets and changing only the image line. Keep a verified backup; do not assume older application versions understand new subnet-first data.

1. Open Add Multiple: planning is first and collapsed. Leave no block, then try new/existing blocks and deliberate quick fills; Preview/Back retains choices. Confirm Safari Gateway Convention alignment, other accepted dropdowns, keyboard/touch, both themes, enlarged text and small-window actions.
2. Enter/select `172.16.0.0/12` and `/24`: guidance reports 4,096 equal-sized ranges. Change count/spacing and confirm suggestions update while `/24` remains selected. Use a smaller block to exercise a suggested prefix, then choose it explicitly. Capacity must never be presented as free space.
3. Check actual start/stride overflow, genuine parent mismatch, invalid Custom CIDRs, existing network/reservation conflicts, 1/10/50 and rejection of 51. Errors stay within the modal and invalid batches save nothing.
4. With fictional standalone `10.128.10.0/24`, create `10.128.0.0/16` plus linked `.60`–`.65` children. Confirm the original record, VLAN, devices and allocations remain unchanged, and the independent subnet stays under All / Standalone. A child overlapping `.10` must fail. A block with linked children must not delete; an empty organisational block must not delete independent inventory.
5. Save/reload, Device Add/Edit/Duplicate subnet/VLAN/IP cascade, existing five-minute reservations, historical names and backup/import. Recheck the previously accepted spacing, errors, derived VLAN and available-IP-before-manual order.

No unresolved product decision remains for this exact exception. Only owner acceptance/private fixtures and any genuine final-check failure should be resumed; do not repeat previous implementation. Nothing has been merged, released, publicly deployed, published or changed in the Pi/Portainer installation.
