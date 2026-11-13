# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 746.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`renderInterfaceTemplate`](../../interface/loader.js#L5) | 5 |
| [`loadInterfaceText`](../../interface/loader.js#L13) | 13 |
| [`initialiseInterface`](../../interface/loader.js#L18) | 18 |
| [`script.onerror`](../../interface/loader.js#L40) | 40 |
| [`showInterfaceLoadError`](../../interface/loader.js#L43) | 43 |

## interface/application.js

| Function | Line |
| --- | ---: |
| [`cloneDefaultData`](../../interface/application.js#L19) | 19 |
| [`isPlainObject`](../../interface/application.js#L23) | 23 |
| [`isValidIpv4`](../../interface/application.js#L27) | 27 |
| [`parseIpv4AddressToNumber`](../../interface/application.js#L37) | 37 |
| [`formatIpv4Address`](../../interface/application.js#L41) | 41 |
| [`parseSupportedIpv4Subnet`](../../interface/application.js#L44) | 44 |
| [`isUsableHostAddressInSubnet`](../../interface/application.js#L53) | 53 |
| [`isValidCidr24`](../../interface/application.js#L57) | 57 |
| [`hierarchyIpNumber`](../../interface/application.js#L61) | 61 |
| [`hierarchyIpString`](../../interface/application.js#L66) | 66 |
| [`hierarchyParseCidr`](../../interface/application.js#L67) | 67 |
| [`hierarchyValidate`](../../interface/application.js#L75) | 75 |
| [`ancestor`](../../interface/application.js#L115) | 115 |
| [`independentNetworkInsideBlock`](../../interface/application.js#L125) | 125 |
| [`hierarchyValidateTypes`](../../interface/application.js#L140) | 140 |
| [`previewLegacyVlanOwnershipInApp`](../../interface/application.js#L171) | 171 |
| [`reconcileLegacyVlanOwnership`](../../interface/application.js#L185) | 185 |
| [`migrateLegacyRackLocation`](../../interface/application.js#L223) | 223 |
| [`normaliseLegacyRackAccessoryTypes`](../../interface/application.js#L237) | 237 |
| [`normaliseState`](../../interface/application.js#L244) | 244 |
| [`validateApplicationState`](../../interface/application.js#L413) | 413 |
| [`loadStoredState`](../../interface/application.js#L480) | 480 |
| [`showStorageRecoveryBanner`](../../interface/application.js#L486) | 486 |
| [`download.onclick`](../../interface/application.js#L501) | 501 |
| [`reset.onclick`](../../interface/application.js#L510) | 510 |
| [`caffootThemePreference`](../../interface/application.js#L545) | 545 |
| [`caffootApplyTheme`](../../interface/application.js#L552) | 552 |
| [`caffootSetTheme`](../../interface/application.js#L566) | 566 |
| [`onSystemThemeChange`](../../interface/application.js#L577) | 577 |
| [`toggleDarkMode`](../../interface/application.js#L586) | 586 |
| [`readAuditHistory`](../../interface/application.js#L593) | 593 |
| [`auditChanges`](../../interface/application.js#L597) | 597 |
| [`recordAudit`](../../interface/application.js#L634) | 634 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L643) | 643 |
| [`exportAuditHistory`](../../interface/application.js#L655) | 655 |
| [`auditVisibleRows`](../../interface/application.js#L667) | 667 |
| [`auditDate`](../../interface/application.js#L689) | 689 |
| [`renderAuditHTML`](../../interface/application.js#L693) | 693 |
| [`hydrateAudit`](../../interface/application.js#L726) | 726 |
| [`applyAuditFilters`](../../interface/application.js#L734) | 734 |
| [`closeAuditDetail`](../../interface/application.js#L769) | 769 |
| [`showAuditDetail`](../../interface/application.js#L775) | 775 |
| [`nextRenderUsers`](../../interface/application.js#L802) | 802 |
| [`nextRenderAccount`](../../interface/application.js#L804) | 804 |
| [`hydrateAccount`](../../interface/application.js#L805) | 805 |
| [`removeAccountPhoto`](../../interface/application.js#L806) | 806 |
| [`saveState`](../../interface/application.js#L809) | 809 |
| [`getDeviceById`](../../interface/application.js#L812) | 812 |
| [`findDeviceUsingIp`](../../interface/application.js#L816) | 816 |
| [`setDevicePrimaryIp`](../../interface/application.js#L821) | 821 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L880) | 880 |
| [`isRackMountedDevice`](../../interface/application.js#L893) | 893 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L896) | 896 |
| [`getRackShelfLocation`](../../interface/application.js#L908) | 908 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L913) | 913 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L929) | 929 |
| [`openRackShelfCreation`](../../interface/application.js#L947) | 947 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L961) | 961 |
| [`createRackShelfFromDevice`](../../interface/application.js#L971) | 971 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L978) | 978 |
| [`options`](../../interface/application.js#L984) | 984 |
| [`validateRackPlacement`](../../interface/application.js#L1005) | 1005 |
| [`showToast`](../../interface/application.js#L1040) | 1040 |
| [`toggleSidebar`](../../interface/application.js#L1128) | 1128 |
| [`switchTab`](../../interface/application.js#L1147) | 1147 |
| [`escapeHtml`](../../interface/application.js#L1174) | 1174 |
| [`inlineJsArg`](../../interface/application.js#L1183) | 1183 |
| [`browserStorageWarning`](../../interface/application.js#L1191) | 1191 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1194) | 1194 |
| [`renderSectionTabIcon`](../../interface/application.js#L1200) | 1200 |
| [`renderSectionHeader`](../../interface/application.js#L1206) | 1206 |
| [`tab`](../../interface/application.js#L1207) | 1207 |
| [`revealSectionTab`](../../interface/application.js#L1234) | 1234 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1241) | 1241 |
| [`renderContent`](../../interface/application.js#L1257) | 1257 |
| [`updateScrollHint`](../../interface/application.js#L1293) | 1293 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1304) | 1304 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1339) | 1339 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1343) | 1343 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1347) | 1347 |
| [`buildInventoryReportData`](../../interface/application.js#L1353) | 1353 |
| [`occupancy`](../../interface/application.js#L1369) | 1369 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1392) | 1392 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1398) | 1398 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1424) | 1424 |
| [`renderDashboardHTML`](../../interface/application.js#L1443) | 1443 |
| [`statusPill`](../../interface/application.js#L1546) | 1546 |
| [`insightSegment`](../../interface/application.js#L1563) | 1563 |
| [`getCategoryIcon`](../../interface/application.js#L1604) | 1604 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1619) | 1619 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1628) | 1628 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1633) | 1633 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1648) | 1648 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1663) | 1663 |
| [`printRackElevation`](../../interface/application.js#L1673) | 1673 |
| [`safe`](../../interface/application.js#L1676) | 1676 |
| [`printRackElevationInFrame`](../../interface/application.js#L1707) | 1707 |
| [`frame.onload`](../../interface/application.js#L1717) | 1717 |
| [`renderRackHubV13`](../../interface/application.js#L1738) | 1738 |
| [`card`](../../interface/application.js#L1743) | 1743 |
| [`mark`](../../interface/application.js#L1752) | 1752 |
| [`bar`](../../interface/application.js#L1768) | 1768 |
| [`chartBox`](../../interface/application.js#L1769) | 1769 |
| [`chartRows`](../../interface/application.js#L1770) | 1770 |
| [`rackSpaceGuide`](../../interface/application.js#L1772) | 1772 |
| [`renderRacksHTML`](../../interface/application.js#L1841) | 1841 |
| [`changeRack`](../../interface/application.js#L1908) | 1908 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1927) | 1927 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1934) | 1934 |
| [`getVisibleDevices`](../../interface/application.js#L1940) | 1940 |
| [`filterHardwareModels`](../../interface/application.js#L1965) | 1965 |
| [`openCatalogueModal`](../../interface/application.js#L2004) | 2004 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2013) | 2013 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2037) | 2037 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2075) | 2075 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2087) | 2087 |
| [`renderCatalogueButton`](../../interface/application.js#L2104) | 2104 |
| [`renderCatalogueRecord`](../../interface/application.js#L2108) | 2108 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2113) | 2113 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2132) | 2132 |
| [`add`](../../interface/application.js#L2134) | 2134 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2179) | 2179 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2186) | 2186 |
| [`openHardwareModelManager`](../../interface/application.js#L2198) | 2198 |
| [`opts`](../../interface/application.js#L2203) | 2203 |
| [`saveHardwareModel`](../../interface/application.js#L2221) | 2221 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2250) | 2250 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2264) | 2264 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2286) | 2286 |
| [`add`](../../interface/application.js#L2288) | 2288 |
| [`options`](../../interface/application.js#L2324) | 2324 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2338) | 2338 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2353) | 2353 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2368) | 2368 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2376) | 2376 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2387) | 2387 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2396) | 2396 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2418) | 2418 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2429) | 2429 |
| [`openServerServiceEditor`](../../interface/application.js#L2446) | 2446 |
| [`saveServerServiceEntry`](../../interface/application.js#L2455) | 2455 |
| [`restoreArchivedServerService`](../../interface/application.js#L2468) | 2468 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2477) | 2477 |
| [`renderDevicesHTML`](../../interface/application.js#L2489) | 2489 |
| [`renderHardwareMetric`](../../interface/application.js#L2497) | 2497 |
| [`renderHardwareChart`](../../interface/application.js#L2502) | 2502 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2512) | 2512 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2531) | 2531 |
| [`renderArchivedSoftware`](../../interface/application.js#L2539) | 2539 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2574) | 2574 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2581) | 2581 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2582) | 2582 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2583) | 2583 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2586) | 2586 |
| [`openManageTypesModal`](../../interface/application.js#L2602) | 2602 |
| [`openManageLocationsModal`](../../interface/application.js#L2603) | 2603 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2606) | 2606 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2628) | 2628 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2635) | 2635 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2643) | 2643 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2663) | 2663 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2664) | 2664 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2665) | 2665 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2680) | 2680 |
| [`deleteDeviceType`](../../interface/application.js#L2700) | 2700 |
| [`deleteDeviceLocation`](../../interface/application.js#L2701) | 2701 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2709) | 2709 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2713) | 2713 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2740) | 2740 |
| [`nodes`](../../interface/application.js#L2750) | 2750 |
| [`renderIpamManage`](../../interface/application.js#L2776) | 2776 |
| [`renderIpamHTML`](../../interface/application.js#L2827) | 2827 |
| [`changeSubnet`](../../interface/application.js#L2987) | 2987 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3000) | 3000 |
| [`openIpamModal`](../../interface/application.js#L3026) | 3026 |
| [`openBulkIpModal`](../../interface/application.js#L3031) | 3031 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3038) | 3038 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3042) | 3042 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3061) | 3061 |
| [`applyBulkIpChanges`](../../interface/application.js#L3077) | 3077 |
| [`subnetCidrFeedback`](../../interface/application.js#L3091) | 3091 |
| [`suggestSubnetGateway`](../../interface/application.js#L3109) | 3109 |
| [`openSubnetModal`](../../interface/application.js#L3137) | 3137 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3141) | 3141 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3167) | 3167 |
| [`handleSubnetSubmit`](../../interface/application.js#L3187) | 3187 |
| [`showSubnetFormError`](../../interface/application.js#L3394) | 3394 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3409) | 3409 |
| [`subnetNameConflicts`](../../interface/application.js#L3423) | 3423 |
| [`subnetHasVlan`](../../interface/application.js#L3430) | 3430 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3433) | 3433 |
| [`openMultipleSubnets`](../../interface/application.js#L3441) | 3441 |
| [`option`](../../interface/application.js#L3443) | 3443 |
| [`visibility`](../../interface/application.js#L3448) | 3448 |
| [`planningVisibility`](../../interface/application.js#L3452) | 3452 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3470) | 3470 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3482) | 3482 |
| [`read`](../../interface/application.js#L3484) | 3484 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3502) | 3502 |
| [`reject`](../../interface/application.js#L3504) | 3504 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3541) | 3541 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3545) | 3545 |
| [`add`](../../interface/application.js#L3548) | 3548 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3575) | 3575 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3582) | 3582 |
| [`field`](../../interface/application.js#L3585) | 3585 |
| [`capture`](../../interface/application.js#L3595) | 3595 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3629) | 3629 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3633) | 3633 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3639) | 3639 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3660) | 3660 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3664) | 3664 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3668) | 3668 |
| [`deleteSubnet`](../../interface/application.js#L3679) | 3679 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3739) | 3739 |
| [`deleteSubnetCommit`](../../interface/application.js#L3767) | 3767 |
| [`deleteVlan`](../../interface/application.js#L3797) | 3797 |
| [`openIpModal`](../../interface/application.js#L3823) | 3823 |
| [`handleIpSubmit`](../../interface/application.js#L3840) | 3840 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3906) | 3906 |
| [`modalFormSnapshot`](../../interface/application.js#L3916) | 3916 |
| [`rememberModalForm`](../../interface/application.js#L3921) | 3921 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3926) | 3926 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3945) | 3945 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3964) | 3964 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3973) | 3973 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3979) | 3979 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3985) | 3985 |
| [`closeModal`](../../interface/application.js#L3994) | 3994 |
| [`openModal`](../../interface/application.js#L4021) | 4021 |
| [`readRackDimension`](../../interface/application.js#L4094) | 4094 |
| [`formatRackDimension`](../../interface/application.js#L4101) | 4101 |
| [`rackPhysicalDetails`](../../interface/application.js#L4106) | 4106 |
| [`openRackModal`](../../interface/application.js#L4115) | 4115 |
| [`handleRackSubmit`](../../interface/application.js#L4131) | 4131 |
| [`deleteRack`](../../interface/application.js#L4198) | 4198 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4220) | 4220 |
| [`refresh`](../../interface/application.js#L4243) | 4243 |
| [`openAssignDeviceModal`](../../interface/application.js#L4320) | 4320 |
| [`refresh`](../../interface/application.js#L4337) | 4337 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4344) | 4344 |
| [`handleAssignSubmit`](../../interface/application.js#L4378) | 4378 |
| [`unassignDevice`](../../interface/application.js#L4423) | 4423 |
| [`getSubnetForIp`](../../interface/application.js#L4440) | 4440 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4444) | 4444 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4491) | 4491 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4500) | 4500 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4509) | 4509 |
| [`inside`](../../interface/application.js#L4516) | 4516 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4534) | 4534 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4543) | 4543 |
| [`toggleDeviceMountType`](../../interface/application.js#L4587) | 4587 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4611) | 4611 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4616) | 4616 |
| [`openDeviceReviewModal`](../../interface/application.js#L4634) | 4634 |
| [`openDeviceDetailView`](../../interface/application.js#L4639) | 4639 |
| [`safe`](../../interface/application.js#L4649) | 4649 |
| [`field`](../../interface/application.js#L4650) | 4650 |
| [`section`](../../interface/application.js#L4651) | 4651 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4696) | 4696 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4702) | 4702 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4721) | 4721 |
| [`navigateToDeviceRack`](../../interface/application.js#L4737) | 4737 |
| [`duplicateDevice`](../../interface/application.js#L4765) | 4765 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4835) | 4835 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4840) | 4840 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4845) | 4845 |
| [`openServerServiceManager`](../../interface/application.js#L4846) | 4846 |
| [`captureServerServiceSelections`](../../interface/application.js#L4851) | 4851 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4857) | 4857 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4878) | 4878 |
| [`archiveServerService`](../../interface/application.js#L4886) | 4886 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4910) | 4910 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4914) | 4914 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4932) | 4932 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4936) | 4936 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4939) | 4939 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4946) | 4946 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4974) | 4974 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4978) | 4978 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5023) | 5023 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5057) | 5057 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5074) | 5074 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5077) | 5077 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5078) | 5078 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5083) | 5083 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5089) | 5089 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5126) | 5126 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5127) | 5127 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5134) | 5134 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5135) | 5135 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5150) | 5150 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5156) | 5156 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5179) | 5179 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5195) | 5195 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5198) | 5198 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5207) | 5207 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5218) | 5218 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5227) | 5227 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5230) | 5230 |
| [`isSoftwareDetailField`](../../interface/application.js#L5237) | 5237 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5245) | 5245 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5254) | 5254 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5260) | 5260 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5272) | 5272 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5311) | 5311 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5339) | 5339 |
| [`updateInlinePickerCount`](../../interface/application.js#L5348) | 5348 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5354) | 5354 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5367) | 5367 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5376) | 5376 |
| [`fail`](../../interface/application.js#L5382) | 5382 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5436) | 5436 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5452) | 5452 |
| [`fail`](../../interface/application.js#L5457) | 5457 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5504) | 5504 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5534) | 5534 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5540) | 5540 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5906) | 5906 |
| [`isWindowsPlatform`](../../interface/application.js#L5909) | 5909 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5913) | 5913 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5916) | 5916 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5920) | 5920 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5937) | 5937 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5941) | 5941 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5961) | 5961 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L5988) | 5988 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6037) | 6037 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6045) | 6045 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6056) | 6056 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6060) | 6060 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6072) | 6072 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6083) | 6083 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6110) | 6110 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6114) | 6114 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6118) | 6118 |
| [`getDefaultMountType`](../../interface/application.js#L6131) | 6131 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6134) | 6134 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6139) | 6139 |
| [`initialiseNotesEditor`](../../interface/application.js#L6152) | 6152 |
| [`inlineMarkdown`](../../interface/application.js#L6157) | 6157 |
| [`render`](../../interface/application.js#L6170) | 6170 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6204) | 6204 |
| [`activate`](../../interface/application.js#L6598) | 6598 |
| [`openDeviceModal`](../../interface/application.js#L6679) | 6679 |
| [`syncVmPurpose`](../../interface/application.js#L6727) | 6727 |
| [`clearFieldError`](../../interface/application.js#L6788) | 6788 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6807) | 6807 |
| [`createRackFromDevice`](../../interface/application.js#L6842) | 6842 |
| [`cancelRackFromDevice`](../../interface/application.js#L6850) | 6850 |
| [`createSubnetFromDevice`](../../interface/application.js#L6860) | 6860 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6873) | 6873 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6887) | 6887 |
| [`addCustomLocationOption`](../../interface/application.js#L6899) | 6899 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6939) | 6939 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6951) | 6951 |
| [`finish`](../../interface/application.js#L6971) | 6971 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L6996) | 6996 |
| [`finish`](../../interface/application.js#L7010) | 7010 |
| [`handleDeviceSubmit`](../../interface/application.js#L7030) | 7030 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7070) | 7070 |
| [`deleteDevice`](../../interface/application.js#L7219) | 7219 |
| [`personalSafeStorageGet`](../../interface/application.js#L7276) | 7276 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7281) | 7281 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7291) | 7291 |
| [`button`](../../interface/application.js#L7292) | 7292 |
| [`themeChoice`](../../interface/application.js#L7296) | 7296 |
| [`guideLinks`](../../interface/application.js#L7313) | 7313 |
| [`loadSmtpSettings`](../../interface/application.js#L7344) | 7344 |
| [`renderApplicationSettings`](../../interface/application.js#L7359) | 7359 |
| [`syncSmtpForm`](../../interface/application.js#L7363) | 7363 |
| [`updateSmtpFields`](../../interface/application.js#L7385) | 7385 |
| [`hydrateSettings`](../../interface/application.js#L7398) | 7398 |
| [`caffootCompareVersions`](../../interface/application.js#L7419) | 7419 |
| [`parse`](../../interface/application.js#L7420) | 7420 |
| [`caffootShowLicences`](../../interface/application.js#L7442) | 7442 |
| [`caffootUpdateGuide`](../../interface/application.js#L7447) | 7447 |
| [`caffootCheckUpdates`](../../interface/application.js#L7452) | 7452 |
| [`checkInventorySafety`](../../interface/application.js#L7483) | 7483 |
| [`requestInventoryReset`](../../interface/application.js#L7506) | 7506 |
| [`createInventoryBackup`](../../interface/application.js#L7533) | 7533 |
| [`validateBackupVersion`](../../interface/application.js#L7545) | 7545 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7560) | 7560 |
| [`exportData`](../../interface/application.js#L7568) | 7568 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7581) | 7581 |
| [`validateBackupStructure`](../../interface/application.js#L7596) | 7596 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7613) | 7613 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7625) | 7625 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7664) | 7664 |
| [`findRackImportConflicts`](../../interface/application.js#L7668) | 7668 |
| [`place`](../../interface/application.js#L7674) | 7674 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7720) | 7720 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7741) | 7741 |
| [`showBackupImportError`](../../interface/application.js#L7746) | 7746 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7750) | 7750 |
| [`finish`](../../interface/application.js#L7760) | 7760 |
| [`onClick`](../../interface/application.js#L7769) | 7769 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7779) | 7779 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7790) | 7790 |
| [`finish`](../../interface/application.js#L7801) | 7801 |
| [`onClick`](../../interface/application.js#L7810) | 7810 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7825) | 7825 |
| [`importData`](../../interface/application.js#L7841) | 7841 |
| [`reader.onload`](../../interface/application.js#L7851) | 7851 |
| [`reader.onerror`](../../interface/application.js#L7925) | 7925 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8052) | 8052 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8068) | 8068 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8079) | 8079 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8113) | 8113 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8171) | 8171 |
| [`cancel`](../../interface/application.js#L8184) | 8184 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8200) | 8200 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8217) | 8217 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8242) | 8242 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8256) | 8256 |
| [`clearRackDropPreview`](../../interface/application.js#L8259) | 8259 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8264) | 8264 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8276) | 8276 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8282) | 8282 |
| [`trackRackDrag`](../../interface/application.js#L8291) | 8291 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8322) | 8322 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8332) | 8332 |
| [`getRackDropPosition`](../../interface/application.js#L8425) | 8425 |
| [`window.onload`](../../interface/application.js#L8878) | 8878 |
| [`refreshCentralInventory`](../../interface/application.js#L8894) | 8894 |
| [`postInventory`](../../interface/application.js#L8916) | 8916 |
| [`isBlockedAction`](../../interface/application.js#L8968) | 8968 |
| [`applyAllowedControls`](../../interface/application.js#L9001) | 9001 |
| [`enhanceLongSelects`](../../interface/application.js#L9060) | 9060 |
| [`sync`](../../interface/application.js#L9111) | 9111 |
| [`close`](../../interface/application.js#L9117) | 9117 |
| [`choose`](../../interface/application.js#L9121) | 9121 |
| [`draw`](../../interface/application.js#L9126) | 9126 |
| [`open`](../../interface/application.js#L9144) | 9144 |
| [`enhanceSelects`](../../interface/application.js#L9201) | 9201 |
| [`switchTab`](../../interface/application.js#L9247) | 9247 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9258) | 9258 |
| [`openDeviceDetailView`](../../interface/application.js#L9284) | 9284 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9292) | 9292 |
| [`forbidRackMount`](../../interface/application.js#L9341) | 9341 |
| [`openDeviceModal`](../../interface/application.js#L9351) | 9351 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9389) | 9389 |
| [`relatedChanges`](../../interface/application.js#L9395) | 9395 |
| [`saveDevice`](../../interface/application.js#L9406) | 9406 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9433) | 9433 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9434) | 9434 |
| [`nextIpamBridge.save`](../../interface/application.js#L9456) | 9456 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9478) | 9478 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9500) | 9500 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9535) | 9535 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9552) | 9552 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9553) | 9553 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9554) | 9554 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9568) | 9568 |
| [`nextResetBridge.reset`](../../interface/application.js#L9599) | 9599 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9626) | 9626 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9653) | 9653 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9661) | 9661 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9670) | 9670 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9671) | 9671 |
| [`nextRackBridge.save`](../../interface/application.js#L9706) | 9706 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9709) | 9709 |
| [`nextRackBridge.persist`](../../interface/application.js#L9712) | 9712 |
| [`reserveForDelete`](../../interface/application.js#L9734) | 9734 |
| [`removeDevice`](../../interface/application.js#L9742) | 9742 |
| [`cancelDelete`](../../interface/application.js#L9768) | 9768 |
| [`saveArchivedInstallation`](../../interface/application.js#L9774) | 9774 |
| [`renderAccountSections`](../../interface/application.js#L9811) | 9811 |
| [`renderAccountMfaPanel`](../../interface/application.js#L9839) | 9839 |
| [`nextRenderAccount`](../../interface/application.js#L9850) | 9850 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L9860) | 9860 |
| [`closeEmailVerification`](../../interface/application.js#L9884) | 9884 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L9891) | 9891 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L9902) | 9902 |
| [`hydrateAccount`](../../interface/application.js#L9956) | 9956 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L9994) | 9994 |
| [`loadAccountProfile`](../../interface/application.js#L10007) | 10007 |
| [`removeAccountPhoto`](../../interface/application.js#L10023) | 10023 |
| [`permissionLabel`](../../interface/application.js#L10035) | 10035 |
| [`accountMfaLabel`](../../interface/application.js#L10038) | 10038 |
| [`renderRoleMemberships`](../../interface/application.js#L10041) | 10041 |
| [`renderRoleCatalogue`](../../interface/application.js#L10047) | 10047 |
| [`openRoleLayer`](../../interface/application.js#L10052) | 10052 |
| [`closeRoleLayer`](../../interface/application.js#L10063) | 10063 |
| [`renderRoleDefinition`](../../interface/application.js#L10069) | 10069 |
| [`renderRoleImpact`](../../interface/application.js#L10073) | 10073 |
| [`access`](../../interface/application.js#L10078) | 10078 |
| [`state`](../../interface/application.js#L10082) | 10082 |
| [`requestRoleChange`](../../interface/application.js#L10087) | 10087 |
| [`roleNotificationMessage`](../../interface/application.js#L10094) | 10094 |
| [`previewRoleAction`](../../interface/application.js#L10098) | 10098 |
| [`openRoleEditor`](../../interface/application.js#L10103) | 10103 |
| [`nextRenderUsers`](../../interface/application.js#L10166) | 10166 |
| [`profileFields`](../../interface/application.js#L10168) | 10168 |
| [`stat`](../../interface/application.js#L10189) | 10189 |
| [`bars`](../../interface/application.js#L10192) | 10192 |
| [`operation`](../../interface/application.js#L10248) | 10248 |
| [`filterUserRows`](../../interface/application.js#L10268) | 10268 |
| [`closeUserWorkspace`](../../interface/application.js#L10292) | 10292 |
| [`loadCentralUsers`](../../interface/application.js#L10321) | 10321 |
| [`changeCentralUser`](../../interface/application.js#L10327) | 10327 |
| [`importPanel`](../../interface/application.js#L10338) | 10338 |
| [`cancelImport`](../../interface/application.js#L10342) | 10342 |
| [`nextImportModalClosed`](../../interface/application.js#L10348) | 10348 |
| [`showImportReview`](../../interface/application.js#L10349) | 10349 |
| [`chooseImportFile`](../../interface/application.js#L10389) | 10389 |
| [`actOnImport`](../../interface/application.js#L10406) | 10406 |

## interface/sign-in.js

| Function | Line |
| --- | ---: |
| [`$`](../../interface/sign-in.js#L2) | 2 |
| [`applySignInTheme`](../../interface/sign-in.js#L5) | 5 |
| [`showMfaQr`](../../interface/sign-in.js#L21) | 21 |
| [`showSession`](../../interface/sign-in.js#L30) | 30 |
| [`request`](../../interface/sign-in.js#L40) | 40 |
| [`display`](../../interface/sign-in.js#L44) | 44 |
| [`showRecoveryFeedback`](../../interface/sign-in.js#L156) | 156 |
| [`resetRecoveryFlow`](../../interface/sign-in.js#L161) | 161 |
| [`clearRequiredMfaDisplay`](../../interface/sign-in.js#L218) | 218 |

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
| [`hash_password`](../../backend/accounts.py#L15) | 15 |
| [`verify_password`](../../backend/accounts.py#L23) | 23 |
| [`bootstrap_first_admin`](../../backend/accounts.py#L42) | 42 |
| [`confirm_admin_mfa`](../../backend/accounts.py#L66) | 66 |

## backend/application_integrity.py

| Function | Line |
| --- | ---: |
| [`validate_detached_application_state`](../../backend/application_integrity.py#L15) | 15 |
| [`validate_live_application_state`](../../backend/application_integrity.py#L118) | 118 |

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

## backend/device_catalogue.py

| Function | Line |
| --- | ---: |
| [`change_device_catalogue`](../../backend/device_catalogue.py#L15) | 15 |

## backend/device_saves.py

| Function | Line |
| --- | ---: |
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L26) | 26 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L45) | 45 |
| [`_persist_related_guests`](../../backend/device_saves.py#L89) | 89 |
| [`save_reserved_device`](../../backend/device_saves.py#L102) | 102 |
| [`create_device`](../../backend/device_saves.py#L241) | 241 |
| [`delete_reserved_device`](../../backend/device_saves.py#L320) | 320 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](../../backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](../../backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](../../backend/feature_settings.py#L28) | 28 |

## backend/inventory_projection.py

| Function | Line |
| --- | ---: |
| [`project_inventory_response`](../../backend/inventory_projection.py#L6) | 6 |

## backend/device_addresses.py

| Function | Line |
| --- | ---: |
| [`is_basic_address`](../../backend/device_addresses.py#L6) | 6 |
| [`prepare_device_address`](../../backend/device_addresses.py#L10) | 10 |
| [`basic_address_errors`](../../backend/device_addresses.py#L37) | 37 |

## backend/ipam_linking.py

| Function | Line |
| --- | ---: |
| [`unique_link_fields`](../../backend/ipam_linking.py#L16) | 16 |
| [`link_device_to_ipam`](../../backend/ipam_linking.py#L26) | 26 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_subnet_batch_reason`](../../backend/history_permissions.py#L31) | 31 |
| [`visible_change_history`](../../backend/history_permissions.py#L59) | 59 |

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
| [`_json`](../../backend/inventory.py#L30) | 30 |
| [`_check_keys`](../../backend/inventory.py#L34) | 34 |
| [`_unique_object`](../../backend/inventory.py#L45) | 45 |
| [`_reject_nonfinite`](../../backend/inventory.py#L54) | 54 |
| [`validate_published_structure`](../../backend/inventory.py#L58) | 58 |
| [`inspect_export`](../../backend/inventory.py#L82) | 82 |
| [`inspect_device_mounts`](../../backend/inventory.py#L133) | 133 |
| [`inspect_import_relationships`](../../backend/inventory.py#L147) | 147 |
| [`preview_inventory_counts`](../../backend/inventory.py#L191) | 191 |
| [`preview_inventory_counts.counts`](../../backend/inventory.py#L197) | 197 |
| [`_write_detached`](../../backend/inventory.py#L213) | 213 |
| [`stage_inventory`](../../backend/inventory.py#L259) | 259 |
| [`reconstruct_inventory`](../../backend/inventory.py#L275) | 275 |

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
| [`_admin`](../../backend/permissions.py#L11) | 11 |
| [`_target`](../../backend/permissions.py#L20) | 20 |
| [`create_user`](../../backend/permissions.py#L29) | 29 |
| [`set_permission`](../../backend/permissions.py#L62) | 62 |
| [`can_access`](../../backend/permissions.py#L73) | 73 |
| [`feature_enabled`](../../backend/permissions.py#L78) | 78 |
| [`set_account_active`](../../backend/permissions.py#L88) | 88 |
| [`delete_user`](../../backend/permissions.py#L127) | 127 |
| [`set_administrator`](../../backend/permissions.py#L155) | 155 |
| [`can_replace_inventory`](../../backend/permissions.py#L196) | 196 |

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
| [`reset_inventory`](../../backend/reset_inventory.py#L13) | 13 |

## backend/role_policy.py

| Function | Line |
| --- | ---: |
| [`AccountRolePolicy.allows`](../../backend/role_policy.py#L20) | 20 |
| [`evaluate_role_policy`](../../backend/role_policy.py#L32) | 32 |
| [`assign_staff_member`](../../backend/role_policy.py#L74) | 74 |

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
| [`initialise_database`](../../backend/schema.py#L56) | 56 |
| [`migrate_role_permissions`](../../backend/schema.py#L219) | 219 |
| [`verify_role_migration`](../../backend/schema.py#L304) | 304 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L330) | 330 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L83) | 83 |
| [`connect`](../../backend/server.py#L101) | 101 |
| [`initialise_database`](../../backend/server.py#L109) | 109 |
| [`Handler.end_headers`](../../backend/server.py#L115) | 115 |
| [`Handler.do_GET`](../../backend/server.py#L122) | 122 |
| [`Handler.do_POST`](../../backend/server.py#L461) | 461 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L635) | 635 |
| [`Handler.handle_role_change`](../../backend/server.py#L678) | 678 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L720) | 720 |
| [`Handler.handle_account_email`](../../backend/server.py#L1112) | 1112 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1192) | 1192 |
| [`Handler.handle_import`](../../backend/server.py#L1223) | 1223 |
| [`Handler.respond`](../../backend/server.py#L1299) | 1299 |
| [`main`](../../backend/server.py#L1312) | 1312 |

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
