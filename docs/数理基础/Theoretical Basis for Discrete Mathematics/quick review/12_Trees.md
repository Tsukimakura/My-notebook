# 12_Trees

## **1. 树的基础知识与性质 (Tree Fundamentals & Properties)**

- **树 (Tree):** 一个连通的无向图 (connected undirected graph)，且不包含简单回路 (simple circuits)（本质上是一个简单图 (simple graph)）。

- **森林 (Forest):** 一个不包含简单回路的无向图。它的每一个连通分量 (connected component) 都是一棵树。

- **路径唯一性定理 (Path Uniqueness Theorem):** 一个图是树 $\iff$ 任意两个顶点 (vertices) 之间存在唯一的简单路径 (unique simple path)。

- **边数定理 (Edge Count Theorem):** 一棵含有 $n$ 个顶点的树总是恰好拥有 $n-1$ 条边 (edges)。

- **二分图性质 (Bipartite Nature):** 每一棵树都是二分图 (bipartite graph)（色数/chromatic number 为 2），因为可以通过在偶数层和奇数层交替染色来进行 2-着色 (2-colored)。

## **2. 有根树与 $m$-叉分类 (Rooted Trees & $m$-ary Classifications)**

- **有根树 (Rooted Tree):** 指定了一个根顶点 (root vertex) 的树，所有的边都指离 (directing away from) 该根节点。

- **顶点 (Vertices):**

    - **内部顶点 (Internal Vertex):** 至少有 1 个子节点 (child)。

    - **叶子节点 (Leaf):** 有 0 个子节点。

- **$m$-叉树 ($m$-ary Trees):**

    - **$m$-叉 ($m$-ary):** 每个内部顶点最多有 $m$ 个子节点。

    - **满 $m$-叉 (Full $m$-ary):** 每个内部顶点恰好有 $m$ 个子节点。

- **满 $m$-叉树公式 (Formulas for Full $m$-ary Trees):** 已知总顶点数 $n$，内部顶点数 $i$，以及叶子节点数 $l$：

    - $n = mi + 1$

    - $n = i + l$

- **高度与平衡界限 (Height & Balance Bound):** 对于一棵高度为 $h$、带有 $l$ 个叶子节点的 $m$-叉树：

    - $l \le m^h \implies h \ge \lceil \log_m l \rceil$。

    - 如果该树既是满的 (full) 又是平衡的 (balanced)，则等式严格成立 ($h = \lceil \log_m l \rceil$)。

## **3. 树的遍历与表达式树 (Tree Traversal & Expression Trees)**

**二叉表达式树 (Binary Expression Trees):** 内部顶点存放运算符 (operators)，叶子节点存放操作数 (operands)。根节点最后被计算 (evaluated)。

|**遍历 (Traversal)**|**顺序 (Sequence)**|**表达式记法 (Expression Notation)**|**计算规则 (Evaluation Rule)**|
|---|---|---|---|
|**前序 (Preorder)**|根 $\to$ 左 $\to$ 右 (Root $\to$ Left $\to$ Right)|**前缀 / 波兰式 (Prefix / Polish)**|从右向左计算 (**Right-to-Left**)|
|**中序 (Inorder)**|左 $\to$ 根 $\to$ 右 (Left $\to$ Root $\to$ Right)|**中缀 (Infix)**（需要括号 Requires parentheses）|标准代数顺序 (Standard algebraic order)|
|**后序 (Postorder)**|左 $\to$ 右 $\to$ 根 (Left $\to$ Right $\to$ Root)|**后缀 / 逆波兰式 (Postfix / Reverse Polish)**|从左向右计算 (**Left-to-Right**)|

## **4. 树的实际应用 (Practical Applications of Trees)**

- **二叉搜索树 (Binary Search Trees, BST):** 左子节点 $<$ 父节点 $<$ 右子节点。在一棵平衡的二叉搜索树中，查找/插入最多需要 $\lceil \log(n+1) \rceil$ 次比较 (comparisons)。

- **决策树 (Decision Trees):** 内部顶点对决策/测试 (decisions/tests) 进行建模；叶子节点代表最终结果 (final outcomes)。

- **前缀码 (Prefix Codes):** 确保没有任何位串 (bit string) 是另一个位串的前缀，从而防止产生歧义的解码 (ambiguous decoding)。左侧边 = 0，右侧边 = 1，叶子 = 字符 (characters)。

- **哈夫曼编码 (Huffman Coding):** 一种自底向上 (bottom-up) 的贪心算法 (greedy algorithm)，通过最小化 $\sum_{i=1}^{t} l_i w_i$ 来创建最高效的前缀码。它不断地将权重最小的两个子树 (least-weight subtrees) 合并成一棵新树。

## **5. 生成树 (Spanning Trees)**

- **定义 (Definition):** 包含原图 $G$ 中每一个顶点，且构成一棵树的子图 (subgraph)。

- **连通性定理 (Connectivity Theorem):** 一个简单图是连通的 $\iff$ 它拥有一棵生成树 (spanning tree)。

- **深度优先搜索 (Depth-First Search, DFS):** 深入探索以形成路径，当遇到死胡同时回溯 (backtracks)。这直接模拟了用于 $n$-皇后问题和图着色的回溯算法 (backtracking algorithms)。

- **广度优先搜索 (Breadth-First Search, BFS):** 逐层 (level-by-level) 向外扩展，严格避免产生简单回路。

## **6. 最小生成树 (Minimum Spanning Trees, MST)**

最小生成树在保持所有顶点连通的同时，最小化边权重 (edge weights) 的总和。以下两种算法都是贪心算法 (greedy algorithms)，并在恰好添加了 $n-1$ 条边时停止。

- **普林算法 / Prim 算法 (Prim's Algorithm, 以树为中心 Tree-Centric):** 从最小的边开始。不断添加**与树中已有顶点相连 (incident to a vertex already in the tree)** 且权重最小的可用边，同时确保不形成回路。

- **克鲁斯卡尔算法 / Kruskal 算法 (Kruskal's Algorithm, 以边为中心 Edge-Centric):** 全局评估所有边，从最轻到最重。不断添加**整个图 (entire graph) 中**权重最小的边，同时确保不形成回路。
