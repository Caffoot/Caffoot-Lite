# 03 — Frontend, backend and API

## In simple terms

The familiar inventory screens are still built from the published HTML application's interface. A small integration layer in the new HTML file communicates with the server to load shared data and save changes. The browser shows the forms; **the server decides whether a write is allowed and valid**.

## Where to look

- [`inventory.html`](../../inventory.html) contains the established inventory page plus new account, user and central-persistence integration. It is one large file, so search for a named function rather than relying on fixed line numbers.
- [`setup.html`](../../setup.html) handles first-run setup and sign-in, including the approved two-stage MFA sign-in presentation.
- [`backend/server.py`](../../backend/server.py) contains `Handler.do_GET`, `Handler.do_POST` and the backend API dispatch.
- [`backend/`](../../backend/) contains the write, validation, import and security functions reached by the handler.

## How the page talks to SQLite

In `inventory.html`, find `refreshCentralInventory` for reloading shared state, `postInventory` for posting a modifying request, `applyAllowedControls` for showing actions permitted by the active user's role, `loadCentralUsers` for the administrator's user list, and `showImport` / `actOnImport` for the migration interface.

Existing rendering such as `renderDevicesHTML` and `renderRackHubV13` is retained to preserve the inventory experience. Some functions inherited from the HTML release still exist for compatibility; **their presence does not mean browser localStorage is the database authority**. Follow the current call path before changing anything.

The UI hides edit controls from read-only users, but that is presentation only. The backend performs authorisation again for every protected operation.

## Approved appearance and font loading

The Docker application's first-run and sign-in page uses the existing Caffoot hedgehog, the tagline **“Infrastructure, Simplified.”** and the approved warm-background styling. The inventory screens retain their established layout and controls. Both pages prefer **Inter**, with system-font fallbacks when the external font stylesheet is unavailable. The normal HTTPS authentication, editing and SQLite operations do not depend on the font provider; the published single-file v1.3.3 application retains its separate offline-first behaviour. This is the specific visual-only approval in [#215 §20](https://github.com/Caffoot/Caffoot-Lite/issues/215), not a permission to redesign inventory dialogs.

## Local Tailwind stylesheet

The Docker edition ships [`assets/tailwind.css`](../../assets/tailwind.css), a **static Tailwind CSS v3.4.17** build generated from the utility classes in `inventory.html`, preserving the existing `darkMode: 'class'` behaviour and established `brand` colour values. The HTTPS backend serves this file from `/assets/tailwind.css` and the Dockerfile bundles it. **There is no externally loaded Tailwind JavaScript, Node.js requirement or CSS compilation during installation or at runtime.**

If an approved future UI change needs new Tailwind utility classes, regenerate the stylesheet using that pinned Tailwind v3 version, the same dark-mode and brand settings, and the entire `inventory.html` source as the content input; commit the resulting CSS alongside the HTML change. Then rerun the relevant Chromium compatibility checks and compare affected screens to the published v1.3.3/approved Next appearance. Do not introduce an unapproved inventory redesign or a permanent runtime build dependency.

## HTTP endpoints

The live route list is defined by the conditions in `Handler.do_GET` and `Handler.do_POST`, not by this summary. Particularly useful route groups are:

| Purpose | Existing routes |
| --- | --- |
| Pages and health | `/setup`, `/inventory`, `/health` |
| Setup and sign-in | `/api/setup/status`, `/api/setup`, `/api/setup/mfa-secret`, `/api/setup/mfa`, `/api/login`, `/api/logout`, `/api/session` |
| User accounts | `/api/users`, `/api/users/create`, `/api/users/permission`, `/api/users/active`, `/api/users/admin`, `/api/users/delete` |
| Own account | `/api/account/password`, `/api/account/mfa/start`, `/api/account/mfa/confirm` |
| Read inventory | `/api/inventory/state`, `/api/inventory/sections`, `/api/inventory/devices`, `/api/inventory/ipam`, `/api/inventory/racks`, `/api/inventory/settings`, `/api/inventory/history` |
| Device changes | `/api/devices/create`, `/api/devices/edit/start`, `/api/devices/edit/save`, `/api/devices/edit/cancel`, `/api/devices/delete` |
| IPAM | `/api/ipam/allocation/save`, `/api/ipam/allocation/delete`, `/api/ipam/allocation/bulk`, `/api/ipam/subnets/save`, `/api/ipam/subnets/delete`, `/api/inventory/ipam/repair` |
| Other established inventory | `/api/inventory/record/save`, `/api/inventory/record/delete`, `/api/inventory/settings/save`, `/api/inventory/device-catalogue/change`, `/api/inventory/reset` |
| v1.3.3 import | `/api/import/preview`, `/api/import/access-point-choices`, `/api/import/confirm`, `/api/import/cancel` |

These routes use the same HTTPS server, not a second service. The backend derives the user from the validated session rather than trusting a browser-supplied user ID. The exact JSON request/response fields should always be read from the handler and its matching UI caller.

## Example: editing a device

1. The user opens an existing device's Edit control. The browser calls `/api/devices/edit/start` with the device identity and relevant section.
2. The server checks section edit access, removes expired reservations and gives the editor a reservation tied to the device's current revision. The reservation lasts **300 seconds** from acquisition/refresh.
3. The browser edits its working copy. Other users can view the device, but cannot obtain a competing reservation for it.
4. Saving calls `/api/devices/edit/save`. [`device_saves.save_reserved_device`](../../backend/device_saves.py) checks the authorisation, reservation owner and expiry, and revision. It validates affected relationships and commits the allowed change with related IPAM records as appropriate.
5. Saving or cancelling releases the reservation. An abandoned reservation expires. A stale or conflicting save fails rather than silently overwriting someone else's changes.

The reservation is shared across Devices, IPAM and Racks editing paths; a Racks-only editor is restricted to rack-placement fields on the device record.

## Relevant backend modules

[`device_saves.py`](../../backend/device_saves.py) covers create/save/delete with device dependencies; [`ipam_saves.py`](../../backend/ipam_saves.py) covers independent and bulk allocation changes; [`collection_saves.py`](../../backend/collection_saves.py) covers collection saves, subnet/VLAN changes and dependency-aware subnet deletion; [`device_catalogue.py`](../../backend/device_catalogue.py) handles managed type/location changes. Validation helpers are listed in the [code reference](07-Function-and-Code-Reference.md).

**Do not add endpoints or browser fallbacks merely because a historical source comment refers to future integration.** Check the actual handler, UI call and current tests first.

### Related reading

[Architecture](01-Architecture.md) · [Database](02-Database.md) · [Authentication](04-Authentication-and-Permissions.md) · [Code reference](07-Function-and-Code-Reference.md)
