# Caffoot Lite Next — development foundation only

This directory is the first **non-production** implementation checkpoint for issue #215. It is **not** the inventory application and does not yet expose the published v1.3.3 UI, authentication, or inventory API. This is deliberate: serving the old HTML unmodified would leave browser storage authoritative and misrepresent migration readiness.

## Local foundation smoke check

From this directory run `docker compose up --build -d` and check `http://127.0.0.1:8080/health`. Expected response: `{"status":"ok"}`. Run `docker compose down` to stop; the named `caffoot_data` volume remains. Do **not** use `docker compose down -v` when preserving data.

The bind is loopback-only for this early development checkpoint. This is **not** a public deployment recipe or a completed Portainer stack. No inventory import, user setup, login or UI is available yet.

## Next gates

Add the source-compatible inventory schema/projection and atomic v1.3.3 import, followed by existing inventory operations, authentication/RBAC/MFA and edit reservations, with full regression evidence before release. The approved scope remains GitHub issue #215 and published v1.3.3.
