# IT Assets Dashboard — Review Evidence

16 November 2026. Draft implementation for [issue #396](https://github.com/Caffoot/Caffoot-Lite/issues/396), based on `6222d8a87e4a02dd4e69f070e11777d2ec82b591`. The reporting/permission checkpoint was pushed as `ebff8ea`. This report accompanies the preserved dashboard source; it does not record owner visual acceptance or permission to merge.

## Confirmed Checks

- `PYTHONPATH=tests:. python3 -m unittest test_stock_reporting -q`: eight tests passed in 1.222 seconds at the reporting checkpoint. These cover mixed registered/unregistered stock, strict per-item thresholds, corrected movement quantities, date boundaries, current balances, legacy assignments, role-upgrade preservation and direct HTTP/session guards.
- After filtering hidden registration activity, the mixed-stock privacy test passed separately in 0.057 seconds.
- `node --check interface/stock-intake.js`: passed during interface development.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_DASHBOARD_CAPTURE=1 CAFFOOT_DASHBOARD_OUTPUT=docs/development-handovers/evidence/stock-dashboard node tests/stock-dashboard-interface.cjs`: passed. The focused authenticated browser check exercised reporting periods, category/KPI drill-downs, stock details, current assignments, registered stock navigation, keyboard chart tables, read-only/restricted viewers, denied writes and feature-off reporting. No page errors or horizontal page overflow were reported.
- `git diff --check`: passed before the interruption.

## Four Genuine Dashboard Captures

These show the changed authenticated application with fictional stock persisted through its existing APIs, not the standalone preview or copied sample data. Desktop light and mobile dark were visually inspected during development.

| View | Capture |
| --- | --- |
| Desktop, Light, 1440 × 1050 viewport | [Dashboard](dashboard-light-1440.png) |
| Desktop, Dark, 1440 × 1050 viewport | [Dashboard](dashboard-dark-1440.png) |
| Mobile, Light, 390 × 844 viewport | [Dashboard](dashboard-light-390.png) |
| Mobile, Dark, 390 × 844 viewport | [Dashboard](dashboard-dark-390.png) |

## Outstanding Verification

After the confirmed browser run, a small reporting revision excluded direct reassignment transfers from physical movement charts, avoided repeated classification reads and added a dedicated handover test. The existing built-in-role expectations were also updated. The combined `test_stock_reporting test_builtin_roles` run started, but its completion result was not retained across the usage-limit interruption. Those final changes must not be described as passing tests. The captures predate that reporting-only revision; no interface change followed the captures.

At the owner's preservation instruction, no tests or screenshots were repeated. Full local backend, browser and Docker regression suites were not run. GitHub Actions were not monitored. Independent code review, final focused checks of the reporting/role changes, owner visual approval and later Ready For Review verification remain outstanding. Deferred native/manual and Stage 6 acceptance remain deferred. No merge, release or deployment is authorised.
