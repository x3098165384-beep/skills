# Skill mechanics

The skill-specific branch of [`writing-for-agents`](SKILL.md): what changes when the document is a skill (frontmatter, the invocation choice, and router skills). Everything else about writing it is the universal reference in `SKILL.md`.

## Invocation

Two design roles, trading the two loads. This Codex branch keeps both visible because explicit-only local skills are not resolved reliably:

- A **model-invoked** skill has a model-facing `description` carrying the trigger branches, so the agent can select it autonomously and other skills can reach it. You can still type its `$name`. Its description is a top-level context pointer, so discoverability spends context.
- A **user-directed** skill is a workflow the human normally starts by typing its `$name`. Keep the `description` as a concise human-facing summary with broad trigger lists stripped. Omit the unsupported `disable-model-invocation` field and keep `policy.allow_implicit_invocation: true` in `agents/openai.yaml`; this spends some context but prevents Codex from misreporting the skill as unavailable.

Classify a skill as model-invoked when the agent should reach it on its own, or another skill must. If it is primarily a human-chosen workflow, classify it as user-directed and keep its trigger description narrow.

Shared reference that several skills need should live in a model-invoked reference skill or a plain file with an explicit pointer. Do not duplicate it across user-directed workflows.

An explicit user request for manual-only invocation overrides the visibility workaround: preserve `policy.allow_implicit_invocation: false`. `discuss-with-docs` is such an exception.

## Splitting by invocation

The invocation cut of splitting (the sequence cut lives in `SKILL.md`): split off a model-invoked skill when you have a distinct leading word that should trigger it on its own (a trigger word you actually use in your prompts), or another skill must reach it. You pay context load for the new always-loaded description, so that independent reach has to be worth it.

## Router skills

When user-directed skills multiply past what you can remember, that piled-up cognitive load is cured by a **router skill**: one user-directed skill that names the others and when to reach for each, so the human has one `$name` to remember instead of many. The router presents the exact next `$skill-name`; it does not silently cross a user decision boundary.
