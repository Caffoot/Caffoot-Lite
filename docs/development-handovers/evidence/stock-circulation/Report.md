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

## Checkpoint 2

Issue Equipment backend, immutable issue/outstanding references and the restricted
name-only recipient lookup are implemented. Existing Device allocations remain
independent. No return, write-off or new interface is claimed yet.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_stock_intake test_assignment_closure test_device_assignments -v
```

**51 tests passed:** [log](checkpoint-02.log). Checks include quantity/individual
issues, Staff/Department holders, inactive/archived rejection, selected-item Ready
limits, concurrency, retry/stale protection, audit rollback, MFA/Read/feature-off
controls, narrow recipient privacy and protected HTTP routes. Initial fixture
mistakes (grant column name and duplicate catalogue data) were corrected without
changing application safeguards. Full final suites and screenshots remain pending.

## Checkpoint 3

Partial/mixed returns, canonical assigned-Device return/closure and later
preparation are implemented. Separate return, readiness and damaged write-off
facts commit together. Original receipts, issue references and Device records
remain unchanged. Readiness cannot bypass returned-equipment checks.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_stock_intake test_assignment_closure test_history_permissions -v
```

**56 tests passed:** [log](checkpoint-03.log). Coverage includes the five-unit
mixed example, partial/complete returns, invalid dispositions, duplicate/concurrent
returns, later wipe/cleaning checks, readiness bypass rejection, final-disposition
rollback, protected HTTP return/preparation and secondary Device privacy.

**Clarification pending:** mandatory preparation-check classification for canonical
Device types beyond the explicitly covered computers and non-data examples.
Other Device types are blocked from Ready pending that answer; no assumed wipe
rule is advertised as approved. Standalone Write Off, Staff/Department/My Equipment
integration, browser/UI, full suites and final evidence remain work in progress.

## Checkpoint 4

Standalone Write Off handles selected held states, issued individual Assets and
canonical Devices, with mandatory reason/date/actor and retry/version protection.
Issued Device closure is atomic and creates no return. Existing Device JSON and
other equipment are retained; unrecorded Devices never acquire fabricated held stock.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_assignment_closure test_device_assignments test_history_permissions -v
```

**61 tests passed:** [log](checkpoint-04.log). Checks include Ready/Awaiting stock
balances, issued identities, held/assigned/unassigned canonical Device cases,
unchanged operational records, no automatic accessory write-off, failed-audit
rollback, duplicate/stale/reason/permission rejection and initial-allocation bypass
protection with IT Assets disabled. No full suite or UI acceptance is claimed.
The preparation type-mapping question remains open; checkpoints 5–6 are pending.

## Checkpoint 5A — Backend Equipment Integration

Protected Staff/Department equipment reads and employee-safe My Equipment now show
actual outstanding Asset quantities alongside independently permitted Devices.
Sharing uses the Department as holder; no per-member issue is created. Device
relationships are not duplicated. Historical stock references block unsafe
Department deletion. Journal history is independently filtered for Device access.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_stock_circulation test_device_assignments test_device_assignments_http test_staff_directory test_history_permissions -v
```

**76 tests passed:** [log](checkpoint-05-projections.log). Checks cover partial
outstanding quantities, personal/shared separation, current membership changes,
feature-disabled privacy, no inventory/directory grants, original Device regression,
minimal employee fields and retained Department history. The interface/browser
half of checkpoint 5 remains pending, as does the preparation type clarification.
