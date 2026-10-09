# Caffoot Lite — Development Roadmap

**Updated:** 9 October 2026  
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

The features above are implemented or recorded as delivered in the original NetMini roadmap. **Latest Caffoot Lite browser regression and release approval remain outstanding.**

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

Keep the `netmini_state` storage key and compatible backup formats unless a tested migration is provided. Keep Caffoot Server and the original repository untouched. Maintain a known-good rollback until the new build is confirmed stable.
