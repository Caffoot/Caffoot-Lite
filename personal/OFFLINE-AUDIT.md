# Offline readiness audit — Caffoot Personal

Date: 2026-10-09

## Status: in progress, **not yet fully offline**

The Personal HTML file is based on NetMini Phase 19D2. Its original JavaScript, UI structure and browser storage keys remain in place.

### External resources identified

1. `https://cdn.tailwindcss.com` — **blocking**. Runtime Tailwind generates many utility classes used by the application. Removing this script without first supplying equivalent CSS would break the interface.
2. `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` — **blocking for icon fidelity**. The app uses Font Awesome classes; a locally embedded equivalent or deliberate icon replacement is required.
3. Google Fonts / Inter — **addressed**. Removed the network stylesheet and specified a system-font fallback. The display may vary slightly between operating systems.

### Next implementation tasks

- Produce and embed a CSS build covering all Tailwind classes used by the single HTML file, including responsive and dark-mode variants.
- Replace Font Awesome's remote stylesheet and webfont references with self-contained icon assets or a carefully tested alternative.
- Confirm there are no remaining runtime external dependencies.
- Test opening the HTML file using a `file://` URL with the network disconnected.
- Test dashboard, devices, subnets/IPAM, racks, forms, dark mode, export and import against the untouched NetMini reference.

### Data safety

The app uses browser-local storage keys including `netmini_state`, `netmini_dark` and `netmini_phase12b_prebulk_snapshot`. Do not rename them as part of visual branding. A local HTML file's storage may be scoped differently across browsers or file locations; users must use the built-in export/backup function before changing versions.

Do not advertise the app as completely offline or release-ready until the blocking dependencies and browser tests are resolved.
