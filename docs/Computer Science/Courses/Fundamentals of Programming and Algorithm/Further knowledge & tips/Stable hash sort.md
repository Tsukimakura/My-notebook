## 1. The Three-Stage Process

To achieve stability, we cannot simply overwrite the original array. We must use a **3-stage pipeline**:

1. **Frequency Count:** Calculate how many times each number appears.
    
2. **Prefix Sum (Accumulation):** Transform counts into **position indices**.
    
    - Formula: `Count[i] = Count[i] + Count[i-1]`
        
    - Meaning: This tells us the **last possible index** where value i can be placed.
        
3. **Reverse Traversal & Map:** Loop through the original array from **tail to head** and place elements into a new **Output Array** based on the Prefix Sum.
    

---

## 2. Deep Dive: Why Prefix Sums?

The Prefix Sum transforms the data from "Quantity" to "Location".

- **Raw Count:** "There are three `5`s."
    
- **Prefix Sum:** "The `5`s occupy indices ending at index 10."
    

**Why Reverse Traversal?**

- Because the Prefix Sum indicates the **last** available slot for a number.
    
- By reading the original array from right to left (end to start), the first instance of a duplicate number we encounter is naturally placed in that "last" slot.
    
- We then decrement the slot index (`count[val]--`), reserving the previous slot for the next instance of that number.
    

---

## 5. C Code Implementation

```c
#include <stdio.h>
#include <stdlib.h>

void stableHashSort(int arr[], int n) {
    if (n <= 1) return;

    // 1. Find Range (Min/Max)
    int max = arr[0], min = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }
    int range = max - min + 1;

    // 2. Allocate Memory
    // 'count': stores prefix sums (O(K) space)
    // 'output': stores sorted result (O(N) space)
    int *count = (int *)calloc(range, sizeof(int));
    int *output = (int *)malloc(n * sizeof(int));

    if (!count || !output) return; // Error handling

    // 3. Frequency Count
    for (int i = 0; i < n; i++) {
        count[arr[i] - min]++;
    }

    // 4. Calculate Prefix Sums (Transform count to position)
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    // 5. Build Output Array (Reverse Traversal)
    // This is the CRITICAL step for stability
    for (int i = n - 1; i >= 0; i--) {
        int val = arr[i];
        int mapIdx = val - min;
        
        // count[mapIdx] - 1 gives the 0-based index
        int targetIdx = count[mapIdx] - 1; 
        
        output[targetIdx] = val;
        
        // Decrement count so the next identical number 
        // goes to the position immediately before this one.
        count[mapIdx]--;
    }

    // 6. Copy back to original array
    for (int i = 0; i < n; i++) {
        arr[i] = output[i];
    }

    // 7. Clean up
    free(count);
    free(output);
}
```

---

## 6. Analysis Summary

### Time Complexity

- **Total:** $O(N+K)$
- $N$: Number of elements.
- $K$: Range of data ($Max−Min$).
        
- It is strictly linear if $K$ is close to $N$.
    

### Space Complexity (The Trade-off)

- **Total:** $O(N+K)$
	
- The unstable version only needed $O(K)$.
        

### When to Use?

- **Stable Version:** When sorting **Structures/Objects** (e.g., Students by Grade) where the original order (Student ID) must be preserved.
    
- **Unstable Version:** When sorting simple **primitives** (integers) and memory is tight.