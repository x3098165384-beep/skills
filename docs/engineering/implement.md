## What it does

`implement` builds work that has already been decided. You point it at a [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), or an agreed plan. It prioritizes working functionality, runs necessary compilation and directly relevant existing checks, provides manual acceptance steps, runs [code-review](https://aihero.dev/skills-code-review), and commits to the current branch.

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

1. Read the ticket or spec and its verification decisions; record the starting commit.
2. Implement the behavior, adding targeted verification only where the shared testing policy calls for it.
3. Run necessary compilation or type checks and existing tests that cover the change.
4. Provide manual steps and expected results, marking unperformed checks as awaiting your verification.
5. Run [code-review](https://aihero.dev/skills-code-review) against the starting commit, including uncommitted work; fix substantiated findings, rerun affected checks, then commit to the current branch.

One run covers one ticket. The tickets [to-tickets](https://aihero.dev/skills-to-tickets) produces are tracer-bullet vertical slices sized to fit a single fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), so the intended rhythm is: clear context, implement one ticket, commit, clear again. Each ticket is self-contained, which is what makes the previous ticket's context disposable.

## Choosing verification

Behavior you can reliably check with a few actions is left for your manual verification. Existing checks still run, and existing tests may be maintained when the change affects them. The agent does not ask about adding tests on every small change.

For behavior that is difficult to test reliably by hand or impossible to test manually, the agent explains the gap and writes only the necessary tests or verification code. It needs no separate test approval. This includes more than data checks: timing, concurrency, rare failures, and otherwise unobservable behavior may qualify. Your explicit test requests also apply. Wider check runs need a specific unresolved concern or a user or project requirement.

Targeted verification does not automatically start [tdd](https://aihero.dev/skills-tdd); that workflow is for requests to work test-first. Implementation can be delivered while manual acceptance is pending, with that status stated clearly.

## Common questions

**Will a two-line change still produce new tests?**

Not by default. The decision depends on whether a person can effectively verify the behavior, not the number of changed lines or missing coverage. New automation addresses a concrete manual testing gap or an explicit test request.

**It finished, but my ticket is still open and the acceptance criteria are still unchecked.**

Correct, and expected. `implement` has no completion step. It ends at the commit and never touches the work item, confirmed on GitHub Issues and on the local markdown tracker, so it is not a tracker integration problem. It fixes substantiated review findings, but does not tick the `- [ ]` boxes on the originating issue. Close the ticket and reconcile the criteria yourself. This bites hardest on a dependency chain, because `to-tickets` defines the frontier as tickets whose blockers are all closed. If nothing gets closed, nothing ever becomes visibly unblocked.

**Can I point it at all my tickets at once, or run several in parallel?**

No. One invocation, one ticket. Batch dispatch across a ticket queue and [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) fan-out are both requested repeatedly, and neither exists. Running several `$implement` sessions side by side in one checkout is worse than unsupported: one field report describes a `git commit --amend` in one session landing on another session's commit, a stash vanishing from `refs/stash`, and commits landing on the wrong branch, all in a single afternoon across three issues. The sessions share one working directory, one index, and one HEAD. Git worktrees are the community workaround, and note that `refs/stash` is shared across worktrees too, so worktrees alone do not fix the stash case. If you want parallelism today, you are assembling it yourself.

**Can it open a pull request instead of committing?**

Not built in. It commits straight to the current branch, which several people find too eager: the code lands before they have had a chance to verify it works. There is no configuration flag and no PR mode. People override it in the invocation ("commit to a branch and open a PR") or by editing their local copy of the skill.

**`code-review` says it cannot see my changes.**

`implement` now passes its starting commit and spec to review. Current-work review includes staged, unstaged, and in-scope untracked files, so no interim commit is needed.

Separately, some people deliberately do not want the review inside the run at all, because an agent reviewing the code it just wrote is biased toward its own solution. Running [code-review](https://aihero.dev/skills-code-review) in a fresh session against a fixed point is a legitimate alternative, and is the same reason that skill runs its two axes in separate sub-agents.

**One ticket burned 150k tokens. Am I using it wrong?**

Inspect what consumed the time. This branch no longer requires a new test loop or a full suite for every ticket. Repeated checks should have a specific change, failure, or uncovered behavior behind them. If implementation and review still exceed one session, split the work into smaller tickets with [to-tickets](https://aihero.dev/skills-to-tickets).

**`$implement #2` in a fresh session worked on something completely unrelated.**

`#2` is resolved against whatever numbered list the agent can see, which in a fresh session may be a todo file, a checklist, or another work list rather than the configured tracker. The resolution is confident rather than fail-closed, so the mistake is not obvious until it has started. Pass the full reference, the issue URL or `owner/repo#2`, and ask it to confirm the title back before it begins.

## It's working if

- The session opens by reading the ticket or spec and restating what it will build, rather than asking you what to build.
- New tests address a stated manual testing gap or your explicit request.
- Necessary compilation and existing relevant checks run, with their actual results reported.
- You receive manual actions and expected results; checks you have not performed are marked as pending.
- The run reaches a commit on your current branch without you prompting it to carry on.
- The diff is one ticket's worth of change: a vertical slice through every layer, not several tickets swept together.

## Where it fits

`implement` is the build step of the main chain, second from the end:

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

Its neighbours are [to-tickets](https://aihero.dev/skills-to-tickets), which provides the work and verification decisions; [tdd](https://aihero.dev/skills-tdd), used when you request test-first work; and [code-review](https://aihero.dev/skills-code-review), which it runs before committing. The plan determines the requested behavior; the shared testing policy determines when new tests are useful.

That trust is why [wayfinder](https://aihero.dev/skills-wayfinder) merges onto the chain at [to-spec](https://aihero.dev/skills-to-spec) rather than looping its map straight into `implement`. Go straight to `implement` from a map only when the effort turned out genuinely small.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
