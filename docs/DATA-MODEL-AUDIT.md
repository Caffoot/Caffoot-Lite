# v1.4.0 — Data-model audit (read-only)

**Date:** 21 October 2026  
**Baseline:** published v1.3.0 source (`app/caffoot-lite.html`), `BACKUP-FORMAT.md`.  
**Status:** preliminary findings, not a migration implementation or completed security audit.

## Current persistence and boundaries

- The browser saves a single application-state JSON object in `localStorage` under `caffoot_state`; internal `STATE_VERSION` is 3.
- Inventory collections include `devices`, `subnets`, `vlans`, `racks`, `rackAccessories`, `ipAllocations`, and managed option/catalogue collections.
- `ipAllocations` is an object keyed by dotted IPv4 address, rather than a collection with its own durable record identifier.
- Versioned JSON backup interchange is schema 1; historical unversioned backups are accepted subject to validation. Backups are **not** database snapshots and exclude separately stored audit history and preferences.
- The current validator is a single-inventory model. No tenant-aware data isolation or authenticated multi-user server boundary exists today.

## Observed relationships

| Record | Relationship in v1.3.0 | Migration concern |
| --- | --- | --- |
| Device | `device.id` referenced by `ipAllocations[*].deviceId` and `reservedForDeviceId` | Preserve existing identifiers and all references; review reserved-reference validation coverage |
| Device rack placement | `device.rackId` references `racks[].id`; U position fields describe placement | Preserve rack references and validate U ranges, face and collisions in migration tests |
| Rack accessory | `rackAccessories[].rackId` references rack | Ensure accessories migrate with rack and keep placement semantics |
| Subnet/address block | `subnets[].parentId` references another subnet/address-block ID | Preserve hierarchy, containment and cycle rules |
| Device primary IP | `device.primaryIp` must correspond to keyed IP allocation with matching device ID/status | Migrate device and allocation together transactionally |
| Subnet/VLAN | Network subnet carries a numeric `vlan` scoped by parent address block in integrity validation; separate `vlans` catalogue exists | Audit catalogue linkage and avoid assuming global VLAN uniqueness |

## Confirmed validation behaviour

`validateApplicationState` checks subnet hierarchy, subnet IDs, scoped network VLAN values, device IDs, device mounting compatibility, primary IP and allocation synchronization, and basic rack references/U range consistency. `hierarchyValidate` checks parent existence, containment, cycles and overlap rules. The existence of these checks does **not** establish complete relational integrity for every collection; enumerate gaps before choosing SQL constraints.

## Migration design requirements

1. Keep existing IDs and historical references unchanged on import. New immutable UUIDs, if adopted, must be added with deterministic migration tracking/idempotency and collision detection; never silently replace existing keys.
2. Retain JSON schema-1 and legacy import compatibility and make future schema changes explicit, versioned and fixture-tested.
3. Preserve user data and unknown supported fields. Validate detached candidates before commit; verify rollback, failed writes, duplicate references and repeat imports.
4. Model IP address uniqueness, VLAN uniqueness and overlapping networks with an explicit **scope** design before implementing MSP tenants. Current single-inventory restrictions cannot simply become global database constraints.
5. Treat device/IP/rack changes as atomic operations when persisted in a database; maintain equivalent user-facing behaviour.
6. Design audit history, user accounts and tenancy separately from portable inventory backups, with explicit export/restore policies.
7. Compare SQLite and PostgreSQL against deployment complexity, concurrency, backup/restore, tenant isolation, migration support and operating cost; **no database selected yet**.

## Follow-up source review

- Trace every create/update/delete path for devices, allocations, racks, accessories, subnets and VLAN catalogue.
- Inspect all ID generators and historical fixtures for collision/format diversity.
- Map every stored key and decide which belongs in a future database, local preferences, audit archive or recovery store.
- Define migration test fixtures for overlapping VLAN/IP domains, rack collision rules, failed writes and legacy backups.
- Cross-check this audit against final v1.3.0 release artefacts and automated tests.

## Lifecycle review — source-confirmed examples

| Operation | Current behaviour | Future persistence requirement |
| --- | --- | --- |
| Device create/edit | `handleDeviceSubmit` validates device form values, including selected virtual host and primary IP; `setDevicePrimaryIp` checks conflicting device, reservation and gateway ownership before changing the address | Commit device and associated IPAM changes atomically; retain meaningful conflict messages |
| Device delete | `deleteDevice` counts linked allocations and reservations for confirmation, deletes device-owned IPAM records, and clears `reservedForDeviceId` on other records | Explicit transaction with defined deletion policy for linked records |
| Subnet delete | `deleteSubnet` refuses deletion with children; `deleteSubnetCommit` rechecks independent reservations and VLAN ownership, detaches device primary IPs while recording `previousPrimaryIp`, and may remove the corresponding VLAN | Revalidate dependencies at commit time, prevent concurrent changes and preserve previous-IP history |
| VLAN delete | `deleteVlan` checks linked networks using both VLAN number and parent address-block domain | Scoped foreign-key/business-rule checks; never rely on VLAN number alone |
| Rack delete | `deleteRack` refuses deletion while devices or accessories remain mounted | Enforce no-orphan policy for rack placements |
| Rack edit | `handleRackSubmit` rejects shrinking below mounted device or accessory positions | Validate against all placements within one transaction |
| Rack device placement | `validateRackPlacement` checks rack bounds and front/rear overlaps, including applicable accessories | Preserve face-aware and 0U accessory semantics in future constraints |

**Important:** The current `validateApplicationState` check does not visibly validate every cross-reference (for example `virtualHostId` or `reservedForDeviceId`), although individual workflows may perform their own checks. This is a **test-coverage and invariant-review item**, not proof of a user-facing defect. Review all relevant handlers and fixtures before changing code.

### Initial migration test matrix

- Create/edit/delete a device with a primary IP, independent reservation, and reserved-for-device link.
- Delete a network with linked device IPs and its scoped VLAN; confirm blocked deletion when independent reservations or children remain.
- Use the same VLAN number in distinct address blocks without cross-deletion.
- Edit/delete a rack with front/rear mounted devices, overlapping accessories and 0U placements.
- Preserve virtual-host relationships and old IDs across export/import.
- Inject failed persistence between linked changes and verify full rollback.
- Repeat migrations and restores without duplicating UUIDs, records or links.

These findings are based on static source inspection, **not** execution of the regression suite.
