# Caffoot Lite

A lightweight, standalone network inventory and IP address management (IPAM) application for devices, subnets, racks, and network assets.

**Status:** v1.0 release candidate preparation. Not yet a verified stable release.

## Build and test

Requires Node.js and npm for building only:

```sh
cd personal
npm install
npm run release
```

The offline HTML is generated at `personal/dist/caffoot-personal-offline.html`. End users do not need Node.js. On pushes to `main`, GitHub Actions builds and checks the application and uploads the `caffoot-lite-offline-preview` artifact.

## Data safety

Inventory lives in the browser's local storage, not on a server. Export a JSON backup before updating the HTML or switching file locations. The legacy `netmini_state` storage key and compatible backup formats are intentionally preserved to avoid breaking existing inventories. Browser `file://` storage behaviour varies.

## v1.0 readiness

See [ROADMAP.md](ROADMAP.md). Automated checks do not replace manual Safari and offline testing.

## Project separation

This repository contains only **Caffoot Lite**. The original `sdelnevo/caffoot` repository, including Caffoot Server and its branches, is not modified by this migration.
