# Milestone 01 — Batch 2 Infrastructure Review

> **Draft review evidence, 26 November 2026.** Text/source reconciliation is not owner acceptance or publication approval. No new application/runtime testing or screenshots.

Authorisation: [owner continuation](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7198015073), [approved plan](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7196554739), [quality standard](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7196814971). Continue [draft PR #472](https://github.com/Caffoot/Caffoot-Lite/pull/472), base `milestone-1`.

## Verified Starting Points

- Documentation HEAD: `b3e483baa1d989cc3f195ea4af9f679cb027e406`; clean checkout before edits.
- Application baseline and PR base: `fdc677920bfc52f48f641b3d6d1344c902a6a9b0`; `backend/schema.py` declares schema 31.
- Published v2.1 peeled tag: `c3237114108cad9f7d4e57657b6aed5e0091a5ef`, schema 10.
- GitHub PR metadata verified open, draft, unmerged, correct existing head/base. All seven mandatory issue/comment records read; later owner Codex authorisation supersedes older working-method instructions only.
- Batch 1 inventory reused, including its final resolutions. No repeat of the 138-entry/276-path reconciliation.

## Devices Checkpoint

[Devices draft](../how-tos/features-and-instructions/v2.2-draft/Devices.md) retains the first pass and adds complete storage/boot/ZFS, host/guest and catalogue procedures. Corrected the new-Device status description (new records start Active), inherited VM platform, and assigned-service archive restriction. Stock, custody, Supplier, Lifecycle and ticket operations link to their specialised draft guides; their full reviews remain in later authorised batches. Stock specification metadata remains foundation-only: no claim of a general stock specification screen/API.

| Source At Application Baseline | What Was Checked |
| --- | --- |
| [Device storage validation](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_storage.py) | Physical-type applicability, independent/linked boot, pool/VDEV identity, layout drive minima, units, limits and preservation |
| [Device catalogue writer](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_catalogue.py) | Shared rename/delete-to-Unknown, archive/unarchive, reserved names, affected set and reservation checks, atomic saves |
| [Device save authority](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_saves.py) | Protected identity, stock/history restrictions, host/guest changes, cross-section edits and deletion guards |
| [Device editor/catalogue implementation](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L2207-L2903) | Manufacturer/model sources and preferences, software removal blocked in use, catalogue management and Device Intelligence |
| [Storage and editor controls](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L5740-L5895) | Quick-add immediate persistence, Add Pool/VDEV, boot labels and displayed summaries |
| [Editor and guest review](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L7040-L7645) | Existing versus new status, VM purposes/resources, inherited platform, Cancel/Back, per-guest review |
| [Device details templates](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/device-details.html) and [catalogue templates](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/device-management.html) | Exact labels and hidden inherited VM platform, Save actions, discard and confirmations |

Static checks accompany each topic checkpoint. Screenshot review and final cross-guide/anchor checks follow in the same authorised block; this checkpoint alone is not completion of Batch 2.

## IPAM And Network Racks Checkpoint

Created standalone [IPAM](../how-tos/features-and-instructions/v2.2-draft/IPAM.md) and [Network Racks](../how-tos/features-and-instructions/v2.2-draft/Racks.md) drafts, building on the preserved existing guides. Added the index entries and direct Device links.

| Source At Application Baseline | Reconciliation |
| --- | --- |
| [IPAM controls](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L2905-L4108) and [templates](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/ipam.html) | Overview/group filters, /24 ranges versus other-prefix pages, single/multiple subnet fields, 1–50 batch limit, spacing, preview/retry, independent/device-owned notes, historical reservation release, bulk controls and deletion |
| [Subnet validation](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/subnet_validation.py) and [IPAM saves](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/ipam_saves.py) | Strict containment, independent subnets, purpose/gateway/VLAN/name validation, existing historical values, independent versus Device-owned allocations, atomic 1–512-address bulk writes |
| [Subnet/VLAN transactions and deletion](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/collection_saves.py#L115-L383) | Scoped VLAN ownership, stale dependency sets, reviewed clearing of managed primary IPs with previous-IP metadata, protected independent allocations, disabled Devices check and atomic rollback |
| [Basic address policy](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_addresses.py), [explicit linking](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/ipam_linking.py), [projection/count](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/inventory_projection.py) | Basic/managed separation, both Edit grants for linking, transaction/revision/conflict checks, retained notes, count access and whole-range containment limitations |
| [Rack inventory/capacity](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L1842-L2106) | Unique U versus combined face-U utilisation, room/type views, contiguous space, print window and retained same-tab trial |
| [Rack editors/placement](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L4379-L4725), [accessories/movement](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L8436-L8640), [templates](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/screens/racks.html) | Exact buttons, 1–100U and 1–10,000mm limits, fixed Device height in Rack placement, horizontal/0U separation, immediate drop/unmount, separate correction confirmation |
| [Rack collision authority](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/rack_validation.py), [shelf association](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/shelf_associations.py), [linked-shelf removal](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/collection_saves.py#L386-L487) | Faces/rails, protected occupants, derived shelf location, complete per-Device reassignment/retirement and separately saved replacement shelves |
| [Rack persistence and Device reservation](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L10546-L10634), [Device section boundary](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/backend/device_saves.py#L138-L204), [read-only controls](https://github.com/Caffoot/Caffoot-Lite/blob/fdc677920bfc52f48f641b3d6d1344c902a6a9b0/interface/application.js#L9547-L9576) | Racks Edit placement without general Device editing, Devices enabled check, revision/reservation, hidden data and read-only geometry |

### Material Clarifications

- IPAM Available is not proof of no basic Device address. Basic IPs Outside Subnets excludes basic addresses inside managed ranges, including network/broadcast boundaries; blocks alone do not count as managed networks.
- The CIDR editor checks basic Devices in its old range even though the backend's managed dependency rule excludes basic addresses. The guide explains a possible refusal rather than promising a permitted edit. No application change proposed.
- IPAM deletion is not universally prohibited for populated subnets: **Move Devices & Delete Subnet** explicitly clears eligible managed primary IPs, removes related allocations/uniquely linked VLAN, preserves Devices and former-IP metadata. Independent allocations/reservations and unsafe/stale relationships block it.
- The Rack placement dialog displays saved Device height read-only. The ordinary **Remove from rack** action saves immediately without a confirmation, preserves Location Area and uses the inherited Desktop mounting value; type validation can reject it. Guides warn about this behaviour, without changing it.
- Read-only or independent Rack access must not be mistaken for a complete Device inventory. Server-side hidden relationships still protect occupancy/deletion.

### Tagged Source Comparison

Read the tagged Device guide and the full v2.1-to-baseline IPAM/Racks guide diffs. Compared actual tagged JavaScript workflow bodies and backend files with the final baseline: single/multiple subnet editors, bulk planner, deletion UI, Rack placement submit and unmount remain identical in the inspected bodies. Rack editor/chooser differences include public Device type labels; accessory differences include modal scrolling and error feedback. The independent allocation writer adds under-lock permission checks, live validation and attributable audit subjects. Subnet mutation excludes basic Devices from its managed dependency predicate. Rack collision and shelf-association files are byte-identical between tag and baseline. Version-specific basic-IP/feature behaviour is documented only in draft v2.2.

The tag's Racks prose names older **Rack Placement / Mount device** controls although the tagged source already uses **Place Device / Horizontal Accessory… / Place Equipment**. Its **Add Network Rack** instruction also differs from the tagged **Add Rack** button. Later maintained v2.1 copies correct these labels. Preserve the tag as historical evidence; do not propagate those stale labels into v2.2 or alter the published copies. Tag captions explicitly describe earlier-edition screenshots; later v2.1 copies use the separately approved 15 November desktop captures.
