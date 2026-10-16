# Caffoot Lite v1.0.2

Adds **Firewall** to the default Device Types list for new inventories. Existing saved custom Device Types are preserved. Fresh Server Options and Software Options remain empty.

## Manual Windows release (no GitHub Actions)

1. Download a fresh source ZIP from the updated `main` branch after merging this PR; extract it.
2. In PowerShell, change to the extracted `app` folder and run `npm.cmd ci --no-audit --no-fund` followed by `npm.cmd run release`. Windows PowerShell ZIP packaging is now supported; Unix zip/unzip are not required on Windows.
3. Confirm the command completes successfully and `app/dist` contains `Caffoot-Lite.html`, `Caffoot-Lite-1.0.2.zip`, and `SHA256SUMS`.
4. Test the HTML in a fresh browser profile: Firewall appears in default Device Types, and Server Options and Software Options start empty. Back up existing inventory before testing upgrades.
5. Create a new GitHub release targeting `main`, tag `v1.0.2`, upload all three files, and mark it latest. Keep v1.0.1 available.

The sample JSON files included in the ZIP are optional fixtures and are not automatically loaded into the application.
