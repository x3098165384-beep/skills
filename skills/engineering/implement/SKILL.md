---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
---

Implement the work described by the user in the spec or tickets.

Record the starting commit before editing.

用户明确改变范围或限制时，先检查原方案是否仍能满足目标，更新受影响的原规格、任务和验证要求；有其他执行者时，同步撤回的决定及当前要求。复用仍有效的调查，只调整受影响部分。

When choosing how to implement the agreed behavior, consider whether existing configuration, resources, or business entry points already provide a direct solution. Distinguish behavior and compatibility that need preserving from the old implementation's structure. Prefer changes that improve correctness, clarity, and maintenance; neither the fewest changed files nor additional abstractions are goals by themselves.

Ground new dependencies, shared-flow changes, and defensive handling in actual callers and supported use cases. Unconfirmed risks can remain verification questions. Compare feasible approaches before treating dependencies introduced by the current implementation as reasons to retain it. Reuse existing investigation and focus further checks on what could change the decision, keeping this proportional to the task rather than adding a separate approval stage.

Prioritize delivering the requested functionality. Use [Testing and verification](../tdd/TESTING-POLICY.md) to choose checks, and carry those decisions into any delegated work.

Run necessary compilation or type checks and directly relevant existing checks. Provide short manual steps and expected results; delivery can proceed with manual acceptance marked as pending.

Check the changed code and its actual callers against the agreed behavior and project rules, and fix issues found during implementation. Use $code-review only when the user requested a separate review, including a review agreed at the start of the task. Pass the starting commit and spec, include uncommitted changes, fix substantiated findings, and rerun affected checks.

收尾前，原位更新已被本次行为变化影响的现有说明和任务状态，区分实际完成与待验证内容。临时假设和执行过程留在任务记录；没有相关说明需要维护时，不为收尾另建文档。

Commit this task's work to the current branch as part of completing the workflow, without a separate confirmation. Keep unrelated changes out of the commit. Pending manual acceptance alone does not block committing; honor any user or project instruction to defer it.

Report the commit hash and verification results. If committing is blocked, report the specific blocker and remaining changes instead of treating implementation alone as completion.
