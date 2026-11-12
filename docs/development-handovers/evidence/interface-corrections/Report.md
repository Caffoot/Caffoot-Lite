# My Account And Rack Controls

The two interface corrections follow [owner checkpoint 6805479377](https://github.com/Caffoot/Caffoot-Lite/issues/351#issuecomment-6805479377)
and the owner's subsequent clarification to retain existing Devices permissions
and rack data visibility. Work continued from the uncommitted changes on
`7daa3555fe5d7c6ea90a4a79cde541ce487abbe9`; earlier Stage 1 work was not repeated.
The single new commit SHA is recorded in the completion handover.

## Changes

- My Account displays all assigned roles, including Staff Member and disabled
  assignments explicitly marked **Disabled**. Administrator status appears
  separately in the existing Account Role fields. Names are escaped as text.
  The existing authenticated session response supplies only the signed-in
  account's own role names and enabled flags; its existing fields remain intact.
- Rack actions now check Racks Edit explicitly, covering unassignment and
  suggested mounting as well as existing editing/addition/removal actions.
  Read-only vertical accessories and empty U slots remain visible as spans,
  without edit/placement actions. Devices and accessories lose drag affordances
  for readers. Racks Edit retains the existing controls and authorised writes.
- No rack data projection was added. Devices access still determines which
  mounted devices the backend supplies. Stored records, inventory API contracts,
  reservations, permission/MFA policy, templates, pinned HTML/CSS and workflows
  are unchanged. The only backend addition serves the retained My Account
  display; it does not change inventory data access or authorisation.

## Checks And Results

| Check | Actual Result |
| --- | --- |
| `CAFFOOT_CHROMIUM_PATH=/usr/bin/chromium CAFFOOT_CORRECTIONS_OUTPUT=/workspace/work/interface-corrections/screenshots node tests/account-rack-permissions.cjs` | [Passed, exit 0](browser.txt): own-role display for Staff, additional/disabled roles and Administrator; existing no-inventory/no-MFA Staff boundary; Racks-only Read, Devices Edit with Racks Read, and Racks Edit with Devices Edit |
| `python -m unittest discover -s tests -p 'test_session_http.py' -v` | [22 passed, no skips](session-http.txt), 18.835 seconds; reused unchanged source/test results from immediately before the clarification |
| `python -m unittest discover -s tests -p 'test_modular_interface.py' -v` | [2 passed, no skips](provenance.txt); all twelve pinned source HTML/CSS hashes and template dependencies |
| JavaScript syntax | `node --check interface/application.js` and `node --check tests/account-rack-permissions.cjs`, exit 0 |
| Python syntax | `python -m py_compile backend/server.py tests/test_session_http.py`, exit 0 |
| Function Index | 733 definitions retained; all 520 links in the two changed runtime files remapped and checked against identical declaration lines; only 88 link locations changed |

The browser test uses fictional temporary HTTPS/SQLite data and real logins.
Readers' rack-save, accessory-delete and Racks-placement reservation requests
return 403, including when Devices Edit is independently allowed. Their rack,
accessory and available device records remain identical afterwards. The editor
successfully saves/restores a rack and starts/cancels a Racks reservation.
The test checks hidden modifying controls in Rack View, Equipment and Rack
Settings, retained vertical accessories/empty-U geometry, front/rear navigation,
and mobile overflow. Screenshots were captured locally; the mixed-reader/editor
desktop views were inspected. This is focused evidence, not final visual acceptance.

The original test stopped on an incorrect expectation that Racks Read alone
would expose mounted devices. That expectation was removed after the owner's
clarification; no application data access was changed to satisfy it. The next
development run failed because the test checked front-face content before its
redraw completed. It now waits for the selected-face state, following the
existing browser suite's pattern. The corrected run passed all four scenario
groups. No other failures or skipped focused tests remain.

## Changed Files

- Runtime: `backend/server.py`, `interface/application.js`.
- Tests: `tests/test_session_http.py`, `tests/account-rack-permissions.cjs`.
- Developer guides: `docs/development-guide/Role-Permissions.md`,
  `docs/development-guide/07-Function-and-Code-Reference.md`,
  `docs/development-guide/Function-Index.md`.
- User guides: `Racks.md` and `Users-Permissions-and-MFA.md` in both
  `docs/how-tos/features-and-instructions/` and the matching published
  `docs/How To's/Features and Instructions/` compatibility directory.
- Active handover: `docs/development-handovers/milestone-01.md`.
- Evidence: this report, `browser.txt`, `session-http.txt`, `provenance.txt`.

Names, comments, Title Case labels, compatibility copies and affected
documentation were reviewed together. No unrelated refactoring or dependencies.
Full backend, Docker, migration/restore and unrelated browser suites were not
repeated. Existing automatic push/PR checks remain enabled and unmodified.

## Review Boundary

PR #358 remains draft and unmerged. The earlier successful Chromium/Firefox/WebKit
PR-merge checks at [run 43066565241](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43066565241)
remain earlier-source evidence, requiring reconciliation with the approved
final-head requirement. This implementation commit needs its own final
verification; local focused Chromium does not replace that gate. The documented
legacy HTML-checker failure remains open and was not rerun or hidden by changing
approved CSS. No investigation or retry of #361 was performed.

No Stage 1 final acceptance, protected-main change, merge, deployment or
publication is claimed. No owner's Pi or real private `/data` was used.
