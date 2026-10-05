# Smells and refactorings

Which refactoring removes which smell, and when duplication stays. The
`code-refactor` catalog names these refactorings. This file holds the
sources and the mapping behind the entries inside functions and modules.

## The smell groups

Fowler's smells, grouped by Mäntylä and Lassenius by their effect:

- Bloaters: Long Function, Large Class, Long Parameter List, Primitive
  Obsession, Data Clumps. Fixes: Extract Function, Extract Class,
  Introduce Parameter Object, Preserve Whole Object, Replace Primitive
  with Object.
- Object-orientation abusers: Repeated Switches, Temporary Field, Refused
  Bequest, Alternative Classes with Different Interfaces. Fixes: Replace
  Conditional with Polymorphism, Extract Class, Replace Subclass with
  Delegate, Replace Superclass with Delegate.
- Change preventers: Divergent Change, Shotgun Surgery. Fixes: Split
  Phase, Move Function, Extract Class, Inline Class.
- Dispensables: Duplicated Code, Lazy Element, Speculative Generality,
  Dead Code, Comments that repeat the code. Fixes: Extract Function,
  Inline Function, Collapse Hierarchy, Remove Dead Code.
- Couplers: Feature Envy, Insider Trading, Message Chains, Middle Man.
  Fixes: Move Function, Hide Delegate, Remove Middle Man.
- Added in the second edition: Mysterious Name, Global Data, Mutable
  Data, Loops. Fixes: Rename, Encapsulate Variable, Separate Query from
  Modifier, Replace Loop with Pipeline.

A smell is a surface sign, and Fowler states that it does not always mark
a problem. The catalog gives every entry a *Leave it when* case for that
reason.

## Tidyings

Beck's tidyings are the smallest structural changes: Guard Clauses, Dead
Code, Normalize Symmetries, Reading Order, Explaining Variables,
Explaining Constants, Explicit Parameters, Chunk Statements, Extract
Helper, Delete Redundant Comments. A structural change and a behavior
change go in separate commits, and a batch of tidyings stays small. The
one-refactoring-per-subtask rule comes from here.

## Patterns as targets

Kerievsky reaches a design pattern through a sequence of small
refactorings, and refactors away from one that no longer earns its
indirection. The catalog names a pattern only where a smell names it:
Repeated Switches to polymorphism, a conditional dispatcher to Command.

## When duplication stays

- DRY, as Hunt and Thomas state it, is about knowledge. Two identical
  bodies that enforce two business rules are not one piece of knowledge.
- The rule of three: extract on the third copy, not the second.
- Metz: duplication is far cheaper than the wrong abstraction. A shared
  function that grows a flag per caller is the wrong abstraction. Inline
  it into the callers, prune each copy, and extract again only what is
  shared.

These three rules are the *Duplication* section of `refactoring-rules.md`.

## Seams and characterization tests

Feathers' order for untested code: find the change points, find the test
points, break the dependencies, write the tests, then change. A seam is a
place where behavior changes without an edit at that place. An object
seam, a parameter or a constructor argument, is the best one in an
object-oriented language. A characterization test records what the code
does today and fails when a refactoring changes it. The dependency-breaking
techniques the skill uses, from least to most invasive: Parameterize
Function, Parameterize Constructor, Extract Function around the boundary
call.

---

Reference: https://refactoring.com/catalog/,
https://martinfowler.com/bliki/CodeSmell.html,
https://mmantyla.github.io/BadCodeSmellsTaxonomy,
https://www.industriallogic.com/refactoring-to-patterns/catalog/,
https://newsletter.kentbeck.com/p/first-after-later-never,
https://media.pragprog.com/titles/tpp20/dry.pdf,
https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming),
https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction,
https://www.informit.com/articles/article.aspx?p=359417&seqNum=3,
https://en.wikipedia.org/wiki/Characterization_test
