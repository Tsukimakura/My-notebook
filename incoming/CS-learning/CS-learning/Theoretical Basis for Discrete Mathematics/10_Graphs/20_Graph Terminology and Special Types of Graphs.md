## I. Basic Terminology (Undirected Graphs)

Let $G = (V, E)$ be an undirected graph.

- **Adjacent (Neighbors):** Two vertices $u$ and $v$ are adjacent in $G$ if $\{u, v\}$ is an edge of $G$.
    
- **Incident:** An edge $e$ connecting $u$ and $v$ is called incident with vertices $u$ and $v$.
    
- **Endpoints:** The vertices $u$ and $v$ are called the endpoints of the edge $\{u, v\}$.
    
- **Degree of a Vertex ($\deg(v)$):** The number of edges incident with a vertex $v$.
    
    - _Note:_ A **loop** at a vertex contributes **twice** to the degree of that vertex.
        
- **Special Vertices:**
    
    - **Isolated:** A vertex $v$ with $\deg(v) = 0$.
        
    - **Pendant:** A vertex $v$ with $\deg(v) = 1$.
        

## II. Degree Theorems

### Theorem 1: The Handshaking Theorem

Let $G = (V, E)$ be an undirected graph with $e$ edges. Then the sum of the degrees over all vertices is twice the number of edges:

$$\sum_{v \in V} \deg(v) = 2e$$

- _Note:_ This applies even if multiple edges and loops are present.
    
- _Consequence:_ The sum of all degrees in any graph must be an even number.
    

### Theorem 2

An undirected graph has an **even number** of vertices of **odd degree**.

## III. Directed Graph Terminology

Let $G = (V, E)$ be a directed graph. For a directed edge $(u, v)$:

- **Initial Vertex:** The vertex $u$ (is adjacent to $v$).
    
- **Terminal Vertex:** The vertex $v$ (is adjacent from $u$).
    

**Degrees in Directed Graphs:**

- **In-degree ($\deg^{-}(v)$):** The number of edges which terminate at $v$.
    
- **Out-degree ($\deg^{+}(v)$):** The number of edges which initiate at $v$.
    

### Theorem 3

Let $G = (V, E)$ be a graph with directed edges. The sum of in-degrees equals the sum of out-degrees, which equals the total number of edges:

$$\sum_{v \in V} \deg^{-}(v) = \sum_{v \in V} \deg^{+}(v) = |E|$$

## IV. Special Types of Simple Graphs

1. **Complete Graphs ($K_n$):** A simple graph with $n$ vertices where there is exactly one edge between every pair of distinct vertices.
    
    - _Properties:_ Every vertex has a degree of $n-1$. The total number of edges is $\frac{n(n-1)}{2}$.
        
2. **Cycles ($C_n, n \ge 3$):** Consists of $n$ vertices arranged in a cycle. Each vertex has a degree of $2$.
    
3. **Wheels ($W_n, n \ge 3$):** Produced by adding one additional central vertex to the cycle $C_n$ and connecting it to each vertex in the cycle.
    
4. **n-Cubes ($Q_n, n \ge 0$):** A graph with $2^n$ vertices representing bit strings of length $n$. An edge exists between two vertices if and only if they differ in exactly one bit position.
    
5. **Regular Graph:** A simple graph is called _regular_ if every vertex has the same degree. It is an _n-regular_ graph if every vertex has degree $n$. (e.g., $K_n$ is an $(n-1)$-regular graph).
    

## V. Bipartite Graphs

**Definition:** A simple graph $G$ is **bipartite** if its vertex set $V$ can be partitioned into two disjoint subsets $V_1$ and $V_2$ such that every edge connects a vertex in $V_1$ to a vertex in $V_2$.

- _Rule:_ There are no edges connecting vertices within the same subset ($V_1$ or $V_2$).
    

### Theorem 4 (Coloring Theorem)

A simple graph is bipartite if and only if it is possible to assign one of two different colors to each vertex so that no two adjacent vertices are assigned the same color.

**Complete Bipartite Graphs ($K_{m,n}$):** A bipartite graph partitioned into $V_1$ (with $m$ vertices) and $V_2$ (with $n$ vertices), where _every_ vertex in $V_1$ is connected to _every_ vertex in $V_2$.

- _Application:_ Local Area Network topologies (e.g., a Star topology is represented as $K_{1,n}$).
    

## VI. Matchings in Bipartite Graphs

Bipartite graphs are heavily used to model matching problems (e.g., matching employees to jobs, or marriages).

- **Matching ($M$):** A subset of the edges in a simple graph $G = (V,E)$ such that no two edges are incident with the same vertex.
    
- **Matched Vertex:** A vertex that is an endpoint of an edge within a matching $M$.
    
- **Maximum Matching:** A matching that contains the largest possible number of edges.
    
- **Complete Matching:** A matching $M$ from $V_1$ to $V_2$ in a bipartite graph where every vertex in $V_1$ is the endpoint of an edge in $M$.
    

### Theorem 5: Hall's Marriage Theorem (1935)

The bipartite graph $G=(V, E)$ with bipartition $(V_1, V_2)$ has a **complete matching** from $V_1$ to $V_2$ if and only if:

$$|N(A)| \ge |A| \text{ for all } A \subseteq V_1$$

_(Where $N(A)$ denotes the neighborhood—the set of all adjacent vertices—of subset $A$)._

## VII. New Graphs from Old (Graph Operations)

Let $G = (V, E)$ and $H = (W, F)$ be graphs.

1. **Subgraph:** $H$ is a subgraph of $G$ if $W \subseteq V$ and $F \subseteq E$.
    
2. **Proper Subgraph:** $H$ is a proper subgraph of $G$ if $H$ is a subgraph of $G$ and $H \neq G$.
    
3. **Spanning Subgraph:** A subgraph $H$ of $G$ is a spanning subgraph if it contains all the vertices of $G$ ($W = V$, $F \subseteq E$).
    
4. **Induced Subgraph:** The subgraph induced by a subset $W$ of the vertex set $V$ is the graph $(W, F)$, where the edge set $F$ contains an edge from $E$ if and only if **both** endpoints of that edge are in $W$.
    
5. **Union of Graphs:** The union of two simple graphs $G_1 = (V_1, E_1)$ and $G_2 = (V_2, E_2)$ is the simple graph $G_1 \cup G_2$ with vertex set $V = V_1 \cup V_2$ and edge set $E = E_1 \cup E_2$.