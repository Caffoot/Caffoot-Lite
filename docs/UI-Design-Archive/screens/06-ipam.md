<!-- Snapshot of owner decisions in issue #227, archived 1 November 2026. Main issue remains the living decision register. -->

[Archive Index](../README.md) · [Current owner decisions](https://github.com/Caffoot/Caffoot-Lite/issues/227)

### 6. IPAM — Visual Design Approved ✅

**Product owner approved the corrected IPAM presentation on 1 November 2026:** the new premium Networks & VLANs workspace **combined with the existing v2.0.1-style IP address tiles and host-range tabs**. The initial long scrolling IP-address list was rejected; **do not replace the familiar address grid with that list**.

A clear **Networks & VLANs** main workspace, with separate **IP Addresses** and **Address Blocks** views.

- **Add Network** is the top-right orange primary action; **Add Address Block** is the secondary action.
- Clear directory/details presentation of saved networks, VLANs, CIDR, gateway, parent block, usage and address allocation status.
- **IP Addresses must retain the familiar v2.0.1 tile/grid presentation**, not a tall scrolling row list: selected/active subnet at the top, **host-range tabs** (e.g. .1–.32, .33–.64, etc., plus Show All as supported by the existing app), colour/status distinction for **Available / Assigned / Reserved**, search by IP or device, allocation-status filter, and individually selectable address tiles with existing relevant detail/edit/notes actions. The tile grid should respond to the available browser width; host-range navigation keeps longer subnets manageable. Preserve all current IP address handling and large-subnet behaviour.
- Existing editing, **IPAM Notes**, bulk IP operations and subnet/VLAN/legacy management tools stay findable.
- **All published v2.0.1 IPAM rules remain exactly as they are** — no new gateway/ownership, CIDR, deletion or device-linked-IP behaviour.
