# 10_Introduction to Trees

## I. Core Definitions

- **Tree:** A connected undirected graph with no simple circuits.

    - _Note:_ Because it lacks multiple edges and loops (which would create circuits), any tree must be a **simple graph**.

- **Forest:** An undirected graph with no simple circuits but that is not necessarily connected. Each connected component of a forest is a tree.

### Theorem 1 (Path Uniqueness)

An undirected graph is a tree **if and only if** there is a unique simple path between any two of its vertices.

- If there is a unique simple path between any two vertices, the graph is connected and cannot contain simple circuits.

- Conversely, if it is connected and has no simple circuits, paths between vertices must exist and be unique.

### Theorem 2 (Edge Count)

A tree with $n$ vertices has exactly $n-1$ edges.

- _Alternative Proof via Euler's Formula:_ For a connected planar graph, $r = e - n + 2$. Since a tree has no circuits, the entire plane is a single region ($r = 1$). Therefore, $1 = e - n + 2$, which simplifies to $e = n - 1$.

## II. Rooted Trees and Terminology

In many applications, a particular vertex is designated as the origin point, giving the tree a directional flow.

- **Rooted Tree:** A tree in which one specific vertex is designated as the **root**, and every edge is directed away from the root.

- **Parent:** The unique vertex $u$ with a directed edge from $u$ to a non-root vertex $v$.

- **Child:** If $u$ is the parent of $v$, then $v$ is a child of $u$.

- **Siblings:** Vertices that share the same parent.

- **Ancestors:** For a non-root vertex $v$, its ancestors are all the vertices on the unique path from the root to $v$.

- **Descendants:** The descendants of vertex $v$ are all vertices that have $v$ as an ancestor.

- **Leaf:** A vertex that has no children (degree of 1 in the underlying undirected graph, except for a root with no children).

- **Internal Vertex:** A vertex that has at least one child.

- **Subtree:** The subtree at vertex $v$ is the subgraph consisting of $v$, all its descendants, and all edges incident to these descendants.

## III. Tree Classification ($m$-ary Trees)

Rooted trees are often classified by the maximum number of children their internal vertices can have.

- **$m$-ary Tree:** A rooted tree where every internal vertex has **no more than** $m$ children.

- **Binary Tree:** An $m$-ary tree where $m = 2$.

- **Full $m$-ary Tree:** A rooted tree where every internal vertex has **exactly** $m$ children.

- **Ordered Rooted Tree:** A rooted tree where the children of each internal vertex are systematically ordered (e.g., from left to right).

    - In an ordered binary tree, the two potential children are specifically designated as the **left child** and the **right child**.

    - The tree rooted at the left child is the **left subtree**, and the tree rooted at the right child is the **right subtree**.

## IV. Tree Properties and Formulas

### 1. Vertex and Leaf Calculations

For a **full $m$-ary tree**:

- **Theorem 3:** If it has $i$ internal vertices, the total number of vertices $n$ is:

    $$
n = mi + 1
    $$

- **Theorem 4 Relationships:** Using the total vertices $n$, internal vertices $i$, and leaves $l$, the following relationships always hold ($n = i + l$):

    - $i = \frac{n - 1}{m}$

    - $l = \frac{(m - 1)n + 1}{m}$

    - $n = \frac{ml - 1}{m - 1}$

    - $i = \frac{l - 1}{m - 1}$

### 2. Level, Height, and Balance

- **Level:** The level of vertex $v$ is the length of the unique path from the root to $v$. (The root is at level 0).

- **Height ($h$):** The maximum level among all vertices in the rooted tree.

- **Balanced Tree:** A rooted $m$-ary tree of height $h$ is balanced if all its leaves are located at either level $h$ or level $h-1$.

    - _(For binary trees specifically, it is balanced if the heights of the left and right subtrees of every node differ by at most one)._

### 3. Leaf Bounds based on Height

- **Theorem 5:** An $m$-ary tree of height $h$ can have at most $m^h$ leaves ($l \le m^h$).

- **Corollary:** If an $m$-ary tree of height $h$ has $l$ leaves, its height is bounded by:

    $$
h \ge \lceil \log_m l \rceil
    $$

    If the $m$-ary tree is both **full** and **balanced**, this becomes a strict equality: $h = \lceil \log_m l \rceil$.

## V. Additional Properties

- **Isomorphism:** The choice of root changes the structural identity of a tree. For example, there are only 3 nonisomorphic _unrooted_ trees with 5 vertices, but there are 9 nonisomorphic _rooted_ trees with 5 vertices.

- **Bipartite Nature:** **Every tree is a bipartite graph.** * _Proof/Method:_ Any tree can be correctly colored using exactly two colors. By assigning one color (e.g., red) to all vertices at even levels and a second color (e.g., blue) to all vertices at odd levels, no two adjacent vertices will ever share the same color. Therefore, its chromatic number is 2.
