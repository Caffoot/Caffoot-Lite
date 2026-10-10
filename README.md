# Caffoot Lite

**Infrastructure, Simplified.**  
*For HomeLabs and Small Teams*

**Caffoot Lite is a free, open-source, offline network inventory and IP address management (IPAM) tool** for homelabs and small teams. Track network devices and IT assets, document IPv4 subnets, manage IP address allocations and reservations, and organise equipment in racks — all from a standalone HTML file.

No Docker, database, web server or account is required to run the published release. Download the HTML application and open it in a modern browser. Your inventory stays in that browser's local storage, so **regular JSON exports are essential**: browser data loss can mean inventory loss.

## At a glance

| Capability | Caffoot Lite |
| --- | --- |
| Network inventory and IT asset tracking | Devices, types, locations and details |
| IP address management (IPAM) | Subnets, addresses, reservations and allocation workflows |
| Rack management | Equipment placement and rack-unit tracking |
| Installation | Open a standalone HTML file; no server required |
| Data portability | JSON export and import for backups |
| Cost | Free, open-source software (MIT source licence) |

## ⚠️ Important — your inventory lives in your browser

**Caffoot Lite does not save your devices, IP addresses, racks or settings inside `Caffoot-Lite.html`.** Your inventory is stored in the **local storage of the browser you use to open it**. There is no server, automatic cloud backup or automatic synchronisation.

**If browser/site data is cleared, your inventory may be permanently lost.** Changing browser or profile, or moving/renaming the HTML file, can also make existing data inaccessible because `file://` storage varies between browsers.

**Export a JSON backup regularly, and ALWAYS before upgrading, moving, renaming or resetting Caffoot Lite.** Store backups somewhere safe outside the browser and verify you can restore them. Backups may contain sensitive infrastructure details.

## Download and run

[Download Caffoot-Lite-1.0.0.zip](https://github.com/sdelnevo/Caffoot-Lite/releases/download/v1.0.0/Caffoot-Lite-1.0.0.zip), or use the [release page](https://github.com/sdelnevo/Caffoot-Lite/releases/tag/v1.0.0):

1. Open this repository's **Releases** page.
2. Under the latest stable release, expand **Assets**.
3. Prefer the version-named **`Caffoot-Lite-1.0.0.zip`** release asset, which includes guides and licences. Extract it and open `Caffoot-Lite.html`. The standalone HTML is also self-contained with embedded notices. Do not download GitHub’s automatically generated source-code ZIP to run the app.
4. Open it in a modern browser. No Docker, Node.js or web server is required to run the release file.

See the detailed [installation and upgrade guide](INSTALLATION.md) for the complete process and storage precautions.

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

**Export a JSON backup before upgrading, moving/renaming the HTML file, resetting data or changing browsers.** Keep backups safe; they may contain sensitive infrastructure details. Caffoot Lite saves inventory under `caffoot_state`. Version 1.0.0 does not migrate older test-browser storage automatically; export and restore a JSON backup if you need to keep test data.

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

The [roadmap and release checklist](ROADMAP.md) record completed release checks and future proposals. The owner approved public visibility and publication; v1.0.0 was published on 10 October 2026.

## Licence and branding

Source code: [MIT License](LICENSE), copyright (c) 2026 Steven Del-Nevo. Third-party components retain their own licence terms.

The Caffoot name, hedgehog mascot and official project branding are **not** licensed as official branding by the MIT software licence. No registered-trademark claim is made. Do not present a modified build as an official Caffoot release without the owner's permission.


## Backup compatibility and release preparation

The [backup format contract](BACKUP-FORMAT.md) documents versioned exports and legacy imports for future Lite-to-Pro migration. Pro import has not been implemented yet. The [final acceptance walkthrough](RELEASE-ACCEPTANCE.md) and [release review](RELEASE-REVIEW.md) record automated checks and owner-reported Safari/VoiceOver acceptance.
