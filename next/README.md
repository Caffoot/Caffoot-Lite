# Caffoot Lite Next — development foundation only

This directory is the first **non-production** implementation checkpoint for issue #215. It is **not** the inventory application and does not yet expose the published v1.3.3 UI, authentication, or inventory API. This is deliberate: serving the old HTML unmodified would leave browser storage authoritative and misrepresent migration readiness.

## Local foundation smoke check

From this directory run `docker compose up --build -d` and check `http://127.0.0.1:8080/health`. Expected response: `{"status":"ok"}`. Run `docker compose down` to stop; the named `caffoot_data` volume remains. Do **not** use `docker compose down -v` when preserving data.

The bind is loopback-only for this early development checkpoint. This is **not** a public deployment recipe or a completed Portainer stack. No inventory import, user setup, login or UI is available yet.

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
