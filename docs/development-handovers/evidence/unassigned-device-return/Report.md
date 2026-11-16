# Unassigned Device Return Correction

Unreleased v2.2 follow-up in draft [PR #389](https://github.com/Caffoot/Caffoot-Lite/pull/389),
branch `feat/it-assets-issue-return-writeoff`, starting from verified
`f4ac367984b68f81eb9566d7d8d057b6a26bc5fb`. Integration remains
`7f91f5d42feb3916cfab060abd5ca4b1558a92ba`; main remains
`3d66c3ee6fd9d9c51ecbdd5822bc1c4fe98b8e7b`.

## Approval And Scope

The [PR approval](https://github.com/Caffoot/Caffoot-Lite/pull/389#issuecomment-6907931718)
and [issue approval](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6907932153)
authorise an existing Device Details entry point, explicit physical-return
confirmation and a protected direct Device return. The earlier 52 genuine
screenshots are owner-approved and retained. Changed screens need separate review.
No new selection screen, Place In Stock workflow or Schema 17 change is authorised.

## Backend Checkpoint — 16 November 2026

The new `deviceId` alternative requires affirmative physical confirmation and both
Edit permissions. It records one canonical Device Awaiting Preparation, preserving
its operational configuration and all original assignments. There is no inferred
issue, recipient, receipt, quantity or immediate readiness. Existing issue/assignment
routes remain unchanged. Invalid histories, virtual/assigned/held/written-off Devices,
stale/replayed changes, future dates and incompatible dispositions are rejected.

```sh
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=tests:. python3 -m unittest test_unassigned_device_returns test_stock_circulation test_device_assignments test_assignment_closure -v
```

**73 tests passed:** [actual log](backend-focused.log). Checks include canonical
record/security preservation, original completed assignments after upgrade, optional
empty-link reuse, edit reservations, rollback, concurrent processing, feature-off,
role/override/MFA/session checks, HTTP Origin/CSRF and the existing closure safeguards.
One new fixture initially violated the existing 32-character stock-unit ID rule;
its ID was corrected. No application constraint was weakened.

This checkpoint does not claim interface, browser, Docker or full-suite completion.
Those checks and changed-screen captures follow the interface integration. No merge,
release, deployment, native hardware or changes to main have occurred.
