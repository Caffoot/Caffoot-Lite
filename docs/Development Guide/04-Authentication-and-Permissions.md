# 04 — Authentication, MFA and permissions

## In simple terms

The first person deploying Caffoot Lite chooses an administrator username and password, then enrols an authenticator app before gaining access. That administrator can create users and decide which inventory sections they can view or edit. There is **no public sign-up**. A read-only user can work without MFA; an administrator or someone given editing rights must enrol MFA.

## Account and sign-in path

- [`accounts.py`](../../next/backend/accounts.py): `bootstrap_first_admin` only works before an account exists; `confirm_admin_mfa` verifies the first authenticator code. Password hashes use PBKDF2-HMAC-SHA256 with a per-password salt and the current source-defined work factor.
- [`mfa.py`](../../next/backend/mfa.py): new TOTP secret, authenticator provisioning URI, code generation and verification.
- [`authentication.py`](../../next/backend/authentication.py): validates account credentials and any required authenticator code.
- [`request_auth.py`](../../next/backend/request_auth.py): `login` applies login throttling; `authenticated_account` and `authorised_mutation` establish the session and mutation boundary.
- [`sessions.py`](../../next/backend/sessions.py): issues random opaque session tokens, stores **only their hashes** in SQLite and checks expiry/account eligibility. Current `SESSION_SECONDS` is **12 hours**.
- [`http_security.py`](../../next/backend/http_security.py): a host-only `caffoot_session` cookie with `Secure`, `HttpOnly` and `SameSite=Strict`; same-origin/CSRF checks for modifications.
- [`server.py`](../../next/backend/server.py): the actual HTTPS routes, response handling and session checks. It does **not** accept arbitrary forwarded headers as the trusted external origin.

The configured `CAFFOOT_WEB_ADDRESS` defines the permitted HTTPS origin; altering a frontend control cannot change backend access rights.

## Roles and permissions

The source of truth for role decisions is [`permissions.py`](../../next/backend/permissions.py).

| Account state | Effective inventory access |
| --- | --- |
| First administrator, after MFA | Administrator access to the approved inventory and Users/Settings areas |
| New ordinary account | **No inventory sections** until granted |
| Ordinary account with `read` for a section | May view that section without MFA |
| Ordinary account with `edit` for a section | May view and edit that section **only with enrolled MFA** |
| Administrator or editor without completed MFA | Cannot exercise privileged access until MFA requirements are met |
| Inactive account | No inventory access |

Section grants are stored for `Devices`, `IPAM` and `Racks`. The backend checks the right for the **specific operation**, including cross-section dependencies. For example, a Racks editor may update rack placement but cannot change unrelated device fields through that permission. The read-only/mixed-permission UI hides irrelevant modification controls without replacing backend checks.

Only administrators can manage other users. The code prevents administrators from deleting, disabling or demoting themselves and protects the last active administrator. Granting Edit or Administrator status requires the recipient's MFA enrolment. Session rows are cleared after relevant security-sensitive account changes.

## My account, Users and Settings

The agreed interface presents **Users** only to administrators and keeps system **Settings & Data** administrator-only. Every signed-in user can reach **My account** for their personal password and MFA controls, appearance preference and the moved Help/About content. Users without MFA see unobtrusive Dashboard enrolment guidance; admins see guidance when attempting to grant editing rights prematurely. These are approved presentation decisions from #215, not new permissions or account services.

## Boundaries for future maintenance

Never take an account ID, role or permission from a request body as proof of authority. Do not depend on hiding a button for security. Route modifications must require the existing session, trusted origin and CSRF proof before writing. Do not add public registration, extra roles, alternate authentication or recovery mechanisms unless explicitly approved.

### Related reading

[Frontend and API](03-Frontend-and-Backend.md) · [Database](02-Database.md) · [Tests](08-Testing-and-Maintenance.md)
