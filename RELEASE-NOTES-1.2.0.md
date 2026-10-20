# Caffoot Lite v1.2.0 — Release Notes

**Status:** Release candidate under verification; not yet published.
**Release focus:** Devices & Intelligence.

## Highlights

- Wider, responsive five-tab Add/Edit Device forms covering General, Hardware, Software & Firmware, Networking and Notes, with improved field layouts and unsaved-change safeguards.
- Expanded Devices navigation and Device Intelligence overview with inventory summaries, distributions, missing-data indicators and drill-down filtering based on locally stored records.
- Improved Device Inventory, Device Types and Locations workspaces, with clearer management and navigation.
- Device Catalogues for Manufacturers, Models, Software and Server Services, with safe handling of managed suggestions, existing assignments and archived entries.
- Refined device-type mounting choices, including server Tower / Floor Standing support and compatibility with historical values.
- Improved separation of device software assignments and server-service selections; operating-system and device overview reporting refinements.
- Offline-first standalone HTML distribution retained. No telemetry, live device status monitoring or hosted multi-user features are introduced.

## Compatibility and data safety

Inventory continues to be stored in the browser's local storage, not in the HTML file. **Export a JSON backup before upgrading, moving or renaming the HTML, switching browsers or resetting data.** Keep the old working release and backup until the new version has been verified. Local `file://` storage isolation varies between browsers and paths.

Existing supported JSON backup formats and historical inventory records are intended to remain compatible. Do not expose the standalone HTML application directly to the public internet: Lite has no built-in authentication, role-based access control or secure multi-user isolation.

## Verification status

- 27 applicable automated regression checks passed during development and pre-release testing.
- Standalone HTML build and embedded-asset verification passed before the version bump.
- Owner confirmed offline browser navigation and themes, redesigned Device forms, unsaved-change protection, Software Catalogue and Server Services workflows, archive/restore behaviour, and disposable-data JSON export, cancelled restore, completed restore and reopen persistence.
- **Still required before publication:** final v1.2.0 versioned build, complete automated release pipeline, targeted Device/IPAM/Rack integrity review, documentation consistency/security/privacy checks, ZIP and SHA-256 verification, and explicit owner approval of the final candidate.

This is owner-reported acceptance and automated regression evidence, not a formal security or accessibility certification.

## What's next

Rack Management Modernisation, multiple IP addresses per device, public-IP documentation and cross-module reporting are proposed for v1.3.0, not included in v1.2.0. Network Environments/customer addressing scopes are provisionally planned for v1.7.0, subject to feasibility and safe migration design.
