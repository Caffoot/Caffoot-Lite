# Read The Audit Trail

> **Current status — 27 November 2026:** Batches 7C, 7D and 7E have separate owner draft-evidence acceptance (41/36/25 new paths; 102 combined; 7E has 23 distinct image contents). Original captures, provenance and requirement mappings remain unchanged; accepted instructions retain the approved merged corrections. Batch 8 editorial findings and publication approval remain outstanding. The exact approved application baseline is now `0251b43a3b5d41d626aa022c6d7f9b4d860433da`, schema 31. 7F/7G are authorised but blocked here by unavailable retained fixtures; no new pack has been delivered. [Current reconciliation and retained editorial limits](../../../development-guide/Milestone-01-7F-7G-Reconciliation.md). Earlier capture-time status notices are historical; publication remains unauthorised.

> **Draft v2.2 — Unreleased.** The integrated schema-31 baseline includes [#458](https://github.com/Caffoot/Caffoot-Lite/issues/458), merged [PR #466](https://github.com/Caffoot/Caffoot-Lite/pull/466) and the later known-feature label correction in [PR #470](https://github.com/Caffoot/Caffoot-Lite/pull/470). Its written/source documentation is owner accepted; desktop visual and publication approval remain outstanding. Examples and screenshots use fictional data.

> **Written/source reconciliation:** Documentation Batch 5, application baseline `fdc677920bfc52f48f641b3d6d1344c902a6a9b0` (schema 31). Focused independent reviews are recorded and [owner written/source acceptance of Batches 1–6](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7200681167) is recorded. Current visual/privacy/caption/alt approval remains outstanding; [Batch 7 reconciliation and proposed capture packs](../../../development-guide/Milestone-01-Batch-7-Review.md) await independent review and owner acceptance. Capture scope and method need separate authorisation. Desktop capture remains deferred; existing historical/mobile images retain their original provenance. [Source review and exact screenshot requirements](../../../development-guide/Milestone-01-Batch-5-Review.md).
> **Draft v2.2 — Unreleased.** Stage 6.6 Batch 2 [#458](https://github.com/Caffoot/Caffoot-Lite/issues/458), with Milestone 01 correction [#477](https://github.com/Caffoot/Caffoot-Lite/issues/477) ([PR #490](https://github.com/Caffoot/Caffoot-Lite/pull/490)). Revised desktop Activity Details screenshots accepted; consolidated native reacceptance and publication approval remain outstanding. Examples and screenshots use fictional data.

The Audit Trail helps you establish what changed, who performed the recorded action and when. An affected-record name describes the record at the time of the saved event, not necessarily its current name. This is a read-only view: searching, opening details or viewing a timeline does not edit the original events.

## Before you start

Sign in using an active account and complete any required MFA. An administrator with confirmed MFA retains essential administration/security history even with optional inventory features off. Other readers need effective Read access to an enabled Devices, IPAM, Racks, IT Assets or Suppliers section; their events remain permission-filtered. Staff directory or employee ticket eligibility alone does not grant the general Audit Trail. Open **Audit Trail** from the existing navigation if your account has access. Your administrator controls the section permissions and optional features that determine which events are available. The change to labels does not grant any new history rights. Some details and complete events may be withheld, including Device-linked stock events when Devices access is unavailable. A missing event or area is not evidence that no change occurred.

## Find an event

1. Open **All Activity**. The list shows authorised saved changes, newest first, with UTC timestamps, recorded actors, actions and affected records.
2. Enter a name, original reference, actor or event wording in **Search actor, record or event**.
3. Select **Area**, **Action** or **Performed by** to narrow the results. The Area choices reflect visible saved history. Staff Member and Department changes appear under Staff; role changes under Users. The Service Desk area covers the existing Clean Start ticket-data summary if visible to you, not ticket conversations.
4. Select **Clear filters** to return to the unfiltered list. If no events match, revise or clear the filters.

For example, a Staff Member named Casey Reed may later be renamed Casey Morgan. The older saved event remains Casey Reed if that name was captured, while the subsequent event displays Casey Morgan. Searching for the original name can still find the earlier recorded change.

## Understand the affected record

Select **View Details** beside an event. The dialogue retains the original actor, UTC time, result, reason and available field changes, and shows:

- **Displayed record:** the name or original reference used in the list.
- **Recorded field changes:** understandable field labels and genuinely different recorded values. A missing value is **Not recorded**; an explicit null or empty value is identified separately, unless the event's known meaning establishes **Not assigned**. If a before-and-after pair is not available, the saved field names describe the event without claiming an exact difference. **No paired before-and-after values are available for this event** means the values are not available in your view; they may not have been recorded or may be withheld by your permissions.
- **Technical Details:** expand to inspect the **Internal Record ID**, **Record Name Source**, **Original recorded label**, original field names and raw values (including unchanged context). This is collapsed initially. It contains only information already available to your account. A recorded ID alone does not prove continuity across replacement or reset.

### Supplier association changes

For equipment Supplier association events, the **Supplier** row combines the recorded reference and name where supported. A Device with no linked Supplier and an explicitly empty recorded Supplier name is **Not assigned**. A recorded free-text name is shown as entered. A receipt's Supplier association concerns its linked Supplier, not the original receipt text.

New association events record the linked company's bounded name at the time of that change, if available. The previous company's name describes the company at the time of this change, not necessarily its name when first assigned. Subsequent renaming or disabling does not rewrite an earlier event. Older events with only a numeric reference show **Historical name not recorded (Supplier reference …)**, not today's company name. A name unavailable to your account is shown as **Historical name not available**. Technical Details retains the original references and permitted recorded values. No new Supplier name is disclosed to accounts without Suppliers access; other existing permission and redaction rules remain unchanged.

For example, a Device is linked to fictional supplier Northlight Ltd. The new event records that name. If the company later becomes Northlight Services, the first event still displays Northlight Ltd; a subsequent association change may record Northlight Services as the previous company at that later event. Older ID-only events cannot be reconstructed from the current directory.

Older Staff records may contain only an internal identifier. That is not a fault in the current Staff directory. The Audit Trail cannot reconstruct an unrecorded name using today's record, and does not guess. Older Department names can be shown from trustworthy saved event values, including a deleted Department's recorded name. Use **Close** or Escape to return to the event list without changing history.

## Follow history by record

1. Open **Asset History**.
2. Enter a saved name or canonical reference in **Find a record**. Earlier recorded names can match the history.
3. Select the record in the list. The timeline shows its saved changes and the name attached to each event; **View event details** opens the same detail dialogue.
4. Where identity continuity is verified, the group uses the latest recorded label. Distinct people with the same name are not joined. Where continuity cannot be established, a change is shown independently with **Identity not verified** and **No verified link to other events**. Reused inventory or movement identifiers, imported inventory and Clean Start are reasons to avoid treating an identical identifier as proof of the same historical record.

## Optional Feature Names

For optional-feature setting changes, the affected record displays **IT Assets**, **Equipment Lifecycle** or **Suppliers** for the saved identifiers `it_assets`, `equipment_lifecycle` and `suppliers`. A friendly name recorded with the event takes precedence. When a name is supplied only by this display mapping, **Record Name Source** in Technical Details explains that it is a friendly name for the recorded identifier.

Open **View Details**, then expand **Technical Details** to inspect **Original recorded label**, any recorded Internal Record ID and the original before/after values. Searching still matches the original identifier. Unknown identifiers and unrelated events retain their existing presentation. The display does not rewrite historical records or change JSON export.

## Check Recording Coverage

1. Open **Recording Coverage**. Read its retention and permission explanation. History has no automatic expiry and the Audit Trail offers no delete/purge control.
2. Use the following source-checked boundaries for this integrated baseline. The panel's account/security rows still say **In development**; those broad labels are not a complete list of the specific writers already implemented.

   | Recorded area | Scope and limits |
   | --- | --- |
   | Inventory | Saved Device, IPAM, Rack/accessory and catalogue changes; supported imports, Clean Start and integrity repairs. Older events can lack actors or complete before/after values; large changes may retain a summary rather than every individual field. |
   | People and access | Staff and Department changes; implemented account creation/status, role/permission and employment/login changes. Access to private administration events is restricted. |
   | Equipment and Suppliers | Implemented custody/Department relationship, stock/movement/correction, Supplier and lifecycle writers, subject to feature and equipment permissions. Not every record shares a provable lifetime identity. |
   | Settings and security | Implemented calendar/category, template draft/publish/default-load, branding and SMTP save/test events; implemented password, MFA enrolment/removal, recovery and blocked-sign-in events. Passwords, authenticator secrets and verification/recovery codes are not recorded as event contents. |

3. Use **All Activity → View Details** to inspect what the individual event actually retained. A saved label or summary does not establish that every action was recorded. Do not assume every successful/failed sign-in, page view, download or JSON export has a matching event; the interface does not promise comprehensive access logging.
4. For a ticket's conversation, use its authorised **Overview**, **Updates** and **History** in the Service Desk. Ticket messages, internal notes, attachments, assignment/status changes and resolution attempts have their own ticket records. They are not copied wholesale into application Audit Trail. Central calendar/template administration and the retained Clean Start summary are separate recorded events.

## Export and recording coverage

1. Review the scope above, then select **Export History (JSON)**. It downloads the loaded authorised history, not just rows matching your current search/filter.
2. Store it in an approved restricted location and share it only with authorised recipients. It can contain historical names, equipment references and other permitted private information.
3. Keep a separate complete installation backup for recovery.

The JSON retains original recorded fields, labels and references, and new bounded subject metadata where recorded and authorised. It is not a complete database backup and does not grant access to redacted fields. Store the downloaded file securely; it may contain authorised historical information. Do not use it as an inventory restore file.

If you cannot find a change, clear filters, check the date in UTC and verify permissions with your administrator. If an original name or reference is missing, preserve the event as recorded. Do not edit database rows to repair an audit label. The existing retention and permission rules remain unchanged. Service Desk conversation text and authentication secrets are not added by this feature.

Related: [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md), [Staff Members](Staff-Members.md), [Legacy Import And Docker Upgrade](Legacy-Import-and-Docker-Upgrade.md).

## Application Screenshots

![All Activity in desktop light mode showing saved Staff events for Alex Reed and Alex Morgan.](../../../development-handovers/evidence/stage-6-6-batch-2/screenshots/audit-all-activity-desktop-light.png)

*Search finds the saved event-time names and the affected-record row identifies the Staff events.*

![View Details in dark mode with its affected-record fields and a classic scrollbar inside the rounded dialogue.](../../../development-handovers/evidence/stage-6-6-batch-3/screenshots/classic-audit-dark-390.png)

*Historical pre-#477 mobile screenshot: the old dialogue shows the canonical record ID directly. The corrected dialogue places this reference in Technical Details. Escape returns focus to **View Details**.* [Capture provenance](../../../development-handovers/evidence/stage-6-6-batch-3/README.md#capture-provenance)

![Asset History showing Alex Reed and Alex Morgan as two names recorded for one verified Staff record.](../../../development-handovers/evidence/stage-6-6-batch-2/screenshots/audit-asset-history-desktop-light.png)

*The timeline keeps the saved name for each event.* [Desktop and mobile captures and provenance](../../../development-handovers/evidence/stage-6-6-batch-2/README.md#application-screenshots)

### Corrected Activity Details — accepted desktop evidence

![Activity Details showing the recorded Supplier name Northlight Ltd and previous value Not assigned. ](../../../development-handovers/evidence/milestone-01-audit-details/audit-supplier-name.png)

*The event-time company name is retained despite a subsequent rename. The desktop dialogue uses the approved 850px width where space permits.*

![Expanded Technical Details showing the original Supplier reference, historical name fallback and unchanged Device reference.](../../../development-handovers/evidence/milestone-01-audit-details/audit-legacy-technical.png)

![Restricted Activity Details with Technical Details expanded, showing unavailable before-and-after values without disclosing Supplier names or values.](screenshots/milestone-01-native-followups/audit-values-unavailable.png)

*Expand Technical Details to inspect the original recorded values, including unchanged context. A missing historical name is not reconstructed from today's catalogue.*

![Device Activity Details showing the previous and new Primary IP Address and Asset Tag values.](../../../development-handovers/evidence/milestone-01-audit-details/audit-device-changes.png)

*Only differing recorded values appear in the main field-change list.* [Capture provenance and acceptance](../../../development-handovers/evidence/milestone-01-audit-details/README.md). Current captures are desktop light mode; narrow and dark-mode geometry was tested automatically. Native acceptance remains outstanding.

[Follow the connected Aster Services support request](Connected-Service-Desk-Journey.md) · [Draft v2.2 guides](README.md)
