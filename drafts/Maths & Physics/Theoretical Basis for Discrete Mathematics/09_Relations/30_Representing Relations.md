# 30_Representing Relations

## 1. Representing Relations Using Matrices

A relation between finite sets can be represented using a zero-one matrix.

**Definition**

Suppose $R$ is a relation from $A = \{a_1, a_2, \dots, a_m\}$ to $B = \{b_1, b_2, \dots, b_n\}$. The relation $R$ can be represented by the matrix $M_R = [m_{ij}]$, where:

$$
m_{ij} = \begin{cases} 1 & \text{if } (a_i, b_j) \in R \\ 0 & \text{if } (a_i, b_j) \notin R \end{cases}
$$

_(Note: The elements of the sets can be listed in any arbitrary order. When $A = B$, the same ordering must be used for both rows and columns)._

**Identifying Relation Properties from Matrices (for a relation on set $A$)**

Let $M_R$ be the matrix representation of a relation $R$ on a set $A$:

- **Reflexive:** All elements on the main diagonal of $M_R$ are equal to $1$ ($m_{ii} = 1$ for all $i$).

- **Symmetric:** The matrix is symmetric, meaning $m_{ij} = 1$ if and only if $m_{ji} = 1$. In matrix terms, $M_R = M_R^T$ (the matrix equals its transpose).

- **Antisymmetric:** For any $i \neq j$, either $m_{ij} = 0$ or $m_{ji} = 0$. (They cannot both be $1$, which would violate antisymmetry).

**Example Application:**

Given $M_R = \begin{bmatrix} 1 & 1 & 0 \\ 1 & 1 & 1 \\ 0 & 1 & 1 \end{bmatrix}$:

- _Reflexive?_ Yes, the diagonal elements ($m_{11}, m_{22}, m_{33}$) are all $1$.

- _Symmetric?_ Yes, $m_{ij} = m_{ji}$ for all elements.

- _Antisymmetric?_ No, because both $m_{12} = 1$ and $m_{21} = 1$ (where $1 \neq 2$).

---

## 2. Representing Relations Using Digraphs

**Definition**

A **directed graph** (or **digraph**) consists of a set $V$ of vertices (nodes) and a set $E$ of ordered pairs of elements of $V$ called edges (arcs).

- For an edge $(a, b)$, $a$ is the **initial vertex** and $b$ is the **terminal vertex**.

- An edge of the form $(a, a)$ is called a **loop**.

**Determining Properties from a Digraph**

- **Reflexivity:** A loop must be present at _every_ vertex in the graph.

- **Symmetry:** If there is an edge from $x$ to $y$, there must be a corresponding return edge from $y$ to $x$.

- **Antisymmetry:** If there is an edge from $x$ to $y$ (where $x \neq y$), there is _no_ edge from $y$ to $x$.

- **Transitivity:** If there is an edge from $x$ to $y$ and an edge from $y$ to $z$, there must be an edge directly from $x$ to $z$.

_(Note: Properties like symmetry, antisymmetry, and transitivity can hold **trivially**. For example, if a graph has no edges at all between distinct vertices, it is trivially symmetric, antisymmetric, and transitive)._

---

## 3. Powers of a Relation via Digraphs

The powers of a relation $R^n$ can be visually interpreted using its digraph.

- **Rule:** The pair $(x, y)$ is in $R^n$ if and only if there is a **path of length $n$** from vertex $x$ to vertex $y$ in the digraph of $R$ (following the direction of the arrows).

---

## 4. Inverse Relations and Operations

**Inverse Relation ($R^{-1}$)**

Given $R = \{(a, b) \mid a \in A, b \in B, aRb\}$, the inverse relation from $B$ to $A$ is:

$$
R^{-1} = \{(b, a) \mid (a, b) \in R, a \in A, b \in B\}
$$

**Methods to find $R^{-1}$:**

1. **Direct Definition:** Swap the elements in every ordered pair of $R$.

2. **Digraphs:** Reverse the direction of all arcs in the digraph representation of $R$.

3. **Matrices:** Take the transpose of the connection matrix ($M_{R^{-1}} = M_R^T$).

**Properties of Relation Operations**

Suppose $R, S$ are relations from $A$ to $B$, $T$ is a relation from $B$ to $C$, and $P$ is a relation from $C$ to $D$. The following properties hold:

1. $(R \cup S)^{-1} = R^{-1} \cup S^{-1}$

2. $(R \cap S)^{-1} = R^{-1} \cap S^{-1}$

3. $(\overline{R})^{-1} = \overline{R^{-1}}$

4. $(R - S)^{-1} = R^{-1} - S^{-1}$

5. $(A \times B)^{-1} = B \times A$

6. $\overline{R} = (A \times B) - R$

7. $(S \circ T)^{-1} = T^{-1} \circ S^{-1}$ _(Note the reversal of order)_

8. $(R \circ T) \circ P = R \circ (T \circ P)$ _(Associative property of composition)_

9. $(R \cup S) \circ T = (R \circ T) \cup (S \circ T)$ _(Distributive property)_
