# Legacy backup import compatibility matrix

> **Issue #91 release branch integration verification, 25 October 2026.** PR #128 merged into `release/v1.3.1` at commit `57e2b6cbcd9a83e3f0bda3d1807ded237df16176`. [Release candidate validation run 40180053197](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40180053197) and [consolidated Chromium regression run 40180095064](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40180095064) both completed successfully against that exact commit. This verifies the integrated release branch using existing automated tests; it does not establish full manual UI acceptance or every real customer backup. The finding remains open pending final acceptance and status reconciliation; no merge into `main` or public release has been authorised.


> **Issue #91 mixed dependent decision verification, 25 October 2026.** Commit `6b66eb2` passed [Chromium run 40179316087](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40179316087), [release validation 40179316152](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40179316152), [documentation consistency 40179316124](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40179316124) and [secret scan 40179316003](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40179316003). The real browser scenario invoked the production host deletion and guest decision handlers on fictional records. Three dependent virtual machines were explicitly unassigned, retired and reassigned in one operation. Assertions verified guest operating systems, custom historical notes, previous host history, retirement status and destination platform history. This is executed browser handler evidence, not a full manual UI or real customer backup test. The Issue #91 finding remains open pending final acceptance review and separate product owner approval. No merge or release.

> **Issue #91, PR #128 additional verified evidence, 25 October 2026.** Commit `9778efd` passed all four GitHub checks including Chromium guest reassignment and retirement scenarios. Commit `0a9c009` also passed all four checks, including a real JSON file import and reload of a fictional historical virtual machine whose host no longer exists. Its host reference, Hypervisor platform, guest operating system and custom historical value were checked after reload. Chromium run [40178800515](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40178800515), release validation [40178800535](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40178800535), documentation consistency [40178800509](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40178800509), and secret scan [40178800487](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40178800487) passed on `0a9c009`. These are fictional fixture tests, not validation against actual user backups. Existing general import rollback and historical IPAM import checks remain separate evidence. Broader acceptance, final documentation review and product owner release approval remain outstanding. Earlier checkpoints below remain historical.

> **Issue #91, PR #128 evidence reconciliation, 25 October 2026.** Development commit `b7988ff` passed all four GitHub checks: consolidated Chromium regression [run 40177998862](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40177998862), release candidate validation [run 40177998843](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40177998843), documentation consistency [run 40177998871](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40177998871), and Git history secret scan [run 40177998841](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40177998841). Chromium executed cancellation of guest resolution for host deletion and physical host conversion, Hypervisor removal confirmation and Escape, failed storage save rollback, and legacy missing host visibility. These are executed automated checks, not proof that every issue acceptance criterion is satisfied. Full browser journeys for guest reassignment and retirement, full historical and custom JSON import and recovery, and combined release candidate acceptance remain to be verified against the existing matrices. Historical statements below reflect their original checkpoints, not current test status. Issue #91 and PR #128 remain open; no merge or release is authorised.


**Status:** Initial source inspected design matrix, 24 October 2026. No application changes or browser tests executed. Owner approved lossless automatic conversion of unambiguous historical values and review of ambiguous or destructive corrections. Specific mappings require source and fixture confirmation before implementation.

**Baseline:** Published v1.3.0; current source inspected at `app/caffoot-lite.html` on `main`. `STATE_VERSION = 3`. Export uses `phase20CreateBackup` with `caffootBackup` metadata; import uses `phase16CReadJson`, `phase11ValidateBackupShape`, `phase20ValidateBackupVersion`, `phase20MigrateBackup`, `normaliseState`, `phase16CCheckBackup`, and `importData`. Existing import makes a detached JSON copy, reviews certain mounting corrections, validates integrity and uses a verified pre-restore safety snapshot and rollback.

## Proposed mapping decisions

| Incoming representation | Target representation | Handling | Evidence or outstanding decision |
| --- | --- | --- | --- |
| Backup without `caffootBackup` metadata | Compatible inventory model | Preserve and normalise | Already recognised as legacy by `phase20ValidateBackupVersion`; fixture coverage pending |
| Backup with supported schema metadata | Current supported schema | Preserve and normalise | Existing validation; test actual supported versions |
| Backup with newer unsupported schema | No import | Reject clearly | Existing version guard; regression test pending |
| Historical device type spelling or alias | Canonical device type only for a proven exact match | Automatic only after explicit mapping evidence | Alias inventory and old backup fixtures pending |
| Custom or unknown device type | Original type and `typeDetails` | Preserve unchanged | Mandatory owner decision; verify editing and round trips |
| Legacy physical server `serverService_Hypervisor` | Dedicated physical hosting setting | Conditional, not blindly automatic | Need proof of exact meaning, hypervisor product, host eligibility and dependent VM links |
| Virtual server host reference and platform | Host relationship and inherited platform | Preserve; reconcile if valid | Never infer a different host or silently reassign |
| OS or firmware stored as software | OS/firmware field | Automatic only when classification and device context are unambiguous | Preserve installed software if both concepts are independently meaningful |
| Historical software label | Equivalent current software catalogue label | Automatic only with exact semantic match | Do not infer server role from software name |
| Custom or archived software or server service | Original persisted key, selection and label | Preserve | Verify archival, export/import and conversion history |
| Ordinary physical or virtual server service | Shared service catalogue | Preserve selection | No physical-only restriction unless independently justified |
| Legacy desktop mounting or location | Valid mounting and location | Existing review | `phase16CReviewLegacyMountRepairs` asks before applying corrections |
| Legacy access point mounting conflict | Explicit selected mounting | Existing review | `phase16CChooseAPMounts` requires user decision |
| Malformed, unsafe or integrity-invalid JSON | No replacement | Reject | Preserve active inventory and pre-existing safety snapshot |

## Required verification

1. Obtain representative historic backups and fixtures across supported versions, including older metadata-free exports.
2. Inventory exact historical type strings, software keys, service keys, host relationships and OS fields before approving concrete aliases.
3. Confirm deterministic migrations are idempotent and preserve all unrecognised fields and custom catalogues.
4. Test ambiguous decisions, cancellation, existing AP and legacy mount reviews, invalid backups and failed storage writes.
5. Test export after migration and reimport into the same version, comparing all device relationships and custom values.
6. Keep source inspection separate from executed automated and browser tests, and reconcile WF-03, WF-06, WF-08, findings, roadmap and master audit before sign-off.

**Implementation approval:** Not granted. This matrix is a planning artefact, not evidence of released behaviour.

## Published source comparison, 24 October 2026

**Read-only source inspection:** Inspected `app/caffoot-lite.html` at Git tags `v1.0.0` (5,312 lines), `v1.2.0` (7,984), `v1.2.1` (8,002) and `v1.3.0` (8,634). All four declare `STATE_VERSION = 3`, `CAFFOOT_BACKUP_FORMAT = 'caffoot-inventory'`, and `CAFFOOT_BACKUP_SCHEMA_VERSION = 1`. Therefore **app release number alone does not identify a different backup schema**. Actual backup fixtures and field-level differences are needed before assigning migration rules.

| Published tag | Default device types observed | Compatibility implication |
| --- | --- | --- |
| v1.0.0 | Server - Physical, Server - Virtual, Desktop, Laptop, Tablet, Switch, Router, NAS, Access Point, PDU, UPS, Unknown | Existing exact type values need no renaming merely because the export is older |
| v1.2.0 and v1.2.1 | Above plus Layer 3 Switch, Firewall, Wireless LAN Controller | Newly offered defaults must not cause older/custom records to be rewritten |
| v1.3.0 | Above plus Printer, Scanner | These are later default catalogue additions, not proof of incompatible historic values |

The historical specialised service keys `SwanServer`, `SQLServer`, `TMSServer`, `printserver`, `keriserver`, `ActiveDirectory`, `AntivirusSoftware`, `DNS`, `DHCP`, `ExchangeServer`, `BackupSoftware`, `PlanetDB`, `SystemsDatabaseBackEndTables` and `PDASystem` appear in all four inspected tags. Preserve their persisted meaning and selections; do not assume a new display label is a safe rename. Starter service suggestions appear in the inspected v1.2.0 and v1.3.0 source.

**Open evidence:** `v1.1.0` was not available at the requested Git tag; no inference is made about that release. No real user backup JSON files were inspected and no runtime import/export tests were executed. Next compare exact device field schemas and use representative, sanitised old backups for deterministic mapping evidence.

## Device and service field comparison, 24 October 2026

Inspected historical application source at `v1.0.0`, `v1.2.0` and `v1.3.0`. The `phase19BTypeGroups` mapping in v1.0.0 already recognises alternative labels such as `physical server`, `virtual server`, `print server`, `print servers`, `wireless access point`, `ap`, `phone system` and `tape drive`, beyond its default type list. These are **display/form grouping aliases**, not proven persisted backup aliases. Do not automatically rewrite these type strings until real backup examples establish equivalent semantics. v1.2.0 adds `wireless lan controller` to that grouping.

v1.0.0 has the older `phase19BDefaultServerFunctions` catalogue, including specialised historical keys. By v1.2.0 the code also provides `phase120StarterServerServices` with human-readable labels for several established keys and newer `serverService_*` entries. This supports preserving stable keys while improving labels, rather than wholesale renaming. It does not prove that all specialised services have a modern equivalent.

The v1.0.0 `phase20MigrateBackup` delegates directly to `normaliseState` on a detached copy. By v1.2.0, the import migration also detects and records legacy mounting repairs for user review. v1.3.0 retains this approach and adds device type conversion safeguards through `phase130ObsoleteDeviceFields`. Therefore migration and editing are separate safety boundaries; tests must cover both.

**Next evidence required:** Compare persisted `device.typeDetails`, installed software keys, `serverFunctions` entries and host relationship fields against sanitised old backup fixtures. No automatic aliases approved yet. No browser tests executed.

## Persisted field comparison, 24 October 2026

Read-only inspection of published source at `v1.0.0`, `v1.2.0` and `v1.3.0` confirms the following distinctions:

| Field or structure | Observed history | Migration decision |
| --- | --- | --- |
| `device.typeDetails` | Used in all three releases | Preserve the complete object, including unknown and historical keys; do not assume obsolete UI fields are disposable |
| `appState.serverFunctions` | Managed catalogue exists in all three | Preserve custom keys, labels and selections |
| `appState.installedSoftware` | Managed catalogue exists in all three; later releases add richer archive and suggestion handling | Preserve records, labels, device type applicability and archive status |
| `device.virtualPlatform` | Explicit virtual machine field in v1.2.0 and v1.3.0 | Preserve original platform; do not infer a physical host's platform without evidence |
| `device.virtualHostId` | Explicit host reference in v1.2.0 and v1.3.0, validated against physical server IDs on edit | Preserve valid IDs; flag broken references, never silently reassign |
| `device.previousTypeDetails` | Historical conversion snapshots in v1.3.0; not observed in v1.0.0 or v1.2.0 inspected source | Preserve all snapshots on import and subsequent export; absence in older backups is not an error |
| `softwarePlatform` | Observed in v1.2.0 and v1.3.0, not in v1.0.0 search | Do not synthesise an OS or software classification from an absent field |

**Safety implication:** Shared field names do not guarantee that every value has the same meaning. Compare representative JSON backup fixtures before asserting any automatic conversion. Existing `phase130ObsoleteDeviceFields` and `previousTypeDetails` in v1.3.0 protect type conversions; they must not be confused with automatic backup migration. This is source inspection only, not an executed restore or save test.

## Browser storage upgrade path, 24 October 2026

Source inspection of published v1.3.0: `loadStoredState` reads `localStorage['caffoot_state']`, parses and checks core collections, rejects unsafe object keys and calls `normaliseState` directly. A read/parse/normalisation failure preserves the original stored string in `phase17AStorageRecovery` and disables saves. `saveState` validates integrity, writes and reads back the JSON before reporting success. **The backup-specific `phase20MigrateBackup` is not called by startup loading.** Therefore extending only the JSON import migration would leave existing browser inventories on a different compatibility path.

**Design recommendation awaiting separate owner implementation approval:** Define a shared, pure, deterministic compatibility transformation usable by both startup load and backup import, with different user interaction policies. Startup must never silently rewrite the stored original before a verified safe migration and recovery copy; ambiguous startup changes must preserve data and present an actionable review or recovery path, not block ordinary unaffected inventory use unnecessarily. Import must retain existing explicit restore confirmation, mounting reviews, safety snapshot and rollback. The future Docker database migration should consume the same validated mapping rules, not assume browser storage and server persistence have identical transactional guarantees. Confirm browser origin and storage scope in user guidance.

**Unexecuted test cases:** Open a previous-version inventory in the new standalone HTML, confirm no unintended rewrite, test missing or unknown fields, cancelled ambiguity, storage unavailable/full, startup integrity failure, safe rollback and unchanged backup export; then compare with JSON restore behaviour. No code changes or runtime tests performed.

## Hosted virtual device relationship safety, owner agreed design, 24 October 2026

**Issue #134 evidence boundary, 25 October 2026:** Draft PR #135 adds physical server hosting and hypervisor product/version form controls without authorising destructive migration of older inventory records. Chromium 40207430948 passed checks for displaying a legacy host with a custom product and version; existing issue #91 historical orphan import and reload tests remain recorded above. This does not prove a new #134 hypervisor configuration survives a full save, export and reimport, or every v1.2/v1.2.1 backup variant. Retain these as outstanding compatibility acceptance checks. No customer backup was modified, no merge or release.

**Design agreement, not implemented behaviour:** Protect every hosted virtual device, including virtual servers, firewalls, routers, switches and appliances, when deleting or changing the type of a physical host. Current source only exposes `virtualHostId` for `Server - Virtual`; other virtual categories need an explicit, backward compatible relationship model before enforcement. A device with no assigned host is valid. Do not infer hosting from installed hypervisor or guest software.

Before deleting a host, show an accessible, responsive host and dependent devices relationship diagram and list each dependent device. Require an explicit outcome per dependant: assign to an existing valid host, keep the device unassigned with previous host identity retained in history, or retain the device as retired with historical hosting recorded. If there is no alternative host, unassignment and retirement remain available. Do not delete dependant devices implicitly. A retired host remains in the inventory and its historical links remain available. Warn when retiring a host with active dependants; confirm exact retirement semantics separately. A physical host type conversion that invalidates dependencies requires the same review. Cancelled, invalid or failed operations must leave the inventory unchanged; preserve existing save rollback and backup safeguards.

**Source inspection finding:** In `main`, `deleteDevice` lists IP allocations and reservations but does not inspect `virtualHostId`. The virtual server form checks a selected physical host, while `validateApplicationState` does not appear to check `virtualHostId`. This is a potential relationship integrity gap, not an executed defect reproduction. v1.0.0 contains the `Server - Virtual` type without `virtualHostId`; the field is present in v1.2.0, v1.2.1 and v1.3.0. Absence in older data is not an error.

**Unexecuted verification:** Existing host with several dependent virtual types; only host available; missing and wrong type host IDs; legacy virtual server without host; reassignment; explicit unassignment with provenance; retirement; host deletion cancellation; physical host type conversion; save failure rollback; repeat import and export; archived/custom type and software preservation; keyboard and screen reader relationship review. No browser or automated tests executed.

**WF-06 source trace, 24 October 2026:** `phase20MigrateBackup` at lines 7507 to 7514 makes a detached copy and normalises; `phase16CCheckBackup` at lines 7626 to 7642 validates a candidate using `validateApplicationState`, which does not check `virtualHostId` in its device loop at lines 1581 to 1600. `importData` lines 7823 to 7862 protect active inventory with a verified pre-restore snapshot and rollback. Add disposable legacy fixtures for valid host IDs, missing host IDs, wrong type host IDs, hostless virtual servers, historical custom type values and repeated export/import. Preserve original backup and unknown data. This is source inspection, not test execution.

**M-005 next baseline test change, 24 October 2026:** Test commit `919bf866543d82d7860703100fc8e57403b930c3` adds a detached legacy backup candidate test with a fictional orphan `virtualHostId`, checking import validation and source JSON preservation, plus a Chromium executed *source function inspection* of the conversion handler for a direct incoming host guard. The latter is not a full form submission or conversion reproduction; WF-03 D13 remains unexecuted. The backup candidate check does not exercise full FileReader restore or safety snapshot; full WF-06 import remains outstanding. Both new checks await Chromium results. M-005 stays open; no application behaviour changes, merge or release.


## PR #90 latest Chromium evidence, 24 October 2026

[GitHub Actions consolidated Chromium run 40083327937](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40083327937) completed successfully against documentation commit `12cfa287ab36458b2b73b5632ab501068f609228`. This supersedes the historical statement above that the checks added at `919bf866` were awaiting results. The detached legacy backup candidate check and conversion handler source inspection are limited baseline evidence, not full FileReader import, device conversion form submission, safety snapshot, rehost, explicit unassignment, retirement or failed save acceptance tests. The earlier executed baseline confirms unsafe existing behaviour; it does not fix M-005. M-005 and the relevant WF-03/WF-06 acceptance gates remain open. These are GitHub Actions results, not locally executed tests. No application behaviour change, merge or release.


**Issue #134 updated verification, 25 October 2026:** Chromium [40208779489](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40208779489), release validation 40208779888, documentation consistency 40208779738 and secret scan 40208779620 passed at `19b5bf0`. The #134 browser checks now demonstrate a recognised Microsoft Hyper-V host setting surviving save and reload, and a historical custom hypervisor with its linked virtual guest surviving actual JSON file import and reload. The imported fixture is generated from current inventory data, not proof of a browser export/reimport cycle or every legacy v1.2/v1.2.1 variant. Existing #91 guest safety and rollback tests are applicable evidence; no new #134-only guest mutation test is claimed. Earlier checkpoint statements remain historical, superseded by this update. PR #135 remains draft on `release/v1.3.1`, awaiting final acceptance; no merge or release.


**Issue #134 post-merge checkpoint, 25 October 2026:** Product owner approved merging PR #135, which merged into `release/v1.3.1` at commit `803bed3b6afe9db0e12cea9393d6ee9f21e08682`. The combined release branch was then verified by manually dispatched consolidated Chromium regression [40210312242](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40210312242), completed **success** against that exact merge commit. Prior PR head `f4f03a1` passed release candidate validation 40209848671, documentation consistency 40209848695, secret scan 40209848685 and Chromium 40209848647. Owner visually accepted the new physical host form and guest resolution dialogue. Existing #91 safeguards remain applicable. Separate browser export and reimport and exhaustive old-version backup variants were not newly executed for #134; retain this evidence boundary without reopening completed checks. This records acceptance of the agreed #134 scope, not a v1.3.1 release or merge into `main`. Earlier pending-status checkpoints are historical and superseded here.


## Issue #192, PR #193 read-only legacy device history verification, 28 October 2026

The approved v1.3.3 change removes the device-type History Restore Configuration action and its handlers while retaining `previousTypeDetails` and the normal inventory backup import and export routes. The focused `app/test-browser-upgrade.cjs` scenario imports a synthetic legacy device snapshot, opens History and expands its details, confirms the restoration control is absent, then verifies snapshot retention through export and reload. The test also restores the original fixture, accounting for the expected safety-backup update. GitHub Actions Chromium [40650192085](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40650192085), release validation [40650192076](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40650192076), documentation consistency [40650191937](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40650191937) and secret scan [40650192041](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40650192041) passed at PR head `9b2b7af`. Earlier failed runs were test-interaction and test-baseline assertion errors, corrected without further application changes. Existing successful application evidence is reused. This is synthetic legacy-snapshot coverage, not an exhaustive test of every historical user backup. PR #193 remains open, targets `release/v1.3.3` and is not merged. Issue #192's wider redundant-code audit remains open; this checkpoint does not complete it or authorise a release.
