# Caffoot Lite — Function Index

This retained definition map links to the owner-approved application source `0251b43a3b5d41d626aa022c6d7f9b4d860433da`. Existing entries have their declaration links corrected where a named definition can be located. A dash means the historical binding has no independently located declaration in that file: open the module and follow its current bindings. This is a selective reference, not an exhaustive inventory of later additions. Start with the [code reference](07-Function-and-Code-Reference.md) for current module responsibilities; the [earlier map](https://github.com/Caffoot/Caffoot-Lite/blob/bf5a016039b9812c0825644b47c6b619bbad653e/docs/development-guide/Function-Index.md) preserves the previous entries and recorded line values.

Recorded scope: named JavaScript declarations/assignments in the indexed application scripts, the identified IPAM/Settings/integrity/reset/catalogue/Rack bridge methods with their owning binding names, the Python functions/methods included in the original map, and `build_private_acceptance` with its nested helper in the selected maintenance script. Tests, anonymous callbacks, third-party code, generated HTML and other maintenance scripts (including the release verifier) are excluded. This is a definition map, not a repository-wide call graph, reference-count report or removal authority.

The account hydration/photo functions now have purpose-based callable bindings matching their function names: `hydrateAccount` and `removeAccountPhoto`. The immutable design manifest retains its historical integration-entry names; those metadata names are not the runtime's current function map. Pinned source paths, revisions and hashes are unchanged.

**Recorded definitions: 1474.** Checked against the source in this commit. This remains a definition map, not a call graph. See [coding conventions](06-Coding-and-Naming-Conventions.md) and the [code reference](07-Function-and-Code-Reference.md).

## interface/loader.js

| Function | Line |
| --- | ---: |
| [`returnToExistingSignIn`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L8) | 8 |
| [`window.fetch`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L14) | 14 |
| [`renderInterfaceTemplate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L39) | 39 |
| [`loadInterfaceText`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L47) | 47 |
| [`initialiseInterface`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L53) | 53 |
| [`staffScript.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L100) | 100 |
| [`staffScript.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L101) | 101 |
| [`script.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L104) | 104 |
| [`script.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L105) | 105 |
| [`stockScript.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L108) | 108 |
| [`stockScript.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L109) | 109 |
| [`supplierScript.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L112) | 112 |
| [`supplierScript.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L113) | 113 |
| [`lifecycleScript.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L116) | 116 |
| [`lifecycleScript.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L117) | 117 |
| [`ukDatesScript.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L120) | 120 |
| [`ukDatesScript.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L121) | 121 |
| [`serviceDeskScript.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L124) | 124 |
| [`serviceDeskScript.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L125) | 125 |
| [`emailTemplatesScript.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L128) | 128 |
| [`emailTemplatesScript.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L129) | 129 |
| [`loadApplication`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L140) | 140 |
| [`applicationScript.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L143) | 143 |
| [`showInterfaceLoadError`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/loader.js#L152) | 152 |

## interface/application.js

| Function | Line |
| --- | ---: |
| [`publicDeviceTypeName`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L17) | 17 |
| [`cloneDefaultData`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L29) | 29 |
| [`isPlainObject`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L33) | 33 |
| [`isValidIpv4`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L37) | 37 |
| [`parseIpv4AddressToNumber`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L47) | 47 |
| [`formatIpv4Address`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L51) | 51 |
| [`parseSupportedIpv4Subnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L54) | 54 |
| [`isUsableHostAddressInSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L63) | 63 |
| [`isValidCidr24`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L67) | 67 |
| [`hierarchyIpNumber`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L71) | 71 |
| [`hierarchyIpString`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L76) | 76 |
| [`hierarchyParseCidr`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L77) | 77 |
| [`hierarchyValidate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L85) | 85 |
| [`ancestor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L125) | 125 |
| [`independentNetworkInsideBlock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L135) | 135 |
| [`hierarchyValidateTypes`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L150) | 150 |
| [`previewLegacyVlanOwnershipInApp`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L181) | 181 |
| [`reconcileLegacyVlanOwnership`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L195) | 195 |
| [`migrateLegacyRackLocation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L233) | 233 |
| [`normaliseLegacyRackAccessoryTypes`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L247) | 247 |
| [`normaliseState`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L254) | 254 |
| [`validateApplicationState`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L423) | 423 |
| [`loadStoredState`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L490) | 490 |
| [`showStorageRecoveryBanner`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L496) | 496 |
| [`download.onclick`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L511) | 511 |
| [`reset.onclick`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L520) | 520 |
| [`caffootThemePreference`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L561) | 561 |
| [`caffootApplyTheme`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L568) | 568 |
| [`caffootSetTheme`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L582) | 582 |
| [`onSystemThemeChange`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L593) | 593 |
| [`toggleDarkMode`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L602) | 602 |
| [`readAuditHistory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L609) | 609 |
| [`auditChanges`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L613) | 613 |
| [`recordAudit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L650) | 650 |
| [`restoreAuditAfterRolledBackOperation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L659) | 659 |
| [`exportAuditHistory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L671) | 671 |
| [`auditVisibleRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L741) | 741 |
| [`auditDate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L765) | 765 |
| [`renderAuditHTML`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L792) | 792 |
| [`hydrateAudit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L818) | 818 |
| [`applyAuditFilters`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L827) | 827 |
| [`closeAuditDetail`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L866) | 866 |
| [`showAuditDetail`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L926) | 926 |
| [`nextRenderUsers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L978) | 978 |
| [`nextRenderAccount`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L980) | 980 |
| [`hydrateAccount`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L981) | 981 |
| [`removeAccountPhoto`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L982) | 982 |
| [`saveState`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L985) | 985 |
| [`getDeviceById`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L988) | 988 |
| [`findDeviceUsingIp`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L992) | 992 |
| [`setDevicePrimaryIp`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L997) | 997 |
| [`syncDeviceIpamRecord`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1056) | 1056 |
| [`isRackMountedDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1069) | 1069 |
| [`getDeviceShelfAssociationError`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1072) | 1072 |
| [`getRackShelfLocation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1084) | 1084 |
| [`initialiseDeviceShelfFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1090) | 1090 |
| [`refreshDeviceShelfFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1106) | 1106 |
| [`openRackShelfCreation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1124) | 1124 |
| [`returnFromRackShelfCreation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1138) | 1138 |
| [`createRackShelfFromDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1148) | 1148 |
| [`openRackShelfRemovalReview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1155) | 1155 |
| [`options`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1161) | 1161 |
| [`validateRackPlacement`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1182) | 1182 |
| [`showNotification`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1218) | 1218 |
| [`showToast`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1232) | 1232 |
| [`toggleSidebar`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1316) | 1316 |
| [`switchTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1335) | 1335 |
| [`escapeHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1370) | 1370 |
| [`inlineJsArg`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1379) | 1379 |
| [`browserStorageWarning`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1387) | 1387 |
| [`acknowledgeBrowserStorageNotice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1390) | 1390 |
| [`renderSectionTabIcon`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1396) | 1396 |
| [`renderSectionHeader`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1402) | 1402 |
| [`tab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1403) | 1403 |
| [`revealSectionTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1430) | 1430 |
| [`revealActiveSectionTabs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1437) | 1437 |
| [`renderContent`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1457) | 1457 |
| [`updateScrollHint`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1526) | 1526 |
| [`planDeviceIpAllocationIntegrityRepairs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1537) | 1537 |
| [`previewInventoryIntegrityRepairs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1572) | 1572 |
| [`applyPreviewedInventoryIntegrityRepairs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1576) | 1576 |
| [`renderIntegrityRepairPreviewHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1580) | 1580 |
| [`buildInventoryReportData`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1586) | 1586 |
| [`occupancy`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1602) | 1602 |
| [`escapeCsvCellAndNeutraliseSpreadsheetFormula`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1625) | 1625 |
| [`downloadInventoryReportCsv`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1631) | 1631 |
| [`renderInventoryReportsHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1657) | 1657 |
| [`renderDashboardHTML`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1686) | 1686 |
| [`statusPill`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1792) | 1792 |
| [`insightSegment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1809) | 1809 |
| [`filterDashboardReadAccess`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1855) | 1855 |
| [`getCategoryIcon`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1872) | 1872 |
| [`getDefaultDeviceFasciaGraphic`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1887) | 1887 |
| [`openDeviceTypeRackFasciaSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1896) | 1896 |
| [`saveDeviceTypeRackFasciaSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1901) | 1901 |
| [`getOccupiedRackUnits`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1916) | 1916 |
| [`findAvailableRackUnitRanges`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1931) | 1931 |
| [`printRackElevation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1941) | 1941 |
| [`safe`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L688) | 688 |
| [`printRackElevationInFrame`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1975) | 1975 |
| [`frame.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1985) | 1985 |
| [`renderRackHubV13`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2006) | 2006 |
| [`card`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2011) | 2011 |
| [`mark`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2020) | 2020 |
| [`bar`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2036) | 2036 |
| [`chartBox`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2037) | 2037 |
| [`chartRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2038) | 2038 |
| [`rackSpaceGuide`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2040) | 2040 |
| [`renderRacksHTML`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2109) | 2109 |
| [`changeRack`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2176) | 2176 |
| [`getEffectiveDevicePlatform`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2195) | 2195 |
| [`getEffectiveDevicePlatformVersion`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2202) | 2202 |
| [`getVisibleDevices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2208) | 2208 |
| [`filterHardwareModels`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2233) | 2233 |
| [`openCatalogueModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2272) | 2272 |
| [`openHardwareManufacturerManager`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2281) | 2281 |
| [`saveHardwareManufacturer`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2305) | 2305 |
| [`openBuiltInManufacturerEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2343) | 2343 |
| [`saveBuiltInManufacturerOverride`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2355) | 2355 |
| [`renderCatalogueButton`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2372) | 2372 |
| [`renderCatalogueRecord`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2376) | 2376 |
| [`renderDeviceCategoryCatalogue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2381) | 2381 |
| [`renderHardwareManufacturersHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2400) | 2400 |
| [`add`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2402) | 2402 |
| [`getNonVirtualDeviceTypesAssociatedWithManufacturer`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2447) | 2447 |
| [`refreshModelDeviceTypeChoices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2454) | 2454 |
| [`openHardwareModelManager`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2466) | 2466 |
| [`opts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2471) | 2471 |
| [`saveHardwareModel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2489) | 2489 |
| [`openBuiltInHardwareModelEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2518) | 2518 |
| [`saveBuiltInHardwareModelOverride`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2532) | 2532 |
| [`renderHardwareModelsHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2554) | 2554 |
| [`add`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2402) | 2402 |
| [`options`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1161) | 1161 |
| [`openSoftwareCatalogueEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2606) | 2606 |
| [`saveCustomSoftwareEntry`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2621) | 2621 |
| [`confirmSoftwareCatalogueRemoval`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2636) | 2636 |
| [`archiveSoftwareCatalogueEntry`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2644) | 2644 |
| [`restoreArchivedSoftwareEntry`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2655) | 2655 |
| [`renderSoftwareCatalogueHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2664) | 2664 |
| [`enableSuggestedSoftware`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2686) | 2686 |
| [`filterSoftwareCatalogue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2697) | 2697 |
| [`openServerServiceEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2714) | 2714 |
| [`saveServerServiceEntry`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2723) | 2723 |
| [`restoreArchivedServerService`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2736) | 2736 |
| [`renderServerServicesCatalogueHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2745) | 2745 |
| [`renderDevicesHTML`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2757) | 2757 |
| [`renderHardwareMetric`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2765) | 2765 |
| [`renderHardwareChart`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2770) | 2770 |
| [`renderDeviceInsightChart`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2780) | 2780 |
| [`renderDeviceQualityCards`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2799) | 2799 |
| [`renderArchivedSoftware`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2807) | 2807 |
| [`getManagedDeviceTypeOrLocationNames`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2846) | 2846 |
| [`getUniqueDeviceTypes`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2853) | 2853 |
| [`getUniqueDeviceLocations`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2854) | 2854 |
| [`isProtectedDeviceTypeOrLocation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2855) | 2855 |
| [`openDeviceCatalogueManager`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2858) | 2858 |
| [`openManageTypesModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2878) | 2878 |
| [`openManageLocationsModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2879) | 2879 |
| [`requestDeviceCatalogueEntryDeletion`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2882) | 2882 |
| [`cancelDeviceCatalogueEntryDeletion`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2904) | 2904 |
| [`applyConfirmedDeviceCatalogueEntryDeletion`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2911) | 2911 |
| [`applyDeviceCatalogueChange`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2919) | 2919 |
| [`editDeviceTypePrompt`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2939) | 2939 |
| [`editDeviceLocationPrompt`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2940) | 2940 |
| [`openDeviceTypeOrLocationRename`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2941) | 2941 |
| [`cancelDeviceCatalogueEntryRename`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2956) | 2956 |
| [`deleteDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2976) | 2976 |
| [`deleteDeviceLocation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2977) | 2977 |
| [`findSubnetUsingGatewayAddress`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2985) | 2985 |
| [`calculateSubnetUtilisationSummary`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2989) | 2989 |
| [`renderSubnetHierarchyPreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3016) | 3016 |
| [`nodes`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3026) | 3026 |
| [`renderIpamManage`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3052) | 3052 |
| [`renderIpamHTML`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3103) | 3103 |
| [`changeSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3264) | 3264 |
| [`planBulkSubnetAddressAssignment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3277) | 3277 |
| [`openIpamModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3303) | 3303 |
| [`openBulkIpModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3308) | 3308 |
| [`confirmIpamBulkAssignment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3315) | 3315 |
| [`handleBulkIpSubmit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3319) | 3319 |
| [`returnToBulkIpAddressEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3338) | 3338 |
| [`applyBulkIpChanges`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3354) | 3354 |
| [`subnetCidrFeedback`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3368) | 3368 |
| [`suggestSubnetGateway`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3386) | 3386 |
| [`openSubnetModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3414) | 3414 |
| [`updateSubnetTypePreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3418) | 3418 |
| [`openSubnetModalByVlanId`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3444) | 3444 |
| [`handleSubnetSubmit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3464) | 3464 |
| [`showSubnetFormError`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3671) | 3671 |
| [`formatSubnetValidationMessage`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3687) | 3687 |
| [`subnetNameConflicts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3701) | 3701 |
| [`subnetHasVlan`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3708) | 3708 |
| [`validateSubnetGatewayField`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3711) | 3711 |
| [`openMultipleSubnets`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3719) | 3719 |
| [`option`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3721) | 3721 |
| [`visibility`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3726) | 3726 |
| [`planningVisibility`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3730) | 3730 |
| [`calculateSubnetCapacity`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3748) | 3748 |
| [`updateSubnetCapacityGuidance`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3760) | 3760 |
| [`read`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3762) | 3762 |
| [`generateSubnetBatchPreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3780) | 3780 |
| [`reject`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3782) | 3782 |
| [`getSubnetBatchRecords`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3819) | 3819 |
| [`getSubnetBatchIssues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3823) | 3823 |
| [`add`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L2402) | 2402 |
| [`showSubnetBatchIssues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3853) | 3853 |
| [`renderSubnetBatchPreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3861) | 3861 |
| [`field`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3864) | 3864 |
| [`capture`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3874) | 3874 |
| [`ipBelongsToSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3908) | 3908 |
| [`getDevicesAndIpAllocationsInSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3912) | 3912 |
| [`findInventoryIntegrityIssues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3918) | 3918 |
| [`showDeletionBlockedNotice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3939) | 3939 |
| [`confirmInventoryDeletion`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3943) | 3943 |
| [`showSubnetDeletionBlocked`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3947) | 3947 |
| [`deleteSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3958) | 3958 |
| [`confirmDeleteSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4018) | 4018 |
| [`deleteSubnetCommit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4046) | 4046 |
| [`deleteVlan`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4076) | 4076 |
| [`openIpModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4102) | 4102 |
| [`handleIpSubmit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4119) | 4119 |
| [`openEquipmentSupplierModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4184) | 4184 |
| [`preserveDeviceFormDuringOptionsDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4198) | 4198 |
| [`modalFormSnapshot`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4208) | 4208 |
| [`stockFormHasChanges`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4227) | 4227 |
| [`rememberModalForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4231) | 4231 |
| [`confirmDiscardDeviceFormChanges`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4236) | 4236 |
| [`confirmRackPlacementCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4266) | 4266 |
| [`resolveRackPlacementCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4285) | 4285 |
| [`keepEditingDeviceForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4294) | 4294 |
| [`discardDeviceFormChanges`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4300) | 4300 |
| [`returnToDeviceFormFromSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4306) | 4306 |
| [`closeModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4308) | 4308 |
| [`openModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4377) | 4377 |
| [`readRackDimension`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4455) | 4455 |
| [`formatRackDimension`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4462) | 4462 |
| [`rackPhysicalDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4467) | 4467 |
| [`openRackModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4476) | 4476 |
| [`handleRackSubmit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4492) | 4492 |
| [`deleteRack`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4559) | 4559 |
| [`openRackSlotPlacementDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4581) | 4581 |
| [`refresh`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4604) | 4604 |
| [`openAssignDeviceModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4681) | 4681 |
| [`refresh`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4604) | 4604 |
| [`refreshAssignStartPositions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4705) | 4705 |
| [`handleAssignSubmit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4739) | 4739 |
| [`unassignDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4784) | 4784 |
| [`getSubnetForIp`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4801) | 4801 |
| [`refreshDeviceIpOptions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4805) | 4805 |
| [`handleDeviceIpSelection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4852) | 4852 |
| [`getDeviceSubnetTopLevelBlock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4861) | 4861 |
| [`refreshDeviceSubnetSelectionCascade`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4870) | 4870 |
| [`inside`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4877) | 4877 |
| [`handleDeviceSubnetChange`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4895) | 4895 |
| [`updateDeviceRackLimits`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4904) | 4904 |
| [`toggleDeviceMountType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4948) | 4948 |
| [`getDeviceDetailFieldLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4972) | 4972 |
| [`buildDeviceDetailRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4977) | 4977 |
| [`openDeviceReviewModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L4995) | 4995 |
| [`openDeviceDetailView`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5000) | 5000 |
| [`safe`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L688) | 688 |
| [`field`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L3864) | 3864 |
| [`section`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5016) | 5016 |
| [`confirmUninstallOfArchivedSoftware`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5068) | 5068 |
| [`recordUninstallOfArchivedSoftware`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5074) | 5074 |
| [`selectDeviceDetailsTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5093) | 5093 |
| [`navigateToDeviceRack`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5112) | 5112 |
| [`duplicateDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5140) | 5140 |
| [`getConfiguredServerServiceCatalogueEntries`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5210) | 5210 |
| [`getAvailableServerServiceCatalogueEntries`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5215) | 5215 |
| [`getAvailableServerServiceFieldKeys`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5220) | 5220 |
| [`openServerServiceManager`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5221) | 5221 |
| [`captureServerServiceSelections`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5226) | 5226 |
| [`updateServerServiceCatalogue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5232) | 5232 |
| [`confirmServerServiceArchive`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5253) | 5253 |
| [`archiveServerService`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5261) | 5261 |
| [`getHardwareSeedPreferences`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5287) | 5287 |
| [`getVisibleBuiltInHardwareSuggestions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5291) | 5291 |
| [`getConfiguredHardwareCatalogueEntries`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5309) | 5309 |
| [`getSelectedHardwareCatalogueDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5313) | 5313 |
| [`openHardwareCatalogueManager`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5316) | 5316 |
| [`updateHardwareCatalogue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5323) | 5323 |
| [`isVirtualDeviceForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5351) | 5351 |
| [`updateVirtualHardwareFieldVisibility`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5355) | 5355 |
| [`refreshHardwareSuggestions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5400) | 5400 |
| [`handleHardwareSelectionChange`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5434) | 5434 |
| [`getConfiguredSoftwareCatalogueEntries`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5451) | 5451 |
| [`getConfiguredSoftwareCatalogueFieldKeys`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5454) | 5454 |
| [`openConfiguredSoftwareCatalogueManager`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5455) | 5455 |
| [`captureInstalledSoftwareSelections`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5460) | 5460 |
| [`updateConfiguredSoftwareCatalogue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5466) | 5466 |
| [`createBuiltInSoftwareCatalogueKey`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5504) | 5504 |
| [`getAvailableSoftwareCatalogueEntries`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5505) | 5505 |
| [`isSoftwareHiddenForDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5512) | 5512 |
| [`toggleSoftwareForDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5513) | 5513 |
| [`renderSoftwareDeviceTypeControls`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5528) | 5528 |
| [`getDeviceSoftwareContext`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5534) | 5534 |
| [`getDeviceSoftwareSuggestions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5557) | 5557 |
| [`isDeviceSoftwareSelected`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5573) | 5573 |
| [`getDeviceSoftwareCatalogueEntries`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5576) | 5576 |
| [`refreshDeviceSoftwareSuggestions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5585) | 5585 |
| [`preserveLegacyDeviceSoftwareFlags`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5596) | 5596 |
| [`getSoftwareFieldsForDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5605) | 5605 |
| [`getDetailFieldsForDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5608) | 5608 |
| [`isSoftwareDetailField`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5615) | 5615 |
| [`isDeviceEditorHypervisorProduct`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5623) | 5623 |
| [`renderDeviceEditorRetainedSoftware`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5632) | 5632 |
| [`refreshDeviceEditorHostVersionChoices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5638) | 5638 |
| [`showDeviceEditorFeedback`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5650) | 5650 |
| [`bindDeviceEditorValidation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5690) | 5690 |
| [`renderInlineDevicePicker`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5718) | 5718 |
| [`updateInlinePickerCount`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5727) | 5727 |
| [`openInlineDeviceQuickAdd`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5733) | 5733 |
| [`cancelInlineDeviceQuickAdd`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5746) | 5746 |
| [`saveInlineDeviceQuickAdd`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5755) | 5755 |
| [`fail`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5761) | 5761 |
| [`renderInlineHardwareQuickAdd`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5815) | 5815 |
| [`saveInlineHardwareQuickAdd`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5831) | 5831 |
| [`fail`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5761) | 5761 |
| [`serverStorageField`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5883) | 5883 |
| [`renderServerStorageFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5888) | 5888 |
| [`renderServerStorageFields.action`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js) | — |
| [`captureServerStorageValues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5903) | 5903 |
| [`refreshServerStorageControls`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5923) | 5923 |
| [`updateServerStorage`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5933) | 5933 |
| [`updateServerStorage.vdev`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js) | — |
| [`serverStorageDetailRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5945) | 5945 |
| [`renderDeviceDetailFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5955) | 5955 |
| [`getPlatformGroupForDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5985) | 5985 |
| [`getPlatformOptionsForDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5991) | 5991 |
| [`getPlatformVersionOptions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6357) | 6357 |
| [`isWindowsPlatform`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6360) | 6360 |
| [`refreshDeviceEditorDropdowns`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6364) | 6364 |
| [`getRecordedDevicePlatform`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6367) | 6367 |
| [`refreshDeviceEditorContext`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6371) | 6371 |
| [`clearDeviceDraftPlatformVersion`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6388) | 6388 |
| [`defaultDeviceLocationFromRack`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6392) | 6392 |
| [`renderSoftwarePlatformFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6412) | 6412 |
| [`bindSoftwarePlatformFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6439) | 6439 |
| [`captureSoftwarePlatformFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6488) | 6488 |
| [`refreshSoftwarePlatformFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6496) | 6496 |
| [`isHypervisorHostingEnabledInDeviceForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6507) | 6507 |
| [`syncHostingFieldVisibility`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6511) | 6511 |
| [`captureDeviceDetailFieldValues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6523) | 6523 |
| [`refreshDeviceDetailFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6535) | 6535 |
| [`isWirelessAccessPointDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6562) | 6562 |
| [`getRecognisedDeviceMountTypes`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6566) | 6566 |
| [`getSuggestedMountTypes`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6570) | 6570 |
| [`getDefaultMountType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6583) | 6583 |
| [`renderDeviceMountOptions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6586) | 6586 |
| [`updateDeviceMountChoices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6591) | 6591 |
| [`initialiseNotesEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6608) | 6608 |
| [`inlineMarkdown`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6613) | 6613 |
| [`render`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6626) | 6626 |
| [`initialiseDeviceTabs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L6660) | 6660 |
| [`activate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7054) | 7054 |
| [`openDeviceModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7135) | 7135 |
| [`selectableType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7143) | 7143 |
| [`syncVmPurpose`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7185) | 7185 |
| [`clearFieldError`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7249) | 7249 |
| [`captureDeviceFormDraft`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7270) | 7270 |
| [`createRackFromDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7308) | 7308 |
| [`cancelRackFromDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7316) | 7316 |
| [`createSubnetFromDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7326) | 7326 |
| [`handleDeviceLocationSelectionChange`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7339) | 7339 |
| [`cancelCustomDeviceLocation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7353) | 7353 |
| [`addCustomLocationOption`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7365) | 7365 |
| [`findObsoleteDeviceFieldsForTypeChange`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7405) | 7405 |
| [`requestHypervisorGuestReassignment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7417) | 7417 |
| [`finish`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7437) | 7437 |
| [`confirmHypervisorPlatformChangeForGuests`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7462) | 7462 |
| [`finish`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7437) | 7437 |
| [`handleDeviceSubmit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7496) | 7496 |
| [`existingDeviceHostIsUnchanged`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7536) | 7536 |
| [`deleteDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7685) | 7685 |
| [`personalSafeStorageGet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7742) | 7742 |
| [`openBackupExplanationDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7747) | 7747 |
| [`renderPersonalSettingsBody`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7757) | 7757 |
| [`button`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7758) | 7758 |
| [`themeChoice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7762) | 7762 |
| [`guideLinks`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7779) | 7779 |
| [`loadSmtpSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7810) | 7810 |
| [`renderApplicationSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7825) | 7825 |
| [`syncSmtpForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7829) | 7829 |
| [`updateSmtpFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7851) | 7851 |
| [`hydrateSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7864) | 7864 |
| [`caffootCompareVersions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7888) | 7888 |
| [`parse`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7889) | 7889 |
| [`caffootShowLicences`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7911) | 7911 |
| [`caffootUpdateGuide`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7916) | 7916 |
| [`caffootCheckUpdates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7921) | 7921 |
| [`checkInventorySafety`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7952) | 7952 |
| [`requestInventoryReset`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7975) | 7975 |
| [`createInventoryBackup`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8005) | 8005 |
| [`validateBackupVersion`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8017) | 8017 |
| [`normaliseImportedBackupAndPlanLegacyMountRepairs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8032) | 8032 |
| [`exportData`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8040) | 8040 |
| [`rejectUnsafeBackupKeys`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8053) | 8053 |
| [`validateBackupStructure`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8068) | 8068 |
| [`downloadPreRestoreSafetySnapshot`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8085) | 8085 |
| [`planLegacyComputerMountingCorrections`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8097) | 8097 |
| [`findInvalidDeviceMounts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8136) | 8136 |
| [`findRackImportConflicts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8140) | 8140 |
| [`place`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8146) | 8146 |
| [`validateAndNormaliseBackupForImport`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8192) | 8192 |
| [`parseBackupJsonWithHelpfulError`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8213) | 8213 |
| [`showBackupImportError`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8218) | 8218 |
| [`reviewLegacyDeviceMountingRepairs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8222) | 8222 |
| [`finish`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7437) | 7437 |
| [`onClick`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8241) | 8241 |
| [`findAccessPointMountConflictsInBackup`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8251) | 8251 |
| [`chooseAccessPointMountingCorrections`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8262) | 8262 |
| [`finish`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7437) | 7437 |
| [`onClick`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8241) | 8241 |
| [`applyAccessPointMountingCorrectionsToBackup`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8297) | 8297 |
| [`importData`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8313) | 8313 |
| [`reader.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8323) | 8323 |
| [`reader.onerror`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8397) | 8397 |
| [`validateRackAccessoryPlacement`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8524) | 8524 |
| [`renderRackVerticalAccessoryRail`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8540) | 8540 |
| [`openRackAccessoryEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8551) | 8551 |
| [`refreshAccessoryOptions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8586) | 8586 |
| [`requestRackAccessoryDeletion`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8644) | 8644 |
| [`cancel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8657) | 8657 |
| [`moveRackAccessoryToPosition`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8673) | 8673 |
| [`moveDeviceToRackPosition`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8690) | 8690 |
| [`updateRackDragPointerLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8715) | 8715 |
| [`clearRackDragPointerLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8729) | 8729 |
| [`clearRackDropPreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8732) | 8732 |
| [`renderRackViewPreservingScrollPosition`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8737) | 8737 |
| [`stopRackDragAutoScroll`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8749) | 8749 |
| [`tickRackDragAutoScroll`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8755) | 8755 |
| [`trackRackDrag`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8764) | 8764 |
| [`getVerticalRackAccessoryDropTarget`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8795) | 8795 |
| [`clearVerticalRackAccessoryDragPreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8805) | 8805 |
| [`getRackDropPosition`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L8898) | 8898 |
| [`window.onload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9368) | 9368 |
| [`inventorySectionAccess`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9393) | 9393 |
| [`addDirectoryAccess`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9394) | 9394 |
| [`canAssignEquipmentSupplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9406) | 9406 |
| [`canSubmitServiceDeskForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9410) | 9410 |
| [`canSubmitSupplierForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9417) | 9417 |
| [`refreshStockAccess`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9442) | 9442 |
| [`refreshCentralInventory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9460) | 9460 |
| [`postInventory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9495) | 9495 |
| [`isBlockedAction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9551) | 9551 |
| [`applyAllowedControls`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9605) | 9605 |
| [`enhanceLongSelects`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9673) | 9673 |
| [`sync`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9725) | 9725 |
| [`close`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9731) | 9731 |
| [`choose`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9735) | 9735 |
| [`draw`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9740) | 9740 |
| [`open`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9758) | 9758 |
| [`enhanceSelects`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9815) | 9815 |
| [`setDepartmentExpanded`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9860) | 9860 |
| [`isSupplierPage`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9876) | 9876 |
| [`landingTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9880) | 9880 |
| [`workspaceHashTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9900) | 9900 |
| [`switchTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L1335) | 1335 |
| [`navigate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9967) | 9967 |
| [`viewSupplierEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9974) | 9974 |
| [`updateDeviceEditorNotice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9992) | 9992 |
| [`openDeviceDetailView`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L5000) | 5000 |
| [`applyDeviceFormSectionPermissions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10034) | 10034 |
| [`forbidRackMount`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10093) | 10093 |
| [`installDeviceSupplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10103) | 10103 |
| [`installDeviceStockControls`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10117) | 10117 |
| [`loadDeviceStockSources`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10132) | 10132 |
| [`select.onchange`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10145) | 10145 |
| [`openDeviceModal`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L7135) | 7135 |
| [`nextDeviceModalClosed`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10215) | 10215 |
| [`relatedChanges`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10221) | 10221 |
| [`saveDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10232) | 10232 |
| [`nextIpamBridge.canEdit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10293) | 10293 |
| [`nextIpamBridge.saveBulk`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10294) | 10294 |
| [`nextIpamBridge.save`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10316) | 10316 |
| [`nextIpamBridge.deleteSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10338) | 10338 |
| [`nextIpamBridge.saveSubnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10360) | 10360 |
| [`hydrateOptionalFeatureSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10403) | 10403 |
| [`canLinkDeviceToIpam`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10448) | 10448 |
| [`openDeviceIpamLink`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10452) | 10452 |
| [`cancelDeviceIpamLink`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10460) | 10460 |
| [`nextSettingsBridge.save`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10501) | 10501 |
| [`nextIntegrityRepairBridge.reload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10518) | 10518 |
| [`nextIntegrityRepairBridge.canViewSection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10519) | 10519 |
| [`nextIntegrityRepairBridge.preview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10520) | 10520 |
| [`nextIntegrityRepairBridge.apply`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10534) | 10534 |
| [`nextResetBridge.reset`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10565) | 10565 |
| [`nextDeviceCatalogueBridge.change`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10592) | 10592 |
| [`nextRackBridge.reviewShelf`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10624) | 10624 |
| [`nextRackBridge.removeShelf`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10632) | 10632 |
| [`nextRackBridge.canEdit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10641) | 10641 |
| [`nextRackBridge.savePlacement`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10642) | 10642 |
| [`nextRackBridge.save`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10677) | 10677 |
| [`nextRackBridge.saveAccessory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10680) | 10680 |
| [`nextRackBridge.persist`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10683) | 10683 |
| [`reserveForDelete`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10705) | 10705 |
| [`removeDevice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10713) | 10713 |
| [`cancelDelete`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10739) | 10739 |
| [`saveArchivedInstallation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10745) | 10745 |
| [`nextDeviceBridge.canReadSuppliers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10776) | 10776 |
| [`nextDeviceBridge.canAssignSupplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10777) | 10777 |
| [`renderAccountSections`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10784) | 10784 |
| [`renderAccountMfaPanel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10812) | 10812 |
| [`nextRenderAccount`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L980) | 980 |
| [`initialiseAccountEmailVerification`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10833) | 10833 |
| [`closeEmailVerification`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10858) | 10858 |
| [`updateEmailVerificationStatus`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10865) | 10865 |
| [`showEmailVerificationFeedback`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10878) | 10878 |
| [`hydrateAccount`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L981) | 981 |
| [`updateAccountHeaderPhoto`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10971) | 10971 |
| [`loadAccountProfile`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L10984) | 10984 |
| [`removeAccountPhoto`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L982) | 982 |
| [`permissionLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11012) | 11012 |
| [`accountMfaLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11015) | 11015 |
| [`renderRoleMemberships`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11018) | 11018 |
| [`renderRoleCatalogue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11024) | 11024 |
| [`openRoleLayer`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11029) | 11029 |
| [`closeRoleLayer`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11040) | 11040 |
| [`renderRoleDefinition`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11046) | 11046 |
| [`renderRoleImpact`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11050) | 11050 |
| [`access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11055) | 11055 |
| [`state`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11059) | 11059 |
| [`requestRoleChange`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11064) | 11064 |
| [`roleNotificationMessage`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11071) | 11071 |
| [`previewRoleAction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11075) | 11075 |
| [`openRoleEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11080) | 11080 |
| [`nextRenderUsers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L978) | 978 |
| [`stat`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11160) | 11160 |
| [`bars`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11163) | 11163 |
| [`renderUserWorkspace`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11187) | 11187 |
| [`operation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11194) | 11194 |
| [`updateUserWorkspace`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11293) | 11293 |
| [`openUserWorkspace`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11311) | 11311 |
| [`closeUserWorkspace`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11327) | 11327 |
| [`openStaffAdministration`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11341) | 11341 |
| [`loadCentralUsers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11360) | 11360 |
| [`changeCentralUser`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11367) | 11367 |
| [`importPanel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11380) | 11380 |
| [`cancelImport`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11384) | 11384 |
| [`nextImportModalClosed`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11390) | 11390 |
| [`showImportReview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11391) | 11391 |
| [`chooseImportFile`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11431) | 11431 |
| [`actOnImport`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11452) | 11452 |
| [`selectAccountTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11271) | 11271 |
| [`canSubmitLifecycleSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11638) | 11638 |
| [`openLifecycleSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11644) | 11644 |
| [`close`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L9731) | 9731 |
| [`leaveLifecycleSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/application.js#L11669) | 11669 |

## interface/sign-in.js

| Function | Line |
| --- | ---: |
| [`$`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L2) | 2 |
| [`applySignInTheme`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L5) | 5 |
| [`showMfaQr`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L31) | 31 |
| [`showSession`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L40) | 40 |
| [`request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L55) | 55 |
| [`display`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L61) | 61 |
| [`showRecoveryFeedback`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L214) | 214 |
| [`resetRecoveryFlow`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L219) | 219 |
| [`clearRequiredMfaDisplay`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/sign-in.js#L303) | 303 |

## interface/staff-directory.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L10) | 10 |
| [`displayDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L11) | 11 |
| [`displayName`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L12) | 12 |
| [`departmentName`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L13) | 13 |
| [`isAdministrator`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L14) | 14 |
| [`canReadStaff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L15) | 15 |
| [`canEditStaff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L16) | 16 |
| [`canReadDepartments`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L17) | 17 |
| [`canEditDepartments`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L18) | 18 |
| [`icon`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L19) | 19 |
| [`button`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L20) | 20 |
| [`badge`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L21) | 21 |
| [`header`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L22) | 22 |
| [`renderStaffDirectory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L25) | 25 |
| [`detailRow`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L31) | 31 |
| [`renderStaffDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L32) | 32 |
| [`renderStaffLogin`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L36) | 36 |
| [`field`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L46) | 46 |
| [`sharedStaffField`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L47) | 47 |
| [`renderStaffForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L60) | 60 |
| [`cardHeading`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L68) | 68 |
| [`renderDepartments`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L94) | 94 |
| [`departmentCard`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L99) | 99 |
| [`departmentNotice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L102) | 102 |
| [`departmentDate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L105) | 105 |
| [`departmentTable`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L109) | 109 |
| [`departmentAssignmentRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L112) | 112 |
| [`renderDepartmentOverview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L116) | 116 |
| [`renderDepartmentStaff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L127) | 127 |
| [`renderDepartmentEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L132) | 132 |
| [`renderDepartmentHistory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L141) | 141 |
| [`renderDepartmentDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L150) | 150 |
| [`selectDepartmentTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L157) | 157 |
| [`loadDepartmentDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L163) | 163 |
| [`request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L189) | 189 |
| [`readAll`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L200) | 200 |
| [`refresh`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L210) | 210 |
| [`render`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L228) | 228 |
| [`enter`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L250) | 250 |
| [`openStaffWorkspace`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L259) | 259 |
| [`redraw`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L268) | 268 |
| [`showStaffConflict`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L269) | 269 |
| [`refreshStaffRecord`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L277) | 277 |
| [`saveStaff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L293) | 293 |
| [`openDepartmentDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L328) | 328 |
| [`closeDepartmentDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L339) | 339 |
| [`saveDepartment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L340) | 340 |
| [`configure`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L347) | 347 |
| [`showForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L375) | 375 |
| [`getStaffMember`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L475) | 475 |
| [`employmentControl`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L476) | 476 |
| [`equipmentChanged`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/staff-directory.js#L480) | 480 |

## interface/equipment.js

| Function | Line |
| --- | ---: |
| [`escapeHtml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L5) | 5 |
| [`displayDeviceType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L6) | 6 |
| [`dateLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L7) | 7 |
| [`button`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L8) | 8 |
| [`canReadAssociations`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L9) | 9 |
| [`request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L10) | 10 |
| [`assignmentHistory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L84) | 84 |
| [`assetMovementHistory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L89) | 89 |
| [`staffPlaceholder`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L94) | 94 |
| [`loadStaffEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L98) | 98 |
| [`loadDeviceEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L107) | 107 |
| [`loadAssociatedEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L119) | 119 |
| [`openAssociatedEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L135) | 135 |
| [`renderMyEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L144) | 144 |
| [`loadMyEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L172) | 172 |
| [`list`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js) | — |
| [`hydrate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L244) | 244 |
| [`showAssignmentDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L248) | 248 |
| [`searchRecipients`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L263) | 263 |
| [`searchDevices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L277) | 277 |
| [`leaveAssignmentDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L285) | 285 |
| [`saveAssignment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js#L291) | 291 |
| [`caffootEquipment.configure`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/equipment.js) | — |

## interface/stock-intake.js

| Function | Line |
| --- | ---: |
| [`safe`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L10) | 10 |
| [`displayStockType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L12) | 12 |
| [`canRead`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L13) | 13 |
| [`canEdit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L14) | 14 |
| [`stockTodayIso`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L16) | 16 |
| [`stockLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L22) | 22 |
| [`stockNotice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L23) | 23 |
| [`stockButton`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L24) | 24 |
| [`stockCard`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L25) | 25 |
| [`stockField`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L26) | 26 |
| [`stockSelect`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L29) | 29 |
| [`stockTable`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L32) | 32 |
| [`stockMetrics`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L35) | 35 |
| [`stockSpecText`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L38) | 38 |
| [`renderStockReceipt`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L43) | 43 |
| [`renderStockDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L78) | 78 |
| [`renderStockInventory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L101) | 101 |
| [`stockReportNumber`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L105) | 105 |
| [`stockReportMetric`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L106) | 106 |
| [`stockReportTable`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L111) | 111 |
| [`stockReportBar`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L114) | 114 |
| [`renderStockOverview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L118) | 118 |
| [`stockInventoryMatches`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L152) | 152 |
| [`stockRegisteredMatches`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L163) | 163 |
| [`renderStockAssignments`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L173) | 173 |
| [`stockMovementMatches`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L178) | 178 |
| [`drillStockReport`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L189) | 189 |
| [`stockDateText`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L200) | 200 |
| [`stockDate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L204) | 204 |
| [`stockRecordedDate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L206) | 206 |
| [`stockCheckLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L213) | 213 |
| [`receiptSupplierCell`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L214) | 214 |
| [`renderStockHistory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L222) | 222 |
| [`clearStock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L231) | 231 |
| [`stockRequest`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L236) | 236 |
| [`refreshStock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L245) | 245 |
| [`enterStock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L257) | 257 |
| [`renderStock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L262) | 262 |
| [`receiptTracking`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L273) | 273 |
| [`hydrateStock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L276) | 276 |
| [`openStockDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L320) | 320 |
| [`submitStock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L328) | 328 |
| [`stockStateLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L490) | 490 |
| [`stockUnitState`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L491) | 491 |
| [`stockNote`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L492) | 492 |
| [`stockWorkflowForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L493) | 493 |
| [`stockIssueReady`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L501) | 501 |
| [`renderDeviceReissue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L502) | 502 |
| [`stockExistingIssueLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L515) | 515 |
| [`renderStockIssue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L522) | 522 |
| [`editStockIssue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L536) | 536 |
| [`showStockIssueConfirmation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L542) | 542 |
| [`stockReturnSources`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L564) | 564 |
| [`renderStockReturn`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L571) | 571 |
| [`renderStockWriteOff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L582) | 582 |
| [`stockPreparationRequirement`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L595) | 595 |
| [`renderStockPreparation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L602) | 602 |
| [`renderRegisteredStock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L614) | 614 |
| [`renderStockMovements`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L621) | 621 |
| [`renderStockCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L626) | 626 |
| [`renderCorrectionImpact`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L635) | 635 |
| [`stockReturnCorrectionEntry`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L640) | 640 |
| [`restoreStockReturn`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L643) | 643 |
| [`closeStockCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L655) | 655 |
| [`leaveStockCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L406) | 406 |
| [`proceed`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L663) | 663 |
| [`openStockCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L670) | 670 |
| [`stockCorrectionValues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L680) | 680 |
| [`previewStockCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L683) | 683 |
| [`scheduleStockCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L703) | 703 |
| [`submitStockCorrection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L713) | 713 |
| [`stockSelectedReturn`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L756) | 756 |
| [`stockSelectedWriteOff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L757) | 757 |
| [`hydrateStockCirculation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L761) | 761 |
| [`loadHandoverRecipients`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L865) | 865 |
| [`loadStockRecipients`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L892) | 892 |
| [`submitStockCirculation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L903) | 903 |
| [`openStockWorkflow`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L974) | 974 |
| [`openDirectHandover`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L981) | 981 |
| [`prepareReceipt`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L989) | 989 |
| [`hydrateStockPage`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L996) | 996 |
| [`dismissHandover`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L1024) | 1024 |
| [`configureStock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/stock-intake.js#L1025) | 1025 |

## interface/service-desk.js

| Function | Line |
| --- | ---: |
| [`requestServiceDesk`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L19) | 19 |
| [`requestTickets`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L38) | 38 |
| [`ticketNumber`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L153) | 153 |
| [`ticketOptions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L157) | 157 |
| [`ticketDate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L164) | 164 |
| [`ticketTag`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L168) | 168 |
| [`renderTicketQueue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L172) | 172 |
| [`renderEmployeeTicketQueue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L178) | 178 |
| [`renderTicketRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L182) | 182 |
| [`renderSupportWeek`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L197) | 197 |
| [`readSupportWeek`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L212) | 212 |
| [`renderSupportLists`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L228) | 228 |
| [`bindSupportTabs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L248) | 248 |
| [`selectSupportTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L250) | 250 |
| [`hydrateServiceDeskSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L272) | 272 |
| [`showSupportFeedback`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L285) | 285 |
| [`updateSupportHours`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L291) | 291 |
| [`saveSupportSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L297) | 297 |
| [`renderReportActivity`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L408) | 408 |
| [`hydrateTicketReporting`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L427) | 427 |
| [`requestReport`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L439) | 439 |
| [`selectReportPeriod`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L471) | 471 |
| [`hydrateTicketQueue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L511) | 511 |
| [`refreshQueue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L592) | 592 |
| [`changeTicketFilters`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L678) | 678 |
| [`resetTicketFilters`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L686) | 686 |
| [`selectEmployeeScope`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L735) | 735 |
| [`renderTicketEquipmentPanel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L794) | 794 |
| [`hydrateTicketEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L802) | 802 |
| [`refreshEquipmentTickets`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L809) | 809 |
| [`openTicketWindow`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L838) | 838 |
| [`showTicketError`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L845) | 845 |
| [`ticketDialogActive`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L851) | 851 |
| [`openCreateTicket`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L855) | 855 |
| [`updateTicketSoftware`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L934) | 934 |
| [`openTicketDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L960) | 960 |
| [`refreshTicketDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L968) | 968 |
| [`ticketFact`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L989) | 989 |
| [`renderTicketOverview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L993) | 993 |
| [`edit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L994) | 994 |
| [`renderEmployeeTicketOverview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1012) | 1012 |
| [`ticketFileInput`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1036) | 1036 |
| [`renderTicketUpdates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1041) | 1041 |
| [`ticketHistoryText`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1087) | 1087 |
| [`renderTicketHistory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1110) | 1110 |
| [`ticketActions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1120) | 1120 |
| [`showTicketTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1127) | 1127 |
| [`ticketActionForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1212) | 1212 |
| [`ticketSelect`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1219) | 1219 |
| [`openTicketAction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1224) | 1224 |
| [`checkAssignment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1280) | 1280 |
| [`editTicketClassification`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1287) | 1287 |
| [`ticketAttachmentPayload`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1309) | 1309 |
| [`saveTicketForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1329) | 1329 |
| [`closeTicketDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js#L1440) | 1440 |
| [`configure`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js) | — |
| [`canRead`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js) | — |
| [`canUseEmployee`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/service-desk.js) | — |

## backend/access_point_review.py

| Function | Line |
| --- | ---: |
| [`find_access_point_mount_conflicts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/access_point_review.py#L19) | 19 |
| [`apply_access_point_mount_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/access_point_review.py#L45) | 45 |

## backend/account_email.py

| Function | Line |
| --- | ---: |
| [`queue_email`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L62) | 62 |
| [`queue_email.deliver`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py) | — |
| [`email_proof_secret`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L80) | 80 |
| [`_digest`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L117) | 117 |
| [`email_attempts_remaining`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L126) | 126 |
| [`issue_email_proof`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L135) | 135 |
| [`confirm_email_proof`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L166) | 166 |
| [`security_recipients`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L233) | 233 |
| [`notify_security_change`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L248) | 248 |
| [`role_change_notifications`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L272) | 272 |
| [`record_blocked_sign_in`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_email.py#L302) | 302 |

## backend/account_security.py

| Function | Line |
| --- | ---: |
| [`change_own_password`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_security.py#L13) | 13 |
| [`begin_mfa_enrolment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_security.py#L35) | 35 |
| [`complete_mfa_enrolment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_security.py#L59) | 59 |
| [`_pending_mandatory_mfa_account`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_security.py#L80) | 80 |
| [`start_required_mfa_enrolment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_security.py#L93) | 93 |
| [`_record_mfa_change`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_security.py#L112) | 112 |
| [`confirm_required_mfa_enrolment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_security.py#L129) | 129 |
| [`remove_own_mfa`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/account_security.py#L145) | 145 |

## backend/accounts.py

| Function | Line |
| --- | ---: |
| [`hash_password`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/accounts.py#L16) | 16 |
| [`verify_password`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/accounts.py#L24) | 24 |
| [`bootstrap_first_admin`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/accounts.py#L43) | 43 |
| [`confirm_admin_mfa`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/accounts.py#L68) | 68 |

## backend/application_integrity.py

| Function | Line |
| --- | ---: |
| [`validate_detached_application_state`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/application_integrity.py#L15) | 15 |
| [`validate_live_application_state`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/application_integrity.py#L118) | 118 |

## backend/assignment_closure.py

| Function | Line |
| --- | ---: |
| [`assignment_schema_objects`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/assignment_closure.py#L57) | 57 |
| [`expected_assignment_schema`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/assignment_closure.py#L63) | 63 |
| [`validate_assignment_closure`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/assignment_closure.py#L84) | 84 |
| [`migrate_assignment_closure`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/assignment_closure.py#L101) | 101 |

## backend/audit_events.py

| Function | Line |
| --- | ---: |
| [`_safe_audit_value`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/audit_events.py#L34) | 34 |
| [`safe_device_differences`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/audit_events.py#L46) | 46 |
| [`safe_inventory_differences`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/audit_events.py#L75) | 75 |
| [`attribute_event`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/audit_events.py#L99) | 99 |
| [`record_actor_event`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/audit_events.py#L137) | 137 |

## backend/authentication.py

| Function | Line |
| --- | ---: |
| [`verify_active_password`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/authentication.py#L22) | 22 |
| [`authenticate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/authentication.py#L36) | 36 |

## backend/collection_saves.py

| Function | Line |
| --- | ---: |
| [`change_inventory_record`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/collection_saves.py#L20) | 20 |
| [`change_ipam_subnet_and_vlan_records`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/collection_saves.py#L115) | 115 |
| [`delete_subnet_with_dependencies`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/collection_saves.py#L260) | 260 |
| [`remove_linked_rack_shelf`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/collection_saves.py#L386) | 386 |

## backend/deployment_settings.py

| Function | Line |
| --- | ---: |
| [`validate_published_port`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/deployment_settings.py#L5) | 5 |

## backend/device_addresses.py

| Function | Line |
| --- | ---: |
| [`is_basic_address`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_addresses.py#L6) | 6 |
| [`prepare_device_address`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_addresses.py#L10) | 10 |
| [`basic_address_errors`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_addresses.py#L37) | 37 |

## backend/device_assignments.py

| Function | Line |
| --- | ---: |
| [`require_assignment_access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_assignments.py#L13) | 13 |
| [`assignment_recipients`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_assignments.py#L18) | 18 |
| [`device_assignment_dependency`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_assignments.py#L35) | 35 |
| [`assignment_device_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_assignments.py#L53) | 53 |
| [`read_assignments`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_assignments.py#L76) | 76 |
| [`assign_devices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_assignments.py#L184) | 184 |
| [`my_equipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_assignments.py#L243) | 243 |

## backend/device_catalogue.py

| Function | Line |
| --- | ---: |
| [`change_device_catalogue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_catalogue.py#L16) | 16 |

## backend/device_rack_fields.py

| Function | Line |
| --- | ---: |
| [`prepare_device_rack_fields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_rack_fields.py#L8) | 8 |

## backend/device_saves.py

| Function | Line |
| --- | ---: |
| [`_check_primary_ip_claim`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_saves.py#L38) | 38 |
| [`_validate_device_identity_change`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_saves.py#L57) | 57 |
| [`_prepare_related_guests`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_saves.py#L77) | 77 |
| [`_persist_related_guests`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_saves.py#L123) | 123 |
| [`save_reserved_device`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_saves.py#L136) | 136 |
| [`create_device_in_transaction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_saves.py#L290) | 290 |
| [`create_device`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_saves.py#L368) | 368 |
| [`delete_reserved_device`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_saves.py#L383) | 383 |

## backend/feature_settings.py

| Function | Line |
| --- | ---: |
| [`unique_feature_fields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/feature_settings.py#L10) | 10 |
| [`read_feature_settings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/feature_settings.py#L20) | 20 |
| [`save_feature_setting`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/feature_settings.py#L28) | 28 |

## backend/history_permissions.py

| Function | Line |
| --- | ---: |
| [`visible_subnet_batch_reason`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/history_permissions.py#L38) | 38 |
| [`visible_change_history`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/history_permissions.py#L66) | 66 |

## backend/http_security.py

| Function | Line |
| --- | ---: |
| [`session_cookie`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/http_security.py#L13) | 13 |
| [`clear_session_cookie`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/http_security.py#L28) | 28 |
| [`read_session_cookie`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/http_security.py#L41) | 41 |
| [`new_csrf_token`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/http_security.py#L62) | 62 |
| [`check_csrf`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/http_security.py#L66) | 66 |
| [`require_same_origin`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/http_security.py#L77) | 77 |

## backend/import_commit.py

| Function | Line |
| --- | ---: |
| [`prepare_restore_confirmation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_commit.py#L15) | 15 |
| [`restore_reviewed_export_offline`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_commit.py#L21) | 21 |

## backend/import_diagnostics.py

| Function | Line |
| --- | ---: |
| [`inspect_detached_candidate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_diagnostics.py#L13) | 13 |

## backend/import_drafts.py

| Function | Line |
| --- | ---: |
| [`ImportDrafts.__init__`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_drafts.py#L18) | 18 |
| [`ImportDrafts._identity`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_drafts.py#L24) | 24 |
| [`ImportDrafts._get`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_drafts.py#L30) | 30 |
| [`ImportDrafts.begin`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_drafts.py#L41) | 41 |
| [`ImportDrafts.choose_access_point_mounts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_drafts.py#L65) | 65 |
| [`ImportDrafts.confirm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_drafts.py#L86) | 86 |
| [`ImportDrafts.cancel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_drafts.py#L115) | 115 |
| [`ImportDrafts.cancel_authenticated`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_drafts.py#L120) | 120 |

## backend/import_review.py

| Function | Line |
| --- | ---: |
| [`prepare_detached_import_review`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_review.py#L17) | 17 |
| [`inspect_published_export_mounting`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_review.py#L47) | 47 |
| [`prepare_published_export_review`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_review.py#L57) | 57 |
| [`confirm_detached_import_review`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_review.py#L81) | 81 |

## backend/import_service.py

| Function | Line |
| --- | ---: |
| [`replace_from_published_export`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_service.py#L14) | 14 |
| [`replace_from_published_export.require_current_permission`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_service.py#L38) | 38 |
| [`preview_published_export`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/import_service.py#L49) | 49 |

## backend/inventory.py

| Function | Line |
| --- | ---: |
| [`_json`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L34) | 34 |
| [`_check_keys`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L38) | 38 |
| [`_unique_object`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L49) | 49 |
| [`_reject_nonfinite`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L58) | 58 |
| [`validate_published_structure`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L62) | 62 |
| [`inspect_export`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L86) | 86 |
| [`inspect_device_mounts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L137) | 137 |
| [`inspect_import_relationships`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L151) | 151 |
| [`preview_inventory_counts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L195) | 195 |
| [`preview_inventory_counts.counts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L201) | 201 |
| [`retain_ticket_devices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py) | — |
| [`_write_detached`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L283) | 283 |
| [`stage_inventory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L343) | 343 |
| [`reconstruct_inventory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory.py#L359) | 359 |

## backend/inventory_projection.py

| Function | Line |
| --- | ---: |
| [`project_inventory_response`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory_projection.py#L10) | 10 |
| [`count_basic_ips_outside_subnets`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/inventory_projection.py#L47) | 47 |

## backend/ipam_linking.py

| Function | Line |
| --- | ---: |
| [`unique_link_fields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_linking.py#L16) | 16 |
| [`link_device_to_ipam`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_linking.py#L26) | 26 |

## backend/ipam_reconciliation.py

| Function | Line |
| --- | ---: |
| [`reconcile_published_ipam`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_reconciliation.py#L9) | 9 |

## backend/ipam_repair.py

| Function | Line |
| --- | ---: |
| [`plan_ipam_repairs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_repair.py#L15) | 15 |
| [`apply_ipam_repairs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_repair.py#L46) | 46 |

## backend/ipam_saves.py

| Function | Line |
| --- | ---: |
| [`change_independent_allocation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_saves.py#L11) | 11 |
| [`change_bulk_allocations`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_saves.py#L68) | 68 |

## backend/ipam_validation.py

| Function | Line |
| --- | ---: |
| [`_ip_number`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_validation.py#L10) | 10 |
| [`ip_belongs_to_subnet`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_validation.py#L24) | 24 |
| [`inspect_ipam_integrity`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ipam_validation.py#L41) | 41 |

## backend/legacy_mounting.py

| Function | Line |
| --- | ---: |
| [`plan_legacy_computer_mounting_corrections`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/legacy_mounting.py#L12) | 12 |

## backend/login_throttle.py

| Function | Line |
| --- | ---: |
| [`LoginThrottle.__init__`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/login_throttle.py#L15) | 15 |
| [`LoginThrottle._prune`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/login_throttle.py#L19) | 19 |
| [`LoginThrottle.allowed`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/login_throttle.py#L28) | 28 |
| [`LoginThrottle.failed`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/login_throttle.py#L36) | 36 |
| [`LoginThrottle.succeeded`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/login_throttle.py#L47) | 47 |
| [`LoginThrottle._key`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/login_throttle.py#L53) | 53 |

## backend/mfa.py

| Function | Line |
| --- | ---: |
| [`new_secret`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/mfa.py#L18) | 18 |
| [`_secret_bytes`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/mfa.py#L23) | 23 |
| [`provisioning_uri`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/mfa.py#L36) | 36 |
| [`code_at`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/mfa.py#L50) | 50 |
| [`verify_code`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/mfa.py#L63) | 63 |

## backend/normalisation.py

| Function | Line |
| --- | ---: |
| [`_unique`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation.py#L14) | 14 |
| [`normalise_published_fields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation.py#L22) | 22 |

## backend/normalisation_addresses.py

| Function | Line |
| --- | ---: |
| [`validate_normalisation_addresses`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_addresses.py#L9) | 9 |

## backend/normalisation_pipeline.py

| Function | Line |
| --- | ---: |
| [`_valid_supported_cidr`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_pipeline.py#L36) | 36 |
| [`validate_normalisation_subnets`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_pipeline.py#L50) | 50 |
| [`normalise_detached_v133_state`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_pipeline.py#L77) | 77 |

## backend/normalisation_validation.py

| Function | Line |
| --- | ---: |
| [`_number`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_validation.py#L12) | 12 |
| [`_integer`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_validation.py#L23) | 23 |
| [`_valid_ipv4`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_validation.py#L27) | 27 |
| [`validate_normalisation_vlans`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_validation.py#L37) | 37 |
| [`validate_normalisation_devices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/normalisation_validation.py#L59) | 59 |

## backend/permissions.py

| Function | Line |
| --- | ---: |
| [`_admin`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L14) | 14 |
| [`_target`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L23) | 23 |
| [`create_user`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L32) | 32 |
| [`create_user_in_transaction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L48) | 48 |
| [`set_permission`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L80) | 80 |
| [`can_access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L91) | 91 |
| [`feature_enabled`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L96) | 96 |
| [`set_account_active`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L110) | 110 |
| [`delete_user`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L153) | 153 |
| [`set_administrator`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L187) | 187 |
| [`can_replace_inventory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/permissions.py#L268) | 268 |

## backend/profiles.py

| Function | Line |
| --- | ---: |
| [`_authorise`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L24) | 24 |
| [`read_personal_details`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L43) | 43 |
| [`_profile_revision`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L61) | 61 |
| [`read_profile`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L77) | 77 |
| [`validate_profile_details`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L86) | 86 |
| [`write_personal_details`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L101) | 101 |
| [`reconcile_saved_staff_profiles`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L128) | 128 |
| [`save_profile`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L153) | 153 |
| [`_check_dimensions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L196) | 196 |
| [`_jpeg_dimensions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L200) | 200 |
| [`_image_dimensions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L232) | 232 |
| [`save_profile_photo`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L260) | 260 |
| [`read_profile_photo`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L289) | 289 |
| [`remove_profile_photo`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/profiles.py#L298) | 298 |

## backend/rack_validation.py

| Function | Line |
| --- | ---: |
| [`_number`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/rack_validation.py#L17) | 17 |
| [`_integer`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/rack_validation.py#L35) | 35 |
| [`_label`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/rack_validation.py#L40) | 40 |
| [`find_rack_import_conflicts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/rack_validation.py#L44) | 44 |
| [`find_rack_import_conflicts.place`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/rack_validation.py#L51) | 51 |

## backend/recover_admin.py

| Function | Line |
| --- | ---: |
| [`recover_sole_administrator`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/recover_admin.py#L17) | 17 |
| [`main`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/recover_admin.py#L47) | 47 |

## backend/request_auth.py

| Function | Line |
| --- | ---: |
| [`login`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/request_auth.py#L19) | 19 |
| [`csrf_for_session`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/request_auth.py#L36) | 36 |
| [`authenticated_account`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/request_auth.py#L51) | 51 |
| [`authorised_mutation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/request_auth.py#L58) | 58 |
| [`logout`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/request_auth.py#L69) | 69 |
| [`authorised_inventory_import`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/request_auth.py#L81) | 81 |

## backend/reset_inventory.py

| Function | Line |
| --- | ---: |
| [`_restore_operational_defaults`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/reset_inventory.py#L38) | 38 |
| [`_clear_operational_records`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/reset_inventory.py#L54) | 54 |
| [`reset_inventory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/reset_inventory.py#L93) | 93 |

## backend/role_policy.py

| Function | Line |
| --- | ---: |
| [`AccountRolePolicy.allows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/role_policy.py#L21) | 21 |
| [`evaluate_role_policy`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/role_policy.py#L33) | 33 |
| [`assign_staff_member`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/role_policy.py#L75) | 75 |

## backend/roles.py

| Function | Line |
| --- | ---: |
| [`_json`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L23) | 23 |
| [`_validate_action`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L27) | 27 |
| [`_require_actor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L67) | 67 |
| [`role_catalogue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L73) | 73 |
| [`account_access_details`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L84) | 84 |
| [`_action_targets`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L115) | 115 |
| [`_apply_values`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L137) | 137 |
| [`_security_snapshot`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L169) | 169 |
| [`_preview_impact`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L200) | 200 |
| [`_confirmation_signature`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L238) | 238 |
| [`_issue_preview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L245) | 245 |
| [`preview_role_change`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L253) | 253 |
| [`confirm_role_change`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L265) | 265 |
| [`_audit_role_value`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/roles.py#L323) | 323 |

## backend/schema.py

| Function | Line |
| --- | ---: |
| [`initialise_database`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/schema.py#L77) | 77 |
| [`migrate_staff_directory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/schema.py#L345) | 345 |
| [`migrate_role_permissions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/schema.py#L410) | 410 |
| [`verify_role_migration`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/schema.py#L495) | 495 |
| [`migrate_configurable_builtin_roles`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/schema.py#L521) | 521 |
| [`migrate_it_staff_stock_default`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/schema.py#L615) | 615 |
| [`migrate_device_assignments`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/schema.py#L643) | 643 |

## backend/server.py

| Function | Line |
| --- | ---: |
| [`validate_public_origin`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L133) | 133 |
| [`connect`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L151) | 151 |
| [`initialise_database`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L159) | 159 |
| [`profile_email_notice_recipients`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L165) | 165 |
| [`Handler.end_headers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L170) | 170 |
| [`Handler.do_GET`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L177) | 177 |
| [`Handler.do_POST`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L576) | 576 |
| [`Handler.handle_supplier_request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L795) | 795 |
| [`Handler.handle_stock_request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L876) | 876 |
| [`Handler.handle_service_desk_request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L965) | 965 |
| [`Handler.handle_equipment_request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1136) | 1136 |
| [`Handler.handle_directory_request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1220) | 1220 |
| [`Handler.handle_feature_settings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1303) | 1303 |
| [`Handler.handle_email_templates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1352) | 1352 |
| [`Handler.handle_role_change`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1408) | 1408 |
| [`Handler.handle_user_mutation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1450) | 1450 |
| [`Handler.handle_account_email`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1859) | 1859 |
| [`Handler.handle_profile_photo`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1943) | 1943 |
| [`Handler.handle_import`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L1974) | 1974 |
| [`Handler.respond`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L2053) | 2053 |
| [`main`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/server.py#L2066) | 2066 |

## backend/sessions.py

| Function | Line |
| --- | ---: |
| [`_digest`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/sessions.py#L30) | 30 |
| [`login_session`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/sessions.py#L56) | 56 |
| [`session_account`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/sessions.py#L160) | 160 |
| [`logout_session`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/sessions.py#L181) | 181 |
| [`revoke_account_sessions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/sessions.py#L190) | 190 |

## backend/settings_saves.py

| Function | Line |
| --- | ---: |
| [`save_inventory_setting`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/settings_saves.py#L12) | 12 |

## backend/shelf_associations.py

| Function | Line |
| --- | ---: |
| [`validate_device_shelf_association`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/shelf_associations.py#L8) | 8 |

## backend/smtp_settings.py

| Function | Line |
| --- | ---: |
| [`config_path`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L42) | 42 |
| [`_read_private`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L46) | 46 |
| [`public_settings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L63) | 63 |
| [`_check_text`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L78) | 78 |
| [`_validate_address`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L88) | 88 |
| [`_validate_host`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L103) | 103 |
| [`_validate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L118) | 118 |
| [`save_settings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L169) | 169 |
| [`_rate_limit_test`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L196) | 196 |
| [`send_test_email`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L205) | 205 |
| [`send_account_email`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L217) | 217 |
| [`deliver_email`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/smtp_settings.py#L227) | 227 |

## backend/staff_directory.py

| Function | Line |
| --- | ---: |
| [`_staff_revision`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L30) | 30 |
| [`_is_administrator`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L37) | 37 |
| [`unique_directory_fields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L45) | 45 |
| [`require_directory_access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L55) | 55 |
| [`_text`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L61) | 61 |
| [`_staff_record`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L68) | 68 |
| [`_department_record`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L75) | 75 |
| [`read_staff_member`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L82) | 82 |
| [`department_has_associations`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L100) | 100 |
| [`read_department`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L119) | 119 |
| [`list_directory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L126) | 126 |
| [`list_staff_department_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L146) | 146 |
| [`_validate_staff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L159) | 159 |
| [`_save_linked_personal_details`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L184) | 184 |
| [`_create_login`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L211) | 211 |
| [`save_staff_member`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L234) | 234 |
| [`save_department`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_directory.py#L297) | 297 |

## backend/staff_identity.py

| Function | Line |
| --- | ---: |
| [`read_linked_staff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_identity.py#L6) | 6 |
| [`staff_history_revision`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_identity.py#L14) | 14 |
| [`shared_profile_conflicts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_identity.py#L31) | 31 |
| [`fill_shared_profile_blanks`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_identity.py#L39) | 39 |
| [`write_shared_staff_details`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_identity.py#L48) | 48 |
| [`link_account_staff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_identity.py#L55) | 55 |

## backend/stock_circulation.py

| Function | Line |
| --- | ---: |
| [`stock_event_date`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L15) | 15 |
| [`stock_recipients`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L27) | 27 |
| [`stock_recipient`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L38) | 38 |
| [`stock_movement_snapshot`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L52) | 52 |
| [`publish_stock_movement`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L59) | 59 |
| [`stock_issue_records`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L106) | 106 |
| [`read_stock_issues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L177) | 177 |
| [`issue_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L203) | 203 |
| [`issue_stock_in_transaction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L215) | 215 |
| [`stock_unit_states`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L266) | 266 |
| [`registered_stock_devices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L277) | 277 |
| [`legacy_device_issue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L294) | 294 |
| [`preparation_requirements`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L315) | 315 |
| [`preparation_checks`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L332) | 332 |
| [`require_stock_device_edit`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L340) | 340 |
| [`return_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L349) | 349 |
| [`prepare_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L477) | 477 |
| [`stock_state_balance`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L539) | 539 |
| [`canonical_device_choice`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L547) | 547 |
| [`write_off_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L568) | 568 |
| [`stock_movement_history`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_circulation.py#L684) | 684 |

## backend/stock_intake.py

| Function | Line |
| --- | ---: |
| [`stock_json`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L20) | 20 |
| [`stock_access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L25) | 25 |
| [`stock_text`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L31) | 31 |
| [`stock_quantity`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L44) | 44 |
| [`stock_checks`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L50) | 50 |
| [`stock_specifications`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L57) | 57 |
| [`stock_configuration`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L81) | 81 |
| [`stock_digest`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L86) | 86 |
| [`stock_item`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L90) | 90 |
| [`stock_history`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L150) | 150 |
| [`read_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L185) | 185 |
| [`project_stock_details`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L199) | 199 |
| [`stock_operation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L214) | 214 |
| [`stock_replay`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L223) | 223 |
| [`append_stock_fact`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L241) | 241 |
| [`stock_write_access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L267) | 267 |
| [`receive_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L273) | 273 |
| [`update_stock_readiness`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_intake.py#L370) | 370 |

## backend/stock_reporting.py

| Function | Line |
| --- | ---: |
| [`stock_report_counts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_reporting.py#L12) | 12 |
| [`read_stock_report`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_reporting.py#L20) | 20 |
| [`read_stock_report.add_counts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_reporting.py#L36) | 36 |

## backend/stock_schema.py

| Function | Line |
| --- | ---: |
| [`stock_schema_statements`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_schema.py#L490) | 490 |
| [`normalise_schema_statement`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_schema.py#L502) | 502 |
| [`validate_feature_table`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_schema.py#L516) | 516 |
| [`validate_it_asset_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_schema.py#L564) | 564 |
| [`migrate_it_asset_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_schema.py#L600) | 600 |

## backend/subnet_validation.py

| Function | Line |
| --- | ---: |
| [`parse_hierarchy_cidr`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L9) | 9 |
| [`validate_subnet_hierarchy`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L36) | 36 |
| [`validate_subnet_hierarchy.ancestor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L109) | 109 |
| [`validate_subnet_hierarchy.independent_network_inside_block`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L119) | 119 |
| [`_js_number`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L145) | 145 |
| [`_js_string`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L164) | 164 |
| [`_ip_number`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L174) | 174 |
| [`validate_subnet_types`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L189) | 189 |
| [`validate_subnet_mutation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/subnet_validation.py#L235) | 235 |

## backend/tls.py

| Function | Line |
| --- | ---: |
| [`subject_alternative_names`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/tls.py#L12) | 12 |
| [`ensure_certificate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/tls.py#L33) | 33 |

## scripts/build_private_acceptance.py

| Function | Line |
| --- | ---: |
| [`build_private_acceptance`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/scripts/build_private_acceptance.py#L12) | 12 |
| [`build_private_acceptance.git`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/scripts/build_private_acceptance.py#L13) | 13 |

## backend/device_stock.py

| Function | Line |
| --- | ---: |
| [`require_device_stock_access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_stock.py#L17) | 17 |
| [`registration_source_ready`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_stock.py#L25) | 25 |
| [`device_stock_sources`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_stock.py#L30) | 30 |
| [`validate_registration_identity`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_stock.py#L49) | 49 |
| [`register_stock_device`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_stock.py#L67) | 67 |
| [`device_ready_for_reissue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_stock.py#L108) | 108 |
| [`reissue_device_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_stock.py#L118) | 118 |
| [`reissue_stock_device`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_stock.py#L126) | 126 |

## backend/device_storage.py

| Function | Line |
| --- | ---: |
| [`storage_text`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_storage.py#L5) | 5 |
| [`storage_number`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_storage.py#L10) | 10 |
| [`validate_device_storage`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_storage.py#L22) | 22 |

## backend/equipment_associations.py

| Function | Line |
| --- | ---: |
| [`equipment_association_schema`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_associations.py#L60) | 60 |
| [`validate_equipment_associations`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_associations.py#L67) | 67 |
| [`migrate_equipment_associations`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_associations.py#L84) | 84 |
| [`read_equipment_associations`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_associations.py#L95) | 95 |
| [`add_associated_equipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_associations.py#L143) | 143 |
| [`has_outstanding_associated_equipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_associations.py#L242) | 242 |

## backend/handover_schema.py

| Function | Line |
| --- | ---: |
| [`handover_assignment_statements`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/handover_schema.py#L119) | 119 |
| [`handover_stock_guard`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/handover_schema.py#L130) | 130 |
| [`handover_schema_objects`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/handover_schema.py#L142) | 142 |
| [`validate_device_handovers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/handover_schema.py#L147) | 147 |
| [`migrate_device_handovers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/handover_schema.py#L165) | 165 |

## backend/device_handovers.py

| Function | Line |
| --- | ---: |
| [`require_handover_access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_handovers.py#L16) | 16 |
| [`device_handover_source`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_handovers.py#L29) | 29 |
| [`device_handover_context`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_handovers.py#L56) | 56 |
| [`reassign_device`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/device_handovers.py#L65) | 65 |

## backend/stock_corrections.py

| Function | Line |
| --- | ---: |
| [`correction_source`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_corrections.py#L12) | 12 |
| [`correction_version`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_corrections.py#L41) | 41 |
| [`replay_corrected_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_corrections.py#L51) | 51 |
| [`stock_correction_context`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_corrections.py#L108) | 108 |
| [`validate_stock_correction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_corrections.py#L130) | 130 |
| [`preview_stock_correction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_corrections.py#L153) | 153 |
| [`save_stock_correction`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/stock_corrections.py#L166) | 166 |

## backend/supplier_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_suppliers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/supplier_schema.py#L93) | 93 |

## backend/supplier_issue_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_supplier_issues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/supplier_issue_schema.py#L80) | 80 |

## backend/suppliers.py

| Function | Line |
| --- | ---: |
| [`supplier_access`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L14) | 14 |
| [`fields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L19) | 19 |
| [`cleaned`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L25) | 25 |
| [`web_address`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L38) | 38 |
| [`identities`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L54) | 54 |
| [`text_list`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L62) | 62 |
| [`contact_values`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L68) | 68 |
| [`address`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L93) | 93 |
| [`directory_categories`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L101) | 101 |
| [`read_directory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L109) | 109 |
| [`get_supplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L133) | 133 |
| [`supply_sections`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L144) | 144 |
| [`supplier_delete_reason`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L150) | 150 |
| [`contact_delete_reason`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L160) | 160 |
| [`location_delete_reason`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L168) | 168 |
| [`read_supplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L176) | 176 |
| [`log_change`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L222) | 222 |
| [`child_record`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L236) | 236 |
| [`confirmed`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L247) | 247 |
| [`require_revision`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L252) | 252 |
| [`save_categories`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L257) | 257 |
| [`save_company`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L275) | 275 |
| [`save_category`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L316) | 316 |
| [`set_archived`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L352) | 352 |
| [`save_location`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L361) | 361 |
| [`save_contact`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L378) | 378 |
| [`save_note`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L411) | 411 |
| [`log_note`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L436) | 436 |
| [`change_company_status`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L442) | 442 |
| [`change_child`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L480) | 480 |
| [`read_issue_rows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L520) | 520 |
| [`read_issues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L547) | 547 |
| [`read_purchasing_dashboard`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L551) | 551 |
| [`read_issue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L560) | 560 |
| [`issue_snapshot`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L592) | 592 |
| [`save_issue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L600) | 600 |
| [`write_issue_update`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L652) | 652 |
| [`correct_issue_update`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L675) | 675 |
| [`save_supplier_operation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L700) | 700 |
| [`read_supply_impact`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/suppliers.py#L746) | 746 |

## interface/suppliers.js

| Function | Line |
| --- | ---: |
| [`supplierTabs`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L13) | 13 |
| [`safe`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L18) | 18 |
| [`icon`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L19) | 19 |
| [`displayEquipmentType`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L20) | 20 |
| [`editable`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L21) | 21 |
| [`list`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L22) | 22 |
| [`locationAddress`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L23) | 23 |
| [`labelStatus`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L24) | 24 |
| [`badge`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L25) | 25 |
| [`findContact`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L26) | 26 |
| [`findLocation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L27) | 27 |
| [`findNote`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L28) | 28 |
| [`options`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L29) | 29 |
| [`button`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L32) | 32 |
| [`nameButton`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L35) | 35 |
| [`header`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L38) | 38 |
| [`sectionHeading`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L45) | 45 |
| [`table`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L48) | 48 |
| [`emptyRow`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L53) | 53 |
| [`field`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L56) | 56 |
| [`select`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L62) | 62 |
| [`toolSearch`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L66) | 66 |
| [`card`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L72) | 72 |
| [`info`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L75) | 75 |
| [`webLink`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L78) | 78 |
| [`categoryTags`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L86) | 86 |
| [`directoryResults`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L90) | 90 |
| [`renderDirectory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L100) | 100 |
| [`contactScope`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L114) | 114 |
| [`lifecycleActions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L120) | 120 |
| [`lifecycleButtons`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L134) | 134 |
| [`renderOverview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L138) | 138 |
| [`renderLocations`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L157) | 157 |
| [`contactRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L175) | 175 |
| [`renderContacts`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L184) | 184 |
| [`formatDate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L194) | 194 |
| [`time`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L197) | 197 |
| [`noteCards`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L198) | 198 |
| [`renderNotes`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L209) | 209 |
| [`issueCategoryName`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L215) | 215 |
| [`issueCategoryLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L218) | 218 |
| [`issueStatusBadge`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L222) | 222 |
| [`issueButton`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L225) | 225 |
| [`issueRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L229) | 229 |
| [`issuesList`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L237) | 237 |
| [`renderNotesIssues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L244) | 244 |
| [`renderAllIssues`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L253) | 253 |
| [`dashboardIcon`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L258) | 258 |
| [`dashboardMetric`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L261) | 261 |
| [`dashboardCard`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L265) | 265 |
| [`renderPurchasing`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L269) | 269 |
| [`recentCell`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L276) | 276 |
| [`equipmentRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L302) | 302 |
| [`renderEquipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L313) | 313 |
| [`renderDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L325) | 325 |
| [`render`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L339) | 339 |
| [`request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L350) | 350 |
| [`readRoute`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L359) | 359 |
| [`writeRoute`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L365) | 365 |
| [`show`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L370) | 370 |
| [`mountEquipmentChooser`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L419) | 419 |
| [`value`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L445) | 445 |
| [`describe`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L446) | 446 |
| [`close`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L450) | 450 |
| [`choose`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L457) | 457 |
| [`show`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L370) | 370 |
| [`loadChoices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L482) | 482 |
| [`openEquipmentAssignment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L545) | 545 |
| [`dialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L577) | 577 |
| [`lines`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L593) | 593 |
| [`valueOf`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L594) | 594 |
| [`selectedIds`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L595) | 595 |
| [`addressFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L596) | 596 |
| [`readAddress`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L602) | 602 |
| [`checkList`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L605) | 605 |
| [`formSection`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L610) | 610 |
| [`contactEntry`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L614) | 614 |
| [`supplierForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L624) | 624 |
| [`locationForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L657) | 657 |
| [`contactForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L669) | 669 |
| [`contactDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L701) | 701 |
| [`noteForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L718) | 718 |
| [`issueCategoryOptions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L728) | 728 |
| [`issueUpdates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L732) | 732 |
| [`issueDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L740) | 740 |
| [`openIssue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L787) | 787 |
| [`refreshAfterIssueSave`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L796) | 796 |
| [`correctIssueUpdate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L800) | 800 |
| [`backToIssue`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L806) | 806 |
| [`addInlineIssueCategory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L818) | 818 |
| [`toggleInlineCategory`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L840) | 840 |
| [`applyIssueCategories`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L847) | 847 |
| [`categoriesDialog`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L854) | 854 |
| [`categoryForm`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L866) | 866 |
| [`command`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L875) | 875 |
| [`updateSupplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L884) | 884 |
| [`updateCategories`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L895) | 895 |
| [`statusConfirmation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L906) | 906 |
| [`supplyConfirmation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L936) | 936 |
| [`refreshRows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L952) | 952 |
| [`caffootSuppliers.configure`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L1119) | 1119 |
| [`caffootSuppliers.enter`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L1122) | 1122 |
| [`caffootSuppliers.leave`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L1126) | 1126 |
| [`caffootSuppliers.closed`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/suppliers.js#L1133) | 1133 |

## backend/equipment_supplier_schema.py

| Function | Line |
| --- | ---: |
| [`migrate_equipment_suppliers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_supplier_schema.py#L30) | 30 |

## backend/equipment_suppliers.py

| Function | Line |
| --- | ---: |
| [`read_supplier_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L13) | 13 |
| [`selectable_supplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L24) | 24 |
| [`device_supplier_values`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L37) | 37 |
| [`write_device_supplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L66) | 66 |
| [`read_device_suppliers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L89) | 89 |
| [`read_receipt_suppliers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L101) | 101 |
| [`write_receipt_supplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L118) | 118 |
| [`assign_equipment_supplier`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L132) | 132 |
| [`equipment_revisions`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L174) | 174 |
| [`assign_device_suppliers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L188) | 188 |
| [`receipt_visible_to_equipment_reader`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L208) | 208 |
| [`assign_receipt_suppliers`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L218) | 218 |
| [`read_supplied_equipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_suppliers.py#L236) | 236 |

## backend/equipment_lifecycle.py

| Function | Line |
| --- | ---: |
| [`utc_today`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L28) | 28 |
| [`physical_device`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L32) | 32 |
| [`calendar_date`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L37) | 37 |
| [`add_calendar_years`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L51) | 51 |
| [`warning_state`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L61) | 61 |
| [`lifecycle_configuration`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L72) | 72 |
| [`display_type`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L79) | 79 |
| [`lifecycle_types`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L83) | 83 |
| [`device_type_availability`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L106) | 106 |
| [`require_selectable_device_type`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L117) | 117 |
| [`read_lifecycle_settings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L132) | 132 |
| [`whole_number`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L139) | 139 |
| [`save_lifecycle_settings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L147) | 147 |
| [`device_lifecycle_values`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L208) | 208 |
| [`write_device_lifecycle`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L215) | 215 |
| [`project_device_lifecycle`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L247) | 247 |
| [`capture_first_service_from_stock`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle.py#L272) | 272 |

## backend/equipment_lifecycle_schema.py

| Function | Line |
| --- | ---: |
| [`seed_equipment_lifecycle_defaults`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle_schema.py#L6) | 6 |
| [`migrate_equipment_lifecycle`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/equipment_lifecycle_schema.py#L18) | 18 |

## interface/lifecycle.js

| Function | Line |
| --- | ---: |
| [`asDate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L13) | 13 |
| [`dateLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L14) | 14 |
| [`typeLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L15) | 15 |
| [`esc`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L16) | 16 |
| [`yearsLabel`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L18) | 18 |
| [`addYears`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L20) | 20 |
| [`renderDetails`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L30) | 30 |
| [`bindEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L39) | 39 |
| [`input`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L50) | 50 |
| [`update`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L56) | 56 |
| [`form.lifecycleDraft`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L98) | 98 |
| [`form.lifecycleChanges`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L101) | 101 |
| [`renderDashboard`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L124) | 124 |
| [`bindDashboard`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L156) | 156 |
| [`closest`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L166) | 166 |
| [`render`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/lifecycle.js#L169) | 169 |

## backend/service_desk.py

| Function | Line |
| --- | ---: |
| [`ticket_rows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L50) | 50 |
| [`ticket_text`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L56) | 56 |
| [`ticket_category`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L66) | 66 |
| [`read_ticket_categories`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L77) | 77 |
| [`read_ticket_list`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L86) | 86 |
| [`read_ticket_equipment_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L168) | 168 |
| [`read_ticket_software_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L212) | 212 |
| [`read_ticket_assignment_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L217) | 217 |
| [`eligible_ticket_technician`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L225) | 225 |
| [`require_ticket`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L230) | 230 |
| [`read_ticket`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L243) | 243 |
| [`read_ticket_attachment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L299) | 299 |
| [`record_ticket_event`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L312) | 312 |
| [`insert_ticket_message`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L320) | 320 |
| [`create_ticket`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L327) | 327 |
| [`save_ticket_message`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L372) | 372 |
| [`change_ticket_lifecycle`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L406) | 406 |
| [`remove_ticket_attachment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L513) | 513 |
| [`save_ticket_request`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk.py#L530) | 530 |

## backend/service_desk_access.py

| Function | Line |
| --- | ---: |
| [`linked_ticket_staff`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_access.py#L46) | 46 |
| [`ticket_scope_filter`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_access.py#L61) | 61 |
| [`ticket_equipment_for_creation`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_access.py#L98) | 98 |
| [`employee_ticket_equipment`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_access.py#L173) | 173 |

## backend/service_desk_schema.py

| Function | Line |
| --- | ---: |
| [`has_service_desk_storage`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_schema.py#L130) | 130 |
| [`migrate_service_desk`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_schema.py#L137) | 137 |
| [`migrate_ticket_software`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_schema.py#L152) | 152 |
| [`migrate_service_desk_reporting`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_schema.py#L157) | 157 |

## backend/service_desk_attachments.py

| Function | Line |
| --- | ---: |
| [`is_ticket_png`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_attachments.py#L23) | 23 |
| [`is_ticket_jpeg`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_attachments.py#L55) | 55 |
| [`is_ticket_pdf`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_attachments.py#L94) | 94 |
| [`is_ticket_text`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_attachments.py#L110) | 110 |
| [`read_ticket_office_xml`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_attachments.py#L120) | 120 |
| [`is_ticket_office_document`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_attachments.py#L133) | 133 |
| [`validate_ticket_attachments`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_attachments.py#L173) | 173 |
| [`insert_ticket_attachments`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_attachments.py#L212) | 212 |

## backend/service_desk_calendar.py

| Function | Line |
| --- | ---: |
| [`utc_timestamp`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_calendar.py#L16) | 16 |
| [`read_deployment_timezone`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_calendar.py#L20) | 20 |
| [`read_support_calendar`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_calendar.py#L38) | 38 |
| [`append_support_calendar`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_calendar.py#L48) | 48 |
| [`activate_deployment_timezone`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_calendar.py#L56) | 56 |
| [`split_timezone_offsets`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_calendar.py#L66) | 66 |
| [`eligible_working_time`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_calendar.py#L91) | 91 |
| [`measure_resolution_attempt`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_calendar.py#L110) | 110 |

## backend/service_desk_reporting.py

| Function | Line |
| --- | ---: |
| [`read_report_period`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_reporting.py#L16) | 16 |
| [`save_report_period`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_reporting.py#L24) | 24 |
| [`reporting_dates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_reporting.py#L48) | 48 |
| [`report_event_rows`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_reporting.py#L60) | 60 |
| [`read_service_desk_report`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_reporting.py#L93) | 93 |

## backend/service_desk_settings.py

| Function | Line |
| --- | ---: |
| [`parse_support_date`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_settings.py#L19) | 19 |
| [`read_service_desk_settings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_settings.py#L28) | 28 |
| [`validate_working_hours`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_settings.py#L38) | 38 |
| [`save_support_calendar`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_settings.py#L54) | 54 |
| [`save_ticket_category`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_settings.py#L95) | 95 |
| [`save_service_desk_settings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/service_desk_settings.py#L132) | 132 |

## backend/ticket_software.py

| Function | Line |
| --- | ---: |
| [`ticket_software_choices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/ticket_software.py#L12) | 12 |
## backend/email_template_catalogue.py

| Function | Line |
| --- | ---: |
| [`account_security_text`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_template_catalogue.py#L209) | 209 |

## backend/email_logo.py

| Function | Line |
| --- | ---: |
| [`png_has_valid_pixels`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_logo.py#L15) | 15 |
| [`validate_logo`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_logo.py#L50) | 50 |

## backend/email_rendering.py

| Function | Line |
| --- | ---: |
| [`safe_email_url`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L16) | 16 |
| [`replace_email_variables`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L36) | 36 |
| [`EmailBody.__init__`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L43) | 43 |
| [`EmailBody.handle_starttag`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L54) | 54 |
| [`EmailBody.handle_startendtag`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L88) | 88 |
| [`EmailBody.handle_endtag`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L92) | 92 |
| [`EmailBody.handle_data`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L102) | 102 |
| [`EmailBody.close_tags`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L112) | 112 |
| [`parse_email_body`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L123) | 123 |
| [`email_placeholders`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L131) | 131 |
| [`validate_email_wording`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L135) | 135 |
| [`render_email`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_rendering.py#L157) | 157 |

## backend/email_templates.py

| Function | Line |
| --- | ---: |
| [`migrate_email_templates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L26) | 26 |
| [`email_template_state`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L43) | 43 |
| [`read_email_branding`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L59) | 59 |
| [`public_email_branding`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L70) | 70 |
| [`read_email_templates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L75) | 75 |
| [`require_email_revision`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L86) | 86 |
| [`save_email_template`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L93) | 93 |
| [`validate_branding_fields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L131) | 131 |
| [`save_email_branding`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L145) | 145 |
| [`mutate_email_templates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L169) | 169 |
| [`sample_email`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L184) | 184 |
| [`sample_email_branding`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L221) | 221 |
| [`render_account_email`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/email_templates.py#L235) | 235 |

## interface/email-templates.js

| Function | Line |
| --- | ---: |
| [`requestEmailSettings`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L10) | 10 |
| [`emailElement`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L24) | 24 |
| [`setEmailFeedback`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L31) | 31 |
| [`renderEmailPreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L37) | 37 |
| [`readCompanyLogo`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L59) | 59 |
| [`mountEmailEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L79) | 79 |
| [`currentWording`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L119) | 119 |
| [`templateEdited`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L123) | 123 |
| [`readBrandingFields`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L127) | 127 |
| [`brandingEdited`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L131) | 131 |
| [`canLeaveEmailEditor`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L136) | 136 |
| [`syncTemplateStatus`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L142) | 142 |
| [`syncBrandingControls`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L159) | 159 |
| [`renderTemplateChoices`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L169) | 169 |
| [`rememberEmailCaret`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L189) | 189 |
| [`restoreEmailCaret`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L201) | 201 |
| [`insertEmailToken`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L214) | 214 |
| [`copyEmailToken`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L235) | 235 |
| [`renderEmailVariables`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L244) | 244 |
| [`chooseEmailTemplate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L270) | 270 |
| [`updateEmailPreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L294) | 294 |
| [`updateBrandingPreview`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L321) | 321 |
| [`editEmailWording`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L341) | 341 |
| [`changeEmailTemplate`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L347) | 347 |
| [`sendTemplateTest`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L389) | 389 |
| [`applySavedBranding`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L408) | 408 |
| [`chooseCompanyLogo`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L415) | 415 |
| [`saveCompanyBranding`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L442) | 442 |
| [`showEmailSettingsTab`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L470) | 470 |
| [`insertEmailLink`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L483) | 483 |
| [`hydrateEmailTemplates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L600) | 600 |
| [`loadEmailTemplates`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/interface/email-templates.js#L607) | 607 |

## backend/staff_employment.py

| Function | Line |
| --- | ---: |
| [`require_active_staff_login`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_employment.py#L9) | 9 |
| [`disable_employment_login`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_employment.py#L15) | 15 |
| [`reconcile_employment_logins`](https://github.com/Caffoot/Caffoot-Lite/blob/0251b43a3b5d41d626aa022c6d7f9b4d860433da/backend/staff_employment.py#L48) | 48 |
