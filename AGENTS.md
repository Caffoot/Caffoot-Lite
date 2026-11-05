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

## Current Caffoot Lite v2.1 work

- Authoritative interface replacement plan: [Issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282).
- Approved visual source revision: `c26db4a56bbc30f95b56201e81a7a76d13c6037b`. The exact twelve source paths are listed in `docs/development-guide/Approved-HTML-Integration.md`.
- Development branch: `feat/approved-modular-html-282`. Preserve original draft PR #281 without modification.
- Use the approved HTML/CSS directly, retain the existing Python/SQLite functionality, and keep the application modular using HTML, CSS and JavaScript; no Svelte or substitute framework.
- The existing implementation and verification checkpoint must be inspected before new changes. Do not redo completed integration. Address only the explicitly authorised remaining defects and acceptance checks.
- Record visual matches and mismatches against the approved desktop/mobile designs; do not treat stylesheet inclusion or screenshot capture as visual acceptance.
- A private Docker acceptance build is for owner review only. Do not merge, publish or release without explicit approval.

## Communication

Use plain British English. Explain blockers and uncertainties promptly. Keep reports concise and factual, avoid repeated apologies and unsupported assurances, and ask for decisions only when genuinely necessary.
