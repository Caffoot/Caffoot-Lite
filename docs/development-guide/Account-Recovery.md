# Account Recovery — Private v2.1 Acceptance

These controls belong to the Issue #282 development branch. They are not a claim that v2.0.3 has email recovery.

## Normal Recovery

Email remains optional. With outgoing mail configured, save an email address in My Account and use **Verify Email Address**. Supply your current password, request the confirmation code and enter the emailed code. Codes expire after fifteen minutes and work once. Changing the address removes verification.

On Sign In, expand **Need Help Signing In?** to request a recovery code. Enter that code, a new password and your authenticator code if your account uses MFA. Recovery invalidates existing sessions and retains authenticator protection. A generic response protects account privacy. Without configured delivery or a verified address, contact an administrator. Losing both an administrator password and authenticator cannot be solved by email recovery.

## Last-Resort Sole-Administrator Recovery

This procedure requires authorised access to the Docker host. It preserves the existing administrator identity, other accounts, permissions and inventory. It revokes that administrator's sessions and edit reservations and requires a new, confirmed authenticator before sign-in. It records a protected audit event. There is no public recovery URL or HTTP bypass.

1. Identify the actual existing data volume or bind mount attached at `/data`. Do not change that mapping.
2. Stop Caffoot Lite. Back up and verify the **entire** persistent data directory, including SQLite, SMTP settings and TLS files. Protect the backup as credential-bearing data. Do not run the recovery command alongside a running application.
3. Use the same acceptance image and already-upgraded database. For a named volume, replace both placeholders with the actual existing values:

```sh
docker run --rm -it --network none \
  --mount type=volume,src=ACTUAL_VOLUME_NAME,dst=/data \
  --entrypoint python ACCEPTANCE_IMAGE -m backend.recover_admin
```

For an existing bind mount, replace the mount argument with:

```text
--mount type=bind,src=/absolute/existing/data,dst=/data
```

4. Enter the exact sole administrator username, type `RECOVER`, and enter the replacement password twice. The command refuses an unknown identity or more than one administrator. It does not create a database or a replacement account.
5. Restart the normal application with the unchanged data mapping. Resume administrator setup using the replacement credentials, enrol a **new** authenticator, confirm its code and then sign in. The previous authenticator no longer works.
6. Review the protected Audit Trail and verify that the original accounts and inventory remain present. Keep the backup until recovery has been checked.

An operator who cannot establish the correct data location or sole-administrator identity should stop and seek assistance. Do not delete the volume, edit SQLite by hand, remove MFA checks or expose an unauthenticated recovery service.
