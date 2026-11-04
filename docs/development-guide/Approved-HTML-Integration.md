# Approved HTML interface integration — source and acceptance record

This record accompanies [issue #280](https://github.com/Caffoot/Caffoot-Lite/issues/280).

## What we are building

Integrate the **actual markup and CSS** from each approved standalone HTML design into the existing Caffoot Lite application. Connect every visible action to the working JavaScript and Python/SQLite implementation. This is one **complete interface acceptance batch**, not permission to change any existing business rule.

The approved visual files remain in Git history. Do **not** restore `future-design` to `main`. The source revision pinned here is `c26db4a56bbc30f95b56201e81a7a76d13c6037b`, so subsequent edits to other branches cannot silently change what we agreed to use.

## Approved design sources

| Area | Original approved HTML |
| --- | --- |
| Dashboard | [dashboard-draft-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/dashboard-draft-02.html) |
| My Account and shared header/navigation | [my-account-draft-06.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/my-account-draft-06.html) |
| Settings & Data | [settings-data-draft-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/settings-data-draft-02.html) |
| Devices Overview | [devices-overview-draft-03.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-overview-draft-03.html) |
| Device Inventory | [devices-inventory-draft-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-inventory-draft-02.html) |
| Device Details and Add/Edit/Duplicate | [devices-details-forms-batch-04.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-details-forms-batch-04.html) |
| Devices management and six catalogues | [devices-management-batch-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-management-batch-02.html) |
| IPAM | [ipam-draft-01.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/ipam-draft-01.html) |
| Network Racks | [racks-draft-04.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/racks-draft-04.html) |
| Users & Permissions | [users-permissions-draft-02.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/users-permissions-draft-02.html) |
| Sign In and First Run | [sign-in-first-run-draft-03.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/sign-in-first-run-draft-03.html) |
| Audit Trail | [audit-trail-draft-01.html](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/audit-trail-draft-01.html) |

All 12 files have been checked as retrievable from that Git revision. The previous attempt mistakenly left the original Devices nested navigation and patched existing screens instead of carrying across these approved structures. Do not treat CSS similarity alone as implementation.

## Application files and compatibility

- `inventory.html`: main navigation, Dashboard, Devices, IPAM, Racks, Users, Settings & Data, My Account and Audit Trail.
- `setup.html`: Sign In, first administrator setup and MFA enrolment.
- Keep existing supporting assets, authenticated Python API, SQLite schema, saved inventory, permissions, edit reservations and Docker mounting unchanged unless separately approved.
- The design files show demonstration data and illustrative interactions. They do **not** replace live queries, permission-aware actions or existing storage.
- The shared navigation must be implemented **once** and remain identical while moving between application sections. Verify the sidebar, top-right account control, collapse and nested links against the approved HTML as well as their live actions.
- Preserve the published v2.0.3 functional baseline: hardware tab only for physical devices; hypervisor-managed VMs; manufacturer and software multi-type selections; all IPAM and Rack functions including L/R rails, front/rear views, printing and drag-and-drop; all six Help topics and eight guide links; permissions, MFA, backups, exports and imports.
- Under the product owner's explicit 4 November 2026 scope clarification in [#280](https://github.com/Caffoot/Caffoot-Lite/issues/280), approved optional personal details and images, SMTP/email and meaningful Audit Trail functionality **are included** in this same integration batch. Preserve the approved security and recovery boundaries in [#227](https://github.com/Caffoot/Caffoot-Lite/issues/227); do not invent further features.

## Acceptance before another owner Docker test

- [ ] All 12 source files mapped to their *actual* live screens and action handlers.
- [ ] Shared sidebar and header matched to approved HTML and checked on every section.
- [ ] Every major page, form, popup and tab compared side by side against the approved HTML at desktop and mobile widths.
- [ ] All existing data fields and user actions preserved and usable.
- [ ] Read-only users and individual Devices/IPAM/Racks permissions tested on the server and in the interface.
- [ ] Device editing, reservations, VM relationships and multi-type catalogue selection tested.
- [ ] IPAM, racks, authentication, account, maintenance and printing workflows tested.
- [ ] Browser, backend, documentation, security and installation checks pass on the actual final revision.
- [ ] The packed private Docker build source is verified to contain that revision, not an older screenshot or partial build.
- [ ] The owner reviews a **single complete live application** and approves appearance separately from merging.

## Current status

**In progress — not visually accepted.** Development in draft PR #281 began from working `main`; rejected UI shortcuts from PR #279 are not part of the approved source integration.

As at the current branch development checkpoint:
- Shared header/sidebar, Sign In/First Run, Dashboard, several Devices catalogues, IPAM, Racks overview, Users list and parts of My Account and Audit Trail have live HTML integrations. IPAM Draft 01 now also includes the approved Address Allocations and Manage Subnets page components, wired to the existing live network chooser, address search/filter/ranges, protected editing and VLAN ownership warnings. Chromium acceptance covers those navigation and control paths. These still require the final side-by-side acceptance, including mobile and cross-section behaviour.
- The approved Users & Permissions Draft 02 Overview and Add/Manage optional personal-detail forms now use live account data and administrator-only APIs. The Add User save is atomic with the existing username/password and preserves default no-access; changing a profile does not alter the sign-in identity, MFA, permissions or account role. Contact email remains unverified until an approved verification flow is implemented.
- Profile image upload/removal for My Account and the initial retained/attributable Audit Trail event capture have been implemented with targeted permission tests. Newly saved IPAM allocation, subnet/VLAN and Rack changes can now capture a strict allow-list of non-sensitive structural before/after values; private notes, arbitrary fields and credentials are never copied into these snapshots. Existing permission-filtered history responses continue to prevent users from seeing changes or details outside their authorised inventory sections. The previous 200-event retention limit is not applied to SQLite history; this has a dedicated regression test.
- The approved Settings & Data Draft 02 page has been integrated from its source markup and component styles. The Data & Backups and System Maintenance buttons call existing protected application actions, rather than the standalone design's illustrative handlers. This area still requires desktop/mobile visual sign-off.
- Optional SMTP administration is implemented with a new administrator + MFA + CSRF protected API, masked readback (no secret in responses), data-volume file mode `0600`, password preservation when the same SMTP username is retained, STARTTLS/SSL transport, explicit review of unencrypted transport, a rate-limited Send Test Email action and non-secret audit events. These are tested with mock SMTP delivery, not against a real external mail provider.
- The approved Device Details Batch 04 view now uses its original information-card, header, tab and footer styling with live stored device data. Physical-hypervisor and VM details retain the published hardware, guest/host and rack boundaries. Chromium checks cover both device kinds and mobile stacking. This is functional test coverage, **not** the owner's final visual sign-off.
- The Device Add/Edit modal now uses the approved Batch 04 frame and five form tabs, retaining the existing saved fields and handlers. The virtual machine allocation card is in General and the physical hypervisor controls are in Software & Firmware, as in the approved design. The accompanying Chromium regression checks exercise Add/Edit, physical hypervisors, VM ownership, and narrow-screen layout. **These latest checks are committed but have not yet been reported as passing by GitHub Actions.**
- **Still outstanding:** full source-by-source visual acceptance for the Device Editor, any remaining Rack or catalogue screens, verified email ownership, password recovery, approved security notifications and last-resort host-only administrator recovery; further meaningful/detail-level Audit Trail coverage; full IPAM interaction and final side-by-side visual acceptance. SMTP configuration alone does **not** enable recovery or notifications.
- The Chromium regression must be evaluated on the **final branch head**; older checks that passed before these changes, or early failing tests corrected mid-development, are not final acceptance evidence.

PR #281 remains **draft and unmerged**. PR #277 and PR #279 remain separate and unmerged. No private acceptance Docker package, public image, release or production deployment has been authorised.

## Source-by-source status register — 4 November 2026

This is a **working register, not a pass certificate**. For each screen, verify (1) the exact approved presentation, (2) connected functionality, (3) desktop/mobile behaviour and relevant security tests **on the same commit**. Do not mark any screen completed merely because approved CSS classes exist or the old functionality still works. No screen is currently confirmed to have passed all three checks.

| Approved HTML source | Current assessment | What to check next |
| --- | --- | --- |
| Dashboard Draft 02 | Partly integrated; fidelity unverified | Complete original tabs, cards and responsive layout |
| My Account Draft 06 and shared navigation | Partly integrated; fidelity unverified | Profile workspace, common header/sidebar, every page |
| Settings & Data Draft 02 | Partly integrated; fidelity unverified | Complete source structures and forms |
| Devices Overview Draft 03 | All five original panel structures integrated; **not yet verified** | Execute latest Chromium, compare source and live desktop/mobile UI, and verify filtering/empty states |
| Devices Inventory Draft 02 | Approved toolbar/results/table skeleton integrated with live records; **fidelity unverified** | Run full Chromium, confirm original row details/empty states and desktop/mobile presentation |
| Device Details / Add/Edit Batch 04 | Partly integrated; fidelity unverified | Verify original card structure, physical/VM editors and actions |
| Device Management and six catalogues Batch 02 | Partly integrated; fidelity unverified | Confirm all six views, forms and multi-type selection |
| IPAM Draft 01 | Partly integrated; fidelity unverified | New active pages exist, but inspect old dialogs and all live controls |
| Network Racks Draft 04 | **Mismatch confirmed** | Old elevation, capacity, equipment and settings markup must be replaced |
| Users & Permissions Draft 02 | Partly integrated; fidelity unverified | Check full User Workspace, Add/Manage and permission states |
| Sign In & First Run Draft 03 | Partly integrated; fidelity unverified | Confirm original login, setup and conditional MFA screens |
| Audit Trail Draft 01 | Partly integrated; fidelity unverified | Complete directory/detail/export and protected event coverage |

**Important separation:** existing Python/SQLite storage, permissions, MFA, rack and IPAM validation, data migration and save handlers are the functional baseline to preserve. That a handler works **does not prove** the interface is correct. Equally, the old screen's presence does not mean the backend must be rewritten.

**Additional approved work still open:** verified email ownership, secure password recovery, important account/security notifications, host-only sole-administrator recovery and remaining Audit Trail events/exports. SMTP configuration alone is not recovery.

**Next step for each row:** compare pinned approved source with actual live markup, correct any wrong structure, connect every approved control to existing handlers, run tests, compare desktop/mobile views, record evidence and commit SHA. Change the assessment to *verified* only when all checks pass. No acceptance Docker review, merge or release before the entire batch is complete and internally verified.

### Devices Overview Draft 03 — source correction checkpoint (4 November 2026)

- On `c88f166`, the **Devices by Type** and **Devices by Location** panels in `renderDevicesHTML()` were changed from legacy generic Tailwind cards to the original approved Draft 03 `intelligence-two > intelligence-card > intelligence-card-head / divider / intelligence-chart > intelligence-chart-row` structure, including the source's icons, captions and chart tracks. Card content still comes from actual saved device data; the existing `device-intelligence-drilldown` handler continues to open filtered Device Inventory. The four live overview metrics were preserved.
- On `236f136`, browser test assertions were added for the original two-card structure, icons/headings, live Desktop type breakdown and its navigation to filtered Device Inventory.
- **Verification so far:** the large HTML inline script and the browser test JavaScript passed syntax parsing. **No GitHub Actions runs have been reported on this branch head; the new Chromium test has not been run, and desktop/mobile visual fidelity has not been signed off.** This is a **partial Devices Overview correction**, not a completed screen or an accepted design.
- Other Devices Overview tabs (Hardware, Operating Systems, Software & Services, Data Quality) still use mismatched old panel structures. The screen-by-screen fidelity register therefore remains **Mismatch confirmed** until those are replaced and all screens tested.

### Devices Hardware Draft 03 — source correction (4 November 2026)

- Commit `aca2649`: replaced the old Hardware overview cards with the **actual approved Draft 03 Hardware panel markup** copied from the pinned source, including the three `intelligence-metric` cards and original Manufacturer, Model and Mounting Methods card/chart containers. The illustrative data was replaced by live inventory counts. The existing `device-hardware-drilldown` action still opens filtered inventory; no storage, permission or placement logic was changed.
- Commit `5a8ca28`: added Chromium assertions for the original three-card structure and a saved mounting-method drill-down.
- **Verification:** the updated HTML inline script and the browser test file passed JavaScript syntax parsing. No GitHub Actions workflow run is reported for this code. Real Chromium execution and desktop/mobile visual comparison remain outstanding. This is **not a completed or accepted Devices Overview**: Operating Systems, Software & Services and Data Quality panels still need their original source HTML integrated, and the complete screen needs acceptance checks.


### Devices Overview Draft 03 — batched OS, Software and Data Quality source integration (4 November 2026)

- Commit `59fe237`: replaced the remaining legacy Operating Systems, Software & Services and Data Quality cards with the **actual panel markup from the pinned approved `devices-overview-draft-03.html`**, not CSS approximations. These use the approved `intelligence-panel`, `intelligence-card`, `intelligence-chart-row`, `intelligence-quality-card` and original source headings/captions.
- The sample preview's figures were connected to live saved inventory: `getEffectiveDevicePlatform()` continues to distinguish hypervisor hosts from guests, recorded software/service selections retain their existing catalogue filtering, the archived-software card still links to preserved saved device records, and Data Quality remains calculated from the live inventory. The original View Device Inventory buttons are wired to the live navigation action. No backend, device assignment, security or storage logic changed.
- Commit `b6f039`: added tests for all three original panels, real operating-system and optional software drill-downs, saved Data Quality counts and missing-IP filtering, and the narrow-screen quality-card grid.
- **Verification status:** inline and browser-test JavaScript parse successfully; source-level checks find exactly one of each of the five approved intelligence panels and no remaining generic legacy chart block in that renderer. **No Chromium test run or visual sign-off on the current code has been reported**. Do not mark Devices Overview fully verified. This checkpoint supersedes the earlier open-panel statements in the two previous Devices Overview checkpoints above.


### Batched Devices Inventory Draft 02 source correction (4 November 2026)

- Commit `e0bde9a`: replaced the old live Inventory toolbar/results/table wrapper with the **approved `devices-inventory-draft-02.html` structural markup**. The original Search Devices layout, exactly five primary filters, result heading with integrated Sort control, and original card/table container now use the approved source, rather than restyled old layout.
- Values and controls remain bound to existing inventory functions: search, dynamic device types/status/locations, network assignment, mounting, ordering, saved row data and device detail buttons. Existing collision-aware unknown-location labelling and the empty-state user actions were preserved. The existing Device Intelligence filter context now uses the approved linked context class.
- Commit `082126f`: added Chromium checks for exact filter count and Sort placement, live search and sort interactions, saved device results and single-column mobile filter layout.
- **Verification:** the whole inline application JavaScript and browser test file parse. No live Chromium or side-by-side visual test has been confirmed on the current head. The retained dynamic table rows and additional Inventory states still require source-fidelity review; **do not call Device Inventory completed or accepted**.

## Development standards

Follow [CONTRIBUTING.md](../../CONTRIBUTING.md), the [Coding and Naming Conventions](06-Coding-and-Naming-Conventions.md) and the [Function Index](Function-Index.md). Describe source and test changes in plain British English, and keep the Function Index accurate if live functions are added or renamed.
