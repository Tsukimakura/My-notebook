## 1. Defining Cardinality

Cardinality measures and compares the size of sets, which is applicable to both finite and infinite sets.

- **Equal Cardinality ($|A| = |B|$):** Exists if and only if there is a bijection (one-to-one correspondence) from set $A$ to set $B$.
    
- **Less Than or Equal ($|A| \leq |B|$):** Exists if there is an injection (one-to-one function) from $A$ to $B$.
    
- **Strictly Less ($|A| < |B|$):** Exists if $|A| \leq |B|$ and $|A| \neq |B|$.
    

---

## 2. Countable Sets ($\aleph_0$)

- **Definition:** A set is countable if it is finite or has the same cardinality as the positive integers $\mathbb{Z}^+$.
    
- **Countably Infinite:** When an infinite set $S$ is countable, its cardinality is denoted by $\aleph_0$ (aleph null). We write $|S| = \aleph_0$.
    
- **Key Properties:**
    
    - No infinite set has a smaller cardinality than a countable set.
        
    - The union of two countable sets is countable.
        
    - The union of a finite or countably infinite number of countable sets is countable.
        

---

## 3. Examples & Proofs of Countable Sets

To prove an infinite set is countable, you must show its elements can be listed in a sequence indexed by $\mathbb{Z}^+$.

- **Positive Even Integers ($E$):** The function $f(x) = 2x$ acts as a one-to-one and onto mapping from $\mathbb{Z}^+$ to $E$, proving $|E| = \aleph_0$.
    
- **All Integers ($\mathbb{Z}$):** Integers can be sequenced as $0, 1, -1, 2, -2 \dots$ The exact bijection from $\mathbb{Z}^+$ to $\mathbb{Z}$ is $f(n) = n/2$ (for even $n$) and $f(n) = -(n-1)/2$ (for odd $n$).
    
- **Ordered Pairs of Integers:** A 2D grid of coordinates is countably infinite. A bijection is created by tracing a continuous spiral path outward from $(0,0)$ to hit every point sequentially.
    
- **Positive Rational Numbers ($\mathbb{Q}^+$):** Countable via a diagonal grid traversal of coordinates $(p, q)$, skipping unreduced fractions. Alternatively, the injective mapping of $p/q \to (p, q)$ proves $|\mathbb{Q}^+| \leq |\mathbb{Z}^+ \times \mathbb{Z}^+|$, establishing $|\mathbb{Q}^+| = \aleph_0$.
    
- **Finite Strings:** The set of finite strings over a finite alphabet is countable by organizing them by length, then ordering them lexicographically.
    
- **Java Programs:** Valid programs can be sequentially listed from the countable set of all string permutations and verified by a compiler, proving the set of all Java programs is countable.
    

---

## 4. Uncountable Sets & Cantor's Diagonalization

- **Definition:** A set that is not countable (cannot be put into a bijection with $\mathbb{Z}^+$) is uncountable.


- **Cantor's Diagonalization Argument: A Proof of Uncountability**

	Cantor's Diagonalization Argument is an elegant proof by contradiction used to demonstrate that the set of real numbers is uncountably infinite ($\aleph_1$). It proves that it is mathematically impossible to arrange all real numbers into a sequential, one-to-one correspondence with the positive integers.

**Proof Steps:**

1. **The Assumption (For Contradiction):** Assume that the set of real numbers in the interval $(0, 1)$ is countable. If true, we could theoretically arrange all of them into a complete, infinite list indexed by positive integers: $r_1, r_2, r_3, \dots$
    
2. **Decimal Representation:** Express each number on this purportedly complete list in its decimal form, creating an infinite matrix of digits:
    
    $$r_1 = 0.\mathbf{d_{11}}d_{12}d_{13}d_{14}\dots$$
    
    $$r_2 = 0.d_{21}\mathbf{d_{22}}d_{23}d_{24}\dots$$
    
    $$r_3 = 0.d_{31}d_{32}\mathbf{d_{33}}d_{34}\dots$$
    
    _(where $d_{ij}$ represents the $j$-th decimal digit of the $i$-th number)_
    
3. **Constructing the Exception:** We now construct a entirely new real number, $x = 0.x_1x_2x_3\dots$, by systematically altering the digits along the main diagonal ($d_{ii}$) of the matrix above. We define a simple rule to ensure $x_i \neq d_{ii}$:
    
    - Let $x_i = 4$ if $d_{ii} = 3$
        
    - Let $x_i = 3$ if $d_{ii} \neq 3$
        
4. **The Contradiction:** We must evaluate if this new number $x$ exists anywhere on our original list.
    
    - $x \neq r_1$ because their 1st decimal digits differ ($x_1 \neq d_{11}$).
        
    - $x \neq r_2$ because their 2nd decimal digits differ ($x_2 \neq d_{22}$).
        
    - Generically, $x \neq r_n$ because their $n$-th decimal digits differ ($x_n \neq d_{nn}$).
        
5. **Conclusion:** The constructed number $x$ is a valid real number in $(0, 1)$, yet it is guaranteed to be missing from the list. This completely shatters the initial assumption that a complete list could be formed. Therefore, the set of real numbers in $(0, 1)$ is uncountable.


- **The Interval $(0, 1)$:** Proven uncountable by assuming a complete list of decimal expansions $r_1, r_2 \dots$ exists, then constructing a new number $x$ where the $i$-th decimal digit is purposely altered from the $i$-th digit of $r_i$. Because $x$ is not on the list, the set is uncountable.
    
- **The Interval $[0, 1]$:** Shares the same cardinality as $(0, 1)$. This is proven using the bijection $g(x) = x/2 + 1/4$ to map into $(1/4, 3/4)$, followed by applying the Schröder-Bernstein Theorem.
    
- **All Real Numbers ($\mathbb{R}$):** The set of real numbers has the same cardinality as $(0, 1)$, denoted as $\aleph_1$. The function $f(x) = \tan(x)$ serves as the bijection from $(-\pi/2, \pi/2)$ to $\mathbb{R}$.
    

---

## 5. Fundamental Theorems

- **Schröder-Bernstein Theorem:** If $|A| \leq |B|$ and $|B| \leq |A|$, then $|A| = |B|$. If there are one-to-one functions in both directions, a one-to-one correspondence exists.
    
- **Power Set Theorem:** The cardinality of the power set of any arbitrary set strictly exceeds the cardinality of the original set.
    
- **The Continuum Hypothesis (CH):** Asserts there is no cardinal number $a$ that exists strictly between the countable infinity and the continuum: $\aleph_0 < a < \aleph_1$.
    

---

## 6. Hilbert's Grand Hotel (Thought Experiment)

- **Scenario:** A theoretical hotel with a countably infinite number of rooms is completely full.
    
- **The Solution for New Arrivals:** To accommodate a new guest, the manager moves the guest in room $n$ to room $n+1$, freeing room 1.
    
- **Implication:** This paradox illustrates the counterintuitive arithmetic of countably infinite sets (e.g., $\aleph_0 + 1 = \aleph_0$). By extending the logic, the hotel can even absorb a countably infinite number of new buses, each carrying a countably infinite number of guests ($\aleph_0 + \aleph_0 = \aleph_0$).
    

---

## 7. Computability

- **Computability:** A function is computable if a computer program can evaluate it. Because the set of all Java programs is countable ($\aleph_0$), but the set of all functions mapping $\mathbb{Z}^+$ to $\mathbb{Z}^+$ is uncountable, the number of possible functions strictly exceeds the number of programs. Therefore, uncomputable functions mathematically must exist.