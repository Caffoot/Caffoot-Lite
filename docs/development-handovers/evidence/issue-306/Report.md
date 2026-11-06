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
