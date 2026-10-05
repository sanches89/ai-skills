# Design rules

Which design rules make code maintainable, reusable, and testable, and how a
violation shows in code. The *Design* entries of the `code-refactor` catalog
and the *Modules* rules of `refactoring-rules.md` come from here.

## Coupling and cohesion

- Constantine and Yourdon rank coupling from worst to best: content,
  common, external, control, stamp, data. A flag argument that steers the
  callee is control coupling. A global that several modules write is
  common coupling.
- They rank cohesion from coincidental, a grab bag, up to functional, one
  task. A `utils` module whose functions share no data is coincidental.
- Parnas: decompose by the design decisions likely to change, and hide each
  one in one module. A format or a rule that two modules know is a leak.
  Ousterhout names the same flaw information leakage.
- Law of Demeter: a method talks to its own fields, its parameters, and
  what it creates. A chain through objects it does not own is the smell.

## Dependencies and testability

- Hevery's four flaws: a constructor that does real work, digging into
  collaborators, global state and singletons, a class that does too much.
  The signs: `new` in a constructor, a static call, a chain with more
  than one dot, a parameter used only to fetch another object.
- Fowler: start with constructor injection, and separate the configuration
  of services from their use. The composition root wires the program once.
- Martin's dependency inversion: a module with rules never imports a
  database, HTTP, or user-interface type. The rules module owns the
  interface, and the infrastructure implements it. Cockburn's ports and
  adapters is the same shape at the application boundary.
- Bernhardt: a functional core of pure decisions over values, and an
  imperative shell that performs the effects with few branches. Fowler's
  Split Phase is the refactoring that gets there.
- Meszaros: replace only a depended-on component at a system boundary, and
  prefer state verification to a mock with expectations. A test double for
  a fast, deterministic collaborator inside the project is a test smell.

## Substitution and reuse

- Liskov, as stated with Wing: a property provable of the parent holds for
  the subtype. An override that throws, does nothing, or weakens a
  guarantee breaks it.
- The Gang of Four: favor composition over inheritance, because inheritance
  shares the parent's internals. A subclass kept only to reuse helpers
  becomes delegation.
- Martin's stable dependencies principle: depend in the direction of
  stability. A module that many import never imports a module that changes
  often. The fix is an interface owned by the stable side.

## Depth and simplicity

- Ousterhout: complexity is dependencies plus obscurity, and its symptoms
  are change amplification, cognitive load, and unknown unknowns. A deep
  module hides much behind a small interface. A pass-through method, a
  pass-through variable, and a class per tiny concept are shallow.
- Ousterhout against Martin on method length: extract a piece only when it
  has its own clean interface and reads alone, never to hit a line count.
- Fowler's YAGNI: a presumed feature costs its build, its delay, its carry,
  and its repair. An interface with one implementation and a flag with one
  value are the signs.
- Fowler's Parallel Change for a contract change: expand, migrate every
  caller, contract. The old form stays until the last caller moved.

---

Reference: https://en.wikipedia.org/wiki/Coupling_(computer_programming),
https://en.wikipedia.org/wiki/Cohesion_(computer_science),
https://dl.acm.org/doi/10.1145/361598.361623,
https://en.wikipedia.org/wiki/Law_of_Demeter,
https://github.com/mhevery/guide-to-testable-code,
https://martinfowler.com/articles/injection.html,
https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html,
https://alistair.cockburn.us/hexagonal-architecture/,
https://www.destroyallsoftware.com/talks/boundaries,
https://martinfowler.com/articles/mocksArentStubs.html,
https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf,
https://en.wikipedia.org/wiki/Composition_over_inheritance,
https://en.wikipedia.org/wiki/Software_package_metrics,
https://web.stanford.edu/~ouster/cgi-bin/book.php,
https://github.com/johnousterhout/aposd-vs-clean-code,
https://martinfowler.com/bliki/Yagni.html,
https://martinfowler.com/bliki/ParallelChange.html
