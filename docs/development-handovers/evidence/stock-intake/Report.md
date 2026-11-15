# Receive Stock And Stock Inventory — Review Evidence

**Unreleased v2.2, Stage 3 Batch 3.7.** The branch is
`feat/it-assets-stock-intake`, targeting `milestone-1`. Integration started at
`774dee3ecaaf1d50ba94dbf55891aa4b79b853c5` (merged PR #387, schema 16).
Browser/capture source: `4480d5df10d56e9d898629cec5ac37f1f1df8a18`.
Later evidence/documentation commits do not change that runtime.

This is implementation evidence for review, not product-owner visual acceptance,
merge approval, a release or a production upgrade/restore procedure.

## What Changed

IT Assets now offers Receive Stock, Stock Inventory, View / Update and Receipt
History within the existing IT navigation. Receipts support compatible repeat
deliveries, separate Supplier/date/actor facts, shared computer specifications,
optional individual identifiers and partial checked readiness. Later readiness
and reasoned reversals preserve physical totals and receipts. Quantity stock has
a nullable Minimum Stock Level; no warning or Low Stock calculation is displayed.

The four Schema 16 tables, triggers and accounting contract are unchanged. New
receipts and readiness use existing immutable entries and headers under a single
write lock. Actor-scoped operation references prevent duplicate retries; stale
readiness forms cannot overwrite a concurrent change. Existing effective roles,
overrides, MFA, session, CSRF and feature controls apply on the server. Disabled
stock is hidden from reads and audit projections, including administrator history.

Scope follows [#351's combined plan](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6897801454)
and [start approval](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6897927354),
with [#368](https://github.com/Caffoot/Caffoot-Lite/issues/368),
[#352](https://github.com/Caffoot/Caffoot-Lite/issues/352) and
[#232](https://github.com/Caffoot/Caffoot-Lite/issues/232).
The [interface mapping and API guide](../../../development-guide/IT-Assets-Stock-Intake.md)
records the approved functional reference and existing production sources reused.

## Actual Checks

| Check | Result And Evidence |
| --- | --- |
| Focused receipt/readiness/HTTP suite | **17 passed**, [log](focused.log) |
| Full backend suite | **745 run, 741 passed, four skipped**, [log](backend.log) |
| New browser workflow | **Passed**, 24 real Chromium captures, no page errors or checked document overflow; [log](browser.log), [results](browser-results.json) |
| Existing Optional Features browser regression | **Passed**, retained cards/styles, cancellation, permissions and data; [log](optional-features.log) |
| Real isolated Docker Compose lifecycle | **One passed**, configurable port, retained SQLite/TLS after restart/recreate; [log](docker.log) |
| Documentation, links, syntax, compatibility and source checks | See [actual validation output](documentation-checks.log) |

The full backend suite ran against the backend now captured here; subsequent code
changes were only the stock date display and additional screenshot coverage.
It includes fresh/upgrade/rollback/idempotence/constraint tests and existing
Device, Staff, Department, assignments, IPAM, Rack, account/MFA and policy regressions.
Focused coverage includes duplicate retries, incompatible specifications, optional
individual identities, invalid/overflow quantities, both checks, partial readiness,
minimum null/zero, atomic failure, concurrent receipts, stale updates and feature-off privacy.

The four default-suite skips are the opt-in Docker check, two unavailable genuine
private v1.3.3 export tests and the Stage 6 complete-volume upgrade/restore rehearsal.
Docker was run separately and passed. The private-export tests and Stage 6 rehearsal
were not run; they are not reported as passed.

Docker source was `085511635d43bd01c82fbac86d8d714327e72441`, before the stock-only
date no-wrap display and extra capture coverage. The first local build failed
because this environment's package traffic requires its supplied CA. Repeating
with the Dockerfile's existing `proxy_ca` support passed; no Dockerfile, Compose,
public image or installation change was made. Initial browser development runs
found an incorrectly placed module setup and test navigation assumptions; these
were corrected before the recorded passing runs. Mobile date wrapping was then
corrected and the complete capture workflow passed again at the source above.

## Reproduce In An Isolated Checkout

Use disposable fictional data. The browser scripts create temporary databases and
HTTPS servers; the Compose test uses a unique project and removes its test volumes.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_intake -v
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
NODE_PATH=/path/to/isolated/node_modules CAFFOOT_STOCK_OUTPUT=/tmp/stock-evidence node tests/stock-intake-interface.cjs
NODE_PATH=/path/to/isolated/node_modules CAFFOOT_ASSETS_OUTPUT=/tmp/feature-evidence node tests/it-assets-foundation-interface.cjs
CAFFOOT_DOCKER_SMOKE=1 python3 -m unittest discover -s tests -p test_compose_lifecycle.py -v
```

Browser tools are Playwright/Chromium in an external test directory, as in CI.
This workspace used `/usr/bin/chromium` via `CAFFOOT_CHROMIUM_PATH`; no new project
dependency was added. The local Docker run used `DOCKER_HOST=unix:///var/run/docker.sock`
and `CAFFOOT_BUILD_CA` pointing to the environment-supplied CA, with conflicting
Docker context/TLS variables unset. No secret values are included in the evidence.

## Screenshots And Visual Review

All images are genuine captures of the application with fictional data. The
[manifest](Capture-Manifest.json) records image dimensions/hashes;
[source checks](Source-Checks.json) record runtime hashes and 43 baseline files
verified unchanged, including all existing shared/page styles and screen templates
apart from the authorised navigation addition. Schema, roles, MFA policy,
installation instructions, historical records and prior screenshots are preserved.

| View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Existing delivery | [1440](screenshots/stock-receive-light-1440.png) | [1440](screenshots/stock-receive-dark-1440.png) | [390](screenshots/stock-receive-light-390.png) | [390](screenshots/stock-receive-dark-390.png) |
| New computer stock | [1440](screenshots/stock-receive-new-light-1440.png) | [1440](screenshots/stock-receive-new-dark-1440.png) | [390](screenshots/stock-receive-new-light-390.png) | [390](screenshots/stock-receive-new-dark-390.png) |
| Inventory | [1440](screenshots/stock-inventory-light-1440.png) | [1440](screenshots/stock-inventory-dark-1440.png) | [390](screenshots/stock-inventory-light-390.png) | [390](screenshots/stock-inventory-dark-390.png) |
| Quantity details | [1440](screenshots/stock-details-light-1440.png) | [1440](screenshots/stock-details-dark-1440.png) | [390](screenshots/stock-details-light-390.png) | [390](screenshots/stock-details-dark-390.png) |
| Individual details | [1440](screenshots/stock-individual-light-1440.png) | [1440](screenshots/stock-individual-dark-1440.png) | [390](screenshots/stock-individual-light-390.png) | [390](screenshots/stock-individual-dark-390.png) |
| History | [1440](screenshots/stock-history-light-1440.png) | [1440](screenshots/stock-history-dark-1440.png) | [390](screenshots/stock-history-light-390.png) | [390](screenshots/stock-history-dark-390.png) |

Visual inspection compared representative desktop/mobile light/dark captures with
the existing card, form, table, tab, sidebar and theme source conventions and the
accepted three-tab functional composition. Wide mobile tables scroll inside their
cards; the tab strip scrolls to retain the selected tab. This is not a pixel-by-pixel
comparison of every capture or final owner acceptance. Native browser date controls
follow the browser's locale; journal dates are rendered day/month/year.

## Remaining Review And Boundaries

- Product-owner visual acceptance and explicit merge approval remain pending.
- No genuine implementation blocker or schema deviation was required.
- Individual deliveries are recorded one unit at a time; more units can reuse the
  same compatible item, retaining separate optional identifiers and receipt facts.
- Issue/Return/Write Off, corrections, Device stock registration, associated
  equipment, dashboards/warnings, Supplier Management, Service Desk and Stocktakes
  are not implemented. No backup/export system was added.
- Local stock browser coverage is Chromium at 1440px and 390px in both themes.
  Native/mobile hardware and separate stock Firefox/WebKit flows were not tested.
- Batch 3.4 native acceptance remains deferred. Stage 6 acceptance is still pending.
- Published v2.1 guides and all eight compatibility pairs remain unchanged.
  `main`, PR #383, releases and production are untouched. No Raspberry Pi work.
- GitHub Actions results belong to the draft PR's current head; check them there
  before merge. Local results above do not claim that a pending CI job has passed.
