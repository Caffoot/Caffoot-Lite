# v1.4.0 — Data Storage Boundaries (design proposal)

**Status:** Proposed for review, not an implementation or database decision.  
**Baseline:** Published v1.3.0 offline HTML and the read-only data-model audit.  
**Principle:** Separate *ownership and lifecycle* of data before choosing storage technology.

## Logical storage domains

| Domain | Contents | Ownership and lifecycle | Portable inventory export? |
| --- | --- | --- | --- |
| Inventory | Devices, subnets, VLAN definitions, IP allocations, racks, accessories, catalogue selections and legacy IDs | Inventory-scoped; changes validated as one coherent state | Yes, with schema-defined compatibility |
| Identity mapping | Internal UUIDs, legacy-ID mappings, optional Asset IDs, issued-number registry | Inventory-scoped; migration-versioned; cannot silently regenerate on reopen | Future schema decision required; do not alter schema-v1 |
| Presentation preferences | Theme, view density, selected tabs, filters and other noncritical UI preferences | Browser/user-scoped; safe defaults if absent | Normally no; verify current keys before migration |
| Recovery and safety | Pre-restore snapshots, failed-write recovery and validated restore staging | Protected, time-limited or explicitly user-managed; never silently overwritten | Separate recovery workflow, not routine inventory export |
| Audit/history | Event records, operation context and eventual actor attribution | Dedicated append-oriented domain with retention and access policy | Not by default; define separate authorized export |
| Authentication and authorization (future) | Users, credentials, MFA material, sessions, roles, memberships | Secure server-side only; never in portable inventory or browser localStorage as secrets | Never export secrets |
| Tenant/site/address domain (future) | Organizational scopes, site records and network address namespaces | Scoped by authorized ownership; every query, mutation and export must enforce scope | Only explicitly selected, authorized scope |
| Runtime/deployment (future) | Database configuration, encryption keys, job state, health and migration locks | Server/host configuration; secured outside user inventory | No |

These are **logical boundaries**, not a claim that v1.3.0 already stores them separately or that every future domain needs its own database.

## Current-to-future mapping

- The current `caffoot_state` browser-local JSON snapshot remains authoritative for the published standalone application. Its internal version is 3.
- Existing JSON backup schema 1 and supported unversioned imports remain unchanged until an approved schema migration.
- `ipAllocations` currently uses IPv4 strings as object keys. A future address-domain model must redefine keys and uniqueness *before* overlapping addresses are supported.
- Browser preferences and audit-history data are known to be outside the ordinary JSON backup, but **their exact keys, formats and retention require a read-only source inventory**; do not invent or delete them.
- Future account/session secrets must not be mixed into portable inventory or exposed as client-accessible data.

## Storage interface proposal

A future domain-facing persistence boundary should expose operations such as `loadInventory(scope)`, `validateCandidate(candidate)`, `commitInventoryChange(scope, expectedRevision, mutation)`, `exportInventory(scope, schemaVersion)`, `prepareRestore(scope, payload)` and `commitRestore(scope, preparedRestore)`. These are conceptual contracts, **not existing APIs**.

- A transaction must cover coupled device/IPAM changes, scoped VLAN ownership and rack placements.
- Commit requires validated references and revision/conflict checks; server-side authorization must happen before data access or mutation.
- Recovery snapshots and migration state must survive an interrupted commit.
- Import is a deliberate replace operation unless an independently designed merge feature is approved.
- UI code should not need to know whether the backend is browser storage, SQLite or PostgreSQL; differences in concurrency, locks and recovery must still be explicitly tested.

## Offline and hosted deployment boundaries

**Published offline mode:** one HTML file, one browser-local inventory; no server, login or multi-user isolation. Continue to support it unless an owner-approved product decision changes that requirement.

**Possible hosted mode:** server-owned authoritative inventory with authenticated and authorized access, protected secrets, revision-controlled concurrent edits, durable database backups and independent portable JSON exports. Hosting the existing HTML behind a reverse proxy does **not** provide these guarantees.

**Possible migration bridge:** explicit export from offline mode followed by validated, user-authorized import into a hosted inventory; do not silently synchronize or overwrite either copy.

## Security and privacy requirements

1. Enforce scope at every future server query, import/export, background task and audit read.
2. Protect backups and recovery snapshots because they contain infrastructure details.
3. Keep credentials, MFA seeds, session secrets and signing/encryption keys out of inventory JSON and ordinary client storage.
4. Define retention, access, integrity and deletion policies for audit and recovery data before enabling them.
5. Preserve existing unsafe-property rejection, state validation, read-back verification and restore rollback.
6. Do not describe a database, container or reverse proxy as providing authentication or tenant isolation by itself.

## Test and decision gates

- Inventory all actual browser storage keys and their read/write paths from v1.3.0 source.
- Classify each key as inventory, preference, audit, recovery, migration or unknown; record backup inclusion and clear/reset behaviour.
- Prove schema-v1 and unversioned import/export, failed-write rollback and offline persistence unchanged.
- Define inventory revision/conflict semantics before any concurrent hosted editing.
- Decide how UUID mappings survive future exports/restores without breaking schema-v1.
- Assess SQLite, PostgreSQL and browser storage against this boundary contract; select none until evidence and owner approval.
- Keep migration work off the published release branch; require tests and manual owner acceptance before merge.

## Questions still open

1. Should the standalone offline HTML remain a first-class supported mode indefinitely, or only until an approved replacement meets equivalent usability?
2. Should audit history be portable through a **separate** optional export, rather than inside standard inventory backups?
3. Which existing browser keys represent user preferences versus inventory-wide settings?
4. What recovery-retention and encryption requirements apply to hosted installations?
5. What is the smallest safe first implementation slice: tests and adapters only, or a separately reviewed proof of concept?

**No application behaviour, storage engine, deployment or release is changed by this document.**
