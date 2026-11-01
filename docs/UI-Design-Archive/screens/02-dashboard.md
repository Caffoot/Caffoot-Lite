<!-- Snapshot of owner decisions in issue #227, archived 1 November 2026. Main issue remains the living decision register. -->

[Archive Index](../README.md) · [Current owner decisions](https://github.com/Caffoot/Caffoot-Lite/issues/227)

### 2. Dashboard — Visual Design Approved ✅

**Approved by the product owner on 1 November 2026. Keep this design; no further alternative Dashboard mockups.**

A practical home page for day-to-day inventory work, not a promotional screen.

- Clean summary cards for Devices, IPAM and Racks, linking to their relevant sections.
- **Quick Access** for existing actions such as Add Device, Add Rack and Open IPAM. **Do not duplicate Add Device in the top-right header.**
- **Keep the existing three Dashboard tabs, clearly visible:** **Overview | Network Insights | Activity & Alerts**. The premium styling changes their presentation, **not** their contents or behaviour. **Network Insights** retains the existing IP address utilisation, device status, hardware distribution and rack-capacity-by-face views. **Activity & Alerts** retains the existing recent change activity/timeline, warning and integrity information, filters and links. **Overview** remains the main Dashboard with its useful summaries and Quick Access. Keep existing downloadable **CSV reports** discoverable wherever they currently belong. A compact summary card in Overview is **not** a substitute for either full tab.
- **Inventory Health** warning is shown to **administrators only, and only when there is an actual integrity issue**. It should not dominate a healthy dashboard.
- All figures are from saved inventory, not newly invented live monitoring.

**Owner confirmation (1 November 2026):** The familiar Dashboard composition shown in the latest preview is broadly the previously agreed design; **retain it rather than proposing another alternative**. The screenshot exposed a **preview-width defect**: sections were clipped horizontally. The actual design must fit its available browser viewport, using responsive grid/stacking as needed. The sidebar's single bottom collapse control was tested successfully and is **approved as a standard menu control**, with its expanded/collapsed choice saved and restored locally in the same manner as the theme preference.

**Approved empty-inventory refinement (1 November 2026):** Keep the **original approved Dashboard** as the main design. When the inventory is entirely empty, use a welcoming **“A clean start.”** presentation within it, with truthful zero/empty states and existing permission-aware Quick Access. Once populated, show the established approved Dashboard with **Network Insights, Activity & Alerts and Reports & Exports**, not the simpler example preview. A later preview confirmed the single bottom sidebar control now collapses/expands correctly; remember this preference locally as agreed. [Approved decision](https://github.com/Caffoot/Caffoot-Lite/issues/227#issuecomment-6556923417).
