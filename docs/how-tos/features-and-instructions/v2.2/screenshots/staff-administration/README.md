# Unified Staff Administration Application Captures

These screenshots show draft v2.2 at revision `1c88a8d2cdf9428fcfd8b3cf936eae0ef89191d9` with schema 29. The browser was Chromium 156 on 24 November 2026, using the disposable HTTPS and SQLite fixture in [the Staff browser test](../../../../../../tests/staff-directory-interface.cjs). All people, sign-in usernames and email addresses are fictional.

The desktop viewport was 1440 × 950 and the mobile viewport was 390 × 844. Staff list, details and edit captures include the full page. Manage Permissions captures show the viewport with the existing scrollable dialogue open. The captured profile differences were deliberately seeded in the test database before opening Edit Staff Member.

| Application view | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| Staff Members | [View](unified-staff-light-1440.png) | [View](unified-staff-dark-1440.png) | [View](unified-staff-light-390.png) | [View](unified-staff-dark-390.png) |
| Manage Permissions | [View](manage-permissions-light-1440.png) | [View](manage-permissions-dark-1440.png) | [View](manage-permissions-light-390.png) | [View](manage-permissions-dark-390.png) |
| Staff Details | [View](staff-details-light-1440.png) | — | — | — |
| Edit Staff Member with saved differences | [View](resolve-profile-light-1440.png) | — | — | [View](resolve-profile-dark-390.png) |

The captures accompany development review in PR #453. Owner visual acceptance and approval to use the captures in published documentation are pending. Stage 6.6 native acceptance remains paused. [PR #453](https://github.com/Caffoot/Caffoot-Lite/pull/453) · [Approved design and integration constraints](https://github.com/Caffoot/Caffoot-Lite/issues/452#issuecomment-7136518066)
