# Caffoot Lite — Stage 5 — Employee My Tickets / Department Tickets — HTML Design 02

**Status:** **Product-owner visually approved Design 02** on 18 November 2026 in the project conversation (“mate thats brilliant, really really good mate”). This browser-renderable HTML is a design reference, **not implemented application code**. The *concept* and the no-duplication two-tab split were approved in [Service Desk issue #233](https://github.com/Caffoot/Caffoot-Lite/issues/233#issuecomment-6978648169). **This specific HTML file and its screenshots have not yet received separate owner visual approval or been saved in GitHub.**

## Open the design

Open `02-my-tickets-department.html` in a browser. It is a standalone HTML file with sample data and embedded CSS/JavaScript. It does not require Caffoot Lite to be running.

The file refers to Caffoot's official logo using its pinned repository URL; **without network access the HTML displays a temporary `C` fallback mark**. That fallback is a screenshot/offline demonstration only, not a replacement for the approved Caffoot logo.

## Visual references

This design carries forward the approved look and feel, layout patterns, CSS variables and modal composition from:

1. [Service Desk IT Design 01 (owner-approved)](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-5-previews/01-service-desk-it.html).
2. `future-design/approved/devices-inventory-draft-02.html` at pinned commit `c26db4a56bbc30f95b56201e81a7a76d13c6037b`.
3. `future-design/approved/devices-details-forms-batch-04.html` at the same pinned commit, specifically the Device Details window with tabbed header, scrollable body and fixed footer.

This is an **employee-facing** screen; it deliberately has no IT dashboards, technician reports, assignment/priority controls, or internal IT notes.

## Layout and interactions represented

- **My Tickets**: linked to equipment *currently assigned personally* to the logged-in employee. This may include tickets created by IT for that equipment.
- **Department Tickets**: linked to shared equipment *currently assigned to the employee's actual Department*. All permitted current members can see authorised employee-visible ticket content, including tickets raised by colleagues.
- A Department-shared equipment ticket appears in **Department Tickets only**, even where the signed-in employee originally created it. No duplication across the two tabs.
- Three clickable status totals: **Open, In Progress, On Hold**. Default queue filter **Open**, alongside status/equipment search, Clear Filters, and sorting.
- Searchable employee-safe seven-column table: **Ticket**, **Requester**, **Device / Asset**, **Priority**, **Status**, **Assigned To**, **Actions**. The sort/dropdown are narrower in scope than the protected shared IT queue.
- **Ticket Details** opens as the approved modal with **Overview, Updates, History** tabs, with only employee-authorised data. The Resolution Note appears for Closed tickets; the On Hold reason appears when relevant. Internal reassignment reasons and private IT notes are not included.
- **Updates** allows an employee reply (and optional file-selection preview) on Open, In Progress and On Hold tickets. Closed tickets cannot be replied to until the employee explicitly selects **Reopen Ticket**, retaining the same ticket ID and assignee.
- **Create Ticket** has required Device / Asset, Ticket Category (initially blank), Subject and Description, plus optional attachment. Device dropdown shows personal and Department-shared authorised equipment. New tickets start as **Open / Medium / Unassigned**, and employees cannot choose/change IT-only priority or assignment.
- The **Software / Applications** category on a computer demonstrates a dependent affected-software field with recorded example software plus Other / Not Listed. Its exact optional/required validation behaviour is an implementation-design point for confirmation, not an addition to the approved ticket workflow.
- Attachment file-type and 10 MB per-file restrictions are simulated in JavaScript; real 100 MB ticket-total limits, file content validation/storage and permission checks must be enforced on the server later.
- Light/dark theme toggle; responsive compact sidebar and horizontally scrollable table on narrow screens; scrollable modal body with fixed header/footer.

## Screenshots included (16)

| Screenshot | Description |
| --- | --- |
| `02-my-tickets-desktop-light.png` | Personal tickets, desktop light |
| `02-my-tickets-desktop-dark.png` | Personal tickets, desktop dark |
| `02-my-tickets-mobile-light.png` | Personal tickets, mobile light |
| `02-my-tickets-mobile-dark.png` | Personal tickets, mobile dark |
| `02-department-tickets-desktop-light.png` | Purchasing shared-equipment tickets, desktop light |
| `02-department-tickets-desktop-dark.png` | Purchasing shared-equipment tickets, desktop dark |
| `02-department-tickets-mobile-light.png` | Department tickets, mobile light |
| `02-department-tickets-mobile-dark.png` | Department tickets, mobile dark |
| `02-department-ticket-details-desktop-light.png` | Department ticket Details modal, desktop light |
| `02-ticket-details-mobile-light.png` | Department ticket Details modal, mobile light |
| `02-ticket-details-mobile-dark.png` | Department ticket Details modal, mobile dark |
| `02-ticket-updates-desktop-light.png` | Employee-visible updates and reply form, desktop light |
| `02-ticket-history-desktop-light.png` | Employee-visible history tab, desktop light |
| `02-create-ticket-desktop-light.png` | Create Ticket modal, with Software dependent choice |
| `02-create-ticket-mobile-light.png` | Create Ticket modal, mobile light |
| `02-create-ticket-mobile-dark.png` | Create Ticket modal, mobile dark |

## Browser interaction checks completed

A real local Chromium rendering was exercised via Playwright `set_content` using the exact generated HTML (the environment blocks Chromium navigation to local URLs). Checks passed for:

- My Tickets versus Department Tickets data separation; both tabs default to Open and contain the right fictional ticket counts.
- Employee status filtering, search, Clear Filters, sort, and responsive desktop/mobile screenshot captures.
- Viewing Overview / Updates / History and employee-visible On Hold reason.
- Employee reply on an active ticket, with no real notification.
- Closed ticket reply unavailable until explicit reopen; reopening retains ticket identity and assignee in demonstration data.
- Create form empty required Category / Device selectors, Software dependent options, rejected `.exe` file selection, permitted `.txt` selection, resulting Open / Medium / Unassigned sample ticket, recorded software and filename on local sample message.
- Responsive mobile pop-up renders without document-level horizontal overflow.
- No JavaScript page errors observed in the tested browsers.

These are **preview-only interaction checks**. They do not establish backend security, delivery of notification emails, database persistence, deployment readiness, or native end-to-end acceptance.

## Owner-approved data/permission rules not simulated as live security

The live feature must enforce Staff↔login linking, current direct equipment assignment, current Department membership, equipment optional-feature gating, reassignment privacy, document/attachment parent visibility and server-side authorisation on every list, detail, reply, search, reopen and file endpoint. A former equipment holder's private conversation must **never be exposed to a later holder merely because the equipment moved**. Unrelated Department tickets and employee-private IT notes must remain inaccessible. The standalone preview contains deliberately fictional permitted data; the in-browser filters are **not** security controls.

## Change boundary

**Design-only repository reference:** This HTML, its design notes and the accepted reference screenshots are saved under `future-design/stage-5-previews/` on branch `docs/milestone-01-stage-2-3-previews`, alongside Design 01. No application implementation, PR, merge, release or deployment is authorised. `milestone-1` and Stage 4 remain untouched.