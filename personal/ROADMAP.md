# Caffoot Lite legacy planning notes

## Active: Caffoot Personal

A single-file home-lab and small-installation inventory application, based on the original NetMini Phase 19D2 interface.

**Source of truth:** `personal/caffoot-personal.html` on `main` in this repository. See the root `ROADMAP.md` for the v1.0 release plan.

**Preserved reference:** `legacy/netmini-phase19d2.html` (do not modify).

### Personal v1 milestones

- Confirm existing NetMini dashboard, devices, IPAM, racks, assignments, forms and export/import workflows still work.
- Change visible branding carefully without renaming storage keys or internal identifiers unexpectedly.
- Remove runtime CDN dependencies so the file can run offline; test without a network connection.
- Add robust export/import validation and explicit backup/restore guidance.
- Test empty data, imported data, light/dark themes and browser storage limitations.
- Package a versioned standalone HTML download with a clear privacy and data-storage explanation.

**Important:** Browser-local storage is not a shared database. Backups remain the user's responsibility; do not promise multi-user access or cross-device synchronisation.

## Later: Caffoot Server

The previous server-side work is **paused, not deleted**. Preserve the `phase-20a-foundation` and `phase-21-netmini-restoration` branches and the existing Docker preview volume.

Possible future features: shared SQLite-backed inventory, authenticated accounts, centralised backups, multi-user workflows and a Docker distribution. Reuse the Personal visual design rather than recreate it.

## Development and release rules

- Make changes on the `caffoot-personal` branch, retaining the original NetMini reference.
- Prefer focused changes with a manual regression checklist; never modify user data silently.
- No GHCR, Portainer or Docker required to use Caffoot Personal.
- Do not delete or redeploy the existing Caffoot Server preview as part of Personal development.
