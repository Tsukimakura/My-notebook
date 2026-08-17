# 10_Relations

## **1. 关系的核心性质 (Core Properties of Relations)**

- **二元关系定义 (Binary Relation Definition):** 它是 $A \times B$ 的子集（从 $A$ 到 $B$ 的关系）或 $A \times A$ 的子集（集合 $A$ 上的关系）。

- **所有可能的关系总数 (Total Possible Relations):** 一个含有 $n$ 个元素的集合恰好有 $2^{n^2}$ 种可能的关系。

- **自反性 (Reflexive):** $\forall x [x \in U \to (x,x) \in R]$。

- **对称性 (Symmetric):** $\forall x \forall y [(x,y) \in R \to (y,x) \in R]$。

- **反对称性 (Antisymmetric):** $\forall x \forall y [(x,y) \in R \land (y,x) \in R \to x = y]$。

- **传递性 (Transitive):** $\forall x \forall y \forall z [(x,y) \in R \land (y,z) \in R \to (x,z) \in R]$。

- **关键逻辑陷阱 (Critical Logic Trap):** 对称性 + 传递性**不能**保证自反性。因为那些与任何元素都不相关联的孤立元素将无法满足自反性的要求。

- **复合 (Composition, $R_2 \circ R_1$):** 此操作首先应用 $R_1$，然后再应用 $R_2$。

- **关系的幂 (Powers of a Relation, $R^n$):** 通过归纳法定义，其中 $R^1 = R$ 且 $R^{n+1} = R^n \circ R$。

- **传递性定理 (Transitivity Theorem):** 当且仅当对于所有正整数 $n$ 都有 $R^n \subseteq R$ 时，关系 $R$ 才是传递的。

## **2. 关系的表示 (Representing Relations)**

|**性质 (Property)**|**矩阵表示 (Matrix Representation, MR​)**|**有向图表示 (Digraph Representation)**|
|---|---|---|
|**自反的 (Reflexive)**|主对角线 (Main diagonal) 全部由 1 组成|每个顶点 (vertex) 都有一个环 (loop)|
|**对称的 (Symmetric)**|矩阵等于其转置矩阵 (Transpose, $M_R = M_R^T$)|每条有向边 (directed edge) 都有对应的反向/返回边 (return edge)|
|**反对称的 (Antisymmetric)**|对于所有 $i \neq j$，如果 $m_{ij} = 1 \implies m_{ji} = 0$|任意两个不同顶点之间不存在返回边|

- **有向图路径 (Digraph Paths):** 当且仅当存在一条从顶点 $x$ 到顶点 $y$ 长度恰好为 $n$ 的有向路径 (direct path) 时，有序对 $(x, y) \in R^n$。

- **逆矩阵规则 (Inverse Matrix Rule):** 逆关系 (inverse relation) 的矩阵是原矩阵的转置 ($M_{R^{-1}} = M_R^T$)。

- **逆复合规则 (Inverse Composition Rule):** $(S \circ T)^{-1} = T^{-1} \circ S^{-1}$（请注意运算顺序是颠倒的）。

## **3. 关系的闭包 (Closures of Relations)**

- **闭包概念 (Closure Concept):** 为了满足特定数学性质而向关系 $R$ 中添加的最少数量的有序对 (ordered pairs)。

- **自反闭包 (Reflexive Closure, $r(R)$):** 计算方法为 $R \cup \Delta$，通过向所有顶点添加环来实现。

- **对称闭包 (Symmetric Closure, $s(R)$):** 计算方法为 $R \cup R^{-1}$，通过为每条现有的有向弧 (directed arc) 添加反向弧来实现。

- **传递闭包 (Transitive Closure, $t(R)$):** 等同于连通性关系 (connectivity relation) $R^*$，计算方法为 $\bigcup_{i=1}^{n} R^i$。

- **布尔矩阵算法 (Boolean Matrix Algorithm):** 使用布尔矩阵幂计算传递闭包，其时间复杂度 (time complexity) 为 $O(n^4)$。

- **沃舍尔算法 (Warshall's Algorithm):** 一种计算传递闭包的高效方法，通过评估内部顶点 (interior vertices) 来实现，运算时间复杂度为 $O(n^3)$。

	**手算技巧：画十字线**

	当以节点 $k$ 为中转站时，在矩阵的第 $k$ 行和第 $k$ 列上画一个十字。

	只有十字的竖线（第 $k$ 列）上有 1 的行，才有可能发生改变；只有十字的横线（第 $k$ 行）上有 1 的列，才可能变成 1。交叉点决定了哪些位置需要填 1。

## **4. 等价关系 (Equivalence Relations)**

- **定义 (Definition):** 严格同时满足**自反的、对称的、且传递的**关系。

- **等价类 (Equivalence Classes, $[a]_R$):** 与特定元素 $a$ 具有关系的所有元素组成的不同集合。

- **类标识符/代表元 (Class Identifiers/Representatives):** 等价类中的任何元素都可以作为其代表。

- **基本定理 (The Fundamental Theorem):** 集合上的等价关系完全等同于该集合的划分 (partition)。

- **划分标准 (Partition Criteria):** 一个有效的划分由互不相交的 (disjoint)、非空的子集组成，这些子集的总并集 (union) 完全重构了原集合。

- **关系的交集 (Intersection of Relations):** 如果 $R$ 和 $S$ 是等价关系，那么 $R \cap S$ 必然也是一个等价关系。

- **关系的并集 (Union of Relations):** $R \cup S$ 通常**不是**等价关系，因为它经常会破坏传递性。

- **并集的闭包 (Closure of Union):** 并集的传递闭包，表示为 $(R_1 \cup R_2)^*$，**是**一个等价关系。

## **5. 偏序关系 (Partial Orderings / Posets)**

- **定义 (Definition):** 严格同时满足**自反的、反对称的、且传递的**关系。

- **全序 / 线性序 / 链 (Total Order / Linear Order / Chain):** 一种特殊的偏序集 (poset)，其中每一对元素都可以相互比较 (comparable)。

- **良序集 (Well-Ordered Set):** 一种全序集，其中每一个非空子集都必定包含一个最小元素 (least element)。

- **哈斯图 (Hasse Diagrams):** 一种简化的可视图形。创建方法是：取一个有向图，去除所有环 (loops)，去除所有因传递性产生的捷径边 (transitive shortcut edges)，并把所有具有方向性的线段排列为朝上。

- **格 (Lattices):** 一种严格定义的偏序集，其中每一对元素都同时拥有一个最小上界 (Least Upper Bound, LUB) 和最大下界 (Greatest Lower Bound, GLB)。

- **拓扑排序 (Topological Sorting):** 一种算法，用于通过依次移除极小元素 (minimal elements)，从偏序关系中提取出一个相容的全序关系。

|**偏序集术语 (Poset Terminology)**|**数学定义 (Mathematical Definition)**|
|---|---|
|**极大元素 (Maximal Element)**|集合中没有任何元素严格大于它（视觉上表现为顶部的节点）|
|**极小元素 (Minimal Element)**|集合中没有任何元素严格小于它（视觉上表现为底部的节点）|
|**最大元素 (Greatest Element)**|唯一的、大于或等于所有其他元素的元素|
|**最小元素 (Least Element)**|唯一的、小于或等于所有其他元素的元素|
|**上界 (Upper Bound)**|大于或等于 ($\ge$) 目标子集中所有元素的任意元素|
|**下界 (Lower Bound)**|小于或等于 ($\le$) 目标子集中所有元素的任意元素|
