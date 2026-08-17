## 一、 数学归纳法 (Mathematical Induction)

**1. 核心原理 (Core Principles)**

- 数学归纳法用于证明命题函数 (propositional function) $P(n)$ 对于所有整数 $n \geq b$ 均成立。
    
- **基础步骤 (Basis Step):** 验证 $P(b)$ 为真。
    
- **归纳步骤 (Inductive Step):** 证明对于任意整数 $k \geq b$，条件语句 (conditional statement) $P(k) \rightarrow P(k + 1)$ 成立。
    
- **推理规则 (Rule of Inference):** $(P(1) \wedge \forall k (P(k) \rightarrow P(k + 1))) \rightarrow \forall n P(n)$
    
- 归纳法的有效性源自**良序性质 (Well-Ordering Property)**（反证法证明：假设存在一个由假命题组成的非空集合，则必有一个最小元素 (least element) $m$，这迫使 $m-1$ 为真，从而与 $m$ 为假产生逻辑矛盾）。
    

**2. 标准证明模板 (Standard Proof Template)**

- **定义 (Define):** 声明论域 (domain) 为“对于所有 $n \geq b, P(n)$”。
    
- **基础步骤 (Basis Step):** 证明 $P(b)$ 为真。
    
- **归纳假设 (Inductive Hypothesis):** 假设对于任意固定整数 $k \geq b$，$P(k)$ 为真。
    
- **目标 (Goal):** 明确陈述需要证明 $P(k + 1)$。
    
- **证明与结论 (Proof & Conclusion):** 使用假设 $P(k)$ 来证明 $P(k+1)$，然后陈述数学归纳法的最终结论。
    

**3. 常见应用与示例 (Common Applications & Examples)**

- **求和 (Summations):** $\sum_{i=1}^n (2i-1) = n^2$ 和 $\sum_{i=1}^n i = \frac{n(n+1)}{2}$。
    
- **不等式 (Inequalities):** $n < 2^n$ 和 $2^n < n!$ （对于 $n \geq 4$）。
    
- **整除性 (Divisibility):** $n^3 - n$ 能被 3 整除。
    
- **集合 (Sets):** 含有 $n$ 个元素的集合有 $2^n$ 个子集 (subsets)。
    
- **几何 (Geometry):** 缺失一个方格的 $2^n \times 2^n$ 棋盘可以用 L 形三格骨牌 (triominoes) 平铺 (tiled)。
    

**4. 常见错误 (Common Mistakes)**

- 错误的证明通常在**归纳步骤 (Inductive Step)** 即 $P(k) \rightarrow P(k+1)$ 中针对特定的较小 $k$ 值失败（例如，在关于相交线的几何证明中，在 $k=2 \rightarrow 3$ 这一步崩溃）。
    

## 二、 强归纳法与良序 (Strong Induction and Well-Ordering)

**1. 强归纳法概念 (Strong Induction Concepts)**

- **定义 (Definition):** 也称为完全归纳法 (complete induction)，假设从基础步骤到 $k$ 的**所有**整数 $j$ 的 $P(j)$ 均成立。
    
- **归纳步骤 (Inductive Step):** 证明 $[P(1) \wedge P(2) \wedge \dots \wedge P(k)] \rightarrow P(k+1)$。
    
- **等价性 (Equivalence):** 数学归纳法、强归纳法和良序性质在逻辑上是完全等价的 (logically equivalent)。
    

**2. 著名的强归纳法证明 (Notable Strong Induction Proofs)**

- **算术基本定理 (Fundamental Theorem of Arithmetic):** 通过假设直到 $k$ 的所有整数都可以被分解，证明每个大于 1 的整数 $n$ 都可以写成素数乘积 (product of primes)。
    
- **邮票问题 (Postage Stamp Problem):** 使用 4 美分和 5 美分的邮票组成任何大于等于 12 美分的邮资，需要访问 $P(k-3)$ 的状态。
    
- **计算几何 (Computational Geometry):** 具有 $n$ 条边的简单多边形 (simple polygon) 可以被三角剖分 (triangulated) 成 $n-2$ 个三角形。这依赖于**引理 1 (Lemma 1)**：每个简单多边形都有一条内部对角线 (interior diagonal)。
    

**3. 良序性质 (The Well-Ordering Property)**

- **公理 (Axiom):** 非负整数的每个非空集合都包含一个最小元素 (least element)。
    
- **推广 (Generalization):** 如果一个集合在特定关系下（例如 $\mathbb{N}$ 在 $\leq$ 关系下，字典序字符串 (lexicographic strings)）每个非空子集都有最小元素，则该集合是良序的 (well-ordered)。
    
- 非良序集合 (Non-well-ordered sets) 包括 $\leq$ 关系下的 $\mathbb{Z}$，以及开区间 (open intervals) 如 $(0, 1)$。
    
- **应用 (Applications):** 证明除法算法 (Division Algorithm) 即 $a = dq + r, 0 \leq r < d$；以及证明任何循环长度 $m \geq 3$ 的循环赛 (Round-Robin Tournaments) 都必然包含长度为 3 的循环。
    

## 三、 递归定义与结构归纳法 (Recursive Definitions and Structural Induction)

**1. 递归定义的函数与序列 (Recursively Defined Functions & Sequences)**

- 通过**基础步骤 (Basis Step)**（初始起始值）和**递归步骤 (Recursive Step)**（根据较小整数计算下一个整数的规则）进行定义。
    
- **斐波那契数列 (Fibonacci Sequence):** $f_0 = 0$, $f_1 = 1$, $f_n = f_{n-1} + f_{n-2}$。对于 $n \geq 3$，$f_n > \alpha^{n-2}$，其中 $\alpha = \frac{1 + \sqrt{5}}{2}$ （黄金比例，Golden Ratio）。
    
- **拉梅定理 (Lamé's Theorem):** 欧几里得算法 (Euclidean Algorithm) 寻找 $\gcd(a,b)$ 的步数不超过 $b$ 的十进制位数 (decimal digits) 的 5 倍。这保证了算法时间复杂度 (time complexity) 为 $O(\log b)$。
    

**2. 递归集合与结构 (Recursive Sets and Structures)**

- 受**排他规则 (exclusion rule)** 支配：集合**仅**包含来自基础步骤和递归步骤生成的元素。
    
- **字符串 (Strings, $\Sigma^*$):** 基础步骤：空字符串 (empty string) $\lambda \in \Sigma^*$。递归步骤：如果 $w \in \Sigma^*$ 且 $x \in \Sigma$，则 $wx \in \Sigma^*$。长度 (Length) 和连接 (concatenation) 的操作也是递归定义的。
    
- **命题逻辑 (Propositional Logic):** 使用逻辑连接词 (logical connectives) 从 $\mathbf{T}, \mathbf{F}$ 以及变量递归地构建合式公式 (well-formed formulae, WFFs)。
    
- **满二叉树 (Full Binary Trees):** 树高 (Height) 为 $h(T) = 1 + \max(h(T_1), h(T_2))$。顶点总数 (Total vertices) 为 $n(T) = 1 + n(T_1) + n(T_2)$。
    

**3. 结构与广义归纳法 (Structural and Generalized Induction)**

- **结构归纳法 (Structural Induction):** 用于证明递归定义集合的性质。基础步骤证明基础元素成立，递归步骤则在假设基础元素成立的前提下，证明构造出来的新元素也成立。
    
- _定理 (Theorem):_ 满二叉树满足 $n(T) \leq 2^{h(T)+1} - 1$。
    
- **广义归纳法 (Generalized Induction):** 将归纳法扩展到具有良序性质的非整数集合，例如按字典序 (lexicographically) 排序的 $\mathbb{N} \times \mathbb{N}$ 坐标对。
    
- **分形 (Fractals):** 通过跨尺度重复模式构建的视觉递归几何（例如科赫曲线 Koch Curve，谢尔宾斯基三角形 Sierpinski Triangle）。
    

## 四、 递归算法 (Recursive Algorithms)

**1. 核心原理 (Core Principles)**

- 如果一个算法将问题简化为同一问题的更小实例 (smaller instance)，则该算法是递归的 (recursive)。
    
- **终止 (Termination):** 必须最终达到具有明确已知解的基本情况 (base case)。
    
- 正确性 (Correctness) 需要严格使用数学归纳法或强归纳法来进行证明。
    

**2. 基础算法 (Fundamental Algorithms)**

- **阶乘 / 幂运算 (Factorial / Exponentiation):** $n! = n \cdot \text{fact}(n - 1)$ 且 $a^n = a \cdot \text{power}(a, n - 1)$。
    
- **最大公约数 (Greatest Common Divisor, GCD):** 当 $a < b$ 时，$\gcd(a, b) = \gcd(b \bmod a, a)$。
    
- **模幂运算 (Modular Exponentiation):** 通过检查指数的奇偶性来拆分 $n$，以实现最优递归。
    
- **二分查找 (Binary Search):** 计算中点 (midpoint) $m = \lfloor(i + j)/2\rfloor$，以递归方式搜索已排序数组 (sorted array) 的左半部分或右半部分。
    

**3. 归并排序 (Merge Sort)**

- **分治法 (Divide-and-Conquer):** 将列表拆分为单个元素，然后递归地合并 (merge) 它们。
    
- **合并子程序 (Merge Subroutine):** 合并两个大小为 $m$ 和 $n$ 的有序列表最多需要 $m + n - 1$ 次比较 (comparisons)。
    
- **时间复杂度 (Time Complexity):** 对二叉树拆分的各层求和得出 $n \log n - n + 1$，从而确立了 $O(n \log n)$ 的复杂度。
    

**4. 递归与迭代对比 (Recursion vs. Iteration)**

- **递归 (Recursion):** 优雅、简短，在数学上更易于阅读和证明。
    
- **迭代 (Iteration):** 计算效率更高 (computationally efficient)（节省时间和内存），因为它避免了调用栈分配 (call-stack allocation) 和冗余计算（例如，迭代计算斐波那契数列的时间复杂度为 $O(n)$，而朴素递归 (naive recursion) 则是指数级的 (exponential)）。