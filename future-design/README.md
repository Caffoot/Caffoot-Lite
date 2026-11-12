# Milestone 01 — Interactive Planning Previews

> **Permanent reference archive — outside `main`.** This branch is intentionally retained to store reviewed Milestone 01 prototype files. **Do not merge it into `main`, publish it with a release, copy its styling into v2.1 screens, or delete it during ordinary branch clean-up.** At the start of Stage 2 and Stage 3 work, review the relevant archived HTML alongside the latest owner-approved issue requirements. Each new mock-up should be archived here only after the owner reviews it; the feature issues remain the source of truth for approved behaviour.

These are the **five original standalone HTML files supplied by the product owner on 12 November 2026**, kept as review evidence and practical **functional interaction references only**.

**These are not application files, implementation authorisation, or additional/replacement pinned design sources.** The current v2.1 interface, the twelve pinned approved v2.1 HTML designs, and existing `interface/` styling and behaviour remain authoritative. Follow `CONTRIBUTING.md`. Add only independently approved new functionality **inside the existing v2.1 design**; never replace established screens with whole preview mock-ups or restyle unrelated controls. Preview data and access simulations are fictional and are not proof of backend security or persistence.

Where a file shows an earlier idea, later explicit product-owner decisions in the linked issues take precedence. The original file is preserved unchanged for traceability. No Codex work, implementation, merge or release is authorised by archiving it.

## Stage 2 — Optional Features

**Authoritative issue:** [#238](https://github.com/Caffoot/Caffoot-Lite/issues/238). Stage 2 behaviour, integrated visual placement and final technical implementation plan were explicitly approved; development is paused until separately authorised.

- [Optional Features Integrated Settings Review](stage-2-previews/caffoot-optional-features-integrated-settings-review.html): approved functional interactions for the fourth **Settings & Data → Optional Features** tab, switches and disable confirmation. The existing three settings tabs, form controls, light/dark styling and layout must not change. [Visual sign-off](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6820547757).
- [Stage 2 IPAM and Device Details Review](stage-2-previews/caffoot-stage2-ipam-and-device-details-review.html): out-of-range basic-IP count in **IPAM Overview** and explicit **Link to IPAM** action from **Device Details**. **Only placement and functionality** are approved, not the different styling used in the preview. [Approval and strict v2.1 UI boundary](https://github.com/Caffoot/Caffoot-Lite/issues/238#issuecomment-6821121891).

An earlier standalone Optional Features mock-up was discussed in #238 but was **not supplied among these five files**; this collection is not claimed to contain every earlier iteration.

## Stage 3 — Staff, IT Assets and Navigation

**Authoritative issues:** [#232 Staff & Departments](https://github.com/Caffoot/Caffoot-Lite/issues/232), [#352 IT Assets](https://github.com/Caffoot/Caffoot-Lite/issues/352), [#351 Milestone 01 Tracker](https://github.com/Caffoot/Caffoot-Lite/issues/351). Stage 3's entire visual and technical implementation plan is not yet signed off.

- [Assets Dashboard Preview](stage-3-previews/caffoot-assets-dashboard-preview.html): stock KPIs, readiness, registered vs unregistered stock, chart and movements. This early concept says **Assets**, later renamed **IT Assets** by [explicit owner approval](https://github.com/Caffoot/Caffoot-Lite/issues/352#issuecomment-6828024126). Final source-faithful integrated dashboard still needs review.
- [IT & Staff Navigation Preview](stage-3-previews/caffoot-it-staff-navigation-preview.html): expandable groups, access demonstration and theme. This early iteration shows a separate **Users** entry, since superseded by **Staff → Permissions** under [final owner navigation approval](https://github.com/Caffoot/Caffoot-Lite/issues/232#issuecomment-6828925091).
- [Staff Member & Optional Login Preview](stage-3-previews/caffoot-staff-member-login-preview.html): Staff directory and combined Staff Member form with optional linked Caffoot login. The owner approved the **functional approach, explicitly conditional on preserving the actual v2.1 UI**, not treating this standalone appearance as a new design source. [Owner review](https://github.com/Caffoot/Caffoot-Lite/issues/232#issuecomment-6829687354).

**Current agreed navigation:** expandable **IT** contains Devices, IT Assets, IPAM and Network Racks; expandable **Staff** contains Staff Members, Departments and admin-only Permissions. All existing effective permissions, independent optional-feature switches, MFA and account-management safeguards remain authoritative.

## Original File Verification

These SHA-256 values refer to the **unaltered uploaded source files**:

| File | SHA-256 |
| --- | --- |
| `caffoot-assets-dashboard-preview.html` | `3c359e1908a2009a1d3a910af6eacf67c14a69b59ebe13d97f7c3c36b3cdcc88` |
| `caffoot-it-staff-navigation-preview.html` | `7b6fe49e772290e065b2014bea2201a369451d4396cbef223419a95b00a2dc4c` |
| `caffoot-optional-features-integrated-settings-review.html` | `4e1ccc54b1ee1e6d7114d8a7fa306db6453cdac6e8d293c160aaba0ad0c9256a` |
| `caffoot-staff-member-login-preview.html` | `1bcfb6e59311ebe2d8534eecf38847daac07d7a92b3076fb9eeb89b5ccb79a9e` |
| `caffoot-stage2-ipam-and-device-details-review.html` | `cb0ff462f39da31e777e2896f225e3da0acb24169e824024f06fea62d6283e49` |

Open the HTML files locally to review their interactive behaviour. A few Stage 3 files request the public Caffoot logo from GitHub; none connect to live Caffoot Lite data. No screenshots were uploaded with these five files.

**Archive intent:** retain the reviewed sources on this dedicated reference branch. Do not modify, import or pin these under `interface/`, and do not infer development permission from archived prototypes or the closed documentation PR.
