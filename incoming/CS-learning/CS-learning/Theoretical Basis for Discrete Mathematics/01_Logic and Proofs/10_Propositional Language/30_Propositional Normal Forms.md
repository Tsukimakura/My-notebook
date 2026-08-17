## 1. Propositional Formulas & Literals

Before transforming propositions into normal forms, we must formally define what constitutes a valid formula and its basic building blocks.

**Recursive Definition of a Propositional Formula:**

1. Each propositional variable is a formula, and the truth values $T$ and $F$ are also formulas.
    
2. If $A$ is a formula, then $(\neg A)$ is also a formula.
    
3. If $A$ and $B$ are formulas, then $(A \vee B)$, $(A \wedge B)$, $(A \rightarrow B)$, and $(A \leftrightarrow B)$ are also formulas.
    
4. A string of symbols is only considered a formula if it can be constructed by finitely many applications of the three rules above.
    
    - _Example of formulas:_ $\neg(p \vee q)$, $p \rightarrow (q \rightarrow r)$, $(p \wedge q) \rightarrow r$.
        
    - _Example of non-formulas:_ $pq \rightarrow r$, $\neg p \rightarrow q) \rightarrow r$ (due to unbalanced parentheses/missing operators).
        

**Literals:**

A **literal** is defined as a propositional variable or its negation.

- _Example:_ $p$ and $\neg p$ are literals, but $p \wedge q$ is not.
    

---

## 2. Standard Normal Forms

Formulas can be transformed into standard forms to make symbolic manipulations, identification, and the comparison of two formulas much easier. There are two primary types of normal forms:

### Disjunctive Normal Form (DNF)

- **Conjunctive Clause (Basic Product):** A conjunction ($\wedge$) of literals. Example: $p \wedge q \wedge \neg r$.
    
- **DNF Definition:** A formula is in Disjunctive Normal Form if it is written strictly as a disjunction ($\vee$) of conjunctive clauses. In other words, it is an "OR of ANDs".
    
    - _General Form:_ $(A_{11} \wedge \dots \wedge A_{1n}) \vee \dots \vee (A_{k1} \wedge \dots \wedge A_{kn_k})$.
        
    - _Example:_ $(p \wedge q) \vee (p \wedge \neg q)$ and $p \vee (q \wedge r)$ are in DNF.
        
    - _Counter-example:_ $\neg(p \wedge q) \vee r$ is _not_ in DNF because the negation is applied to a compound expression, not a single variable.
        

### Conjunctive Normal Form (CNF)

- **Disjunctive Clause (Basic Addition):** A disjunction ($\vee$) of literals. Example: $\neg p \vee q \vee \neg r$.
    
- **CNF Definition:** A formula is in Conjunctive Normal Form if it is written strictly as a conjunction ($\wedge$) of disjunctive clauses. In other words, it is an "AND of ORs".
    
    - _General Form:_ $(A_{11} \vee \dots \vee A_{1m}) \wedge \dots \wedge (A_{k1} \vee \dots \vee A_{kn_k})$.
        
    - _Example:_ $p \wedge (q \vee r)$ and $\neg p \wedge (q \vee \neg r) \wedge (\neg q \vee r)$ are in CNF.
        

_Note: A single variable like $p$, or a simple disjunction like $\neg p \vee q$, can be considered both in DNF and CNF simultaneously_.

---

## 3. How to Obtain Normal Forms (Algebraic Method)

Any compound proposition can be put into an equivalent CNF or DNF through the repeated application of logical equivalences.

**General Steps:**

1. **Eliminate Conditionals:** Remove $\rightarrow, \leftrightarrow, |, \downarrow$ using their equivalent formulas involving $\vee, \wedge, \neg$.
    
2. **Move Negations Inward:** Eliminate $\neg, \vee, \wedge$ from the scope of $\neg$ by applying De Morgan's Laws and the Double Negation Law. The goal is to push all negations inward until they only apply directly to atomic variables (forming literals).
    
3. **Apply Distributive Laws:** Use the distributive laws to flatten the formula into the desired structure (either DNF or CNF).
    

**Conversion Example (to CNF):**

Convert $\neg((p \vee \neg q) \wedge \neg r)$ to CNF.

1. $\neg(p \vee \neg q) \vee \neg(\neg r)$ _(De Morgan's Law)_
    
2. $\neg(p \vee \neg q) \vee r$ _(Double Negation)_
    
3. $(\neg p \wedge q) \vee r$ _(De Morgan & Double Negation)_
    
4. $(\neg p \vee r) \wedge (q \vee r)$ _(Distributivity - Final CNF form)_
    

---

## 4. Minterms and Maxterms

### Minterms

A **minterm** is a conjunction (AND) of literals in which _each variable_ of the function is represented exactly once (either as itself or its negation).

- For $n$ propositional variables, there are $2^n$ different minterms.
    
- **Notation ($m_j$):** We denote minterms as $m_j$, where $j$ is an integer whose binary representation corresponds to the evaluation of variables that makes $m_j$ equal to $T$ (where True=1, False=0).
    
    - _Example for 3 variables ($p, q, r$):_
        
        $m_0 = \neg p \wedge \neg q \wedge \neg r$ (corresponds to 000)
        
        $m_7 = p \wedge q \wedge r$ (corresponds to 111)
        

**Properties of Minterms:**

1. Each minterm evaluates to True for exactly _one_ specific assignment of truth values.
    
2. The conjunction of two different minterms is always false: $m_i \wedge m_k = F$.
    
3. The disjunction of _all_ possible minterms is a tautology: $m_0 \vee m_1 \vee \dots \vee m_{2^n-1} = T$.
	

### Maxterms

A **maxterm**, denoted as $M_i$, is a disjunction (OR) of all variables where each appears exactly once. It is the logical negation of a minterm: $M_i = \neg m_i$.

- $M_0 = p \vee q \vee r$

**Properties of Minterms:**

1. Each maxterm evaluates to False for exactly _one_ specific assignment of truth values.
    
2. The disjunction of two different maxterms is always true: $M_i \vee M_k = T$.
    
3. The conjunction of _all_ possible maxterms is a contradiction: $M_0 \wedge M_1 \wedge \dots \wedge M_{2^n-1} = F$.
	

---

## 5. Full Disjunctive & Conjunctive Forms

### Full Disjunctive Normal Form (Principal DNF)

A Boolean function expressed strictly as a disjunction of minterms is said to be in **Full Disjunctive Form**. If a function is denoted by $f = m_j \vee m_k \vee \dots \vee m_l$, it can be compactly written using summation notation: $f = \sum m(j, k, \dots, l)$.

**How to find the Full DNF:**

1. **From a Truth Table:** Identify all rows where the function evaluates to True ($T$). Construct the minterm for each of those rows, and join them with $\vee$.
    
2. **Algebraically:** Convert the formula to a standard DNF first. If a conjunctive clause is missing a variable (e.g., $p \wedge q$ is missing $r$), AND it with $(r \vee \neg r)$ to expand it into minterms without changing its truth value.
    

### Full Conjunctive Normal Form & Conversions

A formula expressed strictly as a conjunction of Maxterms is in Full CNF. CNF is particularly important in **resolution theorem proving**, a method widely used in AI.

**Direct Conversion between Full DNF and Full CNF:**

We can seamlessly convert between the two using the properties of minterms and maxterms.

Let a function $f$ be defined by its Full DNF: $f = \sum m(j, k, \dots, l)$.

Because the disjunction of all remaining minterms evaluates to the negation of $f$ ($\neg f$), we can state the Full CNF as the product ($\prod$) of the Maxterms for the _missing_ indices.

- **Conversion Formula:** $f = \prod M( \{0, 1, 2, \dots, 2^n - 1\} - \{j, k, \dots, l\} )$.
    
