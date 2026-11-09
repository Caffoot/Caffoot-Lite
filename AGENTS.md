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

## Current release and next work

- **Published baseline:** [Caffoot Lite v2.1](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.1), released on 8 November 2026. The accepted modular interface is already on `main`.
- **Historical v2.1 requirements:** [Issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282) and the approved visual source revision `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. The twelve source paths are recorded in `docs/development-guide/Approved-HTML-Integration.md`. These are historical references, not a task to repeat.
- **Next application work:** planning is organised under the [six future milestones](docs/product-direction/PROPOSED-MILESTONES.md). No new implementation scope or release number has been approved just by grouping issues.
- **Website:** tracked independently in `Caffoot/Caffoot-Website`; review and seek explicit owner approval before any website implementation or deployment.
- Preserve the working v2.1 HTML/CSS/JavaScript, Python/SQLite data, permissions and security. New changes require their own approved issue or explicit scoped owner instruction; no framework substitution or speculative redesign.
- Test proportionately, record actual evidence and use separate owner approval for PR merges and public releases.

## Communication

Use plain British English. Explain blockers and uncertainties promptly. Keep reports concise and factual, avoid repeated apologies and unsupported assurances, and ask for decisions only when genuinely necessary.
