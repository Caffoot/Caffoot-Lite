# v1.4.0 — Persistence options assessment

**Status:** Initial architecture comparison, not a technology decision.  
**Date:** 21 October 2026

## Decision context

The published v1.3.0 app is a standalone offline HTML application with a single browser-local JSON state snapshot, versioned JSON interchange, and coupled device/IPAM/rack mutations. The long-term vision includes simple self-hosting, user accounts, concurrent edits, MSP tenant isolation, auditability and optional proxy-based deployment. No new server or database is part of v1.4.0 merely because it appears here.

## Options

| Criterion | SQLite | PostgreSQL |
| --- | --- | --- |
| First-run deployment | Embedded database file; fewer moving parts | Separate database service and credentials |
| Small single-instance deployment | Strong fit | Capable but higher operational overhead |
| Concurrent writes | One writer at a time; transaction and busy handling essential | Multiple concurrent writers with mature isolation and locking |
| Durability | ACID transactions with correctly configured journal/WAL, filesystem and backups | ACID transactions with established backup/replication options |
| Backups | File-level snapshot must be coordinated correctly; application-level JSON export still required | Managed dump/restore and point-in-time recovery options with appropriate setup; JSON export still required |
| Multi-instance deployment | Requires careful single-writer/shared-storage design; not a default clustered backend | Natural fit for multiple app instances with networked database |
| Tenant isolation | Explicit tenant-scoped queries, constraints and authorization required | Same application requirements; row-level security can provide an additional defense layer if carefully configured |
| Operating effort | Low for single-host scenarios | Higher, especially for casual home-lab users |

## Preliminary recommendation (not accepted)

**Design a storage-independent domain and migration contract first.** Evaluate a single-instance SQLite deployment as a low-friction starting point, while documenting the conditions that would justify PostgreSQL (e.g., concurrent multi-user writes, multi-instance deployments, operational scale, tenant isolation requirements). Do not promise a seamless later database swap: different locking, constraints, migrations and deployment workflows require tests and possibly an explicit migration tool.

A container image can package an application independently of which database it uses. Docker is a deployment option, not itself a database or security boundary. Reverse proxies such as Caddy and Nginx Proxy Manager do not replace authentication, authorization, session protection or secure defaults.

## Non-negotiable acceptance criteria before implementation

1. Preserve the v1.3.0 user-facing workflows and data semantics, including device/IPAM atomicity, rack placement and scoped VLAN rules.
2. Continue versioned JSON import/export, legacy backup fixtures and safe replacement/rollback behaviour.
3. Define stable identifiers, migration idempotency and tenant-scoped uniqueness before designing database tables.
4. Test storage crash/failure recovery and consistent backup snapshots, not just successful saves.
5. Model permissions and tenancy at every data-access boundary before making the app internet-accessible.
6. Define a supported offline/local path and a simple upgrade process, including an explicit recovery plan.
7. Benchmark representative inventory sizes and realistic concurrent edits before making performance claims.

## Open questions

- Is the initial server-hosted experience single-user/single-instance, or does it require simultaneous edits from day one?
- Which existing browser preferences and audit-history records belong in a server store, and which remain local?
- How should inventories, tenants, sites and address domains relate? What does a portable export include?
- Will offline-first operation remain fully standalone, or become an optional disconnected mode?
- What is the expected backup frequency, recovery point and recovery time for supported deployments?

**Next step:** review the proposed entity/relationship and migration contract in [ENTITY-RELATIONSHIP-PROPOSAL.md](ENTITY-RELATIONSHIP-PROPOSAL.md), resolve its open scoping questions, and only then decide whether to implement a database.
