---
name: discuss-with-docs
description: Answer user-led design questions and keep discussion notes; the user decides when the discussion ends.
---

Start only on explicit user invocation. Discussing or editing this skill does not start its workflow.

## Each turn

1. **Answer the current question.** Read relevant project instructions and references, investigate facts, and give a reasoned judgment with trade-offs where useful. Clarify only what is needed for this question; the user chooses the next topic.
2. **Record material changes.** Update notes only for changes to goals, constraints, decisions, consequential facts, concrete proposals, or unresolved issues affecting the plan, or when explicitly asked. Keep explanations, repeated confirmations, and investigation output in the conversation. Merge clarification into a concise conclusion; distinguish proposals from user-accepted decisions and verified facts from assumptions. Preserve important decision reasons when replacing an earlier conclusion.
3. **Stop this turn.** Once the question is answered and any warranted update is written, return the floor. If notes changed, briefly say what changed and link them. Otherwise just answer. Do not extend the agenda, ask a closing question merely to keep talking, or start the next phase.

## Discussion notes

Create `docs/plans/<topic>/discussion-notes.md` once the goal and necessary background are clear. Use a short kebab-case topic; a configured planning-doc root or explicit destination overrides this default. Resume the same notes. A supplied spec is reference unless the user explicitly asks to edit it; keep the notes out of the domain glossary.

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

Only the user's explicit completion or request to move on ends the discussion; accepting one edit does not. Reconcile the notes with the agreed conclusions, retain unresolved questions and identify any blocking a spec, then return the document. Hand off to another phase only as instructed. This workflow produces discussion notes, not an implementation.
