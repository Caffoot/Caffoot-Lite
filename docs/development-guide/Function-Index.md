# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the five application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 837.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`renderInterfaceTemplate`](../../interface/loader.js#L5) | 5 |
| [`loadInterfaceText`](../../interface/loader.js#L13) | 13 |
| [`initialiseInterface`](../../interface/loader.js#L18) | 18 |
| [`staffScript.onerror`](../../interface/loader.js#L46) | 46 |
| [`staffScript.onload`](../../interface/loader.js#L47) | 47 |
| [`script.onerror`](../../interface/loader.js#L50) | 50 |
| [`script.onload`](../../interface/loader.js#L51) | 51 |
| [`applicationScript.onerror`](../../interface/loader.js#L54) | 54 |
| [`showInterfaceLoadError`](../../interface/loader.js#L61) | 61 |

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
| [`nextRenderUsers`](../../interface/application.js#L804) | 804 |
| [`nextRenderAccount`](../../interface/application.js#L806) | 806 |
| [`hydrateAccount`](../../interface/application.js#L807) | 807 |
| [`removeAccountPhoto`](../../interface/application.js#L808) | 808 |
| [`saveState`](../../interface/application.js#L811) | 811 |
| [`getDeviceById`](../../interface/application.js#L814) | 814 |
| [`findDeviceUsingIp`](../../interface/application.js#L818) | 818 |
| [`setDevicePrimaryIp`](../../interface/application.js#L823) | 823 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L882) | 882 |
| [`isRackMountedDevice`](../../interface/application.js#L895) | 895 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L898) | 898 |
| [`getRackShelfLocation`](../../interface/application.js#L910) | 910 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L916) | 916 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L932) | 932 |
| [`openRackShelfCreation`](../../interface/application.js#L950) | 950 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L964) | 964 |
| [`createRackShelfFromDevice`](../../interface/application.js#L974) | 974 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L981) | 981 |
| [`options`](../../interface/application.js#L987) | 987 |
| [`validateRackPlacement`](../../interface/application.js#L1008) | 1008 |
| [`showNotification`](../../interface/application.js#L1044) | 1044 |
| [`showToast`](../../interface/application.js#L1058) | 1058 |
| [`toggleSidebar`](../../interface/application.js#L1142) | 1142 |
| [`switchTab`](../../interface/application.js#L1161) | 1161 |
| [`escapeHtml`](../../interface/application.js#L1191) | 1191 |
| [`inlineJsArg`](../../interface/application.js#L1200) | 1200 |
| [`browserStorageWarning`](../../interface/application.js#L1208) | 1208 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1211) | 1211 |
| [`renderSectionTabIcon`](../../interface/application.js#L1217) | 1217 |
| [`renderSectionHeader`](../../interface/application.js#L1223) | 1223 |
| [`tab`](../../interface/application.js#L1224) | 1224 |
| [`revealSectionTab`](../../interface/application.js#L1251) | 1251 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1258) | 1258 |
| [`renderContent`](../../interface/application.js#L1278) | 1278 |
| [`updateScrollHint`](../../interface/application.js#L1320) | 1320 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1331) | 1331 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1366) | 1366 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1370) | 1370 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1374) | 1374 |
| [`buildInventoryReportData`](../../interface/application.js#L1380) | 1380 |
| [`occupancy`](../../interface/application.js#L1396) | 1396 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1419) | 1419 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1425) | 1425 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1451) | 1451 |
| [`renderDashboardHTML`](../../interface/application.js#L1470) | 1470 |
| [`statusPill`](../../interface/application.js#L1576) | 1576 |
| [`insightSegment`](../../interface/application.js#L1593) | 1593 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1634) | 1634 |
| [`getCategoryIcon`](../../interface/application.js#L1651) | 1651 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1666) | 1666 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1675) | 1675 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1680) | 1680 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1695) | 1695 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1710) | 1710 |
| [`printRackElevation`](../../interface/application.js#L1720) | 1720 |
| [`safe`](../../interface/application.js#L1723) | 1723 |
| [`printRackElevationInFrame`](../../interface/application.js#L1754) | 1754 |
| [`frame.onload`](../../interface/application.js#L1764) | 1764 |
| [`renderRackHubV13`](../../interface/application.js#L1785) | 1785 |
| [`card`](../../interface/application.js#L1790) | 1790 |
| [`mark`](../../interface/application.js#L1799) | 1799 |
| [`bar`](../../interface/application.js#L1815) | 1815 |
| [`chartBox`](../../interface/application.js#L1816) | 1816 |
| [`chartRows`](../../interface/application.js#L1817) | 1817 |
| [`rackSpaceGuide`](../../interface/application.js#L1819) | 1819 |
| [`renderRacksHTML`](../../interface/application.js#L1888) | 1888 |
| [`changeRack`](../../interface/application.js#L1955) | 1955 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1974) | 1974 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1981) | 1981 |
| [`getVisibleDevices`](../../interface/application.js#L1987) | 1987 |
| [`filterHardwareModels`](../../interface/application.js#L2012) | 2012 |
| [`openCatalogueModal`](../../interface/application.js#L2051) | 2051 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2060) | 2060 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2084) | 2084 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2122) | 2122 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2134) | 2134 |
| [`renderCatalogueButton`](../../interface/application.js#L2151) | 2151 |
| [`renderCatalogueRecord`](../../interface/application.js#L2155) | 2155 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2160) | 2160 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2179) | 2179 |
| [`add`](../../interface/application.js#L2181) | 2181 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2226) | 2226 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2233) | 2233 |
| [`openHardwareModelManager`](../../interface/application.js#L2245) | 2245 |
| [`opts`](../../interface/application.js#L2250) | 2250 |
| [`saveHardwareModel`](../../interface/application.js#L2268) | 2268 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2297) | 2297 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2311) | 2311 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2333) | 2333 |
| [`add`](../../interface/application.js#L2335) | 2335 |
| [`options`](../../interface/application.js#L2371) | 2371 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2385) | 2385 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2400) | 2400 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2415) | 2415 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2423) | 2423 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2434) | 2434 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2443) | 2443 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2465) | 2465 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2476) | 2476 |
| [`openServerServiceEditor`](../../interface/application.js#L2493) | 2493 |
| [`saveServerServiceEntry`](../../interface/application.js#L2502) | 2502 |
| [`restoreArchivedServerService`](../../interface/application.js#L2515) | 2515 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2524) | 2524 |
| [`renderDevicesHTML`](../../interface/application.js#L2536) | 2536 |
| [`renderHardwareMetric`](../../interface/application.js#L2544) | 2544 |
| [`renderHardwareChart`](../../interface/application.js#L2549) | 2549 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2559) | 2559 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2578) | 2578 |
| [`renderArchivedSoftware`](../../interface/application.js#L2586) | 2586 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2621) | 2621 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2628) | 2628 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2629) | 2629 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2630) | 2630 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2633) | 2633 |
| [`openManageTypesModal`](../../interface/application.js#L2649) | 2649 |
| [`openManageLocationsModal`](../../interface/application.js#L2650) | 2650 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2653) | 2653 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2675) | 2675 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2682) | 2682 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2690) | 2690 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2710) | 2710 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2711) | 2711 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2712) | 2712 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2727) | 2727 |
| [`deleteDeviceType`](../../interface/application.js#L2747) | 2747 |
| [`deleteDeviceLocation`](../../interface/application.js#L2748) | 2748 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2756) | 2756 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2760) | 2760 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2787) | 2787 |
| [`nodes`](../../interface/application.js#L2797) | 2797 |
| [`renderIpamManage`](../../interface/application.js#L2823) | 2823 |
| [`renderIpamHTML`](../../interface/application.js#L2874) | 2874 |
| [`changeSubnet`](../../interface/application.js#L3035) | 3035 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3048) | 3048 |
| [`openIpamModal`](../../interface/application.js#L3074) | 3074 |
| [`openBulkIpModal`](../../interface/application.js#L3079) | 3079 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3086) | 3086 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3090) | 3090 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3109) | 3109 |
| [`applyBulkIpChanges`](../../interface/application.js#L3125) | 3125 |
| [`subnetCidrFeedback`](../../interface/application.js#L3139) | 3139 |
| [`suggestSubnetGateway`](../../interface/application.js#L3157) | 3157 |
| [`openSubnetModal`](../../interface/application.js#L3185) | 3185 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3189) | 3189 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3215) | 3215 |
| [`handleSubnetSubmit`](../../interface/application.js#L3235) | 3235 |
| [`showSubnetFormError`](../../interface/application.js#L3442) | 3442 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3458) | 3458 |
| [`subnetNameConflicts`](../../interface/application.js#L3472) | 3472 |
| [`subnetHasVlan`](../../interface/application.js#L3479) | 3479 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3482) | 3482 |
| [`openMultipleSubnets`](../../interface/application.js#L3490) | 3490 |
| [`option`](../../interface/application.js#L3492) | 3492 |
| [`visibility`](../../interface/application.js#L3497) | 3497 |
| [`planningVisibility`](../../interface/application.js#L3501) | 3501 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3519) | 3519 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3531) | 3531 |
| [`read`](../../interface/application.js#L3533) | 3533 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3551) | 3551 |
| [`reject`](../../interface/application.js#L3553) | 3553 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3590) | 3590 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3594) | 3594 |
| [`add`](../../interface/application.js#L3597) | 3597 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3624) | 3624 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3632) | 3632 |
| [`field`](../../interface/application.js#L3635) | 3635 |
| [`capture`](../../interface/application.js#L3645) | 3645 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3679) | 3679 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3683) | 3683 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3689) | 3689 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3710) | 3710 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3714) | 3714 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3718) | 3718 |
| [`deleteSubnet`](../../interface/application.js#L3729) | 3729 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3789) | 3789 |
| [`deleteSubnetCommit`](../../interface/application.js#L3817) | 3817 |
| [`deleteVlan`](../../interface/application.js#L3847) | 3847 |
| [`openIpModal`](../../interface/application.js#L3873) | 3873 |
| [`handleIpSubmit`](../../interface/application.js#L3890) | 3890 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3956) | 3956 |
| [`modalFormSnapshot`](../../interface/application.js#L3966) | 3966 |
| [`rememberModalForm`](../../interface/application.js#L3971) | 3971 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3976) | 3976 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3995) | 3995 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4014) | 4014 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4023) | 4023 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4029) | 4029 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4035) | 4035 |
| [`closeModal`](../../interface/application.js#L4044) | 4044 |
| [`openModal`](../../interface/application.js#L4071) | 4071 |
| [`readRackDimension`](../../interface/application.js#L4144) | 4144 |
| [`formatRackDimension`](../../interface/application.js#L4151) | 4151 |
| [`rackPhysicalDetails`](../../interface/application.js#L4156) | 4156 |
| [`openRackModal`](../../interface/application.js#L4165) | 4165 |
| [`handleRackSubmit`](../../interface/application.js#L4181) | 4181 |
| [`deleteRack`](../../interface/application.js#L4248) | 4248 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4270) | 4270 |
| [`refresh`](../../interface/application.js#L4293) | 4293 |
| [`openAssignDeviceModal`](../../interface/application.js#L4370) | 4370 |
| [`refresh`](../../interface/application.js#L4387) | 4387 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4394) | 4394 |
| [`handleAssignSubmit`](../../interface/application.js#L4428) | 4428 |
| [`unassignDevice`](../../interface/application.js#L4473) | 4473 |
| [`getSubnetForIp`](../../interface/application.js#L4490) | 4490 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4494) | 4494 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4541) | 4541 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4550) | 4550 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4559) | 4559 |
| [`inside`](../../interface/application.js#L4566) | 4566 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4584) | 4584 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4593) | 4593 |
| [`toggleDeviceMountType`](../../interface/application.js#L4637) | 4637 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4661) | 4661 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4666) | 4666 |
| [`openDeviceReviewModal`](../../interface/application.js#L4684) | 4684 |
| [`openDeviceDetailView`](../../interface/application.js#L4689) | 4689 |
| [`safe`](../../interface/application.js#L4699) | 4699 |
| [`field`](../../interface/application.js#L4700) | 4700 |
| [`section`](../../interface/application.js#L4701) | 4701 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4746) | 4746 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4752) | 4752 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4771) | 4771 |
| [`navigateToDeviceRack`](../../interface/application.js#L4789) | 4789 |
| [`duplicateDevice`](../../interface/application.js#L4817) | 4817 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4887) | 4887 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4892) | 4892 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4897) | 4897 |
| [`openServerServiceManager`](../../interface/application.js#L4898) | 4898 |
| [`captureServerServiceSelections`](../../interface/application.js#L4903) | 4903 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4909) | 4909 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4930) | 4930 |
| [`archiveServerService`](../../interface/application.js#L4938) | 4938 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4962) | 4962 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4966) | 4966 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4984) | 4984 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4988) | 4988 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4991) | 4991 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4998) | 4998 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5026) | 5026 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5030) | 5030 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5075) | 5075 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5109) | 5109 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5126) | 5126 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5129) | 5129 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5130) | 5130 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5135) | 5135 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5141) | 5141 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5178) | 5178 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5179) | 5179 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5186) | 5186 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5187) | 5187 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5202) | 5202 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5208) | 5208 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5231) | 5231 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5247) | 5247 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5250) | 5250 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5259) | 5259 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5270) | 5270 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5279) | 5279 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5282) | 5282 |
| [`isSoftwareDetailField`](../../interface/application.js#L5289) | 5289 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5297) | 5297 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5306) | 5306 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5312) | 5312 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5324) | 5324 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5364) | 5364 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5392) | 5392 |
| [`updateInlinePickerCount`](../../interface/application.js#L5401) | 5401 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5407) | 5407 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5420) | 5420 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5429) | 5429 |
| [`fail`](../../interface/application.js#L5435) | 5435 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5489) | 5489 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5505) | 5505 |
| [`fail`](../../interface/application.js#L5510) | 5510 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5557) | 5557 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5587) | 5587 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5593) | 5593 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5959) | 5959 |
| [`isWindowsPlatform`](../../interface/application.js#L5962) | 5962 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5966) | 5966 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5969) | 5969 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5973) | 5973 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5990) | 5990 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5994) | 5994 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6014) | 6014 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6041) | 6041 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6090) | 6090 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6098) | 6098 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6109) | 6109 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6113) | 6113 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6125) | 6125 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6136) | 6136 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6163) | 6163 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6167) | 6167 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6171) | 6171 |
| [`getDefaultMountType`](../../interface/application.js#L6184) | 6184 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6187) | 6187 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6192) | 6192 |
| [`initialiseNotesEditor`](../../interface/application.js#L6209) | 6209 |
| [`inlineMarkdown`](../../interface/application.js#L6214) | 6214 |
| [`render`](../../interface/application.js#L6227) | 6227 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6261) | 6261 |
| [`activate`](../../interface/application.js#L6655) | 6655 |
| [`openDeviceModal`](../../interface/application.js#L6736) | 6736 |
| [`syncVmPurpose`](../../interface/application.js#L6784) | 6784 |
| [`clearFieldError`](../../interface/application.js#L6845) | 6845 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6864) | 6864 |
| [`createRackFromDevice`](../../interface/application.js#L6899) | 6899 |
| [`cancelRackFromDevice`](../../interface/application.js#L6907) | 6907 |
| [`createSubnetFromDevice`](../../interface/application.js#L6917) | 6917 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6930) | 6930 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6944) | 6944 |
| [`addCustomLocationOption`](../../interface/application.js#L6956) | 6956 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6996) | 6996 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7008) | 7008 |
| [`finish`](../../interface/application.js#L7028) | 7028 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7053) | 7053 |
| [`finish`](../../interface/application.js#L7067) | 7067 |
| [`handleDeviceSubmit`](../../interface/application.js#L7087) | 7087 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7127) | 7127 |
| [`deleteDevice`](../../interface/application.js#L7276) | 7276 |
| [`personalSafeStorageGet`](../../interface/application.js#L7333) | 7333 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7338) | 7338 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7348) | 7348 |
| [`button`](../../interface/application.js#L7349) | 7349 |
| [`themeChoice`](../../interface/application.js#L7353) | 7353 |
| [`guideLinks`](../../interface/application.js#L7370) | 7370 |
| [`loadSmtpSettings`](../../interface/application.js#L7401) | 7401 |
| [`renderApplicationSettings`](../../interface/application.js#L7416) | 7416 |
| [`syncSmtpForm`](../../interface/application.js#L7420) | 7420 |
| [`updateSmtpFields`](../../interface/application.js#L7442) | 7442 |
| [`hydrateSettings`](../../interface/application.js#L7455) | 7455 |
| [`caffootCompareVersions`](../../interface/application.js#L7477) | 7477 |
| [`parse`](../../interface/application.js#L7478) | 7478 |
| [`caffootShowLicences`](../../interface/application.js#L7500) | 7500 |
| [`caffootUpdateGuide`](../../interface/application.js#L7505) | 7505 |
| [`caffootCheckUpdates`](../../interface/application.js#L7510) | 7510 |
| [`checkInventorySafety`](../../interface/application.js#L7541) | 7541 |
| [`requestInventoryReset`](../../interface/application.js#L7564) | 7564 |
| [`createInventoryBackup`](../../interface/application.js#L7591) | 7591 |
| [`validateBackupVersion`](../../interface/application.js#L7603) | 7603 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7618) | 7618 |
| [`exportData`](../../interface/application.js#L7626) | 7626 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7639) | 7639 |
| [`validateBackupStructure`](../../interface/application.js#L7654) | 7654 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7671) | 7671 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7683) | 7683 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7722) | 7722 |
| [`findRackImportConflicts`](../../interface/application.js#L7726) | 7726 |
| [`place`](../../interface/application.js#L7732) | 7732 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7778) | 7778 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7799) | 7799 |
| [`showBackupImportError`](../../interface/application.js#L7804) | 7804 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7808) | 7808 |
| [`finish`](../../interface/application.js#L7818) | 7818 |
| [`onClick`](../../interface/application.js#L7827) | 7827 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7837) | 7837 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7848) | 7848 |
| [`finish`](../../interface/application.js#L7859) | 7859 |
| [`onClick`](../../interface/application.js#L7868) | 7868 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7883) | 7883 |
| [`importData`](../../interface/application.js#L7899) | 7899 |
| [`reader.onload`](../../interface/application.js#L7909) | 7909 |
| [`reader.onerror`](../../interface/application.js#L7983) | 7983 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8110) | 8110 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8126) | 8126 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8137) | 8137 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8171) | 8171 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8229) | 8229 |
| [`cancel`](../../interface/application.js#L8242) | 8242 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8258) | 8258 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8275) | 8275 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8300) | 8300 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8314) | 8314 |
| [`clearRackDropPreview`](../../interface/application.js#L8317) | 8317 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8322) | 8322 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8334) | 8334 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8340) | 8340 |
| [`trackRackDrag`](../../interface/application.js#L8349) | 8349 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8380) | 8380 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8390) | 8390 |
| [`getRackDropPosition`](../../interface/application.js#L8483) | 8483 |
| [`window.onload`](../../interface/application.js#L8939) | 8939 |
| [`inventorySectionAccess`](../../interface/application.js#L8956) | 8956 |
| [`addDirectoryAccess`](../../interface/application.js#L8957) | 8957 |
| [`refreshCentralInventory`](../../interface/application.js#L8963) | 8963 |
| [`postInventory`](../../interface/application.js#L8987) | 8987 |
| [`isBlockedAction`](../../interface/application.js#L9039) | 9039 |
| [`applyAllowedControls`](../../interface/application.js#L9072) | 9072 |
| [`enhanceLongSelects`](../../interface/application.js#L9139) | 9139 |
| [`sync`](../../interface/application.js#L9190) | 9190 |
| [`close`](../../interface/application.js#L9196) | 9196 |
| [`choose`](../../interface/application.js#L9200) | 9200 |
| [`draw`](../../interface/application.js#L9205) | 9205 |
| [`open`](../../interface/application.js#L9223) | 9223 |
| [`enhanceSelects`](../../interface/application.js#L9280) | 9280 |
| [`switchTab`](../../interface/application.js#L9336) | 9336 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9347) | 9347 |
| [`openDeviceDetailView`](../../interface/application.js#L9373) | 9373 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9382) | 9382 |
| [`forbidRackMount`](../../interface/application.js#L9441) | 9441 |
| [`openDeviceModal`](../../interface/application.js#L9451) | 9451 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9489) | 9489 |
| [`relatedChanges`](../../interface/application.js#L9495) | 9495 |
| [`saveDevice`](../../interface/application.js#L9506) | 9506 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9542) | 9542 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9543) | 9543 |
| [`nextIpamBridge.save`](../../interface/application.js#L9565) | 9565 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9587) | 9587 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9609) | 9609 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9651) | 9651 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9695) | 9695 |
| [`openDeviceIpamLink`](../../interface/application.js#L9699) | 9699 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9707) | 9707 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9748) | 9748 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9765) | 9765 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9766) | 9766 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9767) | 9767 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9781) | 9781 |
| [`nextResetBridge.reset`](../../interface/application.js#L9812) | 9812 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9839) | 9839 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9866) | 9866 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9874) | 9874 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9883) | 9883 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9884) | 9884 |
| [`nextRackBridge.save`](../../interface/application.js#L9919) | 9919 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9922) | 9922 |
| [`nextRackBridge.persist`](../../interface/application.js#L9925) | 9925 |
| [`reserveForDelete`](../../interface/application.js#L9947) | 9947 |
| [`removeDevice`](../../interface/application.js#L9955) | 9955 |
| [`cancelDelete`](../../interface/application.js#L9981) | 9981 |
| [`saveArchivedInstallation`](../../interface/application.js#L9987) | 9987 |
| [`renderAccountSections`](../../interface/application.js#L10024) | 10024 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10052) | 10052 |
| [`nextRenderAccount`](../../interface/application.js#L10063) | 10063 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10073) | 10073 |
| [`closeEmailVerification`](../../interface/application.js#L10097) | 10097 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10104) | 10104 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10115) | 10115 |
| [`hydrateAccount`](../../interface/application.js#L10169) | 10169 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10207) | 10207 |
| [`loadAccountProfile`](../../interface/application.js#L10220) | 10220 |
| [`removeAccountPhoto`](../../interface/application.js#L10236) | 10236 |
| [`permissionLabel`](../../interface/application.js#L10248) | 10248 |
| [`accountMfaLabel`](../../interface/application.js#L10251) | 10251 |
| [`renderRoleMemberships`](../../interface/application.js#L10254) | 10254 |
| [`renderRoleCatalogue`](../../interface/application.js#L10260) | 10260 |
| [`openRoleLayer`](../../interface/application.js#L10265) | 10265 |
| [`closeRoleLayer`](../../interface/application.js#L10276) | 10276 |
| [`renderRoleDefinition`](../../interface/application.js#L10282) | 10282 |
| [`renderRoleImpact`](../../interface/application.js#L10286) | 10286 |
| [`access`](../../interface/application.js#L10291) | 10291 |
| [`state`](../../interface/application.js#L10295) | 10295 |
| [`requestRoleChange`](../../interface/application.js#L10300) | 10300 |
| [`roleNotificationMessage`](../../interface/application.js#L10307) | 10307 |
| [`previewRoleAction`](../../interface/application.js#L10311) | 10311 |
| [`openRoleEditor`](../../interface/application.js#L10316) | 10316 |
| [`nextRenderUsers`](../../interface/application.js#L10379) | 10379 |
| [`profileFields`](../../interface/application.js#L10381) | 10381 |
| [`stat`](../../interface/application.js#L10402) | 10402 |
| [`bars`](../../interface/application.js#L10405) | 10405 |
| [`operation`](../../interface/application.js#L10461) | 10461 |
| [`filterUserRows`](../../interface/application.js#L10481) | 10481 |
| [`closeUserWorkspace`](../../interface/application.js#L10505) | 10505 |
| [`loadCentralUsers`](../../interface/application.js#L10534) | 10534 |
| [`changeCentralUser`](../../interface/application.js#L10540) | 10540 |
| [`importPanel`](../../interface/application.js#L10551) | 10551 |
| [`cancelImport`](../../interface/application.js#L10555) | 10555 |
| [`nextImportModalClosed`](../../interface/application.js#L10561) | 10561 |
| [`showImportReview`](../../interface/application.js#L10562) | 10562 |
| [`chooseImportFile`](../../interface/application.js#L10602) | 10602 |
| [`actOnImport`](../../interface/application.js#L10619) | 10619 |

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

## interface/staff-directory.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](../../interface/staff-directory.js#L9) | 9 |
| [`displayName`](../../interface/staff-directory.js#L10) | 10 |
| [`departmentName`](../../interface/staff-directory.js#L11) | 11 |
| [`isAdministrator`](../../interface/staff-directory.js#L12) | 12 |
| [`canReadStaff`](../../interface/staff-directory.js#L13) | 13 |
| [`canEditStaff`](../../interface/staff-directory.js#L14) | 14 |
| [`canReadDepartments`](../../interface/staff-directory.js#L15) | 15 |
| [`canEditDepartments`](../../interface/staff-directory.js#L16) | 16 |
| [`icon`](../../interface/staff-directory.js#L17) | 17 |
| [`button`](../../interface/staff-directory.js#L18) | 18 |
| [`badge`](../../interface/staff-directory.js#L19) | 19 |
| [`header`](../../interface/staff-directory.js#L20) | 20 |
| [`renderStaffDirectory`](../../interface/staff-directory.js#L23) | 23 |
| [`detailRow`](../../interface/staff-directory.js#L29) | 29 |
| [`renderStaffDetails`](../../interface/staff-directory.js#L30) | 30 |
| [`field`](../../interface/staff-directory.js#L34) | 34 |
| [`renderStaffForm`](../../interface/staff-directory.js#L35) | 35 |
| [`cardHeading`](../../interface/staff-directory.js#L39) | 39 |
| [`renderDepartments`](../../interface/staff-directory.js#L64) | 64 |
| [`request`](../../interface/staff-directory.js#L69) | 69 |
| [`readAll`](../../interface/staff-directory.js#L76) | 76 |
| [`refresh`](../../interface/staff-directory.js#L86) | 86 |
| [`render`](../../interface/staff-directory.js#L104) | 104 |
| [`enter`](../../interface/staff-directory.js#L114) | 114 |
| [`redraw`](../../interface/staff-directory.js#L121) | 121 |
| [`saveStaff`](../../interface/staff-directory.js#L122) | 122 |
| [`openDepartmentDialog`](../../interface/staff-directory.js#L140) | 140 |
| [`closeDepartmentDialog`](../../interface/staff-directory.js#L151) | 151 |
| [`saveDepartment`](../../interface/staff-directory.js#L152) | 152 |
| [`configure`](../../interface/staff-directory.js#L159) | 159 |

## interface/equipment.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](../../interface/equipment.js#L5) | 5 |
| [`dateLabel`](../../interface/equipment.js#L6) | 6 |
| [`button`](../../interface/equipment.js#L7) | 7 |
| [`request`](../../interface/equipment.js#L8) | 8 |
| [`assignmentHistory`](../../interface/equipment.js#L14) | 14 |
| [`staffPlaceholder`](../../interface/equipment.js#L19) | 19 |
| [`loadStaffEquipment`](../../interface/equipment.js#L23) | 23 |
| [`rows`](../../interface/equipment.js#L28) | 28 |
| [`loadDeviceEquipment`](../../interface/equipment.js#L32) | 32 |
| [`renderMyEquipment`](../../interface/equipment.js#L44) | 44 |
| [`loadMyEquipment`](../../interface/equipment.js#L47) | 47 |
| [`list`](../../interface/equipment.js#L50) | 50 |
| [`hydrate`](../../interface/equipment.js#L58) | 58 |
| [`showAssignmentDialog`](../../interface/equipment.js#L62) | 62 |
| [`searchRecipients`](../../interface/equipment.js#L73) | 73 |
| [`searchDevices`](../../interface/equipment.js#L82) | 82 |
| [`leaveAssignmentDialog`](../../interface/equipment.js#L90) | 90 |
| [`saveAssignment`](../../interface/equipment.js#L96) | 96 |
| [`controls`](../../interface/equipment.js#L103) | 103 |
| [`caffootEquipment.configure`](../../interface/equipment.js#L142) | 142 |

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
| [`hash_password`](../../backend/accounts.py#L16) | 16 |
| [`verify_password`](../../backend/accounts.py#L24) | 24 |
| [`bootstrap_first_admin`](../../backend/accounts.py#L43) | 43 |
| [`confirm_admin_mfa`](../../backend/accounts.py#L68) | 68 |

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

## backend/device_addresses.py

| Function | Line |
| --- | ---: |
| [`is_basic_address`](../../backend/device_addresses.py#L6) | 6 |
| [`prepare_device_address`](../../backend/device_addresses.py#L10) | 10 |
| [`basic_address_errors`](../../backend/device_addresses.py#L37) | 37 |

## backend/device_assignments.py

| Function | Line |
| --- | ---: |
| [`require_assignment_access`](../../backend/device_assignments.py#L10) | 10 |
| [`assignment_recipients`](../../backend/device_assignments.py#L15) | 15 |
| [`device_assignment_dependency`](../../backend/device_assignments.py#L30) | 30 |
| [`assignment_device_choices`](../../backend/device_assignments.py#L43) | 43 |
| [`read_assignments`](../../backend/device_assignments.py#L57) | 57 |
| [`assign_devices`](../../backend/device_assignments.py#L84) | 84 |
| [`my_equipment`](../../backend/device_assignments.py#L136) | 136 |

## backend/device_catalogue.py

| Function | Line |
| --- | ---: |
| [`change_device_catalogue`](../../backend/device_catalogue.py#L15) | 15 |

## backend/device_rack_fields.py

| Function | Line |
| --- | ---: |
| [`prepare_device_rack_fields`](../../backend/device_rack_fields.py#L8) | 8 |

## backend/device_saves.py

| Function | Line |
| --- | ---: |
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L27) | 27 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L46) | 46 |
| [`_persist_related_guests`](../../backend/device_saves.py#L90) | 90 |
| [`save_reserved_device`](../../backend/device_saves.py#L103) | 103 |
| [`create_device`](../../backend/device_saves.py#L243) | 243 |
| [`delete_reserved_device`](../../backend/device_saves.py#L323) | 323 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](../../backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](../../backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](../../backend/feature_settings.py#L28) | 28 |

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

## backend/inventory_projection.py

| Function | Line |
| --- | ---: |
| [`project_inventory_response`](../../backend/inventory_projection.py#L8) | 8 |
| [`count_basic_ips_outside_subnets`](../../backend/inventory_projection.py#L39) | 39 |

## backend/ipam_linking.py

| Function | Line |
| --- | ---: |
| [`unique_link_fields`](../../backend/ipam_linking.py#L16) | 16 |
| [`link_device_to_ipam`](../../backend/ipam_linking.py#L26) | 26 |

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
| [`_admin`](../../backend/permissions.py#L12) | 12 |
| [`_target`](../../backend/permissions.py#L21) | 21 |
| [`create_user`](../../backend/permissions.py#L30) | 30 |
| [`create_user_in_transaction`](../../backend/permissions.py#L46) | 46 |
| [`set_permission`](../../backend/permissions.py#L77) | 77 |
| [`can_access`](../../backend/permissions.py#L88) | 88 |
| [`feature_enabled`](../../backend/permissions.py#L93) | 93 |
| [`set_account_active`](../../backend/permissions.py#L106) | 106 |
| [`delete_user`](../../backend/permissions.py#L145) | 145 |
| [`set_administrator`](../../backend/permissions.py#L173) | 173 |
| [`can_replace_inventory`](../../backend/permissions.py#L214) | 214 |

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
| [`migrate_staff_directory`](../../backend/schema.py#L225) | 225 |
| [`migrate_role_permissions`](../../backend/schema.py#L290) | 290 |
| [`verify_role_migration`](../../backend/schema.py#L375) | 375 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L401) | 401 |
| [`migrate_device_assignments`](../../backend/schema.py#L495) | 495 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L89) | 89 |
| [`connect`](../../backend/server.py#L107) | 107 |
| [`initialise_database`](../../backend/server.py#L115) | 115 |
| [`Handler.end_headers`](../../backend/server.py#L121) | 121 |
| [`Handler.do_GET`](../../backend/server.py#L128) | 128 |
| [`Handler.do_POST`](../../backend/server.py#L484) | 484 |
| [`Handler.handle_equipment_request`](../../backend/server.py#L664) | 664 |
| [`Handler.handle_directory_request`](../../backend/server.py#L731) | 731 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L806) | 806 |
| [`Handler.handle_role_change`](../../backend/server.py#L849) | 849 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L891) | 891 |
| [`Handler.handle_account_email`](../../backend/server.py#L1283) | 1283 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1363) | 1363 |
| [`Handler.handle_import`](../../backend/server.py#L1394) | 1394 |
| [`Handler.respond`](../../backend/server.py#L1470) | 1470 |
| [`main`](../../backend/server.py#L1483) | 1483 |

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

## backend/staff_directory.py

| Function | Line |
| --- | ---: |
| [`unique_directory_fields`](../../backend/staff_directory.py#L14) | 14 |
| [`require_directory_access`](../../backend/staff_directory.py#L24) | 24 |
| [`_text`](../../backend/staff_directory.py#L30) | 30 |
| [`_staff_record`](../../backend/staff_directory.py#L37) | 37 |
| [`_department_record`](../../backend/staff_directory.py#L44) | 44 |
| [`read_staff_member`](../../backend/staff_directory.py#L51) | 51 |
| [`department_has_associations`](../../backend/staff_directory.py#L62) | 62 |
| [`read_department`](../../backend/staff_directory.py#L78) | 78 |
| [`list_directory`](../../backend/staff_directory.py#L85) | 85 |
| [`list_staff_department_choices`](../../backend/staff_directory.py#L99) | 99 |
| [`_validate_staff`](../../backend/staff_directory.py#L112) | 112 |
| [`_create_login`](../../backend/staff_directory.py#L129) | 129 |
| [`save_staff_member`](../../backend/staff_directory.py#L144) | 144 |
| [`save_department`](../../backend/staff_directory.py#L188) | 188 |

## backend/staff_identity.py

| Function | Line |
| --- | ---: |
| [`link_account_staff`](../../backend/staff_identity.py#L4) | 4 |

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
