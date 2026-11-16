# Device Assignments And My Equipment

> **Draft v2.2 — Not Published / Not Production Guidance.** Batches 3.1–3.7 are merged through PR #388 at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` (schema 16). Batch 3.8 is implemented for review on `feat/it-assets-issue-return-writeoff` (draft PR #389, schema 17); it is not merged or visually accepted. Batch 3.4 native acceptance remains deferred. Use the published v2.1 guides for production. These are not installation, upgrade or restore instructions.

Initial assignments record who holds an existing Device. They do not duplicate inventory or declare that a Device is physically in stock or Ready.

## Before Assigning

Devices must be enabled and the assigning account needs Devices Edit. Only **Desktop**, **Laptop** and **Printer** are eligible. The Device must be Active, physical and have no assignment history. Inactive Staff, archived Departments, stale Device revisions and Devices currently being edited are rejected.

## Assign From Staff Details

1. Open an active person's **Staff Details**. You need Staff Members Read to reach this view and independent Devices permissions for equipment.
2. Select **Assign Equipment**. Search for eligible existing Devices and select one or more.
3. Choose **Confirm Assignment**. All selected Devices are saved together; a conflict saves none. Refresh your selection if a Device has changed.
4. Check **Assigned Equipment** and **Assignment History** for the Devices, date and responsible account. **Cancel** makes no assignment.

## Assign From Device Details

1. Open the existing Device Details view, then **Assigned To**.
2. Select **Assign Device** for an eligible unassigned Device.
3. Choose **Staff Member** or **Department** under **Assign To**, search for the recipient and select them.
4. Choose **Confirm Assignment**. Check the current holder and dated assignment history on the same tab.

The recipient picker provides eligible names without granting general directory or contact access. Staff and Device views use one saved relationship. Current names follow later recipient renames; history retains the name recorded at assignment time.

Department-shared equipment stays assigned to the Department. [Department Details](Departments-and-Shared-Equipment.md#department-details--unreleased-v22) shows its current equipment and genuine history. Existing assignments/history are retained when Staff become inactive or Departments are archived. Device deletion and destructive inventory replacement/reset are blocked where they would remove assignment history.

## My Equipment

Sign in with the login linked to your Staff record and open **My Equipment** in the personal sidebar:

- **Assigned to Me** shows Devices and outstanding IT Assets assigned directly to you.
- **Shared with My Department** shows equipment assigned to your current Department. It does not make you its personal holder.

You see only limited equipment details: name, type, manufacturer, model and assignment date. General network information, private notes, other people's records, assignment history and administration actions are not exposed. Without a Department, only your personal assignments appear. Without a linked login, a Staff record has no self-service access.

Membership changes affect shared visibility on the next request. Devices and IT Assets obey their independent switches. Disabling either hides its equipment and prevents its protected operations while retaining saved relationships. IT Assets show the actual outstanding quantity; shared stock remains assigned once to the Department.

[Stock receipts](IT-Assets-Stock-Intake.md) and [Issue, Return, preparation and Write Off](IT-Assets-Issue-Return-and-Write-Off.md) are implemented in the stated development versions. A real Device return or write-off requires both IT Assets Edit and Devices Edit, closes the original assignment and preserves the Device. Initial allocation cannot bypass existing stock or assignment history. Device registration/reissue, direct reassignment, corrections, associated accessories and Service Desk remain later work.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
