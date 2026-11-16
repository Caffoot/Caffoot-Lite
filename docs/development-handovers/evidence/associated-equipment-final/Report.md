# Associated Equipment And Prepared Reassignment — Final Review Evidence

Batch 3.10 Checkpoints A–D are implemented on draft PR [#391](https://github.com/Caffoot/Caffoot-Lite/pull/391),
targeting `milestone-1`. E adds the final instructions, source-matched evidence
and CI journey. The owner explicitly approved the [direct handover sequence](../../../development-guide/Direct-Handover-Decision.md)
on 16 November 2026. This report does not claim owner visual acceptance, a
merge, a published v2.2 image or a production upgrade/restore rehearsal.

## Source And Captures

The complete D runtime is pushed at
[`b83e061211b2a4784f8db7198228241da0942940`](https://github.com/Caffoot/Caffoot-Lite/commit/b83e061211b2a4784f8db7198228241da0942940).
Schema 19's preparatory checkpoint is
[`0fe2408fe46a73e60aa614bad95e265d5812d1be`](https://github.com/Caffoot/Caffoot-Lite/commit/0fe2408fe46a73e60aa614bad95e265d5812d1be).
E changes tests, documentation and CI only. Both capture manifests identify that
exact D runtime as `sourceParent` and record SHA-256 hashes verified against E's
unchanged runtime files. The final E SHA and final-head Actions results are
recorded in the [PR acceptance report](https://github.com/Caffoot/Caffoot-Lite/pull/391).

**36 new genuine Chromium captures** were taken on 16 November 2026 using the
real local HTTPS server and isolated fictional SQLite records. Desktop is
1440 × 1050; mobile is 390 × 1050. Light and dark are actual application theme
choices. These are browser screenshots, not recreated HTML, mock-ups or edited
images. The scripts wait for transient notifications to clear before capture.
The forms, assignment history and stock movement view were visually inspected;
both journeys assert no page overflow or JavaScript page errors. Mobile tables
and modal contents retain their existing internal scrolling. These captures are
review evidence, not a visual comparison certificate or native Safari acceptance.

Earlier accepted evidence, the [C gallery](../associated-equipment/Report.md)
and [partial D gallery](../associated-equipment-resolution/Report.md) remain intact.
The final manifests are [associations](associated/browser-results.json) and
[direct handovers](handovers/browser-results.json).

| Changed View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Associated Equipment | [View](associated/associated-equipment-desktop-light.png) | [View](associated/associated-equipment-desktop-dark.png) | [View](associated/associated-equipment-mobile-light.png) | [View](associated/associated-equipment-mobile-dark.png) |
| Issue And Associate | [View](associated/add-equipment-ready-desktop-light.png) | [View](associated/add-equipment-ready-desktop-dark.png) | [View](associated/add-equipment-ready-mobile-light.png) | [View](associated/add-equipment-ready-mobile-dark.png) |
| Associate Existing Issue | [View](associated/add-equipment-existing-desktop-light.png) | [View](associated/add-equipment-existing-desktop-dark.png) | [View](associated/add-equipment-existing-mobile-light.png) | [View](associated/add-equipment-existing-mobile-dark.png) |
| Missing Quantity Write Off | [View](associated/missing-issued-quantity-desktop-light.png) | [View](associated/missing-issued-quantity-desktop-dark.png) | [View](associated/missing-issued-quantity-mobile-light.png) | [View](associated/missing-issued-quantity-mobile-dark.png) |
| Unchecked Preparation | [View](handovers/direct-handover-checks-required-desktop-light.png) | [View](handovers/direct-handover-checks-required-desktop-dark.png) | [View](handovers/direct-handover-checks-required-mobile-light.png) | [View](handovers/direct-handover-checks-required-mobile-dark.png) |
| Devices-only Confirmation | [View](handovers/direct-handover-devices-only-desktop-light.png) | [View](handovers/direct-handover-devices-only-desktop-dark.png) | [View](handovers/direct-handover-devices-only-mobile-light.png) | [View](handovers/direct-handover-devices-only-mobile-dark.png) |
| Canonical Assignment History | [View](handovers/assigned-after-direct-handover-desktop-light.png) | [View](handovers/assigned-after-direct-handover-desktop-dark.png) | [View](handovers/assigned-after-direct-handover-mobile-light.png) | [View](handovers/assigned-after-direct-handover-mobile-dark.png) |
| Registered Device Confirmation | [View](handovers/direct-handover-registered-desktop-light.png) | [View](handovers/direct-handover-registered-desktop-dark.png) | [View](handovers/direct-handover-registered-mobile-light.png) | [View](handovers/direct-handover-registered-mobile-dark.png) |
| Registered Custody History | [View](handovers/stock-custody-history-desktop-light.png) | [View](handovers/stock-custody-history-desktop-dark.png) | [View](handovers/stock-custody-history-mobile-light.png) | [View](handovers/stock-custody-history-mobile-dark.png) |

## Actual Checks

- Schema 19 preparation: **58 focused tests passed** before its separate push.
- Complete D: **146 focused tests passed**, including 24 new migration/writer/HTTP
  tests. [The exact command and coverage](../../../development-guide/Associated-Equipment.md#d-verification)
  include concurrency, late failure rollback, immutable audit/assignment links,
  later real physical returns, repeated handovers, hidden/historical outstanding
  accessories, current eligibility, reservations, stale versions, idempotency,
  live session/MFA/permissions/features, CSRF and origin enforcement.
- E adjacent regressions: **64 tests passed**, covering accessory resolution,
  initial assignment/HTTP, stock registration/intake and history privacy. The
  first invocation also named a nonexistent `test_stock_circulation_http` module
  and failed at import; the corrected command below passed without code changes.
- Both final HTTPS/SQLite Chromium journeys passed: 16 association/missing-quantity
  captures and 20 direct-handover captures. Assertions cover both Add Equipment
  routes, exact-recipient choices, no second deduction, read-only/feature-off
  privacy, blocked unresolved accessories, unchecked preparation, Cancel keeping
  the old holder, explicit Ready confirmation, non-administrator Devices-only
  operation with IT Assets off, registered Staff → Department custody, unchanged
  Device JSON and stock balances, one Reassigned movement, and employee privacy.
- The existing canonical assignment/My Equipment Chromium journey also passed.
  D's first browser Action failed its earlier assertion that Reassign must be
  absent; E updates that assertion to require the approved action while still
  rejecting an invented Return action. No runtime change was needed. D's backend
  Action passed 910 tests with four skips; final-head results remain separate.
- Python/JavaScript syntax, runtime capture hashes, local documentation targets
  and `git diff --check` passed. The Function Index has **988 definitions**.

```sh
PYTHONPATH=tests:. python -m unittest test_associated_equipment_resolution test_device_assignments test_device_assignments_http test_device_stock test_stock_intake test_history_permissions -q
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_ASSOCIATION_CAPTURE=1 CAFFOOT_ASSOCIATION_OUTPUT=<associated-evidence-directory> node tests/associated-equipment-interface.cjs
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_HANDOVER_CAPTURE=1 CAFFOOT_HANDOVER_OUTPUT=<handover-evidence-directory> node tests/device-handover-interface.cjs
```

The existing browser Actions workflow now includes the direct journey and
uploads its evidence. Final acceptance requires the existing final-head backend,
browser (including its existing Firefox/WebKit jobs), Docker Compose lifecycle,
release-documentation, git-history secret scan and **read-only PR release
preflight** Actions. Actual run links/results belong to the PR's final-head
report; earlier-head green checks are not substituted. No publication workflow
is manually dispatched, and no complete local backend/compatibility collection
is repeated.

## Data And Permission Safeguards

Schema 18's permanent explicit links still point to the original canonical
assignment and accessory issue. Matching recipients never infer associations.
Schema 19 adds only nullable handover-audit/successor references to the existing
assignment table, with narrow immutable-audit and custody guards. No new stock
or Device system, automatic associations, grants, feature changes or opening
balances are migrated. Populated upgrade, restart, rollback and tamper checks
passed; the physical-return guard retains its original conditions.

Association reads/writes require both effective inventory grants. Direct
Devices-only handover needs Devices Edit; recorded stock additionally needs
IT Assets Edit. All writes recheck live access and feature choices under the
write lock. Hidden accessories still block transfer without exposing their
details. Canonical holder history remains on one Device; employee My Equipment
keeps its limited current-equipment projection.

Actual returns and missing/broken dispositions use existing controls. Returned
accessories are not automatically Ready and never follow the workstation.
Workstation preparation and the explicit Ready confirmation are recorded
atomically with holder history and any stock custody. The registered ledger
keeps one issued unit using an audited pair of custody facts, with no held/Ready
increase or fictional storeroom receipt. Initial allocation and genuine held
stock reissue keep their existing safeguards. Device status, IPAM, racks and
location are unchanged.

## Acceptance Limits

No further product decision is open for this implementation. Owner review and
visual acceptance are still required; PR #391 remains draft and unmerged.
Raspberry Pi/native Safari, private legacy datasets and the previously deferred
Batch 3.4 native acceptance remain unverified. Complete persistent-volume
upgrade/restore and completed-milestone legacy-import acceptance belong to Stage
6. Hosted Docker lifecycle checks do not establish those native results.
Corrections, dashboards, Suppliers, Service Desk and stocktakes remain outside
Batch 3.10. No merge, release, deployment or production change is authorised.
