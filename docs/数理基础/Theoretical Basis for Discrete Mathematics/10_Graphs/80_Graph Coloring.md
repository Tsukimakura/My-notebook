# 80_Graph Coloring

## I. Map Coloring and Dual Graphs

**The Map Coloring Problem**

A classic problem in mathematics is determining the least number of colors needed to color a map so that no two adjacent regions share the same color.

**Reduction to Graph Theory (The Dual Graph)**

The geographical problem of coloring a map can be directly translated into a graph-theoretic problem by constructing the **dual graph** of the map.

- **Vertices:** Each distinct region of the map is represented by a single vertex.

- **Edges:** An edge connects two vertices if and only if their corresponding regions share a positive-length common border.

- _Important Note:_ Two regions that touch at only a single point (a corner intersection) are **not** considered adjacent and do not receive a connecting edge.

- **Equivalence:** Coloring the regions of a map is strictly equivalent to coloring the vertices of its dual graph such that no two adjacent vertices have the same color.

## II. Core Terminologies

- **Graph Coloring:** A coloring of a simple graph is the assignment of a color to each vertex of the graph, ensuring that no two adjacent vertices are assigned the same color.

- **Chromatic Number:** The absolute least number of colors needed for a valid coloring of a given graph. It is traditionally denoted by $\chi(G)$ (represented as $x(G)$ in the source material).

## III. The Four Color Theorem

**Theorem Statement:** The chromatic number of any **planar graph** is no greater than four ($\chi(G) \le 4$).

- **Practical Implication:** Any planar map of regions can be depicted using 4 colors or fewer without any border-sharing regions matching in color.

- **Historical Context:** Originally proposed as an unsolved conjecture in the 1850s.

- **Proof:** It was ultimately proven by mathematicians Haken and Appel in 1976, notably relying on an exhaustive computer search.

- **Strict Limitation:** The Four Color Theorem applies **only** to planar graphs. Nonplanar graphs do not have this restriction and can have arbitrarily large chromatic numbers.

## IV. Chromatic Numbers of Simple Graphs

**Proof Methodology**

To rigorously prove that the chromatic number of a graph is $n$ ($\chi(G) = n$), two conditions must be met:

1. Show that the graph _can_ be colored with $n$ colors (usually done by constructing a valid coloring configuration).

2. Show that the graph _cannot_ possibly be colored using fewer than $n$ colors.

**Reference Chromatic Numbers for Common Graphs:**

- **Isolated Vertices:** If a graph $G$ contains only isolated vertices (no edges), it requires only one color.

    - $\chi(G) = 1$

- **Paths:** If graph $G$ is a path containing no circuits, it can alternate between two colors.

    - $\chi(G) = 2$

- **Cycles ($C_n$):** The chromatic number depends on the parity of the vertices.

    - If $n$ is **even**: $\chi(G) = 2$

    - If $n$ is **odd**: $\chi(G) = 3$ (the odd parity forces a third color to close the loop).

- **Complete Graphs ($K_n$):** Because every single vertex is adjacent to every other vertex, no two vertices can share a color.

    - $\chi(G) = n$

- **Bipartite Graphs:** * A simple graph with a chromatic number of 2 is, by definition, bipartite.

    - Conversely, any connected bipartite graph inherently has a chromatic number of 2.

## V. Applications of Graph Colorings

Graph coloring is a powerful modeling tool used to solve various practical grouping, partitioning, and resource allocation problems where certain pairs of items are incompatible.

### 1. Scheduling Exams

- **The Problem:** How can final exams at a university be scheduled such that no student has two exams at the same time, using the minimum number of time slots?

- **Graph Model Translation:**

    - **Vertices:** Represent the courses.

    - **Edges:** Connect two vertices if there is a conflict—meaning the two courses share at least one common student and therefore _cannot_ be scheduled simultaneously.

    - **Colors:** Represent the distinct time slots for the exams.

    - **Solution:** Finding a valid coloring of this graph guarantees no conflicting exams share a time slot. The graph's **chromatic number** dictates the absolute minimum number of exam slots necessary.

- **Methodology (Using the Complementary Graph):**

    When given data on which courses _can_ be scheduled together (i.e., courses with no common students), you can use the complementary graph approach to find the solution:

    1. **Draw the Compatibility Graph:** Connect vertices (courses) with edges if they have NO common students.

    2. **Compute the Complementary Graph:** Draw a new graph with the same vertices, but place edges between pairs of vertices _only if they are not connected_ in the first graph. This results in the **conflict graph**, where edges directly represent scheduling conflicts.

    3. **Color the Graph:** Apply graph coloring to the complementary (conflict) graph. Vertices that receive the same color can be safely grouped into the same exam time slot.

### 2. Assigning Natural Habitats (Zoo Enclosures)

- **The Problem:** How can a zoo assign animals to natural habitats such that incompatible animals (e.g., due to predator/prey dynamics or conflicting eating habits) are not placed in the same enclosure?

- **Graph Model Translation:**

    - **Vertices:** Represent the different species of animals.

    - **Edges:** Connect two vertices if the animals they represent _cannot_ coexist in the same habitat.

    - **Colors:** Represent the distinct physical habitats or enclosures.

    - **Solution:** A valid coloring of this graph provides a safe assignment of animals to habitats. The chromatic number yields the minimum number of separate enclosures the zoo needs to build.
