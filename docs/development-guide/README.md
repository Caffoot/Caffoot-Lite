# Caffoot Lite — Development Guide

> **Current integration — 19 November 2026:** Stages 1–4 are development-complete/owner-accepted and merged into `milestone-1` at verified HEAD `c1b5f8008e8ba56840d9790e3ba1c7e91ad35e0b` (schema 24). Stage 5 has four frozen approved HTML designs and six planned batches #420–#425 under [#419](https://github.com/Caffoot/Caffoot-Lite/issues/419); **Batch 5.1 is separately authorised and under review**. v2.1 remains published and v2.2 unreleased. See [Development Status](Development-Status.md), the [Stage 4 sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/369#issuecomment-7007760294) and the [draft v2.2 guides](../how-tos/features-and-instructions/v2.2-draft/README.md). Dated older review checkpoints are historical.

Welcome. This guide explains **how Caffoot Lite actually works**, from the everyday user experience through to the Python backend, SQLite database and tests. It is written for the product owner, new contributors and maintainers.

**Status:** v2.1 is the published Docker/SQLite baseline. It includes the modular interface, profiles, email/recovery workflows and Audit Trail. See [Modular Interface](Modular-Interface.md), [Account Recovery](Account-Recovery.md) and the [v2.1 handover archived for release preparation](../historical/development-handovers/v2.1.md) for release-preparation evidence and acceptance limits. [Issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215) documents completed historical work; it does not control future development. [CONTRIBUTING.md](../../CONTRIBUTING.md) describes the mandatory standards for every future contribution. The original [v2.0](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0) and standalone [v1.3.3](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3) tags are preserved.

## In simple terms

**Current development target: v2.2 (Milestone 01).** Stages 1–3 added Staff/Departments, assignments/My Equipment, IT Assets stock/circulation, Device registration/reissue, Associated Equipment, direct handovers and reporting. **Stage 4 is also completed and integrated**, adding Suppliers, Supplier Issues/Purchasing, equipment supplier associations and Equipment Lifecycle. See [Development Status](Development-Status.md), the [active handover](../development-handovers/milestone-01.md) and the [historical Stage 1–3 documentation review](Stage-1-3-Documentation-Review.md). The [Service Desk foundation](Service-Desk-Foundation.md) is under review in [PR #437](https://github.com/Caffoot/Caffoot-Lite/pull/437). Each later Stage 5 batch awaits its own authorisation. Deferred manual/native and Stage 6 compatibility/upgrade/restore acceptance remain outstanding. The v2.2 guides describe an unreleased development branch, not production installation or upgrade instructions.

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
| [Full Function Index](Function-Index.md) | Named runtime definitions, bridge methods and selected maintenance helpers, with current declaration locations; not a call graph or reference-count report |
| [08 — Testing and maintenance](08-Testing-and-Maintenance.md) | How to check a change and protect the published baseline |
| [Security fixes and releases — owner checklist](Security-Fixes-and-Releases.md) | The short, safe path from private report or approved change to a verified release |
| [v2.0.3 development handover (historical)](../historical/development-handovers/v2.0.3.md) | Completed v2.0.3 decisions and work, kept as a dated record |

All contributors should first read [CONTRIBUTING.md](../../CONTRIBUTING.md) and complete the repository pull-request checklist. Each technical chapter starts with **In simple terms**, then adds details for developers. Follow links rather than reading all eight chapters in order.

## Quick source map

- [`inventory.html`](../../inventory.html): the shared application shell; screen fragments and runtime logic are under [`interface/`](../../interface/).
- [`interface/loader.js`](../../interface/loader.js), [`interface/application.js`](../../interface/application.js), [`interface/screens/`](../../interface/screens/) and [`interface/styles/`](../../interface/styles/): authenticated modular presentation and shared navigation.
- [`setup.html`](../../setup.html): first-run administrator and sign-in interface.
- [`backend/server.py`](../../backend/server.py): HTTPS entry point, routes and request handling.
- [`backend/schema.py`](../../backend/schema.py): SQLite tables and schema upgrades.
- [`backend/`](../../backend/): permissions, saves, import and validation modules.
- [`tests/`](../../tests/): backend and browser compatibility checks.
- [`compose.yaml`](../../compose.yaml), [`portainer-v2.1.yaml`](../../portainer-v2.1.yaml) and [`Dockerfile`](../../Dockerfile): deployment configuration.
- [`app/caffoot-lite.html` at v1.3.3](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html): **published** inventory behaviour to preserve.

For current installation instructions see [`INSTALLATION.md`](../../INSTALLATION.md). The [root README](../../README.md) describes the published v2.1 edition and links to earlier releases.

## Before making a change

Read the approved scope for the proposed change, inspect the current main-branch source, review the Function Index and relevant tests, and compare established inventory behaviour with the **published v2.1 baseline**, using earlier releases when a compatibility question arises rather than assumptions. Historical audit findings may already have been fixed. Source renaming for clarity is a welcome, separately approved maintenance activity: update every dependent reference, test and guide. [Future requests](https://github.com/Caffoot/Caffoot-Lite/labels/future%20request) are suggestions, not permission to start implementation.
