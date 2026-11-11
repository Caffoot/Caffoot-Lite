# Shared Roles And Account Permissions

This is work on `milestone-1` under [Batch 01](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790154284) and [Batch 02 in issue #351](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6790154888). The published release remains v2.1. This development branch is **not ready to deploy**: the approved sign-in, My Account and Users interface integration remains later work. Batch 02 adds backend operations only.

## Database Upgrade

Schema 11 adds `roles`, `role_grants`, `account_roles` and `account_permission_overrides`. Every existing account, including disabled accounts and independent administrators, receives the protected, enabled **Staff Member** role. First-administrator setup and ordinary account creation assign it within the account transaction. This role grants no Devices, IPAM or Racks access and does not create or infer a People link.

Existing Read and Edit rows become matching individual overrides. A previously missing row remains missing: it means **Inherit**, allowing a later authorised role to supply access. Because Staff Member has no inventory grants and no other memberships are added, this cannot initially widen access. Deliberate `deny` overrides are supported separately.

The upgrade runs within the existing single `BEGIN IMMEDIATE` transaction. Before recording version 11, it checks identities and account security fields, exact grant mapping, complete Staff Member membership, absence of additional grants, foreign keys and removal of **all** old sessions. Failure rolls back the complete upgrade, including session removal. Repeated startup does not repeat migration or revoke newly issued sessions. Unsupported newer schemas fail closed.

The old `account_permissions` table is retained for historical inspection. Runtime access checks, sign-in, session resolution, email recovery and the Users response now use `role_policy.py:evaluate_role_policy`. Permission changes write only `account_permission_overrides`. Deleting an account still allows its historical rows to be removed by the existing foreign-key relationship; they never supply access.

## Access And MFA

The shared policy takes the highest Read/Edit grant across enabled additional roles, then applies any individual override. A deliberate No Access (`deny`) blocks inherited access; Read or Edit sets that exact level. Disabled roles contribute neither grants nor an MFA requirement. Unknown sections are ignored until registered by the server, and newly registered sections start without ordinary-user access. Staff Member cannot hold inventory grants or be renamed, disabled or deleted; role keys cannot change.

Protected Administrator remains a separate account flag. It retains its existing inventory access after MFA, including where an individual section override would restrict an ordinary user. Disabled accounts and unknown sections are denied. Existing checks for related Devices, IPAM and Racks actions, edit reservations, imports and last-administrator protection remain in force.

MFA is required by any enabled additional role (even one with no grants), any effective wider Read **or** Edit grant, or independent Administrator status. Once enrolled voluntarily, an account must continue supplying authenticator codes even if its permissions are removed. Configured permissions are available to administrator account inspection while access remains blocked pending enrolment. Sign-in, live sessions, recovery and section access all use the same policy.

The existing Users interface and request shape are preserved. Its No Access control still sends `null`; the server adapter stores that deliberate choice as `deny`. The internal `set_permission(..., None)` restores Inherit by deleting the override. The existing Users response keeps its positive `permissions` map, now resolved from roles and overrides; the later approved role-management interface will distinguish inherited, configured and exercisable access explicitly. No role-management API is introduced here.

Existing Edit grants still require completed MFA before they can be assigned through the current account controls. A Read grant may be configured while enrolment is pending, but it cannot give an unenrolled account an application session or inventory access. Previously unenrolled legacy readers receive an enrolment-required response after a valid password, without any application session. The password-verified pre-login routes described below complete the backend transition. Their interface integration remains later work; do not deploy this intermediate build.

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
