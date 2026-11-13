# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 752.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`initialiseDeviceShelfFields`](../../interface/application.js#L915) | 915 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L931) | 931 |
| [`openRackShelfCreation`](../../interface/application.js#L949) | 949 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L963) | 963 |
| [`createRackShelfFromDevice`](../../interface/application.js#L973) | 973 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L980) | 980 |
| [`options`](../../interface/application.js#L986) | 986 |
| [`validateRackPlacement`](../../interface/application.js#L1007) | 1007 |
| [`showToast`](../../interface/application.js#L1042) | 1042 |
| [`toggleSidebar`](../../interface/application.js#L1130) | 1130 |
| [`switchTab`](../../interface/application.js#L1149) | 1149 |
| [`escapeHtml`](../../interface/application.js#L1176) | 1176 |
| [`inlineJsArg`](../../interface/application.js#L1185) | 1185 |
| [`browserStorageWarning`](../../interface/application.js#L1193) | 1193 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1196) | 1196 |
| [`renderSectionTabIcon`](../../interface/application.js#L1202) | 1202 |
| [`renderSectionHeader`](../../interface/application.js#L1208) | 1208 |
| [`tab`](../../interface/application.js#L1209) | 1209 |
| [`revealSectionTab`](../../interface/application.js#L1236) | 1236 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1243) | 1243 |
| [`renderContent`](../../interface/application.js#L1259) | 1259 |
| [`updateScrollHint`](../../interface/application.js#L1295) | 1295 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1306) | 1306 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1341) | 1341 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1345) | 1345 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1349) | 1349 |
| [`buildInventoryReportData`](../../interface/application.js#L1355) | 1355 |
| [`occupancy`](../../interface/application.js#L1371) | 1371 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1394) | 1394 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1400) | 1400 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1426) | 1426 |
| [`renderDashboardHTML`](../../interface/application.js#L1445) | 1445 |
| [`statusPill`](../../interface/application.js#L1548) | 1548 |
| [`insightSegment`](../../interface/application.js#L1565) | 1565 |
| [`getCategoryIcon`](../../interface/application.js#L1606) | 1606 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1621) | 1621 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1630) | 1630 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1635) | 1635 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1650) | 1650 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1665) | 1665 |
| [`printRackElevation`](../../interface/application.js#L1675) | 1675 |
| [`safe`](../../interface/application.js#L1678) | 1678 |
| [`printRackElevationInFrame`](../../interface/application.js#L1709) | 1709 |
| [`frame.onload`](../../interface/application.js#L1719) | 1719 |
| [`renderRackHubV13`](../../interface/application.js#L1740) | 1740 |
| [`card`](../../interface/application.js#L1745) | 1745 |
| [`mark`](../../interface/application.js#L1754) | 1754 |
| [`bar`](../../interface/application.js#L1770) | 1770 |
| [`chartBox`](../../interface/application.js#L1771) | 1771 |
| [`chartRows`](../../interface/application.js#L1772) | 1772 |
| [`rackSpaceGuide`](../../interface/application.js#L1774) | 1774 |
| [`renderRacksHTML`](../../interface/application.js#L1843) | 1843 |
| [`changeRack`](../../interface/application.js#L1910) | 1910 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1929) | 1929 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1936) | 1936 |
| [`getVisibleDevices`](../../interface/application.js#L1942) | 1942 |
| [`filterHardwareModels`](../../interface/application.js#L1967) | 1967 |
| [`openCatalogueModal`](../../interface/application.js#L2006) | 2006 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2015) | 2015 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2039) | 2039 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2077) | 2077 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2089) | 2089 |
| [`renderCatalogueButton`](../../interface/application.js#L2106) | 2106 |
| [`renderCatalogueRecord`](../../interface/application.js#L2110) | 2110 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2115) | 2115 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2134) | 2134 |
| [`add`](../../interface/application.js#L2136) | 2136 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2181) | 2181 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2188) | 2188 |
| [`openHardwareModelManager`](../../interface/application.js#L2200) | 2200 |
| [`opts`](../../interface/application.js#L2205) | 2205 |
| [`saveHardwareModel`](../../interface/application.js#L2223) | 2223 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2252) | 2252 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2266) | 2266 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2288) | 2288 |
| [`add`](../../interface/application.js#L2290) | 2290 |
| [`options`](../../interface/application.js#L2326) | 2326 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2340) | 2340 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2355) | 2355 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2370) | 2370 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2378) | 2378 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2389) | 2389 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2398) | 2398 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2420) | 2420 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2431) | 2431 |
| [`openServerServiceEditor`](../../interface/application.js#L2448) | 2448 |
| [`saveServerServiceEntry`](../../interface/application.js#L2457) | 2457 |
| [`restoreArchivedServerService`](../../interface/application.js#L2470) | 2470 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2479) | 2479 |
| [`renderDevicesHTML`](../../interface/application.js#L2491) | 2491 |
| [`renderHardwareMetric`](../../interface/application.js#L2499) | 2499 |
| [`renderHardwareChart`](../../interface/application.js#L2504) | 2504 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2514) | 2514 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2533) | 2533 |
| [`renderArchivedSoftware`](../../interface/application.js#L2541) | 2541 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2576) | 2576 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2583) | 2583 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2584) | 2584 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2585) | 2585 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2588) | 2588 |
| [`openManageTypesModal`](../../interface/application.js#L2604) | 2604 |
| [`openManageLocationsModal`](../../interface/application.js#L2605) | 2605 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2608) | 2608 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2630) | 2630 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2637) | 2637 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2645) | 2645 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2665) | 2665 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2666) | 2666 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2667) | 2667 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2682) | 2682 |
| [`deleteDeviceType`](../../interface/application.js#L2702) | 2702 |
| [`deleteDeviceLocation`](../../interface/application.js#L2703) | 2703 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2711) | 2711 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2715) | 2715 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2742) | 2742 |
| [`nodes`](../../interface/application.js#L2752) | 2752 |
| [`renderIpamManage`](../../interface/application.js#L2778) | 2778 |
| [`renderIpamHTML`](../../interface/application.js#L2829) | 2829 |
| [`changeSubnet`](../../interface/application.js#L2990) | 2990 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3003) | 3003 |
| [`openIpamModal`](../../interface/application.js#L3029) | 3029 |
| [`openBulkIpModal`](../../interface/application.js#L3034) | 3034 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3041) | 3041 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3045) | 3045 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3064) | 3064 |
| [`applyBulkIpChanges`](../../interface/application.js#L3080) | 3080 |
| [`subnetCidrFeedback`](../../interface/application.js#L3094) | 3094 |
| [`suggestSubnetGateway`](../../interface/application.js#L3112) | 3112 |
| [`openSubnetModal`](../../interface/application.js#L3140) | 3140 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3144) | 3144 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3170) | 3170 |
| [`handleSubnetSubmit`](../../interface/application.js#L3190) | 3190 |
| [`showSubnetFormError`](../../interface/application.js#L3397) | 3397 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3412) | 3412 |
| [`subnetNameConflicts`](../../interface/application.js#L3426) | 3426 |
| [`subnetHasVlan`](../../interface/application.js#L3433) | 3433 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3436) | 3436 |
| [`openMultipleSubnets`](../../interface/application.js#L3444) | 3444 |
| [`option`](../../interface/application.js#L3446) | 3446 |
| [`visibility`](../../interface/application.js#L3451) | 3451 |
| [`planningVisibility`](../../interface/application.js#L3455) | 3455 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3473) | 3473 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3485) | 3485 |
| [`read`](../../interface/application.js#L3487) | 3487 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3505) | 3505 |
| [`reject`](../../interface/application.js#L3507) | 3507 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3544) | 3544 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3548) | 3548 |
| [`add`](../../interface/application.js#L3551) | 3551 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3578) | 3578 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3585) | 3585 |
| [`field`](../../interface/application.js#L3588) | 3588 |
| [`capture`](../../interface/application.js#L3598) | 3598 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3632) | 3632 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3636) | 3636 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3642) | 3642 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3663) | 3663 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3667) | 3667 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3671) | 3671 |
| [`deleteSubnet`](../../interface/application.js#L3682) | 3682 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3742) | 3742 |
| [`deleteSubnetCommit`](../../interface/application.js#L3770) | 3770 |
| [`deleteVlan`](../../interface/application.js#L3800) | 3800 |
| [`openIpModal`](../../interface/application.js#L3826) | 3826 |
| [`handleIpSubmit`](../../interface/application.js#L3843) | 3843 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3909) | 3909 |
| [`modalFormSnapshot`](../../interface/application.js#L3919) | 3919 |
| [`rememberModalForm`](../../interface/application.js#L3924) | 3924 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3929) | 3929 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3948) | 3948 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3967) | 3967 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3976) | 3976 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3982) | 3982 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3988) | 3988 |
| [`closeModal`](../../interface/application.js#L3997) | 3997 |
| [`openModal`](../../interface/application.js#L4024) | 4024 |
| [`readRackDimension`](../../interface/application.js#L4097) | 4097 |
| [`formatRackDimension`](../../interface/application.js#L4104) | 4104 |
| [`rackPhysicalDetails`](../../interface/application.js#L4109) | 4109 |
| [`openRackModal`](../../interface/application.js#L4118) | 4118 |
| [`handleRackSubmit`](../../interface/application.js#L4134) | 4134 |
| [`deleteRack`](../../interface/application.js#L4201) | 4201 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4223) | 4223 |
| [`refresh`](../../interface/application.js#L4246) | 4246 |
| [`openAssignDeviceModal`](../../interface/application.js#L4323) | 4323 |
| [`refresh`](../../interface/application.js#L4340) | 4340 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4347) | 4347 |
| [`handleAssignSubmit`](../../interface/application.js#L4381) | 4381 |
| [`unassignDevice`](../../interface/application.js#L4426) | 4426 |
| [`getSubnetForIp`](../../interface/application.js#L4443) | 4443 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4447) | 4447 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4494) | 4494 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4503) | 4503 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4512) | 4512 |
| [`inside`](../../interface/application.js#L4519) | 4519 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4537) | 4537 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4546) | 4546 |
| [`toggleDeviceMountType`](../../interface/application.js#L4590) | 4590 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4614) | 4614 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4619) | 4619 |
| [`openDeviceReviewModal`](../../interface/application.js#L4637) | 4637 |
| [`openDeviceDetailView`](../../interface/application.js#L4642) | 4642 |
| [`safe`](../../interface/application.js#L4652) | 4652 |
| [`field`](../../interface/application.js#L4653) | 4653 |
| [`section`](../../interface/application.js#L4654) | 4654 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4699) | 4699 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4705) | 4705 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4724) | 4724 |
| [`navigateToDeviceRack`](../../interface/application.js#L4740) | 4740 |
| [`duplicateDevice`](../../interface/application.js#L4768) | 4768 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4838) | 4838 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4843) | 4843 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4848) | 4848 |
| [`openServerServiceManager`](../../interface/application.js#L4849) | 4849 |
| [`captureServerServiceSelections`](../../interface/application.js#L4854) | 4854 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4860) | 4860 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4881) | 4881 |
| [`archiveServerService`](../../interface/application.js#L4889) | 4889 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4913) | 4913 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4917) | 4917 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4935) | 4935 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4939) | 4939 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4942) | 4942 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4949) | 4949 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4977) | 4977 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4981) | 4981 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5026) | 5026 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5060) | 5060 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5077) | 5077 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5080) | 5080 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5081) | 5081 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5086) | 5086 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5092) | 5092 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5129) | 5129 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5130) | 5130 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5137) | 5137 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5138) | 5138 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5153) | 5153 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5159) | 5159 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5182) | 5182 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5198) | 5198 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5201) | 5201 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5210) | 5210 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5221) | 5221 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5230) | 5230 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5233) | 5233 |
| [`isSoftwareDetailField`](../../interface/application.js#L5240) | 5240 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5248) | 5248 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5257) | 5257 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5263) | 5263 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5275) | 5275 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5314) | 5314 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5342) | 5342 |
| [`updateInlinePickerCount`](../../interface/application.js#L5351) | 5351 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5357) | 5357 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5370) | 5370 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5379) | 5379 |
| [`fail`](../../interface/application.js#L5385) | 5385 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5439) | 5439 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5455) | 5455 |
| [`fail`](../../interface/application.js#L5460) | 5460 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5507) | 5507 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5537) | 5537 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5543) | 5543 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5909) | 5909 |
| [`isWindowsPlatform`](../../interface/application.js#L5912) | 5912 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5916) | 5916 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5919) | 5919 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5923) | 5923 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5940) | 5940 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5944) | 5944 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5964) | 5964 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L5991) | 5991 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6040) | 6040 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6048) | 6048 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6059) | 6059 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6063) | 6063 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6075) | 6075 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6086) | 6086 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6113) | 6113 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6117) | 6117 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6121) | 6121 |
| [`getDefaultMountType`](../../interface/application.js#L6134) | 6134 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6137) | 6137 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6142) | 6142 |
| [`initialiseNotesEditor`](../../interface/application.js#L6159) | 6159 |
| [`inlineMarkdown`](../../interface/application.js#L6164) | 6164 |
| [`render`](../../interface/application.js#L6177) | 6177 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6211) | 6211 |
| [`activate`](../../interface/application.js#L6605) | 6605 |
| [`openDeviceModal`](../../interface/application.js#L6686) | 6686 |
| [`syncVmPurpose`](../../interface/application.js#L6734) | 6734 |
| [`clearFieldError`](../../interface/application.js#L6795) | 6795 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6814) | 6814 |
| [`createRackFromDevice`](../../interface/application.js#L6849) | 6849 |
| [`cancelRackFromDevice`](../../interface/application.js#L6857) | 6857 |
| [`createSubnetFromDevice`](../../interface/application.js#L6867) | 6867 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6880) | 6880 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6894) | 6894 |
| [`addCustomLocationOption`](../../interface/application.js#L6906) | 6906 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6946) | 6946 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6958) | 6958 |
| [`finish`](../../interface/application.js#L6978) | 6978 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7003) | 7003 |
| [`finish`](../../interface/application.js#L7017) | 7017 |
| [`handleDeviceSubmit`](../../interface/application.js#L7037) | 7037 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7077) | 7077 |
| [`deleteDevice`](../../interface/application.js#L7226) | 7226 |
| [`personalSafeStorageGet`](../../interface/application.js#L7283) | 7283 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7288) | 7288 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7298) | 7298 |
| [`button`](../../interface/application.js#L7299) | 7299 |
| [`themeChoice`](../../interface/application.js#L7303) | 7303 |
| [`guideLinks`](../../interface/application.js#L7320) | 7320 |
| [`loadSmtpSettings`](../../interface/application.js#L7351) | 7351 |
| [`renderApplicationSettings`](../../interface/application.js#L7366) | 7366 |
| [`syncSmtpForm`](../../interface/application.js#L7370) | 7370 |
| [`updateSmtpFields`](../../interface/application.js#L7392) | 7392 |
| [`hydrateSettings`](../../interface/application.js#L7405) | 7405 |
| [`caffootCompareVersions`](../../interface/application.js#L7427) | 7427 |
| [`parse`](../../interface/application.js#L7428) | 7428 |
| [`caffootShowLicences`](../../interface/application.js#L7450) | 7450 |
| [`caffootUpdateGuide`](../../interface/application.js#L7455) | 7455 |
| [`caffootCheckUpdates`](../../interface/application.js#L7460) | 7460 |
| [`checkInventorySafety`](../../interface/application.js#L7491) | 7491 |
| [`requestInventoryReset`](../../interface/application.js#L7514) | 7514 |
| [`createInventoryBackup`](../../interface/application.js#L7541) | 7541 |
| [`validateBackupVersion`](../../interface/application.js#L7553) | 7553 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7568) | 7568 |
| [`exportData`](../../interface/application.js#L7576) | 7576 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7589) | 7589 |
| [`validateBackupStructure`](../../interface/application.js#L7604) | 7604 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7621) | 7621 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7633) | 7633 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7672) | 7672 |
| [`findRackImportConflicts`](../../interface/application.js#L7676) | 7676 |
| [`place`](../../interface/application.js#L7682) | 7682 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7728) | 7728 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7749) | 7749 |
| [`showBackupImportError`](../../interface/application.js#L7754) | 7754 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7758) | 7758 |
| [`finish`](../../interface/application.js#L7768) | 7768 |
| [`onClick`](../../interface/application.js#L7777) | 7777 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7787) | 7787 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7798) | 7798 |
| [`finish`](../../interface/application.js#L7809) | 7809 |
| [`onClick`](../../interface/application.js#L7818) | 7818 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7833) | 7833 |
| [`importData`](../../interface/application.js#L7849) | 7849 |
| [`reader.onload`](../../interface/application.js#L7859) | 7859 |
| [`reader.onerror`](../../interface/application.js#L7933) | 7933 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8060) | 8060 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8076) | 8076 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8087) | 8087 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8121) | 8121 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8179) | 8179 |
| [`cancel`](../../interface/application.js#L8192) | 8192 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8208) | 8208 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8225) | 8225 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8250) | 8250 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8264) | 8264 |
| [`clearRackDropPreview`](../../interface/application.js#L8267) | 8267 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8272) | 8272 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8284) | 8284 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8290) | 8290 |
| [`trackRackDrag`](../../interface/application.js#L8299) | 8299 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8330) | 8330 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8340) | 8340 |
| [`getRackDropPosition`](../../interface/application.js#L8433) | 8433 |
| [`window.onload`](../../interface/application.js#L8886) | 8886 |
| [`refreshCentralInventory`](../../interface/application.js#L8902) | 8902 |
| [`postInventory`](../../interface/application.js#L8925) | 8925 |
| [`isBlockedAction`](../../interface/application.js#L8977) | 8977 |
| [`applyAllowedControls`](../../interface/application.js#L9010) | 9010 |
| [`enhanceLongSelects`](../../interface/application.js#L9069) | 9069 |
| [`sync`](../../interface/application.js#L9120) | 9120 |
| [`close`](../../interface/application.js#L9126) | 9126 |
| [`choose`](../../interface/application.js#L9130) | 9130 |
| [`draw`](../../interface/application.js#L9135) | 9135 |
| [`open`](../../interface/application.js#L9153) | 9153 |
| [`enhanceSelects`](../../interface/application.js#L9210) | 9210 |
| [`switchTab`](../../interface/application.js#L9256) | 9256 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9267) | 9267 |
| [`openDeviceDetailView`](../../interface/application.js#L9293) | 9293 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9301) | 9301 |
| [`forbidRackMount`](../../interface/application.js#L9360) | 9360 |
| [`openDeviceModal`](../../interface/application.js#L9370) | 9370 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9408) | 9408 |
| [`relatedChanges`](../../interface/application.js#L9414) | 9414 |
| [`saveDevice`](../../interface/application.js#L9425) | 9425 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9457) | 9457 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9458) | 9458 |
| [`nextIpamBridge.save`](../../interface/application.js#L9480) | 9480 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9502) | 9502 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9524) | 9524 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9566) | 9566 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9608) | 9608 |
| [`openDeviceIpamLink`](../../interface/application.js#L9612) | 9612 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9620) | 9620 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9661) | 9661 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9678) | 9678 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9679) | 9679 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9680) | 9680 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9694) | 9694 |
| [`nextResetBridge.reset`](../../interface/application.js#L9725) | 9725 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9752) | 9752 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9779) | 9779 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9787) | 9787 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9796) | 9796 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9797) | 9797 |
| [`nextRackBridge.save`](../../interface/application.js#L9832) | 9832 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9835) | 9835 |
| [`nextRackBridge.persist`](../../interface/application.js#L9838) | 9838 |
| [`reserveForDelete`](../../interface/application.js#L9860) | 9860 |
| [`removeDevice`](../../interface/application.js#L9868) | 9868 |
| [`cancelDelete`](../../interface/application.js#L9894) | 9894 |
| [`saveArchivedInstallation`](../../interface/application.js#L9900) | 9900 |
| [`renderAccountSections`](../../interface/application.js#L9937) | 9937 |
| [`renderAccountMfaPanel`](../../interface/application.js#L9965) | 9965 |
| [`nextRenderAccount`](../../interface/application.js#L9976) | 9976 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L9986) | 9986 |
| [`closeEmailVerification`](../../interface/application.js#L10010) | 10010 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10017) | 10017 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10028) | 10028 |
| [`hydrateAccount`](../../interface/application.js#L10082) | 10082 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10120) | 10120 |
| [`loadAccountProfile`](../../interface/application.js#L10133) | 10133 |
| [`removeAccountPhoto`](../../interface/application.js#L10149) | 10149 |
| [`permissionLabel`](../../interface/application.js#L10161) | 10161 |
| [`accountMfaLabel`](../../interface/application.js#L10164) | 10164 |
| [`renderRoleMemberships`](../../interface/application.js#L10167) | 10167 |
| [`renderRoleCatalogue`](../../interface/application.js#L10173) | 10173 |
| [`openRoleLayer`](../../interface/application.js#L10178) | 10178 |
| [`closeRoleLayer`](../../interface/application.js#L10189) | 10189 |
| [`renderRoleDefinition`](../../interface/application.js#L10195) | 10195 |
| [`renderRoleImpact`](../../interface/application.js#L10199) | 10199 |
| [`access`](../../interface/application.js#L10204) | 10204 |
| [`state`](../../interface/application.js#L10208) | 10208 |
| [`requestRoleChange`](../../interface/application.js#L10213) | 10213 |
| [`roleNotificationMessage`](../../interface/application.js#L10220) | 10220 |
| [`previewRoleAction`](../../interface/application.js#L10224) | 10224 |
| [`openRoleEditor`](../../interface/application.js#L10229) | 10229 |
| [`nextRenderUsers`](../../interface/application.js#L10292) | 10292 |
| [`profileFields`](../../interface/application.js#L10294) | 10294 |
| [`stat`](../../interface/application.js#L10315) | 10315 |
| [`bars`](../../interface/application.js#L10318) | 10318 |
| [`operation`](../../interface/application.js#L10374) | 10374 |
| [`filterUserRows`](../../interface/application.js#L10394) | 10394 |
| [`closeUserWorkspace`](../../interface/application.js#L10418) | 10418 |
| [`loadCentralUsers`](../../interface/application.js#L10447) | 10447 |
| [`changeCentralUser`](../../interface/application.js#L10453) | 10453 |
| [`importPanel`](../../interface/application.js#L10464) | 10464 |
| [`cancelImport`](../../interface/application.js#L10468) | 10468 |
| [`nextImportModalClosed`](../../interface/application.js#L10474) | 10474 |
| [`showImportReview`](../../interface/application.js#L10475) | 10475 |
| [`chooseImportFile`](../../interface/application.js#L10515) | 10515 |
| [`actOnImport`](../../interface/application.js#L10532) | 10532 |

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
| [`hash_password`](../../backend/accounts.py#L15) | 15 |
| [`verify_password`](../../backend/accounts.py#L23) | 23 |
| [`bootstrap_first_admin`](../../backend/accounts.py#L42) | 42 |
| [`confirm_admin_mfa`](../../backend/accounts.py#L66) | 66 |

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

## backend/device_catalogue.py

| Function | Line |
| --- | ---: |
| [`change_device_catalogue`](../../backend/device_catalogue.py#L15) | 15 |

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

## backend/inventory_projection.py

| Function | Line |
| --- | ---: |
| [`project_inventory_response`](../../backend/inventory_projection.py#L8) | 8 |
| [`count_basic_ips_outside_subnets`](../../backend/inventory_projection.py#L39) | 39 |

## backend/device_addresses.py

| Function | Line |
| --- | ---: |
| [`is_basic_address`](../../backend/device_addresses.py#L6) | 6 |
| [`prepare_device_address`](../../backend/device_addresses.py#L10) | 10 |
| [`basic_address_errors`](../../backend/device_addresses.py#L37) | 37 |

## backend/ipam_linking.py

| Function | Line |
| --- | ---: |
| [`unique_link_fields`](../../backend/ipam_linking.py#L16) | 16 |
| [`link_device_to_ipam`](../../backend/ipam_linking.py#L26) | 26 |

## backend/device_rack_fields.py

| Function | Line |
| --- | ---: |
| [`prepare_device_rack_fields`](../../backend/device_rack_fields.py#L8) | 8 |

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
| [`_admin`](../../backend/permissions.py#L11) | 11 |
| [`_target`](../../backend/permissions.py#L20) | 20 |
| [`create_user`](../../backend/permissions.py#L29) | 29 |
| [`set_permission`](../../backend/permissions.py#L62) | 62 |
| [`can_access`](../../backend/permissions.py#L73) | 73 |
| [`feature_enabled`](../../backend/permissions.py#L78) | 78 |
| [`set_account_active`](../../backend/permissions.py#L88) | 88 |
| [`delete_user`](../../backend/permissions.py#L127) | 127 |
| [`set_administrator`](../../backend/permissions.py#L155) | 155 |
| [`can_replace_inventory`](../../backend/permissions.py#L196) | 196 |

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
| [`migrate_role_permissions`](../../backend/schema.py#L219) | 219 |
| [`verify_role_migration`](../../backend/schema.py#L304) | 304 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L330) | 330 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L83) | 83 |
| [`connect`](../../backend/server.py#L101) | 101 |
| [`initialise_database`](../../backend/server.py#L109) | 109 |
| [`Handler.end_headers`](../../backend/server.py#L115) | 115 |
| [`Handler.do_GET`](../../backend/server.py#L122) | 122 |
| [`Handler.do_POST`](../../backend/server.py#L462) | 462 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L636) | 636 |
| [`Handler.handle_role_change`](../../backend/server.py#L679) | 679 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L721) | 721 |
| [`Handler.handle_account_email`](../../backend/server.py#L1113) | 1113 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1193) | 1193 |
| [`Handler.handle_import`](../../backend/server.py#L1224) | 1224 |
| [`Handler.respond`](../../backend/server.py#L1300) | 1300 |
| [`main`](../../backend/server.py#L1313) | 1313 |

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
