# Caffoot Lite 1.0.0

**Infrastructure, Simplified.** For HomeLabs and Small Teams.

**First stable release — 10 October 2026.**

Caffoot Lite is a standalone offline application for documenting devices, IPv4 subnets, IPAM allocations and rack layouts. No Docker, web server or account is needed to run the generated HTML.

## Included

- Device inventory, managed types/locations and additional device details.
- IPv4 subnet management (/23–/30), suggested gateways, next available IPs, reservations and bulk IPAM actions.
- Device/IPAM synchronisation and validation/rollback protections.
- Front/rear rack placement, U sizes, accessories and collision checks.
- Dynamic dashboard, light/dark themes and keyboard/label improvements.
- Schema-v1 JSON exports, compatible legacy imports, validation preview and pre-restore snapshots.
- Manual published-release checks, an offline safe update guide and full embedded software licences.

## Download and run

Prefer the `Caffoot-Lite-1.0.0.zip` release asset. Extract it and open `Caffoot-Lite.html` in a modern browser. The package includes installation/user guides, licences, a backup-format contract, fictional examples and SHA256SUMS. The standalone `Caffoot-Lite.html` also embeds its complete licence notices. GitHub's source-code ZIP and `app/caffoot-lite.html` are developer sources, not the offline distribution.

## Your inventory lives in the browser

Devices, IPAM, subnets and racks are stored in browser local storage, **not inside the HTML file**. There is no automatic cloud backup or synchronisation. Clearing browser data can erase inventory. Moving/renaming the file or changing browser/profile may hide data; some browsers share local storage across HTML paths, so restoring into one copy can affect another.

Export JSON regularly and before upgrading, moving, renaming or resetting. Keep the backup outside the browser. Restoring replaces the visible inventory after confirmation. Retain the old file and backup until the new version is verified. Backups are not encrypted and can contain sensitive infrastructure information.

## Validation and known boundaries

The pre-stable preview passed automated source/security/restore/build/package and offline Chromium checks, including moved/renamed-file restore, cancellation, future-schema rejection and persistence. The owner reported positive Safari appearance and VoiceOver feedback, and explicitly confirmed backup export, restoration into the new version and close/reopen persistence. This is owner acceptance, not formal accessibility certification or a claim of individually witnessed results for every detailed checklist step. The final version 1.0.0 build passed the full automated suite before publication approval.

Audit history, theme settings and recovery snapshots are stored separately and are not included in the standard inventory backup. Future backup schemas require a compatible application. The interchange contract is a foundation for Caffoot Pro; a Pro importer has not been implemented or verified. Lite remains browser-local, without multi-user/server storage.

## Licences

Caffoot software: MIT, copyright (c) 2026 Steven Del-Nevo. Font Awesome and Tailwind retain their own licence terms; complete notices are packaged and readable offline from About Caffoot Lite → Software licences. Caffoot branding is separate from the software licence.
