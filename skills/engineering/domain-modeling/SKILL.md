---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when discussing codebase terminology, maintaining its domain glossary, or recording or editing an ADR.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. Challenge unclear terms, discuss concrete scenarios, and record terms and decisions when they are agreed. Reading an existing glossary for vocabulary does not start this workflow.

## Domain document locations

Use the glossary, glossary map, and ADR locations configured in the project's instructions and `docs/agents/domain.md`. Preserve those locations, including a glossary named `CONTEXT.md`. References to the glossary in these skills mean the configured file.

When the project has no configured locations, use root `GLOSSARY.md` and `docs/adr/`, or follow root `GLOSSARY-MAP.md` if present. Create a missing glossary only when a term is agreed, and an ADR directory only when a decision needs recording. Skill updates do not require renaming or duplicating existing configured documents.

## File structure

The default layout for a repo with a single context is:

```
/
├── GLOSSARY.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

For multiple contexts, the configured map points to where each one lives. With the default names:

```
/
├── GLOSSARY-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── GLOSSARY.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── GLOSSARY.md
│       └── docs/adr/
```


## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the configured glossary, explain the existing definition and the apparent difference before asking which meaning is intended.

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account': do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible. Which is right?"

### Update the glossary inline

When a term is resolved, update the configured glossary right there. Capture terms as they are agreed. Use the format in [GLOSSARY-FORMAT.md](./GLOSSARY-FORMAT.md).

Keep the glossary focused on project terms and their relationships. Put specifications, discussion notes, and implementation decisions in their respective project documents.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse**: the cost of changing your mind later is meaningful
2. **Surprising without context**: a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off**: there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).
