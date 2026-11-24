# Stage 6.4 Shared Devices — Development Evidence

24 November 2026 · [Draft v2.2 review](https://github.com/Caffoot/Caffoot-Lite/pull/447) · [Owner-approved behaviour](https://github.com/Caffoot/Caffoot-Lite/issues/431#issuecomment-7128685595) · [Approved schema and stock recipient decision](https://github.com/Caffoot/Caffoot-Lite/issues/431#issuecomment-7129437209)

The review starts from `957969ba1b44465472765e47f91117ca7c87d177` on `milestone-1` (schema 28). The application source for the local schema 29 Docker rehearsal and these Chromium captures is [`57ca30e15f2d61d2bb4689c6ca1a3600973df3c7`](https://github.com/Caffoot/Caffoot-Lite/commit/57ca30e15f2d61d2bb4689c6ca1a3600973df3c7). Subsequent commits package tests, screenshots and draft documentation.

## Application Screenshots

The captures use the running Caffoot Lite application over loopback HTTPS in Chromium 156.0.8078.79. The test seeds fictional accounts, Departments, Devices and a printer ticket raised before Sales shares the Device. It uses the real UI for initial assignment, Department changes, Department Details, My Equipment, Department Tickets and Create Ticket. Desktop viewports are 1440 × 960 and mobile viewports are 390 × 844. Department Tickets uses full-page capture so the ticket list appears on mobile. [Capture manifest with source and image hashes](capture-manifest.json) · [Chromium test](../../../../tests/shared-devices-interface.cjs) · [Frozen design references](https://github.com/Caffoot/Caffoot-Lite/issues/431#issuecomment-7129171072)

| Existing application screen | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| Assign Device with searchable Department selection | [Light](screenshots/assign-device-desktop-light.png) | [Dark](screenshots/assign-device-desktop-dark.png) | [Light](screenshots/assign-device-mobile-light.png) | [Dark](screenshots/assign-device-mobile-dark.png) |
| Manage Departments and pending changes | [Light](screenshots/manage-departments-desktop-light.png) | [Dark](screenshots/manage-departments-desktop-dark.png) | [Light](screenshots/manage-departments-mobile-light.png) | [Dark](screenshots/manage-departments-mobile-dark.png) |
| Assigned To with one custody period and Department history | [Light](screenshots/current-assignment-desktop-light.png) | [Dark](screenshots/current-assignment-desktop-dark.png) | [Light](screenshots/current-assignment-mobile-light.png) | [Dark](screenshots/current-assignment-mobile-dark.png) |
| Sales Department Details → Equipment | [Light](screenshots/department-equipment-desktop-light.png) | [Dark](screenshots/department-equipment-desktop-dark.png) | [Light](screenshots/department-equipment-mobile-light.png) | [Dark](screenshots/department-equipment-mobile-dark.png) |
| Sales employee My Equipment | [Light](screenshots/my-equipment-desktop-light.png) | [Dark](screenshots/my-equipment-desktop-dark.png) | [Light](screenshots/my-equipment-mobile-light.png) | [Dark](screenshots/my-equipment-mobile-dark.png) |
| Department Tickets after Sales joins | [Light](screenshots/department-tickets-desktop-light.png) | [Dark](screenshots/department-tickets-desktop-dark.png) | [Light](screenshots/department-tickets-mobile-light.png) | [Dark](screenshots/department-tickets-mobile-dark.png) |
| Create Ticket warning via Report A Problem | [Light](screenshots/ticket-confidentiality-desktop-light.png) | [Dark](screenshots/ticket-confidentiality-desktop-dark.png) | [Light](screenshots/ticket-confidentiality-mobile-light.png) | [Dark](screenshots/ticket-confidentiality-mobile-dark.png) |

## Focused Checks

| Check | Observed result |
| --- | --- |
| Schema and populated upgrade | Fresh schema 29, repeat startup, preservation of assignments and original stock facts, retained archived Department, unchanged physical balances, foreign keys and injected-failure rollback passed. [Schema tests](../../../../tests/test_shared_device_schema.py) |
| Assignment and stock | Staff and Department exclusivity, duplicates, archive handling, final-Department protection, permission and revision checks, canonical reissue, atomic Issue And Associate, multiple to one, actual accessory return, direct handover and write-off passed. Existing allocation, stock, handover, associated equipment, corrections and reset checks passed. [Shared Device HTTP and stock tests](../../../../tests/test_shared_devices.py) |
| Service Desk and notification | A new Department gained current-period access for earlier employee and IT tickets. Removal, re-addition, membership changes and prior custody privacy passed. Direct attachment access respected private notes. Loopback SMTP covered new, removed and re-added Departments and one delivery per verified mailbox. The existing Service Desk suite covered feature switches, MFA, RBAC, attachments, replies and reopening. [Shared Device tests](../../../../tests/test_shared_devices.py) · [Existing Service Desk HTTP suite](../../../../tests/test_service_desk_http.py) |
| Chromium | The dedicated Shared Devices test and the existing assignment, Department Details, handover, Device stock, Associated Equipment and Service Desk reporting scripts passed. The dedicated test covered search, saving, Cancel, final selection protection, the preselected ticket route and the warning for one and several Departments. It checked that selecting personal equipment hides the warning. |
| Protected import | The protected-import HTTP scenarios passed on schema 29, including exact Device retention with optional features off and confirmation revalidation. [Import tests](../../../../tests/test_protected_import_http.py) |
| Stopped-volume recovery | Isolated Docker Compose passed schema 10 → 29, populated schema 28 → 29 and exact schema 28 archive restoration with its matching image. The upgraded copy retained original stock data and representative inventory, MFA, private notes and authorised attachments. The source mounts remained intact. [Recovery output](recovery.txt) · [Rehearsal](../../../../tests/test_stage_6_4_recovery.py) |

Run the screenshots locally with explicit Chromium and output paths:

```sh
CAFFOOT_CHROMIUM_PATH=/path/to/chromium \
CAFFOOT_STAGE64_SCREENSHOTS=/path/to/evidence \
node tests/shared-devices-interface.cjs
```

## Remaining Acceptance

Independent review, owner visual acceptance, final-head CI and explicit merge approval remain separate. Stages 6.5–6.8 and the previously deferred native Raspberry Pi, Safari, Portainer, private-data and manual acceptance are outstanding. The recovery exercise used isolated Linux x86-64 images, Docker-managed volumes and fictional data. [Active milestone handover](../../milestone-01.md) · [Draft recovery procedure](../../../how-tos/features-and-instructions/v2.2-draft/Legacy-Import-and-Docker-Upgrade.md#back-up-a-complete-installation)
