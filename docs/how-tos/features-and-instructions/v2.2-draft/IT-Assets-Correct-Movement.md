# Correct Stock Movement

> **Draft v2.2 — Unreleased, For Review.** This describes Batch 3.11 in
> [draft PR #392](https://github.com/Caffoot/Caffoot-Lite/pull/392), not the published
> v2.1 application. Merge and release require separate approval.

Use Correct Movement when a receipt, issue, return or write-off quantity was
recorded incorrectly. It keeps the original transaction and adds a dated
correction with your name and explanation.

1. Open **IT → IT Assets → Movement History**.
2. Find the original **Received**, **Issued**, **Returned** or **Written Off**
   entry and choose **Correct Movement**. Scroll the history table horizontally
   on smaller screens to reach Actions. A movement containing several equipment
   entries shows a separate entry reference for each selection.
3. Review **Original Movement Details**, including its original recorded and
   current effective quantities, actor, dates, Supplier and recipient where recorded.
   Earlier corrections appear in **Correction History**.
4. Enter the **Corrected Quantity** as the correct total for that entry. Enter
   a **Reason For Correction** explaining the evidence for the change.
5. Review **Stock Impact Before Saving**. Compare Before and After values for
   held, ready, awaiting checks/preparation, issued and written-off equipment,
   plus the original issue's outstanding quantity where applicable.
6. Choose the orange **Save Correction** action at the bottom when validation
   says **Ready To Save**. The form then shows the saved correction's before/after
   quantities, reason, actor, recorded time and reference. Live stock and
   outstanding assignment quantities reflect the correction.

The quantity must be a changed positive whole number. A receipt cannot be reduced
below equipment already checked or used, an issue cannot fall below its later
returns or write-offs, and a return cannot fall below later preparation or
write-offs. Even if today's total appears sufficient, earlier dependent movements
must remain possible. Individually tracked equipment retains its one permanent
identity; a quantity correction cannot create, remove or replace it.

**Correction Blocked** explains why a change cannot be saved. Correcting a quantity
does not change later transactions to make them fit. If another technician changes
stock or assignment history while the form is open, cancel, reload Movement History
and review a fresh preview before trying again.

**Cancel** or **Escape** leaves the form safely. When fields have changed, choose
**Keep Editing** to retain them or confirm discarding the unsaved changes. Changing
theme preserves your draft. Leaving the page also protects unsaved correction fields.

IT Assets must be enabled and you need effective **IT Assets Edit**. Corrections
involving registered Devices or their explicit accessory assignments also require
**Devices Edit** and Devices enabled. Read-only users may view permitted history
and corrections, but cannot save them. No Access or a disabled feature hides its
records and prevents its requests.

This corrects transaction mistakes. Physical verification and Stocktakes remain
separate future work. Original identities, receipt Supplier provenance and all
subsequent chronological records remain available.
