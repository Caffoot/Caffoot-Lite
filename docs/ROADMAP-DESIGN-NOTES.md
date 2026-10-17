# Caffoot Lite — Roadmap Design Notes

**Created:** 16 October 2026  
**Updated:** 17 October 2026  
**Status:** Planning only  
**Purpose:** Preserve proposed features, agreed design directions, dependencies and compatibility requirements.

These notes are not implementation approval or release commitments. Finish v1.1 first. Published v1.0.3 remains untouched until a separately reviewed release is authorised.

## 0. Agreed v1.1 completion and proposed v1.1.1 polish

### v1.1 — completion work

- **Gateway safety:** a configured gateway must not appear freely allocatable; protect editing/bulk actions and reconcile Reserved/Available counts while preserving existing device assignments.
- **Informational modals:** Safe Update Guide and Software Licences need visible close controls and consistent Escape/focus behaviour. Audit other informational modals for the same issue.
- **Network information:** read-only CIDR-derived network address, mask, gateway, first/last usable address, broadcast address, usable host count and available-for-allocation count. Continue excluding network/broadcast from the allocation grid.
- **Hierarchy presentation:** top-level IP Address Blocks as separate cards in a responsive two-column desktop grid, one column on narrow screens. Nested blocks stay collapsible; individual Network / VLAN entries remain compact rows. Add Expand All / Collapse All. Preserve edit controls and existing hierarchy validation, storage and backup formats. Avoid fixed-height scroll traps and unnecessary visual clutter.
- **Release gates:** automated regression testing and user-confirmed Firefox/Safari checks before release. No changes to published v1.0.3 without approval.

### v1.1.1 — Settings, usability and documentation (proposed)

- **Settings & Data:** keep one obvious Download JSON Backup control in Back Up Your Data; retain a concise, prominent local-storage warning. Preserve restore, snapshot, diagnostics and clear-system safeguards. Put advanced/recovery actions in a less prominent but accessible section.
- **About:** more substantial, polished explanation of Caffoot Lite and its offline-first purpose, version, repository and licence information. Summarise rather than paste the entire README.
- **Preferences:** consider theme, startup/default views and opt-in update checks. Explore central management of device types, server functions and software option lists while keeping contextual controls in device forms.
- **Inventory Health:** distinguish dashboard data-integrity checks from the Inventory Safety Check that also verifies browser-storage persistence; do not imply live network or device monitoring. Explain what each check does.
- **Help & Documentation:** concise, discoverable offline help for getting started, IPAM/subnets, devices/racks, backups/recovery and troubleshooting. Prefer an intuitive UI; help is optional support.
- **Updates:** improve status and release guidance; investigate optional online version checks. Local single-file applications must not silently overwrite themselves or change inventories.
- **Safety:** preserve legacy inventory, JSON backups, offline operation and accessible keyboard interactions.

These are planning decisions, not permission to implement. Existing v1.2–v1.5 scope remains unchanged.

### v1.1.2 — Security hardening and deployment guidance (proposed)

**Purpose:** Review the actual v1.1.x standalone HTML build and its source before expanding the feature surface in v1.2. The immediate README warning is guidance, not evidence of a completed audit.

Review areas:
- **DOM injection/XSS:** audit all user-controlled text, HTML insertion and imported backup data; use safe rendering and output encoding.
- **Import/validation:** malformed and hostile JSON, unexpected keys/types, oversized input, prototype-pollution-style keys, recovery and backup integrity.
- **Storage/privacy:** browser local storage, site origin and `file://` differences, shared machines, export confidentiality and reset/recovery paths.
- **Dependencies/network:** inventory bundled libraries and vulnerabilities; verify no unintended external requests; protect offline functionality.
- **Browser controls:** assess CSP and other mitigations without breaking standalone file execution; document trade-offs.
- **Testing:** targeted security regression cases, repeatable checks, documented findings, remediation and Firefox/Safari acceptance.

**Deployment guidance:** Do not expose Lite unauthenticated to the internet. If served over HTTPS, restrict access through properly integrated identity/authentication and network controls. Authentik may provide identity services alongside Nginx or another reverse proxy, but a proxy alone is not a login and authentication alone is not a complete security assessment. Hosting does not provide shared server-side inventory storage or multi-user isolation.

**Reporting:** consider `SECURITY.md` with supported versions, private reporting mechanism and disclosure expectations; do not publish exploit details prematurely. Distinguish intended future Pro architecture from an actually released and validated product.

## Additional usability and data-safety ideas — future review

The following are **proposals**, not confirmed defects or approved implementation work. Prioritise completing v1.1 before expanding scope.

- **Backup awareness (v1.1.1 candidate):** explore a reliable Last Backup indicator, a non-intrusive reminder after meaningful changes, date/version in export filenames and detection/warnings for unavailable or ephemeral browser storage. Do not claim an export is safely retained merely because it was initiated; never download backups silently.
- **First-run and empty states (v1.1.1 candidate):** useful explanations and direct actions for empty Devices, Subnets/IPAM and Racks, without unnecessary onboarding screens.
- **Inventory Health (v1.1.1 candidate):** extend understandable diagnostics for orphaned references, duplicate assignments and consistency problems. Distinguish actual errors from optional missing information (such as devices without IPs); avoid suggesting live monitoring.
- **Cross-module integrity (v1.1.2 and ongoing):** test device renames/deletes, subnet changes, rack moves/removals, IP allocations and JSON restore across modules. Preserve referential integrity and protect existing data.
- **Destructive-action previews (future usability work):** show affected records and consequences before removing populated subnets, racks or linked devices. Preserve cancellation and recovery safeguards.
- **Accessibility (ongoing):** keyboard and focus behaviour, semantic controls, screen reader labels, contrast, zoom, responsive layouts and consistent modal dismissal.
- **Inventory-wide change history (future investigation):** consider a lightweight local history building on existing IPAM history, covering device edits, subnet creation and rack moves. Set reasonable storage limits and explain that browser-local history is **not** a tamper-proof multi-user audit log.

## 1. Device form redesign — v1.2 candidate

**Agreed design direction:** Wider, responsive Add Device and Edit Device forms with tabbed sections and consistent shared behaviour.

Proposed tabs:
- **General:** Device name, type, location and general information.
- **IP Addresses:** Assigned IPs, address purposes and optional interface associations.
- **Hardware:** Manufacturer, model, serial number and device-type-specific attributes.
- **Software / OS:** Contextual operating system family, version, optional edition and existing software-related fields for applicable devices.
- **Connections:** Future device relationships and physical/logical connectivity.

Requirements:
- Preserve existing dynamic fields based on device type.
- Share form structure and validation between Add and Edit.
- Retain unsaved values when switching tabs.
- Direct validation errors to the relevant tab.
- Support smaller screens and keyboard navigation.
- Preserve compatibility with existing device records.
- Introduce the Connections tab when relationship functionality is ready, if appropriate.
- Keep the form wider but responsive, and avoid unnecessary fields for devices to which they do not apply.

### Contextual operating system fields

For Desktop, Laptop, Tablet and Server (and other applicable device types), offer a simple Operating System family selector followed by a dependent version selector. Examples include Windows, Windows Server (2016/2019/2022/2025), Linux distributions, macOS, ChromeOS, Android and iPadOS. Treat these as illustrative rather than a fixed exhaustive list; allow **Unknown**, **None**, **Other / Custom** and future versions. For Windows Server, an optional edition field can capture Standard/Datacenter without confusing edition with version. Preserve existing OS/software values and backup compatibility; do not force invalid guesses.

### Device Inventory presentation

Align Device Inventory with the v1.1 IPAM design language: clear overview summaries, consistent actions and Title Case, responsive layout, filtering/search and readable details. Prefer compact searchable tables or rows for large device inventories over a large card for every device. Preserve existing operations and accessibility.


## 2. Multiple IP addresses per device — v1.2 candidate

**Agreed design direction:** Support multiple IP addresses without requiring detailed interface configuration.

- Add and remove IP assignments in the device form.
- Designate a primary management IP.
- Optionally associate an IP with an interface.
- Permit multiple IPs on an interface where appropriate.
- Record address purposes such as management, storage, WAN or LAN.
- Preserve Device/IPAM consistency and existing allocation safeguards.
- Support existing single-IP device records without manual re-entry.

### Public IP address management

Investigate public IPv4 allocations and blocks, ISP/circuit metadata, public-facing device assignments, and NAT/virtual IP documentation. Address validation must not be weakened to accommodate public addresses.

## 3. Rack configuration enhancements — v1.2 candidate

### Existing functionality to preserve

- Front and rear rack elevation views.
- Independent front/rear placements.
- Overlap prevention on the same face.
- Existing utilisation statistics and Print/PDF support.
- Separate devices may occupy the same U position on opposite faces where otherwise valid.

### Proposed configuration

Preset heights: **6U, 9U, 12U, 14U, 18U, 22U, 24U, 27U, 32U, 42U, 45U and 48U**, plus **Custom Height** with sensible validation.

Mounting types: **Wall Mounted**, **Free Standing**, **Open Frame**.

Optional rack depth is under consideration. Additional optional descriptive fields: **manufacturer, model, serial number, asset tag, width, depth and location**. For Free Standing racks, record base/installation configuration such as **casters**, **levelling feet** and **fixed/anchored**, allowing combinations where appropriate (casters and feet can coexist). Keep simple rack creation quick, with advanced fields optional.

### Rack accessories — additional v1.2 scope

Current rack accessory types observed in the application: **Blanking Plate, Patch Panel, Brush Panel, Cable Manager and Rack Shelf**. Preserve and reuse these rather than adding duplicates.

Proposed additions:
- **PDU (Power Distribution Unit):** horizontal rack-mounted units (commonly 1U/2U, with configurable height) or vertical **0U** units that do not consume numbered rack units.
- **Fan / Ventilation Panel:** rack-mounted, height based on actual accessory.
- **Vertical Cable Manager:** 0U, with a suitable mounting position.
- **Environmental Sensor:** typically 0U, with a suitable mounting position.
- **Rack-mounted UPS:** normally model as an inventory device where appropriate, avoiding duplicate accessory and device representations.

For 0U accessories, investigate mounting positions such as Front Left, Front Right, Rear Left and Rear Right, plus appropriate conflict handling. Do not assume that 0U means unlimited physical mounting space. Existing Face / Start U / Height (U) placement fields and overlap rules remain valid for conventional U-consuming accessories.

Optional PDU details may include socket counts/types (for example IEC C13/C19), power rating and descriptive notes. **Per-outlet connectivity, power consumption tracking and full power topology are outside the initial scope.** Keep the first implementation focused on safe physical rack placement and useful documentation.

### Editing and data safety

- Allow rack height and mounting type to be edited.
- Validate existing equipment before allowing a rack to shrink, checking both faces.
- Never silently remove or reposition equipment.
- Preserve existing rack records and placement rules.

## 4. Advanced search and reporting — v1.2 or later

Investigate cross-module search across Devices, IP addresses and allocations, Subnets, and Racks/equipment.

Initial reporting candidates:
- Device inventory.
- IP address and subnet utilisation.
- Rack capacity and utilisation.
- Unassigned or reserved addresses.

Later reporting may include ports, connectivity and cabling.

## 4A. Shared Suppliers directory — future milestone candidate

Consider a reusable Suppliers directory rather than repeating supplier contact information on each device or rack. Potential supplier data: company name, website, contact information, account reference and notes. Devices/racks could reference a supplier and optional purchase date, purchase order, cost and warranty expiry. **Manufacturer and supplier are distinct concepts.** Plan future record linkage and safe migration without implementing full supplier management in v1.2. Do not displace the existing v1.3 relationships/interfaces scope.

## 5. Device relationships and interfaces — v1.3 candidate

A device should show its connections to other devices, including local and remote interfaces.

Example: `CORE-SW01 Gi1/0/24 → FW01 LAN1`.

- One shared connection record visible from both endpoints.
- Avoid independent, conflicting connection entries.
- Interfaces can exist independently of IP assignments.
- IPs can optionally reference interfaces.
- Support appropriate physical and logical relationship types.
- Reuse these records in later cabling and topology features.

## 6. Cabling and rack connectivity — v1.4 candidate

- Patch panel inventory and physical ports.
- Cable endpoints and connection tracing.
- Duplicate endpoint assignment prevention.
- Rack-aware cabling documentation.
- Exportable rack diagrams.

Investigate SVG, Excalidraw and Visio compatibility without promising formats before feasibility testing.

## 7. Network topology — v1.5 candidate

Generate topology from the same relationship and connectivity records used elsewhere in Caffoot Lite; do not maintain a conflicting independent topology model.

Investigate physical/logical views, interactive device selection, connection tracing, layout/filtering and exports.

## 8. Future investigations

- Offline CSV/JSON imports and possible NetBox import compatibility.
- IPv6 blocks, allocations, validation and interface requirements.
- Additional reports and export formats.

No release commitment has been made for these ideas.

## 9. Cross-cutting design requirements

### Data integrity

- Preserve supported existing inventories and backup formats.
- Validate migrations and imports.
- Prevent orphaned records and conflicting assignments.
- Avoid partial changes after failed operations.
- Confirm destructive actions.

### Usability

- **Simple when you need it, detailed when you want it.**
- Consistent forms, labels and navigation, including Title Case for button text and headings.
- Clear validation messages, keyboard workflows, responsive layouts and light/dark themes.

### Offline operation

Caffoot Lite remains a standalone, offline HTML application without a required server or external service.

### Testing

Include relevant automated regression coverage and manual browser acceptance testing for future changes.

## 10. Implementation sequence

1. Complete and validate v1.1.
2. Review existing Device and IPAM data models.
3. Finalise the device form redesign.
4. Design multiple-IP assignment, validation and migration behaviour.
5. Confirm scope and sequencing for rack, search and reporting improvements.
6. Progress to relationships, cabling and topology through separately reviewed milestones.

**A feature appearing here does not authorise implementation.**
