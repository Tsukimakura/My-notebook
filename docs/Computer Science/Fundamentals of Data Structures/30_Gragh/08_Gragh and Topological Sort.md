# 08_Gragh and Topological Sort

## **1. Definitions**

### **Basic Concepts**

- **Graph $G(V, E)$**: Consists of $V = V(G)$ (a finite nonempty set of vertices) and $E = E(G)$ (a finite set of edges).

- **Undirected Graph**: Edges have no direction. $(v_i, v_j) = (v_j, v_i)$ denotes the same edge.

- **Directed Graph (Digraph)**: Edges have direction. $<v_i, v_j> \neq <v_j, v_i>$. $v_i$ is the tail, and $v_j$ is the head.

![[FDS-Graph1.png]]

- schematic diagram from slides of 何钦铭

- **Restrictions in this context**:

    - Self-loops are illegal.

    - Multigraphs (multiple edges between the same pair of vertices) are not considered.

- **Complete Graph**: A graph with the maximum possible number of edges.

    - Undirected: $e = C_n^2 = \frac{n(n-1)}{2}$

    - Directed: $e = P_n^2 = n(n-1)$

### **Adjacency and Incidence**

- **Undirected**: $v_i$ and $v_j$ are **adjacent**. The edge $(v_i, v_j)$ is **incident on** $v_i$ and $v_j$.

- **Directed**: $v_i$ is **adjacent to** $v_j$; $v_j$ is **adjacent from** $v_i$. The edge $<v_i, v_j>$ is **incident on** $v_i$ and $v_j$.

![[FDS-Graph2.png]]

### **Subgraphs, Paths, and Cycles**

- **Subgraph**: $G' \subset G$ if $V(G') \subseteq V(G)$ and $E(G') \subseteq E(G)$.

- **Path**: A sequence of vertices from $v_p$ to $v_q$ connected by edges. The **length** of a path is the number of edges on it.

- **Simple Path**: A path where all vertices ($v_{i1}, v_{i2}, \dots, v_{in}$) are distinct.

- **Cycle**: A simple path where the start and end vertices are the same ($v_p = v_q$).

### **Connectivity**

- **Connected (Undirected)**: Two vertices $v_i$ and $v_j$ are connected if there is a path between them. A graph is connected if every pair of distinct vertices is connected.

- **Connected Component**: The maximal connected subgraph of an undirected graph.

- **Tree**: A graph that is connected and acyclic.

- **DAG**: Directed Acyclic Graph.

- **Strongly Connected (Directed)**: For every pair of $v_i, v_j$, there are directed paths from $v_i$ to $v_j$ and from $v_j$ to $v_i$.

- **Weakly Connected (Directed)**: Connected only if the direction of the edges is ignored.

- **Strongly Connected Component**: The maximal strongly connected subgraph.

### **Degrees**

- **Degree($v$)**: The number of edges incident to $v$.

- For directed graphs: $\text{Degree}(v) = \text{in-degree}(v) + \text{out-degree}(v)$.

- **Edge Formula**: Given a graph $G$ with $n$ vertices and $e$ edges:

    $$
e = \left( \sum_{i=0}^{n-1} d_i \right) / 2 \quad \text{where } d_i = \text{degree}(v_i)
    $$

---

## **2. Representation of Graphs**

### **2.1 Adjacency Matrix**

- A 2D array `adj_mat[n][n]`, where `adj_mat[i][j] = 1` if an edge exists between $v_i$ and $v_j$, and `0` otherwise.

- For undirected graphs, the matrix is symmetric (space can be saved by storing only half).

- **Degree Calculation**: Computed by summing the row (out-degree) or column (in-degree).

```c
#define MAX_VERTICES 100

typedef struct {
    int adj_mat[MAX_VERTICES][MAX_VERTICES];
    int num_vertices;
    int num_edges;
} GraphMatrix;
```

### **2.2 Adjacency Lists**

- Replaces each matrix row with a linked list of adjacent nodes. Order of nodes in the list does not matter.

- **Space Complexity (Undirected)**: $S = n \text{ heads} + 2e \text{ nodes} = (n + 2e) \text{ pointers} + 2e \text{ ints}$.

- **Issue for Directed Graphs**: Finding in-degree is inefficient.

    - _Solution 1_: Add Inverse Adjacency Lists.

    - _Solution 2_: Use Adjacency Multilists.

![[FDS-Graph3.png]]

```c
// Node for the linked list representing an edge
typedef struct AdjListNode {
    int dest;                 // The adjacent vertex
    int weight;               // Edge weight (optional)
    struct AdjListNode* next; // Pointer to the next adjacent vertex
} AdjListNode;

// Array of adjacency lists
typedef struct {
    AdjListNode* head[MAX_VERTICES]; // Array of pointers to linked list heads
    int num_vertices;
    int num_edges;
} GraphList;
```

### **2.3 Adjacency Multilists**

- In standard adjacency lists for undirected graphs, an edge $(i, j)$ is stored twice (once in $i$'s list, once in $j$'s). Multilists combine these into a single node.

- Node structure: `[mark | v1 | v2 | next_v1 | next_v2]`.

- **Advantage**: Makes edge operations (like marking an edge after examining it) much easier without needing to search through a second list.

```c
// Node structure for Adjacency Multilists
typedef struct MultilistNode {
    int mark;                       // 0 for unexamined, 1 for examined
    int v1;                         // First vertex of the edge
    int v2;                         // Second vertex of the edge
    struct MultilistNode* next_v1;  // Pointer to the next edge incident on v1
    struct MultilistNode* next_v2;  // Pointer to the next edge incident on v2
    int weight;                     // Edge weight (optional)
} MultilistNode;
```

### **2.4 Weighted Edges**

- **Matrix**: Replace the `1` with the edge weight.

- **Lists/Multilists**: Add a `weight` field to the list node.

---

## **3. Topological Sort**

**AOV Network (Activity On Vertex)**

- A digraph where vertices represent activities (e.g., courses) and edges represent precedence relations (e.g., prerequisites).

- **Terms**: If path exists from $i$ to $j$, $i$ is a **predecessor** of $j$. If $<i, j>$ is an edge, $i$ is an **immediate predecessor**, and $j$ is an **immediate successor**.

- **Partial Order**: A precedence relation that is both transitive and irreflexive.

- **Rule**: A feasible project/AOV network MUST be a DAG (Directed Acyclic Graph) to prevent cyclic dependencies.

**Topological Sort Algorithm**

- **Definition**: A linear ordering of vertices such that if $i$ is a predecessor of $j$, $i$ precedes $j$ in the ordering. _Note: Topological orders are not necessarily unique._

- **Goal**: Test an AOV network for feasibility (check for cycles) and generate a topological order.

- **Basic Implementation**: Repeatedly find a vertex with an in-degree of 0, output it, and reduce the in-degree of its adjacent vertices. Time complexity is $O(|V|^2)$.

- **Improved Implementation (Using Queue/Stack)**:

    1. Store all unassigned vertices with an in-degree of 0 in a Queue.

    2. While the queue is not empty, dequeue a vertex $V$, assign it to the sorted output, and increment a counter.

    3. For each adjacent vertex $W$, decrement its in-degree. If $W$'s in-degree reaches 0, enqueue $W$.

    4. If the final counter $\neq$ total number of vertices, report an error ("Graph has a cycle").

    - **Time Complexity**: $T = O(|V| + |E|)$.

```c
// Assuming Queue functions (CreateQueue, MakeEmpty, Enqueue, Dequeue, IsEmpty, DisposeQueue)
// and GraphList G are already defined. Array indegree[] stores the in-degree of each vertex.

void Topsort(GraphList* G, int indegree[]) {
    Queue Q;
    int counter = 0;

    Q = CreateQueue(G->num_vertices);
    MakeEmpty(Q);

    // Step 1: Enqueue all vertices with an initial in-degree of 0
    for (int v = 0; v < G->num_vertices; v++) {
        if (indegree[v] == 0) {
            Enqueue(v, Q);
        }
    }

    // Step 2: Process the queue
    while (!IsEmpty(Q)) {
        int v = Dequeue(Q);

        // Output the vertex or assign topological number here
        // TopNum[v] = ++counter;
        counter++;

        // Step 3: Decrease the in-degree of all adjacent vertices
        AdjListNode* curr = G->head[v];
        while (curr != NULL) {
            int w = curr->dest;
            if (--indegree[w] == 0) {
                Enqueue(w, Q); // If in-degree drops to 0, enqueue it
            }
            curr = curr->next;
        }
    }

    // Step 4: Check for cycles (Feasibility test)
    if (counter != G->num_vertices) {
        // If not all vertices were processed, the graph is not a DAG
        printf("Error: Graph has a cycle!\n");
    }

    DisposeQueue(Q); // Free memory
}
```
