# Caffoot Lite feature overview

**Documentation status:** Website-facing reference for published v1.3.0, drafted from the technical workflow audit. Review screenshots and wording against the published application before website publication.

Caffoot Lite is a standalone, offline-capable network inventory application supplied as an HTML file. It helps users document devices, IP addresses, subnets, VLANs and network racks. Inventory data is stored in the browser being used, not inside the HTML file. Users can download a JSON inventory backup and restore a compatible backup.

## Current feature areas

- **Device inventory:** Record equipment, device types, locations and relevant hardware, software and network details.
- **IP address management:** Document subnets, addresses, allocations and reservations, including reviewed bulk operations.
- **Network racks:** Record racks and position rack-mounted devices and accessories, with placement checks.
- **Catalogues:** Manage device suggestions, custom software and server services.
- **Data management:** Export inventory backups, review and restore backups, run safety checks and perform a confirmed clean reset.
- **Preferences:** Choose Light, Dark or System appearance.
- **Change History:** View a limited, browser-local summary of saved changes and export it separately.

## Important boundaries for website copy

Caffoot Lite v1.3.0 does **not** provide a central shared database, built-in user accounts or a Docker-based multi-user service. Running the HTML file from a web server does not change its browser-local storage model. Change History is not a full backup or a tamper-proof audit system. Planned roadmap capabilities must not be described as available.

## Source and maintenance

Source of truth: published v1.3.0 application and [technical workflow reference](../workflows/TECHNICAL-WORKFLOWS.md). Check the relevant feature page and website content whenever a release changes behaviour. Public-facing copy uses British English.

## Website project handover

For website maintenance, use [the website project handover](../website/WEBSITE-PROJECT-HANDOVER.md) to locate approved v1.3.0 feature copy, screenshots, current release guidance and safety boundaries. The public website is `https://caffoot.co.uk`, but website content and publication are managed separately. This documentation branch is not yet merged into `main`; do not assume branch-only images and text are present in the public repository.
