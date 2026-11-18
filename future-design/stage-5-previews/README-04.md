# Caffoot Lite — Stage 5: Email Templates & Company Branding — HTML Design 04

**Status:** **Product-owner visually approved HTML Design 04** on 18 November 2026 after reviewing the interactive editor, live preview, context-sensitive template variables and shared branding. Owner feedback: “bloody hell mate, thats fantastic :), works really really well, and evern updates with the template well bloody done mate :)”. Saved as a **design-only reference** on branch `docs/milestone-01-stage-2-3-previews` in `future-design/stage-5-previews/`. This file is **not application implementation code** and changes no account, Service Desk, live email, organisation branding, or notification settings.

## Visual and behavioural authorities

- Original twelve approved v2.1 HTML sources, particularly the Devices Inventory and Device Details references at commit `c26db4a56bbc30f95b56201e81a7a76d13c6037b`.
- The three approved Stage 5 HTML references already archived on branch `docs/milestone-01-stage-2-3-previews`, directory `future-design/stage-5-previews/`:
  - `01-service-desk-it.html`
  - `02-my-tickets-department.html`
  - `03-service-desk-settings.html`
- [#355 — central email templates & branding](https://github.com/Caffoot/Caffoot-Lite/issues/355), especially the owner-reviewed early two-tab design and variable-list suggestion in [comment 6979014740](https://github.com/Caffoot/Caffoot-Lite/issues/355#issuecomment-6979014740).
- [#233 — Service Desk](https://github.com/Caffoot/Caffoot-Lite/issues/233) is **authoritative for email events, recipients, equipment/ticket visibility and notification data**. The template manager must not introduce new event triggers.

## Screens in the interactive HTML

### 1 — Email Templates

- One central location for generated **Service Desk and Account & Security emails**. The eight listed types are *illustrative supported examples*, not a final exhaustive inventory of every account email currently produced by Caffoot. Production implementation must preserve/inventory all existing supported account messages.
- Selected template shows the notification, intended authorised recipient, editable subject, **real contenteditable rich-text visual editor** (not raw HTML textarea), a small formatting toolbar, context-specific `Insert Placeholder` dropdown and a visible **Available Variables** reference list.
- Each reference entry shows **human-readable label, `{{variable}}` syntax, explanation, Insert and Copy**. The options vary when a template is selected; for instance, password-reset messages do not offer internal IT ticket information.
- **The variable names and exact per-template catalogues in this HTML are *examples only***. Exact production syntax, authorisation, escaping, validation, and source data are not approved by the visual mock-up.
- A **sample-only live preview** shows subject, recipient, shared company branding, formatted body, footer and *illustrative* system-managed required notification details. A real implementation must enforce all mandatory security-critical content and Service Desk event fields server-side, without leaking internal data.
- `Save as Draft` demonstrates the separation between a saved draft and the published version. `Publish` becomes available after draft validation; `Restore Default` resets only the selected template text and subject, never shared branding. No version history/rollback browser is introduced.
- `Send Test Email` validates an example destination and **only demonstrates** a test-send result: **no email is sent**. A real implementation requires administrator authorisation and uses only fictional sample values, without production ticket or account data.

### 2 — Company Branding

- One shared **Company Name**, **Primary Colour**, **Accent Colour**, **Email Footer** and optional **direct logo upload**, not per-template branding.
- PNG/JPEG up to **2 MB** and proportional display, with small logos not enlarged and narrow layouts adapted. The browser preview checks filename/type/header and size, **not a substitute for server-side validation**.
- The logo may be removed; when absent, the email uses the company name as its heading. Uploads and Save Branding are local-only demonstration controls.
- Preview uses a fictional organisation, *Example Organisation*, with a separate illustrative fictional **Maplebrook Ltd** logo-upload screenshot.

## Security, privacy and implementation limits

- All editing, logos, branding, preview and test-email facilities are **administrator-only** in the production specification, enforced by server-side security, MFA/session/CSRF permissions and audit rules; this HTML cannot simulate server authentication.
- No prohibited employee/private data in notification templates or preview. Internal IT notes, internal hold explanations, confidential attachments and raw password reset/invitation tokens must not become variables.
- The previous published template remains active while drafts are changed; a draft is not an outgoing email. The real Publish transaction and security/event validation must be implemented and reviewed separately.
- Company logo upload must be content-validated server-side for PNG/JPEG and maximum 2 MB, securely stored and automatically scaled without aspect distortion. The chosen final maximum email logo width remains a later detailed design decision; the visual size here is illustrative.
- Existing outgoing message flows and security-sensitive recovery/invitation behaviour must not be broken or replaced by arbitrary editable text. Missing optional values resolve to empty strings; required values cannot silently disappear.
- Preserve existing shared audit logging (action, administrator, time, template/branding identity) without a published-template version browser or copied confidential previous template contents.
- **Design preservation only:** the HTML, notes and reference images have been saved to the dedicated GitHub preview branch; **no backend integration, application PR, merge, release, deployment, `milestone-1`, `main` or Stage 4 change** occurred.

## Screenshot index (11 genuine Chromium captures)

| Capture | File |
| --- | --- |
| Template editor desktop light/dark | `04-templates-desktop-light.png` · `04-templates-desktop-dark.png` |
| Template editor mobile light/dark | `04-templates-mobile-light.png` · `04-templates-mobile-dark.png` |
| Shared branding desktop light/dark | `04-branding-desktop-light.png` · `04-branding-desktop-dark.png` |
| Shared branding mobile light/dark | `04-branding-mobile-light.png` · `04-branding-mobile-dark.png` |
| Example account security reset template | `04-account-reset-desktop-light.png` |
| Example template saved as draft | `04-saved-draft-desktop-light.png` |
| Uploaded fictional company logo in shared branding preview | `04-branding-logo-desktop-light.png` |

The desktop/mobile images are from headless Chromium at **1440×960** and **390×844** CSS pixel viewports. The responsive smoke test additionally checked **1024, 768 and 360 px** widths with no document overflow or JavaScript page errors. Interactive checks covered eight template selections, context-specific placeholders, draft/publish, restore default, required reset-link enforcement, safe test-email simulation, shared branding preview and sample PNG logo upload/remove.

**Branding-image limitation:** the sidebar refers to Caffoot's official repository logo, but the offline screenshots block the remote image and therefore show the original mock-up's fallback **C** mark. This is not a request to replace approved branding. The final implementation must retain the official Caffoot logo.

### How to review

1. Open `04-email-templates-branding.html` in a browser (no server installation required).
2. Select different Service Desk or Account & Security templates on the left, edit the subject/body, insert or copy a placeholder and see the right-hand preview change.
3. Select **Save as Draft**, then **Publish** to see the preview's local demonstration state changes. Try **Restore Default**.
4. Select **Company Branding** to change the sample organisation, colours, footer or upload the **fictional logo** supplied as `sample-assets/fictional-maplebrook-logo.png` in the ZIP. Observe that a missing logo falls back to the company name.
5. Review desktop/mobile light and dark captures. The approved HTML and screenshots are preserved in the dedicated GitHub preview branch. Further implementation planning and Stage 5 development require separate authorisation.

## Owner acceptance boundary

Design 04 is visually accepted, including the useful dynamic selection-dependent available-variable list and live email preview. Example `{{variable}}` identifiers and types are **not approved as the final data contract**; secure required content, server-side permissions, audit, branding file validation, and all notification events remain controlled by [#355](https://github.com/Caffoot/Caffoot-Lite/issues/355) and [#233](https://github.com/Caffoot/Caffoot-Lite/issues/233).
