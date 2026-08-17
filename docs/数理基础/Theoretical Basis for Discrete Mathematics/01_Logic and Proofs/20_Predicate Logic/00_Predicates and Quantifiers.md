# 00_Predicates and Quantifiers

## 1. The Limitations of Propositional Logic

Propositional logic is fundamentally limited because it cannot adequately express general rules or properties of objects.

- **Example of Limitation:** Suppose we have the statements "Every computer connected to the university network is functioning properly" and "Math 3 is a computer connected to the university network".

- Propositional logic cannot combine these to deduce that "Math 3 is functioning properly".

- To solve this, we need a more powerful framework called **Predicate Logic**, which introduces variables, predicates, and quantifiers.

---

## 2. Predicates and Variables

Predicate logic separates statements into two parts: the subject (variable) and the property it possesses (predicate).

- **Variables:** Usually denoted by lowercase letters like $x, y, z$.

- **Predicates (Properties):** Usually denoted by uppercase letters like $P, Q, M$.

- **Propositional Function ($P(x)$):** The statement $P(x)$ is read as "the value of the propositional function $P$ at $x$".

- A propositional function $P(x)$ is _not_ a proposition on its own; it only becomes a true or false proposition when $x$ is assigned a specific value.

    - _Example:_ Let $P(x)$ denote "$x > 3$". If we assign $x = 4$, $P(4)$ is True. If we assign $x = 2$, $P(2)$ is False.

- **N-ary Functions:** Propositional functions can take multiple variables, denoted as $P(x_1, x_2, \dots, x_n)$.

    - _Example:_ Let $R(x, y, z)$ denote "$x + y = z$". $R(1, 2, 3)$ evaluates to True, while $R(0, 0, 1)$ evaluates to False.

---

## 3. The Universe of Discourse (Domain)

To use quantifiers (words like "all" or "some"), we must define the scope of the variables.

- This scope is called the **Universe of Discourse** or the **Domain**, usually denoted by $U$.

- The domain specifies exactly what values the variable $x$ is allowed to take.

- _Examples of Domains:_ The set of all real numbers, the set of integers, or the set of all students in a specific class.

---

## 4. Quantifiers

Quantifiers are used to express the extent to which a predicate is true over a given domain.

### The Universal Quantifier ($\forall$)

- **Definition:** $\forall x P(x)$ asserts that $P(x)$ is true for _every_ value of $x$ in the domain $U$.

- **Interpretation:** It can be thought of as a massive conjunction (AND) over all elements in the domain. If $U = \{x_1, x_2, \dots, x_n\}$, then $\forall x P(x) \equiv P(x_1) \wedge P(x_2) \wedge \dots \wedge P(x_n)$.

- **Truth Condition:** $\forall x P(x)$ is True only if $P(x)$ is true for every single $x$. It is False if there is _at least one_ $x$ for which $P(x)$ is false (a **counterexample**).

    - _Example:_ Let $P(x)$ be "$x^2 > 0$" and $U$ be all integers. $\forall x P(x)$ is False because $x=0$ is a counterexample ($0^2 > 0$ is false).

### The Existential Quantifier ($\exists$)

- **Definition:** $\exists x P(x)$ asserts that there exists _at least one_ element $x$ in the domain $U$ such that $P(x)$ is true.

- **Interpretation:** It can be thought of as a massive disjunction (OR) over all elements in the domain. If $U = \{x_1, x_2, \dots, x_n\}$, then $\exists x P(x) \equiv P(x_1) \vee P(x_2) \vee \dots \vee P(x_n)$.

- **Truth Condition:** $\exists x P(x)$ is True if there is an $x$ for which $P(x)$ is true. It is False only if $P(x)$ is false for _every_ $x$ in the domain.

    - _Example:_ Let $P(x)$ be "$x^2 > 0$" and $U$ be all integers. $\exists x P(x)$ is True (e.g., $x=1$ makes it true).

### The Uniqueness Quantifier ($\exists!$)

- **Definition:** $\exists! x P(x)$ or $\exists_1 x P(x)$ asserts that there exists a _unique_ (exactly one) $x$ such that $P(x)$ is true.

- _Example:_ Let the domain be integers. $\exists! x (x - 1 = 0)$ is True, because $x=1$ is the only integer that satisfies the equation.

- Note: This is not universally adopted and can always be expressed using the standard $\forall$ and $\exists$ quantifiers.

---

## 5. Precedence of Quantifiers

- The quantifiers $\forall$ and $\exists$ have a **higher precedence** than all standard logical operators ($\wedge, \vee, \rightarrow, \leftrightarrow$).

- _Example:_ The expression $\forall x P(x) \vee Q(x)$ is evaluated as $(\forall x P(x)) \vee Q(x)$. It is _not_ the same as $\forall x (P(x) \vee Q(x))$.

---

## 6. Free and Bound Variables

When working with propositional functions, it is crucial to understand the status of the variables involved.

- **Bound Variable:** A variable is considered **bound** if it is either attached to a quantifier ($\forall$ or $\exists$) or if it is assigned a specific, concrete value.

- **Free Variable:** A variable that is not bound by a quantifier or a specific value is called **free**.

- **Scope:** The part of a logical expression to which a quantifier is applied is called its scope. A variable is bound by a quantifier only if it falls within that quantifier's scope.

**Example Analysis:**

Consider the expression: $\exists x (x + y = 1)$

- The variable $x$ is **bound** because it is within the scope of the existential quantifier $\exists x$.

- The variable $y$ is **free** because there is no quantifier binding it, nor is it assigned a value.

- _Note:_ A statement with free variables is still a propositional function, not a logical proposition, because its truth value cannot yet be determined until the free variables are bound.

---

## 7. Translating from English to Logic

Translating sentences into predicate logic heavily depends on how you define the domain $U$.

**Sentence:** "Every student in this class has taken a course in Java."

- **Approach 1 (Narrow Domain):** Let $U$ be "students in this class". Let $J(x)$ be "$x$ has taken a course in Java".

    - Translation: $\forall x J(x)$

- **Approach 2 (Broad Domain):** Let $U$ be "all people". Let $S(x)$ be "$x$ is a student in this class" and $J(x)$ be "$x$ has taken Java".

    - Translation: $\forall x (S(x) \rightarrow J(x))$

    - _(Crucial Note: Using $\wedge$ here would be incorrect. $\forall x (S(x) \wedge J(x))$ would mean "Every person in the world is a student in this class AND has taken Java", which is false)_.

**Sentence:** "Some student in this class has taken a course in Java."

- **Approach 1 (Narrow Domain):** Let $U$ be "students in this class".

    - Translation: $\exists x J(x)$

- **Approach 2 (Broad Domain):** Let $U$ be "all people".

    - Translation: $\exists x (S(x) \wedge J(x))$

    - _(Crucial Note: Using $\rightarrow$ here would be incorrect. $\exists x (S(x) \rightarrow J(x))$ is true as long as there is anyone in the world who is NOT a student in this class, because a false hypothesis makes an implication true)_.

---

## 8. Logical Equivalences Involving Quantifiers

Just as we have logical equivalences in propositional logic, we have rules for expressions involving quantifiers.

- **Definition of Equivalence:** Statements involving predicates and quantifiers are logically equivalent (denoted by $S \equiv T$) if and only if they have the same truth value _no matter which domain is used_ and _no matter which specific predicates are substituted_ into the statements.

### De Morgan’s Laws for Quantifiers

When we negate a quantified statement, the quantifier "flips" (from universal to existential, or vice versa), and the negation sign moves inside to apply to the predicate itself.

|**Negated Statement**|**Equivalent Statement**|**When is it True?**|**When is it False?**|
|---|---|---|---|
|$\neg \exists x P(x)$|$\forall x \neg P(x)$|For every $x$, $P(x)$ is false.|There is an $x$ for which $P(x)$ is true.|
|$\neg \forall x P(x)$|$\exists x \neg P(x)$|There is an $x$ for which $P(x)$ is false.|$P(x)$ is true for every $x$.|

---

## 9. Predicate Calculus Definitions

In predicate logic, assertions are categorized based on their truth values across different domains and interpretations.

### Truth Classifications

- **Valid:** An assertion is valid if it is true for **all** domains and **every** possible propositional function substituted for the predicates.

    - _Example:_ $\forall x \neg S(x) \leftrightarrow \neg \exists x S(x)$

- **Satisfiable:** An assertion is satisfiable if there exists **at least one** domain and **some** propositional functions that make it true.

    - _Example:_ $\forall x (F(x) \leftrightarrow T(x))$ (Satisfiable but not valid).

- **Unsatisfiable:** An assertion that is false under all interpretations and domains.

    - _Example:_ $\forall x (F(x) \wedge \neg F(x))$

### Scope of Quantifiers

- **Wide Scope:** The quantifier applies to the entire expression.

    - _Example:_ $\forall x (F(x) \vee S(x))$

- **Narrow Scope:** The quantifier applies only to a specific sub-expression.

    - _Example:_ $\forall x (F(x)) \vee \forall y (S(y))$

---

## 10. Logic Programming (Prolog)`(*)`

**Prolog** (_Programming in Logic_) is a language developed in the 1970s for AI. It relies on a database of facts and rules.

### Components of a Prolog Program

1. **Facts:** Stated truths about the world.

    - `instructor(chan, math273).` (Professor Chan is the instructor of Math 273).

    - `enrolled(kevin, math273).` (Kevin is enrolled in Math 273).

2. **Rules:** Logical implications used to derive new information.

    - **Syntax:** `teaches(P, S) :- instructor(P, C), enrolled(S, C).`

    - **Logic Equivalent:** $\forall p \forall c \forall s (I(p, c) \wedge E(s, c) \rightarrow T(p, s))$

    - _Note:_ In Prolog, names starting with **uppercase letters** are variables.

### Queries and Interpreter Interaction

A Prolog interpreter receives **queries** (prefixed by `?`) and returns answers based on the loaded facts and rules.

| **Query Example**            | **Purpose**                              | **Interpreter Response**      |
| ---------------------------- | ---------------------------------------- | ----------------------------- |
| `?enrolled(kevin, math273).` | Simple verification.                     | `yes`                         |
| `?enrolled(X, math273).`     | Find all $X$ that satisfy the condition. | `X = kevin; X = kiko; no`     |
| `?teaches(X, juana).`        | Find all instructors for student Juana.  | `X = patel; X = grossman; no` |

> **Pro Tip:** When the interpreter finds a result, typing a semicolon (`;`) asks Prolog to search for the next possible instantiation. If no further answers exist, it returns `no`.
