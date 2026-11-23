# Email Templates And Company Branding Application Evidence

Captured on 23 November 2026 from the integrated draft v2.2 application at [`4a684152cb4a178309728ef29efcc18a5fdeac59`](https://github.com/Caffoot/Caffoot-Lite/commit/4a684152cb4a178309728ef29efcc18a5fdeac59). The starting integration commit was [`7b651af631b18e68da4160d1e29ef1a957c8f7cc`](https://github.com/Caffoot/Caffoot-Lite/commit/7b651af631b18e68da4160d1e29ef1a957c8f7cc). Playwright 1.56.1 drove headless Chromium 155.0.8059.79 over local HTTPS against a disposable SQLite schema 28 installation. Desktop and mobile used 1440 × 960 and 390 × 844 CSS-pixel viewports. The PNGs show the full page at each width, including content reached by scrolling. Accounts, ticket examples, company details and the Maplebrook logo are fictional. [Browser test and fixture](../../../../tests/email-templates-interface.cjs)

## Integrated Screenshots

| Screen | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| Email Templates | [Ticket Closed](templates-desktop-light.png) | [Ticket Closed](templates-desktop-dark.png) | [Ticket Closed](templates-mobile-light.png) | [Ticket Closed](templates-mobile-dark.png) |
| Company Branding | [Company name heading](branding-desktop-light.png) | [Saved logo](branding-desktop-dark.png) | [Saved logo](branding-mobile-light.png) | [Saved logo](branding-mobile-dark.png) |

- [Ticket On Hold variables](on-hold-variables-desktop-light.png) show seven approved options and the reason and explanation in the fictional preview.
- [Saved draft](saved-draft-desktop-light.png) shows an enabled Publish button, the updated subject and a sample link presented without navigation.
- [Email Verification](account-verification-desktop-light.png) and [Password Recovery](account-recovery-desktop-light.png) show the locked sample eight-digit code and expiry.
- [Account Security Notice](account-security-desktop-light.png) shows the generic warning and Company Name as its sole variable.
- [Uploaded fictional logo](branding-logo-desktop-light.png) shows the saved 360 × 144 PNG displayed at 180 × 72.

## Comparison With Frozen Design 04

Design 04 was reviewed at reference commit [`2dbfbd8aebdcd7237845c7ea559f52548e5600de`](https://github.com/Caffoot/Caffoot-Lite/tree/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews). The approved HTML blob was verified as `204f9e58e39a75c2c900c3568165fe84552a0328`. The frozen screenshots are design references. The screenshots in this directory come from the running application. [Frozen HTML](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/04-email-templates-branding.html) · [Design notes and screenshot index](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/README-04.md)

| Compared | Finding |
| --- | --- |
| [Desktop editor](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/04-templates-desktop-light.png) and [mobile dark editor](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/04-templates-mobile-dark.png) | The template list, editor, available variables and preview follow the approved desktop and stacked mobile layouts. Mobile displays the placeholder chooser below the five formatting buttons. The integrated page uses the existing Settings & Data navigation, theme, account menu and official Caffoot mark. |
| [Saved draft](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/04-saved-draft-desktop-light.png) and [illustrative account screen](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/04-account-reset-desktop-light.png) | The status, draft controls and context-sensitive variable list appear in the approved positions. Issue #424 specifies the real account templates and the required eight-digit code flow. The integrated account captures show those approved production states. |
| [Desktop branding](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/04-branding-desktop-light.png), [mobile dark branding](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/04-branding-mobile-dark.png) and [logo](https://github.com/Caffoot/Caffoot-Lite/blob/2dbfbd8aebdcd7237845c7ea559f52548e5600de/future-design/stage-5-previews/04-branding-logo-desktop-light.png) | The organisation form and shared preview sit side by side on desktop and stack on mobile. The preview shows the selected name or logo, primary and accent colours, and shared footer. The screenshots use the existing application chrome and show real saved branding. |

## Focused Checks

- 31 Python email tests passed, including a real loopback SMTP receiver. The receiver accepted fictional template tests and the existing verification, recovery and security notice flows. Tests inspected HTML and plain text, sender and recipient, inline logo and scaling, approved variable lists, stale saves, audit visibility, malformed input and proof consumption with MFA. [HTTP and SMTP tests](../../../../tests/test_email_templates_http.py)
- Five existing SMTP settings tests, four role-notice tests and seven Service Desk schema tests passed. Docker Compose configuration validation passed with a local test origin. Final-head Docker lifecycle testing remains with CI.
- The Chromium check exercised the live editor, its five formatting buttons, link validation, Insert and Copy, draft persistence, explicit Publish, Restore Default, account previews, branding, logo upload and removal, and administrator, technician and employee access. It checked the desktop and mobile captures for horizontal overflow and reported no page errors. [Chromium check](../../../../tests/email-templates-interface.cjs)

Independent screenshot approval, final-head backend, Docker Compose, Chromium, Firefox and WebKit CI review, and separate product-owner merge authorisation are pending. Native Safari, Raspberry Pi, full upgrade, backup/restore and release acceptance remain deferred. [Approved scope](https://github.com/Caffoot/Caffoot-Lite/issues/424)
