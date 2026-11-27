# A Connected Service Desk Example — Aster Services

> **Draft v2.2 — Unreleased.** Documentation Batch 5, application baseline `fdc677920bfc52f48f641b3d6d1344c902a6a9b0`, schema 31. Focused independent reviews are recorded and [owner written/source acceptance of Batches 1–6](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7200681167) is recorded. Current visual/privacy/caption/alt approval remains outstanding; [Batch 7 reconciliation and proposed capture packs](../../../development-guide/Milestone-01-Batch-7-Review.md) await independent review and owner acceptance. Capture scope and method need separate authorisation. Desktop capture remains deferred. [Source and screenshot record](../../../development-guide/Milestone-01-Batch-5-Review.md).

At fictional **Aster Services**, **Alex Morgan** in **Accounts** uses laptop **AST-LAP-014**, issued by technician **Sam Taylor** in the [Connected Equipment Journey](Connected-Equipment-Journey.md). During Alex's continuing personal custody, the laptop's display flickers after waking. This example connects existing controls; it creates no application records and is not a test result. The ticket number below is illustrative: use the number your installation actually returns.

## Prepare Access And Protect The Conversation

Alex needs an enabled sign-in account linked to an active Staff Member record, the real current personal assignment of AST-LAP-014, and Devices enabled. Alex completes any required MFA; no general Devices, directory or Service Desk grant is needed for this employee view. Sam needs **Service Desk Edit**, effective **Devices Read**, Devices enabled and the required enrolled MFA to work on this Device ticket. Job title, Department membership and IT Staff role name alone do not establish effective access.

An administrator separately configures SMTP and **IT Support Email Address** for new employee-ticket alerts. Account-based notification recipients need verified saved addresses and current ticket access. Neither a missing email nor a failed delivery removes a saved ticket. [Access and notification checks](Service-Desk-Administration.md) · [SMTP setup](Email-Templates-and-Company-Branding.md#configure-outgoing-email-smtp)

Use a factual problem description and a harmless sample file only if needed. Never include passwords, MFA/recovery codes, personal records or sensitive screenshots. Internal technical observations belong in an internal IT note. If following this example with Department equipment, first read the confidentiality warning: current and subsequently added Departments in the same Device custody may see employee-visible reports, replies and permitted files. All Departments are equal; there is no private primary Department.

## 1. Identify The Equipment

1. Alex signs in and opens **My Equipment** from the employee navigation, or **My Account → Overview → Open My Equipment**.
2. Under **Assigned to Me**, find AST-LAP-014. Use **Search Equipment** or **Details** if necessary to distinguish it from another laptop.
3. If it is absent, stop the request and ask IT to check Alex's account link and actual assignment. Do not choose someone else's equipment as a substitute.

Expected result: Alex sees permitted equipment information, without gaining general inventory or earlier-holder access. Shared Department equipment instead appears under **Shared with My Department**. [My Equipment](Device-Assignments-and-My-Equipment.md#my-equipment)

## 2. Open Report A Problem

1. On the AST-LAP-014 row select **Report A Problem**.
2. In **Create Ticket**, check the preselected **Device / Asset**. The action uses the same form as **My Tickets → Create Ticket**.
3. If equipment eligibility changed before the form loaded, reopen it after IT checks the assignment. **Cancel** or **Close Ticket Window** abandons the unsaved request.

Expected result: the form identifies the intended laptop. For a Department Device or its explicitly associated outstanding accessory, the warning appears before entering report details and files. [Create form and shared warning](Service-Desk-Tickets.md#raise-a-support-request)

## 3. Submit A Support Request

1. Select a suitable **Ticket Category**; use **Other / Not Listed** if no current category fits. The category starts empty. This hardware problem does not need Affected Software. For an eligible Laptop/Desktop **Software / Applications** request, that optional picker offers recorded applications and **Other / Not Listed**.
2. Enter **Subject:** `AST-LAP-014 display flickers after waking`. In **Description**, write: `After waking the laptop, the display flickers for about a minute. It started this morning and happens on battery and mains power.` Employee limits are 120 and 3,000 characters respectively.
3. If needed, use **Attachment (Optional)** for a genuine PNG, JPEG, PDF, TXT, DOCX or XLSX, up to 10 MB per file and 100 MB retained per ticket. Keep confidential content out of it.
4. Choose **Create Ticket** and retain the returned reference, for example `SD-0048`. If validation rejects a field/file, correct it; ticket and original attachment save together. For an uncertain connection result, look for the original request before submitting it again.

Expected result: a saved **Open**, **Medium**, **Unassigned** ticket appears in **My Tickets** for this personal assignment. A shared request appears in **Department Tickets**, including for its creator. **Open** is the initial status filter; use **Clear Filters** when locating other statuses. Ticket creation remains available outside Working Hours. [Find and review tickets](Service-Desk-Tickets.md#find-and-review-your-tickets)

## 4. Understand The IT Notification

After successful employee-facing creation, Caffoot Lite can queue **Ticket Created** to the configured single IT support mailbox. The alert contains the reference, initial Open status and authenticated IT ticket link, not Alex's subject, description or attachments. Sam signs in with the required permissions to open it. The link itself grants no access.

If SMTP is unavailable or the mailbox is blank, Sam can still find the saved ticket in the queue. An IT-created ticket does not send this new-ticket alert. A successful SMTP test only establishes acceptance of that test for sending; it does not verify Alex's saved address or prove account recovery eligibility. [Notification events and recipients](Service-Desk-Administration.md#check-which-service-desk-emails-are-sent)

## 5. Open And Assign The Ticket

1. Sam signs in with MFA and opens **IT → Service Desk → Ticket Queue**. Search the reference in **Search Tickets**; use **Clear Filters** for the default Open queue or **Status → All Tickets** for other statuses.
2. Select the reference or **Open Details**. Review **Overview** for the actual problem and equipment.
3. Choose **Assign Ticket**, select Sam in **Assign To**, and confirm **Assign Ticket**. **Cancel** makes no assignment. A rejected/stale action requires checking the latest ticket and permissions before retrying.

Expected result: the same ticket becomes **In Progress** and assigned to Sam. Self-assignment generates no assignment email. Assignment is not a **Work Started** action: the report waits for genuine support work. [Technician actions](Service-Desk-Tickets.md#assign-pause-resolve-or-reopen-a-ticket)

## 6. Record The Support Update

1. After performing an appropriate real diagnostic step, Sam opens **Updates → Add Ticket Update**.
2. Enter a factual message such as `I checked the external display connection. Please tell me whether the built-in screen still flickers after the next wake.` Select **Make Update Visible To Employee** deliberately, then **Add Update**.
3. Keep sensitive diagnostics in a separate note with that visibility box clear. Files inherit their parent update's visibility. An internal note is never an employee notification or employee unread reply; authorised IT accounts can count other technicians’ internal notes.

Expected result: Alex can read the visible update; an eligible verified Alex account may receive **Ticket Update** email. Sam's first new qualifying IT support update receives one **Work Started** attribution for this resolution attempt. Further updates in that attempt do not add another. [Updates and attachment safeguards](Service-Desk-Tickets.md#add-a-note-share-an-update-or-manage-files)

## 7. Read The Reply And Respond

1. Alex sees an unread-ticket number by **My Tickets**, the applicable tab, and an unread-reply count by the ticket reference. Navigation/tab counts count tickets; the ticket count counts eligible replies, independently of list filters and pages.
2. Open the ticket. **Overview** and **History** leave unread replies unread. Select **Updates** and read the successfully loaded conversation. That displayed snapshot is acknowledged for Alex's account only.
3. In **Reply To IT**, enter `The built-in screen still flickers after waking with the external cable disconnected`, then choose **Send Reply**. An eligible current assignee can receive the Employee Reply alert.

Expected result: Alex's acknowledged counts clear; Sam and any other authorised account retain their own independent read state. A failed load does not acknowledge messages. A reply arriving after the loaded snapshot remains unread until Updates loads again. Own replies are not unread for their author. If the ticket closed meanwhile, reopen it before an employee reply/file can be added. [Unread behaviour](Service-Desk-Tickets.md#recognise-and-read-new-replies)

## 8. Resolve With A Visible Note

1. After the actual repair and checks, Sam opens the ticket and chooses **Close Ticket**. If it is On Hold, first use **Resume Ticket** to restore its previous Open/In Progress status.
2. In **Resolution Note**, enter a meaningful employee-safe account of the work, for example `Replaced the faulty display cable and checked three wake cycles with Alex; no flicker returned.` Do not record a repair that did not happen.
3. Confirm **Close Ticket**. **Cancel** leaves it open; an empty resolution note is rejected.

Expected result: status becomes **Closed**. The note is employee-visible, retained with this closure attempt and eligible for the closure notification. The actual closer receives **Tickets Closed** credit; Sam's earlier Work Started remains one. If closure were the first genuine support action, its required visible resolution note could give that actor one started and one closed without a manufactured extra update. [Working-time rules](Service-Desk-Administration.md#understand-working-time-measurements)

## 9. Reopen If The Problem Returns

1. While Alex still has eligible access, open the Closed ticket and choose **Reopen Ticket**, then confirm. **Cancel** keeps it Closed.
2. Review its **Open** status, retained technician and earlier resolution note/history. Use **Updates → Reply To IT → Send Reply** to describe the returning problem.
3. Sam finds it in the shared queue; reopening may notify the retained technician if still eligible. The next genuine IT update or direct closure can receive the new attempt's Work Started attribution. Reopening alone does not count as work started.

Expected result: one ticket number, with a fresh resolution attempt and earlier completed measurements preserved. After the equipment later leaves Alex's physical custody in the equipment journey, Alex and a new holder do not inherit employee access to each other's earlier-custody conversation. Authorised IT retain it. [Mandatory handover explanation](Service-Desk-Administration.md#what-happens-to-service-desk-tickets-when-equipment-changes-hands)

## 10. Review Reporting And Recorded History

1. Sam uses **Service Desk Activity → Reporting Period** for the authorised equipment scope. **Current Workload** stays live while period counts use the configured installation time zone.
2. One creation, closure, reopening, second closure and second reopening within the period gives **1 Tickets Created**, **2 Closure Events**, **2 Tickets Reopened**, and current status Open. It is still one unique ticket. **Technician Activity → Work Started / Tickets Closed** credits actual actors per attempt, independently of assignee.
3. Read **Average Resolution Time** as eligible working time, excluding holds and exclusions. No completed closures displays **—**; a genuine zero displays **0h 0m**; incomplete/unknown-timezone measurement is unavailable. Missing/invalid TZ leaves ordinary ticket operations available.
4. Review ticket **History** for attributed permitted changes and **Updates** for the conversation. The separate application **Audit Trail** records its implemented administrative/inventory events, not every ticket conversation or application action. A JSON audit export cannot restore an installation.

[Reporting examples](Service-Desk-Tickets.md#what-the-figures-count) · [Audit Trail coverage](Audit-Trail.md#check-recording-coverage) · [Draft guides](README.md)
