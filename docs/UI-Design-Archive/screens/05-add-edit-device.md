<!-- Snapshot of owner decisions in issue #227, archived 1 November 2026. Main issue remains the living decision register. -->

[Archive Index](../README.md) · [Current owner decisions](https://github.com/Caffoot/Caffoot-Lite/issues/227)

### 5. Add / Edit Device — Visual Design Approved ✅

**Owner confirmation (1 November 2026):** The corrected device editor appearance is approved. The initial mockup missed Hardware / VM Hardware; the follow-up visual included the appropriate section for both Add and Edit, and the owner confirmed: “yes mate thats it”. Keep the approved appearance and those sections; do not re-design the form.

Visually polish the existing forms and selectors so they are easy to understand, without changing what they do.

- Group existing device details into clear, manageable sections. **Retain an obvious Hardware tab/section in both Add and Edit Device.** For a physical device, show the existing physical hardware fields; when the type is a Virtual Machine, show the existing **VM Hardware** options instead. Do not accidentally omit either from the premium design.
- Preserve device type and location choices; physical versus virtual server fields; manufacturer/model suggestions; network/IP assignment; rack placement; software, server services and Notes.
- In the **Software & Notes** area, the **Installed Software** and **Server Services** Manage actions must be usable in the implemented editor, allowing the user to add/assign/manage the relevant software and services using the **existing v2.0.1 catalogue, device-assignment, permission and save workflows**. These controls were non-working visual placeholders in the ChatGPT preview only. Do not silently lose unsaved form entries when using these actions.
- Keep the ability to work with related network/catalogue choices without accidentally losing an **unsaved device form**.
- Maintain the established existing confirmation, validation and permission behaviour. No new device fields or lifecycle rules are implied.
