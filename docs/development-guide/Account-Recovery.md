# Account Recovery — Caffoot Lite v2.1

These controls are included in the published v2.1 application. The implementation and acceptance history is recorded in [issue #282](https://github.com/Caffoot/Caffoot-Lite/issues/282); they were not part of v2.0.3.

On `milestone-1`, recovery uses the same [shared role policy](Role-Permissions.md) as sign-in and live sessions. Wider Read or Edit access, any enabled additional role, Administrator status or retained voluntary enrolment requires authenticator proof. Recovery cannot bypass pending MFA enrolment. Schema 11 preserves email data and challenges but revokes every old application session. This intermediate development branch is not ready to deploy; Batch 02 adds password-verified pre-login enrolment without granting a session. Confirmation and eligible voluntary MFA removal revoke all own sessions and outstanding email proofs. The later sign-in/My Account interface integration remains pending. See the [MFA operations](Role-Permissions.md#existing-account-mfa-operations).

## Normal Recovery

Email remains optional. In **My Account → Personal Details**, save an email address and check the **Verified / Not Verified** status beside it. An edited address must be saved before verification. Choose **Verify Email**, confirm your current password and request a confirmation code. The code field appears after the request response. Enter the eight-digit emailed code, including any leading zeroes, to verify ownership; a new request replaces the previous code. Codes expire after fifteen minutes and work once. Changing the saved address removes verification. Cancel clears the password and code fields.

On Sign In, choose **Forgot Password?** and enter your **username**. Recovery does not look up email addresses. The page shows progress immediately, then the same neutral response for every completed request. It reveals the recovery-code, new-password and authenticator fields together. Enter all eight recovery-code digits; ordinary copy/paste trims surrounding whitespace and preserves leading zeroes. Enter your authenticator code if your account requires it. **Request Another Code** returns to the username step; **Back To Sign In** clears the recovery fields. A successful reset revokes existing sessions and retains normal sign-in and authenticator protection.

Mail requires an active account, a saved verified email and configured outgoing delivery. A neutral response does not confirm eligibility or delivery. A full queue or SMTP failure can prevent a message from arriving. Successful SMTP test mail does not establish recovery eligibility. Check private account verification and provider delivery records without sharing addresses, credentials or codes in public issues. Without configured delivery or a verified address, contact an administrator. Losing both an administrator password and authenticator cannot be solved by email recovery.

## Eight-Digit Security And Upgrade

Schema 10 replaces the previous long email proofs with eight-digit codes bound to unique opaque challenges. Upgrading deliberately invalidates outstanding old-format verification/recovery codes: request a new code after upgrading. Inventory, accounts, permissions and unrelated sessions are preserved.

Codes expire after 15 minutes and work once. Five failed code/MFA confirmations exhaust the challenge. A separate durable account/purpose budget allows at most five failures in a rolling 15-minute window, across requests, resends, peers and server restarts. Resending replaces the old code/challenge without resetting that budget. Wait for failures to leave the window before requesting a usable replacement. Existing peer/request throttles also remain. Normal sign-in is not disabled by a failed email-code budget.

SQLite contains only a keyed digest and challenge metadata, never a plain code. The private 32-byte `account-email-secret.key` beside SQLite must be backed up with the **entire** private data directory, including SMTP configuration and TLS. Keep it a private regular file with mode 0600. Do not copy it into the application image, publish it, or replace it while live challenges remain. If it is lost, restore the matching private backup; do not delete data or edit SQLite to bypass confirmation. The application refuses unusable or publicly readable secret files.

The owner verified real email-address confirmation on an earlier private build. That individual check did not establish full Forgot Password delivery, confirmation, reset, required MFA and subsequent sign-in. Consult the v2.1 release and recorded checks for later evidence; do not interpret this earlier result as comprehensive acceptance.

## Last-Resort Sole-Administrator Recovery

This procedure requires authorised access to the Docker host. It preserves the existing administrator identity, other accounts, permissions and inventory. It revokes that administrator's sessions and edit reservations and requires a new, confirmed authenticator before sign-in. It records a protected audit event. There is no public recovery URL or HTTP bypass.

1. Identify the actual existing data volume or bind mount attached at `/data`. Do not change that mapping.
2. Stop Caffoot Lite. Back up and verify the **entire** persistent data directory, including SQLite, SMTP settings, the email-proof secret and TLS files. Protect the backup as credential-bearing data. Do not run the recovery command alongside a running application.
3. Use the same application image version as the installation and its existing database. For a named volume, replace both placeholders with the actual existing values:

```sh
docker run --rm -it --network none \
  --mount type=volume,src=ACTUAL_VOLUME_NAME,dst=/data \
  --entrypoint python IMAGE_IN_USE -m backend.recover_admin
```

For an existing bind mount, replace the mount argument with:

```text
--mount type=bind,src=/absolute/existing/data,dst=/data
```

4. Enter the exact sole administrator username, type `RECOVER`, and enter the replacement password twice. The command refuses an unknown identity or more than one administrator. It does not create a database or a replacement account.
5. Restart the normal application with the unchanged data mapping. Resume administrator setup using the replacement credentials, enrol a **new** authenticator, confirm its code and then sign in. The previous authenticator no longer works.
6. Review the protected Audit Trail and verify that the original accounts and inventory remain present. Keep the backup until recovery has been checked.

An operator who cannot establish the correct data location or sole-administrator identity should stop and seek assistance. Do not delete the volume, edit SQLite by hand, remove MFA checks or expose an unauthenticated recovery service.
