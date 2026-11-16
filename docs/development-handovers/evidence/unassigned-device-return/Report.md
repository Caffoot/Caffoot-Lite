# Unassigned Device Return Correction

Unreleased v2.2 follow-up in draft [PR #389](https://github.com/Caffoot/Caffoot-Lite/pull/389),
branch `feat/it-assets-issue-return-writeoff`, starting from verified
`f4ac367984b68f81eb9566d7d8d057b6a26bc5fb`. Integration remains
`7f91f5d42feb3916cfab060abd5ca4b1558a92ba`; main remains
`3d66c3ee6fd9d9c51ecbdd5822bc1c4fe98b8e7b`.

## Final Local Review Position — 16 November 2026

The approved correction is implemented for review. Runtime/capture source:
`80b49fa3ae83ab93f137f432fa3aed52521842b5`. The later evidence commit changes no
runtime. **Changed-screen owner acceptance and merge approval remain pending.**
The original 52 owner-approved captures and all previous checkpoint commits remain.

| Check | Actual Result |
| --- | --- |
| Focused backend, existing circulation, assignment and closure tests | **73 passed**; [log](backend-focused.log) |
| Full local backend at `aa1f526` | **803 run: 799 passed, four skipped**, 140.934 s; [log](backend-final.log). Backend files are byte-identical in the final runtime. |
| New real HTTPS/SQLite browser flow at `80b49fa` | **Passed, 16 genuine captures**, no page errors or document overflow; [log](browser-final.log), [results](browser-results.json) |
| Existing real circulation browser regression | **Passed** during integration without replacement screenshots; [log](circulation-regression.log). Final CI reruns it with the existing browser suite. |
| Documentation/source checks | [Actual check output](documentation-check.log); local paths/anchors/images, 945 Function Index declarations, eight unchanged compatibility pairs, screenshot hashes/dimensions, syntax and `git diff --check` |
| Final GitHub Actions, including Docker | Current final-head results are recorded in [PR #389](https://github.com/Caffoot/Caffoot-Lite/pull/389); no local Docker rebuild was repeated. |

The four backend skips are the opt-in Docker test (covered separately by CI), two
unavailable private genuine v1.3.3 exports and Stage 6 complete-volume restore.
Native Raspberry Pi/Safari acceptance, genuine legacy-export acceptance and Stage 6
remain deferred. No release, deployment, production upgrade/restore, new stock
workflow or Batch 3.9 work is claimed. External links were not comprehensively
crawled; the two authoritative approvals were fetched directly before implementation.

[Source checks](Source-Checks.json) pin the four changed runtime files and verify
Schema 17, stock tables/triggers, roles/MFA/session/feature checks, screen fragments,
all styles, installation files and published v2.1 documents against the reviewed
baseline. The new journal/audit confirmation records physical possession, not an
invented original issue, holder or receipt. Status/IP/Rack/Location and all existing
Device/security/assignment records are preserved by focused and browser assertions.

## Changed-Screen Gallery — Awaiting Owner Visual Acceptance

All images are raw running-application captures with fictional data. Device Details
uses 1440 × 1050 / 390 × 844 viewport captures; the Return form and Movement History
use full-page captures at those widths. [The manifest](Capture-Manifest.json) records
actual dimensions and hashes. Wide tables/tabs retain existing horizontal scrolling.

| View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Unassigned Device Details: Existing Return Action | [Light 1440](screenshots/device-details-unassigned-light-1440.png) | [Dark 1440](screenshots/device-details-unassigned-dark-1440.png) | [Light 390](screenshots/device-details-unassigned-light-390.png) | [Dark 390](screenshots/device-details-unassigned-dark-390.png) |
| Preselected Device And Explicit Record Return Declaration | [Light 1440](screenshots/return-unassigned-device-light-1440.png) | [Dark 1440](screenshots/return-unassigned-device-dark-1440.png) | [Light 390](screenshots/return-unassigned-device-light-390.png) | [Dark 390](screenshots/return-unassigned-device-dark-390.png) |
| Device Details: Genuine Return With No Invented Assignment | [Light 1440](screenshots/device-details-return-recorded-light-1440.png) | [Dark 1440](screenshots/device-details-return-recorded-dark-1440.png) | [Light 390](screenshots/device-details-return-recorded-light-390.png) | [Dark 390](screenshots/device-details-return-recorded-dark-390.png) |
| Movement Details: Physical Confirmation Provenance | [Light 1440](screenshots/physical-return-provenance-light-1440.png) | [Dark 1440](screenshots/physical-return-provenance-dark-1440.png) | [Light 390](screenshots/physical-return-provenance-light-390.png) | [Dark 390](screenshots/physical-return-provenance-dark-390.png) |

Representative light/dark desktop/mobile views were visually inspected against the
existing Device Details table/action/modal conventions and the earlier approved
Return Equipment form. No shared style or screen-fragment change was required.
This is implementation review, not owner acceptance or a pixel-match claim. All
16 images are provided for separate owner review; no generated mock-ups or edited
screenshots replace actual captures. The earlier approved 52-image set is unchanged.

## Preserved Correction Checkpoints

| Checkpoint | Pushed Commit | Actual Checks |
| --- | --- | --- |
| Protected backend | `105e89a79ee1c6ac13be39e979d9749f1e43ecd0` | 73 focused tests passed |
| Existing-form integration | `aa1f526e7cc7e430b2e5126caef4bee8cafd8691` | Both real focused browser flows passed; full local backend passed |
| History presentation | `80b49fa3ae83ab93f137f432fa3aed52521842b5` | Focused browser passed; 16 refreshed committed-source captures passed |
| Final documentation/evidence | Commit containing this report | Documentation checks; final PR Actions recorded separately |

The sections below retain their then-current checkpoint results and limitations.

## Approval And Scope

The [PR approval](https://github.com/Caffoot/Caffoot-Lite/pull/389#issuecomment-6907931718)
and [issue approval](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6907932153)
authorise an existing Device Details entry point, explicit physical-return
confirmation and a protected direct Device return. The earlier 52 genuine
screenshots are owner-approved and retained. Changed screens need separate review.
No new selection screen, Place In Stock workflow or Schema 17 change is authorised.

## Backend Checkpoint — 16 November 2026

The new `deviceId` alternative requires affirmative physical confirmation and both
Edit permissions. It records one canonical Device Awaiting Preparation, preserving
its operational configuration and all original assignments. There is no inferred
issue, recipient, receipt, quantity or immediate readiness. Existing issue/assignment
routes remain unchanged. Invalid histories, virtual/assigned/held/written-off Devices,
stale/replayed changes, future dates and incompatible dispositions are rejected.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_unassigned_device_returns test_stock_circulation test_device_assignments test_assignment_closure -v
```

**73 tests passed:** [actual log](backend-focused.log). Checks include canonical
record/security preservation, original completed assignments after upgrade, optional
empty-link reuse, edit reservations, rollback, concurrent processing, feature-off,
role/override/MFA/session checks, HTTP Origin/CSRF and the existing closure safeguards.
One new fixture initially violated the existing 32-character stock-unit ID rule;
its ID was corrected. No application constraint was weakened.

This checkpoint does not claim interface, browser, Docker or full-suite completion.
Those checks and changed-screen captures follow the interface integration. No merge,
release, deployment, native hardware or changes to main have occurred.

## Interface Checkpoint

The existing Device Details Return Equipment action now opens the same form with
an eligible unassigned Device preselected and fixed to one. A visible declaration
above Record Return makes submission the affirmative physical-possession confirmation.
Opening the form sends no confirmation. The new path records Awaiting Preparation
only; existing assigned/quantity return controls are retained. Movement Details
shows genuine confirmation provenance, with no invented holder or issue.

```sh
NODE_PATH=/workspace/.caffoot-tools/node_modules CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_UNASSIGNED_RETURN_OUTPUT=/workspace/work/unassigned-return-browser node tests/unassigned-device-return-interface.cjs
NODE_PATH=/workspace/.caffoot-tools/node_modules CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_CIRCULATION_OUTPUT=/workspace/work/unassigned-return-circulation-regression node tests/stock-circulation-interface.cjs
```

Both real HTTPS/SQLite browser flows **passed**, without screenshots in these focused
runs. The first new browser harness mistook retained hidden modal content for an
open Device Details view; the harness now reopens through the real visible controls.
No application safeguard was changed to satisfy it. All 73 focused backend tests
also passed after integration. The new test is included in the existing browser CI,
with captures enabled and 14-day artifact retention.

Full final verification, committed-source genuine captures and changed-screen owner
acceptance remain pending. Existing approved images are retained unchanged.

## Visual Review Follow-up

The first genuine captures exposed an unstyled movement-history row in Device
Details. Only the new confirmed-return case now reuses the existing Device Details
`small-table` and horizontal-scroll presentation. Staff views and earlier Device
history variants retain their original rendering; no stylesheet or screen fragment
changed. Device Details captures use the actual viewport, while the Return form
and Movement History use full-page captures. The focused new browser flow passed
again: [log](browser-visual.log). Final images are refreshed after this checkpoint.

The full local backend suite at `aa1f526e7cc7e430b2e5126caef4bee8cafd8691` ran
**803 tests: 799 passed, four skipped**, 140.934 s: [log](backend-final.log).
The skips are opt-in Docker (checked by final CI), two unavailable private genuine
v1.3.3 exports, and the separate Stage 6 complete-volume restore rehearsal.
This visual follow-up changes no backend source. Final CI covers the delivered
revision; no skipped test is presented as passing.
