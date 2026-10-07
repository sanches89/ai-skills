---
name: updating-packages
description: Updates the npm dependencies of a package or monorepo to the highest versions the project's own checks accept, changing only manifests and lockfiles. Use only when the user names this skill to update, upgrade, or bump packages, never for an install error or a question about one version.
license: MIT
compatibility: Requires the finding-dev-commands skill. Requires Node.js 22 or newer with npx, git, network access to the package registry, and the project's package manager (npm, pnpm, yarn, or bun) on PATH. npx fetches npm-check-updates and semver into its own cache on the first run.
argument-hint: "[path...] [package name...] [latest | minor | patch] [cooldown <days>]"
disable-model-invocation: true
---

# Updating packages

Move every dependency of every `package.json` in one repository to the
highest version the project's check commands accept. Return the
working-tree change and an update report.

## Terms

- **Install root**: a folder that owns a lockfile and the `node_modules` its
  install fills. A workspace root and its members share one install root.
- **Root manifest**: the `package.json` in the folder of an install root.
- **Trial**: set every range of a batch, then run the plain install. Then run
  the check commands that pass in the baseline results, in the baseline
  order, up to the first failure.
- **Sound**: a trial whose plain install succeeds, whose check commands all
  pass, and whose peer report shows no problem beyond the baseline peer
  report. Every other trial is broken.
- **Accepted**: the state of a package, plan entry, group, or rung whose
  trial is sound.
- **Park**: keep the range a package has at that moment, and record its park
  reason.
- **Lower**: set a package to a version below its candidate version, and
  record its park reason.

## Hard rules

1. **Only manifests and lockfiles change**, from Step 6 on, through the
   script and the package manager. Never edit project code, a configuration
   file, a CI file, or a lockfile by hand.
2. **No tool enters the project.** Run npm-check-updates and semver from the
   npx cache. Never add either to a manifest or write an `.ncurc` file.
3. **Never ask what research can answer.** Consult the manifests, the
   lockfiles, the docs, and the registry first.
4. **Never assume.** When a decision changes the work and research cannot
   settle it, ask the user.
5. **No outward actions.** Commit, push, or open a pull request only when
   the request says so. Then make one commit per accepted plan entry, in
   the project's branch and commit conventions.

## Script

`scripts/set-range.mjs` sets one dependency range in one `package.json`.
Run it as `node <skill-dir>/scripts/set-range.mjs`, where `<skill-dir>` is
the folder holding this `SKILL.md` (in Claude Code, `${CLAUDE_SKILL_DIR}`).
`--help` prints its options and exit codes.

## Workflow

### Step 1: Load the request

Resolve the invocation text, or the request, into four values:
- **Paths**: files or folders that limit the manifests. Default: the whole
  repository.
- **Package names**: names that limit the dependencies. Default: all.
- **Level**: `latest`, `minor`, or `patch`. Default: `latest`. `minor` never
  bumps a major. `patch` never bumps a minor.
- **Cooldown**: the minimum age in days, from its publish date, of a version
  the run takes. Default: 7.

Record whether the request asks for commits.

From this step on, write private notes in `<scratch-dir>`, a scratch
directory outside the repository (in Claude Code, the scratchpad directory).
Keep in them every list a later step reads.

### Step 2: Inventory

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in
one each read or command that yields only facts, returned with path and
line.

**2a. Manifests.** List every `package.json` under the paths, from the
repository root:

```bash
git ls-files -co --exclude-standard -- '*package.json' \
  | grep -E '(^|/)package\.json$' \
  | grep -vE '(^|/)(node_modules|fixtures|__fixtures__|templates?)/' \
  | grep -vE '(^|/)(dist|build|out|coverage)/'
```

**2b. Install roots.** Read `references/package-managers.md`. Assign each
manifest one role:
- a manifest with a `workspaces` field, or a `pnpm-workspace.yaml` beside
  it, is a workspace root. Its members are the manifests its workspace globs
  match. Its folder is the install root of all of them;
- a manifest beside a lockfile, and not a member, is the root manifest of a
  standalone install root: its own folder;
- every other manifest is an orphan manifest.

For each install root, invoke the `finding-dev-commands` skill (in Claude
Code, with the `Skill` tool) with
`from updating-packages: find in <install root>`. Record the package manager,
its version, and the frozen install by the *Package manager* section of
`package-managers.md`. When the package manager on PATH has a different
major, follow its *Version* section. Run every later install of that install
root with that package manager.

**2c. Node version.** Read `references/update-rules.md`. Take the Node
version from the first of these that exists:
1. `.nvmrc`;
2. `.node-version`;
3. the `volta.node` field of the root manifest;
4. the `node-version` of a workflow file under `.github/workflows/`;
5. the `engines.node` field of the root manifest;
6. `node -v`.

Record it as `<node-version>`, with the file or the command it came from.

**2d. Check commands.** Record the check commands of each install root, in
this order:
1. the frozen install of Step 2b, then the plain install from
   `package-managers.md`;
2. each `scripts` entry of the root manifest named `typecheck`,
   `type-check`, `check-types`, `lint`, `build`, or `test`;
3. every other `scripts` entry of the root manifest that a workflow file
   under `.github/workflows/` runs.

When a workspace root has none of the six `scripts` entries, record instead
the recursive run command of `package-managers.md` for each of the six names.
An install root with no check command beyond the install commands is an
install-only root.

**2e. Pins.** Read `renovate.json`, `.renovaterc`, `.renovaterc.json`,
`.github/renovate.json`, `.github/dependabot.yml`, and the `overrides`,
`resolutions`, and `pnpm.overrides` fields of every root manifest. Record
two lists by constraints 4 and 5 of `update-rules.md`:
- the parked packages, each with its park reason;
- the capped packages, each with its cap: a version range or a level.

### Step 3: Baseline

Record in the scratch directory, before changing anything:
- the output of `git status --porcelain`. When the request asks for commits
  and a manifest or a lockfile has uncommitted changes, ask one question:
  commit or stash them first;
- the baseline results, per install root: pass or fail and the duration of
  the frozen install, then of each check command. When the frozen install
  fails, run the plain install instead and record `install (frozen)` as a
  baseline failure;
- the baseline order: the check commands sorted by duration, shortest first;
- the baseline peer report, per install root, from `package-managers.md`;
- the baseline copy and the checkpoint, as `update-rules.md` defines under
  *Checkpoint*.

### Step 4: Candidate versions

`<root>` in a file name is the path of the install root, or of an orphan
manifest's folder, with `/` replaced by `-`. The current range of a
dependency is its range in the baseline copy.

Run in each install root, and in the folder of each orphan manifest:

```bash
npx --yes npm-check-updates@23 --workspaces --root \
  --packageManager <package-manager> --target <level> --cooldown <days> \
  --no-deprecated --peer --dep prod,dev,optional \
  --reject '<member names>,@types/node,<parked package names>' \
  --filter '<package names>' --jsonUpgraded \
  > <scratch-dir>/<root>-latest.json
```

Drop `--workspaces --root` for a standalone install root and an orphan
manifest, `--peer` for an orphan manifest, and `--filter` when the request
names no package. `<parked package names>` are the parked packages of
Step 2e. Remove from the output every range that *Left alone* of
`update-rules.md` names. Record every range and field under *Left alone*,
with its label.

With level `latest`, run the command again with `--target minor` into
`<scratch-dir>/<root>-minor.json`. With level `minor` or `patch`, copy
`<root>-latest.json` to `<root>-minor.json`.

Write one `<name>@<version>` line per dependency of `<root>-latest.json`
into `<scratch-dir>/<root>-specs.txt`, the version without its range prefix.
For an alias `npm:<name>@<range>`, write the aliased name and version.
Gather the registry facts:

```bash
while IFS= read -r spec; do
  printf '%s\t' "$spec"
  npm view "$spec" engines.node peerDependencies deprecated --json \
    2>/dev/null | tr -d '\n'
  printf '\n'
done < <scratch-dir>/<root>-specs.txt > <scratch-dir>/<root>-facts.tsv
```

Check each candidate version against the *Constraints* of
`update-rules.md`. Add `@types/node` as a candidate package in every
manifest that has it, at the version constraint 3 gives. Record per
candidate package: manifest, section, name, current range, candidate range,
bump kind, park reason of a lowered package or `none`, and peer ties. The
bump kind is `major`, `minor`, or `patch`, from the first number that
differs between the two ranges. *Groups* of `update-rules.md` defines peer ties.

### Step 5: Write the update plan

Build the plan entries of each install root:
1. one plan entry *minor and patch*: every candidate package of
   `<root>-minor.json` that Step 4 did not park;
2. one plan entry per group of the candidate packages of
   `<root>-latest.json` with bump kind `major`, by *Groups* of
   `update-rules.md`.

Build one plan entry *orphan* per orphan manifest: every candidate package
of its `<root>-latest.json` that Step 4 did not park.

Order the plan entries:
1. the *minor and patch* plan entry of each install root;
2. every group that provides a peer dependency to another group;
3. the other groups, by their first package name;
4. the *orphan* plan entries.

Write each plan entry in this form:

```
<number>. <install root or manifest>: minor and patch | major group <name>
   packages: <name> <current range> to <candidate range>, ...
   lowered: <name> to <range> by <park reason>, ... | none
```

Show in chat:
- the manifests of each install root, its package manager, and
  `<node-version>`;
- the check commands;
- the plan entries;
- the packages a constraint parked, each with its park reason;
- the *Left alone* list.

Ask one question with three options: approve every plan entry, approve some
by number, or change the plan. A change names a package to exclude, a
manifest to exclude, or a package to cap at a version. Repeat the question
until the user approves.

With no candidate package, go to Step 8 with the result `done` and zero plan
entries.

### Step 6: Run the update plan

Work one install root at a time, in plan order. A batch is the packages one
trial sets: a plan entry, a half of one, or a group at one rung. Write each
batch to `<scratch-dir>/<root>-<batch>.tsv`, one tab-separated line per
package: manifest, section, name, range. Set its ranges with one loop:

```bash
while IFS=$'\t' read -r manifest section name range; do
  node <skill-dir>/scripts/set-range.mjs "$manifest" "$name" "$range" \
    --section "$section" || break
done < <scratch-dir>/<root>-<batch>.tsv
```

When the script exits non-zero, fix the failed TSV line and run the loop
again.

**6a. Minor and patch.** Run a trial of the *minor and patch* plan entry. On
a sound trial, mark the plan entry accepted. On a broken trial, bisect it by
*Bisection* of `update-rules.md`. The bisection parks each breaking package
with the reason `check: <name>`. Then replace the checkpoint. With commits
requested, commit.

**6b. Major groups.** Without commits requested, run one trial of every
approved group as one batch. On a sound trial, mark every group accepted.
On a broken trial, bisect the batch with a group as the unit. For each
breaking group, mark the first rung whose trial is sound as accepted: its
packages are lowered. Park a breaking group with no accepted rung. Both
record the park reason `check: <name>`.

With commits requested, run the groups by `references/commit-groups.md`.

**6c. Assemble.** Skip this step with commits requested. Otherwise:
1. restore the checkpoint;
2. run one trial of every accepted group as one batch, each at its accepted
   rung. A group that the bisection accepted without the ladder takes its
   candidate versions;
3. on a broken trial, follow rule 8 of *Bisection* with a group as the
   unit.

**6d. Orphans.** Set the ranges of each approved *orphan* plan entry with the
loop above. Run no install and no check command there. With commits
requested, commit after each *orphan* plan entry.

### Step 7: Verify

Run per install root, in this order:
1. the frozen install from the new lockfile;
2. every check command, in the baseline order;
3. the peer report of `package-managers.md`;
4. the diff review: compare every manifest with the baseline copy.

Step 7 passes for an install root when all of these hold:
- the frozen install succeeds;
- every failing check command fails in the baseline results too;
- the peer report shows no problem beyond the baseline peer report;
- `git status --porcelain` names only manifests and lockfiles beyond the
  Step 3 record;
- every changed line of a manifest holds the range of an accepted package;
- every changed range keeps its style;
- the diff adds, removes, downgrades, or moves no dependency;
- every range under *Left alone* is unchanged;
- every `overrides`, `resolutions`, and `pnpm.overrides` field is unchanged;
- no file outside the install root changed.

On a fail, read `references/verify-failures.md` and act on the first
failing condition by it, then run this step again.

### Step 8: Update report

Fill `references/update-report-template.md` in the scratch directory. Run
every check of `references/quality-checklist.md` over the report.

Send the update report as the final message, unchanged. Ask nothing and
offer nothing after it.
