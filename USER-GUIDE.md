# Caffoot Lite — User Guide

**Infrastructure, Simplified. — For HomeLabs and Small Teams**

This guide covers the main workflows. Button names and layouts may change slightly before v1.0 is finalised.

## Getting started

Download and open the standalone HTML file following [INSTALLATION.md](INSTALLATION.md). Caffoot Lite runs locally in your browser and does not require a server.

### 1. Add a subnet

Open **Subnets**, create a subnet using a valid network/CIDR (for example, `192.168.10.0/24`), review the proposed gateway address, and save. Confirm the network and gateway are correct for **your** environment; an automatically suggested gateway is not a substitute for checking your router configuration.

### 2. Add a device

Open **Devices** and choose the add-device action. Enter the device details, choose a **Type** and **Location**, and select an IP address belonging to an existing subnet. Where offered, use **Next Available IP** to suggest a free address, then verify it before saving. If the subnet does not exist, create it first using the available subnet-creation flow.

If the device is **Rack Mounted**, enter its rack/U requirements and review placement; otherwise choose **Desktop** where appropriate. Save and confirm that the device appears in inventory and that IPAM reflects its address.

### 3. Manage IP addresses

Use **IPAM** to inspect allocations and reservations, identify available addresses, and manage entries. Check the subnet and any existing reservation before assigning an address. After editing or deleting a device, verify that its IPAM record has been updated accordingly.

### 4. Work with racks

Open **Racks** to add or manage a rack. Check available U positions before placing equipment. For rack-mounted devices, review U height and front/rear placement; avoid overlaps with other devices and accessories. Verify placement visually after dragging or editing an item.

### 5. Types, locations and device details

Use the managed options/settings areas to maintain device types and locations. Select meaningful values when adding devices. Certain built-in options, such as **Racked**, have special behaviour and should not be treated as ordinary disposable labels.

### 6. Dashboard

The **Dashboard** summarises inventory and network information based on your locally saved data. If it appears empty, add a subnet and some devices, then return to the dashboard.

## Back up, restore and reset

### Export a backup

In **Data Management**, choose the JSON export/backup action and save the resulting `.json` file in a safe location. Make backups regularly and especially before any upgrade or reset.

### Restore a backup

In **Data Management**, choose the restore/import action and select a JSON backup previously exported by the application. Read any validation or replacement warning carefully. Restoring may replace the current inventory, so **export the current data first**. After restoration, verify device counts, subnets, racks and IPAM.

### Reset to a clean start

The **reset/clean start** operation is destructive: it replaces local inventory and related settings. Export a backup first, read the warning and proceed only if you intend to discard the current local state. If the reset loads starter data, review it before adding your own assets.

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

In Settings & Data → Data Management, use **Check for updates** to check the latest published stable release. This is a manual online check; it does not send inventory or install anything. While the repository is private or no release has been published, no public release is available.

1. Download a JSON backup from your current version.
2. Keep the old HTML and download the new `Caffoot-Lite.html` into a separate folder from the [official releases](https://github.com/sdelnevo/Caffoot-Lite/releases).
3. Open the new file in your usual browser. Saved data may be unavailable after moving or renaming a file.
4. If needed, choose your backup in Settings & Data and review the replacement summary before restoring.
5. Verify devices, IPAM, subnets and racks. Keep the old HTML and backup until satisfied.

The safe update guide and backups work offline. Newer backup schemas require a compatible app; retain your original backup for recovery.

### Local file storage scope

The upgrade test observed shared browser storage across original and renamed HTML paths in the CI Chromium profile. Do not assume separate folders protect separate inventories: restoring in a new copy can change data visible in the old copy. Other browsers may isolate paths. Keep an exported JSON backup outside the browser; use a separate browser profile for isolated test inventories. The test asserts restoration and persistence according to the observed scope instead of assuming isolation.
