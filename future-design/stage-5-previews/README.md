# Caffoot Lite — Stage 5 Service Desk, HTML Design 01

**Status:** **Product-owner visually approved Design 01** on 18 November 2026 (see [issue #233 approval](https://github.com/Caffoot/Caffoot-Lite/issues/233#issuecomment-6979451154)). This is an approved design reference, **not implemented or authorised application code**. Prepared 18 November 2026.

## Open the mock-up

Open `01-service-desk-it.html` in a browser. No server, installation or project dependencies are required. The approved official Caffoot hedgehog image is linked from the pinned repository asset; if the browser cannot load it, a lettermark fallback appears. The standalone HTML does not read or write Caffoot data.

The file contains a functional *local-only* illustration of:

- IT Service Desk dashboard, live workload shortcut cards, period-based activity and technician activity;
- full inventory-style, searchable/filterable/sortable Ticket Queue with the eight agreed columns, defaulting to Open;
- Device Details-style Ticket Details **pop-up** with Overview, Updates and History;
- employee-visible/internal IT updates, with internal the default;
- Assign and Reassign (excluding current assignee), mandatory reassignment reason;
- Place On Hold (mandatory reason) and Resume to previous status;
- Close (mandatory employee-visible resolution note), Reopen and preservation of example history;
- a single equipment-centred Create Ticket form with required Device/Asset, an empty required category selector, Subject and Description;
- light/dark toggle and responsive mobile layout.

**This is a demonstrator only.** Example people, equipment, timestamps and dashboard numbers are fictional. Clicking a submission button changes local JavaScript demo data only. It does **not** test APIs, database persistence, permission enforcement, notifications, email delivery, attachments, file safety or historic-resolution-time calculations. Each browser reload resets the example. The responsive/dark treatment needs owner visual sign-off.

## Approved sources checked

- [Devices Inventory Draft 02](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-inventory-draft-02.html) — palette, sidebar/shell, page heading, search/filter toolbar and results table.
- [Device Details / Forms Batch 04](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-details-forms-batch-04.html) — modal/overlay, tabs, detail cards and action footer.
- [Service Desk specification and owner decisions #233](https://github.com/Caffoot/Caffoot-Lite/issues/233) — approved Stage 5 workflow, queue, statuses, priorities, privacy, category labels and interactions.
- [Stage 5 email templates specification #355](https://github.com/Caffoot/Caffoot-Lite/issues/355) — separate shared email template management (not included in this first HTML candidate).

## Important design boundaries

- No changes to `milestone-1`, any existing application code, Stage 4 PRs, or GitHub specifications were made to build this standalone local design candidate.
- The `C` mark is strictly an offline fallback if the official remote Caffoot image does not load; it is **not a proposed brand redesign**. Before development, Codex must use the actual application's bundled official asset.
- UI colour/spacing, particularly responsive and dark-mode states, follows the approved visual *language* but remains subject to comparison with the installed Caffoot application and product-owner visual approval. Do not treat this candidate as pixel-perfect.
- The mock-up intentionally does not simulate assignment/reassignment of tickets **while On Hold**, pending exact approved lifecycle behaviour; no extra status workflow has been invented.
- Authentication, per-ticket recipient/audience restrictions (including previous owners and Department membership), date/time calculations, technical permission checks and historical audit fidelity must be implemented and tested separately. The current example labels describe the agreed intent and do not demonstrate actual security.
- This first batch covers the **IT Service Desk** only. Employee **My Tickets**, **Service Desk Settings** and **Email Templates / Company Branding** HTML designs are separate follow-on review batches.

## Screenshot set

- `01-service-desk-desktop-light.png`
- `01-service-desk-desktop-dark.png`
- `01-service-desk-mobile-light.png`
- `01-service-desk-mobile-dark.png`
- `01-ticket-details-desktop-light.png`
- `01-ticket-details-desktop-dark.png`
- `01-ticket-updates-desktop-light.png`
- `01-ticket-updates-desktop-dark.png`
- `01-ticket-details-mobile-dark.png`

Screenshots were generated in Chromium at 1440 px desktop and 390 px mobile widths from the standalone HTML. External image requests were blocked during capture; hence the logo fallback in screenshots.