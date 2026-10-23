# Backup and restore

**Published release:** v1.3.0. **Status:** Website reference draft; verify against published UI before publication.

## What it does

Help users keep a separate copy of their browser-stored inventory and restore a compatible saved inventory when needed.

## What users can do

- Download a JSON backup of the current inventory.
- Choose a JSON backup to validate and review before replacing the current inventory.
- Use a recovery copy automatically created before a confirmed restore or normal clean reset, subject to successful storage verification.
- Run an inventory safety check and access recovery controls.

## Important limitations

Restoring a backup **replaces** the current inventory; it does not merge two inventories. Browser storage is not a dependable long-term backup, so users should keep exported JSON files somewhere safe. The optional Change History is not part of an ordinary inventory backup and can be exported separately. Recovery copies are safeguards, not substitutes for downloaded backups.

The published v1.3.0 interface may use the technical term **snapshot** for a recovery copy. Simplified wording is proposed for a maintenance release and must not be represented as already shipped.

## Suggested website description

**Keep a copy of your inventory.** Download a backup to store outside your browser, and review a compatible backup before restoring it.

## Screenshot guidance

Show the actual published Data Management screen and a fictional backup review. Do not show future wording as if it were already released.

**Technical reference:** Save, import, recovery and settings workflows in `docs/workflows/TECHNICAL-WORKFLOWS.md`.
