# Issue #331 — Shelf Associations And Contextual Device Catalogue

The owner authorised all four packages in [6698780416](https://github.com/Caffoot/Caffoot-Lite/issues/331#issuecomment-6698780416), executing [specification 6698734229](https://github.com/Caffoot/Caffoot-Lite/issues/331#issuecomment-6698734229). The [catalogue](https://github.com/Caffoot/Caffoot-Lite/issues/331#issuecomment-6698683599) and its [approval](https://github.com/Caffoot/Caffoot-Lite/issues/331#issuecomment-6698711131), plus [atomic retirement/removal approval](https://github.com/Caffoot/Caffoot-Lite/issues/331#issuecomment-6698546812), are authoritative. No further routine start approval is outstanding.

Starting checkpoint: clean local/GitHub `04243a1c4e78873c55079ea1447deab4a5ab887f`, branch `feat/approved-modular-html-282`. #327/#328/#329/#330 remain independent; pinned sources and existing parent-rack deletion are protected. No merge, image publication, production access or release is authorised.

## Package A — Implemented And Tested

Devices use one optional JSON field, `rackShelfAccessoryId`, referencing an existing horizontal accessory whose `type` is `shelf`. Existing JSON storage preserves this without a SQLite migration, new table or changed backup format.

For physical **Tabletop / Shelf Mounted**, no rack means no shelf; choosing a rack requires its real shelf. A linked device has no independent U/face footprint. The accessory alone occupies U. Shared validation covers device saves, whole-state integrity, conflicts and normalisation/import. Legacy computer correction never silently erases a new shelf reference. Old records without the field retain their existing behaviour.

`POST /api/inventory/rack-shelves/remove` accepts `shelfId`, the full `expectedShelf` preview, and one explicit choice for every linked device. A choice contains `deviceId`, original `revision`, and either `action: retire` or `action: reassign` with destination `rackId`/`shelfId`.

One SQLite transaction checks current Devices/Racks edit rights, the unchanged shelf preview, exact linked-device set, each revision, existing five-minute reservations, destination existence and whole-inventory placement. Other active editors block removal; an expired/stale reservation belonging to the operator must be reopened. No second locking mechanism is added. Device changes, shelf deletion and bounded non-sensitive history all commit or roll back together. Audit retains the former rack/shelf/U/face through the existing section-filtered representation. Retired records survive and lose only their active placement. Ordinary linked-shelf deletion is blocked with guidance to the reviewed workflow.

Checks: **466 backend tests run, 463 passed, three established skips**, including 17 focused shelf tests and a real HTTP authentication/CSRF/permission/atomic-result test. Focused existing normalisation/rack/device-save/collection/legacy tests also passed (94 tests). Docker lifecycle is separate; two genuine private v1.3.3 backup tests require an unavailable owner fixture.

## Resume Checklist

- [x] A: optional shelf reference, shared invariants, permission checks, atomic removal and backend/HTTP tests.
- [x] B: narrow Batch 04 conditional Rack/Shelf controls, draft-safe existing accessory creation, linked-shelf review, correct Duplicate/Details and browser tests.
- [ ] C: vendor-confirmed approved version arrays, contextual local software and explicit retained selections; no backend whitelist or destructive catalogue migration.
- [ ] D: complete integration, browser/security/permission/backup/visual regression evidence, documentation and private owner acceptance instructions.

## Package B — Implemented And Tested

Conditional Rack/Shelf controls stay inside the existing Mounting & Rack Configuration card. The original Horizontal Accessory editor creates the shelf, preserving the mounted Device form, draft, active tab/focus and original five-minute reservation. Saving a shelf is independent of cancelling the Device draft. Duplicate retains shelf mounting without allocating a device U slot. Details derives the current accessory U, rather than storing a stale location. Linked removal requires an explicit destination or Retired choice for every device; Cancel and failure preserve all records and choices. Existing parent-rack deletion is unchanged.

Focused Chromium checks passed six functional groups, plus eight width/theme combinations (1440/1366/390/320px, light/dark). Captures include General, accessory creation, moved-shelf Details and failure recovery. Manual inspection confirms the approved card/header/footer treatment and source accessory form. Full existing Chromium compatibility passed. A further 21 focused backend tests passed, including current shelf-mounted Access Point import preservation; malformed references still fail validation. Pinned-source/template checks passed (two tests). These results do not claim owner Pi/Safari acceptance.

Next step: package C, implementing the approved vendor-confirmed version arrays and contextual local software, with visible, removable retained selections. Then complete package D regression, CI, evidence and private acceptance instructions continuously. No package A/B reimplementation is needed.
