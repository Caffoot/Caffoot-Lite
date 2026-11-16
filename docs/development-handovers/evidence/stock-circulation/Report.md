# Stock Circulation — Implementation Evidence

Unreleased v2.2 Batch 3.8 on `feat/it-assets-issue-return-writeoff`, targeting
`milestone-1` at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba`.

## Current Review Position — 15 November 2026

Issue, partial/mixed return, later preparation, write-off and protected equipment
views are implemented in [draft PR #389](https://github.com/Caffoot/Caffoot-Lite/pull/389).
Runtime and all 52 final captures are pinned to
`11cf6beaf39e53c1abaad9c2649a64b5edfb93c6`. Later documentation/evidence commits do
not change that runtime. Batch 3.7/PR #388 remains the accepted integration base.
Batch 3.8 is **not merged, visually accepted or released**.

The owner’s preparation clarification is resolved: computers require working and
wipe/reset confirmation; printers require cleaning/working and applicable data
clearance without a blanket factory reset; the four named peripherals need cleaning/
working; other types need appropriate checks and explicit applicable preparation
confirmation. Existing controls represent these requirements; no new field or layout.

### Final Checks Actually Performed

| Check | Result And Evidence |
| --- | --- |
| Full backend at `c205cfa` | **790 run: 786 passed, four skipped**, 141.242 s; [log](backend-final.log) |
| Affected closure/history/privacy regression after visual review | **62 passed**, 4.112 s; [log](checkpoint-05-visual.log). After adding the original holder projection at `11cf6be`: **62 passed**, 4.127 s; [log](checkpoint-05-holder.log). Final CI reruns the full suite. |
| Full real circulation browser flow at `11cf6be` | **Passed, 52 genuine captures**, no page errors or checked document overflow; [log](browser-final.log), [results](browser-results.json) |
| Docker Compose lifecycle at `e78358b` | **One passed**, 105.045 s; [log](docker-lifecycle.log). Final change affects permitted history display/capture order/headings only; Docker files and stock operation source are unchanged. Final PR CI checks the new revision separately. |
| Documentation, source pins and syntax | See [actual documentation check output](documentation-check.log); release-documentation workflow check, local links/anchors/images, 945 Function Index declarations, all eight unchanged compatibility pairs, PNG hashes/dimensions, Python/JavaScript syntax, workflow YAML and `git diff --check` |

Commands actually run:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_device_assignments test_device_assignments_http test_history_permissions -v
NODE_PATH=/workspace/.caffoot-tools/node_modules CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_CIRCULATION_OUTPUT=/workspace/work/batch38-delivery-captures CAFFOOT_CIRCULATION_CAPTURE=1 node tests/stock-circulation-interface.cjs
```

Docker used the existing opt-in `test_compose_lifecycle` suite with
`CAFFOOT_DOCKER_SMOKE=1`, the managed local daemon and the existing
`CAFFOOT_BUILD_CA` support for the environment’s proxy certificate. No Dockerfile,
Compose configuration, public image or deployed installation was changed.

### Preservation And Migration

Schema 17 adds only a nullable assignment closure-movement reference and guarded
one-way closure. Original Device/holder/snapshot/date/actor values cannot change;
closed assignments cannot reopen or be deleted. Current-assignment uniqueness
remains. Matching stock entry, attributed audit and immutable movement header must
commit together. Fresh/upgraded/restarted databases, unexpected objects, rollback,
replacement attempts and concurrency are covered. The four Schema 16 stock tables
are byte-identical to the accepted base. Migration creates no stock, quantities or
inferred Device events.

[Source checks](Source-Checks.json) record 13 changed runtime hashes and 46 unchanged
source/deployment files, including every screen fragment, shared styles, navigation,
roles/MFA policy and published installation files. Published v2.1 guide pairs,
historical records, original screenshots and prior evidence are unchanged. Browser
assertions retain original account/role/security, Device/IPAM/Rack and receipt facts
and the original assignment identity/recipient/actor fields after actual closure.

### Visual Comparison And Limits

All images below are unmodified captures from the real temporary HTTPS/SQLite
application with fictional data, at 1440 × 1050 and 390 × 844 browser viewports in
both themes (full-page height varies). [Capture manifest](Capture-Manifest.json)
records each image’s actual dimensions and SHA-256. The test checks page overflow;
wide tables and tab rows retain the application’s horizontal scrolling.

Representative final images were visually inspected against the existing v2.1
page-header, card, native form, table, action, theme and responsive conventions,
and the original approved Return/equipment-journey functional compositions linked
in the [implementation guide](../../../development-guide/IT-Assets-Issue-Return-and-Write-Off.md#interface-mapping-before-implementation).
Existing navigation/screen fragments/shared styles are also verified unchanged.
This is source and visual review, **not product-owner acceptance or a pixel-match
claim**. Every capture is provided for separate owner review; not every image was
manually inspected. No replacement shell, preview styles or sample application code
was imported.

Initial visual review found that changing theme reset the captured form state, and
Department closure rows omitted the actor available in the journal. Checkpoint 5C
fixes both and keeps stock headings as whole words. The final holder-label projection at checkpoint 5D also reuses the existing canonical
assignment reference; final captures were refreshed after that commit. Earlier development logs retain their then-current results.

The four backend skips are: opt-in Docker (passed separately), two unavailable
private genuine v1.3.3 exports and Stage 6 complete-volume upgrade/restore. No native
Raspberry Pi/Safari work, final legacy-import acceptance or production upgrade/
rollback procedure is claimed. Batch 3.4 native acceptance remains deferred.
External documentation links were not comprehensively crawled; authoritative GitHub
decisions and functional previews were fetched directly. Browser CI checks the
existing Chromium suite and existing Firefox/WebKit engine regressions; those are
not native hardware acceptance.

Device registration/reissue (3.9), associated equipment (3.10), movement/specification
corrections (3.11), dashboards/Low Stock warnings (3.12), Suppliers, Service Desk,
Stocktakes and Stage 6 remain outside this batch. Stock-derived Device closure
facts require both Read permissions; historical actor snapshots remain even after
account changes. There is no repair/reactivation/disposal substitute workflow.

### Screenshot Review Gallery

Each row links the same genuine view at four viewport/theme combinations.

| View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Issue Equipment | [Light 1440](screenshots/issue-equipment-light-1440.png) | [Dark 1440](screenshots/issue-equipment-dark-1440.png) | [Light 390](screenshots/issue-equipment-light-390.png) | [Dark 390](screenshots/issue-equipment-dark-390.png) |
| Mixed Return: Five Mice, Three Ready, Two Written Off | [Light 1440](screenshots/mixed-return-light-1440.png) | [Dark 1440](screenshots/mixed-return-dark-1440.png) | [Light 390](screenshots/mixed-return-light-390.png) | [Dark 390](screenshots/mixed-return-dark-390.png) |
| Prepare Returned Quantity Stock | [Light 1440](screenshots/stock-preparation-light-1440.png) | [Dark 1440](screenshots/stock-preparation-dark-1440.png) | [Light 390](screenshots/stock-preparation-light-390.png) | [Dark 390](screenshots/stock-preparation-dark-390.png) |
| Write Off An Issued Individual Asset | [Light 1440](screenshots/issued-asset-writeoff-light-1440.png) | [Dark 1440](screenshots/issued-asset-writeoff-dark-1440.png) | [Light 390](screenshots/issued-asset-writeoff-light-390.png) | [Dark 390](screenshots/issued-asset-writeoff-dark-390.png) |
| Return The Original Managed Device | [Light 1440](screenshots/device-return-light-1440.png) | [Dark 1440](screenshots/device-return-dark-1440.png) | [Light 390](screenshots/device-return-light-390.png) | [Dark 390](screenshots/device-return-dark-390.png) |
| Prepare A Returned Laptop: Wipe Still Unconfirmed | [Light 1440](screenshots/device-preparation-light-1440.png) | [Dark 1440](screenshots/device-preparation-dark-1440.png) | [Light 390](screenshots/device-preparation-light-390.png) | [Dark 390](screenshots/device-preparation-dark-390.png) |
| Write Off A Physically Held Device | [Light 1440](screenshots/held-device-writeoff-light-1440.png) | [Dark 1440](screenshots/held-device-writeoff-dark-1440.png) | [Light 390](screenshots/held-device-writeoff-light-390.png) | [Dark 390](screenshots/held-device-writeoff-dark-390.png) |
| Write Off An Assigned Device Without A Return | [Light 1440](screenshots/issued-device-writeoff-light-1440.png) | [Dark 1440](screenshots/issued-device-writeoff-dark-1440.png) | [Light 390](screenshots/issued-device-writeoff-light-390.png) | [Dark 390](screenshots/issued-device-writeoff-dark-390.png) |
| Stock Inventory And Canonical Device History | [Light 1440](screenshots/stock-inventory-light-1440.png) | [Dark 1440](screenshots/stock-inventory-dark-1440.png) | [Light 390](screenshots/stock-inventory-light-390.png) | [Dark 390](screenshots/stock-inventory-dark-390.png) |
| Genuine Movement History | [Light 1440](screenshots/movement-history-light-1440.png) | [Dark 1440](screenshots/movement-history-dark-1440.png) | [Light 390](screenshots/movement-history-light-390.png) | [Dark 390](screenshots/movement-history-dark-390.png) |
| Employee My Equipment Quantities | [Light 1440](screenshots/my-equipment-light-1440.png) | [Dark 1440](screenshots/my-equipment-dark-1440.png) | [Light 390](screenshots/my-equipment-light-390.png) | [Dark 390](screenshots/my-equipment-dark-390.png) |
| Staff Equipment And History | [Light 1440](screenshots/staff-equipment-light-1440.png) | [Dark 1440](screenshots/staff-equipment-dark-1440.png) | [Light 390](screenshots/staff-equipment-light-390.png) | [Dark 390](screenshots/staff-equipment-dark-390.png) |
| Department-Shared Equipment And History | [Light 1440](screenshots/department-equipment-light-1440.png) | [Dark 1440](screenshots/department-equipment-dark-1440.png) | [Light 390](screenshots/department-equipment-light-390.png) | [Dark 390](screenshots/department-equipment-dark-390.png) |

## Durable Checkpoints

| Checkpoint | Pushed Commit | Focused Checks At That Point |
| --- | --- | --- |
| 1 — Schema 17 guards | `dcf7535781690fc2d64ed25bca1cca6f76a03f74` | 44 passed |
| 2 — Issue | `0ea6ecc6a9f8f7a1f9b1635451ef69ff5f20325f` | 51 passed |
| 3 — Return/preparation | `dab754a7875dab90a3e2686bd623c6cb44b13252` | 56 passed |
| 4 — Write Off | `781bce70a2f913329b669c31ef3b2b8de83be665` | 61 passed |
| 5A — Protected projections | `f7eda18281f38c9cb309f5d7d7174caab0bad78c` | 76 passed |
| 5B — Integrated UI | `e78358b285d3a08032ba1cc893969498fa424db4` | 107 passed; real browser flow passed |
| 5C — Capture/attribution review | `c205cfae9b8351e960e6e6ed90eae508481c7307` | 62 passed; full backend and 52 captures passed |
| 5D — Original holder display | `11cf6beaf39e53c1abaad9c2649a64b5edfb93c6` | 62 passed; 52 refreshed captures passed |
| 6 — Final documentation/evidence | Commit containing this report | Documentation/source checks and final PR CI; no further runtime changes |

The following sections preserve what was implemented/tested at each checkpoint.
Then-pending work and questions are resolved only by the later sections above.

## Checkpoint 1

The narrow Schema 17 migration adds only an assignment closure journal reference
and guarded one-way closure. Original assignment data, deletion protection,
current-assignment uniqueness and the four Schema 16 stock tables are retained.
No application circulation workflow is claimed yet.

Command actually run:

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_assignment_closure test_device_assignments test_it_asset_stock_schema -v
```

**44 tests passed**: [log](checkpoint-01.log). This covers fresh/upgrade/restart,
whole-record/security/policy preservation, retained stock/feature choices, rollback,
unexpected definitions, valid return/write-off closure, original-field protection,
missing audit/header, duplicate/replacement/deletion rejection and concurrency.
Initial new-test column-count mistakes were corrected. Historical Schema 16 tests
remain pinned to that migration so their exact preservation assertions remain;
Schema 17 has separate current-upgrade coverage.

No full backend, Docker, browser or screenshot acceptance has been run for this
checkpoint. Issue, return, preparation, write-off, protected projections and UI
remain to be implemented. Product-owner visual acceptance and merge approval are
separate. Main, releases, production and Raspberry Pi hardware are untouched.

## Checkpoint 2

Issue Equipment backend, immutable issue/outstanding references and the restricted
name-only recipient lookup are implemented. Existing Device allocations remain
independent. No return, write-off or new interface is claimed yet.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_stock_intake test_assignment_closure test_device_assignments -v
```

**51 tests passed:** [log](checkpoint-02.log). Checks include quantity/individual
issues, Staff/Department holders, inactive/archived rejection, selected-item Ready
limits, concurrency, retry/stale protection, audit rollback, MFA/Read/feature-off
controls, narrow recipient privacy and protected HTTP routes. Initial fixture
mistakes (grant column name and duplicate catalogue data) were corrected without
changing application safeguards. Full final suites and screenshots remain pending.

## Checkpoint 3

Partial/mixed returns, canonical assigned-Device return/closure and later
preparation are implemented. Separate return, readiness and damaged write-off
facts commit together. Original receipts, issue references and Device records
remain unchanged. Readiness cannot bypass returned-equipment checks.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_stock_intake test_assignment_closure test_history_permissions -v
```

**56 tests passed:** [log](checkpoint-03.log). Coverage includes the five-unit
mixed example, partial/complete returns, invalid dispositions, duplicate/concurrent
returns, later wipe/cleaning checks, readiness bypass rejection, final-disposition
rollback, protected HTTP return/preparation and secondary Device privacy.

**Clarification pending:** mandatory preparation-check classification for canonical
Device types beyond the explicitly covered computers and non-data examples.
Other Device types are blocked from Ready pending that answer; no assumed wipe
rule is advertised as approved. Standalone Write Off, Staff/Department/My Equipment
integration, browser/UI, full suites and final evidence remain work in progress.

## Checkpoint 4

Standalone Write Off handles selected held states, issued individual Assets and
canonical Devices, with mandatory reason/date/actor and retry/version protection.
Issued Device closure is atomic and creates no return. Existing Device JSON and
other equipment are retained; unrecorded Devices never acquire fabricated held stock.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_assignment_closure test_device_assignments test_history_permissions -v
```

**61 tests passed:** [log](checkpoint-04.log). Checks include Ready/Awaiting stock
balances, issued identities, held/assigned/unassigned canonical Device cases,
unchanged operational records, no automatic accessory write-off, failed-audit
rollback, duplicate/stale/reason/permission rejection and initial-allocation bypass
protection with IT Assets disabled. No full suite or UI acceptance is claimed.
The preparation type-mapping question remains open; checkpoints 5–6 are pending.

## Checkpoint 5A — Backend Equipment Integration

Protected Staff/Department equipment reads and employee-safe My Equipment now show
actual outstanding Asset quantities alongside independently permitted Devices.
Sharing uses the Department as holder; no per-member issue is created. Device
relationships are not duplicated. Historical stock references block unsafe
Department deletion. Journal history is independently filtered for Device access.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_device_assignments test_device_assignments_http test_staff_directory test_history_permissions -v
```

**76 tests passed:** [log](checkpoint-05-projections.log). Checks cover partial
outstanding quantities, personal/shared separation, current membership changes,
feature-disabled privacy, no inventory/directory grants, original Device regression,
minimal employee fields and retained Department history. The interface/browser
half of checkpoint 5 remains pending, as does the preparation type clarification.

## Checkpoint 5B — Integrated Interface

The real issue, mixed/partial return, preparation, held/issued write-off, Device
closure, Staff/Department links and employee-safe views are integrated using existing
styles. Original screens, sidebar grouping and controls remain. The earlier
preparation question is **resolved by the owner's instruction in this session**;
the [technical guide](../../../development-guide/IT-Assets-Issue-Return-and-Write-Off.md#checkpoint-5b-integrated-interface-and-owner-clarification)
records the exact rules and reuse of existing check controls. No data-bearing
field or replacement layout was added.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_assignment_closure test_stock_intake test_device_assignments test_device_assignments_http test_staff_directory test_history_permissions -v
NODE_PATH=/path/to/test-tools/node_modules CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/stock-circulation-interface.cjs
```

**107 backend tests passed:** [log](checkpoint-05-interface-backend.log).
**Complete browser flow passed:** [log](checkpoint-05-browser.log). It checks selected
Ready limits, restricted recipients, Staff/Department issues, mixed/partial returns,
cleaning/data confirmations, preparation, held/issued write-offs, canonical Device
preservation, employee quantities, directory navigation and feature-off retention.
No page errors occurred. This focused run captured no screenshots.

The first browser harness attempted the inventory URL for an employee who correctly
has only account/self-service access, and later used fragment-only navigation for
retained SPA views. Tests now use the existing account/sidebar entry points. The
Device-to-stock action also exposed a real modal-navigation defect, fixed by closing
the existing read-only Details modal before navigating. Initial fixture transaction
and selector mistakes were corrected. No access rule was relaxed to make tests pass.

The existing intake browser regression also passed earlier during integration;
it will be checked again with the final source in CI. Full final suites, genuine
screenshots, version-aware final guides and owner visual acceptance remain pending.

## Checkpoint 5C — Visual Review Corrections

Commit `c205cfae9b8351e960e6e6ed90eae508481c7307` adds real closure attribution to
independently permitted assignment history, retains form values during theme captures
and prevents broken stock-table heading words. **62 tests passed**; the initial new
assertion expected the wrong fictional actor name and was corrected to the actual
snapshot. The final backend and capture results above supersede earlier evidence.
No Schema 16/17 definition or stock-operation rule changed in this checkpoint.

## Checkpoint 5D — Original Device Holder In Movement History

Commit `11cf6beaf39e53c1abaad9c2649a64b5edfb93c6` projects the existing assignment’s
historical holder label in the authorised stock journal. It changes no stored fact,
schema or movement rule. All **62 affected tests passed**, including feature-disabled
privacy. The complete 52-image flow was refreshed against this final runtime.
The full backend run above is pinned to `c205cfa`; final GitHub CI covers the additional
read-only projection and the final documentation commit separately.

## Final CI False Positive

The first final-evidence commit (`80011c8`) failed the full-history secret scan.
The redacted local report identified only `Source-Checks.json:27`: the SHA-256 of
`backend/request_auth.py`. Recomputing the hash from the committed file bytes
confirmed it is a source checksum, not a credential. The existing `.gitleaksignore`
now names only that exact commit/file/rule/line fingerprint. No detector or path
was broadly excluded, and no checkpoint history was rewritten. See the
[repeat scan result](secret-scan-check.log). Final PR Actions are reported in the
PR description so their actual status remains visible without changing evidence
source revisions.
