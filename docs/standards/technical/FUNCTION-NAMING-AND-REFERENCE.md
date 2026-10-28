# Caffoot Lite Function Naming and Reference

**Current status (28 October 2026):** Historical naming inventory and proposed mappings are retained below. Approved descriptive renames and source comment clean-up are implemented and verified on draft PR #195, not yet merged. See the implementation checkpoints later in this document and the [developer coding and naming reference](../coding/DEVELOPER-CODING-AND-NAMING-REFERENCE.md).
**Historical baseline:** v1.3.0 source inspection on `main`; published HTML provenance was reconciled on 22 October 2026 as recorded below.

## Published HTML provenance reconciliation, 22 October 2026

The published `v1.3.0` tag and current `main` have the same `app/caffoot-lite.html` blob SHA `e8a24f6370a1bb572287aad91a314a3e4a189d94` (8,634 lines). This confirms the HTML source used for the earlier `main` inspections matches the published HTML. The function reference remains a **partial, evolving inventory**, not an exhaustive declaration-by-declaration audit. Significant function callers, responsibilities and P11 source comments still require completion review. No functions have been renamed.

## Public-facing source comment standard (product-owner decision, 28 October 2026)

All source comments are public-facing technical documentation and must use clear **British English**. Write for a developer new to Caffoot Lite, returning after a long absence, or learning to code. Do not assume knowledge of the project's development phases, audit identifiers, historical conversations or internal shorthand. Explain unfamiliar terms where useful. Function names should describe actual behaviour rather than the phase in which they were introduced. Comments should explain **why** a decision or safeguard exists, especially data preservation, compatibility, recovery and rollback; do not merely paraphrase a self-explanatory statement. Describe implemented behaviour accurately, not aspirations. Avoid unexplained phase, P11 or M-number references; retain traceability in the audit records rather than making it a prerequisite for understanding source code. Keep comments in sync with changes, concise enough to remain useful, and approachable to less experienced developers. Renaming existing functions requires a separate, explicit product-owner approval after caller/dependency review and proportionate focused verification; this documentation decision alone authorises no application change.

## #101 current-branch naming inventory checkpoint, 28 October 2026

**Source inspection only:** `app/caffoot-lite.html` on `release/v1.3.3` contains **183 named function declarations** beginning with `phase` (simple `function name(...)` declarations counted; this is not a complete inventory of arrow functions, expressions or dynamic references). The historic phase prefix is not self-explanatory. The following are prioritisation candidates based on a literal textual count of references to each name followed by `(`, excluding its declaration. Counts do **not** establish the actual runtime call graph or rule out event attributes, aliases and string references. No rename is approved or implemented.

| Existing identifier | Approximate textual call references | Review priority |
| --- | ---: | --- |
| `phase19BSoftware()` | 20 | High, widely referenced software selection helper; confirm exact return semantics and all callers |
| `phase120HardwarePreferences()` | 19 | High, hardware preferences and form dependencies |
| `phase120HardwareCatalogue()` | 16 | High, catalogue integration |
| `phase12IpString()` | 14 | High, IP address representation and formatting |
| `phase120SoftwareOptions()` | 14 | High, software selection dependencies |
| `phase19BAllowedMounts()` | 12 | High, mounting restrictions and safety |
| `phase19BServerFunctions()` | 11 | High, server function field dependencies |
| `phase12Cidr()` | 10 | High, CIDR interpretation and IPAM safety |
| `phase120AvailableServerServices()` | 10 | High, server service selection |
| `phase120BuiltinSoftwareKey()` | 10 | High, built-in catalogue identity |

**Next:** Inspect each high-priority function's implementation, callers, references in HTML event handlers and compatibility constraints before suggesting a specific descriptive name. Document the purpose and safeguards in British English, readable by a newcomer. Do not bulk rename or run application tests for this documentation checkpoint. Reconcile P11 comments against current source rather than transplanting obsolete v1.3.0 line references.

### #101 first five implementation-verified naming candidates, 28 October 2026

The following definitions were inspected in the current `release/v1.3.3` HTML, rather than inferred from their names. Suggested names are **proposals only**, not implemented aliases or approved renames. Reference counts in the earlier checkpoint are textual estimates, not verified runtime caller counts.

| Existing function | Verified responsibility | Suggested name | Important dependency or distinction |
| --- | --- | --- | --- |
| `phase19BSoftware()` | Returns the saved installed-software array, or an empty array if malformed or absent | `getInstalledSoftware()` | Reads `appState.installedSoftware`; does not itself filter archived entries |
| `phase120HardwarePreferences()` | Returns the stored hardware seed preferences object, or an empty object if invalid | `getHardwareSeedPreferences()` | Uses `isPlainObject`; fallback is not a persisted repair |
| `phase120HardwareCatalogue()` | Returns stored hardware catalogue array, or an empty array if missing or invalid | `getHardwareCatalogue()` | Reads `appState.hardwareCatalogue`; does not itself filter types |
| `phase12IpString(n)` | Converts a numeric IPv4 value into four dotted decimal octets | `formatIpv4Address()` | Input is expected to be a numeric IPv4 representation; no validation is performed here |
| `phase120SoftwareOptions()` | Combines active configured software with non-overridden built-in suggestions and sorts labels | `getAvailableSoftwareOptions()` | Depends on `phase19BSoftware()`, `phase120BuiltinSoftwareKey()` and suggestion metadata; archived configured entries are omitted |

**Caller-review boundary:** Definitions and literal invocation locations have been inspected. Event-handler strings, aliasing, dynamic invocation and the complete transitive dependency graph have **not** been verified. Before any approved rename, check those references and update all callers together, then run only affected focused checks. No behaviour or public data schema changes are proposed.

## #101 complete phase-prefixed declaration inventory, 28 October 2026

**Automated static source inventory, not a runtime caller audit:** All 183 declarations matching `function phase...(` in `app/caffoot-lite.html` on `release/v1.3.3` are listed below in source order. Line numbers are specific to this inspected revision. A reference count means literal appearances of the identifier excluding its declaration; a call-like count means appearances followed immediately by `(` excluding its declaration. Neither metric proves execution, distinguishes comments/strings or captures indirect calls. **7 declarations have zero additional literal references**; do not assume they are unused without checking HTML event attributes, dynamic references and browser globals. **10 have ten or more literal references.** This is a complete inventory of the stated declaration pattern, **not** all JavaScript functions or an approved rename map. Existing five implementation-verified suggestions above remain valid; all other names require semantic inspection before replacement.

| Existing declaration | Source line | Literal references | Call-like references |
| --- | ---: | ---: | ---: |
| `phase12IpNumber()` | 1258 | 3 | 3 |
| `phase12IpString()` | 1262 | 14 | 14 |
| `phase12Cidr()` | 1265 | 10 | 10 |
| `phase12Overlap()` | 1274 | 0 | 0 |
| `phase12Usable()` | 1278 | 6 | 6 |
| `phase120SeparateLegacyRackLocation()` | 1442 | 1 | 1 |
| `phase13CLegacyAccessoryTypes()` | 1456 | 1 | 1 |
| `phase17ARecoveryBanner()` | 1726 | 3 | 3 |
| `phase11CPlan()` | 2300 | 1 | 1 |
| `phase11CPreviewRepair()` | 2335 | 1 | 1 |
| `phase11CDownloadSnapshot()` | 2339 | 1 | 1 |
| `phase11CApplyRepair()` | 2347 | 1 | 1 |
| `phase11CPanelHTML()` | 2385 | 0 | 0 |
| `phase10DReportData()` | 2405 | 3 | 3 |
| `phase10DCsvCell()` | 2444 | 1 | 0 |
| `phase10DDownloadCsv()` | 2450 | 1 | 1 |
| `phase10DReportsHTML()` | 2476 | 1 | 1 |
| `phase13GDefault()` | 2892 | 1 | 1 |
| `phase13GFascia()` | 2901 | 0 | 0 |
| `phase13GOpenGraphics()` | 2914 | 1 | 1 |
| `phase13GSaveGraphics()` | 2919 | 1 | 1 |
| `phase13LUsage()` | 2934 | 2 | 2 |
| `phase13LFreeRuns()` | 2949 | 1 | 1 |
| `phase13LPrintRack()` | 2959 | 1 | 1 |
| `phase180EffectivePlatform()` | 3337 | 3 | 3 |
| `phase180EffectiveVersion()` | 3344 | 1 | 1 |
| `phase120FilterModels()` | 3375 | 3 | 3 |
| `phase120ManufacturerManager()` | 3405 | 3 | 3 |
| `phase120ManufacturerSave()` | 3427 | 2 | 2 |
| `phase120BuiltinManufacturerEditor()` | 3465 | 1 | 1 |
| `phase120BuiltinManufacturerSave()` | 3473 | 1 | 1 |
| `phase120ManufacturersHTML()` | 3489 | 2 | 2 |
| `phase120ModelAllowedTypes()` | 3528 | 3 | 3 |
| `phase120ModelUpdateTypes()` | 3535 | 2 | 2 |
| `phase120ModelManager()` | 3547 | 3 | 3 |
| `phase120ModelSave()` | 3560 | 2 | 2 |
| `phase120BuiltInModelEditor()` | 3589 | 1 | 1 |
| `phase120BuiltInModelSave()` | 3599 | 1 | 1 |
| `phase120ModelsHTML()` | 3621 | 2 | 2 |
| `phase120SoftwareEdit()` | 3666 | 2 | 2 |
| `phase120SoftwareSaveCustom()` | 3674 | 1 | 1 |
| `phase120SoftwareRemove()` | 3689 | 1 | 1 |
| `phase120SoftwareArchive()` | 3697 | 1 | 1 |
| `phase120SoftwareRestore()` | 3708 | 1 | 1 |
| `phase120SoftwareHTML()` | 3717 | 2 | 2 |
| `phase120EnableSoftware()` | 3733 | 1 | 1 |
| `phase120FilterSoftware()` | 3744 | 3 | 3 |
| `phase120ServerServiceEditor()` | 3761 | 2 | 2 |
| `phase120SaveServerService()` | 3766 | 1 | 1 |
| `phase120RestoreServerService()` | 3779 | 1 | 1 |
| `phase120ServerServicesHTML()` | 3788 | 1 | 1 |
| `phase18DList()` | 4033 | 6 | 6 |
| `phase18DProtected()` | 4042 | 3 | 3 |
| `phase18DOpen()` | 4045 | 4 | 4 |
| `phase18DConfirmDelete()` | 4089 | 4 | 2 |
| `phase18DCancelDelete()` | 4118 | 3 | 3 |
| `phase18DConfirmDeleteAction()` | 4125 | 1 | 1 |
| `phase18DCommit()` | 4133 | 5 | 5 |
| `phase18DRename()` | 4171 | 3 | 3 |
| `phase18DCancelRename()` | 4196 | 3 | 3 |
| `phase10GatewaySubnet()` | 4222 | 3 | 3 |
| `phase10SubnetSummary()` | 4226 | 4 | 4 |
| `phase12BBulkPlan()` | 4654 | 2 | 2 |
| `phase12BBackToEditing()` | 4730 | 1 | 1 |
| `phase12BApply()` | 4744 | 1 | 1 |
| `phase11BSubnetDependencies()` | 5120 | 3 | 3 |
| `phase11BIntegrityIssues()` | 5125 | 0 | 0 |
| `phase11BCommitDelete()` | 5146 | 4 | 4 |
| `phase19BKeepDeviceForm()` | 5468 | 3 | 3 |
| `phase120ConfirmDiscard()` | 5488 | 2 | 2 |
| `phase120ConfirmRackCorrection()` | 5514 | 1 | 1 |
| `phase120ResolveRackCorrection()` | 5540 | 3 | 3 |
| `phase120KeepEditing()` | 5549 | 2 | 2 |
| `phase120DiscardChanges()` | 5555 | 1 | 1 |
| `phase120ReturnFromSubnet()` | 5561 | 2 | 2 |
| `phase18BOpenPlacement()` | 5800 | 3 | 3 |
| `phase11DeviceTopBlock()` | 6035 | 4 | 4 |
| `phase11DeviceCascade()` | 6044 | 3 | 3 |
| `phase19CDetailLabel()` | 6141 | 5 | 5 |
| `phase19CDetailRows()` | 6146 | 1 | 1 |
| `phase14CViewDevice()` | 6162 | 6 | 5 |
| `phase120ConfirmArchivedUninstall()` | 6257 | 1 | 1 |
| `phase120RecordArchivedUninstall()` | 6263 | 1 | 1 |
| `phase14CSelectTab()` | 6282 | 3 | 3 |
| `phase130ConfirmRestore()` | 6296 | 1 | 1 |
| `phase130ResolveRestore()` | 6322 | 3 | 3 |
| `phase130RestoreHistory()` | 6331 | 1 | 1 |
| `phase14CGoToRack()` | 6379 | 1 | 1 |
| `phase19BServerFunctions()` | 6477 | 11 | 11 |
| `phase120AvailableServerServices()` | 6482 | 10 | 10 |
| `phase19BServerFunctionFields()` | 6487 | 6 | 6 |
| `phase19BManageFunctions()` | 6488 | 2 | 2 |
| `phase19BReadFunctionSelections()` | 6498 | 2 | 2 |
| `phase19BUpdateFunction()` | 6504 | 3 | 3 |
| `phase120ConfirmServerServiceArchive()` | 6525 | 2 | 2 |
| `phase120ArchiveServerService()` | 6533 | 1 | 1 |
| `phase120HardwarePreferences()` | 6557 | 19 | 19 |
| `phase120EffectiveHardwareSeed()` | 6561 | 6 | 6 |
| `phase120HardwareCatalogue()` | 6579 | 16 | 16 |
| `phase120HardwareCatalogType()` | 6583 | 3 | 3 |
| `phase120ManageHardwareCatalogue()` | 6586 | 2 | 2 |
| `phase120UpdateHardwareCatalogue()` | 6599 | 3 | 3 |
| `phase120IsVirtualForm()` | 6627 | 6 | 6 |
| `phase120VirtualHardwareVisibility()` | 6631 | 3 | 3 |
| `phase120RefreshHardwareSuggestions()` | 6654 | 5 | 4 |
| `phase120HardwareSelectionChanged()` | 6687 | 1 | 1 |
| `phase19BSoftware()` | 6704 | 22 | 20 |
| `phase19BSoftwareFields()` | 6707 | 1 | 1 |
| `phase19BManageSoftware()` | 6708 | 2 | 2 |
| `phase19BReadSoftwareSelections()` | 6718 | 2 | 2 |
| `phase19BUpdateSoftware()` | 6724 | 3 | 3 |
| `phase120BuiltinSoftwareKey()` | 6760 | 10 | 10 |
| `phase120SoftwareOptions()` | 6761 | 14 | 14 |
| `phase120SoftwareHidden()` | 6768 | 3 | 3 |
| `phase120SoftwareToggle()` | 6769 | 1 | 1 |
| `phase120SoftwareTypeControls()` | 6780 | 1 | 1 |
| `phase120SoftwareFieldsFor()` | 6784 | 3 | 3 |
| `phase19BFieldsFor()` | 6787 | 8 | 8 |
| `phase120IsSoftwareField()` | 6794 | 4 | 4 |
| `phase19BRenderFields()` | 6801 | 6 | 6 |
| `phase120PlatformGroup()` | 6831 | 2 | 2 |
| `phase120PlatformOptions()` | 6837 | 1 | 1 |
| `phase120VersionOptions()` | 6857 | 3 | 3 |
| `phase120IsWindowsPlatform()` | 6860 | 1 | 1 |
| `phase120RenderSoftwarePlatform()` | 6863 | 2 | 2 |
| `phase120WireSoftwarePlatform()` | 6882 | 2 | 2 |
| `phase120CaptureSoftwarePlatform()` | 6912 | 5 | 5 |
| `phase120RefreshSoftwarePlatform()` | 6920 | 2 | 2 |
| `phaseM134HostingEnabled()` | 6930 | 2 | 2 |
| `phaseM134SyncHostingVisibility()` | 6934 | 6 | 5 |
| `phase19BReadFields()` | 6941 | 5 | 5 |
| `phase19BRefreshFields()` | 6952 | 4 | 2 |
| `phase19BIsAccessPoint()` | 6976 | 3 | 3 |
| `phase19BAllowedMounts()` | 6980 | 12 | 12 |
| `phase120SuggestedMounts()` | 6984 | 3 | 3 |
| `phase120DefaultMount()` | 6997 | 3 | 3 |
| `phase19BMountOptions()` | 7000 | 2 | 2 |
| `phase19BUpdateMountChoices()` | 7005 | 2 | 2 |
| `phase120InitializeNotesEditor()` | 7018 | 1 | 1 |
| `phase120InitializeDeviceTabs()` | 7070 | 1 | 1 |
| `phase130HandleLocationChange()` | 7472 | 1 | 1 |
| `phase130CancelCustomLocation()` | 7486 | 1 | 1 |
| `phase130ObsoleteDeviceFields()` | 7535 | 1 | 1 |
| `phase130ConfirmDeviceConversion()` | 7548 | 0 | 0 |
| `phase130ResolveDeviceConversion()` | 7581 | 3 | 3 |
| `phaseM005ConfirmHypervisorRemoval()` | 7591 | 2 | 2 |
| `phaseM005ConfirmPlatformChange()` | 7653 | 1 | 1 |
| `phase16ABackupHelp()` | 7914 | 1 | 1 |
| `phase16ARenderSettings()` | 7924 | 1 | 1 |
| `phase16ACheckSafety()` | 8061 | 1 | 1 |
| `phase16AClearSystem()` | 8095 | 1 | 1 |
| `phase20CreateBackup()` | 8178 | 1 | 1 |
| `phase20ValidateBackupVersion()` | 8190 | 3 | 3 |
| `phase20MigrateBackup()` | 8205 | 1 | 1 |
| `phase16CRejectUnsafeKeys()` | 8226 | 3 | 3 |
| `phase11ValidateBackupShape()` | 8241 | 2 | 2 |
| `phase11DownloadSnapshot()` | 8258 | 1 | 1 |
| `phase11SafetyPanelHTML()` | 8267 | 0 | 0 |
| `phase16CLegacyMountRepairs()` | 8283 | 1 | 1 |
| `phase16CInvalidMounts()` | 8321 | 1 | 1 |
| `phase16CRackImportIssues()` | 8325 | 1 | 1 |
| `phase16CCheckBackup()` | 8374 | 2 | 2 |
| `phase16CReadJson()` | 8395 | 1 | 1 |
| `phase16CShowImportError()` | 8400 | 3 | 3 |
| `phase16CReviewLegacyMountRepairs()` | 8410 | 1 | 1 |
| `phase16CAPMountConflicts()` | 8465 | 1 | 1 |
| `phase16CChooseAPMounts()` | 8476 | 1 | 1 |
| `phase16CApplyAPChoices()` | 8530 | 1 | 1 |
| `phase13DFascia()` | 8754 | 0 | 0 |
| `phase13CAccessoryError()` | 8765 | 5 | 5 |
| `phase13VRenderRail()` | 8781 | 2 | 2 |
| `phase13COpenAccessory()` | 8792 | 4 | 4 |
| `phase13CDeleteAccessory()` | 8899 | 2 | 2 |
| `phase13CMoveAccessory()` | 8922 | 1 | 1 |
| `phase13MoveDevice()` | 8934 | 1 | 1 |
| `phase13ClearDropPreview()` | 8959 | 5 | 5 |
| `phase17dRenderPreservingRackScroll()` | 8963 | 2 | 2 |
| `phase17dStopAutoScroll()` | 8975 | 8 | 8 |
| `phase17dScrollTick()` | 8981 | 2 | 0 |
| `phase17dTrackDrag()` | 8990 | 1 | 0 |
| `phase13VTarget()` | 9021 | 2 | 2 |
| `phase13VClearPreview()` | 9031 | 3 | 3 |
| `phase13DropPosition()` | 9110 | 2 | 2 |

**Next decision gate:** Group the entries by actual behaviour and document the proposed descriptive names and dependencies in this existing reference. Flag HTML event attributes, indirect calls, collisions and compatibility exposure before any implementation. No application changes or tests were performed for this static inventory.

### Bulk triage by identifier, 28 October 2026

This is a **first-pass heuristic grouping based on existing identifier words**, not verified behaviour. Each function appears in exactly one category; cross-cutting responsibilities and ambiguous names must be checked against implementation. It avoids treating 183 entries as 183 separate review discussions.

**IPAM / network (10):** `phase12IpNumber`, `phase12IpString`, `phase12Cidr`, `phase12Overlap`, `phase12Usable`, `phase10GatewaySubnet`, `phase10SubnetSummary`, `phase12BBulkPlan`, `phase11BSubnetDependencies`, `phase120ReturnFromSubnet`.

**Rack / accessories (30):** `phase120SeparateLegacyRackLocation`, `phase13CLegacyAccessoryTypes`, `phase13GFascia`, `phase13LPrintRack`, `phase120ConfirmRackCorrection`, `phase120ResolveRackCorrection`, `phase14CGoToRack`, `phase19BAllowedMounts`, `phase120SuggestedMounts`, `phase120DefaultMount`, `phase19BMountOptions`, `phase19BUpdateMountChoices`, `phase16CLegacyMountRepairs`, `phase16CInvalidMounts`, `phase16CRackImportIssues`, `phase16CReviewLegacyMountRepairs`, `phase16CAPMountConflicts`, `phase16CChooseAPMounts`, `phase13DFascia`, `phase13CAccessoryError`, `phase13VRenderRail`, `phase13COpenAccessory`, `phase13CDeleteAccessory`, `phase13CMoveAccessory`, `phase13ClearDropPreview`, `phase17dRenderPreservingRackScroll`, `phase17dStopAutoScroll`, `phase17dScrollTick`, `phase17dTrackDrag`, `phase13DropPosition`.

**Backup / recovery / validation (19):** `phase17ARecoveryBanner`, `phase11CPreviewRepair`, `phase11CDownloadSnapshot`, `phase11CApplyRepair`, `phase120SoftwareRestore`, `phase120RestoreServerService`, `phase130ConfirmRestore`, `phase130ResolveRestore`, `phase130RestoreHistory`, `phase16ABackupHelp`, `phase16AClearSystem`, `phase20CreateBackup`, `phase20ValidateBackupVersion`, `phase20MigrateBackup`, `phase16CRejectUnsafeKeys`, `phase11ValidateBackupShape`, `phase11DownloadSnapshot`, `phase16CCheckBackup`, `phase16CShowImportError`.

**Catalogue / software / hardware (51):** `phase120FilterModels`, `phase120ManufacturerManager`, `phase120ManufacturerSave`, `phase120BuiltinManufacturerEditor`, `phase120BuiltinManufacturerSave`, `phase120ManufacturersHTML`, `phase120ModelAllowedTypes`, `phase120ModelUpdateTypes`, `phase120ModelManager`, `phase120ModelSave`, `phase120BuiltInModelEditor`, `phase120BuiltInModelSave`, `phase120ModelsHTML`, `phase120SoftwareEdit`, `phase120SoftwareSaveCustom`, `phase120SoftwareRemove`, `phase120SoftwareArchive`, `phase120SoftwareHTML`, `phase120EnableSoftware`, `phase120FilterSoftware`, `phase120ServerServiceEditor`, `phase120SaveServerService`, `phase120ServerServicesHTML`, `phase120AvailableServerServices`, `phase120ConfirmServerServiceArchive`, `phase120ArchiveServerService`, `phase120HardwarePreferences`, `phase120EffectiveHardwareSeed`, `phase120HardwareCatalogue`, `phase120HardwareCatalogType`, `phase120ManageHardwareCatalogue`, `phase120UpdateHardwareCatalogue`, `phase120VirtualHardwareVisibility`, `phase120RefreshHardwareSuggestions`, `phase120HardwareSelectionChanged`, `phase19BSoftware`, `phase19BSoftwareFields`, `phase19BManageSoftware`, `phase19BReadSoftwareSelections`, `phase19BUpdateSoftware`, `phase120BuiltinSoftwareKey`, `phase120SoftwareOptions`, `phase120SoftwareHidden`, `phase120SoftwareToggle`, `phase120SoftwareTypeControls`, `phase120SoftwareFieldsFor`, `phase120IsSoftwareField`, `phase120RenderSoftwarePlatform`, `phase120WireSoftwarePlatform`, `phase120CaptureSoftwarePlatform`, `phase120RefreshSoftwarePlatform`.

**Device / virtualisation (20):** `phase180EffectivePlatform`, `phase19BKeepDeviceForm`, `phase11DeviceTopBlock`, `phase11DeviceCascade`, `phase14CViewDevice`, `phase19BServerFunctions`, `phase19BServerFunctionFields`, `phase120IsVirtualForm`, `phase19BFieldsFor`, `phase120PlatformGroup`, `phase120PlatformOptions`, `phase120IsWindowsPlatform`, `phaseM134HostingEnabled`, `phaseM134SyncHostingVisibility`, `phase120InitializeDeviceTabs`, `phase130ObsoleteDeviceFields`, `phase130ConfirmDeviceConversion`, `phase130ResolveDeviceConversion`, `phaseM005ConfirmPlatformChange`, `phase13MoveDevice`.

**Reports / export (4):** `phase10DReportData`, `phase10DCsvCell`, `phase10DDownloadCsv`, `phase10DReportsHTML`.

**Other / needs manual classification (49):** `phase11CPlan`, `phase11CPanelHTML`, `phase13GDefault`, `phase13GOpenGraphics`, `phase13GSaveGraphics`, `phase13LUsage`, `phase13LFreeRuns`, `phase180EffectiveVersion`, `phase18DList`, `phase18DProtected`, `phase18DOpen`, `phase18DConfirmDelete`, `phase18DCancelDelete`, `phase18DConfirmDeleteAction`, `phase18DCommit`, `phase18DRename`, `phase18DCancelRename`, `phase12BBackToEditing`, `phase12BApply`, `phase11BIntegrityIssues`, `phase11BCommitDelete`, `phase120ConfirmDiscard`, `phase120KeepEditing`, `phase120DiscardChanges`, `phase18BOpenPlacement`, `phase19CDetailLabel`, `phase19CDetailRows`, `phase120ConfirmArchivedUninstall`, `phase120RecordArchivedUninstall`, `phase14CSelectTab`, `phase19BManageFunctions`, `phase19BReadFunctionSelections`, `phase19BUpdateFunction`, `phase19BRenderFields`, `phase120VersionOptions`, `phase19BReadFields`, `phase19BRefreshFields`, `phase19BIsAccessPoint`, `phase120InitializeNotesEditor`, `phase130HandleLocationChange`, `phase130CancelCustomLocation`, `phaseM005ConfirmHypervisorRemoval`, `phase16ARenderSettings`, `phase16ACheckSafety`, `phase11SafetyPanelHTML`, `phase16CReadJson`, `phase16CApplyAPChoices`, `phase13VTarget`, `phase13VClearPreview`.

**Next:** Inspect implementation and all reference forms within each group, produce the full proposed rename mapping, and highlight ambiguous or externally referenced names for owner review. This grouping does not authorise renaming.

### #101 zero-reference exceptions inspected, 28 October 2026

Seven named declarations had no other exact literal identifier occurrence in the current HTML. **This is not evidence that removal is safe**; their bodies were inspected to identify the intended responsibilities and any legacy or compatibility implications. The names below are *descriptive review candidates only*, not approved changes.

| Existing name | Source-inspected responsibility | Suggested descriptive name | Disposition |
| --- | --- | --- | --- |
| `phase12Overlap()` | Compare parsed CIDR network ranges for overlap | `doIpv4SubnetsOverlap()` | Check whether superseded by another validator; preserve until dependency review |
| `phase11CPanelHTML()` | Generate an integrity-repair preview panel | `renderIntegrityRepairPreviewHtml()` | Verify whether panel is reached through another renderer or obsolete path |
| `phase13GFascia()` | Generate device fascia graphics using configured or default presets | `renderDeviceFasciaHtml()` | Check newer graphics path before considering removal |
| `phase11BIntegrityIssues()` | Collect inventory integrity issues including IP and rack relationships | `findInventoryIntegrityIssues()` | Safety-related; do not remove merely because no direct call is found |
| `phase130ConfirmDeviceConversion()` | Open an asynchronous device-conversion confirmation dialogue | `confirmDeviceTypeConversion()` | Historical conversion workflow; investigate against agreed immutable device-type rules before any change |
| `phase11SafetyPanelHTML()` | Generate the backup and restore safety information panel | `renderBackupSafetyPanelHtml()` | Preserve safety messaging until UI reachability is established |
| `phase13DFascia()` | Generate rack accessory fascia graphics, including patch and brush panels | `renderRackAccessoryFasciaHtml()` | Check rack renderer references and historical compatibility |

**Important:** The source contains both historical device-conversion logic and newer rules governing device types. Their coexistence is a reason for careful review, not permission to delete or rewrite them. No function was removed or renamed. No application tests were run. All seven require caller and reachability verification before an implementation proposal.

### #101 and #192 joint source inspection, 28 October 2026

The current `release/v1.3.3` HTML contains **296 named `function` declarations** using a simple textual pattern, including the 183 phase-prefixed declarations previously inventoried. This is not a count of all arrow functions, callbacks or function expressions. A name-only duplicate scan found `add()` declared twice, but each is nested inside a different catalogue-rendering function (`phase120ManufacturersHTML()` and `phase120ModelsHTML()`). They have distinct local scopes and responsibilities. **This is not a confirmed duplicate global declaration, defect or safe consolidation opportunity.**

Seven phase-prefixed functions have no other exact-name occurrence, including `phase130ConfirmDeviceConversion()` and `phase11BIntegrityIssues()`. Source inspection confirms the conversion dialogue implementation and integrity checks exist, but reachability and compatibility consequences have not been established. Do not remove them on this evidence. The older device-conversion path merits comparison against the approved fixed device-type design, including historical backups and editing workflows.

**#192 assessment boundary:** No confirmed removable code, measurable performance bottleneck or safely shared duplicated block has yet been demonstrated. Next examine function bodies, caller paths, nested scopes and data-preservation requirements. Refactoring requires separately approved scope and focused verification. No application source changed; no tests executed.

### #192 conversion compatibility finding, 28 October 2026

A deeper source inspection distinguishes **two different historical conversion paths**:

- `phase130ConfirmDeviceConversion()` (around line 7548) builds a conversion confirmation dialogue and has no other exact-name reference. Its `phase130ResolveDeviceConversion()` helper still has event-dispatch and Escape-key callers, apparently supporting that dialogue. This is a **candidate for reachability investigation**, not yet approved redundant code.
- `phase130RestoreHistory()` (around line 6331) is a separate **live historical-configuration restoration function**. It invokes `phase130ObsoleteDeviceFields()`, asks for confirmation using `phase130ConfirmRestore()`, and explicitly describes a device-type change to the user. The restore function must be reviewed against the agreed immutable device-type rule and historical data-preservation requirements before changing either code path. Do not conflate it with the apparently uncalled conversion dialogue.

**Open question for product-owner decision after investigation:** should historical configuration restoration be allowed to change the device type, or should it only restore compatible fields while retaining the current immutable type? No change authorised or made; no tests run. Static reference evidence alone does not prove runtime reachability.

### #192 historical restore reachability and behaviour, 28 October 2026

**Confirmed by source inspection, not by executing the application:** `phase14CViewDevice()` builds the History tab from `previousTypeDetails`, and each snapshot is rendered with a `data-action="phase130-restore"` button (around line 6186). The delegated action handler calls `phase130RestoreHistory(id, Number(actionEl.dataset.index))` (around line 9254). Therefore the restore path is wired into the user interface and must not be classified as dead code.

`phase130RestoreHistory()` (around lines 6331–6377) checks the snapshot, selects recognised destination fields, uses `phase130ObsoleteDeviceFields()` to identify incompatible current values, displays a confirmation, archives selected overwritten/incompatible values, **assigns `device.type = snapshot.type`**, then persists with `saveState()` and rolls back `appState` on failure. The source comments explicitly preserve earlier snapshots. This behaviour potentially conflicts with the agreed fixed device-type rule, even though it remains accessible through historical configuration restoration.

**Recommendation for product-owner consideration:** preserve the ability to *view* every historical configuration and all stored historical data. Investigate whether Restore Configuration should be restricted to same-type restoration or replaced by an explicitly non-destructive compatible-field restore. Before proposing any change, check what users would lose, any existing test expectations and compatibility with historic backups. Do not silently alter existing restore behaviour, remove historical snapshots or claim runtime verification. No application changes or tests have occurred.

### #192 agreed historical-data preservation, 28 October 2026

**Product-owner decision:** preserve **all historical configurations and their data** during the v1.3.3 code clean-up. This is an approved preservation constraint, **not approval to alter the Restore Configuration behaviour**.

Further source inspection confirms that the History tab is conditionally displayed when `previousTypeDetails` contains snapshots; each snapshot remains readable and has a Restore Configuration action. The restoration handler currently changes `device.type` as well as fields, and preserves previous snapshots when saving. This must be reviewed alongside the fixed-type design. The preservation requirement applies even if a historical snapshot is not eligible for restoration under a future approved rule. No historical entries may be silently discarded or rewritten as part of clean-up.

**Next evidence needed before proposing implementation:** existing test coverage for History/Restore Configuration and backup round-tripping, and an explicit decision on same-type versus compatible-field restoration. Source inspection only; no tests executed or application code changed.

## Purpose

Future contributors should understand what each important function does without needing to know the development phase in which it was introduced. Existing historical names must remain documented until an approved and tested change replaces them.

## Proposed naming convention

- Prefer descriptive JavaScript `camelCase` names that explain the operation, such as `unassignDeviceFromRack()`.
- Prefer a verb and a clear object or outcome: `validateRackPlacement()`, `syncDeviceIpamRecord()`, `confirmDeviceTypeConversion()`.
- Avoid phase numbers, release numbers, unexplained abbreviations and generic names that hide scope.
- Use the same domain terms consistently across functions, workflows, tests and documentation.
- Name a function for its *verified behaviour*, not what its author originally intended.
- Do not rename published v1.3.0 code as part of this documentation exercise. Any approved rename requires updating every caller, test and reference, with regression testing.

## Initial function reference

| Current function | Purpose established by source inspection | Workflow | Suggested name for review |
| --- | --- | --- | --- |
| `handleDeviceSubmit(e, deviceId)` | Validate and save a new or edited device, synchronising IPAM and restoring an in-memory snapshot on reported failure | WF-03 | `saveDeviceFromForm()` |
| `phase130ObsoleteDeviceFields()` | Find populated recognised fields incompatible with the proposed device type | WF-03 | `getIncompatibleDeviceFields()` |
| `phase130ConfirmDeviceConversion()` | Display and await explicit confirmation before archiving incompatible device details | WF-03 | `confirmDeviceTypeConversion()` |
| `phase11BCommitDelete(before, label)` | Save an already-applied deletion; restore the prior in-memory snapshot if saving reports failure | WF-03, WF-04 and others pending call-site review | `commitDeletionWithRollback()` |
| `phase11BIntegrityIssues(state)` | Find duplicate device primary IPs, device IPAM mismatches and missing device, reservation or rack references | WF-02, WF-03, WF-04 | `findInventoryIntegrityIssues()` |
| `handleAssignSubmit(e, rackId, defaultSlot)` | Validate and save rack placement, with in-memory rollback on failed save | WF-03, WF-05 | `saveDeviceRackAssignment()` |
| `unassignDevice(deviceId)` | Clear a device's rack assignment and set its mount type to Desktop; save result currently unchecked | WF-03, WF-05 | `unassignDeviceFromRack()` |
| `deleteDevice(deviceId)` | Confirm deletion, remove device-linked allocations, clear reservations and delegate persistence and rollback | WF-03 | Existing name is already descriptive |

| `phase10DReportData()` | Prepare live device, location, rack and subnet report summaries; rack occupancy currently sums device U ranges by face and omits rack accessories (M-013) | WF-05, reporting | `buildInventoryReportData()` |

**Caution:** Proposed names are suggestions, not a refactoring plan. Review complete behaviour, call sites and naming collisions before selecting replacements.

## Reference entry requirements

For every significant function record its current name, location, purpose in plain English, inputs, state read or changed, dependencies and callers, validation, failure handling, related workflows, source revision, runtime test status and any proposed rename.

## Change control

Add proposed renames to the maintenance roadmap for investigation. Do not bundle broad cosmetic renaming with urgent data protection fixes unless explicitly approved. A successful rename must preserve behaviour and pass relevant regression tests.

## Additional verified function references

| Current function | Purpose established by source inspection | Workflow | Suggested name for review |
| --- | --- | --- | --- |
| `setDevicePrimaryIp(device, newIp)` | Validate a new primary IP, reject conflicting ownership or reservations, release the old device-owned allocation and update the new IPAM record | WF-03, WF-04 | Existing name is descriptive |
| `syncDeviceIpamRecord(device)` | Synchronise the device's current primary IPAM record with its reservation status, ID, name and notes | WF-03, WF-04 | Existing name is descriptive |
| `findDeviceUsingIp(ip, excludeDeviceId)` | Find a different device with the specified primary IP | WF-03, WF-04 | Existing name is descriptive |
| `phase11BCommitDelete(before, label)` | Persist a deletion already applied in memory; restore the snapshot and display an error if the save fails | WF-03, WF-04 | `commitDeletionWithRollback()` remains a proposal |

The initial reference table and this addition are incremental, not a complete function inventory.

## Relationship note: virtual hosts

`handleDeviceSubmit()` validates a selected virtual server host against an existing physical server. `deleteDevice()` does not explicitly inspect other devices' `virtualHostId` references before removing a physical server. The complete relationship validation path and runtime behaviour remain under investigation. See WF-03 and maintenance candidate M-005.

## Initial WF-04 function references

| Current function | Source-verified purpose | Workflow | Naming observation |
| --- | --- | --- | --- |
| `phase11BSubnetDependencies(subnet, state)` | Find devices and IPAM records associated with a subnet range | WF-04 | Candidate `getSubnetDependencies()` |
| `deleteSubnet(subId)` | Check child and related records, then present a deletion preview | WF-04 | Name does not convey that this function starts a guarded workflow rather than immediately deleting |
| `confirmDeleteSubnet(subId)` | Recheck the previewed dependencies before committing deletion | WF-04 | Existing name is reasonably descriptive |
| `deleteSubnetCommit(subId)` | Entry point for committing a confirmed subnet deletion; implementation not yet fully traced | WF-04 | Review after complete source inspection |

Names are descriptive suggestions only. No code has been renamed.

## Additional WF-04 functions

| Current function | Source-verified purpose | Workflow | Naming observation |
| --- | --- | --- | --- |
| `deleteSubnetCommit(subId)` | Recheck dependencies, retain devices and former primary IP metadata, release active allocations, remove subnet and linked VLAN, then save with rollback | WF-04 | `commitSubnetDeletion()` is a possible clearer name |
| `deleteVlan(vId)` | Block deletion when a network subnet still uses the VLAN; otherwise confirm and save deletion with rollback | WF-04 | Existing name is descriptive |
| `openIpModal(ip)` | Display IPAM editing form except for protected gateway addresses | WF-04 | Existing name is descriptive |
| `handleIpSubmit(e, ip)` | Protect device primary IPs and gateways, change independent IPAM allocation, restore prior allocation on reported save failure | WF-04 | `saveIpAllocationFromForm()` is a possible clearer name |

Suggested names are not approved code changes.

## WF-04 bulk IPAM naming candidates

| Current function | Current responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `phase12BBulkPlan()` | Validate a requested range and calculate eligible, blocked and changed IPAM records | `planBulkIpChanges()` | Review required |
| `handleBulkIpSubmit()` | Read the bulk form and present the confirmation preview | `previewBulkIpChanges()` | Review required |
| `phase12BApply()` | Recalculate the bulk plan, store a safety snapshot, apply changes and save | `applyBulkIpChanges()` | Review required |

No function renames have been made.

## WF-04 subnet editing functions

| Current function | Source-verified responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `openSubnetModalByVlanId()` | Resolve the linked subnet for a VLAN card, refusing ambiguous legacy ownership | `openSubnetEditorForVlan()` | Review required |
| `handleSubnetSubmit()` | Validate and save a subnet or IP Address Block, maintaining scoped VLAN records and rollback | `saveSubnetFromForm()` | Review required; function has several responsibilities |

Proposals do not imply code changes or approved refactoring.

## WF-04 gateway relationship reference

`setDevicePrimaryIp()` owns device primary IP allocation changes and permits eligible network devices to use gateway addresses. `handleSubnetSubmit()` also checks gateway collisions but does not explicitly exempt unchanged gateway ownership. This cross-function interaction is recorded as maintenance candidate M-009; no renaming or behaviour changes are approved.

## WF-06 backup and restore naming candidates

| Current function | Responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `phase20CreateBackup()` | Build a versioned JSON backup payload | `createVersionedInventoryBackup()` | Review required |
| `phase20ValidateBackupVersion()` | Validate backup metadata and supported schema version | `validateBackupMetadata()` | Review required |
| `phase20MigrateBackup()` | Clone and normalise legacy backup data, recording supported repairs | `normaliseImportedBackup()` | Review required |
| `phase16CCheckBackup()` | Validate and normalise an imported backup without retaining candidate as active inventory | `validateImportedInventory()` | Review required |
| `phase16CAPMountConflicts()` | Find imported Access Points with incompatible mounting | `findImportedAccessPointMountConflicts()` | Review required |
| `phase16CChooseAPMounts()` | Ask user to select supported mounting types for conflicting Access Points | `reviewAccessPointMountChoices()` | Review required |
| `phase16CReviewLegacyMountRepairs()` | Show proposed legacy mounting corrections and request approval | `reviewLegacyMountingCorrections()` | Review required |
| `importData()` | Orchestrate file reading, validation, reviews, snapshot and verified restore | `restoreInventoryFromBackupFile()` | Review required |

Names are suggestions only; no code changes authorised.

## WF-05 rack management naming candidates

| Current function | Responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `validateRackPlacement()` | Check rack bounds and equipment overlap | `validateDeviceRackPlacement()` | Review required |
| `handleRackSubmit()` | Validate and save rack creation or edits | `saveRackFromForm()` | Review required |
| `deleteRack()` | Block deletion of occupied racks and confirm deletion | `deleteEmptyRack()` | Review required |
| `handleAssignSubmit()` | Validate and save device rack placement | `saveDeviceRackAssignment()` | Review required |
| `unassignDevice()` | Remove a device's rack assignment | `removeDeviceFromRack()` | Review required |

Naming suggestions only; no application code changes authorised.

## WF-05 rack accessory and movement naming candidates

| Current function | Responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `phase13CAccessoryError()` | Validate accessory placement and collisions | `validateRackAccessoryPlacement()` | Review required |
| `phase13COpenAccessory()` | Open and handle rack accessory editing | `openRackAccessoryEditor()` | Review required |
| `phase13CMoveAccessory()` | Validate and save horizontal accessory moves | `moveRackAccessory()` | Review required |
| `phase13MoveDevice()` | Validate and save rack device moves | `moveRackMountedDevice()` | Review required |
| `phase13VTarget()` | Calculate a proposed vertical rail drop position | `calculateVerticalRailDropTarget()` | Review required |
| `phase17dTrackDrag()` | Auto-scroll the rack viewport during dragging | `trackRackDragAutoScroll()` | Review required |

Names are proposals only; code unchanged.

## WF-01 and WF-02 startup recovery naming candidates

| Current function | Responsibility | Proposed name | Status |
| --- | --- | --- | --- |
| `loadStoredState()` | Read and normalise saved inventory or preserve unreadable data | `loadAndValidateStoredInventory()` | Review required |
| `phase17ARecoveryBanner()` | Show protected recovery options | `showStoredInventoryRecoveryBanner()` | Review required |
| `saveState()` | Validate, persist and read back inventory | `saveAndVerifyInventory()` | Review required |

These are descriptive naming proposals, not approved code changes.

## WF-02 integrity repair functions

| Current function | Source-verified responsibility | Proposed name | Verification |
| --- | --- | --- | --- |
| `phase11CPlan(state=appState)` | Read devices, subnets, IPAM and racks to propose unambiguous IPAM synchronisation and list conflicts for manual review without mutating inventory | `planSafeIpamRepairs()` | Source inspected; browser pending |
| `phase11CPreviewRepair()` | Save current inventory JSON and proposed repairs in a temporary in-memory preview, then rerender | `previewInventoryIntegrityRepairs()` | Source inspected; browser pending |
| `phase11CDownloadSnapshot()` | Download the browser-local pre-repair JSON snapshot if present | `downloadPreRepairSnapshot()` | Source inspected; browser pending |
| `phase11CApplyRepair()` | Check preview freshness, request confirmation, save pre-repair snapshot, apply planned IPAM changes and invoke validated persistence; restore memory on failure | `applyConfirmedIpamRepairs()` | Source inspected; browser pending |
| `phase11CPanelHTML()` | Render preview, blocked items, confirmation control and snapshot download | `renderIntegrityRepairPanel()` | Source inspected; browser pending |

Source: `app/caffoot-lite.html` on `main`, blob `e8a24f6370a1bb572287aad91a314a3e4a189d94`, approximately lines 2201 to 2305. These are suggestions only; no renames authorised.

## WF-05 reporting function detail

**Current:** `phase10DReportData()`, published v1.3.0 `app/caffoot-lite.html`, approximately lines 2305–2336.

**Proposed:** `buildInventoryReportData()`, pending naming review and approval.

**Inputs and state:** No arguments. Reads `appState.devices`, `appState.racks` and `appState.subnets`; calls `phase10SubnetSummary()`. Returns device rows, location counts, rack occupancy summaries and subnet summaries without intentionally modifying inventory state.

**Callers:** `phase10DDownloadCsv(kind)` for CSV exports and `phase10DReportsHTML()` for the Reports screen.

**Existing behaviour and risk:** Rack face occupancy sums device U spans; accessories are omitted and overlapping device records may be counted more than once. The report percentage uses the higher of front or rear occupancy. This is a source-confirmed calculation inconsistency, not a browser-verified defect. Track functional review under M-013 and do not change the calculation as part of a cosmetic rename.

**Testing and change control:** No browser regression completed for this finding. If a rename is approved, update both callers and associated tests and documentation. Review the shared occupancy design separately before changing reported values.

## Reconciliation of WF-01 to WF-05 function references (22 October 2026)

Compared function mentions in `docs/workflows/TECHNICAL-WORKFLOWS.md` and `docs/audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md` against this reference, then searched the published v1.3.0 HTML for the corresponding declarations. This is a **reference coverage reconciliation**, not proof that every function in the application has been audited. Generic browser `confirm()` is excluded as a built-in, not a Caffoot function. All names are proposals only; no application changes are authorised. Where a responsibility is not yet verified, it is explicitly marked for review. Published HTML line numbers are approximate.

| Current function | Plain English responsibility or investigation note | Workflow | Suggested name | Source line | Evidence status |
| --- | --- | --- | --- | --- | --- |
| `cloneDefaultData()` | Returns a fresh default inventory state | WF-01 | `createDefaultInventoryState()` | 1178 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase16CRejectUnsafeKeys()` | Rejects dangerous JSON object keys before import | WF-01, WF-02 | `rejectUnsafeImportedObjectKeys()` | 7508 | Source location cross-checked; detailed behaviour pending where applicable |
| `normaliseState()` | Normalises imported or stored inventory, including legacy fields | WF-01, WF-02 | Retain existing name | 1392 | Source location cross-checked; detailed behaviour pending where applicable |
| `validateApplicationState()` | Checks application inventory integrity; does not currently validate rack accessory records | WF-01, WF-02 | Retain existing name | 1556 | Source location cross-checked; detailed behaviour pending where applicable |
| `recordAudit()` | Records audit history | WF-01, audit | `recordInventoryAuditEvent()` | 1788 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase10GatewaySubnet()` | Resolves gateway and subnet relationship | WF-04 | `getGatewaySubnet()` | 3987 | Source location cross-checked; detailed behaviour pending where applicable |
| `refreshAccessoryOptions()` | Updates accessory placement choices | WF-05 | `refreshRackAccessoryPlacementOptions()` | 8065 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase10DCsvCell()` | Quotes CSV values and protects against spreadsheet formula injection | WF-05 | `escapeInventoryCsvCell()` | 2337 | Source location cross-checked; detailed behaviour pending where applicable |
| `switchTab()` | Switches application sections | navigation | Retain existing name | 2078 | Source location cross-checked; detailed behaviour pending where applicable |
| `readAuditHistory()` | Reads stored audit history | WF-01, audit | `readInventoryAuditHistory()` | 1742 | Source location cross-checked; detailed behaviour pending where applicable |
| `auditChanges()` | Describes inventory changes for audit output | audit | `describeInventoryAuditChanges()` | 1751 | Source location cross-checked; detailed behaviour pending where applicable |
| `renderDashboardHTML()` | Builds dashboard markup | dashboard | Retain existing name | 2424 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase13GOpenGraphics()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 2810 | Reference only; full source review pending |
| `phase13GSaveGraphics()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 2815 | Reference only; full source review pending |
| `phase13LUsage()` | Counts numbered U occupied on a rack face; currently includes vertical accessory spans | WF-05 | `calculateRackFaceOccupancy()` | 2825 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase13LFreeRuns()` | Finds consecutive free U placements using rack placement validation | WF-05 | `findAvailableRackPositions()` | 2840 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase13LPrintRack()` | Builds printable front and rear elevations | WF-05 | `printRackElevations()` | 2850 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase120ManufacturerSave()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 3303 | Reference only; full source review pending |
| `phase120ModelSave()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 3400 | Reference only; full source review pending |
| `phase120SoftwareSaveCustom()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 3458 | Reference only; full source review pending |
| `phase120SoftwareArchive()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 3478 | Reference only; full source review pending |
| `phase120ServerServiceEditor()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 3528 | Reference only; full source review pending |
| `phase120HardwareCatalogue()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 6221 | Reference only; full source review pending |
| `phase18DCommit()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 3898 | Reference only; full source review pending |
| `phase130RestoreHistory()` | Restores historical device details | WF-03 | `restoreDeviceHistoryEntry()` | 6007 | Source location cross-checked; detailed behaviour pending where applicable |
| `duplicateDevice()` | Creates a device duplication draft | WF-03 | Retain existing name | 6083 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase14CViewDevice()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 5867 | Reference only; full source review pending |
| `renderContent()` | Renders active application content | navigation | Retain existing name | 2174 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase120ConfirmDiscard()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 5209 | Reference only; full source review pending |
| `closeModal()` | Closes modal interface | forms | Retain existing name | 5282 | Source location cross-checked; detailed behaviour pending where applicable |
| `browserStorageWarning()` | Displays browser storage warning | WF-01 | `renderBrowserStorageWarning()` | 2157 | Source location cross-checked; detailed behaviour pending where applicable |
| `exportAuditHistory()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 1798 | Reference only; full source review pending |
| `renderAuditHTML()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 1806 | Reference only; full source review pending |
| `phase16AClearSystem()` | Handles clearing stored inventory | WF-01 | `clearStoredInventoryWithConfirmation()` | 7382 | Source location cross-checked; detailed behaviour pending where applicable |
| `addCustomLocationOption()` | Adds a custom device location | WF-03 | `addCustomDeviceLocation()` | 7019 | Source location cross-checked; detailed behaviour pending where applicable |
| `phase19BUpdateFunction()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 6175 | Reference only; full source review pending |
| `phase120ArchiveServerService()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 6202 | Reference only; full source review pending |
| `phase120UpdateHardwareCatalogue()` | Function referenced by workflow or coverage audit; verify full responsibility and callers before proposing a rename | Audit coverage | `Review descriptive name()` | 6241 | Reference only; full source review pending |

**Ongoing control:** On completing each workflow, compare all significant functions encountered with this reference, record retained names as well as proposed changes, check their source declarations and callers, and review comments against P11. A separate exhaustive inventory of all declared functions and callback forms is still required before claiming whole-source coverage. Do not treat this list as completed browser testing.

## WF-01 to WF-04 supporting function inventory expansion, 22 October 2026

A declaration scan of the published HTML found 274 named function declarations overall. A **targeted selection of 50 declarations** from relevant source regions was compared with this register by exact function-name occurrence. Eighteen were absent; five are primarily settings/preferences functions to review under WF-09 rather than count as WF-01 to WF-04 omissions. The other thirteen are listed below as **source-located, purpose to verify in caller review**. Their location and names are confirmed, but their complete behaviour and failure contracts are not yet signed off.

| Current function | Published HTML line | Preliminary role suggested by source context | Workflow to review |
| --- | ---: | --- | --- |
| `phase120SeparateLegacyRackLocation()` | 1380 | Legacy rack/location normalisation helper | WF-01, WF-06 |
| `getDeviceById()` | 1857 | Find device by identifier | WF-03 |
| `changeSubnet()` | 4405 | Switch selected subnet | WF-04 |
| `openBulkIpModal()` | 4444 | Open bulk IPAM editor | WF-04 |
| `subnetCidrFeedback()` | 4519 | Explain CIDR and gateway suggestion status | WF-04 |
| `suggestSubnetGateway()` | 4537 | Suggest a subnet gateway | WF-04 |
| `openSubnetModal()` | 4565 | Open subnet form | WF-04 |
| `ipBelongsToSubnet()` | 4854 | Test IP membership in subnet | WF-04 |
| `showSubnetDeletionBlocked()` | 4891 | Explain blocked subnet deletion | WF-04 |
| `getSubnetForIp()` | 5683 | Find subnet for an IP address | WF-03, WF-04 |
| `refreshDeviceIpOptions()` | 5687 | Refresh available device IP choices | WF-03, WF-04 |
| `phase130ResolveDeviceConversion()` | 7095 | Resolve pending device conversion decision | WF-03 |
| `personalSafeStorageGet()` | 7206 | Read preferences from browser storage safely | WF-09, not current completion gate |

**Deferred to WF-09:** `caffootThemePreference()`, `caffootApplyTheme()`, `caffootSetTheme()`, `toggleDarkMode()` and `phase16ARenderSettings()`. `personalSafeStorageGet()` is likewise primarily WF-09 and is included above only to preserve the scan trail.

**Evidence boundary:** The source-region scan is not a whole-file workflow mapping, and textual presence does not demonstrate complete function documentation. Before P12 sign-off, trace the important callers, side effects, persistence and error handling, and decide whether each historical name should remain or be proposed for future improvement. No code has been renamed.


## Post-release merged correction function reference, 23 October 2026

**Scope:** Source inspected on `main` after the v1.3.0 publication. These functions describe merged repository code, **not** the immutable published v1.3.0 HTML. The original baseline notes above remain historical. No functions were renamed for this documentation update.

| Finding | Actual function and current responsibility | Failure protection and state affected | Workflow and evidence |
| --- | --- | --- | --- |
| M-001 | `unassignDevice(deviceId)` clears rack placement and changes mounting to Desktop | Saves an exact pre-change `appState` JSON copy; if `saveState()` fails, restores that state, displays an error and redraws | WF-02, WF-05; PR #79, Chromium run 39957395113 |
| M-018 | Existing device form custom location creation path | Captures `appState` before adding a location; failed save restores state, removes the newly inserted select option, restores the create option, displays an error and refocuses the input | WF-03, WF-07; PR #79, run 39957395113 |
| M-020 | `phase13GSaveGraphics(type)` saves a selected rack graphic for a device type | Captures `appState` before changing `deviceTypeGraphics`; failed save restores the original selection, displays an error and redraws | WF-03, WF-07; PR #79, run 39957395113 |
| M-012 | `phase11CApplyRepair()` applies a confirmed integrity repair preview | Checks the current inventory matches the preview, writes and immediately reads back the pre-repair safety copy before mutation; on failure restores in-memory inventory and attempts to restore the prior safety copy | WF-02, WF-04, WF-12; PR #77, run 39955498407 |
| M-031 | `phase12BApply()` applies a reviewed bulk IPAM request | Rebuilds the plan, saves and reads back the pre-bulk safety copy before changing allocations; cancels on snapshot failure; restores in-memory inventory if the main save fails | WF-02, WF-04, WF-12; runs 39957395113 and 39959581469 |
| M-011 | Import and restore failure handling (multiple helpers and storage operations) | Merged restoration logic checks whether the earlier safety copy was restored, including the absence case; if an ignored restoration is detected, recovery mode protects original stored bytes and blocks further saves | WF-01, WF-06, WF-12; PR #81, run 39959581469 |

**M-011 source tracing limitation:** The precise full caller chain and function-by-function responsibilities are not certified by this summary. See the WF-06 and WF-12 source notes and the M-011 test assertions before modifying restore logic. Do not treat this table as a complete source-level call graph.

**Test scope:** These are previously executed, targeted Chromium regressions at the recorded commits. They do not certify complete workflow coverage or all historical backups. No tests were executed while adding this reference. Refer to the [technical workflow register](../../workflows/TECHNICAL-WORKFLOWS.md) and [master audit](../../audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md) for evidence and open P12 gates.

**Documentation debt:** Complete the function declaration and caller inventory for M-011 and the wider WF-01 to WF-13 pathways. Future fixes must update this living reference, the applicable workflow, test matrix and findings register in the same change.


## M-011 import rollback call chain, source inspection 23 October 2026

**Source inspected:** Current `main` `app/caffoot-lite.html`, `importData(event)` at approximately lines 7794 to 7878, with related function declarations identified in the same source. This is a current merged-source inspection, not an execution of an import.

| Function or state | Current responsibility and dependency |
| --- | --- |
| `importData(event)` | Handles the chosen backup file, 10 MB limit, reading, review, replacement, verification, rollback, interface feedback and clearing the file input |
| `phase16CReadJson()`, `phase16CRejectUnsafeKeys()` | Parse backup JSON and reject unsafe object keys before candidate processing |
| `phase11ValidateBackupShape()`, `phase20ValidateBackupVersion()` | Check supported backup structure and version |
| `phase16CAPMountConflicts()`, `phase16CChooseAPMounts()`, `phase16CApplyAPChoices()` | Identify and review access point mounting conflicts before import |
| `phase16CCheckBackup()`, `phase16CReviewLegacyMountRepairs()` | Build a validated candidate and review legacy mounting repairs |
| `saveState()` | Persist the candidate inventory after the pre-restore safety copy has been written and read back |
| `phase17AStorageRecovery`, `phase17ARecoveryBanner()` | If rollback verification fails, retain original stored bytes, activate recovery protection and show the recovery banner |
| `phase16CShowImportError()` | Present restore errors without claiming success |

**Ordered storage safeguards:** After user confirmation, `importData()` captures the original in-memory state, the existing stored inventory bytes (`currentSnapshot`) and the previous safety copy (`previousSafetySnapshot`). It writes the pre-restore safety copy and checks the exact bytes by immediate readback. Only then does it set `appState` to the validated candidate and call `saveState()`. It reads the newly stored inventory back and compares its normalised form with the candidate. On failure, it restores the original in-memory state, writes back the original stored bytes and verifies them, then restores the previous safety copy (including the absent case) and verifies that too. If either rollback check fails, it enters protected recovery mode, displays a banner and blocks further saves through the existing recovery guard. Otherwise it reports the cancelled restore and retains the earlier inventory.

**Evidence boundary:** PR #81 and Chromium run 39959581469 previously exercised the main save failure, ignored previous safety copy restoration, recovery banner, retained original bytes and subsequent save blocking. The source inspection above was not a new browser test. The complete implementations of every called helper, all backup variants and all failure combinations have **not** been individually reverified at this checkpoint. The old statement above that this call chain was untraced is superseded for the top-level import path, but wider helper internals remain open.


## #101 implementation and verification checkpoint, 28 October 2026

The earlier inventories, proposed names and dated source inspections above remain historical evidence. They describe the state at their recorded revisions and are not a claim that the phase-prefixed names remain current in the #101 implementation branch.

**Implementation:** Draft [PR #195](https://github.com/Caffoot/Caffoot-Lite/pull/195), head `fix/101-descriptive-identifiers`, base `release/v1.3.3`, applies the approved descriptive internal naming and corresponding caller, DOM selector, action and test-reference changes. The application HTML and 29 test/check scripts are changed. Three historical localStorage keys retain their original spellings for saved-inventory and backup compatibility. Removed legacy names in intentional negative assertions remain negative checks, not missed renames. This work does not authorise the separately scoped #192 dead-code removal.

**Actual verified evidence on PR head `1dcee570a3b1d6cecaee580dba40ea035bd884df`:** consolidated Chromium regression [40684693871](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40684693871), release candidate validation [40684693997](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40684693997), release documentation consistency [40684693904](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40684693904), and Git history secret scan [40684693911](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40684693911) all **passed**. The consolidated browser run includes the audit, #99, #157, legacy device history and #100 checks. Previously successful release-branch focused history/rollback run 40594804262 is retained where applicable. Earlier failing PR-head runs were superseded by these passing checks. No application tests are required solely because documentation is reconciled.

**Naming map interpretation:** The earlier proposal table is a dated review record, not an exact machine-readable statement of the final implementation. Where proposed names differ, the current PR-head HTML and matching updated test scripts are authoritative for actual names. Do not copy old phase-prefixed examples into new application code or change persisted contracts to make names uniform.

**Remaining gate:** Reconcile the existing technical workflows, master audit, findings register, test evidence, roadmap and release records where affected; review the final documentation diff and compatibility boundaries. PR #195 remains draft and unmerged. Explicit product-owner approval is required separately before merge or release.


### #192 focused removal checkpoint, 28 October 2026

The product owner explicitly approved the narrow first clean-up batch after reviewing the reachability findings. Commit [25f6f5b](https://github.com/Caffoot/Caffoot-Lite/commit/25f6f5b197ee7143ee5b7b7f96f631ea1a117401) on `release/v1.3.3` removes the uncalled `confirmDeviceTypeConversion()` dialogue, its `resolveDeviceTypeConversion()` helper, pending resolver state, conversion action cases, and related Escape/Tab handling. It also removes the uncalled `renderBackupSafetyPanelHtml()` renderer. Current Settings backup controls, `downloadPreRestoreSafetySnapshot()`, inventory history, and existing backup validation/import logic are retained.

**Source verification actually performed:** fetched the committed HTML from GitHub; confirmed the removed function names, dialogue identifier and conversion resolver have no remaining textual references, and that the existing `download-snapshot` handler and `previousTypeDetails` support remain. These are source inspections, **not executed browser tests**. The commit-specific workflow lookup returned no pull-request-triggered runs; it does not establish whether branch-triggered workflows ran. Earlier passing tests for unchanged behaviour remain valid, but any focused verification required for changed modal keyboard handling or backup settings is still to be decided from existing test coverage. Do not declare this batch fully verified yet.

**Outstanding #192 scope:** The five other already-renamed zero-reference candidates (`doIpv4SubnetsOverlap`, `findInventoryIntegrityIssues`, `renderIntegrityRepairPreviewHtml`, `renderDeviceFasciaHtml`, `renderRackAccessoryFasciaHtml`) remain untouched pending reachability and safety review. No merge into `main` or release was authorised. This checkpoint supersedes the historical draft/unmerged PR #195 wording above for current status; PR #195 was merged before this #192 commit. The master audit, findings register and release gate still require reconciliation against this implementation and its evidence.


### #192 second approved removal, 28 October 2026

Following explicit product-owner approval, commit [3999d3b](https://github.com/Caffoot/Caffoot-Lite/commit/3999d3be1b1d17852e534929d7e41f938230053f) on `release/v1.3.3` removes only three declaration-only helpers: `doIpv4SubnetsOverlap()`, `renderDeviceFasciaHtml()`, and `renderRackAccessoryFasciaHtml()`. Source inspection before the change found no direct named callers. The existing `parseSupportedIpv4Subnet()` helper, rack graphics presets/configuration, active rack renderer and both integrity-related candidates were preserved. The commit was made directly to the release branch under the approved scope; no PR merge into `main` or release was performed.

**Evidence status:** Static reference/dependency checks performed before committing, including exact-name occurrence checks and explicit checks that protected functions remained in the generated replacement source. Browser tests have **not** been executed for this commit. The earlier #192 removal's focused Settings backup controls and modal keyboard verification remain outstanding; verify together only where coverage is genuinely missing, reusing valid earlier passing evidence. Master audit, findings register and release gate reconciliation remain open. Do not describe either #192 batch as fully browser-verified yet.


### #192 focused browser verification, 28 October 2026

**Confirmed passing evidence:** [GitHub Actions run 40698740608, job 122852454030](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40698740608/job/122852454030), manually dispatched on `release/v1.3.3` at head `2ed3ad0f465c0aa33fc332746a090e25d7a69dc5`. Job conclusion **success**. Standalone build and HTML verification passed; the selected `node test-browser-upgrade.cjs` Chromium step passed. The job log reports passing populated backup export, moved/renamed-file restore, cancellation, future-schema rejection, persistence, offline update guide and embedded licences. The test also includes preservation of legacy read-only device-type history on import, export and reload, and checks for backup, restore and safety-backup Settings controls. Unrelated consolidated, issue #99, issue #157 and issue #100 browser scenarios were **skipped**, not rerun. No full regression was executed.

**Earlier failure:** [run 40698342609](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40698342609/job/122851044501) failed because the old test called the obsolete `phase20CreateBackup()` name. Test-only correction `2ed3ad0` updated the current backup and device-history references; the succeeding run above resolves that specific failure without an application-code change. Focused workflow-dispatch scope was added in `a9fb467`. Source-only removals `25f6f5b` and `3999d3b` precede the verified test revision.

**Scope limit and outstanding work:** This run verifies the upgrade compatibility scenarios actually executed, not every rack interaction, all modal focus cases, or the separate inventory integrity repair system. The two preserved integrity helpers, `renderIntegrityRepairPreviewHtml()` and `findInventoryIntegrityIssues()`, remain investigation-only and must not be removed without a dedicated safety review and product-owner approval. Master audit, central findings and v1.3.3 release gate should be reconciled against this evidence. Earlier checkpoint notes describing browser tests as not yet executed are historical and are superseded for the executed upgrade scenario by this entry. Issue #192 remains open pending reconciliation.
