# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 683.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`hierarchyValidateTypes`](../../interface/application.js#L135) | 135 |
| [`previewLegacyVlanOwnershipInApp`](../../interface/application.js#L166) | 166 |
| [`reconcileLegacyVlanOwnership`](../../interface/application.js#L180) | 180 |
| [`migrateLegacyRackLocation`](../../interface/application.js#L218) | 218 |
| [`normaliseLegacyRackAccessoryTypes`](../../interface/application.js#L232) | 232 |
| [`normaliseState`](../../interface/application.js#L239) | 239 |
| [`validateApplicationState`](../../interface/application.js#L407) | 407 |
| [`loadStoredState`](../../interface/application.js#L474) | 474 |
| [`showStorageRecoveryBanner`](../../interface/application.js#L480) | 480 |
| [`download.onclick`](../../interface/application.js#L495) | 495 |
| [`reset.onclick`](../../interface/application.js#L504) | 504 |
| [`caffootThemePreference`](../../interface/application.js#L539) | 539 |
| [`caffootApplyTheme`](../../interface/application.js#L546) | 546 |
| [`caffootSetTheme`](../../interface/application.js#L560) | 560 |
| [`onSystemThemeChange`](../../interface/application.js#L571) | 571 |
| [`toggleDarkMode`](../../interface/application.js#L580) | 580 |
| [`readAuditHistory`](../../interface/application.js#L587) | 587 |
| [`auditChanges`](../../interface/application.js#L591) | 591 |
| [`recordAudit`](../../interface/application.js#L628) | 628 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L637) | 637 |
| [`exportAuditHistory`](../../interface/application.js#L649) | 649 |
| [`auditVisibleRows`](../../interface/application.js#L661) | 661 |
| [`auditDate`](../../interface/application.js#L683) | 683 |
| [`renderAuditHTML`](../../interface/application.js#L687) | 687 |
| [`hydrateAudit`](../../interface/application.js#L720) | 720 |
| [`applyAuditFilters`](../../interface/application.js#L728) | 728 |
| [`closeAuditDetail`](../../interface/application.js#L763) | 763 |
| [`showAuditDetail`](../../interface/application.js#L769) | 769 |
| [`nextRenderUsers`](../../interface/application.js#L796) | 796 |
| [`nextRenderAccount`](../../interface/application.js#L798) | 798 |
| [`hydrateAccount`](../../interface/application.js#L799) | 799 |
| [`removeAccountPhoto`](../../interface/application.js#L800) | 800 |
| [`saveState`](../../interface/application.js#L803) | 803 |
| [`getDeviceById`](../../interface/application.js#L806) | 806 |
| [`findDeviceUsingIp`](../../interface/application.js#L810) | 810 |
| [`setDevicePrimaryIp`](../../interface/application.js#L815) | 815 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L868) | 868 |
| [`isRackMountedDevice`](../../interface/application.js#L881) | 881 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L884) | 884 |
| [`getRackShelfLocation`](../../interface/application.js#L896) | 896 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L901) | 901 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L917) | 917 |
| [`openRackShelfCreation`](../../interface/application.js#L935) | 935 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L949) | 949 |
| [`createRackShelfFromDevice`](../../interface/application.js#L959) | 959 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L966) | 966 |
| [`options`](../../interface/application.js#L972) | 972 |
| [`validateRackPlacement`](../../interface/application.js#L993) | 993 |
| [`showToast`](../../interface/application.js#L1028) | 1028 |
| [`toggleSidebar`](../../interface/application.js#L1115) | 1115 |
| [`switchTab`](../../interface/application.js#L1134) | 1134 |
| [`escapeHtml`](../../interface/application.js#L1161) | 1161 |
| [`inlineJsArg`](../../interface/application.js#L1170) | 1170 |
| [`browserStorageWarning`](../../interface/application.js#L1178) | 1178 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1181) | 1181 |
| [`renderSectionTabIcon`](../../interface/application.js#L1187) | 1187 |
| [`renderSectionHeader`](../../interface/application.js#L1193) | 1193 |
| [`tab`](../../interface/application.js#L1194) | 1194 |
| [`revealSectionTab`](../../interface/application.js#L1221) | 1221 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1228) | 1228 |
| [`renderContent`](../../interface/application.js#L1244) | 1244 |
| [`updateScrollHint`](../../interface/application.js#L1280) | 1280 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1291) | 1291 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1326) | 1326 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1330) | 1330 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1334) | 1334 |
| [`buildInventoryReportData`](../../interface/application.js#L1340) | 1340 |
| [`occupancy`](../../interface/application.js#L1356) | 1356 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1379) | 1379 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1385) | 1385 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1411) | 1411 |
| [`renderDashboardHTML`](../../interface/application.js#L1430) | 1430 |
| [`statusPill`](../../interface/application.js#L1533) | 1533 |
| [`insightSegment`](../../interface/application.js#L1550) | 1550 |
| [`getCategoryIcon`](../../interface/application.js#L1591) | 1591 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1606) | 1606 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1615) | 1615 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1620) | 1620 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1635) | 1635 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1650) | 1650 |
| [`printRackElevation`](../../interface/application.js#L1660) | 1660 |
| [`safe`](../../interface/application.js#L1663) | 1663 |
| [`printRackElevationInFrame`](../../interface/application.js#L1694) | 1694 |
| [`frame.onload`](../../interface/application.js#L1704) | 1704 |
| [`renderRackHubV13`](../../interface/application.js#L1725) | 1725 |
| [`card`](../../interface/application.js#L1730) | 1730 |
| [`mark`](../../interface/application.js#L1739) | 1739 |
| [`bar`](../../interface/application.js#L1755) | 1755 |
| [`chartBox`](../../interface/application.js#L1756) | 1756 |
| [`chartRows`](../../interface/application.js#L1757) | 1757 |
| [`rackSpaceGuide`](../../interface/application.js#L1759) | 1759 |
| [`renderRacksHTML`](../../interface/application.js#L1828) | 1828 |
| [`changeRack`](../../interface/application.js#L1895) | 1895 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1914) | 1914 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1921) | 1921 |
| [`getVisibleDevices`](../../interface/application.js#L1927) | 1927 |
| [`filterHardwareModels`](../../interface/application.js#L1952) | 1952 |
| [`openCatalogueModal`](../../interface/application.js#L1991) | 1991 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2000) | 2000 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2024) | 2024 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2062) | 2062 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2074) | 2074 |
| [`renderCatalogueButton`](../../interface/application.js#L2091) | 2091 |
| [`renderCatalogueRecord`](../../interface/application.js#L2095) | 2095 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2100) | 2100 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2119) | 2119 |
| [`add`](../../interface/application.js#L2121) | 2121 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2166) | 2166 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2173) | 2173 |
| [`openHardwareModelManager`](../../interface/application.js#L2185) | 2185 |
| [`opts`](../../interface/application.js#L2190) | 2190 |
| [`saveHardwareModel`](../../interface/application.js#L2208) | 2208 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2237) | 2237 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2251) | 2251 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2273) | 2273 |
| [`add`](../../interface/application.js#L2275) | 2275 |
| [`options`](../../interface/application.js#L2311) | 2311 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2325) | 2325 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2340) | 2340 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2355) | 2355 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2363) | 2363 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2374) | 2374 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2383) | 2383 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2405) | 2405 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2416) | 2416 |
| [`openServerServiceEditor`](../../interface/application.js#L2433) | 2433 |
| [`saveServerServiceEntry`](../../interface/application.js#L2442) | 2442 |
| [`restoreArchivedServerService`](../../interface/application.js#L2455) | 2455 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2464) | 2464 |
| [`renderDevicesHTML`](../../interface/application.js#L2476) | 2476 |
| [`renderHardwareMetric`](../../interface/application.js#L2484) | 2484 |
| [`renderHardwareChart`](../../interface/application.js#L2489) | 2489 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2499) | 2499 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2518) | 2518 |
| [`renderArchivedSoftware`](../../interface/application.js#L2526) | 2526 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2561) | 2561 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2568) | 2568 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2569) | 2569 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2570) | 2570 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2573) | 2573 |
| [`openManageTypesModal`](../../interface/application.js#L2589) | 2589 |
| [`openManageLocationsModal`](../../interface/application.js#L2590) | 2590 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2593) | 2593 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2615) | 2615 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2622) | 2622 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2630) | 2630 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2650) | 2650 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2651) | 2651 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2652) | 2652 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2667) | 2667 |
| [`deleteDeviceType`](../../interface/application.js#L2687) | 2687 |
| [`deleteDeviceLocation`](../../interface/application.js#L2688) | 2688 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2696) | 2696 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2700) | 2700 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2726) | 2726 |
| [`nodes`](../../interface/application.js#L2736) | 2736 |
| [`renderIpamManage`](../../interface/application.js#L2762) | 2762 |
| [`renderIpamHTML`](../../interface/application.js#L2813) | 2813 |
| [`changeSubnet`](../../interface/application.js#L2973) | 2973 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2986) | 2986 |
| [`openIpamModal`](../../interface/application.js#L3012) | 3012 |
| [`openBulkIpModal`](../../interface/application.js#L3017) | 3017 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3024) | 3024 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3028) | 3028 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3047) | 3047 |
| [`applyBulkIpChanges`](../../interface/application.js#L3063) | 3063 |
| [`subnetCidrFeedback`](../../interface/application.js#L3077) | 3077 |
| [`suggestSubnetGateway`](../../interface/application.js#L3095) | 3095 |
| [`openSubnetModal`](../../interface/application.js#L3123) | 3123 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3127) | 3127 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3153) | 3153 |
| [`handleSubnetSubmit`](../../interface/application.js#L3173) | 3173 |
| [`subnetHasVlan`](../../interface/application.js#L3377) | 3377 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3380) | 3380 |
| [`openMultipleSubnets`](../../interface/application.js#L3388) | 3388 |
| [`option`](../../interface/application.js#L3390) | 3390 |
| [`visibility`](../../interface/application.js#L3394) | 3394 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3410) | 3410 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3439) | 3439 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3443) | 3443 |
| [`add`](../../interface/application.js#L3446) | 3446 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3466) | 3466 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3473) | 3473 |
| [`field`](../../interface/application.js#L3476) | 3476 |
| [`capture`](../../interface/application.js#L3484) | 3484 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3513) | 3513 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3517) | 3517 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3522) | 3522 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3543) | 3543 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3547) | 3547 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3551) | 3551 |
| [`deleteSubnet`](../../interface/application.js#L3562) | 3562 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3622) | 3622 |
| [`deleteSubnetCommit`](../../interface/application.js#L3650) | 3650 |
| [`deleteVlan`](../../interface/application.js#L3680) | 3680 |
| [`openIpModal`](../../interface/application.js#L3706) | 3706 |
| [`handleIpSubmit`](../../interface/application.js#L3723) | 3723 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3789) | 3789 |
| [`modalFormSnapshot`](../../interface/application.js#L3799) | 3799 |
| [`rememberModalForm`](../../interface/application.js#L3804) | 3804 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3809) | 3809 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3828) | 3828 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3847) | 3847 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3856) | 3856 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3862) | 3862 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3868) | 3868 |
| [`closeModal`](../../interface/application.js#L3877) | 3877 |
| [`openModal`](../../interface/application.js#L3903) | 3903 |
| [`readRackDimension`](../../interface/application.js#L3976) | 3976 |
| [`formatRackDimension`](../../interface/application.js#L3983) | 3983 |
| [`rackPhysicalDetails`](../../interface/application.js#L3988) | 3988 |
| [`openRackModal`](../../interface/application.js#L3997) | 3997 |
| [`handleRackSubmit`](../../interface/application.js#L4013) | 4013 |
| [`deleteRack`](../../interface/application.js#L4080) | 4080 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4102) | 4102 |
| [`refresh`](../../interface/application.js#L4125) | 4125 |
| [`openAssignDeviceModal`](../../interface/application.js#L4202) | 4202 |
| [`refresh`](../../interface/application.js#L4219) | 4219 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4226) | 4226 |
| [`handleAssignSubmit`](../../interface/application.js#L4260) | 4260 |
| [`unassignDevice`](../../interface/application.js#L4305) | 4305 |
| [`getSubnetForIp`](../../interface/application.js#L4322) | 4322 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4326) | 4326 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4370) | 4370 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4379) | 4379 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4388) | 4388 |
| [`inside`](../../interface/application.js#L4395) | 4395 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4413) | 4413 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4422) | 4422 |
| [`toggleDeviceMountType`](../../interface/application.js#L4466) | 4466 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4490) | 4490 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4495) | 4495 |
| [`openDeviceReviewModal`](../../interface/application.js#L4513) | 4513 |
| [`openDeviceDetailView`](../../interface/application.js#L4518) | 4518 |
| [`safe`](../../interface/application.js#L4528) | 4528 |
| [`field`](../../interface/application.js#L4529) | 4529 |
| [`section`](../../interface/application.js#L4530) | 4530 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4575) | 4575 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4581) | 4581 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4600) | 4600 |
| [`navigateToDeviceRack`](../../interface/application.js#L4616) | 4616 |
| [`duplicateDevice`](../../interface/application.js#L4644) | 4644 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4714) | 4714 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4719) | 4719 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4724) | 4724 |
| [`openServerServiceManager`](../../interface/application.js#L4725) | 4725 |
| [`captureServerServiceSelections`](../../interface/application.js#L4730) | 4730 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4736) | 4736 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4757) | 4757 |
| [`archiveServerService`](../../interface/application.js#L4765) | 4765 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4789) | 4789 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4793) | 4793 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4811) | 4811 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4815) | 4815 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4818) | 4818 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4825) | 4825 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4853) | 4853 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4857) | 4857 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4902) | 4902 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4936) | 4936 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4953) | 4953 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4956) | 4956 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4957) | 4957 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4962) | 4962 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4968) | 4968 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5005) | 5005 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5006) | 5006 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5013) | 5013 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5014) | 5014 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5029) | 5029 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5035) | 5035 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5058) | 5058 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5074) | 5074 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5077) | 5077 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5086) | 5086 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5097) | 5097 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5106) | 5106 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5109) | 5109 |
| [`isSoftwareDetailField`](../../interface/application.js#L5116) | 5116 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5124) | 5124 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5133) | 5133 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5139) | 5139 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5151) | 5151 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5190) | 5190 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5218) | 5218 |
| [`updateInlinePickerCount`](../../interface/application.js#L5227) | 5227 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5233) | 5233 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5246) | 5246 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5255) | 5255 |
| [`fail`](../../interface/application.js#L5261) | 5261 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5315) | 5315 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5331) | 5331 |
| [`fail`](../../interface/application.js#L5336) | 5336 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5383) | 5383 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5413) | 5413 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5419) | 5419 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5785) | 5785 |
| [`isWindowsPlatform`](../../interface/application.js#L5788) | 5788 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5792) | 5792 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5795) | 5795 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5799) | 5799 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5816) | 5816 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5820) | 5820 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5840) | 5840 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L5867) | 5867 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5916) | 5916 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5924) | 5924 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5935) | 5935 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L5939) | 5939 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5951) | 5951 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5962) | 5962 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5989) | 5989 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5993) | 5993 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5997) | 5997 |
| [`getDefaultMountType`](../../interface/application.js#L6010) | 6010 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6013) | 6013 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6018) | 6018 |
| [`initialiseNotesEditor`](../../interface/application.js#L6031) | 6031 |
| [`inlineMarkdown`](../../interface/application.js#L6036) | 6036 |
| [`render`](../../interface/application.js#L6049) | 6049 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6083) | 6083 |
| [`activate`](../../interface/application.js#L6477) | 6477 |
| [`openDeviceModal`](../../interface/application.js#L6558) | 6558 |
| [`syncVmPurpose`](../../interface/application.js#L6606) | 6606 |
| [`clearFieldError`](../../interface/application.js#L6667) | 6667 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6686) | 6686 |
| [`createRackFromDevice`](../../interface/application.js#L6721) | 6721 |
| [`cancelRackFromDevice`](../../interface/application.js#L6729) | 6729 |
| [`createSubnetFromDevice`](../../interface/application.js#L6739) | 6739 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6752) | 6752 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6766) | 6766 |
| [`addCustomLocationOption`](../../interface/application.js#L6778) | 6778 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6818) | 6818 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6830) | 6830 |
| [`finish`](../../interface/application.js#L6850) | 6850 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L6875) | 6875 |
| [`finish`](../../interface/application.js#L6889) | 6889 |
| [`handleDeviceSubmit`](../../interface/application.js#L6909) | 6909 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L6948) | 6948 |
| [`deleteDevice`](../../interface/application.js#L7095) | 7095 |
| [`personalSafeStorageGet`](../../interface/application.js#L7152) | 7152 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7157) | 7157 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7167) | 7167 |
| [`button`](../../interface/application.js#L7168) | 7168 |
| [`themeChoice`](../../interface/application.js#L7172) | 7172 |
| [`guideLinks`](../../interface/application.js#L7189) | 7189 |
| [`loadSmtpSettings`](../../interface/application.js#L7220) | 7220 |
| [`renderApplicationSettings`](../../interface/application.js#L7235) | 7235 |
| [`syncSmtpForm`](../../interface/application.js#L7239) | 7239 |
| [`updateSmtpFields`](../../interface/application.js#L7261) | 7261 |
| [`hydrateSettings`](../../interface/application.js#L7274) | 7274 |
| [`caffootCompareVersions`](../../interface/application.js#L7295) | 7295 |
| [`parse`](../../interface/application.js#L7296) | 7296 |
| [`caffootShowLicences`](../../interface/application.js#L7318) | 7318 |
| [`caffootUpdateGuide`](../../interface/application.js#L7323) | 7323 |
| [`caffootCheckUpdates`](../../interface/application.js#L7328) | 7328 |
| [`checkInventorySafety`](../../interface/application.js#L7359) | 7359 |
| [`requestInventoryReset`](../../interface/application.js#L7382) | 7382 |
| [`createInventoryBackup`](../../interface/application.js#L7409) | 7409 |
| [`validateBackupVersion`](../../interface/application.js#L7421) | 7421 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7436) | 7436 |
| [`exportData`](../../interface/application.js#L7444) | 7444 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7457) | 7457 |
| [`validateBackupStructure`](../../interface/application.js#L7472) | 7472 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7489) | 7489 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7501) | 7501 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7540) | 7540 |
| [`findRackImportConflicts`](../../interface/application.js#L7544) | 7544 |
| [`place`](../../interface/application.js#L7550) | 7550 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7596) | 7596 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7617) | 7617 |
| [`showBackupImportError`](../../interface/application.js#L7622) | 7622 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7626) | 7626 |
| [`finish`](../../interface/application.js#L7636) | 7636 |
| [`onClick`](../../interface/application.js#L7645) | 7645 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7655) | 7655 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7666) | 7666 |
| [`finish`](../../interface/application.js#L7677) | 7677 |
| [`onClick`](../../interface/application.js#L7686) | 7686 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7701) | 7701 |
| [`importData`](../../interface/application.js#L7717) | 7717 |
| [`reader.onload`](../../interface/application.js#L7727) | 7727 |
| [`reader.onerror`](../../interface/application.js#L7801) | 7801 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L7928) | 7928 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L7944) | 7944 |
| [`openRackAccessoryEditor`](../../interface/application.js#L7955) | 7955 |
| [`refreshAccessoryOptions`](../../interface/application.js#L7989) | 7989 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8047) | 8047 |
| [`cancel`](../../interface/application.js#L8060) | 8060 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8076) | 8076 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8093) | 8093 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8118) | 8118 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8132) | 8132 |
| [`clearRackDropPreview`](../../interface/application.js#L8135) | 8135 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8140) | 8140 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8152) | 8152 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8158) | 8158 |
| [`trackRackDrag`](../../interface/application.js#L8167) | 8167 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8198) | 8198 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8208) | 8208 |
| [`getRackDropPosition`](../../interface/application.js#L8301) | 8301 |
| [`window.onload`](../../interface/application.js#L8754) | 8754 |
| [`refreshCentralInventory`](../../interface/application.js#L8769) | 8769 |
| [`postInventory`](../../interface/application.js#L8790) | 8790 |
| [`isBlockedAction`](../../interface/application.js#L8842) | 8842 |
| [`applyAllowedControls`](../../interface/application.js#L8870) | 8870 |
| [`enhanceLongSelects`](../../interface/application.js#L8896) | 8896 |
| [`sync`](../../interface/application.js#L8947) | 8947 |
| [`close`](../../interface/application.js#L8953) | 8953 |
| [`choose`](../../interface/application.js#L8957) | 8957 |
| [`draw`](../../interface/application.js#L8962) | 8962 |
| [`open`](../../interface/application.js#L8980) | 8980 |
| [`enhanceSelects`](../../interface/application.js#L9037) | 9037 |
| [`switchTab`](../../interface/application.js#L9083) | 9083 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9094) | 9094 |
| [`openDeviceDetailView`](../../interface/application.js#L9120) | 9120 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9128) | 9128 |
| [`forbidRackMount`](../../interface/application.js#L9156) | 9156 |
| [`openDeviceModal`](../../interface/application.js#L9166) | 9166 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9208) | 9208 |
| [`relatedChanges`](../../interface/application.js#L9214) | 9214 |
| [`saveDevice`](../../interface/application.js#L9225) | 9225 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9252) | 9252 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9253) | 9253 |
| [`nextIpamBridge.save`](../../interface/application.js#L9275) | 9275 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9297) | 9297 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9319) | 9319 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9349) | 9349 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9366) | 9366 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9367) | 9367 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9368) | 9368 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9382) | 9382 |
| [`nextResetBridge.reset`](../../interface/application.js#L9413) | 9413 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9440) | 9440 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9467) | 9467 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9475) | 9475 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9484) | 9484 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9485) | 9485 |
| [`nextRackBridge.save`](../../interface/application.js#L9520) | 9520 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9523) | 9523 |
| [`nextRackBridge.persist`](../../interface/application.js#L9526) | 9526 |
| [`reserveForDelete`](../../interface/application.js#L9548) | 9548 |
| [`removeDevice`](../../interface/application.js#L9556) | 9556 |
| [`cancelDelete`](../../interface/application.js#L9582) | 9582 |
| [`saveArchivedInstallation`](../../interface/application.js#L9588) | 9588 |
| [`renderAccountSections`](../../interface/application.js#L9623) | 9623 |
| [`renderAccountMfaPanel`](../../interface/application.js#L9651) | 9651 |
| [`nextRenderAccount`](../../interface/application.js#L9661) | 9661 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L9669) | 9669 |
| [`closeEmailVerification`](../../interface/application.js#L9693) | 9693 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L9700) | 9700 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L9711) | 9711 |
| [`hydrateAccount`](../../interface/application.js#L9765) | 9765 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L9803) | 9803 |
| [`loadAccountProfile`](../../interface/application.js#L9816) | 9816 |
| [`removeAccountPhoto`](../../interface/application.js#L9832) | 9832 |
| [`nextRenderUsers`](../../interface/application.js#L9841) | 9841 |
| [`profileFields`](../../interface/application.js#L9843) | 9843 |
| [`stat`](../../interface/application.js#L9864) | 9864 |
| [`bars`](../../interface/application.js#L9867) | 9867 |
| [`operation`](../../interface/application.js#L9919) | 9919 |
| [`filterUserRows`](../../interface/application.js#L9939) | 9939 |
| [`closeUserWorkspace`](../../interface/application.js#L9963) | 9963 |
| [`loadCentralUsers`](../../interface/application.js#L9992) | 9992 |
| [`changeCentralUser`](../../interface/application.js#L9998) | 9998 |
| [`importPanel`](../../interface/application.js#L10009) | 10009 |
| [`cancelImport`](../../interface/application.js#L10013) | 10013 |
| [`nextImportModalClosed`](../../interface/application.js#L10019) | 10019 |
| [`showImportReview`](../../interface/application.js#L10020) | 10020 |
| [`chooseImportFile`](../../interface/application.js#L10060) | 10060 |
| [`actOnImport`](../../interface/application.js#L10077) | 10077 |

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
| [`find_access_point_mount_conflicts`](../../backend/access_point_review.py#L19) | 19 |
| [`apply_access_point_mount_choices`](../../backend/access_point_review.py#L45) | 45 |

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
| [`validate_detached_application_state`](../../backend/application_integrity.py#L14) | 14 |

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
| [`authenticate`](../../backend/authentication.py#L14) | 14 |

## backend/collection_saves.py

| Function | Line |
| --- | ---: |
| [`change_inventory_record`](../../backend/collection_saves.py#L20) | 20 |
| [`change_ipam_subnet_and_vlan_records`](../../backend/collection_saves.py#L112) | 112 |
| [`delete_subnet_with_dependencies`](../../backend/collection_saves.py#L256) | 256 |
| [`remove_linked_rack_shelf`](../../backend/collection_saves.py#L373) | 373 |

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
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L25) | 25 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L44) | 44 |
| [`_persist_related_guests`](../../backend/device_saves.py#L88) | 88 |
| [`save_reserved_device`](../../backend/device_saves.py#L101) | 101 |
| [`create_device`](../../backend/device_saves.py#L233) | 233 |
| [`delete_reserved_device`](../../backend/device_saves.py#L306) | 306 |

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
| [`Handler.handle_account_email`](../../backend/server.py#L926) | 926 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1006) | 1006 |
| [`Handler.handle_import`](../../backend/server.py#L1037) | 1037 |
| [`Handler.respond`](../../backend/server.py#L1113) | 1113 |
| [`main`](../../backend/server.py#L1126) | 1126 |

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
| [`_js_number`](../../backend/subnet_validation.py#L134) | 134 |
| [`_js_string`](../../backend/subnet_validation.py#L153) | 153 |
| [`_ip_number`](../../backend/subnet_validation.py#L163) | 163 |
| [`validate_subnet_types`](../../backend/subnet_validation.py#L178) | 178 |
| [`validate_subnet_mutation`](../../backend/subnet_validation.py#L224) | 224 |

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
