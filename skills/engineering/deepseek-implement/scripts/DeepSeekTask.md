# 委派任务给 DeepSeek Flash

`Invoke-DeepSeekTask.ps1` 用独立 Codex CLI 进程调用 `deepseek-flash`，读取已有的 `deepseek.config.toml`，不改变默认模型或原来的 `codexdeepseek` 启动方式。这不是 Codex 内置子代理。

需要 PowerShell 7、npm 安装的 Codex CLI，以及已经可用的 DeepSeek 配置和凭据。

把任务写入 UTF-8 文本文件，说明要检查的文件、问题和期望输出。然后运行：

```powershell
pwsh -NoProfile -File "$env:USERPROFILE/.codex/tools/Invoke-DeepSeekTask.ps1" -TaskFile 'C:/work/task.txt' -WorkDirectory 'C:/work/project'
```

子进程可以直接读取任务指定的文件。也可以由主代理提供文件内容，省去子进程调用工具：

```powershell
& "$env:USERPROFILE/.codex/tools/Invoke-DeepSeekTask.ps1" -TaskFile 'C:/work/task.txt' -WorkDirectory 'C:/work/project' -InputFiles 'C:/work/project/example.cs'
```

`-InputFiles` 可接受多个路径。脚本读取这些文件并加入任务，要求 DeepSeek 不调用工具，只分析已提供内容。不要传入凭据或与任务无关的文件。此方式不依赖子进程的文件读取能力。

默认限时 300 秒，可用 `-TimeoutSeconds 600` 调整。经用户授权，脚本使用 `danger-full-access`，不再使用 Codex 文件沙箱，避免本机曾出现的 `helper_sandbox_lock_failed` 权限错误。子进程拥有当前 Windows 账户可用的文件读写和命令执行权限，不会因此获得额外的管理员权限。默认只读要求由任务指令约束，不是系统强制限制。默认禁用配置文件中声明的所有 MCP，并禁止操作 Unity；需要 Unity 时使用下文开关。两种任务模式均禁止读取凭据或启动其他代理。文件修改仅在下文明确授权的模式中允许。

每次运行在 Codex 用户目录的 `deepseek-runs` 下建立单独目录，保存 `task.txt`、最终回答 `answer.md`、事件 `events.jsonl` 和错误输出 `stderr.txt`。失败、超时或空回答会报错，超时会停止进程树。任务和回答会保存在本机；提交的任务以及模型实际读取的内容会发送给 DeepSeek。

启动后会立即输出运行记录目录，`events.jsonl` 和 `stderr.txt` 在运行中持续写入。可用 `Get-Content -LiteralPath <日志路径> -Tail 5 -Encoding utf8` 查看当前进度；查询间隔仍遵守调用技能的要求。进程未结束时，日志最后一行可能尚未写完。停止任务时保留启动脚本进程，让它收集子进程退出状态；只终止确认属于该次运行的子进程树。

独立进程不继承主对话。委派时需写明必要背景、项目约束和允许读取的范围；主代理读取最终回答后，核对证据再整合。

## 经明确授权的文件修改

默认 `TaskMode` 为 `ReadOnly`，保持只读。只有用户明确授权任务的文件修改后，才使用 `-TaskMode ScopedWrite -WritableFiles <具体文件列表>`；任务文件必须写明授权来源、修改要求和验证限制。列表只接受工作目录内的具体文件，禁止 `.meta`，不接受目录。需要新增文件时可填写尚不存在的具体路径。

`ScopedWrite` 不能与 `InputFiles` 同用，因为后者禁止子进程调用工具。写入范围由任务指令约束，不是操作系统沙箱；主代理必须检查实际差异。此模式不会自动开启 Unity MCP；其他代理、读取凭据、暂存、提交、推送、部署和工作区重置或清理仍禁止。文件写入授权不包含这些操作。

## 选择是否启用 Unity MCP

使用同一个脚本，通过参数选择，不维护两份启动逻辑：

- 不加 `-EnableUnityMcp`：保持原行为，关闭所有 MCP，禁止 Unity 操作。
- 加 `-EnableUnityMcp`：只开启已配置的 `unityMCP`，其他 MCP 继续关闭；不改写全局配置。
- 开启时必须同时提供 `-UnityOperationScope`，写明请求者已经批准的目标、操作与数量范围。脚本会将其写入本次任务提示；参数本身不构成授权，也不是工具调用的技术隔离。

例如，请求者已经批准只读检查一个指定图资源后：

```powershell
& "$env:USERPROFILE/.codex/tools/Invoke-DeepSeekTask.ps1" -TaskFile 'C:/work/task.txt' -WorkDirectory 'C:/work/project' -EnableUnityMcp -UnityOperationScope '仅通过 Unity MCP 读取 Assets/NpcTest.asset 这一个资源及其文件内子图，核对节点、连线和变量映射；不刷新、不测试、不修改资源。'
```

需要通过 Unity 修改资源时，再使用 `-TaskMode ScopedWrite -WritableFiles ...` 列出获准写入的具体资源。Unity 操作范围必须包含对应修改；保存产生的 `.meta` 由 Unity 维护，不能直接编辑。任务文件中也要写明同样的授权，不能仍写“禁止 Unity/MCP”。准备 Unity 操作时先按项目要求核对授权和执行步骤。

`InputFiles` 是禁止一切工具调用的模式，不能与 `EnableUnityMcp` 同用。开启时若未填操作范围或配置中没有 `unityMCP`，脚本会在启动子进程前报错。
