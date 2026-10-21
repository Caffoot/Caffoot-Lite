# Caffoot Lite v1.2.1 — Release Notes

**Status:** Published maintenance release.
**Focus:** Legacy backup import compatibility and rack-location display.

## Fixes

- Restore compatibility for older backups containing a Desktop, Laptop or Tablet with the legacy `Racked` location but no rack assignment. Affected records are presented for explicit review before any changes are applied.
- Review eligible legacy computer devices marked `Rack Mounted` without an assigned rack or U position. Proposed corrections are shown before the final restore confirmation.
- Make the compatibility review clearer by showing the current mounting type, location and rack assignment alongside the proposed correction.
- In Device Inventory, correctly rack-mounted devices with an unknown physical room/site location no longer show the misleading red `NEEDS ATTENTION` indicator solely for that reason. Their physical location remains `Unknown`; the rack and U position are preserved.

## Data safety and limitations

- The original JSON backup is not edited. Supported compatibility corrections require explicit approval; the user may cancel.
- Unknown or unsupported mounting values still fail validation. Other integrity checks remain in place, and an invalid import must not replace existing inventory.
- A pre-restore safety snapshot records the **current browser inventory before a successful restore**. If that inventory is empty, the snapshot can correctly contain zero devices; it is not a copy of the imported backup.
- Rack assignment and physical room/site location are distinct. This release does not automatically infer a device's physical location from its rack's location.
- Caffoot Lite remains a local, offline-first browser application. Back up your data before updating; inventory lives in browser storage rather than the HTML file. Moving or renaming the HTML file can affect access to stored inventory.

## Verification

Owner-reported manual regression testing on the maintenance branch confirmed: original v1.1.2 tester backup import with explicit review; cancellation protection; preservation of two devices, IPs and a firewall at rack SV1-NR1 U40–U42; rejection of an invalid mounting value without replacing existing inventory; validation of three compatible desktop backup variants; and updated inventory warning behaviour.

**Pending before publication:** run the final v1.2.1 release pipeline, inspect the generated standalone HTML and ZIP, verify checksums and approve publication. These checks do not constitute a formal security certification.

## Scope

This is a maintenance update based on v1.2.0. Rack Management Modernisation continues separately in v1.3.0.
