# Original UI references for Issue #244

These are the **only design archives supplied by the product owner** for the fresh UI discussion. They are references, not application code or approval to implement anything.

## Supplied ZIP files — verified on 1 November 2026

**1. `caffoot-ui-approved-artifacts-2026-11-01.zip`** — preserved here **unchanged**, with its exact Git blob SHA `31ff2d38795876d5e36a06d51a4f4069b286d662` and SHA-256 `c2f7af01ffc471f45795806f04c34779acf9273c5f1c9d6b64512ed39171baa5`. It contains:
- The **approved revised My Account** Personal Details screenshot (round profile image).
- The **Settings & Data 04.1** interactive HTML, design record and three screenshots.
- Earlier **My Account Draft 01** HTML, record and four screenshots; **historical/superseded**, not the approved revised My Account screen.

**2. `caffoot-settings-data-concept-04.1-design-pack.zip`** — also supplied by the owner, SHA-256 `e77b4b30fee3e4e95eeb1f4415b202bd18ee811d56eafdbb5a096b68ea55896a`. It contains exactly five files: the Settings & Data 04.1 HTML, its design record, and three screenshots. **Every one of those five files was checked and is byte-for-byte identical to the matching files inside archive 1 above.** Archive 1 therefore preserves all of its actual design contents without a second duplicate binary ZIP.

The second ZIP itself was provided in the discussion but is **not independently stored in this GitHub folder**; GitHub's available connector cannot upload this local binary attachment directly. Do not imply that it has been separately committed. The supplied design files it contains are nevertheless all preserved unchanged in archive 1.

## Missing source designs — do not invent or misrepresent

The owner **did not receive downloadable copies** of the designed Sign In / First-Time Setup, Dashboard, Devices, IPAM or Network Racks screens. Those original design screenshots/HTML **are not present in either supplied ZIP**. The existing `docs/screenshots` files elsewhere in the repository represent the published application, not proof of approved redesign artwork.

When work on #244 eventually resumes, the product owner will review the visual direction for those screens afresh. **Do not claim there are approved archived mockups for them or reproduce guessed layouts.**

## Working boundary

- Issue [#244](https://github.com/Caffoot/Caffoot-Lite/issues/244) records the current scope and decisions.
- `main` / published v2.0.1 is the functional baseline.
- No business logic changes, especially to Rack operation or VM behaviour. Only optional SMTP Mail and My Account first name, last name, display name and profile image are proposed functional additions.
- This `future-design` folder is **temporary**. Remove it after the finished redesign is delivered and accepted, as the product owner directed. Its presence is not permission to alter the running application.
