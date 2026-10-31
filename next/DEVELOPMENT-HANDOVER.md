# Next development handover — mandatory scope gate

**Read https://github.com/Caffoot/Caffoot-Lite/issues/215 directly from GitHub before EVERY development action, including after a new chat session starts.** Do not rely on this note, memory, earlier chats, old issue #214, or historical checkpoints as substitutes. #215 is the sole approved development specification for Next until release. This document is a handover reminder, **not an additional specification**.

## Non-negotiable procedure

1. Fetch and read the current issue #215 before planning, writing code, editing tests/docs, or creating a commit.
2. Verify that the specific proposed change is within #215's explicitly approved scope. Use published v1.3.3 source, technical workflows and existing tests to establish required inventory behaviour.
3. If the plan does not explicitly cover a choice, or a user-visible deviation appears necessary, **STOP. Ask the product owner one plain-English question and wait for approval.** Do not invent an improvement or decide the answer yourself.
4. Keep implementation lightweight for small IT teams. Work in large coherent batches where possible, with focused tests. Do not expand scope to cover speculative edge cases.
5. Before every commit, compare the batch with #215 again. Do not add independent requirements through tests, comments, checkpoints or architecture.
6. At each session handover, repeat this gate and provide the exact branch head, test status, and next #215-authorised task. Do not use a handover as permission to change direction.
7. #215 governs **development of Next**, not future post-release versions, which will require their own approved plan.

## Current checkpoint — 29 October 2026

Working branch: `Next`. Latest completed cleanup before this note: `8c06c22f10bb714bc2c47ba598d98988fe156f19`.

An unapproved application-managed pre-import snapshot and speculative stale-preview/concurrency mechanism were introduced, then removed in corrective commits `d115af0116e644e47c10644e8106adab23f03019` and `8c06c22f10bb714bc2c47ba598d98988fe156f19`. **Do not reintroduce them.** #215 requires external Docker/database backups, not a Caffoot-managed ongoing backup or recovery system. One-way published v1.3.3 JSON inventory import is a separate, explicitly approved migration function.

The current import implementation is an **offline-only development boundary**; it is not a production endpoint. Verify CI on the current branch and continue only with #215-authorised work. Do not claim CI is green without checking.

**The product owner's explicit instruction:** “#215 is king; nothing deviates at all.” If unclear, ask in plain English rather than improvising.

Authoritative specification: https://github.com/Caffoot/Caffoot-Lite/issues/215
