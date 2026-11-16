# Accessory Resolution — Safe Partial Checkpoint D

The approved missing-quantity extension and the accessory guard on genuine
held-stock reissue are implemented. **D is not complete:** direct handover is
paused at the [specific owner decision](../../../development-guide/Direct-Handover-Decision.md).
E's final acceptance is therefore deferred, not claimed by this report.

Verified on 16 November 2026:

- **102 focused backend/HTTP tests passed**, including seven new resolution
  tests. They cover exact missing quantities, unchanged held/Ready balances,
  original holder/quantity/history, actual partial returns, mandatory workstation
  checks, historical outstanding accessories blocking reissue, canonical history
  after genuine physical reissue, stale/invalid/replayed requests, permissions,
  features, sessions/CSRF, concurrent write-offs and rollback after persistence.
- The expanded real Chromium journey passed both association routes, missing
  quantity write-off through existing controls, read-only and feature-off checks.
  The existing stock circulation Chromium journey also passed unchanged.
- Sixteen genuine desktop/mobile light/dark captures are recorded in the
  [manifest](browser-results.json). These preserve the earlier C gallery in its
  separate folder. The changed Associated Equipment actions and existing Write
  Off form were visually inspected; button spacing uses existing utilities.
- JavaScript/Python syntax and diff checks passed. Schema 18, stock guards and
  assignment-closure definitions are unchanged. The Function Index has 978
  definitions. New-head GitHub Actions are reported separately after pushing.

| Changed View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Associated Actions | [View](associated-equipment-desktop-light.png) | [View](associated-equipment-desktop-dark.png) | [View](associated-equipment-mobile-light.png) | [View](associated-equipment-mobile-dark.png) |
| Missing Quantity Write Off | [View](missing-issued-quantity-desktop-light.png) | [View](missing-issued-quantity-desktop-dark.png) | [View](missing-issued-quantity-mobile-light.png) | [View](missing-issued-quantity-mobile-dark.png) |
| Add From Ready Stock | [View](add-equipment-ready-desktop-light.png) | [View](add-equipment-ready-desktop-dark.png) | [View](add-equipment-ready-mobile-light.png) | [View](add-equipment-ready-mobile-dark.png) |
| Associate Existing Issue | [View](add-equipment-existing-desktop-light.png) | [View](add-equipment-existing-desktop-dark.png) | [View](add-equipment-existing-mobile-light.png) | [View](add-equipment-existing-mobile-dark.png) |

`sourceParent` identifies the previous C commit beneath the captured working
source; the recorded runtime hashes identify this partial D implementation.
No old screenshot is represented as evidence for changed code.

```sh
PYTHONPATH=tests:. python -m unittest test_associated_equipment_resolution test_equipment_associations test_stock_circulation test_device_reissue test_associated_equipment_writes test_associated_equipment_writes_http test_assignment_closure -q
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_ASSOCIATION_CAPTURE=1 CAFFOOT_ASSOCIATION_OUTPUT=<evidence-directory> node tests/associated-equipment-interface.cjs
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/stock-circulation-interface.cjs
```

Raspberry Pi/native Safari, private legacy data and complete backup/restore
acceptance remain deferred. No merge, release, deployment or production change.
