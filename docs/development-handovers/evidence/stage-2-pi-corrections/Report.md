# Raspberry Pi Acceptance Corrections — Verification

This implements the [four owner-approved corrections](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6874767163) from baseline `bda35d73398820f49c8c1cf0647aa1c8c92bbf2e`, on `stage-2-pi-acceptance-corrections`. [Draft PR #376](https://github.com/Caffoot/Caffoot-Lite/pull/376) targets `milestone-1`. Native Raspberry Pi/Safari acceptance remains with the owner. No merge, publication or deployment is claimed.

## Confirmed Causes And Changes

The [before observations](before-observations.json) were collected from the unmodified baseline using the real HTTPS application and fictional SQLite data. They show false no-subnet/out-of-sync/missing-Rack/Shelf warnings while those collections were hidden, no visible error toast, no Location default after an Edit Rack change, and the misleading shelf fallback.

- **Dashboard:** relationship checks now require effective Read for every collection involved. Full-state validation remains the default for other callers. Basic addresses are not mistaken for broken managed links. Existing cards, status rows, report sections, filters and actions are filtered according to their required Read scope. Hidden collections are not counted as empty authoritative inventory; Rack occupancy requires Devices and Racks Read. Genuine accessible missing-record warnings remain. Backend projections and stored data are unchanged.
- **Notifications:** the existing bottom-right error toast paints above modal/nested layers. Device, Subnet and direct inline-only error paths also show that toast, retaining current field highlighting, accessible summaries and focus. Multiple native invalid events are grouped into the first failing field/message; competing native bubbles are suppressed without bypassing constraint validation. Existing text and rules remain. Success styles/position remain unchanged. A shared timer prevents an earlier notice from hiding a newer one.
- **Edit Location:** explicit Rack/Shelf selection carries selection intent to the existing defaulting helper. That permits the approved Edit default using the Rack's real room, including a room absent from managed Device choices. Opening/restoring Edit, tab changes and unrelated saves do not default Location; manual overrides and Racks-off preservation remain. Add defaulting is retained. Nothing writes until Save.
- **Shelf Details:** inaccessible Rack information uses neutral current-access wording. Rack/Shelf names and positions are not fetched or exposed to explain the restriction. Existing missing-association diagnostics remain when Rack Read is effective.

No backend, schema, grants, data repair, dependency or pinned design change. Dashboard/shared template changes only add Read-scope attributes: a regression test removes those attributes and compares the remaining markup byte-for-byte with the baseline. Existing layout classes and content are retained. The only style addition raises error-toast stacking. All twelve pinned source HTML hashes were independently verified.

## Local Tests

**98 distinct focused Python tests passed, zero skips or failures in the completed selections.** The original 97-test selection passed; the final three design-boundary tests include two overlapping checks and one new template-boundary test. [Focused log](python-focused.log), [final design boundaries](design-boundaries.log).

```sh
PYTHONPATH=tests:. python -m unittest test_feature_access \
  test_racks_off_preservation test_reserved_device_saves \
  test_rack_shelf_associations test_modular_interface \
  test_optional_features_visual_boundary -v
PYTHONPATH=tests:. python -m unittest test_optional_features_visual_boundary -v
```

The focused real-browser test covers seven nonempty feature combinations across all three Dashboard tabs, four mixed Read accounts, hidden report sections, genuine missing Device/Rack/IPAM checks, Add/Edit Rack/Shelf/manual/Cancel cases, inaccessible and genuinely missing shelf wording, Start U native validation, modal paint order, Subnet/Rack/nested Rack/User/Role/Settings invalid forms, password mismatch and a successful Notes-only save retaining placement/Location. Saved inventory/grants are compared before and after invalid/cancel/control-only actions. [Browser result](browser-corrections.log), [capture names and validation contexts](results.json).

```sh
CAFFOOT_VISUAL_OUTPUT=work/pi-final-evidence \
  node tests/pi-acceptance-corrections.cjs
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium \
  CAFFOOT_DEVICE_FORM_FOLLOWUPS=1 CAFFOOT_RACK_LOCATION_DEFAULTS=1 \
  CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/pi-original-workflow-regression \
  node tests/approved-visual.cjs
```

The second command runs the existing #332 Rack Location and Device follow-up regression groups, including real searchable controls, Add/Edit/Duplicate, retained values, manual overrides, Cancel, Save/history and Details dismissal. Its final result is linked in the PR and accompanying log. Python compilation, JavaScript syntax, Function Index declaration locations, documentation links and whitespace are checked before handover.

## Validation Context Audit

| Context | Existing Path And Correction | Verification |
| --- | --- | --- |
| Device Add/Edit | `showDeviceEditorFeedback` keeps tab/field/inline handling and also calls the shared notification painter. | Actual blank Start U submission; highlighted control, active form focus, inline feedback, no write; desktop/mobile, both themes. |
| Device nested catalogue/platform dialogs | Existing local failure helpers retain input focus and inline text and now notify. Existing `showToast` calls also cover editor nested messages. | Source-path review plus existing catalogue/editor CI; nested Rack invalid form tested directly. |
| IPAM single/batch forms | `showSubnetFormError` and batch summaries notify while retaining field hints and first-error focus; no validation rule changes. | Actual invalid subnet; existing subnet-first and batch regressions in CI. |
| Racks and shelves/accessories | Existing `showToast` errors stack above overlays; direct accessory and shelf-removal inline failures notify too. | Actual invalid Rack and nested Rack; existing shelf/editor CI and focused Python preservation checks. |
| Users and permissions | Native form failures are coalesced; application failures retain wording. Expired role-preview feedback also notifies. | Actual User/Role invalid forms and password mismatch; existing account/role engine CI. |
| Settings | Native fields notify after the asynchronous form is loaded; existing save/API catches notify. | Actual Email form constraint failure; existing Settings/API regressions. |

No new error rule, permission or notification service was introduced. Source review of an error path is distinct from forcing every possible asynchronous failure in a browser.

## Visual Evidence

Seventeen fresh application captures use 1440 × 950 and 390 × 844 viewports. Dashboard captures cover Overview, Network Insights and Activity & Alerts with IPAM/Racks hidden. Four Start U captures repeat the actual native validation text during width/theme changes; the inline feedback and existing toast remain visible together. The shelf capture scrolls to the corrected wording. External font/CDN requests are blocked in the focused test to avoid infrastructure-dependent waits; no preview styling is imported.

| View | Desktop Light / Dark | Mobile Light / Dark |
| --- | --- | --- |
| Device validation | [Light](validation-light-1440.png) / [Dark](validation-dark-1440.png) | [Light](validation-light-390.png) / [Dark](validation-dark-390.png) |
| Dashboard Overview | [Light](dashboard-overview-light-1440.png) / [Dark](dashboard-overview-dark-1440.png) | [Light](dashboard-overview-light-390.png) / [Dark](dashboard-overview-dark-390.png) |
| Network Insights | [Light](dashboard-insights-light-1440.png) / [Dark](dashboard-insights-dark-1440.png) | [Light](dashboard-insights-light-390.png) / [Dark](dashboard-insights-dark-390.png) |
| Activity & Alerts | [Light](dashboard-activity-light-1440.png) / [Dark](dashboard-activity-dark-1440.png) | [Light](dashboard-activity-light-390.png) / [Dark](dashboard-activity-dark-390.png) |

[Inaccessible Shelf Details](hidden-shelf.png). The preserved design retains its existing typography, card hierarchy, orange controls, tabs, responsive rules and light/dark surfaces. Filtering leaves only authorised existing components; no substitute Dashboard layout is introduced. These comparisons and the template/hash checks do not replace native Safari appearance approval.

## Failures, CI And Remaining Limits

During development, one new test attempted to fill a select instead of selecting its blank option; that test setup was corrected. A Settings assertion raced the Email form's asynchronous loading and now waits for its enabled submit control. The first broad Chromium CI run found an old #332 Edit expectation superseded by the explicit owner-approved Rack default; that specific expectation is updated while opening/manual/Cancel preservation stays tested. The older diagnostic wrapper also needed to forward the helper's explicit selection argument. These are recorded test changes, not reasons to alter the new approved behaviour.

At intermediate implementation `2006f84cc1c73d6a8c2862cbf5f4cf3adcf62f99`, the focused correction step passed in Chromium, Firefox and WebKit; full Firefox/WebKit jobs, backend, Compose, documentation and secret scan passed. The wider Chromium job initially failed on that superseded Edit expectation. Final-head CI status, exact backend totals/skips and artifact links are recorded in [PR #376](https://github.com/Caffoot/Caffoot-Lite/pull/376) after the final push, rather than creating documentation-only commits that repeatedly restart every check. The automatically triggered Publish workflow is a read-only PR rehearsal, not a release.

Local WebKit could not launch because host libraries were missing after one engine-download attempt. A local Firefox attempt was stopped without a completed result; hosted Firefox/WebKit provide the browser evidence. No repeated dependency setup, Azure attempt or local Docker run was made. WebKit on Linux is not native Safari on the owner's Pi/client. Native owner retest, genuine private data and deployed-volume restore remain outside these local checks. No current application/data/contract conflict was identified; final applicable CI and owner review are the handover gates.
