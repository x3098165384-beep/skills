---
name: discuss-with-docs
description: Discuss a plan or design through user-led questions, revising a shared document until the user calls the discussion complete.
---

The user leads the discussion. Answer their questions, challenge weak assumptions with evidence, and propose concrete changes with reasons and trade-offs. Ask only for missing information needed to answer the current question; let the user choose the next thread.

Start this workflow only when the user explicitly invokes it or asks to use it. A question about the skill or a request to edit it is not an invocation.

## The working document

Read the supplied document, relevant repo instructions, domain glossary, and decisions before discussing changes. The artifact is **discussion notes**, named `discussion-notes.md`. For a new discussion, use `<planning-doc-root>/<topic>/discussion-notes.md`, where the root is the repo's configured planning-doc location or `docs/plans` by default. Use a short kebab-case topic and reuse its existing notes when resuming. An explicitly supplied document or project naming convention takes precedence; preserve existing content when bringing it into the structure below. Keep discussion notes out of `CONTEXT.md`, which remains a glossary.

Create the notes once the discussion's goal and necessary background are clear enough to record; name the path. On resumption, update existing notes only when the recording criteria below are met. Keep the six sections below in order, using `None yet` for empty sections. Write in the user's language, translating the headings as needed.

```markdown
# <Topic>: Discussion Notes

## Goal and Scope
What this discussion should resolve, including its boundaries.

## Background and Known Facts
Relevant context and verified facts, with supporting references where needed.

## Agreed Decisions
User-accepted decisions and their reasons.

## Proposals for Discussion
Unaccepted recommendations, alternatives, trade-offs, and unverified assumptions.

## Open Questions
Unresolved questions, identifying any that block a buildable spec.

## Rejected or Superseded Alternatives
Important alternatives set aside or replaced, and why.
```

Replace the template guidance with actual content. Maintain the current state of the discussion rather than appending a transcript: move accepted proposals into agreed decisions, remove resolved questions, and preserve the reasons for important changes in the final section. A proposal or assumption stays visibly provisional until accepted or verified, respectively.

## What earns a note

Record information that changes the plan or informs a later decision: goals, scope or constraints; accepted, rejected or replaced decisions and their reasons; facts that change the assessment of an approach; concrete proposals worth comparing and their trade-offs; and unresolved questions or assumptions that affect further progress. Honour explicit requests to record something.

Keep ordinary explanations, repeated confirmations, progress reports, investigation steps, raw tool output, casual examples, and undeveloped guesses in the conversation. A general question answered within the exchange needs no open-question entry. Include necessary evidence by reference, with its implication for the decision.

Update only for a material change to that recorded state. Several clarification exchanges about the same point can become one concise conclusion once it is clear; record explicit decisions promptly. When nothing material changes, answer without editing the notes or announcing a no-op. The six sections classify information; they are not a quota to fill each turn.

## The loop

1. **Answer.** Investigate facts in the repo or relevant sources. Explain the answer and any impact on the design; recommend a revision when warranted. Make uncertainty explicit.
2. **Assess and revise.** Apply the recording criteria above. When an update is warranted, apply the user's accepted changes and direct instructions without asking again. A recommendation becomes an agreed decision only when the user accepts it; silence or a follow-up question is not acceptance. When a decision changes, update affected sections and retain the reason an important alternative was rejected.
3. **Return the floor.** If the notes changed, briefly report the substantive change and link the document. Otherwise let the answer stand. Continue with the user's next question or feedback. Accepting one revision does not end the discussion.

## Completion

The discussion ends when the user explicitly says it is complete or asks to move to the next phase. Reconcile the working document with the latest exchange, preserving unresolved questions and identifying any that block a buildable spec. Report the document and remaining gaps; discussion completion alone does not establish that the design has been stress-tested.

The usual next step is `$grill-with-docs` against this document, to examine gaps, contradictions, edge cases, and assumptions. Present that invocation with the document path. Start it only when the user requests the transition, including an instruction already given. The user can explicitly skip that pass and request `$to-spec`; carry remaining uncertainties forward honestly rather than inventing decisions. Keep implementation outside this discussion workflow.
