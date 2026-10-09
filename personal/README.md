# Caffoot Lite

Caffoot Lite is a standalone, browser-based network inventory application derived from NetMini Phase 19D2. This independent repository contains only Caffoot Lite; the original NetMini reference remains in the separate Caffoot repository.

## Current status

**Development preview, not yet a verified offline release.** The source HTML at `caffoot-personal.html` still loads Tailwind and Font Awesome from the internet. Do not distribute it as offline-ready.

## Build a single offline HTML file (developer workflow)

Requires Node.js and npm on the **developer's machine only**. End users will not need either once a release is verified.

```sh
cd personal
npm install
npm run release
```

The intended output is `personal/dist/caffoot-personal-offline.html`. The build compiles Tailwind utilities and embeds Font Awesome webfonts directly into the file. `npm run release` checks the generated HTML for expected assets and for external script or stylesheet references. GitHub Actions runs automated build and syntax checks. Manual offline browser testing is still required before v1.0.

## Data and privacy

Inventory is stored in browser-local storage, not in a shared server database. Preserve the existing `netmini_state` storage key for backward compatibility. Browser `file://` storage handling varies by browser and file location: moving or renaming the HTML file can affect access to previously saved data.

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

## Caffoot Server

The server edition is paused, not cancelled. The existing server branches and Docker preview should remain unchanged until that project resumes.

## Accessibility testing

Target WCAG 2.2 AA; automated tests do not establish compliance.

Safari: Settings > Advanced > enable Tab highlighting of every webpage item. This is needed for full keyboard traversal of buttons and fields.

Manual RC1 checklist: verify Tab and Shift+Tab on Dashboard and Rack/Device dialogs; Escape and focus return; readable light/dark contrast; visible focus; labelled controls and errors; VoiceOver announcements; 200% zoom; reduced motion.
