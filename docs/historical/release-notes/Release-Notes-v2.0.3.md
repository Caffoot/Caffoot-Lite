# Caffoot Lite v2.0.3 — release notes

**Infrastructure, Simplified.** 🦔

Caffoot Lite v2.0.3 is a small maintenance release for the established Docker/SQLite application. It builds on the published v2.0.2 security correction, without introducing new inventory features or requiring a database migration.

## What changed

- The **About Caffoot Lite** page identifies the correct v2.0.3 application version.
- The Development Guide's **Function Index** was refreshed to 494 named entries, including the history-permissions module introduced in v2.0.2.
- Existing browser regression checks now cover **Rack front/rear switching and printing** and **virtual-machine host selection**.
- The full user guides have a clearer home at [docs/how-tos/features-and-instructions](../../how-tos/features-and-instructions/README.md). The previous guide paths remain available and are checked against the new copies, so existing v2.0.2 installations retain working links.
- Installation instructions, the Portainer example and developer documentation have been updated for this release. Old release records stay available as history.

## What stays the same

- Existing Devices, IPAM, Racks, Change History, users, permissions, MFA and inventory workflows.
- The Docker/SQLite architecture, database format, server-side security checks and supported platforms.
- The existing `/data` volume or host-directory mapping, containing the inventory database and HTTPS certificates. **Do not replace that mapping during an upgrade.**
- One-way import of supported published v1.3.3 standalone JSON backups; ongoing Docker backups remain an external responsibility.

## Installing or upgrading

Only **after** the v2.0.3 GitHub Release and Docker image have been separately approved, built and published, use `ghcr.io/caffoot/caffoot-lite:v2.0.3` on AMD64 or ARM64. For a new installation, see the [v2.0.3 Portainer example](../portainer/portainer-v2.0.3.yaml) and [installation guide](../../../INSTALLATION.md).

For an existing installation, first stop the application and make a verified external backup of **all** persistent `/data` files, including `caffoot.sqlite3` and `tls/`. Update **only the image tag in the same stack**, keeping the existing volume or bind mount, address and port. Verify sign-in, inventory and the HTTPS certificate identity afterwards. Never create a replacement empty data volume to upgrade.

Read the [upgrade instructions](../../../INSTALLATION.md#upgrading-an-existing-v202-installation-to-v203) before changing a live system. The original v2.0.1 → v2.0.2 upgrade section remains available for older release links.

## Release verification

These notes are prepared **before publication**. A merged PR and passing source checks are not a published release. Confirm the final release gate, actual test results, AMD64/ARM64 image publication and public GHCR access before advertising v2.0.3 as downloadable. A separate product-owner decision is required for the release tag, Docker publication and any website update.

For security concerns, please [report privately](../../../SECURITY.md).
