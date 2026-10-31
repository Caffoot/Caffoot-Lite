# Getting Started with Caffoot Lite

[← All feature guides](README.md)

## Your first visit

The Docker application keeps one shared inventory in its central database. Each person uses their own account; an administrator decides which sections that person may read or edit. There is **no public registration**.

1. Install the application and configure its HTTPS address, certificate and persistent data directory using the [Docker/Portainer guide](../../../next/README.md).
2. On a **new database**, open the configured HTTPS address. Set your own first administrator username and password. There is no hard-coded administrator.
3. Follow the on-screen authenticator setup. Scan the QR code (or enter the displayed secret) into an authenticator app, then confirm the six-digit code.
4. At the **Sign in** form, enter username and password. Enter an authenticator code when the application requests one. Users without required MFA do not see an unnecessary code field before sign-in.
5. After signing in with authorised inventory access, the **Dashboard** gives a summary and links to the familiar inventory areas.

For a self-signed HTTPS certificate, **check the identity and fingerprint before trusting it**. Do not blindly bypass a certificate warning when supplying real credentials.

## Where to find things

- **Dashboard:** inventory overview and convenient shortcuts.
- **Devices:** physical/virtual equipment, network identity, hardware/software details and location.
- **IPAM:** IP Address Blocks, assignable Network/VLAN subnets, individual IP addresses and reservations.
- **Racks:** enclosures, front/rear views, mounted devices, accessories and U positions.
- **Change History:** recent inventory actions and changes.
- **Users:** administrator-managed accounts, MFA state and section permissions.
- **Settings & Data:** administrator-only inventory migration and maintenance.
- **My account:** personal security, appearance settings, Help & Guides and About.

Some entries are hidden or read-only for users without suitable rights. The *Appearance* preference is local to your own browser.

## Worked example — build a small lab inventory

The values below are fictional. Use your own network plan and genuine spare addresses rather than placing these addresses into a real network without checking.

**Example:** *Lab Network* is 192.168.50.0/24, its gateway is 192.168.50.1 and its VLAN is 50. The device is *lab-switch-01* and the enclosure is *Lab Rack*.

1. In **IPAM**, choose **Add Subnet**. Create a **Network / VLAN** with the CIDR, name, VLAN and gateway. Choose **Save Subnet & VLAN**.
2. In **Racks**, choose **Add Network Rack** if the switch will be mounted. Enter the type and measured height/width/depth, then **Save Rack**.
3. In **Devices**, choose **Add Device**. Enter the device name, physical type, status and location.
4. Select an existing subnet and a valid **Primary IP**, for example 192.168.50.10 if it is actually available. If rack-mounted, select the rack, front/rear face, free U position and height.
5. Select **Save Device**. Reopen it to check the details, look at its IP in **IPAM**, and confirm rack occupancy in **Racks**.
6. Open **Change History** to review the saved actions.

See [Devices](Devices.md), [IPAM](IPAM.md) and [Racks](Racks.md) for every step and the safeguards.

## Using Caffoot with colleagues

An administrator creates additional users under **Users**. New users start without inventory access. They may be granted **Read** or **Edit** separately for Devices, IPAM and Racks; editors and administrators must enrol MFA.

A user may view a device that somebody else is editing, but cannot edit it simultaneously. The details screen can name the current editor. Editing different devices in parallel is permitted. Saved changes become visible when users navigate or reopen the records; full browser refreshes are not normally needed.

## Common first questions

**Why can't I add a device?** A primary IP must come from an existing Network/VLAN subnet, and creating a device requires both Devices and IPAM edit rights. Adding it already mounted also requires Racks edit rights.

**Why is Edit disabled?** Check your role, your MFA enrolment and whether somebody else currently holds the device's editing reservation.

**Why isn't a subnet offered?** Record the assignable Network/VLAN under IPAM first; an IP Address Block alone is not the same thing.

**What protects my inventory if the Pi fails?** Your persistent Docker data must be backed up to separate storage. See [Migration, Backup and Restore](Migration-Backup-and-Restore.md).