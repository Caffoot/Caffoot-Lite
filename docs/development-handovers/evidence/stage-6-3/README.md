# Stage 6.3 Complete-Volume Recovery Verification

24 November 2026 · [Owner authorisation](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7126354559) · [External Docker backup architecture](https://github.com/Caffoot/Caffoot-Lite/issues/215) · [PR #446](https://github.com/Caffoot/Caffoot-Lite/pull/446)

## Sources And Environment

| Image source | SQLite schema | Local image ID |
| --- | ---: | --- |
| Published v2.1 [`c3237114108cad9f7d4e57657b6aed5e0091a5ef`](https://github.com/Caffoot/Caffoot-Lite/commit/c3237114108cad9f7d4e57657b6aed5e0091a5ef) | 10 | `sha256:9c44356190eeb36255953a04d71dd1fb1d6546eb3e401ef26cd44a65dee5256d` |
| Authorised v2.2 review source [`5645bc4f91b8090a3eef62673c817bfaa6b10966`](https://github.com/Caffoot/Caffoot-Lite/commit/5645bc4f91b8090a3eef62673c817bfaa6b10966) | 28 | `sha256:5a2f2dbb59730137c3f357af1c8a0b5ccd8df04ba4d34b1e90372aba7cdf7294` |

Both repository Dockerfiles were built locally with the full revision label. The first build could not validate Alpine's TLS endpoint until the workspace CA bundle was supplied via the existing `proxy_ca` build secret. The rehearsal inspected both labels and used the local image IDs. Host Linux x86_64, Docker Engine and client 29.9.2, Compose 2.40.3, container Python 3.12.16 and SQLite 3.53.4. The rootless daemon was selected explicitly via `unix:///var/run/docker.sock`.

Compose used distinct projects and local Docker-managed named volumes, plus a fresh host bind directory for the focused mapping check. Each application container had one inspected `/data` mount and a loopback-only published HTTPS port. Backup helpers had networking disabled. The stack supplied `TZ=Europe/London` separately from the restored data. SMTP retained fictional credentials and a loopback endpoint with no receiver. No outbound mail was sent.

## Earlier Evidence Reused

- Issue #335's corrected run passed full matching-image rollback to published v2.0.3 after a schema-7 → 10 upgrade. Its first attempt failed because extraction added an extra directory. [Historical report](../issue-335/Report.md)
- Batch 05 proved restoration of the complete pre-upgrade schema-10 snapshot with v2.1 after a historical schema-11 upgrade. The later test pinned in the rehearsal guide targets schema 12 and contains Stage 1-specific role checks. This run reused the fictional v2.1 fixture, file-manifest helper and isolated Compose lifecycle approach. [Batch 05 report](../milestone-01-batch-05/Report.md) · [Historical harness guide](../../../development-guide/Upgrade-And-Restore-Rehearsal.md)
- Stage 6.2 proved schema-10 → 28 migration on `2107de3668b08c5abdfdae6fe231a3114bbfc380`, including preserved legacy records and the expected session and proof revocations. In the completed run, the authorised image migrated one copy to create the schema-28 source. The original stopped schema-10 volume remained available for comparison. [Stage 6.2 upgrade result](../stage-6-2/schema-10-to-28.txt) · [Owner sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7126014203)

## Rehearsal Results

| Scenario | Observed result |
| --- | --- |
| Stopped archives and exact recovery | Schema 28 matched across 57 tables and 9 filesystem paths. Schema 10 matched across 17 tables and 9 paths. Compared type-aware SHA-256 digests of every ordered row and BLOB, the schema, file hashes, relative paths, permissions and numeric ownership. SQLite integrity and foreign keys passed before and after restoration. |
| Installation files | The database, TLS certificate and key, SMTP settings, account-email key and a hidden fixture directory matched. The private TLS key, SMTP file and account-email key retained mode `0600` and owner/group `10001:10001` in the container. Neither stopped snapshot contained a SQLite sidecar. |
| Schema-28 records | Recovered Devices, linked IPAM, a placed rack server, Staff and Departments, device assignment and history, a stock receipt and Department issue, Supplier relationships and a purchasing issue, Lifecycle dates, account profiles, role grants and MFA. Service Desk retained ticket identity, private and employee-visible messages, two closure attempts and reporting preferences. Published template wording and the branding logo were present. |
| Schema-28 application and persistence | Trusted loopback HTTPS preserved the saved TLS fingerprint. Administrator and Reader MFA sign-in, anonymous denial, disabled-account and missing-MFA denial, employee access, unrelated-account denial and private IT notes were checked before and after restart and recreation. Authorised text and PNG downloads matched the original bytes. All table digests and non-database files matched again with the probe sessions signed out. |
| Schema-10 rollback | The complete pre-upgrade archive was restored into a fresh named volume and started with the matching published v2.1 image. HTTPS, MFA, inventory, profile photo, restricted settings and recreation passed. The original source volume’s rows and files were unchanged. |
| Bind mount and optional features | The named-volume restore retained Racks and Equipment Lifecycle switched off, and their data stayed intact. Restoring the same archive to a new bind directory matched ownership, modes and contents before startup. Re-enabling the features on that copy exposed the saved rack and Lifecycle records, with all unrelated table digests preserved. |

Docker reported exit 137 after stopping the quiescent test containers. Each archive was read only after Docker confirmed the service had stopped. SQLite integrity and exact data comparisons establish consistency for these stopped snapshots. An in-flight writer or sidecar recovery scenario was outside the observed run.

The first Docker attempt stopped during the restored-schema-28 functional checks because the harness omitted the feature-setting response envelope. Its disposable resources were removed. The corrected assertions passed against a temporary fictional fixture before the completed Docker run. The final Docker exercise passed, along with 11 focused attachment and optional-feature tests, both draft Compose/Portainer configuration validations and the release documentation consistency check. [Safe run output](rehearsal.txt)

The rehearsal containers, networks, volumes and archives were removed. The temporary bind directory, fictional fixture data and both local rehearsal images were also removed.

## Run The Check

From this repository, build the two pinned local images using `--build-arg CAFFOOT_SOURCE_REVISION=<full-source-revision>` and your own local tags. Set the two variables below to those local tags. The opt-in test uses only the local daemon and generates and removes its own projects, volumes and bind directory.

```sh
CAFFOOT_STAGE63_RECOVERY=1 \
CAFFOOT_V21_TEST_IMAGE=caffoot-stage63:v21 \
CAFFOOT_V22_TEST_IMAGE=caffoot-stage63:v22 \
python -m unittest discover -s tests -p test_stage_6_3_recovery.py -v
```

[Executed harness](../../../../tests/test_stage_6_3_recovery.py) · [Fictional fixture](../../../../tests/fixtures/stage_6_3_recovery.py) · [Draft administrator guide](../../../how-tos/features-and-instructions/v2.2-draft/Legacy-Import-and-Docker-Upgrade.md#back-up-a-complete-installation)

## Limits And Acceptance

Native Raspberry Pi, Safari, Portainer UI, off-host backup tooling and private installation recovery remain unverified here. The two private export checks from Stage 6.2 remain deferred. Repeat affected coverage after relevant #431 changes. Final-head hosted checks are for independent review. Owner merge approval and any release or deployment approval are separate gates.
