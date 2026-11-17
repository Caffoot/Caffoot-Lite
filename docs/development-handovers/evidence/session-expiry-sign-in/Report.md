# Issue #400 — Session-ended sign-in correction

**Status:** Implementation checkpoint for review, **not** owner visual acceptance, production deployment or a released v2.2 feature.

## Approved outcome

Return invalid or expired browser sessions to the **existing Caffoot Lite sign-in screen** with clear feedback. Preserve the approved sign-in layout, light/dark theme, responsive dimensions, MFA and recovery flows. Do not present a replacement error page or promise to restore unsaved work.

Source: [Issue #400](https://github.com/Caffoot/Caffoot-Lite/issues/400) (approved 17 November 2026).

## Implemented scope for this PR

- Protected HTML GETs for `/inventory`, `/account` and `/inventory?rack-print=same-tab` return an uncached `303` to `/setup` with a fixed sign-in fragment when the request has no valid session. An invalid/expired session cookie selects the session-ended message; a missing cookie selects the sign-in-required message. Known permitted pages and their existing section-specific 403 rules remain unchanged.
- On the already-open workspace, the shared loader handles failed same-origin API/interface requests. It checks `/api/session` before treating ambiguous 401/403 results as session expiry. A genuine current-session 403 remains an error; unverified network failures and other statuses do not redirect. It avoids repeated redirects and preserves JSON responses to API clients.
- The unchanged sign-in form uses its existing feedback component to display **Your Session Has Ended** and **Your session has ended. Please sign in again to continue using Caffoot Lite.** First-run setup, MFA, recovery, theme selection and password-change/logout destinations retain their existing paths.
- No session-duration, cookie, MFA, authorisation, data model, permission, inventory, UI redesign or deployment changes.

## Regression checks and owner evidence

- `tests/test_session_http.py`: protected page and print-route 303 targets; permitted pages; expired cookies; unchanged JSON API 401; real unknown routes 404; existing no-inventory-rights 403.
- `tests/session-expiry-interface.cjs`: real HTTPS/SQLite/Chromium browser navigation from protected URLs, retained JSON API semantics, ordinary 403 with a live session, expiry while viewing the workspace, expired write operation, subsequent MFA sign-in, unchanged password, and evidence in **desktop/mobile light/dark** modes.
- The existing `browser-compat` GitHub Actions workflow runs the new browser regression and retains screenshots as an artefact named `session-expiry-sign-in-<commit SHA>`. The four files inside are named `session-ended-desktop-light.png`, `session-ended-desktop-dark.png`, `session-ended-mobile-light.png` and `session-ended-mobile-dark.png`.
- **Actual test outcomes are not asserted in this checkpoint.** Record the successful workflow/commit only after it finishes. Screenshot review and owner visual approval remain pending; native Safari/private installation, complete manual Back-button behaviour and publication acceptance remain separate gates.

## Delivery restrictions

PR targets only `milestone-1`. Independent review and final-head GitHub Actions checks precede owner-approved merge. No changes to `main`, v2.1, releases, advisories or Stage 4.
