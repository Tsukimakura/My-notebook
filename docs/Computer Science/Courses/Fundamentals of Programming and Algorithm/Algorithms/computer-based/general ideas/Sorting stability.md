## 1. Definition

**Stability** refers to whether an algorithm preserves the **relative order** of elements that have **equal values**.

- **Input:** `[ 2(A), 1, 2(B) ]`
    
- **Stable Sort Result:** `[ 1, 2(A), 2(B) ]` (A stays before B).
    
- **Unstable Sort Result:** `[ 1, 2(B), 2(A) ]` (The order flipped).
    

## 2. Why Does It Matter?

It matters when sorting **objects** with multiple fields, not just simple integers.

**Example: The "Excel" Scenario**  
Imagine a list of Student Objects: {Grade, Name}.  
Original List (Sorted by Name):

1. {80, **Alice**}
    
2. {80, **Bob**}
    

If we now sort by **Grade**:

- **Stable Sort:** Alice remains before Bob (Original name order is kept).
    
- **Unstable Sort:** Bob might jump before Alice. The alphabetical work you did previously is destroyed.
    

## 3. Algorithm Classification

| Category     | Algorithms                                                     | Reason                                                                                               |
| ------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Stable**   | Bubble Sort, Insertion Sort, Merge Sort, Hash (Counting) Sort. | They only swap/move elements when strictly necessary or handle duplicates sequentially.              |
| **Unstable** | Quick Sort, Selection Sort, Heap Sort.                         | They make "long-range" swaps that can jump over duplicate elements, scrambling their original order. |
