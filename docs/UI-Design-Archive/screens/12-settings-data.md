<!-- Snapshot of owner decisions in issue #227, archived 1 November 2026. Main issue remains the living decision register. -->

[Archive Index](../README.md) · [Current owner decisions](https://github.com/Caffoot/Caffoot-Lite/issues/227)

### 12. Settings & Data — Previously Agreed Premium Form Design; Original Visual Reference Not Yet Recovered

**Product-owner clarification, 1 November 2026:** The **original Settings & Data form/page design was the catalyst for the wider premium interface design** and the decision to apply that consistent style to other forms. **Preserve this accepted earlier form**, not the simplified tab/cards substitute shown later in chat; the user has explicitly said the substitute is **not the same agreed form**.

- Preserve the published **v1.3.3 JSON inventory import**, review/confirmation and correction steps.
- The accepted design gave **useful Docker/SQLite backup instructions directly in the page**; do not replace those with a generic documentation link. The backup guidance must be correct for current **named Docker volumes**, alternative bind mounts, and existing-installation data safety; do not mislabel one-way JSON migration as an ongoing database backup.
- Retain **Inventory Safety Check** and deliberately confirmed **Clean Start / Clear System** with their existing safeguards.
- Personal themes and account security remain under My Account.
- **Email Settings** is part of the agreed Settings & Data design: optional SMTP host, port, transport/security, protected credentials, sender settings, save and **test email**. The system must function without SMTP.
- **Do not dismiss password recovery and notifications:** the owner explicitly recalls discussing **password recovery and administrative notifications as part of the intended email-enabled functionality**, with future ticketing also informing the design. These purposes are already recorded in [#222's original email-design discussion](https://github.com/Caffoot/Caffoot-Lite/issues/222#issuecomment-6553582075). The narrower SMTP-only statement in prior notes does **not** settle which of these the product owner wants included in the next delivery. Confirm the exact release-level behaviour and security approach with the owner during concise specification **without making them repeat or reapprove the accepted visual design**.
- **Original exact mockup has not been recovered:** the [previous owner clarification](https://github.com/Caffoot/Caffoot-Lite/issues/226#issuecomment-6556087924) explicitly says not to treat the later [rough proposed SMTP sketch](https://github.com/Caffoot/Caffoot-Lite/issues/226#issuecomment-6556031574) as the original. The new chat's substitute mockup also is **NOT approved**.

**Recordkeeping safeguard:** The two most recent My Account and Settings & Data interactive previews are **illustrations only and not evidence of the earlier accepted design**. Do not mark these as visually approved or use them as the implementation reference. The owner remains sole authority over functionality and implementation; no code or new development work is authorised by this clarification.
