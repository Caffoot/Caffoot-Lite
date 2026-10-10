# Caffoot Personal code review — initial findings

Date: 2026-10-09. Static source review only; this is not a completed runtime or browser audit.

## Changes made

- Removed the Diagnostics & Tests navigation entry.
- Removed the diagnostics page from normal tab rendering and its navigation action.
- Replaced the Settings maintenance shortcut with data-safety guidance.
- Updated outdated About-page text.
- Preserved the internal diagnostic and recovery routines pending dependency analysis; do not remove data-integrity functionality just to simplify the UI.

## Findings requiring follow-up

1. **Large single HTML source (~427 KB):** tightly coupled rendering, state management, validation and UI event dispatch. Keep the end-user artifact as one file, but consider splitting developer source into modules during build.
2. **Browser storage compatibility:** `netmini_state` remains shared with older versions. Startup reads saved data, so a blank default does not erase existing inventory. Any reset or migration must require a backup and explicit confirmation.
3. **Managed server/software legacy logic:** menu controls and default checkboxes have been removed from normal workflows, but the compatibility functions remain. Review historical detail rendering and imported data before removing the underlying code.
4. **Old device type values:** existing backups can contain `Server` and `AP`; defaults now use `Server - Physical`, `Server - Virtual` and `Access point`. Design an opt-in migration rather than silently changing imported records.
5. **Diagnostics coupling:** integrity checks, repair previews and diagnostics currently share a workspace. Preserve recovery capability while moving developer-only tests outside the user interface.
6. **Offline delivery:** the build pipeline generates a single HTML file, but an actual browser regression pass is still needed. Do not treat syntax or asset checks as full functional tests.
7. **Legacy wording and workflows:** check Docker/self-hosting views, historical NetMini text, settings labels and obsolete managed-software UI for Personal suitability.

## Recommended next steps

- Verify the updated build and run smoke tests on an empty browser profile.
- Audit all navigation actions and unused code paths before deleting internal diagnostic routines.
- Move regression tests into developer-only scripts; keep a user-friendly data-recovery workflow.
- Test device creation/edit/deletion, rack placement, subnet allocation, export/import and error recovery.
- Add an explicit reset-to-empty workflow that offers a backup first.
- Review accessibility, empty states, error messages and keyboard navigation.

Caffoot Server remains paused; do not alter its deployment or saved data.
