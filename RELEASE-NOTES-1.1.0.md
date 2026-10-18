# Caffoot Lite v1.1.0 — Release Notes

**Status:** Published 18 October 2026. Automated release checks and manual browser, offline and backup/restore acceptance completed. [Download v1.1.0](https://github.com/caffoot/Caffoot-Lite/releases/tag/v1.1.0).

## Highlights

- **IP Address Block hierarchy:** organise Network / VLAN subnets under parent blocks, with CIDR nesting, boundary, overlap and cycle validation.
- **IPAM Overview and Manage Subnets:** browse block summaries, open a block into a filtered Manage Subnets view, and return to all blocks.
- **Safer subnet editing:** Active Subnet selection and both edit actions respect the chosen block. Empty blocks do not expose an unrelated network. Bulk IP Reservations identifies its target block and subnet without an unrelated parent selector.
- **VLAN ownership:** parent-aware VLAN inventory and legacy ownership reconciliation, including support for an unassigned VLAN domain.
- **Rack workflows:** improved device and rack creation, rack-unit selection, placement and collision safeguards.
- **Safer destructive operations:** subnet deletion previews, protected dependent records, failed-save rollback and additional executable regression coverage.
- **Security and resilience:** expanded output-encoding tests, backup contract tests and restore/reset rollback checks.

## Upgrade and data safety

**Export a JSON backup before upgrading**, and keep it outside the browser. Caffoot Lite stores inventory in browser local storage, not in the HTML file. Opening a renamed or relocated `file://` file may use a different storage scope. Verify the inventory after opening the new version; restore from the saved JSON only when appropriate.

Caffoot Lite remains a standalone, offline HTML application. The source tree uses build-time Tailwind and Font Awesome dependencies; the distributed HTML embeds CSS, icon fonts, branding and licence notices.

## Compatibility and limitations

- Existing supported inventory and backup formats remain in scope for regression testing; backup and restore behaviour was tested during release acceptance.
- **Network environment/customer isolation is not included in v1.1.** Reusing the same IP address across independent customer environments requires a future environment-aware allocation model, planned for v1.2. Do not use overlapping customer networks in one v1.1 inventory.
- This release does not claim a formal security audit or accessibility certification.

## Release verification (completed 18 October 2026)

- [x] Complete local `npm.cmd run release` suite, build verification and package checks.
- [x] Confirm the v1.1.0 version in package metadata and release assets.
- [x] Complete manual browser, offline, backup and restore acceptance checks.
- [x] Review documentation and approve publication.
- [x] Publish GitHub release with ZIP, standalone HTML and `SHA256SUMS`.
- [x] Compare downloaded ZIP with original build: `3FBD5A5050C998D5A49FC834F0E0E13C0C88CFCD9433334777CFEFCA65468239`.
- [x] Compare extracted release HTML with original built HTML: `0D5901373F50A9081AF6211B1D9BA0ED9832374857191983DBE3ACB52C62111C`.

The release was published on 18 October 2026. These verification results do not constitute an independent security certification.
