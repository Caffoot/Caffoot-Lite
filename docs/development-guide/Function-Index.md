# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the six application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 1007.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`option`](../../interface/application.js#L2456) | 2456 |
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
| [`confirmRackPlacementCorrection`](../../interface/application.js#L4012) | 4012 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4031) | 4031 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4040) | 4040 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4046) | 4046 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4052) | 4052 |
| [`closeModal`](../../interface/application.js#L4061) | 4061 |
| [`openModal`](../../interface/application.js#L4093) | 4093 |
| [`readRackDimension`](../../interface/application.js#L4166) | 4166 |
| [`formatRackDimension`](../../interface/application.js#L4173) | 4173 |
| [`rackPhysicalDetails`](../../interface/application.js#L4178) | 4178 |
| [`openRackModal`](../../interface/application.js#L4187) | 4187 |
| [`handleRackSubmit`](../../interface/application.js#L4203) | 4203 |
| [`deleteRack`](../../interface/application.js#L4270) | 4270 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4292) | 4292 |
| [`refresh`](../../interface/application.js#L4315) | 4315 |
| [`openAssignDeviceModal`](../../interface/application.js#L4392) | 4392 |
| [`refresh`](../../interface/application.js#L4409) | 4409 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4416) | 4416 |
| [`handleAssignSubmit`](../../interface/application.js#L4450) | 4450 |
| [`unassignDevice`](../../interface/application.js#L4495) | 4495 |
| [`getSubnetForIp`](../../interface/application.js#L4512) | 4512 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4516) | 4516 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4563) | 4563 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4572) | 4572 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4581) | 4581 |
| [`inside`](../../interface/application.js#L4588) | 4588 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4606) | 4606 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4615) | 4615 |
| [`toggleDeviceMountType`](../../interface/application.js#L4659) | 4659 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4683) | 4683 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4688) | 4688 |
| [`openDeviceReviewModal`](../../interface/application.js#L4706) | 4706 |
| [`openDeviceDetailView`](../../interface/application.js#L4711) | 4711 |
| [`safe`](../../interface/application.js#L4721) | 4721 |
| [`field`](../../interface/application.js#L4722) | 4722 |
| [`section`](../../interface/application.js#L4723) | 4723 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4768) | 4768 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4774) | 4774 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4793) | 4793 |
| [`navigateToDeviceRack`](../../interface/application.js#L4811) | 4811 |
| [`duplicateDevice`](../../interface/application.js#L4839) | 4839 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4909) | 4909 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4914) | 4914 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4919) | 4919 |
| [`openServerServiceManager`](../../interface/application.js#L4920) | 4920 |
| [`captureServerServiceSelections`](../../interface/application.js#L4925) | 4925 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4931) | 4931 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4952) | 4952 |
| [`archiveServerService`](../../interface/application.js#L4960) | 4960 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4986) | 4986 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4990) | 4990 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L5008) | 5008 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L5012) | 5012 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L5015) | 5015 |
| [`updateHardwareCatalogue`](../../interface/application.js#L5022) | 5022 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5050) | 5050 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5054) | 5054 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5099) | 5099 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5133) | 5133 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5150) | 5150 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5153) | 5153 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5154) | 5154 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5159) | 5159 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5165) | 5165 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5203) | 5203 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5204) | 5204 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5211) | 5211 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5212) | 5212 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5227) | 5227 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5233) | 5233 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5256) | 5256 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5272) | 5272 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5275) | 5275 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5284) | 5284 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5295) | 5295 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5304) | 5304 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5307) | 5307 |
| [`isSoftwareDetailField`](../../interface/application.js#L5314) | 5314 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5322) | 5322 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5331) | 5331 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5337) | 5337 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5349) | 5349 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5389) | 5389 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5417) | 5417 |
| [`updateInlinePickerCount`](../../interface/application.js#L5426) | 5426 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5432) | 5432 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5445) | 5445 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5454) | 5454 |
| [`fail`](../../interface/application.js#L5460) | 5460 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5514) | 5514 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5530) | 5530 |
| [`fail`](../../interface/application.js#L5535) | 5535 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5654) | 5654 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5684) | 5684 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5690) | 5690 |
| [`getPlatformVersionOptions`](../../interface/application.js#L6056) | 6056 |
| [`isWindowsPlatform`](../../interface/application.js#L6059) | 6059 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L6063) | 6063 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L6066) | 6066 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L6070) | 6070 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L6087) | 6087 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L6091) | 6091 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6111) | 6111 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6138) | 6138 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6187) | 6187 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6195) | 6195 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6206) | 6206 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6210) | 6210 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6222) | 6222 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6234) | 6234 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6261) | 6261 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6265) | 6265 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6269) | 6269 |
| [`getDefaultMountType`](../../interface/application.js#L6282) | 6282 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6285) | 6285 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6290) | 6290 |
| [`initialiseNotesEditor`](../../interface/application.js#L6307) | 6307 |
| [`inlineMarkdown`](../../interface/application.js#L6312) | 6312 |
| [`render`](../../interface/application.js#L6325) | 6325 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6359) | 6359 |
| [`activate`](../../interface/application.js#L6753) | 6753 |
| [`openDeviceModal`](../../interface/application.js#L6834) | 6834 |
| [`syncVmPurpose`](../../interface/application.js#L6882) | 6882 |
| [`clearFieldError`](../../interface/application.js#L6943) | 6943 |
| [`captureDeviceFormDraft`](../../interface/application.js#L6962) | 6962 |
| [`createRackFromDevice`](../../interface/application.js#L6998) | 6998 |
| [`cancelRackFromDevice`](../../interface/application.js#L7006) | 7006 |
| [`createSubnetFromDevice`](../../interface/application.js#L7016) | 7016 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L7029) | 7029 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L7043) | 7043 |
| [`addCustomLocationOption`](../../interface/application.js#L7055) | 7055 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L7095) | 7095 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7107) | 7107 |
| [`finish`](../../interface/application.js#L7127) | 7127 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7152) | 7152 |
| [`finish`](../../interface/application.js#L7166) | 7166 |
| [`handleDeviceSubmit`](../../interface/application.js#L7186) | 7186 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7226) | 7226 |
| [`deleteDevice`](../../interface/application.js#L7375) | 7375 |
| [`personalSafeStorageGet`](../../interface/application.js#L7432) | 7432 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7437) | 7437 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7447) | 7447 |
| [`button`](../../interface/application.js#L7448) | 7448 |
| [`themeChoice`](../../interface/application.js#L7452) | 7452 |
| [`guideLinks`](../../interface/application.js#L7469) | 7469 |
| [`loadSmtpSettings`](../../interface/application.js#L7500) | 7500 |
| [`renderApplicationSettings`](../../interface/application.js#L7515) | 7515 |
| [`syncSmtpForm`](../../interface/application.js#L7519) | 7519 |
| [`updateSmtpFields`](../../interface/application.js#L7541) | 7541 |
| [`hydrateSettings`](../../interface/application.js#L7554) | 7554 |
| [`caffootCompareVersions`](../../interface/application.js#L7576) | 7576 |
| [`parse`](../../interface/application.js#L7577) | 7577 |
| [`caffootShowLicences`](../../interface/application.js#L7599) | 7599 |
| [`caffootUpdateGuide`](../../interface/application.js#L7604) | 7604 |
| [`caffootCheckUpdates`](../../interface/application.js#L7609) | 7609 |
| [`checkInventorySafety`](../../interface/application.js#L7640) | 7640 |
| [`requestInventoryReset`](../../interface/application.js#L7663) | 7663 |
| [`createInventoryBackup`](../../interface/application.js#L7690) | 7690 |
| [`validateBackupVersion`](../../interface/application.js#L7702) | 7702 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7717) | 7717 |
| [`exportData`](../../interface/application.js#L7725) | 7725 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7738) | 7738 |
| [`validateBackupStructure`](../../interface/application.js#L7753) | 7753 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7770) | 7770 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7782) | 7782 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7821) | 7821 |
| [`findRackImportConflicts`](../../interface/application.js#L7825) | 7825 |
| [`place`](../../interface/application.js#L7831) | 7831 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7877) | 7877 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7898) | 7898 |
| [`showBackupImportError`](../../interface/application.js#L7903) | 7903 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7907) | 7907 |
| [`finish`](../../interface/application.js#L7917) | 7917 |
| [`onClick`](../../interface/application.js#L7926) | 7926 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7936) | 7936 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7947) | 7947 |
| [`finish`](../../interface/application.js#L7958) | 7958 |
| [`onClick`](../../interface/application.js#L7967) | 7967 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L7982) | 7982 |
| [`importData`](../../interface/application.js#L7998) | 7998 |
| [`reader.onload`](../../interface/application.js#L7992) | 7992 |
| [`reader.onerror`](../../interface/application.js#L8066) | 8066 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8209) | 8209 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8225) | 8225 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8236) | 8236 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8270) | 8270 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8328) | 8328 |
| [`cancel`](../../interface/application.js#L8341) | 8341 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8357) | 8357 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8374) | 8374 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8399) | 8399 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8413) | 8413 |
| [`clearRackDropPreview`](../../interface/application.js#L8416) | 8416 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8421) | 8421 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8433) | 8433 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8439) | 8439 |
| [`trackRackDrag`](../../interface/application.js#L8448) | 8448 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8479) | 8479 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8489) | 8489 |
| [`getRackDropPosition`](../../interface/application.js#L8582) | 8582 |
| [`window.onload`](../../interface/application.js#L9024) | 9024 |
| [`inventorySectionAccess`](../../interface/application.js#L9058) | 9058 |
| [`addDirectoryAccess`](../../interface/application.js#L9059) | 9059 |
| [`refreshStockAccess`](../../interface/application.js#L9067) | 9067 |
| [`refreshCentralInventory`](../../interface/application.js#L9075) | 9075 |
| [`postInventory`](../../interface/application.js#L9099) | 9099 |
| [`isBlockedAction`](../../interface/application.js#L9151) | 9151 |
| [`applyAllowedControls`](../../interface/application.js#L9184) | 9184 |
| [`enhanceLongSelects`](../../interface/application.js#L9254) | 9254 |
| [`sync`](../../interface/application.js#L9305) | 9305 |
| [`close`](../../interface/application.js#L9311) | 9311 |
| [`choose`](../../interface/application.js#L9315) | 9315 |
| [`draw`](../../interface/application.js#L9320) | 9320 |
| [`open`](../../interface/application.js#L9338) | 9338 |
| [`enhanceSelects`](../../interface/application.js#L9395) | 9395 |
| [`switchTab`](../../interface/application.js#L1161) | 1161 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9462) | 9462 |
| [`openDeviceDetailView`](../../interface/application.js#L4711) | 4711 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9498) | 9498 |
| [`forbidRackMount`](../../interface/application.js#L9557) | 9557 |
| [`openDeviceModal`](../../interface/application.js#L6834) | 6834 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9644) | 9644 |
| [`relatedChanges`](../../interface/application.js#L9666) | 9666 |
| [`saveDevice`](../../interface/application.js#L9677) | 9677 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9705) | 9705 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9706) | 9706 |
| [`nextIpamBridge.save`](../../interface/application.js#L9728) | 9728 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9750) | 9750 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9772) | 9772 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L9831) | 9831 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L9876) | 9876 |
| [`openDeviceIpamLink`](../../interface/application.js#L9880) | 9880 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L9888) | 9888 |
| [`nextSettingsBridge.save`](../../interface/application.js#L9913) | 9913 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L9930) | 9930 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L9931) | 9931 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L9932) | 9932 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L9946) | 9946 |
| [`nextResetBridge.reset`](../../interface/application.js#L9977) | 9977 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L10004) | 10004 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L10031) | 10031 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L10039) | 10039 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L10048) | 10048 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L10049) | 10049 |
| [`nextRackBridge.save`](../../interface/application.js#L10084) | 10084 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L10087) | 10087 |
| [`nextRackBridge.persist`](../../interface/application.js#L10090) | 10090 |
| [`reserveForDelete`](../../interface/application.js#L10128) | 10128 |
| [`removeDevice`](../../interface/application.js#L10136) | 10136 |
| [`cancelDelete`](../../interface/application.js#L10162) | 10162 |
| [`saveArchivedInstallation`](../../interface/application.js#L10168) | 10168 |
| [`renderAccountSections`](../../interface/application.js#L10205) | 10205 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10233) | 10233 |
| [`nextRenderAccount`](../../interface/application.js#L806) | 806 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10254) | 10254 |
| [`closeEmailVerification`](../../interface/application.js#L10278) | 10278 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10285) | 10285 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10296) | 10296 |
| [`hydrateAccount`](../../interface/application.js#L10350) | 10350 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10388) | 10388 |
| [`loadAccountProfile`](../../interface/application.js#L10401) | 10401 |
| [`removeAccountPhoto`](../../interface/application.js#L10417) | 10417 |
| [`permissionLabel`](../../interface/application.js#L10429) | 10429 |
| [`accountMfaLabel`](../../interface/application.js#L10432) | 10432 |
| [`renderRoleMemberships`](../../interface/application.js#L10435) | 10435 |
| [`renderRoleCatalogue`](../../interface/application.js#L10441) | 10441 |
| [`openRoleLayer`](../../interface/application.js#L10446) | 10446 |
| [`closeRoleLayer`](../../interface/application.js#L10457) | 10457 |
| [`renderRoleDefinition`](../../interface/application.js#L10463) | 10463 |
| [`renderRoleImpact`](../../interface/application.js#L10467) | 10467 |
| [`access`](../../interface/application.js#L10472) | 10472 |
| [`state`](../../interface/application.js#L10476) | 10476 |
| [`requestRoleChange`](../../interface/application.js#L10481) | 10481 |
| [`roleNotificationMessage`](../../interface/application.js#L10488) | 10488 |
| [`previewRoleAction`](../../interface/application.js#L10492) | 10492 |
| [`openRoleEditor`](../../interface/application.js#L10497) | 10497 |
| [`nextRenderUsers`](../../interface/application.js#L804) | 804 |
| [`profileFields`](../../interface/application.js#L10562) | 10562 |
| [`stat`](../../interface/application.js#L10583) | 10583 |
| [`bars`](../../interface/application.js#L10586) | 10586 |
| [`operation`](../../interface/application.js#L10642) | 10642 |
| [`filterUserRows`](../../interface/application.js#L10662) | 10662 |
| [`closeUserWorkspace`](../../interface/application.js#L10686) | 10686 |
| [`loadCentralUsers`](../../interface/application.js#L10715) | 10715 |
| [`changeCentralUser`](../../interface/application.js#L10721) | 10721 |
| [`importPanel`](../../interface/application.js#L10732) | 10732 |
| [`cancelImport`](../../interface/application.js#L10736) | 10736 |
| [`nextImportModalClosed`](../../interface/application.js#L10726) | 10726 |
| [`showImportReview`](../../interface/application.js#L10743) | 10743 |
| [`chooseImportFile`](../../interface/application.js#L10783) | 10783 |
| [`actOnImport`](../../interface/application.js#L10800) | 10800 |
| [`serverStorageField`](../../interface/application.js#L5582) | 5582 |
| [`renderServerStorageFields`](../../interface/application.js#L5587) | 5587 |
| [`captureServerStorageValues`](../../interface/application.js#L5602) | 5602 |
| [`refreshServerStorageControls`](../../interface/application.js#L5622) | 5622 |
| [`updateServerStorage`](../../interface/application.js#L5632) | 5632 |
| [`serverStorageDetailRows`](../../interface/application.js#L5644) | 5644 |
| [`installDeviceStockControls`](../../interface/application.js#L9567) | 9567 |
| [`loadDeviceStockSources`](../../interface/application.js#L9582) | 9582 |
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
| [`safe`](../../interface/stock-intake.js#L8) | 8 |
| [`canRead`](../../interface/stock-intake.js#L9) | 9 |
| [`canEdit`](../../interface/stock-intake.js#L10) | 10 |
| [`stockLabel`](../../interface/stock-intake.js#L11) | 11 |
| [`stockNotice`](../../interface/stock-intake.js#L12) | 12 |
| [`stockButton`](../../interface/stock-intake.js#L13) | 13 |
| [`stockCard`](../../interface/stock-intake.js#L14) | 14 |
| [`stockField`](../../interface/stock-intake.js#L15) | 15 |
| [`stockSelect`](../../interface/stock-intake.js#L18) | 18 |
| [`stockTable`](../../interface/stock-intake.js#L21) | 21 |
| [`stockMetrics`](../../interface/stock-intake.js#L24) | 24 |
| [`stockSpecText`](../../interface/stock-intake.js#L27) | 27 |
| [`renderStockReceipt`](../../interface/stock-intake.js#L32) | 32 |
| [`renderStockDetails`](../../interface/stock-intake.js#L67) | 67 |
| [`renderStockInventory`](../../interface/stock-intake.js#L90) | 90 |
| [`stockDate`](../../interface/stock-intake.js#L94) | 94 |
| [`stockCheckLabel`](../../interface/stock-intake.js#L95) | 95 |
| [`renderStockHistory`](../../interface/stock-intake.js#L96) | 96 |
| [`clearStock`](../../interface/stock-intake.js#L101) | 101 |
| [`stockRequest`](../../interface/stock-intake.js#L105) | 105 |
| [`refreshStock`](../../interface/stock-intake.js#L114) | 114 |
| [`enterStock`](../../interface/stock-intake.js#L125) | 125 |
| [`renderStock`](../../interface/stock-intake.js#L130) | 130 |
| [`receiptTracking`](../../interface/stock-intake.js#L140) | 140 |
| [`hydrateStock`](../../interface/stock-intake.js#L143) | 143 |
| [`openStockDetails`](../../interface/stock-intake.js#L187) | 187 |
| [`submitStock`](../../interface/stock-intake.js#L195) | 195 |
| [`stockStateLabel`](../../interface/stock-intake.js#L309) | 309 |
| [`stockUnitState`](../../interface/stock-intake.js#L310) | 310 |
| [`stockNote`](../../interface/stock-intake.js#L311) | 311 |
| [`stockWorkflowForm`](../../interface/stock-intake.js#L312) | 312 |
| [`stockIssueReady`](../../interface/stock-intake.js#L320) | 320 |
| [`renderDeviceReissue`](../../interface/stock-intake.js#L321) | 321 |
| [`stockExistingIssueLabel`](../../interface/stock-intake.js#L333) | 333 |
| [`renderStockIssue`](../../interface/stock-intake.js#L340) | 340 |
| [`stockReturnSources`](../../interface/stock-intake.js#L353) | 353 |
| [`renderStockReturn`](../../interface/stock-intake.js#L360) | 360 |
| [`renderStockWriteOff`](../../interface/stock-intake.js#L371) | 371 |
| [`stockPreparationRequirement`](../../interface/stock-intake.js#L384) | 384 |
| [`renderStockPreparation`](../../interface/stock-intake.js#L391) | 391 |
| [`renderRegisteredStock`](../../interface/stock-intake.js#L403) | 403 |
| [`renderStockMovements`](../../interface/stock-intake.js#L410) | 410 |
| [`renderStockCorrection`](../../interface/stock-intake.js#L415) | 415 |
| [`renderCorrectionImpact`](../../interface/stock-intake.js#L424) | 424 |
| [`leaveStockCorrection`](../../interface/stock-intake.js#L429) | 429 |
| [`openStockCorrection`](../../interface/stock-intake.js#L434) | 434 |
| [`stockCorrectionValues`](../../interface/stock-intake.js#L442) | 442 |
| [`previewStockCorrection`](../../interface/stock-intake.js#L445) | 445 |
| [`scheduleStockCorrection`](../../interface/stock-intake.js#L465) | 465 |
| [`submitStockCorrection`](../../interface/stock-intake.js#L475) | 475 |
| [`stockSelectedReturn`](../../interface/stock-intake.js#L512) | 512 |
| [`stockSelectedWriteOff`](../../interface/stock-intake.js#L513) | 513 |
| [`hydrateStockCirculation`](../../interface/stock-intake.js#L517) | 517 |
| [`loadHandoverRecipients`](../../interface/stock-intake.js#L595) | 595 |
| [`loadStockRecipients`](../../interface/stock-intake.js#L621) | 621 |
| [`submitStockCirculation`](../../interface/stock-intake.js#L632) | 632 |
| [`openStockWorkflow`](../../interface/stock-intake.js#L680) | 680 |
| [`openDirectHandover`](../../interface/stock-intake.js#L686) | 686 |
| [`hydrateStockPage`](../../interface/stock-intake.js#L694) | 694 |
| [`dismissHandover`](../../interface/stock-intake.js#L708) | 708 |
| [`configureStock`](../../interface/stock-intake.js#L709) | 709 |

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
| [`initialise_database`](../../backend/schema.py#L60) | 60 |
| [`migrate_staff_directory`](../../backend/schema.py#L253) | 253 |
| [`migrate_role_permissions`](../../backend/schema.py#L318) | 318 |
| [`verify_role_migration`](../../backend/schema.py#L403) | 403 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L429) | 429 |
| [`migrate_device_assignments`](../../backend/schema.py#L523) | 523 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L97) | 97 |
| [`connect`](../../backend/server.py#L115) | 115 |
| [`initialise_database`](../../backend/server.py#L123) | 123 |
| [`Handler.end_headers`](../../backend/server.py#L129) | 129 |
| [`Handler.do_GET`](../../backend/server.py#L136) | 136 |
| [`Handler.do_POST`](../../backend/server.py#L497) | 497 |
| [`Handler.handle_stock_request`](../../backend/server.py#L680) | 680 |
| [`Handler.handle_equipment_request`](../../backend/server.py#L762) | 762 |
| [`Handler.handle_directory_request`](../../backend/server.py#L843) | 843 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L918) | 918 |
| [`Handler.handle_role_change`](../../backend/server.py#L961) | 961 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L1003) | 1003 |
| [`Handler.handle_account_email`](../../backend/server.py#L1395) | 1395 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1475) | 1475 |
| [`Handler.handle_import`](../../backend/server.py#L1506) | 1506 |
| [`Handler.respond`](../../backend/server.py#L1582) | 1582 |
| [`main`](../../backend/server.py#L1595) | 1595 |

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

