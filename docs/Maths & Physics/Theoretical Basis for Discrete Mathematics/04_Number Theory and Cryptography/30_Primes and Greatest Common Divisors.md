# 30_Primes and Greatest Common Divisors

## **1. Prime Numbers and Their Properties**

- **Definitions:**

    - **Prime:** A positive integer $p > 1$ whose only positive factors are $1$ and $p$.

    - **Composite:** A positive integer greater than 1 that is not prime.

- **The Fundamental Theorem of Arithmetic:** Every positive integer greater than 1 can be written uniquely as a prime or as the product of two or more primes, where the prime factors are written in order of nondecreasing size.

- **Infinitude of Primes (Euclid's Theorem):** There are infinitely many primes.

## **2. Finding and Generating Primes**

- **The Sieve of Eratosthenes:** An algorithm to find all primes up to a specified integer $n$.

    - Method: List integers from 2 to $n$. Iteratively delete all multiples of 2, then multiples of 3, 5, 7, etc. The remaining undeleted numbers are primes.

    - _Optimization:_ If an integer $n$ is composite, it must have a prime divisor less than or equal to $\sqrt{n}$. Therefore, we only need to sieve up to $\sqrt{n}$.

- **Mersenne Primes:** Prime numbers of the form $2^p - 1$, where $p$ is prime.

    - _Examples:_ $2^2 - 1 = 3$, $2^3 - 1 = 7$, $2^5 - 1 = 31$.

    - $2^{11} - 1 = 2047$ is _not_ prime ($23 \cdot 89$).

- **Distribution of Primes (Prime Number Theorem):** The ratio of the number of primes not exceeding $x$ to $x / \ln(x)$ approaches 1 as $x$ grows without bound. The odds that a randomly selected integer less than $n$ is prime are approximately $1 / \ln(n)$.

$$
\lim_{x \to \infty} \frac{\pi(x)}{x / \ln(x)} = 1
$$

- where $\pi(x)$ is The number of primes not exceeding $x$.

## **3. Open Conjectures About Primes**

Despite centuries of study, several conjectures remain unproven:

- **Goldbach's Conjecture:** Every even integer $n > 2$ is the sum of two primes.

- **The Twin Prime Conjecture:** There are infinitely many pairs of twin primes (primes that differ by exactly 2, e.g., 3 and 5, 11 and 13).

## **4. Greatest Common Divisors (gcd) and Least Common Multiples (lcm)**

- **Greatest Common Divisor ($\text{gcd}(a, b)$):** The largest integer $d$ that divides both $a$ and $b$ (where $a, b$ are not both zero).

    - **Relatively Prime:** Integers $a$ and $b$ are relatively prime if $\text{gcd}(a, b) = 1$.

    - **Pairwise Relatively Prime:** A set of integers $a_1, \dots, a_n$ are pairwise relatively prime if $\text{gcd}(a_i, a_j) = 1$ for all $i \neq j$.

- **Least Common Multiple ($\text{lcm}(a, b)$):** The smallest positive integer that is divisible by both $a$ and $b$.

- **Using Prime Factorizations:** If $a = p_1^{a_1} \dots p_n^{a_n}$ and $b = p_1^{b_1} \dots p_n^{b_n}$:

    - $\text{gcd}(a, b) = p_1^{\min(a_1, b_1)} \dots p_n^{\min(a_n, b_n)}$

    - $\text{lcm}(a, b) = p_1^{\max(a_1, b_1)} \dots p_n^{\max(a_n, b_n)}$

    - **Important Theorem**: $ab = \text{gcd}(a, b) \cdot \text{lcm}(a, b)$

## **5. The Euclidean Algorithm**

An highly efficient method for computing $\text{gcd}(a, b)$ based on the lemma:

- **Lemma 1:** Let $a = bq + r$. Then $\text{gcd}(a, b) = \text{gcd}(b, r)$.

- **Algorithm Steps:** Successively apply the division algorithm until a remainder of zero is reached.

    1. $a = bq_1 + r_1$

    2. $b = r_1 q_2 + r_2$

    3. $r_1 = r_2 q_3 + r_3 \dots$

    4. The sequence ends when $r_{n-1} = r_n q_{n+1} + 0$.

    - The **last nonzero remainder** ($r_n$) is the $\text{gcd}$.

- **Time Complexity:** $O(\log b)$ divisions.

## **6. Bézout's Theorem and Linear Combinations**

- **Bézout's Theorem:** If $a$ and $b$ are positive integers, there exist integers $s$ and $t$ (Bézout coefficients) such that:

    $$
\text{gcd}(a, b) = sa + tb
    $$

- **Finding Coefficients:** Use the steps of the Euclidean algorithm and work backwards, substituting the remainders.(xgcd)

## **7. Crucial Consequences of Bézout's Theorem**

- **Lemma 2:** If $\text{gcd}(a, b) = 1$ and $a \mid bc$, then $a \mid c$.

- **Lemma 3:** If $p$ is prime and $p \mid a_1 a_2 \dots a_n$, then $p \mid a_i$ for some $i$. (This lemma is essential for proving the uniqueness part of the Fundamental Theorem of Arithmetic).

- **Dividing Congruences:** Dividing both sides of a valid congruence by an integer generally does _not_ preserve validity. **However, Theorem states:**

    If $ac \equiv bc \pmod{m}$ and $\text{gcd}(c, m) = 1$ (they are relatively prime), then $a \equiv b \pmod{m}$.
