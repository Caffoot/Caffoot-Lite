# Caffoot Lite v2.2 — Everyday IT Management

> **Draft — Unreleased.** These notes describe the upcoming v2.2 features and are not production installation or upgrade instructions. No v2.2 release date or public image is available.

v2.2 brings people, equipment and support work together. Keep one permanent Device record while receiving, assigning, returning, preparing and reissuing equipment; give employees a restricted view of their equipment and support requests; and keep purchasing and lifecycle information alongside the inventory.

## People, Accounts And Access

- **Staff Members and Departments:** record people with or without logins, maintain Department membership and inspect permitted equipment and history. Departments are independent groups; membership grants no application permissions.
- **Shared roles and individual permissions:** combine reusable roles with explicit per-account overrides. The protected Staff Member role grants no general inventory access. Wider access and enabled additional roles require MFA.
- **Unified account administration:** manage a linked login from Staff Details, resolve saved profile differences, review permissions, reset an ordinary user's password and promote an eligible administrator. A temporary password requires a personal replacement before entering the workspace.
- **Leavers:** Left Company disables a linked login and ends its sessions while retaining equipment and history. Reactivating employment leaves the login disabled until an administrator explicitly enables it.

[Staff Members](../../how-tos/features-and-instructions/v2.2/Staff-Members.md) · [Departments](../../how-tos/features-and-instructions/v2.2/Departments-and-Shared-Equipment.md) · [Accounts, roles and MFA](../../how-tos/features-and-instructions/v2.2/Roles-Section-Permissions-and-MFA.md)

## Infrastructure And Optional Features

- Enable Devices, IPAM, Network Racks, IT Assets, Suppliers and Equipment Lifecycle independently. Switching a feature off retains its saved data and permissions. Fresh installations start with optional features off; existing v2.1 infrastructure availability is retained during migration.
- Save a Device without an IP address. Record an eligible basic IPv4 address separately from managed IPAM, then deliberately link the saved address to a suitable existing subnet when needed. Enabling IPAM or saving a Device does not create that link automatically.
- Preserve rack and shelf relationships during unrelated Device editing while Network Racks is off. Review physical-server boot storage, ZFS descriptions and virtual-machine resources without configuring the real hardware.

[Optional Features and Link to IPAM](../../how-tos/features-and-instructions/v2.2/Optional-Features-and-Link-To-IPAM.md) · [Devices](../../how-tos/features-and-instructions/v2.2/Devices.md) · [IPAM](../../how-tos/features-and-instructions/v2.2/IPAM.md) · [Racks](../../how-tos/features-and-instructions/v2.2/Racks.md)

## Equipment Custody And Stock

- **Assignments and My Equipment:** assign eligible existing Devices to people or share a Desktop, Laptop or Printer equally with Departments. Employees see only eligible personal and current Department equipment.
- **Receive and prepare stock:** keep quantity-based or individually tracked equipment, record delivery checks and distinguish Physically Held, Ready To Issue, Awaiting Checks and Awaiting Preparation.
- **Register and reissue Devices:** register a computer from Ready stock without double counting it, then issue or reissue the same permanent Device after the required preparation.
- **Accessories and handovers:** explicitly associate accessories with Device custody, account for outstanding items, and record a checked direct handover when equipment moves between holders without a storeroom return.
- **Returns, write-offs and corrections:** record actual physical outcomes and correct eligible quantity errors with an attributed history. A correction retains the original movement and cannot make dependent history impossible.
- **Stock reporting:** inspect current balances, category distribution and 30/90-day movement reporting. Optional per-item Low Stock warnings compare Ready quantities with the configured minimum.

[Assignments and My Equipment](../../how-tos/features-and-instructions/v2.2/Device-Assignments-and-My-Equipment.md) · [Stock intake](../../how-tos/features-and-instructions/v2.2/IT-Assets-Stock-Intake.md) · [Registration and reissue](../../how-tos/features-and-instructions/v2.2/Device-Stock-Registration-and-Reissue.md) · [Issue, return and write-off](../../how-tos/features-and-instructions/v2.2/IT-Assets-Issue-Return-and-Write-Off.md) · [Accessories and handover](../../how-tos/features-and-instructions/v2.2/Associated-Equipment.md) · [Corrections](../../how-tos/features-and-instructions/v2.2/IT-Assets-Correct-Movement.md) · [Reporting](../../how-tos/features-and-instructions/v2.2/IT-Assets-Dashboard.md)

## Suppliers And Equipment Lifecycle

- Maintain Suppliers, locations, contacts, categories and work-related notes. Track Supplier Issues and their updates through Purchasing.
- Explicitly link Suppliers to Devices and original receipts. Supplied Equipment measures original associated supply rather than current stock; registering a Device does not count the receipt twice.
- Record purchase, first-service and warranty dates, calculate planned replacement dates and configure lifecycle warnings. Warnings do not buy, retire, return or replace equipment. A qualifying first issue from stock records first service even while Lifecycle is off.

[Suppliers](../../how-tos/features-and-instructions/v2.2/Supplier-Management.md) · [Supplier Issues and Purchasing](../../how-tos/features-and-instructions/v2.2/Supplier-Issues-and-Purchasing.md) · [Equipment Supplier integration](../../how-tos/features-and-instructions/v2.2/Equipment-Supplier-Integration.md) · [Lifecycle](../../how-tos/features-and-instructions/v2.2/Equipment-Lifecycle.md)

## Service Desk And Email

- Employees report problems from eligible equipment and use My Tickets or Department Tickets to read shared updates, reply, attach permitted files and reopen a returning problem.
- Technicians use the separately permissioned IT queue to assign work, record internal notes or employee-visible updates, pause, resolve and reopen tickets. Equipment changes end the earlier employee audience while retaining authorised IT history.
- Unread reply indicators follow each account. Opening Overview does not mark replies read; successfully loading Updates acknowledges that account's permitted conversation.
- Administrators configure Working Hours, Excluded Dates and Ticket Categories. Reporting separates live workload from activity over a selected period; working-time measurements use the installation's IANA time zone and retained calendar history.
- Configure outgoing SMTP and the IT support mailbox. Edit seven Service Desk and three account/security email templates, preview fictional samples, save drafts and publish wording. Shared branding supports a company name, colours, footer and optional logo. Delivery and account verification remain separate.

[Tickets](../../how-tos/features-and-instructions/v2.2/Service-Desk-Tickets.md) · [Administration](../../how-tos/features-and-instructions/v2.2/Service-Desk-Administration.md) · [Time zone](../../how-tos/features-and-instructions/v2.2/Service-Desk-Time-Zone.md) · [Email and branding](../../how-tos/features-and-instructions/v2.2/Email-Templates-and-Company-Branding.md)

## History, Import And Everyday Use

Audit Trail presents event-time names, readable field changes and restricted technical details. Record timelines avoid joining unrelated identities, and JSON export contains only authorised history. Ticket conversations retain their own History rather than being copied into the application Audit Trail.

Legacy v1.3.3 inventory import reviews mounting corrections and replacement counts. It rejects the entire replacement if a protected Device would change or disappear. Import is not a full Docker backup.

Date controls use **DD/MM/YYYY**, with keyboard-accessible calendars. Desktop navigation scrolls independently, and virtual machines have type-appropriate Details without a physical Assigned To tab.

[Audit Trail](../../how-tos/features-and-instructions/v2.2/Audit-Trail.md) · [Legacy import](../../how-tos/features-and-instructions/v2.2/Legacy-Import-and-Docker-Upgrade.md#import-legacy-inventory) · [Navigation and dates](../../how-tos/features-and-instructions/v2.2/README.md)

## Installation And Recovery Limits

Published v2.1 uses schema 10; the v2.2 candidate uses schema 31. A supported production v2.1 → v2.2 upgrade and complete-volume recovery for the current candidate have not been established. The draft [installation](../../how-tos/features-and-instructions/v2.2/Installation.md) and [upgrade/recovery](../../how-tos/features-and-instructions/v2.2/Legacy-Import-and-Docker-Upgrade.md) guides are for separately authorised isolated review.

Preserve the complete stopped `/data` mount, private configuration and matching image before any authorised upgrade. An older image must not open an upgraded database; rollback needs its complete matching pre-upgrade backup. Inventory JSON cannot restore accounts, MFA, tickets, attachments, branding, TLS or private email settings.
