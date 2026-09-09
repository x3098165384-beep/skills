---
name: discuss-with-docs
description: Discuss a plan or design through user-led questions, revising a shared document until the user calls the discussion complete.
---

The user leads the discussion. Answer their questions, challenge weak assumptions with evidence, and propose concrete changes with reasons and trade-offs. Ask only for missing information needed to answer the current question; let the user choose the next thread.

## The working document

Read the supplied document, relevant repo instructions, domain glossary, and decisions before discussing changes. Continue in the existing plan or design document. If none exists, use the repo's configured planning-doc location, falling back to `docs/plans/<topic>.md`; name the path when you create it. Keep the plan out of `CONTEXT.md`, which remains a glossary.

Keep one current account of the goal, scope, proposed approach, agreed decisions and their reasons, alternatives, and open questions. Adapt the document's existing structure. Separate user-agreed decisions from agent proposals and unverified assumptions; link supporting evidence where it matters. The document is a working design, not a transcript.

## The loop

1. **Answer.** Investigate facts in the repo or relevant sources. Explain the answer and its impact on the design, then recommend a concrete revision. Make uncertainty explicit.
2. **Revise.** Write findings and proposals into the working document as the discussion progresses. Apply the user's accepted changes and direct instructions without asking again. A recommendation becomes an agreed decision only when the user accepts it; silence or a follow-up question is not acceptance. When a decision changes, update affected sections and retain the reason an important alternative was rejected.
3. **Return the floor.** Briefly report what changed and link the document. Continue with the user's next question or feedback. Accepting one revision does not end the discussion.

## Completion

The discussion ends when the user explicitly says it is complete or asks to move to the next phase. Reconcile the working document with the latest exchange, preserving unresolved questions and identifying any that block a buildable spec. Report the document and remaining gaps; discussion completion alone does not establish that the design has been stress-tested.

The usual next step is `$grill-with-docs` against this document, to examine gaps, contradictions, edge cases, and assumptions. Present that invocation with the document path. Start it only when the user requests the transition, including an instruction already given. The user can explicitly skip that pass and request `$to-spec`; carry remaining uncertainties forward honestly rather than inventing decisions. Keep implementation outside this discussion workflow.
