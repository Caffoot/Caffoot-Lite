# Stage 6.5 Integrated Regression

24 November 2026 · Milestone 01, unreleased v2.2. The checkout and remote `milestone-1` both identified `2380334970e1162ad6811f1703a91dcfc863b803` as the starting revision. The source declares SQLite schema 29. This draft checkpoint records the baseline while local verification is in progress. [Starting revision](https://github.com/Caffoot/Caffoot-Lite/commit/2380334970e1162ad6811f1703a91dcfc863b803) · [Approval and scope](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7132587750)

## Coverage

| Area | Applicable earlier evidence | Fresh checks and gaps |
| --- | --- | --- |
| Accounts and permissions | Stage 6.1 accepted Add User and recovery password confirmation, the two-step recovery screen and the existing Change Password flow. | Recheck schema 29 account eligibility, effective grants and overrides, MFA, session revocation and feature gates through the application. Third-party password-manager and native-device checks remain manual. |
| Inventory, IPAM, Racks and Staff | Stages 1–3 integrated their focused checks. Stage 6.3 preserved linked inventory, directory records, disabled Racks and their saved data. | Recheck linked-device writes, placement, directory and permission boundaries and retained data after feature switches are restored. |
| IT Assets, Purchasing and Lifecycle | Stages 3–4 verified stock workflows and Purchasing. Stage 6.3 recovered Supplier associations, purchasing issues and Lifecycle records. | Recheck custody and stock together, including corrections, original issue recipients, balances, disabled data and rejection atomicity. |
| Service Desk and shared equipment | Stages 5 and 6.4 verified the employee and technician workspaces, notifications and owner-accepted screenshots. | Recheck live audience changes, protected direct downloads, replies and dispatch eligibility beside the stock ledger. Check protected import with active shared custody dependencies. |
| Import, upgrade and recovery | Stage 6.2 covered a genuine v1.3.3 export with fictional data and protected import. Stage 6.3 verified stopped-volume restoration for schemas 10 and 28. Stage 6.4 verified direct schema 10 → 29, populated schema 28 → 29 and matching-image schema 28 restoration. | Reuse the pinned Docker rehearsals for the paths they exercised. Recheck current schema and import interactions affected by shared accessory custody. Two private legacy exports remain unavailable. Stopped volume evidence does not cover an active writer or SQLite sidecar. |
| Browser behaviour | Stage 6.4 has owner-accepted application captures. | Run representative loopback HTTPS journeys and established compatibility checks in Chromium, Firefox and automated WebKit. Native Safari, Raspberry Pi, Portainer, the private installation and Stage 3.4 manual acceptance remain outstanding. |

[Stage 6.1 sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/347#issuecomment-7124253298) · [Stage 6.2 evidence](../stage-6-2/README.md) · [Stage 6.3 evidence](../stage-6-3/README.md) · [Stage 6.4 evidence](../stage-6-4/README.md) · [Stage 6.4 sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/431#issuecomment-7132417522)

## Review Boundary

Stage 6.6 native and private acceptance, Stage 6.7 final documentation, website preparation and Stage 6.8 independent audit remain separate. Published v2.1 is the current public release. [Milestone plan](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-7020041373) · [Final audit](https://github.com/Caffoot/Caffoot-Lite/issues/443)
