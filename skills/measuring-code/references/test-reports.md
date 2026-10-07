# Test reports

Sections: Report rules; Report options per runner.

## Report rules

A test report is a JUnit XML file. A coverage report is a file in LCOV,
Cobertura XML, JaCoCo XML, or Go cover profile format.

- Make the project's own test command write both reports. Add only options.
  Never add a reporter package, a coverage package, or a configuration file.
- Write both reports into `<dir>`. Read a report inside the repository only
  where the build already writes it, in a folder that `.gitignore` covers.
- Run a coverage tool, such as `c8`, `coverage.py`, `tarpaulin`, or JaCoCo, only
  through the command the project already has.
- Turn branch coverage on when the runner has an option for it.
- Keep the project's own coverage threshold in force. A threshold failure still
  leaves both reports written.

## Report options per runner

Add only these options to the test command, and for Jest its environment
variable.

```bash
# Node.js test runner
node --test --experimental-test-coverage \
  --test-reporter=junit --test-reporter-destination=<dir>/junit.xml \
  --test-reporter=lcov --test-reporter-destination=<dir>/lcov.info

# Vitest. Coverage only with @vitest/coverage-v8 or -istanbul installed.
vitest run --reporter=junit --outputFile=<dir>/junit.xml \
  --coverage --coverage.reporter=lcov --coverage.reportsDirectory=<dir>

# Jest. Without jest-junit, leave out the variable and both --reporters.
JEST_JUNIT_OUTPUT_DIR=<dir> jest --reporters=default --reporters=jest-junit \
  --coverage --coverageReporters=lcov --coverageDirectory=<dir>

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

Record `<junit-report>` and `<coverage-report>` relative to `<dir>`, such as
`junit.xml` and `lcov.info`. Every report the measure tool reads lives under
`<dir>`, and `<coverage-report>` is one file. These runners need a step to put
them there:

- .NET writes the coverage report as `<dir>/<guid>/coverage.cobertura.xml`. Read
  `<guid>` from `ls <dir>` after the run. Record
  `<guid>/coverage.cobertura.xml`;
- Maven and Gradle write into the build output under `<root>`. After the test
  run, copy the folder of JUnit files to `<dir>/junit` and the JaCoCo XML file
  to `<dir>/jacoco.xml`. Record `junit` and `jacoco.xml`.

Skip a report that needs a package the project lacks, with the reason
`<runner> needs <package>`:

- JUnit for Jest without `jest-junit`;
- coverage for Vitest without `@vitest/coverage-v8` or
  `@vitest/coverage-istanbul`;
- coverage for pytest without `pytest-cov`;
- coverage for Rust without `cargo-llvm-cov`.

Skip the JUnit report for Go, Rust, and .NET, with the reason
`<runner> writes no JUnit report`. When the test command runs without a JUnit
report, count the tests from its output: add the passed, failed, and skipped
counts to the reason on the `tests` line of the measurement record.
