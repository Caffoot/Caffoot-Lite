# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the indexed application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 1474.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`returnToExistingSignIn`](../../interface/loader.js#L8) | 8 |
| [`window.fetch`](../../interface/loader.js#L13) | 13 |
| [`renderInterfaceTemplate`](../../interface/loader.js#L38) | 38 |
| [`loadInterfaceText`](../../interface/loader.js#L46) | 46 |
| [`initialiseInterface`](../../interface/loader.js#L52) | 52 |
| [`staffScript.onerror`](../../interface/loader.js#L99) | 99 |
| [`staffScript.onload`](../../interface/loader.js#L100) | 100 |
| [`script.onerror`](../../interface/loader.js#L103) | 103 |
| [`script.onload`](../../interface/loader.js#L104) | 104 |
| [`stockScript.onerror`](../../interface/loader.js#L107) | 107 |
| [`stockScript.onload`](../../interface/loader.js#L108) | 108 |
| [`supplierScript.onerror`](../../interface/loader.js#L111) | 111 |
| [`supplierScript.onload`](../../interface/loader.js#L112) | 112 |
| [`lifecycleScript.onerror`](../../interface/loader.js#L115) | 115 |
| [`lifecycleScript.onload`](../../interface/loader.js#L116) | 116 |
| [`ukDatesScript.onerror`](../../interface/loader.js#L119) | 119 |
| [`ukDatesScript.onload`](../../interface/loader.js#L120) | 120 |
| [`serviceDeskScript.onerror`](../../interface/loader.js#L123) | 123 |
| [`serviceDeskScript.onload`](../../interface/loader.js#L124) | 124 |
| [`emailTemplatesScript.onerror`](../../interface/loader.js#L127) | 127 |
| [`emailTemplatesScript.onload`](../../interface/loader.js#L128) | 128 |
| [`loadApplication`](../../interface/loader.js#L139) | 139 |
| [`applicationScript.onerror`](../../interface/loader.js#L142) | 142 |
| [`showInterfaceLoadError`](../../interface/loader.js#L151) | 151 |

## interface/application.js

| Function | Line |
| --- | ---: |
| [`publicDeviceTypeName`](../../interface/application.js#L17) | 17 |
| [`cloneDefaultData`](../../interface/application.js#L29) | 29 |
| [`isPlainObject`](../../interface/application.js#L33) | 33 |
| [`isValidIpv4`](../../interface/application.js#L37) | 37 |
| [`parseIpv4AddressToNumber`](../../interface/application.js#L47) | 47 |
| [`formatIpv4Address`](../../interface/application.js#L51) | 51 |
| [`parseSupportedIpv4Subnet`](../../interface/application.js#L54) | 54 |
| [`isUsableHostAddressInSubnet`](../../interface/application.js#L63) | 63 |
| [`isValidCidr24`](../../interface/application.js#L67) | 67 |
| [`hierarchyIpNumber`](../../interface/application.js#L71) | 71 |
| [`hierarchyIpString`](../../interface/application.js#L76) | 76 |
| [`hierarchyParseCidr`](../../interface/application.js#L77) | 77 |
| [`hierarchyValidate`](../../interface/application.js#L85) | 85 |
| [`ancestor`](../../interface/application.js#L125) | 125 |
| [`independentNetworkInsideBlock`](../../interface/application.js#L135) | 135 |
| [`hierarchyValidateTypes`](../../interface/application.js#L150) | 150 |
| [`previewLegacyVlanOwnershipInApp`](../../interface/application.js#L181) | 181 |
| [`reconcileLegacyVlanOwnership`](../../interface/application.js#L195) | 195 |
| [`migrateLegacyRackLocation`](../../interface/application.js#L233) | 233 |
| [`normaliseLegacyRackAccessoryTypes`](../../interface/application.js#L247) | 247 |
| [`normaliseState`](../../interface/application.js#L254) | 254 |
| [`validateApplicationState`](../../interface/application.js#L423) | 423 |
| [`loadStoredState`](../../interface/application.js#L490) | 490 |
| [`showStorageRecoveryBanner`](../../interface/application.js#L496) | 496 |
| [`download.onclick`](../../interface/application.js#L511) | 511 |
| [`reset.onclick`](../../interface/application.js#L520) | 520 |
| [`caffootThemePreference`](../../interface/application.js#L561) | 561 |
| [`caffootApplyTheme`](../../interface/application.js#L568) | 568 |
| [`caffootSetTheme`](../../interface/application.js#L582) | 582 |
| [`onSystemThemeChange`](../../interface/application.js#L593) | 593 |
| [`toggleDarkMode`](../../interface/application.js#L602) | 602 |
| [`readAuditHistory`](../../interface/application.js#L609) | 609 |
| [`auditChanges`](../../interface/application.js#L613) | 613 |
| [`recordAudit`](../../interface/application.js#L650) | 650 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L659) | 659 |
| [`exportAuditHistory`](../../interface/application.js#L671) | 671 |
| [`auditVisibleRows`](../../interface/application.js#L683) | 683 |
| [`auditDate`](../../interface/application.js#L705) | 705 |
| [`renderAuditHTML`](../../interface/application.js#L709) | 709 |
| [`hydrateAudit`](../../interface/application.js#L748) | 748 |
| [`applyAuditFilters`](../../interface/application.js#L756) | 756 |
| [`closeAuditDetail`](../../interface/application.js#L791) | 791 |
| [`showAuditDetail`](../../interface/application.js#L797) | 797 |
| [`nextRenderUsers`](../../interface/application.js#L826) | 826 |
| [`nextRenderAccount`](../../interface/application.js#L828) | 828 |
| [`hydrateAccount`](../../interface/application.js#L829) | 829 |
| [`removeAccountPhoto`](../../interface/application.js#L830) | 830 |
| [`saveState`](../../interface/application.js#L833) | 833 |
| [`getDeviceById`](../../interface/application.js#L836) | 836 |
| [`findDeviceUsingIp`](../../interface/application.js#L840) | 840 |
| [`setDevicePrimaryIp`](../../interface/application.js#L845) | 845 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L904) | 904 |
| [`isRackMountedDevice`](../../interface/application.js#L917) | 917 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L920) | 920 |
| [`getRackShelfLocation`](../../interface/application.js#L932) | 932 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L938) | 938 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L954) | 954 |
| [`openRackShelfCreation`](../../interface/application.js#L972) | 972 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L986) | 986 |
| [`createRackShelfFromDevice`](../../interface/application.js#L996) | 996 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L1003) | 1003 |
| [`options`](../../interface/application.js#L1009) | 1009 |
| [`validateRackPlacement`](../../interface/application.js#L1030) | 1030 |
| [`showNotification`](../../interface/application.js#L1066) | 1066 |
| [`showToast`](../../interface/application.js#L1080) | 1080 |
| [`toggleSidebar`](../../interface/application.js#L1164) | 1164 |
| [`switchTab`](../../interface/application.js#L1183) | 1183 |
| [`escapeHtml`](../../interface/application.js#L1218) | 1218 |
| [`inlineJsArg`](../../interface/application.js#L1227) | 1227 |
| [`browserStorageWarning`](../../interface/application.js#L1235) | 1235 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1238) | 1238 |
| [`renderSectionTabIcon`](../../interface/application.js#L1244) | 1244 |
| [`renderSectionHeader`](../../interface/application.js#L1250) | 1250 |
| [`tab`](../../interface/application.js#L1251) | 1251 |
| [`revealSectionTab`](../../interface/application.js#L1278) | 1278 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1285) | 1285 |
| [`renderContent`](../../interface/application.js#L1305) | 1305 |
| [`updateScrollHint`](../../interface/application.js#L1374) | 1374 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1385) | 1385 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1420) | 1420 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1424) | 1424 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1428) | 1428 |
| [`buildInventoryReportData`](../../interface/application.js#L1434) | 1434 |
| [`occupancy`](../../interface/application.js#L1450) | 1450 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1473) | 1473 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1479) | 1479 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1505) | 1505 |
| [`renderDashboardHTML`](../../interface/application.js#L1534) | 1534 |
| [`statusPill`](../../interface/application.js#L1640) | 1640 |
| [`insightSegment`](../../interface/application.js#L1657) | 1657 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1703) | 1703 |
| [`getCategoryIcon`](../../interface/application.js#L1720) | 1720 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1735) | 1735 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1744) | 1744 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1749) | 1749 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1764) | 1764 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1779) | 1779 |
| [`printRackElevation`](../../interface/application.js#L1789) | 1789 |
| [`safe`](../../interface/application.js#L1792) | 1792 |
| [`printRackElevationInFrame`](../../interface/application.js#L1823) | 1823 |
| [`frame.onload`](../../interface/application.js#L1833) | 1833 |
| [`renderRackHubV13`](../../interface/application.js#L1854) | 1854 |
| [`card`](../../interface/application.js#L1859) | 1859 |
| [`mark`](../../interface/application.js#L1868) | 1868 |
| [`bar`](../../interface/application.js#L1884) | 1884 |
| [`chartBox`](../../interface/application.js#L1885) | 1885 |
| [`chartRows`](../../interface/application.js#L1886) | 1886 |
| [`rackSpaceGuide`](../../interface/application.js#L1888) | 1888 |
| [`renderRacksHTML`](../../interface/application.js#L1957) | 1957 |
| [`changeRack`](../../interface/application.js#L2024) | 2024 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L2043) | 2043 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L2050) | 2050 |
| [`getVisibleDevices`](../../interface/application.js#L2056) | 2056 |
| [`filterHardwareModels`](../../interface/application.js#L2081) | 2081 |
| [`openCatalogueModal`](../../interface/application.js#L2120) | 2120 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2129) | 2129 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2153) | 2153 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2191) | 2191 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2203) | 2203 |
| [`renderCatalogueButton`](../../interface/application.js#L2220) | 2220 |
| [`renderCatalogueRecord`](../../interface/application.js#L2224) | 2224 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2229) | 2229 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2248) | 2248 |
| [`add`](../../interface/application.js#L2250) | 2250 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2295) | 2295 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2302) | 2302 |
| [`openHardwareModelManager`](../../interface/application.js#L2314) | 2314 |
| [`opts`](../../interface/application.js#L2319) | 2319 |
| [`saveHardwareModel`](../../interface/application.js#L2337) | 2337 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2366) | 2366 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2380) | 2380 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2402) | 2402 |
| [`add`](../../interface/application.js#L2404) | 2404 |
| [`options`](../../interface/application.js#L2440) | 2440 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2454) | 2454 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2469) | 2469 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2484) | 2484 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2492) | 2492 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2503) | 2503 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2512) | 2512 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2534) | 2534 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2545) | 2545 |
| [`openServerServiceEditor`](../../interface/application.js#L2562) | 2562 |
| [`saveServerServiceEntry`](../../interface/application.js#L2571) | 2571 |
| [`restoreArchivedServerService`](../../interface/application.js#L2584) | 2584 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2593) | 2593 |
| [`renderDevicesHTML`](../../interface/application.js#L2605) | 2605 |
| [`renderHardwareMetric`](../../interface/application.js#L2613) | 2613 |
| [`renderHardwareChart`](../../interface/application.js#L2618) | 2618 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2628) | 2628 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2647) | 2647 |
| [`renderArchivedSoftware`](../../interface/application.js#L2655) | 2655 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2694) | 2694 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2701) | 2701 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2702) | 2702 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2703) | 2703 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2706) | 2706 |
| [`openManageTypesModal`](../../interface/application.js#L2726) | 2726 |
| [`openManageLocationsModal`](../../interface/application.js#L2727) | 2727 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2730) | 2730 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2752) | 2752 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2759) | 2759 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2767) | 2767 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2787) | 2787 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2788) | 2788 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2789) | 2789 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2804) | 2804 |
| [`deleteDeviceType`](../../interface/application.js#L2824) | 2824 |
| [`deleteDeviceLocation`](../../interface/application.js#L2825) | 2825 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2833) | 2833 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2837) | 2837 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2864) | 2864 |
| [`nodes`](../../interface/application.js#L2874) | 2874 |
| [`renderIpamManage`](../../interface/application.js#L2900) | 2900 |
| [`renderIpamHTML`](../../interface/application.js#L2951) | 2951 |
| [`changeSubnet`](../../interface/application.js#L3112) | 3112 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3125) | 3125 |
| [`openIpamModal`](../../interface/application.js#L3151) | 3151 |
| [`openBulkIpModal`](../../interface/application.js#L3156) | 3156 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3163) | 3163 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3167) | 3167 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3186) | 3186 |
| [`applyBulkIpChanges`](../../interface/application.js#L3202) | 3202 |
| [`subnetCidrFeedback`](../../interface/application.js#L3216) | 3216 |
| [`suggestSubnetGateway`](../../interface/application.js#L3234) | 3234 |
| [`openSubnetModal`](../../interface/application.js#L3262) | 3262 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3266) | 3266 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3292) | 3292 |
| [`handleSubnetSubmit`](../../interface/application.js#L3312) | 3312 |
| [`showSubnetFormError`](../../interface/application.js#L3519) | 3519 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3535) | 3535 |
| [`subnetNameConflicts`](../../interface/application.js#L3549) | 3549 |
| [`subnetHasVlan`](../../interface/application.js#L3556) | 3556 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3559) | 3559 |
| [`openMultipleSubnets`](../../interface/application.js#L3567) | 3567 |
| [`option`](../../interface/application.js#L3569) | 3569 |
| [`visibility`](../../interface/application.js#L3574) | 3574 |
| [`planningVisibility`](../../interface/application.js#L3578) | 3578 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3596) | 3596 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3608) | 3608 |
| [`read`](../../interface/application.js#L3610) | 3610 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3628) | 3628 |
| [`reject`](../../interface/application.js#L3630) | 3630 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3667) | 3667 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3671) | 3671 |
| [`add`](../../interface/application.js#L3674) | 3674 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3701) | 3701 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3709) | 3709 |
| [`field`](../../interface/application.js#L3712) | 3712 |
| [`capture`](../../interface/application.js#L3722) | 3722 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3756) | 3756 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3760) | 3760 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3766) | 3766 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3787) | 3787 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3791) | 3791 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3795) | 3795 |
| [`deleteSubnet`](../../interface/application.js#L3806) | 3806 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3866) | 3866 |
| [`deleteSubnetCommit`](../../interface/application.js#L3894) | 3894 |
| [`deleteVlan`](../../interface/application.js#L3924) | 3924 |
| [`openIpModal`](../../interface/application.js#L3950) | 3950 |
| [`handleIpSubmit`](../../interface/application.js#L3967) | 3967 |
| [`openEquipmentSupplierModal`](../../interface/application.js#L4032) | 4032 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L4046) | 4046 |
| [`modalFormSnapshot`](../../interface/application.js#L4056) | 4056 |
| [`stockFormHasChanges`](../../interface/application.js#L4075) | 4075 |
| [`rememberModalForm`](../../interface/application.js#L4079) | 4079 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L4084) | 4084 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L4114) | 4114 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4133) | 4133 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4142) | 4142 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4148) | 4148 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4154) | 4154 |
| [`closeModal`](../../interface/application.js#L4163) | 4163 |
| [`openModal`](../../interface/application.js#L4217) | 4217 |
| [`readRackDimension`](../../interface/application.js#L4290) | 4290 |
| [`formatRackDimension`](../../interface/application.js#L4297) | 4297 |
| [`rackPhysicalDetails`](../../interface/application.js#L4302) | 4302 |
| [`openRackModal`](../../interface/application.js#L4311) | 4311 |
| [`handleRackSubmit`](../../interface/application.js#L4327) | 4327 |
| [`deleteRack`](../../interface/application.js#L4394) | 4394 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4416) | 4416 |
| [`refresh`](../../interface/application.js#L4439) | 4439 |
| [`openAssignDeviceModal`](../../interface/application.js#L4516) | 4516 |
| [`refresh`](../../interface/application.js#L4533) | 4533 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4540) | 4540 |
| [`handleAssignSubmit`](../../interface/application.js#L4574) | 4574 |
| [`unassignDevice`](../../interface/application.js#L4619) | 4619 |
| [`getSubnetForIp`](../../interface/application.js#L4636) | 4636 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4640) | 4640 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4687) | 4687 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4696) | 4696 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4705) | 4705 |
| [`inside`](../../interface/application.js#L4712) | 4712 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4730) | 4730 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4739) | 4739 |
| [`toggleDeviceMountType`](../../interface/application.js#L4783) | 4783 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4807) | 4807 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4812) | 4812 |
| [`openDeviceReviewModal`](../../interface/application.js#L4830) | 4830 |
| [`openDeviceDetailView`](../../interface/application.js#L4835) | 4835 |
| [`safe`](../../interface/application.js#L4845) | 4845 |
| [`field`](../../interface/application.js#L4846) | 4846 |
| [`section`](../../interface/application.js#L4851) | 4851 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4903) | 4903 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4909) | 4909 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4928) | 4928 |
| [`navigateToDeviceRack`](../../interface/application.js#L4947) | 4947 |
| [`duplicateDevice`](../../interface/application.js#L4975) | 4975 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L5045) | 5045 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L5050) | 5050 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L5055) | 5055 |
| [`openServerServiceManager`](../../interface/application.js#L5056) | 5056 |
| [`captureServerServiceSelections`](../../interface/application.js#L5061) | 5061 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L5067) | 5067 |
| [`confirmServerServiceArchive`](../../interface/application.js#L5088) | 5088 |
| [`archiveServerService`](../../interface/application.js#L5096) | 5096 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L5122) | 5122 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L5126) | 5126 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L5144) | 5144 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L5148) | 5148 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L5151) | 5151 |
| [`updateHardwareCatalogue`](../../interface/application.js#L5158) | 5158 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5186) | 5186 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5190) | 5190 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5235) | 5235 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5269) | 5269 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5286) | 5286 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5289) | 5289 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5290) | 5290 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5295) | 5295 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5301) | 5301 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5339) | 5339 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5340) | 5340 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5347) | 5347 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5348) | 5348 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5363) | 5363 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5369) | 5369 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5392) | 5392 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5408) | 5408 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5411) | 5411 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5420) | 5420 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5431) | 5431 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5440) | 5440 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5443) | 5443 |
| [`isSoftwareDetailField`](../../interface/application.js#L5450) | 5450 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5458) | 5458 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5467) | 5467 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5473) | 5473 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5485) | 5485 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5525) | 5525 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5553) | 5553 |
| [`updateInlinePickerCount`](../../interface/application.js#L5562) | 5562 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5568) | 5568 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5581) | 5581 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5590) | 5590 |
| [`fail`](../../interface/application.js#L5596) | 5596 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5650) | 5650 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5666) | 5666 |
| [`fail`](../../interface/application.js#L5671) | 5671 |
| [`serverStorageField`](../../interface/application.js#L5718) | 5718 |
| [`renderServerStorageFields`](../../interface/application.js#L5723) | 5723 |
| [`renderServerStorageFields.action`](../../interface/application.js#L5726) | 5726 |
| [`captureServerStorageValues`](../../interface/application.js#L5738) | 5738 |
| [`refreshServerStorageControls`](../../interface/application.js#L5758) | 5758 |
| [`updateServerStorage`](../../interface/application.js#L5768) | 5768 |
| [`updateServerStorage.vdev`](../../interface/application.js#L5772) | 5772 |
| [`serverStorageDetailRows`](../../interface/application.js#L5780) | 5780 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5790) | 5790 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5820) | 5820 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5826) | 5826 |
| [`getPlatformVersionOptions`](../../interface/application.js#L6192) | 6192 |
| [`isWindowsPlatform`](../../interface/application.js#L6195) | 6195 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L6199) | 6199 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L6202) | 6202 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L6206) | 6206 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L6223) | 6223 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L6227) | 6227 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6247) | 6247 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6274) | 6274 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6323) | 6323 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6331) | 6331 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6342) | 6342 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6346) | 6346 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6358) | 6358 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6370) | 6370 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6397) | 6397 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6401) | 6401 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6405) | 6405 |
| [`getDefaultMountType`](../../interface/application.js#L6418) | 6418 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6421) | 6421 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6426) | 6426 |
| [`initialiseNotesEditor`](../../interface/application.js#L6443) | 6443 |
| [`inlineMarkdown`](../../interface/application.js#L6448) | 6448 |
| [`render`](../../interface/application.js#L6461) | 6461 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6495) | 6495 |
| [`activate`](../../interface/application.js#L6889) | 6889 |
| [`openDeviceModal`](../../interface/application.js#L6970) | 6970 |
| [`selectableType`](../../interface/application.js#L6978) | 6978 |
| [`syncVmPurpose`](../../interface/application.js#L7020) | 7020 |
| [`clearFieldError`](../../interface/application.js#L7084) | 7084 |
| [`captureDeviceFormDraft`](../../interface/application.js#L7105) | 7105 |
| [`createRackFromDevice`](../../interface/application.js#L7143) | 7143 |
| [`cancelRackFromDevice`](../../interface/application.js#L7151) | 7151 |
| [`createSubnetFromDevice`](../../interface/application.js#L7161) | 7161 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L7174) | 7174 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L7188) | 7188 |
| [`addCustomLocationOption`](../../interface/application.js#L7200) | 7200 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L7240) | 7240 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7252) | 7252 |
| [`finish`](../../interface/application.js#L7272) | 7272 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7297) | 7297 |
| [`finish`](../../interface/application.js#L7311) | 7311 |
| [`handleDeviceSubmit`](../../interface/application.js#L7331) | 7331 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7371) | 7371 |
| [`deleteDevice`](../../interface/application.js#L7520) | 7520 |
| [`personalSafeStorageGet`](../../interface/application.js#L7577) | 7577 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7582) | 7582 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7592) | 7592 |
| [`button`](../../interface/application.js#L7593) | 7593 |
| [`themeChoice`](../../interface/application.js#L7597) | 7597 |
| [`guideLinks`](../../interface/application.js#L7614) | 7614 |
| [`loadSmtpSettings`](../../interface/application.js#L7645) | 7645 |
| [`renderApplicationSettings`](../../interface/application.js#L7660) | 7660 |
| [`syncSmtpForm`](../../interface/application.js#L7664) | 7664 |
| [`updateSmtpFields`](../../interface/application.js#L7686) | 7686 |
| [`hydrateSettings`](../../interface/application.js#L7699) | 7699 |
| [`caffootCompareVersions`](../../interface/application.js#L7723) | 7723 |
| [`parse`](../../interface/application.js#L7724) | 7724 |
| [`caffootShowLicences`](../../interface/application.js#L7746) | 7746 |
| [`caffootUpdateGuide`](../../interface/application.js#L7751) | 7751 |
| [`caffootCheckUpdates`](../../interface/application.js#L7756) | 7756 |
| [`checkInventorySafety`](../../interface/application.js#L7787) | 7787 |
| [`requestInventoryReset`](../../interface/application.js#L7810) | 7810 |
| [`createInventoryBackup`](../../interface/application.js#L7840) | 7840 |
| [`validateBackupVersion`](../../interface/application.js#L7852) | 7852 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7867) | 7867 |
| [`exportData`](../../interface/application.js#L7875) | 7875 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7888) | 7888 |
| [`validateBackupStructure`](../../interface/application.js#L7903) | 7903 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7920) | 7920 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7932) | 7932 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7971) | 7971 |
| [`findRackImportConflicts`](../../interface/application.js#L7975) | 7975 |
| [`place`](../../interface/application.js#L7981) | 7981 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L8027) | 8027 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L8048) | 8048 |
| [`showBackupImportError`](../../interface/application.js#L8053) | 8053 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L8057) | 8057 |
| [`finish`](../../interface/application.js#L8067) | 8067 |
| [`onClick`](../../interface/application.js#L8076) | 8076 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L8086) | 8086 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L8097) | 8097 |
| [`finish`](../../interface/application.js#L8108) | 8108 |
| [`onClick`](../../interface/application.js#L8117) | 8117 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L8132) | 8132 |
| [`importData`](../../interface/application.js#L8148) | 8148 |
| [`reader.onload`](../../interface/application.js#L8158) | 8158 |
| [`reader.onerror`](../../interface/application.js#L8232) | 8232 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8359) | 8359 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8375) | 8375 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8386) | 8386 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8420) | 8420 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8478) | 8478 |
| [`cancel`](../../interface/application.js#L8491) | 8491 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8507) | 8507 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8524) | 8524 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8549) | 8549 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8563) | 8563 |
| [`clearRackDropPreview`](../../interface/application.js#L8566) | 8566 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8571) | 8571 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8583) | 8583 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8589) | 8589 |
| [`trackRackDrag`](../../interface/application.js#L8598) | 8598 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8629) | 8629 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8639) | 8639 |
| [`getRackDropPosition`](../../interface/application.js#L8732) | 8732 |
| [`window.onload`](../../interface/application.js#L9201) | 9201 |
| [`inventorySectionAccess`](../../interface/application.js#L9223) | 9223 |
| [`addDirectoryAccess`](../../interface/application.js#L9224) | 9224 |
| [`canAssignEquipmentSupplier`](../../interface/application.js#L9236) | 9236 |
| [`canSubmitServiceDeskForm`](../../interface/application.js#L9240) | 9240 |
| [`canSubmitSupplierForm`](../../interface/application.js#L9247) | 9247 |
| [`refreshStockAccess`](../../interface/application.js#L9272) | 9272 |
| [`refreshCentralInventory`](../../interface/application.js#L9284) | 9284 |
| [`postInventory`](../../interface/application.js#L9313) | 9313 |
| [`isBlockedAction`](../../interface/application.js#L9369) | 9369 |
| [`applyAllowedControls`](../../interface/application.js#L9403) | 9403 |
| [`enhanceLongSelects`](../../interface/application.js#L9483) | 9483 |
| [`sync`](../../interface/application.js#L9535) | 9535 |
| [`close`](../../interface/application.js#L9541) | 9541 |
| [`choose`](../../interface/application.js#L9545) | 9545 |
| [`draw`](../../interface/application.js#L9550) | 9550 |
| [`open`](../../interface/application.js#L9568) | 9568 |
| [`enhanceSelects`](../../interface/application.js#L9625) | 9625 |
| [`setDepartmentExpanded`](../../interface/application.js#L9670) | 9670 |
| [`isSupplierPage`](../../interface/application.js#L9686) | 9686 |
| [`landingTab`](../../interface/application.js#L9690) | 9690 |
| [`workspaceHashTab`](../../interface/application.js#L9710) | 9710 |
| [`switchTab`](../../interface/application.js#L9734) | 9734 |
| [`navigate`](../../interface/application.js#L9776) | 9776 |
| [`viewSupplierEquipment`](../../interface/application.js#L9783) | 9783 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9801) | 9801 |
| [`openDeviceDetailView`](../../interface/application.js#L9827) | 9827 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9843) | 9843 |
| [`forbidRackMount`](../../interface/application.js#L9902) | 9902 |
| [`installDeviceSupplier`](../../interface/application.js#L9912) | 9912 |
| [`installDeviceStockControls`](../../interface/application.js#L9926) | 9926 |
| [`loadDeviceStockSources`](../../interface/application.js#L9941) | 9941 |
| [`select.onchange`](../../interface/application.js#L9954) | 9954 |
| [`openDeviceModal`](../../interface/application.js#L9980) | 9980 |
| [`nextDeviceModalClosed`](../../interface/application.js#L10024) | 10024 |
| [`relatedChanges`](../../interface/application.js#L10030) | 10030 |
| [`saveDevice`](../../interface/application.js#L10041) | 10041 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L10102) | 10102 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L10103) | 10103 |
| [`nextIpamBridge.save`](../../interface/application.js#L10125) | 10125 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L10147) | 10147 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L10169) | 10169 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L10212) | 10212 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L10257) | 10257 |
| [`openDeviceIpamLink`](../../interface/application.js#L10261) | 10261 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L10269) | 10269 |
| [`nextSettingsBridge.save`](../../interface/application.js#L10310) | 10310 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L10327) | 10327 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L10328) | 10328 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L10329) | 10329 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L10343) | 10343 |
| [`nextResetBridge.reset`](../../interface/application.js#L10374) | 10374 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L10401) | 10401 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L10433) | 10433 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L10441) | 10441 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L10450) | 10450 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L10451) | 10451 |
| [`nextRackBridge.save`](../../interface/application.js#L10486) | 10486 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L10489) | 10489 |
| [`nextRackBridge.persist`](../../interface/application.js#L10492) | 10492 |
| [`reserveForDelete`](../../interface/application.js#L10514) | 10514 |
| [`removeDevice`](../../interface/application.js#L10522) | 10522 |
| [`cancelDelete`](../../interface/application.js#L10548) | 10548 |
| [`saveArchivedInstallation`](../../interface/application.js#L10554) | 10554 |
| [`nextDeviceBridge.canReadSuppliers`](../../interface/application.js#L10585) | 10585 |
| [`nextDeviceBridge.canAssignSupplier`](../../interface/application.js#L10586) | 10586 |
| [`renderAccountSections`](../../interface/application.js#L10593) | 10593 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10621) | 10621 |
| [`nextRenderAccount`](../../interface/application.js#L10632) | 10632 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10642) | 10642 |
| [`closeEmailVerification`](../../interface/application.js#L10666) | 10666 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10673) | 10673 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10684) | 10684 |
| [`hydrateAccount`](../../interface/application.js#L10738) | 10738 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10777) | 10777 |
| [`loadAccountProfile`](../../interface/application.js#L10790) | 10790 |
| [`removeAccountPhoto`](../../interface/application.js#L10806) | 10806 |
| [`permissionLabel`](../../interface/application.js#L10818) | 10818 |
| [`accountMfaLabel`](../../interface/application.js#L10821) | 10821 |
| [`renderRoleMemberships`](../../interface/application.js#L10824) | 10824 |
| [`renderRoleCatalogue`](../../interface/application.js#L10830) | 10830 |
| [`openRoleLayer`](../../interface/application.js#L10835) | 10835 |
| [`closeRoleLayer`](../../interface/application.js#L10846) | 10846 |
| [`renderRoleDefinition`](../../interface/application.js#L10852) | 10852 |
| [`renderRoleImpact`](../../interface/application.js#L10856) | 10856 |
| [`access`](../../interface/application.js#L10861) | 10861 |
| [`state`](../../interface/application.js#L10861) | 10861 |
| [`requestRoleChange`](../../interface/application.js#L10870) | 10870 |
| [`roleNotificationMessage`](../../interface/application.js#L10877) | 10877 |
| [`previewRoleAction`](../../interface/application.js#L10881) | 10881 |
| [`openRoleEditor`](../../interface/application.js#L10886) | 10886 |
| [`nextRenderUsers`](../../interface/application.js#L10949) | 10949 |
| [`stat`](../../interface/application.js#L10962) | 10962 |
| [`bars`](../../interface/application.js#L10965) | 10965 |
| [`renderUserWorkspace`](../../interface/application.js#L10989) | 10989 |
| [`operation`](../../interface/application.js#L10996) | 10996 |
| [`updateUserWorkspace`](../../interface/application.js#L11006) | 11006 |
| [`openUserWorkspace`](../../interface/application.js#L11016) | 11016 |
| [`closeUserWorkspace`](../../interface/application.js#L11032) | 11032 |
| [`openStaffAdministration`](../../interface/application.js#L11046) | 11046 |
| [`loadCentralUsers`](../../interface/application.js#L11065) | 11065 |
| [`changeCentralUser`](../../interface/application.js#L11072) | 11072 |
| [`importPanel`](../../interface/application.js#L11085) | 11085 |
| [`cancelImport`](../../interface/application.js#L11089) | 11089 |
| [`nextImportModalClosed`](../../interface/application.js#L11095) | 11095 |
| [`showImportReview`](../../interface/application.js#L11096) | 11096 |
| [`chooseImportFile`](../../interface/application.js#L11138) | 11138 |
| [`actOnImport`](../../interface/application.js#L11159) | 11159 |
| [`selectAccountTab`](../../interface/application.js#L11197) | 11197 |
| [`canSubmitLifecycleSettings`](../../interface/application.js#L11369) | 11369 |
| [`openLifecycleSettings`](../../interface/application.js#L11372) | 11372 |
| [`close`](../../interface/application.js#L11391) | 11391 |
| [`leaveLifecycleSettings`](../../interface/application.js#L11397) | 11397 |

## interface/sign-in.js

| Function | Line |
| --- | ---: |
| [`$`](../../interface/sign-in.js#L2) | 2 |
| [`applySignInTheme`](../../interface/sign-in.js#L5) | 5 |
| [`showMfaQr`](../../interface/sign-in.js#L21) | 21 |
| [`showSession`](../../interface/sign-in.js#L30) | 30 |
| [`request`](../../interface/sign-in.js#L40) | 40 |
| [`display`](../../interface/sign-in.js#L44) | 44 |
| [`showRecoveryFeedback`](../../interface/sign-in.js#L166) | 166 |
| [`resetRecoveryFlow`](../../interface/sign-in.js#L171) | 171 |
| [`clearRequiredMfaDisplay`](../../interface/sign-in.js#L228) | 228 |

## interface/staff-directory.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](../../interface/staff-directory.js#L10) | 10 |
| [`displayDeviceType`](../../interface/staff-directory.js#L11) | 11 |
| [`displayName`](../../interface/staff-directory.js#L12) | 12 |
| [`departmentName`](../../interface/staff-directory.js#L13) | 13 |
| [`isAdministrator`](../../interface/staff-directory.js#L14) | 14 |
| [`canReadStaff`](../../interface/staff-directory.js#L15) | 15 |
| [`canEditStaff`](../../interface/staff-directory.js#L16) | 16 |
| [`canReadDepartments`](../../interface/staff-directory.js#L17) | 17 |
| [`canEditDepartments`](../../interface/staff-directory.js#L18) | 18 |
| [`icon`](../../interface/staff-directory.js#L19) | 19 |
| [`button`](../../interface/staff-directory.js#L20) | 20 |
| [`badge`](../../interface/staff-directory.js#L21) | 21 |
| [`header`](../../interface/staff-directory.js#L22) | 22 |
| [`renderStaffDirectory`](../../interface/staff-directory.js#L25) | 25 |
| [`detailRow`](../../interface/staff-directory.js#L31) | 31 |
| [`renderStaffDetails`](../../interface/staff-directory.js#L32) | 32 |
| [`renderStaffLogin`](../../interface/staff-directory.js#L36) | 36 |
| [`field`](../../interface/staff-directory.js#L46) | 46 |
| [`sharedStaffField`](../../interface/staff-directory.js#L47) | 47 |
| [`renderStaffForm`](../../interface/staff-directory.js#L57) | 57 |
| [`cardHeading`](../../interface/staff-directory.js#L65) | 65 |
| [`renderDepartments`](../../interface/staff-directory.js#L90) | 90 |
| [`departmentCard`](../../interface/staff-directory.js#L95) | 95 |
| [`departmentNotice`](../../interface/staff-directory.js#L98) | 98 |
| [`departmentDate`](../../interface/staff-directory.js#L101) | 101 |
| [`departmentTable`](../../interface/staff-directory.js#L105) | 105 |
| [`departmentAssignmentRows`](../../interface/staff-directory.js#L108) | 108 |
| [`renderDepartmentOverview`](../../interface/staff-directory.js#L112) | 112 |
| [`renderDepartmentStaff`](../../interface/staff-directory.js#L123) | 123 |
| [`renderDepartmentEquipment`](../../interface/staff-directory.js#L128) | 128 |
| [`renderDepartmentHistory`](../../interface/staff-directory.js#L137) | 137 |
| [`renderDepartmentDetails`](../../interface/staff-directory.js#L146) | 146 |
| [`selectDepartmentTab`](../../interface/staff-directory.js#L153) | 153 |
| [`loadDepartmentDetails`](../../interface/staff-directory.js#L159) | 159 |
| [`request`](../../interface/staff-directory.js#L185) | 185 |
| [`readAll`](../../interface/staff-directory.js#L196) | 196 |
| [`refresh`](../../interface/staff-directory.js#L206) | 206 |
| [`render`](../../interface/staff-directory.js#L224) | 224 |
| [`enter`](../../interface/staff-directory.js#L246) | 246 |
| [`openStaffWorkspace`](../../interface/staff-directory.js#L255) | 255 |
| [`redraw`](../../interface/staff-directory.js#L264) | 264 |
| [`showStaffConflict`](../../interface/staff-directory.js#L265) | 265 |
| [`refreshStaffRecord`](../../interface/staff-directory.js#L273) | 273 |
| [`saveStaff`](../../interface/staff-directory.js#L289) | 289 |
| [`openDepartmentDialog`](../../interface/staff-directory.js#L324) | 324 |
| [`closeDepartmentDialog`](../../interface/staff-directory.js#L335) | 335 |
| [`saveDepartment`](../../interface/staff-directory.js#L336) | 336 |
| [`configure`](../../interface/staff-directory.js#L343) | 343 |
| [`showForm`](../../interface/staff-directory.js#L371) | 371 |
| [`getStaffMember`](../../interface/staff-directory.js#L468) | 468 |
| [`employmentControl`](../../interface/staff-directory.js#L469) | 469 |
| [`equipmentChanged`](../../interface/staff-directory.js#L473) | 473 |

## interface/equipment.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](../../interface/equipment.js#L5) | 5 |
| [`displayDeviceType`](../../interface/equipment.js#L6) | 6 |
| [`dateLabel`](../../interface/equipment.js#L7) | 7 |
| [`button`](../../interface/equipment.js#L8) | 8 |
| [`canReadAssociations`](../../interface/equipment.js#L9) | 9 |
| [`request`](../../interface/equipment.js#L10) | 10 |
| [`assignmentHistory`](../../interface/equipment.js#L16) | 16 |
| [`assetMovementHistory`](../../interface/equipment.js#L21) | 21 |
| [`staffPlaceholder`](../../interface/equipment.js#L26) | 26 |
| [`loadStaffEquipment`](../../interface/equipment.js#L30) | 30 |
| [`loadDeviceEquipment`](../../interface/equipment.js#L39) | 39 |
| [`loadAssociatedEquipment`](../../interface/equipment.js#L51) | 51 |
| [`openAssociatedEquipment`](../../interface/equipment.js#L67) | 67 |
| [`renderMyEquipment`](../../interface/equipment.js#L75) | 75 |
| [`loadMyEquipment`](../../interface/equipment.js#L78) | 78 |
| [`list`](../../interface/equipment.js#L81) | 81 |
| [`hydrate`](../../interface/equipment.js#L96) | 96 |
| [`showAssignmentDialog`](../../interface/equipment.js#L100) | 100 |
| [`searchRecipients`](../../interface/equipment.js#L111) | 111 |
| [`searchDevices`](../../interface/equipment.js#L120) | 120 |
| [`leaveAssignmentDialog`](../../interface/equipment.js#L128) | 128 |
| [`saveAssignment`](../../interface/equipment.js#L134) | 134 |
| [`caffootEquipment.configure`](../../interface/equipment.js#L188) | 188 |

## interface/stock-intake.js

| Function | Line |
| --- | ---: |
| [`safe`](../../interface/stock-intake.js#L10) | 10 |
| [`displayStockType`](../../interface/stock-intake.js#L12) | 12 |
| [`canRead`](../../interface/stock-intake.js#L13) | 13 |
| [`canEdit`](../../interface/stock-intake.js#L14) | 14 |
| [`stockTodayIso`](../../interface/stock-intake.js#L16) | 16 |
| [`stockLabel`](../../interface/stock-intake.js#L22) | 22 |
| [`stockNotice`](../../interface/stock-intake.js#L23) | 23 |
| [`stockButton`](../../interface/stock-intake.js#L24) | 24 |
| [`stockCard`](../../interface/stock-intake.js#L25) | 25 |
| [`stockField`](../../interface/stock-intake.js#L26) | 26 |
| [`stockSelect`](../../interface/stock-intake.js#L29) | 29 |
| [`stockTable`](../../interface/stock-intake.js#L32) | 32 |
| [`stockMetrics`](../../interface/stock-intake.js#L35) | 35 |
| [`stockSpecText`](../../interface/stock-intake.js#L38) | 38 |
| [`renderStockReceipt`](../../interface/stock-intake.js#L43) | 43 |
| [`renderStockDetails`](../../interface/stock-intake.js#L78) | 78 |
| [`renderStockInventory`](../../interface/stock-intake.js#L101) | 101 |
| [`stockReportNumber`](../../interface/stock-intake.js#L105) | 105 |
| [`stockReportMetric`](../../interface/stock-intake.js#L106) | 106 |
| [`stockReportTable`](../../interface/stock-intake.js#L111) | 111 |
| [`stockReportBar`](../../interface/stock-intake.js#L114) | 114 |
| [`renderStockOverview`](../../interface/stock-intake.js#L118) | 118 |
| [`stockInventoryMatches`](../../interface/stock-intake.js#L152) | 152 |
| [`stockRegisteredMatches`](../../interface/stock-intake.js#L163) | 163 |
| [`renderStockAssignments`](../../interface/stock-intake.js#L173) | 173 |
| [`stockMovementMatches`](../../interface/stock-intake.js#L178) | 178 |
| [`drillStockReport`](../../interface/stock-intake.js#L189) | 189 |
| [`stockDateText`](../../interface/stock-intake.js#L200) | 200 |
| [`stockDate`](../../interface/stock-intake.js#L204) | 204 |
| [`stockRecordedDate`](../../interface/stock-intake.js#L206) | 206 |
| [`stockCheckLabel`](../../interface/stock-intake.js#L213) | 213 |
| [`receiptSupplierCell`](../../interface/stock-intake.js#L214) | 214 |
| [`renderStockHistory`](../../interface/stock-intake.js#L222) | 222 |
| [`clearStock`](../../interface/stock-intake.js#L231) | 231 |
| [`stockRequest`](../../interface/stock-intake.js#L236) | 236 |
| [`refreshStock`](../../interface/stock-intake.js#L245) | 245 |
| [`enterStock`](../../interface/stock-intake.js#L257) | 257 |
| [`renderStock`](../../interface/stock-intake.js#L262) | 262 |
| [`receiptTracking`](../../interface/stock-intake.js#L273) | 273 |
| [`hydrateStock`](../../interface/stock-intake.js#L276) | 276 |
| [`openStockDetails`](../../interface/stock-intake.js#L320) | 320 |
| [`submitStock`](../../interface/stock-intake.js#L328) | 328 |
| [`stockStateLabel`](../../interface/stock-intake.js#L490) | 490 |
| [`stockUnitState`](../../interface/stock-intake.js#L491) | 491 |
| [`stockNote`](../../interface/stock-intake.js#L492) | 492 |
| [`stockWorkflowForm`](../../interface/stock-intake.js#L493) | 493 |
| [`stockIssueReady`](../../interface/stock-intake.js#L501) | 501 |
| [`renderDeviceReissue`](../../interface/stock-intake.js#L502) | 502 |
| [`stockExistingIssueLabel`](../../interface/stock-intake.js#L514) | 514 |
| [`renderStockIssue`](../../interface/stock-intake.js#L521) | 521 |
| [`editStockIssue`](../../interface/stock-intake.js#L535) | 535 |
| [`showStockIssueConfirmation`](../../interface/stock-intake.js#L541) | 541 |
| [`stockReturnSources`](../../interface/stock-intake.js#L563) | 563 |
| [`renderStockReturn`](../../interface/stock-intake.js#L570) | 570 |
| [`renderStockWriteOff`](../../interface/stock-intake.js#L581) | 581 |
| [`stockPreparationRequirement`](../../interface/stock-intake.js#L594) | 594 |
| [`renderStockPreparation`](../../interface/stock-intake.js#L601) | 601 |
| [`renderRegisteredStock`](../../interface/stock-intake.js#L613) | 613 |
| [`renderStockMovements`](../../interface/stock-intake.js#L620) | 620 |
| [`renderStockCorrection`](../../interface/stock-intake.js#L625) | 625 |
| [`renderCorrectionImpact`](../../interface/stock-intake.js#L634) | 634 |
| [`stockReturnCorrectionEntry`](../../interface/stock-intake.js#L639) | 639 |
| [`restoreStockReturn`](../../interface/stock-intake.js#L642) | 642 |
| [`closeStockCorrection`](../../interface/stock-intake.js#L654) | 654 |
| [`leaveStockCorrection`](../../interface/stock-intake.js#L660) | 660 |
| [`proceed`](../../interface/stock-intake.js#L662) | 662 |
| [`openStockCorrection`](../../interface/stock-intake.js#L669) | 669 |
| [`stockCorrectionValues`](../../interface/stock-intake.js#L679) | 679 |
| [`previewStockCorrection`](../../interface/stock-intake.js#L682) | 682 |
| [`scheduleStockCorrection`](../../interface/stock-intake.js#L702) | 702 |
| [`submitStockCorrection`](../../interface/stock-intake.js#L712) | 712 |
| [`stockSelectedReturn`](../../interface/stock-intake.js#L755) | 755 |
| [`stockSelectedWriteOff`](../../interface/stock-intake.js#L756) | 756 |
| [`hydrateStockCirculation`](../../interface/stock-intake.js#L760) | 760 |
| [`loadHandoverRecipients`](../../interface/stock-intake.js#L839) | 839 |
| [`loadStockRecipients`](../../interface/stock-intake.js#L865) | 865 |
| [`submitStockCirculation`](../../interface/stock-intake.js#L876) | 876 |
| [`openStockWorkflow`](../../interface/stock-intake.js#L942) | 942 |
| [`openDirectHandover`](../../interface/stock-intake.js#L949) | 949 |
| [`prepareReceipt`](../../interface/stock-intake.js#L957) | 957 |
| [`hydrateStockPage`](../../interface/stock-intake.js#L964) | 964 |
| [`dismissHandover`](../../interface/stock-intake.js#L992) | 992 |
| [`configureStock`](../../interface/stock-intake.js#L993) | 993 |

## interface/service-desk.js

| Function | Line |
| --- | ---: |
| [`requestServiceDesk`](../../interface/service-desk.js#L18) | 18 |
| [`requestTickets`](../../interface/service-desk.js#L37) | 37 |
| [`ticketNumber`](../../interface/service-desk.js#L41) | 41 |
| [`ticketOptions`](../../interface/service-desk.js#L45) | 45 |
| [`ticketDate`](../../interface/service-desk.js#L52) | 52 |
| [`ticketTag`](../../interface/service-desk.js#L56) | 56 |
| [`renderTicketQueue`](../../interface/service-desk.js#L60) | 60 |
| [`renderEmployeeTicketQueue`](../../interface/service-desk.js#L66) | 66 |
| [`renderTicketRows`](../../interface/service-desk.js#L70) | 70 |
| [`renderSupportWeek`](../../interface/service-desk.js#L85) | 85 |
| [`readSupportWeek`](../../interface/service-desk.js#L100) | 100 |
| [`renderSupportLists`](../../interface/service-desk.js#L116) | 116 |
| [`bindSupportTabs`](../../interface/service-desk.js#L136) | 136 |
| [`selectSupportTab`](../../interface/service-desk.js#L138) | 138 |
| [`hydrateServiceDeskSettings`](../../interface/service-desk.js#L160) | 160 |
| [`showSupportFeedback`](../../interface/service-desk.js#L173) | 173 |
| [`updateSupportHours`](../../interface/service-desk.js#L179) | 179 |
| [`saveSupportSettings`](../../interface/service-desk.js#L185) | 185 |
| [`renderReportActivity`](../../interface/service-desk.js#L296) | 296 |
| [`hydrateTicketReporting`](../../interface/service-desk.js#L315) | 315 |
| [`requestReport`](../../interface/service-desk.js#L327) | 327 |
| [`selectReportPeriod`](../../interface/service-desk.js#L357) | 357 |
| [`hydrateTicketQueue`](../../interface/service-desk.js#L382) | 382 |
| [`refreshQueue`](../../interface/service-desk.js#L394) | 394 |
| [`changeTicketFilters`](../../interface/service-desk.js#L455) | 455 |
| [`resetTicketFilters`](../../interface/service-desk.js#L463) | 463 |
| [`selectEmployeeScope`](../../interface/service-desk.js#L508) | 508 |
| [`renderTicketEquipmentPanel`](../../interface/service-desk.js#L567) | 567 |
| [`hydrateTicketEquipment`](../../interface/service-desk.js#L575) | 575 |
| [`refreshEquipmentTickets`](../../interface/service-desk.js#L582) | 582 |
| [`openTicketWindow`](../../interface/service-desk.js#L611) | 611 |
| [`showTicketError`](../../interface/service-desk.js#L618) | 618 |
| [`ticketDialogActive`](../../interface/service-desk.js#L624) | 624 |
| [`openCreateTicket`](../../interface/service-desk.js#L628) | 628 |
| [`updateTicketSoftware`](../../interface/service-desk.js#L690) | 690 |
| [`openTicketDetails`](../../interface/service-desk.js#L716) | 716 |
| [`refreshTicketDetails`](../../interface/service-desk.js#L724) | 724 |
| [`ticketFact`](../../interface/service-desk.js#L745) | 745 |
| [`renderTicketOverview`](../../interface/service-desk.js#L749) | 749 |
| [`edit`](../../interface/service-desk.js#L750) | 750 |
| [`renderEmployeeTicketOverview`](../../interface/service-desk.js#L768) | 768 |
| [`ticketFileInput`](../../interface/service-desk.js#L792) | 792 |
| [`renderTicketUpdates`](../../interface/service-desk.js#L797) | 797 |
| [`ticketHistoryText`](../../interface/service-desk.js#L843) | 843 |
| [`renderTicketHistory`](../../interface/service-desk.js#L866) | 866 |
| [`ticketActions`](../../interface/service-desk.js#L874) | 874 |
| [`showTicketTab`](../../interface/service-desk.js#L881) | 881 |
| [`ticketActionForm`](../../interface/service-desk.js#L939) | 939 |
| [`ticketSelect`](../../interface/service-desk.js#L946) | 946 |
| [`openTicketAction`](../../interface/service-desk.js#L951) | 951 |
| [`checkAssignment`](../../interface/service-desk.js#L1007) | 1007 |
| [`editTicketClassification`](../../interface/service-desk.js#L1014) | 1014 |
| [`ticketAttachmentPayload`](../../interface/service-desk.js#L1036) | 1036 |
| [`saveTicketForm`](../../interface/service-desk.js#L1056) | 1056 |
| [`closeTicketDialog`](../../interface/service-desk.js#L1165) | 1165 |
| [`configure`](../../interface/service-desk.js#L1177) | 1177 |
| [`canRead`](../../interface/service-desk.js#L1178) | 1178 |
| [`canUseEmployee`](../../interface/service-desk.js#L1179) | 1179 |

## backend/access_point_review.py

| Function | Line |
| --- | ---: |
| [`find_access_point_mount_conflicts`](../../backend/access_point_review.py#L19) | 19 |
| [`apply_access_point_mount_choices`](../../backend/access_point_review.py#L45) | 45 |

## backend/account_email.py

| Function | Line |
| --- | ---: |
| [`queue_email`](../../backend/account_email.py#L36) | 36 |
| [`queue_email.deliver`](../../backend/account_email.py#L41) | 41 |
| [`email_proof_secret`](../../backend/account_email.py#L68) | 68 |
| [`_digest`](../../backend/account_email.py#L105) | 105 |
| [`email_attempts_remaining`](../../backend/account_email.py#L114) | 114 |
| [`issue_email_proof`](../../backend/account_email.py#L123) | 123 |
| [`confirm_email_proof`](../../backend/account_email.py#L154) | 154 |
| [`security_recipients`](../../backend/account_email.py#L213) | 213 |
| [`notify_security_change`](../../backend/account_email.py#L228) | 228 |
| [`role_change_notifications`](../../backend/account_email.py#L252) | 252 |
| [`record_blocked_sign_in`](../../backend/account_email.py#L282) | 282 |

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
| [`device_assignment_dependency`](../../backend/device_assignments.py#L32) | 32 |
| [`assignment_device_choices`](../../backend/device_assignments.py#L50) | 50 |
| [`read_assignments`](../../backend/device_assignments.py#L73) | 73 |
| [`assign_devices`](../../backend/device_assignments.py#L154) | 154 |
| [`my_equipment`](../../backend/device_assignments.py#L206) | 206 |

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
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L38) | 38 |
| [`_validate_device_identity_change`](../../backend/device_saves.py#L57) | 57 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L77) | 77 |
| [`_persist_related_guests`](../../backend/device_saves.py#L123) | 123 |
| [`save_reserved_device`](../../backend/device_saves.py#L136) | 136 |
| [`create_device_in_transaction`](../../backend/device_saves.py#L290) | 290 |
| [`create_device`](../../backend/device_saves.py#L368) | 368 |
| [`delete_reserved_device`](../../backend/device_saves.py#L383) | 383 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](../../backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](../../backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](../../backend/feature_settings.py#L28) | 28 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_subnet_batch_reason`](../../backend/history_permissions.py#L37) | 37 |
| [`visible_change_history`](../../backend/history_permissions.py#L65) | 65 |

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
| [`_json`](../../backend/inventory.py#L32) | 32 |
| [`_check_keys`](../../backend/inventory.py#L36) | 36 |
| [`_unique_object`](../../backend/inventory.py#L47) | 47 |
| [`_reject_nonfinite`](../../backend/inventory.py#L56) | 56 |
| [`validate_published_structure`](../../backend/inventory.py#L60) | 60 |
| [`inspect_export`](../../backend/inventory.py#L84) | 84 |
| [`inspect_device_mounts`](../../backend/inventory.py#L135) | 135 |
| [`inspect_import_relationships`](../../backend/inventory.py#L149) | 149 |
| [`preview_inventory_counts`](../../backend/inventory.py#L193) | 193 |
| [`preview_inventory_counts.counts`](../../backend/inventory.py#L199) | 199 |
| [`retain_ticket_devices`](../../backend/inventory.py#L215) | 215 |
| [`_write_detached`](../../backend/inventory.py#L238) | 238 |
| [`stage_inventory`](../../backend/inventory.py#L301) | 301 |
| [`reconstruct_inventory`](../../backend/inventory.py#L317) | 317 |

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
| [`_admin`](../../backend/permissions.py#L13) | 13 |
| [`_target`](../../backend/permissions.py#L22) | 22 |
| [`create_user`](../../backend/permissions.py#L31) | 31 |
| [`create_user_in_transaction`](../../backend/permissions.py#L47) | 47 |
| [`set_permission`](../../backend/permissions.py#L78) | 78 |
| [`can_access`](../../backend/permissions.py#L89) | 89 |
| [`feature_enabled`](../../backend/permissions.py#L94) | 94 |
| [`set_account_active`](../../backend/permissions.py#L108) | 108 |
| [`delete_user`](../../backend/permissions.py#L149) | 149 |
| [`set_administrator`](../../backend/permissions.py#L181) | 181 |
| [`can_replace_inventory`](../../backend/permissions.py#L222) | 222 |

## backend/profiles.py

| Function | Line |
| --- | ---: |
| [`_authorise`](../../backend/profiles.py#L24) | 24 |
| [`read_personal_details`](../../backend/profiles.py#L43) | 43 |
| [`_profile_revision`](../../backend/profiles.py#L61) | 61 |
| [`read_profile`](../../backend/profiles.py#L77) | 77 |
| [`validate_profile_details`](../../backend/profiles.py#L86) | 86 |
| [`write_personal_details`](../../backend/profiles.py#L101) | 101 |
| [`reconcile_saved_staff_profiles`](../../backend/profiles.py#L127) | 127 |
| [`save_profile`](../../backend/profiles.py#L152) | 152 |
| [`_check_dimensions`](../../backend/profiles.py#L194) | 194 |
| [`_jpeg_dimensions`](../../backend/profiles.py#L198) | 198 |
| [`_image_dimensions`](../../backend/profiles.py#L230) | 230 |
| [`save_profile_photo`](../../backend/profiles.py#L258) | 258 |
| [`read_profile_photo`](../../backend/profiles.py#L286) | 286 |
| [`remove_profile_photo`](../../backend/profiles.py#L295) | 295 |

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
| [`_restore_operational_defaults`](../../backend/reset_inventory.py#L38) | 38 |
| [`_clear_operational_records`](../../backend/reset_inventory.py#L54) | 54 |
| [`reset_inventory`](../../backend/reset_inventory.py#L93) | 93 |

## backend/role_policy.py

| Function | Line |
| --- | ---: |
| [`AccountRolePolicy.allows`](../../backend/role_policy.py#L21) | 21 |
| [`evaluate_role_policy`](../../backend/role_policy.py#L33) | 33 |
| [`assign_staff_member`](../../backend/role_policy.py#L75) | 75 |

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
| [`initialise_database`](../../backend/schema.py#L74) | 74 |
| [`migrate_staff_directory`](../../backend/schema.py#L294) | 294 |
| [`migrate_role_permissions`](../../backend/schema.py#L361) | 361 |
| [`verify_role_migration`](../../backend/schema.py#L446) | 446 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L472) | 472 |
| [`migrate_it_staff_stock_default`](../../backend/schema.py#L566) | 566 |
| [`migrate_device_assignments`](../../backend/schema.py#L594) | 594 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L128) | 128 |
| [`connect`](../../backend/server.py#L146) | 146 |
| [`initialise_database`](../../backend/server.py#L154) | 154 |
| [`profile_email_notice_recipients`](../../backend/server.py#L160) | 160 |
| [`Handler.end_headers`](../../backend/server.py#L165) | 165 |
| [`Handler.do_GET`](../../backend/server.py#L172) | 172 |
| [`Handler.do_POST`](../../backend/server.py#L570) | 570 |
| [`Handler.handle_supplier_request`](../../backend/server.py#L764) | 764 |
| [`Handler.handle_stock_request`](../../backend/server.py#L845) | 845 |
| [`Handler.handle_service_desk_request`](../../backend/server.py#L934) | 934 |
| [`Handler.handle_equipment_request`](../../backend/server.py#L1093) | 1093 |
| [`Handler.handle_directory_request`](../../backend/server.py#L1177) | 1177 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L1258) | 1258 |
| [`Handler.handle_email_templates`](../../backend/server.py#L1307) | 1307 |
| [`Handler.handle_role_change`](../../backend/server.py#L1363) | 1363 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L1405) | 1405 |
| [`Handler.handle_account_email`](../../backend/server.py#L1804) | 1804 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1886) | 1886 |
| [`Handler.handle_import`](../../backend/server.py#L1917) | 1917 |
| [`Handler.respond`](../../backend/server.py#L1996) | 1996 |
| [`main`](../../backend/server.py#L2009) | 2009 |

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
| [`config_path`](../../backend/smtp_settings.py#L41) | 41 |
| [`_read_private`](../../backend/smtp_settings.py#L45) | 45 |
| [`public_settings`](../../backend/smtp_settings.py#L62) | 62 |
| [`_check_text`](../../backend/smtp_settings.py#L73) | 73 |
| [`_validate_address`](../../backend/smtp_settings.py#L83) | 83 |
| [`_validate_host`](../../backend/smtp_settings.py#L90) | 90 |
| [`_validate`](../../backend/smtp_settings.py#L105) | 105 |
| [`save_settings`](../../backend/smtp_settings.py#L149) | 149 |
| [`_rate_limit_test`](../../backend/smtp_settings.py#L176) | 176 |
| [`send_test_email`](../../backend/smtp_settings.py#L185) | 185 |
| [`send_account_email`](../../backend/smtp_settings.py#L202) | 202 |
| [`deliver_email`](../../backend/smtp_settings.py#L213) | 213 |

## backend/staff_directory.py

| Function | Line |
| --- | ---: |
| [`_staff_revision`](../../backend/staff_directory.py#L25) | 25 |
| [`_is_administrator`](../../backend/staff_directory.py#L32) | 32 |
| [`unique_directory_fields`](../../backend/staff_directory.py#L40) | 40 |
| [`require_directory_access`](../../backend/staff_directory.py#L50) | 50 |
| [`_text`](../../backend/staff_directory.py#L56) | 56 |
| [`_staff_record`](../../backend/staff_directory.py#L63) | 63 |
| [`_department_record`](../../backend/staff_directory.py#L70) | 70 |
| [`read_staff_member`](../../backend/staff_directory.py#L77) | 77 |
| [`department_has_associations`](../../backend/staff_directory.py#L95) | 95 |
| [`read_department`](../../backend/staff_directory.py#L114) | 114 |
| [`list_directory`](../../backend/staff_directory.py#L121) | 121 |
| [`list_staff_department_choices`](../../backend/staff_directory.py#L141) | 141 |
| [`_validate_staff`](../../backend/staff_directory.py#L154) | 154 |
| [`_save_linked_personal_details`](../../backend/staff_directory.py#L179) | 179 |
| [`_create_login`](../../backend/staff_directory.py#L206) | 206 |
| [`save_staff_member`](../../backend/staff_directory.py#L221) | 221 |
| [`save_department`](../../backend/staff_directory.py#L281) | 281 |

## backend/staff_identity.py

| Function | Line |
| --- | ---: |
| [`read_linked_staff`](../../backend/staff_identity.py#L6) | 6 |
| [`staff_history_revision`](../../backend/staff_identity.py#L14) | 14 |
| [`shared_profile_conflicts`](../../backend/staff_identity.py#L31) | 31 |
| [`fill_shared_profile_blanks`](../../backend/staff_identity.py#L39) | 39 |
| [`write_shared_staff_details`](../../backend/staff_identity.py#L48) | 48 |
| [`link_account_staff`](../../backend/staff_identity.py#L55) | 55 |

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
| [`validate_it_asset_stock`](../../backend/stock_schema.py#L564) | 564 |
| [`migrate_it_asset_stock`](../../backend/stock_schema.py#L594) | 594 |

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
| [`displayEquipmentType`](../../interface/suppliers.js#L20) | 20 |
| [`editable`](../../interface/suppliers.js#L21) | 21 |
| [`list`](../../interface/suppliers.js#L22) | 22 |
| [`locationAddress`](../../interface/suppliers.js#L23) | 23 |
| [`labelStatus`](../../interface/suppliers.js#L24) | 24 |
| [`badge`](../../interface/suppliers.js#L25) | 25 |
| [`findContact`](../../interface/suppliers.js#L26) | 26 |
| [`findLocation`](../../interface/suppliers.js#L27) | 27 |
| [`findNote`](../../interface/suppliers.js#L28) | 28 |
| [`options`](../../interface/suppliers.js#L29) | 29 |
| [`button`](../../interface/suppliers.js#L32) | 32 |
| [`nameButton`](../../interface/suppliers.js#L35) | 35 |
| [`header`](../../interface/suppliers.js#L38) | 38 |
| [`sectionHeading`](../../interface/suppliers.js#L45) | 45 |
| [`table`](../../interface/suppliers.js#L48) | 48 |
| [`emptyRow`](../../interface/suppliers.js#L53) | 53 |
| [`field`](../../interface/suppliers.js#L56) | 56 |
| [`select`](../../interface/suppliers.js#L62) | 62 |
| [`toolSearch`](../../interface/suppliers.js#L66) | 66 |
| [`card`](../../interface/suppliers.js#L72) | 72 |
| [`info`](../../interface/suppliers.js#L75) | 75 |
| [`webLink`](../../interface/suppliers.js#L78) | 78 |
| [`categoryTags`](../../interface/suppliers.js#L86) | 86 |
| [`directoryResults`](../../interface/suppliers.js#L90) | 90 |
| [`renderDirectory`](../../interface/suppliers.js#L100) | 100 |
| [`contactScope`](../../interface/suppliers.js#L114) | 114 |
| [`lifecycleActions`](../../interface/suppliers.js#L120) | 120 |
| [`lifecycleButtons`](../../interface/suppliers.js#L134) | 134 |
| [`renderOverview`](../../interface/suppliers.js#L138) | 138 |
| [`renderLocations`](../../interface/suppliers.js#L157) | 157 |
| [`contactRows`](../../interface/suppliers.js#L175) | 175 |
| [`renderContacts`](../../interface/suppliers.js#L184) | 184 |
| [`formatDate`](../../interface/suppliers.js#L194) | 194 |
| [`time`](../../interface/suppliers.js#L197) | 197 |
| [`noteCards`](../../interface/suppliers.js#L198) | 198 |
| [`renderNotes`](../../interface/suppliers.js#L209) | 209 |
| [`issueCategoryName`](../../interface/suppliers.js#L215) | 215 |
| [`issueCategoryLabel`](../../interface/suppliers.js#L218) | 218 |
| [`issueStatusBadge`](../../interface/suppliers.js#L222) | 222 |
| [`issueButton`](../../interface/suppliers.js#L225) | 225 |
| [`issueRows`](../../interface/suppliers.js#L229) | 229 |
| [`issuesList`](../../interface/suppliers.js#L237) | 237 |
| [`renderNotesIssues`](../../interface/suppliers.js#L244) | 244 |
| [`renderAllIssues`](../../interface/suppliers.js#L253) | 253 |
| [`dashboardIcon`](../../interface/suppliers.js#L258) | 258 |
| [`dashboardMetric`](../../interface/suppliers.js#L261) | 261 |
| [`dashboardCard`](../../interface/suppliers.js#L265) | 265 |
| [`renderPurchasing`](../../interface/suppliers.js#L269) | 269 |
| [`recentCell`](../../interface/suppliers.js#L276) | 276 |
| [`equipmentRows`](../../interface/suppliers.js#L302) | 302 |
| [`renderEquipment`](../../interface/suppliers.js#L313) | 313 |
| [`renderDetails`](../../interface/suppliers.js#L325) | 325 |
| [`render`](../../interface/suppliers.js#L339) | 339 |
| [`request`](../../interface/suppliers.js#L350) | 350 |
| [`readRoute`](../../interface/suppliers.js#L359) | 359 |
| [`writeRoute`](../../interface/suppliers.js#L365) | 365 |
| [`show`](../../interface/suppliers.js#L370) | 370 |
| [`mountEquipmentChooser`](../../interface/suppliers.js#L419) | 419 |
| [`value`](../../interface/suppliers.js#L445) | 445 |
| [`describe`](../../interface/suppliers.js#L446) | 446 |
| [`close`](../../interface/suppliers.js#L450) | 450 |
| [`choose`](../../interface/suppliers.js#L457) | 457 |
| [`show`](../../interface/suppliers.js#L464) | 464 |
| [`loadChoices`](../../interface/suppliers.js#L482) | 482 |
| [`openEquipmentAssignment`](../../interface/suppliers.js#L545) | 545 |
| [`dialog`](../../interface/suppliers.js#L577) | 577 |
| [`lines`](../../interface/suppliers.js#L593) | 593 |
| [`valueOf`](../../interface/suppliers.js#L594) | 594 |
| [`selectedIds`](../../interface/suppliers.js#L595) | 595 |
| [`addressFields`](../../interface/suppliers.js#L596) | 596 |
| [`readAddress`](../../interface/suppliers.js#L602) | 602 |
| [`checkList`](../../interface/suppliers.js#L605) | 605 |
| [`formSection`](../../interface/suppliers.js#L610) | 610 |
| [`contactEntry`](../../interface/suppliers.js#L614) | 614 |
| [`supplierForm`](../../interface/suppliers.js#L624) | 624 |
| [`locationForm`](../../interface/suppliers.js#L657) | 657 |
| [`contactForm`](../../interface/suppliers.js#L669) | 669 |
| [`contactDetails`](../../interface/suppliers.js#L701) | 701 |
| [`noteForm`](../../interface/suppliers.js#L718) | 718 |
| [`issueCategoryOptions`](../../interface/suppliers.js#L728) | 728 |
| [`issueUpdates`](../../interface/suppliers.js#L732) | 732 |
| [`issueDialog`](../../interface/suppliers.js#L740) | 740 |
| [`openIssue`](../../interface/suppliers.js#L787) | 787 |
| [`refreshAfterIssueSave`](../../interface/suppliers.js#L796) | 796 |
| [`correctIssueUpdate`](../../interface/suppliers.js#L800) | 800 |
| [`backToIssue`](../../interface/suppliers.js#L806) | 806 |
| [`addInlineIssueCategory`](../../interface/suppliers.js#L818) | 818 |
| [`toggleInlineCategory`](../../interface/suppliers.js#L840) | 840 |
| [`applyIssueCategories`](../../interface/suppliers.js#L847) | 847 |
| [`categoriesDialog`](../../interface/suppliers.js#L854) | 854 |
| [`categoryForm`](../../interface/suppliers.js#L866) | 866 |
| [`command`](../../interface/suppliers.js#L875) | 875 |
| [`updateSupplier`](../../interface/suppliers.js#L884) | 884 |
| [`updateCategories`](../../interface/suppliers.js#L895) | 895 |
| [`statusConfirmation`](../../interface/suppliers.js#L906) | 906 |
| [`supplyConfirmation`](../../interface/suppliers.js#L936) | 936 |
| [`refreshRows`](../../interface/suppliers.js#L952) | 952 |
| [`caffootSuppliers.configure`](../../interface/suppliers.js#L1119) | 1119 |
| [`caffootSuppliers.enter`](../../interface/suppliers.js#L1122) | 1122 |
| [`caffootSuppliers.leave`](../../interface/suppliers.js#L1126) | 1126 |
| [`caffootSuppliers.closed`](../../interface/suppliers.js#L1133) | 1133 |

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
| [`seed_equipment_lifecycle_defaults`](../../backend/equipment_lifecycle_schema.py#L6) | 6 |
| [`migrate_equipment_lifecycle`](../../backend/equipment_lifecycle_schema.py#L18) | 18 |

## interface/lifecycle.js

| Function | Line |
| --- | ---: |
| [`asDate`](../../interface/lifecycle.js#L13) | 13 |
| [`dateLabel`](../../interface/lifecycle.js#L14) | 14 |
| [`typeLabel`](../../interface/lifecycle.js#L15) | 15 |
| [`esc`](../../interface/lifecycle.js#L16) | 16 |
| [`yearsLabel`](../../interface/lifecycle.js#L18) | 18 |
| [`addYears`](../../interface/lifecycle.js#L20) | 20 |
| [`renderDetails`](../../interface/lifecycle.js#L30) | 30 |
| [`bindEditor`](../../interface/lifecycle.js#L39) | 39 |
| [`input`](../../interface/lifecycle.js#L50) | 50 |
| [`update`](../../interface/lifecycle.js#L56) | 56 |
| [`form.lifecycleDraft`](../../interface/lifecycle.js#L98) | 98 |
| [`form.lifecycleChanges`](../../interface/lifecycle.js#L101) | 101 |
| [`renderDashboard`](../../interface/lifecycle.js#L124) | 124 |
| [`bindDashboard`](../../interface/lifecycle.js#L156) | 156 |
| [`closest`](../../interface/lifecycle.js#L166) | 166 |
| [`render`](../../interface/lifecycle.js#L169) | 169 |

## backend/service_desk.py

| Function | Line |
| --- | ---: |
| [`ticket_rows`](../../backend/service_desk.py#L39) | 39 |
| [`ticket_text`](../../backend/service_desk.py#L45) | 45 |
| [`ticket_category`](../../backend/service_desk.py#L55) | 55 |
| [`read_ticket_categories`](../../backend/service_desk.py#L66) | 66 |
| [`read_ticket_list`](../../backend/service_desk.py#L75) | 75 |
| [`read_ticket_equipment_choices`](../../backend/service_desk.py#L156) | 156 |
| [`read_ticket_software_choices`](../../backend/service_desk.py#L190) | 190 |
| [`read_ticket_assignment_choices`](../../backend/service_desk.py#L195) | 195 |
| [`eligible_ticket_technician`](../../backend/service_desk.py#L203) | 203 |
| [`require_ticket`](../../backend/service_desk.py#L208) | 208 |
| [`read_ticket`](../../backend/service_desk.py#L221) | 221 |
| [`read_ticket_attachment`](../../backend/service_desk.py#L276) | 276 |
| [`record_ticket_event`](../../backend/service_desk.py#L289) | 289 |
| [`insert_ticket_message`](../../backend/service_desk.py#L297) | 297 |
| [`create_ticket`](../../backend/service_desk.py#L304) | 304 |
| [`save_ticket_message`](../../backend/service_desk.py#L347) | 347 |
| [`change_ticket_lifecycle`](../../backend/service_desk.py#L381) | 381 |
| [`remove_ticket_attachment`](../../backend/service_desk.py#L480) | 480 |
| [`save_ticket_request`](../../backend/service_desk.py#L497) | 497 |

## backend/service_desk_access.py

| Function | Line |
| --- | ---: |
| [`linked_ticket_staff`](../../backend/service_desk_access.py#L31) | 31 |
| [`ticket_scope_filter`](../../backend/service_desk_access.py#L39) | 39 |
| [`ticket_equipment_for_creation`](../../backend/service_desk_access.py#L73) | 73 |
| [`employee_ticket_equipment`](../../backend/service_desk_access.py#L129) | 129 |

## backend/service_desk_schema.py

| Function | Line |
| --- | ---: |
| [`has_service_desk_storage`](../../backend/service_desk_schema.py#L130) | 130 |
| [`migrate_service_desk`](../../backend/service_desk_schema.py#L137) | 137 |
| [`migrate_ticket_software`](../../backend/service_desk_schema.py#L152) | 152 |
| [`migrate_service_desk_reporting`](../../backend/service_desk_schema.py#L157) | 157 |

## backend/service_desk_attachments.py

| Function | Line |
| --- | ---: |
| [`is_ticket_png`](../../backend/service_desk_attachments.py#L23) | 23 |
| [`is_ticket_jpeg`](../../backend/service_desk_attachments.py#L55) | 55 |
| [`is_ticket_pdf`](../../backend/service_desk_attachments.py#L94) | 94 |
| [`is_ticket_text`](../../backend/service_desk_attachments.py#L110) | 110 |
| [`read_ticket_office_xml`](../../backend/service_desk_attachments.py#L120) | 120 |
| [`is_ticket_office_document`](../../backend/service_desk_attachments.py#L133) | 133 |
| [`validate_ticket_attachments`](../../backend/service_desk_attachments.py#L173) | 173 |
| [`insert_ticket_attachments`](../../backend/service_desk_attachments.py#L212) | 212 |

## backend/service_desk_calendar.py

| Function | Line |
| --- | ---: |
| [`utc_timestamp`](../../backend/service_desk_calendar.py#L16) | 16 |
| [`read_deployment_timezone`](../../backend/service_desk_calendar.py#L20) | 20 |
| [`read_support_calendar`](../../backend/service_desk_calendar.py#L38) | 38 |
| [`append_support_calendar`](../../backend/service_desk_calendar.py#L48) | 48 |
| [`activate_deployment_timezone`](../../backend/service_desk_calendar.py#L56) | 56 |
| [`split_timezone_offsets`](../../backend/service_desk_calendar.py#L66) | 66 |
| [`eligible_working_time`](../../backend/service_desk_calendar.py#L91) | 91 |
| [`measure_resolution_attempt`](../../backend/service_desk_calendar.py#L110) | 110 |

## backend/service_desk_reporting.py

| Function | Line |
| --- | ---: |
| [`read_report_period`](../../backend/service_desk_reporting.py#L16) | 16 |
| [`save_report_period`](../../backend/service_desk_reporting.py#L24) | 24 |
| [`reporting_dates`](../../backend/service_desk_reporting.py#L48) | 48 |
| [`report_event_rows`](../../backend/service_desk_reporting.py#L60) | 60 |
| [`read_service_desk_report`](../../backend/service_desk_reporting.py#L93) | 93 |

## backend/service_desk_settings.py

| Function | Line |
| --- | ---: |
| [`parse_support_date`](../../backend/service_desk_settings.py#L19) | 19 |
| [`read_service_desk_settings`](../../backend/service_desk_settings.py#L28) | 28 |
| [`validate_working_hours`](../../backend/service_desk_settings.py#L38) | 38 |
| [`save_support_calendar`](../../backend/service_desk_settings.py#L54) | 54 |
| [`save_ticket_category`](../../backend/service_desk_settings.py#L93) | 93 |
| [`save_service_desk_settings`](../../backend/service_desk_settings.py#L129) | 129 |

## backend/ticket_software.py

| Function | Line |
| --- | ---: |
| [`ticket_software_choices`](../../backend/ticket_software.py#L12) | 12 |
## backend/email_template_catalogue.py

| Function | Line |
| --- | ---: |
| [`account_security_text`](../../backend/email_template_catalogue.py#L195) | 195 |

## backend/email_logo.py

| Function | Line |
| --- | ---: |
| [`png_has_valid_pixels`](../../backend/email_logo.py#L15) | 15 |
| [`validate_logo`](../../backend/email_logo.py#L50) | 50 |

## backend/email_rendering.py

| Function | Line |
| --- | ---: |
| [`safe_email_url`](../../backend/email_rendering.py#L16) | 16 |
| [`replace_email_variables`](../../backend/email_rendering.py#L36) | 36 |
| [`EmailBody.__init__`](../../backend/email_rendering.py#L43) | 43 |
| [`EmailBody.handle_starttag`](../../backend/email_rendering.py#L54) | 54 |
| [`EmailBody.handle_startendtag`](../../backend/email_rendering.py#L88) | 88 |
| [`EmailBody.handle_endtag`](../../backend/email_rendering.py#L92) | 92 |
| [`EmailBody.handle_data`](../../backend/email_rendering.py#L102) | 102 |
| [`EmailBody.close_tags`](../../backend/email_rendering.py#L112) | 112 |
| [`parse_email_body`](../../backend/email_rendering.py#L123) | 123 |
| [`email_placeholders`](../../backend/email_rendering.py#L131) | 131 |
| [`validate_email_wording`](../../backend/email_rendering.py#L135) | 135 |
| [`render_email`](../../backend/email_rendering.py#L157) | 157 |

## backend/email_templates.py

| Function | Line |
| --- | ---: |
| [`migrate_email_templates`](../../backend/email_templates.py#L26) | 26 |
| [`email_template_state`](../../backend/email_templates.py#L43) | 43 |
| [`read_email_branding`](../../backend/email_templates.py#L59) | 59 |
| [`public_email_branding`](../../backend/email_templates.py#L70) | 70 |
| [`read_email_templates`](../../backend/email_templates.py#L75) | 75 |
| [`require_email_revision`](../../backend/email_templates.py#L86) | 86 |
| [`save_email_template`](../../backend/email_templates.py#L93) | 93 |
| [`validate_branding_fields`](../../backend/email_templates.py#L129) | 129 |
| [`save_email_branding`](../../backend/email_templates.py#L143) | 143 |
| [`mutate_email_templates`](../../backend/email_templates.py#L166) | 166 |
| [`sample_email`](../../backend/email_templates.py#L181) | 181 |
| [`sample_email_branding`](../../backend/email_templates.py#L209) | 209 |
| [`render_account_email`](../../backend/email_templates.py#L223) | 223 |

## interface/email-templates.js

| Function | Line |
| --- | ---: |
| [`requestEmailSettings`](../../interface/email-templates.js#L10) | 10 |
| [`emailElement`](../../interface/email-templates.js#L24) | 24 |
| [`setEmailFeedback`](../../interface/email-templates.js#L31) | 31 |
| [`renderEmailPreview`](../../interface/email-templates.js#L37) | 37 |
| [`readCompanyLogo`](../../interface/email-templates.js#L59) | 59 |
| [`mountEmailEditor`](../../interface/email-templates.js#L79) | 79 |
| [`currentWording`](../../interface/email-templates.js#L119) | 119 |
| [`templateEdited`](../../interface/email-templates.js#L123) | 123 |
| [`readBrandingFields`](../../interface/email-templates.js#L127) | 127 |
| [`brandingEdited`](../../interface/email-templates.js#L131) | 131 |
| [`canLeaveEmailEditor`](../../interface/email-templates.js#L136) | 136 |
| [`syncTemplateStatus`](../../interface/email-templates.js#L142) | 142 |
| [`syncBrandingControls`](../../interface/email-templates.js#L159) | 159 |
| [`renderTemplateChoices`](../../interface/email-templates.js#L169) | 169 |
| [`rememberEmailCaret`](../../interface/email-templates.js#L189) | 189 |
| [`restoreEmailCaret`](../../interface/email-templates.js#L201) | 201 |
| [`insertEmailToken`](../../interface/email-templates.js#L214) | 214 |
| [`copyEmailToken`](../../interface/email-templates.js#L235) | 235 |
| [`renderEmailVariables`](../../interface/email-templates.js#L244) | 244 |
| [`chooseEmailTemplate`](../../interface/email-templates.js#L270) | 270 |
| [`updateEmailPreview`](../../interface/email-templates.js#L293) | 293 |
| [`updateBrandingPreview`](../../interface/email-templates.js#L320) | 320 |
| [`editEmailWording`](../../interface/email-templates.js#L340) | 340 |
| [`changeEmailTemplate`](../../interface/email-templates.js#L346) | 346 |
| [`sendTemplateTest`](../../interface/email-templates.js#L388) | 388 |
| [`applySavedBranding`](../../interface/email-templates.js#L407) | 407 |
| [`chooseCompanyLogo`](../../interface/email-templates.js#L414) | 414 |
| [`saveCompanyBranding`](../../interface/email-templates.js#L441) | 441 |
| [`showEmailSettingsTab`](../../interface/email-templates.js#L469) | 469 |
| [`insertEmailLink`](../../interface/email-templates.js#L482) | 482 |
| [`hydrateEmailTemplates`](../../interface/email-templates.js#L599) | 599 |
| [`loadEmailTemplates`](../../interface/email-templates.js#L606) | 606 |

## backend/staff_employment.py

| Function | Line |
| --- | ---: |
| [`require_active_staff_login`](../../backend/staff_employment.py#L9) | 9 |
| [`disable_employment_login`](../../backend/staff_employment.py#L15) | 15 |
| [`reconcile_employment_logins`](../../backend/staff_employment.py#L48) | 48 |
