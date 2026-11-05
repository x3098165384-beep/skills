---
name: claude-handoff
description: Hand the current conversation off to a fresh background agent that picks up the work immediately.
---

先使用 `$handoff` 编写交接文档，遵循它的项目内保存位置、资料索引和当前要求记录规则；用户指定其他位置时按指定位置保存。然后用该文档启动新的后台代理：`claude --bg --name "<descriptive name>" -- "$(cat <summary file>)"`。Passing the file keeps the shell from running backticks or expanding `$` in the summary. It starts in the current working directory and returns immediately; the user manages it with `claude agents`.

Always pass `-n`/`--name` with a descriptive name (e.g. `--name "Fix login bug"`); it sets the display name shown in the job list, session picker, and terminal title.

交接文档中的技能建议使用准确的 `$skill-name`，并说明适用步骤。

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information, since the summary becomes the agent's prompt.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the summary accordingly.
