---
name: implement-spec
description: "Implement the result of $to-spec and $to-tickets in code."
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

每项任务的实施规则以 `$implement` 为准。主代理派发前读取该技能及其测试策略，将规格、任务、项目规则、用户当前要求和约定的验证要求提供给执行者；执行者也必须读取并遵循 `$implement`。主代理负责任务依赖、共享写入、分支合并和整体验证，收尾时汇总实际检查结果与待人工验收的内容。

The issue tracker should have been provided to you. If not, tell the user to run `$setup-matt-pocock-skills`.

目标是完成整份规格，并将本次改动及必需依赖交回开始任务时的原工作区和当前分支。默认顺序实施；确实需要隔离并行修改或原目录中的其他写入时，再创建独立分支和工作树。用户或项目明确要求分支、PR 或暂缓合入时，优先遵循，并清楚报告尚未交回原工作区的内容。

Local commits are part of this workflow and need no separate confirmation. Commit only the task's work. Pending manual acceptance alone does not block committing; honor any user or project instruction to defer it. If committing is deferred or blocked, preserve uncommitted work and report the blocker before dependent merges or cleanup.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Start every subagent with a fresh context window.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

主代理根据实际依赖和共享写入选择顺序或并行。顺序实施也使用新的执行代理和独立上下文，不为此单独创建分支或工作树。

## Steps

1. Read the spec and tickets to understand the task graph. 派发前核对任务实际需要的上游结果，以及执行者共用的文件、数据库、编辑器或外部状态。对共同写入明确负责人和读取时机；工作树不能隔离的状态按实际依赖协调。

2. 先复用规格、任务和现有调查中仍有效的资料。确有缺少的事实影响实施时，使用 `$research` 安排调查，说明具体问题和当前限制，沿用项目已有资料保存位置，并向后续执行者提供可读的完整路径或链接。

3. 记录原工作区路径、当前分支、起始提交和已有未提交工作，明确本次可修改的范围。默认让执行者在原工作区当前分支顺序实施，同一目录同一时间只由一位执行者修改和提交。需要隔离时，先说明具体原因和最终交回位置，为并行执行者创建独立分支和工作树；只有确实需要单独汇总结果时才另建集成分支。用户或项目要求 PR 时，在形成可审查提交后按既定流程创建草稿 PR，发布操作仍遵循原有授权要求。

   每次创建分支或工作目录后，在原任务记录中记下实际分支名、目录路径及用途。创建失败或取消时，用现有 Git 命令核对分支、实际目录及工作树登记，将留下的内容和处理结果记入同一记录，供收尾核对。

4. 为每项任务启动新的执行代理，各自使用独立上下文。派发时提供规格与任务的路径或链接、允许修改的范围、实际工作区与分支、已交付的前置提交、可复用的调查资料，以及上述项目规则和用户要求。每位执行者：
   - 开始前确认目录、分支及前置结果正确。顺序执行者使用原工作区的最新结果；独立执行者从主代理指定的已整合提交开始，需要重新创建工作树时先保留已有工作。
   - 记录本项任务的起始提交，使用 `$implement` 完成本项任务，按其中的要求选择实现方式、验证、更新原有说明和任务状态，并提交结果。
   - 返回提交编号、实际检查结果、待验项和具体阻碍。独立执行者按主代理安排同步整合后的最新修改；顺序执行者已经在原分支提交，不再创建额外的合并步骤。

   独立审查按用户指定的范围安排。用户要求独立审查但未指定逐项审查时，由主代理在全部任务合入后审查整份规格一次；执行者只在用户明确要求审查本项任务时调用 `$code-review`。派发时说明这一分工，并传递适用的起始提交和需求，避免把整份规格的审查重复分配给每个任务。

   主代理通过现有等待和状态工具核对阶段结果、实际产物与具体阻碍；没有变化时不重复查询。出现重复失败或范围偏离时，补充已查事实或调整分工，不能仅凭进程仍在认定有进展。用户改变范围时，由主代理更新受影响的原规格、任务、依赖和验证要求，并通知执行者哪些决定已撤回、当前要求是什么。

5. 一项任务完成后，核对其实际提交和前置结果。原工作区中的顺序提交直接作为后续任务的起点；独立分支的结果由主代理统一安排合入指定的汇总位置，再供依赖它的任务使用。只整合本次任务改动，保留原工作区其他未提交内容。

6. 根据已交付的前置结果更新可开始的任务。按第 3 步确定的方式继续派发；可以开始不等于必须并行，共享写入仍按已确认的顺序执行。

7. 全部任务完成后，按规格和项目规则检查整合后的行为及实际调用方，核对受影响的原有说明和任务状态，区分实际完成与待验证内容。按第 4 步确定的范围安排用户要求的独立审查；审查整份规格时，向 `$code-review` 提供第 3 步记录的起始提交和完整规格。需要修复已确认的问题时，启动新的执行代理，提供具体问题、修改范围和审查分工，使用 `$implement` 修复、检查并提交。主代理核对整合结果，重新运行受修复影响且已获准的检查。

8. 收尾前确认本次代码和修复已提交，并已交回第 3 步记录的原工作区；使用独立集成位置时，此时完成交回，核对实际文件及必需依赖，再在原工作区执行直接覆盖最终结果且已获准的检查。合并、还原或文件写入失败时，停止依赖该结果的后续操作，核实当前文件和未提交工作后再处理。原工作区仍未采用成果、PR 等待合入或用户要求暂缓时，报告具体位置和阻碍，保留工作，不将其写成已完成交付。按项目流程处理任务状态及草稿 PR，报告原工作区、实际分支、最终提交、验证结果和待验内容；本地交回与推送、SVN 提交等发布操作分别处理。

9. 交回并完成已获准的检查后，将本任务创建记录与当前 Git 分支、工作树登记及实际目录逐项核对，包括失败或取消创建留下的内容，清理本次不再使用的执行工作树、集成工作树及对应分支。逐项确认本次应交付的改动已交回、没有其他会话使用，并检查目录中未提交、未跟踪和被忽略的内容。已有历史能够恢复相同内容时复用历史；确有独有提交或文件且已确认不再需要时，先在仓库外保存并验证能够恢复，再移除目录和分支。用途未明、仍在使用或恢复核对失败时保留，说明具体原因和位置。每项创建记录都须有已清理或保留的结果，最终回复列明保留项的位置及原因。原工作区、原分支及其他任务的目录与分支不属于本次清理范围。
