# IT Assets Stock Intake

> Unreleased v2.2 work on `feat/it-assets-stock-intake`, based on
> `milestone-1` at `774dee3ecaaf1d50ba94dbf55891aa4b79b853c5`.
> This batch is under implementation and has not been visually accepted or merged.

## Interface Source Mapping

This mapping was recorded before implementing the new stock interface.
The [accepted functional reference](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-3-previews/caffoot-it-assets-receive-stock-ready-review.html)
defines the Receive Stock, Stock Inventory and Receipt History interactions.
The existing v2.1 design remains the visual authority.

| Stock Interaction | Existing Application Source To Reuse |
| --- | --- |
| IT Assets destination within IT | `interface/screens/navigation.html`, existing IT group and `i-box` icon |
| Page heading, cards and detail composition | `interface/staff-directory.js`, `interface/styles/users.css`, `interface/styles/staff.css` |
| Stock Inventory and receipt/readiness tables | `interface/screens/device-inventory.html` table conventions and existing Department detail tables/scroll wrappers |
| Receive Stock and per-item forms | Existing Staff/Device form labels, native inputs/selects, card heads, action buttons and responsive field grids |
| Three tabs and keyboard behaviour | Existing `.tabs`/`.tab` controls and shared tab-scroll helpers |
| Light/dark and responsive behaviour | Existing theme variables, shared component styles and established card/field breakpoints |

No standalone preview shell, demonstration data, simulated security or preview JavaScript
will be imported. Existing accepted screens, styles and the Schema 16 definitions are preserved.

## Backend Checkpoint

Protected `/api/it-assets/stock` reads, `/api/it-assets/receive` and
`/api/it-assets/readiness` writes use existing session, Origin, CSRF, MFA,
IT Assets Read/Edit and independent feature gates. Writes recheck access after
obtaining `BEGIN IMMEDIATE` and use the existing four tables.

A receipt initially adds Awaiting Checks entries. Explicit checked readiness is a
separate journal fact in the same transaction. Later readiness preserves the physical
total and original receipt; reversals require a reason. Individual identities remain
distinct, with optional serial/tag values. No managed Devices are created.

Operation references make retries idempotent. A changed payload cannot reuse a completed
reference. Readiness uses a version bound to current journal/configuration history,
preventing a stale form overwriting another change. Minimum Stock Level is nullable and
quantity-only; minimum-only changes are attributed without inventing stock movements.
Stock audit projections remain permission- and feature-filtered.

This checkpoint has 16 focused backend/HTTP tests passing. UI, full regression, Docker,
browser captures and final evidence are still pending. No issue/return, write-off,
movement/specification editor, Device registration, associated equipment, dashboard,
Low Stock warning, Supplier directory or Service Desk operation is exposed.
