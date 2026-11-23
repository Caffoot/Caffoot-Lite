# IT Service Desk Application Evidence

Captured on 23 November 2026 from the integrated, unreleased v2.2 application at `165b22927639057cbf9bb4e6cd58c405f9cd6223`. The server ran over local HTTPS with a disposable SQLite schema 25 database. Chromium 155.0.8059.79 rendered 1440 × 950 desktop and 390 × 844 mobile viewports. The account names, equipment and support conversations are fictional test data. Tickets, updates, status changes and attachments in these recordings went through the application’s live routes.

## Screenshots

| View | Light | Dark |
| --- | --- | --- |
| Current Workload and Ticket Queue, desktop | [Desktop light](queue-desktop-light.png) | [Desktop dark](queue-desktop-dark.png) |
| Current Workload and queue filters, mobile | [Mobile light](queue-mobile-light.png) | [Mobile dark](queue-mobile-dark.png) |
| Ticket Queue results, mobile | | [Mobile dark, scrolled to results](queue-results-mobile-dark.png) |
| Ticket Details Overview, desktop | [Desktop light](overview-desktop-light.png) | [Desktop dark](overview-desktop-dark.png) |
| Ticket Details Overview, mobile | [Mobile light](overview-mobile-light.png) | [Mobile dark](overview-mobile-dark.png) |
| Ticket Updates | [Desktop light](updates-desktop-light.png) | [Mobile dark](updates-mobile-dark.png) |
| Ticket History | [Desktop light](history-desktop-light.png) | |
| Create Ticket | [Desktop light](create-desktop-light.png) | |
| Linked Tickets in Device Details | [Desktop light](device-linked-tickets-desktop-light.png) | |
| Linked Tickets in Stock Item Details | [Desktop light](asset-linked-tickets-desktop-light.png) | |

## Design Comparison

Compared the integrated page and modal with the frozen Design 01 HTML at branch revision `2dbfbd8aebdcd7237845c7ea559f52548e5600de`, blob `d578afc2a907a4b0f7c438210aaeb2e39bf69b35`. The queue uses its three workload shortcuts, Open default, four filters and eight columns. Ticket Details retains Overview, Updates and History, the three Overview panels and the status-specific action footer. The application uses its shared navigation and Device Details presentation. The approved small classification controls sit inside Ticket Information. The period-based activity sections are assigned to Batch 5.4. [Frozen Design 01](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/01-service-desk-it.html) · [Approved classification controls](https://github.com/Caffoot/Caffoot-Lite/issues/421#issuecomment-7095991698)

The desktop capture of Device Details shows the shared modal header, tabs, panels and footer. On the 390-pixel viewport, the ticket table has its own horizontal scroll area and the ticket actions remain within the modal width. The final visual decision belongs to the product owner. [Device Details capture](device-linked-tickets-desktop-light.png) · [Mobile Ticket Details capture](overview-mobile-dark.png)

## Local Verification

- **62 focused Python tests passed.** The run covered the Service Desk schema, HTTP and file validation, existing Device assignments and IT Asset features, inventory, Clean Start, packaged interface templates and release preflight. The update-correction and employee-visible hold explanation checks were also verified in a focused follow-up. Tests used a reduced retained allowance to check concurrent upload transactions and the full 10 MB limit to check the per-file boundary. [HTTP tests](../../../../tests/test_service_desk_http.py) · [Attachment tests](../../../../tests/test_service_desk_attachments.py)
- **Chromium HTTPS workflow passed.** It exercised the Open default, search, filter shortcuts, ticket creation with a file, priority and category correction, assign and reassign, hold and resume, close and reopen, updates, removal history and the two equipment links. Browser-managed policy cancelled saving the attachment to disk. The authorised link, filename, response bytes and forced-download headers were checked over authenticated HTTPS.
- **Docker build and packaging smoke check passed.** The isolated local build used the Dockerfile’s existing `proxy_ca` secret after the environment rejected the Alpine mirror certificate. The image contained the Service Desk assets and loaded the attachment validator. The full Compose and multi-browser workflows run through Ready For Review. Native Safari and Raspberry Pi checks and full upgrade and restore remain separate milestone gates.
