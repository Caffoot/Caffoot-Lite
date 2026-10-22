# Final private candidate acceptance

Version `1.0.0` is published following owner acceptance, explicit publication approval and a successful final automated rerun. The detailed walkthrough below remains a reusable checklist; it is not a claim that each numbered step was individually reported.

## Safari upgrade, move and rename — reusable checklist

Use a separate Safari test profile with a copy of your HTML and exported test inventory. Keep your real file and backup safe; some local files share storage in the same profile. Do not clear real browser data.

1. In the existing version, export JSON; note device, subnet, rack and IPAM counts and one known device/rack placement.
2. Extract the latest preview ZIP into a separate folder and open its `Caffoot-Lite.html` in Safari. Record whether existing inventory is visible: either outcome can occur because file storage scope varies.
3. Choose the exported backup in Settings & Data. Cancel the replacement prompt once and confirm visible inventory is unchanged.
4. Import again and approve. Confirm original counts, device details, primary IP, IPAM hostname/notes, rack position and accessories. Reopen Safari/file and confirm persistence.
5. Copy the preview to another folder and rename it `Caffoot-Lite-test.html`. Open it, restore the same backup if needed, and repeat the inventory checks. Keep the original JSON unchanged.
6. Disconnect internet. Confirm navigation, export, restore and the safe update guide still work; Check for updates reports offline. Reconnect and check that the private/no-release or connection feedback is clear.
7. In About Caffoot Lite, open Software licences. Confirm the MIT, Font Awesome and Tailwind notices can be read offline. Check light and dark themes.

Report `Safari upgrade 1–7 passed` or the numbered failure and what happened. Automated Chromium checks supplement this pass; they do not establish Safari storage behaviour.

## VoiceOver — reusable checklist

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

### Local file storage scope

The upgrade test observed shared browser storage across original and renamed HTML paths in the CI Chromium profile. Do not assume separate folders protect separate inventories: restoring in a new copy can change data visible in the old copy. Other browsers may isolate paths. Keep an exported JSON backup outside the browser; use a separate browser profile for isolated test inventories. The test asserts restoration and persistence according to the observed scope instead of assuming isolation.

## Verified private preview

Source commit: `be6eac2304fd4dd60582d3c884b61fc85767dba0`. Full private workflow [38063343516](https://github.com/caffoot/Caffoot-Lite/actions/runs/38063343516) passed build, regression, offline browser, upgraded-file restore, package and artifact checks. Download `caffoot-lite-offline-preview` from that run; extract its inner `Caffoot-Lite-1.0.0-rc.1.zip` for testing. The owner subsequently reported positive Safari appearance and VoiceOver results and confirmed the export/restore/reopen sequence.

## Owner acceptance recorded — 10 October 2026

The owner downloaded the latest preview, opened it in Safari, liked the appearance and new warning, and reported that VoiceOver appears to work well. In response to the explicit three-step export-backup, restore/check devices/IPAM/subnets/racks, close/reopen question, the owner confirmed: “yes tested that all works really well”.

This establishes owner-reported Safari restore/reopen acceptance and positive VoiceOver feedback. It does not establish a formal accessibility certification or individually witnessed results for every numbered checklist step (including manual rename, offline update check and licence-reader checks). Those behaviours also have automated coverage where applicable. Only version identifiers and release documentation change for stable 1.0.0; full automated checks run again. Explicit publication approval was subsequently given, and publication is complete.


## Publication completed — 10 October 2026

The owner explicitly approved making `sdelnevo/Caffoot-Lite` public and publishing Caffoot Lite v1.0.0 with the prepared downloads. The owner changed repository visibility to public. The final stable source commit `6f5d38e6959016fb236763f8f7a241de14d23c83` passed the complete automated suite in [workflow 38064002992](https://github.com/caffoot/Caffoot-Lite/actions/runs/38064002992). [Publication workflow 38065143351](https://github.com/caffoot/Caffoot-Lite/actions/runs/38065143351) verified that exact artifact, finalised release-note wording without changing runnable HTML, checked package member hashes and uploaded asset digests, then published the stable release.

[Caffoot Lite v1.0.0](https://github.com/caffoot/Caffoot-Lite/releases/tag/v1.0.0) includes `Caffoot-Lite-1.0.0.zip`, `Caffoot-Lite.html` and `SHA256SUMS`. The tag points to the tested source commit. Earlier private-preparation results below are retained as historical evidence.
