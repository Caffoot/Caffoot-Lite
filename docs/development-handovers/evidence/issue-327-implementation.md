# Issue #327 — Device Forms Ready For Private Acceptance

Only Device Add/Edit/Duplicate has been corrected under the [approved plan](../../development-guide/Issue-327-Device-Forms-Plan.md) and [owner approval 6692843829](https://github.com/Caffoot/Caffoot-Lite/issues/327#issuecomment-6692843829). Implementation and verification are complete; the owner's private visual acceptance is still outstanding.

The verified runtime is **`37de2141324e101ec77ee37b68f591ece398e164`** on `feat/approved-modular-html-282`. The final delivery commit adds this evidence and documentation, with identical application/backend/test files. Its exact SHA and matching private build tag are recorded in #327.

## What Changed


| Area | What changed | What stays working |
| --- | --- | --- |
| General / hosting | One checkbox beneath Physical Device Type, with dedicated product/version selectors. Ordinary OS is hidden while hosting is enabled. | Eligible physical servers only, saved OS/version/licence values, recognised/custom products and guest confirmations. |
| Ordinary selections | Known products are omitted from editor OS/software choices and pending assignment mode. Retained values get a short explanation. | Catalogue records, renamed stable keys, guest tools, unknown metadata and existing assignments. |
| VM forms | Purpose, host and allocations remain on General; physical type/location/mount/rack/Hardware are hidden. | Existing type/purpose filters, immutable Edit identity, eligible hosts, inherited values and copied allocations. |
| Cards / scrolling | Source card wrappers, retained-control spacing and closed-by-default inline Location. Duplicate uses the source subtitle. | All existing controls, body scrolling, fixed header/footer and copy safeguards. |
| Feedback | The existing validation messages appear above the footer, with the appropriate tab/field revealed. | Server validation, reservations, permissions, failed-save drafts and guest/discard confirmations. |
| Notes | Uses the available content height, retaining the source's 125px minimum and body scrolling in short windows. | Eight original actions, wrapping toolbar, internal text scrolling, safe Preview, notes and saving. |

The only application files changed are `interface/application.js` and editor-scoped additions to `interface/styles/components.css`. All HTML templates, twelve pinned source/style records, backend/API/schema, catalogues and accepted surrounding screens remain unchanged. [Nine identical before/after snapshots](issue-327-implementation/scope-comparison.json) include compressed DOM/style evidence for Overview, Inventory, Types, Locations, Manufacturers, Models, Software, Services and read-only Details. The separate Close × defect #328 remains untouched.

## Checks And Results

| Check | Actual result |
| --- | --- |
| Focused Device editor checks | Twelve functional groups passed: hosting/filtering, retained legacy data, guest safety, native/business feedback, VM allocation save/reload, Duplicate, eight Notes actions/safe preview/persistence, 16 physical types/six VM purposes, custom host/new guest creation, simulated 500/403/409 feedback, stable product identities and keyboard tabs. [Results](issue-327-implementation/functional.json). |
| Existing full backend suite | **448 run: 445 passed, three skipped.** Covers authentication/MFA, security, permissions, validation, persistence, migrations and concurrency. [Local summary](issue-327-implementation/backend-results.txt); [final GitHub run](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42281178624). |
| Existing full Chromium regression | Passed locally and on the final code in [GitHub](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42281178532), including multi-user permissions, exclusive edit reservations, catalogues, IPAM/Racks and published-export migration. [Local results](issue-327-implementation/browser-results.txt). |
| Rendered forms | **239 states passed**: 216 main form/tab/mode/viewport/theme states, 20 expanded inline forms, three enlarged-text stress states. No dialog horizontal overflow; source dialog bounds and fixed footer checks passed. Enlarged footer labels also fit their buttons. [Measurements](issue-327-implementation/measurements.json). |
| Scroll / keyboard / discard | Wheel scrolling in General and the nested software list, fixed header/footer/background, Tab/Shift+Tab wrapping, Escape/Keep Editing, discard focus return and unchanged saved records passed. [Results](issue-327-implementation/interactions-final.json). |
| Zoom-equivalent layout | Ten further tab/theme checks passed at 720×475 CSS pixels with DPR 2, producing 1440×950 screenshots. This models the desktop 200% zoom layout; it is not native-browser zoom certification. [Method/results](issue-327-implementation/zoom-equivalent.json). |
| Surrounding accepted screens | Nine complete DOM and visible computed-style/bounds snapshots are identical, rechecked after the footer correction. [Evidence](issue-327-implementation/scope-comparison.json). |
| Source / documentation / syntax | Twelve exact source/style hashes and template dependencies passed; HTML contract, JavaScript syntax, Function Index regeneration and v2.0.3 release consistency passed. [Results](issue-327-implementation/provenance-results.txt). |
| Secret history | Final runtime [Git history scan passed](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42281178602). The final evidence commit's check is linked in #327. |
| Docker lifecycle | [GitHub's AMD64 build/restart/persistent-volume/port test passed](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42281178468). No worker ARM64 build, public image, owner deployment or release was attempted. |

The three backend skips are the separately exercised Docker lifecycle test and two tests requiring an unavailable genuine private v1.3.3 export. Synthetic and published-export migration checks passed. No current automated failure remains.

## Visual Review And Evidence

The final [browser artifact](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42281178532/artifacts/13536240218) contains **1,348 PNGs**, including top/middle/bottom live/source captures of every main state. GitHub retains that artifact for 14 days. The [permanent gallery](issue-327-implementation/images/README.md) keeps 39 selected PNGs, four scroll contact sheets and links to four further zoom-equivalent captures. The [complete screenshot hashes](issue-327-implementation/screenshots.json) identify the full artifact.

| Viewport | Duplicate Notes body, live / source | Notes textarea | Behaviour |
| --- | --- | --- | --- |
| 1440×950 | 641.41px / 641.41px | 413.81px | Fills the remaining body height. |
| 1366×600 | 331.41px / 331.41px | 125px | Source minimum retained; footer stays fixed. |
| 390×844 | 622px / 622px | 363.81px | Single-column mobile card fills the body. |
| 320×568 | 346px / 346px | 125px | Necessary body scrolling; fixed actions remain reachable. |

These final GitHub measurements use matching offline font fallbacks for live/source. Earlier local investigation measurements used a different runner; they remain historical observations, not fixed height targets. The standalone Batch 04 file has no dark palette, so dark captures compare its original geometry while retaining the accepted application's dark theme.

Manual review covered the retained desktop/mobile scroll sequences, General hosting, VM-only controls, source card treatment, the Notes minimum/fill and enlarged footer text. The recorded owner amendments explain the General hosting placement, hidden physical VM controls, ordinary-product filtering and larger Notes area. Real catalogue values, authorised compatibility controls and existing filters account for legitimate differences from mock content. This is not a claim of blanket pixel equivalence or owner visual approval.

The first working checkpoint was `86314f4`; `4380bad` completed the main verification. Intermediate fixture/selector expectations were corrected. Screenshot review caught an inline Location panel opening unnecessarily and, later, enlarged labels escaping their buttons despite passing the original geometry check. Both are corrected. The final footer change leaves all **216 normal states and 20 expanded-inline states geometrically identical** to the preceding run; a new text-bounds assertion verifies the enlarged labels.

## Completion Checklist

- [x] Authorised editor corrections and saved-data preservation.
- [x] Full rendered comparisons and confirmed fidelity corrections.
- [x] Functional, backend, browser, permission/security and migration checks.
- [x] Pinned sources, unchanged-screen comparison, documentation/index and GitHub checks.
- [x] Committed/pushed checkpoints and final evidence recorded in #327.
- [ ] Owner's private native Raspberry Pi, Safari, touch/mobile-keyboard and visual acceptance.

## Private Raspberry Pi Acceptance


No public image or worker-built ARM64 image is supplied. Build natively on the owner's Pi using the existing private workflow:

1. Use a separate clean clone of `feat/approved-modular-html-282`. Compare `git rev-parse HEAD` with the final delivery SHA in #327 before building; `git status --short` must be empty.
2. Run `python3 scripts/build_private_acceptance.py`. It builds the exact commit locally and prints `caffoot-lite:private-<first 12 characters of SHA>`; it does not publish.
3. Inspect that image's architecture and `org.opencontainers.image.revision` label. Expect `arm64` and the exact reviewed SHA.
4. Start a separate acceptance container on an unused port with a fresh named volume. Use the established `CAFFOOT_WEB_ADDRESS` and `CAFFOOT_SERVER_ADDRESS` settings for that private address. Keep production's container, port and data volume separate.
5. Check Add/Edit/Duplicate across the owner's real desktop, small laptop and phone: hosting on/off, known/custom products and versions, no-host/eligible-host VM entry, every relevant purpose, saved legacy records, Notes/Preview, validation, scrolling and fixed actions. Check guest confirmation Cancel/Confirm using fictional or privately copied records. Confirm surrounding accepted screens and the intentionally unchanged #328 defect.

Owner acceptance is still required on native Safari, physical touch/keyboard and real mobile address-bar/on-screen-keyboard states. Chromium emulation and the enlarged-text stress captures do not certify those environments. A genuine private v1.3.3 backup was unavailable for two established tests. Docker lifecycle is checked separately in GitHub; its AMD64 result is not a Pi build or private visual acceptance. No implementation decision remains blocked on further design approval.
