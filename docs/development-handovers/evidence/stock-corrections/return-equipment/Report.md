# Return Equipment And Correct Movement — Final Review Evidence

[Draft PR #392](https://github.com/Caffoot/Caffoot-Lite/pull/392) remains on
`feat/correct-stock-movement`, targeting `milestone-1`. The remote head was checked
before editing and matched the reviewed `c1bc8aec0f739667d2b5a8a1c60a881acb23f5f5`.
The [owner decision](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6913521817)
and the original #368/#352/#351 approvals define this addition.

## What Changed

**Correct Movement** now appears beside the selected original issue in the existing
Return Equipment card. It opens the existing correction form for that exact issue
entry. The return form and its original unsaved-change snapshot are retained,
including date, quantities, preparation checks, damage reason and note.

Cancel and Escape return to those entries. Navigation protects unsaved correction
and return entries separately; keeping either draft cancels navigation. Theme
redraws retain entered information. Failed context requests, blocked previews and
rejected saves keep the entries available for review.

A successful correction reloads the real server stock projection. The original
issue remains selected when eligible, using its latest outstanding quantity and
version. An entered quantity above the new balance remains visible and cannot be
submitted. An ineligible issue is deselected with an explanation, requiring an
explicit fresh selection even when other equipment is available. A failed reload
blocks return submission and correction reopening until **Reload Stock** succeeds;
the obsolete error clears after recovery. The return writer still validates every
quantity and version atomically.

No backend, ledger, schema, permission contract or stylesheet changed in this
review correction. The existing correction card layout, field proportions and
bottom-right orange Save Correction / secondary Cancel remain intact. The original
28 owner-approved screenshots are byte-identical.

## Actual Checks

| Check | Actual Result | Evidence |
| --- | --- | --- |
| `python3 -m unittest discover -s tests -p test_stock_corrections.py -v` | 29 passed | [Focused backend/security log](backend-focused.log) |
| `python3 -m unittest discover -s tests -v` | 942 run: 938 passed, four existing skips, no failures | [Full backend log](backend-final.log) |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_RETURN_CORRECTION_CAPTURE=1 node tests/stock-correction-interface.cjs` with an isolated output directory | Passed; 16 genuine captures; no page errors or checked page overflow | [Correction and return journey](browser-final.log), [raw results](browser-results.json) |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/stock-circulation-interface.cjs` | Passed receipts/circulation, partial/mixed return, preparation, write-off and history journey | [Circulation log](circulation-final.log) |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/associated-equipment-interface.cjs` | Passed both association routes, permissions/privacy and missing quantity write-off | [Association log](associations-final.log) |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/device-handover-interface.cjs` | Passed Devices-only and registered custody, preparation, cancellation and privacy | [Handover log](handovers-final.log) |
| `CAFFOOT_BUILD_CA="$CODEX_PROXY_CERT" CAFFOOT_DOCKER_SMOKE=1 python3 -m unittest discover -s tests -p test_compose_lifecycle.py -v` | One passed at the development checkpoint; build, restart/recreation and persistent database/TLS | [Docker log](docker-final.log) |
| `python3 -m unittest discover -s tests -p test_modular_interface.py -v` | Two passed; all twelve pinned source stylesheets and template dependencies | [Source integrity log](source-integrity.log) |
| Existing release-documentation workflow's Python check, executed locally unchanged | Passed | [Documentation log](documentation-check.log) |
| Changed-document relative links/anchors, new/changed Function Index references, original screenshot bytes and protected backend/CSS/manifest checks | Passed | [Integrity log](integrity-final.log) |
| JavaScript syntax and `git diff --check` | Passed | Checked before both implementation checkpoints and evidence completion |

The browser tests exercise the selected entry, pristine and changed Cancel,
Escape/Keep Editing/discard, both dirty forms during navigation, account navigation,
before-unload protection, theme redraw, failed context, invalid chronological
preview, stale save, failed stock refresh, guarded submission, refreshed version
and quantity, a successful subsequent return, ineligibility with another available
issue, read-only/no-access users, independent stock-only editor access and feature
switches. Two added backend tests independently reject stale/excess returns after
correction and verify zero-outstanding eligibility without changing original facts.
Existing correction tests retain dependent movements and historical assignments.

The full suite's existing opt-in/private-data skips remain explicit in its log.
Docker lifecycle was run separately as above. No skipped private export or complete
Stage 6 upgrade/restore check is presented as passed.

## Genuine Screenshot Gallery

All sixteen captures use the actual authenticated HTTPS application with fictional
SQLite fixtures. Desktop is 1440 × 1050; mobile is a responsive 390 × 844 viewport.
Complete page/form captures include the bottom actions. The test simulates temporary
503 responses only for failure handling; the gallery shows real server-loaded
states. The refreshed-quantity state deliberately retains an excessive entered
return quantity to show that Record Return stays disabled.

| State | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Original Issue And Correct Movement Action | [View](return-original-issue-light-1440.png) | [View](return-original-issue-dark-1440.png) | [View](return-original-issue-light-390.png) | [View](return-original-issue-dark-390.png) |
| Existing Correction Form And Calculated Impact | [View](return-correction-impact-light-1440.png) | [View](return-correction-impact-dark-1440.png) | [View](return-correction-impact-light-390.png) | [View](return-correction-impact-dark-390.png) |
| Return With Refreshed Outstanding Quantity | [View](return-refreshed-quantity-light-1440.png) | [View](return-refreshed-quantity-dark-1440.png) | [View](return-refreshed-quantity-light-390.png) | [View](return-refreshed-quantity-dark-390.png) |
| Original Issue No Longer Eligible | [View](return-original-ineligible-light-1440.png) | [View](return-original-ineligible-dark-1440.png) | [View](return-original-ineligible-light-390.png) | [View](return-original-ineligible-dark-390.png) |

Agent inspection checked existing card/field spacing, both themes, mobile stacking,
the adjacent correction action, retained information, clear invalid-selection text,
absence of page overflow and the correction form's original bottom-right actions.
This supplements the original owner approval; final owner review remains separate.

## Source Provenance And Exact Modified Files

[Capture Manifest](Capture-Manifest.json) records screenshot hashes, dimensions and
all six runtime hashes. They match the committed runtime
`62165e42b3043f9ec23eb217ab5d76899ff52d64` exactly. The capture ran while the final
one-line refresh-message fix was pending above checkout `5eef602…`; the raw results
retain that checkout head. The manifest verifies the actual captured bytes against
the committed runtime. Later evidence changes do not change application code.

Changes below are relative to the reviewed `c1bc8aec…`, rather than the full
Batch 3.11 diff against `milestone-1`:

| File | Purpose |
| --- | --- |
| `interface/stock-intake.js` | Adjacent action, exact original entry, retained return form, refreshed values/eligibility, failure blocking and safe navigation |
| `interface/application.js` | Shared stock-form change comparison, including a retained form temporarily removed from the page |
| `tests/stock-correction-interface.cjs` | Focused real browser regression and sixteen changed-screen captures |
| `tests/test_stock_corrections.py` | Two focused tests for refreshed versions, quantity limits and ineligibility |
| `docs/development-guide/Function-Index.md` | Four new declarations, changed source references and accurate later application binding references; 1011 definitions |
| `docs/development-guide/07-Function-and-Code-Reference.md` | Navigation to return/correction functions |
| `docs/development-guide/IT-Assets-Correct-Movement.md` | Integration, draft retention, refresh/failure/permission contract and outstanding separate confirmation |
| `docs/development-guide/Development-Status.md` | Current review checkpoint and remaining separate work |
| `docs/development-handovers/milestone-01.md` | Active handover, evidence and outstanding approved requirement |
| `docs/how-tos/features-and-instructions/v2.2-draft/IT-Assets-Correct-Movement.md` | Return entry point and safe return after correction |
| `docs/how-tos/features-and-instructions/v2.2-draft/IT-Assets-Issue-Return-and-Write-Off.md` | Link from Return Equipment instructions |
| `docs/development-handovers/evidence/stock-corrections/Report.md` | Original evidence preserved with a link to this supplement |
| This directory | This report, sixteen gallery PNGs, raw browser results, capture manifest and ten verification logs |

## Final-Head Actions And Remaining Review

All six existing workflows are required on the final draft PR head. Exact run links
and conclusions are maintained in the [PR description](https://github.com/Caffoot/Caffoot-Lite/pull/392),
after verification; an earlier head's run does not certify a newer head. The
Publish Caffoot Lite workflow's PR check is read-only preflight; publication,
release and deployment are outside this task.

**Outstanding approved Stage 3 correction:** Issue Equipment must show a final
confirmation of equipment identity, quantity and recipient, with a way back to
correct details before saving. This remains unimplemented for a separate focused
PR after Batch 3.11. It is not marked complete.

PR #392 stays draft for independent code review and final owner approval. Captures
are Chromium responsive views; physical mobile/native Safari and the existing
private-data/Stage 6 checks remain separate acceptance work. There is no merge,
change to `main`, release, deployment or Batch 3.12 implementation.
