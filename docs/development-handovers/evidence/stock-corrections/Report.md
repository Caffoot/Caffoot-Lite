# Correct Stock Movement — Verification And Visual Evidence

**Draft PR:** [#392](https://github.com/Caffoot/Caffoot-Lite/pull/392), targeting `milestone-1`.
**Verified starting remote HEAD:** `53b04328c4f895bfc1f72f0416c43a519b2e8b42`.
**Captured runtime:** `0e72633c6820b9225b26f4e451f474ca901397fe`.
The final evidence commit follows that runtime without changing application code.
[Runtime hashes and browser results](browser-results.json) identify all six changed
runtime files; [screenshot hashes](screenshot-hashes.json) identify the original PNGs.

## What Changed

Correct Movement extends the existing IT Assets Movement History. A technician
selects one original Received/Issued/Returned/Written Off entry, sees original
and effective quantities and original provenance, enters a changed quantity and
reason, reviews protected calculated balances and saves a separately attributed
correction. The original record and all later chronological facts remain intact.
Existing journal and assignment projections calculate current stock/outstanding
quantities. No migration, ledger replacement, new Device, fabricated receipt or
physical return is introduced. Schema 19 and its immutable-history guards remain.

## Actual Checks

| Command / Check | Verified Result | Evidence |
| --- | --- | --- |
| `python3 -m unittest discover -s tests -p test_stock_corrections.py -v` | 27 passed, no failures | [Focused backend/HTTP/database/security log](backend-focused.log) |
| `python3 -m unittest discover -s tests -v` | Local checkpoint: 938 run, 934 passed, four skips, no failures; before two additional HTTP tests, which passed in the focused run | [Full local backend log](backend-full.log) |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_CORRECTION_CAPTURE=1 node tests/stock-correction-interface.cjs` | Passed; 28 genuine captures; no page errors or checked page overflow | [Correction browser log](browser-corrections.log), [results](browser-results.json) |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/stock-circulation-interface.cjs` | Passed existing complete circulation journey | [Log](browser-circulation.log) |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/associated-equipment-interface.cjs` | Passed existing association/resolution journey | [Log](browser-associations.log) |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/device-handover-interface.cjs` | Passed existing Devices-only and registered-custody journey | [Log](browser-handovers.log) |
| `CAFFOOT_BUILD_CA="$CODEX_PROXY_CERT" CAFFOOT_DOCKER_SMOKE=1 python3 -m unittest discover -s tests -p test_compose_lifecycle.py -v` | One passed; build, configurable port, restart/recreation and persistent data/TLS checks | [Docker lifecycle log](docker-lifecycle.log) |
| Existing `.github/workflows/release-documentation.yml` Python check, executed locally unchanged | Passed | [Documentation check](documentation-check.log) |
| `node --check interface/stock-intake.js`, `node --check interface/application.js`, `node --check tests/stock-correction-interface.cjs`, `git diff --check` | Passed | Run before evidence completion |

The full local suite's skips are the opt-in Docker lifecycle check (separately
passed above), two genuine private v1.3.3 export checks and the opt-in complete
volume upgrade/restore check. The latter three remain existing private-data /
Stage 6 acceptance work, not newly skipped correction tests.

Intermediate checks exposed and corrected the new form's shared allowlist
integration and theme-redraw draft preservation. The first Docker build failed
because this environment's proxy certificate was not trusted; the existing
private build certificate option resolved it. An intermediate colour assertion
measured the hover colour instead of the primary colour. The browser test now
moves the pointer away before measuring; the final journey passed. No unresolved
local functional or browser failure remains.

## GitHub Actions

At checkpoint `66bc4d4bb4a15ea3431b3f5af881b52ce6167b32`, backend (940 tests, four skips),
Docker lifecycle, documentation, secret scan and release preflight passed.
The [browser run](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43904472792)
failed on that same hover-colour assertion; its Firefox and WebKit jobs passed.
The pointer correction is in the captured runtime's test runner and the complete
local browser journey passed afterwards. The existing browser workflow now runs
and uploads correction evidence.

Final-head Actions status and run links are maintained in the
[draft PR description](https://github.com/Caffoot/Caffoot-Lite/pull/392).
Do not apply an earlier checkpoint's result to a newer head. The workflow named
Publish Caffoot Lite runs its existing read-only PR preflight; no publication,
release or deployment was requested or performed.

## Visual Inspection

All captures come from the authenticated application, its real TLS server and
SQLite-backed fictional fixtures. Desktop is 1440 × 1050 and mobile is a
390 × 844 responsive viewport, each in light and dark themes. Full-page and
complete element captures preserve form boundaries and bottom actions. They are
not reconstructed previews. The mobile Movement History captures scroll the
existing table to its Actions columns; the complete desktop view shows all columns.

Agent inspection checked card/field spacing, headings and label alignment,
readable reasons and correction history, orange primary/secondary actions,
whole-form action placement, balance text, blocked explanations and both themes.
The browser also exercised labelled fields, required reasons, live validation,
focus return and the existing keyboard-safe discard dialog. Unsaved changes,
Cancel, Escape, shared My Account navigation, theme redraw, stale saves and read-only presentation were checked. A rejected stale save clears the allowed result and disables Save until a fresh validation succeeds.
This is engineering visual review, not product-owner visual acceptance.

| State | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Movement History And Actions | [View](movement-history-light-1440.png) | [View](movement-history-dark-1440.png) | [View](movement-history-light-390.png) | [View](movement-history-dark-390.png) |
| Selected Original Details | [View](selected-original-details-light-1440.png) | [View](selected-original-details-dark-1440.png) | [View](selected-original-details-light-390.png) | [View](selected-original-details-dark-390.png) |
| Complete Form And Bottom Actions | [View](complete-correction-form-light-1440.png) | [View](complete-correction-form-dark-1440.png) | [View](complete-correction-form-light-390.png) | [View](complete-correction-form-dark-390.png) |
| Valid Calculated Impact | [View](valid-stock-impact-light-1440.png) | [View](valid-stock-impact-dark-1440.png) | [View](valid-stock-impact-light-390.png) | [View](valid-stock-impact-dark-390.png) |
| Blocked Correction And Reason | [View](blocked-correction-light-1440.png) | [View](blocked-correction-dark-1440.png) | [View](blocked-correction-light-390.png) | [View](blocked-correction-dark-390.png) |
| Saved Correction And History | [View](saved-correction-history-light-1440.png) | [View](saved-correction-history-dark-1440.png) | [View](saved-correction-history-light-390.png) | [View](saved-correction-history-dark-390.png) |
| Read-Only History | [View](read-only-history-light-1440.png) | [View](read-only-history-dark-1440.png) | [View](read-only-history-light-390.png) | [View](read-only-history-dark-390.png) |

## Exact Changed Files And Purpose

Paths below are relative to the repository root. The screenshot table above names
all 28 PNGs under `docs/development-handovers/evidence/stock-corrections/`.

| File | Purpose |
| --- | --- |
| `backend/stock_corrections.py` | Shared protected context, read-only replay/preview and atomic immutable correction save |
| `backend/server.py` | Existing session/Origin/CSRF/permission protected correction routes |
| `backend/stock_circulation.py` | Original/effective issue quantities and attributed correction history projections |
| `interface/stock-intake.js` | Movement selection, original details, correction form/preview/history and safe draft handling |
| `interface/application.js` | Existing three shared form permission filters and original unsaved snapshot support |
| `interface/styles/stock.css` | Existing form styling, readable reason/history, responsive impact and movement table widths |
| `tests/test_stock_corrections.py` | 27 focused functional, database, HTTP/security, permission, concurrency and rollback tests |
| `tests/stock-correction-interface.cjs` | Real browser workflow, permissions, unsaved fields and visual capture evidence |
| `.github/workflows/browser-compat.yml` | Adds correction journey and artifact upload to existing browser checks |
| `docs/development-guide/IT-Assets-Correct-Movement.md` | Tested API, transaction, replay, identity, version and permission contract |
| `docs/development-guide/Function-Index.md` | Regenerated changed sections and refreshed declaration links; 1007 definitions |
| `docs/development-guide/07-Function-and-Code-Reference.md` | Correction module navigation |
| `docs/development-guide/Development-Status.md` | Current unreleased Batch 3.11 checkpoint |
| `docs/development-guide/README.md` | Current checkpoint and correction references |
| `docs/development-handovers/milestone-01.md` | Active handover and remaining acceptance boundary |
| `docs/how-tos/features-and-instructions/v2.2-draft/IT-Assets-Correct-Movement.md` | Unreleased user workflow and blocked-change guidance |
| `docs/how-tos/features-and-instructions/v2.2-draft/README.md` | Draft guide index and version-accurate status |
| This directory's `Report.md` | Completion report, gallery, actual checks and review gates |
| This directory's `browser-results.json` | Source hashes, capture inventory and browser assertions |
| This directory's `screenshot-hashes.json` | SHA-256 of each genuine screenshot |
| This directory's `backend-focused.log`, `backend-full.log` | Exact local backend/HTTP test evidence |
| This directory's `browser-corrections.log`, `browser-circulation.log`, `browser-associations.log`, `browser-handovers.log` | Exact browser journey results |
| This directory's `docker-lifecycle.log`, `documentation-check.log` | Successful lifecycle and documentation verification |

## Remaining Review Gates And Limits

- Product-owner functional/visual review and explicit approval before any merge.
- Correction captures are Chromium responsive views; they do not claim physical
  mobile-device or correction-specific Firefox/WebKit manual acceptance.
- Existing private-data, native acceptance and complete Stage 6 upgrade/restore
  checks remain deferred as documented above.
- Individual equipment keeps quantity one; impossible changes to its identity
  are blocked. Quantity corrections cannot cancel or replace permanent Devices.
- Versions intentionally invalidate open forms after any stock publication,
  canonical Device revision, assignment or association change, including unrelated
  activity. Reload and re-preview are required.
- No main-branch change, merge, deployment, release, archive-preview modification,
  dashboard implementation or Batch 3.12 work is included.

## Return Equipment Integration

The [16 November owner decision](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6913521817)
is now implemented in this draft PR: Return Equipment opens the same correction
form for its selected original issue and retains entered return details. A saved
correction reloads authoritative quantities and versions before a return can be
submitted. Failed refreshes block submission; changed eligibility requires an
explicit valid selection. The existing approved screenshots above are preserved.

Development checkpoint: 29 focused backend/HTTP/database/security tests passed,
and the extended real browser journey passed with 16 new desktop/mobile light/dark
captures. Final regression checks, supplementary evidence and final-head Actions
are still being completed; this checkpoint is not final acceptance.

**Outstanding approved Stage 3 correction:** the final Issue Equipment confirmation
must show equipment identity, quantity and recipient, with a way back to edit
before saving. It remains unimplemented for a separate focused PR after Batch 3.11.
