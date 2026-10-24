# New session recovery procedure

**Status:** Development procedure, proposed for review on the v1.3.1 development branch, 24 October 2026. This procedure does not replace existing approval and release controls.

## Purpose

A new ChatGPT conversation or contributor must be able to resume Caffoot Lite work from current repository evidence without relying on the previous conversation, a handover note or recollection. The repository is authoritative for recorded technical state; the GitHub Project board helps with planning but does not prove tests or implemented behaviour.

## Required checks before work

1. Confirm repository identity, default branch, current working branch, branch head and latest published GitHub release. Do not assume that a previous session's branch or release is still current.
2. Read [development workflow](DEVELOPMENT-WORKFLOW.md), [technical documentation policy](TECHNICAL-DOCUMENTATION-POLICY.md), the [contributor guide](../../../CONTRIBUTING.md) and applicable repository protection and release rules.
3. Read the [master audit register](../../audits/V1.3.0-DOCUMENTATION-COVERAGE-AUDIT.md), [findings programme](../../audits/AUDIT-FINDINGS-REMEDIATION-PROGRAMME.md), relevant [technical workflows](../../workflows/TECHNICAL-WORKFLOWS.md), test matrices and release roadmap. Distinguish administratively closed audits from open follow up findings.
4. Inspect open issues, milestones, pull requests, their base and head branches, the Project board stages where accessible, and latest commit level CI results. If a board status cannot be read, say so and do not infer it from an issue label.
5. Identify the latest agreed product decisions, explicit permissions, work in progress and remaining risks from committed documentation and issue or PR discussion. A handover document is supporting context, not a substitute for live checks.
6. Summarise the confirmed starting point in plain British English: published release, working branch and PR, current issue, implemented changes, actual test evidence, outstanding work and next proposed step. Identify any evidence that could not be checked.
7. Follow the established sequence: Understand, Agree, Implement, Verify, Document, Reconcile, Approve and release. Do not change application behaviour, merge into main, publish a release or change repository protections without explicit product owner approval. Keep the standalone HTML experience and historical JSON backup compatibility protected.

## Checkpoint and handover discipline

After each significant change or audit checkpoint, update the affected technical workflow, test matrix, findings register, roadmap and master audit where its status or cross references genuinely change. Reconcile status summaries and links before claiming completion. Record precisely which checks were executed, which were only inspected and which are still pending. State whether changes were committed, merged or released. Keep decisions and outstanding work in the repository so that a future session can recover them without a separate handover file.

## Suggested new chat instruction

> Mate, continue Caffoot Lite from GitHub. Follow the repository new session recovery procedure, verify the current branches, release, audit, PRs, CI and Project board, then tell me where we are before making changes.

If live GitHub access is unavailable, ask for the relevant repository access or source material. Never present remembered status as newly verified.
