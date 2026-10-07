---
name: finding-dev-commands
description: Finds a project's build, lint, type-check, format, test, single-file test, and install commands from its CI, manifests, task runners, and docs, running none of them. Use when the user or a skill needs to know how to build, test, lint, format, or install a project.
license: MIT
argument-hint: <folder>
---

# Finding dev commands

Find a project's build, lint, type-check, format, test, single-file test, and
install commands, each with the file and line it came from.

## Hard rules

1. **Read-only.** Change no file and run no project command: no build, no test,
   no install.
2. **Never ask.** Settle every command from the files, else record `none` or
   `unknown` with the reason.

## Invocation

An invocation text that starts with `from <skill name>:` comes from that skill,
in the form `from <caller>: find[ in <folder>]`. The project folder is
`<folder>`, else the repository root. Without that prefix, a user invoked this
run: take the project folder from the request, else the repository root.

The command map:

```text
build: <command> (<path:line>) | none
lint: <command> (<path:line>) | none
type-check: <command> (<path:line>) | none
format: <command that checks formatting and writes nothing> (<path:line>) | none
test: <command> (<path:line>) | none
test one file: <command with <file> in place of the test file> | none
install: <command> (<path:line>) | none: <reason> | unknown: <reason>
```

Write `<path:line>` with the path relative to the repository root, at the line
that names the command. For a marker file or a lockfile, write its path alone.

## Workflow

### Step 1: List the command files

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in one
each read or command that yields only facts, returned with path and line.

Look for each command file in the project folder, then in each parent folder up
to the repository root. Take the nearest. Record each that exists:

- the CI workflow: a file under `.github/workflows/`, `.gitlab-ci.yml`,
  `.circleci/config.yml`, `bitbucket-pipelines.yml`, `azure-pipelines.yml`, or
  `Jenkinsfile`;
- the manifest, such as `package.json`, `pyproject.toml`, `go.mod`, or
  `Cargo.toml`, and the lockfile beside it;
- the task runner: `Makefile`, `justfile`, or `Taskfile.yml`;
- the README file and the CONTRIBUTING file.

### Step 2: Take the install command

The install command installs the dependencies from the lockfile and never
rewrites the lockfile. Take the package manager from the `packageManager` field
of `package.json`, when the field exists. Else take the ecosystem from the
lockfile and the manifest:

- npm, with `package-lock.json` or `npm-shrinkwrap.json`: `npm ci`;
- pnpm, with `pnpm-lock.yaml`: `pnpm install --frozen-lockfile`;
- yarn 1, with `yarn.lock` and no `.yarnrc.yml`:
  `yarn install --frozen-lockfile`;
- yarn 2 or newer, with `yarn.lock` and `.yarnrc.yml`:
  `yarn install --immutable`;
- bun, with `bun.lock` or `bun.lockb`: `bun install --frozen-lockfile`;
- uv, with `uv.lock`: `uv sync`;
- Poetry, with `poetry.lock`: `poetry install`;
- PDM, with `pdm.lock`: `pdm install`;
- Go: `go mod download`;
- Rust: `none: cargo test fetches the dependencies`;
- .NET: `dotnet restore`;
- Maven and Gradle: `none: the test command fetches the dependencies`;
- Composer, with `composer.lock`: `composer install`;
- Bundler, with `Gemfile.lock`: `bundle install`.

With two lockfiles beside one manifest and no `packageManager` field, take the
install command the CI workflow runs. Without one, write
`unknown: two lockfiles and no packageManager field`. For any other ecosystem,
take the install command of the CI workflow. Without one, write
`unknown: no install command`.

### Step 3: Take each command

Take each of build, lint, type-check, format, and test from the first command
file that has it, in this order:

1. the CI workflow: the step that runs the command. For test, the CI step that
   runs the unit tests;
2. the scripts of the manifest, such as the `scripts` field of `package.json`;
3. a named command of the task runner: `Makefile`, then `justfile`, then
   `Taskfile.yml`;
4. the README file, then the CONTRIBUTING file.

A step, a script, or a named command matches a command by its name or by the
tool it runs. Write a script of `package.json` as
`<package manager> run <script>`, with the package manager of Step 2, else npm.

**Test that no command file names.** Take the runner from the first line of
_Test runners_ in `references/runners.md` whose file the project has. Without a
runner from that list, write `test: none`.

**Run prefix.** With uv, Poetry, or PDM from Step 2, prefix the test command
with `uv run`, `poetry run`, or `pdm run`, unless it already starts with that
prefix.

**Format.** The format command writes nothing and fails on a file that the
formatter would change. When the command file runs the formatter in a form that
writes, write the formatter's check form instead. Without a check form, write
`format: none`.

**Test one file.** Take it from the command files in the order above. Else build
it from the test command by _Test one file_ in `references/runners.md`.

### Step 4: Return the command map

Fill the command map, one line per command. From a skill, end with the command
map and nothing else. From a user, show the command map in chat.
