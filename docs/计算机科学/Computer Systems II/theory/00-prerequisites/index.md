---
title: "系统 I 前置复习（Prerequisite Review）"
status: draft
tags: [cs, computer-systems, review]
created: 2026-11-03
updated: 2026-11-03
sources:
  - "个人计算机系统 I 期末复习手稿：本次上传的两页照片"
---

# 系统 I 前置复习（Prerequisite Review）

[课程目录](../../index.md) · 后续：[体系结构与 CPU 设计](../10-architecture-and-isa/01-system-and-cpu-review.md)

根据系统 I 的期末复习手稿，按系统 II 所需的前置知识整理。保留编码速查、常量构造、嵌套调用和数据通路分析方法；缩写展开为中文解释与英文术语。

| 主题 | 内容 |
| --- | --- |
| [指令、编码与汇编翻译](01-instructions-and-encoding.md) | 六种格式、opcode / funct、立即数、访存、分支跳转、伪指令 |
| [常量构造、函数调用与栈](02-constants-and-calls.md) | 高低位进位补偿、64 位常量、寄存器保存、栈帧、嵌套调用 |
| [数据通路修改与性能分析](03-datapath-and-performance.md) | RTL 语义、MUX 与控制信号、CPU 时间、CPI、Amdahl 定律 |
| [布尔代数与浮点表示](04-logic-and-floating-point.md) | 吸收律、共识定理、变量展开、IEEE 754 编码与特殊值 |

默认采用 **RV64I、32 位非压缩指令、小端字节序（little-endian）和标准整数调用约定**；涉及 RV32 的规则会单独注明。寄存器宽度为 64 位，不代表 C 的 `int`、每次访存或每条指令也都是 64 位。

手稿中的速记按以下边界理解：

- 普通 I/S 型立即数是 signed 12 位；`sltiu` 的立即数也先符号扩展。
- “unsigned 版本同 opcode、不同 funct3”适用于这里列举的比较、分支和 load 指令，不能推广到所有指令。
- `slli/srli/srai` 的立即数字段包含移位量和操作编码，不能把整个字段解释成普通 signed 12 位数。
- `li` 是汇编器伪指令，不保证固定展开为两条；保存返回地址的需求取决于后续调用是否覆盖仍需使用的 ra。

各章与后续理论笔记相互链接，详细推导可按需继续阅读。
