# Caffoot Lite Function Naming and Reference

**Status:** Draft documentation standard and initial source-verified examples. No application functions renamed.
**Baseline:** v1.3.0 source inspection on `main`; exact published release provenance remains to be confirmed.

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
