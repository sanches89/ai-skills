# Finding entry

One entry per smell and location:

```
- <smell>: `<path:line>` (<symbol>)
  evidence: <the clone, the measured value against its limit, or what the
    code shows>
  refactoring: <refactoring from the catalog>[; <refactoring>]... | report
  covered: yes | partly | no
  contract: yes | no
```

- `refactoring`: each refactoring of the catalog entry that the location needs,
  in the order of the catalog line, separated by semicolons. `report` for an
  entry with **Report** in the catalog, except a case that its **Report** line
  sends to a refactoring.
- `covered`: read the tests of the function. `yes` when the tests ran every line
  and branch and a test asserts the result. `no` when no test ran the code. Else
  `partly`.
- `contract`: `yes` when the location holds a part of `contract.md`.
