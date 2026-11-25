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
| Light focus and selected workload | `8ccdf6029ea7b487323755d503c7adf77d56148b` | `tests/visual_fixtures.py` with optional features enabled. Chromium at 1440 × 960 and 390 × 844. |
| Classic scrollbar corners | `8ccdf6029ea7b487323755d503c7adf77d56148b` | Roles and direct handover fixtures. Chromium headless with its hidden-scrollbar argument removed and overlay scrollbars disabled. |

## Application screenshots

- **Network Racks** in [desktop light](screenshots/header-racks-light-1440.png), [desktop dark](screenshots/header-racks-dark-1440.png), [mobile light](screenshots/header-racks-light-390.png) and [mobile dark](screenshots/header-racks-dark-390.png).
- **Ticket Details** with a long category in [desktop light](screenshots/ticket-details-light-1440.png), [desktop dark](screenshots/ticket-details-dark-1440.png), [mobile light](screenshots/ticket-details-light-390.png) and [mobile dark](screenshots/ticket-details-dark-390.png).
- **Manage Permissions and Review Access** with the MFA warning shown in [desktop light](screenshots/manage-permissions-warning-light-1440.png) and [mobile dark](screenshots/manage-permissions-warning-dark-390.png), plus the [desktop dark Review Access preview](screenshots/review-access-dark-1440.png).
- **Account controls** showing an active account in [desktop light](screenshots/account-active-light-1440.png) and [desktop dark](screenshots/account-active-dark-1440.png) and a disabled account in [mobile light](screenshots/account-disabled-light-390.png) and [mobile dark](screenshots/account-disabled-dark-390.png).
- **Employee shortcut and Staff status** with [My Account desktop light](screenshots/my-account-1440-light.png), [My Account mobile light](screenshots/my-account-390-light.png), [active Staff Details desktop light](screenshots/staff-1440-light.png) and [inactive Staff Details mobile dark](screenshots/staff-inactive-390-dark.png).
- **Reassign Device** with the [registered-device confirmation controls in mobile dark](screenshots/direct-handover-footer-registered-mobile-dark.png).
- **Sign-in** in [desktop dark](screenshots/sign-in-dark-1440.png) and [mobile light](screenshots/sign-in-light-390.png).
- **Light focus and selected workload** in [desktop light](screenshots/service-desk-focus-light-1440.png) and [mobile light](screenshots/service-desk-focus-light-390.png).
- **Classic scrollbar corners** in [Manage Permissions mobile dark](screenshots/classic-manage-dark-390.png), [Review Access desktop light](screenshots/classic-review-light-1440.png), and [Reassign Device mobile dark](screenshots/classic-reassign-dark-390x844.png). The [short Review Access preview](screenshots/classic-review-short-light-1440.png) and [taller Reassign Device view](screenshots/classic-reassign-light-1440x1300.png) show the same corners without a scrollbar.

## Rendered screen and component coverage

**Four views** refers to both themes at 1440 × 960 and 390 × 844 unless a row records a different size. **Partial** records the observed views and the remaining acceptance work. The previous baseline readiness audit informs the scope. Its results do not establish acceptance of the candidate.

| Area | Observed on the candidate | Still to verify |
| --- | --- | --- |
| Navigation and Dashboard | Main heading, Overview, Network Insights, Activity & Alerts and Lifecycle tabs in four views. Sidebar focus measured in both themes. | Mobile group keyboard paths, sidebar selected and disabled states, and Dashboard empty and populated variants. |
| Devices | Main heading, Overview, Inventory, all six catalogue tabs, nine Hypervisor details tabs and all five Add Device editor tabs in four views. Body-mounted Device Type search popup opened and closed by Escape with focus return. Canonical allocation and linked ticket navigation exercised by the equipment fixture. | Intelligence breakdown tabs, catalogue and associated equipment dialogues, reservations, other device type and data variants, and dark utility and inline colours. |
| IP Address Management | Overview, Addresses and Manage tabs. Single and Multiple Subnets dialogues opened and dismissed by Escape in four views. | Edit/bulk and generator/review forms, errors, active selection, and short and overflowing classic scrollbar states. |
| Network Racks | Overview, Inventory and Accessories, Capacity, Equipment and Locations & Types, and Rack View, Equipment and Rack Settings tabs in four views. Front/rear switching passed. Selected main rack tab and its focus indicator measured. | Management dialogues, print and specialist equipment visual regression. |
| Permissions | Overview header and Create Role rest and hover foreground in four views. Dark editor input surface, border, foreground and keyboard focus sampled. | Full Manage Roles and role editor colour/state audit, including checked, disabled, hover, errors and selected-state indicators. |
| Settings & Data | All six main Settings tabs, Email Templates and Company Branding tabs, and the Excluded Dates picker in four views. Dark picker surface measured. Existing Service Desk reporting and Email Templates workflow tests passed. | Data, Email, Email Templates, Maintenance, Features, migration, backup/restore and options form and state variants. Inspect email preview colours. |
| Audit Trail | All Activity, Asset History and Recording Coverage tabs in four views. | Activity, Assets and Coverage data variants, filters, detail dialogue, identities and empty/error states. |
| My Account | Overview, Security, Help and About tabs in four views. Linked employee shortcut navigated to existing My Equipment view. | Appearance interactions, all Security forms and MFA recovery states on the palette checkpoint. |
| My Equipment | Main heading in four views. Equipment suite verified linked personal/shared access, retained details, search and Escape behaviour. The shortcut is absent with an inactive Staff link. | Rendered details, empty and loading/error palette states, independent feature-disabled shortcut visibility, and dark semantic colours. |
| IT Service Desk | Queue heading and workload focus and selection contrast in four views. Reporting settings, queue and fixture lifecycle states exercised. Ticket Details in four views with long category, pencil controls above saved values, footer placement, Cancel and dismissal focus return. | Read-only details, loading/error dismissal, all Updates and History states and ticket attachments. |
| My Tickets and Department Tickets | My Tickets heading and Department Tickets tab selection in four views. Linked-account tests exercised related equipment-to-ticket navigation. | Create/details, replies, attachments, held/closed/reopened, requests without eligible equipment, and privacy variants at both sizes. |
| Staff Members and Staff Details | Directory, details and Add/Edit headings in four views. Staff CRUD, status and independent login/custody exercised. | Dark palette for each details/form state, disabled/inactive controls, Add Staff Member versus Create Role rendered comparison, and narrow-screen error states. |
| Manage Permissions and Review Access | MFA placement, active and disabled account colour pairs, classic scrollbar clipping and Escape focus return from Review Access checked in four views. A short Review Access preview also passed. Server confirmation exercised by role suite. | Additional account-role, self-protection and failure variants across four views. |
| Departments | Directory and Department Details headings in four views. Directory create and Staff membership covered by focused Staff suite. | Details tabs, edit/archive, equipment, members, history and restricted views in both themes. |
| IT Assets | All nine stock tabs in four views. Direct handover exercised with Devices-only and registered custody. Reassign Device passed classic scrollbar checks in four views and at a taller viewport without a gutter. | Receipt, issue, return, write-off, reissue, correction and movement state variants in both themes. |
| Purchasing and Suppliers | Purchasing Dashboard, Suppliers, Supplier Issues and Supplier Details headings in four views. | Locations and contacts, categories, archival/reactivation, change forms, permission variants and header spacing. |
| Public sign-in, setup and recovery | Sign-in and MFA sign-in tested and captured in four views. Username keyboard focus in both themes measured. Unauthenticated navigation and required MFA checks exercised. | First-run/setup and recovery four-view visual coverage, input and disabled variants, and preserved QR scan background. |
| Shared search and modal controls | Role fields, IPAM context, ticket modal and body-mounted Device Type search popup sampled. | Remaining native and custom selectors, short and overflowing dialogue families, dropdowns and classic scrollbars. |
| Shared colour states | Computed colours sampled for ordinary primaries and dark theme roles. | Full actual contrast, focus, active, selected, disabled, semantic and unaffected light-mode comparisons for each screen above. |

## Contrast sampled

Ratios below are calculated from the palette and compared with sampled Chromium computed colours. The table does not establish visual acceptance of every control or every state.

| Pair | Ratio |
| --- | ---: |
| #142B43 against #F5F7FA, light workload keyboard focus | 13.44:1 |
| #142B43 against #FFFFFF, light role input focus | 14.42:1 |
| #AD5010 against #F5F7FA, light selected rack tab indicator | 4.98:1 |
| #AD5010 against #FFFFFF, light selected workload card edge | 5.34:1 |
| #F4A569 against #142B43, existing light-on-navy sidebar focus | 7.16:1 |
| #F4A569 against #182C40 and #2A455D, light theme backup command focus | 7.08:1 and 4.95:1 |
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

The resumed checkpoint verified focus and selected markers using actual Chromium computed colours. All 52 tab-group and popup checks passed across the four views. Another 20 checks covered Device Details, Add Device, rack details, subnet dialogues and sign-in focus. The fixture needed to confirm Discard Changes after visiting the editor tabs, wait for the asynchronous rack face change and use a distinct port when retrying.

Add Staff Member and Create Role used the same resting orange and navy in all four views. Their rendered hover foregrounds matched, with a minimum contrast of 5.70:1 against the existing hover fills. The backup command buttons inside the always-navy Data & Backups panels use the existing light-on-navy focus colour in light mode. The dark-mode focus colour was sampled at 8.30:1 against the surrounding command surface. The command fixture passed after narrowing the selector to the Data & Backups tab.

Manage Permissions, overflowing Review Access and Reassign Device each had a 15 px classic scrollbar on their inner scrolling surface. The shells clipped the right-hand boundary and kept both right corner radii at 18 px for permission dialogues and 16 px for Reassign Device. Each scrollable surface reached its end. A 396 px-high Review Access preview and Reassign Device at 1440 × 1300 had no scrollbar gutter. Review Access Escape returned focus to the initiating selector. Reassign Device Cancel retained the original recipient, inventory and stock. The nested short preview check passed after the fixture targeted the topmost dialogue.

## Continuation

The owner approved the exact light-mode values on 25 November 2026. They are implemented and tested at `8ccdf6029ea7b487323755d503c7adf77d56148b`. [Owner colour approval](https://github.com/Caffoot/Caffoot-Lite/issues/454#issuecomment-7172311461)

Resume with the outstanding states in the coverage matrix and extend the existing browser fixtures to verify them. Record the application revision and local results for each new capture. Keep #467 in draft until implementation, required local verification and evidence are complete. Independent CI and owner visual acceptance follow that checkpoint.
