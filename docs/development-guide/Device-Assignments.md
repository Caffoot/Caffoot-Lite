# Device Assignments

This is unreleased Milestone 01 development. The published v2.1 installation
is unchanged. Batch 3.4 merged via PR #382 at
`05b162aa10a74994c970d0b6dbf111dc59b47513`; manual acceptance is deferred,
not passed. See the [draft user guide](../how-tos/features-and-instructions/v2.2-draft/Device-Assignments-and-My-Equipment.md).
Scope: [Batch 3.4](https://github.com/Caffoot/Caffoot-Lite/issues/368#issuecomment-6881744109).

Schema 15 introduces `device_assignments`. Each dated record references the
original Device and exactly one Staff Member or Department. It retains the
recipient label, responsible account ID and username at allocation time.
Current-holder labels follow later Staff/Department renames; the history keeps
the original recorded labels. The
partial unique index permits only one open allocation per Device. No inventory
JSON assignment list, Device copy or separate handover system is created.

Initial allocation records an eligible existing Device's holder. It does not
assert physical possession by a storeroom or mark equipment Ready. Inactive
Staff, archived Departments, inactive/retired Devices, virtual machines, stale
revisions, edit reservations and Devices with assignment history are rejected.
Only Desktop, Laptop and Printer are eligible for initial allocation, as
[confirmed by the product owner](https://github.com/Caffoot/Caffoot-Lite/issues/368#issuecomment-6883527160).
Other Device types remain blocked unless separately approved.
The whole multi-Device request either commits with attributable audit events or
rolls back. After waiting for the SQLite write lock, the operation rechecks its
session, MFA-dependent effective rights, current recipients and Device state.

History cannot be deleted or rewritten. Device/recipient foreign keys block
unsafe deletion, including bulk inventory replacement/reset. Department archive,
reactivation and Staff inactivation retain outstanding allocations. Account
removal retains its attribution snapshot and clears only the existing Staff
login link. The general Device audit records recipient IDs rather than names
or contact information.

## API

All responses are authenticated and non-cacheable. Mutation requires the
existing same-origin, session-bound CSRF proof and an active verified session.

| Endpoint | Access And Response |
| --- | --- |
| `GET /api/equipment/recipients?kind=staff&query=…` | Devices Edit; active Staff names/IDs only. `kind=department` offers non-archived Departments. No contact, account or security fields. |
| `GET /api/equipment/available-devices?query=…&limit=100&offset=0` | Devices Edit; eligible canonical Device IDs, names, types and revisions. LIMIT/OFFSET count eligible matching Devices in name/ID order, after the existing eligibility checks. |
| `GET /api/equipment/assignments?deviceId=…` | Devices Read; current holder and dated history. Exactly one of `deviceId`, `staffId`, `departmentId` is required. |
| `POST /api/equipment/assignments` | Devices Edit; `{recipientKind: "staff" or "department", recipientId, devices: [{id, revision}]}`; 1–100 distinct Devices. |
| `GET /api/my-equipment` | Own authenticated account; no inventory grant required. Accepts no identity parameters. Returns `assignedToMe` and `sharedWithMyDepartment`. |

Personal equipment contains only ID, name, type, manufacturer, model and
allocation date. It contains no network configuration, notes, contacts, other
holders, history or administration actions. Membership changes take effect on
the next request, without changing any equipment holder. Devices feature-off
returns two empty sections and denies the IT assignment APIs.

Returns, direct reassignment, stock receipt/readiness/preparation, balances,
write-off/correction, Get From Stock, associated accessories and Service Desk
remain later workflows. No corresponding mutation endpoint or placeholder
action is offered. Any future closing of an allocation requires its own approved
audited workflow and migration of the history guards.
