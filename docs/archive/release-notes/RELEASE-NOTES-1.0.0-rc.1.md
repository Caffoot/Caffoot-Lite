# Caffoot Lite v1.0.0-rc.1 — release candidate notes

**Status:** In preparation; not yet published. This is a release candidate, not the final stable v1.0 release.

## ⚠️ Essential data storage warning

**Caffoot Lite stores inventory in your browser's local storage — NOT in `Caffoot-Lite.html`.** There is no automatic cloud backup, server-side storage or synchronisation. Clearing browser data can permanently erase inventory. Moving or renaming the file, or changing browser/profile, may make existing inventory inaccessible.

**Export a JSON backup regularly and before EVERY upgrade, move, rename or reset.** Keep backups outside the browser, protect sensitive infrastructure information and verify restoration.

## Included
- Standalone offline HTML for local use without a server or account.
- Device inventory, subnets and IP address management, rack layouts and assignments.
- Dynamic dashboard, light and dark themes, and Safari keyboard/VoiceOver improvements.
- Versioned JSON backup, legacy restore, clean-start and inventory safety checks.
- Manual release checks, offline safe update guide and complete embedded software licences.
- Automated build, offline asset verification and regression checks.

## Download and run
Download the **generated** `Caffoot-Lite.html` from the eventual GitHub release, not `app/caffoot-lite.html` (the developer source references remote build assets). Open the generated HTML locally in a browser. Node.js is needed only for developers rebuilding the file.

## Important data safety
Data is stored in the browser's local storage, not synchronised with a server. Export a JSON backup before replacing or moving the HTML file or changing browsers. File-based local-storage behaviour varies by browser and file path. Keep backups outside the browser.

## Testing
Earlier candidates passed automated checks and owner-confirmed Safari functional/offline and keyboard checks. Actual VoiceOver acceptance is not confirmed; the final candidate also needs Safari update/move/rename testing (see RELEASE-ACCEPTANCE.md). Any new branding integration or code change requires a fresh build and smoke test. Accessibility work targets WCAG 2.2 AA but is not a certification.

## Licence and branding
MIT License, copyright (c) 2026 Steven Del-Nevo. Third-party components have their own licences. Caffoot branding is separate from the MIT software licence.

## Before publication
- [x] Embed the Caffoot hedgehog logo and favicon in the standalone build; automated asset checks passed.
- [x] Complete main-branch text-history privacy scan and pinned runtime dependency licence comparison; see RELEASE-REVIEW.md for scope.
- [x] Prepare version-named ZIP with complete licences, guides, examples and verified hashes.
- [ ] Complete final Safari upgrade/move/rename and VoiceOver acceptance.
- [x] Verify standalone build and run offline Safari, persistence, JSON backup/restore and clean-start smoke tests (owner-confirmed, 9 October 2026).
- [ ] Obtain explicit owner approval to publish the repository and release.

