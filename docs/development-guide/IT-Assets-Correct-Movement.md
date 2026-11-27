# IT Assets: Correct Stock Movement

> **Historical implementation contract.** The checkpoint, schema and pending-review wording below describe the original development stage. Use [Development Status](Development-Status.md) for the current integrated application and acceptance boundary, and the [v2.2 instructions](../how-tos/features-and-instructions/v2.2-draft/README.md) for current procedures. Original technical decisions and evidence are retained.

> **Unreleased v2.2 — Draft PR [#392](https://github.com/Caffoot/Caffoot-Lite/pull/392).**
> Batch 3.11 starts from the verified remote `milestone-1` HEAD
> `53b04328c4f895bfc1f72f0416c43a519b2e8b42` after accepted PR #391.
> This work requires review and separate product-owner merge approval.

## Authority And Presentation

Implements [#368, Sections 5–7](https://github.com/Caffoot/Caffoot-Lite/issues/368),
[#352](https://github.com/Caffoot/Caffoot-Lite/issues/352), its
[functional approval](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6848396534)
and the [Batch 3.11 allocation](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6897801454).
The [archived interactive preview](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-3-previews/caffoot-it-assets-correct-movement-review.html)
establishes interactions, not a replacement application shell.

Movement History extends `interface/stock-intake.js` and `interface/styles/stock.css`.
It reuses accepted stock cards, Staff form proportions, tables, shared inputs,
Title Case and the Batch 3.10 orange primary action with secondary Cancel,
together at the bottom right of the whole form. The pinned v2.1 sources remain
indexed in [Approved HTML Integration](Approved-HTML-Integration.md), particularly
Device Details/Forms Batch 04 and the shared inventory table conventions.
The shared application permission filter recognises the new form only with IT
Assets Edit. Theme redraws retain draft fields and their original unsaved baseline.

## Correct An Original Issue From Return Equipment

The [16 November decision](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6913521817)
adds **Correct Movement** beside the selected original issue in Return Equipment.
The action uses the existing correction context, form, preview and save routes.
It is offered only for a recorded stock issue which the server marks correctable;
unassigned physical returns and legacy assignments without an issue entry have no
original stock quantity to correct. Device-linked permissions remain independent.

The browser retains the actual Return Equipment form, including its initial
unsaved-change snapshot, while correction is open and during theme redraws.
Cancel and Escape restore it; leaving both forms protects each set of unsaved
changes. Failed context requests, blocked previews and rejected saves retain
entered information. Successful correction reloads the server stock projection
before a return can be submitted. A failed reload blocks both return submission
and correction reopening until **Reload Stock** succeeds.

The selected original issue remains selected when eligible, with its latest
outstanding quantity and server version. Entered quantities are preserved for
review rather than silently reduced. If the original issue becomes ineligible,
the selection is cleared with an explanation; another eligible issue must be
explicitly selected. The existing atomic return writer still checks its version,
outstanding quantity and applicable checks on every submission.

**Outstanding approved work, outside PR #392:** the same owner decision requires
a final Issue Equipment confirmation showing equipment identity, quantity and
recipient, with a way back to edit before saving. Complete this in a separate
focused PR after Batch 3.11. It is not implemented or marked complete here.

## Permanent Journal Contract

**No migration or schema change. Schema 19 remains current.** The existing
`it_asset_stock_movements` and `it_asset_stock_entries` tables retain their
reserved `corrected`, `corrects_entry_id`, `previous_quantity` and
`corrected_quantity` contract and all immutable-history triggers.

One correction targets one original closed entry in a Received, Issued, Returned
or Written Off movement. A multi-entry movement is displayed and selected by
both movement and entry reference; its entries are never silently combined.
Repeated corrections always link the original entry. Previous Quantity is the
latest effective quantity; Original Quantity remains the immutable recorded fact.
Quantities must be positive whole numbers within JavaScript's safe integer range,
matching the reviewed functional preview. A fixed individual unit cannot change
from one to another quantity or become anonymous stock. No correction creates or
removes a canonical Device, individual unit, receipt, return or assignment.

The original entry's exact specification snapshot, stock subject, recipient,
original issue reference and assignment reference are copied to the single
compensating entry. An increase repeats its direction; a decrease reverses it.
The original movement's date, actor and purchasing Supplier remain untouched.
The correction header records its own authenticated actor, date, reason and
before/after quantities. Its audit and compensating entry commit together.

## Protected API

| Route | Contract |
| --- | --- |
| `GET /api/it-assets/corrections/<entryId>` | Edit-only correction context, original/effective quantities, original actor/date/Supplier/recipient, current balances, version and attributed correction history |
| `POST /api/it-assets/corrections/preview` | Exact fields `entryId`, `version`, `correctedQuantity`, `reason`; returns `allowed`, explanatory `message`, `before`, `after` and version; performs no writes |
| `POST /api/it-assets/corrections` | Same fields plus `operationId`; revalidates under `BEGIN IMMEDIATE`, appends the correction and returns its reference and calculated balances |

All routes use existing session/MFA, feature and effective permission checks.
POST also uses the existing same-Origin, cross-site rejection, CSRF, strict JSON
and request size protections. Read-only users retain permitted Movement History,
including original/effective values and corrections, without a correction form
or write access. Disabled IT Assets and No Access deny every correction route.
Device-linked entries and original issues explicitly associated with a Device
require independently enabled Devices and Devices Edit, including on retries.
Device edit reservations are respected. Stock-only quantity corrections remain
available without Devices access.

Identical actor-scoped operation retries return the original result. Reuse with
a changed payload fails with 409. The version deliberately covers the complete
stock publication head, Device revisions, canonical assignments and explicit
associations: intervening changes require reload and a fresh preview, including
concurrent corrections. A retry still rechecks current rights before returning.

## Replay And Assignment Safeguards

Preview reads one SQLite snapshot and rolls it back without inserting pending
entries, audit, operation identifiers or temporary stock. Save repeats the same
calculation inside its write transaction; preview success alone is insufficient.

Replay uses the latest effective quantity of each original entry, applies the
proposed quantity at the original publication position, and preserves every
later entry. Publication order is authoritative even for backdated event dates.
All entries within a movement are checked together, including the two canonical
custody entries of a direct handover. Readiness, preparation, registration,
partial returns, original issue balances, write-offs and unit identity counts
must remain valid at every step, not only at the final total.

An ended Device assignment cannot gain outstanding associated accessories through
correction of its original issue or return. Existing accessory resolution and
handover records remain intact. The database independently checks compensating
entry shape, stale previous quantities, original issue references, live balances
and chronological replay when the correction header is published.

The preview shows Physically Held, Ready To Issue, Awaiting Checks (including
preparation), Awaiting Preparation separately, Currently Issued, Written Off and
the original issue's outstanding balance where applicable. Catalogue totals
include its registered held Devices exactly once. Current stock and assignment
views continue to sum real journal entries; history exposes original and effective
quantities separately and correction records show previous → corrected values.

## Verification And Review

The focused backend/HTTP/database tests are `tests/test_stock_corrections.py`.
The real authenticated browser journey is `tests/stock-correction-interface.cjs`;
it uses existing fictional fixtures, TLS server and Chromium, and is included in
the existing browser Actions workflow. See [the evidence report](../development-handovers/evidence/stock-corrections/Report.md)
for actual commands, results, source hashes, screenshots and remaining gates.
Published v2.1 guides, archived previews, `main`, releases and deployment are unchanged.
