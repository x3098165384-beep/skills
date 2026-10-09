---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
---

Implement the work described by the user in the spec or tickets.

Record the starting commit before editing.

When choosing how to implement the agreed behavior, consider whether existing configuration, resources, or business entry points already provide a direct solution. Distinguish behavior and compatibility that need preserving from the old implementation's structure. Prefer changes that improve correctness, clarity, and maintenance; neither the fewest changed files nor additional abstractions are goals by themselves.

Ground new dependencies, shared-flow changes, and defensive handling in actual callers and supported use cases. Unconfirmed risks can remain verification questions. Compare feasible approaches before treating dependencies introduced by the current implementation as reasons to retain it. Reuse existing investigation and focus further checks on what could change the decision, keeping this proportional to the task rather than adding a separate approval stage.

Prioritize delivering the requested functionality. Use [Testing and verification](../tdd/TESTING-POLICY.md) to choose checks, and carry those decisions into any delegated work.

Run necessary compilation or type checks and directly relevant existing checks. Provide short manual steps and expected results; delivery can proceed with manual acceptance marked as pending.

Check the changed code and its actual callers against the agreed behavior and project rules, and fix issues found during implementation. Use $code-review only when the user requested a separate review, including a review agreed at the start of the task. Pass the starting commit and spec, include uncommitted changes, fix substantiated findings, and rerun affected checks.

Commit this task's work to the current branch as part of completing the workflow, without a separate confirmation. Keep unrelated changes out of the commit. Pending manual acceptance alone does not block committing; honor any user or project instruction to defer it.

Report the commit hash and verification results. If committing is blocked, report the specific blocker and remaining changes instead of treating implementation alone as completion.
