# 50_Minimum Spanning Trees

## I. The Concept of Minimum Spanning Trees

In many real-world scenarios, such as designing computer networks or transportation systems, edges have associated costs (e.g., monthly lease costs for network lines). The goal is to connect all nodes while minimizing the total cost.

- **Minimum Spanning Tree (MST):** A minimum spanning tree in a connected weighted graph is a spanning tree that has the **smallest possible sum of weights** of its edges.

- **Objective:** Find a subset of edges that forms a tree, includes every vertex, and minimizes the total weight constraint.

## II. Algorithms for Minimum Spanning Trees

To construct minimum spanning trees, we commonly use two algorithms: **Prim's Algorithm** and **Kruskal's Algorithm**.

- **Greedy Algorithms:** Both of these algorithms are examples of greedy algorithms. They proceed by making the locally optimal choice at each step—successively adding edges of the smallest available weight that satisfy specific conditions, without looking ahead to the global outcome.

### 1. Prim's Algorithm (Vertex/Tree-Centric)

Prim's algorithm builds the spanning tree by starting with a single edge and continuously expanding outward from the vertices currently in the tree.

**Procedure:**

1. **Initialize:** Start with $T$ containing a single minimum-weight edge from the graph $G$ (which has $n$ vertices).

2. **Iterate:** For $i = 1$ to $n-2$:

    - Find an edge $e$ of **minimum weight that is incident to a vertex already in $T$**.

    - Ensure that adding edge $e$ to $T$ does **not form a simple circuit**.

    - Add $e$ to $T$ ($T := T \cup \{e\}$).

3. **Terminate:** The process ends when the tree connects all vertices ($n-1$ edges have been added). $T$ is the minimum spanning tree.

### 2. Kruskal's Algorithm (Edge-Centric)

Kruskal's algorithm builds the spanning tree by evaluating all edges in the entire graph from lightest to heaviest, regardless of whether they connect to the currently formed tree segments.

**Procedure:**

1. **Initialize:** Start with $T$ as an empty graph containing all $n$ vertices but no edges.

2. **Iterate:** For $i = 1$ to $n-1$:

    - Find **any edge $e$ in the entire graph $G$** with the smallest available weight.

    - Ensure that adding edge $e$ to $T$ does **not form a simple circuit** among the currently selected edges.

    - Add $e$ to $T$ ($T := T \cup \{e\}$).

3. **Terminate:** The process ends when $n-1$ edges have been successfully added. $T$ is the minimum spanning tree.

## III. Example Application

**Problem:** Given a weighted graph representing network centers (A, B, C, D, E) and lease costs, find the MST.

**Solution Trace (via Kruskal's Algorithm method):**

When sorting and selecting the global minimum edges that do not form circuits:

1. **Choice 1:** Edge BE (Cost: 700) - _Smallest edge overall._

2. **Choice 2:** Edge EC (Cost: 800) - _Next smallest, no circuit._

3. **Choice 3:** Edge AD (Cost: 900) - _Next smallest, no circuit._

4. **Choice 4:** Edge AB (Cost: 1200) - _Next smallest. (Note: BC is 1000, but adding BC would form the circuit B-E-C, so it is skipped)._

**Total Minimum Cost:** $700 + 800 + 900 + 1200 = 3600$. This resulting subgraph connects all five computer centers at the lowest possible total cost.
