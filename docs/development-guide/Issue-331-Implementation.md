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
- [ ] B: narrow Batch 04 conditional Rack/Shelf controls, draft-safe existing accessory creation, linked-shelf review, correct Duplicate/Details and browser tests.
- [ ] C: vendor-confirmed approved version arrays, contextual local software and explicit retained selections; no backend whitelist or destructive catalogue migration.
- [ ] D: complete integration, browser/security/permission/backup/visual regression evidence, documentation and private owner acceptance instructions.

Next step: package B in `interface/application.js` and minimal approved form fragments/styles. Keep the existing Horizontal Accessory editor and its placement validator; preserve the mounted Device form and edit reservation while creating a shelf. Then complete C and D continuously. Do not redo package A or earlier accepted issues.
