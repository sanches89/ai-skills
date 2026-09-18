# Smell catalog

Every smell this skill reports, in any language. A function is a function, a
method, or a procedure. A module is a class, a file, or a package. Skip an
entry that the language of the code has no form for.

Each entry gives:
- **Signal**: what shows the smell, in the measurement summary or in the code;
- **Refactoring**: the named change that removes it;
- **Leave it when**: the case where the structure is right as it is.

The limits named here are the defaults of `measurement-tools.md`. The
project's own limits replace them.

## Duplication

- **Duplicated code**
  - Signal: an entry in `duplication.top`, or the same statements in two
    places.
  - Refactoring: Extract Function. Then Move Function to a shared module when
    the copies live in two modules.
  - Leave it when: the copies change for different reasons, or fewer than
    three copies exist and they state no single rule.
- **Repeated condition**
  - Signal: the same `switch` or `if` chain over one value in three places.
  - Refactoring: Replace Conditional with Lookup Table, or Replace Conditional
    with Polymorphism in a language with types that dispatch.
  - Leave it when: the chain exists once, or the branches share nothing.
- **Parallel modules**
  - Signal: two modules with the same functions under different names.
  - Refactoring: Rename until the names match, then Extract Module for the
    shared part.
  - Leave it when: two teams or two external systems own them.

## Size

- **Long function**
  - Signal: `length` above its limit of 50 lines, or a block that needs a
    comment to say what it does.
  - Refactoring: Extract Function, Decompose Conditional, Split Loop.
  - Leave it when: the function is one flat list of steps with no branch,
    such as a configuration table or a route list.
- **Complex function**
  - Signal: `ccn` above its limit of 10, or nesting deeper than 3 levels.
  - Refactoring: Replace Nested Conditional with Guard Clauses, Decompose
    Conditional, Extract Function.
  - Leave it when: the branches are one flat `switch` that maps values to
    results.
- **Long parameter list**
  - Signal: `params` above its limit of 4.
  - Refactoring: Introduce Parameter Object, Preserve Whole Object, Remove
    Flag Argument.
  - Leave it when: the signature is part of the contract.
- **Large module**
  - Signal: a file at the head of `hotspots.top`, or a module whose functions
    fall into groups that share no data.
  - Refactoring: Extract Module, Move Function.
  - Leave it when: the file is a generated index or a list of declarations.

## Names

- **Mysterious name**
  - Signal: a name that needs the body to be understood, an abbreviation, a
    name with a type in it, or two names for one concept.
  - Refactoring: Rename.
  - Leave it when: the name is part of the contract, or the domain uses that
    exact word.
- **Misleading name**
  - Signal: a name that says less or more than the code does, such as a
    `get` that writes.
  - Refactoring: Rename. Then Separate Query from Modifier when the function
    does both.
  - Leave it when: the name is part of the contract.

## Conditionals

- **Nested conditional**
  - Signal: an `else` branch that holds the main path, or 3 levels of nesting.
  - Refactoring: Replace Nested Conditional with Guard Clauses.
  - Leave it when: both branches are normal paths of equal weight.
- **Complex condition**
  - Signal: a condition with three or more operators, or a negated compound.
  - Refactoring: Extract Variable, or Extract Function with a name that
    states the rule.
  - Leave it when: the condition is a standard idiom of the language.
- **Flag argument**
  - Signal: a boolean or an enum parameter that picks between two bodies.
  - Refactoring: Remove Flag Argument: one function per value.
  - Leave it when: the flag passes through to the contract unchanged.

## Data

- **Data clump**
  - Signal: the same three or more values passed or stored together in three
    places.
  - Refactoring: Introduce Parameter Object, Extract Module for the group.
  - Leave it when: the values only meet by accident, such as `x` and `y` of
    unrelated things.
- **Primitive obsession**
  - Signal: a string or a number that carries rules, such as a currency
    amount, a range, or an identifier that gets parsed in many places.
  - Refactoring: Replace Primitive with Object, in the form the language and
    the project use for value types.
  - Leave it when: the value has no rule beyond its type.
- **Mutable shared data**
  - Signal: a global or a module-level variable written from more than one
    function.
  - Refactoring: Encapsulate Variable, then narrow who writes it.
  - Leave it when: the project's framework requires that form.
- **Temporary field**
  - Signal: a field set only during one operation and empty otherwise.
  - Refactoring: Extract Module for the operation, or turn the field into a
    local variable or a parameter.
  - Leave it when: a serialization format requires the field.

## Coupling

- **Feature envy**
  - Signal: a function that reads more data of another module than of its
    own.
  - Refactoring: Move Function, or Extract Function and move the part.
  - Leave it when: the function is a mapper or a serializer between the two
    modules by design.
- **Shotgun surgery**
  - Signal: one kind of change that touches many modules, shown by files that
    change together in the git history.
  - Refactoring: Move Function and Move Field until one module holds the
    rule.
  - Leave it when: the modules are layers that the architecture keeps apart.
- **Divergent change**
  - Signal: one module that changes for unrelated reasons, shown by a hotspot
    whose commits cover different subjects.
  - Refactoring: Extract Module, one per reason.
  - Leave it when: the module is a composition root that wires the others.
- **Message chain**
  - Signal: a caller that walks `a.b().c().d()` through three objects it does
    not own.
  - Refactoring: Hide Delegate, or Extract Function and Move Function toward
    the data.
  - Leave it when: the chain is a fluent builder or a query interface.
- **Middle man**
  - Signal: a module whose functions only forward to another module.
  - Refactoring: Remove Middle Man, Inline Function.
  - Leave it when: the module is a boundary that the architecture requires,
    such as an adapter to an external system.
- **Dependency cycle**
  - Signal: two modules that import each other, directly or through a third.
  - Refactoring: Extract Module for the shared part, then Move Function.
  - Leave it when: the language and the project treat the two files as one
    module.

## Dead weight

- **Dead code**
  - Signal: a symbol with no reference, a branch that no input reaches, a
    parameter that no caller sets, or a finding of the project's dead-code
    tool.
  - Refactoring: Remove Dead Code, with the proof that
    `refactoring-rules.md` requires.
  - Leave it when: the symbol is part of the contract, or reflection or
    configuration reaches it.
- **Speculative generality**
  - Signal: an interface with one implementation, a parameter with one value,
    a hook that no one uses.
  - Refactoring: Inline Function, Collapse Hierarchy, Remove Parameter.
  - Leave it when: a test double is the second implementation, or the
    contract exposes the extension point.
- **Lazy element**
  - Signal: a function or a module that adds a name and nothing else.
  - Refactoring: Inline Function, Inline Module.
  - Leave it when: the name states a rule that its body does not.

## Comments

- **Comment that explains what**
  - Signal: a comment that restates the next lines.
  - Refactoring: Extract Function or Rename until the comment adds nothing,
    then remove it.
  - Leave it when: the comment says why, names an origin, or warns of a
    consequence.
- **Commented-out code**
  - Signal: code inside a comment.
  - Refactoring: Remove Dead Code.
  - Leave it when: the comment is an example in documentation.
