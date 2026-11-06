# Issue #327 — Device Forms Investigation And Proposed Correction Plan

**Status: proposal only, awaiting explicit owner approval. No application changes have been made.**

This is the sole Add/Edit/Duplicate investigation under [#327](https://github.com/Caffoot/Caffoot-Lite/issues/327). #326 is closed following failed owner acceptance; its test results are not evidence of form correctness. #325's accepted buttons and all other accepted work remain outside scope. The [current #282 acceptance register](https://github.com/Caffoot/Caffoot-Lite/issues/282) takes precedence over historical handover statements.

The clean local and remote application checkpoint was **`b7b917e0bf5b1d4aa462c8b4e5f5415faa84922e`** on `feat/approved-modular-html-282`. This investigation changes documentation/evidence only. The exact documentation SHA is recorded in #327.

## Authority And Inspection Method

The definitive presentation is [Batch 04](https://github.com/Caffoot/Caffoot-Lite/blob/c26db4a56bbc30f95b56201e81a7a76d13c6037b/future-design/approved/devices-details-forms-batch-04.html), pinned at `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. Inventory Draft 02 and Management Batch 02 were consulted only for form entry, existing selections and catalogue interactions; their screens are not proposed for alteration. All twelve historical HTML hashes match the manifest; the extracted pinned styles and provenance are not changed.

Fresh Chromium inspection records **216 tab states**: Add/Edit/Duplicate × physical server/VM × applicable tabs × 1440×950, 1366×600, 390×844 and 320×568 × light/dark. Further observations cover **32 Hardware/Software states across 16 physical types**, **six VM-purpose states**, **20 expanded inline forms**, Windows/custom platform controls, actual validation, scrolling and canonical VM copy values. These are observations, **not 216 passing acceptance tests**.

The browser used disposable fictional SQLite inventory and credentials. The pinned prototype supplies light presentation; dark live states retain the accepted shared palette, without a claim of a separate dark-source pixel reference. Recorded inventory/settings/history remained unchanged after the main and focused observations. Source and live use the same available fallback font; external font requests were blocked. The initial fixture lacked canonical `vmNicCount`; a corrected fixture and a visible-dialog wait establish that both Edit and Duplicate retain its value of 2. A blank NIC in that first fixture is not a data-loss finding.

[Complete deduplicated field/options/geometry records](../development-handovers/evidence/issue-327/observations.json), [interaction and scrolling observations](../development-handovers/evidence/issue-327/interactions.json) and [source/capture hashes](../development-handovers/evidence/issue-327/checks.json) retain the evidence. Small native rectangles belonging to searchable selects are accessibility controls, not the visible trigger; they must not be reported as tiny visible fields.

No backend/full regression suite or Docker build was repeated in this planning run. No application functionality was implemented or accepted. Native Pi/browser behaviour, real mobile keyboards, zoom and assistive technology remain unverified here.

## Original Hypervisor Behaviour — Verified From Source

The released sources checked include [v2.0 standalone](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0/app/caffoot-lite.html), [v2.0 SQLite](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0/next/inventory.html), v2.0.1/v2.0.2, [v2.0.3](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.3/inventory.html), and the pre-modular functional checkpoint. The result does not rely on #325/#326 instructions.

| Question | Actual source finding |
| --- | --- |
| Does recognising an OS automatically enable hosting? | No such path was found in these released sources. [v2.0.3 `bindSoftwarePlatformFields`](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.3/inventory.html#L6721) copies the OS/custom value, captures platform fields and refreshes that card; it does not enable hosting or set a hypervisor product. The v2.0 handlers have the same separation. |
| What makes a host eligible? | [v2.0.3 `openDeviceModal`](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.3/inventory.html#L7056) offers new VM deployment when a non-retired physical server has `typeDetails.serverService_Hypervisor === true` or its legacy top-level equivalent. Hosting and product are separate fields. |
| What does recognised product mean? | The host product selector recognises VMware ESXi, Proxmox VE, Microsoft Hyper-V, KVM and XCP-ng, with custom values retained. This is product selection, not automatic OS classification. The server OS suggestions include Proxmox VE and VMware ESXi; Hyper-V can be entered as a custom OS value. |
| Are the three products ordinary Installed Software options? | Yes: all three occur in the released built-in software catalogue **and in Batch 04's `reviewSoftwareBuiltin`**. Removing/filtering those choices would change existing functionality; it is not an evidenced restoration. No such removal is proposed without a further decision. |
| What is saved? | `softwarePlatform`/`softwareVersion` are distinct from `serverService_Hypervisor`, `hypervisorProduct`/`hypervisorVersion`. Guests retain `virtualHostId`, inherited `virtualPlatform` and optional allocation keys. Source-backed [save handling](https://github.com/Caffoot/Caffoot-Lite/blob/v2.0.3/inventory.html#L7488) preserves host relationships and confirmation/reassignment rules. |
| What about legacy records and copies? | Existing missing/retired host assignments and historical values have preservation paths. New/copy VMs still require an eligible host. Copies clear name/IP/serial and preserve actual host/allocation data; preview sample defaults must not overwrite those values. |
| Which placement wins? | The old implementation placed physical hosting on General; #282's pinned Batch 04 intentionally places it under Software & Firmware. **Physical hosting stays there. VM host/resources stay on General.** This changes presentation, not eligibility or persistence. |

Fresh current-form probes selecting Proxmox VE, VMware ESXi and custom Microsoft Hyper-V leave hosting false and the host product blank. With no eligible physical host, the new-device deployment list offers Physical Device only. These match the examined released rules; they do not establish what an unprovided private/custom revision did.

The owner's report of previous automatic OS recognition is therefore **not confirmed by these sources**. It must be reconciled explicitly before anyone implements automation or declares that automation has been restored.

## Discrepancy Matrix

The following separates genuine layout/interaction defects from required live-functionality differences and source-preview conflicts.

| Area / modes | Pinned source | Current observation | Proposed disposition |
| --- | --- | --- | --- |
| Outer bounds, all modes | 1030px maximum width; desktop height `min(870px, 100dvh − 40px)`; mobile full viewport | Bounds match in sampled Chromium states, including 1030×560 at 1366×600 | Retain correct source bounds. Do not invent a smaller modal or claim the owner's native sizing problem is reproduced. Verify native viewport/keyboard behaviour during private acceptance. |
| Scroll contract | Fixed header/tabs/footer; only the body scrolls | Actual body scrolling works in sampled Chromium states; header/footer remain at y=21/509 during short-laptop scroll sweeps | Preserve this contract. Check wheel, touch, keyboard and nested lists on native browsers; no speculative global scroll changes. |
| Duplicate, physical/VM | Copy explanation in the source subtitle | Additional out-of-body warning banner consumes **94px** on the short laptop; body is **227px**, source **321px** | Use the source Duplicate subtitle and remove the extra banner outside the scrolling body. Preserve actual copy clearing, original identity and safe rack-position selection. |
| General Device Identity | Name, deployment, classification, location, edit-only status in source grid | Main physical Edit identity geometry matches the example; real choices, required attributes and immutable identity locks differ from the mock | Retain correct structure and real data/locks; do not replace configured choices with preview examples. |
| VM physical classification | Prototype renders a Physical Device Type row even for an existing VM; its fallback value is Server | Current VM Edit also exposes a disabled physical-type row; Add/Copy hides it | Source inconsistency: recommend only VM purpose for VM presentation in every mode, retaining the underlying stored type and edit lock. Requires confirmation in plan approval. |
| VM General card | Host selector, inherited-platform hint, then four allocation fields | Correct General placement is present; optional/legacy values differ legitimately from sample data | Preserve the card and actual values. Do not make allocations compulsory or independently edit the guest's virtualisation platform. |
| VM purpose and location | Prototype permits choices while its save is only a notice | Released/live Edit locks identity; location/platform derive from the selected host, retaining legacy values | Keep these functional rules. Do not make a misleading editable choice change persisted semantics. Include them as explicit compatibility exceptions to the mock. |
| Hardware | Manufacturer/Model/Serial with inline creation | Retained hardware/profile/catalogue controls make the sample card **757px**, source **317px** | Keep approved retention controls within the same card and source field/grid treatment. Do not delete or collapse them merely to match sample height. |
| Mounting | Mount/Rack followed by Face/Start U/U Height and one range hint | Retained create/help controls and wrapper structure produce a **594px** card versus **405px** source; the visible bounded Start U trigger is correctly sized | Copy the source grouping and spacing around retained actions. Preserve the bounded Start U selector, collision/range rules and approved rack creation action; never replace it with an unbounded mock input. |
| Software card wrappers | OS/Installed Software followed by a physical-host wrapper and service wrapper, each containing its card | Host/services cards are direct grid items and stretch to equal row height; legacy `space-y-4` classes also affect spacing | Restore the exact source wrapper hierarchy and remove conflicting legacy spacing only within the editor. Keep original IDs, fields and handlers connected. |
| Physical hosting position | Software & Firmware, after OS/software row | At short laptop, card begins **y=801**, source **y=736**; live height **557px**, source **238px** | Correct the wrapper/stretch and surplus presentation spacing. Retained controls and real custom values can still require extra height; do not promise identical sample coordinates or move hosting to General. |
| Mobile content length | Single-column source cards | 390×844 Software body is **1891px** live versus **1636px** source; both scroll in a 626px body | Restore source structure while retaining authorised controls. Keep the full scrolling sequence in review evidence; top screenshots alone are insufficient. |
| OS/version/custom controls | Simple prototype OS selector and version input | Real version selector/custom field, Windows licence and historical suggestions remain; the accepted #306 alignment deliberately reserves label space | Preserve the five-placement approval and #306 alignment. Do not remove working controls or undo accepted alignment to force a pixel-identical prototype. |
| OS on physical-type change | `reviewSyncPlatformOptions` clears an incompatible OS on changed context | Released/live refresh retains that value as custom/history; fresh Desktop Windows → Switch remains Windows, source becomes blank | Behaviour conflict: preserve existing draft/history handling unless explicitly authorising a different clearing rule. Do not silently change it during visual repair. |
| VM purpose-dependent fields | Prototype uses server OS grouping and Server Services for every VM purpose | Actual six-purpose probe shows Server Services only for server-purpose VM; other purposes use their own existing OS/software profiles | Preserve released purpose-specific applicability. Confirm this compatibility exception rather than adding selectable service fields that existing saves may not support. |
| Installed Software grouping | Pinned catalogue includes the three hypervisor products | Current/released catalogues include the same names; choosing them does not enable hosting | Retain existing catalogue/assignment semantics. No management-screen or suggestion-library change. Resolve the owner's expectation separately before coding. |
| Duplicate resource values | Prototype renders illustrative new/default allocations on Copy | Correct canonical probe retains NIC 2 in Edit and Copy; copies use their actual resource values | Preserve actual values and new-record validation. Preview values are not migration/default policy. |
| Networking | Source cards and three core fields, reservation help | VLAN/available IP and Create Subnet remain in authorised cards; sample card is **414px** versus **322px** source | Retain working controls, permission locks and IPAM relationships. Restore surrounding source treatment only; do not change IPAM pages, API or requirements. |
| Notes | Source toolbar and textarea | Main sample card matches at **308px**; Numbers/Code/Link are approved functional additions | Retain. No new formatting or redesign. |
| Expanded inline forms | Five forms, 100-character names, associated-type controls | Fresh 20-state capture records actual controls, labels/actions/options; 100-character inputs are present | Preserve the valid existing 100-character policy and type associations. No catalogue Add/Edit screens or backend change. |
| Native validation | Preview save explicitly selects/focuses Name/Location/Host/Rack section | Actual invalid submit can end on a later required Networking field; summary remains outside the visible body | Reveal/focus the first failing field and its tab, retaining validation rules and useful field message. Do not let later invalid events switch away. |
| Business validation | Preview notices are not persistence validation | A real missing-product submission leaves Networking active; alert region y=856 in a 600px viewport; toast is behind the modal | Map errors back to the correct field/tab and show the existing message in a fixed, visible editor-local feedback row. |
| Message stacking | Prototype itself has toast z=90 below editor z=150 | Live toast z=50 below overlay z=150, confirmed by paint order | Blind source copying will not fix this. Approve a form-only feedback adaptation; do not alter shared toast styling/behaviour for accepted screens. |
| Footer, close and tab entry | Fixed Save/Cancel or Back to Details, × dismissal; body resets on tab entry | These are present; copy banner/content height still constrain the body | Retain correct controls, focus/discard behaviour and tab reset. Do not reimplement accepted navigation. |
| Host changes with guests | Prototype has no real transactions | Released handlers retain per-guest reassignment/retirement and product-change confirmation | Reconnect unchanged handlers and ensure their warnings/confirmations stay visible. Do not change guest policy, transactions or permissions. |

Heights above are measured examples with fictional records, not universal constants. Some additional height is a required consequence of authorised working controls. No card/tab should be added or moved to make the examples line up.

## Complete Field And Action Coverage

The detailed records include labels, values, required/disabled states, bounds, options and card membership for every rendered control. The following identifies the core mappings and preservation rules for implementation review.

| Source field(s) | Existing live binding(s) | Rule to retain |
| --- | --- | --- |
| name | `dev-name` | Required, unique on save; blank on copy; original record unchanged. |
| deployment / fixed-deployment | `dev-deployment`, underlying type | New-record eligible choices; immutable on Edit. |
| type / vm-purpose | `dev-type`, `dev-vm-purpose` | Real types/purposes and identity locks; resolve VM presentation inconsistency. |
| location | `dev-location`, custom/create location controls | Configured locations and inline creation; physical requirement; VM host-derived semantics. |
| status | `dev-status` | Edit-only status UI; hidden Active value on Add; retirement safeguards. |
| mount-type / rack | `dev-mount-type`, `dev-rack-id` | Recognised existing mounts and actual rack IDs; no fabricated dimensions or placement. |
| face / start-u / u-height | `dev-rack-face`, `dev-rack-u`, `dev-rack-height` | Face, availability, bounds, collision and permission controls. |
| manufacturer / model / serial | native selectors, `dev-manufacturer`, `dev-model`, `dev-serial`, custom fields | Stored names, searchable choices, custom values and blank copied serial. |
| No standalone counterparts | network-card/connection, processor/graphics, memory/unit, storage/unit, drive count, RAID and other applicable profile fields | Retain type-specific hardware fields/keys in Hardware & Lifecycle; do not migrate or discard them. |
| os / os-version | `platform-select`, `platform-name`, `version-select`, `platform-version` | Real OS/firmware suggestions, custom/legacy values and existing version controls; accepted alignment. |
| No standalone counterpart | `device-form-windows-licence` | Existing conditional Windows data and original limit; no secrets in diagnostics. |
| hosting | `device-hosting-enabled`, existing `serverService_Hypervisor` representation | One existing canonical hosting value, current product/guest safeguards; resolve automatic-recognition expectation. |
| hypervisor-product / version | `host-platform-select`, `host-platform`, `host-version` | Recognised/custom products and separate host metadata; retain existing field limits. |
| vm-host | `dev-virtual-host` | Eligible new hosts, preserved legacy assignments, inherited platform/location. |
| vcpu / ram / disk / nics | `dev-vmVcpu`, `dev-vmRamGb`, `dev-vmDiskGb`, `dev-vmNicCount` | Optional positive whole-number validation, exact stored values and copied allocations. |
| software/services searches and checklists | `review-search-software/services`, original `data-device-detail-field` keys | Existing availability, assignments and applicability; selection is not installation or host classification. |
| block / subnet / ip / reserved | `dev-block`, `dev-subnet`, `dev-ip`, `dev-ip-reserved` | Real subnet cascade, required primary IP, reservation/ownership and edit restrictions. |
| No standalone counterparts | `dev-vlan`, `dev-ip-available`, Create Subnet | Retain in Network Identity/Subnet Guidance with existing return-to-form behaviour. |
| notes | `dev-notes`, `notes-preview`, `notes-toggle` and formatting actions | Plain stored Notes, safe preview, existing eight toolbar controls and keyboard operation. |
| Five inline Add/Select/Cancel forms | original location/manufacturer/model/software/service handlers | Preserve 100-character policy, duplicate/type association checks, selected values and unsaved device draft. |
| Management/create actions | Hardware manager, software/service managers, Create Network Rack | Existing handlers/return paths within the authorised cards; surrounding screens remain unchanged. |
| Save / Cancel / Back / close | current submit, close/discard and original-record return handlers | Same reservations, permissions, CSRF, cancel/discard and original-record identity. |

Validation coverage includes native required fields; uniqueness/identity/purpose/status; unfinished location creation; missing/ineligible VM host; allocation format; missing new-host product; recognised mounting/location; subnet/primary-IP match, ownership and reservations; rack bounds/collisions; stale records/reservations, permission loss and server-save failures; and guest reassignment/product-change confirmation. **The correction changes visibility/routing of feedback, not these rules or message meanings.**

## One Proposed Implementation Batch

Implement only after approval of this plan and the decisions below.

1. **Rebuild only the editor presentation from the pinned form structure.** Replace the Add/Edit/Duplicate form's current DOM rearrangement with the source header/body/footer, card wrappers and field groups, reconnecting existing form handlers/IDs. Use the source's labels, order, card sizes, control treatment and responsive rules. Preserve the correct existing bounds/tab scroll behaviour, accepted light/dark palette and #306 alignment. Remove the extra Duplicate banner in favour of the exact source subtitle; keep copy semantics and safety checks.
2. **Retain the authorised working controls inside those same cards.** Keep hardware/catalogue, custom OS/version/Windows, VLAN/available-IP/subnet, rack/software/service management and Notes controls. Preserve the 100-character rule without editing catalogue screens, backend validators or unrelated limits. Keep real data/choices, immutable identity, bounded rack selection, purpose-specific applicability and legacy/copy preservation instead of importing mock values or changing save rules.
3. **Make feedback usable within this editor only.** Reuse one existing form-error region as a conditional full-width row immediately above the fixed footer actions, with accessible error announcement. Route native and business failures to the first relevant tab/field; reveal it within the body and keep the complete message visible. Add only narrowly guarded editor lookup/routing where shared handlers currently look inside `form`; other modals and the shared toast remain unchanged. Preserve pending/save-failure, discard, guest-resolution and confirmation flows. This is the precise feedback amendment requested below, not an app-wide layer change.
4. **Reconnect and verify the same functionality.** Existing Add/Edit/Copy submit, reservations, host/guest confirmation transactions, field capture, catalogue return, IPAM and rack validation remain. Do not implement OS automation, catalogue filtering, policy changes or #304 restructuring. Correct only proven editor integration defects needed for the approved presentation/decisions; escalate any new contract conflict.
5. **Deliver one reviewed form-only batch.** Commit/push meaningful checkpoints and truthful source/live full-scroll evidence. Run focused and relevant regressions, then await the owner's native Pi acceptance. Do not build/publish an image here or touch production.

Expected implementation locations are the editor-only templates under `interface/screens/device-details.html`, form-only platform/picker fragments where needed, and narrowly scoped editor functions such as `openDeviceModal`, `initialiseDeviceTabs`, form refresh/capture and local error routing. CSS must be qualified by an editor-only marker. Some files also serve accepted Details/shared dialogs: **their other templates, rendering and styling must remain unchanged**. No surrounding Devices page, catalogue screen, backend/schema/API, shared navigation, printing, account, IPAM, Racks or Audit implementation change is proposed.

## Decisions Required With Plan Approval

1. **Hypervisor expectation:** approve preservation of the actual released hosting/product rules and existing catalogue choices for this form-only repair. If automatic OS recognition or product filtering is required instead, identify the exact working revision or explicitly agree that separate behaviour amendment before implementation. The reviewed sources do not establish the reported automatic behaviour.
2. **Prototype/working-functionality reconciliation:** approve hiding the non-applicable Physical Device Type row for every VM editor while retaining underlying identity/purpose locks, and retaining existing host-derived location, purpose-specific OS/services, stored/copy values and draft/custom-value preservation. These are explicit exceptions to the prototype's misleading VM row, universal VM-service grouping and type-change clearing; they do not add a new rule. Otherwise the conflicting interaction needs a precise owner decision before coding.
3. **Feedback and Duplicate presentation:** approve the editor-local visible feedback row above the fixed footer actions, first-error tab/focus routing, and use of the pinned Duplicate subtitle instead of the extra banner. Batch 04's own below-overlay toast and illustrative validation cannot simply be copied as working behaviour. Other screens' feedback and styles stay unchanged.

These decisions form part of **one** scoped correction plan. No option has been silently implemented, and no previous failed acceptance result is being treated as approval.

## Verification After Approval

- Full rendered comparisons, including top/middle/bottom of every form section: Add/Edit/Duplicate, physical server, server-purpose VM and other applicable purposes, desktop/short laptop/mobile, both themes. Include controlled real/custom/legacy values and the retained controls; do not substitute isolated dimension assertions for visual review.
- Correct header/footer bounds and reachable body at short heights, mobile orientation, enlarged text, address bar and keyboard states. Check both outer body and nested software-list scrolling without changing unrelated scroll behaviour.
- Invalid native fields and each business/server-failure category: visible message, first correct panel/field, focus and accessible announcement; error must not appear behind the modal. Verify guest/discard confirmations, cancellation and keyboard traversal/return.
- Real isolated Add/Edit/Copy/save/reload: exact hardware/OS/custom/version/Notes/catalogue keys, unique copied identity, cleared IP/serial, valid rack positions, permissions/reservations, host eligibility, guest assignment/resources and legacy values. Confirm guest product propagation/reassignment remains atomic and cancelled changes do not save.
- Prove scope isolation: before/after checks for accepted surrounding Devices screens, catalogue/return destinations, shared navigation and relevant backend/security/permission regressions. No reimplementation of accepted issues. Check all twelve pinned source/style hashes and provenance, documentation/index changes where declarations move, and history secrets.
- Owner builds the exact reviewed commit natively on the private Pi using the existing workflow. Record native acceptance separately; do not claim it from Chromium, CI, screenshots or a Docker build.

## Selected Fresh Render Comparisons

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
