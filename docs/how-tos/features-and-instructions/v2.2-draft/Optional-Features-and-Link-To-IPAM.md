# Optional Features, Basic IPv4 And Link To IPAM

> **Draft v2.2 — Unreleased.** The Stage 2 and 3 procedures describe `milestone-1` at `753b3266893987addb11406ef8303adb03c3c112`. Use the [published v2.1 guides](../README.md) for the current release. This is not an installation, upgrade or restore procedure.

## Choose The Features Your Organisation Uses

Caffoot Lite lets an administrator decide which areas the whole organisation uses. You can record Devices without managing subnets, manage IP addresses without a Device inventory, or document Network Racks independently. **IT Assets** has its own switch for equipment stock and circulation. **Suppliers** has an independent switch for Supplier Management. Turning an area off retains its records so that you can use it again later.

An **optional feature** is an organisation-wide choice. A **permission** decides what a particular account may read or change. Both must allow the action. For example, enabling IPAM does not give a Staff Member access to it, and a saved IPAM Edit permission cannot override the organisation's decision to disable IPAM.

### Before You Start

- To change feature switches, sign in as an active **Administrator** and complete the required MFA verification. MFA is the additional authenticator check used to protect privileged access.
- To use an enabled area, your account needs its relevant section permission and must satisfy the account's MFA requirements. Read access allows inspection; Edit access allows permitted changes.
- To create a Device or edit an ordinary Device field, you need **Devices Edit**. Adding a Device without an IP address does not require IPAM Edit.
- To link a basic Device address to managed IPAM, both Devices and IPAM must be enabled, and you need **Devices Edit and IPAM Edit**.
- To change Rack placement, Network Racks must be enabled and you need the appropriate Rack permissions. Devices Edit alone does not grant permission to move equipment in a rack.

Ask your administrator about a missing area or unavailable action. Do not change an organisation-wide switch merely to work around your own account permissions. [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md) explains access in detail.

### Find And Read The Feature Cards

Open **Settings & Data → Optional Features**. The cards are grouped as follows:

| Group | Card | What It Controls |
| --- | --- | --- |
| Infrastructure | **Devices** | The Device inventory and its permitted workflows, including optional basic IP information |
| Infrastructure | **IP Address Management** | IPAM subnets, address allocations and VLANs |
| Infrastructure | **Network Racks** | Rack records, accessories and permitted placement workflows |
| Additional Features | **Suppliers** | Company records, categories, locations, contacts and notes in the [Batch 4.1 draft](Supplier-Management.md) |
| Additional Features | **Equipment Lifecycle** | Physical Device dates, warranty and replacement warnings and lifespan settings in the [Batch 4.4 draft](Equipment-Lifecycle.md) |
| Additional Features | **IT Assets** | Stock receipts, inventory, readiness checks, equipment issue and return, write-offs and related stock reporting |

An available card shows **Enabled** or **Disabled**. A disabled card has an **Enable Feature** switch; an enabled card's switch is labelled **Enabled**. The switch's accessible name identifies the feature being enabled or disabled.

**Staff Members** and **Departments** are core areas, subject to their permissions. They have no Optional Features switch and do not have to be populated. **Settings & Data**, account administration and **My Account** remain available under their respective authorisation rules even if every optional area is off. This does not give ordinary users administrator access.

### Enable A Feature

1. Open **Settings & Data → Optional Features** as an administrator.
2. Find the relevant card, for example **Devices** under **Infrastructure**.
3. Turn on its **Enable Feature** switch.
4. Wait for the save to finish. The interface reports **Optional feature setting saved.** and the card displays **Enabled**. There is no separate page-wide Save button.
5. Open the feature from the navigation and check that the intended accounts have the necessary section permissions. Change those permissions separately through **Staff → Permissions** if required.

Controls are temporarily unavailable while a setting is being saved. If saving fails, read the error and check the reloaded card state before trying again. A failed request does not justify assuming the feature is enabled.

### Disable Or Re-Enable A Feature

1. Before disabling, tell affected colleagues which area will become unavailable and finish any work that depends on it.
2. Open **Settings & Data → Optional Features** and turn off the enabled feature's switch.
3. Read the confirmation that saved data and permissions will be retained. Choose **Cancel** to leave the feature enabled without saving a change, or confirm to disable it.
4. Wait for the saved **Disabled** state. The section's navigation and feature-specific actions disappear, and its operations are blocked on the server as well as in the interface. A previously opened page does not bypass this restriction.
5. To restore access later, enable the same card. The retained records and saved permissions apply again; colleagues still need the required account access and MFA verification.

Disabling does not delete inventory, stock, placements, address relationships or history. Successful setting changes are recorded with the administrator and previous/new state. Turning off IT Assets also hides its stock information in related views; it does not turn managed Devices into anonymous stock or erase their identity.

### Defaults And Independent Use

In the unreleased implementation, a genuinely new installation starts with all optional areas disabled. The existing-installation migration preserves prior Devices, IPAM and Network Racks availability by initially enabling those three, even when the existing inventory is empty. IT Assets and Suppliers are added disabled. Later restarts and upgrades retain saved choices. These are descriptions of the implementation, not a verified production-upgrade procedure.

| Intended Use | Feature Choices And Practical Effect |
| --- | --- |
| Record equipment without managing networks | Enable Devices; IPAM and Network Racks may remain off. Devices may have no IP or an optional basic IPv4 address. |
| Manage address space alone | Enable IPAM. Subnet and independent allocation work remains available with IPAM permissions; Device access is not granted. |
| Document rack enclosures and accessories | Enable Network Racks. Independent rack operations use Rack permissions; operations involving Devices still respect the Devices feature gate. |
| Manage stock without a general Device inventory | Enable IT Assets. Stock workflows use IT Assets permissions; registering or changing a canonical Device also needs the applicable Devices access. |
| Record Devices without stock management | Enable Devices and leave IT Assets off. The ordinary Add Device route remains available. |

Enabling one area never silently enables another. Some linked operations need both areas, while their independent records remain usable. Import and Clean Start have their own existing safeguards, including the required enabled inventory sections; they are not ways to bypass a disabled feature. Use the relevant maintained procedure before attempting either operation.

## Understand Basic And Managed IP Addresses

An IPv4 address is a four-part number such as the fictional `192.0.2.10`. A **subnet** is a managed network range, such as `192.0.2.0/24`; `/24` describes the size of that range. A **basic address** records a Device's IP without creating an IPAM allocation. A **managed address** has the normal IPAM relationship and allocation safeguards.

| Device Address State | What You Can Do |
| --- | --- |
| No primary IP | Save the Device without an address, with IPAM on or off. |
| Basic, with IPAM off | Enter or change an optional valid IPv4 address using Devices Edit, without configuring a subnet. |
| Basic, with IPAM on | Continue editing the same basic address using Devices Edit. A normal Save does not link it, even if a matching subnet now exists. |
| Managed, with IPAM off | Read the existing address on the Device. It is protected from editing and its allocation is retained. |
| Managed, with IPAM on | Use the established managed-IP controls and required IPAM Edit permission for address changes. |

Basic does not mean unchecked. The address must be valid and unique, and must not conflict with another Device, a reservation or a protected gateway. The server checks retained information even where you cannot view all of it. Do not use an error as evidence that an address is free.

### Save A Device With No IP

An offline printer awaiting network configuration is a useful example. All names and networks in this guide are fictional; use your organisation's approved records when working on real equipment.

1. With **Devices** enabled and Devices Edit, open **Devices → Add Device**. To amend an existing address-free Device, open its details and choose **Edit Device**. Clearing an existing managed address is a managed-IP change and also requires enabled IPAM and IPAM Edit.
2. Complete the required identity and hardware fields for that Device type.
3. Open **Networking** and leave **Primary IP Address (Optional)** empty. No subnet is needed for an address-free Device.
4. Select **Save Device** and reopen the Device to check its details. Saving an empty address creates no IPAM allocation.

Leave the form without saving to discard your edits, confirming any unsaved-change prompt. Existing-Device editing uses **Back to Details**; the Add Device form provides **Cancel**. A validation rejection means you should correct the stated fields and save again, rather than assume part of the Device was recorded.

### Enter A Basic IPv4 Address

Use this workflow when your organisation deliberately records Device IPs without using IPAM. Creating a new basic address requires IPAM to be off; merely lacking IPAM permission does not select basic mode.

1. Ask an administrator to open **Settings & Data → Optional Features**, disable **IP Address Management** and confirm. This affects everyone using IPAM, so agree the change first.
2. With Devices Edit, open **Devices → Add Device**, or edit a Device that has no address or is already basic.
3. Open **Networking** and enter an unused valid address in **Primary IP Address (Optional)**, for example `192.0.2.10`. The form explains **Optional basic IPv4. No subnet or allocation is created.**
4. Complete the remaining required Device fields, then select **Save Device**.
5. Reopen **Device Details → Network** and check the saved **Primary IP**. The subnet is **Not linked**.
6. If an administrator later re-enables IPAM, reopen the Device and confirm that the address remains recorded. It stays basic until an authorised user deliberately links it.

An existing managed address does not become basic when IPAM is disabled. Its address field remains read-only. Re-enable IPAM and use the authorised managed-address workflow if it needs changing.

A previously basic address remains editable after IPAM is enabled. You may change it to another valid unused address or clear it; its basic mode is retained until explicit linking. Saving Device notes, restarting the application or using an inventory check does not create a subnet or silently allocate the address.

### Read Basic IPs Outside Subnets

Open **IPAM → Overview → Basic IPs Outside Subnets**. This read-only figure counts saved, non-empty basic Device addresses outside every configured managed subnet. It excludes Devices with no IP and basic addresses already inside an existing managed network.

For example, a basic `192.0.2.10` counts when no managed subnet contains it. After an authorised editor creates the fictional `192.0.2.0/24` subnet, the count falls even though the Device is still basic. A lower count therefore does not prove that linking has happened. Check the Device's association and IPAM allocation separately.

The card requires effective Devices Read **and** IPAM Read. It is hidden if either feature or permission is unavailable, rather than revealing a Device-derived total to an IPAM-only viewer. Next-available IP suggestions avoid known basic addresses, but this does not convert them into managed allocations. An IPAM address card can remain **Available** until explicit linking, so inspect the saved Device as well before allocating an address.

## Deliberately Link A Saved Basic Address

Linking connects one existing basic address to an existing managed subnet. It preserves the Device's identity and changes how that address is managed. The implemented control is labelled **Link to IPAM**.

1. Ensure **Devices** and **IP Address Management** are enabled and your account has both Devices Edit and IPAM Edit. Finish or cancel any open edit of this Device first.
2. Open **Devices**, open the Device's read-only **Details** view, then select **Network**. This is **Device Details → Network**, not **Edit Device → Networking**.
3. Under **Network Identity → IPAM Association**, select **Link to IPAM**. Check that the displayed Device name and exact saved address are correct.
4. Review **Existing Subnet**. Only existing managed subnets containing that address are offered. An IP Address Block alone is not an addressable subnet.
5. If the dialog says **No suitable existing subnet**, submission is disabled. Select **Cancel**. An authorised IPAM editor must create the correct subnet separately using IPAM's existing subnet controls, then reopen this workflow. Nothing is created automatically.
6. Before confirming, recheck the exact address under **IPAM → IP Addresses**. Investigate any assignment, reservation, gateway restriction or other conflict. Do not release another allocation to force this Device into it.
7. Choose the matching **Existing Subnet**, for example fictional **Training Network — 192.0.2.0/24** for basic `192.0.2.10`, then select **Link to IPAM**.
8. After **Device address linked to IPAM.**, check **Device Details → Network** for the managed subnet. Check **IPAM → IP Addresses**: the address is **Assigned** to the correct Device.

The Device association and IPAM allocation save together. **Cancel** changes neither. If another person changes the Device or allocation before you confirm, or the Device has an active edit, the server rejects the request without a partial link. Cancel, refresh the relevant records, resolve the stated problem and begin again. Repeatedly submitting the old dialog cannot make its saved address or revision current.

After successful linking, the existing managed-IP permissions apply. Disabling IPAM later preserves the managed relationship and makes its address read-only; it does not unlink it or turn it back into basic mode.

## Preserve Devices When Network Racks Is Off

Turning off Network Racks hides Rack-specific controls while retaining the saved placement. Ordinary, type-appropriate non-Rack mounting choices remain available for equipment without a protected Rack placement.

For a fictional switch already mounted in **Training Rack**, an authorised Devices editor can update an unrelated field while Network Racks is off:

1. Open the Device's **Details**, then **Edit Device**.
2. Change the intended ordinary field, such as **Notes**.
3. Leave the protected mounting and location information alone. Existing Rack-mounted or shelf-associated equipment has its placement controls hidden and its saved **Location Area** protected while Racks is disabled.
4. Select **Save Device** and confirm the intended ordinary change.
5. When the administrator re-enables Network Racks, reopen the Device and rack to verify the retained placement.

The saved mount type, Rack reference, U position/span, face, shelf association and ordinary Location text remain unchanged by that unrelated edit. The server preserves omitted hidden values and rejects attempts to change protected placement. A hidden Rack is not a missing record, and disabling the feature is not an unmounting operation.

When Rack information is unavailable, related views may show **Rack information is not available with your current access.** Do not recreate a rack or shelf merely because its details are hidden. To deliberately move or unmount equipment, re-enable Network Racks and use the existing placement workflow with the required permissions.

## Troubleshooting And Safe Recovery

| Problem | What To Check Or Do |
| --- | --- |
| A feature is enabled but absent from my navigation | Check your section permission, MFA and account status with an administrator. Enabling a feature grants no account access. |
| I cannot change Optional Features | The controls require an active, MFA-verified administrator. Ordinary section Edit rights are insufficient. |
| Suppliers is missing | Verify that your build includes Batch 4.1, then check the Suppliers switch and effective section access. |
| A feature switch appears to revert | Wait for the pending save, read its error and check the reloaded saved state. Verify your session before trying again. |
| I cannot edit the Device's IP | Determine whether it is managed. Managed changes require enabled IPAM and IPAM Edit; turning IPAM off preserves the address read-only. |
| I cannot start a new basic address with IPAM on | The basic entry route starts with IPAM disabled. A previously basic Device remains editable after re-enabling; a new managed address uses the normal subnet workflow. |
| Link to IPAM is absent | Check for a non-empty basic address, enabled Devices/IPAM and both Edit permissions. A managed or address-free Device does not qualify. |
| The dialog has no suitable subnet | Create an appropriate managed subnet separately through authorised IPAM controls. An organisational address block does not substitute for it. |
| Linking reports a changed Device or active edit | Finish or cancel the edit, refresh Details and reopen the dialog. Recheck the current saved address before confirming. |
| An address is rejected although I cannot see its owner | Ask an authorised administrator to investigate. Hidden records still protect uniqueness and reservations; do not bypass the conflict. |
| The out-of-subnet count is zero but the Device is not linked | A basic address inside a configured subnet is excluded from that count. Use the explicit link workflow. |
| Rack or shelf details disappear | Check the feature switch and Rack permissions. The saved relationship is retained; do not create replacements for hidden data. |
| An action fails after an area was disabled | Its access is checked again when saving. Re-enable only if the organisation intends to use it, then reopen the workflow and review the current records. |

Feature and permission restrictions apply to direct requests as well as visible controls. Hidden stock, Rack and subnet collections are not made available merely by opening a linked Device. A Device's own saved primary address may remain visible as Device information; that does not grant access to the wider IPAM inventory. IPAM-only views also avoid exposing Device-derived names without Device access.

## Related Guides

- [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md) — account access, overrides and authenticator requirements.
- [Receive Stock And Stock Inventory](IT-Assets-Stock-Intake.md) — configure and receive equipment with IT Assets enabled.
- [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md) — circulate equipment and preserve stock history.
- [Device Stock Registration And Reissue](Device-Stock-Registration-and-Reissue.md) — when stock work also needs canonical Device access.
- [Optional Features — Development Foundation](../../../development-guide/Optional-Features.md) — the maintained technical contract and evidence references.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
