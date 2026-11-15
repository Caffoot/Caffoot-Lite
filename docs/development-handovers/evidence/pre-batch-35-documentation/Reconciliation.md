# Pre-Batch 3.5 Documentation — Reconciliation with PR #385

## Source and approval boundaries

This reconciliation is part of draft [PR #383](https://github.com/Caffoot/Caffoot-Lite/pull/383), which originally targeted `milestone-1` at `05b162aa10a74994c970d0b6dbf111dc59b47513`. Published v2.1 corrections were subsequently approved and merged to `main` via [PR #384](https://github.com/Caffoot/Caffoot-Lite/pull/384) and synchronised into `milestone-1` via [PR #385](https://github.com/Caffoot/Caffoot-Lite/pull/385) at `47c2ebe3d9249199c0c42dc71fd571b9f6411641`.

The PR #383 reconciliation merges these two development histories without overwriting the approved public v2.1 material. Its original [pre-Batch 3.5 report](Report.md) remains unchanged as evidence for the *earlier* checkpoint; tests recorded there were not rerun merely by merging branches.

## Retained v2.2 changes

Six draft v2.2 Markdown files (five feature guides and their index) remain separate from the eight official published v2.1 guides. They describe Staff Members, Departments/shared equipment, roles and MFA, initial Device assignments/My Equipment, and optional features/basic IPv4/Link To IPAM; these are not public installation or upgrade procedures.

The original PR's developer-facing amendments to Device Assignments, Function Index, Optional Features, Role Permissions, Staff Directory APIs and Staff Directory Foundation are preserved. The historical PR's two non-callable Function Index entries are removed without moving source declarations.

The only source-file changes in this PR are the three pre-approved text replacements: one `backend/server.py` method docstring, one opening comment in `interface/staff-directory.js` and one Staff form help paragraph in that same JavaScript module. They are not new application features or a screen redesign.

## Resolved overlaps

- Preserve all nine accepted v2.1 guide screenshots, the README IPAM replacement, and the original historical images.
- Preserve published v2.1 Users/MFA and Migration instructions from PR #384; **do not reintroduce** milestone-only permissions or migration notices into these public pages.
- Add only a clearly labelled link to the separate draft v2.2 directory in both maintained copies of the published feature-guide index.
- Reconcile the README, ROADMAP, AGENTS guidance and developer index against the corrected current source instead of copying older descriptions from the original PR.
- Correct the milestone handover's superseded statement that `main` was unchanged, and identify the last *application* schema-15 checkpoint separately from the later documentation merge.
- Record the documentation merge provenance in Development Status. Retain historical handover sections and the original pre-Batch 3.5 review evidence.

## Verification scope and outstanding work

Verify that all eight published guide pairs are byte-identical, all 10 approved screenshot blobs and unchanged public v2.1 content remain intact, all changed local Markdown targets resolve, and the only source changes match PR #383 exactly. Confirm the Function Index still contains 835 recorded entries; its earlier source-line check was part of the original report, not automatically re-executed here. Hosted checks for the new PR head require their own status evidence.

Draft PR #383 is **not merge-authorised** by this reconciliation. Stage 3 Batch 3.4 manual/native acceptance remains deferred, not passed. Department Details requires separate approved screen design. Help & Guides finding I12, Stock/Returns, Stage 6 upgrade/restore verification, Batch 3.5, future releases and deployment remain outside this work.
