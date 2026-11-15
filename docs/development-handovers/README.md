# Active development handovers

This folder holds a short, up-to-date handover for each Caffoot Lite version we're actively developing.

Use the handover to pick up where the last session finished. The relevant GitHub issue holds the full plan and decisions; the handover records **what we've actually completed, what we've checked and what's next**. We don't need to copy every comment or test log into both places.

## Current work

Caffoot Lite v2.1 is the published baseline; v2.2 is unreleased. Stage 1 and Stage 2 are accepted. Stage 3 Batches 3.1–3.6 are merged on `milestone-1`, now at `774dee3ecaaf1d50ba94dbf55891aa4b79b853c5` (schema 16, PR #387). Batch 3.6 adds the independent default-off IT Assets switch and four empty stock tables. Batch 3.7 Receive Stock, Stock Inventory and readiness are implemented on `feat/it-assets-stock-intake` for draft review; they are not merged, visually accepted or released. Batch 3.4 manual/native acceptance remains deferred. Later stock workflows and Stages 4–6 remain pending. The [Milestone 01 handover](milestone-01.md) holds current checks and preserved dated evidence. See [tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351), [documentation scope #366](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-6891608596) and [draft v2.2 guides](../how-tos/features-and-instructions/v2.2-draft/README.md). Completed release work stays in [historical handovers](../historical/development-handovers/).

## Keeping this useful

Update the relevant handover with each agreed development batch. Link to the issue, pull request and real checks, noting anything that hasn't been tested or accepted yet.

After a version has been published, move its finished handover to [historical development handovers](../historical/development-handovers/) and remove the active entry. Start a new handover only when the next version's work is agreed.

Published release history stays in its existing records; don't reopen completed stages merely because a chat session has ended.
