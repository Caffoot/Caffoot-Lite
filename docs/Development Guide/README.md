# Caffoot Lite — Development Guide

Welcome. This guide explains **how Caffoot Lite actually works**, from the everyday user experience through to the Python backend, SQLite database and tests. It is written for the product owner, new contributors and maintainers.

**Status:** This guide describes the released v2.0.1 Docker/SQLite baseline **and the currently implemented changes on the unreleased `v2.1` branch**. See [v2.1 preview status](../v2.1-preview-status.md) for the accurate feature boundary, and always compare code against the published v2.0.1 baseline. Backend, tests and deployment sources remain at the repository root. [Issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215) documents completed historical work; it does not control future development. [CONTRIBUTING.md](../../CONTRIBUTING.md) describes the mandatory standards for every future contribution. The original [v2.0](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0) and standalone [v1.3.3](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3) tags are preserved.

## In simple terms

Caffoot Lite helps small IT teams document their devices, IP addresses, network racks and changes. The earlier HTML release saves its inventory in one browser. The Docker application keeps a **shared inventory** in a central SQLite database so authorised users see the same information.

Think of it as three parts:

1. **The browser** displays familiar Devices, IPAM, Racks and Change History screens, together with the approved accounts and sign-in features.
2. **The server** checks who is signed in, whether they may make the requested change, and whether the inventory will remain valid.
3. **SQLite** keeps the accepted records. It sits in the container's persistent `/data` directory so normal container recreation need not remove inventory.

For example, when somebody edits a device, the browser requests an exclusive, temporary editing reservation. On saving, the server checks the reservation, the user's permissions, the device revision and relevant inventory relationships. A valid change is committed to SQLite; an invalid one is rejected rather than partly applied. Other users can keep viewing that device or editing different devices.

**Important:** The old HTML release's browser-local storage and JSON backup mechanism are **not** the Docker application's ongoing backup system. The deployed application's data is backed up and restored by external Docker/volume backup tools. The JSON importer is only for **one-way migration from a fresh published v1.3.3 export**.

## Find what you need

| Guide | What it answers |
| --- | --- |
| [01 — Architecture](01-Architecture.md) | What runs where, and how the components fit together |
| [02 — Database](02-Database.md) | Which SQLite tables exist, and how changes are saved |
| [03 — Frontend and backend](03-Frontend-and-Backend.md) | How browser actions reach backend functions and APIs |
| [04 — Authentication and permissions](04-Authentication-and-Permissions.md) | Sign-in, MFA, user accounts and access rules |
| [05 — Inventory and migration](05-Inventory-and-Migration.md) | Data relationships, v1.3.3 compatibility and importing |
| [06 — Coding and naming conventions](06-Coding-and-Naming-Conventions.md) | Mandatory standards for naming, UI labels, refactoring and documentation |
| [07 — Function and code reference](07-Function-and-Code-Reference.md) | Where to find an implementation before changing it |
| [Full Function Index](Function-Index.md) | Source-pinned declaration locations, static call-like reference counts and example reference sites |
| [08 — Testing and maintenance](08-Testing-and-Maintenance.md) | How to check a change and protect the published baseline |

All contributors should first read [CONTRIBUTING.md](../../CONTRIBUTING.md) and complete the repository pull-request checklist. Each technical chapter starts with **In simple terms**, then adds details for developers. Follow links rather than reading all eight chapters in order.

## Quick source map

- [`inventory.html`](../../inventory.html): the established inventory interface and its central SQLite integration.
- [`setup.html`](../../setup.html): first-run administrator and sign-in interface.
- [`backend/server.py`](../../backend/server.py): HTTPS entry point, routes and request handling.
- [`backend/schema.py`](../../backend/schema.py): SQLite tables and schema upgrades.
- [`backend/`](../../backend/): permissions, saves, import and validation modules.
- [`tests/`](../../tests/): backend and browser compatibility checks.
- [`compose.yaml`](../../compose.yaml), [`portainer-v2.1-preview.yaml`](../../portainer-v2.1-preview.yaml) and [`Dockerfile`](../../Dockerfile): deployment configuration.
- [`app/caffoot-lite.html` at v1.3.3](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html): **published** inventory behaviour to preserve.

For current preview installation instructions see [`INSTALLATION.md`](../../INSTALLATION.md). The [root README](../../README.md) describes the unreleased v2.1 development preview; production v2.0.1 remains documented at its [immutable release tag](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.1/README.md).

## Before making a change

Read the approved scope for the proposed change, inspect the current main-branch source, review the Function Index and relevant tests, and compare established inventory behaviour with the **published v2.0.1 baseline** rather than assumptions. Historical audit findings may already have been fixed. Source renaming for clarity is a welcome, separately approved maintenance activity: update every dependent reference, test and guide. [Future Ideas Register #222](https://github.com/Caffoot/Caffoot-Lite/issues/222) alone does not authorise implementation.
