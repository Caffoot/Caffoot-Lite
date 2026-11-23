# Service Desk Notification Evidence

The Email Settings and authenticated ticket dialogues were captured on 23 November 2026 from the running draft v2.2 application at [`3ab78ad5a16716d9fd5ac3e8a35ab519e4be6741`](https://github.com/Caffoot/Caffoot-Lite/commit/3ab78ad5a16716d9fd5ac3e8a35ab519e4be6741), based on [`e708c2f5069ec5ff1a429e66bb1cc0d0769e36f3`](https://github.com/Caffoot/Caffoot-Lite/commit/e708c2f5069ec5ff1a429e66bb1cc0d0769e36f3). Playwright 1.56.1 drove Chromium 155.0.8059.79 on Debian 13 over loopback HTTPS against a disposable SQLite schema 28 installation. Desktop used a 1440 × 960 viewport. Mobile used 390 × 844. Settings and the editor were captured at full page height. The ticket dialogues were captured within their desktop viewport. All mailbox addresses, company names, users and tickets in the captures are fictional. [Browser test and capture procedure](../../../../tests/email-templates-interface.cjs)

The four Ticket Created editor screenshots were recaptured on 23 November 2026 with the same browser, fixture and viewports at [`25cf826633fd91c8491a02c0f7b3040d51f966bd`](https://github.com/Caffoot/Caffoot-Lite/commit/25cf826633fd91c8491a02c0f7b3040d51f966bd). They show **Configured IT support mailbox** in the editor’s **Recipient** field. [Independent review](https://github.com/Caffoot/Caffoot-Lite/pull/442#issuecomment-7111052033)

| Screen | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| The saved IT Support Email Address in outgoing Email Settings | [PNG](email-settings-desktop-light.png) | [PNG](email-settings-desktop-dark.png) | [PNG](email-settings-mobile-light.png) | [PNG](email-settings-mobile-dark.png) |
| Ticket Created in the central editor, with its three variables and fictional Open preview | [PNG](ticket-created-desktop-light.png) | [PNG](ticket-created-desktop-dark.png) | [PNG](ticket-created-mobile-light.png) | [PNG](ticket-created-mobile-dark.png) |

- The technician opens the protected ticket dialogue on the IT Service Desk, using the notification URL with an active technician session. [IT email link](technician-email-link.png)
- A signed-out employee follows the Department URL, signs in and lands in the Department ticket dialogue. The same employee session is denied access to the IT ticket API. [Department email link](department-email-link.png)

The editor preview uses the application’s fictional sample data. The HTML and plain-text messages for committed ticket events were separately received and parsed by a loopback SMTP test receiver. The tests check protected content, individual recipients without CC or BCC, current ticket permissions, rejected transactions, optional delivery, and draft versus published wording. [HTTP and SMTP tests](../../../../tests/test_service_desk_http.py)

Reproduce the four Ticket Created screenshots from a checkout with Python 3.12 and Playwright 1.56.1 with Chromium installed.

```sh
CAFFOOT_TICKET_CREATED_SCREENSHOTS=/tmp/caffoot-ticket-created-captures \
  node tests/email-templates-interface.cjs
```

Use `CAFFOOT_TICKET_NOTIFICATION_SCREENSHOTS` to capture the full set.

Independent owner visual acceptance is pending. Native Safari, Raspberry Pi and Stage 6 upgrade and restore evidence are tracked separately.
