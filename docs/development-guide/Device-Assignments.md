# Device Assignments

This is unreleased Milestone 01 development. The published v2.1 installation
is unchanged. Batch 3.4 merged via PR #382 at
`05b162aa10a74994c970d0b6dbf111dc59b47513`; manual acceptance is deferred,
not passed. See the [draft user guide](../how-tos/features-and-instructions/v2.2/Device-Assignments-and-My-Equipment.md).
The sections below retain the historical initial-allocation contract. Current schema-29-and-later shared Devices support several equal Departments in one physical custody period; see [Shared Devices](../../backend/shared_devices.py) and the [current assignment guide](../how-tos/features-and-instructions/v2.2/Device-Assignments-and-My-Equipment.md). [Batch 3.8 circulation](IT-Assets-Issue-Return-and-Write-Off.md) adds protected stock projections and Schema 17 one-way closure; no original assignment field becomes editable.
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

Ordinary equipment operations retain assignment history. Device and recipient
foreign keys protect referenced records from deletion and legacy inventory replacement.
The administrator’s separate Clean Start operation clears operational records together.
Department archive,
reactivation and Staff inactivation retain outstanding allocations. Account
removal retains its attribution snapshot and clears only the existing Staff
login link. The general Device audit records recipient IDs rather than names
or contact information.

## Protecting Device Type And Identity

An ordinary Device edit retains the current Device Type and physical/virtual
identity whenever the Device has any recorded assignment (including ended
assignments) or a linked stock unit. `device_saves._validate_device_identity_change`
checks those persisted relationships inside the existing write transaction,
including related Device changes submitted with a host edit. IT Assets visibility
and permissions do not remove this protection. Associated equipment remains linked
through the original assignment; stock balances, movements and history remain intact.

An incompatible ordinary Device edit returns HTTP 400 with a fixed explanation
containing no hidden equipment details. IPAM-only and Racks-only edits retain their
existing HTTP 403 field-permission safeguards before the identity check. Rejection leaves the Device, revisions, edit reservations,
IPAM, assignments, stock and audit records unchanged. Names, hardware details,
notes, locations and other permitted fields retain their established validation.
Devices without these relationships can still receive legitimate type/identity
corrections. The separate Device Type Manager keeps its existing rename/delete
workflow, including propagation of the managed label to affected Devices; it does
not rewrite the original stock or assignment history. No schema or interface change
is required. This correction follows the canonical identity contracts in
[#232](https://github.com/Caffoot/Caffoot-Lite/issues/232),
[#352](https://github.com/Caffoot/Caffoot-Lite/issues/352) and
[#368](https://github.com/Caffoot/Caffoot-Lite/issues/368).

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
the next request, without changing any equipment holder. My Equipment now also includes safe outstanding Asset quantities. Each feature independently hides its equipment; disabling both returns two empty sections. No stock or directory grant is conferred.

[Stock intake](IT-Assets-Stock-Intake.md) and [circulation](IT-Assets-Issue-Return-and-Write-Off.md) document the implemented development workflows. Schema 17 closes outstanding assignments only with a matching stock operation and audit. With both Read permissions, assignment history also includes the real closure kind, date and historical actor; IT Assets feature-off omits that stock fact. Get From Stock, Device reissue, associated accessories, corrections and Service Desk remain later work.
