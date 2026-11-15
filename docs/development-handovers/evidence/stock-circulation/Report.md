# Stock Circulation — Work In Progress

Unreleased v2.2 Batch 3.8 on `feat/it-assets-issue-return-writeoff`, targeting
`milestone-1` at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba`.

## Checkpoint 1

The narrow Schema 17 migration adds only an assignment closure journal reference
and guarded one-way closure. Original assignment data, deletion protection,
current-assignment uniqueness and the four Schema 16 stock tables are retained.
No application circulation workflow is claimed yet.

Command actually run:

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_assignment_closure test_device_assignments test_it_asset_stock_schema -v
```

**44 tests passed**: [log](checkpoint-01.log). This covers fresh/upgrade/restart,
whole-record/security/policy preservation, retained stock/feature choices, rollback,
unexpected definitions, valid return/write-off closure, original-field protection,
missing audit/header, duplicate/replacement/deletion rejection and concurrency.
Initial new-test column-count mistakes were corrected. Historical Schema 16 tests
remain pinned to that migration so their exact preservation assertions remain;
Schema 17 has separate current-upgrade coverage.

No full backend, Docker, browser or screenshot acceptance has been run for this
checkpoint. Issue, return, preparation, write-off, protected projections and UI
remain to be implemented. Product-owner visual acceptance and merge approval are
separate. Main, releases, production and Raspberry Pi hardware are untouched.
