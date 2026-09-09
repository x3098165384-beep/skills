---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
---

Implement the work described by the user in the spec or tickets.

Record the starting commit before editing.

Before implementing, read [Testing and verification](../tdd/TESTING-POLICY.md). Use its default of existing checks and user manual verification. Invoke `$tdd` only for explicitly authorized new tests, and pass the authorized scope to any delegated work.

Run the necessary compilation or type checks and existing tests that cover the change. Follow the policy's limits on repeated checks and full suites. Provide manual verification steps and expected results, marking any unperformed steps as awaiting user verification.

Once done, use $code-review with the starting commit and spec to review the current work, including uncommitted changes. Fix substantiated findings and rerun affected checks.

Commit your work to the current branch.
