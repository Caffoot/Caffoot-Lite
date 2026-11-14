# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the four application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 806.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`renderInterfaceTemplate`](../../interface/loader.js#L5) | 5 |
| [`loadInterfaceText`](../../interface/loader.js#L13) | 13 |
| [`initialiseInterface`](../../interface/loader.js#L18) | 18 |
| [`script.onerror`](../../interface/loader.js#L47) | 47 |
| [`showInterfaceLoadError`](../../interface/loader.js#L52) | 52 |

| [`staffScript.onerror`](../../interface/loader.js#L43) | 43 |
| [`staffScript.onload`](../../interface/loader.js#L44) | 44 |

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
| [`showToast`](../../interface/application.js#L1058) | 1058 |
| [`toggleSidebar`](../../interface/application.js#L1142) | 1142 |
| [`switchTab`](../../interface/application.js#L1161) | 1161 |
| [`escapeHtml`](../../interface/application.js#L1190) | 1190 |
| [`inlineJsArg`](../../interface/application.js#L1199) | 1199 |
| [`browserStorageWarning`](../../interface/application.js#L1207) | 1207 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1210) | 1210 |
| [`renderSectionTabIcon`](../../interface/application.js#L1216) | 1216 |
| [`renderSectionHeader`](../../interface/application.js#L1222) | 1222 |
| [`tab`](../../interface/application.js#L1223) | 1223 |
| [`revealSectionTab`](../../interface/application.js#L1250) | 1250 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1257) | 1257 |
| [`renderContent`](../../interface/application.js#L1273) | 1273 |
| [`updateScrollHint`](../../interface/application.js#L1313) | 1313 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1324) | 1324 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1359) | 1359 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1363) | 1363 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1367) | 1367 |
| [`buildInventoryReportData`](../../interface/application.js#L1373) | 1373 |
| [`occupancy`](../../interface/application.js#L1389) | 1389 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1412) | 1412 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1418) | 1418 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1444) | 1444 |
| [`renderDashboardHTML`](../../interface/application.js#L1463) | 1463 |
| [`statusPill`](../../interface/application.js#L1569) | 1569 |
| [`insightSegment`](../../interface/application.js#L1586) | 1586 |
| [`getCategoryIcon`](../../interface/application.js#L1644) | 1644 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1659) | 1659 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1668) | 1668 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1673) | 1673 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1688) | 1688 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1703) | 1703 |
| [`printRackElevation`](../../interface/application.js#L1713) | 1713 |
| [`safe`](../../interface/application.js#L1716) | 1716 |
| [`printRackElevationInFrame`](../../interface/application.js#L1747) | 1747 |
| [`frame.onload`](../../interface/application.js#L1757) | 1757 |
| [`renderRackHubV13`](../../interface/application.js#L1778) | 1778 |
| [`card`](../../interface/application.js#L1783) | 1783 |
| [`mark`](../../interface/application.js#L1792) | 1792 |
| [`bar`](../../interface/application.js#L1808) | 1808 |
| [`chartBox`](../../interface/application.js#L1809) | 1809 |
| [`chartRows`](../../interface/application.js#L1810) | 1810 |
| [`rackSpaceGuide`](../../interface/application.js#L1812) | 1812 |
| [`renderRacksHTML`](../../interface/application.js#L1881) | 1881 |
| [`changeRack`](../../interface/application.js#L1948) | 1948 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1967) | 1967 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1974) | 1974 |
| [`getVisibleDevices`](../../interface/application.js#L1980) | 1980 |
| [`filterHardwareModels`](../../interface/application.js#L2005) | 2005 |
| [`openCatalogueModal`](../../interface/application.js#L2044) | 2044 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2053) | 2053 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2077) | 2077 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2115) | 2115 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2127) | 2127 |
| [`renderCatalogueButton`](../../interface/application.js#L2144) | 2144 |
| [`renderCatalogueRecord`](../../interface/application.js#L2148) | 2148 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2153) | 2153 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2172) | 2172 |
| [`add`](../../interface/application.js#L2174) | 2174 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2219) | 2219 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2226) | 2226 |
| [`openHardwareModelManager`](../../interface/application.js#L2238) | 2238 |
| [`opts`](../../interface/application.js#L2243) | 2243 |
| [`saveHardwareModel`](../../interface/application.js#L2261) | 2261 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2290) | 2290 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2304) | 2304 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2326) | 2326 |
| [`add`](../../interface/application.js#L2328) | 2328 |
| [`options`](../../interface/application.js#L2364) | 2364 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2378) | 2378 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2393) | 2393 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2408) | 2408 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2416) | 2416 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2427) | 2427 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2436) | 2436 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2458) | 2458 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2469) | 2469 |
| [`openServerServiceEditor`](../../interface/application.js#L2486) | 2486 |
| [`saveServerServiceEntry`](../../interface/application.js#L2495) | 2495 |
| [`restoreArchivedServerService`](../../interface/application.js#L2508) | 2508 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2517) | 2517 |
| [`renderDevicesHTML`](../../interface/application.js#L2529) | 2529 |
| [`renderHardwareMetric`](../../interface/application.js#L2537) | 2537 |
| [`renderHardwareChart`](../../interface/application.js#L2542) | 2542 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2552) | 2552 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2571) | 2571 |
| [`renderArchivedSoftware`](../../interface/application.js#L2579) | 2579 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2614) | 2614 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2621) | 2621 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2622) | 2622 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2623) | 2623 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2626) | 2626 |
| [`openManageTypesModal`](../../interface/application.js#L2642) | 2642 |
| [`openManageLocationsModal`](../../interface/application.js#L2643) | 2643 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2646) | 2646 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2668) | 2668 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2675) | 2675 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2683) | 2683 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2703) | 2703 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2704) | 2704 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2705) | 2705 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2720) | 2720 |
| [`deleteDeviceType`](../../interface/application.js#L2740) | 2740 |
| [`deleteDeviceLocation`](../../interface/application.js#L2741) | 2741 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2749) | 2749 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2753) | 2753 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2780) | 2780 |
| [`nodes`](../../interface/application.js#L2790) | 2790 |
| [`renderIpamManage`](../../interface/application.js#L2816) | 2816 |
| [`renderIpamHTML`](../../interface/application.js#L2867) | 2867 |
| [`changeSubnet`](../../interface/application.js#L3028) | 3028 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3041) | 3041 |
| [`openIpamModal`](../../interface/application.js#L3067) | 3067 |
| [`openBulkIpModal`](../../interface/application.js#L3072) | 3072 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3079) | 3079 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3083) | 3083 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3102) | 3102 |
| [`applyBulkIpChanges`](../../interface/application.js#L3118) | 3118 |
| [`subnetCidrFeedback`](../../interface/application.js#L3132) | 3132 |
| [`suggestSubnetGateway`](../../interface/application.js#L3150) | 3150 |
| [`openSubnetModal`](../../interface/application.js#L3178) | 3178 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3182) | 3182 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3208) | 3208 |
| [`handleSubnetSubmit`](../../interface/application.js#L3228) | 3228 |
| [`showSubnetFormError`](../../interface/application.js#L3435) | 3435 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3451) | 3451 |
| [`subnetNameConflicts`](../../interface/application.js#L3465) | 3465 |
| [`subnetHasVlan`](../../interface/application.js#L3472) | 3472 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3475) | 3475 |
| [`openMultipleSubnets`](../../interface/application.js#L3483) | 3483 |
| [`option`](../../interface/application.js#L3485) | 3485 |
| [`visibility`](../../interface/application.js#L3490) | 3490 |
| [`planningVisibility`](../../interface/application.js#L3494) | 3494 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3512) | 3512 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3524) | 3524 |
| [`read`](../../interface/application.js#L3526) | 3526 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3544) | 3544 |
| [`reject`](../../interface/application.js#L3546) | 3546 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3583) | 3583 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3587) | 3587 |
| [`add`](../../interface/application.js#L3590) | 3590 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3617) | 3617 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3625) | 3625 |
| [`field`](../../interface/application.js#L3628) | 3628 |
| [`capture`](../../interface/application.js#L3638) | 3638 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3672) | 3672 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3676) | 3676 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3682) | 3682 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3703) | 3703 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3707) | 3707 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3711) | 3711 |
| [`deleteSubnet`](../../interface/application.js#L3722) | 3722 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3782) | 3782 |
| [`deleteSubnetCommit`](../../interface/application.js#L3810) | 3810 |
| [`deleteVlan`](../../interface/application.js#L3840) | 3840 |
| [`openIpModal`](../../interface/application.js#L3866) | 3866 |
| [`handleIpSubmit`](../../interface/application.js#L3883) | 3883 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3949) | 3949 |
| [`modalFormSnapshot`](../../interface/application.js#L3959) | 3959 |
| [`rememberModalForm`](../../interface/application.js#L3964) | 3964 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3969) | 3969 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3988) | 3988 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4007) | 4007 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4016) | 4016 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4022) | 4022 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4028) | 4028 |
| [`closeModal`](../../interface/application.js#L4037) | 4037 |
| [`openModal`](../../interface/application.js#L4064) | 4064 |
| [`readRackDimension`](../../interface/application.js#L4137) | 4137 |
| [`formatRackDimension`](../../interface/application.js#L4144) | 4144 |
| [`rackPhysicalDetails`](../../interface/application.js#L4149) | 4149 |
| [`openRackModal`](../../interface/application.js#L4158) | 4158 |
| [`handleRackSubmit`](../../interface/application.js#L4174) | 4174 |
| [`deleteRack`](../../interface/application.js#L4241) | 4241 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4263) | 4263 |
| [`refresh`](../../interface/application.js#L4286) | 4286 |
| [`openAssignDeviceModal`](../../interface/application.js#L4363) | 4363 |
| [`refresh`](../../interface/application.js#L4380) | 4380 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4387) | 4387 |
| [`handleAssignSubmit`](../../interface/application.js#L4421) | 4421 |
| [`unassignDevice`](../../interface/application.js#L4466) | 4466 |
| [`getSubnetForIp`](../../interface/application.js#L4483) | 4483 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4487) | 4487 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4534) | 4534 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4543) | 4543 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4552) | 4552 |
| [`inside`](../../interface/application.js#L4559) | 4559 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4577) | 4577 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4586) | 4586 |
| [`toggleDeviceMountType`](../../interface/application.js#L4630) | 4630 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4654) | 4654 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4659) | 4659 |
| [`openDeviceReviewModal`](../../interface/application.js#L4677) | 4677 |
| [`openDeviceDetailView`](../../interface/application.js#L4682) | 4682 |
| [`safe`](../../interface/application.js#L4692) | 4692 |
| [`field`](../../interface/application.js#L4693) | 4693 |
| [`section`](../../interface/application.js#L4694) | 4694 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4739) | 4739 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4745) | 4745 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4764) | 4764 |
| [`navigateToDeviceRack`](../../interface/application.js#L4780) | 4780 |
| [`duplicateDevice`](../../interface/application.js#L4808) | 4808 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4878) | 4878 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4883) | 4883 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4888) | 4888 |
| [`openServerServiceManager`](../../interface/application.js#L4889) | 4889 |
| [`captureServerServiceSelections`](../../interface/application.js#L4894) | 4894 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4900) | 4900 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4921) | 4921 |
| [`archiveServerService`](../../interface/application.js#L4929) | 4929 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4953) | 4953 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4957) | 4957 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4975) | 4975 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4979) | 4979 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4982) | 4982 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4989) | 4989 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5017) | 5017 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5021) | 5021 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5066) | 5066 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5100) | 5100 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5117) | 5117 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5120) | 5120 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5121) | 5121 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5126) | 5126 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5132) | 5132 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5169) | 5169 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5170) | 5170 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5177) | 5177 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5178) | 5178 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5193) | 5193 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5199) | 5199 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5222) | 5222 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5238) | 5238 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5241) | 5241 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5250) | 5250 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5261) | 5261 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5270) | 5270 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5273) | 5273 |
| [`isSoftwareDetailField`](../../interface/application.js#L5280) | 5280 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5288) | 5288 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5297) | 5297 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5303) | 5303 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5315) | 5315 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5355) | 5355 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5383) | 5383 |
| [`updateInlinePickerCount`](../../interface/application.js#L5392) | 5392 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5398) | 5398 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5411) | 5411 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5420) | 5420 |
| [`fail`](../../interface/application.js#L5426) | 5426 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5480) | 5480 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5496) | 5496 |
| [`fail`](../../interface/application.js#L5501) | 5501 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5548) | 5548 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5578) | 5578 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5584) | 5584 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5950) | 5950 |
| [`isWindowsPlatform`](../../interface/application.js#L5953) | 5953 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5957) | 5957 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5960) | 5960 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5964) | 5964 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5981) | 5981 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5985) | 5985 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6005) | 6005 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6032) | 6032 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6081) | 6081 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6089) | 6089 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6100) | 6100 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6104) | 6104 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6116) | 6116 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6127) | 6127 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6154) | 6154 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6158) | 6158 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6162) | 6162 |
| [`getDefaultMountType`](../../interface/application.js#L6175) | 6175 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6178) | 6178 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6183) | 6183 |
| [`initialiseNotesEditor`](../../interface/application.js#L6200) | 6200 |
| [`inlineMarkdown`](../../interface/application.js#L6205) | 6205 |
| [`render`](../../interface/application.js#L6218) | 6218 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6252) | 6252 |
| [`activate`](../../interface/application.js#L6646) | 6646 |
| [`openDeviceModal`](../../interface/application.js#L6727) | 6727 |
| [`syncVmPurpose`](../../interface/application.js#L6775) | 6775 |
| [`clearFieldError`](../../interface/application.js#L6836) | 6836 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6855) | 6855 |
| [`createRackFromDevice`](../../interface/application.js#L6890) | 6890 |
| [`cancelRackFromDevice`](../../interface/application.js#L6898) | 6898 |
| [`createSubnetFromDevice`](../../interface/application.js#L6908) | 6908 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6921) | 6921 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6935) | 6935 |
| [`addCustomLocationOption`](../../interface/application.js#L6947) | 6947 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6987) | 6987 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6999) | 6999 |
| [`finish`](../../interface/application.js#L7019) | 7019 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7044) | 7044 |
| [`finish`](../../interface/application.js#L7058) | 7058 |
| [`handleDeviceSubmit`](../../interface/application.js#L7078) | 7078 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7118) | 7118 |
| [`deleteDevice`](../../interface/application.js#L7267) | 7267 |
| [`personalSafeStorageGet`](../../interface/application.js#L7324) | 7324 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7329) | 7329 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7339) | 7339 |
| [`button`](../../interface/application.js#L7340) | 7340 |
| [`themeChoice`](../../interface/application.js#L7344) | 7344 |
| [`guideLinks`](../../interface/application.js#L7361) | 7361 |
| [`loadSmtpSettings`](../../interface/application.js#L7392) | 7392 |
| [`renderApplicationSettings`](../../interface/application.js#L7407) | 7407 |
| [`syncSmtpForm`](../../interface/application.js#L7411) | 7411 |
| [`updateSmtpFields`](../../interface/application.js#L7433) | 7433 |
| [`hydrateSettings`](../../interface/application.js#L7446) | 7446 |
| [`caffootCompareVersions`](../../interface/application.js#L7468) | 7468 |
| [`parse`](../../interface/application.js#L7469) | 7469 |
| [`caffootShowLicences`](../../interface/application.js#L7491) | 7491 |
| [`caffootUpdateGuide`](../../interface/application.js#L7496) | 7496 |
| [`caffootCheckUpdates`](../../interface/application.js#L7501) | 7501 |
| [`checkInventorySafety`](../../interface/application.js#L7532) | 7532 |
| [`requestInventoryReset`](../../interface/application.js#L7555) | 7555 |
| [`createInventoryBackup`](../../interface/application.js#L7582) | 7582 |
| [`validateBackupVersion`](../../interface/application.js#L7594) | 7594 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7609) | 7609 |
| [`exportData`](../../interface/application.js#L7617) | 7617 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7630) | 7630 |
| [`validateBackupStructure`](../../interface/application.js#L7645) | 7645 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7662) | 7662 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7674) | 7674 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7713) | 7713 |
| [`findRackImportConflicts`](../../interface/application.js#L7717) | 7717 |
| [`place`](../../interface/application.js#L7723) | 7723 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7769) | 7769 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7790) | 7790 |
| [`showBackupImportError`](../../interface/application.js#L7795) | 7795 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7799) | 7799 |
| [`finish`](../../interface/application.js#L7809) | 7809 |
| [`onClick`](../../interface/application.js#L7818) | 7818 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7828) | 7828 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7839) | 7839 |
| [`finish`](../../interface/application.js#L7850) | 7850 |
| [`onClick`](../../interface/application.js#L7859) | 7859 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7874) | 7874 |
| [`importData`](../../interface/application.js#L7890) | 7890 |
| [`reader.onload`](../../interface/application.js#L7900) | 7900 |
| [`reader.onerror`](../../interface/application.js#L7974) | 7974 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8101) | 8101 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8117) | 8117 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8128) | 8128 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8162) | 8162 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8220) | 8220 |
| [`cancel`](../../interface/application.js#L8233) | 8233 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8249) | 8249 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8266) | 8266 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8291) | 8291 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8305) | 8305 |
| [`clearRackDropPreview`](../../interface/application.js#L8308) | 8308 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8313) | 8313 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8325) | 8325 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8331) | 8331 |
| [`trackRackDrag`](../../interface/application.js#L8340) | 8340 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8371) | 8371 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8381) | 8381 |
| [`getRackDropPosition`](../../interface/application.js#L8474) | 8474 |
| [`window.onload`](../../interface/application.js#L8929) | 8929 |
| [`refreshCentralInventory`](../../interface/application.js#L8953) | 8953 |
| [`postInventory`](../../interface/application.js#L8977) | 8977 |
| [`isBlockedAction`](../../interface/application.js#L9029) | 9029 |
| [`applyAllowedControls`](../../interface/application.js#L9062) | 9062 |
| [`enhanceLongSelects`](../../interface/application.js#L9129) | 9129 |
| [`sync`](../../interface/application.js#L9180) | 9180 |
| [`close`](../../interface/application.js#L9186) | 9186 |
| [`choose`](../../interface/application.js#L9190) | 9190 |
| [`draw`](../../interface/application.js#L9195) | 9195 |
| [`open`](../../interface/application.js#L9213) | 9213 |
| [`enhanceSelects`](../../interface/application.js#L9270) | 9270 |
| [`switchTab`](../../interface/application.js#L9326) | 9326 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9337) | 9337 |
| [`openDeviceDetailView`](../../interface/application.js#L9363) | 9363 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9371) | 9371 |
| [`forbidRackMount`](../../interface/application.js#L9430) | 9430 |
| [`openDeviceModal`](../../interface/application.js#L9440) | 9440 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9478) | 9478 |
| [`relatedChanges`](../../interface/application.js#L9484) | 9484 |
| [`saveDevice`](../../interface/application.js#L9495) | 9495 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9531) | 9531 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9532) | 9532 |
| [`nextIpamBridge.save`](../../interface/application.js#L9554) | 9554 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9576) | 9576 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9598) | 9598 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9640) | 9640 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9684) | 9684 |
| [`openDeviceIpamLink`](../../interface/application.js#L9688) | 9688 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9696) | 9696 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9737) | 9737 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9754) | 9754 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9755) | 9755 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9756) | 9756 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9770) | 9770 |
| [`nextResetBridge.reset`](../../interface/application.js#L9801) | 9801 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9828) | 9828 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9855) | 9855 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9863) | 9863 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9872) | 9872 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9873) | 9873 |
| [`nextRackBridge.save`](../../interface/application.js#L9908) | 9908 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9911) | 9911 |
| [`nextRackBridge.persist`](../../interface/application.js#L9914) | 9914 |
| [`reserveForDelete`](../../interface/application.js#L9936) | 9936 |
| [`removeDevice`](../../interface/application.js#L9944) | 9944 |
| [`cancelDelete`](../../interface/application.js#L9970) | 9970 |
| [`saveArchivedInstallation`](../../interface/application.js#L9976) | 9976 |
| [`renderAccountSections`](../../interface/application.js#L10013) | 10013 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10041) | 10041 |
| [`nextRenderAccount`](../../interface/application.js#L10052) | 10052 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10062) | 10062 |
| [`closeEmailVerification`](../../interface/application.js#L10086) | 10086 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10093) | 10093 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10104) | 10104 |
| [`hydrateAccount`](../../interface/application.js#L10158) | 10158 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10196) | 10196 |
| [`loadAccountProfile`](../../interface/application.js#L10209) | 10209 |
| [`removeAccountPhoto`](../../interface/application.js#L10225) | 10225 |
| [`permissionLabel`](../../interface/application.js#L10237) | 10237 |
| [`accountMfaLabel`](../../interface/application.js#L10240) | 10240 |
| [`renderRoleMemberships`](../../interface/application.js#L10243) | 10243 |
| [`renderRoleCatalogue`](../../interface/application.js#L10249) | 10249 |
| [`openRoleLayer`](../../interface/application.js#L10254) | 10254 |
| [`closeRoleLayer`](../../interface/application.js#L10265) | 10265 |
| [`renderRoleDefinition`](../../interface/application.js#L10271) | 10271 |
| [`renderRoleImpact`](../../interface/application.js#L10275) | 10275 |
| [`access`](../../interface/application.js#L10280) | 10280 |
| [`state`](../../interface/application.js#L10284) | 10284 |
| [`requestRoleChange`](../../interface/application.js#L10289) | 10289 |
| [`roleNotificationMessage`](../../interface/application.js#L10296) | 10296 |
| [`previewRoleAction`](../../interface/application.js#L10300) | 10300 |
| [`openRoleEditor`](../../interface/application.js#L10305) | 10305 |
| [`nextRenderUsers`](../../interface/application.js#L10368) | 10368 |
| [`profileFields`](../../interface/application.js#L10370) | 10370 |
| [`stat`](../../interface/application.js#L10391) | 10391 |
| [`bars`](../../interface/application.js#L10394) | 10394 |
| [`operation`](../../interface/application.js#L10450) | 10450 |
| [`filterUserRows`](../../interface/application.js#L10470) | 10470 |
| [`closeUserWorkspace`](../../interface/application.js#L10494) | 10494 |
| [`loadCentralUsers`](../../interface/application.js#L10523) | 10523 |
| [`changeCentralUser`](../../interface/application.js#L10529) | 10529 |
| [`importPanel`](../../interface/application.js#L10540) | 10540 |
| [`cancelImport`](../../interface/application.js#L10544) | 10544 |
| [`nextImportModalClosed`](../../interface/application.js#L10550) | 10550 |
| [`showImportReview`](../../interface/application.js#L10551) | 10551 |
| [`chooseImportFile`](../../interface/application.js#L10591) | 10591 |
| [`actOnImport`](../../interface/application.js#L10608) | 10608 |
| [`showNotification`](../../interface/application.js#L1044) | 1044 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1627) | 1627 |

| [`inventorySectionAccess`](../../interface/application.js#L8946) | 8946 |
| [`addDirectoryAccess`](../../interface/application.js#L8947) | 8947 |

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
| [`migrate_staff_directory`](../../backend/schema.py#L222) | 222 |
| [`migrate_role_permissions`](../../backend/schema.py#L287) | 287 |
| [`verify_role_migration`](../../backend/schema.py#L372) | 372 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L398) | 398 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L87) | 87 |
| [`connect`](../../backend/server.py#L105) | 105 |
| [`initialise_database`](../../backend/server.py#L113) | 113 |
| [`Handler.end_headers`](../../backend/server.py#L119) | 119 |
| [`Handler.do_GET`](../../backend/server.py#L126) | 126 |
| [`Handler.do_POST`](../../backend/server.py#L479) | 479 |
| [`Handler.handle_directory_request`](../../backend/server.py#L656) | 656 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L731) | 731 |
| [`Handler.handle_role_change`](../../backend/server.py#L774) | 774 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L816) | 816 |
| [`Handler.handle_account_email`](../../backend/server.py#L1208) | 1208 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1288) | 1288 |
| [`Handler.handle_import`](../../backend/server.py#L1319) | 1319 |
| [`Handler.respond`](../../backend/server.py#L1395) | 1395 |
| [`main`](../../backend/server.py#L1408) | 1408 |

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
## backend/staff_directory.py

| Function | Line |
| --- | ---: |
| [`unique_directory_fields`](../../backend/staff_directory.py#L14) | 14 |
| [`require_directory_access`](../../backend/staff_directory.py#L24) | 24 |
| [`_text`](../../backend/staff_directory.py#L30) | 30 |
| [`_staff_record`](../../backend/staff_directory.py#L37) | 37 |
| [`_department_record`](../../backend/staff_directory.py#L44) | 44 |
| [`read_staff_member`](../../backend/staff_directory.py#L51) | 51 |
| [`read_department`](../../backend/staff_directory.py#L75) | 75 |
| [`list_directory`](../../backend/staff_directory.py#L82) | 82 |
| [`_validate_staff`](../../backend/staff_directory.py#L109) | 109 |
| [`_create_login`](../../backend/staff_directory.py#L126) | 126 |
| [`save_staff_member`](../../backend/staff_directory.py#L141) | 141 |
| [`save_department`](../../backend/staff_directory.py#L185) | 185 |

| [`department_has_associations`](../../backend/staff_directory.py#L62) | 62 |
| [`list_staff_department_choices`](../../backend/staff_directory.py#L96) | 96 |

## backend/staff_identity.py

| Function | Line |
| --- | ---: |
| [`link_account_staff`](../../backend/staff_identity.py#L4) | 4 |


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
