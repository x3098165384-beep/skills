## What it does

`tdd` builds a feature or fixes a bug test-first: one failing test, then just enough code to pass it, then the next behaviour. It carries the standards that make that loop produce tests worth keeping: what a good test is, where tests go, what mocks are for, and the three anti-patterns that quietly ruin a suite.

It applies only to tests you explicitly requested or approved. It states the public interface it will test and uses the behavior and interface already agreed for the task. It asks you only when selecting that interface requires a new decision. `tdd` is a reference for the test loop; [implement](https://aihero.dev/skills-implement) uses it only within authorized test scope.

## When to reach for it

Type `$tdd` to authorize working test-first for the task. The agent may also select it after you explicitly request or approve automated tests. Another skill referencing it does not count as your permission.

Reach for it when there is a concrete behaviour to build, with an input and an observable output, and you want tests that survive a refactor.

| Your situation | Where to go |
| --- | --- |
| A behavior with defined inputs and outputs that you want to build test-first | `tdd` |
| The behavior is not pinned down yet | [to-spec](https://aihero.dev/skills-to-spec), which records behavior and verification decisions |
| The question is really the shape of the interface, not the tests | [codebase-design](https://aihero.dev/skills-codebase-design) |
| You have a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) or [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) and want the whole build run for you | [implement](https://aihero.dev/skills-implement), which uses existing checks and manual verification by default |
| A change you can reliably confirm with a few actions | Implement it with existing checks and manual verification |

The shared testing policy decides whether writing tests is authorized before this loop begins. A lack of coverage or a small, easily asserted function does not by itself justify asking for tests. Proposals need a specific behavior that manual checking cannot reliably or reasonably cover.

## Prerequisites

[codebase-design](https://aihero.dev/skills-codebase-design) needs to be installed. `tdd` used to carry its own deep-module and interface-design notes; in v1.0 those were deleted in favour of the shared skill, and `tdd` now leans on it for interface-design vocabulary. Nothing else; the skill is [stateless](https://www.aihero.dev/ai-coding-dictionary/stateless) and writes no files of its own.

## The loop, and the seam it runs at

Three words carry this skill.

**Red-green.** Write the failing test, then only enough code to pass it. No anticipating the test after next. There is no refactor phase: it was dropped in June 2026 because agents essentially never performed it, and because review and implementation work better as separate sessions. Refactoring belongs to [code-review](https://aihero.dev/skills-code-review).

**Vertical slice.** One seam, one test, one minimal implementation, then repeat, the first cycle being a **tracer bullet** that proves a single path end to end. The opposite is horizontal slicing: all the tests first, then all the code. Bulk tests verify *imagined* behaviour, they check the shape of things rather than what a user does, and they commit you to a test structure before you understand the implementation.

**Pre-agreed seam.** A seam is the public interface through which a test observes behavior. Once tests are authorized, an established interface and accepted behavior can determine this boundary without another question. Defining the boundary alone does not authorize writing tests.

The three anti-patterns it is written to prevent:

| Anti-pattern | The tell |
| --- | --- |
| Implementation-coupled | The test breaks when you rename an internal function, though behaviour did not change. Mocked internal collaborators, asserted call counts, database queries used to verify instead of the interface. |
| Tautological | The expected value is computed the way the code computes it, so the test passes by construction. Expected values have to come from somewhere else: a known-good literal, a worked example, the spec. |
| Horizontal slicing | A batch of tests landed before any implementation. |

Mocks are for system boundaries only: external APIs, time, randomness, sometimes the filesystem or the database. Not your own modules.

## Common questions

**Does `$implement` still invoke TDD automatically?**

Only for new tests you explicitly requested or approved. Calling `$implement`, approving behavior, or accepting a ticket breakdown does not itself authorize tests. Calling `$tdd` directly does authorize them for the task you gave it.

**Where does refactoring fit?**

This skill keeps the loop to one failing test and the implementation that makes it pass. Its existing rules place refactoring in the [code-review](https://aihero.dev/skills-code-review) stage. The new permission rules change when the test loop starts; they preserve that division of work.

**It asked me to choose a test seam and I had no idea which to pick.**

The agent should use the established public interface when it already determines the test. If a choice changes the agreed behavior, interface, or scope, it must explain what each option can verify and what it misses before asking you to decide.

**It wrote the implementation before the test, even though the skill says red first.**

It happens. One user pushed the [model](https://www.aihero.dev/ai-coding-dictionary/model) on it and got an unusually honest answer: "I knew the skill said 'one test at a time, watch it fail for the right reason'. I read it. I just defaulted to my normal habit." The skill is written to live with this. No instruction makes an agent comply 100% of the time, and forcing the point harder restricts the agent's creativity for little gain; the loop is worth running even when it is not followed strictly, because the results are still better overall. If strict adherence matters for a particular slice, watch the run rather than trusting the skill to enforce it.

**Should it write browser or end-to-end tests first?**

Usually not, and the skill will not stop it. A user reported the agent writing a Playwright test first, then burning a long loop re-running it and concluding the *test* was broken for a feature that did not exist yet. Configure this in your `CLAUDE.md`. Browser tests are slow enough that the red-green feedback loop stops paying for itself; declare in your repo's `CLAUDE.md` that they are written after the behaviour works.

**Does `$tdd` replace `$implement`, or the course's `/do-work`?**

No. `$tdd` documents the methodology; `$implement` is a very simple work→feedback→commit loop and is the direct stand-in for `/do-work`. The course's single `/do-work` step is now split across `$implement`, `$tdd` and `$code-review`. If you are asking which one to run against a ticket, the answer is almost always `$implement`.

**Where did the deep-modules and interface-design guidance go?**

Into [codebase-design](https://aihero.dev/skills-codebase-design) in v1.0, generalised so several skills share one vocabulary. `refactoring.md` left at the same time; refactoring is now [code-review](https://aihero.dev/skills-code-review)'s job, and that skill carries the Fowler smell baseline.

**Does it know about my other tickets?**

No. Run against one ticket, it will happily propose work that belongs to a sibling ticket, because it has no view of the rest of the issue graph ([issue #129](https://github.com/mattpocock/skills/issues/129)). Matt's position is that this is not `tdd`'s job. Passing the spec alongside the ticket helps; right-sizing the tickets in the first place helps more.

## It's working if

- It writes tests only within your explicit request or approval, and states the public interface it will use without asking you to approve the same scope again.
- One test appears, goes red, gets just enough code to pass, and only then does the next test appear, not a batch of tests followed by a batch of code.
- Test names read as capabilities ("user can checkout with valid cart"), not as internals ("checkout calls paymentService.process").
- Expected values in assertions are literals you can trace to the spec, not values recomputed the way the code computes them.
- Renaming an internal function breaks nothing in the suite.
- Mocks appear only at external boundaries (the payment API, the clock) and never around your own modules.

## Where it fits

`tdd` is optional within the build step, used when writing tests is explicitly authorized:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

[to-spec](https://aihero.dev/skills-to-spec) records verification decisions and any test authorization. [implement](https://aihero.dev/skills-implement) uses `tdd` for that authorized scope, and [code-review](https://aihero.dev/skills-code-review) assesses the result under the same testing policy. [codebase-design](https://aihero.dev/skills-codebase-design) supplies interface-design vocabulary when an interface decision is needed. Invoke `tdd` directly when you want to work test-first; [ask-matt](https://aihero.dev/skills-ask-matt) helps choose the workflow.
