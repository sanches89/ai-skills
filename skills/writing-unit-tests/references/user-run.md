# User run

A user run follows the steps of `SKILL.md` with the text below.

## Step 1: Test setup

The paths are the code to test, or the test files to review. Without a test
setup, tell the user the reason and stop.

## Step 2: Write or review

Pick the mode from the user's request:

- **Write mode**: the user asks for tests written or fixed, for a regression
  test, or for tests that pin down code before a change. Write the tests by the
  rules and the _Test-first loop_.
- **Review mode**: the user asks for tests reviewed. Run the checks of
  `checks.md` over the test files. Fix a failure only when the user asked for
  changes.

## Step 3: Verify

Skip this step in review mode without changes. Run each test file this run added
or edited alone, with the `test one file` command. Then run the test command.
Fix every failure. Then run the checks of `checks.md` over every test file this
run added or edited, and fix every check that fails. After any fix, run this
step again.

## Step 4: Report

End with the test files this run added or edited, each with the behaviors its
tests prove. Add every result or test a rule says to report. In review mode, end
with one line per failure, `<path:line> <check>`, or `pass`.
