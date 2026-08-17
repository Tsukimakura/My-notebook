# 40_Generating Functions

## 1. Introduction to Generating Functions

**Definition:** The ordinary generating function for an infinite sequence of real numbers $a_0, a_1, \dots, a_k, \dots$ is the infinite power series:

$$
G(x) = a_0 + a_1x + a_2x^2 + \dots + a_kx^k + \dots = \sum_{k=0}^{\infty} a_kx^k
$$

_(Conceptually, as Herbert Wilf described, a generating function is a "clothesline" on which we hang a sequence of numbers for display. For discrete math applications, questions about the analytical convergence of these series are generally ignored; we treat them as formal power series)._

**Finite Sequences:**

A finite sequence $a_0, a_1, \dots, a_n$ can be treated as an infinite sequence by padding it with zeros ($a_k = 0$ for $k > n$). Its generating function is a polynomial of degree $n$:

$$
G(x) = a_0 + a_1x + \dots + a_nx^n
$$

**Basic Examples:**

- Sequence $3, 3, 3, 3, \dots \implies \sum_{k=0}^{\infty} 3x^k = 3 \sum_{k=0}^{\infty} x^k = \frac{3}{1-x}$

- Sequence $1, 2, 4, 8, \dots \implies a_k = 2^k \implies \sum_{k=0}^{\infty} 2^kx^k = \frac{1}{1-2x}$

- Finite Sequence $1, 1, 1, 1, 1, 1 \implies \sum_{k=0}^{5} x^k = \frac{x^6-1}{x-1}$ (Formula for a finite geometric series).

---

## 2. Operations on Power Series

Let $f(x) = \sum_{k=0}^{\infty} a_kx^k$ and $g(x) = \sum_{k=0}^{\infty} b_kx^k$. The following operations generate new sequences:

1. **Addition:** $f(x) + g(x) = \sum_{k=0}^{\infty} (a_k+b_k)x^k$

2. **Scalar Multiplication:** $\alpha f(x) = \sum_{k=0}^{\infty} (\alpha a_k)x^k$

3. **Scaling the Index:** $f(\alpha x) = \sum_{k=0}^{\infty} a_k\alpha^k x^k$

4. **Differentiation (Index Multiplication):** $x \cdot f'(x) = \sum_{k=0}^{\infty} k a_k x^k$

5. **Multiplication (Convolution):** $f(x)g(x) = \sum_{k=0}^{\infty} \left(\sum_{j=0}^{k} a_j b_{k-j}\right)x^k$

**Application of Convolution (Prefix Sums):**

If $G(x)$ generates the sequence $a_k$, what generates the sequence of its partial sums $b_k = \sum_{i=0}^k a_i$?

Using the convolution rule, multiply $G(x)$ by $\frac{1}{1-x}$ (which generates the sequence $1, 1, 1, \dots$).

$$
b_k \leftrightarrow G(x) \cdot \frac{1}{1-x}
$$

---

## 3. The Extended Binomial Theorem

To handle generating functions with negative exponents (e.g., $(1-x)^{-n}$), we extend the binomial theorem to real numbers.

**Definition:** Let $u$ be a real number and $k$ a nonnegative integer. The extended binomial coefficient is:

$$
\binom{u}{k} = \begin{cases} \frac{u(u-1)\dots(u-k+1)}{k!} & \text{if } k > 0 \\ 1 & \text{if } k = 0 \end{cases}
$$

**The Extended Binomial Theorem:** For real $u$ and $|x| < 1$:

$$
(1+x)^u = \sum_{k=0}^{\infty} \binom{u}{k} x^k
$$

**Crucial Derivation for Negative Integers:**

When $u = -n$ (where $n$ is a positive integer), the coefficient simplifies elegantly:

$$
\binom{-n}{k} = \frac{-n(-n-1)\dots(-n-k+1)}{k!} = (-1)^k \frac{n(n+1)\dots(n+k-1)}{k!} = (-1)^k \binom{n+k-1}{k}
$$

This leads to two highly useful generating function identities:

1. $(1+x)^{-n} = \sum_{k=0}^{\infty} (-1)^k \binom{n+k-1}{k} x^k$

2. $(1-x)^{-n} = \sum_{k=0}^{\infty} \binom{n+k-1}{k} x^k$

---

## 4. Solving Counting Problems

Generating functions uniquely map combinatorics constraints into polynomial multiplication.

**A. Integer Solutions to Equations**

Find the number of solutions to $e_1 + e_2 + e_3 = 17$, with $2 \le e_1 \le 5$, $3 \le e_2 \le 6$, $4 \le e_3 \le 7$.

- _Method:_ Construct a polynomial for each variable representing its valid range. The answer is the coefficient of $x^{17}$ in the expansion of:

    $(x^2+x^3+x^4+x^5)(x^3+x^4+x^5+x^6)(x^4+x^5+x^6+x^7)$

**B. Combinations with Repetition**

Find the number of $r$-combinations from a set of $n$ elements with unlimited repetition.

- _Method:_ Each of the $n$ elements can be chosen $0, 1, 2, \dots$ times. This corresponds to the polynomial $(1+x+x^2+\dots)$ for each element.

    $G(x) = (1+x+x^2+\dots)^n = \left(\frac{1}{1-x}\right)^n = (1-x)^{-n}$

- By the extended binomial theorem, the coefficient of $x^r$ is $\binom{n+r-1}{r}$.

**C. Order Matters vs. Order Doesn't Matter (Vending Machine)**

Determine the ways to insert tokens worth **1**, **2**, and **5** to total **$r**.

- **Order does NOT matter (Combinations):** Treat it as selecting quantities of each token type.

    $G(x) = (1+x+x^2+\dots)(1+x^2+x^4+\dots)(1+x^5+x^{10}+\dots) = \frac{1}{1-x} \cdot \frac{1}{1-x^2} \cdot \frac{1}{1-x^5}$

- **Order DOES matter (Permutations/Compositions):** A single insertion action can be a 1, 2, or 5, represented by $(x+x^2+x^5)$. Since any number of tokens can be inserted in sequence, we sum over all possible number of tokens $n$:

    $G(x) = 1 + (x+x^2+x^5) + (x+x^2+x^5)^2 + \dots = \frac{1}{1 - (x+x^2+x^5)}$

- In both cases, the answer is the coefficient of $x^r$.

---

## 5. Solving Recurrence Relations

Generating functions can convert a recurrence relation into an algebraic equation, solve for $G(x)$, and then map $G(x)$ back to the explicit sequence $a_n$.

**Methodology Example:** Solve $a_n = 2a_{n-1} + 3a_{n-2} + 4^n + 6$ with initial conditions $a_0 = 20, a_1 = 60$.

1. **Multiply by $x^n$ and sum from $n=2$ to $\infty$:**

    $\sum_{n=2}^{\infty} a_n x^n = 2 \sum_{n=2}^{\infty} a_{n-1}x^n + 3 \sum_{n=2}^{\infty} a_{n-2}x^n + \sum_{n=2}^{\infty} 4^nx^n + \sum_{n=2}^{\infty} 6x^n$

2. **Express in terms of $G(x) = \sum_{n=0}^{\infty} a_nx^n$:**

    $G(x) - a_0 - a_1x = 2x(G(x) - a_0) + 3x^2G(x) + \left(\frac{1}{1-4x} - 1 - 4x\right) + 6\left(\frac{1}{1-x} - 1 - x\right)$

3. **Substitute initial conditions ($a_0=20, a_1=60$) and algebraically isolate $G(x)$:**

    $G(x)(1 - 2x - 3x^2) = 20 + 60x - 40x + \frac{1}{1-4x} - 1 - 4x + \frac{6}{1-x} - 6 - 6x$

    $G(x) = \frac{20 - 80x + 2x^2 + 40x^3}{(1-2x-3x^2)(1-4x)(1-x)}$

4. **Use Partial Fraction Decomposition:**

    Factor the denominator: $(1-2x-3x^2) = (1-3x)(1+x)$.

    $G(x) = \frac{16/5}{1-4x} - \frac{3/2}{1-x} + \frac{31/20}{1+x} + \frac{67/4}{1-3x}$

5. **Extract the coefficient $a_n$:**

    Using the standard identity $\frac{1}{1-cx} \leftrightarrow c^n$:

    $a_n = \frac{16}{5}4^n - \frac{3}{2} + \frac{31}{20}(-1)^n + \frac{67}{4}3^n$

---

## 6. Proving Identities

Generating functions provide a purely algebraic method to prove combinatorial identities without needing complex set-theoretic counting arguments.

**Example: Pascal's Identity $\binom{n}{r} = \binom{n-1}{r} + \binom{n-1}{r-1}$**

_Proof:_

Start with the generating function for $\binom{n}{r}$:

$G(x) = (1+x)^n = \sum_{r=0}^{\infty} \binom{n}{r} x^r$

Factor out one $(1+x)$ term:

$(1+x)^n = (1+x)(1+x)^{n-1} = (1+x) \sum_{r=0}^{\infty} \binom{n-1}{r} x^r$

Distribute the $(1+x)$:

$= \sum_{r=0}^{\infty} \binom{n-1}{r} x^r + \sum_{r=0}^{\infty} \binom{n-1}{r} x^{r+1}$

Shift the index on the second sum so the powers of $x$ match:

$= \sum_{r=0}^{\infty} \binom{n-1}{r} x^r + \sum_{r=1}^{\infty} \binom{n-1}{r-1} x^r$

Combine the sums and equate coefficients of $x^r$:

$\binom{n}{r} x^r = \left[ \binom{n-1}{r} + \binom{n-1}{r-1} \right] x^r$

Therefore, $\binom{n}{r} = \binom{n-1}{r} + \binom{n-1}{r-1}$.
