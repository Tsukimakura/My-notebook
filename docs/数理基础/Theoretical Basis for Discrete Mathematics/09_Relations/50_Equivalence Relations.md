# 50_Equivalence Relations

## 1. Core Definitions

- **Equivalence Relation (Definition 1):** A relation on a set $A$ is called an equivalence relation if it is **reflexive**, **symmetric**, and **transitive**.

- **Equivalent Elements (Definition 2):** Two elements $a$ and $b$ that are related by an equivalence relation are called _equivalent_. This is often denoted by the notation **$a \sim b$**.

## 2. Key Examples & Counterexamples

- **Example 1: Strings of English Letters**

    - Let $R$ be a relation where $aRb$ if and only if $l(a) = l(b)$ (where $l(x)$ is the length of string $x$).

    - _Is it an equivalence relation?_ **Yes.**

        - Reflexivity: $l(a) = l(a) \implies aRa$.

        - Symmetry: $aRb \implies l(a) = l(b) \implies l(b) = l(a) \implies bRa$.

        - Transitivity: $aRb$ and $bRc \implies l(a)=l(b)$ and $l(b)=l(c) \implies l(a)=l(c) \implies aRc$.

- **Example 2: Congruence Modulo $m$**

    - Let $m > 1$ be an integer. The relation $R = \{(a,b) \mid a \equiv b \pmod m\}$ is an equivalence relation on the set of integers.

    - _Proof:_

        - Reflexivity: $a \equiv a \pmod m$ because $a - a = 0 = 0 \cdot m$.

        - Symmetry: $a \equiv b \pmod m \implies a - b = km \implies b - a = (-k)m \implies b \equiv a \pmod m$.

        - Transitivity: $a \equiv b \pmod m$ and $b \equiv c \pmod m \implies a - b = km$ and $b - c = lm$. Adding these yields $a - c = (k+l)m \implies a \equiv c \pmod m$.

- **Counterexample: "Divides" Relation**

    - The "divides" relation ($a \mid b$) on positive integers is **not** an equivalence relation.

    - While it is reflexive ($a \mid a$) and transitive (if $a \mid b$ and $b \mid c$, then $a \mid c$), it is **not symmetric**. For example, $2 \mid 4$, but $4 \nmid 2$.

## 3. Equivalence Classes

- **Definition 3:** Let $R$ be an equivalence relation on a set $A$. The set of all elements related to an element $a$ of $A$ is called the **equivalence class of $a$**.

    - Notation: **$[a]_R$** (or simply $[a]$ when the relation is understood).

    - Set definition: $[a]_R = \{s \mid (a,s) \in R\}$.

- **Representative:** If $b \in [a]_R$, then $b$ is called a _representative_ of this equivalence class. Any element of a class can serve as its representative.

- **Example (Congruence Classes):** For modulo 4:

    - $[0]_4 = \{\dots, -8, -4, 0, 4, 8, \dots\}$

    - $[1]_4 = \{\dots, -7, -3, 1, 5, 9, \dots\}$

- **Theorem 1:** Let $R$ be an equivalence relation on a set $A$. The following statements for elements $a$ and $b$ of $A$ are logically equivalent:

    1. $aRb$

    2. $[a] = [b]$

    3. $[a] \cap [b] \neq \emptyset$

## 4. Partitions of a Set

- **Definition:** A partition of a set $S$ is a collection of disjoint, nonempty subsets of $S$ that have $S$ as their union. A collection of subsets $A_i$ (where $i \in I$, an index set) forms a partition if and only if:

    1. $A_i \neq \emptyset$ for $i \in I$

    2. $A_i \cap A_j = \emptyset$ when $i \neq j$

    3. $\bigcup_{i \in I} A_i = S$

- **Notation:** $pr(A) = \{A_i \mid i \in I\}$ represents the partition of set $A$.

- **Theorem 2 (The Fundamental Theorem of Equivalence Relations):**

    - Let $R$ be an equivalence relation on a set $S$. The equivalence classes of $R$ form a partition of $S$.

    - _Conversely_, given any partition $\{A_i \mid i \in I\}$ of the set $S$, there is exactly one equivalence relation $R$ that has the sets $A_i$ as its equivalence classes.

    - _Conclusion:_ **An equivalence relation on a set $A \iff$ a partition of $A$.**

- **Example (Counting Relations):** If a set $A$ has 3 elements ($|A|=3$), finding the number of possible equivalence relations is identical to finding the number of ways to partition a 3-element set. There are exactly 5 possible partitions (one block of 3; three ways to have a block of 2 and a block of 1; one way to have three blocks of 1). Therefore, there are 5 equivalence relations.

## 5. Combining Equivalence Relations

Let $R$ and $S$ be two equivalence relations on a set $A$.

- **Intersection ($R \cap S$): Is it an equivalence relation? YES.**

    - _Reflexivity:_ $(a,a) \in R$ and $(a,a) \in S \implies (a,a) \in R \cap S$.

    - _Symmetry:_ $(R \cap S)^{-1} = R^{-1} \cap S^{-1} = R \cap S$.

    - _Transitivity:_ $(R \cap S)^2 = R^2 \cap S^2 \subseteq R \cap S$.

- **Union ($R \cup S$): Is it an equivalence relation? NO.**

    - _Theorem:_ If $R_1, R_2$ are equivalence relations on $A$, $R_1 \cup R_2$ is guaranteed to be **reflexive** and **symmetric**.

    - _Why it fails:_ It is generally **not transitive**.

    - _Counterexample:_ Let $A = \{a,b,c\}$.

        - $R_1$ has classes $\{a,b\}$ and $\{c\}$. $R_1$ contains $(a,b)$.

        - $R_2$ has classes $\{a\}$ and $\{b,c\}$. $R_2$ contains $(b,c)$.

        - $R_1 \cup R_2$ contains $(a,b)$ and $(b,c)$, but does not contain $(a,c)$. Therefore, transitivity fails.

- **Transitive Closure of Union ($(R_1 \cup R_2)^*$):**

	- _Theorem:_ If $R_1, R_2$ are equivalence relations on $A$, then their transitive closure **$(R_1 \cup R_2)^*$ is an equivalence relation** on $A$.
