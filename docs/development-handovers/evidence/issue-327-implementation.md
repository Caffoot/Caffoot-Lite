# Issue #327 — Approved Device Editor Implementation

The owner authorised the revised [Device Forms Plan](../../development-guide/Issue-327-Device-Forms-Plan.md) in [comment 6692843829](https://github.com/Caffoot/Caffoot-Lite/issues/327#issuecomment-6692843829). Implementation starts from `de502337377d318b345c1608ce99c389c566abce` on `feat/approved-modular-html-282`.

## First Committed Checkpoint

The editor now has one physical-server hosting path beneath Physical Device Type on General, with dedicated product/version controls and ordinary-OS hiding. Ordinary form choices omit recognised hypervisor products while preserving saved selections and catalogue records. VM-only visibility, source Software card wrappers, the Duplicate subtitle, editor-local feedback/focus and available-height Notes are implemented. No backend, pinned source, read-only Details or surrounding page changes are included.

Fresh fictional-data checks passed for hosting toggles and filtering; hidden OS/software/custom-data retention through save/reload; product-change confirmation and guest propagation; hosting-disable Cancel; native and business error focus; VM allocation save/reload; Duplicate safeguards; eight Notes actions, safe preview and persistence; and 16 physical types/six VM purposes. [Detailed checkpoint](issue-327-implementation/functional-checkpoint.json).

This is a partially tested checkpoint, not visual acceptance. The visual runner initially needed corrections to fixture keys, the unchanged Link action expectation and source-page selectors; these test failures are not counted as passes. Full rendered comparisons, final browser/backend regressions, unchanged-screen comparison, provenance, documentation and GitHub checks remain outstanding. No Docker image has been built or published.

## Resume Checklist

- [x] Approved editor implementation and first focused functional checks.
- [ ] Complete full rendered comparisons and any confirmed editor-only corrections.
- [ ] Complete failure/permission/legacy and browser/backend regression coverage.
- [ ] Check unchanged screens, pinned sources, documentation and secret history.
- [ ] Commit final evidence, push and record exact SHA in #327.
- [ ] Owner's private native Raspberry Pi and Safari/touch acceptance.

Reproduce focused checks with `CAFFOOT_DEVICE_EDITOR_APPROVED=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_VISUAL_OUTPUT=work/device-editor-checks node tests/approved-visual.cjs`. `CAFFOOT_EDITOR_VISUAL_ONLY=1` omits already completed functional checks during a visual-only iteration; it does not constitute a full test pass.

## Final Code Verification Checkpoint

The final focused functional run passed all twelve groups, now including custom host product/version creation, new VM creation, simulated 500/403/409 feedback and keyboard tabs. [Results](issue-327-implementation/functional-final.json). Full backend tests passed: **448 run, 445 passed, three skipped**. The local full Chromium regression passed. The latest editor-only visibility correction is included in the final GitHub browser rerun.

The visual iteration measured **239 states** (216 Add/Edit/Duplicate states across four sizes/two themes, 20 expanded inline forms, three enlarged-text states). Dialog bounds matched the pinned source, footers remained in view and no dialog horizontal overflow was measured. Manual screenshot review then caught an Add Location panel opening during physical visibility refresh; the final code keeps it closed until requested. The new focused assertions verify this. Source screenshots remain unmodified; the prototype has no dark palette, so dark captures compare geometry against its light source while retaining the accepted application theme.

The same review restored the source's **125px Notes minimum** when there is too little remaining height. The body scrolls in those cases and Save/Cancel stays fixed; larger windows still use all remaining Notes height. Retained rack controls now use the field grid's spacing without an extra inherited margin. Stable catalogue product keys remain recognised even when their labels have been renamed.

The GitHub browser workflow now runs the focused editor checks and retains complete top/middle/bottom live/source captures for all 216 main states, inline controls and enlarged text. Only fictional data and screenshots/results are uploaded; the database, credentials and private installation material are excluded. The final issue update records the workflow result and artifact link. No owner visual approval is implied.

## Changes Ready For Private Review

| Area | What changed | What stays working |
| --- | --- | --- |
| General / hosting | One checkbox beneath Physical Device Type, with dedicated product/version selectors. Ordinary OS is hidden while hosting is enabled. | Eligible physical servers only, saved OS/version/licence values, recognised/custom products and guest confirmations. |
| Ordinary selections | Known products are omitted from editor OS/software choices and pending assignment mode. Retained values get a short explanation. | Catalogue records, renamed stable keys, guest tools, unknown metadata and existing assignments. |
| VM forms | Purpose, host and allocations remain on General; physical type/location/mount/rack/Hardware are hidden. | Existing type/purpose filters, immutable Edit identity, eligible hosts, inherited values and copied allocations. |
| Cards / scrolling | Source card wrappers, retained-control spacing and closed-by-default inline Location. Duplicate uses the source subtitle. | All existing controls, body scrolling, fixed header/footer and copy safeguards. |
| Feedback | The existing validation messages appear above the footer, with the appropriate tab/field revealed. | Server validation, reservations, permissions, failed-save drafts and guest/discard confirmations. |
| Notes | Uses the available content height, retaining the source's 125px minimum and body scrolling in short windows. | Eight original actions, wrapping toolbar, internal text scrolling, safe Preview, notes and saving. |

The only application files changed are `interface/application.js` and editor-scoped additions to `interface/styles/components.css`. All HTML templates, twelve pinned source/style records, backend/API/schema, catalogues and accepted surrounding screens remain unchanged. [Nine identical before/after snapshots](issue-327-implementation/scope-comparison.json) include compressed DOM/style evidence for Overview, Inventory, Types, Locations, Manufacturers, Models, Software, Services and read-only Details. The separate Close × defect #328 remains untouched.

## Private Raspberry Pi Acceptance

No public image or worker-built ARM64 image is supplied. Build natively on the owner's Pi using the existing private workflow:

1. Use a separate clean clone of `feat/approved-modular-html-282`. Compare `git rev-parse HEAD` with the final delivery SHA in #327 before building; `git status --short` must be empty.
2. Run `python3 scripts/build_private_acceptance.py`. It builds the exact commit locally and prints `caffoot-lite:private-<first 12 characters of SHA>`; it does not publish.
3. Inspect that image's architecture and `org.opencontainers.image.revision` label. Expect `arm64` and the exact reviewed SHA.
4. Start a separate acceptance container on an unused port with a fresh named volume. Use the established `CAFFOOT_WEB_ADDRESS` and `CAFFOOT_SERVER_ADDRESS` settings for that private address. Keep production's container, port and data volume separate.
5. Check Add/Edit/Duplicate across the owner's real desktop, small laptop and phone: hosting on/off, known/custom products and versions, no-host/eligible-host VM entry, every relevant purpose, saved legacy records, Notes/Preview, validation, scrolling and fixed actions. Check guest confirmation Cancel/Confirm using fictional or privately copied records. Confirm surrounding accepted screens and the intentionally unchanged #328 defect.

Owner acceptance is still required on native Safari, physical touch/keyboard and real mobile address-bar/on-screen-keyboard states. Chromium emulation and the enlarged-text stress captures do not certify those environments. A genuine private v1.3.3 backup was unavailable for two established tests. Docker lifecycle is checked separately in GitHub; its AMD64 result is not a Pi build or private visual acceptance. No implementation decision remains blocked on further design approval.

### Enlarged Text Review

The first full GitHub run passed its automated geometry checks, but manual review found enlarged footer labels extending outside their buttons. The editor's existing footer buttons now allow label wrapping. A new assertion checks the actual text rectangles inside each button; all three local enlarged-text states passed after the correction. The normal source button layout is retained. The final GitHub rerun records the complete resulting evidence; the earlier passing geometry result is not presented as proof that clipped text was acceptable.
