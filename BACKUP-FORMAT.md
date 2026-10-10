# Caffoot inventory interchange — schema 1

This document describes the implemented Lite export/import contract. It is the reference for the future Pro importer; **Pro import is not implemented or verified yet**. The examples contain fictional inventory only.

## Envelope and versions

A backup is a UTF-8 JSON object. Inventory remains at the top level; there is no nested `data` wrapper. New exports add:

```json
"caffootBackup": {
  "format": "caffoot-inventory",
  "schemaVersion": 1,
  "app": "Caffoot Lite",
  "appVersion": "1.0.0-rc.1",
  "exportedAt": "2026-10-10T15:00:00.000Z"
}
```

`schemaVersion` is the interchange version. `appVersion` identifies the producer and does not determine compatibility. `stateVersion` is Lite's internal normalisation version (currently 3), separate from the interchange version. Metadata permits producer `Caffoot Lite` or `Caffoot Pro`; this is an identifier, not proof that Pro exists or every Pro feature can be represented in Lite.

Missing `caffootBackup` identifies a legacy unversioned inventory (logical schema 0). A present malformed metadata object is rejected. Schema versions above 1 are rejected with an update message. Never remove metadata from a future backup to bypass this guard.

## Inventory mapping

| Field | Shape and meaning |
| --- | --- |
| `devices` | Array of device objects; stable unique `id`, `name`, `type`, `mountType`, `location`, `primaryIp`, `ipReserved`, `status`, manufacturer/model/serial/notes, optional `typeDetails`, and rack placement fields. |
| `subnets` | Array with `id`, `name`, network-boundary `cidr` (/23–/30), numeric `vlan` (1–4094), usable `gateway`, and `description`. Subnets cannot overlap. |
| `vlans` | Required array with unique `id`, unique numeric `vlanId` (1–4094), `name`, optional `description` and `color`. |
| `racks` | Array with `id`, `name`, `heightU`, `depth`, `type` and `location`. |
| `rackAccessories` | Array with `id`, `rackId`, `type`, `name`, `face`, `startU`, `heightU`, and optional `portCount`. Missing legacy list becomes empty. |
| `ipAllocations` | Object keyed by dotted IPv4 address. Values include `status` (Assigned/Reserved/Available), `deviceId`, `hostname`, `notes`, optional `reservedForDeviceId` and historical allocation fields. |
| `deviceTypes`, `deviceLocations` | Managed string arrays. Missing legacy lists receive defaults and discovered device values; `Blank` locations migrate to `Unknown`. |
| `deviceTypeGraphics` | Mapping of managed type to graphic selection; defaults to an empty object. |
| `serverFunctions`, `installedSoftware` | Managed option arrays, normally `{key,label}` objects. Preserve historical option definitions and device `typeDetails` values. |
| `managedOptionsCleared` | Boolean preserving intentional empty option lists. |
| Additional fields | Lite's normalisation preserves unknown properties through its object spread. A future Pro importer must preserve supported extras or clearly report unsupported fields; do not silently discard them. |

IDs are references, not display names. A device's `rackId` references a rack; an allocation's `deviceId` references a device. A mounted device uses `mountType: "Rack Mounted"`, `location: "Racked"`, `face: "front"` or `"rear"`, and inclusive U positions where `rackUEnd = rackUStart + rackUHeight - 1`. A Desktop device has no rack assignment. A device primary IP belongs to an existing subnet and is unique.

## Implemented import pipeline

1. The file-input path rejects files over 10 MiB and parses JSON.
2. Reject `__proto__`, `prototype` and `constructor` keys anywhere in the object graph before normalisation.
3. Check required collection shapes and safety limits (50,000 each for devices/subnets/racks; 100,000 allocations). `vlans` is also required by normalisation.
4. Validate envelope metadata and supported schema.
5. `phase20MigrateBackup` makes a detached JSON copy and invokes `normaliseState`. Schema 0 and 1 currently share this normalisation; no future-schema migration is claimed.
6. Normalise legacy defaults, map Blank/missing device locations to Unknown, and repair recoverable primary-IP hostname/notes/ownership drift from the device record. Device primary records are authoritative; unsupported or inconsistent relationships fail validation.
7. Validate the candidate while restoring the previous active state in `finally`.
8. Show counts and require the user's replacement confirmation. Create and verify a pre-restore snapshot, persist and verify the candidate, and roll back or enter protected recovery mode if persistence fails.

Preview/migration does not modify the input JSON object or the original file, active inventory or saved inventory. Restore replaces inventory; it is not a merge. Backups exclude separately stored audit history, theme preference, acknowledgement state and recovery snapshots. Export audit history separately if needed. Do not treat a JSON backup as encrypted.

## Evolution policy and Pro requirements

For a future schema, introduce an explicit supported-version dispatcher and ordered, tested migrations on detached data. Keep immutable fixtures for every supported schema, reject unsupported future versions before changes, and review any migration that changes meaning or drops fields. App version updates alone do not require a schema bump; incompatible data semantics do.

Pro should validate first, present a preview and conflict policy, map stable IDs and references, then import in a single database transaction. A failed import must leave the database unchanged. This is a future requirement, not tested Pro behaviour. Pro-only data may require a new schema; same appearance does not imply bidirectional backup compatibility.

## Reference fixtures and tests

- `app/fixtures/lite-schema-v1.example.json`: two devices, subnet/VLAN, rack, rear patch panel, assigned/reserved IPs, managed options and historical detail field.
- `app/fixtures/lite-legacy.example.json`: equivalent unversioned inventory with absent managed lists and retired Blank location.
- `npm run check:backup-contract`: actual normalisation, non-mutation, populated round trip, legacy migration, drift repair and rejection.
- `test-browser-upgrade.cjs`: generated HTML export/import through the real file input into moved/renamed copies, persistence, cancellations and unsupported-schema rejection, offline.
