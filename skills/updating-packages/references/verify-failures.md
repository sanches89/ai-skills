# Verify failures

Each failing condition of Step 7 in `SKILL.md`, with its action:
- the frozen install: run the plain install;
- a check command or the peer report: bisect the accepted plan entries.
  Park every package of the breaking plan entry with the reason
  `verify: <condition>`;
- a condition on a manifest: restore that manifest from the checkpoint. Set
  its accepted ranges again with the script. Run the plain install;
- a condition on a file that is not a manifest or a lockfile: revert a
  tracked file with `git checkout -- <file>`, and delete an untracked file.

After 3 fails on one install root, restore that install root from the
baseline copy. Then park every package of that install root.
