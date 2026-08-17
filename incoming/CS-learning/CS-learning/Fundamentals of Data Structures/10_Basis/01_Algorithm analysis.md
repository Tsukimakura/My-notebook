## 1. Programs vs. Algorithms

- **Programs:** 
	
	- Written in a specific programming language
		
	- It does not necessarily have to be finite (e.g. OS)
    
- **Algorithms:** 
	
	- A conceptual process that can be described using various methods, including human languages, flow charts, pseudo-code, or formal programming languages.
    

## 2. What to Analyze

When evaluating algorithmic performance, the analysis primarily revolves around the input size, typically denoted as $N$.

- **Core Complexity Functions:**
    
    - $T_{avg}(N)$: Represents the average-case time complexity as a function of the input size $N$.
        
    - $T_{worst}(N)$: Represents the worst-case time complexity as a function of the input size $N$.
        
    - If an algorithm depends on multiple distinct inputs, these functions will take more than one argument.
        

## 3. Asymptotic Notation

### The Purpose of Asymptotic Notation

When analyzing algorithms, the primary goal of counting steps is not to find an exact number, but to predict the growth in run time as the input size ($N$) changes. This allows us to compare the time complexities of different programs effectively.

- **Focus on Asymptotic Behavior:** We are primarily interested in the asymptotic behavior of a program's time complexity, denoted as $T_p$.

### Formal Definitions ($O, \Omega, \Theta, o$)

Computer scientists use specific mathematical notations to formally define algorithmic bounds.

- **Big-O Notation (Upper Bound):**
	
	- **Definition:** $T(N) = O(f(N))$ if there are positive constants $c$ and $n_0$ such that $T(N) \le c \cdot f(N)$ for all $N \ge n_0$.
	    
    - **Best Practice:** While $2N + 3 = O(N) = O(N^2) = O(2^N)$ are all technically true, we must always choose the _smallest_ valid function $f(N)$ to provide the tightest and most accurate upper bound (e.g., $O(N)$).
        
- **Big-Omega Notation (Lower Bound):** 
	
	- **Definition:** $T(N) = \Omega(g(N))$ if there are positive constants $c$ and $n_0$ such that $T(N) \ge c \cdot g(N)$ for all $N \ge n_0$.
	    
    - **Best Practice:** Similar to Big-O, while $2^N + N^2 = \Omega(2^N) = \Omega(N^2) = \Omega(N) = \Omega(1)$ are all true, we must always choose the _largest_ valid function $g(N)$ to provide the tightest lower bound (e.g., $\Omega(2^N)$).
        
- **Big-Theta Notation (Tight Bound):**
    
    - **Definition:** $T(N) = \Theta(h(N))$ if and only if $T(N) = O(h(N))$ and $T(N) = \Omega(h(N))$. This means the function grows exactly at the rate of $h(N)$.
        
- **Little-o Notation (Strict Upper Bound):**
    
    - **Definition:** $T(N) = o(p(N))$ if $T(N) = O(p(N))$ and $T(N) \neq \Theta(p(N))$. This implies $T(N)$ grows strictly slower than $p(N)$.
        

### Rules of Asymptotic Notation

- **Combining Complexities:** If $T_1(N) = O(f(N))$ and $T_2(N) = O(g(N))$, then:
    
    - **Addition (Sequential operations):** $T_1(N) + T_2(N) = \max(O(f(N)), O(g(N)))$. (drop the lower-order term.)
        
    - **Multiplication (Nested operations):** $T_1(N) * T_2(N) = O(f(N) * g(N))$.
        
- **Polynomials:** If $T(N)$ is a polynomial of degree $k$, then $T(N) = \Theta(N^k)$. All lower-degree terms and constants are ignored.
    
- **Logarithms:** $\log^k N = O(N)$ for any constant $k$. This fundamental rule demonstrates that logarithms grow very slowly compared to linear functions.
    
- **The "Sufficiently Large $N$" Caveat:**  When comparing the complexities of two programs asymptotically, it is crucial to ensure that $N$ is sufficiently large.
    
    - **Example:** Suppose $T_{p1}(N) = 10^6N$ and $T_{p2}(N) = N^2$. Although $\Theta(N^2)$ scales worse and grows faster asymptotically than $\Theta(N)$, program P2 is actually still faster than P1 as long as $N < 10^6$.
        

$$O(1) < O(\log N) < O(N) < O(N \log N) < O(N^2) < O(N^3) < O(2^N) < O(N!)$$

### General Rules for Analyzing Code Constructs

- **For Loops:** The running time of a `for` loop is at most the running time of the statements inside the loop (including tests) times the number of iterations.
    
- **Nested For Loops:** The total running time of a statement located inside a group of nested loops is calculated by taking the running time of the statements and multiplying it by the product of the sizes of all the `for` loops.
    
- **Consecutive Statements:** When analyzing consecutive statements, their individual running times simply add together. Because we use asymptotic notation, this effectively means that the maximum running time among the statements is the one that counts for the overall block.
    
- **If / Else Statements:** For a conditional code fragment formatted as `if ( Condition ) S1; else S2;`, the running time is never more than the running time of the condition test plus the larger of the running times between `S1` and `S2`.

**Case Study: The Fibonacci Sequence**

```c
long int Fib(int N)
{
	if(N <= 1)
		return 1;
	else
		return Fib(N-1) + Fib(N-2);
}
```

- **Definition:** The sequence is mathematically defined as $Fib(0) = Fib(1) = 1$, and $Fib(n) = Fib(n-1) + Fib(n-2)$.
    
- **Code Analysis:** In a standard recursive implementation, the base case `if ( N <= 1 ) return 1;` executes in constant time, or $O(1)$.
    
- The recursive step `return Fib( N - 1 ) + Fib( N - 2 );` consists of an $O(1)$ addition operation combined with the time required for the two recursive calls, denoted as $T(N-1)$ and $T(N-2)$.
    
- **Time Complexity Evaluation:**
    
    - The total running time can be expressed as $T(N) = T(N-1) + T(N-2) + 2$, which means the running time is $\ge Fib(N)$.
        
    - Using proof by induction, it is established that $(\frac{3}{2})^N \le Fib(N) \le (\frac{5}{3})^N$.

## 4. Comparing Algorithms: The Maximum Subsequence Sum Problem

- **The Problem:** Given a sequence of (possibly negative) integers $A_1, A_2, \dots, A_N$, find the maximum value of the sum $\sum_{k=i}^j A_k$.
    

**Algorithm 1: Brute Force**

$T(N) = O(N^3)$.
 

**Algorithm 2: Optimized Brute Force**

$T(N) = O(N^2)$.


**Algorithm 3: Divide and Conquer**

- This recursive approach splits the array into two halves: a left side and a right side. 
	
* The maximum subsequence must either lie entirely in the left half, entirely in the right half, or span across the middle boundary.
    
- **Complexity Proof:** 

	* The recursive running time can be expressed as $T(N) = 2T(N/2) + cN$, with a base case of $T(1) = O(1)$.
	    
    - By expanding the recurrence relation: $2[2T(N/2^2) + cN/2] + cN$.
        
    - This simplifies to $2^k O(1) + ckN$, where $N/2^k = 1$.
        
    - **Result:** The time complexity is linearithmic: $T(N) = O(N \log N)$.
        

**Algorithm 4: On-line Algorithm**


```c
int MaxSubsequenceSum( const int  A[ ],  int  N ) 
{ 
	int  ThisSum, MaxSum, j; 
 	ThisSum = MaxSum = 0; 
 	for ( j = 0; j < N; j++ ) { 
 	      ThisSum += A[ j ]; 
 	      if  ( ThisSum > MaxSum ) 
 		MaxSum = ThisSum; 
 	      else if ( ThisSum < 0 ) 
 		ThisSum = 0;
	}
 	return MaxSum; 
} 
```

- This is the most efficient approach, utilizing a single `for` loop to keep a running total (`ThisSum`).
    
- If `ThisSum` drops below zero, it is impossible for it to contribute to a maximum contiguous sum, so `ThisSum` is reset to $0$.
    
- **Key Characteristics:** 

	* The array `A[]` is scanned only once.
    
    - At any point in time, the algorithm can correctly give an answer to the subsequence problem for the data it has already read.
        
- **Complexity:** The time complexity is strictly linear: $T(N) = O(N)$.
    

## 5. Checking the Analysis

- **Method 1: Empirical Ratio Test**
    
    - Observe how the running time $T(N)$ changes when the input size is doubled to $T(2N)$.
        
    - When $T(N) = O(N)$, check if $T(2N) / T(N) \approx 2$.
        
    - When $T(N) = O(N^2)$, check if $T(2N) / T(N) \approx 4$.
        
    - When $T(N) = O(N^3)$, check if $T(2N) / T(N) \approx 8$.
        
- **Method 2: Mathematical Limit Test**
    
    - When asserting that $T(N) = O(f(N))$, you can verify the asymptotic bound by taking the limit to infinity.
        
    - Check if the limit $\lim_{N \to \infty} \frac{T(N)}{f(N)} \approx \text{Constant}$.
        
