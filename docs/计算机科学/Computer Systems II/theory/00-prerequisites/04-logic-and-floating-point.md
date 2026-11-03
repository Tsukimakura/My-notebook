---
title: "前置复习：布尔代数与浮点表示"
status: draft
tags: [cs, computer-systems, boolean-algebra, floating-point, review]
created: 2026-11-03
updated: 2026-11-03
sources:
  - "个人系统 I 期末复习手稿，第 2 页下半部分"
  - https://docs.oracle.com/cd/E19957-01/806-3568/ncg_math.html
---

# 前置复习：布尔代数与浮点表示

[前置复习目录](index.md) · [上一章：数据通路与性能](03-datapath-and-performance.md)

## 1. 布尔代数：先区分逻辑符号与算术

本节 $+$ 表示 OR，相乘表示 AND，上横线表示 NOT；它们不是普通整数加法/乘法。例如 $X+X=X$。在 ALU 算术和性能公式中，$+$ 仍表示普通加法。

| 名称 | 恒等式 |
| --- | --- |
| 单位元 / 零元 | $X+0=X$，$X\cdot1=X$，$X+1=1$，$X\cdot0=0$ |
| 幂等律（idempotence） | $X+X=X$，$XX=X$ |
| 互补律（complement） | $X+\overline X=1$，$X\overline X=0$ |
| 吸收律（absorption） | $X+XY=X$，$X(X+Y)=X$ |
| 分配律（distributivity） | $X(Y+Z)=XY+XZ$，$X+YZ=(X+Y)(X+Z)$ |
| De Morgan 定律 | $\overline{XY}=\overline X+\overline Y$，$\overline{X+Y}=\overline X\,\overline Y$ |

### 手稿中的吸收变形

$$
X+\overline X Y
=(X+\overline X)(X+Y)
=X+Y.
$$

不要漏掉 $\overline X$ 的反相记号；若写成 $X+XY$，结果是 X，而不是 X+Y。

### 共识定理（Consensus Theorem）

$$
AB+\overline A C+BC=AB+\overline A C.
$$

证明只需展开冗余项：

$$
BC=(A+\overline A)BC=ABC+\overline A BC.
$$

其中 ABC 被 AB 吸收，$\overline A BC$ 被 $\overline A C$ 吸收。因此 BC 不改变真值表；逻辑等价不保证门电路的瞬态毛刺完全相同，时序问题需另行分析。

### 补齐变量与 Shannon 展开

手稿的

$$
X=X(Y+\overline Y)=XY+X\overline Y
$$

可用于把项展开为含指定变量的积之和（sum of products, SOP）。更一般地，对任意布尔函数：

$$
f=Yf|_{Y=1}+\overline Y f|_{Y=0}.
$$

这正是二选一 MUX：Y 选择两个余因子（cofactors）。化简可减少门和控制译码逻辑，展开则便于真值表、最小项或 MUX 实现，方向取决于题目要求。

## 2. IEEE 754 的三个字段

二进制浮点数由符号（sign）、存储指数（biased exponent）和小数字段（fraction）组成：

```text
binary32：sign[31] | exponent[30:23] | fraction[22:0]
binary64：sign[63] | exponent[62:52] | fraction[51:0]
```

| 格式 | 总位数 | 符号 s | 指数 E | fraction 位数 p | bias | 正规数有效精度 |
| --- | --- | --- | --- | --- | --- | --- |
| 单精度（single precision / binary32） | 32 | 1 | 8 | 23 | 127 | 24 bit |
| 双精度（double precision / binary64） | 64 | 1 | 11 | 52 | 1023 | 53 bit |

设 F 为 fraction 字段表示的无符号整数，$f=F/2^p$，则 $0\le f<1$。**fraction 字段的 p 位与有效数（significand）的精度不是同一个数**：正规数还含一个不实际存储的首位 1（implicit leading one）。格式与特殊值核对见 [Oracle Numerical Computation Guide：IEEE Arithmetic](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_math.html)。

## 3. 正规数、非正规数与特殊值

| 存储指数 E | fraction F | 类型与数值 |
| --- | --- | --- |
| 既非全 0，也非全 1 | 任意 | 正规数（normal）：$(-1)^s(1+f)2^{E-\mathrm{bias}}$ |
| 全 0 | 非 0 | 非正规数/次正规数（subnormal）：$(-1)^s f\,2^{1-\mathrm{bias}}$ |
| 全 0 | 0 | 有符号零：+0 / −0 |
| 全 1 | 0 | 有符号无穷：+∞ / −∞ |
| 全 1 | 非 0 | NaN（not a number），不能当作普通数值解码 |

subnormal 也常称 denormalized number：**没有隐含的 1，指数使用 $1-\mathrm{bias}$，不是 $0-\mathrm{bias}$**。这样可以在最小正规数以下逐渐减小有效精度，即渐进下溢（gradual underflow）。

| 格式 | 正规数的实际指数范围 | 最小正正规数 | 最小正 subnormal |
| --- | --- | --- | --- |
| binary32 | −126…127 | $2^{-126}$ | $2^{-149}$ |
| binary64 | −1022…1023 | $2^{-1022}$ | $2^{-1074}$ |

“指数全 1”不一定是无穷，还需检查 fraction 是否为零。NaN 与自身做普通相等比较也为假；+0 与 −0 的编码不同，但普通数值相等比较认为它们相等。

## 4. 编码例题：13.25 的 binary32

1. 转二进制：$13.25=1101.01_2$。
2. 规格化：$1101.01_2=1.10101_2\times2^3$。
3. 符号 s=0；存储指数 E=3+127=130，即 `10000010`。
4. 去掉隐含首位 1，fraction 为 `10101000000000000000000`。

```text
0 | 10000010 | 10101000000000000000000
= 0x41540000
```

本课程小端内存中，从低地址起存为 `00 00 54 41`；符号位仍然是整个 32 位编码的 bit 31，不会因小端而改变。

反向解码先分字段、判断 E 是否特殊，再代入对应公式。若二进制小数不能用有限的 fraction 位精确表示，就需要舍入（rounding）；不能把“直接截断”当作所有浮点运算的默认规则。

进一步复习可回到[系统 I：信息表示](../../../Computer%20Systems%20I/theory/10_Digital%20logic/00_Information%20Representation.md)与[数字逻辑基础](../../../Computer%20Systems%20I/theory/10_Digital%20logic/10_Foundations%20of%20Digital%20Logic.md)。
