# Shared Roles And Account Permissions

## Staff And Department Foundation — Schema 14 Candidate

Batch 3.1 extends the existing section list with Staff Members, Departments and
IT Assets. It creates no grants or roles, retains default-deny and MFA, and keeps
the inventory importer explicitly dependent on Devices/IPAM/Racks Edit only.
Staff/Departments are core; effective IT Assets access remains off pending its
separate feature batch. See [Staff Directory Foundation](Staff-Directory-Foundation.md).
The Stage 1 checkpoint below is historical; PR #358 was subsequently accepted and
merged, and Stage 2 is included in the approved Batch 3.1 baseline.

This is development on `milestone-1`; the published release remains v2.1.
Original Stage 1 was [accepted](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6816955325)
at `53252613cf5302d8e526324c0982b8807472e251`. The additional
[IT Staff feature](https://github.com/Caffoot/Caffoot-Lite/issues/365) introduces
schema 12 and requires separate private Raspberry Pi acceptance before any new
merge decision. PR #358 remains draft and unmerged.

## Configurable Built-In Roles — Schema 12

IT Staff is a protected built-in identity, initially enabled with Devices,
IPAM and Network Racks **Edit**. Administrators can review/confirm grant changes,
disable/re-enable it and assign/remove memberships through the existing controls.
Its key and name cannot change and it cannot be deleted. Administrator remains
an independent account flag. Staff Member retains all of its stricter protections.

Schema 12 permits multiple configurable built-in identities using the existing
role columns and services. Only IT Staff is introduced; no future departmental
roles or permissions are created. Both database triggers and role administration
protect built-in identity. Custom roles retain their existing rename/delete rules.

The accepted schema-10→11 migration below remains unchanged. A subsequent
schema-11→12 migration rebuilds the roles CHECK constraint while preserving IDs,
grants and memberships, with foreign keys enabled throughout the same transaction.
All existing active accounts, including administrators and Staff-only accounts,
receive IT Staff. Disabled accounts receive no new membership. Existing section
levels remain exact: existing individual choices stay intact, and only missing
overrides needed to preserve an earlier Read or No Access result are added.
Earlier Edit outcomes and independent Administrator access need no extra choices.
Existing custom roles, disabled roles, account security fields, inventory and
history are preserved. Repeated startup does not repeat assignment or revoke
new sessions. A failed migration rolls everything back. A pre-existing custom
role using the IT Staff key/name causes a safe failure rather than conversion,
renaming or deletion of that role; resolve such a collision before upgrading.

Every newly assigned active account's sessions and email proofs are invalidated,
following the existing membership-change rule. IT Staff imposes mandatory MFA
even when all three effective section levels remain No Access. Unenrolled users
must use the existing password-verified enrolment and then sign in afresh; no
session, automatic enrolment or MFA exception is introduced. Disabled accounts'
security state is unchanged. Fresh installations create IT Staff unassigned;
first-admin and new ordinary-account creation continue to assign Staff Member only.

Preserved overrides remain authoritative after future role edits. Selecting
**Inherit** intentionally removes an override and resumes role-derived access.
See the [Dave and Tim example](../how-tos/features-and-instructions/Users-Permissions-and-MFA.md#it-staff-and-individual-permissions).

## Database Upgrade

This section records the retained schema-10→11 stage. Schema 12 then applies
the additional migration above before the application starts.

Schema 11 adds `roles`, `role_grants`, `account_roles` and `account_permission_overrides`. Every existing account, including disabled accounts and independent administrators, receives the protected, enabled **Staff Member** role. First-administrator setup and ordinary account creation assign it within the account transaction. This role grants no Devices, IPAM or Racks access and does not create or infer a People link.

Existing Read and Edit rows become matching individual overrides. A previously missing row remains missing: it means **Inherit**, allowing a later authorised role to supply access. Because Staff Member has no inventory grants and no other memberships are added, this cannot initially widen access. Deliberate `deny` overrides are supported separately.

The upgrade runs within the existing single `BEGIN IMMEDIATE` transaction. Before recording version 11, it checks identities and account security fields, exact grant mapping, complete Staff Member membership, absence of additional grants, foreign keys and removal of **all** old sessions. Failure rolls back the complete upgrade, including session removal. Repeated startup does not repeat migration or revoke newly issued sessions. Unsupported newer schemas fail closed.

The old `account_permissions` table is retained for historical inspection. Runtime access checks, sign-in, session resolution, email recovery and the Users response now use `role_policy.py:evaluate_role_policy`. Permission changes write only `account_permission_overrides`. Deleting an account still allows its historical rows to be removed by the existing foreign-key relationship; they never supply access.

## Access And MFA

The shared policy takes the highest Read/Edit grant across enabled additional roles, then applies any individual override. A deliberate No Access (`deny`) blocks inherited access; Read or Edit sets that exact level. Disabled roles contribute neither grants nor an MFA requirement. Unknown sections are ignored until registered by the server, and newly registered sections start without ordinary-user access. Staff Member cannot hold inventory grants or be renamed, disabled or deleted; role keys cannot change.

Protected Administrator remains a separate account flag. It retains its existing inventory access after MFA, including where an individual section override would restrict an ordinary user. Disabled accounts and unknown sections are denied. Existing checks for related Devices, IPAM and Racks actions, edit reservations, imports and last-administrator protection remain in force.

MFA is required by any enabled additional role (even one with no grants), any effective wider Read **or** Edit grant, or independent Administrator status. Once enrolled voluntarily, an account must continue supplying authenticator codes even if its permissions are removed. Configured permissions are available to administrator account inspection while access remains blocked pending enrolment. Sign-in, live sessions, recovery and section access all use the same policy.

The existing interface files remain unchanged. The former direct `POST /api/users/permission` is retired with HTTP 410. The retained Python `set_permission` adapter also requires a live session and the matching preview proof: permission changes now require the preview and confirmation protocol below. The intermediate branch must not be deployed before Batch 04 connects the approved controls. Independent administrator promotion still requires confirmed MFA; role grants and individual Read/Edit may be configured before enrolment, with access blocked by the shared policy until enrolment completes.

## Existing-Account MFA Operations

`evaluate_role_policy` distinguishes a requirement imposed by current access (`mfa_mandatory`) from `requires_mfa`, which also retains voluntary enrolment. Normal login, live session resolution, section access and verified-email recovery continue to share this policy. Session creation verifies credentials and inserts the session within one write transaction.

After a valid active-account password, `POST /api/login` returns `{"status": "mfa enrolment required"}` for mandatory-but-unconfirmed MFA. It sets no cookie and creates no session. This response neither adds a failed attempt nor clears earlier code failures. Invalid credentials, inactive accounts and throttled requests retain generic failure responses.

| POST route | Exact JSON fields | Successful result |
| --- | --- | --- |
| `/api/login/mfa/start` | `username`, `password` | `mfaSecret` and `mfaUri`; reuses the pending secret |
| `/api/login/mfa/confirm` | `username`, `password`, `mfa_code` | `status: mfa enrolled`; no session or cookie |
| `/api/account/mfa/remove` | `password`, `code` | `status: mfa removed`; expires the current cookie |

Both pre-login operations independently check the password, active state, current mandatory policy and unconfirmed state under `BEGIN IMMEDIATE`. They accept only the configured Origin, JSON and at most 4 KiB, and share the existing peer/account login throttle. Successful start or setup-required responses do not reset failed confirmations. Confirmation requires the current pending secret's six-digit code. It atomically confirms MFA, records a sanitised attributable audit event and revokes all account sessions and outstanding email proofs. A fresh username/password/authenticator sign-in is required. Neither route exposes first-administrator setup or authenticated account operations to ordinary unauthenticated callers.

Removal requires a live authenticated session, its CSRF proof, the configured Origin, current password and current six-digit code. Within one transaction it checks the session again and rejects inactive accounts, independent administrators, any enabled additional role (including zero-grant/read-only roles), and any effective wider Read/Edit. It clears the secret and confirmation, records the audit event and revokes all own sessions/email proofs atomically. It changes no roles or grants. Verified-account/administrator security notices use the established delivery rules. A later role or wider grant requires enrolment again; disabling or removing a role never removes an authenticator automatically.

First-administrator setup, existing voluntary enrolment and promotion's already-confirmed-MFA requirement remain in place. The existing TOTP verifier accepts adjacent time steps for clock drift; it does **not** provide one-time replay prevention.

## Backup And Rollback

Use only disposable, fictional databases for development checks. Before a future authorised deployment, take a consistent private backup of the **entire `/data` directory**, including SQLite, SMTP configuration, the email-proof secret and TLS/private files, and retain the matching v2.1 application image. Rehearse restoration on an isolated copy. A v1.3.3 JSON inventory export cannot restore accounts or these private files.

Rolling back requires restoring that entire matching v2.1 directory and application image together. Never run the v2.1 application against a schema-11 database. See [Database](02-Database.md) and [Account Recovery](Account-Recovery.md).

The [isolated upgrade and restore rehearsal](Upgrade-And-Restore-Rehearsal.md)
describes the two-image check, exact comparison method and owner preflight.
Its fictional data cannot establish that another installation has a usable backup.

## Administrator Role Operations

[Batch 03](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790155451) adds administrator-only `POST /api/users/roles/preview` and `POST /api/users/roles/confirm`. Both require the configured Origin, JSON (at most 4 KiB), a live MFA-confirmed administrator session and its CSRF header. `GET /api/users` retains existing fields and adds the role catalogue and per-account `accessDetails` for the later approved interface integration.

Preview accepts exactly `{"action": action}`. Confirmation accepts exactly `{"action": action, "proof": proof}`. The action fields are:

| Type | Additional required fields |
| --- | --- |
| `role.create` | `roleKey`, `name`, `grants` |
| `role.update` | `roleId`, `name`, `enabled`, `grants` |
| `role.delete` | `roleId` |
| `membership.assign`, `membership.remove` | `roleId`, `userId` |
| `override.set` | `userId`, `section`, `level` |

`grants` maps registered sections to `read` or `edit`; omitted sections have no grant. `role.update` supplies the complete proposed definition, allowing rename, grant editing and enable/disable together. Keys remain stable through rename. Custom keys use 1–80 lowercase letters, digits or underscores, starting with a letter. Names use 1–80 printable characters with no surrounding spaces. New roles are unassigned. Overrides use `null` for Inherit, `deny` for No Access, `read` or `edit`. Unknown fields, sections, identifiers, baseline changes and unchanged proposals are rejected. Administrator status remains an independent operation with its existing safeguards.

Preview returns the exact action, affected account list/count, each account's before/after enabled roles and grants, highest inheritance, explicit choice, effective rights, retained permissions, MFA requirement/pending status, unexpired stored session count and revocation consequences. It contains no passwords, authenticator secrets, email addresses or session identifiers. A five-minute proof signed with a server-only in-memory key and the session binds the session, actor, exact action and current dependencies. Temporary preview writes are rolled back. A server restart invalidates pending previews and requires a fresh confirmation; it creates no persistent approval store. Role definitions are also shown before/after, including unassigned roles.

Confirmation repeats authorisation under `BEGIN IMMEDIATE`, recomputes consequences and verifies the proof. Stale, forged, expired, replayed or mismatched confirmation returns HTTP 409 with a new `preview`, without saving anything. If the target/action is no longer valid, the refreshed preview has `available: false` and `proof: null`; refresh the account/role list. History retains a non-secret confirmation reference to prevent reuse, including after a change is reversed.

Successful confirmation atomically saves the change, attributable history and affected session/email-proof revocation. Membership assignment/removal always revokes the target's sessions. Other role/override changes revoke sessions only where effective rights or MFA requirements change. A rename or a grant hidden by an override does not force a sign-out. Unrelated accounts retain sessions. Existing enrolled MFA is never erased by role changes. Role deletion preserves its definition in history.

After commit, `notifications` reports SMTP configuration, active verified-account eligibility, distinct recipient count, queue admissions, coalesced notices and unsuccessful queue admissions. It includes existing Settings → Email/SMTP/address-verification guidance for Batch 04. Eligible administrator recipients share the existing generic notice. Missing SMTP, ineligible recipients, queue failure and mail exceptions cannot undo access changes. Queue admission never establishes delivery; no delivery log or retry service is added.


## Users And My Account Interface

My Account shows all of the signed-in account's assigned roles, including Staff
Member and disabled assignments labelled **Disabled**. Administrator status is
shown separately. The session response supplies only the account's own role
names and enabled flags for this display; existing access and MFA rules apply.

Rack editing, placement, movement and removal controls require Racks Edit.
Readers retain the existing rack/accessory presentation without those controls;
vertical accessories and empty U positions remain visible as read-only content.
Devices permissions still determine which mounted device records are supplied.
No rack-display projection or change to inventory API permissions is introduced.

The existing Overview retains its four account totals, two charts and access guide. User List retains five columns, search/status/MFA filters and its mobile Manage controls. The Add User form adds Confirm Initial Password alongside the existing optional personal details. The backend assigns Staff Member without inventory grants.

Manage Roles is the fourth tab, after Overview, User List and Add User. Create and Manage forms use the real catalogue, stable generated custom keys and current grants. Staff Member is protected. Role rename, grants, enable/disable and delete all require preview and explicit confirmation. New roles start enabled and unassigned; the status control is available after creation.

Manage User keeps editable personal details, account enable/disable, independent Administrator status and deletion. Additional-role checkboxes each review one membership change. The existing section cards show server-provided inherited and effective levels, with Inherit/No Access/Read/Edit override choices. An ordinary change opens a preview instead of immediately writing. Cancelling preserves the saved value. The preview shows before/after roles, each section's inheritance/override/effective access, retained permissions, MFA states and affected sessions. A stale or expired confirmation saves nothing, replaces the displayed consequences and requires another explicit confirmation. Unavailable targets cannot be confirmed. Notification feedback distinguishes SMTP configuration, eligible verified recipients, queue admission, coalescing and unsuccessful queue admission; it never establishes delivery.

Mandatory existing-account enrolment reuses the sign-in QR/manual-key and six-digit-code presentation, with the ordinary `/api/login/mfa/start` and `/confirm` endpoints. It creates no application session and clears the displayed key/code after completion. A fresh password and authenticator sign-in is required. First-administrator setup remains separate.

### Staff-Only My Account Entry

The [specific owner approval](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6794069354) permits authenticated `/account` to serve the same approved My Account interface. Sign-in sends accounts without inventory access there; inventory-eligible users retain their existing destination and navigation. Staff-only startup fetches the signed-in account's profile/session and static packaged interface resources, not inventory state. The client hides unavailable inventory navigation and refuses other workspaces, while the server independently retains all inventory, administrator and other-user API checks. `/inventory` still requires inventory access. Static templates/code contain no saved inventory or other accounts' information and require authentication, except existing public sign-in resources.

The session's `mfa_removal_eligible` flag is computed by the shared server policy. Only eligible enrolled users see Remove MFA inside the existing My Account Security tab. Its form requires the current password and six-digit code. The backend independently rechecks current eligibility under the existing transaction, revokes all sessions on success and requires a fresh sign-in. Removing or disabling a role does not automatically remove MFA. Own profile, photo, appearance, password and voluntary MFA controls remain available.

Browser evidence and current verification status belong in the active handover and issue #351. Interface captures are review evidence, not product-owner visual acceptance or permission to deploy.
