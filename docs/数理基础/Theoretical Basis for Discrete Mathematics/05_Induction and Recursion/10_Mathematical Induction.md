# 10_Mathematical Induction

## 1. Core Concepts and Intuition

Mathematical induction is a fundamental proof technique used to prove that a propositional function $P(n)$ is true for all positive integers $n$ (or all integers $n \geq b$).

- **The Infinite Ladder Metaphor:** If you can reach the first rung, and reaching any given rung guarantees you can reach the next, you can climb the entire ladder.

- **The Domino Metaphor:** If an infinite sequence of dominoes is set up, knocking down the first domino ensures all subsequent dominoes will eventually fall.

## 2. The Principle of Mathematical Induction

A proof by mathematical induction consists of two required steps:

1. **Basis Step:** Show that $P(1)$ is true. (Or $P(b)$ if the domain starts at integer $b$).

2. **Inductive Step:** Show that the conditional statement $P(k) \rightarrow P(k + 1)$ is true for all relevant integers $k$.

**Rule of Inference Formulation:**

$$
(P(1) \wedge \forall k (P(k) \rightarrow P(k + 1))) \rightarrow \forall n P(n)
$$

_Note: In the inductive step, we do not assume $P(k)$ is true for all positive integers. We only assume $P(k)$ is true for an arbitrary integer $k$ to show that $P(k+1)$ logically follows._

## 3. Validity of Mathematical Induction

The validity of mathematical induction relies on the **Well-Ordering Property**, which states that every nonempty subset of the set of positive integers has a least element.

- **Proof of Validity:**

	1. Suppose $P(1)$ holds and $P(k) \rightarrow P(k + 1)$ holds.

    2. Assume (for contradiction) the set $S$ of positive integers where $P(n)$ is _false_ is nonempty.

    3. By the well-ordering property, $S$ has a least element, say $m$.

    4. $m \neq 1$ because we know $P(1)$ is true.

    5. Since $m > 1$, $m - 1$ is a positive integer. Because $m$ is the _least_ element in $S$, $m - 1 \notin S$. Thus, $P(m - 1)$ must be true.

    6. By our inductive assumption, $P(m - 1) \rightarrow P(m)$ holds. Therefore, $P(m)$ must be true.

    7. This contradicts the assumption that $m \in S$ (where $P(n)$ is false). Hence, $P(n)$ must be true for all positive integers.

## 4. Guidelines for Mathematical Induction Proofs

When writing formal proofs by induction, follow this template:

1. **Define:** Express the statement as "for all $n \geq b, P(n)$".

2. **Basis Step:** Write "Basis Step." Show that $P(b)$ is true using the exact value of $b$.

3. **Inductive Step:** Write "Inductive Step."

4. **Inductive Hypothesis:** State clearly: "Assume that $P(k)$ is true for an arbitrary fixed integer $k \geq b$."

5. **Goal:** State what needs to be proved: "We must show that $P(k + 1)$ is true." (Write out what $P(k+1)$ actually says).

6. **Proof:** Prove $P(k + 1)$ using the assumption $P(k)$. Ensure the logic holds for all $k \geq b$.

7. **Conclusion of Step:** State "This completes the inductive step."

8. **Final Conclusion:** State "By mathematical induction, $P(n)$ is true for all integers $n \geq b$."

## 5. Standard Applications and Examples

### A. Summation Formulas

- **Sum of first $n$ odd integers:** Show $1 + 3 + 5 + ... + (2n - 1) = n^2$.

    - _Basis ($n=1$):_ $1 = 1^2$.

    - _Inductive:_ Assume $\sum_{i=1}^k (2i-1) = k^2$. Show for $k+1$.

    - $k^2 + (2(k+1) - 1) = k^2 + 2k + 1 = (k+1)^2$.

- **Sum of first $n$ integers:** Show $\sum_{i=1}^n i = \frac{n(n+1)}{2}$.

    - _Basis ($n=1$):_ $1 = \frac{1(2)}{2}$.

    - _Inductive:_ Assume $\sum_{i=1}^k i = \frac{k(k+1)}{2}$. Add $(k+1)$ to both sides to derive $\frac{(k+1)(k+2)}{2}$.

#### B. Inequalities

- **Show $n < 2^n$:**

    - _Basis ($n=1$):_ $1 < 2^1$.

    - _Inductive:_ Assume $k < 2^k$. Then $k + 1 < 2^k + 1 \leq 2^k + 2^k = 2^{k+1}$.

- **Show $2^n < n!$ (for $n \geq 4$):**

    - _Basis ($n=4$):_ $2^4 = 16 < 4! = 24$.

    - _Inductive:_ Assume $2^k < k!$ for $k \geq 4$. Then $2^{k+1} = 2 \cdot 2^k < 2 \cdot k! < (k+1)k! = (k+1)!$.

#### C. Divisibility

- **Show $n^3 - n$ is divisible by 3:**

    - _Basis ($n=1$):_ $1^3 - 1 = 0$, which is divisible by 3.

    - _Inductive:_ Assume $k^3 - k$ is divisible by 3. Show $(k+1)^3 - (k+1)$ is divisible by 3.

    - Expansion yields: $(k^3 - k) + 3(k^2 + k)$. The first term is divisible by 3 (via Inductive Hypothesis), and the second is a multiple of 3.

#### D. Finite Sets

- **Number of Subsets:** Prove a set $S$ with $n$ elements has $2^n$ subsets.

    - _Basis ($n=0$):_ The empty set has $2^0 = 1$ subset (itself).

    - _Inductive:_ Assume a set with $k$ elements has $2^k$ subsets. A set $T$ with $k+1$ elements can be written as $S \cup \{a\}$. The subsets of $T$ are all subsets of $S$ (which number $2^k$) plus all subsets of $S$ with $a$ added (also numbering $2^k$). Total: $2^k + 2^k = 2^{k+1}$.

#### E. Geometric Tiling

- **Tiling Checkerboards:** Prove a $2^n \times 2^n$ checkerboard with one square removed can be tiled with L-shaped right triominoes.

    - _Basis ($n=1$):_ A $2 \times 2$ board with one square missing is exactly the shape of one triomino.

    - _Inductive:_ Assume true for $2^k \times 2^k$. A $2^{k+1} \times 2^{k+1}$ board can be split into four $2^k \times 2^k$ quadrants. The missing square falls in one quadrant (which can be tiled by IH). Place one triomino at the center intersection to cover one square in each of the remaining three quadrants. Those three quadrants are now $2^k \times 2^k$ boards with one square missing, which can all be tiled by the IH.

## 6. Mistaken Proofs by Mathematical Induction

Errors in induction proofs usually occur when the Inductive Step $P(k) \rightarrow P(k+1)$ fails for a specific small value of $k$.

- **Example of False Proof:** Attempting to prove "every set of $n$ lines in a plane, no two parallel, meet at a common point" ($n \geq 2$).

    - _Flaw:_ The proof assumes that if a subset of $k$ lines meets at $p_1$ and another subset of $k$ lines meets at $p_2$, then $p_1$ and $p_2$ must be the same point because the subsets share lines. However, this logic breaks down for $P(2) \rightarrow P(3)$. Two sets of 2 lines out of a total of 3 distinct lines only share exactly _one_ line, which is insufficient to force their intersection points to be identical.
