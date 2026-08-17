# Network Flow

## I. Basic Definitions and Flow Constraints

A **Flowgraph** is a directed graph where we distinguish two special vertices:

- **Source ($s$):** The vertex where the flow originates.

- **Sink ($t$):** The vertex where the flow terminates.

- **Capacities ($c$):** Each edge $e$ has a non-negative capacity, denoted as $c(e) \ge 0$.

> **Handling Multiple Sources or Sinks:** If a network has multiple sources or sinks, we modify the graph by creating a single **supersource** connected to all original sources (with infinite capacity edges), and a single **supersink** connected from all original sinks.

### The Flow Function

The **Maximum Flow Problem** asks us to assign a flow value $f(e)$ to each edge $e$ to maximize the total flow leaving the source. An $s-t$ **flow** is a function $f$ that must satisfy two strict conditions:

1. **Capacity Constraint:** The flow on an edge cannot exceed its capacity, nor can it be negative.

        $$
    0 \le f(e) \le c(e)
        $$

2. **Flow Conservation:** For every vertex $v$ other than the source $s$ and sink $t$, the total flow entering the vertex must equal the total flow leaving it.

    $$
\sum_{e \text{ into } v} f(e) = \sum_{e \text{ out of } v} f(e)
    $$

### Value of a Flow

The **value of a flow**, denoted as $v(f)$ or $|f|$, is the total net amount of flow leaving the source vertex $s$:

$$
v(f) = \sum_{e \text{ out of } s} f(e)
$$

## II. Graph Cuts

To understand the upper bounds of network flow, we analyze the network's bottlenecks using cuts.

### $s-t$ Cut Definition

An **$s-t$ cut** is a partition of the vertex set $V$ into two disjoint subsets, $A$ and $B$, such that the source $s \in A$ and the sink $t \in B$.

### Capacity of a Cut

The **capacity of a cut** $(A, B)$, denoted $cap(A, B)$, is the sum of the capacities of all edges that go _out of_ set $A$ into set $B$.

$$
cap(A, B) = \sum_{e \text{ out of } A} c(e)
$$

_(Note: Edges going from $B$ back to $A$ do not contribute to the capacity of the cut)._

### Flow Across a Cut (Flow Value Lemma)

Let $f$ be any valid flow, and let $(A, B)$ be any $s-t$ cut. The **net flow** sent across the cut is exactly equal to the total flow value $v(f)$ leaving the source $s$.

$$
v(f) = \sum_{e \text{ out of } A} f(e) - \sum_{e \text{ into } A} f(e)
$$

## III. Duality and Optimality

The relationship between flows and cuts is governed by duality principles.

### Weak Duality

Let $f$ be any valid flow, and let $(A, B)$ be any $s-t$ cut. The value of the flow is at most the capacity of the cut.

$$
v(f) \le cap(A, B)
$$

_Proof Insight:_ The net flow across a partition cannot exceed the physical capacity of the edges pointing forward across that partition.

### Certificate of Optimality (Corollary)

If we can find a flow $f$ and a cut $(A, B)$ such that their values are exactly equal, we have simultaneously solved both the maximum flow and minimum cut problems.

**If $v(f) = cap(A, B)$, then:**

- $f$ is a **maximum flow**.

- $(A, B)$ is a **minimum cut**.

## IV. Residual Graphs and Augmenting Paths

A naive "Greedy Algorithm" (simply finding paths with spare capacity and pushing flow until stuck) fails because it can route flow down suboptimal paths, getting trapped in a local optimum. To achieve global optimality, we must be able to "undo" bad routing decisions.

### The Residual Graph ($G_R$)

The residual graph shows the remaining workable capacity of the network, including the ability to push flow backwards to "cancel" existing flow. For an original edge $e = (u, v)$ with capacity $c(e)$ and current flow $f(e)$:

1. **Forward Edge (Remaining Capacity):** An edge $e'$ from $u$ to $v$ with capacity $c - f$.

2. **Reverse Edge (Undo Capacity):** An edge $e''$ from $v$ to $u$ with capacity $f$.

_Note: Edges in $G_R$ only exist if their residual capacity is strictly greater than 0._

### Augmenting Path

An **augmenting path** is a simple path from $s$ to $t$ within the residual graph $G_R$.

- **Bottleneck ($b$):** The minimum residual capacity among all edges on the augmenting path.

- To **augment** the flow:

    - Increase flow by $b$ on forward edges in the path.

    - Decrease flow by $b$ on reverse edges in the path.

## V. The Ford-Fulkerson Algorithm (1956)

The Ford-Fulkerson algorithm systematically finds maximum flow by utilizing the residual graph.

### Algorithm Steps:

1. **Initialize:** Set the flow $f(e) = 0$ for all edges $e \in E$.

2. **Loop:** While there exists an augmenting path $P$ from $s$ to $t$ in the residual graph $G_R$:

    - Find the bottleneck capacity $b$ of path $P$.

    - Augment the flow $f$ along $P$ by $b$ units.

    - Update the residual graph $G_R$ based on the new flow.

3. **Terminate:** Return the maximum flow $f$ when no more augmenting paths exist.

### Complexity Note

If the capacities of all edges leaving the source are non-negative **integers**, the algorithm will augment the flow by at least $1$ integer unit in every iteration. Therefore, if the maximum capacity sum leaving $s$ is $C$, the algorithm is guaranteed to terminate in at most $C$ iterations.

## VI. The Max-Flow Min-Cut Theorem

This theorem is the foundational cornerstone of network flow theory, formally linking the concepts of maximum flow and minimum cut.

**Statement:** The value of the maximum flow is exactly equal to the capacity of the minimum cut.

$$
v(f_{max}) = cap(A, B)_{min}
$$

### Proof of Equivalence (TFAE)

The theorem is typically proven by showing that the following three statements are logically equivalent (The Following Are Equivalent - TFAE):

1. **Statement (i):** There exists an $s-t$ cut $(A, B)$ such that the value of the flow equals the capacity of the cut: $v(f) = cap(A, B)$.

2. **Statement (ii):** Flow $f$ is a maximum flow.

3. **Statement (iii):** There is no augmenting path relative to flow $f$ in the residual graph $G_R$. (This is also known independently as the _Augmenting Path Theorem_).

**Logical Flow of the Proof:**

- **(i) $\implies$ (ii):** This follows directly from the Weak Duality Lemma. If we know that for _any_ flow and _any_ cut, $v(f) \le cap(A, B)$, then finding a specific instance where $v(f) = cap(A, B)$ guarantees that $f$ must be the maximum possible flow, and $(A, B)$ must be the minimum possible cut.

- **(ii) $\implies$ (iii) `[By Contrapositive]`:** We prove this by showing $\neg$(iii) $\implies \neg$(ii). If there _is_ an augmenting path in the residual graph, the Ford-Fulkerson algorithm tells us we can push more flow along that path to increase the total flow value. Therefore, the current flow $f$ cannot be the maximum flow.

- **(iii) $\implies$ (i):** Assume there are no augmenting paths from $s$ to $t$ in the residual graph.

    - Let set $A$ be all vertices reachable from $s$ in the residual graph. By definition, $s \in A$.

    - Because there are no augmenting paths to the sink, $t$ cannot be reachable from $s$ in the residual graph. Thus, $t \notin A$.

    - Let $B$ be all other vertices ($V - A$), so $t \in B$.

    - Consider any original edge going from a vertex in $A$ to a vertex in $B$. In the residual graph, this edge must be completely saturated (flow = capacity), otherwise the vertex in $B$ would be reachable from $s$ and would belong in set $A$.

    - Consider any original edge going from $B$ to $A$. Its flow must be zero, otherwise there would be a reverse edge in the residual graph pointing from $B$ to $A$, making the vertex in $A$ reachable.

    - Because all edges out of $A$ are saturated and all edges into $A$ are empty, the net flow across the cut is exactly equal to the capacity of the cut: $v(f) = cap(A, B)$.

_(Conclusion: The Ford-Fulkerson algorithm naturally finds a maximum flow precisely when the residual graph becomes disconnected between $s$ and $t$, which inherently defines the minimum cut)._

## VII. Algorithmic Performance and Scaling

### The Problem with Generic Ford-Fulkerson

While the generic Ford-Fulkerson algorithm is guaranteed to terminate if capacities are integers, its worst-case performance can be exceptionally poor ("horrible").

- **Pathological Case:** Consider a simple 4-node network where the edges from source and to sink have capacity $1000$, but a single cross edge between the intermediate nodes has capacity $1$.

- **The Issue:** If the algorithm poorly chooses augmenting paths that constantly utilize this middle edge back and forth, it will only increase the total flow by $1$ unit per iteration.

- **Running Time:** The algorithm takes $O(v(f^*))$ iterations, where $v(f^*)$ is the value of the maximum flow. If the max capacity $C$ is very large, the number of iterations scales linearly with $C$, meaning the algorithm is **pseudo-polynomial** (exponential in the size of the input, since representing a number $C$ takes $\log C$ bits).

> _Note: If edge capacities are irrational numbers, the generic Ford-Fulkerson algorithm is not even guaranteed to terminate._

### Improving Performance: Capacity Scaling

To achieve a true polynomial time algorithm, we must be careful in _how_ we select augmenting paths.

**Goal:** Choose paths that increase the flow by the largest possible amounts, thereby reducing the total number of iterations.

**Strategy (Capacity Scaling):**

1. Instead of searching the entire residual graph, maintain a scaling parameter $\Delta$ (initially set to the largest power of 2 less than or equal to the maximum capacity $C$).

2. Search for augmenting paths _only_ in a subgraph of the residual graph containing edges with residual capacity **at least $\Delta$**.

3. When no more paths exist with capacity $\Delta$, divide $\Delta$ by 2 and repeat.

4. Terminate when $\Delta < 1$.

**Result:** The scaling max-flow algorithm guarantees a maximum flow in $O(m \log C)$ augmentations, leading to an overall implementation time of **$O(m^2 \log C)$**, which is polynomial.

_(Other polynomial strategies include the Edmonds-Karp algorithm, which uses Breadth-First Search to always pick the augmenting path with the fewest number of edges)._

## VIII. Application: Bipartite Matching

Network flow is highly versatile and can be used to solve problems that don't initially look like fluid dynamics, such as assignment or matching problems.

### Bipartite Graphs

A bipartite graph is an undirected graph $G=(V,E)$ where the vertices can be partitioned into two distinct sets $V_1$ and $V_2$. Every edge in the graph connects a vertex in $V_1$ to a vertex in $V_2$. There are no edges connecting vertices within the same set.

### The Matching Problem

- **Scenario:** Given a community of $n$ men (Set $V_1$) and $m$ women (Set $V_2$). We have a list of compatible pairs who are willing to marry.

- **Constraint:** No polygamy is allowed; each person can be involved in at most one marriage.

- **Goal:** Find an arrangement that maximizes the total number of marriages (an **Optimal Matching**).

### Solution Using Max Flow

We can transform this purely structural matching problem into a network flow problem:

1. **Direct the Edges:** Take the bipartite graph and direct all edges from the left set (e.g., Men) to the right set (e.g., Women). Assign every edge a capacity of $1$.

2. **Add Supersource and Supersink:**

    	- Create a supersource node $s$. Connect $s$ to every vertex in the left set with a directed edge of capacity $1$.

        - Create a supersink node $t$. Connect every vertex in the right set to $t$ with a directed edge of capacity $1$.

3. **Run Max Flow:** Execute the Ford-Fulkerson algorithm on this new network.

4. **Interpretation:** Because every capacity is $1$ (and by the Integrality Theorem flows will be integers), the flow along any path from $s$ to $t$ will be exactly $1$. The capacity constraint of $1$ on the edges from $s$ and to $t$ strictly enforces the "no polygamy" rule (flow conservation prevents multiple matchings per person). The maximum flow value equals the maximum possible number of marriages, and the saturated edges in the middle represent the optimal pairings.
