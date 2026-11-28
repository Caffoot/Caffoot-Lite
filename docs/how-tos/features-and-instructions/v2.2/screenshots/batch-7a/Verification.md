# Batch 7A — Static Verification And Acceptance

**Current acceptance — 27 November 2026:** 38/40 accepted images; all 19 groups and 85 specifications retained. [Independent review and owner acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7211815146) supersede the earlier capture blocker. `B2-17-S02` now maps to the exact written example in Optional Features: **“Disable Network Racks? Saved data and permissions will be retained.”** No further screenshot, recapture, runtime retest or virtual-display tooling is required or used.

The independent review opened all 38 images and checked state coverage and guide mapping. It expressly did not recompute all image hashes or rerun the full static suite. The earlier 38/38 hash/dimension results below remain attributed to that capture checkpoint. Batch 7B static checks separately verify administrative reconciliation, unchanged 7A PNGs/provenance and all 85 coverage IDs. Owner visual acceptance is not publication, runtime or release acceptance.

## Historical Static Capture Verification

The following dated pre-acceptance results and pending/blocker wording are preserved as history and are superseded for current acceptance by the decision above.

# Original Static Verification Record

27 November 2026. Static documentation/image checks only. Independent and owner visual acceptance remain pending. The native disable-confirmation capture remains blocked; see the [pack record](README.md#capture-blocker--native-disable-confirmation).

Verification results are recorded below after the final scoped checks. This page does not claim application acceptance, regression, native or release verification.

| Check | Result |
| --- | --- |
| Final proposed PNG files / SHA-256 / decoded dimensions | 38 files; 38/38 hashes and dimensions match the manifest |
| Approved ceilings | Devices 15/15, IPAM 11/11, Racks 9/10, Optional Features 3/4; total 38/40 |
| Original traceability | All 19 groups and 85 unique specifications map individually; original Requirement Register remains byte-identical |
| Accepted guide prose | Preserved byte for byte after excluding inserted image/caption pairs and current-status notices |
| Local destinations in four guides and pack records | 241 occurrences resolve; 27 applicable local heading anchors resolve |
| Embedded guide images | 39 occurrences, all with non-empty alt text; one Location image shared across two guides |
| Markdown | Balanced fences, consistent table columns and `git diff --check` pass |
| Existing release documentation compatibility | Existing workflow's Python check executed unchanged; eight published/legacy guide pairs remain byte-identical |
| Complete Git tree since authorised start | 50 authorised paths differ: eight existing Markdown documents and 42 new pack files; 2,095 other tracked mode/blob identities preserved |
| Application baseline | All existing non-Markdown tracked identities match the application baseline; schema 31 unchanged |
| Privacy and provenance | All 38 final images opened locally; fictional equipment/documentation address ranges, no visible credentials, usable codes or private infrastructure; capture context and permissions recorded per image |
| Independent/owner acceptance | Pending; local inspection does not confer acceptance or publication approval |
| Essential outstanding image | B2-17-S02, native disable confirmation; explicit capture-method approval required |

Starting refs were verified remotely: documentation `e9ff3e18fb1eca21f91c856c93e8a8ba6b67963e`, application/integration `fdc677920bfc52f48f641b3d6d1344c902a6a9b0`, published v2.1 `c3237114108cad9f7d4e57657b6aed5e0091a5ef`. The initial local `work` branch was clean and retained at `3d66c3ee6fd9d9c51ecbdd5822bc1c4fe98b8e7b`. The partial 18-image checkpoint was pushed and its remote SHA verified as `38d19d379668908337e97367f5d4e5cf37d6c265` before continuing.

The four unresolved historical image candidates were not reassessed or reused. Installation.md now records Batch 6 owner written/source acceptance; the Movement History description uses its verified height of 4,583 pixels. Current 7.1/7.2 acceptance is recorded above preserved dated checkpoint statements.

No application behaviour, design, configuration, schema or tracked test changes. No unrelated testing, full CI run/monitoring or deferred acceptance work. PR #472 remains open, draft and unmerged, targeting `milestone-1`; issue #366 remains open. The pushed checkpoint is remotely checked at delivery; no PR promotion, merge, release or publication is authorised.
