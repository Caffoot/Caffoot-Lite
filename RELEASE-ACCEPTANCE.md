# Final private candidate acceptance

Publication is blocked until the remaining manual checks below are confirmed and the owner explicitly approves the release and repository visibility change. Use the latest green **private preview ZIP**, not developer source. The candidate remains `1.0.0-rc.1`; the planned stable version is `1.0.0`.

## Safari upgrade, move and rename — owner check required

Use a copy of your HTML and exported test inventory, keeping your real file and backup safe. Do not clear real browser data.

1. In the existing version, export JSON; note device, subnet, rack and IPAM counts and one known device/rack placement.
2. Extract the latest preview ZIP into a separate folder and open its `Caffoot-Lite.html` in Safari. Record whether existing inventory is visible: either outcome can occur because file storage scope varies.
3. Choose the exported backup in Settings & Data. Cancel the replacement prompt once and confirm visible inventory is unchanged.
4. Import again and approve. Confirm original counts, device details, primary IP, IPAM hostname/notes, rack position and accessories. Reopen Safari/file and confirm persistence.
5. Copy the preview to another folder and rename it `Caffoot-Lite-test.html`. Open it, restore the same backup if needed, and repeat the inventory checks. Keep the original JSON unchanged.
6. Disconnect internet. Confirm navigation, export, restore and the safe update guide still work; Check for updates reports offline. Reconnect and check that the private/no-release or connection feedback is clear.
7. In About Caffoot Lite, open Software licences. Confirm the MIT, Font Awesome and Tailwind notices can be read offline. Check light and dark themes.

Report `Safari upgrade 1–7 passed` or the numbered failure and what happened. Automated Chromium checks supplement this pass; they do not establish Safari storage behaviour.

## VoiceOver — owner check required

Turn on VoiceOver on your Mac (Command–F5, or accessibility settings). Use a test inventory.

1. Navigate the main sections and Settings tabs. Confirm controls have meaningful names and the selected section is understandable.
2. Open Add Device and Add Subnet. Confirm dialog context and field labels are announced, including required Location, Type, subnet and IP fields. Trigger a missing/invalid required value and confirm the error can be understood and reached.
3. Navigate forward/back through a modal, close with Escape, and confirm focus returns to the invoking control.
4. Open the safe update guide and Software licences; confirm headings, instructions, buttons/link and notice text can be read.
5. Run Check for updates offline and confirm its status can be heard or reached. Inspect restore confirmation and ensure replacement consequences are understandable; cancel.
6. Confirm device/IPAM tables and rack equipment can be inspected without relying only on colour; use forms for placement rather than requiring drag-and-drop.

Report `VoiceOver 1–6 passed` or the numbered failure. This is a targeted acceptance check, not formal WCAG certification. Keyboard/browser automation cannot substitute for actual VoiceOver.

## Stable release preparation after acceptance

Set the app/backup producer and package versions to `1.0.0` consistently, update release notes and evidence, and run all checks again. Review the generated ZIP and SHA256SUMS. Obtain explicit owner approval before changing repository visibility, creating a public tag/release, or publishing assets. No publication action is performed by the build workflow.
