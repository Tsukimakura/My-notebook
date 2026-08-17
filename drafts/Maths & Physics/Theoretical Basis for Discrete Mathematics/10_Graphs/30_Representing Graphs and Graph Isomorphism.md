# 30_Representing Graphs and Graph Isomorphism

## I. Methods for Representing Graphs

To compute and analyze graphs, they must be represented in a structured format. The three primary methods are:

1. **Adjacency lists:** Specifies all adjacent vertices (terminal vertices) for each initial vertex in the graph.

2. **Adjacency matrices**

3. **Incidence matrices**

## II. Adjacency Matrices

Let $G = (V, E)$ be a graph with $n$ vertices ordered as $v_1, v_2, \dots, v_n$. The adjacency matrix $A$ (or $A_G$) is an $n \times n$ matrix $[a_{ij}]$ based on this specific vertex ordering.

### 1. For Simple Graphs

- $A$ is a **zero-one matrix**.

- $a_{ij} = 1$ if $\{v_i, v_j\}$ is an edge of $G$.

- $a_{ij} = 0$ otherwise.

- **Property:** Adjacency matrices of undirected graphs are always **symmetric** ($a_{ij} = a_{ji}$). The main diagonal consists entirely of zeros (since there are no loops).

### 2. For Multigraphs and Pseudographs

- Zero-one matrices are insufficient due to multiple edges. $A$ becomes a matrix of **nonnegative integers**.

- $a_{ij}$ equals the **number of edges** associated with $\{v_i, v_j\}$.

- **Property:** Still symmetric for undirected graphs. A loop at vertex $v_i$ adds $1$ to the diagonal entry $a_{ii}$.

### 3. For Directed Graphs

- $A$ is a **zero-one matrix**.

- $a_{ij} = 1$ if there is an edge from $v_i$ to $v_j$ (i.e., $(v_i, v_j) \in E$).

- $a_{ij} = 0$ otherwise.

- **Property:** Not necessarily symmetric.

### 4. Matrix Entry Sums and Vertex Degrees

- **Undirected Graphs:** * The sum of the entries in a **row** $i$ equals the number of edges incident to vertex $i$.

    - This sum is equal to $\deg(v_i)$ **minus** the number of loops at $v_i$. _(Recall: A loop contributes $2$ to the degree, but only $1$ to the adjacency matrix row sum)._

- **Directed Graphs:**

    - Sum of entries in **row** $i$ = Out-degree $\deg^+(v_i)$.

    - Sum of entries in **column** $j$ = In-degree $\deg^-(v_j)$.

## III. Incidence Matrices

Let $G = (V, E)$ be an undirected graph with $n$ vertices ($v_1 \dots v_n$) and $m$ edges ($e_1 \dots e_m$).

- The incidence matrix $M = [m_{ij}]$ is an $n \times m$ matrix.

- $m_{ij} = 1$ if edge $e_j$ is incident with vertex $v_i$.

- $m_{ij} = 0$ otherwise.

**Key Property:**

- Every column representing an edge connecting two distinct vertices contains exactly **two $1$s**.

- Every column representing a loop contains exactly **one $1$**.

## IV. Isomorphism of Graphs

**Concept:** Graphs that have the exact same structural connections are isomorphic, regardless of how they are drawn or labeled.

### 1. Formal Definition

Two simple graphs $G_1 = (V_1, E_1)$ and $G_2 = (V_2, E_2)$ are **isomorphic** if there exists a **one-to-one and onto function (bijection)** $f: V_1 \to V_2$ such that:

- For all $a, b \in V_1$, $a$ and $b$ are adjacent in $G_1$ **if and only if** $f(a)$ and $f(b)$ are adjacent in $G_2$.

- This function $f$ is called an **isomorphism**. It preserves the adjacency relationship.

### 2. Graph Invariants

Determining isomorphism directly is computationally difficult (checking $n!$ possible 1-1 correspondences). Instead, we use **invariants**—properties that must be identical for two graphs to be isomorphic. If any invariant differs, the graphs are definitively _not_ isomorphic.

**Important Invariants Include:**

- The number of vertices ($|V|$).

- The number of edges ($|E|$).

- The degrees of corresponding vertices (the degree sequences must match).

- Structural properties (e.g., if one graph is bipartite, complete, or a wheel, the other must identically be).

- Existence of specific subgraphs or cycles of specific lengths.

### 3. Proving Isomorphism

To definitively prove two graphs are isomorphic:

1. Find the specific bijective function $f$ that maps $V_1$ to $V_2$.

2. Show that $f$ preserves all adjacency relations.

3. **Matrix Method:** The adjacency matrix of $G$ is exactly the same as the adjacency matrix of $H$ when the rows and columns of $H$'s matrix are reordered to correspond to the images under mapping $f$.
