# IPAM — Subnets, VLANs and Individual Addresses

[← All feature guides](README.md)

> **Draft v2.2 — Unreleased.** Reconciled against application baseline `fdc677920bfc52f48f641b3d6d1344c902a6a9b0` (schema 31), 26 November 2026. Use the [published v2.1 guide](https://github.com/Caffoot/Caffoot-Lite/blob/c3237114108cad9f7d4e57657b6aed5e0091a5ef/docs/how-tos/features-and-instructions/IPAM.md) for that release. Approved current desktop illustrations and final acceptance remain outstanding; see the [Batch 2 review record](../../../development-guide/Milestone-01-Batch-2-Review.md). Examples are fictional and use documentation address ranges.

## Understand the records

An **IP Address Block** optionally groups address space. An addressable **subnet** has a CIDR and name; new subnets also require an explicitly selected purpose: **LAN**, **Management** or **VPN**. A VLAN is optional. LAN and Management need a usable gateway; VPN may omit one. Existing subnets without a purpose display **Not assigned** and remain editable without reclassification. The individual IP address grid records **Available**, **Assigned** and **Reserved** states along with an optional hostname and **IPAM Notes**. IPAM notes are about the *address*, not about one particular device.

You need **IPAM Edit** to create/update networks or change independent address allocations. A Devices editor with only IPAM Read cannot alter a primary IP through the device form.

## Before You Start And Find Your Networks

IP Address Management (IPAM) records planned address space and saved allocations. It helps your team avoid allocating the same address twice; it does not scan the network, configure routers, provide DHCP or prove that a computer is online.

- An administrator must enable **IP Address Management** in [Optional Features](Optional-Features-and-Link-To-IPAM.md). You need IPAM Read to inspect it and IPAM Edit to change its records, with the account's required MFA verification.
- Devices and Network Racks are independent features. IPAM alone supports subnets and independent allocations. Device information and Device actions require the corresponding enabled feature/access; IPAM access does not grant general Device editing.
- Agree the real network plan before saving. Documentation examples must not be copied onto equipment without checking your actual network.

1. Open **IT → IPAM**. **Overview** shows inventory-wide IP Address Blocks, Networks, Usable Addresses and Available Addresses. Expand a group to inspect its networks.
2. Open **Manage Subnets** for grouped blocks and networks. **Browse IP Addresses** opens one network's addresses; **Edit Subnet** and **Edit Block** open their respective editors when authorised. A block filter can be cleared with **Show All IP Address Blocks**.
3. Open **IP Addresses** and select the required network. Check its CIDR, VLAN, gateway and usable range before editing. Search by address or saved hostname and filter the status. A /24 has range controls; other supported prefixes use pages of up to 32 usable addresses. Search/status filters apply to the displayed range or page, so check the other pages if a record seems missing.
4. Use **Next Available: [address]** to open the suggested address, when one is offered. This suggestion does not reserve it. Another editor may use it before you save.

**CIDR** combines a network address and prefix length. For example, `192.0.2.0/24` has usable host addresses `192.0.2.1`–`192.0.2.254`; the network and broadcast boundaries are not usable hosts. A **gateway** is the router address for that network. A **VLAN** is a numbered logical network association, not an address pool by itself. A parent **IP Address Block** organises ranges and has no address cards, gateway or VLAN of its own.

### Read Address States And Totals

| State | Meaning And Consequence |
| --- | --- |
| Available | No managed Assigned/Reserved allocation is shown. This is not proof that the address is unused on the physical network or absent from basic Device records. |
| Assigned | A managed Device primary IP or an independent allocation records the address as in use. An independent hostname does not create a Device relationship. |
| Reserved | The address is held for a purpose, or by a Device reservation. Check its owner/reason before releasing it. |
| Gateway · Reserved / Assigned | The subnet gateway is protected. Change the network or its eligible network Device, rather than editing it as a spare address. |

Usable capacity excludes network/broadcast addresses. Utilisation includes Assigned and Reserved addresses; an unallocated gateway is counted as reserved without creating an allocation record. Basic Device addresses are excluded from next-available suggestions, but are not counted as managed assignments. Therefore a basic address can still look Available in the grid, and an Available total is not an allocation guarantee.

## Worked example — add one subnet

Consider this fictional documentation example; substitute your approved real network plan: CIDR **192.0.2.0/24**, name **Lab Network**, purpose **LAN**, optional VLAN **50**, gateway **192.0.2.1**.

1. Open **IT → IPAM → Manage Subnets** and select **Add Single Subnet**.
2. Keep **Subnet / Network** as the type. Enter an aligned **Subnet CIDR** from /23 to /30 and a unique **Subnet Name**. Names ignore case and outer spaces; historical duplicate names remain usable until deliberately renamed.
3. Explicitly select **LAN**, **Management** or **VPN**. New records have no preselected purpose.
4. Leave **VLAN ID** empty if unassigned, or enter 1–4094. Do not enter 0 to mean unassigned.
5. Supply a usable **Gateway IP** within the subnet for LAN/Management. VPN can leave this empty; an entered VPN gateway must meet the same address checks.
6. Optionally choose an **IP Address Block** and write a **Description**. Select **Save Subnet**, then use **Browse IP Addresses** to check its CIDR, name, purpose, VLAN, gateway and usable range. **Cancel** abandons the unsaved form; a validation error leaves it open for correction.

To create an organisational parent instead, select **IP Address Block** in the same form. A block has no gateway/VLAN and does not allocate addresses to devices; create addressable child subnets as needed. Enter an aligned block CIDR and **IP Address Block Name**, optionally a parent block and Description, then **Save IP Address Block**. For example, `198.51.100.0/24` can contain smaller /26 child networks. A child must be strictly smaller than and contained by its parent. Blocks remain optional. Disabled **Reserved range (coming next)** and **Loopback /32 (coming next)** are not available workflows.

## Add multiple subnets

1. Select **Add Multiple Subnets**. The first section, **Address Block & Private Range Planning (Optional)**, starts collapsed. Leave it alone for standalone subnets, or open it to select/create a block or deliberately use a private-range quick-fill. It creates nothing until Save.
2. Under **Create Your Subnets**, enter **Starting Subnet Address**, **Subnet Prefix** (/23–/30), **Number of Subnets** (1–50) and **Gateway Convention** (First/Last usable IP). Capacity guidance explains how many equal-sized ranges fit a chosen parent and suggests a suitable prefix. It never changes your prefix: address/device capacity remains your choice. Theoretical capacity does not mean those ranges are free.
3. Leave **Consecutive** for adjacent ranges, choose **Every 10th Subnet** for ten subnet-sized steps (for /24: .10, .20, .30), or **Custom CIDRs** to edit each range in the preview. Guidance accounts for the Every 10th span; Custom ranges are checked individually. A broader /16 block is different from an addressable child prefix. Check the actual starting address, containment and existing inventory before saving.
4. Select **Preview Subnets**. Give every row a unique name and explicitly selected purpose. VLAN and Description are optional; edit gateways individually where needed. VPN gateways may be cleared. Custom CIDRs must be aligned /23–/30 ranges without overlaps.
5. Correct the visible field/row errors. Back lets you revise generation settings; manual gateways remain and are rechecked. Custom CIDRs survive Back with the same start/prefix/mode; changing those generation settings explicitly recalculates ranges.
6. Review the entire set and select **Save [number] Subnets** (or the singular equivalent). The optional new parent and all subnets save together, or none save. A failed row is never skipped silently. **Cancel** discards the unsaved batch. A rejected save restores the prior inventory and leaves the preview available for correction; wait for the result before retrying.

For a small fictional example, generate two consecutive /26 networks starting at `198.51.100.0`: `198.51.100.0/26` and `198.51.100.64/26`. Name them *Training A* and *Training B*, explicitly choose LAN, and review first-usable gateways `.1` and `.65`. They may be standalone, or explicitly linked to the broader `198.51.100.0/24` block. This example creates 62 usable addresses per child, not 254.

An Address Block can strictly contain an independent subnet without adopting it. The independent subnet keeps its saved parent absence, name, VLAN, allocations and devices, and appears under All / Standalone rather than that block's child filter. New children must avoid every existing network. Equal/partial overlaps, unrelated block overlaps and conflicting ownership remain rejected. Deleting or editing a block never adopts or deletes independent networks; explicitly linked children still protect a block from deletion.

The preview scrolls independently with Back/Cancel/Save visible, and rows stack on mobile. Fifty is the limit for **one operation**, not your installation: further batches into the same block are permitted when ranges and other rules are valid. Audit Trail reports the actual count while retaining the existing bounded detailed history.

Names/descriptions can explain a real VPN range, for example *London ↔ Bristol VPN*. A tunnel which only routes existing LANs does not need a fictional extra subnet. Tunnel relationships, public-IP/WAN and customer-isolated overlapping ranges are outside this workflow.

## Edit an individual IP

1. Navigate to the recorded subnet and select an address card, e.g. **192.0.2.10**.
2. The dialog is titled **Configure IP: [address]**. Review **Status** (Available, Assigned or Reserved), **Hostname** and **IPAM Notes**.
3. For an independent address, enter a note such as *Spare address for a lab device*. Choose the status that reflects its actual use and optionally a Hostname, then select **Save IP**. For a Device-owned address only **IPAM Notes** can change here; Status and Hostname are protected. Edit the Device to change its managed primary IP.
4. Reopen the address to verify the saved value. A colleague opening the address after your save will fetch the current shared value.

**Cancel** leaves the address unchanged. A rejected save restores its previous allocation; correct the reason and reopen if the records changed. IPAM Notes stay with the address and are separate from Device Notes. Gateway cards reject ordinary editing with a protected-address message. Do not change an active Device's assigned address to Available to bypass ownership.

## Reserve and release a spare address

On an independent, unassigned address, select **Reserved**, write why it is reserved and **Save IP**. To free it later, reopen the same address and change its status back to **Available** when permitted, then save. Check the grid again. An orphaned reservation is a retained reference to a Device no longer present. The dialog explains it and offers **Release historical reservation when saving**. Ordinary Hostname/Notes edits preserve that reference. Tick the release only after investigating why it exists, then **Save IP**. Cancel retains it. A live Device reservation is not an orphan and cannot be taken for another Device.

## Give An Address To A Device

1. Ensure Devices and IPAM are enabled. For new managed-IP Device creation, you need Devices Edit and IPAM Edit. Open **Devices → Add Device** or the saved Device's editor.
2. On **Networking**, optionally filter by **IP Address Block**, then choose **Subnet Name — CIDR**. The read-only **VLAN** comes from the subnet, or shows **Not assigned**. It cannot be overridden on a Device.
3. Use **Choose an Available IP Address**, or enter the exact address in **Primary IP Address (Optional)**. Both set the same saved primary address. Only a usable host in the selected subnet is accepted. A subnet gateway can belong only to an eligible Firewall, Router or Layer 3 Switch; it is protected from ordinary allocation.
4. Review any reservation for this same Device and all conflicts, complete the Device fields and select **Save Device**. Reopen Details and IPAM to verify the allocation and owner. Cancel/discard changes leaves both saved records unchanged.

A managed-IP change requires IPAM Edit even if started in Devices. The established IPAM-owned edit route does not grant permission to change unrelated Device properties. If IPAM is disabled or your account lacks IPAM Edit, existing managed addresses are protected; ordinary unrelated Device edits may still be saved. See [Devices](Devices.md) for its full editor, duplicate, protected identity and cancellation procedures.

### Basic Addresses And Explicit Linking

A Device can have no primary IP. A new basic IPv4 address is entered with IPAM off and Devices Edit; it has no allocation or subnet link. An existing basic record stays basic after enabling IPAM, even inside a newly created subnet. Ordinary Device Save never converts it.

Use [the complete Link to IPAM procedure](Optional-Features-and-Link-To-IPAM.md#deliberately-link-a-saved-basic-address): both features enabled and both Edit grants; saved Device **Details → Network → Network Identity → IPAM Association → Link to IPAM**; choose an existing containing managed subnet; check conflicts; deliberately confirm. **No suitable existing subnet** disables submission. Cancel changes nothing. Linking saves the Device association and Assigned allocation together, retaining existing address notes. Finish/cancel any Device edit first. Stale address/revision, active edit or allocation conflict saves neither part.

**Basic IPs Outside Subnets** on **IPAM → Overview** is visible only with both Devices Read and IPAM Read. It counts non-empty basic addresses outside all managed network ranges. A basic address inside a network is excluded; an Address Block alone is not a managed network. Zero does not mean all addresses are linked. Network/broadcast boundaries count as inside for this statistic even though they are unusable for managed linking. Inspect the exact association instead of treating the count as a conversion tool.

## Bulk Reserve Or Release Addresses

This works inside one subnet; it does not create networks or assign Device identities.

1. In **Manage Subnets**, select the intended network context and **Bulk Edit Range**. Check the dialog's IP Address Block, network and VLAN.
2. Enter **From IP Address** and **To IP Address** as usable addresses in ascending order within that network. The maximum is 512 addresses per operation.
3. Choose **Allocation Status → Reserve unassigned addresses** or **Release unowned allocations**. For reservations, optionally enter **Hostname** and **IPAM Notes**. A host offset is appended to the hostname; non-empty entered notes replace notes on eligible reservations. A release retains other existing address metadata.
4. Select **Preview Changes**. Read the eligible count, sample addresses and protected/skipped count. Gateways, Device primary addresses and conflicting assignments stay protected. Zero eligible changes disables confirmation.
5. Use **Back to editing** to correct the range, or **Apply [number] changes** to save the eligible set together. Reopen the network and check the results. Cancel/close without applying saves nothing.

For example, reserving fictional `192.0.2.40`–`192.0.2.45` with Hostname *training-spare* adds the subnet host offsets (such as *training-spare-40*). Read the preview rather than assuming every address is free. The server rechecks current permissions, conflicts and validity and rolls back the submitted set on rejection. Refresh and preview again after a conflict; the old preview is not a permanent reservation.

## Edit Subnets, Blocks And VLANs

1. Open **Manage Subnets → Edit Subnet** or **Edit Block** for the exact record. Check CIDR and current parent before editing. Existing record kind is fixed; a network cannot be converted into a block by editing it.
2. Change the permitted name, Description, purpose, VLAN, gateway or parent and select **Save Subnet** or **Save IP Address Block**. Reopen and inspect the saved values. Cancel abandons unsaved changes.
3. An existing unclassified subnet may retain **Not assigned (previously recorded)**. A purpose already assigned cannot be cleared. An entered VPN gateway must still be usable; LAN and Management require one.
4. CIDR changes are blocked while dependent Devices/IPAM allocations remain. The form also checks saved basic addresses within the old range, so investigate a refusal even where no managed assignment is shown. Parent changes must preserve strict containment and valid child/ownership relationships.

VLAN IDs are optional integers 1–4094. Zero is not an unassigned VLAN. VLAN identity is scoped by its parent IP Address Block, with all standalone networks sharing the **Unassigned VLAN Domain**. The same number can exist in different block domains, but conflicting reuse inside one domain is rejected. Subnet Save maintains the corresponding VLAN record together with the network. A Device's displayed VLAN follows its subnet. These records document the network; they do not configure a switch or permit overlapping address ranges.

### Review Historical VLAN Ownership

1. In **Manage Subnets**, read **VLAN Ownership Check**. It distinguishes uniquely identified block ownership, valid unassigned-domain records, ambiguous matches and orphaned records.
2. Investigate records matching multiple subnets or no subnet. **Edit VLAN & Subnet** opens a resolvable existing record; it does not create a missing subnet automatically.
3. Only when the check offers **Update VLAN Ownership ([number])** and has no unresolved ambiguous/orphaned matches, review and confirm its proposed update. Cancel leaves ownership unchanged. A conflicting or changed inventory rejects the update.
4. Reopen Manage Subnets and confirm the correct group. An unassigned domain is permitted and need not be put in an invented block.

A linked VLAN cannot be removed independently while a subnet uses it: delete or reassign the subnet association first through the reviewed network workflow. Do not use ownership reconciliation to adopt independent networks silently.

## Delete A Subnet Or Block Safely

Deletion is permanent and can remove active address relationships. It is not a way to release one spare IP.

1. Open the exact **Edit Subnet** or **Edit IP Address Block** dialog and select its **Delete** action.
2. A block with explicitly linked children cannot be deleted until those relationships are resolved. An independent subnet contained in a block is not its child and is preserved if the empty block is deleted.
3. A network with independent allocations, reservations, missing/ambiguous ownership or unsafe dependencies shows a blocked notice. Investigate each listed IPAM record instead of deleting it to force the operation. Even a retained Available record with notes can be a dependency.
4. If the only allocations are matching Device-owned primary addresses, the confirmation lists affected Devices and offers **Move Devices & Delete Subnet**. Here “Move” clears those Devices' active primary IPs, retains the former IP as history metadata and deletes the related active allocations and uniquely linked VLAN. It does not relocate equipment or select replacement addresses. Devices remain in inventory. This established IPAM operation uses IPAM Edit; it does not grant general Device editing.
5. Check every listed effect. Choose **Cancel** if uncertain, or the exact **Delete Subnet**, **Delete IP Address Block** or **Move Devices & Delete Subnet** confirmation only when intended.
6. Reopen the remaining network and Device records to check the outcome. Current permissions, enabled Devices where detachment is needed, dependency sets, VLAN ownership and active Device edits are rechecked. Stale/changed previews or another editor's reservation reject the entire operation; refresh and review again.

Basic Device addresses are not detached by subnet deletion. They remain basic and may then contribute to Basic IPs Outside Subnets. Do not infer that deleting a subnet releases every address recorded elsewhere.

## Common questions

**Why can't I select an IP for a device?** Check that an addressable subnet exists, that the address belongs to it, and that the address isn't reserved or assigned incompatibly.

**Why won't a subnet save?** Check valid CIDR/network address, required name/purpose, gateway requiredness and usable address, optional VLAN range and overlap/duplicate rules. A selected block must contain the generated subnets.

**Why can't I edit from Devices?** Read rights in IPAM do not permit changing IP-related device fields.

Related: [Devices](Devices.md), [Optional Features and Link to IPAM](Optional-Features-and-Link-To-IPAM.md), [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md), [Network Racks](Racks.md).
