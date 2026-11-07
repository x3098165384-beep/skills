## What it does

`implement` builds work that has already been decided. You point it at a [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), or an agreed plan. It prioritizes working functionality, runs necessary compilation and directly relevant existing checks, provides manual acceptance steps, and commits to the current branch.

The agreed behavior and constraints remain the input. Before extending the code, the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) checks actual callers and existing workflows to explain what is still missing and which module should handle it. Existing configuration, resources, timing, and cleanup may already cover the need. The choice follows that evidence and weighs correctness and maintenance rather than preserving the old structure or simply minimizing the number of changed files, without adding a new design interview or approval stage.

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

The same-session case is worth naming because the skill's own first line doesn't cover it. `SKILL.md` says "the spec or tickets", which pushes the [model](https://www.aihero.dev/ai-coding-dictionary/model) to look for a file that doesn't exist. If the plan lives only in the thread, say so when you invoke it.

## Prerequisites

`implement` commits to the branch you are on. It does not create one, and it does not ask. Check you are on the branch you want the work on before you start.

If the tickets came from [to-tickets](https://aihero.dev/skills-to-tickets), the tracker they live on was configured by [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills). When requested, `code-review` reads the same configuration to find the originating spec.

## What one run does

A run has five steps, in order:

1. 读取任务或规格及其验证要求，记录起始提交。提供任务编号或链接时，先从已配置的任务管理工具读取并说明标题；编号或链接含义不清时，再向你确认。
2. Implement the behavior, adding targeted verification only where the shared testing policy calls for it.
3. Check the changed code and its actual callers, and run necessary compilation or type checks and existing tests that cover the change.
4. Provide manual steps and expected results, marking unperformed checks as awaiting your verification.
5. If a separate review was requested, run [code-review](https://aihero.dev/skills-code-review) against the starting commit and fix substantiated findings. Commit the completed task to the current branch after the required checks.

One run covers one ticket. The tickets [to-tickets](https://aihero.dev/skills-to-tickets) produces are tracer-bullet vertical slices sized to fit a single fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), so the intended rhythm is: clear context, implement one ticket, commit, clear again. Each ticket is self-contained, so you can discard the previous ticket's context.

实施途中明确改变范围或限制时，会重新检查方案是否成立，并同步受影响的原规格、任务、执行者和验证要求。仍有效的调查继续使用。收尾会更新因本次行为变化而失效的现有说明与任务状态，区分完成和待验证内容；不要求每次改动都另写一份文档。

## Choosing verification

Unconfirmed risks remain verification questions rather than requirements for extra handling. Existing investigation is reused, with further checks focused on facts that could affect the implementation choice.

Behavior you can reliably check with a few actions is left for your manual verification. Existing checks still run, and existing tests may be maintained when the change affects them. The agent does not ask about adding tests on every small change.

For behavior that is difficult to test reliably by hand or impossible to test manually, the agent explains the gap and writes only the necessary tests or verification code. It needs no separate test approval. This includes more than data checks: timing, concurrency, rare failures, and otherwise unobservable behavior may qualify. Your explicit test requests also apply. Wider check runs need a specific unresolved concern or a user or project requirement.

Targeted verification does not automatically start [tdd](https://aihero.dev/skills-tdd); that workflow is for requests to work test-first. Implementation can be delivered while manual acceptance is pending, with that status stated clearly.

成果交给另一工作区、其他机器或通过不同发布渠道取得时，会沿用项目现有流程，核对实际交付的完整文件及配置所需的依赖、类型与成员版本和安装条件。完整文件中已有改动所需的配套也要包含在检查中。本机验证、交付清单核对和接收方实际验证分别报告；接收方尚未验证时保持待验，缺少必要依赖的内容保持待交付，发布仍按原有授权执行。

## Common questions

**Will a two-line change still produce new tests?**

Not by default. The decision depends on whether a person can effectively verify the behavior, not the number of changed lines or missing coverage. New automation addresses a concrete manual testing gap or an explicit test request.

**It finished, but my ticket is still open and the acceptance criteria are still unchecked.**

收尾会更新原任务中实际完成和待验证的内容，是否勾选验收项或关闭票据按项目既定流程处理。提交不代表待验行为已经通过；依赖任务应查看实际已交付的结果与剩余条件，不能只凭票据是否关闭判断。

**Can I point it at all my tickets at once, or run several in parallel?**

`$implement` 每次处理一项任务。整份规格使用 [implement-spec](https://aihero.dev/skills-implement-spec) 编排，它默认在原工作区顺序实施，确实需要隔离修改时才使用独立分支和工作目录，收尾交回成果并清理不再使用的本次目录和分支。多个会话同时使用同一目录时，共享工作文件、暂存区和 HEAD；即使修改不同文件，也可能提交到错误分支或混入其他任务的修改。需要并行时使用独立工作目录，并协调仍然共享的数据库、外部状态及 `refs/stash`。

**Can it open a pull request instead of committing?**

Not built in. It commits straight to the current branch. Several people find this too eager, because the code lands before they can verify it works. There is no configuration flag and no PR mode. People override it in the invocation ("commit to a branch and open a PR") or by editing their local copy of the skill. When the agent does write the PR, [pr](https://aihero.dev/skills-pr) shapes its body.

**Do I need to ask it to commit after implementation?**

No. After the required checks and any requested review fixes, it commits this task's changes to the current branch without another confirmation and reports the commit hash. Unrelated changes stay outside the commit. Pending manual acceptance alone does not delay it; an explicit user or project instruction to defer committing takes precedence. If it cannot commit, it reports the blocker and remaining changes.

**`code-review` says it cannot see my changes.**

When a review is requested, `implement` passes its recorded starting commit and spec. Current-work review includes staged, unstaged, and in-scope untracked files, so no interim commit is needed.

A separate review runs only when you request it, including when you include it in the original task. Implementation still includes checking changed code and actual callers. You can also request [code-review](https://aihero.dev/skills-code-review) later in a fresh session.

**One ticket burned 150k tokens. Am I using it wrong?**

Inspect what consumed the time. This branch no longer requires a new test loop or a full suite for every ticket. Repeated checks should have a specific change, failure, or uncovered behavior behind them. If implementation and review still exceed one session, split the work into smaller tickets with [to-tickets](https://aihero.dev/skills-to-tickets).

模型读取和生成的内容以 [token](https://www.aihero.dev/ai-coding-dictionary/token) 计量，任务资料和工具输出都会占用可用的上下文。提高[推理强度](https://www.aihero.dev/ai-coding-dictionary/effort)会增加用于推理的输出 token。任务过大或检查重复时，应先处理这些具体原因，再判断是否需要调整模型设置。

**`$implement #2` in a fresh session worked on something completely unrelated.**

The agent resolved `#2` against another numbered list in context, such as a todo file or checklist, rather than the configured tracker. `implement` now fetches a passed reference from the issue tracker and states its title before starting, and asks when the reference is ambiguous. Check that title matches the ticket you meant; passing the issue URL or `owner/repo#2` removes the ambiguity entirely.

## It's working if

- The session opens by reading the ticket or spec and restating what it will build, rather than asking you what to build.
- New tests address a stated manual testing gap or your explicit request.
- Necessary compilation and existing relevant checks run, with their actual results reported.
- 交给其他环境使用时，能看到完整文件的必要依赖核对结果，以及接收方已经验证和仍待验证的内容。
- You receive manual actions and expected results; checks you have not performed are marked as pending.
- The run reaches a commit on your current branch without you prompting it to carry on, and reports the commit hash or a specific blocker.
- The diff is one ticket's worth of change: a vertical slice through every layer, not several tickets swept together.

## Where it fits

使用 [implement-spec](https://aihero.dev/skills-implement-spec) 实施整份规格时，每位执行代理也会读取并遵循本技能。`implement-spec` 负责依赖、共享写入和分支合并，并统一安排针对整份规格的审查；本技能继续负责每项任务的实现、验证和提交。修改这里的实施规则后，无需在 `implement-spec` 中重复维护一份。

`implement` is the build step of the main chain:

```txt
grill-with-docs → to-spec → to-tickets → implement → [requested code-review] → retro
```

Its neighbours are [to-tickets](https://aihero.dev/skills-to-tickets), which provides the work and verification decisions; [tdd](https://aihero.dev/skills-tdd), used when you request test-first work; and [code-review](https://aihero.dev/skills-code-review), which it runs before committing when you requested a separate review. The plan determines the requested behavior; the shared testing policy determines when new tests are useful.

That trust is why [wayfinder](https://aihero.dev/skills-wayfinder) merges onto the chain at [to-spec](https://aihero.dev/skills-to-spec) rather than looping its map straight into `implement`. Go straight to `implement` from a map only when the effort turned out small.

[ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
