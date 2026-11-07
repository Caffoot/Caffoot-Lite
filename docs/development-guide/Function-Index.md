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
| [`capture`](../../interface/application.js#L3486) | 3486 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3519) | 3519 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3523) | 3523 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3528) | 3528 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3549) | 3549 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3553) | 3553 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3557) | 3557 |
| [`deleteSubnet`](../../interface/application.js#L3568) | 3568 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3628) | 3628 |
| [`deleteSubnetCommit`](../../interface/application.js#L3656) | 3656 |
| [`deleteVlan`](../../interface/application.js#L3686) | 3686 |
| [`openIpModal`](../../interface/application.js#L3712) | 3712 |
| [`handleIpSubmit`](../../interface/application.js#L3729) | 3729 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3795) | 3795 |
| [`modalFormSnapshot`](../../interface/application.js#L3805) | 3805 |
| [`rememberModalForm`](../../interface/application.js#L3810) | 3810 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3815) | 3815 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3834) | 3834 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3853) | 3853 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3862) | 3862 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3868) | 3868 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3874) | 3874 |
| [`closeModal`](../../interface/application.js#L3883) | 3883 |
| [`openModal`](../../interface/application.js#L3910) | 3910 |
| [`readRackDimension`](../../interface/application.js#L3983) | 3983 |
| [`formatRackDimension`](../../interface/application.js#L3990) | 3990 |
| [`rackPhysicalDetails`](../../interface/application.js#L3995) | 3995 |
| [`openRackModal`](../../interface/application.js#L4004) | 4004 |
| [`handleRackSubmit`](../../interface/application.js#L4020) | 4020 |
| [`deleteRack`](../../interface/application.js#L4087) | 4087 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4109) | 4109 |
| [`refresh`](../../interface/application.js#L4132) | 4132 |
| [`openAssignDeviceModal`](../../interface/application.js#L4209) | 4209 |
| [`refresh`](../../interface/application.js#L4226) | 4226 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4233) | 4233 |
| [`handleAssignSubmit`](../../interface/application.js#L4267) | 4267 |
| [`unassignDevice`](../../interface/application.js#L4312) | 4312 |
| [`getSubnetForIp`](../../interface/application.js#L4329) | 4329 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4333) | 4333 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4377) | 4377 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4386) | 4386 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4395) | 4395 |
| [`inside`](../../interface/application.js#L4402) | 4402 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4420) | 4420 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4429) | 4429 |
| [`toggleDeviceMountType`](../../interface/application.js#L4473) | 4473 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4497) | 4497 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4502) | 4502 |
| [`openDeviceReviewModal`](../../interface/application.js#L4520) | 4520 |
| [`openDeviceDetailView`](../../interface/application.js#L4525) | 4525 |
| [`safe`](../../interface/application.js#L4535) | 4535 |
| [`field`](../../interface/application.js#L4536) | 4536 |
| [`section`](../../interface/application.js#L4537) | 4537 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4582) | 4582 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4588) | 4588 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4607) | 4607 |
| [`navigateToDeviceRack`](../../interface/application.js#L4623) | 4623 |
| [`duplicateDevice`](../../interface/application.js#L4651) | 4651 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4721) | 4721 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4726) | 4726 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4731) | 4731 |
| [`openServerServiceManager`](../../interface/application.js#L4732) | 4732 |
| [`captureServerServiceSelections`](../../interface/application.js#L4737) | 4737 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4743) | 4743 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4764) | 4764 |
| [`archiveServerService`](../../interface/application.js#L4772) | 4772 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4796) | 4796 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4800) | 4800 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4818) | 4818 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4822) | 4822 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4825) | 4825 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4832) | 4832 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4860) | 4860 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4864) | 4864 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4909) | 4909 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4943) | 4943 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4960) | 4960 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4963) | 4963 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4964) | 4964 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4969) | 4969 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4975) | 4975 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5012) | 5012 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5013) | 5013 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5020) | 5020 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5021) | 5021 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5036) | 5036 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5042) | 5042 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5065) | 5065 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5081) | 5081 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5084) | 5084 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5093) | 5093 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5104) | 5104 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5113) | 5113 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5116) | 5116 |
| [`isSoftwareDetailField`](../../interface/application.js#L5123) | 5123 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5131) | 5131 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5140) | 5140 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5146) | 5146 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5158) | 5158 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5197) | 5197 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5225) | 5225 |
| [`updateInlinePickerCount`](../../interface/application.js#L5234) | 5234 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5240) | 5240 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5253) | 5253 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5262) | 5262 |
| [`fail`](../../interface/application.js#L5268) | 5268 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5322) | 5322 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5338) | 5338 |
| [`fail`](../../interface/application.js#L5343) | 5343 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5390) | 5390 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5420) | 5420 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5426) | 5426 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5792) | 5792 |
| [`isWindowsPlatform`](../../interface/application.js#L5795) | 5795 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5799) | 5799 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5802) | 5802 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5806) | 5806 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5823) | 5823 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5827) | 5827 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5847) | 5847 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L5874) | 5874 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5923) | 5923 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5931) | 5931 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5942) | 5942 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L5946) | 5946 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5958) | 5958 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5969) | 5969 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5996) | 5996 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6000) | 6000 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6004) | 6004 |
| [`getDefaultMountType`](../../interface/application.js#L6017) | 6017 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6020) | 6020 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6025) | 6025 |
| [`initialiseNotesEditor`](../../interface/application.js#L6038) | 6038 |
| [`inlineMarkdown`](../../interface/application.js#L6043) | 6043 |
| [`render`](../../interface/application.js#L6056) | 6056 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6090) | 6090 |
| [`activate`](../../interface/application.js#L6484) | 6484 |
| [`openDeviceModal`](../../interface/application.js#L6565) | 6565 |
| [`syncVmPurpose`](../../interface/application.js#L6613) | 6613 |
| [`clearFieldError`](../../interface/application.js#L6674) | 6674 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6693) | 6693 |
| [`createRackFromDevice`](../../interface/application.js#L6728) | 6728 |
| [`cancelRackFromDevice`](../../interface/application.js#L6736) | 6736 |
| [`createSubnetFromDevice`](../../interface/application.js#L6746) | 6746 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6759) | 6759 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6773) | 6773 |
| [`addCustomLocationOption`](../../interface/application.js#L6785) | 6785 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6825) | 6825 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6837) | 6837 |
| [`finish`](../../interface/application.js#L6857) | 6857 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L6882) | 6882 |
| [`finish`](../../interface/application.js#L6896) | 6896 |
| [`handleDeviceSubmit`](../../interface/application.js#L6916) | 6916 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L6955) | 6955 |
| [`deleteDevice`](../../interface/application.js#L7102) | 7102 |
| [`personalSafeStorageGet`](../../interface/application.js#L7159) | 7159 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7164) | 7164 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7174) | 7174 |
| [`button`](../../interface/application.js#L7175) | 7175 |
| [`themeChoice`](../../interface/application.js#L7179) | 7179 |
| [`guideLinks`](../../interface/application.js#L7196) | 7196 |
| [`loadSmtpSettings`](../../interface/application.js#L7227) | 7227 |
| [`renderApplicationSettings`](../../interface/application.js#L7242) | 7242 |
| [`syncSmtpForm`](../../interface/application.js#L7246) | 7246 |
| [`updateSmtpFields`](../../interface/application.js#L7268) | 7268 |
| [`hydrateSettings`](../../interface/application.js#L7281) | 7281 |
| [`caffootCompareVersions`](../../interface/application.js#L7302) | 7302 |
| [`parse`](../../interface/application.js#L7303) | 7303 |
| [`caffootShowLicences`](../../interface/application.js#L7325) | 7325 |
| [`caffootUpdateGuide`](../../interface/application.js#L7330) | 7330 |
| [`caffootCheckUpdates`](../../interface/application.js#L7335) | 7335 |
| [`checkInventorySafety`](../../interface/application.js#L7366) | 7366 |
| [`requestInventoryReset`](../../interface/application.js#L7389) | 7389 |
| [`createInventoryBackup`](../../interface/application.js#L7416) | 7416 |
| [`validateBackupVersion`](../../interface/application.js#L7428) | 7428 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7443) | 7443 |
| [`exportData`](../../interface/application.js#L7451) | 7451 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7464) | 7464 |
| [`validateBackupStructure`](../../interface/application.js#L7479) | 7479 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7496) | 7496 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7508) | 7508 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7547) | 7547 |
| [`findRackImportConflicts`](../../interface/application.js#L7551) | 7551 |
| [`place`](../../interface/application.js#L7557) | 7557 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7603) | 7603 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7624) | 7624 |
| [`showBackupImportError`](../../interface/application.js#L7629) | 7629 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7633) | 7633 |
| [`finish`](../../interface/application.js#L7643) | 7643 |
| [`onClick`](../../interface/application.js#L7652) | 7652 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7662) | 7662 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7673) | 7673 |
| [`finish`](../../interface/application.js#L7684) | 7684 |
| [`onClick`](../../interface/application.js#L7693) | 7693 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7708) | 7708 |
| [`importData`](../../interface/application.js#L7724) | 7724 |
| [`reader.onload`](../../interface/application.js#L7734) | 7734 |
| [`reader.onerror`](../../interface/application.js#L7808) | 7808 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L7935) | 7935 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L7951) | 7951 |
| [`openRackAccessoryEditor`](../../interface/application.js#L7962) | 7962 |
| [`refreshAccessoryOptions`](../../interface/application.js#L7996) | 7996 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8054) | 8054 |
| [`cancel`](../../interface/application.js#L8067) | 8067 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8083) | 8083 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8100) | 8100 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8125) | 8125 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8139) | 8139 |
| [`clearRackDropPreview`](../../interface/application.js#L8142) | 8142 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8147) | 8147 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8159) | 8159 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8165) | 8165 |
| [`trackRackDrag`](../../interface/application.js#L8174) | 8174 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8205) | 8205 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8215) | 8215 |
| [`getRackDropPosition`](../../interface/application.js#L8308) | 8308 |
| [`window.onload`](../../interface/application.js#L8761) | 8761 |
| [`refreshCentralInventory`](../../interface/application.js#L8776) | 8776 |
| [`postInventory`](../../interface/application.js#L8797) | 8797 |
| [`isBlockedAction`](../../interface/application.js#L8849) | 8849 |
| [`applyAllowedControls`](../../interface/application.js#L8877) | 8877 |
| [`enhanceLongSelects`](../../interface/application.js#L8903) | 8903 |
| [`sync`](../../interface/application.js#L8954) | 8954 |
| [`close`](../../interface/application.js#L8960) | 8960 |
| [`choose`](../../interface/application.js#L8964) | 8964 |
| [`draw`](../../interface/application.js#L8969) | 8969 |
| [`open`](../../interface/application.js#L8987) | 8987 |
| [`enhanceSelects`](../../interface/application.js#L9044) | 9044 |
| [`switchTab`](../../interface/application.js#L9090) | 9090 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9101) | 9101 |
| [`openDeviceDetailView`](../../interface/application.js#L9127) | 9127 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9135) | 9135 |
| [`forbidRackMount`](../../interface/application.js#L9163) | 9163 |
| [`openDeviceModal`](../../interface/application.js#L9173) | 9173 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9215) | 9215 |
| [`relatedChanges`](../../interface/application.js#L9221) | 9221 |
| [`saveDevice`](../../interface/application.js#L9232) | 9232 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9259) | 9259 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9260) | 9260 |
| [`nextIpamBridge.save`](../../interface/application.js#L9282) | 9282 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9304) | 9304 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9326) | 9326 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9356) | 9356 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9373) | 9373 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9374) | 9374 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9375) | 9375 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9389) | 9389 |
| [`nextResetBridge.reset`](../../interface/application.js#L9420) | 9420 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9447) | 9447 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9474) | 9474 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9482) | 9482 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9491) | 9491 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9492) | 9492 |
| [`nextRackBridge.save`](../../interface/application.js#L9527) | 9527 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9530) | 9530 |
| [`nextRackBridge.persist`](../../interface/application.js#L9533) | 9533 |
| [`reserveForDelete`](../../interface/application.js#L9555) | 9555 |
| [`removeDevice`](../../interface/application.js#L9563) | 9563 |
| [`cancelDelete`](../../interface/application.js#L9589) | 9589 |
| [`saveArchivedInstallation`](../../interface/application.js#L9595) | 9595 |
| [`renderAccountSections`](../../interface/application.js#L9630) | 9630 |
| [`renderAccountMfaPanel`](../../interface/application.js#L9658) | 9658 |
| [`nextRenderAccount`](../../interface/application.js#L9668) | 9668 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L9676) | 9676 |
| [`closeEmailVerification`](../../interface/application.js#L9700) | 9700 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L9707) | 9707 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L9718) | 9718 |
| [`hydrateAccount`](../../interface/application.js#L9772) | 9772 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L9810) | 9810 |
| [`loadAccountProfile`](../../interface/application.js#L9823) | 9823 |
| [`removeAccountPhoto`](../../interface/application.js#L9839) | 9839 |
| [`nextRenderUsers`](../../interface/application.js#L9848) | 9848 |
| [`profileFields`](../../interface/application.js#L9850) | 9850 |
| [`stat`](../../interface/application.js#L9871) | 9871 |
| [`bars`](../../interface/application.js#L9874) | 9874 |
| [`operation`](../../interface/application.js#L9926) | 9926 |
| [`filterUserRows`](../../interface/application.js#L9946) | 9946 |
| [`closeUserWorkspace`](../../interface/application.js#L9970) | 9970 |
| [`loadCentralUsers`](../../interface/application.js#L9999) | 9999 |
| [`changeCentralUser`](../../interface/application.js#L10005) | 10005 |
| [`importPanel`](../../interface/application.js#L10016) | 10016 |
| [`cancelImport`](../../interface/application.js#L10020) | 10020 |
| [`nextImportModalClosed`](../../interface/application.js#L10026) | 10026 |
| [`showImportReview`](../../interface/application.js#L10027) | 10027 |
| [`chooseImportFile`](../../interface/application.js#L10067) | 10067 |
| [`actOnImport`](../../interface/application.js#L10084) | 10084 |

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
| [`delete_subnet_with_dependencies`](../../backend/collection_saves.py#L254) | 254 |
| [`remove_linked_rack_shelf`](../../backend/collection_saves.py#L371) | 371 |

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
