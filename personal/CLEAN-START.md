# Personal clean-start change — 2026-10-09

## New installations

The starter inventory now contains **no example devices, subnets, VLANs, racks, rack accessories or IP allocations**. Initial locations are Racked and Unknown.

Default device types:
- Server - Physical
- Server - Virtual
- Desktop, Laptop, Tablet
- Switch, Router, NAS
- Access point
- PDU, UPS, Unknown

The generic Server and AP defaults are removed.

## Simplified device fields

The Manage server functionality and Manage installed software controls are removed from the device-type manager. New device forms no longer include their managed checkbox lists. The underlying compatibility code and previously saved historical detail values remain in place so older NetMini backups can still be read and inspected.

## Existing browser data

This change does **not** clear `netmini_state` or rewrite previously saved inventories on startup. A browser profile already holding NetMini/Caffoot data may still display those records and older custom device types. Export a backup before intentionally resetting any existing inventory. A future explicit migration can rename historical AP entries and handle generic Server values with user confirmation.

## Validation still needed

- Run the Personal standalone build workflow.
- Verify an empty profile opens all tabs without exceptions.
- Create one new physical server, virtual server and access point.
- Check that existing backups load without data loss.
- Confirm the old managed checkboxes are absent from new device forms.
