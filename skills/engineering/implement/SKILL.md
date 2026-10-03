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

Once done, use $code-review with the starting commit and spec to review the current work, including uncommitted changes. Fix substantiated findings and rerun affected checks.

Commit your work to the current branch.
