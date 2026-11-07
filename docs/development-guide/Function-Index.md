# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 668.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`previewLegacyVlanOwnershipInApp`](../../interface/application.js#L165) | 165 |
| [`reconcileLegacyVlanOwnership`](../../interface/application.js#L179) | 179 |
| [`migrateLegacyRackLocation`](../../interface/application.js#L217) | 217 |
| [`normaliseLegacyRackAccessoryTypes`](../../interface/application.js#L231) | 231 |
| [`normaliseState`](../../interface/application.js#L238) | 238 |
| [`validateApplicationState`](../../interface/application.js#L405) | 405 |
| [`loadStoredState`](../../interface/application.js#L471) | 471 |
| [`showStorageRecoveryBanner`](../../interface/application.js#L477) | 477 |
| [`download.onclick`](../../interface/application.js#L492) | 492 |
| [`reset.onclick`](../../interface/application.js#L501) | 501 |
| [`caffootThemePreference`](../../interface/application.js#L536) | 536 |
| [`caffootApplyTheme`](../../interface/application.js#L543) | 543 |
| [`caffootSetTheme`](../../interface/application.js#L557) | 557 |
| [`onSystemThemeChange`](../../interface/application.js#L568) | 568 |
| [`toggleDarkMode`](../../interface/application.js#L577) | 577 |
| [`readAuditHistory`](../../interface/application.js#L584) | 584 |
| [`auditChanges`](../../interface/application.js#L588) | 588 |
| [`recordAudit`](../../interface/application.js#L625) | 625 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L634) | 634 |
| [`exportAuditHistory`](../../interface/application.js#L646) | 646 |
| [`auditVisibleRows`](../../interface/application.js#L658) | 658 |
| [`auditDate`](../../interface/application.js#L680) | 680 |
| [`renderAuditHTML`](../../interface/application.js#L684) | 684 |
| [`hydrateAudit`](../../interface/application.js#L717) | 717 |
| [`applyAuditFilters`](../../interface/application.js#L725) | 725 |
| [`closeAuditDetail`](../../interface/application.js#L760) | 760 |
| [`showAuditDetail`](../../interface/application.js#L766) | 766 |
| [`nextRenderUsers`](../../interface/application.js#L793) | 793 |
| [`nextRenderAccount`](../../interface/application.js#L795) | 795 |
| [`hydrateAccount`](../../interface/application.js#L796) | 796 |
| [`removeAccountPhoto`](../../interface/application.js#L797) | 797 |
| [`saveState`](../../interface/application.js#L800) | 800 |
| [`getDeviceById`](../../interface/application.js#L803) | 803 |
| [`findDeviceUsingIp`](../../interface/application.js#L807) | 807 |
| [`setDevicePrimaryIp`](../../interface/application.js#L812) | 812 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L865) | 865 |
| [`isRackMountedDevice`](../../interface/application.js#L878) | 878 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L881) | 881 |
| [`getRackShelfLocation`](../../interface/application.js#L893) | 893 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L898) | 898 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L914) | 914 |
| [`openRackShelfCreation`](../../interface/application.js#L932) | 932 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L946) | 946 |
| [`createRackShelfFromDevice`](../../interface/application.js#L956) | 956 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L963) | 963 |
| [`options`](../../interface/application.js#L969) | 969 |
| [`validateRackPlacement`](../../interface/application.js#L990) | 990 |
| [`showToast`](../../interface/application.js#L1025) | 1025 |
| [`toggleSidebar`](../../interface/application.js#L1112) | 1112 |
| [`switchTab`](../../interface/application.js#L1131) | 1131 |
| [`escapeHtml`](../../interface/application.js#L1158) | 1158 |
| [`inlineJsArg`](../../interface/application.js#L1167) | 1167 |
| [`browserStorageWarning`](../../interface/application.js#L1175) | 1175 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1178) | 1178 |
| [`renderSectionTabIcon`](../../interface/application.js#L1184) | 1184 |
| [`renderSectionHeader`](../../interface/application.js#L1190) | 1190 |
| [`tab`](../../interface/application.js#L1191) | 1191 |
| [`revealSectionTab`](../../interface/application.js#L1218) | 1218 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1225) | 1225 |
| [`renderContent`](../../interface/application.js#L1241) | 1241 |
| [`updateScrollHint`](../../interface/application.js#L1277) | 1277 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1288) | 1288 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1323) | 1323 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1327) | 1327 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1331) | 1331 |
| [`buildInventoryReportData`](../../interface/application.js#L1337) | 1337 |
| [`occupancy`](../../interface/application.js#L1353) | 1353 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1376) | 1376 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1382) | 1382 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1408) | 1408 |
| [`renderDashboardHTML`](../../interface/application.js#L1427) | 1427 |
| [`statusPill`](../../interface/application.js#L1530) | 1530 |
| [`insightSegment`](../../interface/application.js#L1547) | 1547 |
| [`getCategoryIcon`](../../interface/application.js#L1588) | 1588 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1603) | 1603 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1612) | 1612 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1617) | 1617 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1632) | 1632 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1647) | 1647 |
| [`printRackElevation`](../../interface/application.js#L1657) | 1657 |
| [`safe`](../../interface/application.js#L1660) | 1660 |
| [`printRackElevationInFrame`](../../interface/application.js#L1691) | 1691 |
| [`frame.onload`](../../interface/application.js#L1701) | 1701 |
| [`renderRackHubV13`](../../interface/application.js#L1722) | 1722 |
| [`card`](../../interface/application.js#L1727) | 1727 |
| [`mark`](../../interface/application.js#L1736) | 1736 |
| [`bar`](../../interface/application.js#L1752) | 1752 |
| [`chartBox`](../../interface/application.js#L1753) | 1753 |
| [`chartRows`](../../interface/application.js#L1754) | 1754 |
| [`rackSpaceGuide`](../../interface/application.js#L1756) | 1756 |
| [`renderRacksHTML`](../../interface/application.js#L1825) | 1825 |
| [`changeRack`](../../interface/application.js#L1892) | 1892 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1911) | 1911 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1918) | 1918 |
| [`getVisibleDevices`](../../interface/application.js#L1924) | 1924 |
| [`filterHardwareModels`](../../interface/application.js#L1949) | 1949 |
| [`openCatalogueModal`](../../interface/application.js#L1988) | 1988 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1997) | 1997 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2021) | 2021 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2059) | 2059 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2071) | 2071 |
| [`renderCatalogueButton`](../../interface/application.js#L2088) | 2088 |
| [`renderCatalogueRecord`](../../interface/application.js#L2092) | 2092 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2097) | 2097 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2116) | 2116 |
| [`add`](../../interface/application.js#L2118) | 2118 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2163) | 2163 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2170) | 2170 |
| [`openHardwareModelManager`](../../interface/application.js#L2182) | 2182 |
| [`opts`](../../interface/application.js#L2187) | 2187 |
| [`saveHardwareModel`](../../interface/application.js#L2205) | 2205 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2234) | 2234 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2248) | 2248 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2270) | 2270 |
| [`add`](../../interface/application.js#L2272) | 2272 |
| [`options`](../../interface/application.js#L2308) | 2308 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2322) | 2322 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2337) | 2337 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2352) | 2352 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2360) | 2360 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2371) | 2371 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2380) | 2380 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2402) | 2402 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2413) | 2413 |
| [`openServerServiceEditor`](../../interface/application.js#L2430) | 2430 |
| [`saveServerServiceEntry`](../../interface/application.js#L2439) | 2439 |
| [`restoreArchivedServerService`](../../interface/application.js#L2452) | 2452 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2461) | 2461 |
| [`renderDevicesHTML`](../../interface/application.js#L2473) | 2473 |
| [`renderHardwareMetric`](../../interface/application.js#L2481) | 2481 |
| [`renderHardwareChart`](../../interface/application.js#L2486) | 2486 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2496) | 2496 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2515) | 2515 |
| [`renderArchivedSoftware`](../../interface/application.js#L2523) | 2523 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2558) | 2558 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2565) | 2565 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2566) | 2566 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2567) | 2567 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2570) | 2570 |
| [`openManageTypesModal`](../../interface/application.js#L2586) | 2586 |
| [`openManageLocationsModal`](../../interface/application.js#L2587) | 2587 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2590) | 2590 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2612) | 2612 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2619) | 2619 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2627) | 2627 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2647) | 2647 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2648) | 2648 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2649) | 2649 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2664) | 2664 |
| [`deleteDeviceType`](../../interface/application.js#L2684) | 2684 |
| [`deleteDeviceLocation`](../../interface/application.js#L2685) | 2685 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2693) | 2693 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2697) | 2697 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2723) | 2723 |
| [`nodes`](../../interface/application.js#L2733) | 2733 |
| [`renderIpamManage`](../../interface/application.js#L2759) | 2759 |
| [`renderIpamHTML`](../../interface/application.js#L2809) | 2809 |
| [`changeSubnet`](../../interface/application.js#L2968) | 2968 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2981) | 2981 |
| [`openIpamModal`](../../interface/application.js#L3007) | 3007 |
| [`openBulkIpModal`](../../interface/application.js#L3012) | 3012 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3019) | 3019 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3023) | 3023 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3042) | 3042 |
| [`applyBulkIpChanges`](../../interface/application.js#L3058) | 3058 |
| [`subnetCidrFeedback`](../../interface/application.js#L3072) | 3072 |
| [`suggestSubnetGateway`](../../interface/application.js#L3090) | 3090 |
| [`openSubnetModal`](../../interface/application.js#L3118) | 3118 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3122) | 3122 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3146) | 3146 |
| [`handleSubnetSubmit`](../../interface/application.js#L3166) | 3166 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3359) | 3359 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3363) | 3363 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3368) | 3368 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3389) | 3389 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3393) | 3393 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3397) | 3397 |
| [`deleteSubnet`](../../interface/application.js#L3408) | 3408 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3468) | 3468 |
| [`deleteSubnetCommit`](../../interface/application.js#L3496) | 3496 |
| [`deleteVlan`](../../interface/application.js#L3526) | 3526 |
| [`openIpModal`](../../interface/application.js#L3552) | 3552 |
| [`handleIpSubmit`](../../interface/application.js#L3569) | 3569 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3635) | 3635 |
| [`modalFormSnapshot`](../../interface/application.js#L3645) | 3645 |
| [`rememberModalForm`](../../interface/application.js#L3650) | 3650 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3655) | 3655 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3674) | 3674 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3693) | 3693 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3702) | 3702 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3708) | 3708 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3714) | 3714 |
| [`closeModal`](../../interface/application.js#L3723) | 3723 |
| [`openModal`](../../interface/application.js#L3749) | 3749 |
| [`readRackDimension`](../../interface/application.js#L3822) | 3822 |
| [`formatRackDimension`](../../interface/application.js#L3829) | 3829 |
| [`rackPhysicalDetails`](../../interface/application.js#L3834) | 3834 |
| [`openRackModal`](../../interface/application.js#L3843) | 3843 |
| [`handleRackSubmit`](../../interface/application.js#L3859) | 3859 |
| [`deleteRack`](../../interface/application.js#L3926) | 3926 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3948) | 3948 |
| [`refresh`](../../interface/application.js#L3971) | 3971 |
| [`openAssignDeviceModal`](../../interface/application.js#L4048) | 4048 |
| [`refresh`](../../interface/application.js#L4065) | 4065 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4072) | 4072 |
| [`handleAssignSubmit`](../../interface/application.js#L4106) | 4106 |
| [`unassignDevice`](../../interface/application.js#L4151) | 4151 |
| [`getSubnetForIp`](../../interface/application.js#L4168) | 4168 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4172) | 4172 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4216) | 4216 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4225) | 4225 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4234) | 4234 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4256) | 4256 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4266) | 4266 |
| [`toggleDeviceMountType`](../../interface/application.js#L4310) | 4310 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4332) | 4332 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4337) | 4337 |
| [`openDeviceReviewModal`](../../interface/application.js#L4355) | 4355 |
| [`openDeviceDetailView`](../../interface/application.js#L4360) | 4360 |
| [`safe`](../../interface/application.js#L4370) | 4370 |
| [`field`](../../interface/application.js#L4371) | 4371 |
| [`section`](../../interface/application.js#L4372) | 4372 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4417) | 4417 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4423) | 4423 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4442) | 4442 |
| [`navigateToDeviceRack`](../../interface/application.js#L4458) | 4458 |
| [`duplicateDevice`](../../interface/application.js#L4486) | 4486 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4556) | 4556 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4561) | 4561 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4566) | 4566 |
| [`openServerServiceManager`](../../interface/application.js#L4567) | 4567 |
| [`captureServerServiceSelections`](../../interface/application.js#L4572) | 4572 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4578) | 4578 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4599) | 4599 |
| [`archiveServerService`](../../interface/application.js#L4607) | 4607 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4631) | 4631 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4635) | 4635 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4653) | 4653 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4657) | 4657 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4660) | 4660 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4667) | 4667 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4695) | 4695 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4699) | 4699 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4744) | 4744 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4778) | 4778 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4795) | 4795 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4798) | 4798 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4799) | 4799 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4804) | 4804 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4810) | 4810 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4847) | 4847 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4848) | 4848 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4855) | 4855 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4856) | 4856 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4871) | 4871 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L4877) | 4877 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L4900) | 4900 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L4916) | 4916 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L4919) | 4919 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L4928) | 4928 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L4939) | 4939 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4948) | 4948 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4951) | 4951 |
| [`isSoftwareDetailField`](../../interface/application.js#L4958) | 4958 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L4966) | 4966 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L4975) | 4975 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L4981) | 4981 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L4993) | 4993 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5031) | 5031 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5059) | 5059 |
| [`updateInlinePickerCount`](../../interface/application.js#L5068) | 5068 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5074) | 5074 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5087) | 5087 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5096) | 5096 |
| [`fail`](../../interface/application.js#L5102) | 5102 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5156) | 5156 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5172) | 5172 |
| [`fail`](../../interface/application.js#L5177) | 5177 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5224) | 5224 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5254) | 5254 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5260) | 5260 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5626) | 5626 |
| [`isWindowsPlatform`](../../interface/application.js#L5629) | 5629 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5633) | 5633 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5636) | 5636 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5640) | 5640 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5657) | 5657 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5661) | 5661 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5681) | 5681 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L5708) | 5708 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5757) | 5757 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5765) | 5765 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5776) | 5776 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L5780) | 5780 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5792) | 5792 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5803) | 5803 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5830) | 5830 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5834) | 5834 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5838) | 5838 |
| [`getDefaultMountType`](../../interface/application.js#L5851) | 5851 |
| [`renderDeviceMountOptions`](../../interface/application.js#L5854) | 5854 |
| [`updateDeviceMountChoices`](../../interface/application.js#L5859) | 5859 |
| [`initialiseNotesEditor`](../../interface/application.js#L5872) | 5872 |
| [`inlineMarkdown`](../../interface/application.js#L5877) | 5877 |
| [`render`](../../interface/application.js#L5890) | 5890 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5924) | 5924 |
| [`activate`](../../interface/application.js#L6318) | 6318 |
| [`openDeviceModal`](../../interface/application.js#L6399) | 6399 |
| [`syncVmPurpose`](../../interface/application.js#L6447) | 6447 |
| [`clearFieldError`](../../interface/application.js#L6505) | 6505 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6524) | 6524 |
| [`createRackFromDevice`](../../interface/application.js#L6558) | 6558 |
| [`cancelRackFromDevice`](../../interface/application.js#L6566) | 6566 |
| [`createSubnetFromDevice`](../../interface/application.js#L6576) | 6576 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6589) | 6589 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6603) | 6603 |
| [`addCustomLocationOption`](../../interface/application.js#L6615) | 6615 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6655) | 6655 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6667) | 6667 |
| [`finish`](../../interface/application.js#L6687) | 6687 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L6712) | 6712 |
| [`finish`](../../interface/application.js#L6726) | 6726 |
| [`handleDeviceSubmit`](../../interface/application.js#L6746) | 6746 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L6785) | 6785 |
| [`deleteDevice`](../../interface/application.js#L6930) | 6930 |
| [`personalSafeStorageGet`](../../interface/application.js#L6987) | 6987 |
| [`openBackupExplanationDialog`](../../interface/application.js#L6992) | 6992 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7002) | 7002 |
| [`button`](../../interface/application.js#L7003) | 7003 |
| [`themeChoice`](../../interface/application.js#L7007) | 7007 |
| [`guideLinks`](../../interface/application.js#L7024) | 7024 |
| [`loadSmtpSettings`](../../interface/application.js#L7055) | 7055 |
| [`renderApplicationSettings`](../../interface/application.js#L7070) | 7070 |
| [`syncSmtpForm`](../../interface/application.js#L7074) | 7074 |
| [`updateSmtpFields`](../../interface/application.js#L7096) | 7096 |
| [`hydrateSettings`](../../interface/application.js#L7109) | 7109 |
| [`caffootCompareVersions`](../../interface/application.js#L7130) | 7130 |
| [`parse`](../../interface/application.js#L7131) | 7131 |
| [`caffootShowLicences`](../../interface/application.js#L7153) | 7153 |
| [`caffootUpdateGuide`](../../interface/application.js#L7158) | 7158 |
| [`caffootCheckUpdates`](../../interface/application.js#L7163) | 7163 |
| [`checkInventorySafety`](../../interface/application.js#L7194) | 7194 |
| [`requestInventoryReset`](../../interface/application.js#L7217) | 7217 |
| [`createInventoryBackup`](../../interface/application.js#L7244) | 7244 |
| [`validateBackupVersion`](../../interface/application.js#L7256) | 7256 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7271) | 7271 |
| [`exportData`](../../interface/application.js#L7279) | 7279 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7292) | 7292 |
| [`validateBackupStructure`](../../interface/application.js#L7307) | 7307 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7324) | 7324 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7336) | 7336 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7375) | 7375 |
| [`findRackImportConflicts`](../../interface/application.js#L7379) | 7379 |
| [`place`](../../interface/application.js#L7385) | 7385 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7431) | 7431 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7452) | 7452 |
| [`showBackupImportError`](../../interface/application.js#L7457) | 7457 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7461) | 7461 |
| [`finish`](../../interface/application.js#L7471) | 7471 |
| [`onClick`](../../interface/application.js#L7480) | 7480 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7490) | 7490 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7501) | 7501 |
| [`finish`](../../interface/application.js#L7512) | 7512 |
| [`onClick`](../../interface/application.js#L7521) | 7521 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7536) | 7536 |
| [`importData`](../../interface/application.js#L7552) | 7552 |
| [`reader.onload`](../../interface/application.js#L7562) | 7562 |
| [`reader.onerror`](../../interface/application.js#L7636) | 7636 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L7764) | 7764 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L7780) | 7780 |
| [`openRackAccessoryEditor`](../../interface/application.js#L7791) | 7791 |
| [`refreshAccessoryOptions`](../../interface/application.js#L7825) | 7825 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L7883) | 7883 |
| [`cancel`](../../interface/application.js#L7896) | 7896 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L7912) | 7912 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L7929) | 7929 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L7954) | 7954 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L7968) | 7968 |
| [`clearRackDropPreview`](../../interface/application.js#L7971) | 7971 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L7976) | 7976 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L7988) | 7988 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L7994) | 7994 |
| [`trackRackDrag`](../../interface/application.js#L8003) | 8003 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8034) | 8034 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8044) | 8044 |
| [`getRackDropPosition`](../../interface/application.js#L8137) | 8137 |
| [`window.onload`](../../interface/application.js#L8589) | 8589 |
| [`refreshCentralInventory`](../../interface/application.js#L8604) | 8604 |
| [`postInventory`](../../interface/application.js#L8625) | 8625 |
| [`isBlockedAction`](../../interface/application.js#L8677) | 8677 |
| [`applyAllowedControls`](../../interface/application.js#L8705) | 8705 |
| [`enhanceLongSelects`](../../interface/application.js#L8731) | 8731 |
| [`sync`](../../interface/application.js#L8782) | 8782 |
| [`close`](../../interface/application.js#L8788) | 8788 |
| [`choose`](../../interface/application.js#L8792) | 8792 |
| [`draw`](../../interface/application.js#L8797) | 8797 |
| [`open`](../../interface/application.js#L8815) | 8815 |
| [`enhanceSelects`](../../interface/application.js#L8872) | 8872 |
| [`switchTab`](../../interface/application.js#L8918) | 8918 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L8929) | 8929 |
| [`openDeviceDetailView`](../../interface/application.js#L8955) | 8955 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L8963) | 8963 |
| [`forbidRackMount`](../../interface/application.js#L8991) | 8991 |
| [`openDeviceModal`](../../interface/application.js#L9001) | 9001 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9043) | 9043 |
| [`relatedChanges`](../../interface/application.js#L9049) | 9049 |
| [`saveDevice`](../../interface/application.js#L9060) | 9060 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9096) | 9096 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9097) | 9097 |
| [`nextIpamBridge.save`](../../interface/application.js#L9119) | 9119 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9141) | 9141 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9163) | 9163 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9193) | 9193 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9210) | 9210 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9211) | 9211 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9212) | 9212 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9226) | 9226 |
| [`nextResetBridge.reset`](../../interface/application.js#L9257) | 9257 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9284) | 9284 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9311) | 9311 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9319) | 9319 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9328) | 9328 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9329) | 9329 |
| [`nextRackBridge.save`](../../interface/application.js#L9364) | 9364 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9367) | 9367 |
| [`nextRackBridge.persist`](../../interface/application.js#L9370) | 9370 |
| [`reserveForDelete`](../../interface/application.js#L9383) | 9383 |
| [`removeDevice`](../../interface/application.js#L9391) | 9391 |
| [`cancelDelete`](../../interface/application.js#L9417) | 9417 |
| [`saveArchivedInstallation`](../../interface/application.js#L9423) | 9423 |
| [`renderAccountSections`](../../interface/application.js#L9458) | 9458 |
| [`renderAccountMfaPanel`](../../interface/application.js#L9486) | 9486 |
| [`nextRenderAccount`](../../interface/application.js#L9496) | 9496 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L9504) | 9504 |
| [`closeEmailVerification`](../../interface/application.js#L9528) | 9528 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L9535) | 9535 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L9546) | 9546 |
| [`hydrateAccount`](../../interface/application.js#L9600) | 9600 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L9638) | 9638 |
| [`loadAccountProfile`](../../interface/application.js#L9651) | 9651 |
| [`removeAccountPhoto`](../../interface/application.js#L9667) | 9667 |
| [`nextRenderUsers`](../../interface/application.js#L9676) | 9676 |
| [`profileFields`](../../interface/application.js#L9678) | 9678 |
| [`stat`](../../interface/application.js#L9699) | 9699 |
| [`bars`](../../interface/application.js#L9702) | 9702 |
| [`operation`](../../interface/application.js#L9754) | 9754 |
| [`filterUserRows`](../../interface/application.js#L9774) | 9774 |
| [`closeUserWorkspace`](../../interface/application.js#L9798) | 9798 |
| [`loadCentralUsers`](../../interface/application.js#L9827) | 9827 |
| [`changeCentralUser`](../../interface/application.js#L9833) | 9833 |
| [`importPanel`](../../interface/application.js#L9844) | 9844 |
| [`cancelImport`](../../interface/application.js#L9848) | 9848 |
| [`nextImportModalClosed`](../../interface/application.js#L9854) | 9854 |
| [`showImportReview`](../../interface/application.js#L9855) | 9855 |
| [`chooseImportFile`](../../interface/application.js#L9895) | 9895 |
| [`actOnImport`](../../interface/application.js#L9912) | 9912 |

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
| [`delete_subnet_with_dependencies`](../../backend/collection_saves.py#L251) | 251 |
| [`remove_linked_rack_shelf`](../../backend/collection_saves.py#L368) | 368 |

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
