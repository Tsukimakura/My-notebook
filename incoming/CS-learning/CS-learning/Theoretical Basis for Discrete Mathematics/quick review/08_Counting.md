## I. 基本计数原理 (Fundamental Counting Principles)

### 基本计数法则 (Basic Rules of Counting)

- **乘法法则 (The Product Rule)**: 如果两个独立任务可以分别以 $n_1$ 和 $n_2$ 种方式完成，那么完成该过程的总方式为 $n_1 \cdot n_2$。在集合论 (set theory) 中，笛卡尔积 (Cartesian product) 的基数 (cardinality) 为 $|A_1 \times A_2| = |A_1| \cdot |A_2|$。
    
- **加法法则 (The Sum Rule)**: 如果一个任务可以以 $n_1$ 种方式或 $n_2$ 种互斥 (mutually exclusive) 的方式完成，则总数为 $n_1 + n_2$。在集合论中，对于不相交集合 (disjoint sets)，$|A \cup B| = |A| + |B|$。
    
- **减法法则 / 容斥原理 (The Subtraction Rule / Inclusion-Exclusion)**: 当方法不是互斥的时，通过减去公共方法来防止重复计数 (double-counting)。在数学上，$|A \cup B| = |A| + |B| - |A \cap B|$。
    
- **除法法则 (The Division Rule)**: 如果一个过程总共有 $n$ 种方式，但每个不同的结果被精确计算了 $d$ 次，则有 $n/d$ 种不同的方式。
    

### 标准应用 (Standard Applications)

- **位串 (Bit Strings)**: 长度为 $n$ 的可能位串有 $2^n$ 种。
    
- **子集 (Subsets)**: 具有 $n$ 个元素的有限集合 (finite set) 恰好有 $2^n$ 个子集。
    
- **函数 (Functions)**: 从大小为 $m$ 的定义域 (domain) 到大小为 $n$ 的到达域 / 陪域 (codomain) 共有 $n^m$ 个函数。
    
- **单射函数 (Injective Functions)**: 从大小为 $m$ 的集合到大小为 $n$ 的集合（其中 $m \le n$）的一对一函数 (one-to-one functions) 数量为 $n(n-1)\dots(n-m+1)$。
    
- **树状图 (Tree Diagrams)**: 通过计算分支的终端叶子 (terminal leaves)，为计算复杂的、相互依赖的步骤提供了一种直观的方法。
    

## II. 鸽巢原理 (The Pigeonhole Principle)

### 核心原则 (Core Principles)

- **基本原理 (Basic Principle)**: 如果将 $k+1$ 个物体放入 $k$ 个盒子中，则至少有一个盒子包含两个或更多个物体。
    
- **函数推论 (Function Corollary)**: 将 $k+1$ 个元素的定义域映射到 $k$ 个元素的到达域的函数不能是单射的 (injective)。
    
- **广义原理 (Generalized Principle)**: 如果将 $N$ 个物体放入 $k$ 个盒子中，则至少有一个盒子包含至少 $\lceil N/k \rceil$ 个物体。
    

### 高级应用与拉姆齐理论 (Advanced Applications & Ramsey Theory)

- **单调子序列 (Monotonic Subsequences)**: 任何包含 $n^2+1$ 个不同整数的序列，都包含一个长度为 $n+1$ 的严格递增 (strictly increasing) 或递减 (decreasing) 的子序列。
    
- **拉姆齐理论 (Ramsey Theory)**: 该理论探索在混乱中必须出现秩序的条件。
    
- **拉姆齐数 (Ramsey Number)**: $R(m,n)$ 表示保证有 $m$ 个共同朋友或 $n$ 个共同敌人所需的最小人数。
    
- **派对问题 (The Party Problem)**: $R(3,3) = 6$，意味着在任意 6 个人中，保证有 3 个互相认识的人（共同熟人）或 3 个互相不认识的人（共同陌生人）。
    

## III. 排列、组合与分配 (Permutations, Combinations & Distributions)

### 核心公式总结 (Core Formulas Summary)

|**选择类型 (Selection Type)**|**是否允许重复？ (Repetition?)**|**公式 (Formula)**|
|---|---|---|
|**$r$-排列 ($r$-permutations)** (顺序相关)|否|$P(n, r) = \frac{n!}{(n-r)!}$|
|**$r$-组合 ($r$-combinations)** (顺序无关)|否|$C(n, r) = \frac{n!}{r!(n-r)!}$|
|**$r$-排列 ($r$-permutations)**|是|$n^r$|
|**$r$-组合 ($r$-combinations)** (隔板法 / Stars & Bars)|是|$C(n+r-1, r)$|

### 高级排列 (Advanced Arrangements)

- **不可区分对象 (Indistinguishable Objects)**: 排列 $n$ 个对象，其中大小分别为 $n_1, n_2, \dots, n_k$ 的子集是相同的，使用公式 $\frac{n!}{n_1!n_2!\dots n_k!}$。
    
- **整数方程 (Integer Equations)**: 寻找 $x_1 + x_2 + \dots + x_n = r$ 的非负整数解，使用允许重复的组合 (combinations with repetition) 求解，产生 $C(n+r-1, r)$ 个解。
    
- **组合的对称性 (Symmetry of Combinations)**: 选择保留 $r$ 个项目在数学上等同于选择排除 $n-r$ 个项目，表示为 $C(n, r) = C(n, n-r)$。
    

### 组合证明方法 (Combinatorial Proof Methods)

- **双重计数 (Double Counting)**: 通过使用不同的逻辑证明两边计算完全相同的对象集合，来证明一个恒等式。
    
- **双射证明 (Bijective Proof)**: 通过在每一侧计数的集合之间建立严格的一一对应关系 (one-to-one correspondence) 来证明恒等式。
    

### 将对象分配到盒子中 (Distributing Objects into Boxes)

- **可区分对象与可区分盒子 (Distinguishable Objects & Distinguishable Boxes)**: 共有 $\frac{n!}{n_1!n_2!\dots n_k!}$ 种分配方式。
    
- **不可区分对象与可区分盒子 (Indistinguishable Objects & Distinguishable Boxes)**: 共有 $C(n+k-1, n)$ 种分配方式。
    
- **可区分对象与不可区分盒子 (Distinguishable Objects & Indistinguishable Boxes)**: 需要使用划分 (partitioning) 和第二类斯特林数 (Stirling numbers of the second kind)。
    
- **不可区分对象与不可区分盒子 (Indistinguishable Objects & Indistinguishable Boxes)**: 等同于整数划分 (integer partitioning) $p_k(n)$，枚举总和为 $n$ 的方式。
    

## IV. 二项式系数与恒等式 (Binomial Coefficients & Identities)

### 二项式定理 (The Binomial Theorem)

二项式定理提供了二项式幂的代数展开式 (algebraic expansion)：

$$(x+y)^n = \sum_{j=0}^{n} \binom{n}{j} x^{n-j}y^j$$

### 基本恒等式 (Fundamental Identities)

- **系数和 (Sum of Coefficients)**: $\sum_{k=0}^{n} \binom{n}{k} = 2^n$。
    
- **交错和 (Alternating Sum)**: $\sum_{k=0}^{n} (-1)^k \binom{n}{k} = 0$。
    
- **帕斯卡恒等式 (Pascal's Identity)**: $\binom{n+1}{k} = \binom{n}{k-1} + \binom{n}{k}$。这个几何规则表明，在帕斯卡三角形 (Pascal's Triangle) 中将相邻的系数相加，会直接得到它们下方的值。
    
- **范德蒙恒等式 (Vandermonde's Identity)**: $\binom{m+n}{r} = \sum_{k=0}^{r} \binom{m}{r-k}\binom{n}{k}$。
    
- **平方和 (Sum of Squares)**: $\binom{2n}{n} = \sum_{k=0}^{n} \binom{n}{k}^2$。
    

## V. 生成算法 (Generation Algorithms)

### 生成下一个排列：字典序 (Generating the Next Permutation: Lexicographic Order)

1. **寻找枢轴 (Find Pivot)**: 找到满足 $a_j < a_{j+1}$ 的最大索引 $j$。
    
2. **寻找后继 (Find Successor)**: 在 $j$ 之后的后缀中，找到严格大于 $a_j$ 的最小整数，其位置为索引 $k$。
    
3. **交换 (Swap)**: 交换 $a_j$ 和 $a_k$ 处的值。
    
4. **排序后缀 (Sort Suffix)**: 反转原索引 $j$ 之后的元素序列。
    

### 生成组合：通过位串生成子集 (Generating Combinations: Subsets via Bit Strings)

1. 找到当前二进制字符串 (binary string) 中最右边的 0。
    
2. 将此 0 翻转为 1。
    
3. 将该位置右侧的所有 1 翻转为 0。
    

### 生成下一个 r-组合 (Generating the Next r-Combination)

1. **确定目标 (Identify Target)**: 找到最右侧尚未达到其最大允许值 $n-r+i$ 的元素 $a_i$。
    
2. **递增 (Increment)**: 将 $a_i$ 增加 1。
    
3. **重置 (Reset)**: 将右侧所有后续元素设置为恰好比其直接前驱大 1（即 $a_j = a_i + j - i$）。