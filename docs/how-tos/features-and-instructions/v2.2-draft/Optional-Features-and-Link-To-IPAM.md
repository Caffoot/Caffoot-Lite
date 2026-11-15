# Optional Features, Basic IPv4 And Link To IPAM

> **Draft v2.2 — Not Published / Not Production Guidance.** This guide includes the separate Batch 3.6 review branch (schema 16), based on `milestone-1` at `2e6c50ba4777b7500258d2a1a28317764d806020`. Batch 3.6 is not merged or released. Batch 3.4 manual acceptance remains deferred. Use the published v2.1 guides for production; these are not installation, upgrade or restore instructions.

## Optional Sections

An administrator opens **Settings & Data → Optional Features** to enable or disable **Devices**, **IP Address Management**, **Network Racks** or **IT Assets**. Disabling asks for confirmation; Cancel retains the setting. Saved data and permissions are retained and become available again under the same permissions when re-enabled.

A feature switch does not grant access. Each user still needs the relevant Read/Edit permission. Staff Members and Departments are core, not optional switches. Suppliers and Equipment Lifecycle are shown as unavailable future features. On the Batch 3.6 review branch, **IT Assets** has its own switch under **Additional Features**. It is disabled by default on fresh installations and upgrades. Enabling it stores the organisation's choice; stock screens and actions are not available yet. It does not classify existing Devices as stock.

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
