# Refactoring rules

Follow these rules for every plan entry, in any language. Prefer a convention
of the project over a rule here, as recorded in Step 3a.

## Behavior

- Change structure only. Keep every returned value, state change, raised
  error, written output, and call to an external system the same.
- Keep odd behavior too. A caller depends on it until a test or the user says
  otherwise. Put it in the refactor report under *Bugs found*.
- Keep the order of side effects. Two writes, two calls, or a write and a
  read stay in the order they had.
- Keep the evaluation rules of the language in mind. Extracting a
  short-circuit operand, a lazy value, or a default argument changes when it
  runs.
- Keep error messages, log text, and metric names. They are part of the
  contract.
- Tune no performance. On a path the docs or the request mark as hot, keep the
  same number of loops, allocations, and calls to external systems.

## Size of a change

- Apply one refactoring per plan entry. Give it its name from
  `smell-catalog.md`.
- Keep the code able to build and pass after every plan entry.
- Restore the checkpoint when a check fails. Then apply the refactoring
  another way. Never stack a repair on a failing change.
- Keep a mechanical change apart from a structural one. A rename, a move, and
  a format change each get their own plan entry.
- Reformat only the lines a refactoring touches. Leave every other line as it
  is.
- Use a tool for a mechanical edit across many files: the agent's
  language-server rename, or a structural rewrite tool from
  `measurement-tools.md`. Review the full diff it produces.

## Duplication

- Merge two copies only when they state the same rule and change together.
- Leave two copies alone when they only look alike today. Different reasons
  to change outweigh the lines saved.
- Extract shared code from three copies, or from two copies of one rule.
- Give the extracted function the name of the rule, never the name of its
  callers.
- Never merge copies by adding a flag parameter that selects the behavior.
  Keep two functions and extract their shared part.
- Add a new interface, base type, generic parameter, or option only with
  three users. The wrong abstraction costs more than the duplication.

## Names

- Name a symbol by what it means to its callers, never by how it works.
- Use the words of the project's domain and glossary. Use one word per
  concept across the refactor scope.
- Rename with a tool that updates every reference. Then search the old name as
  text, to find strings, docs, and configuration that the tool missed.
- Never rename a part of the contract, unless the request names the rename.

## Functions

- Split a function that does two things into one function per thing.
- Extract a block that needs a comment to explain what it does. Name the new
  function with the words of the comment.
- Replace nested conditions with guard clauses that return early.
- Give a complex condition a name: extract it into a variable or a function.
- Replace a flag argument with one function per flag value.
- Replace a long parameter list with a parameter object when the same values
  travel together in three places.
- Separate a query from a modifier. A function that returns a value changes no
  state that a caller observes.
- Narrow the scope of a mutable variable to the smallest block that uses it.

## Modules

- Move a function to the module whose data it uses most.
- Split a module that changes for two unrelated reasons.
- Hide a field or a data structure behind the functions that use it, before
  changing its shape.
- Break a dependency cycle by moving the shared part into a third module.
- Follow the layout and the layers of the project. Never add a layer.
- Never replace a working module with a rewrite. Reach the new structure
  through a sequence of refactorings.

## Removing code

- Remove code only with proof that nothing reaches it. Search every reference
  as a symbol and as text, including reflection, dependency injection,
  configuration, templates, and build scripts.
- Never remove a part of the contract on the grounds that the repository has
  no caller.
- Remove a parameter, a field, or a branch that no caller uses, by the same
  proof.
- Remove commented-out code. Version control keeps it.
- Remove a comment that repeats the code. Keep a comment that says why.

## Contract changes the request names

- Change a part of the contract through three plan entries: add the new form
  beside the old one, move every caller, remove the old form.
- Keep the old form working until its last caller moved.
- In a library that others install, keep the old form and mark it deprecated
  in the project's own way. Remove it only when the request says so.

## Tests during a refactoring

- Run the tests that cover the changed code after every plan entry.
- Edit an existing test only for an import, a path, or a symbol name that the
  refactoring moved or renamed.
- Treat a test that fails after a refactoring as proof of a behavior change.
  Restore the checkpoint. Never edit the assertion.
- Treat a test that breaks on every structure change as a finding. It asserts
  on how the code works. List it under *Left for later*.
- Keep the characterization tests of Step 7 in the change.

## Never

- Never mix a refactoring with a feature, a bug fix, or a dependency upgrade.
- Never add a library, a framework, or a code pattern the project does not
  use.
- Never change a public signature, a file format, or a schema without the
  request naming it.
- Never silence a compiler warning, a lint rule, or a type error to make a
  check pass.
- Never continue past the refactor plan. List what is left.
