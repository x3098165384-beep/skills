## What it does

把已确定的 spec 或票据交给 DeepSeek Flash 独立 CLI，按 `$implement` 实现。主代理负责规划和决策，审查等待用户明确要求。

## When to reach for it

需求和规划确定后使用 `$deepseek-implement`。技能保持可发现；规划、技能编写和工作流设计仍由主代理完成。

## Prerequisites

Codex 用户目录中已有 `tools/Invoke-DeepSeekTask.ps1`、`tools/DeepSeekTask.md` 和可用的 DeepSeek 配置。

## Common questions

**谁执行，谁审查？**

DeepSeek 实现并完成必要自查和已授权验证。主代理不重复调查或审查。用户验证后要求审查，再安排 Astra low；发现的问题交给 DeepSeek 修正。

**会绕过项目的测试或 Unity 限制吗？**

不会。交接带上项目规则和已有授权，执行始终受其限制。技能不自动授权测试、Unity 操作、提交或推送。

## It's working if

主代理保留规划和决策，执行者交付改动、验证结果、验收步骤和运行记录。用户能验证结果，审查只在明确要求后开始。

## Where it fits

接在 [to-spec](https://aihero.dev/skills-to-spec) 或 [to-tickets](https://aihero.dev/skills-to-tickets) 后，由独立 CLI 使用 [implement](https://aihero.dev/skills-implement)。本技能的源码位于 [fork 的 codex 分支](https://github.com/x3098165384-beep/skills/blob/codex/skills/engineering/deepseek-implement/SKILL.md)。
