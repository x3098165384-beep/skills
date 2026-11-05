---
name: setup-pre-commit
description: Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user wants to add pre-commit hooks, set up Husky, configure lint-staged, or add commit-time formatting/typechecking/testing.
---

# Setup Pre-Commit Hooks

## What This Sets Up

- **Husky** pre-commit hook
- **lint-staged** running Prettier on all staged files
- **Prettier** config (if missing)
- **typecheck** and **test** scripts in the pre-commit hook

## Steps

先检查项目已有的提交前检查、格式化、类型检查和测试命令。复用有效配置，保留既有命令及无关设置；新增测试或检查脚本遵循 `$tdd` 的 `TESTING-POLICY.md`，不为设置提交前检查补写实现细节测试。

### 1. Detect package manager

Check for `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn), `bun.lockb` (bun). Use whichever is present. Default to npm if unclear.

### 2. Install dependencies

Install as devDependencies:

```
husky lint-staged prettier
```

### 3. Initialize Husky

只有项目尚未完成 Husky 初始化时才运行下面的命令；已有配置继续复用。

```bash
npx husky init
```

This creates `.husky/` dir and adds `prepare: "husky"` to package.json. 已有 `prepare` 或提交前检查时保留原有动作，将需要的 Husky 初始化和检查合入现有配置。

### 4. Create `.husky/pre-commit`

已有检查文件时保留原命令，将需要的检查合入；新建文件可以使用下面的最小内容（Husky v9+ 不需要 shebang）：

```
npx lint-staged
npm run typecheck
npm run test
```

**Adapt**: Replace `npm` with detected package manager. If repo has no `typecheck` or `test` script in package.json, omit those lines and tell the user.

### 5. Create `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. Create `.prettierrc` (if missing)

Only create if no Prettier config exists. Use these defaults:

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. Verify

- [ ] `.husky/pre-commit` exists and is executable
- [ ] `.lintstagedrc` exists
- [ ] `prepare` 包含需要的 Husky 初始化，原有准备命令仍被保留
- [ ] `prettier` config exists
- [ ] Run `npx lint-staged` to verify it works

### 8. Commit

只暂存本次任务修改或创建的文件，提交说明写明所加检查；保留无关修改。用户或项目要求暂缓提交时，按要求保留待提交结果。

This will run through the new pre-commit hooks: a good smoke test that everything works.

## Notes

- Husky v9+ doesn't need shebangs in hook files
- `prettier --ignore-unknown` skips files Prettier can't parse (images, etc.)
- The pre-commit runs lint-staged first (fast, staged-only), then full typecheck and tests
