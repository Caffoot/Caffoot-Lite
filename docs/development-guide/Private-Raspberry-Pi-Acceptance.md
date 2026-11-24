# Private Raspberry Pi Acceptance — Owner Runbook

**Development testing only.** Use this procedure for an explicitly authorised private acceptance build, not a production update or public release. The owner's 24 November 2026 SSH session recovered the existing checkout and successfully built the Stage 6.6 ARM64 image. The subsequent Portainer update was initiated; startup and functional acceptance are not yet confirmed.

## Fixed test boundary

- Existing checkout: `~/caffoot-stage2-bda35d`, on `milestone-1`. This supersedes the older checkout location in the [8 November runbook](https://github.com/Caffoot/Caffoot-Lite/issues/329#issuecomment-6725330707). Do not invent another checkout.
- Existing private Portainer stack: `caffoot-v21-private`, container `caffoot-v21-private-caffoot-lite-1`, HTTPS port 8445, named volume `caffoot-v21-private_caffoot-v21-private-data` at `/data`.
- Production: container `caffoot-lite`, HTTPS port 8443, named volume `caffoot-lite_caffoot_data` at `/data`. Production and every unrelated stack are out of scope.
- The owner confirmed the private test data is disposable for authorised testing. Preserve snapshots and matching images needed for any recovery rehearsal. Never delete production data, use global Docker pruning, or reuse the production mount.
- Keep the private stack's existing port, environment, TLS settings and data mapping when changing an image. Do not replace its definition with a generic installation template. Do not share environment secrets, IP addresses, private exports or credentials in evidence.

## 1. Read-only preflight

From the Pi SSH session, inspect only the relevant containers and their mounts:

```sh
docker ps -a --filter name=caffoot --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}'
docker inspect caffoot-v21-private-caffoot-lite-1 caffoot-lite --format '{{.Name}}{{range .Mounts}}{{printf "\n  %s: %s -> %s" .Type .Source .Destination}}{{end}}'
```

Both named volumes above were confirmed separate on 24 November. Repeat this check before future image updates. Stop if the stack identities, mounts or isolation differ. Check available storage and retain access to the matching old image. For data that needs preservation, use the [complete stopped-volume backup procedure](../how-tos/features-and-instructions/v2.2-draft/Legacy-Import-and-Docker-Upgrade.md#back-up-a-complete-installation) before updating.

## 2. The four familiar SSH commands

These exact four commands were recovered from the owner's SSH history and used again in Stage 6.6. Run them in order, checking the output of each rather than pasting them as an unconditional batch:

```sh
cd ~/caffoot-stage2-bda35d
git status --short --branch
git pull --ff-only origin milestone-1
python3 scripts/build_private_acceptance.py
```

**Mandatory revision gate between commands 3 and 4:** run `git rev-parse HEAD` and check the complete SHA against the explicitly authorised candidate. Confirm the checkout remains clean and on `milestone-1`. Stop on any mismatch, local changes or failed fast-forward; do not reset, force-pull or build the wrong revision.

The build helper uses the exact committed tree and embeds its full revision label. It produces a local `caffoot-lite:private-<first-12-characters-of-SHA>` image. It does not push an image, update Portainer or modify data volumes.

## 3. Verify the local image

For the Stage 6.6 candidate, the authorised revision was `68df336856b1a710c375b34f16b4bb3eae5689e6`. The owner ran:

```sh
docker image inspect caffoot-lite:private-68df336856b1 --format 'Architecture: {{.Architecture}} | Revision: {{index .Config.Labels "org.opencontainers.image.revision"}}'
```

Actual confirmed output:

```text
Architecture: arm64 | Revision: 68df336856b1a710c375b34f16b4bb3eae5689e6
```

For future builds substitute only the approved revision's short tag and compare the returned full SHA and `arm64`. Stop if either differs. Never assume an image has built merely because its tag was expected.

## 4. Update the existing private stack in Portainer

1. Open **Stacks → caffoot-v21-private → Editor**. Check the existing configuration and data mapping.
2. Replace only the existing `image:` line. For Stage 6.6 it was `image: caffoot-lite:private-519842b46861`, replaced by:

   ```yaml
   image: caffoot-lite:private-68df336856b1
   ```

3. Select **Update the stack**, leaving the image re-pull option disabled; this image exists locally. If Portainer reports a registry pull error, stop and investigate rather than publishing the image or switching to another stack.
4. After the update, inspect the containers and mounts again with the preflight commands. Verify the private image, running status, correct HTTPS endpoint and expected schema; sign in only after confirming the trusted certificate. Confirm production retains its original image and volume. Stop on migration, startup or isolation errors.

The remembered automatic SSH stack-update command was not recovered. The fourth recovered SSH command builds the image; it does not change the stack. Manual Portainer editing is the documented route. Do not guess a Portainer API call, Compose file location or an alternative automatic deployment command.

## 5. Acceptance and evidence

Record the exact commit, image revision, architecture, relevant native browser/device, pass/fail results and outstanding limitations. Use fictional records and sanitised results. Do not treat the image build as proof of successful migration, Portainer operation, Safari compatibility, or recovery. Obtain separate approval for any destructive recovery procedure, application correction, merge or publication.

Authority: [approved private testing arrangement](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6891505360), [Stage 6 plan](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7020041373), [Stage 6.5 sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7133639567). This guide records the recovered and used commands without claiming the remaining Stage 6.6 acceptance is complete.
