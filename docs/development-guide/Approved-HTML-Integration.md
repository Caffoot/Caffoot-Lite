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
- Do not silently add separately scoped SMTP, profile or audit-retention behaviour during the visual integration.

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

**Source mapping only, not an implemented or verified redesign.** Development starts from the working `main` branch so that unapproved visual shortcuts from PR #279 are not silently carried forward. PR #277 and PR #279 remain separate and unmerged. No public image, release or production deployment is authorised.

## Development standards

Follow [CONTRIBUTING.md](../../CONTRIBUTING.md), the [Coding and Naming Conventions](06-Coding-and-Naming-Conventions.md) and the [Function Index](Function-Index.md). Describe source and test changes in plain British English, and keep the Function Index accurate if live functions are added or renamed.
