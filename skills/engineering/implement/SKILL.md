---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
---

Implement the work described by the user in the spec or tickets.

Before editing, record the starting `HEAD` SHA and existing staged, unstaged, and untracked changes. Keep unrelated work outside this task's review and commit.

Before implementing, read [Testing and verification](../tdd/TESTING-POLICY.md). Use its default of existing checks and user manual verification. Invoke `$tdd` only for explicitly authorized new tests, and pass the authorized scope to any delegated work.

Run the necessary compilation or type checks and existing tests that cover the change. Follow the policy's limits on repeated checks and full suites. Provide manual verification steps and expected results, marking any unperformed steps as awaiting user verification.

Once done, use $code-review in current-work mode, supplying the starting SHA, starting-state record, task scope, and spec or agreed requirements. Resolve substantiated findings within scope and rerun affected checks; follow up on the fixes rather than restarting the full review without cause.

Commit only this task's work to the current branch after review and required checks. Pending user manual verification alone does not block the commit unless the user or project requires it. Report the commit and any remaining verification; if blocked, name the blocker instead of claiming completion.
