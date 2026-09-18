# Test reports

Read this file in Step 2c. It says where to take the install command and the
test command from. It gives the options that make each test runner write a
JUnit report and a coverage report.

## Sources

Take the test command from the first source that has one, in this order:
1. the CI workflow: a file under `.github/workflows/`, `.gitlab-ci.yml`,
   `.circleci/config.yml`, `bitbucket-pipelines.yml`, `azure-pipelines.yml`,
   or `Jenkinsfile`. Take the test step of the job that runs the unit
   tests;
2. the `test` script of `package.json`;
3. the `test` target of `Makefile`, `justfile`, or `Taskfile.yml`, in that
   order;
4. the README file, then the CONTRIBUTING file.

Without a test command in any source, take the runner from the first line
below whose file the repository has:
- `pytest.ini`, or `pytest` in `pyproject.toml`: `pytest`;
- `go.mod`: `go test ./...`;
- `Cargo.toml`: `cargo test`;
- `phpunit.xml` or `phpunit.xml.dist`: `phpunit`;
- a `*.sln` or `*.csproj` file: `dotnet test`;
- `pom.xml`: `mvn test`;
- `build.gradle` or `build.gradle.kts`: `./gradlew test`;
- `Gemfile` with `rspec`: `bundle exec rspec`.

Without a runner from that list, record the reason `no test command`.

## Install commands

The install command installs the dependencies from the lockfile and never
rewrites the lockfile. Take the ecosystem from the lockfile and the manifest
of the project:
- npm, with `package-lock.json`: `npm ci`;
- pnpm, with `pnpm-lock.yaml`: `pnpm install --frozen-lockfile`;
- yarn 1, with `yarn.lock` and no `.yarnrc.yml`:
  `yarn install --frozen-lockfile`;
- yarn 2 or newer, with `yarn.lock` and `.yarnrc.yml`:
  `yarn install --immutable`;
- bun, with `bun.lock` or `bun.lockb`: `bun install --frozen-lockfile`;
- uv, with `uv.lock`: `uv sync`. Run the test command as
  `uv run <test command>`;
- Poetry, with `poetry.lock`: `poetry install`. Run the test command as
  `poetry run <test command>`;
- PDM, with `pdm.lock`: `pdm install`. Run the test command as
  `pdm run <test command>`;
- Go: `go mod download`;
- Rust: `none`. `cargo test` fetches the dependencies;
- .NET: `dotnet restore`;
- Maven and Gradle: `none`. The test command fetches the dependencies;
- Composer, with `composer.lock`: `composer install`;
- Bundler, with `Gemfile.lock`: `bundle install`.

Take the package manager from the `packageManager` field of `package.json`
when the field exists, else from the lockfile. For any other ecosystem, take
the install command of the CI workflow. Without one, record `unknown` and
the reason `no install command`. Step 3b then skips the base tests and
coverage.

## Report options per runner

Add these options to the test command. Add nothing else: no reporter
package, no coverage package, no configuration file. `<dir>` is the output
folder that Steps 3b and 4a set.

```bash
# Node.js test runner
node --test --experimental-test-coverage \
  --test-reporter=junit --test-reporter-destination=<dir>/junit.xml \
  --test-reporter=lcov --test-reporter-destination=<dir>/lcov.info

# Vitest. Coverage only with @vitest/coverage-v8 or -istanbul installed.
vitest run --reporter=junit --outputFile=<dir>/junit.xml \
  --coverage --coverage.reporter=lcov --coverage.reportsDirectory=<dir>

# Jest. JUnit only with jest-junit installed.
jest --coverage --coverageReporters=lcov --coverageDirectory=<dir>

# pytest. Coverage only with pytest-cov installed.
pytest --junitxml=<dir>/junit.xml \
  --cov --cov-branch --cov-report=xml:<dir>/cobertura.xml

# Go. No JUnit report without another tool.
go test ./... -coverprofile=<dir>/cover.out

# Rust, with cargo-llvm-cov installed
cargo llvm-cov --lcov --output-path <dir>/lcov.info

# PHPUnit
phpunit --log-junit <dir>/junit.xml --coverage-cobertura <dir>/cobertura.xml

# .NET, with the coverlet collector of the default test template
dotnet test --collect:"XPlat Code Coverage" --results-directory <dir>

# Maven and Gradle write into build output, with the JaCoCo plugin configured:
#   target/surefire-reports/          build/test-results/test/
#   target/site/jacoco/jacoco.xml
#   build/reports/jacoco/test/jacocoTestReport.xml
```

For any other runner, read its help for a JUnit option and for an LCOV or
Cobertura option.

Record `<junit-report>` and `<coverage-report>` as the path of the JUnit
report and of the coverage report relative to `<dir>`, such as `junit.xml`
and `lcov.info`. Every JUnit report and coverage report that the measure
tool reads lives under `<dir>`, and `<coverage-report>` is always one file.
The runners below need a step to put them there:
- .NET writes the coverage report as
  `<dir>/<guid>/coverage.cobertura.xml`. Read `<guid>` from `ls <dir>`
  after the run. Record `<guid>/coverage.cobertura.xml`;
- Maven and Gradle write into the build output, which the report options do
  not move. After the test run, copy the folder of JUnit files to
  `<dir>/junit`. Copy the JaCoCo XML file to `<dir>/jacoco.xml`. Record
  `junit` and `jacoco.xml`. Copy from the folder the run wrote in: the
  worktree in Step 3, the repository root in Step 4.

Skip a report that needs a package the project lacks:
- JUnit for Jest without `jest-junit`;
- coverage for Vitest without `@vitest/coverage-v8` or
  `@vitest/coverage-istanbul`;
- coverage for pytest without `pytest-cov`;
- coverage for Rust without `cargo-llvm-cov`.

Skip the JUnit report for Go, Rust, and .NET: the options above write none.
The reason is `<runner> needs <package>` for a missing package, and
`<runner> writes no JUnit report` for Go, Rust, and .NET.

Turn branch coverage on when the runner has an option for it. A Go cover
profile holds no branch data. Keep the project's own coverage threshold in
force. The threshold is part of the test command. A threshold failure still
leaves the JUnit report and the coverage report written.
