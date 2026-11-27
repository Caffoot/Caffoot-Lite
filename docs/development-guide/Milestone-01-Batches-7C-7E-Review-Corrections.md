# Milestone 01 — Batches 7C–7E Independent-Review Corrections

27 November 2026. Documentation-only response to the [independent review](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7217975857), starting from `ecb9ccef3aeec250d8211055e12f0e8f6e041ea6`. PR #472 remains draft. No capture, application process, fixture mutation, new dependency or runtime/regression test was undertaken for this correction.

The review verified the separate 7C/7D/7E commits, counts and original state IDs, and opened nine PNGs. It did not give full visual acceptance or repeat all original hash/static checks. This correction does not extend that independent review or grant owner acceptance.

## Capture-Time Playwright Evidence

**All 99 new images were recorded with Playwright 1.62.1.** Correct the three pack READMEs; retain the accurate new-image manifest values. The earlier 7B reuse remains Playwright 1.62.0, and RE07/RE08 retain their original metadata gaps.

Evidence, in order of relevance:

1. The committed [7C manifest](../how-tos/features-and-instructions/v2.2-draft/screenshots/batch-7c/manifest.json) records 41 new images at 1.62.1, [7D](../how-tos/features-and-instructions/v2.2-draft/screenshots/batch-7d/manifest.json) records 36, and [7E](../how-tos/features-and-instructions/v2.2-draft/screenshots/batch-7e/manifest.json) records 22. These are capture-time values, not a new version inferred from the current environment.
2. The retained, untracked original capture journal has 99 entries, all `Playwright 1.62.1`; its image hashes match the 99 committed new-image entries. Journal SHA-256: `b62eadc1c6271211c58b749779be48966b8e8aa6771d02854c77c956f61be634`.
3. The retained capture driver's SHA-256 is `74bc4bc96391a9f33aa95988bb8ad658cfcda33dae9c902e668ecce9a5a238bd`, exactly matching `captureDriverHashes.capture-common.cjs` already committed in the 7E manifest. Its collector reads `automation: 'Playwright ' + require('playwright/package.json').version` dynamically when each image is recorded. It does not hard-code 1.62.0 or 1.62.1.
4. A read-only probe of the installed Node package also reports 1.62.1. This is corroboration only, not a substitute for the capture-time records. No package was installed, changed or run as a browser in this correction.

The README prose and the prior PR summary were inaccurate. No cause for that prose error is inferred. Original image bytes, capture timestamps, hashes, browser versions and older reuse provenance are unchanged. The journal and driver remain untracked; this record preserves their non-secret evidence without publishing fixture credentials or databases.

## Corrected 7E Mapping Limits

All ten original groups, 52 owned states and the shared reference remain in [Coverage](../how-tos/features-and-instructions/v2.2-draft/screenshots/batch-7e/Coverage.md). The original requirement register is unchanged. Removing a false image association does not remove the requirement.

| State | Earlier inaccurate association | Current evidence and limit |
| --- | --- | --- |
| B3-E5-S02 — holder before/after list | Sarah's AST-LAP-015 list and former AST-LAP-014 ticket denial treated as a before/after illustration | The [7C Alex list](../how-tos/features-and-instructions/v2.2-draft/screenshots/batch-7c/alex-before-handover.png) is valid AST-LAP-014 employee **before** context only. The [same-Device Sarah history](../how-tos/features-and-instructions/v2.2-draft/screenshots/batch-7c/same-device-sarah-history.png) corroborates the saved custody change in an **IT** view. Neither supplies an employee after-list. Sarah's AST-LAP-015 remains a separately labelled current-equipment example under B3-E3-S02. |
| B3-E5-S03 — next equipment Details denied | `former-personal-ticket-unavailable.png` | The image shows **Ticket not found**, not equipment Details. Equipment Details denial remains an essential visual gap; its accepted written procedure remains. |
| B3-E4-S04 — custody-changed equipment unavailable | Written-only row without explicit essential-gap status | This is the same missing equipment Details view as B3-E5-S03, not another required capture. It is now explicitly marked pending rather than treated as routine written substitution. |
| B5-A8-S01 — person-to-Department paired views | Former personal-ticket denial treated as the pair | The denial follows ended AST-LAP-014 custody and retirement. It shows neither the person-to-Department event nor a matching Department outcome. Existing personal before context may be reused; the pair is incomplete. |
| B3-E5-S04 — former ticket history IT-only | Generic representative wording could imply both sides were pictured | The existing frame supports **employee-sided ticket denial only**. Authorised IT retention remains written/source evidence; the frame is not an IT historical-ticket screen. The separate accessory-history image keeps its own narrower subject. |

The 7E manifest removes the inaccurate state associations from the two affected image entries, retaining their captions, alt text and all capture provenance. The guide galleries now state these limits explicitly. No accepted procedural instruction has been removed or changed.

## Bounded Existing-Evidence Assessment

Prefer existing evidence where it actually matches; do not join different Devices or different events into a fictitious pair.

- Reuse the original Alex/AST-LAP-014 employee list as personal before context. The delivered saved personal-ticket list supplies SD-0001 before context. Both retain original timestamps, actor, source and pending acceptance.
- The existing Priya membership before/after lists genuinely compare the same unchanged Accounts printer across her Department change. Keep that pair; it is not a physical custody handover or a substitute for the missing person-to-Department pair.
- Sarah's current AST-LAP-015 list and 7D's AST-LAP-015 direct-handover result belong to their own Device. Neither is an AST-LAP-014 employee after-list.
- The delivered ticket denial, changed-equipment **Create Ticket** rejection and IT-only accessory history are genuine but different surfaces. None shows equipment **Details** rejecting access. Do not relabel any of them.
- The original image inventory and relevant historical My Equipment/Shared Devices/handover capture leads were checked narrowly. The opened [Stage 6.4 Sales list](../development-handovers/evidence/stage-6-4/screenshots/my-equipment-desktop-light.png) is a different fixture with Sales Laptop/Main Office Printer and an older layout. Its [provenance](../development-handovers/evidence/stage-6-4/README.md) does not establish the missing matched pair. The opened [earlier handover result](../development-handovers/evidence/associated-equipment-final/handovers/assigned-after-direct-handover-desktop-light.png) is an IT Assigned To view for Fictional Laptop/Other Staff, not an employee or Department after-view. The [employee Service Desk record](../development-handovers/evidence/employee-service-desk/README.md) describes schema-26 evidence, and the [Stage 6.6 Batch 2 record](../development-handovers/evidence/stage-6-6-batch-2/README.md) lists single-context My Equipment captures; neither listed set establishes the required matched outcome or equipment Details denial.

No suitable complete existing pair or equipment Details-denial frame was established by this bounded assessment. This is not an exhaustive new visual review of the historical inventory or all 99 delivered images. No historical image is newly certified current or promoted into the instructional pack.

## Essential Visual Gaps And Proposal

**Approval required; no captures undertaken.** The essential gaps are the matched employee holder after-list, actual equipment Details denial, and person-to-Department custody/ticket privacy pair. Accurate written instructions remain available, but no owner-approved visual substitution is assumed.

The following is a concrete replacement proposal for review, not permission to execute. It reuses genuine existing before frames and proposes only the missing views:

| Proposed view | Existing context to reuse | Necessary result and limits |
| --- | --- | --- |
| R1 — matched employee equipment after-list | Original Alex/AST-LAP-014 personal before-list | In a clearly labelled isolated fictional continuation of that preserved state, actually hand the same canonical Device from Alex to Accounts Department custody. Capture Alex's refreshed My Equipment list showing it under Shared with My Department, not Assigned to Me. Record the actual custody event and current membership; do not portray this new branch of the example as the already captured return/Sarah/retirement sequence. This supplies B3-E5-S02 and the custody context for B5-A8-S01. |
| R2 — actual equipment Details unavailable | Existing Priya Accounts-to-Sales membership pair for AST-PRN-01 | Preserve the genuine old equipment Details entry context, save the real membership loss in the isolated fixture and open Details again. Capture the application's actual equipment-unavailable response, without fabricated UI or network responses. This supplies B3-E5-S03 and B3-E4-S04 together; it is not a Ticket not found frame. |
| R3 — matched person-to-Department ticket privacy outcome | Original Alex SD-0001 saved personal-ticket list and R1's recorded same-Device Department custody | After that actual person-to-Department event, show the original personal-custody ticket unavailable to the employee despite current shared equipment eligibility; check the original ticket remains available to authorised IT. Capture the genuine employee ticket outcome, retaining the exact ticket/Device identity. This completes the ticket-specific B5-A8-S01 pair without reusing a denial captured after retirement as if it followed a different event. |

Possible **active illustration** replacements, subject to owner agreement, are R1 for the unrelated Sarah list and R2 for the earlier empty-software Details example in the four-slot My Equipment allocation, and R3 for the former-ticket denial in the four-slot custody/confidentiality allocation. Every original file would remain immutable historical evidence, with its original links, provenance and narrow illustrative uses; no original requirement or matching existing illustration may silently disappear. This is a proposed use change only, not a decision that historical files cease to count against a capture ceiling.

### Ceiling Decision Needed Before Execution

The delivered set is **99 new images**, of which **7E is 22/22**. Preserving all 99 and taking R1–R3 would create **102 cumulative new images**, including **25 cumulative 7E images**. Keeping an active set at 22 does not, by itself, satisfy the original cumulative capture ceilings. **This correction preserves the ceilings and does not authorise that plan to run.**

An owner decision must therefore precede any capture: either explicitly agree how genuine replacements are accounted for while retaining the original evidence, or approve particular written visual substitutions and a smaller capture plan that fits the ceilings. Under a literal cumulative maximum of 100, at most one additional capture could fit overall, and even that needs an approved 7E replacement-slot decision. The two remaining views would still need explicit visual-substitution decisions or remain outstanding. No increase, replacement accounting rule or waiver is silently proposed as already approved.

Stop at this documentation correction for independent review. Do not perform R1, R2 or R3, restart the application, change fixture custody, or take any new screenshots in this assignment. PR #472 remains draft; issue #366 stays open. Full visual/privacy/caption/alt inspection and separate owner acceptance remain outstanding. No 7F, 7G, 7H, Batch 8, application changes, new dependencies, broad regression, promotion, merge or publication.

## Correction Verification

Focused correction results are appended here after checking the affected documentation. Earlier pack verification records describe their original checkpoints and remain preserved; they do not establish the missing visual views above.

Focused checks passed for this correction:

- 11 documentation-only paths: ten Markdown files and the 7E JSON manifest; no application, schema, configuration, dependency, tracked test or image path changes.
- All 99 delivered new-image SHA-256 values recomputed against the original checkpoint manifests and original capture journal; original image set, captions, alt text, capture metadata, category counts and ceilings preserved.
- All 53 original 7E state ID/label rows remain in the same order, with the ten original group headings and unabridged contracts unchanged. The complete original Batch 7 requirement-register section is byte-identical to the starting checkpoint.
- All 221 original paragraphs in the two affected guides retained; only illustration-limit notes added. Unrelated accepted instructions and historical evidence remain unchanged.
- 734 relative destinations and 207 Markdown anchors resolve across the ten affected Markdown files. JSON parsing, remaining image-state limits, original reuse metadata, caption/alt consistency and Git whitespace checks pass.
- No runtime tests, application/browser process, new capture, dependency change, fixture change, broad regression or unrelated acceptance work. These checks do not close the essential visual gaps or confer independent/owner visual acceptance.
