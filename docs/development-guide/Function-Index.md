# Caffoot Lite — Function Index

This is the current function map for the modular Issue #282 source tree in the same commit as this index. It replaces the older HTML-only navigation map; the [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains available in history.

The map lists named JavaScript declarations and named function/arrow assignments in the three application scripts, plus Python functions and methods in `backend/`. Tests, anonymous callbacks, third-party QR code code and generated HTML fragments are excluded. Nested Python functions include their enclosing names. It is a declaration map, not a call graph or permission to remove a function. Read event dispatch, aliases and API callers before changing code.

**Recorded definitions: 605.** The links refer to the current branch files and line positions. Regenerate after moving or renaming functions. See [Modular Interface](Modular-Interface.md) and the [Function And Code Reference](07-Function-and-Code-Reference.md).

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
| [`renderApprovedSectionHeader`](../../interface/application.js#L1066) | 1066 |
| [`tab`](../../interface/application.js#L1067) | 1067 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1094) | 1094 |
| [`renderContent`](../../interface/application.js#L1105) | 1105 |
| [`updateScrollHint`](../../interface/application.js#L1139) | 1139 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1150) | 1150 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1185) | 1185 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1189) | 1189 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1193) | 1193 |
| [`buildInventoryReportData`](../../interface/application.js#L1199) | 1199 |
| [`occupancy`](../../interface/application.js#L1215) | 1215 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1238) | 1238 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1244) | 1244 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1270) | 1270 |
| [`renderDashboardHTML`](../../interface/application.js#L1289) | 1289 |
| [`statusPill`](../../interface/application.js#L1392) | 1392 |
| [`insightSegment`](../../interface/application.js#L1409) | 1409 |
| [`getCategoryIcon`](../../interface/application.js#L1450) | 1450 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1465) | 1465 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1474) | 1474 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1479) | 1479 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1494) | 1494 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1509) | 1509 |
| [`printRackElevation`](../../interface/application.js#L1519) | 1519 |
| [`safe`](../../interface/application.js#L1522) | 1522 |
| [`printRackElevationInFrame`](../../interface/application.js#L1553) | 1553 |
| [`renderRackHubV13`](../../interface/application.js#L1584) | 1584 |
| [`card`](../../interface/application.js#L1589) | 1589 |
| [`mark`](../../interface/application.js#L1598) | 1598 |
| [`bar`](../../interface/application.js#L1614) | 1614 |
| [`chartBox`](../../interface/application.js#L1615) | 1615 |
| [`chartRows`](../../interface/application.js#L1616) | 1616 |
| [`rackSpaceGuide`](../../interface/application.js#L1618) | 1618 |
| [`renderRacksHTML`](../../interface/application.js#L1687) | 1687 |
| [`changeRack`](../../interface/application.js#L1754) | 1754 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1773) | 1773 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1780) | 1780 |
| [`getVisibleDevices`](../../interface/application.js#L1786) | 1786 |
| [`filterHardwareModels`](../../interface/application.js#L1811) | 1811 |
| [`openApprovedCatalogueModal`](../../interface/application.js#L1850) | 1850 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1859) | 1859 |
| [`saveHardwareManufacturer`](../../interface/application.js#L1883) | 1883 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L1921) | 1921 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L1933) | 1933 |
| [`renderCatalogueButton`](../../interface/application.js#L1950) | 1950 |
| [`renderCatalogueRecord`](../../interface/application.js#L1954) | 1954 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L1959) | 1959 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L1978) | 1978 |
| [`add`](../../interface/application.js#L1980) | 1980 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2025) | 2025 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2032) | 2032 |
| [`openHardwareModelManager`](../../interface/application.js#L2044) | 2044 |
| [`opts`](../../interface/application.js#L2049) | 2049 |
| [`saveHardwareModel`](../../interface/application.js#L2067) | 2067 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2096) | 2096 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2110) | 2110 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2132) | 2132 |
| [`add`](../../interface/application.js#L2134) | 2134 |
| [`options`](../../interface/application.js#L2170) | 2170 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2184) | 2184 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2199) | 2199 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2214) | 2214 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2222) | 2222 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2233) | 2233 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2242) | 2242 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2264) | 2264 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2275) | 2275 |
| [`openServerServiceEditor`](../../interface/application.js#L2292) | 2292 |
| [`saveServerServiceEntry`](../../interface/application.js#L2301) | 2301 |
| [`restoreArchivedServerService`](../../interface/application.js#L2314) | 2314 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2323) | 2323 |
| [`renderDevicesHTML`](../../interface/application.js#L2335) | 2335 |
| [`approvedHardwareMetric`](../../interface/application.js#L2343) | 2343 |
| [`approvedHardwareChart`](../../interface/application.js#L2348) | 2348 |
| [`approvedDeviceInsightChart`](../../interface/application.js#L2358) | 2358 |
| [`approvedDeviceQualityCards`](../../interface/application.js#L2377) | 2377 |
| [`approvedArchivedSoftwareHtml`](../../interface/application.js#L2385) | 2385 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2420) | 2420 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2427) | 2427 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2428) | 2428 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2429) | 2429 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2432) | 2432 |
| [`openManageTypesModal`](../../interface/application.js#L2448) | 2448 |
| [`openManageLocationsModal`](../../interface/application.js#L2449) | 2449 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2452) | 2452 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2474) | 2474 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2481) | 2481 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2489) | 2489 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2509) | 2509 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2510) | 2510 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2511) | 2511 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2526) | 2526 |
| [`deleteDeviceType`](../../interface/application.js#L2546) | 2546 |
| [`deleteDeviceLocation`](../../interface/application.js#L2547) | 2547 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2555) | 2555 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2559) | 2559 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2585) | 2585 |
| [`nodes`](../../interface/application.js#L2595) | 2595 |
| [`renderApprovedIpamManage`](../../interface/application.js#L2621) | 2621 |
| [`renderIpamHTML`](../../interface/application.js#L2671) | 2671 |
| [`changeSubnet`](../../interface/application.js#L2830) | 2830 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2843) | 2843 |
| [`openApprovedIpamModal`](../../interface/application.js#L2869) | 2869 |
| [`openBulkIpModal`](../../interface/application.js#L2874) | 2874 |
| [`approvedBulkConfirm`](../../interface/application.js#L2881) | 2881 |
| [`handleBulkIpSubmit`](../../interface/application.js#L2885) | 2885 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L2904) | 2904 |
| [`applyBulkIpChanges`](../../interface/application.js#L2920) | 2920 |
| [`subnetCidrFeedback`](../../interface/application.js#L2934) | 2934 |
| [`suggestSubnetGateway`](../../interface/application.js#L2952) | 2952 |
| [`openSubnetModal`](../../interface/application.js#L2980) | 2980 |
| [`updateSubnetTypePreview`](../../interface/application.js#L2984) | 2984 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3008) | 3008 |
| [`handleSubnetSubmit`](../../interface/application.js#L3028) | 3028 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3221) | 3221 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3225) | 3225 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3230) | 3230 |
| [`approvedDeletionBlocked`](../../interface/application.js#L3251) | 3251 |
| [`approvedDeletionConfirm`](../../interface/application.js#L3255) | 3255 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3259) | 3259 |
| [`deleteSubnet`](../../interface/application.js#L3270) | 3270 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3330) | 3330 |
| [`deleteSubnetCommit`](../../interface/application.js#L3358) | 3358 |
| [`deleteVlan`](../../interface/application.js#L3388) | 3388 |
| [`openIpModal`](../../interface/application.js#L3414) | 3414 |
| [`handleIpSubmit`](../../interface/application.js#L3431) | 3431 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3497) | 3497 |
| [`modalFormSnapshot`](../../interface/application.js#L3507) | 3507 |
| [`rememberModalForm`](../../interface/application.js#L3512) | 3512 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3517) | 3517 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3536) | 3536 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3555) | 3555 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3564) | 3564 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3570) | 3570 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3576) | 3576 |
| [`closeModal`](../../interface/application.js#L3585) | 3585 |
| [`openModal`](../../interface/application.js#L3610) | 3610 |
| [`readRackDimension`](../../interface/application.js#L3683) | 3683 |
| [`formatRackDimension`](../../interface/application.js#L3690) | 3690 |
| [`rackPhysicalDetails`](../../interface/application.js#L3695) | 3695 |
| [`openRackModal`](../../interface/application.js#L3704) | 3704 |
| [`handleRackSubmit`](../../interface/application.js#L3720) | 3720 |
| [`deleteRack`](../../interface/application.js#L3787) | 3787 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3809) | 3809 |
| [`refresh`](../../interface/application.js#L3832) | 3832 |
| [`openAssignDeviceModal`](../../interface/application.js#L3909) | 3909 |
| [`refresh`](../../interface/application.js#L3926) | 3926 |
| [`refreshAssignStartPositions`](../../interface/application.js#L3933) | 3933 |
| [`handleAssignSubmit`](../../interface/application.js#L3967) | 3967 |
| [`unassignDevice`](../../interface/application.js#L4012) | 4012 |
| [`getSubnetForIp`](../../interface/application.js#L4029) | 4029 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4033) | 4033 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4077) | 4077 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4086) | 4086 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4095) | 4095 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4117) | 4117 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4127) | 4127 |
| [`toggleDeviceMountType`](../../interface/application.js#L4171) | 4171 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4192) | 4192 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4197) | 4197 |
| [`openApprovedDeviceReviewModal`](../../interface/application.js#L4215) | 4215 |
| [`openDeviceDetailView`](../../interface/application.js#L4220) | 4220 |
| [`safe`](../../interface/application.js#L4230) | 4230 |
| [`field`](../../interface/application.js#L4231) | 4231 |
| [`section`](../../interface/application.js#L4232) | 4232 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4275) | 4275 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4281) | 4281 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4300) | 4300 |
| [`navigateToDeviceRack`](../../interface/application.js#L4316) | 4316 |
| [`duplicateDevice`](../../interface/application.js#L4344) | 4344 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4414) | 4414 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4419) | 4419 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4424) | 4424 |
| [`openServerServiceManager`](../../interface/application.js#L4425) | 4425 |
| [`captureServerServiceSelections`](../../interface/application.js#L4430) | 4430 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4436) | 4436 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4457) | 4457 |
| [`archiveServerService`](../../interface/application.js#L4465) | 4465 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4489) | 4489 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4493) | 4493 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4511) | 4511 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4515) | 4515 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4518) | 4518 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4525) | 4525 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4553) | 4553 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4557) | 4557 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4598) | 4598 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4631) | 4631 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4648) | 4648 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4651) | 4651 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4652) | 4652 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4657) | 4657 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4663) | 4663 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4699) | 4699 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4700) | 4700 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4707) | 4707 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4708) | 4708 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4723) | 4723 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4727) | 4727 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4730) | 4730 |
| [`isSoftwareDetailField`](../../interface/application.js#L4737) | 4737 |
| [`renderApprovedInlineDevicePicker`](../../interface/application.js#L4744) | 4744 |
| [`updateApprovedInlinePickerCount`](../../interface/application.js#L4754) | 4754 |
| [`openApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4760) | 4760 |
| [`cancelApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4773) | 4773 |
| [`saveApprovedInlineDeviceQuickAdd`](../../interface/application.js#L4782) | 4782 |
| [`fail`](../../interface/application.js#L4788) | 4788 |
| [`renderApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4840) | 4840 |
| [`saveApprovedInlineHardwareQuickAdd`](../../interface/application.js#L4856) | 4856 |
| [`fail`](../../interface/application.js#L4861) | 4861 |
| [`renderDeviceDetailFields`](../../interface/application.js#L4908) | 4908 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L4938) | 4938 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L4944) | 4944 |
| [`getPlatformVersionOptions`](../../interface/application.js#L4964) | 4964 |
| [`isWindowsPlatform`](../../interface/application.js#L4967) | 4967 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L4970) | 4970 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L4979) | 4979 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5016) | 5016 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5024) | 5024 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5034) | 5034 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L5038) | 5038 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5045) | 5045 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5056) | 5056 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5080) | 5080 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5084) | 5084 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5088) | 5088 |
| [`getDefaultMountType`](../../interface/application.js#L5101) | 5101 |
| [`renderDeviceMountOptions`](../../interface/application.js#L5104) | 5104 |
| [`updateDeviceMountChoices`](../../interface/application.js#L5109) | 5109 |
| [`initialiseNotesEditor`](../../interface/application.js#L5122) | 5122 |
| [`inlineMarkdown`](../../interface/application.js#L5127) | 5127 |
| [`render`](../../interface/application.js#L5140) | 5140 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5174) | 5174 |
| [`activate`](../../interface/application.js#L5541) | 5541 |
| [`openDeviceModal`](../../interface/application.js#L5605) | 5605 |
| [`syncVmPurpose`](../../interface/application.js#L5636) | 5636 |
| [`clearFieldError`](../../interface/application.js#L5685) | 5685 |
| [`captureDeviceFormDraft`](../../interface/application.js#L5704) | 5704 |
| [`createRackFromDevice`](../../interface/application.js#L5734) | 5734 |
| [`cancelRackFromDevice`](../../interface/application.js#L5742) | 5742 |
| [`createSubnetFromDevice`](../../interface/application.js#L5752) | 5752 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L5765) | 5765 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L5779) | 5779 |
| [`addCustomLocationOption`](../../interface/application.js#L5790) | 5790 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L5828) | 5828 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L5840) | 5840 |
| [`finish`](../../interface/application.js#L5860) | 5860 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L5885) | 5885 |
| [`finish`](../../interface/application.js#L5899) | 5899 |
| [`handleDeviceSubmit`](../../interface/application.js#L5919) | 5919 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L5958) | 5958 |
| [`deleteDevice`](../../interface/application.js#L6090) | 6090 |
| [`personalSafeStorageGet`](../../interface/application.js#L6147) | 6147 |
| [`openBackupExplanationDialog`](../../interface/application.js#L6152) | 6152 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L6162) | 6162 |
| [`button`](../../interface/application.js#L6163) | 6163 |
| [`themeChoice`](../../interface/application.js#L6167) | 6167 |
| [`guideLinks`](../../interface/application.js#L6184) | 6184 |
| [`loadApprovedSmtpSettings`](../../interface/application.js#L6215) | 6215 |
| [`renderApplicationSettings`](../../interface/application.js#L6230) | 6230 |
| [`syncSmtpForm`](../../interface/application.js#L6234) | 6234 |
| [`updateApprovedSmtpFields`](../../interface/application.js#L6256) | 6256 |
| [`hydrateApprovedSettings`](../../interface/application.js#L6269) | 6269 |
| [`caffootCompareVersions`](../../interface/application.js#L6290) | 6290 |
| [`parse`](../../interface/application.js#L6291) | 6291 |
| [`caffootShowLicences`](../../interface/application.js#L6313) | 6313 |
| [`caffootUpdateGuide`](../../interface/application.js#L6318) | 6318 |
| [`caffootCheckUpdates`](../../interface/application.js#L6323) | 6323 |
| [`checkInventorySafety`](../../interface/application.js#L6354) | 6354 |
| [`requestInventoryReset`](../../interface/application.js#L6377) | 6377 |
| [`createInventoryBackup`](../../interface/application.js#L6404) | 6404 |
| [`validateBackupVersion`](../../interface/application.js#L6416) | 6416 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L6431) | 6431 |
| [`exportData`](../../interface/application.js#L6439) | 6439 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L6452) | 6452 |
| [`validateBackupStructure`](../../interface/application.js#L6467) | 6467 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L6484) | 6484 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L6496) | 6496 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L6534) | 6534 |
| [`findRackImportConflicts`](../../interface/application.js#L6538) | 6538 |
| [`place`](../../interface/application.js#L6544) | 6544 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L6587) | 6587 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L6608) | 6608 |
| [`showBackupImportError`](../../interface/application.js#L6613) | 6613 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L6617) | 6617 |
| [`finish`](../../interface/application.js#L6627) | 6627 |
| [`onClick`](../../interface/application.js#L6636) | 6636 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L6646) | 6646 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L6657) | 6657 |
| [`finish`](../../interface/application.js#L6668) | 6668 |
| [`onClick`](../../interface/application.js#L6677) | 6677 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L6692) | 6692 |
| [`importData`](../../interface/application.js#L6708) | 6708 |
| [`reader.onload`](../../interface/application.js#L6718) | 6718 |
| [`reader.onerror`](../../interface/application.js#L6792) | 6792 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L6920) | 6920 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L6936) | 6936 |
| [`openRackAccessoryEditor`](../../interface/application.js#L6947) | 6947 |
| [`refreshAccessoryOptions`](../../interface/application.js#L6981) | 6981 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L7038) | 7038 |
| [`cancel`](../../interface/application.js#L7050) | 7050 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L7066) | 7066 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L7083) | 7083 |
| [`clearRackDropPreview`](../../interface/application.js#L7108) | 7108 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L7112) | 7112 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L7124) | 7124 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L7130) | 7130 |
| [`trackRackDrag`](../../interface/application.js#L7139) | 7139 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L7170) | 7170 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L7180) | 7180 |
| [`getRackDropPosition`](../../interface/application.js#L7264) | 7264 |
| [`window.onload`](../../interface/application.js#L7708) | 7708 |
| [`refreshCentralInventory`](../../interface/application.js#L7723) | 7723 |
| [`postInventory`](../../interface/application.js#L7744) | 7744 |
| [`isBlockedAction`](../../interface/application.js#L7796) | 7796 |
| [`applyAllowedControls`](../../interface/application.js#L7824) | 7824 |
| [`enhanceLongSelects`](../../interface/application.js#L7849) | 7849 |
| [`sync`](../../interface/application.js#L7900) | 7900 |
| [`close`](../../interface/application.js#L7906) | 7906 |
| [`choose`](../../interface/application.js#L7910) | 7910 |
| [`draw`](../../interface/application.js#L7915) | 7915 |
| [`open`](../../interface/application.js#L7933) | 7933 |
| [`enhanceSelects`](../../interface/application.js#L7989) | 7989 |
| [`switchTab`](../../interface/application.js#L8035) | 8035 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L8046) | 8046 |
| [`openDeviceDetailView`](../../interface/application.js#L8072) | 8072 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L8080) | 8080 |
| [`forbidRackMount`](../../interface/application.js#L8108) | 8108 |
| [`openDeviceModal`](../../interface/application.js#L8118) | 8118 |
| [`nextDeviceModalClosed`](../../interface/application.js#L8160) | 8160 |
| [`relatedChanges`](../../interface/application.js#L8166) | 8166 |
| [`saveDevice`](../../interface/application.js#L8177) | 8177 |
| [`reserveForDelete`](../../interface/application.js#L8483) | 8483 |
| [`removeDevice`](../../interface/application.js#L8491) | 8491 |
| [`cancelDelete`](../../interface/application.js#L8517) | 8517 |
| [`saveArchivedInstallation`](../../interface/application.js#L8523) | 8523 |
| [`renderAccountSections`](../../interface/application.js#L8558) | 8558 |
| [`renderApprovedAccountMfaPanel`](../../interface/application.js#L8586) | 8586 |
| [`nextRenderAccount`](../../interface/application.js#L8596) | 8596 |
| [`hydrateApprovedAccount`](../../interface/application.js#L8604) | 8604 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L8658) | 8658 |
| [`loadApprovedAccountProfile`](../../interface/application.js#L8671) | 8671 |
| [`removeApprovedAccountPhoto`](../../interface/application.js#L8687) | 8687 |
| [`nextRenderUsers`](../../interface/application.js#L8696) | 8696 |
| [`profileFields`](../../interface/application.js#L8698) | 8698 |
| [`stat`](../../interface/application.js#L8719) | 8719 |
| [`bars`](../../interface/application.js#L8722) | 8722 |
| [`operation`](../../interface/application.js#L8774) | 8774 |
| [`filterApprovedUserRows`](../../interface/application.js#L8794) | 8794 |
| [`closeUserWorkspace`](../../interface/application.js#L8818) | 8818 |
| [`loadCentralUsers`](../../interface/application.js#L8847) | 8847 |
| [`changeCentralUser`](../../interface/application.js#L8853) | 8853 |
| [`importPanel`](../../interface/application.js#L8864) | 8864 |
| [`cancelImport`](../../interface/application.js#L8868) | 8868 |
| [`nextImportModalClosed`](../../interface/application.js#L8874) | 8874 |
| [`showImportReview`](../../interface/application.js#L8875) | 8875 |
| [`chooseImportFile`](../../interface/application.js#L8915) | 8915 |
| [`actOnImport`](../../interface/application.js#L8932) | 8932 |

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
