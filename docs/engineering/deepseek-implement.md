## What it does

通过现有脚本启动 DeepSeek Flash 独立 CLI，让它按 `$implement` 执行任务，省去每次重新了解调用方式。

## When to reach for it

任务已经确定，需要 DeepSeek 执行时使用 `$deepseek-implement`。Codex 用户目录中需已有 `tools/Invoke-DeepSeekTask.ps1`、`tools/DeepSeekTask.md` 和可用配置。

## Common questions

**需要重新整理整段对话吗？**

不需要。只传任务或 spec、必要背景、项目规则、已有授权和验证边界。独立进程不继承对话。

**主代理还会重复实现和审查吗？**

不会。主代理接收结果与阻塞；用户要求后才安排 Astra low 审查。

## It's working if

DeepSeek 实际执行，交付完成内容、验证结果和运行记录。调用失败如实报告，项目授权边界得到保留。

## Where it fits

这是 [implement](https://aihero.dev/skills-implement) 的独立 CLI 执行入口。源码见 [fork](https://github.com/x3098165384-beep/skills/blob/codex/skills/engineering/deepseek-implement/SKILL.md)。
