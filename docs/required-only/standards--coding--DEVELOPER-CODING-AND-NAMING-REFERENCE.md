# Developer coding and naming reference

**Status:** Implemented identifiers in draft PR #195 for v1.3.3. This is a developer guide, not approval to merge or release.

**Application source:** `app/caffoot-lite.html`. Search for the exact identifiers below rather than relying on line numbers, which change as the standalone HTML evolves.

## Naming conventions

- **Functions:** Use descriptive verbs and the relevant domain noun, such as `parseIpv4AddressToNumber`, `validateRackPlacement`, `renderDevicesHTML` or `createInventoryBackup`. Distinguish `get` (read), `render` (build interface), `validate` (check), `plan` (propose without applying) and `save` or `apply` (mutate state).
- **Variables:** Use lower camel case describing the value, such as `activeSettingsSection` and `selectedRackId`. Avoid historic development-phase names.
- **Constants:** Use descriptive upper snake case for shared immutable configuration, such as `STORAGE_KEY`, `AUDIT_KEY` and `SAFETY_SNAPSHOT_KEY`. Do not assume every `const` binding is a shared configuration constant.
- **HTML IDs:** Name the element's current purpose. JavaScript selectors and accessibility references must be updated together with an internal ID.
- **CSS classes:** Name the component and its role, such as `rack-accessory-item` and `rack-accessory-port`. Preserve selector specificity and visual behaviour when renaming.
- **Event actions:** `data-action` values identify delegated user actions, such as `delete-subnet`, `assign-device` and `close-modal`. Update producers and the central event handler together; never rename only the attribute or only its handler.
- **Comments:** Explain why safeguards or compatibility decisions exist in plain British English. Do not require readers to understand historical phase labels or audit identifiers.

## Searchable implementation examples

| Search identifier in `app/caffoot-lite.html` | Responsibility |
| --- | --- |
| `function parseIpv4AddressToNumber(` | Convert a validated IPv4 address into a numeric representation. |
| `function formatIpv4Address(` | Convert a numeric IPv4 address into readable dotted notation. |
| `function parseSupportedIpv4Subnet(` | Parse supported IPv4 subnet notation and bounds. |
| `function doIpv4SubnetsOverlap(` | Determine whether two IPv4 subnet ranges intersect. |
| `function isUsableHostAddressInSubnet(` | Check whether an address can be assigned as a host within a subnet. |
| `function getDeviceById(` | Find a device in the current inventory by its identifier. |
| `function validateRackPlacement(` | Check whether equipment can occupy the requested rack position. |
| `function planDeviceIpAllocationIntegrityRepairs(` | Prepare proposed IP allocation repairs without applying them during preview. |
| `function getEffectiveDevicePlatform(` | Determine the displayed platform, including physical hypervisor handling. |
| `function getVisibleDevices(` | Apply current inventory visibility and filtering rules. |
| `function renderDevicesHTML(` | Build the device inventory interface. |
| `function getConfiguredHardwareCatalogueEntries(` | Read the configured hardware catalogue entries. |
| `function getAvailableSoftwareCatalogueEntries(` | Determine available software catalogue entries. |
| `function findRackImportConflicts(` | Detect rack placement conflicts in an imported inventory. |
| `function validateAndNormaliseBackupForImport(` | Validate and normalise an incoming backup before it is applied. |
| `function normaliseImportedBackupAndPlanLegacyMountRepairs(` | Account for older backup formats and propose compatible rack mount repairs. |
| `function createInventoryBackup(` | Produce an inventory backup. |
| `function loadStoredState(` | Load persisted browser inventory with recovery safeguards. |

## Compatibility-sensitive names

The following saved browser keys are **persisted contracts**, not merely internal naming candidates. Do not rename them as part of a cosmetic refactor:

- `caffoot_state` through `STORAGE_KEY`: active inventory.
- `caffoot_audit_v1` through `AUDIT_KEY`: local audit history.
- `caffoot_browser_storage_notice_v1` through `BROWSER_STORAGE_NOTICE_KEY`: browser storage notice state.
- `caffoot_phase11_pre_restore` through `SAFETY_SNAPSHOT_KEY`: historical pre-restore safety snapshot. Its phase-like spelling is intentionally retained for compatibility.

Likewise, backup JSON fields, legacy inventory values, HTML actions and any externally consumed identifiers need a dependency and compatibility review before modification. A change to persisted data requires a separately agreed migration where appropriate.

## Related controlling records

- [Historical old-to-new naming map and audit trail](../technical/FUNCTION-NAMING-AND-REFERENCE.md)
- [Technical workflows](../../workflows/TECHNICAL-WORKFLOWS.md)
- [Audit findings programme](../../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md)
- [Verification coverage register](../../testing/WORKFLOW-VERIFICATION-COVERAGE-REGISTER.md)

Issue #101 owns the naming and comment clean-up. Issue #192 separately owns redundant code investigation and any subsequently approved refactoring. Passing application evidence for PR #195 is recorded in GitHub Actions, including release validation run 40688665136 and consolidated Chromium run 40688665214. Documentation-only changes do not invalidate that evidence.
