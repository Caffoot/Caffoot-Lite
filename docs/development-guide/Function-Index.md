# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the indexed application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 1234.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`returnToExistingSignIn`](../../interface/loader.js#L8) | 8 |
| [`renderInterfaceTemplate`](../../interface/loader.js#L38) | 38 |
| [`loadInterfaceText`](../../interface/loader.js#L46) | 46 |
| [`initialiseInterface`](../../interface/loader.js#L51) | 51 |
| [`staffScript.onerror`](../../interface/loader.js#L86) | 86 |
| [`staffScript.onload`](../../interface/loader.js#L87) | 87 |
| [`script.onerror`](../../interface/loader.js#L90) | 90 |
| [`script.onload`](../../interface/loader.js#L91) | 91 |
| [`stockScript.onerror`](../../interface/loader.js#L94) | 94 |
| [`stockScript.onload`](../../interface/loader.js#L95) | 95 |
| [`supplierScript.onerror`](../../interface/loader.js#L98) | 98 |
| [`supplierScript.onload`](../../interface/loader.js#L99) | 99 |
| [`loadApplication`](../../interface/loader.js#L108) | 108 |
| [`applicationScript.onerror`](../../interface/loader.js#L111) | 111 |
| [`showInterfaceLoadError`](../../interface/loader.js#L120) | 120 |
| [`lifecycleScript.onerror`](../../interface/loader.js#L102) | 102 |
| [`lifecycleScript.onload`](../../interface/loader.js#L103) | 103 |

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
| [`caffootThemePreference`](../../interface/application.js#L551) | 551 |
| [`caffootApplyTheme`](../../interface/application.js#L558) | 558 |
| [`caffootSetTheme`](../../interface/application.js#L572) | 572 |
| [`onSystemThemeChange`](../../interface/application.js#L583) | 583 |
| [`toggleDarkMode`](../../interface/application.js#L592) | 592 |
| [`readAuditHistory`](../../interface/application.js#L599) | 599 |
| [`auditChanges`](../../interface/application.js#L603) | 603 |
| [`recordAudit`](../../interface/application.js#L640) | 640 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L649) | 649 |
| [`exportAuditHistory`](../../interface/application.js#L661) | 661 |
| [`auditVisibleRows`](../../interface/application.js#L673) | 673 |
| [`auditDate`](../../interface/application.js#L695) | 695 |
| [`renderAuditHTML`](../../interface/application.js#L699) | 699 |
| [`hydrateAudit`](../../interface/application.js#L732) | 732 |
| [`applyAuditFilters`](../../interface/application.js#L740) | 740 |
| [`closeAuditDetail`](../../interface/application.js#L775) | 775 |
| [`showAuditDetail`](../../interface/application.js#L781) | 781 |
| [`nextRenderUsers`](../../interface/application.js#L810) | 810 |
| [`nextRenderAccount`](../../interface/application.js#L812) | 812 |
| [`hydrateAccount`](../../interface/application.js#L813) | 813 |
| [`removeAccountPhoto`](../../interface/application.js#L814) | 814 |
| [`saveState`](../../interface/application.js#L817) | 817 |
| [`getDeviceById`](../../interface/application.js#L820) | 820 |
| [`findDeviceUsingIp`](../../interface/application.js#L824) | 824 |
| [`setDevicePrimaryIp`](../../interface/application.js#L829) | 829 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L888) | 888 |
| [`isRackMountedDevice`](../../interface/application.js#L901) | 901 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L904) | 904 |
| [`getRackShelfLocation`](../../interface/application.js#L916) | 916 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L922) | 922 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L938) | 938 |
| [`openRackShelfCreation`](../../interface/application.js#L956) | 956 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L970) | 970 |
| [`createRackShelfFromDevice`](../../interface/application.js#L980) | 980 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L987) | 987 |
| [`options`](../../interface/application.js#L993) | 993 |
| [`validateRackPlacement`](../../interface/application.js#L1014) | 1014 |
| [`showNotification`](../../interface/application.js#L1050) | 1050 |
| [`showToast`](../../interface/application.js#L1064) | 1064 |
| [`toggleSidebar`](../../interface/application.js#L1148) | 1148 |
| [`switchTab`](../../interface/application.js#L1167) | 1167 |
| [`escapeHtml`](../../interface/application.js#L1200) | 1200 |
| [`inlineJsArg`](../../interface/application.js#L1209) | 1209 |
| [`browserStorageWarning`](../../interface/application.js#L1217) | 1217 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1220) | 1220 |
| [`renderSectionTabIcon`](../../interface/application.js#L1226) | 1226 |
| [`renderSectionHeader`](../../interface/application.js#L1232) | 1232 |
| [`tab`](../../interface/application.js#L1233) | 1233 |
| [`revealSectionTab`](../../interface/application.js#L1260) | 1260 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1267) | 1267 |
| [`renderContent`](../../interface/application.js#L1287) | 1287 |
| [`updateScrollHint`](../../interface/application.js#L1341) | 1341 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1352) | 1352 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1387) | 1387 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1391) | 1391 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1395) | 1395 |
| [`buildInventoryReportData`](../../interface/application.js#L1401) | 1401 |
| [`occupancy`](../../interface/application.js#L1417) | 1417 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1440) | 1440 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1446) | 1446 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1472) | 1472 |
| [`renderDashboardHTML`](../../interface/application.js#L1501) | 1501 |
| [`statusPill`](../../interface/application.js#L1607) | 1607 |
| [`insightSegment`](../../interface/application.js#L1624) | 1624 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1670) | 1670 |
| [`getCategoryIcon`](../../interface/application.js#L1687) | 1687 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1702) | 1702 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1711) | 1711 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1716) | 1716 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1731) | 1731 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1746) | 1746 |
| [`printRackElevation`](../../interface/application.js#L1756) | 1756 |
| [`safe`](../../interface/application.js#L1759) | 1759 |
| [`printRackElevationInFrame`](../../interface/application.js#L1790) | 1790 |
| [`frame.onload`](../../interface/application.js#L1800) | 1800 |
| [`renderRackHubV13`](../../interface/application.js#L1821) | 1821 |
| [`card`](../../interface/application.js#L1826) | 1826 |
| [`mark`](../../interface/application.js#L1835) | 1835 |
| [`bar`](../../interface/application.js#L1851) | 1851 |
| [`chartBox`](../../interface/application.js#L1852) | 1852 |
| [`chartRows`](../../interface/application.js#L1853) | 1853 |
| [`rackSpaceGuide`](../../interface/application.js#L1855) | 1855 |
| [`renderRacksHTML`](../../interface/application.js#L1924) | 1924 |
| [`changeRack`](../../interface/application.js#L1991) | 1991 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L2010) | 2010 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L2017) | 2017 |
| [`getVisibleDevices`](../../interface/application.js#L2023) | 2023 |
| [`filterHardwareModels`](../../interface/application.js#L2048) | 2048 |
| [`openCatalogueModal`](../../interface/application.js#L2087) | 2087 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2096) | 2096 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2120) | 2120 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2158) | 2158 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2170) | 2170 |
| [`renderCatalogueButton`](../../interface/application.js#L2187) | 2187 |
| [`renderCatalogueRecord`](../../interface/application.js#L2191) | 2191 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2196) | 2196 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2215) | 2215 |
| [`add`](../../interface/application.js#L2217) | 2217 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2262) | 2262 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2269) | 2269 |
| [`openHardwareModelManager`](../../interface/application.js#L2281) | 2281 |
| [`opts`](../../interface/application.js#L2286) | 2286 |
| [`saveHardwareModel`](../../interface/application.js#L2304) | 2304 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2333) | 2333 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2347) | 2347 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2369) | 2369 |
| [`add`](../../interface/application.js#L2371) | 2371 |
| [`options`](../../interface/application.js#L2407) | 2407 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2421) | 2421 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2436) | 2436 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2451) | 2451 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2459) | 2459 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2470) | 2470 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2479) | 2479 |
| [`option`](../../interface/application.js#L2486) | 2486 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2501) | 2501 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2512) | 2512 |
| [`openServerServiceEditor`](../../interface/application.js#L2529) | 2529 |
| [`saveServerServiceEntry`](../../interface/application.js#L2538) | 2538 |
| [`restoreArchivedServerService`](../../interface/application.js#L2551) | 2551 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2560) | 2560 |
| [`renderDevicesHTML`](../../interface/application.js#L2572) | 2572 |
| [`renderHardwareMetric`](../../interface/application.js#L2580) | 2580 |
| [`renderHardwareChart`](../../interface/application.js#L2585) | 2585 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2595) | 2595 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2614) | 2614 |
| [`renderArchivedSoftware`](../../interface/application.js#L2622) | 2622 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2661) | 2661 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2668) | 2668 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2669) | 2669 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2670) | 2670 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2673) | 2673 |
| [`openManageTypesModal`](../../interface/application.js#L2692) | 2692 |
| [`openManageLocationsModal`](../../interface/application.js#L2693) | 2693 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2696) | 2696 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2718) | 2718 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2725) | 2725 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2733) | 2733 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2753) | 2753 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2754) | 2754 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2755) | 2755 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2770) | 2770 |
| [`deleteDeviceType`](../../interface/application.js#L2790) | 2790 |
| [`deleteDeviceLocation`](../../interface/application.js#L2791) | 2791 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2799) | 2799 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2803) | 2803 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2830) | 2830 |
| [`nodes`](../../interface/application.js#L2840) | 2840 |
| [`renderIpamManage`](../../interface/application.js#L2866) | 2866 |
| [`renderIpamHTML`](../../interface/application.js#L2917) | 2917 |
| [`changeSubnet`](../../interface/application.js#L3078) | 3078 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3091) | 3091 |
| [`openIpamModal`](../../interface/application.js#L3117) | 3117 |
| [`openBulkIpModal`](../../interface/application.js#L3122) | 3122 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3129) | 3129 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3133) | 3133 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3152) | 3152 |
| [`applyBulkIpChanges`](../../interface/application.js#L3168) | 3168 |
| [`subnetCidrFeedback`](../../interface/application.js#L3182) | 3182 |
| [`suggestSubnetGateway`](../../interface/application.js#L3200) | 3200 |
| [`openSubnetModal`](../../interface/application.js#L3228) | 3228 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3232) | 3232 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3258) | 3258 |
| [`handleSubnetSubmit`](../../interface/application.js#L3278) | 3278 |
| [`showSubnetFormError`](../../interface/application.js#L3485) | 3485 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3501) | 3501 |
| [`subnetNameConflicts`](../../interface/application.js#L3515) | 3515 |
| [`subnetHasVlan`](../../interface/application.js#L3522) | 3522 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3525) | 3525 |
| [`openMultipleSubnets`](../../interface/application.js#L3533) | 3533 |
| [`visibility`](../../interface/application.js#L3540) | 3540 |
| [`planningVisibility`](../../interface/application.js#L3544) | 3544 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3562) | 3562 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3574) | 3574 |
| [`read`](../../interface/application.js#L3576) | 3576 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3594) | 3594 |
| [`reject`](../../interface/application.js#L3596) | 3596 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3633) | 3633 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3637) | 3637 |
| [`add`](../../interface/application.js#L3640) | 3640 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3667) | 3667 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3675) | 3675 |
| [`field`](../../interface/application.js#L3678) | 3678 |
| [`capture`](../../interface/application.js#L3688) | 3688 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3722) | 3722 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3726) | 3726 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3732) | 3732 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3753) | 3753 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3757) | 3757 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3761) | 3761 |
| [`deleteSubnet`](../../interface/application.js#L3772) | 3772 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3832) | 3832 |
| [`deleteSubnetCommit`](../../interface/application.js#L3860) | 3860 |
| [`deleteVlan`](../../interface/application.js#L3890) | 3890 |
| [`openIpModal`](../../interface/application.js#L3916) | 3916 |
| [`handleIpSubmit`](../../interface/application.js#L3933) | 3933 |
| [`openEquipmentSupplierModal`](../../interface/application.js#L3998) | 3998 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L4012) | 4012 |
| [`modalFormSnapshot`](../../interface/application.js#L4022) | 4022 |
| [`stockFormHasChanges`](../../interface/application.js#L4028) | 4028 |
| [`rememberModalForm`](../../interface/application.js#L4032) | 4032 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L4037) | 4037 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L4067) | 4067 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4086) | 4086 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4095) | 4095 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4101) | 4101 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4107) | 4107 |
| [`closeModal`](../../interface/application.js#L4116) | 4116 |
| [`openModal`](../../interface/application.js#L4167) | 4167 |
| [`readRackDimension`](../../interface/application.js#L4240) | 4240 |
| [`formatRackDimension`](../../interface/application.js#L4247) | 4247 |
| [`rackPhysicalDetails`](../../interface/application.js#L4252) | 4252 |
| [`openRackModal`](../../interface/application.js#L4261) | 4261 |
| [`handleRackSubmit`](../../interface/application.js#L4277) | 4277 |
| [`deleteRack`](../../interface/application.js#L4344) | 4344 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4366) | 4366 |
| [`refresh`](../../interface/application.js#L4389) | 4389 |
| [`openAssignDeviceModal`](../../interface/application.js#L4466) | 4466 |
| [`refresh`](../../interface/application.js#L4483) | 4483 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4490) | 4490 |
| [`handleAssignSubmit`](../../interface/application.js#L4524) | 4524 |
| [`unassignDevice`](../../interface/application.js#L4569) | 4569 |
| [`getSubnetForIp`](../../interface/application.js#L4586) | 4586 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4590) | 4590 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4637) | 4637 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4646) | 4646 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4655) | 4655 |
| [`inside`](../../interface/application.js#L4662) | 4662 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4680) | 4680 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4689) | 4689 |
| [`toggleDeviceMountType`](../../interface/application.js#L4733) | 4733 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4757) | 4757 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4762) | 4762 |
| [`openDeviceReviewModal`](../../interface/application.js#L4780) | 4780 |
| [`openDeviceDetailView`](../../interface/application.js#L4785) | 4785 |
| [`safe`](../../interface/application.js#L4795) | 4795 |
| [`field`](../../interface/application.js#L4796) | 4796 |
| [`section`](../../interface/application.js#L4801) | 4801 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4851) | 4851 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4857) | 4857 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4876) | 4876 |
| [`navigateToDeviceRack`](../../interface/application.js#L4894) | 4894 |
| [`duplicateDevice`](../../interface/application.js#L4922) | 4922 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4992) | 4992 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4997) | 4997 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L5002) | 5002 |
| [`openServerServiceManager`](../../interface/application.js#L5003) | 5003 |
| [`captureServerServiceSelections`](../../interface/application.js#L5008) | 5008 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L5014) | 5014 |
| [`confirmServerServiceArchive`](../../interface/application.js#L5035) | 5035 |
| [`archiveServerService`](../../interface/application.js#L5043) | 5043 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L5069) | 5069 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L5073) | 5073 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L5091) | 5091 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L5095) | 5095 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L5098) | 5098 |
| [`updateHardwareCatalogue`](../../interface/application.js#L5105) | 5105 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5133) | 5133 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5137) | 5137 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5182) | 5182 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5216) | 5216 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5233) | 5233 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5236) | 5236 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5237) | 5237 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5242) | 5242 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5248) | 5248 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5286) | 5286 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5287) | 5287 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5294) | 5294 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5295) | 5295 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5310) | 5310 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5316) | 5316 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5339) | 5339 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5355) | 5355 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5358) | 5358 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5367) | 5367 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5378) | 5378 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5387) | 5387 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5390) | 5390 |
| [`isSoftwareDetailField`](../../interface/application.js#L5397) | 5397 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5405) | 5405 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5414) | 5414 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5420) | 5420 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5432) | 5432 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5472) | 5472 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5500) | 5500 |
| [`updateInlinePickerCount`](../../interface/application.js#L5509) | 5509 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5515) | 5515 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5528) | 5528 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5537) | 5537 |
| [`fail`](../../interface/application.js#L5543) | 5543 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5597) | 5597 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5613) | 5613 |
| [`fail`](../../interface/application.js#L5618) | 5618 |
| [`serverStorageField`](../../interface/application.js#L5665) | 5665 |
| [`renderServerStorageFields`](../../interface/application.js#L5670) | 5670 |
| [`renderServerStorageFields.action`](../../interface/application.js#L5673) | 5673 |
| [`captureServerStorageValues`](../../interface/application.js#L5685) | 5685 |
| [`refreshServerStorageControls`](../../interface/application.js#L5705) | 5705 |
| [`updateServerStorage`](../../interface/application.js#L5715) | 5715 |
| [`updateServerStorage.vdev`](../../interface/application.js#L5719) | 5719 |
| [`serverStorageDetailRows`](../../interface/application.js#L5727) | 5727 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5737) | 5737 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5767) | 5767 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5773) | 5773 |
| [`getPlatformVersionOptions`](../../interface/application.js#L6139) | 6139 |
| [`isWindowsPlatform`](../../interface/application.js#L6142) | 6142 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L6146) | 6146 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L6149) | 6149 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L6153) | 6153 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L6170) | 6170 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L6174) | 6174 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6194) | 6194 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6221) | 6221 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6270) | 6270 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6278) | 6278 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6289) | 6289 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6293) | 6293 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6305) | 6305 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6317) | 6317 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6344) | 6344 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6348) | 6348 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6352) | 6352 |
| [`getDefaultMountType`](../../interface/application.js#L6365) | 6365 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6368) | 6368 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6373) | 6373 |
| [`initialiseNotesEditor`](../../interface/application.js#L6390) | 6390 |
| [`inlineMarkdown`](../../interface/application.js#L6395) | 6395 |
| [`render`](../../interface/application.js#L6408) | 6408 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6442) | 6442 |
| [`activate`](../../interface/application.js#L6836) | 6836 |
| [`openDeviceModal`](../../interface/application.js#L6917) | 6917 |
| [`syncVmPurpose`](../../interface/application.js#L6967) | 6967 |
| [`clearFieldError`](../../interface/application.js#L7031) | 7031 |
| [`captureDeviceFormDraft`](../../interface/application.js#L7050) | 7050 |
| [`createRackFromDevice`](../../interface/application.js#L7088) | 7088 |
| [`cancelRackFromDevice`](../../interface/application.js#L7096) | 7096 |
| [`createSubnetFromDevice`](../../interface/application.js#L7106) | 7106 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L7119) | 7119 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L7133) | 7133 |
| [`addCustomLocationOption`](../../interface/application.js#L7145) | 7145 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L7185) | 7185 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7197) | 7197 |
| [`finish`](../../interface/application.js#L7217) | 7217 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7242) | 7242 |
| [`finish`](../../interface/application.js#L7256) | 7256 |
| [`handleDeviceSubmit`](../../interface/application.js#L7276) | 7276 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7316) | 7316 |
| [`deleteDevice`](../../interface/application.js#L7465) | 7465 |
| [`personalSafeStorageGet`](../../interface/application.js#L7522) | 7522 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7527) | 7527 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7537) | 7537 |
| [`button`](../../interface/application.js#L7538) | 7538 |
| [`themeChoice`](../../interface/application.js#L7542) | 7542 |
| [`guideLinks`](../../interface/application.js#L7559) | 7559 |
| [`loadSmtpSettings`](../../interface/application.js#L7590) | 7590 |
| [`renderApplicationSettings`](../../interface/application.js#L7605) | 7605 |
| [`syncSmtpForm`](../../interface/application.js#L7609) | 7609 |
| [`updateSmtpFields`](../../interface/application.js#L7631) | 7631 |
| [`hydrateSettings`](../../interface/application.js#L7644) | 7644 |
| [`caffootCompareVersions`](../../interface/application.js#L7666) | 7666 |
| [`parse`](../../interface/application.js#L7667) | 7667 |
| [`caffootShowLicences`](../../interface/application.js#L7689) | 7689 |
| [`caffootUpdateGuide`](../../interface/application.js#L7694) | 7694 |
| [`caffootCheckUpdates`](../../interface/application.js#L7699) | 7699 |
| [`checkInventorySafety`](../../interface/application.js#L7730) | 7730 |
| [`requestInventoryReset`](../../interface/application.js#L7753) | 7753 |
| [`createInventoryBackup`](../../interface/application.js#L7780) | 7780 |
| [`validateBackupVersion`](../../interface/application.js#L7792) | 7792 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7807) | 7807 |
| [`exportData`](../../interface/application.js#L7815) | 7815 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7828) | 7828 |
| [`validateBackupStructure`](../../interface/application.js#L7843) | 7843 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7860) | 7860 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7872) | 7872 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7911) | 7911 |
| [`findRackImportConflicts`](../../interface/application.js#L7915) | 7915 |
| [`place`](../../interface/application.js#L7921) | 7921 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7967) | 7967 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7988) | 7988 |
| [`showBackupImportError`](../../interface/application.js#L7993) | 7993 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7997) | 7997 |
| [`finish`](../../interface/application.js#L8007) | 8007 |
| [`onClick`](../../interface/application.js#L8016) | 8016 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L8026) | 8026 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L8037) | 8037 |
| [`finish`](../../interface/application.js#L8048) | 8048 |
| [`onClick`](../../interface/application.js#L8057) | 8057 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L8072) | 8072 |
| [`importData`](../../interface/application.js#L8088) | 8088 |
| [`reader.onload`](../../interface/application.js#L8098) | 8098 |
| [`reader.onerror`](../../interface/application.js#L8172) | 8172 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8299) | 8299 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8315) | 8315 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8326) | 8326 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8360) | 8360 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8418) | 8418 |
| [`cancel`](../../interface/application.js#L8431) | 8431 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8447) | 8447 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8464) | 8464 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8489) | 8489 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8503) | 8503 |
| [`clearRackDropPreview`](../../interface/application.js#L8506) | 8506 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8511) | 8511 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8523) | 8523 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8529) | 8529 |
| [`trackRackDrag`](../../interface/application.js#L8538) | 8538 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8569) | 8569 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8579) | 8579 |
| [`getRackDropPosition`](../../interface/application.js#L8672) | 8672 |
| [`window.onload`](../../interface/application.js#L9138) | 9138 |
| [`inventorySectionAccess`](../../interface/application.js#L9158) | 9158 |
| [`addDirectoryAccess`](../../interface/application.js#L9159) | 9159 |
| [`canAssignEquipmentSupplier`](../../interface/application.js#L9169) | 9169 |
| [`canSubmitSupplierForm`](../../interface/application.js#L9173) | 9173 |
| [`refreshStockAccess`](../../interface/application.js#L9198) | 9198 |
| [`refreshCentralInventory`](../../interface/application.js#L9208) | 9208 |
| [`postInventory`](../../interface/application.js#L9237) | 9237 |
| [`isBlockedAction`](../../interface/application.js#L9289) | 9289 |
| [`applyAllowedControls`](../../interface/application.js#L9322) | 9322 |
| [`enhanceLongSelects`](../../interface/application.js#L9399) | 9399 |
| [`sync`](../../interface/application.js#L9450) | 9450 |
| [`close`](../../interface/application.js#L9456) | 9456 |
| [`choose`](../../interface/application.js#L9460) | 9460 |
| [`draw`](../../interface/application.js#L9465) | 9465 |
| [`open`](../../interface/application.js#L9483) | 9483 |
| [`enhanceSelects`](../../interface/application.js#L9540) | 9540 |
| [`setDepartmentExpanded`](../../interface/application.js#L9585) | 9585 |
| [`isSupplierPage`](../../interface/application.js#L9601) | 9601 |
| [`landingTab`](../../interface/application.js#L9605) | 9605 |
| [`workspaceHashTab`](../../interface/application.js#L9610) | 9610 |
| [`switchTab`](../../interface/application.js#L9632) | 9632 |
| [`viewSupplierEquipment`](../../interface/application.js#L9668) | 9668 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9686) | 9686 |
| [`openDeviceDetailView`](../../interface/application.js#L9712) | 9712 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9728) | 9728 |
| [`forbidRackMount`](../../interface/application.js#L9787) | 9787 |
| [`installDeviceSupplier`](../../interface/application.js#L9797) | 9797 |
| [`installDeviceStockControls`](../../interface/application.js#L9811) | 9811 |
| [`loadDeviceStockSources`](../../interface/application.js#L9826) | 9826 |
| [`openDeviceModal`](../../interface/application.js#L9865) | 9865 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9909) | 9909 |
| [`relatedChanges`](../../interface/application.js#L9915) | 9915 |
| [`saveDevice`](../../interface/application.js#L9926) | 9926 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9987) | 9987 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9988) | 9988 |
| [`nextIpamBridge.save`](../../interface/application.js#L10010) | 10010 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L10032) | 10032 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L10054) | 10054 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L10097) | 10097 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L10142) | 10142 |
| [`openDeviceIpamLink`](../../interface/application.js#L10146) | 10146 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L10154) | 10154 |
| [`nextSettingsBridge.save`](../../interface/application.js#L10195) | 10195 |
| [`nextRackBridge.save`](../../interface/application.js#L10195) | 10195 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L10212) | 10212 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L10213) | 10213 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L10214) | 10214 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L10228) | 10228 |
| [`nextResetBridge.reset`](../../interface/application.js#L10259) | 10259 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L10286) | 10286 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L10318) | 10318 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L10326) | 10326 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L10335) | 10335 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L10336) | 10336 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L10374) | 10374 |
| [`nextRackBridge.persist`](../../interface/application.js#L10377) | 10377 |
| [`reserveForDelete`](../../interface/application.js#L10399) | 10399 |
| [`removeDevice`](../../interface/application.js#L10407) | 10407 |
| [`cancelDelete`](../../interface/application.js#L10433) | 10433 |
| [`saveArchivedInstallation`](../../interface/application.js#L10439) | 10439 |
| [`nextDeviceBridge.canReadSuppliers`](../../interface/application.js#L10470) | 10470 |
| [`nextDeviceBridge.canAssignSupplier`](../../interface/application.js#L10471) | 10471 |
| [`renderAccountSections`](../../interface/application.js#L10478) | 10478 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10506) | 10506 |
| [`nextRenderAccount`](../../interface/application.js#L10517) | 10517 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10527) | 10527 |
| [`closeEmailVerification`](../../interface/application.js#L10551) | 10551 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10558) | 10558 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10569) | 10569 |
| [`hydrateAccount`](../../interface/application.js#L10623) | 10623 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10661) | 10661 |
| [`loadAccountProfile`](../../interface/application.js#L10674) | 10674 |
| [`removeAccountPhoto`](../../interface/application.js#L10690) | 10690 |
| [`permissionLabel`](../../interface/application.js#L10702) | 10702 |
| [`accountMfaLabel`](../../interface/application.js#L10705) | 10705 |
| [`renderRoleMemberships`](../../interface/application.js#L10708) | 10708 |
| [`renderRoleCatalogue`](../../interface/application.js#L10714) | 10714 |
| [`openRoleLayer`](../../interface/application.js#L10719) | 10719 |
| [`closeRoleLayer`](../../interface/application.js#L10730) | 10730 |
| [`renderRoleDefinition`](../../interface/application.js#L10736) | 10736 |
| [`renderRoleImpact`](../../interface/application.js#L10740) | 10740 |
| [`access`](../../interface/application.js#L10745) | 10745 |
| [`state`](../../interface/application.js#L10749) | 10749 |
| [`requestRoleChange`](../../interface/application.js#L10754) | 10754 |
| [`roleNotificationMessage`](../../interface/application.js#L10761) | 10761 |
| [`previewRoleAction`](../../interface/application.js#L10765) | 10765 |
| [`openRoleEditor`](../../interface/application.js#L10770) | 10770 |
| [`nextRenderUsers`](../../interface/application.js#L10833) | 10833 |
| [`profileFields`](../../interface/application.js#L10835) | 10835 |
| [`stat`](../../interface/application.js#L10856) | 10856 |
| [`bars`](../../interface/application.js#L10859) | 10859 |
| [`operation`](../../interface/application.js#L10915) | 10915 |
| [`filterUserRows`](../../interface/application.js#L10935) | 10935 |
| [`closeUserWorkspace`](../../interface/application.js#L10959) | 10959 |
| [`loadCentralUsers`](../../interface/application.js#L10988) | 10988 |
| [`changeCentralUser`](../../interface/application.js#L10994) | 10994 |
| [`importPanel`](../../interface/application.js#L11005) | 11005 |
| [`cancelImport`](../../interface/application.js#L11009) | 11009 |
| [`nextImportModalClosed`](../../interface/application.js#L11015) | 11015 |
| [`showImportReview`](../../interface/application.js#L11016) | 11016 |
| [`chooseImportFile`](../../interface/application.js#L11056) | 11056 |
| [`actOnImport`](../../interface/application.js#L11073) | 11073 |
| [`canSubmitLifecycleSettings`](../../interface/application.js#L11274) | 11274 |
| [`openLifecycleSettings`](../../interface/application.js#L11277) | 11277 |

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
| [`safe`](../../interface/stock-intake.js#L10) | 10 |
| [`canRead`](../../interface/stock-intake.js#L11) | 11 |
| [`canEdit`](../../interface/stock-intake.js#L12) | 12 |
| [`stockLabel`](../../interface/stock-intake.js#L13) | 13 |
| [`stockNotice`](../../interface/stock-intake.js#L14) | 14 |
| [`stockButton`](../../interface/stock-intake.js#L15) | 15 |
| [`stockCard`](../../interface/stock-intake.js#L16) | 16 |
| [`stockField`](../../interface/stock-intake.js#L17) | 17 |
| [`stockSelect`](../../interface/stock-intake.js#L20) | 20 |
| [`stockTable`](../../interface/stock-intake.js#L23) | 23 |
| [`stockMetrics`](../../interface/stock-intake.js#L26) | 26 |
| [`stockSpecText`](../../interface/stock-intake.js#L29) | 29 |
| [`renderStockReceipt`](../../interface/stock-intake.js#L34) | 34 |
| [`renderStockDetails`](../../interface/stock-intake.js#L69) | 69 |
| [`renderStockInventory`](../../interface/stock-intake.js#L92) | 92 |
| [`stockReportNumber`](../../interface/stock-intake.js#L96) | 96 |
| [`stockReportMetric`](../../interface/stock-intake.js#L97) | 97 |
| [`stockReportTable`](../../interface/stock-intake.js#L102) | 102 |
| [`stockReportBar`](../../interface/stock-intake.js#L105) | 105 |
| [`renderStockOverview`](../../interface/stock-intake.js#L109) | 109 |
| [`stockInventoryMatches`](../../interface/stock-intake.js#L143) | 143 |
| [`stockRegisteredMatches`](../../interface/stock-intake.js#L154) | 154 |
| [`renderStockAssignments`](../../interface/stock-intake.js#L164) | 164 |
| [`stockMovementMatches`](../../interface/stock-intake.js#L169) | 169 |
| [`drillStockReport`](../../interface/stock-intake.js#L180) | 180 |
| [`stockDate`](../../interface/stock-intake.js#L190) | 190 |
| [`stockCheckLabel`](../../interface/stock-intake.js#L191) | 191 |
| [`receiptSupplierCell`](../../interface/stock-intake.js#L192) | 192 |
| [`renderStockHistory`](../../interface/stock-intake.js#L200) | 200 |
| [`clearStock`](../../interface/stock-intake.js#L209) | 209 |
| [`stockRequest`](../../interface/stock-intake.js#L214) | 214 |
| [`refreshStock`](../../interface/stock-intake.js#L223) | 223 |
| [`enterStock`](../../interface/stock-intake.js#L235) | 235 |
| [`renderStock`](../../interface/stock-intake.js#L240) | 240 |
| [`receiptTracking`](../../interface/stock-intake.js#L251) | 251 |
| [`hydrateStock`](../../interface/stock-intake.js#L254) | 254 |
| [`openStockDetails`](../../interface/stock-intake.js#L298) | 298 |
| [`submitStock`](../../interface/stock-intake.js#L306) | 306 |
| [`stockStateLabel`](../../interface/stock-intake.js#L468) | 468 |
| [`stockUnitState`](../../interface/stock-intake.js#L469) | 469 |
| [`stockNote`](../../interface/stock-intake.js#L470) | 470 |
| [`stockWorkflowForm`](../../interface/stock-intake.js#L471) | 471 |
| [`stockIssueReady`](../../interface/stock-intake.js#L479) | 479 |
| [`renderDeviceReissue`](../../interface/stock-intake.js#L480) | 480 |
| [`stockExistingIssueLabel`](../../interface/stock-intake.js#L492) | 492 |
| [`renderStockIssue`](../../interface/stock-intake.js#L499) | 499 |
| [`editStockIssue`](../../interface/stock-intake.js#L513) | 513 |
| [`showStockIssueConfirmation`](../../interface/stock-intake.js#L519) | 519 |
| [`stockReturnSources`](../../interface/stock-intake.js#L541) | 541 |
| [`renderStockReturn`](../../interface/stock-intake.js#L548) | 548 |
| [`renderStockWriteOff`](../../interface/stock-intake.js#L559) | 559 |
| [`stockPreparationRequirement`](../../interface/stock-intake.js#L572) | 572 |
| [`renderStockPreparation`](../../interface/stock-intake.js#L579) | 579 |
| [`renderRegisteredStock`](../../interface/stock-intake.js#L591) | 591 |
| [`renderStockMovements`](../../interface/stock-intake.js#L598) | 598 |
| [`renderStockCorrection`](../../interface/stock-intake.js#L603) | 603 |
| [`renderCorrectionImpact`](../../interface/stock-intake.js#L612) | 612 |
| [`stockReturnCorrectionEntry`](../../interface/stock-intake.js#L617) | 617 |
| [`restoreStockReturn`](../../interface/stock-intake.js#L620) | 620 |
| [`closeStockCorrection`](../../interface/stock-intake.js#L632) | 632 |
| [`leaveStockCorrection`](../../interface/stock-intake.js#L638) | 638 |
| [`openStockCorrection`](../../interface/stock-intake.js#L647) | 647 |
| [`stockCorrectionValues`](../../interface/stock-intake.js#L657) | 657 |
| [`previewStockCorrection`](../../interface/stock-intake.js#L660) | 660 |
| [`scheduleStockCorrection`](../../interface/stock-intake.js#L680) | 680 |
| [`submitStockCorrection`](../../interface/stock-intake.js#L690) | 690 |
| [`stockSelectedReturn`](../../interface/stock-intake.js#L733) | 733 |
| [`stockSelectedWriteOff`](../../interface/stock-intake.js#L734) | 734 |
| [`hydrateStockCirculation`](../../interface/stock-intake.js#L738) | 738 |
| [`loadHandoverRecipients`](../../interface/stock-intake.js#L817) | 817 |
| [`loadStockRecipients`](../../interface/stock-intake.js#L843) | 843 |
| [`submitStockCirculation`](../../interface/stock-intake.js#L854) | 854 |
| [`openStockWorkflow`](../../interface/stock-intake.js#L920) | 920 |
| [`openDirectHandover`](../../interface/stock-intake.js#L927) | 927 |
| [`prepareReceipt`](../../interface/stock-intake.js#L935) | 935 |
| [`hydrateStockPage`](../../interface/stock-intake.js#L942) | 942 |
| [`dismissHandover`](../../interface/stock-intake.js#L970) | 970 |
| [`configureStock`](../../interface/stock-intake.js#L971) | 971 |

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
| [`change_device_catalogue`](../../backend/device_catalogue.py#L16) | 16 |

## backend/device_rack_fields.py

| Function | Line |
| --- | ---: |
| [`prepare_device_rack_fields`](../../backend/device_rack_fields.py#L8) | 8 |

## backend/device_saves.py

| Function | Line |
| --- | ---: |
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L37) | 37 |
| [`_validate_device_identity_change`](../../backend/device_saves.py#L56) | 56 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L76) | 76 |
| [`_persist_related_guests`](../../backend/device_saves.py#L122) | 122 |
| [`save_reserved_device`](../../backend/device_saves.py#L135) | 135 |
| [`create_device_in_transaction`](../../backend/device_saves.py#L289) | 289 |
| [`create_device`](../../backend/device_saves.py#L367) | 367 |
| [`delete_reserved_device`](../../backend/device_saves.py#L382) | 382 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](../../backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](../../backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](../../backend/feature_settings.py#L28) | 28 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_subnet_batch_reason`](../../backend/history_permissions.py#L35) | 35 |
| [`visible_change_history`](../../backend/history_permissions.py#L63) | 63 |

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
| [`project_inventory_response`](../../backend/inventory_projection.py#L10) | 10 |
| [`count_basic_ips_outside_subnets`](../../backend/inventory_projection.py#L47) | 47 |

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
| [`set_account_active`](../../backend/permissions.py#L107) | 107 |
| [`delete_user`](../../backend/permissions.py#L146) | 146 |
| [`set_administrator`](../../backend/permissions.py#L174) | 174 |
| [`can_replace_inventory`](../../backend/permissions.py#L215) | 215 |

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
| [`initialise_database`](../../backend/schema.py#L67) | 67 |
| [`migrate_staff_directory`](../../backend/schema.py#L275) | 275 |
| [`migrate_role_permissions`](../../backend/schema.py#L340) | 340 |
| [`verify_role_migration`](../../backend/schema.py#L425) | 425 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L451) | 451 |
| [`migrate_it_staff_stock_default`](../../backend/schema.py#L545) | 545 |
| [`migrate_device_assignments`](../../backend/schema.py#L573) | 573 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L104) | 104 |
| [`connect`](../../backend/server.py#L122) | 122 |
| [`initialise_database`](../../backend/server.py#L130) | 130 |
| [`Handler.end_headers`](../../backend/server.py#L136) | 136 |
| [`Handler.do_GET`](../../backend/server.py#L143) | 143 |
| [`Handler.do_POST`](../../backend/server.py#L520) | 520 |
| [`Handler.handle_supplier_request`](../../backend/server.py#L707) | 707 |
| [`Handler.handle_stock_request`](../../backend/server.py#L788) | 788 |
| [`Handler.handle_equipment_request`](../../backend/server.py#L877) | 877 |
| [`Handler.handle_directory_request`](../../backend/server.py#L958) | 958 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L1035) | 1035 |
| [`Handler.handle_role_change`](../../backend/server.py#L1084) | 1084 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L1126) | 1126 |
| [`Handler.handle_account_email`](../../backend/server.py#L1527) | 1527 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1607) | 1607 |
| [`Handler.handle_import`](../../backend/server.py#L1638) | 1638 |
| [`Handler.respond`](../../backend/server.py#L1714) | 1714 |
| [`main`](../../backend/server.py#L1727) | 1727 |

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
| [`stock_json`](../../backend/stock_intake.py#L20) | 20 |
| [`stock_access`](../../backend/stock_intake.py#L25) | 25 |
| [`stock_text`](../../backend/stock_intake.py#L31) | 31 |
| [`stock_quantity`](../../backend/stock_intake.py#L44) | 44 |
| [`stock_checks`](../../backend/stock_intake.py#L50) | 50 |
| [`stock_specifications`](../../backend/stock_intake.py#L57) | 57 |
| [`stock_configuration`](../../backend/stock_intake.py#L81) | 81 |
| [`stock_digest`](../../backend/stock_intake.py#L86) | 86 |
| [`stock_item`](../../backend/stock_intake.py#L90) | 90 |
| [`stock_history`](../../backend/stock_intake.py#L150) | 150 |
| [`read_stock`](../../backend/stock_intake.py#L185) | 185 |
| [`project_stock_details`](../../backend/stock_intake.py#L199) | 199 |
| [`stock_operation`](../../backend/stock_intake.py#L214) | 214 |
| [`stock_replay`](../../backend/stock_intake.py#L223) | 223 |
| [`append_stock_fact`](../../backend/stock_intake.py#L241) | 241 |
| [`stock_write_access`](../../backend/stock_intake.py#L267) | 267 |
| [`receive_stock`](../../backend/stock_intake.py#L273) | 273 |
| [`update_stock_readiness`](../../backend/stock_intake.py#L370) | 370 |

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
| [`validate_feature_table`](../../backend/stock_schema.py#L516) | 516 |
| [`validate_it_asset_stock`](../../backend/stock_schema.py#L558) | 558 |
| [`migrate_it_asset_stock`](../../backend/stock_schema.py#L588) | 588 |

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
| [`require_device_stock_access`](../../backend/device_stock.py#L16) | 16 |
| [`registration_source_ready`](../../backend/device_stock.py#L24) | 24 |
| [`device_stock_sources`](../../backend/device_stock.py#L29) | 29 |
| [`validate_registration_identity`](../../backend/device_stock.py#L48) | 48 |
| [`register_stock_device`](../../backend/device_stock.py#L66) | 66 |
| [`device_ready_for_reissue`](../../backend/device_stock.py#L106) | 106 |
| [`reissue_device_choices`](../../backend/device_stock.py#L116) | 116 |
| [`reissue_stock_device`](../../backend/device_stock.py#L124) | 124 |

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
| [`supplier_access`](../../backend/suppliers.py#L14) | 14 |
| [`fields`](../../backend/suppliers.py#L19) | 19 |
| [`cleaned`](../../backend/suppliers.py#L25) | 25 |
| [`web_address`](../../backend/suppliers.py#L38) | 38 |
| [`identities`](../../backend/suppliers.py#L54) | 54 |
| [`text_list`](../../backend/suppliers.py#L62) | 62 |
| [`contact_values`](../../backend/suppliers.py#L68) | 68 |
| [`address`](../../backend/suppliers.py#L93) | 93 |
| [`directory_categories`](../../backend/suppliers.py#L101) | 101 |
| [`read_directory`](../../backend/suppliers.py#L109) | 109 |
| [`get_supplier`](../../backend/suppliers.py#L133) | 133 |
| [`supply_sections`](../../backend/suppliers.py#L144) | 144 |
| [`supplier_delete_reason`](../../backend/suppliers.py#L150) | 150 |
| [`contact_delete_reason`](../../backend/suppliers.py#L160) | 160 |
| [`location_delete_reason`](../../backend/suppliers.py#L168) | 168 |
| [`read_supplier`](../../backend/suppliers.py#L176) | 176 |
| [`log_change`](../../backend/suppliers.py#L222) | 222 |
| [`child_record`](../../backend/suppliers.py#L230) | 230 |
| [`confirmed`](../../backend/suppliers.py#L241) | 241 |
| [`require_revision`](../../backend/suppliers.py#L246) | 246 |
| [`save_categories`](../../backend/suppliers.py#L251) | 251 |
| [`save_company`](../../backend/suppliers.py#L269) | 269 |
| [`save_category`](../../backend/suppliers.py#L310) | 310 |
| [`set_archived`](../../backend/suppliers.py#L346) | 346 |
| [`save_location`](../../backend/suppliers.py#L355) | 355 |
| [`save_contact`](../../backend/suppliers.py#L372) | 372 |
| [`save_note`](../../backend/suppliers.py#L405) | 405 |
| [`log_note`](../../backend/suppliers.py#L430) | 430 |
| [`change_company_status`](../../backend/suppliers.py#L436) | 436 |
| [`change_child`](../../backend/suppliers.py#L474) | 474 |
| [`read_issue_rows`](../../backend/suppliers.py#L514) | 514 |
| [`read_issues`](../../backend/suppliers.py#L541) | 541 |
| [`read_purchasing_dashboard`](../../backend/suppliers.py#L545) | 545 |
| [`read_issue`](../../backend/suppliers.py#L554) | 554 |
| [`issue_snapshot`](../../backend/suppliers.py#L586) | 586 |
| [`save_issue`](../../backend/suppliers.py#L594) | 594 |
| [`write_issue_update`](../../backend/suppliers.py#L646) | 646 |
| [`correct_issue_update`](../../backend/suppliers.py#L669) | 669 |
| [`save_supplier_operation`](../../backend/suppliers.py#L694) | 694 |
| [`read_supply_impact`](../../backend/suppliers.py#L740) | 740 |

## interface/suppliers.js

| Function | Line |
| --- | ---: |
| [`supplierTabs`](../../interface/suppliers.js#L13) | 13 |
| [`safe`](../../interface/suppliers.js#L18) | 18 |
| [`icon`](../../interface/suppliers.js#L19) | 19 |
| [`editable`](../../interface/suppliers.js#L20) | 20 |
| [`list`](../../interface/suppliers.js#L21) | 21 |
| [`locationAddress`](../../interface/suppliers.js#L22) | 22 |
| [`labelStatus`](../../interface/suppliers.js#L23) | 23 |
| [`badge`](../../interface/suppliers.js#L24) | 24 |
| [`findContact`](../../interface/suppliers.js#L25) | 25 |
| [`findLocation`](../../interface/suppliers.js#L26) | 26 |
| [`findNote`](../../interface/suppliers.js#L27) | 27 |
| [`options`](../../interface/suppliers.js#L28) | 28 |
| [`button`](../../interface/suppliers.js#L31) | 31 |
| [`nameButton`](../../interface/suppliers.js#L34) | 34 |
| [`header`](../../interface/suppliers.js#L37) | 37 |
| [`sectionHeading`](../../interface/suppliers.js#L44) | 44 |
| [`table`](../../interface/suppliers.js#L47) | 47 |
| [`emptyRow`](../../interface/suppliers.js#L52) | 52 |
| [`field`](../../interface/suppliers.js#L55) | 55 |
| [`select`](../../interface/suppliers.js#L61) | 61 |
| [`toolSearch`](../../interface/suppliers.js#L65) | 65 |
| [`card`](../../interface/suppliers.js#L71) | 71 |
| [`info`](../../interface/suppliers.js#L74) | 74 |
| [`webLink`](../../interface/suppliers.js#L77) | 77 |
| [`categoryTags`](../../interface/suppliers.js#L85) | 85 |
| [`directoryResults`](../../interface/suppliers.js#L89) | 89 |
| [`renderDirectory`](../../interface/suppliers.js#L99) | 99 |
| [`contactScope`](../../interface/suppliers.js#L113) | 113 |
| [`lifecycleActions`](../../interface/suppliers.js#L119) | 119 |
| [`lifecycleButtons`](../../interface/suppliers.js#L133) | 133 |
| [`renderOverview`](../../interface/suppliers.js#L137) | 137 |
| [`renderLocations`](../../interface/suppliers.js#L156) | 156 |
| [`contactRows`](../../interface/suppliers.js#L174) | 174 |
| [`renderContacts`](../../interface/suppliers.js#L183) | 183 |
| [`formatDate`](../../interface/suppliers.js#L193) | 193 |
| [`time`](../../interface/suppliers.js#L196) | 196 |
| [`noteCards`](../../interface/suppliers.js#L197) | 197 |
| [`renderNotes`](../../interface/suppliers.js#L208) | 208 |
| [`issueCategoryName`](../../interface/suppliers.js#L214) | 214 |
| [`issueCategoryLabel`](../../interface/suppliers.js#L217) | 217 |
| [`issueStatusBadge`](../../interface/suppliers.js#L221) | 221 |
| [`issueButton`](../../interface/suppliers.js#L224) | 224 |
| [`issueRows`](../../interface/suppliers.js#L228) | 228 |
| [`issuesList`](../../interface/suppliers.js#L236) | 236 |
| [`renderNotesIssues`](../../interface/suppliers.js#L243) | 243 |
| [`renderAllIssues`](../../interface/suppliers.js#L252) | 252 |
| [`dashboardIcon`](../../interface/suppliers.js#L257) | 257 |
| [`dashboardMetric`](../../interface/suppliers.js#L260) | 260 |
| [`dashboardCard`](../../interface/suppliers.js#L264) | 264 |
| [`renderPurchasing`](../../interface/suppliers.js#L268) | 268 |
| [`equipmentRows`](../../interface/suppliers.js#L301) | 301 |
| [`renderEquipment`](../../interface/suppliers.js#L312) | 312 |
| [`renderDetails`](../../interface/suppliers.js#L324) | 324 |
| [`render`](../../interface/suppliers.js#L338) | 338 |
| [`request`](../../interface/suppliers.js#L349) | 349 |
| [`readRoute`](../../interface/suppliers.js#L358) | 358 |
| [`writeRoute`](../../interface/suppliers.js#L364) | 364 |
| [`show`](../../interface/suppliers.js#L369) | 369 |
| [`mountEquipmentChooser`](../../interface/suppliers.js#L418) | 418 |
| [`mountEquipmentChooser.value`](../../interface/suppliers.js#L444) | 444 |
| [`mountEquipmentChooser.describe`](../../interface/suppliers.js#L445) | 445 |
| [`mountEquipmentChooser.close`](../../interface/suppliers.js#L449) | 449 |
| [`mountEquipmentChooser.choose`](../../interface/suppliers.js#L456) | 456 |
| [`mountEquipmentChooser.show`](../../interface/suppliers.js#L463) | 463 |
| [`mountEquipmentChooser.loadChoices`](../../interface/suppliers.js#L481) | 481 |
| [`openEquipmentAssignment`](../../interface/suppliers.js#L544) | 544 |
| [`dialog`](../../interface/suppliers.js#L576) | 576 |
| [`lines`](../../interface/suppliers.js#L592) | 592 |
| [`valueOf`](../../interface/suppliers.js#L593) | 593 |
| [`selectedIds`](../../interface/suppliers.js#L594) | 594 |
| [`addressFields`](../../interface/suppliers.js#L595) | 595 |
| [`readAddress`](../../interface/suppliers.js#L601) | 601 |
| [`checkList`](../../interface/suppliers.js#L604) | 604 |
| [`formSection`](../../interface/suppliers.js#L609) | 609 |
| [`contactEntry`](../../interface/suppliers.js#L613) | 613 |
| [`supplierForm`](../../interface/suppliers.js#L623) | 623 |
| [`locationForm`](../../interface/suppliers.js#L656) | 656 |
| [`contactForm`](../../interface/suppliers.js#L668) | 668 |
| [`contactDetails`](../../interface/suppliers.js#L700) | 700 |
| [`noteForm`](../../interface/suppliers.js#L717) | 717 |
| [`issueCategoryOptions`](../../interface/suppliers.js#L727) | 727 |
| [`issueUpdates`](../../interface/suppliers.js#L731) | 731 |
| [`issueDialog`](../../interface/suppliers.js#L739) | 739 |
| [`openIssue`](../../interface/suppliers.js#L786) | 786 |
| [`refreshAfterIssueSave`](../../interface/suppliers.js#L795) | 795 |
| [`correctIssueUpdate`](../../interface/suppliers.js#L799) | 799 |
| [`addInlineIssueCategory`](../../interface/suppliers.js#L817) | 817 |
| [`toggleInlineCategory`](../../interface/suppliers.js#L839) | 839 |
| [`applyIssueCategories`](../../interface/suppliers.js#L846) | 846 |
| [`categoriesDialog`](../../interface/suppliers.js#L853) | 853 |
| [`categoryForm`](../../interface/suppliers.js#L865) | 865 |
| [`command`](../../interface/suppliers.js#L874) | 874 |
| [`updateSupplier`](../../interface/suppliers.js#L883) | 883 |
| [`updateCategories`](../../interface/suppliers.js#L894) | 894 |
| [`statusConfirmation`](../../interface/suppliers.js#L905) | 905 |
| [`supplyConfirmation`](../../interface/suppliers.js#L935) | 935 |
| [`refreshRows`](../../interface/suppliers.js#L951) | 951 |
| [`caffootSuppliers.configure`](../../interface/suppliers.js#L1118) | 1118 |
| [`caffootSuppliers.enter`](../../interface/suppliers.js#L1121) | 1121 |
| [`caffootSuppliers.leave`](../../interface/suppliers.js#L1125) | 1125 |
| [`caffootSuppliers.closed`](../../interface/suppliers.js#L1132) | 1132 |

## backend/equipment_supplier_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_equipment_suppliers`](../../backend/equipment_supplier_schema.py#L30) | 30 |

## backend/equipment_suppliers.py

| Function | Line |
| --- | ---: |
| [`read_supplier_choices`](../../backend/equipment_suppliers.py#L13) | 13 |
| [`selectable_supplier`](../../backend/equipment_suppliers.py#L24) | 24 |
| [`device_supplier_values`](../../backend/equipment_suppliers.py#L37) | 37 |
| [`write_device_supplier`](../../backend/equipment_suppliers.py#L54) | 54 |
| [`read_device_suppliers`](../../backend/equipment_suppliers.py#L74) | 74 |
| [`read_receipt_suppliers`](../../backend/equipment_suppliers.py#L86) | 86 |
| [`write_receipt_supplier`](../../backend/equipment_suppliers.py#L103) | 103 |
| [`assign_equipment_supplier`](../../backend/equipment_suppliers.py#L114) | 114 |
| [`equipment_revisions`](../../backend/equipment_suppliers.py#L156) | 156 |
| [`assign_device_suppliers`](../../backend/equipment_suppliers.py#L170) | 170 |
| [`receipt_visible_to_equipment_reader`](../../backend/equipment_suppliers.py#L190) | 190 |
| [`assign_receipt_suppliers`](../../backend/equipment_suppliers.py#L200) | 200 |
| [`read_supplied_equipment`](../../backend/equipment_suppliers.py#L218) | 218 |

## backend/equipment_lifecycle.py

| Function | Line |
| --- | ---: |
| [`utc_today`](../../backend/equipment_lifecycle.py#L28) | 28 |
| [`physical_device`](../../backend/equipment_lifecycle.py#L32) | 32 |
| [`calendar_date`](../../backend/equipment_lifecycle.py#L37) | 37 |
| [`add_calendar_years`](../../backend/equipment_lifecycle.py#L51) | 51 |
| [`warning_state`](../../backend/equipment_lifecycle.py#L61) | 61 |
| [`lifecycle_configuration`](../../backend/equipment_lifecycle.py#L72) | 72 |
| [`display_type`](../../backend/equipment_lifecycle.py#L79) | 79 |
| [`lifecycle_types`](../../backend/equipment_lifecycle.py#L83) | 83 |
| [`device_type_availability`](../../backend/equipment_lifecycle.py#L106) | 106 |
| [`require_selectable_device_type`](../../backend/equipment_lifecycle.py#L117) | 117 |
| [`read_lifecycle_settings`](../../backend/equipment_lifecycle.py#L132) | 132 |
| [`whole_number`](../../backend/equipment_lifecycle.py#L139) | 139 |
| [`save_lifecycle_settings`](../../backend/equipment_lifecycle.py#L147) | 147 |
| [`device_lifecycle_values`](../../backend/equipment_lifecycle.py#L205) | 205 |
| [`write_device_lifecycle`](../../backend/equipment_lifecycle.py#L212) | 212 |
| [`project_device_lifecycle`](../../backend/equipment_lifecycle.py#L243) | 243 |
| [`capture_first_service_from_stock`](../../backend/equipment_lifecycle.py#L268) | 268 |

## backend/equipment_lifecycle_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_equipment_lifecycle`](../../backend/equipment_lifecycle_schema.py#L6) | 6 |

## interface/lifecycle.js

| Function | Line |
| --- | ---: |
| [`addYears`](../../interface/lifecycle.js#L22) | 22 |
| [`renderDetails`](../../interface/lifecycle.js#L31) | 31 |
| [`bindEditor`](../../interface/lifecycle.js#L40) | 40 |
| [`renderDashboard`](../../interface/lifecycle.js#L118) | 118 |
| [`bindDashboard`](../../interface/lifecycle.js#L150) | 150 |
