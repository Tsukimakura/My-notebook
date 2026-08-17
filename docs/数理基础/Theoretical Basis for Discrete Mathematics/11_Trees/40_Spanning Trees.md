# 40_Spanning Trees

## I. Core Definitions and Concepts

- **Spanning Tree:** Let $G$ be a simple graph. A **spanning tree** of $G$ is a subgraph of $G$ that is a tree containing _every_ vertex of $G$.

- **Motivation:** Spanning trees are used to find a subset of connections (like a system of roads or network links) that connects all nodes without any redundant loops or circuits.

    - _Application:_ **IP Multicasting** relies on spanning trees to route data from a source to multiple destinations efficiently, ensuring there are no routing loops and minimizing network traffic.

- **Key Properties:**

    - A simple graph can have **more than one** valid spanning tree.

    - A spanning tree can be found by systematically removing edges from simple circuits within the graph until no circuits remain, while ensuring the graph stays connected.

### Theorem 1 (Connectivity Condition)

A simple graph is connected **if and only if** it has a spanning tree.

- **Proof Outline:**

    - _Forward ($\implies$):_ If a simple graph $G$ has a spanning tree $T$, then $T$ contains every vertex of $G$. Since $T$ is a tree, there is a path between any two vertices in $T$. Because $T$ is a subgraph of $G$, these paths also exist in $G$, proving $G$ is connected.

    - _Backward ($\impliedby$):_ If $G$ is connected, we can isolate a spanning tree by repeatedly identifying simple circuits and removing one edge from each circuit until the graph is acyclic. Removing an edge from a circuit does not disconnect the graph.

## II. Algorithms for Constructing Spanning Trees

Instead of constructing spanning trees by removing edges (which can be inefficient), they are typically built by successively _adding_ edges to form a tree. Two primary algorithms are used:

### 1. Depth-First Search (DFS) / Backtracking

DFS forms a rooted tree path by diving as deep as possible into the graph before backtracking.

**Algorithm Steps:**

1. Arbitrarily choose a vertex of the graph to serve as the **root**.

2. Form a path starting at this root by successively adding edges. Each new edge must connect the last vertex in the path to a vertex _not already_ in the path.

3. Continue adding edges to this single path for as long as possible.

4. If the path reaches a dead end but does not yet contain all vertices, **backtrack** to the second-to-last vertex in the path.

5. Form a new path starting from this vertex to other unvisited vertices.

6. Repeat this process of diving deep and backtracking until all vertices of the graph have been added to the tree.

### 2. Breadth-First Search (BFS)

BFS explores the graph level by level, radiating outward from the root.

**Algorithm Steps:**

1. Arbitrarily choose a vertex to be the **root**.

2. Add all edges incident to this root that connect to unvisited vertices. The newly added vertices become **Level 1** of the spanning tree. Arbitrarily order these Level 1 vertices.

3. For each vertex at Level 1 (processed in order), add all incident edges that connect to unvisited vertices. These new vertices become **Level 2**.

    - _Crucial Rule:_ Do not add any edge that produces a simple circuit.

4. Arbitrarily order the children of each Level 1 vertex.

5. Repeat this procedure for Level 2 to create Level 3, and so on, until all vertices in the graph have been added to the spanning tree.

## III. Backtracking Schemes and Decision Trees

The depth-first search methodology is inherently tied to **backtracking**.

- **Concept:** Backtracking is used to solve problems that require an exhaustive search of all possible solutions.

- **Decision Trees:** The systematic search is modeled using a decision tree.

    - Each **internal vertex** represents a specific decision or choice made at a given step.

    - Each **leaf** represents a possible final solution (or a failed state that prompts backtracking).

- **Common Applications of Backtracking:**

    1. **Graph Coloring:** Systematically trying colors for vertices and backtracking when two adjacent vertices share a color.

    2. **The $n$-Queens Problem:** Placing queens on a chessboard row by row, backtracking when a placement results in a conflict.

    3. **Sums of Subsets:** Finding specific combinations of numbers that add up to a target value.

## IV. Directed Graphs

- **Depth-First Search in Directed Graphs:** The DFS algorithm can also be applied to directed graphs. The process is identical, but paths must strictly follow the direction of the edges.

- _Result:_ The output of a DFS on a directed graph may not be a single spanning tree; if not all vertices are reachable from the initial root, the output will be a **directed forest** (multiple disjoint directed trees).
