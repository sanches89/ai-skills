# Add flags to the line counter CLI

## Summary

src/cli.js prints the line count of a file. Add `--verbose` and
`--out <path>`.

## Success criteria

- `node src/cli.js input.txt` still prints 4.
- `node src/cli.js --verbose input.txt` prints `input.txt: 4 lines`.
- `node src/cli.js --out out.txt input.txt` writes 4 to out.txt and prints
  nothing.

## Scope

### In scope

- src/cli.js.

### Out of scope

- A test framework.
- Other flags.

## Approach

- src/cli.js parses the flags `--verbose` and `--out <path>` before the file
  argument. The file is the first argument that is not a flag or the value of
  `--out`.
- Without flags the output is unchanged.

## Decisions

- Parse by hand with process.argv. Add no dependency.
- `--verbose` and `--out` can combine: the verbose line is written to the file.

## Context

- The repo has no test framework and no test command. Node 22.

## References

- None.

## Subtasks

None.

## Verification

1. `node src/cli.js input.txt` prints 4.
2. `node src/cli.js --verbose input.txt` prints `input.txt: 4 lines`.
3. `node src/cli.js --out out.txt input.txt && cat out.txt` prints 4.
