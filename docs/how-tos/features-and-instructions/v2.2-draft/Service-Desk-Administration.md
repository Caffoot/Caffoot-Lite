# Administer Service Desk Access And Data

> **Draft v2.2 — Unreleased.** Batch 5.1 provides ticket storage and access rules, the **Service Desk** row in the existing permission controls and the updated **Clean Start** confirmation. Technician and employee ticket screens will arrive in their own batches.

## Give A Technician Access

Sign in as an administrator using your authenticator. Check that the prospective technician has an enabled account and the required access to the equipment they support. Devices and IT Assets have independent feature switches and permissions.

1. Open **Staff → Permissions → Manage Roles**. Select **Manage** beside the role you want to change. To grant access to just one authorised person, open them from **User List** and review their section permissions instead.
2. Find **Service Desk**. Choose **Read** for someone who may review the technician queue or **Edit** for someone who may record technician actions. Review their effective **Devices** and **IT Assets** access as well. Each ticket is subject to its equipment section's enabled state and effective Read permission.
3. Review the proposed changes and the accounts affected. The IT Staff role was assigned automatically during an earlier upgrade, so check the actual list before granting access to the whole role. Use an individual grant if the role has members who should have employee access only.
4. Confirm the change when the preview is correct or cancel it to keep the current permissions. Review any individual **No Access** override if an expected inherited permission is missing. The application applies its existing account, MFA and session rules to the change.

Ordinary Staff use equipment-scoped access through their Staff account link. They need no Service Desk, general inventory or Staff Directory grant for that access. The separate Service Desk permission governs the wider technician queue. [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md) · [Optional Features](Optional-Features-and-Link-To-IPAM.md)

![Service Desk permission in the existing Manage User access controls, with Inherit and effective No Access shown for an example account.](../../../development-handovers/evidence/service-desk-foundation/it-staff-dave-1440.png)

*The Service Desk permission uses the existing per-account controls. Captured from the draft v2.2 application with fictional data.* [Capture details](../../../development-handovers/evidence/service-desk-foundation/README.md)

## What Happens To Service Desk Tickets When Equipment Changes Hands

Caffoot Lite records the equipment and its assignment when a ticket is raised. The original Device or IT Asset keeps its identity as it changes hands. Authorised IT can still review the ticket, its replies, attachments and attributed history under the equipment's section permissions.

| Change | Worked example |
| --- | --- |
| Person to Department | Alex returns a scanner which is then assigned to Reception. Alex's earlier personal ticket goes out of employee views. Reception members can see employee-visible tickets raised for the scanner under Reception's assignment. |
| Department to Department | Payroll's printer moves to Finance. Payroll's earlier printer conversations become IT-only. Finance can see eligible conversations raised for its own assignment. |
| Department to Person | Operations' shared laptop is issued to Priya. The earlier Operations tickets become IT-only. Priya can see eligible tickets from her new personal assignment. |
| Department membership changes while the assignment continues | Asha joins Finance while its printer is still assigned to Finance. She can see employee-visible tickets from that same assignment. A colleague who leaves Finance loses the access they had through its membership. |

Internal notes and the attachments to them stay within IT. If a previously returned Device goes back to the same person or Department, tickets from that earlier equipment assignment stay with IT. A quantity-stock correction that restores the outstanding balance after a full return follows the same privacy boundary. The earlier ticket stays with IT and an eligible current holder may raise a new one. [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md) · [Correct Movement](IT-Assets-Correct-Movement.md)

## Keep Ticket-Linked Equipment During Deletion Or Import

1. Use the existing Devices workflow for ordinary Device deletion. A Device with retained tickets has a protected history. If Caffoot Lite rejects the deletion, keep the Device record and use the appropriate retirement or equipment workflow where applicable.
2. Before confirming a supported legacy inventory import, check that it includes the current records for all ticket-linked Devices. A compatible import keeps each matching Device in place, including its identity and ticket history.
3. If the import would remove a ticket-linked Device or replace it with a different record, the confirmation is rejected. Review the source and retain the required original records before attempting another import. The rejected import leaves the saved inventory and tickets intact.

Use the normal legacy export review and confirmation steps. A supported inventory import operates on inventory records. Recovery of Service Desk data uses the database or volume backup. [Inventory And Migration](../../../development-guide/05-Inventory-and-Migration.md)

## Clear Ticket Data With Clean Start

Clean Start is a destructive operation for an administrator starting a fresh operational inventory. Use a disposable installation for practice. Before using it on an installation you need to keep, make and verify your database or volume backup.

1. Sign in as an administrator using MFA. The existing requirement for enabled **Devices**, **IPAM** and **Racks** with Edit access still applies.
2. Open **Settings & Data → System Maintenance**. In **Danger Zone**, select **Review Clear System**.
3. Read the confirmation, including the warning about removing all Service Desk tickets, conversations, attachments and ticket history. Choose **Cancel** to leave the data in place.
4. Choose **OK** only when you intend to clear the installation's operational inventory and tickets. After a successful reset, review the refreshed inventory and the reset entry in central **Change History**.

Clean Start removes tickets in every status, replies, internal notes, stored attachment contents, assignment and status events, and closure and reopening records. The database applies the ticket cleanup and inventory reset together. User accounts, authentication records and central Change History are retained. The new central reset entry records the action without copying private ticket contents. Category definitions remain available, and new tickets can be raised once eligible equipment is in place.

If existing equipment history prevents inventory clearance, the reset reports the problem and rolls back ticket cleanup as well. A failed save leaves the previous records available. Seek help with the existing equipment history instead of deleting dependent records to force a reset. [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md)

![System Maintenance shows the existing Review Clear System button and warns that all Service Desk ticket data will be cleared.](../../../development-handovers/evidence/service-desk-foundation/clean-start-1440.png)

*System Maintenance shows the reset scope before you open the confirmation.* [Capture details](../../../development-handovers/evidence/service-desk-foundation/README.md)

## Check Access When Something Looks Wrong

| Symptom | What to check |
| --- | --- |
| Technician has Service Desk permission but cannot see an equipment ticket | Confirm the account is active, the required MFA is enrolled, and the equipment section is enabled with effective Read access. |
| Staff Member cannot see a personal or shared ticket | Verify their linked Staff record, current Department, current equipment assignment and the equipment feature. Inspect the ticket under technician access before assuming it was removed. |
| A ticket appears in IT history only after an equipment move | The ticket may belong to an ended assignment. Current assignment access starts with eligible tickets for that assignment. |
| Clean Start is rejected | Review the confirmation and administrator permissions first. If the message refers to equipment history, the reset and ticket cleanup both rolled back. |

For employee-facing explanations, see [Service Desk Tickets](Service-Desk-Tickets.md). For source and test coverage, see [Service Desk Foundation](../../../development-guide/Service-Desk-Foundation.md).
