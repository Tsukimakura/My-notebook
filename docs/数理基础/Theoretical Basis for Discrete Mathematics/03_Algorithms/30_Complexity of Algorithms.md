# 30_Complexity of Algorithms

## **1. Introduction to Algorithm Complexity**

To evaluate the efficiency of an algorithm based on its input size, we analyze two primary metrics:

- **Time Complexity:** The amount of time (measured in the number of basic operations) required to solve a problem.

- **Space Complexity:** The amount of computer memory required. _(Note: This course focuses strictly on time complexity)._

**Key Principles of Analysis:**

- We estimate time complexity using Big-$O$ and Big-$\Theta$ notations.

- We focus on counting basic operations (e.g., comparisons, additions, multiplications).

- We explicitly ignore "housekeeping" details and implementation specifics (like hardware, software platforms, and specific data structures) because they introduce unnecessary complications.

## **2. Worst-Case vs. Average-Case Complexity**

- **Worst-Case Time Complexity:** Provides an upper bound on the number of operations an algorithm uses to solve a problem of a specific size. This is the primary focus of complexity analysis.

- **Average-Case Time Complexity:** The average number of operations over all possible inputs of a particular size. It is usually much more difficult to determine mathematically than worst-case complexity.

## **3. Complexity Analysis of Common Algorithms**

**A. Searching Algorithms**

- **Finding the Maximum Element:** Counts the number of comparisons (`max < a_i` and `i <= n`). For a sequence of size $n$, exactly $2n - 1$ comparisons are made.

    - Complexity: $\Theta(n)$

- **Linear Search:**

	- _Worst-Case:_ Occurs when the element is not in the list. Requires checking every element and failing, resulting in $2n + 2$ comparisons. Complexity: $\Theta(n)$.

    - _Average-Case:_ Assuming the element is in the list and all positions are equally likely, it requires an average of $n + 2$ comparisons. Complexity: $\Theta(n)$.

- **Binary Search:** At each stage, the size of the search interval is halved. For $n = 2^k$ elements, it takes at most $2\log n + 2$ comparisons.

    - Complexity: $\Theta(\log n)$ _(Significantly more efficient than linear search)._

**B. Sorting Algorithms**

- **Bubble Sort:** Makes $n-1$ passes, with decreasing comparisons per pass. Total comparisons: $\frac{n(n-1)}{2}$.

    - Worst-Case Complexity: $\Theta(n^2)$.

- **Insertion Sort:** Compares elements to insert them into the correct position. Total comparisons: $\frac{n(n-1)}{2} - 1$.

    - Worst-Case Complexity: $\Theta(n^2)$.

**C. Matrix Operations**

- **Standard Matrix Multiplication:** Multiplying two $n \times n$ matrices involves finding $n^2$ entries. Each entry requires $n$ multiplications and $n-1$ additions.

    - Total Operations: $n^3$ multiplications and $n^2(n-1)$ additions. Complexity: $O(n^3)$.

- **Boolean Product:** For $n \times n$ zero-one matrices, calculating the Boolean product requires $n$ ORs and $n$ ANDs per entry.

    - Total Operations: $2n^3$ bit operations. Complexity: $O(n^3)$.

- **Matrix-Chain Multiplication (Optimization):** Matrix multiplication is associative. When multiplying multiple matrices of different dimensions (e.g., $A_1A_2A_3$), the order of operations drastically affects the total number of basic multiplications. Algorithms like Dynamic Programming are used to find the optimal computational order.

## **4. Algorithmic Paradigms**

An algorithmic paradigm is a fundamental strategy or framework used to construct algorithms for various problems.

- **Brute-Force:** Solves problems in the most straightforward manner without optimization tricks. (Examples: Linear search, Bubble sort).

## **5. Terminology for Order of Growth**

When classifying algorithms, the following standard terminology is used (from most efficient to least efficient):

- $\Theta(1)$: Constant complexity

- $\Theta(\log n)$: Logarithmic complexity

- $\Theta(n)$: Linear complexity

- $\Theta(n \log n)$: Linearithmic complexity

- $\Theta(n^b)$: Polynomial complexity

- $\Theta(b^n)$ where $b > 1$: Exponential complexity

- $\Theta(n!)$: Factorial complexity

## **6. Complexity of Problems & P vs. NP**

Problems themselves are classified based on the algorithms available to solve them:

- **Tractable:** A polynomial time algorithm exists to solve the problem. These belong to **Class P**.

- **Intractable:** No polynomial time algorithm exists.

- **Unsolvable:** No algorithm exists to solve the problem at all (e.g., The Halting Problem).

- **Class NP (Nondeterministic Polynomial):** Problems where a proposed solution can be _checked_ for correctness in polynomial time, but no polynomial time algorithm has been found to _solve/find_ the solution.

- **NP-Complete:** A specific subset of NP. If a polynomial time algorithm is ever found for _one_ NP-Complete problem (like Satisfiability), it can be adapted to solve _all_ problems in the NP class in polynomial time.

**The P versus NP Problem:**

- **Core Question:** Does P = NP? (Are there problems whose solutions can be quickly checked, but cannot be quickly solved?)

- **Current Stance:** It is generally believed that P $\neq$ NP, as no one has found a polynomial algorithm for any NP-Complete problem. However, the inability to find one does not mathematically prove it cannot exist. It remains one of the most famous unsolved problems in theoretical computer science.
