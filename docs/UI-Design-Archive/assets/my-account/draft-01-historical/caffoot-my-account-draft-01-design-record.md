# Caffoot Lite — My Account · Visual Design Draft 01

**Date:** 1 November 2026  
**Status:** Draft for product-owner visual review, NOT approved.  
**Foundation:** Published v2.0.1 and the previously agreed expandable My Account concept (Concept 12).  
**Design system reference:** Settings & Data Concept 04.1 (approved direction, compact SMTP authentication switch correction).

## Permanent visual references

- `caffoot-my-account-draft-01.html`: exact, self-contained interactive HTML with embedded hedgehog and CSS.
- `caffoot-my-account-overview-preview.png`: actual rendered screenshot of Overview.
- `caffoot-my-account-security-preview.png`: actual rendered screenshot of Security.
- `caffoot-my-account-appearance-preview.png`: actual rendered screenshot of Appearance.
- `caffoot-my-account-help-preview.png`: actual rendered screenshot of Help & Guides.
- `caffoot-my-account-draft-01-design-pack.zip`: the complete package.

**Do not substitute later prose for the actual HTML and screenshots.** GitHub issue #227 should link to version-controlled copies after owner approval and permission to add documentation files.

## Shared appearance and layout

- The identical navy (`#142b43`) and orange (`#ed8532`) colour system, compact information design, Inter/system typography, 215px normal sidebar, 65px compact sidebar, and one bottom Collapse/Expand control from Settings & Data Concept 04.
- Responsive layout without horizontal overflow, consistent page header, breadcrumb, cards, icons, Title Case controls, orange primary action buttons.
- My Account appears near bottom of sidebar for **every** signed-in user. Settings & Data remains administrator-only in the actual application; its presence in the illustrative admin preview does not imply it is shown to ordinary users.
- Identity hero presents **username**, account role, active state and MFA state only when actually available. Do not invent required real-name, photo, department or email profile fields.

## Overview (the key design direction)

The default My Account landing screen is an **expandable personal workspace**, not merely a settings form.
- Clear personal identity banner and status.
- **Account & Security:** username, role and MFA state with Manage Security action.
- **Your Services:** two explicitly *planned* destination cards, **My Devices** (future assigned devices) and **My Support Tickets** (future support requests). They are informational only in this draft; no assigned assets/tickets are invented.
- **Personal Preferences:** a short summary of theme choice and link to Appearance.
- **Help & Guides:** concise useful access to guides.
- **Sign Out:** retained as a clearly discoverable account action, with an honest preview-only toast.

## Security

- Existing Change Password flow (current password, new password, confirmation) with original authentication/validation/session restrictions intact.
- MFA state; actual future implementation retains password-authenticated enrolment, QR/manual secret and verified six-digit code, not a made-up enrolment bypass/reset.
- Never expose secrets or claim a password change in this static preview.
- A contextual note shows *planned* safe account recovery, without pretending it is currently implemented.

## Appearance

- Interactive Light Mode, Dark Mode, Use System Setting cards with mini visual previews.
- Actual released v2.0.1 preference remains **browser-local**; the prototype shows selection feedback but does not change the running application theme or create new account settings persistence.

## Help & Guides

- Expandable local help topics for Getting Started, Devices, IPAM, Racks and Account Security.
- Link to the maintained full-length feature guides in GitHub; retain useful offline content.

## About

- Product identity, installed version, Docker/SQLite description, official links, licence/third-party licence information and offline guidance.
- Illustrative published version label v2.0.1; real application must show its actual installed version.

## Scope and safeguards

- This HTML is visual-only. No server, account change, password save, SMTP, device assignment or ticket action is performed.
- Future personal features are clearly marked Planned and are not introduced by this concept.
- Authoritative controls, permissions, user-specific visibility, data compatibility and MFA/session behaviour are those in v2.0.1 unless the owner later explicitly approves additional features.
- Exact future assignment/ticket workflows and notification behaviour are **not** claimed to be approved by this visual direction.
- This is a **new reconstruction**, not a recovered original historical screenshot.

## Owner review and approval

Awaiting product-owner review. Preserve the current screen artefacts and amend only specific feedback. Once approved and authorised for documentation, store **HTML, screenshots and this spec together in GitHub** with stable filenames, and add their paths to #227 to avoid any reliance on chat history.