# Published And Development Versions

## Native Acceptance Correction Review — 26 November 2026

The authoritative starting checkpoint is `milestone-1` at `eff18a7acc2ec78e251562882c41af154bd929ed`, schema 31. The five approved native corrections are implemented on a dedicated correction branch; application source is `bf5a016039b9812c0825644b47c6b619bbad653e`. Schema remains 31. [Changes, tests, screenshot provenance and delivery status](../development-handovers/evidence/native-acceptance-corrections/README.md).

Focused local development verification passed. Independent review and product owner visual acceptance remain pending; keep [PR #470](https://github.com/Caffoot/Caffoot-Lite/pull/470) in draft. Native acceptance is paused after Test 69, with Test 70 next. Published v2.1, production and release requirements under #366 and the final comprehensive audit under #443 are unchanged. Older dated checkpoints below are retained as historical evidence.

## Current Integration — 24 November 2026

Caffoot Lite **v2.1 remains the published release**, at tagged source `c3237114108cad9f7d4e57657b6aed5e0091a5ef` (schema 10). Use the [published user guides](../how-tos/features-and-instructions/README.md) and [installation instructions](../../INSTALLATION.md) for that release.

Shared Devices was owner-accepted and merged through PR #447. The verified `milestone-1` integration revision is `2380334970e1162ad6811f1703a91dcfc863b803` (unreleased v2.2, schema 29). Stage 6.5 uses that source to verify the integrated workflows. [Stage 6.4 sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/431#issuecomment-7132417522) · [Stage 6.5 report](../development-handovers/evidence/stage-6-5/README.md)

The historical Stage 6.2 starting checkpoint was `milestone-1` at `2107de3668b08c5abdfdae6fe231a3114bbfc380` (unreleased v2.2, schema 28), after the Stage 5.1–5.6 merges. The isolated schema-10 → 28 upgrade passed there. The import protection correction was reviewed in [PR #445](https://github.com/Caffoot/Caffoot-Lite/pull/445). [Stage 6.2 evidence](../development-handovers/evidence/stage-6-2/README.md) · [Draft administrator guide](../how-tos/features-and-instructions/v2.2-draft/Legacy-Import-and-Docker-Upgrade.md)

### Historical Stage 5.4 Checkpoint — 23 November 2026

The owner accepted and merged Service Desk Batches 5.1–5.3 through [PRs #437](https://github.com/Caffoot/Caffoot-Lite/pull/437), [#438](https://github.com/Caffoot/Caffoot-Lite/pull/438) and [#439](https://github.com/Caffoot/Caffoot-Lite/pull/439). The verified `milestone-1` integration head for Batch 5.4 is `4600ec7bf6a0751af02fbcf003b7f299547cdfd9`, schema 26. [Stage 5.3 acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/422#issuecomment-7103488704)

Batch 5.4 adds the administrator support calendar, category management and live Service Desk reporting in schema 27 on its review branch. The draft guides and actual application evidence accompany the review. [Authorisation and scope](https://github.com/Caffoot/Caffoot-Lite/issues/423) · [PR #440](https://github.com/Caffoot/Caffoot-Lite/pull/440) · [Draft v2.2 guides](../how-tos/features-and-instructions/v2.2-draft/README.md)

### Stage 3 Development Integration — Historical Merge Ledger

| Integrated Work | Verified Merge Checkpoint |
| --- | --- |
| Staff/Departments and initial Device assignments/My Equipment, Batches 3.1–3.4 | PR #382, `05b162aa10a74994c970d0b6dbf111dc59b47513` |
| Department Details, IT Assets foundation and stock intake, Batches 3.5–3.7 | PRs #386–#388, `7f91f5d42feb3916cfab060abd5ca4b1558a92ba` |
| Issue, return, preparation and write-off, Batch 3.8 | PR #389, `7f11598b50bbb1fbd11893a2ad34bc152ff12ed1` |
| Device registration/reissue, Batch 3.9 | PR #390, `6276225e5d527c83f2ffaf36812ab7c7c5a5269f` |
| Associated Equipment and direct handovers, Batch 3.10 | PR #391, `53b04328c4f895bfc1f72f0416c43a519b2e8b42` |
| Correct Movement, Batch 3.11 | PR #392, `505ec1a60daccdfed4c2c36c9379a29ea6f5367d` |
| Issue Equipment confirmation | PR #393, `6222d8a87e4a02dd4e69f070e11777d2ec82b591` |
| Overview, reporting and Low Stock warnings, Batch 3.12/schema 20 | PR #398, `558286c2430ebee40246180d9f09aefdbb46f6b9` |
| Subsequent display/account/Staff/identity/session corrections | PRs #399, #401–#403, #405–#406, through `753b3266893987addb11406ef8303adb03c3c112` |

### Stage 4 — Owner-Accepted And Merged 19 November 2026

| Development batch | Issue | Merged PR | Verified integration checkpoint |
| --- | --- | --- | --- |
| 4.1 Supplier Management | #410 | [#414](https://github.com/Caffoot/Caffoot-Lite/pull/414) | `ea6e86c15e207d32795641b52685ae1ec6a828df` |
| 4.2 Supplier Issues / Purchasing Dashboard | #411 | [#415](https://github.com/Caffoot/Caffoot-Lite/pull/415) | `3165457b8c8f824da3e6156f4bf3ce276d7905cd` |
| 4.3 Equipment Supplier Integration | #412 | [#416](https://github.com/Caffoot/Caffoot-Lite/pull/416) | `e67ca1590f1669d722c1ebe2ba11896035d0c49c` |
| 4.4 Equipment Lifecycle | #413 | [#418](https://github.com/Caffoot/Caffoot-Lite/pull/418) | `c1b5f8008e8ba56840d9790e3ba1c7e91ad35e0b` |


Staff Members and Departments are core and independently permissioned. IT Assets is independently optional and defaults off on fresh installations. Schema 20 adds IT Assets Edit to the built-in IT Staff role default while preserving existing accounts' configured access with compatibility overrides; it does not automatically add new ordinary accounts to IT Staff.

**Still deferred** are Batch 3.4 manual acceptance, native Raspberry Pi, native Safari, Portainer and private-installation checks, and the two private legacy-export checks. The local Stage 6.5 report records cross-stage permissions, privacy and compatibility results. Independent review, final documentation and the separate release audit remain outstanding. [Stage 6 plan](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7020041373)

The [documentation review record](Stage-1-3-Documentation-Review.md) lists sources, screenshot approvals, wording discrepancies and remaining documentation acceptance. The [active handover](../development-handovers/milestone-01.md) preserves implementation evidence.

## Historical Checkpoints — Superseded Status, Preserved Evidence

All notes below describe their dated source/branch at the time of writing. Their pending-implementation, pending-merge and earlier schema statements are historical; the current integration table above takes precedence. Earlier test results are not results for the current HEAD.

**Historical Batch 3.12 review status — 16 November 2026:** The verified integration
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
- [Stage 6.2](../development-handovers/evidence/stage-6-2/README.md) records the isolated upgrade and import checks. [Stage 6.3](../development-handovers/evidence/stage-6-3/README.md) records isolated complete-volume restoration and matching-image rollback. The [v2.2 administrator procedure](../how-tos/features-and-instructions/v2.2-draft/Legacy-Import-and-Docker-Upgrade.md) is for review installations.
