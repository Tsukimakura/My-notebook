## 1. Definition

**Time Complexity** quantifies the amount of time an algorithm takes to run as a function of the length of the input.

- It does **not** measure actual seconds (which depend on hardware).
    
- It measures the **number of operations** (growth rate) relative to the input size ($N$).
    

## 2. The Notation: Big O ($O$)

We uses **Big O Notation** to describe the **Worst-Case Scenario** (the upper bound).

## 3. The Hierarchy (Fastest to Slowest)

| Notation                          | Name         | Description                                               | Example                                     |
| --------------------------------- | ------------ | --------------------------------------------------------- | ------------------------------------------- |
| **<br><br>$O(1)$<br><br>**        | Constant     | Instant. No matter how much data, time is the same.       | Accessing arr[5]; Hash Map lookup.          |
| **<br><br>$O(\log ⁡N)$<br><br>**  | Logarithmic  | Cuts the problem in half repeatedly. Very fast.           | Binary Search.                              |
| **<br><br>$O(N)$<br><br>**        | Linear       | Loops through the data once.                              | Finding a max value; Hash Sort.             |
| **<br><br>$O(N\log ⁡N)$<br><br>** | Linearithmic | The standard for efficient sorting.                       | Merge Sort; Quick Sort; Heap Sort.          |
| **<br><br>$O(N^2)$<br><br>**      | Quadratic    | Nested loops (Loop inside a loop). Slow for big data.     | Bubble Sort; Insertion Sort.                |
| **<br><br>$O(2^N)$<br><br>**      | Exponential  | Doubling work with every element. Unusable for large $N$. | Recursive Fibonacci; Brute-force passwords. |

## 4. The Space-Time Trade-off

In computer science, we often trade one resource for another.

- **Hash Sort:** Uses massive space ($O(N)$) or $O(K)$) to achieve blazing fast time ($O(N)$).
    
- **Bubble Sort:** Uses minimal space ($O(1)$) but takes a long time ($O(N^2)$).