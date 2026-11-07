# Issue #332 — Device Choices, Rack Location And Details Close

[Issue #332](https://github.com/Caffoot/Caffoot-Lite/issues/332) authorises these three narrow corrections. Work starts from clean local/GitHub `6e4e8c8f168ef5b577333253d23bb0c7471a02d6` on `feat/approved-modular-html-282`, preserving completed #331 work. The twelve pinned source files and their provenance remain unchanged. #329 is outside this batch; #327/#330 and private Safari/Pi acceptance remain independent.

## What Changes

Changing Device Type, deployment or VM purpose refreshes dependent choices immediately, even when Software or Hardware is hidden. A new standard OS choice incompatible with the destination type is cleared together with its draft version. An unknown Custom OS has no guessed compatibility rule and remains available. Existing recorded OS/version values in Edit/Duplicate are labelled as previously recorded and retained until deliberately replaced. Checked software follows #331's separate retention path. Manufacturer/model choices refresh without deleting custom hardware values.

Selecting another OS/edition or hosting product clears the previous product's draft version rather than silently treating it as a Custom version of the new product. Merely opening/re-rendering an existing record preserves its saved values. Searchable captions and open choice lists are refreshed through a dedicated presentation event, rather than triggering business-change/save handlers. Existing custom controls, type restrictions and host/guest separation remain in place.

For a new physical device, an explicit valid Rack selection supplies its existing, matching Location Area as a default. A manual location choice prevents later rack changes overwriting it, including when a draft is reopened after a catalogue/rack/subnet workflow. Clearing the rack leaves the location alone; an unmatched location is not invented. Edit never defaults over a saved location. Duplicate initially retains its copied location and may default only after a deliberate different rack choice, provided no manual override has been made. Both Rack Mounted and Tabletop / Shelf Mounted use the same narrow rule. No new inventory field or permanent rack/location constraint is added.

The Details header uses the approved Batch 04 single **×** in its **36 × 36px** control. Its accessible name, existing click handler, Escape, focus return and distinct footer Close remain. Scoped theme tokens and the existing focus-ring rule preserve dark colours and keyboard visibility. Other modal close controls are unchanged; #328 remains open until owner confirmation.

## Saving And History

Changing controls updates only the Device draft. Save still uses existing backend permissions, revisions, five-minute edit reservations and audit transactions. The existing safe before/after helper now records only bounded `softwarePlatform`/`softwareVersion` values as Operating System and OS / Platform Version, alongside existing location fields. It never copies the surrounding `typeDetails`, licence data or unknown metadata into history. No new audit system, backend OS whitelist, migration or security policy is introduced.

## Checks And Handover

- [x] Current branch/head and clean working tree checked before editing.
- [x] All three corrections implemented; first focused browser run passed seven scenario groups.
- [x] Focused backend/history/shelf checks: 28 passed.
- [x] Full backend: 469 run, 466 passed, three established skips.
- [x] Twelve-source/template provenance checks passed; Function Index regenerated.
- [x] Latest focused browser confirmation, including manufacturer/model captions, Details header keyboard focus and dark colours.
- [ ] Existing full browser/editor and #331 shelf/catalogue regressions on the delivery candidate.
- [ ] Final documentation/evidence and exact GitHub check results.
- [ ] Owner's native Raspberry Pi/Safari acceptance in the separate private 8445 stack.

The three backend skips are the opt-in Docker lifecycle test (covered separately by CI) and two unavailable genuine private v1.3.3 backup fixtures. Chromium results do not certify Safari. The pinned preview supplies the light design; live dark colours are checked separately using existing tokens.

Latest focused run passed all seven groups, including real Tab/Shift+Tab focus, keyboard header/footer dismissal, exact close geometry and existing dark colours. Before/after images, raw results and measurements are committed under `docs/development-handovers/evidence/issue-332/`.

Next: continue directly with existing browser/editor/#331 regressions and final evidence; inspect the GitHub checks for the implementation checkpoint linked in #332. Do not repeat #331 implementation or start #329, merge, publish, deploy or release.
