## What it does

`discuss-with-docs` turns your questions and feedback into a working design document. You lead the discussion; the agent investigates, recommends changes with reasons and trade-offs, and keeps the document current. You decide when the discussion is complete.

The document separates agreed decisions from proposals and open questions. This lets you explore an alternative without accidentally making it the plan.

## When to reach for it

Type `$discuss-with-docs` to invoke it directly. This Codex edition also keeps it model-visible so it is not misreported as unavailable.

| What you need | Reach for |
| --- | --- |
| Ask questions and revise a design at your own pace | `discuss-with-docs` |
| Have the agent interview you and test the design's assumptions | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| Organise decisions across an effort too large for one session | [wayfinder](https://aihero.dev/skills-wayfinder) |

## Prerequisites

Use a writable working directory. Supply an existing plan or design document if you have one. Otherwise the skill creates a document in the repo's configured planning-doc location, falling back to `docs/plans/<topic>.md`. Discussion itself needs no issue tracker.

## Common questions

**Isn't this wayfinder?**

Wayfinder organises a large effort into a map of dependent decision tickets. This skill supplies a user-led discussion loop around one working document. It does not create or manage that map.

**Should I run grill-with-docs afterwards?**

That is the usual next step. Discussion develops the proposal; grilling examines its gaps, contradictions, edge cases, and assumptions. Supply the working document so grilling starts from the agreed decisions and writes new answers back into it. You can explicitly skip this pass when you want to proceed directly to a spec.

**Does accepting an edit end the discussion?**

No. Accepting an edit settles that edit. The discussion ends when you say it is complete or ask to move on. Any remaining gaps stay visible, and the next phase starts only on your instruction.

## It's working if

- Your questions set the direction, and answers include specific revisions and their reasons.
- The working document changes during the discussion, with proposals visibly distinct from agreed decisions.
- A later grilling pass updates that same document without repeating settled questions unless evidence warrants it.
- The closing message identifies the document and any unresolved questions.

## Where it fits

This is an optional entry into the main chain: `discuss-with-docs → grill-with-docs → to-spec → to-tickets → implement`. Each transition follows your instruction. [Grill-with-docs](https://aihero.dev/skills-grill-with-docs) tests the working design; [to-spec](https://aihero.dev/skills-to-spec) synthesises the agreed result. [Ask-matt](https://aihero.dev/skills-ask-matt) routes you through the wider set.
