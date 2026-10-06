---
title: "系统 I 衔接与 CPU 设计"
status: draft
tags: [cs, computer-systems, architecture]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "lec01-2026-chang.pdf，第 9–33 页"
  - "course_86797_sub_2036231/course_content.md，19:33–60:15"
---

# 系统 I 衔接与 CPU 设计

[课程目录](../../index.md) · 下一章：[ISA 分类与寻址](02-isa-design-and-addressing.md)

## 1. 从体系结构到电路

计算机解决问题需要经过多个抽象层：

```text
问题 Problem → 算法 Algorithm → 程序 Program
→ 运行时系统 Runtime system（OS、VM、内存管理）
→ 指令集体系结构 ISA → 微体系结构 Microarchitecture
→ 数字逻辑 Logic → 电路 Circuits → 物理器件
```

**指令集体系结构（Instruction Set Architecture, ISA）**规定软件能够观察到的行为：有什么指令、寄存器、数据类型与寻址规则。**微体系结构（Microarchitecture）**决定如何实现这些行为：用单周期、多周期还是流水线，使用哪些执行单元和控制电路。同一 ISA 可以有不同实现，程序不必因流水线级数改变而重新编写。

二进制（Binary）便于电子电路用两个可可靠区分的电平表示信息。它使逻辑门、状态存储与噪声容限的设计更直接；并非数学上只能采用二进制。

**冯·诺依曼结构（Von Neumann Architecture）**的关键是存储程序（Stored Program）：程序与数据存于存储器，由 CPU 取出指令并执行。教学 CPU 常把指令存储器与数据存储器分开以便同时访问，体现哈佛式访问结构（Harvard-style Organization）；这与现代机器上层统一存储、下层分离指令/数据缓存的实现可以并存。

## 2. CPU 的组成与通用性

| 部件 | 英文 | 职责 |
| --- | --- | --- |
| 数据通路 | Datapath | 传送数据、计算地址并进行算术逻辑运算；包括 ALU、寄存器、多路选择器等 |
| 控制单元 | Control Unit | 根据指令和运行状态决定每个部件何时做什么 |
| 缓存 | Cache | 保存近期可能使用的数据或指令，降低存储访问延迟 |
| 程序计数器 | Program Counter, PC | 保存当前取指位置，支持顺序执行与控制转移 |

**ALU（Arithmetic Logic Unit）完成运算，但 CPU 的通用性来自“存储程序 + 可改变的控制序列”。**对于专用数字系统，硬件连接和状态机已经固定计算流程；对于通用系统，程序可以改变操作顺序。

课堂用图灵机（Turing Machine）说明通用计算：纸带、读写头、规则表与状态对应存储、读写、控制和状态记录。真实机器只能提供有限存储；“足够大的有限环形纸带”是教学直观类比，不能严格等同于具有无限纸带的理论图灵机。

## 3. 一条指令需要完成什么

本课程把指令执行概括为五类操作，并单独强调 PC 更新：

| 阶段 | 全称 | 典型工作 |
| --- | --- | --- |
| IF | Instruction Fetch | 根据 PC 取指；准备顺序地址 PC + 4 |
| ID | Instruction Decode / Register Read | 译码、读取源寄存器、生成立即数 |
| EX | Execute / Address Calculation | ALU 运算、访存有效地址计算、分支条件/目标计算 |
| MEM | Memory Access | load 读取数据；store 写入数据 |
| WB | Write Back | 将 ALU 结果或 load 数据写入目的寄存器 |
| PC 更新 | PC Update | 选择顺序地址或控制转移目标；实际归属取决于实现 |

**指令格式与功能并非一一对应。**I 型既有 load，也有立即数 ALU 指令；不能把“I 型”统称为“读取内存后写回”。S 型 store 没有寄存器写回，B 型分支通常也没有。

五级划分是微体系结构选择。ISA 规定最终效果，不要求任何 RISC-V CPU 都使用这五个阶段。

## 4. CPU 设计的方法

设计过程是从软件语义到硬件约束的逐步映射：

1. **理解 ISA。**写清每条指令读取什么、计算什么、修改什么状态。
2. **明确微操作（Micro-operations）。**例如 load 的语义为计算有效地址、读内存、写寄存器。
3. **构建数据通路。**用寄存器组、存储器、ALU、加法器、多路选择器连接操作。
4. **构建控制器。**把 opcode、funct3、funct7 等字段映射为控制信号。
5. **满足时序约束。**计算关键路径，确定时钟周期，保证结果能在时钟边沿正确保存。
6. **优化性能。**根据实际指令构成与关键路径选择改进，重新检查正确性。

控制器可以采用两级译码：**主译码器（Main Decoder）**根据 opcode 决定大类控制；**ALU 译码器（ALU Decoder）**结合 ALUOp 与功能字段确定具体运算。数据通路负责“能够做”，控制器负责“选对并按时做”。

## 5. 单周期为什么受限

**单周期 CPU（Single-cycle CPU）**中，每条指令占一个时钟周期。固定时钟必须允许最慢指令完成：

$$
T_{\mathrm{single}}\ge \max_i T_{\mathrm{instruction},i}.
$$

课件的简化延迟如下，忽略额外的多路选择器、连线等延迟：

| 指令 | 取指 | 读寄存器 | ALU | 数据存储器 | 写寄存器 | 逻辑工作总延迟 |
| --- | --- | --- | --- | --- | --- | --- |
| load | 200 ps | 100 ps | 200 ps | 200 ps | 100 ps | 800 ps |
| store | 200 ps | 100 ps | 200 ps | 200 ps | — | 700 ps |
| ALU 指令 | 200 ps | 100 ps | 200 ps | — | 100 ps | 600 ps |
| beq | 200 ps | 100 ps | 200 ps | — | — | 500 ps |

load 的**关键路径（Critical Path）**经过指令存储器 → 寄存器组 → ALU → 数据存储器 → 寄存器组，所以这里选择 800 ps 周期。**其他指令也占完整的 800 ps 时钟周期**，尽管其组合工作可以更早完成。

同周期内若需要某个单元做不同工作，通常必须另设硬件。例如 PC + 4 与数据 ALU 运算不能直接争用唯一 ALU。复杂、重复的运算也使“全部在一个周期完成”的要求难以维持。

## 6. 多周期带来了什么

**多周期 CPU（Multi-cycle CPU）**把指令拆成多个时钟周期，同一硬件可以跨周期复用，较简单的指令可以使用较少周期。每个阶段的中间结果需保存到寄存器，例如 IR、A/B、ALUOut、MDR。

| 比较维度 | 单周期 | 多周期 | 流水线 |
| --- | --- | --- | --- |
| 一条指令 | 一个长周期 | 多个短周期 | 多个短周期 |
| 不同指令能否重叠 | 否 | 经典模型中否 | 能 |
| 时钟约束 | 最长指令路径 | 最长阶段路径及寄存器开销 | 最长阶段路径及流水寄存器开销 |
| 硬件使用 | 为同周期需求设置资源 | 跨周期复用 | 各阶段同时处理不同指令 |
| 主要额外负担 | 长周期与资源闲置 | 阶段存储、状态机和多次时序开销 | 阶段存储、冒险检测与恢复 |

多周期不必然更快或更慢。比较应看整个程序的

$$
T_{\mathrm{CPU}}=IC\times CPI\times T_{\mathrm{clk}}
=\frac{IC\times CPI}{f_{\mathrm{clk}}}.
$$

其中 IC 是动态指令数（Instruction Count），CPI 是平均每条指令周期数（Cycles Per Instruction），频率 $f_{\mathrm{clk}}=1/T_{\mathrm{clk}}$。多周期虽缩短时钟周期，却增大 CPI。课件中的多周期更慢是具体参数下的结果，不能当成普遍定理。

三条优化路径分别是减少 IC、降低 CPI、缩短时钟周期；它们常互相牵制。流水线沿用多周期“分阶段并保存结果”的思路，再让不同指令重叠执行，提高吞吐量。

## 7. 易错点与英文表达

- **ISA ≠ datapath。**ISA 是行为接口，数据通路是实现。
- **Clock frequency ≠ program performance。**频率提高后，若 CPI 或 IC 同时增大，程序未必更快。
- **Stage count ≠ CPI。**五级流水线中的单条指令经过五级，不表示长期平均 CPI 为 5。
- 图中的箭头不仅要“连得上”，还必须符合数据有效的时间。

**英文简答：**“The ISA specifies programmer-visible behavior, while the microarchitecture determines how that behavior is implemented.”

## 参考资料

- `lec01-2026-chang.pdf`，第 9–33 页；第 1 份授课识别文本，约 19:33–60:15。
- Patterson & Hennessy, *Computer Organization and Design, RISC-V Edition*，处理器实现相关章节，版本页码以手头教材为准。
- CPU 时间公式与三种实现的交叉参考：[Cornell CS 3410 — Pipelining & Performance](https://courses.cs.cornell.edu/cs3410/2026sp/notes/pipelining.html)。
