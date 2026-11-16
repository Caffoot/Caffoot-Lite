# Optional Features, Basic IPv4 And Link To IPAM

> **Draft v2.2 — Not Published / Not Production Guidance.** Batches 3.1–3.7 are merged through PR #388 at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` (schema 16). Batch 3.8 is implemented for review on `feat/it-assets-issue-return-writeoff` (draft PR #389, schema 17); it is not merged or visually accepted. Batch 3.4 native acceptance remains deferred. Use the published v2.1 guides for production. These are not installation, upgrade or restore instructions.

## Optional Sections

An administrator opens **Settings & Data → Optional Features** to enable or disable **Devices**, **IP Address Management**, **Network Racks** or **IT Assets**. Disabling asks for confirmation; Cancel retains the setting. Saved data and permissions are retained and become available again under the same permissions when re-enabled.

A feature switch does not grant access. Each user still needs the relevant Read/Edit permission. Staff Members and Departments are core, not optional switches. Suppliers and Equipment Lifecycle are shown as unavailable future features. **IT Assets** has its own switch under **Additional Features**, disabled by default on fresh installations and upgrades. In the development build, enabling it allows users with the relevant IT Assets permission to use [stock intake](IT-Assets-Stock-Intake.md) and, on the Batch 3.8 review branch, [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md). Canonical Device changes also require independent Devices Edit. The switch grants no permission and does not classify existing Devices as stock. Disabling hides the section and denies stock reads/writes while retaining stock and history; re-enabling restores access subject to existing rights and MFA.

Fresh installations default the optional sections off. The existing-installation schema-13 migration preserves working Devices/IPAM/Racks access by initially enabling those three; subsequent restarts retain saved choices. These facts are not instructions to upgrade a production installation.

## Save A Device Without IPAM

1. With Devices enabled and Devices Edit, open **Devices → Add Device** or an existing Device's Edit form. A Device may be saved without a Primary IP.
2. To begin using an unlinked basic IPv4 address, an administrator disables IPAM and confirms. In **Edit Device → Networking**, enter an unused valid address, for example fictional `192.0.2.10`, then save.
3. Re-enabling IPAM does not create a subnet or allocate the address. A previously basic address remains editable as basic, even after a matching managed subnet exists. Ordinary Save does not link it.

**IPAM → Overview → Basic IPs Outside Subnets** counts basic Device addresses outside existing managed networks, visible only with both Devices and IPAM Read. Basic addresses inside managed networks are not counted by that card. Next-available suggestions avoid basic addresses without treating them as managed allocations.

## Deliberately Link A Saved Basic Address

1. Enable IPAM and obtain both Devices Edit and IPAM Edit. Open **Device Details → Network**, not Edit Device → Networking.
2. Under **Network Identity → IPAM Association**, select **Link to IPAM**.
3. Choose an existing managed subnet containing that exact saved address. For example, fictional `192.0.2.10` could belong to an existing `192.0.2.0/24` subnet.
4. If there is **No suitable existing subnet**, confirmation is disabled. An authorised editor must create the appropriate subnet separately in IPAM, then try again. Nothing is created automatically.
5. Recheck the exact address under **IPAM → IP Addresses**. It must not already be assigned, reserved, a gateway or otherwise conflicting. Select the matching subnet and deliberately confirm **Link to IPAM**.
6. Verify that IPAM shows the address as **Assigned** to the correct Device and that **Device Details → Network** shows the managed association.

Cancel changes nothing. Stale or conflicting requests are rejected without a partial allocation. Existing managed addresses are not automatically converted back to basic. When IPAM is disabled, existing managed relationships are preserved rather than silently removed. Hidden Rack relationships are likewise retained during unrelated permitted Device edits.

[← Draft v2.2 Guides](README.md) · [Published v2.1 Guides](../README.md)
