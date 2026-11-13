# Optional Features And Rack Preservation — Browser Evidence

Batch 4 adds the approved fourth Settings tab, IPAM statistic and Device Details Link action, and hides unavailable Rack placement controls. The existing interface components and styles are retained. These fictional-data captures support product-owner review; they do not record owner acceptance.

## Source And Method

Baseline: `89ad05eab13f7a429dcbd5f4266a26e52f5de8d2`. The twelve pinned designs remain at `c26db4a56bbc30f95b56201e81a7a76d13c6037b`, as recorded in [Approved HTML Integration](../../../development-guide/Approved-HTML-Integration.md). The directly relevant originals are `settings-data-draft-02.html`, `ipam-draft-01.html` and `devices-details-forms-batch-04.html`. They were served locally from that exact revision alongside the application. Archived Stage 2 previews supplied placement/function references only; no preview styling was copied.

Run from the repository root:

```sh
CAFFOOT_VISUAL_OUTPUT=docs/development-handovers/evidence/stage-2-batch-4 \
CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium node tests/optional-features-interface.cjs
```

The test uses the real local HTTPS application and temporary SQLite data with an administrator and separate Device-editor, IPAM-reader, combined-reader and Rack-only accounts. Captures cover 1440 × 950 and 390 × 844 Chromium viewports. Dialog captures use the viewport; page captures use the full page. Pinned sources use their original light presentation; application captures cover light and dark. External Google/CDN fonts were blocked, and the original remote logo URL was routed to the local application logo. This follows the existing local comparison approach and avoids external infrastructure dependency. Measurements and all capture names are in [measurements.json](measurements.json).

## Comparisons

| Area | Pinned Source | Application Light | Application Dark |
| --- | --- | --- | --- |
| Settings, desktop | [Original](approved-settings-1440.png) | [Optional Features](optional-features-light-1440.png) | [Optional Features](optional-features-dark-1440.png) |
| Settings, mobile | [Original](approved-settings-390.png) | [Optional Features](optional-features-light-390.png) | [Optional Features](optional-features-dark-390.png) |
| IPAM, desktop | [Original](approved-ipam-1440.png) | [Overview](ipam-overview-light-1440.png) | [Overview](ipam-overview-dark-1440.png) |
| IPAM, mobile | [Original](approved-ipam-390.png) | [Overview](ipam-overview-light-390.png) | [Overview](ipam-overview-dark-390.png) |
| Device Network, desktop | [Original](approved-network-1440.png) | [Network](device-network-light-1440.png) | [Network](device-network-dark-1440.png) |
| Device Network, mobile | [Original](approved-network-390.png) | [Network](device-network-light-390.png) | [Network](device-network-dark-390.png) |

The original three Settings panels and their tab buttons compare byte-for-byte with the baseline. Relevant Settings, IPAM and Device stylesheets and all twelve design pins are unchanged; `test_optional_features_visual_boundary` verifies these boundaries. Inspection shows the existing navigation, typography, rounded cards, orange actions and dark surfaces retained. New cards use the existing Settings grid, card, status and toggle components. Descriptions wrap within the existing mobile card header layout. Tabs retain their existing narrow-screen scrolling behaviour.

| Settings Measurement | Source 1440 | Application 1440, Light/Dark | Source 390 | Application 390, Light/Dark |
| --- | ---: | ---: | ---: | ---: |
| Main content width | 1225px | 1225px | 325px | 325px |
| Navigation gap | 22px | 22px | 13px | 13px |
| Card radius | 15px | 15px | 15px | 15px |
| Card padding | 22px | 22px | 17px | 17px |

The expected changes are the fourth tab/five feature cards, a fifth IPAM statistic using the existing statistic component, the Link action in Network Identity and its chooser using existing Device dialog components. The statistic wraps through the current mobile grid. Rack-off forms omit placement controls and lock the original Location for mounted Devices. No stylesheet or design source was changed.

## Dialog And Hidden-Field Evidence

| View | Desktop Light / Dark | Mobile Light / Dark |
| --- | --- | --- |
| Suitable existing subnet | [Light](link-existing-subnet-light-1440.png) / [Dark](link-existing-subnet-dark-1440.png) | [Light](link-existing-subnet-light-390.png) / [Dark](link-existing-subnet-dark-390.png) |
| No suitable subnet | [Light](link-no-subnet-light-1440.png) / [Dark](link-no-subnet-dark-1440.png) | [Light](link-no-subnet-light-390.png) / [Dark](link-no-subnet-dark-390.png) |
| Existing mounted Device, Racks off | [Light](racks-off-device-light-1440.png) / [Dark](racks-off-device-dark-1440.png) | [Light](racks-off-device-light-390.png) / [Dark](racks-off-device-dark-390.png) |
| New Device, Racks off | [Light](racks-off-new-device-light-1440.png) / [Dark](racks-off-new-device-dark-1440.png) | [Light](racks-off-new-device-light-390.png) / [Dark](racks-off-new-device-dark-390.png) |

The browser checks passed for native disable confirmation (including empty inventory), cancellation without mutation, saved statuses, inactive future switches, all-off administration, mounted and shelf-linked Device edits without hidden-field loss, type-specific non-Rack choices, count permission boundaries, no-subnet guidance, cancelled/stale/successful linking, retained allocation notes and enabled-Rack/Rack-only boundaries. Modal labels and keyboard focus containment were checked. No browser page errors or horizontal document overflow were found in the checked views.

## Limits And Outstanding Review

This is a focused Chromium comparison with fictional data, not a pixel-difference certification, automated accessibility audit or complete Stage 2 acceptance run. The six source captures and 28 application captures do not recertify every pinned screen. The external font/CDN environment differs from an unrestricted installation. Firefox/WebKit, wider existing browser suites, Docker/Azure, private-data and deployed restore checks were not run. Product-owner review and later Batch 5 integrated verification remain separate.
