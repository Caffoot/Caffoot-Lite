# Associated Equipment — Checkpoint C Evidence

Checkpoint C extends the existing approved Device Details tabs and stock Issue
Equipment form. Assigned To, its history and all existing Device controls remain
unchanged. No new stylesheet, design system or preparation screen is introduced.

Actual checks on 16 November 2026:

- **78 focused backend/HTTP tests passed**: association foundation, both atomic
  writers, protected requests and existing stock circulation.
- **Associated Equipment Chromium journey passed**: explicit links only, original
  returned-item history, both Add Equipment routes, selected-item availability,
  correct deduction/no second deduction, exact-recipient choices, read-only
  controls, feature-off privacy and unchanged Assigned To markup.
- **Existing stock circulation Chromium journey passed**: normal issue, mixed/
  partial return, preparation, write-off, canonical closure and safe projections.
- Twelve genuine captures cover all three changed views at 1440px and 390px,
  light and dark. No page errors or checked page overflow occurred. Captures were
  visually inspected against the existing Device panel/card/tab and stock form
  conventions. Tables retain the existing horizontal scrolling on small screens.
- JavaScript/Python syntax and diff checks passed. Final acceptance and owner
  visual approval are separate; C does not establish completion of D or E.

The [capture manifest](browser-results.json) records executed checks, screenshot
names and SHA-256 hashes of the actual runtime sources, including the unchanged
equipment/stock styles. Its `sourceParent` is the earlier commit beneath the
working source, **not a claim that those screenshots depict the unchanged parent**.
The source hashes identify the captured implementation committed alongside this
report. Earlier accepted screenshots remain untouched.

| Changed View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Associated Equipment | [View](associated-equipment-desktop-light.png) | [View](associated-equipment-desktop-dark.png) | [View](associated-equipment-mobile-light.png) | [View](associated-equipment-mobile-dark.png) |
| Add From Ready Stock | [View](add-equipment-ready-desktop-light.png) | [View](add-equipment-ready-desktop-dark.png) | [View](add-equipment-ready-mobile-light.png) | [View](add-equipment-ready-mobile-dark.png) |
| Associate Already Issued | [View](add-equipment-existing-desktop-light.png) | [View](add-equipment-existing-desktop-dark.png) | [View](add-equipment-existing-mobile-light.png) | [View](add-equipment-existing-mobile-dark.png) |

```sh
PYTHONPATH=tests:. python -m unittest test_equipment_associations test_equipment_associations_http test_associated_equipment_writes test_associated_equipment_writes_http test_stock_circulation -q
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_ASSOCIATION_CAPTURE=1 CAFFOOT_ASSOCIATION_OUTPUT=<evidence-directory> node tests/associated-equipment-interface.cjs
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/stock-circulation-interface.cjs
```

Native Safari/Raspberry Pi, private legacy data and complete backup/restore
acceptance remain deferred. No merge, release or deployment is claimed.
