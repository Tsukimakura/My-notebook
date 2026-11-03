---
title: "概率论和数理统计（Probability and Mathematical Statistics）"
status: draft
tags: [math-physics, probability, statistics, course]
created: 2026-10-06
updated: 2026-11-03
sources:
  - "黄炜：《概率论和数理统计》，2026–2027 秋冬，PS ch1-2026.pdf"
  - "课堂识别：course_87789_sub_1968593/course_content.md"
  - "课堂识别：course_87789_sub_1973627/course_content.md 及同目录课堂截图"
  - "原始课件：概率论与数理统计(浙大高教版)pdf-2023/第1章  概率论的基本概念.pdf"
  - "黄炜：test1/PS ch2-2026(1).pdf、PS ch3-2026.pdf"
  - "test1 下四份 course_content.md 与对应课堂截图"
  - "教材习题一、二、三；用户提供的题图与桌面 prob-exercises"
  - "https://chatgpt.com/share/6ae9da00-bc18-83e8-be00-afb910c16efc"
  - "https://chatgpt.com/share/6ae9da4b-d094-83e8-a534-11707da6ff54"
---

# 概率论和数理统计（Probability and Mathematical Statistics）

[第一次小测复习：知识主线与题型归纳](materials/quiz-1-review.md)

## 第一章：概率论的基本概念（Introduction to Probability）

| 主题 | 内容 |
| --- | --- |
| [§1.1 样本空间与随机事件](ch01/01-sample-space-and-events.md) | 随机试验、样本空间、事件关系与运算 |
| [§1.2 频率与概率](ch01/02-frequency-and-probability.md) | 三条公理、基本性质、加法公式 |
| [§1.3 古典概型](ch01/03-classical-probability.md) | 排列组合、抽样、生日、抽签与配对问题 |
| [几何概型与蒲丰投针](ch01/04-geometric-probability.md) | 几何度量比、投针模型与随机模拟 |
| [§1.4 条件概率、全概率与贝叶斯公式](ch01/05-conditional-probability.md) | 条件概率定义、三个公式与应用 |
| [§1.5 事件的独立性](ch01/06-independence.md) | 两两与相互独立、可靠性、条件独立 |

## 第二章：随机变量及其分布（Random Variables and Distributions）

| 主题 | 内容 |
| --- | --- |
| [§2.1–2.2 随机变量与离散分布](ch02/01-random-variables-and-discrete-distributions.md) | PMF、伯努利、二项、泊松、几何、负二项、超几何 |
| [§2.3 分布函数](ch02/02-distribution-functions.md) | CDF、跳跃、端点、分布律与 CDF 的互推 |
| [§2.4 连续型随机变量与常用分布](ch02/03-continuous-distributions.md) | PDF、均匀、指数、正态、混合分布 |
| [§2.5 随机变量函数的分布](ch02/04-functions-of-random-variables.md) | CDF 法、单调变换、多分支、概率积分变换 |

## 第三章：二维随机变量及其分布（Bivariate Distributions）

| 主题 | 内容 |
| --- | --- |
| [§3.1 二维离散分布、边际与条件分布](ch03/01-discrete-joint-distributions.md) | 联合 PMF、边际求和、条件归一化、分层模型 |
| [§3.2 联合分布函数](ch03/02-joint-distribution-functions.md) | 左下矩形、四角公式、边际与条件 CDF |
| [§3.3 二维连续分布与条件密度](ch03/03-continuous-joint-distributions.md) | 支撑区域、边际积分、条件密度、二维均匀分布 |
| [§3.3–3.4 二维正态与随机变量独立性](ch03/04-bivariate-normal-and-independence.md) | 二维正态、条件正态、独立性与密度分解 |

## 方法选择

先定义事件或随机变量，再按所求选方法：

| 题目特征 | 方法与关键条件 |
| --- | --- |
| 至少、至多、恰好、都不 | 集合运算；“至少一个”常取补 |
| 有限且等可能 | 古典概型；分子、分母统一计数 |
| 有限区域内均匀取点 | 几何概型；事件区域与支撑相交后取度量比 |
| 已知某事件发生 | 条件概率；交集除以条件概率 |
| 分类求总概率／由结果反推来源 | 全概率／贝叶斯；分类须互斥且穷尽 |
| 固定次数的成功数／等待成功的次数 | 二项／几何或负二项；先检查独立性与成功率 |
| 一维区间概率／连续区域概率 | CDF 差值／密度积分；注意端点与支撑 |
| 随机变量函数的分布 | 确定输出范围，转为原变量的等价事件 |
| 联合分布求边际／条件分布 | 消去另一变量／按给定条件归一化 |

**统一检查：**概率在 $[0,1]$ 内；PMF 非负且和为 1，PDF 非负且积分为 1；CDF 写全定义域；独立性、正分母、支撑范围和端点条件写明。

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
| $F_X(x)=P(X\le x)$ | 累积分布函数，cumulative distribution function / CDF |
| $p_{ij}=P(X=x_i,Y=y_j)$ | 联合概率质量函数，joint PMF |
| $f_X(x)$、$f(x,y)$ | 一维密度、联合密度，PDF / joint PDF |
| $f_{X\mid Y}(x\mid y)$ | 条件密度，conditional PDF of X given Y |
| $\varphi$、$\Phi$ | 标准正态密度与分布函数，standard normal PDF and CDF |

$\subseteq$ 表示允许相等的包含关系，$\cup$ 表示和事件。

## 英文答题句式

| 用途 | 句式 |
| --- | --- |
| 定义事件／变量 | Let $A$ denote the event that … / Let $X$ be the number of … |
| 说明事件关系 | $A$ occurs if and only if … / Since $A\subseteq B$, … |
| 说明模型 | All outcomes are equally likely. / Assume uniform sampling over the region. |
| 说明分类 | These events are pairwise disjoint and collectively exhaustive. |
| 引用方法 | By the complement rule / finite additivity / inclusion–exclusion principle, … |
| 条件概率方法 | By the definition of conditional probability / multiplication rule / law of total probability / Bayes' theorem, … |

## 参考资料与图片说明

- 黄炜：第一、二、三章课程课件。
- 《概率论与数理统计》第二版，高等教育出版社，2023，第一至三章原始课件。
- 作业题意依据用户提供的教材题图整理；会话及已保存的作业源码用作题号、解答线索。题图与知识点对应关系见[习题来源记录](assets/exercise-sources.json)。
- 课堂识别文本与截图见各篇笔记的 `sources`。

页码均指 PDF 页序，从 1 开始。附图为自绘教学图，图片来源、可编辑文件与许可说明见[图片说明](assets/README.md)。
