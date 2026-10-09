---
name: implement-spec
description: "Implement the result of $to-spec and $to-tickets in code."
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

Prioritize delivering the spec's functionality. Before dispatching, read [Testing and verification](../tdd/TESTING-POLICY.md), then pass that reference and the spec's verification decisions to implementers and reviewers. Collect actual check results and manual acceptance steps before closeout; delivery can proceed with manual acceptance marked as pending.

The issue tracker should have been provided to you. If not, tell the user to run `$setup-matt-pocock-skills`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

Local commits are part of this workflow and need no separate confirmation. Commit only the task's work. Pending manual acceptance alone does not block committing; honor any user or project instruction to defer it. If committing is deferred or blocked, preserve uncommitted work and report the blocker before dependent merges or cleanup.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec and tickets to understand the task graph.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Record the starting commit and create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. Each implementer subagent:
   - confirms its worktree is based on the integration branch before starting, recreating a clean worktree from that branch if necessary while preserving existing work;
   - builds the ticket's functionality, checks the changed code and its actual callers against the agreed behavior and project rules, runs necessary compilation and directly relevant existing checks, and supplies manual acceptance steps under the shared testing policy; uses $tdd when test-first work was requested;
   - commits its ticket's work to its own branch, then merges the integration branch tip into that branch and reports the resulting commit hash before reporting done.

5. Once an **implementer subagent** completes, merge its work to the integration branch with a **merger subagent**.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, check the integrated changes and their callers against the spec and project rules. Use $code-review only when the user requested a separate review, including a review agreed at the start of the task; pass the recorded starting commit and spec. Fix substantiated findings in an **implementer subagent**, rerun affected checks, commit the fixes, and merge them into the integration branch before closeout.

8. Confirm all task changes, including review fixes, are committed and merged; otherwise report the blocker before closeout. If a draft PR exists, mark it ready for review. Otherwise, resolve each ticket the way the issue tracker closes work. Report the integration branch, its final commit hash, and verification results.

9. Clean up all **implementer subagent** worktrees.
