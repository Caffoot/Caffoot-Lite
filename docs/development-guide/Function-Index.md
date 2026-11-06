# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 637.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`hydrateAudit`](../../interface/application.js#L710) | 710 |
| [`applyAuditFilters`](../../interface/application.js#L718) | 718 |
| [`closeAuditDetail`](../../interface/application.js#L753) | 753 |
| [`showAuditDetail`](../../interface/application.js#L759) | 759 |
| [`nextRenderUsers`](../../interface/application.js#L786) | 786 |
| [`nextRenderAccount`](../../interface/application.js#L788) | 788 |
| [`hydrateAccount`](../../interface/application.js#L789) | 789 |
| [`removeAccountPhoto`](../../interface/application.js#L790) | 790 |
| [`saveState`](../../interface/application.js#L793) | 793 |
| [`getDeviceById`](../../interface/application.js#L796) | 796 |
| [`findDeviceUsingIp`](../../interface/application.js#L800) | 800 |
| [`setDevicePrimaryIp`](../../interface/application.js#L805) | 805 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L858) | 858 |
| [`validateRackPlacement`](../../interface/application.js#L871) | 871 |
| [`showToast`](../../interface/application.js#L906) | 906 |
| [`toggleSidebar`](../../interface/application.js#L992) | 992 |
| [`switchTab`](../../interface/application.js#L1011) | 1011 |
| [`escapeHtml`](../../interface/application.js#L1038) | 1038 |
| [`inlineJsArg`](../../interface/application.js#L1047) | 1047 |
| [`browserStorageWarning`](../../interface/application.js#L1055) | 1055 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1058) | 1058 |
| [`renderSectionTabIcon`](../../interface/application.js#L1064) | 1064 |
| [`renderSectionHeader`](../../interface/application.js#L1070) | 1070 |
| [`tab`](../../interface/application.js#L1071) | 1071 |
| [`revealSectionTab`](../../interface/application.js#L1098) | 1098 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1105) | 1105 |
| [`renderContent`](../../interface/application.js#L1121) | 1121 |
| [`updateScrollHint`](../../interface/application.js#L1157) | 1157 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1168) | 1168 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1203) | 1203 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1207) | 1207 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1211) | 1211 |
| [`buildInventoryReportData`](../../interface/application.js#L1217) | 1217 |
| [`occupancy`](../../interface/application.js#L1233) | 1233 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1256) | 1256 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1262) | 1262 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1288) | 1288 |
| [`renderDashboardHTML`](../../interface/application.js#L1307) | 1307 |
| [`statusPill`](../../interface/application.js#L1410) | 1410 |
| [`insightSegment`](../../interface/application.js#L1427) | 1427 |
| [`getCategoryIcon`](../../interface/application.js#L1468) | 1468 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1483) | 1483 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1492) | 1492 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1497) | 1497 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1512) | 1512 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1527) | 1527 |
| [`printRackElevation`](../../interface/application.js#L1537) | 1537 |
| [`safe`](../../interface/application.js#L1540) | 1540 |
| [`printRackElevationInFrame`](../../interface/application.js#L1571) | 1571 |
| [`frame.onload`](../../interface/application.js#L1581) | 1581 |
| [`renderRackHubV13`](../../interface/application.js#L1602) | 1602 |
| [`card`](../../interface/application.js#L1607) | 1607 |
| [`mark`](../../interface/application.js#L1616) | 1616 |
| [`bar`](../../interface/application.js#L1632) | 1632 |
| [`chartBox`](../../interface/application.js#L1633) | 1633 |
| [`chartRows`](../../interface/application.js#L1634) | 1634 |
| [`rackSpaceGuide`](../../interface/application.js#L1636) | 1636 |
| [`renderRacksHTML`](../../interface/application.js#L1705) | 1705 |
| [`changeRack`](../../interface/application.js#L1772) | 1772 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1791) | 1791 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1798) | 1798 |
| [`getVisibleDevices`](../../interface/application.js#L1804) | 1804 |
| [`filterHardwareModels`](../../interface/application.js#L1829) | 1829 |
| [`openCatalogueModal`](../../interface/application.js#L1868) | 1868 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1877) | 1877 |
| [`saveHardwareManufacturer`](../../interface/application.js#L1901) | 1901 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L1939) | 1939 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L1951) | 1951 |
| [`renderCatalogueButton`](../../interface/application.js#L1968) | 1968 |
| [`renderCatalogueRecord`](../../interface/application.js#L1972) | 1972 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L1977) | 1977 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L1996) | 1996 |
| [`add`](../../interface/application.js#L1998) | 1998 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2043) | 2043 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2050) | 2050 |
| [`openHardwareModelManager`](../../interface/application.js#L2062) | 2062 |
| [`opts`](../../interface/application.js#L2067) | 2067 |
| [`saveHardwareModel`](../../interface/application.js#L2085) | 2085 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2114) | 2114 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2128) | 2128 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2150) | 2150 |
| [`add`](../../interface/application.js#L2152) | 2152 |
| [`options`](../../interface/application.js#L2188) | 2188 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2202) | 2202 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2217) | 2217 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2232) | 2232 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2240) | 2240 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2251) | 2251 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2260) | 2260 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2282) | 2282 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2293) | 2293 |
| [`openServerServiceEditor`](../../interface/application.js#L2310) | 2310 |
| [`saveServerServiceEntry`](../../interface/application.js#L2319) | 2319 |
| [`restoreArchivedServerService`](../../interface/application.js#L2332) | 2332 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2341) | 2341 |
| [`renderDevicesHTML`](../../interface/application.js#L2353) | 2353 |
| [`renderHardwareMetric`](../../interface/application.js#L2361) | 2361 |
| [`renderHardwareChart`](../../interface/application.js#L2366) | 2366 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2376) | 2376 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2395) | 2395 |
| [`renderArchivedSoftware`](../../interface/application.js#L2403) | 2403 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2438) | 2438 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2445) | 2445 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2446) | 2446 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2447) | 2447 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2450) | 2450 |
| [`openManageTypesModal`](../../interface/application.js#L2466) | 2466 |
| [`openManageLocationsModal`](../../interface/application.js#L2467) | 2467 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2470) | 2470 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2492) | 2492 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2499) | 2499 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2507) | 2507 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2527) | 2527 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2528) | 2528 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2529) | 2529 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2544) | 2544 |
| [`deleteDeviceType`](../../interface/application.js#L2564) | 2564 |
| [`deleteDeviceLocation`](../../interface/application.js#L2565) | 2565 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2573) | 2573 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2577) | 2577 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2603) | 2603 |
| [`nodes`](../../interface/application.js#L2613) | 2613 |
| [`renderIpamManage`](../../interface/application.js#L2639) | 2639 |
| [`renderIpamHTML`](../../interface/application.js#L2689) | 2689 |
| [`changeSubnet`](../../interface/application.js#L2848) | 2848 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2861) | 2861 |
| [`openIpamModal`](../../interface/application.js#L2887) | 2887 |
| [`openBulkIpModal`](../../interface/application.js#L2892) | 2892 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L2899) | 2899 |
| [`handleBulkIpSubmit`](../../interface/application.js#L2903) | 2903 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L2922) | 2922 |
| [`applyBulkIpChanges`](../../interface/application.js#L2938) | 2938 |
| [`subnetCidrFeedback`](../../interface/application.js#L2952) | 2952 |
| [`suggestSubnetGateway`](../../interface/application.js#L2970) | 2970 |
| [`openSubnetModal`](../../interface/application.js#L2998) | 2998 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3002) | 3002 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3026) | 3026 |
| [`handleSubnetSubmit`](../../interface/application.js#L3046) | 3046 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3239) | 3239 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3243) | 3243 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3248) | 3248 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3269) | 3269 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3273) | 3273 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3277) | 3277 |
| [`deleteSubnet`](../../interface/application.js#L3288) | 3288 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3348) | 3348 |
| [`deleteSubnetCommit`](../../interface/application.js#L3376) | 3376 |
| [`deleteVlan`](../../interface/application.js#L3406) | 3406 |
| [`openIpModal`](../../interface/application.js#L3432) | 3432 |
| [`handleIpSubmit`](../../interface/application.js#L3449) | 3449 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3515) | 3515 |
| [`modalFormSnapshot`](../../interface/application.js#L3525) | 3525 |
| [`rememberModalForm`](../../interface/application.js#L3530) | 3530 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3535) | 3535 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3554) | 3554 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3573) | 3573 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3582) | 3582 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3588) | 3588 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3594) | 3594 |
| [`closeModal`](../../interface/application.js#L3603) | 3603 |
| [`openModal`](../../interface/application.js#L3628) | 3628 |
| [`readRackDimension`](../../interface/application.js#L3701) | 3701 |
| [`formatRackDimension`](../../interface/application.js#L3708) | 3708 |
| [`rackPhysicalDetails`](../../interface/application.js#L3713) | 3713 |
| [`openRackModal`](../../interface/application.js#L3722) | 3722 |
| [`handleRackSubmit`](../../interface/application.js#L3738) | 3738 |
| [`deleteRack`](../../interface/application.js#L3805) | 3805 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3827) | 3827 |
| [`refresh`](../../interface/application.js#L3850) | 3850 |
| [`openAssignDeviceModal`](../../interface/application.js#L3927) | 3927 |
| [`refresh`](../../interface/application.js#L3944) | 3944 |
| [`refreshAssignStartPositions`](../../interface/application.js#L3951) | 3951 |
| [`handleAssignSubmit`](../../interface/application.js#L3985) | 3985 |
| [`unassignDevice`](../../interface/application.js#L4030) | 4030 |
| [`getSubnetForIp`](../../interface/application.js#L4047) | 4047 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4051) | 4051 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4095) | 4095 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4104) | 4104 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4113) | 4113 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4135) | 4135 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4145) | 4145 |
| [`toggleDeviceMountType`](../../interface/application.js#L4189) | 4189 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4210) | 4210 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4215) | 4215 |
| [`openDeviceReviewModal`](../../interface/application.js#L4233) | 4233 |
| [`openDeviceDetailView`](../../interface/application.js#L4238) | 4238 |
| [`safe`](../../interface/application.js#L4248) | 4248 |
| [`field`](../../interface/application.js#L4249) | 4249 |
| [`section`](../../interface/application.js#L4250) | 4250 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4293) | 4293 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4299) | 4299 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4318) | 4318 |
| [`navigateToDeviceRack`](../../interface/application.js#L4334) | 4334 |
| [`duplicateDevice`](../../interface/application.js#L4362) | 4362 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4432) | 4432 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4437) | 4437 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4442) | 4442 |
| [`openServerServiceManager`](../../interface/application.js#L4443) | 4443 |
| [`captureServerServiceSelections`](../../interface/application.js#L4448) | 4448 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4454) | 4454 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4475) | 4475 |
| [`archiveServerService`](../../interface/application.js#L4483) | 4483 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4507) | 4507 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4511) | 4511 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4529) | 4529 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4533) | 4533 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4536) | 4536 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4543) | 4543 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4571) | 4571 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4575) | 4575 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4616) | 4616 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4649) | 4649 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4666) | 4666 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4669) | 4669 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4670) | 4670 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4675) | 4675 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4681) | 4681 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4717) | 4717 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4718) | 4718 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4725) | 4725 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4726) | 4726 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4741) | 4741 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4745) | 4745 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4748) | 4748 |
| [`isSoftwareDetailField`](../../interface/application.js#L4755) | 4755 |
| [`renderInlineDevicePicker`](../../interface/application.js#L4762) | 4762 |
| [`updateInlinePickerCount`](../../interface/application.js#L4772) | 4772 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L4778) | 4778 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L4791) | 4791 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L4800) | 4800 |
| [`fail`](../../interface/application.js#L4806) | 4806 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L4858) | 4858 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L4874) | 4874 |
| [`fail`](../../interface/application.js#L4879) | 4879 |
| [`renderDeviceDetailFields`](../../interface/application.js#L4926) | 4926 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L4956) | 4956 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L4962) | 4962 |
| [`getPlatformVersionOptions`](../../interface/application.js#L4982) | 4982 |
| [`isWindowsPlatform`](../../interface/application.js#L4985) | 4985 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L4988) | 4988 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L4997) | 4997 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5034) | 5034 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5042) | 5042 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5052) | 5052 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L5056) | 5056 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5063) | 5063 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5074) | 5074 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5098) | 5098 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5102) | 5102 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5106) | 5106 |
| [`getDefaultMountType`](../../interface/application.js#L5119) | 5119 |
| [`renderDeviceMountOptions`](../../interface/application.js#L5122) | 5122 |
| [`updateDeviceMountChoices`](../../interface/application.js#L5127) | 5127 |
| [`initialiseNotesEditor`](../../interface/application.js#L5140) | 5140 |
| [`inlineMarkdown`](../../interface/application.js#L5145) | 5145 |
| [`render`](../../interface/application.js#L5158) | 5158 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5192) | 5192 |
| [`activate`](../../interface/application.js#L5584) | 5584 |
| [`openDeviceModal`](../../interface/application.js#L5655) | 5655 |
| [`syncVmPurpose`](../../interface/application.js#L5686) | 5686 |
| [`clearFieldError`](../../interface/application.js#L5735) | 5735 |
| [`captureDeviceFormDraft`](../../interface/application.js#L5754) | 5754 |
| [`createRackFromDevice`](../../interface/application.js#L5784) | 5784 |
| [`cancelRackFromDevice`](../../interface/application.js#L5792) | 5792 |
| [`createSubnetFromDevice`](../../interface/application.js#L5802) | 5802 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L5815) | 5815 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L5829) | 5829 |
| [`addCustomLocationOption`](../../interface/application.js#L5840) | 5840 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L5878) | 5878 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L5890) | 5890 |
| [`finish`](../../interface/application.js#L5910) | 5910 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L5935) | 5935 |
| [`finish`](../../interface/application.js#L5949) | 5949 |
| [`handleDeviceSubmit`](../../interface/application.js#L5969) | 5969 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L6008) | 6008 |
| [`deleteDevice`](../../interface/application.js#L6140) | 6140 |
| [`personalSafeStorageGet`](../../interface/application.js#L6197) | 6197 |
| [`openBackupExplanationDialog`](../../interface/application.js#L6202) | 6202 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L6212) | 6212 |
| [`button`](../../interface/application.js#L6213) | 6213 |
| [`themeChoice`](../../interface/application.js#L6217) | 6217 |
| [`guideLinks`](../../interface/application.js#L6234) | 6234 |
| [`loadSmtpSettings`](../../interface/application.js#L6265) | 6265 |
| [`renderApplicationSettings`](../../interface/application.js#L6280) | 6280 |
| [`syncSmtpForm`](../../interface/application.js#L6284) | 6284 |
| [`updateSmtpFields`](../../interface/application.js#L6306) | 6306 |
| [`hydrateSettings`](../../interface/application.js#L6319) | 6319 |
| [`caffootCompareVersions`](../../interface/application.js#L6340) | 6340 |
| [`parse`](../../interface/application.js#L6341) | 6341 |
| [`caffootShowLicences`](../../interface/application.js#L6363) | 6363 |
| [`caffootUpdateGuide`](../../interface/application.js#L6368) | 6368 |
| [`caffootCheckUpdates`](../../interface/application.js#L6373) | 6373 |
| [`checkInventorySafety`](../../interface/application.js#L6404) | 6404 |
| [`requestInventoryReset`](../../interface/application.js#L6427) | 6427 |
| [`createInventoryBackup`](../../interface/application.js#L6454) | 6454 |
| [`validateBackupVersion`](../../interface/application.js#L6466) | 6466 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L6481) | 6481 |
| [`exportData`](../../interface/application.js#L6489) | 6489 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L6502) | 6502 |
| [`validateBackupStructure`](../../interface/application.js#L6517) | 6517 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L6534) | 6534 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L6546) | 6546 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L6584) | 6584 |
| [`findRackImportConflicts`](../../interface/application.js#L6588) | 6588 |
| [`place`](../../interface/application.js#L6594) | 6594 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L6637) | 6637 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L6658) | 6658 |
| [`showBackupImportError`](../../interface/application.js#L6663) | 6663 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L6667) | 6667 |
| [`finish`](../../interface/application.js#L6677) | 6677 |
| [`onClick`](../../interface/application.js#L6686) | 6686 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L6696) | 6696 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L6707) | 6707 |
| [`finish`](../../interface/application.js#L6718) | 6718 |
| [`onClick`](../../interface/application.js#L6727) | 6727 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L6742) | 6742 |
| [`importData`](../../interface/application.js#L6758) | 6758 |
| [`reader.onload`](../../interface/application.js#L6768) | 6768 |
| [`reader.onerror`](../../interface/application.js#L6842) | 6842 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L6970) | 6970 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L6986) | 6986 |
| [`openRackAccessoryEditor`](../../interface/application.js#L6997) | 6997 |
| [`refreshAccessoryOptions`](../../interface/application.js#L7031) | 7031 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L7088) | 7088 |
| [`cancel`](../../interface/application.js#L7100) | 7100 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L7116) | 7116 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L7133) | 7133 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L7158) | 7158 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L7172) | 7172 |
| [`clearRackDropPreview`](../../interface/application.js#L7175) | 7175 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L7180) | 7180 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L7192) | 7192 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L7198) | 7198 |
| [`trackRackDrag`](../../interface/application.js#L7207) | 7207 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L7238) | 7238 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L7248) | 7248 |
| [`getRackDropPosition`](../../interface/application.js#L7341) | 7341 |
| [`window.onload`](../../interface/application.js#L7792) | 7792 |
| [`refreshCentralInventory`](../../interface/application.js#L7807) | 7807 |
| [`postInventory`](../../interface/application.js#L7828) | 7828 |
| [`isBlockedAction`](../../interface/application.js#L7880) | 7880 |
| [`applyAllowedControls`](../../interface/application.js#L7908) | 7908 |
| [`enhanceLongSelects`](../../interface/application.js#L7933) | 7933 |
| [`sync`](../../interface/application.js#L7984) | 7984 |
| [`close`](../../interface/application.js#L7990) | 7990 |
| [`choose`](../../interface/application.js#L7994) | 7994 |
| [`draw`](../../interface/application.js#L7999) | 7999 |
| [`open`](../../interface/application.js#L8017) | 8017 |
| [`enhanceSelects`](../../interface/application.js#L8073) | 8073 |
| [`switchTab`](../../interface/application.js#L8119) | 8119 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L8130) | 8130 |
| [`openDeviceDetailView`](../../interface/application.js#L8156) | 8156 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L8164) | 8164 |
| [`forbidRackMount`](../../interface/application.js#L8192) | 8192 |
| [`openDeviceModal`](../../interface/application.js#L8202) | 8202 |
| [`nextDeviceModalClosed`](../../interface/application.js#L8244) | 8244 |
| [`relatedChanges`](../../interface/application.js#L8250) | 8250 |
| [`saveDevice`](../../interface/application.js#L8261) | 8261 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L8288) | 8288 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L8289) | 8289 |
| [`nextIpamBridge.save`](../../interface/application.js#L8311) | 8311 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L8333) | 8333 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L8355) | 8355 |
| [`nextSettingsBridge.save`](../../interface/application.js#L8385) | 8385 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L8402) | 8402 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L8403) | 8403 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L8404) | 8404 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L8418) | 8418 |
| [`nextResetBridge.reset`](../../interface/application.js#L8449) | 8449 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L8476) | 8476 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L8503) | 8503 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L8504) | 8504 |
| [`nextRackBridge.save`](../../interface/application.js#L8539) | 8539 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L8542) | 8542 |
| [`nextRackBridge.persist`](../../interface/application.js#L8545) | 8545 |
| [`reserveForDelete`](../../interface/application.js#L8567) | 8567 |
| [`removeDevice`](../../interface/application.js#L8575) | 8575 |
| [`cancelDelete`](../../interface/application.js#L8601) | 8601 |
| [`saveArchivedInstallation`](../../interface/application.js#L8607) | 8607 |
| [`renderAccountSections`](../../interface/application.js#L8642) | 8642 |
| [`renderAccountMfaPanel`](../../interface/application.js#L8670) | 8670 |
| [`nextRenderAccount`](../../interface/application.js#L8680) | 8680 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L8688) | 8688 |
| [`closeEmailVerification`](../../interface/application.js#L8712) | 8712 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L8719) | 8719 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L8730) | 8730 |
| [`hydrateAccount`](../../interface/application.js#L8784) | 8784 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L8822) | 8822 |
| [`loadAccountProfile`](../../interface/application.js#L8835) | 8835 |
| [`removeAccountPhoto`](../../interface/application.js#L8851) | 8851 |
| [`nextRenderUsers`](../../interface/application.js#L8860) | 8860 |
| [`profileFields`](../../interface/application.js#L8862) | 8862 |
| [`stat`](../../interface/application.js#L8883) | 8883 |
| [`bars`](../../interface/application.js#L8886) | 8886 |
| [`operation`](../../interface/application.js#L8938) | 8938 |
| [`filterUserRows`](../../interface/application.js#L8958) | 8958 |
| [`closeUserWorkspace`](../../interface/application.js#L8982) | 8982 |
| [`loadCentralUsers`](../../interface/application.js#L9011) | 9011 |
| [`changeCentralUser`](../../interface/application.js#L9017) | 9017 |
| [`importPanel`](../../interface/application.js#L9028) | 9028 |
| [`cancelImport`](../../interface/application.js#L9032) | 9032 |
| [`nextImportModalClosed`](../../interface/application.js#L9038) | 9038 |
| [`showImportReview`](../../interface/application.js#L9039) | 9039 |
| [`chooseImportFile`](../../interface/application.js#L9079) | 9079 |
| [`actOnImport`](../../interface/application.js#L9096) | 9096 |

## interface/sign-in.js

| Function | Line |
| --- | ---: |
| [`$`](../../interface/sign-in.js#L2) | 2 |
| [`applySignInTheme`](../../interface/sign-in.js#L5) | 5 |
| [`showMfaQr`](../../interface/sign-in.js#L22) | 22 |
| [`showSession`](../../interface/sign-in.js#L30) | 30 |
| [`request`](../../interface/sign-in.js#L47) | 47 |
| [`display`](../../interface/sign-in.js#L51) | 51 |
| [`loadUsers`](../../interface/sign-in.js#L150) | 150 |
| [`adminAction`](../../interface/sign-in.js#L175) | 175 |
| [`showRecoveryFeedback`](../../interface/sign-in.js#L206) | 206 |
| [`resetRecoveryFlow`](../../interface/sign-in.js#L211) | 211 |

## backend/access_point_review.py

| Function | Line |
| --- | ---: |
| [`find_access_point_mount_conflicts`](../../backend/access_point_review.py#L18) | 18 |
| [`apply_access_point_mount_choices`](../../backend/access_point_review.py#L39) | 39 |

## backend/account_email.py

| Function | Line |
| --- | ---: |
| [`queue_email`](../../backend/account_email.py#L32) | 32 |
| [`queue_email.deliver`](../../backend/account_email.py#L37) | 37 |
| [`email_proof_secret`](../../backend/account_email.py#L54) | 54 |
| [`_digest`](../../backend/account_email.py#L91) | 91 |
| [`email_attempts_remaining`](../../backend/account_email.py#L100) | 100 |
| [`issue_email_proof`](../../backend/account_email.py#L109) | 109 |
| [`confirm_email_proof`](../../backend/account_email.py#L140) | 140 |
| [`security_recipients`](../../backend/account_email.py#L199) | 199 |
| [`notify_security_change`](../../backend/account_email.py#L214) | 214 |
| [`record_blocked_sign_in`](../../backend/account_email.py#L235) | 235 |

## backend/account_security.py

| Function | Line |
| --- | ---: |
| [`change_own_password`](../../backend/account_security.py#L9) | 9 |
| [`begin_mfa_enrolment`](../../backend/account_security.py#L31) | 31 |
| [`complete_mfa_enrolment`](../../backend/account_security.py#L55) | 55 |

## backend/accounts.py

| Function | Line |
| --- | ---: |
| [`hash_password`](../../backend/accounts.py#L14) | 14 |
| [`verify_password`](../../backend/accounts.py#L22) | 22 |
| [`bootstrap_first_admin`](../../backend/accounts.py#L41) | 41 |
| [`confirm_admin_mfa`](../../backend/accounts.py#L64) | 64 |

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
| [`authenticate`](../../backend/authentication.py#L14) | 14 |

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
| [`_admin`](../../backend/permissions.py#L13) | 13 |
| [`_target`](../../backend/permissions.py#L22) | 22 |
| [`create_user`](../../backend/permissions.py#L31) | 31 |
| [`set_permission`](../../backend/permissions.py#L63) | 63 |
| [`can_access`](../../backend/permissions.py#L113) | 113 |
| [`set_account_active`](../../backend/permissions.py#L135) | 135 |
| [`delete_user`](../../backend/permissions.py#L174) | 174 |
| [`set_administrator`](../../backend/permissions.py#L201) | 201 |
| [`can_replace_inventory`](../../backend/permissions.py#L242) | 242 |

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
| [`login`](../../backend/request_auth.py#L19) | 19 |
| [`csrf_for_session`](../../backend/request_auth.py#L35) | 35 |
| [`authenticated_account`](../../backend/request_auth.py#L50) | 50 |
| [`authorised_mutation`](../../backend/request_auth.py#L57) | 57 |
| [`logout`](../../backend/request_auth.py#L68) | 68 |
| [`authorised_inventory_import`](../../backend/request_auth.py#L80) | 80 |

## backend/reset_inventory.py

| Function | Line |
| --- | ---: |
| [`reset_inventory`](../../backend/reset_inventory.py#L13) | 13 |

## backend/schema.py

| Function | Line |
| --- | ---: |
| [`initialise_database`](../../backend/schema.py#L55) | 55 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L73) | 73 |
| [`connect`](../../backend/server.py#L91) | 91 |
| [`initialise_database`](../../backend/server.py#L99) | 99 |
| [`Handler.end_headers`](../../backend/server.py#L105) | 105 |
| [`Handler.do_GET`](../../backend/server.py#L112) | 112 |
| [`Handler.do_POST`](../../backend/server.py#L440) | 440 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L568) | 568 |
| [`Handler.handle_account_email`](../../backend/server.py#L920) | 920 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1000) | 1000 |
| [`Handler.handle_import`](../../backend/server.py#L1031) | 1031 |
| [`Handler.respond`](../../backend/server.py#L1107) | 1107 |
| [`main`](../../backend/server.py#L1120) | 1120 |

## backend/sessions.py

| Function | Line |
| --- | ---: |
| [`_digest`](../../backend/sessions.py#L15) | 15 |
| [`login_session`](../../backend/sessions.py#L25) | 25 |
| [`session_account`](../../backend/sessions.py#L49) | 49 |
| [`logout_session`](../../backend/sessions.py#L72) | 72 |
| [`revoke_account_sessions`](../../backend/sessions.py#L81) | 81 |

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

## scripts/build_private_acceptance.py

| Function | Line |
| --- | ---: |
| [`build_private_acceptance`](../../scripts/build_private_acceptance.py#L12) | 12 |
| [`build_private_acceptance.git`](../../scripts/build_private_acceptance.py#L13) | 13 |
