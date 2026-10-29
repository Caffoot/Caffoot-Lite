# Caffoot Lite v1.3.0: WF-05 Rack Occupancy Regression Matrix

> **Issue #99, PR #158 verification checkpoint, 26 October 2026.** Draft PR #158 targets `release/v1.3.2`. Commit `0c83d59f5120b9bbc36fa0c308128d74be58f7bb` passed [focused Chromium regression 40310778637](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40310778637), including simulated accessory Add/Edit retry, move rollback and removal rollback with error feedback. Release validation 40310778526, documentation consistency 40310778444 and secret scan 40310778443 passed. Documentation evidence commit `3d42b63421cbd48eae3140da6b4d00df1ec63e1e` also passed all four workflows, including [Chromium 40311142262](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40311142262). Existing nested subnet and bulk IP return tests passed in Chromium run 40301918992; product owner manual acceptance is separately recorded in the workflow verification register. Backup help layout has visual acceptance only, not a dedicated open/Close/Escape interaction test. Wider common form consistency remains under review. These are v1.3.2 candidate findings, not changes to the published v1.3.1 baseline. Master audit and issue #99 remain open until remaining acceptance, cross-document reconciliation and approvals are complete. Nothing merged or released.


**Status:** Source-based test design. No scenarios in this document have been executed in a browser.
**Baseline:** Published v1.3.0 `app/caffoot-lite.html`, release tag `v1.3.0`. **Scope:** WF-05, with WF-02 import checks cross-referenced. **Change control:** Documentation only; no application changes authorised.

## Purpose and definitions

Verify that rack capacity and placement information is accurate and consistent across the Dashboard rack cards, Dashboard Network Insights, Rack Overview, individual Rack Inventory workspace, Reports screen, Racks CSV and printed elevation. Preserve intentional differences between **combined face utilisation** (front plus rear face capacity) and **maximum face occupancy** (the higher face occupancy divided by rack height). Numbered U capacity excludes vertically mounted accessories; their left and right rails still have separate placement and collision rules.

The current source uses several calculations rather than one shared rule. The test expectations below describe **desired correct behaviour**, not a claim that v1.3.0 currently passes. Capture actual behaviour and discrepancies for each screen. Use a disposable browser profile and fictional inventory only. Export and retain a safety backup before every import experiment.

## Source map

| Surface | Current source | Finding |
| --- | --- | --- |
| Dashboard rack cards | Approximately lines 2558–2577 | Sums device heights only, without face separation or accessories |
| Dashboard Network Insights | Approximately lines 2616–2633 | Unique occupied U and horizontal accessories, but uses `rackFace` instead of current `face` for devices |
| Reports screen and Racks CSV | `phase10DReportData()` lines 2305–2336; CSV lines 2343–2368 | Sums device spans per face, excludes accessories; maximum face percentage |
| Rack Overview | `renderRackHubV13()` lines 2878–2925 | Unique occupied U per face; excludes vertical accessories; `face` then `rackFace` fallback |
| Individual Rack Inventory | Approximately lines 2998–3008 | Sums device and horizontal accessory heights; can double count imported overlaps |
| Rack usage and printing | `phase13LUsage()` lines 2825–2839, `phase13LPrintRack()` lines 2850–2875 | Usage includes vertical accessory spans while printed numbered slots exclude them |
| Free placement options | `phase13LFreeRuns()` lines 2840–2849, `validateRackPlacement()` lines 1930–1963 | Uses placement validation rather than a reporting calculation |
| Accessory placement | `phase13CAccessoryError()` lines 7988–8003 | Separate horizontal and vertical rail collision checks |

## Regression scenarios

| ID | Fixture and action | Expected behaviour to verify | Surfaces / linked checks |
| --- | --- | --- | --- |
| R01 | Empty 12U rack | 0U occupied and 12U free on each face; no negative or missing values | All reporting surfaces |
| R02 | 2U device at front U1–U2 | Front 2U, rear 0U; correct free positions | All reporting surfaces |
| R03 | 2U device at rear U1–U2 | Rear 2U, front 0U; dashboard must not misattribute to front | Dashboard Insights, Rack Overview, workspace, report, CSV, print |
| R04 | Front 2U server and separate 1U patch panel | Front 3U; accessory included in numbered occupancy | All reporting surfaces |
| R05 | Front 2U server plus vertical PDU spanning U1–U12 on left rail | Front numbered occupancy remains 2U; vertical item is visible and counted as equipment | Rack Overview, workspace, print, dashboard, reports |
| R06 | Vertical PDU and vertical cable manager on opposite rails, overlapping heights | Permitted where rails are distinct; neither consumes numbered U | Accessory editor, rack workspace, capacity |
| R07 | Two vertical accessories overlap on the same rack face and rail | Placement is rejected with no partial save | Accessory editor, drag and drop, WF-02 T04/T05 |
| R08 | Horizontal accessory overlaps mounted device | Placement is rejected; existing saved inventory unchanged | Accessory editor, drag and drop, WF-02 T02/T03 |
| R09 | Horizontal accessory overlaps another horizontal accessory | Placement is rejected | Accessory editor, WF-02 T02 |
| R10 | Devices occupy the same U numbers on opposite faces | Face-specific reporting remains distinct and each face is valid | All reporting surfaces |
| R11 | Front 3U occupied and rear 5U occupied in 12U rack | Maximum-face percentage rounds 5/12; combined-face percentage rounds 8/24; labels distinguish definitions | Reports/CSV versus Rack Overview |
| R12 | Occupied U1–U3 and U7–U8 in 12U rack | 5U occupied, 7U free, largest contiguous free run is 4U (U9–U12) | Rack Overview and placement options |
| R13 | Import fictional records with two devices overlapping on same face | Import integrity validation should reject or explicitly flag conflict without destroying existing inventory; reporting must not double count | WF-02 T14, reporting |
| R14 | Import horizontal accessory overlapping a device | Import integrity validation should reject or flag; preserve existing inventory | WF-02 T02/T14, reporting |
| R15 | Import vertical accessory with missing rack, invalid face/side, or out-of-bounds span | Import integrity validation should reject or flag; preserve existing inventory | WF-02 T06–T10 |
| R16 | Import missing or malformed `rackAccessories` collection | Distinguish legacy absence from malformed present data; no silent loss of valid data | WF-02 T09–T11 |
| R17 | Change a device between front and rear, then save, reload and export | All read-only summaries reflect the new face consistently | Device edit, all reports, CSV, reload |
| R18 | Move, resize or delete a horizontal accessory | Occupied U and free runs update; failed saves restore the prior state | Accessory editor, workspace, reports, WF-02 rollback |
| R19 | Print rack containing horizontal and vertical accessories | Printed U slots and capacity summary agree; vertical accessories remain represented appropriately without consuming numbered U | Print/PDF |
| R20 | Malformed or out-of-bounds imported ranges | Integrity warnings or rejection; no misleading percentage above 100% or concealed corruption | WF-02 T07/T14, all reporting |

## Evidence capture and acceptance

For each test record: test ID, fixture and backup filename, browser/version, published HTML hash or release tag, actual results per surface, expected results, pass/fail, screenshots or exported CSV where appropriate, console errors, and whether existing inventory was preserved after rejection or failed save. Do not mark a test passed from source inspection alone.

**Acceptance questions:**
1. Are the same occupied numbered U positions counted exactly once on the same face across all surfaces?
2. Are vertical accessories excluded from numbered U but checked for rail collisions?
3. Are face-specific and combined/max-face percentages labelled and calculated consistently?
4. Are imports with malformed or overlapping placements safely rejected or explicitly flagged?
5. Do edits, failed saves, reloads, exports and printing preserve accurate, recoverable data?
6. Do updated function names, comments, documentation and regression tests match actual behaviour?

## Change control and follow-up

Link reporting fixes to **M-013**, import integrity checks to **M-010/M-019**, and naming/comment improvements to the Function Naming and Reference document and P11. The shared occupancy calculation is a proposal, not approved implementation. WF-01 to WF-04 source reviews and planned tests are not all browser signed off. No application code, merge, release or PR changes are authorised by this matrix.


## Evidence update, 23 October 2026

The original source-based matrix status is historical. A **targeted M-001 failed rack unassignment rollback browser scenario passed** in [Chromium run 39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113), following [PR #79](https://github.com/Caffoot/Caffoot-Lite/pull/79). That test does not establish that the imported rack collision, accessory placement or occupancy scenarios in this matrix were executed. M-010, M-013 and M-019 remain open for investigation or policy decisions. See [coverage register](WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md). No browser tests were executed for this documentation update.
