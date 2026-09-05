---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
---

Implement the work described by the user in the spec or tickets.

Before implementing, read [Testing and verification](../tdd/TESTING-POLICY.md). Use its default of existing checks and user manual verification. Invoke `$tdd` only for explicitly authorized new tests, and pass the authorized scope to any delegated work.

Run the necessary compilation or type checks and existing tests that cover the change. Follow the policy's limits on repeated checks and full suites. Provide manual verification steps and expected results, marking any unperformed steps as awaiting user verification.

Once done, use $code-review to review the work.

Commit your work to the current branch.
