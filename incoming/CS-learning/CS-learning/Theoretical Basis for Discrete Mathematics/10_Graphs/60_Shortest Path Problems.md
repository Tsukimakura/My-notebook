## I. Introduction to Weighted Graphs

- **Weighted Graph:** A graph denoted as $G = (V, E, W)$, where $V$ is the set of vertices, $E$ is the set of edges, and $W$ represents weights assigned to the edges.
    
- **Edge Weight:** The weight of an edge $(x, y)$ is denoted as $w(x, y)$. If an edge does not exist between two vertices, its weight is considered $\infty$.
    
- **Path Length:** The length of a path in a weighted graph is the sum of the weights of the edges that make up that path.
    
- **The Shortest Path Problem:** Given a weighted graph, find the path between two specific vertices (e.g., from vertex $a$ to vertex $z$) that has the minimum total length.
    

## II. Dijkstra's Algorithm

Discovered by Dutch mathematician E. Dijkstra in 1959, this algorithm finds the shortest path between two vertices in a connected, simple, undirected graph.

> **Crucial Constraint:** Dijkstra's algorithm only works for graphs with **positive edge weights**.

**The Algorithm Iteration Process:**

Dijkstra's algorithm proceeds iteratively by maintaining a set of vertices $S_k$ whose shortest path from the starting vertex $a$ is already known.

1. **Initialization (Step 0):** Assign a label of $0$ to the starting vertex $a$ ($L_0(a) = 0$). Assign a label of $\infty$ to all other vertices ($L_0(v) = \infty$). The set of finalized vertices is empty ($S_0 = \emptyset$).
    
2. **Selection:** In the $k$-th iteration, find the vertex $u$ that is not yet in $S_{k-1}$ and has the smallest current label. Add this vertex $u$ to the set to form $S_k$.
    
3. **Label Updating:** Update the labels of all remaining vertices $v$ that are not in $S_k$. The new label $L_k(v)$ is the minimum of its current label and the path length passing through the newly added vertex $u$.
    
    - Formula: $L_k(v) = \min(L_{k-1}(v), L_{k-1}(u) + w(u, v))$
        
4. **Termination:** Repeat the selection and updating steps until the destination vertex $z$ is added to the set $S$. The final label $L(z)$ is the length of the shortest path from $a$ to $z$.
    

**Important Theorems regarding Dijkstra's Algorithm:**

- **Theorem 1 (Correctness):** Dijkstra's algorithm accurately finds the length of a shortest path between two vertices in a connected simple undirected weighted graph.
    
- **Theorem 2 (Time Complexity):** The algorithm requires $O(n^2)$ operations (additions and comparisons) to find the shortest path, where $n$ is the number of vertices. It uses no more than $n-1$ iterations, and each iteration involves at most $n-1$ comparisons and $2(n-1)$ label updates.
    

## III. Floyd's Algorithm

While Dijkstra's algorithm finds the shortest path from a single source to a destination, Floyd's algorithm solves the all-pairs shortest path problem.

- **Objective:** Find the distance $d(a, b)$ for _all_ pairs of vertices $a$ and $b$ in the graph.
    
- **Mechanism:** It uses a triply nested loop iterating through all vertices. For each pair of vertices $(v_i, v_j)$, it checks if passing through an intermediate vertex $v_k$ offers a shorter path.
    
    - Update condition: If $d(v_i, v_k) + d(v_k, v_j) < d(v_i, v_j)$, then update $d(v_i, v_j)$ to this new smaller sum.
        
- **Characteristics:** * It **can** handle negative edge weights.
    
    - It **cannot** handle negative weight circuits (cycles where the total weight is negative).
        
    - It calculates the _lengths_ of the shortest paths but does not inherently construct the exact sequence of vertices in the paths.
        

## IV. The Traveling Salesman Problem (TSP)

The Traveling Salesman Problem is a classic optimization problem applying graph theory to routing and logistics.

- **Definition:** Find a circuit of minimum total weight in a weighted, complete, undirected graph that visits each vertex exactly once and returns to its starting point.
    
- **Equivalent Graph Theory Problem:** Find a Hamilton circuit with the minimum total weight in a complete graph.
    

**Approaches to TSP:**

1. **Exact Solution (Straightforward / Brute-Force Method):**
    
    - Method: Examine all possible Hamilton circuits and select the one with the absolute minimum total length.
        
    - Total number of circuits to examine: $(n-1)! / 2$ (since circuits can be traveled in reverse, dividing by 2 avoids redundant checks).
        
    - Complexity: $O(n!)$. This factorial time complexity makes it computationally infeasible for large graphs.
        
2. **Approximation Algorithms:**
    
    - Method: Use heuristics to construct a solution rapidly.
        
    - Trade-off: These algorithms do not guarantee the exact minimum path but are guaranteed to produce a solution that is "close" to the exact solution.
        
	- Complexity: Typically polynomial time, such as $O(n^2)$, making them highly practical for real-world applications with many nodes.