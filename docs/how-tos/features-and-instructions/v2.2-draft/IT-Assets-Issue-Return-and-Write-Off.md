# IT Assets: Issue, Return And Write Off

> **Draft v2.2 — Not Published / Not Production Guidance.** Stock circulation is merged on `milestone-1`, now at `505ec1a60daccdfed4c2c36c9379a29ea6f5367d` after PR #392 (schema 19). These instructions also describe the final Issue Equipment confirmation on `feat/issue-equipment-confirmation`, awaiting independent review and explicit product-owner approval. v2.1 remains published. These are feature instructions for an authorised test instance, not installation, upgrade or restore steps.

## Before You Start

An administrator enables **IT Assets** under **Settings & Data → Optional Features → Additional Features**. It is independently optional and starts off. **IT Assets Read** permits stock and movement viewing; **IT Assets Edit** permits the actions below, subject to existing role, individual override, MFA and session rules. The switch grants no permission.

Returning, preparing or writing off a managed Device also requires enabled **Devices** and effective **Devices Edit**. Staff Members and Departments keep their independent directory permissions. The restricted recipient picker offers eligible names without granting directory, contact or account access.

Open **IT → IT Assets**. The original **Receive Stock**, **Stock Inventory** and **Receipt History** tabs remain. The additional tabs are **Issue Equipment**, **Return Equipment**, **Write Off** and **Movement History**. On a narrow screen, scroll the tab row or wide tables sideways. Read-only users can inspect inventory and history; editing forms are unavailable.

## Issue Equipment

1. Open **Issue Equipment** and select the stock item. Read **Ready To Issue For This Item**: it is the selected item's actual available quantity.
2. For quantity stock, enter a positive whole **Quantity To Issue** within that balance. For individual stock, select each actual unit; the quantity follows the selection. Serial numbers and asset tags may be absent without losing individual identity.
3. Select **Staff Member** or **Department**, search for the recipient and select their name. Only active Staff Members and unarchived Departments can receive new equipment.
4. Enter **Date Issued** and an optional note, then choose **Issue Equipment**. This opens a final confirmation; it does not record stock yet.
5. Check the equipment, quantity and actual Staff Member or Department name. For individually tracked equipment, check the selected units, including serial numbers and asset tags where recorded.
6. Choose **Back To Edit** to correct anything. Your selected equipment, quantity, recipient, date and note are retained. Choose **Issue Equipment** again to review the revised details.
7. Choose **Confirm Issue** to save. Wait for the result; the buttons are unavailable while saving. A rejected save keeps your entries and explains the problem. If stock has changed, reload and review live availability before trying again. If the connection fails, retrying the same confirmation protects against recording it twice.

Awaiting Checks, Awaiting Preparation, issued and written-off equipment are unavailable for issue. Concurrent requests cannot consume the same available units. A saved issue retains its date, technician, original recipient and permanent reference.

Staff Details and Department Details also offer **Issue Equipment** when independently authorised. These links preselect the person or Department. Department equipment is shared once with the Department; it is not issued separately to every member.

This stock form does not register a new managed Device or reissue a returned managed Device. Use the separate [Device registration and reissue workflows](Device-Stock-Registration-and-Reissue.md). **Add Equipment** associations and **Reassign Device** keep their existing actions; this confirmation applies to ordinary **Issue Equipment**.

## Return Equipment

1. Open **Return Equipment** and select the original outstanding issue. Check its original issue date, recipient and outstanding quantity. An authorised **Return Equipment** link on Staff/Department equipment preselects that issue.
2. Enter **Date Returned** and **Quantity Returned**. Return only what has physically come back. The remainder stays assigned to the original recipient.
3. Enter the returned quantity which is **Cleaned & Checked — Ready To Issue** and the quantity **Damaged — Write Off**. The summary calculates **Awaiting Checks = Returned − Ready − Written Off**; you cannot edit that calculated balance.
4. Complete the applicable preparation confirmations below before making any returned quantity Ready. Enter a **Damaged / Write-Off Reason** whenever damaged stock is written off. Add a **Return Note** if helpful.
5. Review **Selected Equipment**, then choose **Record Return**. The return and its Ready/write-off dispositions save together. A failed or outdated request saves none of them.

For example, return five mice from an eight-unit issue. Confirm three cleaned and working, write off two with a reason, and leave zero Awaiting Checks. Three become held and Ready, two become Written Off, and three remain outstanding with the original person. Neither the issued quantity nor the physical stock is duplicated.

Individual units keep their permanent identities. Equipment can return from an inactive Staff Member or archived Department; their status does not erase the original issue.

If the recorded original issue quantity is wrong, choose **Correct Movement**
beside the selected issue information. The [existing correction workflow](IT-Assets-Correct-Movement.md#correct-an-issue-while-returning-equipment)
retains your return entries and reloads current quantities and versions after
saving. Review them before recording the return. If that issue is no longer
eligible, select eligible equipment; the form will explain the change.

### Return A Managed Device

In the original **Device Details → Assigned To** tab, choose **Return Equipment** with both required Edit permissions. Confirm the actual returned Device. Normally leave Ready and Written Off at zero so it enters **Awaiting Preparation** until checked.

The same canonical Device remains in Devices. Its original assignment closes permanently, with a dated return and responsible technician. Return does not change its IP address, Rack, Location, operational status or specifications. Merely becoming unassigned, imported or retired does not place a Device in stock. There is no separate Place In Stock workflow.

### Return A Currently Unassigned Device

[Changed-screen evidence and review status](../../../development-handovers/evidence/unassigned-device-return/Report.md#changed-screen-gallery--awaiting-owner-visual-acceptance).

This correction was separately approved on 16 November and awaits review of its
changed screens. Open the original **Device Details → Assigned To** tab and choose
**Return Equipment**. Both Devices Edit and IT Assets Edit are required, with their
features enabled. The Device must be physical, currently unassigned and have no
previous stock movements. Existing issued/assigned equipment keeps its original
return route; held, prepared or written-off equipment cannot be returned again.

The existing form shows **Device Being Returned**, preselected and fixed to this
Device, with **Quantity Returned** fixed at one. It does not invent an original
issue date or holder. Enter the actual **Date Returned** and any optional note.
The Ready, write-off and preparation-check controls are unavailable for this first
return: it records **Awaiting Preparation** only. Complete checks later in Stock Inventory.

Immediately above **Record Return**, the form states: “Recording this return confirms
that this Device has been physically returned to stock.” Choose **Record Return**
only after actually receiving that Device. Submitting that action is your affirmative
physical-return confirmation; merely opening the form records nothing. The permanent
return/audit records retain the original Device identity, return date and signed-in
technician, without creating a fictitious assignment or receipt.

An imported, directly created, unassigned or Retired Device does not become stock
by itself. The same explicit action is required for an actual physical return.
Operational Status, IP, Rack, Location and existing history remain unchanged.
Disabling IT Assets retains the existing Devices-only controls and denies stock
returns without changing saved stock or Device records.

## Prepare Returned Equipment

In **Stock Inventory**, choose the item's **View / Update**, then **Prepare Returned Equipment**. For a returned managed Device, use **View / Update** under **Registered Devices In Stock History**.

Enter **Quantity Newly Checked & Ready** or select the actual individual units, set **Date Checked**, and confirm only checks actually completed. Add an optional note, then choose **Mark Ready To Issue**. Unprepared equipment remains held and unavailable. This records a preparation event, not another receipt.

| Equipment | Required Preparation Confirmation |
| --- | --- |
| Desktop, Laptop, Physical Server | **Checked Working** and **Data Wiped / Reset** |
| Printer | **Cleaned And Checked Working**, plus confirmation that stored documents, credentials and user data were cleared where applicable. A factory reset is not required for every printer. |
| Monitor, Keyboard, Mouse, Docking Station | **Cleaned And Checked Working**, without a compulsory data wipe |
| Other types | Appropriate working/condition checks and explicit confirmation of applicable data/preparation requirements. Potentially data-bearing equipment must not become Ready without that confirmation. |

These checks use the existing preparation controls. No inferred data-bearing classification or new database flag is introduced. If the applicable preparation has not been confirmed, leave the equipment Awaiting Preparation.

The original receipt-readiness controls cannot bypass returned-equipment checks. Receipt guidance remains in [Receive Stock And Stock Inventory](IT-Assets-Stock-Intake.md).

## Write Off Equipment

1. Open **Write Off**, or choose **Write Off** beside the relevant stock item or registered Device.
2. Select **Equipment To Write Off** and the actual **Current State**. For quantity stock, enter the whole quantity from that state. For held individual stock, select each actual unit.
3. Enter **Date Written Off**, a mandatory **Write-Off Reason** and any optional note.
4. Review **Selected Equipment**, then choose **Record Write Off**.

Held equipment leaves its actual held state and cannot remain Ready. An issued individual Asset or assigned Device is written off directly: its outstanding issue/assignment closes without inventing a physical return. Damaged quantities returned from a quantity issue use the mixed Return Equipment form.

The Device record, specifications, original holder and prior history remain. Operational status and other Device associations are retained; writing off a Device does not automatically write off its accessories. An explicitly selected Device which was never recorded as stock gets a write-off fact without a receipt or opening stock balance.

Write-off history is permanent. There is no reactivation, disposal, correction or reissue workflow in this batch. Do not use Write Off to correct a mistaken historical movement.

## Read Stock And Equipment History

**Stock Inventory** distinguishes Physically Held, Ready, Awaiting Checks, Awaiting Preparation, Currently Issued and Written Off. Physically Held includes awaiting equipment; it excludes issued and written-off quantities. Registered Devices retain their own identities in a separate table.

**Movement History** shows genuine receipts, issues, returns, preparation and write-offs with their dates, quantities, states, reasons and recorded actors. **Receipt History** retains original Supplier, specifications, quantities and checks. Later events do not rewrite earlier facts. Supplier means the purchasing source, separately from Manufacturer.

With independent access, Staff/Department equipment shows actual outstanding Asset quantities and original Device relationships. **My Equipment** shows only the signed-in person's safe personal equipment and **Shared with My Department**, including remaining quantities. It grants no stock, directory or Device administration rights. Membership changes and independent feature switches apply on the next request; disabling a feature retains its data and history.

Device registration/reissue, associated equipment, movement/specification corrections, dashboards, Low Stock warnings, Supplier Management, Service Desk and Stocktakes remain later work. No production upgrade, backup or restore procedure is provided here.

[Implementation And Screenshots](../../../development-handovers/evidence/stock-circulation/Report.md) · [Roles And MFA](Roles-Section-Permissions-and-MFA.md) · [← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
