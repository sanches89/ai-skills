# Clean code principles

Sections: 1. Meaningful names; 2. Small functions; 3. Single responsibility;
4. No duplication; 5. Comments explain why; 6. Formatting; 7. Error handling;
8. Boy Scout rule; 9. Tests; 10. Simple design; 11. Law of Demeter;
12. Separation of concerns; 13. Open/closed, Liskov, interface segregation,
dependency inversion; 14. KISS and YAGNI.

Each principle holds a rule, an example when one applies, and a **Check**: a
test that the diff passes or fails. A convention of the project and a
decision of the chain beat a principle. Examples are TypeScript. The rule
holds in every language.

## 1. Meaningful names

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

## 2. Small functions

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

## 3. Single responsibility

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

## 4. No duplication

Each piece of knowledge has one representation. Extract a duplicate when the
copies must change together. Leave code that looks alike but changes for
different reasons.

```ts
// Bad
const gross = net * 1.2;
const invoiceTotal = subtotal * 1.2;

// Good
const VAT_RATE = 0.2;
const withVat = (amount: number) => amount * (1 + VAT_RATE);
```

**Check:** no block of 3 lines or more repeats in the diff. No literal
repeats where one change should update every copy.

## 5. Comments explain why

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

## 6. Formatting

Run the project formatter. Without one, keep related code together and
separate concepts with a blank line. Declare a variable next to its first use.
Place a caller above its callee.

No example: the project formatter decides.

**Check:** the format command reports no change.

## 7. Error handling

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

## 8. Boy Scout rule

Leave the code you write or change cleaner than you found it: name every new
thing well, and delete the code your change makes dead. Never edit code
outside the change to clean it. Cleanup elsewhere belongs to its own task.

No example: the rule limits scope.

**Check:** every edited line serves the target.

## 9. Tests

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

## 10. Simple design

In this order, the code: passes every test, holds no duplication, expresses
the intent of the author, and uses the fewest classes and methods that
satisfy the first three.

No example: the other principles apply this one.

**Check:** the tests pass, then principles 1 and 4 pass, then no class or
function exists only to satisfy a pattern.

## 11. Law of Demeter

A method calls only: its own object, its parameters, objects it creates, and
the fields of its object. It never reaches through a chain of objects. The
rule does not apply to plain data structures or to fluent builders.

```ts
// Bad
const city = order.getCustomer().getAddress().getCity();

// Good
const city = order.shippingCity();
```

**Check:** no chain of 2 method calls or more reaches through another
object's collaborators.

## 12. Separation of concerns

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

## 13. Open/closed, Liskov, interface segregation, dependency inversion

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

## 14. KISS and YAGNI

Write the simplest code that meets the request. Add no abstraction, option,
parameter, hook, or layer without a use that exists today.

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
from principle 12. Every parameter has a caller that passes it.
