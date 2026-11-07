---
title: "§3.1 二维离散分布、边际与条件分布（Discrete Joint Distributions）"
status: draft
tags: [math-physics, probability, joint-distribution, conditional-distribution]
created: 2026-11-03
updated: 2026-11-03
sources:
  - "黄炜：PS ch3-2026.pdf，第 4–30 页"
  - "test1/lecture-record-23/course_content.md，约 79:00–143:00，及对应截图"
  - "原始课件：第3章 多元随机变量及其分布.pdf，二维离散型部分"
  - "教材习题三 A6、A9、A10、B2；桌面 prob-exercises 原题照片"
---

# §3.1 二维离散分布、边际与条件分布（Discrete Joint Distributions）

## 从一个指标到随机向量

若 $X,Y$ 定义在同一样本空间上，则

$$
\omega\mapsto(X(\omega),Y(\omega))
$$

构成**二维随机变量／随机向量（bivariate random variable / random vector）**，如同一人的身高与体重。

**联合分布（joint）**描述两者共同取值；**边际分布（marginal）**描述单个坐标；**条件分布（conditional）**描述给定另一坐标信息后的取值。

## 联合分布律（Joint PMF）

若 $(X,Y)$ 的取值对有限或可列，则为二维离散型。记

$$
p_{ij}=P(X=x_i,Y=y_j).
$$

逗号表示交集，不是“或”。分布律满足

$$
p_{ij}\ge0,\qquad\sum_i\sum_jp_{ij}=1.
$$

对区域 $A\subseteq\mathbb R^2$，

$$
P((X,Y)\in A)=\sum_{(x_i,y_j)\in A}p_{ij}.
$$

本页以 $X$ 为行、$Y$ 为列；不可能的取值对填 0。两个分量均离散时，向量也离散，因为两个可列集的笛卡尔积仍可列。

### 例：依次均匀选择，不等于所有数对等可能

先从 1、2、3、4 中等可能选 $X$；给定 $X=i$ 后，从 $1,\ldots,i$ 等可能选 $Y$。由乘法公式，

$$
P(X=i,Y=j)=\frac14\frac1i,\qquad
i=1,2,3,4,\quad j=1,\ldots,i.
$$

10 个数对不等可能：第二层的可选数量随第一层变化。

### 泊松计数的联合建模

若 $N(t)$ 是具有独立增量的齐次泊松计数模型，速率为 $\lambda$，$X_1=N(t_1),X_2=N(t_2)$，$0<t_1<t_2$，则

$$
\begin{aligned}
P(X_1=i,X_2=j)
&=P(N(t_1)=i)P(N(t_2)-N(t_1)=j-i)\\
&=e^{-\lambda t_1}\frac{(\lambda t_1)^i}{i!}
e^{-\lambda(t_2-t_1)}
\frac{[\lambda(t_2-t_1)]^{j-i}}{(j-i)!},
\end{aligned}
$$

$i=0,1,\ldots,\ j=i,i+1,\ldots$。乘法用于前段计数与后段**增量**；仅边际泊松不能保证增量独立。

## 边际分布律（Marginal PMF）

$$
p_{i\cdot}=P(X=x_i)=\sum_jp_{ij},\qquad
p_{\cdot j}=P(Y=y_j)=\sum_ip_{ij}.
$$

消去变量（summing out a variable）：求 $X$ 时对 $Y$ 求和（行和），求 $Y$ 时对 $X$ 求和（列和）。

联合确定边际；边际通常不能还原联合，还缺依赖关系。

## 条件分布律（Conditional PMF）

若 $p_{\cdot j}>0$，给定 $Y=y_j$ 后

$$
P(X=x_i\mid Y=y_j)=\frac{p_{ij}}{p_{\cdot j}}.
$$

指定列除以列和，重新归一化；固定 $y_j$ 后，$x_i$ 变化，条件概率非负且和为 1。

同理，若 $p_{i\cdot}>0$，

$$
P(Y=y_j\mid X=x_i)=\frac{p_{ij}}{p_{i\cdot}}.
$$

条件也可为 $X<2$、$X+Y=2$ 等区域事件：逐个取值与条件求交，再除以条件概率。

### 作业｜习题三 A6：由条件概率补全表格

**题目。**联合 PMF 为

| $X\backslash Y$ | $-1$ | $0$ | $1$ |
| --- | --- | --- | --- |
| $1$ | $a$ | $0.1$ | $b$ |
| $2$ | $0.1$ | $0.1$ | $c$ |

已知 $P(Y\le0\mid X<2)=0.5$，$P(Y=1)=0.5$。求 $a,b,c$ 及边际。

**解析。**归一性给出 $a+b+c=0.7$；最后一列给出 $b+c=0.5$，故 $a=0.2$。由于 $\{X<2\}=\{X=1\}$，

$$
\frac{a+0.1}{a+0.1+b}=0.5
\implies b=a+0.1=0.3,\qquad c=0.2.
$$

| $X\backslash Y$ | $-1$ | $0$ | $1$ | $P_X$ |
| --- | --- | --- | --- | --- |
| $1$ | $0.2$ | $0.1$ | $0.3$ | $0.6$ |
| $2$ | $0.1$ | $0.1$ | $0.2$ | $0.4$ |
| $P_Y$ | $0.3$ | $0.2$ | $0.5$ | $1$ |

### 作业｜习题三 A9：第一次点数与最大点数

**题目。**均匀骰子独立掷两次，$X$ 为第一次点数，$Y$ 为两次最大值。求联合、边际分布，以及给定 $Y=6$ 时 $X$ 的条件分布。

**解析。**记第二次点数为 $U$，$Y=\max(X,U)$。

- $X=i,Y=i$ 要求 $U\in\{1,\ldots,i\}$，有 $i$ 个结果。
- $X=i,Y=j>i$ 要求 $U=j$，只有一个结果。
- $Y<X$ 不可能。

$$
P(X=i,Y=j)=
\begin{cases}
i/36,&1\le i=j\le6,\\
1/36,&1\le i<j\le6,\\
0,&\text{其他}.
\end{cases}
$$

下表中的整数均须除以 36：

| $X\backslash Y$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | 行和 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $1$ | 1 | 1 | 1 | 1 | 1 | 1 | 6 |
| $2$ | 0 | 2 | 1 | 1 | 1 | 1 | 6 |
| $3$ | 0 | 0 | 3 | 1 | 1 | 1 | 6 |
| $4$ | 0 | 0 | 0 | 4 | 1 | 1 | 6 |
| $5$ | 0 | 0 | 0 | 0 | 5 | 1 | 6 |
| $6$ | 0 | 0 | 0 | 0 | 0 | 6 | 6 |
| 列和 | 1 | 3 | 5 | 7 | 9 | 11 | 36 |

故 $P(X=i)=1/6$，$P(Y=j)=(2j-1)/36$。后者也可由

$$
P(Y=j)=P(Y\le j)-P(Y\le j-1)
=\left(\frac j6\right)^2-\left(\frac{j-1}6\right)^2
$$

得到。给定 $Y=6$，除以最后一列总和 $11/36$：

$$
P(X=i\mid Y=6)=
\begin{cases}
1/11,&i=1,\ldots,5,\\
6/11,&i=6.
\end{cases}
$$

给定最大值 6，第一次点数不再均匀。

## 已知边际与条件分布，构造联合分布

$$
P(X=x_i,Y=y_j)
=P(X=x_i)P(Y=y_j\mid X=x_i).
$$

无需独立；把条件 PMF 换成边际 PMF 才需要独立性。

### 作业｜习题三 A10：故障次数与损失

**题目。**单位时间故障数 $X$ 在 $0,1,2$ 的概率为 $0.6,0.3,0.1$；每次故障以概率 $p$ 造成损失 $a$ 万元，$Y$ 为总损失。求联合 PMF 和 $Y\mid X=1$。

**解析。**假设 $a>0$，且**给定故障次数后，各次损失事件独立**。记 $q=1-p$：

$$
Y/a\mid X=k\sim B(k,p).
$$

因此联合 PMF 为

| $X\backslash Y$ | $0$ | $a$ | $2a$ |
| --- | --- | --- | --- |
| $0$ | $0.6$ | $0$ | $0$ |
| $1$ | $0.3q$ | $0.3p$ | $0$ |
| $2$ | $0.1q^2$ | $0.2pq$ | $0.1p^2$ |

$$
P(Y=0\mid X=1)=q,\qquad P(Y=a\mid X=1)=p.
$$

无上述独立性时，$X=2$ 的联合概率不能唯一确定。

### 作业｜习题三 B2：泊松计数的筛选（Poisson Thinning）

**题目。**单位时间交通事故数 $X\sim\operatorname{Pois}(\lambda)$，每起事故由超速引发的概率为 0.1，$Y$ 为超速事故数。求联合分布及 $Y$ 的边际分布。

**解析。**在每起事故的原因独立分类的模型下，

$$
Y\mid X=n\sim B(n,0.1).
$$

由乘法公式，

$$
P(X=n,Y=k)=e^{-\lambda}\frac{\lambda^n}{n!}
\binom nk(0.1)^k(0.9)^{n-k},
\quad n\ge0,\quad0\le k\le n.
$$

其余为零。对 $n$ 求和，令 $m=n-k$：

$$
\begin{aligned}
P(Y=k)
&=\sum_{n=k}^{\infty}e^{-\lambda}\frac{\lambda^n}{n!}
\binom nk(0.1)^k(0.9)^{n-k}\\
&=e^{-\lambda}\frac{(0.1\lambda)^k}{k!}
\sum_{m=0}^{\infty}\frac{(0.9\lambda)^m}{m!}\\
&=e^{-0.1\lambda}\frac{(0.1\lambda)^k}{k!}.
\end{aligned}
$$

故 $Y\sim\operatorname{Pois}(0.1\lambda)$。因 $Y\le X$，求和从 $n=k$ 开始。

## 例：首次与第二次成功的时间

每次独立成功率为 $p$，$X$ 为首次成功的试验序号，$Y$ 为第二次成功的序号。设 $q=1-p$：

$$
P(X=m,Y=n)=p^2q^{n-2},
\quad n=2,3,\ldots,\quad m=1,\ldots,n-1.
$$

第 $m,n$ 次成功，其余前 $n$ 次中 $n-2$ 次失败。因此

$$
P(X=m)=pq^{m-1},\qquad
P(Y=n)=(n-1)p^2q^{n-2}.
$$

即 $X$ 为几何分布，$Y$ 为第 2 次成功的负二项等待次数。给定总次数 $Y=n$，

$$
P(X=m\mid Y=n)=\frac1{n-1},\quad m=1,\ldots,n-1.
$$

给定首次成功序号 $X=m$，

$$
P(Y=n\mid X=m)=pq^{n-m-1},\quad n=m+1,m+2,\ldots.
$$

额外等待 $Y-m$ 仍为几何分布；条件取值范围随 $m$ 变化。

## 参考资料

主课件第 4–30 页；课堂识别 lecture-record-23；教材习题三 A6、A9、A10、B2。
