# Tailwind CSS v4 evaluation (isolated experiment)

This branch is an investigation only. It must not be merged into the v1.1.2 security-hardening branch until the owner explicitly approves a tested migration.

## Baseline

- Production application: standalone offline HTML, with CSS and Font Awesome fonts embedded at build time.
- Current build: Tailwind CSS 3.4.17, direct invocation of `tailwindcss/lib/cli.js`.
- User's `npm audit --audit-level=moderate` baseline: **7 vulnerabilities (5 high, 2 moderate)** in the build dependency tree.
- Existing configuration: `darkMode: 'class'`, custom `brand` colour palette, regular class scanning of `app/caffoot-lite.html`, regex-based safelist with colour, dark, hover and responsive variants.

## Migration issues to validate

1. Tailwind v4 uses a separate CLI package (`@tailwindcss/cli`) and CSS-first `@import "tailwindcss"` input. Adapt `app/build-offline.cjs` without changing the released HTML's offline model.
2. Preserve `.dark`-controlled dark mode, the custom brand colours and all dynamically constructed classes. Tailwind v4 does not support the existing JavaScript `safelist` configuration; enumerate needed classes using explicit `@source inline(...)` rules or another validated strategy.
3. Verify Tailwind v4 browser compatibility and generated CSS against supported browsers, including dark mode, responsive layouts, modal dialogs, racks, devices and IPAM.
4. Retain the existing font and branding embedding, third-party notices, ZIP allowlist, hashes, and backup import/export compatibility.
5. Run `npm audit --audit-level=moderate`, `npm run release`, visual comparison, offline browser tests and security regression tests. Capture results; do not claim vulnerabilities are resolved before audit confirms it.

## Guardrails

Do not run `npm audit fix --force` on the release candidate. Do not change the release branch, create a release tag, merge, or publish without owner approval. This document records the plan; no v4 dependency migration has yet been made.
