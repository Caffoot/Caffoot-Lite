# Device Stock Registration, Reissue And Hardware Evidence

> Draft v2.2 — Not Yet Published. Review evidence for
> [draft PR #390](https://github.com/Caffoot/Caffoot-Lite/pull/390), targeting
> `milestone-1`. No owner visual acceptance, merge, release or deployment is claimed.

## Scope And Safeguards

Starting integration revision: `7f11598b50bbb1fbd11893a2ad34bc152ff12ed1`.
One feature branch: `feat/it-assets-device-registration-reissue`.

| Checkpoint | Pushed Commit | Actual Check At That Checkpoint |
| --- | --- | --- |
| Preflight/source mapping | `fe0eabc` | Read-only source, transaction and approved-reference review |
| Atomic registration backend | `e1e15a6` | 152 focused backend tests passed |
| Existing Add Device integration | `5af850b` | Real Chromium stock/Device entry routes, prefill, save accounting and cancellation passed |
| Separate reissue | `970fcc0` | 94 affected backend tests passed; expanded ten-test reissue suite and actual Chromium reissue passed |
| Optional hardware/manufacturers | `3a9d323` | 107 focused backend tests and real Chromium storage/catalogue journey passed |

The [technical mapping](../../../development-guide/Device-Stock-Registration-and-Reissue.md)
records the exact write boundaries and API routes. Device creation, managed IPAM
changes, stock linkage, transfer and audit share one immediate transaction.
The normal Device writer is reused without an internal commit. Reissue creates a
new permanent assignment and matching physical issue without updating the Device.
Historical allocation restrictions and immutable Schema 16/17 definitions remain.
No migration, second inventory or assignment database is introduced.

Actor-scoped operation references, request digests and versions protect identical
retries, changed/stale requests and competing writes. Both independent Edit rights,
live session/MFA, eligibility and recipient status are checked under the write lock;
the HTTP handlers retain Origin, CSRF, content-type, size and duplicate-field checks.
Stock possession is journalled explicitly. The normal direct Device route retains
its independent rights and optional IPAM/Racks behaviour.

Storage Type is separate from capacity. Optional physical Server Boot/ZFS records
never calculate or overwrite legacy RAID/capacity/drive count. A selected existing
Boot Pool is referenced once. UPS/PDU changes add approved manufacturer suggestions
only, including Ubiquiti, using the existing custom/hidden-preference mechanism.

## Final Verification

Final source, complete local backend/browser/Docker/documentation results, final
Actions and screenshot hashes are being recorded in the following evidence
checkpoint. The results above describe only the completed development checkpoints.

Native Raspberry Pi/Safari, private legacy-export and Stage 6 full-volume restore
acceptance remain deferred under the existing plan. No website, release, production
`main` or other excluded batch is changed.

## Changed-Screen Gallery

Genuine fictional desktop/mobile light/dark captures are being added for the
changed stock selection, reissue and optional hardware controls. Earlier accepted
screenshots remain unchanged. This gallery does not establish owner visual approval.

See the [draft step-by-step user guide](../../../how-tos/features-and-instructions/v2.2-draft/Device-Stock-Registration-and-Reissue.md).
