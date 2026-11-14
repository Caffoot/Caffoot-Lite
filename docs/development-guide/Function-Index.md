# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 770.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`toggleSidebar`](../../interface/application.js#L1142) | 1142 |
| [`switchTab`](../../interface/application.js#L1161) | 1161 |
| [`escapeHtml`](../../interface/application.js#L1188) | 1188 |
| [`inlineJsArg`](../../interface/application.js#L1197) | 1197 |
| [`browserStorageWarning`](../../interface/application.js#L1205) | 1205 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1208) | 1208 |
| [`renderSectionTabIcon`](../../interface/application.js#L1214) | 1214 |
| [`renderSectionHeader`](../../interface/application.js#L1220) | 1220 |
| [`tab`](../../interface/application.js#L1221) | 1221 |
| [`revealSectionTab`](../../interface/application.js#L1248) | 1248 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1255) | 1255 |
| [`renderContent`](../../interface/application.js#L1271) | 1271 |
| [`updateScrollHint`](../../interface/application.js#L1307) | 1307 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1318) | 1318 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1353) | 1353 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1357) | 1357 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1361) | 1361 |
| [`buildInventoryReportData`](../../interface/application.js#L1367) | 1367 |
| [`occupancy`](../../interface/application.js#L1383) | 1383 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1406) | 1406 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1412) | 1412 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1438) | 1438 |
| [`renderDashboardHTML`](../../interface/application.js#L1457) | 1457 |
| [`statusPill`](../../interface/application.js#L1563) | 1563 |
| [`insightSegment`](../../interface/application.js#L1580) | 1580 |
| [`getCategoryIcon`](../../interface/application.js#L1638) | 1638 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1653) | 1653 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1662) | 1662 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1667) | 1667 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1682) | 1682 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1697) | 1697 |
| [`printRackElevation`](../../interface/application.js#L1707) | 1707 |
| [`safe`](../../interface/application.js#L1710) | 1710 |
| [`printRackElevationInFrame`](../../interface/application.js#L1741) | 1741 |
| [`frame.onload`](../../interface/application.js#L1751) | 1751 |
| [`renderRackHubV13`](../../interface/application.js#L1772) | 1772 |
| [`card`](../../interface/application.js#L1777) | 1777 |
| [`mark`](../../interface/application.js#L1786) | 1786 |
| [`bar`](../../interface/application.js#L1802) | 1802 |
| [`chartBox`](../../interface/application.js#L1803) | 1803 |
| [`chartRows`](../../interface/application.js#L1804) | 1804 |
| [`rackSpaceGuide`](../../interface/application.js#L1806) | 1806 |
| [`renderRacksHTML`](../../interface/application.js#L1875) | 1875 |
| [`changeRack`](../../interface/application.js#L1942) | 1942 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1961) | 1961 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1968) | 1968 |
| [`getVisibleDevices`](../../interface/application.js#L1974) | 1974 |
| [`filterHardwareModels`](../../interface/application.js#L1999) | 1999 |
| [`openCatalogueModal`](../../interface/application.js#L2038) | 2038 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2047) | 2047 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2071) | 2071 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2109) | 2109 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2121) | 2121 |
| [`renderCatalogueButton`](../../interface/application.js#L2138) | 2138 |
| [`renderCatalogueRecord`](../../interface/application.js#L2142) | 2142 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2147) | 2147 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2166) | 2166 |
| [`add`](../../interface/application.js#L2168) | 2168 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2213) | 2213 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2220) | 2220 |
| [`openHardwareModelManager`](../../interface/application.js#L2232) | 2232 |
| [`opts`](../../interface/application.js#L2237) | 2237 |
| [`saveHardwareModel`](../../interface/application.js#L2255) | 2255 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2284) | 2284 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2298) | 2298 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2320) | 2320 |
| [`add`](../../interface/application.js#L2322) | 2322 |
| [`options`](../../interface/application.js#L2358) | 2358 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2372) | 2372 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2387) | 2387 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2402) | 2402 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2410) | 2410 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2421) | 2421 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2430) | 2430 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2452) | 2452 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2463) | 2463 |
| [`openServerServiceEditor`](../../interface/application.js#L2480) | 2480 |
| [`saveServerServiceEntry`](../../interface/application.js#L2489) | 2489 |
| [`restoreArchivedServerService`](../../interface/application.js#L2502) | 2502 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2511) | 2511 |
| [`renderDevicesHTML`](../../interface/application.js#L2523) | 2523 |
| [`renderHardwareMetric`](../../interface/application.js#L2531) | 2531 |
| [`renderHardwareChart`](../../interface/application.js#L2536) | 2536 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2546) | 2546 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2565) | 2565 |
| [`renderArchivedSoftware`](../../interface/application.js#L2573) | 2573 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2608) | 2608 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2615) | 2615 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2616) | 2616 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2617) | 2617 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2620) | 2620 |
| [`openManageTypesModal`](../../interface/application.js#L2636) | 2636 |
| [`openManageLocationsModal`](../../interface/application.js#L2637) | 2637 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2640) | 2640 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2662) | 2662 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2669) | 2669 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2677) | 2677 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2697) | 2697 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2698) | 2698 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2699) | 2699 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2714) | 2714 |
| [`deleteDeviceType`](../../interface/application.js#L2734) | 2734 |
| [`deleteDeviceLocation`](../../interface/application.js#L2735) | 2735 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2743) | 2743 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2747) | 2747 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2774) | 2774 |
| [`nodes`](../../interface/application.js#L2784) | 2784 |
| [`renderIpamManage`](../../interface/application.js#L2810) | 2810 |
| [`renderIpamHTML`](../../interface/application.js#L2861) | 2861 |
| [`changeSubnet`](../../interface/application.js#L3022) | 3022 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3035) | 3035 |
| [`openIpamModal`](../../interface/application.js#L3061) | 3061 |
| [`openBulkIpModal`](../../interface/application.js#L3066) | 3066 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3073) | 3073 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3077) | 3077 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3096) | 3096 |
| [`applyBulkIpChanges`](../../interface/application.js#L3112) | 3112 |
| [`subnetCidrFeedback`](../../interface/application.js#L3126) | 3126 |
| [`suggestSubnetGateway`](../../interface/application.js#L3144) | 3144 |
| [`openSubnetModal`](../../interface/application.js#L3172) | 3172 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3176) | 3176 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3202) | 3202 |
| [`handleSubnetSubmit`](../../interface/application.js#L3222) | 3222 |
| [`showSubnetFormError`](../../interface/application.js#L3429) | 3429 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3445) | 3445 |
| [`subnetNameConflicts`](../../interface/application.js#L3459) | 3459 |
| [`subnetHasVlan`](../../interface/application.js#L3466) | 3466 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3469) | 3469 |
| [`openMultipleSubnets`](../../interface/application.js#L3477) | 3477 |
| [`option`](../../interface/application.js#L3479) | 3479 |
| [`visibility`](../../interface/application.js#L3484) | 3484 |
| [`planningVisibility`](../../interface/application.js#L3488) | 3488 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3506) | 3506 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3518) | 3518 |
| [`read`](../../interface/application.js#L3520) | 3520 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3538) | 3538 |
| [`reject`](../../interface/application.js#L3540) | 3540 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3577) | 3577 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3581) | 3581 |
| [`add`](../../interface/application.js#L3584) | 3584 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3611) | 3611 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3619) | 3619 |
| [`field`](../../interface/application.js#L3622) | 3622 |
| [`capture`](../../interface/application.js#L3632) | 3632 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3666) | 3666 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3670) | 3670 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3676) | 3676 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3697) | 3697 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3701) | 3701 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3705) | 3705 |
| [`deleteSubnet`](../../interface/application.js#L3716) | 3716 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3776) | 3776 |
| [`deleteSubnetCommit`](../../interface/application.js#L3804) | 3804 |
| [`deleteVlan`](../../interface/application.js#L3834) | 3834 |
| [`openIpModal`](../../interface/application.js#L3860) | 3860 |
| [`handleIpSubmit`](../../interface/application.js#L3877) | 3877 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3943) | 3943 |
| [`modalFormSnapshot`](../../interface/application.js#L3953) | 3953 |
| [`rememberModalForm`](../../interface/application.js#L3958) | 3958 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3963) | 3963 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3982) | 3982 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4001) | 4001 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4010) | 4010 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4016) | 4016 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4022) | 4022 |
| [`closeModal`](../../interface/application.js#L4031) | 4031 |
| [`openModal`](../../interface/application.js#L4058) | 4058 |
| [`readRackDimension`](../../interface/application.js#L4131) | 4131 |
| [`formatRackDimension`](../../interface/application.js#L4138) | 4138 |
| [`rackPhysicalDetails`](../../interface/application.js#L4143) | 4143 |
| [`openRackModal`](../../interface/application.js#L4152) | 4152 |
| [`handleRackSubmit`](../../interface/application.js#L4168) | 4168 |
| [`deleteRack`](../../interface/application.js#L4235) | 4235 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4257) | 4257 |
| [`refresh`](../../interface/application.js#L4280) | 4280 |
| [`openAssignDeviceModal`](../../interface/application.js#L4357) | 4357 |
| [`refresh`](../../interface/application.js#L4374) | 4374 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4381) | 4381 |
| [`handleAssignSubmit`](../../interface/application.js#L4415) | 4415 |
| [`unassignDevice`](../../interface/application.js#L4460) | 4460 |
| [`getSubnetForIp`](../../interface/application.js#L4477) | 4477 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4481) | 4481 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4528) | 4528 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4537) | 4537 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4546) | 4546 |
| [`inside`](../../interface/application.js#L4553) | 4553 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4571) | 4571 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4580) | 4580 |
| [`toggleDeviceMountType`](../../interface/application.js#L4624) | 4624 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4648) | 4648 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4653) | 4653 |
| [`openDeviceReviewModal`](../../interface/application.js#L4671) | 4671 |
| [`openDeviceDetailView`](../../interface/application.js#L4676) | 4676 |
| [`safe`](../../interface/application.js#L4686) | 4686 |
| [`field`](../../interface/application.js#L4687) | 4687 |
| [`section`](../../interface/application.js#L4688) | 4688 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4733) | 4733 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4739) | 4739 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4758) | 4758 |
| [`navigateToDeviceRack`](../../interface/application.js#L4774) | 4774 |
| [`duplicateDevice`](../../interface/application.js#L4802) | 4802 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4872) | 4872 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4877) | 4877 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4882) | 4882 |
| [`openServerServiceManager`](../../interface/application.js#L4883) | 4883 |
| [`captureServerServiceSelections`](../../interface/application.js#L4888) | 4888 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4894) | 4894 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4915) | 4915 |
| [`archiveServerService`](../../interface/application.js#L4923) | 4923 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4947) | 4947 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4951) | 4951 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4969) | 4969 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4973) | 4973 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4976) | 4976 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4983) | 4983 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5011) | 5011 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5015) | 5015 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5060) | 5060 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5094) | 5094 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5111) | 5111 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5114) | 5114 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5115) | 5115 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5120) | 5120 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5126) | 5126 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5163) | 5163 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5164) | 5164 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5171) | 5171 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5172) | 5172 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5187) | 5187 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5193) | 5193 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5216) | 5216 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5232) | 5232 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5235) | 5235 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5244) | 5244 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5255) | 5255 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5264) | 5264 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5267) | 5267 |
| [`isSoftwareDetailField`](../../interface/application.js#L5274) | 5274 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5282) | 5282 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5291) | 5291 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5297) | 5297 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5309) | 5309 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5349) | 5349 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5377) | 5377 |
| [`updateInlinePickerCount`](../../interface/application.js#L5386) | 5386 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5392) | 5392 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5405) | 5405 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5414) | 5414 |
| [`fail`](../../interface/application.js#L5420) | 5420 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5474) | 5474 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5490) | 5490 |
| [`fail`](../../interface/application.js#L5495) | 5495 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5542) | 5542 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5572) | 5572 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5578) | 5578 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5944) | 5944 |
| [`isWindowsPlatform`](../../interface/application.js#L5947) | 5947 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L5951) | 5951 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L5954) | 5954 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L5958) | 5958 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L5975) | 5975 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L5979) | 5979 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5999) | 5999 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6026) | 6026 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6075) | 6075 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6083) | 6083 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6094) | 6094 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6098) | 6098 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6110) | 6110 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6121) | 6121 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6148) | 6148 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6152) | 6152 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6156) | 6156 |
| [`getDefaultMountType`](../../interface/application.js#L6169) | 6169 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6172) | 6172 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6177) | 6177 |
| [`initialiseNotesEditor`](../../interface/application.js#L6194) | 6194 |
| [`inlineMarkdown`](../../interface/application.js#L6199) | 6199 |
| [`render`](../../interface/application.js#L6212) | 6212 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6246) | 6246 |
| [`activate`](../../interface/application.js#L6640) | 6640 |
| [`openDeviceModal`](../../interface/application.js#L6721) | 6721 |
| [`syncVmPurpose`](../../interface/application.js#L6769) | 6769 |
| [`clearFieldError`](../../interface/application.js#L6830) | 6830 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6849) | 6849 |
| [`createRackFromDevice`](../../interface/application.js#L6884) | 6884 |
| [`cancelRackFromDevice`](../../interface/application.js#L6892) | 6892 |
| [`createSubnetFromDevice`](../../interface/application.js#L6902) | 6902 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L6915) | 6915 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L6929) | 6929 |
| [`addCustomLocationOption`](../../interface/application.js#L6941) | 6941 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6981) | 6981 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6993) | 6993 |
| [`finish`](../../interface/application.js#L7013) | 7013 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7038) | 7038 |
| [`finish`](../../interface/application.js#L7052) | 7052 |
| [`handleDeviceSubmit`](../../interface/application.js#L7072) | 7072 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7112) | 7112 |
| [`deleteDevice`](../../interface/application.js#L7261) | 7261 |
| [`personalSafeStorageGet`](../../interface/application.js#L7318) | 7318 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7323) | 7323 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7333) | 7333 |
| [`button`](../../interface/application.js#L7334) | 7334 |
| [`themeChoice`](../../interface/application.js#L7338) | 7338 |
| [`guideLinks`](../../interface/application.js#L7355) | 7355 |
| [`loadSmtpSettings`](../../interface/application.js#L7386) | 7386 |
| [`renderApplicationSettings`](../../interface/application.js#L7401) | 7401 |
| [`syncSmtpForm`](../../interface/application.js#L7405) | 7405 |
| [`updateSmtpFields`](../../interface/application.js#L7427) | 7427 |
| [`hydrateSettings`](../../interface/application.js#L7440) | 7440 |
| [`caffootCompareVersions`](../../interface/application.js#L7462) | 7462 |
| [`parse`](../../interface/application.js#L7463) | 7463 |
| [`caffootShowLicences`](../../interface/application.js#L7485) | 7485 |
| [`caffootUpdateGuide`](../../interface/application.js#L7490) | 7490 |
| [`caffootCheckUpdates`](../../interface/application.js#L7495) | 7495 |
| [`checkInventorySafety`](../../interface/application.js#L7526) | 7526 |
| [`requestInventoryReset`](../../interface/application.js#L7549) | 7549 |
| [`createInventoryBackup`](../../interface/application.js#L7576) | 7576 |
| [`validateBackupVersion`](../../interface/application.js#L7588) | 7588 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7603) | 7603 |
| [`exportData`](../../interface/application.js#L7611) | 7611 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7624) | 7624 |
| [`validateBackupStructure`](../../interface/application.js#L7639) | 7639 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7656) | 7656 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7668) | 7668 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7707) | 7707 |
| [`findRackImportConflicts`](../../interface/application.js#L7711) | 7711 |
| [`place`](../../interface/application.js#L7717) | 7717 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7763) | 7763 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7784) | 7784 |
| [`showBackupImportError`](../../interface/application.js#L7789) | 7789 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7793) | 7793 |
| [`finish`](../../interface/application.js#L7803) | 7803 |
| [`onClick`](../../interface/application.js#L7812) | 7812 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7822) | 7822 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7833) | 7833 |
| [`finish`](../../interface/application.js#L7844) | 7844 |
| [`onClick`](../../interface/application.js#L7853) | 7853 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7868) | 7868 |
| [`importData`](../../interface/application.js#L7884) | 7884 |
| [`reader.onload`](../../interface/application.js#L7894) | 7894 |
| [`reader.onerror`](../../interface/application.js#L7968) | 7968 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8095) | 8095 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8111) | 8111 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8122) | 8122 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8156) | 8156 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8214) | 8214 |
| [`cancel`](../../interface/application.js#L8227) | 8227 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8243) | 8243 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8260) | 8260 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8285) | 8285 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8299) | 8299 |
| [`clearRackDropPreview`](../../interface/application.js#L8302) | 8302 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8307) | 8307 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8319) | 8319 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8325) | 8325 |
| [`trackRackDrag`](../../interface/application.js#L8334) | 8334 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8365) | 8365 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8375) | 8375 |
| [`getRackDropPosition`](../../interface/application.js#L8468) | 8468 |
| [`window.onload`](../../interface/application.js#L8921) | 8921 |
| [`refreshCentralInventory`](../../interface/application.js#L8937) | 8937 |
| [`postInventory`](../../interface/application.js#L8960) | 8960 |
| [`isBlockedAction`](../../interface/application.js#L9012) | 9012 |
| [`applyAllowedControls`](../../interface/application.js#L9045) | 9045 |
| [`enhanceLongSelects`](../../interface/application.js#L9105) | 9105 |
| [`sync`](../../interface/application.js#L9156) | 9156 |
| [`close`](../../interface/application.js#L9162) | 9162 |
| [`choose`](../../interface/application.js#L9166) | 9166 |
| [`draw`](../../interface/application.js#L9171) | 9171 |
| [`open`](../../interface/application.js#L9189) | 9189 |
| [`enhanceSelects`](../../interface/application.js#L9246) | 9246 |
| [`switchTab`](../../interface/application.js#L9292) | 9292 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9303) | 9303 |
| [`openDeviceDetailView`](../../interface/application.js#L9329) | 9329 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9337) | 9337 |
| [`forbidRackMount`](../../interface/application.js#L9396) | 9396 |
| [`openDeviceModal`](../../interface/application.js#L9406) | 9406 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9444) | 9444 |
| [`relatedChanges`](../../interface/application.js#L9450) | 9450 |
| [`saveDevice`](../../interface/application.js#L9461) | 9461 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9497) | 9497 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9498) | 9498 |
| [`nextIpamBridge.save`](../../interface/application.js#L9520) | 9520 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9542) | 9542 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9564) | 9564 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9606) | 9606 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9648) | 9648 |
| [`openDeviceIpamLink`](../../interface/application.js#L9652) | 9652 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9660) | 9660 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9701) | 9701 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9718) | 9718 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9719) | 9719 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9720) | 9720 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9734) | 9734 |
| [`nextResetBridge.reset`](../../interface/application.js#L9765) | 9765 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L9792) | 9792 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L9819) | 9819 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L9827) | 9827 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L9836) | 9836 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L9837) | 9837 |
| [`nextRackBridge.save`](../../interface/application.js#L9872) | 9872 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L9875) | 9875 |
| [`nextRackBridge.persist`](../../interface/application.js#L9878) | 9878 |
| [`reserveForDelete`](../../interface/application.js#L9900) | 9900 |
| [`removeDevice`](../../interface/application.js#L9908) | 9908 |
| [`cancelDelete`](../../interface/application.js#L9934) | 9934 |
| [`saveArchivedInstallation`](../../interface/application.js#L9940) | 9940 |
| [`renderAccountSections`](../../interface/application.js#L9977) | 9977 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10005) | 10005 |
| [`nextRenderAccount`](../../interface/application.js#L10016) | 10016 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10026) | 10026 |
| [`closeEmailVerification`](../../interface/application.js#L10050) | 10050 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10057) | 10057 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10068) | 10068 |
| [`hydrateAccount`](../../interface/application.js#L10122) | 10122 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10160) | 10160 |
| [`loadAccountProfile`](../../interface/application.js#L10173) | 10173 |
| [`removeAccountPhoto`](../../interface/application.js#L10189) | 10189 |
| [`permissionLabel`](../../interface/application.js#L10201) | 10201 |
| [`accountMfaLabel`](../../interface/application.js#L10204) | 10204 |
| [`renderRoleMemberships`](../../interface/application.js#L10207) | 10207 |
| [`renderRoleCatalogue`](../../interface/application.js#L10213) | 10213 |
| [`openRoleLayer`](../../interface/application.js#L10218) | 10218 |
| [`closeRoleLayer`](../../interface/application.js#L10229) | 10229 |
| [`renderRoleDefinition`](../../interface/application.js#L10235) | 10235 |
| [`renderRoleImpact`](../../interface/application.js#L10239) | 10239 |
| [`access`](../../interface/application.js#L10244) | 10244 |
| [`state`](../../interface/application.js#L10248) | 10248 |
| [`requestRoleChange`](../../interface/application.js#L10253) | 10253 |
| [`roleNotificationMessage`](../../interface/application.js#L10260) | 10260 |
| [`previewRoleAction`](../../interface/application.js#L10264) | 10264 |
| [`openRoleEditor`](../../interface/application.js#L10269) | 10269 |
| [`nextRenderUsers`](../../interface/application.js#L10332) | 10332 |
| [`profileFields`](../../interface/application.js#L10334) | 10334 |
| [`stat`](../../interface/application.js#L10355) | 10355 |
| [`bars`](../../interface/application.js#L10358) | 10358 |
| [`operation`](../../interface/application.js#L10414) | 10414 |
| [`filterUserRows`](../../interface/application.js#L10434) | 10434 |
| [`closeUserWorkspace`](../../interface/application.js#L10458) | 10458 |
| [`loadCentralUsers`](../../interface/application.js#L10487) | 10487 |
| [`changeCentralUser`](../../interface/application.js#L10493) | 10493 |
| [`importPanel`](../../interface/application.js#L10504) | 10504 |
| [`cancelImport`](../../interface/application.js#L10508) | 10508 |
| [`nextImportModalClosed`](../../interface/application.js#L10514) | 10514 |
| [`showImportReview`](../../interface/application.js#L10515) | 10515 |
| [`chooseImportFile`](../../interface/application.js#L10555) | 10555 |
| [`actOnImport`](../../interface/application.js#L10572) | 10572 |
| [`showNotification`](../../interface/application.js#L1044) | 1044 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1621) | 1621 |

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
| [`validate_public_origin`](../../backend/server.py#L86) | 86 |
| [`connect`](../../backend/server.py#L104) | 104 |
| [`initialise_database`](../../backend/server.py#L112) | 112 |
| [`Handler.end_headers`](../../backend/server.py#L118) | 118 |
| [`Handler.do_GET`](../../backend/server.py#L125) | 125 |
| [`Handler.do_POST`](../../backend/server.py#L468) | 468 |
| [`Handler.handle_directory_request`](../../backend/server.py#L645) | 645 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L712) | 712 |
| [`Handler.handle_role_change`](../../backend/server.py#L755) | 755 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L797) | 797 |
| [`Handler.handle_account_email`](../../backend/server.py#L1189) | 1189 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1269) | 1269 |
| [`Handler.handle_import`](../../backend/server.py#L1300) | 1300 |
| [`Handler.respond`](../../backend/server.py#L1376) | 1376 |
| [`main`](../../backend/server.py#L1389) | 1389 |

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
| [`read_department`](../../backend/staff_directory.py#L62) | 62 |
| [`list_directory`](../../backend/staff_directory.py#L67) | 67 |
| [`_validate_staff`](../../backend/staff_directory.py#L81) | 81 |
| [`_create_login`](../../backend/staff_directory.py#L98) | 98 |
| [`save_staff_member`](../../backend/staff_directory.py#L113) | 113 |
| [`save_department`](../../backend/staff_directory.py#L157) | 157 |

## backend/staff_identity.py

| Function | Line |
| --- | ---: |
| [`link_account_staff`](../../backend/staff_identity.py#L4) | 4 |
