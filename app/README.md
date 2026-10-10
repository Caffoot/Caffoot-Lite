# Caffoot Lite

Caffoot Lite is a standalone, browser-based network inventory application. This repository contains the Lite application, its build tools, automated tests and supporting documentation.

## Current status

**v1.0.0-rc.1 release preparation.** The generated standalone HTML has passed offline Safari testing. The developer source HTML at `caffoot-lite.html` still references Tailwind and Font Awesome on the internet; distribute only the generated offline build.

## Build a single offline HTML file (developer workflow)

Requires Node.js and npm on the **developer's machine only**. End users will not need either once a release is verified.

```sh
cd app
npm install
npm run release
```

The intended output is `app/dist/Caffoot-Lite.html`. The build compiles Tailwind utilities and embeds Font Awesome webfonts directly into the file. `npm run release` checks the generated HTML for expected assets and for external script or stylesheet references. GitHub Actions runs automated build and syntax checks. Manual offline Safari testing has been completed for RC1; repeat verification for release changes.

## Data and privacy

Inventory is stored in browser-local storage, not in a shared server database. Inventory is stored under `caffoot_state`. Earlier development-only storage keys are not migrated automatically; export a JSON backup from an older test build before changing versions. Browser `file://` storage handling varies by browser and file location: moving or renaming the HTML file can affect access to previously saved data.

**Before testing a new build or replacing an existing copy, export a JSON backup from the current application and save it outside the browser.** Test restore using a separate browser profile or test dataset; do not overwrite your only inventory copy.

## Release checklist

- [ ] Run `npm run release` successfully.
- [ ] Open the generated file from disk while disconnected from the internet.
- [ ] Verify icons, layout, light/dark themes and responsive sizing.
- [ ] Verify dashboard, devices, IPAM/subnets, racks and assignments.
- [ ] Export test inventory, import it into a clean profile and compare records.
- [ ] Verify error handling for corrupt and incompatible backups.
- [ ] Verify storage behaviour after closing/reopening and moving the HTML file.
- [ ] Publish a versioned HTML download and release notes.

## Accessibility testing

Target WCAG 2.2 AA; automated tests do not establish compliance.

Safari: Settings > Advanced > enable Tab highlighting of every webpage item. This is needed for full keyboard traversal of buttons and fields.

RC1 testing order:

1. Light/dark theme review: readable text, labels, placeholders, errors, focus outlines and rack elevation.
2. Functional regression: Dashboard, Devices, IPAM/Subnets, Racks, Assignments and Data Management; backup before destructive tests.
3. Offline Safari: generated HTML opened from disk with network disconnected; verify icons, styles, save/reopen and JSON backup/restore using test data.
4. Final accessibility check: Tab/Shift+Tab, Escape/focus return, 200% zoom, reduced motion and **VoiceOver last**.

Main theme text contrast is checked in `check-app.cjs` against the WCAG AA 4.5:1 normal-text threshold. This is a palette check, not a complete rendered-page audit or WCAG conformance claim.
