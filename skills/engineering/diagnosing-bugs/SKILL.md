---
name: diagnosing-bugs
description: Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow.
---

# Diagnosing Bugs

A discipline for hard bugs. Skip phases only when explicitly justified.

Use [Testing and verification](../tdd/TESTING-POLICY.md) to choose a reproduction method. Start with existing commands, existing tests, or confirmed manual steps. Follow project permissions for running the application and adding instrumentation.

When exploring the codebase, read `CONTEXT.md` (if it exists) to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## Redact

This skill has you show commands, outputs and captured artifacts. **Redact every secret first**: write `<REDACTED>` in its place. Build loops against env vars, so the credential stays in the environment rather than in what you show. Captured artifacts carry auth headers: quote only the lines that carry the signal.

If the redacted output is not enough to diagnose the bug, say so and ask the user.

## Phase 1: Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a **tight** pass/fail signal for the bug (one that goes red on _this_ bug), you will find the cause; bisection, hypothesis-testing, and instrumentation all just consume it. If you don't have one, no amount of staring at code will save you.

Reuse a reproduction the user has already confirmed. Spend additional effort only when the existing evidence cannot distinguish the reported failure from correct behavior.

### Choose an available reproduction method

1. **Existing test or command.** Use the real input with an existing test, CLI, HTTP endpoint, or replay tool and inspect the specific wrong result.
2. **Manual steps.** Record the user's actions, input, observed failure, and expected result. A confirmed manual reproduction is sufficient; no wrapper script is required.
3. **Targeted automation.** When the failure is difficult to test reliably by hand or impossible to test manually, explain the gap and build the smallest useful reproduction under the testing policy.

Build the right feedback loop, and the bug is 90% fixed.

### Tighten the loop

Treat the loop as a product. Once you have _a_ loop, **tighten** it:

- Can I make it faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem, freeze network.)

A 30-second flaky loop is barely better than no loop; a 2-second deterministic one is tight, a debugging superpower.

### Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger 100×, parallelise, add stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; 1% is not, so keep raising the rate until it's debuggable.

### When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for: (a) access to whatever environment reproduces it, (b) a redacted captured artifact (HAR file, log dump, core dump, screen recording with timestamps), or (c) permission to add temporary production instrumentation. Do **not** proceed to hypothesise without a loop.

### Completion criterion: a confirmed reproduction

Phase 1 is done when an existing command, targeted automated reproduction, or manual sequence has reproduced the reported failure. Show the redacted command output or record the manual steps and the user's observed result. The reproduction must:

- [ ] Exercise the actual bug and distinguish the user's symptom from the expected result.
- [ ] Be repeatable, or record the observed frequency and conditions of an intermittent failure.
- [ ] Identify who performed it and who can repeat it after the fix. User confirmation is evidence of manual reproduction, not an automated test result.

Reading the relevant code can help clarify the reproduction. Base the diagnosis on the confirmed symptom; do not create a test harness merely to pass this phase.

## Phase 2: Reproduce + minimise

Run the loop. Watch it go red as the bug appears.

Confirm:

- [ ] The loop produces the failure mode the **user** described, not a different failure that happens to be nearby. Wrong bug = wrong fix.
- [ ] The failure is reproducible across multiple runs (or, for non-deterministic bugs, reproducible at a high enough rate to debug against).
- [ ] You have captured the exact symptom (error message, wrong output, slow timing) so later phases can verify the fix actually addresses it.

### Minimise

Once it's red, shrink the repro to the **smallest scenario that still goes red**. Cut inputs, callers, config, data, and steps **one at a time**, re-running the loop after each cut, and keep only what's load-bearing for the failure.

Why bother: a minimal reproduction reduces the possible causes in Phase 3 and the work needed to verify the fix in Phase 5.

Done when **every remaining element is load-bearing**: removing any one of them makes the loop go green.

Do not proceed until you have reproduced **and** minimised.

## Phase 3: Hypothesise

Generate **3–5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe: discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it; proceed with your ranking if the user is AFK.

## Phase 4: Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

**Perf branch.** For performance regressions, logs are usually wrong. Instead: establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Phase 5: Fix and verify

Apply the fix and repeat the original reproduction with existing checks or manual steps. If the user must perform the check, provide the steps and expected result and mark verification as pending until the result arrives.

When a regression test is needed under the testing policy, use an existing public interface that exercises the real failure. Confirm it distinguishes the buggy behavior from the fix. Use `$tdd` when the user requests a test-first workflow.

If a test cannot exercise the real failure through an existing interface, report that limitation. Use other available evidence and mark any verification gap; do not change production interfaces or start architecture work solely to add a test.

## Phase 6: Cleanup

Required before declaring done:

- [ ] Original reproduction was checked after the fix, or the exact manual check is marked as awaiting user verification. Claim the bug is verified fixed only after that check passes.
- [ ] Existing relevant checks and any targeted regression test results are reported, along with checks that could not run.
- [ ] All `[DEBUG-...]` instrumentation removed (`grep` the prefix)
- [ ] Throwaway prototypes deleted (or moved to a clearly-marked debug location)
- [ ] The hypothesis that turned out correct is stated in the commit / PR message, so the next debugger learns
