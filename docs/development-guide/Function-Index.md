# Caffoot Lite — Function Index

This is the current function map for the modular Issue #282 source tree in the same commit as this index. It replaces the older HTML-only navigation map; the [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains available in history.

The map lists named JavaScript declarations and named function/arrow assignments in the three application scripts, plus Python functions and methods in `backend/`. Tests, anonymous callbacks, third-party QR code code and generated HTML fragments are excluded. Nested Python functions include their enclosing names. It is a declaration map, not a call graph or permission to remove a function. Read event dispatch, aliases and API callers before changing code.

**Recorded definitions: 603.** The links refer to the current branch files and line positions. Regenerate after moving or renaming functions. See [Modular Interface](Modular-Interface.md) and the [Function And Code Reference](07-Function-and-Code-Reference.md).

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
| [`escapeHtml`](../../interface/application.js#L1037) | 1037 |
| [`inlineJsArg`](../../interface/application.js#L1046) | 1046 |
| [`browserStorageWarning`](../../interface/application.js#L1054) | 1054 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1057) | 1057 |
| [`renderApprovedSectionHeader`](../../interface/application.js#L1065) | 1065 |
| [`tab`](../../interface/application.js#L1066) | 1066 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1093) | 1093 |
| [`renderContent`](../../interface/application.js#L1104) | 1104 |
| [`updateScrollHint`](../../interface/application.js#L1138) | 1138 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1149) | 1149 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1184) | 1184 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1188) | 1188 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1192) | 1192 |
| [`buildInventoryReportData`](../../interface/application.js#L1198) | 1198 |
| [`occupancy`](../../interface/application.js#L1214) | 1214 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1237) | 1237 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1243) | 1243 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1269) | 1269 |
| [`renderDashboardHTML`](../../interface/application.js#L1288) | 1288 |
| [`statusPill`](../../interface/application.js#L1391) | 1391 |
| [`insightSegment`](../../interface/application.js#L1408) | 1408 |
| [`getCategoryIcon`](../../interface/application.js#L1449) | 1449 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1464) | 1464 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1473) | 1473 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1478) | 1478 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1493) | 1493 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1508) | 1508 |
| [`printRackElevation`](../../interface/application.js#L1518) | 1518 |
| [`safe`](../../interface/application.js#L1523) | 1523 |
| [`renderRackHubV13`](../../interface/application.js#L1547) | 1547 |
| [`card`](../../interface/application.js#L1552) | 1552 |
| [`mark`](../../interface/application.js#L1561) | 1561 |
| [`bar`](../../interface/application.js#L1577) | 1577 |
| [`chartBox`](../../interface/application.js#L1578) | 1578 |
| [`chartRows`](../../interface/application.js#L1579) | 1579 |
| [`rackSpaceGuide`](../../interface/application.js#L1581) | 1581 |
| [`renderRacksHTML`](../../interface/application.js#L1650) | 1650 |
| [`changeRack`](../../interface/application.js#L1717) | 1717 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1736) | 1736 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1743) | 1743 |
| [`getVisibleDevices`](../../interface/application.js#L1749) | 1749 |
| [`filterHardwareModels`](../../interface/application.js#L1774) | 1774 |
| [`openApprovedCatalogueModal`](../../interface/application.js#L1813) | 1813 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1822) | 1822 |
| [`saveHardwareManufacturer`](../../interface/application.js#L1846) | 1846 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L1884) | 1884 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L1896) | 1896 |
| [`renderCatalogueButton`](../../interface/application.js#L1913) | 1913 |
| [`renderCatalogueRecord`](../../interface/application.js#L1917) | 1917 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L1922) | 1922 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L1941) | 1941 |
| [`add`](../../interface/application.js#L1943) | 1943 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L1988) | 1988 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L1995) | 1995 |
| [`openHardwareModelManager`](../../interface/application.js#L2007) | 2007 |
| [`opts`](../../interface/application.js#L2012) | 2012 |
| [`saveHardwareModel`](../../interface/application.js#L2030) | 2030 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2059) | 2059 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2073) | 2073 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2095) | 2095 |
| [`add`](../../interface/application.js#L2097) | 2097 |
| [`options`](../../interface/application.js#L2133) | 2133 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2147) | 2147 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2162) | 2162 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2177) | 2177 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2185) | 2185 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2196) | 2196 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2205) | 2205 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2227) | 2227 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2238) | 2238 |
| [`openServerServiceEditor`](../../interface/application.js#L2255) | 2255 |
| [`saveServerServiceEntry`](../../interface/application.js#L2264) | 2264 |
| [`restoreArchivedServerService`](../../interface/application.js#L2277) | 2277 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2286) | 2286 |
| [`renderDevicesHTML`](../../interface/application.js#L2298) | 2298 |
| [`approvedHardwareMetric`](../../interface/application.js#L2306) | 2306 |
| [`approvedHardwareChart`](../../interface/application.js#L2311) | 2311 |
| [`approvedDeviceInsightChart`](../../interface/application.js#L2321) | 2321 |
| [`approvedDeviceQualityCards`](../../interface/application.js#L2340) | 2340 |
| [`approvedArchivedSoftwareHtml`](../../interface/application.js#L2348) | 2348 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2383) | 2383 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2390) | 2390 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2391) | 2391 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2392) | 2392 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2395) | 2395 |
| [`openManageTypesModal`](../../interface/application.js#L2411) | 2411 |
| [`openManageLocationsModal`](../../interface/application.js#L2412) | 2412 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2415) | 2415 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2437) | 2437 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2444) | 2444 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2452) | 2452 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2472) | 2472 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2473) | 2473 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2474) | 2474 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2489) | 2489 |
| [`deleteDeviceType`](../../interface/application.js#L2509) | 2509 |
| [`deleteDeviceLocation`](../../interface/application.js#L2510) | 2510 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2518) | 2518 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2522) | 2522 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2548) | 2548 |
| [`nodes`](../../interface/application.js#L2558) | 2558 |
| [`renderApprovedIpamManage`](../../interface/application.js#L2584) | 2584 |
| [`renderIpamHTML`](../../interface/application.js#L2634) | 2634 |
| [`changeSubnet`](../../interface/application.js#L2793) | 2793 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2806) | 2806 |
| [`openApprovedIpamModal`](../../interface/application.js#L2832) | 2832 |
| [`openBulkIpModal`](../../interface/application.js#L2837) | 2837 |
| [`approvedBulkConfirm`](../../interface/application.js#L2844) | 2844 |
| [`handleBulkIpSubmit`](../../interface/application.js#L2848) | 2848 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L2867) | 2867 |
| [`applyBulkIpChanges`](../../interface/application.js#L2883) | 2883 |
| [`subnetCidrFeedback`](../../interface/application.js#L2897) | 2897 |
| [`suggestSubnetGateway`](../../interface/application.js#L2915) | 2915 |
| [`openSubnetModal`](../../interface/application.js#L2943) | 2943 |
| [`updateSubnetTypePreview`](../../interface/application.js#L2947) | 2947 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L2971) | 2971 |
| [`handleSubnetSubmit`](../../interface/application.js#L2991) | 2991 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3184) | 3184 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3188) | 3188 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3193) | 3193 |
| [`approvedDeletionBlocked`](../../interface/application.js#L3214) | 3214 |
| [`approvedDeletionConfirm`](../../interface/application.js#L3218) | 3218 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3222) | 3222 |
| [`deleteSubnet`](../../interface/application.js#L3233) | 3233 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3293) | 3293 |
| [`deleteSubnetCommit`](../../interface/application.js#L3321) | 3321 |
| [`deleteVlan`](../../interface/application.js#L3351) | 3351 |
| [`openIpModal`](../../interface/application.js#L3377) | 3377 |
| [`handleIpSubmit`](../../interface/application.js#L3394) | 3394 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3460) | 3460 |
| [`modalFormSnapshot`](../../interface/application.js#L3470) | 3470 |
| [`rememberModalForm`](../../interface/application.js#L3475) | 3475 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3480) | 3480 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3499) | 3499 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3518) | 3518 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3527) | 3527 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3533) | 3533 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3539) | 3539 |
| [`closeModal`](../../interface/application.js#L3548) | 3548 |
| [`openModal`](../../interface/application.js#L3573) | 3573 |
| [`rackPhysicalDetails`](../../interface/application.js#L3646) | 3646 |
| [`dimension`](../../interface/application.js#L3647) | 3647 |
| [`openRackModal`](../../interface/application.js#L3660) | 3660 |
| [`handleRackSubmit`](../../interface/application.js#L3676) | 3676 |
| [`deleteRack`](../../interface/application.js#L3743) | 3743 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3765) | 3765 |
| [`refresh`](../../interface/application.js#L3788) | 3788 |
| [`openAssignDeviceModal`](../../interface/application.js#L3865) | 3865 |
| [`refresh`](../../interface/application.js#L3882) | 3882 |
| [`refreshAssignStartPositions`](../../interface/application.js#L3889) | 3889 |
| [`handleAssignSubmit`](../../interface/application.js#L3923) | 3923 |
| [`unassignDevice`](../../interface/application.js#L3968) | 3968 |
| [`getSubnetForIp`](../../interface/application.js#L3985) | 3985 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L3989) | 3989 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4033) | 4033 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4042) | 4042 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4051) | 4051 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4073) | 4073 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4083) | 4083 |
| [`toggleDeviceMountType`](../../interface/application.js#L4127) | 4127 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4148) | 4148 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4153) | 4153 |
| [`openApprovedDeviceReviewModal`](../../interface/application.js#L4171) | 4171 |
| [`openDeviceDetailView`](../../interface/application.js#L4176) | 4176 |
| [`safe`](../../interface/application.js#L4186) | 4186 |
| [`field`](../../interface/application.js#L4187) | 4187 |
| [`section`](../../interface/application.js#L4188) | 4188 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4231) | 4231 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4237) | 4237 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4256) | 4256 |
| [`navigateToDeviceRack`](../../interface/application.js#L4272) | 4272 |
| [`duplicateDevice`](../../interface/application.js#L4300) | 4300 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4370) | 4370 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4375) | 4375 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4380) | 4380 |
| [`openServerServiceManager`](../../interface/application.js#L4381) | 4381 |
| [`captureServerServiceSelections`](../../interface/application.js#L4386) | 4386 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4392) | 4392 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4413) | 4413 |
| [`archiveServerService`](../../interface/application.js#L4421) | 4421 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4445) | 4445 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4449) | 4449 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4467) | 4467 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4471) | 4471 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4474) | 4474 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4481) | 4481 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4509) | 4509 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4513) | 4513 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4554) | 4554 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4587) | 4587 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4604) | 4604 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4607) | 4607 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4608) | 4608 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4613) | 4613 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4619) | 4619 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4655) | 4655 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4656) | 4656 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4663) | 4663 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4664) | 4664 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4679) | 4679 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4683) | 4683 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4686) | 4686 |
| [`isSoftwareDetailField`](../../interface/application.js#L4693) | 4693 |
| [`renderApprovedInlineDevicePicker`](../../interface/application.js#L4700) | 4700 |
| [`updateApprovedInlinePickerCount`](../../interface/application.js#L4710) | 4710 |
| [`openApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4716) | 4716 |
| [`cancelApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4729) | 4729 |
| [`saveApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4738) | 4738 |
| [`fail`](../../interface/application.js#L4744) | 4744 |
| [`renderApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4796) | 4796 |
| [`saveApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4812) | 4812 |
| [`fail`](../../interface/application.js#L4817) | 4817 |
| [`renderDeviceDetailFields`](../../interface/application.js#L4864) | 4864 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L4894) | 4894 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L4900) | 4900 |
| [`getPlatformVersionOptions`](../../interface/application.js#L4920) | 4920 |
| [`isWindowsPlatform`](../../interface/application.js#L4923) | 4923 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L4926) | 4926 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L4935) | 4935 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L4972) | 4972 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L4980) | 4980 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L4990) | 4990 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L4994) | 4994 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5001) | 5001 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5012) | 5012 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5036) | 5036 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5040) | 5040 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5044) | 5044 |
| [`getDefaultMountType`](../../interface/application.js#L5057) | 5057 |
| [`renderDeviceMountOptions`](../../interface/application.js#L5060) | 5060 |
| [`updateDeviceMountChoices`](../../interface/application.js#L5065) | 5065 |
| [`initialiseNotesEditor`](../../interface/application.js#L5078) | 5078 |
| [`inlineMarkdown`](../../interface/application.js#L5083) | 5083 |
| [`render`](../../interface/application.js#L5096) | 5096 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5130) | 5130 |
| [`activate`](../../interface/application.js#L5497) | 5497 |
| [`openDeviceModal`](../../interface/application.js#L5561) | 5561 |
| [`syncVmPurpose`](../../interface/application.js#L5592) | 5592 |
| [`clearFieldError`](../../interface/application.js#L5641) | 5641 |
| [`captureDeviceFormDraft`](../../interface/application.js#L5660) | 5660 |
| [`createRackFromDevice`](../../interface/application.js#L5690) | 5690 |
| [`cancelRackFromDevice`](../../interface/application.js#L5698) | 5698 |
| [`createSubnetFromDevice`](../../interface/application.js#L5708) | 5708 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L5721) | 5721 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L5735) | 5735 |
| [`addCustomLocationOption`](../../interface/application.js#L5746) | 5746 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L5784) | 5784 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L5796) | 5796 |
| [`finish`](../../interface/application.js#L5816) | 5816 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L5841) | 5841 |
| [`finish`](../../interface/application.js#L5855) | 5855 |
| [`handleDeviceSubmit`](../../interface/application.js#L5875) | 5875 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L5914) | 5914 |
| [`deleteDevice`](../../interface/application.js#L6046) | 6046 |
| [`personalSafeStorageGet`](../../interface/application.js#L6103) | 6103 |
| [`openBackupExplanationDialog`](../../interface/application.js#L6108) | 6108 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L6118) | 6118 |
| [`button`](../../interface/application.js#L6119) | 6119 |
| [`themeChoice`](../../interface/application.js#L6123) | 6123 |
| [`guideLinks`](../../interface/application.js#L6140) | 6140 |
| [`loadApprovedSmtpSettings`](../../interface/application.js#L6171) | 6171 |
| [`renderApplicationSettings`](../../interface/application.js#L6186) | 6186 |
| [`syncSmtpForm`](../../interface/application.js#L6190) | 6190 |
| [`updateApprovedSmtpFields`](../../interface/application.js#L6212) | 6212 |
| [`hydrateApprovedSettings`](../../interface/application.js#L6225) | 6225 |
| [`caffootCompareVersions`](../../interface/application.js#L6246) | 6246 |
| [`parse`](../../interface/application.js#L6247) | 6247 |
| [`caffootShowLicences`](../../interface/application.js#L6269) | 6269 |
| [`caffootUpdateGuide`](../../interface/application.js#L6274) | 6274 |
| [`caffootCheckUpdates`](../../interface/application.js#L6279) | 6279 |
| [`checkInventorySafety`](../../interface/application.js#L6310) | 6310 |
| [`requestInventoryReset`](../../interface/application.js#L6333) | 6333 |
| [`createInventoryBackup`](../../interface/application.js#L6360) | 6360 |
| [`validateBackupVersion`](../../interface/application.js#L6372) | 6372 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L6387) | 6387 |
| [`exportData`](../../interface/application.js#L6395) | 6395 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L6408) | 6408 |
| [`validateBackupStructure`](../../interface/application.js#L6423) | 6423 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L6440) | 6440 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L6452) | 6452 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L6490) | 6490 |
| [`findRackImportConflicts`](../../interface/application.js#L6494) | 6494 |
| [`place`](../../interface/application.js#L6500) | 6500 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L6543) | 6543 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L6564) | 6564 |
| [`showBackupImportError`](../../interface/application.js#L6569) | 6569 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L6573) | 6573 |
| [`finish`](../../interface/application.js#L6583) | 6583 |
| [`onClick`](../../interface/application.js#L6592) | 6592 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L6602) | 6602 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L6613) | 6613 |
| [`finish`](../../interface/application.js#L6624) | 6624 |
| [`onClick`](../../interface/application.js#L6633) | 6633 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L6648) | 6648 |
| [`importData`](../../interface/application.js#L6664) | 6664 |
| [`reader.onload`](../../interface/application.js#L6674) | 6674 |
| [`reader.onerror`](../../interface/application.js#L6748) | 6748 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L6876) | 6876 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L6892) | 6892 |
| [`openRackAccessoryEditor`](../../interface/application.js#L6903) | 6903 |
| [`refreshAccessoryOptions`](../../interface/application.js#L6937) | 6937 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L6994) | 6994 |
| [`cancel`](../../interface/application.js#L7006) | 7006 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L7022) | 7022 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L7039) | 7039 |
| [`clearRackDropPreview`](../../interface/application.js#L7064) | 7064 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L7068) | 7068 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L7080) | 7080 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L7086) | 7086 |
| [`trackRackDrag`](../../interface/application.js#L7095) | 7095 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L7126) | 7126 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L7136) | 7136 |
| [`getRackDropPosition`](../../interface/application.js#L7220) | 7220 |
| [`window.onload`](../../interface/application.js#L7664) | 7664 |
| [`refreshCentralInventory`](../../interface/application.js#L7679) | 7679 |
| [`postInventory`](../../interface/application.js#L7700) | 7700 |
| [`isBlockedAction`](../../interface/application.js#L7752) | 7752 |
| [`applyAllowedControls`](../../interface/application.js#L7780) | 7780 |
| [`enhanceLongSelects`](../../interface/application.js#L7805) | 7805 |
| [`sync`](../../interface/application.js#L7856) | 7856 |
| [`close`](../../interface/application.js#L7862) | 7862 |
| [`choose`](../../interface/application.js#L7866) | 7866 |
| [`draw`](../../interface/application.js#L7871) | 7871 |
| [`open`](../../interface/application.js#L7889) | 7889 |
| [`enhanceSelects`](../../interface/application.js#L7945) | 7945 |
| [`switchTab`](../../interface/application.js#L7991) | 7991 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L8002) | 8002 |
| [`openDeviceDetailView`](../../interface/application.js#L8028) | 8028 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L8036) | 8036 |
| [`forbidRackMount`](../../interface/application.js#L8064) | 8064 |
| [`openDeviceModal`](../../interface/application.js#L8074) | 8074 |
| [`nextDeviceModalClosed`](../../interface/application.js#L8116) | 8116 |
| [`relatedChanges`](../../interface/application.js#L8122) | 8122 |
| [`saveDevice`](../../interface/application.js#L8133) | 8133 |
| [`reserveForDelete`](../../interface/application.js#L8439) | 8439 |
| [`removeDevice`](../../interface/application.js#L8447) | 8447 |
| [`cancelDelete`](../../interface/application.js#L8473) | 8473 |
| [`saveArchivedInstallation`](../../interface/application.js#L8479) | 8479 |
| [`renderAccountSections`](../../interface/application.js#L8514) | 8514 |
| [`renderApprovedAccountMfaPanel`](../../interface/application.js#L8542) | 8542 |
| [`nextRenderAccount`](../../interface/application.js#L8552) | 8552 |
| [`hydrateApprovedAccount`](../../interface/application.js#L8560) | 8560 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L8614) | 8614 |
| [`loadApprovedAccountProfile`](../../interface/application.js#L8627) | 8627 |
| [`removeApprovedAccountPhoto`](../../interface/application.js#L8643) | 8643 |
| [`nextRenderUsers`](../../interface/application.js#L8652) | 8652 |
| [`profileFields`](../../interface/application.js#L8654) | 8654 |
| [`stat`](../../interface/application.js#L8675) | 8675 |
| [`bars`](../../interface/application.js#L8678) | 8678 |
| [`operation`](../../interface/application.js#L8730) | 8730 |
| [`filterApprovedUserRows`](../../interface/application.js#L8750) | 8750 |
| [`closeUserWorkspace`](../../interface/application.js#L8774) | 8774 |
| [`loadCentralUsers`](../../interface/application.js#L8803) | 8803 |
| [`changeCentralUser`](../../interface/application.js#L8809) | 8809 |
| [`importPanel`](../../interface/application.js#L8820) | 8820 |
| [`cancelImport`](../../interface/application.js#L8824) | 8824 |
| [`nextImportModalClosed`](../../interface/application.js#L8830) | 8830 |
| [`showImportReview`](../../interface/application.js#L8831) | 8831 |
| [`chooseImportFile`](../../interface/application.js#L8871) | 8871 |
| [`actOnImport`](../../interface/application.js#L8888) | 8888 |

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
