# Draft v2.2 User And Administrator Guides

> **Draft v2.2 — Unreleased.** Stage 6.6 Batch 2 adds My Equipment, unread Service Desk replies and readable Audit Trail records in the schema 31 draft candidate. The [Batch 2 verification record](../../../development-handovers/evidence/stage-6-6-batch-2/README.md) lists completed focused checks, application screenshots and remaining acceptance gates. Use the [published v2.1 guides](https://github.com/Caffoot/Caffoot-Lite/tree/v2.1/docs/how-tos/features-and-instructions) for the current release.

Caffoot Lite brings accounts, Staff Members, Departments, Devices and optional IT Assets together so your team can record who holds equipment, what is physically in stock and what is ready to issue. These guides explain workflows for ordinary users, IT technicians and administrators, including Suppliers and Equipment Lifecycle in Stage 4. Examples use fictional people, organisations and equipment.

Start with the task you need to complete. Each feature guide explains its permissions, controls, numbered procedures, examples and recovery steps. A missing section may mean the feature is switched off or your account lacks permission; ask an administrator to check before creating duplicate records.

## Import, Upgrade And Recovery

Use [Installation — isolated private review](Installation.md) for the separate draft v2.2 Docker/Portainer/Compose setup, storage, HTTPS and first-administrator steps. There is no public v2.2 image or production deployment procedure established here.

Use [Import Legacy Inventory Or Upgrade Docker](Legacy-Import-and-Docker-Upgrade.md) to review a standalone v1.3.3 export, understand protected Device conflicts, rehearse a v2.1 Docker upgrade on an isolated copy, or recover a complete Docker installation with its matching image.

## UK Date Entry And Calendar Controls

In v2.2, Caffoot Lite's date-entry controls show and accept **DD/MM/YYYY** regardless of the browser's own regional date display. For example, **15/03/2023** means 15 March 2023, and **05/06/2024** means 5 June 2024, not 6 May. Use a four-digit year. The visible format is for people: the application continues to save and exchange dates in its existing ISO `YYYY-MM-DD` format.

Type a date with slashes, or enter eight consecutive digits (for example, `15032023`), which are formatted as `15/03/2023`. Use the calendar button on the same field if you prefer not to type. The calendar begins each week on Monday and includes the month, year and labelled days. With keyboard focus inside the calendar, use the arrow keys to move by day or week, Home/End for the beginning/end of the week, Page Up/Down to move months, Shift+Page Up/Down to move years, Enter to select and Escape to close it.

Only real calendar dates are accepted: **29/02/2024** is valid, but **29/02/2023** is not. Fields with existing restrictions, such as no future Purchase Date or qualifying first-service Date Issued, keep those restrictions. An invalid date is shown with a validation message and is not submitted as a replacement for the previous recorded value. Clearing an optional date remains possible. The calendar preserves existing permissions, readonly fields, Cancel and unsaved-change/discard behaviour.

This is a change to how dates are **entered and shown**, not to the dates already saved, the actual event times, the configured timezone, lifecycle calculations, or stock movement history. Existing published v2.1 instructions and records are unchanged.

## Infrastructure

| Task | Guide |
| --- | --- |
| Find, record, edit and manage physical Devices or virtual machines | [Devices — Creating, Editing and Managing Equipment](Devices.md) |
| Manage subnets, address blocks, VLANs, reservations and address allocations | [IPAM — Subnets, VLANs and Individual Addresses](IPAM.md) |
| Record racks, inspect elevations, place equipment and manage shelves/accessories | [Network Racks](Racks.md) |
| Enable optional features, record basic IPv4 or explicitly link to IPAM | [Optional Features, Basic IPv4 And Link To IPAM](Optional-Features-and-Link-To-IPAM.md) |

These infrastructure drafts have completed the Batch 2 text/source pass at the recorded baseline. The owner approved Batch 2 written/source work; desktop screenshot suitability/approval remains outstanding; see the [Batch 2 evidence and limitations](../../../development-guide/Milestone-01-Batch-2-Review.md).

### A Sensible Infrastructure Setup Order

1. Agree which infrastructure areas the organisation uses. An administrator enables the required Optional Features and grants access separately.
2. If using managed IPAM, record the real addressable subnets first, with their purpose and gateway/VLAN where applicable. An Address Block is optional and cannot substitute for a subnet.
3. If recording rack-mounted or shelf equipment, add the measured rack and any actual shelf accessories. Check the intended face and free span.
4. Search Devices before adding equipment. Save it with no address, an eligible basic IPv4 address, or a managed allocation using the corresponding guide.
5. Reopen the Device and related IPAM/Rack records to verify the saved result. Use the specialised assignment/stock guides for custody or physical issue; Add Device alone does not complete those tasks.
6. Review authorised Audit Trail records where navigation is available. An audit entry explains a change; it is not a backup or proof of a physical action.

## Accounts And Access

| Task | Guide |
| --- | --- |
| Understand Staff Member, IT Staff, shared roles and individual overrides | [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md) |
| Add a login, resolve linked profile differences or open Manage Permissions | [Staff Members](Staff-Members.md) |
| Enrol MFA, recover a password or understand a session ending | [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md) |
| Reset an ordinary user’s password or sign in with a temporary password | [Reset a Staff Member’s password](Roles-Section-Permissions-and-MFA.md#reset-a-staff-members-password) · [Change a temporary password](Roles-Section-Permissions-and-MFA.md#after-an-administrator-gives-you-a-temporary-password) |
| Check eligibility and promote an existing user to Administrator | [Make an existing user an Administrator](Roles-Section-Permissions-and-MFA.md#make-an-existing-user-an-administrator) |
| Edit, preview, test and publish email wording or set shared branding | [Email Templates And Company Branding](Email-Templates-and-Company-Branding.md) |
| Enable sections, preserve Rack information or record/link basic IPv4 addresses | [Optional Features, Basic IPv4 And Link To IPAM](Optional-Features-and-Link-To-IPAM.md) |

An application account is the identity used to sign in. A Staff Member is a person in your organisation; that person may have a linked account or no login at all. Roles determine section access, while an organisation's Optional Features switches determine whether optional functions are available. A role does not switch a feature on.

Batch 3 accounts, Staff, Departments and My Equipment have completed written/source reconciliation at the recorded baseline, **focused independent ChatGPT review recorded and owner written acceptance recorded**. Desktop requirements are deferred to Batch 7. [Batch 3 source, validation and screenshot record](../../../development-guide/Milestone-01-Batch-3-Review.md).

## People And Equipment

| Task | Guide |
| --- | --- |
| Add or update Staff, link a login or manage Staff status safely | [Staff Members](Staff-Members.md) |
| Maintain Departments, archive them or manage shared equipment | [Departments And Shared Equipment](Departments-and-Shared-Equipment.md) |
| Assign an existing Device or view personal/Department equipment | [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md) |

Staff Members and Departments are core functions, with independent section permissions. You do not need to populate them to use Caffoot Lite's infrastructure inventory. **My Equipment** gives linked Staff an appropriately restricted view of their equipment; it does not grant access to IT inventory or another person's private details.

## Connected Equipment Example

[Follow Aster Services and laptop AST-LAP-014](Connected-Equipment-Journey.md) from Supplier information and physical receipt to Device registration, personal/Department visibility, return/reissue or direct handover, lifecycle review and eventual write-off. The example links the detailed instructions; it is not a compulsory application sequence.

## Stock And Technician Workflows

| Task | Guide |
| --- | --- |
| Configure IT Assets, receive deliveries and inspect Stock Inventory/readiness | [Receive Stock And Stock Inventory](IT-Assets-Stock-Intake.md) |
| Issue equipment, record partial/damaged returns, prepare it or write it off | [Issue, Return And Write Off](IT-Assets-Issue-Return-and-Write-Off.md) |
| Register a computer from stock or reissue an existing registered Device | [Device Stock Registration And Reissue](Device-Stock-Registration-and-Reissue.md) |
| Explicitly associate accessories, resolve missing items or hand a Device to a new holder | [Associated Equipment And Direct Handovers](Associated-Equipment.md) |
| Correct an incorrectly recorded quantity without erasing its history | [Correct Movement](IT-Assets-Correct-Movement.md) |
| Read stock balances, movement reporting and Minimum Stock Level warnings | [IT Assets Overview And Reporting](IT-Assets-Dashboard.md) |

IT Assets is independently optional and is **off by default** on fresh installations. Its availability and your permission to read or edit it are separate checks. Device operations retain their own Devices permissions.

Before changing stock, keep these distinctions in mind:

- A **Device** is the canonical record for a managed piece of equipment. Keep that identity through return, reissue and handover rather than creating a replacement record.
- **Physically Held** describes equipment actually in your stockholding. Registering one stock unit as a Device changes its classification without reducing that total. Physically issuing it reduces held stock.
- **Readiness** records preparation/checking for issue. Being unassigned, operationally active or physically present does not by itself mean equipment is Ready.
- **Assignment History** records successive holders. **Movement History** records stock events. Correcting a movement retains the original event and an attributed correction.

For a new delivery, follow Receive Stock → check/readiness → Issue Equipment, using Device registration first where needed. For equipment already with a holder, inspect the current assignment and associated accessories before choosing Return Equipment or the checked direct-handover route. Use Correct Movement for a recording mistake; do not invent a receipt or return to conceal it.

## Suppliers

| Task | Guide |
| --- | --- |
| Enable Suppliers, set access, and manage companies, categories, locations, contacts and notes | [Supplier Management](Supplier-Management.md) |
| Use Purchasing, file or correct Issues, hand them over between contacts and manage Issue Categories | [Supplier Issues And Purchasing](Supplier-Issues-and-Purchasing.md) |
| Record, correct or review Supplier associations on Devices and stock receipts | [Equipment Supplier Integration](Equipment-Supplier-Integration.md) |

Suppliers starts switched off and uses its own section permissions. Supplier Management, Supplier Issues/Purchasing and Equipment Supplier Integration are owner-accepted and integrated on the unreleased development branch through merged PRs #414–#416. The Supplier Equipment view and schema 23 work are part of that integration, not a remaining draft PR.

## Equipment Lifecycle

| Task | Guide |
| --- | --- |
| Record dates, review Dashboard warnings, configure warning periods and lifespans, archive or restore types | [Equipment Lifecycle](Equipment-Lifecycle.md) |

Equipment Lifecycle is independently optional and starts switched off. Stage 4.4 is owner-accepted and merged via PR #418 into the unreleased development branch; these instructions remain draft v2.2, not published v2.1 features.

Batch 4's ten equipment/Supplier/Lifecycle guides and linked example have completed written/source reconciliation at the stated baseline, **focused independent ChatGPT review recorded and owner written acceptance recorded**. [Batch 4 source, validation and outstanding desktop requirements](../../../development-guide/Milestone-01-Batch-4-Review.md). Batches 5–6 have their separate accepted written/source checkpoints below; Batch 7 reconciliation review/acceptance, capture approval, Batch 8 and all release/visual gates remain outstanding.

## Service Desk

| Task | Guide |
| --- | --- |
| Follow Alex and Sam through one connected support request | [Connected Service Desk Journey](Connected-Service-Desk-Journey.md) |
| Raise, find, reply to and reopen tickets for personal and Department equipment | [Employee ticket instructions](Service-Desk-Tickets.md#raise-a-support-request) |
| Use the IT queue, record tickets, handle technician actions and attachments, and understand equipment privacy | [Service Desk Tickets](Service-Desk-Tickets.md) |
| Grant technician access, configure Working Hours, Excluded Dates and Ticket Categories, and protect ticket-linked records | [Administer The Service Desk](Service-Desk-Administration.md) |
| Set or correct the Service Desk time zone in Portainer or Docker Compose | [Set The Service Desk Time Zone](Service-Desk-Time-Zone.md) |
| Read workload, change reporting periods and understand technician attribution | [Read Service Desk Activity](Service-Desk-Tickets.md#read-service-desk-activity) |
| Configure the IT support mailbox, check notification recipients and troubleshoot missing mail | [Service Desk email settings](Service-Desk-Administration.md#configure-the-it-support-mailbox) |
| Edit and publish templates, set company branding and send a sample | [Email Templates And Company Branding](Email-Templates-and-Company-Branding.md) |

The foundation, IT queue and employee ticket workflows are integrated through [PRs #437](https://github.com/Caffoot/Caffoot-Lite/pull/437), [#438](https://github.com/Caffoot/Caffoot-Lite/pull/438) and [#439](https://github.com/Caffoot/Caffoot-Lite/pull/439). Service Desk settings and reporting are integrated through [PR #440](https://github.com/Caffoot/Caffoot-Lite/pull/440), and Email Templates and Company Branding through [PR #441](https://github.com/Caffoot/Caffoot-Lite/pull/441). The notification instructions cover the Stage 5.6 development changes integrated through [PR #442](https://github.com/Caffoot/Caffoot-Lite/pull/442).

Batch 5 written/source reconciliation has a recorded focused independent review and separate owner written acceptance. [Source, validation, findings and 35 additional screenshot groups](../../../development-guide/Milestone-01-Batch-5-Review.md). Desktop work is deferred to Batch 7; none of the previous 82 groups is waived.

## Audit Trail

Use [Read The Audit Trail](Audit-Trail.md) to search authorised event-time names and original references, inspect label provenance and export the history available to your account.

The dated independent review additions in the Batch 3 and Batch 4 records supersede the original Codex review-pending status in the guide reconciliation banners. [Separate owner written acceptance](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7199742131) is recorded for both batches at `5969d35c4df5f69f138372b51adc9fe5a972837d`; the dated earlier banners retain their checkpoint context. Visual approval remains outstanding.

## Publication And Acceptance

Stages 1–5 are integrated into `milestone-1`. Stage 6.2 import protection is integrated; its historical schema-28 evidence is distinct from the current schema-31 draft instructions. Batch 3.4 manual/native acceptance, broader Raspberry Pi/native Safari and private-installation checks, and current supported-upgrade and complete-volume restoration acceptance remain outstanding. The historical Stage 6.3/schema-28 and Stage 6.4/schema-29 exercises do not complete those current gates. [Stage 6.2 evidence](../../../development-handovers/evidence/stage-6-2/README.md)

Images used here are genuine application captures with an identified approval source and captions describing their scope. Functional HTML previews are retained as development references, never presented as application screenshots. Missing or outdated images and remaining wording discrepancies are listed in the [documentation review record](../../../development-guide/Stage-1-3-Documentation-Review.md).

For implementation checkpoints and dated evidence, see [Development Status](../../../development-guide/Development-Status.md), the [active milestone handover](../../../development-handovers/milestone-01.md), [documentation plan #366](https://github.com/Caffoot/Caffoot-Lite/issues/366), [master tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351) and [Stage 3 decisions #368](https://github.com/Caffoot/Caffoot-Lite/issues/368).

## Installation And Recovery Documentation Checkpoint

Batch 6 written/source reconciliation covers [Installation](Installation.md), [Legacy Import, Docker Upgrade, Backup And Recovery](Legacy-Import-and-Docker-Upgrade.md) and [Service Desk Time Zone](Service-Desk-Time-Zone.md). [Separate Batch 6 review](../../../development-guide/Milestone-01-Batch-6-Review.md) records pinned sources, historical versions, limitations, static checks and **21 additional screenshot groups**. Focused independent ChatGPT review and separate owner written acceptance are recorded for Batch 6. The [Batch 7 reconciliation](../../../development-guide/Milestone-01-Batch-7-Review.md) preserves all **138 original desktop groups** and maps 670 distinct state specifications, with none waived. No deployment/rehearsal, current upgrade/restore acceptance or release approval follows from written completion. Batch 7.1 reconciliation and the bounded 7.2 existing-image assessment await their own independent review and owner acceptance. No Batch 7.3 capture or Batch 8 work is authorised.

## Screenshot Reconciliation Checkpoint — 27 November 2026

The [owner acceptance record](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-7200681167) establishes written/source acceptance of Batches 1–6, subject to the focused independent-review limits. Dated earlier review records are preserved. This does not accept desktop visuals, runtime, security or release readiness.

[Batch 7 requirements and proposed packs](../../../development-guide/Milestone-01-Batch-7-Review.md) account for all 19 + 25 + 38 + 35 + 21 = 138 original groups, 678 state references and 670 distinct instructional state specifications. [Existing-image inventory](../../../development-guide/Milestone-01-Batch-7-Image-Inventory.md): 1,213 files, eight narrow reuse proposals awaiting owner approval, 16 inspected examples requiring recapture for the proposed use, 1,185 historical-only files and four inspected latest desktop candidates awaiting individual assessment. Twenty-eight images opened locally and six earlier visual findings reused; no blanket image certification. No group is fully satisfied; no image has been promoted.

Batch 7.1 and the explicitly bounded 7.2 assessment await independent ChatGPT review and owner acceptance. Batch 7.3 functional packs 7A–7H are proposals requiring explicit scope/method approval. No capture, browser, runtime, Docker, installation/migration/upgrade/recovery procedure or native acceptance was performed. Native acceptance remains paused after Test 69, with Test 70 next; supported upgrade, complete-volume restoration, two private export cases, independent audit #443, Batch 8 and final release/website gates remain outstanding. v2.1 remains published and v2.2 unreleased.
