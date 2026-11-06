# Device Editor Discrepancy Matrix

Reference: pinned `devices-details-forms-batch-04.html` at `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. Baseline: `f528396dc57d25d304b67290d6507d02dce0eb09`. The initial 33-state baseline is preserved below; the completed responsive/functional checks and remaining decisions are recorded first. The source HTML and CSS remain unchanged.

## Current Result

The uncontested restorations are implemented. [208 main-tab comparisons](editor-comparisons.json) cover eleven Add/Edit/Duplicate/type scenarios at 1440×950 and 390×844 in both themes. Complete fields/cards/actions are deduplicated into named sets; each case retains its exact live/source set references and geometry. The 33-state baseline below remains historical evidence.

[Twenty expanded inline comparisons](inline-editor-results.json) cover Location, Manufacturer, Model, Software and Server Service creation at both widths/themes. Twelve match the source measurements/labels/actions; eight software/service cases retain the existing 80-character limit where the preview says 100. That policy decision remains open. All creation fields use the source's 39px size; search fields use 38px.

[Real saved workflows](device-workflows.json) verify Proxmox OS/software does not grant hosting, copied unflagged physical records remain ineligible, an explicitly enabled physical host can create VMs, guest edit/duplicate/reload retains relationships, known legacy OS values are shown, and an incomplete guest retains its missing-host identity and unknown fields. Later value-preservation refinements were checked with targeted workflows and current captures; the unchanged layout matrix was reused rather than rerun needlessly.

| Area | Result | Preservation / remaining decision |
| --- | --- | --- |
| Dialog, tabs and footer | Source bounds, card order, 20/16px card padding, tab entry at top, × close control and Add/Edit/Duplicate footer actions checked | Existing focus/discard/permission handlers retained. Duplicate Back to Details returns to the original record. |
| General physical | Identity, deployment, classification, location, edit-only status and mounting/rack fields retained | Existing bounded rack selectors, create actions and validation are not removed. |
| General VM | Host/resources remain on General; Hardware tab and physical mounting are omitted as applicable | Legacy/incomplete assignment metadata is preserved; new/copy VMs still require an eligible host. |
| Hardware | Source Manufacturer/Model/Serial labels and approved field/card treatment restored | Existing type-specific hardware/catalogue controls remain at baseline positions pending placement approval. |
| Software & Firmware | OS card stays visible independently; source four-card order, 17×17px host checkbox, host grid, software/service checklists and compact searches checked | The source's two explicit hosting presentations share one canonical value. No OS/software inference enables hosting. Existing version/custom/catalogue controls remain pending the preservation decision. |
| Networking | Source card hierarchy, Primary IP label and reservation checkbox/help retained | VLAN, available-IP and creation controls, required fields and permission restrictions remain; the preview does not contain every working control. |
| Notes | Source card, text field and common formatting controls retained | Existing Numbers/Code/Link tools are preserved; their precise presentation is within the open placement decision. |
| Expanded creation | Source labels, actions, 39px inputs and current catalogue associations checked | Existing 80-character software/service validation is not silently expanded to the preview's 100. |

**Open decisions:** [working-control preservation placements](https://github.com/Caffoot/Caffoot-Lite/issues/326#issuecomment-6684664810) and [80/100-character validation conflict](https://github.com/Caffoot/Caffoot-Lite/issues/326#issuecomment-6688818756). Neither is approved. Existing controls have not been deleted or moved under those proposals. Full literal-design fidelity and owner visual acceptance are therefore not claimed.

The source is a standalone preview with illustrative inventory, no real persistence and preview-only descriptions. Real data, explicit validation/permission locks, custom catalogue choices and the existing shared dark palette remain functional. Matching geometry does not mean those deliberate data/permission differences are hidden or treated as identical.

## Initial Baseline Record

## Confirmed Corrections

| Item | Baseline difference | Correction / next check |
| --- | --- | --- |
| Hosting checkbox | About 439×42px, inherited broad field rule | Reuse the pinned checkbox structure/class: 17×17px. Keep Software & Firmware placement. |
| Host grid and OS card | Sequential hypervisor fields; OS card hidden when hosting | Restore the source two-column host configuration and retain visible OS card independently. |
| Tab entry | Retains old body scroll offset | Reset only editor body scroll when changing tabs, as in the source. |
| Close control | Text Close × | Source × control, retaining accessible name and existing close handler. |
| Search fields | 42px rather than source 38px | Apply the pinned compact inline toolbar height. |
| Software availability | Hidden for non-server/computer types | Restore Installed Software for applicable physical types, using existing catalogue/data keys. |
| Cards, labels, guidance | Several integrated paraphrases | Restore source descriptions/labels while preserving required validation. |
| Functional additions | Hardware, custom OS/version, network and catalogue actions absent from preview | Approval requested in #326 comment 6684664810; keep working controls pending that decision. |

## Every Captured Field And Control

Each state lists all existing fields; catalogue checkbox labels are included in the raw [baseline JSON](editor-before.json). Searchable selects retain an intentionally clipped native accessibility element, so its small rectangle is not the visible trigger size. Actual trigger/layout comparisons belong to the final rendered checks.

### add-physical — general

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Device Name * | `dev-name` | Retained live control; compare source labels/order and existing validation |
| Device deployment | `dev-deployment` | Retained live control; compare source labels/order and existing validation |
| Physical device type | `dev-type` | Retained live control; compare source labels/order and existing validation |
| Location Area * | `dev-location` | Retained live control; compare source labels/order and existing validation |
| Device Mounting | `dev-mount-type` | Retained live control; compare source labels/order and existing validation |
| Rack | `dev-rack-id` | Retained live control; compare source labels/order and existing validation |
| Face | `dev-rack-face` | Retained live control; compare source labels/order and existing validation |
| Start U | `dev-rack-u` | Retained live control; compare source labels/order and existing validation |
| U Height | `dev-rack-height` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Device Identity, ▣Mounting & Rack Configuration.
Live cards: ▣Device Identity, ▣Mounting & Rack Configuration.

Source actions: + Add Location.
Live actions: Server, + Add Location, + Create Network Rack.

### add-physical — hardware

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Manufacturer (optional) | `dev-manufacturer-select` | Retained live control; compare source labels/order and existing validation |
| Model (optional) | `dev-model-select` | Retained live control; compare source labels/order and existing validation |
| Serial number (optional) | `dev-serial` | Retained live control; compare source labels/order and existing validation |
| Network card | `device-detail-networkCard` | Retained live control; compare source labels/order and existing validation |
| Network connection method | `device-detail-networkConnection` | Retained live control; compare source labels/order and existing validation |
| Processor | `device-detail-processor` | Retained live control; compare source labels/order and existing validation |
| Graphics card | `device-detail-graphics` | Retained live control; compare source labels/order and existing validation |
| Memory size | `device-detail-memory` | Retained live control; compare source labels/order and existing validation |
| Memory unit | `device-detail-memoryUnit` | Retained live control; compare source labels/order and existing validation |
| Storage size | `device-detail-storage` | Retained live control; compare source labels/order and existing validation |
| Storage unit | `device-detail-storageUnit` | Retained live control; compare source labels/order and existing validation |
| RAID type | `device-detail-raid` | Retained live control; compare source labels/order and existing validation |
| Number of hard drives | `device-detail-driveCount` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Hardware & Lifecycle.
Live cards: ▣Hardware & Lifecycle.

Source actions: + Add Manufacturer, + Add Model.
Live actions: Select Manufacturer..., + Add Manufacturer, + Add Model, Manage Hardware Catalogue.

### add-physical — software

| Source field | Live field | Status / reason |
| --- | --- | --- |
|  | `platform-select` | Retained live control; compare source labels/order and existing validation |
| OS / Platform Version (optional) | `version-select` | Retained live control; compare source labels/order and existing validation |
| Search software | `review-search-software` | Retained live control; compare source labels/order and existing validation |
| This physical server hosts virtual machinesEnable this option if the physical server will host virtual machines. | `device-hosting-enabled` | Compact checkbox correction |
| Search server services | `review-search-services` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Operating System / Platform, ▣Installed Software, ▣Virtualisation / Hypervisor, ▣Server Services.
Live cards: ▣Operating System / Platform, ▣Installed Software, ▣Virtualisation / Hypervisor, ▣Server Services.

Source actions: + Add Software, + Add Server Service.
Live actions: Select a platform..., Manage Installed Software, + Add Software, Manage Server Services, + Add Server Service.

### add-physical — networking

| Source field | Live field | Status / reason |
| --- | --- | --- |
| IP Address Block | `dev-block` | Retained live control; compare source labels/order and existing validation |
| Subnet * | `dev-subnet` | Retained live control; compare source labels/order and existing validation |
| Device IP address * | `dev-ip` | Retained live control; compare source labels/order and existing validation |
| Or choose an available IP | `dev-ip-available` | Retained live control; compare source labels/order and existing validation |
| VLAN | `dev-vlan` | Retained live control; compare source labels/order and existing validation |
| Reserve this IP address for this deviceKeeps this same IP linked to the device, but displays it as Reserved in IPAM. No second address is needed. | `dev-ip-reserved` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Network Identity, ▣Subnet Guidance.
Live cards: ▣Network Identity, ▣Subnet Guidance.

Source actions: .
Live actions: Create subnet in IPAM.

### add-physical — notes

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Notes | `dev-notes` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Notes / Details.
Live cards: ▣Notes / Details.

Source actions: Bold, Italic, Bullets, Heading, Preview.
Live actions: Bold, Italic, Bullets, Heading, Numbers, Code, Link, Preview.

### edit-physical — general

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Device Name * | `dev-name` | Retained live control; compare source labels/order and existing validation |
| Deployment | `dev-deployment` | Retained live control; compare source labels/order and existing validation |
| Physical device type | `dev-type` | Retained live control; compare source labels/order and existing validation |
| Location Area * | `dev-location` | Retained live control; compare source labels/order and existing validation |
| Device Status | `dev-status` | Retained live control; compare source labels/order and existing validation |
| Device Mounting | `dev-mount-type` | Retained live control; compare source labels/order and existing validation |
| Rack | `dev-rack-id` | Retained live control; compare source labels/order and existing validation |
| Face | `dev-rack-face` | Retained live control; compare source labels/order and existing validation |
| Start U | `dev-rack-u` | Retained live control; compare source labels/order and existing validation |
| U Height | `dev-rack-height` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Device Identity, ▣Mounting & Rack Configuration.
Live cards: ▣Device Identity, ▣Mounting & Rack Configuration.

Source actions: + Add Location.
Live actions: + Add Location, U2–U2, + Create Network Rack.

### edit-physical — hardware

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Manufacturer (optional) | `dev-manufacturer-select` | Retained live control; compare source labels/order and existing validation |
| Model (optional) | `dev-model-select` | Retained live control; compare source labels/order and existing validation |
| Serial number (optional) | `dev-serial` | Retained live control; compare source labels/order and existing validation |
| Network card | `device-detail-networkCard` | Retained live control; compare source labels/order and existing validation |
| Network connection method | `device-detail-networkConnection` | Retained live control; compare source labels/order and existing validation |
| Processor | `device-detail-processor` | Retained live control; compare source labels/order and existing validation |
| Graphics card | `device-detail-graphics` | Retained live control; compare source labels/order and existing validation |
| Memory size | `device-detail-memory` | Retained live control; compare source labels/order and existing validation |
| Memory unit | `device-detail-memoryUnit` | Retained live control; compare source labels/order and existing validation |
| Storage size | `device-detail-storage` | Retained live control; compare source labels/order and existing validation |
| Storage unit | `device-detail-storageUnit` | Retained live control; compare source labels/order and existing validation |
| RAID type | `device-detail-raid` | Retained live control; compare source labels/order and existing validation |
| Number of hard drives | `device-detail-driveCount` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Hardware & Lifecycle.
Live cards: ▣Hardware & Lifecycle.

Source actions: + Add Manufacturer, + Add Model.
Live actions: Select Manufacturer..., + Add Manufacturer, + Add Model, Manage Hardware Catalogue.

### edit-physical — software

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Search software | `review-search-software` | Retained live control; compare source labels/order and existing validation |
| This physical server hosts virtual machinesEnable this option if the physical server will host virtual machines. | `device-hosting-enabled` | Compact checkbox correction |
| Hypervisor software | `host-platform-select` | Retained live control; compare source labels/order and existing validation |
| Hypervisor version (optional) | `host-version` | Retained live control; compare source labels/order and existing validation |
| Search server services | `review-search-services` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Operating System / Platform, ▣Installed Software, ▣Virtualisation / Hypervisor, ▣Server Services.
Live cards: ▣Installed Software, ▣Virtualisation / Hypervisor, ▣Server Services.

Source actions: + Add Software, + Add Server Service.
Live actions: Manage Installed Software, + Add Software, Manage Server Services, + Add Server Service.

### edit-physical — networking

| Source field | Live field | Status / reason |
| --- | --- | --- |
| IP Address Block | `dev-block` | Retained live control; compare source labels/order and existing validation |
| Subnet * | `dev-subnet` | Retained live control; compare source labels/order and existing validation |
| Device IP address * | `dev-ip` | Retained live control; compare source labels/order and existing validation |
| Or choose an available IP | `dev-ip-available` | Retained live control; compare source labels/order and existing validation |
| VLAN | `dev-vlan` | Retained live control; compare source labels/order and existing validation |
| Reserve this IP address for this deviceKeeps this same IP linked to the device, but displays it as Reserved in IPAM. No second address is needed. | `dev-ip-reserved` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Network Identity, ▣Subnet Guidance.
Live cards: ▣Network Identity, ▣Subnet Guidance.

Source actions: .
Live actions: 10.0.10.20 (current), Create subnet in IPAM.

### edit-physical — notes

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Notes | `dev-notes` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Notes / Details.
Live cards: ▣Notes / Details.

Source actions: Bold, Italic, Bullets, Heading, Preview.
Live actions: Bold, Italic, Bullets, Heading, Numbers, Code, Link, Preview.

### duplicate-physical — general

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Device Name * | `dev-name` | Retained live control; compare source labels/order and existing validation |
| Device deployment | `dev-deployment` | Retained live control; compare source labels/order and existing validation |
| Physical device type | `dev-type` | Retained live control; compare source labels/order and existing validation |
| Location Area * | `dev-location` | Retained live control; compare source labels/order and existing validation |
| Device Mounting | `dev-mount-type` | Retained live control; compare source labels/order and existing validation |
| Rack | `dev-rack-id` | Retained live control; compare source labels/order and existing validation |
| Face | `dev-rack-face` | Retained live control; compare source labels/order and existing validation |
| Start U | `dev-rack-u` | Retained live control; compare source labels/order and existing validation |
| U Height | `dev-rack-height` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Device Identity, ▣Mounting & Rack Configuration.
Live cards: ▣Device Identity, ▣Mounting & Rack Configuration.

Source actions: + Add Location.
Live actions: Server, + Add Location, U1–U1, + Create Network Rack.

### duplicate-physical — hardware

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Manufacturer (optional) | `dev-manufacturer-select` | Retained live control; compare source labels/order and existing validation |
| Model (optional) | `dev-model-select` | Retained live control; compare source labels/order and existing validation |
| Serial number (optional) | `dev-serial` | Retained live control; compare source labels/order and existing validation |
| Network card | `device-detail-networkCard` | Retained live control; compare source labels/order and existing validation |
| Network connection method | `device-detail-networkConnection` | Retained live control; compare source labels/order and existing validation |
| Processor | `device-detail-processor` | Retained live control; compare source labels/order and existing validation |
| Graphics card | `device-detail-graphics` | Retained live control; compare source labels/order and existing validation |
| Memory size | `device-detail-memory` | Retained live control; compare source labels/order and existing validation |
| Memory unit | `device-detail-memoryUnit` | Retained live control; compare source labels/order and existing validation |
| Storage size | `device-detail-storage` | Retained live control; compare source labels/order and existing validation |
| Storage unit | `device-detail-storageUnit` | Retained live control; compare source labels/order and existing validation |
| RAID type | `device-detail-raid` | Retained live control; compare source labels/order and existing validation |
| Number of hard drives | `device-detail-driveCount` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Hardware & Lifecycle.
Live cards: ▣Hardware & Lifecycle.

Source actions: + Add Manufacturer, + Add Model.
Live actions: Select Manufacturer..., + Add Manufacturer, + Add Model, Manage Hardware Catalogue.

### duplicate-physical — software

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Search software | `review-search-software` | Retained live control; compare source labels/order and existing validation |
| This physical server hosts virtual machinesEnable this option if the physical server will host virtual machines. | `device-hosting-enabled` | Compact checkbox correction |
| Hypervisor software | `host-platform-select` | Retained live control; compare source labels/order and existing validation |
| Hypervisor version (optional) | `host-version` | Retained live control; compare source labels/order and existing validation |
| Search server services | `review-search-services` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Operating System / Platform, ▣Installed Software, ▣Virtualisation / Hypervisor, ▣Server Services.
Live cards: ▣Installed Software, ▣Virtualisation / Hypervisor, ▣Server Services.

Source actions: + Add Software, + Add Server Service.
Live actions: Manage Installed Software, + Add Software, Manage Server Services, + Add Server Service.

### duplicate-physical — networking

| Source field | Live field | Status / reason |
| --- | --- | --- |
| IP Address Block | `dev-block` | Retained live control; compare source labels/order and existing validation |
| Subnet * | `dev-subnet` | Retained live control; compare source labels/order and existing validation |
| Device IP address * | `dev-ip` | Retained live control; compare source labels/order and existing validation |
| Or choose an available IP | `dev-ip-available` | Retained live control; compare source labels/order and existing validation |
| VLAN | `dev-vlan` | Retained live control; compare source labels/order and existing validation |
| Reserve this IP address for this deviceKeeps this same IP linked to the device, but displays it as Reserved in IPAM. No second address is needed. | `dev-ip-reserved` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Network Identity, ▣Subnet Guidance.
Live cards: ▣Network Identity, ▣Subnet Guidance.

Source actions: .
Live actions: Select next available IP..., Create subnet in IPAM.

### duplicate-physical — notes

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Notes | `dev-notes` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Notes / Details.
Live cards: ▣Notes / Details.

Source actions: Bold, Italic, Bullets, Heading, Preview.
Live actions: Bold, Italic, Bullets, Heading, Numbers, Code, Link, Preview.

### edit-vm — general

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Device Name * | `dev-name` | Retained live control; compare source labels/order and existing validation |
| Deployment | `dev-deployment` | Retained live control; compare source labels/order and existing validation |
| Physical device type | `dev-type` | Retained live control; compare source labels/order and existing validation |
| Virtual Machine purpose | `dev-vm-purpose` | Retained live control; compare source labels/order and existing validation |
| Location Area * | `dev-location` | Retained live control; compare source labels/order and existing validation |
| Device Status | `dev-status` | Retained live control; compare source labels/order and existing validation |
| Physical Hypervisor Host (legacy assignments preserved) | `dev-virtual-host` | Retained live control; compare source labels/order and existing validation |
| vCPU count | `dev-vmVcpu` | Retained live control; compare source labels/order and existing validation |
| Allocated RAM (GB) | `dev-vmRamGb` | Retained live control; compare source labels/order and existing validation |
| Virtual disk (GB) | `dev-vmDiskGb` | Retained live control; compare source labels/order and existing validation |
| Virtual network adapters | `dev-vmNicCount` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Device Identity, ▣Virtual Machine Configuration.
Live cards: ▣Device Identity, ▣Virtual Machine Configuration.

Source actions: + Add Location.
Live actions: + Add Location.

### edit-vm — software

| Source field | Live field | Status / reason |
| --- | --- | --- |
|  | `platform-select` | Retained live control; compare source labels/order and existing validation |
| OS / Platform Version (optional) | `version-select` | Retained live control; compare source labels/order and existing validation |
| Search software | `review-search-software` | Retained live control; compare source labels/order and existing validation |
| Search server services | `review-search-services` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Operating System / Platform, ▣Installed Software, ▣Server Services.
Live cards: ▣Operating System / Platform, ▣Installed Software, ▣Server Services.

Source actions: + Add Software, + Add Server Service.
Live actions: Manage Installed Software, + Add Software, Manage Server Services, + Add Server Service.

### edit-vm — networking

| Source field | Live field | Status / reason |
| --- | --- | --- |
| IP Address Block | `dev-block` | Retained live control; compare source labels/order and existing validation |
| Subnet * | `dev-subnet` | Retained live control; compare source labels/order and existing validation |
| Device IP address * | `dev-ip` | Retained live control; compare source labels/order and existing validation |
| Or choose an available IP | `dev-ip-available` | Retained live control; compare source labels/order and existing validation |
| VLAN | `dev-vlan` | Retained live control; compare source labels/order and existing validation |
| Reserve this IP address for this deviceKeeps this same IP linked to the device, but displays it as Reserved in IPAM. No second address is needed. | `dev-ip-reserved` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Network Identity, ▣Subnet Guidance.
Live cards: ▣Network Identity, ▣Subnet Guidance.

Source actions: .
Live actions: 10.0.10.41 (current), Create subnet in IPAM.

### edit-vm — notes

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Notes | `dev-notes` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Notes / Details.
Live cards: ▣Notes / Details.

Source actions: Bold, Italic, Bullets, Heading, Preview.
Live actions: Bold, Italic, Bullets, Heading, Numbers, Code, Link, Preview.

### add-vm — general

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Device Name * | `dev-name` | Retained live control; compare source labels/order and existing validation |
| Device deployment | `dev-deployment` | Retained live control; compare source labels/order and existing validation |
| Virtual Machine purpose | `dev-vm-purpose` | Retained live control; compare source labels/order and existing validation |
| Location Area * | `dev-location` | Retained live control; compare source labels/order and existing validation |
| Physical Hypervisor Host (required) | `dev-virtual-host` | Retained live control; compare source labels/order and existing validation |
| vCPU count | `dev-vmVcpu` | Retained live control; compare source labels/order and existing validation |
| Allocated RAM (GB) | `dev-vmRamGb` | Retained live control; compare source labels/order and existing validation |
| Virtual disk (GB) | `dev-vmDiskGb` | Retained live control; compare source labels/order and existing validation |
| Virtual network adapters | `dev-vmNicCount` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Device Identity, ▣Virtual Machine Configuration.
Live cards: ▣Device Identity, ▣Virtual Machine Configuration.

Source actions: + Add Location.
Live actions: + Add Location.

### add-vm — software

| Source field | Live field | Status / reason |
| --- | --- | --- |
|  | `platform-select` | Retained live control; compare source labels/order and existing validation |
| OS / Platform Version (optional) | `version-select` | Retained live control; compare source labels/order and existing validation |
| Search software | `review-search-software` | Retained live control; compare source labels/order and existing validation |
| Search server services | `review-search-services` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Operating System / Platform, ▣Installed Software, ▣Server Services.
Live cards: ▣Operating System / Platform, ▣Installed Software, ▣Server Services.

Source actions: + Add Software, + Add Server Service.
Live actions: Manage Installed Software, + Add Software, Manage Server Services, + Add Server Service.

### add-vm — networking

| Source field | Live field | Status / reason |
| --- | --- | --- |
| IP Address Block | `dev-block` | Retained live control; compare source labels/order and existing validation |
| Subnet * | `dev-subnet` | Retained live control; compare source labels/order and existing validation |
| Device IP address * | `dev-ip` | Retained live control; compare source labels/order and existing validation |
| Or choose an available IP | `dev-ip-available` | Retained live control; compare source labels/order and existing validation |
| VLAN | `dev-vlan` | Retained live control; compare source labels/order and existing validation |
| Reserve this IP address for this deviceKeeps this same IP linked to the device, but displays it as Reserved in IPAM. No second address is needed. | `dev-ip-reserved` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Network Identity, ▣Subnet Guidance.
Live cards: ▣Network Identity, ▣Subnet Guidance.

Source actions: .
Live actions: Create subnet in IPAM.

### add-vm — notes

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Notes | `dev-notes` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Notes / Details.
Live cards: ▣Notes / Details.

Source actions: Bold, Italic, Bullets, Heading, Preview.
Live actions: Bold, Italic, Bullets, Heading, Numbers, Code, Link, Preview.

### desktop — general

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Device Name * | `dev-name` | Retained live control; compare source labels/order and existing validation |
| Device deployment | `dev-deployment` | Retained live control; compare source labels/order and existing validation |
| Physical device type | `dev-type` | Retained live control; compare source labels/order and existing validation |
| Location Area * | `dev-location` | Retained live control; compare source labels/order and existing validation |
| Device Mounting | `dev-mount-type` | Retained live control; compare source labels/order and existing validation |
| Rack | `dev-rack-id` | Retained live control; compare source labels/order and existing validation |
| Face | `dev-rack-face` | Retained live control; compare source labels/order and existing validation |
| Start U | `dev-rack-u` | Retained live control; compare source labels/order and existing validation |
| U Height | `dev-rack-height` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Device Identity, ▣Mounting & Rack Configuration.
Live cards: ▣Device Identity, ▣Mounting & Rack Configuration.

Source actions: + Add Location.
Live actions: Desktop, + Add Location, + Create Network Rack.

### desktop — hardware

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Manufacturer (optional) | `dev-manufacturer-select` | Retained live control; compare source labels/order and existing validation |
| Model (optional) | `dev-model-select` | Retained live control; compare source labels/order and existing validation |
| Serial number (optional) | `dev-serial` | Retained live control; compare source labels/order and existing validation |
| Network card | `device-detail-networkCard` | Retained live control; compare source labels/order and existing validation |
| Network connection method | `device-detail-networkConnection` | Retained live control; compare source labels/order and existing validation |
| Processor | `device-detail-processor` | Retained live control; compare source labels/order and existing validation |
| Graphics card | `device-detail-graphics` | Retained live control; compare source labels/order and existing validation |
| Memory size | `device-detail-memory` | Retained live control; compare source labels/order and existing validation |
| Memory unit | `device-detail-memoryUnit` | Retained live control; compare source labels/order and existing validation |
| Storage size | `device-detail-storage` | Retained live control; compare source labels/order and existing validation |
| Storage unit | `device-detail-storageUnit` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Hardware & Lifecycle.
Live cards: ▣Hardware & Lifecycle.

Source actions: + Add Manufacturer, + Add Model.
Live actions: Select Manufacturer..., + Add Manufacturer, + Add Model, Manage Hardware Catalogue.

### desktop — software

| Source field | Live field | Status / reason |
| --- | --- | --- |
|  | `platform-select` | Retained live control; compare source labels/order and existing validation |
| OS / Platform Version (optional) | `version-select` | Retained live control; compare source labels/order and existing validation |
| Search software | `review-search-software` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Operating System / Platform, ▣Installed Software.
Live cards: ▣Operating System / Platform, ▣Installed Software.

Source actions: + Add Software.
Live actions: Manage Installed Software, + Add Software.

### desktop — networking

| Source field | Live field | Status / reason |
| --- | --- | --- |
| IP Address Block | `dev-block` | Retained live control; compare source labels/order and existing validation |
| Subnet * | `dev-subnet` | Retained live control; compare source labels/order and existing validation |
| Device IP address * | `dev-ip` | Retained live control; compare source labels/order and existing validation |
| Or choose an available IP | `dev-ip-available` | Retained live control; compare source labels/order and existing validation |
| VLAN | `dev-vlan` | Retained live control; compare source labels/order and existing validation |
| Reserve this IP address for this deviceKeeps this same IP linked to the device, but displays it as Reserved in IPAM. No second address is needed. | `dev-ip-reserved` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Network Identity, ▣Subnet Guidance.
Live cards: ▣Network Identity, ▣Subnet Guidance.

Source actions: .
Live actions: Create subnet in IPAM.

### desktop — notes

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Notes | `dev-notes` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Notes / Details.
Live cards: ▣Notes / Details.

Source actions: Bold, Italic, Bullets, Heading, Preview.
Live actions: Bold, Italic, Bullets, Heading, Numbers, Code, Link, Preview.

### switch — general

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Device Name * | `dev-name` | Retained live control; compare source labels/order and existing validation |
| Device deployment | `dev-deployment` | Retained live control; compare source labels/order and existing validation |
| Physical device type | `dev-type` | Retained live control; compare source labels/order and existing validation |
| Location Area * | `dev-location` | Retained live control; compare source labels/order and existing validation |
| Device Mounting | `dev-mount-type` | Retained live control; compare source labels/order and existing validation |
| Rack | `dev-rack-id` | Retained live control; compare source labels/order and existing validation |
| Face | `dev-rack-face` | Retained live control; compare source labels/order and existing validation |
| Start U | `dev-rack-u` | Retained live control; compare source labels/order and existing validation |
| U Height | `dev-rack-height` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Device Identity, ▣Mounting & Rack Configuration.
Live cards: ▣Device Identity, ▣Mounting & Rack Configuration.

Source actions: + Add Location.
Live actions: Switch, + Add Location, + Create Network Rack.

### switch — hardware

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Manufacturer (optional) | `dev-manufacturer-select` | Retained live control; compare source labels/order and existing validation |
| Model (optional) | `dev-model-select` | Retained live control; compare source labels/order and existing validation |
| Serial number (optional) | `dev-serial` | Retained live control; compare source labels/order and existing validation |
| Number of ports | `device-detail-portCount` | Retained live control; compare source labels/order and existing validation |
| Network card | `device-detail-networkCard` | Retained live control; compare source labels/order and existing validation |
| Network connection method | `device-detail-networkConnection` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Hardware & Lifecycle.
Live cards: ▣Hardware & Lifecycle.

Source actions: + Add Manufacturer, + Add Model.
Live actions: Select Manufacturer..., + Add Manufacturer, + Add Model, Manage Hardware Catalogue.

### switch — software

| Source field | Live field | Status / reason |
| --- | --- | --- |
|  | `platform-select` | Retained live control; compare source labels/order and existing validation |
| Software / Firmware Version (optional) | `version-select` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Operating System / Platform, ▣Installed Software.
Live cards: ▣Operating System / Platform.

Source actions: + Add Software.
Live actions: Select a platform....

### switch — networking

| Source field | Live field | Status / reason |
| --- | --- | --- |
| IP Address Block | `dev-block` | Retained live control; compare source labels/order and existing validation |
| Subnet * | `dev-subnet` | Retained live control; compare source labels/order and existing validation |
| Device IP address * | `dev-ip` | Retained live control; compare source labels/order and existing validation |
| Or choose an available IP | `dev-ip-available` | Retained live control; compare source labels/order and existing validation |
| VLAN | `dev-vlan` | Retained live control; compare source labels/order and existing validation |
| Reserve this IP address for this deviceKeeps this same IP linked to the device, but displays it as Reserved in IPAM. No second address is needed. | `dev-ip-reserved` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Network Identity, ▣Subnet Guidance.
Live cards: ▣Network Identity, ▣Subnet Guidance.

Source actions: .
Live actions: Create subnet in IPAM.

### switch — notes

| Source field | Live field | Status / reason |
| --- | --- | --- |
| Notes | `dev-notes` | Retained live control; compare source labels/order and existing validation |

Source cards: ▣Notes / Details.
Live cards: ▣Notes / Details.

Source actions: Bold, Italic, Bullets, Heading, Preview.
Live actions: Bold, Italic, Bullets, Heading, Numbers, Code, Link, Preview.

