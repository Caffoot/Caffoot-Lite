# Tailwind CSS v4 evaluation — v1.1.2 draft integration

**Status:** Migration implemented and owner-tested on the isolated experimental branch. Draft PR #41 targets `feature/v1.1.2-security-hardening`. Not merged, tagged, or published. Owner approval is required before merging.

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
- `npm.cmd run release`: all 21 checks, HTML build and ZIP verification passed after clean installation.
- After updating the v4 licence filename and notices, the owner reran `npm.cmd run release` and all checks and packaging passed again.
- Manual browser checks: test inventory import, screens, light/dark themes, modals, Escape key, wireless access point and desktop configuration. No regressions reported.

## Remaining review before merge or publication

- Inspect browser network traffic (including offline `file://` operation) and remaining dynamic HTML sinks separately; static regression checks do not replace runtime inspection.
- Review repository history and source/artifact contents for sensitive information; the release privacy gate only checks certain paths and fictional fixtures.
- Review generated CSS and supported-browser compatibility for dynamic classes and responsive layouts.
- Recheck release notes, guides, embedded help, and final ZIP/HTML after integration.
- Obtain explicit owner approval before merging PR #41 or publishing v1.1.2.

## Guardrails

Do not run `npm audit fix --force` on the release candidate. Do not merge, tag, or publish without owner approval. The dependency audit reports known advisory findings in the tested dependency tree; it is not a comprehensive security audit.
