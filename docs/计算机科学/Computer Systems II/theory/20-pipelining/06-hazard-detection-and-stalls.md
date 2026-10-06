---
title: "冒险检测、前递条件与停顿"
status: draft
tags: [cs, computer-systems, pipelining, hazard-detection]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "lec03-2026.pdf，第 76–85 页（§3.4）"
  - "course_86797_sub_2036297/course_content.md，86:47–96:31"
  - "Cornell CS 3410，2019 Spring pipeline notes，load-use stall"
---

# 冒险检测、前递条件与停顿

[课程目录](../../index.md) · [上一章：冒险处理](05-hazards-and-handling.md)

冒险检测单元根据在途指令的源、目的寄存器和控制信号判断数据是否可用，再决定前递选择或停顿动作。本章以顺序执行的五级流水线为模型，分析检测条件与状态更新。

## 1. 检测的是在途指令的编号和控制

流水线同时有多条指令；比较哪个源、哪个目的，应按指令的阶段归属，而不是只比较当前取指的机器码。

| 字段 | 所属指令 | 用途 |
| --- | --- | --- |
| ID/EX.rs1、rs2 | 当前将进入/处于 EX 的消费者 | 选择执行输入 |
| EX/MEM.rd | 比消费者老一条的生产者 | 优先前递来源 |
| MEM/WB.rd | 更老的生产者 | 次优前递来源 |
| EX/MEM.RegWrite、MEM/WB.RegWrite | 对应生产者的写使能 | 排除 store、branch 等不写寄存器的指令 |
| IF/ID.rs1、rs2 | 当前 ID 指令 | 检测是否须推迟进入 EX |
| ID/EX.MemRead | 当前 EX 指令是 load | 检测其加载值尚未可用 |

名称中的斜线表示**流水寄存器边界**。EX/MEM 中的 rd 不是 MEM 阶段当前译码出来的 rd，而是之前从原指令一路保存下来的目的编号。

## 2. RAW 匹配的基本条件

以 EX/MEM 向 EX 的第一个操作数前递为例：

$$
H_A=EX/MEM.RegWrite
\land(EX/MEM.rd\ne 0)
\land(EX/MEM.rd=ID/EX.rs1)
$$

第二个源把 rs1 换成 rs2。

三个条件分别保证：

- 生产者**真的会写**寄存器。
- 目的不是恒为零的 x0；对 x0 的写入不会改变消费者应读取的零。
- 消费者所需的寄存器恰好是这个生产者的目的。

仅有 rd 等于 rs1 不够。例如 store 的指令位中部分立即数可能占据通常的 rd 位置，但它并不写 GPR；立即数指令的部分编码也不能当成实际使用的 rs2。

实际电路应结合译码产生的 uses_rs1、uses_rs2 或等效条件，避免把非源字段误当源操作数。对标准指令子集，课件常省略这些细节。

**匹配说明有数据相关，不必然说明必须停顿。** 若结果已经可用且存在旁路，可以前递；否则才需要等待。

## 3. 前递选择器与优先级

课件风格的编码可以定义为：

| ForwardA / ForwardB | 选择 |
| --- | --- |
| 00 | ID/EX 保存的寄存器堆读数 |
| 10 | EX/MEM 可前递结果 |
| 01 | MEM/WB 的最终写回值 |
| 11 | 未使用 |

编码由实现决定，不是 ISA 的组成部分。分别对 A 和 B 做判断；ALUSrc 选择立即数还需要与寄存器旁路配合，store data 可使用独立的旁路选择器。

### 3.1 为什么 EX/MEM 优先

~~~asm
add x1, x2, x3
sub x1, x1, x4
and x5, x1, x6
~~~

and 的 x1 应来自 sub，而不是 add。某周期中 EX/MEM 与 MEM/WB 可能同时有 rd=x1；EX/MEM 对应的 sub 更年轻，是消费者之前的**最近有效写者（Most Recent Producer）**，应优先。

~~~text
for each genuinely used EX operand src:
    if EX/MEM.RegWrite and EX/MEM.rd != 0 and EX/MEM.rd == src:
        if EX/MEM.result_is_available:
            select EX/MEM result
        else:
            operand is not ready; arrange a stall
    else if MEM/WB.RegWrite and MEM/WB.rd != 0 and MEM/WB.rd == src:
        select MEM/WB writeback value
    else:
        select the register value saved in ID/EX
~~~

关键是**先选语义上最近的生产者，再看它是否已就绪**。若最近的写者是 load，不能因为它尚未有数据，就退而使用更老的同名寄存器结果。

### 3.2 Load 的地址不是加载值

普通 ALU 指令经过 EX 后，EX/MEM.ALUResult 就是待写回值。load 经过 EX 后，该字段只是有效地址，加载值仍要到 MEM 才出现。

~~~asm
ld  x1, 0(x2)
add x3, x1, x4
~~~

若把 EX/MEM.ALUResult 无条件前递给 add，实际会用地址代替内存数据。标准流水线用 load-use 检测推迟 add；之后从 MEM/WB 的 load 数据前递。完整实现还要统一处理链接地址等其他写回来源。

## 4. Load-use 停顿条件

在 ID 判断：当前 EX 是 load，它的 rd 是否被当前 ID 指令在**下一周期 EX**需要？

令 uses_rs1_EX、uses_rs2_EX 表示该指令确实需要相应寄存器值，而且需要在 EX 可用：

$$
\begin{aligned}
Stall={}&ID/EX.MemRead \\
&\land(ID/EX.rd\ne 0)\\
&\land\big[
(IF/ID.uses\_rs1\_EX\land ID/EX.rd=IF/ID.rs1)\\
&\qquad\lor
(IF/ID.uses\_rs2\_EX\land ID/EX.rd=IF/ID.rs2)
\big]
\end{aligned}
$$

课件常用省略使用标志的简式：

~~~text
ID/EX.MemRead
and (
    ID/EX.rd == IF/ID.rs1
    or ID/EX.rd == IF/ID.rs2
)
~~~

理解概念时可用简式；实现与严谨判断需排除 x0、不实际读取的源字段，并按使用阶段处理 store/branch。

| ID 指令 | 哪些寄存器通常在 EX 需要 |
| --- | --- |
| R 型 ALU | rs1、rs2 |
| 立即数 ALU / load | rs1 |
| store | 基址 rs1；store data 的期限取决于旁路结构 |
| EX 比较的 branch | rs1、rs2 |
| jal | 无 GPR 源 |
| jalr | rs1，若该实现的目标在 EX 计算 |

若分支提前在 ID 比较，就要另外检测 ID 的数据可用性；不能直接用“下一周期 EX 前递可得”保证当前 ID 已得到值。

## 5. 停顿动作：冻结前端，放行较老指令

在标准五级流水线中，发生 load-use 冒险时，通过以下动作推迟阻塞在 ID 的消费者：

~~~text
PCWrite = 0                 # PC 保持
IF/IDWrite = 0              # ID 指令保持
ID/EX.next_control = 0      # 下一拍 EX 插入无副作用气泡

EX/MEM、MEM/WB 正常更新     # 较老指令继续推进
~~~

与清零控制等价的实现是向 ID/EX 注入 valid=0。使数据字段全部变成零不是必要条件；使无效指令无法产生副作用才是目的。

### 5.1 为什么不能冻结全部流水寄存器

阻塞原因是 load 数据尚未产生。若连 load 也冻结在 EX，它无法到 MEM 读取数据，消费者永远等不到结果。必须让生产者前进，只保留需要等待的消费者与更年轻的前端状态。

### 5.2 为什么清零的是下一拍 ID/EX

~~~text
EX：load，需要正常进入 MEM
ID：consumer，需要暂时留在 ID
~~~

在时钟边沿，load 应正常写入 EX/MEM；consumer 不进入有效 EX，故让 ID/EX 获得气泡。

**不能清除本应承载 load 的 EX/MEM。** 那会丢掉生产者，破坏程序。课件第 80–82 页关于清除“EX/MEM register”的文字，结合其 IF/ID 保持与 ID 指令等待的意图，应更正为清空 **ID/EX 的下一拍控制**。也要区分“清零 EX、MEM、WB 三组控制”与“清零名为 EX/MEM 的寄存器”。

此处动作与标准教材的 load-use 停顿相同，可参照 [Cornell CS 3410 流水线课件中 load-use stall 部分](https://www.cs.cornell.edu/courses/cs3410/2019sp/schedule/slides/07-pipeline-notes.pdf)。

### 5.3 逐拍追踪

| 周期 | load 所在阶段 | consumer 所在阶段 | EX 中是否有气泡 |
| --- | --- | --- | --- |
| C3 | EX | ID，检测依赖 | 否，EX 是有效 load |
| C4 | MEM | ID，保持一拍 | 是 |
| C5 | WB | EX，使用前递 | 否 |
| C6 | 完成 | MEM | 气泡已经向后传播 |

停顿一拍不表示 consumer 在 ID 的计算必须做两次架构动作。ID 的组合译码可重复，架构副作用应由有效控制只执行一次。

## 6. 与无前递模型区分

如果没有前递，ID 中的消费者一般要等所有相关较老写者完成 WB。因此检测范围可能包含 ID/EX、EX/MEM，以及在不能当周期先写后读时的 MEM/WB。

这与带前递模型“只对尚不可及时旁路的 load-use 插入一拍”不同。套错检测规则会得到过多停顿，或漏掉真实依赖。

同样，stall 不是一种 ISA 指令。它是实现保持状态的动作；编译器显式插入 nop 是软件安排的无操作指令，硬件插入 bubble 则不一定对应实际存储器中的指令。

## 7. 同时有停顿与冲刷时

控制冒险可能要求取消错路径，数据冒险可能要求保留等待者。若某条等待者已经被更老分支证明属于错路径，必须取消它，不能因 stall 保留一个本应失效的指令。

具体优先级取决于重定向阶段和设计，但应满足：

- 已决定的正确 PC 重定向不能被无关的前端冻结永久阻挡。
- 较老的有效指令继续完成。
- 被冲刷的指令不能产生架构副作用。
- 确实应执行而数据未就绪的指令得到保留。

异常、缓存等待和多来源重定向还需要独立的优先级设计；上述规则针对五级流水线中的数据等待与分支冲刷。

## 8. 自测

**题 1：**EX/MEM.rd 与 ID/EX.rs1 相等，为什么仍需看 RegWrite？

因为 rd 位相同不代表这条指令写寄存器。store、branch 不应被当成生产者。

**题 2：**两级都匹配同一个源，选哪个？

先选最近的有效写者，通常是 EX/MEM；若它的结果未就绪，等待，不能改用更老的 MEM/WB 值。

**题 3：**load-use 停顿时 load、消费者、下一条分别怎样？

load 前进到 MEM；消费者留在 ID；PC 与 IF/ID 保持；下一拍 EX 是气泡。

**题 4：**为什么加载到 x0 后读 x0 不构成寄存器 load-use？

x0 始终为零，load 不会产生供后续寄存器读取的新值。但该 load 仍是访存指令，不能因此声称访问、异常等行为被取消。

**英文简答：**“The hazard detection unit freezes the PC and IF/ID register and inserts a bubble into ID/EX, while allowing the load and older instructions to advance.”

## 参考资料

- `lec03-2026.pdf`，§3.4、第 76–85 页；第 5 份授课文本最后约 10 分钟。
- [Cornell CS 3410，Pipeline Notes](https://www.cs.cornell.edu/courses/cs3410/2019sp/schedule/slides/07-pipeline-notes.pdf)：核对 load-use 的寄存器位置和停顿动作。
