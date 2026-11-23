# Password recovery screenshot provenance

Captured on 23 November 2026 from the unreleased v2.2 application at revision `fd45430ec6672b7f0ff50bdf03f89a70f104a75c`, based on `milestone-1` revision `7771320014e6736212b224e3ef47cf047436dd33`. The application was served at `https://127.0.0.1:8443/setup` using the Caffoot Lite HTTPS server, a generated local certificate and a disposable SQLite database. The test browser accepted the local certificate. The only simulated integration was outgoing mail, captured by a local test sink for a fictional verified account.

| Capture | Browser viewport | SHA-256 |
| --- | --- | --- |
| [Desktop](recover-password-desktop.png) | 1440 × 950 | `17c231ff1b385d405c1048ebcc2314f0ab53fe58f4bd4671730518f2d8902c4f` |
| [Mobile-sized](recover-password-mobile.png) | 390 × 844 | `b3fe81b23ab34ecbe6c6c4b41a15fca272388bbc72fa80a66a3f04b6e2ab5d6d` |

Both PNGs are unedited full-page captures from Chromium 155.0.8059.79 on Linux via Playwright. Each shows the form after a successful recovery-code request and before any recovery credentials were entered. The browser test verifies desktop field placement, mobile stacking, keyboard focus, mismatch feedback, live recovery with MFA and field cleanup. It verifies the autocomplete attributes. Native mobile browsers, individual password-manager autofill and owner visual acceptance remain pending.

To reproduce from the repository root, run `CAFFOOT_RECOVERY_OUTPUT=/path/to/existing/output node tests/recovery-confirmation.cjs` with Playwright Chromium available. For system Chromium, set `CAFFOOT_CHROMIUM_PATH` to its executable.
