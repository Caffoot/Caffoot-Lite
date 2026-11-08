# Issue #305 — verified correction batch

Implemented both corrections under the [explicit owner approval](https://github.com/Caffoot/Caffoot-Lite/issues/305#issuecomment-6665190890), starting from clean local and fetched branch HEAD `815b17cd475eda734ac4e3a35c71be053121f33b`. Implementation checkpoint **`af6cc6327c5984f65399cd20275aa867868d6ec5`** is pushed. The final delivery commit adds verification/evidence; its application HTML/CSS is identical to that checkpoint, verified by [runtime hashes](manifest.json).

## Passed comparisons

Rack Overview now renders **main tabs → heading/description → secondary tabs → four shared metrics → existing insight cards**. Capacity, Equipment and Locations & Types all retain the same metric grid. No application JavaScript, calculations, labels, insight copy, chart values or handlers changed.

Measurements use live Device Intelligence, not guessed values. Values below match on **all three Rack subtabs**, in both themes, at 1440×950 and 390×844:

| Measurement | Desktop | Mobile |
| --- | ---: | ---: |
| Main-tab bottom → heading block | 18px | 18px |
| Heading block → secondary strip | 17px | 14px |
| Secondary strip height | 55px | 55px |
| Secondary strip → metrics | 19px | 19px |
| Metric row/column gaps | 14px | 10px |
| Metrics → insights | 17px | 17px |
| Insight card/section gaps | 17px | 17px |

The first reference pass caught a transient **3px entrance-animation transform** in light mode. The [steady-state reference](device-reference.json) and final tests disable animation/transition in the test page only; the resulting main inset is 18px consistently. The previous Batch 02 21px decision/records are retained in history and superseded by this explicitly approved Device-style amendment. Production animation rules were not changed.

Before: Rack metrics preceded the subtabs, used 16px grid gaps, and had no dedicated following separation; some insight groups touched or used 16px spacing. After: the measured gaps above apply through selectors limited to Rack Overview and its layout wrappers. Horizontal tab styling, card typography/colours and internal chart-content spacing remain. Inventory, Accessories and selected-rack detail styles are outside those selectors.

Populated fixture totals remain **3 racks / 126U / 3 mounted devices / 0 accessories**, and each subtab's insight text and chart values match the baseline. Empty client-fixture renders show **0 / 0U / 0 / 0** on all three subtabs. Selected insight survives Inventory → Accessories → Overview navigation. Enter activation and horizontal scrolling to Locations & Types pass. The existing narrow tab strip remains horizontally scrollable; its unscrolled last label is partly clipped, as in the baseline. [Scrolled mobile capture](images/rack-scroll-dark-390.png) verifies reachability; no automatic tab-reveal behaviour was added.

Audit Coverage removes **only** `SAVED HISTORY`, `V2.1 · PRIVATE ACCEPTANCE` and `APPROVED RETENTION` eyebrow elements. All three bold headings/descriptions, card grid styling, lower status indicators and **Your security matters** notice match the baseline unchanged. Existing JSON export downloads the same current event list and a valid export timestamp.

## Checks and evidence

- **Passed:** 28 populated/reference/Audit/adjacent-section measurement records, covering both themes/widths and all Rack subtabs; no checked document overflow or browser errors.
- **Passed:** 12 empty-subtab measurements and four keyboard/scroll/export action summaries. These empty cases use isolated client fixtures; click/keyboard/export checks use the live handlers. SQLite inventory/history before/after all checks is identical.
- **Passed:** 12 existing tests in `tests.test_modular_interface`, `tests.test_history_permissions` and `tests.test_history_http`; approved HTML contract; JavaScript syntax; diff and staged secret checks.
- **Passed at the unchanged implementation checkpoint:** [backend](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42080591122), [complete Chromium functional regression](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42080591069), [Compose lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42080591016), [history secret scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42080591395). No unrelated full suites were repeated manually.
- Rendered review confirms the corrected hierarchy, all four metrics on each subtab, separated card groups and balanced Audit cards in both themes/widths. Data/content differences between Device and Rack metrics are expected; they retain their distinct original meanings.

[Baseline](baseline.json), [checkpoint comparisons](checkpoint.json), [action/empty checks](actions.json) and [manifest](manifest.json) preserve actual measured positions, content, values and checksums. All 20 final page captures, selected before captures and two horizontally scrolled captures are committed under `images/` (30 PNGs).

| Rack subtab | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| Capacity | [View](images/racks-capacity-light-1440.png) | [View](images/racks-capacity-dark-1440.png) | [View](images/racks-capacity-light-390.png) | [View](images/racks-capacity-dark-390.png) |
| Equipment | [View](images/racks-equipment-light-1440.png) | [View](images/racks-equipment-dark-1440.png) | [View](images/racks-equipment-light-390.png) | [View](images/racks-equipment-dark-390.png) |
| Locations & Types | [View](images/racks-locations-light-1440.png) | [View](images/racks-locations-dark-1440.png) | [View](images/racks-locations-light-390.png) | [View](images/racks-locations-dark-390.png) |

Device reference: [desktop](images/devices-light-1440.png), [mobile](images/devices-light-390.png). Audit: [desktop before](images/before-audit-light-1440.png) / [after](images/audit-light-1440.png), [mobile before](images/before-audit-dark-390.png) / [after](images/audit-dark-390.png).

Reproduce with existing tools (no dependencies installed for this batch):

```sh
NODE_PATH=/workspace/.caffoot-tools/node_modules CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_ISSUE305=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/issue-305/recheck node tests/approved-visual.cjs
# Add CAFFOOT_ISSUE305_ACTIONS_ONLY=1 for empty/keyboard/scroll/export checks.
python -m unittest tests.test_modular_interface tests.test_history_permissions tests.test_history_http -v
node tests/approved-html-contract.cjs
```

## Remaining acceptance

No unresolved mismatch against these **two corrections** was found in the exercised Chromium states. This is not owner visual acceptance. Safari/physical-device testing and the next private local Docker build/Pi–Portainer review remain with the owner. Chromium 155 / Playwright 1.56.1 tests use the existing visual runner's isolated fixtures and network/font stubs.

The twelve pinned source files/CSS, backend/API/schema, security rules, Docker configuration, `main` and PR #281 are unchanged. Batch 01 and the other Batch 02 corrections remain. No merge, image publication or release was performed.
