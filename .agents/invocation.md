# Model-invoked vs user-invoked

Every `SKILL.md` in this repo is a skill. The one axis that splits them is **invocation**, who can reach it:

- **User-invoked**: reachable **only by the human typing its name**. Set `disable-model-invocation: true` in the frontmatter (Claude Code) and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (Codex). The `description` is **human-facing**: a one-line summary read by a person browsing skills. Explicit invocation in Codex uses `$skill-name`. Strip trigger lists ("Use when the user says…").
- **Model-invoked**: reachable by **model or user**. The default: omit `disable-model-invocation` and the `policy` block from `agents/openai.yaml`. The `description` is **model-facing** and keeps rich trigger phrasing ("Use when the user wants…, mentions…, asks for…") so auto-invocation fires. The test for whether a skill should stay model-invoked: _could the model usefully reach for this autonomously?_ (Reuse is the reason to extract a skill, not the test.)

Each harness excludes a user-invoked skill from the model's reach in its own way, so nothing but the human can fire it: no other skill can. A user-invoked skill may invoke model-invoked skills, but it can never reach another user-invoked skill.

Every skill also carries an `agents/openai.yaml` beside its `SKILL.md`. It holds Codex UI metadata: `interface.display_name` and `interface.short_description` for the skill picker, and, for user-invoked skills, the `policy.allow_implicit_invocation: false` that pairs with `disable-model-invocation`. Keep the two in sync: a skill is user-invoked in both harnesses or neither.

Bucket `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**.

## Dependencies between them

Dependencies use Codex's explicit skill syntax (`Use $grilling`), not deep `../other-skill/FILE.md` cross-references and not a bare `/skill` mention. The `$name` marker tells Codex which installed skill owns the workflow or reference. Shared reference docs live inside the skill that owns them; other skills reach that material through the named skill rather than by linking across folders.

This is about **operative** instructions: a skill's own steps telling the agent to go run another skill right now. Router prose that names skills for a human to pick from (`ask-matt`, bucket `README.md`s) also uses `$skill` so the displayed spelling matches what the human can type in Codex.

When a step needs two skills, name the order explicitly (`Use $grilling, then $domain-modeling`) so each skill is loaded at the point where its instructions apply.

This convention only lets the agent load a **model-invoked** skill. A user-invoked skill still requires the human to type its name. When a step's precondition is a user-invoked skill (for example `setup-matt-pocock-skills`), tell the user to run `$setup-matt-pocock-skills` instead of attempting to load it automatically.

## Passive vs active domain work

Merely _reading_ `CONTEXT.md` for vocabulary is a one-line prose pointer, not the `domain-modeling` skill. Only the active build/sharpen discipline (challenge terms, edge-case scenarios, write ADRs, update `CONTEXT.md` inline) is `domain-modeling`.
