## What it does

`diagnosing-bugs` investigates a hard bug or performance regression: confirm a reproduction, minimise it, rank possible causes, inspect the relevant state, fix, and verify. It starts with existing commands, existing tests, or confirmed manual steps. New automation addresses behavior that is difficult to test reliably by hand or impossible to test manually, or your explicit request.

The investigation needs an observed failure that can be distinguished from correct behavior. A manual reproduction you have already confirmed supplies that evidence; the agent does not need to create an automated test just to begin diagnosis.

## When to reach for it

Type `$diagnosing-bugs`, or the agent reaches for it on its own when a task fits: it is model-invoked, and fires on "diagnose" / "debug this" or on a report that something is broken, throwing, failing, or slow.

Reach for it on the hard ones: a bug that resists a first look, an intermittent flake, a regression that crept in between two known-good states. It is heavy by design, and the wrong tool for a question you want answered in one message.

| Your situation | Where to go |
| --- | --- |
| A specific defect you can describe as a symptom | This skill |
| A slow endpoint or a timing regression with a known before-and-after | This skill: it has a performance branch (measure a baseline, then bisect) |
| "Where are the bottlenecks in this codebase?", no specific symptom | Not this skill. It diagnoses one known failure, it does not audit |
| A raw bug report from someone else, not yet confirmed or written up | [triage](https://aihero.dev/skills-triage) first |
| Throwaway code to answer a design question, not chase a defect | [prototype](https://aihero.dev/skills-prototype) |
| Building a planned behaviour test-first | [tdd](https://aihero.dev/skills-tdd) |
| A test cannot reproduce the real failure through an existing interface | Report the limitation, use available evidence, and identify any remaining verification gap |

## The tight loop is the skill

Reuse the reproduction you already have. The available methods are:

1. Run an existing test, CLI command, HTTP request, or replay tool with the real input and inspect the specific result.
2. Record manual actions, input, observed failure, and expected result. No wrapper script is required.
3. If the behavior is difficult to test reliably by hand or impossible to test manually, explain the gap and build the smallest useful automated reproduction without a separate test approval.

A useful feedback loop distinguishes the reported failure from correct behavior and can be repeated after the fix. For intermittent failures, record the observed frequency and conditions. Temporary scripts and throwaway harnesses follow the same testing boundary as permanent tests.

When it genuinely cannot build one, it is instructed to stop and say so, list what it tried, and ask you for [environment](https://www.aihero.dev/ai-coding-dictionary/environment) access, a captured artifact, or permission to add temporary instrumentation. It should not proceed to hypothesise anyway.

## The gates between phases

The phases are gates, not a checklist. Each one refuses to open until something specific is true.

| Gate | What has to be true |
| --- | --- |
| Into Phase 2 | An existing command, targeted automated reproduction, or confirmed manual sequence shows the reported failure |
| Into Phase 3 | The repro is reproduced *and* minimised: every remaining element is load-bearing |
| Into Phase 4 | 3–5 ranked, falsifiable hypotheses exist, each stating its prediction, shown to you before any is tested |
| Into Phase 5 | Probes map to a specific prediction, one variable at a time, every debug log tagged `[DEBUG-a4f2]`-style so cleanup is one grep |
| Done | Actual check results are reported, any manual verification still needed is marked as pending, temporary instrumentation is removed, and the confirmed cause is recorded |

A needed regression test uses an existing public interface and must distinguish the buggy behavior from the fix. If that is unavailable, the agent reports the limitation instead of reshaping production code solely for a test. Targeted verification does not require a full TDD workflow. The implementation can be delivered while manual acceptance remains pending.

## Common questions

**Will every diagnosis add a regression test?**

No. Existing checks and confirmed manual reproduction are the default. The agent can add a targeted test when a person cannot effectively verify the behavior, or when you request one. It explains the gap and scope without adding a test approval step.

**It fires on quick questions where I just wanted a direct answer.**
This is the most-reported problem with the skill, and it is real. On GPT-5.6-Sol especially, users report it triggering on a plain description of a problem: "the model triggers the rather formal diagnosing-bugs skill instead. It then goes on to construct a reproduction scenario (often building a mock scenario with limited value) before giving me a response or suggestion. This results in considerable reply delays." Four separate people reported the same shape on [issue #578](https://github.com/mattpocock/skills/issues/578). The accepted fix is to start with a lighter approach and graduate to the heavier one only where the problem warrants it, but that change has not landed. The skill is calibrated against Claude Code's invocation behaviour; a [model](https://www.aihero.dev/ai-coding-dictionary/model) with a lower activation threshold over-fires it. Until it is graduated, the practical fix is to say what you want ("just answer this, don't diagnose") or to disable model invocation for it in your [harness](https://www.aihero.dev/ai-coding-dictionary/harness).

**Can I point it at a codebase and ask where the performance problems are?**
No. It diagnoses one failure you can already name. Its performance branch is for a regression with a symptom (establish a baseline measurement, then bisect, measure first and fix second), not for a proactive sweep. A skill for the proactive version was [proposed and closed](https://github.com/mattpocock/skills/issues/431); there is currently no skill for it.

**Does it stop and ask me before it writes the fix?**
No. Only Phase 3 has a human checkpoint: the ranked hypothesis list is shown to you before any is tested, and it proceeds on its own ranking if you are away. There is no gate between instrumentation and the fix, so the agent can start writing code before you have agreed with its root cause. [Issue #124](https://github.com/mattpocock/skills/issues/124) asks for that gate and is still open. If you want it, say so when you invoke the skill.

**I already ran `$triage` on this bug report. Is this the same work again?**
Partly, and neither skill admits it. As one reader put it: "Triage's step 3 is essentially a shallow, bounded instance of diagnosing-bugs Phase 1–2, but neither file mentions the other." Triage does a bounded "is this actually a bug, and what is the surface" pass; this skill does the thorough version. Running triage first is not wasted (its verification often gives you most of Phase 1's raw material), but expect to redo it properly here, and expect no cross-reference to tell you that.

**Will the repro output it pastes leak secrets?**
It might. The skill asks the agent to paste the invocation and its output, and to request artifacts like HAR files, log dumps, and core dumps. None of those are sanitised by instruction. [Issue #674](https://github.com/mattpocock/skills/issues/674) raises exactly this (credentials, tokens, cookies, and personal data riding along into a chat, an issue, or a PR) and proposes a redaction guardrail. It is open and unimplemented. Treat redaction as your job for now, particularly before the output goes anywhere public.

**My security scanner flagged this skill as high risk.**
Snyk flags it, and the flag is a false positive. It is the only skill in the set that ships an executable shell script (`hitl-loop.template.sh`) alongside instructions to run it and to curl a dev server. Shipped `.sh` plus run-it instructions plus outbound HTTP is enough to trip a static scanner. The script itself is about 30 lines of `read -r -p` prompts that pause for human input. The scanner is rating the capability surface, not a proven exploit.

**What happened to `/diagnose`?**
Renamed to `$diagnosing-bugs` in v1.0.0. The old name no longer exists. Anything of yours that chains `/diagnose` (a wrapper skill, a saved prompt) needs updating.

## It's working if

- It grounds the diagnosis in command output or a confirmed manual reproduction of your reported failure.
- The failure it reproduces is the one you reported, not a nearby one it found on the way.
- It shrinks the repro before it starts guessing, and can tell you why each remaining piece is load-bearing.
- You are shown a ranked list of 3–5 hypotheses, each with a prediction you could falsify, before any of them is tested.
- Every debug log it adds carries a tag like `[DEBUG-a4f2]`, and a grep for that tag comes back empty when it declares done.
- The commit or PR message names which hypothesis was right.
- New tests address a stated manual testing gap or your explicit request; manual verification still awaiting your result is clearly marked.

## Where it fits

`diagnosing-bugs` is a standalone investigation of one reported failure. It delivers the fix, check results, and any manual verification still needed. [ask-matt](https://aihero.dev/skills-ask-matt) routes hard bugs here.

[triage](https://aihero.dev/skills-triage) sits upstream for raw reports from other people. Its confirmed reproduction can provide evidence for this investigation. [tdd](https://aihero.dev/skills-tdd) supplies the test loop when you request test-first work.
