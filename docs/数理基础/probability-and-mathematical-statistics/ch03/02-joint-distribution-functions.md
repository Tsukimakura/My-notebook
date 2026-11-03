---
title: "§3.2 联合分布函数（Joint Distribution Function）"
status: draft
tags: [math-physics, probability, joint-cdf]
created: 2026-11-03
updated: 2026-11-03
sources:
  - "黄炜：PS ch3-2026.pdf，第 31–37 页"
  - "test1/course_87789_sub_1984386/course_content.md 末段；course_87789_sub_1987877，约 00:00–38:00"
  - "教材习题三 A12、B3；桌面 prob-exercises 原题照片"
---

# §3.2 联合分布函数（Joint Distribution Function）

## 定义与几何含义

任意二维随机变量 $(X,Y)$ 的**联合分布函数（joint cumulative distribution function, joint CDF）**为

$$
F(x,y)=P(X\le x,Y\le y).
$$

即随机点落入右上角为 $(x,y)$ 的左下矩形（lower-left rectangle） $(-\infty,x]\times(-\infty,y]$ 的概率。

$F(x,y)=1$ 仅表示该左下矩形含全部概率。$F$ 有两个自变量；固定一坐标的切片未必是 CDF，其右端极限可能不足 1。

## 基本性质：特别注意矩形增量

1. $0\le F(x,y)\le1$，分别关于每个坐标单调不减。
2. $F(-\infty,y)=F(x,-\infty)=0$，$F(+\infty,+\infty)=1$。
3. 分别关于每个坐标右连续。
4. 对 $x_1<x_2,y_1<y_2$，**矩形增量（rectangle increment）非负**：

$$
\begin{aligned}
&F(x_2,y_2)-F(x_1,y_2)-F(x_2,y_1)+F(x_1,y_1)\\
&\qquad=P(x_1<X\le x_2,\ y_1<Y\le y_2)\ge0.
\end{aligned}
$$

矩形增量非负不能由分别单调代替；右闭矩形概率用上述“四角公式”。

## 联合 PMF 与联合 CDF 的互推

离散型时，

$$
F(x,y)=\sum_{x_i\le x,\ y_j\le y}p_{ij}.
$$

对阈值左下方各格求和；反向取双向跳跃量：

$$
p_{ij}=F(x_i,y_j)-F(x_i-,y_j)
-F(x_i,y_j-)+F(x_i-,y_j-).
$$

例如支持点是 $(1,2),(1,3),(2,2),(2,3)$，相应概率为 $1/2,1/3,1/12,1/12$，则

$$
F(x,y)=
\begin{cases}
0,&x<1\ \text{或}\ y<2,\\
1/2,&1\le x<2,\ 2\le y<3,\\
5/6,&1\le x<2,\ y\ge3,\\
7/12,&x\ge2,\ 2\le y<3,\\
1,&x\ge2,\ y\ge3.
\end{cases}
$$

分段区域须不重不漏地覆盖全平面。

## 边际分布函数（Marginal CDF）

$$
F_X(x)=\lim_{y\to+\infty}F(x,y)=F(x,+\infty),
$$

$$
F_Y(y)=\lim_{x\to+\infty}F(x,y)=F(+\infty,y).
$$

求边际令另一坐标趋于 $+\infty$，不是取 0。

## 条件分布函数（Conditional CDF）

若 $P(Y=y)>0$，则

$$
F_{X\mid Y}(x\mid y)=P(X\le x\mid Y=y)
=\frac{P(X\le x,Y=y)}{P(Y=y)}.
$$

固定给定值 $y$ 后，它是关于 $x$ 的**一元** CDF。

### 作业｜习题三 A12：边际 CDF 的跳跃与条件 CDF

**题目。**已知

$$
F_X(x)=
\begin{cases}
0,&x<1,\\
0.3,&1\le x<2,\\
1,&x\ge2,
\end{cases}
\qquad
F_Y(y)=
\begin{cases}
0,&y<0,\\
0.4,&0\le y<1,\\
1,&y\ge1.
\end{cases}
$$

且 $P(X=1,Y=0)=0.1$。求联合 PMF 及给定 $Y=0$ 时 $X$ 的 CDF。

**解析。**由跳跃量得 $P_X(1)=0.3,P_X(2)=0.7$，$P_Y(0)=0.4,P_Y(1)=0.6$。结合已知一格，用行列和补全：

| $X\backslash Y$ | $0$ | $1$ | $P_X$ |
| --- | --- | --- | --- |
| $1$ | $0.1$ | $0.2$ | $0.3$ |
| $2$ | $0.3$ | $0.4$ | $0.7$ |
| $P_Y$ | $0.4$ | $0.6$ | $1$ |

指定 $Y=0$ 后重新归一化：

$$
P(X=1\mid Y=0)=\frac14,\qquad
P(X=2\mid Y=0)=\frac34,
$$

$$
F_{X\mid Y}(x\mid0)=
\begin{cases}
0,&x<1,\\
1/4,&1\le x<2,\\
1,&x\ge2.
\end{cases}
$$

不能直接将边际相乘：$0.1\ne0.3(0.4)$，本题 $X,Y$ 不独立。

### 连续条件取值：不能直接除以零概率

$Y$ 连续时 $P(Y=y)=0$，改用邻域条件概率的极限：

$$
F_{X\mid Y}(x\mid y)
=\lim_{\varepsilon\downarrow0}
\frac{P(X\le x,\ y<Y\le y+\varepsilon)}
{P(y<Y\le y+\varepsilon)},
$$

要求邻域概率为正且极限存在；适当正则条件下可用对称邻域。分母是归一化项，不能省略。

若存在连续联合密度且 $f_Y(y)>0$，该极限导向

$$
F_{X\mid Y}(x\mid y)
=\int_{-\infty}^x\frac{f(u,y)}{f_Y(y)}\,du.
$$

条件分布仅在边际分布几乎处处意义下确定；光滑密度题采用密度比版本。

## 混合分布的联合 CDF

CDF 能同时记录点质量和连续质量；若只取混合分布的二阶导数，通常会漏掉点质量。

### 作业｜习题三 B3：两个原子与一个均匀区域

**题目。**随机点只能落在 $(0,0)$、$(1,1)$ 和开正方形 $D=(0,1)^2$。两点的概率均为 0.1；$D$ 内小区域的概率与面积成正比。求联合 CDF。

**解析。**正方形面积为 1、总概率 0.8，连续密度为 0.8；再加两处点质量：

$$
F(x,y)=
\begin{cases}
0,&x<0\ \text{或}\ y<0,\\
0.1+0.8xy,&0\le x<1,\ 0\le y<1,\\
0.1+0.8y,&x\ge1,\ 0\le y<1,\\
0.1+0.8x,&0\le x<1,\ y\ge1,\\
1,&x\ge1,\ y\ge1.
\end{cases}
$$

例如 $F(0,0)=0.1$，$F(1,1)=1$。也可统一写为

$$
F(x,y)=0.1\mathbf1_{\{x\ge0,y\ge0\}}
+0.8c(x)c(y)+0.1\mathbf1_{\{x\ge1,y\ge1\}},
$$

$c(t)=\min(1,\max(0,t))$；**指示函数（indicator function）**在条件成立时为 1，否则为 0。

## 参考资料

主课件第 31–37 页；课堂识别 course_87789_sub_1987877（分母勘误：33:58–37:32）；教材习题三 A12、B3。
