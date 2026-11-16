# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the six application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 973.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`renderInterfaceTemplate`](../../interface/loader.js#L5) | 5 |
| [`loadInterfaceText`](../../interface/loader.js#L13) | 13 |
| [`initialiseInterface`](../../interface/loader.js#L18) | 18 |
| [`staffScript.onerror`](../../interface/loader.js#L47) | 47 |
| [`staffScript.onload`](../../interface/loader.js#L48) | 48 |
| [`script.onerror`](../../interface/loader.js#L51) | 51 |
| [`script.onload`](../../interface/loader.js#L52) | 52 |
| [`stockScript.onerror`](../../interface/loader.js#L55) | 55 |
| [`stockScript.onload`](../../interface/loader.js#L56) | 56 |
| [`applicationScript.onerror`](../../interface/loader.js#L59) | 59 |
| [`showInterfaceLoadError`](../../interface/loader.js#L68) | 68 |

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
| [`escapeHtml`](../../interface/application.js#L1192) | 1192 |
| [`inlineJsArg`](../../interface/application.js#L1201) | 1201 |
| [`browserStorageWarning`](../../interface/application.js#L1209) | 1209 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1212) | 1212 |
| [`renderSectionTabIcon`](../../interface/application.js#L1218) | 1218 |
| [`renderSectionHeader`](../../interface/application.js#L1224) | 1224 |
| [`tab`](../../interface/application.js#L1225) | 1225 |
| [`revealSectionTab`](../../interface/application.js#L1252) | 1252 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1259) | 1259 |
| [`renderContent`](../../interface/application.js#L1279) | 1279 |
| [`updateScrollHint`](../../interface/application.js#L1326) | 1326 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1337) | 1337 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1372) | 1372 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1376) | 1376 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1380) | 1380 |
| [`buildInventoryReportData`](../../interface/application.js#L1386) | 1386 |
| [`occupancy`](../../interface/application.js#L1402) | 1402 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1425) | 1425 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1431) | 1431 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1457) | 1457 |
| [`renderDashboardHTML`](../../interface/application.js#L1476) | 1476 |
| [`statusPill`](../../interface/application.js#L1582) | 1582 |
| [`insightSegment`](../../interface/application.js#L1599) | 1599 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1640) | 1640 |
| [`getCategoryIcon`](../../interface/application.js#L1657) | 1657 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1672) | 1672 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1681) | 1681 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1686) | 1686 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1701) | 1701 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1716) | 1716 |
| [`printRackElevation`](../../interface/application.js#L1726) | 1726 |
| [`safe`](../../interface/application.js#L1729) | 1729 |
| [`printRackElevationInFrame`](../../interface/application.js#L1760) | 1760 |
| [`frame.onload`](../../interface/application.js#L1770) | 1770 |
| [`renderRackHubV13`](../../interface/application.js#L1791) | 1791 |
| [`card`](../../interface/application.js#L1796) | 1796 |
| [`mark`](../../interface/application.js#L1805) | 1805 |
| [`bar`](../../interface/application.js#L1821) | 1821 |
| [`chartBox`](../../interface/application.js#L1822) | 1822 |
| [`chartRows`](../../interface/application.js#L1823) | 1823 |
| [`rackSpaceGuide`](../../interface/application.js#L1825) | 1825 |
| [`renderRacksHTML`](../../interface/application.js#L1894) | 1894 |
| [`changeRack`](../../interface/application.js#L1961) | 1961 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1980) | 1980 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1987) | 1987 |
| [`getVisibleDevices`](../../interface/application.js#L1993) | 1993 |
| [`filterHardwareModels`](../../interface/application.js#L2018) | 2018 |
| [`openCatalogueModal`](../../interface/application.js#L2057) | 2057 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2066) | 2066 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2090) | 2090 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2128) | 2128 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2140) | 2140 |
| [`renderCatalogueButton`](../../interface/application.js#L2157) | 2157 |
| [`renderCatalogueRecord`](../../interface/application.js#L2161) | 2161 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2166) | 2166 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2185) | 2185 |
| [`add`](../../interface/application.js#L2187) | 2187 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2232) | 2232 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2239) | 2239 |
| [`openHardwareModelManager`](../../interface/application.js#L2251) | 2251 |
| [`opts`](../../interface/application.js#L2256) | 2256 |
| [`saveHardwareModel`](../../interface/application.js#L2274) | 2274 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2303) | 2303 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2317) | 2317 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2339) | 2339 |
| [`add`](../../interface/application.js#L2341) | 2341 |
| [`options`](../../interface/application.js#L2377) | 2377 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2391) | 2391 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2406) | 2406 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2421) | 2421 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2429) | 2429 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2440) | 2440 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2449) | 2449 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2471) | 2471 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2482) | 2482 |
| [`openServerServiceEditor`](../../interface/application.js#L2499) | 2499 |
| [`saveServerServiceEntry`](../../interface/application.js#L2508) | 2508 |
| [`restoreArchivedServerService`](../../interface/application.js#L2521) | 2521 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2530) | 2530 |
| [`renderDevicesHTML`](../../interface/application.js#L2542) | 2542 |
| [`renderHardwareMetric`](../../interface/application.js#L2550) | 2550 |
| [`renderHardwareChart`](../../interface/application.js#L2555) | 2555 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2565) | 2565 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2584) | 2584 |
| [`renderArchivedSoftware`](../../interface/application.js#L2592) | 2592 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2627) | 2627 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2634) | 2634 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2635) | 2635 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2636) | 2636 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2639) | 2639 |
| [`openManageTypesModal`](../../interface/application.js#L2655) | 2655 |
| [`openManageLocationsModal`](../../interface/application.js#L2656) | 2656 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2659) | 2659 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2681) | 2681 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2688) | 2688 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2696) | 2696 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2716) | 2716 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2717) | 2717 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2718) | 2718 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2733) | 2733 |
| [`deleteDeviceType`](../../interface/application.js#L2753) | 2753 |
| [`deleteDeviceLocation`](../../interface/application.js#L2754) | 2754 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2762) | 2762 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2766) | 2766 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2793) | 2793 |
| [`nodes`](../../interface/application.js#L2803) | 2803 |
| [`renderIpamManage`](../../interface/application.js#L2829) | 2829 |
| [`renderIpamHTML`](../../interface/application.js#L2880) | 2880 |
| [`changeSubnet`](../../interface/application.js#L3041) | 3041 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3054) | 3054 |
| [`openIpamModal`](../../interface/application.js#L3080) | 3080 |
| [`openBulkIpModal`](../../interface/application.js#L3085) | 3085 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3092) | 3092 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3096) | 3096 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3115) | 3115 |
| [`applyBulkIpChanges`](../../interface/application.js#L3131) | 3131 |
| [`subnetCidrFeedback`](../../interface/application.js#L3145) | 3145 |
| [`suggestSubnetGateway`](../../interface/application.js#L3163) | 3163 |
| [`openSubnetModal`](../../interface/application.js#L3191) | 3191 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3195) | 3195 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3221) | 3221 |
| [`handleSubnetSubmit`](../../interface/application.js#L3241) | 3241 |
| [`showSubnetFormError`](../../interface/application.js#L3448) | 3448 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3464) | 3464 |
| [`subnetNameConflicts`](../../interface/application.js#L3478) | 3478 |
| [`subnetHasVlan`](../../interface/application.js#L3485) | 3485 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3488) | 3488 |
| [`openMultipleSubnets`](../../interface/application.js#L3496) | 3496 |
| [`option`](../../interface/application.js#L3498) | 3498 |
| [`visibility`](../../interface/application.js#L3503) | 3503 |
| [`planningVisibility`](../../interface/application.js#L3507) | 3507 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3525) | 3525 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3537) | 3537 |
| [`read`](../../interface/application.js#L3539) | 3539 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3557) | 3557 |
| [`reject`](../../interface/application.js#L3559) | 3559 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3596) | 3596 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3600) | 3600 |
| [`add`](../../interface/application.js#L3603) | 3603 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3630) | 3630 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3638) | 3638 |
| [`field`](../../interface/application.js#L3641) | 3641 |
| [`capture`](../../interface/application.js#L3651) | 3651 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3685) | 3685 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3689) | 3689 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3695) | 3695 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3716) | 3716 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3720) | 3720 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3724) | 3724 |
| [`deleteSubnet`](../../interface/application.js#L3735) | 3735 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3795) | 3795 |
| [`deleteSubnetCommit`](../../interface/application.js#L3823) | 3823 |
| [`deleteVlan`](../../interface/application.js#L3853) | 3853 |
| [`openIpModal`](../../interface/application.js#L3879) | 3879 |
| [`handleIpSubmit`](../../interface/application.js#L3896) | 3896 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3962) | 3962 |
| [`modalFormSnapshot`](../../interface/application.js#L3972) | 3972 |
| [`rememberModalForm`](../../interface/application.js#L3977) | 3977 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3982) | 3982 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L4001) | 4001 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4020) | 4020 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4029) | 4029 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4035) | 4035 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4041) | 4041 |
| [`closeModal`](../../interface/application.js#L4050) | 4050 |
| [`openModal`](../../interface/application.js#L4077) | 4077 |
| [`readRackDimension`](../../interface/application.js#L4150) | 4150 |
| [`formatRackDimension`](../../interface/application.js#L4157) | 4157 |
| [`rackPhysicalDetails`](../../interface/application.js#L4162) | 4162 |
| [`openRackModal`](../../interface/application.js#L4171) | 4171 |
| [`handleRackSubmit`](../../interface/application.js#L4187) | 4187 |
| [`deleteRack`](../../interface/application.js#L4254) | 4254 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4276) | 4276 |
| [`refresh`](../../interface/application.js#L4299) | 4299 |
| [`openAssignDeviceModal`](../../interface/application.js#L4376) | 4376 |
| [`refresh`](../../interface/application.js#L4393) | 4393 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4400) | 4400 |
| [`handleAssignSubmit`](../../interface/application.js#L4434) | 4434 |
| [`unassignDevice`](../../interface/application.js#L4479) | 4479 |
| [`getSubnetForIp`](../../interface/application.js#L4496) | 4496 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4500) | 4500 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4547) | 4547 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4556) | 4556 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4565) | 4565 |
| [`inside`](../../interface/application.js#L4572) | 4572 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4590) | 4590 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4599) | 4599 |
| [`toggleDeviceMountType`](../../interface/application.js#L4643) | 4643 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4667) | 4667 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4672) | 4672 |
| [`openDeviceReviewModal`](../../interface/application.js#L4690) | 4690 |
| [`openDeviceDetailView`](../../interface/application.js#L4695) | 4695 |
| [`safe`](../../interface/application.js#L4705) | 4705 |
| [`field`](../../interface/application.js#L4706) | 4706 |
| [`section`](../../interface/application.js#L4707) | 4707 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4752) | 4752 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4758) | 4758 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4777) | 4777 |
| [`navigateToDeviceRack`](../../interface/application.js#L4795) | 4795 |
| [`duplicateDevice`](../../interface/application.js#L4823) | 4823 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4893) | 4893 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4898) | 4898 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4903) | 4903 |
| [`openServerServiceManager`](../../interface/application.js#L4904) | 4904 |
| [`captureServerServiceSelections`](../../interface/application.js#L4909) | 4909 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4915) | 4915 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4936) | 4936 |
| [`archiveServerService`](../../interface/application.js#L4944) | 4944 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4970) | 4970 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4974) | 4974 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4992) | 4992 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4996) | 4996 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4999) | 4999 |
| [`updateHardwareCatalogue`](../../interface/application.js#L5006) | 5006 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5034) | 5034 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5038) | 5038 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5083) | 5083 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5117) | 5117 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5134) | 5134 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5137) | 5137 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5138) | 5138 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5143) | 5143 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5149) | 5149 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5187) | 5187 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5188) | 5188 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5195) | 5195 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5196) | 5196 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5211) | 5211 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5217) | 5217 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5240) | 5240 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5256) | 5256 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5259) | 5259 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5268) | 5268 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5279) | 5279 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5288) | 5288 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5291) | 5291 |
| [`isSoftwareDetailField`](../../interface/application.js#L5298) | 5298 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5306) | 5306 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5315) | 5315 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5321) | 5321 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5333) | 5333 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5373) | 5373 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5401) | 5401 |
| [`updateInlinePickerCount`](../../interface/application.js#L5410) | 5410 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5416) | 5416 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5429) | 5429 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5438) | 5438 |
| [`fail`](../../interface/application.js#L5444) | 5444 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5498) | 5498 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5514) | 5514 |
| [`fail`](../../interface/application.js#L5519) | 5519 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5638) | 5638 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5668) | 5668 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5674) | 5674 |
| [`getPlatformVersionOptions`](../../interface/application.js#L6040) | 6040 |
| [`isWindowsPlatform`](../../interface/application.js#L6043) | 6043 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L6047) | 6047 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L6050) | 6050 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L6054) | 6054 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L6071) | 6071 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L6075) | 6075 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6095) | 6095 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6122) | 6122 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6171) | 6171 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6179) | 6179 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6190) | 6190 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6194) | 6194 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6206) | 6206 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6218) | 6218 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6245) | 6245 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6249) | 6249 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6253) | 6253 |
| [`getDefaultMountType`](../../interface/application.js#L6266) | 6266 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6269) | 6269 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6274) | 6274 |
| [`initialiseNotesEditor`](../../interface/application.js#L6291) | 6291 |
| [`inlineMarkdown`](../../interface/application.js#L6296) | 6296 |
| [`render`](../../interface/application.js#L6309) | 6309 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6343) | 6343 |
| [`activate`](../../interface/application.js#L6737) | 6737 |
| [`openDeviceModal`](../../interface/application.js#L6818) | 6818 |
| [`syncVmPurpose`](../../interface/application.js#L6866) | 6866 |
| [`clearFieldError`](../../interface/application.js#L6927) | 6927 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6946) | 6946 |
| [`createRackFromDevice`](../../interface/application.js#L6982) | 6982 |
| [`cancelRackFromDevice`](../../interface/application.js#L6990) | 6990 |
| [`createSubnetFromDevice`](../../interface/application.js#L7000) | 7000 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L7013) | 7013 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L7027) | 7027 |
| [`addCustomLocationOption`](../../interface/application.js#L7039) | 7039 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L7079) | 7079 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7091) | 7091 |
| [`finish`](../../interface/application.js#L7111) | 7111 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7136) | 7136 |
| [`finish`](../../interface/application.js#L7150) | 7150 |
| [`handleDeviceSubmit`](../../interface/application.js#L7170) | 7170 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7210) | 7210 |
| [`deleteDevice`](../../interface/application.js#L7359) | 7359 |
| [`personalSafeStorageGet`](../../interface/application.js#L7416) | 7416 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7421) | 7421 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7431) | 7431 |
| [`button`](../../interface/application.js#L7432) | 7432 |
| [`themeChoice`](../../interface/application.js#L7436) | 7436 |
| [`guideLinks`](../../interface/application.js#L7453) | 7453 |
| [`loadSmtpSettings`](../../interface/application.js#L7484) | 7484 |
| [`renderApplicationSettings`](../../interface/application.js#L7499) | 7499 |
| [`syncSmtpForm`](../../interface/application.js#L7503) | 7503 |
| [`updateSmtpFields`](../../interface/application.js#L7525) | 7525 |
| [`hydrateSettings`](../../interface/application.js#L7538) | 7538 |
| [`caffootCompareVersions`](../../interface/application.js#L7560) | 7560 |
| [`parse`](../../interface/application.js#L7561) | 7561 |
| [`caffootShowLicences`](../../interface/application.js#L7583) | 7583 |
| [`caffootUpdateGuide`](../../interface/application.js#L7588) | 7588 |
| [`caffootCheckUpdates`](../../interface/application.js#L7593) | 7593 |
| [`checkInventorySafety`](../../interface/application.js#L7624) | 7624 |
| [`requestInventoryReset`](../../interface/application.js#L7647) | 7647 |
| [`createInventoryBackup`](../../interface/application.js#L7674) | 7674 |
| [`validateBackupVersion`](../../interface/application.js#L7686) | 7686 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7701) | 7701 |
| [`exportData`](../../interface/application.js#L7709) | 7709 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7722) | 7722 |
| [`validateBackupStructure`](../../interface/application.js#L7737) | 7737 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7754) | 7754 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7766) | 7766 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7805) | 7805 |
| [`findRackImportConflicts`](../../interface/application.js#L7809) | 7809 |
| [`place`](../../interface/application.js#L7815) | 7815 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7861) | 7861 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7882) | 7882 |
| [`showBackupImportError`](../../interface/application.js#L7887) | 7887 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7891) | 7891 |
| [`finish`](../../interface/application.js#L7901) | 7901 |
| [`onClick`](../../interface/application.js#L7910) | 7910 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7920) | 7920 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7931) | 7931 |
| [`finish`](../../interface/application.js#L7942) | 7942 |
| [`onClick`](../../interface/application.js#L7951) | 7951 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7966) | 7966 |
| [`importData`](../../interface/application.js#L7982) | 7982 |
| [`reader.onload`](../../interface/application.js#L7992) | 7992 |
| [`reader.onerror`](../../interface/application.js#L8066) | 8066 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8193) | 8193 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8209) | 8209 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8220) | 8220 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8254) | 8254 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8312) | 8312 |
| [`cancel`](../../interface/application.js#L8325) | 8325 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8341) | 8341 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8358) | 8358 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8383) | 8383 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8397) | 8397 |
| [`clearRackDropPreview`](../../interface/application.js#L8400) | 8400 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8405) | 8405 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8417) | 8417 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8423) | 8423 |
| [`trackRackDrag`](../../interface/application.js#L8432) | 8432 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8463) | 8463 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8473) | 8473 |
| [`getRackDropPosition`](../../interface/application.js#L8566) | 8566 |
| [`window.onload`](../../interface/application.js#L9024) | 9024 |
| [`inventorySectionAccess`](../../interface/application.js#L9042) | 9042 |
| [`addDirectoryAccess`](../../interface/application.js#L9043) | 9043 |
| [`refreshStockAccess`](../../interface/application.js#L9051) | 9051 |
| [`refreshCentralInventory`](../../interface/application.js#L9059) | 9059 |
| [`postInventory`](../../interface/application.js#L9083) | 9083 |
| [`isBlockedAction`](../../interface/application.js#L9135) | 9135 |
| [`applyAllowedControls`](../../interface/application.js#L9168) | 9168 |
| [`enhanceLongSelects`](../../interface/application.js#L9238) | 9238 |
| [`sync`](../../interface/application.js#L9289) | 9289 |
| [`close`](../../interface/application.js#L9295) | 9295 |
| [`choose`](../../interface/application.js#L9299) | 9299 |
| [`draw`](../../interface/application.js#L9304) | 9304 |
| [`open`](../../interface/application.js#L9322) | 9322 |
| [`enhanceSelects`](../../interface/application.js#L9379) | 9379 |
| [`switchTab`](../../interface/application.js#L9435) | 9435 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9446) | 9446 |
| [`openDeviceDetailView`](../../interface/application.js#L9472) | 9472 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9481) | 9481 |
| [`forbidRackMount`](../../interface/application.js#L9540) | 9540 |
| [`openDeviceModal`](../../interface/application.js#L9603) | 9603 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9643) | 9643 |
| [`relatedChanges`](../../interface/application.js#L9649) | 9649 |
| [`saveDevice`](../../interface/application.js#L9660) | 9660 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9704) | 9704 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9705) | 9705 |
| [`nextIpamBridge.save`](../../interface/application.js#L9727) | 9727 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9749) | 9749 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9771) | 9771 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9814) | 9814 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9859) | 9859 |
| [`openDeviceIpamLink`](../../interface/application.js#L9863) | 9863 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9871) | 9871 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9912) | 9912 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9929) | 9929 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9930) | 9930 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9931) | 9931 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9945) | 9945 |
| [`nextResetBridge.reset`](../../interface/application.js#L9976) | 9976 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L10003) | 10003 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L10030) | 10030 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L10038) | 10038 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L10047) | 10047 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L10048) | 10048 |
| [`nextRackBridge.save`](../../interface/application.js#L10083) | 10083 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L10086) | 10086 |
| [`nextRackBridge.persist`](../../interface/application.js#L10089) | 10089 |
| [`reserveForDelete`](../../interface/application.js#L10111) | 10111 |
| [`removeDevice`](../../interface/application.js#L10119) | 10119 |
| [`cancelDelete`](../../interface/application.js#L10145) | 10145 |
| [`saveArchivedInstallation`](../../interface/application.js#L10151) | 10151 |
| [`renderAccountSections`](../../interface/application.js#L10188) | 10188 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10216) | 10216 |
| [`nextRenderAccount`](../../interface/application.js#L10227) | 10227 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10237) | 10237 |
| [`closeEmailVerification`](../../interface/application.js#L10261) | 10261 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10268) | 10268 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10279) | 10279 |
| [`hydrateAccount`](../../interface/application.js#L10333) | 10333 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10371) | 10371 |
| [`loadAccountProfile`](../../interface/application.js#L10384) | 10384 |
| [`removeAccountPhoto`](../../interface/application.js#L10400) | 10400 |
| [`permissionLabel`](../../interface/application.js#L10412) | 10412 |
| [`accountMfaLabel`](../../interface/application.js#L10415) | 10415 |
| [`renderRoleMemberships`](../../interface/application.js#L10418) | 10418 |
| [`renderRoleCatalogue`](../../interface/application.js#L10424) | 10424 |
| [`openRoleLayer`](../../interface/application.js#L10429) | 10429 |
| [`closeRoleLayer`](../../interface/application.js#L10440) | 10440 |
| [`renderRoleDefinition`](../../interface/application.js#L10446) | 10446 |
| [`renderRoleImpact`](../../interface/application.js#L10450) | 10450 |
| [`access`](../../interface/application.js#L10455) | 10455 |
| [`state`](../../interface/application.js#L10459) | 10459 |
| [`requestRoleChange`](../../interface/application.js#L10464) | 10464 |
| [`roleNotificationMessage`](../../interface/application.js#L10471) | 10471 |
| [`previewRoleAction`](../../interface/application.js#L10475) | 10475 |
| [`openRoleEditor`](../../interface/application.js#L10480) | 10480 |
| [`nextRenderUsers`](../../interface/application.js#L10543) | 10543 |
| [`profileFields`](../../interface/application.js#L10545) | 10545 |
| [`stat`](../../interface/application.js#L10566) | 10566 |
| [`bars`](../../interface/application.js#L10569) | 10569 |
| [`operation`](../../interface/application.js#L10625) | 10625 |
| [`filterUserRows`](../../interface/application.js#L10645) | 10645 |
| [`closeUserWorkspace`](../../interface/application.js#L10669) | 10669 |
| [`loadCentralUsers`](../../interface/application.js#L10698) | 10698 |
| [`changeCentralUser`](../../interface/application.js#L10704) | 10704 |
| [`importPanel`](../../interface/application.js#L10715) | 10715 |
| [`cancelImport`](../../interface/application.js#L10719) | 10719 |
| [`nextImportModalClosed`](../../interface/application.js#L10725) | 10725 |
| [`showImportReview`](../../interface/application.js#L10726) | 10726 |
| [`chooseImportFile`](../../interface/application.js#L10766) | 10766 |
| [`actOnImport`](../../interface/application.js#L10783) | 10783 |
| [`serverStorageField`](../../interface/application.js#L5566) | 5566 |
| [`renderServerStorageFields`](../../interface/application.js#L5571) | 5571 |
| [`captureServerStorageValues`](../../interface/application.js#L5586) | 5586 |
| [`refreshServerStorageControls`](../../interface/application.js#L5606) | 5606 |
| [`updateServerStorage`](../../interface/application.js#L5616) | 5616 |
| [`serverStorageDetailRows`](../../interface/application.js#L5628) | 5628 |
| [`installDeviceStockControls`](../../interface/application.js#L9550) | 9550 |
| [`loadDeviceStockSources`](../../interface/application.js#L9565) | 9565 |
| [`renderServerStorageFields.action`](../../interface/application.js#L5574) | 5574 |
| [`updateServerStorage.vdev`](../../interface/application.js#L5620) | 5620 |

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
| [`cardHeading`](../../interface/staff-directory.js#L40) | 40 |
| [`renderDepartments`](../../interface/staff-directory.js#L65) | 65 |
| [`departmentCard`](../../interface/staff-directory.js#L70) | 70 |
| [`departmentNotice`](../../interface/staff-directory.js#L73) | 73 |
| [`departmentDate`](../../interface/staff-directory.js#L76) | 76 |
| [`departmentTable`](../../interface/staff-directory.js#L80) | 80 |
| [`departmentAssignmentRows`](../../interface/staff-directory.js#L83) | 83 |
| [`renderDepartmentOverview`](../../interface/staff-directory.js#L87) | 87 |
| [`renderDepartmentStaff`](../../interface/staff-directory.js#L98) | 98 |
| [`renderDepartmentEquipment`](../../interface/staff-directory.js#L103) | 103 |
| [`renderDepartmentHistory`](../../interface/staff-directory.js#L112) | 112 |
| [`renderDepartmentDetails`](../../interface/staff-directory.js#L121) | 121 |
| [`selectDepartmentTab`](../../interface/staff-directory.js#L128) | 128 |
| [`loadDepartmentDetails`](../../interface/staff-directory.js#L134) | 134 |
| [`request`](../../interface/staff-directory.js#L160) | 160 |
| [`readAll`](../../interface/staff-directory.js#L167) | 167 |
| [`refresh`](../../interface/staff-directory.js#L177) | 177 |
| [`render`](../../interface/staff-directory.js#L195) | 195 |
| [`enter`](../../interface/staff-directory.js#L208) | 208 |
| [`redraw`](../../interface/staff-directory.js#L216) | 216 |
| [`saveStaff`](../../interface/staff-directory.js#L217) | 217 |
| [`openDepartmentDialog`](../../interface/staff-directory.js#L235) | 235 |
| [`closeDepartmentDialog`](../../interface/staff-directory.js#L246) | 246 |
| [`saveDepartment`](../../interface/staff-directory.js#L247) | 247 |
| [`configure`](../../interface/staff-directory.js#L254) | 254 |

## interface/equipment.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](../../interface/equipment.js#L5) | 5 |
| [`dateLabel`](../../interface/equipment.js#L6) | 6 |
| [`button`](../../interface/equipment.js#L7) | 7 |
| [`request`](../../interface/equipment.js#L8) | 8 |
| [`assignmentHistory`](../../interface/equipment.js#L14) | 14 |
| [`assetMovementHistory`](../../interface/equipment.js#L19) | 19 |
| [`staffPlaceholder`](../../interface/equipment.js#L24) | 24 |
| [`loadStaffEquipment`](../../interface/equipment.js#L28) | 28 |
| [`loadDeviceEquipment`](../../interface/equipment.js#L37) | 37 |
| [`renderMyEquipment`](../../interface/equipment.js#L49) | 49 |
| [`loadMyEquipment`](../../interface/equipment.js#L52) | 52 |
| [`list`](../../interface/equipment.js#L55) | 55 |
| [`hydrate`](../../interface/equipment.js#L63) | 63 |
| [`showAssignmentDialog`](../../interface/equipment.js#L67) | 67 |
| [`searchRecipients`](../../interface/equipment.js#L78) | 78 |
| [`searchDevices`](../../interface/equipment.js#L87) | 87 |
| [`leaveAssignmentDialog`](../../interface/equipment.js#L95) | 95 |
| [`saveAssignment`](../../interface/equipment.js#L101) | 101 |
| [`caffootEquipment.configure`](../../interface/equipment.js#L152) | 152 |

## interface/stock-intake.js

| Function | Line |
| --- | ---: |
| [`safe`](../../interface/stock-intake.js#L7) | 7 |
| [`canRead`](../../interface/stock-intake.js#L8) | 8 |
| [`canEdit`](../../interface/stock-intake.js#L9) | 9 |
| [`stockLabel`](../../interface/stock-intake.js#L10) | 10 |
| [`stockNotice`](../../interface/stock-intake.js#L11) | 11 |
| [`stockButton`](../../interface/stock-intake.js#L12) | 12 |
| [`stockCard`](../../interface/stock-intake.js#L13) | 13 |
| [`stockField`](../../interface/stock-intake.js#L14) | 14 |
| [`stockSelect`](../../interface/stock-intake.js#L17) | 17 |
| [`stockTable`](../../interface/stock-intake.js#L20) | 20 |
| [`stockMetrics`](../../interface/stock-intake.js#L23) | 23 |
| [`stockSpecText`](../../interface/stock-intake.js#L26) | 26 |
| [`renderStockReceipt`](../../interface/stock-intake.js#L31) | 31 |
| [`renderStockDetails`](../../interface/stock-intake.js#L66) | 66 |
| [`renderStockInventory`](../../interface/stock-intake.js#L88) | 88 |
| [`stockDate`](../../interface/stock-intake.js#L92) | 92 |
| [`stockCheckLabel`](../../interface/stock-intake.js#L93) | 93 |
| [`renderStockHistory`](../../interface/stock-intake.js#L94) | 94 |
| [`clearStock`](../../interface/stock-intake.js#L99) | 99 |
| [`stockRequest`](../../interface/stock-intake.js#L102) | 102 |
| [`refreshStock`](../../interface/stock-intake.js#L111) | 111 |
| [`enterStock`](../../interface/stock-intake.js#L122) | 122 |
| [`renderStock`](../../interface/stock-intake.js#L127) | 127 |
| [`receiptTracking`](../../interface/stock-intake.js#L137) | 137 |
| [`hydrateStock`](../../interface/stock-intake.js#L140) | 140 |
| [`openStockDetails`](../../interface/stock-intake.js#L181) | 181 |
| [`submitStock`](../../interface/stock-intake.js#L189) | 189 |
| [`stockStateLabel`](../../interface/stock-intake.js#L272) | 272 |
| [`stockUnitState`](../../interface/stock-intake.js#L273) | 273 |
| [`stockNote`](../../interface/stock-intake.js#L274) | 274 |
| [`stockWorkflowForm`](../../interface/stock-intake.js#L275) | 275 |
| [`stockIssueReady`](../../interface/stock-intake.js#L278) | 278 |
| [`renderStockIssue`](../../interface/stock-intake.js#L287) | 287 |
| [`stockReturnSources`](../../interface/stock-intake.js#L297) | 297 |
| [`renderStockReturn`](../../interface/stock-intake.js#L304) | 304 |
| [`renderStockWriteOff`](../../interface/stock-intake.js#L315) | 315 |
| [`stockPreparationRequirement`](../../interface/stock-intake.js#L328) | 328 |
| [`renderStockPreparation`](../../interface/stock-intake.js#L335) | 335 |
| [`renderRegisteredStock`](../../interface/stock-intake.js#L347) | 347 |
| [`renderStockMovements`](../../interface/stock-intake.js#L354) | 354 |
| [`stockSelectedReturn`](../../interface/stock-intake.js#L359) | 359 |
| [`stockSelectedWriteOff`](../../interface/stock-intake.js#L360) | 360 |
| [`hydrateStockCirculation`](../../interface/stock-intake.js#L364) | 364 |
| [`loadStockRecipients`](../../interface/stock-intake.js#L426) | 426 |
| [`submitStockCirculation`](../../interface/stock-intake.js#L437) | 437 |
| [`openStockWorkflow`](../../interface/stock-intake.js#L470) | 470 |
| [`configureStock`](../../interface/stock-intake.js#L477) | 477 |
| [`renderDeviceReissue`](../../interface/stock-intake.js#L279) | 279 |

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
| [`validate_assignment_closure`](../../backend/assignment_closure.py#L76) | 76 |
| [`migrate_assignment_closure`](../../backend/assignment_closure.py#L84) | 84 |

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
| [`assign_devices`](../../backend/device_assignments.py#L136) | 136 |
| [`my_equipment`](../../backend/device_assignments.py#L188) | 188 |

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
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L28) | 28 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L47) | 47 |
| [`_persist_related_guests`](../../backend/device_saves.py#L91) | 91 |
| [`save_reserved_device`](../../backend/device_saves.py#L104) | 104 |
| [`create_device_in_transaction`](../../backend/device_saves.py#L245) | 245 |
| [`create_device`](../../backend/device_saves.py#L322) | 322 |
| [`delete_reserved_device`](../../backend/device_saves.py#L334) | 334 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](../../backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](../../backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](../../backend/feature_settings.py#L28) | 28 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_subnet_batch_reason`](../../backend/history_permissions.py#L32) | 32 |
| [`visible_change_history`](../../backend/history_permissions.py#L60) | 60 |

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
| [`initialise_database`](../../backend/schema.py#L59) | 59 |
| [`migrate_staff_directory`](../../backend/schema.py#L246) | 246 |
| [`migrate_role_permissions`](../../backend/schema.py#L311) | 311 |
| [`verify_role_migration`](../../backend/schema.py#L396) | 396 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L422) | 422 |
| [`migrate_device_assignments`](../../backend/schema.py#L516) | 516 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L95) | 95 |
| [`connect`](../../backend/server.py#L113) | 113 |
| [`initialise_database`](../../backend/server.py#L121) | 121 |
| [`Handler.end_headers`](../../backend/server.py#L127) | 127 |
| [`Handler.do_GET`](../../backend/server.py#L134) | 134 |
| [`Handler.do_POST`](../../backend/server.py#L495) | 495 |
| [`Handler.handle_stock_request`](../../backend/server.py#L678) | 678 |
| [`Handler.handle_equipment_request`](../../backend/server.py#L754) | 754 |
| [`Handler.handle_directory_request`](../../backend/server.py#L825) | 825 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L900) | 900 |
| [`Handler.handle_role_change`](../../backend/server.py#L943) | 943 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L985) | 985 |
| [`Handler.handle_account_email`](../../backend/server.py#L1377) | 1377 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1457) | 1457 |
| [`Handler.handle_import`](../../backend/server.py#L1488) | 1488 |
| [`Handler.respond`](../../backend/server.py#L1564) | 1564 |
| [`main`](../../backend/server.py#L1577) | 1577 |

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
| [`read_department`](../../backend/staff_directory.py#L81) | 81 |
| [`list_directory`](../../backend/staff_directory.py#L88) | 88 |
| [`list_staff_department_choices`](../../backend/staff_directory.py#L102) | 102 |
| [`_validate_staff`](../../backend/staff_directory.py#L115) | 115 |
| [`_create_login`](../../backend/staff_directory.py#L132) | 132 |
| [`save_staff_member`](../../backend/staff_directory.py#L147) | 147 |
| [`save_department`](../../backend/staff_directory.py#L191) | 191 |

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
| [`read_stock_issues`](../../backend/stock_circulation.py#L111) | 111 |
| [`issue_stock`](../../backend/stock_circulation.py#L136) | 136 |
| [`issue_stock_in_transaction`](../../backend/stock_circulation.py#L148) | 148 |
| [`stock_unit_states`](../../backend/stock_circulation.py#L194) | 194 |
| [`registered_stock_devices`](../../backend/stock_circulation.py#L205) | 205 |
| [`legacy_device_issue`](../../backend/stock_circulation.py#L222) | 222 |
| [`preparation_requirements`](../../backend/stock_circulation.py#L240) | 240 |
| [`preparation_checks`](../../backend/stock_circulation.py#L257) | 257 |
| [`require_stock_device_edit`](../../backend/stock_circulation.py#L265) | 265 |
| [`return_stock`](../../backend/stock_circulation.py#L274) | 274 |
| [`prepare_stock`](../../backend/stock_circulation.py#L403) | 403 |
| [`stock_state_balance`](../../backend/stock_circulation.py#L465) | 465 |
| [`canonical_device_choice`](../../backend/stock_circulation.py#L473) | 473 |
| [`write_off_stock`](../../backend/stock_circulation.py#L493) | 493 |
| [`stock_movement_history`](../../backend/stock_circulation.py#L604) | 604 |

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
| [`stock_operation`](../../backend/stock_intake.py#L197) | 197 |
| [`stock_replay`](../../backend/stock_intake.py#L206) | 206 |
| [`append_stock_fact`](../../backend/stock_intake.py#L224) | 224 |
| [`stock_write_access`](../../backend/stock_intake.py#L250) | 250 |
| [`receive_stock`](../../backend/stock_intake.py#L256) | 256 |
| [`update_stock_readiness`](../../backend/stock_intake.py#L348) | 348 |

## backend/stock_schema.py

| Function | Line |
| --- | ---: |
| [`stock_schema_statements`](../../backend/stock_schema.py#L490) | 490 |
| [`normalise_schema_statement`](../../backend/stock_schema.py#L502) | 502 |
| [`validate_feature_table`](../../backend/stock_schema.py#L507) | 507 |
| [`validate_it_asset_stock`](../../backend/stock_schema.py#L543) | 543 |
| [`migrate_it_asset_stock`](../../backend/stock_schema.py#L567) | 567 |

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
| [`require_device_stock_access`](../../backend/device_stock.py#L14) | 14 |
| [`registration_source_ready`](../../backend/device_stock.py#L22) | 22 |
| [`device_stock_sources`](../../backend/device_stock.py#L27) | 27 |
| [`validate_registration_identity`](../../backend/device_stock.py#L45) | 45 |
| [`register_stock_device`](../../backend/device_stock.py#L63) | 63 |
| [`device_ready_for_reissue`](../../backend/device_stock.py#L103) | 103 |
| [`reissue_device_choices`](../../backend/device_stock.py#L113) | 113 |
| [`reissue_stock_device`](../../backend/device_stock.py#L120) | 120 |


## backend/device_storage.py

| Function | Line |
| --- | ---: |
| [`storage_text`](../../backend/device_storage.py#L5) | 5 |
| [`storage_number`](../../backend/device_storage.py#L10) | 10 |
| [`validate_device_storage`](../../backend/device_storage.py#L22) | 22 |

## backend/equipment_associations.py

| Function | Line |
| --- | ---: |
| [`equipment_association_schema`](../../backend/equipment_associations.py#L56) | 56 |
| [`validate_equipment_associations`](../../backend/equipment_associations.py#L63) | 63 |
| [`migrate_equipment_associations`](../../backend/equipment_associations.py#L75) | 75 |
| [`read_equipment_associations`](../../backend/equipment_associations.py#L86) | 86 |

