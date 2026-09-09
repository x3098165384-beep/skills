## What it does

`discuss-with-docs` turns your questions and feedback into discussion notes. You lead the discussion; the agent investigates, recommends changes with reasons and trade-offs, and keeps the document current. You decide when the discussion is complete.

The document separates agreed decisions from proposals and open questions. This lets you explore an alternative without accidentally making it the plan.

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
2. **Background and Known Facts**: context, verified facts, and relevant evidence.
3. **Agreed Decisions**: decisions you accepted, with reasons.
4. **Proposals for Discussion**: recommendations, trade-offs, and unverified assumptions.
5. **Open Questions**: remaining questions, including any that block a spec.
6. **Rejected or Superseded Alternatives**: important alternatives set aside and why.

Empty sections say `None yet`. The notes reflect the current discussion state: accepted proposals move into decisions and resolved questions leave the open list. They are not a transcript or a finished spec.

## Common questions

**Why is the agent recording every message?**

It should record changes to goals, constraints, decisions, consequential facts, concrete proposals, and unresolved questions that affect progress. Ordinary explanations, repeated confirmations, investigation steps, and tool output stay in the conversation. Several exchanges clarifying one point can become a single conclusion; if nothing material changed, the agent simply answers without editing the notes. You can also explicitly ask it to record a particular point.

**Isn't this wayfinder?**

Wayfinder organises a large effort into a map of dependent decision tickets. This skill supplies a user-led discussion loop around one working document. It does not create or manage that map.

**Should I run grill-with-docs afterwards?**

That is the usual next step. Discussion develops the proposal; grilling examines its gaps, contradictions, edge cases, and assumptions. Supply the notes as read-only reference. Grilling retains its own glossary and ADR responsibilities; its new conclusions feed into `to-spec` through the conversation without rewriting the discussion notes. You can explicitly skip this pass when you want to proceed directly to a spec. In a later discussion, the resulting spec can serve as reference for updating the notes.

**Does accepting an edit end the discussion?**

No. Accepting an edit settles that edit. The discussion ends when you say it is complete or ask to move on. Any remaining gaps stay visible, and the next phase starts only on your instruction.

**When should the agent stop replying?**

Each turn ends once your current question is answered and any material change is recorded. The agent returns the floor without expanding the agenda or adding a question just to keep the conversation going. Ending a turn leaves the discussion open for your next question; only you end the overall discussion.

## It's working if

- Your questions set the direction, and recommendations explain their reasons when a revision is warranted.
- The notes change when the discussion changes the plan or its decision basis, with proposals visibly distinct from agreed decisions.
- Ordinary clarification can pass without a file edit, and repeated exchanges become one concise conclusion.
- After answering your question, the agent stops and lets you choose the next topic.
- A later grilling pass uses the notes as reference, leaving their updates to a subsequent discussion.
- The closing message identifies the document and any unresolved questions.

## Where it fits

This is an optional entry into the main chain: `discuss-with-docs → grill-with-docs → to-spec → to-tickets → implement`. Each transition follows your instruction. [Grill-with-docs](https://aihero.dev/skills-grill-with-docs) tests the working design; [to-spec](https://aihero.dev/skills-to-spec) synthesises the agreed result. [Ask-matt](https://aihero.dev/skills-ask-matt) routes you through the wider set.
