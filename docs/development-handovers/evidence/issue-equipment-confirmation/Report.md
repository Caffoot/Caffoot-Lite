# Issue Equipment Confirmation — Focused Review

Ordinary **Issue Equipment** now asks the operator to check the equipment,
quantity and actual Staff Member or Department name before saving. Individual
stock lists only the selected units, including serial numbers and asset tags
where recorded, or the permanent unit reference when both are absent.
**Back To Edit** restores the same form and every entered value; **Confirm Issue**
uses the existing authorised save. The confirmation uses established cards,
Title Case, orange primary actions and light/dark styling.

## Source And Review Boundary

- Base: verified `milestone-1` at `505ec1a60daccdfed4c2c36c9379a29ea6f5367d`.
- Branch: `feat/issue-equipment-confirmation`, targeting `milestone-1`.
- Authority: [16 November 2026 owner decision](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6913521817) and the separately authorised focused implementation request.
- Batches 3.10 / PR #391 and 3.11 / PR #392 are approved and merged.
  This is the final outstanding Stage 3 usability correction before Batch 3.12.
- Independent code review and explicit product-owner approval remain required.
  The PR stays draft and unmerged. Batch 3.12 has not started.

Schema 19, the backend, API, immutable history, stock validation, permissions,
MFA, CSRF and concurrency rules are unchanged. Add Equipment/association,
Device reassignment and the merged Correct Movement implementation retain
existing behaviour. No release, image publication or deployment is included.

## Focused Verification

**Ten existing Issue Equipment backend/HTTP tests passed** in the isolated local
run. [Actual test output](backend-results.txt) records the exact names and result.
They cover quantity/individual identities, selected Ready limits, narrow recipient
access, inactive/archived recipients, idempotent/stale requests, audit rollback,
read-only/MFA/feature denial, concurrent issue protection and session/CSRF routes.
They were selected individually from `StockCirculationTests` and
`StockCirculationHttpTests`; the full backend suite was not run locally.

**Eight focused browser regression groups passed** against real authenticated
HTTPS/SQLite with Chromium, with no page errors:

1. Invalid quantities are blocked; opening confirmation makes no write; another
   click on the original Issue Equipment button cannot confirm it; Back To Edit
   and theme changes retain every field and selection.
2. Rapid repeated clicks, another submit and a theme redraw while the real request
   is pending produce exactly one issue. Both confirmation actions are disabled.
3. Selected units, serial/asset tags, an anonymous unit's permanent identity and
   the actual Department name match the saved stock entries.
4. A deliberately invalid submitted quantity is still rejected by server
   validation, retaining the reviewed values without changing stock.
5. A simulated failed save retains inputs, shows its explanation without a
   success notification, and permits a revised, separately identified retry.
6. Another operator's intervening real issue causes a stale-version rejection,
   preserving stock and all entered details.
7. A lost response after a real committed save can be retried with the same
   operation identifier without issuing twice.
8. Read-only/no stock access, missing CSRF and disabled-feature requests remain
   forbidden, including retries of an already recorded operation.

[Actual browser results](browser-results.json) list the checks and captures.
The helper runs inside the existing circulation browser check. A focused local
run stops before unrelated return, preparation and write-off tests:

```sh
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium \
CAFFOOT_ISSUE_CONFIRMATION_ONLY=1 \
CAFFOOT_ISSUE_CONFIRMATION_CAPTURE=1 \
CAFFOOT_CIRCULATION_OUTPUT=/workspace/work/issue-confirmation/final-browser \
node tests/stock-circulation-interface.cjs
```

JavaScript syntax checks and `git diff --check` passed. The Function Index was
regenerated for all 66 stock declarations, adding `showStockIssueConfirmation`
and `editStockIssue`; its total is now 1,013 definitions. Local development used
focused checks only. Final-head CI results belong to the draft PR's existing six
Actions workflows; this report does not claim a CI pass from local results.
The browser workflow only adds the helper to its existing path filters; no
workflow or test job is created. Publication jobs remain gated off for PRs.

During test development, a multi-checkbox locator and an assumption about the
individual-issue projection were corrected in the harness. Genuine screenshot
review caught clipped long individual references on mobile; scoped wrapping and
a readability assertion now cover that case.

## Genuine Changed-Screen Captures

These eight captures come from the final focused browser run using fictional
data. Desktop viewport: 1440 × 1050; mobile viewport: 390 × 844. Captures show the
whole page. Assertions check page width, readable equipment identity text and
existing orange action styling. No previously approved gallery was regenerated
or changed. Screenshot review does not replace owner visual acceptance.

| Confirmation | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Quantity / Staff Member | [View](quantity-confirmation-light-1440.png) | [View](quantity-confirmation-dark-1440.png) | [View](quantity-confirmation-light-390.png) | [View](quantity-confirmation-dark-390.png) |
| Individual Units / Department | [View](individual-confirmation-light-1440.png) | [View](individual-confirmation-dark-1440.png) | [View](individual-confirmation-light-390.png) | [View](individual-confirmation-dark-390.png) |

[SHA-256 provenance](sha256.json) records both changed runtime files, both browser
test files and all eight screenshot bytes. The PR head identifies the committed
source and evidence. Deferred native/manual and Stage 6 acceptance remain
outside this correction.

## Exact Files Changed

- `.github/workflows/browser-compat.yml`
- `AGENTS.md`
- `docs/development-guide/07-Function-and-Code-Reference.md`
- `docs/development-guide/Development-Status.md`
- `docs/development-guide/Function-Index.md`
- `docs/development-guide/IT-Assets-Issue-Return-and-Write-Off.md`
- `docs/development-handovers/evidence/issue-equipment-confirmation/Report.md`
- `docs/development-handovers/evidence/issue-equipment-confirmation/backend-results.txt`
- `docs/development-handovers/evidence/issue-equipment-confirmation/browser-results.json`
- `docs/development-handovers/evidence/issue-equipment-confirmation/individual-confirmation-dark-1440.png`
- `docs/development-handovers/evidence/issue-equipment-confirmation/individual-confirmation-dark-390.png`
- `docs/development-handovers/evidence/issue-equipment-confirmation/individual-confirmation-light-1440.png`
- `docs/development-handovers/evidence/issue-equipment-confirmation/individual-confirmation-light-390.png`
- `docs/development-handovers/evidence/issue-equipment-confirmation/quantity-confirmation-dark-1440.png`
- `docs/development-handovers/evidence/issue-equipment-confirmation/quantity-confirmation-dark-390.png`
- `docs/development-handovers/evidence/issue-equipment-confirmation/quantity-confirmation-light-1440.png`
- `docs/development-handovers/evidence/issue-equipment-confirmation/quantity-confirmation-light-390.png`
- `docs/development-handovers/evidence/issue-equipment-confirmation/sha256.json`
- `docs/development-handovers/milestone-01.md`
- `docs/how-tos/features-and-instructions/v2.2-draft/IT-Assets-Issue-Return-and-Write-Off.md`
- `interface/stock-intake.js`
- `interface/styles/stock.css`
- `tests/stock-circulation-interface.cjs`
- `tests/stock-issue-confirmation.cjs`
