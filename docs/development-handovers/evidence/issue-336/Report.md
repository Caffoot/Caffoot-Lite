# PR #336 — Approved Branch Reconciliation

Authority: [owner approval 6728273041](https://github.com/Caffoot/Caffoot-Lite/pull/336#issuecomment-6728273041). This documentation reconciliation prepares the draft for product-owner review. It does not authorise merging, publication, website work or installation changes.

## Verified History and Scope

- Development branch: `feat/approved-modular-html-282`, starting at `d49f148f954561d64772f4ae8f0dd79e26db7e60`.
- Incoming `main`: `ed44ae445e51aaa3768113ed27efdead8f9521bd`.
- Common ancestor: `3651599609df346a437a4acc73c54da56f0597f2`; before reconciliation, development was 339 commits ahead and eight behind.
- Both live refs were checked before the merge and again before committing. Reconciliation uses a normal two-parent merge on the development branch, without rebasing, replaying commits or force pushing. Exact delivery SHA and final GitHub checks are recorded in the PR receipt.

The eight incoming commits are `010acde`, `3882c8b`, `98950ae`, `cd360be`, `fd099a6`, `2d92944`, `653d179` and `ed44ae4`. They contain documentation, roadmap, product-direction and community decisions. None changes application behaviour.

## Actual Conflicts and Resolutions

Four files had literal merge conflicts; the other two approved overlap candidates merged automatically and were reviewed deliberately.

| File | Merge result and preserved meaning |
| --- | --- |
| `README.md` | Conflict resolved by combining the newer tagline, audience, navigation, earlier dashboard image, roadmap and future-request guidance with the prepared v2.1 features, status, installation and upgrade warnings. The earlier image is labelled accurately. v2.1 remains unpublished; latest published release remains v2.0.3. |
| `INSTALLATION.md` | Automatic merge reviewed. Retained newer main's readable historical Docker/Pi and off-host backup caveats. Corrected the prospective installation heading and root stack link to v2.1, requiring actual release/public AMD64 and ARM64 image verification. Retained a separate historical v2.0.3 stack link, in-place upgrade, complete `/data`, environment, private-secret, backup and rollback protections. |
| `03-Frontend-and-Backend.md` | Conflict resolved using the approved modular shell and runtime HTML/JavaScript Tailwind inputs, with checks against relevant pinned designs and explicit amendments. Retained the static stylesheet/no-runtime-build guidance. |
| `07-Function-and-Code-Reference.md` | Conflict resolved by identifying the Function Index as the prepared modular v2.1 reference while retaining published v1.3.3 evidence and historical source links. |
| `08-Testing-and-Maintenance.md` | Conflict resolved by retaining main's separate-branch/current-release warning alongside the archived v2.1 handover, modular guide, later release-preparation records and owner release checklist. Completed v2.0.3 work remains historical. |
| Development Guide `README.md` | Automatic merge reviewed. Retained main's future-request guidance and current modular paths; corrected the root README description to distinguish prepared v2.1 from published v2.0.3. |

[Preservation checks](preservation.json) confirm ten files match incoming main byte for byte: `AGENTS.md`, the roadmap, all three product-direction records, contribution guidance, community guidance, the feature-request template, coding conventions and the handover index. No roadmap or milestone decision was rewritten.

There are no reconciliation changes to backend, interface, tests, scripts, assets, pinned HTML, inventory/setup shells, Dockerfile, Compose, the prepared Portainer stack or workflows. There were no runtime, database/security, API, test-contract or pinned-design conflicts. The additional evidence files only describe this reconciliation.

## Checks Actually Run

- Existing `scripts/verify_release.py --version v2.1`: passed.
- Existing release-documentation workflow checks, executed locally: passed, including all eight byte-identical guide compatibility copies and historical Portainer/release-note conventions.
- `python3 -m unittest tests.test_release_preflight tests.test_modular_interface -v`: nine tests passed, including the twelve pinned HTML hashes, extracted approved styles and resolvable unique modular includes. An earlier invocation named a nonexistent test module; that invocation failed and was corrected, rather than counted as a pass.
- [Affected link check](links.json): 183 local Markdown targets checked; none broken. The README's in-place upgrade anchor resolves to the retained installation heading. Existing historical upgrade headings remain. External release status was checked through GitHub: the latest published release is v2.0.3; no v2.1 publication is claimed.
- Staged whitespace/conflict-marker check: passed; no unresolved merge entries.
- Gitleaks v8.24.3 full reachable history scan before the reconciliation commit: 1,878 commits scanned, no leaks. The final commit scan and GitHub results are recorded in the PR receipt.
- Live main rules were read without changing them. The required status context is `release-documentation`; branch deletion and non-fast-forward protection remain. [Rule snapshot](branch-rules.json). Final required-check status is recorded in the PR receipt.

No new application, browser, Docker, upgrade or native Safari exercise was run locally for this documentation-only reconciliation. Existing accepted application/upgrade evidence remains in [the #335 report](../issue-335/Report.md); workflows automatically triggered by the PR are reported separately with their actual results.

## Remaining Review Gates

PR #336 must remain draft for owner review. Separate explicit owner decisions are still required for merge, tag/release, public image publication and website work. Neither the Pi nor another installation is involved here. The two unavailable genuine private v1.3.3 automated fixtures and the scope limits of native/manual acceptance remain as recorded in #335; documentation reconciliation cannot close those gaps. No existing tracker is declared published or complete merely because the branches reconcile.
