# 04 — Authentication, MFA and permissions

## In simple terms

The first administrator chooses a username/password and confirms an authenticator before gaining access. There is no public registration. Administrators create accounts and grant section access. **This chapter describes published v2.1 (schema 10)**; the final development section explains the separate unreleased policy.

## Account and sign-in path

The [published authentication source](https://github.com/Caffoot/Caffoot-Lite/blob/v2.1/backend/authentication.py), [session source](https://github.com/Caffoot/Caffoot-Lite/blob/v2.1/backend/sessions.py) and [request checks](https://github.com/Caffoot/Caffoot-Lite/blob/v2.1/backend/request_auth.py) determine identity and access on the server. Passwords use salted PBKDF2-HMAC-SHA256 hashes. Authenticator codes are verified before protected access is granted. Session tokens are random, stored only as hashes and expire after 12 hours.

The host-only `caffoot_session` cookie uses Secure, HttpOnly and SameSite=Strict. Writes require the established session, configured HTTPS origin and session-bound request-forgery proof. `CAFFOOT_WEB_ADDRESS` defines the permitted origin; client forwarding headers and hidden interface controls do not establish authority.

## Roles and permissions

Published v2.1 has Administrator status and independent Devices/IPAM/Racks grants, not the later configurable role catalogue.

| Account state | Published v2.1 behaviour |
| --- | --- |
| First administrator | Must complete MFA before normal access |
| New ordinary account | No inventory access until granted |
| Ordinary Read grant | May view that section without mandatory MFA; existing voluntary MFA still applies |
| Edit grant | Administrator can grant it only after the recipient has confirmed MFA |
| Administrator appointment | Requires the recipient's confirmed MFA |
| Inactive account | Cannot sign in or exercise inventory access |

For the safe enrolment order, see [Users, Permissions and MFA](../how-tos/features-and-instructions/Users-Permissions-and-MFA.md). Grant temporary Read as appropriate, let the account enrol through My Account, then grant Edit. Relevant security/permission changes revoke sessions.

Creating a published v2.1 Device requires Devices Edit and IPAM Edit; adding it already mounted also requires Racks Edit. Ordinary Device changes require Devices Edit, IP/reservation changes require IPAM Edit, and rack placement requires Racks Edit. A Racks editor cannot alter unrelated Device fields. The server validates actual changed fields and the five-minute Device editing reservation.

Only administrators manage other accounts. Existing self-management and last-active-administrator safeguards protect against deletion, disabling or demotion. See the [published permissions implementation](https://github.com/Caffoot/Caffoot-Lite/blob/v2.1/backend/permissions.py).

## My account, Users and Settings

Published v2.1 offers administrator **Users** and **Settings & Data**, plus **My Account** in the top bar for permitted personal operations. Appearance is under Overview → Personal Preferences, not an Appearance tab. Account profiles and photographs are private data; editing a profile does not change access rights.

Verified-email confirmation requires the current password. Username-based recovery requires a saved verified address, configured delivery and retained MFA when applicable. It does not reveal whether an account exists, create a session or bypass an authenticator. See [Account Recovery](Account-Recovery.md).

## Boundaries for future maintenance

The accepted Stage 1 source on `main` is newer than the public image. It introduces shared roles, explicit overrides, IT Staff, pre-login MFA enrolment and eligible voluntary removal. Wider Read **or** Edit, Administrator status, enabled additional roles and retained voluntary enrolment require MFA. Role confirmation may configure rights before enrolment, but the policy prevents their use until MFA is complete. Do not apply that rule to the published v2.1 worked example.

Later `milestone-1` source adds Staff Members/Departments permissions and independently gated Devices/IPAM/Racks. A no-IP/basic Device does not always require IPAM Edit there; managed address changes still do. These are unreleased v2.2 behaviours. See [Development Status](Development-Status.md) and [Shared Roles And Account Permissions](Role-Permissions.md).

Never trust a request's account ID, role or permission as proof of authority. Preserve existing server-side checks, data, sessions and privacy. No authentication, permission or schema change is authorised by documentation correction.

### Related reading

[Frontend and API](03-Frontend-and-Backend.md) · [Database](02-Database.md) · [Tests](08-Testing-and-Maintenance.md)
