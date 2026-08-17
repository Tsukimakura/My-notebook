# 11_Graphs

## **1. 图的基础知识与术语 (Graph Basics & Terminology)**

- **图的组成 (Graph Components)：** 图 $G = (V,E)$ 由顶点 (vertices, $V$) 和边 (edges, $E$) 组成。

- **无向图类型 (Undirected Graph Types)：**

    - **简单图 (Simple graph)：** 无环 (loops)，无多重边 (multiple edges)。

    - **多重图 (Multigraph)：** 允许有多重边。

    - **伪图 (Pseudograph)：** 允许有多重边和环。

- **有向图类型 (Directed Graph Types)：** 简单有向图 (Simple directed graphs) 和有向多重图 (directed multigraphs)。

- **无向图的度 (Degrees in Undirected Graphs, $\deg(v)$)：** 与顶点 $v$ 相连的边数（一个环会对度数贡献 2）。

    - **孤立点 (Isolated)：** $\deg(v) = 0$。

    - **悬挂点 (Pendant)：** $\deg(v) = 1$。

- **握手定理 (Handshaking Theorem)：** $\sum_{v \in V} \deg(v) = 2e$。

    - _推论 (Corollary)：_ 任何无向图中，度数为奇数 (odd) 的顶点必定有偶数 (even) 个。

- **有向图的度 (Degrees in Directed Graphs)：** 所有顶点的入度之和 (Sum of in-degrees) = 出度之和 (Sum of out-degrees) = 总边数 $|E|$。

## **2. 特殊图与匹配 (Special Graphs & Matchings)**

- **完全图 (Complete Graph, $K_n$)：** 每对不同的顶点之间都有一条边相连；共包含 $n(n-1)/2$ 条边。

- **其他类型 (Other Types)：** 圈图/环图 (Cycles, $C_n$)、轮图 (Wheels, $W_n$)、n维超立方体 (n-Cubes, $Q_n$)。

- **二分图/二部图 (Bipartite Graphs)：** 顶点可以被划分为两个不相交的集合 (disjoint sets) $V_1$ 和 $V_2$，且同集合内部没有边相连。当且仅当一个图是 2-可着色的 (2-colorable) 时，它是二分图。

- **霍尔婚姻定理 (Hall's Marriage Theorem)：** 当且仅当对于 $V_1$ 的所有子集 $A \subseteq V_1$ 均满足 $|N(A)| \ge |A|$ 时，该二分图存在一个从 $V_1$ 到 $V_2$ 的完全匹配 (complete matching)。

## **3. 矩阵表示与同构 (Matrix Representations & Isomorphism)**

- **邻接矩阵 (Adjacency Matrix, $A$)：**

	- **无向图 (Undirected)：** 是对称的 (Symmetric, $a_{ij} = a_{ji}$)。某一行的和等于 $\deg(v_i)$ 减去顶点 $v_i$ 处环的数量。

    - **有向图 (Directed)：** 行和 (Row sum) = 出度；列和 (Column sum) = 入度。

- **关联矩阵 (Incidence Matrix)：** 列 (Columns) 代表边。对于连接两个不同顶点的边，该列恰好有两个 1；对于环，该列恰好有一个 1。

- **图的同构 (Graph Isomorphism)：** 如果存在一个双射 (bijection) 能够保持所有的邻接关系 (adjacency relationships) 不变，则两个图是同构的。

- **不变量 / 同构检查 (Invariants / Isomorphism Checks)：** 两个图的顶点数 (Number of vertices)、边数 (edges)、度序列 (degree sequences) 以及特定的子图/圈 (subgraphs/cycles) 必须完全一致。

## **4. 连通性与路径 (Connectivity & Pathing)**

- **路径计数 (Counting Paths)：** 从 $v_i$ 到 $v_j$ 长度为 $r$ 的路径数量，恰好等于矩阵 $A^r$ 中的 $(i, j)$ 元素值。

- **无向图的连通性 (Undirected Connectivity)：**

	- **割点/割边 (Cut Vertex/Edge)：** 移除它会使得图的连通分支数 (connected components) 增加。

- **有向图的连通性 (Directed Connectivity)：**

	- **强连通 (Strongly Connected)：** 任意一对顶点之间在两个方向上都存在有向路径 (directed path)。

    - **弱连通 (Weakly Connected)：** 其底层的无向图 (underlying undirected graph) 是连通的。

## **5. 欧拉与哈密顿路线 (Euler & Hamilton Routes)**

- **欧拉 (Euler) - 焦点：边 (EDGES) - 恰好遍历每条边一次**

    - **无向回路 (Undirected Circuit)：** 存在 $\iff$ **所有** 顶点的度数均为**偶数**。

    - **无向路径 (Undirected Path)：** 存在 $\iff$ **恰好有两个** 顶点的度数为**奇数**。

    - **有向回路 (Directed Circuit)：** 存在 $\iff$ **所有**顶点的入度 = 出度。

- **哈密顿 (Hamilton) - 焦点：顶点 (VERTICES) - 恰好访问每个顶点一次**

    - **狄拉克定理 (Dirac's Theorem)：** 如果所有顶点的 $\deg(v) \ge n/2$，则必定存在哈密顿回路 (Hamilton circuit)。

    - **奥尔定理 (Ore's Theorem)：** 如果对于所有不相邻的顶点对 (non-adjacent pairs)，都有 $\deg(u) + \deg(v) \ge n$，则必定存在哈密顿回路。

## **6. 最短路径算法 (Shortest Path Algorithms)**

- **迪杰斯特拉算法 (Dijkstra’s Algorithm)：** 寻找两个顶点之间的最短路径。**限制条件：** 边权值必须为正数 (positive)。时间复杂度为 $O(n^2)$。

- **弗洛伊德算法 (Floyd’s Algorithm)：** 求解任意两点间的最短路径 (all-pairs shortest path)。可以处理负权边，但**不能**处理负权回路 (negative weight circuits)。

- **旅行商问题 (Traveling Salesman Problem, TSP)：** 寻找总权重最小的哈密顿回路。求精确解需要 $O(n!)$ 的时间，因此面对大规模数据时必须使用近似算法 (approximations)。

## **7. 平面图 (Planar Graphs)**

- **欧拉公式 (Euler's Formula)：** 对于连通的平面图，$r = e - v + 2$（区域数 Regions = 边数 Edges - 顶点数 Vertices + 2）。

    - _注意：_ 永远恰好存在 1 个无界区域 (unbounded region)。

- **区域的度 (Region Degrees)：** 所有区域的度数之和等于 $2e$。

- **边数边界 - 用于证明非平面性 (Edge Bounds - To prove Non-Planarity)：**

    - **一般边界 (General Bound, 顶点数 $v \ge 3$)：** $e \le 3v - 6$ （通常用于证明 $K_5$ 是非平面图）。

    - **无 3-圈 / 二分图情况 (No 3-Cycles / Bipartite)：** $e \le 2v - 4$ （通常用于证明 $K_{3,3}$ 是非平面图）。

- **库拉托夫斯基定理 (Kuratowski’s Theorem)：** 一个图是非平面图 $\iff$ 它包含一个与 $K_5$ 或 $K_{3,3}$ 同胚 (homeomorphic) 的子图 (subgraph)。

## **8. 图的着色 (Graph Coloring)**

- **色数 (Chromatic Number, $\chi(G)$)：** 确保所有相邻的顶点颜色均不相同所需的最小颜色数量。

- **四色定理 (Four Color Theorem)：** 对于任何**平面图 (PLANAR graph)**，其色数 $\chi(G) \le 4$。

- **常见图的标准色数 (Standard Chromatic Numbers)：**

    - 路径图 (Path) = 2。

    - 偶环图 (Even Cycle) = 2。

    - 奇环图 (Odd Cycle) = 3。

    - 完全图 (Complete Graph, $K_n$) = $n$。

    - 二分图 (Bipartite Graph) = 2。

- **应用场景 (Applications)：** 调度规划 (Scheduling)（其中边代表冲突 conflicts，颜色代表时间段/槽 time slots）以及栖息地分配 (habitat assignment) 等。

这是一份为你精心整理的《$n$维超立方体图 $Q_n$ 核心性质》精炼复习笔记。去除了所有冗余的学术废话，直接直击期末考与考研的核心得分点。

## $n$维超立方体图 $Q_n$

### 1. 拓扑结构定义 (Topological Definition)

- **顶点映射：** $Q_n$ 的每个顶点唯一对应一个长度为 $n$ 的二进制位串（$01$ 字符串）。

- **连边规则：** 两个顶点之间有边相连，当且仅当它们对应的位串**恰好只有一位不同**（即汉明距离 $H(u, v) = 1$）。

### 2. 基础数量性质 (Quantitative Properties)

- **顶点数 ($|V|$)：**

    $$
|V| = 2^n
    $$

    _(解析：长度为 $n$ 的二进制串总共有 $2^n$ 种组合。)_

- **顶点度数 ($\deg(v)$)：** $Q_n$ 是一个 **$n$-正则图**，即每个顶点的度数均为 $n$。

    _(解析：任意一个位串都有 $n$ 个位置可以进行 $0/1$ 翻转，故每个点都有 $n$ 个邻居。)_

- **边数 ($|E|$)：**

    $$
|E| = n \cdot 2^{n-1}
    $$

    _(证明：根据握手定理，$\sum \deg(v) = n \cdot 2^n = 2|E|$，移项即得。)_

### 3. 着色性与图的类别 (Coloring & Bipartiteness)

- **二分图判定：** $Q_n$ **永远是二分图**。

    - _划分依据：_ 可将顶点集分为 $V_1$（位串中 $1$ 的个数为奇数）和 $V_2$（位串中 $1$ 的个数为偶数）。由于每条边翻转且仅翻转一位，必然在奇偶间跳跃，故 $V_1, V_2$ 内部无边相连。

- **点色数 ($\chi(G)$)：**

    $$
\chi(G) = 2
    $$

    _(解析：由于是二分图，其着色数稳定为 2。)_

- **围长 (Girth)：** 当 $n \ge 2$ 时，最小圈的长度为 **4**（$Q_n$ 不含三角形，只含偶数圈）。

### 4. 路径与回路性质 (Eulerian & Hamiltonian)

- **欧拉性 (Eulerian)：**

	- 当 $n$ 为**偶数**时：$Q_n$ 存在**欧拉回路**（所有点度数均为偶数）。

    - 当 $n$ 为**奇数**时：$Q_n$ **不存在**欧拉回路（除了 $n=1$ 存在欧拉路径外，其余奇数 $n$ 连欧拉路径也没有）。

- **哈密尔顿性 (Hamiltonian)：**

	- 当 $n \ge 2$ 时，$Q_n$ **必然存在哈密尔顿回路**。

    - _底层映射：_ 在 $Q_n$ 中寻找一条哈密尔顿回路，在代数和计算机底层上完美等价于构造一个 **$n$ 位循环格雷码 (Gray Code)**。

### 5. 平面性 (Planarity)

- **结论：**

	- 当 $n \le 3$ 时（$Q_1, Q_2, Q_3$），$Q_n$ 是**平面图**。

    - 当 $n \ge 4$ 时，$Q_n$ **不是平面图**。

- _考场秒杀证明 ($Q_4$)：_ $Q_4$ 的 $|V|=16, |E|=32$。若其为平面图，因其不含三角形（围长为4），必须满足边数上限公式 $|E| \le 2|V| - 4$。

    带入计算：$32 \le 2(16) - 4 = 28$ 矛盾！故 $Q_4$ 及更高维绝非平面图。
