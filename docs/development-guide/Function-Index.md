# Caffoot Lite — Function Index

This is the current function map for the modular Issue #282 source tree in the same commit as this index. It replaces the older HTML-only navigation map; the [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains available in history.

The map lists named JavaScript declarations and named function/arrow assignments in the three application scripts, plus Python functions and methods in `backend/`. Tests, anonymous callbacks, third-party QR code code and generated HTML fragments are excluded. Nested Python functions include their enclosing names. It is a declaration map, not a call graph or permission to remove a function. Read event dispatch, aliases and API callers before changing code.

**Recorded definitions: 597.** The links refer to the current branch files and line positions. Regenerate after moving or renaming functions. See [Modular Interface](Modular-Interface.md) and the [Function And Code Reference](07-Function-and-Code-Reference.md).

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
| [`cloneDefaultData`](../../interface/application.js#L18) | 18 |
| [`isPlainObject`](../../interface/application.js#L22) | 22 |
| [`isValidIpv4`](../../interface/application.js#L26) | 26 |
| [`parseIpv4AddressToNumber`](../../interface/application.js#L36) | 36 |
| [`formatIpv4Address`](../../interface/application.js#L40) | 40 |
| [`parseSupportedIpv4Subnet`](../../interface/application.js#L43) | 43 |
| [`isUsableHostAddressInSubnet`](../../interface/application.js#L52) | 52 |
| [`isValidCidr24`](../../interface/application.js#L56) | 56 |
| [`hierarchyIpNumber`](../../interface/application.js#L60) | 60 |
| [`hierarchyIpString`](../../interface/application.js#L65) | 65 |
| [`hierarchyParseCidr`](../../interface/application.js#L66) | 66 |
| [`hierarchyValidate`](../../interface/application.js#L74) | 74 |
| [`ancestor`](../../interface/application.js#L114) | 114 |
| [`hierarchyValidateTypes`](../../interface/application.js#L134) | 134 |
| [`previewLegacyVlanOwnershipInApp`](../../interface/application.js#L164) | 164 |
| [`reconcileLegacyVlanOwnership`](../../interface/application.js#L178) | 178 |
| [`migrateLegacyRackLocation`](../../interface/application.js#L216) | 216 |
| [`normaliseLegacyRackAccessoryTypes`](../../interface/application.js#L230) | 230 |
| [`normaliseState`](../../interface/application.js#L237) | 237 |
| [`validateApplicationState`](../../interface/application.js#L401) | 401 |
| [`loadStoredState`](../../interface/application.js#L464) | 464 |
| [`showStorageRecoveryBanner`](../../interface/application.js#L470) | 470 |
| [`download.onclick`](../../interface/application.js#L485) | 485 |
| [`reset.onclick`](../../interface/application.js#L494) | 494 |
| [`caffootThemePreference`](../../interface/application.js#L529) | 529 |
| [`caffootApplyTheme`](../../interface/application.js#L536) | 536 |
| [`caffootSetTheme`](../../interface/application.js#L542) | 542 |
| [`onSystemThemeChange`](../../interface/application.js#L553) | 553 |
| [`toggleDarkMode`](../../interface/application.js#L562) | 562 |
| [`readAuditHistory`](../../interface/application.js#L569) | 569 |
| [`auditChanges`](../../interface/application.js#L573) | 573 |
| [`recordAudit`](../../interface/application.js#L610) | 610 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L619) | 619 |
| [`exportAuditHistory`](../../interface/application.js#L631) | 631 |
| [`auditVisibleRows`](../../interface/application.js#L643) | 643 |
| [`auditDate`](../../interface/application.js#L665) | 665 |
| [`renderAuditHTML`](../../interface/application.js#L669) | 669 |
| [`hydrateApprovedAudit`](../../interface/application.js#L702) | 702 |
| [`applyApprovedAuditFilters`](../../interface/application.js#L710) | 710 |
| [`closeApprovedAuditDetail`](../../interface/application.js#L745) | 745 |
| [`showApprovedAuditDetail`](../../interface/application.js#L751) | 751 |
| [`nextRenderUsers`](../../interface/application.js#L778) | 778 |
| [`nextRenderAccount`](../../interface/application.js#L780) | 780 |
| [`nextHydrateAccount`](../../interface/application.js#L781) | 781 |
| [`nextRemoveAccountPhoto`](../../interface/application.js#L782) | 782 |
| [`saveState`](../../interface/application.js#L785) | 785 |
| [`getDeviceById`](../../interface/application.js#L788) | 788 |
| [`findDeviceUsingIp`](../../interface/application.js#L792) | 792 |
| [`setDevicePrimaryIp`](../../interface/application.js#L797) | 797 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L850) | 850 |
| [`validateRackPlacement`](../../interface/application.js#L863) | 863 |
| [`showToast`](../../interface/application.js#L898) | 898 |
| [`toggleApprovedSidebar`](../../interface/application.js#L984) | 984 |
| [`switchTab`](../../interface/application.js#L1003) | 1003 |
| [`escapeHtml`](../../interface/application.js#L1029) | 1029 |
| [`inlineJsArg`](../../interface/application.js#L1038) | 1038 |
| [`browserStorageWarning`](../../interface/application.js#L1046) | 1046 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1049) | 1049 |
| [`renderApprovedSectionHeader`](../../interface/application.js#L1057) | 1057 |
| [`tab`](../../interface/application.js#L1058) | 1058 |
| [`renderContent`](../../interface/application.js#L1084) | 1084 |
| [`updateScrollHint`](../../interface/application.js#L1109) | 1109 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1120) | 1120 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1155) | 1155 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1159) | 1159 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1163) | 1163 |
| [`buildInventoryReportData`](../../interface/application.js#L1169) | 1169 |
| [`occupancy`](../../interface/application.js#L1185) | 1185 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1208) | 1208 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1214) | 1214 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1240) | 1240 |
| [`renderDashboardHTML`](../../interface/application.js#L1259) | 1259 |
| [`statusPill`](../../interface/application.js#L1362) | 1362 |
| [`insightSegment`](../../interface/application.js#L1379) | 1379 |
| [`getCategoryIcon`](../../interface/application.js#L1420) | 1420 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1435) | 1435 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1444) | 1444 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1449) | 1449 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1464) | 1464 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1479) | 1479 |
| [`printRackElevation`](../../interface/application.js#L1489) | 1489 |
| [`safe`](../../interface/application.js#L1494) | 1494 |
| [`renderRackHubV13`](../../interface/application.js#L1518) | 1518 |
| [`card`](../../interface/application.js#L1523) | 1523 |
| [`mark`](../../interface/application.js#L1532) | 1532 |
| [`bar`](../../interface/application.js#L1548) | 1548 |
| [`chartBox`](../../interface/application.js#L1549) | 1549 |
| [`chartRows`](../../interface/application.js#L1550) | 1550 |
| [`rackSpaceGuide`](../../interface/application.js#L1552) | 1552 |
| [`renderRacksHTML`](../../interface/application.js#L1621) | 1621 |
| [`changeRack`](../../interface/application.js#L1688) | 1688 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1707) | 1707 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1714) | 1714 |
| [`getVisibleDevices`](../../interface/application.js#L1720) | 1720 |
| [`filterHardwareModels`](../../interface/application.js#L1745) | 1745 |
| [`openApprovedCatalogueModal`](../../interface/application.js#L1775) | 1775 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1784) | 1784 |
| [`saveHardwareManufacturer`](../../interface/application.js#L1808) | 1808 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L1846) | 1846 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L1858) | 1858 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L1874) | 1874 |
| [`add`](../../interface/application.js#L1876) | 1876 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L1913) | 1913 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L1920) | 1920 |
| [`openHardwareModelManager`](../../interface/application.js#L1932) | 1932 |
| [`opts`](../../interface/application.js#L1937) | 1937 |
| [`saveHardwareModel`](../../interface/application.js#L1955) | 1955 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L1984) | 1984 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L1998) | 1998 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2020) | 2020 |
| [`add`](../../interface/application.js#L2022) | 2022 |
| [`optionList`](../../interface/application.js#L2059) | 2059 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2065) | 2065 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2078) | 2078 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2093) | 2093 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2101) | 2101 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2112) | 2112 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2121) | 2121 |
| [`card`](../../interface/application.js#L2132) | 2132 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2137) | 2137 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2148) | 2148 |
| [`openServerServiceEditor`](../../interface/application.js#L2165) | 2165 |
| [`saveServerServiceEntry`](../../interface/application.js#L2174) | 2174 |
| [`restoreArchivedServerService`](../../interface/application.js#L2187) | 2187 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2196) | 2196 |
| [`renderDevicesHTML`](../../interface/application.js#L2208) | 2208 |
| [`approvedHardwareMetric`](../../interface/application.js#L2215) | 2215 |
| [`approvedHardwareChart`](../../interface/application.js#L2220) | 2220 |
| [`approvedDeviceInsightChart`](../../interface/application.js#L2230) | 2230 |
| [`approvedDeviceQualityCards`](../../interface/application.js#L2249) | 2249 |
| [`approvedArchivedSoftwareHtml`](../../interface/application.js#L2257) | 2257 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2306) | 2306 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2313) | 2313 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2314) | 2314 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2315) | 2315 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2318) | 2318 |
| [`openManageTypesModal`](../../interface/application.js#L2334) | 2334 |
| [`openManageLocationsModal`](../../interface/application.js#L2335) | 2335 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2338) | 2338 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2360) | 2360 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2367) | 2367 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2375) | 2375 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2395) | 2395 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2396) | 2396 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2397) | 2397 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2412) | 2412 |
| [`deleteDeviceType`](../../interface/application.js#L2432) | 2432 |
| [`deleteDeviceLocation`](../../interface/application.js#L2433) | 2433 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2441) | 2441 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2445) | 2445 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2471) | 2471 |
| [`nodes`](../../interface/application.js#L2481) | 2481 |
| [`renderApprovedIpamManage`](../../interface/application.js#L2507) | 2507 |
| [`renderIpamHTML`](../../interface/application.js#L2557) | 2557 |
| [`changeSubnet`](../../interface/application.js#L2716) | 2716 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2729) | 2729 |
| [`openApprovedIpamModal`](../../interface/application.js#L2755) | 2755 |
| [`openBulkIpModal`](../../interface/application.js#L2760) | 2760 |
| [`approvedBulkConfirm`](../../interface/application.js#L2767) | 2767 |
| [`handleBulkIpSubmit`](../../interface/application.js#L2771) | 2771 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L2790) | 2790 |
| [`applyBulkIpChanges`](../../interface/application.js#L2806) | 2806 |
| [`subnetCidrFeedback`](../../interface/application.js#L2820) | 2820 |
| [`suggestSubnetGateway`](../../interface/application.js#L2838) | 2838 |
| [`openSubnetModal`](../../interface/application.js#L2866) | 2866 |
| [`updateSubnetTypePreview`](../../interface/application.js#L2870) | 2870 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L2894) | 2894 |
| [`handleSubnetSubmit`](../../interface/application.js#L2914) | 2914 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3107) | 3107 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3111) | 3111 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3116) | 3116 |
| [`approvedDeletionBlocked`](../../interface/application.js#L3137) | 3137 |
| [`approvedDeletionConfirm`](../../interface/application.js#L3141) | 3141 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3145) | 3145 |
| [`deleteSubnet`](../../interface/application.js#L3156) | 3156 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3216) | 3216 |
| [`deleteSubnetCommit`](../../interface/application.js#L3244) | 3244 |
| [`deleteVlan`](../../interface/application.js#L3274) | 3274 |
| [`openIpModal`](../../interface/application.js#L3300) | 3300 |
| [`handleIpSubmit`](../../interface/application.js#L3317) | 3317 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3383) | 3383 |
| [`modalFormSnapshot`](../../interface/application.js#L3393) | 3393 |
| [`rememberModalForm`](../../interface/application.js#L3398) | 3398 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3403) | 3403 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3422) | 3422 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3441) | 3441 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3450) | 3450 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3456) | 3456 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3462) | 3462 |
| [`closeModal`](../../interface/application.js#L3471) | 3471 |
| [`openModal`](../../interface/application.js#L3496) | 3496 |
| [`rackPhysicalDetails`](../../interface/application.js#L3566) | 3566 |
| [`dimension`](../../interface/application.js#L3567) | 3567 |
| [`openRackModal`](../../interface/application.js#L3580) | 3580 |
| [`handleRackSubmit`](../../interface/application.js#L3596) | 3596 |
| [`deleteRack`](../../interface/application.js#L3663) | 3663 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3685) | 3685 |
| [`refresh`](../../interface/application.js#L3708) | 3708 |
| [`openAssignDeviceModal`](../../interface/application.js#L3785) | 3785 |
| [`refresh`](../../interface/application.js#L3802) | 3802 |
| [`refreshAssignStartPositions`](../../interface/application.js#L3809) | 3809 |
| [`handleAssignSubmit`](../../interface/application.js#L3843) | 3843 |
| [`unassignDevice`](../../interface/application.js#L3888) | 3888 |
| [`getSubnetForIp`](../../interface/application.js#L3905) | 3905 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L3909) | 3909 |
| [`handleDeviceIpSelection`](../../interface/application.js#L3953) | 3953 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L3962) | 3962 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L3971) | 3971 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L3993) | 3993 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4003) | 4003 |
| [`toggleDeviceMountType`](../../interface/application.js#L4047) | 4047 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4068) | 4068 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4073) | 4073 |
| [`openApprovedDeviceReviewModal`](../../interface/application.js#L4091) | 4091 |
| [`openDeviceDetailView`](../../interface/application.js#L4096) | 4096 |
| [`safe`](../../interface/application.js#L4106) | 4106 |
| [`field`](../../interface/application.js#L4107) | 4107 |
| [`section`](../../interface/application.js#L4108) | 4108 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4151) | 4151 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4157) | 4157 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4176) | 4176 |
| [`navigateToDeviceRack`](../../interface/application.js#L4192) | 4192 |
| [`duplicateDevice`](../../interface/application.js#L4220) | 4220 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4290) | 4290 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4295) | 4295 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4300) | 4300 |
| [`openServerServiceManager`](../../interface/application.js#L4301) | 4301 |
| [`captureServerServiceSelections`](../../interface/application.js#L4306) | 4306 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4312) | 4312 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4333) | 4333 |
| [`archiveServerService`](../../interface/application.js#L4341) | 4341 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4365) | 4365 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4369) | 4369 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4387) | 4387 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4391) | 4391 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4394) | 4394 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4401) | 4401 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4429) | 4429 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4433) | 4433 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4474) | 4474 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4507) | 4507 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4524) | 4524 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4527) | 4527 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4528) | 4528 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4533) | 4533 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4539) | 4539 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4575) | 4575 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4576) | 4576 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4583) | 4583 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4584) | 4584 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4595) | 4595 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4599) | 4599 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4602) | 4602 |
| [`isSoftwareDetailField`](../../interface/application.js#L4609) | 4609 |
| [`renderApprovedInlineDevicePicker`](../../interface/application.js#L4616) | 4616 |
| [`updateApprovedInlinePickerCount`](../../interface/application.js#L4626) | 4626 |
| [`openApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4632) | 4632 |
| [`cancelApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4645) | 4645 |
| [`saveApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4654) | 4654 |
| [`fail`](../../interface/application.js#L4660) | 4660 |
| [`renderApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4712) | 4712 |
| [`saveApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4728) | 4728 |
| [`fail`](../../interface/application.js#L4733) | 4733 |
| [`renderDeviceDetailFields`](../../interface/application.js#L4780) | 4780 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L4810) | 4810 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L4816) | 4816 |
| [`getPlatformVersionOptions`](../../interface/application.js#L4836) | 4836 |
| [`isWindowsPlatform`](../../interface/application.js#L4839) | 4839 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L4842) | 4842 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L4851) | 4851 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L4881) | 4881 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L4889) | 4889 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L4899) | 4899 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L4903) | 4903 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L4910) | 4910 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L4921) | 4921 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L4945) | 4945 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L4949) | 4949 |
| [`getSuggestedMountTypes`](../../interface/application.js#L4953) | 4953 |
| [`getDefaultMountType`](../../interface/application.js#L4966) | 4966 |
| [`renderDeviceMountOptions`](../../interface/application.js#L4969) | 4969 |
| [`updateDeviceMountChoices`](../../interface/application.js#L4974) | 4974 |
| [`initialiseNotesEditor`](../../interface/application.js#L4987) | 4987 |
| [`inlineMarkdown`](../../interface/application.js#L4992) | 4992 |
| [`render`](../../interface/application.js#L5005) | 5005 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5039) | 5039 |
| [`activate`](../../interface/application.js#L5303) | 5303 |
| [`openDeviceModal`](../../interface/application.js#L5359) | 5359 |
| [`syncVmPurpose`](../../interface/application.js#L5390) | 5390 |
| [`clearFieldError`](../../interface/application.js#L5439) | 5439 |
| [`captureDeviceFormDraft`](../../interface/application.js#L5458) | 5458 |
| [`createRackFromDevice`](../../interface/application.js#L5488) | 5488 |
| [`cancelRackFromDevice`](../../interface/application.js#L5496) | 5496 |
| [`createSubnetFromDevice`](../../interface/application.js#L5506) | 5506 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L5519) | 5519 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L5533) | 5533 |
| [`addCustomLocationOption`](../../interface/application.js#L5544) | 5544 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L5582) | 5582 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L5594) | 5594 |
| [`finish`](../../interface/application.js#L5614) | 5614 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L5639) | 5639 |
| [`finish`](../../interface/application.js#L5653) | 5653 |
| [`handleDeviceSubmit`](../../interface/application.js#L5673) | 5673 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L5712) | 5712 |
| [`deleteDevice`](../../interface/application.js#L5844) | 5844 |
| [`personalSafeStorageGet`](../../interface/application.js#L5901) | 5901 |
| [`openBackupExplanationDialog`](../../interface/application.js#L5906) | 5906 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L5916) | 5916 |
| [`button`](../../interface/application.js#L5917) | 5917 |
| [`themeChoice`](../../interface/application.js#L5921) | 5921 |
| [`guideLinks`](../../interface/application.js#L5938) | 5938 |
| [`loadApprovedSmtpSettings`](../../interface/application.js#L5969) | 5969 |
| [`renderApplicationSettings`](../../interface/application.js#L5984) | 5984 |
| [`syncSmtpForm`](../../interface/application.js#L5988) | 5988 |
| [`updateApprovedSmtpFields`](../../interface/application.js#L6010) | 6010 |
| [`hydrateApprovedSettings`](../../interface/application.js#L6023) | 6023 |
| [`caffootCompareVersions`](../../interface/application.js#L6044) | 6044 |
| [`parse`](../../interface/application.js#L6045) | 6045 |
| [`caffootShowLicences`](../../interface/application.js#L6067) | 6067 |
| [`caffootUpdateGuide`](../../interface/application.js#L6072) | 6072 |
| [`caffootCheckUpdates`](../../interface/application.js#L6077) | 6077 |
| [`checkInventorySafety`](../../interface/application.js#L6108) | 6108 |
| [`requestInventoryReset`](../../interface/application.js#L6131) | 6131 |
| [`createInventoryBackup`](../../interface/application.js#L6158) | 6158 |
| [`validateBackupVersion`](../../interface/application.js#L6170) | 6170 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L6185) | 6185 |
| [`exportData`](../../interface/application.js#L6193) | 6193 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L6206) | 6206 |
| [`validateBackupStructure`](../../interface/application.js#L6221) | 6221 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L6238) | 6238 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L6250) | 6250 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L6288) | 6288 |
| [`findRackImportConflicts`](../../interface/application.js#L6292) | 6292 |
| [`place`](../../interface/application.js#L6298) | 6298 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L6341) | 6341 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L6362) | 6362 |
| [`showBackupImportError`](../../interface/application.js#L6367) | 6367 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L6371) | 6371 |
| [`finish`](../../interface/application.js#L6381) | 6381 |
| [`onClick`](../../interface/application.js#L6390) | 6390 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L6400) | 6400 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L6411) | 6411 |
| [`finish`](../../interface/application.js#L6422) | 6422 |
| [`onClick`](../../interface/application.js#L6431) | 6431 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L6446) | 6446 |
| [`importData`](../../interface/application.js#L6462) | 6462 |
| [`reader.onload`](../../interface/application.js#L6472) | 6472 |
| [`reader.onerror`](../../interface/application.js#L6546) | 6546 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L6674) | 6674 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L6690) | 6690 |
| [`openRackAccessoryEditor`](../../interface/application.js#L6701) | 6701 |
| [`refreshAccessoryOptions`](../../interface/application.js#L6735) | 6735 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L6792) | 6792 |
| [`cancel`](../../interface/application.js#L6804) | 6804 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L6820) | 6820 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L6837) | 6837 |
| [`clearRackDropPreview`](../../interface/application.js#L6862) | 6862 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L6866) | 6866 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L6878) | 6878 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L6884) | 6884 |
| [`trackRackDrag`](../../interface/application.js#L6893) | 6893 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L6924) | 6924 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L6934) | 6934 |
| [`getRackDropPosition`](../../interface/application.js#L7018) | 7018 |
| [`window.onload`](../../interface/application.js#L7459) | 7459 |
| [`refreshCentralInventory`](../../interface/application.js#L7474) | 7474 |
| [`postInventory`](../../interface/application.js#L7495) | 7495 |
| [`isBlockedAction`](../../interface/application.js#L7547) | 7547 |
| [`applyAllowedControls`](../../interface/application.js#L7575) | 7575 |
| [`enhanceLongSelects`](../../interface/application.js#L7600) | 7600 |
| [`sync`](../../interface/application.js#L7642) | 7642 |
| [`close`](../../interface/application.js#L7648) | 7648 |
| [`choose`](../../interface/application.js#L7652) | 7652 |
| [`draw`](../../interface/application.js#L7657) | 7657 |
| [`open`](../../interface/application.js#L7675) | 7675 |
| [`enhanceSelects`](../../interface/application.js#L7721) | 7721 |
| [`switchTab`](../../interface/application.js#L7767) | 7767 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L7778) | 7778 |
| [`openDeviceDetailView`](../../interface/application.js#L7804) | 7804 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L7812) | 7812 |
| [`forbidRackMount`](../../interface/application.js#L7840) | 7840 |
| [`openDeviceModal`](../../interface/application.js#L7850) | 7850 |
| [`nextDeviceModalClosed`](../../interface/application.js#L7892) | 7892 |
| [`relatedChanges`](../../interface/application.js#L7898) | 7898 |
| [`saveDevice`](../../interface/application.js#L7909) | 7909 |
| [`reserveForDelete`](../../interface/application.js#L8215) | 8215 |
| [`removeDevice`](../../interface/application.js#L8223) | 8223 |
| [`cancelDelete`](../../interface/application.js#L8249) | 8249 |
| [`saveArchivedInstallation`](../../interface/application.js#L8255) | 8255 |
| [`renderAccountSections`](../../interface/application.js#L8290) | 8290 |
| [`renderApprovedAccountMfaPanel`](../../interface/application.js#L8318) | 8318 |
| [`nextRenderAccount`](../../interface/application.js#L8328) | 8328 |
| [`hydrateApprovedAccount`](../../interface/application.js#L8336) | 8336 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L8390) | 8390 |
| [`loadApprovedAccountProfile`](../../interface/application.js#L8403) | 8403 |
| [`removeApprovedAccountPhoto`](../../interface/application.js#L8419) | 8419 |
| [`nextRenderUsers`](../../interface/application.js#L8428) | 8428 |
| [`profileFields`](../../interface/application.js#L8430) | 8430 |
| [`stat`](../../interface/application.js#L8451) | 8451 |
| [`bars`](../../interface/application.js#L8454) | 8454 |
| [`filterApprovedUserRows`](../../interface/application.js#L8520) | 8520 |
| [`loadCentralUsers`](../../interface/application.js#L8570) | 8570 |
| [`changeCentralUser`](../../interface/application.js#L8576) | 8576 |
| [`importPanel`](../../interface/application.js#L8587) | 8587 |
| [`cancelImport`](../../interface/application.js#L8591) | 8591 |
| [`nextImportModalClosed`](../../interface/application.js#L8597) | 8597 |
| [`showImportReview`](../../interface/application.js#L8598) | 8598 |
| [`chooseImportFile`](../../interface/application.js#L8638) | 8638 |
| [`actOnImport`](../../interface/application.js#L8655) | 8655 |

## interface/sign-in.js

| Function | Line |
| --- | ---: |
| [`$`](../../interface/sign-in.js#L2) | 2 |
| [`showMfaQr`](../../interface/sign-in.js#L7) | 7 |
| [`showSession`](../../interface/sign-in.js#L15) | 15 |
| [`request`](../../interface/sign-in.js#L32) | 32 |
| [`display`](../../interface/sign-in.js#L36) | 36 |
| [`loadUsers`](../../interface/sign-in.js#L132) | 132 |
| [`adminAction`](../../interface/sign-in.js#L157) | 157 |

## backend/access_point_review.py

| Function | Line |
| --- | ---: |
| [`find_access_point_mount_conflicts`](../../backend/access_point_review.py#L18) | 18 |
| [`apply_access_point_mount_choices`](../../backend/access_point_review.py#L39) | 39 |

## backend/account_email.py

| Function | Line |
| --- | ---: |
| [`queue_email`](../../backend/account_email.py#L25) | 25 |
| [`queue_email.deliver`](../../backend/account_email.py#L30) | 30 |
| [`_digest`](../../backend/account_email.py#L47) | 47 |
| [`issue_email_proof`](../../backend/account_email.py#L53) | 53 |
| [`confirm_email_proof`](../../backend/account_email.py#L74) | 74 |
| [`security_recipients`](../../backend/account_email.py#L118) | 118 |
| [`notify_security_change`](../../backend/account_email.py#L133) | 133 |
| [`record_blocked_sign_in`](../../backend/account_email.py#L154) | 154 |

## backend/account_security.py

| Function | Line |
| --- | ---: |
| [`change_own_password`](../../backend/account_security.py#L9) | 9 |
| [`begin_mfa_enrolment`](../../backend/account_security.py#L31) | 31 |
| [`complete_mfa_enrolment`](../../backend/account_security.py#L55) | 55 |

## backend/accounts.py

| Function | Line |
| --- | ---: |
| [`hash_password`](../../backend/accounts.py#L15) | 15 |
| [`verify_password`](../../backend/accounts.py#L23) | 23 |
| [`bootstrap_first_admin`](../../backend/accounts.py#L42) | 42 |
| [`confirm_admin_mfa`](../../backend/accounts.py#L65) | 65 |

## backend/application_integrity.py

| Function | Line |
| --- | ---: |
| [`validate_detached_application_state`](../../backend/application_integrity.py#L13) | 13 |

## backend/audit_events.py

| Function | Line |
| --- | ---: |
| [`_safe_audit_value`](../../backend/audit_events.py#L34) | 34 |
| [`safe_device_differences`](../../backend/audit_events.py#L46) | 46 |
| [`safe_inventory_differences`](../../backend/audit_events.py#L64) | 64 |
| [`attribute_event`](../../backend/audit_events.py#L88) | 88 |
| [`record_actor_event`](../../backend/audit_events.py#L103) | 103 |

## backend/authentication.py

| Function | Line |
| --- | ---: |
| [`authenticate`](../../backend/authentication.py#L15) | 15 |

## backend/collection_saves.py

| Function | Line |
| --- | ---: |
| [`change_inventory_record`](../../backend/collection_saves.py#L19) | 19 |
| [`change_ipam_subnet_and_vlan_records`](../../backend/collection_saves.py#L105) | 105 |
| [`delete_subnet_with_dependencies`](../../backend/collection_saves.py#L242) | 242 |

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
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L24) | 24 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L43) | 43 |
| [`_persist_related_guests`](../../backend/device_saves.py#L87) | 87 |
| [`save_reserved_device`](../../backend/device_saves.py#L100) | 100 |
| [`create_device`](../../backend/device_saves.py#L232) | 232 |
| [`delete_reserved_device`](../../backend/device_saves.py#L305) | 305 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_change_history`](../../backend/history_permissions.py#L30) | 30 |

## backend/http_security.py

| Function | Line |
| --- | ---: |
| [`session_cookie`](../../backend/http_security.py#L14) | 14 |
| [`clear_session_cookie`](../../backend/http_security.py#L29) | 29 |
| [`read_session_cookie`](../../backend/http_security.py#L42) | 42 |
| [`new_csrf_token`](../../backend/http_security.py#L63) | 63 |
| [`check_csrf`](../../backend/http_security.py#L67) | 67 |
| [`require_same_origin`](../../backend/http_security.py#L78) | 78 |

## backend/import_commit.py

| Function | Line |
| --- | ---: |
| [`prepare_restore_confirmation`](../../backend/import_commit.py#L16) | 16 |
| [`restore_reviewed_export_offline`](../../backend/import_commit.py#L22) | 22 |

## backend/import_diagnostics.py

| Function | Line |
| --- | ---: |
| [`inspect_detached_candidate`](../../backend/import_diagnostics.py#L13) | 13 |

## backend/import_drafts.py

| Function | Line |
| --- | ---: |
| [`ImportDrafts.__init__`](../../backend/import_drafts.py#L18) | 18 |
| [`ImportDrafts._identity`](../../backend/import_drafts.py#L24) | 24 |
| [`ImportDrafts._get`](../../backend/import_drafts.py#L30) | 30 |
| [`ImportDrafts.begin`](../../backend/import_drafts.py#L41) | 41 |
| [`ImportDrafts.choose_access_point_mounts`](../../backend/import_drafts.py#L65) | 65 |
| [`ImportDrafts.confirm`](../../backend/import_drafts.py#L82) | 82 |
| [`ImportDrafts.cancel`](../../backend/import_drafts.py#L111) | 111 |
| [`ImportDrafts.cancel_authenticated`](../../backend/import_drafts.py#L116) | 116 |

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
| [`replace_from_published_export`](../../backend/import_service.py#L14) | 14 |
| [`replace_from_published_export.require_current_permission`](../../backend/import_service.py#L38) | 38 |
| [`preview_published_export`](../../backend/import_service.py#L49) | 49 |

## backend/inventory.py

| Function | Line |
| --- | ---: |
| [`_json`](../../backend/inventory.py#L31) | 31 |
| [`_check_keys`](../../backend/inventory.py#L35) | 35 |
| [`_unique_object`](../../backend/inventory.py#L46) | 46 |
| [`_reject_nonfinite`](../../backend/inventory.py#L55) | 55 |
| [`validate_published_structure`](../../backend/inventory.py#L59) | 59 |
| [`inspect_export`](../../backend/inventory.py#L83) | 83 |
| [`inspect_device_mounts`](../../backend/inventory.py#L134) | 134 |
| [`inspect_import_relationships`](../../backend/inventory.py#L148) | 148 |
| [`preview_inventory_counts`](../../backend/inventory.py#L192) | 192 |
| [`preview_inventory_counts.counts`](../../backend/inventory.py#L198) | 198 |
| [`_write_detached`](../../backend/inventory.py#L214) | 214 |
| [`stage_inventory`](../../backend/inventory.py#L260) | 260 |
| [`reconstruct_inventory`](../../backend/inventory.py#L276) | 276 |

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
| [`change_bulk_allocations`](../../backend/ipam_saves.py#L66) | 66 |

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
| [`LoginThrottle.__init__`](../../backend/login_throttle.py#L16) | 16 |
| [`LoginThrottle._prune`](../../backend/login_throttle.py#L20) | 20 |
| [`LoginThrottle.allowed`](../../backend/login_throttle.py#L29) | 29 |
| [`LoginThrottle.failed`](../../backend/login_throttle.py#L37) | 37 |
| [`LoginThrottle.succeeded`](../../backend/login_throttle.py#L48) | 48 |
| [`LoginThrottle._key`](../../backend/login_throttle.py#L54) | 54 |

## backend/mfa.py

| Function | Line |
| --- | ---: |
| [`new_secret`](../../backend/mfa.py#L19) | 19 |
| [`_secret_bytes`](../../backend/mfa.py#L24) | 24 |
| [`provisioning_uri`](../../backend/mfa.py#L37) | 37 |
| [`code_at`](../../backend/mfa.py#L51) | 51 |
| [`verify_code`](../../backend/mfa.py#L64) | 64 |

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
| [`normalise_detached_v133_state`](../../backend/normalisation_pipeline.py#L75) | 75 |

## backend/normalisation_validation.py

| Function | Line |
| --- | ---: |
| [`_number`](../../backend/normalisation_validation.py#L11) | 11 |
| [`_integer`](../../backend/normalisation_validation.py#L22) | 22 |
| [`_valid_ipv4`](../../backend/normalisation_validation.py#L26) | 26 |
| [`validate_normalisation_vlans`](../../backend/normalisation_validation.py#L36) | 36 |
| [`validate_normalisation_devices`](../../backend/normalisation_validation.py#L58) | 58 |

## backend/permissions.py

| Function | Line |
| --- | ---: |
| [`_admin`](../../backend/permissions.py#L14) | 14 |
| [`_target`](../../backend/permissions.py#L23) | 23 |
| [`create_user`](../../backend/permissions.py#L32) | 32 |
| [`set_permission`](../../backend/permissions.py#L64) | 64 |
| [`can_access`](../../backend/permissions.py#L114) | 114 |
| [`set_account_active`](../../backend/permissions.py#L136) | 136 |
| [`delete_user`](../../backend/permissions.py#L173) | 173 |
| [`set_administrator`](../../backend/permissions.py#L200) | 200 |
| [`can_replace_inventory`](../../backend/permissions.py#L241) | 241 |

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
| [`_number`](../../backend/rack_validation.py#L16) | 16 |
| [`_integer`](../../backend/rack_validation.py#L34) | 34 |
| [`_label`](../../backend/rack_validation.py#L39) | 39 |
| [`find_rack_import_conflicts`](../../backend/rack_validation.py#L43) | 43 |
| [`find_rack_import_conflicts.place`](../../backend/rack_validation.py#L50) | 50 |

## backend/recover_admin.py

| Function | Line |
| --- | ---: |
| [`recover_sole_administrator`](../../backend/recover_admin.py#L17) | 17 |
| [`main`](../../backend/recover_admin.py#L46) | 46 |

## backend/request_auth.py

| Function | Line |
| --- | ---: |
| [`login`](../../backend/request_auth.py#L20) | 20 |
| [`csrf_for_session`](../../backend/request_auth.py#L36) | 36 |
| [`authenticated_account`](../../backend/request_auth.py#L51) | 51 |
| [`authorised_mutation`](../../backend/request_auth.py#L58) | 58 |
| [`logout`](../../backend/request_auth.py#L69) | 69 |
| [`authorised_inventory_import`](../../backend/request_auth.py#L81) | 81 |

## backend/reset_inventory.py

| Function | Line |
| --- | ---: |
| [`reset_inventory`](../../backend/reset_inventory.py#L13) | 13 |

## backend/schema.py

| Function | Line |
| --- | ---: |
| [`initialise_database`](../../backend/schema.py#L56) | 56 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L72) | 72 |
| [`connect`](../../backend/server.py#L90) | 90 |
| [`initialise_database`](../../backend/server.py#L98) | 98 |
| [`Handler.end_headers`](../../backend/server.py#L104) | 104 |
| [`Handler.do_GET`](../../backend/server.py#L111) | 111 |
| [`Handler.do_POST`](../../backend/server.py#L439) | 439 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L567) | 567 |
| [`Handler.handle_account_email`](../../backend/server.py#L919) | 919 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L996) | 996 |
| [`Handler.handle_import`](../../backend/server.py#L1027) | 1027 |
| [`Handler.respond`](../../backend/server.py#L1103) | 1103 |
| [`main`](../../backend/server.py#L1116) | 1116 |

## backend/sessions.py

| Function | Line |
| --- | ---: |
| [`_digest`](../../backend/sessions.py#L16) | 16 |
| [`login_session`](../../backend/sessions.py#L26) | 26 |
| [`session_account`](../../backend/sessions.py#L50) | 50 |
| [`logout_session`](../../backend/sessions.py#L73) | 73 |
| [`revoke_account_sessions`](../../backend/sessions.py#L82) | 82 |

## backend/settings_saves.py

| Function | Line |
| --- | ---: |
| [`save_inventory_setting`](../../backend/settings_saves.py#L10) | 10 |

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
| [`_js_number`](../../backend/subnet_validation.py#L134) | 134 |
| [`_js_string`](../../backend/subnet_validation.py#L153) | 153 |
| [`_ip_number`](../../backend/subnet_validation.py#L163) | 163 |
| [`validate_subnet_types`](../../backend/subnet_validation.py#L178) | 178 |

## backend/tls.py

| Function | Line |
| --- | ---: |
| [`subject_alternative_names`](../../backend/tls.py#L12) | 12 |
| [`ensure_certificate`](../../backend/tls.py#L33) | 33 |
