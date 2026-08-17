## 1. The Binomial Theorem

A binomial expression is the sum of two terms (e.g., $x + y$). The Binomial Theorem provides a general formula for expanding $(x + y)^n$.

**The Binomial Theorem:**

Let $x$ and $y$ be variables, and $n$ be a nonnegative integer. Then:

$$(x+y)^n = \sum_{j=0}^{n} \binom{n}{j} x^{n-j}y^j = \binom{n}{0}x^n + \binom{n}{1}x^{n-1}y + \dots + \binom{n}{n-1}xy^{n-1} + \binom{n}{n}y^n$$

- **Combinatorial Proof:** In the expansion of $(x + y)^n = (x+y)(x+y)\dots(x+y)$, the terms are of the form $x^{n-j}y^j$ for $j = 0, 1, \dots, n$. To form the term $x^{n-j}y^j$, we must choose exactly $n-j$ factors of $x$ from the $n$ available sums (which means we simultaneously choose $j$ factors of $y$). The number of ways to make this choice is $\binom{n}{n-j}$, which is equivalent to $\binom{n}{j}$.
    

**Application Example:**

- _Question:_ What is the coefficient of $x^{12}y^{13}$ in the expansion of $(2x - 3y)^{25}$?
    
- _Solution:_ Rewrite as $(2x + (-3y))^{25}$. Applying the Binomial Theorem, the general term is $\binom{25}{j} (2x)^{25-j}(-3y)^j$. For $x^{12}y^{13}$, we set $j = 13$.
    
    $$\binom{25}{13} (2x)^{12}(-3y)^{13} = \binom{25}{13} 2^{12} (-3)^{13} x^{12} y^{13}$$
    
    The coefficient is: $-\frac{25!}{13!12!} 2^{12} 3^{13}$.
    

---

## 2. Fundamental Binomial Identities

By substituting specific values for $x$ and $y$ into the Binomial Theorem, or by using combinatorial reasoning, we can derive several key identities.

### Identity 1: Sum of Binomial Coefficients

For any integer $n \ge 0$:

$$\sum_{k=0}^{n} \binom{n}{k} = 2^n$$

- **Algebraic Proof:** Apply the Binomial Theorem with $x = 1$ and $y = 1$. $(1+1)^n = \sum_{k=0}^{n} \binom{n}{k} 1^k 1^{n-k}$.
    
- **Combinatorial Proof:** A set with $n$ elements has $2^n$ total subsets. Alternatively, we can count subsets by size: there are $\binom{n}{0}$ subsets of size 0, $\binom{n}{1}$ of size 1, up to $\binom{n}{n}$ of size $n$. Summing these gives the total number of subsets.
    

### Identity 2: Alternating Sum of Binomial Coefficients

Let $n$ be a positive integer. Then:

$$\sum_{k=0}^{n} (-1)^k \binom{n}{k} = 0$$

- **Proof:** Apply the Binomial Theorem with $x = 1$ and $y = -1$. $(1 + (-1))^n = 0^n = 0$.
    
- **Remark:** This implies that $\binom{n}{0} + \binom{n}{2} + \binom{n}{4} + \dots = \binom{n}{1} + \binom{n}{3} + \binom{n}{5} + \dots$. In combinatorial terms, a finite set has an equal number of subsets with an even number of elements and subsets with an odd number of elements.
    

---

## 3. Pascal's Identity and Triangle

**Pascal's Identity:**

If $n$ and $k$ are integers with $n \ge k \ge 0$, then:

$$\binom{n+1}{k} = \binom{n}{k-1} + \binom{n}{k}$$

- **Combinatorial Proof:** Let $T$ be a set where $|T| = n + 1$. Choose a specific element $a \in T$, and let $S = T - \{a\}$. The total number of $k$-element subsets of $T$ is $\binom{n+1}{k}$. These subsets can be partitioned into two mutually exclusive groups:
    
    1. Subsets that **contain** $a$: We must choose $k-1$ additional elements from the remaining $n$ elements in $S$. There are $\binom{n}{k-1}$ such subsets.
        
    2. Subsets that **do not contain** $a$: We must choose all $k$ elements from the $n$ elements in $S$. There are $\binom{n}{k}$ such subsets.
        
        Adding these two cases yields the identity.
        

**Pascal's Triangle:**

This identity forms the geometric basis for Pascal's Triangle, where the $n$-th row consists of the coefficients $\binom{n}{k}$. Pascal's identity dictates that adding two adjacent binomial coefficients in one row yields the binomial coefficient directly between them in the next row below.

---

## 4. Advanced Identities

### Theorem 3: Vandermonde's Identity

Let $m, n,$ and $r$ be nonnegative integers with $r$ not exceeding either $m$ or $n$. Then:

$$\binom{m+n}{r} = \sum_{k=0}^{r} \binom{m}{r-k}\binom{n}{k}$$

- **Combinatorial Proof:** Let $A$ and $B$ be disjoint sets with $|A| = m$ and $|B| = n$. The left-hand side, $\binom{m+n}{r}$, represents the number of ways to pick $r$ elements from $A \cup B$. Alternatively, to pick $r$ elements, we can choose $r-k$ elements from $A$ and $k$ elements from $B$ (where $0 \le k \le r$). By the product rule, this can be done in $\binom{m}{r-k}\binom{n}{k}$ ways for a specific $k$. Summing over all possible values of $k$ gives the total number of ways.
    

### Corollary 4: Sum of Squares of Binomial Coefficients

If $n$ is a nonnegative integer:

$$\binom{2n}{n} = \sum_{k=0}^{n} \binom{n}{k}^2$$

- **Proof:** This is directly derived from Vandermonde's Identity by setting $m = r = n$. This gives $\sum_{k=0}^{n} \binom{n}{n-k}\binom{n}{k}$. Since $\binom{n}{n-k} = \binom{n}{k}$ (by symmetry of combinations), the term becomes $\binom{n}{k}^2$.
    

### Theorem 4

Let $n$ and $r$ be nonnegative integers with $r \le n$. Then:

$$\binom{n+1}{r+1} = \sum_{j=r}^{n} \binom{j}{r}$$

- **Combinatorial Proof:** The left-hand side counts the number of bit strings of length $n+1$ containing exactly $r+1$ ones. We can partition these strings based on the position of the _final_ (i.e., the $(r+1)$-th) '1'. If the final '1' is at position $j+1$, then the preceding $j$ bits must contain exactly $r$ ones. This can happen in $\binom{j}{r}$ ways. Summing over all valid positions for the final '1' yields the identity.