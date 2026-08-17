## 1. The Divide-and-Conquer Paradigm

Divide-and-conquer is a foundational algorithm design strategy consisting of three primary steps:

1. **Divide:** Break the original instance of a problem into two or more smaller, similar instances (subproblems).
    
2. **Solve (Conquer recursively):** Solve these smaller instances recursively. If the subproblem size is small enough, solve it straightforwardly.
    
3. **Combine:** Merge the solutions of the smaller instances to form the solution to the original problem.
    

## 2. Divide-and-Conquer Recurrence Relations

When an algorithm employs the divide-and-conquer strategy, its time complexity (number of operations) can be modeled using a specific type of recurrence relation.

If a recursive algorithm divides a problem of size $n$ into $a$ subproblems, each of size $n/b$, and requires $g(n)$ extra operations for the "divide" and "combine" steps, the total number of operations $f(n)$ satisfies the relation:

$$f(n) = af(n/b) + g(n)$$

- **$a$**: The number of recursive subproblems ($a \ge 1$).
    
- **$b$**: The factor by which the problem size is divided ($b > 1$).
    
- **$g(n)$**: The cost of the work done outside the recursive calls (usually expressed as $cn^d$).
    

---

## 3. The Master Theorem

The Master Theorem provides a direct, formulaic way to determine the asymptotic complexity ($Big\text{-}O$) of divide-and-conquer recurrence relations.

**Theorem Statement:** Let $f$ be an increasing function that satisfies the recurrence relation $f(n) = af(n/b) + cn^d$ whenever $n = b^k$, where:

- $a \ge 1$
    
- $b > 1$ (integer)
    
- $c > 0, d \ge 0$ (real numbers)
    

To find the complexity, compare $a$ with $b^d$:

1. **Case 1 (Work dominated by leaves):** If $a > b^d$, then $f(n)$ is $O(n^{\log_b a})$.
    
2. **Case 2 (Work evenly distributed):** If $a = b^d$, then $f(n)$ is $O(n^d \log n)$.
    
3. **Case 3 (Work dominated by the root):** If $a < b^d$, then $f(n)$ is $O(n^d)$.
    

---

## 4. Classic Algorithmic Examples

### A. Binary Search

- **Mechanism:** Searches a sorted list by comparing the target to the middle element, then recursively searching only the relevant half ($n/2$). Requires a constant number of comparisons ($c$) per step.
    
- **Recurrence:** $f(n) = f(n/2) + 2$
    
- **Master Theorem Application:** $a = 1$, $b = 2$, $d = 0$. Since $1 = 2^0$ ($a = b^d$), we are in Case 2.
    
- **Complexity:** $O(\log n)$
    

### B. Merge Sort

- **Mechanism:** Splits a list of size $n$ into two halves of size $n/2$, recursively sorts them, and then merges them using at most $n$ comparisons.
    
- **Recurrence:** $M(n) = 2M(n/2) + n$
    
- **Master Theorem Application:** $a = 2$, $b = 2$, $d = 1$. Since $2 = 2^1$ ($a = b^d$), we are in Case 2.
    
- **Complexity:** $O(n \log n)$
    

### C. Fast Multiplication of Integers (Karatsuba Algorithm)

- **Mechanism:** Multiplies two $n$-bit integers by splitting them into halves. A clever algebraic trick reduces the necessary recursive multiplications from 4 down to 3, requiring $O(n)$ additions/shifts to combine.
    
- **Recurrence:** $f(n) = 3f(n/2) + cn$
    
- **Master Theorem Application:** $a = 3$, $b = 2$, $d = 1$. Since $3 > 2^1$ ($a > b^d$), we are in Case 1.
    
- **Complexity:** $O(n^{\log_2 3}) \approx O(n^{1.58})$
    
- _Note:_ This is a substantial asymptotic improvement over the conventional multiplication algorithm, which requires $O(n^2)$ bit operations.
    
