## 1. Alternative Form of Inclusion-Exclusion (Counting by Properties)

Instead of focusing on sets, it is often easier to frame inclusion-exclusion problems in terms of _properties_ that elements may or may not possess.

- Let $N$ be the total number of elements in a universal set.
    
- Let $P_1, P_2, \dots, P_n$ be a list of properties.
    
- Let $N(P_i)$ be the number of elements possessing property $P_i$.
    
- Let $N(P_iP_j)$ be the number of elements possessing _both_ properties $P_i$ and $P_j$.
    
- Let $N(P'_1 P'_2 \dots P'_n)$ denote the number of elements possessing **none** of the properties.
    

**Formula:**

$$N(P'_1 P'_2 \dots P'_n) = N - \sum_{1 \le i \le n} N(P_i) + \sum_{1 \le i < j \le n} N(P_iP_j) - \dots + (-1)^n N(P_1P_2 \dots P_n)$$

**Example Application: Constrained Integer Equations**

Find the number of non-negative integer solutions to $x_1 + x_2 + x_3 = 13$, subject to the constraints $x_1 < 6, x_2 < 6, x_3 < 6$.

1. **Universe ($N$):** Unconstrained non-negative integer solutions to $x_1 + x_2 + x_3 = 13$. Using stars and bars, $N = C(3+13-1, 13) = C(15, 13) = 105$.
    
2. **Define Properties (Violations):** Let $P_i$ be the property that $x_i \ge 6$. We want to find $N(P'_1 P'_2 P'_3)$ (the number of solutions satisfying none of the violation properties).
    
3. **Calculate Single Violations:**
    
    $N(P_1)$: Assume $x_1 \ge 6$. Deduct 6. The equation becomes $y_1 + x_2 + x_3 = 7$. Solutions: $C(3+7-1, 7) = C(9, 7) = 36$.
    
    By symmetry, $N(P_1) = N(P_2) = N(P_3) = 36$.
    
4. **Calculate Double Violations:**
    
    $N(P_1 P_2)$: Assume $x_1 \ge 6$ and $x_2 \ge 6$. Deduct 12. Equation becomes $y_1 + y_2 + x_3 = 1$. Solutions: $C(3+1-1, 1) = C(3, 1) = 3$.
    
    By symmetry, $N(P_1P_2) = N(P_1P_3) = N(P_2P_3) = 3$.
    
5. **Calculate Triple Violations:**
    
    $N(P_1 P_2 P_3)$: Assume $x_i \ge 6$ for all three. This requires a sum of at least 18, which is impossible since the total must be 13. Thus, $N(P_1P_2P_3) = 0$.
    
6. **Apply Formula:**
    
    $N(P'_1 P'_2 P'_3) = 105 - (36 + 36 + 36) + (3 + 3 + 3) - 0 = 105 - 108 + 9 = \mathbf{6}$.
    

---

## 2. The Sieve of Eratosthenes

The Sieve of Eratosthenes is used to find primes up to a specific integer. It relies on the fact that a composite integer must be divisible by a prime not exceeding its square root.

**Example:** Find the number of primes not exceeding 100.

1. The primes not exceeding $\sqrt{100} = 10$ are 2, 3, 5, and 7.
    
2. Any composite number $\le 100$ must be divisible by at least one of these four primes.
    
3. Therefore, the primes $\le 100$ are exactly the set of numbers from 2 to 100 that are divisible by _none_ of {2, 3, 5, 7}, _plus_ the 4 primes themselves.
    
4. Let $P_1, P_2, P_3, P_4$ be the properties of being divisible by 2, 3, 5, and 7, respectively. The universe $N$ is the integers from 2 to 100 ($N = 99$).
    
5. Apply the inclusion-exclusion formula to find $N(P'_1 P'_2 P'_3 P'_4)$, calculating intersection sizes using the floor function (e.g., $N(P_1) = \lfloor 100/2 \rfloor - 1$, $N(P_1P_2) = \lfloor 100/6 \rfloor$).
    
6. Total primes = $4 + N(P'_1 P'_2 P'_3 P'_4) = \mathbf{25}$.
    

---

## 3. The Number of Onto Functions (Surjections)

An onto function from a domain of size $m$ to a codomain of size $n$ (where $m \ge n$) requires that every element in the codomain is mapped to by at least one element in the domain.

**Theorem 1:** Let $m$ and $n$ be positive integers with $m \ge n$. The number of onto functions from a set with $m$ elements to a set with $n$ elements is:

$$n^m - C(n, 1)(n-1)^m + C(n, 2)(n-2)^m - \dots + (-1)^{n-1} C(n, n-1) \cdot 1^m$$

**Derivation via Properties:**

1. **Universe ($N$):** Total possible functions $= n^m$.
    
2. **Properties ($P_i$):** Let $P_i$ be the property that element $y_i$ in the codomain is _not_ in the range of the function (i.e., nothing maps to it). An onto function possesses _none_ of these properties ($P'_1 \dots P'_n$).
    
3. **Single Violations ($N(P_i)$):** If $y_i$ is excluded, the codomain effectively has $n-1$ elements. Number of functions $= (n-1)^m$. Since there are $n$ ways to choose which element to exclude, the sum over all $i$ is $C(n,1)(n-1)^m$.
    
4. **Double Violations ($N(P_i P_j)$):** If two specific elements are excluded, the codomain has $n-2$ elements. Number of functions $= (n-2)^m$. There are $C(n,2)$ pairs. The sum is $C(n,2)(n-2)^m$.
    
5. Applying the alternating sum yields the theorem.
    

---

## 4. Derangements

**Definition:** A derangement is a permutation of objects such that _no object remains in its original position_.

- _Example:_ For the sequence 12345, the permutation 21453 is a derangement. The permutation 21543 is not, because 4 remains in the 4th position.
    

**Theorem 2:** The number of derangements of a set with $n$ elements, denoted $D_n$, is:

$$D_n = n! \left[ 1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \dots + (-1)^n \frac{1}{n!} \right]$$

**Derivation via Properties:**

1. **Universe ($N$):** Total permutations of $n$ elements $= n!$.
    
2. **Properties ($P_i$):** Let $P_i$ be the property that element $i$ is fixed in its original position. A derangement possesses _none_ of these properties.
    
3. **Single Fixes ($N(P_i)$):** If element $i$ is fixed, the remaining $n-1$ elements can be permuted in $(n-1)!$ ways. Since there are $n$ possible elements to fix, $\sum N(P_i) = C(n,1)(n-1)! = \frac{n!}{(n-1)!1!}(n-1)! = \frac{n!}{1!}$.
    
4. **Double Fixes ($N(P_i P_j)$):** If two specific elements are fixed, the remaining $n-2$ elements can be permuted in $(n-2)!$ ways. There are $C(n,2)$ such pairs. $\sum N(P_iP_j) = C(n,2)(n-2)! = \frac{n!}{2!(n-2)!}(n-2)! = \frac{n!}{2!}$.
    
5. Applying the inclusion-exclusion formula and factoring out $n!$ yields the final formula.
    

**Probability Remark:**

The probability that a random permutation is a derangement is $\frac{D_n}{n!} = \sum_{k=0}^n \frac{(-1)^k}{k!}$. As $n$ grows to infinity, this Taylor series converges to $e^{-1} \approx 0.368$. Thus, even for very large sets, the probability of a complete derangement stabilizes around 36.8%.