# Chanigng VM 出题

> 好像写的有点多……因为出题的时候不是线性的思路，所以各种地方有点串乱了23333

## 1. 出题目标

先根据自己熟悉程度确定了 native 层用 Linux x86-64 ，C 语言实现。

设想的难度不高，但总不能被 agent 秒了。首先希望静态调试受到较大的限制，可能通过动态加/解密指令或者打 ud2 之类的方式。

于是 Changing VM 的第一个 Changing 就出来了：分块加密 VM，通过上一块得到下一块的密钥，构造密钥链。

VM 本身的结构也不能太简单，不然 agent 调个 gdb 也能秒……

我主要希望实现的是让解题者因为尚未找到正确的抽象而受阻，一旦找到，分析量就能明显下降。

## 2. 整体结构设计

最初的整体构想是：

```text
ELF 壳
    ↓
Bootstrap VM
    ↓
运行时生成 ISA
    ↓
滚动解密 Verifier VM
    ↓
输入校验
```

但这样解题者脱壳、分析 Bootstrap 等等半天到不了 VM，有点违背这道题以 VM 结构为核心的思想了。

所以设计过程中做了简化：

1. 把两套完全不同的 VM 改成一套分两个阶段；
2. 不让每条 VM 指令的语义都随状态变化，只按基本块改变编码；
3. 取消 native 壳，只保留加密的 IR 和转码的模块。

最终结构变为：

```text
普通 ELF 入口
    ↓
VM 初始化和第一个块密钥
    ↓
两个 Bootstrap VM 块
    ↓
输入加载块
    ↓
六个 Verifier 块
    ↓
两个比较块
    ↓
HALT
```

其实凑出这个比较详细结构还早，但先贴在这个部分吧）

## 3. VM 状态模型设计

比较常见的寄存器 VM，感觉比较简单且没有新意，栈 VM 感觉有点丑陋（x）。和 AI 探讨了一下给我了一个什么“旋转坐标系寄存器 VM”，大概就是把一个逻辑寄存器用两个物理槽经过运算表示。这样调试的时候就不会存在单独的真实寄存器值，但我感觉者有点困难，~~怕自己做不出~~就算了）。

后面又看到一个方案，大致来讲就是逻辑寄存器和物理槽的映射动态变换。这样在调试的时候应该是能看到一些值只是改变了存储位置，从而推断出映射关系，感觉不错，就用这个了（

于是第二个 Changing 就有了： VM 逻辑值和物理槽映射的改变

确定下来逻辑上有八个“寄存器”（GUARD 记录反调试状态，TRANSCRIPT 是摘要，可以看作是由当前执行过的指令决定的状态，影响不同块间的跳转逻辑，剩下的 R* 就是正常的逻辑寄存器）：

```text
R0 R1 R2 R3 R4 R5 GUARD TRANSCRIPT
```

物理上有八个 64 位的槽：

```text
P0 P1 P2 P3 P4 P5 P6 P7
```

每个基本块都有独立置换。例如某块为：

```text
R0         → P3
R1         → P7
R2         → P0
R3         → P5
R4         → P2
R5         → P6
GUARD      → P1
TRANSCRIPT → P4
```

下一个块中，所有角色迁往新槽。

解题者一旦恢复每块的映射（考虑方便性和难度，把映射和解密的块设为相同的），就可以把整个 trace 归一化成稳定的 `R0～R5`。

## 4. 指令语义设计

一度考虑过融合指令，例如：

```c
dst += rol64((src ^ imm1) * imm2, rotation);
```

一个是我要花一些经历封装一些很复杂的 handler，一个是解题者要花半天理解这些复杂的 handler，其实并没有 VM 核心上的区别。所以就按照传统的 CPU 语义了……

最终保留 15 种普通语义：

```text
MOV
MOVI
LOAD
STORE
ADD
SUB
XOR
OR
AND
MUL
ROL
ROR
XCHG
NEXT
HALT
```

Bootstrap 的两个块使用了 verifier 用不到的 `STORE`、`SUB`、`ROR`、`MUL`、`AND` 等指令，所有 handler 都有用到。

> 调度器采用 GCC 的 labels-as-values 扩展，AI 说是没有整齐的函数边界……不是很懂，感觉和 switch 差不多，应该和核心的 VM 关系不大……没有做控制流平坦化同样是因为感觉后面各种加料怕难度失控）

## 5. 动态 opcode 的方案选择

本来考虑的是从 `AT_RANDOM` 取得进程随机材料，使每次运行的 opcode 映射、立即数编码和 VM 字节码都不同。这就得让人在一个进程内完成 trace，或者先 patch 调随机种子。有被恶心过不想搞）

为了控制难度，最后改成了固定种子，运行时生成。每次执行的结果完全相同，但 VM 字节码还是不直接存在 ELF 文件里。

每块从以下状态产生 opcode 种子：

```text
current block key
storage slot
block nonce
opcode domain constant
```

然后对 `0～255` 做 Fisher–Yates 置换（就是某种随机打乱数组的算法），取前 15 个不同字节作为真实 opcode 编码。调度表有 256 项：

```text
15 项 → 真实 handler
其余 → 共享 invalid handler
```

每进入一个新块就覆盖调度表，因此内存中不会同时存在所有块的 opcode 映射合集。不过当前块的映射是可以 dump 的，预期解就是解题者分块 dump 出来找到映射关系。

## 6. 规范 IR、运行时指令与块生命周期

每个 VM 块在生命周期中有三种形态：

```text
磁盘：加密规范 IR
    ↓
临时区：明文规范 IR
    ↓
执行区：当前块专用的 64 位运行时指令
```

任意时刻只处理一个块。转码结束后擦除规范 IR，执行完成后再覆盖运行时指令和常量池。

每条规范指令固定 16 字节：

```c
struct canonical_insn {
    uint8_t  opcode;
    uint8_t  mode;
    uint8_t  dst_role;
    uint8_t  src_role;
    uint8_t  aux;
    uint8_t  reserved[3];
    uint64_t immediate;
};
```

规范 IR 引用逻辑角色，而不是物理槽。例如：

```text
XOR R0, R4
```

运行时指令布局为：

```text
bits  0..7   当前块编码后的 opcode
bits  8..10  destination physical slot
bits 11..13  source physical slot
bits 14..15  operand mode
bits 16..23  rotation / width / auxiliary
bits 24..39  constant-pool index or memory offset
bits 40..63  transcript material
```

这是 AI 设计的，看看基本上就是常见的 RISC 换换位置， transcript 是叠加了当前执行过的指令的摘要，也算是一个状态，这么一来就能方便的看成一个有限状态机了。有意思……

64 位立即数放入当前块的临时常量池。这样运行时指令保持固定 8 字节，调试时不会出现变长指令失步问题。

高 24 位参与 transcript。相同语义的指令在不同块中转码的结果也不一样。粗暴 patch 指令会影响下一块密钥。

## 7. 短暂映射与实体操作数

设计时考虑过几种寄存器映射可见度：

1. context 中持久保存 `logical_to_physical[8]`；
2. 每条指令执行时动态查表；
3. 转码时把逻辑操作数改成物理槽，之后擦除完整映射。

方案一过于容易，一次 dump 即可解决。方案二虽然看起来更难，但公共查表点反而能被一次 hook 捕获所有逻辑操作数。

最终采用第三种：

```text
规范：ADD R0, R2
当前映射：R0 → P3，R2 → P7
运行时：ADD P3, P7
```

dispatcher 执行期间只看物理槽。完整映射只在 `NEXT` 中短暂存在。

唯一长期保留的锚点是当前 `TRANSCRIPT` 所在槽，因为每次取指都必须更新它。保留这个锚点是刻意的难度控制：解题者可以先识别 transcript，再以此理解 `NEXT` 的迁徙过程。

## 8. `NEXT` handler

`NEXT` 负责：

1. 使用当前最终 transcript 派生下一块密钥；
2. 解密下一规范块；
3. 重新生成当前角色映射；
4. 从下一块 key、slot 和 nonce 生成新映射；
5. 原地迁徙八个角色；
6. 重置新块 transcript；
7. 生成新 opcode 表；
8. 转码下一块；
9. 擦除临时数据；
10. 把 PC 设为零并继续调度。

~~虽然一股 AI 味但我觉得这很清晰（）~~

## 9. transcript 与滚动密钥链（更细致）

每执行一条运行时指令：

```c
T ^= instruction_word;
T = rol64(T, 13);
T += 0x9e3779b97f4a7c15;
```

`NEXT` 本身也先进入 transcript，再执行 handler。

下一块密钥为当前 key、最终 transcript、当前 slot 和下一 slot 的混合：

```text
K[i+1] = Mix(K[i], transcript, current_slot, next_slot)
```

transcript 只依赖执行的指令字，不依赖寄存器运算结果。

- 正确和错误 flag 执行相同的块序；
- 任意输入都能采集完整 trace；
- flag 不会把选手带入错误解密路径；
- patch、跳过指令或错误模拟会破坏下一块 key。

如果把 flag 数据也混入 transcript，错误输入会导致后续块无法解密，先有正确 flag 才能看到 verifier，先看到 verifier 才能得到 flag，没法分析。

这一点也有反侧信道的作用。对于所有长度正确的输入，块顺序、opcode 映射、执行指令数和块 key 等等都完全相同。解题者很难通过测信道攻击漏 flag。

## 10. 块加密确定

本来考虑了考虑 XTEA-CTR 或 ChaCha，依旧觉得没必要，主要是思维逻辑，不考察密码分析。所以最后使用 SplitMix64 风格状态生成 64 位 XOR 密钥流：

```text
stream_state = derive(block_key, storage_slot, STREAM_DOMAIN)
plaintext_word = ciphertext_word XOR next_stream_word()
```

主要是为了保证没有正确块 key 时明文不会直接出现，加密反而不重要。

每个明文块末尾有 64 位 checksum，用于判断 key 或数据是否错误。校验失败统一返回 `Wrong`，不故意制造崩溃。个人感觉有点阴的反调试hhh

## 11. 校验算法确定

考虑过把 flag 字节作为图节点，用动态生成的关系连接：

```text
S(flag[a] + flag[b]) XOR flag[c] = constant
```

预期解法是恢复图并从锚点传播。但最后应该是丢给 Z3，或者加点 S-box 之类的变成求解器对抗……

还和 AI 讨论出了各种神奇的方法，最后还是简化成了六轮完全相同的标准 Feistel。校验算法不作为这道题的主要难点。

## 12. flag 的自然装载方式

设定 flag 是：

```text
flag{75uk1m4kur4_Qq_2889908070}
```

居然恰好有 31 个可见字节，添加 C 字符串结尾的 `\0` 后正好是 32 字节），可以直接解释为四个小端序的 qword：

```text
R0 = "flag{75u"
R1 = "k1m4kur4"
R2 = "_Qq_2889"
R3 = "908070}\0"
```

native 层只检查输入去掉换行后是否为 31 字节，然后把完整 32 字节交给 VM。

## 13. 六轮标准 Feistel

和 VM 关系不大就跳过了……写太多了

## 14. 反调试方案确定

前面也提到了一点，最后是选择在两个地方，程序两次读取 `/proc/self/status` 中的 `TracerPid`（第一次在 VM 初始化前，第二次在第三个 Feistel 块结束后的 `NEXT` 中）

结果更新逻辑角色 `GUARD`。检测到调试器时程序不会退出、崩溃，也不改变块解密、opcode、迁徙或 Feistel 运算。

第四个目标字的比较写成：

```text
R4 = GUARD
R4 ^= expected_normal_guard
R4 ^= target[3]
R4 ^= R3
R5 |= R4
```

正常状态下前两个 guard 值相等，其差为零；被调试时差值非零，最终结果为 `Wrong`。

虽然有点阴，但调试的时候也能跑通正常的逻辑，不是直接崩，关键就还是发现这个反调试，patch 掉 `TracerPid` 或恢复正常 guard 后再继续。

## 15. 十二个基本块

真实执行顺序共 12 个块：

```text
0  bootstrap_0
1  bootstrap_1
2  load_input
3  feistel_0
4  feistel_1
5  feistel_2
6  feistel_3
7  feistel_4
8  feistel_5
9  compare_01
10 compare_23
11 halt
```

它们在文件中的 storage slot 被固定打乱，当前构建的执行槽顺序是：

```text
3 → 0 → 10 → 8 → 6 → 11 → 9 → 5 → 4 → 2 → 1 → 7
```

文件目录只暴露每个 slot 的 offset 和密文长度，不生成假块、重叠块或无意义目录项。

两个 Bootstrap 块执行普通算术、内存读写和迁徙，随后输入块覆盖业务寄存器。业务结果真正的作用是建立初始密钥链并覆盖全部 handler 类型。

> 剩下的设计方面的基本都和 VM 的关系不大了，就不写了……

## 16. 预期解题思路

### 一：找到 dispatcher

从动态间接跳转和 256 项表识别 dispatcher。在共享取指点记录：

- 当前 64 位指令字；
- PC；
- 目标 handler 地址；
- 八个物理槽；
- 常量池。

通过观察 handler 的普通 native 运算，可以较容易地把地址命名为 `MOV`、`ADD`、`XOR`、`ROL` 等。

### 二：发现 opcode 表每块变化

同一个 encoded opcode 在下一块可能跳向不同 handler。要按块记录映射。

### 三：恢复映射

原始 trace 中，Feistel 轮看起来不会重复，因为同一逻辑寄存器每轮都位于不同槽。观察 `NEXT` 前后值的守恒和原地置换环后，选手恢复每块 `role → physical slot` 映射。

编写归一化 tracer 后，类似：

```text
XOR P6, P3
```

会被提升成：

```text
XOR R0, R4
```

### 四：识别六轮 Feistel

归一化后，六个块呈现完全相同的结构，只是常量不同。此时不需要进一步理解 VM 密钥链即可解决校验算法。

### 五：处理反调试

如果直接在 GDB 下采集，第四个目标比较包含非零 guard 差值。可以：

- patch `TracerPid` 解析结果；
- 在读取 `/proc/self/status` 后修改返回值；
- 恢复正常 guard；
- 对比 native 运行和 traced 运行。

反调试修复后得到四个 qword。

### 六：逆 Feistel 解密

就能得到 flag 了……
