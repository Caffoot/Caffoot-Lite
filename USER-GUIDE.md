# Caffoot Lite — User Guide

**Infrastructure, Simplified. — For HomeLabs and Small Teams**

This guide covers the published v1.2.x Devices & Intelligence functionality and the upcoming v1.3.0 rack-management workflows (not yet published), with relevant information for users upgrading from earlier releases. The redesigned Settings & Data interface was introduced in v1.1.1, with security hardening in v1.1.2.

## v1.2.0 Devices & Intelligence

v1.2.0 adds **Devices → Overview** for local inventory charts and drill-downs; **Device Inventory**, **Device Types** and **Locations** for distinct management views; and **Device Catalogues** for **Manufacturers**, **Models**, **Software** and **Server Services**. The wider Add/Edit Device form has five tabs: **General**, **Hardware**, **Software & Firmware**, **Networking** and **Notes**. Server Services are managed separately from software assignments. Archived catalogue entries are retained for historical device records, with restoration where offered. Always verify saved assignments after changing a catalogue entry.

## Getting started

Download and open the standalone HTML file following [INSTALLATION.md](INSTALLATION.md). Caffoot Lite runs locally in your browser and does not require a server.

### 1. Add a subnet

Open **IPAM → Manage Subnets**, create an **IP Address Block** (for example, `192.168.0.0/16`), then add a **Network / VLAN** subnet within it (for example, `192.168.10.0/24`). Review the proposed gateway address and save. Each block is a separate VLAN-number scope, but overlapping customer networks are not yet supported in one inventory. Use **IPAM Overview** to open a block in a filtered Manage Subnets view; the Active Subnet dropdown and edit actions stay within that block. Confirm the network and gateway are correct for **your** environment; an automatically suggested gateway is not a substitute for checking your router configuration.

### 2. Add a device

Open **Devices → Device Inventory** and choose the add-device action. Enter the device details, choose a **Type** and **Location**, and select an IP address belonging to an existing subnet. Where offered, use **Next Available IP** to suggest a free address, then verify it before saving. If the subnet does not exist, create it first using the available subnet-creation flow.

If the device is **Rack Mounted**, enter its rack/U requirements and review placement; otherwise choose the appropriate non-rack mounting option. For access points, the available choices include **Tabletop / Shelf Mounted**, **Ceiling Mounted**, **Wall Mounted**, and **Pole Mounted**. Save and confirm that the device appears in inventory and that IPAM reflects its address.

### 3. Manage IP addresses

Use **IPAM** to inspect allocations and reservations, identify available addresses, and manage entries. **Bulk Edit Range** identifies the active subnet and its parent block; verify that context before applying changes. Check the subnet and any existing reservation before assigning an address. After editing or deleting a device, verify that its IPAM record has been updated accordingly.

### 4. Work with racks

In the **v1.3.0 development build**, expand **Network Racks** in the sidebar. **Rack Overview** shows inventory-based capacity, equipment, location and type summaries; **Rack Inventory** lets you search, add and open individual racks; **Rack Accessories** manages rack accessories. These summaries are not live monitoring. In a rack detail view, inspect front/rear elevations and available U positions before placing equipment. For rack-mounted devices, review U height and placement; avoid overlaps with devices and accessories. A 0U accessory does not occupy numbered rack units. Verify placement visually after dragging or editing an item, and review any rack-resize warnings before saving. The published v1.2.1 interface may use older navigation labels.

### 5. Types, locations and device details

Use **Devices → Device Types** and **Devices → Locations** to review and manage classifications and locations. Select meaningful values when adding devices. Certain built-in options, such as **Racked**, have special behaviour and should not be treated as ordinary disposable labels.

### 6. Dashboard

The **Dashboard** summarises inventory and network information based on your locally saved data. If it appears empty, add a subnet and some devices, then return to the dashboard. In v1.1.1, **Inventory Health** checks known inconsistencies across saved devices, IPAM, subnets, VLANs and rack assignments. A healthy result does not verify backup availability, browser storage safety or live network reachability.

## Settings & Data (v1.1.1)

The Settings tabs are **Data Management**, **Preferences**, **Help & Guides**, and **About Caffoot Lite**.

Open **Settings & Data** for **Data Management**, **Preferences**, **Help & Guides**, and **About Caffoot Lite**. These tabs are available in v1.1.1, v1.1.2 and v1.2.0; older releases may have different labels and placement.

### Data Management — Back Up & Restore

- **Download Backup** exports your inventory as a JSON file. Save it somewhere secure outside the browser; this is a manual backup, not automatic synchronisation.
- **Choose Backup File** selects a previously exported JSON file. Review the validation and replacement confirmation carefully. When restoring an older backup, review any access-point mounting conflicts and confirm any legacy desktop/laptop rack-mount corrections before the final replacement confirmation. Cancelling a review leaves the active inventory unchanged. A restore **replaces** the active inventory; it does not merge records. Download a fresh backup before restoring and verify devices, IPAM, subnets and racks afterwards.

### Data Management — Maintenance & Safety

- **Inventory Safety Check** checks inventory consistency; it is not a network scan or a guarantee that browser storage is backed up.
- **Check for Updates** performs a manual online check for the latest published stable release. The status area explains when the check is idle, running, offline, successful or unavailable. It does not upload inventory or install an update.
- **Safe Update Guide** explains how to back up data, keep the previous HTML file and verify the replacement. The guide and backup features work offline; checking releases requires internet access.

### Data Management — Advanced Recovery

- **Download Safety Snapshot** is available only when a recovery snapshot has been created by a restore or clean start. The button is disabled when no snapshot exists. A snapshot is a temporary local safeguard, **not** a substitute for an exported backup.
- **Clear System** is destructive and replaces local inventory and related managed options with a clean start. Export a backup, read the confirmation and proceed only if you intend to discard the current inventory. Test destructive workflows with disposable data in a separate browser profile.

### Preferences

Choose **Light Mode**, **Dark Mode** or **Use System Setting**. The system option follows the browser/operating-system colour preference as it changes. Appearance preferences are local to the browser and are not included in inventory JSON backups.

### Help & Guides

The built-in offline reference has expandable topics for getting started, IPAM, devices, racks, backups, updates, appearance, inventory health and troubleshooting. It is updated as application workflows change. The complete online User Guide remains available for further detail.

### About Caffoot Lite

Displays the official Caffoot branding, installed application version, a pointer to offline Help & Guides, and links to the official repository, User Guide, Installation Guide and GitHub release notes. **Software Licences** opens bundled third-party notices, including when offline. External GitHub links require an internet connection.

## Data safety and privacy

- Inventory is held in the browser's **local storage**, not inside the HTML file.
- Data is **not automatically synchronised** between browsers or computers.
- Moving or renaming the HTML file, using another browser profile, or clearing browser data may make stored inventory unavailable.
- Keep JSON backups outside browser storage, preferably with an additional safe copy.
- Treat backups as sensitive: they may contain internal IP addresses, device names, locations and other infrastructure information.
- The HTML is designed to run offline. A successful automated build check does not replace testing your browser's file-storage behaviour.

## Quick checks after an update

1. Confirm the dashboard opens and the existing inventory is visible (or restore a backup).
2. Add/edit a test device and verify the corresponding IPAM entry.
3. Check subnet address suggestions and reservations.
4. Check rack placement and occupied U positions.
5. Export a backup and verify it can be restored to a test inventory.

For download instructions and troubleshooting, see [INSTALLATION.md](INSTALLATION.md).


## Updating safely

In Settings & Data → Data Management, use **Check for Updates** to check the latest published stable release. This is a manual online check; it does not send inventory or install anything. Use the [latest stable release](https://github.com/caffoot/Caffoot-Lite/releases/latest) to see the current published version.

1. Download a JSON backup from your current version.
2. Keep the old HTML and download the new `Caffoot-Lite.html` into a separate folder from the [official releases](https://github.com/caffoot/Caffoot-Lite/releases).
3. Open the new file in your usual browser. Saved data may be unavailable after moving or renaming a file.
4. If needed, choose your backup in Settings & Data and review the replacement summary before restoring.
5. Verify devices, IPAM, subnets and racks. Keep the old HTML and backup until satisfied.

The safe update guide and backups work offline. Newer backup schemas require a compatible app; retain your original backup for recovery.

### Local file storage scope

The upgrade test observed shared browser storage across original and renamed HTML paths in the CI Chromium profile. Do not assume separate folders protect separate inventories: restoring in a new copy can change data visible in the old copy. Other browsers may isolate paths. Keep an exported JSON backup outside the browser; use a separate browser profile for isolated test inventories. The test asserts restoration and persistence according to the observed scope instead of assuming isolation.
