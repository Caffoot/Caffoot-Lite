# Service Desk Tickets

> **Draft v2.2 — Unreleased.** Use **My Tickets** to raise and follow requests for equipment assigned to you or your Department. Technicians use **IT → Service Desk**. For technician steps, go to [Find Tickets In The IT Queue](#find-tickets-in-the-it-queue).

## Check Which Equipment Is Assigned To You

A service ticket records a problem or a piece of support work on an existing Device or IT Asset. A laptop might be assigned directly to you, while a shared printer might be assigned to your Department.

1. Sign in with the account linked to your active Staff Member record. Complete any multi-factor authentication (MFA) that your account requires. An enabled Devices or IT Assets feature is needed for the corresponding equipment. [Access and feature checks](Service-Desk-Administration.md#verify-employee-access)
2. Open **My Equipment**. Check **Assigned to Me** for your own equipment and **Shared with My Department** for equipment held by your current Department.
3. Check that the item in the list is the one you use. If it is missing, ask IT to check its assignment, your Staff account link and your Department membership. IT can arrange a genuine assignment if appropriate.
4. Choose **Report A Problem** on the equipment row, or open **My Tickets → Create Ticket** and select the equipment there. Both open the same form. If you started in **My Equipment**, check the preselected item.

For examples of directly assigned and shared equipment, see [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md) and [Departments And Shared Equipment](Departments-and-Shared-Equipment.md).

## Raise A Support Request

1. Select the affected **Device / Asset**. The choices identify equipment assigned to you and equipment shared with your current Department. If you have several issues of the same IT Asset, check the issue shown in the picker. Ask IT to check your assignment if the correct equipment is missing.
2. Select one **Ticket Category**. It starts empty. Choose **Other / Not Listed** if the list has no suitable category. **LAN / Shared Drive Issues**, **Email / Sending & Receiving Issues** and **Other / Not Listed** are at the end.
3. If you choose **Software / Applications** for a Laptop or Desktop, **Affected Software (Optional)** appears. Select an application recorded on that Device, choose **Other / Not Listed** for an unlisted application, or leave it blank. You can name an unlisted application in the description. This selection is saved with the ticket.
4. Enter a **Subject** of up to 120 characters, such as *Teams calls drop after waking*. In **Description**, use up to 3,000 characters to explain what you expected, what actually happened and which steps bring the problem back.
5. Use **Attachment (Optional)** if a file will help IT. The form accepts PNG, JPG/JPEG, PDF, TXT, DOCX or XLSX. Each file can be up to **10 MB**, with **100 MB retained across the ticket**. For shared equipment, current Department members with access to the ticket can read the original report and download its attachment.
6. Select **Create Ticket**. The confirmation gives you a ticket number such as `SD-0006`. The ticket starts **Open**, **Medium** priority and **Unassigned**. Look in **My Tickets** for personal equipment or **Department Tickets** for shared equipment. **Cancel** or **Close Ticket Window** discards the form.

If the form reports a problem, correct the highlighted or named field and submit again. If the file is rejected, use the correct file format or remove it. If a Device, assignment or software choice changed while you had the form open, reopen the form to load its current choices. A failed save leaves the ticket and its attachment unsaved.

![Create Ticket showing a Laptop and Microsoft Teams selected under Affected Software.](../../../development-handovers/evidence/employee-service-desk/create-ticket-desktop-light.png)

*The optional software picker uses the selected computer’s recorded applications.* [Capture details](../../../development-handovers/evidence/employee-service-desk/README.md)

## Find And Review Your Tickets

1. Select **My Tickets** directly below **My Equipment** at the top of the sidebar. The **My Tickets** tab shows tickets for your current personal equipment assignments. Switch to **Department Tickets** for equipment shared with your current Department. A shared-equipment ticket stays in the Department tab, including when you raised it yourself.
2. Each tab starts with **Open** selected. Choose **Open**, **In Progress** or **On Hold** in **Current Tickets** to change the status filter. The cards show totals for the selected tab even when a search or equipment filter narrows the list. Choose **Closed** or **All Tickets** from **Ticket Status** for other views.
3. In **Search Tickets**, enter a ticket number, subject, requester or equipment name. Choose an item under **Device / Asset** to narrow the list. **Clear Filters** clears both fields, shows **All Tickets** and resets **Sort By** to **Updated · Newest**.
4. Use **Sort By** to choose the newest or oldest update first, or the highest ticket number first. Use **Previous** and **Next** when there are multiple pages. If the table is wider than your screen, scroll it sideways to reach **Actions**.
5. Select a ticket number or **Open**. **Overview** shows the reported problem, equipment, requester, status, category, priority and technician. It also shows the affected software if recorded, the reason for an On Hold ticket and the resolution note for a Closed ticket. **Updates** shows the conversation and permitted files. **History** shows the people and dates behind the employee-visible changes. Select **Close Window** to return to the list.

![Department Tickets in Purchasing showing the status cards and the seven-column ticket list.](../../../development-handovers/evidence/employee-service-desk/department-tickets-desktop-light.png)

*Department Tickets shows requests for Purchasing’s current shared equipment.* [Capture details](../../../development-handovers/evidence/employee-service-desk/README.md)

## Reply To IT Or Reopen A Ticket

1. Open **Ticket Details → Updates**, or choose **Reply To IT** from **Overview** or **History** on an active ticket.
2. Enter your reply under **Reply To IT**. Write up to 3,000 characters. For example, *The printer still leaves a grey mark after replacing the toner*. Add a permitted file using **Attachment (Optional)** if it helps. Select **Send Reply** to add the message to the conversation.
3. Choose an attachment’s filename in **Updates** to download it. A link can stop working if the file is removed, you leave the Department or the equipment changes hands.
4. If the ticket is **Closed** and the issue returns, select **Reopen Ticket** in the details footer before replying or adding a file. Any employee who can currently access the ticket through the applicable personal or Department assignment can do this, including for a colleague’s or IT’s ticket. It returns to **Open** with the same ticket number and technician. Previous replies, resolution notes and closure history stay with it.

For Department tickets, other authorised current members can read your replies and download their attachments. Employee replies are shared with the ticket’s audience. If **Send Reply** is rejected because the ticket has since closed, review its current details and reopen it before retrying. If a file is rejected, choose a valid file or send the reply without it.

![Ticket Conversation with a shared technician reply and an employee Reply To IT field.](../../../development-handovers/evidence/employee-service-desk/ticket-updates-desktop-light.png)

*Updates shows the shared conversation and the reply form for an active ticket.* [Capture details](../../../development-handovers/evidence/employee-service-desk/README.md)

## Who Can See A Ticket?

| Equipment assignment | Employee ticket visibility |
| --- | --- |
| Assigned directly to you | You can see eligible employee-visible tickets from your current personal assignment in **My Tickets**. |
| Assigned to your current Department | Verified current members of that Department can see eligible employee-visible content for the current assignment in **Department Tickets**. A ticket you raise for shared equipment appears in the Department view. |
| Unassigned or assigned to someone else | An authorised IT technician can handle the ticket within their equipment permissions. |

A new Department member can see eligible conversations from the same ongoing Department assignment. If you leave that Department, access through its membership ends, including access to tickets you raised there. IT keeps the ticket history. Internal notes, internal hold explanations and attachments to internal messages are restricted to authorised technicians.

For example, if Alex's loan laptop is handed to Reception, the ticket Alex raised while holding it stays with IT. Reception can see eligible tickets raised under its own assignment. If Priya joins Reception while its shared printer stays with Reception, she can see eligible conversations for the printer's current assignment. [Equipment handover examples](Service-Desk-Administration.md#what-happens-to-service-desk-tickets-when-equipment-changes-hands)

## How A Ticket Moves Through Support

A ticket begins **Open**, with **Medium** priority and **Unassigned** technician. The equipment assignment identifies who uses the equipment. The technician assignment identifies who is handling the ticket.

| Status | What it means |
| --- | --- |
| **Open** | The issue is available for IT to review. A reopened ticket returns to this status and keeps its earlier history. |
| **In Progress** | A technician has been assigned to handle the issue. |
| **On Hold** | IT has recorded why work is paused. The employee-visible reason may help you understand what is needed. |
| **Closed** | IT has recorded a resolution note. Each closure is kept with its own date and technician. |

## When Equipment Or A Ticket Is Missing

- **The equipment is missing from My Equipment.** Ask IT to check the genuine equipment assignment and confirm which Staff Member and Department are linked to your account. A disabled equipment feature can temporarily hide its records.
- **A colleague can see a shared ticket that you cannot.** Ask IT to check your current Department membership and the equipment's assignment. The ticket may belong to a previous equipment assignment.
- **An attachment is unavailable.** A download follows the visibility of its message and your current access to the ticket. Ask IT to check the conversation if you still need the file.
- **The equipment was returned or moved.** Earlier conversations stay available to authorised IT. A new problem under an eligible new assignment can have its own ticket.
- **A ticket you expect is missing from the list.** Check the two tabs and select **Clear Filters**. Open is the default status. If it is still missing, ask IT to check the equipment’s assignment history.
- **Affected Software is missing or an application is unavailable.** The field appears for Software / Applications on a Laptop or Desktop. It uses the Device’s recorded applications. You can choose **Other / Not Listed** or leave the field blank.

## Find Tickets In The IT Queue

Sign in with **Service Desk Read** or **Edit**. You also need Read access to **Devices**, **IT Assets**, or both, with the corresponding optional feature enabled. A ticket is visible only through the section that owns its equipment. Ask an administrator to check your effective access if the page or expected tickets are missing. [Access and permissions](Service-Desk-Administration.md#give-a-technician-access)

1. Expand **IT** in the sidebar and select **Service Desk**. **Ticket Queue** initially shows **Open** tickets.
2. Select **Open**, **In Progress** or **On Hold** under **Current Workload** to select that status, clear the Assignment filter and jump to the matching part of the Ticket Queue. The cards show totals for your authorised scope, even while a search narrows the table.
3. Enter a ticket number such as `SD-0001`, subject, requester or equipment name in **Search Tickets**. Use **Status**, **Priority**, **Assignment** or **Assigned Technician** for a more specific view. **All Tickets** includes Closed tickets. **Assigned To Me** uses your signed-in account.
4. Use **Sort By** to order the results by newest update, oldest update or descending ticket number. Use **Previous** and **Next** when the results span more than one page. On a narrow screen, scroll the table horizontally to reach all eight columns.
5. Select a ticket number or **Open Details**. **Clear Filters** restores the default Open queue and newest-first sort.

![The draft v2.2 Service Desk with workload totals and the desktop Ticket Queue.](../../../development-handovers/evidence/it-service-desk/queue-desktop-light.png)

*Current Workload and the Open Ticket Queue, shown with fictional equipment and support requests in the draft application.* [Capture details](../../../development-handovers/evidence/it-service-desk/README.md)

## Create An Equipment Ticket

You need **Service Desk Edit** and access to the Device or IT Asset you want to select. For example, if the Reception printer leaves streaks, use the existing **Printer-015** record.

1. Open **IT → Service Desk → Create Ticket**.
2. Select the real **Device / Asset**. For an issued stock item with multiple current issues, select the entry for the correct recipient and issue. A Device registered from stock uses its Device record.
3. Select one **Ticket Category**. The field starts empty. Use **Other / Not Listed** if none of the listed categories applies.
4. Enter a **Subject** such as *Reception printer leaves streaks*. In **Description**, record what happened and how to reproduce it. The subject can contain up to 200 characters and the description up to 16,000.
5. Optionally add supporting files using **Attachments (Optional)**. The original request and its files follow the equipment’s verified assignment. Check the files for information that the authorised employee audience should not see.
6. Select **Create Ticket**. A successful ticket appears in the Open queue with **Medium** priority and an **Unassigned** technician. **Cancel** or **Close Ticket Window** discards the form without creating a ticket.

If the equipment disappears or the category is unavailable, reopen the form and select a current option. Ask IT to correct an equipment assignment rather than choosing a different item. If the server rejects a file, change the selection and submit again. The form saves the ticket and its files together.

![Create Ticket with the required Device or Asset, category, subject and description fields and the optional attachment picker.](../../../development-handovers/evidence/it-service-desk/create-desktop-light.png)

*The integrated Create Ticket form starts with no category selected.* [Capture details](../../../development-handovers/evidence/it-service-desk/README.md)

## Review And Correct Ticket Details

1. Open a ticket. **Overview** shows its status, category, priority, technician, linked equipment, requester and original problem.
2. With **Service Desk Edit**, choose **Edit** beside **Ticket Category** or **Priority** in **Ticket Information**. Select an available category or **Low**, **Medium** or **High**.
3. Choose **Save** to record the correction in **History**. **Cancel** leaves the saved classification in place. Changing a software ticket to a category where its software selection does not apply clears the current **Affected Software** field. The original category and software label remain in the attributed history.
4. Open **Updates** for the conversation and **History** for attributed changes. Use **Close** or Escape to dismiss the details window.

If a colleague changes the ticket while a technician action is open, the application reloads the current details and shows a conflict message. Review the latest status or classification before trying again.

![Ticket Details Overview with the Ticket Information, Equipment and Requester, and Original Problem panels.](../../../development-handovers/evidence/it-service-desk/overview-desktop-light.png)

*Overview presents the three tabs and groups technician actions in the footer. Priority and category are corrected within Ticket Information.* [Capture details](../../../development-handovers/evidence/it-service-desk/README.md)

## Assign, Pause, Resolve Or Reopen A Ticket

An authorised technician can update or close tickets handled by a colleague. Actions retain the account that performed them.

| Action | Steps and result |
| --- | --- |
| **Assign Ticket** | Open an Open ticket, select **Assign Ticket**, choose yourself or another eligible technician in **Assign To**, and confirm. The status moves to **In Progress**. |
| **Reassign Ticket** | Select **Reassign Ticket**, choose a different technician, select a **Reason For Reassignment**, and optionally add an explanation. Confirm to save it. The reason and explanation stay within IT. Assigning a reopened Open ticket moves it to **In Progress**. |
| **Place On Hold** | Choose **Place On Hold** on an Open or In Progress ticket. Select **Waiting for User**, **Waiting for Supplier**, **Waiting for Parts** or **Other**. The reason is employee-visible. If you add an explanation, select **Make Explanation Visible To Employee** only if the authorised audience should see it. Confirm **Place On Hold**. |
| **Resume Ticket** | Open an On Hold ticket and choose **Resume Ticket**. Check the status shown in the confirmation. Confirm to restore the exact previous status, **Open** or **In Progress**. Resume first if you intend to close the ticket. |
| **Close Ticket** | Select **Close Ticket** and enter a meaningful **Resolution Note**, for example *Reconnected the mapped drive and verified it after sign-in*. Confirm **Close Ticket**. The note is employee-visible and the closure is recorded as a separate resolution attempt. |
| **Reopen Ticket** | Open the Closed ticket, choose **Reopen Ticket**, and confirm. It returns to **Open** with the same ticket number, previous technician and all earlier closure attempts. |

Use **Cancel** to return to details before submitting. If a reason or resolution note is missing, complete the required field. If your technician no longer appears, check their active account, MFA and equipment access with an administrator.

## Add A Note, Share An Update Or Manage Files

1. Open **Ticket Details → Updates**. The conversation shows the author and time of each update. **Employee Visible** and **Internal · IT Only** identify who can read it.
2. Under **Add Ticket Update**, enter a message. Leave the visibility box clear for an internal note such as a technician’s troubleshooting observations. Select **Make Update Visible To Employee** deliberately for a response such as *We have ordered the replacement part*.
3. Add optional supporting files and select **Add Update**. Files inherit the visibility of that update. A Closed ticket accepts an internal note. Reopen it to send an employee-visible update.
4. To correct a note you wrote, choose **Edit**, revise the text and choose **Save Correction**. History retains the previous text for authorised IT. Resolution Notes remain with their original closure attempts.
5. Select a file name to download the attachment. With Edit access, choose **Remove** next to a file, then **Remove Attachment**. The file stops downloading and **History** retains the attributed removal. **Cancel** leaves it attached.

Files must be genuine PNG, JPEG, PDF, TXT, DOCX or XLSX. Each file may be up to **10 MB**, with **100 MB retained across the ticket**. If a file is rejected, check its actual format and size. If the total is full, remove a file you are authorised to remove, or send the update without attachments. If a download fails, the file may have been removed or your access may have changed.

![Ticket Updates displays internal notes, employee-visible messages and an authorised attachment.](../../../development-handovers/evidence/it-service-desk/updates-desktop-light.png)

*Visibility labels identify which conversation and files an authorised employee can access.* [Capture details](../../../development-handovers/evidence/it-service-desk/README.md)

## Find A Ticket From Equipment

- In **IT → Devices → Device Inventory**, open the Device and select the **Tickets** tab. Select a linked ticket to open its details. Closing the ticket returns you to the same page of the Device’s **Tickets** tab.
- In **IT → IT Assets → Stock Inventory**, open the stock item and find **Linked Tickets** in **Stock Item Details**. Individually tracked stock can show tickets for its non-Device units. For equipment registered as a Device, use the Device’s own details.
- The Device **Tickets** tab and stock item **Linked Tickets** section require Service Desk Read as well as access to the equipment. If the list is empty, check the equipment record before asking an administrator to review access.

The [administrator guide](Service-Desk-Administration.md) covers access, historical privacy and retention.
