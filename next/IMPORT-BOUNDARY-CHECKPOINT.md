# Next inventory migration boundary — issue #215

Only a published v1.3.3 inventory export is supported for one-way
migration into Next. The importer retains the existing validation,
mounting review, correction choices, final confirmation and cancellation.
Accepted inventory replaces inventory atomically in SQLite; any failure
rolls back the transaction. User accounts and permissions are untouched.

This is currently an offline test boundary. Complete source compatibility,
authentication, RBAC and the familiar Settings interface must be verified
before a production import endpoint is enabled. Issue #215 is authoritative.
