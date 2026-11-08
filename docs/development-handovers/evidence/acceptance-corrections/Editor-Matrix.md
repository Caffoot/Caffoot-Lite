# Device Editor Discrepancy Matrix

Reference: pinned `devices-details-forms-batch-04.html` at `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. Baseline: `f528396dc57d25d304b67290d6507d02dce0eb09`. The initial 33-state baseline is preserved below; the completed responsive/functional checks and remaining decisions are recorded first. The source HTML and CSS remain unchanged.

## Current Result

Both outstanding provisions are now explicitly authorised and implemented. See the [final #326 placement matrix, checks and evidence](../issue-326-final/Report.md). The completed batch's [208 main-tab comparisons](editor-comparisons.json) remain valid bounded historical measurements. The final follow-up adds [40 placement comparisons and real saved workflows](../issue-326-final/preservation-results.json) and [20/20 matched expanded forms](../issue-326-final/inline-editor-results.json), including the consistent 100-character limit. The earlier eight held cases are superseded by those new measurements, not silently relabelled in the old JSON.

All five retained-control groups remain in their explicitly authorised cards/toolbars. Hardware has no extra nested card treatment; software/service managers use the approved small buttons while retaining type-based visibility. Custom platform/version, VLAN/available-IP/subnet creation, rack creation and Numbers/Code/Link remain functional. No new card/tab/feature or remaining design-decision blocker is introduced. Owner private visual/native-browser/accessibility acceptance remains separate.

The original 33-state baseline and subsequent corrections below are historical evidence. Their references to the then-pending placements/validation decision are superseded by the linked final report and approval record, not current blockers.

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

