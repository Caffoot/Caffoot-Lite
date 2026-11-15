# Departments And Shared Equipment

> **Draft v2.2 — Not Published / Not Production Guidance.** This describes development merged through Batch 3.4 at `05b162aa10a74994c970d0b6dbf111dc59b47513` (schema 15). Batch 3.4 manual acceptance is deferred, not passed. v2.1 remains the published release. These are feature instructions for an authorised test instance, not installation, upgrade or restore steps.

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

**There is currently no Department Details or consolidated Department equipment/history screen.** That design needs separate owner visual approval. Use the existing Device assignment view for now. Returns, reassignment and IT Assets stock are not implemented.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
