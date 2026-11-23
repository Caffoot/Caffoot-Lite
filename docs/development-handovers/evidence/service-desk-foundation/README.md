# Service Desk Foundation Evidence

The screenshots were captured on 23 November 2026 in Chromium 155.0.8059.79, using the integrated HTTPS application and a disposable SQLite database seeded with fictional users and equipment. The browser used 1440 × 950 and 390 × 844 viewports. Full-page captures can extend below the viewport. The visible application code is from [the inventory and Clean Start checkpoint](https://github.com/Caffoot/Caffoot-Lite/commit/3201680eb0078ffb440e910e1840b4a30b4c253f), with the evidence checks in [the Users role fixture](../../../../tests/builtin-roles-interface.cjs). [Browser results](browser-results.json) · [Capture hashes](screenshot-sha256.txt)

| Existing interface | Desktop Light | Mobile Light | Desktop Dark | Mobile Dark |
| --- | --- | --- | --- | --- |
| Staff Permissions showing the Service Desk row | [Desktop Light](it-staff-dave-1440.png) | [Mobile Light](it-staff-dave-390.png) | [Desktop Dark](it-staff-dave-dark-1440.png) | [Mobile Dark](it-staff-dave-dark-390.png) |
| System Maintenance showing the Clear System warning | [Desktop Light](clean-start-1440.png) | [Mobile Light](clean-start-390.png) | [Desktop Dark](clean-start-dark-1440.png) | [Mobile Dark](clean-start-dark-390.png) |

The browser test reads the native confirmation text and cancels the reset. Live HTTP tests use disposable databases to verify successful cleanup, a failed reset rollback and protection against unauthorised resets. The ticket screens have their own implementation and screenshot gates in later batches. Independent visual review and Ready For Review CI are pending. [Batch 5.1 PR](https://github.com/Caffoot/Caffoot-Lite/pull/437)
