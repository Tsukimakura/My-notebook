---
title: "前置复习：数据通路修改与性能分析"
status: draft
tags: [cs, computer-systems, architecture, performance, review]
created: 2026-11-03
updated: 2026-11-03
sources:
  - "个人系统 I 期末复习手稿，第 2 页"
  - https://www.cs.cornell.edu/~bindel/nmds/00-Background/02-Performance.html
---

# 前置复习：数据通路修改与性能分析

[前置复习目录](index.md) · [上一章](02-constants-and-calls.md) · [下一章：逻辑与浮点](04-logic-and-floating-point.md)

## 1. 修改数据通路的四步法

给现有 CPU 增加指令时，先从指令效果出发，再考虑连线与编码：

1. **写 RTL 语义（register-transfer-level semantics）**：读取什么，计算什么，最后更新哪些寄存器/内存/PC。
2. **对照当前数据通路（datapath）**：每个所需值是否存在，能否到达目的端，当前周期是否可用。
3. **补充 MUX、线路或运算单元**：增加新来源时通常扩展输入选择；运算资源不够时再增设硬件。
4. **列控制信号及取值**：包括选择、使能、ALU 操作、立即数类型、访存宽度和下一 PC。

RTL 中的箭头表示架构状态更新，不是按书写顺序逐条执行的软件语句。例如 jal/jalr 的目标与链接地址都由更新前的值计算。

### 先写出每类指令的状态变化

下表假设 32 位指令，顺序下一 PC 为 P+4，P 是当前指令地址，所有运算按 XLEN 截断：

| 指令 | 主要 RTL 效果 |
| --- | --- |
| `add rd,rs1,rs2` | R[rd]←R[rs1]+R[rs2] |
| `addi rd,rs1,imm` | R[rd]←R[rs1]+sext(imm12) |
| `ld rd,off(rs1)` | EA←R[rs1]+sext(off12)；R[rd]←Mem64[EA] |
| `sd rs2,off(rs1)` | EA←R[rs1]+sext(off12)；Mem64[EA]←R[rs2] |
| `beq rs1,rs2,label` | R[rs1]=R[rs2] 时 PC←P+Bimm，否则 P+4 |
| `jal rd,label` | R[rd]←P+4；PC←P+Jimm |
| `jalr rd,off(rs1)` | R[rd]←P+4；PC←(旧 R[rs1]+sext(off12)) & ~1 |
| `lui rd,imm20` | R[rd]←sext32(imm20<<12) |
| `auipc rd,imm20` | R[rd]←P+sext32(imm20<<12) |

写 R[0] 被忽略。load 的符号/零扩展、store 的字节掩码应随访问宽度补进规格，不能把所有访存都视为 64 位。

## 2. 用语义填写控制表

下面明确采用一个**单周期示例结构**：独立 PC+4 加法器；主 ALU 可选 A=rs1/PC/0、B=rs2/imm；分支另有比较器；写回可选 ALU/内存/PC+4；jalr 的目标路径可清最低位。

| 指令类 | RegWrite | MemRead / MemWrite | ALU A / B | ALU 操作 | 写回来源 | 下一 PC |
| --- | --- | --- | --- | --- | --- | --- |
| R 型 ALU | 1 | 0 / 0 | rs1 / rs2 | 按 funct 译码 | ALU | PC+4 |
| I 型 ALU | 1 | 0 / 0 | rs1 / I-imm | 按 funct 译码 | ALU | PC+4 |
| load | 1 | 1 / 0 | rs1 / I-imm | ADD | 内存 | PC+4 |
| store | 0 | 0 / 1 | rs1 / S-imm | ADD | — | PC+4 |
| branch | 0 | 0 / 0 | PC / B-imm | ADD | — | taken 时 ALU，否则 PC+4 |
| jal | 1 | 0 / 0 | PC / J-imm | ADD | PC+4 | ALU |
| jalr | 1 | 0 / 0 | rs1 / I-imm | ADD | PC+4 | ALU & ~1 |
| lui | 1 | 0 / 0 | 0 / U-imm | ADD | ALU | PC+4 |
| auipc | 1 | 0 / 0 | PC / U-imm | ADD | ALU | PC+4 |

“—”表示该来源不会被消费，但写使能必须明确为 0。表中用信号含义而非任意二进制编码；映射到题目的实际 MUX 编码时再填 0/1/多位选择值。RegWrite=1 也不改变 x0 恒为零的规则。

**控制信号取决于结构。**若原图用主 ALU 做 beq 的减法比较、另设分支目标加法器，则 beq 的 ALU 输入应为 rs1/rs2、操作为 SUB；不能直接照抄本表的 PC/B-imm。

### 例：增加 jalr

从 `PC_next=(R[rs1]+imm)&~1` 和 `R[rd]=P+4` 反推：

- ALU 若已有 load/store 的地址加法，可复用 rs1+I-imm。
- PC 输入 MUX 增加寄存器间接目标路径，并清 bit 0。
- 写回 MUX 增加 PC+4 来源；若已支持 jal，可复用。
- 控制器增加 jalr 译码，选 ADD、I-imm、PC+4 写回及间接跳转；禁止数据存储器读写。
- 检查目标路径延迟；增加 MUX 可能拉长关键路径（critical path），不能只检查逻辑功能。

流水化之后，这些控制值还必须随所属指令逐级保存，见[流水线控制信号](../20-pipelining/04-pipelined-control.md)。

## 3. CPU 时间与 CPI

性能（performance）通常与执行时间成反比：

$$
T_{\mathrm{CPU}}
=IC\times CPI\times T_{\mathrm{clk}}
=\frac{IC\times CPI}{f_{\mathrm{clk}}}.
$$

| 量 | 英文与含义 | 单位 |
| --- | --- | --- |
| IC | instruction count，实际执行的动态指令数 | instruction / program |
| CPI | cycles per instruction，平均每条指令周期数 | cycle / instruction |
| $T_{\mathrm{clk}}$ | clock period，时钟周期 | second / cycle |
| $f_{\mathrm{clk}}$ | clock frequency，时钟频率 | cycle / second |

动态 IC 要计入循环的实际执行次数和伪指令展开，不能只数源程序行数。混合指令的平均 CPI 按**指令比例**加权：

$$
CPI_{\mathrm{avg}}=\sum_i p_i CPI_i,\qquad
p_i=\frac{IC_i}{IC}.
$$

例：50% 指令 CPI=1，30% 为 2，20% 为 3，则平均 CPI=1.7。若 IC=$10^9$、频率为 2 GHz：

$$
T_{\mathrm{CPU}}=\frac{10^9\times1.7}{2\times10^9}=0.85\ \mathrm{s}.
$$

比较新旧机器时统一用：

$$
S=\frac{T_{\mathrm{old}}}{T_{\mathrm{new}}}
=\frac{IC_{\mathrm{old}}CPI_{\mathrm{old}}/f_{\mathrm{old}}}
{IC_{\mathrm{new}}CPI_{\mathrm{new}}/f_{\mathrm{new}}}.
$$

S>1 才是加速。降低 IC、降低 CPI、提高频率可能相互牵制；仅比较 GHz 或 CPI 不能决定程序谁更快。CPU 时间也不等于含 I/O 等待的总墙钟时间（wall-clock time）。

## 4. Amdahl 定律（Amdahl's Law）

原程序执行时间中，某部分占比 F，将该部分加速 k 倍，其他部分不变：

$$
T_{\mathrm{new}}=T_{\mathrm{old}}\left[(1-F)+\frac{F}{k}\right],
\qquad
S_{\mathrm{overall}}=\frac{1}{(1-F)+F/k}.
$$

F 是**优化前的时间比例**，不是指令比例，也不是优化后的占比。这是将固定工作量拆成受影响与不受影响部分的性能模型，见 [Cornell：Amdahl's law](https://www.cs.cornell.edu/~bindel/nmds/00-Background/02-Performance.html#amdahls-law)。

例如 40% 时间可加速 4 倍：

$$
S=\frac{1}{0.6+0.4/4}=\frac{10}{7}\approx1.429.
$$

即使该部分无限快：

$$
S_{\max}=\frac{1}{1-F}=\frac{1}{0.6}\approx1.667.
$$

如果题目给的是指令比例 $p_i$，在统一时钟周期下需先换成时间比例：

$$
F_i=\frac{p_i CPI_i}{\sum_j p_j CPI_j}.
$$

例如只有 20% 的指令属于某类，但 CPI=4，其他 80% 的 CPI=1，这类指令占原时间 $0.2\times4/(0.2\times4+0.8)=50\%$，不能把 F 直接写成 20%。

解题时先固定程序/工作量与基准，再确认变化的是 IC、CPI、周期还是某部分耗时；流水线的吞吐率、启动开销和停顿分析见[性能分析章节](../20-pipelining/02-performance.md)。
