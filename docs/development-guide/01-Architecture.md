# 01 — Architecture

## In simple terms

The Docker version of Caffoot Lite is a small web application, not a collection of separate services. A browser opens the application's HTTPS page; the Python server serves that page and processes its requests; SQLite stores the shared inventory and account details. A Portainer stack or Docker Compose configuration starts the same application.

## The implemented pieces

| Part | Source | Responsibility |
| --- | --- | --- |
| Container image | [`Dockerfile`](../../Dockerfile) | Python 3.12 Alpine image, copies the backend, browser pages and selected assets; runs as UID/GID 10001 |
| Local build/Compose | [`compose.yaml`](../../compose.yaml) | Builds the application, maps a configurable host port and mounts persistent `/data` |
| Portainer deployment example | [`portainer-v2.1.yaml`](../../portainer-v2.1.yaml) | Uses the published versioned ARM64/AMD64 application image with persistent `/data` storage |
| HTTP/HTTPS server | [`backend/server.py`](../../backend/server.py) | Python standard-library `ThreadingHTTPServer`, route dispatch, SQLite connections |
| Pages | [`setup.html`](../../setup.html) and [`inventory.html`](../../inventory.html) | Account setup/sign-in and familiar inventory screens |
| Backend domain modules | [`backend/`](../../backend/) | Authentication, authorisation, inventory operations, validation and import |
| Durable storage | [`backend/schema.py`](../../backend/schema.py) | SQLite tables under the persistent mount |

The server listens on **HTTPS on internal port 8080**. `CAFFOOT_PORT` controls the **host-published port** in the Compose/Portainer deployment. They are different settings.

## A request through the application

The `milestone-1` branch shares account access and MFA decisions through `backend/role_policy.py`. The server, permissions, authentication, sessions and recovery call that policy over the four schema-11 role tables. The old permission table is historical only. See [Shared Roles And Account Permissions](Role-Permissions.md); the branch remains an intermediate development build, pending later interface batches. Existing-account pre-login enrolment and voluntary MFA removal reuse the account services, shared policy, TOTP verifier and SQLite write transactions; they create no restricted session or separate authentication system. `backend/roles.py` uses that same policy for administrator impact previews and confirmation. Preview simulation is rolled back; confirmed values, history and affected revocation commit together. Optional existing security email is queued only afterwards. No schema, interface or deployment change is added by Batch 03.

1. The browser loads `/setup` for initial account setup or sign-in, then `/inventory` for inventory.
2. `server.py` serves the browser files and checks the session on API requests.
3. A modifying API request must satisfy the authenticated session, configured origin, CSRF proof and relevant section permissions.
4. The handler calls the appropriate domain module. Inventory save modules validate the record, its dependencies and edit reservation where applicable.
5. The SQLite transaction either commits the affected records or rolls back. The interface refreshes its view of the shared data.

The browser still maintains temporary display/form state and personal appearance choices; it does **not** own a second authoritative inventory.

## Persistence and deployment

- The database normally lives at `/data/caffoot.sqlite3` (`CAFFOOT_DB_PATH` in the image); generated TLS material is persisted under `/data/tls`.
- The local Compose file uses `CAFFOOT_DATA_PATH` to select either a host folder or the default Docker volume. The versioned Portainer example uses a Docker-managed named volume by default; existing installations must retain their actual `/data` mapping.
- `CAFFOOT_WEB_ADDRESS` is the exact external **HTTPS origin** used in the browser, including an unusual port when applicable.
- `CAFFOOT_SERVER_ADDRESS` is the hostname or IP identity used for the application's TLS certificate. A proxy's public name and the backend server identity may differ.
- `CAFFOOT_PORT` defaults to 8080 for the host-published port; the container remains on port 8080.
- A first-start self-signed certificate is generated and persisted; installers must verify its identity/fingerprint and establish trust. A reverse proxy must also connect to the backend over HTTPS, with upstream certificate trust handled explicitly.

See [installation and certificate instructions](../../INSTALLATION.md). That document contains examples rather than hard-coded defaults for your own network.

## Boundaries worth preserving

The architecture is deliberately modest. There is one central SQLite inventory, not a browser authoritative copy or an extra recovery database. Existing Devices/IPAM/Racks outcomes come from the published v1.3.3 baseline. The released v2.1 application also includes modular HTML/CSS/JavaScript presentation, personal profiles/photos, administrator SMTP configuration, verified-email recovery and protected Audit Trail views. These use the same server and SQLite data, not a second application. The v1.3.3 backup import is a migration workflow, not an ongoing app backup service.

### Related reading

[Database](02-Database.md) · [Frontend and API](03-Frontend-and-Backend.md) · [Authentication](04-Authentication-and-Permissions.md) · [Tests](08-Testing-and-Maintenance.md)
