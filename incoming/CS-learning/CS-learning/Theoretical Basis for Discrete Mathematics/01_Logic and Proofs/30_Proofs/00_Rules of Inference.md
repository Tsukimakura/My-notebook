## 1. Introduction to Valid Arguments

An **argument** in propositional or predicate logic is a sequence of statements that end with a conclusion. All statements preceding the conclusion are called **premises**.

- **Validity:** An argument is valid if the conclusion must follow logically from the truth of the premises. In mathematical terms, proofs are valid arguments.
    
- **Tautological Foundation:** An argument form with premises $p_1, p_2, \dots, p_n$ and conclusion $q$ is valid if and only if the implication $(p_1 \wedge p_2 \wedge \dots \wedge p_n) \rightarrow q$ is a tautology.
    

Constructing valid arguments generally occurs in two stages:

1. Using rules for Propositional Logic.
    
2. Using rules for Predicate Logic (handling variables and quantifiers).
    

---

## 2. Rules of Inference for Propositional Logic

Inference rules are simple, standard argument forms used as building blocks to construct more complex valid arguments.

| **Rule Name**                                | **Premises**                                         | **Conclusion**               | **Corresponding Tautology**                                                  |
| -------------------------------------------- | ---------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| **Modus Ponens** <br> <br>**假言推理**           | $p \rightarrow q$<br><br>  <br><br>$p$               | $\therefore q$               | $(p \wedge (p \rightarrow q)) \rightarrow q$                                 |
| **Modus Tollens** <br> <br>**取拒式**           | $p \rightarrow q$<br><br>  <br><br>$\neg q$          | $\therefore \neg p$          | $(\neg q \wedge (p \rightarrow q)) \rightarrow \neg p$                       |
| **Hypothetical Syllogism**<br> <br>**假言三段论** | $p \rightarrow q$<br><br>  <br><br>$q \rightarrow r$ | $\therefore p \rightarrow r$ | $((p \rightarrow q) \wedge (q \rightarrow r)) \rightarrow (p \rightarrow r)$ |
| **Disjunctive Syllogism**<br> <br>**析取三段论**  | $p \vee q$<br><br>  <br><br>$\neg p$                 | $\therefore q$               | $(\neg p \wedge (p \vee q)) \rightarrow q$                                   |
| **Addition**                                 | $p$                                                  | $\therefore p \vee q$        | $p \rightarrow (p \vee q)$                                                   |
| **Simplification**                           | $p \wedge q$                                         | $\therefore q$ _(or $p$)_    | $(p \wedge q) \rightarrow p$                                                 |
| **Conjunction**                              | $p$<br><br>  <br><br>$q$                             | $\therefore p \wedge q$      | $((p) \wedge (q)) \rightarrow (p \wedge q)$                                  |
| **Resolution**                               | $\neg p \vee r$<br><br>  <br><br>$p \vee q$          | $\therefore q \vee r$        | $((\neg p \vee r) \wedge (p \vee q)) \rightarrow (q \vee r)$                 |

> **Note:** Resolution plays an important role in Artificial Intelligence and is a foundational concept in the logic programming language Prolog.

---

## 3. Constructing Valid Arguments (Propositional Logic)

A formal valid argument takes the form of a sequence where each statement is either a given premise or follows from previous statements via a specific rule of inference.

**Example: Formal Proof**

Given the hypotheses $\neg p \wedge q$, $r \rightarrow p$, $\neg r \rightarrow s$, and $s \rightarrow t$, prove the conclusion $t$.

|**Step**|**Statement**|**Reason**|
|---|---|---|
|1.|$\neg p \wedge q$|Premise|
|2.|$\neg p$|Simplification using (1)|
|3.|$r \rightarrow p$|Premise|
|4.|$\neg r$|Modus Tollens using (2) and (3)|
|5.|$\neg r \rightarrow s$|Premise|
|6.|$s$|Modus Ponens using (4) and (5)|
|7.|$s \rightarrow t$|Premise|
|8.|$t$|Modus Ponens using (6) and (7)|

---

## 4. Rules of Inference for Quantified Statements

To handle predicate logic, we must introduce rules that allow us to instantiate (remove quantifiers) and generalize (add quantifiers) variables.

| **Rule Name**                       | **Premise**                 | **Conclusion**                         | **Usage Description**                                                     |
| ----------------------------------- | --------------------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| **Universal Instantiation (UI)**    | $\forall x P(x)$            | $\therefore P(c)$                      | If it is true for all $x$, it is true for a specific element $c$.         |
| **Universal Generalization (UG)**   | $P(c)$ for an arbitrary $c$ | $\therefore \forall x P(x)$            | If it is true for an arbitrary element, it must be true for all.          |
| **Existential Instantiation (EI)**  | $\exists x P(x)$            | $\therefore P(c)$ for some element $c$ | If one exists, we can name it $c$ (must be a specific, existing element). |
| **Existential Generalization (EG)** | $P(c)$ for some element $c$ | $\therefore \exists x P(x)$            | If it is true for a specific element, then at least one exists.           |

---

## 5. Building Arguments with Quantifiers

**Example 1: The Classic Socrates Argument**

- **Premises:** $\forall x(Man(x) \rightarrow Mortal(x))$, $Man(Socrates)$
    
- **Conclusion:** $\therefore Mortal(Socrates)$
    

| **Step** | **Statement**                                | **Reason**                       |
| -------- | -------------------------------------------- | -------------------------------- |
| 1.       | $\forall x(Man(x) \rightarrow Mortal(x))$    | Premise                          |
| 2.       | $Man(Socrates) \rightarrow Mortal(Socrates)$ | Universal Instantiation from (1) |
| 3.       | $Man(Socrates)$                              | Premise                          |
| 4.       | $Mortal(Socrates)$                           | Modus Ponens from (2) and (3)    |

**Example 2: A Complex Predicate Proof**

- **Premises:** "A student in this class has not read the book." $\exists x(C(x) \wedge \neg B(x))$
    
- "Everyone in this class passed the first exam." $\forall x(C(x) \rightarrow P(x))$
    
- **Conclusion:** "Someone who passed the first exam has not read the book." $\therefore \exists x(P(x) \wedge \neg B(x))$
    

|**Step**|**Statement**|**Reason**|
|---|---|---|
|1.|$\exists x(C(x) \wedge \neg B(x))$|Premise|
|2.|$C(a) \wedge \neg B(a)$|Existential Instantiation from (1)|
|3.|$C(a)$|Simplification from (2)|
|4.|$\forall x(C(x) \rightarrow P(x))$|Premise|
|5.|$C(a) \rightarrow P(a)$|Universal Instantiation from (4)|
|6.|$P(a)$|Modus Ponens from (3) and (5)|
|7.|$\neg B(a)$|Simplification from (2)|
|8.|$P(a) \wedge \neg B(a)$|Conjunction from (6) and (7)|
|9.|$\exists x(P(x) \wedge \neg B(x))$|Existential Generalization from (8)|

---

## 6. Universal Modus Ponens 全称假言推理

Because Universal Instantiation followed immediately by Modus Ponens is so common (as seen in the Socrates example), they are often combined into a single rule called **Universal Modus Ponens**.

- **Premise 1:** $\forall x(P(x) \rightarrow Q(x))$
    
- **Premise 2:** $P(a)$, where $a$ is a particular element in the domain.
    
- **Conclusion:** $\therefore Q(a)$
    
