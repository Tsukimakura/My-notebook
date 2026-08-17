## 1. Preliminaries

This chapter focuses on **Comparison-based sorting** algorithms. The standard prototype for a sorting function is:

`void X_Sort(ElementType A[], int N)`

**Core Assumptions & Constraints:**

- **Data Type:** Assuming an integer array for simplicity. $N$ must be a legal integer.
    
- **Operations Allowed:** The algorithms are strictly comparison-based. The `<` and `>` operators exist and are the _only_ operations allowed on the input data.
    
- **Memory Scope:** We only consider **internal sorting**, meaning the entire sorting process can be executed within the main memory.
    

## 2. Insertion Sort

Insertion sort builds the final sorted array one item at a time, conceptually similar to sorting a hand of playing cards.

### Algorithm Implementation (C)

```c
void InsertionSort ( ElementType A[], int N )
{
    int j, P;
    ElementType Tmp;
    for ( P = 1; P < N; P++ ) {
        Tmp = A[ P ]; /* the next coming card */
        for ( j = P; j > 0 && A[ j - 1 ] > Tmp; j-- )
            A[ j ] = A[ j - 1 ]; 
            /* shift sorted cards to provide a position for the new coming card */
        A[ j ] = Tmp; /* place the new card at the proper position */
    } /* end for-P-loop */
}
```

### Complexity Analysis

- **Worst Case:** The input array is in reverse order.
    
    - Time Complexity: $T(N) = O(N^2)$
        
- **Best Case:** The input array is already strictly sorted.
    
    - Time Complexity: $T(N) = O(N)$
        

## 3. Inversions and Lower Bounds for Simple Sorting

To understand the theoretical limits of simple sorting algorithms, we introduce the concept of "inversions".

### 1. Inversions

- **Definition:** An **inversion** in an array of numbers is any ordered pair $(i, j)$ having the property that $i < j$ but $A[i] > A[j]$.
    
- **Example:** The input list `[34, 8, 64, 51, 32, 21]` has **9** inversions:
    
    `(34, 8), (34, 32), (34, 21), (64, 51), (64, 32), (64, 21), (51, 32), (51, 21), (32, 21)`
    

**Key Insight on Insertion Sort:** Swapping two adjacent elements that are out of place removes **exactly one** inversion. Therefore, sorting the example list using Insertion Sort requires exactly 9 swaps.

- The exact time complexity relative to inversions is **$T(N, I) = O(I + N)$**, where $I$ is the number of inversions in the original array.
    
- **Conclusion:** Insertion sort is highly efficient if the list is **almost sorted** (where $I$ is very small).
    

### 2. Theorems on Lower Bounds

- **Theorem 1:** The average number of inversions in an array of $N$ distinct numbers is **$N(N - 1) / 4$**.
    
- **Theorem 2:** Any algorithm that sorts by exchanging _adjacent_ elements requires **$\Omega(N^2)$** time on average.
    

### 3. Implications for Optimization

The theorems tell us that any class of algorithms restricted to performing **only adjacent exchanges** will inherently be bound to $O(N^2)$ time.

**How to break the $O(N^2)$ barrier:**

To speed up a comparison-based sorting algorithm, we must eliminate **more than just one inversion per exchange**. This can only be achieved by comparing and swapping elements that are **far apart** rather than strictly adjacent.