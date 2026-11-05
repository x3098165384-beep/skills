## What it does

`to-spec` turns the conversation you have just had into a **[spec](https://www.aihero.dev/ai-coding-dictionary/spec)**, and publishes it to your issue tracker as a single issue.

It does not interview you. When you reach for it, the deciding is already done. So it synthesises what is known (from the thread, the codebase, your `GLOSSARY.md` and ADRs) and does not start a new round of questions. The spec records decisions you already made. It is not a place to make new ones.

规格保留用户当前的范围、限制和已确认决定，区分仍未确定的建议与实施要求；用户故事覆盖必要行为，长度按实际需求决定。独立审查只记录用户已要求的范围，不随规格生成而自动增加。

## When to reach for it

Type `$to-spec` to invoke it directly. This Codex edition also keeps it model-visible so it is not misreported as unavailable.

Reach for it when settled decisions need a consolidated record for implementation or handoff, especially when the build spans several agent [sessions](https://www.aihero.dev/ai-coding-dictionary/session):

| Where you are | What to run |
| --- | --- |
| You haven't decided anything yet | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) first |
| Decided, and the work fits one [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) | [implement](https://aihero.dev/skills-implement), or `$to-spec` first when a consolidated record is useful |
| Decided, and the work spans several sessions | `$to-spec`, then [to-tickets](https://aihero.dev/skills-to-tickets) |
| A [wayfinder](https://aihero.dev/skills-wayfinder) map has cleared | `$to-spec #<map_issue>` |

## Prerequisites

`to-spec` publishes the spec as an issue, so [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) must first configure a tracker and the triage-label vocabulary for this repo. Either kind of tracker works: a real tracker like GitHub, or local markdown files under `.scratch/`, which work with no extra setup.

## The spec is a decision record

The spec exists because context windows end. You settled many things while [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling): the shape of the solution, the choices you argued through, and what you deliberately refused. All of that is in one conversation that you are about to clear. The spec keeps it.

So the spec does not validate or decide anything. It records what you decided, in your project's own vocabulary, so a fresh session can pick up the work without you explaining it again. If the spec states something you never said, that is a defect.

## Verification decisions

The spec's **Verification** section records manual steps, expected results, and existing checks from the agreed behavior. Needed automation carries its reason and scope: a specific manual testing gap or your explicit request. The skill does not reopen the conversation just to choose tests.

验收先对应已有讨论和调查指出的主要失败条件，写清触发方式、应有结果与已有证据；需要核实的内容保留为待验证事项。这样后续验证可以检查方案最可能失效的地方，同时保持已确认的需求范围；列出风险本身不增加防御机制或测试要求。

These decisions travel into tickets and implementation so a fresh session knows what a person can check and where automation is needed. Routine functionality does not acquire a test-writing requirement just by appearing in the spec.

## Common questions

**Where did `/to-prd` go?**
It is this skill, renamed in v1.1. "Spec" is now the one term used throughout, and the old `to-prd` slug no longer works, so reinstall under the new name. The old vocabulary is replaced by the pair *spec* and *tickets*. The spec is the destination and the decisions that fix it. The [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) are the steps that get there. 需求方向改变时，按最新决定更新原规格、受影响的任务和验证要求，保留仍有效的资料及决定变化的原因。

**Why does the spec get the `ready-for-agent` label? I don't want an agent implementing off it.**
The label means "no further triage needed": the document is complete enough for an agent to work from. It is an input designation, not a work order. But if you run [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agents that poll for `ready-for-agent`, that distinction isn't visible to them, and they will happily try to build the whole spec in one run instead of picking up the ticket slices. This is the most-reported rough edge on the skill. Until it changes, exclude the parent spec explicitly in your AFK agent's prompt, or strip the label once `$to-tickets` has run.

**Why not go straight from grilling to `$to-tickets` and skip the spec?**
Go straight to tickets when the notes or conversation already provide a clear plan. A spec earns its step when decisions need one consolidated record, especially across sessions. For a bounded change with clear acceptance criteria, direct implementation may be enough. Writing a spec does not commit you to ticket decomposition.

**I just finished a wayfinder map. What do I feed it?**
The main map issue: `$to-spec #<map_issue>`, not the individual decision tickets. [wayfinder](https://aihero.dev/skills-wayfinder) produces decisions rather than deliverables, scattered across a map; `to-spec` is the step that collapses them into one buildable document. Looping the map straight into `$implement` throws that collapse away.

**Is the spec for me to review, or is it just for the agent?**
它需要让用户和后续执行者看懂已确认的行为、范围、接口与验证要求。篇幅随实际需求决定；重复内容可以合并，详细依据用链接保留。若出现用户未接受的功能或决定，应修正规格，不能把它归因于用户讨论得不够充分。

**Do I keep the spec frozen once tickets start, or let the agent rewrite it?**
Nothing keeps it in sync. In practice it is a snapshot of what you knew at that moment, and it goes out of date the first time implementation teaches you something. Treat it as disposable after the work ships. Your `GLOSSARY.md` and ADRs are the files meant to last. If you learn something during implementation that should last, put it there, not in an edited spec.

**My work is a refactor or a module boundary, not a feature. Does the template fit?**
Less well, and this is a known limitation. The template leans hard on user stories, which is the wrong shape for architectural work: you end up writing stories nobody asked for around decisions that are really about interfaces and invariants. Lean on the implementation decisions and verification sections instead, and let the durable architectural calls land as ADRs via [grill-with-docs](https://aihero.dev/skills-grill-with-docs) rather than trying to make the spec carry them.

**Will it check the tracker for related work, or cite the ADRs it's respecting?**
No to both. It reads and follows the ADRs for the area it touches, but it does not link them. It also does not search the tracker for overlapping issues before it writes, so a spec can duplicate work that someone already filed, and nothing warns you. If the area is busy, search the tracker yourself first.

**`$to-tickets` couldn't read my spec: it kept truncating.**
Very large specs can outgrow what a tracker issue will serve back cleanly, and there is no local copy to fall back on. The fix is context hygiene: don't [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) or [compact](https://www.aihero.dev/ai-coding-dictionary/compaction) between `$to-spec` and `$to-tickets`. Run them in the same window and the spec never has to be re-fetched at all.

## It's working if

- It starts writing rather than asking you a fresh round of questions.
- Verification describes observable results and preserves the reason and scope for any needed automation.
- It comes back in your project's nouns, not generic product-management boilerplate.
- Every decision in it is one you can remember making. Nothing was invented to fill a section.
- The out-of-scope section has real things in it: the things you refused are usually the most useful lines on the page.
- The closing response links the spec and recommends tickets or direct implementation, with a reason based on the work's scope and dependencies.

## Where it fits

`to-spec` consolidates decisions in the main build flow. Its neighbours upstream are [grill-with-docs](https://aihero.dev/skills-grill-with-docs), which sharpens the design, and [wayfinder](https://aihero.dev/skills-wayfinder), whose finished map feeds the spec. After publication, it recommends one route:

- [to-tickets](https://aihero.dev/skills-to-tickets) when the work benefits from independently verifiable tasks, explicit dependencies, or multiple sessions.
- [implement](https://aihero.dev/skills-implement) when the work can be implemented and verified as one bounded task in a single session.

The recommendation uses the completed spec and existing context. Your chosen route takes precedence, and the next workflow starts when already authorized. When you're unsure which skill or flow fits, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.
