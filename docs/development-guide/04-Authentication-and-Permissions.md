# 04 — Authentication, MFA and permissions

## In simple terms

The first person deploying Caffoot Lite chooses an administrator username and password, then enrols an authenticator app before gaining access. That administrator can create users and decide which inventory sections they can view or edit. There is **no public sign-up**. In published v2.1, read-only users can work without MFA. On the `milestone-1` development branch, any wider Read or Edit access requires MFA, including preserved legacy Read grants. This intermediate branch must not be deployed before its later interface work is complete. See [Shared Roles And Account Permissions](Role-Permissions.md).

## Account and sign-in path

- [`accounts.py`](../../backend/accounts.py): `bootstrap_first_admin` only works before an account exists; `confirm_admin_mfa` verifies the first authenticator code. Password hashes use PBKDF2-HMAC-SHA256 with a per-password salt and the current source-defined work factor.
- [`mfa.py`](../../backend/mfa.py): new TOTP secret, authenticator provisioning URI, code generation and verification.
- [`authentication.py`](../../backend/authentication.py): validates account credentials and any required authenticator code; reports mandatory enrolment only after valid password proof.
- [`request_auth.py`](../../backend/request_auth.py): `login` applies login throttling; `authenticated_account` and `authorised_mutation` establish the session and mutation boundary.
- [`sessions.py`](../../backend/sessions.py): issues random opaque session tokens, stores **only their hashes** in SQLite and checks expiry/account eligibility. Current `SESSION_SECONDS` is **12 hours**.
- [`http_security.py`](../../backend/http_security.py): a host-only `caffoot_session` cookie with `Secure`, `HttpOnly` and `SameSite=Strict`; same-origin/CSRF checks for modifications.
- [`account_security.py`](../../backend/account_security.py): password-verified pre-login enrolment and eligible voluntary MFA removal, with transactional policy checks, audit and session revocation.
- [`server.py`](../../backend/server.py): the actual HTTPS routes, response handling and session checks. It does **not** accept arbitrary forwarded headers as the trusted external origin.

The configured `CAFFOOT_WEB_ADDRESS` defines the permitted HTTPS origin; altering a frontend control cannot change backend access rights.

## Roles and permissions

The shared source of truth for role decisions is [`role_policy.py`](../../backend/role_policy.py), called by [`permissions.py`](../../backend/permissions.py), authentication, sessions, recovery and the Users response.

| Account state | Effective inventory access |
| --- | --- |
| First administrator, after MFA | Administrator access to the approved inventory and Users/Settings areas |
| New ordinary account | Staff Member, with **no inventory sections** until granted |
| Ordinary account with `read` for a section | May view that section **only with enrolled MFA** |
| Ordinary account with `edit` for a section | May view and edit that section **only with enrolled MFA** |
| Administrator, wider reader/editor or enabled additional role without completed MFA | Cannot obtain an ordinary session or exercise inventory access until MFA requirements are met |
| Inactive account | No inventory access |

Section grants are stored for `Devices`, `IPAM` and `Racks`. The backend checks the right for the **specific operation**, including cross-section dependencies. Ordinary device properties require Devices Edit; changing a primary IP or its reservation requires IPAM Edit; changing rack/U placement or rack mounting requires Racks Edit. Adding a device requires Devices Edit **and** IPAM Edit, plus Racks Edit if rack-mounted. A Racks-only editor may move a device but not change its unrelated properties, and an IPAM-only editor cannot bypass Devices permissions through the shared save API. The mixed-permission Device form shows IP/rack fields read-only when the respective rights are absent; the backend independently enforces these boundaries.

Only administrators can manage other users. The code prevents administrators from deleting, disabling or demoting themselves and protects the last active administrator. Granting Edit or Administrator status requires the recipient's MFA enrolment. Session rows are cleared after relevant security-sensitive account changes.

## My account, Users and Settings

The published v2.1 interface presents **Users** only to administrators and keeps system **Settings & Data** administrator-only. **My Account** contains personal security, appearance and Help/About controls. The sign-in page also provides existing password and MFA self-service for accounts without inventory access. The interface is preserved on `milestone-1`; the shared policy blocks wider inventory access pending MFA, and Batch 02 supplies the backend enrolment/removal routes. Their sign-in/My Account presentation and Users integration must be completed before deployment. See the [route contract and security rules](Role-Permissions.md#existing-account-mfa-operations).

## Boundaries for future maintenance

Never take an account ID, role or permission from a request body as proof of authority. Do not depend on hiding a button for security. Route modifications must require the existing session, trusted origin and CSRF proof before writing. Do not add public registration, extra roles, alternate authentication or recovery mechanisms unless explicitly approved.

Profiles/photos are protected by session ownership checks. Verification requires the current password; recovery requires a saved verified email, retained MFA and a single-use expiring challenge. SMTP administration remains administrator-only and public responses remain neutral. Security events remain protected Audit Trail data. See [Account Recovery](Account-Recovery.md) for the current guided flow, short-code limits and private backup/upgrade requirements.

### Related reading

[Frontend and API](03-Frontend-and-Backend.md) · [Database](02-Database.md) · [Tests](08-Testing-and-Maintenance.md)
