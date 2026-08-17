## 1. Definition and Core Concepts

An algorithm is **recursive** if it solves a problem by reducing it to an instance of the same problem with a smaller input.

- **Termination Requirement:** For a recursive algorithm to terminate, the problem must eventually be reduced to an initial case (the base case) for which the solution is explicitly known.
    

## 2. Fundamental Recursive Algorithms

**A. Factorial Algorithm ($n!$)**

- **Input:** Nonnegative integer $n$.
    
- **Base Case:** If $n = 0$, return 1.
    
- **Recursive Step:** Return $n \cdot \text{factorial}(n - 1)$.
    

**B. Exponentiation Algorithm ($a^n$)**

- **Input:** Nonzero real number $a$, nonnegative integer $n$.
    
- **Base Case:** If $n = 0$, return 1.
    
- **Recursive Step:** Return $a \cdot \text{power}(a, n - 1)$.
    

**C. Greatest Common Divisor (GCD) Algorithm**

Based on the reduction property: $\gcd(a, b) = \gcd(b \bmod a, a)$ when $a < b$, and $\gcd(0, b) = b$ when $b > 0$.

- **Input:** Nonnegative integers $a, b$ with $a < b$.
    
- **Base Case:** If $a = 0$, return $b$.
    
- **Recursive Step:** Return $\gcd(b \bmod a, a)$.
    

**D. Modular Exponentiation Algorithm ($b^n \bmod m$)**

Utilizes the property: $ab \bmod m = ((a \bmod m)(b \bmod m)) \bmod m$.

- **Input:** Integers $b, n, m$ with $b > 0, m \geq 2, n \geq 0$.
    
- **Base Case:** If $n = 0$, return 1.
    
- **Recursive Step:** 
	
	- If $n$ is even: return $\text{mpower}(b, n/2, m)^2 \bmod m$.
	    
    - If $n$ is odd: return $(\text{mpower}(b, \lfloor n/2 \rfloor, m)^2 \bmod m \cdot b \bmod m) \bmod m$.
        

**E. Binary Search Algorithm**

Searches for an element $x$ in a sorted (increasing) array.

- **Input:** Target $x$, integers $i$ (start index) and $j$ (end index).
    
- **Process:** Calculate midpoint $m = \lfloor(i + j)/2\rfloor$.
    
- **Base Case:** If $x = a_m$, return $m$. If search space is exhausted, return 0.
    
- **Recursive Step:** 
	
	- If $x < a_m$ and $i < m$, search the left half: $\text{binary\_search}(i, m - 1, x)$.
	    
    - If $x > a_m$ and $j > m$, search the right half: $\text{binary\_search}(m + 1, j, x)$.
        

## 3. Proving Recursive Algorithms Correct

Mathematical and strong induction are the primary techniques used to prove that recursive algorithms produce the correct output for all valid inputs.

- **Example Proof: Correctness of Exponentiation ($a^n$)**
    
    - _Basis Step:_ If $n = 0$, the algorithm returns 1, which equals $a^0$.
        
    - _Inductive Step:_ Assume the inductive hypothesis: the algorithm correctly computes $\text{power}(a, k) = a^k$ for an arbitrary $k \geq 0$. We must show it computes $\text{power}(a, k+1)$ correctly. By the recursive definition, the algorithm returns $a \cdot \text{power}(a, k)$. Using the hypothesis, this is $a \cdot a^k = a^{k+1}$.
        

## 4. Merge Sort Algorithm

Merge Sort is a classic divide-and-conquer algorithm that works by recursively splitting a list into single-element sublists and then successively merging them back into a fully sorted list.

**A. Algorithm Structure:**

1. **Split:** Recursively divide the list $L$ into two halves ($L_1$ and $L_2$) until each sublist has only one element.
    
2. **Merge:** Use a `merge` subroutine to combine two sorted sublists into a single sorted list.
    

**B. The `Merge` Subroutine Complexity:**

- To merge two sorted lists of lengths $m$ and $n$, the algorithm repeatedly compares the smallest elements of each list and removes the smaller one to append to the result.
    
- **Maximum Comparisons:** Two sorted lists of sizes $m$ and $n$ can be merged using no more than **$m + n - 1$** comparisons.
    

**C. Overall Complexity of Merge Sort ($O(n \log n)$):**

Assume the number of elements is $n = 2^m$ (meaning the binary tree of splits has $m = \log n$ levels).

- At level $k$ (where $k = m, m-1, \dots, 1$), there are $2^{m-k}$ lists being merged into $2^{m-k}$ lists of double the size.
    
- Summing the maximum number of comparisons across all levels yields:
    
    $$\sum_{k=1}^{m} 2^{k-1}(2^{m-k+1} - 1) = \sum_{k=1}^{m} 2^m - \sum_{k=1}^{m} 2^{k-1} = m 2^m - (2^m - 1) = n \log n - n + 1$$
    
- This establishes that Merge Sort achieves **$O(n \log n)$** time complexity, which is the best possible asymptotic upper bound for comparison-based sorting algorithms.
    

## 5. Recursion vs. Iteration

For every recursive algorithm, there is an equivalent iterative algorithm. Choosing between them involves a trade-off:

- **Recursive Algorithms:** Typically shorter, more elegant, and easier to read, write, and understand mathematically.
    
- **Iterative Algorithms:** Usually more efficient in terms of computational time and memory space, as they avoid the overhead of repeated function calls and call-stack memory allocation.
    
    - _Example:_ Computing Fibonacci numbers recursively yields an exponential time complexity due to massively redundant calculations ($f_n = f_{n-1} + f_{n-2}$). The iterative equivalent computes it in linear $O(n)$ time by storing the two most recent values.