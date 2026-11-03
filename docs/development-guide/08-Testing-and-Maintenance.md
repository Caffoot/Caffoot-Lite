# 08 — Testing and maintenance

## In simple terms

Before changing Caffoot Lite, identify the existing behaviour that must remain intact, then verify the affected path. Reuse existing tests and evidence. Green automation is useful, but **the product owner must still approve release**. For the practical owner-facing decision points, see [Security Fixes and Releases](Security-Fixes-and-Releases.md).

## Existing test evidence

| Source | Purpose |
| --- | --- |
| [`tests/`](../../tests/) | Python unit checks for schema, users, sessions, access, imports, device/IPAM/rack operations and validation |
| [`tests/browser-compat.cjs`](../../tests/browser-compat.cjs) | Chromium/Playwright checks of approved browser workflows |
| [`tests/test_compose_lifecycle.py`](../../tests/test_compose_lifecycle.py) | Optional Docker lifecycle test for port and persistent database/certificate |
| [`app/` at the published v1.3.3 tag](https://github.com/Caffoot/Caffoot-Lite/tree/v1.3.3/app) | Original HTML application's historical source and tests, excluded from the current Docker source |
| [Published v1.3.3 source and tests](https://github.com/Caffoot/Caffoot-Lite/tree/v1.3.3/app) | Authoritative published inventory compatibility baseline; check later fixes before using older audit findings |

## Archived audit and migration evidence

The 25 earlier audit, workflow, test-matrix and draft migration documents are accessible in the [pre-cleanup Git snapshot](https://github.com/Caffoot/Caffoot-Lite/tree/049262f196be494074f698a72f377153f202171b/docs/required-only). They document historical observations and test provenance from v1.3.0 through v1.3.3, including subsequent fixes. Use published [v1.3.3 source/tests](https://github.com/Caffoot/Caffoot-Lite/tree/v1.3.3/app), current [Caffoot Lite tests](../../tests/) and actual [GitHub Actions results](https://github.com/Caffoot/Caffoot-Lite/actions) to decide whether an old finding still applies. Proposed tests in the archive are not automatically executed or requirements.

## GitHub Actions

- [Backend](../../.github/workflows/backend-tests.yml) — syntax checking and Python unit tests.
- [Chromium](../../.github/workflows/browser-compat.yml) — browser compatibility checks of real application workflows.
- [Compose lifecycle](../../.github/workflows/compose-lifecycle.yml) — opt-in Docker integration check.
- [Release documentation](../../.github/workflows/release-documentation.yml) — required `release-documentation` pull-request status check; its check identifier must remain stable.
- [Git history secret scan](../../.github/workflows/git-history-secrets.yml) — full-history secret scan on pull requests and main.
- [Publish Caffoot Lite](../../.github/workflows/publish-release.yml) — owner-started release workflow with read-only pull-request preflight and shared release checks; publication requires a separate explicit owner decision.
- [Release preflight verifier](../../scripts/verify_release.py) and [focused tests](../../tests/test_release_preflight.py) — verify that the version shown in About matches release notes, Portainer and current installation guidance, without publishing anything.

Workflows have path filters to conserve CI minutes. A documentation-only PR may not trigger backend or browser checks; don't claim it did. The manual publishing workflow calls the existing test workflows at the release gate, regardless of PR path filters, and publishes nothing unless each required job succeeds.

## Maintenance procedure

**Across chat sessions:** Check current GitHub state and approved issues before resuming work. The [active v2.1 handover](../development-handovers/v2.1.md) records the latest UI redesign position, alongside [issue #266](https://github.com/Caffoot/Caffoot-Lite/issues/266). The [v2.0.3 handover](../historical/development-handovers/v2.0.3.md) is completed history, not work to restart. At release, move the finished active handover to the historical folder. See the [release owner checklist](Security-Fixes-and-Releases.md).

1. Review the product-owner-approved scope, current decisions and the [contribution guide](../../CONTRIBUTING.md). [#215](https://github.com/Caffoot/Caffoot-Lite/issues/215) and [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218) are completed historical release records, not live development restrictions.
2. Verify the protected `main` branch, relevant CI and [published v1.3.3 compatibility baseline](https://github.com/Caffoot/Caffoot-Lite/tree/v1.3.3).
3. Find the existing owner in the [code reference](07-Function-and-Code-Reference.md). Reconcile older reports against subsequent fixes.
4. Change only the approved path in a coherent batch. Preserve established inventory functionality.
5. Run relevant existing tests, adding a focused test only for a changed path or genuine gap.
6. Update factual documentation and report only checks actually executed. Merging and publishing require separate approval.

## Existing commands

From the repository root, run the existing backend unit tests:

```sh
python -m unittest discover -s tests -v
```

Check changed Markdown links manually against the current repository tree. The historical `scripts/check-documentation-links.cjs` command is no longer present in this repository; do not use it. Chromium tests use the dependencies in their workflow, and Compose lifecycle verification requires Docker and is opt-in.

## Historical acceptance and release evidence

The original Raspberry Pi 5 acceptance and Docker/SQLite release stages, including manual same-device backup/restore testing, are recorded in [completed release tracker #218](https://github.com/Caffoot/Caffoot-Lite/issues/218). The manual restore did not prove off-host backup resilience. Subsequently, the v2.0.2 security correction and testing were tracked in [#255](https://github.com/Caffoot/Caffoot-Lite/issues/255) and its release preparation in [PR #256](https://github.com/Caffoot/Caffoot-Lite/pull/256). [Caffoot Lite v2.0.2](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v2.0.2) was published on 2 November 2026. These records are historical evidence, not instructions to repeat completed release work.

[Start here](README.md) · [Inventory migration](05-Inventory-and-Migration.md)
