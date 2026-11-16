# Register Computers From Stock And Reissue Devices

> **Draft v2.2 — Not Yet Published.** These instructions describe Batch 3.9 in
> [draft PR #390](https://github.com/Caffoot/Caffoot-Lite/pull/390), targeting
> `milestone-1`. They are not published v2.1 instructions, installation guidance
> or owner visual acceptance. Use fictional examples for private testing.

## Choose The Right Route

| Route | What It Records |
| --- | --- |
| Devices → Add Device directly | A managed Device. It does not receive stock or declare physical possession. IT Assets is not required |
| IT Assets → Receive Stock | A delivery, original date, optional purchasing Supplier and shared specifications. It does not create managed Devices |
| Brand New → Get From Stock → Add Device | One new canonical Device from one checked, unregistered computer-stock unit. It remains physically held and Ready To Issue |
| Reissue Existing Device | An actual issue of one already registered, held Ready Device to eligible Staff or a Department. Its identity and all earlier assignments remain |
| Return Equipment, then preparation | A genuine physical return and the applicable preparation checks before an existing Device becomes Ready again |

An imported, retired, unassigned or directly created Device is not automatically
physically held stock. Device operational **Status** and stock readiness describe
different facts. These workflows do not automatically change Status, IP
addresses, rack placement, Location or technical configuration.

## Access And Optional Features

An administrator must enable **Devices** and **IT Assets** independently in
**Settings & Data → Optional Features** for registration or reissue. The technician
needs effective **Devices Edit** and **IT Assets Edit**, including the usual
account, role, MFA and sign-in requirements. Read Only is insufficient. Editing
Stock does not grant Staff directory, account or permission management access.

Normal direct Add Device still uses its existing Devices permissions and works
with IT Assets disabled. A basic Device can have no IP address. Select a managed
address or rack placement only when needed, using the existing independent IPAM
or Racks permissions. Choosing a stock source adds no IPAM or rack requirement.
Turning an optional feature off hides its restricted actions and preserves data.

## Receive And Check New Computers

1. Open **IT Assets → Receive Stock**. Use **New Stock Entry**, or receive more
   into an existing item only when the shared specification matches.
2. Choose **Desktop**, **Laptop** or **Physical Server**, and **Quantity-Based Stock**.
   Record Manufacturer, Model / Description and any known common Processor,
   Memory, Storage Capacity/Unit and Storage Type.
3. Record Quantity Received, Date Received and the optional purchasing Supplier.
   Manufacturer and Supplier are separate facts.
4. Confirm the receipt and condition checks for the quantity actually checked.
   Set Checked & Ready To Issue accordingly, then select **Record Receipt**.
5. Equipment awaiting checks remains physically held but cannot be selected by
   Get From Stock. Use the existing Stock Inventory readiness controls after checks.

Separate stock entries describe materially different common specifications.
Each receipt keeps its own original date, Supplier, checks and responsible actor.

## Brand New — Get From Stock

1. Open **Devices → Add Device**. In the existing **General** tab, select
   **Brand New — Get From Stock**.
2. Choose a batch under **Ready Unregistered Computer Stock**. The list shows
   the selected item's actual unregistered Ready quantity, excluding already
   registered Devices, awaiting equipment, issued stock and written-off stock.
3. Verify the prefilled Device Type, Manufacturer, Model and compatible common
   hardware details in **Hardware**. Storage Type is prefilled when recorded.
4. Enter an individual, unique **Device Name**. Enter a genuine **Serial Number**
   if available, or leave it blank. Do not use a dummy serial number.
5. Complete or verify the normal individual fields and applicable form requirements.
   Shared stock does not supply a hostname, serial number, networking, Location,
   rack placement or recipient. An IP address remains optional.
6. Select **Save Device**. A successful save creates one canonical Device, links
   it to the original stock item and records one registration transfer. The Device
   remains unassigned, held and Ready To Issue.

The alternative stock entry point is **IT Assets → Stock Inventory → View / Update**
for a compatible Ready computer batch, then **Brand New — Get From Stock**. It opens
the same Add Device editor and checks availability again.

Selecting stock, changing fields and cancelling save no Device or movement. A
failed save rolls back the whole operation, including any associated managed IPAM
change. An unavailable or stale selection reports an inline message beside the
stock control. Reload Get From Stock and select an available batch again. Existing
individual fields stay for you to verify. **Use Direct Device Add** deliberately
removes the stock source; that route does not register a stock unit.

## Ten-Computer Accounting Example

| Classification | Before Registration | After Registering One | After Issuing That Device |
| --- | ---: | ---: | ---: |
| Unregistered Ready | 10 | 9 | 9 |
| Registered Ready And Held | 0 | 1 | 0 |
| Total Physically Held | 10 | 10 | 9 |

Registration changes identification and classification. Only the later physical
issue reduces the held total. Original receipt provenance remains attached to
the same stock item; registration does not create another purchase or delivery.

## Reissue Existing Device

1. Confirm that the actual Device is physically held and recorded as Ready To
   Issue after its applicable checks. An unassigned Device alone is insufficient.
2. Open **IT Assets → Reissue Existing Device**. The same route is available from
   an eligible registered Device's Stock Inventory details or **Device Details →
   Assigned To → Reissue Existing Device**.
3. Select the existing **Ready Registered Device**. The list excludes awaiting,
   already assigned, issued, written-off and virtual equipment.
4. Choose **Staff Member** or **Department**. Search the restricted eligible
   recipient list, then select the intended recipient. Inactive Staff and archived
   Departments cannot receive a new assignment.
5. Verify **Date Issued** and the optional Issue Note. Select **Reissue Existing Device**
   when the equipment is actually being issued.
6. Check the current holder in Device, Staff or Department equipment views. A
   linked employee sees permitted personal or Department-shared equipment through
   the existing **My Equipment** relationships.

One successful operation records a new permanent dated assignment and matching
stock issue. Ready To Issue and Physically Held each reduce by one. The original
Device ID, configuration, serial number and previous assignment/return history
remain. Navigating away or resetting before submission makes no assignment or
physical movement. Failed assignment, changed eligibility or revoked permission
changes neither fact.

## Return And Prepare A Managed Device

Use the existing **Return Equipment** action to record an actual physical return,
retaining the original Device identity. A Device without an outstanding recorded
issue can use its authorised Device Details return action, with the explicit
physical-return confirmation. It enters **Awaiting Preparation**.

After the applicable checks, open its registered Device details in **Stock Inventory**
and use **Prepare Returned Equipment → Mark Ready To Issue**.

| Equipment | Required Preparation Confirmation |
| --- | --- |
| Desktop, Laptop, physical Server | Checked Working and Data Wiped / Reset |
| Printer | Cleaned And Checked Working; stored documents, credentials and user data cleared where applicable |
| Monitor, Keyboard, Mouse, Docking Station | Cleaned And Checked Working |
| Other physical equipment | Working/condition checks and applicable preparation, including data clearing where needed |

Preparation preserves Physically Held. It does not assign or issue the Device.
See [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md) for the
established return and disposition instructions.

## Optional Hardware Details

**Desktop, Laptop and physical Server:** Storage Type is optional and separate
from Storage Size/Unit. Suggested media are HDD, SATA SSD, NVMe SSD and Other.
Blank means unrecorded; recorded custom/legacy values remain selectable.

**Physical Server → Hardware:** select **Record Boot Storage** to document ordinary
boot drives without requiring ZFS. Choose Independent Boot Drives, then record
Boot Drive Type, Number Of Boot Drives, Capacity Per Drive/Unit and Boot Configuration
(Single, Mirror or Other). Boot Pool Name is optional. A mirror needs at least two drives.

Use **Add Pool** for named ZFS Pools, and **Add VDEV** for each constituent VDEV.
Record a unique Pool Name, layout, drive count, capacity per drive/unit and Drive Type.
The accepted layout minimums are Single: one, Mirror: two, RAIDZ1: three, RAIDZ2:
four and RAIDZ3: five drives. Every Pool needs at least one recorded VDEV.

If the boot drives are already represented by a recorded Pool, choose **Use An
Existing ZFS Pool** and select that Pool under **Existing ZFS Boot Pool**. This stores
one reference and does not add another set of boot drives. Verify the choice after
changing or removing a Pool.

Existing **RAID Type**, **Number Of Hard Drives**, **Storage Size** and **Storage Unit**
remain independently recorded. Detailed Boot/ZFS information does not calculate,
overwrite or define those older values. Device Details displays the recorded
descriptions. These controls document inventory only; they do not manage disks,
operating systems or real ZFS resources. Desktop/Laptop do not acquire Server-only controls.

UPS/PDU Manufacturer suggestions include Ubiquiti and the other approved manufacturers.
They are suggestions, with no added model lists. Existing user-managed entries,
hidden suggestions, custom values and historical Device records remain intact.

## Troubleshooting And Evidence

- **No suitable stock:** verify the exact batch, quantity tracking, computer type
  and unregistered Ready balance. Physically Held includes equipment unavailable to register.
- **No Device to reissue:** verify an actual recorded physical return/registration,
  preparation, unassigned state and no write-off. Device Status alone is insufficient.
- **Changed stock or Device:** reload the selection after another technician's
  change or editing reservation. Do not create a duplicate Device to bypass the message.
- **Recipient missing:** verify active Staff or a non-archived Department. The
  picker deliberately returns eligible names/IDs without unrestricted directory data.
- **Access changed:** restore the applicable features and effective Edit rights,
  then reopen the workflow. A selected stock registration never silently becomes
  direct Device creation.
- **Invalid storage:** check positive drive counts/capacities, layout minimums,
  unique named Pools and an existing selected Boot Pool.

The [changed-screen gallery and actual verification report](../../../development-handovers/evidence/device-stock-registration/Report.md)
contain genuine fictional desktop/mobile light/dark captures. They are review
evidence, not owner visual approval. [Technical transaction/source mapping](../../../development-guide/Device-Stock-Registration-and-Reissue.md)
records the implementation boundaries. Associated Equipment, corrections,
dashboards/warnings and the separate website work remain outside this batch.
