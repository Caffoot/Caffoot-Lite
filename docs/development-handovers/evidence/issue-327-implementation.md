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
