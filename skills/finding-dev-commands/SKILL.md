---
name: finding-dev-commands
description: Finds a project's build, lint, type-check, format, test, single-file test, and install commands from its CI, manifests, task runners, and docs, running none of them. Use when the user or a skill needs to know how to build, test, lint, format, or install a project.
license: MIT
argument-hint: <folder>
---

# Finding dev commands

Find the build, lint, type-check, format, test, single-file test, and
install commands of a project, each with the file and line it came from.
Run none of them.

## Hard rules

1. **Read-only.** Change no file and run no project command: no build, no
   test, no install. A run writes build output, reports, or dependencies,
   and changes the state that the caller measures next.
2. **Never ask.** Settle every command from the files, else record `none`
   or `unknown` with the reason. A caller runs this skill unattended, and a
   question stops it.

## Invocation

When the invocation text starts with `from <skill name>:`, that skill
invoked this run. Ask nothing, and end with the command map and nothing
else. The form is `from <caller>: find[ in <folder>]`. The project folder
is `<folder>`, else the repository root.

Without that prefix, a user invoked this run. Take the project folder from
the request, else the repository root. Show the command map in chat.

The command map:

```text
build: <command> (<source path:line>) | none
lint: <command> (<source>) | none
type-check: <command> (<source>) | none
format: <command that checks formatting and writes nothing> (<source>) | none
test: <command> (<source>) | none
test one file: <command with <file> in place of the test file> | none
install: <command> (<source>) | none: <reason> | unknown: <reason>
```

Write `<source>` as `path:line`, with the path relative to the repository
root. For a marker file or a lockfile, write its path alone.

## Workflow

### Step 1: List the sources

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Look for each source in the project folder, then in each parent folder up
to the repository root, and take the nearest. Record each that exists:
- the CI workflow: a file under `.github/workflows/`, `.gitlab-ci.yml`,
  `.circleci/config.yml`, `bitbucket-pipelines.yml`,
  `azure-pipelines.yml`, or `Jenkinsfile`;
- the manifest, such as `package.json`, `pyproject.toml`, `go.mod`, or
  `Cargo.toml`, and the lockfile beside it;
- the task runner: `Makefile`, `justfile`, or `Taskfile.yml`;
- the README file and the CONTRIBUTING file.

### Step 2: Take the install command

The install command installs the dependencies from the lockfile and never
rewrites the lockfile. Take the package manager from the `packageManager`
field of `package.json`, such as `pnpm@9.12.0`, when the field exists.
Else take the ecosystem from the lockfile and the manifest:
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

With two lockfiles beside one manifest and no `packageManager` field, take
the install command the CI workflow runs. Without one, write
`unknown: two lockfiles and no packageManager field`. For any other
ecosystem, take the install command of the CI workflow. Without one, write
`unknown: no install command`.

### Step 3: Take each command

Take each of build, lint, type-check, format, and test from the first
source that has it, in this order:
1. the CI workflow: the step that runs the command. For test, the CI step
   that runs the unit tests;
2. the scripts of the manifest, such as the `scripts` field of
   `package.json`;
3. the target of the task runner: `Makefile`, then `justfile`, then
   `Taskfile.yml`;
4. the README file, then the CONTRIBUTING file.

A step, a script, or a target matches a command by its name or by the tool
it runs. Write a script of `package.json` with the package manager of Step
2, else npm: `npm run <script>`, `pnpm run <script>`, `yarn run <script>`,
or `bun run <script>`.

**Test without a source.** Take the runner from the first line below whose
file the project has:
- `pytest.ini`, or `pytest` in `pyproject.toml`: `pytest`;
- `go.mod`: `go test ./...`;
- `Cargo.toml`: `cargo test`;
- `phpunit.xml` or `phpunit.xml.dist`: `phpunit`;
- a `*.sln` or `*.csproj` file: `dotnet test`;
- `pom.xml`: `mvn test`;
- `build.gradle` or `build.gradle.kts`: `./gradlew test`;
- `Gemfile` with `rspec`: `bundle exec rspec`.

Without a runner from that list, write `test: none`.

**Run prefix.** With uv, Poetry, or PDM from Step 2, write the test command
as `uv run <test command>`, `poetry run <test command>`, or
`pdm run <test command>`. Skip the prefix when the command already starts
with it.

**Format.** The format command writes nothing and fails on a file that the
formatter would change. When the source runs the formatter in a form that
writes, write the formatter's check form instead: `prettier --check`,
`black --check`, `ruff format --check`, `cargo fmt --check`, or
`dotnet format --verify-no-changes`. Without a check form, write
`format: none`.

**Test one file.** Take it from the sources in the order above. Else build
it from the test command. Jest, Vitest, Mocha, the Node.js test runner,
pytest, PHPUnit, and RSpec take a test file as an argument: append `<file>`.
For `npm test` and `npm run`, append it after `--`, and only when the script
ends with one of those runners. Other runners select a package or a class:
- Go: `go test ./<folder of <file>>`;
- Rust, for a file under `tests/`: `cargo test --test <file name without
  .rs>`;
- .NET: `dotnet test --filter FullyQualifiedName~<class of <file>>`;
- Maven: `mvn test -Dtest=<class of <file>>`;
- Gradle: `./gradlew test --tests <class of <file>>`.
For any other runner, write `test one file: none`.

### Step 4: Return the command map

Fill the command map, one line per command. From a skill, end with the
command map and nothing else. From a user, show the command map in chat.
