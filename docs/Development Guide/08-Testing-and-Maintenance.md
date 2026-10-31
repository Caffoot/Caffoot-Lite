# 08 — Testing and maintenance

## In simple terms

Before changing Caffoot Lite, identify the existing behaviour that must remain intact, then verify the affected path. Reuse existing tests and evidence. Green automation is useful, but **the product owner must still approve release**.

## Existing test evidence

| Source | Purpose |
| --- | --- |
| [`next/tests/`](../../next/tests/) | Python unit checks for schema, users, sessions, access, imports, device/IPAM/rack operations and validation |
| [`next/tests/browser-compat.cjs`](../../next/tests/browser-compat.cjs) | Chromium/Playwright checks of approved browser workflows |
| [`next/tests/test_compose_lifecycle.py`](../../next/tests/test_compose_lifecycle.py) | Optional Docker lifecycle test for port and persistent database/certificate |
| [`app/`](../../app/) | Original HTML application's code and tests |
| [`docs/required-only/`](../required-only/README.md) | Historical workflow, audit and test evidence — check later fixes before treating findings as open |

## GitHub Actions

- [Backend](../../.github/workflows/next-backend.yml) — syntax checking and Python unit tests.
- [Chromium](../../.github/workflows/next-browser-compat.yml) — focused browser compatibility milestone.
- [Compose lifecycle](../../.github/workflows/next-compose-lifecycle.yml) — manually requested Docker integration check.
- [Portainer image](../../.github/workflows/next-portainer-image.yml) — explicitly built **unreleased** test image for Pi/PC acceptance.

Workflows have path filters and are run at relevant milestones to conserve CI minutes. A documentation-only commit may not trigger a backend or browser run; don't claim it did.

## Maintenance procedure

1. Read the current [specification #215](https://github.com/Caffoot/Caffoot-Lite/issues/215) and, for release preparation, [tracker #218](https://github.com/Caffoot/Caffoot-Lite/issues/218).
2. Verify the live `Next` head, relevant CI and [published v1.3.3 baseline](https://github.com/Caffoot/Caffoot-Lite/tree/v1.3.3).
3. Find the existing owner in the [code reference](07-Function-and-Code-Reference.md). Reconcile older reports against subsequent fixes.
4. Change only the approved path in a coherent batch. Preserve established inventory functionality.
5. Run relevant existing tests, adding a focused test only for a changed path or genuine gap.
6. Update factual documentation and report only checks actually executed. Merging and publishing require separate approval.

## Existing commands

From repository root, backend unit test discovery:

```sh
cd next
python -m unittest discover -s tests -v
```

Local Markdown links from repository root:

```sh
node scripts/check-documentation-links.cjs
```

The link checker does not validate external sites or application behaviour. Chromium tests use the dependencies in their existing workflow; Compose lifecycle verification requires Docker and is opt-in.

## Remaining acceptance

As of 31 October 2026, the product owner has completed the agreed **Stage 2 Raspberry Pi 5 acceptance**: MFA guidance, independent two-user editing and on-demand shared view freshness, v1.3.3 inventory compatibility, container recreation and a one-off **same-device manual database copy/restore**. The latest focused backend, browser and Pi image builds passed, as recorded in [#218](https://github.com/Caffoot/Caffoot-Lite/issues/218). The local restore test is **not** evidence of off-host backup resilience, and Stage 3 documentation, later visual/security work and explicit release approval remain outstanding. Passing tests **alone do not approve release**.

[Start here](README.md) · [Inventory migration](05-Inventory-and-Migration.md)
