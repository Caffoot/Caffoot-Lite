# Service Desk Settings And Reporting Application Evidence

Captured on 23 November 2026 from the integrated draft v2.2 application at `d831694484eb1b00b535e11bb4da2b6acdf9b75e`. Chromium 155.0.8059.79 rendered the local HTTPS application using disposable SQLite schema 27 databases and fictional people and equipment. Desktop and mobile used viewports of 1440 × 960 and 390 × 844. The PNGs show the full pages at those widths.

The browser exercised the live Settings, ticket queue and reporting endpoints. The dashboard fixtures contain genuine application ticket events, including a closure by a different technician from the first support update and a reopened attempt closed as its first action. The calendar shows an administrator’s saved Monday edit and the excluded date and category created during the browser run. The warning capture uses a second installation with no `TZ` value. [Browser check](../../../../tests/service-desk-reporting-interface.cjs) · [Fictional data fixture](../../../../tests/fixtures/service_desk_reporting.py)

## Screenshots

| View | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Service Desk dashboard and queue | [Desktop light](dashboard-desktop-light.png) | [Desktop dark](dashboard-desktop-dark.png) | [Mobile light](dashboard-mobile-light.png) | [Mobile dark](dashboard-mobile-dark.png) |
| Working Hours | [Desktop light](working-hours-desktop-light.png) | [Desktop dark](working-hours-desktop-dark.png) | [Mobile light](working-hours-mobile-light.png) | [Mobile dark](working-hours-mobile-dark.png) |
| Excluded Dates | [Desktop light](excluded-dates-desktop-light.png) | [Desktop dark](excluded-dates-desktop-dark.png) | [Mobile light](excluded-dates-mobile-light.png) | [Mobile dark](excluded-dates-mobile-dark.png) |
| Ticket Categories | [Desktop light](ticket-categories-desktop-light.png) | [Desktop dark](ticket-categories-desktop-dark.png) | [Mobile light](ticket-categories-mobile-light.png) | [Mobile dark](ticket-categories-mobile-dark.png) |
| Administrator time zone warning | [Desktop light](missing-timezone-desktop-light.png) | | | |

The dashboard retains the approved workload cards, activity figures, technician columns and queue. The three Settings tabs use the application’s existing administrator navigation and controls. The condensed category rows and wrapped Technician Activity column headings keep those controls and values readable at 390 pixels. Independent visual acceptance is for the product owner. [Frozen Design 01](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/01-service-desk-it.html) · [Frozen Design 03](https://github.com/Caffoot/Caffoot-Lite/blob/a0763a387b51e0b5b83363189d018d4c3a149e49/future-design/stage-5-previews/03-service-desk-settings.html)

## Focused Checks

- **60 Python tests passed.** Coverage included the schema 26 to 27 migration, retained closure history, administrator permission and audit, employee ticket and equipment custody boundaries, the four London clock-change outcomes, the 8-hour prospective change, On Hold and excluded date handling, missing time zone recovery and event attribution. [Calendar tests](../../../../tests/test_service_desk_calendar.py) · [HTTP tests](../../../../tests/test_service_desk_http.py) · [Schema tests](../../../../tests/test_service_desk_schema.py)
- **The HTTPS Chromium check passed.** It covered keyboard tab navigation, working-hours validation and cancellation, saving, date add and remove, category rename and visibility, remembered custom periods, current workload filtering, technician counts, permission denial and the time zone warning. [Browser check](../../../../tests/service-desk-reporting-interface.cjs)
- **The local Docker build and packaging smoke check passed.** The image opened schema 27 and could apply the packaged `Europe/London` rules and recognise an invalid zone. Docker Compose validated both draft example files. [Compose example](../../../how-tos/features-and-instructions/v2.2-draft/compose-v2.2-draft.yaml) · [Portainer example](../../../how-tos/features-and-instructions/v2.2-draft/portainer-v2.2-draft.yaml)

The required hosted CI runs via Ready For Review. Native Safari, Raspberry Pi and the full milestone upgrade, backup and restore acceptance checks remain separate gates.
