# Staff Members

> **Draft v2.2 — Not Published / Not Production Guidance.** This describes development merged through Batch 3.4 at `05b162aa10a74994c970d0b6dbf111dc59b47513` (schema 15). Batch 3.4 manual acceptance is deferred, not passed. v2.1 remains the published release. These are feature instructions for an authorised test instance, not installation, upgrade or restore steps.

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

With independent Devices Read permission, Staff Details shows assigned Devices and history. With Devices Edit, an active person can receive eligible initial assignments through **Assign Equipment**. See [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md). Returns and Service Desk are not implemented.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
