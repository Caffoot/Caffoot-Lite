# Caffoot Lite — Stage 5 Service Desk Settings — HTML Design 03

**Status:** **Product-owner visually approved Service Desk Settings — HTML Design 03** on 18 November 2026 ("that is just lovely :) well done mate really really good, i approve that mate"). This is an approved browser-rendered design reference, **not application implementation or acceptance of backend behaviour**. Preserved in `future-design/stage-5-previews/` on the existing `docs/milestone-01-stage-2-3-previews` branch.

## Visual and requirement authority

- [Approved Settings → Service Desk interactive layout](https://github.com/Caffoot/Caffoot-Lite/issues/233#issuecomment-6978780687).
- Approved Stage 5 [IT Service Desk HTML Design 01](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-5-previews/01-service-desk-it.html) and [Employee My Tickets HTML Design 02](https://github.com/Caffoot/Caffoot-Lite/blob/docs/milestone-01-stage-2-3-previews/future-design/stage-5-previews/02-my-tickets-department.html) for common layout, sidebar, form, colour, popup and responsive conventions.
- Approved v2.1 `future-design/approved/devices-inventory-draft-02.html` and `devices-details-forms-batch-04.html` at pinned commit `c26db4a56bbc30f95b56201e81a7a76d13c6037b` remain primary layout anchors.
- Relevant Service Desk issue [#233](https://github.com/Caffoot/Caffoot-Lite/issues/233). Shared email template/branding management belongs separately to [#355](https://github.com/Caffoot/Caffoot-Lite/issues/355).

## Approved surface

### Settings → Service Desk → Working Hours

- Seven independently switchable days, Monday through Sunday; one **start and end** period per enabled day. Closed days do not contribute support working time. No split shifts, lunch-break controls, overnight shifts, or new time-zone configuration.
- **09:00–17:00 weekdays, weekends closed are example entries, NOT production defaults.** No final production defaults approved.
- The existing installation-wide `TZ` determines local calendar interpretation; preserve precise UTC event timestamps.
- Employee ticket submission remains available regardless of opening hours.
- Resolution KPIs apply support calendar, single excluded dates and the deduction of overlapping On Hold intervals. Changing the calendar must not silently recalculate completed resolution attempts; forward-effective rules for in-progress attempts require a later technical contract.

### Settings → Service Desk → Excluded Dates

- Administrator adds/removes **individual calendar dates** with a reason (e.g. shutdown, holiday or training day). No external holiday API, regional calendar or recurring holiday engine.
- Example dates are fictional configuration data only. Dates are sorted chronologically; duplicate entries blocked within the demonstration.
- Removal uses an illustrative confirmation dialog. No historical ticket metrics are recalculated in this preview.

### Settings → Service Desk → Ticket Categories

- **One list** for all equipment-linked tickets; do not restore older separate "Equipment Problem" versus "General IT Support" lists or request type switch.
- Initial categories appear in approved alphabetical order: Access Permissions / Folder Access; Email / Sending & Receiving Issues; Hardware / Physical Damage; Internet Issues / Website Problems; LAN / Shared Drive Issues; Maintenance / Upgrades; Password / Access; Peripherals / Accessories; Printing / Printer Configuration; Software / Applications; User Account / Login; **Other / Not Listed** fixed last.
- Administrator may add, rename, hide and show choices. Show hidden choices in administrative management but not new ticket selection. Reject duplicate names ignoring case. Other / Not Listed is always active and cannot be renamed or hidden.
- Preserve original category identity, earlier labels, existing ticket classifications and immutable audit history in the eventual application; this illustrative JavaScript only holds local arrays.
- Employees select a category when creating a ticket but may not change it after submission. Only an authorised IT technician may correct it then.

## Design-only boundaries

- No actual backend, saved configuration, ticket creation, service email, audit log or authorisation enforcement. The simulation is **not** security/permission acceptance. Only administrators will manage these settings in the eventual application, enforced server-side.
- All inputs and edits are local to the browser tab, discarded on refresh. A “Save Working Hours” button validates but deliberately does **not** claim to persist server settings.
- Preview UI uses the approved Caffoot light/dark colours, responsive sidebar and form styles. The logo references Caffoot's pinned original logo URL; offline Chromium screenshots fall back to a clearly illustrative **C** lettermark. This fallback is NOT the approved production logo.
- Navigation items for other screens are non-navigating context in this standalone design.
- All user-facing dates/names/categories are example data; only category labels and behavioural constraints above are from approvals.

## Chromium evidence

Browser execution on 18 November 2026 using Chromium/Playwright at **1440 × 960** and **390 × 844**, device scale factor 1. Network logo loading blocked for deterministic offline screenshot capture.

**Passed within the standalone HTML:** week/day enable/disable, valid/invalid time checks; Excluded Dates add, required/duplicate checks, remove confirmation/cancellation; ticket category add, alphabetical Other-last order, duplicate check, rename/hide, fixed Other; light/dark theme switching; desktop/mobile view, no top-level horizontal page overflow, no JavaScript errors.

These are **demonstration acceptance checks only**. They do not verify server-side behaviour, history, permissions, timezone calculations or Caffoot application's actual integration.

### Screenshot index

| Area | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| Working Hours | `03-working-hours-desktop-light.png` | `03-working-hours-desktop-dark.png` | `03-working-hours-mobile-light.png` | `03-working-hours-mobile-dark.png` |
| Excluded Dates | `03-excluded-dates-desktop-light.png` | `03-excluded-dates-desktop-dark.png` | `03-excluded-dates-mobile-light.png` | `03-excluded-dates-mobile-dark.png` |
| Ticket Categories | `03-ticket-categories-desktop-light.png` | `03-ticket-categories-desktop-dark.png` | `03-ticket-categories-mobile-light.png` | `03-ticket-categories-mobile-dark.png` |
| Interaction examples | `03-rename-category-desktop-light.png`, `03-category-management-desktop-light.png`, `03-remove-date-dialog-desktop-light.png` | — | — | — |

**Preservation:** Design-only files were committed to the existing documentation-preview branch after owner approval. **No application code, `milestone-1`, Stage 4, `main`, PR merge, release or deployment** was changed.
