# 示例：直接翻译代码

假设已读取实际定义，知道 `actions` 是整组动作、`_step` 是当前索引。讲解正文如下。

```csharp
var action = actions[_step];
```

用变量 `action` 保存当前动作。

```csharp
_hasPath = action.path != null;
```

当前动作有路径，就把 `_hasPath` 设为 `true`；否则设为 `false`。

```csharp
if (_hasPath && !PreparePath(action)) return false;
```

如果有路径，但准备失败，就返回 `false`。

## 编写时核对

翻译跟随真实代码：`action` 保存当前一项，不是整个列表；条件中的否定表示准备失败，不是成功后返回 `true`。代码已在块中展示，说明中只保留理解所需的名称。

需要说明失败后由谁取消时，先读取调用处，再在相关步骤补一句。需要演算时另举明确标为假设的例子，不把例子或语法说明固定追加到每一步。
