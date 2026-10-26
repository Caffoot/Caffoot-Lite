# Caffoot Lite v1.3.0 — Rack Management Modernisation

**Status:** Published stable release.  
**Release date:** 21 October 2026.  
**Previous stable release:** v1.2.1.  
**Published release:** [v1.3.0 on GitHub](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.0).

## Overview

v1.3.0 focuses on making rack inventory and equipment placement easier to understand and manage while preserving the standalone, offline-first Caffoot Lite experience. Advanced IP addressing and reporting have been deferred to future milestones rather than expanding this release.

## Rack management improvements

- **Rack workspace:** expandable navigation for Rack Overview, Rack Inventory and Rack Accessories; rack-wide inventory summaries and drill-downs.
- **Rack insights:** capacity, equipment, locations and rack-type views derived from saved local records. These are inventory summaries, not live monitoring.
- **Rack elevations:** front/rear equipment placement with rack-unit awareness and collision/boundary safeguards, including rack accessories.
- **Rack configuration:** flexible heights (including nonstandard sizes), rack types, optional dimensions and safer edit/resizing validation.
- **Accessories:** extended accessory workflows for power distribution, ventilation, cable management and environmental equipment, including 0U placements where supported. 0U accessories do not consume numbered rack units.

## Compatibility and data safety

- Existing JSON backup and restore workflows remain supported, including historical mounting and location compatibility review.
- A legacy device's valid historical mounting value is preserved when its editor opens; correction previews identify changes to obsolete location values before restoration.
- Browser inventory remains in local storage. **Export and safely retain a JSON backup before upgrading**, changing file paths or browser profiles, or restoring data. A restore replaces the active inventory rather than merging it.
- The standalone HTML application is **not** an authenticated multi-user web service and must not be exposed directly to the public internet.

## Pre-publication validation recorded on 21 October 2026

- Owner ran the full automated regression, offline HTML build, build verification and packaging checks successfully on 21 October 2026 using the development branch. The package still carried development version 1.2.0 at that point; this was **not** the final v1.3.0 release build.
- Owner verified the generated HTML opens and the Dashboard and Racks navigation work.
- Owner imported a historical backup and verified the Admin-Client legacy `Desktop` mounting value and corrected `Unknown` location in the device details and editor.

## Release preparation checklist (historical)

The following items were recorded before publication and are preserved as a historical checklist. They are not claims that any unrecorded tests have since been executed.


- Confirm each claimed feature against the final implementation and browser acceptance, including responsive/light/dark behaviour and rack accessory workflows.
- Align application, package, documentation, release artefact names and version to 1.3.0.
- Complete security/privacy, licence, backup compatibility, documentation and final packaging review.
- Obtain explicit owner approval before merging or publishing.

## What's next

v1.4.0 is an **architecture-first Data & Architecture Foundations** milestone. Storage, durability, migration, deployment simplicity and future multi-user security boundaries will be designed before implementation choices are made. See [ROADMAP.md](ROADMAP.md).
