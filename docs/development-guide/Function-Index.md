# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the indexed application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 1173.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`returnToExistingSignIn`](../../interface/loader.js#L8) | 8 |
| [`renderInterfaceTemplate`](../../interface/loader.js#L38) | 38 |
| [`loadInterfaceText`](../../interface/loader.js#L46) | 46 |
| [`initialiseInterface`](../../interface/loader.js#L51) | 51 |
| [`staffScript.onerror`](../../interface/loader.js#L83) | 83 |
| [`staffScript.onload`](../../interface/loader.js#L84) | 84 |
| [`script.onerror`](../../interface/loader.js#L87) | 87 |
| [`script.onload`](../../interface/loader.js#L88) | 88 |
| [`stockScript.onerror`](../../interface/loader.js#L91) | 91 |
| [`stockScript.onload`](../../interface/loader.js#L92) | 92 |
| [`supplierScript.onerror`](../../interface/loader.js#L95) | 95 |
| [`supplierScript.onload`](../../interface/loader.js#L96) | 96 |
| [`loadApplication`](../../interface/loader.js#L99) | 99 |
| [`applicationScript.onerror`](../../interface/loader.js#L102) | 102 |
| [`showInterfaceLoadError`](../../interface/loader.js#L111) | 111 |

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
| [`escapeHtml`](../../interface/application.js#L1194) | 1194 |
| [`inlineJsArg`](../../interface/application.js#L1203) | 1203 |
| [`browserStorageWarning`](../../interface/application.js#L1211) | 1211 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1214) | 1214 |
| [`renderSectionTabIcon`](../../interface/application.js#L1220) | 1220 |
| [`renderSectionHeader`](../../interface/application.js#L1226) | 1226 |
| [`tab`](../../interface/application.js#L1227) | 1227 |
| [`revealSectionTab`](../../interface/application.js#L1254) | 1254 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1261) | 1261 |
| [`renderContent`](../../interface/application.js#L1281) | 1281 |
| [`updateScrollHint`](../../interface/application.js#L1329) | 1329 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1340) | 1340 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1375) | 1375 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1379) | 1379 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1383) | 1383 |
| [`buildInventoryReportData`](../../interface/application.js#L1389) | 1389 |
| [`occupancy`](../../interface/application.js#L1405) | 1405 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1428) | 1428 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1434) | 1434 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1460) | 1460 |
| [`renderDashboardHTML`](../../interface/application.js#L1479) | 1479 |
| [`statusPill`](../../interface/application.js#L1585) | 1585 |
| [`insightSegment`](../../interface/application.js#L1602) | 1602 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1643) | 1643 |
| [`getCategoryIcon`](../../interface/application.js#L1660) | 1660 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1675) | 1675 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1684) | 1684 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1689) | 1689 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1704) | 1704 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1719) | 1719 |
| [`printRackElevation`](../../interface/application.js#L1729) | 1729 |
| [`safe`](../../interface/application.js#L1732) | 1732 |
| [`printRackElevationInFrame`](../../interface/application.js#L1763) | 1763 |
| [`frame.onload`](../../interface/application.js#L1773) | 1773 |
| [`renderRackHubV13`](../../interface/application.js#L1794) | 1794 |
| [`card`](../../interface/application.js#L1799) | 1799 |
| [`mark`](../../interface/application.js#L1808) | 1808 |
| [`bar`](../../interface/application.js#L1824) | 1824 |
| [`chartBox`](../../interface/application.js#L1825) | 1825 |
| [`chartRows`](../../interface/application.js#L1826) | 1826 |
| [`rackSpaceGuide`](../../interface/application.js#L1828) | 1828 |
| [`renderRacksHTML`](../../interface/application.js#L1897) | 1897 |
| [`changeRack`](../../interface/application.js#L1964) | 1964 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1983) | 1983 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1990) | 1990 |
| [`getVisibleDevices`](../../interface/application.js#L1996) | 1996 |
| [`filterHardwareModels`](../../interface/application.js#L2021) | 2021 |
| [`openCatalogueModal`](../../interface/application.js#L2060) | 2060 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2069) | 2069 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2093) | 2093 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2131) | 2131 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2143) | 2143 |
| [`renderCatalogueButton`](../../interface/application.js#L2160) | 2160 |
| [`renderCatalogueRecord`](../../interface/application.js#L2164) | 2164 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2169) | 2169 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2188) | 2188 |
| [`add`](../../interface/application.js#L2190) | 2190 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2235) | 2235 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2242) | 2242 |
| [`openHardwareModelManager`](../../interface/application.js#L2254) | 2254 |
| [`opts`](../../interface/application.js#L2259) | 2259 |
| [`saveHardwareModel`](../../interface/application.js#L2277) | 2277 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2306) | 2306 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2320) | 2320 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2342) | 2342 |
| [`add`](../../interface/application.js#L2344) | 2344 |
| [`options`](../../interface/application.js#L2380) | 2380 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2394) | 2394 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2409) | 2409 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2424) | 2424 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2432) | 2432 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2443) | 2443 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2452) | 2452 |
| [`option`](../../interface/application.js#L2459) | 2459 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2474) | 2474 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2485) | 2485 |
| [`openServerServiceEditor`](../../interface/application.js#L2502) | 2502 |
| [`saveServerServiceEntry`](../../interface/application.js#L2511) | 2511 |
| [`restoreArchivedServerService`](../../interface/application.js#L2524) | 2524 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2533) | 2533 |
| [`renderDevicesHTML`](../../interface/application.js#L2545) | 2545 |
| [`renderHardwareMetric`](../../interface/application.js#L2553) | 2553 |
| [`renderHardwareChart`](../../interface/application.js#L2558) | 2558 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2568) | 2568 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2587) | 2587 |
| [`renderArchivedSoftware`](../../interface/application.js#L2595) | 2595 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2630) | 2630 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2637) | 2637 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2638) | 2638 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2639) | 2639 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2642) | 2642 |
| [`openManageTypesModal`](../../interface/application.js#L2658) | 2658 |
| [`openManageLocationsModal`](../../interface/application.js#L2659) | 2659 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2662) | 2662 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2684) | 2684 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2691) | 2691 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2699) | 2699 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2719) | 2719 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2720) | 2720 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2721) | 2721 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2736) | 2736 |
| [`deleteDeviceType`](../../interface/application.js#L2756) | 2756 |
| [`deleteDeviceLocation`](../../interface/application.js#L2757) | 2757 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2765) | 2765 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2769) | 2769 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2796) | 2796 |
| [`nodes`](../../interface/application.js#L2806) | 2806 |
| [`renderIpamManage`](../../interface/application.js#L2832) | 2832 |
| [`renderIpamHTML`](../../interface/application.js#L2883) | 2883 |
| [`changeSubnet`](../../interface/application.js#L3044) | 3044 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3057) | 3057 |
| [`openIpamModal`](../../interface/application.js#L3083) | 3083 |
| [`openBulkIpModal`](../../interface/application.js#L3088) | 3088 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3095) | 3095 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3099) | 3099 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3118) | 3118 |
| [`applyBulkIpChanges`](../../interface/application.js#L3134) | 3134 |
| [`subnetCidrFeedback`](../../interface/application.js#L3148) | 3148 |
| [`suggestSubnetGateway`](../../interface/application.js#L3166) | 3166 |
| [`openSubnetModal`](../../interface/application.js#L3194) | 3194 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3198) | 3198 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3224) | 3224 |
| [`handleSubnetSubmit`](../../interface/application.js#L3244) | 3244 |
| [`showSubnetFormError`](../../interface/application.js#L3451) | 3451 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3467) | 3467 |
| [`subnetNameConflicts`](../../interface/application.js#L3481) | 3481 |
| [`subnetHasVlan`](../../interface/application.js#L3488) | 3488 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3491) | 3491 |
| [`openMultipleSubnets`](../../interface/application.js#L3499) | 3499 |
| [`visibility`](../../interface/application.js#L3506) | 3506 |
| [`planningVisibility`](../../interface/application.js#L3510) | 3510 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3528) | 3528 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3540) | 3540 |
| [`read`](../../interface/application.js#L3542) | 3542 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3560) | 3560 |
| [`reject`](../../interface/application.js#L3562) | 3562 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3599) | 3599 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3603) | 3603 |
| [`add`](../../interface/application.js#L3606) | 3606 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3633) | 3633 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3641) | 3641 |
| [`field`](../../interface/application.js#L3644) | 3644 |
| [`capture`](../../interface/application.js#L3654) | 3654 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3688) | 3688 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3692) | 3692 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3698) | 3698 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3719) | 3719 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3723) | 3723 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3727) | 3727 |
| [`deleteSubnet`](../../interface/application.js#L3738) | 3738 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3798) | 3798 |
| [`deleteSubnetCommit`](../../interface/application.js#L3826) | 3826 |
| [`deleteVlan`](../../interface/application.js#L3856) | 3856 |
| [`openIpModal`](../../interface/application.js#L3882) | 3882 |
| [`handleIpSubmit`](../../interface/application.js#L3899) | 3899 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3965) | 3965 |
| [`modalFormSnapshot`](../../interface/application.js#L3975) | 3975 |
| [`stockFormHasChanges`](../../interface/application.js#L3980) | 3980 |
| [`rememberModalForm`](../../interface/application.js#L3984) | 3984 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3989) | 3989 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L4019) | 4019 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4038) | 4038 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4047) | 4047 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4053) | 4053 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4059) | 4059 |
| [`closeModal`](../../interface/application.js#L4068) | 4068 |
| [`openModal`](../../interface/application.js#L4106) | 4106 |
| [`readRackDimension`](../../interface/application.js#L4179) | 4179 |
| [`formatRackDimension`](../../interface/application.js#L4186) | 4186 |
| [`rackPhysicalDetails`](../../interface/application.js#L4191) | 4191 |
| [`openRackModal`](../../interface/application.js#L4200) | 4200 |
| [`handleRackSubmit`](../../interface/application.js#L4216) | 4216 |
| [`deleteRack`](../../interface/application.js#L4283) | 4283 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4305) | 4305 |
| [`refresh`](../../interface/application.js#L4328) | 4328 |
| [`openAssignDeviceModal`](../../interface/application.js#L4405) | 4405 |
| [`refresh`](../../interface/application.js#L4422) | 4422 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4429) | 4429 |
| [`handleAssignSubmit`](../../interface/application.js#L4463) | 4463 |
| [`unassignDevice`](../../interface/application.js#L4508) | 4508 |
| [`getSubnetForIp`](../../interface/application.js#L4525) | 4525 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4529) | 4529 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4576) | 4576 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4585) | 4585 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4594) | 4594 |
| [`inside`](../../interface/application.js#L4601) | 4601 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4619) | 4619 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4628) | 4628 |
| [`toggleDeviceMountType`](../../interface/application.js#L4672) | 4672 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4696) | 4696 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4701) | 4701 |
| [`openDeviceReviewModal`](../../interface/application.js#L4719) | 4719 |
| [`openDeviceDetailView`](../../interface/application.js#L4724) | 4724 |
| [`safe`](../../interface/application.js#L4734) | 4734 |
| [`field`](../../interface/application.js#L4735) | 4735 |
| [`section`](../../interface/application.js#L4736) | 4736 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4781) | 4781 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4787) | 4787 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4806) | 4806 |
| [`navigateToDeviceRack`](../../interface/application.js#L4824) | 4824 |
| [`duplicateDevice`](../../interface/application.js#L4852) | 4852 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4922) | 4922 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4927) | 4927 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4932) | 4932 |
| [`openServerServiceManager`](../../interface/application.js#L4933) | 4933 |
| [`captureServerServiceSelections`](../../interface/application.js#L4938) | 4938 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4944) | 4944 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4965) | 4965 |
| [`archiveServerService`](../../interface/application.js#L4973) | 4973 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4999) | 4999 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L5003) | 5003 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L5021) | 5021 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L5025) | 5025 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L5028) | 5028 |
| [`updateHardwareCatalogue`](../../interface/application.js#L5035) | 5035 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5063) | 5063 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5067) | 5067 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5112) | 5112 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5146) | 5146 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5163) | 5163 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5166) | 5166 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5167) | 5167 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5172) | 5172 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5178) | 5178 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5216) | 5216 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5217) | 5217 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5224) | 5224 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5225) | 5225 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5240) | 5240 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5246) | 5246 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5269) | 5269 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5285) | 5285 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5288) | 5288 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5297) | 5297 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5308) | 5308 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5317) | 5317 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5320) | 5320 |
| [`isSoftwareDetailField`](../../interface/application.js#L5327) | 5327 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5335) | 5335 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5344) | 5344 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5350) | 5350 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5362) | 5362 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5402) | 5402 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5430) | 5430 |
| [`updateInlinePickerCount`](../../interface/application.js#L5439) | 5439 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5445) | 5445 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5458) | 5458 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5467) | 5467 |
| [`fail`](../../interface/application.js#L5473) | 5473 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5527) | 5527 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5543) | 5543 |
| [`fail`](../../interface/application.js#L5548) | 5548 |
| [`serverStorageField`](../../interface/application.js#L5595) | 5595 |
| [`renderServerStorageFields`](../../interface/application.js#L5600) | 5600 |
| [`renderServerStorageFields.action`](../../interface/application.js#L5603) | 5603 |
| [`captureServerStorageValues`](../../interface/application.js#L5615) | 5615 |
| [`refreshServerStorageControls`](../../interface/application.js#L5635) | 5635 |
| [`updateServerStorage`](../../interface/application.js#L5645) | 5645 |
| [`updateServerStorage.vdev`](../../interface/application.js#L5649) | 5649 |
| [`serverStorageDetailRows`](../../interface/application.js#L5657) | 5657 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5667) | 5667 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5697) | 5697 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5703) | 5703 |
| [`getPlatformVersionOptions`](../../interface/application.js#L6069) | 6069 |
| [`isWindowsPlatform`](../../interface/application.js#L6072) | 6072 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L6076) | 6076 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L6079) | 6079 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L6083) | 6083 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L6100) | 6100 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L6104) | 6104 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6124) | 6124 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6151) | 6151 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6200) | 6200 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6208) | 6208 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6219) | 6219 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6223) | 6223 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6235) | 6235 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6247) | 6247 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6274) | 6274 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6278) | 6278 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6282) | 6282 |
| [`getDefaultMountType`](../../interface/application.js#L6295) | 6295 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6298) | 6298 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6303) | 6303 |
| [`initialiseNotesEditor`](../../interface/application.js#L6320) | 6320 |
| [`inlineMarkdown`](../../interface/application.js#L6325) | 6325 |
| [`render`](../../interface/application.js#L6338) | 6338 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6372) | 6372 |
| [`activate`](../../interface/application.js#L6766) | 6766 |
| [`openDeviceModal`](../../interface/application.js#L6847) | 6847 |
| [`syncVmPurpose`](../../interface/application.js#L6895) | 6895 |
| [`clearFieldError`](../../interface/application.js#L6956) | 6956 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6975) | 6975 |
| [`createRackFromDevice`](../../interface/application.js#L7011) | 7011 |
| [`cancelRackFromDevice`](../../interface/application.js#L7019) | 7019 |
| [`createSubnetFromDevice`](../../interface/application.js#L7029) | 7029 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L7042) | 7042 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L7056) | 7056 |
| [`addCustomLocationOption`](../../interface/application.js#L7068) | 7068 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L7108) | 7108 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7120) | 7120 |
| [`finish`](../../interface/application.js#L7140) | 7140 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7165) | 7165 |
| [`finish`](../../interface/application.js#L7179) | 7179 |
| [`handleDeviceSubmit`](../../interface/application.js#L7199) | 7199 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7239) | 7239 |
| [`deleteDevice`](../../interface/application.js#L7388) | 7388 |
| [`personalSafeStorageGet`](../../interface/application.js#L7445) | 7445 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7450) | 7450 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7460) | 7460 |
| [`button`](../../interface/application.js#L7461) | 7461 |
| [`themeChoice`](../../interface/application.js#L7465) | 7465 |
| [`guideLinks`](../../interface/application.js#L7482) | 7482 |
| [`loadSmtpSettings`](../../interface/application.js#L7513) | 7513 |
| [`renderApplicationSettings`](../../interface/application.js#L7528) | 7528 |
| [`syncSmtpForm`](../../interface/application.js#L7532) | 7532 |
| [`updateSmtpFields`](../../interface/application.js#L7554) | 7554 |
| [`hydrateSettings`](../../interface/application.js#L7567) | 7567 |
| [`caffootCompareVersions`](../../interface/application.js#L7589) | 7589 |
| [`parse`](../../interface/application.js#L7590) | 7590 |
| [`caffootShowLicences`](../../interface/application.js#L7612) | 7612 |
| [`caffootUpdateGuide`](../../interface/application.js#L7617) | 7617 |
| [`caffootCheckUpdates`](../../interface/application.js#L7622) | 7622 |
| [`checkInventorySafety`](../../interface/application.js#L7653) | 7653 |
| [`requestInventoryReset`](../../interface/application.js#L7676) | 7676 |
| [`createInventoryBackup`](../../interface/application.js#L7703) | 7703 |
| [`validateBackupVersion`](../../interface/application.js#L7715) | 7715 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7730) | 7730 |
| [`exportData`](../../interface/application.js#L7738) | 7738 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7751) | 7751 |
| [`validateBackupStructure`](../../interface/application.js#L7766) | 7766 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7783) | 7783 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7795) | 7795 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7834) | 7834 |
| [`findRackImportConflicts`](../../interface/application.js#L7838) | 7838 |
| [`place`](../../interface/application.js#L7844) | 7844 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7890) | 7890 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7911) | 7911 |
| [`showBackupImportError`](../../interface/application.js#L7916) | 7916 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7920) | 7920 |
| [`finish`](../../interface/application.js#L7930) | 7930 |
| [`onClick`](../../interface/application.js#L7939) | 7939 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7949) | 7949 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7960) | 7960 |
| [`finish`](../../interface/application.js#L7971) | 7971 |
| [`onClick`](../../interface/application.js#L7980) | 7980 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7995) | 7995 |
| [`importData`](../../interface/application.js#L8011) | 8011 |
| [`reader.onload`](../../interface/application.js#L8021) | 8021 |
| [`reader.onerror`](../../interface/application.js#L8095) | 8095 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8222) | 8222 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8238) | 8238 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8249) | 8249 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8283) | 8283 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8341) | 8341 |
| [`cancel`](../../interface/application.js#L8354) | 8354 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8370) | 8370 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8387) | 8387 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8412) | 8412 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8426) | 8426 |
| [`clearRackDropPreview`](../../interface/application.js#L8429) | 8429 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8434) | 8434 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8446) | 8446 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8452) | 8452 |
| [`trackRackDrag`](../../interface/application.js#L8461) | 8461 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8492) | 8492 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8502) | 8502 |
| [`getRackDropPosition`](../../interface/application.js#L8595) | 8595 |
| [`window.onload`](../../interface/application.js#L9055) | 9055 |
| [`inventorySectionAccess`](../../interface/application.js#L9074) | 9074 |
| [`addDirectoryAccess`](../../interface/application.js#L9075) | 9075 |
| [`refreshStockAccess`](../../interface/application.js#L9085) | 9085 |
| [`refreshCentralInventory`](../../interface/application.js#L9094) | 9094 |
| [`postInventory`](../../interface/application.js#L9118) | 9118 |
| [`isBlockedAction`](../../interface/application.js#L9170) | 9170 |
| [`applyAllowedControls`](../../interface/application.js#L9203) | 9203 |
| [`enhanceLongSelects`](../../interface/application.js#L9279) | 9279 |
| [`sync`](../../interface/application.js#L9330) | 9330 |
| [`close`](../../interface/application.js#L9336) | 9336 |
| [`choose`](../../interface/application.js#L9340) | 9340 |
| [`draw`](../../interface/application.js#L9345) | 9345 |
| [`open`](../../interface/application.js#L9363) | 9363 |
| [`enhanceSelects`](../../interface/application.js#L9420) | 9420 |
| [`setDepartmentExpanded`](../../interface/application.js#L9465) | 9465 |
| [`isSupplierPage`](../../interface/application.js#L9481) | 9481 |
| [`landingTab`](../../interface/application.js#L9484) | 9484 |
| [`workspaceHashTab`](../../interface/application.js#L9489) | 9489 |
| [`switchTab`](../../interface/application.js#L9510) | 9510 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9540) | 9540 |
| [`openDeviceDetailView`](../../interface/application.js#L9566) | 9566 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9576) | 9576 |
| [`forbidRackMount`](../../interface/application.js#L9635) | 9635 |
| [`installDeviceStockControls`](../../interface/application.js#L9645) | 9645 |
| [`loadDeviceStockSources`](../../interface/application.js#L9660) | 9660 |
| [`openDeviceModal`](../../interface/application.js#L9698) | 9698 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9738) | 9738 |
| [`relatedChanges`](../../interface/application.js#L9744) | 9744 |
| [`saveDevice`](../../interface/application.js#L9755) | 9755 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9799) | 9799 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9800) | 9800 |
| [`nextIpamBridge.save`](../../interface/application.js#L9822) | 9822 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9844) | 9844 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9866) | 9866 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9908) | 9908 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9953) | 9953 |
| [`openDeviceIpamLink`](../../interface/application.js#L9957) | 9957 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9965) | 9965 |
| [`nextSettingsBridge.save`](../../interface/application.js#L10006) | 10006 |
| [`nextRackBridge.save`](../../interface/application.js#L10006) | 10006 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L10023) | 10023 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L10024) | 10024 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L10025) | 10025 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L10039) | 10039 |
| [`nextResetBridge.reset`](../../interface/application.js#L10070) | 10070 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L10097) | 10097 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L10124) | 10124 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L10132) | 10132 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L10141) | 10141 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L10142) | 10142 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L10180) | 10180 |
| [`nextRackBridge.persist`](../../interface/application.js#L10183) | 10183 |
| [`reserveForDelete`](../../interface/application.js#L10205) | 10205 |
| [`removeDevice`](../../interface/application.js#L10213) | 10213 |
| [`cancelDelete`](../../interface/application.js#L10239) | 10239 |
| [`saveArchivedInstallation`](../../interface/application.js#L10245) | 10245 |
| [`renderAccountSections`](../../interface/application.js#L10282) | 10282 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10310) | 10310 |
| [`nextRenderAccount`](../../interface/application.js#L10321) | 10321 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10331) | 10331 |
| [`closeEmailVerification`](../../interface/application.js#L10355) | 10355 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10362) | 10362 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10373) | 10373 |
| [`hydrateAccount`](../../interface/application.js#L10427) | 10427 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10465) | 10465 |
| [`loadAccountProfile`](../../interface/application.js#L10478) | 10478 |
| [`removeAccountPhoto`](../../interface/application.js#L10494) | 10494 |
| [`permissionLabel`](../../interface/application.js#L10506) | 10506 |
| [`accountMfaLabel`](../../interface/application.js#L10509) | 10509 |
| [`renderRoleMemberships`](../../interface/application.js#L10512) | 10512 |
| [`renderRoleCatalogue`](../../interface/application.js#L10518) | 10518 |
| [`openRoleLayer`](../../interface/application.js#L10523) | 10523 |
| [`closeRoleLayer`](../../interface/application.js#L10534) | 10534 |
| [`renderRoleDefinition`](../../interface/application.js#L10540) | 10540 |
| [`renderRoleImpact`](../../interface/application.js#L10544) | 10544 |
| [`access`](../../interface/application.js#L10549) | 10549 |
| [`state`](../../interface/application.js#L10553) | 10553 |
| [`requestRoleChange`](../../interface/application.js#L10558) | 10558 |
| [`roleNotificationMessage`](../../interface/application.js#L10565) | 10565 |
| [`previewRoleAction`](../../interface/application.js#L10569) | 10569 |
| [`openRoleEditor`](../../interface/application.js#L10574) | 10574 |
| [`nextRenderUsers`](../../interface/application.js#L10637) | 10637 |
| [`profileFields`](../../interface/application.js#L10639) | 10639 |
| [`stat`](../../interface/application.js#L10660) | 10660 |
| [`bars`](../../interface/application.js#L10663) | 10663 |
| [`operation`](../../interface/application.js#L10719) | 10719 |
| [`filterUserRows`](../../interface/application.js#L10739) | 10739 |
| [`closeUserWorkspace`](../../interface/application.js#L10763) | 10763 |
| [`loadCentralUsers`](../../interface/application.js#L10792) | 10792 |
| [`changeCentralUser`](../../interface/application.js#L10798) | 10798 |
| [`importPanel`](../../interface/application.js#L10809) | 10809 |
| [`cancelImport`](../../interface/application.js#L10813) | 10813 |
| [`nextImportModalClosed`](../../interface/application.js#L10819) | 10819 |
| [`showImportReview`](../../interface/application.js#L10820) | 10820 |
| [`chooseImportFile`](../../interface/application.js#L10860) | 10860 |
| [`actOnImport`](../../interface/application.js#L10877) | 10877 |

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
| [`escapeHtml`](../../interface/staff-directory.js#L10) | 10 |
| [`displayName`](../../interface/staff-directory.js#L11) | 11 |
| [`departmentName`](../../interface/staff-directory.js#L12) | 12 |
| [`isAdministrator`](../../interface/staff-directory.js#L13) | 13 |
| [`canReadStaff`](../../interface/staff-directory.js#L14) | 14 |
| [`canEditStaff`](../../interface/staff-directory.js#L15) | 15 |
| [`canReadDepartments`](../../interface/staff-directory.js#L16) | 16 |
| [`canEditDepartments`](../../interface/staff-directory.js#L17) | 17 |
| [`icon`](../../interface/staff-directory.js#L18) | 18 |
| [`button`](../../interface/staff-directory.js#L19) | 19 |
| [`badge`](../../interface/staff-directory.js#L20) | 20 |
| [`header`](../../interface/staff-directory.js#L21) | 21 |
| [`renderStaffDirectory`](../../interface/staff-directory.js#L24) | 24 |
| [`detailRow`](../../interface/staff-directory.js#L30) | 30 |
| [`renderStaffDetails`](../../interface/staff-directory.js#L31) | 31 |
| [`field`](../../interface/staff-directory.js#L35) | 35 |
| [`renderStaffForm`](../../interface/staff-directory.js#L36) | 36 |
| [`cardHeading`](../../interface/staff-directory.js#L44) | 44 |
| [`renderDepartments`](../../interface/staff-directory.js#L69) | 69 |
| [`departmentCard`](../../interface/staff-directory.js#L74) | 74 |
| [`departmentNotice`](../../interface/staff-directory.js#L77) | 77 |
| [`departmentDate`](../../interface/staff-directory.js#L80) | 80 |
| [`departmentTable`](../../interface/staff-directory.js#L84) | 84 |
| [`departmentAssignmentRows`](../../interface/staff-directory.js#L87) | 87 |
| [`renderDepartmentOverview`](../../interface/staff-directory.js#L91) | 91 |
| [`renderDepartmentStaff`](../../interface/staff-directory.js#L102) | 102 |
| [`renderDepartmentEquipment`](../../interface/staff-directory.js#L107) | 107 |
| [`renderDepartmentHistory`](../../interface/staff-directory.js#L116) | 116 |
| [`renderDepartmentDetails`](../../interface/staff-directory.js#L125) | 125 |
| [`selectDepartmentTab`](../../interface/staff-directory.js#L132) | 132 |
| [`loadDepartmentDetails`](../../interface/staff-directory.js#L138) | 138 |
| [`request`](../../interface/staff-directory.js#L164) | 164 |
| [`readAll`](../../interface/staff-directory.js#L175) | 175 |
| [`refresh`](../../interface/staff-directory.js#L185) | 185 |
| [`render`](../../interface/staff-directory.js#L203) | 203 |
| [`enter`](../../interface/staff-directory.js#L225) | 225 |
| [`redraw`](../../interface/staff-directory.js#L233) | 233 |
| [`showStaffConflict`](../../interface/staff-directory.js#L234) | 234 |
| [`refreshStaffRecord`](../../interface/staff-directory.js#L242) | 242 |
| [`saveStaff`](../../interface/staff-directory.js#L258) | 258 |
| [`openDepartmentDialog`](../../interface/staff-directory.js#L277) | 277 |
| [`closeDepartmentDialog`](../../interface/staff-directory.js#L288) | 288 |
| [`saveDepartment`](../../interface/staff-directory.js#L289) | 289 |
| [`configure`](../../interface/staff-directory.js#L296) | 296 |

## interface/equipment.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](../../interface/equipment.js#L5) | 5 |
| [`dateLabel`](../../interface/equipment.js#L6) | 6 |
| [`button`](../../interface/equipment.js#L7) | 7 |
| [`canReadAssociations`](../../interface/equipment.js#L8) | 8 |
| [`request`](../../interface/equipment.js#L9) | 9 |
| [`assignmentHistory`](../../interface/equipment.js#L15) | 15 |
| [`assetMovementHistory`](../../interface/equipment.js#L20) | 20 |
| [`staffPlaceholder`](../../interface/equipment.js#L25) | 25 |
| [`loadStaffEquipment`](../../interface/equipment.js#L29) | 29 |
| [`loadDeviceEquipment`](../../interface/equipment.js#L38) | 38 |
| [`loadAssociatedEquipment`](../../interface/equipment.js#L50) | 50 |
| [`openAssociatedEquipment`](../../interface/equipment.js#L63) | 63 |
| [`renderMyEquipment`](../../interface/equipment.js#L71) | 71 |
| [`loadMyEquipment`](../../interface/equipment.js#L74) | 74 |
| [`list`](../../interface/equipment.js#L77) | 77 |
| [`hydrate`](../../interface/equipment.js#L85) | 85 |
| [`showAssignmentDialog`](../../interface/equipment.js#L89) | 89 |
| [`searchRecipients`](../../interface/equipment.js#L100) | 100 |
| [`searchDevices`](../../interface/equipment.js#L109) | 109 |
| [`leaveAssignmentDialog`](../../interface/equipment.js#L117) | 117 |
| [`saveAssignment`](../../interface/equipment.js#L123) | 123 |
| [`caffootEquipment.configure`](../../interface/equipment.js#L177) | 177 |

## interface/stock-intake.js

| Function | Line |
| --- | ---: |
| [`safe`](../../interface/stock-intake.js#L9) | 9 |
| [`canRead`](../../interface/stock-intake.js#L10) | 10 |
| [`canEdit`](../../interface/stock-intake.js#L11) | 11 |
| [`stockLabel`](../../interface/stock-intake.js#L12) | 12 |
| [`stockNotice`](../../interface/stock-intake.js#L13) | 13 |
| [`stockButton`](../../interface/stock-intake.js#L14) | 14 |
| [`stockCard`](../../interface/stock-intake.js#L15) | 15 |
| [`stockField`](../../interface/stock-intake.js#L16) | 16 |
| [`stockSelect`](../../interface/stock-intake.js#L19) | 19 |
| [`stockTable`](../../interface/stock-intake.js#L22) | 22 |
| [`stockMetrics`](../../interface/stock-intake.js#L25) | 25 |
| [`stockSpecText`](../../interface/stock-intake.js#L28) | 28 |
| [`renderStockReceipt`](../../interface/stock-intake.js#L33) | 33 |
| [`renderStockDetails`](../../interface/stock-intake.js#L68) | 68 |
| [`renderStockInventory`](../../interface/stock-intake.js#L91) | 91 |
| [`stockReportNumber`](../../interface/stock-intake.js#L95) | 95 |
| [`stockReportMetric`](../../interface/stock-intake.js#L96) | 96 |
| [`stockReportTable`](../../interface/stock-intake.js#L101) | 101 |
| [`stockReportBar`](../../interface/stock-intake.js#L104) | 104 |
| [`renderStockOverview`](../../interface/stock-intake.js#L108) | 108 |
| [`stockInventoryMatches`](../../interface/stock-intake.js#L142) | 142 |
| [`stockRegisteredMatches`](../../interface/stock-intake.js#L153) | 153 |
| [`renderStockAssignments`](../../interface/stock-intake.js#L163) | 163 |
| [`stockMovementMatches`](../../interface/stock-intake.js#L168) | 168 |
| [`drillStockReport`](../../interface/stock-intake.js#L179) | 179 |
| [`stockDate`](../../interface/stock-intake.js#L189) | 189 |
| [`stockCheckLabel`](../../interface/stock-intake.js#L190) | 190 |
| [`renderStockHistory`](../../interface/stock-intake.js#L191) | 191 |
| [`clearStock`](../../interface/stock-intake.js#L196) | 196 |
| [`stockRequest`](../../interface/stock-intake.js#L201) | 201 |
| [`refreshStock`](../../interface/stock-intake.js#L210) | 210 |
| [`enterStock`](../../interface/stock-intake.js#L222) | 222 |
| [`renderStock`](../../interface/stock-intake.js#L227) | 227 |
| [`receiptTracking`](../../interface/stock-intake.js#L238) | 238 |
| [`hydrateStock`](../../interface/stock-intake.js#L241) | 241 |
| [`openStockDetails`](../../interface/stock-intake.js#L285) | 285 |
| [`submitStock`](../../interface/stock-intake.js#L293) | 293 |
| [`stockStateLabel`](../../interface/stock-intake.js#L429) | 429 |
| [`stockUnitState`](../../interface/stock-intake.js#L430) | 430 |
| [`stockNote`](../../interface/stock-intake.js#L431) | 431 |
| [`stockWorkflowForm`](../../interface/stock-intake.js#L432) | 432 |
| [`stockIssueReady`](../../interface/stock-intake.js#L440) | 440 |
| [`renderDeviceReissue`](../../interface/stock-intake.js#L441) | 441 |
| [`stockExistingIssueLabel`](../../interface/stock-intake.js#L453) | 453 |
| [`renderStockIssue`](../../interface/stock-intake.js#L460) | 460 |
| [`editStockIssue`](../../interface/stock-intake.js#L474) | 474 |
| [`showStockIssueConfirmation`](../../interface/stock-intake.js#L480) | 480 |
| [`stockReturnSources`](../../interface/stock-intake.js#L502) | 502 |
| [`renderStockReturn`](../../interface/stock-intake.js#L509) | 509 |
| [`renderStockWriteOff`](../../interface/stock-intake.js#L520) | 520 |
| [`stockPreparationRequirement`](../../interface/stock-intake.js#L533) | 533 |
| [`renderStockPreparation`](../../interface/stock-intake.js#L540) | 540 |
| [`renderRegisteredStock`](../../interface/stock-intake.js#L552) | 552 |
| [`renderStockMovements`](../../interface/stock-intake.js#L559) | 559 |
| [`renderStockCorrection`](../../interface/stock-intake.js#L564) | 564 |
| [`renderCorrectionImpact`](../../interface/stock-intake.js#L573) | 573 |
| [`stockReturnCorrectionEntry`](../../interface/stock-intake.js#L578) | 578 |
| [`restoreStockReturn`](../../interface/stock-intake.js#L581) | 581 |
| [`closeStockCorrection`](../../interface/stock-intake.js#L593) | 593 |
| [`leaveStockCorrection`](../../interface/stock-intake.js#L599) | 599 |
| [`openStockCorrection`](../../interface/stock-intake.js#L608) | 608 |
| [`stockCorrectionValues`](../../interface/stock-intake.js#L618) | 618 |
| [`previewStockCorrection`](../../interface/stock-intake.js#L621) | 621 |
| [`scheduleStockCorrection`](../../interface/stock-intake.js#L641) | 641 |
| [`submitStockCorrection`](../../interface/stock-intake.js#L651) | 651 |
| [`stockSelectedReturn`](../../interface/stock-intake.js#L694) | 694 |
| [`stockSelectedWriteOff`](../../interface/stock-intake.js#L695) | 695 |
| [`hydrateStockCirculation`](../../interface/stock-intake.js#L699) | 699 |
| [`loadHandoverRecipients`](../../interface/stock-intake.js#L778) | 778 |
| [`loadStockRecipients`](../../interface/stock-intake.js#L804) | 804 |
| [`submitStockCirculation`](../../interface/stock-intake.js#L815) | 815 |
| [`openStockWorkflow`](../../interface/stock-intake.js#L881) | 881 |
| [`openDirectHandover`](../../interface/stock-intake.js#L888) | 888 |
| [`hydrateStockPage`](../../interface/stock-intake.js#L896) | 896 |
| [`dismissHandover`](../../interface/stock-intake.js#L915) | 915 |
| [`configureStock`](../../interface/stock-intake.js#L916) | 916 |

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

## backend/assignment_closure.py

| Function | Line |
| --- | ---: |
| [`assignment_schema_objects`](../../backend/assignment_closure.py#L57) | 57 |
| [`expected_assignment_schema`](../../backend/assignment_closure.py#L63) | 63 |
| [`validate_assignment_closure`](../../backend/assignment_closure.py#L84) | 84 |
| [`migrate_assignment_closure`](../../backend/assignment_closure.py#L94) | 94 |

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
| [`device_assignment_dependency`](../../backend/device_assignments.py#L31) | 31 |
| [`assignment_device_choices`](../../backend/device_assignments.py#L49) | 49 |
| [`read_assignments`](../../backend/device_assignments.py#L72) | 72 |
| [`assign_devices`](../../backend/device_assignments.py#L148) | 148 |
| [`my_equipment`](../../backend/device_assignments.py#L200) | 200 |

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
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L32) | 32 |
| [`_validate_device_identity_change`](../../backend/device_saves.py#L51) | 51 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L71) | 71 |
| [`_persist_related_guests`](../../backend/device_saves.py#L116) | 116 |
| [`save_reserved_device`](../../backend/device_saves.py#L129) | 129 |
| [`create_device_in_transaction`](../../backend/device_saves.py#L271) | 271 |
| [`create_device`](../../backend/device_saves.py#L348) | 348 |
| [`delete_reserved_device`](../../backend/device_saves.py#L360) | 360 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](../../backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](../../backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](../../backend/feature_settings.py#L28) | 28 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_subnet_batch_reason`](../../backend/history_permissions.py#L33) | 33 |
| [`visible_change_history`](../../backend/history_permissions.py#L61) | 61 |

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
| [`initialise_database`](../../backend/schema.py#L63) | 63 |
| [`migrate_staff_directory`](../../backend/schema.py#L265) | 265 |
| [`migrate_role_permissions`](../../backend/schema.py#L330) | 330 |
| [`verify_role_migration`](../../backend/schema.py#L415) | 415 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L441) | 441 |
| [`migrate_it_staff_stock_default`](../../backend/schema.py#L535) | 535 |
| [`migrate_device_assignments`](../../backend/schema.py#L563) | 563 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L102) | 102 |
| [`connect`](../../backend/server.py#L120) | 120 |
| [`initialise_database`](../../backend/server.py#L128) | 128 |
| [`Handler.end_headers`](../../backend/server.py#L134) | 134 |
| [`Handler.do_GET`](../../backend/server.py#L141) | 141 |
| [`Handler.do_POST`](../../backend/server.py#L517) | 517 |
| [`Handler.handle_supplier_request`](../../backend/server.py#L704) | 704 |
| [`Handler.handle_stock_request`](../../backend/server.py#L770) | 770 |
| [`Handler.handle_equipment_request`](../../backend/server.py#L859) | 859 |
| [`Handler.handle_directory_request`](../../backend/server.py#L940) | 940 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L1017) | 1017 |
| [`Handler.handle_role_change`](../../backend/server.py#L1060) | 1060 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L1102) | 1102 |
| [`Handler.handle_account_email`](../../backend/server.py#L1501) | 1501 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1581) | 1581 |
| [`Handler.handle_import`](../../backend/server.py#L1612) | 1612 |
| [`Handler.respond`](../../backend/server.py#L1688) | 1688 |
| [`main`](../../backend/server.py#L1701) | 1701 |

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
| [`_staff_revision`](../../backend/staff_directory.py#L21) | 21 |
| [`unique_directory_fields`](../../backend/staff_directory.py#L37) | 37 |
| [`require_directory_access`](../../backend/staff_directory.py#L47) | 47 |
| [`_text`](../../backend/staff_directory.py#L53) | 53 |
| [`_staff_record`](../../backend/staff_directory.py#L60) | 60 |
| [`_department_record`](../../backend/staff_directory.py#L67) | 67 |
| [`read_staff_member`](../../backend/staff_directory.py#L74) | 74 |
| [`department_has_associations`](../../backend/staff_directory.py#L86) | 86 |
| [`read_department`](../../backend/staff_directory.py#L105) | 105 |
| [`list_directory`](../../backend/staff_directory.py#L112) | 112 |
| [`list_staff_department_choices`](../../backend/staff_directory.py#L126) | 126 |
| [`_validate_staff`](../../backend/staff_directory.py#L139) | 139 |
| [`_create_login`](../../backend/staff_directory.py#L164) | 164 |
| [`save_staff_member`](../../backend/staff_directory.py#L179) | 179 |
| [`save_department`](../../backend/staff_directory.py#L225) | 225 |

## backend/staff_identity.py

| Function | Line |
| --- | ---: |
| [`link_account_staff`](../../backend/staff_identity.py#L4) | 4 |

## backend/stock_circulation.py

| Function | Line |
| --- | ---: |
| [`stock_event_date`](../../backend/stock_circulation.py#L13) | 13 |
| [`stock_recipients`](../../backend/stock_circulation.py#L25) | 25 |
| [`stock_recipient`](../../backend/stock_circulation.py#L36) | 36 |
| [`stock_movement_snapshot`](../../backend/stock_circulation.py#L50) | 50 |
| [`publish_stock_movement`](../../backend/stock_circulation.py#L57) | 57 |
| [`stock_issue_records`](../../backend/stock_circulation.py#L87) | 87 |
| [`read_stock_issues`](../../backend/stock_circulation.py#L113) | 113 |
| [`issue_stock`](../../backend/stock_circulation.py#L138) | 138 |
| [`issue_stock_in_transaction`](../../backend/stock_circulation.py#L150) | 150 |
| [`stock_unit_states`](../../backend/stock_circulation.py#L196) | 196 |
| [`registered_stock_devices`](../../backend/stock_circulation.py#L207) | 207 |
| [`legacy_device_issue`](../../backend/stock_circulation.py#L224) | 224 |
| [`preparation_requirements`](../../backend/stock_circulation.py#L242) | 242 |
| [`preparation_checks`](../../backend/stock_circulation.py#L259) | 259 |
| [`require_stock_device_edit`](../../backend/stock_circulation.py#L267) | 267 |
| [`return_stock`](../../backend/stock_circulation.py#L276) | 276 |
| [`prepare_stock`](../../backend/stock_circulation.py#L405) | 405 |
| [`stock_state_balance`](../../backend/stock_circulation.py#L467) | 467 |
| [`canonical_device_choice`](../../backend/stock_circulation.py#L475) | 475 |
| [`write_off_stock`](../../backend/stock_circulation.py#L495) | 495 |
| [`stock_movement_history`](../../backend/stock_circulation.py#L611) | 611 |

## backend/stock_intake.py

| Function | Line |
| --- | ---: |
| [`stock_json`](../../backend/stock_intake.py#L19) | 19 |
| [`stock_access`](../../backend/stock_intake.py#L24) | 24 |
| [`stock_text`](../../backend/stock_intake.py#L30) | 30 |
| [`stock_quantity`](../../backend/stock_intake.py#L43) | 43 |
| [`stock_checks`](../../backend/stock_intake.py#L49) | 49 |
| [`stock_specifications`](../../backend/stock_intake.py#L56) | 56 |
| [`stock_configuration`](../../backend/stock_intake.py#L80) | 80 |
| [`stock_digest`](../../backend/stock_intake.py#L85) | 85 |
| [`stock_item`](../../backend/stock_intake.py#L89) | 89 |
| [`stock_history`](../../backend/stock_intake.py#L149) | 149 |
| [`read_stock`](../../backend/stock_intake.py#L184) | 184 |
| [`project_stock_details`](../../backend/stock_intake.py#L198) | 198 |
| [`stock_operation`](../../backend/stock_intake.py#L212) | 212 |
| [`stock_replay`](../../backend/stock_intake.py#L221) | 221 |
| [`append_stock_fact`](../../backend/stock_intake.py#L239) | 239 |
| [`stock_write_access`](../../backend/stock_intake.py#L265) | 265 |
| [`receive_stock`](../../backend/stock_intake.py#L271) | 271 |
| [`update_stock_readiness`](../../backend/stock_intake.py#L363) | 363 |

## backend/stock_reporting.py

| Function | Line |
| --- | ---: |
| [`stock_report_counts`](../../backend/stock_reporting.py#L12) | 12 |
| [`read_stock_report`](../../backend/stock_reporting.py#L20) | 20 |
| [`read_stock_report.add_counts`](../../backend/stock_reporting.py#L36) | 36 |

## backend/stock_schema.py

| Function | Line |
| --- | ---: |
| [`stock_schema_statements`](../../backend/stock_schema.py#L490) | 490 |
| [`normalise_schema_statement`](../../backend/stock_schema.py#L502) | 502 |
| [`validate_feature_table`](../../backend/stock_schema.py#L507) | 507 |
| [`validate_it_asset_stock`](../../backend/stock_schema.py#L543) | 543 |
| [`migrate_it_asset_stock`](../../backend/stock_schema.py#L573) | 573 |

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

## backend/device_stock.py

| Function | Line |
| --- | ---: |
| [`require_device_stock_access`](../../backend/device_stock.py#L15) | 15 |
| [`registration_source_ready`](../../backend/device_stock.py#L23) | 23 |
| [`device_stock_sources`](../../backend/device_stock.py#L28) | 28 |
| [`validate_registration_identity`](../../backend/device_stock.py#L46) | 46 |
| [`register_stock_device`](../../backend/device_stock.py#L64) | 64 |
| [`device_ready_for_reissue`](../../backend/device_stock.py#L104) | 104 |
| [`reissue_device_choices`](../../backend/device_stock.py#L114) | 114 |
| [`reissue_stock_device`](../../backend/device_stock.py#L122) | 122 |

## backend/device_storage.py

| Function | Line |
| --- | ---: |
| [`storage_text`](../../backend/device_storage.py#L5) | 5 |
| [`storage_number`](../../backend/device_storage.py#L10) | 10 |
| [`validate_device_storage`](../../backend/device_storage.py#L22) | 22 |

## backend/equipment_associations.py

| Function | Line |
| --- | ---: |
| [`equipment_association_schema`](../../backend/equipment_associations.py#L59) | 59 |
| [`validate_equipment_associations`](../../backend/equipment_associations.py#L66) | 66 |
| [`migrate_equipment_associations`](../../backend/equipment_associations.py#L78) | 78 |
| [`read_equipment_associations`](../../backend/equipment_associations.py#L89) | 89 |
| [`add_associated_equipment`](../../backend/equipment_associations.py#L130) | 130 |
| [`has_outstanding_associated_equipment`](../../backend/equipment_associations.py#L208) | 208 |

## backend/handover_schema.py

| Function | Line |
| --- | ---: |
| [`handover_assignment_statements`](../../backend/handover_schema.py#L119) | 119 |
| [`handover_stock_guard`](../../backend/handover_schema.py#L130) | 130 |
| [`handover_schema_objects`](../../backend/handover_schema.py#L142) | 142 |
| [`validate_device_handovers`](../../backend/handover_schema.py#L147) | 147 |
| [`migrate_device_handovers`](../../backend/handover_schema.py#L160) | 160 |

## backend/device_handovers.py

| Function | Line |
| --- | ---: |
| [`require_handover_access`](../../backend/device_handovers.py#L14) | 14 |
| [`device_handover_source`](../../backend/device_handovers.py#L27) | 27 |
| [`device_handover_context`](../../backend/device_handovers.py#L52) | 52 |
| [`reassign_device`](../../backend/device_handovers.py#L61) | 61 |


## backend/stock_corrections.py

| Function | Line |
| --- | ---: |
| [`correction_source`](../../backend/stock_corrections.py#L12) | 12 |
| [`correction_version`](../../backend/stock_corrections.py#L41) | 41 |
| [`replay_corrected_stock`](../../backend/stock_corrections.py#L51) | 51 |
| [`stock_correction_context`](../../backend/stock_corrections.py#L108) | 108 |
| [`validate_stock_correction`](../../backend/stock_corrections.py#L130) | 130 |
| [`preview_stock_correction`](../../backend/stock_corrections.py#L153) | 153 |
| [`save_stock_correction`](../../backend/stock_corrections.py#L166) | 166 |

## backend/supplier_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_suppliers`](../../backend/supplier_schema.py#L93) | 93 |

## backend/supplier_issue_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_supplier_issues`](../../backend/supplier_issue_schema.py#L80) | 80 |

## backend/suppliers.py

| Function | Line |
| --- | ---: |
| [`supplier_access`](../../backend/suppliers.py#L13) | 13 |
| [`fields`](../../backend/suppliers.py#L18) | 18 |
| [`cleaned`](../../backend/suppliers.py#L24) | 24 |
| [`web_address`](../../backend/suppliers.py#L37) | 37 |
| [`identities`](../../backend/suppliers.py#L53) | 53 |
| [`text_list`](../../backend/suppliers.py#L61) | 61 |
| [`contact_values`](../../backend/suppliers.py#L67) | 67 |
| [`address`](../../backend/suppliers.py#L92) | 92 |
| [`directory_categories`](../../backend/suppliers.py#L100) | 100 |
| [`read_directory`](../../backend/suppliers.py#L108) | 108 |
| [`get_supplier`](../../backend/suppliers.py#L132) | 132 |
| [`supply_sections`](../../backend/suppliers.py#L143) | 143 |
| [`supplier_delete_reason`](../../backend/suppliers.py#L149) | 149 |
| [`contact_delete_reason`](../../backend/suppliers.py#L159) | 159 |
| [`location_delete_reason`](../../backend/suppliers.py#L167) | 167 |
| [`read_supplier`](../../backend/suppliers.py#L175) | 175 |
| [`log_change`](../../backend/suppliers.py#L219) | 219 |
| [`child_record`](../../backend/suppliers.py#L227) | 227 |
| [`confirmed`](../../backend/suppliers.py#L238) | 238 |
| [`require_revision`](../../backend/suppliers.py#L243) | 243 |
| [`save_categories`](../../backend/suppliers.py#L248) | 248 |
| [`save_company`](../../backend/suppliers.py#L266) | 266 |
| [`save_category`](../../backend/suppliers.py#L307) | 307 |
| [`set_archived`](../../backend/suppliers.py#L343) | 343 |
| [`save_location`](../../backend/suppliers.py#L352) | 352 |
| [`save_contact`](../../backend/suppliers.py#L369) | 369 |
| [`save_note`](../../backend/suppliers.py#L402) | 402 |
| [`log_note`](../../backend/suppliers.py#L427) | 427 |
| [`change_company_status`](../../backend/suppliers.py#L433) | 433 |
| [`change_child`](../../backend/suppliers.py#L471) | 471 |
| [`read_issue_rows`](../../backend/suppliers.py#L511) | 511 |
| [`read_issues`](../../backend/suppliers.py#L538) | 538 |
| [`read_purchasing_dashboard`](../../backend/suppliers.py#L542) | 542 |
| [`read_issue`](../../backend/suppliers.py#L551) | 551 |
| [`issue_snapshot`](../../backend/suppliers.py#L583) | 583 |
| [`save_issue`](../../backend/suppliers.py#L591) | 591 |
| [`write_issue_update`](../../backend/suppliers.py#L643) | 643 |
| [`correct_issue_update`](../../backend/suppliers.py#L666) | 666 |
| [`save_supplier_operation`](../../backend/suppliers.py#L691) | 691 |
| [`read_supply_impact`](../../backend/suppliers.py#L737) | 737 |

## interface/suppliers.js

| Function | Line |
| --- | ---: |
| [`safe`](../../interface/suppliers.js#L16) | 16 |
| [`icon`](../../interface/suppliers.js#L17) | 17 |
| [`editable`](../../interface/suppliers.js#L18) | 18 |
| [`list`](../../interface/suppliers.js#L19) | 19 |
| [`locationAddress`](../../interface/suppliers.js#L20) | 20 |
| [`labelStatus`](../../interface/suppliers.js#L21) | 21 |
| [`badge`](../../interface/suppliers.js#L22) | 22 |
| [`findContact`](../../interface/suppliers.js#L23) | 23 |
| [`findLocation`](../../interface/suppliers.js#L24) | 24 |
| [`findNote`](../../interface/suppliers.js#L25) | 25 |
| [`options`](../../interface/suppliers.js#L26) | 26 |
| [`button`](../../interface/suppliers.js#L29) | 29 |
| [`nameButton`](../../interface/suppliers.js#L32) | 32 |
| [`header`](../../interface/suppliers.js#L35) | 35 |
| [`sectionHeading`](../../interface/suppliers.js#L42) | 42 |
| [`table`](../../interface/suppliers.js#L45) | 45 |
| [`emptyRow`](../../interface/suppliers.js#L50) | 50 |
| [`field`](../../interface/suppliers.js#L53) | 53 |
| [`select`](../../interface/suppliers.js#L59) | 59 |
| [`toolSearch`](../../interface/suppliers.js#L63) | 63 |
| [`card`](../../interface/suppliers.js#L69) | 69 |
| [`info`](../../interface/suppliers.js#L72) | 72 |
| [`webLink`](../../interface/suppliers.js#L75) | 75 |
| [`categoryTags`](../../interface/suppliers.js#L83) | 83 |
| [`directoryResults`](../../interface/suppliers.js#L87) | 87 |
| [`renderDirectory`](../../interface/suppliers.js#L97) | 97 |
| [`contactScope`](../../interface/suppliers.js#L111) | 111 |
| [`lifecycleActions`](../../interface/suppliers.js#L117) | 117 |
| [`lifecycleButtons`](../../interface/suppliers.js#L131) | 131 |
| [`renderOverview`](../../interface/suppliers.js#L135) | 135 |
| [`renderLocations`](../../interface/suppliers.js#L153) | 153 |
| [`contactRows`](../../interface/suppliers.js#L171) | 171 |
| [`renderContacts`](../../interface/suppliers.js#L180) | 180 |
| [`formatDate`](../../interface/suppliers.js#L190) | 190 |
| [`time`](../../interface/suppliers.js#L193) | 193 |
| [`noteCards`](../../interface/suppliers.js#L194) | 194 |
| [`renderNotes`](../../interface/suppliers.js#L205) | 205 |
| [`issueCategoryName`](../../interface/suppliers.js#L211) | 211 |
| [`issueCategoryLabel`](../../interface/suppliers.js#L214) | 214 |
| [`issueStatusBadge`](../../interface/suppliers.js#L218) | 218 |
| [`issueButton`](../../interface/suppliers.js#L221) | 221 |
| [`issueRows`](../../interface/suppliers.js#L225) | 225 |
| [`issuesList`](../../interface/suppliers.js#L233) | 233 |
| [`renderNotesIssues`](../../interface/suppliers.js#L240) | 240 |
| [`renderAllIssues`](../../interface/suppliers.js#L249) | 249 |
| [`dashboardIcon`](../../interface/suppliers.js#L254) | 254 |
| [`dashboardMetric`](../../interface/suppliers.js#L257) | 257 |
| [`dashboardCard`](../../interface/suppliers.js#L261) | 261 |
| [`renderPurchasing`](../../interface/suppliers.js#L265) | 265 |
| [`renderDetails`](../../interface/suppliers.js#L298) | 298 |
| [`render`](../../interface/suppliers.js#L310) | 310 |
| [`request`](../../interface/suppliers.js#L321) | 321 |
| [`readRoute`](../../interface/suppliers.js#L330) | 330 |
| [`writeRoute`](../../interface/suppliers.js#L336) | 336 |
| [`show`](../../interface/suppliers.js#L341) | 341 |
| [`dialog`](../../interface/suppliers.js#L383) | 383 |
| [`lines`](../../interface/suppliers.js#L399) | 399 |
| [`valueOf`](../../interface/suppliers.js#L400) | 400 |
| [`selectedIds`](../../interface/suppliers.js#L401) | 401 |
| [`addressFields`](../../interface/suppliers.js#L402) | 402 |
| [`readAddress`](../../interface/suppliers.js#L408) | 408 |
| [`checkList`](../../interface/suppliers.js#L411) | 411 |
| [`formSection`](../../interface/suppliers.js#L416) | 416 |
| [`contactEntry`](../../interface/suppliers.js#L420) | 420 |
| [`supplierForm`](../../interface/suppliers.js#L430) | 430 |
| [`locationForm`](../../interface/suppliers.js#L463) | 463 |
| [`contactForm`](../../interface/suppliers.js#L475) | 475 |
| [`contactDetails`](../../interface/suppliers.js#L507) | 507 |
| [`noteForm`](../../interface/suppliers.js#L524) | 524 |
| [`issueCategoryOptions`](../../interface/suppliers.js#L534) | 534 |
| [`issueUpdates`](../../interface/suppliers.js#L538) | 538 |
| [`issueDialog`](../../interface/suppliers.js#L546) | 546 |
| [`openIssue`](../../interface/suppliers.js#L593) | 593 |
| [`refreshAfterIssueSave`](../../interface/suppliers.js#L602) | 602 |
| [`correctIssueUpdate`](../../interface/suppliers.js#L606) | 606 |
| [`addInlineIssueCategory`](../../interface/suppliers.js#L624) | 624 |
| [`toggleInlineCategory`](../../interface/suppliers.js#L646) | 646 |
| [`applyIssueCategories`](../../interface/suppliers.js#L653) | 653 |
| [`categoriesDialog`](../../interface/suppliers.js#L660) | 660 |
| [`categoryForm`](../../interface/suppliers.js#L672) | 672 |
| [`command`](../../interface/suppliers.js#L681) | 681 |
| [`updateSupplier`](../../interface/suppliers.js#L690) | 690 |
| [`updateCategories`](../../interface/suppliers.js#L701) | 701 |
| [`statusConfirmation`](../../interface/suppliers.js#L712) | 712 |
| [`supplyConfirmation`](../../interface/suppliers.js#L742) | 742 |
| [`refreshRows`](../../interface/suppliers.js#L758) | 758 |
| [`caffootSuppliers.configure`](../../interface/suppliers.js#L911) | 911 |
| [`caffootSuppliers.enter`](../../interface/suppliers.js#L912) | 912 |
| [`caffootSuppliers.leave`](../../interface/suppliers.js#L916) | 916 |
| [`caffootSuppliers.closed`](../../interface/suppliers.js#L923) | 923 |
