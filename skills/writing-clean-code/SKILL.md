---
name: writing-clean-code
description: Writes and reviews code by 14 clean code principles, each with a rule, an example, and a check that a diff passes or fails. Use when code is written, changed, cleaned up, or reviewed for names, function size, duplication, error handling, coupling, or SOLID, or the user asks for clean code.
license: MIT
compatibility: Requires the finding-dev-commands skill.
argument-hint: <code to write | paths or git range to review>
---

# Writing clean code

Write and review code by 14 principles. Each principle holds a rule, an
example when one applies, and a **Check**: a test that the diff passes or
fails. A convention of the project and a decision of the task the caller
works on beat a principle. The numbers in the principles are targets for
the lines a change writes or edits, never for code the change leaves alone.
Examples are TypeScript. The rule holds in every language.

## Invocation

When the invocation text starts with `from <skill name>:`, another skill
invoked this run. Ask nothing. Follow the form the text names, and end with
its return block and nothing else. Without that prefix, a user invoked this
skill: run the standalone workflow.

- `from <caller>: write`: load the principles. Return `principles loaded`.
- `from <caller>: check <git range | paths>`: run every Check over the diff.
  Return one line per failure, `<path:line> <principle number>: <failure>`,
  or `pass`.

The `check` form runs Step 1 without a mode, then Step 3 over its git range
or paths.

## Workflow

### Step 1: Load the code

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Pick the mode from the user's request:
- **Write mode**: the user asks for code written or changed.
- **Review mode**: the user asks for code reviewed or cleaned up. A clean-up
  request asks for changes.

Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, and the docs that cover the
touched code. Record the naming, error handling, and formatting conventions.
Invoke the `finding-dev-commands` skill (in Claude Code, with the
`Skill` tool) with the invocation text `from writing-clean-code: find`. Keep
its `format` line for principle 6.

### Step 2: Write

Write mode only. Write the code the user asked for. Apply every principle to
the lines you write or change.

### Step 3: Check the diff

Take the diff from the first case that applies:
1. write mode: the lines Step 2 wrote or changed;
2. a git range: `git diff <range>`;
3. paths: `git diff HEAD -- <paths>`, plus every untracked file under them
   as added lines;
4. else: `git diff HEAD`, plus every untracked file as added lines.

Run the **Check** of every principle over the diff. For principle 6, run the
format command. Without one, check the rule of principle 6 by reading. A
failure that a convention of the project or a decision of the task the
caller works on overrules is no failure. Record each failure as
`<path:line> <principle number>: <failure>`.

### Step 4: Fix and report

In write mode, and in review mode when the user asked for changes, fix every
failure inside the diff. Then run Step 3 again. In review mode without a
request for changes, change no file. End with one line per failure that
remains, or `pass`.

## Principles

### 1. Meaningful names

A name states what the thing is or does. Use pronounceable, searchable words.
Name a boolean as a question. Use one word per concept across the code. Write
no abbreviation, no type prefix, and no name that misleads.

```ts
// Bad
const d = 86400;
function proc(l: User[]) {}

// Good
const SECONDS_PER_DAY = 86_400;
function activateUsers(users: User[]) {}
```

**Check:** no name needs a comment to explain it. No single-letter name
outside a loop index.

### 2. Small functions

A function does one thing at one level of abstraction. Keep it to 20 lines
or fewer and 2 parameters or fewer. A third parameter becomes an object. No
boolean flag parameter. The name states every side effect.

```ts
// Bad
function checkout(cart: Cart) {
  if (cart.items.length === 0) throw new EmptyCartError();
  const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  payments.charge(cart.userId, total);
  mailer.send(cart.userId, "Receipt", `Total: ${total}`);
}

// Good
function checkout(cart: Cart) {
  assertNotEmpty(cart);
  const total = totalOf(cart);
  payments.charge(cart.userId, total);
  sendReceipt(cart.userId, total);
}
```

A flag splits the function in two: `render(page, true)` becomes
`renderForPrint(page)` and `renderForScreen(page)`.

**Check:** every function is 20 lines or fewer, takes 2 parameters or fewer,
and holds statements of one abstraction level only.

### 3. Single responsibility

A class or module has one reason to change: one actor whose request edits it.
Split code that serves two actors.

```ts
// Bad
class Report {
  calculate() {}
  toHtml() {}
  save() {}
}

// Good
class ReportCalculator {}
class ReportHtmlView {}
class ReportRepository {}
```

**Check:** one sentence describes the class without the word "and".

### 4. No duplication

Each piece of knowledge has one representation. Extract a duplicate when the
copies change together, from two copies on. Leave copies that change for
different reasons.

```ts
// Bad
const gross = net * 1.2;
const invoiceTotal = subtotal * 1.2;

// Good
const VAT_RATE = 0.2;
const withVat = (amount: number) => amount * (1 + VAT_RATE);
```

**Check:** no block of 3 lines or more, other than braces and imports,
repeats in the diff. No literal repeats where one change should update every
copy.

### 5. Comments explain why

A comment states why the code does what it does: a constraint, a trade-off,
or a defect it works around. The code states what and how. Delete commented-out
code, because version control holds it.

```ts
// Bad
// increment i
i++;

// Good
// The API rejects batches over 100 items.
const BATCH_SIZE = 100;
```

**Check:** no comment restates the next line. No commented-out code.

### 6. Formatting

Run the project formatter. Without one, keep related code together and
separate concepts with a blank line. Declare a variable next to its first use.
Place a caller above its callee.

No example: the project formatter decides.

**Check:** the format command reports no change.

### 7. Error handling

Throw an error, never return an error code. Never return or pass `null` for an
expected case: return an empty collection or a typed result. Never swallow an
error. Catch it only where the code can handle it. An error message holds the
failed operation and the value that caused it.

```ts
// Bad
function findUser(id: string): User | null {
  try {
    return db.get(id);
  } catch (e) {
    return null;
  }
}

// Good
function getUser(id: string): User {
  const user = db.get(id);
  if (!user) throw new UserNotFoundError(id);
  return user;
}
```

**Check:** no empty `catch`. No `catch` that returns a default for a failure.
Every thrown error names the operation and the value.

### 8. Boy Scout rule

Leave the code you write or change cleaner than you found it: name every new
thing well, and delete the code your change makes dead. Never edit code
outside the change to clean it. Cleanup elsewhere belongs to its own task.

No example: the rule limits scope.

**Check:** every edited line serves the request.

### 9. Tests

Each added or changed behavior has a test. A test is fast, independent,
repeatable, self-validating, and written before the code (F.I.R.S.T.). A test
checks one concept, follows arrange, act, assert, and has a name that states
the behavior.

```ts
// Bad
test("works", () => {
  expect(checkout(cart)).toBeDefined();
  expect(checkout(emptyCart)).toBeDefined();
});

// Good
test("rejects an empty cart", () => {
  expect(() => checkout(emptyCart)).toThrow(EmptyCartError);
});
```

**Check:** every changed behavior has a test that fails without the change.
No test reads the clock, the network, or another test's state.

### 10. Simple design

In this order, the code: passes every test, holds no duplication, expresses
the intent of the author, and uses the fewest classes and methods that
satisfy the first three.

No example: the other principles apply this one.

**Check:** the tests pass, then principles 1 and 4 pass, then no class or
function exists only to satisfy a pattern.

### 11. Law of Demeter

A method calls only: its own object, its parameters, objects it creates, and
the fields of its object. It never reaches through a chain of objects. The
rule does not apply to plain data structures, fluent builders, or query
interfaces.

```ts
// Bad
const city = order.getCustomer().getAddress().getCity();

// Good
const city = order.shippingCity();
```

**Check:** no chain of 2 method calls or more reaches through another
object's collaborators.

### 12. Separation of concerns

Business logic imports no framework, database driver, HTTP client, or
third-party type. Wrap each behind an interface that the project owns, and
pass it in from outside.

```ts
// Bad
class Pricing {
  private http = new HttpClient();
  price(sku: string) {
    return this.http.get(`/rates/${sku}`);
  }
}

// Good
interface RateSource {
  rateFor(sku: string): number;
}
class Pricing {
  constructor(private rates: RateSource) {}
  price(sku: string) {
    return this.rates.rateFor(sku);
  }
}
```

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
  the detail implements it. Principle 12 shows the form.

```ts
// Bad
function area(s: Shape) {
  switch (s.kind) {
    case "circle": return Math.PI * s.r ** 2;
    case "square": return s.side ** 2;
  }
}

// Good
interface Shape {
  area(): number;
}
class Circle implements Shape {
  constructor(private r: number) {}
  area() { return Math.PI * this.r ** 2; }
}
```

**Check:** no new case added to a type `switch`. No override that throws or
rejects an input the parent accepts. No interface method that a client never
calls.

### 14. KISS and YAGNI

Write the simplest code that meets the request. Add no abstraction, option,
parameter, hook, or layer without a use that exists today. Add an interface
only with 2 implementations or more, or as the wrapper of a system boundary.
Add an option or a parameter only with a caller that passes it.

```ts
// Bad: one implementation, one caller
interface DiscountStrategy { apply(p: number): number }
class DiscountStrategyFactory {
  create(): DiscountStrategy { return new TenPercent(); }
}

// Good
const applyDiscount = (price: number) => price * 0.9;
```

**Check:** every interface has 2 implementations or more, or is a boundary
from principle 12. Every option and every parameter has a caller that passes
it.
