# Caffoot Lite v1.3.0 WF-11 to WF-13 Baseline Reconciliation

**Status:** In progress, 23 October 2026. Source inspection remains partial; historical automated release execution evidence has been recovered for WF-13, but browser execution and full traceability are not signed off.
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
| GitHub validation | `.github/workflows/validate-hotfix.yml` runs `npm ci` and `npm run release` for relevant application/release-note pull requests; historical successful run `39605067641` and exact release-source comparison are recorded below | Confirm published package artefact provenance and remaining test-to-requirement mapping |
| Browser checks | Dedicated workflow matrices and planned scenarios are referenced throughout the coverage audit | Record browser, platform, fixture, steps, observed results and pass/fail evidence |
| Release artifact verification | Published release record and package contents have been inspected in earlier WF-10 notes | Verify actual released ZIP/HTML/checksums and licences, not just expected names |

**WF-13 decision:** Traceability remains partial. No new tests were executed in this audit checkpoint, but historical successful automated release execution was recovered and verified later on 23 October 2026, as recorded below. Do not claim the separate browser workflow has passed without its run evidence.

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

## WF-12 direct save caller reconciliation, 23 October 2026

**Method:** Search of the published `app/caffoot-lite.html` for direct `saveState()` invocations and inspection of surrounding error paths. There are **36 textual occurrences**, including the function declaration, hence **35 direct call sites**. This is a source-level census of the literal call form, not a call-graph proof of every indirect persistence route.

**Established rollback groups:** Subnet and VLAN editing/reconciliation; IP allocation; rack creation, correction and moves; device edits and placement; rack accessory create, delete and move; hardware, software and service catalogues; managed type/location changes; software preference changes; IPAM bulk operations and repair; Clean Start; backup restore. Most inspected handlers check the boolean return and restore a prior in-memory value or snapshot. Clean Start and backup restore additionally attempt to verify and roll back persisted browser storage.

**Three direct call sites need targeted review:**

| Source line | Operation | Observed code | Risk and test required |
| --- | --- | --- | --- |
| 2821 | Device type graphic preset change | Mutates `appState.deviceTypeGraphics`, then invokes `saveState();openManageTypesModal();renderContent();` without checking the result | A rejected save may leave the changed preset visible in memory. Inject a failed save and confirm whether UI and stored data diverge |
| 5678 | Rack device unassignment | Clears rack fields, changes mount type, then invokes `saveState();renderContent();` without checking the result | A rejected save may leave the unassigned device in memory although storage retains its earlier rack placement. Test storage failure and reload |
| 7035 | Add physical location from device form | Adds to `appState.deviceLocations`, invokes `saveState();`, then displays an unconditional added-location toast | Save failure may still be followed by a success message and an unsaved option in memory. Test invalid storage and recovery mode |

These are **source-observed unchecked save results**, not yet reproduced defects. They warrant explicit maintenance findings and approval before any application change. Do not assume the shared `saveState()` protects callers from in-memory changes already made.

**Additional nuance:** Some successful inventory writes are followed by best-effort change-history recording; failure of the separate audit history does not invalidate the inventory save. Conversely, rollback that restores only `appState` does not prove browser storage rollback when a write or readback fails partway through. Both cases require distinct failure-injection assertions.

**Next checks:** Inspect dynamic or indirect save dispatch, assess whether any other handlers mutate shared nested objects before copying, record these three cases in the maintenance findings register, and execute browser tests with controlled write failures. WF-12 remains open.


## WF-12 in-memory state versus saved browser data, 23 October 2026

**Source baseline:** Published v1.3.0 `app/caffoot-lite.html`, especially `saveState()` lines 1825–1855, `phase13GSaveGraphics()` 2815–2822, rack save 5430–5480, `unassignDevice()` 5669–5682 and `addCustomLocationOption()` 7018–7044. No runtime failure injection performed.

The central `saveState()` validates the **current in-memory** `appState`, writes it to `caffoot_state`, reads the stored string back, and returns a Boolean. It **does not itself undo mutations** already made by the caller when validation or storage fails. Callers therefore need to handle both the Boolean result and their own temporary UI and state changes.

| Case | Before attempting save | After a failed save in inspected code | Distinct test expectation |
| --- | --- | --- | --- |
| M-001, rack unassignment | Device rack fields are cleared and mount type set to Desktop | Save result is ignored; page is rerendered with modified in-memory device | On injected failure, compare rack placement immediately, persisted inventory, and placement after reload |
| M-018, new physical location | New option is inserted into the device form and `deviceLocations` | Save result is ignored; success toast and form changes continue | Compare toast, option list, in-memory managed locations and stored locations after reload |
| M-020, device graphic preset | `deviceTypeGraphics` is changed | Save result is ignored; management modal opens and page rerenders | Compare selected graphic before and after reload with storage failure |
| M-022, new rack selection | New rack is pushed and `selectedRackId` points to it | Inventory JSON snapshot is restored, but prior `selectedRackId` is not explicitly restored | Check selection, navigation and any subsequent rack actions after failed save |
| Ordinary rack move | Rack placement fields change | Prior inventory JSON is restored and handler returns | Confirm both visible placement and persisted placement remain consistent |

**Important qualification:** A failed save may follow a successful write but failed readback, or may occur before any write. Therefore, observing an in-memory rollback alone cannot prove stored bytes are unchanged. Tests must separately inspect the saved value, the live view and the state after reopening the application.

**Test fixture specification for WF-13:** Use a fictional rack, device, location and graphics preset. For each path inject (a) `localStorage.setItem` throwing, (b) a write that silently fails, (c) readback throwing or mismatching, and (d) validation rejecting the proposed state. Record previous and subsequent `caffoot_state` bytes, visible UI, any success/error notification and reload result. Avoid real inventories. The central helper's success toast can be followed by later operation-level verification failures in restore/reset paths, so notification timing must be assessed separately.

**Status:** The direct unchecked-save paths and M-022 selection issue are traced to the existing roadmap. The table is a test plan, not observed browser outcomes. Do not mark WF-12 or WF-13 verified.


## WF-12 direct browser-storage write inventory, 23 October 2026

**Inspection method:** Searched published v1.3.0 `app/caffoot-lite.html` for direct `localStorage.setItem()` and `localStorage.removeItem()` expressions, then read the surrounding handlers. This is a textual source census, not execution, proof of every indirect storage access or complete browser testing.

| Storage operation | Source handler and approximate line | Verification or failure behaviour seen in source | Roadmap or follow-up |
| --- | --- | --- | --- |
| Main inventory | `saveState()`, 1839 | Reads back exact serialized bytes; returns false on validation, access or mismatch errors | Central reference for WF-12 |
| Emergency recovery reset | Recovery banner reset click, 1672–1676 | Two confirmations; direct write then reload, without explicit readback | Existing M-014 |
| Theme preference and dark flag | `caffootSetTheme()`, 1714–1721; system listener, 1724–1729 | Catches thrown storage errors; does not verify readback; non-inventory preference | WF-09 usability test, no new finding yet |
| Audit history | `recordAudit()`, around 1795 | Separate best-effort write after main inventory verification | Existing M-029 |
| Browser storage notice | Notice acknowledgement, around 2170 | Best-effort preference marker; separate from inventory | WF-01 browser notice tests |
| IPAM integrity repair safety copy | `phase11CApplyRepair()`, 2261 and 2277–2278 | Snapshot write without immediate readback; rollback snapshot reinstatement may fail silently | Existing M-012 |
| Bulk IPAM safety copy | `phase12BApply()`, 4503 | Snapshot write guarded against throws but not verified by readback; main save failure restores memory | New M-031 |
| Clean Start safety copy and rollback | Clean Start handler, 7413 and 7431–7436 | Dedicated safety and inventory verification in operation; rollback includes secondary storage keys | WF-12 operation-level tests |
| Backup import safety copy and rollback | `importData()`, 7809 and 7830–7833 | Dedicated safety and inventory verification in operation; rollback handles secondary snapshot | Existing M-011 and WF-06 |

**Scope clarification:** Direct `removeItem()` calls seen in this search occur during safety snapshot restoration, not an independent inventory deletion flow. Direct calls can coexist with helper-mediated storage reads and writes, so this is not a claim of exhaustive storage interaction coverage.

**WF-13 test additions:** For emergency reset, preserve original unreadable bytes first; simulate a thrown write, silently unsuccessful write and successful verified write. Check whether the page reloads, whether the recovery banner remains, and what data is present after restart. For bulk IPAM, separately fail the safety snapshot write, its readback and the main inventory write. Compare persisted bytes and user feedback; do not infer persistence from the live screen.

**Reconciliation:** M-014 and M-031 are existing roadmap references; no duplicate issues created. No application code changed, no browser tests executed and WF-12/WF-13 remain open.


## WF-13 executable test command inventory, 23 October 2026

**Evidence inspected:** Published v1.3.0 `app/package.json` on the documentation branch, compared with the published HTML baseline. The package manifest defines a chained `npm run release` script. **No command listed below was executed in this checkpoint.** The command names and script targets establish the intended scope only; test assertions, fixtures and results require separate inspection.

| Area | Defined npm commands | Declared script targets | Execution evidence for this checkpoint |
| --- | --- | --- | --- |
| Device form, lifecycle and managed data | `check:device-form-tabs`, `check:device-type-history`, `check:location-mounting-contract`, `check:software-platform-catalog`, `check:device-software-separation`, `check:security-device-cascade` | `test-device-form-tabs.cjs`, `test-device-type-history.cjs`, `test-location-mounting-contract.cjs`, `test-software-platform-catalog.cjs`, `test-device-software-separation.cjs`, `test-security-device-cascade.cjs` | Not executed |
| Rack placement and accessories | `check:rack`, `check:security-accessory-modal`, `check:security-accessory-text`, `check:security-racks` | `test-rack-placement.cjs`, `test-rack-specifications.cjs`, `test-security-accessory-modal.cjs`, `test-security-accessory-text.cjs`, `test-security-racks.cjs` | Not executed |
| IPAM and network structure | `check:security-ipam`, `check:subnet`, `check:subnet-deletion`, `check:subnet-hierarchy` | `test-security-ipam.cjs`, `test-subnet.cjs`, `test-subnet-deletion.cjs`, `test-subnet-hierarchy.cjs` | Not executed |
| Backup, storage, migration and recovery | `check:restore`, `check:security-reset`, `check:security-backup`, `check:security-storage`, `check:legacy-mount-repair`, `check:backup-contract` | `test-restore.cjs`, `test-security-reset.cjs`, `test-security-backup.cjs`, `test-security-storage.cjs`, `test-legacy-mount-repair.cjs`, `test-backup-contract.cjs` | Not executed |
| Privacy, security and dashboard | `check:release-privacy`, `check:network-surface`, `check:security-xss`, `check:security-list`, `check:security-dashboard`, `check:security-managed-fields`, `check:personal` | Corresponding `check-*.cjs` or `test-*.cjs` scripts as declared in the package manifest | Not executed |
| Release, source and package | `check:updates`, `build`, `check:build`, `package`; `check:source` is defined separately | `test-updates.cjs`, `build-offline.cjs`, `verify-build.cjs`, `package-release.cjs`; separate `check-offline.cjs` | Not executed |

**Coverage caveats:** `check:source` and `check:build` are distinct. The release chain includes `check:build` after `build` but does **not** invoke the separately defined `check:source` command. The release chain also does not establish browser behaviour under injected storage faults merely by naming security/storage tests. No automated command should be marked as covering M-001, M-012, M-014, M-018, M-020 or M-031 until its assertions and fixtures are inspected and relevant tests are run.

**WF-13 next evidence steps:** (1) Inspect each relevant test file and map actual assertions to the WF requirements; (2) record fixture provenance and expected behaviour; (3) execute tests on a recorded commit in a suitable environment; (4) record pass, fail, skipped and blocked separately; (5) run the browser-only recovery scenarios using disposable data; (6) reconcile published artefact provenance and complete the six-part approval gate. The source manifest alone proves none of these execution outcomes.


## WF-13 storage and recovery test assertion review, 23 October 2026

**Method:** Read four existing Node test files from the published v1.3.0 source on the documentation branch. These are **source-inspected test definitions**, not executed tests or browser observations.

| Test script | Assertions actually present | Important limits |
| --- | --- | --- |
| `app/test-security-storage.cjs` | Extracts `loadStoredState()` and unsafe-key guard from production HTML into a Node VM; checks a valid saved inventory remains unchanged; tests three unsafe JSON-key payloads; checks recovery reason, retained original raw bytes and no prototype pollution | Does not simulate unavailable storage, malformed JSON recovery, recovery-banner reset, save failures or a real browser |
| `app/test-security-reset.cjs` | Extracts Clean Start handler into a Node VM; simulates a main save returning false after changing stored inventory; tests successful rollback, silently unsuccessful inventory rollback and silently unsuccessful safety-snapshot rollback; checks in-memory inventory, stored values, recovery mode and error messages | Covers Clean Start, **not** the separate emergency reset button in the startup recovery banner (M-014). Main `saveState()` is stubbed, not executed |
| `app/test-restore.cjs` | Extracts import handler and helper into a Node VM; uses a simulated file reader, confirmation and storage; covers safety snapshot failure, replacement save failure, rollback failure, successful import and recovery/error paths | The main save helper, backup validation and normalisation are stubbed. Does not prove full browser import compatibility, all silent-write failures or restoration of prior secondary snapshot bytes (M-011) |
| `app/test-security-backup.cjs` | Extracts backup version and validation functions; checks versioned and legacy backup acceptance, future/malformed schema metadata rejection, unsafe nested keys, malformed JSON, oversized collection guards and preservation of active inventory after rejection | `normaliseState()` and `validateApplicationState()` are stubbed, so this does not demonstrate full imported rack/accessory/virtual-host integrity or end-to-end browser restore |

**Coverage conclusions:** The existing tests contain substantive targeted assertions, especially for Clean Start rollback and hostile backup input. However, a passing result from these isolated VM tests would not prove the emergency recovery reset (M-014), bulk IPAM snapshot readback (M-031), unchecked save callers (M-001, M-018, M-020), integrity repair (M-012), or complete imported relationship validation (M-005, M-019). Preserve the distinction between **script inspected**, **test run** and **browser verified**.

**Follow-up:** Record actual run results and exact commit; inspect further scripts before making any broad automated coverage claim; define isolated fault-injection scenarios for the untested handlers; reconcile dedicated test matrices. No new defect is asserted solely because a test does not cover a particular path.


## WF-13 additional test definition inspection, 23 October 2026

Inspected four further scripts from the v1.3.0 source. **Inspection only: none was executed in this checkpoint.**

| Script | Source-supported coverage | What this does not establish |
| --- | --- | --- |
| `app/test-backup-contract.cjs` | Uses populated schema-v1 and legacy fixtures; checks migration without mutating source data, rack position retention, accessory and IP allocation retention, export/import round trips, primary IP record repair, rejected invalid examples and optional field preservation | Full browser import, persistence failure injection and every possible legacy inventory |
| `app/test-legacy-mount-repair.cjs` | Checks legacy mounting correction, preservation of notes and primary IP, unchanged valid devices, idempotence, retired `Racked` locations, orphaned mounts and ambiguous wireless access point handling | All imported rack collision cases or end-to-end browser repair confirmation |
| `app/test-security-ipam.cjs` | Inspects IPAM renderer output escaping and hostile text handling | IPAM bulk persistence, snapshot verification or subnet integrity under storage failure |
| `app/test-security-device-cascade.cjs` | Inspects device subnet/VLAN cascade escaping of hostile imported names and identifiers | Device relationship integrity, unchecked save results or full UI interactions |

**Traceability decision:** Existing fixture-backed backup tests offer stronger compatibility evidence than test names alone suggested. They are still not equivalent to executed tests on this branch or browser verification. M-031, M-014 and existing import/rack findings remain investigations, not newly confirmed defects. Next reconcile actual fixture paths and execute the defined commands on an identified source revision.


## WF-13 fixture provenance and execution availability, 23 October 2026

Read the two fixtures referenced by `app/test-backup-contract.cjs` from this documentation branch: `app/fixtures/lite-schema-v1.example.json` and `app/fixtures/lite-legacy.example.json`. Both are JSON objects with two devices, one rack and one rack accessory. The schema-v1 fixture also declares `caffootBackup` metadata; the legacy example does not. These are repository test fixtures, not evidence of real user inventories or comprehensive compatibility.

Checked GitHub Actions runs associated with published v1.3.0 commit `92d6a60b0e4bc9f73589b27820cb283def377dbd`. The available connector lookup, which only returns pull-request-triggered runs, returned no matching runs. This **does not establish that no CI or release testing occurred**; it provides no execution evidence for this checkpoint.

**Execution blocker:** Node.js is available in the inspection environment, but the repository is not checked out locally and direct GitHub network access failed. The connector allowed source and fixture inspection, not an executable local checkout. Accordingly **no npm, Node test, build or browser test was run**. The next valid execution step requires an accessible exact-revision checkout or an approved CI run, followed by capture of command, commit, environment, exit status and logs. Do not mark WF-13 verified based on this source inspection.


## WF-13 CI execution route review, 23 October 2026

Read `.github/workflows/validate-hotfix.yml`, `app/check-offline.cjs` and `app/verify-build.cjs` on the documentation branch. The workflow supports manual `workflow_dispatch` and pull request triggers limited to `app/**`, `RELEASE-NOTES-*.md` and its own workflow file. Therefore a documentation-only pull request is not expected to trigger the automatic validation job. The job uses Node.js 22, runs `npm ci --no-audit --no-fund`, `npm run release`, confirms the version and package exist, and uploads a temporary candidate artefact. This is a **workflow definition review, not an executed CI run**.

The separately declared `check:source` invokes `check-offline.cjs`, which inspects source HTML for remote script or stylesheet links and expected markers. The release sequence instead runs `check:build` via `verify-build.cjs`, which checks the generated standalone HTML and embedded resources. Their targets differ; omission of `check:source` from the release chain is not, without further assessment, a proven release defect. The workflow's own build verification states that browser testing is still required.

**Execution route:** Use the existing manual workflow on an explicitly selected revision if permitted by the repository and product owner, or obtain a local checkout of the exact published source and run the named commands. Capture run ID, source SHA, job steps, logs and artefact identity. No workflow was dispatched, test executed, application behaviour changed or release published in this checkpoint.


## WF-13 documentation consistency observation, 23 October 2026

The validation workflow checks application and package output but does not test agreement between public documentation and the release. Documentation-only changes do not trigger its pull request job. The pull request template and technical documentation policy already require human documentation review and reconciliation. This separation could contribute to stale guidance, but historical causation is unproven. Existing M-030 and WF-14 cover the public documentation concern. No duplicate finding or workflow change is proposed here. A future release review should record published version, documentation links, status agreement, executed checks and product owner approval. No tests were run.


## Documentation baseline closeout decision prepared, 23 October 2026

Created `docs/audits/V1.3.0-DOCUMENTATION-BASELINE-CLOSEOUT.md` to distinguish readiness to publish corrected v1.3.0 documentation from completion of the original technical audit. The product owner agreed to this evidence-based approach, but has **not** approved merging PR #52. WF-11 to WF-13 retain their incomplete source and test coverage, WF-14 retains final public review, and M-030 remains open until public `main` reconciliation and actual required-check enforcement. GitHub Actions previously passed on commit `00761e84928832ef20a3a2e6155b4bbe5d746f1b`; the new closeout commits require fresh CI verification. No application tests executed in this checkpoint, no merge, release or branch protection change. The master audit stays in progress.


## WF-13 recovered historical release CI evidence, 23 October 2026

**Evidence recovered, not a fresh test execution.** GitHub Actions [release candidate validation run 39605067641](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39605067641), job `119239027726`, completed successfully on 21 October 2026 for commit `be778285e6d1180052802255d1c283abfbd5238e`. Its downloaded job log records `npm run release`, 29 named `check:*` commands, `build`, `check:build` and `package`; the job's install, release, version/package confirmation and artefact upload steps concluded successfully. The associated [history secret scan run 39605067721](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39605067721) also succeeded.

GitHub's comparison of tested commit `be778285e6d1180052802255d1c283abfbd5238e` with published v1.3.0 merge commit `92d6a60b0e4bc9f73589b27820cb283def377dbd` reports one intervening commit and **no changed files**. The `app/package.json` blob SHA is identical at both revisions. This supports release-source equivalence for the recovered automated release suite. It does not establish that the published downloadable artefacts have been independently hashed or opened.

The separate [main-branch build workflow](https://github.com/Caffoot/Caffoot-Lite/blob/main/.github/workflows/caffoot-lite.yml) defines four Playwright Chromium scripts: `test-browser-offline.cjs`, `test-browser-import.cjs`, `test-browser-restore.cjs` and `test-browser-upgrade.cjs`. Its configuration was inspected, but **no historical successful execution of that workflow at the release revision has yet been recovered**. The connector's commit workflow lookup is limited to pull-request-triggered runs and cannot disprove push-triggered execution. Existing owner-reported manual browser acceptance remains separately attributed to the owner. Browser execution history, exact published artefact provenance and the broader source-to-assertion mapping remain open.

**Checkpoint controls:** This is documentary recovery of historical evidence only. No tests, browser sessions or builds were executed in this checkpoint. No application behaviour, workflows, protections or published release were changed. WF-13 and the master technical audit remain **in progress**, not signed off. Earlier dated statements that evidence was unavailable describe the earlier inspection checkpoint and are superseded for the specific release candidate run above.


## WF-13 local testing and disabled browser workflow reconciliation, 23 October 2026

The product owner reported that the standalone HTML GitHub Actions workflow was manually disabled because the monthly free runner minute allowance had been exhausted, and that PowerShell and manual browser testing were used subsequently. The owner has now re-enabled that workflow. The owner-provided workflow history screenshot showed the latest listed run on 16 October 2026; this is evidence of the displayed history, not proof that local tests failed to occur after that date. The main-branch browser workflow triggers only on relevant `app/**` or workflow changes and manual dispatch, so a lack of later runs cannot be interpreted as missing local verification.

**Evidence classification:** The [WF-14 owner walkthrough](WF-14-PUBLIC-REPOSITORY-AND-FIRST-TIME-USER-EXPERIENCE.md) records owner-executed v1.3.0 browser acceptance with fictional device, allocation, subnet, location, rack and backup restore. The recovered release candidate CI run `39605067641` is separate automated evidence. PowerShell test commands and their precise exit codes are not reconstructed here without original logs; no claim is made that the four Playwright browser scripts were executed locally. The four scripts remain defined and eligible for future CI execution. Re-enabling a workflow does not retroactively establish a successful historical run.

**Remaining:** Match any preserved PowerShell logs to exact commands, source revision, date and outcome; establish historical or new Chromium execution evidence when justified; verify published artefact hashes and full assertion traceability. No rerun is required merely to replace an unavailable historical workflow record. WF-13 and master audit remain in progress. No tests executed for this documentation checkpoint.


## WF-13 Chromium script assertion traceability, 23 October 2026

Inspected all four Chromium test script definitions at `main` commit `aa3eb3e0d1208d942873d83b928eb7c1963da5da`. This is **source inspection**, not a new test execution or a historical pass claim. The standalone browser workflow runs these scripts only when triggered by its configured push paths or manual dispatch.

| Script | Observed browser assertions | Coverage limit and follow-up |
| --- | --- | --- |
| `app/test-browser-offline.cjs` | Saved inventory survives reload; corrupt storage enters recovery mode without overwriting original bytes and exports unreadable text; keyboard and accessible modal controls; hostile subnet and IPAM labels remain text; rack overlap, bounds and opposite-face placement checks; additional IPAM checks are present | This confirms recovery preservation and rack validation test definitions, not the emergency reset after corrupt startup, every write failure or all browser interactions |
| `app/test-browser-import.cjs` | Rejected backup cases leave inventory and safety snapshot unchanged, reject before confirmation, survive reload, make no internet requests and cause no uncaught browser exceptions | Negative import cases only; does not establish complete valid migration or all fault injection |
| `app/test-browser-restore.cjs` | Cancelled restore preserves inventory and safety snapshot; simulated failed save rolls back; successful restore persists after reload and retains the previous inventory in the safety snapshot; no internet requests or uncaught errors | Simulated failure is not proof of all silently unsuccessful localStorage writes or previous secondary snapshot byte preservation (M-011) |
| `app/test-browser-upgrade.cjs` | Populated backup export, cancelled import into renamed HTML, approved restore preserving inventory fields, reload persistence, future schema rejection, offline update guidance and embedded licences; observes whether file storage is shared between paths | Does not prove all legacy backup variations, storage implementations or full cross-browser compatibility |

**Traceability outcome:** Existing Chromium definitions materially address normal persistence, corrupted state preservation, rejected backups, restore rollback and renamed-file transfer. The source inspection does **not** close WF-13 or M-014 emergency recovery reset, M-031 bulk IPAM snapshot verification, M-011 secondary snapshot byte preservation, other unchecked save paths or exact published-release browser execution history. Reuse existing scripts and evidence; only design additional targeted disposable-data scenarios for gaps. The recovered release candidate validation run `39605067641` remains separate automated evidence, not a pass result for these Chromium scripts.

**Checkpoint:** No scripts were executed. No app code, workflow, release or repository protections were changed. WF-13 and master audit remain in progress. See the master register for overall status.


## WF-13 device save and IPAM browser assertion refinement, 23 October 2026

Re-inspected `app/test-browser-offline.cjs` on `main` commit `727e70afeaad985cba1cff95222feacb1c69c8eb`. In addition to the earlier general Chromium mapping, the script explicitly checks that a rejected device IP change retains the previous allocation; accepted device details and changed IP allocation synchronise; failed device edit save restores device and IPAM state and retains stored bytes; and failed initial device creation leaves no ghost device or orphan IPAM allocation. These are **defined browser assertions**, not newly executed results. They strengthen traceability for device save rollback but **do not** demonstrate bulk IPAM snapshot readback (M-031), every unchecked save caller, emergency recovery reset (M-014) or silent storage write behaviour beyond the script's simulated conditions. The existing WF-13 gap list remains open; do not add a duplicate finding for device save rollback solely because a separate bulk IPAM gap exists. No application changes or tests executed.


## WF-13 M-014 recovery reset exact-source checkpoint, 23 October 2026

Inspected `app/caffoot-lite.html` on `main` commit `292ddb2409644fdbc302203f85e57dbc1fea1c24`, lines 1651 to 1679. The recovery banner offers an original raw-text download when readable storage bytes exist, and its reset control requires two confirmations. The handler at lines 1672 to 1676 performs `localStorage.setItem(STORAGE_KEY, JSON.stringify(cloneDefaultData()))` followed immediately by `location.reload()` inside a `try` block; thrown errors show an alert. There is no explicit `getItem` readback or byte comparison before reload. **Confirmed source-level verification gap, not an observed runtime failure.**

Targeted disposable-data checks remain: cancel either confirmation; verify original bytes and downloaded text; simulate a throwing write and a silently ignored write; verify whether reload occurs, whether the original bytes remain and whether recovery mode persists; and verify a successful write. Preserve the distinction from Settings Clean Start, which has separate tests. Existing roadmap M-014 already records this issue, so no duplicate finding or priority change. No application code or tests changed or executed. WF-13 remains in progress.


## WF-13 M-031 exact bulk IPAM source checkpoint, 23 October 2026

Inspected `app/caffoot-lite.html` at `main` commit `a8d397f455da931a93bfd000124c7a558239b1ea`, lines 4474 to 4516. The bulk form recalculates a plan at confirmation and `phase12BApply()` recalculates again before mutation. At lines 4501 to 4504, the handler serialises the current `appState` and writes `caffoot_phase12b_prebulk_snapshot`; an exception cancels the operation with an error toast. The handler does **not** call `getItem` or compare persisted snapshot bytes before applying IP allocation changes. It then calls `saveState()`; when that returns false, it restores the original `appState` from the serialised value, clears the audit reason and reports that the inventory was restored **in memory**. Successful save closes the modal and rerenders.

**Interpretation:** Existing M-031 is a confirmed source-level safety snapshot readback gap, not a demonstrated loss of inventory. The existing fallback is explicitly in memory; do not infer a verified persisted rollback from it. Reuse the roadmap's disposable-profile test matrix for thrown or silently ignored snapshot writes, failed and successful inventory writes, and reload/persisted-byte checks. This is separate from confirmed IPAM repair M-012 and import safety snapshot M-011. No application changes or tests executed. WF-13 remains open.


## WF-13 minimal verification handover, 23 October 2026

The [consolidated WF-13 evidence plan](WF-13-CONSOLIDATED-EVIDENCE-PLAN.md) is the single working checklist for outstanding verification. It retains historical CI and owner acceptance without representing inspected browser scripts as executed tests, groups M-014 and M-031 disposable-data scenarios, and records published asset and Chromium run provenance gaps. This is a documentation checkpoint, not new test execution. Existing roadmap findings and master audit remain open.


## WF-13 recovered executed Chromium evidence and published asset digests, 23 October 2026

GitHub Actions [run 39940647187](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39940647187), job `120370950406`, **actually passed** on commit `d0a817f95711cf668d0c6ae26b0b66ef8725bef9` on 23 October 2026. Retrieved job logs show all four Chromium scripts invoked and passing, including offline recovery, import rejection, restore rollback and renamed HTML upgrade. This resolves the need to execute those four scripts again merely to obtain a known-revision pass, **but does not prove execution at the original v1.3.0 release SHA** or cover M-014/M-031 targeted fault injection. GitHub release API also provides three SHA256 digests for published v1.3.0 ZIP, HTML and SHA256SUMS, recorded in [consolidated plan](WF-13-CONSOLIDATED-EVIDENCE-PLAN.md). They have not been independently calculated from downloaded bytes. Prior dated claims that no successful browser execution was recovered are superseded for the 23 October run only. WF-13 remains in progress; no tests newly executed in this audit checkpoint.

## Coordinated outstanding verification scope, 23 October 2026

The owner approved a single remaining verification round rather than separate finding-by-finding test pull requests. [WF-13 consolidated evidence plan](WF-13-CONSOLIDATED-EVIDENCE-PLAN.md) now groups M-031, M-011, M-012, M-001, M-018, M-020 and independent v1.3.0 release asset hashing. Previously executed M-014 browser evidence (run 39944710633) is reused; its finding disposition is still open. All newly grouped scenarios remain **not executed** and must not be marked passed from source inspection or historical tests. WF-13 and master audit remain in progress, with final acceptance and documentation cross-reference checks outstanding.

**Combined browser suite checkpoint, 23 October 2026:** The working branch adds `app/test-browser-consolidated-audit.cjs` for the six remaining targeted findings and a main-push CI invocation. This is script implementation, **not observed execution**. The published asset digest check is still outstanding. No finding status changes or closure; WF-13 and the master audit remain in progress. See [WF-13 consolidated evidence plan](WF-13-CONSOLIDATED-EVIDENCE-PLAN.md).

**23 October 2026 reconciliation note:** Main Chromium run 39948681541 confirms M-031 silently ignored safety snapshot permits persisted bulk IPAM reservation. It is a confirmed safeguard gap without observed inventory loss. Later consolidated scenarios remain unexecuted after the assertion failure. WF-13 and master audit remain in progress; product owner approval required for application fix. See WF-13 consolidated evidence plan.

M-031 proposed correction:** The separately proposed application branch adds bulk prechange safety snapshot readback verification, approved for implementation but not merge. No corrected Chromium run yet. The confirmed M-031 observation in main run 39948681541 remains valid. Master audit and WF-13 stay in progress; see WF-13 consolidated evidence plan.

**23 October 2026 reconciliation, run 39952033135:** M-031 five browser scenarios passed on main after merged safety snapshot verification. M-001 and M-020 current assertions passed with in-memory divergence observations. M-018 stopped the suite on undefined `toggleRackLocationFields`; source confirms three call sites and no definition. M-012 and M-011 were not executed. Overall workflow failed, master audit and WF-13 remain in progress, and M-018 requires product owner decision before behaviour changes. See WF-13 evidence plan, WF-02 test matrix and v1.3.1 roadmap.

**23 October 2026:** M-018 proposed branch removes three calls to undefined rack location handler and adds selection and cancellation browser regression coverage. Corrected tests not executed; master audit remains in progress.

## Verified main Chromium checkpoint, 23 October 2026

Final evidence update for main run 39953195636: build and Chromium PASS; separate secret scan 39953195663 PASS. M-031 and corrected M-018 browser scenarios PASS. M-012 repair snapshot ignored write persists repair, open finding. M-001, M-020, M-018 failed-save divergence observed; M-011 secondary snapshot requires review despite original inventory persistence. Cross-referenced WF-13 evidence plan, WF-02 matrix, technical workflows and v1.3.1 roadmap. Master audit remains IN PROGRESS, release v1.3.0 unchanged; independent release asset SHA256 still outstanding.


## M-012 repair snapshot safeguard, 23 October 2026

Source change proposed on branch `fix/m012-ipam-repair-snapshot-readback-20261023`: `phase11CApplyRepair()` now compares the stored pre-repair safety snapshot with the exact original inventory before changing IPAM allocations. A silently ignored snapshot write cancels repair and preserves the original inventory. The consolidated Chromium test now requires unchanged stored and in-memory inventory for this failure case. This is a source change and revised test assertion, **not yet executed browser evidence**. Existing throw-snapshot, throw-main, success, old-snapshot and reload scenarios remain in the suite. M-012 stays open until the revised suite passes and the results are reconciled. Other findings and the overall audit remain open. No release authorised.


### M-012 Chromium execution evidence, 23 October 2026

GitHub Actions `Audit consolidated Chromium regression` run [39955252665](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39955252665), job `120419381282`, executed `node test-browser-consolidated-audit.cjs` successfully at commit `810ca43721fa09bb82c33369780e428f82056f69`. The job log explicitly records PASS for all five M-012 cases: throwing snapshot write, silently ignored snapshot write, throwing main save, successful repair and pre-existing snapshot. It also records passing scenario execution for M-031, M-001, M-018, M-020 and M-011; the latter four findings remain open because a passing observation scenario is not proof of corrected behaviour. M-012 targeted regression evidence is now satisfied; final finding disposition and cross-reference reconciliation remain required before audit closure. This evidence does not claim a published release or independent execution on v1.3.0.


### PR #77 merged and combined regression approach, 23 October 2026

PR [#77](https://github.com/Caffoot/Caffoot-Lite/pull/77) was merged to `main` as commit `103a7bafe8b8fd0139777462f2d6250f647b2f62`, with owner approval for audit merges. Latest head `ae3d270f9d0d3f48d55ac3b4e48ea4580f885247` passed all four GitHub checks, including consolidated Chromium run [39955498407](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39955498407). The M-012 repair safeguard and its five targeted browser scenarios are verified and merged; M-012 can be recorded as corrected in repository source, but not published in a new release. The user agreed that remaining findings should share one consolidated Chromium regression suite wherever practical, retaining independent assertions and finding dispositions. M-001, M-011, M-014, M-018, M-020 and M-031 require individual resolution or explicit deferral. WF-13 and the master audit remain in progress pending final evidence and cross-reference reconciliation. Historical pre-merge notes above remain as chronology, not current status.


### Coordinated integrity correction candidate, 23 October 2026

On branch `fix/audit-remaining-save-integrity-20261023`, source changes proposed for M-001 rack unassignment, M-018 custom location creation and M-020 device graphic selection restore the original in-memory inventory when `saveState()` fails, instead of displaying unsaved changes. M-011 import rollback now verifies readback of the previously held safety snapshot, including the absence case, and enters the existing recovery protection path when restoration cannot be verified. The consolidated Chromium script has been updated to assert rollback for M-001, M-018 and M-020 and inject a silently ignored secondary safety snapshot restoration for M-011. These are proposed source and test changes, **not executed test evidence**. No existing inventory validation rules were tightened. M-014 usability disposition and M-031 final closure review remain open. All four correction findings remain open until passing execution and final documentation reconciliation. No merge or release authorised at this checkpoint.


### PR #79 executed regression and merge reconciliation, 23 October 2026

PR [#79](https://github.com/Caffoot/Caffoot-Lite/pull/79) merged into `main` as `c140ff330f3309b7d99d46f01c075b40819617d3` following four successful checks on head `41b879b0dfe35b66afe55f99bf7f2deb8f6b195b`. GitHub Actions consolidated Chromium run [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113), job `120426540667`, executed and logged PASS for M-001 failed rack unassignment, M-018 failed custom location save and location cancellation, M-020 failed graphic save, M-011 import rollback throwing main save, ignored secondary snapshot restoration and earlier safety copy; M-012 and M-031 scenarios also passed. This supersedes the earlier **not executed** note for these revised scenarios. M-001, M-018 and M-020 source corrections are verified and merged, subject to final finding register disposition. M-011 primary inventory preservation and secondary restoration detection are covered, but recovery banner and further-save blocking behaviour in the ignored-secondary-write scenario were not explicitly asserted by this suite; retain that narrow verification item. M-014 already has executed recovery tests and requires product disposition. M-031 passed its targeted scenarios and needs register closure review. WF-13 and the master audit remain in progress pending independent release asset provenance evidence and final cross-reference reconciliation. No new release was published; published v1.3.0 is unchanged.


### M-011 recovery mode final assertion candidate, 23 October 2026

The consolidated Chromium test on branch `test/audit-m011-recovery-mode-evidence-20261023` now additionally asserts that an ignored previous safety snapshot restoration activates recovery mode, displays the recovery banner, retains exact original stored bytes for recovery export and blocks a subsequent `saveState()` call. This is a **test-only proposed change, not yet executed evidence**. M-011 final closure remains pending a passing browser run. M-014 requires its separate product usability disposition, M-031 its final finding status review, and independent release asset provenance and overall documentation reconciliation remain open. No application behaviour change, merge or release is claimed by this checkpoint.


### Final consolidated audit gate, 23 October 2026

PR [#81](https://github.com/Caffoot/Caffoot-Lite/pull/81) merged to `main` as `4c3585436dcd4a02eeefb41ea310ddd2ee1799d4`. All four checks succeeded on head `93663a5e84da980c45e191d902358506d2c6f60e`, including consolidated Chromium run [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469), job `120433890571`. The executed log records PASS for M-011 `throw-main`, `ignore-restore-snapshot` and `old-snapshot`; the updated ignored-restoration scenario explicitly asserts recovery mode, visible banner, original stored bytes and blocked subsequent saves. Earlier **not yet executed** wording above is historical and superseded by this evidence. M-011 is corrected and browser verified in merged source, pending final master finding disposition. M-001, M-018, M-020 and M-012 likewise have merged corrections and executed Chromium evidence. M-031's five scenarios passed and its formal disposition remains to be reconciled. M-014's previously executed recovery reset evidence requires a product usability disposition rather than an invented new test pass. Outstanding final gates include independent published v1.3.0 ZIP asset and checksum provenance, explicit v1.2.1 backup import compatibility on the published v1.3.0 HTML (not yet executed in this final gate), review of other WF-01 to WF-13 incomplete coverage entries, and full cross-reference reconciliation. A single final PR can record the evidence and explicit deferrals, but cannot claim tests not run or mark the entire audit complete prematurely. Published v1.3.0 assets must not be modified.


### Final evidence and finding disposition reconciliation, 23 October 2026

**Current authoritative checkpoint, superseding earlier pending and candidate notes above:** PR #83 merged into `main` as `dd834c0b5a23663e52a69bb289dbd0bd8b182e68`. Four GitHub checks succeeded. Published release compatibility workflow run `39961182872`, job `120439275189`, recorded PASS for published v1.2.1 and v1.3.0 SHA256SUMS verification and ZIP integrity, populated inventory import and genuine export using the published v1.2.1 HTML, and subsequent import into the published v1.3.0 HTML with core device, rack, subnet and location collection preservation and persistence across reload. This is **executed Chromium evidence**, not merely source inspection. It tests a representative populated fixture exported through the original published application, not every historical user backup. The published assets were not changed.

**M-031 disposition:** corrected in merged source and verified by the five previously executed targeted Chromium scenarios (including runs `39957395113` and `39959581469`). Close the technical correction and targeted test finding; do not imply exhaustive coverage of all bulk IPAM operations.

**M-014 disposition, product owner approved 23 October 2026:** defer recovery reset usability improvement to the v1.3.1 maintenance roadmap. Existing recovery safety behaviour has six previously executed browser scenarios in run `39944710633`; the possibility of unclear user feedback when a reset write is ignored remains a documented usability limitation. This is a **deferred improvement**, not a corrected defect or an unqualified pass. Do not change the published v1.3.0 application.

**Remaining master audit scope:** The historical WF-01 to WF-13 coverage rows contain partial or pending areas. Prior successful targeted tests remain valid, but those rows must not silently become complete. Treat unverified paths and broader accessibility, catalogue, recovery and failure coverage as explicitly outstanding or as scoped v1.3.1 follow-up, subject to product owner acceptance. This reconciliation does not itself prove full WF-01 to WF-13 coverage or constitute final audit sign-off. No new tests were executed for this documentation change. The v1.3.0 extended audit is **closed with documented limitations by explicit product owner approval on 23 October 2026**. This is an administrative audit closure, not a claim that every WF-01 to WF-13 path was exhaustively tested. The historical partial coverage rows remain accurate as evidence coverage records. Unverified paths, broader accessibility and catalogue checks, and recovery and failure scenarios not covered by the cited targeted evidence are carried forward for prioritisation in v1.3.1 maintenance planning. M-014 is an approved deferred usability improvement; M-031 is technically corrected and verified by targeted Chromium evidence. The release compatibility gate passed for the representative populated inventory in run 39961182872. No additional tests were executed for this closure decision. No application behaviour, published asset or release was changed. No release was created.



### P12 and browser evidence register correction, 23 October 2026

The authoritative current workflow register in [TECHNICAL-WORKFLOWS.md](../workflows/TECHNICAL-WORKFLOWS.md) has been corrected to cover WF-01 through WF-13 and to separate source assessment, P12 completion and actually executed browser evidence. This resolves the misleading 22 October at-a-glance statements that all browser tests were not executed and several P12 areas had not been assessed, while **not** claiming every P12 gate passed. Published v1.2.1 to v1.3.0 compatibility and asset verification passed in run [39961182872](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39961182872); targeted recovery and integrity evidence is recorded in runs [39944710633](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39944710633), [39957395113](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39957395113) and [39959581469](https://github.com/Caffoot/Caffoot-Lite/actions/runs/39959581469). Earlier planned or not executed statements remain dated historical evidence only. The extended audit is owner approved as administratively closed **with incomplete individual P12 and workflow coverage carried forward**, not as a certification of full P12 completion. No new browser tests were run for this documentation correction. M-014 remains deferred; M-031 is corrected with targeted evidence. The remaining P12 gaps must be prioritised in v1.3.1 planning before they can be individually closed.
