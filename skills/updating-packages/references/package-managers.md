# Package managers

Read this file in Step 2b. Run every command of this file from the install
root.

## Package manager

The `install` line of the command map from Step 2b holds the frozen
install. The frozen install succeeds only when the lockfile matches the
manifests. Its first words name the package manager:
- npm: `npm ci`;
- pnpm: `pnpm install --frozen-lockfile`;
- yarn 1: `yarn install --frozen-lockfile`;
- yarn 2 or newer: `yarn install --immutable`;
- bun: `bun install --frozen-lockfile`.

When the `install` line reads `unknown`, or starts with none of these
commands, ask one question: which package manager the project uses. Then
take the frozen install of that package manager from the list above.

The `packageManager` field of the root manifest, such as `pnpm@9.12.0`,
names the version. Without the field, the version is that of the package
manager on PATH.

## Workspace file

- npm, yarn, and bun: the `workspaces` field of the root manifest. The field
  is a list of globs, or an object whose `packages` field is that list.
- pnpm: the `packages` list of `pnpm-workspace.yaml` beside the root
  manifest.

## Plain install

The plain install rewrites the lockfile.
- npm: `npm install`.
- pnpm: `pnpm install`.
- yarn 1, and yarn 2 or newer: `yarn install`.
- bun: `bun install`.

## Recursive run command

Each command skips a member without the script.
- npm: `npm run <script> --workspaces --if-present`.
- pnpm: `pnpm -r --if-present run <script>`.
- yarn 1: `yarn workspace <member name> run <script>`, once per member whose
  manifest defines the script.
- yarn 2 or newer: `yarn workspaces foreach -A --topological run <script>`.
- bun: `bun run --filter '*' <script>`.

## Peer report

A problem is:
- npm: a line with `missing:` or `invalid:` in the output of
  `npm ls --depth=0`;
- pnpm: a line under `Issues with peer dependencies found` in the output of
  the plain install;
- yarn 1: a line with `unmet peer dependency` or `incorrect peer dependency`
  in the output of the plain install;
- yarn 2 or newer: a line with `YN0002` or `YN0060` in the output of the
  plain install;
- bun: none. bun prints no peer report.

## Version

When the `packageManager` field names a major that the package manager on
PATH lacks, run the package manager as follows in every command:
- npm: `npx --yes npm@<version> <arguments>`.
- pnpm: `npx --yes pnpm@<version> <arguments>`.
- yarn 1: `npx --yes yarn@<version> <arguments>`.
- yarn 2 or newer, with `yarnPath` set in `.yarnrc.yml`: `yarn <arguments>`.
  The yarn on PATH delegates to the release that `yarnPath` names.
- yarn 2 or newer, without `yarnPath`, with `corepack` on PATH:
  `corepack yarn <arguments>`.
- yarn 2 or newer, without `yarnPath` and without `corepack`: ask one
  question: which yarn to run.
- bun: `npx --yes bun@<version> <arguments>`.
