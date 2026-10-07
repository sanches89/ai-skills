# Writing rules

- Write decisions as facts:
  `Retries use exponential backoff from 500 ms, at most 5 attempts.`, never
  `We decided that...` or `Retries should probably...`.
- Use the paths and symbols verified in research.
- Make each subtask self-contained: restate every decision and fact it
  needs. Never write `see task`, `as above`, or `same as subtask 2`.
- Include code only when its exact shape is a decision: a schema, an
  interface, a CLI flag, an endpoint signature. Never implementation code.
- Make every success criterion and acceptance criterion binary: someone
  else can answer yes or no.
- In a subtask's *Verification*, write exactly one verification command, on
  one line. It fails on the code before the subtask's change and passes
  after it. It chains at most a test run and one structural check, such as
  a search or a file test, with `&&`.
- Add no section beyond the format: no Risks, Considerations, Alternatives,
  Future work, Nice to have, or Notes. Add no estimate, priority, or
  timeline unless the user asked for them.
- Make every line serve the requested change or an *Out of scope* entry.
  Write no remark or question from the conversation on another topic, and
  no mention of another task to create.
- Write at most 25 words per sentence, and only lines the implementing
  agent needs.
