# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the indexed application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 1342.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`returnToExistingSignIn`](../../interface/loader.js#L8) | 8 |
| [`window.fetch`](../../interface/loader.js#L13) | 13 |
| [`renderInterfaceTemplate`](../../interface/loader.js#L38) | 38 |
| [`loadInterfaceText`](../../interface/loader.js#L46) | 46 |
| [`initialiseInterface`](../../interface/loader.js#L51) | 51 |
| [`staffScript.onerror`](../../interface/loader.js#L93) | 93 |
| [`staffScript.onload`](../../interface/loader.js#L94) | 94 |
| [`script.onerror`](../../interface/loader.js#L97) | 97 |
| [`script.onload`](../../interface/loader.js#L98) | 98 |
| [`stockScript.onerror`](../../interface/loader.js#L101) | 101 |
| [`stockScript.onload`](../../interface/loader.js#L102) | 102 |
| [`supplierScript.onerror`](../../interface/loader.js#L105) | 105 |
| [`supplierScript.onload`](../../interface/loader.js#L106) | 106 |
| [`lifecycleScript.onerror`](../../interface/loader.js#L109) | 109 |
| [`lifecycleScript.onload`](../../interface/loader.js#L110) | 110 |
| [`ukDatesScript.onerror`](../../interface/loader.js#L113) | 113 |
| [`ukDatesScript.onload`](../../interface/loader.js#L114) | 114 |
| [`serviceDeskScript.onerror`](../../interface/loader.js#L117) | 117 |
| [`serviceDeskScript.onload`](../../interface/loader.js#L118) | 118 |
| [`loadApplication`](../../interface/loader.js#L127) | 127 |
| [`applicationScript.onerror`](../../interface/loader.js#L130) | 130 |
| [`showInterfaceLoadError`](../../interface/loader.js#L139) | 139 |

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
| [`escapeHtml`](../../interface/application.js#L1211) | 1211 |
| [`inlineJsArg`](../../interface/application.js#L1220) | 1220 |
| [`browserStorageWarning`](../../interface/application.js#L1228) | 1228 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1231) | 1231 |
| [`renderSectionTabIcon`](../../interface/application.js#L1237) | 1237 |
| [`renderSectionHeader`](../../interface/application.js#L1243) | 1243 |
| [`tab`](../../interface/application.js#L1244) | 1244 |
| [`revealSectionTab`](../../interface/application.js#L1271) | 1271 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1278) | 1278 |
| [`renderContent`](../../interface/application.js#L1298) | 1298 |
| [`updateScrollHint`](../../interface/application.js#L1357) | 1357 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1368) | 1368 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1403) | 1403 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1407) | 1407 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1411) | 1411 |
| [`buildInventoryReportData`](../../interface/application.js#L1417) | 1417 |
| [`occupancy`](../../interface/application.js#L1433) | 1433 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1456) | 1456 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1462) | 1462 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1488) | 1488 |
| [`renderDashboardHTML`](../../interface/application.js#L1517) | 1517 |
| [`statusPill`](../../interface/application.js#L1623) | 1623 |
| [`insightSegment`](../../interface/application.js#L1640) | 1640 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1686) | 1686 |
| [`getCategoryIcon`](../../interface/application.js#L1703) | 1703 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1718) | 1718 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1727) | 1727 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1732) | 1732 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1747) | 1747 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1762) | 1762 |
| [`printRackElevation`](../../interface/application.js#L1772) | 1772 |
| [`safe`](../../interface/application.js#L1775) | 1775 |
| [`printRackElevationInFrame`](../../interface/application.js#L1806) | 1806 |
| [`frame.onload`](../../interface/application.js#L1816) | 1816 |
| [`renderRackHubV13`](../../interface/application.js#L1837) | 1837 |
| [`card`](../../interface/application.js#L1842) | 1842 |
| [`mark`](../../interface/application.js#L1851) | 1851 |
| [`bar`](../../interface/application.js#L1867) | 1867 |
| [`chartBox`](../../interface/application.js#L1868) | 1868 |
| [`chartRows`](../../interface/application.js#L1869) | 1869 |
| [`rackSpaceGuide`](../../interface/application.js#L1871) | 1871 |
| [`renderRacksHTML`](../../interface/application.js#L1940) | 1940 |
| [`changeRack`](../../interface/application.js#L2007) | 2007 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L2026) | 2026 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L2033) | 2033 |
| [`getVisibleDevices`](../../interface/application.js#L2039) | 2039 |
| [`filterHardwareModels`](../../interface/application.js#L2064) | 2064 |
| [`openCatalogueModal`](../../interface/application.js#L2103) | 2103 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2112) | 2112 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2136) | 2136 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2174) | 2174 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2186) | 2186 |
| [`renderCatalogueButton`](../../interface/application.js#L2203) | 2203 |
| [`renderCatalogueRecord`](../../interface/application.js#L2207) | 2207 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2212) | 2212 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2231) | 2231 |
| [`add`](../../interface/application.js#L2233) | 2233 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2278) | 2278 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2285) | 2285 |
| [`openHardwareModelManager`](../../interface/application.js#L2297) | 2297 |
| [`opts`](../../interface/application.js#L2302) | 2302 |
| [`saveHardwareModel`](../../interface/application.js#L2320) | 2320 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2349) | 2349 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2363) | 2363 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2385) | 2385 |
| [`add`](../../interface/application.js#L2387) | 2387 |
| [`options`](../../interface/application.js#L2423) | 2423 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2437) | 2437 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2452) | 2452 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2467) | 2467 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2475) | 2475 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2486) | 2486 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2495) | 2495 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2517) | 2517 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2528) | 2528 |
| [`openServerServiceEditor`](../../interface/application.js#L2545) | 2545 |
| [`saveServerServiceEntry`](../../interface/application.js#L2554) | 2554 |
| [`restoreArchivedServerService`](../../interface/application.js#L2567) | 2567 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2576) | 2576 |
| [`renderDevicesHTML`](../../interface/application.js#L2588) | 2588 |
| [`renderHardwareMetric`](../../interface/application.js#L2596) | 2596 |
| [`renderHardwareChart`](../../interface/application.js#L2601) | 2601 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2611) | 2611 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2630) | 2630 |
| [`renderArchivedSoftware`](../../interface/application.js#L2638) | 2638 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2677) | 2677 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2684) | 2684 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2685) | 2685 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2686) | 2686 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2689) | 2689 |
| [`openManageTypesModal`](../../interface/application.js#L2709) | 2709 |
| [`openManageLocationsModal`](../../interface/application.js#L2710) | 2710 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2713) | 2713 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2735) | 2735 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2742) | 2742 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2750) | 2750 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2770) | 2770 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2771) | 2771 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2772) | 2772 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2787) | 2787 |
| [`deleteDeviceType`](../../interface/application.js#L2807) | 2807 |
| [`deleteDeviceLocation`](../../interface/application.js#L2808) | 2808 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2816) | 2816 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2820) | 2820 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2847) | 2847 |
| [`nodes`](../../interface/application.js#L2857) | 2857 |
| [`renderIpamManage`](../../interface/application.js#L2883) | 2883 |
| [`renderIpamHTML`](../../interface/application.js#L2934) | 2934 |
| [`changeSubnet`](../../interface/application.js#L3095) | 3095 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3108) | 3108 |
| [`openIpamModal`](../../interface/application.js#L3134) | 3134 |
| [`openBulkIpModal`](../../interface/application.js#L3139) | 3139 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3146) | 3146 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3150) | 3150 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3169) | 3169 |
| [`applyBulkIpChanges`](../../interface/application.js#L3185) | 3185 |
| [`subnetCidrFeedback`](../../interface/application.js#L3199) | 3199 |
| [`suggestSubnetGateway`](../../interface/application.js#L3217) | 3217 |
| [`openSubnetModal`](../../interface/application.js#L3245) | 3245 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3249) | 3249 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3275) | 3275 |
| [`handleSubnetSubmit`](../../interface/application.js#L3295) | 3295 |
| [`showSubnetFormError`](../../interface/application.js#L3502) | 3502 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3518) | 3518 |
| [`subnetNameConflicts`](../../interface/application.js#L3532) | 3532 |
| [`subnetHasVlan`](../../interface/application.js#L3539) | 3539 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3542) | 3542 |
| [`openMultipleSubnets`](../../interface/application.js#L3550) | 3550 |
| [`option`](../../interface/application.js#L3552) | 3552 |
| [`visibility`](../../interface/application.js#L3557) | 3557 |
| [`planningVisibility`](../../interface/application.js#L3561) | 3561 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3579) | 3579 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3591) | 3591 |
| [`read`](../../interface/application.js#L3593) | 3593 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3611) | 3611 |
| [`reject`](../../interface/application.js#L3613) | 3613 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3650) | 3650 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3654) | 3654 |
| [`add`](../../interface/application.js#L3657) | 3657 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3684) | 3684 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3692) | 3692 |
| [`field`](../../interface/application.js#L3695) | 3695 |
| [`capture`](../../interface/application.js#L3705) | 3705 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3739) | 3739 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3743) | 3743 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3749) | 3749 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3770) | 3770 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3774) | 3774 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3778) | 3778 |
| [`deleteSubnet`](../../interface/application.js#L3789) | 3789 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3849) | 3849 |
| [`deleteSubnetCommit`](../../interface/application.js#L3877) | 3877 |
| [`deleteVlan`](../../interface/application.js#L3907) | 3907 |
| [`openIpModal`](../../interface/application.js#L3933) | 3933 |
| [`handleIpSubmit`](../../interface/application.js#L3950) | 3950 |
| [`openEquipmentSupplierModal`](../../interface/application.js#L4015) | 4015 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L4029) | 4029 |
| [`modalFormSnapshot`](../../interface/application.js#L4039) | 4039 |
| [`stockFormHasChanges`](../../interface/application.js#L4055) | 4055 |
| [`rememberModalForm`](../../interface/application.js#L4059) | 4059 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L4064) | 4064 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L4094) | 4094 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4113) | 4113 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4122) | 4122 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4128) | 4128 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4134) | 4134 |
| [`closeModal`](../../interface/application.js#L4143) | 4143 |
| [`openModal`](../../interface/application.js#L4197) | 4197 |
| [`readRackDimension`](../../interface/application.js#L4270) | 4270 |
| [`formatRackDimension`](../../interface/application.js#L4277) | 4277 |
| [`rackPhysicalDetails`](../../interface/application.js#L4282) | 4282 |
| [`openRackModal`](../../interface/application.js#L4291) | 4291 |
| [`handleRackSubmit`](../../interface/application.js#L4307) | 4307 |
| [`deleteRack`](../../interface/application.js#L4374) | 4374 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4396) | 4396 |
| [`refresh`](../../interface/application.js#L4419) | 4419 |
| [`openAssignDeviceModal`](../../interface/application.js#L4496) | 4496 |
| [`refresh`](../../interface/application.js#L4513) | 4513 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4520) | 4520 |
| [`handleAssignSubmit`](../../interface/application.js#L4554) | 4554 |
| [`unassignDevice`](../../interface/application.js#L4599) | 4599 |
| [`getSubnetForIp`](../../interface/application.js#L4616) | 4616 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4620) | 4620 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4667) | 4667 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4676) | 4676 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4685) | 4685 |
| [`inside`](../../interface/application.js#L4692) | 4692 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4710) | 4710 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4719) | 4719 |
| [`toggleDeviceMountType`](../../interface/application.js#L4763) | 4763 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4787) | 4787 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4792) | 4792 |
| [`openDeviceReviewModal`](../../interface/application.js#L4810) | 4810 |
| [`openDeviceDetailView`](../../interface/application.js#L4815) | 4815 |
| [`safe`](../../interface/application.js#L4825) | 4825 |
| [`field`](../../interface/application.js#L4826) | 4826 |
| [`section`](../../interface/application.js#L4831) | 4831 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4883) | 4883 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4889) | 4889 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4908) | 4908 |
| [`navigateToDeviceRack`](../../interface/application.js#L4927) | 4927 |
| [`duplicateDevice`](../../interface/application.js#L4955) | 4955 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L5025) | 5025 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L5030) | 5030 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L5035) | 5035 |
| [`openServerServiceManager`](../../interface/application.js#L5036) | 5036 |
| [`captureServerServiceSelections`](../../interface/application.js#L5041) | 5041 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L5047) | 5047 |
| [`confirmServerServiceArchive`](../../interface/application.js#L5068) | 5068 |
| [`archiveServerService`](../../interface/application.js#L5076) | 5076 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L5102) | 5102 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L5106) | 5106 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L5124) | 5124 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L5128) | 5128 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L5131) | 5131 |
| [`updateHardwareCatalogue`](../../interface/application.js#L5138) | 5138 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5166) | 5166 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5170) | 5170 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5215) | 5215 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5249) | 5249 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5266) | 5266 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5269) | 5269 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5270) | 5270 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5275) | 5275 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5281) | 5281 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5319) | 5319 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5320) | 5320 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5327) | 5327 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5328) | 5328 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5343) | 5343 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5349) | 5349 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5372) | 5372 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5388) | 5388 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5391) | 5391 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5400) | 5400 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5411) | 5411 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5420) | 5420 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5423) | 5423 |
| [`isSoftwareDetailField`](../../interface/application.js#L5430) | 5430 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5438) | 5438 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5447) | 5447 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5453) | 5453 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5465) | 5465 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5505) | 5505 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5533) | 5533 |
| [`updateInlinePickerCount`](../../interface/application.js#L5542) | 5542 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5548) | 5548 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5561) | 5561 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5570) | 5570 |
| [`fail`](../../interface/application.js#L5576) | 5576 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5630) | 5630 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5646) | 5646 |
| [`fail`](../../interface/application.js#L5651) | 5651 |
| [`serverStorageField`](../../interface/application.js#L5698) | 5698 |
| [`renderServerStorageFields`](../../interface/application.js#L5703) | 5703 |
| [`renderServerStorageFields.action`](../../interface/application.js#L5706) | 5706 |
| [`captureServerStorageValues`](../../interface/application.js#L5718) | 5718 |
| [`refreshServerStorageControls`](../../interface/application.js#L5738) | 5738 |
| [`updateServerStorage`](../../interface/application.js#L5748) | 5748 |
| [`updateServerStorage.vdev`](../../interface/application.js#L5752) | 5752 |
| [`serverStorageDetailRows`](../../interface/application.js#L5760) | 5760 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5770) | 5770 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5800) | 5800 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5806) | 5806 |
| [`getPlatformVersionOptions`](../../interface/application.js#L6172) | 6172 |
| [`isWindowsPlatform`](../../interface/application.js#L6175) | 6175 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L6179) | 6179 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L6182) | 6182 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L6186) | 6186 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L6203) | 6203 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L6207) | 6207 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6227) | 6227 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6254) | 6254 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6303) | 6303 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6311) | 6311 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6322) | 6322 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6326) | 6326 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6338) | 6338 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6350) | 6350 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6377) | 6377 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6381) | 6381 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6385) | 6385 |
| [`getDefaultMountType`](../../interface/application.js#L6398) | 6398 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6401) | 6401 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6406) | 6406 |
| [`initialiseNotesEditor`](../../interface/application.js#L6423) | 6423 |
| [`inlineMarkdown`](../../interface/application.js#L6428) | 6428 |
| [`render`](../../interface/application.js#L6441) | 6441 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6475) | 6475 |
| [`activate`](../../interface/application.js#L6869) | 6869 |
| [`openDeviceModal`](../../interface/application.js#L6950) | 6950 |
| [`selectableType`](../../interface/application.js#L6958) | 6958 |
| [`syncVmPurpose`](../../interface/application.js#L7000) | 7000 |
| [`clearFieldError`](../../interface/application.js#L7064) | 7064 |
| [`captureDeviceFormDraft`](../../interface/application.js#L7085) | 7085 |
| [`createRackFromDevice`](../../interface/application.js#L7123) | 7123 |
| [`cancelRackFromDevice`](../../interface/application.js#L7131) | 7131 |
| [`createSubnetFromDevice`](../../interface/application.js#L7141) | 7141 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L7154) | 7154 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L7168) | 7168 |
| [`addCustomLocationOption`](../../interface/application.js#L7180) | 7180 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L7220) | 7220 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7232) | 7232 |
| [`finish`](../../interface/application.js#L7252) | 7252 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7277) | 7277 |
| [`finish`](../../interface/application.js#L7291) | 7291 |
| [`handleDeviceSubmit`](../../interface/application.js#L7311) | 7311 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7351) | 7351 |
| [`deleteDevice`](../../interface/application.js#L7500) | 7500 |
| [`personalSafeStorageGet`](../../interface/application.js#L7557) | 7557 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7562) | 7562 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7572) | 7572 |
| [`button`](../../interface/application.js#L7573) | 7573 |
| [`themeChoice`](../../interface/application.js#L7577) | 7577 |
| [`guideLinks`](../../interface/application.js#L7594) | 7594 |
| [`loadSmtpSettings`](../../interface/application.js#L7625) | 7625 |
| [`renderApplicationSettings`](../../interface/application.js#L7640) | 7640 |
| [`syncSmtpForm`](../../interface/application.js#L7644) | 7644 |
| [`updateSmtpFields`](../../interface/application.js#L7666) | 7666 |
| [`hydrateSettings`](../../interface/application.js#L7679) | 7679 |
| [`caffootCompareVersions`](../../interface/application.js#L7701) | 7701 |
| [`parse`](../../interface/application.js#L7702) | 7702 |
| [`caffootShowLicences`](../../interface/application.js#L7724) | 7724 |
| [`caffootUpdateGuide`](../../interface/application.js#L7729) | 7729 |
| [`caffootCheckUpdates`](../../interface/application.js#L7734) | 7734 |
| [`checkInventorySafety`](../../interface/application.js#L7765) | 7765 |
| [`requestInventoryReset`](../../interface/application.js#L7788) | 7788 |
| [`createInventoryBackup`](../../interface/application.js#L7818) | 7818 |
| [`validateBackupVersion`](../../interface/application.js#L7830) | 7830 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7845) | 7845 |
| [`exportData`](../../interface/application.js#L7853) | 7853 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7866) | 7866 |
| [`validateBackupStructure`](../../interface/application.js#L7881) | 7881 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7898) | 7898 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7910) | 7910 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7949) | 7949 |
| [`findRackImportConflicts`](../../interface/application.js#L7953) | 7953 |
| [`place`](../../interface/application.js#L7959) | 7959 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L8005) | 8005 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L8026) | 8026 |
| [`showBackupImportError`](../../interface/application.js#L8031) | 8031 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L8035) | 8035 |
| [`finish`](../../interface/application.js#L8045) | 8045 |
| [`onClick`](../../interface/application.js#L8054) | 8054 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L8064) | 8064 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L8075) | 8075 |
| [`finish`](../../interface/application.js#L8086) | 8086 |
| [`onClick`](../../interface/application.js#L8095) | 8095 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L8110) | 8110 |
| [`importData`](../../interface/application.js#L8126) | 8126 |
| [`reader.onload`](../../interface/application.js#L8136) | 8136 |
| [`reader.onerror`](../../interface/application.js#L8210) | 8210 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8337) | 8337 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8353) | 8353 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8364) | 8364 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8398) | 8398 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8456) | 8456 |
| [`cancel`](../../interface/application.js#L8469) | 8469 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8485) | 8485 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8502) | 8502 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8527) | 8527 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8541) | 8541 |
| [`clearRackDropPreview`](../../interface/application.js#L8544) | 8544 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8549) | 8549 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8561) | 8561 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8567) | 8567 |
| [`trackRackDrag`](../../interface/application.js#L8576) | 8576 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8607) | 8607 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8617) | 8617 |
| [`getRackDropPosition`](../../interface/application.js#L8710) | 8710 |
| [`window.onload`](../../interface/application.js#L9177) | 9177 |
| [`inventorySectionAccess`](../../interface/application.js#L9198) | 9198 |
| [`addDirectoryAccess`](../../interface/application.js#L9199) | 9199 |
| [`canAssignEquipmentSupplier`](../../interface/application.js#L9211) | 9211 |
| [`canSubmitServiceDeskForm`](../../interface/application.js#L9215) | 9215 |
| [`canSubmitSupplierForm`](../../interface/application.js#L9218) | 9218 |
| [`refreshStockAccess`](../../interface/application.js#L9243) | 9243 |
| [`refreshCentralInventory`](../../interface/application.js#L9254) | 9254 |
| [`postInventory`](../../interface/application.js#L9283) | 9283 |
| [`isBlockedAction`](../../interface/application.js#L9335) | 9335 |
| [`applyAllowedControls`](../../interface/application.js#L9368) | 9368 |
| [`enhanceLongSelects`](../../interface/application.js#L9445) | 9445 |
| [`sync`](../../interface/application.js#L9497) | 9497 |
| [`close`](../../interface/application.js#L9503) | 9503 |
| [`choose`](../../interface/application.js#L9507) | 9507 |
| [`draw`](../../interface/application.js#L9512) | 9512 |
| [`open`](../../interface/application.js#L9530) | 9530 |
| [`enhanceSelects`](../../interface/application.js#L9587) | 9587 |
| [`setDepartmentExpanded`](../../interface/application.js#L9632) | 9632 |
| [`isSupplierPage`](../../interface/application.js#L9648) | 9648 |
| [`landingTab`](../../interface/application.js#L9652) | 9652 |
| [`workspaceHashTab`](../../interface/application.js#L9657) | 9657 |
| [`switchTab`](../../interface/application.js#L9680) | 9680 |
| [`navigate`](../../interface/application.js#L9715) | 9715 |
| [`viewSupplierEquipment`](../../interface/application.js#L9722) | 9722 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9740) | 9740 |
| [`openDeviceDetailView`](../../interface/application.js#L9766) | 9766 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9782) | 9782 |
| [`forbidRackMount`](../../interface/application.js#L9841) | 9841 |
| [`installDeviceSupplier`](../../interface/application.js#L9851) | 9851 |
| [`installDeviceStockControls`](../../interface/application.js#L9865) | 9865 |
| [`loadDeviceStockSources`](../../interface/application.js#L9880) | 9880 |
| [`select.onchange`](../../interface/application.js#L9893) | 9893 |
| [`openDeviceModal`](../../interface/application.js#L9919) | 9919 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9963) | 9963 |
| [`relatedChanges`](../../interface/application.js#L9969) | 9969 |
| [`saveDevice`](../../interface/application.js#L9980) | 9980 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L10041) | 10041 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L10042) | 10042 |
| [`nextIpamBridge.save`](../../interface/application.js#L10064) | 10064 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L10086) | 10086 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L10108) | 10108 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L10151) | 10151 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L10196) | 10196 |
| [`openDeviceIpamLink`](../../interface/application.js#L10200) | 10200 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L10208) | 10208 |
| [`nextSettingsBridge.save`](../../interface/application.js#L10249) | 10249 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L10266) | 10266 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L10267) | 10267 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L10268) | 10268 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L10282) | 10282 |
| [`nextResetBridge.reset`](../../interface/application.js#L10313) | 10313 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L10340) | 10340 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L10372) | 10372 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L10380) | 10380 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L10389) | 10389 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L10390) | 10390 |
| [`nextRackBridge.save`](../../interface/application.js#L10425) | 10425 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L10428) | 10428 |
| [`nextRackBridge.persist`](../../interface/application.js#L10431) | 10431 |
| [`reserveForDelete`](../../interface/application.js#L10453) | 10453 |
| [`removeDevice`](../../interface/application.js#L10461) | 10461 |
| [`cancelDelete`](../../interface/application.js#L10487) | 10487 |
| [`saveArchivedInstallation`](../../interface/application.js#L10493) | 10493 |
| [`nextDeviceBridge.canReadSuppliers`](../../interface/application.js#L10524) | 10524 |
| [`nextDeviceBridge.canAssignSupplier`](../../interface/application.js#L10525) | 10525 |
| [`renderAccountSections`](../../interface/application.js#L10532) | 10532 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10560) | 10560 |
| [`nextRenderAccount`](../../interface/application.js#L10571) | 10571 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10581) | 10581 |
| [`closeEmailVerification`](../../interface/application.js#L10605) | 10605 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10612) | 10612 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10623) | 10623 |
| [`hydrateAccount`](../../interface/application.js#L10677) | 10677 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10715) | 10715 |
| [`loadAccountProfile`](../../interface/application.js#L10728) | 10728 |
| [`removeAccountPhoto`](../../interface/application.js#L10744) | 10744 |
| [`permissionLabel`](../../interface/application.js#L10756) | 10756 |
| [`accountMfaLabel`](../../interface/application.js#L10759) | 10759 |
| [`renderRoleMemberships`](../../interface/application.js#L10762) | 10762 |
| [`renderRoleCatalogue`](../../interface/application.js#L10768) | 10768 |
| [`openRoleLayer`](../../interface/application.js#L10773) | 10773 |
| [`closeRoleLayer`](../../interface/application.js#L10784) | 10784 |
| [`renderRoleDefinition`](../../interface/application.js#L10790) | 10790 |
| [`renderRoleImpact`](../../interface/application.js#L10794) | 10794 |
| [`access`](../../interface/application.js#L10799) | 10799 |
| [`state`](../../interface/application.js#L10803) | 10803 |
| [`requestRoleChange`](../../interface/application.js#L10808) | 10808 |
| [`roleNotificationMessage`](../../interface/application.js#L10815) | 10815 |
| [`previewRoleAction`](../../interface/application.js#L10819) | 10819 |
| [`openRoleEditor`](../../interface/application.js#L10824) | 10824 |
| [`nextRenderUsers`](../../interface/application.js#L10887) | 10887 |
| [`profileFields`](../../interface/application.js#L10889) | 10889 |
| [`stat`](../../interface/application.js#L10910) | 10910 |
| [`bars`](../../interface/application.js#L10913) | 10913 |
| [`operation`](../../interface/application.js#L10970) | 10970 |
| [`filterUserRows`](../../interface/application.js#L10990) | 10990 |
| [`closeUserWorkspace`](../../interface/application.js#L11014) | 11014 |
| [`loadCentralUsers`](../../interface/application.js#L11043) | 11043 |
| [`changeCentralUser`](../../interface/application.js#L11049) | 11049 |
| [`importPanel`](../../interface/application.js#L11060) | 11060 |
| [`cancelImport`](../../interface/application.js#L11064) | 11064 |
| [`nextImportModalClosed`](../../interface/application.js#L11070) | 11070 |
| [`showImportReview`](../../interface/application.js#L11071) | 11071 |
| [`chooseImportFile`](../../interface/application.js#L11111) | 11111 |
| [`actOnImport`](../../interface/application.js#L11128) | 11128 |
| [`canSubmitLifecycleSettings`](../../interface/application.js#L11329) | 11329 |
| [`openLifecycleSettings`](../../interface/application.js#L11332) | 11332 |
| [`close`](../../interface/application.js#L11351) | 11351 |
| [`leaveLifecycleSettings`](../../interface/application.js#L11357) | 11357 |

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
| [`hydrate`](../../interface/equipment.js#L89) | 89 |
| [`showAssignmentDialog`](../../interface/equipment.js#L93) | 93 |
| [`searchRecipients`](../../interface/equipment.js#L104) | 104 |
| [`searchDevices`](../../interface/equipment.js#L113) | 113 |
| [`leaveAssignmentDialog`](../../interface/equipment.js#L121) | 121 |
| [`saveAssignment`](../../interface/equipment.js#L127) | 127 |
| [`caffootEquipment.configure`](../../interface/equipment.js#L181) | 181 |

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
| [`requestTickets`](../../interface/service-desk.js#L18) | 18 |
| [`ticketNumber`](../../interface/service-desk.js#L37) | 37 |
| [`ticketOptions`](../../interface/service-desk.js#L41) | 41 |
| [`ticketDate`](../../interface/service-desk.js#L48) | 48 |
| [`ticketTag`](../../interface/service-desk.js#L52) | 52 |
| [`renderTicketQueue`](../../interface/service-desk.js#L56) | 56 |
| [`renderTicketRows`](../../interface/service-desk.js#L62) | 62 |
| [`hydrateTicketQueue`](../../interface/service-desk.js#L72) | 72 |
| [`refreshQueue`](../../interface/service-desk.js#L80) | 80 |
| [`changeTicketFilters`](../../interface/service-desk.js#L129) | 129 |
| [`resetTicketFilters`](../../interface/service-desk.js#L137) | 137 |
| [`renderTicketEquipmentPanel`](../../interface/service-desk.js#L173) | 173 |
| [`hydrateTicketEquipment`](../../interface/service-desk.js#L181) | 181 |
| [`refreshEquipmentTickets`](../../interface/service-desk.js#L188) | 188 |
| [`openTicketWindow`](../../interface/service-desk.js#L217) | 217 |
| [`showTicketError`](../../interface/service-desk.js#L222) | 222 |
| [`ticketDialogActive`](../../interface/service-desk.js#L228) | 228 |
| [`openCreateTicket`](../../interface/service-desk.js#L232) | 232 |
| [`openTicketDetails`](../../interface/service-desk.js#L267) | 267 |
| [`refreshTicketDetails`](../../interface/service-desk.js#L273) | 273 |
| [`ticketFact`](../../interface/service-desk.js#L292) | 292 |
| [`renderTicketOverview`](../../interface/service-desk.js#L296) | 296 |
| [`edit`](../../interface/service-desk.js#L297) | 297 |
| [`ticketFileInput`](../../interface/service-desk.js#L314) | 314 |
| [`renderTicketUpdates`](../../interface/service-desk.js#L319) | 319 |
| [`ticketHistoryText`](../../interface/service-desk.js#L347) | 347 |
| [`renderTicketHistory`](../../interface/service-desk.js#L368) | 368 |
| [`ticketActions`](../../interface/service-desk.js#L375) | 375 |
| [`showTicketTab`](../../interface/service-desk.js#L382) | 382 |
| [`ticketActionForm`](../../interface/service-desk.js#L421) | 421 |
| [`ticketSelect`](../../interface/service-desk.js#L428) | 428 |
| [`openTicketAction`](../../interface/service-desk.js#L433) | 433 |
| [`checkAssignment`](../../interface/service-desk.js#L489) | 489 |
| [`editTicketClassification`](../../interface/service-desk.js#L496) | 496 |
| [`ticketAttachmentPayload`](../../interface/service-desk.js#L518) | 518 |
| [`saveTicketForm`](../../interface/service-desk.js#L538) | 538 |
| [`closeTicketDialog`](../../interface/service-desk.js#L630) | 630 |
| [`configure`](../../interface/service-desk.js#L641) | 641 |
| [`canRead`](../../interface/service-desk.js#L642) | 642 |

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
| [`visible_subnet_batch_reason`](../../backend/history_permissions.py#L35) | 35 |
| [`visible_change_history`](../../backend/history_permissions.py#L63) | 63 |

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
| [`initialise_database`](../../backend/schema.py#L69) | 69 |
| [`migrate_staff_directory`](../../backend/schema.py#L280) | 280 |
| [`migrate_role_permissions`](../../backend/schema.py#L345) | 345 |
| [`verify_role_migration`](../../backend/schema.py#L430) | 430 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L456) | 456 |
| [`migrate_it_staff_stock_default`](../../backend/schema.py#L550) | 550 |
| [`migrate_device_assignments`](../../backend/schema.py#L578) | 578 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L115) | 115 |
| [`connect`](../../backend/server.py#L133) | 133 |
| [`initialise_database`](../../backend/server.py#L141) | 141 |
| [`end_headers`](../../backend/server.py#L147) | 147 |
| [`do_GET`](../../backend/server.py#L154) | 154 |
| [`do_POST`](../../backend/server.py#L539) | 539 |
| [`handle_supplier_request`](../../backend/server.py#L729) | 729 |
| [`handle_stock_request`](../../backend/server.py#L810) | 810 |
| [`handle_service_desk_request`](../../backend/server.py#L899) | 899 |
| [`handle_equipment_request`](../../backend/server.py#L1032) | 1032 |
| [`handle_directory_request`](../../backend/server.py#L1113) | 1113 |
| [`handle_feature_settings`](../../backend/server.py#L1190) | 1190 |
| [`handle_role_change`](../../backend/server.py#L1239) | 1239 |
| [`handle_user_mutation`](../../backend/server.py#L1281) | 1281 |
| [`handle_account_email`](../../backend/server.py#L1682) | 1682 |
| [`handle_profile_photo`](../../backend/server.py#L1762) | 1762 |
| [`handle_import`](../../backend/server.py#L1793) | 1793 |
| [`respond`](../../backend/server.py#L1869) | 1869 |
| [`main`](../../backend/server.py#L1882) | 1882 |

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
| [`ticket_rows`](../../backend/service_desk.py#L36) | 36 |
| [`ticket_text`](../../backend/service_desk.py#L42) | 42 |
| [`ticket_category`](../../backend/service_desk.py#L52) | 52 |
| [`read_ticket_categories`](../../backend/service_desk.py#L63) | 63 |
| [`read_ticket_list`](../../backend/service_desk.py#L71) | 71 |
| [`read_ticket_equipment_choices`](../../backend/service_desk.py#L151) | 151 |
| [`read_ticket_assignment_choices`](../../backend/service_desk.py#L183) | 183 |
| [`eligible_ticket_technician`](../../backend/service_desk.py#L191) | 191 |
| [`require_ticket`](../../backend/service_desk.py#L196) | 196 |
| [`read_ticket`](../../backend/service_desk.py#L209) | 209 |
| [`read_ticket_attachment`](../../backend/service_desk.py#L254) | 254 |
| [`record_ticket_event`](../../backend/service_desk.py#L267) | 267 |
| [`insert_ticket_message`](../../backend/service_desk.py#L275) | 275 |
| [`create_ticket`](../../backend/service_desk.py#L282) | 282 |
| [`save_ticket_message`](../../backend/service_desk.py#L314) | 314 |
| [`change_ticket_lifecycle`](../../backend/service_desk.py#L348) | 348 |
| [`remove_ticket_attachment`](../../backend/service_desk.py#L442) | 442 |
| [`save_ticket_request`](../../backend/service_desk.py#L459) | 459 |

## backend/service_desk_access.py

| Function | Line |
| --- | ---: |
| [`linked_ticket_staff`](../../backend/service_desk_access.py#L31) | 31 |
| [`ticket_scope_filter`](../../backend/service_desk_access.py#L39) | 39 |
| [`ticket_equipment_for_creation`](../../backend/service_desk_access.py#L73) | 73 |

## backend/service_desk_schema.py

| Function | Line |
| --- | ---: |
| [`has_service_desk_storage`](../../backend/service_desk_schema.py#L127) | 127 |
| [`migrate_service_desk`](../../backend/service_desk_schema.py#L134) | 134 |

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
