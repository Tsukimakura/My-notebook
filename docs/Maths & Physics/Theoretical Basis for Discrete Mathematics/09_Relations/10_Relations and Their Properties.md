# 10_Relations and Their Properties

## 1. Basics of Binary Relations

While relationships can be $N$-ary (complex, among many objects), the foundational concept in this course is the binary relation. **Relations are more general than functions**; a function requires exactly one element of $B$ to relate to each element of $A$, whereas relations have no such constraint.

- **Binary Relation from $A$ to $B$**

    - **Definition**: A binary relation $R$ from a set $A$ to a set $B$ is a subset $R \subseteq A \times B$.

- **Binary Relation on a Set**

    - **Definition**: A binary relation $R$ on a set $A$ is a subset of $A \times A$ (or a relation from $A$ to $A$).

- **Counting Relations**

    - How many relations exist on a set $A$?

    - If a set $A$ has $n$ elements, the Cartesian product $A \times A$ has $n^2$ elements.

    - A set with $m$ elements has $2^m$ subsets.

    - Therefore, there are **$2^{n^2}$** possible relations on a set $A$ with $n$ elements.

## 2. Core Properties of Relations

- **Reflexive Relations**

    - **Definition**: $R$ is reflexive iff $(a,a) \in R$ for every element $a \in A$.

    - **Symbolically**: $\forall x [x \in U \to (x,x) \in R]$

    - _Note_: If $A = \emptyset$, then the empty relation is reflexive vacuously.

- **Symmetric Relations**

    - **Definition**: $R$ is symmetric iff $(b,a) \in R$ whenever $(a,b) \in R$ for all $a,b \in A$.

    - **Symbolically**: $\forall x \forall y [(x,y) \in R \to (y,x) \in R]$

- **Antisymmetric Relations**

    - **Definition**: A relation $R$ on a set $A$ such that for all $a,b \in A$, if $(a,b) \in R$ and $(b,a) \in R$, then $a = b$.

    - **Symbolically**: $\forall x \forall y [(x,y) \in R \land (y,x) \in R \to x = y]$

- **Transitive Relations**

    - **Definition**: A relation $R$ on a set $A$ is called transitive if whenever $(a,b) \in R$ and $(b,c) \in R$, then $(a,c) \in R$, for all $a,b,c \in A$.

    - **Symbolically**: $\forall x \forall y \forall z [(x,y) \in R \land (y,z) \in R \to (x,z) \in R]$

> **Critical Trap:** Does Symmetric + Transitive $\Rightarrow$ Reflexive?
>
> **No.** The argument $(a,b) \in R \land (b,a) \in R \Rightarrow (a,a) \in R$ assumes that for every $a$, there exists _some_ $b$ such that $(a,b) \in R$ ($\forall a \exists b (a,b) \in R$). If an element $a$ is completely isolated and relates to nothing, it fails reflexivity. Symmetry and transitivity alone are not enough to infer reflexivity.

## 3. Combining Relations

- **Basic Set Operations**

    - Because relations are sets of ordered pairs, two relations $R_1$ and $R_2$ can be combined using standard set operations: **$R_1 \cup R_2$**, **$R_1 \cap R_2$**, **$R_1 - R_2$**, and **$R_2 - R_1$**.

- **Relational Composition ($R_2 \circ R_1$)**

    - **Definition**: Suppose $R_1$ is a relation from $A$ to $B$, and $R_2$ is a relation from $B$ to $C$. The composition of $R_2$ with $R_1$, denoted $R_2 \circ R_1$, is a relation from $A$ to $C$ where if $(x,y) \in R_1$ and $(y,z) \in R_2$, then $(x,z) \in R_2 \circ R_1$.

    - _Note on ordering_: $R_2 \circ R_1$ means applying $R_1$ _first_, then $R_2$.

    - _Example_: If $M$ is "mother of" and $F$ is "father of", then $M \circ F$ is the relation "maternal grandfather" (mother of the father).

## 4. Powers and Inverse of a Relation

- **Powers of a Relation ($R^n$)**

    - **Definition**: Let $R$ be a binary relation on $A$. The powers $R^n$ of the relation $R$ are defined inductively:

        - **Basis Step**: $R^1 = R$

        - **Inductive Step**: $R^{n+1} = R^n \circ R$

- **Theorem 1**

    - A relation $R$ on a set $A$ is **transitive** if and only if **$R^n \subseteq R$** for $n=1,2,3,\dots$

    - _Proof logic_: If transitive, $R^2 \subseteq R$. Further, $R^3 = R^2 \circ R \subseteq R \circ R \subseteq R$, and this logic continues for all $n$.

- **Inverse Relation ($R^{-1}$)**

    - **Definition**: Let $R$ be a relation from set $A$ to set $B$. The inverse of $R$ is a relation from $B$ to $A$ defined as: **$R^{-1} = \{(b,a) \mid (a,b) \in R\}$**.
