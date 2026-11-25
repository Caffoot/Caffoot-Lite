# Stage 6.6 Batch 3 development evidence

**Draft v2.2, schema 31.** This record covers development checks for #454 and #459. The integration baseline was `8d5b36bbb6e7778ba708653a496e31761edc5cef`. Local acceptance is in progress in [draft PR #467](https://github.com/Caffoot/Caffoot-Lite/pull/467).

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
| IPAM, catalogue and rack classic scrollbar corners | `ec13fd7a8803b01ec581ff06972d4aa0e717fb9f` | Visual fixture with optional features enabled. Chromium classic scrollbars, mobile dark at 390 × 844. |
| Closed Department ticket | `ec13fd7a8803b01ec581ff06972d4aa0e717fb9f` | Fictional assigned equipment and tickets seeded with the existing Service Desk HTTP fixture. Mobile dark at 390 × 844. |
| Audit Trail, My Equipment and first-run setup | `6af9c8699bf3f65dcc8975947a2b6a5fc259e138` | Fictional Audit Trail differences and linked employee with a long recorded software list. Setup uses the first-run visual fixture. Mobile dark at 390 × 844. |
| Supplier Directory, Details, Add Supplier, Purchasing and Issue Details | `dff3692046936cee21e949fdd3b0627ef58f1c45` | `tests/suppliers-interface.cjs` fictional Supplier workflow. Desktop at 1440 × 1050 and mobile at 390 × 844. |
| Reissue and physical return of an unassigned device | `dff3692046936cee21e949fdd3b0627ef58f1c45` | Existing stock fixtures in `tests/device-stock-interface.cjs` and `tests/unassigned-device-return-interface.cjs`. Mobile at 390 × 844. |
| Issued device write-off and movement history | `f162610791ba839346894ea88aa24569af1d8d08` | `tests/stock-circulation-interface.cjs`. Mobile at 390 × 844 and desktop at 1440 × 1050. |

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
- **Additional classic scrollbar checks** in mobile dark on [Add Single Subnet](screenshots/classic-single-subnet-dark-390.png), [Manage Device Types](screenshots/classic-device-types-dark-390.png), [rack placement](screenshots/classic-rack-placement-dark-390.png), [Audit Trail Details](screenshots/classic-audit-dark-390.png) and [My Equipment Details](screenshots/classic-equipment-details-dark-390.png).
- **Additional dark views** of a [closed Department ticket](screenshots/department-ticket-closed-dark-390.png) and the [first-run welcome screen](screenshots/first-run-welcome-dark-390.png).

- **Suppliers** with the directory in [desktop light](screenshots/supplier-directory-light-1440.png) and [mobile light](screenshots/supplier-directory-light-390.png), Details in [desktop light](screenshots/supplier-details-light-1440.png) and [desktop dark](screenshots/supplier-details-dark-1440.png), and Add Supplier showing the [first Contact in mobile dark](screenshots/supplier-add-contact-dark-390.png).
- **Purchasing and Supplier Issues** with the [Purchasing Dashboard in desktop light](screenshots/purchasing-dashboard-light-1440.png) and [Issue Details in mobile dark](screenshots/supplier-issue-details-dark-390.png).
- **Stock** with [canonical device reissue](screenshots/stock-reissue-dark-390.png), [return of an unassigned device](screenshots/stock-unassigned-return-dark-390.png) and [issued device write-off](screenshots/stock-issued-writeoff-dark-390.png) in mobile dark, plus [Movement History in desktop light](screenshots/stock-movement-history-light-1440.png).

## Rendered screen and component coverage

**Four views** refers to both themes at 1440 × 960 and 390 × 844 unless a row records a different size. **Partial** records the observed views and the remaining acceptance work. The previous baseline readiness audit informs the scope. Its results do not establish acceptance of the candidate.

| Area | Observed on the candidate | Still to verify |
| --- | --- | --- |
| Navigation and Dashboard | Main heading, Overview, Network Insights, Activity & Alerts and Lifecycle tabs in four views. Sidebar focus measured in both themes. Enter and Space on the IT group, Devices selected state and empty and populated Dashboard variants passed in four views. A real Supplier feature toggle hid and restored its sidebar entry. | Additional permission-disabled navigation states. |
| Devices | Main heading, Overview, Inventory, all six catalogue tabs, nine Hypervisor details tabs and all five Add Device editor tabs in four views. Body-mounted Device Type search popup opened and closed by Escape with focus return. Canonical allocation and linked ticket navigation exercised by the equipment fixture. All five Device Intelligence views passed in four views. Devices-only basic IPv4 and optional IPAM passed. A reservation held by another account kept Device Details readable and disabled editing in four views. | Additional catalogue and associated equipment dialogue states, other device type and data variants, and dark utility and inline colours. |
| IP Address Management | Overview, Addresses and Manage tabs. Single, bulk and generator dialogues checked in four views, including classic scrollbar clipping. Capacity, overlap, independent networks, linked-child and empty-block safeguards passed. Dark standalone subnet label was corrected and rechecked. | Additional IP allocation error and active/disabled states. |
| Network Racks | Overview, Inventory and Accessories, Capacity, Equipment and Locations & Types, and Rack View, Equipment and Rack Settings tabs in four views. Front/rear switching and selected tab focus passed. Rack forms, classic scrollbar corners, dimensions, add/save and print document comparison passed. Specialist storage, switch and hypervisor graphics rendered in four views. | Native rack print preview deferred to planned native acceptance. |
| Permissions | Overview header and Create Role rest and hover foreground in four views. Dark editor input surface, border, foreground and keyboard focus sampled. Checked and disabled Create Role switch, invalid-name feedback, keyboard containment and Escape focus return passed in four views. | Additional Manage Roles row, hover and editing variants. |
| Settings & Data | All six main Settings tabs, Email Templates and Company Branding tabs, and the Excluded Dates picker in four views. Dark picker surface measured. Existing Service Desk reporting and Email Templates workflow tests passed. Branded email preview retained white on #213D56 and #294157 on white in four views. Publish was disabled without a draft. SMTP required fields and port range, unencrypted warning and disabled credential fields, inventory safety and cancellation of protected Clear System all passed in four views. Optional Features checked enabled, disabled and pending controls, a failed save and state restoration in four views. | Additional backup, migration and option form states. |
| Audit Trail | All Activity, Asset History and Recording Coverage tabs in four views. Empty filter results, affected-record identity, Asset History, Escape focus return, a classic scrollbar with 19 safe field changes and the Recorded, In development and Permission protected coverage states checked in four views. | Additional recording error states. |
| My Account | Overview, Security, Help and About tabs in four views. Keyboard appearance selection, reload persistence and System following the browser theme passed. Recovery suite checked personal details, passwords, optional MFA and recovery. | Additional rendered account-state variants. |
| My Equipment | Personal/shared access, search, focus return, both individual feature settings and inactive Staff gate passed. Long Details overflow checked in both mobile themes. Delayed load, dark error and Try Again passed. | Additional detail and disabled-state variants. |
| IT Service Desk | Queue heading and workload focus and selection contrast in four views. Reporting and ticket lifecycle covered. Long category layout, footer states, Cancel, read-only details, loading/error dismissal and focus return passed. | Additional attachment and long-conversation visual cases. |
| My Tickets and Department Tickets | Personal Updates, employee attachment, hidden internal note, History, On Hold reason and closed Department ticket in four views. Create, reply with attachment and Department reopen passed in four views. Confidentiality and no-eligible-equipment states passed. | Focused employee ticket coverage complete. |
| Staff Members and Staff Details | Directory, details and Add/Edit headings in four views. Staff CRUD, status and independent login/custody exercised. Add Staff Member and Create Role matched in rest and hover in four views. The Staff browser suite covered save and status conflicts. | Remaining Staff form palette, disabled/inactive and narrow-screen error variants. |
| Manage Permissions and Review Access | MFA placement, active and disabled account colour pairs, classic scrollbar clipping and Escape focus return from Review Access checked in four views. A short Review Access preview also passed. Server confirmation exercised by role suite. Own-administrator warning and disabled controls and overrides passed in four views. | Additional account-role and failure variants. |
| Departments | Directory and Details headings in four views. Details browser suite passed with 28 captures, including equipment, Staff, history, archived, empty and restricted views. Manage Department showed server validation and Cancel retained the stored name in four views. | Focused Department coverage complete. |
| IT Assets | All nine stock tabs in four views. Receipt, readiness, inventory, history, issue, return, associated equipment and correction suites passed. Direct handover and classic scrollbar checked. Canonical reissue, physical return of an unassigned device, issued and held write-off, and movement history passed with genuine desktop and mobile captures in both themes. | Focused stock coverage complete. |
| Purchasing and Suppliers | Approved headers and five Details tabs in four views, plus edit cancellation, archive and reactivate. Complete Supplier browser suite passed, including independent Lifecycle switch, restricted access, company and contact workflows, Categories, Issue details and progression, update correction, Purchasing and navigation. Fresh desktop and mobile captures cover both themes. | Additional restricted and unusual rendered data variants. |
| Public sign-in, setup and recovery | Sign-in and MFA sign-in tested and captured in four views. Username focus measured. First-run workflow tested in both themes at 1440 × 950 and 390 × 844. Recovery suite verified real recovery, wrong proof and MFA rejection, focus order, Back and session revocation. Recovery request and reset input text contrast passed in four views. First-run captures mask fixture authenticator material. | Additional recovery feedback colour states. |
| Shared search and modal controls | Body-mounted Device Type search and live UK date popup verified. Classic inner scrolling checked for Manage Permissions, Review Access, Reassign Device, IPAM records, catalogue, racks, Audit Trail Details, My Equipment Details and both legacy import reviews. | Remaining specialised selectors and less common dialogue variants. |
| Shared colour states | Computed colours sampled for ordinary primaries, keyboard focus, selection, role inputs, semantic account panels and static readable text on 16 dark screen areas at both sizes. Corrected the standalone IPAM label that had 4.43:1 contrast. | Contrast and layout for the outstanding interaction and data variants above. |

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
- Complete Chromium stock circulation suite passed, including Issue Equipment confirmation, mixed returns, preparation, issued and held write-off, movement records and employee equipment privacy. The test now targets the original My Equipment sidebar button by its exact accessible name. The approved shortcut shares the same underlying action. The suite produced 52 genuine captures.
- Chromium device stock registration and reissue, unassigned device return and optional IPAM suites passed.
- Evidence and draft guide links resolve. The collected PNGs passed file-integrity validation. The complete browser compatibility and Docker workflows remain pending. CI was not polled.

Initial targeted browser attempts corrected harness selectors for the live Permissions title, hidden ticket modal and duplicate Supplier Issues actions. The mobile ticket footer check now accounts for button wrapping. These were harness corrections. Candidate visual coverage remains as listed above.

The resumed checkpoint verified focus and selected markers using actual Chromium computed colours. All 52 tab-group and popup checks passed across the four views. Another 20 checks covered Device Details, Add Device, rack details, subnet dialogues and sign-in focus. The fixture needed to confirm Discard Changes after visiting the editor tabs, wait for the asynchronous rack face change and use a distinct port when retrying.

Add Staff Member and Create Role used the same resting orange and navy in all four views. Their rendered hover foregrounds matched, with a minimum contrast of 5.70:1 against the existing hover fills. The backup command buttons inside the always-navy Data & Backups panels use the existing light-on-navy focus colour in light mode. The dark-mode focus colour was sampled at 8.30:1 against the surrounding command surface. The command fixture passed after narrowing the selector to the Data & Backups tab.

Manage Permissions, overflowing Review Access and Reassign Device each had a 15 px classic scrollbar on their inner scrolling surface. The shells clipped the right-hand boundary and kept both right corner radii at 18 px for permission dialogues and 16 px for Reassign Device. Each scrollable surface reached its end. A 396 px-high Review Access preview and Reassign Device at 1440 × 1300 had no scrollbar gutter. Review Access Escape returned focus to the initiating selector. Reassign Device Cancel retained the original recipient, inventory and stock. The nested short preview check passed after the fixture targeted the topmost dialogue.

Classic scrollbars also exposed square right edges in the single and bulk IPAM forms, catalogue manager, rack forms, long My Equipment Details and long Audit Trail Details. The same clipped-shell pattern corrected those cases. The named forms kept their existing padding and dimensions. Their short variants remained scrollbar-free and overflowing variants reached the end. IPAM and rack changes saved and were present in inventory state. A catalogue addition remained after reload. The functional fixture used the actual block submit control and checked catalogue persistence after a reload rather than treating it as a top-level inventory field.

The stock intake suite initially expected white primary button text, which conflicted with the approved #454 navy. The assertion now checks the exact approved navy and still checks the orange fill. Stock intake, stock corrections, Associated Equipment, Department Details, protected import, recovery, first-run and the targeted ticket states passed. The first stock circulation invocation reached write-off and then stopped on an ambiguous My Equipment selector. The complete suite passed after the test selected the sidebar button by accessible name. The original Supplier suite stopped at line 122 because it expected the Equipment Lifecycle feature control to be absent. The same failure was reproduced on the unchanged integration baseline.

Three focused Supplier HTTP tests passed for access and feature toggles, issue lifecycle and audit, and company, location, contact and category handling. The owner subsequently authorised the Supplier assertion correction. The complete Supplier browser suite then passed with the independent Lifecycle switch present and disabled both before and after enabling Suppliers. [Owner authorisation](https://github.com/Caffoot/Caffoot-Lite/pull/467#issuecomment-7174107386)

The subnet capacity and Issue #306 checks passed, including 24 editor form cases, rack dimensions, save/reload, nested subnet draft return and unchanged print document geometry. Both legacy import review forms put their 15 px classic scrollbar inside their existing inner lists. The first probe assumed the outer shell would scroll. The follow-up measured the inner lists and confirmed no outer overflow in any of the four views.

The employee fixture created Department tickets and persisted replies and attachments using the interface. A separate run waited for the successful reopen response before checking the new Open state. A delayed IT details response verified that Close Window dismisses the loading dialogue and restores focus. The My Equipment failure fixture verified a real retry against the disposable installation after a temporary 503. The dark text sample checks visible text on simple backgrounds. Disabled controls, imagery and unvisited interaction or data variants require separate review.

## Continuation

Native rack print preview is deferred to the planned native acceptance stage. The local print document comparison is recorded above. Native desktop and print preview checks do not count towards the Batch 3 local result.

The supplemental Optional Features browser suite stopped before opening Settings at the same point on the candidate and the unchanged integration baseline. After fetching its pinned HTML reference, the fixture's owner session redirected to sign-in and the suite timed out waiting for the application. The focused Optional Features checks above used a working local HTTPS session and verified the feature and navigation states separately.

The owner approved the exact light-mode values on 25 November 2026. They are implemented and tested at `8ccdf6029ea7b487323755d503c7adf77d56148b`. [Owner colour approval](https://github.com/Caffoot/Caffoot-Lite/issues/454#issuecomment-7172311461)

The owner approved the rounded-dialogue screenshots. Use the “Still to verify” column for the remaining local interaction and data variants. Record the application revision and local results for each new capture. Keep #467 in draft until required local verification and evidence are complete. Independent CI and owner visual acceptance follow that checkpoint.
