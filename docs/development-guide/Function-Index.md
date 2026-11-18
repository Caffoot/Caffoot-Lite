# Caffoot Lite — Function Index

This map describes the modular runtime in the same commit as this index. Links use the current checkout's declaration locations. The [starting checkpoint index](https://github.com/Caffoot/Caffoot-Lite/blob/59a2eba19f7c2389da35be3af9606f471cba6ef3/docs/development-guide/Function-Index.md) remains historical evidence.

Scope: named JavaScript declarations/assignments in the indexed application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, every Python function/method in `backend/`, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 1207.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

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
| [`loadApplication`](../../interface/loader.js#L102) | 102 |
| [`applicationScript.onerror`](../../interface/loader.js#L105) | 105 |
| [`showInterfaceLoadError`](../../interface/loader.js#L114) | 114 |

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
| [`caffootThemePreference`](../../interface/application.js#L546) | 546 |
| [`caffootApplyTheme`](../../interface/application.js#L553) | 553 |
| [`caffootSetTheme`](../../interface/application.js#L567) | 567 |
| [`onSystemThemeChange`](../../interface/application.js#L578) | 578 |
| [`toggleDarkMode`](../../interface/application.js#L587) | 587 |
| [`readAuditHistory`](../../interface/application.js#L594) | 594 |
| [`auditChanges`](../../interface/application.js#L598) | 598 |
| [`recordAudit`](../../interface/application.js#L635) | 635 |
| [`restoreAuditAfterRolledBackOperation`](../../interface/application.js#L644) | 644 |
| [`exportAuditHistory`](../../interface/application.js#L656) | 656 |
| [`auditVisibleRows`](../../interface/application.js#L668) | 668 |
| [`auditDate`](../../interface/application.js#L690) | 690 |
| [`renderAuditHTML`](../../interface/application.js#L694) | 694 |
| [`hydrateAudit`](../../interface/application.js#L727) | 727 |
| [`applyAuditFilters`](../../interface/application.js#L735) | 735 |
| [`closeAuditDetail`](../../interface/application.js#L770) | 770 |
| [`showAuditDetail`](../../interface/application.js#L776) | 776 |
| [`nextRenderUsers`](../../interface/application.js#L805) | 805 |
| [`nextRenderAccount`](../../interface/application.js#L807) | 807 |
| [`hydrateAccount`](../../interface/application.js#L808) | 808 |
| [`removeAccountPhoto`](../../interface/application.js#L809) | 809 |
| [`saveState`](../../interface/application.js#L812) | 812 |
| [`getDeviceById`](../../interface/application.js#L815) | 815 |
| [`findDeviceUsingIp`](../../interface/application.js#L819) | 819 |
| [`setDevicePrimaryIp`](../../interface/application.js#L824) | 824 |
| [`syncDeviceIpamRecord`](../../interface/application.js#L883) | 883 |
| [`isRackMountedDevice`](../../interface/application.js#L896) | 896 |
| [`getDeviceShelfAssociationError`](../../interface/application.js#L899) | 899 |
| [`getRackShelfLocation`](../../interface/application.js#L911) | 911 |
| [`initialiseDeviceShelfFields`](../../interface/application.js#L917) | 917 |
| [`refreshDeviceShelfFields`](../../interface/application.js#L933) | 933 |
| [`openRackShelfCreation`](../../interface/application.js#L951) | 951 |
| [`returnFromRackShelfCreation`](../../interface/application.js#L965) | 965 |
| [`createRackShelfFromDevice`](../../interface/application.js#L975) | 975 |
| [`openRackShelfRemovalReview`](../../interface/application.js#L982) | 982 |
| [`options`](../../interface/application.js#L988) | 988 |
| [`validateRackPlacement`](../../interface/application.js#L1009) | 1009 |
| [`showNotification`](../../interface/application.js#L1045) | 1045 |
| [`showToast`](../../interface/application.js#L1059) | 1059 |
| [`toggleSidebar`](../../interface/application.js#L1143) | 1143 |
| [`switchTab`](../../interface/application.js#L1162) | 1162 |
| [`escapeHtml`](../../interface/application.js#L1195) | 1195 |
| [`inlineJsArg`](../../interface/application.js#L1204) | 1204 |
| [`browserStorageWarning`](../../interface/application.js#L1212) | 1212 |
| [`acknowledgeBrowserStorageNotice`](../../interface/application.js#L1215) | 1215 |
| [`renderSectionTabIcon`](../../interface/application.js#L1221) | 1221 |
| [`renderSectionHeader`](../../interface/application.js#L1227) | 1227 |
| [`tab`](../../interface/application.js#L1228) | 1228 |
| [`revealSectionTab`](../../interface/application.js#L1255) | 1255 |
| [`revealActiveSectionTabs`](../../interface/application.js#L1262) | 1262 |
| [`renderContent`](../../interface/application.js#L1282) | 1282 |
| [`updateScrollHint`](../../interface/application.js#L1330) | 1330 |
| [`planDeviceIpAllocationIntegrityRepairs`](../../interface/application.js#L1341) | 1341 |
| [`previewInventoryIntegrityRepairs`](../../interface/application.js#L1376) | 1376 |
| [`applyPreviewedInventoryIntegrityRepairs`](../../interface/application.js#L1380) | 1380 |
| [`renderIntegrityRepairPreviewHtml`](../../interface/application.js#L1384) | 1384 |
| [`buildInventoryReportData`](../../interface/application.js#L1390) | 1390 |
| [`occupancy`](../../interface/application.js#L1406) | 1406 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](../../interface/application.js#L1429) | 1429 |
| [`downloadInventoryReportCsv`](../../interface/application.js#L1435) | 1435 |
| [`renderInventoryReportsHtml`](../../interface/application.js#L1461) | 1461 |
| [`renderDashboardHTML`](../../interface/application.js#L1480) | 1480 |
| [`statusPill`](../../interface/application.js#L1586) | 1586 |
| [`insightSegment`](../../interface/application.js#L1603) | 1603 |
| [`filterDashboardReadAccess`](../../interface/application.js#L1644) | 1644 |
| [`getCategoryIcon`](../../interface/application.js#L1661) | 1661 |
| [`getDefaultDeviceFasciaGraphic`](../../interface/application.js#L1676) | 1676 |
| [`openDeviceTypeRackFasciaSettings`](../../interface/application.js#L1685) | 1685 |
| [`saveDeviceTypeRackFasciaSettings`](../../interface/application.js#L1690) | 1690 |
| [`getOccupiedRackUnits`](../../interface/application.js#L1705) | 1705 |
| [`findAvailableRackUnitRanges`](../../interface/application.js#L1720) | 1720 |
| [`printRackElevation`](../../interface/application.js#L1730) | 1730 |
| [`safe`](../../interface/application.js#L1733) | 1733 |
| [`printRackElevationInFrame`](../../interface/application.js#L1764) | 1764 |
| [`frame.onload`](../../interface/application.js#L1774) | 1774 |
| [`renderRackHubV13`](../../interface/application.js#L1795) | 1795 |
| [`card`](../../interface/application.js#L1800) | 1800 |
| [`mark`](../../interface/application.js#L1809) | 1809 |
| [`bar`](../../interface/application.js#L1825) | 1825 |
| [`chartBox`](../../interface/application.js#L1826) | 1826 |
| [`chartRows`](../../interface/application.js#L1827) | 1827 |
| [`rackSpaceGuide`](../../interface/application.js#L1829) | 1829 |
| [`renderRacksHTML`](../../interface/application.js#L1898) | 1898 |
| [`changeRack`](../../interface/application.js#L1965) | 1965 |
| [`getEffectiveDevicePlatform`](../../interface/application.js#L1984) | 1984 |
| [`getEffectiveDevicePlatformVersion`](../../interface/application.js#L1991) | 1991 |
| [`getVisibleDevices`](../../interface/application.js#L1997) | 1997 |
| [`filterHardwareModels`](../../interface/application.js#L2022) | 2022 |
| [`openCatalogueModal`](../../interface/application.js#L2061) | 2061 |
| [`openHardwareManufacturerManager`](../../interface/application.js#L2070) | 2070 |
| [`saveHardwareManufacturer`](../../interface/application.js#L2094) | 2094 |
| [`openBuiltInManufacturerEditor`](../../interface/application.js#L2132) | 2132 |
| [`saveBuiltInManufacturerOverride`](../../interface/application.js#L2144) | 2144 |
| [`renderCatalogueButton`](../../interface/application.js#L2161) | 2161 |
| [`renderCatalogueRecord`](../../interface/application.js#L2165) | 2165 |
| [`renderDeviceCategoryCatalogue`](../../interface/application.js#L2170) | 2170 |
| [`renderHardwareManufacturersHtml`](../../interface/application.js#L2189) | 2189 |
| [`add`](../../interface/application.js#L2191) | 2191 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](../../interface/application.js#L2236) | 2236 |
| [`refreshModelDeviceTypeChoices`](../../interface/application.js#L2243) | 2243 |
| [`openHardwareModelManager`](../../interface/application.js#L2255) | 2255 |
| [`opts`](../../interface/application.js#L2260) | 2260 |
| [`saveHardwareModel`](../../interface/application.js#L2278) | 2278 |
| [`openBuiltInHardwareModelEditor`](../../interface/application.js#L2307) | 2307 |
| [`saveBuiltInHardwareModelOverride`](../../interface/application.js#L2321) | 2321 |
| [`renderHardwareModelsHtml`](../../interface/application.js#L2343) | 2343 |
| [`add`](../../interface/application.js#L2345) | 2345 |
| [`options`](../../interface/application.js#L2381) | 2381 |
| [`openSoftwareCatalogueEditor`](../../interface/application.js#L2395) | 2395 |
| [`saveCustomSoftwareEntry`](../../interface/application.js#L2410) | 2410 |
| [`confirmSoftwareCatalogueRemoval`](../../interface/application.js#L2425) | 2425 |
| [`archiveSoftwareCatalogueEntry`](../../interface/application.js#L2433) | 2433 |
| [`restoreArchivedSoftwareEntry`](../../interface/application.js#L2444) | 2444 |
| [`renderSoftwareCatalogueHtml`](../../interface/application.js#L2453) | 2453 |
| [`option`](../../interface/application.js#L2460) | 2460 |
| [`enableSuggestedSoftware`](../../interface/application.js#L2475) | 2475 |
| [`filterSoftwareCatalogue`](../../interface/application.js#L2486) | 2486 |
| [`openServerServiceEditor`](../../interface/application.js#L2503) | 2503 |
| [`saveServerServiceEntry`](../../interface/application.js#L2512) | 2512 |
| [`restoreArchivedServerService`](../../interface/application.js#L2525) | 2525 |
| [`renderServerServicesCatalogueHtml`](../../interface/application.js#L2534) | 2534 |
| [`renderDevicesHTML`](../../interface/application.js#L2546) | 2546 |
| [`renderHardwareMetric`](../../interface/application.js#L2554) | 2554 |
| [`renderHardwareChart`](../../interface/application.js#L2559) | 2559 |
| [`renderDeviceInsightChart`](../../interface/application.js#L2569) | 2569 |
| [`renderDeviceQualityCards`](../../interface/application.js#L2588) | 2588 |
| [`renderArchivedSoftware`](../../interface/application.js#L2596) | 2596 |
| [`getManagedDeviceTypeOrLocationNames`](../../interface/application.js#L2635) | 2635 |
| [`getUniqueDeviceTypes`](../../interface/application.js#L2642) | 2642 |
| [`getUniqueDeviceLocations`](../../interface/application.js#L2643) | 2643 |
| [`isProtectedDeviceTypeOrLocation`](../../interface/application.js#L2644) | 2644 |
| [`openDeviceCatalogueManager`](../../interface/application.js#L2647) | 2647 |
| [`openManageTypesModal`](../../interface/application.js#L2663) | 2663 |
| [`openManageLocationsModal`](../../interface/application.js#L2664) | 2664 |
| [`requestDeviceCatalogueEntryDeletion`](../../interface/application.js#L2667) | 2667 |
| [`cancelDeviceCatalogueEntryDeletion`](../../interface/application.js#L2689) | 2689 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](../../interface/application.js#L2696) | 2696 |
| [`applyDeviceCatalogueChange`](../../interface/application.js#L2704) | 2704 |
| [`editDeviceTypePrompt`](../../interface/application.js#L2724) | 2724 |
| [`editDeviceLocationPrompt`](../../interface/application.js#L2725) | 2725 |
| [`openDeviceTypeOrLocationRename`](../../interface/application.js#L2726) | 2726 |
| [`cancelDeviceCatalogueEntryRename`](../../interface/application.js#L2741) | 2741 |
| [`deleteDeviceType`](../../interface/application.js#L2761) | 2761 |
| [`deleteDeviceLocation`](../../interface/application.js#L2762) | 2762 |
| [`findSubnetUsingGatewayAddress`](../../interface/application.js#L2770) | 2770 |
| [`calculateSubnetUtilisationSummary`](../../interface/application.js#L2774) | 2774 |
| [`renderSubnetHierarchyPreview`](../../interface/application.js#L2801) | 2801 |
| [`nodes`](../../interface/application.js#L2811) | 2811 |
| [`renderIpamManage`](../../interface/application.js#L2837) | 2837 |
| [`renderIpamHTML`](../../interface/application.js#L2888) | 2888 |
| [`changeSubnet`](../../interface/application.js#L3049) | 3049 |
| [`planBulkSubnetAddressAssignment`](../../interface/application.js#L3062) | 3062 |
| [`openIpamModal`](../../interface/application.js#L3088) | 3088 |
| [`openBulkIpModal`](../../interface/application.js#L3093) | 3093 |
| [`confirmIpamBulkAssignment`](../../interface/application.js#L3100) | 3100 |
| [`handleBulkIpSubmit`](../../interface/application.js#L3104) | 3104 |
| [`returnToBulkIpAddressEditor`](../../interface/application.js#L3123) | 3123 |
| [`applyBulkIpChanges`](../../interface/application.js#L3139) | 3139 |
| [`subnetCidrFeedback`](../../interface/application.js#L3153) | 3153 |
| [`suggestSubnetGateway`](../../interface/application.js#L3171) | 3171 |
| [`openSubnetModal`](../../interface/application.js#L3199) | 3199 |
| [`updateSubnetTypePreview`](../../interface/application.js#L3203) | 3203 |
| [`openSubnetModalByVlanId`](../../interface/application.js#L3229) | 3229 |
| [`handleSubnetSubmit`](../../interface/application.js#L3249) | 3249 |
| [`showSubnetFormError`](../../interface/application.js#L3456) | 3456 |
| [`formatSubnetValidationMessage`](../../interface/application.js#L3472) | 3472 |
| [`subnetNameConflicts`](../../interface/application.js#L3486) | 3486 |
| [`subnetHasVlan`](../../interface/application.js#L3493) | 3493 |
| [`validateSubnetGatewayField`](../../interface/application.js#L3496) | 3496 |
| [`openMultipleSubnets`](../../interface/application.js#L3504) | 3504 |
| [`visibility`](../../interface/application.js#L3511) | 3511 |
| [`planningVisibility`](../../interface/application.js#L3515) | 3515 |
| [`calculateSubnetCapacity`](../../interface/application.js#L3533) | 3533 |
| [`updateSubnetCapacityGuidance`](../../interface/application.js#L3545) | 3545 |
| [`read`](../../interface/application.js#L3547) | 3547 |
| [`generateSubnetBatchPreview`](../../interface/application.js#L3565) | 3565 |
| [`reject`](../../interface/application.js#L3567) | 3567 |
| [`getSubnetBatchRecords`](../../interface/application.js#L3604) | 3604 |
| [`getSubnetBatchIssues`](../../interface/application.js#L3608) | 3608 |
| [`add`](../../interface/application.js#L3611) | 3611 |
| [`showSubnetBatchIssues`](../../interface/application.js#L3638) | 3638 |
| [`renderSubnetBatchPreview`](../../interface/application.js#L3646) | 3646 |
| [`field`](../../interface/application.js#L3649) | 3649 |
| [`capture`](../../interface/application.js#L3659) | 3659 |
| [`ipBelongsToSubnet`](../../interface/application.js#L3693) | 3693 |
| [`getDevicesAndIpAllocationsInSubnet`](../../interface/application.js#L3697) | 3697 |
| [`findInventoryIntegrityIssues`](../../interface/application.js#L3703) | 3703 |
| [`showDeletionBlockedNotice`](../../interface/application.js#L3724) | 3724 |
| [`confirmInventoryDeletion`](../../interface/application.js#L3728) | 3728 |
| [`showSubnetDeletionBlocked`](../../interface/application.js#L3732) | 3732 |
| [`deleteSubnet`](../../interface/application.js#L3743) | 3743 |
| [`confirmDeleteSubnet`](../../interface/application.js#L3803) | 3803 |
| [`deleteSubnetCommit`](../../interface/application.js#L3831) | 3831 |
| [`deleteVlan`](../../interface/application.js#L3861) | 3861 |
| [`openIpModal`](../../interface/application.js#L3887) | 3887 |
| [`handleIpSubmit`](../../interface/application.js#L3904) | 3904 |
| [`openEquipmentSupplierModal`](../../interface/application.js#L3969) | 3969 |
| [`preserveDeviceFormDuringOptionsDialog`](../../interface/application.js#L3983) | 3983 |
| [`modalFormSnapshot`](../../interface/application.js#L3993) | 3993 |
| [`stockFormHasChanges`](../../interface/application.js#L3998) | 3998 |
| [`rememberModalForm`](../../interface/application.js#L4002) | 4002 |
| [`confirmDiscardDeviceFormChanges`](../../interface/application.js#L4007) | 4007 |
| [`confirmRackPlacementCorrection`](../../interface/application.js#L4037) | 4037 |
| [`resolveRackPlacementCorrection`](../../interface/application.js#L4056) | 4056 |
| [`keepEditingDeviceForm`](../../interface/application.js#L4065) | 4065 |
| [`discardDeviceFormChanges`](../../interface/application.js#L4071) | 4071 |
| [`returnToDeviceFormFromSubnet`](../../interface/application.js#L4077) | 4077 |
| [`closeModal`](../../interface/application.js#L4086) | 4086 |
| [`openModal`](../../interface/application.js#L4137) | 4137 |
| [`readRackDimension`](../../interface/application.js#L4210) | 4210 |
| [`formatRackDimension`](../../interface/application.js#L4217) | 4217 |
| [`rackPhysicalDetails`](../../interface/application.js#L4222) | 4222 |
| [`openRackModal`](../../interface/application.js#L4231) | 4231 |
| [`handleRackSubmit`](../../interface/application.js#L4247) | 4247 |
| [`deleteRack`](../../interface/application.js#L4314) | 4314 |
| [`openRackSlotPlacementDialog`](../../interface/application.js#L4336) | 4336 |
| [`refresh`](../../interface/application.js#L4359) | 4359 |
| [`openAssignDeviceModal`](../../interface/application.js#L4436) | 4436 |
| [`refresh`](../../interface/application.js#L4453) | 4453 |
| [`refreshAssignStartPositions`](../../interface/application.js#L4460) | 4460 |
| [`handleAssignSubmit`](../../interface/application.js#L4494) | 4494 |
| [`unassignDevice`](../../interface/application.js#L4539) | 4539 |
| [`getSubnetForIp`](../../interface/application.js#L4556) | 4556 |
| [`refreshDeviceIpOptions`](../../interface/application.js#L4560) | 4560 |
| [`handleDeviceIpSelection`](../../interface/application.js#L4607) | 4607 |
| [`getDeviceSubnetTopLevelBlock`](../../interface/application.js#L4616) | 4616 |
| [`refreshDeviceSubnetSelectionCascade`](../../interface/application.js#L4625) | 4625 |
| [`inside`](../../interface/application.js#L4632) | 4632 |
| [`handleDeviceSubnetChange`](../../interface/application.js#L4650) | 4650 |
| [`updateDeviceRackLimits`](../../interface/application.js#L4659) | 4659 |
| [`toggleDeviceMountType`](../../interface/application.js#L4703) | 4703 |
| [`getDeviceDetailFieldLabel`](../../interface/application.js#L4727) | 4727 |
| [`buildDeviceDetailRows`](../../interface/application.js#L4732) | 4732 |
| [`openDeviceReviewModal`](../../interface/application.js#L4750) | 4750 |
| [`openDeviceDetailView`](../../interface/application.js#L4755) | 4755 |
| [`safe`](../../interface/application.js#L4765) | 4765 |
| [`field`](../../interface/application.js#L4766) | 4766 |
| [`section`](../../interface/application.js#L4771) | 4771 |
| [`confirmUninstallOfArchivedSoftware`](../../interface/application.js#L4816) | 4816 |
| [`recordUninstallOfArchivedSoftware`](../../interface/application.js#L4822) | 4822 |
| [`selectDeviceDetailsTab`](../../interface/application.js#L4841) | 4841 |
| [`navigateToDeviceRack`](../../interface/application.js#L4859) | 4859 |
| [`duplicateDevice`](../../interface/application.js#L4887) | 4887 |
| [`getConfiguredServerServiceCatalogueEntries`](../../interface/application.js#L4957) | 4957 |
| [`getAvailableServerServiceCatalogueEntries`](../../interface/application.js#L4962) | 4962 |
| [`getAvailableServerServiceFieldKeys`](../../interface/application.js#L4967) | 4967 |
| [`openServerServiceManager`](../../interface/application.js#L4968) | 4968 |
| [`captureServerServiceSelections`](../../interface/application.js#L4973) | 4973 |
| [`updateServerServiceCatalogue`](../../interface/application.js#L4979) | 4979 |
| [`confirmServerServiceArchive`](../../interface/application.js#L5000) | 5000 |
| [`archiveServerService`](../../interface/application.js#L5008) | 5008 |
| [`getHardwareSeedPreferences`](../../interface/application.js#L5034) | 5034 |
| [`getVisibleBuiltInHardwareSuggestions`](../../interface/application.js#L5038) | 5038 |
| [`getConfiguredHardwareCatalogueEntries`](../../interface/application.js#L5056) | 5056 |
| [`getSelectedHardwareCatalogueDeviceType`](../../interface/application.js#L5060) | 5060 |
| [`openHardwareCatalogueManager`](../../interface/application.js#L5063) | 5063 |
| [`updateHardwareCatalogue`](../../interface/application.js#L5070) | 5070 |
| [`isVirtualDeviceForm`](../../interface/application.js#L5098) | 5098 |
| [`updateVirtualHardwareFieldVisibility`](../../interface/application.js#L5102) | 5102 |
| [`refreshHardwareSuggestions`](../../interface/application.js#L5147) | 5147 |
| [`handleHardwareSelectionChange`](../../interface/application.js#L5181) | 5181 |
| [`getConfiguredSoftwareCatalogueEntries`](../../interface/application.js#L5198) | 5198 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](../../interface/application.js#L5201) | 5201 |
| [`openConfiguredSoftwareCatalogueManager`](../../interface/application.js#L5202) | 5202 |
| [`captureInstalledSoftwareSelections`](../../interface/application.js#L5207) | 5207 |
| [`updateConfiguredSoftwareCatalogue`](../../interface/application.js#L5213) | 5213 |
| [`createBuiltInSoftwareCatalogueKey`](../../interface/application.js#L5251) | 5251 |
| [`getAvailableSoftwareCatalogueEntries`](../../interface/application.js#L5252) | 5252 |
| [`isSoftwareHiddenForDeviceType`](../../interface/application.js#L5259) | 5259 |
| [`toggleSoftwareForDeviceType`](../../interface/application.js#L5260) | 5260 |
| [`renderSoftwareDeviceTypeControls`](../../interface/application.js#L5275) | 5275 |
| [`getDeviceSoftwareContext`](../../interface/application.js#L5281) | 5281 |
| [`getDeviceSoftwareSuggestions`](../../interface/application.js#L5304) | 5304 |
| [`isDeviceSoftwareSelected`](../../interface/application.js#L5320) | 5320 |
| [`getDeviceSoftwareCatalogueEntries`](../../interface/application.js#L5323) | 5323 |
| [`refreshDeviceSoftwareSuggestions`](../../interface/application.js#L5332) | 5332 |
| [`preserveLegacyDeviceSoftwareFlags`](../../interface/application.js#L5343) | 5343 |
| [`getSoftwareFieldsForDeviceType`](../../interface/application.js#L5352) | 5352 |
| [`getDetailFieldsForDeviceType`](../../interface/application.js#L5355) | 5355 |
| [`isSoftwareDetailField`](../../interface/application.js#L5362) | 5362 |
| [`isDeviceEditorHypervisorProduct`](../../interface/application.js#L5370) | 5370 |
| [`renderDeviceEditorRetainedSoftware`](../../interface/application.js#L5379) | 5379 |
| [`refreshDeviceEditorHostVersionChoices`](../../interface/application.js#L5385) | 5385 |
| [`showDeviceEditorFeedback`](../../interface/application.js#L5397) | 5397 |
| [`bindDeviceEditorValidation`](../../interface/application.js#L5437) | 5437 |
| [`renderInlineDevicePicker`](../../interface/application.js#L5465) | 5465 |
| [`updateInlinePickerCount`](../../interface/application.js#L5474) | 5474 |
| [`openInlineDeviceQuickAdd`](../../interface/application.js#L5480) | 5480 |
| [`cancelInlineDeviceQuickAdd`](../../interface/application.js#L5493) | 5493 |
| [`saveInlineDeviceQuickAdd`](../../interface/application.js#L5502) | 5502 |
| [`fail`](../../interface/application.js#L5508) | 5508 |
| [`renderInlineHardwareQuickAdd`](../../interface/application.js#L5562) | 5562 |
| [`saveInlineHardwareQuickAdd`](../../interface/application.js#L5578) | 5578 |
| [`fail`](../../interface/application.js#L5583) | 5583 |
| [`serverStorageField`](../../interface/application.js#L5630) | 5630 |
| [`renderServerStorageFields`](../../interface/application.js#L5635) | 5635 |
| [`renderServerStorageFields.action`](../../interface/application.js#L5638) | 5638 |
| [`captureServerStorageValues`](../../interface/application.js#L5650) | 5650 |
| [`refreshServerStorageControls`](../../interface/application.js#L5670) | 5670 |
| [`updateServerStorage`](../../interface/application.js#L5680) | 5680 |
| [`updateServerStorage.vdev`](../../interface/application.js#L5684) | 5684 |
| [`serverStorageDetailRows`](../../interface/application.js#L5692) | 5692 |
| [`renderDeviceDetailFields`](../../interface/application.js#L5702) | 5702 |
| [`getPlatformGroupForDeviceType`](../../interface/application.js#L5732) | 5732 |
| [`getPlatformOptionsForDeviceType`](../../interface/application.js#L5738) | 5738 |
| [`getPlatformVersionOptions`](../../interface/application.js#L6104) | 6104 |
| [`isWindowsPlatform`](../../interface/application.js#L6107) | 6107 |
| [`refreshDeviceEditorDropdowns`](../../interface/application.js#L6111) | 6111 |
| [`getRecordedDevicePlatform`](../../interface/application.js#L6114) | 6114 |
| [`refreshDeviceEditorContext`](../../interface/application.js#L6118) | 6118 |
| [`clearDeviceDraftPlatformVersion`](../../interface/application.js#L6135) | 6135 |
| [`defaultDeviceLocationFromRack`](../../interface/application.js#L6139) | 6139 |
| [`renderSoftwarePlatformFields`](../../interface/application.js#L6159) | 6159 |
| [`bindSoftwarePlatformFields`](../../interface/application.js#L6186) | 6186 |
| [`captureSoftwarePlatformFields`](../../interface/application.js#L6235) | 6235 |
| [`refreshSoftwarePlatformFields`](../../interface/application.js#L6243) | 6243 |
| [`isHypervisorHostingEnabledInDeviceForm`](../../interface/application.js#L6254) | 6254 |
| [`syncHostingFieldVisibility`](../../interface/application.js#L6258) | 6258 |
| [`captureDeviceDetailFieldValues`](../../interface/application.js#L6270) | 6270 |
| [`refreshDeviceDetailFields`](../../interface/application.js#L6282) | 6282 |
| [`isWirelessAccessPointDeviceType`](../../interface/application.js#L6309) | 6309 |
| [`getRecognisedDeviceMountTypes`](../../interface/application.js#L6313) | 6313 |
| [`getSuggestedMountTypes`](../../interface/application.js#L6317) | 6317 |
| [`getDefaultMountType`](../../interface/application.js#L6330) | 6330 |
| [`renderDeviceMountOptions`](../../interface/application.js#L6333) | 6333 |
| [`updateDeviceMountChoices`](../../interface/application.js#L6338) | 6338 |
| [`initialiseNotesEditor`](../../interface/application.js#L6355) | 6355 |
| [`inlineMarkdown`](../../interface/application.js#L6360) | 6360 |
| [`render`](../../interface/application.js#L6373) | 6373 |
| [`initialiseDeviceTabs`](../../interface/application.js#L6407) | 6407 |
| [`activate`](../../interface/application.js#L6801) | 6801 |
| [`openDeviceModal`](../../interface/application.js#L6882) | 6882 |
| [`syncVmPurpose`](../../interface/application.js#L6930) | 6930 |
| [`clearFieldError`](../../interface/application.js#L6991) | 6991 |
| [`captureDeviceFormDraft`](../../interface/application.js#L7010) | 7010 |
| [`createRackFromDevice`](../../interface/application.js#L7047) | 7047 |
| [`cancelRackFromDevice`](../../interface/application.js#L7055) | 7055 |
| [`createSubnetFromDevice`](../../interface/application.js#L7065) | 7065 |
| [`handleDeviceLocationSelectionChange`](../../interface/application.js#L7078) | 7078 |
| [`cancelCustomDeviceLocation`](../../interface/application.js#L7092) | 7092 |
| [`addCustomLocationOption`](../../interface/application.js#L7104) | 7104 |
| [`findObsoleteDeviceFieldsForTypeChange`](../../interface/application.js#L7144) | 7144 |
| [`requestHypervisorGuestReassignment`](../../interface/application.js#L7156) | 7156 |
| [`finish`](../../interface/application.js#L7176) | 7176 |
| [`confirmHypervisorPlatformChangeForGuests`](../../interface/application.js#L7201) | 7201 |
| [`finish`](../../interface/application.js#L7215) | 7215 |
| [`handleDeviceSubmit`](../../interface/application.js#L7235) | 7235 |
| [`existingDeviceHostIsUnchanged`](../../interface/application.js#L7275) | 7275 |
| [`deleteDevice`](../../interface/application.js#L7424) | 7424 |
| [`personalSafeStorageGet`](../../interface/application.js#L7481) | 7481 |
| [`openBackupExplanationDialog`](../../interface/application.js#L7486) | 7486 |
| [`renderPersonalSettingsBody`](../../interface/application.js#L7496) | 7496 |
| [`button`](../../interface/application.js#L7497) | 7497 |
| [`themeChoice`](../../interface/application.js#L7501) | 7501 |
| [`guideLinks`](../../interface/application.js#L7518) | 7518 |
| [`loadSmtpSettings`](../../interface/application.js#L7549) | 7549 |
| [`renderApplicationSettings`](../../interface/application.js#L7564) | 7564 |
| [`syncSmtpForm`](../../interface/application.js#L7568) | 7568 |
| [`updateSmtpFields`](../../interface/application.js#L7590) | 7590 |
| [`hydrateSettings`](../../interface/application.js#L7603) | 7603 |
| [`caffootCompareVersions`](../../interface/application.js#L7625) | 7625 |
| [`parse`](../../interface/application.js#L7626) | 7626 |
| [`caffootShowLicences`](../../interface/application.js#L7648) | 7648 |
| [`caffootUpdateGuide`](../../interface/application.js#L7653) | 7653 |
| [`caffootCheckUpdates`](../../interface/application.js#L7658) | 7658 |
| [`checkInventorySafety`](../../interface/application.js#L7689) | 7689 |
| [`requestInventoryReset`](../../interface/application.js#L7712) | 7712 |
| [`createInventoryBackup`](../../interface/application.js#L7739) | 7739 |
| [`validateBackupVersion`](../../interface/application.js#L7751) | 7751 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](../../interface/application.js#L7766) | 7766 |
| [`exportData`](../../interface/application.js#L7774) | 7774 |
| [`rejectUnsafeBackupKeys`](../../interface/application.js#L7787) | 7787 |
| [`validateBackupStructure`](../../interface/application.js#L7802) | 7802 |
| [`downloadPreRestoreSafetySnapshot`](../../interface/application.js#L7819) | 7819 |
| [`planLegacyComputerMountingCorrections`](../../interface/application.js#L7831) | 7831 |
| [`findInvalidDeviceMounts`](../../interface/application.js#L7870) | 7870 |
| [`findRackImportConflicts`](../../interface/application.js#L7874) | 7874 |
| [`place`](../../interface/application.js#L7880) | 7880 |
| [`validateAndNormaliseBackupForImport`](../../interface/application.js#L7926) | 7926 |
| [`parseBackupJsonWithHelpfulError`](../../interface/application.js#L7947) | 7947 |
| [`showBackupImportError`](../../interface/application.js#L7952) | 7952 |
| [`reviewLegacyDeviceMountingRepairs`](../../interface/application.js#L7956) | 7956 |
| [`finish`](../../interface/application.js#L7966) | 7966 |
| [`onClick`](../../interface/application.js#L7975) | 7975 |
| [`findAccessPointMountConflictsInBackup`](../../interface/application.js#L7985) | 7985 |
| [`chooseAccessPointMountingCorrections`](../../interface/application.js#L7996) | 7996 |
| [`finish`](../../interface/application.js#L8007) | 8007 |
| [`onClick`](../../interface/application.js#L8016) | 8016 |
| [`applyAccessPointMountingCorrectionsToBackup`](../../interface/application.js#L8031) | 8031 |
| [`importData`](../../interface/application.js#L8047) | 8047 |
| [`reader.onload`](../../interface/application.js#L8057) | 8057 |
| [`reader.onerror`](../../interface/application.js#L8131) | 8131 |
| [`validateRackAccessoryPlacement`](../../interface/application.js#L8258) | 8258 |
| [`renderRackVerticalAccessoryRail`](../../interface/application.js#L8274) | 8274 |
| [`openRackAccessoryEditor`](../../interface/application.js#L8285) | 8285 |
| [`refreshAccessoryOptions`](../../interface/application.js#L8319) | 8319 |
| [`requestRackAccessoryDeletion`](../../interface/application.js#L8377) | 8377 |
| [`cancel`](../../interface/application.js#L8390) | 8390 |
| [`moveRackAccessoryToPosition`](../../interface/application.js#L8406) | 8406 |
| [`moveDeviceToRackPosition`](../../interface/application.js#L8423) | 8423 |
| [`updateRackDragPointerLabel`](../../interface/application.js#L8448) | 8448 |
| [`clearRackDragPointerLabel`](../../interface/application.js#L8462) | 8462 |
| [`clearRackDropPreview`](../../interface/application.js#L8465) | 8465 |
| [`renderRackViewPreservingScrollPosition`](../../interface/application.js#L8470) | 8470 |
| [`stopRackDragAutoScroll`](../../interface/application.js#L8482) | 8482 |
| [`tickRackDragAutoScroll`](../../interface/application.js#L8488) | 8488 |
| [`trackRackDrag`](../../interface/application.js#L8497) | 8497 |
| [`getVerticalRackAccessoryDropTarget`](../../interface/application.js#L8528) | 8528 |
| [`clearVerticalRackAccessoryDragPreview`](../../interface/application.js#L8538) | 8538 |
| [`getRackDropPosition`](../../interface/application.js#L8631) | 8631 |
| [`window.onload`](../../interface/application.js#L9091) | 9091 |
| [`inventorySectionAccess`](../../interface/application.js#L9111) | 9111 |
| [`addDirectoryAccess`](../../interface/application.js#L9112) | 9112 |
| [`canAssignEquipmentSupplier`](../../interface/application.js#L9122) | 9122 |
| [`canSubmitSupplierForm`](../../interface/application.js#L9126) | 9126 |
| [`refreshStockAccess`](../../interface/application.js#L9151) | 9151 |
| [`refreshCentralInventory`](../../interface/application.js#L9161) | 9161 |
| [`postInventory`](../../interface/application.js#L9187) | 9187 |
| [`isBlockedAction`](../../interface/application.js#L9239) | 9239 |
| [`applyAllowedControls`](../../interface/application.js#L9272) | 9272 |
| [`enhanceLongSelects`](../../interface/application.js#L9348) | 9348 |
| [`sync`](../../interface/application.js#L9399) | 9399 |
| [`close`](../../interface/application.js#L9405) | 9405 |
| [`choose`](../../interface/application.js#L9409) | 9409 |
| [`draw`](../../interface/application.js#L9414) | 9414 |
| [`open`](../../interface/application.js#L9432) | 9432 |
| [`enhanceSelects`](../../interface/application.js#L9489) | 9489 |
| [`setDepartmentExpanded`](../../interface/application.js#L9534) | 9534 |
| [`isSupplierPage`](../../interface/application.js#L9550) | 9550 |
| [`landingTab`](../../interface/application.js#L9554) | 9554 |
| [`workspaceHashTab`](../../interface/application.js#L9559) | 9559 |
| [`switchTab`](../../interface/application.js#L9581) | 9581 |
| [`viewSupplierEquipment`](../../interface/application.js#L9616) | 9616 |
| [`updateDeviceEditorNotice`](../../interface/application.js#L9634) | 9634 |
| [`openDeviceDetailView`](../../interface/application.js#L9660) | 9660 |
| [`applyDeviceFormSectionPermissions`](../../interface/application.js#L9676) | 9676 |
| [`forbidRackMount`](../../interface/application.js#L9735) | 9735 |
| [`installDeviceSupplier`](../../interface/application.js#L9745) | 9745 |
| [`installDeviceStockControls`](../../interface/application.js#L9759) | 9759 |
| [`loadDeviceStockSources`](../../interface/application.js#L9774) | 9774 |
| [`openDeviceModal`](../../interface/application.js#L9813) | 9813 |
| [`nextDeviceModalClosed`](../../interface/application.js#L9857) | 9857 |
| [`relatedChanges`](../../interface/application.js#L9863) | 9863 |
| [`saveDevice`](../../interface/application.js#L9874) | 9874 |
| [`nextIpamBridge.canEdit`](../../interface/application.js#L9925) | 9925 |
| [`nextIpamBridge.saveBulk`](../../interface/application.js#L9926) | 9926 |
| [`nextIpamBridge.save`](../../interface/application.js#L9948) | 9948 |
| [`nextIpamBridge.deleteSubnet`](../../interface/application.js#L9970) | 9970 |
| [`nextIpamBridge.saveSubnet`](../../interface/application.js#L9992) | 9992 |
| [`hydrateOptionalFeatureSettings`](../../interface/application.js#L10034) | 10034 |
| [`canLinkDeviceToIpam`](../../interface/application.js#L10079) | 10079 |
| [`openDeviceIpamLink`](../../interface/application.js#L10083) | 10083 |
| [`cancelDeviceIpamLink`](../../interface/application.js#L10091) | 10091 |
| [`nextSettingsBridge.save`](../../interface/application.js#L10132) | 10132 |
| [`nextRackBridge.save`](../../interface/application.js#L10132) | 10132 |
| [`nextIntegrityRepairBridge.reload`](../../interface/application.js#L10149) | 10149 |
| [`nextIntegrityRepairBridge.canViewSection`](../../interface/application.js#L10150) | 10150 |
| [`nextIntegrityRepairBridge.preview`](../../interface/application.js#L10151) | 10151 |
| [`nextIntegrityRepairBridge.apply`](../../interface/application.js#L10165) | 10165 |
| [`nextResetBridge.reset`](../../interface/application.js#L10196) | 10196 |
| [`nextDeviceCatalogueBridge.change`](../../interface/application.js#L10223) | 10223 |
| [`nextRackBridge.reviewShelf`](../../interface/application.js#L10250) | 10250 |
| [`nextRackBridge.removeShelf`](../../interface/application.js#L10258) | 10258 |
| [`nextRackBridge.canEdit`](../../interface/application.js#L10267) | 10267 |
| [`nextRackBridge.savePlacement`](../../interface/application.js#L10268) | 10268 |
| [`nextRackBridge.saveAccessory`](../../interface/application.js#L10306) | 10306 |
| [`nextRackBridge.persist`](../../interface/application.js#L10309) | 10309 |
| [`reserveForDelete`](../../interface/application.js#L10331) | 10331 |
| [`removeDevice`](../../interface/application.js#L10339) | 10339 |
| [`cancelDelete`](../../interface/application.js#L10365) | 10365 |
| [`saveArchivedInstallation`](../../interface/application.js#L10371) | 10371 |
| [`nextDeviceBridge.canReadSuppliers`](../../interface/application.js#L10402) | 10402 |
| [`nextDeviceBridge.canAssignSupplier`](../../interface/application.js#L10403) | 10403 |
| [`renderAccountSections`](../../interface/application.js#L10410) | 10410 |
| [`renderAccountMfaPanel`](../../interface/application.js#L10438) | 10438 |
| [`nextRenderAccount`](../../interface/application.js#L10449) | 10449 |
| [`initialiseAccountEmailVerification`](../../interface/application.js#L10459) | 10459 |
| [`closeEmailVerification`](../../interface/application.js#L10483) | 10483 |
| [`updateEmailVerificationStatus`](../../interface/application.js#L10490) | 10490 |
| [`showEmailVerificationFeedback`](../../interface/application.js#L10501) | 10501 |
| [`hydrateAccount`](../../interface/application.js#L10555) | 10555 |
| [`updateAccountHeaderPhoto`](../../interface/application.js#L10593) | 10593 |
| [`loadAccountProfile`](../../interface/application.js#L10606) | 10606 |
| [`removeAccountPhoto`](../../interface/application.js#L10622) | 10622 |
| [`permissionLabel`](../../interface/application.js#L10634) | 10634 |
| [`accountMfaLabel`](../../interface/application.js#L10637) | 10637 |
| [`renderRoleMemberships`](../../interface/application.js#L10640) | 10640 |
| [`renderRoleCatalogue`](../../interface/application.js#L10646) | 10646 |
| [`openRoleLayer`](../../interface/application.js#L10651) | 10651 |
| [`closeRoleLayer`](../../interface/application.js#L10662) | 10662 |
| [`renderRoleDefinition`](../../interface/application.js#L10668) | 10668 |
| [`renderRoleImpact`](../../interface/application.js#L10672) | 10672 |
| [`access`](../../interface/application.js#L10677) | 10677 |
| [`state`](../../interface/application.js#L10681) | 10681 |
| [`requestRoleChange`](../../interface/application.js#L10686) | 10686 |
| [`roleNotificationMessage`](../../interface/application.js#L10693) | 10693 |
| [`previewRoleAction`](../../interface/application.js#L10697) | 10697 |
| [`openRoleEditor`](../../interface/application.js#L10702) | 10702 |
| [`nextRenderUsers`](../../interface/application.js#L10765) | 10765 |
| [`profileFields`](../../interface/application.js#L10767) | 10767 |
| [`stat`](../../interface/application.js#L10788) | 10788 |
| [`bars`](../../interface/application.js#L10791) | 10791 |
| [`operation`](../../interface/application.js#L10847) | 10847 |
| [`filterUserRows`](../../interface/application.js#L10867) | 10867 |
| [`closeUserWorkspace`](../../interface/application.js#L10891) | 10891 |
| [`loadCentralUsers`](../../interface/application.js#L10920) | 10920 |
| [`changeCentralUser`](../../interface/application.js#L10926) | 10926 |
| [`importPanel`](../../interface/application.js#L10937) | 10937 |
| [`cancelImport`](../../interface/application.js#L10941) | 10941 |
| [`nextImportModalClosed`](../../interface/application.js#L10947) | 10947 |
| [`showImportReview`](../../interface/application.js#L10948) | 10948 |
| [`chooseImportFile`](../../interface/application.js#L10988) | 10988 |
| [`actOnImport`](../../interface/application.js#L11005) | 11005 |

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
| [`change_device_catalogue`](../../backend/device_catalogue.py#L15) | 15 |

## backend/device_rack_fields.py

| Function | Line |
| --- | ---: |
| [`prepare_device_rack_fields`](../../backend/device_rack_fields.py#L8) | 8 |

## backend/device_saves.py

| Function | Line |
| --- | ---: |
| [`_check_primary_ip_claim`](../../backend/device_saves.py#L35) | 35 |
| [`_validate_device_identity_change`](../../backend/device_saves.py#L54) | 54 |
| [`_prepare_related_guests`](../../backend/device_saves.py#L74) | 74 |
| [`_persist_related_guests`](../../backend/device_saves.py#L119) | 119 |
| [`save_reserved_device`](../../backend/device_saves.py#L132) | 132 |
| [`create_device_in_transaction`](../../backend/device_saves.py#L281) | 281 |
| [`create_device`](../../backend/device_saves.py#L358) | 358 |
| [`delete_reserved_device`](../../backend/device_saves.py#L373) | 373 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](../../backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](../../backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](../../backend/feature_settings.py#L28) | 28 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_subnet_batch_reason`](../../backend/history_permissions.py#L34) | 34 |
| [`visible_change_history`](../../backend/history_permissions.py#L62) | 62 |

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
| [`project_inventory_response`](../../backend/inventory_projection.py#L9) | 9 |
| [`count_basic_ips_outside_subnets`](../../backend/inventory_projection.py#L42) | 42 |

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
| [`initialise_database`](../../backend/schema.py#L65) | 65 |
| [`migrate_staff_directory`](../../backend/schema.py#L270) | 270 |
| [`migrate_role_permissions`](../../backend/schema.py#L335) | 335 |
| [`verify_role_migration`](../../backend/schema.py#L420) | 420 |
| [`migrate_configurable_builtin_roles`](../../backend/schema.py#L446) | 446 |
| [`migrate_it_staff_stock_default`](../../backend/schema.py#L540) | 540 |
| [`migrate_device_assignments`](../../backend/schema.py#L568) | 568 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](../../backend/server.py#L103) | 103 |
| [`connect`](../../backend/server.py#L121) | 121 |
| [`initialise_database`](../../backend/server.py#L129) | 129 |
| [`Handler.end_headers`](../../backend/server.py#L135) | 135 |
| [`Handler.do_GET`](../../backend/server.py#L142) | 142 |
| [`Handler.do_POST`](../../backend/server.py#L519) | 519 |
| [`Handler.handle_supplier_request`](../../backend/server.py#L706) | 706 |
| [`Handler.handle_stock_request`](../../backend/server.py#L787) | 787 |
| [`Handler.handle_equipment_request`](../../backend/server.py#L876) | 876 |
| [`Handler.handle_directory_request`](../../backend/server.py#L957) | 957 |
| [`Handler.handle_feature_settings`](../../backend/server.py#L1034) | 1034 |
| [`Handler.handle_role_change`](../../backend/server.py#L1077) | 1077 |
| [`Handler.handle_user_mutation`](../../backend/server.py#L1119) | 1119 |
| [`Handler.handle_account_email`](../../backend/server.py#L1517) | 1517 |
| [`Handler.handle_profile_photo`](../../backend/server.py#L1597) | 1597 |
| [`Handler.handle_import`](../../backend/server.py#L1628) | 1628 |
| [`Handler.respond`](../../backend/server.py#L1704) | 1704 |
| [`main`](../../backend/server.py#L1717) | 1717 |

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
| [`dialog`](../../interface/suppliers.js#L573) | 573 |
| [`lines`](../../interface/suppliers.js#L589) | 589 |
| [`valueOf`](../../interface/suppliers.js#L590) | 590 |
| [`selectedIds`](../../interface/suppliers.js#L591) | 591 |
| [`addressFields`](../../interface/suppliers.js#L592) | 592 |
| [`readAddress`](../../interface/suppliers.js#L598) | 598 |
| [`checkList`](../../interface/suppliers.js#L601) | 601 |
| [`formSection`](../../interface/suppliers.js#L606) | 606 |
| [`contactEntry`](../../interface/suppliers.js#L610) | 610 |
| [`supplierForm`](../../interface/suppliers.js#L620) | 620 |
| [`locationForm`](../../interface/suppliers.js#L653) | 653 |
| [`contactForm`](../../interface/suppliers.js#L665) | 665 |
| [`contactDetails`](../../interface/suppliers.js#L697) | 697 |
| [`noteForm`](../../interface/suppliers.js#L714) | 714 |
| [`issueCategoryOptions`](../../interface/suppliers.js#L724) | 724 |
| [`issueUpdates`](../../interface/suppliers.js#L728) | 728 |
| [`issueDialog`](../../interface/suppliers.js#L736) | 736 |
| [`openIssue`](../../interface/suppliers.js#L783) | 783 |
| [`refreshAfterIssueSave`](../../interface/suppliers.js#L792) | 792 |
| [`correctIssueUpdate`](../../interface/suppliers.js#L796) | 796 |
| [`addInlineIssueCategory`](../../interface/suppliers.js#L814) | 814 |
| [`toggleInlineCategory`](../../interface/suppliers.js#L836) | 836 |
| [`applyIssueCategories`](../../interface/suppliers.js#L843) | 843 |
| [`categoriesDialog`](../../interface/suppliers.js#L850) | 850 |
| [`categoryForm`](../../interface/suppliers.js#L862) | 862 |
| [`command`](../../interface/suppliers.js#L871) | 871 |
| [`updateSupplier`](../../interface/suppliers.js#L880) | 880 |
| [`updateCategories`](../../interface/suppliers.js#L891) | 891 |
| [`statusConfirmation`](../../interface/suppliers.js#L902) | 902 |
| [`supplyConfirmation`](../../interface/suppliers.js#L932) | 932 |
| [`refreshRows`](../../interface/suppliers.js#L948) | 948 |
| [`caffootSuppliers.configure`](../../interface/suppliers.js#L1115) | 1115 |
| [`caffootSuppliers.enter`](../../interface/suppliers.js#L1118) | 1118 |
| [`caffootSuppliers.leave`](../../interface/suppliers.js#L1122) | 1122 |
| [`caffootSuppliers.closed`](../../interface/suppliers.js#L1129) | 1129 |

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
