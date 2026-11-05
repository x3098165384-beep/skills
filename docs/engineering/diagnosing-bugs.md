## What it does

`diagnosing-bugs` investigates a hard bug or performance regression: confirm a reproduction, minimise it, rank possible causes, inspect the relevant state, fix, and verify. It starts with existing commands, existing tests, or confirmed manual steps. New automation addresses behavior that is difficult to test reliably by hand or impossible to test manually, or your explicit request.

The investigation needs an observed failure that can be distinguished from correct behavior. A manual reproduction you have already confirmed supplies that evidence; the agent does not need to create an automated test just to begin diagnosis.

It uses the project's `GLOSSARY.md` and relevant ADRs as described by [domain-modeling](https://aihero.dev/skills-domain-modeling).

## When to reach for it

Type `$diagnosing-bugs`, or the agent reaches for it on its own when a task fits: it is model-invoked, and fires on "diagnose" / "debug this" or on a report that something is broken, throwing, failing, or slow.

Reach for it on the hard ones: a bug you can't solve at first look, an intermittent flake, a regression introduced between two known-good states. It is slow and thorough on purpose, so it is the wrong tool for a question you want answered in one message.

| Your situation | Where to go |
| --- | --- |
| A specific defect you can describe as a symptom | This skill |
| A slow endpoint or a timing regression with a known before-and-after | This skill. It has a performance branch (measure a baseline, then bisect) |
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

检查在所述条件下正常时，会报告未复现及覆盖条件，停止没有依据的修改。仍需定位却无法取得失败证据时，会说明已经尝试什么、缺少什么，再请求相应环境、脱敏材料或临时诊断权限；不会把其他条件下的可能问题写成已确认原因。

## The gates between phases

对已复现故障的调查和修复，每个阶段都有完成条件；限定检查正常而未复现时，可以报告该结果后结束，不强行产出原因或修复。

| Gate | What has to be true |
| --- | --- |
| Into Phase 2 | An existing command, targeted automated reproduction, or confirmed manual sequence shows the reported failure |
| Into Phase 3 | The repro is reproduced *and* minimised: every remaining element is load-bearing |
| Into Phase 4 | 3–5 ranked, falsifiable hypotheses exist, each stating its prediction, shown to you before any is tested |
| Into Phase 5 | Probes map to a specific prediction, one variable at a time, every debug log tagged `[DEBUG-a4f2]`-style so cleanup is one grep |
| Done | 实际检查结果、待验项和临时诊断清理已说明；有修复时记录已确认原因，未复现时保留检查条件，不虚构修复结果 |

A needed regression test uses an existing public interface and must distinguish the buggy behavior from the fix. If that is unavailable, the agent reports the limitation instead of reshaping production code solely for a test. Targeted verification does not require a full TDD workflow. The implementation can be delivered while manual acceptance remains pending.

如果通过故意修改代码或测试数据来确认测试会失败，先用 `diff` 与未修改的副本比较，确认修改生效后再判断结果。

收尾还会维护因修复而失效的现有说明和任务状态。交付区分已确认原因、另行修复的恢复问题及仍未确认的首次触发原因；临时假设留在任务记录，没有相关说明需要更新时不另建文档。

## Common questions

**Will every diagnosis add a regression test?**

No. Existing checks and confirmed manual reproduction are the default. The agent can add a targeted test when a person cannot effectively verify the behavior, or when you request one. It explains the gap and scope without adding a test approval step.

**It fires on quick questions where I just wanted a direct answer.**
This is the most-reported problem with the skill. On GPT-5.6-Sol especially, users report it triggering on a plain description of a problem: "the model triggers the rather formal diagnosing-bugs skill instead. It then goes on to construct a reproduction scenario (often building a mock scenario with limited value) before giving me a response or suggestion. This results in considerable reply delays." Four separate people reported the same problem on [issue #578](https://github.com/mattpocock/skills/issues/578). The accepted fix is to start with a lighter approach and move to the full diagnosis only when the problem needs it, but that change has not shipped. The skill is tuned for Claude Code's invocation behaviour, and a [model](https://www.aihero.dev/ai-coding-dictionary/model) with a lower activation threshold fires it too often. Until the fix ships, the workaround is to say what you want ("just answer this, don't diagnose") or to disable model invocation for it in your [harness](https://www.aihero.dev/ai-coding-dictionary/harness).

**Can I point it at a codebase and ask where the performance problems are?**
No. It diagnoses one failure you can already name. Its performance branch is for a regression with a symptom (establish a baseline measurement, then bisect, measure first and fix second), not for a proactive sweep. A skill for the proactive version was [proposed and closed](https://github.com/mattpocock/skills/issues/431); no skill does it now.

**Does it stop and ask me before it writes the fix?**
No. Only Phase 3 has a human checkpoint: the ranked hypothesis list is shown to you before any is tested, and the agent continues with its own ranking if you are away. There is no gate between instrumentation and the fix, so the agent can start writing code before you have agreed with its root cause. [Issue #124](https://github.com/mattpocock/skills/issues/124) asks for that gate and is still open. If you want it, say so when you invoke the skill.

**I already ran `$triage` on this bug report. Is this the same work again?**
先复用已经确认的复现步骤和结果。只有现有证据不能区分本次故障与正常行为，或输入、版本和条件已经变化时，才补充相应检查；不因为换了技能就从头重做调查。

**Will the repro output it pastes leak secrets?**
当前技能明确要求展示命令、输出和材料前移除秘密信息，以 `<REDACTED>` 代替，只引用诊断所需片段。这是执行时必须落实的要求，不能仅凭写有规则就认定所有输出已经安全；脱敏后材料不足时，应说明具体缺少的信息。

**My security scanner flagged this skill as high risk.**
Snyk flags it, and the flag is a false positive. It is the only skill in the set that ships an executable shell script (`hitl-loop.template.sh`) alongside instructions to run it and to curl a dev server. A shipped `.sh` file, instructions to run it, and outbound HTTP together are enough to trigger a static scanner. The script itself is about 30 lines of `read -r -p` prompts that pause for human input. The scanner rates what the skill could do, not a proven exploit.

**What happened to `/diagnose`?**
Renamed to `$diagnosing-bugs` in v1.0.0. The old name no longer exists. Anything of yours that chains `/diagnose` (a wrapper skill, a saved prompt) needs updating.

## It's working if

- It grounds the diagnosis in command output or a confirmed manual reproduction of your reported failure.
- The failure it reproduces is the one you reported, not a nearby one it found on the way.
- It shrinks the repro before it starts guessing, and can tell you why it needs each remaining piece.
- It shows you a ranked list of 3–5 hypotheses, each with a prediction you could falsify, before it tests any of them.
- Every debug log it adds carries a tag like `[DEBUG-a4f2]`, and a grep for that tag comes back empty when it declares done.
- 有修复时说明已确认原因及实际复验结果；未复现时明确检查条件，不把其他恢复问题当作原故障原因。
- New tests address a stated manual testing gap or your explicit request; manual verification still awaiting your result is clearly marked.

## Where it fits

`diagnosing-bugs` 调查一个具体故障，交付已确认原因与修复结果，或限定条件下未复现的结论，并保留仍需人工验证的内容。[ask-matt](https://aihero.dev/skills-ask-matt) 将难以定位的故障引到这里。

[triage](https://aihero.dev/skills-triage) sits upstream for raw reports from other people. Its confirmed reproduction can provide evidence for this investigation. [tdd](https://aihero.dev/skills-tdd) supplies the test loop when you request test-first work.
