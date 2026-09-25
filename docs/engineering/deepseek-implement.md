## What it does

通过现有脚本启动 DeepSeek Flash 独立 CLI，让它按 `$implement` 执行任务，省去每次重新了解调用方式。

## When to reach for it

任务已经确定，需要 DeepSeek 执行时显式调用 `$deepseek-implement`；本技能不自动触发。Codex 用户目录中需已有 `tools/Invoke-DeepSeekTask.ps1`、`tools/DeepSeekTask.md` 和可用配置。

## Common questions

**能直接看到 DeepSeek 的执行过程吗？**

可以。启动脚本默认新开 Windows Terminal 窗口，里面运行 PowerShell 7，显示模型公开输出的说明、命令结果和文件修改事件。窗口只用于观看，不增加 DeepSeek 的任务指令或上下文；运行时可最小化，关闭窗口可能中断任务。主代理仍自动接收最终报告。

**更新技能后，本机脚本怎样同步？**

将技能目录 `scripts/` 内的 `Invoke-DeepSeekTask.ps1` 和 `DeepSeekTask.md` 复制到 Codex 用户目录的 `tools/`。可见模式需要 PATH 中有 `wt.exe` 和 `pwsh.exe`；`-Hidden` 保留原来的无窗口方式。DeepSeek 配置和凭据继续使用本机已有设置。

**需要重新整理整段对话吗？**

不需要。只传任务或 spec、必要背景、项目规则、已有授权和验证边界。独立进程不继承对话。

**主代理还会重复实现和审查吗？**

不会。主代理接收结果与阻塞；用户要求后才安排 Astra low 审查。

**等待 DeepSeek 时，我发消息也要等 5 分钟吗？**

不需要。5 分钟只限制主代理主动查询 DeepSeek 的频率；你的新消息立即处理，任务主动返回完成通知时也立即处理。等待使用可被新消息打断的方式。

## It's working if

DeepSeek 实际执行，交付完成内容、验证结果和运行记录。调用失败如实报告，项目授权边界得到保留。

## Where it fits

这是 [implement](https://aihero.dev/skills-implement) 的独立 CLI 执行入口。源码见 [fork](https://github.com/x3098165384-beep/skills/blob/codex/skills/engineering/deepseek-implement/SKILL.md)。
