# Offline import boundary verification checkpoint

This checkpoint covers the **internal**, non-HTTP v1.3.3 backup restore
foundation on the Next branch. It does not authorise live imports.

The offline restore path checks published backup metadata, requires explicit
Access Point mounting choices when applicable, requires approval of proposed
legacy computer mounting corrections, and requires final confirmation.
The original backup remains detached from the candidate.

For an approved offline restore, SQLite stores a recoverable pre-restore
inventory snapshot and replaces inventory in **one transaction**. A failed
replacement rolls back both the active inventory and the snapshot. A subsequent
successful restore snapshots its immediate predecessor. Account data is not
part of inventory replacement.

The tests exercise cancellation, invalid choices, older-version rejection,
approved corrections, rollback after partial writes, preservation of a prior
snapshot on a failed subsequent restore, and account-table isolation.

**Not yet established:** complete published v1.3.3
`validateApplicationState` parity across genuine backup variations; a
production authenticated API; UI confirmation and snapshot download/recovery
workflow; production authentication, RBAC, MFA, and concurrency safeguards.
No user-facing import should be enabled before those gates are completed.
