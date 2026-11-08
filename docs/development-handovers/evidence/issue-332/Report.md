# Issue #332 — Device Corrections Ready For Private Acceptance

[Issue #332](https://github.com/Caffoot/Caffoot-Lite/issues/332) authorises this narrow batch on `feat/approved-modular-html-282`. Work began from clean local/GitHub `6e4e8c8f168ef5b577333253d23bb0c7471a02d6`; the first tested checkpoint is `4519c742d87251d7f6aaeed4a3dc3e5bd738ea9a`. The exact final commit and its GitHub check links are recorded in #332 after this evidence checkpoint is pushed.

## What Changed

**Dependent choices update straight away.** Device Type, physical/virtual deployment and VM purpose refresh OS, version, software and manufacturer/model choices, including hidden tabs. Searchable captions follow their underlying values immediately. A new incompatible standard OS/version is cleared; unknown Custom values are not given a guessed compatibility rule. Existing saved values in Edit/Duplicate are marked as previously recorded and retained until deliberately replaced. Checked software keeps the #331 retention behaviour. Changing an OS edition or hosting product, including editing a custom product name, clears the old product's draft version. Merely opening an existing record preserves its data.

**Rack location is a default, not a constraint.** Selecting a valid rack for a new physical device uses its existing matching Location Area. A manual choice prevents later rack selections overwriting it, even after the draft is reopened. Existing records keep their saved area. Duplicate initially keeps the copied area and defaults only after a deliberate different rack choice without a manual override. Cleared racks and unmatched areas do not create or guess locations. Both mounting paths use this rule; shelf/U validation is unchanged. These override flags belong only to the draft, not inventory or SQLite.

**Details has one approved header ×.** The malformed text has been replaced with the pinned Batch 04 icon control. Its accessible name, click, Escape, keyboard focus/return and distinct footer Close remain. Scoped existing theme tokens and the existing focus-ring rule preserve the dark palette and keyboard visibility; other modal controls are untouched. [#328](https://github.com/Caffoot/Caffoot-Lite/issues/328) remains open pending owner confirmation.

Changing form controls creates no audit events. Successful Save uses existing permissions, revisions, five-minute edit reservations and audit transactions. The existing safe history helper records bounded OS/version before/after values alongside existing location values. It does not copy licence data, surrounding details or unknown metadata. There is no backend OS whitelist, new schema, audit system or security-policy change.

## Actual Checks

| Check | Result |
| --- | --- |
| Full backend | **469 run, 466 passed, three established skips**, 49.655 seconds. [Results](backend-full.txt). Includes permissions, authentication/MFA/email security, reservations, data/migration and shelf protection. |
| Focused backend | **30 passed**, covering the two new safe-history tests, shelf/history permissions and exact pinned-source/template checks. [Results](final-backend-focused.txt). |
| #332 browser scenarios | **Seven groups passed**, with no page errors. Add/Edit/Duplicate, hidden-tab updates, searchable captions, standard/Custom/edition versions, manufacturer/model context, rack defaults/overrides, saved data, no audit on Cancel, actual Save/history and Details dismissal. [Checks/measurements](focused-checks.json). |
| Existing full Chromium regression | Passed locally; [results](browser-full.txt). Existing rack/IPAM, user/MFA/permissions, host/VM, two-user locks, legacy import and saved records remain working. |
| #331 integration | **Seven catalogue and eight shelf groups passed** alongside #332 in the same isolated run. Includes movement, collisions, replacement/removal, held reservation, historical software and JSON backup/import review. [Combined results](browser-combined.txt), [catalogue](catalogue-checks.json), [shelves](shelf-checks.json). |
| Existing editor/source suite | Passed in GitHub on the first checkpoint, including all complete scroll comparisons and enlarged-text checks. [Browser run](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42351994947). Final delivery repeats the checks on its exact commit. |
| Documentation/provenance | Documentation compatibility, all twelve pinned HTML/CSS sources, template dependencies, regenerated Function Index, JavaScript syntax and whitespace passed. [Documentation](documentation.txt), [provenance](provenance.txt). |
| GitHub checks | First checkpoint backend, browser, full-history secret scan and AMD64 Docker lifecycle all passed. Final exact-commit checks and artifact links are recorded in #332; a pending run is not a pass. |

The three backend skips are the separately exercised opt-in Docker lifecycle test and two tests requiring an unavailable genuine private v1.3.3 backup. Synthetic/published migration checks passed. Test-development failures were corrected and rerun; no failed check is counted as passed. Chromium does not establish native Safari acceptance.

## Visual Evidence

Before/after images use the same fictional Hypervisor record at 1440px dark and 390px light, captured at 900px height. The before images come from the starting checkpoint; after images show the corrected control. The full focused artifact also contains source/live Details captures at **1440 × 950, 1366 × 600, 390 × 844 and 320 × 568**, in both live themes.

Measured in all eight cases:

- Header control **36 × 36px**, **20px** type and **9px** radius, matching Batch 04.
- Desktop inset: **25px right / 20px top**; mobile inset: **15px right / 16px top**, matching the source.
- Width, height and both inset differences from source: **0px**.
- One visible × with accessible name **Close device details**; footer Close remains separate.
- Keyboard Tab/Shift+Tab focus, visible outline, Space on the header, Enter on the footer, Escape and focus return passed.
- Live dark control uses the existing `#0f172a` background and `#f1f5f9` text tokens.

[Visual summary](visual-summary.json), [before/after images](images/). Manual inspection confirms the stray text is removed and the surrounding header/footer treatment is preserved. The pinned preview supplies the light design; dark source filenames refer to geometry checks against that unchanged light source, not an invented approved dark preview. Live dark colours are checked independently.

The twelve pinned sources/provenance remain unchanged. There is no new card, tab, navigation redesign or dependency. #329 IPAM work is not included; #327/#330 remain separate.

## Private Raspberry Pi And Safari Acceptance

No worker-built ARM64 image or public image is supplied. The owner should rebuild natively using the established private workflow:

1. On the Pi, use a clean checkout of `feat/approved-modular-html-282`. Verify its SHA against #332's exact final delivery SHA and confirm `git status --short` is empty.
2. Run `python3 scripts/build_private_acceptance.py`. It builds that commit locally without publication and prints `caffoot-lite:private-<first 12 SHA characters>`. Verify `arm64` and the exact `org.opencontainers.image.revision` label.
3. Use the owner's separate private **8445 acceptance stack**, following its established workflow and backup arrangements. Keep production untouched; use fictional records or an isolated private copy.
4. Repeat Desktop → Windows/version → NAS before opening the dependent dropdown. Check Server, Printer and VM purpose changes, edition/version refresh, custom hypervisor product edits, hidden tabs, manufacturer/model context and historical/custom/archived selections.
5. Exercise both mounting paths: first rack default, another rack, manual override, cleared rack, Unknown/unmatched area, Edit opening/refresh and Duplicate. Save/reload/Cancel must retain the intended values and existing shelf association.
6. Check Details header × and footer Close in native Safari across desktop/mobile, both themes and enlarged text. Check click, Tab/Shift+Tab, Space/Enter, Escape and returned focus; confirm no stray text. Report the result in #332/#328 before closing #328.
7. Confirm #331 shelf movement/occupancy/removal, host/guest/version choices, edit reservations and existing permissions. Treat the independent #327/#330 acceptance separately.

No further design approval is outstanding for this batch. The remaining limits are native owner Pi/Safari/touch/visual acceptance and the two unavailable genuine-backup fixture tests. Automated success identifies a private acceptance candidate; it does not authorise merge, publication, deployment or release.
