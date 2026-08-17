# Shell Sort

> Shellsort (invented by Donald Shell) improves upon Insertion Sort by comparing elements that are distant, rather than strictly adjacent.

## 1. Core Concepts

- **Increment Sequence:** The algorithm defines an increment sequence $h_1 < h_2 < ... < h_t$ (where $h_1 = 1$).
    
- **Phase Execution:** It performs an $h_k$-sort at each phase for $k = t, t-1, ..., 1$.
    
- **Key Property:** An $h_k$-sorted file that is subsequently $h_{k-1}$-sorted **remains** $h_k$-sorted. This guarantees that earlier work is not undone by later phases.
    

## 2. Shell's Increment Sequence

The original sequence proposed by Shell:

$h_t = \lfloor N/2 \rfloor, h_k = \lfloor h_{k+1}/2 \rfloor$

**Implementation (C):**

```c
void Shellsort( ElementType A[], int N ) 
{
    int i, j, Increment;
    ElementType Tmp;
    for ( Increment = N / 2; Increment > 0; Increment /= 2 ) { /* h sequence */
        for ( i = Increment; i < N; i++ ) { /* insertion sort */
            Tmp = A[ i ];
            for ( j = i; j >= Increment; j -= Increment ) {
                if( Tmp < A[ j - Increment ] )
                    A[ j ] = A[ j - Increment ];
                else
                    break;
            }
            A[ j ] = Tmp;
        } 
    } /* end for-i and for-Increment loops */
}
```

**Worst-Case Analysis for Shell's Sequence:**

- **Theorem:** The worst-case running time of Shellsort using Shell's increments is **$\Theta(N^2)$**.
    
- **Reasoning:** Pairs of increments in Shell's sequence are not necessarily relatively prime. Consequently, smaller increments may have little to no effect until the very end, leading to highly inefficient sorting in bad cases.
    

## 3. Improved Increment Sequences

To break the $\Theta(N^2)$ barrier, sequences with no common factors are used.

- **Hibbard’s Increment Sequence:** $h_k = 2^k - 1$
    
    - Consecutive increments have no common factors.
        
    - **Theorem (Worst-case):** $\Theta(N^{3/2})$
        
    - **Conjecture (Average):** $T_{avg}(N) = O(N^{5/4})$
        
- **Sedgewick’s Best Sequence:** $\{1, 5, 19, 41, 109, ...\}$
    
    - Terms follow the form $9 \times 4^i - 9 \times 2^i + 1$ or $4^i - 3 \times 2^i + 1$.
        
    - **Worst-case:** $T_{worst}(N) = O(N^{4/3})$
        
    - **Average:** $T_{avg}(N) = O(N^{7/6})$
        

> **Note:** Shellsort is a very simple algorithm with extremely complex analysis. It is highly practical for moderately large inputs (tens of thousands of elements).

---

# Heapsort

Heapsort utilizes the Binary Heap data structure to sort elements in $O(N \log N)$ time.

## 1. Naive Approach (Algorithm 1)

1. `BuildHeap(H)` $\to O(N)$
    
2. Loop $N$ times: `TmpH[i] = DeleteMin(H)` $\to O(\log N)$
    
3. Loop $N$ times: `H[i] = TmpH[i]` $\to O(1)$
    

- **Total Time:** $O(N \log N)$
    
- **Drawback:** The space requirement is doubled because it requires a temporary array (`TmpH`).
    

## 2. In-Place Approach (Algorithm 2)

To avoid using $O(N)$ extra space, we use a **Max-Heap**. Instead of storing deleted maximums in a new array, we swap them to the back of the current array as the heap shrinks.

**Implementation (C):**

```c
void Heapsort( ElementType A[], int N ) 
{
    int i;
    for ( i = N / 2; i >= 0; i-- )  /* BuildHeap */
        PercDown( A, i, N );
    for ( i = N - 1; i > 0; i-- ) { /* DeleteMax phase */
        Swap( &A[ 0 ], &A[ i ] );   /* Move max to the end */
        PercDown( A, 0, i );        /* Restore heap property */
    }
}
```

- **Theorem:** The average number of comparisons used to Heapsort a random permutation of $N$ distinct items is $2N \log N - O(N \log \log N)$.
    
- **Practical Note:** Although Heapsort gives the best theoretical average and worst-case time bounds ($O(N \log N)$) without extra space, in practice, it is slower than a version of Shellsort that uses Sedgewick’s increment sequence.
    

---

# Mergesort

Mergesort is a classic Divide and Conquer algorithm based on the concept of merging two already sorted lists.

## 1. Merging Concept

Merging two sorted lists takes linear time, $T(N) = O(N)$, where $N$ is the total number of elements. It uses pointers for the left half, right half, and a temporary output array.

## 2. Mergesort Implementation

The algorithm recursively halves the array, sorts the halves, and merges them.

> **Important Space Consideration:** If the temporary array (`TmpArray`) is declared locally _inside_ each recursive call to `Merge`, the space complexity degrades to $S(N) = O(N \log N)$. To maintain $O(N)$ extra space, `TmpArray` must be declared once and passed down.

**Implementation (C):**

```c
void MSort( ElementType A[], ElementType TmpArray[], int Left, int Right ) 
{
    int Center;
    if ( Left < Right ) { /* if there are elements to be sorted */
        Center = ( Left + Right ) / 2;
        MSort( A, TmpArray, Left, Center );             /* T( N / 2 ) */
        MSort( A, TmpArray, Center + 1, Right );        /* T( N / 2 ) */
        Merge( A, TmpArray, Left, Center + 1, Right );  /* O( N ) */
    }
}

/* Lpos = start of left half, Rpos = start of right half */
void Merge( ElementType A[], ElementType TmpArray[], int Lpos, int Rpos, int RightEnd ) 
{
    int i, LeftEnd, NumElements, TmpPos;
    LeftEnd = Rpos - 1;
    TmpPos = Lpos;
    NumElements = RightEnd - Lpos + 1;
    
    while( Lpos <= LeftEnd && Rpos <= RightEnd ) /* main loop */
        if ( A[ Lpos ] <= A[ Rpos ] )
            TmpArray[ TmpPos++ ] = A[ Lpos++ ];
        else
            TmpArray[ TmpPos++ ] = A[ Rpos++ ];
            
    while( Lpos <= LeftEnd ) /* Copy rest of first half */
        TmpArray[ TmpPos++ ] = A[ Lpos++ ];
        
    while( Rpos <= RightEnd ) /* Copy rest of second half */
        TmpArray[ TmpPos++ ] = A[ Rpos++ ];
        
    for( i = 0; i < NumElements; i++, RightEnd-- ) /* Copy TmpArray back */
        A[ RightEnd ] = TmpArray[ RightEnd ];
}
```

## 3. Complexity Analysis

The recurrence relation for Mergesort is:

- $T(1) = 1$
    
- $T(N) = 2T(N/2) + O(N)$
    

Solving the recurrence:

$T(N) = 2^k T(N/2^k) + k \times O(N)$

$T(N) = N \times T(1) + \log N \times O(N)$

**$T(N) = O(N \log N)$**

## 4. Practical Usage Note

While mathematically optimal in time, Mergesort requires **linear extra memory** ($O(N)$), and copying elements back and forth to a temporary array is slow. Therefore, it is rarely used for internal sorting (sorting in RAM) but is exceptionally useful and standard for **external sorting** (sorting data on disk).