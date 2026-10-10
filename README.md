# Caffoot Lite

**Infrastructure, Simplified.**  
*For HomeLabs and Small Teams*

A lightweight, standalone network inventory and IP address management (IPAM) application for devices, subnets, racks and network assets.

> **Status:** v1.0.0 release candidate preparation. The repository is private and no stable public release has been approved yet.

## ⚠️ Important — your inventory lives in your browser

**Caffoot Lite does not save your devices, IP addresses, racks or settings inside `Caffoot-Lite.html`.** Your inventory is stored in the **local storage of the browser you use to open it**. There is no server, automatic cloud backup or automatic synchronisation.

**If browser/site data is cleared, your inventory may be permanently lost.** Changing browser or profile, or moving/renaming the HTML file, can also make existing data inaccessible because `file://` storage varies between browsers.

**Export a JSON backup regularly, and ALWAYS before upgrading, moving, renaming or resetting Caffoot Lite.** Store backups somewhere safe outside the browser and verify you can restore them. Backups may contain sensitive infrastructure details.

## Download and run

When the first stable GitHub Release is published:

1. Open this repository's **Releases** page.
2. Under the latest stable release, expand **Assets**.
3. Download **`Caffoot-Lite.html`** (not the source-code ZIP).
4. Open it in a modern browser. No Docker, Node.js or web server is required to run the release file.

**A public download is not available yet.** See the detailed [installation and upgrade guide](INSTALLATION.md) for the complete process and storage precautions.

## What you can manage

- **Devices:** inventory, types, locations and device details.
- **Subnets and IPAM:** CIDR networks, addresses, reservations and allocation workflows.
- **Racks:** rack layouts, equipment placement and U-space management.
- **Dashboard:** inventory overview.
- **Data Management:** validated JSON backup/restore and reset/recovery tools.
- **Offline use:** a single HTML file with bundled styling, fonts and branding assets.

See the [user guide](USER-GUIDE.md) for the first-run walkthrough and day-to-day tasks.

## Important: protect your data

Caffoot Lite stores inventory in your **browser's local storage**, not in the HTML file or on a server. Browser `file://` storage behaviour varies: changing browser, profile, path or filename may prevent the new file from seeing existing data. Clearing browser data can erase it.

**Export a JSON backup before upgrading, moving/renaming the HTML file, resetting data or changing browsers.** Keep backups safe; they may contain sensitive infrastructure details. Caffoot Lite saves inventory under `caffoot_state`. This pre-release version does not migrate older test-browser storage automatically; export and restore a JSON backup if you need to keep test data.

## For developers: build and test

Node.js and npm are needed **only to build from source**, not to run the released HTML:

```sh
cd app
npm install
npm run release
```

The build produces `app/dist/Caffoot-Lite.html`. GitHub Actions also builds and checks the application and uploads a preview artifact on pushes to `main`. Automated checks do not replace manual Safari and offline testing.

## Project and release status

This repository is dedicated to **Caffoot Lite**: its standalone application, build tools, tests and release documentation.

The [roadmap and release checklist](ROADMAP.md) record remaining tests, security/privacy review and owner approval. No public release or repository visibility change should occur before approval.

## Licence and branding

Source code: [MIT License](LICENSE), copyright (c) 2026 Steven Del-Nevo. Third-party components retain their own licence terms.

The Caffoot name, hedgehog mascot and official project branding are **not** licensed as official branding by the MIT software licence. No registered-trademark claim is made. Do not present a modified build as an official Caffoot release without the owner's permission.
