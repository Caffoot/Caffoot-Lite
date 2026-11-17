# Published and development versions

**Current Batch 3.12 review status — 16 November 2026:** The verified integration
base is `6222d8a87e4a02dd4e69f070e11777d2ec82b591`, after the Issue Equipment
confirmation. The IT Assets dashboard is implemented on `feat/it-assets-dashboard`.
Its reporting checkpoint is `ebff8ea`; code, tests and four screenshots were preserved
in `27e1d31`. Schema 20 updates the built-in IT Staff default without widening existing
accounts' access. See the [dashboard contract](IT-Assets-Dashboard.md) and
[verification evidence and limitations](../development-handovers/evidence/stock-dashboard/Report.md).
The earlier eight reporting tests and focused browser check passed. Completion of
the later combined reporting/role check is unconfirmed. Independent code review,
final focused verification and owner visual acceptance remain outstanding. No merge,
v2.2 release or deployment is included. Native/manual and Stage 6 acceptance remains deferred.

## Historical Pre-Merge Checkpoints

The dated notes below preserve their original scope. Their pending-review and
pending-merge statements are superseded by the current integration status above.

> **Historical Batch 3.11 final review correction — 16 November 2026:** [PR #392](https://github.com/Caffoot/Caffoot-Lite/pull/392)
> adds the approved Return Equipment → Correct Movement → refreshed Return
> Equipment journey. [Integration evidence](../development-handovers/evidence/stock-corrections/Report.md#return-equipment-integration)
> supplements the preserved, owner-approved screenshots. Independent review and
> final owner approval remain. The separate approved Issue Equipment confirmation
> is outstanding for a focused PR after Batch 3.11; it is not implemented here.

> **Historical Batch 3.11 checkpoint — 16 November 2026:** Batch 3.10 / PR #391
> is merged and accepted at verified `53b04328c4f895bfc1f72f0416c43a519b2e8b42`.
> Correct Movement is implemented on `feat/correct-stock-movement`,
> [draft PR #392](https://github.com/Caffoot/Caffoot-Lite/pull/392), using schema 19
> without a migration. See [the correction contract](IT-Assets-Correct-Movement.md),
> [draft instructions](../how-tos/features-and-instructions/v2.2-draft/IT-Assets-Correct-Movement.md)
> and [verification evidence](../development-handovers/evidence/stock-corrections/Report.md).
> Owner visual review and explicit merge approval remain. No release, deployment
> or Batch 3.12 work is included. Earlier dated checkpoints below are historical.


> **Historical development checkpoint — 16 November 2026:** Batches 3.8/3.9 are
> merged through PR #390 at `6276225e5d527c83f2ffaf36812ab7c7c5a5269f`.
> Batch 3.10 associations and prepared canonical reassignment are implemented
> on [draft PR #391](https://github.com/Caffoot/Caffoot-Lite/pull/391), schema 19.
> The [contract](Associated-Equipment.md), [approved direct sequence](Direct-Handover-Decision.md),
> [draft instructions](../how-tos/features-and-instructions/v2.2-draft/Associated-Equipment.md)
> and [36-capture final review report](../development-handovers/evidence/associated-equipment-final/Report.md)
> record the actual implementation and verification. Final-head Actions are
> reported in PR #391. Owner visual acceptance, merge and release are not claimed;
> native/private-data/Stage 6 acceptance remains deferred. Earlier dated source
> checkpoints below retain their historical scope.


Caffoot Lite **v2.1 is the published release**. Its tagged source is [c3237114108cad9f7d4e57657b6aed5e0091a5ef](https://github.com/Caffoot/Caffoot-Lite/tree/v2.1); it uses schema 10. The [published user guides](../how-tos/features-and-instructions/README.md) and [installation instructions](../../INSTALLATION.md) describe that release.

## Historical Repository Checkpoints — Not Released Images

The table below records the **15 November 2026 pre-synchronisation checkpoints**. Subsequently, approved public-documentation corrections were merged into `main` via PR #384 at `3d66c3ee6fd9d9c51ecbdd5822bc1c4fe98b8e7b` and synchronised to `milestone-1` via PR #385 at `47c2ebe3d9249199c0c42dc71fd571b9f6411641`. Those documentation merges did **not** publish v2.2 or change the milestone's schema-15 application behaviour. The draft v2.2 guides are [here](../how-tos/features-and-instructions/v2.2-draft/README.md).

| Source | Status | Relevant behaviour |
| --- | --- | --- |
| Published `v2.1` tag | Released, schema 10 | Devices/IPAM/Racks grants; ordinary Read does not require MFA; Edit and Administrator require enrolment |
| `main` at `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a` | Stage 1 accepted via PR #358, but not a new release; schema 12 | Shared roles, overrides, IT Staff, wider-access MFA and account operations |
| `milestone-1` at `05b162aa10a74994c970d0b6dbf111dc59b47513` | Unreleased v2.2 target; schema 15 | Stage 2 accepted; Stage 3 Batches 3.1–3.4 merged, with Staff/Departments and initial Device assignments/My Equipment |

Stage 3 Batches 3.1–3.7 are merged on `milestone-1` at `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` (schema 16, PR #388). Batch 3.7 stock intake is visually accepted. Batch 3.8 issue, return, preparation and write-off are implemented for review on `feat/it-assets-issue-return-writeoff` (draft PR #389), including the narrow Schema 17 assignment-closure migration. Batch 3.8 is not merged, visually accepted or released. Batch 3.4 manual/native acceptance remains deferred. Device stock registration/reissue, associations, corrections, dashboards/warnings and Stages 4–6 remain pending. Staff Members and Departments remain core in the v2.2 direction. See [Stock Intake](IT-Assets-Stock-Intake.md) and [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md). None of this publishes v2.2.

The [milestone tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351), [Stage 3 decisions #368](https://github.com/Caffoot/Caffoot-Lite/issues/368) and [documentation plan #366](https://github.com/Caffoot/Caffoot-Lite/issues/366) control scope and acceptance. Draft PR #383 remains separate and unmerged. This public-documentation correction does not copy its implementation or draft guides into `main`.

## Read the right reference

- For published installation, security and recovery, use the v2.1 guides. Preserve the entire persistent `/data` mount and matching image; JSON import is not a Docker backup.
- For source maintenance, match the guide and tests to the exact branch/revision. [Role Permissions](Role-Permissions.md) describes the unreleased Stage 1 contract; [the historical rehearsal](Upgrade-And-Restore-Rehearsal.md) is not a current milestone upgrade procedure.
- Use [Optional Features](Optional-Features.md), [Device Assignments](Device-Assignments.md) and [Stock Circulation](IT-Assets-Issue-Return-and-Write-Off.md) with their stated unreleased source revisions; historical checkpoint evidence retains its original scope.
- Full completed-milestone legacy-import compatibility and complete-volume upgrade/restore verification belong to Stage 6. No public v2.2 image or tested production upgrade/rollback procedure is offered here.
