---
name: writing-clean-code
description: Writes, cleans up, and reviews code by 14 clean code principles, each with a rule and a check that a diff passes or fails. Use when code is written, changed, cleaned up, or reviewed for names, error handling, coupling, SOLID, or clean code, never to list smells, long functions, or duplication in existing code.
license: MIT
compatibility: Requires the finding-dev-commands skill.
argument-hint: <code to write | paths or git range to review>
---

# Writing clean code

Write and review code by 14 principles.

## Terms

These words have one meaning in this skill.

- **System boundary**: the network, files, a database, the clock,
  randomness, the process environment, or third-party code. Third-party
  code includes a framework, a driver, an HTTP client, and a UI toolkit.

## Invocation

An invocation text that starts with `from <skill name>:` comes from another
skill. Ask nothing. Follow the form it names. End with its return block and
nothing else. Without that prefix, a user invoked this run: read
`references/user-run.md` first.

- `from <caller>: write`: load the principles. Return `principles loaded`.
- `from <caller>: check <git range | paths>`: run Step 1 without a mode,
  then Step 3 over the git range or paths. Return one line per failure,
  `<path:line> <principle number>: <failure>`, or `pass`.

## Workflow

### Step 1: Load the code

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in
one each read or command that yields only facts, returned with path and
line.

Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, and the docs that cover the
touched code. Record the naming, error handling, and formatting conventions.
Invoke the `finding-dev-commands` skill (in Claude Code, with the `Skill`
tool) with `from writing-clean-code: find`. Keep its `format`, `test`, and
`test one file` lines.

Record whether the project has a test setup. When the agent has the
`writing-unit-tests` skill, invoke it with `from writing-clean-code: setup
for <paths>, test <command>, test one file <command>`. `<paths>` is the
paths the request names, else the repository root. Fill each `<command>`
from the line of the same name. Leave out each part whose line reads
`none`. The project has a test setup when the returned block reads
`test setup: yes`. Without that skill, it has one unless the `test` line
reads `none`.

### Step 2: Write

Run this step only in a user run, by `references/user-run.md`.

### Step 3: Check the diff

Take the diff from the first case that applies:
1. write mode: the lines Step 2 wrote or changed;
2. a git range: `git diff <range>`;
3. review mode with paths: every line of every file under them, as added
   lines;
4. the `check` form with paths: `git diff HEAD -- <paths>`, plus every
   untracked file under them as added lines;
5. else: `git diff HEAD`, plus every untracked file as added lines.

Run the **Check** of every principle over the diff. Record each failure as
`<path:line> <principle number>: <failure>`.

### Step 4: Fix and report

Run this step only in a user run, by `references/user-run.md`.

## Principles

Each principle holds a rule and a **Check** that the diff passes or fails.
A convention of the project and a decision of the task the caller works on
beat a principle: a failure they overrule is no failure. The numbers in the
principles are budgets for the lines a change writes or edits. Review mode
with paths applies them to every line under those paths.

### 1. Meaningful names

A name states what the thing is or does. Use pronounceable, searchable words.
Name a boolean as a question. Use one word per concept across the code. Write
no abbreviation, no type prefix, and no name that misleads.

**Check:** no name needs a comment to explain it. No single-letter name
outside a loop index.

### 2. Small functions

A function does one thing at one level of abstraction. Keep it to 20 lines
or fewer and 2 parameters or fewer. A third parameter becomes an object. No
boolean flag parameter: split the function into one function per flag
value. The name states every side effect.

**Check:** every function is 20 lines or fewer, takes 2 parameters or fewer,
and holds statements of one abstraction level only.

### 3. Single responsibility

A class or module has one reason to change: one actor whose request edits it.
Split code that serves two actors.

**Check:** one sentence describes the class without the word "and".

### 4. No duplication

Each piece of knowledge has one representation. Extract a duplicate when the
copies change together, from two copies on. Leave copies that change for
different reasons.

**Check:** no block of 3 lines or more, other than braces and imports,
repeats in the diff. No literal repeats where one change should update every
copy.

### 5. Comments explain why

A comment states why the code does what it does: a constraint, a trade-off,
or a defect it works around. The code states what and how. Delete
commented-out code.

**Check:** no comment restates the next line. No commented-out code.

### 6. Formatting

Run the format command. When it reports a file you wrote or changed, format
that file with the project formatter's write form, such as
`prettier --write`. Then run the format command again. Without a format
command, keep related code together and separate concepts with a blank line.
Declare a variable next to its first use. Place a caller above its callee.

**Check:** the format command reports no change. Without one, check the
rule above by reading.

### 7. Error handling

Throw an error, never return an error code. Never return or pass `null` for an
expected case: return an empty collection or a typed result. Never swallow an
error. Catch it only where the code can handle it. An error message holds the
failed operation and the value that caused it.

**Check:** no empty `catch`. No `catch` that returns a default for a failure.
Every thrown error names the operation and the value.

### 8. Boy Scout rule

Leave the code you write or change cleaner than you found it: name every new
thing well, and delete the code your change makes dead. Never edit code
outside the change to clean it.

**Check:** every edited line serves the request.

### 9. Tests

With a test setup, as Step 1 records it, each added or changed behavior has
a test. Without one, write no test.

**Check:** with a test setup, every changed behavior has a test that fails
without the change. Without one, principle 9 records no failure.

### 10. Simple design

In this order, the code: passes every test, holds no duplication, expresses
the intent of the author, and uses the fewest classes and methods that
satisfy the first three.

**Check:** the tests pass, then principles 1 and 4 pass, then no class or
function exists only to satisfy a pattern.

### 11. Law of Demeter

A method calls only: its own object, its parameters, objects it creates, and
the fields of its object. It never reaches through a chain of objects. The
rule does not apply to plain data structures, fluent builders, or query
interfaces.

**Check:** no chain of 2 method calls or more reaches through another
object's collaborators.

### 12. Separation of concerns

Business logic imports no framework, database driver, HTTP client, or
third-party type. Wrap each behind an interface that the project owns, and
pass it in from outside.

**Check:** no business-logic file imports a framework, a driver, or an HTTP
client. No business-logic class creates its own collaborator.

### 13. Open/closed, Liskov, interface segregation, dependency inversion

These four are the O, L, I, and D of SOLID. Principle 3 is the S.

- **Open/closed.** Add behavior by adding code, not by editing a branch
  chain. Replace a `switch` on a type with a lookup or polymorphism.
- **Liskov.** A subtype works wherever its parent works. It never throws on
  an inherited method and never narrows what the parent accepts.
- **Interface segregation.** A client depends only on the methods it calls.
- **Dependency inversion.** High-level code depends on an abstraction, and
  the detail implements it, in the form principle 12 states.

**Check:** no new case added to a type `switch`. No override that throws or
rejects an input the parent accepts. No interface method that a client never
calls.

### 14. KISS and YAGNI

Write the simplest code that meets the request. Add no abstraction, option,
parameter, hook, or layer without a use that exists today. Add an interface
only with 2 implementations or more, or as the wrapper of a system boundary.
A test double is no implementation. Add an option or a parameter only with
a caller that passes it. A test that passes a collaborator in through the
parameter is such a caller.

**Check:** every interface has 2 implementations or more besides test
doubles, or wraps a system boundary. Every option and every parameter has a
caller that passes it.
