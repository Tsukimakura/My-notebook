# 20_Proof Methods and Strategy

## 1. Proof by Cases

Used when a theorem cannot be proven in a single step, requiring the problem to be broken down into an exhaustive list of scenarios.

- **Logic:** To prove $(p_1 \vee p_2 \vee \dots \vee p_n) \rightarrow q$, we must prove $p_i \rightarrow q$ for **every** case $i$.

---

## 2. Without Loss of Generality (WLOG)

A time-saving convention used within Proof by Cases.

- **Definition:** When two or more cases are logically symmetrical (identical except for swapped variable names), we prove just one case and state "Without loss of generality" to indicate the others follow the exact same logic.

---

## 3. Existence Proofs ($\exists x P(x)$)

Proving that at least one element $x$ exists such that $P(x)$ is true.

- **Constructive:** Explicitly finding a specific value $c$ that makes $P(c)$ true.

- **Nonconstructive:** Proving logically that an element _must_ exist, without explicitly finding its exact value.

---

## 4. Disproof by Counterexample

Used to disprove a universally quantified assertion $\forall x P(x)$.

- **Logic:** $\neg \forall x P(x) \equiv \exists x \neg P(x)$.

---

## 5. Uniqueness Proofs ($\exists! x P(x)$)

Proving that exactly **one** element has a specific property. This strictly requires two steps:

1. **Existence:** Show that an element $x$ with the property exists.

2. **Uniqueness:** Show that if any element $y$ also has the property, then $y = x$.

---

## 6. Proof Strategies for Proving $p \rightarrow q$

**Step 1: Choose a Method**

1. First, attempt a **direct proof**.

2. If a direct approach hits a dead end, try an **indirect method**, such as proving the contrapositive ($\neg q \rightarrow \neg p$).

**Step 2: Choose a Reasoning Strategy**

- **Forward Reasoning:** Start with axioms, known theorems, and the premise ($p$ or $\neg q$). Construct a logical sequence of steps that naturally leads to the conclusion ($q$ or $\neg p$).

- **Backward Reasoning:** If forward reasoning stalls, try working backward. Start with the target conclusion ($q$) and Find a $p$ such that $p \rightarrow q$.

### Example of Backward Reasoning

**The Game:** Two players take turns removing 1, 2, or 3 stones from a pile of 15. The person who removes the last stone wins. Show that Player 1 can always guarantee a win.

**Backward Proof Construction:** Let $n$ be the last step.

- **Step $n$:** Player 1 wins if they are left with a pile of 1, 2, or 3 stones.

- **Step $n-1$:** To guarantee this, Player 2 must be forced to leave 1, 2, or 3 stones. This happens only if Player 2 is faced with exactly 4 stones (no matter if they take 1, 2, or 3, they leave 1, 2, or 3).

- **Step $n-2$:** Player 1 can leave 4 stones if they are faced with 5, 6, or 7 stones.

- **Step $n-3$:** Player 2 is forced to leave 5, 6, or 7 stones if they are faced with exactly 8 stones.

- **Step $n-4$:** Player 1 can leave 8 stones if faced with 9, 10, or 11 stones.

- **Step $n-5$:** Player 2 is forced to leave 9, 10, or 11 stones if faced with exactly 12 stones.

- **Step $n-6$ (The First Move):** Player 1 is faced with 15 stones. To leave 12 stones, Player 1 simply removes 3 stones.

_Conclusion using Forward Reasoning:_ By removing 3 stones on the first turn and leaving 12, Player 1 can control the game state at every multiple of 4, guaranteeing a win.

---

## 7. Universally Quantified Assertions and Biconditionals

To prove theorems of the form $\forall x P(x)$, the standard approach is to assume $x$ is an arbitrary member of the domain and show that $P(x)$ must be true. Because $x$ was arbitrary, the **Universal Generalization (UG)** rule allows us to conclude that $\forall x P(x)$ is true.

### Proving a Biconditional (If and Only If)

Prove: $\forall x (x \text{ is even} \leftrightarrow x^2 \text{ is even})$

Recall the equivalence: $p \leftrightarrow q \equiv (p \rightarrow q) \wedge (q \rightarrow p)$.

**Case 1: Necessity (The "Only If" part, $p \rightarrow q$)**

- _Goal:_ Show that if $x$ is even, then $x^2$ is even using a direct proof.

- _Proof:_ ...

**Case 2: Sufficiency (The "If" part, $q \rightarrow p$)**

- _Goal:_ Show that if $x^2$ is even, then $x$ must be even. We use a proof by contraposition.

- _Proof:_ ... (Assume $x$ is _not_ even (i.e., $x$ is odd), and show that $x^2$ is not even.)

_Conclusion:_ Since $x$ was arbitrary, the result follows by UG.

---

## 8. Proof and Disproof: Existence Proofs

Sometimes, a proof simply requires demonstrating that something is possible or impossible.

---

## 9. The Role of Open Problems

Unsolved (open) problems are the engine of mathematical progress, motivating centuries of new work.

---

## 10. Additional Proof Methods

- **Mathematical Induction (数学归纳法):** Essential for proving statements of the form $\forall n P(n)$ where the domain is all positive integers.

- **Structural Induction (结构归纳法):** Used to prove properties about recursively defined sets and structures (like trees in computer science).

- **Cantor Diagonalization (康托尔对角线方法):** A brilliant technique used to prove results about the relative sizes of infinite sets (e.g., proving there are more real numbers than integers).

- **Combinatorial Proofs (组合证明):** Utilizing counting arguments to prove that two algebraic expressions must be equal.
