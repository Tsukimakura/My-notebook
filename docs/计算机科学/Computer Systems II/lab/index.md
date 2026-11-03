---
title: "计算机系统 II 实验（Laboratory）"
status: draft
tags: [cs, computer-systems, verilog, lab]
created: 2026-10-08
updated: 2026-10-08
sources:
  - "~/sys1/sys1-sp26/src/"
  - "~/sys1/sys1-sp26/repo/sys-project/"
  - "~/sys1/sys1-sp26/docs/"
---

# 计算机系统 II 实验（Laboratory）

## Verilog / SystemVerilog

围绕“代码对应什么电路、什么时候更新、怎样连接和验证”整理语法与设计方法。接续[系统 I 的 Verilog 笔记](../../Computer%20Systems%20I/Lab/Verilog.md)，先读前三章，再按所设计的模块查阅后续章节。

| 章节 | 解决的问题 |
| --- | --- |
| [1. 硬件描述与模块](verilog/01-hardware-and-modules.md) | HDL、模块、端口、线网、变量、编译流程 |
| [2. 类型、位宽与表达式](verilog/02-types-and-expressions.md) | 四态逻辑、字面量、有符号运算、拼接、数组 |
| [3. 组合与时序逻辑](verilog/03-combinational-and-sequential.md) | assign / always、锁存器、复位、阻塞与非阻塞赋值 |
| [4. 参数化与数据组织](verilog/04-parameterization-and-data-types.md) | generate、循环、函数、enum / struct / package、宏 |
| [5. 状态机与运算电路](verilog/05-fsm-and-arithmetic.md) | FSM、计数器、加减法、迭代乘法、加法树、CPU 控制 |
| [6. 接口与握手](verilog/06-interfaces-and-handshakes.md) | interface / modport、valid-ready、背压、内存总线 |
| [7. 存储、FIFO 与外设](verilog/07-memory-fifo-and-io.md) | RAM、字节掩码、跨时钟域、UART、数码管、VGA |
| [8. 仿真与调试](verilog/08-simulation-and-debugging.md) | testbench、波形、自检、队列、DPI-C、lint 与时序约束 |

完整模块示例使用 SystemVerilog（`.sv`）；标注“片段”的代码依赖所在模块的声明。代码中的 `clk` 默认上升沿有效，`rst_n` / `rstn` 表示低有效复位，`rst` 的极性需看具体实现。

## 源码与主题索引

资料根目录为 `~/sys1/sys1-sp26/`。覆盖 `src/` 中 51 个及 `repo/sys-project/` 中 21 个 HDL 文件，包含模块、头文件与仿真代码；对应文件路径及 SHA-256 记录见 [扫描清单](verilog/assets/source-manifest.json)。构建产物、Verilator 自身的回归测试及 RISC-V 软件工具链不属于课程 RTL。

| 源码位置（相对资料根目录） | 主要内容 | 对应章节 |
| --- | --- | --- |
| `src/lab0-2/`、`lab0-3/` | Logisim 导出门电路、端口、反相参数、穷举 testbench | 1–3、8 |
| `src/lab1-1/`、`lab1-2/` | 多路选择器、向量/数组、七段译码、显示宏 | 1–4、7 |
| `src/lab2-1/` | 全加器、generate、加减法、随机自检 | 2、4、5、8 |
| `src/lab3-1/`、`lab3-2/` | enum 状态机、复位、使能、BCD 级联计数 | 3–5 |
| `src/lab3-3/` | 多周期乘法、start-finish、DPI-C 判定 | 3、5、8 |
| `src/lab4-1/`、`lab4-2/` | 滑动窗口、乘法与加法树、队列、串口回环 | 4–8 |
| `src/project/submit/`、`Core2.sv` | ALU、立即数、比较器、寄存器组、控制器、访存 | 2–7 |
| `repo/sys-project/include/` | 数据包、结构体、接口宏、响应码 | 4、6 |
| `repo/sys-project/general/` | 总线互联、RAM、同步/异步 FIFO、UART、SCPU | 6、7 |
| `repo/sys-project/syn/` | 时钟、消抖、数码管、VGA、字符 ROM、VRAM、顶层 | 3、7、8 |
| `repo/sys-project/sim/` | 时钟/串口激励、超时、提交级差分测试 | 8 |

实验文档主要参考 `lab0-2-appendix.md`、`lab2-1-appendix.md`、`lab3-1-appendix.md`、`lab3-3-appendix.md`、`lab4-1-appendix.md` 及各实验、project 文档的教学部分。笔记按知识组织，省略提交步骤、评分规则和环境安装过程。
