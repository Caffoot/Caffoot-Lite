# Staff Members And Departments Backend APIs

Batch 3.2 builds on accepted schema 14 at `97368e734f3e8008a9acc929b999a198eca1cf3f`.
Its [authorisation](https://github.com/Caffoot/Caffoot-Lite/issues/368#issuecomment-6877568738)
covers backend operations only. No interface, navigation, assignment, recipient
picker, stock or My Equipment implementation is included.

## HTTP Contract

All routes require a verified live session. GET checks the section's effective
Read permission; POST checks Edit, same origin and the existing session CSRF proof.
MFA, inheritance, overrides and default-deny use the existing policy. Cross-site
requests are rejected. Mutations recheck the live session and rights after acquiring
the database write lock. Read responses use one database snapshot.

| Route | GET | POST |
| --- | --- | --- |
| `/api/staff-members` | List/search Staff | Create Staff, optionally with login |
| `/api/staff-members/{id}` | View Staff | Edit supplied Staff fields/status |
| `/api/staff-members/{id}/login` | Unavailable | Administrator creates login for unlinked Staff |
| `/api/departments` | List/search Departments | Create Department |
| `/api/departments/{id}` | View Department | Rename, archive or reactivate |
| `/api/departments/{id}/delete` | Unavailable | Delete only if never associated; body `{}` |

Lists accept `query` (up to 100 characters), `limit` (1–100, default 100) and
`offset` (0–1000000, default 0). Staff search matches a literal substring of the
person's name or associated Department name, including archived Departments.
It requires Staff Members Read only and returns the same Staff fields; it does
not grant Departments directory access. Department search matches its name.
SQL wildcards are escaped. Lists return `staffMembers` or `departments`; record operations
return `staffMember` or `department`. No permanent Staff deletion exists.

Staff fields are `firstName`, `lastName`, `email`, `departmentId`, `jobTitle`,
`telephone`, `location`, `active`. Manual creation requires non-blank First Name
and Surname. Migrated blank names remain editable. Department is nullable; omitted
fields retain their saved values on edit. Optional `login` contains exactly
`username` and `password`. The login-only route accepts that same two-field object.
Any login creation requires a verified administrator in addition to Staff Edit.
No login is created when `login` is omitted. Clients cannot set account IDs, roles,
MFA, administrator status or arbitrary fields through these APIs.

Text is trimmed, rejects control characters and has these character limits:
names 100 each, email 254, job title 120, telephone 100, Location 200 and Department
name 120. Email uses the existing optional account-profile email validator.
Booleans must be real JSON booleans. Unknown and duplicate JSON keys are rejected.
Department payloads accept only `name` and `archived`.

Missing records return 404 after permission checks. Invalid values return 400,
unsupported content types 415, denied writes 403 and unauthenticated reads 401.
Duplicate identities/names, already-linked Staff and unsafe Department associations
return a generic 409 without database or account details. Saved replies return 200.

Staff responses include approved directory fields, stable ID and a saved `revision`. Only verified
administrators also receive the nullable `accountId`; usernames, security fields,
roles, MFA and account-profile details are never joined into Staff responses.
Staff membership contains the Department ID, without exposing another section's
list or account administration. Contact details are excluded from new audit events.

## Preventing Stale Staff Edits

Every Staff list, detail and successful save response includes `revision`, a string
of 64 lower-case hexadecimal characters. Keep the revision with the values originally
opened for editing and send it in `POST /api/staff-members/{id}`, including quick
Active/Inactive changes and combined Staff/login saves. Omitted profile fields still
retain their saved values. Creation does not accept a revision; the administrator-only
`/{id}/login` route retains its existing two-field contract and duplicate-link checks.

After `BEGIN IMMEDIATE` and the existing session/permission rechecks, the server
compares the submitted revision against the saved record before writing Staff, login
or audit data. A missing or malformed revision returns 400. A stale revision returns
409 with `code: "stale_staff_edit"` and: “This Staff Member was changed elsewhere.
Refresh the current details before editing again.” A rejected save changes no tables
and produces no successful audit event.

The revision hashes the Staff ID, all eight editable directory fields and the last
existing Staff audit event ID for that record. This catches profile, Department and
status changes, including a value changed back since a form was opened. It uses no
new column or schema migration. Linked-account identifiers and security data are
excluded; unrelated Staff records, account security and Department renaming do not
invalidate a Staff form. The revision is a comparison value, never an access grant.

The existing form keeps all entered values on conflict, including optional login
fields. **Refresh Current Details** asks before replacing unsaved entries, then loads
the current saved Staff values and Department choices. Cancelling or a failed refresh
keeps the form intact. Quick status conflicts offer the same refresh route on Staff
Details. Original layouts, controls and button placements are retained; the refresh
button appears only with conflict feedback.

## Batch 3.3 Directory Presentation Extensions — Merged

The Stage 3.3 integration retains the Stage 3.2 API contracts and adds the following
small, permission-scoped outputs to support the approved forms:

- `GET /api/staff-members/department-choices`: requires **Staff Members Read**.
  Returns `{ "departments": [{ "id", "name", "archived" }] }` for linked
  Departments (including archived current memberships). Users with **Staff Members
  Edit** additionally see active Departments eligible for new membership. It
  never returns general unlinked archived Departments, Staff records or other
  Departments management information, and cannot be used for mutation.
- `GET /api/departments` and `GET /api/departments/{id}` additionally include
  `canDelete`, computed by the server against Staff current and historic
  Department associations. This is a display hint, **not** authorisation:
  deletion still performs the original transactional association check.
- `GET /api/session` retains `can_enter_inventory` with its original meaning,
  and adds `can_enter_workspace` plus the current user's effective
  `directory_permissions` for Staff Members and Departments. The signed-in
  Staff-only user can enter the normal shell but **cannot** fetch inventory
  state or any Devices/IPAM/Racks data without their independent rights.
- The signed-in Staff Member form uses the existing POST directory endpoints.
  Optional account creation still requires a verified administrator; Staff
  edit status and account status remain independent. The approved two-column
  layout uses the owner's accepted Cancel / Save Staff Member controls.

Batches 3.2 and 3.3 merged via PRs #378 and #381. Batch 3.4 subsequently
merged via PR #382 at `05b162aa10a74994c970d0b6dbf111dc59b47513` (schema 15);
its manual acceptance is deferred, not passed. The original access restrictions
remain. See [Device Assignments](Device-Assignments.md) and the
[draft v2.2 user guides](../how-tos/features-and-instructions/v2.2-draft/README.md).

## Transaction And Lifecycle Rules

`permissions.create_user_in_transaction` is the shared account writer. Existing
`create_user` owns its original transaction; combined directory saves call the
writer within their own transaction. Both use the same username/password validation,
password hashing, optional profile storage, protected Staff Member baseline role,
account audit and unique Staff linking. There is no nested commit. The combined
form supplies the three compatible personal fields; account Display Name stays
blank, with no extra form requirement or invented value.

`staff_identity.link_account_staff` creates one independent identity for Users and
initial administrator setup, or links the explicitly selected unlinked Staff record.
It requires an existing transaction and never commits. A failed role, profile,
link or audit write rolls back the account and Staff changes together. Unique links
and the write lock prevent duplicate accounts for one Staff record under concurrency.
Existing account APIs and responses retain their contracts.

Staff and account profile/status edits stay independent. Inactive Staff retain
their login and records. Account deletion retains Staff through the accepted nullable
link. Archived Departments retain current membership; unchanged archived membership
can be retained during ordinary profile edits, but new membership is refused.
Reactivation permits new membership again.

Department deletion checks current Staff references and historical Staff Department
IDs recorded in the existing audit history, including the former Department when
membership is removed. Such Departments must be archived instead. This batch has no
equipment association tables; later assignment writers must extend the same safe
deletion check for their own current/historical relationships before adding them.

## Checks

`test_staff_directory.py` covers service validation, lifecycle, privacy, independent
profiles/status, shared account creation, atomic failure and concurrent login creation.
`test_staff_directory_http.py` exercises the real HTTP handler, session/CSRF/origin
guards, duplicate fields, statuses, search, record privacy and administrator-only
login creation. Queued writes test session/MFA/permission revocation and archived
Departments after waiting for the database lock. HTTP and wider regression evidence is recorded in the active
[Milestone 01 handover](../development-handovers/milestone-01.md) and Batch 3.2 PR.

## Department Details — Batch 3.5 review branch

The four-tab screen reuses the existing contracts; no endpoint, schema, permission or
feature is added. Department Read allows its own record only. Staff membership is
filtered from fully paginated Staff responses, requiring Staff Members Read. Equipment
comes from `GET /api/equipment/assignments?departmentId=…` plus the protected Devices
projection; Devices must be enabled and readable. Personal Staff assignments are excluded.

The existing Audit Trail response may provide Department changes to authorised viewers.
Its established filtering is preserved: many limited accounts receive no Department events.
The screen filters returned events by the exact Department ID and combines them with
its canonical assignment history, without manufacturing lifecycle dates or new events.
Empty/restricted states describe availability, not an absence of historical changes.
The accepted source of truth remains the application's existing server-side policy.
