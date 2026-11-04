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
- **Still outstanding:** verified email ownership, password recovery, approved security notifications and last-resort host-only administrator recovery; further meaningful/detail-level Audit Trail coverage; remaining approved Device and Rack screens, full IPAM interaction and side-by-side visual acceptance; overall functional and visual checks. SMTP configuration alone does **not** enable recovery or notifications.
- The Chromium regression must be evaluated on the **final branch head**; older checks that passed before these changes, or early failing tests corrected mid-development, are not final acceptance evidence.

PR #281 remains **draft and unmerged**. PR #277 and PR #279 remain separate and unmerged. No private acceptance Docker package, public image, release or production deployment has been authorised.

## Development standards

Follow [CONTRIBUTING.md](../../CONTRIBUTING.md), the [Coding and Naming Conventions](06-Coding-and-Naming-Conventions.md) and the [Function Index](Function-Index.md). Describe source and test changes in plain British English, and keep the Function Index accurate if live functions are added or renamed.
