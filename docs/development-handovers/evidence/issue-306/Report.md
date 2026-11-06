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
