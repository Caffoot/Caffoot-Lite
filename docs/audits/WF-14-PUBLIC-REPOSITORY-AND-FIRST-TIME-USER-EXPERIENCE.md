# WF-14: Public Repository and First-Time User Experience Review

**Status:** Planned, not started. Agreed 23 October 2026.
**Baseline:** Published Caffoot Lite v1.3.0.
**Scope boundary:** New workstream following the original v1.3.0 documentation audit WF-01 to WF-13. This is not a renaming of WF-11, WF-12 or WF-13.

## Purpose

Make the public Caffoot Lite repository accurate, understandable and welcoming for people encountering the application for the first time. The product owner's immediate priority is public release accuracy and reducing avoidable barriers to trying the application, ahead of speculative new functionality. Do not assume low adoption has any one proven cause.

## Review areas

1. **Published release truth:** Compare README, installation instructions, user guide, security guidance, roadmap, release notes and feature descriptions with the actually published v1.3.0 HTML and ZIP. Correct outdated version statements, inaccurate capability claims and misleading screenshots.
2. **First-time path:** Check whether a new visitor can identify what Caffoot Lite does, supported environments, how to download and open it, where their data is stored, how to back it up, and how to get help.
3. **Navigation and discoverability:** Review repository landing page, documentation links, structure, images, GitHub release assets, licences and contribution/support routes. Confirm archived documentation is not presented as current.
4. **Website consistency:** Provide clear, accurate public feature and workflow references for the separate website project. Website changes or publication are not implied by this scope.
5. **Safety and expectations:** State offline/local browser storage, export/restore limitations and recovery guidance accurately. Do not claim automatic backups, live monitoring, a hosted service or multi-user support in v1.3.0.
6. **Adoption evidence:** If available, record owner-provided traffic, release downloads and qualitative user friction as a baseline. Do not introduce telemetry into the offline app or promise adoption gains.

## Acceptance criteria

- Every current public-facing document is reviewed against the published release and either corrected or recorded as accurate, with evidence.
- The README and getting-started path are checked from the perspective of a new user, including the actual download/open/first-backup journey.
- Public navigation links and documentation references are checked, including the temporary compatibility stubs and archived historical notes.
- Screenshots and feature descriptions accurately reflect v1.3.0 and use British English.
- Any issues needing code changes are entered into the roadmap and handled through the permanent seven-stage process; documentation work does not silently alter application behaviour.
- Automated checks and relevant manual checks are recorded as executed, not assumed.
- The workstream has a dated reconciliation and explicit owner approval before merging or publishing.

## Dependencies and sequencing

Complete and reconcile the original WF-01 to WF-13 audit first, while correcting any confirmed serious public misinformation or user-data safety issue as a priority. Keep the existing roadmap maintenance candidates, including the public-documentation version drift finding M-030, visible until resolved. Confirm release packaging dependencies before relocating or editing release documentation.

**Authorisation:** Creating and maintaining this planning document is documentation work on the existing branch. No application source changes, merge to `main`, release, website publication or GitHub ruleset changes are authorised by this record.
