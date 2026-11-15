# Active development handovers

This folder holds a short, up-to-date handover for each Caffoot Lite version we're actively developing.

Use the handover to pick up where the last session finished. The relevant GitHub issue holds the full plan and decisions; the handover records **what we've actually completed, what we've checked and what's next**. We don't need to copy every comment or test log into both places.

## Current work

Caffoot Lite v2.1 is the published baseline; v2.2 is an unreleased development target. Stage 1 is accepted and merged via PR #358. Stage 2 is accepted through PR #376 at `519842b46861c85fde0eebf78298117c2346599d`, with the later Optional Features design correction merged via PR #380. Stage 3 Batches 3.1–3.4 are merged via PRs #377, #378, #381 and #382; the current integration checkpoint is `05b162aa10a74994c970d0b6dbf111dc59b47513` (schema 15). Batch 3.4 manual acceptance is deferred, not passed. Later Stage 3 batches and Stages 4–6 remain pending. The [Milestone 01 handover](milestone-01.md) holds the current summary and preserved dated evidence. See [tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351), [documentation scope #366](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-6891608596) and the [draft v2.2 user guides](../how-tos/features-and-instructions/v2.2-draft/README.md). Completed release work stays in [historical handovers](../historical/development-handovers/).

## Keeping this useful

Update the relevant handover with each agreed development batch. Link to the issue, pull request and real checks, noting anything that hasn't been tested or accepted yet.

After a version has been published, move its finished handover to [historical development handovers](../historical/development-handovers/) and remove the active entry. Start a new handover only when the next version's work is agreed.

Published release history stays in its existing records; don't reopen completed stages merely because a chat session has ended.
