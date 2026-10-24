# Device to Software Compatibility Matrix

**Status:** Initial source based inventory, 24 October 2026. **Scope:** Current `main` application source, not a certified published v1.3.0 behaviour matrix. **Verification:** Source inspection only; no browser tests executed.

This document separates software and services that Caffoot Lite currently **offers in the form** from future compatibility decisions. An offered option is not a claim that the actual software can run on that hardware. Custom catalogue entries and archived historical selections require separate verification.

## Device type to form field mapping

The current `phase19BTypeGroups` mapping and `phase19BProfiles` in `app/caffoot-lite.html` (approximately lines 6139 and 6376 to 6387) define the following groups. Additional suggested or custom installed software is appended by `phase120SoftwareFieldsFor(type)` where the catalogue entry's `deviceTypes` includes the selected type.

| Device types | Form group | Existing additional fields and behaviour |
| --- | --- | --- |
| Desktop, Laptop, Tablet | computer | OS, hardware and network details, software selection, Windows licence |
| Server, Server - Physical, Server - Virtual | server | OS, hardware and network details, storage and RAID, installed software and shared server services |
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
