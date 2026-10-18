# Caffoot Lite v1.1.0 — Release Candidate Notes

**Status:** Pre-release candidate. Not published; requires final automated checks, manual backup/restore acceptance and owner approval.

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

- Existing supported inventory and backup formats remain in scope for regression testing; successful restoration must be confirmed in the final release acceptance pass.
- **Network environment/customer isolation is not included in v1.1.** Reusing the same IP address across independent customer environments requires a future environment-aware allocation model, planned for v1.2. Do not use overlapping customer networks in one v1.1 inventory.
- This release does not claim a formal security audit or accessibility certification.

## Final release gates

- [ ] Run the complete local `npm.cmd run release` suite and inspect the generated package.
- [ ] Confirm the v1.1.0 version appears consistently in About, package metadata and release assets.
- [ ] Test JSON export, cancelled import, successful restore and browser persistence using disposable test inventory.
- [ ] Verify the standalone HTML offline in Edge and review representative modal and IPAM workflows.
- [ ] Review documentation and owner approval before merging or publishing.

**Do not publish or merge solely on the basis of this draft.**
