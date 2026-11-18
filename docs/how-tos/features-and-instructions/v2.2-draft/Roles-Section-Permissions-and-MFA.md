# Roles, Section Permissions And MFA

> **Draft v2.2 — Not Published / Not Production Guidance.** These instructions describe the implemented `milestone-1` source at `753b3266893987addb11406ef8303adb03c3c112` (schema 20). Use the [published v2.1 guides](../README.md) for existing production installations. This guide does not establish installation, upgrade, restore, release or deferred native/manual acceptance.

[← Draft v2.2 Guides](README.md)

Caffoot Lite separates a person's sign-in account from their Staff directory record and from their authority to view or change information. A receptionist may need only their own equipment list; a technician may edit Devices; an administrator manages accounts and organisation settings. Roles let an administrator reuse a set of permissions, while individual overrides provide deliberate exceptions for one person.

MFA means **multi-factor authentication**: signing in with a password and a changing six-digit code from an authenticator app. In v2.2, wider Read access as well as Edit access requires MFA. An enabled additional role also requires MFA even when it grants no section access. Do not apply the published v2.1 read-only MFA rule to this development version.

## Before You Start

To manage other accounts, sign in as an active **Administrator** with MFA enrolled. Open **Staff → Permissions**. Only authorised administrators can use this area; Staff Members Edit or Departments Edit does not grant account administration.

For your own settings, open **My Account**. You do not need general inventory permission to update your own profile, change your password, manage eligible MFA settings or use [My Equipment](Device-Assignments-and-My-Equipment.md). Keep your username, password and authenticator available before changing security settings.

There is no public registration. An administrator creates a login, either here or through the authorised [Staff Members](Staff-Members.md) workflow. A Staff record can exist without a login. Making Staff inactive does not disable its linked login; disabling a login does not return equipment or change the person's Staff status.

## Understand The Three Access Decisions

A section is available only when the account is active, its MFA requirements are satisfied, the account has the relevant permission and any organisation feature switch is enabled.

| Decision | What it controls | Where to review it |
| --- | --- | --- |
| Account status | Whether a person can sign in | **Staff → Permissions → User List → Manage** |
| Roles and individual permissions | Which sections the account may read or edit | **Manage Roles** and the account's **Assigned Roles** and section permission controls |
| Optional Features | Whether the organisation uses an optional section | Administrator **Settings & Data → Optional Features** |

Enabling a feature does not grant permissions. Granting a permission does not enable a feature. An Administrator has account and system administration authority and configured access to all sections, but cannot use a disabled optional section simply by being an administrator.

### Sections And Permission Levels

| Section permission | Meaning |
| --- | --- |
| **No Access** | No general access to that section |
| **Read** | View permitted records and information; no authority to change that section |
| **Edit** | View and change permitted records, subject to the workflow's other permissions and safeguards |

The independent section controls are **Devices**, **IPAM**, **Racks**, **Staff Members**, **Departments** and **IT Assets**. The [Batch 4.1 draft](Supplier-Management.md) adds **Suppliers**. The Racks permission governs **Network Racks** in navigation. Staff Members and Departments are core sections, still protected by their own permissions. Devices, IPAM, Network Racks, IT Assets and Suppliers have independent organisation switches in the Batch 4.1 draft.

Forms can involve several sections. Devices Edit does not authorise changing protected IPAM links or rack placement; those actions need the applicable IPAM or Racks authority. IT Assets Edit permits stock operations, while registering or changing a canonical Device also needs Devices Edit and the Devices feature. See [Optional Features And Link To IPAM](Optional-Features-and-Link-To-IPAM.md) and [Device Stock Registration And Reissue](Device-Stock-Registration-and-Reissue.md) for the exact workflows.

A limited recipient search in an authorised equipment action lets the operator select eligible Staff Members or Departments. It does not grant access to the general directory, private contact details, other accounts or permission settings. Department membership gives no general section permission. IT Assets Read can show accurate organisation-wide stock totals without Devices Read, while Device identities and Device-only breakdowns remain protected; see [IT Assets Dashboard](IT-Assets-Dashboard.md).

## Roles, Inheritance And Individual Overrides

Every account receives the protected **Staff Member** baseline. This role grants no general section access and cannot be renamed, disabled, deleted or removed from an account. Its name is separate from the **Staff Members** directory section.

**IT Staff** is an additional built-in role. Its identity and name are protected, but an administrator can change its section grants, disable or re-enable it, and assign or remove its memberships. It does not make someone an Administrator. At this source checkpoint, its default grants are **Devices Edit**, **IPAM Edit**, **Racks Edit** and **IT Assets Edit**. Staff Members and Departments access must be granted separately where needed. Always inspect the current definition: an administrator may already have changed its defaults.

Administrators can also create custom roles. A person can hold several roles at once. For each section, the highest grant from their enabled roles becomes the **Inherited** level: Edit takes precedence over Read. A role's No Access setting supplies no grant; it does not cancel a grant from another enabled role.

An individual override then determines the account's **Effective** level:

| Individual choice | Result for an ordinary account |
| --- | --- |
| **Inherit** | Use the highest grant from enabled roles; with no grant, the result is No Access |
| **No Access** | Deny that section despite inherited Read or Edit |
| **Read** | Set that section to Read, even when a role grants Edit |
| **Edit** | Set that section to Edit, even when roles provide less access |

Overrides continue to apply when a role changes. Choose **Inherit** deliberately to remove an exception. Disabling a role retains its definition and memberships but stops its grants contributing; other enabled roles and overrides may still provide access. Administrator status is independent, and its section controls are not individually configured in the account editor.

### Worked Example: Two Technicians With Different Responsibilities

The fictional accounts `tim.example` and `dave.example` both belong to IT Staff. Tim has no individual overrides and inherits the role's current grants. Dave has **Devices Read** and **Racks Read** overrides, with IPAM set to **Inherit**. With the default infrastructure grants, Dave can read Devices and Racks and edit IPAM. His explicit Read choices remain even if IT Staff is later changed.

If Dave becomes responsible for rack maintenance, select **Inherit** for Racks, review the change and confirm it. He then follows the role's current Racks grant. Choosing **Edit** would instead create a fixed individual exception. Review IT Assets separately; neither Dave's name nor his Department establishes permission to issue stock.

### What An Existing Account May Show After Upgrade

The accepted schema-12 change assigned IT Staff to enabled pre-existing accounts, including enabled administrators and accounts that previously had no infrastructure access. Individual overrides preserved their exact earlier Devices, IPAM and Racks levels. Disabled accounts did not receive that membership. The added enabled role made MFA mandatory, even where all effective infrastructure rights stayed No Access.

The later schema-20 change adds the IT Assets Edit role default while preserving existing accounts' earlier effective IT Assets access. An account can therefore show IT Staff membership and still have an IT Assets **No Access** or **Read** override. This is deliberate access preservation. Do not clear it as an assumed fault.

Fresh installations create IT Staff enabled but unassigned. Newly created ordinary accounts receive Staff Member only. These are implemented compatibility rules, not a verified production upgrade procedure; [version and acceptance status](../../../development-guide/Development-Status.md) remains separate.

## Create A Sign-In Account

1. Open **Staff → Permissions → Add User**.
2. Enter a unique **Username**, such as the fictional `alex.example`. Changing personal names later does not rename the sign-in identifier.
3. Enter **Initial Password** and repeat it in **Confirm Initial Password**. Use a long, unique password and share it through a secure channel.
4. Enter optional personal details where useful. Saving an email address does not verify its ownership or enable recovery by itself.
5. Select **Create User**. A successful creation opens **User List**. The new ordinary account starts with Staff Member and no general section grants; it does not automatically receive IT Staff or Administrator status.
6. Find the account and select **Manage** to review its roles and permissions. Grant only the access required, using the procedures below.
7. Give the person their username and initial password privately. Ask them to change the password in My Account and complete any required authenticator enrolment.

**Clear Form** discards unsaved creation entries. Mismatched passwords or rejected details do not create a partial account. If the username is already in use, confirm whether the intended person already has a login before trying another name. New account creation follows the maintained [Staff/account linking rules](Staff-Members.md).

## Review An Account

1. Open **Staff → Permissions → User List**.
2. Use the user search and account-status or authenticator filters to locate the correct account. Check the username carefully when display names are similar.
3. Read **Roles & Status**, **Authenticator** and **Effective Section Access**. **MFA Required · Setup Pending** means access has been configured but the person must complete enrolment before normal sign-in.
4. Select **Manage**. Review the saved personal details, **Assigned Roles**, section choices and their **Inherited** and **Effective** summaries.
5. Check for **Feature Disabled** beside a section. A valid grant can remain configured while its organisation switch prevents use.

The signed-in administrator's own row uses **View** and protected controls. Use **My Account** for your own personal and security settings. Arrange for the affected person to sign in and confirm their authorised access; do not ask for their password to test it yourself.

### Save Personal Details

In the account editor, update the relevant **First Name**, **Last Name**, **Display Name** or **E-Mail Address**, then select **Save Personal Details**. These changes do not rename the username or grant section access. The owner must verify an email before it is eligible for recovery. Closing the editor discards unsaved profile typing, but does not undo changes already saved or confirmed.

## Assign Or Remove An Additional Role

1. Open the correct account through **User List → Manage**.
2. Under **Assigned Roles**, select the role's checkbox to propose adding it, or clear it to propose removing it. Each checkbox change is reviewed separately.
3. In **Review Access Change**, inspect the before/after roles, section inheritance, overrides, effective levels and MFA status.
4. Check **Affected Accounts** and **Sessions To End**. Assigning or removing a membership ends that account's sessions, even when its effective rights would stay the same.
5. Select **Confirm Change** to save, or **Cancel** to leave the saved membership unchanged.
6. After success, review the refreshed account. Tell the person to sign in again and complete MFA enrolment if required.

Staff Member cannot be removed. An additional role may be assigned before MFA enrolment, but cannot be used to bypass enrolment. Removing a role does not automatically remove an enrolled authenticator or erase individual overrides.

## Set An Individual Section Override

1. Open **User List → Manage** for the ordinary account.
2. Find the section and read its **Inherited** and **Effective** summaries.
3. Choose **Inherit**, **No Access**, **Read** or **Edit** from that section's selector.
4. Review the consequences in **Review Access Change**, including MFA and session effects. Changing the selector proposes a change; it is not the final save.
5. Select **Confirm Change** to apply it, or **Cancel** to keep the original choice.
6. Recheck the refreshed effective level and organisation feature switch if access remains unavailable.

An Edit override may increase access above the roles, so it needs the same care as granting a role. A Read override can intentionally limit inherited Edit. Other sections keep their own permissions; changing Devices does not grant Staff Members, IPAM or IT Assets rights.

## Create And Maintain Roles

### Create A Custom Role

1. Open **Staff → Permissions → Manage Roles** and select **Create Role**.
2. Enter a descriptive **Role Name**, for example the fictional **Equipment Auditors**.
3. Choose the required section grants. For an audit-only example, select **Read** for IT Assets and leave unrelated sections at **No Access**.
4. Select **Review Changes**, then inspect the role definition and consequences in **Review Access Change**.
5. Select **Confirm Change** to create it, or **Cancel** to save nothing.
6. Assign it to the intended accounts separately. A new role starts enabled and unassigned; creating it alone grants no account access. Every assigned enabled additional role requires MFA.

### Change, Disable Or Delete A Role

1. In **Manage Roles**, select **Manage** beside the correct role.
2. Edit its grants or, for a custom role, its name. Clear **Enabled** to disable it, or select it to re-enable it.
3. Select **Review Changes** and examine every affected account, including retained overrides. A shared role change may affect many people.
4. Select **Confirm Change** to save or **Cancel** to keep the current role. Reopen it to check the resulting definition.
5. To delete a custom role, select **Delete Role** in its editor and review the impact before **Confirm Change**. Its membership and grants stop contributing; other roles and overrides may preserve access. Its historical definition remains recorded.

IT Staff cannot be renamed or deleted, and Staff Member is fully protected. Disabling a role is reversible and retains memberships and grants; re-enabling makes those grants contribute again. Renaming a custom role preserves its identity and memberships.

### When A Preview Changes Or Expires

The server checks the proposal again at confirmation. Another administrator's changes or an expired preview can make it outdated. The application then reports that **nothing was saved** and displays refreshed consequences. Read them before confirming again. If the target is no longer available, close the preview and refresh the list.

Successful permission changes are saved with their attributed history and required session changes. Membership changes always end the target's sessions; other role or override changes end sessions when effective rights or MFA requirements change. A rename or a grant masked by an override does not necessarily end sessions. The preview describes the actual consequences.

Notification feedback is separate from saving access. **Notices Queued** means accepted for outgoing processing, not delivered. **Coalesced** notices have been combined; **Not Queued** indicates unsuccessful queue admission. Missing SMTP configuration or an unverified email does not reverse a saved permission change. Investigate through administrator email settings and private delivery records; do not repeat an access change merely to request another notification.

## Enable, Disable Or Delete A Login

Account controls are separate from role previews. Check the account identity before selecting them: **Disable**, **Enable**, **Make Admin** and **Remove Admin** apply their own operation directly when selected. **Done** closes the editor; it is not a final save for these earlier actions.

1. Open **Staff → Permissions → User List → Manage** for the person.
2. To stop sign-in while retaining the account, select **Disable**. This ends its sessions and prevents sign-in until re-enabled.
3. To restore login eligibility, select **Enable**, then review the current roles, permissions and MFA requirements. Enabling does not remove those safeguards.
4. To appoint an Administrator, first ensure the account has completed MFA enrolment, then select **Make Admin**. Appointment before confirmed MFA is rejected.
5. To remove independent Administrator status, select **Remove Admin**. Remaining ordinary access comes from the account's roles and overrides. The account must sign in again after Administrator status changes.
6. To remove the account permanently, select **Delete User** and read its confirmation. Confirm only if deletion is intended; cancelling keeps the account. Prefer disabling when the requirement is simply to prevent sign-in while retaining the login.

You cannot disable, demote or delete your own signed-in administrator account, and the last active administrator is protected. Deleting a login does not delete its Staff directory identity or return its equipment; review those separately in the [Staff lifecycle](Staff-Members.md). These controls do not provide an administrator bypass for a forgotten password or authenticator.

## Set Up And Use MFA

### Required Enrolment At Sign-In

1. On the existing sign-in page, enter **Username** and **Password**, then select **Sign In**.
2. If your roles or access require enrolment, the page displays **Secure Your Account**. Scan the QR code with a trusted authenticator app, or enter the displayed setup key manually.
3. Keep the key and QR code private: either can let someone reproduce your codes. Do not include them in screenshots, support email or public issues.
4. Enter the app's current six-digit code and select **Confirm MFA Setup**.
5. After confirmation, sign in again using your password and a current authenticator code. Enrolment itself does not create a normal application session.

For an already-enrolled account, enter username and password first, then provide the six-digit code when prompted by **Verify Your Identity**. Use **Verify & Sign In** if the completed code has not already submitted. Keep the authenticator device's date and time accurate; if a code has expired, use the next one rather than repeatedly submitting the old code.

### Voluntary Enrolment And Eligible Removal

A Staff-only account with no wider grants or enabled additional role can enrol voluntarily through **My Account → Security → Multi-Factor Authentication**. Enter your password, select **Start MFA enrolment**, scan the QR code or enter its key, then enter the six-digit code and select **Confirm MFA**. Return to sign-in and use the authenticator afterwards.

Once enrolled, MFA remains required at sign-in even if a role is disabled or removed. Only an eligible account owner can remove it:

1. Open **My Account → Security** and expand **Remove MFA** when offered.
2. Enter **Current Password** and **Current Authenticator Code**.
3. Select **Confirm MFA Removal**.
4. After success, all your sessions end. Sign in again with your password. Roles and grants have not changed.

Removal is unavailable for Administrators, accounts with any enabled additional role, or accounts with wider effective Read/Edit access. The server rechecks eligibility and credentials before saving. Losing an authenticator does not make required MFA optional; contact the administrator and use maintained recovery guidance where applicable.

## Change Your Password Safely

1. Open **My Account → Security → Change Password**.
2. Enter **Current Password**.
3. Enter a long, unique **New Password**, then repeat it in **Confirm New Password**. A password manager can help you retain it securely.
4. Select **Change Password**. Mismatched new values or an invalid current password are rejected without replacing the saved password.
5. After success, sign in again with the new password and your authenticator where required. All of this account's existing sessions have ended.

Typing values without submitting does not change the password. Follow the result shown and check a fresh sign-in rather than assuming an old tab saved it. Password changes do not remove MFA or grant access. Do not share your old password with an administrator or put credentials in an equipment note.

### Prepare Verified Email Recovery

1. Open **My Account → Overview → Personal Details** and save your optional email address with **Save Personal Details**.
2. Select **Verify Email**, enter **Current Password** and choose **Send Confirmation Code**.
3. Enter **Email Confirmation Code (8 Digits)**, retaining any leading zeroes, then select **Verify Email Address**.
4. Check that the address shows **Verified**. Changing the saved address removes verification. **Cancel** clears verification password/code fields without verifying the address.

On the sign-in page, **Forgot Password? → Request Recovery Code** uses your **Username**, not your email address. Recovery requires an active account, verified saved address and configured outgoing email. Its neutral response confirms neither eligibility nor delivery. Enter **Recovery Code (8 Digits)**, **New Password** and **Authenticator Code (If Enrolled)**, then select **Recover Password**. At this checkpoint the recovery form has one New Password field; do not expect the separate My Account confirmation control there.

Codes work once and expire after 15 minutes. **Request Another Code** replaces the earlier code without resetting failed-attempt limits. Five failed confirmations can exhaust a challenge, and the rolling account limit can require a wait of up to 15 minutes. **Back To Sign In** clears the recovery form. A successful reset ends sessions and retains required authenticator protection. See [Account Recovery](../../../development-guide/Account-Recovery.md) for delivery troubleshooting and the separately authorised host recovery procedure; this guide does not establish a full private-installation recovery test.

## Sessions, Sign-Out And Unsaved Work

A session keeps a browser signed in after authentication. At this checkpoint it expires 12 hours after creation; the application does not promise an unlimited or activity-renewed session. Relevant account, role and security changes can end it sooner. **My Account → Sign Out** ends the current session; it does not sign out every other browser.

A browser page with an expired or invalid session returns to the existing sign-in page with **Your Session Has Ended** and a request to sign in again. A page opened with no session asks you to sign in. In an already-open workspace this occurs when a failed application request establishes that the session has ended; there is no immediate countdown or background-expiry alert. An ordinary permission denial while the session remains valid is a separate error.

After signing in, reopen the record and check its saved state before trying the action again. Unsaved entries are not guaranteed to return. If a save's outcome was unclear because the connection failed, inspect the record or authorised history before resubmitting: the session message alone does not establish whether an earlier request saved. Do not keep working from an old screen after access has been revoked.

## Common Problems And Recovery

| What you see | What to check |
| --- | --- |
| No inventory after account creation | New accounts have Staff Member only. Ask an administrator to review section grants and switches. Your own My Account and eligible My Equipment are separate. |
| IT Staff shown, but one section remains Read or No Access | Review the override and current role definition. An access-preserving upgrade or deliberate exception may explain it. Remove an override only through an intentional reviewed change. |
| Read configured, but sign-in requires an authenticator | Wider Read requires MFA in v2.2; any enabled additional role also makes it mandatory. Complete enrolment. |
| Disabled role, but a section remains readable | Another enabled role or individual override may supply access. Review the effective level. |
| Feature Disabled beside a configured permission | An administrator must review Optional Features. Editing a role does not turn it on. |
| IPAM, rack or Device action unavailable in a form | Check that section's permission, feature state and record-specific restrictions. Do not broaden unrelated rights to bypass the error. |
| Preview changed or expired | Nothing was saved by that rejected confirmation. Review the refreshed impact, or reload if unavailable. |
| Saved change, but no email | Review notification feedback, verified address and outgoing email privately. Queue admission is not delivery; the access change remains saved. |
| Remove MFA unavailable | Required access or an enabled additional role may prevent removal. Enrolment does not disappear automatically after role changes. |
| Repeated invalid authenticator code | Check the correct account and device time, then use a current code. Repeated attempts can be throttled. |
| Recovery email absent | Review eligibility and delivery with the administrator privately. A neutral response reveals neither. Resending does not reset failure limits. |
| Session ends while working | Sign in again and inspect saved state before repeating the action. Review recent account changes if unexpected. |

Essential **Account**, **Role** and **Security** audit events remain available to authorised MFA-confirmed administrators, including when optional inventory features are disabled. Ordinary section Read does not grant this history. Inventory details within history remain permission-filtered. Share only necessary evidence when requesting help; exclude passwords, authenticator keys, session cookies, recovery codes and private email details from public reports.

## Related Workflows

[Optional Features And Link To IPAM](Optional-Features-and-Link-To-IPAM.md) · [Staff Members](Staff-Members.md) · [Departments And Shared Equipment](Departments-and-Shared-Equipment.md) · [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md) · [IT Assets Stock Intake](IT-Assets-Stock-Intake.md)

Administrators and maintainers can consult the [role and account contract](../../../development-guide/Role-Permissions.md), [authentication and permission reference](../../../development-guide/04-Authentication-and-Permissions.md), [accepted IT Staff decisions](https://github.com/Caffoot/Caffoot-Lite/issues/365) and [later IT Assets default decision](https://github.com/Caffoot/Caffoot-Lite/issues/396). Current acceptance and release boundaries belong in [Development Status](../../../development-guide/Development-Status.md).
