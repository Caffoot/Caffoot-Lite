# v1.4.0 — Identity & Migration Contract (draft)

**Status:** Proposed for owner review; not an implementation approval.  
**Baseline:** Published v1.3.0 standalone HTML, `caffoot_state` internal state v3, JSON backup schema v1 and historical unversioned imports.

## Core guarantees

1. **No in-place conversion of the only copy.** Read the source state, preserve the original bytes and backup, build a detached candidate, validate it fully, then commit atomically or restore the original. A failed migration must leave existing inventory usable.
2. **Preserve legacy identifiers.** Existing device, rack, subnet, VLAN and accessory IDs, including timestamp-derived device IDs, remain unchanged. All existing `deviceId`, `reservedForDeviceId`, `rackId`, `parentId` and `virtualHostId` references retain their meaning.
3. **Distinct identity layers.** An immutable UUID identifies each supported entity internally; its historical ID is retained for compatibility; an optional human-readable Asset ID is a user-facing label, never a relationship key.
4. **No silent merges.** Reject duplicate or ambiguous identifiers within a defined entity type and scope. Never infer two records are identical from hostname, IP, serial number or Asset ID.
5. **Explicit scopes.** Define inventory/tenant and address-domain boundaries before permitting overlapping IPs or VLANs. Current single-inventory constraints remain intact until scoped operations are implemented and tested.
6. **Portable interchange.** Keep importing supported unversioned and schema-v1 backups. Do not change the exported schema or add UUID fields to schema-v1 payloads without a separately approved, versioned interchange decision.
7. **Separate storage versions.** Application version, internal state version, migration version and backup interchange schema version are different concepts; upgrade them independently and document compatibility.

## Migration algorithm (design, not code)

1. Verify the input backup/state format, size and unsafe-property protections before constructing any objects.
2. Create a protected pre-migration copy and a detached working candidate; record the source schema and inventory fingerprint.
3. Enumerate all entity types and legacy IDs, validate uniqueness in the correct scope, and identify all references. Do not generate UUIDs until ambiguity checks pass.
4. Reuse existing UUIDs when valid; otherwise assign new UUIDs once. Persist an explicit mapping keyed by entity type, scope and legacy ID **with the migrated state**, never only in transient process memory.
5. Resolve references using the mapping; validate missing targets, cycles, hierarchy, device/IPAM synchronization, virtual hosts, reserved-for links, rack bounds, front/rear placement and 0U accessories.
6. Validate the complete candidate and its serialized form before committing. Any failed validation or write aborts the operation and preserves the original state.
7. Verify the committed data by reading it back. On failure, use the existing recovery/rollback mechanisms; retain the safety snapshot until verification succeeds.
8. Re-running the same migration on already-migrated data must preserve every UUID and relationship. Restoring a legacy backup is **replacement**, not an implicit merge, unless a future separately approved import mode explicitly says otherwise.

## Asset ID contract — proposed

- Asset ID is optional and independent of UUID, hostname and legacy ID.
- Support a configurable prefix, starting number and display formatting without changing any existing identifiers.
- Number assignment must check uniqueness within a documented inventory/tenant scope and handle concurrent allocation safely in a future server deployment.
- Import conflicts, manual edits, deleted assets, gaps and number reuse need explicit rules before implementation. **Proposed default:** never automatically reuse an issued number; preserve user-supplied existing asset tags without renumbering.
- Changing an Asset ID never changes the UUID or linked records.

## Backup and rollback contract

- Historical imports must continue to work without mutation on malformed, future-unknown or malicious payloads.
- A future backup schema v2, if approved, must explicitly define UUID preservation, export scope, identity collisions and round-trip expectations.
- Audit history, authentication secrets, sessions and browser-only preferences are not silently bundled into inventory JSON.
- Migration must not rely on a database snapshot as the only user-restorable backup.
- Rollback testing must cover validation failure, serialization failure, interrupted writes, read-back mismatch and repeat imports.

## Required fixture matrix

| Fixture | Expected result |
| --- | --- |
| Historical unversioned and schema-v1 inventory | Accepted; original IDs and links retained |
| Device with primary IP and reserved-for-device allocation | References and allocation ownership preserved |
| Virtual machine and physical host | Host relationship preserved |
| Nested subnets with scoped VLANs | Parentage, containment and VLAN ownership unchanged |
| Rack with front/rear devices and 0U accessories | Placement semantics unchanged |
| Duplicate legacy ID or dangling reference | Migration blocked with actionable diagnostics; source untouched |
| Existing migrated inventory processed twice | Same UUIDs, record counts and relationships |
| Failed write or verification | Original recoverable; safety snapshot retained |
| Unsupported future backup schema or unsafe property | Rejected before mutation |
| Two future address domains sharing IP/VLAN | Allowed only after domain-aware validation and authorization exist |
| Duplicate Asset ID in same scope | Rejected without changing device identity |

## Decisions pending owner approval

1. Should future portable backup schema v2 carry UUIDs, or should UUIDs remain an internal persistence concern?
2. Should Asset IDs be unique within one inventory/tenant (recommended initial scope), with site-level numbering deferred?
3. Should issued Asset IDs never be automatically recycled (recommended)?
4. Should address domains remain design-only until the future network-environments milestone?
5. Which browser-local audit/history and preference keys, if any, need separate migration?

## Release gates

- Complete read-only source/key inventory and lifecycle audit.
- Approve identity, uniqueness and backup-version rules.
- Add fixture-driven migration and failure-injection tests on a separate implementation branch.
- Preserve offline startup, import/export, device/IPAM/rack behaviour and existing recovery safeguards.
- Obtain owner browser acceptance before any merge or publication.

**No database, Docker deployment, UUID migration or application code change is authorised by this document.**
