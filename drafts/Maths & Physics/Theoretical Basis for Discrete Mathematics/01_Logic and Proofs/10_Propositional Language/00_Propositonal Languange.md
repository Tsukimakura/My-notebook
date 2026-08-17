# 00_Propositonal Languange

## 1. Introduction to Propositions

A **proposition** is a declarative sentence that is either **true** or **false**, but not both.

**Constructing Propositions:**

- **Propositional Variables:** Represented by letters such as $p, q, r, s, \dots$

- **Truth Values:** A proposition that is always true is denoted by $\mathbf{T}$, and one that is always false is denoted by $\mathbf{F}$.

- **Compound Propositions:** Formed by combining existing propositions using logical connectives.

---

## 2. Logical Connectives

### Negation ($\neg p$)

|**p**|**¬p**|
|---|---|
|T|F|
|F|T|

### Conjunction ($p \wedge q$)

The conjunction of $p$ and $q$ translates to "$p$ AND $q$". It is true _only_ when both $p$ and $q$ are true.

|**p**|**q**|**p∧q**|
|---|---|---|
|T|T|T|
|T|F|F|
|F|T|F|
|F|F|F|

### Disjunction: Inclusive OR vs. Exclusive OR

In English, the word "or" has two distinct meanings:

**1. Inclusive Or ($p \vee q$)**

Translates to "$p$ OR $q$ (or both)". It is true if at least one of the propositions is true.

**2. Exclusive Or ($p \oplus q$)**

Translates to "$p$ XOR $q$". It is true if _exactly one_ of the propositions is true, but not both.

|**p**|**q**|**p∨q (Inclusive)**|**p⊕q (Exclusive)**|
|---|---|---|---|
|T|T|T|F|
|T|F|T|T|
|F|T|T|T|
|F|F|F|F|

---

## 3. Implications (Conditional Statements)

An implication $p \rightarrow q$ translates to "If $p$, then $q$".

- **$p$** is called the **hypothesis** (antecedent or premise).

- **$q$** is called the **conclusion** (consequence).

|**p**|**q**|**p→q**|
|---|---|---|
|T|T|T|
|T|F|F|
|F|T|T|
|F|F|T|

**Key Characteristics of Implication:**

- An implication is only false when the hypothesis is true, but the conclusion is false ($T \rightarrow F$ is $F$).

- In logic, there does _not_ need to be a real-world causal connection between $p$ and $q$.

**Different Ways of Expressing $p \rightarrow q$ in English:**

- if $p$, then $q$

- if $p$, $q$

- $q$ unless $\neg p$

- $q$ if $p$

- $q$ whenever $p$

- $q$ follows from $p$

- $p$ implies $q$

- $p$ only if $q$

- $q$ when $p$

- $p$ is sufficient for $q$

- $q$ is necessary for $p$

- a necessary condition for $p$ is $q$

- a sufficient condition for $q$ is $p$

### Related Conditionals: Converse, Inverse, and Contrapositive

From an original conditional statement $p \rightarrow q$, we can form three new statements:

1. **Converse:** $q \rightarrow p$

2. **Contrapositive:** $\neg q \rightarrow \neg p$

3. **Inverse:** $\neg p \rightarrow \neg q$

_Note: A conditional statement is always **logically equivalent** to its contrapositive. It is NOT equivalent to its converse or inverse._

---

## 4. Biconditional Statements

A biconditional $p \leftrightarrow q$ translates to "$p$ if and only if $q$". It is true when $p$ and $q$ have the _same_ truth values.

|**p**|**q**|**p↔q**|
|---|---|---|
|T|T|T|
|T|F|F|
|F|T|F|
|F|F|T|

**Expressing the Biconditional in English:**

- $p$ is necessary and sufficient for $q$

- if $p$ then $q$, and conversely

- $p$ iff $q$

---

## 5. Truth Tables and Equivalences

**Constructing a Truth Table:**

- **Rows:** You need $2^n$ rows for $n$ atomic propositional variables. (Note: With $n$ variables, you can construct $2^{2^n}$ distinct, non-equivalent compound propositions).

- **Columns:** You need a column for every atomic proposition, every intermediate compound expression, and the final compound proposition.

**Equivalent Propositions:**

Two propositions are considered **equivalent** if they always have the identical truth value for every possible combination of inputs in a truth table.

- _Example:_ Creating a truth table will prove that $p \rightarrow q$ is equivalent to $\neg q \rightarrow \neg p$, but NOT equivalent to $q \rightarrow p$.

---

## 6. Precedence of Logical Operators

When parentheses are not explicitly used, logical operators are evaluated in the following order of precedence:

|**Operator**|**Precedence**|
|---|---|
|$\neg$ (NOT)|1 (Highest)|
|$\wedge$ (AND)|2|
|$\vee$ (OR)|3|
|$\rightarrow$ (Implication)|4|
|$\leftrightarrow$ (Biconditional)|5 (Lowest)|

_Example:_ $p \vee q \rightarrow \neg r$ is interpreted as $(p \vee q) \rightarrow (\neg r)$.

---

## 7. Logic and Bit Operations

In computer science, logical values are represented by bits (binary digits).

- **True** = $1$

- **False** = $0$

- A variable with two possible values ($0$ or $1$) is called a **Boolean variable**.

**Bitwise Operations(omit)**
