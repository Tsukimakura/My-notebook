#### Key idea
Selection sort repeatedly finds the minimum element from the unsorted portion and places it at the front. (Vice versa)

For an array of size `n`:

1. Find the **smallest** element in the entire array → put it in position 0
    
2. Find the **second smallest** element → put it in position 1
    
3. ...
    
4. Repeat until the array is sorted
    

#### Time complexity

- **O(n²)** comparisons

#### Space Complexity
- **O(1)** extra space

#### Implementation

- recursion

```c
#include <stdio.h>

// Find index of minimum from arr[start .. n-1]
int find_min_index(int arr[], int start, int n) {
    int min_idx = start;
    for (int i = start + 1; i < n; i++) {
        if (arr[i] < arr[min_idx]) {
            min_idx = i;
        }
    }
    return min_idx;
}

// Recursive selection sort
void selection_sort_recursive(int arr[], int start, int n) {
    if (start == n - 1) return; // base case: last element

    int min_idx = find_min_index(arr, start, n);

    // swap arr[start] and arr[min_idx]
    int temp = arr[start];
    arr[start] = arr[min_idx];
    arr[min_idx] = temp;

    // sort the rest
    selection_sort_recursive(arr, start + 1, n);
}
```

- Iteration

```c
void selection_sort_iterative(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;

        // find the minimum in the remaining part
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }

        // swap arr[i] and arr[min_idx]
        int temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;
    }
}
```