# Quality checklist

Run every check before returning the update report. A single failure blocks
delivery. Fix the failure. Then run the whole checklist again. When a check on
the work fails, go back to Step 6 or Step 7. When a check on the report fails,
fix the report.

## Files

- [ ] `git status --porcelain` names only manifests and lockfiles beyond the
      Step 3 record.
- [ ] Every lockfile change comes from a plain install by the project's
      package manager.
- [ ] No manifest outside the paths of Step 1 changed.
- [ ] The diff adds no dependency, tool, configuration file, or `.ncurc`
      file to the project.
- [ ] The scratch directory holds every JSON file, facts file, baseline copy,
      and checkpoint. The repository holds no such file.

## Versions

- [ ] Every changed range belongs to a package of an approved plan entry.
- [ ] Every changed range keeps its style: `^`, `~`, exact, or alias.
- [ ] No range names a prerelease version, unless its current range names
      one. No range names a deprecated version. No range names a version
      that fails the cooldown.
- [ ] The diff adds, removes, downgrades, or moves no dependency.
- [ ] Every range under *Left alone* is unchanged. Every `overrides`,
      `resolutions`, and `pnpm.overrides` field is unchanged. Every
      `peerDependencies` range, every `packageManager` field, and every
      `engines` field is unchanged.
- [ ] The `engines.node` field of every new version allows `<node-version>`.
- [ ] The `@types/node` major equals the major of `<node-version>`, or
      `@types/node` is under *Constrained* with the reason
      `@types/node major`.
- [ ] Every package that Step 2e records keeps the rule of its file.

## Checks

- [ ] The frozen install passes on every install root after the last
      change.
- [ ] Every check command ran after the last change, in the baseline order.
      Every failing check command fails in the baseline results too.
- [ ] The peer report shows no problem beyond the baseline peer report.
- [ ] The diff deletes, skips, or loosens no test, lint rule, or type check.
- [ ] The diff changes no source code, configuration file, or CI file.
- [ ] The run made no commit, push, or pull request, unless the request asked
      for it. With commits requested, there is one commit per accepted plan
      entry.

## Report

- [ ] The headings are exactly those of `update-report-template.md`.
- [ ] At most 60 non-blank lines. Each bullet is at most 2 lines.
- [ ] Every dependency with a rewritable range has exactly one state from
      `update-report-template.md`, and the *Packages* counts match.
- [ ] The result is `done` only when Step 7 passes on every install root.
- [ ] Every updated or lowered dependency is under *Updated*. Every kept or
      lowered dependency is under *Constrained* or under *Needs migration*.
- [ ] Every hold reason is a phrase from `update-rules.md`.
- [ ] Every link under *Needs migration* comes from the registry, as
      `update-rules.md` says under *Release notes*.
- [ ] No banned words: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`,
      `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`,
      `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
      `and so on`, `or similar`, `something like`.
- [ ] No question marks, except inside quoted user-interface text or code.
- [ ] No narration: no steps taken, no failed attempts, no `I tried`,
      `at first`, `after that`.
- [ ] No command output, logs, stack traces, or JSON listings.
- [ ] Every manifest path and package name in the report exists in the
      working tree.
- [ ] Every empty section holds the single word `None.`
- [ ] The report ends with its last section. No offer, no question, no
      next-step suggestion.

## Grep helper

Run this over the report file. Remove every hit, unless it sits inside quoted
user-interface text or code.

```bash
grep -nEi \
  -e '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b' \
  -e '\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b' \
  -e 'should we|if needed|if necessary|as appropriate|as needed' \
  -e '\betc\b|and so on|or similar|something like' \
  -e '\bI tried\b|\bat first\b|\bafter that\b' \
  <report-file>
```
