# Caffoot Lite Next — unreleased development build

Caffoot Lite Next implements the approved central SQLite inventory application from [issue #215](https://github.com/Caffoot/Caffoot-Lite/issues/215). It serves the established v1.3.3 inventory interface with backend persistence, first-run administrator setup, MFA, administrator-managed users and device edit reservations. The supported v1.3.3 JSON backup import is a one-way migration, not an ongoing backup system. This is **not yet a published release**; broader acceptance and Raspberry Pi 5 testing remain outstanding.

## HTTPS Docker Compose / Portainer setup

Set **your own** browser address and certificate identities before running Compose. Nothing is hard-coded for a particular installer. For example, in a local `.env` file alongside `compose.yaml`:

```dotenv
CAFFOOT_WEB_ADDRESS=https://10.128.20.3:8080
CAFFOOT_SERVER_ADDRESS=10.128.20.3
CAFFOOT_PORT=8080
```

Replace the example IP with your own. For an HTTPS reverse proxy, use the **external** browser origin (for example `https://inventory.example.uk`) and set `CAFFOOT_SERVER_ADDRESS` to the hostname or IP used by the proxy for the encrypted upstream connection. Never derive the trusted origin from client-supplied Host or forwarding headers. The web address and server address are required; the published port defaults to 8080 and must be between 1 and 65535; Compose refuses to start without them. Keep `.env` out of source control.

From the `next/` directory run `docker compose up --build -d`, then open `CAFFOOT_WEB_ADDRESS` in the browser. The application serves the inventory interface at `/inventory` and administrator/account setup at `/setup`. The health endpoint for direct access is `https://<server-address>:<published-port>/health`. The published port can be changed with `CAFFOOT_PORT`; the container always listens internally on port 8080. Include the published port in the browser address for direct access unless it is 443. For a reverse proxy, use the external HTTPS domain in `CAFFOOT_WEB_ADDRESS`, the application server IP/hostname in `CAFFOOT_SERVER_ADDRESS`, and the published host port in `CAFFOOT_PORT`. A self-signed certificate is generated once and stored under the persistent `/data/tls` volume path. A browser will not automatically trust it; verify the certificate identity/fingerprint out of band and establish trust before using real credentials. For a reverse proxy, configure HTTPS to the upstream and verify its certificate through an explicitly managed trust policy; do not assume plain HTTP upstream is supported.

To inspect the certificate fingerprint after startup, run this from the directory containing `compose.yaml`:

```sh
docker compose exec caffoot-next openssl x509 -in /data/tls/server.crt -noout -fingerprint -sha256 -subject -dates -ext subjectAltName
```

Compare the SHA-256 fingerprint against a separately trusted copy before trusting the certificate in your browser or reverse proxy. The certificate's Subject Alternative Name must include the IP address or hostname used to reach the Caffoot server. If you change `CAFFOOT_SERVER_ADDRESS` after first startup, the existing persisted certificate is **not** silently regenerated; inspect its identities and explicitly plan a safe replacement if required. Keep the private key private. A self-signed certificate is not publicly trusted merely because the application generated it.

The container's own HTTPS health check is a local liveness probe and does not establish external certificate trust. Do not delete the named data volume if retaining inventory or certificate identity.  The certificate is not automatically renewed; before expiry, plan a controlled certificate rotation and update client/proxy trust. Never delete the data volume as a certificate-rotation shortcut.

## Verification status

The existing backend checks and focused HTTPS/Chromium test run in GitHub Actions. They cover first-run MFA, central inventory and Change History, user creation and access permissions, competing device edit reservations, familiar Devices/IPAM/Racks forms, Clean Start and a real v1.3.3 backup created by the published exporter. These checks do not yet prove all published v1.3.3 interactions or Raspberry Pi 5 performance.

The existing `tests/test_compose_lifecycle.py` is an **opt-in** Docker milestone test. Run the `Next Docker Compose lifecycle` GitHub Actions workflow manually at an integration milestone to verify published port configuration, persistent SQLite data and TLS certificate continuity across restart and recreation. A real Raspberry Pi 5/Portainer acceptance test is still required before release.

## Published v1.3.3 import compatibility boundary

The source of truth is the **published** `v1.3.3` tag, particularly `app/caffoot-lite.html` (`createInventoryBackup`, `validateBackupVersion`, `normaliseImportedBackupAndPlanLegacyMountRepairs`, `planLegacyComputerMountingCorrections` and `findAccessPointMountConflictsInBackup`). Next accepts only backups freshly exported from published v1.3.3; users of earlier HTML versions must upgrade to v1.3.3 first.

Published v1.3.3 retains both the legacy computer mounting review and the Access Point mounting review in its import path. A freshly exported, healthy v1.3.3 inventory ordinarily needs neither, but these safeguards must not be removed merely because older-version imports are unsupported. Preserve the source-ordered validation and explicit user review when a v1.3.3 export actually triggers them. Do **not** expand this into support for older backup formats or add new migration prompts. The live Next import retains the published reviews and requires explicit confirmation before replacing inventory in a SQLite transaction.

## Private genuine v1.3.3 export regression

The optional `tests/test_genuine_export.py` round-trip check covers all inventory collections, optional/historical fields, device ordering, and repeated staging against an actual exported backup. Keep the backup **outside the repository**. The test skips when the environment variable is unset (including normal GitHub Actions). The uploaded reference export is not published or embedded in source control. The test verifies only lossless staging/reconstruction, **not** the published UI import's full validation, review or confirmation sequence.
