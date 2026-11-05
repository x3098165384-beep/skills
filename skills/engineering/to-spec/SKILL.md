---
name: to-spec
description: "Turn the current conversation into a spec and publish it to the project issue tracker: no interview, just synthesis of what you've already discussed."
---

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know.

只把已确认的需求、范围与决定写成实施要求。保留用户当前的限制、已撤回决定和仍未解决的问题；未确认的风险或建议不能变成新增功能或防御机制的要求。

The issue tracker and triage label vocabulary should have been provided to you. If not, tell the user to run `$setup-matt-pocock-skills`.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Use [Testing and verification](../tdd/TESTING-POLICY.md) to record how the agreed behavior will be checked. Preserve known verification decisions without reopening the conversation to choose tests.

3. Write the spec using the template below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label - no need for additional triage.

4. **Recommend the next step.** Return the published spec's link and recommend one route with a brief reason:

   - **[$to-tickets](../to-tickets/SKILL.md)**: the work benefits from independently verifiable tasks, explicit dependencies, or multiple implementation sessions.
   - **[$implement](../implement/SKILL.md)**: the work can be implemented and verified as one bounded task in a single session.

   Base the recommendation on the completed spec and existing context. Follow the user's chosen route and proceed when already authorized.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

用编号列出已确认的用户需求，每项说明具体使用者、动作和预期结果。Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

覆盖已确认范围内的必要行为，按实际需求决定列表长度。

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Verification

A list of verification decisions that were made. Include:

- 已有讨论或调查指出的主要失败条件，以及相应的触发方式、预期结果和已有证据；尚待核实的内容明确保留为待验证事项，不补写成新需求
- Manual actions and expected results
- Existing checks that cover the behavior
- Needed automation, with the specific manual testing gap or user request and the behavior it covers
- 用户明确要求的独立审查及其范围；没有此要求时，不额外加入审查步骤

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
