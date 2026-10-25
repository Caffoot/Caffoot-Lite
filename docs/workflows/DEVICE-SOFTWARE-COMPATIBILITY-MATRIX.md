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

**Issue #134 implementation checkpoint, 25 October 2026:** Draft PR #135 implements a shared Add/Edit `Server - Physical` hosting section on the General tab, with hosting disabled for new servers, a recognised hypervisor selector, Custom / Other entry and optional version. It synchronises the existing Hypervisor service flag. The owner visually reviewed the revised General tab favourably. Automated Chromium regression, release candidate validation, documentation consistency and secret scan passed for commit `62bb608` (runs 40194890645, 40194890644, 40194890740 and 40194890646). These checks do not yet establish all required saved reload, historical import, dependent guest and failed save scenarios for #134. The separate NAS, Firewall and Router Physical / Virtual design remains unimplemented. No merge or release authorised.

## Agreed Firewall, Router and NAS deployment design, 24 October 2026

**Approved design direction, not current application behaviour:** Keep a single Firewall, Router and NAS type respectively, each with a Physical or Virtual deployment choice. Physical displays appropriate hardware details; Virtual displays eligible physical hypervisor host selection, inherited hypervisor platform and independent guest OS/version. Preserve existing records, historic/custom values and import compatibility. Unlike Desktop and Virtual Desktop, the type alone does not determine deployment. See [maintenance design review](../roadmaps/V1.3X-MAINTENANCE-DESIGN-REVIEW.md).

**Outstanding:** Trace save/load and type conversion, define legacy defaults, NAS storage/RAID rules, firewall interfaces, router ports, and WF-03/WF-07/WF-08 browser scenarios. No tests executed or code changes authorised.

## Networking device deployment decisions, 24 October 2026

**Agreed future behaviour:** Switch, Layer 3 Switch and Access Point are physical only. Wireless LAN Controller can be Physical or Virtual; virtual controllers may reference eligible physical hypervisor hosts and keep their own controller OS/version. Use shared core fields for Switch and Layer 3 Switch while allowing meaningful differences. A cloud managed access point is still physical. No redundant deployment selection for fixed types.

**Current source mismatch:** `phase19BTypeGroups` does not map Layer 3 Switch to the switch detailed profile, though `phase120PlatformGroup` maps its software suggestions to switch. Wireless LAN Controller uses the generic network detail profile but controller software suggestions. These are source findings, not browser verified defects. Preserve legacy/custom records and confirm field applicability before implementation. No tests executed.

## Agreed networking field simplicity, 24 October 2026

**Product owner decision:** Replace the proposed fixed list approach for networking port count with a straightforward numeric entry that accepts the actual nonnegative whole number, optionally offering common suggestions without restricting the value. Keep specialist networking details optional, including relevant PoE capability, Wi-Fi standard, management method, interfaces and controller fields, while presenting them only for applicable device types. Apply the rule that the form must not ask for details already determined by the device type. Existing saved port count values and historical imports must remain compatible; avoid turning blank optional values into zero. Confirm the precise field mapping and constraints in implementation design before changing behaviour.

**Evidence and approval boundary:** Current source has fixed port choices `4, 8, 12, 16, 24, 48` in `phase19BChoices.portCount`. This is a design decision only, not a claim of browser verification. No application changes, tests, merge or release. Technical workflows, WF-03/WF-07/WF-08 matrices, findings and master audit reconciliation remain open.

## Agreed Printer, Scanner, UPS and PDU applicability, 24 October 2026

Printer, Scanner, UPS and PDU are physical only. Display only relevant optional specialist fields: Printer colour/technology/connection; Scanner scanner type/connection/optional document feeder, not printer technology; UPS outlets/optional capacity in VA/management connection; PDU outlets/optional managed status/management connection. Preserve existing imported and historical values even if no longer displayed in the revised form. Current code maps Scanner to the printer detailed profile and leaves PDU without a dedicated profile or PDU-specific firmware suggestions. These are source observations, not browser test results. This is approved design, not implementation approval. Technical workflows, findings, test matrices and master audit reconciliation remain outstanding.

## Permanent compatibility rule for historical and custom device types, 24 October 2026

**Product owner agreed:** Existing historical and user-defined device types must remain reopenable and editable even when absent from the latest standard catalogue. Preserve the original saved device type string, existing type-specific data and other unrelated inventory values. Do not force a conversion or reject an unrelated save solely because the type or one of its historical values is no longer a current suggestion. Type changes may hide inapplicable fields but must not silently erase their saved values. Apply this principle to editing, duplication, backup/import and later migrations. Any deliberate conversion or deletion requires explicit user intent and suitable safeguards.

**Approval and verification status:** This is an agreed compatibility requirement, not approval for application changes. Verify actual behaviour and round-trip preservation in future tests; no tests executed for this checkpoint. Technical workflows, test matrices, findings and master audit reconciliation remain outstanding.

## Agreed separation of platform, virtualisation, software and services, 24 October 2026

**Product owner approved design:** Present four distinct concepts in appropriate device form sections: (1) operating system or device firmware, (2) virtualisation platform, where relevant, (3) installed software and guest tools, and (4) server roles or services. Reusable underlying catalogue controls are welcome but must not blur their meaning or eligibility. A physical hypervisor host's platform is distinct from a VM's guest OS; a software product is not automatically a service merely because it can provide one. Preserve historical/custom catalogue values and existing records. Do not let a catalogue suggestion change alone make previously recorded data obsolete.

**Implementation boundary:** Design agreement only, not permission to alter application behaviour. Investigate field mapping, type conversions, server role visibility, backup round trips and regression tests before implementation. No tests executed at this checkpoint; workflow, test matrix, findings and master audit reconciliation outstanding.

## Approved shared server service catalogue, 24 October 2026

**Product owner agreed:** Physical and virtual servers share one catalogue of ordinary server roles and services. Hypervisor capability is managed by the dedicated physical server host settings rather than a separate unrelated service choice. Installing software does not automatically assign a server service. Historical, specialist, custom and archived service selections remain protected in existing device records, conversions and backups. Archiving a service must not delete previous assignments. No blanket physical-only restriction on ordinary server services.

**Boundary:** This is a design decision only, not authorisation for code changes. Reconcile the existing `serverService_Hypervisor` persisted key with the future host control without losing historical data. Confirm source mappings and test physical/virtual services, archived custom values, conversion and backup round trips before implementation. No tests executed at this checkpoint; technical workflows, test matrices, findings and master audit reconciliation remain outstanding.


**Issue #134 updated verification, 25 October 2026:** Chromium [40208779489](https://github.com/Caffoot/Caffoot-Lite/actions/runs/40208779489), release validation 40208779888, documentation consistency 40208779738 and secret scan 40208779620 passed at `19b5bf0`. The #134 browser checks now demonstrate a recognised Microsoft Hyper-V host setting surviving save and reload, and a historical custom hypervisor with its linked virtual guest surviving actual JSON file import and reload. The imported fixture is generated from current inventory data, not proof of a browser export/reimport cycle or every legacy v1.2/v1.2.1 variant. Existing #91 guest safety and rollback tests are applicable evidence; no new #134-only guest mutation test is claimed. Earlier checkpoint statements remain historical, superseded by this update. PR #135 remains draft on `release/v1.3.1`, awaiting final acceptance; no merge or release.
