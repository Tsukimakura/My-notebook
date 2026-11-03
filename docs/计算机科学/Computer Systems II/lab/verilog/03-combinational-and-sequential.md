---
title: "组合与时序逻辑（Combinational and Sequential Logic）"
status: draft
tags: [cs, verilog, systemverilog, lab]
created: 2026-10-08
updated: 2026-10-08
sources:
  - "~/sys1/sys1-sp26/docs/lab3-1-appendix.md"
  - "~/sys1/sys1-sp26/docs/lab3-3-appendix.md"
  - "~/sys1/sys1-sp26/src/lab3-1/submit/FSM.sv"
  - "~/sys1/sys1-sp26/src/lab3-2/submit/Cnt.sv"
  - "https://docs.amd.com/r/en-US/ug901-vivado-synthesis/Always-Procedures"
---

# 组合与时序逻辑（Combinational and Sequential Logic）

## 三种日常 RTL 写法

| 目的 | SystemVerilog | 兼容旧 Verilog | 赋值习惯 |
| --- | --- | --- | --- |
| 简单组合表达式 | `assign y = ...;` | 相同 | 连续赋值 |
| 多分支组合逻辑 | `always_comb` | `always @*` | 阻塞 `=` |
| 边沿触发寄存器 | `always_ff @(posedge clk)` | `always @(posedge clk)` | 非阻塞 `<=` |

连续赋值（continuous assignment）在输入变化时重新计算；过程赋值（procedural assignment）在过程被触发后执行。`always_comb` 会自动建立组合敏感关系并在仿真开始执行一次，工具还能检查写入约束；`always_ff` 表达时序意图。但关键字本身不能代替完整的组合赋值或正确的时钟/复位设计。工具支持见 [Vivado Always Procedures](https://docs.amd.com/r/en-US/ug901-vivado-synthesis/Always-Procedures)。

## 组合逻辑：每条路径都赋值

```systemverilog
module Mux4 (
    input  logic [7:0] a, b, c, d,
    input  logic [1:0] sel,
    output logic [7:0] y
);
    always_comb begin
        y = '0;
        case (sel)
            2'd0: y = a;
            2'd1: y = b;
            2'd2: y = c;
            2'd3: y = d;
            default: y = '0;
        endcase
    end
endmodule
```

- 默认值放在过程开头，分支覆盖需要改变的值；每个输出、每个中间变量都要覆盖。
- `if / else if / else` 从上到下具有优先级；`case` 也选择首先匹配的分支。
- 普通 `case` 是四态精确匹配；`case (1'b1)` 把分支表达式当条件，课程 Controller 用它组织译码优先级。
- `casez` 可将 Z/`?` 用作通配符，`casex` 还把 X 当通配符，RTL 译码应谨慎使用。
- 不要手写遗漏信号的 `always @(a or b)`；后续表达式加了 c 却没更新敏感列表，会使仿真与综合不一致。

### 锁存器与组合环路

```systemverilog
// 反例：en 为 0 时没有赋值，y 必须记住先前的值。
always_comb begin
    if (en) y = a;
end
```

这是电平敏感存储的意图，会产生锁存器（latch）或工具诊断。用 `else y = b;` 或事先默认赋值可得到 mux。组合块中 `q = q + 1;` 也不能用来构造计数器，它引入反馈；应使用时钟寄存器。

**遗漏赋值导致锁存，未被寄存器隔开的循环依赖导致组合环路（combinational loop），两者不同。** 组合地址计算本身不会导致锁存器，只有未完整赋值、错误依赖等才会。框架 VGA_Debugger 的分支中应特别检查 `vram_waddr` 等输出是否在 default 路径也赋值。

## 时序逻辑：复位、使能、保持

```systemverilog
module RegisterEn #(
    parameter int unsigned W = 32
) (
    input  logic clk, rst_n, en,
    input  logic [W-1:0] d,
    output logic [W-1:0] q
);
    always_ff @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            q <= '0;
        else if (en)
            q <= d;
    end
endmodule
```

边沿触发块中省略最后的 `else` 表示 **保持寄存器原值**，对应使能（clock enable），不会因为这一省略产生锁存器。条件顺序同时定义优先级：上例复位优先于使能。

| 复位形式 | 敏感事件与条件 | 何时生效 |
| --- | --- | --- |
| 同步低有效 | `@(posedge clk)`，`if (!rst_n)` | 仅有效时钟边沿 |
| 异步低有效 | `@(posedge clk or negedge rst_n)` | 时钟边沿，或复位拉低时 |
| 异步高有效 | `@(posedge clk or posedge rst)` | 时钟边沿，或复位拉高时 |

`rst_n` 的名字不能证明它是异步复位，必须读敏感事件。课程 FSM 用异步低有效复位，Cnt 用同步低有效复位，乘法器示例又有高有效复位，连接时要逐项核对。异步复位释放需满足时序要求，跨域复位常使用各域“异步置位、同步释放”（asynchronous assertion, synchronous deassertion）方案。

不要给同一寄存器同时配置两个普通时钟，或在两个过程分别写入。通过 `if (en)` 控制更新，优于用 `clk & en` 临时构造门控时钟。

## 阻塞与非阻塞：右边取什么值

阻塞赋值（blocking assignment）`=` 执行时立即更新目标，后续语句看到新值。非阻塞赋值（nonblocking assignment, NBA）`<=` 执行时计算右侧，把更新安排到该时间步的 NBA 阶段；后续语句通常仍读到旧寄存器值。

```systemverilog
// 片段：每个时钟沿，a 得到输入，b 得到 a 的旧值。
always_ff @(posedge clk) begin
    a <= in_data;
    b <= a;
end
```

这是两级寄存器链。若改成 `a = in_data; b = a;`，同一过程内 b 会读到刚更新的 a；若不同过程也读 a，还可能因调度顺序发生竞态（race）。

| 时钟沿前 | 当次 RHS 求值 | NBA 更新后 |
| --- | --- | --- |
| a=3，b=7，in_data=9 | a 的新值=9；b 的新值=3 | a=9，b=3 |

### 同一过程不是“所有语句都无序”

```systemverilog
// 片段：en 为 1 时，最后一条被执行的赋值获胜。
always_ff @(posedge clk) begin
    q <= '0;
    if (en) q <= d;
end
```

同一过程对同一变量的多次 NBA，按执行顺序，最后一次有效赋值决定结果；跨过程多驱动不应依靠调度顺序设计。

```systemverilog
// 反例：不是逐项累加；循环每次 RHS 仍读取旧 sum。
for (int i = 0; i < 4; i++) sum <= sum + data[i];
```

组合累加应先用阻塞赋值计算临时结果，再在时序块中一次性 `sum <= next_sum;`。移位数组则适合 NBA：`data[i] <= data[i+1]` 让每个元素都取邻居的旧值，不会依次覆盖源数据。

不要在同一组合块中先读取某个临时量，后才给它赋值：

```systemverilog
// 推荐依赖顺序：先定义中间量，再消费它。
always_comb begin
    tmp = a + b;
    y = tmp ^ mask;
end
```

## 寄存器边界与物理时序

组合逻辑必须在下一个采样边沿前稳定。建立时间（setup time）是边沿前数据需稳定的时间；保持时间（hold time）是边沿后需稳定的时间；余量（slack）是“要求到达时间 − 实际到达时间”，**slack 不是 setup time**。

忽略时钟偏斜时，一条寄存器到寄存器路径需满足：

$$
T_{\mathrm{clk}} \ge t_{\mathrm{clk\to Q}} + t_{\mathrm{comb,max}} + t_{\mathrm{setup}}.
$$

RTL 仿真中的 `#5` 时钟不证明硬件能在 200 MHz 工作；综合后还需静态时序分析（Static Timing Analysis, STA）。运算链过长可以分级插入寄存器，但这样会增加延迟（latency），并要求控制信号和数据一起延迟。

下一章讲[参数化与数据组织](04-parameterization-and-data-types.md)，状态与数据如何逐周期协作见[状态机与运算电路](05-fsm-and-arithmetic.md)。
