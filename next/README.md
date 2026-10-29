# Caffoot Lite Next — development foundation only

This directory is the first **non-production** implementation checkpoint for issue #215. It is **not** the inventory application and does not yet expose the published v1.3.3 UI or inventory API. Authentication-related backend endpoints exist, but first-run setup and the complete user-facing account workflow are not ready. This is deliberate: serving the old HTML unmodified would leave browser storage authoritative and misrepresent migration readiness.

## HTTPS development deployment (not yet a complete application)

Set **your own** browser address and certificate identities before running Compose. Nothing is hard-coded for a particular installer. For example, in a local `.env` file alongside `compose.yaml`:

```dotenv
CAFFOOT_WEB_ADDRESS=https://10.128.20.3:8080
CAFFOOT_SERVER_ADDRESS=10.128.20.3
CAFFOOT_PORT=8080
```

Replace the example IP with your own. For an HTTPS reverse proxy, use the **external** browser origin (for example `https://inventory.example.uk`) and set `CAFFOOT_SERVER_ADDRESS` to the hostname or IP used by the proxy for the encrypted upstream connection. Never derive the trusted origin from client-supplied Host or forwarding headers. The web address and server address are required; the published port defaults to 8080 and must be between 1 and 65535; Compose refuses to start without them. Keep `.env` out of source control.

From the `next/` directory run `docker compose up --build -d`, then open `CAFFOOT_WEB_ADDRESS` in the browser. The development server currently provides only API endpoints, not a user interface. The health endpoint for direct access is `https://<server-address>:<published-port>/health`. The published port can be changed with `CAFFOOT_PORT`; the container always listens internally on port 8080. Include the published port in the browser address for direct access unless it is 443. For a reverse proxy, use the external HTTPS domain in `CAFFOOT_WEB_ADDRESS`, the application server IP/hostname in `CAFFOOT_SERVER_ADDRESS`, and the published host port in `CAFFOOT_PORT`. A self-signed certificate is generated once and stored under the persistent `/data/tls` volume path. A browser will not automatically trust it; verify the certificate identity/fingerprint out of band and establish trust before using real credentials. For a reverse proxy, configure HTTPS to the upstream and verify its certificate through an explicitly managed trust policy; do not assume plain HTTP upstream is supported.

To inspect the certificate fingerprint after startup, run this from the directory containing `compose.yaml`:

```sh
docker compose exec caffoot-next openssl x509 -in /data/tls/server.crt -noout -fingerprint -sha256 -subject -dates -ext subjectAltName
```

Compare the SHA-256 fingerprint against a separately trusted copy before trusting the certificate in your browser or reverse proxy. The certificate's Subject Alternative Name must include the IP address or hostname used to reach the Caffoot server. If you change `CAFFOOT_SERVER_ADDRESS` after first startup, the existing persisted certificate is **not** silently regenerated; inspect its identities and explicitly plan a safe replacement if required. Keep the private key private. A self-signed certificate is not publicly trusted merely because the application generated it.

The container's own HTTPS health check is a local liveness probe and does not establish external certificate trust. Do not delete the named data volume if retaining inventory or certificate identity.  The certificate is not automatically renewed; before expiry, plan a controlled certificate rotation and update client/proxy trust. Never delete the data volume as a certificate-rotation shortcut.

## Next gates

Complete and verify the published v1.3.3-compatible inventory import review, corrections, confirmation and atomic persistence; implement the central inventory API and published inventory UI behaviour; finish first-run administrator setup, user management, RBAC/MFA and simultaneous edit reservations. The schema, detached import-review groundwork and authentication-related backend components are partially implemented, not production-ready. Full regression evidence is required before release. The approved scope remains GitHub issue #215 and published v1.3.3.

## Schema checkpoint

The backend now applies a versioned SQLite schema transactionally on startup. Internal tables cover devices, subnets, VLANs, racks, accessories, IP allocations, inventory settings and change history. The JSON record columns deliberately retain variable and historical v1.3.3 fields while source-compatible projection and atomic import are implemented; this is not an alternative browser inventory store. The schema currently holds no imported data and exposes no inventory API.

The opt-in real Docker Compose lifecycle smoke test has passed in GitHub Actions, covering configurable published port, TLS certificate persistence and SQLite persistence after restart and container recreation. Full v1.3.3 UI and inventory compatibility remain unverified.

## Isolated inventory staging checkpoint

`backend/inventory.py` now contains an **offline-only** format gate, transactional staging writer and source-shaped reconstruction helper. It is intentionally **not exposed as an HTTP import endpoint** and is **not safe for live imports** until the complete published v1.3.3 normalisation, validation, Access Point review, correction and final confirmation sequence is implemented. Its low-level staging writer is for already-reviewed data and isolated tests only. It preserves optional top-level inventory settings and record JSON but deliberately excludes `caffootBackup` metadata from inventory storage. `tests/test_inventory.py` adds isolated round-trip, rejection and rollback cases. The automated inventory staging tests have passed in CI, including regression coverage that inventory staging leaves accounts, MFA, permissions and sessions unchanged. This is not evidence of a complete live import. A genuine private v1.3.3 export test still requires the fixture to be supplied explicitly.

## Published v1.3.3 import compatibility boundary

The source of truth is the **published** `v1.3.3` tag, particularly `app/caffoot-lite.html` (`createInventoryBackup`, `validateBackupVersion`, `normaliseImportedBackupAndPlanLegacyMountRepairs`, `planLegacyComputerMountingCorrections` and `findAccessPointMountConflictsInBackup`). Next accepts only backups freshly exported from published v1.3.3; users of earlier HTML versions must upgrade to v1.3.3 first.

Source inspection confirms that **v1.3.3 itself retains** both the legacy computer mounting review and the Access Point mounting review in its import path. A freshly exported, healthy v1.3.3 inventory ordinarily needs neither, but these safeguards must not be removed merely because older-version imports are unsupported. Preserve the source-ordered validation and explicit user review when a v1.3.3 export actually triggers them. Do **not** expand this into support for older backup formats or add new migration prompts. The detached review remains non-authoritative and cannot write to live inventory.

## Private genuine v1.3.3 export regression

The optional `tests/test_genuine_export.py` round-trip check covers all inventory collections, optional/historical fields, device ordering, and repeated staging against an actual exported backup. Keep the backup **outside the repository**. The test skips when the environment variable is unset (including normal GitHub Actions). The uploaded reference export is not published or embedded in source control. The test verifies only lossless staging/reconstruction, **not** the published UI import's full validation, review or confirmation sequence.
