# Stage 4 Batch 4.3 — approved additions-only UI review

**Status:** Product-owner design approval **only** for the proposals identified below. This evidence folder is not application implementation evidence and does not assert that any new Supplier controls have been coded, tested or accepted in the live application.

## Source and provenance

- Approved interaction review: [`approved-ui-additions-review.html`](approved-ui-additions-review.html), archived unchanged from the 18 November 2026 review that the product owner accepted (“mate they are great :)”). The HTML contains **fictional example records** and interactive, non-persistent UI demonstrations. It is **not** approved to replace existing forms/screens or to supply actual-app acceptance screenshots.
- Detailed UI decision and owner visual acceptance: [Stage 4 Batch 4.3 issue #412, approval record](https://github.com/Caffoot/Caffoot-Lite/issues/412#issuecomment-6975660928).
- Separate explicit development authorisation: [#412, implementation authorisation record](https://github.com/Caffoot/Caffoot-Lite/issues/412#issuecomment-6975760456).
- Canonical functional specification and later owner decisions: [issue #412](https://github.com/Caffoot/Caffoot-Lite/issues/412); Stage 4 master [#369](https://github.com/Caffoot/Caffoot-Lite/issues/369).
- Application integration baseline at the start of Batch 4.3: `milestone-1` merge `3165457b8c8f824da3e6156f4bf3ce276d7905cd` (Batch 4.2 PR #415).

## Approved additions (not replacements)

1. **Device Add/Edit:** optional combined Supplier control in the existing opening **Device Identity** card; appropriate return from full authorised Add Supplier, preserve unsaved form state, Manufacturer/Model and existing Save/Cancel/discard.
2. **IT Assets Receive Stock:** enhance only the existing **Supplier (Optional)** field in **Receipt Details**, preserving its position, original receipt free text, surrounding inputs and existing stock processing.
3. **Device Inventory:** existing table gains selection checkboxes and an **Assign Supplier** action for administrator-only retrospective bulk associations, with atomic permission-checked, audited confirmation and overwrite warnings.
4. **IT Assets Receipt History → Stock Receipts:** existing table gains selection/Assign Supplier and per-receipt Link/Change/Remove Supplier Association alongside historic free text; never infer pooled stock source or edit original receipt facts.
5. **Supplier Details:** the previously agreed **Supplied Equipment** fifth tab and **Supplier Equipment** quantity metric. List structure/filter follows the approved Supplier HTML, adding original receipt quantity/date, status and existing record drill-down. Respect independent permissions/feature gates and count receipts and independent Devices without double-counting stock-derived Devices.

The review's surrounding elements are *illustrative only*. The application’s existing actual Device Add/Edit, Device Inventory, IT Assets Receive Stock/Receipt History and Supplier Details forms, CSS, naming, responsive layout and Save/Cancel semantics remain authoritative. No new CSV, issue-time Supplier choice, purchase-lot tracing, separate bulk-management screen, or framework changes.

## Implementation acceptance still required

Commit focused work and new long-form v2.2 draft user/admin guides on this feature branch, with factual current navigation, permissions, steps, Save/Cancel behaviour, examples and troubleshooting. Capture **genuine implemented-app screenshots** on desktop/mobile in light/dark for all five affected areas with provenance, and request owner visual acceptance. Run focused backend, browser, security and regression checks during development; complete all required GitHub Actions only after moving the draft PR to Ready For Review. Do not claim any of those checks have already passed based on this approved review HTML. Obtain separate owner approval for merge. No release or Raspberry Pi/website deployment.
