## What it does

`ask-matt` is the router over the skills in this repo. You describe the situation you are in (an idea you cannot start, a pile of incoming bug reports, a [session](https://www.aihero.dev/ai-coding-dictionary/session) that has run long), and it names the skill or the sequence of skills that fits, plus where the human decisions in that sequence sit.

它先读取有关技能的 `SKILL.md`，再说明用途或建议下一步。推荐本身不会开始访谈、编写[规格](https://www.aihero.dev/ai-coding-dictionary/spec)或启动被推荐的技能；你已明确授权后续工作时，按该授权继续。这里的技能清单由人工维护，主要介绍本仓库的技能。

相关流程共用负责该步骤的规则：正式实施读取 [implement](https://aihero.dev/skills-implement)，交接读取 [handoff](https://aihero.dev/skills-handoff)，补充调查读取 [research](https://aihero.dev/skills-research)。原型转实施、规格拆任务及代理交接，都保留用户当前范围、限制和审查要求。

## When to reach for it

Type `$ask-matt` to invoke it directly. This Codex edition also keeps the router model-visible so it is not misreported as unavailable.

| Your situation | What the router gives back |
| --- | --- |
| An idea, and no idea where to start | The head of the main flow, and whether the build is small enough to skip the spec |
| Bugs and requests arriving from other people | The [triage](https://aihero.dev/skills-triage) on-ramp, and why [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) you generated yourself don't belong on it |
| Two skills that look interchangeable | The line between them, and it is usually one concrete test rather than a matter of taste. [grill-me](https://aihero.dev/skills-grill-me) or [grill-with-docs](https://aihero.dev/skills-grill-with-docs) turns on whether you are in a working directory; [grill-with-docs](https://aihero.dev/skills-grill-with-docs) or [wayfinder](https://aihero.dev/skills-wayfinder) turns on whether the effort fits one session |
| A long session and a decision about the [context](https://www.aihero.dev/ai-coding-dictionary/context) | The ordered tree over the five options at a phase boundary |
| A pull request body to write | `$pr`, for a visual summary, before/after evidence, and merge risk |
| A skill you have already picked | Nothing useful. Invoke that skill directly. |
| 想在 VS Code 代码旁看懂当前项目的代码 | 推荐手动调用 `$teach-with-code-explanation`，配合行内代码讲解插件，先用独立 Markdown 逐句解释代码，再完整执行例子；跨多次会话的主题学习使用 `$teach` |

## Prerequisites

The router names skills; it does not install them. Everything it points at has to be installed for the recommendation to be actionable. `$pr` 已列入正式技能；`in-progress` 中的试验技能仍不随插件提供。

The tracker-dependent routes (triage, `to-spec`, `to-tickets`, `implement`) assume [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) has already configured an issue tracker in the repo. The router recommends them even before that has happened.

## Flows, not skills

The skill's leading word is **flow**, a path *through* the skills rather than a single skill. When you name your situation, the router places you at a step on a flow. That is a different answer from "here is the skill that matches your keywords". There are five kinds of route, and the skill itself describes them in full:

- **The main flow**, idea to ship. Optionally start with [discuss-with-docs](https://aihero.dev/skills-discuss-with-docs) to lead the questions and develop discussion notes with reasons and references. Ending that discussion reconciles the notes, records confirmed terms and qualifying decisions through [domain-modeling](https://aihero.dev/skills-domain-modeling), and recommends the next useful step. Its closeout enters grilling directly when consequential design questions need your judgment; your explicitly chosen route takes precedence. Later steps can include a spec, tickets, implementation (one ticket at a time, or the whole task graph with [implement-spec](https://aihero.dev/skills-implement-spec)), review when requested, and [retro](https://aihero.dev/skills-retro). A prototype can settle questions that need runnable code. The flow adapts to the work rather than requiring every phase.

  选择 `implement-spec` 时，各执行者读取并遵循 [implement](https://aihero.dev/skills-implement) 的实施规则。主代理负责依赖、共享写入、合并和整体验证；针对整份规格的独立审查由主代理按用户要求统一安排。

- **On-ramps**, for a situation that generates work and then merges onto the main flow: incoming bug reports, something broken, or an effort too foggy and too large to hold in one session.
- **Codebase health**, upkeep rather than feature work. [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) surveys the code for deepening opportunities, and each one it finds re-enters the main flow as an idea.
- **Standalones**, which sit off every flow and which you use on their own: the prototype, the questionnaire, the research run.
- **A vocabulary layer underneath**, the two references the other skills pull in when the words rather than the process are the problem.

## The phase boundary

The skill's other key idea is the **phase boundary**. A phase is a chunk of work inside a session (the [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling), the implementation, the QA), and the boundary between two of them is the only place the question "what do I do with this context?" belongs. Mid-phase there is nothing to decide: continue, or split what is left into [subagents](https://www.aihero.dev/ai-coding-dictionary/subagent).

| Option | Take it when |
| --- | --- |
| **Continue** | The next phase wants this one verbatim, or you have [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) left. It is the only move that keeps the session as a [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source), so rule it out first |
| **`/clear`** | Everything behind you is disposable. The cheapest option, and you cannot undo it if you were wrong |
| **[handoff](https://aihero.dev/skills-handoff)** | Something has to travel: a new [harness](https://www.aihero.dev/ai-coding-dictionary/harness), a new directory, a colleague, a side task forked mid-phase |
| **Subagent** | The task is scoped tightly enough to run with you [away from the keyboard](https://www.aihero.dev/ai-coding-dictionary/afk) |
| **`/compact`** | None of the above. It is the default, and the tree often ends here |

Two of those are routinely got wrong, which is why the router carries the order rather than the list. `$handoff` reads like the general bridge between windows and is not: portability is the whole of what it buys. `/compact` is the bottom of the tree rather than the first reach, because the four questions above it are each cheaper or more precise.

## Common questions

**Does the implementation route still require TDD for every change?**

No. This branch prioritizes functionality with necessary existing checks and manual acceptance. [implement](https://aihero.dev/skills-implement) adds automation for behavior that is difficult to test reliably by hand or impossible to test manually, or for your explicit request. Diagnosis follows the same rule, including temporary reproductions. No separate test approval is needed for these gaps; [tdd](https://aihero.dev/skills-tdd) is for requests to work test-first.

**Do the implementation routes include committing?**

Yes. Both include local commits in delivery and report a final commit hash. `implement` commits to the current branch; `implement-spec` commits each ticket and includes any subsequent fixes in its integration branch. User or project instructions to defer committing take precedence.

**Isn't there just a list of the skills in the right order?**

People keep asking for one in the README. This skill is that list: it is what it exists for. A static table would say `wayfinder → to-spec → to-tickets → implement → [requested code-review] → retro` and be wrong for most situations, because the interesting parts are the branches: is there a codebase, does the build span sessions, can this question be settled by talking. The honest cost is that the router is hand-maintained and lags the repo. `$grilling` shipped long before the router named it.

**It told me half the skills aren't installed.**

Older builds of this fork preserved `policy.allow_implicit_invocation: false`, which hid user-directed skills from Codex's model-visible catalog. Codex can then misreport an installed explicit-only skill as unavailable. This branch keeps those skills visible instead. Invoke the exact `$skill-name`, or inspect the installed `.agents/skills` and `.codex/skills` directories when you need to verify what is present. The router keeps `$to-tickets` and `$implement` in the flow instead of replacing them with `$tdd` and `$code-review`, because the orchestration behavior is not equivalent.

**It described a skill's behaviour, and the skill doesn't do that.**

This is also a real bug, and also not fixed. The router answers from its own one-line summary of each skill rather than from the skill. One detailed report tracked three instances in a single session, including a recommendation to skip [to-spec](https://aihero.dev/skills-to-spec) based only on the summary "turn the thread into a spec". The router never opened `to-spec/SKILL.md`. In every case it verified only after the user pushed back, and never on its own initiative. Skipping `to-spec` there cost a real seam check, and the tickets that came out undercounted the work. When the router states something about another skill that you will act on, ask it to open that `SKILL.md` first. The same applies to questions the map does not cover at all, such as whether to use [plan mode](https://www.aihero.dev/ai-coding-dictionary/agent-mode): that answer is the [model](https://www.aihero.dev/ai-coding-dictionary/model)'s inference, not something written down here.

**Why is it prose instead of a numbered checklist?**

It is a fair complaint. An open issue argues that most of the routing is deterministic and that the narrative makes it hard to scan. Nothing stops you asking for the compressed form: "just give me the sequence" gets you the sequence. The prose carries the conditional part: the branches, where a human decision is expected, and where to clear or compact between steps. A flat checklist drops exactly that.

**Can it route over my own skills, or another author's?**

No. Three separate proposals have asked for a router that reads your local `skills/` directory and recommends from whatever is installed. `ask-matt` is not that. It is a map of one set, maintained by hand, and it knows nothing about skills you wrote or installed from elsewhere.

**It told me to edit a SKILL.md.**

That advice is often correct, but the edit rarely lasts. Someone asked it how to make [implement](https://aihero.dev/skills-implement) close tickets, was told to add a line to the skill, and saw the problem at once. `npx skills update` overwrites the file, and the plugin install is read-only. Put standing behaviour in your own `CLAUDE.md` or `AGENTS.md`, or say it in the invocation. Changes you make in the prompt survive updates. People point the flow at Linear instead of GitHub this way, or ask it which open tickets could run in parallel.

**It named a skill I don't have, or missed one I do.**

Check the changelog for a rename before assuming it is gone. `writing-great-skills` became [writing-for-agents](https://aihero.dev/skills-writing-for-agents) with no alias, `to-prd` became [to-spec](https://aihero.dev/skills-to-spec), and `pathfinder` became [wayfinder](https://aihero.dev/skills-wayfinder). Four skills were retired outright into the skills that absorbed them: `ubiquitous-language`, `design-an-interface`, `qa` and `request-refactor-plan`. If it misses a skill you have, that is the router's own lag, described above.

## It's working if

- It ends by naming what to type and stops there, instead of starting the work itself.
- The route it gives back mentions where to clear or compact context and where you are expected to review, not just a list of skill names.
- Where two skills are close, it says which one and why the other is wrong for you.
- Any claim it makes about another skill's behaviour shows up in the trace as it reading that skill's `SKILL.md`.
- You recognise your own situation in what it hands back, rather than the nearest generic scenario.

## Where it fits

`ask-matt` is a **standalone router** that sits over the whole set. It is never a step in a chain. It points into every chain, and the other docs pages link back to it so none of them has to redraw the graph. From here you most often land on [grill-with-docs](https://aihero.dev/skills-grill-with-docs), the head of the main flow, or [triage](https://aihero.dev/skills-triage), the on-ramp for work that arrived rather than work you started.

It is a [secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source) over the skills it describes. Where the router and a `SKILL.md` disagree, the `SKILL.md` is right.
