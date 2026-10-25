# WF-02 Imported Rack Inventory: Controlled Test Matrix

**Baseline:** Published Caffoot Lite v1.3.0, tag `v1.3.0`, commit `92d6a60b0e4bc9f73589b27820cb283def377dbd`.

**Status:** Source inspected. Test scenarios designed. No automated or browser tests have been executed for this matrix.

## Plain English purpose

Check that restoring an older or damaged backup cannot quietly introduce impossible rack placements or lose accessory information. The application already checks ordinary rack editor placements. This plan tests whether the same protection applies when inventory arrives through a backup.

## Safety and evidence rules

Use a disposable browser profile, a separate copy of the **published v1.3.0 standalone HTML**, and fictional data. First export a valid fictional backup from that release; make one controlled alteration per scenario. Keep the original backup unchanged. Record the exact fixture, browser version, source tag, current inventory, any confirmation or error, and exact `caffoot_state` and safety snapshot bytes before and after. Never run these destructive import experiments on genuine inventory. Record source inspection, test execution, browser verification and owner approval as separate gates.

## Baseline facts from published source

- `phase13CAccessoryError()` checks interactive horizontal accessory overlap with devices and accessories, and vertical 0U overlap on the same side rail and face.
- `validateRackPlacement()` checks interactive device overlap with devices and horizontal accessories.
- `phase20MigrateBackup()` clones the imported object, performs limited legacy mounting repairs and calls `normaliseState()`.
- `normaliseState()` retains `rackAccessories` when it is an array; otherwise it substitutes an empty array.
- `phase16CCheckBackup()` runs `validateApplicationState()` on the migrated candidate. The inspected validator does not iterate through `rackAccessories` or test physical rack overlaps.
- The restore handler makes a verified pre-restore safety snapshot and attempts verified rollback on persistence failure. These are source observations, not fresh runtime results.

## Browser scenarios

| ID | Controlled fictional backup modification | Behaviour to establish | Evidence |
| --- | --- | --- | --- |
| WF02-T01 | Unmodified valid backup containing a rack, a mounted device, a horizontal accessory and a vertical 0U accessory | Baseline import succeeds; all four records and placements survive | Before/after backup comparison, UI, stored bytes |
| WF02-T02 | Two horizontal accessories on the same rack face occupy an overlapping U range | Whether import rejects conflict or accepts impossible occupancy | Import message, records, rack view |
| WF02-T03 | Horizontal accessory overlaps a mounted device on the same face | Whether imported data gets the interactive placement safeguard | Error or success, positions, stored bytes |
| WF02-T04 | Two vertical accessories overlap on the same rack face and side rail | Whether side rail collision is rejected | Both side rail records, UI |
| WF02-T05 | Same height range on opposite rack faces, with otherwise valid placements | Ensure independent front and rear positions are not incorrectly rejected | Rack faces, import outcome |
| WF02-T06 | Same height range on different side rails of the same face | Ensure independent left and right rails are permitted | Rail view, records |
| WF02-T07 | Accessory references a nonexistent rack | Whether dangling accessory rack references are rejected | Error or success, retained inventory |
| WF02-T08 | Accessory starts below U1 or extends beyond rack height | Whether imported bounds are checked | Error or success, stored candidate |
| WF02-T09 | Accessory has invalid face or vertical side | Whether imported placement metadata is checked | Error or success, raw fields |
| WF02-T10 | `rackAccessories` property omitted from an otherwise valid legacy backup | Whether intended legacy compatibility supplies an empty collection without affecting other data | Import outcome, counts |
| WF02-T11 | `rackAccessories` present as an object or string instead of an array | Whether import silently substitutes an empty collection; decide future rejection policy | Exact input and resulting records |
| WF02-T12 | `rackAccessories` array contains a malformed entry, duplicate ID or unknown type | Whether records are rejected, preserved or rendered unsafely | Import outcome, console, stored bytes |
| WF02-T13 | Two mounted devices overlap on the same rack face | Whether general import integrity detects device collisions | Import outcome, rack view |
| WF02-T14 | Separately test a mounted device with a missing rack, inconsistent end U, or out of bounds height | Distinguish central checks for missing rack and U range arithmetic from any bounds enforcement; record acceptance or rejection of each independently | Error message, unchanged current inventory where rejected, exact stored bytes |
| WF02-T15 | Valid legacy mounting mismatch eligible for reviewed correction | Review screen explains changes; cancellation preserves current inventory | Review screenshots, unchanged storage |
| WF02-T16 | Valid candidate, but pre-restore safety snapshot write fails | Replacement blocked and current inventory preserved | Storage fault trace, error |
| WF02-T17 | Candidate save or readback fails after safety snapshot succeeds | Verified rollback attempted; current inventory retained | Snapshot, stored bytes, message |
| WF02-T18 | Candidate save fails and rollback cannot be verified | Recovery mode blocks further saves and exposes preservation guidance | Recovery banner, raw bytes, save attempt |

**Expected versus observed:** Do not mark a scenario passed merely because an unsafe import is accepted as the current code appears to permit. Record actual behaviour separately from the desired maintenance acceptance criterion. Where a malformed fixture triggers an earlier unrelated validation error, revise the fixture to isolate the intended question.

## Proposed maintenance acceptance criteria for M-019

A future improvement should validate every accessory's rack reference, type, face, side when applicable, integer height and position, rack bounds and physical collisions, using rules consistent with interactive placement. It should also check device against device and device against accessory occupancy during import and startup validation. Existing valid front and rear placements and independent side rails must remain valid. Missing optional legacy accessory collections require an explicit compatibility decision; **present but malformed collections must not be silently discarded**. Any invalid import should leave the active inventory unchanged and preserve existing snapshot and recovery safeguards. Do not automatically move or delete equipment to make an import pass.

## Execution register

| Test ID | Browser and date | Fixture revision | Observed outcome | Stored bytes preserved | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| WF02-T01 to WF02-T18 | Not run | Pending | Not observed | Not verified | Pending | Pending |

## Exit conditions

Agree acceptance criteria with the owner before implementing changes. Run source-level tests and browser tests against a disposable build and then the published standalone HTML. Record any differences between source and distributed application. No code changes, release or merge are authorised by this plan.

## Validation boundary reconciliation, 22 October 2026

The central `validateApplicationState()` in published HTML lines 1581–1599 checks a device's rack reference, mounting consistency and the arithmetic relationship between start U, height and end U. It does **not** itself explicitly check that the placement lies within rack height or that mounted devices and accessories do not overlap. Interactive rack placement functions perform additional checks, but imported data does not necessarily follow those same form pathways. Therefore WF02-T13 and WF02-T14 must separately establish what the import path accepts or rejects. Do not treat a matching end U calculation as proof that a position is within the rack.

This is source-derived test scope, not a browser execution result. No scenario status has changed.


## Evidence reconciliation, 23 October 2026

**The 18 specific imported rack scenarios above remain recorded as not executed.** The [published backup compatibility run 39961182872](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39961182872) exercised a representative populated v1.2.1 export imported into published v1.3.0, preserving core device, rack, subnet and location collections. It did **not** establish accessory collision rejection, malformed accessory handling, imported device overlap detection or the precise WF02-T01 accessory configuration. Do not mark WF02-T01 or WF02-T02 through WF02-T15 passed from that run.

The [targeted M-011 rollback run 39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469) demonstrated import rollback and protected recovery for its own injected conditions. It provides related WF02-T16 to WF02-T18 safeguard evidence but is **not** a recorded execution of these exact imported rack fixtures. Those test IDs remain pending until independently matched or executed.

M-010 and M-019 remain open import integrity investigations. The current [workflow verification coverage register](WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md), [WF-05 rack matrix](WF-05-RACK-OCCUPANCY-REGRESSION-MATRIX.md), [remediation programme](../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md) and [technical workflows](../workflows/TECHNICAL-WORKFLOWS.md) must retain this distinction. No browser tests were executed in this documentation reconciliation.

## Issue #93 agreed investigation boundary, 25 October 2026

Product owner approved investigation and test design, **not application behaviour changes**, following review of v1.2 and v1.2.1 compatibility concerns. Reuse the existing WF02-T01 to WF02-T18 cases rather than creating a parallel matrix. Preserve published backup import and restore protections, including pre-restore verified safety snapshots, cancellation, rollback, and recovery. Distinguish a legitimately absent legacy `rackAccessories` collection from a malformed present collection that might contain data. Preserve original records and never silently relocate, delete or rewrite rack equipment. The intended minimal change, subject to subsequent explicit implementation approval, is detection and clear review of inconsistent imported rack occupancy without making valid older backups impossible to restore.

**Evidence boundary:** Existing `app/test-rack-placement.cjs` tests interactive collision and bounds functions, not actual import. Existing `app/test-legacy-rack-location-migration.cjs` tests preservation and idempotence of one legacy rack-location migration, not full backup restore. Existing v1.2.1 to v1.3.0 published backup compatibility evidence does not cover all rack accessory and collision permutations. All 18 imported rack fixture scenarios remain planned and unexecuted as of this checkpoint. Source inspection only; no new tests run, no application code changed, no merge to `main` or publication. Next action: isolate actual import validation and legacy normalisation behaviours, then agree the smallest implementation and proportional tests.

## Issue #93 product owner decision, 25 October 2026

The product owner agreed the following **behavioural policy**, subject to a separate explicit implementation approval after reviewing the proposed code scope. Valid historical backups must remain compatible, including older backups without `rackAccessories`. On import, report identifiable device and accessory rack occupancy conflicts against the detached candidate before replacement. Offer an explicit review and acknowledgement path for historical occupancy conflicts where every original record and position can be preserved. Continue to prevent creation of new overlaps in normal editing. Reject structurally unsafe or uninterpretable records, including a present malformed accessory collection, without replacing current inventory. Never silently discard, move or rewrite imported rack records. Preserve the existing v1.2 and v1.2.1 migrations, confirmation, verified safety snapshot, cancellation, rollback and recovery safeguards. Distinguish overlap warnings from fatal errors; do not provide a general bypass of unrelated inventory validation failures.

**Next implementation design gate:** specify how warnings are returned from candidate validation, how acknowledgement integrates with the existing restore confirmation, and which existing fixtures verify preservation and cancellation. Do not change application code until the product owner approves that precise implementation. No new test execution or release approval is implied by this decision.

## Issue #93 published version history checkpoint, 25 October 2026

Source inspection of published `v1.0.0`, `v1.1.2`, `v1.2.1` and `v1.3.0` confirms both `validateRackPlacement()` and `phase13CAccessoryError()` already contained collision protection in the earliest sampled published version, `v1.0.0`. Each sampled release also had the central backup check, which did not itself enforce all physical rack overlap rules. This is **source inspection**, not an executed end-to-end test of every UI save pathway or every historical release. The product owner requested checking release history before designing any conflict resolution interface. Accordingly, **supersede the earlier proposed acknowledgement and interactive repositioning UI as unapproved implementation options**; neither should be built without a new decision. Prior decision history is retained above for traceability. Preferred next step is the smallest proportional import safeguard, considering the realistic externally edited or malformed backup case, with compatibility and data preservation first. Confirm whether the intermediate published tags also match, and cross-check existing tests, before seeking implementation approval. All 18 specific WF02 imported rack fixtures remain unexecuted; no application change authorised, no merge or release.

## Issue #93 complete published tag source survey, 25 October 2026

Completed source inspection across **all 11 published tags**: `v1.0.0`, `v1.0.1`, `v1.0.2`, `v1.0.3`, `V1.1.0`, `V1.1.0.1`, `v1.1.1`, `v1.1.2`, `v1.2.0`, `v1.2.1` and `v1.3.0`. In every tag, `validateRackPlacement()` contains device and horizontal accessory overlap checks, and `phase13CAccessoryError()` contains device and accessory collision checks. These are static source observations, not executed browser acceptance or proof that every save path invokes the functions. The normal editor's long-standing protection makes a new conflict repositioning UI disproportionate without contrary evidence. Imported malformed JSON remains a separate entry point requiring narrowly scoped assessment. Keep the 18 existing import scenarios as planned until matched to real executed evidence; do not treat historical source inspection as their completion. Do not implement any behaviour change without explicit approval.

## Issue #93 automated verification checkpoint, 25 October 2026

Draft PR #137 at commit `43f90c00dd8b5594db31768f84b0a419c11f59af` has four successful GitHub Actions runs: [release candidate validation](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40214913142), [consolidated Chromium regression](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40214913195), [documentation consistency](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40214913164), and [secret scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40214913180). The release candidate workflow executed `app/test-imported-rack-integrity.cjs` through the existing rack check command, alongside the existing backup contract, backup security and restore checks. The focused tests cover representative overlap, bounds, accessory type, face and rail cases. These results supersede failed interim runs on earlier PR revisions, which exposed and led to fixes for legacy missing accessory collections and isolated backup test dependencies.

The WF02-T01 to WF02-T18 browser fixture execution register above remains **not executed**: the passing consolidated Chromium suite and Node checks do not establish that every named controlled import scenario was run with stored-byte evidence. Manual browser acceptance, full document cross-reference reconciliation and owner merge approval remain outstanding. The master audit must not be marked closed on the strength of these CI results alone. No merge or release has occurred.

## Issue #93 focused browser acceptance disposition, 25 October 2026

Review of the existing 18 scenario descriptions against successful PR #137 automated evidence at `fb317472` identifies a smaller manual acceptance set rather than re-running the entire historical matrix. The automated rack validator assertions exercise core collisions, bounds, faces, rails, type and duplicate ID cases. Existing backup contract and restore checks exercise separate migration and failure paths, but not all named browser fixtures. Preserve the original WF02-T01 to WF02-T18 register as **not individually executed**.

**Proposed minimum new disposable-browser evidence, not yet executed:**

1. **WF02-T01 and WF02-T10:** Import a valid fictional backup containing rack accessories, then a compatible legacy backup with `rackAccessories` absent. Verify records survive and the current inventory changes only on confirmed import.
2. **WF02-T03 and WF02-T13:** Attempt a fictional same-face accessory/device collision and a device/device collision. Confirm both imports are rejected, the error is understandable, and the active inventory and safety snapshot bytes are unchanged.
3. **WF02-T11 and WF02-T12:** Attempt an explicitly malformed accessory collection and an invalid accessory record. Confirm rejection without silently dropping accessories or replacing active inventory.
4. **WF02-T05 and WF02-T06:** Confirm valid opposite-face placement and independent left/right vertical rails import without false collision warnings.

Other individual scenarios retain pending fixture status and may be explicitly dispositioned using matching automated evidence or deferred with a reason during owner acceptance. Existing rollback and recovery tests should not be repeated without a demonstrated coverage gap. Use fictional inventory in a disposable browser profile; do not test destructive imports against real data. No manual test result is asserted here, and no merge or release is authorised.
