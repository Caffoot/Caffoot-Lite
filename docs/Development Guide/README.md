# Caffoot Lite — Development Guide

Welcome. This guide explains **how Caffoot Lite actually works**, from the everyday user experience through to the Python backend, SQLite database and tests. It is written for the product owner, new contributors and maintainers.

**Status:** This guide describes the current, unreleased Docker/SQLite implementation on the `Next` branch. It is *not* a release announcement or a new specification. [Issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215) controls the approved application behaviour and the published [v1.3.3 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.3) remains the inventory compatibility baseline. [Issue #218](https://github.com/Caffoot/Caffoot-Lite/issues/218) tracks release preparation and remaining acceptance.

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
| [06 — Coding and naming conventions](06-Coding-and-Naming-Conventions.md) | How existing functions, variables and UI hooks are named |
| [07 — Function and code reference](07-Function-and-Code-Reference.md) | Where to find an implementation before changing it |
| [08 — Testing and maintenance](08-Testing-and-Maintenance.md) | How to check a change and protect the published baseline |

Each technical chapter starts with **In simple terms**, then adds details for developers. Follow links rather than reading all eight chapters in order.

## Quick source map

- [`next/inventory.html`](../../next/inventory.html): the established inventory interface with the Next integration layer.
- [`next/setup.html`](../../next/setup.html): first-run administrator and sign-in interface.
- [`next/backend/server.py`](../../next/backend/server.py): HTTPS entry point, routes and request handling.
- [`next/backend/schema.py`](../../next/backend/schema.py): SQLite tables and schema upgrades.
- [`next/backend/`](../../next/backend/): permissions, saves, import and validation modules.
- [`next/tests/`](../../next/tests/): backend and browser compatibility checks.
- [`next/compose.yaml`](../../next/compose.yaml), [`next/portainer-stack.yaml`](../../next/portainer-stack.yaml) and [`next/Dockerfile`](../../next/Dockerfile): deployment configuration.
- [`app/caffoot-lite.html` at v1.3.3](https://github.com/Caffoot/Caffoot-Lite/blob/v1.3.3/app/caffoot-lite.html): **published** inventory behaviour to preserve.

For current installation instructions see [`next/README.md`](../../next/README.md); the release-facing root README is scheduled for Stage 3, not rewritten by Stage 1.

## Before making a change

Read #215 directly, inspect the current `Next` branch and relevant source, compare established inventory behaviour with the **published tag** rather than assumptions, and reuse existing tests. Historical audit findings may already have been fixed. A new feature, visual deviation or expanded architecture must not be inferred from this guide. **No release or rename is authorised by these documents.**
