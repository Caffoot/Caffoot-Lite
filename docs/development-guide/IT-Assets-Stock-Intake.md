# IT Assets Stock Intake

> **Historical implementation contract.** The checkpoint, schema and pending-review wording below describe the original development stage. Use [Development Status](Development-Status.md) for the current integrated application and acceptance boundary, and the [v2.2 instructions](../how-tos/features-and-instructions/v2.2-draft/README.md) for current procedures. Original technical decisions and evidence are retained.

> Unreleased v2.2. Batch 3.7 merged and was visually accepted via PR #388 at
> `7f91f5d42feb3916cfab060abd5ca4b1558a92ba`. The dated verification below records
> that batch. [Batch 3.8 circulation](IT-Assets-Issue-Return-and-Write-Off.md) extends
> these screens on its separate draft branch; it is not merged or visually accepted.

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
was imported. Existing accepted screens, styles and the Schema 16 definitions are preserved.

## Protected Operations

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

## API Contract

| Operation | Access | Contract |
| --- | --- | --- |
| `GET /api/it-assets/stock` | Effective IT Assets Read | Current catalogue, genuine balances, original receipts and readiness history |
| `GET /api/it-assets/stock/{id}` | Effective IT Assets Read | Current item, individual units, history and version |
| `POST /api/it-assets/receive` | Effective IT Assets Edit | New item or existing `stockItemId` plus `configurationKey`; receipt and optional checked readiness |
| `POST /api/it-assets/readiness` | Effective IT Assets Edit | Item/version, desired ready total, individual selections when applicable, checks, nullable minimum and reason |

Both writers require a live session, configured Origin and CSRF token, JSON with
unique keys and at most 64 KiB. Every write has an `operationId` (16–80 letters,
digits or hyphens). Its saved actor-scoped request digest permits an identical
retry, rejects a changed payload using the same reference and prevents duplicate
receipts. Readiness requests include all fields, including `minimumStockLevel`
(null when absent), checks and reason. Individual requests also include distinct
`readyUnitIds` matching the requested total. The actual request shapes and negative
cases are exercised in [backend tests](../../tests/test_stock_intake.py).

Whole quantities and each item's accumulated held total stay within the exact
JavaScript integer range, 0–9,007,199,254,740,991. Receipts must be positive.
Individual receipts have quantity one, retain their own permanent identity and can
reuse an existing compatible catalogue item. Computer specifications use existing
Device keys (`processor`, `memory`, `memoryUnit`, `storage`, `storageUnit`) plus the
approved stock-only `storageMedium`. Non-computer entries reject computer fields.

Movement entries are inserted before their closing header, as required by the
unchanged Schema 16 triggers. Each original receipt entry snapshots specifications
and any individual identifiers. Readiness appends transfers between Awaiting Checks
and Ready; neither the original receipt nor physical total is changed. A reversal
requires a reason. Minimum-only changes use the existing attributed inventory audit,
with no fabricated receipt or movement. Their audit/version contributes to stale-form
protection. Stock audit projection also respects feature-off privacy for administrators.

The frontend loads a separate small module using existing shared/Staff styles plus
scoped stock table/grid rules. It clears cached stock on denied access, refreshes
session rights on feature changes, and places IT Assets after Devices in the IT group.
No new role, permission, feature flag, table, migration or Device registration exists.

## Verification And Review

Runtime/capture source: `4480d5df10d56e9d898629cec5ac37f1f1df8a18`.
The focused intake suite passed **17 tests**. The full backend suite passed **745 tests**
with **four skips** (741 passed). The real browser workflow passed with **24 genuine
desktop/mobile light/dark captures**, no page errors or checked page overflow. The
existing Optional Features browser regression passed with eight further captures.
See [the evidence report](../development-handovers/evidence/stock-intake/Report.md)
for exact commands, Docker/documentation checks, screenshots and limitations.

At the recorded Batch 3.7 checkpoint, issue/return and write-off were not exposed.
Those are now implemented for separate [Batch 3.8 review](IT-Assets-Issue-Return-and-Write-Off.md).
Movement/specification editors, Device registration, associated equipment, dashboards,
Low Stock warnings, Supplier Management, Service Desk and Stocktakes remain later work. Batch 3.4 native acceptance remains deferred;
complete-volume upgrade/restore and final milestone acceptance remain Stage 6 work.
Product-owner visual acceptance and merge approval remain separate.
