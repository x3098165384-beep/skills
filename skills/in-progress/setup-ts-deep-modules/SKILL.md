---
name: setup-ts-deep-modules
description: Wire dependency-cruiser into a TypeScript repo so each package is a deep module, with implementation hidden in subfolders and reachable only through its entry-point files. User-directed.
---

# Setup TS Deep Modules

Make every package in this repo a **deep module**: a lot of behaviour behind a small interface. A package's public surface is its **entry points** (the files at the package root), and everything in its subfolders is hidden. This skill installs [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) and the rules that make the entry points the only way in, then proves the rules bite.

读取 `$codebase-design` 作为设计参考，按实际调用方和项目既有名称说明包的公开接口与内部实现。

## The shape this enforces

```
src/packages/
  <name>/
    index.ts        ← an entry point (public). Import this from outside.
    client.ts       ← another entry point. Packages may expose SEVERAL.
    lib/            ← implementation: hidden from outside, free to import each other.
    tests/          ← co-located tests + fixtures (a subfolder, so private).
```

The public surface is the package's **root files**, not one designated `index.ts`. By convention implementation lives in `lib/` and tests in `tests/`, giving every package the same two-folder shape. The rule itself is general, though: *anything* in *any* subfolder is private, so you never extend the config to add a folder.

Four rules, all `error`:

1. **Entry-point boundary**: code outside a package (app code or another package) may import only that package's entry points (its root files), never anything in its subfolders.
2. **Intra-package freedom**: a package's own files import each other freely.
3. **Tests through the entry points**: files under `<pkg>/tests/` may import any package's entry points and their own `tests/` fixtures, but never any package's subfolder internals (not even their own). Integration tests across packages are fine; deep imports are not.
4. **No cycles**: no dependency cycles.

**Entry points, not a barrel.** Because the public surface is *every* root file, a package can expose several small entry points (`index.ts`, `client.ts`, `server.ts`) instead of funnelling everything through one giant `index.ts`. Barrel files that re-export a whole subtree are discouraged; keep entry points small and hide implementation in subfolders.

Layering (which packages may depend on which) is a *different* concern and is left as a commented stub in the config for this repo to fill in.

## Steps

### 1. Detect the environment

- **Package manager**: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, else npm. Use it for every command below (`pnpm`/`yarn`/`npm run`/`bunx`).
- **Packages root**：从项目工作区配置、现有包目录和使用说明确定位置，沿用已有布局。没有现有包布局时，再使用适合本项目的位置；只有无法从项目中确定且会影响实施范围时才询问用户。
- **Existing config**: check for a `.dependency-cruiser.*` file. If one exists, do **not** overwrite it: merge the four rules and the options in, and tell the user what you added.

**Done when:** package manager, packages root, and existing-config status are all known.

### 2. Install dependency-cruiser

Install `dependency-cruiser` as a devDependency with the detected package manager.

**Done when:** `dependency-cruiser` is in `devDependencies`.

### 3. Write the config

Copy [`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs) to the repo root as `.dependency-cruiser.cjs`. Set `PACKAGES_ROOT` to the root detected in step 1. The rules are path-depth based and extension-agnostic, so nothing else needs adapting.

**Done when:** `.dependency-cruiser.cjs` exists with the correct `PACKAGES_ROOT`, and the four forbidden rules are present.

### 4. Wire it into the checks

- Add a `lint:boundaries` script: `depcruise <packages-root>` (or `depcruise src`).
- Fold it into the repo's umbrella check command, the one that already runs typecheck (e.g. a `check` / `ci` / `validate` script). Do **not** touch `tsconfig` or add path aliases.
- If there is no umbrella script, add `lint:boundaries` and tell the user to include it in CI.

**Done when:** `lint:boundaries` exists and runs as part of the same command as typecheck.

### 5. Choose files for verification

优先使用现有包及其测试目录验证导入规则。没有适用文件时，创建本次检查所需的最小临时文件，分别放在包根目录、内部目录和测试目录，检查结束后仅移除这些临时文件。这里验证的是导入规则，不新增只转发调用的正式模块或断言示例函数结果的测试。

用户明确需要长期保留的示例包时，再按已有布局提供，说明它的用途和检查方式。

**Done when:** 已选定验证文件，记录哪些是原有文件、哪些是本次临时创建的文件。

### 6. Prove the rules bite

This is the completion criterion for the whole skill: a config that doesn't fail on a violation is worthless.

1. 运行 `lint:boundaries`，记录原有结果；验证用例只通过包根目录导入时，应通过本次配置的规则检查。
2. 在验证用的测试目录文件中临时加入内部导入（例如 `import { thing } from "../lib/impl"`），再次运行，确认出现 `tests-through-entrypoints` 错误。
3. 撤回本次临时导入并重跑，确认该错误消失；保留原文件和无关改动，报告其他原有错误，不把清理无关错误当作本任务要求。

**Done when:** 已确认正常导入通过、内部导入被拒绝、撤回后恢复原有结果。第 2 步没有拒绝内部导入时，先修正本次规则配置再完成交付。

### 7. Document the convention

Write a `README.md` **in the packages folder** (`<packages-root>/README.md`, next to the packages it governs) covering: the actual `<packages-root>/<name>/` layout (entry points at the root, the project's existing implementation and test subfolders), "import only through a package's entry points (its root files)", and how to run `lint:boundaries`. **Discourage barrel files** explicitly: expose several small entry points instead of re-exporting a whole subtree through one index. Keep it to the copy-me snippet plus the four rules in one paragraph each.

Then add a **context pointer** to it from the repo's agent-instructions file (`CLAUDE.md` if present, else `AGENTS.md`, creating `AGENTS.md` if neither exists). 用实际目录替换下面的占位路径，简短说明：`修改或导入包之前，先读 [包的导入规则](./<packages-root>/README.md)。` 让后续执行者能在修改前找到现有规则。

**Done when:** `<packages-root>/README.md` exists and discourages barrels, and the repo's `CLAUDE.md`/`AGENTS.md` links to it.

## Notes

- The config's `$1` back-references (dependency-cruiser's group matching) are what let a package reach its own internals while outsiders can't. Don't flatten them into separate per-package rules.
- Public vs private is decided by **depth**: a package's root files are entry points; anything in a subfolder is private. The conventional subfolders are `lib/` (implementation) and `tests/`, but the rule doesn't hardcode them: any subfolder is private, so a new folder never needs a config change. Adding an entry point is just adding a root file (no barrel).
- Packages are **flat**: one tier of immediate children under the root. A package's internals may nest as deep as you like; a package may not contain another package.
- Use `.cjs` (not `.js`) so the config's `module.exports` works even in `"type": "module"` repos.
