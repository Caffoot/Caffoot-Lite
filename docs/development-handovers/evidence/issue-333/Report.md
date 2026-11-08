# Issue #333 — Private Acceptance Evidence

The current delivery SHA and final GitHub check links are recorded in [#333](https://github.com/Caffoot/Caffoot-Lite/issues/333). Work starts from `42cb8168375c0507b57206113d21a6efafce61b9` and stays on `feat/approved-modular-html-282`.

## What Was Reproduced And Corrected

- Trusted native keyboard events, before application edits, left Proxmox versions empty and gave Hyper-V the previous ESXi list. [Before event trace](before-native-events.json), [after event trace](after-native-events.json). Updating the product and refreshing its versions in the same handler removes the ordering gap. Existing approved catalogue arrays and storage remain unchanged.
- Rack Mounted without a rack produced a Start U error and no invalid Rack indication. [Before feedback](before-rack-feedback.json), [before image](before-rack.png), [corrected image](after-rack.png). Rack is now required for this physical mounting type, stale selection is checked before U validation and backend missing-rack feedback targets Rack. Existing modal validation reveals the right tab and focuses the field; no invalid record is saved. Stale local selection and an injected HTTP 400 missing-rack response exercise client/error handling, while the backend tests separately verify invalid references and deletion protections. No private rack or inventory was used.
- No OS-as-software regression was reproduced. Existing #331 catalogue/retention code remains unchanged, as do the #332 context refresh, historical platform handling, rack default and Details Close implementation. [Source comparison](accepted-scope.json).

## Visual And Keyboard Checks

The Chromium comparison covers 1440×950 desktop, 1366×600 laptop, 390×844 mobile and 320×568 narrow mobile, each in light and dark. The host form stays inside the viewport with internal scrolling and its existing footer. Rack validation remains above that footer and focuses Rack after revealing General from Networking. Subnet Type remains a labelled native select, with Tab moving to Subnet CIDR. No whole-screen pixel-equivalence claim is made.

The live IPAM Subnet Type matches the pinned preview in Chromium: 42px high, 13px text, 10px/11px padding, 9px corners and native appearance. [Live](subnet-desktop-live.png), [pinned preview](subnet-desktop-source.png), [raw measurements and six scenario groups](chromium-checks.json), [mobile dark host](host-mobile-dark.png). Differences in surrounding text and existing Close controls are outside this select review; they have not been changed.

Firefox/WebKit checks compare each engine's live select with its own pinned preview. [Firefox 153 results](firefox-checks.json) and [Linux WebKit 26.5 results](webkit-checks.json) each passed all six groups at `e802dab034dcb04f3173f3e7248c5564386ee912`. Live/source select widths are 527px on both desktop/laptop layouts, 318px at 390px and 248px at 320px. Firefox renders both at 42px high; Linux WebKit renders both at 47px. Font size, padding, corner radius and native appearance match in each engine. [Firefox desktop](firefox-subnet-desktop.png), [WebKit desktop](webkit-subnet-desktop.png), [WebKit mobile dark host](webkit-host-mobile-dark.png).

Earlier failed jobs are not counted as passes. The first appearance test incorrectly assumed Chromium's native height. Older Firefox did not apply the existing scoped styles; current isolated test tools resolved that comparison without application changes. WebKit's apparent width mismatch persisted through the correct entry path until the test foregrounded the live tab and waited for its real opening transition; settled geometry then matched. There is no CSS correction or browser-support policy change. Linux native widget painting remains separate from macOS Safari acceptance.

## Checks

- [92 focused backend tests](backend-focused.txt): passed.
- [Full backend CI](backend-ci.txt): 469 run, 466 passed, three established skips. These are opt-in Docker lifecycle, covered separately by its own job, and two unavailable genuine private v1.3.3 backup fixture tests.
- [Focused Chromium](chromium.txt): six scenario groups passed, no page errors. Includes exact separate vendor versions, Save/reopen/Edit/Cancel/Duplicate, custom/history metadata, host/guest distinction, reservation preservation, missing/stale/backend-rejected racks and shelf optionality.
- [Documentation compatibility](documentation.txt): passed. Function Index regenerated. The twelve approved sources, provenance, backend, styles, screen HTML and templates are unchanged from the starting checkpoint.
- [Full existing Chromium/editor and #331/#332 regression](chromium-ci.txt) passed on application checkpoint `10408df32761964956624611895a93b1548e35bb`: 239 rendered editor states; seven contextual catalogue, eight shelf, four rack-location and seven form-follow-up groups. Includes permissions, concurrent edit reservations, archive/history retention and imported backups.
- [Docker Compose lifecycle](docker-ci.txt) passed on that same application checkpoint: one real test covering configurable port and database/TLS persistence after restart/recreation. No application changes follow that commit.
- [Final repeat Chromium results](final-chromium-ci.txt) passed all existing groups and 239 editor states at `e802dab034dcb04f3173f3e7248c5564386ee912`. [Final CI receipt](final-ci-summary.json) records successful Chromium, Firefox, WebKit, backend and secret checks. Final delivery is documentation/evidence only after this verified code/test checkpoint; its SHA and final secret-scan result are recorded in #333.

## Private Native Pi/Safari Acceptance

Native Safari has not been run here. Local Linux WebKit lacks required system libraries; local Firefox could not initialise its rendering surface. GitHub's isolated Linux engine checks do not replace macOS Safari or native device acceptance.

On the owner's Pi, use a clean checkout of the exact final SHA from #333 on the development branch, then run `python3 scripts/build_private_acceptance.py` natively. Its local tag is `caffoot-lite:private-<first 12 SHA characters>`. Verify Docker image architecture is `arm64` and `org.opencontainers.image.revision` equals that full SHA. No cross-architecture worker build or published image is supplied.

Follow the existing private 8445 Portainer workflow and change **only the image line** in the existing acceptance stack. Keep its current ports, volumes, environment and private installation secrets. Do not substitute another stack or touch production.

1. Add Physical Server, enable hosting, choose Proxmox VE and confirm released versions appear; choose 9.2 and save/reopen.
2. Switch between Hyper-V and ESXi and confirm Windows host-family versus ESXi lists; check custom/version preservation in Edit/Duplicate and Cancel.
3. Check a virtual guest keeps its separate OS and host relationship.
4. Save Rack Mounted equipment without Rack; confirm General, visible modal feedback and focused Rack. Check the existing optional-rack shelf path too.
5. Confirm accepted OS/Installed Software and manual rack/location overrides remain intact.
6. Open IPAM Add Subnet at the usual Safari zoom/display scale. Check Subnet Type text, spacing, chevron, focus, keyboard selection and Tab at desktop/mobile widths in both themes. If it still looks compact, record Safari version, OS, zoom/display scale and a screenshot of both the live control and pinned preview at matching width. No speculative CSS adjustment has been made.

Owner confirmation of #327 and #330 remains outstanding. #329 is untouched. No merge, image publication, release or deployment has been performed.

## Remaining Work

No demonstrated in-scope application failure remains in the available automated checks. Native Pi/Safari review remains open for both parent issues. The two genuine private backup fixture tests remain unavailable; the general backend Docker opt-in skip is covered by the passing dedicated lifecycle job. No new design or security-policy decision is required. Resume only an actual failure or the owner's findings, preserving all accepted behaviour and leaving #329 untouched.
