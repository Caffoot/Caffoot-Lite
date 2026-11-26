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
