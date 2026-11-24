# Issue #450 — HTTPS Listen Queue Investigation

24 November 2026. Baseline `68df336856b1a710c375b34f16b4bb3eae5689e6`; [native failure and owner-authorised investigation](https://github.com/Caffoot/Caffoot-Lite/issues/450). Private Pi logs and configuration are not included.

## Reproduced symptom and transport experiment

The ARM64 private candidate failed to load required styles through its existing HTTPS reverse proxy. The upstream TLS handshake resets coincided with namespace-wide listen-overflow and listen-drop counters rising from 216 to 295 during one failed reload. The runtime reported a listen queue of five.

An isolated local transport experiment used Python 3.13.5, OpenSSL 3.5.5, Linux loopback, a fictional self-signed certificate trusted by the client, a minimal HTTP handler, the production pattern of wrapping the listening socket, and 21 simultaneous HTTPS clients. One raw connection deliberately held the TLS accept path for 150 ms; the clients used a 750 ms timeout. This is a controlled synthetic burst, not a measurement of Pi performance or the complete app.

| Run | Standard queue of 5, HTTP 200 | Explicit queue of 64, HTTP 200 |
| --- | ---: | ---: |
| 1 | 6/21 | 21/21 |
| 2 | 7/21 | 21/21 |
| 3 | 7/21 | 21/21 |

All remaining baseline requests timed out. The only server difference was the subclass's request_queue_size value. The result supports the queue saturation hypothesis and justifies evaluating a bounded 64-entry backlog, with headroom over the loader's 21-style burst. The exact Pi TLS failure still requires native retest.

## Candidate and proposed regression

Keep the existing ThreadingHTTPServer, TLS context, certificate policy, HTTP handler and startup sequence. Set the backlog before bind/listen through a local subclass at production startup. No new dependencies, TLS options, proxy changes, user-interface retries or new worker model. This candidate does not remedy a permanently stalled TLS handshake on the existing synchronous accept path; it tests burst capacity under a brief controlled stall only. If native evidence shows the queue correction is insufficient, return to #450 for an evidence-led decision on handshake handling.

The added regression captures the server built by the actual startup function, holds one incomplete handshake while queuing 21 TCP connections, then releases it and retrieves all required styles through certificate-verified HTTPS using a fictional MFA-authenticated account. It compares actual file bytes, checks anonymous denial, health and plaintext HTTP rejection. The existing smoke tests remain unchanged.

**Verification boundary:** the isolated transport experiment ran successfully; the full repository was not available to clone in this assistant's execution environment (GitHub DNS resolution failed). The added application regression, wider backend/browser/Compose CI and native ARM64 reverse-proxy retest are not yet executed. The PR must remain draft until appropriate focused verification is arranged. No application fix, merge, deployment or release acceptance claimed.

## Subsequent native ARM64 focused verification — 24 November 2026

The preceding verification boundary describes the initial draft checkpoint. The owner subsequently executed the exact candidate `c4bb326a5c16f1e61c2023ca75eaf099d927daf5` in an isolated, disposable container using the existing private ARM64 Python 3.12 image. The committed source archive was mounted read-only; networking was disabled except for container-local loopback, no ports were published and neither existing data volume was mounted. No Portainer deployment was performed.

- Positive control: `python -m unittest discover -s tests -p test_https_smoke.py -v` — **3 tests passed in 4.882 seconds**. All 21 authenticated stylesheet requests returned 200; file bytes and private/no-store headers matched; anonymous request returned 401, health returned 200, HTTPS setup/security headers and plaintext HTTP rejection passed.
- Negative control: the same regression and environment, substituting only baseline `backend/server.py` from `68df336856b1a710c375b34f16b4bb3eae5689e6` in the temporary archive. `-k test_startup_https_accepts_queued_interface_burst` — expected failure, 12.310 seconds, 15 TCP connect timeouts and assertion `6 != 21`. No stylesheet HTTP responses were attempted after the failed queue assertion.

See [positive control](https://github.com/Caffoot/Caffoot-Lite/pull/451#issuecomment-7134707510) and [negative control](https://github.com/Caffoot/Caffoot-Lite/pull/451#issuecomment-7134737626). These are owner-executed results, not assistant-local executions. The candidate application/test source is unchanged by this evidence update. Mandatory final-head CI and the actual Pi/Nginx browser acceptance remain pending; the existing synchronous stalled-handshake limitation remains outside the demonstrated correction. No merge, deployment or release approval is implied.
