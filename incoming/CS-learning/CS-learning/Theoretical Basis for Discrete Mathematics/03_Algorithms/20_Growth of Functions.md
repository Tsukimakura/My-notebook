## **1. Big-O Notation ($O$)**

Big-$O$ notation provides an **upper bound** on the growth rate of a function.

- **Definition:** Let $f$ and $g$ be functions from the set of integers or real numbers to the set of real numbers. We say that $f(x)$ is $O(g(x))$ if there are constants $C$ and $k$ such that:
    
    $$|f(x)| \le C|g(x)| \quad \text{whenever } x > k$$
    
- **Terminology:** This is read as "$f(x)$ is big-$O$ of $g(x)$" or "$g$ asymptotically dominates $f$". The constants $C$ and $k$ are called **witnesses** to the relationship. Only one pair of witnesses is needed to prove the relationship.
    
- **Important Properties:**
    
    - If one pair of witnesses exists, infinitely many exist.
        
    - Writing $f(x) = O(g(x))$ is a standard convention, but it is an abuse of the equals sign. It is more mathematically accurate to write $f(x) \in O(g(x))$.
        
    - If $f(x)$ is $O(g(x))$ and a function $h(x)$ is larger than $g(x)$ for all positive real numbers, then $f(x)$ is also $O(h(x))$.
        
    - _Goal:_ In practice, we aim to select a $g(x)$ that is as small as possible.
        

**Key Examples:**

- $f(x) = x^2 + 2x + 1$ is $O(x^2)$. (Witnesses: $C = 4, k = 1$)
    
- $f(x) = 7x^2$ is $O(x^3)$. (Witnesses: $C = 1, k = 7$)
    
- $f(n) = n^2$ is **not** $O(n)$. (Proof by contradiction: If $n^2 \le Cn$, then $n \le C$ for all $n > k$, which is impossible as $n$ grows infinitely).
    

---

## **2. Big-O Estimates for Important Functions**

- **Polynomials:** The leading term of a polynomial dominates its growth.
    
    If $f(x) = a_nx^n + a_{n-1}x^{n-1} + \dots + a_1x + a_0$ (where $a_n \neq 0$), then $f(x)$ is $O(x^n)$.
    
- **Sum of the first $n$ positive integers:** $1 + 2 + \dots + n \le n + n + \dots + n = n^2$. Thus, the sum is $O(n^2)$.
    
- **Factorials:** $n! = 1 \times 2 \times \dots \times n \le n \times n \times \dots \times n = n^n$. Thus, $n!$ is $O(n^n)$.
    
- **Logarithm of Factorials:** Since $n! \le n^n$, taking the log of both sides gives $\log(n!) \le n \log(n)$. Thus, $\log(n!)$ is $O(n \log n)$.
    

---

## **3. Useful Growth Rules & Combinations**

**Logarithms, Powers, and Exponents:**

- If $d > c > 1$, then $n^c$ is $O(n^d)$, but $n^d$ is **not** $O(n^c)$.
    
- Powers of $n$ grow faster than powers of logs.
    
- Exponentials grow faster than polynomials.
    
- If $c > b > 1$, then $b^n$ is $O(c^n)$, but $c^n$ is **not** $O(b^n)$.
    

**Combinations of Functions:**

1. **Sum Rule:** If $f_1(x)$ is $O(g_1(x))$ and $f_2(x)$ is $O(g_2(x))$, then $(f_1 + f_2)(x)$ is $O(\max(|g_1(x)|, |g_2(x)|))$.
    
    - _Corollary:_ If $f_1(x)$ and $f_2(x)$ are both $O(g(x))$, their sum is $O(g(x))$.
        
2. **Product Rule:** If $f_1(x)$ is $O(g_1(x))$ and $f_2(x)$ is $O(g_2(x))$, then $(f_1 f_2)(x)$ is $O(g_1(x)g_2(x))$.
    

---

## **4. Ordering Functions by Order of Growth**

Listed from slowest growth (smallest order) to fastest growth:

1. **Constant:** $10000$
    
2. **Log-Log:** $\log(\log n)$
    
3. **Logarithmic Power:** $(\log n)^2$
    
4. **Polynomial combinations:** $n^2(\log n)^3$
    
5. **Polynomials (tied if same degree):** $8n^3 + 17n^2 + 111$ and $n^3 + n(\log n)^2$
    
6. **Exponential (smaller base):** $(1.5)^n$
    
7. **Exponential (larger base):** $2^n$
    
8. **Exponential mixed:** $2^n(n^2 + 1)$
    
9. **Factorial:** $n!$
    

---

## **5. Big-Omega ($\Omega$) and Big-Theta ($\Theta$) Notations**

**Big-Omega ($\Omega$) Notation (Lower Bound):**

- **Definition:** $f(x)$ is $\Omega(g(x))$ if there are constants $C$ and $k$ such that:
    
    $$|f(x)| \ge C|g(x)| \quad \text{when } x > k$$
    
- **Meaning:** $f(x)$ grows _at least as fast_ as $g(x)$.
    
- **Property:** $f(x)$ is $\Omega(g(x))$ if and only if $g(x)$ is $O(f(x))$.
    
- _Example:_ $f(x) = 8x^3 + 5x^2 + 7$ is $\Omega(x^3)$ because $8x^3 + 5x^2 + 7 \ge 8x^3$ for all positive $x$.
    

**Big-Theta ($\Theta$) Notation (Tight Bound / Same Order):**

- **Definition:** $f(x)$ is $\Theta(g(x))$ if $f(x)$ is $O(g(x))$ **AND** $f(x)$ is $\Omega(g(x))$.
    
- **Meaning:** $f(x)$ and $g(x)$ are of the _same order_ of growth. There exist constants $C_1, C_2,$ and $k$ such that $C_1|g(x)| \le |f(x)| \le C_2|g(x)|$ for $x > k$.
    
- _Examples:_ 
	
	- The sum of the first $n$ positive integers is $\Theta(n^2)$.
	    
    - $3x^2 + 8x \log x$ is $\Theta(x^2)$.
        
- **Theorem for Polynomials:** Let $f(x) = a_nx^n + a_{n-1}x^{n-1} + \dots + a_0$ (where $a_n \neq 0$). Then $f(x)$ is of order $x^n$, written as $\Theta(x^n)$.
    
    - _Example:_ $8x^5 + 5x^2 + 10$ is $\Theta(x^5)$.