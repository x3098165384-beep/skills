## What it does

`triage` works through the issues on your project's tracker. It moves each one through a small state machine of **triage roles** (a category role and a state role). Each issue ends as an agent-ready brief, a specific question for the reporter, or a closed issue with a recorded reason.

It is only for issues **you didn't create**. Raw bug reports, incoming feature requests, an external pull request that arrived unannounced: work that landed in the tracker from outside, in whatever shape the reporter left it. [Tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) that [to-tickets](https://aihero.dev/skills-to-tickets) produced are already agent-ready by construction, and running `triage` over them is wasted work at best. The rule is flat: `$triage` is only for incoming issues, not for issues you created yourself.

It also differs from labelling by hand because it recommends and then waits. It gives you its category and state call with reasoning, plus what it found in the codebase, and applies nothing until you tell it to.

## When to reach for it

Type `$triage` and then describe what you want in plain language. This Codex edition also keeps it model-visible so it is not misreported as unavailable. "Show me anything that needs my attention", "let's look at #42", "move #42 to ready-for-agent".

| What you have | Where to go |
| --- | --- |
| A tracker full of raw reports from other people | `$triage` |
| A rough idea of your own, nothing written down | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| A settled conversation to turn into a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) | [to-spec](https://aihero.dev/skills-to-spec) |
| A spec to split into agent-ready tickets | [to-tickets](https://aihero.dev/skills-to-tickets) |
| A confirmed bug that needs a root cause, not a label | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

## Prerequisites

`triage` reads and writes your issue tracker, so [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) must first configure that tracker and its label vocabulary. The role names below are **canonical**. The label strings in your tracker may differ, and setup provides the mapping. If your tracker already uses the canonical names exactly, you have nothing to map and nothing to set up.

The tracker config also decides whether external pull requests count as a request surface, and who counts as external. That flag is off by default, and setup no longer asks about it. To bring PRs into scope, turn it on in `docs/agents/issue-tracker.md`.

## The state machine

Every triaged item ends with exactly one category role and one state role. There are two categories: `bug` (something is broken) and `enhancement` (new feature or improvement). There are five states:

| State | Means |
| --- | --- |
| `needs-triage` | You need to evaluate it. An unlabelled issue normally lands here first. |
| `needs-info` | Waiting on the reporter. Returns to `needs-triage` when they reply. |
| `ready-for-agent` | Fully specified, with an agent brief attached. An [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agent can take it. |
| `ready-for-human` | 说明必须由人工完成的具体决策或无法取得的访问权限；仅最终验收待人工执行时，仍可交给代理实施并保留待验步骤。 |
| `wontfix` | Closed, with the reason recorded. |

That is the whole vocabulary. The rule of exactly one state role per item keeps the queries simple. The states are also the most-requested area of the [skill](https://www.aihero.dev/ai-coding-dictionary/skill). Users have asked for a state for work that is specified but blocked on another issue, a `deferred` state for work that waits on a future trigger, and a terminal `implemented` state. None of those has shipped. See the questions below.

`wontfix` has three cases. The difference matters because only one of them writes to the knowledge base:

| Why you're closing it | What happens |
| --- | --- |
| Already implemented | A comment that points to where the feature already lives. Nothing goes into `.out-of-scope/`, because it's a built feature, not a rejected one, and a file there would break the dedup checks. |
| Rejected bug | Polite explanation, then close. |
| Rejected enhancement | A file in `.out-of-scope/`, linked from the closing comment, then close. |

`.out-of-scope/` holds one markdown file per rejected **concept**, not per issue. Each file is a short design document, not a database row. It says what was rejected, why, and lists every issue that asked for it. `triage` reads the whole directory before it evaluates anything. It matches by concept, not keyword, so "night theme" matches `dark-mode.md`. When it finds a match, it shows you the old decision and asks if you still agree with it, instead of arguing the request again from the start.

## Verify before you brief

Before any [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling), `triage` checks that the claim actually holds. For a bug, it uses the reporter's confirmed reproduction or repeats their steps. For a PR, it inspects the diff and runs directly relevant existing checks. Then it reports which of three things happened: confirmed, with the code path; failed to reproduce; or not enough detail to try, which is itself the strongest `needs-info` signal there is.

Briefs describe observable acceptance criteria. New automation needs a specific manual testing gap or your explicit request under the shared testing policy; missing coverage alone does not become a task to write tests.

- Confirmed, with the code path.
- Failed to reproduce.
- Not enough detail to try. This is the strongest `needs-info` signal there is.

In the same pass, it runs two more checks against the codebase. The **redundancy** check asks if the feature is already implemented, and searches by domain concept, not by the reporter's wording. The **prior rejection** check asks if `.out-of-scope/` already says no. Both checks are cheap, and a hit on either produces a `wontfix`.

这项工作产出供后续执行者使用的 **agent brief**：任务进入 `ready-for-agent` 时，汇总已确认且仍有效的行为与验收要求。用户后来改变范围或限制时，原位更新说明和验证要求，后续执行按最新要求继续。说明主要引用类型、接口与行为，避免依赖容易变化的行号；已有复现证据和待验内容也应保留。

## A PR is an issue with attached code

If the tracker treats external pull requests as a request surface, they go through the same machine, with the same categories, states and transitions. The states apply to the diff. `ready-for-agent` means a brief is attached and an agent should take the next step on the code. `ready-for-human` means a person can merge it. A brief on a PR describes what is left to do to the existing diff, not how to build the thing from nothing.

Discovery shows only *external* PRs, because a collaborator's in-progress branch is not triage work. That filter applies only to discovery. If you name a PR explicitly, `triage` handles it, whoever wrote it.

## Common questions

**I ran `$to-spec` and `$to-tickets`, and now those tickets are sitting there untriaged. Do I run `$triage` over them?**
No. They are already agent-ready, because `to-tickets` applies the `ready-for-agent` label as it publishes, precisely so an AFK runner picks them up without another pass. The user who hit this had run the spec flow, seen `needs-triage` on the output, and found their AFK runner ignoring everything. `triage` is the on-ramp for work that arrives from outside; the spec flow is the lane for work you originate. They meet at `ready-for-agent`, not before.

**Is `triage` still relevant now that there's a `to-spec` → `to-tickets` → `implement` flow?**
Only if you have inbound work. `triage` is older than that flow and does a different job: it handles reports other people filed. If everything in your tracker came from your own planning, you will rarely use it. If you maintain anything public, or your team files bugs to you, it is where that work starts. The main use is open-source repos that take issues from external contributors.

**The agent tried to apply `ready-for-agent` and `gh` said the label doesn't exist.**
This is a known open bug ([#616](https://github.com/mattpocock/skills/issues/616)). `setup-matt-pocock-skills` writes the label vocabulary into `docs/agents/triage-labels.md`, but does not create the labels in your tracker. Create the five state labels and two category labels yourself, once, with `gh label create` or the tracker's UI, and the error stops. The issue links to a community fix branch that has not been merged.

**Five states aren't enough. What about blocked, or deferred, or implemented?**
This is the most-filed gap on the skill. It comes in three forms:

- An issue that is fully specified but waits on another issue to close ([#139](https://github.com/mattpocock/skills/issues/139)). The reporter said `ready-for-agent` is "technically true" there but misleading, so an agent picks it up and gets stuck.
- Future work that is intended but waits on a trigger, so it is not actionable yet ([#297](https://github.com/mattpocock/skills/issues/297)).
- A terminal state for "implemented, awaiting verification". Without it, an AFK runner can queue finished tickets again.

The blocked case is accepted as real, but the name is undecided (`blocked` versus `paused`). None of it has shipped. As a workaround, people add a repo-local extra label next to the category. The state slot then holds an accurate value, but the skill does not know about the extra label. One community fork goes further and adds `needs-slicing`, `tracking` and effort labels. That works, but it belongs to that fork, not to the skill.

**How is this different from `$diagnosing-bugs`?**
The verification step here is deliberately shallow (enough to answer "is this real, and roughly where does it live"), not to find a root cause. When a bug won't reproduce from the reporter's steps in a few minutes, the honest move is `needs-info`, or [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) if you want to chase it now. Neither skill's text currently mentions the other; a user found that seam, and it is still open.

**Can I point it at my whole backlog and let it run?**
You can ask, but watch what it reads. The "show what needs attention" pass is a cheap listing for *selection*. You pick one issue, and then `triage` gathers full [context](https://www.aihero.dev/ai-coding-dictionary/context) on that issue. If you run it across twenty issues at once, the agent can use that cheap listing as its only evidence without telling you. The listing returns issue bodies but not comments. One user hit exactly this. Three issues already had a comment that said "already fixed, recommend closing", and all three got new agent briefs instead. For a bulk pass, say explicitly that it must read the comments on each issue.

**Does it work with Linear, or anything other than GitHub Issues?**
Yes. The tracker is config, not a hard-coded assumption. People run it against Linear (through the `linear` CLI), GitLab, and plain markdown files under `.scratch/`. A common split is Linear for issues and planning, and GitHub for code and PRs. Skills that say "issue tracker" then map to Linear, and skills that say "PR" map to GitHub. The local-markdown tracker has an open template bug: the generated file can contain the acceptance criteria twice, once at the top level and once inside the agent brief ([#200](https://github.com/mattpocock/skills/issues/200)).

## It's working if

- Every item it touches ends with exactly one category role and one state role, never zero, and never two conflicting states.
- It gives you a recommendation with reasoning and stops. It does not relabel the issue and move on.
- It reproduced the bug, or checked out and ran the PR, before anything reached `ready-for-agent`.
- The briefs it writes name types and behaviours, and contain no file paths and no line numbers.
- When a request you rejected six months ago comes back, it tells you and quotes the old reason instead of triaging it again.
- Every comment it posts starts with `> *This was generated by AI during triage.*`

## Where it fits

`triage` prepares incoming work for implementation. It produces an issue labelled `ready-for-agent` with a brief that [implement](https://aihero.dev/skills-implement) can use, like a ticket from [to-tickets](https://aihero.dev/skills-to-tickets). When the request needs clarification, it uses [grilling](https://aihero.dev/skills-grilling) and [domain-modeling](https://aihero.dev/skills-domain-modeling), recording agreed terms in `GLOSSARY.md` and qualifying decisions in ADRs. A separate code review is requested independently. [ask-matt](https://aihero.dev/skills-ask-matt) helps choose the next workflow.
