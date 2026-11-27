# Batch 7D — Original Requirement And State Mapping

**27 November 2026. 21 original groups, 114 owned specifications and 1 shared references retained.** 36 new images, ceiling 36. Independent review and separate owner visual acceptance pending.

Mappings describe instructional coverage, not exhaustive runtime test results. The [consolidated owner scope](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7217032947) permits accurate written treatment of routine validation, cancellation and repetitive states. Every original contract and variant remains below; a representative image does not claim an unpictured result. Original requirements remain in the [Batch 7 register](../../../../../development-guide/Milestone-01-Batch-7-Review.md#requirement-register).

## B3-D1 — Staff → Departments → Add/Manage

Original contract: Departments Edit; Accounts/Sales, list Active/Archived and 0 Departments, Department Name, Save/Cancel; blank/duplicate name, Archive/Reactivate confirmations, Delete Department unavailable/rejected with history

Written procedure: [Departments-and-Shared-Equipment](../../Departments-and-Shared-Equipment.md#add-a-department).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B3-D1-S01` — Department list and zero state. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Accounts, Sales and IT are independent flat Departments. Membership grants no security role, and Archive preserves current/history associations. | [department-directory](department-directory.png) |
| `B3-D1-S02` — Add/rename. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Accounts has membership/equipment history. The management dialog explains retention; permanent deletion is unavailable where associations must remain. This draft is cancelled. | [department-protected-management](department-protected-management.png) |
| `B3-D1-S03` — Archive/reactivate confirmation. | Written procedure for Archive/reactivate confirmation. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-D1-S04` — Delete protected history. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Accounts has membership/equipment history. The management dialog explains retention; permanent deletion is unavailable where associations must remain. This draft is cancelled. | [department-protected-management](department-protected-management.png) |
| `B3-D1-S05` — Blank/duplicate rejection. | Written procedure for Blank/duplicate rejection. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-D1-S06` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B3-D2 — Staff Members → Priya → Edit → Department

Original contract: Staff Edit; Accounts→Sales / No Department, archived existing membership retained, Save/Cancel; no role change

Written procedure: [Departments-and-Shared-Equipment](../../Departments-and-Shared-Equipment.md#add-change-or-remove-staff-membership).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B3-D2-S01` — Accounts to Sales edit. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Priya’s unsaved Staff edit selects Sales instead of Accounts. Saving membership changes shared visibility but does not assign or move a Device or change her baseline security role. | [priya-department-change](priya-department-change.png) |
| `B3-D2-S02` — No Department. | Written procedure for No Department. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-D2-S03` — Retained archived membership. | Written procedure for Retained archived membership. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-D2-S04` — Saved membership unchanged roles. | Written procedure for Saved membership unchanged roles. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-D2-S05` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B3-D3 — Departments → Accounts → View Details, four tabs

Original contract: Departments Read + independent Staff/Devices/IT Assets Read and features; AC-PRN-01, adapters and retained Left Company member; View Staff Details/View Device; Not Available versus empty, ended Device custody in History

Written procedure: [Departments-and-Shared-Equipment](../../Departments-and-Shared-Equipment.md#department-details--unreleased-v22).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B3-D3-S01` — Overview tab. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Departments Read alone does not disclose Staff or equipment counts. Not Available means missing independent permission, rather than an empty Department. | [department-permission-boundary](department-permission-boundary.png) |
| `B3-D3-S02` — Staff tab. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Authorised Staff Members Read exposes the Department’s current people. Personally held equipment is not the Department’s shared stock. | [department-staff-members](department-staff-members.png) |
| `B3-D3-S03` — Equipment tab. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Accounts shared equipment contains the original AST-PRN-01 assignment. A member’s personally held laptop is not copied into this Department table. | [department-current-equipment](department-current-equipment.png) |
| `B3-D3-S04` — History ended custody. | Written procedure for History ended custody. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-D3-S05` — Permission Not Available. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Departments Read alone does not disclose Staff or equipment counts. Not Available means missing independent permission, rather than an empty Department. | [department-permission-boundary](department-permission-boundary.png) |
| `B3-D3-S06` — Empty panels. | Written procedure for Empty panels. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B3-D4 — Device → Assigned To → Manage Departments then Department Equipment

Original contract: Devices Edit; Accounts/Sales printer, tick/search, Save Changes/Cancel; at least one selection, no current no-op physical transfer; same-tab updated equipment/history after successful save

Written procedure: [Departments-and-Shared-Equipment](../../Departments-and-Shared-Equipment.md#change-which-departments-share-a-device).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B3-D4-S01` — Manage Departments picker. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Manage Departments rejects an empty selection. This is a selection change within the same physical custody, not a return/reissue or transfer of the printer. | [department-selection-protection](department-selection-protection.png) |
| `B3-D4-S02` — No-selection rejection. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Manage Departments rejects an empty selection. This is a selection change within the same physical custody, not a return/reissue or transfer of the printer. | [department-selection-protection](department-selection-protection.png) |
| `B3-D4-S03` — Same custody selection saved. | Written procedure for Same custody selection saved. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-D4-S04` — Refreshed equipment/history. | Written procedure for Refreshed equipment/history. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-D4-S05` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B3-E1 — Staff Details → Assign Equipment; Device → Assigned To → Assign Device

Original contract: Devices Edit, Staff Read for directory route; active Alex and eligible unused AC-LAP-07; Find Existing Devices/selected count/Confirm Assignment/Cancel; recipient kinds and Department checkboxes; stale/reserved/ineligible rejection

Written procedure: [Device-Assignments-and-My-Equipment](../../Device-Assignments-and-My-Equipment.md#assign-from-staff-details).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B3-E1-S01` — Staff assignment picker. | Written procedure for Staff assignment picker. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-E1-S02` — Device assignment recipient picker. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This unsaved assignment selects Accounts for one shared physical printer. Membership affects access, rather than creating another physical issue. A real edit reservation invalidates this initial allocation. The complete selection is rejected; Alex does not receive a partially saved assignment. | [assign-printer-department](assign-printer-department.png) · [initial-allocation-rejected](initial-allocation-rejected.png) |
| `B3-E1-S03` — Selection/confirmation. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This unsaved assignment selects Accounts for one shared physical printer. Membership affects access, rather than creating another physical issue. A real edit reservation invalidates this initial allocation. The complete selection is rejected; Alex does not receive a partially saved assignment. | [assign-printer-department](assign-printer-department.png) · [initial-allocation-rejected](initial-allocation-rejected.png) |
| `B3-E1-S04` — Saved custody/history. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This separate AST-LAP-015 demonstration records a checked direct handover from Alex to Sarah on 27/11. It has no storeroom return and does not replace the AST-LAP-014 return/reissue journey. | [direct-handover-saved](direct-handover-saved.png) |
| `B3-E1-S05` — Stale/reserved/ineligible rejection. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. A real edit reservation invalidates this initial allocation. The complete selection is rejected; Alex does not receive a partially saved assignment. | [initial-allocation-rejected](initial-allocation-rejected.png) |
| `B3-E1-S06` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B3-E2 — Device → Assigned To

Original contract: Devices Read; personal laptop, shared printer and Unassigned example; original Issue/Return-End Date/actor, current versus historical labels; stock details only with IT Assets rights

Written procedure: [Device-Assignments-and-My-Equipment](../../Device-Assignments-and-My-Equipment.md#read-current-assignments-and-history).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B3-E2-S01` — Personal Assigned To. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Devices/IT Assets Read can review AST-LAP-014’s current Sarah custody and earlier Alex history, without assignment, return, write-off or editing controls. Sarah now holds the same AST-LAP-014. Alex’s ended custody and actual return remain in its history; preparation and reissue did not create a replacement identity or restart first service. Saved current custody belongs to Alex. The original Device and assignment history remain the authoritative identity; registration was a different event. | [read-only-current-and-history](read-only-current-and-history.png) · [Shared-7C-same-device-sarah-history](../batch-7c/same-device-sarah-history.png) · [Shared-7C-alex-saved-custody](../batch-7c/alex-saved-custody.png) |
| `B3-E2-S02` — Shared Assigned To. | Written procedure for Shared Assigned To. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B3-E2-S03` — Unassigned. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. AST-LAP-015 is an independent Device with no current holder or physical stock receipt. Initial allocation is available only while it remains eligible. | [unused-device-unassigned](unused-device-unassigned.png) |
| `B3-E2-S04` — Current/history actor and dates. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This separate AST-LAP-015 demonstration records a checked direct handover from Alex to Sarah on 27/11. It has no storeroom return and does not replace the AST-LAP-014 return/reissue journey. Devices/IT Assets Read can review AST-LAP-014’s current Sarah custody and earlier Alex history, without assignment, return, write-off or editing controls. The final Retired Device keeps its identity and Alex/Sarah history. Physical return, damaged write-off and operational Retired are distinct recorded facts; nothing was deleted or generally reactivated. Sarah now holds the same AST-LAP-014. Alex’s ended custody and actual return remain in its history; preparation and reissue did not create a replacement identity or restart first service. | [direct-handover-saved](direct-handover-saved.png) · [read-only-current-and-history](read-only-current-and-history.png) · [final-canonical-custody-history](final-canonical-custody-history.png) · [Shared-7C-same-device-sarah-history](../batch-7c/same-device-sarah-history.png) |
| `B3-E2-S05` — IT Assets-permitted stock details. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Devices/IT Assets Read can review AST-LAP-014’s current Sarah custody and earlier Alex history, without assignment, return, write-off or editing controls. | [read-only-current-and-history](read-only-current-and-history.png) |

## B4-C1 — Circulation: Issue Equipment → Confirm Issue Equipment

Original contract: AE; quantity and individual-unit selections, exact holder/date/note, Back To Edit/Confirm Issue/Cancel; over-Ready and changed stock rejection.

Written procedure: [IT-Assets-Issue-Return-and-Write-Off](../../IT-Assets-Issue-Return-and-Write-Off.md#issue-equipment).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-C1-S01` — Quantity issue draft. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Eight of ten Ready units are proposed for Alex from a separate twenty-keyboard demonstration receipt. Nothing is issued until the confirmation succeeds. | [quantity-issue-draft](quantity-issue-draft.png) |
| `B4-C1-S02` — Individual selection draft. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. An individually tracked mouse is selected by its own identity. This draft is cancelled, so it does not add another issue to the connected journey. | [individual-issue-selection](individual-issue-selection.png) |
| `B4-C1-S03` — Issue confirmation. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Confirm Issue Equipment retains the exact equipment, quantity and recipient. Back To Edit returns to the draft; Cancel records no issue. | [quantity-issue-confirmation](quantity-issue-confirmation.png) |
| `B4-C1-S04` — Back To Edit/Cancel. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Confirm Issue Equipment retains the exact equipment, quantity and recipient. Back To Edit returns to the draft; Cancel records no issue. | [quantity-issue-confirmation](quantity-issue-confirmation.png) |
| `B4-C1-S05` — Confirmed issue result. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The original twenty-unit receipt and both attributed corrections remain. Its effective quantity is ten; prior issue/return facts and physical Device identities are preserved. | [correction-attributed-history](correction-attributed-history.png) |
| `B4-C1-S06` — Over-Ready/stale rejection. | Written procedure for Over-Ready/stale rejection. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-C2 — Circulation: Return Equipment

Original contract: AE; original quantity issue, 5 returned/3 Ready/2 damaged, remainder, checks/reason, Record Return/Cancel; over-return and sum rejection.

Written procedure: [IT-Assets-Issue-Return-and-Write-Off](../../IT-Assets-Issue-Return-and-Write-Off.md#return-equipment).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-C2-S01` — Original issue return form. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The laptop’s real physical return closes Alex’s original custody and enters Awaiting Preparation with Ready zero. It is not a mere unassignment. Return five against the original issue: three checked Ready and two damaged/written off. The other three stay outstanding with Alex. This is the unsaved disposition. | [canonical-device-return](canonical-device-return.png) · [partial-return-five-three-two](partial-return-five-three-two.png) |
| `B4-C2-S02` — 5 returned/3 Ready/2 damaged preview. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Return five against the original issue: three checked Ready and two damaged/written off. The other three stay outstanding with Alex. This is the unsaved disposition. | [partial-return-five-three-two](partial-return-five-three-two.png) |
| `B4-C2-S03` — Recorded partial return/remainder. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The original twenty-unit receipt and both attributed corrections remain. Its effective quantity is ten; prior issue/return facts and physical Device identities are preserved. | [correction-attributed-history](correction-attributed-history.png) |
| `B4-C2-S04` — Over-return/sum rejection. | Written procedure for Over-return/sum rejection. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-C2-S05` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-C3 — Circulation: Device Assigned To → Return Equipment / preparation

Original contract: AE+DE; unassigned no-history fixed Device/one/Awaiting Preparation/physical statement, future return rejection; held Device Prepare Returned Equipment/Date Checked/checks/Mark Ready.

Written procedure: [IT-Assets-Issue-Return-and-Write-Off](../../IT-Assets-Issue-Return-and-Write-Off.md#return-a-currently-unassigned-device).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-C3-S01` — Unassigned fixed Device return. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This existing unassigned Device has no recorded issue to close. Its fixed one-unit physical return would enter Awaiting Preparation; a future return is rejected and records nothing. | [unassigned-return-physical-protection](unassigned-return-physical-protection.png) |
| `B4-C3-S02` — Future return rejection. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This existing unassigned Device has no recorded issue to close. Its fixed one-unit physical return would enter Awaiting Preparation; a future return is rejected and records nothing. | [unassigned-return-physical-protection](unassigned-return-physical-protection.png) |
| `B4-C3-S03` — Awaiting Preparation result. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The returned registered Device cannot be made Ready by increasing the stock item’s receipt-readiness total. Its own Prepare Returned Equipment checks are required; this out-of-range draft is discarded. | [Shared-7C-returned-device-readiness-protection](../batch-7c/returned-device-readiness-protection.png) |
| `B4-C3-S04` — Prepare Returned Equipment. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The original laptop is checked working and its data wiped/reset before becoming Ready. Preparation changes readiness without adding another held unit or new Device. | [returned-device-preparation](returned-device-preparation.png) |
| `B4-C3-S05` — Mark Ready result. | Written procedure for Mark Ready result. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-C3-S06` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-C4 — Circulation: Write Off → Movement History

Original contract: AE(+DE for Device); held/issued/missing Device and accessory, state/qty/date/reason/Record Write Off; excess/blank reason; preserved identity/history.

Written procedure: [IT-Assets-Issue-Return-and-Write-Off](../../IT-Assets-Issue-Return-and-Write-Off.md#write-off-equipment).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-C4-S01` — Held write-off. | Written procedure for Held write-off. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-C4-S02` — Issued/missing Device write-off. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. AST-LAP-014 physically returns damaged: returned one, Ready zero and damaged/write-off one. This actual return/disposition closes Sarah’s custody and adds no usable held laptop; a genuinely missing Device would use the separate Write Off route. | [damaged-canonical-return](damaged-canonical-return.png) |
| `B4-C4-S03` — Accessory write-off. | Written procedure for Accessory write-off. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-C4-S04` — Excess/blank-reason rejection. | Written procedure for Excess/blank-reason rejection. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-C4-S05` — Saved identity/history. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The final Retired Device keeps its identity and Alex/Sarah history. Physical return, damaged write-off and operational Retired are distinct recorded facts; nothing was deleted or generally reactivated. | [final-canonical-custody-history](final-canonical-custody-history.png) |
| `B4-C4-S06` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-E1 — Associations: Device → Associated Equipment → Add Equipment

Original contract: DE+AE; current Alex custody, Ready stock/individual units and Issue And Associate, fixed holder/date/note/Add Equipment/Cancel; missing current holder/stock rejection.

Written procedure: [Associated-Equipment](../../Associated-Equipment.md#issue-and-associate-ready-equipment).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-E1-S01` — Add Ready equipment fixed Alex holder. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Issue And Associate will give one Ready mouse to the laptop’s existing Alex custody. The holder is derived from that custody and cannot be freely changed here. | [associate-mouse-draft](associate-mouse-draft.png) |
| `B4-E1-S02` — Individual units. | Written procedure for Individual units. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-E1-S03` — Issue And Associate result. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The mouse issue is now explicitly linked to this Device custody. It is not inferred from the same holder, name or purchase. | [associated-mouse-saved](associated-mouse-saved.png) |
| `B4-E1-S04` — No holder/stock rejection. | Written procedure for No holder/stock rejection. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-E1-S05` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-E2 — Associations: Associate Already Issued Equipment / Association History

Original contract: DE+AE; whole original outstanding issue, no stock deduction; wrong-holder/already-linked/No Eligible Issued Equipment; former unresolved accessory return/write-off.

Written procedure: [Associated-Equipment](../../Associated-Equipment.md#associate-already-issued-equipment).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-E2-S01` — Eligible outstanding issue picker. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Associate Already Issued Equipment links the entire two-keyboard outstanding issue for Sarah’s AST-LAP-015 custody. It does not issue stock or deduct quantity again. | [associate-entire-existing-issue](associate-entire-existing-issue.png) |
| `B4-E2-S02` — Linked once without stock deduction. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Associate Already Issued Equipment links the entire two-keyboard outstanding issue for Sarah’s AST-LAP-015 custody. It does not issue stock or deduct quantity again. | [associate-entire-existing-issue](associate-entire-existing-issue.png) |
| `B4-E2-S03` — Association History. | Written procedure for Association History. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-E2-S04` — Wrong holder/already linked/none eligible. | Written procedure for Wrong holder/already linked/none eligible. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-E2-S05` — Former accessory return/write-off. | Written procedure for Former accessory return/write-off. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-E3 — Associations: Assigned To → Reassign Device

Original contract: DE, plus AE for recorded stock; Sarah/new Department, old holder omitted, changed shared selection, unchecked preparation, Confirm Ready And Reassign/Cancel; accessory/stale/unchanged/date rejection.

Written procedure: [Associated-Equipment](../../Associated-Equipment.md#reassign-a-workstation-directly).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-E3-S01` — New personal holder handover. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This separate direct-handover draft leaves Sarah as current holder until the complete save succeeds. Working and data-preparation checks are mandatory. It is cancelled, so no new handover is recorded. | [direct-handover-checks](direct-handover-checks.png) |
| `B4-E3-S02` — Changed shared selection handover. | Written procedure for Changed shared selection handover. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-E3-S03` — Required preparation unchecked. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This separate direct-handover draft leaves Sarah as current holder until the complete save succeeds. Working and data-preparation checks are mandatory. It is cancelled, so no new handover is recorded. | [direct-handover-checks](direct-handover-checks.png) |
| `B4-E3-S04` — Confirmed handover result. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This separate AST-LAP-015 demonstration records a checked direct handover from Alex to Sarah on 27/11. It has no storeroom return and does not replace the AST-LAP-014 return/reissue journey. | [direct-handover-saved](direct-handover-saved.png) |
| `B4-E3-S05` — Accessory/stale/unchanged/date rejection. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Alex still holds the laptop. Outstanding associated equipment prevents direct reassignment until each accessory is resolved; changing a person’s Department does not resolve it. | [handover-blocked-by-accessory](handover-blocked-by-accessory.png) |
| `B4-E3-S06` — Cancel unchanged. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. This separate direct-handover draft leaves Sarah as current holder until the complete save succeeds. Working and data-preparation checks are mandatory. It is cancelled, so no new handover is recorded. | [direct-handover-checks](direct-handover-checks.png) |

## B4-F1 — Correction: Movement History → Correct Movement

Original contract: AE(+DE for linked records); original receipt20/effective20→10, reason, before/after, Ready To Save/Save Correction/Cancel and history.

Written procedure: [IT-Assets-Correct-Movement](../../IT-Assets-Correct-Movement.md#preview-and-save-a-correction).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-F1-S01` — Original20/effective20 correction. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The original receipt remains twenty. This preview proposes effective quantity ten with a reason and before/after balances; Save Correction is still required. | [correction-twenty-to-ten](correction-twenty-to-ten.png) |
| `B4-F1-S02` — 20 to10 preview Ready To Save. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The original receipt remains twenty. This preview proposes effective quantity ten with a reason and before/after balances; Save Correction is still required. | [correction-twenty-to-ten](correction-twenty-to-ten.png) |
| `B4-F1-S03` — Saved attributed history. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The original twenty-unit receipt and both attributed corrections remain. Its effective quantity is ten; prior issue/return facts and physical Device identities are preserved. | [correction-attributed-history](correction-attributed-history.png) |
| `B4-F1-S04` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-F2 — Correction: blocked preview

Original contract: AE(+DE); zero/decimal/no-change/missing reason, later issue dependency, individual Device quantity and stale-version rejection.

Written procedure: [IT-Assets-Correct-Movement](../../IT-Assets-Correct-Movement.md#why-a-correction-may-be-blocked).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-F2-S01` — Invalid quantity/no-change/reason. | Written procedure for Invalid quantity/no-change/reason. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-F2-S02` — Later dependency blocked. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Five would contradict later issue/return history, so the correction is blocked. Do not invent a compensating receipt or delete the original movement. | [correction-dependent-history-blocked](correction-dependent-history-blocked.png) |
| `B4-F2-S03` — Individual identity protected. | Written procedure for Individual identity protected. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-F2-S04` — Stale version rejection. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. A separately saved interim correction invalidates the earlier preview. The stale Save Correction is rejected and the user must review the refreshed history. | [correction-stale-rejected](correction-stale-rejected.png) |

## B4-F3 — Correction: Return Equipment → Correct Movement → return draft

Original contract: AE(+DE); entered return fields retained, corrected original refreshed; Save Correction/Cancel/Escape, failed reload/excess retained amount and Reload Stock.

Written procedure: [IT-Assets-Correct-Movement](../../IT-Assets-Correct-Movement.md#correct-an-issue-while-returning-equipment).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-F3-S01` — Return draft before correction. | Written procedure for Return draft before correction. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-F3-S02` — Correction Save/Cancel/Escape. | Written procedure for Correction Save/Cancel/Escape. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-F3-S03` — Retained refreshed return draft. | Written procedure for Retained refreshed return draft. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-F3-S04` — Excess retained amount. | Written procedure for Excess retained amount. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-F3-S05` — Reload failure and Reload Stock. | Written procedure for Reload failure and Reload Stock. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-J1 — Lifecycle: Device Details/Edit → Hardware

Original contract: DR then DE, Lifecycle on; four optional dates, Suggestion/Use Suggestion, calculated/manual/Use Calculated Date, Save/Cancel; invalid leap/future purchase/service, missing dates.

Written procedure: [Equipment-Lifecycle](../../Equipment-Lifecycle.md#review-or-update-a-device).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-J1-S01` — Read Hardware dates. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Saved AST-LAP-014 dates retain first service 05/11/2026 after reissue. Purchase 03/11 and warranty 15/12 are evidenced fictional dates; the Laptop lifespan calculates replacement in 2029 rather than restarting at Sarah’s issue. | [lifecycle-saved-first-service](lifecycle-saved-first-service.png) |
| `B4-J1-S02` — Edit four dates. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Purchase and evidenced Warranty Expiry are proposed alongside the retained first-service date. A manual replacement override is shown as an unsaved example, then cleared before saving the calculated-date journey. | [lifecycle-date-editor](lifecycle-date-editor.png) |
| `B4-J1-S03` — Suggestion/Use Suggestion. | Written procedure for Suggestion/Use Suggestion. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-J1-S04` — Manual/calculated override. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Purchase and evidenced Warranty Expiry are proposed alongside the retained first-service date. A manual replacement override is shown as an unsaved example, then cleared before saving the calculated-date journey. | [lifecycle-date-editor](lifecycle-date-editor.png) |
| `B4-J1-S05` — Saved/cleared date result. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Saved AST-LAP-014 dates retain first service 05/11/2026 after reissue. Purchase 03/11 and warranty 15/12 are evidenced fictional dates; the Laptop lifespan calculates replacement in 2029 rather than restarting at Sarah’s issue. | [lifecycle-saved-first-service](lifecycle-saved-first-service.png) |
| `B4-J1-S06` — Invalid leap/future/missing. | Written procedure for Invalid leap/future/missing. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-J1-S07` — Cancel unchanged. | Written procedure for Cancel unchanged. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-J2 — Lifecycle: Settings & Data → Optional Features → Lifecycle Settings

Original contract: A; 90/90 then 0/3650, lifespan1–100/blank/custom/archived, Save Settings/Cancel/Back; fractional/101/stale rejection.

Written procedure: [Equipment-Lifecycle](../../Equipment-Lifecycle.md#enable-and-configure-equipment-lifecycle).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-J2-S01` — Defaults90/90. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Administrator settings keep independent default 90-day warning periods and per-type lifespans. A blank lifespan is different from a numeric year count. This view makes no settings change. | [lifecycle-settings](lifecycle-settings.png) |
| `B4-J2-S02` — Limits0/3650. | Written procedure for Limits0/3650. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-J2-S03` — Lifespan1 to100/blank/custom/archived. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Administrator settings keep independent default 90-day warning periods and per-type lifespans. A blank lifespan is different from a numeric year count. This view makes no settings change. | [lifecycle-settings](lifecycle-settings.png) |
| `B4-J2-S04` — Saved settings. | Written procedure for Saved settings. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-J2-S05` — Fraction/101/stale rejection. | Written procedure for Fraction/101/stale rejection. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-J2-S06` — Cancel/Back. | Written procedure for Cancel/Back. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-J3 — Lifecycle: IT → Lifecycle

Original contract: DR with Lifecycle; past/today/90/91-day examples, search/type/Attention/Clear/Include Retired/Hardware drill-down; Retired historical excluded from counters and No Devices match.

Written procedure: [Equipment-Lifecycle](../../Equipment-Lifecycle.md#use-the-it-dashboard).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-J3-S01` — Past/today/90/91 counters. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Named warranty examples distinguish yesterday, today, day 90 and day 91 under the 90-day rule. Include Retired with All Conditions retains AST-LAP-014 and its 15/12 warranty for historical review, while Retired Devices stay outside the four active counters. | [lifecycle-boundaries-and-retired](lifecycle-boundaries-and-retired.png) |
| `B4-J3-S02` — Search/type/Attention. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Named warranty examples distinguish yesterday, today, day 90 and day 91 under the 90-day rule. Include Retired with All Conditions retains AST-LAP-014 and its 15/12 warranty for historical review, while Retired Devices stay outside the four active counters. | [lifecycle-boundaries-and-retired](lifecycle-boundaries-and-retired.png) |
| `B4-J3-S03` — Include Retired history excluded from counters. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Named warranty examples distinguish yesterday, today, day 90 and day 91 under the 90-day rule. Include Retired with All Conditions retains AST-LAP-014 and its 15/12 warranty for historical review, while Retired Devices stay outside the four active counters. | [lifecycle-boundaries-and-retired](lifecycle-boundaries-and-retired.png) |
| `B4-J3-S04` — Hardware drill-down. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Named warranty examples distinguish yesterday, today, day 90 and day 91 under the 90-day rule. Include Retired with All Conditions retains AST-LAP-014 and its 15/12 warranty for historical review, while Retired Devices stay outside the four active counters. | [lifecycle-boundaries-and-retired](lifecycle-boundaries-and-retired.png) |
| `B4-J3-S05` — No matches/Clear. | Written procedure for No matches/Clear. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |

## B4-J4 — Lifecycle: Device Types → Manage Device Types / first issue

Original contract: DE type archive/unarchive/rename with retained lifespan; DE+AE qualifying first issue with Lifecycle off, date later visible; reject future first capture and no inference for legacy/later reissue.

Written procedure: [Equipment-Lifecycle](../../Equipment-Lifecycle.md#record-first-service-from-stock).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-J4-S01` — Archive/unarchive/rename type. | Written procedure for Archive/unarchive/rename type. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-J4-S02` — Retained lifespan. | Written procedure for Retained lifespan. No separate screenshot of this variant and no new runtime-pass claim; retain all prerequisites, rejection, cancellation and result instructions in the linked guide. | Written instructions |
| `B4-J4-S03` — Lifecycle-off qualifying first issue. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. With Lifecycle disabled, the qualifying first issue still rejects a future first-service date. No custody or first-service save occurred from this rejected proposal. After the valid first issue to Priya was saved while Lifecycle was off, re-enabling it reveals Original In Service Date 27/11/2026. This is the distinct AST-LAP-016 example. | [first-service-future-rejected-while-off](first-service-future-rejected-while-off.png) · [first-service-visible-after-reenable](first-service-visible-after-reenable.png) |
| `B4-J4-S04` — Later visible service date. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Saved AST-LAP-014 dates retain first service 05/11/2026 after reissue. Purchase 03/11 and warranty 15/12 are evidenced fictional dates; the Laptop lifespan calculates replacement in 2029 rather than restarting at Sarah’s issue. After the valid first issue to Priya was saved while Lifecycle was off, re-enabling it reveals Original In Service Date 27/11/2026. This is the distinct AST-LAP-016 example. | [lifecycle-saved-first-service](lifecycle-saved-first-service.png) · [first-service-visible-after-reenable](first-service-visible-after-reenable.png) |
| `B4-J4-S05` — Future first-capture rejection. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. With Lifecycle disabled, the qualifying first issue still rejects a future first-service date. No custody or first-service save occurred from this rejected proposal. | [first-service-future-rejected-while-off](first-service-future-rejected-while-off.png) |
| `B4-J4-S06` — Legacy/reissue no inference. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Saved AST-LAP-014 dates retain first service 05/11/2026 after reissue. Purchase 03/11 and warranty 15/12 are evidenced fictional dates; the Laptop lifespan calculates replacement in 2029 rather than restarting at Sarah’s issue. | [lifecycle-saved-first-service](lifecycle-saved-first-service.png) |

## B4-K2 — Journey: same laptop return/preparation/Sarah/lifecycle/write-off

Original contract: DE+AE then DR and authorised Retired edit; resolved accessories, same ID, dated assignment/movement records, warranty warning and final damaged disposition retained.

Written procedure: [Connected-Equipment-Journey](../../Connected-Equipment-Journey.md#6-return-and-reissue-or-hand-over-directly).

| Original specification | Instructional disposition and illustration limit | Image references |
| --- | --- | --- |
| `B4-K2-S01` — Return/preparation same laptop. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The laptop’s real physical return closes Alex’s original custody and enters Awaiting Preparation with Ready zero. It is not a mere unassignment. The original laptop is checked working and its data wiped/reset before becoming Ready. Preparation changes readiness without adding another held unit or new Device. | [canonical-device-return](canonical-device-return.png) · [returned-device-preparation](returned-device-preparation.png) |
| `B4-K2-S02` — Sarah reissue. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Sarah now holds the same AST-LAP-014. Alex’s ended custody and actual return remain in its history; preparation and reissue did not create a replacement identity or restart first service. | [Shared-7C-same-device-sarah-history](../batch-7c/same-device-sarah-history.png) |
| `B4-K2-S03` — Hardware lifecycle dates. Shared canonical reference: `B4-J1-S01`. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Saved AST-LAP-014 dates retain first service 05/11/2026 after reissue. Purchase 03/11 and warranty 15/12 are evidenced fictional dates; the Laptop lifespan calculates replacement in 2029 rather than restarting at Sarah’s issue. | [lifecycle-saved-first-service](lifecycle-saved-first-service.png) |
| `B4-K2-S04` — Warranty warning. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. Named warranty examples distinguish yesterday, today, day 90 and day 91 under the 90-day rule. Include Retired with All Conditions retains AST-LAP-014 and its 15/12 warranty for historical review, while Retired Devices stay outside the four active counters. | [lifecycle-boundaries-and-retired](lifecycle-boundaries-and-retired.png) |
| `B4-K2-S05` — Damaged write-off. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. AST-LAP-014 physically returns damaged: returned one, Ready zero and damaged/write-off one. This actual return/disposition closes Sarah’s custody and adds no usable held laptop; a genuinely missing Device would use the separate Write Off route. | [damaged-canonical-return](damaged-canonical-return.png) |
| `B4-K2-S06` — Final assignment/movement history. | Illustrated directly or by the precisely bounded representative caption below; other variants in the original contract retain the linked written procedure. The final Retired Device keeps its identity and Alex/Sarah history. Physical return, damaged write-off and operational Retired are distinct recorded facts; nothing was deleted or generally reactivated. | [final-canonical-custody-history](final-canonical-custody-history.png) |
