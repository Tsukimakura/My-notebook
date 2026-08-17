# 14_Quick_Table_Bucket Sort

**Overview:** Quicksort is widely considered the fastest known sorting algorithm in practice. It utilizes a divide-and-conquer strategy.

## 1. The Core Algorithm

The fundamental recursive strategy partitions an array into two disjoint sets around a chosen element (the pivot).

**Algorithm Steps:**

1. **Base Case:** If the array has fewer than 2 elements (`N < 2`), return.

2. **Select Pivot:** Pick an element from the array to act as the pivot.

3. **Partition:** Divide the remaining elements `S = {A[]} \ {pivot}` into two disjoint sets:

    - `A1` $= \{x \in S \mid x \le \text{pivot}\}$

    - `A2` $= \{x \in S \mid x \ge \text{pivot}\}$

4. **Recurse:** Recursively apply Quicksort to `A1` and `A2`.

5. **Key Property:** After partitioning, the pivot is placed in its absolute final sorted position **once and for all**.

**Best Case Time Complexity:** $T(N) = O(N \log N)$

## 2. Picking the Pivot

The choice of the pivot drastically affects the algorithm's performance.

- **A Wrong Way:** `Pivot = A[0]`

    - _Issue:_ If the input is presorted (or reverse sorted), this leads to an extreme partition (1 element vs. $N-1$ elements).

    - _Consequence:_ The worst-case running time becomes **$O(N^2)$** doing nothing useful.

- **A Safe Maneuver:** `Pivot = random select from A[]`

    - _Issue:_ While it avoids the presorted worst-case, random number generation is computationally expensive and adds overhead.

- **The Optimal Way: Median-of-Three Partitioning**

    - `Pivot = median(Left, Center, Right)`

    - _Advantage:_ Eliminates the worst-case scenario for sorted inputs and typically reduces overall running time by about 5%.

## 3. Partitioning Strategy

The standard implementation uses two pointers: `i` scanning from the left, and `j` scanning from the right.

**Handling Duplicate Keys (Elements == Pivot):**

What happens if the array consists of identical elements (e.g., `1, 1, 1, ..., 1`)?

- _Option A (Neither `i` nor `j` stops):_ No swaps occur, but the partition becomes highly uneven (0 elements on one side, $N-1$ on the other). This results in a worst-case **$T(N) = O(N^2)$**.

- _Option B (Both `i` and `j` stop):_ This forces unnecessary "dummy" swaps of identical elements. However, it guarantees that the sequence is partitioned into two **equal-sized** subsequences.

- _Conclusion:_ It is strictly better to **stop both `i` and `j`** and perform extra swaps to maintain balanced partitions, ensuring $T(N) = O(N \log N)$.

## 4. Optimization for Small Arrays

**Problem:** Due to recursive overhead, Quicksort is actually slower than simple algorithms like Insertion Sort for very small arrays ($N \le 20$).

**Solution:** Implement a **Cutoff** threshold (e.g., $N = 10$). When the subarray size drops below this cutoff, stop Quicksort recursion and use Insertion Sort on that subarray.

## 5. C Implementation Details

### A. Median-of-Three Implementation

This function sorts the `Left`, `Center`, and `Right` elements, placing the median in the center, and hides the pivot.

```c
ElementType Median3( ElementType A[], int Left, int Right )
{
    int Center = ( Left + Right ) / 2;

    /* Order Left, Center, and Right */
    if ( A[ Left ] > A[ Center ] )
        Swap( &A[ Left ], &A[ Center ] );
    if ( A[ Left ] > A[ Right ] )
        Swap( &A[ Left ], &A[ Right ] );
    if ( A[ Center ] > A[ Right ] )
        Swap( &A[ Center ], &A[ Right ] );

    /* Invariant: A[ Left ] <= A[ Center ] <= A[ Right ] */

    /* Hide pivot by swapping it with Right - 1 */
    Swap( &A[ Center ], &A[ Right - 1 ] );

    /* Only need to sort A[ Left + 1 ] ... A[ Right - 2 ] */
    return A[ Right - 1 ]; /* Return pivot */
}
```

### B. The Main Recursive Routine (`Qsort`)

```c
void Qsort( ElementType A[], int Left, int Right )
{
    int i, j;
    ElementType Pivot;

    if ( Left + Cutoff <= Right ) { /* if the sequence is long enough */
        Pivot = Median3( A, Left, Right ); /* select pivot */

        /* Initialization for pointers */
        i = Left;
        j = Right - 1;
        /* Note: We initialize to Left and Right-1 because the while loops
           use pre-increment (++i) and pre-decrement (--j). The first checks
           will correctly hit Left+1 and Right-2. */

        for ( ; ; ) {
            while ( A[ ++i ] < Pivot ) {} /* scan from left */
            while ( A[ --j ] > Pivot ) {} /* scan from right */

            if ( i < j )
                Swap( &A[ i ], &A[ j ] ); /* adjust partition */
            else
                break; /* partition done */
        }

        Swap( &A[ i ], &A[ Right - 1 ] ); /* restore pivot to final position */

        Qsort( A, Left, i - 1 );  /* recursively sort left part */
        Qsort( A, i + 1, Right ); /* recursively sort right part */

    } else {
        /* do an insertion sort on the short subarray */
        InsertionSort( A + Left, Right - Left + 1 );
    }
}
```

## 6. Complexity Analysis

The running time of Quicksort is determined by the size of the partitions it creates. Let $i$ be the number of elements in the left partition.

**General Recurrence Equation:**

$$
T(N) = T(i) + T(N - i - 1) + cN
$$

- **The Worst Case:** (Partitions are heavily skewed, e.g., $i = N-1$)

    $$
T(N) = T(N - 1) + cN \implies \mathbf{T(N) = O(N^2)}
    $$

- **The Best Case:** (Partitions are perfectly equal, $i = N/2$)

    $$
T(N) = 2T(N/2) + cN \implies \mathbf{T(N) = O(N \log N)}
    $$

- **The Average Case:**

    Assuming the average value of $T(i)$ for any $i$ is uniformly distributed: $\frac{1}{N} \sum_{j=0}^{N-1} T(j)$.

    $$
T(N) = \frac{2}{N} \left[ \sum_{j=0}^{N-1} T(j) \right] + cN \implies \mathbf{T(N) = O(N \log N)}
    $$

**Extended Application:**

The partitioning logic of Quicksort can be adapted to solve the **Selection Problem**: _Given a list of N elements and an integer k, find the $k$-th largest element_ (commonly known as Quickselect).

---

## 7. Sorting Large Structures (Indirect Sorting)

**The Problem:** During the sorting process, physically swapping large structures (e.g., records with massive data payloads) is computationally expensive and memory-intensive.

**The Solution:** Implement indirect sorting by adding a pointer (or index) field to the structure. Instead of swapping the actual data elements, you swap the pointers or indices. You physically rearrange the structures only at the very end if it is strictly necessary.

- **Table Sort Example:** Maintain a `table` array that tracks the correct sorted order of the elements.

- **Permutation Cycles:** Any permutation can be broken down into a set of disjoint cycles.

- **Time Complexity:** In the worst-case scenario, there are $\lfloor N/2 \rfloor$ cycles, requiring $\lfloor 3N/2 \rfloor$ physical record moves. The overall time complexity for moving the records is $O(m N)$, where $m$ is the size (in bytes) of a single structure.

**Implementation Concept (C):**

```c
/* Instead of swapping large objects, we sort an array of pointers */
void IndirectSort(LargeObject A[], int N)
{
    int* table = malloc(N * sizeof(int));
    for (int i = 0; i < N; i++) {
        table[i] = i; /* Initialize index table */
    }

    /* Sort the table array based on the keys of the actual objects */
    /* (Using a simple insertion sort logic for demonstration) */
    for (int p = 1; p < N; p++) {
        int tmp = table[p];
        int j;
        for (j = p; j > 0 && A[table[j - 1]].key > A[tmp].key; j--) {
            table[j] = table[j - 1];
        }
        table[j] = tmp;
    }

    /* table[] now holds the indices in sorted order.
       Physical rearrangement is optional and done in O(N) using cycles. */
}
```

## 8. A General Lower Bound for Sorting

**Theorem:** Any algorithm that sorts solely by comparisons must have a worst-case computing time of $\Omega(N \log N)$.

**Proof via Decision Tree Model:**

1. **Distinct Outcomes:** When sorting $N$ distinct elements, there are $N!$ different possible permutations (results).

2. **Tree Leaves:** Therefore, any decision tree representing a comparison-based sorting algorithm must have at least $N!$ leaves.

3. **Tree Height:** If the height of this binary decision tree is $k$, the maximum number of leaves it can have is $2^{k-1}$ (assuming a complete binary tree). Thus, $N! \le 2^{k-1}$.

4. **Derivation:** Solving for $k$ gives $k \ge \log_2(N!) + 1$.

5. **Stirling's Approximation (Simplified):** Since $N! \ge (N/2)^{N/2}$, we can deduce that $\log_2(N!) \ge (N/2)\log_2(N/2)$. This evaluates to $\Theta(N \log_2 N)$.

6. **Conclusion:** The minimum number of comparisons (the worst-case time complexity), $T(N) = k$, is strictly bounded by $c \cdot N \log_2 N$.

---

## 9. Linear Time Sorting: Bucket Sort and Radix Sort

For specific types of data, we can bypass the $\Omega(N \log N)$ comparison barrier by using non-comparison-based integer sorting techniques.

### A. Bucket Sort

- **Scenario:** Highly effective when the keys to be sorted fall within a known, tightly constrained range.

- **Example:** Sorting $N$ students based on a grade record from 0 to 100 ($M = 101$ possible distinct grades).

- **Algorithm Logic:** Initialize an array of `count[]` (buckets). Read each student's record and insert it into the list at `count[student.grade]`. Finally, iterate through the `count` array to output the sorted list.

- **Complexity:** $T(N, M) = O(M + N)$.

- **The Limitation:** What happens if $M \gg N$ (e.g., sorting 10 students by their 9-digit social security numbers)? The memory overhead and initialization time for the buckets become severely impractical.

### B. Radix Sort

- **Scenario:** Solves the limitation of Bucket Sort by processing data digit by digit (or key by key). For example, sorting $N = 10$ integers in the range 0 to 999 ($M = 1000$).

- **Lexical Sorting Property:** A list of records $R_0, \dots, R_{n-1}$ is lexically sorted with respect to the keys $K^0, K^1, \dots, K^{r-1}$ if and only if $(K_i^0, K_i^1, \dots, K_i^{r-1}) \le (K_{i+1}^0, K_{i+1}^1, \dots, K_{i+1}^{r-1})$. $K^0$ is the most significant key, and $K^{r-1}$ is the least significant key.

- **Complexity:** $T = O(P(N + B))$, where $P$ is the number of passes (digits/keys), $N$ is the number of elements, and $B$ is the number of buckets per pass (e.g., base 10).

**Implementation (LSD Radix Sort in C):**

```c
int GetMax(int A[], int N) {
    int max = A[0];
    for (int i = 1; i < N; i++)
        if (A[i] > max) max = A[i];
    return max;
}

void RadixSort(int A[], int N) {
    int max = GetMax(A, N);

    /* Do counting sort for every digit. Exp is 10^i */
    for (int exp = 1; max / exp > 0; exp *= 10) {
        int output[N];
        int i, count[10] = {0};

        /* Store count of occurrences in count[] */
        for (i = 0; i < N; i++)
            count[(A[i] / exp) % 10]++;

        /* Change count[i] so that count[i] now contains actual
           position of this digit in output[] */
        for (i = 1; i < 10; i++)
            count[i] += count[i - 1];

        /* Build the output array */
        for (i = N - 1; i >= 0; i--) {
            output[count[(A[i] / exp) % 10] - 1] = A[i];
            count[(A[i] / exp) % 10]--;
        }

        /* Copy the output array to A[], so that A[] now
           contains sorted numbers according to current digit */
        for (i = 0; i < N; i++)
            A[i] = output[i];
    }
}
```

## 10. MSD vs. LSD Radix Sort

When dealing with multiple keys (e.g., sorting a deck of cards by Suit then Face Value), there are two distinct traversal directions.

### A. MSD (Most Significant Digit) Sort

1. **Partition:** Sort on $K^0$ first. For example, create 4 separate buckets for the playing card suits.

2. **Recurse:** Sort each of the 4 buckets completely independently from one another using any sorting technique (or further recursive MSD passes).

### B. LSD (Least Significant Digit) Sort

1. **Sort Last Key First:** Sort on $K^1$ first. Create 13 buckets for the face values.

2. **Merge:** Reform all elements back into a single pile.

3. **Sort Next Key:** Create 4 buckets for the suits ($K^0$) and resort the entire single pile. The stability of the sorting algorithm ensures that the previously sorted face values remain ordered within their respective suit buckets.

### C. Analysis: Is LSD always faster than MSD?

**No, LSD is not strictly always faster.**

- **When LSD Wins:** LSD is generally faster and highly preferred for fixed-length keys (like 32-bit integers). It avoids the massive overhead of recursion and managing hundreds of small, fragmented sub-buckets. It operates iteratively over the whole array.

- **When MSD Wins:** MSD is inherently faster for variable-length keys (like alphabetical strings/words in a dictionary). If an MSD bucket is reduced to only 1 element early in the process, the algorithm can terminate execution for that subset immediately, saving substantial processing time without needing to scan the remaining least significant characters.
