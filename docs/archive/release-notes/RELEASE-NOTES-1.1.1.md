# Caffoot Lite v1.1.1 — Release Notes

**Status:** Published stable release on 18 October 2026. [Download v1.1.1](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.1.1).

## Highlights

- **Settings & Data reorganised:** Data Management, Preferences, Help & Guides and About Caffoot Lite tabs make important actions easier to find.
- **Offline Help & Guides:** Eight expandable guides cover getting started, IPAM and subnets, devices and locations, racks, backups and restore, updates and recovery, appearance and inventory health, and troubleshooting.
- **Appearance preferences:** Choose Light Mode, Dark Mode or Use System Setting; the selection persists in browser-local storage.
- **Inventory Health:** Dashboard terminology is clearer, with internal development-phase labels removed from the interface.
- **Update status:** Clearer messages for update checks, including offline, checking, up-to-date and error states. Update checking is user-initiated; no automatic installation or inventory upload is introduced.
- **Branding:** Updated official Caffoot Lite logo and “Infrastructure, Simplified.” presentation in the About view.
- **Documentation and safeguards:** User documentation and the release checklist now require reviewing the built-in offline help whenever workflows change; regression tests cover the redesigned Settings and update wording.

## Upgrade and data safety

**Export a JSON backup before upgrading and keep it outside the browser.** Inventory is stored in browser local storage, not inside the HTML file. A renamed or relocated `file://` application may appear empty because browser storage scopes differ. Verify your inventory after opening the new version, and restore only from a trusted backup when needed.

The distributed application remains a standalone HTML file with embedded styling, icon assets, branding and licence notices. No account, database or web server is needed.

## Compatibility and limitations

- Existing inventory, backup and restore safeguards remain covered by automated regression tests.
- Independent overlapping customer network environments are not supported in v1.1.1; this remains future roadmap work.
- This release does not claim a formal security audit or accessibility certification.

## Release verification

- [x] Automated release tests and offline HTML build passed before version bump.
- [x] Owner confirmed nine browser acceptance checks, including offline operation and backup/restore with disposable data.
- [x] Full regression suite and standalone build passed; v1.1.1 ZIP packaged and integrity-checked locally and in GitHub Actions.
- [x] PR #39 reviewed and merged with owner approval.
- [x] Published v1.1.1 tag and three release assets after owner approval.
