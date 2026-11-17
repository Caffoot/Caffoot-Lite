# Stale Staff Edit Verification

Finding 3 starts from verified `milestone-1` commit
`cb5ae4d904ba281a7ac1be2da3e2dfaa5d463b88`, on `fix/stale-staff-edits`.
The [Staff API contract](../../../development-guide/Staff-Directory-APIs.md#preventing-stale-staff-edits)
describes the revision and explicit refresh behaviour. Approved Staff functionality
remains defined by [#232](https://github.com/Caffoot/Caffoot-Lite/issues/232) and
[#368](https://github.com/Caffoot/Caffoot-Lite/issues/368).

## Historical Audit Compatibility Correction — 17 November 2026

Review of checkpoint `adffb8dd9d3a400b2870aa8eafbb7f4abc090f0c` found that
non-object historical change values could break Staff revision lookup. The new
service and HTTP regressions reproduced the malformed-JSON error before correction.
`_staff_revision` now uses a SQLite `CASE` to extract Staff fields only from object
entries. Plain or JSON-looking strings, numbers, nulls, booleans, arrays and invalid
object shapes are ignored; valid Staff objects still contribute their original
history ID. Normal revision inputs and changed-then-reverted detection are preserved.

`PYTHONPATH=tests python3 -m unittest test_staff_directory test_staff_directory_http test_history_permissions`:
**57 passed**, including the three new regressions. They verify Staff list/read/save,
unchanged revisions for unrelated history, valid mixed Staff history, stale-save
rollback without login creation, current-revision saves, permissions and unchanged
stored historical entries. Python compilation, affected Function Index locations
and `git diff --check` also passed.

This correction changes the Staff revision query only. It adds no schema migration,
history rewrite or interface change. Broader suites, browser captures and Docker
checks were not repeated for this focused correction.

## Initial Checkpoint Checks

The following results and captures belong to the earlier `adffb8d` checkpoint.

- `PYTHONPATH=tests python3 -m unittest test_staff_directory test_staff_directory_http test_staff_directory_migration test_staff_section_permissions test_device_assignments test_device_assignments_http test_department_details_http`: **80 passed**.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/staff-directory-interface.cjs`:
  **passed**, with real HTTPS and SQLite, nine captures and no browser script errors.
  Two open forms exercise a successful first save, stale full-form rejection without
  account/audit/database changes, retained profile/password fields, unchanged card
  and action positions, theme redraw, cancelled/failed refresh and a deliberate
  successful refresh/save. Both Reactivate and Mark Inactive reject stale revisions
  and succeed after refreshing. Existing creation, optional login, navigation and
  read-only Staff privacy checks also pass.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/department-details-interface.cjs`:
  **passed**, 28 actual application captures and no browser script errors.
- `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/device-assignments-interface.cjs`:
  **passed**, including Staff status placement/confirmation/reactivation, unchanged
  assignments/login, restricted personal/shared equipment and light/dark mobile views.
- Python compilation, changed JavaScript syntax and `git diff --check`: **passed**.
- Function Index regenerated for the three affected runtime files; declaration
  locations and definition count reviewed.

The backend checks include every editable Staff field, two competing SQLite
connections, a write waiting for the database lock, reverted values, malformed and
missing revisions, independent account security, archived Department compatibility,
session/MFA/CSRF/RBAC enforcement and complete rollback on conflict.

## Actual Application Captures

All data is fictional test data. These are existing application screens, with a
refresh action added only to conflict feedback. No stylesheet or shared page
template changed. Existing Cancel / Save Staff Member and quick status positions
remain in place; the form card and action positions are checked before and after
conflict. Captures were inspected in light desktop and dark mobile presentation.

- [Stale form, light desktop](staff-conflict-light-desktop.png)
- [Retained form and feedback, dark mobile](staff-conflict-dark-mobile.png)
- [Quick status conflict, light desktop](staff-status-conflict-light-desktop.png)

## Remaining Verification

The directly affected Department and Device assignment browser fixtures submit
the Staff revision. Final Staff browser verification also checks that theme changes
keep the original revision and that refreshing retains unused archived Departments
for authorised Department readers.

Full backend, multi-browser and Docker workflows are deferred while the PR is draft,
as required by `AGENTS.md`. Native/manual acceptance and independent code/visual
review remain outstanding. No merge, deployment, release or Stage 1–3 sign-off is claimed.
