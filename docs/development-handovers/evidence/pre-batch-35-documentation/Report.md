# Pre-Batch 3.5 Documentation And Wording Corrections

## Scope And Source

Authorised by [issue #366, comment #6891608596](https://github.com/Caffoot/Caffoot-Lite/issues/366#issuecomment-6891608596), using the completed read-only review rather than repeating the audit. Remote `milestone-1` and fetched source both matched `05b162aa10a74994c970d0b6dbf111dc59b47513` before work began. The dedicated branch is `docs/pre-batch35-guidance`; its PR targets `milestone-1` and must remain draft for owner review.

Current summaries distinguish accepted Stage 1/2, merged Stage 3 Batches 3.1–3.4, deferred (not passed) Batch 3.4 manual acceptance and pending later work. IT Assets is independently optional; its switch, stock and returns remain unimplemented. Five feature guides and their index are clearly labelled draft v2.2, not published or production guidance.

The runtime diff contains only one Staff form help sentence, one Staff module comment and one equipment-handler docstring. No functions, selectors, markup structure, styles, permissions, schema or workflows change. The Function Index removes the non-callable `rows` and `controls` entries and records 835 remaining entries; no full regeneration is claimed.

## Actual Local Checks

- JavaScript syntax: `node --check interface/staff-directory.js` passed.
- Python syntax: parsing `backend/server.py` with Python's `ast` module passed.
- The existing `release-documentation.yml` Python check passed, including all eight byte-identical official/legacy guide pairs and preserved v2.1 release artefacts.
- Changed and new Markdown local file targets resolved, including links from the legacy compatibility paths.
- All 835 Function Index entries have consistent displayed/linked line numbers and their recorded declaration name on that line. This is a count/location check, not a full semantic regeneration or call-graph audit.
- Exact source comparison against the approved base confirmed only the three authorised runtime text replacements. Code declaration line numbers remain unchanged.
- Published root README content outside its development paragraph, installation instructions, dated handover checkpoints, historical documents, image files, stacks and styles were preserved.
- `git diff --check` passed.

The first preservation-check script stopped because its temporary variable name collided with a variable in the embedded workflow check. The script was isolated and the complete corrected check passed; no application failure was involved. Temporary check scripts are outside the repository under `/workspace/work`.

## Existing Evidence And Remaining Limits

No backend suite, browser suite, Docker/image build, private fixture, Raspberry Pi or deployment was run for these wording-only edits. Existing final Batch 3.4 head `034b9ed54cb559197046104c9184fa8900dd82e1` has successful [backend](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43645660316), [browser](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43645660322), [Compose lifecycle](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43645660369), [documentation](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43645660344), [history scan](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43645660324) and [release-safety](https://github.com/Caffoot/Caffoot-Lite/actions/runs/43645660304) evidence. Release creation was skipped. Those runs cover the earlier runtime, not this documentation commit; new hosted results must be reported separately.

Batch 3.4 native/manual acceptance is deferred, not passed. The inherited Device footer casing and known baseline IPAM CSS contract discrepancy are unchanged. Private legacy-export fixtures and complete-volume upgrade/restore verification remain outstanding; milestone-wide compatibility/restore belongs to Stage 6. No upgrade or restore procedure, screenshot or acceptance result is invented here.

Department Details is not implemented: its tabbed design requires separate owner visual approval. Batch 3.5 is not started. Published v2.1, `main`, design archives and screenshots remain unchanged. No merge, public image, release or deployment is authorised by this correction.
