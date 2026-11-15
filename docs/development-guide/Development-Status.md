# Published and development versions

Caffoot Lite **v2.1 is the published release**. Its tagged source is [c3237114108cad9f7d4e57657b6aed5e0091a5ef](https://github.com/Caffoot/Caffoot-Lite/tree/v2.1); it uses schema 10. The [published user guides](../how-tos/features-and-instructions/README.md) and [installation instructions](../../INSTALLATION.md) describe that release.

## Repository source is not a released image

The table below records the **15 November 2026 pre-synchronisation checkpoints**. Subsequently, approved public-documentation corrections were merged into `main` via PR #384 at `3d66c3ee6fd9d9c51ecbdd5822bc1c4fe98b8e7b` and synchronised to `milestone-1` via PR #385 at `47c2ebe3d9249199c0c42dc71fd571b9f6411641`. Those documentation merges did **not** publish v2.2 or change the milestone's schema-15 application behaviour. The draft v2.2 guides are [here](../how-tos/features-and-instructions/v2.2-draft/README.md).

| Source | Status | Relevant behaviour |
| --- | --- | --- |
| Published `v2.1` tag | Released, schema 10 | Devices/IPAM/Racks grants; ordinary Read does not require MFA; Edit and Administrator require enrolment |
| `main` at `6008fedfc2c25fc40b49c9e9e21f3a93d61a9f4a` | Stage 1 accepted via PR #358, but not a new release; schema 12 | Shared roles, overrides, IT Staff, wider-access MFA and account operations |
| `milestone-1` at `05b162aa10a74994c970d0b6dbf111dc59b47513` | Unreleased v2.2 target; schema 15 | Stage 2 accepted; Stage 3 Batches 3.1–3.4 merged, with Staff/Departments and initial Device assignments/My Equipment |

Batch 3.4 manual/native acceptance is **deferred, not passed**, under the [owner’s testing schedule](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6891505360). Batch 3.5 Department Details merged via PR #386, followed by Batch 3.6 IT Assets Foundation via PR #387 at `774dee3ecaaf1d50ba94dbf55891aa4b79b853c5`, schema 16. The [combined-batch plan](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6897801454) and [Batch 3.7 start](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6897927354) authorise Receive Stock, Stock Inventory and readiness. They are implemented on `feat/it-assets-stock-intake` for draft review. See [Stock Intake](IT-Assets-Stock-Intake.md). Issue/return/write-off, Device stock registration, associations, corrections, dashboards/warnings, Suppliers, Service Desk and Stages 4–6 remain pending. Staff Members and Departments remain core in the v2.2 direction. None of this publishes v2.2.

The [milestone tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351), [Stage 3 decisions #368](https://github.com/Caffoot/Caffoot-Lite/issues/368) and [documentation plan #366](https://github.com/Caffoot/Caffoot-Lite/issues/366) control scope and acceptance. Draft PR #383 remains separate and unmerged. This public-documentation correction does not copy its implementation or draft guides into `main`.

## Read the right reference

- For published installation, security and recovery, use the v2.1 guides. Preserve the entire persistent `/data` mount and matching image; JSON import is not a Docker backup.
- For source maintenance, match the guide and tests to the exact branch/revision. [Role Permissions](Role-Permissions.md) describes the unreleased Stage 1 contract; [the historical rehearsal](Upgrade-And-Restore-Rehearsal.md) is not a current milestone upgrade procedure.
- Follow [Optional Features](https://github.com/Caffoot/Caffoot-Lite/blob/05b162aa10a74994c970d0b6dbf111dc59b47513/docs/development-guide/Optional-Features.md) and [Device Assignments](https://github.com/Caffoot/Caffoot-Lite/blob/05b162aa10a74994c970d0b6dbf111dc59b47513/docs/development-guide/Device-Assignments.md) only for that unreleased milestone source.
- Full completed-milestone legacy-import compatibility and complete-volume upgrade/restore verification belong to Stage 6. No public v2.2 image or tested production upgrade/rollback procedure is offered here.
