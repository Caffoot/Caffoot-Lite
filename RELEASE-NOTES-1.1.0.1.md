# Caffoot Lite v1.1.0.1 — Update Checker Hotfix

Maintenance release fixing the manual GitHub release check when a published release tag uses uppercase `V` (such as `V1.1.0`).

- Accepts uppercase and lowercase `v` prefixes in release tags.
- Supports four-component maintenance versions in update comparisons and release packaging.
- Adds regression tests for release version ordering.
- No changes to inventory data or schema.

## Upgrade safely

Export a JSON backup before opening a new application file. Keep the previous HTML file and backup until you have checked your inventory in the new version. Do not clear browser storage. Updates remain manual; the application runs offline.

Official releases: https://github.com/Caffoot/Caffoot-Lite/releases
