# Caffoot Lite — Development Roadmap

> **Your infrastructure. Without the infrastructure.**  
> **Lite in effort. Not in features.**
>
> Caffoot Lite is the sole actively developed product. See the [product vision](docs/PRODUCT-VISION.md) and [architecture decisions](docs/ARCHITECTURE-DECISIONS.md). This does not commit the project to any particular future commercial model.

## v1.4.0 — Data & Architecture Foundations (planning)

- Audit the v1.3.0 code, browser storage, data relationships and backup format before changing application code.
- Evaluate Docker and persistent database options, including SQLite and PostgreSQL, without preselecting a solution.
- Design permanent device identity, user-facing asset numbering and future data relationships.
- Specify secure future internet-facing architecture, including login, administrator MFA, permissions and identity integration; **these capabilities are not delivered by this planning milestone**.
- Specify backward-compatible backup migration, persistence, rollback, security and regression acceptance gates.
- Preserve the current interface and workflows; **no new user-facing features are planned for v1.4.0**.

**Historical roadmap notes below are retained for traceability and may contain superseded planning or release-status statements; a separate documentation consistency pass will reconcile them against published releases.**

**Updated:** 21 October 2026  
**Current milestone:** v1.3.0 Rack Management feature freeze and release preparation; v1.4.0 Data & Architecture Foundations follows after publication.  
**Repository:** `caffoot/Caffoot-Lite` (public)  
**Release policy:** Publish publicly only after manual verification, security/privacy review and owner approval.

**Current published stable release:** [v1.2.1](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.2.1). v1.3.0 remains unpublished pending release gates.

Caffoot Lite is an offline, standalone single-HTML network inventory and IP address management application. v1.2.1 is the published stable patch release following October 2026 Devices & Intelligence; earlier versions remain available as historical releases.

## Documentation checks for every release

Before publishing **every** new version (including patch releases), complete a documentation consistency review as a release gate:

- Verify the application, package, release tag, release assets and current-version statements agree.
- Review `README.md`, `INSTALLATION.md`, `USER-GUIDE.md`, `ROADMAP.md`, `docs/ROADMAP-DESIGN-NOTES.md`, `BACKUP-FORMAT.md`, release notes and any other affected guides for accurate feature descriptions, navigation labels, download links, update instructions and backup warnings.
- Preserve historical release evidence, older compatible backup examples and legitimate references to previous versions; do not blindly replace every version number.
- Run automated checks for known version inconsistencies where practical, in addition to a human documentation review. An automated pass alone does not establish that instructions or screenshots are accurate.
- Record completion of the documentation review in release acceptance before publication. Treat unresolved user-facing inaccuracies as release blockers.

## Current and proposed milestones

Release assignments beyond v1.1 are provisional. A feature listed here is not a release promise or approval to implement it.

### v1.1 — Subnet hierarchy and validation

**Status: Released in v1.1.0 on 18 October 2026**

- Subnet hierarchy, parent/child relationships and CIDR validation.
- Nesting, boundaries, overlap and cycle protection.
- Intelligent subnet creation and editing with type-specific rules.
- Gateway protection and relevant network device-type support.
- Show gateway addresses as protected/reserved in IPAM; prevent accidental allocation and update availability statistics.
- Fix informational modal dismissal consistently, including Safe Update Guide and Software Licences (visible Close control, Escape and appropriate focus behaviour).
- Add read-only network information (network/broadcast addresses, mask, gateway, usable range and capacity) while keeping network and broadcast addresses out of host allocation.
- Present top-level IP Address Blocks in a responsive two-column card grid (one column on narrow screens), with nested collapsible blocks, compact Network / VLAN rows and Expand All / Collapse All. Preserve editing and avoid excessive page length.
- Data-safety release gates: verify backup/export guidance and browser-storage warnings; test edits/deletions and cross-module Device/IPAM/Rack references, including JSON restore; preview the impact of destructive actions on linked records.
- Accessibility acceptance for new and existing affected dialogs, including visible modal Close controls, Escape/focus behaviour, keyboard operation and responsive IPAM layouts.
- Regression testing and compatibility with existing inventory and backups.

The v1.1.0 scope above is historical release planning, now delivered. Further changes must be developed separately and merged only after review and owner approval.

### v1.1.1 — Settings, usability and documentation

**Status: Released on 18 October 2026** — PR #39 merged; local browser acceptance, GitHub Actions and verified release packaging passed.

- **Delivered in published v1.1.1:** consolidate duplicate backup controls while preserving prominent local-storage warnings, JSON export/restore, recovery snapshots and destructive-action safeguards.
- **Delivered in published v1.1.1:** reorganise Settings & Data into Back Up & Restore, Maintenance & Safety and Advanced Recovery.
- **Delivered in published v1.1.1:** expand About Caffoot Lite with official branding, installed version, repository and documentation links, release notes and licence access.
- **Partially implemented on development branch:** Light Mode, Dark Mode and Use System Setting preferences. Central management of device/server/software option lists remains to be assessed; preserve existing workflows and backups.
- **Delivered in published v1.1.1:** rename dashboard Data Health to Inventory Health, explain what is checked, and distinguish inventory consistency from browser-storage safety and live network monitoring (which is not provided).
- **Delivered in published v1.1.1:** add a dedicated offline Help & Guides tab with expandable reference topics, separate from About Caffoot Lite and complementary to the full online guides. Maintain these topics whenever related workflows change.
- **Partially implemented on development branch:** improve manual update status presentation. Opt-in automatic release checks remain under consideration; do not silently replace the local HTML file or restore inventory.

The delivered v1.1.1 scope is complete. Remaining ideas stay subject to review and do not automatically move into v1.1.2 or v1.2.

### v1.1.2 — Security hardening and deployment guidance

**Status: Released on 19 October 2026** — PR #44 squash-merged to `main`; automated release validation, Gitleaks Git-history scanning and owner local release packaging passed. The security work is defensive hardening, not a comprehensive security audit.

- Perform a code-focused security review of the standalone HTML app, including DOM XSS, HTML rendering, imported JSON, data validation and unsafe file/input handling.
- Review browser local-storage exposure, shared-device risks, backup sensitivity, privacy and origin-specific storage behaviour.
- Audit bundled dependencies and unexpected external requests; preserve the offline-first design.
- Evaluate practical Content Security Policy and other browser mitigations compatible with the single-file offline distribution.
- Add repeatable security regression tests and document limitations; do not claim the application is vulnerability-free.
- Publish clear README/deployment warnings against unauthenticated public exposure, explaining HTTPS, reverse-proxy authentication, network restrictions and residual risks.
- Consider a SECURITY.md with a private vulnerability-reporting route, supported versions and responsible disclosure guidance.
- Preserve existing data, JSON backup compatibility and user-approved release gates.

Managed multi-user hosting, authentication and centrally administered deployments are outside the scope of this standalone offline-first application. Any such architecture would require separate design, implementation and security validation.

### v1.2 — Device, IPAM and rack enhancements

**Status: v1.2.0 published on 20 October 2026.** Remaining IPAM/rack/network-environment features are proposed for later milestones.

**v1.2.0 device experience — agreed scope:**
- Redesign Add Device and Edit Device as **wider, responsive, consistent five-tab modals** (General, Hardware, Software & Firmware, Networking, Notes). Use readable field widths, compact two-column layouts where appropriate, and single-column layouts on small screens; preserve keyboard access, validation, unsaved drafts, device-type-specific fields and existing records.
- Refine mounting options by device type, including **Tower / Floor Standing** for physical servers, while accepting historical **Floor Standing** values in existing data and backups; only Rack Mounted devices require rack configuration.
- Move the current Devices workspace controls out of the page header into an **IPAM-style expandable left-hand Devices submenu**, with Overview as the default, Device Inventory, Device Types, Locations and appropriate management destinations. Avoid duplicated controls, empty pages and confusing navigation.
- Create a detailed **Devices Overview / Device Intelligence Dashboard** using the user's local inventory: total devices, relevant physical/virtual counts, device-type distribution, operating-system family/version distribution, location and mounting distribution, common software and server services, and inventory completeness (including missing IP/OS/location data). Only display metrics supported by stored data; show Unknown/Not Recorded and useful empty states instead of inventing information.
- Use responsive summary cards and accessible, readable charts consistent with IPAM's design language. Where practical, clicking a chart category opens Device Inventory with the corresponding filter; retain searchable, sortable, compact device lists and clear filtering.
- Keep all analytics **offline and local**: no external telemetry, live status, reachability or health claims. Do not label a device online/offline or show activity timelines unless reliable stored evidence supports them.
- Validate the new navigation, visualisations, Add/Edit workflows, import/export compatibility, rack/IPAM relationships, dark/light themes, narrow screens and offline standalone HTML in automated and owner browser acceptance before merging.

**v1.2.0 Devices workspace refinement — owner-requested scope (19 October 2026):**
- **Device Inventory layout:** investigate the current narrow content area and improve usable width at normal (100%) browser zoom. Reduce unnecessary nested containers and wasted horizontal space; use a responsive, readable inventory table, appropriately sized search/filter controls and consistent spacing without causing horizontal overflow on smaller screens.
- **Device Types:** give this destination a distinct purpose as a device classification overview and management workspace. Show counts by type and useful navigation into filtered Device Inventory; provide clear, safe management of custom types and distinguish predefined from custom entries.
- **Locations:** give this destination a distinct purpose as a location-based inventory overview, with device counts and drill-downs by location, useful missing-location indicators, and location management where supported. Avoid simply duplicating the Device Types page with a different label.
- **Consistent navigation:** ensure Device Intelligence, Device Inventory, Device Types, Locations and upcoming Device Catalogues have clear, non-overlapping purposes and coherent sidebar labels, responsive styling and light/dark appearance.
- **Safety and acceptance:** do not silently rename/delete types or locations used by devices; preserve existing device data, IPAM/rack relationships, backups and offline operation. Test at 100% zoom, with large datasets and on narrow screens, and obtain owner browser acceptance before merge.

**v1.2.0 Device Catalogues — owner-approved scope (19 October 2026):**
- Introduce a dedicated **Device Catalogues** section in the expandable Devices sidebar, with four separate, consistently designed destinations: **Manufacturers**, **Models**, **Software**, and **Server Services**. Keep Device Intelligence and Device Inventory prominent; avoid duplicating catalogue management controls in Add/Edit Device.
- Each catalogue should provide an accessible, searchable list with clear **Add, Edit/Rename, and Remove** actions, helpful empty states, responsive layouts and dark/light-theme parity. Models must support filtering by **device type and manufacturer**; manufacturer suggestions should remain consistent across device types where applicable.
- Distinguish **built-in defaults**, **user-managed catalogue entries**, and **values already used by saved devices**. Permit safe hiding/replacement of built-in suggestions rather than destructive removal of defaults; make it clear which entries are editable.
- Retain **Other / Custom** manufacturer and model inputs in the device form for one-off values. A one-off entry must not silently become a managed catalogue item; reusable options are maintained explicitly through Device Catalogues.
- Bring existing **Manage Software Options** and **Manage Server Services** functionality into the same navigational and visual pattern without dropping existing user-defined options, device-specific selections or stored records.
- **Data safety:** Renaming, hiding or removing a catalogue suggestion must not silently rewrite or erase historical device manufacturer/model values, software flags or server-service values. Clearly communicate impact and confirm destructive changes. Preserve local/offline storage and compatible JSON export/restore, including migration of existing custom hardware catalogue data.
- Deliver incrementally: **(1) Manufacturers and Models**, then **(2) Software and Server Services**, followed by regression tests for custom entry, edit/delete, reopening forms, filtering, backups, offline build and owner browser acceptance. This work was implemented and accepted in the v1.2.0 device catalogue scope.

**Additional device improvements (future candidates, not automatically included in v1.2.0):**
- Preserve dynamic fields for different device types.
- Add contextual Operating System family, version and optional edition selection for applicable device types, with Unknown/None/Custom choices and safe legacy compatibility.
- Continue refining Device Inventory responsiveness, filtering and compact lists as needed.

### v1.2.1+ — v1.2 maintenance releases

**Status: Reserved if needed.** Patch releases address bugs, regressions, compatibility and small maintenance improvements after v1.2.0. Major new functionality belongs in a minor release.

### v1.3.0 — Rack Management Modernisation

**Status: Feature scope frozen for release preparation (21 October 2026); not yet published.** The v1.3.0 branch has passed its automated release suite and owner browser checks for rack workflows and historical backup/mounting compatibility. Publication still requires release-version alignment, documentation review, final acceptance, merge and explicit owner approval. Published v1.2.1 remains unchanged.

**Release scope — Rack Management:**
- Racks navigation, estate-wide overview, inventory and accessories workflows; overview tabs for capacity, equipment, locations and types.
- Rack elevations and front/rear equipment placement, with collision/boundary protection and contiguous-space awareness.
- Flexible rack heights and presets, rack types, optional physical specifications and safe editing/resizing.
- Rack accessories including horizontal/vertical 0U PDUs, ventilation, cable-management and environmental equipment, with existing placement protections.
- Compatibility with historical devices, rack mounting values and JSON backup/restore.

**Release gate:** Confirm actual implemented scope against source and owner acceptance; do not describe proposed functionality as shipped. Run the full release build, offline/browser checks, security/privacy and licence review, and the documentation consistency gate before publication. Do not merge or publish without owner approval.

### v1.4.0 — Data & Architecture Foundations

**Status: Architecture-first design milestone; no storage architecture or implementation selected.**

- Define the product principle: **“Your infrastructure. Without the infrastructure.”** Lite means low installation and operational effort, not artificially limited functionality.
- Evaluate retaining the one-file offline browser experience alongside potential self-hosted and managed deployment models, while avoiding multiple independently maintained applications.
- Audit the existing localStorage schema, storage limits, failure modes, data durability, origin behaviour, and migration/rollback requirements.
- Compare IndexedDB, SQLite-backed local services and PostgreSQL-backed deployments using explicit criteria: operational complexity, data integrity, portability, security, concurrent use and maintenance burden.
- Design a shared domain/data model and storage boundary, versioned migrations, backup/restore and recovery contracts, and a safe proof of concept on a separate development branch.
- Define future multi-user security boundaries (server-side authentication, authorization, audit, tenancy and safe WAN access). The current standalone HTML must **not** be exposed publicly as a secure multi-user service.
- Produce an architecture decision record and owner-approved, realistically sized delivery scope before implementing a migration. Do not assume multi-user hosting or a managed service ships in v1.4.

### v1.5.0 — Advanced IP Addressing, Interfaces & Relationships

**Status: Proposed; dependencies on v1.4 architecture review.**

- Multiple IP addresses per device, optional interface associations and primary management IP.
- Public IP documentation including ISP, circuit and NAT metadata.
- Device upstream/downstream relationships, interface and port records, and shared connection records visible from both devices.

### v1.6.0 — Cabling & Rack Connectivity

**Status: Proposed.**

- Patch panels, cabling, ports and physical endpoints.
- Duplicate endpoint protection and connection tracing.
- Rack diagram exports; investigate SVG, Excalidraw and Visio compatibility.

### v1.7.0 — Advanced Reporting, Search & Topology

**Status: Proposed.**

- Cross-module advanced search and inventory, subnet/IPAM and rack reporting.
- Physical and logical topology based on validated device relationships and cabling records.
- Device navigation, connection tracing and usable diagram layouts.

### v1.8.0 — Network Environments and customer/site addressing scopes

**Status: Provisional research and design milestone; feasibility and Lite product boundaries must be assessed before implementation.**

- **Network Environments / customer isolation (MSP use case):** support independent customer or site addressing scopes above IP Address Blocks, allowing identical IPv4 CIDRs, VLAN IDs and gateway addresses in separate environments while retaining overlap protection within each environment.
- Scope device IPs, reservations, VLAN ownership, lookups, exports and validation by environment; migrate existing single-environment inventory and JSON backups safely.
- Do not enable duplicate ranges until allocation identity and all dependent workflows are environment-aware.
- Distinguish logical separation of records within one local browser inventory from authenticated multi-user/customer security isolation. Lite must not claim secure tenant isolation or hosted MSP access without a separately designed and validated architecture.

### v1.9.0 — Advanced network migration and lifecycle management

**Status: Proposed; planning only**

- Bulk subnet, VLAN and device network migrations with scoped VLAN ownership safeguards.
- Assisted IP reassignment with collision checks, address validation and explicit user approval.
- Guided migration workflows with previews and dry-run validation before changes are applied.
- Historical subnet, VLAN and device IP assignment reporting, subject to a safe and compatible data-history design.
- Network retirement workflows that preserve device inventory and support unassigned-device reassignment.
- Backup/restore compatibility, rollback protections and cross-module regression tests for migration operations.

This milestone is provisional and must not retroactively expand the completed v1.1.0 scope. Basic manual device reassignment and safe subnet/VLAN deletion were part of v1.1 safety work.

### Future investigations

- Shared Suppliers directory for devices, racks and other assets, with optional procurement, warranty and contact information; schedule in a separate future milestone rather than expanding v1.3.

- Offline import options, including potential NetBox compatibility.
- IPv6 capabilities.
- Additional reporting and export formats.

See [Roadmap Design Notes](docs/ROADMAP-DESIGN-NOTES.md) for detailed concepts and compatibility requirements.

## Delivered core scope

- Subnets/CIDR, IPAM, reservations, bulk operations, history, CSV and integrity safeguards.
- Rack workspace with front/rear placement, accessories, drag-and-drop, U sizing and collision prevention.
- Device inventory, types/locations, details and additional server/software options.
- Dynamic dashboard, settings, validated JSON backup/restore and recovery protections.
- Light/dark UI improvements, consistent forms and Safari rack scrolling refinements.
- Offline single-HTML build pipeline and automated checks.

The features above are recorded as delivered. Automated Chromium regression checks have been added for offline startup, local storage recovery, backup rejection and restore, Device/IPAM integrity, rack placement, form labels, modal keyboard behaviour and theme text contrast. **Safari manual acceptance has progressed substantially; owner-reported acceptance and completed publication checks are listed below.**

## Verified automated coverage

- Offline HTML build verification, embedded assets and no outbound HTTP(S) requests in the Chromium smoke test.
- Browser-local inventory persistence, unreadable-storage recovery and recovery-data download.
- Malformed and malicious backup rejection, restore cancellation, rollback on failed restore and successful restore.
- Device/IPAM allocation ownership, subnet membership, record synchronisation and reassignment.
- Rack U-range validation, overlapping placement rejection and separate front/rear faces.
- Failed Device edits and creations roll back without leaving ghost inventory or orphan IPAM records.
- Modal keyboard focus and Escape behaviour, shared light/dark text contrast, and selected Device/Subnet/IPAM field labels and HTML escaping.

These checks are valuable regression coverage, **not** a complete security audit, accessibility certification or replacement for manual browser testing.

## Manual Safari acceptance — owner confirmed, 10 October 2026

- **Stage 1 (5/5):** offline startup, branding, navigation, themes and reopening.
- **Stage 2 (6/6):** subnet creation and suggested gateway, Desktop device creation and next available IP, Device/IPAM name synchronisation.
- **Rack workflows:** mounting-type restrictions confirmed in Safari; Stage 5B rack integrity **5/5** (overlap, capacity, opposite faces, unchanged state after rejection, persistence).
- **Stage 4A (6/6):** JSON export, backup contents, cancelled import and persistence.
- **Stage 4B (7/7):** successful restore, temporary data removed, original inventory/IPAM restored and persisted.
- **Stage 4C (5/6):** malformed JSON rejected, inventory unchanged and persisted; pre-test inventory confirmation was not checked.
- **Stage 4D:** owner confirmed a modified backup was rejected. This is evidence of rejection, but does not independently establish every invalid-structure case.
- **Stage 5A:** owner confirmed rejection of invalid subnet boundary, overlapping subnet, duplicate device IP and out-of-subnet IP; no issue reported.
- **Final Device workflows (6/6):** duplicate, independent IPAM allocation, delete and release IPAM allocation, rack position cleanup and persistence; owner confirmed red Delete button works.
- **Stage 6A — IPAM (7/7):** reservation create/edit/remove, available-address filtering, bulk action and cancellation, integrity/repair, persistence.
- **Stage 6B — Rack workspace (7/7):** accessory add/remove and collision rejection, drag/move and occupied-position rejection, Safari scrolling, persistence (owner reported 8/7, all seven listed checks passed).
- **Stage 7A — Safari usability (7/7):** owner confirmed light/dark readability, keyboard navigation, modal focus/Escape, form validation presentation, narrow-window usability and destructive-action clarity. This is manual acceptance, not formal WCAG certification.

## Completed release gates

- [x] Final private preparation source build green (`be6eac2`, workflow `38063343516`, 10 October 2026), including moved/renamed-file browser restore and verified ZIP.
- [x] Generated HTML operates offline in Safari and retains inventory after reopening.
- [x] Basic Add/Edit Device, next available IP and Device/IPAM synchronisation tested in Safari.
- [x] Rack mounting restrictions and core U integrity tested in Safari.
- [x] JSON export, cancelled restore, successful restore and malformed JSON rejection tested in Safari.
- [x] Core subnet/IPAM invalid-operation rejection tested in Safari.
- [x] Exercise **Duplicate/Delete Device** and confirm linked IPAM/rack records stay consistent.
- [x] Exercise **IPAM reservations, bulk actions and integrity repair**, including cancellation and persistence.
- [x] Exercise **rack accessories, drag-and-drop and scrolling** on Safari; confirm no collision or accidental moves.
- [x] Complete targeted **keyboard navigation**, narrow-window and light/dark visual checks (Stage 7A, 7/7).
- [x] Owner reports VoiceOver works well on the latest Safari preview (10 October); informal acceptance, not a per-step audit or certification.
- [x] Owner confirms backup export, restore into the new version and Safari close/reopen persistence. Moved/renamed-file and shared-storage behaviour are covered by automated Chromium tests and documented; manual Safari rename results were not separately reported.
- [x] Source/main-history privacy review, pinned runtime licence comparison and automated exact ZIP member/hash inspection implemented; see RELEASE-REVIEW.md.
- [x] Prepare complete version-named ZIP and standalone HTML with complete offline licence notices; owner approved publication.
- [x] Owner explicitly approved release version, public repository visibility and publication actions.

Passing these checks supports release readiness; it is not a formal security or accessibility certification.

## Compatibility and project boundaries

**Data compatibility:** Preserve existing browser inventories and supported JSON backup formats. The primary storage key is `caffoot_state`; version 1.0.0 does not automatically migrate legacy test storage. Export and restore JSON backups to retain test data.

**Safe releases:** Keep a known-good standalone HTML build and recommend exporting a JSON backup before upgrading. Validate new builds before publishing them.

### Before Lite v1.0 publication

- [x] Add version metadata to JSON exports and a documented versioned import/migration strategy while retaining compatibility with current valid backups.
- [x] Add automated tests for legacy backups, unsupported future schema versions, malformed metadata and unchanged inventory on rejection.
- [x] Produce an example Lite backup fixture for future import compatibility tests, without real infrastructure or sensitive data.
- [x] Complete release packaging, offline upgrade/restore acceptance and owner publication approval.


## Final private preparation pass — 10 October 2026

Implemented manual release checks and safe update guide, BACKUP-FORMAT.md, populated fictional schema-v1/legacy fixtures, detached non-mutating migration, generated-file upgrade regression test, embedded licence viewer, version-named ZIP with guides/examples and SHA-256 verification. See RELEASE-REVIEW.md for scope and evidence.

Owner opened the latest preview in Safari, reported that the new warning looks good and VoiceOver works well, and explicitly confirmed backup export/restore and reopen persistence. Stable 1.0.0 passed its full automated rerun; owner approval and public publication are complete. See RELEASE-ACCEPTANCE.md for precise evidence scope.


## Publication completed — 10 October 2026

The owner explicitly approved making `caffoot/Caffoot-Lite` public and publishing Caffoot Lite v1.0.0 with the prepared downloads. The owner changed repository visibility to public. The final stable source commit `6f5d38e6959016fb236763f8f7a241de14d23c83` passed the complete automated suite in [workflow 38064002992](https://github.com/caffoot/Caffoot-Lite/actions/runs/38064002992). [Publication workflow 38065143351](https://github.com/caffoot/Caffoot-Lite/actions/runs/38065143351) verified that exact artifact, finalised release-note wording without changing runnable HTML, checked package member hashes and uploaded asset digests, then published the stable release.

[Caffoot Lite v1.0.0](https://github.com/caffoot/Caffoot-Lite/releases/tag/v1.0.0) includes `Caffoot-Lite-1.0.0.zip`, `Caffoot-Lite.html` and `SHA256SUMS`. The tag points to the tested source commit. Earlier private-preparation results below are retained as historical evidence.


## v1.1 VLAN scope and hierarchy — released

**Status:** Released in v1.1.0 on 18 October 2026. Automated subnet hierarchy, deletion, backup and core UI safeguards passed; manual browser, offline and backup/restore acceptance completed.

- Each parent **IP Address Block** is an independent VLAN domain. A VLAN number may be reused in different blocks.
- Within a single block, a VLAN number must be unique among Network / VLAN subnets.
- Legacy networks without a parent share one **Unassigned VLAN Domain** and must not duplicate VLAN numbers there.
- VLAN scope is based on stable parent block IDs, not editable block names.
- CIDR overlap, hierarchy, gateway and data-integrity protections remain independent of VLAN scope.
- The separate VLAN inventory, backup/import validators and legacy ownership migration were updated to support stable VLAN identities scoped to IP Address Blocks.
- Regression coverage includes cross-block reuse, within-block duplicates, unassigned networks, VLAN ownership, backup/import and legacy data.

## v1.2 planned — Network environments

Support separate customer/network environments with independent overlapping CIDRs, VLAN numbers, gateways and environment-aware IP allocations, backups and migration. **Not included in v1.1.0.**

