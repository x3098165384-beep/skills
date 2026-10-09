## What it does

`wait-what` is what you type when a message did not land. The [agent](https://www.aihero.dev/ai-coding-dictionary/agent) explains it again in your language, supplies the missing facts and their impact, and uses plain words and established project names.

The skill is three lines long. That is the design, not an unfinished draft. Skills that fight verbosity fail by growing: a four-hundred-line concision skill still leaves the [model](https://www.aihero.dev/ai-coding-dictionary/model) verbose, because the model reads the volume, not the plea. This one carries a single precise leading word and nothing else.

## When to reach for it

You invoke it by typing `$wait-what`. The agent will not reach for it on its own, and it shouldn't. Only you know when you stopped following.

Use it the second you notice you're skimming. The agent has drifted into jargon it invented, stacked five acronyms, or explained a decision whose premise you never saw. It fixes the conversation you're already in. To stop the jargon arriving at all, use [grill-with-docs](https://aihero.dev/skills-grill-with-docs), which builds the shared language upfront.

## The name is the mechanism

The leading word is **wait**. "Be concise" is an instruction about the agent's output, and the model obeys it by clipping words and losing you further. **Wait** is about *your* state. It says comprehension failed here. An agent that hears "be brief" writes telegrams. An agent that hears "wait, you lost me" backs up and explains.

That difference is the whole skill. Every popular fix for verbosity names the *output*: `/tldr`, `/no-fluff`, `/talk-normal`. The model over-corrects into a caveman register that is shorter and no clearer. Naming the *listener* asks for both halves at once: fewer words **and** the context you were missing.

The skill says re-pitch **that**, not "that last message". What lost you is usually bigger than one paragraph, so the agent decides how far back to go.

## It plugs into the language you already have

The explanation uses your project's configured glossary when terminology matters. Project instructions and `docs/agents/domain.md` determine its location; [domain-modeling](https://aihero.dev/skills-domain-modeling) supplies defaults when no location is configured.

The skill also works without a glossary. It uses the words already established in the conversation and explains unfamiliar required names.

## It's working if

- The re-pitch is **shorter and clearer**, not shorter and blunter.
- It adds the premise you were missing, instead of only deleting words.
- Project nouns replace invented ones. Your established terms come back.
- You can use it twice in a row, and it does not degrade into terseness.

## Where it fits

You can use `wait-what` at any point, in any conversation, inside any other skill. It repairs one message after the fact. The real cure is a shared language agreed upfront, and that is [grill-with-docs](https://aihero.dev/skills-grill-with-docs): a [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) session that runs [domain-modeling](https://aihero.dev/skills-domain-modeling) as it goes, so the words you both use land in your configured glossary. If you're unsure which skill fits the moment, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.
