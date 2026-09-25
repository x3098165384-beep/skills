---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

Save it under `docs/handoff/` in the project being handed off. Resolve the project root from the current task; when working in a subdirectory, use the containing project's root. For work outside a repository, use the current workspace as the root. Create `docs/handoff/` when needed. Use a descriptive filename such as `YYYY-MM-DD-HHMMSS-topic.md`, choosing a unique name to preserve existing handoffs. Return a link to the saved file in the final response. An explicit user-specified output path takes precedence.

Include a "suggested skills" section in the document, naming which skills the next agent should call the Skill tool for.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
