# Caffoot Lite — Function Index

This is the current function map for the modular Issue #282 source tree in the same commit as this index. It replaces the older HTML-only navigation map; the [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains available in history.

The map lists named JavaScript declarations and named function/arrow assignments in the three application scripts, plus Python functions and methods in `backend/`. Tests, anonymous callbacks, third-party QR code code and generated HTML fragments are excluded. Nested Python functions include their enclosing names. It is a declaration map, not a call graph or permission to remove a function. Read event dispatch, aliases and API callers before changing code.

**Recorded definitions: 607.** The links refer to the current branch files and line positions. Regenerate after moving or renaming functions. See [Modular Interface](Modular-Interface.md) and the [Function And Code Reference](07-Function-and-Code-Reference.md).

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
| [`caffootSetTheme`](../../interface/application.js#L550) | 550 |
| [`onSystemThemeChange`](../../interface/application.js#L561) | 561 |
| [`toggleDarkMode`](../../interface/application.js#L570) | 570 |
| [`readAuditHistory`](../../interface/application.js#L577) | 577 |
| [`auditChanges`](../../interface/application.js#L581) | 581 |
| [`recordAudit`](../../interface/application.js#L618) | 618 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L627) | 627 |
| [`exportAuditHistory`](../../interface/application.js#L639) | 639 |
| [`auditVisibleRows`](../../interface/application.js#L651) | 651 |
| [`auditDate`](../../interface/application.js#L673) | 673 |
| [`renderAuditHTML`](../../interface/application.js#L677) | 677 |
| [`hydrateApprovedAudit`](../../interface/application.js#L710) | 710 |
| [`applyApprovedAuditFilters`](../../interface/application.js#L718) | 718 |
| [`closeApprovedAuditDetail`](../../interface/application.js#L753) | 753 |
| [`showApprovedAuditDetail`](../../interface/application.js#L759) | 759 |
| [`nextRenderUsers`](../../interface/application.js#L786) | 786 |
| [`nextRenderAccount`](../../interface/application.js#L788) | 788 |
| [`nextHydrateAccount`](../../interface/application.js#L789) | 789 |
| [`nextRemoveAccountPhoto`](../../interface/application.js#L790) | 790 |
| [`saveState`](../../interface/application.js#L793) | 793 |
| [`getDeviceById`](../../interface/application.js#L796) | 796 |
| [`findDeviceUsingIp`](../../interface/application.js#L800) | 800 |
| [`setDevicePrimaryIp`](../../interface/application.js#L805) | 805 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L858) | 858 |
| [`validateRackPlacement`](../../interface/application.js#L871) | 871 |
| [`showToast`](../../interface/application.js#L906) | 906 |
| [`toggleApprovedSidebar`](../../interface/application.js#L992) | 992 |
| [`switchTab`](../../interface/application.js#L1011) | 1011 |
| [`escapeHtml`](../../interface/application.js#L1038) | 1038 |
| [`inlineJsArg`](../../interface/application.js#L1047) | 1047 |
| [`browserStorageWarning`](../../interface/application.js#L1055) | 1055 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1058) | 1058 |
| [`renderSectionTabIcon`](../../interface/application.js#L1064) | 1064 |
| [`renderApprovedSectionHeader`](../../interface/application.js#L1070) | 1070 |
| [`tab`](../../interface/application.js#L1071) | 1071 |
| [`revealSectionTab`](../../interface/application.js#L1098) | 1098 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1105) | 1105 |
| [`renderContent`](../../interface/application.js#L1121) | 1121 |
| [`updateScrollHint`](../../interface/application.js#L1155) | 1155 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1166) | 1166 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1201) | 1201 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1205) | 1205 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1209) | 1209 |
| [`buildInventoryReportData`](../../interface/application.js#L1215) | 1215 |
| [`occupancy`](../../interface/application.js#L1231) | 1231 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1254) | 1254 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1260) | 1260 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1286) | 1286 |
| [`renderDashboardHTML`](../../interface/application.js#L1305) | 1305 |
| [`statusPill`](../../interface/application.js#L1408) | 1408 |
| [`insightSegment`](../../interface/application.js#L1425) | 1425 |
| [`getCategoryIcon`](../../interface/application.js#L1466) | 1466 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1481) | 1481 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1490) | 1490 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1495) | 1495 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1510) | 1510 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1525) | 1525 |
| [`printRackElevation`](../../interface/application.js#L1535) | 1535 |
| [`safe`](../../interface/application.js#L1538) | 1538 |
| [`printRackElevationInFrame`](../../interface/application.js#L1569) | 1569 |
| [`renderRackHubV13`](../../interface/application.js#L1600) | 1600 |
| [`card`](../../interface/application.js#L1605) | 1605 |
| [`mark`](../../interface/application.js#L1614) | 1614 |
| [`bar`](../../interface/application.js#L1630) | 1630 |
| [`chartBox`](../../interface/application.js#L1631) | 1631 |
| [`chartRows`](../../interface/application.js#L1632) | 1632 |
| [`rackSpaceGuide`](../../interface/application.js#L1634) | 1634 |
| [`renderRacksHTML`](../../interface/application.js#L1703) | 1703 |
| [`changeRack`](../../interface/application.js#L1770) | 1770 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1789) | 1789 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1796) | 1796 |
| [`getVisibleDevices`](../../interface/application.js#L1802) | 1802 |
| [`filterHardwareModels`](../../interface/application.js#L1827) | 1827 |
| [`openApprovedCatalogueModal`](../../interface/application.js#L1866) | 1866 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1875) | 1875 |
| [`saveHardwareManufacturer`](../../interface/application.js#L1899) | 1899 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L1937) | 1937 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L1949) | 1949 |
| [`renderCatalogueButton`](../../interface/application.js#L1966) | 1966 |
| [`renderCatalogueRecord`](../../interface/application.js#L1970) | 1970 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L1975) | 1975 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L1994) | 1994 |
| [`add`](../../interface/application.js#L1996) | 1996 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2041) | 2041 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2048) | 2048 |
| [`openHardwareModelManager`](../../interface/application.js#L2060) | 2060 |
| [`opts`](../../interface/application.js#L2065) | 2065 |
| [`saveHardwareModel`](../../interface/application.js#L2083) | 2083 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2112) | 2112 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2126) | 2126 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2148) | 2148 |
| [`add`](../../interface/application.js#L2150) | 2150 |
| [`options`](../../interface/application.js#L2186) | 2186 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2200) | 2200 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2215) | 2215 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2230) | 2230 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2238) | 2238 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2249) | 2249 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2258) | 2258 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2280) | 2280 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2291) | 2291 |
| [`openServerServiceEditor`](../../interface/application.js#L2308) | 2308 |
| [`saveServerServiceEntry`](../../interface/application.js#L2317) | 2317 |
| [`restoreArchivedServerService`](../../interface/application.js#L2330) | 2330 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2339) | 2339 |
| [`renderDevicesHTML`](../../interface/application.js#L2351) | 2351 |
| [`approvedHardwareMetric`](../../interface/application.js#L2359) | 2359 |
| [`approvedHardwareChart`](../../interface/application.js#L2364) | 2364 |
| [`approvedDeviceInsightChart`](../../interface/application.js#L2374) | 2374 |
| [`approvedDeviceQualityCards`](../../interface/application.js#L2393) | 2393 |
| [`approvedArchivedSoftwareHtml`](../../interface/application.js#L2401) | 2401 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2436) | 2436 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2443) | 2443 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2444) | 2444 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2445) | 2445 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2448) | 2448 |
| [`openManageTypesModal`](../../interface/application.js#L2464) | 2464 |
| [`openManageLocationsModal`](../../interface/application.js#L2465) | 2465 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2468) | 2468 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2490) | 2490 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2497) | 2497 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2505) | 2505 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2525) | 2525 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2526) | 2526 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2527) | 2527 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2542) | 2542 |
| [`deleteDeviceType`](../../interface/application.js#L2562) | 2562 |
| [`deleteDeviceLocation`](../../interface/application.js#L2563) | 2563 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2571) | 2571 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2575) | 2575 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2601) | 2601 |
| [`nodes`](../../interface/application.js#L2611) | 2611 |
| [`renderApprovedIpamManage`](../../interface/application.js#L2637) | 2637 |
| [`renderIpamHTML`](../../interface/application.js#L2687) | 2687 |
| [`changeSubnet`](../../interface/application.js#L2846) | 2846 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2859) | 2859 |
| [`openApprovedIpamModal`](../../interface/application.js#L2885) | 2885 |
| [`openBulkIpModal`](../../interface/application.js#L2890) | 2890 |
| [`approvedBulkConfirm`](../../interface/application.js#L2897) | 2897 |
| [`handleBulkIpSubmit`](../../interface/application.js#L2901) | 2901 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L2920) | 2920 |
| [`applyBulkIpChanges`](../../interface/application.js#L2936) | 2936 |
| [`subnetCidrFeedback`](../../interface/application.js#L2950) | 2950 |
| [`suggestSubnetGateway`](../../interface/application.js#L2968) | 2968 |
| [`openSubnetModal`](../../interface/application.js#L2996) | 2996 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3000) | 3000 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3024) | 3024 |
| [`handleSubnetSubmit`](../../interface/application.js#L3044) | 3044 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3237) | 3237 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3241) | 3241 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3246) | 3246 |
| [`approvedDeletionBlocked`](../../interface/application.js#L3267) | 3267 |
| [`approvedDeletionConfirm`](../../interface/application.js#L3271) | 3271 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3275) | 3275 |
| [`deleteSubnet`](../../interface/application.js#L3286) | 3286 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3346) | 3346 |
| [`deleteSubnetCommit`](../../interface/application.js#L3374) | 3374 |
| [`deleteVlan`](../../interface/application.js#L3404) | 3404 |
| [`openIpModal`](../../interface/application.js#L3430) | 3430 |
| [`handleIpSubmit`](../../interface/application.js#L3447) | 3447 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3513) | 3513 |
| [`modalFormSnapshot`](../../interface/application.js#L3523) | 3523 |
| [`rememberModalForm`](../../interface/application.js#L3528) | 3528 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3533) | 3533 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3552) | 3552 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3571) | 3571 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3580) | 3580 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3586) | 3586 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3592) | 3592 |
| [`closeModal`](../../interface/application.js#L3601) | 3601 |
| [`openModal`](../../interface/application.js#L3626) | 3626 |
| [`readRackDimension`](../../interface/application.js#L3699) | 3699 |
| [`formatRackDimension`](../../interface/application.js#L3706) | 3706 |
| [`rackPhysicalDetails`](../../interface/application.js#L3711) | 3711 |
| [`openRackModal`](../../interface/application.js#L3720) | 3720 |
| [`handleRackSubmit`](../../interface/application.js#L3736) | 3736 |
| [`deleteRack`](../../interface/application.js#L3803) | 3803 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3825) | 3825 |
| [`refresh`](../../interface/application.js#L3848) | 3848 |
| [`openAssignDeviceModal`](../../interface/application.js#L3925) | 3925 |
| [`refresh`](../../interface/application.js#L3942) | 3942 |
| [`refreshAssignStartPositions`](../../interface/application.js#L3949) | 3949 |
| [`handleAssignSubmit`](../../interface/application.js#L3983) | 3983 |
| [`unassignDevice`](../../interface/application.js#L4028) | 4028 |
| [`getSubnetForIp`](../../interface/application.js#L4045) | 4045 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4049) | 4049 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4093) | 4093 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4102) | 4102 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4111) | 4111 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4133) | 4133 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4143) | 4143 |
| [`toggleDeviceMountType`](../../interface/application.js#L4187) | 4187 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4208) | 4208 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4213) | 4213 |
| [`openApprovedDeviceReviewModal`](../../interface/application.js#L4231) | 4231 |
| [`openDeviceDetailView`](../../interface/application.js#L4236) | 4236 |
| [`safe`](../../interface/application.js#L4246) | 4246 |
| [`field`](../../interface/application.js#L4247) | 4247 |
| [`section`](../../interface/application.js#L4248) | 4248 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4291) | 4291 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4297) | 4297 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4316) | 4316 |
| [`navigateToDeviceRack`](../../interface/application.js#L4332) | 4332 |
| [`duplicateDevice`](../../interface/application.js#L4360) | 4360 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4430) | 4430 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4435) | 4435 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4440) | 4440 |
| [`openServerServiceManager`](../../interface/application.js#L4441) | 4441 |
| [`captureServerServiceSelections`](../../interface/application.js#L4446) | 4446 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4452) | 4452 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4473) | 4473 |
| [`archiveServerService`](../../interface/application.js#L4481) | 4481 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4505) | 4505 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4509) | 4509 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4527) | 4527 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4531) | 4531 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4534) | 4534 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4541) | 4541 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4569) | 4569 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4573) | 4573 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4614) | 4614 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4647) | 4647 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4664) | 4664 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4667) | 4667 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4668) | 4668 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4673) | 4673 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4679) | 4679 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4715) | 4715 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4716) | 4716 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4723) | 4723 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4724) | 4724 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4739) | 4739 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4743) | 4743 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4746) | 4746 |
| [`isSoftwareDetailField`](../../interface/application.js#L4753) | 4753 |
| [`renderApprovedInlineDevicePicker`](../../interface/application.js#L4760) | 4760 |
| [`updateApprovedInlinePickerCount`](../../interface/application.js#L4770) | 4770 |
| [`openApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4776) | 4776 |
| [`cancelApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4789) | 4789 |
| [`saveApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4798) | 4798 |
| [`fail`](../../interface/application.js#L4804) | 4804 |
| [`renderApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4856) | 4856 |
| [`saveApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4872) | 4872 |
| [`fail`](../../interface/application.js#L4877) | 4877 |
| [`renderDeviceDetailFields`](../../interface/application.js#L4924) | 4924 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L4954) | 4954 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L4960) | 4960 |
| [`getPlatformVersionOptions`](../../interface/application.js#L4980) | 4980 |
| [`isWindowsPlatform`](../../interface/application.js#L4983) | 4983 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L4986) | 4986 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L4995) | 4995 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5032) | 5032 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5040) | 5040 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5050) | 5050 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L5054) | 5054 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5061) | 5061 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5072) | 5072 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5096) | 5096 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5100) | 5100 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5104) | 5104 |
| [`getDefaultMountType`](../../interface/application.js#L5117) | 5117 |
| [`renderDeviceMountOptions`](../../interface/application.js#L5120) | 5120 |
| [`updateDeviceMountChoices`](../../interface/application.js#L5125) | 5125 |
| [`initialiseNotesEditor`](../../interface/application.js#L5138) | 5138 |
| [`inlineMarkdown`](../../interface/application.js#L5143) | 5143 |
| [`render`](../../interface/application.js#L5156) | 5156 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5190) | 5190 |
| [`activate`](../../interface/application.js#L5557) | 5557 |
| [`openDeviceModal`](../../interface/application.js#L5621) | 5621 |
| [`syncVmPurpose`](../../interface/application.js#L5652) | 5652 |
| [`clearFieldError`](../../interface/application.js#L5701) | 5701 |
| [`captureDeviceFormDraft`](../../interface/application.js#L5720) | 5720 |
| [`createRackFromDevice`](../../interface/application.js#L5750) | 5750 |
| [`cancelRackFromDevice`](../../interface/application.js#L5758) | 5758 |
| [`createSubnetFromDevice`](../../interface/application.js#L5768) | 5768 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L5781) | 5781 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L5795) | 5795 |
| [`addCustomLocationOption`](../../interface/application.js#L5806) | 5806 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L5844) | 5844 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L5856) | 5856 |
| [`finish`](../../interface/application.js#L5876) | 5876 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L5901) | 5901 |
| [`finish`](../../interface/application.js#L5915) | 5915 |
| [`handleDeviceSubmit`](../../interface/application.js#L5935) | 5935 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L5974) | 5974 |
| [`deleteDevice`](../../interface/application.js#L6106) | 6106 |
| [`personalSafeStorageGet`](../../interface/application.js#L6163) | 6163 |
| [`openBackupExplanationDialog`](../../interface/application.js#L6168) | 6168 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L6178) | 6178 |
| [`button`](../../interface/application.js#L6179) | 6179 |
| [`themeChoice`](../../interface/application.js#L6183) | 6183 |
| [`guideLinks`](../../interface/application.js#L6200) | 6200 |
| [`loadApprovedSmtpSettings`](../../interface/application.js#L6231) | 6231 |
| [`renderApplicationSettings`](../../interface/application.js#L6246) | 6246 |
| [`syncSmtpForm`](../../interface/application.js#L6250) | 6250 |
| [`updateApprovedSmtpFields`](../../interface/application.js#L6272) | 6272 |
| [`hydrateApprovedSettings`](../../interface/application.js#L6285) | 6285 |
| [`caffootCompareVersions`](../../interface/application.js#L6306) | 6306 |
| [`parse`](../../interface/application.js#L6307) | 6307 |
| [`caffootShowLicences`](../../interface/application.js#L6329) | 6329 |
| [`caffootUpdateGuide`](../../interface/application.js#L6334) | 6334 |
| [`caffootCheckUpdates`](../../interface/application.js#L6339) | 6339 |
| [`checkInventorySafety`](../../interface/application.js#L6370) | 6370 |
| [`requestInventoryReset`](../../interface/application.js#L6393) | 6393 |
| [`createInventoryBackup`](../../interface/application.js#L6420) | 6420 |
| [`validateBackupVersion`](../../interface/application.js#L6432) | 6432 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L6447) | 6447 |
| [`exportData`](../../interface/application.js#L6455) | 6455 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L6468) | 6468 |
| [`validateBackupStructure`](../../interface/application.js#L6483) | 6483 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L6500) | 6500 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L6512) | 6512 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L6550) | 6550 |
| [`findRackImportConflicts`](../../interface/application.js#L6554) | 6554 |
| [`place`](../../interface/application.js#L6560) | 6560 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L6603) | 6603 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L6624) | 6624 |
| [`showBackupImportError`](../../interface/application.js#L6629) | 6629 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L6633) | 6633 |
| [`finish`](../../interface/application.js#L6643) | 6643 |
| [`onClick`](../../interface/application.js#L6652) | 6652 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L6662) | 6662 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L6673) | 6673 |
| [`finish`](../../interface/application.js#L6684) | 6684 |
| [`onClick`](../../interface/application.js#L6693) | 6693 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L6708) | 6708 |
| [`importData`](../../interface/application.js#L6724) | 6724 |
| [`reader.onload`](../../interface/application.js#L6734) | 6734 |
| [`reader.onerror`](../../interface/application.js#L6808) | 6808 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L6936) | 6936 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L6952) | 6952 |
| [`openRackAccessoryEditor`](../../interface/application.js#L6963) | 6963 |
| [`refreshAccessoryOptions`](../../interface/application.js#L6997) | 6997 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L7054) | 7054 |
| [`cancel`](../../interface/application.js#L7066) | 7066 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L7082) | 7082 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L7099) | 7099 |
| [`clearRackDropPreview`](../../interface/application.js#L7124) | 7124 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L7128) | 7128 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L7140) | 7140 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L7146) | 7146 |
| [`trackRackDrag`](../../interface/application.js#L7155) | 7155 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L7186) | 7186 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L7196) | 7196 |
| [`getRackDropPosition`](../../interface/application.js#L7280) | 7280 |
| [`window.onload`](../../interface/application.js#L7724) | 7724 |
| [`refreshCentralInventory`](../../interface/application.js#L7739) | 7739 |
| [`postInventory`](../../interface/application.js#L7760) | 7760 |
| [`isBlockedAction`](../../interface/application.js#L7812) | 7812 |
| [`applyAllowedControls`](../../interface/application.js#L7840) | 7840 |
| [`enhanceLongSelects`](../../interface/application.js#L7865) | 7865 |
| [`sync`](../../interface/application.js#L7916) | 7916 |
| [`close`](../../interface/application.js#L7922) | 7922 |
| [`choose`](../../interface/application.js#L7926) | 7926 |
| [`draw`](../../interface/application.js#L7931) | 7931 |
| [`open`](../../interface/application.js#L7949) | 7949 |
| [`enhanceSelects`](../../interface/application.js#L8005) | 8005 |
| [`switchTab`](../../interface/application.js#L8051) | 8051 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L8062) | 8062 |
| [`openDeviceDetailView`](../../interface/application.js#L8088) | 8088 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L8096) | 8096 |
| [`forbidRackMount`](../../interface/application.js#L8124) | 8124 |
| [`openDeviceModal`](../../interface/application.js#L8134) | 8134 |
| [`nextDeviceModalClosed`](../../interface/application.js#L8176) | 8176 |
| [`relatedChanges`](../../interface/application.js#L8182) | 8182 |
| [`saveDevice`](../../interface/application.js#L8193) | 8193 |
| [`reserveForDelete`](../../interface/application.js#L8499) | 8499 |
| [`removeDevice`](../../interface/application.js#L8507) | 8507 |
| [`cancelDelete`](../../interface/application.js#L8533) | 8533 |
| [`saveArchivedInstallation`](../../interface/application.js#L8539) | 8539 |
| [`renderAccountSections`](../../interface/application.js#L8574) | 8574 |
| [`renderApprovedAccountMfaPanel`](../../interface/application.js#L8602) | 8602 |
| [`nextRenderAccount`](../../interface/application.js#L8612) | 8612 |
| [`hydrateApprovedAccount`](../../interface/application.js#L8620) | 8620 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L8674) | 8674 |
| [`loadApprovedAccountProfile`](../../interface/application.js#L8687) | 8687 |
| [`removeApprovedAccountPhoto`](../../interface/application.js#L8703) | 8703 |
| [`nextRenderUsers`](../../interface/application.js#L8712) | 8712 |
| [`profileFields`](../../interface/application.js#L8714) | 8714 |
| [`stat`](../../interface/application.js#L8735) | 8735 |
| [`bars`](../../interface/application.js#L8738) | 8738 |
| [`operation`](../../interface/application.js#L8790) | 8790 |
| [`filterApprovedUserRows`](../../interface/application.js#L8810) | 8810 |
| [`closeUserWorkspace`](../../interface/application.js#L8834) | 8834 |
| [`loadCentralUsers`](../../interface/application.js#L8863) | 8863 |
| [`changeCentralUser`](../../interface/application.js#L8869) | 8869 |
| [`importPanel`](../../interface/application.js#L8880) | 8880 |
| [`cancelImport`](../../interface/application.js#L8884) | 8884 |
| [`nextImportModalClosed`](../../interface/application.js#L8890) | 8890 |
| [`showImportReview`](../../interface/application.js#L8891) | 8891 |
| [`chooseImportFile`](../../interface/application.js#L8931) | 8931 |
| [`actOnImport`](../../interface/application.js#L8948) | 8948 |

## interface/sign-in.js

| Function | Line |
| --- | ---: |
| [`applySignInTheme`](../../interface/sign-in.js#L5) | 5 |
| [`$`](../../interface/sign-in.js#L2) | 2 |
| [`showMfaQr`](../../interface/sign-in.js#L22) | 22 |
| [`showSession`](../../interface/sign-in.js#L30) | 30 |
| [`request`](../../interface/sign-in.js#L47) | 47 |
| [`display`](../../interface/sign-in.js#L51) | 51 |
| [`loadUsers`](../../interface/sign-in.js#L149) | 149 |
| [`adminAction`](../../interface/sign-in.js#L174) | 174 |

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
