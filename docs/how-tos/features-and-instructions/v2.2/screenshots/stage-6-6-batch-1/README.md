# Stage 6.6 Batch 1 application screenshots

Captured on 25 November 2026 from application source `20cb447458065196a01fbca871d79c2c9f771af2`, schema 30, in Chromium 156.0.8078.79 on Debian x86-64. Playwright used the running Caffoot Lite application over HTTPS with a local self-signed certificate and disposable SQLite data. Account names, addresses and equipment are fictional. The preview archive was used for visual and interaction comparison.

| Application state | Desktop light 1440 × 960 | Desktop dark 1440 × 960 | Mobile light 390 × 844 | Mobile dark 390 × 844 |
| --- | --- | --- | --- | --- |
| Design 01 · Username and password | [PNG](sign-in-light-1440.png) | [PNG](sign-in-dark-1440.png) | [PNG](sign-in-light-390.png) | [PNG](sign-in-dark-390.png) |
| Design 01 · Authenticator challenge | [PNG](authenticator-light-1440.png) | [PNG](authenticator-dark-1440.png) | [PNG](authenticator-light-390.png) | [PNG](authenticator-dark-390.png) |
| Design 02 · Reset Password dialogue | [PNG](reset-password-light-1440.png) | [PNG](reset-password-dark-1440.png) | [PNG](reset-password-light-390.png) | [PNG](reset-password-dark-390.png) |
| Design 03 · Change Your Password | [PNG](change-temporary-password-light-1440.png) | [PNG](change-temporary-password-dark-1440.png) | [PNG](change-temporary-password-light-390.png) | [PNG](change-temporary-password-dark-390.png) |
| Design 04 · Unverified candidate | [PNG](administrator-eligibility-light-1440.png) | [PNG](administrator-eligibility-dark-1440.png) | [PNG](administrator-eligibility-light-390.png) | [PNG](administrator-eligibility-dark-390.png) |
| Design 04 · My Account warning | [PNG](my-account-administrator-warning-light-1440.png) | [PNG](my-account-administrator-warning-dark-1440.png) | [PNG](my-account-administrator-warning-light-390.png) | [PNG](my-account-administrator-warning-dark-390.png) |
| Staff · Username validation | [PNG](duplicate-username-light-1440.png) | [PNG](duplicate-username-dark-1440.png) | [PNG](duplicate-username-light-390.png) | [PNG](duplicate-username-dark-390.png) |

## Additional workflow views

- [Reset Password under Account controls](reset-control-light-1440.png)
- [Assisted reset confirmation](reset-success-light-1440.png)
- [Fresh sign-in after changing a temporary password](temporary-password-changed-dark-390.png)
- [Eligible account with Make admin enabled](administrator-eligible-light-1440.png)
- [Existing administrator warning in Manage Permissions](existing-administrator-warning-dark-390.png)
- [Device reassignment to a different Staff Member](direct-handover-devices-only-desktop-light.png)

The Device image uses the existing handover regression’s 1440 × 1050 desktop viewport. Captures came from the repository’s sign-in, account security, Staff directory and Device handover browser scripts. The eligible administrator fixture uses a seeded verified email state. The HTTP tests separately complete a real email-code confirmation and verify the promotion transaction.

[Frozen owner-approved designs](https://github.com/Caffoot/Caffoot-Lite/blob/bd77cd64636a25b25670d3f7b75a4c95efdb376a/future-design/stage-6-6-previews/README.md) · [Test results and handover](../../../../../development-handovers/evidence/stage-6-6-batch-1/README.md)
