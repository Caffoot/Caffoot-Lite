# Issue #327 — Device Forms Investigation And Proposed Correction Plan

**Status: revised proposal, awaiting approval of the complete implementation plan. This update is documentation only.**

The owner has explicitly authorised the hypervisor and Notes requirements below. Those decisions replace the earlier plan’s contrary recommendations; they are not questions being reopened. Application implementation still requires approval of this complete revised plan.

This is the sole Add/Edit/Duplicate investigation under [#327](https://github.com/Caffoot/Caffoot-Lite/issues/327). #326 is closed following failed owner acceptance; its test results are not evidence of form correctness. #325's accepted buttons and all other accepted work remain outside scope. The [current #282 acceptance register](https://github.com/Caffoot/Caffoot-Lite/issues/282) takes precedence over historical handover statements.

The clean local and remote application checkpoint was **`b7b917e0bf5b1d4aa462c8b4e5f5415faa84922e`** on `feat/approved-modular-html-282`. The original investigation was committed as `18dc90d51ebe43453f14c4e03d50a8a8e1c03cdb`. The clean local/remote head matched that commit before this revision. The exact revised documentation SHA is recorded in #327; application code remains at the same checkpoint.

## What Is Authoritative Now

Use [Batch 04](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-details-forms-batch-04.html) at `c26db4a56bbc30f95b56201e81a7a76d13c6037b` for the form’s appearance. Use the working v2.0 forms for functionality, with the owner’s explicit amendments in [hypervisor clarification 6692411135](https://github.com/Caffoot/Caffoot-Lite/issues/327#issuecomment-6692411135), [Notes requirement 6692453167](https://github.com/Caffoot/Caffoot-Lite/issues/327#issuecomment-6692453167) and the current plan-only instruction.

The owner has demonstrated the running v2.0 Safari workflow and supplied comparative screenshots. Those recorded decisions settle the intended workflow. The original investigation’s source findings remain useful history, but its instruction to keep physical hosting on Software & Firmware and its objection to form-only filtering are superseded.

Inventory Draft 02 and Management Batch 02 are references only for form entry and existing selections. Their screens remain unchanged. The twelve original HTML sources, extracted styles and manifest remain unchanged.

## What Already Works And Must Be Preserved

| Working behaviour | Source and preservation requirement |
| --- | --- |
| Host eligibility and VM deployment | [Released host eligibility](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.3/inventory.html#L7056) and [current form entry](https://github.com/Caffoot/Caffoot-Lite/blob/b7b917e0bf5b1d4aa462c8b4e5f5415faa84922e/interface/application.js#L5669) use the existing physical-server hosting flag, retirement rules and legacy exceptions. Do not broaden eligible types or make an OS/software choice automatically enable hosting. |
| Separate saved OS and hypervisor values | [Released platform capture](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.3/inventory.html#L6752) and current capture keep ordinary `softwarePlatform`/`softwareVersion` distinct from `hypervisorProduct`/`hypervisorVersion` and the hosting flag. Keep those keys and saved values. |
| Hide ordinary OS when hosting | [v2.0.3 `syncHostingFieldVisibility`](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.3/inventory.html#L6774) hides `software-platform` for an enabled physical host. [Current v2.1 helper](https://github.com/Caffoot/Caffoot-Lite/blob/b7b917e0bf5b1d4aa462c8b4e5f5415faa84922e/interface/application.js#L5058) unconditionally shows it. Restoring conditional hiding is directly source-backed. |
| Type and purpose filters | Current `getSoftwareFieldsForDeviceType`, `getDetailFieldsForDeviceType`, platform suggestions and `updateVirtualHardwareFieldVisibility` preserve type associations, Hardware applicability, identity locks and conditional fields. Apply the new form-only exclusion after those filters; do not replace or weaken them. |
| Host/guest saving and protection | Released/current submit, guest reassignment and product-change confirmation retain actual host relationships, inherited values, optional resource validation, legacy records, reservations, permissions and atomic saves. Reconnect those handlers; no new guest policy. |
| Copy and draft preservation | Copies clear name/IP/serial, retain actual resource/catalogue values and use safe placement/new-host validation. Drafts and legacy values survive the existing return flows. Keep original records and unknown metadata. |
| Spacious Notes with safe formatting | [Released Notes layout, lines 609–619](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.3/inventory.html#L609) fills the available panel through flexible layout and scrolls text internally. [Current Notes handlers](https://github.com/Caffoot/Caffoot-Lite/blob/b7b917e0bf5b1d4aa462c8b4e5f5415faa84922e/interface/application.js#L5146) retain formatting/preview; the current form layout leaves unused space. Preserve content and handlers while restoring available-height layout. |
| Existing retained controls and limits | Keep the five authorised retention placements except where the latest hosting amendment explicitly supersedes placement. Keep the 100-character software/service name policy, other existing limits, validators and catalogue records. |

The released and pinned catalogues both contain VMware ESXi, Proxmox VE and Microsoft Hyper-V. **Their omission from ordinary Add/Edit choices is now an explicitly authorised form-only improvement**, not a claim that the historical catalogues lacked them. No catalogue record or saved assignment will be deleted to make the choices disappear.

## Exact Owner-Amended Workflow

### Eligible physical servers

Place **This physical server hosts virtual machines** on General, immediately beneath Physical Device Type, inside the existing Device Identity grouping. Keep the compact approved checkbox treatment. It must appear only for the existing eligible physical-server type, not for Desktop, networking equipment, other physical types or VMs.

- **Unticked:** show the usual type-appropriate OS/platform/version workflow on Software & Firmware, with the ordinary choices filtered as described below.
- **Ticked:** reveal dedicated **Hypervisor Software/OS** and **Version** selectors immediately beneath the checkbox on General. Hide the ordinary Operating System card and its dependent version/licence controls for that hosting server, preserving their stored/draft values.
- Use the existing recognised product choices and custom/existing product support. Reuse existing offline version suggestions where available, with custom/existing versions still valid. Store the same `hypervisorProduct` and `hypervisorVersion`; do not invent a new field, restrict old version strings or copy the ordinary OS into the product automatically.
- Toggling back restores the ordinary OS draft. Disabling hosting or changing a product still follows the existing guest-safety confirmations; Cancel must retain the prior host and guest data.
- Remove the duplicate physical-host configuration from Software & Firmware. Keep one canonical hosting checkbox; the form’s physical-server service picker must not introduce another hosting toggle. Its catalogue key remains intact.

The General placement and conditional hiding explicitly supersede Batch 04’s physical-host placement. The dedicated selector is the only Add/Edit/Duplicate place offering hypervisor products.

### Ordinary choices and existing records

Apply editor-only filtering to ordinary OS and Installed Software choices, including their search results and editor-launched assignment pickers. Recognise the dedicated selector’s product identities—VMware ESXi, Proxmox VE, Microsoft Hyper-V, KVM and XCP-ng—using existing keys/labels and supported aliases. Explicitly recorded custom host products can be matched by their stored identity; do not guess that arbitrary custom software is a hypervisor. Do not use a broad word match that also removes VMware Tools, Hyper-V Integration Services or other valid guest software.

The filtering must not change the shared catalogue, global type definitions, management pages or saved assignments. In a shared manager, change only its pending-device assignment mode, identified by the existing return-to-form context; its ordinary management mode must remain identical. A known excluded product entered through inline creation/search must guide the person to General’s dedicated selector rather than offer a second assignment path. Keep the existing duplicate, association and save validation rules.

| Existing value | Exact preservation approach proposed |
| --- | --- |
| Hypervisor product previously recorded as ordinary OS | Retain the original value in the device/draft. Do not re-add it as an ordinary selectable option or automatically move it into the host fields. Show a short non-selectable retained-value explanation using existing form help treatment; an explicit ordinary-OS replacement remains an ordinary edit. |
| Hypervisor product already assigned as Installed Software | Keep its original key/value when it is omitted from the offered checkbox list. Retain a non-selectable explanation of the recorded assignment, rather than a second product chooser. Do not treat an absent checkbox as an instruction to clear it. |
| Ordinary OS hidden while hosting is enabled | Keep its original/draft OS, version and conditional values; save/capture must not turn hidden or unmounted controls into empty replacements. |
| Custom product/version, legacy fields and copies | Preserve exact strings, keys, assignments and unknown metadata through Edit, Duplicate, save/reload and cancelled dialogs. Copies still use new-record host/identity/placement validation. |

The short retained-value explanations are compatibility feedback within the existing cards, not new selection controls, cards or management features. Do not silently migrate or “clean up” records. If the single-selection path cannot be isolated to forms without affecting another screen or losing a saved value, stop and obtain approval for the smallest necessary additional change.

### Virtual machines

After an eligible physical host is saved, Add Device offers Virtual Machine deployment. On selection, General shows VM Purpose, eligible physical host and the existing virtual CPU/RAM/disk/network-adapter allocations. Hide physical Device Type, physical mounting/rack/location inputs, Hardware and all other inapplicable controls. Show inherited host information where needed without making it a separate physical-location or virtualisation-platform chooser.

Preserve the actual allowed VM purposes, purpose-specific OS/software/services, edit identity locks, host-derived location/platform and legacy host handling. Do not offer Server Services for every VM purpose merely because the prototype does. Apply consistently to Add/Edit/Duplicate; neither copy nor legacy editing broadens new-host eligibility.

### Notes

On the Notes tab, the Notes card, workspace and text-entry area must fill the available height of the form’s content body by default. Preserve the Batch 04 card/field appearance while applying the owner-approved height adaptation. The textarea and Preview use the remaining space below the heading, label and wrapping toolbar; long content scrolls internally. At short heights, keep the fixed header/tabs/footer and Save/Cancel visible and allow necessary body scrolling.

Use editor-scoped responsive layout based on the released Notes behaviour. Do not set a large arbitrary pixel height or require manual resizing. Preserve the exact action order **Bold, Italic, Bullets, Heading, Numbers, Code, Link, Preview**, existing keyboard behaviour, safe preview/sanitisation, stored text, permissions and draft/copy/save handling. Do not change read-only Details Notes, other textareas or shared textarea styling.

## Existing Investigation And Evidence

The completed investigation remains intact: 216 mode/tab/viewport/theme states, 32 physical-type states, six VM purposes, 20 expanded forms, actual validation and scrolling observations. Those are historical observations, not acceptance passes or evidence that the newly amended layout is implemented.

[Complete original records](../development-handovers/evidence/issue-327/observations.json), [interaction observations](../development-handovers/evidence/issue-327/interactions.json) and [hashes](../development-handovers/evidence/issue-327/checks.json) are unchanged. The corrected canonical NIC observation establishes that Edit and Duplicate both retain 2; an early incomplete fixture is not a data-loss finding. Searchable selects’ small native accessibility rectangles are not their visible trigger dimensions.

This revision performs targeted source reading and documentation checks only. It does not rerun the investigation, browser/backend suites or Docker builds, and does not claim a new screenshot comparison or owner acceptance. The owner’s v2.0/v2.1 Safari comparisons must be included in later private visual acceptance.

## Discrepancy Matrix

The original measurements below are preserved as the investigation baseline. Their proposed dispositions are updated for the latest owner amendments; superseded measurements are not new acceptance targets.

| Area / modes | Pinned source | Current observation | Proposed disposition |
| --- | --- | --- | --- |
| Outer bounds, all modes | 1030px maximum width; desktop height `min(870px, 100dvh − 40px)`; mobile full viewport | Bounds match in sampled Chromium states, including 1030×560 at 1366×600 | Retain correct source bounds. Do not invent a smaller modal or claim the owner's native sizing problem is reproduced. Verify native viewport/keyboard behaviour during private acceptance. |
| Scroll contract | Fixed header/tabs/footer; only the body scrolls | Actual body scrolling works in sampled Chromium states; header/footer remain at y=21/509 during short-laptop scroll sweeps | Preserve this contract. Check wheel, touch, keyboard and nested lists on native browsers; no speculative global scroll changes. |
| Duplicate, physical/VM | Copy explanation in the source subtitle | Additional out-of-body warning banner consumes **94px** on the short laptop; body is **227px**, source **321px** | Use the source Duplicate subtitle and remove the extra banner outside the scrolling body. Preserve actual copy clearing, original identity and safe rack-position selection. |
| General Device Identity | Name, deployment, classification, location, edit-only status in source grid | Main physical Edit identity geometry matches the example; real choices, required attributes and immutable identity locks differ from the mock | Retain correct structure and real data/locks; do not replace configured choices with preview examples. |
| VM physical classification | Prototype renders a Physical Device Type row even for an existing VM | Current VM Edit exposes an extra disabled physical-type row | Show only VM Purpose and inherited host information for VMs; hide inapplicable physical controls as explicitly directed. Retain underlying identity and Edit locks. |
| VM General card | Host selector, inherited-platform hint, then four allocation fields | Correct General placement is present; optional/legacy values differ legitimately from sample data | Preserve the card and actual values. Do not make allocations compulsory or independently edit the guest's virtualisation platform. |
| VM purpose and location | Prototype offers mock choices | Actual VM rules derive location/platform from the host and lock Edit identity | Preserve the real rules; hide physical location controls and retain inherited/legacy values. |
| Hardware | Manufacturer/Model/Serial with inline creation | Retained hardware/profile/catalogue controls make the sample card **757px**, source **317px** | Keep approved retention controls within the same card and source field/grid treatment. Do not delete or collapse them merely to match sample height. |
| Mounting | Mount/Rack followed by Face/Start U/U Height and one range hint | Retained create/help controls and wrapper structure produce a **594px** card versus **405px** source; the visible bounded Start U trigger is correctly sized | Copy the source grouping and spacing around retained actions. Preserve the bounded Start U selector, collision/range rules and approved rack creation action; never replace it with an unbounded mock input. |
| Software card wrappers | Source defines the OS, Installed Software and applicable service-card grouping | Direct grid items and legacy spacing stretch cards | Restore source grouping for the remaining cards after moving physical hosting to General under the explicit amendment. Keep IDs, applicable controls and handlers. |
| Physical hosting position | Batch 04 places it under Software & Firmware | Original sample starts at y=801 live versus y=736 source; both are now pre-amendment observations | Move the checkbox and dedicated product/version controls to General immediately below Physical Device Type. This owner-approved amendment supersedes the earlier plan. |
| Mobile content length | Single-column source cards | 390×844 Software body is **1891px** live versus **1636px** source; both scroll in a 626px body | Restore source structure while retaining authorised controls. Keep the full scrolling sequence in review evidence; top screenshots alone are insufficient. |
| OS/version/custom controls | Prototype has a simple OS selector/version field | Actual selectors/custom/Windows controls and accepted #306 alignment are functional | Preserve normal workflow and alignment when hosting is unticked; hide the ordinary card when an eligible physical server hosts VMs. Preserve hidden values. |
| OS on physical-type change | Prototype clears incompatible values | Released/live draft/history handling preserves custom or historical values | Keep existing filters, type-change safeguards and saved/draft preservation. The owner has expressly required these functional rules. |
| VM purpose-dependent fields | Prototype uses universal server grouping | Real applicability depends on VM purpose/type | Retain all existing purpose/type restrictions; do not broaden OS, software, services or hardware availability. |
| Installed Software grouping | Prototype and historical catalogues include hypervisor products | Current form offers the same products as ordinary choices | Filter ordinary form choices as expressly authorised, preserving catalogue records, existing assignments and other screens. Keep one dedicated General selector. |
| Duplicate resource values | Prototype renders illustrative new/default allocations on Copy | Correct canonical probe retains NIC 2 in Edit and Copy; copies use their actual resource values | Preserve actual values and new-record validation. Preview values are not migration/default policy. |
| Networking | Source cards and three core fields, reservation help | VLAN/available IP and Create Subnet remain in authorised cards; sample card is **414px** versus **322px** source | Retain working controls, permission locks and IPAM relationships. Restore surrounding source treatment only; do not change IPAM pages, API or requirements. |
| Notes | Small source textarea/card | Current sample card is 308px and leaves unused body space | Apply the owner-approved available-height layout for the editable Notes tab only. Preserve all eight actions, content, safe preview and permissions. |
| Expanded inline forms | Five forms, 100-character names, associated-type controls | Fresh 20-state capture records actual controls, labels/actions/options; 100-character inputs are present | Preserve the valid existing 100-character policy and type associations. No catalogue Add/Edit screens or backend change. |
| Native validation | Preview save explicitly selects/focuses Name/Location/Host/Rack section | Actual invalid submit can end on a later required Networking field; summary remains outside the visible body | Reveal/focus the first failing field and its tab, retaining validation rules and useful field message. Do not let later invalid events switch away. |
| Business validation | Preview notices are not persistence validation | A real missing-product submission leaves Networking active; alert region y=856 in a 600px viewport; toast is behind the modal | Map errors back to the correct field/tab and show the existing message in a fixed, visible editor-local feedback row. |
| Message stacking | Prototype itself has toast z=90 below editor z=150 | Live toast z=50 below overlay z=150, confirmed by paint order | Use the editor-local feedback described below; do not alter shared toast styling/behaviour for accepted screens. |
| Footer, close and tab entry | Fixed Save/Cancel or Back to Details, × dismissal; body resets on tab entry | These are present; copy banner/content height still constrain the body | Retain correct controls, focus/discard behaviour and tab reset. Do not reimplement accepted navigation. |
| Host changes with guests | Prototype has no real transactions | Released handlers retain per-guest reassignment/retirement and product-change confirmation | Reconnect unchanged handlers and ensure their warnings/confirmations stay visible. Do not change guest policy, transactions or permissions. |

Heights above are measured examples with fictional records, not universal constants. Some additional height is a required consequence of authorised working controls. No card/tab should be added or moved to make the examples line up.

## Complete Field And Action Coverage

The detailed records include labels, values, required/disabled states, bounds, options and card membership for every rendered control. The following identifies the core mappings and preservation rules for implementation review.

| Source field(s) | Existing live binding(s) | Rule to retain |
| --- | --- | --- |
| name | `dev-name` | Required, unique on save; blank on copy; original record unchanged. |
| deployment / fixed-deployment | `dev-deployment`, underlying type | New-record eligible choices; immutable on Edit. |
| type / vm-purpose | `dev-type`, `dev-vm-purpose` | Real types/purposes and identity locks; hide the physical-only row for VMs. |
| location | `dev-location`, custom/create location controls | Configured locations and inline creation; physical requirement; VM host-derived semantics. |
| status | `dev-status` | Edit-only status UI; hidden Active value on Add; retirement safeguards. |
| mount-type / rack | `dev-mount-type`, `dev-rack-id` | Recognised existing mounts and actual rack IDs; no fabricated dimensions or placement. |
| face / start-u / u-height | `dev-rack-face`, `dev-rack-u`, `dev-rack-height` | Face, availability, bounds, collision and permission controls. |
| manufacturer / model / serial | native selectors, `dev-manufacturer`, `dev-model`, `dev-serial`, custom fields | Stored names, searchable choices, custom values and blank copied serial. |
| No standalone counterparts | network-card/connection, processor/graphics, memory/unit, storage/unit, drive count, RAID and other applicable profile fields | Retain type-specific hardware fields/keys in Hardware & Lifecycle; do not migrate or discard them. |
| os / os-version | `platform-select`, `platform-name`, `version-select`, `platform-version` | Real OS/firmware suggestions, custom/legacy values and existing version controls; accepted alignment. |
| No standalone counterpart | `device-form-windows-licence` | Existing conditional Windows data and original limit; no secrets in diagnostics. |
| hosting | `device-hosting-enabled`, existing `serverService_Hypervisor` representation | One canonical General-tab hosting value with dedicated product/version controls; existing eligibility and guest safeguards. |
| hypervisor-product / version | `host-platform-select`, `host-platform`, `host-version` | Dedicated General product/version selectors, recognised/custom values and separate host metadata; retain existing limits. |
| vm-host | `dev-virtual-host` | Eligible new hosts, preserved legacy assignments, inherited platform/location. |
| vcpu / ram / disk / nics | `dev-vmVcpu`, `dev-vmRamGb`, `dev-vmDiskGb`, `dev-vmNicCount` | Optional positive whole-number validation, exact stored values and copied allocations. |
| software/services searches and checklists | `review-search-software/services`, original `data-device-detail-field` keys | Existing availability, assignments and applicability; selection is not installation or host classification. |
| block / subnet / ip / reserved | `dev-block`, `dev-subnet`, `dev-ip`, `dev-ip-reserved` | Real subnet cascade, required primary IP, reservation/ownership and edit restrictions. |
| No standalone counterparts | `dev-vlan`, `dev-ip-available`, Create Subnet | Retain in Network Identity/Subnet Guidance with existing return-to-form behaviour. |
| notes | `dev-notes`, `notes-preview`, `notes-toggle` and formatting actions | Available-height Notes area, plain stored content, safe preview and all eight controls in their existing order. |
| Five inline Add/Select/Cancel forms | original location/manufacturer/model/software/service handlers | Preserve 100-character policy, duplicate/type association checks, selected values and unsaved device draft. |
| Management/create actions | Hardware manager, software/service managers, Create Network Rack | Existing handlers/return paths within the authorised cards; surrounding screens remain unchanged. |
| Save / Cancel / Back / close | current submit, close/discard and original-record return handlers | Same reservations, permissions, CSRF, cancel/discard and original-record identity. |

Validation coverage includes native required fields; uniqueness/identity/purpose/status; unfinished location creation; missing/ineligible VM host; allocation format; missing new-host product; recognised mounting/location; subnet/primary-IP match, ownership and reservations; rack bounds/collisions; stale records/reservations, permission loss and server-save failures; and guest reassignment/product-change confirmation. **The correction changes visibility/routing of feedback, not these rules or message meanings.**

## One Revised Implementation Batch — After Approval Only

1. **Restore the editor’s approved structure.** Reconnect the existing form handlers to Batch 04’s header, tabs, scrolling body, card wrappers and fixed footer. Correct grouping/spacing, use the approved Duplicate subtitle in place of the extra banner, and preserve the accepted themes/alignment and real retained controls. Do not change other Devices screens.
2. **Apply the single hypervisor path.** Put eligible physical-server hosting and dedicated product/version selectors on General; restore ordinary-OS hiding; apply form-only product filtering and the preservation rules above. Keep existing type/purpose filters and host/guest safety. Do not infer hosting from ordinary OS/software selection.
3. **Make editor feedback visible and actionable.** Use one editor-local error region above the fixed footer actions. Reveal and focus the first relevant field/tab, retain the useful original message and accessible announcement, and keep guest/discard confirmations visible. Guard any shared lookup changes by the active editor context; other modals and shared toast behaviour remain unchanged.
4. **Restore the spacious Notes workspace.** Make the active Notes panel/card/workspace pass available height down to the textarea/Preview, retaining the wrapping toolbar and internal text scrolling. This applies only to Add/Edit/Duplicate, with no Notes data/formatting change.
5. **Verify and deliver the one scoped batch.** Preserve backend/API/schema/security/data contracts, reconnect the existing submit/reservation/catalogue-return/guest handlers, and run the acceptance matrix below. Push reviewable checkpoints and evidence. The owner builds/reviews the native private Pi image through the established workflow. No merge, publication, production deployment or release.

### Files And Functions Expected To Change Later

| Location | Planned editor-only correction / isolation |
| --- | --- |
| `interface/screens/device-details.html` | Only `open-device-modal-*` form fragments: General hosting, VM visibility, footer feedback and Notes layout hooks. **Do not alter the read-only Details fragments or their Close × button.** |
| `interface/screens/device-management.html` | Only form platform/version fragments where needed for dedicated selector and ordinary-OS compatibility display. Management/catalogue page and Add/Edit templates remain unchanged. |
| `interface/screens/devices.html` | Only inline editor picker fragments if needed to omit offered product choices and explain retained assignments. Overview/Inventory/other page fragments remain unchanged. |
| `interface/application.js`: `openDeviceModal`, `initialiseDeviceTabs`, `updateVirtualHardwareFieldVisibility` | Source form structure, General placement, correct physical/VM controls, Duplicate subtitle, fixed actions and active editor marker. Preserve eligible-type/purpose checks. |
| Form platform/picker helpers: `renderSoftwarePlatformFields`, `bindSoftwarePlatformFields`, `syncHostingFieldVisibility`, `renderInlineDevicePicker` | Dedicated host product/version handling, ordinary-OS hiding and editor-only offered-choice filtering. Reuse version suggestions; do not change global catalogues or broaden type choices. |
| Draft/capture/return paths: `captureSoftwarePlatformFields`, `captureDeviceDetailFieldValues`, `captureDeviceFormDraft`, applicable software-selection return helpers | Preserve original hidden/filtered values and assignments, unsaved input and legacy metadata. Update only how editor controls feed the existing model. |
| Existing shared manager/feedback helpers, only guarded editor branches | If a pending-device picker shares a manager helper, filter only its form-assignment mode. Adapt form-error lookup only for this editor; unchanged ordinary manager pages and other dialogs. If isolation cannot be achieved, stop for approval. |
| `initialiseNotesEditor` and editor layout hooks | Keep all formatting, preview and text handlers; adjust only form layout/active-panel wiring if required for height. |
| Integration CSS, normally `interface/styles/components.css` / editor-only additions in `dialogs.css` | Qualify every change by an Add/Edit/Duplicate marker. No broad `.device-review-dialog`, `.device-review-close` or textarea rule affecting read-only Details/other screens. Keep pinned source styles intact. |
| Focused tests, this plan, handover and Function Index | Verify changes and update declaration links if declarations move. No #304 restructuring or new dependency/framework. |

Existing backend validators, database schema, field names, account/security rules, catalogue definitions and ordinary manager screens are not proposed for change. The form-only filter is applied to offered choices, not to the shared catalogue or the stored record.

## Exact Acceptance Checks After Implementation

Use fictional isolated records and compare complete rendered forms against Batch 04 **with the recorded General-hosting and Notes-height amendments**. Keep the original evidence as a baseline; do not relabel old results as passing the new design.

| Check | Required evidence / result |
| --- | --- |
| Add/Edit/Duplicate appearance | Full top/middle/bottom renders at 1440×950, 1366×600, 390×844 and 320×568, both themes, plus 200% text. Review cards, fields, wrapping, General amendments, footer/error row and source subtitle. Record real-data/retained-control differences explicitly. |
| Physical type restrictions | Exercise every existing physical type/profile. Only the existing eligible physical-server type gets the hosting checkbox. Preserve type-specific OS/software/hardware/service filters and conditional Windows/custom fields; no generalised hosting. |
| Hosting off → on → off | General placement directly below Physical Device Type; normal OS visible off and hidden on; one dedicated product/version path; normal draft restored off. No saved value changes on toggle/Cancel; existing guest confirmation controls still apply. |
| Product filtering | Recognised products absent from ordinary OS/software options, searches, inline selection and pending-device assignment modes. Dedicated choices work. Valid guest tools and unrelated software remain available; catalogues and non-editor managers are identical. |
| Saved and legacy values | Old ordinary-OS hypervisor strings, assigned software keys, custom products/versions, hidden OS data and unknown fields survive no-op Edit, explicit edits, Duplicate, save/reload and cancelled return dialogs. Missing filtered controls never mean false/empty. Compare database/export values before/after; no automatic migration. |
| Host eligibility and VM entry | No eligible host: no new VM option. Eligible saved physical host: VM option appears. Retired/unsupported types do not qualify; existing legacy editing exceptions remain. Verify before and after reload. |
| Every allowed VM purpose | Show General host/resources, hide physical type/location/mounting/rack/Hardware and inapplicable controls. Preserve purpose-specific OS/software/services, identity locks, inherited platform/location, optional allocation validation and copied values. |
| Guest protection | Change host product, disable hosting and retire a host with guests: unchanged per-guest review, Cancel, eligible reassignment and atomic propagation. No orphaned or silently rewritten relationships. |
| Notes height and actions | Empty/short/long Notes fill the remaining body without manual resizing across sizes/themes/text enlargement. Compare against the owner’s v2.0/v2.1 Safari screenshots and Batch 04 plus height amendment. Toolbar wraps in the original eight-action order; text and Preview scroll internally; fixed Save/Cancel remain reachable. Check keyboard, stored text, sanitisation, drafts, copy, save/reload and permission restrictions. |
| Errors and confirmations | Native required/invalid fields, uniqueness, host/product/resources, IP/rack constraints, stale reservation/permission loss and simulated save failure: first correct tab/field, visible complete feedback above footer, announcement and focus. Confirmations/discard stay visible and Cancel preserves data. |
| Scrolling and keyboard | Body and nested lists, Tab/Shift+Tab, tab keys, Enter/Space, Escape, focus return, short height/orientation and native mobile keyboard/address-bar states. No modal/footer clipping or message behind the overlay. |
| Scope/regression proof | Before/after fixtures and DOM/style snapshots for accepted surrounding Devices/management/read-only Details, particularly its Close button and Notes. Relevant browser/backend/permission/security regressions, provenance, documentation/index links and history-secret checks. Do not redo accepted corrections. |
| Owner acceptance | Owner builds the exact reviewed SHA natively on the private Pi using the existing workflow and performs Safari/physical-device acceptance. Automated results are not owner visual approval. |

## Approval Status And Separate Defect

The hypervisor placement/hiding/filtering, VM restrictions and Notes height are settled owner requirements. The previous three investigation decision groups are superseded by the latest comments and current instruction. No additional product decision is needed merely to include them in this plan.

The complete revised plan still requires **explicit product-owner approval before application implementation**. No unresolved ambiguity in the intended workflow prevents this documentation update. The plan’s proposed retained-value treatment and guarded implementation locations are concrete items for that approval. A genuinely incompatible data association or unavoidable effect on another screen discovered later must be reported before deviating.

The malformed **Close ×** button in read-only Device Details is recorded separately as [#328](https://github.com/Caffoot/Caffoot-Lite/issues/328), awaiting its own later approval. It is not part of this batch; do not fix it through a shared style change.

## Preserved Investigation Captures — Before The Owner Amendments

| View | Live | Pinned source |
| --- | --- | --- |
| Short-laptop Software, top | [View](../development-handovers/evidence/issue-327/images/host-software-1366-light-live.png) | [View](../development-handovers/evidence/issue-327/images/host-software-1366-light-source.png) |
| Short-laptop Software, bottom | [View](../development-handovers/evidence/issue-327/images/host-software-scroll-1-live.png) | [View](../development-handovers/evidence/issue-327/images/host-software-scroll-1-source.png) |
| Mounting, bottom | [View](../development-handovers/evidence/issue-327/images/host-general-scroll-1-live.png) | [View](../development-handovers/evidence/issue-327/images/host-general-scroll-1-source.png) |
| Hardware, bottom | [View](../development-handovers/evidence/issue-327/images/host-hardware-scroll-1-live.png) | [View](../development-handovers/evidence/issue-327/images/host-hardware-scroll-1-source.png) |
| VM General, bottom | [View](../development-handovers/evidence/issue-327/images/vm-general-scroll-1-live.png) | [View](../development-handovers/evidence/issue-327/images/vm-general-scroll-1-source.png) |
| Mobile dark Software | [View](../development-handovers/evidence/issue-327/images/host-software-390-dark-live.png) | [View](../development-handovers/evidence/issue-327/images/host-software-390-dark-source.png) |
| Short-laptop Duplicate | [View](../development-handovers/evidence/issue-327/images/duplicate-short-laptop-live.png) | [View](../development-handovers/evidence/issue-327/images/duplicate-short-laptop-source.png) |

[Actual missing-product error](../development-handovers/evidence/issue-327/images/actual-host-validation.png) and [native invalid state](../development-handovers/evidence/issue-327/images/native-error-laptop.png) document the visibility failure. Scroll comparisons keep each page's actual layout; screenshots at the same scroll fraction can show different content because real retained controls change its height. Placeholder data and unrelated background screens are not proposed changes.

These original captures are unchanged historical evidence. They are not the target for General hosting placement or the expanded Notes area, and no new visual acceptance is claimed by this plan revision.
