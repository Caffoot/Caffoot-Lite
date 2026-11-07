# Remaining Rack Location Correction

The owner accepted the Close button and dependent OS/software fixes in native Raspberry Pi/Safari testing of `7c95be28e39388efa73623c127bd60a89fca25f2`. [Comment 6704196904](https://github.com/Caffoot/Caffoot-Lite/issues/332#issuecomment-6704196904) records the remaining failure and authorises investigation/correction under #332. This follow-up changes only Rack → Location Area defaulting. The exact final SHA/check links are recorded in #332 after push.

## Confirmed Cause

The failure was reproduced **before application changes**, using the real Rack editor and isolated fictional records. It saved `location: "Main Office"`. Add Device → Router → Tabletop / Shelf Mounted then called the correct defaulting handler, with no manual override and an enabled location field. However, the available Device areas were `Office`, `Server Room` and `Unknown`; `Main Office` was missing. The old helper looked only for an exact existing option and returned, leaving the required value empty.

The Rack editor stores a plain room name independently of the managed Device location list. Device options come from that list and saved Device areas, excluding rack-only rooms. This reproduced path is not an ID/label mismatch or a missed change event. [Before trace](before-trace.json), [reproduction output](reproduction.txt).

Earlier tests chose rack rooms already present in the Device list and missed the real data flow. The old unmatched-room fixture also assumed that a recorded rack-only room should not default. It now tests a genuinely absent room; the new test explicitly covers the real, recorded `Main Office` case.

## Small Correction

The current form offers a valid, already-recorded rack room when it is missing from its options, then selects it. This does **not** create a managed location, write settings or add audit entries. Only the usual successful Device Save persists the chosen area. Blank/invalid reserved room values leave required selection intact; no room is invented or guessed.

A blank, new Add draft reopened with its rack already selected now also defaults. Saved Edit locations, copied Duplicate locations on opening, existing non-empty drafts and manual overrides remain protected. Duplicate may default after an explicit different rack choice, as already approved. The existing native/searchable control and presentation refresh are reused.

Only `defaultDeviceLocationFromRack` and its initial call in `openDeviceModal` change in application JavaScript. The accepted OS/dropdown function bodies, Device Details rendering, Close markup and presentation CSS are identical to the accepted checkpoint. [Source hashes/scope check](unchanged-accepted-fixes.json). There are no backend, schema, permissions, five-minute reservation, pinned-source, layout or #329 changes.

## Verification

- The corrected browser trace changes the same rack-only `Main Office` case from empty to `Main Office`.
- Four new browser groups cover real Rack-editor data, shelf U9 creation, Save/reload, unchanged managed-location settings and no audit before Save; real searchable Rack/Location selection and captions; rack switches/clearing and restored drafts; both mounting paths and required validation; Edit/Duplicate/Cancel data preservation.
- Desktop/mobile light/dark captures show the existing Location Area control with the recorded default. No layout redesign is involved.
- **92 focused backend tests passed**, covering shelf associations, reserved Device saves, collection operations, safe platform history and all twelve pinned sources/template dependencies. [Results](backend.txt).
- **All seven #332 scenario groups and eight essential #331 shelf groups passed with the four new groups in one combined run**, with no page errors. [Combined results](browser-regression.txt), [new checks](checks.json), [#332 checks](followup-regression.json), [shelf checks](shelf-regression.json). Final exact-commit GitHub validation is recorded in #332 after push. Pending checks are never counted as passed.

## Private Owner Recheck

The correction still needs native Pi/Safari rechecking. On a clean checkout of the exact final SHA on `feat/approved-modular-html-282`, use `python3 scripts/build_private_acceptance.py` natively on the Pi. The local tag is `caffoot-lite:private-<first 12 SHA characters>`; verify `arm64` and the exact revision label before following the established private 8445 workflow. No worker ARM64 build or image publication is supplied.

Use an existing rack whose room is absent from the Device location list. Add the physical Router/Tabletop device, choose the rack and shelf, and confirm `Main Office` appears immediately. Change Location Area manually, choose another rack and confirm the override remains. Check blank/restored Add drafts, an existing saved device, Duplicate and Save/reload. Do not repeat or change the two already accepted implementations. No merge, production access, deployment or release is authorised.
