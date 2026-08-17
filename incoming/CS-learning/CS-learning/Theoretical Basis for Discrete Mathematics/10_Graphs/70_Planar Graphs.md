## I. Core Definitions

- **Planar Graph:** A graph is called _planar_ if it can be drawn in the plane without any edges crossing.
    
- **Planar Representation:** Such a drawing (where no edges intersect except at their endpoints) is called a planar representation of the graph.
    
- **Practical Importance:** 
	
	- Any graph representation of maps is inherently planar.
	    
    - Electronic circuits are usually represented by planar graphs to avoid short circuits between crossing wires.
        
- _Note:_ Proving that a graph is planar often amounts to redrawing the edges in a way that no edges will cross. This may require moving vertices around and drawing edges in a highly indirect, non-linear fashion.
    

## II. Regions and Euler's Formula

### 1. Regions

A planar representation of a graph splits the plane into separate areas.

- **Definition:** A region is a part of the plane completely disconnected from other parts of the plane by the edges of the graph.
    
- **Types of Regions:**
    
    1. **Bounded regions:** Enclosed completely by a set of edges.
        
    2. **Unbounded region:** The infinite area surrounding the outside of the graph. _Every planar graph has exactly one unbounded region._
        

### 2. Euler's Formula (Theorem 1)

Let $G$ be a **connected planar simple graph** with $e$ edges and $v$ vertices. Let $r$ be the number of regions in a planar representation of $G$. Then the relationship between regions, edges, and vertices is defined by Euler's Formula:

$$r = e - v + 2$$

- _Note:_ Euler's formula provides a _necessary condition_ for planarity.
    

## III. Degrees of Regions and Bounding Edges

### 1. Degree of a Region

- **Definition:** Suppose $R$ is a region of a connected planar simple graph. The **number of edges on the boundary** of $R$ is called the _Degree of R_, denoted as $\deg(R)$.
    
- **Key Property:** Each edge contributes to the boundary of two regions (or contributes twice to a single region if it is a cut edge). Therefore, the sum of the degrees of all regions equals twice the number of edges:
    
    $$\sum \deg(R_i) = 2e$$
    

### 2. Edge Bound Corollaries

Because every region in a simple planar graph (with $v \ge 3$) must be bounded by at least 3 edges ($\deg(R) \ge 3$), we can derive crucial upper bounds on the number of edges a planar graph can have.

- **Corollary 1 (General Edge Bound):** If $G$ is a connected planar simple graph with $e$ edges and $v$ vertices where $v \ge 3$, then:
    
    $$e \le 3v - 6$$
    
    - _Application:_ This is used to prove that $K_5$ (the complete graph with 5 vertices) is **nonplanar**. For $K_5$, $v=5$ and $e=10$. The formula requires $10 \le 3(5) - 6 \Rightarrow 10 \le 9$, which is false.
        
- **Corollary 2 (Minimum Degree Bound):**
    
    If $G$ is a connected planar simple graph, then $G$ must have at least one vertex of degree not exceeding five (i.e., $\deg(v) \le 5$).
    
- **Corollary 3 (Bipartite / No 3-Cycles Edge Bound):** If a connected planar simple graph has $e$ edges and $v$ vertices with $v \ge 3$ and **no circuits of length 3**, then:
    
    $$e \le 2v - 4$$
    
    - _Generalization:_ If every region has at least $k$ edges, then $e \le \frac{(v-2)k}{k-2}$.
        
    - _Application:_ This is used to prove that $K_{3,3}$ (the complete bipartite graph with 3 vertices in each set) is **nonplanar**. Since $K_{3,3}$ is bipartite, it has no cycles of length 3. Here, $v=6$ and $e=9$. The formula requires $9 \le 2(6) - 4 \Rightarrow 9 \le 8$, which is false.
        

## IV. Kuratowski's Theorem

Euler's formula and its corollaries can prove certain graphs are nonplanar, but they are not sufficient conditions (some nonplanar graphs still satisfy the inequalities). Kuratowski's Theorem provides the definitive necessary and sufficient condition for planarity.

### 1. Preliminary Concepts

- **Elementary Subdivision:** The process of removing an edge $\{u, v\}$ and replacing it with a new vertex $w$ and two new edges $\{u, w\}$ and $\{w, v\}$.
    
- **Homeomorphic Graphs:** Two graphs $G_1$ and $G_2$ are called _homeomorphic_ if they can be obtained from the same graph by a sequence of elementary subdivisions. (Essentially, they have the same core topological structure, just with different numbers of vertices along their paths).
    

### 2. Kuratowski's Theorem (Theorem 2)

A graph is **nonplanar** if and only if it contains a subgraph that is **homeomorphic to $K_{3,3}$ or $K_5$**.

- _Methodology:_ To prove any complex graph is nonplanar, you must identify a subgraph within it, strip away redundant vertices of degree 2 (reverse subdivision), and show that the remaining underlying structure is exactly $K_5$ or $K_{3,3}$.