# Caffoot Lite v2.0.1 — release notes

**Infrastructure, Simplified.** 🦔

Caffoot Lite v2.0.1 is a **release packaging and repository-layout update** to the published [v2.0 Docker/SQLite application](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0). It does not introduce new inventory functionality, database behaviour or user roles.

## What changed

- The Docker application source, backend, tests, Dockerfile, Compose configuration and installer files now live directly in the repository root.
- The temporary `next/` development directory and separate v1.3.3 standalone HTML build tree are absent from this release's source archive.
- Official Portainer installation uses `ghcr.io/caffoot/caffoot-lite:v2.0.1` and the [v2.0.1 stack example](../portainer-v2.0.1.yaml).
- User and developer documentation links reflect the clean v2.0.1 source layout.

## What remains the same

- Devices, IPAM, Network Racks, Change History, accounts, permissions, compulsory MFA for administrator/editor users, shared SQLite data, HTTPS and the approved device editing reservations.
- One-way import of a fresh **published v1.3.3** JSON backup, through administrator-reviewed Settings & Data import.
- Persistent Docker `/data` database and certificates, protected by **external backup/restore** tools.

The standalone HTML edition remains available separately from the [v1.3.3 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3). The earlier [v2.0 tag and its source archives](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0) are preserved unchanged.

## Installation

For Raspberry Pi 5/ARM64 and PC/AMD64, use the tagged image **`ghcr.io/caffoot/caffoot-lite:v2.0.1`** after its official build and publication. Follow the [Docker and Portainer installation guide](../INSTALLATION.md) or copy the [Portainer stack](../portainer-v2.0.1.yaml). Set your own HTTPS address, port and persistent data path. The automatic GitHub source ZIP/tar.gz are source snapshots rather than ready-to-run Docker application downloads.

See the [complete user guides](How%20To's/Features%20and%20Instructions/README.md) and [approved specification](https://github.com/Caffoot/Caffoot-Lite/issues/215).
