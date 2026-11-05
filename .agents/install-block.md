# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

## Managed installs first

Lead with installs that update themselves. Fall back to skills.sh, labelled "manual updates", only for agents that have no such install. Call a route managed only if it updates without the user running a command. Put any one-time opt-in beside its install command. Never promise "instant".

Claude Code installs from its official marketplace, `claude-plugins-official`. 上游其他自动更新方式使用其 `.claude-plugin/marketplace.json` 和 `plugin.json`；本 `codex` 分支继续从 fork 安装，以保留定制规则。The Release workflow runs `npm run version`, which copies the plugin version from `package.json`.

| Agent         | Route                            | Updates itself?                                                  |
| ------------- | -------------------------------- | ---------------------------------------------------------------- |
| Claude Code   | `@claude-plugins-official`       | Yes, by default                                                  |
| Codex         | 本 fork 的 `codex` 分支，通过 skills.sh 或本机目录链接安装 | 手动更新；本机目录链接随仓库文件更新 |
| Copilot CLI   | `@mattpocock` marketplace        | Yes, after a one-time `autoUpdate: true`                         |
| VS Code       | Chat: Install Plugin From Source | Yes, daily, by default                                           |
| Gemini CLI    | `gemini skills install` (copies) | No. A Gemini extension would need a flat `skills/<name>/` layout |
| Everyone else | skills.sh                        | No. Run `npx skills update`, and re-run `add` for new skills     |

Sources (2026-10-08): Codex `core-plugins/src/manager.rs`; Copilot [cli-config-dir-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference); VS Code `pluginAutoUpdate.ts`; Gemini `skillLoader.ts`.

Nobody has run Auggie, Droid, Qwen or Goose against this repo, so they stay on skills.sh until someone does.

## Claude Code

<canonical-block name="claude-code">

```bash
claude plugin install mattpocock-skills@claude-plugins-official
```

Updates itself by default.

</canonical-block>

## Codex: skills.sh

本分支的 Codex 安装使用下面的 fork 地址，以保留定制规则。skills.sh 复制技能文件，需要手动更新。

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add https://github.com/x3098165384-beep/skills/tree/codex --agent codex
```

Pick the skills you want to install for Codex. **The installer lets you choose which skills to take: make sure `setup-matt-pocock-skills` is one of them.**

</canonical-block>

本机已安装技能通过目录链接指向这个仓库，合并或拉取后会读取更新的文件。只有需要新增、移除或改名本机技能时，才运行 `scripts/link-codex-skills.ps1`；它会链接全部非 `deprecated` 技能，包括 `in-progress`。若本次只更新已安装技能，保留现有链接即可。

## GitHub Copilot (CLI and VS Code)

Use the marketplace, not `copilot plugin install mattpocock/skills`. Copilot has deprecated direct repo installs, and they can't auto-update. The `extraKnownMarketplaces` entry follows the documented schema, but nobody has run it yet.

<canonical-block name="copilot">

```bash
copilot plugin marketplace add mattpocock/skills
copilot plugin install mattpocock-skills@mattpocock
```

Then, once, add to `~/.copilot/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "mattpocock": { "source": { "source": "github", "repo": "mattpocock/skills" }, "autoUpdate": true }
  }
}
```

In VS Code, run **Chat: Install Plugin From Source** and enter `https://github.com/mattpocock/skills`. It updates daily.

</canonical-block>

## Gemini CLI

Gemini doesn't read `.claude-plugin`, and `--path` takes one bucket. One install per promoted bucket gives exactly the promoted set (27 skills, verified 2026-10-07).

<canonical-block name="gemini">

```bash
gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering
gemini skills install https://github.com/mattpocock/skills.git --path skills/productivity
```

Re-run both commands to update.

</canonical-block>

## Every other agent, or editable files (skills.sh)

`-a` preselects the agent. Each agent in the comment was run on 2026-10-07. Prefer skills.sh to an agent's own repo installer, such as `amp skill add` or `pi install git:…`, because those also pull in `misc/` and `in-progress/`. `npx skills update` skips skills added upstream since `add`, so the block tells users to re-run `add`.

<canonical-block name="other-agents">

```bash
npx skills@latest add mattpocock/skills -a <agent>  # cursor, opencode, devin, windsurf, amp, pi; omit -a to choose
```

When the installer asks which skills to take, include `setup-matt-pocock-skills`. To update, run `npx skills@latest update`, and re-run `add` to pick up new skills.

</canonical-block>

Use the single-skill form wherever one skill is named on its own. `docs/` pages don't use this block, because ai-hero renders the install widget above the page body. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add https://github.com/x3098165384-beep/skills/tree/codex --skill <name> --agent codex
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling everywhere.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice: always say "pick one".
