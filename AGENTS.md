# Caffoot Lite — Instructions for coding agents

These rules apply to all AI-assisted development in this repository. Read them before editing. The product owner retains final authority. Approved GitHub issues, pinned designs, specifications and explicit owner decisions are authoritative.

## Non-negotiable working rules

1. **Follow the approved plan exactly.** Implement only the authorised scope. Do not reinterpret requirements, replace approved HTML with approximations, redesign interfaces, or invent features.
2. **Ask rather than assume.** If a material requirement is unclear and the decision would change approved behaviour, ask the product owner before proceeding. Do not silently choose an alternative.
3. **Use the simplest approved approach.** Do not introduce frameworks, new architectures, refactors or additional dependencies without explicit approval. Do not confuse permission to implement a feature with permission to redesign it.
4. **Preserve working behaviour.** Protect existing data, installation and upgrade compatibility, URLs, APIs, permissions, authentication, security and all approved functionality unless expressly instructed otherwise.
5. **Control scope and cost.** Complete the defined task rather than repeatedly expanding investigation. Reuse existing evidence and completed tests. Avoid duplicated work, speculative improvements, repeated whole-suite runs without a reason, and unnecessary tool calls. Resource or credit limits never justify an unapproved shortcut.
6. **Commit and push meaningful checkpoints early.** After a coherent change, run appropriate focused checks, commit and push to the explicitly authorised development branch before further lengthy work. Clearly label any partially tested checkpoint; never treat it as accepted. Never leave substantial completed work solely in an ephemeral workspace.
7. **Test proportionately, then meet the acceptance criteria.** During development run checks relevant to each change; complete all explicitly required functional, security, Docker and visual acceptance checks before declaring the work ready. Passing automated tests alone does not prove visual fidelity.
8. **Report only verified results.** Distinguish implemented, committed, pushed, tested, failed, untested and owner-approved. Provide exact commit SHAs and real evidence. Never claim a build, test, visual match or release succeeded without verification.
9. **Stop at a genuine blocker.** If the approved approach cannot work, explain exactly what prevents it and the minimum proposed change; obtain explicit owner approval *before* deviating. Do not disguise a workaround as equivalent.
10. **Respect the delivery boundary.** Do not modify `main`, merge PRs, publish images or releases, or change unrelated branches/issues unless explicitly authorised. A finished task is the agreed outcome, not a large diff, high test count or long-running investigation.

## Stop-and-simplify trigger

If the product owner **or the assistant** says "this is too complicated", "this is getting silly", or words to that effect, **stop repeating the current procedure**. Treat the comment as an instruction to investigate the simplest safe, supported route to the agreed outcome, not as permission to drop security or acceptance checks.

- State what has already been completed and preserved, what is actually blocked, and why. Do not restart finished work or repeat failed approaches without new evidence.
- Check the available tools, access permissions, repository settings and alternative supported workflows before requesting further manual steps. Prefer direct access and the fewest straightforward owner actions.
- Explain the viable options, their security and delivery trade-offs, and recommend the least complicated one that preserves the approved requirements. Distinguish genuine restrictions from optional process.
- If the agreed approach must change, **obtain explicit owner approval before changing the route, scope, security boundary or release plan**. Document the chosen route, failed approach and exact next step in the relevant handover so the same obstacle is not revisited.

## Efficient development and final verification

- **Do not spend coding time watching CI.** Implement the approved change, run only relevant focused tests, commit and push the checkpoint, report the PR link and test results, then stop. Do not poll GitHub Actions, repeatedly call `gh run view`, wait for workflows to finish or repeatedly rerun passing suites. Independent reviewers monitor CI outside the coding session.
- **Draft PRs are for development.** The complete backend, Docker Compose and multi-browser regression workflows are deferred while a PR is a draft. Run the necessary focused checks locally to establish that each changed behaviour, permission and data safeguard works. Record anything not tested. Do not treat a skipped full check as a pass.
- **Ready For Review is the final CI checkpoint.** After the implementation, essential documentation and required screenshots are complete, mark the PR Ready For Review to trigger the full existing checks. A subsequent change to application code requires the new head to pass its required checks before merge. Do not rerun these full suites automatically on each `milestone-1` merge: the PR's reviewed code receives the full check before merge. Keep manual and publication checks available. Never push directly to `milestone-1` to bypass PR review; if an exceptional direct push is authorised, run the complete backend, Docker and browser workflows manually. Before merging, ensure the final checks apply to the current integration base and PR head; if the base has changed materially, repeat the affected acceptance checks.
- **Evidence-only follow-ups are narrow.** Review only the new evidence and affected files; do not regenerate unrelated screenshots or repeat broad local testing. Record any check affected by the changed PR head.
- **Never weaken acceptance to save credits.** Permissions, persistence, security, release and compatibility requirements still apply. If a focused check cannot establish safe behaviour, run the necessary wider check and explain why. The owner alone approves scope, merges and releases.

## Current release and next work

- **Published baseline:** [Caffoot Lite v2.1](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.1), released on 8 November 2026. The accepted modular interface is already on `main`.
- **Historical v2.1 requirements:** [Issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282) and the approved visual source revision `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. The twelve source paths are recorded in `docs/development-guide/Approved-HTML-Integration.md`. These are historical references, not a task to repeat.
- **Development target:** **v2.2 — Milestone 01: Everyday IT Management** ([tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351), [documentation plan #366](https://github.com/Caffoot/Caffoot-Lite/issues/366)). Stage 1 and Stage 2 are accepted. Stage 3 Batches 3.1–3.12, Issue Equipment confirmation and subsequent focused corrections are merged on `milestone-1` through `753b3266893987addb11406ef8303adb03c3c112` (schema 20), verified 17 November 2026. Stock circulation, Device registration/reissue, Associated Equipment, direct handovers, Correct Movement and IT Assets Overview/Low Stock warnings are implemented. Batch 3.4 manual/native acceptance and Stage 6 compatibility/upgrade/restore acceptance remain deferred; Stages 4–6 and release acceptance remain outstanding. There is no approved release date. Use [Development Status](docs/development-guide/Development-Status.md), the [draft v2.2 guides](docs/how-tos/features-and-instructions/v2.2-draft/README.md) and the published v2.1 guides with their stated version boundaries.

- **Working branch:** `milestone-1` is the integration and private-acceptance branch for remaining Milestone 01 development. Target feature PRs at that branch; do not merge `milestone-1` into `main` until the whole milestone is accepted and the owner separately authorises that merge. GitHub automatically deletes a PR's source branch after merge, so preserve the milestone branch until final close-out.
- **Version truth:** v2.1 remains the only currently published baseline. Do not offer a v2.2 installation image, published release link, tested upgrade procedure or production instruction until separately verified and authorised. Prepare draft v2.2 guidance as its implementation is delivered; preserve historical v2.1 evidence and actual installation instructions.
- **Website:** tracked independently in `Caffoot/Caffoot-Website`; review and seek explicit owner approval before any website implementation or deployment.
- Preserve the working v2.1 HTML/CSS/JavaScript, Python/SQLite data, permissions and security. New changes require their own approved issue or explicit scoped owner instruction; no framework substitution or speculative redesign.
- Test proportionately, record actual evidence and use separate owner approval for PR merges and public releases.

## Communication

Use plain British English. Explain blockers and uncertainties promptly. Keep reports concise and factual, avoid repeated apologies and unsupported assurances, and ask for decisions only when genuinely necessary.
