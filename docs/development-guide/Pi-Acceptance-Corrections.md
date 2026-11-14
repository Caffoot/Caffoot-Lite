# Raspberry Pi Acceptance Corrections

This unpublished v2.2 correction batch follows the [four approved acceptance findings](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6874767163). The twelve pinned v2.1 design sources remain unchanged.

Dashboard relationship diagnostics now require effective Read access to every collection involved. Hidden collections are not treated as missing records. Unavailable cards, counts, empty messages, report sections and destination actions are removed using existing components. Full-access integrity validation remains strict; no backend projection, role or stored data changes are made. Basic unlinked addresses are not reported as broken managed links.

Validation errors use the existing bottom-right notification as well as the existing inline feedback. Error notices immediately take their layer above modal and nested dialogs while retaining the existing slide/opacity animation. Native errors are grouped per submission and focus the first invalid field; Device validation retains its existing tab selection, highlighting and accessible summary. Success presentation and wording are retained. This is the explicitly approved exception to #327's earlier inline-only decision.

A deliberate Rack or Shelf selection can default Edit Device Location from the Rack's saved room, including rooms absent from managed Device choices. Opening, restoring a saved draft, changing tabs and unrelated edits do not trigger Edit defaulting. A manual Location selection prevents later defaults. Racks-off and read-only controls retain their earlier safeguards; no room or Rack record is created or changed.

Device Details uses neutral current-access wording when Rack information is inaccessible. With effective Rack Read, existing shelf details and genuine missing-association diagnostics remain available.

`tests/pi-acceptance-corrections.cjs` exercises the real HTTPS application with fictional data: feature/read combinations, genuine diagnostics, location selection/manual/Cancel behaviour, native and application validation and modal paint order. Existing focused Python tests cover API permission boundaries and Rack data preservation. The active handover records actual results and remaining native Pi/Safari acceptance.
