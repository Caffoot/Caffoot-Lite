# Associated Equipment — Draft v2.2 Instructions

This describes the development branch, not the published v2.1 release.

Open a Device's details and choose **Associated Equipment**. The tab shows
accessories explicitly linked to that Device, their outstanding quantities and
original issues, plus dated association and return/write-off history. Equipment
assigned to the same person or Department is not linked automatically.

With both Devices and IT Assets Edit permission, choose **Add Equipment**:

- **Issue And Associate:** select a Ready stock item and an available whole
  quantity, or select the individually tracked units. Confirm the issue date and
  optional note, then choose Add Equipment. The issue and link save together.
- **Associate Already Issued Equipment:** select an eligible original issue to
  the Device's actual current holder. The outstanding issue is linked without
  another stock issue or deduction.

The current holder is fixed by the Device assignment. Inactive Staff Members and
archived Departments cannot receive new equipment. Ready quantities are checked
for the selected item, including again when saving. Stale selections must be
refreshed. Saving returns you to the Device's Associated Equipment tab.

Use **Return Equipment** for equipment physically handed back and record its
actual checks and dispositions in the existing form. Returned equipment is not
automatically Ready. Original issues and association history remain available.
For a missing issued accessory, choose **Write Off** and select the actual missing
quantity, date and reason. A missing quantity is written off directly from its
original issue; it is never recorded as physically returned or Ready stock.
Individually tracked equipment keeps its one original identity. Physically
returned broken equipment continues through Return Equipment's damage disposition.
Outstanding associated accessories must all be resolved before a prepared Device
can be reissued from physical stock, even if its earlier assignment has closed.
Read-only users cannot add or return equipment. The tab and its records are
unavailable when either required feature or Read permission is missing.

## Reassign A Workstation Directly

1. Resolve **all** explicitly associated outstanding equipment first, including
   equipment linked during a former assignment. Record actual returns through
   Return Equipment; record genuinely missing quantities through Write Off.
   Accessories do not follow the workstation to its next holder.
2. Open **Device Details → Assigned To → Reassign Device** for a currently
   assigned physical Device. The selected Device is fixed on the existing form.
3. Choose a different active Staff Member or non-archived Department, the actual
   **Date Reassigned** and an optional note. The date cannot predate its current
   issue or be in the future.
4. Physically check and prepare the workstation. Tick **Checked Working** and,
   where applicable, **Data Wiped / Reset** only after completing that work.
   These checks start unchecked. Choose **Confirm Ready And Reassign** as the
   final explicit confirmation that the workstation is Ready for its new holder.
5. Check the new current holder and dated **Reassigned** entry in Assignment
   History. The same Device and all former assignments remain recorded.

Cancel or a failed save keeps the old holder. Refresh stale selections before
retrying. Real accessory returns/write-offs recorded earlier remain in history
even if the later workstation handover fails. A hidden or unavailable action
can mean required equipment work or editing permission is missing; switching off
IT Assets never bypasses outstanding accessory resolution.

Direct reassignment needs Devices Edit and remains available for Devices without
stock history when IT Assets is off. A Device with stock history additionally
needs IT Assets enabled and IT Assets Edit. Read-only users cannot reassign.
The handover does not record a storeroom receipt or add Physically Held/Ready
stock. For a registered issued Device, Movement History shows **Reassigned**,
Issued → Issued. Its canonical identity, status, location, racks and network
details remain as recorded. Genuine physical return → preparation → Reissue
Existing Device remains the separate workflow for equipment actually held.

[Final review screenshots and checks](../../../development-handovers/evidence/associated-equipment-final/Report.md)
