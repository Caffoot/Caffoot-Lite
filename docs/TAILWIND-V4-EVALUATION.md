# Tailwind CSS v4 evaluation — v1.1.2 draft integration

**Status:** Migration integrated into `feature/v1.1.2-security-hardening` via squash-merged PR #43, replacing closed, unmerged PR #41. Not merged into `main`, tagged, or published. Owner approval remains required for release.

## Baseline and migration

- Original build: Tailwind CSS 3.4.17 with the bundled v3 CLI and a JavaScript configuration/safelist.
- Original owner-reported audit: **7 vulnerabilities (5 high, 2 moderate)** in the build dependency tree.
- Experimental build: **Tailwind CSS 4.3.3**, **@tailwindcss/cli 4.3.0**, and transitive **@parcel/watcher 2.6.0**.
- `app/build-offline.cjs` uses the locally installed v4 CSS entry point, explicit HTML source scanning, `@source inline` for dynamic classes, a class-based dark variant, and the existing brand palette.
- `app/tailwind.config.cjs` is a legacy v3 reference; the v4 build does not load it.
- The standalone HTML continues to embed compiled CSS, Font Awesome fonts, branding assets, and the complete licence notices. The ZIP includes the v4.3.3 licence copy.

## Owner verification

- Windows clean install: `npm.cmd ci --no-audit --no-fund` passed.
- `npm.cmd audit --audit-level=moderate`: **0 reported vulnerabilities** at test time.
- `npm.cmd run release`: the experimental build passed its earlier 21-step pipeline. The owner subsequently downloaded the full combined integration branch, ran a clean `npm.cmd ci --no-audit --no-fund`, and passed all 27 release pipeline steps, including both new XSS regressions, HTML build and ZIP verification.
- After updating the v4 licence filename and notices, the owner reran `npm.cmd run release` and all checks and packaging passed again.
- Manual browser checks: test inventory import, screens, light/dark themes, modals, Escape key, wireless access point and desktop configuration. No regressions reported.

## Remaining review before release publication

- The owner previously confirmed offline operation and clean browser Network activity during normal use. Remaining dynamic HTML sinks and broader runtime behaviour have not undergone a comprehensive security audit.
- Review repository history and source/artifact contents for sensitive information; the release privacy gate only checks certain paths and fictional fixtures.
- Owner-reported browser smoke tests passed for the combined build; broader supported-browser compatibility and exhaustive dynamic CSS review remain outstanding.
- Recheck release notes, guides, embedded help, and final ZIP/HTML after integration.
- Obtain explicit owner approval before merging the final release PR into `main`, tagging or publishing v1.1.2.

## Guardrails

Do not run `npm audit fix --force` on the release candidate. Do not merge into `main`, tag, or publish without owner approval. The dependency audit reports known advisory findings in the tested dependency tree; it is not a comprehensive security audit.
