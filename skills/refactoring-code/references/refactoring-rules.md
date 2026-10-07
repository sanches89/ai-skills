# Refactoring rules

Sections: Behavior; Size of a change; Duplication; Names; Functions; Modules;
Removing code; Contract changes the request names; Tests during a refactoring;
Never.

Write the rules of _Behavior_, _Size of a change_, _Tests during a refactoring_,
and _Never_ into the task's Decisions section. Write the rules a subtask's
refactoring needs into that subtask's Context section. A convention of the
project, from Step 3a, replaces a rule here. A limit the project configures
replaces a value here.

## Behavior

- Change structure only. Keep every returned value, state change, raised error,
  written output, and call to an external system the same.
- Keep odd behavior too, and list it under the task's _Out of scope_.
- Keep the order of side effects. Two writes, two calls, or a write and a read
  keep their order.
- Keep when each expression runs. Extracting a short-circuit operand, a lazy
  value, or a default argument changes when it runs.
- Keep error messages, log text, and metric names, as parts of the contract.
- Tune no performance. On a path the docs or the request mark as hot, keep the
  same number of loops, allocations, and calls to external systems.
- Keep a masked error masked and a stub that code reaches a stub, and list each
  under the task's _Out of scope_.

## Size of a change

- Apply one refactoring per subtask, named as on its finding's `refactoring`
  line. A finding with several gets one subtask per refactoring, in the order of
  that line.
- Keep the code able to build and pass after every subtask.
- Revert the change of a subtask when a check fails. Then apply the refactoring
  another way. Never stack a repair on a failing change.
- Give a rename, a move, and a format change each their own subtask, apart from
  a structural change.
- Reformat only the lines a refactoring touches.
- Use a tool for a mechanical edit across many files: the agent's
  language-server rename, or the structural rewrite tool that the subtask's
  Context names. Review the full diff it produces.
- Leave a failure of a `writing-clean-code` budget that the subtask's
  refactoring does not remove. The next `refactoring-code` run reviews it.

## Duplication

- Merge two copies only when they state the same rule and change together, never
  when they only look alike today.
- Extract shared code from three copies, or from two copies of one rule.
- Give the extracted function the name of the rule, never the name of its
  callers.
- Never merge copies by adding a flag parameter that selects the behavior. Keep
  two functions and extract their shared part.
- Add a new interface or base type only with 2 implementations or more, or as
  the wrapper of a system boundary. A test double is no implementation.
- Add a generic parameter or an option only with a caller that passes it. A test
  that passes the parameter of a seam is such a caller, also a test the refactor
  task plans.
- Replace a helper that repeats a function of the project or of the standard
  library with a call to that function.

## Names

- Name a symbol by what it means to its callers, never by how it works.
- Use the words of the project's domain and glossary, one word per concept
  across the refactor scope.
- Rename with a tool that updates every reference. Then search the old name as
  text in strings, docs, and configuration.
- Never rename a part of the contract, unless the request names the rename.

## Functions

- Split a function that does two things into one function per thing.
- Extract a block that needs a comment to explain what it does. Name the new
  function with the words of the comment.
- Replace conditions nested 3 levels or deeper with guard clauses that return
  early.
- Give a complex condition a name: extract it into a variable or a function.
- Replace a flag argument with one function per flag value.
- Replace a long parameter list with a parameter object when the same values
  travel together in three places or more. Else pass the whole object the values
  come from, remove a flag argument, or extract a function.
- Separate a query from a modifier. A function that returns a value changes no
  state that a caller observes.
- Narrow the scope of a mutable variable to the smallest block that uses it.

## Modules

- Move a function to the module whose data it uses most.
- Split a module that changes for two unrelated reasons.
- Hide a field or a data structure behind the functions that use it, before
  changing its shape.
- Break a dependency cycle by moving the shared part into a third module.
- Reach a system boundary through a parameter or a constructor argument. A
  decision never reads the clock, the environment, or a global on its own.
- Introduce a seam so that no caller changes. A Parameterize seam takes a
  default equal to the current collaborator. Move the callers only in a contract
  change the request names.
- Keep a decision in a function that returns a value. The caller performs the
  effect.
- Reuse through composition. Keep a subclass only where every caller of the
  parent works with it.
- Give one design decision, a format, a layout, or a rule, one owner module.
- Keep a code file at 400 lines or fewer, or within the project's own limit.
  Split by concept, one concept per file.
- Wire a collaborator by an import and a call that a search for its name finds.
  Use reflection, a string name, or a patch only where the project's framework
  requires it.
- Follow the layout and the layers of the project. Never add a layer.
- Never replace a working module with a rewrite. Reach the new structure through
  a sequence of refactorings.

## Removing code

- Remove code only by the proof in the evidence of its finding: the search of
  every reference, or the guarantee that makes a check dead. The subtask names
  that proof.
- Remove commented-out code.
- Remove a comment that repeats the code. Keep a comment that says why.

## Contract changes the request names

- Change a part of the contract through three subtasks: add the new form beside
  the old one, move every caller, remove the old form.
- Keep the old form working until its last caller moved.
- In a library that others install, keep the old form and mark it deprecated in
  the project's own way. Remove it only when the request says so.

## Tests during a refactoring

- Run the tests that cover the changed code after every subtask.
- Edit an existing test only as the `writing-unit-tests` skill allows. The weak
  test or over-mocked test that a subtask names is the one reason to change an
  assertion.
- Treat a test that fails after a refactoring as proof of a behavior change.
  Revert the change. Never edit the assertion.
- List a test that breaks on every structure change under the task's _Out of
  scope_, as a finding: it asserts on how the code works.
- Keep the characterization tests that a subtask names in the change.

## Never

- Never mix a refactoring with a feature, a bug fix, or a dependency upgrade.
- Never add a library, a framework, or a code pattern the project does not use.
- Never change a public signature, a file format, or a schema without the
  request naming it.
- Never silence a compiler warning, a lint rule, or a type error to make a check
  pass.
- Never continue past the refactor task. List what is left.
