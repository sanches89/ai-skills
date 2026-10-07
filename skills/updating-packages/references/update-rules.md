# Update rules

Sections: Range style; Reading the Node version; Constraints; Left alone;
Groups; The ladder; Bisection; Checkpoint; Park reasons; Release notes.

## Range style

Rewrite only these four range forms, keeping the form with the new version:

- `x.y.z`, an exact version;
- `^x.y.z`;
- `~x.y.z`;
- `npm:<name>@<range>`, an alias whose `<range>` is an exact, `^`, or `~` range.

A range in any other form stays as it is and goes under _Left alone_ with the
label `range form`. Other forms include:

- `workspace:`, `file:`, `link:`, `catalog:`, git, and URL ranges;
- `*`, `x`, and `latest`;
- a range with `>=`, `<`, `||`, `-`, or `.x`.

## Reading the Node version

Read each place that Step 2c lists as follows. A missing minor or patch reads as
`0`: `20` reads as `20.0.0`.

- `.nvmrc` and `.node-version`: the version in the file. `v20.11.0` reads as
  `20.11.0`. A value that starts with a letter, like `lts/*`, means: take the
  version from `node -v`;
- `volta.node`: the version as written;
- a workflow file under `.github/workflows/`: the lowest `node-version` value in
  the folder, matrix values included;
- `engines.node`: the lowest version the range allows. `>=18` reads as `18.0.0`,
  `^20.9.0` as `20.9.0`, `20.x` as `20.0.0`, and a `||` range as the lowest of
  its parts;
- `node -v`: the running version.

## Constraints

Check every candidate version against these constraints, in order. When one
refuses it, lower the package to the highest rung of _The ladder_ that every
constraint allows. With no allowed rung, park the package. Both record the park
reason of that constraint.

1. **Node version.** The `engines.node` field of the candidate version, from the
   facts file, must allow `<node-version>`. Run:

   ```bash
   npx --yes semver@7 -r '<engines.node>' <node-version>
   ```

   Exit code 0, or no `engines.node` field, means allowed.

2. **Peers.** `--peer` caps a candidate version at the highest version whose
   peer ranges allow the installed packages. Keep that cap.
3. **`@types/node`.** Its major equals the major of `<node-version>`. Its
   candidate version is the highest version of that major line, the last element
   of:

   ```bash
   npm view '@types/node@<major>' version --json
   ```

   When the current major of `@types/node` is above the major of
   `<node-version>`, park the package with the reason `@types/node major`. At
   level `minor` or `patch`, park it with that reason also when that major is
   not its current major. At level `patch`, take the highest version of its
   current minor line instead.

4. **Overrides.** Park a package named in `overrides`, `resolutions`, or
   `pnpm.overrides` of the root manifest, with the reason `override`.
5. **Pins.** Step 2e records the parked and the capped packages from these
   files:
   - Renovate: park a package in `ignoreDeps` with the reason
     `pinned by <file>`. Park a package matched by a `packageRules` item with
     `enabled: false` with the same reason. Cap a package matched by a
     `packageRules` item with `allowedVersions` at that range. Exclude a
     manifest under `ignorePaths` from the run;
   - Dependabot: park a package named by an `ignore` item without `update-types`
     with the reason `pinned by <file>`. Cap a package named by an `ignore` item
     with `version-update:semver-major` at level `minor`, and at level `patch`
     when the item also has `version-update:semver-minor`;
   - `.ncurc*`: npm-check-updates reads the file. Keep every rule of it. Park a
     package that the file rejects with the reason `pinned by <file>`. Lower a
     capped package to the highest candidate version that its cap allows, with
     the reason `pinned by <file>`.
6. **Cooldown.** `--cooldown <days>` applies the cooldown to candidate versions.
   npm-check-updates also reads `minimumReleaseAge` from `pnpm-workspace.yaml`.
   A version satisfies the cooldown when its publish date, from
   `npm view <name> time --json`, is at least `<days>` days before today.
7. **Deprecated.** `--no-deprecated` excludes deprecated versions.
8. **Prerelease.** npm-check-updates excludes prereleases, unless the current
   range is a prerelease.

## Left alone

These ranges and fields stay as they are. The update report lists each under
_Left alone_ with its label:

- `range form`: a range that _Range style_ does not rewrite;
- `workspace member`: the range of a dependency whose name is a workspace member
  of the same install root, in any range form;
- `peerDependencies`: every range in that section, in every manifest;
- `packageManager`: that field of the root manifest;
- `engines`: that field of every manifest.

## Groups

A group is the unit of a major plan entry. Three rules put candidate packages
with bump kind `major` into one group:

- **a scope**: every candidate package whose name starts with the same
  `@<scope>/` prefix, except `@types/`;
- **a twin pair**: `<name>` and `@types/<name>`. For `@<scope>/<name>` the twin
  is `@types/<scope>__<name>`;
- **a peer tie**: a candidate package whose `peerDependencies`, from the facts
  file, names another candidate package of the same install root. The named
  range refuses the other's current version and allows the other's candidate
  version. Run `npx --yes semver@7 -r '<range>' <version>` for both versions:
  exit code 0 means allowed.

Merge two groups that share a package. A candidate package in no group is a
group of one. Group A provides a peer dependency to group B when a candidate
package of B names a candidate package of A in its `peerDependencies`.

## The ladder

Take a package with current major `c` and candidate major `t`. The rungs of its
ladder are, in order, the highest allowed versions of major lines `t - 1` down
to `c + 1`. The highest allowed version of major line `n` is the last element
of:

```bash
npm view '<name>@<n>' version deprecated --json
```

that meets all of these:

- its `deprecated` field is absent;
- its version has no `-`;
- its publish date satisfies the cooldown;
- its `engines.node` field, from `npm view '<name>@<version>' engines.node`,
  allows `<node-version>`.

A major line with no such version has no rung. A package with no rung keeps the
range of Step 6a.

The first rung of a group moves each of its packages one major line below its
candidate version. Each later rung moves each package one more major line down.
A package with no major line left keeps the range of Step 6a. Restore the
checkpoint before each rung's trial, and again when the last rung's trial is
broken.

## Bisection

The unit is a package in Step 6a, a group in Step 6b, and a plan entry in
Step 7.

1. Split the batch into two halves by plan order.
2. Restore the checkpoint. Run a trial of the first half.
3. Restore the checkpoint. Run a trial of the second half.
4. Mark every unit of a half whose trial is sound as accepted.
5. A half of one unit whose trial is broken holds a breaking unit. Park it in
   Step 6a and Step 7. Walk its ladder in Step 6b.
6. Bisect a half of more than one unit whose trial is broken, from rule 1.
7. In Step 6a, when every unit is settled, restore the checkpoint. Run one trial
   of every accepted unit as one batch. In Step 6b, Step 6c does this instead.
8. When the trial of rule 7 is broken, take the accepted units one at a time in
   plan order and run a trial of each. After a sound trial, replace the
   checkpoint. After a broken one, restore the checkpoint. Then park the unit.

## Checkpoint

- The baseline copy is `<scratch-dir>/baseline/<root>/`. Step 3 copies every
  manifest and the lockfile of the install root into it, with their relative
  paths. Never replace the baseline copy.
- The checkpoint is `<scratch-dir>/checkpoint/<root>/`, taken the same way in
  Step 3. To replace the checkpoint, copy the files again.
- To restore the checkpoint:
  1. copy every file of the checkpoint back to its path;
  2. run the frozen install.

## Park reasons

Write a park reason, in the plan and in the report, as the phrase below that
fits:

- `engines.node <range>`: the range that refuses `<node-version>`;
- `peer of <name>`: the package whose peer range caps the candidate version;
- `@types/node major`;
- `override`;
- `pinned by <file>`;
- `cooldown`: no version of the major line satisfies the cooldown;
- `deprecated`: every version of the major line is deprecated;
- `check: <name>`: the check command that fails in the broken trial of the
  candidate version;
- `verify: <condition>`: the first Step 7 condition that fails, quoted.

## Release notes

A package under _Needs migration_ gets one link. Take the repository URL:

```bash
npm view <name> repository.url homepage --json
```

For a GitHub repository, the link is
`https://github.com/<owner>/<repo>/releases`. Otherwise the link is the
homepage.
