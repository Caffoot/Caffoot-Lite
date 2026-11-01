<!-- Snapshot of owner decisions in issue #227, archived 1 November 2026. Main issue remains the living decision register. -->

[Archive Index](../README.md) · [Current owner decisions](https://github.com/Caffoot/Caffoot-Lite/issues/227)

### 4. Device Details — Visual Design Approved ✅

**Product-owner confirmation (1 November 2026):** The full-page Device Details design is a clear improvement and is approved, particularly the small contextual illustration indicating where a rack-mounted device sits. Keep the already selected layout, rather than inventing a new one.

A **separate full-page Device Details workspace**, not a giant popup.

- Clear device identity/status header with appropriately positioned **Back To Device Inventory**, **View in Rack**, **Duplicate** and **Edit Device** actions.
- Organised, readable sections/tabs as relevant: **Overview, Hardware, Network, Software, Location, History**, plus **Virtual Machines** for applicable physical hosts.
- Show the recorded physical server / virtual machine relationships. **For a rack-mounted device only**, show a small, clear visual rack-location preview using its real saved rack, face and U position where available, so the viewer can recognise where it is installed. Provide the existing **View in Rack** route as appropriate. **For an unracked device or a VM without its own rack placement, do not show a misleading rack drawing**; display its relevant recorded location/host information instead. The illustration is a visual aid, not new rack placement functionality.
- Keep existing conditional device fields, installed/archived software information and the existing **Previous Device Type Details** history. Do not replace those saved snapshots with a different kind of history.
- Viewing is read-only. The existing Edit Device form, device reservation, permissions and Save/Cancel behaviour remain as v2.0.1.
