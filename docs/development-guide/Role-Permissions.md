# Shared Roles And Account Permissions

This is work on `milestone-1` under [Batch 01](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790154284), [Batch 02](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790154888) and [Batch 03](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790155451). The published release remains v2.1. [Corrected Batch 04](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790324888) integrates these operations into the existing approved Users, sign-in and My Account interfaces. This development branch is **not ready to deploy**: Batch 04 owner review and separately authorised later verification remain required.

## Database Upgrade

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

The existing Overview retains its four account totals, two charts and access guide. User List retains five columns, search/status/MFA filters and its mobile Manage controls. The Add User form adds Confirm Initial Password alongside the existing optional personal details. The backend assigns Staff Member without inventory grants.

Manage Roles is the fourth tab, after Overview, User List and Add User. Create and Manage forms use the real catalogue, stable generated custom keys and current grants. Staff Member is protected. Role rename, grants, enable/disable and delete all require preview and explicit confirmation. New roles start enabled and unassigned; the status control is available after creation.

Manage User keeps editable personal details, account enable/disable, independent Administrator status and deletion. Additional-role checkboxes each review one membership change. The existing section cards show server-provided inherited and effective levels, with Inherit/No Access/Read/Edit override choices. An ordinary change opens a preview instead of immediately writing. Cancelling preserves the saved value. The preview shows before/after roles, each section's inheritance/override/effective access, retained permissions, MFA states and affected sessions. A stale or expired confirmation saves nothing, replaces the displayed consequences and requires another explicit confirmation. Unavailable targets cannot be confirmed. Notification feedback distinguishes SMTP configuration, eligible verified recipients, queue admission, coalescing and unsuccessful queue admission; it never establishes delivery.

Mandatory existing-account enrolment reuses the sign-in QR/manual-key and six-digit-code presentation, with the ordinary `/api/login/mfa/start` and `/confirm` endpoints. It creates no application session and clears the displayed key/code after completion. A fresh password and authenticator sign-in is required. First-administrator setup remains separate.

### Staff-Only My Account Entry

The [specific owner approval](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6794069354) permits authenticated `/account` to serve the same approved My Account interface. Sign-in sends accounts without inventory access there; inventory-eligible users retain their existing destination and navigation. Staff-only startup fetches the signed-in account's profile/session and static packaged interface resources, not inventory state. The client hides unavailable inventory navigation and refuses other workspaces, while the server independently retains all inventory, administrator and other-user API checks. `/inventory` still requires inventory access. Static templates/code contain no saved inventory or other accounts' information and require authentication, except existing public sign-in resources.

The session's `mfa_removal_eligible` flag is computed by the shared server policy. Only eligible enrolled users see Remove MFA inside the existing My Account Security tab. Its form requires the current password and six-digit code. The backend independently rechecks current eligibility under the existing transaction, revokes all sessions on success and requires a fresh sign-in. Removing or disabling a role does not automatically remove MFA. Own profile, photo, appearance, password and voluntary MFA controls remain available.

Browser evidence and current verification status belong in the active handover and issue #351. Interface captures are review evidence, not product-owner visual acceptance or permission to deploy.
