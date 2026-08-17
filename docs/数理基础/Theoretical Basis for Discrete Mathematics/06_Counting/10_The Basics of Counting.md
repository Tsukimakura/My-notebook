# 10_The Basics of Counting

## 1. Fundamental Counting Principles

### The Product Rule

If a procedure can be broken down into a sequence of two independent tasks, where the first task can be done in $n_1$ ways and the second task in $n_2$ ways, then there are $n_1 \cdot n_2$ ways to complete the procedure.

- **Set Theory Formulation:** If $A_1, A_2, \dots, A_m$ are finite sets, the number of elements in their Cartesian product is the product of the number of elements in each set:

    $|A_1 \times A_2 \times \dots \times A_m| = |A_1| \cdot |A_2| \dots |A_m|$

### The Sum Rule

If a task can be done in either one of $n_1$ ways or one of $n_2$ ways, and no way from the first set is the same as any from the second set, there are $n_1 + n_2$ ways to do the task.

- **Set Theory Formulation:** For disjoint sets $A$ and $B$ (where $A \cap B = \emptyset$), the cardinality of their union is:

    $|A \cup B| = |A| + |B|$

- **Generalized:** $|A_1 \cup A_2 \dots \cup A_m| = |A_1| + |A_2| \dots + |A_m|$ (provided $A_i \cap A_j = \emptyset$ for all $i \neq j$).

### The Subtraction Rule (Principle of Inclusion-Exclusion)

If a task can be done in either $n_1$ ways or $n_2$ ways, the total number of ways is $n_1 + n_2$ minus the number of ways common to both approaches. This prevents double-counting.

- **Mathematical Formulation:** $|A \cup B| = |A| + |B| - |A \cap B|$

### The Division Rule

If a task can be done using a procedure that has $n$ ways, but for every distinct outcome $w$, exactly $d$ of those $n$ ways correspond to $w$, then there are $n/d$ distinct ways to do the task.

- **Set Theory Formulation:** If a finite set $A$ is the union of pairwise disjoint subsets each containing $d$ elements, the number of subsets is $|A|/d$.

- **Function Formulation:** If $f: A \rightarrow B$ is a function between finite sets where for every $y \in B$ there are exactly $d$ values $x \in A$ such that $f(x) = y$, then $|B| = |A|/d$.

---

## 2. Standard Applications & Formulas

By applying the basic rules above, several standard formulas can be derived for common discrete structures:

- **Bit Strings:** The number of bit strings of length $n$ is $2^n$ (Product rule: 2 choices per bit).

- **Subsets of a Finite Set:** A set $S$ has $2^{|S|}$ subsets. (This is derived by establishing a one-to-one correspondence between subsets and bit strings of length $|S|$).

- **Total Functions:** The number of functions from a domain of size $m$ to a codomain of size $n$ is $n^m$ (Product rule: $n$ choices for each of the $m$ domain elements).

- **One-to-One (Injective) Functions:** The number of one-to-one functions from a set of size $m$ to a set of size $n$ (where $m \le n$) is:

    $n(n-1)(n-2)\dots(n-m+1)$

---

## 3. Tree Diagrams

For problems where the number of choices at a given step depends on the choices made in previous steps, **Tree Diagrams** provide a visual method for counting.

- **Branches** represent a specific possible choice.

- **Leaves** represent the final possible outcomes.

- The total number of valid outcomes is determined by counting the terminal leaves of the constructed tree.

---

## 4. Solving Complex Problems (Combining Rules)

Most real-world discrete math problems require combining these rules.

- **Partitioning Scenarios (Sum + Product):** When calculating valid passwords, network addresses (e.g., IPv4), or specific constraints (like bit strings containing specific patterns), break the master problem into mutually exclusive cases (Sum Rule). Then, calculate the permutations within each specific case (Product Rule).

- **Overlapping Conditions (Sum + Subtraction):** When conditions are not mutually exclusive (e.g., bit strings that start with '1' OR end with '00'), calculate the totals for each condition individually, add them, and subtract the intersection (strings that both start with '1' AND end with '00') using the Subtraction Rule.

- **Symmetry & Redundancy (Division Rule):** Useful for circular permutations or problems where order initially matters but is ultimately irrelevant to the final state (e.g., seating arrangements around a circular table where shifted positions are considered identical).
