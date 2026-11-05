---
name: retro
description: "Conduct a retrospective on a coding session."
---

The user has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** to improve future runs.

## Steps

1. 读取 `$writing-for-agents`，按其中的写作要求整理建议。

2. Read the primary sources for the session the user specifies. This may mean searching through session logs on this machine. If the user doesn't specify a session, default to the current one.

3. 按用户希望改善的工作确定复盘范围，从会话中的有效做法和返工过程提炼经验。用户要总结工作流时，沿阶段选择、需求确认、任务依赖、分工交接、验证与交付检查，不把分析限定为项目代码或规则。以下类别按实际证据选用，不为填满类别编造建议；区分已有要求未执行、当前指引过期和真正缺少的步骤，并保留适用条件。

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**：根据会话中实际发生的错误，先检查项目现有的检查命令、提交前检查和 CI，区分缺少检查、已有检查未运行和检查失效。新增测试或检查脚本遵循 `$tdd` 的 `TESTING-POLICY.md`，说明现有检查与人工验证无法覆盖的具体问题；仅仅没有提交前检查或 CI，不足以要求新增一套。
- **Coding standards**：先判断问题是否能由已有工具直接检查。固定语法、禁止使用的接口、导入或文件位置问题，优先建议复用或扩展现有检查；需要结合调用方、职责或行为判断的要求，写入项目已有编码说明。建议写明具体错误、负责执行的步骤和验证办法，实施按用户已有授权处理。
- **Global AGENTS.md**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ the AGENTS.md file is particularly large - in the repo OR the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **工具复用与持久化**：会话中反复编写执行、比较、迁移或验证脚本时，先查项目现有工具、维护服务和使用文档，再区分直接复用、扩展现有能力、确有缺口才新增工具，以及只保留本次记录。以当前源码、真实调用方和执行证据核对适用范围，不凭文件名或一次执行成功认定可复用；写死本批ID、旧修订、失败假设或未执行修正版的程序不能直接当作成熟工具。建议中写明重复的具体工作、已有入口、实际缺口、负责维护的模块、固定代码与文档路径及验证方式。工具程序与外部输入、备份、日志和大量检查输出分开存放；后者沿用项目已指定的目录，不另选临时位置。已有能力只缺调用入口或使用说明时，优先补入口或说明，不重新实现业务逻辑。
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent.

4. Present these candidates to the user, in order of severity. 涉及持久化工具时，分别说明已经存在、尚待验证和建议实施的内容；复盘建议本身不授权新增工具、修改资源或搬迁历史材料。

## Reference

### Implementation vs Review

Implementation includes checking the changed code and its actual callers against project rules. A separate review runs when the user requests it. When reviewing a session, distinguish implementation checks from an independent review and suggest improvements for the stage where the mistake occurred.

### Files

You have access to several files in the repo:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`: relevant rules guide implementation and any requested review. Add **navigation pointers** to docs folders if the standards file gets more than 1,000 lines long.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: use skills for docs (since their description goes into the agent's context window), or for user-directed commands. Follow the advice in the `writing-for-agents` skill.
