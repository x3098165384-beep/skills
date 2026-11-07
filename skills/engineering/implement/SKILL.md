---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
---

Implement the work described by the user in the spec or tickets.

用户提供任务编号或链接时，先从已配置的任务管理工具读取任务并说明标题；无法确定指的是哪项任务时，再向用户确认。

Record the starting commit before editing.

用户明确改变范围或限制时，先检查原方案是否仍能满足目标，更新受影响的原规格、任务和验证要求；有其他执行者时，同步撤回的决定及当前要求。复用仍有效的调查，只调整受影响部分。

Before adding mechanisms, dependencies, shared-flow changes, or defensive handling, trace actual callers, existing configuration and resources, and affected workflows to identify what agreed behavior remains unsatisfied and which module should own it. Include relevant timing and cleanup in this check. Briefly explain the concrete gap and why existing behavior cannot cover it, comparing feasible approaches before choosing the implementation. Preserve required behavior and compatibility, not the old structure; correctness, clarity, and maintenance decide, not file counts or abstraction counts. Keep unconfirmed risks as verification questions rather than requirements. Reuse existing investigation and limit further checks to facts that could change the decision, in proportion to the task and without adding an approval stage.

Prioritize delivering the requested functionality. Use [Testing and verification](../tdd/TESTING-POLICY.md) to choose checks, and carry those decisions into any delegated work.

Run necessary compilation or type checks and directly relevant existing checks. Provide short manual steps and expected results; delivery can proceed with manual acceptance marked as pending.

成果需要交给另一工作区、其他机器或通过不同发布渠道取得时，沿用项目现有交付和发布流程，按实际交付的完整文件与配置核对接收方能否取得必要依赖、所用类型与成员在目标版本中是否存在，以及安装前置条件是否满足。完整文件中已有改动的依赖也要核对，不能只检查本次 Git 差异或以本机验证通过代替。缺项按项目规则补入交付范围；超出授权范围时说明具体缺项及影响，将受影响内容标为待交付。分别报告本机验证、交付清单核对和接收方实际验证的范围与结果，未运行的接收方验证明确待验；发布仍遵循用户和项目的授权要求。

Check the changed code and its actual callers against the agreed behavior and project rules, and fix issues found during implementation. Use $code-review only when the user requested a separate review, including a review agreed at the start of the task. Pass the starting commit and spec, include uncommitted changes, fix substantiated findings, and rerun affected checks.

收尾前，原位更新已被本次行为变化影响的现有说明和任务状态，区分实际完成与待验证内容。临时假设和执行过程留在任务记录；没有相关说明需要维护时，不为收尾另建文档。

Commit this task's work to the current branch as part of completing the workflow, without a separate confirmation. Keep unrelated changes out of the commit. Pending manual acceptance alone does not block committing; honor any user or project instruction to defer it.

Report the commit hash and verification results. If committing is blocked, report the specific blocker and remaining changes instead of treating implementation alone as completion.
