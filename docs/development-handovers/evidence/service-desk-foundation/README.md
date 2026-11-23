# Service Desk Foundation Evidence

The screenshots were captured on 23 November 2026 in Chromium 155.0.8059.79 using the integrated HTTPS application and disposable SQLite data. The browser used 1440 × 950 and 390 × 844 viewports. Full-page captures can extend below the viewport.

The permissions captures are from the [original foundation checkpoint](https://github.com/Caffoot/Caffoot-Lite/commit/3201680eb0078ffb440e910e1840b4a30b4c253f). The four System Maintenance captures and the refreshed native confirmation checks are from the [operational reset correction](https://github.com/Caffoot/Caffoot-Lite/commit/b148067a18b9581488bf48abd41c225c9cbc33c8). [Foundation browser results](browser-results.json) · [Corrected reset browser results](clean-start-browser-results.json) · [Capture hashes](screenshot-sha256.txt)

| Existing interface | Desktop Light | Mobile Light | Desktop Dark | Mobile Dark |
| --- | --- | --- | --- | --- |
| Staff Permissions showing the Service Desk row | [Desktop Light](it-staff-dave-1440.png) | [Mobile Light](it-staff-dave-390.png) | [Desktop Dark](it-staff-dave-dark-1440.png) | [Mobile Dark](it-staff-dave-dark-390.png) |
| System Maintenance showing the Clear System warning | [Desktop Light](clean-start-1440.png) | [Mobile Light](clean-start-390.png) | [Desktop Dark](clean-start-dark-1440.png) | [Mobile Dark](clean-start-dark-390.png) |

The browser test reads the native confirmation text and cancels the reset. Live HTTP tests use disposable databases to verify successful cleanup of populated operational modules, a failed reset rollback and protection against unauthorised resets. The ticket screens have their own implementation and screenshot gates in later batches. The pull request records the final CI results and awaits independent owner review. [Batch 5.1 PR](https://github.com/Caffoot/Caffoot-Lite/pull/437)
