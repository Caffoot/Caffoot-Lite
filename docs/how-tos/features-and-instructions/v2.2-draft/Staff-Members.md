# Staff Members

> **Draft v2.2 — Unreleased.** This guide covers Unified Staff Administration in [PR #453](https://github.com/Caffoot/Caffoot-Lite/pull/453). Use the [published v2.1 guides](../README.md) for the released application.

Staff Members is the directory of people who may hold equipment. Use it to record a person’s contact details, Department and Staff status, review their assigned equipment and, with administrator access, manage their optional login and individual permissions. A person can hold equipment without a Caffoot login.

| Record | Purpose |
| --- | --- |
| Staff Member directory record | The person, optional Department and equipment relationships. |
| Caffoot login | The account used to sign in, with a fixed sign-in username, password, MFA and access settings. |
| Staff Member role | The baseline security role assigned to ordinary logins. It does not grant access to the Staff directory or general inventory. |

Linked records share first name, surname and email after any saved differences have been resolved. Staff status, Department and equipment belong to the Staff record. Sign-in status and security belong to the account. Department membership grants no application permissions.

## Before You Start

- **Staff Members Read** permits directory viewing. **Staff Members Edit** permits adding people, changing their details and changing Staff status.
- Staff Members and Departments are core sections, subject to permissions. They do not depend on the optional IT Assets switch and need not be populated to use Devices or IPAM.
- Creating a login, reviewing individual permissions or resolving linked profile differences requires an active administrator who has enrolled in MFA. Creating or resolving a difference from the Staff form also requires Staff Members Edit. A directory editor can change shared names and unlinked contact emails. Use an administrator or the account owner’s My Account for a linked email change.
- Devices and IT Assets have independent rights and switches. Read access shows the corresponding equipment on Staff Details; Edit permits its authorised actions. See [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md).

Collect known work details before starting. Do not enter passwords, recovery codes or other secrets in directory fields.

## Find A Staff Member

1. Expand **Staff** in the sidebar and choose **Staff Members**.
2. Enter part of the person’s name or Department in **Find A Staff Member**. Administrators can also enter part of the linked sign-in username.
3. Use **Staff Status** to choose **All Statuses**, **Active** or **Inactive**. Clear the search and check All Statuses if a person seems missing.
4. Scroll the table sideways on a narrow screen to reach **View Details** and **Edit**. Choose **View Details** beside the correct person. If names are similar, check their Department and, if you are an administrator, their username.
5. Read **Personal Details**, **Organisation** and, where authorised, **Caffoot Login**. Equipment panels require independent equipment access.
6. Choose **Back To Staff Members** to return to the list.

**No Department**, **No Email Recorded** and **Name Not Recorded** describe missing details. Administrators see linked usernames and **Linked Login** or **No Login** beside the Staff status. Account status, authenticator enrolment and assigned roles appear in the administrator’s Caffoot Login card.

![Staff Members in desktop light mode. Each row has adjacent login and Staff status badges and adjacent View Details and Edit buttons.](screenshots/staff-administration/unified-staff-light-1440.png)

*The Staff Members list with fictional records. The sign-in usernames distinguish the two records labelled Name Not Recorded.*

[Desktop dark](screenshots/staff-administration/unified-staff-dark-1440.png) · [Mobile light](screenshots/staff-administration/unified-staff-light-390.png) · [Mobile dark](screenshots/staff-administration/unified-staff-dark-390.png)

## Add A Person Without A Login

1. Open **Staff → Staff Members → + Add Staff Member**.
2. Enter **First Name** and **Surname**. Both are required for a new person.
3. Complete any known optional fields described below.
4. Check **Staff Status**. **Active** permits eligible new equipment assignments; **Inactive** retains a person and their existing relationships without permitting new assignments.
5. Leave **Create Caffoot Login** switched off when no login is needed. A non-administrator cannot enable account creation here.
6. Choose **Save Staff Member**. A successful save opens Staff Details and reports that the Staff Member was saved.
7. Check the saved name, Department and status. Choose **Edit Staff Member** if a correction is needed.

| Field | What to enter or expect |
| --- | --- |
| First Name / Surname | The person's known name. Do not invent names from a username. |
| Email Address | Optional valid contact address. When a login is created, the saved account address starts unverified. |
| Department | One optional active Department, or **No Department**. Departments have no hierarchy. |
| Job Title | Optional description such as Service Coordinator. It grants no security role. |
| Telephone Number | Optional work contact number. |
| Location | Optional directory location. It does not move assigned Devices or change their Location field. |
| Staff Status | The person's directory status, independently of any login's active/disabled state. |

**Cancel** or **Back To Staff Members** leaves the form without saving. If validation rejects a save, correct the displayed problem and try again. A failed save does not leave a partial Staff record.

For a fictional example, create **Alex Morgan**, select **Accounts**, enter `alex.morgan@example.org`, leave Create Caffoot Login off and save. Alex can now receive eligible equipment but has no credentials and cannot open My Equipment. Department membership has granted no application access.

## Create And Link An Optional Caffoot Login

The combined form reuses existing account security and links the login to the person holding their equipment.

1. As an authorised administrator with Staff Members Edit, start **+ Add Staff Member**, or open an existing unlinked person's **Staff Details → Create Login**.
2. Review the Staff details. For an existing person, confirm this is the record holding their equipment.
3. Enable **Create Caffoot Login** if the Create Login action has not already enabled it.
4. Enter a unique **Username**, an **Initial Password** and the same value in **Confirm Initial Password**. Follow the existing [password rules](Roles-Section-Permissions-and-MFA.md).
5. Review the **Staff Member** default-role explanation. New logins start with the baseline role and have no general inventory access.
6. Choose **Save Staff Member**. Staff changes, account creation and their link succeed together. A duplicate username, invalid password or rejected save leaves no unintended partial record/account/link.
7. Check the linked account on Staff Details. Select **Manage Permissions** whenever you need to review or change individual access. Give the person their initial credentials securely and direct them to the [account and MFA instructions](Roles-Section-Permissions-and-MFA.md).

If **This username is already in use. Please choose another username.** appears beneath **Username**, enter a different username. For example, `Alex.Morgan` conflicts with `alex.morgan`. The form keeps the other Staff details you entered and clears both password fields. Re-enter the two passwords and select **Save Staff Member** again. The existing account keeps its credentials and the rejected save creates no Staff record or login.

![Staff Member form in desktop light mode. The duplicate username message is below the highlighted Username field.](screenshots/stage-6-6-batch-1/duplicate-username-light-1440.png)

*The saved username `taylor.cole` conflicts with `TAYLOR.COLE`. The Staff details remain in the form.* [Capture variants and provenance](screenshots/stage-6-6-batch-1/README.md)

The **Caffoot Login** card shows **Username**, **Account Status**, **Authenticator** and **Assigned Roles**. Select **Manage Permissions** just below Assigned Roles to open the account dialogue. It displays the read-only **Sign-in Username**. Use it to review permissions or change the account’s status, role memberships and individual overrides. Close it with **Close**, **Done** or Escape to return to the same Staff Details. See the [account review procedure](Roles-Section-Permissions-and-MFA.md#review-an-account).

![Staff Details in desktop light mode. The Caffoot Login card shows the username, account status, authenticator, assigned roles and Manage Permissions.](screenshots/staff-administration/staff-details-light-1440.png)

*The Staff Details entry point for the fictional account taylor.cole.*

If Service Desk is enabled, eligible linked users can work with permitted equipment in [My Tickets and Department Tickets](Service-Desk-Tickets.md). Wider IT Service Desk or inventory access requires the relevant section permissions.

The Staff form offers no general merge or relink control for existing accounts. If an account is already linked to a different record, refer the discrepancy to an administrator; do not create a duplicate login or rewrite names to disguise the conflict.

### Existing Accounts And Migrated Details

The earlier Staff upgrade links accounts that lacked a Staff record, copying available first name, surname and email. In the unified workflow, start-up fills any missing first name or surname from the corresponding saved value. It can also copy a saved account email into an empty Staff contact field. The original links, IDs, history, equipment and account security are preserved.

A Staff email with a blank account email still needs an administrator’s decision before it can become an account address. Two different nonblank values also need a decision. A record with both names blank can stay **Name Not Recorded** until the correct details are known.

## Edit Staff And Shared Personal Details

1. Choose **Edit** in the directory or **Edit Staff Member** on Staff Details.
2. Change the intended fields. For a linked record, a new first name or surname updates both records. For example, changing fictional Alex Morgan’s surname to Rivers updates the Staff name and their personal details in My Account.
3. Change an unlinked contact email with Staff Members Edit. For a linked account email, sign in as an authorised administrator or ask the account owner to change it in **My Account → Personal Details**. The account owner must verify a changed email to use it for password recovery.
4. Choose **Save Staff Member** and check the saved Staff Details. **Cancel** or **Back To Staff Members** discards unsaved edits.

Changing Department, Staff Status or other directory fields leaves login access alone. Account owners can edit shared names and email in **My Account → Personal Details → Save Personal Details**. Account display name and photo belong to My Account. The sign-in username stays fixed.

### Resolve A Difference Between Staff And Account Details

1. As an authorised administrator, locate the person in **Staff Members** and choose **Edit**.
2. For each **Resolve Difference** field, compare the saved **Staff** and **Account** values. Check the intended value with the person if it is unclear.
3. Choose **Keep Staff Value** or **Keep Account Value** to use that saved value on both records. For a field you are not resolving, leave **Leave Both Values Unchanged** selected. You can still save unrelated edits.
4. Select **Save Staff Member** and confirm the selections. Dismissing the confirmation preserves the form for review. Saving resolves the selected fields and opens Staff Details.
5. If the account email changed, ask its owner to verify the saved address in My Account. Previous verification and outstanding verification or recovery codes are cleared. Choosing the existing account address preserves its verification status and outstanding codes.

For example, the Staff record for fictional Taylor Cole might still show Taylor while the account shows Tay. After confirming the preferred name, choose **Keep Account Value** for First Name. Leave an unrelated email difference unresolved until Taylor confirms the address. If My Account asks the user to contact an administrator about a field, they can still save other personal details by leaving that field at its saved account value.

![Edit Staff Member showing the two saved values for a first name and an email difference, with neither value selected.](screenshots/staff-administration/resolve-profile-light-1440.png)

*Resolve Difference controls appear on the administrator’s Staff form for the fields that need a choice.* [Mobile dark](screenshots/staff-administration/resolve-profile-dark-390.png)

### Recover From A Stale Edit

1. Read the message when the Staff Member was changed elsewhere. Your entries and any selected resolutions stay in the form.
2. Note the edits you still need, choose **Refresh Current Details**, then confirm that you want to replace your unsaved entries with the current saved values.
3. Review the new values and Department choices, reapply the necessary changes and select any resolutions again before saving.

An existing archived Department membership can be retained during an edit. An archived Department is unavailable for a new membership.

## Mark Inactive Or Reactivate

Staff status and account status are separate. Inactivating a leaver neither disables their login nor records equipment physically coming back.

1. Open **Staff Details** and review **Assigned Equipment** and **Assignment History**, with the necessary equipment access.
2. Choose **Mark Inactive**, read the prompt and confirm. Cancelling the prompt makes no change.
3. Check the **Inactive** badge. The person is excluded from new equipment-recipient choices; outstanding assignments and original dates remain visible to authorised IT users.
4. Resolve equipment through its actual [return/write-off](IT-Assets-Issue-Return-and-Write-Off.md) or [handover](Associated-Equipment.md#reassign-a-workstation-directly) workflow.
5. If login access should end, an authorised administrator must open **Staff Details → Manage Permissions** and select **Disable** under **Account controls**.

To restore eligibility, open the inactive person's Staff Details, choose **Reactivate** and confirm. This retains history and does not enable a disabled login. The Staff form's **Staff Status** also changes directory status when saved. The directory offers no permanent-delete action for Staff.

For example, fictional Alex leaves with a laptop and two adapters still recorded against them. Marking Alex Inactive leaves all three outstanding. IT records items actually returned, resolves any missing item through the appropriate Write Off procedure, and separately disables Alex's account. No stock balance increases merely because Staff status changes.

## Work With Equipment

**Assigned Equipment** shows Devices and outstanding IT Assets assigned directly to the person, according to your access. **Assignment History** retains the original relationships and responsible accounts.

With Devices Edit, **Assign Equipment** records an eligible initial Device allocation to an active person. With IT Assets Edit, **Issue Equipment** opens stock issue for them. **Return Equipment** beside outstanding stock remains available for inactive holders. Device returns require both relevant equipment permissions. Follow [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md) and the linked stock guides for the full checks.

A linked person opens **My Equipment** for limited personal/shared information without gaining general inventory rights. Changing their Department changes Department-shared visibility on the next request; it does not move personally assigned equipment or reassign the Department's Devices.

## Troubleshooting

| Problem | Check or recovery |
| --- | --- |
| Staff Members is absent | Ask an administrator to check Staff Members access. The baseline role or a directory record alone is insufficient. |
| Manage Permissions is unavailable | Sign in as an active administrator with MFA, and check that the Staff Member has a linked login. |
| Create Login is unavailable | Check administrator authority, Staff Members Edit and whether the record already has a login. |
| The initial password is rejected | Follow the password rules, match both entries and check that the username is unused. Retry on the same Staff record. |
| A Department is missing | Check whether it is archived; do not create a duplicate Department. |
| Equipment is absent | Check independent Devices/IT Assets permissions and switches, then the actual holder. A restricted panel does not prove no equipment exists. |
| A leaver can still sign in | Ask an administrator to review account status. Staff inactivation does not disable the login. |
| The connection fails during save | Reopen the record to establish what was saved before retrying. A missing success message does not prove failure. |

## Related Guides And Acceptance Items

- [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md)
- [Departments And Shared Equipment](Departments-and-Shared-Equipment.md)
- [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md)
- [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md)

The illustrations were captured from the running v2.2 development application with fictional data. See the [capture record](screenshots/staff-administration/README.md) for dimensions, source revision and review status.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
