---
title: "第一次小测复习：知识主线与题型归纳"
status: draft
tags: [math-physics, probability, review, quiz]
created: 2026-11-03
updated: 2026-11-03
sources:
  - "本课程 ch01–ch03 笔记：第一章、第二章、第三章至 §3.4"
  - "教材习题一至三的 40 道已有作业题及解析，见 assets/exercise-sources.json"
  - "黄炜：PS ch1-2026.pdf、PS ch2-2026(1).pdf、PS ch3-2026.pdf"
---

# 第一次小测复习：知识主线与题型归纳

## 知识点之间的联系

随机变量将试验结果表示为数值，分布描述其取值概率；联合分布进一步描述多个变量之间的关系。

| 层次 | 描述对象 | 计算方法 |
| --- | --- | --- |
| 事件（event） | $A$、$AB$、$A\cup B$ | 集合分解、计数、度量比 |
| 一维分布（distribution） | $\{X\in I\}$ | 离散求和、CDF 差值、密度积分 |
| 二维分布（joint distribution） | $\{(X,Y)\in D\}$ | 对格子求和、对区域积分 |
| 边际（marginal） | 只保留一个变量 | 把另一变量求和／积分消去 |
| 条件（conditional） | 已知事件或变量信息 | 限制到有效部分，再归一化 |

常用处理方法：

- 将事件分成互斥的部分，分别求概率后相加；按来源分类就是全概率公式。
- 给定条件后，用交集概率除以条件事件的概率；由观测反推来源时用贝叶斯公式。
- 把 $\{g(X)\le y\}$ 改写成关于 $X$ 的事件，或把文字条件改成积分区域。

## 公式与适用条件

### 1．事件运算、计数与独立性

| 文字 | 事件 |
| --- | --- |
| 至少一个／全部 | $\bigcup_iA_i$／$\bigcap_iA_i$ |
| 全部不／至少一个不 | $(\bigcup_iA_i)^c$／$(\bigcap_iA_i)^c$ |
| 恰有一个（两事件） | $AB^c\cup A^cB$ |

概率公理：非负、$P(S)=1$、可列个两两互斥事件的概率可相加。常用推论：

$$
\begin{aligned}
P(A^c)&=1-P(A),\qquad P(A-B)=P(A)-P(AB),\\
P(A\cup B)&=P(A)+P(B)-P(AB).
\end{aligned}
$$

三事件容斥：单项加、两两交减、三重交再加。$A\subseteq B$ 推出 $P(A)\le P(B)$；概率 0／1 不等于空集／全集。

| 模型 | 公式与条件 |
| --- | --- |
| 古典概型 | $P(A)=\lvert A\rvert/\lvert S\rvert$；有限且等可能，分子分母统一计数 |
| 不放回，有序／无序取 $k$ 个 | $n!/(n-k)!$／$\binom nk$ |
| 独立均匀放回取 $k$ 次 | $n^k$ 个有序结果；无序结果通常不等可能 |
| 几何概型 | $P(A)=m(A\cap S)/m(S)$；均匀且 $0<m(S)<\infty$ |
| 短针投针 | 线距 $a$、针长 $b<a$：$P(\text{相交})=2b/(a\pi)$ |
| 生日／无人配对 | $1-\prod_{j=0}^{n-1}(1-j/365)$（$n\le365$）／$\sum_{k=0}^n(-1)^k/k!$ |

**独立（independence）**用 $P(AB)=P(A)P(B)$ 判断；**互斥（mutually exclusive）**用 $AB=\varnothing$ 判断。正概率事件不能同时互斥又独立。

- 相互独立要求所有子组满足乘法式；两两独立不够。取补仍保持独立。
- 独立重复 $n$ 次、单次成功率 $p$：至少一次成功为 $1-(1-p)^n$。
- 独立元件串联可靠性为 $\prod_ip_i$，并联为 $1-\prod_i(1-p_i)$；复杂系统按关键元件状态分类。

### 2．条件概率、全概率与贝叶斯

$$
\begin{aligned}
P(A\mid B)&=\frac{P(AB)}{P(B)},\qquad P(B)>0,\\
P(ABC)&=P(A)P(B\mid A)P(C\mid AB),\\
P(E)&=\sum_iP(H_i)P(E\mid H_i),\\
P(H_i\mid E)&=\frac{P(H_i)P(E\mid H_i)}{\sum_jP(H_j)P(E\mid H_j)}.
\end{aligned}
$$

$H_i$ 须构成互斥且穷尽的划分；略去零概率项，后验另要求 $P(E)>0$。

求共同发生的概率用乘法公式，分类求总概率用全概率公式，已知结果反推来源用贝叶斯公式。链式乘法须保留前面所有条件；同一条件下仍可用补事件和容斥公式。

### 3．一维分布

二项、几何、负二项均以独立、同成功率的伯努利试验为基础；几何与负二项取 $0<p<1$，负二项的 $r$ 为正整数。

| 分布 | 适用情形 | PMF／取值 |
| --- | --- | --- |
| 伯努利（Bernoulli） | 一次是否成功 | $P(X=1)=p,\ P(X=0)=1-p$ |
| 二项（Binomial） | 固定 $n$ 次、独立、同成功率，数成功次数 | $\binom nkp^k(1-p)^{n-k}$，$k=0,\ldots,n$ |
| 泊松（Poisson） | 给定泊松模型，数固定时空窗口内的事件次数 | $e^{-\lambda}\lambda^k/k!$，$k=0,1,\ldots$；速率 $\nu$、时长 $t$ 时 $\lambda=\nu t$ |
| 几何（Geometric） | 首次成功的总试验次数 | $(1-p)^{k-1}p$，$k\ge1$ |
| 负二项（Negative binomial） | 第 $r$ 次成功的总试验次数 | $\binom{k-1}{r-1}p^r(1-p)^{k-r}$，$k\ge r$ |
| 超几何（Hypergeometric） | $a$ 成功、$b$ 失败对象中无放回取 $n\le a+b$ 个，数成功数 | $\binom ak\binom b{n-k}/\binom{a+b}n$，$\max(0,n-b)\le k\le\min(a,n)$ |

二项可在 $n$ 大、$p$ 小时用 $\operatorname{Pois}(np)$ 近似。有最大试验次数时，最后一项常合并所有尚未停止的路径，不能照搬无限等待分布。

分布律、CDF 与区间概率：

$$
F(x)=P(X\le x),\quad
P(X=a)=F(a)-F(a-),\quad
P(a<X\le b)=F(b)-F(a).
$$

端点规则：右端不含点用 $F(b-)$，左端含点减 $F(a-)$；连续型端点不影响概率。

CDF 单调不减、右连续，在负、正无穷远的极限为 0、1。离散型：$F(x)=\sum_{x_k\le x}p_k$；连续型：$F(x)=\int_{-\infty}^xf(t)\,dt$，密度连续处 $F'=f$。

| 连续分布 | 常用公式 |
| --- | --- |
| 均匀 $U(a,b)$ | 支撑内 $f=1/(b-a)$，概率为相交区间长度比 |
| 指数 $\operatorname{Exp}(\lambda)$ | $f(x)=\lambda e^{-\lambda x}$（$x>0$），$P(X>t)=e^{-\lambda t}$（$t\ge0$） |
| 正态 $N(\mu,\sigma^2)$ | $Z=(X-\mu)/\sigma\sim N(0,1)$，$F_X(x)=\Phi((x-\mu)/\sigma)$ |

指数与几何有无记忆性；指数用**速率参数（rate）** $\lambda$，不是尺度 $1/\lambda$。正态利用 $\Phi(-z)=1-\Phi(z)$；反求参数时，把概率改写成分位数方程。

密度可大于 1，点概率为 0；CDF 连续不必有密度。混合型须同时计入连续部分和 CDF 的跳跃。

### 4．随机变量函数的分布

$$
F_Y(y)=P(g(X)\le y).
$$

- 离散型：把映到同一值的概率相加。
- $X$ 有密度，且 $g$ 单调、连续可微、导数不为零：$f_Y(y)=f_X(h(y))|h'(y)|$，$h=g^{-1}$。
- 多分支：只计原支撑内的有效反解；反解数量改变处须分段。
- $X$ 有密度时，绝对值变换为 $f_{|X|}(y)=f_X(y)+f_X(-y)$（$y>0$），平方变换为 $f_{X^2}(z)=[f_X(\sqrt z)+f_X(-\sqrt z)]/(2\sqrt z)$（$z>0$）。
- $X\sim N(\mu,\sigma^2)$ 时，$aX+b\sim N(a\mu+b,a^2\sigma^2)$（$a\ne0$）。
- CDF 连续时，概率积分变换（probability integral transform）给出 $F_X(X)\sim U(0,1)$。

### 5．二维分布

| 所求 | 离散型 | 连续型 |
| --- | --- | --- |
| 联合 | $p_{ij}=P(X=x_i,Y=y_j)$ | $f(x,y)$；非负且全平面积分为 1 |
| 边际 | $p_{i\cdot}=\sum_jp_{ij}$ | $f_X(x)=\int f(x,y)\,dy$ |
| 条件 | $P(X=x_i\mid Y=y_j)=p_{ij}/p_{\cdot j}$ | $f_{X\mid Y}(x\mid y)=f(x,y)/f_Y(y)$ |
| 由条件分布求联合 | 边际 PMF × 条件 PMF | 边际 PDF × 条件 PDF |
| 独立 | 所有格均满足 $p_{ij}=p_{i\cdot}p_{\cdot j}$ | $f=f_Xf_Y$ 几乎处处，包含支撑条件 |

条件分母须为正。连续单值条件使用密度比或邻域极限，不能除以 $P(Y=y)=0$。

联合 CDF 为 $F(x,y)=P(X\le x,Y\le y)$；离散时累加左下各格，连续时积分左下区域；令另一坐标趋于 $+\infty$ 得边际 CDF。右闭矩形概率用四角公式：

$$
\begin{aligned}
&P(x_1<X\le x_2,y_1<Y\le y_2)\\
&\quad=F(x_2,y_2)-F(x_1,y_2)-F(x_2,y_1)+F(x_1,y_1).
\end{aligned}
$$

区域概率题先画支撑区域，再与所求事件相交，按截线确定积分限，必要时分段。二维均匀分布可用面积比；边际一般不均匀，矩形支撑也不保证独立。

二维正态的边际仍正态；$|\rho|<1$ 时

$$
Y\mid X=x\sim N\left(
\mu_2+\rho\frac{\sigma_2}{\sigma_1}(x-\mu_1),
\sigma_2^2(1-\rho^2)\right).
$$

交换下标得 $X\mid Y=y$。**联合二维正态中，独立当且仅当 $\rho=0$**；仅边际正态不够。

## 习题分类

“一／二／三”表示教材习题章，题号链接到对应解析。

| 考点 | 题号 | 解题方法 |
| --- | --- | --- |
| 事件关系、有限计数 | [一 A4](../ch01/01-sample-space-and-events.md#a4)、[一 B1](../ch01/02-frequency-and-probability.md#b1)、[一 B2](../ch01/03-classical-probability.md#b2)、[一 A10](../ch01/03-classical-probability.md#a10)、[一 A12](../ch01/03-classical-probability.md#a12)、[一 A14](../ch01/03-classical-probability.md#a14)、[一 A15](../ch01/03-classical-probability.md#a15) | 先写事件；计数前明确放回、顺序和可区分对象。求指定车辆配对，不等于求全体错排 |
| 来源混合、观察后更新 | [一 A20](../ch01/05-conditional-probability.md#a20)、[一 A22](../ch01/05-conditional-probability.md#a22)、[一 B6](../ch01/05-conditional-probability.md#b6)、[一 B10](../ch01/05-conditional-probability.md#b10) | 来源作划分；先算来源与观测的联合概率，再求后验。转球改变组成；已观察会改变组别权重 |
| 可靠性、共同环境 | [一 B7](../ch01/06-independence.md#b7)、[一 B8](../ch01/06-independence.md#b8)、[二 B24](../ch02/03-continuous-distributions.md#b24) | 区分相互独立与条件独立；共同天气或电压下先条件计算，再平均 |
| 列分布律、停止规则 | [二 A1](../ch02/01-random-variables-and-discrete-distributions.md#a1)、[二 A2](../ch02/01-random-variables-and-discrete-distributions.md#a2)、[二 B2](../ch02/01-random-variables-and-discrete-distributions.md#b2)、[二 B7](../ch02/01-random-variables-and-discrete-distributions.md#b7) | 枚举取值及其对应路径；检查最大次数的末项、不同成功率、归一性 |
| 计数模型与分层模型 | [二 B12](../ch02/01-random-variables-and-discrete-distributions.md#b12)、[三 A10](../ch03/01-discrete-joint-distributions.md#a10)、[三 B2](../ch03/01-discrete-joint-distributions.md#b2poisson-thinning) | 先定计数窗口或总次数；给定次数后用二项分类，再求联合与边际 |
| CDF、参数与表格补全 | [二 A8](../ch02/02-distribution-functions.md#a8)、[二 B16](../ch02/02-distribution-functions.md#b16)、[二 B17](../ch02/03-continuous-distributions.md#b17)、[二 B18](../ch02/03-continuous-distributions.md#b18)、[三 A6](../ch03/01-discrete-joint-distributions.md#a6)、[三 A12](../ch03/02-joint-distribution-functions.md#a12-cdf-cdf) | 用归一性、CDF 连续性或跳跃量、行列和、条件概率联立；区间概率注意端点 |
| 均匀、正态、指数混合 | [二 A12](../ch02/03-continuous-distributions.md#a12)、[二 B27](../ch02/03-continuous-distributions.md#b27)、[二 B29](../ch02/03-continuous-distributions.md#b29) | 先解事件不等式／识别标准分布；先标准化或统一单位，混合寿命用生存概率比 |
| 函数映射与多分支 | [二 B32](../ch02/04-functions-of-random-variables.md#b32)、[二 B33](../ch02/04-functions-of-random-variables.md#b33)、[二 B36](../ch02/04-functions-of-random-variables.md#b36)、[二 B39](../ch02/04-functions-of-random-variables.md#b39) | 先求输出范围；相同输出合并，反解与原支撑相交后再求和／积分 |
| 同一试验导出的两个变量 | [三 A9](../ch03/01-discrete-joint-distributions.md#a9) | 回到两次骰子的 36 个等可能结果；对角线与非对角线分别计数 |
| 二维支撑、边际与条件密度 | [三 A18](../ch03/03-continuous-joint-distributions.md#a18)、[三 A20](../ch03/03-continuous-joint-distributions.md#a20)、[三 B4](../ch03/03-continuous-joint-distributions.md#b4)、[三 B5](../ch03/03-continuous-joint-distributions.md#b5) | 固定一个变量看截线；限制改变处即分段点，条件密度须重新归一化 |
| 点质量与连续质量并存 | [三 B3](../ch03/02-joint-distribution-functions.md#b3) | CDF = 已覆盖的原子概率 + 连续区域积分；仅求导会漏掉点质量 |

## 几类题目的共同方法

### 共同条件与独立性

[一 B6](../ch01/05-conditional-probability.md#b6) 更新组别、[一 B8](../ch01/06-independence.md#b8) 共用天气、[二 B24](../ch02/03-continuous-distributions.md#b24) 共用电压、[二 B29](../ch02/03-continuous-distributions.md#b29) 混合厂别，都涉及来源或环境对概率的影响。

给定来源 $H_i$ 后，两次事件独立且成功率同为 $p_i$，权重为 $w_i$，则

$$
P(E_1E_2)=\sum_iw_ip_i^2,\qquad
P(E_1)P(E_2)=\left(\sum_iw_ip_i\right)^2.
$$

两者一般不等。有共同来源时，应先按来源分类计算；得到观测结果后，后续计算使用更新后的来源概率。

### 重复观察中的二项分布

[二 B17](../ch02/03-continuous-distributions.md#b17) 先积分求单次事件概率 $q$，再用 $N\sim B(5,q)$；[一 B7](../ch01/06-independence.md#b7) 先求系统可靠性 $\alpha$，再把三次观察看作 $B(3,\alpha)$。

这里统计的是某事件在独立重复观察中发生的次数。原变量即使连续，这个次数仍可服从二项分布。

### 分段位置的确定

| 题目 | 分段原因 |
| --- | --- |
| [二 B33](../ch02/04-functions-of-random-variables.md#b33) | $z=1$ 后负反解离开原支撑，两个分支变一个 |
| [二 B36](../ch02/04-functions-of-random-variables.md#b36) | 余弦的第二个反解是否落在输入区间内随 $y$ 改变 |
| [三 B5](../ch03/03-continuous-joint-distributions.md#b5) | $y=3$ 时水平积分上限从 $y-1$ 变为 2 |
| [三 A20](../ch03/03-continuous-joint-distributions.md#a20) | 固定 $y$ 后只能取 $y^2<x<1$，条件范围随 $y$ 变动 |

### 容易混淆的概念

- **条件与交集：**$P(A\mid B)$ 已归一化，$P(AB)$ 没有；条件一般不可交换。
- **放回与不放回：**独立放回抽样的成功数用二项分布，无放回抽样用超几何分布。
- **总寿命与剩余寿命：**已用四个月、用到一年，还需八个月；先把文字写成阈值事件。
- **固定值与范围：**$Y=y$ 取条件截线；$Y>y$ 对区域求条件概率。
- **概率与密度：**离散型须检查端点是否计入；密度值不是点概率；混合型须同时计算点质量与连续部分。
- **独立与边际：**由联合可求边际，仅有边际不能默认独立或还原联合。

## 答题检查

先定义事件或随机变量，写出所求事件及取值范围，说明模型条件，再列式计算。

计算后检查：概率在 $[0,1]$；PMF 和／PDF 积分为 1；CDF 右连续且两端为 0、1；条件分布单独归一化。英文关键词：given（条件）、exactly（恰有）、at least（至少）、at most（至多）、without replacement（无放回）。

详细定义、推导与全部题解见[课程目录](../index.md)。
