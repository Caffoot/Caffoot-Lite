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
