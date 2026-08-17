# 50_Inclusion-Exclusion

## 1. The Core Concept

The Principle of Inclusion-Exclusion provides a method to calculate the number of elements in the union of multiple sets. The basic strategy is:

1. **Include:** Add the sizes of all the individual sets.

2. **Exclude:** Subtract the sizes of all pairwise intersections (because these were counted twice in step 1).

3. **Include:** Add back the sizes of all three-way intersections (because they were added three times in step 1 and subtracted three times in step 2, resulting in a net count of zero).

4. Continue this alternating pattern of adding and subtracting intersections of increasing size.

### For Two Finite Sets

This is the simplest form, covered in foundational set theory:

$$
|A \cup B| = |A| + |B| - |A \cap B|
$$

### For Three Finite Sets

Extending the logic to three sets ($A$, $B$, and $C$):

$$
|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|
$$

---

## 2. The General Theorem

**Theorem 1: The Principle of Inclusion-Exclusion**

Let $A_1, A_2, \dots, A_n$ be finite sets. The number of elements in their union is given by:

$$
|A_1 \cup A_2 \dots \cup A_n| = \sum_{1 \le i \le n} |A_i| - \sum_{1 \le i < j \le n} |A_i \cap A_j| + \sum_{1 \le i < j < k \le n} |A_i \cap A_j \cap A_k| - \dots + (-1)^{n+1}|A_1 \cap A_2 \dots \cap A_n|
$$

### Combinatorial Proof

To prove this theorem, we must show that an arbitrary element $a$ belonging to the union is counted exactly _once_ by the formula on the right-hand side.

1. Assume element $a$ is a member of exactly $r$ of the sets $A_1, \dots, A_n$ (where $1 \le r \le n$).

2. In the first sum ($\sum |A_i|$), $a$ is counted $C(r, 1)$ times.

3. In the second sum ($\sum |A_i \cap A_j|$), $a$ is counted $C(r, 2)$ times (once for each pair of sets containing it).

4. In general, in the sum involving the intersection of $m$ sets, $a$ is counted $C(r, m)$ times.

5. The total net count for element $a$ evaluates to the alternating sum:

        $$
    C(r, 1) - C(r, 2) + C(r, 3) - \dots + (-1)^{r+1}C(r, r)
        $$

6. By the alternating sum identity of binomial coefficients (from Section 6.4), we know:

    $C(r, 0) - C(r, 1) + C(r, 2) - \dots + (-1)^r C(r, r) = 0$

7. Rearranging this identity yields:

    $C(r, 0) = C(r, 1) - C(r, 2) + \dots + (-1)^{r+1} C(r, r)$

8. Since $C(r, 0) = 1$, the right-hand side of the Inclusion-Exclusion formula counts the element $a$ exactly $1$ time.

---

## 3. Applications and Examples

The Principle of Inclusion-Exclusion is particularly useful for finding the number of elements that satisfy _none_ of a given set of properties. Let $U$ be a universal set, and $A_i$ be the subset of elements satisfying property $P_i$. The number of elements satisfying none of the properties is:

$$
|\overline{A_1} \cap \overline{A_2} \dots \cap \overline{A_n}| = |U| - |A_1 \cup A_2 \dots \cup A_n|
$$

**Example: Divisibility**

_Question:_ How many positive integers not exceeding 1000 are not divisible by 5, 6, or 8?

_Solution:_

1. **Define Sets:** Let $U$ be integers from 1 to 1000 ($|U| = 1000$).

    Let $A, B, C$ be the sets of integers divisible by 5, 6, and 8, respectively.

    We seek $|\overline{A} \cap \overline{B} \cap \overline{C}| = |U| - |A \cup B \cup C|$.

2. **Calculate Individual Sizes:** (Using the floor function $\lfloor x \rfloor$)

    $|A| = \lfloor 1000/5 \rfloor = 200$

    $|B| = \lfloor 1000/6 \rfloor = 166$

    $|C| = \lfloor 1000/8 \rfloor = 125$

3. **Calculate Pairwise Intersections:** (Using the Least Common Multiple, LCM)

    $|A \cap B|$ (divisible by LCM of 5, 6 = 30) = $\lfloor 1000/30 \rfloor = 33$

    $|A \cap C|$ (divisible by LCM of 5, 8 = 40) = $\lfloor 1000/40 \rfloor = 25$

    $|B \cap C|$ (divisible by LCM of 6, 8 = 24) = $\lfloor 1000/24 \rfloor = 41$

4. **Calculate Three-way Intersection:**

    $|A \cap B \cap C|$ (divisible by LCM of 5, 6, 8 = 120) = $\lfloor 1000/120 \rfloor = 8$

5. **Apply Inclusion-Exclusion:**

    $|A \cup B \cup C| = (200 + 166 + 125) - (33 + 25 + 41) + 8 = 491 - 99 + 8 = 400$

6. **Final Answer:**

    $|U| - |A \cup B \cup C| = 1000 - 400 = 600$. There are 600 such integers.
