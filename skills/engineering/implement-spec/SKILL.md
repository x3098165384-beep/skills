---
name: implement-spec
description: "Implement the result of $to-spec and $to-tickets in code."
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

每项任务的实施规则以 `$implement` 为准。主代理派发前读取该技能及其测试策略，将规格、任务、项目规则、用户当前要求和约定的验证要求提供给执行者；执行者也必须读取并遵循 `$implement`。主代理负责任务依赖、共享写入、分支合并和整体验证，收尾时汇总实际检查结果与待人工验收的内容。

The issue tracker should have been provided to you. If not, tell the user to run `$setup-matt-pocock-skills`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

Local commits are part of this workflow and need no separate confirmation. Commit only the task's work. Pending manual acceptance alone does not block committing; honor any user or project instruction to defer it. If committing is deferred or blocked, preserve uncommitted work and report the blocker before dependent merges or cleanup.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Start every subagent with a fresh context window.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec and tickets to understand the task graph. 派发前核对任务实际需要的上游结果，以及执行者共用的文件、数据库、编辑器或外部状态。对共同写入明确负责人和读取时机；工作树不能隔离的状态按实际依赖协调。

2. 先复用规格、任务和现有调查中仍有效的资料。确有缺少的事实影响实施时，使用 `$research` 安排调查，说明具体问题和当前限制，沿用项目已有资料保存位置，并向后续执行者提供可读的完整路径或链接。

3. Record the starting commit and create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. 为每项任务启动新的执行代理，各自使用独立上下文、工作树和分支。派发时提供规格与任务的路径或链接、允许修改的范围、当前集成分支及其提交、可复用的调查资料，以及上述项目规则和用户要求。每位执行者：
   - 开始前确认工作树基于集成分支；需要重新创建时，先保留已有工作。
   - 记录本项任务的起始提交，使用 `$implement` 完成本项任务，按其中的要求选择实现方式、验证、更新原有说明和任务状态，并提交结果。
   - 将集成分支的最新修改合入自己的分支，再返回提交编号、实际检查结果、待验项和具体阻碍。

   独立审查按用户指定的范围安排。用户要求独立审查但未指定逐项审查时，由主代理在全部任务合入后审查整份规格一次；执行者只在用户明确要求审查本项任务时调用 `$code-review`。派发时说明这一分工，并传递适用的起始提交和需求，避免把整份规格的审查重复分配给每个任务。

   主代理通过现有等待和状态工具核对阶段结果、实际产物与具体阻碍；没有变化时不重复查询。出现重复失败或范围偏离时，补充已查事实或调整分工，不能仅凭进程仍在认定有进展。用户改变范围时，由主代理更新受影响的原规格、任务、依赖和验证要求，并通知执行者哪些决定已撤回、当前要求是什么。

5. Once an **implementer subagent** completes, merge its work to the integration branch with a **merger subagent**.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. 全部任务合入后，按规格和项目规则检查整合后的行为及实际调用方，核对受影响的原有说明和任务状态，区分实际完成与待验证内容。按第 4 步确定的范围安排用户要求的独立审查；审查整份规格时，向 `$code-review` 提供第 3 步记录的起始提交和完整规格。需要修复已确认的问题时，启动新的执行代理，提供具体问题、修改范围和审查分工，使用 `$implement` 修复、检查并提交，再合入集成分支。主代理核对整合结果，重新运行受修复影响的检查。

8. Confirm all task changes, including review fixes, are committed and merged; otherwise report the blocker before closeout. If a draft PR exists, mark it ready for review. Otherwise, resolve each ticket the way the issue tracker closes work. Report the integration branch, its final commit hash, and verification results.

9. Clean up all **implementer subagent** worktrees.
