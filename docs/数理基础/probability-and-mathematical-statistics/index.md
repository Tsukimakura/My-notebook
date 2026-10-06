---
title: "概率论和数理统计（Probability and Mathematical Statistics）"
status: draft
tags: [math-physics, probability, statistics, course]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "黄炜：《概率论和数理统计》，2026–2027 秋冬，PS ch1-2026.pdf"
  - "课堂识别：course_87789_sub_1968593/course_content.md"
  - "课堂识别：course_87789_sub_1973627/course_content.md 及同目录课堂截图"
  - "原始课件：概率论与数理统计(浙大高教版)pdf-2023/第1章  概率论的基本概念.pdf"
---

# 概率论和数理统计（Probability and Mathematical Statistics）

## 第一章：概率论的基本概念（Introduction to Probability）

| 主题 | 内容 |
| --- | --- |
| [§1.1 样本空间与随机事件](ch01/01-sample-space-and-events.md) | 随机试验、样本空间、事件关系与运算 |
| [§1.2 频率与概率](ch01/02-frequency-and-probability.md) | 三条公理、基本性质、加法公式 |
| [§1.3 古典概型](ch01/03-classical-probability.md) | 排列组合、抽样、生日、抽签与配对问题 |
| [几何概型与蒲丰投针](ch01/04-geometric-probability.md) | 几何度量比、投针模型与随机模拟 |
| [§1.4 条件概率、全概率与贝叶斯公式](ch01/05-conditional-probability.md) | 条件概率定义、三个公式与应用 |

## 方法选择

先把文字问题写成随机试验与事件，再选择计算方法：

- 事件之间的逻辑关系 → 集合运算、互斥分解、取补集。
- 有限且等可能的结果 → 古典概型，计算有利结果数与总数之比。
- 在有限几何区域中均匀取点 → 几何概型，计算长度／面积／体积之比。
- 已知某事件发生 → 条件概率，限制范围并重新归一化。
- 按不同情况分解结果 → 全概率公式；已知结果反推情况 → 贝叶斯公式。

## 记号

| 记号 | 含义与英文读法 |
| --- | --- |
| $S$ 或 $\Omega$ | 样本空间，sample space |
| $\omega$ | 一次试验的结果／样本点，outcome / sample point |
| $A^c$ 或 $\overline A$ | $A$ 的补事件，complement of $A$ |
| $AB=A\cap B$ | $A$ 与 $B$ 同时发生，intersection / both $A$ and $B$ |
| $A\cup B$ | 至少一个发生，union / at least one of $A$ and $B$ |
| $P(A\mid B)$ | 已知 $B$ 发生时 $A$ 的条件概率，probability of $A$ given $B$ |
| $\binom nk=C_n^k$ | 组合数，binomial coefficient |

$\subseteq$ 表示允许相等的包含关系，$\cup$ 表示和事件。

## 参考资料与图片说明

- 黄炜：`PS ch1-2026.pdf`。
- 《概率论与数理统计》第二版，高等教育出版社，2023，第一章原始课件。
- 课堂识别文本与截图见各篇笔记的 `sources`。

页码均指 PDF 页序，从 1 开始。附图为自绘教学图，图片来源、可编辑文件与许可说明见[图片说明](assets/README.md)。
