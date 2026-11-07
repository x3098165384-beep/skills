## What it does

`implement-spec` 根据一份[规格](https://www.aihero.dev/ai-coding-dictionary/spec)和对应的[任务](https://www.aihero.dev/ai-coding-dictionary/ticket)，安排[执行代理](https://www.aihero.dev/ai-coding-dictionary/subagent)完成整份工作。默认在开始任务时的原工作区当前分支顺序实施；确实需要隔离修改时，才创建独立分支和工作目录。成果交回原工作区后才算完成代码交付，不能只留下另一目录里的集成结果。

每位执行者读取并遵循 [implement](https://aihero.dev/skills-implement)，使用它规定的实现、验证和提交方式。主代理负责多项任务之间的依赖、共享写入、合并和整体验证；修改 `$implement` 中的实施规则后，这些执行者也按更新后的原文工作。

它根据任务依赖和已交付的前置结果确定哪些任务可以开始，再核对实际共享写入。可以开始的任务不必同时执行；主代理根据隔离需要选择顺序或并行，避免为本来就按顺序执行的工作增加分支和合并步骤。

派发前还会检查实际共享的文件、数据库、编辑器和外部状态，明确共同写入由谁负责。独立工作树不能隔离这些共享状态。执行期间，主代理核对阶段产物和具体阻碍；用户改变范围时，同步受影响的任务、依赖与验证要求。整合后核对原有说明和任务状态，保留待验证内容。

已有规格、任务和调查中的有效资料继续复用。只有缺少的事实会影响实施时，才用 [research](https://aihero.dev/skills-research) 补充调查，沿用项目已有保存位置，并提供后续执行者可读取的完整路径或链接。

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
- **有明确依赖的任务**，由 [to-tickets](https://aihero.dev/skills-to-tickets) 整理。没有前置依赖也仍需检查共享文件和外部状态，再安排执行顺序。
- **能为执行代理提供独立上下文的[执行环境](https://www.aihero.dev/ai-coding-dictionary/harness)**。顺序任务可以共用原工作区；需要并行隔离时，环境还须支持独立工作目录。

## 工作目录和交付位置

主代理先记录原工作区、当前分支、起始提交和已有未提交工作。每项任务使用新的执行代理和独立上下文，派发时提供当前需求、项目规则、写入范围、验证要求及已有资料。

本任务实际创建的分支名、工作目录路径及用途记在原任务记录中。创建失败或取消后，也会核对是否留下分支、目录或 Git 工作树登记，并记录实际处理结果。

| 实际情况 | 实施与交付方式 |
| --- | --- |
| 任务可以按顺序在原目录完成 | 在原工作区当前分支逐项实施、检查和提交，不另建任务分支。 |
| 并行任务或原目录中的其他写入需要隔离 | 说明原因，使用独立分支和工作目录，成果交回原工作区后核对最终文件及必需依赖。 |
| 用户或项目明确要求分支、PR 或暂缓合入 | 按要求保留结果，并报告尚未合入的内容和后续步骤。 |

本地提交包含在流程中，用户或项目要求暂缓时优先遵循。人工验收可以保持待验状态。独立审查只在用户要求时执行，默认在全部任务完成后审查整份规格一次；明确要求逐项审查时，按指定任务安排。已确认问题的修复同样使用 `$implement`，最终报告给出原工作区、实际分支、最终提交、验证结果及待验内容。

需要 PR 时，按项目流程准备可审查的提交，并遵守发布授权。PR 尚未合入或原工作区尚未采用成果时，明确报告交付还差哪一步。本地交回代码与推送、SVN 提交分别处理，不能因为尚未提交到服务器就把代码留在另一个目录里。

交回且完成已获准的检查后，将创建记录与当前 Git 分支、工作树登记及实际目录逐项核对，清理本次不再使用的任务分支和工作目录，包括失败或取消创建留下的内容。原工作区、原分支及其他任务的工作保留；有独有提交或文件时，先确认用途并验证能够恢复。每个创建项都有已清理或保留的结果；仍在使用、用途不明或恢复核对失败的内容保留，最终回复说明其位置和具体原因。

Implementers talk to the orchestrator through [context pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer) (the spec, the ticket, shared exploration notes, earlier commits) rather than pasted summaries. This keeps each subagent's prompt small and leaves room in the orchestrator's window for the graph.

## Common questions

**How is this different from running `$implement` on each ticket myself?**

使用 `$implement` 时，由你逐项启动任务并跟踪前置结果；`$implement-spec` 由同一个主代理安排整份规格的依赖、执行者和最终交付。两者都遵循相同的单项实施规则。调用时提供规格编号或文件路径；只有一项小修改时直接用 `$implement`。

**Does it need GitHub? I want it to stop at the branch.**

不需要 GitHub。使用本地 Markdown 任务管理时，可以在原工作区完成代码交付并更新任务状态。只有用户或项目流程要求时才准备 PR；明确要求成果保留在独立分支时，也会报告尚未合入的位置。

**为什么任务结束后还要再合并一次，原工作区才能使用？**

默认顺序实施直接使用原工作区，不需要另行合并。确实使用独立目录时，交回原工作区属于实施收尾，不能拖到准备 SVN 提交时才发现。交回失败时先核实实际文件和原有修改，再继续处理，不在失败后执行依赖它的后续步骤。

**任务分支和工作目录会一直保留吗？**

不会默认保留。收尾逐项核对本任务创建记录、Git 清单和实际目录。确认成果已交回、目录不再被使用、剩余内容能够恢复后，会清理本次创建的分支和目录。已有历史足够恢复时直接复用；当前历史之外的独有内容先保存并验证。失败或取消创建留下的内容同样核对，保留项会注明位置和具体原因。

**Its review and fix loop ran for hours, or kept "fixing" tickets that hadn't been built yet.**

每项任务和整合结果都会进行必要检查。用户要求独立审查且未指定逐项审查时，在全部任务合入后，用整合前记录的起始提交和完整规格审查一次；明确要求逐项审查时，按指定任务安排。主代理在派发时说明审查分工，修复任务只处理已确认的问题，并重新运行受影响的检查。提前按整个规格审查尚未完成的任务，会把后续任务误报为遗漏。

**我修改了 `$implement`，这里也会使用这些规则吗？**

会。主代理派发前读取它，每位执行者也读取并遵循原文，包括新增机制前的职责检查、验证方式、提交和原有说明维护。`implement-spec` 负责多项任务之间的安排；整份规格的审查由主代理按用户要求统一处理。

**Does every implementer have to use tdd?**

每位执行者遵循 [implement](https://aihero.dev/skills-implement) 及其测试策略，并收到规格中约定的验证要求。默认运行必要的现有检查、提供人工验收步骤；新增自动化处理具体的人工验证缺口或明确要求。只有要求先写测试时，才使用 `$tdd`。

**Two implementers running in parallel collided on the same file, or picked different names for the same thing.**

不同工作树仍可能修改同一个公共类型，或直接写入同一个数据库、工作簿和外部服务。派发前要核对实际读写对象，明确共享结果、名称和写入责任。确实需要先后顺序时增加依赖；只是需要采用一致名称时，在共同资料中确认即可，不必阻止其他独立工作。共享状态没有隔离时，不能等到合并代码才处理冲突。

**Blocked tickets never start, even after their blocker has merged.**

任务管理工具可能要等前置任务关闭才更新阻塞状态，而关闭又可能要等 PR 合入。实施中应依据前置成果是否已经交付到后续任务实际使用的位置判断，不能只等待任务管理工具的状态变化。

**Does this replace Sandcastle or an AFK script?**

No. People ask because the skills now reach into implementation: "is Sandcastle still relevant? Your skills now seem to be able to handle implementation as well." `implement-spec` puts an agent in charge of orchestration inside one harness session, which needs no infrastructure and lets you watch and steer. For work that is truly [AFK](https://www.aihero.dev/ai-coding-dictionary/afk), a deterministic loop ([Sandcastle](https://github.com/mattpocock/sandcastle), a shell script, a CI job) is faster, cheaper, and more reliable, because no agent makes the orchestration decisions.

**A ticket's key test was skipped inside its worktree, and it reported green.**

A worktree holds only what git tracks. Tests that read gitignored fixtures, local databases, or credentials can silently skip there. For a ticket whose verification depends on untracked material, tell the orchestrator to run it in the main checkout instead.

## It's working if

- 顺序实施没有额外创建分支或工作目录；需要隔离时，能看到具体原因和交回位置。
- 后续任务拿到实际可用的前置成果后开始，不被尚未关闭的任务状态误挡。
- 每项任务报告实际检查结果和人工验收步骤，待验内容保持明确。
- 原工作区已经采用本次代码及修复，最终提交可查；未交回时报告具体阻碍。
- 本任务创建记录与 Git 清单及实际目录逐项对应，包括失败或取消创建的残留；不再使用的分支和目录已清理，保留项有位置和具体原因，独有内容能够恢复。
- PR、推送和 SVN 提交遵循用户及项目要求，代码交付状态与发布状态分别说明。

## Where it fits

`implement-spec` 是主流程中编排整份规格的实施步骤；单项实现沿用 [implement](https://aihero.dev/skills-implement)，按实际需要安排顺序或并行：

```txt
grill-with-docs → to-spec → to-tickets → implement-spec → retro
```

上游 [to-tickets](https://aihero.dev/skills-to-tickets) 提供任务和依赖；需要独立审查时，由 [code-review](https://aihero.dev/skills-code-review) 检查实际整合结果。不确定路线时使用 [ask-matt](https://aihero.dev/skills-ask-matt)。
