---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
---

Implement the work described by the user in the spec or tickets.

Record the starting commit before editing.

Prioritize delivering the requested functionality. Use [Testing and verification](../tdd/TESTING-POLICY.md) to choose checks, and carry those decisions into any delegated work.

Run necessary compilation or type checks and directly relevant existing checks. Provide short manual steps and expected results; delivery can proceed with manual acceptance marked as pending.

Once done, use $code-review with the starting commit and spec to review the current work, including uncommitted changes. Fix substantiated findings and rerun affected checks.

Commit your work to the current branch.
