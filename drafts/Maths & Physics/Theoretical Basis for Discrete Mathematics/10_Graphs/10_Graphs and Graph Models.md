# 10_Graphs and Graph Models

## I. Core Definitions

### 1. Undirected Graphs

- **Graph definition**: A graph $G=(V,E)$ consists of $V$, a nonempty set of **vertices** (or **nodes**), and $E$, a set of **edges**.

    - Each edge has either one or two vertices associated with it, called its **endpoints**.

    - An edge is said to **connect** its endpoints.

- **Remarks**:

    - Graph theory is entirely unrelated to the graphs of functions studied in algebra or calculus.

    - All that matters is the connections made by the edges, not the particular geometry depicted.

    - Graphs can be categorized as finite graphs or infinite graphs.

- **Types of Undirected Graphs**:

    1. **Simple graph**: A graph in which each edge connects two different vertices and where no two edges connect the same pair of vertices (no loops and no multiple edges).

    2. **Multigraph**: Graphs that may have multiple edges connecting the same vertices.

    3. **Pseudograph**: Graphs that may include loops, and possibly multiple edges connecting the same pair of vertices.

- **Subset Relationship**: Simple Graphs $\subset$ Multigraphs $\subset$ Pseudographs.

### 2. Directed Graphs (Digraphs)

- **Directed graph definition**: A directed graph (or digraph) $G=(V,E)$ consists of a nonempty set of vertices $V$ and a set of **directed edges** (or **arcs**) $E$.

    - Each directed edge is associated with an ordered pair of vertices $(u,v)$.

    - The directed edge associated with the ordered pair $(u,v)$ is said to **start** at $u$ and **end** at $v$.

- **Types of Digraphs**:

    1. **Simple directed graph**: A directed graph that has no loops and no multiple directed edges.

    2. **Directed multigraph**: A directed graph that may have multiple directed edges from a vertex to a second (possibly the same) vertex.

## II. Graph Models and Applications

Problems in almost every conceivable discipline can be solved using graph models.

### 1. Basic Modeling Examples

- **Bi-directional Railway Networks**: Modeled using a **simple graph**. An edge $\{a, b\}$ indicates a direct train connection between cities $a$ and $b$.

- **Round-robin Tournaments**: Modeled using a **directed graph**. An edge $(a, b)$ indicates that team $a$ beats team $b$.

### 2. Social Networks

_Vertices represent individuals or organizations, and edges represent relationships._

- **Friendship graphs**: **Undirected graphs** where two people are connected if they are friends (e.g., on Facebook).

- **Collaboration graphs**: **Undirected graphs** where two people are connected if they collaborate in a specific way.

    - _Hollywood graph_: Vertices are actors, and an edge connects two actors if they have appeared in the same movie.

    - _Academic collaboration graph_: Vertices are researchers, and an edge connects them if they have coauthored a paper.

- **Influence graphs**: **Directed graphs** where there is an edge from one person to another if the first person can influence the second person.

### 3. Information Networks

- **The Web graph**: **Directed graphs**. Web pages are represented by vertices, and links are represented by directed edges.

- **Citation network**: **Directed graphs**. Research papers are represented by vertices. When a paper cites a second paper as a reference, there is a directed edge from the vertex representing the first paper to the vertex representing the second.

### 4. Transportation Graphs

- **Airline networks**: Modeled using **directed multigraphs**. Airports are represented by vertices, and each flight is represented by a directed edge from the departure airport to the destination airport.

- **Road networks**: Intersections are represented by vertices. Undirected edges represent two-way roads, and directed edges represent one-way roads.

### 5. Software Design Applications

- **Module dependency graph**: **Directed graphs**. When a top-down approach is used to design software, dependencies between modules must be understood. Vertices represent software modules, and there is a directed edge from one module to another if the second module depends on the first.

- **Precedence graph**: **Directed graphs**. Represents which statements must have already been executed before we execute each statement. Vertices represent statements in a computer program, and there is a directed edge from a vertex to a second vertex if the second vertex cannot be executed before the first.

### 6. Biological Applications

- **Niche overlap graphs**: **Undirected graphs** that model competition between species in an ecosystem. Vertices represent species, and an edge connects two vertices when they represent species who compete for the same food resources.
