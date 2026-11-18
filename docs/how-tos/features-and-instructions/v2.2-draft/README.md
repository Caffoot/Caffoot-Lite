# Draft v2.2 User And Administrator Guides

> **Draft v2.2 — Unreleased.** The Stage 1–3 guides describe `milestone-1` at `753b3266893987addb11406ef8303adb03c3c112` (schema 20), verified on 17 November 2026. Use the [published v2.1 guides](../README.md) for the current release. These drafts are not installation, upgrade or restore instructions.

Caffoot Lite brings accounts, Staff Members, Departments, Devices and optional IT Assets together so your team can record who holds equipment, what is physically in stock and what is ready to issue. These guides explain the implemented Stage 1–3 workflows for ordinary users, IT technicians and administrators. Examples use fictional people, organisations and equipment.

Start with the task you need to complete. Each feature guide explains its permissions, controls, numbered procedures, examples and recovery steps. A missing section may mean the feature is switched off or your account lacks permission; ask an administrator to check before creating duplicate records.

## Accounts And Access

| Task | Guide |
| --- | --- |
| Understand Staff Member, IT Staff, shared roles and individual overrides | [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md) |
| Add/manage accounts, enrol MFA or understand a session ending | [Roles, Section Permissions And MFA](Roles-Section-Permissions-and-MFA.md) |
| Enable sections, preserve Rack information or record/link basic IPv4 addresses | [Optional Features, Basic IPv4 And Link To IPAM](Optional-Features-and-Link-To-IPAM.md) |

An application account is the identity used to sign in. A Staff Member is a person in your organisation; that person may have a linked account or no login at all. Roles determine section access, while an organisation's Optional Features switches determine whether optional functions are available. A role does not switch a feature on.

## People And Equipment

| Task | Guide |
| --- | --- |
| Add or update Staff, link a login or manage Staff status safely | [Staff Members](Staff-Members.md) |
| Maintain Departments, archive them or manage shared equipment | [Departments And Shared Equipment](Departments-and-Shared-Equipment.md) |
| Assign an existing Device or view personal/Department equipment | [Device Assignments And My Equipment](Device-Assignments-and-My-Equipment.md) |

Staff Members and Departments are core functions, with independent section permissions. You do not need to populate them to use Caffoot Lite's infrastructure inventory. **My Equipment** gives linked Staff an appropriately restricted view of their equipment; it does not grant access to IT inventory or another person's private details.

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

Suppliers starts switched off and uses its own section permissions. Supplier Management and Supplier Issues are integrated on the development branch. Batch 4.3 adds equipment associations and the Supplier Equipment view in schema 23 on [draft PR #416](https://github.com/Caffoot/Caffoot-Lite/pull/416).

## Publication And Acceptance

Stage 1 and Stage 2 are accepted. Stage 3 Batches 3.1–3.12 and subsequent focused corrections are merged on the development branch. This does not establish completed milestone or release acceptance. Batch 3.4 manual/native acceptance, broader native Safari/private-installation evidence and Stage 6 compatibility/full upgrade/restore acceptance remain deferred. The Batch 4.3 integrated application and instructions await independent product-owner review. Service Desk and later milestone stages remain separate work.

Images used here are genuine application captures with an identified approval source and captions describing their scope. Functional HTML previews are retained as development references, never presented as application screenshots. Missing or outdated images and remaining wording discrepancies are listed in the [documentation review record](../../../development-guide/Stage-1-3-Documentation-Review.md).

For implementation checkpoints and dated evidence, see [Development Status](../../../development-guide/Development-Status.md), the [active milestone handover](../../../development-handovers/milestone-01.md), [documentation plan #366](https://github.com/Caffoot/Caffoot-Lite/issues/366), [master tracker #351](https://github.com/Caffoot/Caffoot-Lite/issues/351) and [Stage 3 decisions #368](https://github.com/Caffoot/Caffoot-Lite/issues/368).
