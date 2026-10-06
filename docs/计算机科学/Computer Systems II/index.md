---
title: "计算机系统 II（Computer Systems II）"
status: draft
tags: [cs, computer-systems, architecture, course]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "课程资料：lec01-2026-chang.pdf、lec02(2).pdf、lec03-2026.pdf"
  - "授课识别文本：first-5-lessons/*/course_content.md"
---

# 计算机系统 II（Computer Systems II）

本课程接续计算机系统 I 的数字逻辑、RISC-V 指令集和 CPU 设计，按主题整理计算机体系结构与系统知识。正文以中文解释，专业概念保留英文，便于阅读英文教材与考试作答。

## 理论笔记（Theory）

沿用系统 I 的“课程目录 → `theory/` → 主题章节”结构，按知识主题组织，随课程进度持续更新。

| 章节 | 阅读内容 |
| --- | --- |
| 体系结构与 ISA | [系统 I 衔接与 CPU 设计](theory/10-architecture-and-isa/01-system-and-cpu-review.md) |
| 体系结构与 ISA | [ISA 分类、设计原则与寻址](theory/10-architecture-and-isa/02-isa-design-and-addressing.md) |
| 体系结构与 ISA | [RISC-V 指令与程序翻译](theory/10-architecture-and-isa/03-risc-v-instructions.md) |
| 体系结构与 ISA | [过程调用、寄存器保存与栈帧](theory/10-architecture-and-isa/04-procedure-calls.md) |
| 指令流水线 | [基本原理与分类](theory/20-pipelining/01-principles-and-classification.md) |
| 指令流水线 | [性能分析与计算例题](theory/20-pipelining/02-performance.md) |
| 指令流水线 | [五级流水线数据通路](theory/20-pipelining/03-pipelined-datapath.md) |
| 指令流水线 | [流水线控制信号](theory/20-pipelining/04-pipelined-control.md) |
| 指令流水线 | [结构、数据与控制冒险](theory/20-pipelining/05-hazards-and-handling.md) |
| 指令流水线 | [冒险检测、前递条件与停顿](theory/20-pipelining/06-hazard-detection-and-stalls.md) |

**前置知识：**[系统 I：ISA](../Computer%20Systems%20I/theory/20_Computer%20Organization/01_ISA.md)、[RISC-V](../Computer%20Systems%20I/theory/20_Computer%20Organization/02_RISCV.md)、[CPU 数据通路](../Computer%20Systems%20I/theory/20_Computer%20Organization/03_CPU.md)、[时序逻辑](../Computer%20Systems%20I/theory/10_Digital%20logic/40_Sequential%20Logic%20Design.md)。

## 模型与阅读约定

- ISA 复习同时涉及 RV32I、RV64I；**寄存器宽度（XLEN）与访存数据宽度分别判断**。出现 `ld/sd` 的例子按 RV64I，出现 `lw/sw` 的例子按 32 位数据解释。
- 流水线主体采用课件的单发射、顺序执行、五级模型：IF → ID → EX → MEM → WB。具体例题另行注明前递、寄存器同周期读写和分支判定位置。
- 部分原课件混入 MIPS 公式或教学简化。RISC-V 的指令语义以[官方非特权 ISA 规范](https://docs.riscv.org/reference/isa/v20260120/unpriv/rv32.html)为准，标准过程调用以[psABI](https://riscv-non-isa.github.io/riscv-elf-psabi-doc/)为准；相关章节列出勘误。
- 附图包括注明 PDF 文件及页码的课件整页图，以及标明“自绘”的概念图。页码均指 **PDF 页序，从 1 开始**。课件图片保留原作者标识，原材料未提供开放许可，权利归原作者；图片溯源记录在 `assets/source-manifest.json`。
