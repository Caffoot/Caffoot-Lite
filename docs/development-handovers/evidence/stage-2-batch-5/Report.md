# Stage 2 Final Integration Verification

**14 November 2026 — ready for product-owner review, subject to the hosted checks recorded below.** This verifies the merged Optional Features implementation; it does not grant final acceptance, merge, release or deployment approval. No material application defect or contract conflict was found in the completed focused checks.

## Revision And Scope

- Verified integration baseline: `8192bb4438a1615f3b3c640d59deff2dfdde07be` (`milestone-1`, merged PR #374).
- Verification branch: `stage-2-batch-5-final-verification`; [draft PR #375](https://github.com/Caffoot/Caffoot-Lite/pull/375), targeting `milestone-1`.
- First committed/pushed test checkpoint: `46cf108169c78f7bd8cc01f11d541d282b3d5e85`. Subsequent evidence/documentation changes do not change the tested application or test code.
- Published `main` remains `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a`.
- Authority: [approved technical contract](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821230015), [Batch 4 merge handover](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6873486389) and the owner's explicit Batch 5 instruction.

Only verification tests, this evidence and the active handover change. Runtime code, schema, grants, interface markup, stylesheets, dependencies and the twelve design pins are unchanged. The Function Index needs no regeneration: runtime declarations and their locations are unchanged, and tests are outside its documented scope.

## Completed Checks

**236 focused Python tests passed; zero failures and zero skips in that selection.** The four affected tests passed again after the HTTP import assertions were added and one new test was renamed for clarity. These are overlapping checks, not 240 distinct scenarios. See [full focused log](python-focused.log) and [final affected-file log](python-affected-final.log).

```sh
PYTHONPATH=tests:. python -m unittest \
  test_optional_features_persistence test_feature_settings \
  test_feature_settings_http test_feature_access \
  test_optional_device_addresses test_optional_ip_http \
  test_racks_off_preservation test_optional_features_visual_boundary \
  test_role_policy test_session_http test_request_auth \
  test_required_mfa_http test_session_invalidation \
  test_reserved_device_saves test_rack_shelf_associations \
  test_ipam_repair test_ipam_reconciliation test_import_boundary \
  test_import_http test_import_drafts test_reset_inventory \
  test_schema test_modular_interface -v

PYTHONPATH=tests:. python -m unittest \
  test_import_http test_optional_features_persistence -v
```

| Contract Area | Passing Evidence |
| --- | --- |
| Fresh/upgrade defaults | `test_feature_settings`, `test_schema`: fresh all-off; empty and populated existing schema-12 upgrades enable the existing three only; existing tables, sessions and grants retained; migration failure rolls back. |
| Durable organisation choices | `test_feature_settings`, new `test_optional_features_persistence`: reinitialisation, actual file close/reopen, database-copy restoration, inventory replacement and Clean Start retain choices; table separate from inventory settings; future features remain unavailable. The real HTTP import confirmation now asserts settings and grants unchanged. |
| Secured administration | `test_feature_settings_http`, `test_request_auth`, `test_required_mfa_http`, session tests: administrator/active/MFA/session/Origin/CSRF validation; strict JSON fields/types/size; future activation refused; confirmation/no-op/audit/rollback; real lock-wait revocation. |
| Effective permissions and projections | `test_feature_access`, `test_role_policy`: all eight combinations, roles/individual overrides/account/MFA rules, administrators denied disabled features, direct endpoint/write denial, combined responses/history/error redaction, both-read aggregate boundary, import/reset restrictions, after-lock revocation. |
| Essential access | HTTP and feature browser tests: all-off administrators retain Settings and Users; ordinary signed-in users retain authorised My Account without administrator escalation. |
| Optional/basic/managed IP | `test_optional_device_addresses`, repair/reconciliation and browser tests: no-IP Devices Edit only in both modes; basic IPv4 without subnet/allocation; editable basic values after enabling IPAM; strict syntax/duplicates/hidden reservations; managed read-only while off; no automatic subnet/allocation/link/repair; legacy import remains strict. |
| Explicit linking | Address and HTTP tests plus interface browser: both effective Edit grants, feature/session/MFA checks, suitable existing subnet, no-subnet guidance, aliases/gateway/reservation conflicts, cancellation/no GET mutation/replay, stale revisions, edit reservations, post-lock revocation and rollback of Device/allocation/revision/history together. |
| Rack preservation | `test_racks_off_preservation`, Device/shelf tests and interface browser: hidden/omitted fields, exact null/absent values, shelf association and original Location retained; new placement/forgery denied; non-Rack type choices retained; enabled-Rack controls restored; Rack-only rights do not expose mounted Device details. |
| Visual boundaries | `test_optional_features_visual_boundary`, `test_modular_interface`, fresh captures below: original three Settings panels/buttons, relevant stylesheets and all twelve pins unchanged; the three additions reuse current components. |

The new persistence test initially omitted the connection argument from a staging callback. That test-only setup error was corrected before the passing focused run. No application implementation was changed. No outstanding local failure remains.

Three existing Chromium scripts passed against local HTTPS and temporary fictional SQLite data:

```sh
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/feature-access.cjs
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/optional-ip.cjs
CAFFOOT_VISUAL_OUTPUT=work/batch5-browser \
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/optional-features-interface.cjs
```

Logs: [feature combinations](browser-features.log), [optional addresses](browser-addresses.log), [interface/preservation/linking](browser-interface.log). These passed with no page errors. The interface script also checks every disable confirmation, cancellation with no mutation, inactive future cards, mounted/shelf edits, count disclosure, no-subnet/cancel/stale/success linking, retained allocation notes, modal labelling/focus containment and checked document overflow.

Local tools: Python 3.12.14, Node 24.22.1, Playwright 1.62.1 and Chromium 155.0.8059.79. Python compilation, JavaScript syntax, Markdown links, pinned source hashes, unchanged runtime/design boundaries and whitespace were checked before the final evidence push.

## Visual Comparison

Fresh captures use 1440 × 950 and 390 × 844 viewports, with light and dark application views. Six reference captures serve the exact relevant HTML originals from pinned revision `c26db4a56bbc30f95b56201e81a7a76d13c6037b`: Settings Draft 02, IPAM Draft 01 and Device Details/Forms Batch 04. All twelve source HTML hashes were independently verified against `interface/design-sources.json`. [Approved HTML Integration](../../../development-guide/Approved-HTML-Integration.md) maps the full set.

The 34 captures comprise six source views and 28 application views, including no-subnet and suitable-subnet linking and Rack-off Add/Edit. [Measurements](measurements.json) record every capture and the measured Settings geometry. Source references retain their original light presentation. External Google/CDN fonts were blocked and the source logo URL was served from the local logo asset, as in the existing comparison method. No archive-preview styling is used.

| Addition | Desktop Source / Light / Dark | Mobile Source / Light / Dark |
| --- | --- | --- |
| Optional Features tab | [Source](approved-settings-1440.png) / [Light](optional-features-light-1440.png) / [Dark](optional-features-dark-1440.png) | [Source](approved-settings-390.png) / [Light](optional-features-light-390.png) / [Dark](optional-features-dark-390.png) |
| Basic IPs Outside Subnets | [Source](approved-ipam-1440.png) / [Light](ipam-overview-light-1440.png) / [Dark](ipam-overview-dark-1440.png) | [Source](approved-ipam-390.png) / [Light](ipam-overview-light-390.png) / [Dark](ipam-overview-dark-390.png) |
| Device Network Link action | [Source](approved-network-1440.png) / [Light](device-network-light-1440.png) / [Dark](device-network-dark-1440.png) | [Source](approved-network-390.png) / [Light](device-network-light-390.png) / [Dark](device-network-dark-390.png) |
| Existing-subnet chooser | [Light](link-existing-subnet-light-1440.png) / [Dark](link-existing-subnet-dark-1440.png) | [Light](link-existing-subnet-light-390.png) / [Dark](link-existing-subnet-dark-390.png) |
| No suitable subnet | [Light](link-no-subnet-light-1440.png) / [Dark](link-no-subnet-dark-1440.png) | [Light](link-no-subnet-light-390.png) / [Dark](link-no-subnet-dark-390.png) |
| Racks-off existing Device | [Light](racks-off-device-light-1440.png) / [Dark](racks-off-device-dark-1440.png) | [Light](racks-off-device-light-390.png) / [Dark](racks-off-device-dark-390.png) |
| Racks-off new Device | [Light](racks-off-new-device-light-1440.png) / [Dark](racks-off-new-device-dark-1440.png) | [Light](racks-off-new-device-light-390.png) / [Dark](racks-off-new-device-dark-390.png) |

Inspection of the relevant views shows the current sidebar/header, card surfaces, typography, orange actions, tab hierarchy and light/dark styling retained. The new fifth statistic uses the existing grid (four columns on desktop, two on mobile), so it wraps to the next row. The Link action sits in Network Identity, and its chooser uses the existing full-height Device dialog and form components. No suitable subnet gives readable guidance and a disabled submit; Cancel remains available. The fourth Settings tab retains existing narrow-screen scrolling. Mobile feature descriptions wrap extensively within the existing card header columns, particularly the future cards; this is visible in the captures and remains for owner appearance review. No clipping or horizontal document overflow was found in the checked views.

Measured Settings geometry matches the source in both application themes: desktop main width 1225px, navigation gap 22px, radius 15px and padding 22px; mobile main width 325px, gap 13px, radius 15px and padding 17px. Fictional records, account initials, enabled navigation and transient success toasts differ from the demonstration sources. Existing previously approved live workflows (such as the two subnet-creation buttons) are not reverted to standalone demonstration content. These are focused component comparisons, not a claim of pixel-identical pages or recertification of every historical screen.

## Hosted CI

The seven successful Batch 4 jobs at `ab51bb194adccbc69f134f4412073008528595f7` were independently verified through GitHub:

- [Backend tests](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43505134987).
- [Chromium, Firefox and WebKit](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43505134888): account/MFA/My Account and existing approved Device/IPAM/Rack regression flows.
- [Compose lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43505135143): configurable port, persistent TLS and database after restart/recreate.
- [Release documentation](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43505134817) and [Git history scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43505134696).

The tested application implementation is unchanged from that merged baseline. Those are existing CI results, not new Batch 5 browser or Docker runs. The new PR automatically runs the existing path-selected backend, release-documentation and Git-history workflows; no CI configuration or unrelated browser/Docker infrastructure was changed. Batch 5 hosted results are recorded in the draft PR after the final push.

## Remaining Limits And Acceptance

No whole-suite local run, new local Firefox/WebKit run, automated accessibility audit, local Docker/Azure attempt, private installation test or deployed-volume restore was performed. The new restoration check copies/restores a fictional SQLite database file; it does not claim full deployed TLS/configuration/volume restoration. Wider published-v1.3.3 compatibility and full backup/restore integration remain Stage 6. Future schema migrations that do not yet exist cannot be exercised; current migration/reinitialisation retention is covered.

No new functionality, styling or permission contract change was needed. Stage 2 is ready to present for final product-owner acceptance once applicable PR checks pass. Owner visual approval and final acceptance remain outstanding; this report does not close #238 or authorise a merge. Stop after Batch 5. No Stage 3, tag, release or deployment.
