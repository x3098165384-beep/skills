# Testing and verification

Read this when planning, implementing, diagnosing, or reviewing changes with these skills. Follow the user's current instructions and the target project's constraints.

## Default

Prioritize implementing the requested functionality. Leave behavior acceptance to the user by default, with short manual steps and expected results.

Add or expand automated tests only for behavior that is difficult to test reliably by hand or impossible to test manually, or when the user explicitly requests tests. Explain the specific gap briefly and write only the necessary test or verification code; no separate test approval is needed. Temporary scripts and test harnesses follow the same boundary.

Judge the gap by whether a person can effectively verify the behavior, not by changed line count, missing coverage, or general testing convention. A targeted check does not require a TDD workflow; use `$tdd` when the user wants to work test-first.

## Existing tests and production code

Maintain valid existing tests affected by the change. Remove checks only when the requested behavior makes them obsolete, and explain why.

Choose production interfaces and dependencies for actual callers and project requirements. Keep verification helpers in test code; use existing interfaces or report the limitation rather than reshaping production code solely for a test.

## Run scope and reporting

Run necessary compilation or type checks and directly relevant existing checks. Once they pass, continue toward delivery; repeat or broaden them only for further edits, a failure, a specific unresolved concern, or a user or project requirement.

Report actual check results and any unverified behavior. Implementation can be delivered with manual acceptance pending; providing steps does not mean they passed.

## Planning and review

Carry verification decisions into tickets and delegated work: manual steps, relevant existing checks, and the reason and scope for any needed automation.

Review functionality, correctness, and scope. Missing new tests alone is not a finding; name the concrete failure that existing checks and manual acceptance cannot adequately cover. Explicitly requested tests remain requirements.
