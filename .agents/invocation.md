# Model-invoked vs user-directed

Every `SKILL.md` in this repo is a skill. The upstream collection splits them by who is intended to start the workflow. This Codex edition preserves that design distinction but not the hard visibility boundary:

- **User-directed**: a workflow the human normally starts by typing `$skill-name`. Keep its `description` as a concise human-facing summary and strip broad trigger lists. In this branch, omit the unsupported `disable-model-invocation` field and set `policy.allow_implicit_invocation: true` so Codex advertises the skill reliably.
- **Model-invoked**: a reusable discipline the model or user can reach. Omit `disable-model-invocation`; leave implicit invocation enabled. Its `description` is **model-facing** and keeps rich trigger phrasing ("Use when the user wants…, mentions…, asks for…") so automatic selection fires. The test is: _could the model usefully reach for this autonomously?_

Codex intends `policy.allow_implicit_invocation: false` to preserve explicit `$skill-name` invocation while hiding the skill from automatic routing. Current Codex releases can instead treat such local skills as unavailable when they are absent from the model-visible catalog. This branch deliberately keeps them visible. The tradeoff is that the model can select a user-directed workflow automatically; narrow descriptions and the normal task and permission boundaries limit that behavior.

Every skill also carries an `agents/openai.yaml` beside its `SKILL.md`. It holds Codex UI metadata and the invocation policy. On this branch, keep `policy.allow_implicit_invocation: true` for both groups until Codex reliably resolves explicit-only local skills.

Bucket `README.md`s and the top-level `README.md` group entries into **User-directed** and **Model-invoked**.

## Explicit user overrides

Preserve user-requested manual-only settings. `discuss-with-docs` uses `policy.allow_implicit_invocation: false` and starts only on explicit user invocation. This overrides the visibility workaround above for that skill. Linking skills preserves their invocation policies, including `false`.

## Dependencies between them

Dependencies use Codex's explicit skill syntax (`Use $grilling`), not deep `../other-skill/FILE.md` cross-references and not a bare `/skill` mention. The `$name` marker tells Codex which installed skill owns the workflow or reference. Shared reference docs live inside the skill that owns them; other skills reach that material through the named skill rather than by linking across folders.

This is about **operative** instructions: a skill's own steps telling the agent to go run another skill right now. Router prose that names skills for a human to pick from (`ask-matt`, bucket `README.md`s) also uses `$skill` so the displayed spelling matches what the human can type in Codex.

When a step needs two skills, name the order explicitly (`Use $grilling, then $domain-modeling`) so each skill is loaded at the point where its instructions apply.

This convention lets Codex resolve either group on this branch. Preserve the intended control flow: when a step is a user decision or setup boundary (for example `setup-matt-pocock-skills`), tell the user to run the exact `$skill-name` instead of silently starting it.

## Passive vs active domain work

Merely _reading_ `CONTEXT.md` for vocabulary is a one-line prose pointer, not the `domain-modeling` skill. Only the active build/sharpen discipline (challenge terms, edge-case scenarios, write ADRs, update `CONTEXT.md` inline) is `domain-modeling`.
