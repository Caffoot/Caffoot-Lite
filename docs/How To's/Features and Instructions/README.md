# Caffoot Lite — Features and Instructions

Welcome to the Caffoot Lite user guides. These step-by-step instructions cover the Docker/SQLite edition currently being prepared for release. Its established inventory screens and safeguards follow the published v1.3.3 application, while its accounts and shared database are new.

The guides describe the **real application**, use fictional examples and distinguish viewer and editor permissions. They are maintained here as the single source for GitHub and the future website's help section. The separate [Development Guide](../../Development%20Guide/README.md) explains the implementation for developers.

## Find your guide

| Guide | What you will learn |
| --- | --- |
| [Getting Started](Getting-Started.md) | First sign-in, navigation, a useful order for entering inventory, and common first questions |
| [Devices](Devices.md) | Create, duplicate, view, edit and retire equipment; record network, hardware, location and mounting |
| [IPAM](IPAM.md) | Create address blocks and Network/VLAN subnets, manage individual IPs, notes and reservations |
| [Racks](Racks.md) | Set up enclosures, mount devices, use front/rear faces and handle accessories |
| [Settings and Change History](Settings-and-Change-History.md) | Find personal versus administrator settings, and understand recorded changes |
| [Users, Permissions and MFA](Users-Permissions-and-MFA.md) | Create accounts, assign read/edit rights and enrol authentication |
| [Migration, Backup and Restore](Migration-Backup-and-Restore.md) | Import published v1.3.3 inventory and protect/restore persistent Docker data |

## A sensible order for building your inventory

1. Complete first-administrator setup and MFA.
2. Add your **Network / VLAN** subnets in **IPAM**. Devices select primary addresses from recorded networks.
3. Add **Network Racks** if you have rack-mounted equipment, and establish any needed device types and locations.
4. Add **Devices**, their primary IPs, and optional rack positions.
5. Review the result across Devices, IPAM, Racks and **Change History**.
6. If colleagues will use the system, create their accounts and explicitly grant section access.

The detailed [Docker/Portainer installation instructions](../../../INSTALLATION.md) are separate from everyday feature guidance.

## How the shared application behaves

- **Central data:** inventory changes are stored on the server in SQLite, not as authoritative records in your browser.
- **Fresh views:** navigation and opening records obtain recently saved information. An already-open view does not automatically update every second.
- **Editing reservations:** one user may edit a particular device at a time; viewing is still possible for others. Save or Cancel releases the reservation, and abandoned reservations expire.
- **Read and Edit:** access is controlled independently for Devices, IPAM and Racks. Editing a related IP or rack position can need permission in both areas.
- **No built-in ongoing database backup:** JSON import from published v1.3.3 is for *one-way migration*; use external backups for the running Docker database.

## Help inside Caffoot Lite

All signed-in users can open **My account → Help & Guides** for short built-in help without a public Internet connection. Each topic can also open its longer **Read full guide** in a separate browser tab. The documentation link requires access to GitHub; normal local inventory work does not.

**Release history:** v2.0 introduced the Docker/SQLite edition; v2.0.1 preserves that application while cleaning the published source layout. The standalone [v1.3.3](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3) release remains available for one-way JSON migration.