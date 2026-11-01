# Caffoot Lite v2.0.1

**Infrastructure, Simplified.** Free, open-source IPAM, device inventory, network rack documentation and Change History for home labs and small IT teams.

Caffoot Lite v2.0.1 is the Docker/SQLite, multi-user edition of Caffoot Lite, built from the approved v2.0 functionality. It uses a **central SQLite database**, first-run administrator setup, mandatory MFA for administrators and editors, administrator-managed permissions, and simultaneous authenticated inventory access. Familiar v1.3.3 Devices, IPAM, Racks and Change History workflows are preserved.

The repository root contains the Docker application's source: `backend/`, `inventory.html`, `setup.html`, `assets/`, `Dockerfile`, `compose.yaml`, `tests/` and documentation. The old `next/` development folder and the standalone HTML build copy are **not part of the v2.0.1 source archive**. The original standalone version remains separately available in the [published v1.3.3 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3).

## Install Caffoot Lite

**Official Docker image:** `ghcr.io/caffoot/caffoot-lite:v2.0.1` (Raspberry Pi 5 ARM64 and PC AMD64).

Before installing, confirm the [v2.0.1 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.1) and container build are published and the image is publicly accessible. This is a Docker application: **GitHub's automatic source-code ZIP and tarball are not the Docker installation package.**

For Portainer, copy [`portainer-v2.0.1.yaml`](portainer-v2.0.1.yaml) into **Stacks → Add stack → Web editor**, adjust your server address, port and persistent data folder, and deploy. For Docker Compose builds from source, use [`compose.yaml`](compose.yaml) and [`Dockerfile`](Dockerfile) at the repository root.

**Read the [installation and HTTPS guide](INSTALLATION.md)** for complete Portainer/Docker Compose steps, initial administrator setup, MFA, reverse proxy, certificate trust and data backups. No public registration is offered.

## Features

- **Devices:** track hardware, software, physical and virtual systems, historical/custom fields and relationships.
- **IPAM:** document IPv4 blocks, subnets, VLANs, gateways, reservations and device address allocations.
- **Network Racks:** visualise cabinets, front/rear mounting positions, rack units and accessories.
- **Shared inventory:** multiple users, section-based read/edit permissions, authenticated changes and temporary device editing reservations.
- **Management:** administrator-controlled user accounts, MFA and familiar Change History.

![Caffoot Lite dashboard showing example network inventory](docs/screenshots/dashboard.png)

See the [complete Features and Instructions user guides](docs/How%20To%27s/Features%20and%20Instructions/README.md) for detailed examples, controls and screenshots.

## Migrating your standalone inventory

Export a fresh JSON backup using **published Caffoot Lite v1.3.3**. Users of earlier standalone HTML editions must first upgrade to v1.3.3. After setting up your v2.0.1 administrator account, go to **Settings & Data → Import Inventory**, review the proposed replacement and confirm it. This is a **one-way migration**, not a routine database backup. It does not replace user accounts, MFA or permissions.

## Backups and HTTPS

The authoritative database and HTTPS certificate material live under the persistent Docker `/data` mount (`caffoot.sqlite3` and `tls/`). Keep this directory when restarting or recreating the container. Back it up with trusted **external** Docker/volume/file backup tools; for a manual consistent copy, stop the container first. Keep securely protected backups away from the host and verify that they can be restored. No in-app ongoing Docker JSON backup/restore is provided.

For direct HTTPS, verify and trust the application certificate before entering credentials. Configure reverse proxies for HTTPS upstream connections, trusted certificates and restricted exposure of the published Docker port. See [INSTALLATION.md](INSTALLATION.md).

## Documentation

- [Installation, HTTPS, Portainer and backup instructions](INSTALLATION.md)
- [v2.0.1 release notes](docs/Release-Notes-v2.0.1.md)
- [Detailed user guides and screenshots](docs/How%20To%27s/Features%20and%20Instructions/README.md)
- [Contributing To Caffoot Lite — mandatory naming, UI and documentation standards](CONTRIBUTING.md)
- [Development Guide](docs/Development%20Guide/README.md)
- [Standalone v1.3.3 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3)
- [Historical v2.0/v2.0.1 implementation specification #215](https://github.com/Caffoot/Caffoot-Lite/issues/215) and [release tracker #218](https://github.com/Caffoot/Caffoot-Lite/issues/218); [future ideas #222](https://github.com/Caffoot/Caffoot-Lite/issues/222) (discussion only)

**Version history:** [v2.0](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0) introduced the Docker/SQLite multi-user edition. v2.0.1 preserves its functionality while moving the Docker source to the root and excluding the legacy standalone build tree from this release's source archive.
