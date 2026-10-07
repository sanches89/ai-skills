# Runners

## Test runners

Each line names a file and the runner it selects:

- `pytest.ini`, or `pytest` in `pyproject.toml`: `pytest`;
- `go.mod`: `go test ./...`;
- `Cargo.toml`: `cargo test`;
- `phpunit.xml` or `phpunit.xml.dist`: `phpunit`;
- a `*.sln` or `*.csproj` file: `dotnet test`;
- `pom.xml`: `mvn test`;
- `build.gradle` or `build.gradle.kts`: `./gradlew test`;
- `Gemfile` with `rspec`: `bundle exec rspec`.

## Test one file

Jest, Vitest, Mocha, the Node.js test runner, pytest, PHPUnit, and RSpec take a
test file as an argument: append `<file>`. For `npm test` and `npm run`, append
it after `--`, and only when the script ends with one of those runners. Other
runners select a package or a class:

- Go: `go test ./<folder of <file>>`;
- Rust, for a file under `tests/`: `cargo test --test <file name without .rs>`;
- .NET: `dotnet test --filter FullyQualifiedName~<class of <file>>`;
- Maven: `mvn test -Dtest=<class of <file>>`;
- Gradle: `./gradlew test --tests <class of <file>>`. For any other runner,
  write `test one file: none`.
