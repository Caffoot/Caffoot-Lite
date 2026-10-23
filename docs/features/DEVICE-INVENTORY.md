# Device inventory

**Published release:** v1.3.0. **Status:** Website reference draft; verify against published UI before publication.

## What it does

Keep a record of network equipment and other devices, including device type, location, relevant hardware information, network details and type-specific software or services.

## What users can do

- Create, view and edit device records.
- Choose device types and locations, with relevant fields shown for the selected type.
- Associate devices with documented IP addresses and, where applicable, network racks.
- Record type-specific software and server service selections.
- Review previous device configurations and selectively restore compatible information.

## Important limitations

Changing device type can make some old details inapplicable. Caffoot Lite has confirmation and history safeguards, but previous configuration restoration only applies fields currently recognised for the destination type. Archived catalogue selections may not be visible in ordinary device details or restored as users expect. These are under investigation, not features to advertise. Device information is documentation, not live discovery or monitoring.

## Suggested website description

**Keep your equipment records together.** Document devices, their locations, network details and relevant hardware or software information in one inventory.

## Screenshot guidance

Use a fictional device list, a device detail view and a type-specific edit form. Do not show real customer addresses or passwords.

**Technical reference:** Device and catalogue workflows in `docs/workflows/TECHNICAL-WORKFLOWS.md`.
