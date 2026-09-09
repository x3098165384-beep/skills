## What it does

`implement` builds work that has already been decided. You point it at a [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), or an agreed plan. It writes the code, runs necessary compilation and existing relevant checks, provides manual verification steps, runs [code-review](https://aihero.dev/skills-code-review), and commits to the current branch. New tests require your explicit request or approval.

It never reopens the plan. There is no interview, no clarifying round, no proposal of a different approach. Whatever was settled upstream is the input, and the skill's whole job is to turn that into a commit. That is what separates it from typing "build this" at a fresh [agent](https://www.aihero.dev/ai-coding-dictionary/agent), which will happily redesign the work while it builds it.

## When to reach for it

Type `$implement` yourself to start the workflow predictably. This Codex edition keeps it model-visible so it is not misreported as unavailable. Wherever [ask-matt](https://aihero.dev/skills-ask-matt) or [to-tickets](https://aihero.dev/skills-to-tickets) says "then `$implement` per ticket", treat that as an instruction to begin a fresh implementation session for that ticket.

Where the work currently lives decides whether this is the right skill:

| The work is… | Reach for |
| --- | --- |
| A ticket on the tracker | `$implement #42`, one ticket per [session](https://www.aihero.dev/ai-coding-dictionary/session), [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) context between tickets |
| A spec, not yet split up, and the build spans sessions | [to-tickets](https://aihero.dev/skills-to-tickets) first, then `$implement` per ticket |
| A spec, and the build is small | `$implement` directly against the spec |
| Only in the conversation you just had, and it's still small | `$implement` right there, in the same window |
| Not written down anywhere yet | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), or [grill-me](https://aihero.dev/skills-grill-me) if there's no codebase |
| One concrete behaviour you want test-first, with no spec | [tdd](https://aihero.dev/skills-tdd) directly |
| Already built, and you want it checked | [code-review](https://aihero.dev/skills-code-review) directly |

The same-session case is worth naming because the skill's own first line doesn't cover it. `SKILL.md` says "the spec or tickets", which nudges the [model](https://www.aihero.dev/ai-coding-dictionary/model) to go hunting for a file that doesn't exist. If the plan lives only in the thread, say so when you invoke it.

## Prerequisites

`implement` commits to the branch you are on. It does not create one, and it does not ask. Check you are on the branch you want the work on before you start.

If the tickets came from [to-tickets](https://aihero.dev/skills-to-tickets), the tracker they live on was configured by [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills). `code-review` reads the same configuration to find the originating spec at close-out.

## What one run does

A run is five beats, in order:

1. Read the ticket or spec and any recorded permission to write tests; capture the starting commit and pre-existing changes.
2. Implement the behavior, using [tdd](https://aihero.dev/skills-tdd) only for explicitly authorized new tests.
3. Run necessary compilation or type checks and existing tests that cover the change.
4. Provide manual steps and expected results, marking unperformed checks as awaiting your verification.
5. Run [code-review](https://aihero.dev/skills-code-review) against the starting commit, including uncommitted work and new files; resolve substantiated findings, rerun affected checks, then commit only the task's work to the current branch.

One run covers one ticket. The tickets [to-tickets](https://aihero.dev/skills-to-tickets) produces are tracer-bullet vertical slices sized to fit a single fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), so the intended rhythm is: clear context, implement one ticket, commit, clear again. Each ticket is self-contained, which is what makes the previous ticket's context disposable.

## Choosing verification

Behavior you can reliably check with a few actions is left for your manual verification. Existing checks still run, and existing tests may be maintained when the change affects them. The agent does not ask about adding tests on every small change.

For behavior that is unreliable or laborious to check manually, the agent explains the specific gap and proposes the smallest useful test scope. It waits for permission to write those tests. A defined interface or an accepted spec alone does not supply that permission. A full suite is also no longer a routine closing step; wider runs need a specific reason and authorization under the shared policy or project requirements.

## Common questions

**Will a two-line change still produce new tests?**

Not by default. The decision depends on whether the behavior can be reliably checked manually, not the number of changed lines. Directly asking for tests or invoking `$tdd` authorizes the requested scope; invoking `$implement` alone does not.

**It finished, but my ticket is still open and the acceptance criteria are still unchecked.**

The workflow fixes substantiated review findings and ends at a commit; it does not automatically close the ticket or tick its acceptance checkboxes. Close the ticket and reconcile the criteria yourself so dependent tickets can become unblocked.

**Can I point it at all my tickets at once, or run several in parallel?**

No. One invocation, one ticket. Batch dispatch across a ticket queue and [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) fan-out are both requested repeatedly, and neither exists. Running several `$implement` sessions side by side in one checkout is worse than unsupported: one field report describes a `git commit --amend` in one session landing on another session's commit, a stash vanishing from `refs/stash`, and commits landing on the wrong branch, all in a single afternoon across three issues. The sessions share one working directory, one index, and one HEAD. Git worktrees are the community workaround, and note that `refs/stash` is shared across worktrees too, so worktrees alone do not fix the stash case. If you want parallelism today, you are assembling it yourself.

**Can it open a pull request instead of committing?**

Not built in. It commits straight to the current branch, which several people find too eager: the code lands before they have had a chance to verify it works. There is no configuration flag and no PR mode. People override it in the invocation ("commit to a branch and open a PR") or by editing their local copy of the skill.

**`code-review` says it cannot see my changes.**

The implementation passes its starting commit, scope, starting-state record, and requirements to current-work review. That mode covers tracked changes plus in-scope untracked files before committing. If it sees nothing, check that it received those inputs and selected current-work mode.

Unperformed user manual checks remain reported as pending; they alone do not postpone the commit unless you or the project requires verification first.

Separately, some people deliberately do not want the review inside the run at all, because an agent reviewing the code it just wrote is biased toward its own solution. Running [code-review](https://aihero.dev/skills-code-review) in a fresh session against a fixed point is a legitimate alternative, and is the same reason that skill runs its two axes in separate sub-agents.

**One ticket burned 150k tokens. Am I using it wrong?**

Inspect what consumed the time. This branch no longer requires a new test loop or a full suite for every ticket. Repeated checks should have a specific change, failure, or uncovered behavior behind them. If implementation and review still exceed one session, split the work into smaller tickets with [to-tickets](https://aihero.dev/skills-to-tickets).

**`$implement #2` in a fresh session worked on something completely unrelated.**

`#2` is resolved against whatever numbered list the agent can see, which in a fresh session may be a todo file, a checklist, or another work list rather than the configured tracker. The resolution is confident rather than fail-closed, so the mistake is not obvious until it has started. Pass the full reference, the issue URL or `owner/repo#2`, and ask it to confirm the title back before it begins.

## It's working if

- The session opens by reading the ticket or spec and restating what it will build, rather than asking you what to build.
- New tests appear only for a scope you explicitly requested or approved.
- Necessary compilation and existing relevant checks run, with their actual results reported.
- You receive manual actions and expected results; checks you have not performed are marked as pending.
- The run reaches a commit on your current branch without you prompting it to carry on.
- The diff is one ticket's worth of change: a vertical slice through every layer, not several tickets swept together.

## Where it fits

`implement` is the build step of the main chain, second from the end:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

Its neighbours are [to-tickets](https://aihero.dev/skills-to-tickets), which provides the work and any recorded test authorization; [tdd](https://aihero.dev/skills-tdd), used for authorized tests; and [code-review](https://aihero.dev/skills-code-review), which it runs before committing. The plan determines the requested behavior; the shared testing policy determines when new tests may be written.

That trust is why [wayfinder](https://aihero.dev/skills-wayfinder) merges onto the chain at [to-spec](https://aihero.dev/skills-to-spec) rather than looping its map straight into `implement`. Go straight to `implement` from a map only when the effort turned out genuinely small.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
