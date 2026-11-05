# Owner Acceptance Correction Batch 02 — verification

Implementation and relevant local verification are complete for the six approved findings in [Batch 02](../../development-guide/Owner-Acceptance-Correction-Batch-02.md), under [Issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282). Approval commit: `f6399309b1076e0cb41230bdc0bee678145e9168`. This is **not owner acceptance or a release**. The delivery message identifies the exact pushed commit and its final GitHub checks.

The twelve pinned HTML/CSS sources at `c26db4a56bbc30f95b56201e81a7a76d13c6037b` remain unchanged. Batch 01, Python, SQLite, APIs, permissions, authentication, Docker configuration and existing functionality are preserved. Tests use isolated temporary databases and accounts.

## Findings and actual comparisons

| Finding | Verified result | Status |
| --- | --- | --- |
| 01 — Rack Overview spacing | Devices and Racks both measure **21px** from main-tab bottom to first heading at 1440px and 390px. Owner explicitly chose **“Retain 21px; review in Safari”** after seeing these measurements. Nested tab order and metric positions remain as implemented. Adjacent Rack Inventory/Accessories remain reachable without overflow. | Passed in Chromium; owner Safari review pending |
| 02 — allocation action | Existing action now occupies its own row **18px below the statistics**, with no intersection. Populated counts remain **5 assigned / 3 reserved / 754 available** in the fixture; empty counts are **0 / 0 / 0**. Mouse and Enter activation reach IPAM through the existing handler. | Passed, both themes/widths |
| 03 — dark theme | Corrected white filter/control panels, dark headings/table text, breadcrumbs, catalogue/dialog/coverage labels, supplementary panels, selected options and semantic warnings. Central existing slate tokens cover both application and external modal mounts; neutral controls use `:where` so semantic selected/disabled/warning rules can win. Searchable controls follow System changes while open. Public authentication uses the existing stored preference. | Passed within the rendered/contrast scope below |
| 04 — header photo | The existing extra initial wrapper now fills the **32×32px** circle; the image uses centred cover. An actual **40×120px** portrait fixture stays circular through resizing. Button rectangles remain unchanged; upload, header refresh, reload, removal and removal persistence pass. | Passed, both themes/widths |
| 05 — sidebar | Before: Audit/Users desktop gaps **10px**, reference pages **12px**; first two item tops **142/192px** versus **146/198px**. Mobile logo height also displaced the menu by 1px. Shared reference metrics now apply. A further collapsed mobile override used 11px padding instead of the reference 12px; corrected after the failing cross-page assertion. Expanded/collapsed geometry, selected/hover colours and navigation are checked across all eight destinations. | Passed, both themes/widths |
| 06 — Audit notice | Exact bottom-banner wording: **Your security matters.** Audit records track changes without storing passwords, authentication codes or other sensitive credentials. Other warnings/coverage labels remain. Existing audit allowlist/exclusion and permission tests pass; copy alone is not evidence of universal secret exclusion. | Passed, both themes/widths |

Current layout coordinates clarify finding 01; these are not a claim that the two different overview structures have identical metric positions:

| Width | Page | Main-tab bottom | Heading top | First metric-grid top |
| --- | --- | ---: | ---: | ---: |
| 1440 | Devices Overview | 240.03 | 261.03 | 400.08 |
| 1440 | Rack Overview | 243.03 | 264.03 | 326.03 |
| 390 | Devices Overview | 307.42 | 328.42 | 483.52 |
| 390 | Rack Overview | 307.45 | 328.45 | 407.45 |

Devices places its nested tabs before the metrics; Racks places them afterwards. No reordering or extra gap was substituted for the owner's decision.

Dark-mode examples from rendered computed colours:

| Text | Before foreground/background and ratio | After foreground/background and ratio |
| --- | --- | --- |
| Breadcrumb | `#75899a / #1e293b`, **4.04** | `#cbd5e1 / #1e293b`, **9.85** |
| Inventory table cell | `#49647c / #1e293b`, **2.37** | `#cbd5e1 / #1e293b`, **9.85** |
| Editor input | Light control `#223b53 / #ffffff`, **11.55** | Dark control `#f1f5f9 / #0f172a`, **16.30** |

The input was readable before but used the wrong theme surface. Dark primary actions retain the existing orange and use the existing slate foreground for contrast. Independent dark rack elevations and green/peach fascias remain intact. Audit detail before/after values retain distinct red/green meanings using the existing dark semantic palette.

**Light preservation:** 966 recorded colour, font-size, line-height, border and size properties across the main-screen baseline comparisons were checked. The only differences in those samples are Dashboard body height **+18px** at each width, caused by the authorised action gap. Sidebar spacing and the photograph crop are intentional changes checked separately. This is bounded comparison evidence, not a blanket pixel-equality claim.

## Checks and evidence

- Existing Chromium functional regression: **PASS**, including MFA/account/photo actions, device/IPAM/Rack CRUD, multi-user freshness, permissions/read-only controls, reservations, protected Clean Start and published v1.3.3 import behaviour.
- Focused Python: **19 passed** across modular sources, history permissions/HTTP, account security and three existing device/Rack/IPAM exclusion tests. Final modular-source rerun: **2 passed**. Backend application code is unchanged.
- Existing approved HTML contract and JavaScript syntax checks: **PASS**. Function Index links remain valid (603 recorded definitions).
- Dark first-run/MFA runner: **12 rendered states**, six states at both widths; resumed identity, cleared enrolment material and fresh MFA sign-in assertions **PASS**. Authenticator material is masked in preserved screenshots.
- Main-screen comparisons cover all twelve source areas at **1440×950** and **390×844**, light/dark. Focused tab/dialog checks include all six catalogues, editor tabs, read-only detail tabs, IPAM/Rack dialogs, User Workspace, Audit event details and relevant account/settings views.
- Expanded/collapsed sidebar checks compare rectangles, padding, icon alignment, selected and hover colours across Dashboard, Devices, IPAM, Racks, Audit, Users, My Account and Settings. The account destination remains in the header. Read-only/admin restrictions also pass in the existing Chromium suite.
- Light/Dark/System preference, reload persistence, explicit preference overriding OS changes, public sign-in OS following, and open searchable-control colours **PASS**.
- The existing release-file consistency check passes at its existing version; no release version was changed. Docker/upgrade evidence is reused; no private acceptance image was built for this batch. The repository's automatic Compose workflow passed at the implementation checkpoints.

Reproducible commands use the existing tools, with the environment's network permission for loopback servers/Node child processes:

```sh
python -m unittest tests.test_modular_interface tests.test_history_permissions tests.test_history_http tests.test_account_security -v
python -m unittest tests.test_reserved_device_saves.ReservedDeviceSaveTests.test_audit_details_keep_safe_changes_but_never_notes_or_credentials tests.test_collection_saves.CollectionSaveTests.test_rack_audit_details_redact_private_notes tests.test_collection_saves.CollectionSaveTests.test_ipam_batch_audit_shows_changed_safe_subnet_fields_only -v
node tests/approved-html-contract.cjs
NODE_PATH=/workspace/.caffoot-tools/node_modules NODE_OPTIONS=--require=/workspace/.caffoot-tools/system-chromium.cjs node tests/browser-compat.cjs
NODE_PATH=/workspace/.caffoot-tools/node_modules CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_OWNER_BATCH02=1 CAFFOOT_VISUAL_FILTER='^$' node tests/approved-visual.cjs
NODE_PATH=/workspace/.caffoot-tools/node_modules CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_AUTH_THEME=dark node tests/first-run-visual.cjs
```

The Batch 02 runner supports `CAFFOOT_BATCH02_WIDTH`, `CAFFOOT_BATCH02_THEME` and `CAFFOOT_BATCH02_ACTION_FOCUS` (`navigation`, `presentation`, `theme-states`, `supplementary`) to rerun affected checks. Passing checks were reused; subsequent corrections received their affected reruns.

[Final measurements and runtime hashes](owner-acceptance-batch-02-final.json) retain the per-state colours/rectangles, originating run and screenshot checksums. The [baseline](owner-acceptance-batch-02-baseline.json) and [first dark mobile pass](owner-acceptance-batch-02-dark-mobile-first-pass.json) intentionally preserve earlier evidence, including resolved failures. Use the final consolidated record for current results.

The first baseline helper selected Quick Access rather than the allocation card, and did not locate the Devices metric grid. Those baseline fields are not used as evidence of a gap or grid displacement. The baseline screenshots remain useful; corrected selectors provide the final coordinates. An early Node source-contract invocation required the published child-process/network permission; the permitted rerun passed. Early fixed-delay media and ambiguous close-button assertions were corrected in the test helper.

Selected rendered evidence:

- [Inventory before](owner-acceptance-batch-02-visuals/inventory-before-dark-1440.png) / [after](owner-acceptance-batch-02-visuals/inventory-after-dark-1440.png); [mobile before](owner-acceptance-batch-02-visuals/inventory-before-dark-390.png) / [after](owner-acceptance-batch-02-visuals/inventory-after-dark-390.png).
- [Dashboard before](owner-acceptance-batch-02-visuals/dashboard-before-dark-1440.png) / [after](owner-acceptance-batch-02-visuals/dashboard-after-dark-1440.png).
- [Devices/Racks spacing](owner-acceptance-batch-02-visuals/devices-racks-spacing-390.png), [sidebar comparison](owner-acceptance-batch-02-visuals/sidebar-comparison.png), [portrait crop](owner-acceptance-batch-02-visuals/portrait-header-dark-390.png).
- [Audit coverage notice](owner-acceptance-batch-02-visuals/audit-coverage-dark-390.png), [Audit event details](owner-acceptance-batch-02-visuals/audit-detail-dark-390.png), [dark User Workspace](owner-acceptance-batch-02-visuals/user-workspace-dark-390.png) / [light](owner-acceptance-batch-02-visuals/user-workspace-light-390.png), [masked first-run enrolment](owner-acceptance-batch-02-visuals/first-run-enrolment-dark-390.png).

## Limits and remaining owner acceptance

No remaining verified **Batch 02** mismatch is known in the exercised Chromium states. Computed contrast checks inspect visible leaf text against opaque RGB ancestor backgrounds, using 4.5 or 3 for large text; gradients/alpha backgrounds are excluded. The final dark samples have no flagged cases. This does not certify full accessibility, every possible data value, or complete pixel fidelity to a light-only source.

Browser: Chromium 155.0.8059.79, Playwright 1.56.1, Python 3.12.14, Node 24.22.1 on this Linux environment. Mobile checks are viewport checks. Existing visual-runner network stubs/font fallbacks are retained; actual Safari/device rendering and normal owner-host font/network conditions remain unverified here.

The owner must still build the next **private local Docker image**, review it on Pi/Portainer and in Safari, and confirm the retained Rack spacing and complete product acceptance. No merge, registry publication or release is authorised by these results. `main`, PR #281 and pinned designs were not modified.
