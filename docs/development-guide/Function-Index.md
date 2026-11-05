# Caffoot Lite — Function Index

This is the current function map for the modular Issue #282 source tree in the same commit as this index. It replaces the older HTML-only navigation map; the [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains available in history.

The map lists named JavaScript declarations and named function/arrow assignments in the three application scripts, plus Python functions and methods in `backend/`. Tests, anonymous callbacks, third-party QR code code and generated HTML fragments are excluded. Nested Python functions include their enclosing names. It is a declaration map, not a call graph or permission to remove a function. Read event dispatch, aliases and API callers before changing code.

**Recorded definitions: 602.** The links refer to the current branch files and line positions. Regenerate after moving or renaming functions. See [Modular Interface](Modular-Interface.md) and the [Function And Code Reference](07-Function-and-Code-Reference.md).

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
| [`revealActiveSectionTabs`](../../interface/application.js#L1085) | 1085 |
| [`renderContent`](../../interface/application.js#L1096) | 1096 |
| [`updateScrollHint`](../../interface/application.js#L1130) | 1130 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1141) | 1141 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1176) | 1176 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1180) | 1180 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1184) | 1184 |
| [`buildInventoryReportData`](../../interface/application.js#L1190) | 1190 |
| [`occupancy`](../../interface/application.js#L1206) | 1206 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1229) | 1229 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1235) | 1235 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1261) | 1261 |
| [`renderDashboardHTML`](../../interface/application.js#L1280) | 1280 |
| [`statusPill`](../../interface/application.js#L1383) | 1383 |
| [`insightSegment`](../../interface/application.js#L1400) | 1400 |
| [`getCategoryIcon`](../../interface/application.js#L1441) | 1441 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1456) | 1456 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1465) | 1465 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1470) | 1470 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1485) | 1485 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1500) | 1500 |
| [`printRackElevation`](../../interface/application.js#L1510) | 1510 |
| [`safe`](../../interface/application.js#L1515) | 1515 |
| [`renderRackHubV13`](../../interface/application.js#L1539) | 1539 |
| [`card`](../../interface/application.js#L1544) | 1544 |
| [`mark`](../../interface/application.js#L1553) | 1553 |
| [`bar`](../../interface/application.js#L1569) | 1569 |
| [`chartBox`](../../interface/application.js#L1570) | 1570 |
| [`chartRows`](../../interface/application.js#L1571) | 1571 |
| [`rackSpaceGuide`](../../interface/application.js#L1573) | 1573 |
| [`renderRacksHTML`](../../interface/application.js#L1642) | 1642 |
| [`changeRack`](../../interface/application.js#L1709) | 1709 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1728) | 1728 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1735) | 1735 |
| [`getVisibleDevices`](../../interface/application.js#L1741) | 1741 |
| [`filterHardwareModels`](../../interface/application.js#L1766) | 1766 |
| [`openApprovedCatalogueModal`](../../interface/application.js#L1805) | 1805 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1814) | 1814 |
| [`saveHardwareManufacturer`](../../interface/application.js#L1838) | 1838 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L1876) | 1876 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L1888) | 1888 |
| [`renderCatalogueButton`](../../interface/application.js#L1905) | 1905 |
| [`renderCatalogueRecord`](../../interface/application.js#L1909) | 1909 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L1914) | 1914 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L1933) | 1933 |
| [`add`](../../interface/application.js#L1935) | 1935 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L1980) | 1980 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L1987) | 1987 |
| [`openHardwareModelManager`](../../interface/application.js#L1999) | 1999 |
| [`opts`](../../interface/application.js#L2004) | 2004 |
| [`saveHardwareModel`](../../interface/application.js#L2022) | 2022 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2051) | 2051 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2065) | 2065 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2087) | 2087 |
| [`add`](../../interface/application.js#L2089) | 2089 |
| [`options`](../../interface/application.js#L2125) | 2125 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2139) | 2139 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2154) | 2154 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2169) | 2169 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2177) | 2177 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2188) | 2188 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2197) | 2197 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2219) | 2219 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2230) | 2230 |
| [`openServerServiceEditor`](../../interface/application.js#L2247) | 2247 |
| [`saveServerServiceEntry`](../../interface/application.js#L2256) | 2256 |
| [`restoreArchivedServerService`](../../interface/application.js#L2269) | 2269 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2278) | 2278 |
| [`renderDevicesHTML`](../../interface/application.js#L2290) | 2290 |
| [`approvedHardwareMetric`](../../interface/application.js#L2298) | 2298 |
| [`approvedHardwareChart`](../../interface/application.js#L2303) | 2303 |
| [`approvedDeviceInsightChart`](../../interface/application.js#L2313) | 2313 |
| [`approvedDeviceQualityCards`](../../interface/application.js#L2332) | 2332 |
| [`approvedArchivedSoftwareHtml`](../../interface/application.js#L2340) | 2340 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2375) | 2375 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2382) | 2382 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2383) | 2383 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2384) | 2384 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2387) | 2387 |
| [`openManageTypesModal`](../../interface/application.js#L2403) | 2403 |
| [`openManageLocationsModal`](../../interface/application.js#L2404) | 2404 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2407) | 2407 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2429) | 2429 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2436) | 2436 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2444) | 2444 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2464) | 2464 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2465) | 2465 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2466) | 2466 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2481) | 2481 |
| [`deleteDeviceType`](../../interface/application.js#L2501) | 2501 |
| [`deleteDeviceLocation`](../../interface/application.js#L2502) | 2502 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2510) | 2510 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2514) | 2514 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2540) | 2540 |
| [`nodes`](../../interface/application.js#L2550) | 2550 |
| [`renderApprovedIpamManage`](../../interface/application.js#L2576) | 2576 |
| [`renderIpamHTML`](../../interface/application.js#L2626) | 2626 |
| [`changeSubnet`](../../interface/application.js#L2785) | 2785 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2798) | 2798 |
| [`openApprovedIpamModal`](../../interface/application.js#L2824) | 2824 |
| [`openBulkIpModal`](../../interface/application.js#L2829) | 2829 |
| [`approvedBulkConfirm`](../../interface/application.js#L2836) | 2836 |
| [`handleBulkIpSubmit`](../../interface/application.js#L2840) | 2840 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L2859) | 2859 |
| [`applyBulkIpChanges`](../../interface/application.js#L2875) | 2875 |
| [`subnetCidrFeedback`](../../interface/application.js#L2889) | 2889 |
| [`suggestSubnetGateway`](../../interface/application.js#L2907) | 2907 |
| [`openSubnetModal`](../../interface/application.js#L2935) | 2935 |
| [`updateSubnetTypePreview`](../../interface/application.js#L2939) | 2939 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L2963) | 2963 |
| [`handleSubnetSubmit`](../../interface/application.js#L2983) | 2983 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3176) | 3176 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3180) | 3180 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3185) | 3185 |
| [`approvedDeletionBlocked`](../../interface/application.js#L3206) | 3206 |
| [`approvedDeletionConfirm`](../../interface/application.js#L3210) | 3210 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3214) | 3214 |
| [`deleteSubnet`](../../interface/application.js#L3225) | 3225 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3285) | 3285 |
| [`deleteSubnetCommit`](../../interface/application.js#L3313) | 3313 |
| [`deleteVlan`](../../interface/application.js#L3343) | 3343 |
| [`openIpModal`](../../interface/application.js#L3369) | 3369 |
| [`handleIpSubmit`](../../interface/application.js#L3386) | 3386 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3452) | 3452 |
| [`modalFormSnapshot`](../../interface/application.js#L3462) | 3462 |
| [`rememberModalForm`](../../interface/application.js#L3467) | 3467 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3472) | 3472 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3491) | 3491 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3510) | 3510 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3519) | 3519 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3525) | 3525 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3531) | 3531 |
| [`closeModal`](../../interface/application.js#L3540) | 3540 |
| [`openModal`](../../interface/application.js#L3565) | 3565 |
| [`rackPhysicalDetails`](../../interface/application.js#L3638) | 3638 |
| [`dimension`](../../interface/application.js#L3639) | 3639 |
| [`openRackModal`](../../interface/application.js#L3652) | 3652 |
| [`handleRackSubmit`](../../interface/application.js#L3668) | 3668 |
| [`deleteRack`](../../interface/application.js#L3735) | 3735 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3757) | 3757 |
| [`refresh`](../../interface/application.js#L3780) | 3780 |
| [`openAssignDeviceModal`](../../interface/application.js#L3857) | 3857 |
| [`refresh`](../../interface/application.js#L3874) | 3874 |
| [`refreshAssignStartPositions`](../../interface/application.js#L3881) | 3881 |
| [`handleAssignSubmit`](../../interface/application.js#L3915) | 3915 |
| [`unassignDevice`](../../interface/application.js#L3960) | 3960 |
| [`getSubnetForIp`](../../interface/application.js#L3977) | 3977 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L3981) | 3981 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4025) | 4025 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4034) | 4034 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4043) | 4043 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4065) | 4065 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4075) | 4075 |
| [`toggleDeviceMountType`](../../interface/application.js#L4119) | 4119 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4140) | 4140 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4145) | 4145 |
| [`openApprovedDeviceReviewModal`](../../interface/application.js#L4163) | 4163 |
| [`openDeviceDetailView`](../../interface/application.js#L4168) | 4168 |
| [`safe`](../../interface/application.js#L4178) | 4178 |
| [`field`](../../interface/application.js#L4179) | 4179 |
| [`section`](../../interface/application.js#L4180) | 4180 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4223) | 4223 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4229) | 4229 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4248) | 4248 |
| [`navigateToDeviceRack`](../../interface/application.js#L4264) | 4264 |
| [`duplicateDevice`](../../interface/application.js#L4292) | 4292 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4362) | 4362 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4367) | 4367 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4372) | 4372 |
| [`openServerServiceManager`](../../interface/application.js#L4373) | 4373 |
| [`captureServerServiceSelections`](../../interface/application.js#L4378) | 4378 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4384) | 4384 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4405) | 4405 |
| [`archiveServerService`](../../interface/application.js#L4413) | 4413 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4437) | 4437 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4441) | 4441 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4459) | 4459 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4463) | 4463 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4466) | 4466 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4473) | 4473 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4501) | 4501 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4505) | 4505 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4546) | 4546 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4579) | 4579 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4596) | 4596 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4599) | 4599 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4600) | 4600 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4605) | 4605 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4611) | 4611 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4647) | 4647 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4648) | 4648 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4655) | 4655 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4656) | 4656 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4671) | 4671 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4675) | 4675 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4678) | 4678 |
| [`isSoftwareDetailField`](../../interface/application.js#L4685) | 4685 |
| [`renderApprovedInlineDevicePicker`](../../interface/application.js#L4692) | 4692 |
| [`updateApprovedInlinePickerCount`](../../interface/application.js#L4702) | 4702 |
| [`openApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4708) | 4708 |
| [`cancelApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4721) | 4721 |
| [`saveApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4730) | 4730 |
| [`fail`](../../interface/application.js#L4736) | 4736 |
| [`renderApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4788) | 4788 |
| [`saveApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4804) | 4804 |
| [`fail`](../../interface/application.js#L4809) | 4809 |
| [`renderDeviceDetailFields`](../../interface/application.js#L4856) | 4856 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L4886) | 4886 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L4892) | 4892 |
| [`getPlatformVersionOptions`](../../interface/application.js#L4912) | 4912 |
| [`isWindowsPlatform`](../../interface/application.js#L4915) | 4915 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L4918) | 4918 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L4927) | 4927 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L4957) | 4957 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L4965) | 4965 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L4975) | 4975 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L4979) | 4979 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L4986) | 4986 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L4997) | 4997 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5021) | 5021 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5025) | 5025 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5029) | 5029 |
| [`getDefaultMountType`](../../interface/application.js#L5042) | 5042 |
| [`renderDeviceMountOptions`](../../interface/application.js#L5045) | 5045 |
| [`updateDeviceMountChoices`](../../interface/application.js#L5050) | 5050 |
| [`initialiseNotesEditor`](../../interface/application.js#L5063) | 5063 |
| [`inlineMarkdown`](../../interface/application.js#L5068) | 5068 |
| [`render`](../../interface/application.js#L5081) | 5081 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5115) | 5115 |
| [`activate`](../../interface/application.js#L5481) | 5481 |
| [`openDeviceModal`](../../interface/application.js#L5545) | 5545 |
| [`syncVmPurpose`](../../interface/application.js#L5576) | 5576 |
| [`clearFieldError`](../../interface/application.js#L5625) | 5625 |
| [`captureDeviceFormDraft`](../../interface/application.js#L5644) | 5644 |
| [`createRackFromDevice`](../../interface/application.js#L5674) | 5674 |
| [`cancelRackFromDevice`](../../interface/application.js#L5682) | 5682 |
| [`createSubnetFromDevice`](../../interface/application.js#L5692) | 5692 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L5705) | 5705 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L5719) | 5719 |
| [`addCustomLocationOption`](../../interface/application.js#L5730) | 5730 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L5768) | 5768 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L5780) | 5780 |
| [`finish`](../../interface/application.js#L5800) | 5800 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L5825) | 5825 |
| [`finish`](../../interface/application.js#L5839) | 5839 |
| [`handleDeviceSubmit`](../../interface/application.js#L5859) | 5859 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L5898) | 5898 |
| [`deleteDevice`](../../interface/application.js#L6030) | 6030 |
| [`personalSafeStorageGet`](../../interface/application.js#L6087) | 6087 |
| [`openBackupExplanationDialog`](../../interface/application.js#L6092) | 6092 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L6102) | 6102 |
| [`button`](../../interface/application.js#L6103) | 6103 |
| [`themeChoice`](../../interface/application.js#L6107) | 6107 |
| [`guideLinks`](../../interface/application.js#L6124) | 6124 |
| [`loadApprovedSmtpSettings`](../../interface/application.js#L6155) | 6155 |
| [`renderApplicationSettings`](../../interface/application.js#L6170) | 6170 |
| [`syncSmtpForm`](../../interface/application.js#L6174) | 6174 |
| [`updateApprovedSmtpFields`](../../interface/application.js#L6196) | 6196 |
| [`hydrateApprovedSettings`](../../interface/application.js#L6209) | 6209 |
| [`caffootCompareVersions`](../../interface/application.js#L6230) | 6230 |
| [`parse`](../../interface/application.js#L6231) | 6231 |
| [`caffootShowLicences`](../../interface/application.js#L6253) | 6253 |
| [`caffootUpdateGuide`](../../interface/application.js#L6258) | 6258 |
| [`caffootCheckUpdates`](../../interface/application.js#L6263) | 6263 |
| [`checkInventorySafety`](../../interface/application.js#L6294) | 6294 |
| [`requestInventoryReset`](../../interface/application.js#L6317) | 6317 |
| [`createInventoryBackup`](../../interface/application.js#L6344) | 6344 |
| [`validateBackupVersion`](../../interface/application.js#L6356) | 6356 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L6371) | 6371 |
| [`exportData`](../../interface/application.js#L6379) | 6379 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L6392) | 6392 |
| [`validateBackupStructure`](../../interface/application.js#L6407) | 6407 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L6424) | 6424 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L6436) | 6436 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L6474) | 6474 |
| [`findRackImportConflicts`](../../interface/application.js#L6478) | 6478 |
| [`place`](../../interface/application.js#L6484) | 6484 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L6527) | 6527 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L6548) | 6548 |
| [`showBackupImportError`](../../interface/application.js#L6553) | 6553 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L6557) | 6557 |
| [`finish`](../../interface/application.js#L6567) | 6567 |
| [`onClick`](../../interface/application.js#L6576) | 6576 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L6586) | 6586 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L6597) | 6597 |
| [`finish`](../../interface/application.js#L6608) | 6608 |
| [`onClick`](../../interface/application.js#L6617) | 6617 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L6632) | 6632 |
| [`importData`](../../interface/application.js#L6648) | 6648 |
| [`reader.onload`](../../interface/application.js#L6658) | 6658 |
| [`reader.onerror`](../../interface/application.js#L6732) | 6732 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L6860) | 6860 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L6876) | 6876 |
| [`openRackAccessoryEditor`](../../interface/application.js#L6887) | 6887 |
| [`refreshAccessoryOptions`](../../interface/application.js#L6921) | 6921 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L6978) | 6978 |
| [`cancel`](../../interface/application.js#L6990) | 6990 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L7006) | 7006 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L7023) | 7023 |
| [`clearRackDropPreview`](../../interface/application.js#L7048) | 7048 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L7052) | 7052 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L7064) | 7064 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L7070) | 7070 |
| [`trackRackDrag`](../../interface/application.js#L7079) | 7079 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L7110) | 7110 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L7120) | 7120 |
| [`getRackDropPosition`](../../interface/application.js#L7204) | 7204 |
| [`window.onload`](../../interface/application.js#L7648) | 7648 |
| [`refreshCentralInventory`](../../interface/application.js#L7663) | 7663 |
| [`postInventory`](../../interface/application.js#L7684) | 7684 |
| [`isBlockedAction`](../../interface/application.js#L7736) | 7736 |
| [`applyAllowedControls`](../../interface/application.js#L7764) | 7764 |
| [`enhanceLongSelects`](../../interface/application.js#L7789) | 7789 |
| [`sync`](../../interface/application.js#L7840) | 7840 |
| [`close`](../../interface/application.js#L7846) | 7846 |
| [`choose`](../../interface/application.js#L7850) | 7850 |
| [`draw`](../../interface/application.js#L7855) | 7855 |
| [`open`](../../interface/application.js#L7873) | 7873 |
| [`enhanceSelects`](../../interface/application.js#L7929) | 7929 |
| [`switchTab`](../../interface/application.js#L7975) | 7975 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L7986) | 7986 |
| [`openDeviceDetailView`](../../interface/application.js#L8012) | 8012 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L8020) | 8020 |
| [`forbidRackMount`](../../interface/application.js#L8048) | 8048 |
| [`openDeviceModal`](../../interface/application.js#L8058) | 8058 |
| [`nextDeviceModalClosed`](../../interface/application.js#L8100) | 8100 |
| [`relatedChanges`](../../interface/application.js#L8106) | 8106 |
| [`saveDevice`](../../interface/application.js#L8117) | 8117 |
| [`reserveForDelete`](../../interface/application.js#L8423) | 8423 |
| [`removeDevice`](../../interface/application.js#L8431) | 8431 |
| [`cancelDelete`](../../interface/application.js#L8457) | 8457 |
| [`saveArchivedInstallation`](../../interface/application.js#L8463) | 8463 |
| [`renderAccountSections`](../../interface/application.js#L8498) | 8498 |
| [`renderApprovedAccountMfaPanel`](../../interface/application.js#L8526) | 8526 |
| [`nextRenderAccount`](../../interface/application.js#L8536) | 8536 |
| [`hydrateApprovedAccount`](../../interface/application.js#L8544) | 8544 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L8598) | 8598 |
| [`loadApprovedAccountProfile`](../../interface/application.js#L8611) | 8611 |
| [`removeApprovedAccountPhoto`](../../interface/application.js#L8627) | 8627 |
| [`nextRenderUsers`](../../interface/application.js#L8636) | 8636 |
| [`profileFields`](../../interface/application.js#L8638) | 8638 |
| [`stat`](../../interface/application.js#L8659) | 8659 |
| [`bars`](../../interface/application.js#L8662) | 8662 |
| [`operation`](../../interface/application.js#L8714) | 8714 |
| [`filterApprovedUserRows`](../../interface/application.js#L8734) | 8734 |
| [`closeUserWorkspace`](../../interface/application.js#L8758) | 8758 |
| [`loadCentralUsers`](../../interface/application.js#L8787) | 8787 |
| [`changeCentralUser`](../../interface/application.js#L8793) | 8793 |
| [`importPanel`](../../interface/application.js#L8804) | 8804 |
| [`cancelImport`](../../interface/application.js#L8808) | 8808 |
| [`nextImportModalClosed`](../../interface/application.js#L8814) | 8814 |
| [`showImportReview`](../../interface/application.js#L8815) | 8815 |
| [`chooseImportFile`](../../interface/application.js#L8855) | 8855 |
| [`actOnImport`](../../interface/application.js#L8872) | 8872 |

## interface/sign-in.js

| Function | Line |
| --- | ---: |
| [`$`](../../interface/sign-in.js#L2) | 2 |
| [`showMfaQr`](../../interface/sign-in.js#L7) | 7 |
| [`showSession`](../../interface/sign-in.js#L15) | 15 |
| [`request`](../../interface/sign-in.js#L32) | 32 |
| [`display`](../../interface/sign-in.js#L36) | 36 |
| [`loadUsers`](../../interface/sign-in.js#L134) | 134 |
| [`adminAction`](../../interface/sign-in.js#L159) | 159 |

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
