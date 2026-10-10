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

The features above are recorded as delivered. Automated Chromium regression checks have been added for offline startup, local storage recovery, backup rejection and restore, Device/IPAM integrity, rack placement, form labels, modal keyboard behaviour and theme text contrast. **Manual cross-browser acceptance, final release review and owner approval remain outstanding.**

## Verified automated coverage (private CI)

- Offline HTML build verification, embedded assets and no outbound HTTP(S) requests in the Chromium smoke test.
- Browser-local inventory persistence, unreadable-storage recovery and recovery-data download.
- Malformed and malicious backup rejection, restore cancellation, rollback on failed restore and successful restore.
- Device/IPAM allocation ownership, subnet membership, record synchronisation and reassignment.
- Rack U-range validation, overlapping placement rejection and separate front/rear faces.
- Failed Device edits and creations roll back without leaving ghost inventory or orphan IPAM records.
- Modal keyboard focus and Escape behaviour, shared light/dark text contrast, and selected Device/Subnet/IPAM field labels and HTML escaping.

These checks are valuable regression coverage, **not** a complete security audit, accessibility certification or replacement for manual browser testing.

## Manual acceptance still needed

- Safari on macOS: open the generated offline HTML with network disabled, exercise navigation, reload and JSON backup/restore.
- Add/Edit/Duplicate/Delete Device, including type-specific options, subnet creation from the Device form, automatic next available IP and IPAM synchronisation.
- Rack mounting and moving devices between front/rear faces, U heights, accessories and drag/scroll behaviour.
- Subnet creation and gateway suggestion; IPAM reservations, bulk actions and integrity repair.
- Keyboard-only and VoiceOver walkthrough of all forms, light/dark themes, mobile-width layout and contrast outside shared tokens.
- Upgrade/move/rename of the HTML file with a JSON backup, explicitly checking browser-local storage caveats.
- Final licence, privacy and packaged ZIP review; explicit owner approval before any public repository or release action.

## v1.0 completion checklist

- [ ] Confirm clean GitHub Actions build in this standalone repository.
- [ ] Verify generated HTML works without an internet connection.
- [ ] Exercise Add/Edit/Duplicate/Delete Device, including type-specific options and save failures.
- [ ] Verify Device ↔ IPAM and Device ↔ Rack integrity on moves, edits and deletions.
- [ ] Test rack front/rear placement, accessory collision, U height and Safari drag scrolling.
- [ ] Check subnet/IPAM reservations, bulk operations and repair workflows.
- [ ] Check empty inventory, forms, keyboard focus, light/dark contrast and responsive layout.
- [ ] Export/restore test data and verify corrupt backup rejection and recovery.
- [ ] Confirm browser-local storage persistence and document file:// caveats.
- [ ] Review repository for private information, licences and release documentation.
- [ ] Owner approves stable v1.0.0; tag release and attach offline HTML.
- [ ] Consider making repository public **only after** final review and approval.

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
