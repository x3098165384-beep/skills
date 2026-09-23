---
name: deepseek-implement
description: 通过独立 CLI 启动 DeepSeek Flash，按 implement 执行已确定的任务。
---

用 DeepSeek Flash 独立 CLI 执行用户已确定的任务。

脚本位于 `$CODEX_HOME/tools/Invoke-DeepSeekTask.ps1`，用法见同目录 `DeepSeekTask.md`；未设置 `CODEX_HOME` 时用 `~/.codex`。按需读取，已知用法直接复用。

写一份简短任务文件，包含 spec 或任务、项目规则、已有授权和验证边界，以及 `$implement` 的可读路径。要求 DeepSeek 按 `$implement` 执行；独立进程不继承当前对话。明确不自动审查或提交。

通过脚本的 `TaskFile`、`WorkDirectory` 提交。需要写文件时按授权使用 `TaskMode ScopedWrite` 和具体 `WritableFiles`；只读默认模式不能用于实现。遵守项目的测试和 Unity 限制。

等待结果，只核对交付状态、修改范围和验证证据，不重复执行者的调查和源码自查。需要修正时只交接当前问题。调用失败如实报告，不静默换成自己执行或内置子代理。

返回完成内容、验证结果和运行记录路径，交给用户验证。用户明确要求后才安排 Astra low 审查；提交和推送按已有授权处理。
