# Batch 7A — Original Requirement And State Mapping

**27 November 2026. All 19 original groups and 85 specifications retained.** Images are proposed instructions, pending independent and owner visual acceptance. The native disable-confirmation image is blocked; Batch 7A is incomplete until its capture method is approved and the image is delivered.

The [approved 40-image list and visual-only substitutions](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7210755148) control this pack. This table distinguishes direct illustration, representative reuse, written instructions and an unresolved capture. An image reference never asserts an uncaptured save, cancellation, rejection or result. The [original contracts](../../../../../development-guide/Milestone-01-Batch-7-Review.md#requirement-register) remain authoritative historical traceability. [Manifest](manifest.json) records actual capture context.

## B2-01 — Devices: unfiltered inventory plus one combined-filter result and Overview drill-down

Written procedure: [Devices — Find equipment and understand your inventory](../../Devices.md#find-equipment-and-understand-your-inventory).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-01-S01` — Inventory unfiltered. | Unfiltered saved inventory. | [devices-inventory](devices-inventory.png) |
| `B2-01-S02` — Combined filters. | Representative combined filter result. | [devices-combined-filters](devices-combined-filters.png) |
| `B2-01-S03` — Overview drill-down. | Written Overview drill-down; reuse the inventory for the resulting list. | [devices-inventory](devices-inventory.png) |

## B2-02 — Devices: Details Overview, Hardware, Network, Location and current conditional tabs

Written procedure: [Devices — View an existing device](../../Devices.md#view-an-existing-device).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-02-S01` — Details Overview. | Read-only Overview. | [devices-details-overview](devices-details-overview.png) |
| `B2-02-S02` — Hardware. | Read-only Hardware. | [devices-details-hardware](devices-details-hardware.png) |
| `B2-02-S03` — Network. | Read-only Network; also the exact saved result of the pictured basic-address chooser. | [devices-details-network](devices-details-network.png) |
| `B2-02-S04` — Location. | Read-only linked-shelf Location, shared with Racks. | [devices-details-shelf-location](devices-details-shelf-location.png) |
| `B2-02-S05` — Conditional tabs by feature and permission. | Written conditional-tab/access rules; reader Details, reader elevations and Racks-off editor give representative permission/feature examples. | [devices-details-overview](devices-details-overview.png), [optional-racks-off-location](optional-racks-off-location.png), [racks-front-read-only](racks-front-read-only.png) |

## B2-03 — Devices: Add, Edit and Duplicate physical forms with Save/Cancel/Back and validation

Written procedure: [Devices — Edit, save and cancel](../../Devices.md#edit-save-and-cancel).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-03-S01` — Add physical form and saved result. | Add form illustrated; Save and checking the actual saved record remain written. No claim that training-new-switch was saved. | [devices-add-form](devices-add-form.png) |
| `B2-03-S02` — Edit and saved result. | Existing Edit form illustrated; routine Save and result inspection remain written. | [devices-edit-form](devices-edit-form.png) |
| `B2-03-S03` — Duplicate and saved result. | Owner-approved reuse of Add illustration for Duplicate; written unique identity and result checks. | [devices-add-form](devices-add-form.png) |
| `B2-03-S04` — Cancel/Back unchanged. | Owner-approved written Cancel/Back/discard instructions. | Written instructions |
| `B2-03-S05` — Field validation matrix. | Owner-approved written field-validation/troubleshooting; no validation matrix photography. | Written instructions |

## B2-04 — Devices: physical Server pools/VDEVs and independent versus linked boot

Written procedure: [Devices — Record Storage, ZFS Pools And Boot Drives](../../Devices.md#record-storage-zfs-pools-and-boot-drives).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-04-S01` — Server pools and VDEVs. | Saved Hardware summary shows a named pool and Mirror VDEV; detailed entry steps remain written. | [devices-zfs-linked-boot](devices-zfs-linked-boot.png) |
| `B2-04-S02` — Independent boot. | Independent boot-drive fields illustrated. | [devices-independent-boot](devices-independent-boot.png) |
| `B2-04-S03` — Linked boot. | Saved Hardware summary shows boot linked to the same named pool. | [devices-zfs-linked-boot](devices-zfs-linked-boot.png) |
| `B2-04-S04` — Invalid storage rejected. | Owner-approved written storage validation, minima and correction instructions. | Written instructions |

## B2-05 — Devices: host and VM resources plus per-guest host-change review

Written procedure: [Devices — Complete A Host And Guest Inventory](../../Devices.md#complete-a-host-and-guest-inventory).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-05-S01` — Host and VM resources. | Scrolled VM editor shows host inheritance guidance and all four resource fields. | [devices-vm-resources](devices-vm-resources.png) |
| `B2-05-S02` — Guest host-change review. | Per-guest host-change proposal illustrated, before confirmation. | [devices-host-change-review](devices-host-change-review.png) |
| `B2-05-S03` — Destination/unassign/retire outcomes. | Written reassign/unassign/retire outcomes; no image is claimed as a completed host-change transaction. | Written instructions |
| `B2-05-S04` — Cancel unchanged. | Owner-approved written Keep Editing/Cancel instructions. | Written instructions |

## B2-06 — Devices: type archive/rename/delete warning and hardware/software/service catalogue

Written procedure: [Devices — Manage Device Types And Locations](../../Devices.md#manage-device-types-and-locations).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-06-S01` — Type archive/rename/delete confirmation. | Filtered manager illustrates shared actions, affected counts and deletion/Unknown warning; rename/archive/confirmation steps remain written. | [devices-manage-types](devices-manage-types.png) |
| `B2-06-S02` — In-use rejection. | In-use removal warning names Training Tools and its Device. It is a protection notice, not evidence of an attempted server write. | [devices-blocked-removal](devices-blocked-removal.png) |
| `B2-06-S03` — Hardware catalogue. | Representative manufacturer catalogue plus hardware instructions. | [devices-representative-catalogue](devices-representative-catalogue.png) |
| `B2-06-S04` — Software catalogue. | Owner-approved representative catalogue reuse; individual software instructions and in-use notice retained. | [devices-blocked-removal](devices-blocked-removal.png), [devices-representative-catalogue](devices-representative-catalogue.png) |
| `B2-06-S05` — Service catalogue. | Owner-approved representative catalogue reuse; individual service instructions and archive restriction retained. | [devices-representative-catalogue](devices-representative-catalogue.png) |

## B2-07 — IPAM: Overview/basic-count outside, inside-but-basic and explicitly linked

Written procedure: [IPAM — Basic Addresses And Explicit Linking](../../IPAM.md#basic-addresses-and-explicit-linking).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-07-S01` — Basic outside count. | Out-of-subnet basic count illustrated. | [ipam-overview-basic-count](ipam-overview-basic-count.png) |
| `B2-07-S02` — Basic inside retained. | Written inside-but-basic boundary; chooser for the saved basic 192.0.2.30 is the before-link illustration. | [optional-existing-subnet-chooser](optional-existing-subnet-chooser.png) |
| `B2-07-S03` — Explicitly linked Assigned result. | Exact saved linked result shared from Devices Network: training-basic-printer, 192.0.2.30. | [devices-details-network](devices-details-network.png) |

## B2-08 — IPAM: Manage Subnets and address grid/page/status filters

Written procedure: [IPAM — Before You Start And Find Your Networks](../../IPAM.md#before-you-start-and-find-your-networks).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-08-S01` — Manage Subnets. | Manage Subnets illustrated. | [ipam-manage-subnets](ipam-manage-subnets.png) |
| `B2-08-S02` — Address grid and pages. | Selected /24 range illustrated; other-prefix paging remains written. | [ipam-address-grid](ipam-address-grid.png) |
| `B2-08-S03` — Status filters and gateway protection. | Representative range/status controls and protected gateway illustrated; other filter combinations remain written. | [ipam-address-grid](ipam-address-grid.png) |

## B2-09 — IPAM: single subnet/block and multiple-subnet generator/preview with row error

Written procedure: [IPAM — Add multiple subnets](../../IPAM.md#add-multiple-subnets).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-09-S01` — Single subnet/block form. | Single subnet form illustrated; selecting IP Address Block uses the same form with the retained written instructions. | [ipam-single-subnet-form](ipam-single-subnet-form.png) |
| `B2-09-S02` — Multiple generator and preview. | Two-row generated preview illustrated before Save. | [ipam-multiple-subnet-preview](ipam-multiple-subnet-preview.png) |
| `B2-09-S03` — Row validation. | Owner-approved written row validation and troubleshooting. | Written instructions |
| `B2-09-S04` — Save result. | Owner-approved routine Save and result-check instructions. Existing saved networks are representative inventory, not a claim that the pictured drafts were saved. | Written instructions |
| `B2-09-S05` — Cancel unchanged. | Owner-approved written Cancel/Back instructions. | Written instructions |

## B2-10 — IPAM: independent Configure IP, Device-owned notes and historical reservation release

Written procedure: [IPAM — Edit an individual IP](../../IPAM.md#edit-an-individual-ip).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-10-S01` — Independent Configure IP. | Independent Reserved draft illustrated before Save. | [ipam-configure-address](ipam-configure-address.png) |
| `B2-10-S02` — Device-owned notes. | Device-owned Status/Hostname protection and editable address notes illustrated. | [ipam-protected-device-address](ipam-protected-device-address.png) |
| `B2-10-S03` — Historical reservation release. | Written historical-reservation release procedure; no new release image under the approved two-image allocation. | Written instructions |
| `B2-10-S04` — Save/Cancel and protected-owner rejection. | Protected-owner fields illustrated; routine Save/Cancel and rejection recovery remain written. | [ipam-protected-device-address](ipam-protected-device-address.png) |

## B2-11 — IPAM: bulk reservation/release preview and protected-skip count

Written procedure: [IPAM — Bulk Reserve Or Release Addresses](../../IPAM.md#bulk-reserve-or-release-addresses).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-11-S01` — Bulk reservation preview. | Reservation preview illustrated before Apply. | [ipam-bulk-reservation-preview](ipam-bulk-reservation-preview.png) |
| `B2-11-S02` — Bulk release preview. | Release preview illustrated before Apply. | [ipam-bulk-release-preview](ipam-bulk-release-preview.png) |
| `B2-11-S03` — Protected-skip sample. | Protected/skipped counts and exact samples are visible in both previews. | [ipam-bulk-release-preview](ipam-bulk-release-preview.png), [ipam-bulk-reservation-preview](ipam-bulk-reservation-preview.png) |
| `B2-11-S04` — Apply result. | Owner-approved written Apply and saved-result checks; no preview is labelled as applied. | Written instructions |
| `B2-11-S05` — Cancel unchanged. | Owner-approved written Cancel/close instructions. | Written instructions |

## B2-12 — IPAM: deletion blocked and eligible Move Devices & Delete Subnet review

Written procedure: [IPAM — Delete A Subnet Or Block Safely](../../IPAM.md#delete-a-subnet-or-block-safely).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-12-S01` — Blocked deletion. | Genuine blocked-deletion notice identifies the two independent reserved addresses. | [ipam-protected-deletion](ipam-protected-deletion.png) |
| `B2-12-S02` — Eligible Move Devices review. | Eligible review lists the exact Device/IP and destructive action, before confirmation. | [ipam-move-devices-review](ipam-move-devices-review.png) |
| `B2-12-S03` — Cleared-primary-IP result. | Written cleared-primary-IP result; no deletion was applied for photography. | Written instructions |
| `B2-12-S04` — Stale/dependency rejection. | Owner-approved written stale/dependency rejection and recovery. | Written instructions |
| `B2-12-S05` — Cancel unchanged. | Owner-approved written Cancel instructions. | Written instructions |

## B2-13 — Racks: Inventory, Front/Rear, equipment/capacity and read-only elevation

Written procedure: [Racks — Find A Rack And Read Capacity](../../Racks.md#find-a-rack-and-read-capacity).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-13-S01` — Rack Inventory. | Reader Rack Inventory. | [racks-inventory](racks-inventory.png) |
| `B2-13-S02` — Front elevation. | Reader Front elevation. | [racks-front-read-only](racks-front-read-only.png) |
| `B2-13-S03` — Rear elevation. | Reader Rear elevation. | [racks-rear-read-only](racks-rear-read-only.png) |
| `B2-13-S04` — Capacity/equipment. | Inventory and elevations show numbered-U versus face-U capacity and saved occupants. | [racks-front-read-only](racks-front-read-only.png), [racks-inventory](racks-inventory.png) |
| `B2-13-S05` — Read-only elevation. | Both elevations use the reader account without editing/placement/drag affordances. | [racks-front-read-only](racks-front-read-only.png), [racks-rear-read-only](racks-rear-read-only.png) |

## B2-14 — Racks: enclosure add/edit/specification correction confirmation

Written procedure: [Racks — Edit A Rack Or Correct Its Specifications](../../Racks.md#edit-a-rack-or-correct-its-specifications).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-14-S01` — Add enclosure. | New enclosure form with measured dimensions; draft is unsaved. | [racks-enclosure-form](racks-enclosure-form.png) |
| `B2-14-S02` — Edit enclosure. | Owner-approved shared enclosure form plus written ordinary-edit/locked-specification instructions. | [racks-enclosure-form](racks-enclosure-form.png) |
| `B2-14-S03` — Specification correction confirmation. | Actual specification-correction confirmation illustrated before confirmation. | [racks-specification-correction](racks-specification-correction.png) |
| `B2-14-S04` — Saved dimensions. | Written saved-dimension checks; original Training Rack dimensions are visible in the reader elevations, without claiming the 650 mm proposal was saved. | [racks-front-read-only](racks-front-read-only.png) |
| `B2-14-S05` — Cancel/rejection. | Owner-approved written Cancel/rejection/height protection instructions. | Written instructions |

## B2-15 — Racks: Device placement, horizontal accessory, vertical left/right 0U and invalid collision

Written procedure: [Racks — Place An Existing Rack-Mounted Device](../../Racks.md#place-an-existing-rack-mounted-device).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-15-S01` — Device placement. | Device placement draft shows selected Device, face/start and read-only height. | [racks-device-placement](racks-device-placement.png) |
| `B2-15-S02` — Horizontal accessory. | Representative horizontal patch-panel placement draft. | [racks-accessory-placement](racks-accessory-placement.png) |
| `B2-15-S03` — Left 0U. | Owner-approved representative accessory illustration and written Left/Right 0U procedure; the Rear image shows the right rail and empty left rail only. No left placement save is claimed. | [racks-accessory-placement](racks-accessory-placement.png), [racks-rear-read-only](racks-rear-read-only.png) |
| `B2-15-S04` — Right 0U. | Rear elevation shows the saved Right 0U PDU; individual vertical entry instructions remain written. | [racks-rear-read-only](racks-rear-read-only.png) |
| `B2-15-S05` — Collision rejection. | Genuine no-valid-position warning for a 12U accessory on the occupied Front face. No collision save or server rejection is claimed. | [racks-collision-warning](racks-collision-warning.png) |
| `B2-15-S06` — Cancel unchanged. | Owner-approved written Cancel and unchanged-placement explanation. | Written instructions |

## B2-16 — Racks/Devices: linked shelf Device, moved shelf location and complete removal review

Written procedure: [Racks — Remove A Shelf That Holds Devices](../../Racks.md#remove-a-shelf-that-holds-devices).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-16-S01` — Linked shelf Device. | Shared Devices Location image shows the exact saved printer/shelf relationship. | [devices-details-shelf-location](devices-details-shelf-location.png) |
| `B2-16-S02` — Moved-shelf derived location. | Written movement and derived-location explanation; reuse the matching Location illustration as a relationship example, not proof of a completed shelf move. | [devices-details-shelf-location](devices-details-shelf-location.png) |
| `B2-16-S03` — Complete removal review. | Complete linked-Device removal review with explicit replacement choice, before confirmation. | [racks-shelf-removal-review](racks-shelf-removal-review.png) |
| `B2-16-S04` — Per-Device result. | Written per-Device outcomes; no removal/reassignment was applied for photography. | Written instructions |
| `B2-16-S05` — Cancel/rejection. | Owner-approved written Cancel/stale/reservation rejection instructions. | Written instructions |

## B2-17 — Optional Features: all six current cards and disable confirmation

Written procedure: [Optional-Features-and-Link-To-IPAM — Find And Read The Feature Cards](../../Optional-Features-and-Link-To-IPAM.md#find-and-read-the-feature-cards).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-17-S01` — Six feature cards. | Full-page six-card image at a desktop 1440 × 1050 viewport; raster height is recorded separately. | [optional-six-feature-cards](optional-six-feature-cards.png) |
| `B2-17-S02` — Disable confirmation. | BLOCKED: genuine browser-native confirm dialog is recognised, but the existing headless screenshot method cannot capture it. No generated substitute or written waiver. | **Blocked capture** |
| `B2-17-S03` — Disabled retained-data result. | Owner-approved written retained-data/disabled-result explanation, supported by the Racks-off protected editor illustration. | [optional-racks-off-location](optional-racks-off-location.png) |
| `B2-17-S04` — Cancel unchanged. | Owner-approved written Cancel instructions; the native dialog was dismissed during the capture-method check. | Written instructions |

## B2-18 — Optional Features: basic link action, no-suitable/existing-subnet chooser, before/after result

Written procedure: [Optional-Features-and-Link-To-IPAM — Deliberately Link A Saved Basic Address](../../Optional-Features-and-Link-To-IPAM.md#deliberately-link-a-saved-basic-address).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-18-S01` — Basic link action. | Existing-subnet chooser is opened for the exact saved basic address. | [optional-existing-subnet-chooser](optional-existing-subnet-chooser.png) |
| `B2-18-S02` — No suitable subnet. | Owner-approved written no-suitable-subnet explanation and disabled submission. | Written instructions |
| `B2-18-S03` — Existing-subnet chooser. | Existing Lab Network chooser illustrated. | [optional-existing-subnet-chooser](optional-existing-subnet-chooser.png) |
| `B2-18-S04` — Before confirmation. | Selected existing subnet and confirmation actions illustrated before submission. | [optional-existing-subnet-chooser](optional-existing-subnet-chooser.png) |
| `B2-18-S05` — Saved linked result. | Exact linked result shared from Devices Network for the same printer/address; actual deliberate link completed in the fictional fixture. | [devices-details-network](devices-details-network.png) |
| `B2-18-S06` — Cancel/rejection. | Owner-approved written Cancel/conflict/stale/edit-reservation instructions. | Written instructions |

## B2-19 — Optional Features: Racks-off protected Device versus re-enabled placement

Written procedure: [Optional-Features-and-Link-To-IPAM — Preserve Devices When Network Racks Is Off](../../Optional-Features-and-Link-To-IPAM.md#preserve-devices-when-network-racks-is-off).

| Original specification | Approved disposition and precise illustration limit | Image references |
| --- | --- | --- |
| `B2-19-S01` — Racks-off protected Location. | Racks-off editor shows protected Location Area and hidden placement controls. | [optional-racks-off-location](optional-racks-off-location.png) |
| `B2-19-S02` — Re-enabled placement retained. | Owner-approved reuse of the genuinely matching saved printer Location and Front elevation; Racks was re-enabled, retaining its shelf relationship. | [devices-details-shelf-location](devices-details-shelf-location.png), [racks-front-read-only](racks-front-read-only.png) |
| `B2-19-S03` — Blocked hidden-relationship edit. | Protected read-only Location field is illustrated; server rejection/tampering is described in the retained written instructions, not claimed as a tested request. | [optional-racks-off-location](optional-racks-off-location.png) |

