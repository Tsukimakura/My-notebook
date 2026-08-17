## 1. Core Definitions

- **Partial Ordering:** A relation $R$ on a set $S$ is called a partial ordering (or partial order) if it is **reflexive**, **antisymmetric**, and **transitive**.
    
- **Partially Ordered Set (Poset):** A set $S$ together with a partial ordering $R$ is called a poset, denoted by **$(S, R)$** or **$(S, \preccurlyeq)$**.
    
- **Standard Examples of Posets:**
    
    - $(\mathbb{Z}, \ge)$: The "greater than or equal to" relation on integers.
        
    - $(\mathbb{Z}^+, \mid)$: The divisibility relation on positive integers.
        
    - $(P(S), \subseteq)$: The subset (inclusion) relation on the power set of $S$.
        

## 2. Comparability and Ordering Types

- **Comparability:** In a poset $(S, \preccurlyeq)$, elements $a$ and $b$ are **comparable** if either $a \preccurlyeq b$ or $b \preccurlyeq a$. If neither holds, they are **incomparable**.
    
- **Total Order (Linear Order):** If _every_ two elements of a poset $S$ are comparable, $S$ is a totally ordered set (or linearly ordered set). Such a set is also called a **chain**.
    
- **Well-Ordered Set:** A poset $(S, \preccurlyeq)$ is well-ordered if it is a total ordering and _every_ nonempty subset of $S$ has a least element.
    
- **Lexicographic Order:** A method of ordering elements in a Cartesian product or strings (dictionary order). For $(a_1, a_2) \prec (b_1, b_2)$, it requires either $a_1 \prec_1 b_1$, or ($a_1 = b_1$ and $a_2 \prec_2 b_2$).
    

## 3. Hasse Diagrams

A Hasse diagram is a simplified visual representation of a finite poset that eliminates redundant edges implied by the properties of partial orders.

**Construction Procedure:**

1. **Start** with the directed graph of the relation.
    
2. **Remove loops:** Delete all edges of the form $(a, a)$ (implied by reflexivity).
    
3. **Remove transitive edges:** Delete all edges $(x, y)$ if there exists an element $z$ such that $x \prec z$ and $z \prec y$ (implied by transitivity).
    
4. **Arrange and simplify:** Arrange vertices so all remaining edges point upwards. Finally, remove the directional arrows.
    

## 4. Poset Terminology (Extrema and Bounds)

Let $A$ be a subset of a poset $(S, \preccurlyeq)$.

- **Elements within the Poset:**
    
    - **Maximal element:** $a \in S$ is maximal if there is no $b \in S$ such that $a \prec b$. (Top nodes in a Hasse diagram).
        
    - **Minimal element:** $a \in S$ is minimal if there is no $b \in S$ such that $b \prec a$. (Bottom nodes in a Hasse diagram).
        
    - **Greatest element:** $a \in S$ is the greatest element if $b \preccurlyeq a$ for all $b \in S$. _(Theorem: Unique if it exists)._
        
    - **Least element:** $a \in S$ is the least element if $a \preccurlyeq b$ for all $b \in S$. _(Theorem: Unique if it exists)._
        
- **Bounds of a Subset $A$:**
    
    - **Upper bound:** $u \in S$ is an upper bound of $A$ if $a \preccurlyeq u$ for all $a \in A$.
        
    - **Lower bound:** $l \in S$ is a lower bound of $A$ if $l \preccurlyeq a$ for all $a \in A$.
        
    - **Least Upper Bound (LUB):** An upper bound $x$ of $A$ such that $x \preccurlyeq z$ for all other upper bounds $z$.
        
    - **Greatest Lower Bound (GLB):** A lower bound $y$ of $A$ such that $z \preccurlyeq y$ for all other lower bounds $z$.
        

## 5. Lattices

- **Definition:** A partially ordered set in which **every pair** of elements has both a least upper bound (LUB) and a greatest lower bound (GLB) is called a **lattice**.
    
- **Standard Lattice Examples:**
    
    - $(\mathbb{Z}, \le)$: LUB is $\max(a,b)$; GLB is $\min(a,b)$. (Note: _Every totally ordered set is a lattice_).
        
    - $(\mathbb{Z}^+, \mid)$: LUB is the Least Common Multiple (LCM); GLB is the Greatest Common Divisor (GCD).
        
    - $(P(S), \subseteq)$: LUB is the union ($A \cup B$); GLB is the intersection ($A \cap B$).
        

## 6. Topological Sorting

- **Definition:** A total ordering $\preccurlyeq$ is compatible with a partial ordering $R$ if $a \preccurlyeq b$ whenever $a R b$. Topological sorting is the process of constructing this compatible total ordering.
    
- **Core Lemma:** Every finite nonempty poset has at least one minimal element.
    
- **Algorithm:**
    
    1. Find a minimal element in the poset $S$.
        
    2. Remove this element and place it next in the total ordering sequence.
        
    3. Repeat the process with the remaining elements in $S$ until the set is empty.