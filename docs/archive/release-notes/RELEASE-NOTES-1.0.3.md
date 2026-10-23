# Caffoot Lite v1.0.3

A maintenance release focused on safer device editing, more useful managed options and consistent interface wording.

## Improvements

- Preserve unfinished Add/Edit Device details when opening and closing Server Options or Software Options management.
- Select installed software per device on physical and virtual servers, desktops, laptops and tablets.
- Select server functionality per device from managed server options.
- Show relevant management buttons for supported device types; simplify manager navigation while retaining standalone settings management.
- Standardise capitalisation across device forms, IPAM, Settings, rack views, headings and buttons.

## Compatibility and data safety

Existing inventories and customised managed options are preserved. New installations continue to start with empty Server Options and Software Options lists. Export a JSON backup before switching HTML files, browser profiles or storage locations; local browser storage is not automatically portable.

## Manual Windows release (no GitHub Actions)

1. Merge the release-notes PR and download a **fresh source ZIP** from the updated `main` branch (green **Code → Download ZIP**), then extract it.
2. Open PowerShell in the extracted `app` folder. Run `npm.cmd ci --no-audit --no-fund`, then `npm.cmd run release`.
3. Confirm every test and packaging step succeeds and `app/dist` contains `Caffoot-Lite.html`, `Caffoot-Lite-1.0.3.zip` and `SHA256SUMS`.
4. Test the generated HTML offline in a browser and verify device form preservation, manager selections and the updated interface labels.
5. Create a GitHub release targeting `main`, tag `v1.0.3`, upload all three files and mark it latest. Keep previous releases available.

The sample JSON files included in the ZIP are optional fixtures and are not automatically imported.
