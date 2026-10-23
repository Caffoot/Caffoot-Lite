# Caffoot Lite website project handover

**Prepared:** 23 October 2026  
**Website:** https://caffoot.co.uk  
**Application repository:** https://github.com/Caffoot/Caffoot-Lite  
**Published application baseline:** v1.3.0, released 21 October 2026  
**Documentation review:** WF-14, in progress  
**Documentation working branch:** `docs/wf05-wf06-import-integrity-20261022`

## Purpose

This document is for the separate Caffoot website project. Use it to locate the authoritative feature descriptions, screenshots and release information, and to keep the website consistent with the published application. It is a handover and reference map, not permission to publish website changes or to claim that every audit finding has been closed.

## Read these sources in order

1. **Published product and download truth:** [v1.3.0 release](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.0). The released `Caffoot-Lite.html` and release ZIP represent what visitors can download now.
2. **Website-facing feature copy:** [Feature overview on the documentation branch](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/features/FEATURE-OVERVIEW.md). This describes available v1.3.0 features and important limitations. Check against the released application before publication.
3. **First-time experience and website consistency findings:** [WF-14 audit](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/audits/WF-14-PUBLIC-REPOSITORY-AND-FIRST-TIME-USER-EXPERIENCE.md).
4. **User journeys and screen labels:** [User guide](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/USER-GUIDE.md) and [installation guide](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/INSTALLATION.md).
5. **Technical details if wording is uncertain:** [Technical workflows](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/workflows/TECHNICAL-WORKFLOWS.md).
6. **Planned rather than released work:** [v1.3.1 maintenance roadmap](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/roadmaps/V1.3.1-MAINTENANCE-ROADMAP.md) and [public roadmap](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/ROADMAP.md). Do not market proposals as implemented.

**Important branch distinction:** The links above intentionally point to the documentation working branch. The owner has not approved a merge to `main`, so these updates may not yet appear on the public default branch. Recheck branch and release before every website update.

## Approved factual product positioning for v1.3.0

Caffoot Lite is a free, open-source, offline-capable network inventory and IPv4 address management application for homelabs and small teams. Users download a standalone HTML file and open it in a modern browser. No Docker installation, account, database or web server is required to run the published standalone release.

Current feature areas include device inventory, types and locations; IPv4 address blocks, subnets, VLANs, allocations and reservations; rack inventory, rack placement and accessories; device catalogues; dashboard summaries; preferences; and JSON backup and restore.

**Do not imply:** automatic network discovery, live device monitoring, cloud synchronisation, automatic backups, a central shared database, built-in accounts, authenticated multi-user operation or a released Docker upgrade path. These are not capabilities established for v1.3.0. The browser stores the inventory locally; the HTML file does not contain the user's saved data.

Suggested short website introduction:

> Document your network without setting up a server. Caffoot Lite helps you keep track of devices, IP addresses, subnets and racks in a standalone HTML application. Open it in your browser, organise your inventory and export JSON backups to protect your work.

Accompany the introduction with a visible storage note: **Inventory is saved in your browser. Export JSON backups regularly, particularly before upgrades or moving the HTML file.**

## Screenshots to use

These five screenshots are referenced by the README on the documentation branch and were recorded in WF-14. They contain demonstration data and should be visually checked before use on the website.

| Website use | File in repository | Notes |
| --- | --- | --- |
| Dashboard overview | [dashboard.png](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/screenshots/dashboard.png) | Existing screenshot retained after owner review |
| Device Intelligence Overview | [devices-overview-v1.3.0.png](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/screenshots/devices-overview-v1.3.0.png) | Owner-supplied v1.3.0 overview with fictional demo data |
| Rack Overview | [rack-overview-v1.3.0.png](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/screenshots/rack-overview-v1.3.0.png) | Owner-supplied v1.3.0 overview with fictional demo data |
| Device Inventory | [device-inventory.png](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/screenshots/device-inventory.png) | Existing detailed inventory screenshot retained |
| Rack Elevation | [rack-management.png](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/docs/screenshots/rack-management.png) | Existing rack elevation screenshot retained |

Repository image folder: [docs/screenshots](https://github.com/Caffoot/Caffoot-Lite/tree/docs/wf05-wf06-import-integrity-20261022/docs/screenshots).

For website use, download the actual PNG files from the repository rather than hotlinking to GitHub page URLs. Preserve their aspect ratios and use descriptive alt text. Do not crop away warnings or alter screenshots to imply features that are not available. Check visual appearance on desktop and mobile; this handover does not claim the website's current images or responsive layouts have been inspected.

## Visitor journey the website should support

1. Understand what the application does and who it is for.
2. See genuine screenshots and the major feature areas.
3. Find a prominent **Download Caffoot Lite** link to the [latest official GitHub release](https://github.com/Caffoot/Caffoot-Lite/releases/latest), not GitHub's automatically generated source ZIP.
4. Understand that the standalone HTML file opens in a browser without installing a server.
5. Follow the [first-time user guide](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/USER-GUIDE.md) to create a subnet and a device. For rack-mounted devices, create a location and rack first; devices using suitable non-rack mounting options do not require a rack.
6. Learn where data is stored and how to download a JSON backup.
7. Find the [GitHub issue tracker](https://github.com/Caffoot/Caffoot-Lite/issues) and [contribution guidance](https://github.com/Caffoot/Caffoot-Lite/blob/docs/wf05-wf06-import-integrity-20261022/CONTRIBUTING.md) for feedback and help.

The product owner manually completed the published v1.3.0 journey in a separate test browser profile with fictional inventory: opened the app, created subnet, location, rack and device, verified IPAM, downloaded a JSON backup, restored it and confirmed all expected records remained. This is owner-executed manual evidence, not a claim of automated end-to-end or cross-browser test coverage.

## Website content rules

- Use British English. Do not use hyphens or dashes as punctuation in public copy.
- Keep the published release separate from future plans and prototypes.
- Use the actual v1.3.0 interface terminology. The current restore button reads **Choose Backup File**; **Restore Data** is a proposed future label, not yet implemented.
- Explain that restoring a JSON backup replaces the active inventory rather than merging it.
- Do not encourage public internet exposure of the standalone application. It has no built-in authentication or multi-user security boundary.
- Preserve clear download, privacy, storage, backup and security guidance without burying the first-time path.
- Avoid claiming adoption or conversion improvements without evidence.

## Suggested website review checklist

- [ ] Homepage explains the value within its opening section.
- [ ] Download link points to the official current release.
- [ ] Feature claims agree with the published application and feature overview.
- [ ] All five screenshots are visually reviewed and labelled accurately.
- [ ] Mobile visitors can find download, documentation and safety guidance.
- [ ] Browser-local storage and manual backups are explained before users depend on saved data.
- [ ] Help, issues, repository and user guide links work.
- [ ] Version references and roadmap claims are current.
- [ ] Website and repository changes are reviewed together for the next release.
- [ ] Product owner approves any website publication.

## Current audit and change status

WF-14's first-time manual walkthrough is complete, but the broader public repository and website consistency review remains open. WF-13 and M-030 also remain open. The README and user guide have been improved on the documentation branch; they have not been merged to `main` or published as a new release. This handover does not constitute a live audit of https://caffoot.co.uk.

**Handover instruction to the website project:** Read this file and the linked feature overview before editing site copy. Compare the current live website with the published v1.3.0 release and the five screenshot sources. Prepare proposed changes for owner review. Do not publish or describe planned functionality as available without approval.
