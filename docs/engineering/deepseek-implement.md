## What it does

通过随技能提供的脚本启动 DeepSeek Flash 独立 CLI，让它按 `$implement` 执行任务。默认关闭 MCP，需要 Unity 且已批准具体操作时，可在同一脚本中开启 Unity MCP。

## When to reach for it

任务已经确定，需要 DeepSeek 执行时显式调用 `$deepseek-implement`；本技能不自动触发。需要 PowerShell 7、Codex CLI，以及 Codex 用户目录中可用的 DeepSeek 配置。脚本和参数说明随技能提供。

## Common questions

**需要重新整理整段对话吗？**

不需要。只传任务或 spec、必要背景、项目规则、已有授权和验证边界。独立进程不继承对话。

**主代理还会重复实现和审查吗？**

不会。主代理接收结果与阻塞；用户要求后才安排 Astra low 审查。

**等待 DeepSeek 时，我发消息也要等 5 分钟吗？**

不需要。5 分钟只限制主代理主动查询 DeepSeek 的频率；你的新消息立即处理，任务主动返回完成通知时也立即处理。等待使用可被新消息打断的方式。

**需要分别维护带 Unity 和不带 Unity 的两个脚本吗？**

同一个脚本通过 `-EnableUnityMcp` 切换。开启时同时填写 `-UnityOperationScope`，写明已批准的目标、操作和数量范围；其他 MCP 继续关闭。文件修改清单仍然有效，开启连接不会扩大 Unity 操作授权。具体参数见[脚本使用说明](https://github.com/x3098165384-beep/skills/blob/codex/skills/engineering/deepseek-implement/scripts/DeepSeekTask.md)。

**能看到它正在做什么吗？**

脚本启动后给出运行目录，事件和错误日志在运行中持续保存，可按查询间隔读取，无需等任务结束。

## It's working if

DeepSeek 实际执行，交付完成内容、验证结果和运行记录。调用失败如实报告，项目授权边界得到保留。

## Where it fits

这是 [implement](https://aihero.dev/skills-implement) 的独立 CLI 执行入口。源码见 [fork](https://github.com/x3098165384-beep/skills/blob/codex/skills/engineering/deepseek-implement/SKILL.md)。
