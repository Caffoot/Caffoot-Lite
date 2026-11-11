# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 733.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`validateApplicationState`](../../interface/application.js#L412) | 412 |
| [`loadStoredState`](../../interface/application.js#L479) | 479 |
| [`showStorageRecoveryBanner`](../../interface/application.js#L485) | 485 |
| [`download.onclick`](../../interface/application.js#L500) | 500 |
| [`reset.onclick`](../../interface/application.js#L509) | 509 |
| [`caffootThemePreference`](../../interface/application.js#L544) | 544 |
| [`caffootApplyTheme`](../../interface/application.js#L551) | 551 |
| [`caffootSetTheme`](../../interface/application.js#L565) | 565 |
| [`onSystemThemeChange`](../../interface/application.js#L576) | 576 |
| [`toggleDarkMode`](../../interface/application.js#L585) | 585 |
| [`readAuditHistory`](../../interface/application.js#L592) | 592 |
| [`auditChanges`](../../interface/application.js#L596) | 596 |
| [`recordAudit`](../../interface/application.js#L633) | 633 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L642) | 642 |
| [`exportAuditHistory`](../../interface/application.js#L654) | 654 |
| [`auditVisibleRows`](../../interface/application.js#L666) | 666 |
| [`auditDate`](../../interface/application.js#L688) | 688 |
| [`renderAuditHTML`](../../interface/application.js#L692) | 692 |
| [`hydrateAudit`](../../interface/application.js#L725) | 725 |
| [`applyAuditFilters`](../../interface/application.js#L733) | 733 |
| [`closeAuditDetail`](../../interface/application.js#L768) | 768 |
| [`showAuditDetail`](../../interface/application.js#L774) | 774 |
| [`nextRenderUsers`](../../interface/application.js#L801) | 801 |
| [`nextRenderAccount`](../../interface/application.js#L803) | 803 |
| [`hydrateAccount`](../../interface/application.js#L804) | 804 |
| [`removeAccountPhoto`](../../interface/application.js#L805) | 805 |
| [`saveState`](../../interface/application.js#L808) | 808 |
| [`getDeviceById`](../../interface/application.js#L811) | 811 |
| [`findDeviceUsingIp`](../../interface/application.js#L815) | 815 |
| [`setDevicePrimaryIp`](../../interface/application.js#L820) | 820 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L873) | 873 |
| [`isRackMountedDevice`](../../interface/application.js#L886) | 886 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L889) | 889 |
| [`getRackShelfLocation`](../../interface/application.js#L901) | 901 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L906) | 906 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L922) | 922 |
| [`openRackShelfCreation`](../../interface/application.js#L940) | 940 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L954) | 954 |
| [`createRackShelfFromDevice`](../../interface/application.js#L964) | 964 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L971) | 971 |
| [`options`](../../interface/application.js#L977) | 977 |
| [`validateRackPlacement`](../../interface/application.js#L998) | 998 |
| [`showToast`](../../interface/application.js#L1033) | 1033 |
| [`toggleSidebar`](../../interface/application.js#L1121) | 1121 |
| [`switchTab`](../../interface/application.js#L1140) | 1140 |
| [`escapeHtml`](../../interface/application.js#L1167) | 1167 |
| [`inlineJsArg`](../../interface/application.js#L1176) | 1176 |
| [`browserStorageWarning`](../../interface/application.js#L1184) | 1184 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1187) | 1187 |
| [`renderSectionTabIcon`](../../interface/application.js#L1193) | 1193 |
| [`renderSectionHeader`](../../interface/application.js#L1199) | 1199 |
| [`tab`](../../interface/application.js#L1200) | 1200 |
| [`revealSectionTab`](../../interface/application.js#L1227) | 1227 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1234) | 1234 |
| [`renderContent`](../../interface/application.js#L1250) | 1250 |
| [`updateScrollHint`](../../interface/application.js#L1286) | 1286 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1297) | 1297 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1332) | 1332 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1336) | 1336 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1340) | 1340 |
| [`buildInventoryReportData`](../../interface/application.js#L1346) | 1346 |
| [`occupancy`](../../interface/application.js#L1362) | 1362 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1385) | 1385 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1391) | 1391 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1417) | 1417 |
| [`renderDashboardHTML`](../../interface/application.js#L1436) | 1436 |
| [`statusPill`](../../interface/application.js#L1539) | 1539 |
| [`insightSegment`](../../interface/application.js#L1556) | 1556 |
| [`getCategoryIcon`](../../interface/application.js#L1597) | 1597 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1612) | 1612 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1621) | 1621 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1626) | 1626 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1641) | 1641 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1656) | 1656 |
| [`printRackElevation`](../../interface/application.js#L1666) | 1666 |
| [`safe`](../../interface/application.js#L1669) | 1669 |
| [`printRackElevationInFrame`](../../interface/application.js#L1700) | 1700 |
| [`frame.onload`](../../interface/application.js#L1710) | 1710 |
| [`renderRackHubV13`](../../interface/application.js#L1731) | 1731 |
| [`card`](../../interface/application.js#L1736) | 1736 |
| [`mark`](../../interface/application.js#L1745) | 1745 |
| [`bar`](../../interface/application.js#L1761) | 1761 |
| [`chartBox`](../../interface/application.js#L1762) | 1762 |
| [`chartRows`](../../interface/application.js#L1763) | 1763 |
| [`rackSpaceGuide`](../../interface/application.js#L1765) | 1765 |
| [`renderRacksHTML`](../../interface/application.js#L1834) | 1834 |
| [`changeRack`](../../interface/application.js#L1901) | 1901 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1920) | 1920 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1927) | 1927 |
| [`getVisibleDevices`](../../interface/application.js#L1933) | 1933 |
| [`filterHardwareModels`](../../interface/application.js#L1958) | 1958 |
| [`openCatalogueModal`](../../interface/application.js#L1997) | 1997 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2006) | 2006 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2030) | 2030 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2068) | 2068 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2080) | 2080 |
| [`renderCatalogueButton`](../../interface/application.js#L2097) | 2097 |
| [`renderCatalogueRecord`](../../interface/application.js#L2101) | 2101 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2106) | 2106 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2125) | 2125 |
| [`add`](../../interface/application.js#L2127) | 2127 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2172) | 2172 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2179) | 2179 |
| [`openHardwareModelManager`](../../interface/application.js#L2191) | 2191 |
| [`opts`](../../interface/application.js#L2196) | 2196 |
| [`saveHardwareModel`](../../interface/application.js#L2214) | 2214 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2243) | 2243 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2257) | 2257 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2279) | 2279 |
| [`add`](../../interface/application.js#L2281) | 2281 |
| [`options`](../../interface/application.js#L2317) | 2317 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2331) | 2331 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2346) | 2346 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2361) | 2361 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2369) | 2369 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2380) | 2380 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2389) | 2389 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2411) | 2411 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2422) | 2422 |
| [`openServerServiceEditor`](../../interface/application.js#L2439) | 2439 |
| [`saveServerServiceEntry`](../../interface/application.js#L2448) | 2448 |
| [`restoreArchivedServerService`](../../interface/application.js#L2461) | 2461 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2470) | 2470 |
| [`renderDevicesHTML`](../../interface/application.js#L2482) | 2482 |
| [`renderHardwareMetric`](../../interface/application.js#L2490) | 2490 |
| [`renderHardwareChart`](../../interface/application.js#L2495) | 2495 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2505) | 2505 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2524) | 2524 |
| [`renderArchivedSoftware`](../../interface/application.js#L2532) | 2532 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2567) | 2567 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2574) | 2574 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2575) | 2575 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2576) | 2576 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2579) | 2579 |
| [`openManageTypesModal`](../../interface/application.js#L2595) | 2595 |
| [`openManageLocationsModal`](../../interface/application.js#L2596) | 2596 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2599) | 2599 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2621) | 2621 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2628) | 2628 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2636) | 2636 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2656) | 2656 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2657) | 2657 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2658) | 2658 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2673) | 2673 |
| [`deleteDeviceType`](../../interface/application.js#L2693) | 2693 |
| [`deleteDeviceLocation`](../../interface/application.js#L2694) | 2694 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2702) | 2702 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2706) | 2706 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2732) | 2732 |
| [`nodes`](../../interface/application.js#L2742) | 2742 |
| [`renderIpamManage`](../../interface/application.js#L2768) | 2768 |
| [`renderIpamHTML`](../../interface/application.js#L2819) | 2819 |
| [`changeSubnet`](../../interface/application.js#L2979) | 2979 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2992) | 2992 |
| [`openIpamModal`](../../interface/application.js#L3018) | 3018 |
| [`openBulkIpModal`](../../interface/application.js#L3023) | 3023 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3030) | 3030 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3034) | 3034 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3053) | 3053 |
| [`applyBulkIpChanges`](../../interface/application.js#L3069) | 3069 |
| [`subnetCidrFeedback`](../../interface/application.js#L3083) | 3083 |
| [`suggestSubnetGateway`](../../interface/application.js#L3101) | 3101 |
| [`openSubnetModal`](../../interface/application.js#L3129) | 3129 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3133) | 3133 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3159) | 3159 |
| [`handleSubnetSubmit`](../../interface/application.js#L3179) | 3179 |
| [`showSubnetFormError`](../../interface/application.js#L3386) | 3386 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3401) | 3401 |
| [`subnetNameConflicts`](../../interface/application.js#L3415) | 3415 |
| [`subnetHasVlan`](../../interface/application.js#L3422) | 3422 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3425) | 3425 |
| [`openMultipleSubnets`](../../interface/application.js#L3433) | 3433 |
| [`option`](../../interface/application.js#L3435) | 3435 |
| [`visibility`](../../interface/application.js#L3440) | 3440 |
| [`planningVisibility`](../../interface/application.js#L3444) | 3444 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3462) | 3462 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3474) | 3474 |
| [`read`](../../interface/application.js#L3476) | 3476 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3494) | 3494 |
| [`reject`](../../interface/application.js#L3496) | 3496 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3533) | 3533 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3537) | 3537 |
| [`add`](../../interface/application.js#L3540) | 3540 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3567) | 3567 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3574) | 3574 |
| [`field`](../../interface/application.js#L3577) | 3577 |
| [`capture`](../../interface/application.js#L3587) | 3587 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3621) | 3621 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3625) | 3625 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3631) | 3631 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3652) | 3652 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3656) | 3656 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3660) | 3660 |
| [`deleteSubnet`](../../interface/application.js#L3671) | 3671 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3731) | 3731 |
| [`deleteSubnetCommit`](../../interface/application.js#L3759) | 3759 |
| [`deleteVlan`](../../interface/application.js#L3789) | 3789 |
| [`openIpModal`](../../interface/application.js#L3815) | 3815 |
| [`handleIpSubmit`](../../interface/application.js#L3832) | 3832 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3898) | 3898 |
| [`modalFormSnapshot`](../../interface/application.js#L3908) | 3908 |
| [`rememberModalForm`](../../interface/application.js#L3913) | 3913 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3918) | 3918 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3937) | 3937 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3956) | 3956 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3965) | 3965 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3971) | 3971 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3977) | 3977 |
| [`closeModal`](../../interface/application.js#L3986) | 3986 |
| [`openModal`](../../interface/application.js#L4013) | 4013 |
| [`readRackDimension`](../../interface/application.js#L4086) | 4086 |
| [`formatRackDimension`](../../interface/application.js#L4093) | 4093 |
| [`rackPhysicalDetails`](../../interface/application.js#L4098) | 4098 |
| [`openRackModal`](../../interface/application.js#L4107) | 4107 |
| [`handleRackSubmit`](../../interface/application.js#L4123) | 4123 |
| [`deleteRack`](../../interface/application.js#L4190) | 4190 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4212) | 4212 |
| [`refresh`](../../interface/application.js#L4235) | 4235 |
| [`openAssignDeviceModal`](../../interface/application.js#L4312) | 4312 |
| [`refresh`](../../interface/application.js#L4329) | 4329 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4336) | 4336 |
| [`handleAssignSubmit`](../../interface/application.js#L4370) | 4370 |
| [`unassignDevice`](../../interface/application.js#L4415) | 4415 |
| [`getSubnetForIp`](../../interface/application.js#L4432) | 4432 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4436) | 4436 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4480) | 4480 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4489) | 4489 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4498) | 4498 |
| [`inside`](../../interface/application.js#L4505) | 4505 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4523) | 4523 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4532) | 4532 |
| [`toggleDeviceMountType`](../../interface/application.js#L4576) | 4576 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4600) | 4600 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4605) | 4605 |
| [`openDeviceReviewModal`](../../interface/application.js#L4623) | 4623 |
| [`openDeviceDetailView`](../../interface/application.js#L4628) | 4628 |
| [`safe`](../../interface/application.js#L4638) | 4638 |
| [`field`](../../interface/application.js#L4639) | 4639 |
| [`section`](../../interface/application.js#L4640) | 4640 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4685) | 4685 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4691) | 4691 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4710) | 4710 |
| [`navigateToDeviceRack`](../../interface/application.js#L4726) | 4726 |
| [`duplicateDevice`](../../interface/application.js#L4754) | 4754 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4824) | 4824 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4829) | 4829 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4834) | 4834 |
| [`openServerServiceManager`](../../interface/application.js#L4835) | 4835 |
| [`captureServerServiceSelections`](../../interface/application.js#L4840) | 4840 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4846) | 4846 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4867) | 4867 |
| [`archiveServerService`](../../interface/application.js#L4875) | 4875 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4899) | 4899 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4903) | 4903 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4921) | 4921 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4925) | 4925 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4928) | 4928 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4935) | 4935 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4963) | 4963 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4967) | 4967 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5012) | 5012 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5046) | 5046 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5063) | 5063 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5066) | 5066 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5067) | 5067 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5072) | 5072 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5078) | 5078 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5115) | 5115 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5116) | 5116 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5123) | 5123 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5124) | 5124 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5139) | 5139 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5145) | 5145 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5168) | 5168 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5184) | 5184 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5187) | 5187 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5196) | 5196 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5207) | 5207 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5216) | 5216 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5219) | 5219 |
| [`isSoftwareDetailField`](../../interface/application.js#L5226) | 5226 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5234) | 5234 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5243) | 5243 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5249) | 5249 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5261) | 5261 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5300) | 5300 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5328) | 5328 |
| [`updateInlinePickerCount`](../../interface/application.js#L5337) | 5337 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5343) | 5343 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5356) | 5356 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5365) | 5365 |
| [`fail`](../../interface/application.js#L5371) | 5371 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5425) | 5425 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5441) | 5441 |
| [`fail`](../../interface/application.js#L5446) | 5446 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5493) | 5493 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5523) | 5523 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5529) | 5529 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5895) | 5895 |
| [`isWindowsPlatform`](../../interface/application.js#L5898) | 5898 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5902) | 5902 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5905) | 5905 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5909) | 5909 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5926) | 5926 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5930) | 5930 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5950) | 5950 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L5977) | 5977 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6026) | 6026 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6034) | 6034 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6045) | 6045 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6049) | 6049 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6061) | 6061 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6072) | 6072 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6099) | 6099 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6103) | 6103 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6107) | 6107 |
| [`getDefaultMountType`](../../interface/application.js#L6120) | 6120 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6123) | 6123 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6128) | 6128 |
| [`initialiseNotesEditor`](../../interface/application.js#L6141) | 6141 |
| [`inlineMarkdown`](../../interface/application.js#L6146) | 6146 |
| [`render`](../../interface/application.js#L6159) | 6159 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6193) | 6193 |
| [`activate`](../../interface/application.js#L6587) | 6587 |
| [`openDeviceModal`](../../interface/application.js#L6668) | 6668 |
| [`syncVmPurpose`](../../interface/application.js#L6716) | 6716 |
| [`clearFieldError`](../../interface/application.js#L6777) | 6777 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6796) | 6796 |
| [`createRackFromDevice`](../../interface/application.js#L6831) | 6831 |
| [`cancelRackFromDevice`](../../interface/application.js#L6839) | 6839 |
| [`createSubnetFromDevice`](../../interface/application.js#L6849) | 6849 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6862) | 6862 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6876) | 6876 |
| [`addCustomLocationOption`](../../interface/application.js#L6888) | 6888 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6928) | 6928 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6940) | 6940 |
| [`finish`](../../interface/application.js#L6960) | 6960 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L6985) | 6985 |
| [`finish`](../../interface/application.js#L6999) | 6999 |
| [`handleDeviceSubmit`](../../interface/application.js#L7019) | 7019 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7058) | 7058 |
| [`deleteDevice`](../../interface/application.js#L7205) | 7205 |
| [`personalSafeStorageGet`](../../interface/application.js#L7262) | 7262 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7267) | 7267 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7277) | 7277 |
| [`button`](../../interface/application.js#L7278) | 7278 |
| [`themeChoice`](../../interface/application.js#L7282) | 7282 |
| [`guideLinks`](../../interface/application.js#L7299) | 7299 |
| [`loadSmtpSettings`](../../interface/application.js#L7330) | 7330 |
| [`renderApplicationSettings`](../../interface/application.js#L7345) | 7345 |
| [`syncSmtpForm`](../../interface/application.js#L7349) | 7349 |
| [`updateSmtpFields`](../../interface/application.js#L7371) | 7371 |
| [`hydrateSettings`](../../interface/application.js#L7384) | 7384 |
| [`caffootCompareVersions`](../../interface/application.js#L7405) | 7405 |
| [`parse`](../../interface/application.js#L7406) | 7406 |
| [`caffootShowLicences`](../../interface/application.js#L7428) | 7428 |
| [`caffootUpdateGuide`](../../interface/application.js#L7433) | 7433 |
| [`caffootCheckUpdates`](../../interface/application.js#L7438) | 7438 |
| [`checkInventorySafety`](../../interface/application.js#L7469) | 7469 |
| [`requestInventoryReset`](../../interface/application.js#L7492) | 7492 |
| [`createInventoryBackup`](../../interface/application.js#L7519) | 7519 |
| [`validateBackupVersion`](../../interface/application.js#L7531) | 7531 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7546) | 7546 |
| [`exportData`](../../interface/application.js#L7554) | 7554 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7567) | 7567 |
| [`validateBackupStructure`](../../interface/application.js#L7582) | 7582 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7599) | 7599 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7611) | 7611 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7650) | 7650 |
| [`findRackImportConflicts`](../../interface/application.js#L7654) | 7654 |
| [`place`](../../interface/application.js#L7660) | 7660 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7706) | 7706 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7727) | 7727 |
| [`showBackupImportError`](../../interface/application.js#L7732) | 7732 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7736) | 7736 |
| [`finish`](../../interface/application.js#L7746) | 7746 |
| [`onClick`](../../interface/application.js#L7755) | 7755 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7765) | 7765 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7776) | 7776 |
| [`finish`](../../interface/application.js#L7787) | 7787 |
| [`onClick`](../../interface/application.js#L7796) | 7796 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7811) | 7811 |
| [`importData`](../../interface/application.js#L7827) | 7827 |
| [`reader.onload`](../../interface/application.js#L7837) | 7837 |
| [`reader.onerror`](../../interface/application.js#L7911) | 7911 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8038) | 8038 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8054) | 8054 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8065) | 8065 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8099) | 8099 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8157) | 8157 |
| [`cancel`](../../interface/application.js#L8170) | 8170 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8186) | 8186 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8203) | 8203 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8228) | 8228 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8242) | 8242 |
| [`clearRackDropPreview`](../../interface/application.js#L8245) | 8245 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8250) | 8250 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8262) | 8262 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8268) | 8268 |
| [`trackRackDrag`](../../interface/application.js#L8277) | 8277 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8308) | 8308 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8318) | 8318 |
| [`getRackDropPosition`](../../interface/application.js#L8411) | 8411 |
| [`window.onload`](../../interface/application.js#L8864) | 8864 |
| [`refreshCentralInventory`](../../interface/application.js#L8880) | 8880 |
| [`postInventory`](../../interface/application.js#L8901) | 8901 |
| [`isBlockedAction`](../../interface/application.js#L8953) | 8953 |
| [`applyAllowedControls`](../../interface/application.js#L8981) | 8981 |
| [`enhanceLongSelects`](../../interface/application.js#L9007) | 9007 |
| [`sync`](../../interface/application.js#L9058) | 9058 |
| [`close`](../../interface/application.js#L9064) | 9064 |
| [`choose`](../../interface/application.js#L9068) | 9068 |
| [`draw`](../../interface/application.js#L9073) | 9073 |
| [`open`](../../interface/application.js#L9091) | 9091 |
| [`enhanceSelects`](../../interface/application.js#L9148) | 9148 |
| [`switchTab`](../../interface/application.js#L9194) | 9194 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9205) | 9205 |
| [`openDeviceDetailView`](../../interface/application.js#L9231) | 9231 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9239) | 9239 |
| [`forbidRackMount`](../../interface/application.js#L9267) | 9267 |
| [`openDeviceModal`](../../interface/application.js#L9277) | 9277 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9319) | 9319 |
| [`relatedChanges`](../../interface/application.js#L9325) | 9325 |
| [`saveDevice`](../../interface/application.js#L9336) | 9336 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9363) | 9363 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9364) | 9364 |
| [`nextIpamBridge.save`](../../interface/application.js#L9386) | 9386 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9408) | 9408 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9430) | 9430 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9465) | 9465 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9482) | 9482 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9483) | 9483 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9484) | 9484 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9498) | 9498 |
| [`nextResetBridge.reset`](../../interface/application.js#L9529) | 9529 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9556) | 9556 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9583) | 9583 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9591) | 9591 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9600) | 9600 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9601) | 9601 |
| [`nextRackBridge.save`](../../interface/application.js#L9636) | 9636 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9639) | 9639 |
| [`nextRackBridge.persist`](../../interface/application.js#L9642) | 9642 |
| [`reserveForDelete`](../../interface/application.js#L9664) | 9664 |
| [`removeDevice`](../../interface/application.js#L9672) | 9672 |
| [`cancelDelete`](../../interface/application.js#L9698) | 9698 |
| [`saveArchivedInstallation`](../../interface/application.js#L9704) | 9704 |
| [`renderAccountSections`](../../interface/application.js#L9740) | 9740 |
| [`renderAccountMfaPanel`](../../interface/application.js#L9768) | 9768 |
| [`nextRenderAccount`](../../interface/application.js#L9779) | 9779 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L9787) | 9787 |
| [`closeEmailVerification`](../../interface/application.js#L9811) | 9811 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L9818) | 9818 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L9829) | 9829 |
| [`hydrateAccount`](../../interface/application.js#L9883) | 9883 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L9921) | 9921 |
| [`loadAccountProfile`](../../interface/application.js#L9934) | 9934 |
| [`removeAccountPhoto`](../../interface/application.js#L9950) | 9950 |
| [`permissionLabel`](../../interface/application.js#L9962) | 9962 |
| [`accountMfaLabel`](../../interface/application.js#L9965) | 9965 |
| [`renderRoleMemberships`](../../interface/application.js#L9968) | 9968 |
| [`renderRoleCatalogue`](../../interface/application.js#L9974) | 9974 |
| [`openRoleLayer`](../../interface/application.js#L9979) | 9979 |
| [`closeRoleLayer`](../../interface/application.js#L9990) | 9990 |
| [`renderRoleDefinition`](../../interface/application.js#L9996) | 9996 |
| [`renderRoleImpact`](../../interface/application.js#L10000) | 10000 |
| [`access`](../../interface/application.js#L10005) | 10005 |
| [`state`](../../interface/application.js#L10009) | 10009 |
| [`requestRoleChange`](../../interface/application.js#L10014) | 10014 |
| [`roleNotificationMessage`](../../interface/application.js#L10021) | 10021 |
| [`previewRoleAction`](../../interface/application.js#L10025) | 10025 |
| [`openRoleEditor`](../../interface/application.js#L10030) | 10030 |
| [`nextRenderUsers`](../../interface/application.js#L10093) | 10093 |
| [`profileFields`](../../interface/application.js#L10095) | 10095 |
| [`stat`](../../interface/application.js#L10116) | 10116 |
| [`bars`](../../interface/application.js#L10119) | 10119 |
| [`operation`](../../interface/application.js#L10175) | 10175 |
| [`filterUserRows`](../../interface/application.js#L10195) | 10195 |
| [`closeUserWorkspace`](../../interface/application.js#L10219) | 10219 |
| [`loadCentralUsers`](../../interface/application.js#L10248) | 10248 |
| [`changeCentralUser`](../../interface/application.js#L10254) | 10254 |
| [`importPanel`](../../interface/application.js#L10265) | 10265 |
| [`cancelImport`](../../interface/application.js#L10269) | 10269 |
| [`nextImportModalClosed`](../../interface/application.js#L10275) | 10275 |
| [`showImportReview`](../../interface/application.js#L10276) | 10276 |
| [`chooseImportFile`](../../interface/application.js#L10316) | 10316 |
| [`actOnImport`](../../interface/application.js#L10333) | 10333 |

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
| [`verify_active_password`](../../backend/authentication.py#L18) | 18 |
| [`authenticate`](../../backend/authentication.py#L32) | 32 |

## backend/collection_saves.py

| Function | Line |
| --- | ---: |
| [`change_inventory_record`](../../backend/collection_saves.py#L20) | 20 |
| [`change_ipam_subnet_and_vlan_records`](../../backend/collection_saves.py#L112) | 112 |
| [`delete_subnet_with_dependencies`](../../backend/collection_saves.py#L254) | 254 |
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
| [`_admin`](../../backend/permissions.py#L11) | 11 |
| [`_target`](../../backend/permissions.py#L20) | 20 |
| [`create_user`](../../backend/permissions.py#L29) | 29 |
| [`set_permission`](../../backend/permissions.py#L62) | 62 |
| [`can_access`](../../backend/permissions.py#L73) | 73 |
| [`set_account_active`](../../backend/permissions.py#L77) | 77 |
| [`delete_user`](../../backend/permissions.py#L116) | 116 |
| [`set_administrator`](../../backend/permissions.py#L144) | 144 |
| [`can_replace_inventory`](../../backend/permissions.py#L185) | 185 |

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
| [`_action_targets`](../../backend/roles.py#L113) | 113 |
| [`_apply_values`](../../backend/roles.py#L132) | 132 |
| [`_security_snapshot`](../../backend/roles.py#L164) | 164 |
| [`_preview_impact`](../../backend/roles.py#L195) | 195 |
| [`_confirmation_signature`](../../backend/roles.py#L233) | 233 |
| [`_issue_preview`](../../backend/roles.py#L240) | 240 |
| [`preview_role_change`](../../backend/roles.py#L248) | 248 |
| [`confirm_role_change`](../../backend/roles.py#L260) | 260 |
| [`_audit_role_value`](../../backend/roles.py#L312) | 312 |

## backend/schema.py

| Function | Line |
| --- | ---: |
| [`initialise_database`](../../backend/schema.py#L56) | 56 |
| [`migrate_role_permissions`](../../backend/schema.py#L196) | 196 |
| [`verify_role_migration`](../../backend/schema.py#L281) | 281 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L80) | 80 |
| [`connect`](../../backend/server.py#L98) | 98 |
| [`initialise_database`](../../backend/server.py#L106) | 106 |
| [`Handler.end_headers`](../../backend/server.py#L112) | 112 |
| [`Handler.do_GET`](../../backend/server.py#L119) | 119 |
| [`Handler.do_POST`](../../backend/server.py#L446) | 446 |
| [`Handler.handle_role_change`](../../backend/server.py#L617) | 617 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L659) | 659 |
| [`Handler.handle_account_email`](../../backend/server.py#L1035) | 1035 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1115) | 1115 |
| [`Handler.handle_import`](../../backend/server.py#L1146) | 1146 |
| [`Handler.respond`](../../backend/server.py#L1222) | 1222 |
| [`main`](../../backend/server.py#L1235) | 1235 |

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
