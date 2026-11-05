## What it does

`retro` looks back over a coding [session](https://www.aihero.dev/ai-coding-dictionary/session) and suggests improvements to the agent's **[environment](https://www.aihero.dev/ai-coding-dictionary/environment)**, so the next run goes better. It reads the session's own record (the current one by default, or one you point it at in the session logs). It finds the moments where the agent struggled, and gives you a list of candidate fixes, most severe first.

复盘范围按用户希望改善的工作确定。需要总结工作流时，也检查阶段选择、需求确认、任务依赖、分工交接、验证和交付，同时保留成功做法与适用条件；已有要求未执行、指引过期和真正缺少步骤，会分别处理。

It changes the environment, not the code. The bug the agent shipped, the file it took twenty [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call) to find, the rule the reviewer missed: `retro` doesn't fix any of them in place. It asks what about the repo let them happen, and proposes the check, the pointer, or the standard that stops them happening again. It also only proposes; nothing changes until you pick a candidate.

## When to reach for it

Start this workflow by typing `$retro`. This Codex edition keeps it model-visible so Codex can resolve the invocation reliably.

会话出现反复调查、返工、协作阻塞或信息缺失时，适合复盘原因；也可以复盘顺利完成的任务，确认哪些做法值得复用，以及它们依赖什么条件。只需要对代码改动作出审查结论时，使用 [code-review](https://aihero.dev/skills-code-review)。

## Where the findings land

Each candidate belongs to one category, and the category decides where the fix goes:

| What went wrong in the session | Fix it with |
| --- | --- |
| The agent took a long time to find a file or fact | A **navigation pointer** from a file it already reads |
| It made a mistake a tool could have caught | An **[automated check](https://www.aihero.dev/ai-coding-dictionary/automated-check)**: lint rule, type, test, pre-commit hook, CI job |
| The reviewer missed a judgement-call mistake | A rule in `CODING_STANDARDS.md` for the reviewer agent |
| `AGENTS.md` or `CLAUDE.md` is large | Move its steering out, into standards or checks |
| A tool call was expensive for what it returned | Streamline the tool, or replace it |
| A steering file is full of lines that change nothing | Delete the **no-ops** |
| The agent needed information it couldn't reach | Widen its access: tee the dev server log to a file, give read-only access to a service |
| 流程选择、任务依赖、分工或交接导致返工 | 在负责该步骤的已有技能中补缺少的动作，或消除冲突；项目特有的要求留在项目说明中 |
| 反复编写执行、比较、迁移或检查脚本 | 先核对现有工具和业务维护入口；优先复用或扩展，确有缺口才建议新增，只缺入口或说明时补上关联 |

Project standards guide implementation and any requested review. The implementing agent checks its changes and actual callers; an independent reviewer checks the requested scope with its own evidence. A retrospective places guidance where the responsible stage will read it, with short references from [AGENTS.md](https://www.aihero.dev/ai-coding-dictionary/agents-md) when needed.

持久化建议需要说明重复的具体工作、已有入口、实际缺口、维护位置和验证方式，并区分已存在、待验证和建议实施的内容。工具代码与输入、备份和检查输出分别存放，执行材料沿用项目指定目录。旧批次脚本和未执行的修正版不能直接当作成熟工具；复盘建议也不授权实施、修改资源或搬迁历史材料。

Before `retro` writes any rule, it classifies the violation. A **mechanical** violation (a banned API, an import shape, a file-location rule) gets a deterministic check, because a check can fail and a sentence in a standards file can't. Only real judgement calls, which no linter can enforce, become prose. If the repo has no guardrail at all (no pre-commit hook, and no CI job that runs lint, typecheck, and tests), `retro` reports that as a finding of its own.

## Common questions

**Does it write the lint rule itself, or wait for a yes? Can I wire it to run after every session?**

It waits. `retro` only proposes. Nothing changes until you pick a candidate, so it edits nothing by hand and installs no hook automatically. This is deliberate. One user asked for exactly this after being "burned by auto-hooks that blocked good changes." It takes judgement to decide what deserves a permanent check, so the skill stays [human-in-the-loop](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop) and user-invoked. Some users do run it after every implementation run. But a smooth session has little to teach, so a run after every session mostly produces rules nobody needed. There is no dry-run mode. A proposed check is code like any other, so try it against the repo before you let it block merges.

**Won't this pile up lint rules forever? Does it ever suggest removing one?**

Partly, and this is its weakest spot. It can remove prose: no-ops in steering files, and steering in `AGENTS.md` or `CLAUDE.md` that belongs in standards or a check. It flags these for deletion when the files are large. It judges them against the one session it reads, so treat each one as a candidate for the deletion test, not a verdict. It does not audit the lint rules, hooks, or CI jobs it proposed last month. It sees one session, so it cannot tell you that a rule now fires too often or that the bug behind it is gone. You must still prune checks yourself. A rule that fires constantly on good code is the sign to remove it.

**Won't it just invent generic advice to fill its categories?**

This is the strongest criticism of it. One user found that "once the job is finished, the AI tends to forget the struggles from the middle of the session and invents generic advice to satisfy the retro categories." Every candidate must come from the session's own record, so the advice is specific to that session. This has a cost as well as a benefit. It rarely invents something irrelevant, but it can give too much weight to whatever this one session was about. Discard any candidate you can't trace to a specific moment. Treat the severity order as a first draft too, because a quiet, expensive mistake can rank below a loud, cheap one.

**My session is long. Run it now, or start fresh?**

By default it reviews the current session, which is the best case: the struggles are still in the context window. If the session has drifted out of the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) already, [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) and point a fresh `$retro` at the previous session in the session logs instead.

**The agent keeps making the same mistake. Should I add a line to `CLAUDE.md`?**

Usually not, and that's the most common place `retro` pushes back. A line in `CLAUDE.md` is loaded into every session, dilutes everything else in the file, and drifts as the code changes. If the mistake is mechanical, the fix is a check that fails. If it's a judgement call, it goes in the coding standards used during implementation and any requested review. `AGENTS.md` and `CLAUDE.md` are for navigation pointers, and little else. For the same reason `retro` is not a [memory system](https://www.aihero.dev/ai-coding-dictionary/memory-system): it doesn't store what happened, it changes the environment so it can't happen again.

**My setup mentions `CODING_STANDARDS.md` and I don't have one. Where does it come from?**

No skill ships the file. The first time a session finds a judgement-call rule for the reviewer, `retro` proposes to create it. After you accept, [code-review](https://aihero.dev/skills-code-review) reads it. Any other standards doc you already keep, such as `CONTRIBUTING.md`, works the same way.

**How is it different from `improve-codebase-architecture`?**

The input is different. [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) needs only the code, and looks for structural improvements to it. `retro` needs a session history, and improves the environment the agent works in, not the code. You use both; neither replaces the other.

## It's working if

- Every candidate points back to a specific moment in the session, not a generic best practice.
- Repeat mistakes turn into failing checks, and your `AGENTS.md` gets shorter over time rather than longer.
- A missing check that already existed but sat unwired shows up as the finding, rather than a proposal to build a new one.
- 下一会话能从业务文档找到经过验证的工具入口，执行材料的位置明确，已有能力与待实施建议分得清楚。
- The next session on the same kind of task finds its way faster.

## Where it fits

`retro` is the last step of the main chain, where you review how the chain went:

```txt
grill-with-docs → to-spec → to-tickets → implement → [requested code-review] → retro
```

Run it after a build worth learning from, in the same session or pointed at that session's log. You can skip it after a smooth build.

- [code-review](https://aihero.dev/skills-code-review) is the reviewer agent that `retro` most often tunes. New coding standards go where its Standards axis reads them.
- [writing-for-agents](https://aihero.dev/skills-writing-for-agents) sets the writing style for every steering file and skill that `retro` proposes, and `retro` loads it before it starts.

[ask-matt](https://aihero.dev/skills-ask-matt) routes across the whole set when you are unsure which skill the situation needs.
