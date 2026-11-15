# IT Assets: Receive Stock And Stock Inventory

> **Draft v2.2 — Not Published / Not Production Guidance.** Batches 3.1–3.7 are merged through PR #388 at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` (schema 16). Batch 3.8 is implemented for review on `feat/it-assets-issue-return-writeoff` (draft PR #389, schema 17); it is not merged or visually accepted. Batch 3.4 native acceptance remains deferred. Use the published v2.1 guides for production. These are not installation, upgrade or restore instructions.

## Before You Start

An administrator enables **IT Assets** in **Settings & Data → Optional Features →
Additional Features**. It starts disabled. Enabling the feature does not grant access:
**IT Assets Read** allows viewing stock and its history; **IT Assets Edit** also allows
receipts and readiness updates. Existing role, override and MFA rules still apply.
These permissions do not grant access to Devices, Staff Members or Departments.

Choose **IT → IT Assets**. The original intake tabs are **Receive Stock**,
**Stock Inventory** and **Receipt History**. Batch 3.8 adds **Issue Equipment**,
**Return Equipment**, **Write Off** and **Movement History**; see [circulation](IT-Assets-Issue-Return-and-Write-Off.md). A user with Read access can view inventory and history,
but cannot submit the receipt or readiness forms. Disabling IT Assets hides the
section and prevents stock access, while retaining all stock and history.

## Receive A New Item

1. Open **Receive Stock**, then select **New Stock Entry**.
2. Choose **Equipment Type** and **Tracking Method**. Enter **Model / Description**
   and, if known, **Manufacturer**. Desktop, Laptop and Physical Server entries
   also offer shared Processor, Memory Size, Storage Capacity and Storage Type fields.
   Enter specifications common to this item; a different configuration needs a separate entry.
3. For quantity-based stock, enter **Quantity Received**. Individually tracked
   equipment is received one unit at a time, with optional **Serial Number** and
   **Asset Tag**. Each unit has a distinct identity even when both are blank.
4. Enter **Date Received**, optional **Supplier** and **Receipt Notes**. Supplier
   means the purchasing source; it is separate from Manufacturer and needs no Supplier directory.
5. Confirm the receipt and condition checks that you have actually completed.
   Leave **Checked & Ready To Issue** at zero until the required checks are complete.
   With both checks confirmed, enter the checked quantity: some or all of the delivery.
6. Review **Receipt Summary**, then choose **Record Receipt**. The summary describes
   the form before saving; it is not saved stock until the receipt succeeds.

All received equipment becomes **Physically Held** immediately. Equipment not
explicitly confirmed ready remains **Awaiting Checks**. This does not create managed
Devices or assign equipment to anyone. A saved receipt retains its original date,
Supplier, quantity, checks and responsible account.

## Receive Another Delivery

Choose **Receive More Of An Existing Item**, then select the compatible stock item.
Its shared specifications remain unchanged. Enter this delivery's quantity, date,
Supplier, checks and any notes, then record it. Each delivery has its own history;
it does not replace an earlier receipt. For another individually tracked unit,
select the same catalogue item and record that unit's optional serial number/tag.

Choose a new stock entry when the equipment has different shared specifications.
An identical new entry is refused so that you can select the existing item instead.

## View Stock And Update Readiness

**Stock Inventory** shows quantities actually recorded:

- **Physically Held:** equipment on hand, including equipment awaiting checks.
- **Ready:** equipment explicitly checked and confirmed Ready To Issue.
- **Awaiting Checks:** received equipment still awaiting receipt checks.
- **Awaiting Preparation:** returned equipment awaiting its applicable checks.
- **Currently Issued:** the outstanding quantity with its original recipient.
- **Written Off:** equipment permanently removed from usable stock.

Returned stock uses **Prepare Returned Equipment**, not the receipt-readiness form.
Registered Devices appear separately under their original identities. Neither
issued nor written-off quantities count as Physically Held.

Choose **View / Update** beside an item. Read-only users see **View Details** instead.
The details show its specifications, quantities and individual identities where applicable.

To confirm more quantity-based equipment ready, enter the **New Ready To Issue Total**
and complete both checks. For individually tracked equipment, select the actual
units confirmed ready. The total follows your selections. Choose **Save Readiness Change**.

To move equipment from Ready back to Awaiting Checks, reduce the total or clear the
relevant individual selections and enter a reason. A reason is required for every
reduction. The change records the account, time, quantities and reason. It does not
add another receipt or alter the Physically Held total. If another person changes
the stock first, reload the item and review the new values before trying again.

For quantity stock, **Minimum Stock Level** is optional. Blank means no threshold;
zero is a configured threshold. Saving only the minimum records an attributed
setting change without creating a stock movement. Low Stock warnings and dashboards
are not available in this batch.

**Cancel** discards the readiness form; it does not reverse a saved receipt.
Manufacturer, Model and shared specifications are read-only here. There is no
movement or specification correction editor in this batch.

## Read The History

**Receipt History** retains each delivery's original date, quantity, Supplier,
checks, notes, specifications and account. Open **Receipt Checks**
where shown to see the recorded individual identifiers. Readiness changes appear
separately, with their genuine dates, quantities, checks and reasons.

[Issue, Return, preparation and Write Off](IT-Assets-Issue-Return-and-Write-Off.md)
are implemented for Batch 3.8 review. Device registration/reissue, associated equipment,
corrections, dashboards, Low Stock warnings, Supplier Management and Stocktakes remain later work.
This guide does not provide installation, upgrade, backup or restore instructions.

See [Optional Features](Optional-Features-and-Link-To-IPAM.md),
[roles and MFA](Roles-Section-Permissions-and-MFA.md) and the
[implementation evidence](../../../development-handovers/evidence/stock-intake/Report.md).
