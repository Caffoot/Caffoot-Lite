<!-- Exact text snapshot of issue #227 captured for documentary preservation on 1 November 2026. -->

# Caffoot Lite — Agreed Premium Interface Designs

**Purpose:** A simple, permanent record of the product owner's agreed design direction for the next Caffoot Lite experience. Most screens receive a premium **visual redesign without changing their behaviour**. **Change History is an explicit exception:** the owner has already selected the direction of a more useful **Audit Trail**, which needs real functionality beyond a restyle. This document records the direction, not permission to implement code.

**Foundation:** The completed, published **Caffoot Lite v2.0.1** Docker/SQLite application.

## Design approval at a glance

| Screen | Visual design status |
| --- | --- |
| **Sign In** | ✅ Approved — branded two-panel login and conditional MFA |
| **First-Time Setup** | ✅ Approved — four-step welcome, administrator, MFA and completion screens |
| **Dashboard** | ✅ Approved — original layout with **Overview / Network Insights / Activity & Alerts tabs** retained, plus empty-inventory welcome; responsive layout and remembered sidebar choice |
| **Devices — Directory + Details / Device Cards** | ✅ Approved — selected-device preview, Cards option, full-page details link |
| **Device Details (full page)** | ✅ Approved — clear sections and a small, contextual rack-placement illustration only when rack-mounted |
| **Add / Edit Device** | ✅ Approved — premium form with physical Hardware or VM Hardware, working existing Software / Server Services actions in the finished application |
| **IPAM** | ✅ Approved — premium Networks & VLANs/Address Blocks layout; IP Addresses retain the original tiled grid, host-range tabs and filters |
| **Network Racks** | ✅ Approved direction — keep the existing v2.0.1 Rack pages, layouts, forms and interactions; apply the premium visual styling only |
| **Change History → Audit Trail** | ✅ Agreed design direction (Concept 10, #222) — compact event directory + selected-event inspection, meaningful change details, no arbitrary 200-event cap; not an empty-card restyle |
| **Users & Permissions** | ✅ Visual Design Approved — full-width User Directory, dedicated full-page User Workspace, correct **orange Add User** primary button and prominent **Back To All Users** button |
| **Settings & Data** | ✅ Visual Direction Accepted — **Concept 04.1**: on-page Docker backups, v1.3.3 import, SMTP/Email Settings, maintenance; compact 37px SMTP authentication switch correction applied; exact HTML/screenshots/design record retained in conversation pending repository archival |
| **My Account** | ✅ **Visual Design Approved — revised personal workspace**: full-width navy hero; editable First Name, Last Name, Email Address, **Display Name**; stable read-only Username; optional **round** Profile Image; Overview / Security / Appearance / Help & Guides / About; future My Devices/Tickets marked Planned. **This screen sets the approved global typography and angled-hedgehog sidebar standard.** |
| **Other screens below** | Previously agreed design directions retained; continue from those decisions rather than restarting their designs |

**This table records product-owner design decisions, not permission to change application code.** Where a design calls for new functionality, the precise implementation details will be agreed with the owner before coding; the agreed design direction does **not** need to be rediscovered or repeatedly reapproved.

## The rule for this project

**The main goal is a premium redesign that preserves v2.0.1 behaviour. Change History is the expressly recognised exception: it is intended to evolve into a meaningful Audit Trail, rather than receive only a cosmetic makeover.**

- Keep **all existing v2.0.1 features, data, actions, permissions, validation, safety rules and installation behaviour**. The existing published code determines how these functions work.
- **Three explicitly recorded areas go beyond restyling:** (1) optional administrator **Email Settings** and its discussed email use cases, with detailed behaviour/security still to be specified; (2) the preferred **Change History → Audit Trail** direction recorded below and in [Concept 10 in #222](https://github.com/Caffoot/Caffoot-Lite/issues/222#issuecomment-6553582075), including its [full-width design and retention feedback](https://github.com/Caffoot/Caffoot-Lite/issues/222#issuecomment-6553626968); and (3) the newly **approved My Account Personal Details** visual direction (names, display name, email and optional round profile image). These are owner-approved design directions, **not** permission to write code or a claim they exist in published v2.0.1.
- Do not invent other new account rules, IPAM or Rack logic, architecture changes or unrelated features. Other future ideas remain in **#222 — Future Ideas Register** unless the owner selects them.
- **The visual direction described below has already been discussed and selected. Do not start the design exercise again.** These are practical handover notes, not new sketches to be approved repeatedly.
- **This issue documents the designs only. It does not authorise coding, branches, pull requests, releases or deployment changes.** Obtain explicit product-owner approval before implementation.

## Overall look and navigation — agreed

- Modern, premium, professional and spacious, with a consistent Caffoot Lite identity, hedgehog branding and **Inter** typography. **NEW APPROVED GLOBAL DESIGN REFERENCE (1 November 2026):** the product owner selected the most recent **My Account with Personal Details / circular avatar** visual as the definitive source of the application's **text sizes, font weights, typographic hierarchy and updated sidebar branding**. Carry these styling rules consistently into **every** redesigned screen, section, table, card, form and dialog; do not revert to earlier oversized, squeezed or inconsistent text treatments.
- A **navy left-hand sidebar** which can expand to show full labels or collapse to a compact version. **Sidebar logo correction approved:** show the **recognisable official Caffoot hedgehog mark slightly angled/rotated**, as in the latest approved My Account visual and matching the website's branding. Keep the mark crisp, tasteful and correctly proportioned; do not rotate the Caffoot Lite wordmark or replace the genuine mascot with invented artwork. Keep the accompanying **Caffoot Lite** name with tasteful orange Lite accent and small **Infrastructure, Simplified.** signature. Apply this same sidebar/header treatment consistently across *all* application screens. **One collapse/expand control at the bottom of the sidebar**, visible by default on the menu, not an extra desktop hamburger in the page header. **Remember the user's expanded/collapsed choice in this browser, just like the existing theme preference**, and restore it when returning to the application.
- Clean, legible light/dark presentation, restrained orange primary buttons, sensible page headings, clearly positioned **top-right page actions**, consistent cards/forms/selection controls and **Title Case** labels.
- Light/Dark/System preference belongs in **My Account**, not an extra theme switch on every page.
- All existing navigation and secondary functions must remain easy to find. The visual change must work sensibly on narrower screens and with keyboard navigation.
- **Fit the available page width.** Dashboard cards, tables and sections must resize or stack cleanly, not be cut off to the right. The 1 November interactive Dashboard preview overflowed because its example container had a forced minimum width; **that was a mockup defect, not an approved UI layout**.

## Agreed screen plans

### 1. Sign In — Visual Design Approved ✅

**Owner approved the switchable visual preview on 1 November 2026.** [Approved design details](https://github.com/Caffoot/Caffoot-Lite/issues/227#issuecomment-6556713703). **Do not redesign it.**

- **Shared two-panel design:** deep-navy branded **left panel** with the website headline **“Infrastructure, Simplified.”** (orange second line), Caffoot branding/hedgehog, short self-hosted IPAM/inventory/racks description and **Self-Hosted / Open Source / Your Data** reassurance. Light/white spacious form panel on the right, consistent Inter typography and orange primary actions. On smaller screens, stack the two panels neatly.
- **Sign In:** “Welcome Back”, Username and Password, **Sign In**.
- **MFA screen:** “Verify Your Identity”, six-digit authenticator code, **Verify & Sign In** and **Back To Sign In**; only show the verification stage when the current login flow requires it.
- **Same look and same underlying v2.0.1 sign-in/MFA rules.** Use the authentic Caffoot logo in development rather than a placeholder icon.

### 1A. First-Time Setup — Visual Design Approved ✅

**The same owner-approved two-panel branded design continues across these four stages**, with a slim progress indicator, clear large title, helpful description and one orange primary action. [Approved screen-by-screen appearance](https://github.com/Caffoot/Caffoot-Lite/issues/227#issuecomment-6556713703).

1. **Welcome (01/04):** “Welcome To Caffoot Lite”, friendly intro, two short stages previewing administrator creation and MFA, **Get Started**.
2. **Create Administrator (02/04):** “Create Your Administrator Account”, Username, Password, Confirm Password, brief administrator explanation, **Continue**.
3. **MFA (03/04):** “Secure Your Account”, authenticator QR, brief instructions, manual key alternative, six-digit verification, **Verify & Continue**.
4. **Complete (04/04):** “You're All Set!”, understated green success icon, checklist confirming administrator and MFA setup, **Go To Dashboard**.

**Presentation only:** reuse the existing v2.0.1 initial-user creation and mandatory MFA processes. Do not change how accounts or authenticator codes work or claim success before completion. The preview's mock QR was decorative, not a real code.

### 2. Dashboard — Visual Design Approved ✅

**Approved by the product owner on 1 November 2026. Keep this design; no further alternative Dashboard mockups.**

A practical home page for day-to-day inventory work, not a promotional screen.

- Clean summary cards for Devices, IPAM and Racks, linking to their relevant sections.
- **Quick Access** for existing actions such as Add Device, Add Rack and Open IPAM. **Do not duplicate Add Device in the top-right header.**
- **Keep the existing three Dashboard tabs, clearly visible:** **Overview | Network Insights | Activity & Alerts**. The premium styling changes their presentation, **not** their contents or behaviour. **Network Insights** retains the existing IP address utilisation, device status, hardware distribution and rack-capacity-by-face views. **Activity & Alerts** retains the existing recent change activity/timeline, warning and integrity information, filters and links. **Overview** remains the main Dashboard with its useful summaries and Quick Access. Keep existing downloadable **CSV reports** discoverable wherever they currently belong. A compact summary card in Overview is **not** a substitute for either full tab.
- **Inventory Health** warning is shown to **administrators only, and only when there is an actual integrity issue**. It should not dominate a healthy dashboard.
- All figures are from saved inventory, not newly invented live monitoring.

**Owner confirmation (1 November 2026):** The familiar Dashboard composition shown in the latest preview is broadly the previously agreed design; **retain it rather than proposing another alternative**. The screenshot exposed a **preview-width defect**: sections were clipped horizontally. The actual design must fit its available browser viewport, using responsive grid/stacking as needed. The sidebar's single bottom collapse control was tested successfully and is **approved as a standard menu control**, with its expanded/collapsed choice saved and restored locally in the same manner as the theme preference.

**Approved empty-inventory refinement (1 November 2026):** Keep the **original approved Dashboard** as the main design. When the inventory is entirely empty, use a welcoming **“A clean start.”** presentation within it, with truthful zero/empty states and existing permission-aware Quick Access. Once populated, show the established approved Dashboard with **Network Insights, Activity & Alerts and Reports & Exports**, not the simpler example preview. A later preview confirmed the single bottom sidebar control now collapses/expands correctly; remember this preference locally as agreed. [Approved decision](https://github.com/Caffoot/Caffoot-Lite/issues/227#issuecomment-6556923417).

### 3. Devices — Inventory — Visual Design Approved ✅

**Approved by the product owner on 1 November 2026 after reviewing the interactive Directory + Details, Device Cards and full-page details preview.** Preserve this chosen composition.

The default layout is **Directory + Details**. The selected preview is read-only, and the Cards view offers an alternative browse presentation; choosing **View Full Details** opens the separate full-page device workspace. The interactive example's search and device selection demonstrated this presentation successfully.

- A readable, searchable, filterable directory of devices, with a **read-only selected-device details preview** beside it.
- An optional **Device Cards** visual view for those who prefer cards.
- A deliberate **View Full Details** action to open the dedicated Device Details screen.
- Existing actions such as Add, Edit, Duplicate, Delete and View in Rack remain accessible **when the user has permission**.
- Existing secondary Devices pages/functions — inventory overview, device types, locations, manufacturers, models, software, server services and inventory insight/quality functions — remain available without cluttering the main directory.
- Selecting/viewing a device does **not** start editing it or take an edit lock.

### 4. Device Details — Visual Design Approved ✅

**Product-owner confirmation (1 November 2026):** The full-page Device Details design is a clear improvement and is approved, particularly the small contextual illustration indicating where a rack-mounted device sits. Keep the already selected layout, rather than inventing a new one.

A **separate full-page Device Details workspace**, not a giant popup.

- Clear device identity/status header with appropriately positioned **Back To Device Inventory**, **View in Rack**, **Duplicate** and **Edit Device** actions.
- Organised, readable sections/tabs as relevant: **Overview, Hardware, Network, Software, Location, History**, plus **Virtual Machines** for applicable physical hosts.
- Show the recorded physical server / virtual machine relationships. **For a rack-mounted device only**, show a small, clear visual rack-location preview using its real saved rack, face and U position where available, so the viewer can recognise where it is installed. Provide the existing **View in Rack** route as appropriate. **For an unracked device or a VM without its own rack placement, do not show a misleading rack drawing**; display its relevant recorded location/host information instead. The illustration is a visual aid, not new rack placement functionality.
- Keep existing conditional device fields, installed/archived software information and the existing **Previous Device Type Details** history. Do not replace those saved snapshots with a different kind of history.
- Viewing is read-only. The existing Edit Device form, device reservation, permissions and Save/Cancel behaviour remain as v2.0.1.

### 5. Add / Edit Device — Visual Design Approved ✅

**Owner confirmation (1 November 2026):** The corrected device editor appearance is approved. The initial mockup missed Hardware / VM Hardware; the follow-up visual included the appropriate section for both Add and Edit, and the owner confirmed: “yes mate thats it”. Keep the approved appearance and those sections; do not re-design the form.

Visually polish the existing forms and selectors so they are easy to understand, without changing what they do.

- Group existing device details into clear, manageable sections. **Retain an obvious Hardware tab/section in both Add and Edit Device.** For a physical device, show the existing physical hardware fields; when the type is a Virtual Machine, show the existing **VM Hardware** options instead. Do not accidentally omit either from the premium design.
- Preserve device type and location choices; physical versus virtual server fields; manufacturer/model suggestions; network/IP assignment; rack placement; software, server services and Notes.
- In the **Software & Notes** area, the **Installed Software** and **Server Services** Manage actions must be usable in the implemented editor, allowing the user to add/assign/manage the relevant software and services using the **existing v2.0.1 catalogue, device-assignment, permission and save workflows**. These controls were non-working visual placeholders in the ChatGPT preview only. Do not silently lose unsaved form entries when using these actions.
- Keep the ability to work with related network/catalogue choices without accidentally losing an **unsaved device form**.
- Maintain the established existing confirmation, validation and permission behaviour. No new device fields or lifecycle rules are implied.

### 6. IPAM — Visual Design Approved ✅

**Product owner approved the corrected IPAM presentation on 1 November 2026:** the new premium Networks & VLANs workspace **combined with the existing v2.0.1-style IP address tiles and host-range tabs**. The initial long scrolling IP-address list was rejected; **do not replace the familiar address grid with that list**.

A clear **Networks & VLANs** main workspace, with separate **IP Addresses** and **Address Blocks** views.

- **Add Network** is the top-right orange primary action; **Add Address Block** is the secondary action.
- Clear directory/details presentation of saved networks, VLANs, CIDR, gateway, parent block, usage and address allocation status.
- **IP Addresses must retain the familiar v2.0.1 tile/grid presentation**, not a tall scrolling row list: selected/active subnet at the top, **host-range tabs** (e.g. .1–.32, .33–.64, etc., plus Show All as supported by the existing app), colour/status distinction for **Available / Assigned / Reserved**, search by IP or device, allocation-status filter, and individually selectable address tiles with existing relevant detail/edit/notes actions. The tile grid should respond to the available browser width; host-range navigation keeps longer subnets manageable. Preserve all current IP address handling and large-subnet behaviour.
- Existing editing, **IPAM Notes**, bulk IP operations and subnet/VLAN/legacy management tools stay findable.
- **All published v2.0.1 IPAM rules remain exactly as they are** — no new gateway/ownership, CIDR, deletion or device-linked-IP behaviour.

### 7. Racks — Overview / Dashboard — Premium Restyling Approved ✅

**Product-owner decision, 1 November 2026: the existing v2.0.1 Racks experience is already intuitive and working very well. Give it the agreed premium interface styling — nothing more.** This supersedes the earlier alternative Rack Dashboard/Workspace mockup. **Do not redesign the layout or navigation simply for the sake of change.**

- Keep the current Rack Overview, Rack Inventory, Rack Accessories, existing left-hand navigation, proper headers and all current rack-wide insights and controls where users already expect them.
- Apply the consistent new Caffoot appearance to typography, colour treatment, spacing, cards, buttons, selectors and forms, and use the agreed collapsible application sidebar.
- Do **not** introduce a new Rack Dashboard journey, permanent equipment inspector or other replacement interface that makes the current workflow more complicated.

### 8. Racks — Rack View, Equipment, Settings and Forms — Premium Restyling Approved ✅

**Retain the current v2.0.1 screen arrangement, behaviour and placement workflows.** The recent mockup with a permanent Equipment Actions panel was not approved.

- Keep the familiar rack elevation, its **existing distinct Front/Rear colours**, face switching, U positions, continuous multi-U equipment fascias, left/right 0U accessory rails and L/R labels. Preserve the existing layout and use the premium styling without moving or squeezing essential elements.
- Clicking a rack slot or existing mounted device uses the **current appropriate actions/forms**; clicking a vertical accessory/rail uses the current **vertical accessory workflow**. **No permanent right-hand Equipment Actions form.**
- Keep **Rack View, Equipment and Rack Settings**, existing rack selection, capacity, other-side equipment, mounting/moving, drag behaviour, collision protection, permissions, and **Print/PDF for both rack faces**.
- Keep **Edit Rack**, **Correct Rack Specifications** and **Delete Rack** as distinct existing actions. In particular, **Correct Rack Specifications** must remain the protected deliberate workflow for correcting fundamentals such as rack U height/type, not an ordinary editable field.
- Give the existing **Add Rack, Edit Rack, Mount Device, Horizontal Accessory, Vertical Accessory and Correct Rack Specifications** forms the premium form styling while keeping all actual input options and behaviour.
- **No rules change:** preserve the independent Front/Rear U positions, same-face device/horizontal accessory collision checks, L/R rail rules, permission checks, saved data and established validations exactly as v2.0.1.

**Decision:** the existing Rack UI itself is the visual/interaction starting point; this is an approved **restyle-only direction**, **not an approval to implement code**. No additional Rack mockup or alternative layout needs approval merely to restyle it consistently with the other approved screens.

### 9. Change History → Meaningful Audit Trail — Agreed Design Direction ✅

**The product owner has discussed and preferred this direction repeatedly. DO NOT replace it with a cosmetic restyle of the weak v2.0.1 event list.** The compact card-based preview shown on 1 November 2026 was **not approved**: it wastes space and still tells the user too little.

**Previously captured in [#222, Concept 10](https://github.com/Caffoot/Caffoot-Lite/issues/222#issuecomment-6553582075) and [revision 2](https://github.com/Caffoot/Caffoot-Lite/issues/222#issuecomment-6553626968):**

- Use a **compact, full-width, readable event directory**, with columns helping users identify **when**, **who**, **what happened**, **which object** (device, IPAM record, rack, etc.) and the **result**. Do not use enormous separated cards for a handful of vague entries.
- Selecting an event opens a **detailed event inspection view**. For genuinely useful auditing, show changed fields with **before → after** where appropriate, while protecting/redacting secrets. Design must distinguish **what v2.0.1 actually recorded** from information a future audit system will start recording.
- Aim to cover meaningful device, IPAM and rack changes, plus relevant settings, user/permissions and authentication/security events **as agreed in the detailed functional scope**. These extra event classes and actor attribution are proposed audit capabilities, not current stored facts.
- Keep useful **search/filter** and clear **Export History** access; plan usable reporting/export without promising data or formats the old history never held.
- The existing **200-event retention cap is inadequate** and should **not carry over as an arbitrary fixed low limit** into the future Audit Trail. Select a practical durable SQLite history strategy, efficient pagination and sensible administrator/retention safeguards during detailed implementation planning. **Past entries already discarded cannot be reconstructed.**
- Respect existing application permissions, protect personal/sensitive information and avoid unnecessary complexity.

**What is settled:** the overall design and product need for a **proper Audit Trail**, including its space-efficient event list, selectable inspection, meaningful changes and removal of the arbitrary 200-event cap as the target direction.

**What is not yet claimed:** an approved technical schema, precise event catalogue, retention policy, implementation, backfill of old history, or finished visual design. Those are implementation details to agree with the product owner **without restarting the previously settled design conversation**. Only the owner authorises implementation.

### 10. Users & Permissions — Visual Design Approved ✅

**Product-owner approval, 1 November 2026:** The interactive design is approved with **one correction:** the top-right **Add User** button must use the agreed restrained **orange primary-action styling** (matching the approved premium buttons elsewhere), **not the black/default control appearance** shown in the preview. The prominent top-right **Back To All Users** button must remain visually consistent. No other layout redesign requested.

An airy, full-width **Users Directory** with clear account rows, status/permissions summary, search/filters and an administrator-only **Add User** action.

- **Selecting a user opens a separate full-page User Workspace.** Do not use the earlier rejected long inline expansion below the directory.
- The user's page has clear identity/status and grouped **Overview, Permissions, Security, Account Management** information as appropriate.
- The **top-right “Back To All Users” button** is prominent and consistent with the Add User button styling. **Not** a subtle underlined link.
- Keep the same existing user creation, No Access / Read Only / Edit section permissions, MFA/admin/status controls and confirmation/security rules. No new personal profile fields.

### 11. My Account — Visual Design Approved ✅ (1 November 2026, Revised Personal Details)

**Product-owner approval:** The most recent revised **My Account overview image**, adding a Personal Details form and **circular profile-photo upload** to the earlier extensible personal workspace, received enthusiastic explicit approval: “love this sidebar ... logo slightly rotated”, “this My Account page text size, weights should be used throughout the new design”, and “brilliant ... that's passed by me”. **This revised screen replaces the earlier My Account Draft 01 and the rejected generic small-settings mockup as the visual reference.**

**Status:** **visual/layout approval only**. New profile fields, persistent personal details, photo upload, any email verification, and later ticketing/asset assignment need carefully scoped implementation, compatible with v2.0.1. No code, branch, PR, deployment or release authorised by this design approval.

#### Screen Layout — Permanent Textual Record

1. **Global shell:** deep navy left navigation; upper brand badge with the **official Caffoot hedgehog angled slightly** to echo the website, Caffoot Lite wordmark with subtle orange emphasis, and small Infrastructure, Simplified. caption. Workspace navigation for Dashboard, Devices, IPAM, Network Racks, Audit Trail / Change History and Users. Near the bottom: Settings & Data and **highlighted My Account**; compact signed-in account preview; **one bottom Collapse Menu button**. The same sidebar treatment applies to all screens. Top light breadcrumb: **Caffoot Lite › My Account**, with signed-in account/round avatar at the right.
2. **Page header:** compact orange uppercase eyebrow **YOUR PERSONAL WORKSPACE**, strong **My Account** heading, and readable subdued subtitle: “Everything about your account, in one place. Simple today, ready for tomorrow.” Do not give the page huge empty areas or gigantic text.
3. **Account identity hero:** wide, substantial **navy horizontal banner** beneath page title with account name/display name, small role / MFA / active-status indicators, and an understated right-aligned **ACCOUNT SECURITY / Protected By MFA** area. Use real status in the final app, not invented success. Uploaded profile images are **round wherever displayed**; use a tasteful fallback avatar/initials when no image exists.
4. **Section navigation:** neat, consistent tabs **Overview | Security | Appearance | Help & Guides | About**, with a restrained orange underline for the selected tab. **Overview** is the default genuine personal workspace, not just a settings form.
5. **Main content grid:** larger **left content column** and narrower **right utility column**, each with white softly bordered/shadowed cards, consistent radii and measured padding. Responsive widths stack naturally rather than causing horizontal overflow.
6. **Left / Personal Details** (prominent first card): icon and heading, a circular profile image / placeholder with **Upload Profile Image** action, optional photo, preview/change/remove controls to be safely specified. To the right are compact, aligned two-column fields: **First Name**, **Last Name**, **Email Address** and editable **Display Name**; then **Username** shown clearly **Read-Only** with a lock/info cue because it remains the stable sign-in identifier. An **orange Save Personal Details** primary action is aligned to the form bottom-right. The reference image suggests **JPG/PNG/WEBP and up to 5 MB** as initial UX copy; precise upload validation/storage/privacy rules are implementation choices to agree. **Display Name, not Username, is the user-editable public-facing label**, useful for future ticket authors and other personal features. Keep established login identifiers stable.
7. **Left / Account & Security:** a shorter card below Personal Details with username, role, MFA state and orange **Manage Security** route. Existing password/MFA workflows remain accessible in their own Security section.
8. **Left / Your Services:** an expansion-ready area with neat, equally weighted **My Devices** and **My Support Tickets** tiles, each visibly marked **Planned** and briefly describing future assigned assets and support requests. Do **not** pretend assignment/ticket features are live, nor give ordinary users broad inventory rights. Avoid clutter and scroll-heavy expansion.
9. **Right / Personal Preferences:** card showing current Light/Dark/System browser-local appearance selection and clear **Change Appearance** route. **Help & Guides:** separate card with concise introduction and **Explore Help & Guides** route to the existing local topics/full docs. **Session:** compact card with explicit **Sign Out**.
10. **Footer:** discreet Caffoot branding; no false implementation status in actual production UI. Example usernames, account details, dates and badges from the concept art are **illustrative**.

#### Approved Cross-Application Typography Rule

- **The proportions, text sizes and weights in the latest revised My Account image are the target for the entire application, not just this page.** Match the visual reference's **Inter-style clean hierarchy** consistently.
- Page titles: bold, clear, prominent without being oversized; card headings: crisp bold/semibold and significantly smaller than page titles; labels/table headers: readable **medium/semibold**; body and metadata: regular/medium; helper/caption: smaller and muted **but still legible**. Selected nav/tab states have restrained semibold emphasis.
- Preserve cohesive line height, field labels above inputs, realistic comfortable control heights, disciplined spacing and clear contrast. Avoid ultra-tiny text or large blank spaces. No arbitrary pixel-perfect CSS numbers are claimed here because the visual reference is an image, not an extracted design-token stylesheet.
- Align all other approved screens — Dashboard, Devices, IPAM, Racks, Audit Trail, Users, Settings & Data, Sign In and setup — to **this typographic standard and the slightly angled Caffoot sidebar mark**, without erasing their separately approved layouts or workflows.

#### Source-of-Truth / Visual Preservation

- **Approved visual:** the owner-reviewed **My Account with Personal Details and circular avatar** generated in this design chat on 1 November 2026 (not the preceding Draft 01 HTML screenshot, which lacks the new Personal Details section).
- The image is present in the design conversation, **but it has not yet been uploaded/committed to GitHub**. This text describes it precisely; **issue text alone is not a substitute for archiving the actual visual**.
- The earlier `caffoot-my-account-draft-01.html` and design pack are superseded as layout references for the revised Overview until they are updated to the approved screenshot.
- **Next required documentation preservation step, only with owner authorisation:** place the exact approved image, revised interactive reference and written spec under stable version-controlled design-document paths, link them here, and give future refinements explicit revision numbers. Never rebuild an approved screen from chat memory alone.

### 12. Settings & Data — Previously Agreed Premium Form Design; Original Visual Reference Not Yet Recovered

**Product-owner clarification, 1 November 2026:** The **original Settings & Data form/page design was the catalyst for the wider premium interface design** and the decision to apply that consistent style to other forms. **Preserve this accepted earlier form**, not the simplified tab/cards substitute shown later in chat; the user has explicitly said the substitute is **not the same agreed form**.

- Preserve the published **v1.3.3 JSON inventory import**, review/confirmation and correction steps.
- The accepted design gave **useful Docker/SQLite backup instructions directly in the page**; do not replace those with a generic documentation link. The backup guidance must be correct for current **named Docker volumes**, alternative bind mounts, and existing-installation data safety; do not mislabel one-way JSON migration as an ongoing database backup.
- Retain **Inventory Safety Check** and deliberately confirmed **Clean Start / Clear System** with their existing safeguards.
- Personal themes and account security remain under My Account.
- **Email Settings** is part of the agreed Settings & Data design: optional SMTP host, port, transport/security, protected credentials, sender settings, save and **test email**. The system must function without SMTP.
- **Do not dismiss password recovery and notifications:** the owner explicitly recalls discussing **password recovery and administrative notifications as part of the intended email-enabled functionality**, with future ticketing also informing the design. These purposes are already recorded in [#222's original email-design discussion](https://github.com/Caffoot/Caffoot-Lite/issues/222#issuecomment-6553582075). The narrower SMTP-only statement in prior notes does **not** settle which of these the product owner wants included in the next delivery. Confirm the exact release-level behaviour and security approach with the owner during concise specification **without making them repeat or reapprove the accepted visual design**.
- **Original exact mockup has not been recovered:** the [previous owner clarification](https://github.com/Caffoot/Caffoot-Lite/issues/226#issuecomment-6556087924) explicitly says not to treat the later [rough proposed SMTP sketch](https://github.com/Caffoot/Caffoot-Lite/issues/226#issuecomment-6556031574) as the original. The new chat's substitute mockup also is **NOT approved**.

**Recordkeeping safeguard:** The two most recent My Account and Settings & Data interactive previews are **illustrations only and not evidence of the earlier accepted design**. Do not mark these as visually approved or use them as the implementation reference. The owner remains sole authority over functionality and implementation; no code or new development work is authorised by this clarification.

### My Account Draft 01 — Historical / Superseded

The earlier Draft 01 HTML, screenshots, and design pack **preceded** the owner-approved **Personal Details + round profile-image** revision. They remain useful historical references for tabs and responsive interactions, but **must not override the revised approved Overview in section 11 above**. Preserve the newly approved typography and slightly angled official hedgehog sidebar standard throughout. The actual revised visual still needs permanent asset archival; it is available in the design conversation, not yet in GitHub.

### Settings & Data — Concept 04.1 (1 November 2026) — Visual Direction Accepted ✅

**Product owner accepted the reconstructed Settings & Data Concept 04** (“perfect”, “almost identical” to the earlier form), requesting only that the overlong SMTP Authentication switch be made compact. **Concept 04.1 fixes the CSS cascade so the switch is 37px**, and an updated HTML prototype, verified screenshot, written design record and ZIP are saved in the conversation. The previous historical form still has not been recovered; 04.1 is the **accepted new visual reference**, not a claim to have recovered that original.

**[Full screen-by-screen design specification and exact artefact filenames → comment #6558338302](https://github.com/Caffoot/Caffoot-Lite/issues/227#issuecomment-6558338302)**. In particular:

- **Data & Backups:** on-page step-by-step Docker/SQLite backup instructions with example volume/archive commands and important existing-installation safety guidance, plus the protected v1.3.3 inventory import.
- **Email Settings:** full SMTP form (server, port, security, authentication, sender), distinct Save/Test actions, and visible design destinations for **Password Recovery**, **Administrator Notifications**, audit delivery and eventual tickets.
- **System Maintenance:** Safety Check and clearly segregated protected Clean Start/Danger Zone.
- **Design system:** actual Caffoot logo, navy sidebar with one working bottom collapse control, orange primary actions, Title Case controls and responsive cards.
- **Status:** Visual direction accepted with the compact-switch correction **implemented in the standalone prototype only**. **No application coding or implementation authorised.** Once the owner permits repository documentation changes, commit the **exact 04.1 HTML, screenshot files and written design record** to version-controlled design documentation, then link those paths here. **Issue text alone is insufficient to preserve the actual design.**

## Recent Design Approval

✅ **Sign In + First-Time Setup — approved 1 November 2026**. The owner enthusiastically accepted the six-view mockup. Its exact look and sequence are documented [here](https://github.com/Caffoot/Caffoot-Lite/issues/227#issuecomment-6556713703). **This screen design is settled.** Other previously agreed screens stay as captured; continue visual work only where necessary.

## What remains to do

1. **Keep this issue as the single, easy-to-read design reference.** No further audit/engineering expansion unless the product owner specifically asks for it.
2. The original approved screen images are not all retained in accessible GitHub records. These descriptions capture the established preferences; if an exact missing visual detail becomes essential, ask about **that detail only**. Some earlier exploration labelled Concepts 01, 02 and 05 could not be verified and must **not** be invented.
3. When the owner requests development, compare the new appearance with the selected screens and ensure all **published v2.0.1 behaviour still works**. The existing code is the functional authority; no need to rewrite it as a new feature specification.
4. Before writing new feature code, agree concise implementation details for the **optional Email Settings** and the **already-preferred Audit Trail**, following the directions recorded above; do not start a fresh design exercise.
5. **Do not begin implementation until the product owner explicitly approves it.**

**In one sentence: preserve the v2.0.1 foundation and excellent existing workflows, deliver an exceptional premium interface, and carry forward the already-discussed Audit Trail direction and optional Email Settings for the owner's detailed sign-off before development.**
