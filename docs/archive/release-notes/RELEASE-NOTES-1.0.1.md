# Caffoot Lite v1.0.1

Maintenance release: fresh installations start with empty Server Options and Software Options. Existing saved custom options remain intact.

## Manual release without GitHub Actions

1. Before merging, temporarily disable the existing Build Caffoot Lite standalone HTML workflow in GitHub Actions; changes under app/ normally trigger it. Re-enable when your allowance resets.
2. On a local computer with Node.js 24, npm, zip and unzip, check out updated main and run: `cd app && npm ci --no-audit --no-fund && npm run release`.
3. Test in a fresh browser profile. Verify both managed option lists are empty, and newly added options survive refresh. Test backup/restore and upgrading separately.
4. Create a GitHub release targeting the merged commit, tag v1.0.1, and manually upload app/dist/Caffoot-Lite.html, app/dist/Caffoot-Lite-1.0.1.zip and app/dist/SHA256SUMS.
5. Set v1.0.1 as latest. Retain v1.0.0 for existing users.

Do not rerun publish-v1.0.0.yml; it is pinned to the original build.

Note: example JSON fixtures in the ZIP are not automatically imported into the app. Inventory is stored in browser local storage; export backups before upgrading.
