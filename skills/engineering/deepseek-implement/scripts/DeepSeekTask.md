# 委派任务给 DeepSeek Flash

`Invoke-DeepSeekTask.ps1` 用独立 Codex CLI 进程调用 `deepseek-flash`，读取已有的 `deepseek.config.toml`，不改变默认模型或原来的 `codexdeepseek` 启动方式。这不是 Codex 内置子代理。

需要 PowerShell 7、npm 安装的 Codex CLI，以及已经可用的 DeepSeek 配置和凭据。默认可见模式还需要 PATH 中可用的 `wt.exe`（Windows Terminal）。

把任务写入 UTF-8 文本文件，说明要检查的文件、问题和期望输出。然后运行：

```powershell
pwsh -NoProfile -File "$env:USERPROFILE/.codex/tools/Invoke-DeepSeekTask.ps1" -TaskFile 'C:/work/task.txt' -WorkDirectory 'C:/work/project'
```

子进程可以直接读取任务指定的文件。也可以由主代理提供文件内容，省去子进程调用工具：

```powershell
& "$env:USERPROFILE/.codex/tools/Invoke-DeepSeekTask.ps1" -TaskFile 'C:/work/task.txt' -WorkDirectory 'C:/work/project' -InputFiles 'C:/work/project/example.cs'
```

`-InputFiles` 可接受多个路径。脚本读取这些文件并加入任务，要求 DeepSeek 不调用工具，只分析已提供内容。不要传入凭据或与任务无关的文件。此方式不依赖子进程的文件读取能力。

默认限时 300 秒，可用 `-TimeoutSeconds 600` 调整。经用户授权，脚本使用 `danger-full-access`，不再使用 Codex 文件沙箱，避免本机曾出现的 `helper_sandbox_lock_failed` 权限错误。子进程拥有当前 Windows 账户可用的文件读写和命令执行权限，不会因此获得额外的管理员权限。默认只读要求由任务指令约束，不是系统强制限制。脚本禁用配置文件中声明的 MCP；两种任务模式均禁止操作 Unity、读取凭据或启动其他代理。文件修改仅在下文明确授权的模式中允许。

每次运行在 Codex 用户目录的 `deepseek-runs` 下建立单独目录，保存 `task.txt`、最终回答 `answer.md`、事件 `events.jsonl` 和错误输出 `stderr.txt`。失败、超时或空回答会报错，超时会停止进程树。任务和回答会保存在本机；提交的任务以及模型实际读取的内容会发送给 DeepSeek。

默认通过 Windows Terminal 新开一个窗口，在其中运行 PowerShell 7，显示 CLI 发出的说明、命令、命令结果和文件修改事件，同时持续保存 `events.jsonl`。这不增加模型指令或上下文；窗口仅用于观看，不能向模型追加对话。命令结果何时出现取决于 CLI 何时发出事件，并非每个命令都逐字输出。运行时可最小化，关闭执行窗口可能中断任务。任务结束后的标签页关闭行为遵循 Windows Terminal 的配置，主代理仍收到最终回答；完整记录保留在运行目录。启动时会立即输出运行记录路径，目录内的 `launch.json` 和 `run.ps1` 是该次执行使用的启动文件，不要重复运行它们。`worker.json` 和 `worker.ready` 用于主脚本接管实际执行的 PowerShell 进程，超时只停止该任务的进程树，不停止 Windows Terminal 或其他标签页。

需要原来的无窗口方式时传入 `-Hidden`；此模式仍在任务结束后保存事件和错误输出。

独立进程不继承主对话。委派时需写明必要背景、项目约束和允许读取的范围；主代理读取最终回答后，核对证据再整合。

## 经明确授权的文件修改

默认 `TaskMode` 为 `ReadOnly`，保持只读。只有用户明确授权任务的文件修改后，才使用 `-TaskMode ScopedWrite -WritableFiles <具体文件列表>`；任务文件必须写明授权来源、修改要求和验证限制。列表只接受工作目录内的具体文件，禁止 `.meta`，不接受目录。需要新增文件时可填写尚不存在的具体路径。

`ScopedWrite` 不能与 `InputFiles` 同用，因为后者禁止子进程调用工具。写入范围由任务指令约束，不是操作系统沙箱；主代理必须检查实际差异。此模式仍禁止 Unity、MCP、其他代理、读取凭据、暂存、提交、推送、部署和工作区重置或清理。写入授权不包含这些操作。
