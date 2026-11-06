# Issue #306 — correction batch

The [investigation plan](https://github.com/Caffoot/Caffoot-Lite/issues/306#issuecomment-6670166674) was explicitly approved in the owner's follow-up instruction on 6 November 2026. Starting local/fetched HEAD: `c648f7a526ea8a02435de46161a31365352ed867`.

## Implementation checkpoint

OS/version dropdowns reserve two label lines only in the existing two-column layout, with a `3em` fallback for `2lh`. Create Subnet has exactly 15px separation. Existing rack dimensions no longer receive implied 600mm defaults; valid legacy values display with their units and missing/invalid values show **Not Recorded**. No saved fields are rewritten by display. New-rack defaults remain 600/600. Import review explains how missing dimensions are entered explicitly.

Same-tab Rack Print / PDF is available only at `/inventory?rack-print=same-tab`. Normal Print / PDF retains its separate working print view. Both use the same generated document/template. The local frame stays outside the print-hidden application shell and remains after printing until the next trial or main-section navigation. Security headers and authenticated routes are unchanged. Remove the query parameter to use normal printing. **Do not make this trial the default before native Chromium and owner Safari acceptance.**

Finding 04 remains deferred. Pinned approved sources, backend/API/schema, permissions, Docker configuration, main and PR #281 are unchanged.

## Checkpoint checks

- Passed: 24 Add/Edit/Duplicate measurements, four widths (1440/1024/768/390), both themes. Dropdown baselines match within 1px whenever fields share a row; all measured subnet gaps are 15px. Full labels and stacked mobile layout remain.
- Passed: missing, modern, legacy, null-modern and invalid/empty-modern dimension display/edit/correction cases; new-rack defaults.
- Passed: default print call, identical generated trial HTML (excluding timestamp), two repeated trials without extra tabs, matching print-media geometry and navigation cleanup. Standalone A4/Letter PDFs generated; **these are not native trial PDF acceptance**.
- Passed: 20 existing modular/import-review tests; approved HTML contract; JavaScript syntax and diff checks. No browser errors or persistent inventory/history changes in the comparison run.
- A trial failure found that framing within the shell yielded zero-sized print geometry. Moving it outside the shell fixed the measured discrepancy; the passing evidence is the corrected run.

[Measurements](checkpoint.json) and [desktop form capture](images/software-1024.png) preserve this checkpoint. Rendered desktop review confirms the full wrapped label and aligned controls. Functional save/reload, subnet return and final regression checks are still pending at this checkpoint. Native print-dialogue, Cancel and Save PDF remain unverified: this environment has headless Chromium, no graphical display/desktop automation or Safari. These limitations must remain explicit in the final handover.


## Functional and enlarged-text checks

The focused action run passed built-in Windows/11 and custom platform/version saving and reload, Create Subnet navigation/Cancel with the unsaved device name intact, ordinary rack identity editing without inventing dimensions, invalid dimension rejection, protected correction cancellation and confirmed 750/1000mm persistence after reload. Import preview showed the notice; Cancel left inventory/history unchanged. No browser errors were recorded.

Enlarging labels to 18px exposed a third wrapped line beyond the two-line minimum. The two fields now share a label row where CSS subgrid is supported, with controls grouped underneath; the original control gaps and stacked mobile layout remain. The agreed two-line minimum remains the fallback. Enlarged-label alignment/readability checks pass at 1440/768/390px. This is a text-size test, not a claim of physical browser zoom or Safari testing.

All four GitHub checks passed at implementation checkpoint `ef1a77e59a94b6c5801f527d2c0859bcec23baf5`: [backend](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42167540412), [Chromium](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42167540251), [Docker lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42167540226), [history secrets](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42167540233). The enlarged-text HTML/CSS refinement is newer and its final checks must be recorded separately.

## Final verification

The completed application is pushed at **`b1959014fdf65c9b4c3c9e20d4fff3fd75f9889d`**. The final delivery commit adds evidence/documentation only; [runtime checksums](manifest.json) identify the tested application files.

| Finding | Result |
| --- | --- |
| 01 — OS dropdowns | Passed all 24 normal-size Add/Edit/Duplicate cases and the three enlarged-label widths. Both columns align; normal-size control positions are identical to the first correction checkpoint at all four widths. Mobile remains stacked. Full labels, built-in/custom choices and save/reload pass. |
| 02 — Create Subnet | Exactly 15px above the button in all 24 cases. Existing navigation and Cancel restore the unsaved device draft. |
| 03 — Print trial | Implemented opt-in, with the existing default/fallback retained. Generated HTML is identical apart from its timestamp. Print-media geometry matches the standalone document for 6U, 42U and 48U, including front/rear, multi-U equipment, horizontal accessories and 0U rails. Repeated trials open no extra tabs; simulated afterprint preserves rack/tab/face, window/rack scroll and focus. Main-section navigation cleans up the frame. Native acceptance remains outstanding. |
| 04 — Secondary tabs | Deferred and unchanged. |
| 05 — Dimensions | Missing existing-rack values stay blank/Not Recorded; valid legacy values display without rewriting records. Modern values take precedence; null modern values can use legacy fields, while empty/invalid modern values are not silently replaced. Ordinary Edit does not backfill. Protected correction rejects invalid input, preserves data on Cancel and persists explicitly confirmed dimensions. Import notice/Cancel and five exact import/SQLite round trips pass. |

[Final measurements](final.json), [functional actions](actions.json), [mobile subnet guidance](images/subnet-guidance-dark-390.png), [desktop software fields](images/software-light-1024.png), [mobile software fields](images/software-dark-390.png) and [rack dimensions](images/rack-missing-light-1440.png) preserve the results. Rendered review confirms readable labels/aligned desktop controls, stacked mobile fields, separated guidance/button and truthful dimension labels. Sample inventory and conditional fields differ from the approved demonstration data; no further material mismatch was found in the exercised correction states. This is not full owner visual acceptance.

All four GitHub checks passed on the final application checkpoint:

- [Backend](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42168278440): **423 tests, 420 passed, 3 skipped**. Skips are the opt-in Compose test and two genuine-private-export tests; Compose was exercised separately below.
- [Chromium regression](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42168278450): passed the complete existing run, including authentication, editing permissions, rack behaviour, default print document and published-format import/Cancel/confirmation.
- [Compose lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42168278455): **1 test passed**, including Docker build, configurable port, persistent TLS/database after restart and recreation.
- [Git history secret scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42168278444): passed.

Local final checks: **21 modular/import-review tests passed**, approved HTML contract passed, JavaScript syntax/diff checks passed, 429 JavaScript function-index links verified and release preparation agreed with the unchanged published v2.0.3 metadata. Staged secret scans passed before both implementation commits. Previous upgrade evidence is reused; no backend, schema or Docker change required a new manual upgrade run.

Six **standalone baseline** PDFs contain front/rear content and no toolbar: 6U A4/Letter two pages each, 42U A4/Letter two pages each, 48U A4 three pages and Letter four pages. See [PDF records/checksums](manifest.json) and `print/`. These preserve the existing pagination; they are **not PDFs saved from the trial's native dialogue**.

Reproduce the focused checks with the existing tools:

```sh
NODE_PATH=/workspace/.caffoot-tools/node_modules CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_ISSUE306=1 CAFFOOT_ISSUE306_ACTIONS=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/issue-306/recheck node tests/approved-visual.cjs
python3 -m unittest tests.test_modular_interface tests.test_import_review -v
node tests/approved-html-contract.cjs
```

### Remaining acceptance and limitations

- **Native Chromium and owner Safari Print, Cancel and Save PDF are unverified.** There is no graphical display/desktop automation or Safari in this environment. Headless PDF generation and simulated afterprint events cannot establish native behaviour. Check output, filename/title, colours, margins, A4/Letter pagination, repeated printing and cancellation returning to the same rack/tab/face/scroll/focus before considering any default change.
- Same-tab trial: open `/inventory?rack-print=same-tab` and use the existing Print / PDF button. Remove that query parameter to return to normal printing. A trial exception reports how to use the fallback; there is no automatic switch of the default.
- Safari desktop/mobile theme and layout review remains with the owner. CSS subgrid shares labels when enlarged text exceeds two lines; browsers without it retain the approved two-line fallback, which does not synchronise labels beyond two lines. Physical browser zoom and older-browser text expansion were not verified.
- The owner's original imported rack object and a genuine private v1.3.3 export were unavailable. Synthetic cases confirm preservation, but do not identify the exact cause of that original observation.
- No private owner image was built/exported here. No merge, image publication or release occurred. Pinned approved sources, backend/API/schema, authentication/security rules, Docker configuration, main and PR #281 remain unchanged.

## Update the private Docker test installation

1. Back up the **existing private test** data/volume first. Keep its project/stack name, volume mapping, browser address, port and environment settings unchanged. Leave the existing production installation alone; do not remove any volume.
2. In a clean development checkout, fetch and fast-forward `feat/approved-modular-html-282`. Compare `git rev-parse HEAD` with the exact final SHA reported in the issue/handover before building. Stop if they differ or the checkout is dirty.
3. Run the existing build process locally:

   ```sh
   python3 scripts/build_private_acceptance.py --save ../caffoot-lite-private-acceptance.tar
   ```

   It prints the exact revision and local tag `caffoot-lite:private-<first 12 SHA characters>`, verifies the image revision label and does not publish it. Add the existing `--build-ca` option only if your own build proxy needs it. On another private test Docker host, load your privately transferred archive with `docker load --input caffoot-lite-private-acceptance.tar`.
4. In the **existing private test stack**, set the `caffoot-lite` service's image to that local tag. For Compose, a local override can contain:

   ```yaml
   services:
     caffoot-lite:
       image: caffoot-lite:private-<first 12 SHA characters>
   ```

   From that stack's existing directory, using its existing project name/environment and volume mapping, run:

   ```sh
   docker compose -p YOUR_EXISTING_PRIVATE_TEST_PROJECT -f compose.yaml -f acceptance-image.yaml up -d --no-build --no-deps caffoot-lite
   ```

   Replace the example project name and tag; `acceptance-image.yaml` is the local override above. In Portainer, update only the private test stack's image and keep its volume/environment settings. Use the locally built image rather than pulling a registry tag. Do not run `down -v`.
5. Confirm the container is healthy, sign in using the existing private-test MFA/account and review findings 01/02/05 in both themes and widths. Test normal printing first, then the explicit same-tab trial in Chromium and Safari. Retain the previous local image tag for rollback of this private test stack.
