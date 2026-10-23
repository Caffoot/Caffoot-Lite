# Caffoot Lite v1.3.0 WF-11 to WF-13 Baseline Reconciliation

**Status:** Initial source-informed reconciliation, 23 October 2026. Not verified by execution and not signed off.
**Baseline:** Published v1.3.0 `app/caffoot-lite.html`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`.
**Scope:** Preserve the original audit definitions: WF-11 data schema and migrations; WF-12 failure and recovery matrix; WF-13 test traceability. The proposed public repository experience review must use a different identifier.

## WF-11 Data schema and migrations

| Subject | Confirmed source evidence | Remaining requirement |
| --- | --- | --- |
| Required inventory collections | `normaliseState()`, around lines 1392–1417, requires arrays `subnets`, `vlans`, `racks`, `devices` and an object `ipAllocations` | Map fields, record shapes and all relationships, including valid optional and legacy values |
| Optional collections | `normaliseState()` defaults missing or invalid `rackAccessories`, `deviceTypes`, `deviceTypeGraphics` and `deviceLocations` using differing rules | Establish exact compatibility and data-loss implications; retain M-019 for accessory policy |
| Physical location migration | `phase120SeparateLegacyRackLocation()` replaces the legacy `Racked` location on mounted records with `Unknown` while retaining mounting information | Confirm legacy fixtures and reload results |
| Managed values | Normalisation incorporates discovered device types and locations and replaces retired `Blank` location | Test mixed-version inventories and retained custom values |
| Network and IPAM links | Normalisation repairs selected device/IP allocation relationships; central validation checks subnet hierarchy, device IDs, primary IP and rack references | Map all relationships, including virtual hosts, rack accessories and reservation references; retain existing maintenance findings |
| Backup metadata | `phase20CreateBackup()` adds `caffootBackup` metadata with format, schema version, app version and export timestamp | Record exact exported fields, excluded separate browser keys and import compatibility matrix |
| Backup compatibility | `phase20ValidateBackupVersion()` recognises legacy exports without metadata and rejects unsupported future schema versions; `phase20MigrateBackup()` works on a detached copy | Test real legacy fixtures and all relevant failure cases |

**WF-11 decision:** Partially documented, not complete. Do not assume the list above is a complete field-by-field schema. Build an authoritative top-level and nested-field map from the actual default state, normaliser, forms and export code, then verify against fixtures.

## WF-12 Failure and recovery matrix

| Operation or boundary | Documented source behaviour | Required verification |
| --- | --- | --- |
| Startup with unreadable storage | `loadStoredState()` preserves available raw data and enters recovery mode instead of automatically overwriting it | Browser tests for malformed data, storage denial, banner actions and reset failure |
| Normal inventory save | `saveState()` validates, writes and reads back inventory; failure is reported | Caller-specific rollback and UI retry checks, storage failure injection and P12 completion |
| Import before replacement | `importData()` rejects oversized files, unsafe keys and invalid backup shapes before user confirmation | Invalid, legacy and malicious fixture tests, confirmation and cancellation |
| Import safety copy | Import writes and verifies a separate pre-restore snapshot before replacing active inventory | Quota, write denial and readback mismatch tests |
| Import failed replacement | Import restores prior in-memory state and attempts stored inventory and snapshot rollback; failed rollback activates recovery protection | Inject each failure stage and verify recoverability and user feedback |
| Settings clean start | `phase16AClearSystem()` attempts rollback and recovery protection when a reset cannot be verified | Browser failure injection and comparison with emergency recovery reset |
| Network, rack and catalogue mutations | Earlier WF-02 to WF-08 source checkpoints document several rollback paths and known gaps | Consolidate every state-changing caller and its failure message without inventing unverified safeguards |

**WF-12 decision:** Partial cross-workflow inventory only. A complete matrix must identify each mutation, confirmation, storage key, rollback path, resulting UI state, expected message and exact test reference. Reuse existing workflow matrices rather than duplicate scenarios.

## WF-13 Test traceability

| Evidence type | What is known | Missing for sign-off |
| --- | --- | --- |
| Source baseline | Published HTML blob above is identified in earlier audit work | Reconcile other packaged source, dependencies and assets to the actual published release |
| Automated test definitions | `app/package.json` defines `npm run release`, which chains security, restore, rack, subnet, backup, build and packaging checks | Map each test script to requirements and exact fixtures; capture execution results for the target revision |
| GitHub validation | `.github/workflows/validate-hotfix.yml` runs `npm ci` and `npm run release` for relevant application/release-note pull requests | Link a real workflow run and its outcome; confirm package artifact provenance |
| Browser checks | Dedicated workflow matrices and planned scenarios are referenced throughout the coverage audit | Record browser, platform, fixture, steps, observed results and pass/fail evidence |
| Release artifact verification | Published release record and package contents have been inspected in earlier WF-10 notes | Verify actual released ZIP/HTML/checksums and licences, not just expected names |

**WF-13 decision:** Traceability structure started, but no tests were executed as part of this reconciliation. Do not claim automated or browser verification has passed.

## Mandatory completion gate for all three areas

Each area requires (1) technical workflow and source coverage, (2) significant function and P11 review, (3) test matrix and executed evidence, (4) findings and roadmap disposition, (5) documentation and link consistency, and (6) a dated owner-reviewed completion record. No item has been marked complete solely because this document exists.

**Next action:** Finish WF-11's field and relationship inventory; extend WF-12 to every significant save and recovery path; link WF-13 to actual test scripts, fixtures and results; then update the master coverage register. No application source changes are authorised by this document.

## WF-11 default-state field inventory, 23 October 2026

**Direct source evidence:** `app/caffoot-lite.html` lines 1161–1179, published v1.3.0 blob noted above. This is an exact inventory of the keys declared in `defaultData`, **not** a complete schema of imported or persisted states. `normaliseState()` spreads the original raw object, so additional fields may be retained; a complete schema requires separate source tracing.

| Default state field | Default | Source-supported interpretation |
| --- | --- | --- |
| `subnets` | `[]` | Subnet and address-block records; required array in normalisation |
| `vlans` | `[]` | VLAN records; required array |
| `racks` | `[]` | Rack records; required array |
| `devices` | `[]` | Device records; required array |
| `rackAccessories` | `[]` | Rack accessory records; currently defaults to empty for non-array legacy input, subject to M-019 |
| `deviceTypes` | Built-in device type names | Managed device type choices; normalisation merges discovered device types |
| `deviceTypeGraphics` | `{}` | Per-type graphics configuration; non-object input becomes empty |
| `deviceLocations` | `['Unknown']` | Managed locations; normalisation merges discovered device locations |
| `ipAllocations` | `{}` | IP allocation lookup; required object |
| `serverFunctions` | `[]` | Default collection; exact relationship to managed server services still needs tracing |
| `installedSoftware` | `[]` | Default collection; exact relationship to software catalogue still needs tracing |
| `managedOptionsCleared` | `false` | Default preference flag; usage and migration semantics still need tracing |

`STATE_VERSION` is **3** at line 1176 and is assigned to normalised state by `normaliseState()`. This internal state version is **not the same** as the backup schema version, which is **1** in `phase20CreateBackup()` near lines 7453–7465. Keep these version identifiers separate in documentation and future migration work.

**Required next checks:** Identify all other top-level fields introduced or preserved by normalisation, catalogue editors and save paths; map nested device, rack, accessory, subnet, VLAN and IP allocation fields and references; confirm `serverFunctions`, `installedSoftware`, managed catalogues and optional preferences; trace browser storage keys excluded from inventory export; check legacy fixtures. No browser or automated tests were executed for this field inventory.

## WF-11 nested records and cross-record relationships, 23 October 2026

**Evidence:** Direct inspection of published `app/caffoot-lite.html` at the baseline blob, especially lines 6140–6210, 6324–6360, 6940–6963, 7122–7124, 7165–7179 and 8103–8115. The following is a **source-supported partial field map**, not a full schema contract.

| Record or collection | Observed fields and relationships | Behaviour and limits |
| --- | --- | --- |
| `devices[]` | Creation includes `id`, `name`, `type`, `mountType`, `location`, `notes`, `status`, `manufacturer`, `model`, `serialNumber`, `typeDetails`, `virtualPlatform`, `virtualHostId`, `ipReserved`, `primaryIp`, `rackId`, `face`, `rackUStart`, `rackUEnd`, `rackUHeight` | Existing device edits can also preserve additional fields, including `previousTypeDetails`; not all legacy and optional fields are listed here |
| `devices[].typeDetails` | Type-specific values; selected software and server services may be represented as Boolean values indexed by catalogue `key` | Catalogue labels can change while keys remain stable; archive visibility and historical rendering still require tests |
| `devices[].virtualHostId` | References another `devices[].id` for a physical server | The device form checks selected host when saving a virtual server; central validation and incoming dependencies on host deletion/conversion remain open under M-005/M-008 |
| `devices[].rackId` | References `racks[].id`; rack position also uses `face`, `rackUStart`, `rackUEnd`, `rackUHeight` | Central validation checks some rack consistency but is not a complete occupancy proof |
| `rackAccessories[]` | Accessory editor constructs `id`, `rackId`, `type`, `name`, `face`, `startU`, `heightU`, `side`, `portCount` | `side` applies to vertical accessories and `portCount` to patch panels; import validation of accessory relationships remains a separate open concern |
| `installedSoftware[]` | Entries read through `phase19BSoftware()`, typically using `key`, `label`, optional `deviceTypes` and `archived` | This collection is the managed software catalogue, **not** a per-device list despite its name; legacy manager removal and dedicated archive are not equivalent (M-028) |
| `serverFunctions[]` | Entries read through `phase19BServerFunctions()`, using `key`, `label` and optional `archived` | This is the managed server services catalogue; built-in suggestions are offered by the view layer rather than automatically stored |
| `hardwareCatalogue` | Optional top-level collection read as an array and modified by manufacturer/model editors | It is not declared in `defaultData`; edits may introduce it, and normalisation can preserve raw top-level fields. It supplies suggestions rather than replacing saved device manufacturer/model text |
| `managedOptionsCleared` | Set to `true` by Settings Clean Start | Exact consequences across every catalogue and legacy import combination remain to be reconciled |

**Relationship diagram in words:** Device primary IP relates to `ipAllocations` and subnet membership. Device rack mounting relates to `racks`; accessories also relate to racks but occupy separate records. Virtual servers relate to physical devices by ID. Software and server service catalogue entries relate to type-specific device fields by stable keys. Hardware catalogue manufacturer/model suggestions do not directly rewrite device text.

**Compatibility warning:** The normaliser merges defaults and raw top-level fields. It is therefore incorrect to claim that `defaultData` lists every possible stored field, or that the source enforces every relationship in this table. Before introducing stricter validation, investigate older inventories and preserve the ability to recover or repair imperfect saved data.

**Remaining WF-11 work:** Enumerate subnet, VLAN, rack and allocation record fields; inspect additional optional device fields and historical configuration records; trace storage keys and export exclusions; reconcile migration and backup fixtures; review all relationships against actual validation call paths. No tests were run for this checkpoint.

## WF-11 network, rack and IP allocation field map, 23 October 2026

**Evidence:** Direct inspection of published `app/caffoot-lite.html`, principally lines 4672–4840, 5095–5180, 5440–5477 and 1515–1535. These are fields written by the inspected creation/editing paths, not a claim that all legacy records contain precisely these fields.

| Collection | Confirmed record fields | Relationships and compatibility |
| --- | --- | --- |
| `subnets[]`, address block | `id`, `kind: 'container'`, `cidr`, `name`, `description`, `parentId` | `parentId` may link to another subnet container; hierarchy validation checks ancestry, containment and overlap |
| `subnets[]`, network | `id`, `cidr`, `name`, `vlan`, `gateway`, `description`, optional `parentId`; `kind` may be absent on legacy network records | Network edits spread the existing record before updating fields, preserving other existing properties; a missing kind is treated as network in relevant code |
| `vlans[]` | `id`, `vlanId`, `name`, `description`, `color`, optional `parentId` | VLAN number is scoped to an IP Address Block domain, not globally unique; legacy unscoped VLANs require explicit reconciliation rather than guessed ownership |
| `racks[]` | `id`, `name`, `heightU`, `widthMm`, `depthMm`, `depth`, `type`, `location` | `depth` is also written as a formatted millimetre string; devices and accessories reference `racks[].id`; resize checks mounted extents |
| `ipAllocations` | Object indexed by IP address string; inspected entries use `status`, `deviceId`, `hostname`, `notes`, and sometimes `reservedForDeviceId` | Device primary IP synchronisation can create or update entries; manual allocation editing preserves existing extra properties before changing selected fields |

**Important boundary:** The current central validator checks primary-IP ownership and some rack links, but does not establish every possible relationship, including all reserved-for references and imported accessory occupancy. Do not tighten the shared validator without a migration and recovery policy for existing imperfect inventories.

## WF-11 browser storage and export boundaries, 23 October 2026

| Storage key or family | Purpose from source | Inventory backup treatment |
| --- | --- | --- |
| `caffoot_state` | Active saved inventory | Export uses the in-memory inventory object and adds backup metadata; it is not a byte-for-byte export of this storage entry |
| `caffoot_audit_v1` | Separate bounded local change history | Not included by `phase20CreateBackup(state)` |
| `caffoot_theme_preference`, `caffoot_dark` | Appearance preference and legacy/dark-mode support | Separate browser preferences, not included in inventory export |
| `caffoot_browser_storage_notice_v1` | Remembered browser storage warning acknowledgement | Not included in inventory export |
| `caffoot_phase11_pre_restore` | Separate pre-restore safety copy | Not included in inventory export |
| `caffoot_phase11c_pre_repair_v1` | Pre-repair safety copy | Not included in inventory export |
| `caffoot_phase12b_prebulk_snapshot` | Pre-bulk-change safety copy | Not included in inventory export |

**Export evidence:** `phase20CreateBackup(state = appState)` clones the supplied state and adds `caffootBackup` metadata. The separate browser keys above are not members of `defaultData` and are not explicitly appended to that export. A separate source-wide storage-key audit is still required before claiming this table exhausts every stored preference or safety record.

**WF-11 status:** Top-level defaults, significant nested records, core relationships and key storage/export distinctions now have a documented source-based map. Remaining: complete legacy field inventory, all secondary storage keys and migration branches, fixture-backed compatibility tests and P11/P12 reconciliation. No automated or browser tests executed for this update.

## WF-11 migration, repair and storage boundary reconciliation, 23 October 2026

**Evidence:** Direct source review of published v1.3.0 `app/caffoot-lite.html` lines 1392–1553, 1617–1651, 1738–1749, 2153–2171, 2199–2205, 4503 and 7506–7525. Source inspection only.

### Normalisation sequence and its limits

1. `normaliseState(raw)` requires a plain object, `subnets`, `vlans`, `racks` and `devices` arrays, and an `ipAllocations` object. It combines defaults with raw fields and assigns internal `stateVersion: 3`.
2. Legacy mounted devices with the retired `Racked` physical location are copied with `location: 'Unknown'`. Missing or retired `Blank` locations are also replaced. Managed type/location choices incorporate values discovered in saved devices.
3. Subnets, hierarchy and VLANs are checked, including address-block scoped VLAN numbers. The code distinguishes non-network address blocks from ordinary networks and permits legacy network records without an explicit `kind`.
4. Devices are checked for identity, supported mounting, primary IP, rack references and rack position bounds. IP allocation entries are checked for valid addresses, subnet membership and existing device links.
5. For devices with a primary IP, the normaliser can create or reconcile an allocation record, making the device authoritative for its primary IP, allocation owner, hostname and notes. It can clear stale allocation ownership in subsequent reconciliation. These are **specific** compatibility repairs, not a general guarantee that all invalid relationships are fixed.
6. `loadStoredState()` parses and screens stored JSON, rejects unsafe keys and invokes normalisation. On a loading failure it retains the original raw stored text for recovery rather than overwriting it. Startup then performs an integrity check but intentionally does not write a normalised state automatically.

**Compatibility implications:** An older inventory may be accepted after a narrowly defined repair, rejected for an invalid mandatory field, or left with a relationship that the current validators do not check. Future validation changes must consider each case and provide a recoverable migration path. Source inspection does not establish which real historical backups pass; fixture and browser tests remain mandatory.

### Browser storage source trace

The following keys are directly observed in the published source: active inventory `caffoot_state`; change history `caffoot_audit_v1` (bounded to 200 events); appearance `caffoot_theme_preference` and `caffoot_dark`; browser storage notice `caffoot_browser_storage_notice_v1`; pre-restore safety copy `caffoot_phase11_pre_restore`; pre-repair copy `caffoot_phase11c_pre_repair_v1`; and pre-bulk-operation copy `caffoot_phase12b_prebulk_snapshot`. The code also contains `personalSafeStorageGet(key)`, a generic guarded reader; the listed literal keys are not a proof that every dynamic or historical key has been inventoried.

The inventory export clones the in-memory inventory and adds `caffootBackup` metadata. It does not append the separate audit, appearance, warning or recovery storage entries. This distinction should be made clear in future user-facing backup guidance.

### Follow-up test evidence needed

- Legacy records with missing managed options, legacy `Blank` and `Racked` locations, missing and inconsistent device IP allocations, and mixed hierarchy/VLAN ownership
- Malformed mandatory collections, optional accessory collection with an invalid type, dangling virtual host, rack accessory and reservation references
- Startup with malformed or inaccessible browser storage, confirming recovery mode, original-byte preservation and no automatic overwrite
- Import and export round trips showing which browser keys are included, excluded or separately retained
- Backup compatibility across supported historical releases and recovery after simulated storage write/readback failures

**Decision:** The source-level WF-11 migration and key inventory has advanced, but WF-11 remains **partial** until fixture-based tests, complete legacy record mapping, function/P11 review and the six-part completion gate are satisfied. Existing M-005, M-019, M-024 and M-028 investigations must not be silently closed.

## WF-12 source-traced failure and recovery matrix, 23 October 2026

**Evidence baseline:** Direct inspection of published `app/caffoot-lite.html` at lines 1617–1651, 1822–1856, 2250–2286, 4493–4518, 7385–7450 and 7785–7855. This matrix describes observed code paths and verification still required, not completed runtime tests.

| Path and source | Failure point | Source-supported response | Recovery evidence still needed |
| --- | --- | --- | --- |
| Startup, `loadStoredState()` | Browser storage read denied; malformed or structurally invalid JSON; unsafe keys; failed normalisation | Retains unreadable raw text where available, activates recovery mode, does not automatically write inventory | Simulate each failure; confirm recovery banner, blocked saves, raw download and reset behaviour |
| Shared `saveState()` | Recovery mode; integrity errors; storage write exception; readback mismatch | Returns `false`, reports error; successful write precedes best-effort audit logging | Check each caller rolls back in-memory changes; verify failure messages and persistent bytes |
| Change history, `recordAudit()` | Audit diff error or separate history write failure | Save remains successful; audit failures are caught and history write can display a warning | Confirm failed history storage cannot turn a successful inventory write into a failed transaction |
| Subnet form, `handleSubnetSubmit()` | Hierarchy/VLAN/gateway/dependency validation or failed save | Rejects invalid proposal; on save failure restores JSON snapshot and prior selection/draft subnet | Test existing and new subnet, retained legacy fields and nested return-to-device flow |
| Rack form, rack submit path | Invalid dimensions, occupied positions on resize, declined correction or failed save | Rejects invalid changes; on failed save restores prior in-memory state | Test rack resize with devices and accessories, including legacy rack dimensions |
| IP allocation, `handleIpSubmit()` | Protected gateway or device primary IP; failed save | Rejects protected edits; on failed save restores the previous allocation or removes newly created entry | Test status changes, reserved references and storage write failures |
| Bulk IPAM, `phase12BApply()` | Expired/recalculated plan; snapshot write exception; failed save | Cancels on snapshot write exception; failed save restores in-memory inventory and clears audit reason | **Open risk:** source writes snapshot but does not read it back before mutation. Test silent storage failures and confirm expected policy before calling this verified protection |
| IPAM repair, `phase11CApply()` | Stale preview; conflicting owner; snapshot write or save failure | Rejects stale preview; attempts in-memory rollback and previous snapshot restoration | **Open risk:** snapshot is written without immediate readback; snapshot rollback errors are swallowed. Test quota, silent write and rollback failure cases |
| Clean Start, `phase16AClearSystem()` | Safety snapshot or clean inventory write/readback failure | Attempts to restore original inventory and safety snapshot, verifies rollback and blocks further saves if rollback cannot be verified | Test all write/readback stages, separate browser keys and emergency recovery behaviour |
| Backup import, `importData()` | Parse, unsafe keys, version, shape, compatibility, user cancellation | Validates and requests confirmation before replacing active inventory | Test real historical backups and each pre-replacement rejection |
| Backup import, `importData()` | Safety snapshot write/readback failure | Cancels replacement before changing active inventory | Inject exceptions and silent failed writes |
| Backup import, `importData()` | Candidate save/readback failure | Restores original in-memory state and attempts saved inventory and safety snapshot rollback | Test all failure stages and compare original bytes |
| Backup import, `importData()` | Failed rollback verification | Activates recovery protection, blocks further saves and provides raw original-data recovery path | Verify banner, blocked actions and recoverable original bytes |

### WF-12 findings and proposed verification priorities

1. **Priority review:** Bulk IPAM and confirmed IPAM repair both write a safety snapshot, but the inspected paths do not immediately verify its persisted value before mutating state. This differs from import and Clean Start. Record as a **source-observed safeguard inconsistency**, not as a demonstrated user-facing defect. Determine whether a readback and rollback escalation are needed in a separately approved code change.
2. **Priority review:** `phase11CApply()` swallows errors while attempting to restore a previous safety snapshot after failure. Investigate whether recovery protection should activate when rollback cannot be verified. Do not change behaviour during a documentation-only audit.
3. **Completion gap:** P12 must trace **every** `saveState()` caller, including device, catalogue, rack accessory, network and preferences operations, and distinguish durable storage rollback from in-memory rollback.
4. **Test standard:** For each row, record the baseline commit, input fixture, fault injected, expected stored bytes, expected active state, message, recovery availability and actual observed result. Until run, status is **Not executed**.

**WF-12 status:** The principal recovery boundaries now have a source-traced matrix and two explicit consistency review items. WF-12 remains **partial** pending exhaustive caller coverage, runtime failure injection, P11 review and owner-approved completion record.
