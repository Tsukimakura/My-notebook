# 40_Solving Congruences

## **1. Linear Congruences and Inverses**

- **Definition:** A congruence of the form $ax \equiv b \pmod m$, where $m$ is a positive integer, $a$ and $b$ are integers, and $x$ is a variable, is called a **linear congruence**.

- **Inverse Modulo $m$:** An integer $\bar{a}$ such that $\bar{a}a \equiv 1 \pmod m$ is called an inverse of $a$ modulo $m$.

    - _Example:_ $5$ is an inverse of $3$ modulo $7$ because $5 \cdot 3 = 15 \equiv 1 \pmod 7$.

- **Existence of Inverses (Theorem 1):** If $a$ and $m$ are relatively prime integers ($\gcd(a, m) = 1$) and $m > 1$, then an inverse of $a$ modulo $m$ exists and is unique modulo $m$.

    - _Proof Idea:_ By Bézout's Theorem, if $\gcd(a, m) = 1$, there exist integers $s$ and $t$ such that $sa + tm = 1$. Taking this modulo $m$ yields $sa \equiv 1 \pmod m$. Thus, $s$ is the inverse.

- **Finding Inverses systematically:** Apply the **Euclidean Algorithm** to find the $\gcd$, then work backwards to find the **Bézout coefficients**.

    - _Example:_ Find the inverse of $101$ modulo $4620$.

        1. $4620 = 45 \cdot 101 + 75$

        2. $101 = 1 \cdot 75 + 26$

        3. $75 = 2 \cdot 26 + 23$

        4. $26 = 1 \cdot 23 + 3$

        5. $23 = 7 \cdot 3 + 2$

        6. $3 = 1 \cdot 2 + 1$

        - Working backwards: $1 = 3 - 1 \cdot 2 \dots = -35 \cdot 4620 + 1601 \cdot 101$.

        - The Bézout coefficient for $101$ is $1601$, so $1601$ is the inverse of $101$ modulo $4620$.

- **Solving Congruences using Inverses:** Multiply both sides of $ax \equiv b \pmod m$ by the inverse $\bar{a}$.

    - _Example:_ $3x \equiv 4 \pmod 7$. The inverse of $3$ is $-2$ (or $5$).

        $-2 \cdot 3x \equiv -2 \cdot 4 \pmod 7 \implies -6x \equiv -8 \pmod 7 \implies 1x \equiv 6 \pmod 7$.

---

## **2. The Chinese Remainder Theorem (CRT)**

Used to solve systems of congruences with pairwise relatively prime moduli.

- **Theorem 2 (CRT):** Let $m_1, m_2, \dots, m_n$ be pairwise relatively prime positive integers $> 1$, and $a_1, a_2, \dots, a_n$ be arbitrary integers. The system:

    $x \equiv a_1 \pmod{m_1}$

    $x \equiv a_2 \pmod{m_2}$

    $\dots$

    $x \equiv a_n \pmod{m_n}$

    has a unique solution modulo $m = m_1 m_2 \dots m_n$.

- **Formula Construction:**

    1. Let $M_k = m / m_k$ (the product of all moduli except $m_k$).

    2. Find $y_k$, the inverse of $M_k$ modulo $m_k$ (such that $M_k y_k \equiv 1 \pmod{m_k}$).

    3. The simultaneous solution is: **$x = a_1 M_1 y_1 + a_2 M_2 y_2 + \dots + a_n M_n y_n$**

- **Alternative Method: Back Substitution**

    Instead of the formula, substitute equations sequentially.

    - _Example:_ $x \equiv 1 \pmod 5$, $x \equiv 2 \pmod 6$, $x \equiv 3 \pmod 7$.

        1. From eq 1: $x = 5t + 1$.

        2. Substitute into eq 2: $5t + 1 \equiv 2 \pmod 6 \implies 5t \equiv 1 \pmod 6 \implies t \equiv 5 \pmod 6 \implies t = 6u + 5$.

        3. Update $x$: $x = 5(6u + 5) + 1 = 30u + 26$.

        4. Substitute into eq 3: $30u + 26 \equiv 3 \pmod 7 \implies 2u + 5 \equiv 3 \pmod 7 \implies 2u \equiv -2 \pmod 7 \implies u \equiv 6 \pmod 7 \implies u = 7v + 6$.

        5. Final $x$: $x = 30(7v + 6) + 26 = 210v + 206$. Thus, $x \equiv 206 \pmod{210}$.

---

## **3. Fermat's Little Theorem and Euler's Extension**

- **Theorem 3 (Fermat's Little Theorem):** If $p$ is prime and $a$ is an integer not divisible by $p$, then:

    **$a^{p-1} \equiv 1 \pmod p$**

    Furthermore, for every integer $a$: **$a^p \equiv a \pmod p$**

    - _Application:_ Highly useful for computing remainders of large powers modulo a prime.

    - _Example:_ $7^{222} \bmod 11$. Since $7^{10} \equiv 1 \pmod{11}$, $7^{222} = (7^{10})^{22} \cdot 7^2 \equiv 1^{22} \cdot 49 \equiv 5 \pmod{11}$.

- **Euler's Theorem (Generalization):** Let $\varphi(n)$ be Euler's totient function (the count of positive integers less than $n$ that are relatively prime to $n$). If $\gcd(a, n) = 1$, then:

    **$a^{\varphi(n)} \equiv 1 \pmod n$**

---

## **4. Pseudoprimes and Carmichael Numbers**

- **Pseudoprimes:** By Fermat's Little Theorem, if $2^{n-1} \not\equiv 1 \pmod n$, $n$ is definitely composite. However, if $2^{n-1} \equiv 1 \pmod n$, $n$ _might_ be prime. If $n$ is composite but still satisfies $b^{n-1} \equiv 1 \pmod n$, it is called a **pseudoprime to the base $b$**.

    - _Example:_ $341$ is composite ($11 \cdot 31$), but $2^{340} \equiv 1 \pmod{341}$. It is a pseudoprime to base $2$.

- **Carmichael Numbers:** Composite integers $n$ that satisfy $b^{n-1} \equiv 1 \pmod n$ for **all** positive integers $b$ relatively prime to $n$ ($\gcd(b,n)=1$).

    - _Example:_ $561$ ($3 \cdot 11 \cdot 17$) is a Carmichael number. They pass Fermat's primality test for all valid bases, necessitating more advanced probabilistic tests for primality.

---

## **5. Primitive Roots and Discrete Logarithms**

- **Primitive Root:** An integer $r$ in $\mathbb{Z}_p$ is a primitive root modulo a prime $p$ if every nonzero element of $\mathbb{Z}_p$ can be expressed as a power of $r$.

    - _Example:_ $2$ is a primitive root of $11$ because its powers ($2^1, 2^2, \dots, 2^{10} \pmod{11}$) generate all numbers from $1$ to $10$.

    - _Important Fact:_ There is a primitive root modulo $p$ for every prime number $p$.

- **Discrete Logarithms:** Suppose $p$ is prime, $r$ is a primitive root modulo $p$, and $a$ is an integer in $[1, p-1]$. The unique exponent $e$ in $[1, p-1]$ such that **$r^e \bmod p = a$** is called the discrete logarithm of $a$ modulo $p$ to the base $r$.

    - _Notation:_ $\log_r a = e$

    - _Example:_ $\log_2 3 = 8$ (modulo $11$) because $2^8 \equiv 3 \pmod{11}$.

- **Cryptographic Significance (The Asymmetry):**

    - **Easy:** Computing $a$ given $r, e,$ and $p$ (Modular Exponentiation).

    - **Hard:** Computing the exponent $e$ given $a, r,$ and $p$ (Discrete Logarithm). There is **no known polynomial-time algorithm** for computing discrete logarithms, which forms the mathematical foundation for several cryptographic protocols.
