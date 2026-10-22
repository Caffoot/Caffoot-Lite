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

This is the archive policy and navigation entry only. No v1.3.0 baseline document has been archived yet. The v1.3.0 technical audit and documentation relocation checks are still in progress.
