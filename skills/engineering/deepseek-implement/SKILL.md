---
name: deepseek-implement
description: 通过独立 CLI 启动 DeepSeek Flash，按 implement 执行已确定的任务。
---

用 DeepSeek Flash 独立 CLI 执行用户已确定的任务。

仅在用户明确调用本技能时启动，不自动触发。

脚本位于 `$CODEX_HOME/tools/Invoke-DeepSeekTask.ps1`，用法见同目录 `DeepSeekTask.md`；未设置 `CODEX_HOME` 时用 `~/.codex`。按需读取，已知用法直接复用。

写一份简短任务文件，包含 spec 或任务、项目规则、已有授权和验证边界，以及 `$implement` 的可读路径。要求 DeepSeek 按 `$implement` 执行；独立进程不继承当前对话。明确不自动审查或提交。

通过脚本的 `TaskFile`、`WorkDirectory` 提交。需要写文件时按授权使用 `TaskMode ScopedWrite` 和具体 `WritableFiles`；只读默认模式不能用于实现。遵守项目的测试和 Unity 限制。

等待结果，只核对交付状态、修改范围和验证证据，不重复执行者的调查和源码自查。需要修正时只交接当前问题。调用失败如实报告，不静默换成自己执行或内置子代理。

DeepSeek 未返回报告时，从任务启动或上次主动查询起，至少间隔 5 分钟再查询进度或结果。等待期间使用能被用户新消息打断的方式，收到消息立即处理；不要用持续阻塞 5 分钟的工具调用来实现查询间隔。任务主动返回完成通知时可以立即处理，不必等满 5 分钟。此间隔只约束对 DeepSeek 的主动查询，不限制响应用户消息。

返回完成内容、验证结果和运行记录路径，交给用户验证。用户明确要求后才安排 Astra low 审查；提交和推送按已有授权处理。
