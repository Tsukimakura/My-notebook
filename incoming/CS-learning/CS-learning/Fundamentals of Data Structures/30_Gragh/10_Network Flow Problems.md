## 1. Core Concepts

* **Network Flow Graph**: A directed graph representing a network of pipes with a **source** ($s$) and a **sink** ($t$).
* **Flow Conservation Rule**: For any vertex $v \notin \{s, t\}$, the total flow coming into $v$ must strictly equal the total flow going out of $v$.
* **Objective**: Determine the maximum amount of flow that can pass from the source $s$ to the sink $t$.

## 2. The Augmenting Path Algorithm

A purely greedy approach (simply picking any available path) can fail to find the true maximum flow because it might make sub-optimal routing choices early on. The correct algorithm introduces an **"undo" mechanism** using residual graphs.

**Algorithm Steps:**

1. **Find an augmenting path**: Find any valid path from $s \to t$ in the Residual Graph $G_r$.
2. **Augment flow**: Find the minimum edge capacity along this path. Add this amount to the Flow Graph $G_f$.
3. **Update Residual Graph ($G_r$)**:
* Subtract the flow from the forward edges. Remove edges with 0 capacity.
* **The "Undo" Key**: For each edge $(v, w)$ with flow $f_{v,w}$ in $G_f$, add a reverse edge $(w, v)$ with capacity $f_{v,w}$ in $G_r$. This allows future paths to route flow *backwards*, effectively canceling out earlier poor decisions.
4. **Repeat**: Loop back to Step 1 until no path from $s \to t$ exists in $G_r$.

*Note: If edge capacities are rational numbers, this algorithm is guaranteed to terminate with a maximum flow. It works for graphs with cycles as well.*

```c
/*
 * Core logic for finding the maximum flow using the Augmenting Path Algorithm.
 * Assumes a residual graph represented by an adjacency matrix or list (Capacity).
 */
void MaxFlow(Graph G, Vertex S, Vertex T) {
    int flow = 0;
    int pathCapacity;
    Vertex V, W;

    /* Loop until no augmenting path can be found from S to T */
    while (FindAugmentingPath(G, S, T)) { /* Usually implemented via BFS */
        
        pathCapacity = INFINITY;
        
        /* Step 1: Find the bottleneck capacity along the discovered path */
        for (V = T; V != S; V = Path[V]) {
            W = Path[V]; /* Path array stores the predecessor of each vertex */
            if (Capacity[W][V] < pathCapacity) {
                pathCapacity = Capacity[W][V];
            }
        }
        
        /* Step 2: Update the residual graph */
        for (V = T; V != S; V = Path[V]) {
            W = Path[V];
            Capacity[W][V] -= pathCapacity; /* Decrease forward edge capacity */
            Capacity[V][W] += pathCapacity; /* Increase reverse edge capacity (Undo mechanism) */
        }
        
        flow += pathCapacity; /* Augment total flow */
    }
    printf("Maximum Flow: %d\n", flow);
}
```

## 3. Time Complexity Analysis (Integer Capacities)

Let $f$ be the maximum flow.

* **Basic Unweighted Shortest Path (Edmonds-Karp approach)**:
	
	Always choose the augmenting path with the *least number of edges*.
	
	$T = O(|E|) \times O(|E| \cdot |V|) = O(|E|^2 |V|)$

* **Largest Increase Method (Modified Dijkstra's)**:
	
	Always choose the augmenting path that allows the *largest increase in flow*.
	
	$T = O(|E| \log \text{cap}_{\max}) \times O(|E| \log |V|) = O(|E|^2 \log |V|)$ (Assuming $\text{cap}_{\max}$ is a small integer).

* **Special Case**: If every $v \notin \{s, t\}$ has either a single incoming edge of capacity 1 OR a single outgoing edge of capacity 1, the time bound reduces to $O(|E| |V|^{1/2})$.

## 4. Min-Cost Flow Problem

A variation where each edge has a "cost per unit of flow". The goal is to find the specific maximum flow configuration that results in the absolute minimum total cost.

---
