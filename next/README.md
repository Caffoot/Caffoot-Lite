# Caffoot Lite Next — development foundation only

This directory is the first **non-production** implementation checkpoint for issue #215. It is **not** the inventory application and does not yet expose the published v1.3.3 UI, authentication, or inventory API. This is deliberate: serving the old HTML unmodified would leave browser storage authoritative and misrepresent migration readiness.

## HTTPS development deployment (not yet a complete application)

Set **your own** browser address and certificate identities before running Compose. Nothing is hard-coded for a particular installer. For example, in a local `.env` file alongside `compose.yaml`:

```dotenv
CAFFOOT_WEB_ADDRESS=https://10.128.20.3:8080
CAFFOOT_SERVER_ADDRESS=10.128.20.3
CAFFOOT_PORT=8080
```

Replace the example IP with your own. For an HTTPS reverse proxy, use the **external** browser origin (for example `https://inventory.example.uk`) and set `CAFFOOT_SERVER_ADDRESS` to the hostname or IP used by the proxy for the encrypted upstream connection. Never derive the trusted origin from client-supplied Host or forwarding headers. The web address and server address are required; the published port defaults to 8080 and must be between 1 and 65535; Compose refuses to start without them. Keep `.env` out of source control.

Run `docker compose up --build -d`, then open `CAFFOOT_WEB_ADDRESS` in the browser. The development server currently provides only API endpoints, not a user interface. The health endpoint for direct access is `https://<server-address>:<published-port>/health`. The published port can be changed with `CAFFOOT_PORT`; the container always listens internally on port 8080. Include the published port in the browser address for direct access unless it is 443. For a reverse proxy, use the external HTTPS domain in `CAFFOOT_WEB_ADDRESS`, the application server IP/hostname in `CAFFOOT_SERVER_ADDRESS`, and the published host port in `CAFFOOT_PORT`. A self-signed certificate is generated once and stored under the persistent `/data/tls` volume path. A browser will not automatically trust it; verify the certificate identity/fingerprint out of band and establish trust before using real credentials. For a reverse proxy, configure HTTPS to the upstream and verify its certificate through an explicitly managed trust policy; do not assume plain HTTP upstream is supported.

The container's own HTTPS health check is a local liveness probe and does not establish external certificate trust. Do not delete the named data volume if retaining inventory or certificate identity. Full deployment testing and certificate lifecycle documentation remain outstanding.

## Next gates

Add the source-compatible inventory schema/projection and atomic v1.3.3 import, followed by existing inventory operations, authentication/RBAC/MFA and edit reservations, with full regression evidence before release. The approved scope remains GitHub issue #215 and published v1.3.3.

## Schema checkpoint

The backend now applies a versioned SQLite schema transactionally on startup. Internal tables cover devices, subnets, VLANs, racks, accessories, IP allocations, inventory settings and change history. The JSON record columns deliberately retain variable and historical v1.3.3 fields while source-compatible projection and atomic import are implemented; this is not an alternative browser inventory store. The schema currently holds no imported data and exposes no inventory API.

Run schema tests from `next/` with `python -m unittest discover -s tests -v` (Python 3.12 with SQLite JSON support). These tests check schema repeatability, forward-version refusal and basic constraints; they do **not** establish import compatibility. Docker smoke and compatibility checks remain pending until executed.

## Isolated inventory staging checkpoint

`backend/inventory.py` now contains an **offline-only** format gate, transactional staging writer and source-shaped reconstruction helper. It is intentionally **not exposed as an HTTP import endpoint** and is **not safe for live imports** until the complete published v1.3.3 normalisation, validation, Access Point review, correction and final confirmation sequence is implemented. Its low-level staging writer is for already-reviewed data and isolated tests only. It preserves optional top-level inventory settings and record JSON but deliberately excludes `caffootBackup` metadata from inventory storage. `tests/test_inventory.py` adds isolated round-trip, rejection and rollback cases. Neither these tests nor the genuine fixture have been executed against this new code yet.

## Private genuine v1.3.3 export regression

The opt-in `tests/test_genuine_export.py` round-trip test checks all inventory collections, optional/historical fields, device ordering, and repeated staging against an actual exported backup. Keep the backup **outside the repository**. From `next/`, run:

```sh
CAFFOOT_V133_FIXTURE=/absolute/path/to/private-v1.3.3-backup.json python -m unittest discover -s tests -v
```

The test skips when the environment variable is unset (including normal GitHub Actions). The uploaded reference export is not published or embedded in source control. The test verifies only lossless staging/reconstruction, **not** the published UI import's full validation, review or confirmation sequence.
