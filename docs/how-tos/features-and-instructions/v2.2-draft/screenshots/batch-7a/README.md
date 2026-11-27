# Batch 7A — Desktop Instructional Screenshots

**27 November 2026. Blocked capture checkpoint: 38 proposed images delivered; the browser-native disable confirmation remains outstanding.** Independent ChatGPT review and owner visual acceptance are pending. No image is publication-approved.

Authority: [scope and method approval](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7210755148). Maximum 40 new screenshots; desktop light theme only. [Provenance manifest](manifest.json). [All 19 groups / 85 original specifications](Coverage.md). [Static verification](Verification.md).

Application baseline `fdc677920bfc52f48f641b3d6d1344c902a6a9b0`, schema 31; documentation start `e9ff3e18fb1eca21f91c856c93e8a8ba6b67963e`. Genuine local HTTPS/SQLite application, headless Chromium, 1440 × 1050 at scale 1. Isolated fictional training inventory; RFC 5737 documentation networks. No private environment or cloud desktop.

Roles: training-editor and training-reader are active MFA-confirmed Staff Member accounts with explicit Devices/IPAM/Racks Edit or Read overrides respectively; no other inventory grants. training-admin is the MFA-confirmed administrator used for feature settings. Per-image effective rights and six feature settings are in the manifest. Credentials and capture tooling remain outside tracked files.

Existing images reused: none from the historical library. Devices Location is shared with Racks. Captions distinguish drafts, previews, saved records and protected operations. Original accepted written instructions are preserved.

## Devices

15 new images.

| Image | Original state references | Caption |
| --- | --- | --- |
| [devices-inventory.png](devices-inventory.png) | `B2-01-S01` | Recorded fictional Device Inventory; these are saved records, not discovery results. |
| [devices-combined-filters.png](devices-combined-filters.png) | `B2-01-S02` | Device Type and Location filters narrow the inventory to training-switch-01. |
| [devices-details-overview.png](devices-details-overview.png) | `B2-02-S01` | The saved training-switch-01 Overview, viewed with Devices Read. |
| [devices-details-hardware.png](devices-details-hardware.png) | `B2-02-S02` | Hardware records describe the fictional switch; they do not discover its specification. |
| [devices-details-network.png](devices-details-network.png) | `B2-02-S03`, `B2-07-S03`, `B2-18-S05` | After deliberate linking, training-basic-printer retains 192.0.2.30 and now shows its managed subnet. Compare the earlier chooser for the same saved address. |
| [devices-details-shelf-location.png](devices-details-shelf-location.png) | `B2-02-S04`, `B2-16-S01` | The saved printer derives its Front U3 location from Training Printer Shelf; it occupies no separate U footprint. |
| [devices-add-form.png](devices-add-form.png) | `B2-03-S01`, `B2-03-S03` | Add New Device: a fictional unsaved switch draft. Duplicate uses this editor with a new identity. |
| [devices-edit-form.png](devices-edit-form.png) | `B2-03-S02` | Edit Device: review the existing switch identity and protected related fields before saving. |
| [devices-independent-boot.png](devices-independent-boot.png) | `B2-04-S02` | Independent boot drives are recorded separately from ZFS pools; this does not configure disks. |
| [devices-zfs-linked-boot.png](devices-zfs-linked-boot.png) | `B2-04-S01`, `B2-04-S03` | The saved Hardware details show linked boot and the recorded Mirror VDEV together; these records do not configure disks. |
| [devices-vm-resources.png](devices-vm-resources.png) | `B2-05-S01` | The VM inherits its host platform and has its own recorded virtual resource allocations. |
| [devices-host-change-review.png](devices-host-change-review.png) | `B2-05-S02` | Review the explicit replacement host for the guest before confirming. This draft has not migrated or reassigned a real VM. |
| [devices-manage-types.png](devices-manage-types.png) | `B2-06-S01` | Manage Device Types filtered to Server shows affected counts and shared catalogue actions. Unknown remains protected. |
| [devices-blocked-removal.png](devices-blocked-removal.png) | `B2-06-S02` | Training Tools cannot be removed while training-host-01 records it as installed. |
| [devices-representative-catalogue.png](devices-representative-catalogue.png) | `B2-06-S03`, `B2-06-S04`, `B2-06-S05` | The manufacturer catalogue is a representative example; software and service catalogues have their own written procedures. |

## IPAM

11 new images.

| Image | Original state references | Caption |
| --- | --- | --- |
| [ipam-overview-basic-count.png](ipam-overview-basic-count.png) | `B2-07-S01` | Basic IPs Outside Subnets is 1: the offsite printer is basic and outside the two managed networks. A count does not prove linking. |
| [ipam-manage-subnets.png](ipam-manage-subnets.png) | `B2-08-S01` | Manage Subnets shows the two standalone fictional networks and their network actions. |
| [ipam-address-grid.png](ipam-address-grid.png) | `B2-08-S02`, `B2-08-S03` | The selected .1–.32 range shows the protected Reserved gateway, an Assigned Device address and Available cards; other ranges have their own controls. |
| [ipam-configure-address.png](ipam-configure-address.png) | `B2-10-S01` | Configure an independent spare address; this Reserved draft has not been saved. |
| [ipam-protected-device-address.png](ipam-protected-device-address.png) | `B2-10-S02`, `B2-10-S04` | Device ownership protects Status and Hostname here; IPAM Notes remain separate editable address metadata. |
| [ipam-single-subnet-form.png](ipam-single-subnet-form.png) | `B2-09-S01` | Add Single Subnet requires an explicit purpose and a usable LAN gateway. This is an unsaved draft. |
| [ipam-multiple-subnet-preview.png](ipam-multiple-subnet-preview.png) | `B2-09-S02` | Review both generated /26 networks and their individual purposes and gateways before saving; neither exists yet. |
| [ipam-bulk-reservation-preview.png](ipam-bulk-reservation-preview.png) | `B2-11-S01`, `B2-11-S03` | The reservation preview skips the gateway and Device-owned .10. No changes have been applied. |
| [ipam-bulk-release-preview.png](ipam-bulk-release-preview.png) | `B2-11-S02`, `B2-11-S03` | The release preview affects eligible unowned reservations, while Device primary IPs and the gateway remain protected. |
| [ipam-protected-deletion.png](ipam-protected-deletion.png) | `B2-12-S01` | Independent reservations protect Lab Network from subnet deletion; investigate dependencies rather than bypassing them. |
| [ipam-move-devices-review.png](ipam-move-devices-review.png) | `B2-12-S02` | Move Devices & Delete Subnet would clear the listed active primary IP; it does not physically relocate equipment. This is a review only. |

## Network Racks

9 new images.

| Image | Original state references | Caption |
| --- | --- | --- |
| [racks-inventory.png](racks-inventory.png) | `B2-13-S01`, `B2-13-S04` | Rack Inventory records enclosure dimensions and occupied numbered U across both faces. |
| [racks-front-read-only.png](racks-front-read-only.png) | `B2-13-S02`, `B2-13-S04`, `B2-13-S05` | Front elevation under Racks Read: inspect saved equipment and capacity without placement or drag controls. |
| [racks-rear-read-only.png](racks-rear-read-only.png) | `B2-13-S03`, `B2-13-S05`, `B2-15-S04` | Rear elevation shows the patch panel and Right 0U PDU; left and right are viewed from the selected face. |
| [racks-enclosure-form.png](racks-enclosure-form.png) | `B2-14-S01`, `B2-14-S02` | The enclosure form records measured physical dimensions. This new Training Expansion Rack draft is unsaved. |
| [racks-specification-correction.png](racks-specification-correction.png) | `B2-14-S03` | Review a proposed width correction from 600 to 650 mm. Mounted equipment will not move; this correction has not been confirmed. |
| [racks-device-placement.png](racks-device-placement.png) | `B2-15-S01` | Place an existing Device at a free Front position. Its recorded 1U height is read-only in this form; the proposed move is unsaved. |
| [racks-accessory-placement.png](racks-accessory-placement.png) | `B2-15-S02` | A horizontal patch panel uses central U space on the selected face; this placement is an unsaved draft. |
| [racks-collision-warning.png](racks-collision-warning.png) | `B2-15-S05` | A 12U horizontal accessory cannot fit on the occupied Front face. The form offers no valid Start U and warns before saving. |
| [racks-shelf-removal-review.png](racks-shelf-removal-review.png) | `B2-16-S03` | Review the replacement shelf for training-printer-01 before removing its current shelf; no removal has been confirmed. |

## Optional Features

3 new images.

| Image | Original state references | Caption |
| --- | --- | --- |
| [optional-six-feature-cards.png](optional-six-feature-cards.png) | `B2-17-S01` | All six Optional Features are enabled in this fictional administrator fixture; enabling a feature does not grant account permissions. |
| [optional-existing-subnet-chooser.png](optional-existing-subnet-chooser.png) | `B2-18-S01`, `B2-18-S03`, `B2-18-S04` | Link to IPAM deliberately selects an existing containing subnet for the exact saved basic address. No link has been confirmed. |
| [optional-racks-off-location.png](optional-racks-off-location.png) | `B2-19-S01`, `B2-19-S03` | With Network Racks off, the saved shelf relationship protects Location Area during unrelated Device editing. Hidden controls do not mean a detached Device. |


## Capture Blocker — Native Disable Confirmation

`B2-17-S02` is essential and remains **blocked**, rather than waived. The actual application uses the browser's native `confirm()` dialog: **“Disable Network Racks? Saved data and permissions will be retained.”** The existing headless Chromium browser recognises it, but Chromium's screenshot request does not complete while it is open. The dialog was cancelled during that method check. No screenshot was fabricated, and no application dialog or browser behaviour was replaced.

The current environment has no Xvfb executable or supported system-package helper. Proposed minimum method change, **pending owner approval**: add temporary local virtual-display support outside tracked files, automate a separate isolated Chromium window and capture this single genuine native confirmation. This is an offscreen local browser capture, with no shared cloud desktop, private deployment, application change or acceptance suite. [AGENTS.md rule 9](https://github.com/Caffoot/Caffoot-Lite/blob/e9ff3e18fb1eca21f91c856c93e8a8ba6b67963e/AGENTS.md) requires explicit owner approval before deviating. No such installation or alternative capture has been undertaken.

## Coverage, Reuse And Boundaries

**38 new files: Devices 15, IPAM 11, Racks 9, Optional Features 3.** Completing the blocked confirmation would make 39, still below the approved 40-image ceiling. Racks uses the matching Devices shelf Location image; the linked-printer Network result is also shared with IPAM and Optional Features. No existing historical screenshot is newly reused in 7A. The eight earlier accepted reuse proposals concern later packs and remain preserved; the four unresolved candidates remain pending.

The approved written substitutions are recorded state by state in [Coverage.md](Coverage.md): routine Save/Cancel/Back, invalid combinations, Duplicate using Add, representative catalogues and filters, stale-record recovery, representative feature combinations, saved-result reuse only where the subject matches, no-suitable-subnet explanation and matching feature-on Rack/Location reuse. Distinct protected/read-only examples are retained in the actual images. The original 85 specifications are traceability records, not 85 capture targets. No uncaptured transition is claimed as demonstrated.

All images were opened for local visual inspection for legibility, truthful captions and fictional/private-data boundaries. One six-card image is a full-page 1440-pixel-wide capture, with a 1440 × 1050 desktop viewport and actual raster height recorded in the manifest. Other images are viewport captures. No image cropping, compositing, generated UI or design preview was used. Replaced framing attempts remain outside tracked evidence; only the final proposed files belong to this pack.

No unrelated application tests or behaviour/design changes, tracked configuration/schema/test changes, dark/mobile captures, full regression/CI monitoring, cloud desktop, Pi/native acceptance, migration/upgrade/backup/restore, export investigation, security audit, Batch 7B–7H, Batch 8, website, PR promotion, merge, release or publication were undertaken. Existing evidence and dated written/source review records remain preserved. Independent ChatGPT review and product-owner visual acceptance are pending. Stop at this Batch 7A checkpoint.
