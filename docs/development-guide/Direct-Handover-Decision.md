# Direct Workstation Handover — Approved Sequence

**Owner approval, 16 November 2026:** the owner explicitly approved this document's
placement and sequence, including Reassign Device within Assigned To, the reused
reissue/preparation controls and Confirm Ready And Reassign. A narrowly scoped,
audited, separately migrated assignment closure is authorised. Devices-only
operation and optional-feature protections must remain intact. No merge, release
or deployment is authorised. The proposal below is retained as the approved
source map; implementation and acceptance are reported separately.

**Implementation checkpoint:** Schema 19's additive closure foundation is tested;
the direct writer/interface and E acceptance are still in progress.

## The Exact Source Constraint

`assignment_closure.py:retain_device_assignment_update` permits closing an
assignment only against a new, audited physical return or write-off fact. The
existing **Reissue Existing Device** form offers only genuinely held, prepared
Ready registered Devices. **Return Equipment** records a real physical receipt;
its preparation controls operate on held stock. None currently confirms
preparation of an assigned workstation that never enters stock.

Using those contracts unchanged for direct transfer would invent a receipt or
misstate stock. Weakening initial allocation, editing immutable history or
silently changing Schema 18 is not an acceptable alternative.

The [direct preparation approval](https://github.com/Caffoot/Caffoot-Lite/issues/232#issuecomment-6849806400)
expressly leaves exact confirmation placement and sequencing for review. The
[missing-quantity approval](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6913302245)
settles accessory resolution but retains that direct-handover boundary. The
current task likewise requires stopping for a necessary new user-visible decision.
[AGENTS.md](../../AGENTS.md) rule 2 says: “If a material requirement is unclear
and the decision would change approved behaviour, ask the product owner before
proceeding.”

## Approved Placement And Sequence

The owner approved this one source-faithful extension; no new preparation screen:

| Step | Existing Interface And Proposed Addition |
| --- | --- |
| Resolve accessories | Use Associated Equipment → Return Equipment for actual returns, or Write Off for genuinely missing/broken issued quantities. Each real action keeps its own permanent record. |
| Start direct transfer | Add **Reassign Device** beside the existing actions in Device Details → Assigned To. Keep the current holder until the final save succeeds. |
| Choose recipient | Reuse the current Reissue Existing Device form and its eligible Staff/Department lookup, date and optional note. Fix the selected Device to the current canonical workstation rather than offering held stock. |
| Confirm preparation | On that same form, reuse the applicable **Checked Working** and **Data Wiped / Reset** controls from existing preparation, with unchecked defaults. Use **Confirm Ready And Reassign** as the explicit final Ready confirmation and save action. |
| Save or fail | Reject any outstanding linked accessory, incomplete applicable check, stale selection or lost authorisation. Commit preparation evidence, old/new canonical holder history and any necessary registered-stock holder facts together. On failure, retain the old holder and add no partial handover. |

Actual accessory returns/write-offs completed earlier remain accurate historical
facts if the later workstation save fails. They are not undone or fabricated.
Accessories never follow automatically. The direct workstation does not enter
Physically Held or Ready stock; no stock receipt is recorded. Existing genuine
storeroom return → preparation → reissue remains available and unchanged.

## Technical Work After The Decision

Implement a narrowly migrated, audited non-return closure path while preserving
the existing canonical assignment table, immutable history and Schema 18 links.
For an already stock-linked issued Device, its stock ledger must also change
holder consistently without any held/Ready balance increase. A Device without
stock provenance must remain outside stock. This needs focused migration,
concurrency, rollback, stale-check and permission/feature-off tests; the original
physical-return and write-off guards must remain intact.

Then capture the changed direct-handover form in desktop/mobile light/dark,
complete D, push, and perform E's final-head acceptance. No merge, release or
deployment is authorised by approving the interface sequence.

The former placement/sequence approval blocker is resolved. Any further departure
from these controls or rules still requires a new owner decision.
