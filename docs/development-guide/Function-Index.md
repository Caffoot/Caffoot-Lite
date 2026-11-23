# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the indexed application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 1385.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`returnToExistingSignIn`](../../interface/loader.js#L8) | 8 |
| [`window.fetch`](../../interface/loader.js#L13) | 13 |
| [`renderInterfaceTemplate`](../../interface/loader.js#L38) | 38 |
| [`loadInterfaceText`](../../interface/loader.js#L46) | 46 |
| [`initialiseInterface`](../../interface/loader.js#L52) | 52 |
| [`staffScript.onerror`](../../interface/loader.js#L98) | 98 |
| [`staffScript.onload`](../../interface/loader.js#L99) | 99 |
| [`script.onerror`](../../interface/loader.js#L102) | 102 |
| [`script.onload`](../../interface/loader.js#L103) | 103 |
| [`stockScript.onerror`](../../interface/loader.js#L106) | 106 |
| [`stockScript.onload`](../../interface/loader.js#L107) | 107 |
| [`supplierScript.onerror`](../../interface/loader.js#L110) | 110 |
| [`supplierScript.onload`](../../interface/loader.js#L111) | 111 |
| [`lifecycleScript.onerror`](../../interface/loader.js#L114) | 114 |
| [`lifecycleScript.onload`](../../interface/loader.js#L115) | 115 |
| [`ukDatesScript.onerror`](../../interface/loader.js#L118) | 118 |
| [`ukDatesScript.onload`](../../interface/loader.js#L119) | 119 |
| [`serviceDeskScript.onerror`](../../interface/loader.js#L122) | 122 |
| [`serviceDeskScript.onload`](../../interface/loader.js#L123) | 123 |
| [`loadApplication`](../../interface/loader.js#L132) | 132 |
| [`applicationScript.onerror`](../../interface/loader.js#L135) | 135 |
| [`showInterfaceLoadError`](../../interface/loader.js#L144) | 144 |

## interface/application.js

| Function | Line |
| --- | ---: |
| [`publicDeviceTypeName`](../../interface/application.js#L17) | 17 |
| [`cloneDefaultData`](../../interface/application.js#L29) | 29 |
| [`isPlainObject`](../../interface/application.js#L33) | 33 |
| [`isValidIpv4`](../../interface/application.js#L37) | 37 |
| [`parseIpv4AddressToNumber`](../../interface/application.js#L47) | 47 |
| [`formatIpv4Address`](../../interface/application.js#L51) | 51 |
| [`parseSupportedIpv4Subnet`](../../interface/application.js#L54) | 54 |
| [`isUsableHostAddressInSubnet`](../../interface/application.js#L63) | 63 |
| [`isValidCidr24`](../../interface/application.js#L67) | 67 |
| [`hierarchyIpNumber`](../../interface/application.js#L71) | 71 |
| [`hierarchyIpString`](../../interface/application.js#L76) | 76 |
| [`hierarchyParseCidr`](../../interface/application.js#L77) | 77 |
| [`hierarchyValidate`](../../interface/application.js#L85) | 85 |
| [`ancestor`](../../interface/application.js#L125) | 125 |
| [`independentNetworkInsideBlock`](../../interface/application.js#L135) | 135 |
| [`hierarchyValidateTypes`](../../interface/application.js#L150) | 150 |
| [`previewLegacyVlanOwnershipInApp`](../../interface/application.js#L181) | 181 |
| [`reconcileLegacyVlanOwnership`](../../interface/application.js#L195) | 195 |
| [`migrateLegacyRackLocation`](../../interface/application.js#L233) | 233 |
| [`normaliseLegacyRackAccessoryTypes`](../../interface/application.js#L247) | 247 |
| [`normaliseState`](../../interface/application.js#L254) | 254 |
| [`validateApplicationState`](../../interface/application.js#L423) | 423 |
| [`loadStoredState`](../../interface/application.js#L490) | 490 |
| [`showStorageRecoveryBanner`](../../interface/application.js#L496) | 496 |
| [`download.onclick`](../../interface/application.js#L511) | 511 |
| [`reset.onclick`](../../interface/application.js#L520) | 520 |
| [`caffootThemePreference`](../../interface/application.js#L561) | 561 |
| [`caffootApplyTheme`](../../interface/application.js#L568) | 568 |
| [`caffootSetTheme`](../../interface/application.js#L582) | 582 |
| [`onSystemThemeChange`](../../interface/application.js#L593) | 593 |
| [`toggleDarkMode`](../../interface/application.js#L602) | 602 |
| [`readAuditHistory`](../../interface/application.js#L609) | 609 |
| [`auditChanges`](../../interface/application.js#L613) | 613 |
| [`recordAudit`](../../interface/application.js#L650) | 650 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L659) | 659 |
| [`exportAuditHistory`](../../interface/application.js#L671) | 671 |
| [`auditVisibleRows`](../../interface/application.js#L683) | 683 |
| [`auditDate`](../../interface/application.js#L705) | 705 |
| [`renderAuditHTML`](../../interface/application.js#L709) | 709 |
| [`hydrateAudit`](../../interface/application.js#L742) | 742 |
| [`applyAuditFilters`](../../interface/application.js#L750) | 750 |
| [`closeAuditDetail`](../../interface/application.js#L785) | 785 |
| [`showAuditDetail`](../../interface/application.js#L791) | 791 |
| [`nextRenderUsers`](../../interface/application.js#L820) | 820 |
| [`nextRenderAccount`](../../interface/application.js#L822) | 822 |
| [`hydrateAccount`](../../interface/application.js#L823) | 823 |
| [`removeAccountPhoto`](../../interface/application.js#L824) | 824 |
| [`saveState`](../../interface/application.js#L827) | 827 |
| [`getDeviceById`](../../interface/application.js#L830) | 830 |
| [`findDeviceUsingIp`](../../interface/application.js#L834) | 834 |
| [`setDevicePrimaryIp`](../../interface/application.js#L839) | 839 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L898) | 898 |
| [`isRackMountedDevice`](../../interface/application.js#L911) | 911 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L914) | 914 |
| [`getRackShelfLocation`](../../interface/application.js#L926) | 926 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L932) | 932 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L948) | 948 |
| [`openRackShelfCreation`](../../interface/application.js#L966) | 966 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L980) | 980 |
| [`createRackShelfFromDevice`](../../interface/application.js#L990) | 990 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L997) | 997 |
| [`options`](../../interface/application.js#L1003) | 1003 |
| [`validateRackPlacement`](../../interface/application.js#L1024) | 1024 |
| [`showNotification`](../../interface/application.js#L1060) | 1060 |
| [`showToast`](../../interface/application.js#L1074) | 1074 |
| [`toggleSidebar`](../../interface/application.js#L1158) | 1158 |
| [`switchTab`](../../interface/application.js#L1177) | 1177 |
| [`escapeHtml`](../../interface/application.js#L1212) | 1212 |
| [`inlineJsArg`](../../interface/application.js#L1221) | 1221 |
| [`browserStorageWarning`](../../interface/application.js#L1229) | 1229 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1232) | 1232 |
| [`renderSectionTabIcon`](../../interface/application.js#L1238) | 1238 |
| [`renderSectionHeader`](../../interface/application.js#L1244) | 1244 |
| [`tab`](../../interface/application.js#L1245) | 1245 |
| [`revealSectionTab`](../../interface/application.js#L1272) | 1272 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1279) | 1279 |
| [`renderContent`](../../interface/application.js#L1299) | 1299 |
| [`updateScrollHint`](../../interface/application.js#L1360) | 1360 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1371) | 1371 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1406) | 1406 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1410) | 1410 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1414) | 1414 |
| [`buildInventoryReportData`](../../interface/application.js#L1420) | 1420 |
| [`occupancy`](../../interface/application.js#L1436) | 1436 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1459) | 1459 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1465) | 1465 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1491) | 1491 |
| [`renderDashboardHTML`](../../interface/application.js#L1520) | 1520 |
| [`statusPill`](../../interface/application.js#L1626) | 1626 |
| [`insightSegment`](../../interface/application.js#L1643) | 1643 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1689) | 1689 |
| [`getCategoryIcon`](../../interface/application.js#L1706) | 1706 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1721) | 1721 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1730) | 1730 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1735) | 1735 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1750) | 1750 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1765) | 1765 |
| [`printRackElevation`](../../interface/application.js#L1775) | 1775 |
| [`safe`](../../interface/application.js#L1778) | 1778 |
| [`printRackElevationInFrame`](../../interface/application.js#L1809) | 1809 |
| [`frame.onload`](../../interface/application.js#L1819) | 1819 |
| [`renderRackHubV13`](../../interface/application.js#L1840) | 1840 |
| [`card`](../../interface/application.js#L1845) | 1845 |
| [`mark`](../../interface/application.js#L1854) | 1854 |
| [`bar`](../../interface/application.js#L1870) | 1870 |
| [`chartBox`](../../interface/application.js#L1871) | 1871 |
| [`chartRows`](../../interface/application.js#L1872) | 1872 |
| [`rackSpaceGuide`](../../interface/application.js#L1874) | 1874 |
| [`renderRacksHTML`](../../interface/application.js#L1943) | 1943 |
| [`changeRack`](../../interface/application.js#L2010) | 2010 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L2029) | 2029 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L2036) | 2036 |
| [`getVisibleDevices`](../../interface/application.js#L2042) | 2042 |
| [`filterHardwareModels`](../../interface/application.js#L2067) | 2067 |
| [`openCatalogueModal`](../../interface/application.js#L2106) | 2106 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2115) | 2115 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2139) | 2139 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2177) | 2177 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2189) | 2189 |
| [`renderCatalogueButton`](../../interface/application.js#L2206) | 2206 |
| [`renderCatalogueRecord`](../../interface/application.js#L2210) | 2210 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2215) | 2215 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2234) | 2234 |
| [`add`](../../interface/application.js#L2236) | 2236 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2281) | 2281 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2288) | 2288 |
| [`openHardwareModelManager`](../../interface/application.js#L2300) | 2300 |
| [`opts`](../../interface/application.js#L2305) | 2305 |
| [`saveHardwareModel`](../../interface/application.js#L2323) | 2323 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2352) | 2352 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2366) | 2366 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2388) | 2388 |
| [`add`](../../interface/application.js#L2390) | 2390 |
| [`options`](../../interface/application.js#L2426) | 2426 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2440) | 2440 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2455) | 2455 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2470) | 2470 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2478) | 2478 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2489) | 2489 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2498) | 2498 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2520) | 2520 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2531) | 2531 |
| [`openServerServiceEditor`](../../interface/application.js#L2548) | 2548 |
| [`saveServerServiceEntry`](../../interface/application.js#L2557) | 2557 |
| [`restoreArchivedServerService`](../../interface/application.js#L2570) | 2570 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2579) | 2579 |
| [`renderDevicesHTML`](../../interface/application.js#L2591) | 2591 |
| [`renderHardwareMetric`](../../interface/application.js#L2599) | 2599 |
| [`renderHardwareChart`](../../interface/application.js#L2604) | 2604 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2614) | 2614 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2633) | 2633 |
| [`renderArchivedSoftware`](../../interface/application.js#L2641) | 2641 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2680) | 2680 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2687) | 2687 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2688) | 2688 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2689) | 2689 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2692) | 2692 |
| [`openManageTypesModal`](../../interface/application.js#L2712) | 2712 |
| [`openManageLocationsModal`](../../interface/application.js#L2713) | 2713 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2716) | 2716 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2738) | 2738 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2745) | 2745 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2753) | 2753 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2773) | 2773 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2774) | 2774 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2775) | 2775 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2790) | 2790 |
| [`deleteDeviceType`](../../interface/application.js#L2810) | 2810 |
| [`deleteDeviceLocation`](../../interface/application.js#L2811) | 2811 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2819) | 2819 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2823) | 2823 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2850) | 2850 |
| [`nodes`](../../interface/application.js#L2860) | 2860 |
| [`renderIpamManage`](../../interface/application.js#L2886) | 2886 |
| [`renderIpamHTML`](../../interface/application.js#L2937) | 2937 |
| [`changeSubnet`](../../interface/application.js#L3098) | 3098 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3111) | 3111 |
| [`openIpamModal`](../../interface/application.js#L3137) | 3137 |
| [`openBulkIpModal`](../../interface/application.js#L3142) | 3142 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3149) | 3149 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3153) | 3153 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3172) | 3172 |
| [`applyBulkIpChanges`](../../interface/application.js#L3188) | 3188 |
| [`subnetCidrFeedback`](../../interface/application.js#L3202) | 3202 |
| [`suggestSubnetGateway`](../../interface/application.js#L3220) | 3220 |
| [`openSubnetModal`](../../interface/application.js#L3248) | 3248 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3252) | 3252 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3278) | 3278 |
| [`handleSubnetSubmit`](../../interface/application.js#L3298) | 3298 |
| [`showSubnetFormError`](../../interface/application.js#L3505) | 3505 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3521) | 3521 |
| [`subnetNameConflicts`](../../interface/application.js#L3535) | 3535 |
| [`subnetHasVlan`](../../interface/application.js#L3542) | 3542 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3545) | 3545 |
| [`openMultipleSubnets`](../../interface/application.js#L3553) | 3553 |
| [`option`](../../interface/application.js#L3555) | 3555 |
| [`visibility`](../../interface/application.js#L3560) | 3560 |
| [`planningVisibility`](../../interface/application.js#L3564) | 3564 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3582) | 3582 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3594) | 3594 |
| [`read`](../../interface/application.js#L3596) | 3596 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3614) | 3614 |
| [`reject`](../../interface/application.js#L3616) | 3616 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3653) | 3653 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3657) | 3657 |
| [`add`](../../interface/application.js#L3660) | 3660 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3687) | 3687 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3695) | 3695 |
| [`field`](../../interface/application.js#L3698) | 3698 |
| [`capture`](../../interface/application.js#L3708) | 3708 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3742) | 3742 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3746) | 3746 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3752) | 3752 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3773) | 3773 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3777) | 3777 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3781) | 3781 |
| [`deleteSubnet`](../../interface/application.js#L3792) | 3792 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3852) | 3852 |
| [`deleteSubnetCommit`](../../interface/application.js#L3880) | 3880 |
| [`deleteVlan`](../../interface/application.js#L3910) | 3910 |
| [`openIpModal`](../../interface/application.js#L3936) | 3936 |
| [`handleIpSubmit`](../../interface/application.js#L3953) | 3953 |
| [`openEquipmentSupplierModal`](../../interface/application.js#L4018) | 4018 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L4032) | 4032 |
| [`modalFormSnapshot`](../../interface/application.js#L4042) | 4042 |
| [`stockFormHasChanges`](../../interface/application.js#L4058) | 4058 |
| [`rememberModalForm`](../../interface/application.js#L4062) | 4062 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L4067) | 4067 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L4097) | 4097 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4116) | 4116 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4125) | 4125 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4131) | 4131 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4137) | 4137 |
| [`closeModal`](../../interface/application.js#L4146) | 4146 |
| [`openModal`](../../interface/application.js#L4200) | 4200 |
| [`readRackDimension`](../../interface/application.js#L4273) | 4273 |
| [`formatRackDimension`](../../interface/application.js#L4280) | 4280 |
| [`rackPhysicalDetails`](../../interface/application.js#L4285) | 4285 |
| [`openRackModal`](../../interface/application.js#L4294) | 4294 |
| [`handleRackSubmit`](../../interface/application.js#L4310) | 4310 |
| [`deleteRack`](../../interface/application.js#L4377) | 4377 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4399) | 4399 |
| [`refresh`](../../interface/application.js#L4422) | 4422 |
| [`openAssignDeviceModal`](../../interface/application.js#L4499) | 4499 |
| [`refresh`](../../interface/application.js#L4516) | 4516 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4523) | 4523 |
| [`handleAssignSubmit`](../../interface/application.js#L4557) | 4557 |
| [`unassignDevice`](../../interface/application.js#L4602) | 4602 |
| [`getSubnetForIp`](../../interface/application.js#L4619) | 4619 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4623) | 4623 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4670) | 4670 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4679) | 4679 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4688) | 4688 |
| [`inside`](../../interface/application.js#L4695) | 4695 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4713) | 4713 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4722) | 4722 |
| [`toggleDeviceMountType`](../../interface/application.js#L4766) | 4766 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4790) | 4790 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4795) | 4795 |
| [`openDeviceReviewModal`](../../interface/application.js#L4813) | 4813 |
| [`openDeviceDetailView`](../../interface/application.js#L4818) | 4818 |
| [`safe`](../../interface/application.js#L4828) | 4828 |
| [`field`](../../interface/application.js#L4829) | 4829 |
| [`section`](../../interface/application.js#L4834) | 4834 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4886) | 4886 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4892) | 4892 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4911) | 4911 |
| [`navigateToDeviceRack`](../../interface/application.js#L4930) | 4930 |
| [`duplicateDevice`](../../interface/application.js#L4958) | 4958 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L5028) | 5028 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L5033) | 5033 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L5038) | 5038 |
| [`openServerServiceManager`](../../interface/application.js#L5039) | 5039 |
| [`captureServerServiceSelections`](../../interface/application.js#L5044) | 5044 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L5050) | 5050 |
| [`confirmServerServiceArchive`](../../interface/application.js#L5071) | 5071 |
| [`archiveServerService`](../../interface/application.js#L5079) | 5079 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L5105) | 5105 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L5109) | 5109 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L5127) | 5127 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L5131) | 5131 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L5134) | 5134 |
| [`updateHardwareCatalogue`](../../interface/application.js#L5141) | 5141 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5169) | 5169 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5173) | 5173 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5218) | 5218 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5252) | 5252 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5269) | 5269 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5272) | 5272 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5273) | 5273 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5278) | 5278 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5284) | 5284 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5322) | 5322 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5323) | 5323 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5330) | 5330 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5331) | 5331 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5346) | 5346 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5352) | 5352 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5375) | 5375 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5391) | 5391 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5394) | 5394 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5403) | 5403 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5414) | 5414 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5423) | 5423 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5426) | 5426 |
| [`isSoftwareDetailField`](../../interface/application.js#L5433) | 5433 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5441) | 5441 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5450) | 5450 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5456) | 5456 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5468) | 5468 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5508) | 5508 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5536) | 5536 |
| [`updateInlinePickerCount`](../../interface/application.js#L5545) | 5545 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5551) | 5551 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5564) | 5564 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5573) | 5573 |
| [`fail`](../../interface/application.js#L5579) | 5579 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5633) | 5633 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5649) | 5649 |
| [`fail`](../../interface/application.js#L5654) | 5654 |
| [`serverStorageField`](../../interface/application.js#L5701) | 5701 |
| [`renderServerStorageFields`](../../interface/application.js#L5706) | 5706 |
| [`renderServerStorageFields.action`](../../interface/application.js#L5709) | 5709 |
| [`captureServerStorageValues`](../../interface/application.js#L5721) | 5721 |
| [`refreshServerStorageControls`](../../interface/application.js#L5741) | 5741 |
| [`updateServerStorage`](../../interface/application.js#L5751) | 5751 |
| [`updateServerStorage.vdev`](../../interface/application.js#L5755) | 5755 |
| [`serverStorageDetailRows`](../../interface/application.js#L5763) | 5763 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5773) | 5773 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5803) | 5803 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5809) | 5809 |
| [`getPlatformVersionOptions`](../../interface/application.js#L6175) | 6175 |
| [`isWindowsPlatform`](../../interface/application.js#L6178) | 6178 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L6182) | 6182 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L6185) | 6185 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L6189) | 6189 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L6206) | 6206 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L6210) | 6210 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6230) | 6230 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6257) | 6257 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6306) | 6306 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6314) | 6314 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6325) | 6325 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6329) | 6329 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6341) | 6341 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6353) | 6353 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6380) | 6380 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6384) | 6384 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6388) | 6388 |
| [`getDefaultMountType`](../../interface/application.js#L6401) | 6401 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6404) | 6404 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6409) | 6409 |
| [`initialiseNotesEditor`](../../interface/application.js#L6426) | 6426 |
| [`inlineMarkdown`](../../interface/application.js#L6431) | 6431 |
| [`render`](../../interface/application.js#L6444) | 6444 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6478) | 6478 |
| [`activate`](../../interface/application.js#L6872) | 6872 |
| [`openDeviceModal`](../../interface/application.js#L6953) | 6953 |
| [`selectableType`](../../interface/application.js#L6961) | 6961 |
| [`syncVmPurpose`](../../interface/application.js#L7003) | 7003 |
| [`clearFieldError`](../../interface/application.js#L7067) | 7067 |
| [`captureDeviceFormDraft`](../../interface/application.js#L7088) | 7088 |
| [`createRackFromDevice`](../../interface/application.js#L7126) | 7126 |
| [`cancelRackFromDevice`](../../interface/application.js#L7134) | 7134 |
| [`createSubnetFromDevice`](../../interface/application.js#L7144) | 7144 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L7157) | 7157 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L7171) | 7171 |
| [`addCustomLocationOption`](../../interface/application.js#L7183) | 7183 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L7223) | 7223 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7235) | 7235 |
| [`finish`](../../interface/application.js#L7255) | 7255 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7280) | 7280 |
| [`finish`](../../interface/application.js#L7294) | 7294 |
| [`handleDeviceSubmit`](../../interface/application.js#L7314) | 7314 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7354) | 7354 |
| [`deleteDevice`](../../interface/application.js#L7503) | 7503 |
| [`personalSafeStorageGet`](../../interface/application.js#L7560) | 7560 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7565) | 7565 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7575) | 7575 |
| [`button`](../../interface/application.js#L7576) | 7576 |
| [`themeChoice`](../../interface/application.js#L7580) | 7580 |
| [`guideLinks`](../../interface/application.js#L7597) | 7597 |
| [`loadSmtpSettings`](../../interface/application.js#L7628) | 7628 |
| [`renderApplicationSettings`](../../interface/application.js#L7643) | 7643 |
| [`syncSmtpForm`](../../interface/application.js#L7647) | 7647 |
| [`updateSmtpFields`](../../interface/application.js#L7669) | 7669 |
| [`hydrateSettings`](../../interface/application.js#L7682) | 7682 |
| [`caffootCompareVersions`](../../interface/application.js#L7705) | 7705 |
| [`parse`](../../interface/application.js#L7706) | 7706 |
| [`caffootShowLicences`](../../interface/application.js#L7728) | 7728 |
| [`caffootUpdateGuide`](../../interface/application.js#L7733) | 7733 |
| [`caffootCheckUpdates`](../../interface/application.js#L7738) | 7738 |
| [`checkInventorySafety`](../../interface/application.js#L7769) | 7769 |
| [`requestInventoryReset`](../../interface/application.js#L7792) | 7792 |
| [`createInventoryBackup`](../../interface/application.js#L7822) | 7822 |
| [`validateBackupVersion`](../../interface/application.js#L7834) | 7834 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7849) | 7849 |
| [`exportData`](../../interface/application.js#L7857) | 7857 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7870) | 7870 |
| [`validateBackupStructure`](../../interface/application.js#L7885) | 7885 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7902) | 7902 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7914) | 7914 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7953) | 7953 |
| [`findRackImportConflicts`](../../interface/application.js#L7957) | 7957 |
| [`place`](../../interface/application.js#L7963) | 7963 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L8009) | 8009 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L8030) | 8030 |
| [`showBackupImportError`](../../interface/application.js#L8035) | 8035 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L8039) | 8039 |
| [`finish`](../../interface/application.js#L8049) | 8049 |
| [`onClick`](../../interface/application.js#L8058) | 8058 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L8068) | 8068 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L8079) | 8079 |
| [`finish`](../../interface/application.js#L8090) | 8090 |
| [`onClick`](../../interface/application.js#L8099) | 8099 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L8114) | 8114 |
| [`importData`](../../interface/application.js#L8130) | 8130 |
| [`reader.onload`](../../interface/application.js#L8140) | 8140 |
| [`reader.onerror`](../../interface/application.js#L8214) | 8214 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8341) | 8341 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8357) | 8357 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8368) | 8368 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8402) | 8402 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8460) | 8460 |
| [`cancel`](../../interface/application.js#L8473) | 8473 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8489) | 8489 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8506) | 8506 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8531) | 8531 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8545) | 8545 |
| [`clearRackDropPreview`](../../interface/application.js#L8548) | 8548 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8553) | 8553 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8565) | 8565 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8571) | 8571 |
| [`trackRackDrag`](../../interface/application.js#L8580) | 8580 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8611) | 8611 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8621) | 8621 |
| [`getRackDropPosition`](../../interface/application.js#L8714) | 8714 |
| [`window.onload`](../../interface/application.js#L9182) | 9182 |
| [`inventorySectionAccess`](../../interface/application.js#L9204) | 9204 |
| [`addDirectoryAccess`](../../interface/application.js#L9205) | 9205 |
| [`canAssignEquipmentSupplier`](../../interface/application.js#L9217) | 9217 |
| [`canSubmitServiceDeskForm`](../../interface/application.js#L9221) | 9221 |
| [`canSubmitSupplierForm`](../../interface/application.js#L9228) | 9228 |
| [`refreshStockAccess`](../../interface/application.js#L9253) | 9253 |
| [`refreshCentralInventory`](../../interface/application.js#L9265) | 9265 |
| [`postInventory`](../../interface/application.js#L9294) | 9294 |
| [`isBlockedAction`](../../interface/application.js#L9346) | 9346 |
| [`applyAllowedControls`](../../interface/application.js#L9379) | 9379 |
| [`enhanceLongSelects`](../../interface/application.js#L9459) | 9459 |
| [`sync`](../../interface/application.js#L9511) | 9511 |
| [`close`](../../interface/application.js#L9517) | 9517 |
| [`choose`](../../interface/application.js#L9521) | 9521 |
| [`draw`](../../interface/application.js#L9526) | 9526 |
| [`open`](../../interface/application.js#L9544) | 9544 |
| [`enhanceSelects`](../../interface/application.js#L9601) | 9601 |
| [`setDepartmentExpanded`](../../interface/application.js#L9646) | 9646 |
| [`isSupplierPage`](../../interface/application.js#L9662) | 9662 |
| [`landingTab`](../../interface/application.js#L9666) | 9666 |
| [`workspaceHashTab`](../../interface/application.js#L9671) | 9671 |
| [`switchTab`](../../interface/application.js#L9695) | 9695 |
| [`navigate`](../../interface/application.js#L9736) | 9736 |
| [`viewSupplierEquipment`](../../interface/application.js#L9743) | 9743 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9761) | 9761 |
| [`openDeviceDetailView`](../../interface/application.js#L9787) | 9787 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9803) | 9803 |
| [`forbidRackMount`](../../interface/application.js#L9862) | 9862 |
| [`installDeviceSupplier`](../../interface/application.js#L9872) | 9872 |
| [`installDeviceStockControls`](../../interface/application.js#L9886) | 9886 |
| [`loadDeviceStockSources`](../../interface/application.js#L9901) | 9901 |
| [`select.onchange`](../../interface/application.js#L9914) | 9914 |
| [`openDeviceModal`](../../interface/application.js#L9940) | 9940 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9984) | 9984 |
| [`relatedChanges`](../../interface/application.js#L9990) | 9990 |
| [`saveDevice`](../../interface/application.js#L10001) | 10001 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L10062) | 10062 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L10063) | 10063 |
| [`nextIpamBridge.save`](../../interface/application.js#L10085) | 10085 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L10107) | 10107 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L10129) | 10129 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L10172) | 10172 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L10217) | 10217 |
| [`openDeviceIpamLink`](../../interface/application.js#L10221) | 10221 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L10229) | 10229 |
| [`nextSettingsBridge.save`](../../interface/application.js#L10270) | 10270 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L10287) | 10287 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L10288) | 10288 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L10289) | 10289 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L10303) | 10303 |
| [`nextResetBridge.reset`](../../interface/application.js#L10334) | 10334 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L10361) | 10361 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L10393) | 10393 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L10401) | 10401 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L10410) | 10410 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L10411) | 10411 |
| [`nextRackBridge.save`](../../interface/application.js#L10446) | 10446 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L10449) | 10449 |
| [`nextRackBridge.persist`](../../interface/application.js#L10452) | 10452 |
| [`reserveForDelete`](../../interface/application.js#L10474) | 10474 |
| [`removeDevice`](../../interface/application.js#L10482) | 10482 |
| [`cancelDelete`](../../interface/application.js#L10508) | 10508 |
| [`saveArchivedInstallation`](../../interface/application.js#L10514) | 10514 |
| [`nextDeviceBridge.canReadSuppliers`](../../interface/application.js#L10545) | 10545 |
| [`nextDeviceBridge.canAssignSupplier`](../../interface/application.js#L10546) | 10546 |
| [`renderAccountSections`](../../interface/application.js#L10553) | 10553 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10581) | 10581 |
| [`nextRenderAccount`](../../interface/application.js#L10592) | 10592 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10602) | 10602 |
| [`closeEmailVerification`](../../interface/application.js#L10626) | 10626 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10633) | 10633 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10644) | 10644 |
| [`hydrateAccount`](../../interface/application.js#L10698) | 10698 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10736) | 10736 |
| [`loadAccountProfile`](../../interface/application.js#L10749) | 10749 |
| [`removeAccountPhoto`](../../interface/application.js#L10765) | 10765 |
| [`permissionLabel`](../../interface/application.js#L10777) | 10777 |
| [`accountMfaLabel`](../../interface/application.js#L10780) | 10780 |
| [`renderRoleMemberships`](../../interface/application.js#L10783) | 10783 |
| [`renderRoleCatalogue`](../../interface/application.js#L10789) | 10789 |
| [`openRoleLayer`](../../interface/application.js#L10794) | 10794 |
| [`closeRoleLayer`](../../interface/application.js#L10805) | 10805 |
| [`renderRoleDefinition`](../../interface/application.js#L10811) | 10811 |
| [`renderRoleImpact`](../../interface/application.js#L10815) | 10815 |
| [`access`](../../interface/application.js#L10820) | 10820 |
| [`state`](../../interface/application.js#L10824) | 10824 |
| [`requestRoleChange`](../../interface/application.js#L10829) | 10829 |
| [`roleNotificationMessage`](../../interface/application.js#L10836) | 10836 |
| [`previewRoleAction`](../../interface/application.js#L10840) | 10840 |
| [`openRoleEditor`](../../interface/application.js#L10845) | 10845 |
| [`nextRenderUsers`](../../interface/application.js#L10908) | 10908 |
| [`profileFields`](../../interface/application.js#L10910) | 10910 |
| [`stat`](../../interface/application.js#L10931) | 10931 |
| [`bars`](../../interface/application.js#L10934) | 10934 |
| [`operation`](../../interface/application.js#L10991) | 10991 |
| [`filterUserRows`](../../interface/application.js#L11011) | 11011 |
| [`closeUserWorkspace`](../../interface/application.js#L11035) | 11035 |
| [`loadCentralUsers`](../../interface/application.js#L11064) | 11064 |
| [`changeCentralUser`](../../interface/application.js#L11070) | 11070 |
| [`importPanel`](../../interface/application.js#L11081) | 11081 |
| [`cancelImport`](../../interface/application.js#L11085) | 11085 |
| [`nextImportModalClosed`](../../interface/application.js#L11091) | 11091 |
| [`showImportReview`](../../interface/application.js#L11092) | 11092 |
| [`chooseImportFile`](../../interface/application.js#L11132) | 11132 |
| [`actOnImport`](../../interface/application.js#L11149) | 11149 |
| [`canSubmitLifecycleSettings`](../../interface/application.js#L11350) | 11350 |
| [`openLifecycleSettings`](../../interface/application.js#L11353) | 11353 |
| [`close`](../../interface/application.js#L11372) | 11372 |
| [`leaveLifecycleSettings`](../../interface/application.js#L11378) | 11378 |

## interface/sign-in.js

| Function | Line |
| --- | ---: |
| [`$`](../../interface/sign-in.js#L2) | 2 |
| [`applySignInTheme`](../../interface/sign-in.js#L5) | 5 |
| [`showMfaQr`](../../interface/sign-in.js#L21) | 21 |
| [`showSession`](../../interface/sign-in.js#L30) | 30 |
| [`request`](../../interface/sign-in.js#L40) | 40 |
| [`display`](../../interface/sign-in.js#L44) | 44 |
| [`showRecoveryFeedback`](../../interface/sign-in.js#L166) | 166 |
| [`resetRecoveryFlow`](../../interface/sign-in.js#L171) | 171 |
| [`clearRequiredMfaDisplay`](../../interface/sign-in.js#L228) | 228 |

## interface/staff-directory.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](../../interface/staff-directory.js#L10) | 10 |
| [`displayDeviceType`](../../interface/staff-directory.js#L11) | 11 |
| [`displayName`](../../interface/staff-directory.js#L12) | 12 |
| [`departmentName`](../../interface/staff-directory.js#L13) | 13 |
| [`isAdministrator`](../../interface/staff-directory.js#L14) | 14 |
| [`canReadStaff`](../../interface/staff-directory.js#L15) | 15 |
| [`canEditStaff`](../../interface/staff-directory.js#L16) | 16 |
| [`canReadDepartments`](../../interface/staff-directory.js#L17) | 17 |
| [`canEditDepartments`](../../interface/staff-directory.js#L18) | 18 |
| [`icon`](../../interface/staff-directory.js#L19) | 19 |
| [`button`](../../interface/staff-directory.js#L20) | 20 |
| [`badge`](../../interface/staff-directory.js#L21) | 21 |
| [`header`](../../interface/staff-directory.js#L22) | 22 |
| [`renderStaffDirectory`](../../interface/staff-directory.js#L25) | 25 |
| [`detailRow`](../../interface/staff-directory.js#L31) | 31 |
| [`renderStaffDetails`](../../interface/staff-directory.js#L32) | 32 |
| [`field`](../../interface/staff-directory.js#L36) | 36 |
| [`renderStaffForm`](../../interface/staff-directory.js#L37) | 37 |
| [`cardHeading`](../../interface/staff-directory.js#L45) | 45 |
| [`renderDepartments`](../../interface/staff-directory.js#L70) | 70 |
| [`departmentCard`](../../interface/staff-directory.js#L75) | 75 |
| [`departmentNotice`](../../interface/staff-directory.js#L78) | 78 |
| [`departmentDate`](../../interface/staff-directory.js#L81) | 81 |
| [`departmentTable`](../../interface/staff-directory.js#L85) | 85 |
| [`departmentAssignmentRows`](../../interface/staff-directory.js#L88) | 88 |
| [`renderDepartmentOverview`](../../interface/staff-directory.js#L92) | 92 |
| [`renderDepartmentStaff`](../../interface/staff-directory.js#L103) | 103 |
| [`renderDepartmentEquipment`](../../interface/staff-directory.js#L108) | 108 |
| [`renderDepartmentHistory`](../../interface/staff-directory.js#L117) | 117 |
| [`renderDepartmentDetails`](../../interface/staff-directory.js#L126) | 126 |
| [`selectDepartmentTab`](../../interface/staff-directory.js#L133) | 133 |
| [`loadDepartmentDetails`](../../interface/staff-directory.js#L139) | 139 |
| [`request`](../../interface/staff-directory.js#L165) | 165 |
| [`readAll`](../../interface/staff-directory.js#L176) | 176 |
| [`refresh`](../../interface/staff-directory.js#L186) | 186 |
| [`render`](../../interface/staff-directory.js#L204) | 204 |
| [`enter`](../../interface/staff-directory.js#L226) | 226 |
| [`redraw`](../../interface/staff-directory.js#L234) | 234 |
| [`showStaffConflict`](../../interface/staff-directory.js#L235) | 235 |
| [`refreshStaffRecord`](../../interface/staff-directory.js#L243) | 243 |
| [`saveStaff`](../../interface/staff-directory.js#L259) | 259 |
| [`openDepartmentDialog`](../../interface/staff-directory.js#L278) | 278 |
| [`closeDepartmentDialog`](../../interface/staff-directory.js#L289) | 289 |
| [`saveDepartment`](../../interface/staff-directory.js#L290) | 290 |
| [`configure`](../../interface/staff-directory.js#L297) | 297 |

## interface/equipment.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](../../interface/equipment.js#L5) | 5 |
| [`displayDeviceType`](../../interface/equipment.js#L6) | 6 |
| [`dateLabel`](../../interface/equipment.js#L7) | 7 |
| [`button`](../../interface/equipment.js#L8) | 8 |
| [`canReadAssociations`](../../interface/equipment.js#L9) | 9 |
| [`request`](../../interface/equipment.js#L10) | 10 |
| [`assignmentHistory`](../../interface/equipment.js#L16) | 16 |
| [`assetMovementHistory`](../../interface/equipment.js#L21) | 21 |
| [`staffPlaceholder`](../../interface/equipment.js#L26) | 26 |
| [`loadStaffEquipment`](../../interface/equipment.js#L30) | 30 |
| [`loadDeviceEquipment`](../../interface/equipment.js#L39) | 39 |
| [`loadAssociatedEquipment`](../../interface/equipment.js#L51) | 51 |
| [`openAssociatedEquipment`](../../interface/equipment.js#L67) | 67 |
| [`renderMyEquipment`](../../interface/equipment.js#L75) | 75 |
| [`loadMyEquipment`](../../interface/equipment.js#L78) | 78 |
| [`list`](../../interface/equipment.js#L81) | 81 |
| [`hydrate`](../../interface/equipment.js#L96) | 96 |
| [`showAssignmentDialog`](../../interface/equipment.js#L100) | 100 |
| [`searchRecipients`](../../interface/equipment.js#L111) | 111 |
| [`searchDevices`](../../interface/equipment.js#L120) | 120 |
| [`leaveAssignmentDialog`](../../interface/equipment.js#L128) | 128 |
| [`saveAssignment`](../../interface/equipment.js#L134) | 134 |
| [`caffootEquipment.configure`](../../interface/equipment.js#L188) | 188 |

## interface/stock-intake.js

| Function | Line |
| --- | ---: |
| [`safe`](../../interface/stock-intake.js#L10) | 10 |
| [`displayStockType`](../../interface/stock-intake.js#L12) | 12 |
| [`canRead`](../../interface/stock-intake.js#L13) | 13 |
| [`canEdit`](../../interface/stock-intake.js#L14) | 14 |
| [`stockTodayIso`](../../interface/stock-intake.js#L16) | 16 |
| [`stockLabel`](../../interface/stock-intake.js#L22) | 22 |
| [`stockNotice`](../../interface/stock-intake.js#L23) | 23 |
| [`stockButton`](../../interface/stock-intake.js#L24) | 24 |
| [`stockCard`](../../interface/stock-intake.js#L25) | 25 |
| [`stockField`](../../interface/stock-intake.js#L26) | 26 |
| [`stockSelect`](../../interface/stock-intake.js#L29) | 29 |
| [`stockTable`](../../interface/stock-intake.js#L32) | 32 |
| [`stockMetrics`](../../interface/stock-intake.js#L35) | 35 |
| [`stockSpecText`](../../interface/stock-intake.js#L38) | 38 |
| [`renderStockReceipt`](../../interface/stock-intake.js#L43) | 43 |
| [`renderStockDetails`](../../interface/stock-intake.js#L78) | 78 |
| [`renderStockInventory`](../../interface/stock-intake.js#L101) | 101 |
| [`stockReportNumber`](../../interface/stock-intake.js#L105) | 105 |
| [`stockReportMetric`](../../interface/stock-intake.js#L106) | 106 |
| [`stockReportTable`](../../interface/stock-intake.js#L111) | 111 |
| [`stockReportBar`](../../interface/stock-intake.js#L114) | 114 |
| [`renderStockOverview`](../../interface/stock-intake.js#L118) | 118 |
| [`stockInventoryMatches`](../../interface/stock-intake.js#L152) | 152 |
| [`stockRegisteredMatches`](../../interface/stock-intake.js#L163) | 163 |
| [`renderStockAssignments`](../../interface/stock-intake.js#L173) | 173 |
| [`stockMovementMatches`](../../interface/stock-intake.js#L178) | 178 |
| [`drillStockReport`](../../interface/stock-intake.js#L189) | 189 |
| [`stockDateText`](../../interface/stock-intake.js#L200) | 200 |
| [`stockDate`](../../interface/stock-intake.js#L204) | 204 |
| [`stockRecordedDate`](../../interface/stock-intake.js#L206) | 206 |
| [`stockCheckLabel`](../../interface/stock-intake.js#L213) | 213 |
| [`receiptSupplierCell`](../../interface/stock-intake.js#L214) | 214 |
| [`renderStockHistory`](../../interface/stock-intake.js#L222) | 222 |
| [`clearStock`](../../interface/stock-intake.js#L231) | 231 |
| [`stockRequest`](../../interface/stock-intake.js#L236) | 236 |
| [`refreshStock`](../../interface/stock-intake.js#L245) | 245 |
| [`enterStock`](../../interface/stock-intake.js#L257) | 257 |
| [`renderStock`](../../interface/stock-intake.js#L262) | 262 |
| [`receiptTracking`](../../interface/stock-intake.js#L273) | 273 |
| [`hydrateStock`](../../interface/stock-intake.js#L276) | 276 |
| [`openStockDetails`](../../interface/stock-intake.js#L320) | 320 |
| [`submitStock`](../../interface/stock-intake.js#L328) | 328 |
| [`stockStateLabel`](../../interface/stock-intake.js#L490) | 490 |
| [`stockUnitState`](../../interface/stock-intake.js#L491) | 491 |
| [`stockNote`](../../interface/stock-intake.js#L492) | 492 |
| [`stockWorkflowForm`](../../interface/stock-intake.js#L493) | 493 |
| [`stockIssueReady`](../../interface/stock-intake.js#L501) | 501 |
| [`renderDeviceReissue`](../../interface/stock-intake.js#L502) | 502 |
| [`stockExistingIssueLabel`](../../interface/stock-intake.js#L514) | 514 |
| [`renderStockIssue`](../../interface/stock-intake.js#L521) | 521 |
| [`editStockIssue`](../../interface/stock-intake.js#L535) | 535 |
| [`showStockIssueConfirmation`](../../interface/stock-intake.js#L541) | 541 |
| [`stockReturnSources`](../../interface/stock-intake.js#L563) | 563 |
| [`renderStockReturn`](../../interface/stock-intake.js#L570) | 570 |
| [`renderStockWriteOff`](../../interface/stock-intake.js#L581) | 581 |
| [`stockPreparationRequirement`](../../interface/stock-intake.js#L594) | 594 |
| [`renderStockPreparation`](../../interface/stock-intake.js#L601) | 601 |
| [`renderRegisteredStock`](../../interface/stock-intake.js#L613) | 613 |
| [`renderStockMovements`](../../interface/stock-intake.js#L620) | 620 |
| [`renderStockCorrection`](../../interface/stock-intake.js#L625) | 625 |
| [`renderCorrectionImpact`](../../interface/stock-intake.js#L634) | 634 |
| [`stockReturnCorrectionEntry`](../../interface/stock-intake.js#L639) | 639 |
| [`restoreStockReturn`](../../interface/stock-intake.js#L642) | 642 |
| [`closeStockCorrection`](../../interface/stock-intake.js#L654) | 654 |
| [`leaveStockCorrection`](../../interface/stock-intake.js#L660) | 660 |
| [`proceed`](../../interface/stock-intake.js#L662) | 662 |
| [`openStockCorrection`](../../interface/stock-intake.js#L669) | 669 |
| [`stockCorrectionValues`](../../interface/stock-intake.js#L679) | 679 |
| [`previewStockCorrection`](../../interface/stock-intake.js#L682) | 682 |
| [`scheduleStockCorrection`](../../interface/stock-intake.js#L702) | 702 |
| [`submitStockCorrection`](../../interface/stock-intake.js#L712) | 712 |
| [`stockSelectedReturn`](../../interface/stock-intake.js#L755) | 755 |
| [`stockSelectedWriteOff`](../../interface/stock-intake.js#L756) | 756 |
| [`hydrateStockCirculation`](../../interface/stock-intake.js#L760) | 760 |
| [`loadHandoverRecipients`](../../interface/stock-intake.js#L839) | 839 |
| [`loadStockRecipients`](../../interface/stock-intake.js#L865) | 865 |
| [`submitStockCirculation`](../../interface/stock-intake.js#L876) | 876 |
| [`openStockWorkflow`](../../interface/stock-intake.js#L942) | 942 |
| [`openDirectHandover`](../../interface/stock-intake.js#L949) | 949 |
| [`prepareReceipt`](../../interface/stock-intake.js#L957) | 957 |
| [`hydrateStockPage`](../../interface/stock-intake.js#L964) | 964 |
| [`dismissHandover`](../../interface/stock-intake.js#L992) | 992 |
| [`configureStock`](../../interface/stock-intake.js#L993) | 993 |

## interface/service-desk.js

| Function | Line |
| --- | ---: |
| [`requestServiceDesk`](../../interface/service-desk.js#L18) | 18 |
| [`requestTickets`](../../interface/service-desk.js#L37) | 37 |
| [`ticketNumber`](../../interface/service-desk.js#L41) | 41 |
| [`ticketOptions`](../../interface/service-desk.js#L45) | 45 |
| [`ticketDate`](../../interface/service-desk.js#L52) | 52 |
| [`ticketTag`](../../interface/service-desk.js#L56) | 56 |
| [`renderTicketQueue`](../../interface/service-desk.js#L60) | 60 |
| [`renderEmployeeTicketQueue`](../../interface/service-desk.js#L66) | 66 |
| [`renderTicketRows`](../../interface/service-desk.js#L70) | 70 |
| [`renderSupportWeek`](../../interface/service-desk.js#L85) | 85 |
| [`readSupportWeek`](../../interface/service-desk.js#L100) | 100 |
| [`renderSupportLists`](../../interface/service-desk.js#L116) | 116 |
| [`bindSupportTabs`](../../interface/service-desk.js#L136) | 136 |
| [`selectSupportTab`](../../interface/service-desk.js#L138) | 138 |
| [`hydrateServiceDeskSettings`](../../interface/service-desk.js#L160) | 160 |
| [`showSupportFeedback`](../../interface/service-desk.js#L173) | 173 |
| [`updateSupportHours`](../../interface/service-desk.js#L179) | 179 |
| [`saveSupportSettings`](../../interface/service-desk.js#L185) | 185 |
| [`renderReportActivity`](../../interface/service-desk.js#L296) | 296 |
| [`hydrateTicketReporting`](../../interface/service-desk.js#L315) | 315 |
| [`requestReport`](../../interface/service-desk.js#L327) | 327 |
| [`selectReportPeriod`](../../interface/service-desk.js#L357) | 357 |
| [`hydrateTicketQueue`](../../interface/service-desk.js#L382) | 382 |
| [`refreshQueue`](../../interface/service-desk.js#L394) | 394 |
| [`changeTicketFilters`](../../interface/service-desk.js#L455) | 455 |
| [`resetTicketFilters`](../../interface/service-desk.js#L463) | 463 |
| [`selectEmployeeScope`](../../interface/service-desk.js#L508) | 508 |
| [`renderTicketEquipmentPanel`](../../interface/service-desk.js#L567) | 567 |
| [`hydrateTicketEquipment`](../../interface/service-desk.js#L575) | 575 |
| [`refreshEquipmentTickets`](../../interface/service-desk.js#L582) | 582 |
| [`openTicketWindow`](../../interface/service-desk.js#L611) | 611 |
| [`showTicketError`](../../interface/service-desk.js#L618) | 618 |
| [`ticketDialogActive`](../../interface/service-desk.js#L624) | 624 |
| [`openCreateTicket`](../../interface/service-desk.js#L628) | 628 |
| [`updateTicketSoftware`](../../interface/service-desk.js#L690) | 690 |
| [`openTicketDetails`](../../interface/service-desk.js#L716) | 716 |
| [`refreshTicketDetails`](../../interface/service-desk.js#L724) | 724 |
| [`ticketFact`](../../interface/service-desk.js#L745) | 745 |
| [`renderTicketOverview`](../../interface/service-desk.js#L749) | 749 |
| [`edit`](../../interface/service-desk.js#L750) | 750 |
| [`renderEmployeeTicketOverview`](../../interface/service-desk.js#L768) | 768 |
| [`ticketFileInput`](../../interface/service-desk.js#L792) | 792 |
| [`renderTicketUpdates`](../../interface/service-desk.js#L797) | 797 |
| [`ticketHistoryText`](../../interface/service-desk.js#L843) | 843 |
| [`renderTicketHistory`](../../interface/service-desk.js#L866) | 866 |
| [`ticketActions`](../../interface/service-desk.js#L874) | 874 |
| [`showTicketTab`](../../interface/service-desk.js#L881) | 881 |
| [`ticketActionForm`](../../interface/service-desk.js#L939) | 939 |
| [`ticketSelect`](../../interface/service-desk.js#L946) | 946 |
| [`openTicketAction`](../../interface/service-desk.js#L951) | 951 |
| [`checkAssignment`](../../interface/service-desk.js#L1007) | 1007 |
| [`editTicketClassification`](../../interface/service-desk.js#L1014) | 1014 |
| [`ticketAttachmentPayload`](../../interface/service-desk.js#L1036) | 1036 |
| [`saveTicketForm`](../../interface/service-desk.js#L1056) | 1056 |
| [`closeTicketDialog`](../../interface/service-desk.js#L1165) | 1165 |
| [`configure`](../../interface/service-desk.js#L1177) | 1177 |
| [`canRead`](../../interface/service-desk.js#L1178) | 1178 |
| [`canUseEmployee`](../../interface/service-desk.js#L1179) | 1179 |

## backend/access_point_review.py

| Function | Line |
| --- | ---: |
| [`find_access_point_mount_conflicts`](../../backend/access_point_review.py#L19) | 19 |
| [`apply_access_point_mount_choices`](../../backend/access_point_review.py#L45) | 45 |

## backend/account_email.py

| Function | Line |
| --- | ---: |
| [`queue_email`](../../backend/account_email.py#L33) | 33 |
| [`queue_email.deliver`](../../backend/account_email.py#L38) | 38 |
| [`email_proof_secret`](../../backend/account_email.py#L55) | 55 |
| [`_digest`](../../backend/account_email.py#L92) | 92 |
| [`email_attempts_remaining`](../../backend/account_email.py#L101) | 101 |
| [`issue_email_proof`](../../backend/account_email.py#L110) | 110 |
| [`confirm_email_proof`](../../backend/account_email.py#L141) | 141 |
| [`security_recipients`](../../backend/account_email.py#L200) | 200 |
| [`notify_security_change`](../../backend/account_email.py#L215) | 215 |
| [`role_change_notifications`](../../backend/account_email.py#L241) | 241 |
| [`record_blocked_sign_in`](../../backend/account_email.py#L270) | 270 |

## backend/account_security.py

| Function | Line |
| --- | ---: |
| [`change_own_password`](../../backend/account_security.py#L13) | 13 |
| [`begin_mfa_enrolment`](../../backend/account_security.py#L35) | 35 |
| [`complete_mfa_enrolment`](../../backend/account_security.py#L59) | 59 |
| [`_pending_mandatory_mfa_account`](../../backend/account_security.py#L80) | 80 |
| [`start_required_mfa_enrolment`](../../backend/account_security.py#L93) | 93 |
| [`_record_mfa_change`](../../backend/account_security.py#L112) | 112 |
| [`confirm_required_mfa_enrolment`](../../backend/account_security.py#L128) | 128 |
| [`remove_own_mfa`](../../backend/account_security.py#L144) | 144 |

## backend/accounts.py

| Function | Line |
| --- | ---: |
| [`hash_password`](../../backend/accounts.py#L16) | 16 |
| [`verify_password`](../../backend/accounts.py#L24) | 24 |
| [`bootstrap_first_admin`](../../backend/accounts.py#L43) | 43 |
| [`confirm_admin_mfa`](../../backend/accounts.py#L68) | 68 |

## backend/application_integrity.py

| Function | Line |
| --- | ---: |
| [`validate_detached_application_state`](../../backend/application_integrity.py#L15) | 15 |
| [`validate_live_application_state`](../../backend/application_integrity.py#L118) | 118 |

## backend/assignment_closure.py

| Function | Line |
| --- | ---: |
| [`assignment_schema_objects`](../../backend/assignment_closure.py#L57) | 57 |
| [`expected_assignment_schema`](../../backend/assignment_closure.py#L63) | 63 |
| [`validate_assignment_closure`](../../backend/assignment_closure.py#L84) | 84 |
| [`migrate_assignment_closure`](../../backend/assignment_closure.py#L94) | 94 |

## backend/audit_events.py

| Function | Line |
| --- | ---: |
| [`_safe_audit_value`](../../backend/audit_events.py#L34) | 34 |
| [`safe_device_differences`](../../backend/audit_events.py#L46) | 46 |
| [`safe_inventory_differences`](../../backend/audit_events.py#L75) | 75 |
| [`attribute_event`](../../backend/audit_events.py#L99) | 99 |
| [`record_actor_event`](../../backend/audit_events.py#L114) | 114 |

## backend/authentication.py

| Function | Line |
| --- | ---: |
| [`verify_active_password`](../../backend/authentication.py#L18) | 18 |
| [`authenticate`](../../backend/authentication.py#L32) | 32 |

## backend/collection_saves.py

| Function | Line |
| --- | ---: |
| [`change_inventory_record`](../../backend/collection_saves.py#L20) | 20 |
| [`change_ipam_subnet_and_vlan_records`](../../backend/collection_saves.py#L114) | 114 |
| [`delete_subnet_with_dependencies`](../../backend/collection_saves.py#L258) | 258 |
| [`remove_linked_rack_shelf`](../../backend/collection_saves.py#L381) | 381 |

## backend/deployment_settings.py

| Function | Line |
| --- | ---: |
| [`validate_published_port`](../../backend/deployment_settings.py#L5) | 5 |

## backend/device_addresses.py

| Function | Line |
| --- | ---: |
| [`is_basic_address`](../../backend/device_addresses.py#L6) | 6 |
| [`prepare_device_address`](../../backend/device_addresses.py#L10) | 10 |
| [`basic_address_errors`](../../backend/device_addresses.py#L37) | 37 |

## backend/device_assignments.py

| Function | Line |
| --- | ---: |
| [`require_assignment_access`](../../backend/device_assignments.py#L10) | 10 |
| [`assignment_recipients`](../../backend/device_assignments.py#L15) | 15 |
| [`device_assignment_dependency`](../../backend/device_assignments.py#L32) | 32 |
| [`assignment_device_choices`](../../backend/device_assignments.py#L50) | 50 |
| [`read_assignments`](../../backend/device_assignments.py#L73) | 73 |
| [`assign_devices`](../../backend/device_assignments.py#L154) | 154 |
| [`my_equipment`](../../backend/device_assignments.py#L206) | 206 |

## backend/device_catalogue.py

| Function | Line |
| --- | ---: |
| [`change_device_catalogue`](../../backend/device_catalogue.py#L16) | 16 |

## backend/device_rack_fields.py

| Function | Line |
| --- | ---: |
| [`prepare_device_rack_fields`](../../backend/device_rack_fields.py#L8) | 8 |

## backend/device_saves.py

| Function | Line |
| --- | ---: |
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L38) | 38 |
| [`_validate_device_identity_change`](../../backend/device_saves.py#L57) | 57 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L77) | 77 |
| [`_persist_related_guests`](../../backend/device_saves.py#L123) | 123 |
| [`save_reserved_device`](../../backend/device_saves.py#L136) | 136 |
| [`create_device_in_transaction`](../../backend/device_saves.py#L290) | 290 |
| [`create_device`](../../backend/device_saves.py#L368) | 368 |
| [`delete_reserved_device`](../../backend/device_saves.py#L383) | 383 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](../../backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](../../backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](../../backend/feature_settings.py#L28) | 28 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_subnet_batch_reason`](../../backend/history_permissions.py#L36) | 36 |
| [`visible_change_history`](../../backend/history_permissions.py#L64) | 64 |

## backend/http_security.py

| Function | Line |
| --- | ---: |
| [`session_cookie`](../../backend/http_security.py#L13) | 13 |
| [`clear_session_cookie`](../../backend/http_security.py#L28) | 28 |
| [`read_session_cookie`](../../backend/http_security.py#L41) | 41 |
| [`new_csrf_token`](../../backend/http_security.py#L62) | 62 |
| [`check_csrf`](../../backend/http_security.py#L66) | 66 |
| [`require_same_origin`](../../backend/http_security.py#L77) | 77 |

## backend/import_commit.py

| Function | Line |
| --- | ---: |
| [`prepare_restore_confirmation`](../../backend/import_commit.py#L15) | 15 |
| [`restore_reviewed_export_offline`](../../backend/import_commit.py#L21) | 21 |

## backend/import_diagnostics.py

| Function | Line |
| --- | ---: |
| [`inspect_detached_candidate`](../../backend/import_diagnostics.py#L13) | 13 |

## backend/import_drafts.py

| Function | Line |
| --- | ---: |
| [`ImportDrafts.__init__`](../../backend/import_drafts.py#L17) | 17 |
| [`ImportDrafts._identity`](../../backend/import_drafts.py#L23) | 23 |
| [`ImportDrafts._get`](../../backend/import_drafts.py#L29) | 29 |
| [`ImportDrafts.begin`](../../backend/import_drafts.py#L40) | 40 |
| [`ImportDrafts.choose_access_point_mounts`](../../backend/import_drafts.py#L64) | 64 |
| [`ImportDrafts.confirm`](../../backend/import_drafts.py#L81) | 81 |
| [`ImportDrafts.cancel`](../../backend/import_drafts.py#L110) | 110 |
| [`ImportDrafts.cancel_authenticated`](../../backend/import_drafts.py#L115) | 115 |

## backend/import_review.py

| Function | Line |
| --- | ---: |
| [`prepare_detached_import_review`](../../backend/import_review.py#L17) | 17 |
| [`inspect_published_export_mounting`](../../backend/import_review.py#L47) | 47 |
| [`prepare_published_export_review`](../../backend/import_review.py#L57) | 57 |
| [`confirm_detached_import_review`](../../backend/import_review.py#L81) | 81 |

## backend/import_service.py

| Function | Line |
| --- | ---: |
| [`replace_from_published_export`](../../backend/import_service.py#L12) | 12 |
| [`replace_from_published_export.require_current_permission`](../../backend/import_service.py#L36) | 36 |
| [`preview_published_export`](../../backend/import_service.py#L47) | 47 |

## backend/inventory.py

| Function | Line |
| --- | ---: |
| [`_json`](../../backend/inventory.py#L32) | 32 |
| [`_check_keys`](../../backend/inventory.py#L36) | 36 |
| [`_unique_object`](../../backend/inventory.py#L47) | 47 |
| [`_reject_nonfinite`](../../backend/inventory.py#L56) | 56 |
| [`validate_published_structure`](../../backend/inventory.py#L60) | 60 |
| [`inspect_export`](../../backend/inventory.py#L84) | 84 |
| [`inspect_device_mounts`](../../backend/inventory.py#L135) | 135 |
| [`inspect_import_relationships`](../../backend/inventory.py#L149) | 149 |
| [`preview_inventory_counts`](../../backend/inventory.py#L193) | 193 |
| [`preview_inventory_counts.counts`](../../backend/inventory.py#L199) | 199 |
| [`retain_ticket_devices`](../../backend/inventory.py#L215) | 215 |
| [`_write_detached`](../../backend/inventory.py#L238) | 238 |
| [`stage_inventory`](../../backend/inventory.py#L301) | 301 |
| [`reconstruct_inventory`](../../backend/inventory.py#L317) | 317 |

## backend/inventory_projection.py

| Function | Line |
| --- | ---: |
| [`project_inventory_response`](../../backend/inventory_projection.py#L10) | 10 |
| [`count_basic_ips_outside_subnets`](../../backend/inventory_projection.py#L47) | 47 |

## backend/ipam_linking.py

| Function | Line |
| --- | ---: |
| [`unique_link_fields`](../../backend/ipam_linking.py#L16) | 16 |
| [`link_device_to_ipam`](../../backend/ipam_linking.py#L26) | 26 |

## backend/ipam_reconciliation.py

| Function | Line |
| --- | ---: |
| [`reconcile_published_ipam`](../../backend/ipam_reconciliation.py#L9) | 9 |

## backend/ipam_repair.py

| Function | Line |
| --- | ---: |
| [`plan_ipam_repairs`](../../backend/ipam_repair.py#L15) | 15 |
| [`apply_ipam_repairs`](../../backend/ipam_repair.py#L46) | 46 |

## backend/ipam_saves.py

| Function | Line |
| --- | ---: |
| [`change_independent_allocation`](../../backend/ipam_saves.py#L11) | 11 |
| [`change_bulk_allocations`](../../backend/ipam_saves.py#L68) | 68 |

## backend/ipam_validation.py

| Function | Line |
| --- | ---: |
| [`_ip_number`](../../backend/ipam_validation.py#L10) | 10 |
| [`ip_belongs_to_subnet`](../../backend/ipam_validation.py#L24) | 24 |
| [`inspect_ipam_integrity`](../../backend/ipam_validation.py#L41) | 41 |

## backend/legacy_mounting.py

| Function | Line |
| --- | ---: |
| [`plan_legacy_computer_mounting_corrections`](../../backend/legacy_mounting.py#L12) | 12 |

## backend/login_throttle.py

| Function | Line |
| --- | ---: |
| [`LoginThrottle.__init__`](../../backend/login_throttle.py#L15) | 15 |
| [`LoginThrottle._prune`](../../backend/login_throttle.py#L19) | 19 |
| [`LoginThrottle.allowed`](../../backend/login_throttle.py#L28) | 28 |
| [`LoginThrottle.failed`](../../backend/login_throttle.py#L36) | 36 |
| [`LoginThrottle.succeeded`](../../backend/login_throttle.py#L47) | 47 |
| [`LoginThrottle._key`](../../backend/login_throttle.py#L53) | 53 |

## backend/mfa.py

| Function | Line |
| --- | ---: |
| [`new_secret`](../../backend/mfa.py#L18) | 18 |
| [`_secret_bytes`](../../backend/mfa.py#L23) | 23 |
| [`provisioning_uri`](../../backend/mfa.py#L36) | 36 |
| [`code_at`](../../backend/mfa.py#L50) | 50 |
| [`verify_code`](../../backend/mfa.py#L63) | 63 |

## backend/normalisation.py

| Function | Line |
| --- | ---: |
| [`_unique`](../../backend/normalisation.py#L14) | 14 |
| [`normalise_published_fields`](../../backend/normalisation.py#L22) | 22 |

## backend/normalisation_addresses.py

| Function | Line |
| --- | ---: |
| [`validate_normalisation_addresses`](../../backend/normalisation_addresses.py#L9) | 9 |

## backend/normalisation_pipeline.py

| Function | Line |
| --- | ---: |
| [`_valid_supported_cidr`](../../backend/normalisation_pipeline.py#L36) | 36 |
| [`validate_normalisation_subnets`](../../backend/normalisation_pipeline.py#L50) | 50 |
| [`normalise_detached_v133_state`](../../backend/normalisation_pipeline.py#L77) | 77 |

## backend/normalisation_validation.py

| Function | Line |
| --- | ---: |
| [`_number`](../../backend/normalisation_validation.py#L12) | 12 |
| [`_integer`](../../backend/normalisation_validation.py#L23) | 23 |
| [`_valid_ipv4`](../../backend/normalisation_validation.py#L27) | 27 |
| [`validate_normalisation_vlans`](../../backend/normalisation_validation.py#L37) | 37 |
| [`validate_normalisation_devices`](../../backend/normalisation_validation.py#L59) | 59 |

## backend/permissions.py

| Function | Line |
| --- | ---: |
| [`_admin`](../../backend/permissions.py#L12) | 12 |
| [`_target`](../../backend/permissions.py#L21) | 21 |
| [`create_user`](../../backend/permissions.py#L30) | 30 |
| [`create_user_in_transaction`](../../backend/permissions.py#L46) | 46 |
| [`set_permission`](../../backend/permissions.py#L77) | 77 |
| [`can_access`](../../backend/permissions.py#L88) | 88 |
| [`feature_enabled`](../../backend/permissions.py#L93) | 93 |
| [`set_account_active`](../../backend/permissions.py#L107) | 107 |
| [`delete_user`](../../backend/permissions.py#L146) | 146 |
| [`set_administrator`](../../backend/permissions.py#L174) | 174 |
| [`can_replace_inventory`](../../backend/permissions.py#L215) | 215 |

## backend/profiles.py

| Function | Line |
| --- | ---: |
| [`_authorise`](../../backend/profiles.py#L16) | 16 |
| [`read_profile`](../../backend/profiles.py#L35) | 35 |
| [`validate_profile_details`](../../backend/profiles.py#L51) | 51 |
| [`save_profile`](../../backend/profiles.py#L66) | 66 |
| [`_check_dimensions`](../../backend/profiles.py#L112) | 112 |
| [`_jpeg_dimensions`](../../backend/profiles.py#L116) | 116 |
| [`_image_dimensions`](../../backend/profiles.py#L148) | 148 |
| [`save_profile_photo`](../../backend/profiles.py#L176) | 176 |
| [`read_profile_photo`](../../backend/profiles.py#L204) | 204 |
| [`remove_profile_photo`](../../backend/profiles.py#L213) | 213 |

## backend/rack_validation.py

| Function | Line |
| --- | ---: |
| [`_number`](../../backend/rack_validation.py#L17) | 17 |
| [`_integer`](../../backend/rack_validation.py#L35) | 35 |
| [`_label`](../../backend/rack_validation.py#L40) | 40 |
| [`find_rack_import_conflicts`](../../backend/rack_validation.py#L44) | 44 |
| [`find_rack_import_conflicts.place`](../../backend/rack_validation.py#L51) | 51 |

## backend/recover_admin.py

| Function | Line |
| --- | ---: |
| [`recover_sole_administrator`](../../backend/recover_admin.py#L17) | 17 |
| [`main`](../../backend/recover_admin.py#L46) | 46 |

## backend/request_auth.py

| Function | Line |
| --- | ---: |
| [`login`](../../backend/request_auth.py#L19) | 19 |
| [`csrf_for_session`](../../backend/request_auth.py#L36) | 36 |
| [`authenticated_account`](../../backend/request_auth.py#L51) | 51 |
| [`authorised_mutation`](../../backend/request_auth.py#L58) | 58 |
| [`logout`](../../backend/request_auth.py#L69) | 69 |
| [`authorised_inventory_import`](../../backend/request_auth.py#L81) | 81 |

## backend/reset_inventory.py

| Function | Line |
| --- | ---: |
| [`_restore_operational_defaults`](../../backend/reset_inventory.py#L38) | 38 |
| [`_clear_operational_records`](../../backend/reset_inventory.py#L54) | 54 |
| [`reset_inventory`](../../backend/reset_inventory.py#L93) | 93 |

## backend/role_policy.py

| Function | Line |
| --- | ---: |
| [`AccountRolePolicy.allows`](../../backend/role_policy.py#L21) | 21 |
| [`evaluate_role_policy`](../../backend/role_policy.py#L33) | 33 |
| [`assign_staff_member`](../../backend/role_policy.py#L75) | 75 |

## backend/roles.py

| Function | Line |
| --- | ---: |
| [`_json`](../../backend/roles.py#L23) | 23 |
| [`_validate_action`](../../backend/roles.py#L27) | 27 |
| [`_require_actor`](../../backend/roles.py#L67) | 67 |
| [`role_catalogue`](../../backend/roles.py#L73) | 73 |
| [`account_access_details`](../../backend/roles.py#L84) | 84 |
| [`_action_targets`](../../backend/roles.py#L115) | 115 |
| [`_apply_values`](../../backend/roles.py#L137) | 137 |
| [`_security_snapshot`](../../backend/roles.py#L169) | 169 |
| [`_preview_impact`](../../backend/roles.py#L200) | 200 |
| [`_confirmation_signature`](../../backend/roles.py#L238) | 238 |
| [`_issue_preview`](../../backend/roles.py#L245) | 245 |
| [`preview_role_change`](../../backend/roles.py#L253) | 253 |
| [`confirm_role_change`](../../backend/roles.py#L265) | 265 |
| [`_audit_role_value`](../../backend/roles.py#L317) | 317 |

## backend/schema.py

| Function | Line |
| --- | ---: |
| [`initialise_database`](../../backend/schema.py#L70) | 70 |
| [`migrate_staff_directory`](../../backend/schema.py#L287) | 287 |
| [`migrate_role_permissions`](../../backend/schema.py#L352) | 352 |
| [`verify_role_migration`](../../backend/schema.py#L437) | 437 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L463) | 463 |
| [`migrate_it_staff_stock_default`](../../backend/schema.py#L557) | 557 |
| [`migrate_device_assignments`](../../backend/schema.py#L585) | 585 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L119) | 119 |
| [`connect`](../../backend/server.py#L137) | 137 |
| [`initialise_database`](../../backend/server.py#L145) | 145 |
| [`Handler.end_headers`](../../backend/server.py#L151) | 151 |
| [`Handler.do_GET`](../../backend/server.py#L158) | 158 |
| [`Handler.do_POST`](../../backend/server.py#L545) | 545 |
| [`Handler.handle_supplier_request`](../../backend/server.py#L735) | 735 |
| [`Handler.handle_stock_request`](../../backend/server.py#L816) | 816 |
| [`Handler.handle_service_desk_request`](../../backend/server.py#L905) | 905 |
| [`Handler.handle_equipment_request`](../../backend/server.py#L1056) | 1056 |
| [`Handler.handle_directory_request`](../../backend/server.py#L1137) | 1137 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L1214) | 1214 |
| [`Handler.handle_role_change`](../../backend/server.py#L1263) | 1263 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L1305) | 1305 |
| [`Handler.handle_account_email`](../../backend/server.py#L1706) | 1706 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1786) | 1786 |
| [`Handler.handle_import`](../../backend/server.py#L1817) | 1817 |
| [`Handler.respond`](../../backend/server.py#L1893) | 1893 |
| [`main`](../../backend/server.py#L1906) | 1906 |

## backend/sessions.py

| Function | Line |
| --- | ---: |
| [`_digest`](../../backend/sessions.py#L16) | 16 |
| [`login_session`](../../backend/sessions.py#L26) | 26 |
| [`session_account`](../../backend/sessions.py#L55) | 55 |
| [`logout_session`](../../backend/sessions.py#L75) | 75 |
| [`revoke_account_sessions`](../../backend/sessions.py#L84) | 84 |

## backend/settings_saves.py

| Function | Line |
| --- | ---: |
| [`save_inventory_setting`](../../backend/settings_saves.py#L12) | 12 |

## backend/shelf_associations.py

| Function | Line |
| --- | ---: |
| [`validate_device_shelf_association`](../../backend/shelf_associations.py#L8) | 8 |

## backend/smtp_settings.py

| Function | Line |
| --- | ---: |
| [`config_path`](../../backend/smtp_settings.py#L39) | 39 |
| [`_read_private`](../../backend/smtp_settings.py#L43) | 43 |
| [`public_settings`](../../backend/smtp_settings.py#L60) | 60 |
| [`_check_text`](../../backend/smtp_settings.py#L71) | 71 |
| [`_validate_address`](../../backend/smtp_settings.py#L81) | 81 |
| [`_validate_host`](../../backend/smtp_settings.py#L88) | 88 |
| [`_validate`](../../backend/smtp_settings.py#L103) | 103 |
| [`save_settings`](../../backend/smtp_settings.py#L147) | 147 |
| [`_rate_limit_test`](../../backend/smtp_settings.py#L174) | 174 |
| [`send_test_email`](../../backend/smtp_settings.py#L183) | 183 |
| [`send_account_email`](../../backend/smtp_settings.py#L214) | 214 |

## backend/staff_directory.py

| Function | Line |
| --- | ---: |
| [`_staff_revision`](../../backend/staff_directory.py#L21) | 21 |
| [`unique_directory_fields`](../../backend/staff_directory.py#L37) | 37 |
| [`require_directory_access`](../../backend/staff_directory.py#L47) | 47 |
| [`_text`](../../backend/staff_directory.py#L53) | 53 |
| [`_staff_record`](../../backend/staff_directory.py#L60) | 60 |
| [`_department_record`](../../backend/staff_directory.py#L67) | 67 |
| [`read_staff_member`](../../backend/staff_directory.py#L74) | 74 |
| [`department_has_associations`](../../backend/staff_directory.py#L86) | 86 |
| [`read_department`](../../backend/staff_directory.py#L105) | 105 |
| [`list_directory`](../../backend/staff_directory.py#L112) | 112 |
| [`list_staff_department_choices`](../../backend/staff_directory.py#L126) | 126 |
| [`_validate_staff`](../../backend/staff_directory.py#L139) | 139 |
| [`_create_login`](../../backend/staff_directory.py#L164) | 164 |
| [`save_staff_member`](../../backend/staff_directory.py#L179) | 179 |
| [`save_department`](../../backend/staff_directory.py#L225) | 225 |

## backend/staff_identity.py

| Function | Line |
| --- | ---: |
| [`link_account_staff`](../../backend/staff_identity.py#L4) | 4 |

## backend/stock_circulation.py

| Function | Line |
| --- | ---: |
| [`stock_event_date`](../../backend/stock_circulation.py#L13) | 13 |
| [`stock_recipients`](../../backend/stock_circulation.py#L25) | 25 |
| [`stock_recipient`](../../backend/stock_circulation.py#L36) | 36 |
| [`stock_movement_snapshot`](../../backend/stock_circulation.py#L50) | 50 |
| [`publish_stock_movement`](../../backend/stock_circulation.py#L57) | 57 |
| [`stock_issue_records`](../../backend/stock_circulation.py#L87) | 87 |
| [`read_stock_issues`](../../backend/stock_circulation.py#L113) | 113 |
| [`issue_stock`](../../backend/stock_circulation.py#L138) | 138 |
| [`issue_stock_in_transaction`](../../backend/stock_circulation.py#L150) | 150 |
| [`stock_unit_states`](../../backend/stock_circulation.py#L196) | 196 |
| [`registered_stock_devices`](../../backend/stock_circulation.py#L207) | 207 |
| [`legacy_device_issue`](../../backend/stock_circulation.py#L224) | 224 |
| [`preparation_requirements`](../../backend/stock_circulation.py#L242) | 242 |
| [`preparation_checks`](../../backend/stock_circulation.py#L259) | 259 |
| [`require_stock_device_edit`](../../backend/stock_circulation.py#L267) | 267 |
| [`return_stock`](../../backend/stock_circulation.py#L276) | 276 |
| [`prepare_stock`](../../backend/stock_circulation.py#L405) | 405 |
| [`stock_state_balance`](../../backend/stock_circulation.py#L467) | 467 |
| [`canonical_device_choice`](../../backend/stock_circulation.py#L475) | 475 |
| [`write_off_stock`](../../backend/stock_circulation.py#L495) | 495 |
| [`stock_movement_history`](../../backend/stock_circulation.py#L611) | 611 |

## backend/stock_intake.py

| Function | Line |
| --- | ---: |
| [`stock_json`](../../backend/stock_intake.py#L20) | 20 |
| [`stock_access`](../../backend/stock_intake.py#L25) | 25 |
| [`stock_text`](../../backend/stock_intake.py#L31) | 31 |
| [`stock_quantity`](../../backend/stock_intake.py#L44) | 44 |
| [`stock_checks`](../../backend/stock_intake.py#L50) | 50 |
| [`stock_specifications`](../../backend/stock_intake.py#L57) | 57 |
| [`stock_configuration`](../../backend/stock_intake.py#L81) | 81 |
| [`stock_digest`](../../backend/stock_intake.py#L86) | 86 |
| [`stock_item`](../../backend/stock_intake.py#L90) | 90 |
| [`stock_history`](../../backend/stock_intake.py#L150) | 150 |
| [`read_stock`](../../backend/stock_intake.py#L185) | 185 |
| [`project_stock_details`](../../backend/stock_intake.py#L199) | 199 |
| [`stock_operation`](../../backend/stock_intake.py#L214) | 214 |
| [`stock_replay`](../../backend/stock_intake.py#L223) | 223 |
| [`append_stock_fact`](../../backend/stock_intake.py#L241) | 241 |
| [`stock_write_access`](../../backend/stock_intake.py#L267) | 267 |
| [`receive_stock`](../../backend/stock_intake.py#L273) | 273 |
| [`update_stock_readiness`](../../backend/stock_intake.py#L370) | 370 |

## backend/stock_reporting.py

| Function | Line |
| --- | ---: |
| [`stock_report_counts`](../../backend/stock_reporting.py#L12) | 12 |
| [`read_stock_report`](../../backend/stock_reporting.py#L20) | 20 |
| [`read_stock_report.add_counts`](../../backend/stock_reporting.py#L36) | 36 |

## backend/stock_schema.py

| Function | Line |
| --- | ---: |
| [`stock_schema_statements`](../../backend/stock_schema.py#L490) | 490 |
| [`normalise_schema_statement`](../../backend/stock_schema.py#L502) | 502 |
| [`validate_feature_table`](../../backend/stock_schema.py#L516) | 516 |
| [`validate_it_asset_stock`](../../backend/stock_schema.py#L564) | 564 |
| [`migrate_it_asset_stock`](../../backend/stock_schema.py#L594) | 594 |

## backend/subnet_validation.py

| Function | Line |
| --- | ---: |
| [`parse_hierarchy_cidr`](../../backend/subnet_validation.py#L9) | 9 |
| [`validate_subnet_hierarchy`](../../backend/subnet_validation.py#L36) | 36 |
| [`validate_subnet_hierarchy.ancestor`](../../backend/subnet_validation.py#L109) | 109 |
| [`validate_subnet_hierarchy.independent_network_inside_block`](../../backend/subnet_validation.py#L119) | 119 |
| [`_js_number`](../../backend/subnet_validation.py#L145) | 145 |
| [`_js_string`](../../backend/subnet_validation.py#L164) | 164 |
| [`_ip_number`](../../backend/subnet_validation.py#L174) | 174 |
| [`validate_subnet_types`](../../backend/subnet_validation.py#L189) | 189 |
| [`validate_subnet_mutation`](../../backend/subnet_validation.py#L235) | 235 |

## backend/tls.py

| Function | Line |
| --- | ---: |
| [`subject_alternative_names`](../../backend/tls.py#L12) | 12 |
| [`ensure_certificate`](../../backend/tls.py#L33) | 33 |

## scripts/build_private_acceptance.py

| Function | Line |
| --- | ---: |
| [`build_private_acceptance`](../../scripts/build_private_acceptance.py#L12) | 12 |
| [`build_private_acceptance.git`](../../scripts/build_private_acceptance.py#L13) | 13 |

## backend/device_stock.py

| Function | Line |
| --- | ---: |
| [`require_device_stock_access`](../../backend/device_stock.py#L16) | 16 |
| [`registration_source_ready`](../../backend/device_stock.py#L24) | 24 |
| [`device_stock_sources`](../../backend/device_stock.py#L29) | 29 |
| [`validate_registration_identity`](../../backend/device_stock.py#L48) | 48 |
| [`register_stock_device`](../../backend/device_stock.py#L66) | 66 |
| [`device_ready_for_reissue`](../../backend/device_stock.py#L106) | 106 |
| [`reissue_device_choices`](../../backend/device_stock.py#L116) | 116 |
| [`reissue_stock_device`](../../backend/device_stock.py#L124) | 124 |

## backend/device_storage.py

| Function | Line |
| --- | ---: |
| [`storage_text`](../../backend/device_storage.py#L5) | 5 |
| [`storage_number`](../../backend/device_storage.py#L10) | 10 |
| [`validate_device_storage`](../../backend/device_storage.py#L22) | 22 |

## backend/equipment_associations.py

| Function | Line |
| --- | ---: |
| [`equipment_association_schema`](../../backend/equipment_associations.py#L59) | 59 |
| [`validate_equipment_associations`](../../backend/equipment_associations.py#L66) | 66 |
| [`migrate_equipment_associations`](../../backend/equipment_associations.py#L78) | 78 |
| [`read_equipment_associations`](../../backend/equipment_associations.py#L89) | 89 |
| [`add_associated_equipment`](../../backend/equipment_associations.py#L130) | 130 |
| [`has_outstanding_associated_equipment`](../../backend/equipment_associations.py#L208) | 208 |

## backend/handover_schema.py

| Function | Line |
| --- | ---: |
| [`handover_assignment_statements`](../../backend/handover_schema.py#L119) | 119 |
| [`handover_stock_guard`](../../backend/handover_schema.py#L130) | 130 |
| [`handover_schema_objects`](../../backend/handover_schema.py#L142) | 142 |
| [`validate_device_handovers`](../../backend/handover_schema.py#L147) | 147 |
| [`migrate_device_handovers`](../../backend/handover_schema.py#L160) | 160 |

## backend/device_handovers.py

| Function | Line |
| --- | ---: |
| [`require_handover_access`](../../backend/device_handovers.py#L14) | 14 |
| [`device_handover_source`](../../backend/device_handovers.py#L27) | 27 |
| [`device_handover_context`](../../backend/device_handovers.py#L52) | 52 |
| [`reassign_device`](../../backend/device_handovers.py#L61) | 61 |

## backend/stock_corrections.py

| Function | Line |
| --- | ---: |
| [`correction_source`](../../backend/stock_corrections.py#L12) | 12 |
| [`correction_version`](../../backend/stock_corrections.py#L41) | 41 |
| [`replay_corrected_stock`](../../backend/stock_corrections.py#L51) | 51 |
| [`stock_correction_context`](../../backend/stock_corrections.py#L108) | 108 |
| [`validate_stock_correction`](../../backend/stock_corrections.py#L130) | 130 |
| [`preview_stock_correction`](../../backend/stock_corrections.py#L153) | 153 |
| [`save_stock_correction`](../../backend/stock_corrections.py#L166) | 166 |

## backend/supplier_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_suppliers`](../../backend/supplier_schema.py#L93) | 93 |

## backend/supplier_issue_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_supplier_issues`](../../backend/supplier_issue_schema.py#L80) | 80 |

## backend/suppliers.py

| Function | Line |
| --- | ---: |
| [`supplier_access`](../../backend/suppliers.py#L14) | 14 |
| [`fields`](../../backend/suppliers.py#L19) | 19 |
| [`cleaned`](../../backend/suppliers.py#L25) | 25 |
| [`web_address`](../../backend/suppliers.py#L38) | 38 |
| [`identities`](../../backend/suppliers.py#L54) | 54 |
| [`text_list`](../../backend/suppliers.py#L62) | 62 |
| [`contact_values`](../../backend/suppliers.py#L68) | 68 |
| [`address`](../../backend/suppliers.py#L93) | 93 |
| [`directory_categories`](../../backend/suppliers.py#L101) | 101 |
| [`read_directory`](../../backend/suppliers.py#L109) | 109 |
| [`get_supplier`](../../backend/suppliers.py#L133) | 133 |
| [`supply_sections`](../../backend/suppliers.py#L144) | 144 |
| [`supplier_delete_reason`](../../backend/suppliers.py#L150) | 150 |
| [`contact_delete_reason`](../../backend/suppliers.py#L160) | 160 |
| [`location_delete_reason`](../../backend/suppliers.py#L168) | 168 |
| [`read_supplier`](../../backend/suppliers.py#L176) | 176 |
| [`log_change`](../../backend/suppliers.py#L222) | 222 |
| [`child_record`](../../backend/suppliers.py#L230) | 230 |
| [`confirmed`](../../backend/suppliers.py#L241) | 241 |
| [`require_revision`](../../backend/suppliers.py#L246) | 246 |
| [`save_categories`](../../backend/suppliers.py#L251) | 251 |
| [`save_company`](../../backend/suppliers.py#L269) | 269 |
| [`save_category`](../../backend/suppliers.py#L310) | 310 |
| [`set_archived`](../../backend/suppliers.py#L346) | 346 |
| [`save_location`](../../backend/suppliers.py#L355) | 355 |
| [`save_contact`](../../backend/suppliers.py#L372) | 372 |
| [`save_note`](../../backend/suppliers.py#L405) | 405 |
| [`log_note`](../../backend/suppliers.py#L430) | 430 |
| [`change_company_status`](../../backend/suppliers.py#L436) | 436 |
| [`change_child`](../../backend/suppliers.py#L474) | 474 |
| [`read_issue_rows`](../../backend/suppliers.py#L514) | 514 |
| [`read_issues`](../../backend/suppliers.py#L541) | 541 |
| [`read_purchasing_dashboard`](../../backend/suppliers.py#L545) | 545 |
| [`read_issue`](../../backend/suppliers.py#L554) | 554 |
| [`issue_snapshot`](../../backend/suppliers.py#L586) | 586 |
| [`save_issue`](../../backend/suppliers.py#L594) | 594 |
| [`write_issue_update`](../../backend/suppliers.py#L646) | 646 |
| [`correct_issue_update`](../../backend/suppliers.py#L669) | 669 |
| [`save_supplier_operation`](../../backend/suppliers.py#L694) | 694 |
| [`read_supply_impact`](../../backend/suppliers.py#L740) | 740 |

## interface/suppliers.js

| Function | Line |
| --- | ---: |
| [`supplierTabs`](../../interface/suppliers.js#L13) | 13 |
| [`safe`](../../interface/suppliers.js#L18) | 18 |
| [`icon`](../../interface/suppliers.js#L19) | 19 |
| [`displayEquipmentType`](../../interface/suppliers.js#L20) | 20 |
| [`editable`](../../interface/suppliers.js#L21) | 21 |
| [`list`](../../interface/suppliers.js#L22) | 22 |
| [`locationAddress`](../../interface/suppliers.js#L23) | 23 |
| [`labelStatus`](../../interface/suppliers.js#L24) | 24 |
| [`badge`](../../interface/suppliers.js#L25) | 25 |
| [`findContact`](../../interface/suppliers.js#L26) | 26 |
| [`findLocation`](../../interface/suppliers.js#L27) | 27 |
| [`findNote`](../../interface/suppliers.js#L28) | 28 |
| [`options`](../../interface/suppliers.js#L29) | 29 |
| [`button`](../../interface/suppliers.js#L32) | 32 |
| [`nameButton`](../../interface/suppliers.js#L35) | 35 |
| [`header`](../../interface/suppliers.js#L38) | 38 |
| [`sectionHeading`](../../interface/suppliers.js#L45) | 45 |
| [`table`](../../interface/suppliers.js#L48) | 48 |
| [`emptyRow`](../../interface/suppliers.js#L53) | 53 |
| [`field`](../../interface/suppliers.js#L56) | 56 |
| [`select`](../../interface/suppliers.js#L62) | 62 |
| [`toolSearch`](../../interface/suppliers.js#L66) | 66 |
| [`card`](../../interface/suppliers.js#L72) | 72 |
| [`info`](../../interface/suppliers.js#L75) | 75 |
| [`webLink`](../../interface/suppliers.js#L78) | 78 |
| [`categoryTags`](../../interface/suppliers.js#L86) | 86 |
| [`directoryResults`](../../interface/suppliers.js#L90) | 90 |
| [`renderDirectory`](../../interface/suppliers.js#L100) | 100 |
| [`contactScope`](../../interface/suppliers.js#L114) | 114 |
| [`lifecycleActions`](../../interface/suppliers.js#L120) | 120 |
| [`lifecycleButtons`](../../interface/suppliers.js#L134) | 134 |
| [`renderOverview`](../../interface/suppliers.js#L138) | 138 |
| [`renderLocations`](../../interface/suppliers.js#L157) | 157 |
| [`contactRows`](../../interface/suppliers.js#L175) | 175 |
| [`renderContacts`](../../interface/suppliers.js#L184) | 184 |
| [`formatDate`](../../interface/suppliers.js#L194) | 194 |
| [`time`](../../interface/suppliers.js#L197) | 197 |
| [`noteCards`](../../interface/suppliers.js#L198) | 198 |
| [`renderNotes`](../../interface/suppliers.js#L209) | 209 |
| [`issueCategoryName`](../../interface/suppliers.js#L215) | 215 |
| [`issueCategoryLabel`](../../interface/suppliers.js#L218) | 218 |
| [`issueStatusBadge`](../../interface/suppliers.js#L222) | 222 |
| [`issueButton`](../../interface/suppliers.js#L225) | 225 |
| [`issueRows`](../../interface/suppliers.js#L229) | 229 |
| [`issuesList`](../../interface/suppliers.js#L237) | 237 |
| [`renderNotesIssues`](../../interface/suppliers.js#L244) | 244 |
| [`renderAllIssues`](../../interface/suppliers.js#L253) | 253 |
| [`dashboardIcon`](../../interface/suppliers.js#L258) | 258 |
| [`dashboardMetric`](../../interface/suppliers.js#L261) | 261 |
| [`dashboardCard`](../../interface/suppliers.js#L265) | 265 |
| [`renderPurchasing`](../../interface/suppliers.js#L269) | 269 |
| [`recentCell`](../../interface/suppliers.js#L276) | 276 |
| [`equipmentRows`](../../interface/suppliers.js#L302) | 302 |
| [`renderEquipment`](../../interface/suppliers.js#L313) | 313 |
| [`renderDetails`](../../interface/suppliers.js#L325) | 325 |
| [`render`](../../interface/suppliers.js#L339) | 339 |
| [`request`](../../interface/suppliers.js#L350) | 350 |
| [`readRoute`](../../interface/suppliers.js#L359) | 359 |
| [`writeRoute`](../../interface/suppliers.js#L365) | 365 |
| [`show`](../../interface/suppliers.js#L370) | 370 |
| [`mountEquipmentChooser`](../../interface/suppliers.js#L419) | 419 |
| [`value`](../../interface/suppliers.js#L445) | 445 |
| [`describe`](../../interface/suppliers.js#L446) | 446 |
| [`close`](../../interface/suppliers.js#L450) | 450 |
| [`choose`](../../interface/suppliers.js#L457) | 457 |
| [`show`](../../interface/suppliers.js#L464) | 464 |
| [`loadChoices`](../../interface/suppliers.js#L482) | 482 |
| [`openEquipmentAssignment`](../../interface/suppliers.js#L545) | 545 |
| [`dialog`](../../interface/suppliers.js#L577) | 577 |
| [`lines`](../../interface/suppliers.js#L593) | 593 |
| [`valueOf`](../../interface/suppliers.js#L594) | 594 |
| [`selectedIds`](../../interface/suppliers.js#L595) | 595 |
| [`addressFields`](../../interface/suppliers.js#L596) | 596 |
| [`readAddress`](../../interface/suppliers.js#L602) | 602 |
| [`checkList`](../../interface/suppliers.js#L605) | 605 |
| [`formSection`](../../interface/suppliers.js#L610) | 610 |
| [`contactEntry`](../../interface/suppliers.js#L614) | 614 |
| [`supplierForm`](../../interface/suppliers.js#L624) | 624 |
| [`locationForm`](../../interface/suppliers.js#L657) | 657 |
| [`contactForm`](../../interface/suppliers.js#L669) | 669 |
| [`contactDetails`](../../interface/suppliers.js#L701) | 701 |
| [`noteForm`](../../interface/suppliers.js#L718) | 718 |
| [`issueCategoryOptions`](../../interface/suppliers.js#L728) | 728 |
| [`issueUpdates`](../../interface/suppliers.js#L732) | 732 |
| [`issueDialog`](../../interface/suppliers.js#L740) | 740 |
| [`openIssue`](../../interface/suppliers.js#L787) | 787 |
| [`refreshAfterIssueSave`](../../interface/suppliers.js#L796) | 796 |
| [`correctIssueUpdate`](../../interface/suppliers.js#L800) | 800 |
| [`backToIssue`](../../interface/suppliers.js#L806) | 806 |
| [`addInlineIssueCategory`](../../interface/suppliers.js#L818) | 818 |
| [`toggleInlineCategory`](../../interface/suppliers.js#L840) | 840 |
| [`applyIssueCategories`](../../interface/suppliers.js#L847) | 847 |
| [`categoriesDialog`](../../interface/suppliers.js#L854) | 854 |
| [`categoryForm`](../../interface/suppliers.js#L866) | 866 |
| [`command`](../../interface/suppliers.js#L875) | 875 |
| [`updateSupplier`](../../interface/suppliers.js#L884) | 884 |
| [`updateCategories`](../../interface/suppliers.js#L895) | 895 |
| [`statusConfirmation`](../../interface/suppliers.js#L906) | 906 |
| [`supplyConfirmation`](../../interface/suppliers.js#L936) | 936 |
| [`refreshRows`](../../interface/suppliers.js#L952) | 952 |
| [`caffootSuppliers.configure`](../../interface/suppliers.js#L1119) | 1119 |
| [`caffootSuppliers.enter`](../../interface/suppliers.js#L1122) | 1122 |
| [`caffootSuppliers.leave`](../../interface/suppliers.js#L1126) | 1126 |
| [`caffootSuppliers.closed`](../../interface/suppliers.js#L1133) | 1133 |

## backend/equipment_supplier_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_equipment_suppliers`](../../backend/equipment_supplier_schema.py#L30) | 30 |

## backend/equipment_suppliers.py

| Function | Line |
| --- | ---: |
| [`read_supplier_choices`](../../backend/equipment_suppliers.py#L13) | 13 |
| [`selectable_supplier`](../../backend/equipment_suppliers.py#L24) | 24 |
| [`device_supplier_values`](../../backend/equipment_suppliers.py#L37) | 37 |
| [`write_device_supplier`](../../backend/equipment_suppliers.py#L54) | 54 |
| [`read_device_suppliers`](../../backend/equipment_suppliers.py#L74) | 74 |
| [`read_receipt_suppliers`](../../backend/equipment_suppliers.py#L86) | 86 |
| [`write_receipt_supplier`](../../backend/equipment_suppliers.py#L103) | 103 |
| [`assign_equipment_supplier`](../../backend/equipment_suppliers.py#L114) | 114 |
| [`equipment_revisions`](../../backend/equipment_suppliers.py#L156) | 156 |
| [`assign_device_suppliers`](../../backend/equipment_suppliers.py#L170) | 170 |
| [`receipt_visible_to_equipment_reader`](../../backend/equipment_suppliers.py#L190) | 190 |
| [`assign_receipt_suppliers`](../../backend/equipment_suppliers.py#L200) | 200 |
| [`read_supplied_equipment`](../../backend/equipment_suppliers.py#L218) | 218 |

## backend/equipment_lifecycle.py

| Function | Line |
| --- | ---: |
| [`utc_today`](../../backend/equipment_lifecycle.py#L28) | 28 |
| [`physical_device`](../../backend/equipment_lifecycle.py#L32) | 32 |
| [`calendar_date`](../../backend/equipment_lifecycle.py#L37) | 37 |
| [`add_calendar_years`](../../backend/equipment_lifecycle.py#L51) | 51 |
| [`warning_state`](../../backend/equipment_lifecycle.py#L61) | 61 |
| [`lifecycle_configuration`](../../backend/equipment_lifecycle.py#L72) | 72 |
| [`display_type`](../../backend/equipment_lifecycle.py#L79) | 79 |
| [`lifecycle_types`](../../backend/equipment_lifecycle.py#L83) | 83 |
| [`device_type_availability`](../../backend/equipment_lifecycle.py#L106) | 106 |
| [`require_selectable_device_type`](../../backend/equipment_lifecycle.py#L117) | 117 |
| [`read_lifecycle_settings`](../../backend/equipment_lifecycle.py#L132) | 132 |
| [`whole_number`](../../backend/equipment_lifecycle.py#L139) | 139 |
| [`save_lifecycle_settings`](../../backend/equipment_lifecycle.py#L147) | 147 |
| [`device_lifecycle_values`](../../backend/equipment_lifecycle.py#L205) | 205 |
| [`write_device_lifecycle`](../../backend/equipment_lifecycle.py#L212) | 212 |
| [`project_device_lifecycle`](../../backend/equipment_lifecycle.py#L243) | 243 |
| [`capture_first_service_from_stock`](../../backend/equipment_lifecycle.py#L268) | 268 |

## backend/equipment_lifecycle_schema.py

| Function | Line |
| --- | ---: |
| [`seed_equipment_lifecycle_defaults`](../../backend/equipment_lifecycle_schema.py#L6) | 6 |
| [`migrate_equipment_lifecycle`](../../backend/equipment_lifecycle_schema.py#L18) | 18 |

## interface/lifecycle.js

| Function | Line |
| --- | ---: |
| [`asDate`](../../interface/lifecycle.js#L13) | 13 |
| [`dateLabel`](../../interface/lifecycle.js#L14) | 14 |
| [`typeLabel`](../../interface/lifecycle.js#L15) | 15 |
| [`esc`](../../interface/lifecycle.js#L16) | 16 |
| [`yearsLabel`](../../interface/lifecycle.js#L18) | 18 |
| [`addYears`](../../interface/lifecycle.js#L20) | 20 |
| [`renderDetails`](../../interface/lifecycle.js#L30) | 30 |
| [`bindEditor`](../../interface/lifecycle.js#L39) | 39 |
| [`input`](../../interface/lifecycle.js#L50) | 50 |
| [`update`](../../interface/lifecycle.js#L56) | 56 |
| [`form.lifecycleDraft`](../../interface/lifecycle.js#L98) | 98 |
| [`form.lifecycleChanges`](../../interface/lifecycle.js#L101) | 101 |
| [`renderDashboard`](../../interface/lifecycle.js#L124) | 124 |
| [`bindDashboard`](../../interface/lifecycle.js#L156) | 156 |
| [`closest`](../../interface/lifecycle.js#L166) | 166 |
| [`render`](../../interface/lifecycle.js#L169) | 169 |

## backend/service_desk.py

| Function | Line |
| --- | ---: |
| [`ticket_rows`](../../backend/service_desk.py#L39) | 39 |
| [`ticket_text`](../../backend/service_desk.py#L45) | 45 |
| [`ticket_category`](../../backend/service_desk.py#L55) | 55 |
| [`read_ticket_categories`](../../backend/service_desk.py#L66) | 66 |
| [`read_ticket_list`](../../backend/service_desk.py#L75) | 75 |
| [`read_ticket_equipment_choices`](../../backend/service_desk.py#L156) | 156 |
| [`read_ticket_software_choices`](../../backend/service_desk.py#L190) | 190 |
| [`read_ticket_assignment_choices`](../../backend/service_desk.py#L195) | 195 |
| [`eligible_ticket_technician`](../../backend/service_desk.py#L203) | 203 |
| [`require_ticket`](../../backend/service_desk.py#L208) | 208 |
| [`read_ticket`](../../backend/service_desk.py#L221) | 221 |
| [`read_ticket_attachment`](../../backend/service_desk.py#L276) | 276 |
| [`record_ticket_event`](../../backend/service_desk.py#L289) | 289 |
| [`insert_ticket_message`](../../backend/service_desk.py#L297) | 297 |
| [`create_ticket`](../../backend/service_desk.py#L304) | 304 |
| [`save_ticket_message`](../../backend/service_desk.py#L347) | 347 |
| [`change_ticket_lifecycle`](../../backend/service_desk.py#L381) | 381 |
| [`remove_ticket_attachment`](../../backend/service_desk.py#L480) | 480 |
| [`save_ticket_request`](../../backend/service_desk.py#L497) | 497 |

## backend/service_desk_access.py

| Function | Line |
| --- | ---: |
| [`linked_ticket_staff`](../../backend/service_desk_access.py#L31) | 31 |
| [`ticket_scope_filter`](../../backend/service_desk_access.py#L39) | 39 |
| [`ticket_equipment_for_creation`](../../backend/service_desk_access.py#L73) | 73 |
| [`employee_ticket_equipment`](../../backend/service_desk_access.py#L129) | 129 |

## backend/service_desk_schema.py

| Function | Line |
| --- | ---: |
| [`has_service_desk_storage`](../../backend/service_desk_schema.py#L130) | 130 |
| [`migrate_service_desk`](../../backend/service_desk_schema.py#L137) | 137 |
| [`migrate_ticket_software`](../../backend/service_desk_schema.py#L152) | 152 |
| [`migrate_service_desk_reporting`](../../backend/service_desk_schema.py#L157) | 157 |

## backend/service_desk_attachments.py

| Function | Line |
| --- | ---: |
| [`is_ticket_png`](../../backend/service_desk_attachments.py#L23) | 23 |
| [`is_ticket_jpeg`](../../backend/service_desk_attachments.py#L55) | 55 |
| [`is_ticket_pdf`](../../backend/service_desk_attachments.py#L94) | 94 |
| [`is_ticket_text`](../../backend/service_desk_attachments.py#L110) | 110 |
| [`read_ticket_office_xml`](../../backend/service_desk_attachments.py#L120) | 120 |
| [`is_ticket_office_document`](../../backend/service_desk_attachments.py#L133) | 133 |
| [`validate_ticket_attachments`](../../backend/service_desk_attachments.py#L173) | 173 |
| [`insert_ticket_attachments`](../../backend/service_desk_attachments.py#L212) | 212 |

## backend/service_desk_calendar.py

| Function | Line |
| --- | ---: |
| [`utc_timestamp`](../../backend/service_desk_calendar.py#L16) | 16 |
| [`read_deployment_timezone`](../../backend/service_desk_calendar.py#L20) | 20 |
| [`read_support_calendar`](../../backend/service_desk_calendar.py#L38) | 38 |
| [`append_support_calendar`](../../backend/service_desk_calendar.py#L48) | 48 |
| [`activate_deployment_timezone`](../../backend/service_desk_calendar.py#L56) | 56 |
| [`split_timezone_offsets`](../../backend/service_desk_calendar.py#L66) | 66 |
| [`eligible_working_time`](../../backend/service_desk_calendar.py#L91) | 91 |
| [`measure_resolution_attempt`](../../backend/service_desk_calendar.py#L110) | 110 |

## backend/service_desk_reporting.py

| Function | Line |
| --- | ---: |
| [`read_report_period`](../../backend/service_desk_reporting.py#L16) | 16 |
| [`save_report_period`](../../backend/service_desk_reporting.py#L24) | 24 |
| [`reporting_dates`](../../backend/service_desk_reporting.py#L48) | 48 |
| [`report_event_rows`](../../backend/service_desk_reporting.py#L60) | 60 |
| [`read_service_desk_report`](../../backend/service_desk_reporting.py#L93) | 93 |

## backend/service_desk_settings.py

| Function | Line |
| --- | ---: |
| [`parse_support_date`](../../backend/service_desk_settings.py#L19) | 19 |
| [`read_service_desk_settings`](../../backend/service_desk_settings.py#L28) | 28 |
| [`validate_working_hours`](../../backend/service_desk_settings.py#L38) | 38 |
| [`save_support_calendar`](../../backend/service_desk_settings.py#L54) | 54 |
| [`save_ticket_category`](../../backend/service_desk_settings.py#L93) | 93 |
| [`save_service_desk_settings`](../../backend/service_desk_settings.py#L129) | 129 |

## backend/ticket_software.py

| Function | Line |
| --- | ---: |
| [`ticket_software_choices`](../../backend/ticket_software.py#L12) | 12 |
