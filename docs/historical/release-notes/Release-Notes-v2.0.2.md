# Caffoot Lite v2.0.2 — release notes

**Infrastructure, Simplified.** 🦔

Caffoot Lite v2.0.2 is a **focused security maintenance release** for the established Docker/SQLite application. It builds on v2.0.1 without introducing new inventory features, changing user roles or requiring an inventory data migration.

## What's included

- A narrowly scoped, server-side security correction for authenticated inventory access.
- Regression coverage for the corrected behaviour, alongside existing functional tests.
- Updated Docker image, Portainer stack and version-specific installation guidance.

Detailed security advisory information will be coordinated through [GitHub Security Advisories](https://github.com/Caffoot/Caffoot-Lite/security/advisories) when appropriate. Please continue to [report suspected vulnerabilities privately](../../../SECURITY.md).

## What remains the same

- Existing Devices, IPAM, Network Racks, Change History, users, MFA, permissions and core inventory workflows.
- Persistent SQLite and HTTPS files under the same `/data` mount, with no planned database schema or data migration for this maintenance update.
- One-way import of supported, freshly exported standalone v1.3.3 inventory backups; Docker installation backups remain external.

## Installing or upgrading

**After the v2.0.2 release and image build are published**, use the versioned image `ghcr.io/caffoot/caffoot-lite:v2.0.2` for AMD64 PCs and ARM64 systems including Raspberry Pi 5. For a new installation, use [the v2.0.2 Portainer stack](../portainer/portainer-v2.0.2.yaml) or build from the v2.0.2 source tag using [INSTALLATION.md](../../../INSTALLATION.md).

For an existing v2.0.1 installation, **update the image tag in your existing stack, not the volume or stack identity**. Stop the container and make a verified backup of the original `/data` before upgrading. Preserve both `caffoot.sqlite3` and `tls/`, then confirm the inventory, account sign-in and HTTPS certificate identity after restart. See the [upgrade instructions](../../../INSTALLATION.md#upgrading-an-existing-v201-installation-to-v202).

