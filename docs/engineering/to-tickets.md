## What it does

`to-tickets` takes a plan, a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), or the conversation you are in, and breaks it into a set of **[tickets](https://www.aihero.dev/ai-coding-dictionary/ticket)** on your issue tracker. It chooses the granularity and publishes directly, then reports the created tickets. Each ticket declares its **blocking edges**: the other tickets that have to finish before it can start.

Every ticket is a **tracer bullet**: a complete behavior through the required layers that can be demonstrated on its own. Each carries relevant verification decisions: manual steps, existing checks, and the reason and scope for any needed automation. Each ticket fits a fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), so a new [session](https://www.aihero.dev/ai-coding-dictionary/session) can implement it without the earlier conversation.

## When to reach for it

Type `$to-tickets` to invoke it directly. This Codex edition also keeps it model-visible so it is not misreported as unavailable.

| Where you are | What to run |
| --- | --- |
| You have a spec issue and the build spans several sessions | `$to-tickets`, or `$to-tickets #<spec_issue>` |
| The plan is only in the conversation, never written up | `$to-tickets` reads the thread directly, no spec needed |
| The whole change fits in one context window | [implement](https://aihero.dev/skills-implement), skip the tickets |
| Nothing is decided yet | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), then [to-spec](https://aihero.dev/skills-to-spec) |
| A [wayfinder](https://aihero.dev/skills-wayfinder) map has cleared | [to-spec](https://aihero.dev/skills-to-spec) first, to collapse the map, then `$to-tickets` |

Tickets that `to-tickets` produced are agent-ready by construction. Don't run [triage](https://aihero.dev/skills-triage) over them. Triage is for work that arrived from someone else.

来源是已有任务时，新任务会关联为它的子任务。依赖已使用平台自身的任务关系记录时，正文不再重复列出 `Blocked by`。

拆分沿用原规格和用户当前要求。针对整份规格的独立审查由 [implement-spec](https://aihero.dev/skills-implement-spec) 统一安排，任务引用原要求；只有明确要求逐项审查时，才列入对应任务，避免每项任务重复审查整份规格。

## Prerequisites

`to-tickets` publishes into a tracker, so [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) must have configured one for this repo, along with the triage-label vocabulary. Either kind works: a real tracker like GitHub or Linear, or local markdown files under `.scratch/`, which work with no extra setup.

## Tracer bullets, not layers

A **horizontal** slice ships one layer of the change. Nothing works until every layer has landed, and each ticket's acceptance criteria have to reach into work that another ticket owns. A **vertical** slice (the tracer bullet) ships one thin path through all the layers at once, so it is verifiable alone and owns everything it grades.

This is the rule people break most often. One team ran a 26-ticket stack sliced by layer (corpus, producer, aggregator, selector) and got roughly twenty agent runs per closed ticket, about three quarters of them rework. Their own post-mortem traced every failure class back to the horizontal slicing rather than to the implementations.

Before publishing, `to-tickets` looks for prefactoring (the principle "make the change easy, then make the easy change") and orders that work first. It checks the breakdown itself, merging unnecessary fragments, splitting work that exceeds a fresh context window, and keeping only real dependencies. Routine sizing decisions go straight to publication. It asks only when missing information materially affects scope or intended behavior and cannot be inferred. If you explicitly ask to review a draft first, it honors that request.

## Blocking edges

The edges are the point of the artifact. They work in two ways, depending on the tracker:

| Tracker | Where the edges live | How you work them |
| --- | --- | --- |
| Local markdown | Text in one file per ticket under `.scratch/<feature>/issues/<NN>-<slug>.md`, numbered blockers-first | Top to bottom, by hand |
| A real tracker (GitHub, Linear) | Native blocking links, or sub-issues where the tracker has them | Any ticket whose blockers are done is on the **frontier** and can be grabbed |

The edges live in the ticket either way. The tracker only decides whether anything can act on them in parallel. `to-tickets` produces the artifact; running it (one session at a time, or a fleet) is your job, not the skill's.

## The wide-refactor exception

One shape breaks the tracer-bullet rule. A **wide refactor** is a single mechanical change (rename a column, retype a shared symbol) whose **blast radius** covers the whole codebase. One edit breaks thousands of call sites, so no vertical slice can land green.

`to-tickets` sequences that as **expand–contract** instead:

- **Expand**: add the new form beside the old, so nothing breaks.
- **Migrate**: move call sites over in batches sized by blast radius (per package, per directory), one ticket per batch, each blocked by the expand. CI stays green because the old form still exists.
- **Contract**: delete the old form once no caller remains, in a ticket blocked by every migrate batch.

Where even the batches can't stay green alone, they share an integration branch and all block a final integrate-and-verify ticket. CI only has to be green at that ticket.

## Common questions

**It produced twelve tickets for a three-line change.**
The [model](https://www.aihero.dev/ai-coding-dictionary/model) checks for unnecessary fragments before publishing, but you can still ask it to merge tickets if the result is too fine. If the whole change fits in one context window, go straight to [implement](https://aihero.dev/skills-implement).

**The tickets came out one per layer: all the schema in one, all the API in another.**
The model should catch this before publishing by checking what each ticket delivers on its own. You can review the created-ticket summary with the same question: what can I demo when this is done? A ticket with no answer needs to be regrouped around a complete behavior.

**On GitHub the tickets weren't created as sub-issues of the spec issue.**
This was reported across a dozen runs and several models, [most fully in issue #554](https://github.com/mattpocock/skills/issues/554). Fixed: `to-tickets` now makes each ticket a sub-issue of its source issue, and the GitHub tracker template gives the command (`gh issue create --parent <n>`, `gh` 2.94+). Re-run [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) to refresh an older `docs/agents/issue-tracker.md`.

**"Blocked by" was written into the issue body instead of a real blocking link.**
This is the same kind of problem, [reported in issue #513](https://github.com/mattpocock/skills/issues/513), where the agent even stated that GitHub has no native blocking relationship at all. It does: `gh issue create --blocked-by 12,15`. Because the skill publishes blockers first, their numbers are always available at creation time. The body text is meant to be the fallback for trackers with no native edge, not the default. The ticket template now omits `## Blocked by` when the edges are native.

**Where do the local tickets go? The v1.1 notes said a root-level `tickets.md`.**
They did, and that was a bug: a single shared file also raced when parallel agents wrote to it. Local mode now writes one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, in dependency order, matching the layout the local tracker template already described. The `NN` prefix is a real ticket ID, so `$implement 03` works instead of retyping a long title.

**It kept truncating when it tried to read my spec.**
A very large spec can outgrow what a tracker issue serves back cleanly, and there is no local copy to fall back on, so the agent then burns [tool calls](https://www.aihero.dev/ai-coding-dictionary/tool-call) re-fetching chunks and never reaches the end. Don't [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) or [compact](https://www.aihero.dev/ai-coding-dictionary/compaction) between `$to-spec` and `$to-tickets`. Run them in the same context window and the spec never has to be fetched back at all.

**The acceptance criteria graded nothing: some passed before any work was done.**
The template asks for criteria and says nothing about whether they can fail, so this happens. Three shapes recur: a criterion already true at the base commit, a criterion that only work in another ticket can satisfy, and one that restates the request rather than deriving from the artifact. Vertical slicing prevents most of it, because a slice that delivers new behaviour fails at the base commit by construction. The check is still worth doing by hand. For each criterion, name the observation that would show it false, and confirm it fails at the commit the implementer starts from.

**The tickets are published. How do I actually run them?**
该技能交付任务与依赖，不自动派发。可以用 [implement](https://aihero.dev/skills-implement) 逐票执行，或用 [implement-spec](https://aihero.dev/skills-implement-spec) 统一编排。派发时核对实际已交付的前置结果及共享写入责任。`implement` 会维护实际完成与待验内容，是否关闭票据按项目流程处理，不能只靠票据开关判断依赖是否满足。

## It's working if

- Every ticket has an answer to "what can I demo when this is done?", and the answer is behaviour, not a layer.
- Tickets are created without a routine approval round, and the numbered summary links to each one with its deliverable and blockers.
- The ticket at the top has no blockers and can be started immediately.
- Nothing in a ticket body is a file path or a line number, except a snippet a prototype produced.
- Each ticket reads like something a fresh session could finish without you in the room.
- Prefactoring, where it found any, is at the front of the order rather than mixed into feature tickets.

## Where it fits

`to-tickets` is a step in the main build chain:

```txt
grill-with-docs → to-spec → to-tickets → implement → [requested code-review] → retro
```

Upstream is [to-spec](https://aihero.dev/skills-to-spec), which provides the agreed behavior and verification decisions; keep both in one unbroken context window. Downstream is [implement](https://aihero.dev/skills-implement), which prioritizes functionality with existing checks and manual acceptance, adds automation for specific manual testing gaps or explicit requests, and commits the result. A separate [code-review](https://aihero.dev/skills-code-review) runs when requested. [ask-matt](https://aihero.dev/skills-ask-matt) helps choose the flow. [implement-spec](https://aihero.dev/skills-implement-spec) reads the same blocking edges as a task graph and builds ready tickets in parallel on one integration branch, following the same testing policy.
