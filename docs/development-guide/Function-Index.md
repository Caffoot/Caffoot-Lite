# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the three application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 644.** Regenerate after changing declarations or their lines. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`toggleSidebar`](../../interface/application.js#L994) | 994 |
| [`switchTab`](../../interface/application.js#L1013) | 1013 |
| [`escapeHtml`](../../interface/application.js#L1040) | 1040 |
| [`inlineJsArg`](../../interface/application.js#L1049) | 1049 |
| [`browserStorageWarning`](../../interface/application.js#L1057) | 1057 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1060) | 1060 |
| [`renderSectionTabIcon`](../../interface/application.js#L1066) | 1066 |
| [`renderSectionHeader`](../../interface/application.js#L1072) | 1072 |
| [`tab`](../../interface/application.js#L1073) | 1073 |
| [`revealSectionTab`](../../interface/application.js#L1100) | 1100 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1107) | 1107 |
| [`renderContent`](../../interface/application.js#L1123) | 1123 |
| [`updateScrollHint`](../../interface/application.js#L1159) | 1159 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1170) | 1170 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1205) | 1205 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1209) | 1209 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1213) | 1213 |
| [`buildInventoryReportData`](../../interface/application.js#L1219) | 1219 |
| [`occupancy`](../../interface/application.js#L1235) | 1235 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1258) | 1258 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1264) | 1264 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1290) | 1290 |
| [`renderDashboardHTML`](../../interface/application.js#L1309) | 1309 |
| [`statusPill`](../../interface/application.js#L1412) | 1412 |
| [`insightSegment`](../../interface/application.js#L1429) | 1429 |
| [`getCategoryIcon`](../../interface/application.js#L1470) | 1470 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1485) | 1485 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1494) | 1494 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1499) | 1499 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1514) | 1514 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1529) | 1529 |
| [`printRackElevation`](../../interface/application.js#L1539) | 1539 |
| [`safe`](../../interface/application.js#L1542) | 1542 |
| [`printRackElevationInFrame`](../../interface/application.js#L1573) | 1573 |
| [`frame.onload`](../../interface/application.js#L1583) | 1583 |
| [`renderRackHubV13`](../../interface/application.js#L1604) | 1604 |
| [`card`](../../interface/application.js#L1609) | 1609 |
| [`mark`](../../interface/application.js#L1618) | 1618 |
| [`bar`](../../interface/application.js#L1634) | 1634 |
| [`chartBox`](../../interface/application.js#L1635) | 1635 |
| [`chartRows`](../../interface/application.js#L1636) | 1636 |
| [`rackSpaceGuide`](../../interface/application.js#L1638) | 1638 |
| [`renderRacksHTML`](../../interface/application.js#L1707) | 1707 |
| [`changeRack`](../../interface/application.js#L1774) | 1774 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1793) | 1793 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1800) | 1800 |
| [`getVisibleDevices`](../../interface/application.js#L1806) | 1806 |
| [`filterHardwareModels`](../../interface/application.js#L1831) | 1831 |
| [`openCatalogueModal`](../../interface/application.js#L1870) | 1870 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L1879) | 1879 |
| [`saveHardwareManufacturer`](../../interface/application.js#L1903) | 1903 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L1941) | 1941 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L1953) | 1953 |
| [`renderCatalogueButton`](../../interface/application.js#L1970) | 1970 |
| [`renderCatalogueRecord`](../../interface/application.js#L1974) | 1974 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L1979) | 1979 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L1998) | 1998 |
| [`add`](../../interface/application.js#L2000) | 2000 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2045) | 2045 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2052) | 2052 |
| [`openHardwareModelManager`](../../interface/application.js#L2064) | 2064 |
| [`opts`](../../interface/application.js#L2069) | 2069 |
| [`saveHardwareModel`](../../interface/application.js#L2087) | 2087 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2116) | 2116 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2130) | 2130 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2152) | 2152 |
| [`add`](../../interface/application.js#L2154) | 2154 |
| [`options`](../../interface/application.js#L2190) | 2190 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2204) | 2204 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2219) | 2219 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2234) | 2234 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2242) | 2242 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2253) | 2253 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2262) | 2262 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2284) | 2284 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2295) | 2295 |
| [`openServerServiceEditor`](../../interface/application.js#L2312) | 2312 |
| [`saveServerServiceEntry`](../../interface/application.js#L2321) | 2321 |
| [`restoreArchivedServerService`](../../interface/application.js#L2334) | 2334 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2343) | 2343 |
| [`renderDevicesHTML`](../../interface/application.js#L2355) | 2355 |
| [`renderHardwareMetric`](../../interface/application.js#L2363) | 2363 |
| [`renderHardwareChart`](../../interface/application.js#L2368) | 2368 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2378) | 2378 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2397) | 2397 |
| [`renderArchivedSoftware`](../../interface/application.js#L2405) | 2405 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2440) | 2440 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2447) | 2447 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2448) | 2448 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2449) | 2449 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2452) | 2452 |
| [`openManageTypesModal`](../../interface/application.js#L2468) | 2468 |
| [`openManageLocationsModal`](../../interface/application.js#L2469) | 2469 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2472) | 2472 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2494) | 2494 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2501) | 2501 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2509) | 2509 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2529) | 2529 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2530) | 2530 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2531) | 2531 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2546) | 2546 |
| [`deleteDeviceType`](../../interface/application.js#L2566) | 2566 |
| [`deleteDeviceLocation`](../../interface/application.js#L2567) | 2567 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2575) | 2575 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2579) | 2579 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2605) | 2605 |
| [`nodes`](../../interface/application.js#L2615) | 2615 |
| [`renderIpamManage`](../../interface/application.js#L2641) | 2641 |
| [`renderIpamHTML`](../../interface/application.js#L2691) | 2691 |
| [`changeSubnet`](../../interface/application.js#L2850) | 2850 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L2863) | 2863 |
| [`openIpamModal`](../../interface/application.js#L2889) | 2889 |
| [`openBulkIpModal`](../../interface/application.js#L2894) | 2894 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L2901) | 2901 |
| [`handleBulkIpSubmit`](../../interface/application.js#L2905) | 2905 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L2924) | 2924 |
| [`applyBulkIpChanges`](../../interface/application.js#L2940) | 2940 |
| [`subnetCidrFeedback`](../../interface/application.js#L2954) | 2954 |
| [`suggestSubnetGateway`](../../interface/application.js#L2972) | 2972 |
| [`openSubnetModal`](../../interface/application.js#L3000) | 3000 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3004) | 3004 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3028) | 3028 |
| [`handleSubnetSubmit`](../../interface/application.js#L3048) | 3048 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3241) | 3241 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3245) | 3245 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3250) | 3250 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3271) | 3271 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3275) | 3275 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3279) | 3279 |
| [`deleteSubnet`](../../interface/application.js#L3290) | 3290 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3350) | 3350 |
| [`deleteSubnetCommit`](../../interface/application.js#L3378) | 3378 |
| [`deleteVlan`](../../interface/application.js#L3408) | 3408 |
| [`openIpModal`](../../interface/application.js#L3434) | 3434 |
| [`handleIpSubmit`](../../interface/application.js#L3451) | 3451 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3517) | 3517 |
| [`modalFormSnapshot`](../../interface/application.js#L3527) | 3527 |
| [`rememberModalForm`](../../interface/application.js#L3532) | 3532 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L3537) | 3537 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L3556) | 3556 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L3575) | 3575 |
| [`keepEditingDeviceForm`](../../interface/application.js#L3584) | 3584 |
| [`discardDeviceFormChanges`](../../interface/application.js#L3590) | 3590 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L3596) | 3596 |
| [`closeModal`](../../interface/application.js#L3605) | 3605 |
| [`openModal`](../../interface/application.js#L3630) | 3630 |
| [`readRackDimension`](../../interface/application.js#L3703) | 3703 |
| [`formatRackDimension`](../../interface/application.js#L3710) | 3710 |
| [`rackPhysicalDetails`](../../interface/application.js#L3715) | 3715 |
| [`openRackModal`](../../interface/application.js#L3724) | 3724 |
| [`handleRackSubmit`](../../interface/application.js#L3740) | 3740 |
| [`deleteRack`](../../interface/application.js#L3807) | 3807 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L3829) | 3829 |
| [`refresh`](../../interface/application.js#L3852) | 3852 |
| [`openAssignDeviceModal`](../../interface/application.js#L3929) | 3929 |
| [`refresh`](../../interface/application.js#L3946) | 3946 |
| [`refreshAssignStartPositions`](../../interface/application.js#L3953) | 3953 |
| [`handleAssignSubmit`](../../interface/application.js#L3987) | 3987 |
| [`unassignDevice`](../../interface/application.js#L4032) | 4032 |
| [`getSubnetForIp`](../../interface/application.js#L4049) | 4049 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4053) | 4053 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4097) | 4097 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4106) | 4106 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4115) | 4115 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4137) | 4137 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4147) | 4147 |
| [`toggleDeviceMountType`](../../interface/application.js#L4191) | 4191 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4212) | 4212 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4217) | 4217 |
| [`openDeviceReviewModal`](../../interface/application.js#L4235) | 4235 |
| [`openDeviceDetailView`](../../interface/application.js#L4240) | 4240 |
| [`safe`](../../interface/application.js#L4250) | 4250 |
| [`field`](../../interface/application.js#L4251) | 4251 |
| [`section`](../../interface/application.js#L4252) | 4252 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4295) | 4295 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4301) | 4301 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4320) | 4320 |
| [`navigateToDeviceRack`](../../interface/application.js#L4336) | 4336 |
| [`duplicateDevice`](../../interface/application.js#L4364) | 4364 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4434) | 4434 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4439) | 4439 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4444) | 4444 |
| [`openServerServiceManager`](../../interface/application.js#L4445) | 4445 |
| [`captureServerServiceSelections`](../../interface/application.js#L4450) | 4450 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4456) | 4456 |
| [`confirmServerServiceArchive`](../../interface/application.js#L4477) | 4477 |
| [`archiveServerService`](../../interface/application.js#L4485) | 4485 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L4509) | 4509 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L4513) | 4513 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L4531) | 4531 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L4535) | 4535 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L4538) | 4538 |
| [`updateHardwareCatalogue`](../../interface/application.js#L4545) | 4545 |
| [`isVirtualDeviceForm`](../../interface/application.js#L4573) | 4573 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L4577) | 4577 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L4622) | 4622 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L4655) | 4655 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L4672) | 4672 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L4675) | 4675 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L4676) | 4676 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L4681) | 4681 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L4687) | 4687 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L4724) | 4724 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L4725) | 4725 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L4732) | 4732 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L4733) | 4733 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L4748) | 4748 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L4752) | 4752 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L4755) | 4755 |
| [`isSoftwareDetailField`](../../interface/application.js#L4762) | 4762 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L4770) | 4770 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L4779) | 4779 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L4785) | 4785 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L4795) | 4795 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L4832) | 4832 |
| [`renderInlineDevicePicker`](../../interface/application.js#L4860) | 4860 |
| [`updateInlinePickerCount`](../../interface/application.js#L4870) | 4870 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L4876) | 4876 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L4889) | 4889 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L4898) | 4898 |
| [`fail`](../../interface/application.js#L4904) | 4904 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L4958) | 4958 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L4974) | 4974 |
| [`fail`](../../interface/application.js#L4979) | 4979 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5026) | 5026 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5056) | 5056 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5062) | 5062 |
| [`getPlatformVersionOptions`](../../interface/application.js#L5082) | 5082 |
| [`isWindowsPlatform`](../../interface/application.js#L5085) | 5085 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L5088) | 5088 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L5108) | 5108 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L5145) | 5145 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L5153) | 5153 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L5163) | 5163 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L5167) | 5167 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L5178) | 5178 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L5189) | 5189 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L5215) | 5215 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L5219) | 5219 |
| [`getSuggestedMountTypes`](../../interface/application.js#L5223) | 5223 |
| [`getDefaultMountType`](../../interface/application.js#L5236) | 5236 |
| [`renderDeviceMountOptions`](../../interface/application.js#L5239) | 5239 |
| [`updateDeviceMountChoices`](../../interface/application.js#L5244) | 5244 |
| [`initialiseNotesEditor`](../../interface/application.js#L5257) | 5257 |
| [`inlineMarkdown`](../../interface/application.js#L5262) | 5262 |
| [`render`](../../interface/application.js#L5275) | 5275 |
| [`initialiseDeviceTabs`](../../interface/application.js#L5309) | 5309 |
| [`activate`](../../interface/application.js#L5703) | 5703 |
| [`openDeviceModal`](../../interface/application.js#L5783) | 5783 |
| [`syncVmPurpose`](../../interface/application.js#L5825) | 5825 |
| [`clearFieldError`](../../interface/application.js#L5875) | 5875 |
| [`captureDeviceFormDraft`](../../interface/application.js#L5894) | 5894 |
| [`createRackFromDevice`](../../interface/application.js#L5925) | 5925 |
| [`cancelRackFromDevice`](../../interface/application.js#L5933) | 5933 |
| [`createSubnetFromDevice`](../../interface/application.js#L5943) | 5943 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L5956) | 5956 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L5970) | 5970 |
| [`addCustomLocationOption`](../../interface/application.js#L5981) | 5981 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L6019) | 6019 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L6031) | 6031 |
| [`finish`](../../interface/application.js#L6051) | 6051 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L6076) | 6076 |
| [`finish`](../../interface/application.js#L6090) | 6090 |
| [`handleDeviceSubmit`](../../interface/application.js#L6110) | 6110 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L6149) | 6149 |
| [`deleteDevice`](../../interface/application.js#L6281) | 6281 |
| [`personalSafeStorageGet`](../../interface/application.js#L6338) | 6338 |
| [`openBackupExplanationDialog`](../../interface/application.js#L6343) | 6343 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L6353) | 6353 |
| [`button`](../../interface/application.js#L6354) | 6354 |
| [`themeChoice`](../../interface/application.js#L6358) | 6358 |
| [`guideLinks`](../../interface/application.js#L6375) | 6375 |
| [`loadSmtpSettings`](../../interface/application.js#L6406) | 6406 |
| [`renderApplicationSettings`](../../interface/application.js#L6421) | 6421 |
| [`syncSmtpForm`](../../interface/application.js#L6425) | 6425 |
| [`updateSmtpFields`](../../interface/application.js#L6447) | 6447 |
| [`hydrateSettings`](../../interface/application.js#L6460) | 6460 |
| [`caffootCompareVersions`](../../interface/application.js#L6481) | 6481 |
| [`parse`](../../interface/application.js#L6482) | 6482 |
| [`caffootShowLicences`](../../interface/application.js#L6504) | 6504 |
| [`caffootUpdateGuide`](../../interface/application.js#L6509) | 6509 |
| [`caffootCheckUpdates`](../../interface/application.js#L6514) | 6514 |
| [`checkInventorySafety`](../../interface/application.js#L6545) | 6545 |
| [`requestInventoryReset`](../../interface/application.js#L6568) | 6568 |
| [`createInventoryBackup`](../../interface/application.js#L6595) | 6595 |
| [`validateBackupVersion`](../../interface/application.js#L6607) | 6607 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L6622) | 6622 |
| [`exportData`](../../interface/application.js#L6630) | 6630 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L6643) | 6643 |
| [`validateBackupStructure`](../../interface/application.js#L6658) | 6658 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L6675) | 6675 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L6687) | 6687 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L6725) | 6725 |
| [`findRackImportConflicts`](../../interface/application.js#L6729) | 6729 |
| [`place`](../../interface/application.js#L6735) | 6735 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L6778) | 6778 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L6799) | 6799 |
| [`showBackupImportError`](../../interface/application.js#L6804) | 6804 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L6808) | 6808 |
| [`finish`](../../interface/application.js#L6818) | 6818 |
| [`onClick`](../../interface/application.js#L6827) | 6827 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L6837) | 6837 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L6848) | 6848 |
| [`finish`](../../interface/application.js#L6859) | 6859 |
| [`onClick`](../../interface/application.js#L6868) | 6868 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L6883) | 6883 |
| [`importData`](../../interface/application.js#L6899) | 6899 |
| [`reader.onload`](../../interface/application.js#L6909) | 6909 |
| [`reader.onerror`](../../interface/application.js#L6983) | 6983 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L7111) | 7111 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L7127) | 7127 |
| [`openRackAccessoryEditor`](../../interface/application.js#L7138) | 7138 |
| [`refreshAccessoryOptions`](../../interface/application.js#L7172) | 7172 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L7229) | 7229 |
| [`cancel`](../../interface/application.js#L7241) | 7241 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L7257) | 7257 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L7274) | 7274 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L7299) | 7299 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L7313) | 7313 |
| [`clearRackDropPreview`](../../interface/application.js#L7316) | 7316 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L7321) | 7321 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L7333) | 7333 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L7339) | 7339 |
| [`trackRackDrag`](../../interface/application.js#L7348) | 7348 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L7379) | 7379 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L7389) | 7389 |
| [`getRackDropPosition`](../../interface/application.js#L7482) | 7482 |
| [`window.onload`](../../interface/application.js#L7933) | 7933 |
| [`refreshCentralInventory`](../../interface/application.js#L7948) | 7948 |
| [`postInventory`](../../interface/application.js#L7969) | 7969 |
| [`isBlockedAction`](../../interface/application.js#L8021) | 8021 |
| [`applyAllowedControls`](../../interface/application.js#L8049) | 8049 |
| [`enhanceLongSelects`](../../interface/application.js#L8074) | 8074 |
| [`sync`](../../interface/application.js#L8125) | 8125 |
| [`close`](../../interface/application.js#L8131) | 8131 |
| [`choose`](../../interface/application.js#L8135) | 8135 |
| [`draw`](../../interface/application.js#L8140) | 8140 |
| [`open`](../../interface/application.js#L8158) | 8158 |
| [`enhanceSelects`](../../interface/application.js#L8214) | 8214 |
| [`switchTab`](../../interface/application.js#L8260) | 8260 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L8271) | 8271 |
| [`openDeviceDetailView`](../../interface/application.js#L8297) | 8297 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L8305) | 8305 |
| [`forbidRackMount`](../../interface/application.js#L8333) | 8333 |
| [`openDeviceModal`](../../interface/application.js#L8343) | 8343 |
| [`nextDeviceModalClosed`](../../interface/application.js#L8385) | 8385 |
| [`relatedChanges`](../../interface/application.js#L8391) | 8391 |
| [`saveDevice`](../../interface/application.js#L8402) | 8402 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L8429) | 8429 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L8430) | 8430 |
| [`nextIpamBridge.save`](../../interface/application.js#L8452) | 8452 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L8474) | 8474 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L8496) | 8496 |
| [`nextSettingsBridge.save`](../../interface/application.js#L8526) | 8526 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L8543) | 8543 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L8544) | 8544 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L8545) | 8545 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L8559) | 8559 |
| [`nextResetBridge.reset`](../../interface/application.js#L8590) | 8590 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L8617) | 8617 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L8644) | 8644 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L8645) | 8645 |
| [`nextRackBridge.save`](../../interface/application.js#L8680) | 8680 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L8683) | 8683 |
| [`nextRackBridge.persist`](../../interface/application.js#L8686) | 8686 |
| [`reserveForDelete`](../../interface/application.js#L8708) | 8708 |
| [`removeDevice`](../../interface/application.js#L8716) | 8716 |
| [`cancelDelete`](../../interface/application.js#L8742) | 8742 |
| [`saveArchivedInstallation`](../../interface/application.js#L8748) | 8748 |
| [`renderAccountSections`](../../interface/application.js#L8783) | 8783 |
| [`renderAccountMfaPanel`](../../interface/application.js#L8811) | 8811 |
| [`nextRenderAccount`](../../interface/application.js#L8821) | 8821 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L8829) | 8829 |
| [`closeEmailVerification`](../../interface/application.js#L8853) | 8853 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L8860) | 8860 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L8871) | 8871 |
| [`hydrateAccount`](../../interface/application.js#L8925) | 8925 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L8963) | 8963 |
| [`loadAccountProfile`](../../interface/application.js#L8976) | 8976 |
| [`removeAccountPhoto`](../../interface/application.js#L8992) | 8992 |
| [`nextRenderUsers`](../../interface/application.js#L9001) | 9001 |
| [`profileFields`](../../interface/application.js#L9003) | 9003 |
| [`stat`](../../interface/application.js#L9024) | 9024 |
| [`bars`](../../interface/application.js#L9027) | 9027 |
| [`operation`](../../interface/application.js#L9079) | 9079 |
| [`filterUserRows`](../../interface/application.js#L9099) | 9099 |
| [`closeUserWorkspace`](../../interface/application.js#L9123) | 9123 |
| [`loadCentralUsers`](../../interface/application.js#L9152) | 9152 |
| [`changeCentralUser`](../../interface/application.js#L9158) | 9158 |
| [`importPanel`](../../interface/application.js#L9169) | 9169 |
| [`cancelImport`](../../interface/application.js#L9173) | 9173 |
| [`nextImportModalClosed`](../../interface/application.js#L9179) | 9179 |
| [`showImportReview`](../../interface/application.js#L9180) | 9180 |
| [`chooseImportFile`](../../interface/application.js#L9220) | 9220 |
| [`actOnImport`](../../interface/application.js#L9237) | 9237 |

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
| [`validate_detached_application_state`](../../backend/application_integrity.py#L14) | 14 |

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
| [`change_ipam_subnet_and_vlan_records`](../../backend/collection_saves.py#L109) | 109 |
| [`delete_subnet_with_dependencies`](../../backend/collection_saves.py#L246) | 246 |
| [`remove_linked_rack_shelf`](../../backend/collection_saves.py#L363) | 363 |

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
| [`normalise_detached_v133_state`](../../backend/normalisation_pipeline.py#L75) | 75 |

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
