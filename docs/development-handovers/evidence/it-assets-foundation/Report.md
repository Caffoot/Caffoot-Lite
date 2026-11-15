# IT Assets Foundation — Implementation Evidence

Date: 15 November 2026. Batch 3.6 is implemented for draft review only.
There is no merge, release, deployment or final product-owner visual acceptance.

## Source And Scope

- Verified integration baseline: `2e6c50ba4777b7500258d2a1a28317764d806020`,
  `milestone-1`, including Department Details merge PR #386.
- Dedicated branch: `feat/it-assets-foundation`.
- Tested runtime and screenshot source:
  `4efb32b` (Add guarded IT Assets schema and optional feature foundation).
  The accompanying documentation/browser-evidence commit does not change runtime code.
- Scope: Schema 16, four initially empty stock tables, independent default-off
  IT Assets choice, existing permissions and one existing-template Optional Features card.

The optional quantity-only `minimum_stock_level` distinguishes absent from zero.
The approved future Low Stock rule is Ready To Issue strictly below that threshold;
no warning or dashboard is implemented.

Specification corrections are reserved as separate metadata-only journal headers
within the same four tables. Mandatory reason, actor, dates and immutable before/after
values protect changes after history exists. Matching updates are atomic and contain
no stock entries or quantities. No correction endpoint or screen is available.
See the [technical contract](../../../development-guide/IT-Assets-Foundation.md).

## Completed Checks

| Check | Actual Result |
| --- | --- |
| Focused Python backend, HTTP, migration and regression run | **90 passed**, zero final failures; [complete log](backend.log) |
| New stock schema tests | 20 included in the 90; fresh/upgrade defaults, eight existing flag combinations, security/data preservation, rollback, idempotence, unexpected objects, constraints, identity, journal/correction guards and two competing quantity writers |
| New feature/permission/HTTP tests | Five included in the 90; independent Read/Edit, roles, overrides, MFA, retained sessions, missing/off flag, existing API protections and no stock exposure |
| Existing regression coverage | Schema, feature settings/API/access/persistence, Staff section rights, Device assignments/API, Department Details API and Optional Features visual boundaries |
| Real HTTPS/SQLite Chromium browser | Passed; [browser log](browser.log), [capture and geometry manifest](browser-results.json) |
| Browser interactions | Default off, Additional Features position, saved/reloaded choice, cancel sends no POST, keyboard toggle, planned features disabled, existing cards unchanged, no stock API/navigation, retained data/security, independent reader restrictions |
| Responsive/themes | Eight real application captures at 1440 × 1050 and 390 × 844; light/dark, enabled/disabled; zero checked horizontal page overflow and page errors |
| Presentation source | Existing Settings template, styles, shared component styles, Staff screen/styles and design pins byte-identical to the integration baseline; hashes in the browser manifest |
| Documentation and compatibility | Existing release-documentation workflow check, affected local links/anchors/image paths, 852 Function Index locations, eight byte-identical legacy guide pairs and published v2.1 source/document preservation checked separately in [documentation-checks.log](documentation-checks.log) |
| Syntax and whitespace | Python source parsed, application/browser JavaScript syntax checked and `git diff --check` passed |

The first runs exposed old five-feature/schema-15 test expectations and browser
harness assumptions about re-rendering and cancelled checkbox changes. Those
expectations were corrected; the final results above supersede those failed runs.

## Reproduce The Focused Checks

From the repository root:

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest \
  test_schema test_it_asset_stock_schema test_it_asset_feature \
  test_feature_settings test_feature_settings_http test_feature_access \
  test_staff_section_permissions test_optional_features_persistence \
  test_optional_features_visual_boundary test_device_assignments \
  test_device_assignments_http test_department_details_http -v

CAFFOOT_ASSETS_OUTPUT=/tmp/caffoot-assets-evidence \
  node tests/it-assets-foundation-interface.cjs
```

The browser script requires the project's Playwright setup. This environment used
system Chromium through `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium` and the existing
tool installation through `NODE_PATH`. It runs an isolated fictional database and
test-only HTTPS listener on 127.0.0.1:8096; it does not change the application's
fixed published internal port or use an existing installation's database.

## Screenshots Awaiting Product-Owner Visual Review

These are direct application captures, not generated images or prototype screens.
Notifications were allowed to disappear before capture. Original historical
screenshots elsewhere in the repository are retained.

| View | Enabled | Disabled |
| --- | --- | --- |
| Desktop, Light | [1440 px](optional-features-enabled-light-1440.png) | [1440 px](optional-features-disabled-light-1440.png) |
| Desktop, Dark | [1440 px](optional-features-enabled-dark-1440.png) | [1440 px](optional-features-disabled-dark-1440.png) |
| Mobile, Light | [390 px](optional-features-enabled-light-390.png) | [390 px](optional-features-disabled-light-390.png) |
| Mobile, Dark | [390 px](optional-features-enabled-dark-390.png) | [390 px](optional-features-disabled-dark-390.png) |

The new card shares the existing card padding, radius, font, colours and width.
The existing five cards retain their content and structure. Mobile navigation
retains the application's existing horizontally scrolling Settings tabs.

## Limits And Remaining Acceptance

- Product-owner visual review and merge approval are pending.
- Batch 3.4 native/manual acceptance remains deferred.
- No broad local backend suite, Docker build, packaged-browser matrix, complete-volume
  restore, production upgrade/downgrade, deployment or Raspberry Pi check was run.
- GitHub Actions results are reported in the draft PR; local results do not imply
  those separate jobs have passed.
- No Receive Stock, readiness, issue, return, write-off, quantity/specification
  correction workflow, Device registration, associated equipment, dashboard,
  warning, Supplier, Lifecycle or Service Desk implementation is supplied.
- Existing assignment update/delete guards remain unchanged. Later audited Device
  assignment closure needs its own approved migration and workflow.
- Stock operation examples in the schema tests are synthetic storage fixtures,
  not implemented endpoints or accepted user workflows.
- Full milestone compatibility and volume upgrade/restore acceptance remain Stage 6.
