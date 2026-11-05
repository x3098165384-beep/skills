## What it does

`domain-modeling` builds and sharpens a project's **ubiquitous language** while you are designing. It challenges a term that conflicts with the glossary, asks for a precise word where you used a vague one, and tests a relationship against a concrete scenario until the boundaries are exact.

The skill records terms and relationships as you agree them during a [session](https://www.aihero.dev/ai-coding-dictionary/session). It uses root `GLOSSARY.md` and `docs/adr/`. In projects with multiple contexts, root `GLOSSARY-MAP.md` points to the per-context `GLOSSARY.md` files.

## When to reach for it

可以直接使用 `$domain-modeling`，其他流程也可在需要确认项目术语或记录决定时读取它。没有新增的已确认术语，或决定不符合 ADR 条件时，可以不修改文件。应核对实际确认了什么、是否按要求记录；仅凭 `GLOSSARY.md` 没变，不能判断技能没有执行。

Reach for it when the *words* are the problem:

| The situation | The move |
| --- | --- |
| Two people mean different things by "cancellation" | 先说明双方各指哪个对象和操作，再确认应使用的项目已有名称 |
| "Account" is doing three jobs in three files | `domain-modeling`: split it into Customer and User |
| You just made a hard-to-reverse architectural choice | `domain-modeling`: it offers an ADR, if the choice clears the bar |
| The module's *shape* is the problem: where the seam goes, how deep the interface is | [codebase-design](https://aihero.dev/skills-codebase-design) |
| You want the whole plan interrogated before you build | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), which drives this skill underneath |
| You want a term looked up, not changed | Nothing. Read `GLOSSARY.md`. It is a file. |

## Prerequisites

None up front. The skill writes into two places and creates both lazily:

- **`GLOSSARY.md`** at the repo root, created when the first term is agreed. If root `GLOSSARY-MAP.md` exists, follow it to the `GLOSSARY.md` for the relevant context.
- **`docs/adr/`**, created by the first ADR that clears the bar.

Nothing needs to exist before you start, and the skill creates nothing in advance.

## Two artifacts, two bars

The glossary and the ADR have different bars. Most of the trouble with this skill comes from mixing them up.

| | `GLOSSARY.md` | `docs/adr/NNNN-slug.md` |
| --- | --- | --- |
| Holds | 已确认的项目名称与对象关系；只有会造成混淆且已确认不用的说法才列入 `_Avoid_` | One decision, in one to three sentences: context, choice, reason |
| Bar to write | 项目对象及其名称已经确认；不为填术语表创造名称 | **All three**: hard to reverse, surprising without context, the result of a real trade-off |
| Written | Inline, the moment the term is settled | Offered, not assumed |
| Never holds | Implementation details, a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), a scratch pad, general programming concepts | A diary of every choice made this session |

Miss any one of the ADR's three tests and there is no ADR. An easily-reversed decision will just get reversed; an unsurprising one is nobody's question; one with no real alternative records that you did the obvious thing.

The `GLOSSARY.md` rule matters most, because it is the one that breaks in practice. **It is a glossary and nothing else.** Left unchecked, models treat "write to `GLOSSARY.md`" as permission to persist every answer you give, and the file turns into a running spec. This is the most-reported problem with the skill, across several models.

## Cross-referencing, and where it stops

When you state how something works, the skill checks the code and points out any contradiction. *"Your code cancels entire Orders, but you just said partial cancellation is possible, which is right?"* The skill makes the language and the code agree, out loud, before it changes either.

It cross-references **code** and the committed `GLOSSARY.md` and ADRs, and nothing else. It does not search your issue tracker. If your team argued out a naming collision and settled it in a closed issue months ago, the skill raises it again as if it were new. There is [an open request](https://github.com/mattpocock/skills/issues/717) to fix this. Until then, the workaround is to put the instruction in your own `docs/agents/domain.md`, which the skills already read.

## Common questions

**My `GLOSSARY.md` is 500 lines. 1,000. 3,000. What do I do?**
The size is a symptom, not the disease: the file has absorbed implementation detail and decisions that were never glossary material. The fix is a direct instruction: `$grill-with-docs make my GLOSSARY.md more concise and remove any implementation details from it`. Run it against a bloated file and most of it goes. Only reach for a `GLOSSARY-MAP.md` split once the file is genuinely lean and still covers two domains that a reader would not want to hold at once; splitting a bloated file just gives you several bloated files. The skill's guidance here is not yet strong enough to prevent the growth in the first place, and the issue tracking that is still open.

**My project still uses `CONTEXT.md`. How do I update it?**
`GLOSSARY.md` 说明文件记录的是项目名称、含义和关系。[上下文](https://www.aihero.dev/ai-coding-dictionary/context)还包括当前任务需要的代码、需求和其他资料，用它命名术语表容易让文件混入本应留在规格或任务记录中的内容。

Migrate the project's glossary to `GLOSSARY.md`, and `CONTEXT-MAP.md` to `GLOSSARY-MAP.md` when present. Update the map entries, project instructions, `docs/agents/domain.md`, and current document links in the same migration. Preserve the glossary's content and use the new names for future work.

**Where did `/ubiquitous-language` go?**
It was removed, and it was not deprecated. Its job moved into `domain-modeling`, which maintains the whole model continuously rather than dumping a glossary out of one conversation. Vocabulary enforcement now matters more, not less. It runs underneath grilling, triage and mapping rather than as a separate pass you have to remember.

**How do I get a glossary for a codebase that has none?**
Ask for it explicitly rather than waiting for it to accumulate. `$grill-with-docs help me scaffold my existing repo with a GLOSSARY.md` is the documented route; expect a long interrogation: one user reported 50+ questions before the file was in shape. Incidental use builds the glossary far too slowly on a brownfield repo.

**Can I use my own ADR format?**
Record project-specific ADR requirements in the project's instructions or `docs/agents/domain.md`. The standard layout uses `docs/adr/`; changing the glossary filename does not require changing the decision records' content.

**Does a glossary actually earn its keep? It is one more artifact to review, and it can go stale.**
Sometimes it does not. DDD gets less useful the closer it gets to the implementation. The payoff is upstream, in naming and concept alignment, not in aggregates and layer ceremony. Synonym control matters at naming boundaries: module names, table names, status enums, issue titles, CLI commands. It matters much less in ordinary prose. There is also an objection that domain terms compress communication *between humans* who already share them, and that an agent responds the same way to the plain-English description. On that reading, the glossary's value is keeping you and your reviewers aligned with what the agent is doing, not making the agent better. On a one-day build, skip it. And an unreviewed, agent-authored glossary is worse than none: it fills with confident claims that later sessions treat as true.

**Can it turn my vague prompts into domain language for me?**
No, and there is no plan for a skill that does. A domain language you do not understand yourself is meaningless once written down. This skill enforces precision once you have the understanding; it does not invent vocabulary you do not have. The related trap is using domain words without doing the modelling. The right nouns on top of the wrong concepts produce output that reads as correct and is not.

## It's working if

- It stops you mid-sentence to ask which of two things you meant, instead of picking one and moving on.
- `GLOSSARY.md` changes **during** the conversation, not in a burst at the end.
- It refuses to write an ADR for something you could undo tomorrow, and says which of the three tests failed.
- 新条目用简短日常语言说明已确认的项目对象和关系；普通近义词无需列入禁用清单。
- It quotes your code back at you when your code and your sentence disagree.
- `GLOSSARY.md` gets shorter as often as it gets longer.

## Where it fits

`domain-modeling` is a **model-invoked reference** that runs *underneath* other skills more often than it runs on its own. [grill-with-docs](https://aihero.dev/skills-grill-with-docs) drives it through a grilling session, [wayfinder](https://aihero.dev/skills-wayfinder) loads it while charting a map, [triage](https://aihero.dev/skills-triage) uses it to keep [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) in the project's own words, and [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) calls it as decisions settle. Its closest sibling is [codebase-design](https://aihero.dev/skills-codebase-design). Together they are the vocabulary layer under everything else, this one for the *domain*, that one for the module's *shape*. It is also reachable directly, when you want the discipline without committing to the steps of whatever skill would normally load it. When you are unsure which skill fits, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.
