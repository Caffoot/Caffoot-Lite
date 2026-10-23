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
