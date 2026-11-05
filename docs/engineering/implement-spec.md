## What it does

`implement-spec` takes a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) and its [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) and lands the whole thing in one run. The orchestrating [agent](https://www.aihero.dev/ai-coding-dictionary/agent) hands each ticket to an implementer [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) working in its own git worktree, merges each finished branch into a single **integration branch**, checks the integrated changes and their callers, and resolves the tickets.

它把任务读成 **task graph**，根据已交付的前置结果确定当前可开始的 **frontier**，在能够独立执行的任务间并行。共享写入按已确认的责任和顺序协调，任务不会仅因列在清单后面就等待所有前项，也不会仅因前置已完成就忽略共享状态冲突。

派发前还会检查实际共享的文件、数据库、编辑器和外部状态，明确共同写入由谁负责。独立工作树不能隔离这些共享状态。执行期间，主代理核对阶段产物和具体阻碍；用户改变范围时，同步受影响的任务、依赖与验证要求。整合后核对原有说明和任务状态，保留待验证内容。

## When to reach for it

Start this workflow by typing `$implement-spec`. This Codex edition keeps it model-visible so Codex can resolve the invocation reliably.

| Your situation | Reach for |
| --- | --- |
| A spec, split into tickets with blocking edges, that you want landed in one run | `$implement-spec` |
| One ticket at a time, in your own [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) between tickets | [implement](https://aihero.dev/skills-implement) |
| A spec that isn't split into tickets yet | [to-tickets](https://aihero.dev/skills-to-tickets) first |
| A small piece of work with no real graph to it | [implement](https://aihero.dev/skills-implement) directly |

## Prerequisites

- **An issue tracker.** The skill reads the tickets from, and resolves them on, the tracker [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) configured. If none has been configured, it stops and tells you to run that first rather than guessing.
- **Tickets with blocking edges**, as [to-tickets](https://aihero.dev/skills-to-tickets) writes them. Without edges the graph is flat and every ticket starts at once.
- **A [harness](https://www.aihero.dev/ai-coding-dictionary/harness) that runs subagents in the background and gives each one a git worktree.** The skill exists to run tickets at the same time, so on a harness that runs subagents one at a time, it is only a slower `implement`.

## The integration branch

Everything lands on one branch. Each implementer:

每项任务使用新的执行代理和独立上下文。需要修复审查发现的问题时，也使用新的执行代理。

1. confirms its worktree is based on the integration branch before it starts,
2. builds its ticket following the shared testing policy, using necessary compilation, relevant existing checks, and manual acceptance steps; [tdd](https://aihero.dev/skills-tdd) supplies a test-first loop when requested,
3. commits its ticket's changes, then merges the integration branch tip into its own branch and reports the resulting commit hash, so landing it is a fast-forward.

Local commits are included in the workflow without another confirmation. Manual acceptance can remain pending; a user or project instruction to defer commits takes precedence. A separate review runs only when requested, including when agreed at the start. Any fixes are checked, committed, and merged into the integration branch before closeout. The final response identifies that branch and its final commit hash, or explains what blocks completion.

The tracker decides whether a pull request exists at all. If your tracker closes work through PRs, or you ask for one, the skill opens a draft PR after the first merge and marks it ready at the end. Otherwise the run stops on the integration branch with every ticket resolved the way your tracker closes work, which works fully offline against a local markdown tracker.

Implementers talk to the orchestrator through [context pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer) (the spec, the ticket, shared exploration notes, earlier commits) rather than pasted summaries. This keeps each subagent's prompt small and leaves room in the orchestrator's window for the graph.

## Common questions

**How is this different from running `$implement` on each ticket myself?**

This is the question the skill exists to answer. Before it shipped, people kept building their own versions, and one user described the itch exactly: they wanted "subagents implement the tickets" instead of having "to individually create new session and tell them to implement a ticket one by one, when a spec may contain over 5 tickets." With `implement` you are the dispatcher: one [session](https://www.aihero.dev/ai-coding-dictionary/session) per ticket, clearing in between, and keeping track yourself of which tickets are unblocked. `implement-spec` hands that job to one orchestrating session. The price is that you no longer read each ticket's work as it lands; you review the integration branch at the end. To start a run, clear the context and type `$implement-spec` with a pointer to the spec (an issue number or a file path). For a small change with no real graph, skip it and use `implement` directly.

**Does it need GitHub? I want it to stop at the branch.**

No, not any more. One user who liked the in-progress version had exactly this complaint: "it creates a PR at the end, which requires an online repository like GitHub. I wish it could do the same work offline and stop at the branch where all the work is merged." The run now ends on the integration branch. A PR opens only when the configured tracker closes work through PRs or you ask for one, so on a local markdown tracker the run ends with every ticket resolved and the work merged on the branch.

**Its review and fix loop ran for hours, or kept "fixing" tickets that hadn't been built yet.**

Implementation includes checks of each ticket and the integrated result. A requested review runs once after all tickets have landed, using the recorded starting commit and the whole spec. Review findings are checked and substantiated issues are fixed; affected checks then run without automatically starting another broad review. Reviewing the whole spec before its tickets are complete would incorrectly report unbuilt work as missing.

**Does every implementer have to use tdd?**

This fork prioritizes functionality and passes the shared testing policy and the spec's verification decisions to every implementer. Existing checks and manual acceptance are the default; add automation for specific manual testing gaps or explicit requests. Use `$tdd` when test-first work is requested. Name any agreed seams in the spec or tickets so each implementer receives them.

**Two implementers running in parallel collided on the same file, or picked different names for the same thing.**

不同工作树仍可能修改同一个公共类型，或直接写入同一个数据库、工作簿和外部服务。派发前要核对实际读写对象，明确共享结果、名称和写入责任。确实需要先后顺序时增加依赖；只是需要采用一致名称时，在共同资料中确认即可，不必阻止其他独立工作。共享状态没有隔离时，不能等到合并代码才处理冲突。

**Blocked tickets never start, even after their blocker has merged.**

This is a known problem on GitHub. The tracker's blocked-by count only drops when a blocker *closes*, and tickets typically close when the PR merges, which is the end of the run. The tracker is the right source for the starting graph but a stale one mid-run. Tell the orchestrator to track which tickets have merged into the integration branch itself and compute the frontier from that.

**Does this replace Sandcastle or an AFK script?**

No. People ask because the skills now reach into implementation: "is Sandcastle still relevant? Your skills now seem to be able to handle implementation as well." `implement-spec` puts an agent in charge of orchestration inside one harness session, which needs no infrastructure and lets you watch and steer. For work that is truly [AFK](https://www.aihero.dev/ai-coding-dictionary/afk), a deterministic loop ([Sandcastle](https://github.com/mattpocock/sandcastle), a shell script, a CI job) is faster, cheaper, and more reliable, because no agent makes the orchestration decisions.

**A ticket's key test was skipped inside its worktree, and it reported green.**

A worktree holds only what git tracks. Tests that read gitignored fixtures, local databases, or credentials can silently skip there. For a ticket whose verification depends on untracked material, tell the orchestrator to run it in the main checkout instead.

## It's working if

- 依赖和共享写入范围允许时，多个实现者可以同时推进独立工作。
- A ticket starts as soon as its last blocker lands on the integration branch, not when the whole run ends.
- Every ticket reports actual check results and manual acceptance steps, including any acceptance still pending.
- Each completed ticket has a commit, and the final integration commit includes any fixes from the requested review.
- Merges into the integration branch are fast-forwards, not conflict resolutions.
- The run ends on one branch with every ticket resolved, and a PR only if your tracker wanted one.

## Where it fits

`implement-spec` is the build step of the main chain, as the parallel alternative to running [implement](https://aihero.dev/skills-implement) once per ticket:

```txt
grill-with-docs → to-spec → to-tickets → implement-spec → retro
```

Its neighbours are [to-tickets](https://aihero.dev/skills-to-tickets), which declares the blocking edges it reads as a task graph, and [code-review](https://aihero.dev/skills-code-review), which checks the integration branch before closeout when you requested a separate review. [ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
