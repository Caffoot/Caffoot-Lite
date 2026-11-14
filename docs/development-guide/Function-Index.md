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
| [`renderContent`](../../interface/application.js#L1274) | 1274 |
| [`updateScrollHint`](../../interface/application.js#L1316) | 1316 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1327) | 1327 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1362) | 1362 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1366) | 1366 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1370) | 1370 |
| [`buildInventoryReportData`](../../interface/application.js#L1376) | 1376 |
| [`occupancy`](../../interface/application.js#L1392) | 1392 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1415) | 1415 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1421) | 1421 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1447) | 1447 |
| [`renderDashboardHTML`](../../interface/application.js#L1466) | 1466 |
| [`statusPill`](../../interface/application.js#L1572) | 1572 |
| [`insightSegment`](../../interface/application.js#L1589) | 1589 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1630) | 1630 |
| [`getCategoryIcon`](../../interface/application.js#L1647) | 1647 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1662) | 1662 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1671) | 1671 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1676) | 1676 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1691) | 1691 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1706) | 1706 |
| [`printRackElevation`](../../interface/application.js#L1716) | 1716 |
| [`safe`](../../interface/application.js#L1719) | 1719 |
| [`printRackElevationInFrame`](../../interface/application.js#L1750) | 1750 |
| [`frame.onload`](../../interface/application.js#L1760) | 1760 |
| [`renderRackHubV13`](../../interface/application.js#L1781) | 1781 |
| [`card`](../../interface/application.js#L1786) | 1786 |
| [`mark`](../../interface/application.js#L1795) | 1795 |
| [`bar`](../../interface/application.js#L1811) | 1811 |
| [`chartBox`](../../interface/application.js#L1812) | 1812 |
| [`chartRows`](../../interface/application.js#L1813) | 1813 |
| [`rackSpaceGuide`](../../interface/application.js#L1815) | 1815 |
| [`renderRacksHTML`](../../interface/application.js#L1884) | 1884 |
| [`changeRack`](../../interface/application.js#L1951) | 1951 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1970) | 1970 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1977) | 1977 |
| [`getVisibleDevices`](../../interface/application.js#L1983) | 1983 |
| [`filterHardwareModels`](../../interface/application.js#L2008) | 2008 |
| [`openCatalogueModal`](../../interface/application.js#L2047) | 2047 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2056) | 2056 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2080) | 2080 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2118) | 2118 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2130) | 2130 |
| [`renderCatalogueButton`](../../interface/application.js#L2147) | 2147 |
| [`renderCatalogueRecord`](../../interface/application.js#L2151) | 2151 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2156) | 2156 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2175) | 2175 |
| [`add`](../../interface/application.js#L2177) | 2177 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2222) | 2222 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2229) | 2229 |
| [`openHardwareModelManager`](../../interface/application.js#L2241) | 2241 |
| [`opts`](../../interface/application.js#L2246) | 2246 |
| [`saveHardwareModel`](../../interface/application.js#L2264) | 2264 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2293) | 2293 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2307) | 2307 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2329) | 2329 |
| [`add`](../../interface/application.js#L2331) | 2331 |
| [`options`](../../interface/application.js#L2367) | 2367 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2381) | 2381 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2396) | 2396 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2411) | 2411 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2419) | 2419 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2430) | 2430 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2439) | 2439 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2461) | 2461 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2472) | 2472 |
| [`openServerServiceEditor`](../../interface/application.js#L2489) | 2489 |
| [`saveServerServiceEntry`](../../interface/application.js#L2498) | 2498 |
| [`restoreArchivedServerService`](../../interface/application.js#L2511) | 2511 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2520) | 2520 |
| [`renderDevicesHTML`](../../interface/application.js#L2532) | 2532 |
| [`renderHardwareMetric`](../../interface/application.js#L2540) | 2540 |
| [`renderHardwareChart`](../../interface/application.js#L2545) | 2545 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2555) | 2555 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2574) | 2574 |
| [`renderArchivedSoftware`](../../interface/application.js#L2582) | 2582 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2617) | 2617 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2624) | 2624 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2625) | 2625 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2626) | 2626 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2629) | 2629 |
| [`openManageTypesModal`](../../interface/application.js#L2645) | 2645 |
| [`openManageLocationsModal`](../../interface/application.js#L2646) | 2646 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2649) | 2649 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2671) | 2671 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2678) | 2678 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2686) | 2686 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2706) | 2706 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2707) | 2707 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2708) | 2708 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2723) | 2723 |
| [`deleteDeviceType`](../../interface/application.js#L2743) | 2743 |
| [`deleteDeviceLocation`](../../interface/application.js#L2744) | 2744 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2752) | 2752 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2756) | 2756 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2783) | 2783 |
| [`nodes`](../../interface/application.js#L2793) | 2793 |
| [`renderIpamManage`](../../interface/application.js#L2819) | 2819 |
| [`renderIpamHTML`](../../interface/application.js#L2870) | 2870 |
| [`changeSubnet`](../../interface/application.js#L3031) | 3031 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3044) | 3044 |
| [`openIpamModal`](../../interface/application.js#L3070) | 3070 |
| [`openBulkIpModal`](../../interface/application.js#L3075) | 3075 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3082) | 3082 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3086) | 3086 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3105) | 3105 |
| [`applyBulkIpChanges`](../../interface/application.js#L3121) | 3121 |
| [`subnetCidrFeedback`](../../interface/application.js#L3135) | 3135 |
| [`suggestSubnetGateway`](../../interface/application.js#L3153) | 3153 |
| [`openSubnetModal`](../../interface/application.js#L3181) | 3181 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3185) | 3185 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3211) | 3211 |
| [`handleSubnetSubmit`](../../interface/application.js#L3231) | 3231 |
| [`showSubnetFormError`](../../interface/application.js#L3438) | 3438 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3454) | 3454 |
| [`subnetNameConflicts`](../../interface/application.js#L3468) | 3468 |
| [`subnetHasVlan`](../../interface/application.js#L3475) | 3475 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3478) | 3478 |
| [`openMultipleSubnets`](../../interface/application.js#L3486) | 3486 |
| [`option`](../../interface/application.js#L3488) | 3488 |
| [`visibility`](../../interface/application.js#L3493) | 3493 |
| [`planningVisibility`](../../interface/application.js#L3497) | 3497 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3515) | 3515 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3527) | 3527 |
| [`read`](../../interface/application.js#L3529) | 3529 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3547) | 3547 |
| [`reject`](../../interface/application.js#L3549) | 3549 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3586) | 3586 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3590) | 3590 |
| [`add`](../../interface/application.js#L3593) | 3593 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3620) | 3620 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3628) | 3628 |
| [`field`](../../interface/application.js#L3631) | 3631 |
| [`capture`](../../interface/application.js#L3641) | 3641 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3675) | 3675 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3679) | 3679 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3685) | 3685 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3706) | 3706 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3710) | 3710 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3714) | 3714 |
| [`deleteSubnet`](../../interface/application.js#L3725) | 3725 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3785) | 3785 |
| [`deleteSubnetCommit`](../../interface/application.js#L3813) | 3813 |
| [`deleteVlan`](../../interface/application.js#L3843) | 3843 |
| [`openIpModal`](../../interface/application.js#L3869) | 3869 |
| [`handleIpSubmit`](../../interface/application.js#L3886) | 3886 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3952) | 3952 |
| [`modalFormSnapshot`](../../interface/application.js#L3962) | 3962 |
| [`rememberModalForm`](../../interface/application.js#L3967) | 3967 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3972) | 3972 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3991) | 3991 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4010) | 4010 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4019) | 4019 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4025) | 4025 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4031) | 4031 |
| [`closeModal`](../../interface/application.js#L4040) | 4040 |
| [`openModal`](../../interface/application.js#L4067) | 4067 |
| [`readRackDimension`](../../interface/application.js#L4140) | 4140 |
| [`formatRackDimension`](../../interface/application.js#L4147) | 4147 |
| [`rackPhysicalDetails`](../../interface/application.js#L4152) | 4152 |
| [`openRackModal`](../../interface/application.js#L4161) | 4161 |
| [`handleRackSubmit`](../../interface/application.js#L4177) | 4177 |
| [`deleteRack`](../../interface/application.js#L4244) | 4244 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4266) | 4266 |
| [`refresh`](../../interface/application.js#L4289) | 4289 |
| [`openAssignDeviceModal`](../../interface/application.js#L4366) | 4366 |
| [`refresh`](../../interface/application.js#L4383) | 4383 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4390) | 4390 |
| [`handleAssignSubmit`](../../interface/application.js#L4424) | 4424 |
| [`unassignDevice`](../../interface/application.js#L4469) | 4469 |
| [`getSubnetForIp`](../../interface/application.js#L4486) | 4486 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4490) | 4490 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4537) | 4537 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4546) | 4546 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4555) | 4555 |
| [`inside`](../../interface/application.js#L4562) | 4562 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4580) | 4580 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4589) | 4589 |
| [`toggleDeviceMountType`](../../interface/application.js#L4633) | 4633 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4657) | 4657 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4662) | 4662 |
| [`openDeviceReviewModal`](../../interface/application.js#L4680) | 4680 |
| [`openDeviceDetailView`](../../interface/application.js#L4685) | 4685 |
| [`safe`](../../interface/application.js#L4695) | 4695 |
| [`field`](../../interface/application.js#L4696) | 4696 |
| [`section`](../../interface/application.js#L4697) | 4697 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4742) | 4742 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4748) | 4748 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4767) | 4767 |
| [`navigateToDeviceRack`](../../interface/application.js#L4783) | 4783 |
| [`duplicateDevice`](../../interface/application.js#L4811) | 4811 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4881) | 4881 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4886) | 4886 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4891) | 4891 |
| [`openServerServiceManager`](../../interface/application.js#L4892) | 4892 |
| [`captureServerServiceSelections`](../../interface/application.js#L4897) | 4897 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4903) | 4903 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4924) | 4924 |
| [`archiveServerService`](../../interface/application.js#L4932) | 4932 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4956) | 4956 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4960) | 4960 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4978) | 4978 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4982) | 4982 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4985) | 4985 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4992) | 4992 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5020) | 5020 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5024) | 5024 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5069) | 5069 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5103) | 5103 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5120) | 5120 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5123) | 5123 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5124) | 5124 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5129) | 5129 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5135) | 5135 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5172) | 5172 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5173) | 5173 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5180) | 5180 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5181) | 5181 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5196) | 5196 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5202) | 5202 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5225) | 5225 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5241) | 5241 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5244) | 5244 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5253) | 5253 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5264) | 5264 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5273) | 5273 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5276) | 5276 |
| [`isSoftwareDetailField`](../../interface/application.js#L5283) | 5283 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5291) | 5291 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5300) | 5300 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5306) | 5306 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5318) | 5318 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5358) | 5358 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5386) | 5386 |
| [`updateInlinePickerCount`](../../interface/application.js#L5395) | 5395 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5401) | 5401 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5414) | 5414 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5423) | 5423 |
| [`fail`](../../interface/application.js#L5429) | 5429 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5483) | 5483 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5499) | 5499 |
| [`fail`](../../interface/application.js#L5504) | 5504 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5551) | 5551 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5581) | 5581 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5587) | 5587 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5953) | 5953 |
| [`isWindowsPlatform`](../../interface/application.js#L5956) | 5956 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5960) | 5960 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5963) | 5963 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5967) | 5967 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5984) | 5984 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5988) | 5988 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6008) | 6008 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6035) | 6035 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6084) | 6084 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6092) | 6092 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6103) | 6103 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6107) | 6107 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6119) | 6119 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6130) | 6130 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6157) | 6157 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6161) | 6161 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6165) | 6165 |
| [`getDefaultMountType`](../../interface/application.js#L6178) | 6178 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6181) | 6181 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6186) | 6186 |
| [`initialiseNotesEditor`](../../interface/application.js#L6203) | 6203 |
| [`inlineMarkdown`](../../interface/application.js#L6208) | 6208 |
| [`render`](../../interface/application.js#L6221) | 6221 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6255) | 6255 |
| [`activate`](../../interface/application.js#L6649) | 6649 |
| [`openDeviceModal`](../../interface/application.js#L6730) | 6730 |
| [`syncVmPurpose`](../../interface/application.js#L6778) | 6778 |
| [`clearFieldError`](../../interface/application.js#L6839) | 6839 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6858) | 6858 |
| [`createRackFromDevice`](../../interface/application.js#L6893) | 6893 |
| [`cancelRackFromDevice`](../../interface/application.js#L6901) | 6901 |
| [`createSubnetFromDevice`](../../interface/application.js#L6911) | 6911 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6924) | 6924 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6938) | 6938 |
| [`addCustomLocationOption`](../../interface/application.js#L6950) | 6950 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6990) | 6990 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7002) | 7002 |
| [`finish`](../../interface/application.js#L7022) | 7022 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7047) | 7047 |
| [`finish`](../../interface/application.js#L7061) | 7061 |
| [`handleDeviceSubmit`](../../interface/application.js#L7081) | 7081 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7121) | 7121 |
| [`deleteDevice`](../../interface/application.js#L7270) | 7270 |
| [`personalSafeStorageGet`](../../interface/application.js#L7327) | 7327 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7332) | 7332 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7342) | 7342 |
| [`button`](../../interface/application.js#L7343) | 7343 |
| [`themeChoice`](../../interface/application.js#L7347) | 7347 |
| [`guideLinks`](../../interface/application.js#L7364) | 7364 |
| [`loadSmtpSettings`](../../interface/application.js#L7395) | 7395 |
| [`renderApplicationSettings`](../../interface/application.js#L7410) | 7410 |
| [`syncSmtpForm`](../../interface/application.js#L7414) | 7414 |
| [`updateSmtpFields`](../../interface/application.js#L7436) | 7436 |
| [`hydrateSettings`](../../interface/application.js#L7449) | 7449 |
| [`caffootCompareVersions`](../../interface/application.js#L7471) | 7471 |
| [`parse`](../../interface/application.js#L7472) | 7472 |
| [`caffootShowLicences`](../../interface/application.js#L7494) | 7494 |
| [`caffootUpdateGuide`](../../interface/application.js#L7499) | 7499 |
| [`caffootCheckUpdates`](../../interface/application.js#L7504) | 7504 |
| [`checkInventorySafety`](../../interface/application.js#L7535) | 7535 |
| [`requestInventoryReset`](../../interface/application.js#L7558) | 7558 |
| [`createInventoryBackup`](../../interface/application.js#L7585) | 7585 |
| [`validateBackupVersion`](../../interface/application.js#L7597) | 7597 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7612) | 7612 |
| [`exportData`](../../interface/application.js#L7620) | 7620 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7633) | 7633 |
| [`validateBackupStructure`](../../interface/application.js#L7648) | 7648 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7665) | 7665 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7677) | 7677 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7716) | 7716 |
| [`findRackImportConflicts`](../../interface/application.js#L7720) | 7720 |
| [`place`](../../interface/application.js#L7726) | 7726 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7772) | 7772 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7793) | 7793 |
| [`showBackupImportError`](../../interface/application.js#L7798) | 7798 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7802) | 7802 |
| [`finish`](../../interface/application.js#L7812) | 7812 |
| [`onClick`](../../interface/application.js#L7821) | 7821 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7831) | 7831 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7842) | 7842 |
| [`finish`](../../interface/application.js#L7853) | 7853 |
| [`onClick`](../../interface/application.js#L7862) | 7862 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7877) | 7877 |
| [`importData`](../../interface/application.js#L7893) | 7893 |
| [`reader.onload`](../../interface/application.js#L7903) | 7903 |
| [`reader.onerror`](../../interface/application.js#L7977) | 7977 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8104) | 8104 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8120) | 8120 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8131) | 8131 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8165) | 8165 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8223) | 8223 |
| [`cancel`](../../interface/application.js#L8236) | 8236 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8252) | 8252 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8269) | 8269 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8294) | 8294 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8308) | 8308 |
| [`clearRackDropPreview`](../../interface/application.js#L8311) | 8311 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8316) | 8316 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8328) | 8328 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8334) | 8334 |
| [`trackRackDrag`](../../interface/application.js#L8343) | 8343 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8374) | 8374 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8384) | 8384 |
| [`getRackDropPosition`](../../interface/application.js#L8477) | 8477 |
| [`window.onload`](../../interface/application.js#L8933) | 8933 |
| [`inventorySectionAccess`](../../interface/application.js#L8950) | 8950 |
| [`addDirectoryAccess`](../../interface/application.js#L8951) | 8951 |
| [`refreshCentralInventory`](../../interface/application.js#L8957) | 8957 |
| [`postInventory`](../../interface/application.js#L8981) | 8981 |
| [`isBlockedAction`](../../interface/application.js#L9033) | 9033 |
| [`applyAllowedControls`](../../interface/application.js#L9066) | 9066 |
| [`enhanceLongSelects`](../../interface/application.js#L9133) | 9133 |
| [`sync`](../../interface/application.js#L9184) | 9184 |
| [`close`](../../interface/application.js#L9190) | 9190 |
| [`choose`](../../interface/application.js#L9194) | 9194 |
| [`draw`](../../interface/application.js#L9199) | 9199 |
| [`open`](../../interface/application.js#L9217) | 9217 |
| [`enhanceSelects`](../../interface/application.js#L9274) | 9274 |
| [`switchTab`](../../interface/application.js#L9330) | 9330 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9341) | 9341 |
| [`openDeviceDetailView`](../../interface/application.js#L9367) | 9367 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9376) | 9376 |
| [`forbidRackMount`](../../interface/application.js#L9435) | 9435 |
| [`openDeviceModal`](../../interface/application.js#L9445) | 9445 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9483) | 9483 |
| [`relatedChanges`](../../interface/application.js#L9489) | 9489 |
| [`saveDevice`](../../interface/application.js#L9500) | 9500 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9536) | 9536 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9537) | 9537 |
| [`nextIpamBridge.save`](../../interface/application.js#L9559) | 9559 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9581) | 9581 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9603) | 9603 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9645) | 9645 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9689) | 9689 |
| [`openDeviceIpamLink`](../../interface/application.js#L9693) | 9693 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9701) | 9701 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9742) | 9742 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9759) | 9759 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9760) | 9760 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9761) | 9761 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9775) | 9775 |
| [`nextResetBridge.reset`](../../interface/application.js#L9806) | 9806 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9833) | 9833 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9860) | 9860 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9868) | 9868 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9877) | 9877 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9878) | 9878 |
| [`nextRackBridge.save`](../../interface/application.js#L9913) | 9913 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9916) | 9916 |
| [`nextRackBridge.persist`](../../interface/application.js#L9919) | 9919 |
| [`reserveForDelete`](../../interface/application.js#L9941) | 9941 |
| [`removeDevice`](../../interface/application.js#L9949) | 9949 |
| [`cancelDelete`](../../interface/application.js#L9975) | 9975 |
| [`saveArchivedInstallation`](../../interface/application.js#L9981) | 9981 |
| [`renderAccountSections`](../../interface/application.js#L10018) | 10018 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10046) | 10046 |
| [`nextRenderAccount`](../../interface/application.js#L10057) | 10057 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10067) | 10067 |
| [`closeEmailVerification`](../../interface/application.js#L10091) | 10091 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10098) | 10098 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10109) | 10109 |
| [`hydrateAccount`](../../interface/application.js#L10163) | 10163 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10201) | 10201 |
| [`loadAccountProfile`](../../interface/application.js#L10214) | 10214 |
| [`removeAccountPhoto`](../../interface/application.js#L10230) | 10230 |
| [`permissionLabel`](../../interface/application.js#L10242) | 10242 |
| [`accountMfaLabel`](../../interface/application.js#L10245) | 10245 |
| [`renderRoleMemberships`](../../interface/application.js#L10248) | 10248 |
| [`renderRoleCatalogue`](../../interface/application.js#L10254) | 10254 |
| [`openRoleLayer`](../../interface/application.js#L10259) | 10259 |
| [`closeRoleLayer`](../../interface/application.js#L10270) | 10270 |
| [`renderRoleDefinition`](../../interface/application.js#L10276) | 10276 |
| [`renderRoleImpact`](../../interface/application.js#L10280) | 10280 |
| [`access`](../../interface/application.js#L10285) | 10285 |
| [`state`](../../interface/application.js#L10289) | 10289 |
| [`requestRoleChange`](../../interface/application.js#L10294) | 10294 |
| [`roleNotificationMessage`](../../interface/application.js#L10301) | 10301 |
| [`previewRoleAction`](../../interface/application.js#L10305) | 10305 |
| [`openRoleEditor`](../../interface/application.js#L10310) | 10310 |
| [`nextRenderUsers`](../../interface/application.js#L10373) | 10373 |
| [`profileFields`](../../interface/application.js#L10375) | 10375 |
| [`stat`](../../interface/application.js#L10396) | 10396 |
| [`bars`](../../interface/application.js#L10399) | 10399 |
| [`operation`](../../interface/application.js#L10455) | 10455 |
| [`filterUserRows`](../../interface/application.js#L10475) | 10475 |
| [`closeUserWorkspace`](../../interface/application.js#L10499) | 10499 |
| [`loadCentralUsers`](../../interface/application.js#L10528) | 10528 |
| [`changeCentralUser`](../../interface/application.js#L10534) | 10534 |
| [`importPanel`](../../interface/application.js#L10545) | 10545 |
| [`cancelImport`](../../interface/application.js#L10549) | 10549 |
| [`nextImportModalClosed`](../../interface/application.js#L10555) | 10555 |
| [`showImportReview`](../../interface/application.js#L10556) | 10556 |
| [`chooseImportFile`](../../interface/application.js#L10596) | 10596 |
| [`actOnImport`](../../interface/application.js#L10613) | 10613 |

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
| [`staffPlaceholder`](../../interface/equipment.js#L18) | 18 |
| [`loadStaffEquipment`](../../interface/equipment.js#L22) | 22 |
| [`rows`](../../interface/equipment.js#L27) | 27 |
| [`loadDeviceEquipment`](../../interface/equipment.js#L31) | 31 |
| [`renderMyEquipment`](../../interface/equipment.js#L43) | 43 |
| [`loadMyEquipment`](../../interface/equipment.js#L46) | 46 |
| [`list`](../../interface/equipment.js#L49) | 49 |
| [`hydrate`](../../interface/equipment.js#L57) | 57 |
| [`showAssignmentDialog`](../../interface/equipment.js#L61) | 61 |
| [`searchRecipients`](../../interface/equipment.js#L72) | 72 |
| [`searchDevices`](../../interface/equipment.js#L81) | 81 |
| [`leaveAssignmentDialog`](../../interface/equipment.js#L89) | 89 |
| [`saveAssignment`](../../interface/equipment.js#L95) | 95 |
| [`controls`](../../interface/equipment.js#L102) | 102 |
| [`caffootEquipment.configure`](../../interface/equipment.js#L141) | 141 |

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
| [`assign_devices`](../../backend/device_assignments.py#L80) | 80 |
| [`my_equipment`](../../backend/device_assignments.py#L132) | 132 |

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
