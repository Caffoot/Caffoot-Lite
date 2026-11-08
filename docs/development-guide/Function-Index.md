# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 688.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`toggleSidebar`](../../interface/application.js#L1116) | 1116 |
| [`switchTab`](../../interface/application.js#L1135) | 1135 |
| [`escapeHtml`](../../interface/application.js#L1162) | 1162 |
| [`inlineJsArg`](../../interface/application.js#L1171) | 1171 |
| [`browserStorageWarning`](../../interface/application.js#L1179) | 1179 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1182) | 1182 |
| [`renderSectionTabIcon`](../../interface/application.js#L1188) | 1188 |
| [`renderSectionHeader`](../../interface/application.js#L1194) | 1194 |
| [`tab`](../../interface/application.js#L1195) | 1195 |
| [`revealSectionTab`](../../interface/application.js#L1222) | 1222 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1229) | 1229 |
| [`renderContent`](../../interface/application.js#L1245) | 1245 |
| [`updateScrollHint`](../../interface/application.js#L1281) | 1281 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1292) | 1292 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1327) | 1327 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1331) | 1331 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1335) | 1335 |
| [`buildInventoryReportData`](../../interface/application.js#L1341) | 1341 |
| [`occupancy`](../../interface/application.js#L1357) | 1357 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1380) | 1380 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1386) | 1386 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1412) | 1412 |
| [`renderDashboardHTML`](../../interface/application.js#L1431) | 1431 |
| [`statusPill`](../../interface/application.js#L1534) | 1534 |
| [`insightSegment`](../../interface/application.js#L1551) | 1551 |
| [`getCategoryIcon`](../../interface/application.js#L1592) | 1592 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1607) | 1607 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1616) | 1616 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1621) | 1621 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1636) | 1636 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1651) | 1651 |
| [`printRackElevation`](../../interface/application.js#L1661) | 1661 |
| [`safe`](../../interface/application.js#L1664) | 1664 |
| [`printRackElevationInFrame`](../../interface/application.js#L1695) | 1695 |
| [`frame.onload`](../../interface/application.js#L1705) | 1705 |
| [`renderRackHubV13`](../../interface/application.js#L1726) | 1726 |
| [`card`](../../interface/application.js#L1731) | 1731 |
| [`mark`](../../interface/application.js#L1740) | 1740 |
| [`bar`](../../interface/application.js#L1756) | 1756 |
| [`chartBox`](../../interface/application.js#L1757) | 1757 |
| [`chartRows`](../../interface/application.js#L1758) | 1758 |
| [`rackSpaceGuide`](../../interface/application.js#L1760) | 1760 |
| [`renderRacksHTML`](../../interface/application.js#L1829) | 1829 |
| [`changeRack`](../../interface/application.js#L1896) | 1896 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1915) | 1915 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1922) | 1922 |
| [`getVisibleDevices`](../../interface/application.js#L1928) | 1928 |
| [`filterHardwareModels`](../../interface/application.js#L1953) | 1953 |
| [`openCatalogueModal`](../../interface/application.js#L1992) | 1992 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2001) | 2001 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2025) | 2025 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2063) | 2063 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2075) | 2075 |
| [`renderCatalogueButton`](../../interface/application.js#L2092) | 2092 |
| [`renderCatalogueRecord`](../../interface/application.js#L2096) | 2096 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2101) | 2101 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2120) | 2120 |
| [`add`](../../interface/application.js#L2122) | 2122 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2167) | 2167 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2174) | 2174 |
| [`openHardwareModelManager`](../../interface/application.js#L2186) | 2186 |
| [`opts`](../../interface/application.js#L2191) | 2191 |
| [`saveHardwareModel`](../../interface/application.js#L2209) | 2209 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2238) | 2238 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2252) | 2252 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2274) | 2274 |
| [`add`](../../interface/application.js#L2276) | 2276 |
| [`options`](../../interface/application.js#L2312) | 2312 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2326) | 2326 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2341) | 2341 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2356) | 2356 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2364) | 2364 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2375) | 2375 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2384) | 2384 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2406) | 2406 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2417) | 2417 |
| [`openServerServiceEditor`](../../interface/application.js#L2434) | 2434 |
| [`saveServerServiceEntry`](../../interface/application.js#L2443) | 2443 |
| [`restoreArchivedServerService`](../../interface/application.js#L2456) | 2456 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2465) | 2465 |
| [`renderDevicesHTML`](../../interface/application.js#L2477) | 2477 |
| [`renderHardwareMetric`](../../interface/application.js#L2485) | 2485 |
| [`renderHardwareChart`](../../interface/application.js#L2490) | 2490 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2500) | 2500 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2519) | 2519 |
| [`renderArchivedSoftware`](../../interface/application.js#L2527) | 2527 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2562) | 2562 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2569) | 2569 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2570) | 2570 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2571) | 2571 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2574) | 2574 |
| [`openManageTypesModal`](../../interface/application.js#L2590) | 2590 |
| [`openManageLocationsModal`](../../interface/application.js#L2591) | 2591 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2594) | 2594 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2616) | 2616 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2623) | 2623 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2631) | 2631 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2651) | 2651 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2652) | 2652 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2653) | 2653 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2668) | 2668 |
| [`deleteDeviceType`](../../interface/application.js#L2688) | 2688 |
| [`deleteDeviceLocation`](../../interface/application.js#L2689) | 2689 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2697) | 2697 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2701) | 2701 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2727) | 2727 |
| [`nodes`](../../interface/application.js#L2737) | 2737 |
| [`renderIpamManage`](../../interface/application.js#L2763) | 2763 |
| [`renderIpamHTML`](../../interface/application.js#L2814) | 2814 |
| [`changeSubnet`](../../interface/application.js#L2974) | 2974 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2987) | 2987 |
| [`openIpamModal`](../../interface/application.js#L3013) | 3013 |
| [`openBulkIpModal`](../../interface/application.js#L3018) | 3018 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3025) | 3025 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3029) | 3029 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3048) | 3048 |
| [`applyBulkIpChanges`](../../interface/application.js#L3064) | 3064 |
| [`subnetCidrFeedback`](../../interface/application.js#L3078) | 3078 |
| [`suggestSubnetGateway`](../../interface/application.js#L3096) | 3096 |
| [`openSubnetModal`](../../interface/application.js#L3124) | 3124 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3128) | 3128 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3154) | 3154 |
| [`handleSubnetSubmit`](../../interface/application.js#L3174) | 3174 |
| [`showSubnetFormError`](../../interface/application.js#L3379) | 3379 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3394) | 3394 |
| [`subnetNameConflicts`](../../interface/application.js#L3408) | 3408 |
| [`subnetHasVlan`](../../interface/application.js#L3415) | 3415 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3418) | 3418 |
| [`openMultipleSubnets`](../../interface/application.js#L3426) | 3426 |
| [`option`](../../interface/application.js#L3428) | 3428 |
| [`visibility`](../../interface/application.js#L3432) | 3432 |
| [`planningVisibility`](../../interface/application.js#L3436) | 3436 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3450) | 3450 |
| [`reject`](../../interface/application.js#L3452) | 3452 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3488) | 3488 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3492) | 3492 |
| [`add`](../../interface/application.js#L3495) | 3495 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3519) | 3519 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3526) | 3526 |
| [`field`](../../interface/application.js#L3529) | 3529 |
| [`capture`](../../interface/application.js#L3539) | 3539 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3573) | 3573 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3577) | 3577 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3582) | 3582 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3603) | 3603 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3607) | 3607 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3611) | 3611 |
| [`deleteSubnet`](../../interface/application.js#L3622) | 3622 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3682) | 3682 |
| [`deleteSubnetCommit`](../../interface/application.js#L3710) | 3710 |
| [`deleteVlan`](../../interface/application.js#L3740) | 3740 |
| [`openIpModal`](../../interface/application.js#L3766) | 3766 |
| [`handleIpSubmit`](../../interface/application.js#L3783) | 3783 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3849) | 3849 |
| [`modalFormSnapshot`](../../interface/application.js#L3859) | 3859 |
| [`rememberModalForm`](../../interface/application.js#L3864) | 3864 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3869) | 3869 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3888) | 3888 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3907) | 3907 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3916) | 3916 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3922) | 3922 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3928) | 3928 |
| [`closeModal`](../../interface/application.js#L3937) | 3937 |
| [`openModal`](../../interface/application.js#L3964) | 3964 |
| [`readRackDimension`](../../interface/application.js#L4037) | 4037 |
| [`formatRackDimension`](../../interface/application.js#L4044) | 4044 |
| [`rackPhysicalDetails`](../../interface/application.js#L4049) | 4049 |
| [`openRackModal`](../../interface/application.js#L4058) | 4058 |
| [`handleRackSubmit`](../../interface/application.js#L4074) | 4074 |
| [`deleteRack`](../../interface/application.js#L4141) | 4141 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4163) | 4163 |
| [`refresh`](../../interface/application.js#L4186) | 4186 |
| [`openAssignDeviceModal`](../../interface/application.js#L4263) | 4263 |
| [`refresh`](../../interface/application.js#L4280) | 4280 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4287) | 4287 |
| [`handleAssignSubmit`](../../interface/application.js#L4321) | 4321 |
| [`unassignDevice`](../../interface/application.js#L4366) | 4366 |
| [`getSubnetForIp`](../../interface/application.js#L4383) | 4383 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4387) | 4387 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4431) | 4431 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4440) | 4440 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4449) | 4449 |
| [`inside`](../../interface/application.js#L4456) | 4456 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4474) | 4474 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4483) | 4483 |
| [`toggleDeviceMountType`](../../interface/application.js#L4527) | 4527 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4551) | 4551 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4556) | 4556 |
| [`openDeviceReviewModal`](../../interface/application.js#L4574) | 4574 |
| [`openDeviceDetailView`](../../interface/application.js#L4579) | 4579 |
| [`safe`](../../interface/application.js#L4589) | 4589 |
| [`field`](../../interface/application.js#L4590) | 4590 |
| [`section`](../../interface/application.js#L4591) | 4591 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4636) | 4636 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4642) | 4642 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4661) | 4661 |
| [`navigateToDeviceRack`](../../interface/application.js#L4677) | 4677 |
| [`duplicateDevice`](../../interface/application.js#L4705) | 4705 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4775) | 4775 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4780) | 4780 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4785) | 4785 |
| [`openServerServiceManager`](../../interface/application.js#L4786) | 4786 |
| [`captureServerServiceSelections`](../../interface/application.js#L4791) | 4791 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4797) | 4797 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4818) | 4818 |
| [`archiveServerService`](../../interface/application.js#L4826) | 4826 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4850) | 4850 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4854) | 4854 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4872) | 4872 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4876) | 4876 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4879) | 4879 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4886) | 4886 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4914) | 4914 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4918) | 4918 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4963) | 4963 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4997) | 4997 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5014) | 5014 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5017) | 5017 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5018) | 5018 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5023) | 5023 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5029) | 5029 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5066) | 5066 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5067) | 5067 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5074) | 5074 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5075) | 5075 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5090) | 5090 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5096) | 5096 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5119) | 5119 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5135) | 5135 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5138) | 5138 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5147) | 5147 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5158) | 5158 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5167) | 5167 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5170) | 5170 |
| [`isSoftwareDetailField`](../../interface/application.js#L5177) | 5177 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5185) | 5185 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5194) | 5194 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5200) | 5200 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5212) | 5212 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5251) | 5251 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5279) | 5279 |
| [`updateInlinePickerCount`](../../interface/application.js#L5288) | 5288 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5294) | 5294 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5307) | 5307 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5316) | 5316 |
| [`fail`](../../interface/application.js#L5322) | 5322 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5376) | 5376 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5392) | 5392 |
| [`fail`](../../interface/application.js#L5397) | 5397 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5444) | 5444 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5474) | 5474 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5480) | 5480 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5846) | 5846 |
| [`isWindowsPlatform`](../../interface/application.js#L5849) | 5849 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5853) | 5853 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5856) | 5856 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5860) | 5860 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5877) | 5877 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5881) | 5881 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5901) | 5901 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L5928) | 5928 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5977) | 5977 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5985) | 5985 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5996) | 5996 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6000) | 6000 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6012) | 6012 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6023) | 6023 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6050) | 6050 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6054) | 6054 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6058) | 6058 |
| [`getDefaultMountType`](../../interface/application.js#L6071) | 6071 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6074) | 6074 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6079) | 6079 |
| [`initialiseNotesEditor`](../../interface/application.js#L6092) | 6092 |
| [`inlineMarkdown`](../../interface/application.js#L6097) | 6097 |
| [`render`](../../interface/application.js#L6110) | 6110 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6144) | 6144 |
| [`activate`](../../interface/application.js#L6538) | 6538 |
| [`openDeviceModal`](../../interface/application.js#L6619) | 6619 |
| [`syncVmPurpose`](../../interface/application.js#L6667) | 6667 |
| [`clearFieldError`](../../interface/application.js#L6728) | 6728 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6747) | 6747 |
| [`createRackFromDevice`](../../interface/application.js#L6782) | 6782 |
| [`cancelRackFromDevice`](../../interface/application.js#L6790) | 6790 |
| [`createSubnetFromDevice`](../../interface/application.js#L6800) | 6800 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6813) | 6813 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6827) | 6827 |
| [`addCustomLocationOption`](../../interface/application.js#L6839) | 6839 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6879) | 6879 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6891) | 6891 |
| [`finish`](../../interface/application.js#L6911) | 6911 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L6936) | 6936 |
| [`finish`](../../interface/application.js#L6950) | 6950 |
| [`handleDeviceSubmit`](../../interface/application.js#L6970) | 6970 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7009) | 7009 |
| [`deleteDevice`](../../interface/application.js#L7156) | 7156 |
| [`personalSafeStorageGet`](../../interface/application.js#L7213) | 7213 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7218) | 7218 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7228) | 7228 |
| [`button`](../../interface/application.js#L7229) | 7229 |
| [`themeChoice`](../../interface/application.js#L7233) | 7233 |
| [`guideLinks`](../../interface/application.js#L7250) | 7250 |
| [`loadSmtpSettings`](../../interface/application.js#L7281) | 7281 |
| [`renderApplicationSettings`](../../interface/application.js#L7296) | 7296 |
| [`syncSmtpForm`](../../interface/application.js#L7300) | 7300 |
| [`updateSmtpFields`](../../interface/application.js#L7322) | 7322 |
| [`hydrateSettings`](../../interface/application.js#L7335) | 7335 |
| [`caffootCompareVersions`](../../interface/application.js#L7356) | 7356 |
| [`parse`](../../interface/application.js#L7357) | 7357 |
| [`caffootShowLicences`](../../interface/application.js#L7379) | 7379 |
| [`caffootUpdateGuide`](../../interface/application.js#L7384) | 7384 |
| [`caffootCheckUpdates`](../../interface/application.js#L7389) | 7389 |
| [`checkInventorySafety`](../../interface/application.js#L7420) | 7420 |
| [`requestInventoryReset`](../../interface/application.js#L7443) | 7443 |
| [`createInventoryBackup`](../../interface/application.js#L7470) | 7470 |
| [`validateBackupVersion`](../../interface/application.js#L7482) | 7482 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7497) | 7497 |
| [`exportData`](../../interface/application.js#L7505) | 7505 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7518) | 7518 |
| [`validateBackupStructure`](../../interface/application.js#L7533) | 7533 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7550) | 7550 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7562) | 7562 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7601) | 7601 |
| [`findRackImportConflicts`](../../interface/application.js#L7605) | 7605 |
| [`place`](../../interface/application.js#L7611) | 7611 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7657) | 7657 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7678) | 7678 |
| [`showBackupImportError`](../../interface/application.js#L7683) | 7683 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7687) | 7687 |
| [`finish`](../../interface/application.js#L7697) | 7697 |
| [`onClick`](../../interface/application.js#L7706) | 7706 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7716) | 7716 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7727) | 7727 |
| [`finish`](../../interface/application.js#L7738) | 7738 |
| [`onClick`](../../interface/application.js#L7747) | 7747 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7762) | 7762 |
| [`importData`](../../interface/application.js#L7778) | 7778 |
| [`reader.onload`](../../interface/application.js#L7788) | 7788 |
| [`reader.onerror`](../../interface/application.js#L7862) | 7862 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L7989) | 7989 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8005) | 8005 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8016) | 8016 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8050) | 8050 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8108) | 8108 |
| [`cancel`](../../interface/application.js#L8121) | 8121 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8137) | 8137 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8154) | 8154 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8179) | 8179 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8193) | 8193 |
| [`clearRackDropPreview`](../../interface/application.js#L8196) | 8196 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8201) | 8201 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8213) | 8213 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8219) | 8219 |
| [`trackRackDrag`](../../interface/application.js#L8228) | 8228 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8259) | 8259 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8269) | 8269 |
| [`getRackDropPosition`](../../interface/application.js#L8362) | 8362 |
| [`window.onload`](../../interface/application.js#L8815) | 8815 |
| [`refreshCentralInventory`](../../interface/application.js#L8830) | 8830 |
| [`postInventory`](../../interface/application.js#L8851) | 8851 |
| [`isBlockedAction`](../../interface/application.js#L8903) | 8903 |
| [`applyAllowedControls`](../../interface/application.js#L8931) | 8931 |
| [`enhanceLongSelects`](../../interface/application.js#L8957) | 8957 |
| [`sync`](../../interface/application.js#L9008) | 9008 |
| [`close`](../../interface/application.js#L9014) | 9014 |
| [`choose`](../../interface/application.js#L9018) | 9018 |
| [`draw`](../../interface/application.js#L9023) | 9023 |
| [`open`](../../interface/application.js#L9041) | 9041 |
| [`enhanceSelects`](../../interface/application.js#L9098) | 9098 |
| [`switchTab`](../../interface/application.js#L9144) | 9144 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9155) | 9155 |
| [`openDeviceDetailView`](../../interface/application.js#L9181) | 9181 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9189) | 9189 |
| [`forbidRackMount`](../../interface/application.js#L9217) | 9217 |
| [`openDeviceModal`](../../interface/application.js#L9227) | 9227 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9269) | 9269 |
| [`relatedChanges`](../../interface/application.js#L9275) | 9275 |
| [`saveDevice`](../../interface/application.js#L9286) | 9286 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9313) | 9313 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9314) | 9314 |
| [`nextIpamBridge.save`](../../interface/application.js#L9336) | 9336 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9358) | 9358 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9380) | 9380 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9415) | 9415 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9432) | 9432 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9433) | 9433 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9434) | 9434 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9448) | 9448 |
| [`nextResetBridge.reset`](../../interface/application.js#L9479) | 9479 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9506) | 9506 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9533) | 9533 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9541) | 9541 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9550) | 9550 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9551) | 9551 |
| [`nextRackBridge.save`](../../interface/application.js#L9586) | 9586 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9589) | 9589 |
| [`nextRackBridge.persist`](../../interface/application.js#L9592) | 9592 |
| [`reserveForDelete`](../../interface/application.js#L9614) | 9614 |
| [`removeDevice`](../../interface/application.js#L9622) | 9622 |
| [`cancelDelete`](../../interface/application.js#L9648) | 9648 |
| [`saveArchivedInstallation`](../../interface/application.js#L9654) | 9654 |
| [`renderAccountSections`](../../interface/application.js#L9689) | 9689 |
| [`renderAccountMfaPanel`](../../interface/application.js#L9717) | 9717 |
| [`nextRenderAccount`](../../interface/application.js#L9727) | 9727 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L9735) | 9735 |
| [`closeEmailVerification`](../../interface/application.js#L9759) | 9759 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L9766) | 9766 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L9777) | 9777 |
| [`hydrateAccount`](../../interface/application.js#L9831) | 9831 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L9869) | 9869 |
| [`loadAccountProfile`](../../interface/application.js#L9882) | 9882 |
| [`removeAccountPhoto`](../../interface/application.js#L9898) | 9898 |
| [`nextRenderUsers`](../../interface/application.js#L9907) | 9907 |
| [`profileFields`](../../interface/application.js#L9909) | 9909 |
| [`stat`](../../interface/application.js#L9930) | 9930 |
| [`bars`](../../interface/application.js#L9933) | 9933 |
| [`operation`](../../interface/application.js#L9985) | 9985 |
| [`filterUserRows`](../../interface/application.js#L10005) | 10005 |
| [`closeUserWorkspace`](../../interface/application.js#L10029) | 10029 |
| [`loadCentralUsers`](../../interface/application.js#L10058) | 10058 |
| [`changeCentralUser`](../../interface/application.js#L10064) | 10064 |
| [`importPanel`](../../interface/application.js#L10075) | 10075 |
| [`cancelImport`](../../interface/application.js#L10079) | 10079 |
| [`nextImportModalClosed`](../../interface/application.js#L10085) | 10085 |
| [`showImportReview`](../../interface/application.js#L10086) | 10086 |
| [`chooseImportFile`](../../interface/application.js#L10126) | 10126 |
| [`actOnImport`](../../interface/application.js#L10143) | 10143 |

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
