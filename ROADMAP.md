# Caffoot Lite — Development Roadmap

**Updated:** 10 October 2026  
**Current milestone:** v1.0.0 release candidate  
**Repository:** `sdelnevo/Caffoot-Lite` (private during development)  
**Release policy:** Publish publicly only after manual verification, security/privacy review and owner approval.

## Delivered core scope

- Subnets/CIDR, IPAM, reservations, bulk operations, history, CSV and integrity safeguards.
- Rack workspace with front/rear placement, accessories, drag-and-drop, U sizing and collision prevention.
- Device inventory, types/locations, details and additional server/software options.
- Dynamic dashboard, settings, validated JSON backup/restore and recovery protections.
- Light/dark UI improvements, consistent forms and Safari rack scrolling refinements.
- Offline single-HTML build pipeline and automated checks.

The features above are recorded as delivered. Automated Chromium regression checks have been added for offline startup, local storage recovery, backup rejection and restore, Device/IPAM integrity, rack placement, form labels, modal keyboard behaviour and theme text contrast. **Safari manual acceptance has progressed substantially; remaining workflow, accessibility, distribution and owner-approval checks are listed below.**

## Verified automated coverage (private CI)

- Offline HTML build verification, embedded assets and no outbound HTTP(S) requests in the Chromium smoke test.
- Browser-local inventory persistence, unreadable-storage recovery and recovery-data download.
- Malformed and malicious backup rejection, restore cancellation, rollback on failed restore and successful restore.
- Device/IPAM allocation ownership, subnet membership, record synchronisation and reassignment.
- Rack U-range validation, overlapping placement rejection and separate front/rear faces.
- Failed Device edits and creations roll back without leaving ghost inventory or orphan IPAM records.
- Modal keyboard focus and Escape behaviour, shared light/dark text contrast, and selected Device/Subnet/IPAM field labels and HTML escaping.

These checks are valuable regression coverage, **not** a complete security audit, accessibility certification or replacement for manual browser testing.

## Manual Safari acceptance — owner confirmed, 10 October 2026

- **Stage 1 (5/5):** offline startup, branding, navigation, themes and reopening.
- **Stage 2 (6/6):** subnet creation and suggested gateway, Desktop device creation and next available IP, Device/IPAM name synchronisation.
- **Rack workflows:** mounting-type restrictions confirmed in Safari; Stage 5B rack integrity **5/5** (overlap, capacity, opposite faces, unchanged state after rejection, persistence).
- **Stage 4A (6/6):** JSON export, backup contents, cancelled import and persistence.
- **Stage 4B (7/7):** successful restore, temporary data removed, original inventory/IPAM restored and persisted.
- **Stage 4C (5/6):** malformed JSON rejected, inventory unchanged and persisted; pre-test inventory confirmation was not checked.
- **Stage 4D:** owner confirmed a modified backup was rejected. This is evidence of rejection, but does not independently establish every invalid-structure case.
- **Stage 5A:** owner confirmed rejection of invalid subnet boundary, overlapping subnet, duplicate device IP and out-of-subnet IP; no issue reported.
- **Final Device workflows (6/6):** duplicate, independent IPAM allocation, delete and release IPAM allocation, rack position cleanup and persistence; owner confirmed red Delete button works.
- **Stage 6A — IPAM (7/7):** reservation create/edit/remove, available-address filtering, bulk action and cancellation, integrity/repair, persistence.
- **Stage 6B — Rack workspace (7/7):** accessory add/remove and collision rejection, drag/move and occupied-position rejection, Safari scrolling, persistence (owner reported 8/7, all seven listed checks passed).

## Remaining release gates

- [x] Latest private GitHub Actions build green (commit `392b351`, checked 10 October 2026).
- [x] Generated HTML operates offline in Safari and retains inventory after reopening.
- [x] Basic Add/Edit Device, next available IP and Device/IPAM synchronisation tested in Safari.
- [x] Rack mounting restrictions and core U integrity tested in Safari.
- [x] JSON export, cancelled restore, successful restore and malformed JSON rejection tested in Safari.
- [x] Core subnet/IPAM invalid-operation rejection tested in Safari.
- [x] Exercise **Duplicate/Delete Device** and confirm linked IPAM/rack records stay consistent.
- [x] Exercise **IPAM reservations, bulk actions and integrity repair**, including cancellation and persistence.
- [x] Exercise **rack accessories, drag-and-drop and scrolling** on Safari; confirm no collision or accidental moves.
- [ ] Complete targeted **keyboard-only/VoiceOver**, mobile-width and light/dark visual checks beyond shared contrast tokens.
- [ ] Test **HTML update/move/rename with exported JSON backup**; document browser `file://` storage differences.
- [ ] Final source privacy review, dependency licence verification and **release ZIP contents** inspection.
- [ ] Agree public distribution: preferably complete ZIP with notices; if standalone HTML is offered, make licence notices accessible beside it.
- [ ] Owner explicitly approves release version, public repository visibility and publication actions **separately**.

Passing these checks supports release readiness; it is not a formal security or accessibility certification.

## Future enhancements — after v1.0

1. Cross-module advanced search (Devices, IPAM, Subnets, Racks).
2. Device relationships and upstream/downstream links.
3. Port, patch-panel and rack cabling management.
4. Network topology visualisation based on shared relationship data.
5. Expanded inventory, rack, IPAM and connection reporting.

These were **proposals**, not committed v1.0 requirements. Confirm scope before development.

## Compatibility and project boundaries

**Data compatibility:** Preserve existing browser inventories and supported JSON backup formats. The primary storage key is `caffoot_state`; this pre-release build does not automatically migrate legacy test storage. Export and restore JSON backups to retain test data.

**Safe releases:** Keep a known-good standalone HTML build and recommend exporting a JSON backup before upgrading. Validate new builds before publishing them.
