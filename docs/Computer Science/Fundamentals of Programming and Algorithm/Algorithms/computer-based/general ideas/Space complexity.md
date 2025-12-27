## 1. Definition

**Space Complexity** measures the total amount of **memory (RAM)** an algorithm needs to run relative to the input size ($N$).

## 2. Auxiliary Space vs. Total Space

- **Auxiliary Space:** The extra space or temporary space used by the algorithm. (This is usually what we care about).
    
- **Input Space:** The space needed to store the input data itself.
    

## 3. Common Complexity Classes

### A. $O(1)$

 - Constant Space (In-Place)

The algorithm uses a fixed amount of extra memory, regardless of input size.

- **Example:** Bubble Sort, Insertion Sort.
    
- Why: They only need a single temporary variable (temp) to swap numbers.
    

### B. $O(log⁡N)$

 - Logarithmic Space

Often seen in recursive algorithms. The memory is used by the **Call Stack** (function calls waiting to finish).

- **Example:** Quick Sort.
    

### C. $O(N)$

 - Linear Space

The algorithm creates a copy of the data or a mapping structure.

- **Example:** Merge Sort (needs a helper array to merge); Hash Sort (needs a frequency array).
    

## 4. The Space-Time Trade-off

In computer science, we often trade one resource for another.

- **Hash Sort:** Uses massive space ($O(N)$) or $O(K)$) to achieve blazing fast time ($O(N)$).
    
- **Bubble Sort:** Uses minimal space ($O(1)$) but takes a long time ($O(N^2)$).