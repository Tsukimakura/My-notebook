# 11_Minimum Spanning Tree (MST)

## 1. Definitions

A spanning tree of a graph $G$ is a tree consisting of all vertices $V(G)$ and a subset of edges $E(G)$.

* **Tree**: It is acyclic. Contains exactly $|V| - 1$ edges.
* **Spanning**: It covers every single vertex in the graph.
* **Minimum**: The total sum of the edge costs is minimized.
* *Properties*: An MST exists if and only if $G$ is connected. Adding any non-tree edge to a spanning tree will fundamentally create a cycle.

## 2. Greedy Method Constraints for MST

To build an MST, the algorithm must make the best local decision under three constraints:

1. Use only edges present in the graph.
2. Use exactly $|V| - 1$ edges.
3. Do not select edges that would produce a cycle.

## 3. Algorithms

### 3.1 Prim's Algorithm — "Growing a Tree"

Prim's algorithm operates on a fundamentally different philosophy from Kruskal's. Instead of looking at all edges globally, it starts from an arbitrary "root" vertex and incrementally **grows a single connected tree** by absorbing the closest neighboring vertices one by one.

#### Core Concept & Logic

- **The Frontier Strategy**: At any point during the algorithm, the graph is divided into two sets of vertices:

    1. The **Tree Vertices** (already included in the MST).

    2. The **Fringe/Unknown Vertices** (not yet in the MST).

- **The Greedy Choice**: The algorithm examines all edges that cross the boundary between the Tree and the Fringe. It greedily selects the edge with the **minimum weight** and adds the connected Fringe vertex to the Tree.

#### The Crucial Similarity to Dijkstra's Algorithm

Prim's algorithm is structurally almost identical to Dijkstra's algorithm for shortest paths. The _only_ difference lies in how the "distance" is defined and updated:

- **Dijkstra**: `Dist[W]` is the total distance from the **Source Vertex** to `W`.

    - Update logic: `Dist[W] = min(Dist[W], Dist[V] + Cvw)`

- **Prim**: `Dist[W]` is the shortest distance from the **Entire Tree** to `W`.

    - Update logic: `Dist[W] = min(Dist[W], Cvw)` (We only care about the length of the new connecting edge, not the accumulated path length).

#### Step-by-Step Execution

1. **Initialize**: Pick an arbitrary starting vertex. Set its distance to `0` and all other vertices' distances to $\infty$.

2. **Select**: Find the unknown vertex `V` with the smallest `Dist`. Add `V` to the Tree (mark it as `Known`).

3. **Update (Relaxation)**: For every adjacent unknown vertex `W`, check the edge weight `Cvw`. If `Cvw < Dist[W]`, update `Dist[W] = Cvw` and record the path `Path[W] = V`.

4. **Repeat**: Loop steps 2 and 3 until all vertices are marked as `Known`.

#### Time Complexity

Because it mirrors Dijkstra's algorithm, the time complexity depends entirely on how the graph is implemented:

- **Dense Graphs**: Using a simple array to scan for the minimum distance yields **$T = O(|V|^2)$**.

- **Sparse Graphs**: Using an adjacency list and a Priority Queue (Min-Heap) yields **$T = O(|E| \log |V|)$**.

```c
/**
 * Prim's Algorithm for Minimum Spanning Tree.
 * Structurally identical to Dijkstra, but updates distance to the TREE, not the SOURCE.
 */
void Prim(Table T) {
    Vertex V, W;

    for ( ; ; ) {
        /* Find the unknown vertex with the smallest distance to the CURRENT TREE */
        V = smallest unknown distance vertex;

        if (V == NotAVertex)
            break; /* All connected vertices have been added to the MST */

        T[V].Known = true; /* Add vertex V to the Minimum Spanning Tree */

        for (each W adjacent to V) {
            if (!T[W].Known) {
                /* RELAXATION STEP:
                 * Notice the difference from Dijkstra!
                 * We strictly compare with the edge weight Cvw, ignoring T[V].Dist.
                 */
                if (Cvw < T[W].Dist) {
                    Decrease(T[W].Dist to Cvw);
                    T[W].Path = V; /* Record V as the connection point to the tree */
                }
            }
        }
    }
}
```

### 3.2 Kruskal's Algorithm —— maintaining a forest

* Starts with an empty tree $T$.
* Continuously extracts the lowest-cost edge $(v, w)$ from the graph (using a `DeleteMin` operation on a priority queue).
* If adding $(v, w)$ to $T$ does *not* create a cycle (verified via `Union/Find` disjoint set), it is added. Otherwise, it is discarded.
* Terminates when $T$ has $|V| - 1$ edges.
* **Time Complexity**: $T = O(|E| \log |E|)$

```c
/**
 * Kruskal's Algorithm for Minimum Spanning Tree.
 * Utilizes a Disjoint Set (Union/Find) to detect cycles and a Priority Queue (Min-Heap) to pick the lightest edge.
 */
void Kruskal(Graph G) {
    int edgesAccepted = 0;
    DisjointSet S;
    PriorityQueue H;
    Vertex U, V;
    SetType Uset, Vset;
    Edge E;

    InitializeSet(S);           /* Initialize disjoint sets for all vertices */
    BuildHeap(G, H);            /* Insert all graph edges into a Min-Heap */

    /* MST contains exactly |V| - 1 edges */
    while (edgesAccepted < NumVertex - 1 && !IsEmpty(H)) {
        E = DeleteMin(H);       /* Greedily pick the edge with the minimum weight */
        U = E.u;
        V = E.v;

        Uset = Find(U, S);      /* Find the root of U's set */
        Vset = Find(V, S);      /* Find the root of V's set */

        /* If they belong to different sets, adding the edge will NOT create a cycle */
        if (Uset != Vset) {
            edgesAccepted++;
            SetUnion(S, Uset, Vset); /* Merge the two sets */
            printf("Edge (%d, %d) added to MST with weight %d\n", U, V, E.weight);
        }
    }

    if (edgesAccepted < NumVertex - 1) {
        printf("Error: Graph is not connected. No spanning tree exists.\n");
    }
}
```
