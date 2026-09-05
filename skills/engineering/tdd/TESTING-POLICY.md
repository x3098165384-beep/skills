# Testing and verification

Read this policy when planning, implementing, diagnosing, or reviewing changes with these skills. It governs whether to write tests; `tdd/SKILL.md` governs how to write them once authorized. Follow the user's current instructions and the target project's constraints.

## Default

Implement the requested behavior, run necessary compilation or type checks and existing relevant tests, and provide short manual verification steps with expected results. Prefer verification by the user for behavior they can reliably confirm with a few actions. Do not add automated tests or expand existing coverage by default, and do not ask about tests on every ordinary change.

Judge the need by the behavior and the effort to verify it, not by changed line count, lack of coverage, or general engineering convention.

## Permission to write tests

- A direct user request to write tests, add regression coverage, or use `$tdd` authorizes tests for that task's requested scope. Preserve this authorization across tickets and delegated work; do not ask again for the same scope.
- Calling an implementation, diagnosis, or review skill does not grant that permission. A skill invoking `$tdd` internally does not grant it either. An accepted behavior, interface, spec, or ticket alone is not permission; a recorded explicit request to write tests is.
- Without prior authorization, propose tests only for a concrete behavior that manual verification cannot reliably cover or would require substantial repetitive checking, such as bulk data conversion, many calculation cases, or configuration combinations. Explain the behavior, why manual checking is insufficient, and the smallest useful test scope. Wait for approval before writing those tests; continue independent authorized work meanwhile.
- Temporary verification scripts, browser assertion scripts, fuzz loops, and throwaway test harnesses follow the same permission rule. Renaming test code or choosing not to keep it does not exempt it. Running existing tools, inspecting their output, and ordinary diagnostic commands do not require permission to write tests.

## Existing tests and production code

Maintain existing tests affected by the change through necessary setup, interface, and expected-result updates. This does not authorize additional scenarios. Remove a test or assertion only when the requested behavior makes it obsolete, and explain why; preserve valid checks when fixing failures.

Choose production interfaces and dependencies from actual callers and project requirements. Keep test fixtures and helpers in test code. Do not add production members, wrappers, or dependency replacement solely to support a test; use an existing production interface or report what could not be covered.

## Run scope and reporting

Run the smallest existing checks that cover the changed behavior and its affected callers. After they pass, stop unless a change, failure, or specific uncovered behavior justifies another named check. A shared helper change alone does not justify a full suite. Run a full suite only when explicitly requested or required by the project, or after approval based on concrete risk that smaller checks cannot cover.

Report checks actually run and their results. Mark manual steps not yet performed as awaiting user verification. Providing steps does not mean they passed. Report unavailable checks and the specific behavior still unverified.

## Planning and review

Record manual steps, existing checks, and any explicitly authorized new tests separately. Carry the scope and source of test authorization into tickets or delegated tasks. Mark proposed tests awaiting approval; do not turn them into mandatory acceptance criteria or treat general plan approval as test permission.

Missing new tests alone is not a review finding. A verification concern must name the concrete possible failure and explain why existing checks and manual steps are insufficient. An explicitly requested test that is missing remains an unmet requirement. Review and follow-up fixes follow the same permission rules.
