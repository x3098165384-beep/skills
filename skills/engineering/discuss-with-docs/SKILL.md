---
name: discuss-with-docs
description: Discuss a plan or design through user-led questions, revising a shared document until the user calls the discussion complete.
---

The user leads the discussion. Answer their questions, challenge weak assumptions with evidence, and propose concrete changes with reasons and trade-offs. Ask only for missing information needed to answer the current question; let the user choose the next thread.

## The working document

Read the supplied document, relevant repo instructions, domain glossary, and decisions before discussing changes. The artifact is **discussion notes**, named `discussion-notes.md`. For a new discussion, use `<planning-doc-root>/<topic>/discussion-notes.md`, where the root is the repo's configured planning-doc location or `docs/plans` by default. Use a short kebab-case topic and reuse its existing notes when resuming. An explicitly supplied document or project naming convention takes precedence; preserve existing content when bringing it into the structure below. Keep discussion notes out of `CONTEXT.md`, which remains a glossary.

Create or update the notes in the first substantive response, once the topic and initial question are understood. Populate what is already known and name the path; do not wait for consensus or discussion completion. Keep the six sections below in order, using `None yet` for empty sections. Write in the user's language, translating the headings as needed.

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

## The loop

1. **Answer.** Investigate facts in the repo or relevant sources. Explain the answer and its impact on the design, then recommend a concrete revision. Make uncertainty explicit.
2. **Revise.** Write findings and proposals into the working document as the discussion progresses. Apply the user's accepted changes and direct instructions without asking again. A recommendation becomes an agreed decision only when the user accepts it; silence or a follow-up question is not acceptance. When a decision changes, update affected sections and retain the reason an important alternative was rejected.
3. **Return the floor.** Briefly report what changed and link the document. Continue with the user's next question or feedback. Accepting one revision does not end the discussion.

## Completion

The discussion ends when the user explicitly says it is complete or asks to move to the next phase. Reconcile the working document with the latest exchange, preserving unresolved questions and identifying any that block a buildable spec. Report the document and remaining gaps; discussion completion alone does not establish that the design has been stress-tested.

The usual next step is `$grill-with-docs` against this document, to examine gaps, contradictions, edge cases, and assumptions. Present that invocation with the document path. Start it only when the user requests the transition, including an instruction already given. The user can explicitly skip that pass and request `$to-spec`; carry remaining uncertainties forward honestly rather than inventing decisions. Keep implementation outside this discussion workflow.
