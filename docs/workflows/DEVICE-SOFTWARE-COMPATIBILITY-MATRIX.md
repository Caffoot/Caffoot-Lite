# Device to Software Compatibility Matrix

**Status:** Initial source based inventory, 24 October 2026. **Scope:** Current `main` application source, not a certified published v1.3.0 behaviour matrix. **Verification:** Source inspection only; no browser tests executed.

This document separates software and services that Caffoot Lite currently **offers in the form** from future compatibility decisions. An offered option is not a claim that the actual software can run on that hardware. Custom catalogue entries and archived historical selections require separate verification.

## Device type to form field mapping

The current `phase19BTypeGroups` mapping and `phase19BProfiles` in `app/caffoot-lite.html` (approximately lines 6139 and 6376 to 6387) define the following groups. Additional suggested or custom installed software is appended by `phase120SoftwareFieldsFor(type)` where the catalogue entry's `deviceTypes` includes the selected type.

| Device types | Form group | Existing additional fields and behaviour |
| --- | --- | --- |
| Desktop, Laptop, Tablet | computer | OS, hardware and network details, software selection, Windows licence |
| Server - Physical, Server - Virtual | server | Default server types; OS, hardware and network details, storage and RAID, installed software and shared server services |
| Server (legacy or user managed only) | server | Recognised by the internal mapping but not in the default fresh inventory device type list |
| Firewall, Print Server, Print Servers, Wireless LAN Controller | network | Network card and network connection details, plus software available for exact type |
| Router | router | Port count and network connection, plus type eligible software |
| Switch | switch | Port count, network card and network connection, plus type eligible software |
| NAS | nas | Network, memory, storage, RAID and drive count, plus type eligible software |
| Printer, Scanner | printer | Network and printer colour or design choices, plus type eligible software |
| Wireless Access Point, Access Point, AP | ap | No extra fixed profile fields, but exact type eligible software may be offered |
| Phone System | phone | Handset count and type eligible software |
| UPS | ups | Power outlets, serial and USB flags, plus type eligible software |
| Tape Drive | tape | Network and drive count, plus type eligible software |
| Custom or unmatched type | no fixed group | Only type eligible software and common device fields; inspect case by case |

**Default versus legacy distinction:** `cloneDefaultData()` lists `Server - Physical` and `Server - Virtual`, not generic `Server` (approximately line 1167). `openDeviceModal()` populates its type selector from `getUniqueDeviceTypes()` (approximately lines 6816 to 6823), while `normaliseState()` retains device types discovered in older saved devices (approximately lines 1420 to 1424). Therefore a generic `Server` may appear in imported or user managed inventories, but is not a default fresh inventory choice. This is a source finding, not an executed UI test.

## Starter software examples verified in source

| Software | Suggested device types | Observation |
| --- | --- | --- |
| VMware ESXi | Server - Physical | Suggested installed software checkbox, not currently an authoritative hypervisor selection |
| Proxmox VE | Server - Physical | Same limitation |
| Microsoft Hyper-V | Server - Physical | Same limitation |
| Docker Engine | Server - Physical, Server - Virtual | Available on both server types |
| VMware Tools | Server - Virtual | Guest utility |
| QEMU Guest Agent | Server - Virtual | Guest utility |
| Hyper-V Integration Services | Server - Virtual | Guest utility |
| pfSense | Firewall, Router, Layer 3 Switch | No Server - Virtual suggestion in inspected starter list |
| OPNsense | Firewall, Router, Layer 3 Switch | No Server - Virtual suggestion in inspected starter list |
| Microsoft Defender for Endpoint | Desktop, Laptop, Tablet, Server - Physical, Server - Virtual | Cross category suggestion |
| Veeam Agent | Server - Physical, Server - Virtual, NAS | Cross category suggestion |

**Service catalogue:** `phase120StarterServerServices` includes Hypervisor, DNS Server, DHCP Server, File Server, Web Server and other server services. These are independent of installed software in current source. The agreed M-005 design will make the Hypervisor service follow a single physical host hypervisor selection.

## Rules and review questions

1. **Current behaviour:** `phase120SoftwareOptions()` combines active user configured software with built in suggestions, and `phase120SoftwareFieldsFor(type)` filters by exact device type. `phase19BRenderFields()` displays available software as independent checkboxes.
2. **Proposed, not implemented:** Physical servers own a single hypervisor product and version. Virtual servers inherit the platform but retain independent guest OS and version. A confirmed product change updates dependent platform metadata atomically. Version changes do not change dependent records.
3. **Proposed, not implemented:** Support virtual guest firewall and network appliance operating systems, including OPNsense and pfSense, without confusing guest OS identity with the VM's device classification.
4. **To verify:** OS and firmware selector contents, historical version catalogues, custom and archived entries, device type conversions, existing legacy assignments, imports, cancelled edits and failed saves.
5. **Data protection:** Preserve existing values when a catalogue entry is hidden, archived, renamed or no longer suggested. Do not assume hiding a form option is safe migration.

## Verification and traceability

This initial matrix is a **source inventory**, not a complete device by software exhaustive listing and not a completed audit. Expand it from the full software suggestions and user managed catalogue rules before sign off. Record findings in `docs/audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md`, update WF-03 and WF-08 technical workflows, and add executable scenarios to their test matrices. Master audit P12 verification remains incomplete.

**Source:** `app/caffoot-lite.html` on `main`, `phase120SoftwareSuggestions` (line 3455), `phase19BProfiles` (line 6139), `phase120StarterServerServices` (lines 6146 to 6162), `phase19BTypeGroups` (lines 6376 to 6387), `phase120SoftwareOptions` and `phase120SoftwareFieldsFor` (lines 6393 to 6416).

## Agreed presentation naming, 24 October 2026

The product owner approved plural, user facing **category headings** such as **Servers**, **Computers**, **Printers**, **Firewalls**, **Routers**, **Switches** and **Storage** where suitable. Under **Servers**, retain the distinct device types `Server - Physical` and `Server - Virtual`; under **Computers**, retain `Desktop`, `Laptop` and `Tablet`. Category headings are labels, not replacement device type values. Do not use apostrophes to form plurals.

**Implementation boundary:** Preserve `phase19BTypeGroups`, existing saved type strings, compatibility filtering, legacy or custom types and imports. Confirm appropriate headings against the full managed device type list and navigation before any implementation. This is an approved design principle only, not implemented or browser tested.

## RAID and storage array configuration review, 24 October 2026

**Current source finding:** `phase19BChoices.raid` is hard coded to `None`, `RAID 0`, `RAID 1`, `RAID 5`, `RAID 6`, `RAID 10` and `Other`. Both `server` and `nas` profiles expose `raid` and `driveCount`. This was source inspected only; no browser test executed.

**Product owner suggestion, pending final design agreement:** Broaden common options to include appropriate nested RAID configurations such as RAID 50 and RAID 60, and permit user managed custom array types in the same selector, using the existing software catalogue pattern where suitable. Consider ZFS RAIDZ1, RAIDZ2, RAIDZ3 and mirror configurations without presenting ZFS vdev layouts as identical to conventional hardware RAID. Consider a clearer label such as **Storage array configuration**. Preserve the existing `raid` data field and all existing, custom and imported values; do not silently normalise or discard them. Confirm catalogue management, duplicate handling, archived entries, edit and failed save recovery before implementation.

**Scope:** Proposed UI and catalogue improvement for NAS and server device types, not an authorised application change. Add source and browser checks to WF-03 and relevant catalogue tests under WF-08; reconcile the findings and roadmap before implementation.

## Agreed reusable dropdown and catalogue design principle, 24 October 2026

The product owner agreed that reusable RAID configurations should be saved to a shared user managed catalogue, and that dropdown controls should follow the same common implementation and interaction pattern throughout Caffoot Lite, in line with the previously agreed Save, Cancel and Edit consistency objective. Avoid creating a separate RAID only selector mechanism when a reusable, appropriately parameterised component can serve multiple catalogues.

**Safeguards:** Shared presentation and editing code must allow catalogue specific validation, eligibility, archival, historical values, import compatibility and dependencies. A single implementation must not silently replace saved values or remove legacy or custom selections. Inventory editing must remain possible if older values are no longer offered to new records. Existing behaviours should first be mapped and tested before any refactor. Distinguish a shared user interface component from a shared data model, which may not be appropriate for every catalogue.

**Status:** Approved design principle, not an instruction to refactor all dropdowns immediately. No application code changes or browser tests have been executed for this decision. WF-03, WF-07 and WF-08, the findings register, roadmap and master audit require reconciliation as the detailed implementation scope is established.

## Agreed shared form and dialog interaction standard, 24 October 2026

The product owner approved the **code once, use many** principle for Save, Cancel, Close, Exit and Escape handling, alongside shared dropdown and catalogue behaviour. This is a design standard for future work, not authorisation to change application behaviour now.

- **Save:** use consistent validation, clear failure feedback, preservation of draft values and safe rollback of persisted state if a save fails.
- **Cancel:** discard only the intended unsaved edits, with confirmation where changes would otherwise be lost.
- **Close and Exit:** apply the same unsaved changes safeguards as Cancel where appropriate, while preserving any explicitly different navigation semantics.
- **Escape:** follow the relevant dialog's safe close policy, except when an active nested control must handle Escape first. Avoid accidental closing or loss of draft values.
- **Shared implementation:** reuse common dialog lifecycle, dirty state detection, action handling, keyboard behaviour and save feedback where practical. Keep form specific validation, dependencies and data preservation rules configurable. Do not assume every form already has identical behaviour.

**Verification boundary:** Inventory current forms and nested dialogs, source trace existing shared functions, then add targeted WF-07 and WF-03 browser scenarios for normal save, invalid save, failed persistence, cancel, close, Escape and nested controls. Update technical workflows, findings, roadmap and master audit status through reconciliation. No tests executed or application changes authorised by this design agreement.

## Agreed virtual desktop design, 24 October 2026

**Decision:** Desktop devices will support Physical (default) or Virtual deployment. A virtual desktop may reference an eligible physical hypervisor host and has an independent guest OS and version. Laptop and Tablet remain physical only initially. This is a future design requirement, not a description of current implemented behaviour. Preserve existing type values, desktop details, imports and historical OS choices. No VDI management capability is proposed. Cross reference the [maintenance design review](../roadmaps/V1.3X-MAINTENANCE-DESIGN-REVIEW.md).

**Outstanding verification:** Inspect current desktop form, save, load and import logic; plan tests for default physical mode, virtual host eligibility, independent guest OS, conversion, failed save and legacy records. No tests executed.

## Superseding decision: Desktop and Virtual Desktop, 24 October 2026

**Product owner revision:** The earlier proposal to offer Physical and Virtual deployment within the `Desktop` type is **superseded**. Keep `Desktop` **physical only** and introduce a distinct `Virtual Desktop` device type that is **virtual only**. `Laptop` and `Tablet` remain physical only. The Add/Edit form should infer deployment from the selected type for these categories, avoiding a redundant Physical or Virtual question. Virtual Desktop shows eligible host selection, independent guest OS and version, and the relevant VM fields. Reuse the underlying virtual host validation and relationship safeguards rather than duplicate logic.

**Compatibility and implementation boundary:** Do not silently rewrite or discard existing Desktop records, including any imported or custom virtualisation fields. Investigate legacy data and device type registration, validation, conversion and import/export before coding. This explicit type approach for desktops does not overturn the separately agreed purpose and deployment design for suitable devices such as firewalls and NAS. Design agreed only; no application change or release approval. Test matrices and master audit reconciliation remain outstanding.
