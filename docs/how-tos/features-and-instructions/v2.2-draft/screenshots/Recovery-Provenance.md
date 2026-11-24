# Password recovery screenshot provenance

Captured on 24 November 2026 from the unreleased v2.2 application at revision `3036d6a45b13709cf35b165099695d7acbd4b505`, based on `milestone-1` revision `7771320014e6736212b224e3ef47cf047436dd33`. The application was served at `https://127.0.0.1:8443/setup` using the Caffoot Lite HTTPS server, a generated local certificate and a disposable SQLite database. The browser accepted the local certificate. Outgoing mail was captured by a local test sink for a fictional verified account.

| Capture | Browser viewport | SHA-256 |
| --- | --- | --- |
| [Request, desktop](recovery-request-desktop.png) | 1440 × 950 | `9ef66714b9ea01ba845be9af03039d939b828a0339047ffd5e52cc2ea7c47f4f` |
| [Request, mobile](recovery-request-mobile.png) | 390 × 844 | `6e90f2a95f97714e3315ac5021a05344d8627b1a05643b706de02dfebb08ecbf` |
| [Reset, desktop](recovery-reset-desktop.png) | 1440 × 950 | `198d9d9201fb8efdfe038e1a80cdee2634bb6ed5e39e44e96d95879b9f4b171f` |
| [Reset, mobile](recovery-reset-mobile.png) | 390 × 844 | `1ffda6f74f5359df8c2e4812dda0f382f0619187856782312ea5257fe3d34d96` |

All four PNGs are unedited, full-page Chromium 155.0.8059.79 captures from Linux via Playwright, with the light theme. The request images show the view immediately after opening **Forgot Password?**, before entering a username. The reset images show the view after the neutral response and before entering any recovery credentials. The browser test also checks both viewports in dark mode, keyboard focus, field placement and return to sign-in. Native mobile browsers, individual password-manager autofill and independent owner visual acceptance remain pending.

To reproduce from the repository root, run `CAFFOOT_RECOVERY_OUTPUT=/path/to/existing/output node tests/recovery-confirmation.cjs` with Playwright Chromium available. For system Chromium, set `CAFFOOT_CHROMIUM_PATH` to its executable.
