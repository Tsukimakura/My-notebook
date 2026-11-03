---
title: "状态机与运算电路（FSM and Arithmetic Datapaths）"
status: draft
tags: [cs, verilog, systemverilog, lab]
created: 2026-10-08
updated: 2026-10-08
sources:
  - "~/sys1/sys1-sp26/docs/lab2-1.md"
  - "~/sys1/sys1-sp26/docs/lab3-1.md"
  - "~/sys1/sys1-sp26/docs/lab3-2.md"
  - "~/sys1/sys1-sp26/docs/lab3-3.md"
  - "~/sys1/sys1-sp26/docs/lab4-1.md"
  - "~/sys1/sys1-sp26/src/project/"
---

# 状态机与运算电路（FSM and Arithmetic Datapaths）

## 先划寄存器，再决定每个周期做什么

将算法变成电路时，先列出需要跨周期保存的值，再为它们设计输入计算与写使能。数据通路（datapath）完成计算，控制通路（control path）决定选择信号、寄存器更新和握手动作。

| 软件概念 | RTL 对应 |
| --- | --- |
| 跨步骤保留的变量 | 寄存器 |
| 一个步骤内的表达式 | 组合逻辑 |
| 多周期步骤/分支 | 有限状态机（Finite State Machine, FSM） |
| 循环次数 | 时钟更新的计数器 |
| 输入/结果交付 | 协议与握手信号 |

## FSM：状态、转移和输出

Moore 型输出仅依赖当前状态；Mealy 型输出依赖状态与输入。课程 `FSM.sv` 的输出是状态编码，`Multiplier.finish` 来自 DONE 状态，属于 Moore 风格；终值进位同时依赖 `en` 的计数器输出具有输入依赖。

下面是两段式 FSM 模板（一个状态寄存器过程、一个组合转移过程）：

```systemverilog
module WorkControl (
    input  logic clk, rst_n, start, last,
    output logic busy, finish
);
    typedef enum logic [1:0] {IDLE, WORK, DONE} state_t;
    state_t state, next_state;

    always_ff @(posedge clk or negedge rst_n) begin
        if (!rst_n) state <= IDLE;
        else state <= next_state;
    end

    always_comb begin
        next_state = state;
        case (state)
            IDLE: if (start) next_state = WORK;
            WORK: if (last)  next_state = DONE;
            DONE: next_state = IDLE;
            default: next_state = IDLE;
        endcase
    end
    assign busy = (state != IDLE);
    assign finish = (state == DONE);
endmodule
```

也可把状态转移与寄存器更新放在一个时序过程，即课程常用的一段式 FSM；只要寄存器所有权、保持行为和输出时机明确即可。若 `if (a) ... else if (b) ...`，a、b 同时有效时 a 优先，应作为规格而非偶然代码顺序。

FSM 编码（binary / one-hot）影响寄存器数量和译码深度，综合器可能重新编码。若状态输出本身是外部协议值，应明确编码和工具设置，不能依赖内部状态一定保留某种优化结果。

## 计数器、终值与 BCD 级联

模 BASE 计数器的取值为 0…BASE−1，仅在使能时更新。终值指示常写成：

```systemverilog
// 片段：cnt、BASE、en、low_co 已声明，BASE 在 cnt 范围内。
assign co = (cnt == BASE-1) && en && low_co;
```

`co` 表示**当前边沿会发生回绕**，而不是等寄存器已经清零后再通知高位。两个十进制数字使用同一个时钟：

- 个位在整体使能时加一，9 后回到 0。
- 十位的使能来自个位的 co，因此 09→10、19→20 在同一边沿完成。
- 不要把个位 co 接到十位的 `clk`；它是 clock enable，非新时钟。

`Cnt2num` 的 `INITIAL/10` 与 `INITIAL%10` 得到初始十位和个位；它还分别比较 `(BASE-1)/10`、`(BASE-1)%10`，在整体终值时同时清两位，所以 BASE=24 可以实现 00…23，而非只能计到 99。高低 `co` 用于多个数字级联。异步/同步复位及 `low_co` 与 `en` 的门控要按实际 Cnt 接口理解。

## 加法器与加减复用

一位全加器：

$$
P_i=a_i\oplus b_i,\qquad G_i=a_i b_i,
\qquad s_i=P_i\oplus c_i,\qquad
c_{i+1}=G_i\lor(P_i\land c_i).
$$

行波进位加法器（ripple-carry adder）让进位逐级传递，结构简单，延迟随位数增长。超前进位（carry-lookahead）把进位展开，如 $c_2=G_1\lor P_1G_0\lor P_1P_0c_0$，也可对多位分组计算 group propagate / generate。实际 FPGA 的 `+` 常映射专用进位链，手写门级结构不保证更快。

补码减法利用：

$$
a-b \equiv a+\overline b+1 \pmod{2^N}.
$$

```systemverilog
// 片段：W 为常量，a、b、result 为 W 位。
logic [W:0] expanded;
assign expanded = {1'b0, a}
                + {1'b0, (b ^ {W{do_sub}})}
                + {{W{1'b0}}, do_sub};
assign result = expanded[W-1:0];
assign carry = expanded[W];
```

`do_sub=0` 做加法，`do_sub=1` 翻转 b 并加一；原课程通过 FullAdder 实例链实现同一逻辑。减法时这里的 carry=1 通常表示没有借位，borrow 应取反或直接比较 a<b；signed overflow 需另外计算。

## 迭代乘法器：寄存器复用

两个 W 位 unsigned 操作数乘积要 2W 位。最直接的逐位移位加法：

1. IDLE 接收 start，令 acc=0、a_reg=零扩展被乘数、b_reg=乘数、count=0。
2. WORK 每周期检查 b_reg[0]：为 1 时 acc 加 a_reg；然后 a_reg 左移、b_reg 右移、count 加一。
3. 完成 W 次迭代后进入 DONE，输出乘积与 finish。

关键寄存器更新片段：

```systemverilog
// 片段：state 为 WORK 时执行，LAST 为 W-1。
if (b_reg[0]) acc <= acc + a_reg;
a_reg <= a_reg << 1;
b_reg <= b_reg >> 1;
count <= count + 1'b1;
if (count == LAST) state <= DONE;
```

当次加法和分支判断使用旧寄存器；最后一次 acc 更新与进入 DONE 在同一边沿完成，边沿后 finish 才有效。`src/lab4-1/Multiplier.sv` 的版本判断 `count == LEN`，有额外结束周期，不能按另一版本的周期数硬编码调用方。

### 组合乘积寄存器的优化

`lab3-3/Multiplier.sv` 把部分积高半部和待处理乘数低半部合为一个 2W 位 product。每周期：

- 检查 product[0]；若为 1，将高 W 位与 multiplicand 相加。
- **临时加法保留 W+1 位进位**，再与低半部拼接并整体右移。
- multiplicand 无需每次左移，少一组宽移位寄存器。

若遗漏临时进位位，高位乘积会出错；当 W=1 时，低半部切片 `[W-1:1]` 也需特判，不能只修计数器位宽就声称任意 W 可用。

### start-finish 协议

调用方仅在空闲时送出 start 和稳定操作数；被调用方在约定边沿采样，忙碌期间不保证接收新 start。finish 通常是一个周期的结果有效脉冲，调用方必须及时接收。start 长时间保持高电平可能在模块返回 IDLE 后再次触发计算；要约定脉冲宽度或加入 ready/busy。

这类协议适合一次一项的多周期单元。需要排队或结果背压时使用[valid-ready](06-interfaces-and-handshakes.md)。

## 滑动窗口、并行乘法与加法树

课程卷积数据通路计算窗口点积（dot product）：

$$
y=\sum_{i=0}^{N-1}x_i k_i.
$$

这里的核按数组顺序直接配对；严格数学卷积还涉及核翻转，应以具体数据布局为准。Shift 保存最近 N 个样本；每次输入握手才整体移位。数组 NBA 使各元素同时获得邻居的旧值。

N 个并行乘法器产生 N 个乘积。链式相加有 N−1 级依赖，平衡加法树（balanced adder tree）深度为 $\lceil\log_2N\rceil$：

```text
p0 ─┐
    + ─┐
p1 ─┘  │
       + ─ result
p2 ─┐  │
    + ─┘
p3 ─┘
```

完整 unsigned 和至少要 **2W + ceil(log2(N)) 位**；课程 result_t 为 2W 位时求的是截断结果。所有层应按期望宽度扩展，不能先在窄叶节点丢掉进位再在根节点扩展。

课程用堆式索引 `tree[i]=tree[2*i]+tree[2*i+1]`，generate 静态分支区分叶节点和内部节点。这不是组合环路：依赖实际指向不同元素；`/* verilator split_var */` 是工具的分析提示，不是新增硬件，更不能用它修复真实反馈。

只检查某一个并行乘法器的 finish，需要所有实例同周期启动、同样配置且固定延迟；变成不同延迟单元后应分别记录完成状态。阶段间寄存器同时保存数据与 valid，复位时清 valid，防止未完成结果被消费。

## CPU：同一套方法的组合应用

| 模块 | 关键 RTL 模式 |
| --- | --- |
| Controller | 切片 opcode/funct，组合译码，默认禁写，再选择操作枚举 |
| ALU、Cmp | case 运算选择、signed/unsigned 比较、移位宽度 |
| ImmGen | 拼接、复制符号位、字段重排 |
| RegFile | 同步写、组合读、x0 固定零 |
| DataPkg / DataTrunc / MaskGen | 字节对齐、掩码、截取与扩展 |
| PC / instruction 寄存器 | enable / stall 控制跨周期保存 |

多周期 Core2 用 **IF1 发取指请求 → IF2 等响应 → EXE 执行/发访存请求 → MEM 等访存响应**。状态跳转由握手决定，PC、写回和提交脉冲只在指令完成时推进，不能在等待期间重复执行副作用。

`src/project/Core2.sv` 与 `submit/Core.sv` 都定义 Core/MultiFSM，属于两种实现选择，不能同时加入同一编译列表。单周期 Core 假定内存及时返回，不适用于随意带延迟的总线；对齐方式和内存模型见[存储章](07-memory-fifo-and-io.md)。ISA 本身参见[理论笔记](../../theory/10-architecture-and-isa/03-risc-v-instructions.md)。
