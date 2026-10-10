---
name: discuss-with-docs
description: Answer user-led design questions and keep discussion notes; the user decides when the discussion ends.
---

Start only on explicit user invocation. Discussing or editing this skill does not start its workflow.

## Each turn

1. **Answer the current question.** Read relevant project instructions and references, investigate facts, and give a reasoned judgment with trade-offs where useful. Clarify only what is needed for this question; the user chooses the next topic.
2. **Record material outcomes.** Capture goals, constraints, decisions, consequential facts, concrete proposals, and unresolved issues affecting the plan, including their reasons and applicable limits. Honor explicit requests to record a point. When the user repeats or corrects a point, check whether the existing record captures the clarification and refine it where needed. Distinguish proposals from user-accepted decisions and verified facts from assumptions. A follow-up question or silence leaves a proposal unaccepted.
3. **Stop this turn.** Once the question is answered and any warranted update is written, return the floor. If notes changed, briefly say what changed and link them. Otherwise just answer. Let the user lead the discussion. When they explicitly finish or ask to move on, follow Discussion completion.

## Discussion notes

Create `docs/plans/<topic>/discussion-notes.md` once the goal and necessary background are clear. Use a short kebab-case topic; a configured planning-doc root or explicit destination overrides this default. Resume the same notes, reading the relevant earlier conclusions and linked references before continuing. A supplied spec is reference unless the user explicitly asks to edit it.

Keep investigation conclusions and reference material that affect the design beside the conclusions they support. Point to relevant source files and methods, document sections, resources, or external references; explain what was established, its implication, and any remaining uncertainty. Prefer project-relative paths and stable names for local references. Routine explanations, investigation steps, and raw tool output can stay in the conversation.

Favor focused updates during discussion, preserving enough context to interpret changes later. Whole-document reconciliation belongs at discussion completion. The notes carry the discussion; the domain glossary carries established project terms.

Use these six sections in order, in the user's language. Empty sections say `None yet`; they are not a quota to fill each turn.

```markdown
# <Topic>: Discussion Notes

## Goal and Scope

## Background and Known Facts

## Agreed Decisions

## Proposals for Discussion

## Open Questions

## Rejected or Superseded Alternatives
```

## Discussion completion

Only the user's explicit completion or request to move on ends the discussion; accepting one edit does not. Treat statements such as "I think we can finish the discussion" as the cue to close out:

1. **Reconcile the notes.** Review the available discussion and notes together. Merge repeated points, collect the current agreed conclusions, move accepted proposals into decisions, and remove resolved questions from the open list. Preserve important rejected or superseded alternatives and why they changed. Use later accepted changes and their scope to resolve older statements; a later suggestion alone does not override an agreement. Ask about contradictions whose intended resolution is unclear, and carry genuinely unresolved questions forward, identifying any that block a spec. For long notes, a short current summary and links to detailed evidence help the next reader.
2. **Record the domain model.** Use [$domain-modeling](../domain-modeling/SKILL.md) with the reconciled conclusions to maintain confirmed project terms and qualifying accepted decisions in the project's glossary and ADR locations. Keep proposals and unresolved choices in the notes. Link to the resulting domain records; this is the closeout pass, rather than a routine on every reply.
3. **Recommend the next step.** Link the reconciled notes and updated domain records. Follow the user's chosen next step when specified; otherwise recommend one route and briefly explain why:

   - **[$grill-with-docs](../grill-with-docs/SKILL.md)**: consequential design questions still need the user's judgment.
   - **[$to-spec](../to-spec/SKILL.md)**: the design is settled and needs a consolidated specification.
   - **[$to-tickets](../to-tickets/SKILL.md)**: the notes or spec are clear enough to split the work into verifiable tasks with dependencies.
   - **[$implement](../implement/SKILL.md)**: scope and acceptance criteria are clear, and implementation fits one session.

   When grilling is needed, explain the gap and enter `$grill-with-docs` directly. Use the notes as read-only reference, build on accepted decisions, and begin with the most consequential open question. Resolve discoverable facts and routine implementation choices through investigation and judgment.

   For other routes, give the recommendation and proceed when already authorized by the user.
