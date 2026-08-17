## **1. Division**

- **Definition:** Let $a$ and $b$ be integers with $a \neq 0$. We say that **$a$ divides $b$** (denoted as $a \mid b$) if there exists an integer $c$ such that $b = ac$.
    
    - If $a \mid b$, then $a$ is called a **factor** or **divisor** of $b$, and $b$ is called a **multiple** of $a$.
        
    - If $a \mid b$, then the fraction $b/a$ is an integer.
        
    - If $a$ does not divide $b$, we write $a \nmid b$.
        

## **2. Properties of Divisibility**

**Theorem 1:** Let $a$, $b$, and $c$ be integers, where $a \neq 0$.

1. If $a \mid b$ and $a \mid c$, then $a \mid (b + c)$.
    
2. If $a \mid b$, then $a \mid bc$ for all integers $c$.
    
3. If $a \mid b$ and $b \mid c$, then $a \mid c$ (Transitivity).
    

**Corollary:** If $a$, $b$, and $c$ are integers, where $a \neq 0$, such that $a \mid b$ and $a \mid c$, then $a$ divides any linear combination of $b$ and $c$:

$$a \mid (mb + nc) \quad \text{for any integers } m \text{ and } n$$

---

## **3. The Division Algorithm**

> This is a theorem defining the existence of a unique quotient and remainder.

- **Theorem:** If $a$ is an integer and $d$ is a positive integer, there exist **unique** integers $q$ and $r$, with $0 \leq r < d$, such that:
    
    $$a = dq + r$$
    
    - $a$ = **dividend**
        
    - $d$ = **divisor**
        
    - $q$ = **quotient** (Defined mathematically as $q = a \text{ div } d$)
        
    - $r$ = **remainder** (Defined mathematically as $r = a \bmod d$)
        

---

## **4. Congruence Relation**

- **Definition:** If $a$ and $b$ are integers and $m$ is a positive integer, $a$ is **congruent to $b$ modulo $m$** if $m$ divides $(a - b)$.
    
    - **Notation:** $a \equiv b \pmod{m}$
        
    - Two integers are congruent modulo $m$ if and only if they have the same remainder when divided by $m$.
        
    - If they are not congruent, we write $a \not\equiv b \pmod{m}$.
        
    - _Example:_ $17 \equiv 5 \pmod{6}$ because $6 \mid (17 - 5)$. $24 \not\equiv 14 \pmod{6}$ because $6 \nmid (24 - 14)$.
        
- **Alternative Definition:** $a \equiv b \pmod{m}$ if and only if there is an integer $k$ such that:
    
    $$a = b + km$$
    
- **Relationship between $\pmod{m}$ and $\bmod m$:**
    
    - $a \equiv b \pmod{m}$ is a **relation** between two integers.
        
    - $a \bmod m = b$ is a **function** that returns a specific remainder.
        
    - **Theorem:** $a \equiv b \pmod{m}$ if and only if $a \bmod m = b \bmod m$.
        

---

## **5. Arithmetic of Congruences**

**Theorem:** Let $m$ be a positive integer. If $a \equiv b \pmod{m}$ and $c \equiv d \pmod{m}$, then:

1. **Sums:** $a + c \equiv b + d \pmod{m}$
    
2. **Products:** $ac \equiv bd \pmod{m}$
    

**Algebraic Manipulation Rules:**

- Multiplying or adding an integer to both sides of a valid congruence preserves its validity.
    
- **WARNING:** _Dividing_ both sides of a congruence by an integer does **not** always produce a valid congruence. (e.g., $14 \equiv 8 \pmod{6}$ is valid, but dividing by 2 yields $7 \equiv 4 \pmod{6}$, which is false).
    

**Corollary (Computing Modulo for Sums and Products):**

To compute the remainder of a large product or sum, we can apply the modulo operation to the intermediate components:

- $(a + b) \bmod m = ((a \bmod m) + (b \bmod m)) \bmod m$
    
- $ab \bmod m = ((a \bmod m)(b \bmod m)) \bmod m$
    

---

## **6. Arithmetic Modulo $m$ ($\mathbb{Z}_m$)**

- **Definition:** Let $\mathbb{Z}_m$ be the set of non-negative integers less than $m$: $\{0, 1, \dots, m-1\}$.
    
- **Operations on $\mathbb{Z}_m$:**
    
    - **Addition modulo $m$ ($+_m$):** $a +_m b = (a + b) \bmod m$
        
    - **Multiplication modulo $m$ ($\cdot_m$):** $a \cdot_m b = (ab) \bmod m$
        
- **Properties of $\mathbb{Z}_m$ Operations:**
    
    - **Closure:** If $a, b \in \mathbb{Z}_m$, then $a +_m b \in \mathbb{Z}_m$ and $a \cdot_m b \in \mathbb{Z}_m$.
        
    - **Associativity:** $(a +_m b) +_m c = a +_m (b +_m c)$, and same for multiplication.
        
    - **Commutativity:** $a +_m b = b +_m a$, and $a \cdot_m b = b \cdot_m a$.
        
    - **Identity Elements:** $0$ is the additive identity ($a +_m 0 = a$). $1$ is the multiplicative identity ($a \cdot_m 1 = a$).
        
    - **Additive Inverses:** If $a \neq 0 \in \mathbb{Z}_m$, then $(m - a)$ is the additive inverse of $a$ because $a +_m (m - a) = 0$. (The inverse of 0 is 0).
        
    - **Distributivity:** $a \cdot_m (b +_m c) = (a \cdot_m b) +_m (a \cdot_m c)$.
        
    - _Note:_ Multiplicative inverses do **not** always exist in $\mathbb{Z}_m$.