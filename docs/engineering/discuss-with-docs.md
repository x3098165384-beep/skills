## What it does

`discuss-with-docs` turns your questions and feedback into discussion notes. You lead the discussion; the agent investigates, recommends changes with reasons and trade-offs, and keeps the document current. You decide when the discussion is complete.

The document separates agreed decisions from proposals and open questions, keeping their reasons and supporting references. When you end the discussion, the agent reconciles the notes and uses [domain-modeling](https://aihero.dev/skills-domain-modeling) to record confirmed terms and qualifying decisions. This lets you explore an alternative without accidentally making it the plan.

## When to reach for it

Type `$discuss-with-docs` to invoke it directly. This skill is manual-only, with `allow_implicit_invocation: false`; ordinary planning questions do not start it automatically.

| What you need | Reach for |
| --- | --- |
| Ask questions and revise a design at your own pace | `discuss-with-docs` |
| Have the agent interview you and test the design's assumptions | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| Organise decisions across an effort too large for one session | [wayfinder](https://aihero.dev/skills-wayfinder) |

## Prerequisites

Use a writable working directory. New notes live at `docs/plans/<topic>/discussion-notes.md`, for example `docs/plans/notifications/discussion-notes.md`. A configured planning-doc root replaces `docs/plans`. An explicitly supplied document or project naming convention takes precedence. Discussion itself needs no issue tracker.

## The discussion notes

The notes are created once the discussion's goal and necessary background are clear enough to record. Later updates happen when information materially changes the plan or informs a later decision, rather than on every reply.

The document has six sections, in this order, with headings in your language:

1. **Goal and Scope**: what the discussion should resolve and its boundaries.
2. **Background and Known Facts**: context, verified investigation conclusions, and references to relevant source files, methods, document sections, or resources, including what remains uncertain.
3. **Agreed Decisions**: decisions you accepted, with reasons.
4. **Proposals for Discussion**: recommendations, trade-offs, and unverified assumptions.
5. **Open Questions**: remaining questions, including any that block a spec.
6. **Rejected or Superseded Alternatives**: important alternatives set aside and why.

Empty sections say `None yet`. During discussion, focused updates preserve meaningful outcomes without reorganizing the whole document on every reply. Repeated emphasis can sharpen an existing constraint even when the overall direction has not changed. Resuming the discussion starts from the relevant earlier conclusions and their references.

## Closing the discussion

When you say the discussion can end, the agent brings the notes into a coherent current state. Accepted proposals become decisions, resolved questions leave the open list, and older alternatives retain their rejection or replacement reasons. Later accepted changes replace earlier agreements within their scope; later suggestions remain proposals. If the intended resolution of a contradiction is unclear, the agent asks you rather than choosing silently.

The reconciled conclusions then feed a single domain-modeling pass. Established project terms belong in your glossary, such as `CONTEXT.md` or `GLOSSARY.md`; qualifying accepted decisions belong in ADRs. Proposals and unresolved choices stay in the discussion notes. Long notes can open with a short current summary and point to the detailed evidence, so the next session can find the effective conclusions.

## Common questions

**Why is the agent recording every message?**

It should record meaningful outcomes and clarifications, together with the reasons and limits that affect later choices. Routine explanations, investigation steps, and raw tool output can stay in the conversation. Several exchanges clarifying one point can refine a single conclusion; if the existing record already captures the point, another edit is unnecessary. You can also explicitly ask it to record something.

**The next session remembers the conclusion but loses the investigation behind it.**

Notes should retain the investigation result, the relevant file and method or document section, and what that evidence means for the choice. "Reuse the existing control switch" is incomplete if the next reader cannot locate the switch or tell which of its effects fit the proposed behavior. References accompany the conclusions they support, including what was not established.

**When do terms and decisions enter the glossary or ADRs?**

At closeout, after the notes have been reconciled. Domain-modeling applies its criteria to confirmed terms and accepted decisions in the project's existing locations. Casual proposals remain in the notes; finishing discussion does not turn every proposal into a decision.

**Isn't this wayfinder?**

Wayfinder organises a large effort into a map of dependent decision tickets. This skill supplies a user-led discussion loop around one working document. It does not create or manage that map.

**Should I run grill-with-docs afterwards?**

At closeout, the agent recommends one next step and explains why:

| What remains | Next step |
| --- | --- |
| Consequential design questions need your judgment | [grill-with-docs](https://aihero.dev/skills-grill-with-docs), entered directly with the notes as read-only reference |
| The settled design needs a consolidated specification | [to-spec](https://aihero.dev/skills-to-spec) |
| Clear work benefits from verifiable tasks with dependencies | [to-tickets](https://aihero.dev/skills-to-tickets) |
| Clear scope and acceptance criteria fit one implementation session | [implement](https://aihero.dev/skills-implement) |

Your explicitly chosen route takes precedence. Routes other than grilling begin when you have already authorized them; otherwise they remain recommendations. Grilling builds on accepted decisions and retains its own glossary and ADR responsibilities. Discoverable facts and routine implementation choices are handled through investigation and judgment.

**Does accepting an edit end the discussion?**

No. Accepting an edit settles that edit. Saying the discussion can end starts reconciliation, domain recording, and the next-step assessment. If consequential design questions remain, the agent explains the gap and begins grilling unless you have chosen another route.

**When should the agent stop replying?**

Each turn ends once your current question is answered and any material change is recorded. The agent returns the floor without expanding the agenda or adding a question just to keep the conversation going. Ending a turn leaves the discussion open for your next question; only you end the overall discussion.

## It's working if

- Your questions set the direction, and recommendations explain their reasons when a revision is warranted.
- The notes retain meaningful outcomes, reasons, applicable limits, and references that explain the decision basis, with proposals visibly distinct from agreed decisions.
- Ordinary clarification can pass without a file edit, and repeated exchanges become one concise conclusion.
- After answering your question, the agent stops and lets you choose the next topic.
- A later grilling pass uses the notes as reference, leaving their updates to a subsequent discussion.
- At closeout, earlier suggestions no longer appear as unresolved after you accepted or rejected them, and replaced decisions point to the current conclusion.
- Confirmed terms and qualifying decisions appear in the project's domain records, linked from the notes.
- At closeout, the agent links the organized notes and updated domain records, explains its recommended next step, and begins grilling when your judgment is still needed.

## Where it fits

This is an optional entry into the main build flow. Closeout selects the next useful step using the routes above. [Grill-with-docs](https://aihero.dev/skills-grill-with-docs) tests unresolved design choices; [to-spec](https://aihero.dev/skills-to-spec) consolidates the agreed result. [Ask-matt](https://aihero.dev/skills-ask-matt) routes you through the wider set.
