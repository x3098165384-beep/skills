# Design It Twice

When the user wants to explore alternative interfaces for a chosen deepening candidate, use this parallel sub-agent pattern. Based on "Design It Twice" (Ousterhout): your first idea is unlikely to be the best.

Uses the vocabulary in [SKILL.md](SKILL.md): **module**, **interface**, **seam**, **adapter**, **leverage**.

## Process

### 1. Frame the problem space

Before spawning sub-agents, write a user-facing explanation of the problem space for the chosen candidate:

- The constraints any new interface would need to satisfy
- The dependencies it would rely on, and which category they fall into (see [DEEPENING.md](DEEPENING.md))
- A rough illustrative code sketch to ground the constraints, not a proposal, just a way to make the constraints concrete

Show this to the user, then immediately proceed to Step 2. The user reads and thinks while the sub-agents work in parallel.

### 2. Spawn sub-agents

Spawn 3+ sub-agents in parallel, each with a fresh context window. Each must produce a **radically different** interface for the deepened module.

向每位设计者提供实际调用方、已确认行为、现有配置与资源、项目规则、当前用户限制和可复用的调查，以及相关代码路径。设计依据 `$codebase-design` 的实际需求与职责规则，验证建议遵循它引用的测试策略。给每位设计者不同的比较重点：

- Agent 1：从调用方需要的位置、判断结果或业务操作出发，比较所需的最小接口。
- Agent 2：比较现有调用方之间已经存在的差异，判断是否确实需要不同实现或可替换依赖。
- Agent 3：沿用项目已有协作和生命周期方式，比较状态修改、恢复、引用持有与资源释放分别应由谁负责。
- Agent 4（确有外部或跨系统依赖时）：比较现有连接方式能否满足要求，明确各自边界需要的输入检查及失败、取消和迟到结果处理。

Include the relevant [SKILL.md](SKILL.md) concepts and the project's established names in the brief. Locate the glossary through [domain document locations](../domain-modeling/SKILL.md#domain-document-locations) and explain any design term needed for the decision.

方案差异以当前需求为限。只有具体调用方需要时才增加抽象、缓存、回调或扩展入口；比较时说明实际缺口与可行替代，接口数量或代码行数本身不证明设计更好。

Each sub-agent outputs:

1. Interface (types, methods, params, plus invariants, ordering, error modes)
2. Usage example showing how callers use it
3. What the implementation hides behind the seam
4. Dependency strategy and adapters (see [DEEPENING.md](DEEPENING.md))
5. Trade-offs: where leverage is high, where it's thin

### 3. Present and compare

Present designs sequentially so the user can absorb each one, then compare them in prose. Contrast by **depth** (leverage at the interface), **locality** (where change concentrates), and **seam placement**.

After comparing, give your own recommendation: which design you think is strongest and why. If elements from different designs would combine well, propose a hybrid. Be opinionated: the user wants a strong read, not a menu.
