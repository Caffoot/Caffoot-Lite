# Device Assignments And My Equipment

> **Draft v2.2 — Not Published / Not Production Guidance.** This describes development merged through Batch 3.4 at `05b162aa10a74994c970d0b6dbf111dc59b47513` (schema 15). Batch 3.4 manual acceptance is deferred, not passed. v2.1 remains the published release. These are feature instructions for an authorised test instance, not installation, upgrade or restore steps.

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

Department-shared equipment stays assigned to the Department. There is no Department Details screen yet. Existing assignments/history are retained when Staff become inactive or Departments are archived. Device deletion and destructive inventory replacement/reset are blocked where they would remove assignment history.

## My Equipment

Sign in with the login linked to your Staff record and open **My Equipment** in the personal sidebar:

- **Assigned to Me** shows Devices assigned directly to you.
- **Shared with My Department** shows equipment assigned to your current Department. It does not make you its personal holder.

You see only limited equipment details: name, type, manufacturer, model and assignment date. General network information, private notes, other people's records, assignment history and administration actions are not exposed. Without a Department, only your personal assignments appear. Without a linked login, a Staff record has no self-service access.

Membership changes affect shared visibility on the next request. With Devices disabled, both equipment sections are empty and assignment operations are unavailable; saved relationships are retained.

**Returns, direct reassignment, preparation/Ready, stock receipts, write-off, movement corrections, associated accessories and Service Desk are not implemented.** An assignment cannot be bypassed by issuing the same Device again. IT Assets equipment will need its own later optional feature and approved workflows.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
