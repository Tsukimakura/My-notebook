# 50_Euler and Hamilton Paths

## I. Euler Paths and Circuits (Edge-Focused)

The concept of Euler paths originates from the famous **Königsberg Seven Bridge Problem**: _Is it possible to start at some location, travel across all bridges without crossing any bridge twice, and return to the starting point?_ In graph theory, this translates to finding a simple circuit that contains every edge of a multigraph.

### 1. Core Terminology

- **Euler Path:** A simple path that contains **every edge** of a graph $G$ exactly once.

- **Euler Circuit:** A simple circuit that contains **every edge** of a graph $G$ exactly once.

- **Euler Graph:** A graph that contains an Euler circuit.

### 2. Conditions for Undirected Graphs

- **Theorem 1 (Euler Circuit):** A connected multigraph has an Euler circuit if and only if **each of its vertices has an even degree**.

- **Theorem 2 (Euler Path):** A connected multigraph has an Euler path (but _not_ an Euler circuit) if and only if it has **exactly two vertices of odd degree**.

    - _Note:_ In this case, the Euler path must start at one of the odd-degree vertices and end at the other.

    - _Königsberg Bridge Resolution:_ Since the modeled graph has 4 vertices of odd degree, it has neither an Euler circuit nor an Euler path.

### 3. Algorithm Concept for Constructing Euler Circuits

For a connected multigraph where all vertices have even degrees:

1. Begin at an arbitrary vertex and form a simple circuit by traversing edges until returning to the start.

2. Delete the edges used in this circuit from the graph.

3. Find a vertex in the remaining subgraph that intersects with the initial circuit.

4. Construct a new subcircuit from this common vertex using the remaining edges.

5. Splice the new subcircuit into the original circuit.

6. Repeat until all edges have been used.

### 4. Conditions for Directed Graphs

For a weakly connected directed multigraph having no isolated vertices:

- **Euler Circuit:** Exists if and only if the **in-degree and out-degree are equal** for _each_ vertex ($\deg^{-}(v) = \deg^{+}(v)$).

- **Euler Path:** Exists if and only if the in-degree and out-degree are equal for all vertices _except exactly two_:

    - One vertex must have an out-degree $1$ larger than its in-degree (the starting point).

    - One vertex must have an in-degree $1$ larger than its out-degree (the ending point).

### 5. Applications of Euler Paths/Circuits

- Solving continuous-motion drawing puzzles (drawing a shape without lifting the pencil or retracing lines).

- **The Chinese Postman Problem** (posed by Guan Meigu in 1962).

- Optimizing routes in networking and molecular biology.

## II. Hamilton Paths and Circuits (Vertex-Focused)

While Euler paths focus on traversing every _edge_, Hamilton paths focus on visiting every _vertex_. This concept is illustrated by **Hamilton's Puzzle** (finding a cycle on a dodecahedron that visits every corner exactly once).

### 1. Core Terminology

- **Hamilton Path:** A path in a graph $G$ that visits **every vertex** exactly once.

- **Hamilton Circuit (or Cycle):** A cycle that visits **every vertex** exactly once, except for the first vertex, which is visited again at the end of the cycle to close it.

- **Hamilton Graph:** A connected graph that contains a Hamilton circuit.

    - _Example:_ The complete graph $K_n$ has a Hamilton circuit whenever $n \ge 3$.

### 2. Sufficient Conditions for Existence

Finding a Hamilton circuit is generally more computationally difficult than finding an Euler circuit. However, there are sufficient conditions to guarantee one exists in a simple graph with $n$ vertices ($n \ge 3$):

- **Theorem 3 (Dirac's Theorem):** If the degree of _every_ vertex in $G$ is **at least $n/2$**, then $G$ has a Hamilton circuit.

- **Theorem 4 (Ore's Theorem):** If $\deg(u) + \deg(v) \ge n$ for every pair of **nonadjacent vertices** $u$ and $v$ in $G$, then $G$ has a Hamilton circuit.

### 3. Necessary Conditions and Properties

For a graph to possess a Hamilton circuit, it must strictly adhere to the following necessary conditions:

1. The graph $G$ must be connected.

2. The degree of _each_ vertex must be strictly **greater than $1$** (no isolated or pendant vertices).

3. If a vertex has a degree of exactly $2$, **both edges** incident to this vertex _must_ be part of any Hamilton circuit.

4. Once a Hamilton circuit has passed through a vertex, all remaining edges incident to that vertex (other than the two used in the circuit) can be removed from consideration.

5. **Component Constraint:** For any nonempty subset $S$ of the vertex set $V$, the number of connected components in the subgraph $G - S$ must be **less than or equal to** $|S|$ (the number of vertices in subset $S$).

### 4. Applications of Hamilton Paths/Circuits

- Routing problems requiring a visit to specific locations exactly once (e.g., street intersections, communication network nodes).

- **The Traveling Salesman Problem (TSP):** Finding the shortest possible Hamilton circuit in a weighted graph.

- Logistical arrangements, such as seating individuals at a round table so that every person shares a common trait (like a spoken language) with their immediate neighbors.
