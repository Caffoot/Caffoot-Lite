# Next migration boundary — issue #215

Only a published v1.3.3 inventory export can be imported into Next.
The import path preserves the established mounting review and final
confirmation, validates before writing, and replaces inventory atomically.
Failure rolls back the transaction. Account data is not overwritten.

**No Caffoot-managed ongoing backup or recovery feature is introduced.**
Docker/database backup and restoration belong to external backup software.
No browser-era safety snapshot table, stale-restore preview token or new
restore workflow is part of this implementation.

This remains an offline test boundary. Complete source compatibility,
authentication, RBAC and the familiar Settings UI must be verified before
a production import endpoint is enabled. Issue #215 is authoritative.
