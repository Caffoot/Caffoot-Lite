# Security Policy

## Supported versions

Security fixes are developed against the current supported stable Caffoot Lite release and reviewed for the next release. As of 27 October 2026, the latest published stable release is **[v1.3.2](https://github.com/Caffoot/Caffoot-Lite/releases/tag/v1.3.2)**, published on 27 October 2026. The project includes security hardening and automated regression checks, but these do not constitute a comprehensive security audit. Older releases may not receive security fixes. Check the [latest releases](https://github.com/Caffoot/Caffoot-Lite/releases) for the current status.

## Report a vulnerability privately

**Do not disclose exploit details, credentials, private backups, network inventories, or proof-of-concept payloads in a public GitHub issue or discussion.**

Use GitHub's private vulnerability-reporting facility if it is enabled for this repository: visit the [repository Security page](https://github.com/Caffoot/Caffoot-Lite/security) and look for **Report a vulnerability**. The repository owner must verify that private vulnerability reporting is enabled before treating this as an operational reporting channel. If the private reporting option is not available, do not submit sensitive details through a public issue; ask the maintainers in a public issue **only for a private reporting channel**, without sharing vulnerability details.

Please provide affected version, steps to reproduce using fictional data, expected/observed behaviour, impact and a safe contact method. Do not test against other people's inventories or systems. Allow maintainers time to investigate and coordinate disclosure before publishing details. No response-time or bounty commitment is implied.

## Deployment and data limitations

Caffoot Lite is a standalone, offline-first HTML application. It has **no built-in login, multi-user permissions, server-side access controls or encrypted browser inventory store**. Inventory is stored in browser-local storage scoped to browser/profile/origin. JSON exports and browser data can contain sensitive infrastructure details; store and share them securely.

Do not expose the app directly to the public internet without appropriate authentication and authorisation, HTTPS, and network access restrictions. A reverse proxy without authentication does not protect an inventory. Users of shared devices and browser profiles should consider local data access and backup handling risks.

The standalone distribution embeds its runtime dependencies for offline use. The optional manual update check contacts public GitHub release metadata; it is not required for normal offline inventory use. Browser protections, including Content Security Policy, have trade-offs for a single HTML file with inline scripts and styles; do not assume that serving the file from a website makes it a secure multi-user application.

## Security release process

Before publication, review source and Git history for accidental sensitive data; audit dependencies and external requests; run security and compatibility tests; inspect generated standalone HTML and the exact ZIP contents; verify documentation; and obtain explicit owner approval. Automated checks reduce risk but do not guarantee absence of vulnerabilities. Never include private backups, generated test inventories, local dummy-data generators, tokens or credentials in public release assets.
