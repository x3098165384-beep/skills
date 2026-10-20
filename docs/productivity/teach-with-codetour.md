## What it does

在 VS Code 中把讲解放到真实代码旁，交付独立的 `.tours/*.tour` 文件。每个代码段结合完整输入、执行过程、变量变化和结果讲清实际工作，默认只修改讲解文件。

## When to reach for it

手动输入 `$teach-with-codetour`，并说明要学习的代码或功能。这个技能关闭自动选择，只有用户主动调用后才启动。

- 想看懂当前项目的一段代码、循环或状态变化：使用这个技能。
- 想围绕一个主题持续学习并保留学习记录：使用 [teach](https://github.com/x3098165384-beep/skills/blob/codex/skills/productivity/teach/SKILL.md)。

## Prerequisites

需要可读取的项目源码。查看讲解需要 VS Code 和 CodeTour 扩展，检查讲解文件需要 Node.js。文件写入项目的 `.tours/` 目录；安装扩展、改设置或运行项目遵守本次授权和项目规则。

## 完整执行例子

先说明这段代码要完成什么，再选一组具体输入，从头执行到最后结果。循环表格保留每轮对象、关键变量、判断和动作；随机数字标明是一种可能结果。同一段的说明与例子放在一起，后续追问优先直接解释，需要更新教材时修改原说明。

## Common questions

**技能放在哪里？**

仓库中的位置是 `skills/productivity/teach-with-codetour/`。本机安装入口可以链接到这个目录，让技能、参考文件和检查脚本随仓库一起更新。

**检查通过能证明什么？**

检查脚本只读文件，核对 JSON、代码路径、有效位置和定位表达式，并提醒同一位置的重复步骤。教学效果需要复读，VS Code 的实际显示需要打开讲解确认；这些检查不证明项目编译或运行正确。

## It's working if

- 在 VS Code 中打开讲解后，相关代码段位于评论框上方。
- 能按给定输入逐轮追踪变量，并算出说明中的最终结果。
- 同一段代码的说明和例子集中在一起，追问后不会不断增加重复步骤。
- 只新增或更新了讲解文件，学习过程没有改动项目业务逻辑。

## Where it fits

这是随时可以手动调用的独立技能，面向当前项目的代码阅读。[teach](https://github.com/x3098165384-beep/skills/blob/codex/skills/productivity/teach/SKILL.md) 负责跨多次会话的主题学习；不确定该用哪个技能时，可通过 [ask-matt](https://github.com/x3098165384-beep/skills/blob/codex/skills/engineering/ask-matt/SKILL.md) 选择。
