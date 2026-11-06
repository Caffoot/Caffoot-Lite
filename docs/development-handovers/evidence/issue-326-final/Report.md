# Issue #326 — Authorised Preservation And Name Limits

Both remaining decisions are implemented. Existing controls stay within the five agreed placements, and software/server-service names use a consistent maximum of 100 across inline creation, catalogue Add/Edit, retained managers and the settings-save API. There is no remaining design-approval blocker for these provisions.

The explicit owner instruction is recorded in [comment 6689415340](https://github.com/Caffoot/Caffoot-Lite/issues/326#issuecomment-6689415340), implementing the exact [five-place proposal](https://github.com/Caffoot/Caffoot-Lite/issues/326#issuecomment-6684664810). Starting clean local and remote SHA: `d39f13e0d29372ab3dec5dbedf55c3d12c2db766`. Tested implementation checkpoint: `2f6dc5ea6d153cc3ee96ada432f59d16213899de`. The final SHA and GitHub results are in Issue #326; this report's hashes identify the delivered runtime.

## Placement Matrix

| Authorised provision | Result and code |
| --- | --- |
| Hardware and catalogue management | Type-specific fields remain below Manufacturer/Model/Serial within Hardware & Lifecycle, using the existing field grid. Removed nested card styling/heading from the old details wrapper, retaining all inputs and handlers. Hardware management stays in the same card. `initialiseDeviceFormTabs`, `renderDeviceDetailFields`; `device-details.html`. |
| Custom OS/platform and version | Functional selectors, custom values, accessible names and existing labels remain inside Operating System / Platform, using the approved grid/42px fields. Saved custom OS and version survive reload and duplicate. Existing version suggestions and limits remain. `renderSoftwarePlatformFields`, `captureSoftwarePlatformFields`; `device-management.html`. |
| VLAN, available IP and subnet creation | VLAN and available-IP controls remain within Network Identity; Create Subnet remains within Subnet Guidance. Existing source field/button treatment and handlers remain. No new card, field, permission or IPAM rule. `initialiseDeviceFormTabs`, existing IPAM bridges. |
| Rack creation and software/service management | Create Network Rack remains in Mounting & Rack Configuration. Existing software/service manager buttons stay within Installed Software/Server Services and now use `device-review-smallbtn`; existing type-based visibility is retained. Return-to-form behaviour and assignments remain. `initialiseDeviceFormTabs`, existing catalogue managers. |
| Notes tools | Numbers, Code and Link remain beside Bold/Italic/Bullets/Heading/Preview in the source toolbar. Keyboard activation, preview and saved Notes work. No new formatting behaviour. `initialiseNotesEditor`; `device-details.html`. |

No additional cards/tabs/features/layouts were introduced. Retained controls absent from the standalone preview are now explicitly authorised compatibility provisions, rather than unexplained mismatches. The pinned source remains unchanged; its illustrative values do not replace real records or existing validation/permission locks.

## Consistent Name Validation

`SOFTWARE_SERVICE_NAME_MAX_LENGTH = 100` is shared by the affected JavaScript checks and has an equivalent backend constant. All five affected HTML inputs use 100: inline software/services, software catalogue, service catalogue and both retained manager forms. The backend boundary is `/api/inventory/settings/save` for `installedSoftware` and `serverFunctions`; both inline and catalogue saves use that route.

The server rejects new/renamed names exceeding 100 before writing catalogue data or history, inside the existing transaction. Browser-field length counting is used on both sides, including non-ASCII text. Unchanged legacy names (including previously stored oversize values) and unknown metadata survive other catalogue updates without truncation or migration; new/renamed oversize values are rejected. Duplicate checks, required fields, device-type associations, assignment keys, permissions and unrelated field limits are retained. Import/storage formats are unchanged.

## Actual Checks

| Check | Result |
| --- | --- |
| Focused backend/API | **10 passed**. Tests cover create/update at 80/81/99/100, rejection at 101 without data/history change, browser-compatible Unicode lengths, unchanged legacy name/metadata preservation, unrelated limits and direct HTTP settings saves. Existing permission tests remain. |
| Full backend | **448 run: 445 passed, three skipped**, 50.138 seconds. Docker opt-in passed separately in implementation-checkpoint GitHub CI. Two genuine private v1.3.3 fixture tests were unavailable. No backend changes followed this run. |
| Expanded source comparison | **20/20 matched**, replacing the former eight held software/service cases. Location/Manufacturer/Model/Software/Service expanded forms at 1440/390px, both themes; measured 39px creation inputs, labels/actions and limits match the pinned HTML. Unrelated field limits are unchanged. |
| Approved placements | **40** measured combinations: five tabs × 1440/1280/390/320px × both themes. Actual source control heights are 42px; live affected fields are 42px. Source/live card padding is 20px desktop/laptop and 16px mobile. No document overflow or script error in these states; both footer actions have measured visible bounds. Hardware has no additional nested card. Accessible labels, toolbar membership and manager/card placement checks pass. |
| Saved workflows | Real isolated inline software/service creation at 100 → catalogue edit at 100 → save/reload, with selected assignment keys preserved. Standalone catalogue Add and retained-manager Add/rename accept 100; programmatic 101 input/prompt is rejected. Hardware, custom OS/version, Notes preview/save, duplicate fields and type-based manager visibility pass. Notes Numbers/Code/Link work with Enter. |
| VM regression | Existing focused real physical-host/guest create/edit/duplicate/reload checks passed on the implementation checkpoint. Explicit eligibility and missing legacy guest metadata remain intact. No host/guest rule changed in this follow-up. |
| Existing browser and Docker CI | All four implementation-checkpoint checks passed: [backend](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42250807010), [complete Chromium regression](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42250807071), [Compose lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42250807252), [history secrets](https://github.com/Caffoot/Caffoot-Lite/actions/runs/42250807084). Final GitHub results are recorded in the issue delivery comment. |
| Provenance, syntax and documentation | Both modular provenance/template tests, approved HTML contract, JavaScript syntax, 637 Function Index declaration links and release consistency passed. All twelve pinned originals/extracted styles and manifest remain unchanged. Published release remains v2.0.3. |

The completed batch's [208 main comparisons](../acceptance-corrections/editor-comparisons.json) were reused rather than repeated. New measurements specifically cover the newly authorised placements and limits. [Forty detailed cases and saved-flow results](preservation-results.json), [twenty expanded comparisons](inline-editor-results.json), [affected VM workflow result](device-workflows.json) and [runtime/capture hashes](checks.json) are committed.

Captures bring the live page to the foreground so background-tab painting does not omit visible footer buttons. Initial harness failures sampled edit-reservation release and save/modal redraw too early; assertions now wait for the actual transitions and affected reruns passed. The final style review retained the buttons' existing hidden state rather than widening device-type availability; targeted visibility checks pass. Earlier failures are not counted as successful runs.

Reproduce only the relevant checks using the established Playwright/Chromium environment:

```sh
python3 -m unittest tests.test_settings_saves tests.test_session_http.SessionHttpTests.test_software_service_name_boundary_through_settings_api -v
CAFFOOT_DEVICE_EDITOR_PRESERVATION=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/issue-326-review node tests/approved-visual.cjs
CAFFOOT_DEVICE_EDITOR_FIDELITY=1 CAFFOOT_DEVICE_EDITOR_INLINE_ONLY=1 CAFFOOT_VISUAL_FILTER='^$' CAFFOOT_VISUAL_OUTPUT=work/issue-326-inline node tests/approved-visual.cjs
```

The optional `CAFFOOT_CHROMIUM_PATH` selects an installed Chromium. `CAFFOOT_PRESERVATION_FUNCTIONS_ONLY=1` reuses an existing measurement file while exercising fresh disposable saved workflows. All data is fictional, local and isolated from the owner's installation.

## Rendered Evidence

| View | Desktop light | Mobile dark |
| --- | --- | --- |
| Hardware/retained fields | [View](images/preserved-hardware-1440-light.png) | [View](images/preserved-hardware-390-dark.png) |
| OS/software management | [View](images/preserved-software-1440-light.png) | [View](images/preserved-software-390-dark.png) |
| Network/IPAM controls | [View](images/preserved-networking-1440-light.png) | [View](images/preserved-networking-390-dark.png) |
| Notes/tools | [View](images/preserved-notes-1440-light.png) | [View](images/preserved-notes-390-dark.png) |

These source-derived layouts include the five explicitly agreed compatibility additions and the existing shared dark palette. They are not a claim of universal pixel equality or final owner acceptance. Review of actual renders accompanies the bounded measurements.

## Private Acceptance And Delivery Boundary

No new design decision remains for these two corrections. Owner private Pi, native-browser/physical-device, screen-reader and real-zoom acceptance remains. The broader batch's private mail and two genuine migration-fixture limitations remain historical outstanding checks; they were not reopened or represented as passing here.

The owner will build locally on the Pi using the [established private workflow](../acceptance-corrections/Report.md#private-docker-acceptance). Select the final SHA in Issue #326 in a clean development-branch checkout; back up the complete isolated private test data mapping (including the existing private email key), build with `python3 scripts/build_private_acceptance.py`, and verify the full revision label and native ARM64 architecture before using the same test Compose project and volume mapping. No cross-architecture build was attempted in this follow-up and no new local image is claimed.

Check 100-character inline creation, catalogue editing, saved assignments and all five compatibility placements on desktop/mobile, both themes and enlarged text. Existing 80-character names must still edit normally, 100 must survive save/reload, and 101 must be rejected. Keep permissions, host/guest relationships and existing data checks in the private review.

Everything remains isolated on `feat/approved-modular-html-282`. #308/#311/#325 were not reimplemented; #304 and previously accepted #306 work remain unchanged. No production access, pinned-source change, merge, publication, deployment or release.
