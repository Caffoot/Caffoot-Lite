# Service Desk Foundation

Batch 5.1 introduces one equipment-linked ticket model in schema 25 and applies the approved employee and technician access rules at the HTTPS boundary. The ticket screens and upload workflows will arrive in the relevant interface batches. Reporting, category administration, templates and notifications have their own later batches. [Batch 5.1](https://github.com/Caffoot/Caffoot-Lite/issues/420)

## Storage And Transactions

A ticket links to exactly one canonical Device, individually tracked IT Asset unit or quantity-tracked stock item. A stock unit linked to an existing Device uses the Device's identity. The migration stores the precise assignment or original issue and keeps it with the ticket. Ticket author and actor labels are saved with their identifiers so later account changes leave the attribution intelligible.

SQLite foreign keys preserve equipment and ticket relationships. Categories have stable identifiers and the recorded category label is kept with each ticket and change event. New tickets start Open, Medium and Unassigned. An explicit closure records its resolution note and event. A reopening links back to that closure and preserves the same ticket ID and all earlier attempts. The working-time value is reserved for the later reporting batch.

Attachments belong to messages. Their bytes live in SQLite, which lets the existing Clean Start transaction remove attachments together with tickets and inventory. The reset also requests secure deletion for the SQLite pages it frees. Backups retain the information they captured. The central reset event records the operation without adding ticket contents or identifiers. [Schema](../../backend/service_desk_schema.py) · [Reset writer](../../backend/reset_inventory.py)

## Permission And Request Boundaries

The existing effective **Service Desk** section supports Read and Edit. Ordinary-account grants start empty, including upgrades with historical IT Staff memberships. The existing roles and per-user overrides govern access to the technician scope. Technician ticket access also needs the equipment feature to be enabled and effective Read access to that section.

Employee access requires a live account and a linked active Staff record. Each query checks the stored assignment against the current Staff or Department identity. Staff joins and departures change membership without changing the ticket's stored assignment. For stock issues, the ledger balance for the issue must have stayed above zero since the ticket was created. This closes the privacy boundary at a full return even when a later correction adds an outstanding quantity back to the same issue. [Audience filter](../../backend/service_desk_access.py)

The HTTPS handler puts reads in a consistent database snapshot and locks writes before authorisation and changes. Read and mutation paths use the existing session and origin checks, and mutations require session-bound CSRF proof. Requests use the `/api/service-desk/` prefix with `personal`, `department` or `it` scopes. The same scope filter checks list results, counts, searches, ticket details, message and attachment resources, history and writes. Private fields have a separate history column, and attachment bytes inherit access from their parent message. [HTTPS handler](../../backend/server.py) · [Ticket readers and writers](../../backend/service_desk.py)

## Inventory Replacement And Clean Start

Normal Device deletion rejects a Device with protected ticket history. The existing legacy inventory writer retains a ticket-linked Device row in place when the reviewed candidate contains the same record. It can still replace unrelated inventory or change the Device's ordering. If a candidate would remove or replace a protected record, the import raises an error before writes. SQLite still enforces other existing inventory dependencies.

Clean Start cascades from tickets to dependent events, messages, attachments and closure records in the same transaction as inventory removal and central audit recording. Existing equipment dependencies may prevent the inventory reset. In that case the whole transaction, including ticket cleanup, rolls back. The account and central audit retention policies are the existing Clean Start policies. [Inventory writer](../../backend/inventory.py) · [Administrator guide](../how-tos/features-and-instructions/v2.2-draft/Service-Desk-Administration.md)

## Verification

The schema tests exercise transactional upgrade and rollback, repeat startup, preserved existing rows, stable equipment and category links, and concurrent ticket IDs. Live HTTP tests use disposable databases and cover effective access, current Department membership, the three handovers, stock corrections, hidden ticket and attachment resources, closure attribution, compatible imports and atomic Clean Start. The existing Chromium role fixture exercises the new permission and the existing Clean Start confirmation. [Schema tests](../../tests/test_service_desk_schema.py) · [HTTP tests](../../tests/test_service_desk_http.py) · [Browser test](../../tests/builtin-roles-interface.cjs)
