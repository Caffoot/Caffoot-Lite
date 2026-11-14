# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 754.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`initialiseDeviceShelfFields`](../../interface/application.js#L916) | 916 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L932) | 932 |
| [`openRackShelfCreation`](../../interface/application.js#L950) | 950 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L964) | 964 |
| [`createRackShelfFromDevice`](../../interface/application.js#L974) | 974 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L981) | 981 |
| [`options`](../../interface/application.js#L987) | 987 |
| [`validateRackPlacement`](../../interface/application.js#L1008) | 1008 |
| [`showToast`](../../interface/application.js#L1058) | 1058 |
| [`toggleSidebar`](../../interface/application.js#L1140) | 1140 |
| [`switchTab`](../../interface/application.js#L1159) | 1159 |
| [`escapeHtml`](../../interface/application.js#L1186) | 1186 |
| [`inlineJsArg`](../../interface/application.js#L1195) | 1195 |
| [`browserStorageWarning`](../../interface/application.js#L1203) | 1203 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1206) | 1206 |
| [`renderSectionTabIcon`](../../interface/application.js#L1212) | 1212 |
| [`renderSectionHeader`](../../interface/application.js#L1218) | 1218 |
| [`tab`](../../interface/application.js#L1219) | 1219 |
| [`revealSectionTab`](../../interface/application.js#L1246) | 1246 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1253) | 1253 |
| [`renderContent`](../../interface/application.js#L1269) | 1269 |
| [`updateScrollHint`](../../interface/application.js#L1305) | 1305 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1316) | 1316 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1351) | 1351 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1355) | 1355 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1359) | 1359 |
| [`buildInventoryReportData`](../../interface/application.js#L1365) | 1365 |
| [`occupancy`](../../interface/application.js#L1381) | 1381 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1404) | 1404 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1410) | 1410 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1436) | 1436 |
| [`renderDashboardHTML`](../../interface/application.js#L1455) | 1455 |
| [`statusPill`](../../interface/application.js#L1561) | 1561 |
| [`insightSegment`](../../interface/application.js#L1578) | 1578 |
| [`getCategoryIcon`](../../interface/application.js#L1636) | 1636 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1651) | 1651 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1660) | 1660 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1665) | 1665 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1680) | 1680 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1695) | 1695 |
| [`printRackElevation`](../../interface/application.js#L1705) | 1705 |
| [`safe`](../../interface/application.js#L1708) | 1708 |
| [`printRackElevationInFrame`](../../interface/application.js#L1739) | 1739 |
| [`frame.onload`](../../interface/application.js#L1749) | 1749 |
| [`renderRackHubV13`](../../interface/application.js#L1770) | 1770 |
| [`card`](../../interface/application.js#L1775) | 1775 |
| [`mark`](../../interface/application.js#L1784) | 1784 |
| [`bar`](../../interface/application.js#L1800) | 1800 |
| [`chartBox`](../../interface/application.js#L1801) | 1801 |
| [`chartRows`](../../interface/application.js#L1802) | 1802 |
| [`rackSpaceGuide`](../../interface/application.js#L1804) | 1804 |
| [`renderRacksHTML`](../../interface/application.js#L1873) | 1873 |
| [`changeRack`](../../interface/application.js#L1940) | 1940 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1959) | 1959 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1966) | 1966 |
| [`getVisibleDevices`](../../interface/application.js#L1972) | 1972 |
| [`filterHardwareModels`](../../interface/application.js#L1997) | 1997 |
| [`openCatalogueModal`](../../interface/application.js#L2036) | 2036 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2045) | 2045 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2069) | 2069 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2107) | 2107 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2119) | 2119 |
| [`renderCatalogueButton`](../../interface/application.js#L2136) | 2136 |
| [`renderCatalogueRecord`](../../interface/application.js#L2140) | 2140 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2145) | 2145 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2164) | 2164 |
| [`add`](../../interface/application.js#L2166) | 2166 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2211) | 2211 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2218) | 2218 |
| [`openHardwareModelManager`](../../interface/application.js#L2230) | 2230 |
| [`opts`](../../interface/application.js#L2235) | 2235 |
| [`saveHardwareModel`](../../interface/application.js#L2253) | 2253 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2282) | 2282 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2296) | 2296 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2318) | 2318 |
| [`add`](../../interface/application.js#L2320) | 2320 |
| [`options`](../../interface/application.js#L2356) | 2356 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2370) | 2370 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2385) | 2385 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2400) | 2400 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2408) | 2408 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2419) | 2419 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2428) | 2428 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2450) | 2450 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2461) | 2461 |
| [`openServerServiceEditor`](../../interface/application.js#L2478) | 2478 |
| [`saveServerServiceEntry`](../../interface/application.js#L2487) | 2487 |
| [`restoreArchivedServerService`](../../interface/application.js#L2500) | 2500 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2509) | 2509 |
| [`renderDevicesHTML`](../../interface/application.js#L2521) | 2521 |
| [`renderHardwareMetric`](../../interface/application.js#L2529) | 2529 |
| [`renderHardwareChart`](../../interface/application.js#L2534) | 2534 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2544) | 2544 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2563) | 2563 |
| [`renderArchivedSoftware`](../../interface/application.js#L2571) | 2571 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2606) | 2606 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2613) | 2613 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2614) | 2614 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2615) | 2615 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2618) | 2618 |
| [`openManageTypesModal`](../../interface/application.js#L2634) | 2634 |
| [`openManageLocationsModal`](../../interface/application.js#L2635) | 2635 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2638) | 2638 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2660) | 2660 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2667) | 2667 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2675) | 2675 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2695) | 2695 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2696) | 2696 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2697) | 2697 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2712) | 2712 |
| [`deleteDeviceType`](../../interface/application.js#L2732) | 2732 |
| [`deleteDeviceLocation`](../../interface/application.js#L2733) | 2733 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2741) | 2741 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2745) | 2745 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2772) | 2772 |
| [`nodes`](../../interface/application.js#L2782) | 2782 |
| [`renderIpamManage`](../../interface/application.js#L2808) | 2808 |
| [`renderIpamHTML`](../../interface/application.js#L2859) | 2859 |
| [`changeSubnet`](../../interface/application.js#L3020) | 3020 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3033) | 3033 |
| [`openIpamModal`](../../interface/application.js#L3059) | 3059 |
| [`openBulkIpModal`](../../interface/application.js#L3064) | 3064 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3071) | 3071 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3075) | 3075 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3094) | 3094 |
| [`applyBulkIpChanges`](../../interface/application.js#L3110) | 3110 |
| [`subnetCidrFeedback`](../../interface/application.js#L3124) | 3124 |
| [`suggestSubnetGateway`](../../interface/application.js#L3142) | 3142 |
| [`openSubnetModal`](../../interface/application.js#L3170) | 3170 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3174) | 3174 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3200) | 3200 |
| [`handleSubnetSubmit`](../../interface/application.js#L3220) | 3220 |
| [`showSubnetFormError`](../../interface/application.js#L3427) | 3427 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3443) | 3443 |
| [`subnetNameConflicts`](../../interface/application.js#L3457) | 3457 |
| [`subnetHasVlan`](../../interface/application.js#L3464) | 3464 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3467) | 3467 |
| [`openMultipleSubnets`](../../interface/application.js#L3475) | 3475 |
| [`option`](../../interface/application.js#L3477) | 3477 |
| [`visibility`](../../interface/application.js#L3482) | 3482 |
| [`planningVisibility`](../../interface/application.js#L3486) | 3486 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3504) | 3504 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3516) | 3516 |
| [`read`](../../interface/application.js#L3518) | 3518 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3536) | 3536 |
| [`reject`](../../interface/application.js#L3538) | 3538 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3575) | 3575 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3579) | 3579 |
| [`add`](../../interface/application.js#L3582) | 3582 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3609) | 3609 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3617) | 3617 |
| [`field`](../../interface/application.js#L3620) | 3620 |
| [`capture`](../../interface/application.js#L3630) | 3630 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3664) | 3664 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3668) | 3668 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3674) | 3674 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3695) | 3695 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3699) | 3699 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3703) | 3703 |
| [`deleteSubnet`](../../interface/application.js#L3714) | 3714 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3774) | 3774 |
| [`deleteSubnetCommit`](../../interface/application.js#L3802) | 3802 |
| [`deleteVlan`](../../interface/application.js#L3832) | 3832 |
| [`openIpModal`](../../interface/application.js#L3858) | 3858 |
| [`handleIpSubmit`](../../interface/application.js#L3875) | 3875 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3941) | 3941 |
| [`modalFormSnapshot`](../../interface/application.js#L3951) | 3951 |
| [`rememberModalForm`](../../interface/application.js#L3956) | 3956 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3961) | 3961 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3980) | 3980 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3999) | 3999 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4008) | 4008 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4014) | 4014 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4020) | 4020 |
| [`closeModal`](../../interface/application.js#L4029) | 4029 |
| [`openModal`](../../interface/application.js#L4056) | 4056 |
| [`readRackDimension`](../../interface/application.js#L4129) | 4129 |
| [`formatRackDimension`](../../interface/application.js#L4136) | 4136 |
| [`rackPhysicalDetails`](../../interface/application.js#L4141) | 4141 |
| [`openRackModal`](../../interface/application.js#L4150) | 4150 |
| [`handleRackSubmit`](../../interface/application.js#L4166) | 4166 |
| [`deleteRack`](../../interface/application.js#L4233) | 4233 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4255) | 4255 |
| [`refresh`](../../interface/application.js#L4278) | 4278 |
| [`openAssignDeviceModal`](../../interface/application.js#L4355) | 4355 |
| [`refresh`](../../interface/application.js#L4372) | 4372 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4379) | 4379 |
| [`handleAssignSubmit`](../../interface/application.js#L4413) | 4413 |
| [`unassignDevice`](../../interface/application.js#L4458) | 4458 |
| [`getSubnetForIp`](../../interface/application.js#L4475) | 4475 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4479) | 4479 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4526) | 4526 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4535) | 4535 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4544) | 4544 |
| [`inside`](../../interface/application.js#L4551) | 4551 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4569) | 4569 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4578) | 4578 |
| [`toggleDeviceMountType`](../../interface/application.js#L4622) | 4622 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4646) | 4646 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4651) | 4651 |
| [`openDeviceReviewModal`](../../interface/application.js#L4669) | 4669 |
| [`openDeviceDetailView`](../../interface/application.js#L4674) | 4674 |
| [`safe`](../../interface/application.js#L4684) | 4684 |
| [`field`](../../interface/application.js#L4685) | 4685 |
| [`section`](../../interface/application.js#L4686) | 4686 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4731) | 4731 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4737) | 4737 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4756) | 4756 |
| [`navigateToDeviceRack`](../../interface/application.js#L4772) | 4772 |
| [`duplicateDevice`](../../interface/application.js#L4800) | 4800 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4870) | 4870 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4875) | 4875 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4880) | 4880 |
| [`openServerServiceManager`](../../interface/application.js#L4881) | 4881 |
| [`captureServerServiceSelections`](../../interface/application.js#L4886) | 4886 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4892) | 4892 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4913) | 4913 |
| [`archiveServerService`](../../interface/application.js#L4921) | 4921 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4945) | 4945 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4949) | 4949 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4967) | 4967 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4971) | 4971 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4974) | 4974 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4981) | 4981 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5009) | 5009 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5013) | 5013 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5058) | 5058 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5092) | 5092 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5109) | 5109 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5112) | 5112 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5113) | 5113 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5118) | 5118 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5124) | 5124 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5161) | 5161 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5162) | 5162 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5169) | 5169 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5170) | 5170 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5185) | 5185 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5191) | 5191 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5214) | 5214 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5230) | 5230 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5233) | 5233 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5242) | 5242 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5253) | 5253 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5262) | 5262 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5265) | 5265 |
| [`isSoftwareDetailField`](../../interface/application.js#L5272) | 5272 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5280) | 5280 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5289) | 5289 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5295) | 5295 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5307) | 5307 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5347) | 5347 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5375) | 5375 |
| [`updateInlinePickerCount`](../../interface/application.js#L5384) | 5384 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5390) | 5390 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5403) | 5403 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5412) | 5412 |
| [`fail`](../../interface/application.js#L5418) | 5418 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5472) | 5472 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5488) | 5488 |
| [`fail`](../../interface/application.js#L5493) | 5493 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5540) | 5540 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5570) | 5570 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5576) | 5576 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5942) | 5942 |
| [`isWindowsPlatform`](../../interface/application.js#L5945) | 5945 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5949) | 5949 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5952) | 5952 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5956) | 5956 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5973) | 5973 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5977) | 5977 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5997) | 5997 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6024) | 6024 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6073) | 6073 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6081) | 6081 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6092) | 6092 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6096) | 6096 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6108) | 6108 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6119) | 6119 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6146) | 6146 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6150) | 6150 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6154) | 6154 |
| [`getDefaultMountType`](../../interface/application.js#L6167) | 6167 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6170) | 6170 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6175) | 6175 |
| [`initialiseNotesEditor`](../../interface/application.js#L6192) | 6192 |
| [`inlineMarkdown`](../../interface/application.js#L6197) | 6197 |
| [`render`](../../interface/application.js#L6210) | 6210 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6244) | 6244 |
| [`activate`](../../interface/application.js#L6638) | 6638 |
| [`openDeviceModal`](../../interface/application.js#L6719) | 6719 |
| [`syncVmPurpose`](../../interface/application.js#L6767) | 6767 |
| [`clearFieldError`](../../interface/application.js#L6828) | 6828 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6847) | 6847 |
| [`createRackFromDevice`](../../interface/application.js#L6882) | 6882 |
| [`cancelRackFromDevice`](../../interface/application.js#L6890) | 6890 |
| [`createSubnetFromDevice`](../../interface/application.js#L6900) | 6900 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6913) | 6913 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6927) | 6927 |
| [`addCustomLocationOption`](../../interface/application.js#L6939) | 6939 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6979) | 6979 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6991) | 6991 |
| [`finish`](../../interface/application.js#L7011) | 7011 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7036) | 7036 |
| [`finish`](../../interface/application.js#L7050) | 7050 |
| [`handleDeviceSubmit`](../../interface/application.js#L7070) | 7070 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7110) | 7110 |
| [`deleteDevice`](../../interface/application.js#L7259) | 7259 |
| [`personalSafeStorageGet`](../../interface/application.js#L7316) | 7316 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7321) | 7321 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7331) | 7331 |
| [`button`](../../interface/application.js#L7332) | 7332 |
| [`themeChoice`](../../interface/application.js#L7336) | 7336 |
| [`guideLinks`](../../interface/application.js#L7353) | 7353 |
| [`loadSmtpSettings`](../../interface/application.js#L7384) | 7384 |
| [`renderApplicationSettings`](../../interface/application.js#L7399) | 7399 |
| [`syncSmtpForm`](../../interface/application.js#L7403) | 7403 |
| [`updateSmtpFields`](../../interface/application.js#L7425) | 7425 |
| [`hydrateSettings`](../../interface/application.js#L7438) | 7438 |
| [`caffootCompareVersions`](../../interface/application.js#L7460) | 7460 |
| [`parse`](../../interface/application.js#L7461) | 7461 |
| [`caffootShowLicences`](../../interface/application.js#L7483) | 7483 |
| [`caffootUpdateGuide`](../../interface/application.js#L7488) | 7488 |
| [`caffootCheckUpdates`](../../interface/application.js#L7493) | 7493 |
| [`checkInventorySafety`](../../interface/application.js#L7524) | 7524 |
| [`requestInventoryReset`](../../interface/application.js#L7547) | 7547 |
| [`createInventoryBackup`](../../interface/application.js#L7574) | 7574 |
| [`validateBackupVersion`](../../interface/application.js#L7586) | 7586 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7601) | 7601 |
| [`exportData`](../../interface/application.js#L7609) | 7609 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7622) | 7622 |
| [`validateBackupStructure`](../../interface/application.js#L7637) | 7637 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7654) | 7654 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7666) | 7666 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7705) | 7705 |
| [`findRackImportConflicts`](../../interface/application.js#L7709) | 7709 |
| [`place`](../../interface/application.js#L7715) | 7715 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7761) | 7761 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7782) | 7782 |
| [`showBackupImportError`](../../interface/application.js#L7787) | 7787 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7791) | 7791 |
| [`finish`](../../interface/application.js#L7801) | 7801 |
| [`onClick`](../../interface/application.js#L7810) | 7810 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7820) | 7820 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7831) | 7831 |
| [`finish`](../../interface/application.js#L7842) | 7842 |
| [`onClick`](../../interface/application.js#L7851) | 7851 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7866) | 7866 |
| [`importData`](../../interface/application.js#L7882) | 7882 |
| [`reader.onload`](../../interface/application.js#L7892) | 7892 |
| [`reader.onerror`](../../interface/application.js#L7966) | 7966 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8093) | 8093 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8109) | 8109 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8120) | 8120 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8154) | 8154 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8212) | 8212 |
| [`cancel`](../../interface/application.js#L8225) | 8225 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8241) | 8241 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8258) | 8258 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8283) | 8283 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8297) | 8297 |
| [`clearRackDropPreview`](../../interface/application.js#L8300) | 8300 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8305) | 8305 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8317) | 8317 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8323) | 8323 |
| [`trackRackDrag`](../../interface/application.js#L8332) | 8332 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8363) | 8363 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8373) | 8373 |
| [`getRackDropPosition`](../../interface/application.js#L8466) | 8466 |
| [`window.onload`](../../interface/application.js#L8919) | 8919 |
| [`refreshCentralInventory`](../../interface/application.js#L8935) | 8935 |
| [`postInventory`](../../interface/application.js#L8958) | 8958 |
| [`isBlockedAction`](../../interface/application.js#L9010) | 9010 |
| [`applyAllowedControls`](../../interface/application.js#L9043) | 9043 |
| [`enhanceLongSelects`](../../interface/application.js#L9103) | 9103 |
| [`sync`](../../interface/application.js#L9154) | 9154 |
| [`close`](../../interface/application.js#L9160) | 9160 |
| [`choose`](../../interface/application.js#L9164) | 9164 |
| [`draw`](../../interface/application.js#L9169) | 9169 |
| [`open`](../../interface/application.js#L9187) | 9187 |
| [`enhanceSelects`](../../interface/application.js#L9244) | 9244 |
| [`switchTab`](../../interface/application.js#L9290) | 9290 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9301) | 9301 |
| [`openDeviceDetailView`](../../interface/application.js#L9327) | 9327 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9335) | 9335 |
| [`forbidRackMount`](../../interface/application.js#L9394) | 9394 |
| [`openDeviceModal`](../../interface/application.js#L9404) | 9404 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9442) | 9442 |
| [`relatedChanges`](../../interface/application.js#L9448) | 9448 |
| [`saveDevice`](../../interface/application.js#L9459) | 9459 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9495) | 9495 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9496) | 9496 |
| [`nextIpamBridge.save`](../../interface/application.js#L9518) | 9518 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9540) | 9540 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9562) | 9562 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9604) | 9604 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9646) | 9646 |
| [`openDeviceIpamLink`](../../interface/application.js#L9650) | 9650 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9658) | 9658 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9699) | 9699 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9716) | 9716 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9717) | 9717 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9718) | 9718 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9732) | 9732 |
| [`nextResetBridge.reset`](../../interface/application.js#L9763) | 9763 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9790) | 9790 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9817) | 9817 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9825) | 9825 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9834) | 9834 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9835) | 9835 |
| [`nextRackBridge.save`](../../interface/application.js#L9870) | 9870 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9873) | 9873 |
| [`nextRackBridge.persist`](../../interface/application.js#L9876) | 9876 |
| [`reserveForDelete`](../../interface/application.js#L9898) | 9898 |
| [`removeDevice`](../../interface/application.js#L9906) | 9906 |
| [`cancelDelete`](../../interface/application.js#L9932) | 9932 |
| [`saveArchivedInstallation`](../../interface/application.js#L9938) | 9938 |
| [`renderAccountSections`](../../interface/application.js#L9975) | 9975 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10003) | 10003 |
| [`nextRenderAccount`](../../interface/application.js#L10014) | 10014 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10024) | 10024 |
| [`closeEmailVerification`](../../interface/application.js#L10048) | 10048 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10055) | 10055 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10066) | 10066 |
| [`hydrateAccount`](../../interface/application.js#L10120) | 10120 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10158) | 10158 |
| [`loadAccountProfile`](../../interface/application.js#L10171) | 10171 |
| [`removeAccountPhoto`](../../interface/application.js#L10187) | 10187 |
| [`permissionLabel`](../../interface/application.js#L10199) | 10199 |
| [`accountMfaLabel`](../../interface/application.js#L10202) | 10202 |
| [`renderRoleMemberships`](../../interface/application.js#L10205) | 10205 |
| [`renderRoleCatalogue`](../../interface/application.js#L10211) | 10211 |
| [`openRoleLayer`](../../interface/application.js#L10216) | 10216 |
| [`closeRoleLayer`](../../interface/application.js#L10227) | 10227 |
| [`renderRoleDefinition`](../../interface/application.js#L10233) | 10233 |
| [`renderRoleImpact`](../../interface/application.js#L10237) | 10237 |
| [`access`](../../interface/application.js#L10242) | 10242 |
| [`state`](../../interface/application.js#L10246) | 10246 |
| [`requestRoleChange`](../../interface/application.js#L10251) | 10251 |
| [`roleNotificationMessage`](../../interface/application.js#L10258) | 10258 |
| [`previewRoleAction`](../../interface/application.js#L10262) | 10262 |
| [`openRoleEditor`](../../interface/application.js#L10267) | 10267 |
| [`nextRenderUsers`](../../interface/application.js#L10330) | 10330 |
| [`profileFields`](../../interface/application.js#L10332) | 10332 |
| [`stat`](../../interface/application.js#L10353) | 10353 |
| [`bars`](../../interface/application.js#L10356) | 10356 |
| [`operation`](../../interface/application.js#L10412) | 10412 |
| [`filterUserRows`](../../interface/application.js#L10432) | 10432 |
| [`closeUserWorkspace`](../../interface/application.js#L10456) | 10456 |
| [`loadCentralUsers`](../../interface/application.js#L10485) | 10485 |
| [`changeCentralUser`](../../interface/application.js#L10491) | 10491 |
| [`importPanel`](../../interface/application.js#L10502) | 10502 |
| [`cancelImport`](../../interface/application.js#L10506) | 10506 |
| [`nextImportModalClosed`](../../interface/application.js#L10512) | 10512 |
| [`showImportReview`](../../interface/application.js#L10513) | 10513 |
| [`chooseImportFile`](../../interface/application.js#L10553) | 10553 |
| [`actOnImport`](../../interface/application.js#L10570) | 10570 |
| [`showNotification`](../../interface/application.js#L1044) | 1044 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1619) | 1619 |

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
