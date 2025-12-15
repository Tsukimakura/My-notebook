[[Hashing| About its name]]
## 1. Overview

- **Definition:** An algorithm that sorts elements by using their values as **indices** (keys) in an auxiliary array (Hash Table).
    
- **Type:** Non-comparative sorting algorithm.
    
- **Core Principle:** **Hashing / Direct Addressing**. It maps the value of an element to a specific position in a "frequency array" to count its occurrence.
    

## 2. Key Statistics

- **Time Complexity:** $O(N+K)$
	
        $N$: Number of elements to sort.
        
		$K$: Range of the data (Max−Min).
        
- **Space Complexity:** $O(K)$

    - Requires an auxiliary array of size $K$.

- **Stability:** Stable (if implemented carefully), but the basic version is often unstable.
    

---

## 3. How It Works (Step-by-Step)

1. **Find Boundaries:** Determine the **Maximum** and **Minimum** values in the input array.
    
2. **Calculate Range:** Determine the size of the hash table: `Range = Max - Min + 1`.
    
3. **Allocate Memory:** Create a `HashTable` (or Count Array) of size `Range` and initialize all values to **0**.
    
4. **Hash Mapping (Counting):** Traverse the input array. For every element `val`, increment the count at index `val - Min`.
    - `HashTable[val - Min]++`
    
5. **Reconstruction:** Traverse the `HashTable`. If an index has a non-zero count, write the corresponding value (`Index + Min`) back into the original array.
    
6. **Cleanup:** Free the allocated memory.
    

---

## 4. C Language Implementation

```c
#include <stdio.h>
#include <stdlib.h>

// Function: Hash Sort (Counting Sort)
void hashSort(int arr[], int n) {
    if (n <= 1) return;

    // Step 1: Find Max and Min
    int max = arr[0];
    int min = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }

    // Step 2: Calculate Range
    int range = max - min + 1;

    // Step 3: Allocate Hash Table (Frequency Array)
    // calloc initializes memory to 0 automatically
    int *hashTable = (int *)calloc(range, sizeof(int));
    if (hashTable == NULL) {
        printf("Memory allocation failed.\n");
        return;
    }

    // Step 4: Fill the Hash Table (Mapping)
    // Formula: Index = Value - Min
    for (int i = 0; i < n; i++) {
        hashTable[arr[i] - min]++;
    }

    // Step 5: Reconstruct the Sorted Array
    int index = 0;
    for (int i = 0; i < range; i++) {
        while (hashTable[i] > 0) {
            arr[index++] = i + min; // Restore value: Index + Offset
            hashTable[i]--;
        }
    }

    // Step 6: Free Memory
    free(hashTable);
}

int main() {
    int data[] = {9, -5, 2, 2, 8, -5, 1, 0};
    int n = sizeof(data) / sizeof(data[0]);

    hashSort(data, n);

    printf("Sorted Array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", data[i]);
    }
    // Output: -5 -5 0 1 2 2 8 9 
    return 0;
}
```
- The algorithm given above is unstable.
[[Stable hash sort]]

---

## 5. Critical Concepts

### The "Offset" Strategy (Value - Min)

- **Why?** Array indices in C must be non-negative integers starting from 0.
    
- **Problem:** If the data contains negative numbers (e.g., -5) or starts at a high number (e.g., 1000), we cannot use the value directly as an index.
    
- **Solution:** map the minimum value to index 0.
    
    - Real Value: -5 -> Index: -5 - (-5) = 0
        
    - Real Value: 100 -> Index: 100 - (-5) = 105
        

### Space-Time Tradeoff

- Hash sort sacrifices **Memory (Space)** to gain **Speed (Time)**.
    

---

## 6. Advantages vs. Disadvantages

### Advantages

1. **Linear Time:** It is much faster than Quick Sort ($O(Nlog⁡N)$) when the data range ($K$) is small compared to $N$.
    
2. **Simplicity:** The logic is straightforward (count, then print).
    

### Disadvantages

1. **Range Limitation:** If the range is huge (e.g., sorting {1, 100000000}), it wastes massive amounts of memory.
    
2. **Data Type Restriction:** Mainly works for **Integers**.
    
    - Floating-point numbers (decimals) are difficult to map to indices.
        
    - Strings require complex hashing (Radix Sort).
        
3. **Not In-Place:** Requires extra memory allocation.
    

---

## 7. Summary Table

| Feature            | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| **Best Use Case**  | Dense integers with a small range (e.g., exam scores 0-100). |
| **Worst Use Case** | Sparse data with a massive range (e.g., phone numbers).      |
| **Method**         | Hashing / Counting Frequencies.                              |
| **Comparison**     | No comparisons (Unlike QuickSort or MergeSort).              |
