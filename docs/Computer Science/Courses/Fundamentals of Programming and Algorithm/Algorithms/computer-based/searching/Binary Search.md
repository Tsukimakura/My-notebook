####  Key idea

Each time, compare the target with the middle element:

1. If the middle element **equals** the target → found.
    
2. If the target is **smaller** → search the **left half**.
    
3. If the target is **larger** → search the **right half**.
    

This halves the search range every step → **O(log n)** time complexity.

####  Important condition

The array **must be sorted** (ascending or descending).

#### Implementation in C

```c
int binary_search(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2; // avoid overflow

        if (arr[mid] == target) {
            return mid;  // found, return index
        } else if (arr[mid] < target) {
            left = mid + 1;  // search right half
        } else {
            right = mid - 1; // search left half
        }
    }

    return -1; // not found
}
```
