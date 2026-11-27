# Milestone 01 — Batch 3 approved Service Desk evidence

Partial evidence record; not final acceptance or merge approval.

- Application/test revision: `ca860bc64ac31d672378f5130369bd0699fa58d8`
- [Focused verification run 45991574548](https://github.com/Caffoot/Caffoot-Lite/actions/runs/45991574548), artifact 15193514592.
- Chromium 141.0.7390.37, desktop viewport 1440 × 960, disposable HTTPS/SQLite fixture, schema 31, Europe/London; fictional Alex Morgan and Sam Taylor accounts.
- [Independent visual review](https://github.com/Caffoot/Caffoot-Lite/pull/486#issuecomment-7217356880) and [owner acceptance of four screenshots](https://github.com/Caffoot/Caffoot-Lite/pull/486#issuecomment-7217377723).
- Owner-uploaded originals verified byte-for-byte by matching Git blob hashes against the approved ZIP. Upload branch commit `36cca44fbc6d5e20c399800d5c4fecc0775d0e87`.

| Image | SHA-256 |
| --- | --- |
| [restored-empty-dates.png](restored-empty-dates.png) | `ab5efa9c24e2e60013eee4f84a520c6b2c58253c96029f20b5be2da2d222c6af` |
| [restored-populated-dates.png](restored-populated-dates.png) | `b128d1408843a46925af2031c3b81876e28d9b83b50b87dc165fd309ad399a49` |
| [workload-auto-created.png](workload-auto-created.png) | `2d62894703f44492043ed741c3adc1b092021ac89ea74112a02a991679da7d50` |
| [workload-auto-closed.png](workload-auto-closed.png) | `8977353541834034bad3be1673a8ca6b625873a65fc898d1bf025b51c3cc15fd` |

The original workload images demonstrate count changes, not the queue rows below the viewport. The inadequate original retry image is not accepted. The three outstanding queue captures were subsequently completed and accepted below.

## Accepted queue evidence — 27 November 2026

- Capture revision: `a736a4945302b579a3d8baea97b0061f6c494d94`; application source unchanged from the earlier focused pass.
- [Successful focused run 46002279228](https://github.com/Caffoot/Caffoot-Lite/actions/runs/46002279228), artifact 15197959706; Chromium 141.0.7390.37, viewport 1440 × 960, same disposable HTTPS/SQLite fictional fixture, schema 31, Europe/London.
- [Independent review](https://github.com/Caffoot/Caffoot-Lite/pull/486#issuecomment-7218863698); [owner visual acceptance](https://github.com/Caffoot/Caffoot-Lite/pull/486#issuecomment-7218889181).
- Original ZIP PNG hashes recomputed; owner-uploaded originals at `1f906b987bd1e5a6fbe65abf2f30edd91c01ddff` match the original Git blob hashes.

| Image | SHA-256 |
| --- | --- |
| [queue-auto-created.png](queue-auto-created.png) | `b7ff20dfe3124db94178b9191d9be39db4b40dc63ce3b2309a6795105f6bd668` |
| [queue-auto-closed.png](queue-auto-closed.png) | `1047574cd72f61d46e04866ccbc5db7e17166774bdab77c8d3f1eb11c3c1bf9a` |
| [workload-refresh-retry.png](workload-refresh-retry.png) | `a42d4594ad204e7a22107f688b6a2ee36a8d505b015b4ac285d098aa424e7cd8` |

These scrolled queue views show SD-0005 appearing, disappearing from the Open filter after closure, and the explicit retry notice with retained SD-0002. Open filter and Updated · Oldest sort remain visible. They do not depict workload cards; the four original accepted images remain unchanged. Timing, retry recovery, security and reporting outcomes rely on the focused test results, not static pixels alone. The sidebar badge differs between frames; its synchronisation is not established by this evidence. Seven accepted images now cover the agreed visual states. Final CI, separate owner merge approval and consolidated targeted native reacceptance remain outstanding.

