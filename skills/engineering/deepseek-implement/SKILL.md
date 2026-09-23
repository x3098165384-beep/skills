---
name: deepseek-implement
description: 将已确定的 spec 或票据交给 DeepSeek Flash 独立 CLI，按 implement 执行。
---

主代理与用户通过 Matt skills 完成需求、spec 和规划；实现交给 DeepSeek Flash。规划、技能编写和工作流设计仍由主代理负责。

读取 Codex 用户目录下的 `tools/Invoke-DeepSeekTask.ps1` 和 `tools/DeepSeekTask.md`，通过该脚本启动独立 CLI。用户目录取 `CODEX_HOME`，未设置时用 `~/.codex`。缺少工具或调用失败时如实报告，不静默改用内置子代理或自行实现。

交接只写一份简短任务说明：spec 或票据位置、必要背景、项目规则、已有授权、修改范围和验证边界。提供 `$implement` 的可读绝对路径，要求执行者读取它及 Testing policy；独立进程不继承当前对话。明确取消自动审查和自动提交。

按脚本支持的模式和具体文件范围执行。遵守项目对源码修改、测试、Unity 操作和提交的要求；技能调用和系统写入权限不扩大授权。

DeepSeek 完成实现、必要自查和已授权验证。主代理处理方案决策与阻塞，只核对交付状态、修改范围和验证证据，不追读中间源码或重复调查。修正只传当前问题与必要背景，不累加交接历史。

交付改动摘要、验证结果、简短手工验收步骤和运行记录，由用户验证。仅在用户明确要求审查时，安排 `gpt-6-astra`、`reasoning_effort: low` 使用 `$code-review`；不可用时说明。审查发现交给 DeepSeek 修正。提交和推送由主代理按用户已有授权处理。
