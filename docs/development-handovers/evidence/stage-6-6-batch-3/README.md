# Stage 6.6 Batch 3 development evidence

**Draft v2.2, schema 31.** This record covers development checks for #454 and #459. The integration baseline was `8d5b36bbb6e7778ba708653a496e31761edc5cef`. Implementation and acceptance are in progress in [draft PR #467](https://github.com/Caffoot/Caffoot-Lite/pull/467).

## Capture provenance

Captures came from headless Chromium 155 on Linux, running the repository's actual HTTPS application with disposable SQLite databases and fictional records. The main viewport sizes were 1440 × 960 and 390 × 844. The account and role captures were taken with the full page option. Individual viewport exceptions are listed below. The original acceptance evidence for earlier batches remains in its dated folders.

| Capture | Application revision | Fixture and viewport |
| --- | --- | --- |
| Network Racks | `d734910ae86115a6b2f41067d70cd912500b99c7` | `tests/visual_fixtures.py` with optional features enabled. Desktop and mobile, both themes. |
| Ticket Details | `d734910ae86115a6b2f41067d70cd912500b99c7` | Reporting fixture under `tests/fixtures/service_desk_reporting.py`; long category saved through Ticket Details. Desktop and mobile, both themes. |
| Manage Permissions, account controls and Review Access | `d734910ae86115a6b2f41067d70cd912500b99c7` | Disposable roles fixture with a linked colleague account. Desktop and mobile, both themes. |
| Sign-in | `d734910ae86115a6b2f41067d70cd912500b99c7` | Fictional Stage 6.6 sign-in test installation. Desktop and mobile, both themes. |
| My Account shortcut and Staff Details | `d734910ae86115a6b2f41067d70cd912500b99c7` | `tests/device-assignments-interface.cjs` linked employee and administrator views. 1440 × 950 and 390 × 844. |
| Reassign Device | `d734910ae86115a6b2f41067d70cd912500b99c7` | `tests/device-handover-interface.cjs` with the fictional registered-device handover fixture. 390 × 1050 dark. |

## Application screenshots

- **Network Racks** in [desktop light](screenshots/header-racks-light-1440.png), [desktop dark](screenshots/header-racks-dark-1440.png), [mobile light](screenshots/header-racks-light-390.png) and [mobile dark](screenshots/header-racks-dark-390.png).
- **Ticket Details** with a long category in [desktop light](screenshots/ticket-details-light-1440.png), [desktop dark](screenshots/ticket-details-dark-1440.png), [mobile light](screenshots/ticket-details-light-390.png) and [mobile dark](screenshots/ticket-details-dark-390.png).
- **Manage Permissions and Review Access** with the MFA warning shown in [desktop light](screenshots/manage-permissions-warning-light-1440.png) and [mobile dark](screenshots/manage-permissions-warning-dark-390.png), plus the [desktop dark Review Access preview](screenshots/review-access-dark-1440.png).
- **Account controls** showing an active account in [desktop light](screenshots/account-active-light-1440.png) and [desktop dark](screenshots/account-active-dark-1440.png) and a disabled account in [mobile light](screenshots/account-disabled-light-390.png) and [mobile dark](screenshots/account-disabled-dark-390.png).
- **Employee shortcut and Staff status** with [My Account desktop light](screenshots/my-account-1440-light.png), [My Account mobile light](screenshots/my-account-390-light.png), [active Staff Details desktop light](screenshots/staff-1440-light.png) and [inactive Staff Details mobile dark](screenshots/staff-inactive-390-dark.png).
- **Reassign Device** with the [registered-device confirmation controls in mobile dark](screenshots/direct-handover-footer-registered-mobile-dark.png).
- **Sign-in** in [desktop dark](screenshots/sign-in-dark-1440.png) and [mobile light](screenshots/sign-in-light-390.png).

## Rendered screen and component coverage

**Four views** refers to both themes at 1440 × 960 and 390 × 844 unless a row records a different size. **Partial** records the observed views and the remaining acceptance work. The previous baseline readiness audit informs the scope. Its results do not establish acceptance of the candidate.

| Area | Observed on the candidate | Still to verify |
| --- | --- | --- |
| Navigation and Dashboard | Main heading in four views. Dark canvas and sidebar background measured. | Dashboard Insights and Activity, mobile group keyboard paths, sidebar selected and disabled states. |
| Devices | Main heading in four views. Device Details access, canonical allocation and linked ticket navigation exercised by the equipment fixture. | Overview and intelligence tabs, inventory search and filters, every Device Details and editor tab, catalogue and associated equipment dialogues, reservations, and dark utility and inline colours. |
| IP Address Management | Main heading and retained Add Multiple Subnets contextual label in four views. | Overview, Addresses and Manage, individual/edit/bulk and generator/review forms, errors, active selection, and short and overflowing classic scrollbar states. |
| Network Racks | Overview heading and intact Rack Overview in four views. | Capacity, Equipment and Locations tabs in detail, inventory/accessory views, rack front/rear, management dialogues, print and specialist equipment visual regression. |
| Permissions | Overview header and Create Role rest and hover foreground in four views. Dark editor input surface, border, foreground and keyboard focus sampled. | Full Manage Roles and role editor colour/state audit, including checked, disabled, hover, errors and selected-state indicators. |
| Settings & Data | Main heading in four views. Service Desk settings, categories, hours, excluded dates, reporting and the existing Email Templates browser workflows tested. | Full Data, Email, Email Templates, Maintenance, Features, migration, backup/restore and options visual matrix. Verify email preview colours and the live UK date popup in dark mode. |
| Audit Trail | Main heading in four views. | Activity, Assets and Coverage variants, filters, detail dialogue, identities and empty/error states. |
| My Account | Heading in four views. Linked employee shortcut navigated to existing My Equipment view. Screenshots show the shortcut at desktop/mobile widths. | Help, About, appearance interactions, all Security forms and MFA recovery states on the palette checkpoint. |
| My Equipment | Main heading in four views. Equipment suite verified linked personal/shared access, retained details, search and Escape behaviour. The shortcut is absent with an inactive Staff link. | Rendered details, empty and loading/error palette states, independent feature-disabled shortcut visibility, and dark semantic colours. |
| IT Service Desk | Queue heading in four views. Reporting settings, queue and fixture lifecycle states exercised. Ticket Details in four views with long category, pencil controls above saved values, footer placement, Cancel and dismissal focus return. | Read-only details, loading/error dismissal, all Updates and History states, ticket attachments, and light-mode focus/selected indicators. |
| My Tickets and Department Tickets | My Tickets heading and Department Tickets tab selection in four views. Linked-account tests exercised related equipment-to-ticket navigation. | Create/details, replies, attachments, held/closed/reopened, requests without eligible equipment, and privacy variants at both sizes. |
| Staff Members and Staff Details | Directory, details and Add/Edit headings in four views. Staff CRUD, status and independent login/custody exercised. | Dark palette for each details/form state, disabled/inactive controls, Add Staff Member versus Create Role rendered comparison, and narrow-screen error states. |
| Manage Permissions and Review Access | MFA placement, active and disabled account colour pairs, outer clipping, inner scrolling and Escape focus return from Review Access checked in four views. Server confirmation exercised by role suite. | Explicit classic-scrollbar width and rounded-corner inspection, short and overflowing cases, and all account-role, self-protection and failure variants across four views. |
| Departments | Directory and Department Details headings in four views. Directory create and Staff membership covered by focused Staff suite. | Details tabs, edit/archive, equipment, members, history and restricted views in both themes. |
| IT Assets | Overview heading in four views. Direct handover exercised with Devices-only and registered custody. | Stock tabs and all receipt, issue, return, write-off, reissue, correction and movement states in both themes. Reassign Device needs explicit classic-scrollbar measurement. |
| Purchasing and Suppliers | Purchasing Dashboard, Suppliers, Supplier Issues and Supplier Details headings in four views. | Locations and contacts, categories, archival/reactivation, change forms, permission variants and header spacing. |
| Public sign-in, setup and recovery | Sign-in and MFA sign-in tested and captured at four sizes/themes. Unauthenticated navigation and required MFA checks exercised. | First-run/setup and recovery four-view visual coverage, input/disabled/focus states, and preserved QR scan background. |
| Shared search and modal controls | Role fields, IPAM context and ticket modal sampled. | Body-mounted search popup, native and custom selectors, all remaining short and overflowing dialogue families, dropdowns and classic scrollbars. |
| Shared colour states | Computed colours sampled for ordinary primaries and dark theme roles. | Full actual contrast, focus, active, selected, disabled, semantic and unaffected light-mode comparisons for each screen above. |

## Contrast sampled

Ratios below are calculated from the palette and compared with sampled Chromium computed colours. The table does not establish visual acceptance of every control or every state.

| Pair | Ratio |
| --- | ---: |
| #142B43 on #ED8532, ordinary primary resting | 5.49:1 |
| #0F172A on #D87327, standard primary hover | 5.44:1 |
| #F1F5F9 on #223448, dark panel text | 11.60:1 |
| #C0CDDD on #223448, dark panel secondary text | 7.88:1 |
| #72869A against #223448 and #1B2C3E, dark control boundary | 3.38:1 and 3.79:1 |
| #9DC9FF against #223448, dark keyboard focus | 7.40:1 |
| #AD5010 on #FFF3E4 and #FAF1DD, light badges | 4.88:1 and 4.75:1 |
| #B0EBCD on #234B40, dark success | 7.25:1 |
| #FDE68A on #503B28, dark warning | 8.44:1 |
| #FECDD3 on #4C2D3A, dark danger | 8.54:1 |
| #FFB77D on #223448, dark links | 7.45:1 |

## Focused local checks

- Python modular interface contract, including pinned stylesheet provenance and template resolution. Two tests passed.
- Chromium Staff directory and device assignment suites. Status changes, existing login and custody independence, linked and inactive My Equipment shortcut cases, personal and Department boundaries, and equipment details keyboard operation passed.
- Chromium users and roles suite. Server-computed access review, stale confirmation, MFA enrolment, guardrails, protected accounts and account controls passed. The targeted candidate follow-up also checked both account-status palettes and Review Access Escape focus return in four views.
- Chromium Service Desk reporting and ticket details suite. Settings, reporting, permissions, footer states, category save, priority cancel, layout and dismissal passed.
- Chromium direct handover suite. Devices-only and registered handover, cancellation and privacy passed.
- Chromium sign-in and navigation suite and 11 Python required MFA HTTP tests passed.
- UK date control unit checks and Chromium Email Templates workflows passed. The first Email Templates invocation could not find Playwright's bundled browser. The retry used the workspace's system Chromium.
- Evidence and draft guide links resolve. The collected PNGs passed file-integrity validation. The complete browser compatibility and Docker workflows remain pending. CI was not polled.

Initial targeted browser attempts corrected harness selectors for the live Permissions title, hidden ticket modal and duplicate Supplier Issues actions. The mobile ticket footer check now accounts for button wrapping. These were harness corrections. Candidate visual coverage remains as listed above.

## Continuation

The exact light-mode keyboard focus and selected-indicator references are awaiting owner confirmation. Complete that part of #454 after receiving the two values, then complete the outstanding rendered checks above and update the affected draft-guide screenshots. Record the application revision and local results for each added capture. Keep #467 in draft until implementation, required local verification and evidence are complete. Independent CI and owner visual acceptance follow that checkpoint.
