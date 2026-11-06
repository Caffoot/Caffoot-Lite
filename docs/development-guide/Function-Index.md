# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 637.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`validateApplicationState`](../../interface/application.js#L402) | 402 |
| [`loadStoredState`](../../interface/application.js#L465) | 465 |
| [`showStorageRecoveryBanner`](../../interface/application.js#L471) | 471 |
| [`download.onclick`](../../interface/application.js#L486) | 486 |
| [`reset.onclick`](../../interface/application.js#L495) | 495 |
| [`caffootThemePreference`](../../interface/application.js#L530) | 530 |
| [`caffootApplyTheme`](../../interface/application.js#L537) | 537 |
| [`caffootSetTheme`](../../interface/application.js#L551) | 551 |
| [`onSystemThemeChange`](../../interface/application.js#L562) | 562 |
| [`toggleDarkMode`](../../interface/application.js#L571) | 571 |
| [`readAuditHistory`](../../interface/application.js#L578) | 578 |
| [`auditChanges`](../../interface/application.js#L582) | 582 |
| [`recordAudit`](../../interface/application.js#L619) | 619 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L628) | 628 |
| [`exportAuditHistory`](../../interface/application.js#L640) | 640 |
| [`auditVisibleRows`](../../interface/application.js#L652) | 652 |
| [`auditDate`](../../interface/application.js#L674) | 674 |
| [`renderAuditHTML`](../../interface/application.js#L678) | 678 |
| [`hydrateAudit`](../../interface/application.js#L711) | 711 |
| [`applyAuditFilters`](../../interface/application.js#L719) | 719 |
| [`closeAuditDetail`](../../interface/application.js#L754) | 754 |
| [`showAuditDetail`](../../interface/application.js#L760) | 760 |
| [`nextRenderUsers`](../../interface/application.js#L787) | 787 |
| [`nextRenderAccount`](../../interface/application.js#L789) | 789 |
| [`hydrateAccount`](../../interface/application.js#L790) | 790 |
| [`removeAccountPhoto`](../../interface/application.js#L791) | 791 |
| [`saveState`](../../interface/application.js#L794) | 794 |
| [`getDeviceById`](../../interface/application.js#L797) | 797 |
| [`findDeviceUsingIp`](../../interface/application.js#L801) | 801 |
| [`setDevicePrimaryIp`](../../interface/application.js#L806) | 806 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L859) | 859 |
| [`validateRackPlacement`](../../interface/application.js#L872) | 872 |
| [`showToast`](../../interface/application.js#L907) | 907 |
| [`toggleSidebar`](../../interface/application.js#L993) | 993 |
| [`switchTab`](../../interface/application.js#L1012) | 1012 |
| [`escapeHtml`](../../interface/application.js#L1039) | 1039 |
| [`inlineJsArg`](../../interface/application.js#L1048) | 1048 |
| [`browserStorageWarning`](../../interface/application.js#L1056) | 1056 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1059) | 1059 |
| [`renderSectionTabIcon`](../../interface/application.js#L1065) | 1065 |
| [`renderSectionHeader`](../../interface/application.js#L1071) | 1071 |
| [`tab`](../../interface/application.js#L1072) | 1072 |
| [`revealSectionTab`](../../interface/application.js#L1099) | 1099 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1106) | 1106 |
| [`renderContent`](../../interface/application.js#L1122) | 1122 |
| [`updateScrollHint`](../../interface/application.js#L1158) | 1158 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1169) | 1169 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1204) | 1204 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1208) | 1208 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1212) | 1212 |
| [`buildInventoryReportData`](../../interface/application.js#L1218) | 1218 |
| [`occupancy`](../../interface/application.js#L1234) | 1234 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1257) | 1257 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1263) | 1263 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1289) | 1289 |
| [`renderDashboardHTML`](../../interface/application.js#L1308) | 1308 |
| [`statusPill`](../../interface/application.js#L1411) | 1411 |
| [`insightSegment`](../../interface/application.js#L1428) | 1428 |
| [`getCategoryIcon`](../../interface/application.js#L1469) | 1469 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1484) | 1484 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1493) | 1493 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1498) | 1498 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1513) | 1513 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1528) | 1528 |
| [`printRackElevation`](../../interface/application.js#L1538) | 1538 |
| [`safe`](../../interface/application.js#L1541) | 1541 |
| [`printRackElevationInFrame`](../../interface/application.js#L1572) | 1572 |
| [`frame.onload`](../../interface/application.js#L1582) | 1582 |
| [`renderRackHubV13`](../../interface/application.js#L1603) | 1603 |
| [`card`](../../interface/application.js#L1608) | 1608 |
| [`mark`](../../interface/application.js#L1617) | 1617 |
| [`bar`](../../interface/application.js#L1633) | 1633 |
| [`chartBox`](../../interface/application.js#L1634) | 1634 |
| [`chartRows`](../../interface/application.js#L1635) | 1635 |
| [`rackSpaceGuide`](../../interface/application.js#L1637) | 1637 |
| [`renderRacksHTML`](../../interface/application.js#L1706) | 1706 |
| [`changeRack`](../../interface/application.js#L1773) | 1773 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1792) | 1792 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1799) | 1799 |
| [`getVisibleDevices`](../../interface/application.js#L1805) | 1805 |
| [`filterHardwareModels`](../../interface/application.js#L1830) | 1830 |
| [`openCatalogueModal`](../../interface/application.js#L1869) | 1869 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1878) | 1878 |
| [`saveHardwareManufacturer`](../../interface/application.js#L1902) | 1902 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L1940) | 1940 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L1952) | 1952 |
| [`renderCatalogueButton`](../../interface/application.js#L1969) | 1969 |
| [`renderCatalogueRecord`](../../interface/application.js#L1973) | 1973 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L1978) | 1978 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L1997) | 1997 |
| [`add`](../../interface/application.js#L1999) | 1999 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2044) | 2044 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2051) | 2051 |
| [`openHardwareModelManager`](../../interface/application.js#L2063) | 2063 |
| [`opts`](../../interface/application.js#L2068) | 2068 |
| [`saveHardwareModel`](../../interface/application.js#L2086) | 2086 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2115) | 2115 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2129) | 2129 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2151) | 2151 |
| [`add`](../../interface/application.js#L2153) | 2153 |
| [`options`](../../interface/application.js#L2189) | 2189 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2203) | 2203 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2218) | 2218 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2233) | 2233 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2241) | 2241 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2252) | 2252 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2261) | 2261 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2283) | 2283 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2294) | 2294 |
| [`openServerServiceEditor`](../../interface/application.js#L2311) | 2311 |
| [`saveServerServiceEntry`](../../interface/application.js#L2320) | 2320 |
| [`restoreArchivedServerService`](../../interface/application.js#L2333) | 2333 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2342) | 2342 |
| [`renderDevicesHTML`](../../interface/application.js#L2354) | 2354 |
| [`renderHardwareMetric`](../../interface/application.js#L2362) | 2362 |
| [`renderHardwareChart`](../../interface/application.js#L2367) | 2367 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2377) | 2377 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2396) | 2396 |
| [`renderArchivedSoftware`](../../interface/application.js#L2404) | 2404 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2439) | 2439 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2446) | 2446 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2447) | 2447 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2448) | 2448 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2451) | 2451 |
| [`openManageTypesModal`](../../interface/application.js#L2467) | 2467 |
| [`openManageLocationsModal`](../../interface/application.js#L2468) | 2468 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2471) | 2471 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2493) | 2493 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2500) | 2500 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2508) | 2508 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2528) | 2528 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2529) | 2529 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2530) | 2530 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2545) | 2545 |
| [`deleteDeviceType`](../../interface/application.js#L2565) | 2565 |
| [`deleteDeviceLocation`](../../interface/application.js#L2566) | 2566 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2574) | 2574 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2578) | 2578 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2604) | 2604 |
| [`nodes`](../../interface/application.js#L2614) | 2614 |
| [`renderIpamManage`](../../interface/application.js#L2640) | 2640 |
| [`renderIpamHTML`](../../interface/application.js#L2690) | 2690 |
| [`changeSubnet`](../../interface/application.js#L2849) | 2849 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2862) | 2862 |
| [`openIpamModal`](../../interface/application.js#L2888) | 2888 |
| [`openBulkIpModal`](../../interface/application.js#L2893) | 2893 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L2900) | 2900 |
| [`handleBulkIpSubmit`](../../interface/application.js#L2904) | 2904 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L2923) | 2923 |
| [`applyBulkIpChanges`](../../interface/application.js#L2939) | 2939 |
| [`subnetCidrFeedback`](../../interface/application.js#L2953) | 2953 |
| [`suggestSubnetGateway`](../../interface/application.js#L2971) | 2971 |
| [`openSubnetModal`](../../interface/application.js#L2999) | 2999 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3003) | 3003 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3027) | 3027 |
| [`handleSubnetSubmit`](../../interface/application.js#L3047) | 3047 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3240) | 3240 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3244) | 3244 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3249) | 3249 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3270) | 3270 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3274) | 3274 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3278) | 3278 |
| [`deleteSubnet`](../../interface/application.js#L3289) | 3289 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3349) | 3349 |
| [`deleteSubnetCommit`](../../interface/application.js#L3377) | 3377 |
| [`deleteVlan`](../../interface/application.js#L3407) | 3407 |
| [`openIpModal`](../../interface/application.js#L3433) | 3433 |
| [`handleIpSubmit`](../../interface/application.js#L3450) | 3450 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3516) | 3516 |
| [`modalFormSnapshot`](../../interface/application.js#L3526) | 3526 |
| [`rememberModalForm`](../../interface/application.js#L3531) | 3531 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3536) | 3536 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3555) | 3555 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3574) | 3574 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3583) | 3583 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3589) | 3589 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3595) | 3595 |
| [`closeModal`](../../interface/application.js#L3604) | 3604 |
| [`openModal`](../../interface/application.js#L3629) | 3629 |
| [`readRackDimension`](../../interface/application.js#L3702) | 3702 |
| [`formatRackDimension`](../../interface/application.js#L3709) | 3709 |
| [`rackPhysicalDetails`](../../interface/application.js#L3714) | 3714 |
| [`openRackModal`](../../interface/application.js#L3723) | 3723 |
| [`handleRackSubmit`](../../interface/application.js#L3739) | 3739 |
| [`deleteRack`](../../interface/application.js#L3806) | 3806 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3828) | 3828 |
| [`refresh`](../../interface/application.js#L3851) | 3851 |
| [`openAssignDeviceModal`](../../interface/application.js#L3928) | 3928 |
| [`refresh`](../../interface/application.js#L3945) | 3945 |
| [`refreshAssignStartPositions`](../../interface/application.js#L3952) | 3952 |
| [`handleAssignSubmit`](../../interface/application.js#L3986) | 3986 |
| [`unassignDevice`](../../interface/application.js#L4031) | 4031 |
| [`getSubnetForIp`](../../interface/application.js#L4048) | 4048 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4052) | 4052 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4096) | 4096 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4105) | 4105 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4114) | 4114 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4136) | 4136 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4146) | 4146 |
| [`toggleDeviceMountType`](../../interface/application.js#L4190) | 4190 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4211) | 4211 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4216) | 4216 |
| [`openDeviceReviewModal`](../../interface/application.js#L4234) | 4234 |
| [`openDeviceDetailView`](../../interface/application.js#L4239) | 4239 |
| [`safe`](../../interface/application.js#L4249) | 4249 |
| [`field`](../../interface/application.js#L4250) | 4250 |
| [`section`](../../interface/application.js#L4251) | 4251 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4294) | 4294 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4300) | 4300 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4319) | 4319 |
| [`navigateToDeviceRack`](../../interface/application.js#L4335) | 4335 |
| [`duplicateDevice`](../../interface/application.js#L4363) | 4363 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4433) | 4433 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4438) | 4438 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4443) | 4443 |
| [`openServerServiceManager`](../../interface/application.js#L4444) | 4444 |
| [`captureServerServiceSelections`](../../interface/application.js#L4449) | 4449 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4455) | 4455 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4476) | 4476 |
| [`archiveServerService`](../../interface/application.js#L4484) | 4484 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4508) | 4508 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4512) | 4512 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4530) | 4530 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4534) | 4534 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4537) | 4537 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4544) | 4544 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4572) | 4572 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4576) | 4576 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4617) | 4617 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4650) | 4650 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4667) | 4667 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4670) | 4670 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4671) | 4671 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4676) | 4676 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4682) | 4682 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4718) | 4718 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4719) | 4719 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4726) | 4726 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4727) | 4727 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4742) | 4742 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4746) | 4746 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4749) | 4749 |
| [`isSoftwareDetailField`](../../interface/application.js#L4756) | 4756 |
| [`renderInlineDevicePicker`](../../interface/application.js#L4763) | 4763 |
| [`updateInlinePickerCount`](../../interface/application.js#L4773) | 4773 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L4779) | 4779 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L4792) | 4792 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L4801) | 4801 |
| [`fail`](../../interface/application.js#L4807) | 4807 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L4860) | 4860 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L4876) | 4876 |
| [`fail`](../../interface/application.js#L4881) | 4881 |
| [`renderDeviceDetailFields`](../../interface/application.js#L4928) | 4928 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L4958) | 4958 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L4964) | 4964 |
| [`getPlatformVersionOptions`](../../interface/application.js#L4984) | 4984 |
| [`isWindowsPlatform`](../../interface/application.js#L4987) | 4987 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L4990) | 4990 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L4999) | 4999 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5036) | 5036 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5044) | 5044 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5054) | 5054 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L5058) | 5058 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5069) | 5069 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5080) | 5080 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5104) | 5104 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5108) | 5108 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5112) | 5112 |
| [`getDefaultMountType`](../../interface/application.js#L5125) | 5125 |
| [`renderDeviceMountOptions`](../../interface/application.js#L5128) | 5128 |
| [`updateDeviceMountChoices`](../../interface/application.js#L5133) | 5133 |
| [`initialiseNotesEditor`](../../interface/application.js#L5146) | 5146 |
| [`inlineMarkdown`](../../interface/application.js#L5151) | 5151 |
| [`render`](../../interface/application.js#L5164) | 5164 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5198) | 5198 |
| [`activate`](../../interface/application.js#L5600) | 5600 |
| [`openDeviceModal`](../../interface/application.js#L5672) | 5672 |
| [`syncVmPurpose`](../../interface/application.js#L5714) | 5714 |
| [`clearFieldError`](../../interface/application.js#L5763) | 5763 |
| [`captureDeviceFormDraft`](../../interface/application.js#L5782) | 5782 |
| [`createRackFromDevice`](../../interface/application.js#L5813) | 5813 |
| [`cancelRackFromDevice`](../../interface/application.js#L5821) | 5821 |
| [`createSubnetFromDevice`](../../interface/application.js#L5831) | 5831 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L5844) | 5844 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L5858) | 5858 |
| [`addCustomLocationOption`](../../interface/application.js#L5869) | 5869 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L5907) | 5907 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L5919) | 5919 |
| [`finish`](../../interface/application.js#L5939) | 5939 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L5964) | 5964 |
| [`finish`](../../interface/application.js#L5978) | 5978 |
| [`handleDeviceSubmit`](../../interface/application.js#L5998) | 5998 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L6037) | 6037 |
| [`deleteDevice`](../../interface/application.js#L6169) | 6169 |
| [`personalSafeStorageGet`](../../interface/application.js#L6226) | 6226 |
| [`openBackupExplanationDialog`](../../interface/application.js#L6231) | 6231 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L6241) | 6241 |
| [`button`](../../interface/application.js#L6242) | 6242 |
| [`themeChoice`](../../interface/application.js#L6246) | 6246 |
| [`guideLinks`](../../interface/application.js#L6263) | 6263 |
| [`loadSmtpSettings`](../../interface/application.js#L6294) | 6294 |
| [`renderApplicationSettings`](../../interface/application.js#L6309) | 6309 |
| [`syncSmtpForm`](../../interface/application.js#L6313) | 6313 |
| [`updateSmtpFields`](../../interface/application.js#L6335) | 6335 |
| [`hydrateSettings`](../../interface/application.js#L6348) | 6348 |
| [`caffootCompareVersions`](../../interface/application.js#L6369) | 6369 |
| [`parse`](../../interface/application.js#L6370) | 6370 |
| [`caffootShowLicences`](../../interface/application.js#L6392) | 6392 |
| [`caffootUpdateGuide`](../../interface/application.js#L6397) | 6397 |
| [`caffootCheckUpdates`](../../interface/application.js#L6402) | 6402 |
| [`checkInventorySafety`](../../interface/application.js#L6433) | 6433 |
| [`requestInventoryReset`](../../interface/application.js#L6456) | 6456 |
| [`createInventoryBackup`](../../interface/application.js#L6483) | 6483 |
| [`validateBackupVersion`](../../interface/application.js#L6495) | 6495 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L6510) | 6510 |
| [`exportData`](../../interface/application.js#L6518) | 6518 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L6531) | 6531 |
| [`validateBackupStructure`](../../interface/application.js#L6546) | 6546 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L6563) | 6563 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L6575) | 6575 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L6613) | 6613 |
| [`findRackImportConflicts`](../../interface/application.js#L6617) | 6617 |
| [`place`](../../interface/application.js#L6623) | 6623 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L6666) | 6666 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L6687) | 6687 |
| [`showBackupImportError`](../../interface/application.js#L6692) | 6692 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L6696) | 6696 |
| [`finish`](../../interface/application.js#L6706) | 6706 |
| [`onClick`](../../interface/application.js#L6715) | 6715 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L6725) | 6725 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L6736) | 6736 |
| [`finish`](../../interface/application.js#L6747) | 6747 |
| [`onClick`](../../interface/application.js#L6756) | 6756 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L6771) | 6771 |
| [`importData`](../../interface/application.js#L6787) | 6787 |
| [`reader.onload`](../../interface/application.js#L6797) | 6797 |
| [`reader.onerror`](../../interface/application.js#L6871) | 6871 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L6999) | 6999 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L7015) | 7015 |
| [`openRackAccessoryEditor`](../../interface/application.js#L7026) | 7026 |
| [`refreshAccessoryOptions`](../../interface/application.js#L7060) | 7060 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L7117) | 7117 |
| [`cancel`](../../interface/application.js#L7129) | 7129 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L7145) | 7145 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L7162) | 7162 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L7187) | 7187 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L7201) | 7201 |
| [`clearRackDropPreview`](../../interface/application.js#L7204) | 7204 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L7209) | 7209 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L7221) | 7221 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L7227) | 7227 |
| [`trackRackDrag`](../../interface/application.js#L7236) | 7236 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L7267) | 7267 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L7277) | 7277 |
| [`getRackDropPosition`](../../interface/application.js#L7370) | 7370 |
| [`window.onload`](../../interface/application.js#L7821) | 7821 |
| [`refreshCentralInventory`](../../interface/application.js#L7836) | 7836 |
| [`postInventory`](../../interface/application.js#L7857) | 7857 |
| [`isBlockedAction`](../../interface/application.js#L7909) | 7909 |
| [`applyAllowedControls`](../../interface/application.js#L7937) | 7937 |
| [`enhanceLongSelects`](../../interface/application.js#L7962) | 7962 |
| [`sync`](../../interface/application.js#L8013) | 8013 |
| [`close`](../../interface/application.js#L8019) | 8019 |
| [`choose`](../../interface/application.js#L8023) | 8023 |
| [`draw`](../../interface/application.js#L8028) | 8028 |
| [`open`](../../interface/application.js#L8046) | 8046 |
| [`enhanceSelects`](../../interface/application.js#L8102) | 8102 |
| [`switchTab`](../../interface/application.js#L8148) | 8148 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L8159) | 8159 |
| [`openDeviceDetailView`](../../interface/application.js#L8185) | 8185 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L8193) | 8193 |
| [`forbidRackMount`](../../interface/application.js#L8221) | 8221 |
| [`openDeviceModal`](../../interface/application.js#L8231) | 8231 |
| [`nextDeviceModalClosed`](../../interface/application.js#L8273) | 8273 |
| [`relatedChanges`](../../interface/application.js#L8279) | 8279 |
| [`saveDevice`](../../interface/application.js#L8290) | 8290 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L8317) | 8317 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L8318) | 8318 |
| [`nextIpamBridge.save`](../../interface/application.js#L8340) | 8340 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L8362) | 8362 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L8384) | 8384 |
| [`nextSettingsBridge.save`](../../interface/application.js#L8414) | 8414 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L8431) | 8431 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L8432) | 8432 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L8433) | 8433 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L8447) | 8447 |
| [`nextResetBridge.reset`](../../interface/application.js#L8478) | 8478 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L8505) | 8505 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L8532) | 8532 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L8533) | 8533 |
| [`nextRackBridge.save`](../../interface/application.js#L8568) | 8568 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L8571) | 8571 |
| [`nextRackBridge.persist`](../../interface/application.js#L8574) | 8574 |
| [`reserveForDelete`](../../interface/application.js#L8596) | 8596 |
| [`removeDevice`](../../interface/application.js#L8604) | 8604 |
| [`cancelDelete`](../../interface/application.js#L8630) | 8630 |
| [`saveArchivedInstallation`](../../interface/application.js#L8636) | 8636 |
| [`renderAccountSections`](../../interface/application.js#L8671) | 8671 |
| [`renderAccountMfaPanel`](../../interface/application.js#L8699) | 8699 |
| [`nextRenderAccount`](../../interface/application.js#L8709) | 8709 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L8717) | 8717 |
| [`closeEmailVerification`](../../interface/application.js#L8741) | 8741 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L8748) | 8748 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L8759) | 8759 |
| [`hydrateAccount`](../../interface/application.js#L8813) | 8813 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L8851) | 8851 |
| [`loadAccountProfile`](../../interface/application.js#L8864) | 8864 |
| [`removeAccountPhoto`](../../interface/application.js#L8880) | 8880 |
| [`nextRenderUsers`](../../interface/application.js#L8889) | 8889 |
| [`profileFields`](../../interface/application.js#L8891) | 8891 |
| [`stat`](../../interface/application.js#L8912) | 8912 |
| [`bars`](../../interface/application.js#L8915) | 8915 |
| [`operation`](../../interface/application.js#L8967) | 8967 |
| [`filterUserRows`](../../interface/application.js#L8987) | 8987 |
| [`closeUserWorkspace`](../../interface/application.js#L9011) | 9011 |
| [`loadCentralUsers`](../../interface/application.js#L9040) | 9040 |
| [`changeCentralUser`](../../interface/application.js#L9046) | 9046 |
| [`importPanel`](../../interface/application.js#L9057) | 9057 |
| [`cancelImport`](../../interface/application.js#L9061) | 9061 |
| [`nextImportModalClosed`](../../interface/application.js#L9067) | 9067 |
| [`showImportReview`](../../interface/application.js#L9068) | 9068 |
| [`chooseImportFile`](../../interface/application.js#L9108) | 9108 |
| [`actOnImport`](../../interface/application.js#L9125) | 9125 |

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
| [`find_access_point_mount_conflicts`](../../backend/access_point_review.py#L18) | 18 |
| [`apply_access_point_mount_choices`](../../backend/access_point_review.py#L39) | 39 |

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
| [`validate_detached_application_state`](../../backend/application_integrity.py#L13) | 13 |

## backend/audit_events.py

| Function | Line |
| --- | ---: |
| [`_safe_audit_value`](../../backend/audit_events.py#L34) | 34 |
| [`safe_device_differences`](../../backend/audit_events.py#L46) | 46 |
| [`safe_inventory_differences`](../../backend/audit_events.py#L64) | 64 |
| [`attribute_event`](../../backend/audit_events.py#L88) | 88 |
| [`record_actor_event`](../../backend/audit_events.py#L103) | 103 |

## backend/authentication.py

| Function | Line |
| --- | ---: |
| [`authenticate`](../../backend/authentication.py#L14) | 14 |

## backend/collection_saves.py

| Function | Line |
| --- | ---: |
| [`change_inventory_record`](../../backend/collection_saves.py#L19) | 19 |
| [`change_ipam_subnet_and_vlan_records`](../../backend/collection_saves.py#L105) | 105 |
| [`delete_subnet_with_dependencies`](../../backend/collection_saves.py#L242) | 242 |

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
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L24) | 24 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L43) | 43 |
| [`_persist_related_guests`](../../backend/device_saves.py#L87) | 87 |
| [`save_reserved_device`](../../backend/device_saves.py#L100) | 100 |
| [`create_device`](../../backend/device_saves.py#L232) | 232 |
| [`delete_reserved_device`](../../backend/device_saves.py#L305) | 305 |

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
| [`normalise_detached_v133_state`](../../backend/normalisation_pipeline.py#L75) | 75 |

## backend/normalisation_validation.py

| Function | Line |
| --- | ---: |
| [`_number`](../../backend/normalisation_validation.py#L11) | 11 |
| [`_integer`](../../backend/normalisation_validation.py#L22) | 22 |
| [`_valid_ipv4`](../../backend/normalisation_validation.py#L26) | 26 |
| [`validate_normalisation_vlans`](../../backend/normalisation_validation.py#L36) | 36 |
| [`validate_normalisation_devices`](../../backend/normalisation_validation.py#L58) | 58 |

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
| [`_number`](../../backend/rack_validation.py#L16) | 16 |
| [`_integer`](../../backend/rack_validation.py#L34) | 34 |
| [`_label`](../../backend/rack_validation.py#L39) | 39 |
| [`find_rack_import_conflicts`](../../backend/rack_validation.py#L43) | 43 |
| [`find_rack_import_conflicts.place`](../../backend/rack_validation.py#L50) | 50 |

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
| [`Handler.handle_account_email`](../../backend/server.py#L920) | 920 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1000) | 1000 |
| [`Handler.handle_import`](../../backend/server.py#L1031) | 1031 |
| [`Handler.respond`](../../backend/server.py#L1107) | 1107 |
| [`main`](../../backend/server.py#L1120) | 1120 |

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
