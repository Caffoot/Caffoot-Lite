# Associated Equipment And Direct Device Handover

> **Draft v2.2 — Unreleased.** These instructions describe the implementation on `milestone-1` at `753b3266893987addb11406ef8303adb03c3c112`. v2.1 remains the published release.

Associated Equipment records which accessories belong with a particular Device's assignment. For example, a technician can explicitly link a monitor, keyboard and mouse to a workstation issued to Alex. Equipment issued to the same person or Department is not linked automatically: Alex's other monitor may belong with a different workstation.

The association refers to the original equipment issue and the Device's actual holder. It does not create another Asset, copy a Device or issue already-issued equipment again. When the workstation changes hands, its accessories must be accounted for through their existing return or write-off processes.

## Before You Start

- **Devices** and **IT Assets** must both be enabled. Viewing the tab needs effective **Devices Read** and **IT Assets Read**; adding equipment needs **Devices Edit** and **IT Assets Edit**.
- The Device must have a current Staff Member or Department assignment before you can add accessories. New equipment cannot be issued to an inactive Staff Member or archived Department.
- To issue and associate new equipment, the particular stock item or individual unit must already be **Ready To Issue**. Held equipment awaiting checks or preparation is unavailable.
- To associate an existing issue, it must still be outstanding, belong to the exact current holder and be eligible for association. An issue already associated with another Device cannot be linked again.

See [Roles And Permissions](Roles-Section-Permissions-and-MFA.md), [Optional Features](Optional-Features-and-Link-To-IPAM.md) and [Initial Device Assignments](Device-Assignments-and-My-Equipment.md) if the required Device, holder or controls are unavailable.

## View A Device's Accessories

1. Open **IT → Devices** and open the actual Device's details. Check its name and identifying information before changing its equipment.
2. Choose **Associated Equipment**. The first table shows current associations, their **Outstanding** quantities, **Issued To** holder and **Issue Date**.
3. Review **Association History** for earlier holders and resolved equipment. It retains the original issue, quantity, original holder, association date and recorded technician, followed by recorded returns, preparation and write-offs.
4. If a former assignment still has outstanding associated equipment, use its available **Return Equipment** or **Write Off** action in the history table to resolve the actual situation. A Device's empty current association table does not by itself prove every former accessory was resolved.

Read-only users can inspect permitted records but cannot add, return or write off equipment. If either feature or Read permission is unavailable, association records are unavailable through this tab; saved history remains retained.

## Issue And Associate Ready Equipment

Use this route when the accessory is physically available and has not yet been issued.

1. In **Device Details → Associated Equipment**, choose **Add Equipment**.
2. In **Add Equipment From**, keep **Issue And Associate** selected. Check **Issued To**: this is the Device's actual current Staff Member or Department. It is fixed for this operation.
3. Choose the item under **Ready Equipment**. Read the availability for that selected item.
4. Enter a whole **Quantity To Issue** within its Ready balance. For individually tracked equipment, select the actual Ready units; check their serial numbers or asset tags where recorded. A unit without either identifier still keeps its individual identity.
5. Enter **Date Issued** and an optional **Issue Note**. Review **Selected Equipment** and the fixed recipient.
6. Choose **Add Equipment**. On success, the application returns to the Device's **Associated Equipment** tab. Check the new outstanding association and its original issue.

The issue and association save together. For two newly issued keyboards, held and Ready stock each reduce by two, and their original issue is explicitly associated with this Device's holder. If validation fails, neither the issue nor its link is saved. The separate ordinary **Issue Equipment** confirmation is described in [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md); this combined action retains its **Add Equipment** submission.

## Associate Already Issued Equipment

Use this route when the right equipment has already been issued to this exact holder and you need to record which Device it accompanies.

1. Open **Device Details → Associated Equipment → Add Equipment**.
2. Choose **Associate Already Issued Equipment** under **Add Equipment From**.
3. Select **Already Issued Equipment**. Check its equipment identity, original issue reference, date and outstanding quantity. For individually tracked equipment, inspect its recorded serial number or asset tag.
4. Check the fixed **Issued To** holder against the Device's current assignment.
5. Choose **Add Equipment**, then check the association on the Device.

The entire outstanding original issue is linked. If three mice remain outstanding on that issue, this action links that issue's three; it is not a way to select one mouse from the line or move it to another person. No further stock is issued or deducted. If the list says **No Eligible Issued Equipment**, check the original recipient, outstanding balance and existing associations rather than creating a second issue.

In both routes, **Cancel** abandons unsaved work; a discard prompt lets you keep editing. A stale or failed save leaves existing records unchanged. Reload after a holder or stock change and select the equipment again using current information.

## Resolve Returned, Damaged Or Missing Accessories

Use the equipment's real condition and whereabouts to choose the action:

| Actual Situation | Action And Result |
| --- | --- |
| The accessory is physically returned and reusable | Choose **Return Equipment** on its original association. Record the actual return and checks. It is held, but only becomes Ready after applicable preparation is confirmed. |
| The accessory is physically returned broken | Use **Return Equipment** and its **Damaged — Write Off** disposition with a reason. It is recorded as returned and written off, without becoming available stock. |
| The accessory is missing and has not been returned | Choose **Write Off** on the outstanding original issue. Record the exact missing quantity, date and reason. Outstanding reduces without a physical return, held-stock increase or Ready stock. |
| The original issue quantity is a typing mistake | Use [Correct Movement](IT-Assets-Correct-Movement.md) if eligible. A recording error does not justify a fictitious return or damage record. |

Partial returns leave the remaining quantity outstanding with its original holder. A missing quantity-tracked accessory can be written off directly, up to that original issue's outstanding amount. Individually tracked equipment keeps its existing one-unit identity. Writing off or returning the workstation does not automatically write off or return its accessories.

Every explicitly associated outstanding accessory must be resolved before a prepared Device can be reissued from stock or reassigned directly, including accessories linked during a former assignment. Real accessory actions are separate saved events: cancelling a later workstation handover does not undo them.

## Reassign A Workstation Directly

Direct reassignment records a prepared Device moving from its current holder straight to a different Staff Member or Department. Use it for a genuine handover. When equipment actually returns to the storeroom, use [Return → Preparation → Reissue Existing Device](Device-Stock-Registration-and-Reissue.md) instead.

1. Resolve **all** explicitly associated outstanding equipment first using the actual returns, damage dispositions or missing-equipment write-offs above. Accessories do not follow the workstation to its next holder automatically.
2. Open **Device Details → Assigned To → Reassign Device** for the currently assigned physical Device. The selected Device is fixed on the existing form; it is not a bulk reassignment screen.
3. Choose **Recipient Type**, then the different active Staff Member or non-archived Department under **Find A Recipient**.
4. Enter the actual **Date Reassigned** and an optional **Reassignment Note**. The date cannot precede the current issue or be in the future.
5. Physically check and prepare the workstation. Complete its displayed **Preparation Checks** only after doing the work. These checks start unchecked.
6. Choose **Confirm Ready And Reassign** as the explicit confirmation that the Device is ready for its new holder.
7. Check the new current holder and dated **Reassigned** entry in **Assignment History**. The old assignment closes, the new assignment opens and the same Device identity remains.

For Desktop, Laptop and physical Server, preparation requires **Checked Working** and **Data Wiped / Reset**. A Printer needs **Cleaned And Checked Working** and confirmation that stored documents, credentials and user data were cleared where applicable; a factory reset is not compulsory for every Printer. Monitor, Keyboard, Mouse and Docking Station require **Cleaned And Checked Working** without a mandatory data wipe. Other equipment requires its displayed working/condition and applicable data-preparation confirmations. These are factual checks, not tick boxes to bypass.

**Cancel** or a failed save keeps the old holder. A successful handover saves its new holder, closure of the old assignment, preparation confirmation and applicable stock custody together. For a registered issued Device, **Movement History** shows **Reassigned**, **Currently Issued → Currently Issued**. The handover does not create a storeroom receipt or add Physically Held/Ready stock. Device status, Location, Rack, network details and specifications stay as recorded.

### Permissions For A Direct Handover

Direct reassignment requires effective **Devices Edit**. A Device with recorded stock history additionally requires enabled **IT Assets** and **IT Assets Edit**. Devices-only reassignment remains available for eligible Devices without stock history when IT Assets is off. Switching IT Assets off never bypasses outstanding accessory resolution or grants stock access. Read-only users cannot reassign.

## Worked Example: Alex Leaves And Sarah Receives The Workstation

All names and equipment in this example are fictional. Alex holds workstation `HV-DESK-014`, with one individually tracked monitor, one keyboard and one mouse explicitly associated with that workstation. Sarah is an active Staff Member. There is no other outstanding associated equipment.

1. Technician Morgan checks **Associated Equipment** and confirms the three original issues and their identities.
2. Alex physically returns the monitor and keyboard. Morgan records their actual returns and confirms cleaning/working checks after completing them. Each becomes one held, Ready accessory; its original association and holder history remain.
3. The mouse is missing. Morgan chooses its original issue's **Write Off**, records one missing mouse with a factual reason and the actual date, and saves. Its outstanding quantity becomes zero. Held and Ready mice do not increase.
4. Morgan checks both current associations and **Association History**. All explicitly linked accessory quantities are now resolved.
5. Morgan prepares the workstation, completes its working and data-wipe/reset checks, chooses Sarah in **Reassign Device** and saves **Confirm Ready And Reassign**.
6. Alex's workstation assignment closes and Sarah's opens. The workstation remains one canonical Device. If it was already registered stock, it stays issued throughout; no extra held workstation appears.
7. Morgan issues the returned, Ready monitor and keyboard to Sarah through **Issue And Associate**. They become new issues linked to Sarah's workstation assignment. Alex's original issues, returns and missing-mouse write-off remain visible.

If step 5 fails, Alex stays the workstation's recorded holder. The accessory returns and missing-mouse write-off already saved in steps 2–3 remain valid historical actions. Review the error and current holder before retrying; do not repeat those accessory actions.

## Troubleshooting

| Problem | What To Check |
| --- | --- |
| **Add Equipment** is absent | Both features and both Edit permissions are needed, together with an eligible current holder. First assignment is a separate workflow. |
| Ready stock appears lower than expected | Check the particular item's issue-ready balance. Already issued, awaiting or registered Device stock is not ordinary available accessory stock. |
| An issue is not in **Already Issued Equipment** | It must belong to the exact holder, still be outstanding and not already associated. Another Device's association cannot be silently moved. |
| **Reassign Device** is unavailable | Check permissions, a current physical assignment, required stock access and unresolved accessories from every assignment. The action deliberately blocks ineligible work. |
| The workstation is prepared but reissue is blocked | Preparation does not resolve its accessories. Inspect **Association History** for former outstanding quantities. |
| The holder or equipment changed while editing | Reload before retrying. A stale save cannot transfer equipment using an old assignment or consume unavailable stock. |
| The Device is being edited elsewhere | Finish/cancel that edit or wait for the technician, then reload. Preserve the original Device rather than duplicating it. |

## Related Guides And Screenshot Acceptance

[Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md) · [Device Registration And Reissue](Device-Stock-Registration-and-Reissue.md) · [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md) · [Departments And Shared Equipment](Departments-and-Shared-Equipment.md).

The [genuine Associated Equipment and handover gallery](../../../development-handovers/evidence/associated-equipment-final/Report.md) preserves development evidence. Its report distinguishes agent inspection from owner visual acceptance. No standalone HTML preview is presented here as an approved application screenshot; outstanding image approval is tracked in the [documentation review items](../../../development-guide/Stage-1-3-Documentation-Review.md).

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
