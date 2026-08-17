# 09_Advanced Counting Techniques

## I. 递推关系与建模 (Recurrence Relations & Modeling)

**基础知识 (Fundamentals)**

- **递推关系 (Recurrence relation)** 将序列的第 $n$ 项 $a_n$ 表示为前面若干项的函数。必须提供**初始条件 (Initial conditions)** 才能唯一确定该序列。

- 如果一个序列的各项满足关系方程，则该序列被称为该递推关系的**解 (Solution)**。

**经典应用 (Classic Applications)**

- **人口增长 / 斐波那契数列 (Population Growth / Fibonacci):** 兔子对数的增长遵循 $f_n = f_{n-1} + f_{n-2}$，其中 $f_1=1, f_2=1$。

- **汉诺塔 (Tower of Hanoi):** 移动 $n$ 个圆盘的最少步数递推式为 $H_n = 2H_{n-1} + 1$，由此可得出**闭合形式解 (Closed-form)** $H_n = 2^n - 1$。

- **位串 (Bit Strings):** 长度为 $n$ 且不含连续 0 的有效位串数量遵循 $a_n = a_{n-1} + a_{n-2}$。

- **乘积加括号 / 卡特兰数 (Parenthesizing a Product / Catalan Numbers):** 给 $n+1$ 个数字的乘积加括号的方法数为 $C_n = \sum_{k=0}^{n-1} C_k C_{n-k-1}$。

## II. 求解线性递推关系 (Solving Linear Recurrence Relations)

**线性齐次递推关系 (Linear Homogeneous Recurrence Relations, LHRR)**

- **标准形式 (Standard form):** $a_n = c_1a_{n-1} + c_2a_{n-2} + \dots + c_ka_{n-k}$ （方程中不包含独立的 $n$ 的函数）。

- **求解方法 (Solution Method):** 求解**特征方程 (Characteristic equation)** $r^k - c_1r^{k-1} - \dots - c_k = 0$ 的**根 (Roots)**。

    - _不同根 (Distinct Roots, 设为 $r_1, \dots, r_k$):_ 解的形式为 $a_n = \alpha_1 r_1^n + \dots + \alpha_k r_k^n$。

    - _重复根 / 重根 (Repeated Roots, 设根 $r_i$ 的**重数/多重度 (Multiplicity)** 为 $m$):_ 该根对解的贡献部分为 $(\alpha_{i,0} + \alpha_{i,1}n + \dots + \alpha_{i,m-1}n^{m-1})r_i^n$。

**线性非齐次递推关系 (Linear Nonhomogeneous Recurrence Relations, LNRR)**

- **标准形式 (Standard form):** $a_n = c_1a_{n-1} + \dots + c_k a_{n-k} + F(n)$。

- **通解 (General Solution):** $a_n = a_n^{(h)} + a_n^{(p)}$，其中 $a_n^{(h)}$ 是**齐次解 (Homogeneous solution)**，$a_n^{(p)}$ 是**特解 (Particular solution)**。

- **寻找特解 (Finding the Particular Solution):** 如果右侧函数 $F(n) = (b_t n^t + \dots + b_0)s^n$：

    - _如果 $s$ **不是** 特征根:_ $a_n^{(p)} = (p_t n^t + \dots + p_0)s^n$。

    - _如果 $s$ **是** 特征根，且重数为 $m$:_ $a_n^{(p)} = n^m (p_t n^t + \dots + p_0)s^n$。

## III. 分治法与主定理 (Divide-and-Conquer & Master Theorem)

**主定理 (Master Theorem)**

- 对于一个算法，若它将问题划分为 $a$ 个大小为 $n/b$ 的**子问题 (Subproblems)**，且非递归的**工作量 (Work)** 为 $O(n^d)$，则其递推关系式为 $f(n) = af(n/b) + cn^d$。

- 通过比较 $a$ 和 $b^d$ 的大小来评估时间复杂度：

    - **情况 1 (Case 1, $a > b^d$):** 工作量由**叶子节点主导 (Leaf-dominated)**。复杂度为 $O(n^{\log_b a})$。

    - **情况 2 (Case 2, $a = b^d$):** 工作量**均匀分布 (Evenly distributed)**。复杂度为 $O(n^d \log n)$。

    - **情况 3 (Case 3, $a < b^d$):** 工作量由**根节点主导 (Root-dominated)**。复杂度为 $O(n^d)$。

**经典示例 (Classic Examples)**

- **二分查找 (Binary Search):** $f(n) = f(n/2) + 2 \implies O(\log n)$。

- **归并排序 (Merge Sort):** $M(n) = 2M(n/2) + n \implies O(n \log n)$。

- **Karatsuba 乘法 (Karatsuba Multiplication):** $f(n) = 3f(n/2) + cn \implies O(n^{\log_2 3})$。

## IV. 生成函数 (Generating Functions)

生成函数将离散的组合问题转化为连续的代数问题。在这里，$x$ 只是一个没有实际数值意义的“占位符（晾衣架）”，它的唯一作用是“挂住”前面的系数 $a_k$。只要提取出 $x^k$ 的系数，就等于算出了数列的第 $k$ 项。

### 基础理论与核心运算 (Fundamentals & Operations)

#### 1. 普通生成函数

对于序列 $a_0, a_1, a_2, \dots, a_k$，其普通生成函数定义为：

$$
G(x) = \sum_{k=0}^{\infty} a_kx^k = a_0 + a_1x + a_2x^2 + \dots
$$

#### 2. 卷积规则 (Convolution Rule)

当两个生成函数 $f(x)$ 和 $g(x)$ 相乘时，对应于序列的卷积求和：

$$
f(x)g(x) = \sum_{k=0}^{\infty} \left(\sum_{j=0}^{k} a_j b_{k-j}\right)x^k
$$

- **组合学意义：** 相当于“把 $k$ 个物品分配给两个不同集合（要求第一部分拿 $j$ 个，第二部分拿 $k-j$ 个）”的所有分配方式之和。

#### 3. 前缀和 (Prefix Sums)

若要求 $G(x)$ 生成序列的部分和（即 $\sum_{i=0}^k a_i$），只需将原生成函数乘以基础几何级数：

$$
G_{sum}(x) = G(x) \cdot \frac{1}{1-x}
$$

- **代数意义：** 等价于微积分中对函数进行“积分”。

### 提取系数的公式

| **分式长相 / 定理名称** | **展开式**                                                          | **$x^k$ 的系数**      | **适用场景**                   |
| --------------- | ---------------------------------------------------------------- | ------------------ | -------------------------- |
| **1. 基础等比数列**   | $\frac{1}{1-x}$ = $\sum_{k=0}^{\infty} x^k$                      | $1$                | 最基础的无限项全 $1$ 序列            |
| **2. 带倍数的等比数列** | $\frac{1}{1-ax}$ = $\sum_{k=0}^{\infty} a^k x^k$                 | $a^k$              | 处理分母带常数系数的项                |
| **3. 广义二项式定理**  | $\frac{1}{(1-x)^m}$ = $\sum_{k=0}^{\infty} \binom{k+m-1}{k} x^k$ | $\binom{k+m-1}{k}$ | 分母带有高次幂（等价于隔板法分配）          |
| **4. 基础二项式定理**  | $(1+x)^m$ = $\sum_{k=0}^{m} \binom{m}{k} x^k$                    | $\binom{m}{k}$     | 分子上的有限次幂组合（$k>m$ 时系数为 $0$） |

### 应用场景

#### 解决复杂计数问题 (Counting Problems)

##### 1. 组合问题（顺序无关）—— 普通生成函数 (OGF)

**核心逻辑：**

求从若干类物品中选取 $n$ 个的方案数，等价于求各类别普通生成函数乘积中 **$x^n$ 的系数**。

**常见约束的 OGF 映射字典：**

- **无限制（可选任意个）：** $1 + x + x^2 + \dots = \frac{1}{1-x}$

- **只能选偶数个：** $1 + x^2 + x^4 + \dots = \frac{1}{1-x^2}$

- **只能选奇数个：** $x + x^3 + x^5 + \dots = \frac{x}{1-x^2}$

- **最多选 $k$ 个：** $1 + x + x^2 + \dots + x^k = \frac{1-x^{k+1}}{1-x}$

- **只能选 1 个或不选：** $1 + x$

> 求满足条件的方案数，即将上述对应的分式（或多项式）相乘，随后利用“部分分式分解”与“四大公式”提取 $x^n$ 的系数。

##### 2. 排列问题（顺序相关）—— 指数生成函数 (EGF)

**核心逻辑：**

当选出的物品需要排列（如生成字符串、密码），或物品本身可区分时，必须使用指数生成函数。

定义为：

$$
E(x) = \sum_{k=0}^{\infty} a_k \frac{x^k}{k!} = a_0 + a_1\frac{x}{1!} + a_2\frac{x^2}{2!} + \dots
$$

求选取并排列 $n$ 个元素的方案数，等价于求各类别 EGF 乘积中 **$\frac{x^n}{n!}$ 的系数**（即提取出 $x^n$ 的系数后，再乘以 $n!$）。

**常见约束的 EGF 映射字典（基于泰勒展开）：**

- **无限制（可选任意个）：** $1 + \frac{x}{1!} + \frac{x^2}{2!} + \dots = e^x$

- **只能选偶数个：** $1 + \frac{x^2}{2!} + \frac{x^4}{4!} + \dots = \frac{e^x + e^{-x}}{2}$ （双曲余弦 $\cosh x$）

- **只能选奇数个：** $\frac{x}{1!} + \frac{x^3}{3!} + \dots = \frac{e^x - e^{-x}}{2}$ （双曲正弦 $\sinh x$）

- **至少选 1 个：** $\frac{x}{1!} + \frac{x^2}{2!} + \dots = e^x - 1$

- **只能选 1 个或不选：** $1 + x$

> 将对应的 $e$ 指数式相乘，化简合并（如 $e^{2x} \cdot e^x = e^{3x}$），最后利用 $e^{ax} = \sum \frac{(ax)^n}{n!}$ 展开，提取 $\frac{x^n}{n!}$ 前面的常数部分。

#### 综合对比

|**维度**|**组合 (Combinations)**|**排列 (Permutations)**|
|---|---|---|
|**顺序**|无关|相关|
|**工具**|普通生成函数 (OGF)|指数生成函数 (EGF)|
|**底层代数**|几何级数扩展 $\frac{1}{1-x}$|自然指数展开 $e^x$|
|**目标系数**|$x^n$ 的系数 $a_n$|$\frac{x^n}{n!}$ 的系数 $a_n$|

#### 求解递推关系 (Solving Recurrence Relations)

替代特征方程法，无需猜测特解。标准“机械化四步法”：

1. **乘与加：** 将递推关系式两边同乘 $x^n$，对所有有效 $n$ 求和。

2. **化为 $G(x)$：** 利用求和符号的平移，将所有无穷级数整体代换为未知函数 $G(x)$。

3. **初中代数解出 $G(x)$：** 通过移项和通分，解出 $G(x) = \frac{P(x)}{Q(x)}$。

4. **部分分式与查字典：** 使用部分分式分解 (Partial fraction decomposition) 将巨型分式拆散，套用上述“四大公式”提取 $x^n$ 的系数。

**题目：** 求 $a_n = 3a_{n-1} + 2 \ (n \geq 1)$，已知 $a_0 = 1$。

**Step 1: 乘 $x^n$ 并求和**

$$
\sum_{n=1}^{\infty} a_n x^n - 3 \sum_{n=1}^{\infty} a_{n-1} x^n = \sum_{n=1}^{\infty} 2 x^n
$$

**Step 2: 整体代换为 $G(x)$**

- 第一项：$G(x) - a_0 = G(x) - 1$

- 第二项：强行提 $x$，变为 $x \cdot G(x)$

- 第三项：提 $2x$，变为 $2x(1+x+x^2+\dots) = \frac{2x}{1-x}$

    代入得方程：$(G(x) - 1) - 3xG(x) = \frac{2x}{1-x}$

**Step 3: 解出 $G(x)$**

$$
G(x)(1 - 3x) = 1 + \frac{2x}{1-x} = \frac{1+x}{1-x}
$$

$$
G(x) = \frac{1+x}{(1-x)(1-3x)}
$$

**Step 4: 部分分式分解与提取系数**

设 $\frac{1+x}{(1-x)(1-3x)} = \frac{A}{1-x} + \frac{B}{1-3x}$

解得 $A = -1, B = 2$。

$$
G(x) = \frac{-1}{1-x} + \frac{2}{1-3x}
$$

查字典提取 $x^n$ 系数：

- 前项系数：$-1 \cdot 1^n = -1$

- 后项系数：$2 \cdot 3^n$

    **最终通解：** $a_n = 2 \cdot 3^n - 1$

## V. 容斥原理 (Principle of Inclusion-Exclusion, PIE)

**核心公式 (The Core Formula)**

为了求出 $n$ 个有限集合的**并集 (Union)** 的大小，需要交替地加上奇数个集合的**交集 (Intersections)** 大小，并减去偶数个集合的交集大小：

$$
|A_1 \cup A_2 \dots \cup A_n| = \sum |A_i| - \sum |A_i \cap A_j| + \dots + (-1)^{n+1}|A_1 \cap \dots \cap A_n|
$$

**替代形式：按性质计数 (Alternative Form: Counting by Properties)**

为了求出不满足任何**性质 (Properties)** $P_1, \dots, P_n$ 的元素个数：

$$
N(P'_1 \dots P'_n) = N - \sum N(P_i) + \sum N(P_iP_j) - \dots + (-1)^n N(P_1 \dots P_n)
$$

**关键应用 (Key Applications)**

- **受约束的整数方程 (Constrained Integer Equations):** 先使用允许重复的组合方法计算出无限制的总整数解，然后使用容斥原理 (PIE) 减去那些变量违反**上限约束 (Upper-bound constraints)** 的解。

- **埃拉托斯特尼筛法 (Sieve of Eratosthenes):** 通过寻找不能被小于等于 $\sqrt{n}$ 的任何**素数 (Prime)** 整除的数，来计算出直到 $n$ 的素数个数。

- **满射函数 (Onto Functions / Surjections):** 从大小为 $m$ 的集合到大小为 $n$ 的集合的满射函数个数为：

    $$
n^m - C(n, 1)(n-1)^m + \dots + (-1)^{n-1} C(n, n-1) \cdot 1^m
    $$

- **错排 (Derangements, $D_n$):** 没有任何对象保持在其原始位置上的**排列 (Permutations)**。

    $$
D_n = n! \left[ 1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \dots + (-1)^n \frac{1}{n!} \right]
    $$

    _注 (Note):_ 当 $n \to \infty$ 时，发生错排的概率**收敛于 (Converges to)** $e^{-1} \approx 0.368$。
