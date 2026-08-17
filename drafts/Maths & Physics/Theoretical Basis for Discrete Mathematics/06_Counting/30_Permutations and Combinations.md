# 30_Permutations and Combinations

## 1. Permutations (Ordered Arrangements)

**Definition:** A permutation of a set of distinct objects is an ordered arrangement of these objects. An ordered arrangement of $r$ elements of a set is called an **$r$-permutation**.

- **Notation:** $P(n, r)$ denotes the number of $r$-permutations of a set with $n$ elements.

- _Note:_ Order strictly matters (e.g., the arrangement 1,2 is distinct from 2,1).

### Formulas for Permutations

- **Product Rule Derivation:** $P(n, r) = n(n-1)(n-2)\dots(n-r+1)$ for $1 \le r \le n$.

- **Factorial Representation:**

    $$
P(n, r) = \frac{n!}{(n-r)!}
    $$

- **Base Case:** $P(n, 0) = 1$ (There is exactly one way to order zero elements—the empty set).

### Common Problem-Solving Techniques (Permutations)

- **Direct Application:** Selecting ranked positions (e.g., 1st, 2nd, and 3rd prize winners from 100 people) is directly calculated as $P(100, 3)$.

- **Fixed Elements:** If certain elements in an arrangement are fixed (e.g., a traveling salesperson must start at a specific city before visiting 7 others), only the remaining elements are permuted. Calculation: $7! = 5040$.

- **Grouped Strings (The "Block" Trick):** If a specific sequence of items must remain together (e.g., permutations of ABCDEFGH that contain the exact string "ABC"), treat the required sequence as a single unified object.

    - _Calculation:_ The set becomes {ABC, D, E, F, G, H}. This reduces the problem to permuting 6 objects: $6! = 720$.

---

## 2. Combinations (Unordered Selections)

**Definition:** An **$r$-combination** of elements of a set is an unordered selection of $r$ elements from the set. An $r$-combination is essentially a subset of the set containing exactly $r$ elements.

- **Notation:** $C(n, r)$ or $\binom{n}{r}$ (also called a binomial coefficient).

- _Note:_ Order does not matter (e.g., the subset $\{a, c, d\}$ is identical to $\{d, c, a\}$).

### Formulas for Combinations

- **Derivation from Permutations:** Since an $r$-combination can be ordered in $P(r, r)$ ways to form $r$-permutations, by the product rule, $P(n, r) = C(n, r) \cdot P(r, r)$.

- **Factorial Representation:**

    $$
C(n, r) = \frac{n!}{(n-r)!r!}
    $$

### Key Identity: Symmetry of Combinations

**Corollary:** For nonnegative integers $n$ and $r$ with $r \le n$:

$$
C(n, r) = C(n, n-r)
$$

- _Implication:_ Choosing $r$ objects to keep is mathematically equivalent to choosing $n-r$ objects to leave behind. (e.g., $C(52, 5) = C(52, 47) = 2,598,960$).

---

## 3. Combinatorial Proofs

A **combinatorial proof** of an identity is a proof that relies on counting arguments rather than algebraic manipulation. There are two primary methodologies:

1. **Double Counting Proof:** Proves that both sides of an identity count the exact same set of objects, but use different counting logic to arrive at the result.

    - _Example applied to $C(n, r) = C(n, n-r)$:_ By definition, $C(n, r)$ counts the subsets of size $r$. Every time you form a subset $A$ of size $r$, you simultaneously form a unique complement subset $\overline{A}$ containing the remaining $n-r$ elements. Thus, the number of subsets of size $n-r$ must perfectly match the number of subsets of size $r$.

2. **Bijective Proof:** Shows that there is a strict one-to-one correspondence (a bijection) between the sets of objects counted by the left side of the identity and the objects counted by the right side. Since a bijection exists, the two sets must have the same cardinality.

---

## 4. Advanced Compound Problems (Combining Rules)

When problems involve distinct subgroups, combinations must be paired with fundamental counting rules (like the Product and Sum rules).

**Example Scenario:** A soccer club has 8 female and 7 male members.

- **Case A: Specific Subgroup Sizes (Product Rule)**

    - _Goal:_ Select a team of 6 females and 5 males.

    - _Method:_ Select the females, _then_ select the males.

    - _Calculation:_ $C(8, 6) \cdot C(7, 5) = 28 \cdot 21 = 588$.

- **Case B: "At Most" / Variable Constraints (Sum & Product Rules)**

    - _Goal:_ Select an 11-player team with _at most_ 5 male players.

    - _Method:_ Break the problem down into mutually exclusive exact scenarios, calculate combinations for each using the Product Rule, and sum the results.

    - _Subcases for 11 total players:_

        1. 5 Men + 6 Women: $C(7, 5) \cdot C(8, 6)$

        2. 4 Men + 7 Women: $C(7, 4) \cdot C(8, 7)$

        3. 3 Men + 8 Women: $C(7, 3) \cdot C(8, 8)$

            _(Note: 2 Men + 9 Women is impossible, as there are only 8 women available)._

    - _Calculation:_ $C(8, 6)C(7, 5) + C(8, 7)C(7, 4) + C(8, 8)C(7, 3)$.
