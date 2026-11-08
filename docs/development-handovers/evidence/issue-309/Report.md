# Interface Consistency — Issue #309

The complete [approved proposal](https://github.com/Caffoot/Caffoot-Lite/issues/309#issuecomment-6679599919) is implemented. The main tabs now lead into a consistent 16px gap, Audit navigation precedes the shared totals, and all 26 specified controls use the existing tab icons. A focused label is revealed by scrolling its own navigation row horizontally.

This is a private acceptance result, not a release or the owner's final appearance approval. The delivery SHA is recorded in Issue #309. Application files are identical to implementation checkpoint **`81bc38a2ca381ca8143cb6c61a165b580755a8b7`**; later commits contain test corrections, evidence and documentation only.

## What Changed

- One shared 16px value controls the entrance to each main content area. Duplicate IPAM/Rack padding, Device Inventory's extra toolbar margin and Device Overview's extra heading margin are removed in integration styles. Existing headings, secondary tabs and cards retain their structure. Rack Overview keeps its agreed internal 17/14px heading gap, 55px secondary strip and 19px gap before metrics.
- Audit order is now heading → history notice → tabs → four shared totals → selected pane. The totals are present once and remain visible on every Audit tab, with a 16px entrance and the existing 20px separation before pane content. Filters, tables, record history, detail dialog, export and both notices remain.
- The 26 icon mappings match the issue's approved table. Existing symbols are 18×18px with inherited colour, a 1.8 stroke and an 8px text gap. They are decorative and cannot become extra keyboard stops. Existing button labels, actions, roles and selection attributes remain.
- The existing horizontal reveal calculation is shared by selected-tab handling and a scoped focus listener. Focus does not change tab selection or call document scrolling. Manual horizontal scrolling and existing keyboard behaviour remain.

The pinned HTML/CSS sources, manifest, backend, database schema, security rules, entry documents and Docker configuration are unchanged. The Function Index updates cover only the two new helpers and moved line positions. Work in #308, #310 and #304 has not been included.

## Checks

| Check | Verified result |
| --- | --- |
| Initial rendered implementation matrix | 240 cases passed across 2560×1440, 1440×950, 1024×768 and 390×844, light/dark |
| Final focused layout matrix | 288 passed: 16px entrance, exact icon mapping, Audit hierarchy/totals, retained Rack internal spacing and no document-level overflow |
| Keyboard activation and focus | 208 Enter/Space cases passed at 1440/390px in both themes; every focused label fully visible and document scroll unchanged |
| Other keyboard and export checks | Tab/Shift+Tab and export equality with the current permission-filtered Audit records passed |
| Enlarged tab labels | 36 states passed at 18px, at 1024/390px in both themes; selection unchanged, complete labels and no page overflow |
| Empty inventory | 20 states passed across Dashboard, Devices, IPAM, Racks and Audit at 1440/390px in both themes |
| Data and script errors | Both focused runs preserved the isolated inventory snapshot; no browser script errors |
| Source checks | JavaScript syntax, approved HTML contract, both pinned-stylesheet/template tests, all 607 Function Index locations and diff whitespace checks passed |
| Existing focused history/security checks | 10 tests passed |
| Full backend suite | 423 run: 420 passed, three skipped |
| Existing full Chromium regression | Passed, including real saved Audit events/filters/details, catalogue/device/IPAM/rack workflows, saving/reload, shared inventory and read-only restrictions |
| Docker build/restart/recreation | Passed on the identical application checkpoint; data and TLS persistence checked |

[Measured results and application hashes](checks.json) and [capture hashes](images-sha256.json) preserve the bounded evidence. The test fixture is fictional and isolated from owner data. The focused exporter comparison uses that fixture's history; the existing full browser suite separately exercises populated history and real writes.

GitHub evidence on the application/test checkpoints:

- [Full Chromium regression](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42183228957)
- [Backend suite](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42183229160)
- [Docker lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42182824430)
- [History secret scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42183229053)

The delivery commit's latest GitHub results are recorded in Issue #309. The final browser assertions also check the newly visible mobile focus target during the ordinary regression run.

### Early Test Corrections

The first browser assertion measured the existing 3px entrance animation before it finished, giving 19px instead of the settled 16px. The assertion now waits for the animation. The first focused icon-size assertion also included unchanged historical icons; it now checks 18px only for the 26 newly specified controls. Their affected reruns passed. The focused page is brought to the foreground to avoid background-tab animation-frame throttling. None of these test corrections changed the application.

## Rendered Review

Audit/IPAM captures show the agreed order, consistent entrance, existing colours and complete labels in horizontally scrollable mobile rows. No unresolved mismatch against these approved changes was found in the measured states. Captures use the existing runner's system-font fallback; they do not establish a universal pixel match or owner Safari acceptance.

| Screen | Desktop Light | Desktop Dark | Mobile Light | Mobile Dark |
| --- | --- | --- | --- | --- |
| Audit Trail | [View](images/audit-light-1440.png) | [View](images/audit-dark-1440.png) | [View](images/audit-light-390.png) | [View](images/audit-dark-390.png) |
| IPAM | [View](images/ipam-light-1440.png) | [View](images/ipam-dark-1440.png) | [View](images/ipam-light-390.png) | [View](images/ipam-dark-390.png) |

The complete layout/icon/keyboard matrix is reproducible with:

```sh
CAFFOOT_INTERFACE_CONSISTENCY=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/issue-309 node tests/approved-visual.cjs
CAFFOOT_INTERFACE_CONSISTENCY=1 CAFFOOT_INTERFACE_CONSISTENCY_EXTRAS=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/issue-309 node tests/approved-visual.cjs
```

Use the existing workflow's Playwright setup. If needed, `CAFFOOT_CHROMIUM_PATH` selects an already-installed browser. No application dependency was added.

## Private Docker Acceptance

1. Use a clean checkout of `feat/approved-modular-html-282` at the exact delivery SHA recorded in Issue #309. Confirm `git status --short` is empty and `git rev-parse HEAD` matches that SHA. Keep the existing private test stack's project name, environment and `/data` mapping. Back up that private test data using the normal backup process and retain the previous local image for rollback.
2. Build locally with the existing helper:

   ```sh
   python3 scripts/build_private_acceptance.py --save ../caffoot-lite-private-acceptance.tar
   ```

   The helper uses the exact clean Git revision, verifies the image revision label and prints `caffoot-lite:private-<first 12 SHA characters>`. It does not publish an image. Use the existing `--build-ca` option only if your build proxy requires it.
3. On another private Docker host, transfer the archive privately and load it:

   ```sh
   docker load --input caffoot-lite-private-acceptance.tar
   ```

4. Update only the existing private test stack to the printed local image tag. For Compose, a local `acceptance-image.yaml` override can contain:

   ```yaml
   services:
     caffoot-lite:
       image: caffoot-lite:private-<first 12 SHA characters>
   ```

   From that stack's existing directory, preserving its current project/environment and volume mapping:

   ```sh
   docker compose -p YOUR_EXISTING_PRIVATE_TEST_PROJECT -f compose.yaml -f acceptance-image.yaml up -d --no-build --no-deps caffoot-lite
   ```

   Replace the placeholders with the actual existing project and printed image tag. In Portainer, change only the private stack's image, retaining its volume/environment settings. Use the local image rather than pulling a registry tag. Do not run `down -v`.
5. Confirm health and sign in with the existing private account/MFA. Review main entrance spacing, all tab icons and the three Audit panes on the large monitor, smaller laptop and mobile layout, in both themes. Use keyboard navigation to reveal the complete offscreen labels. Check selected Rack subtabs, ordinary filtering/saving and existing inventory after reload.

## Remaining Limits

Owner Safari, actual Inter-font rendering, physical devices and the owner's private Docker installation still need appearance acceptance. The three backend skips comprise two unavailable private genuine-export fixtures and the opt-in local Docker test; Docker lifecycle was exercised separately in GitHub. No owner image was built or published here. Existing print-trial acceptance and deferred Rack work retain their separate status. Nothing was merged or released.
