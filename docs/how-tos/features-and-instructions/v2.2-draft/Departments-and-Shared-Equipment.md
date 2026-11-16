# Departments And Shared Equipment

> **Draft v2.2 — Not Published / Not Production Guidance.** Batches 3.1–3.7 are merged through PR #388 at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` (schema 16). Batch 3.8 is implemented for review on `feat/it-assets-issue-return-writeoff` (draft PR #389, schema 17); it is not merged or visually accepted. Batch 3.4 native acceptance remains deferred. Use the published v2.1 guides for production. These are not installation, upgrade or restore instructions.

Departments are simple, flat groups, such as a fictional **Accounts** Department. Membership does not grant inventory, directory or account-administration rights.

## Manage Departments

1. Open **Staff → Departments**. Departments Read permits viewing; Departments Edit permits management.
2. Choose **+ Add Department**, enter a unique **Department Name**, then **Save Department**.
3. Use **Manage** to rename an existing Department, **Archive** it or **Reactivate** it. Confirm status changes when prompted.
4. **Delete Department** is offered only when the server confirms there are no current or historical associations. Confirming deletion is permanent; otherwise archive the Department.

Archiving retains Staff membership, assignments and history. Archived Departments cannot receive new Staff memberships or initial equipment assignments. An existing archived membership can remain during an unrelated Staff edit. Reactivation permits new associations again.

To change a person's membership, use their Staff Add/Edit form with Staff Members Edit. Authorised Staff users can see limited linked Department labels and eligible choices without receiving general Departments access.

## Shared Equipment

With Devices Edit, open an eligible unassigned Device's **Assigned To** tab, choose **Assign Device**, then select **Department** as the recipient type and find an active Department. Confirm the assignment. See [the full assignment instructions](Device-Assignments-and-My-Equipment.md).

For example, a Printer assigned to Accounts remains owned by that Department. It is not copied to each employee or assigned personally to them. Its Device **Assigned To** tab shows the Department holder and dated history to authorised Devices readers.

A linked employee in Accounts sees the Printer under **My Equipment → Shared with My Department**, without gaining general inventory access. Their personal equipment remains separate. Changing membership changes shared visibility on the next request without moving the Printer.

## Department Details — Unreleased v2.2

The owner approved the functional preview on 15 November. The screen was merged into
`milestone-1` through PR #386 at `2e6c50ba4777b7500258d2a1a28317764d806020`.
It uses the existing application styling and remains unreleased.

1. Open **Staff → Departments** and choose **View Details** beside a Department.
2. **Overview** shows the recorded name, status and membership availability. Staff and
   shared-Device counts appear only when the corresponding data is available with your
   independent access. **Not Available** is not a zero count.
3. **Staff Members** lists currently linked records, including inactive Staff whose
   membership is retained. **View Staff Details** opens the existing authorised screen.
   Change membership through the Staff Add/Edit form.
4. **Equipment** lists only Devices and outstanding IT Assets assigned directly to the Department, followed by
   their genuine recorded assignment/movement history. Independent section access applies. Equipment personally assigned to Staff is excluded.
   **View Device** opens the original Device record.
5. **History** shows only Department changes supplied by the existing Audit Trail service
   and authorised Device assignments. An empty state describes what is available with
   your current access; it does not mean the Department has never changed.
6. **Manage Department** uses the same rename/archive/reactivate/delete controls as the
   directory. **Back To Departments** returns to the list.

On narrow screens, scroll the tab row or a wide table sideways to reach its other
controls and columns. Arrow keys, Home and End also move between tabs.

Devices and IT Assets feature-off hide their corresponding equipment without changing saved relationships. With IT Assets Edit, **Issue Equipment** preselects an active Department; **Return Equipment** records an actual outstanding stock return, including from archived Departments. Personal Staff equipment is excluded. See [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md). Device registration/reissue and associated-equipment reassignment remain later work.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
