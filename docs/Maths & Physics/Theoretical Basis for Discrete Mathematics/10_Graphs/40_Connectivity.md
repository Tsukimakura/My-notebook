# 40_Connectivity

## I. Paths

Paths represent sequences of edges that connect vertices within a graph.

### 1. Paths in Undirected Graphs

- **Path of Length $n$:** A sequence of vertices $v_0, v_1, \dots, v_n$ in a graph such that $\{v_0, v_1\}, \{v_1, v_2\}, \dots, \{v_{n-1}, v_n\}$ are $n$ edges in the graph.

    - _Note:_ A path of length zero consists of a single vertex.

    - Traversing an edge back and forth produces arbitrarily long paths, which is usually not interesting; hence we focus on simple paths.

- **Circuit:** A path is a circuit if it begins and ends at the same vertex (and its length is greater than $0$).

- **Simple Path:** A path is simple if it does not contain the same edge more than once.

### 2. Paths in Directed Graphs

- **Path of Length $n$:** A sequence of vertices $v_0, v_1, \dots, v_n$ such that $(v_0, v_1), (v_1, v_2), \dots, (v_{n-1}, v_n)$ are $n$ directed edges in the graph.

- **Circuit (or Cycle):** A directed path that begins and ends with the same vertex.

- **Simple Path:** A directed path that does not contain the same directed edge more than once.

## II. Counting Paths Between Vertices

The number of paths between two vertices in a graph can be determined using its adjacency matrix.

### Theorem 1 (Path Counting Theorem)

The number of different paths of length $r$ from vertex $v_i$ to vertex $v_j$ is equal to the $(i, j)$th entry of $A^r$, where $A$ is the adjacency matrix representing the graph.

- **Important Note:** This calculation uses standard matrix multiplication (standard power of $A$), not the Boolean product.

- To find the total number of paths of length _not exceeding_ $k$ from $v_i$ to $v_j$, you sum the $(i, j)$th entries of matrices $A, A^2, A^3, \dots, A^k$.

## III. Connectedness in Undirected Graphs

- **Connected Graph:** An undirected graph is called connected if there is a path between _every_ pair of distinct vertices in the graph.

    - **Theorem 2:** There is a _simple path_ between every pair of distinct vertices of a connected undirected graph.

- **Connected Components:** The maximally connected subgraphs of a graph $G$ are called its connected components (or simply components). A disconnected graph will have two or more connected components.

- **Cut Vertex (Articulation Point):** A vertex is a cut vertex if removing it (and all edges incident with it) results in a graph with more connected components than the original graph.

- **Cut Edge (Bridge):** An edge is a cut edge if removing it creates more components than the original graph.

## IV. Connectedness in Directed Graphs

Directed graphs have two distinct levels of connectedness due to the directionality of edges.

- **Strongly Connected:** A directed graph is strongly connected if there is a directed path from $a$ to $b$ **and** a directed path from $b$ to $a$ for _all_ vertices $a$ and $b$ in the graph.

- **Weakly Connected:** A directed graph is weakly connected if its _underlying undirected graph_ is connected (i.e., if you ignore the direction of the edges, the resulting graph is connected).

    - _Note:_ By definition, any strongly connected directed graph is inherently also weakly connected.

- **Strongly Connected Components:** The maximal strongly connected subgraphs within a directed graph.

## V. Paths and Graph Isomorphism

Paths and connectedness properties act as powerful **invariants** used to determine if two graphs are isomorphic (or to prove they are not).

**Key Invariants Involving Paths:**

1. The number and size of connected components must be identical.

2. Two graphs are isomorphic only if they have simple circuits of the exact same length.

3. Two graphs are isomorphic only if they contain paths that go through vertices such that the corresponding vertices in the two graphs have the exact same degree.

_(Example Application: If Graph A contains a circuit of length 3, and Graph B does not contain any circuits of length 3, they cannot be isomorphic, even if they share the same number of vertices and edges)._
