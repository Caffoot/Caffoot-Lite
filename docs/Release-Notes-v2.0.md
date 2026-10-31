# Caffoot Lite v2.0 — release notes (prepared, not yet published)

**Infrastructure, Simplified.**

Caffoot Lite v2.0 brings the familiar network inventory from the published standalone HTML edition into a Docker-hosted, shared SQLite application. It is intended for home labs and small teams, including Raspberry Pi 5 installations.

## What's new in v2.0

- **Shared central inventory:** Devices, IPAM, racks, options and Change History use SQLite on the application server rather than browser-local inventory storage.
- **Administrator and user accounts:** The first sign-in sets up the administrator. Administrators create users and grant approved read/edit access to Devices, IPAM and Racks.
- **Multi-factor authentication:** Required for administrator and editing access, with established account setup and sign-in workflows.
- **Simultaneous use:** Authorised users can view the shared inventory and work on different devices. The existing device editing reservation prevents competing edits of the same device.
- **Docker/Portainer deployment:** HTTPS application for Linux/AMD64 and ARM64 installations, with straightforward Compose and Raspberry Pi 5 setup and persistent `/data` storage.

## Familiar inventory, unchanged

Devices, IPAM, Network Racks, Change History, managed lists, existing records, field types, validations, confirmation steps, migration reviews and established inventory safeguards retain the published v1.3.3 experience except for the explicitly approved authentication, database and multi-user adjustments in [#215](https://github.com/Caffoot/Caffoot-Lite/issues/215).

## Moving from v1.3.3

Import **a fresh JSON backup exported by published Caffoot Lite v1.3.3** using **Settings & Data → Import Inventory** after creating your administrator account. Review and explicitly confirm the replacement. Earlier standalone versions must first be upgraded to v1.3.3. Migration is **one-way**; it does not transfer user accounts or make ongoing JSON backups of the Docker installation.

## Protecting your data

Keep the persistent `/data` directory: it contains `caffoot.sqlite3` and HTTPS certificate material. Use a trusted **external** container, volume or file backup solution and verify restore procedures. No built-in ongoing Docker JSON backup/restore is provided. Protect the host, use trusted HTTPS, and follow the [installation guide](../next/README.md).

## Get started

- [Installation and HTTPS instructions](../next/README.md)
- [Versioned v2.0 Portainer installation stack](../next/portainer-v2.0.yaml) — available when the official image is published
- [Complete Features and Instructions](How%20To's/Features%20and%20Instructions/README.md)
- [Approved specification](https://github.com/Caffoot/Caffoot-Lite/issues/215)
- [Release acceptance evidence](https://github.com/Caffoot/Caffoot-Lite/issues/218)

**Release status:** v2.0 is approved as the intended version; the final public tag, versioned image and live website announcement are prepared separately under the Stage 8 release gate. The published standalone v1.3.3 release remains available.
