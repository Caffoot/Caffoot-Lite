# Milestone 01 correction Batch 4 — Audit Trail Activity Details

Unreleased v2.2 evidence for [#477](https://github.com/Caffoot/Caffoot-Lite/issues/477), [PR #490](https://github.com/Caffoot/Caffoot-Lite/pull/490). Fictional disposable HTTPS/SQLite test data only.

## Accepted desktop captures — 27 November 2026

Source revision `a01c9909735719dcb3c811f4b2327c1bdabc7fc1`, [focused width run 46011790201](https://github.com/Caffoot/Caffoot-Lite/actions/runs/46011790201), artifact 15203888003, ZIP SHA-256 `0a3285cf5dc3874b7246fc752ec19d86ec415a5e41dea7ef8ac532095fe0f9ce`. Chromium 141.0.7390.37, 1440 × 1000, light theme. [Independent review](https://github.com/Caffoot/Caffoot-Lite/pull/490#issuecomment-7220230597); [owner acceptance](https://github.com/Caffoot/Caffoot-Lite/pull/490#issuecomment-7220277672). Owner upload branch revision `05d69c9d559e8074b6ab781424a844fdfa026578` contains only the three original PNGs (browser download filenames gained -2 suffixes). Exact Git blob hashes match independently inspected original images; renamed to their original capture names without byte changes.

| File | SHA-256 | Git blob SHA |
|---|---|---|
| [audit-supplier-name.png](audit-supplier-name.png) | `8949b14b666ef03c24efdae124ab089409bc63620dd3fa543e295b92dc361cf1` | `c85e82f66122707b00fd4427aaccd86cc8791939` |
| [audit-legacy-technical.png](audit-legacy-technical.png) | `b3d9e6af90d80bb3b36840261287feab7d0c5fa40e2272cb04349c849d2afb1e` | `7fe53b4eb42569a58eb39592da6f175ee68b1064` |
| [audit-device-changes.png](audit-device-changes.png) | `007e0ac092fa167c2debe00cec9c98a87adbe07087420c7f54ec0fca9dbedcf3` | `9cdc3a1a739b85e1a412c1549c99e8166c0af673` |

- Supplier association: genuine protected API Supplier and Device saves; the event-time name remains Northlight Ltd after a subsequent rename.
- Legacy Technical Details: seeded fictional historical record, historical-name fallback and original raw fields visible in the expanded 850px dialogue.
- Device field changes: seeded fictional historical record, readable Primary IP Address and Asset Tag changes; unchanged context is not a change.

The width-only run passed the pinned stylesheet/template contracts and 1440/730/390 viewport geometry in both themes, keyboard/focus and stored-history checks. Images establish desktop light appearance, not native Pi/Safari or dark/mobile visual acceptance. Full focused business-logic run [46010667038](https://github.com/Caffoot/Caffoot-Lite/actions/runs/46010667038) at `c049d3040ca4f67bb45036d1cd480e4e54614513` passed 31 backend tests and the focused Chromium checks. Business logic was unchanged during the width refinement.

## Earlier narrow layout — historical provenance

The three earlier captures at `c049d3040ca4f67bb45036d1cd480e4e54614513`, artifact 15202643046, ZIP SHA-256 `f842584d05262f5cc4ae503ee69dae43a635e8f9077159154ad6fc29abdbf40e`, are superseded visually by the owner-approved wider layout. [Original independent review with per-image hashes](https://github.com/Caffoot/Caffoot-Lite/pull/490#issuecomment-7220069314) and [approved refinement](https://github.com/Caffoot/Caffoot-Lite/pull/490#issuecomment-7220140264) retain their provenance. Earlier narrow PNGs are not included in this permanent directory; the three accepted revised originals above are retained.

## Remaining acceptance

Final mandatory CI, separate owner merge approval, consolidated targeted native Raspberry Pi reacceptance and documentation PR #472 reconciliation remain outstanding at this checkpoint. No publication or deployment.
