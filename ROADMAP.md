# Caffoot Lite — Development Roadmap

**Updated:** 19 October 2026  
**Current milestone:** v1.1.2 (security hardening and deployment guidance) published on 19 October 2026 following automated validation, owner browser acceptance, PR #44 merge and verified release packaging. Next proposed milestone: v1.2.0.  
**Repository:** `caffoot/Caffoot-Lite` (public)  
**Release policy:** Publish publicly only after manual verification, security/privacy review and owner approval.

**Current stable release:** [v1.1.2](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.1.2). v1.1.0.1 is a historical hotfix.

Caffoot Lite is an offline, standalone single-HTML network inventory and IP address management application. v1.1.2 is the published stable release as of 19 October 2026; older versions remain available as historical releases.

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

**Status: Planning; scope may be split into smaller milestones**

- Wider, responsive, tabbed Add Device and Edit Device forms with shared behaviour.
- Preserve dynamic fields for different device types.
- Add contextual Operating System family, version and optional edition selection for applicable device types, with Unknown/None/Custom choices and safe legacy compatibility.
- Refresh Device Inventory screens using the same responsive visual language as v1.1 IPAM, with clear summaries, useful filtering and compact, scalable device lists.
- **Network Environments / customer isolation (MSP use case):** support independent customer or site addressing scopes above IP Address Blocks, allowing identical IPv4 CIDRs, VLAN IDs and gateway addresses in separate environments while retaining overlap protection within each environment. Scope device IPs, reservations, VLAN ownership, lookups, exports and validation by environment; migrate existing single-environment inventory and JSON backups safely. Do not enable duplicate ranges until allocation identity and all dependent workflows are environment-aware.
- Multiple IP addresses per device, optional interface associations and primary management IP.
- Public IP address documentation, including relevant ISP, circuit and NAT metadata.
- Flexible rack heights and presets, Wall Mounted / Free Standing / Open Frame types, optional depth and safe resizing.
- Expand optional rack details: manufacturer, model, serial number, asset tag, width/depth, location and free-standing base configuration (casters, levelling feet and/or anchored).
- Extend existing rack accessories with PDUs (horizontal rack-mounted and vertical 0U), fan/ventilation panels, vertical cable managers and environmental sensors; preserve existing accessories and collision safeguards.
- Cross-module advanced search and initial inventory, subnet/IPAM and rack reporting.

### v1.3 — Device relationships and interfaces

**Status: Proposed**

- Device relationships and upstream/downstream links.
- Interface and port records, with optional IP associations.
- Shared connection records visible from both connected devices.

### v1.4 — Cabling and rack connectivity

**Status: Proposed**

- Patch panels, cabling, ports and physical endpoints.
- Duplicate endpoint protection and connection tracing.
- Rack diagram exports; investigate SVG, Excalidraw and Visio compatibility.

### v1.5 — Network topology

**Status: Proposed**

- Physical and logical topology generated from existing relationship and cabling records.
- Device navigation, connection tracing and usable diagram layouts.

### v1.6 — Advanced network migration and lifecycle management

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

