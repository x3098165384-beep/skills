## What it does

`code-review` reviews changes from a pinned baseline to either the current working tree or committed work along two axes. **Standards** asks whether the code follows how this repo writes code. **Spec** asks whether the code does what the originating issue or [spec](https://www.aihero.dev/ai-coding-dictionary/spec) asked for. Each axis runs in its own [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) so neither sees the other's reasoning.

The two axes are never merged and never re-ranked. The report ends with a worst issue *per axis* and refuses to name a single winner across them, because a change can pass one axis and fail the other: code that follows every convention while implementing the wrong thing passes Standards and fails Spec; code that does exactly what the [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) asked while breaking the repo's conventions does the reverse. A blended verdict lets the passing axis hide the failing one.

## When to reach for it

Type `$code-review`, or the agent reaches for it automatically when you ask to review a branch, a PR, work in progress, or anything "since X".

| Your situation | Reach for |
| --- | --- |
| A diff exists and you want to know if it is built right *and* is the right thing | `code-review` |
| You want bugs hunted in the diff: null paths, races, off-by-one | Claude Code's own built-in review, not this one (see the name clash below) |
| Nothing is written yet and you want it written test-first | [tdd](https://aihero.dev/skills-tdd) |
| A whole spec needs building, review included | [implement](https://aihero.dev/skills-implement), which calls this skill itself |
| The whole codebase has drifted, not one diff | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) |
| Something is broken and you do not know why | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

You or the calling workflow supplies the baseline and scope. Implementation uses its exact starting commit; branch and PR review use the merge-base of the named reference. The skill asks only when that scope is unclear. Both reviewers receive the same captured changes, including in-scope new files for a working-tree review.

## Prerequisites

The Standards axis needs nothing. It reads whatever the repo documents (`CODING_STANDARDS.md`, `CONTRIBUTING.md`, and the like) and falls back on a built-in baseline when the repo documents nothing.

The Spec axis needs a spec to exist and be findable. It looks in this order:

1. The spec, ticket, or agreed requirements you or the calling workflow supplies, including conversation context.
2. Issue references in commit messages, fetched through the configured tracker.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch or feature name.
4. Asking you.

Fetching tracker issues needs the configuration from [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills). A supplied document or conversation needs no tracker. With no spec at all, the Spec sub-agent is skipped and the report says "no spec available" rather than inventing requirements.

## The two axes

| | Standards | Spec |
| --- | --- | --- |
| Question | Is it built right? | Is it the right thing? |
| Reads | The repo's documented standards, plus the smell baseline | The originating issue or spec |
| Reports | Documented breaches (can be hard), and smells (always judgement calls) | Missing or partial requirements, scope creep, requirements implemented wrongly |
| Every finding cites | The standards file and the rule, or the named smell plus the hunk | The line of the spec |

A generic review skill that does not know your standards is the thing this design is trying to avoid: it flags what is deliberate in your codebase and misses the invariants your codebase actually depends on. So the repo's own documentation is the [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source) on the Standards axis, and **the repo always overrides**.

The **smell baseline** is the floor underneath it, twelve Fowler code smells from _Refactoring_ ch.3: Mysterious Name, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Shotgun Surgery, Divergent Change, Speculative Generality, Message Chains, Middle Man, Refused Bequest. Each is a labelled heuristic ("possible Feature Envy"), never a hard violation, and each is stated as *what it is* → *how to fix*, so a finding arrives with a move attached rather than a complaint. Anything your linter already enforces is skipped by both axes.

## Common questions

**Will it reject a change just because no new tests were added?**

No. Both reviewers use the shared testing policy. A verification concern must identify a concrete possible failure and explain why existing checks and manual steps are insufficient. Tests you explicitly requested remain requirements, and unauthorized test additions can be reported as scope violations.

**It collides with Claude Code's own `/code-review`. What do I do?**

This is the most reported problem with the skill, and it is not fixed. Claude Code ships its own `/code-review`, which does something different: it hunts bugs in the diff, where this one checks spec compliance and repo standards. Installing this library means one of them wins, and which one wins depends on how you installed. Via the plugin marketplace, everything is aliased under a `mattpocock-skills:` prefix and the built-in becomes hard to reach at the unqualified name; via a plain skills install, the local file wins and this skill shadows the built-in. One clean answer is to remove Claude Code's built-in skills entirely: a large [context](https://www.aihero.dev/ai-coding-dictionary/context) saving, and the collision stops mattering. The shadowing itself is arguably a Claude Code [harness](https://www.aihero.dev/ai-coding-dictionary/harness) bug (a skill author should be free to name a skill anything), so the other answer is to rename the local copy. Editing the frontmatter or renaming the directory gets undone by `npx skills update`; the durable workaround reported by users is to fork the skill to a new name and drop `code-review` from the managed set, keeping a note of the commit you forked from so you can re-sync by hand.

**Its sub-agents keep invoking `$code-review` again and spawn more agents.**

Known open bug, reproduced by several people and in more than one harness. The Standards and Spec prompts do not forbid delegation, so a sub-agent can rediscover the skill and fan out again: one report reached 50-plus agents. The fix people have applied on forks is one line appended to both sub-agent briefs: "Do not invoke `$code-review` or spawn additional agents: perform this review directly." Some prefer to handle it at the harness level so every skill inherits the guard. Neither is in the shipped skill yet. If you run this unattended, watch the agent count.

**Should I run it in the same [session](https://www.aihero.dev/ai-coding-dictionary/session) that wrote the code?**

Prefer a fresh one. As one reader put it: "Same context reviewing itself isn't review, it's confirmation bias with a slash command." The reviewing agent in the authoring session holds every assumption that shaped the code, which is exactly the context an independent reviewer would not have. This is also why people ask for [implement](https://aihero.dev/skills-implement) without its built-in review step: it runs the review inside the session that just wrote the diff. Invoking `$code-review` yourself from a clean session is the honest version.

**After every ticket, or once at the end?**

Both work, and the skill does not decide for you. Per-ticket keeps each diff small enough that the Spec axis has one clear spec to check against, which is the mode `implement` uses. Batching to the end of a branch catches interactions between tickets that the per-ticket passes each miss. If you are unsure, review per ticket and run one final pass against the branch point.

**Can I trust the findings?**

Not without checking. Sub-agent output is a hypothesis, not evidence: one team reported a dozen breaking changes that prose-based reviews had waved through. The skill aggregates the two reports verbatim or lightly cleaned rather than re-verifying each claim against the files, so a finding can cite the wrong location or overstate an impact. Read the citation on each finding before acting on it. That every finding is required to carry one (a standards rule, a smell plus its hunk, or a spec line) is what makes this checkable at all.

**Why does it find new problems every single time I run it?**

Because fixes create new surface, and because the judgement-call half of the Standards axis is not deterministic between runs. One reader described the loop plainly: "/code-review and /improve-code-architecture always find new stuff every time. I implement fixes, rerun these skills, and again and again." There is no convergence guarantee. Treat a pass as a list of leads, act on the ones with a cited rule behind them, and stop: do not run it in a loop until it comes back clean, because it will not.

**Does it review my uncommitted work?**

Yes, in current-work mode used by `implement` and work-in-progress reviews. It compares tracked files against the baseline and reads in-scope untracked files separately, without staging or committing them. Pre-existing unrelated work is excluded using the implementation's starting-state record. Branch and PR reviews use committed-work mode unless you request local changes too.

## It's working if

- It catches a bad baseline before spawning reviewers and checks new files before declaring there is no work to review.
- The report arrives as two separate blocks under `## Standards` and `## Spec`, not one merged list.
- Every Standards finding names either a rule in one of your repo's files or one of the twelve smells, with the hunk quoted; every Spec finding quotes a line of the spec.
- The closing summary gives a worst issue per axis and declines to pick an overall winner.
- With no spec available, the Spec block says so instead of listing requirements it inferred from the code.
- A concern about verification names the failure that could be missed; missing new tests alone is not a finding.

## Where it fits

`code-review` is the review step at the tail of the build chain: `grill-with-docs → to-spec → to-tickets → implement → code-review`. It also stands alone on any branch or PR you point it at.

- [implement](https://aihero.dev/skills-implement) is the closest neighbour: it drives the build and calls this skill as its own closing review before committing.
- [to-spec](https://aihero.dev/skills-to-spec) and [to-tickets](https://aihero.dev/skills-to-tickets) produce the document the Spec axis checks against; a vague spec makes that axis vague.
- [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) is the whole-codebase counterpart: this skill only ever looks at one diff.

[ask-matt](https://aihero.dev/skills-ask-matt) routes across the whole set when you are unsure which skill the situation wants.
