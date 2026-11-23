# Employee Service Desk Application Evidence

The screenshots were captured on 23 November 2026 from the unreleased v2.2 application. The Python application served the pages over local HTTPS from a disposable SQLite schema 26 database. Chromium 155.0.8059.79 rendered the 1440 × 1050 desktop and 390 × 844 mobile viewports. The accounts, equipment, installed-software choices and conversations are fictional records in that database. The browser used signed-in fixture sessions and the application's normal routes, controls and theme setting.

The sidebar-visible screenshots were refreshed for the navigation correction from PR head `8652b76708db7425174683172be2a39f4575345c` with the corrected shared navigation template at Git blob `891a4ee2996e83c5594b347c454cb714e5e8ba92`. The mobile Ticket Details, Updates and Create Ticket windows cover the sidebar. Their captures are from the original application source at `86ad4c5c994190aceb4bcbe1b15973e1fc814fb5`. [Owner-approved correction](https://github.com/Caffoot/Caffoot-Lite/pull/439#issuecomment-7102788616)

## Screenshots

| View | Light | Dark |
| --- | --- | --- |
| My Tickets on desktop | [Desktop light](my-tickets-desktop-light.png) | [Desktop dark](my-tickets-desktop-dark.png) |
| My Tickets with the desktop menu collapsed | [Collapsed desktop light](my-tickets-desktop-collapsed-light.png) | |
| My Tickets on mobile | [Mobile light](my-tickets-mobile-light.png) | [Mobile dark](my-tickets-mobile-dark.png) |
| Department Tickets on desktop | [Desktop light](department-tickets-desktop-light.png) | [Desktop dark](department-tickets-desktop-dark.png) |
| Department Tickets on mobile | [Mobile light](department-tickets-mobile-light.png) | [Mobile dark](department-tickets-mobile-dark.png) |
| Ticket lists after scrolling | [My Tickets on mobile](my-results-mobile-light.png) | [Department Tickets on mobile](department-results-mobile-dark.png) |
| Ticket Details Overview on desktop | [Desktop light](ticket-overview-desktop-light.png) | [Desktop dark](ticket-overview-desktop-dark.png) |
| Ticket Details Overview on mobile | [Mobile light](ticket-overview-mobile-light.png) | [Mobile dark](ticket-overview-mobile-dark.png) |
| Ticket Updates and Reply To IT | [Desktop light](ticket-updates-desktop-light.png) | [Mobile dark](ticket-updates-mobile-dark.png) |
| Ticket History | [Desktop light](ticket-history-desktop-light.png) | |
| Create Ticket and Affected Software on desktop | [Desktop light](create-ticket-desktop-light.png) | [Desktop dark](create-ticket-desktop-dark.png) |
| Create Ticket and Affected Software on mobile | [Mobile light](create-ticket-mobile-light.png) | [Mobile dark](create-ticket-mobile-dark.png) |
| Report A Problem in My Equipment | [Desktop light](my-equipment-desktop-light.png) | |

## Design comparison

The comparison used the frozen Design 02 HTML and companion screenshots at revision `2dbfbd8aebdcd7237845c7ea559f52548e5600de`. The HTML blob is `9a67208ecb17970471bfd7ce7c22a50a91cf5d8c`. The integrated desktop captures show the two tabs, three status cards, filters, sort and seven-column list. The mobile captures show the compact shared navigation, stacked filters and scrollable ticket table. The details and create captures show the same three-tab window, a scrolling body and a fixed action footer. The integrated screens use the existing Caffoot Lite shell, logo, theme colours and control styles. [Frozen Design 02](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/02-my-tickets-department.html) · [Reference screenshot index](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/README-02.md)

**My Equipment** and **My Tickets** now appear first beneath **Workspace** in the expanded sidebar. The collapsed desktop and compact mobile captures show the same order as icons. Independent product-owner visual acceptance remains pending.

## Navigation correction checks

- **Five focused Python tests passed.** These checked the packaged templates and pinned stylesheets, employee and technician access, the Department assignment boundary and the IT queue.
- **Focused Chromium HTTPS checks passed.** The browser checked sidebar order, keyboard focus and the employee equipment and ticket destinations in desktop and mobile light and dark themes and collapsed desktop. It checked technician access to the IT queue and Settings & Data, with My Tickets hidden for the unlinked account, on desktop and mobile.

## Original feature checks

- **64 Python tests passed.** These cover the schema 25 to 26 upgrade and existing tickets, authorised equipment choice, personal and Department visibility, membership changes, equipment moves, previous assignment boundaries, stock issues, sorting, searches and counts, genuine software choices, category history, reopening, reply and download access, invalid files, ticket quotas and IT Service Desk regressions. [HTTP tests](../../../../tests/test_service_desk_http.py) · [Migration tests](../../../../tests/test_service_desk_schema.py)
- **The focused Chromium HTTPS workflows passed for an employee and a technician.** The browser checked the Open default, the status shortcuts and filters, separate queues, employee-safe tab content, the Closed resolution and reopen controls, a new reply and its downloaded file, Report A Problem and saved Affected Software, and the technician's access to the corresponding internal update.
- **The focused Chromium Device catalogue regression passed.** It exercised platform-specific suggestions and verified that archived, hidden, out-of-context and legacy applications stayed associated with their Devices across cancel, save, reload and duplication. [Catalogue check](../../../../tests/contextual-device-catalogue.cjs)
- **The local Docker build and smoke check passed.** A disposable container verified the employee interface and shared software catalogue were packaged, and opened a schema 26 database with the new field and valid foreign keys.
- The standalone approved HTML check reports the same pre-existing mismatch for IPAM Draft 01's `.ipam-modal-body` on both the integration baseline and the review branch. The packaged-template and pinned-stylesheet tests passed.

Hosted final-head CI, native Raspberry Pi and Safari, and full milestone backup, restore and upgrade checks remain separate review gates.
