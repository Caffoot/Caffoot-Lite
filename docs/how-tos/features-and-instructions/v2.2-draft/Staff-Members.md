# Staff Members

> **Draft v2.2 — Not Published / Not Production Guidance.** Batches 3.1–3.7 are merged through PR #388 at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` (schema 16). Batch 3.8 is implemented for review on `feat/it-assets-issue-return-writeoff` (draft PR #389, schema 17); it is not merged or visually accepted. Batch 3.4 native acceptance remains deferred. Use the published v2.1 guides for production. These are not installation, upgrade or restore instructions.

A Staff Member is a directory record for a person. They do not need a Caffoot login to hold equipment. The similarly named **Staff Member** login role is a separate security setting.

## Find Or Add A Person

1. Open **Staff → Staff Members**. You need Staff Members Read to view the directory and Edit to change it.
2. Search by name or Department; use **Staff Status** to filter Active or Inactive people.
3. Choose **View Details**, or **+ Add Staff Member** if you have Edit permission.
4. For a new person, enter **First Name** and **Surname**. Email Address, Department, Job Title, Telephone Number and Location are optional.
5. Choose **Save Staff Member**. **Cancel** leaves saved information unchanged.

**Edit Staff Member** updates directory details. Existing-account migration creates a linked Staff record using available saved names and email; unknown names and Department stay blank. Do not invent missing details. Existing migrated blanks can be retained when editing.

## Optional Caffoot Login

Only an authorised administrator can create or manage a login. When creating an unlinked person's login, enable **Create Caffoot Login** and enter a unique Username, Initial Password and matching confirmation. The switch is off by default. Share initial credentials securely.

Saving a Staff record and a requested new login succeeds together or saves neither if validation fails. Existing linked records offer **Manage Login In Permissions**. Staff and account profiles remain separate: changing a Staff name, email or status does not silently change account details, verified email, roles or MFA.

The new ordinary login receives the baseline Staff Member role, without general inventory or directory access. An administrator grants any wider access through [Permissions](Roles-Section-Permissions-and-MFA.md). Staff Members Edit alone never permits account administration.

## Staff Status And Equipment

Use **Mark Inactive** or **Reactivate** on Staff Details, then confirm. Inactivation retains equipment and history; it does not return equipment or disable the person's login. Inactive people cannot receive new initial assignments. Account disabling is managed separately in Permissions.

With independent Devices Read permission, Staff Details shows assigned Devices and history. With Devices Edit, an active person can receive eligible initial assignments through **Assign Equipment**. See [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md). With independent IT Assets access, the same view shows outstanding stock quantities and genuine movements. IT Assets Edit permits **Issue Equipment** for active Staff and **Return Equipment** for outstanding stock. See [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md). Service Desk remains later work.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
