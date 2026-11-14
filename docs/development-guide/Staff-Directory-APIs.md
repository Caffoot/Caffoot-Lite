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

Staff responses include only approved directory fields and stable ID. Only verified
administrators also receive the nullable `accountId`; usernames, security fields,
roles, MFA and account-profile details are never joined into Staff responses.
Staff membership contains the Department ID, without exposing another section's
list or account administration. Contact details are excluded from new audit events.

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
