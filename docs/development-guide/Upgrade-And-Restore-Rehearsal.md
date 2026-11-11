# Isolated Upgrade And Restore Rehearsal

This development check starts published v2.1 (schema 10), creates a fictional
installation, upgrades it to schema 11, then restores the whole saved directory
before starting the matching v2.1 image. It does not use an owner's installation
or establish that a production backup exists. Stage 1 remains under review.

## Run The Check

Use the local development Docker daemon, with Compose available. Build two
private images using the repository Dockerfile: one from the exact published
`v2.1` source and one from the application checkpoint under review. Set each
image's `CAFFOOT_SOURCE_REVISION` build argument to its full source commit.
Retain the build output and image IDs. Do not publish these images. Where a
development proxy requires a certificate, supply it through the Dockerfile's
existing `proxy_ca` build secret rather than modifying the image.

Set the following values to those local images and verified revisions:

```sh
CAFFOOT_UPGRADE_RESTORE=1 \
CAFFOOT_V21_TEST_IMAGE=caffoot-batch05:v21 \
CAFFOOT_UPGRADE_TEST_IMAGE=caffoot-batch05:v11 \
CAFFOOT_V21_TEST_REVISION=c3237114108cad9f7d4e57657b6aed5e0091a5ef \
CAFFOOT_UPGRADE_TEST_REVISION=689afd827ef3192379b6baf7ef6d289d8f73da04 \
python -m unittest discover -s tests -p 'test_upgrade_restore.py' -v
```

These revisions identify this rehearsal's original application inputs, not a
future release. Use the actual revisions if reviewing different application
source. The test verifies image labels before creating data. Images are built
locally from those sources; it does not certify a registry image digest or ARM64.

The test selects a free loopback port and a unique `caffoot-restore-…` Compose
project, creates its own data and backup volumes, and removes that project and
its volumes afterwards. It explicitly selects the managed local Docker socket;
it never accepts a production mount or remote Docker endpoint. The generated
Compose service uses the documented image/environment/port/persistent-volume
deployment method. No Raspberry Pi or Portainer configuration is changed.

## What Is Compared

- The fixture uses the published application's own account, password, session,
  inventory, email-proof and SMTP settings helpers. Eight fictional accounts
  cover Administrator, disabled, Read, Edit and no grants; absent, pending,
  confirmed and voluntary MFA; verified/unverified email and account history.
  Five live stored sessions exist before upgrade.
- Before backup, the application is stopped. Every table is read in row order,
  including binary values. SQLite integrity and foreign-key checks must pass.
  Every file/directory has its relative path, SHA-256 where applicable, mode,
  UID and GID recorded. Raw snapshots remain in memory and are not logged.
- A tar archive of the complete stopped `/data` is saved in the separate test
  backup volume. It includes SQLite, SMTP credentials, the email-proof key and
  actual generated TLS certificate/private key, with original ownership/modes.
- After upgrade, all old table rows are identical except the expected migration
  record and removal of all sessions. Exactly four role tables are added;
  grants become exact overrides and all eight accounts receive Staff Member.
  Private files remain identical. Unenrolled/pending Read cannot sign in before
  enrolment; no-grant Staff is denied inventory, and missing grants can later
  inherit from an explicitly assigned role. A second startup is unchanged.
- With the application stopped, only the newly generated test data volume is
  cleared and restored. Every row, file hash, mode and owner must match the
  original snapshot, both before and after starting the matching v2.1 image.
  A restored legacy Read account must sign in successfully.

Transactional migration failure, fresh first-administrator setup, the exhaustive
216-account grant/state matrix and new-session preservation on repeated v11
initialisation remain covered by `test_role_migration.py`. This container check
adds full-directory restoration; it does not replace those tests or browser,
permission, concurrency, MFA and email regression checks.

## Before Any Future Real Upgrade

The owner must independently confirm all of the following before a separately
authorised deployment:

1. Identify the actual existing `/data` mount (including any stack prefix),
   HTTPS origin, ports, environment, secrets and exact matching v2.1 image.
   Retain that image and stack configuration so rollback is possible.
2. Make a fresh, consistent, protected backup of **all** private `/data`, using
   a stopped-container copy or a suitable SQLite-aware backup process. Include
   SQLite sidecars where present, SMTP configuration, `account-email-secret.key`,
   TLS/private keys and other installation files, preserving ownership/modes.
   Keep a protected copy outside the Docker host.
3. Restore that backup into a separate isolated installation with its matching
   image. Verify sign-in/MFA, inventory, account profiles, permissions, history,
   HTTPS identity and private files. Record the successful restore; this
   fictional rehearsal cannot supply that evidence for another installation.
4. Review the schema-11 all-session sign-out and newly mandatory Read MFA with
   users. Change only the authorised image in the established stack, preserving
   its actual storage and configuration. The owner's private acceptance stack
   on port **8445** is not changed by this procedure or this batch.
5. If rollback is needed, stop the new application, preserve its data separately
   if needed, then restore the **complete matching pre-upgrade directory and
   v2.1 image together**. Never start v2.1 against schema 11. Changes after the
   backup are not recovered by restoring it. Inventory JSON cannot restore
   accounts, MFA, SMTP or TLS identity.

See [Installation](../../INSTALLATION.md#external-backup-and-recovery-of-your-docker-installation),
[Role Permissions](Role-Permissions.md#backup-and-rollback) and the
[Batch 05 evidence](../development-handovers/evidence/milestone-01-batch-05/Report.md).
