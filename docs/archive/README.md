# Historical documentation archive

This directory holds documentation that has been superseded by a later Caffoot Lite release. The current technical documentation remains in the main subject directories under `docs/`.

## Release tidy-up policy

During preparation of every new release:

1. Compare the current technical workflows, tests, audits, architecture notes and roadmap with the behaviour of the release being prepared.
2. Update the current documentation to describe the new release accurately. Do not rewrite historical findings as if they were new observations.
3. Move **superseded** version-specific documents to `docs/archive/vX.Y.Z/`, grouped where useful under `workflows/`, `testing/`, `audits/`, `roadmaps/`, `architecture/` and `releases/`.
4. Add `README.md` to each version archive. State which release it describes, why the documents were archived and where the current replacement lives.
5. Review all links, references, contributor guidance and any automated consumers of the moved paths. Use compatibility links where needed.
6. Keep shared standards and still-valid baseline descriptions in their current locations, even when their original version is older.
7. Run applicable documentation, build, packaging and regression checks before signing off the release. Record what was actually run and its result.
8. Include the archive move in the release pull request, review it before merging and confirm the archived files are present on `main` after merging.

## Release-critical files

Some repository-root files are explicitly used by the release packaging scripts, including release notes, installation guidance, the user guide, the backup format and third-party notices. Do not move or remove those files merely to tidy the archive. Any relocation needs approved packaging changes and successful release checks.

## GitHub branch deletion

If GitHub is configured to delete a pull request's source branch automatically after merge, files committed and merged into `main` remain there, including archive files. Unmerged work is **not** carried into `main` by deleting a branch. Confirm the merge and its resulting files before allowing a branch to be deleted.

## Current status

This is the archive policy and navigation entry only. No v1.3.0 baseline technical document has been archived. WF-01 to WF-10 source-inspection checkpoints for v1.3.0 are complete. Documentation closeout, full link and compatibility checks, and any separately required browser testing remain outstanding. No v1.3.0 baseline document has been archived.

## Historical release notes decision, 23 October 2026

Historical release notes are permanent release records, not automatically superseded technical guidance. Archive historical notes under [release-notes/](release-notes/README.md) while retaining the current version's notes at the root. The current release's `RELEASE-NOTES-<version>.md` is a required input to `app/package-release.cjs`; `.github/workflows/validate-hotfix.yml` also watches root `RELEASE-NOTES-*.md` files. Historical release-note files for v1.0.0, v1.1.0, v1.1.1, v1.1.2, v1.2.0 and v1.2.1 were copied unchanged to the archive and indexed. The six former root copies were then removed on the documentation branch after checking their archived contents and updating identified README and installation-guide links. External bookmarks to old root paths may stop working; repository-wide link and build verification are still outstanding. The published release assets remain unchanged. Do not treat a historical version reference as stale merely because it names an earlier release.

The 27 temporary forwarding documents likewise remain in place pending inbound-link and fragment review. No archive move is authorised by this decision.
