# 20_Logical Equivalences

## 1. Classifications of Propositions

Before we can equate different propositions, we must understand how individual compound propositions behave based on their truth values. Propositions fall into three categories:

- **Tautology:** A compound proposition that is _always true_, regardless of the truth values of its individual variables.

    - _Example:_ $p \vee \neg p$ is a tautology.

- **Contradiction:** A compound proposition that is _always false_.

    - _Example:_ $p \wedge \neg p$ is a contradiction.

- **Contingency:** A proposition that is neither a tautology nor a contradiction; its truth value depends on the truth values of its variables.

    - _Example:_ The simple variable $p$ is a contingency.

---

## 2. Logical Equivalence

**Definition:** Two compound propositions $p$ and $q$ are considered **logically equivalent** if the biconditional statement $p \leftrightarrow q$ is a tautology.

- We denote this relationship using the notation $p \equiv q$ (or sometimes $p \Leftrightarrow q$).

- Practically, this means $p$ and $q$ are equivalent if and only if their columns in a truth table yield the exact same truth values.

- _Example:_ The truth table proves that $\neg p \vee q$ is logically equivalent to $p \rightarrow q$.

### Methods for Showing Equivalence

To prove that two propositions are equivalent, you have two primary methods:

1. **Using Truth Tables**

2. **Using Already-Proved Equivalences**

---

## 3. Key Logical Equivalences (The Laws of Logic)

### Basic Equivalences

- **Identity Laws:**

	* $p \wedge T \equiv p$

    - $p \vee F \equiv p$

- **Domination Laws:**

	* $p \vee T \equiv T$

    - $p \wedge F \equiv F$

- **Idempotent Laws:**

	* $p \vee p \equiv p$

    - $p \wedge p \equiv p$

- **Double Negation Law:**

	* $\neg(\neg p) \equiv p$

- **Negation Laws:**

	* $p \vee \neg p \equiv T$

    - $p \wedge \neg p \equiv F$

### Distribution and Grouping

- **Commutative Laws:**

	* $p \vee q \equiv q \vee p$

    - $p \wedge q \equiv q \wedge p$

- **Associative Laws:**

	* $(p \wedge q) \wedge r \equiv p \wedge (q \wedge r)$

    - $(p \vee q) \vee r \equiv p \vee (q \vee r)$

- **Distributive Laws:**

	* $p \vee (q \wedge r) \equiv (p \vee q) \wedge (p \vee r)$

    - $p \wedge (q \vee r) \equiv (p \wedge q) \vee (p \wedge r)$

- **Absorption Laws:**

	* $p \vee (p \wedge q) \equiv p$

    - $p \wedge (p \vee q) \equiv p$

### De Morgan's Laws

These laws define how a negation distributes inside parentheses, flipping the logical operator in the process:

- $\neg(p \wedge q) \equiv \neg p \vee \neg q$

- $\neg(p \vee q) \equiv \neg p \wedge \neg q$

---

## 4. Equivalences Involving Conditionals & Biconditionals

Often, we will need to convert conditional statements into $\vee$ and $\wedge$ operations to simplify them.

### Crucial Translation Laws

- **Implication Law:** $p \rightarrow q \equiv \neg p \vee q$

- **Equivalence Law:** $p \leftrightarrow q \equiv (p \rightarrow q) \wedge (q \rightarrow p)$

### Other Conditional Equivalences

- $p \rightarrow q \equiv \neg q \rightarrow \neg p$ _(Contrapositive)_

- $p \vee q \equiv \neg p \rightarrow q$

- $p \wedge q \equiv \neg(p \rightarrow \neg q)$

- $\neg(p \rightarrow q) \equiv p \wedge \neg q$

- $(p \rightarrow q) \wedge (p \rightarrow r) \equiv p \rightarrow (q \wedge r)$

- $(p \rightarrow r) \wedge (q \rightarrow r) \equiv (p \vee q) \rightarrow r$

- $(p \rightarrow q) \vee (p \rightarrow r) \equiv p \rightarrow (q \vee r)$

- $(p \rightarrow r) \vee (q \rightarrow r) \equiv (p \wedge q) \rightarrow r$

### Other Biconditional Equivalences

- $p \leftrightarrow q \equiv \neg p \leftrightarrow \neg q$

- $p \leftrightarrow q \equiv (p \wedge q) \vee (\neg p \wedge \neg q)$

- $\neg(p \leftrightarrow q) \equiv p \leftrightarrow \neg q$

---

## 5. Constructing New Logical Equivalences

- **Method:** Produce a chain of equivalences beginning with $A$ and ending with $B$:

    $A \equiv A_1$

    $\dots$

    $A_n \equiv B$

- **Substitution Principle:** Whenever a proposition (represented by a variable) occurs in a known equivalence, it can be replaced by an arbitrarily complex compound proposition.

### Equivalence Proof Examples

**Example 1:** Show that $\neg(p \vee (\neg p \wedge q))$ is logically equivalent to $\neg p \wedge \neg q$.

**Proof:**

$$
\begin{align*} \neg(p \vee (\neg p \wedge q)) &\equiv \neg p \wedge \neg(\neg p \wedge q) && \text{by the second De Morgan law} \\ &\equiv \neg p \wedge [\neg(\neg p) \vee \neg q] && \text{by the first De Morgan law} \\ &\equiv \neg p \wedge (p \vee \neg q) && \text{by the double negation law} \\ &\equiv (\neg p \wedge p) \vee (\neg p \wedge \neg q) && \text{by the second distributive law} \\ &\equiv F \vee (\neg p \wedge \neg q) && \text{because } \neg p \wedge p \equiv F \\ &\equiv (\neg p \wedge \neg q) \vee F && \text{by the commutative law for disjunction} \\ &\equiv \neg p \wedge \neg q && \text{by the identity law for F} \end{align*}
$$

**Example 2:** Show that $(p \wedge q) \rightarrow (p \vee q)$ is a tautology.

**Proof:**

$$
\begin{align*} (p \wedge q) \rightarrow (p \vee q) &\equiv \neg(p \wedge q) \vee (p \vee q) && \text{by truth table equivalence for } \rightarrow \\ &\equiv (\neg p \vee \neg q) \vee (p \vee q) && \text{by the first De Morgan law} \\ &\equiv (\neg p \vee p) \vee (\neg q \vee q) && \text{by associative and commutative laws} \\ &\equiv T \vee T && \text{by truth tables (negation law)} \\ &\equiv T && \text{by the domination law} \end{align*}
$$

_(Note: To prove two propositions are **not** logically equivalent, we only need to find **one** assignment of truth values for which the two propositions yield different results.)_

---

## 6. The Dual of a Proposition (对偶式)

The **dual** of a compound proposition containing _only_ the logical operators $\vee$, $\wedge$, and $\neg$ is formed by making specific replacements. Let the dual of $S$ be denoted by $S^*$.

- Replace each $\vee$ with $\wedge$

- Replace each $\wedge$ with $\vee$

- Replace each $T$ with $F$

- Replace each $F$ with $T$

**Example:**

If $S = (p \vee \neg q) \wedge r \vee T$, then its dual is $S^* = (p \wedge \neg q) \vee r \wedge F$.

**Theorem:** Let $s$ and $t$ be two compound propositions. Then $s \leftrightarrow t$ if and only if $s^* \leftrightarrow t^*$.

---

## 7. New Logical Operators & Functional Completeness

### New Operators

1. **Peirce Arrow (NOR, denoted by $\downarrow$):** The proposition $p \downarrow q$ is true _only_ when both $p$ and $q$ are false. It is logically equivalent to $\neg(p \vee q)$.

2. **Sheffer Stroke (NAND, denoted by $|$):** The proposition $p | q$ is true when either $p$ or $q$, or both, are false. It is false _only_ when both $p$ and $q$ are true. It is logically equivalent to $\neg(p \wedge q)$.

### Functionally Complete Operators

A set of logical operators is **functionally complete** if _every possible_ compound proposition can be rewritten as a logically equivalent proposition using _only_ the operators in that set.

- **Examples of functionally complete sets:**

    - $\{\neg, \vee\}$

    - $\{\neg, \wedge\}$

    - $\{|\}$ (NAND alone is sufficient to build any logic gate!)

    - $\{\downarrow\}$ (NOR alone is also functionally complete)

---

## 8. Propositional Satisfiability

- **Satisfiable:** A compound proposition is satisfiable if there exists at least one assignment of truth values to its variables that makes the entire proposition true.

- **Unsatisfiable:** If no such assignment exists, it is unsatisfiable. A proposition is unsatisfiable if and only if it is a **contradiction** (or its negation is a tautology).

---

## 9. Application: Encoding Sudoku as a Satisfiability Problem

Propositional logic can formally encode complex constraints, such as the rules of a Sudoku puzzle.

**Notation Setup:**

Let $p(i, j, n)$ denote the proposition that is True when the number $n$ is in the cell located at row $i$ and column $j$.

- Since $i, j,$ and $n$ all range from 1 to 9, there are $9 \times 9 \times 9 = 729$ such variables.

**The Constraints (Encoding the Rules):**

1. **Given Values:** For each cell already filled with a value, assert $p(i, j, n) \equiv T$.

2. **Row Constraint:** Every row must contain every number from 1 to 9.

        $$
    \bigwedge_{i=1}^9 \bigwedge_{n=1}^9 \bigvee_{j=1}^9 p(i, j, n)
        $$

3. **Column Constraint:** Every column must contain every number from 1 to 9.

        $$
    \bigwedge_{j=1}^9 \bigwedge_{n=1}^9 \bigvee_{i=1}^9 p(i, j, n)
        $$

4. **Block Constraint:** Each of the nine 3x3 blocks must contain every number from 1 to 9.

        $$
    \bigwedge_{r=0}^2 \bigwedge_{s=0}^2 \bigwedge_{n=1}^9 \bigvee_{i=1}^3 \bigvee_{j=1}^3 p(3r+i, 3s+j, n)
        $$

5. **Uniqueness Constraint:** No single cell can contain more than one number.

    $$
p(i, j, n) \rightarrow \neg p(i, j, n') \text{ for } n \neq n'
    $$

**Solving the Problem:**

To solve the Sudoku puzzle, a computer must find an assignment of truth values to all 729 variables that makes the massive conjunction of all these assertions True. While a truth table for this would have $2^{729}$ rows (impossible for modern computers), modern SAT solver algorithms can solve these satisfiability problems efficiently.
