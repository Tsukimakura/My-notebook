Quick Sort is a classic **divide-and-conquer** sorting algorithm.

#### Basic idea:

1. Choose a pivot (middle element, last element, first element, etc.)

2. Partition the array so that:
    - Left side < pivot
    - Right side ≥ pivot

3. Recursively sort left and right parts

### 1. Lomuto Partition Scheme

#### Key idea (easy to write but slower than Hoare):

- Use the **last element** as pivot.
    
- `i` tracks the boundary of elements < pivot.
    
- Scan with `j`, swap whenever `arr[j] < pivot`.
    
- Finally swap pivot into its final position.
    

#### Lomuto Partition Pseudocode

```c
pivot = arr[r]
i = l
for j = l to r-1:
    if arr[j] < pivot:
        swap(arr[i], arr[j])
        i++
swap(arr[i], arr[r])
return i   // pivot index
```

#### Implementation

```c
#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition_lomuto(int arr[], int l, int r) {
    int pivot = arr[r];
    int i = l;
    for (int j = l; j < r; j++) {
        if (arr[j] < pivot) {
            swap(&arr[i], &arr[j]);
            i++;
        }
    }
    swap(&arr[i], &arr[r]);
    return i;
}

void quicksort_lomuto(int arr[], int l, int r) {
    if (l < r) {
        int p = partition_lomuto(arr, l, r);
        quicksort_lomuto(arr, l, p - 1);
        quicksort_lomuto(arr, p + 1, r);
    }
}
```

- The Lomuto Partiton Scheme's time complexity is $O(N^2)$ in the worst case (when the array is already in order).

### 2. Hoare Partition Scheme
#### Key idea (faster and fewer swaps):

- Choose **first element** as pivot.
    
- Use two pointers:
    
    - `i` moves right until it finds something ≥ pivot
        
    - `j` moves left until it finds something ≤ pivot
        
- Swap `arr[i]` and `arr[j]` until i ≥ j
    
- Return the split point j
    

#### Hoare Partition Pseudocode

```c
pivot = arr[l] 
i = l - 1 
j = r + 1 
loop:
     do i++ while arr[i] < pivot
     do j-- while arr[j] > pivot
     if i >= j return j
     swap(arr[i], arr[j])
```

#### Implementation

```c
// if choose the first element as pivot
int partition_hoare(int arr[], int l, int r) {
	int pivot = arr[l];
    int i = l - 1;
    int j = r + 1;
	while (1) {
	    do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        swap(&arr[i], &arr[j]);
	}
}  
void quicksort_hoare(int arr[], int l, int r) {
     if (l < r) {         
	     int p = partition_hoare(arr, l, r);         
	     quicksort_hoare(arr, l, p);         
	     quicksort_hoare(arr, p + 1, r);     
     } 
}
```


```c
// if choose pivot from the middle
void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition_hoare(int arr[], int l, int r) {

    int pivot = arr[l + (r - l) / 2];
    
    int i = l - 1;
    int j = r + 1;

    while (1) {

        do {
            i++;
        } while (arr[i] < pivot);

        do {
            j--;
        } while (arr[j] > pivot);
        
        if (i >= j)
            return j;
        swap(&arr[i], &arr[j]);
    }
}

void quicksort_hoare(int arr[], int l, int r) {
    if (l < r) {
        int p = partition_hoare(arr, l, r);
        quicksort_hoare(arr, l, p);
        quicksort_hoare(arr, p + 1, r);
    }
}
```

### Important details

1. **The difference of return value and recursive sorting ranges:** Different partitioning scheme should return different variables(i or j). We return i in Lomuto scheme, which is the index of the pivot after swapping. In Hoare scheme, after the whole loop, j is the maximal index of the left range( <= pivot), while i is the minimal index of the right range( >= pivot). So we usually return j and recursively sort (l, p) & (p+1, r), which is respectively the left range and the right range.What's more, since we don't really know where is the pivot in Hoare partition, we can't just recursively sort (l, p-1) & (p+1, r)， where p is the pivot's index, like what Lomuto does.

2. **In Hoare scheme, why do-while, not while: to avoid infinite loop.** 
	if arr = {2, 2}:
	```c
	while (arr[i] < pivot) i++; 
	while (arr[j] > pivot) j--; 
	if (i <= j) { 
		swap(arr[i], arr[j]); 
	}
	```
	i never moves, so does j. They just keep swapping all the time, forming an infinite loop.
	do-while just avoid this case by manipulating i and j first.
	we can also use while and add `i++` and `j--` in `if(i <= j){...}` , but this is apparently not so simple and beautiful as the standard version.

3. **Pros and cons of the two schemes**
	 1. Lomuto Partition Scheme

		- **Mechanism:** **Uni-directional**. Two pointers move from left to right.
    
		- **Pros:**
    
		    - **Pivot Position:** The pivot ends up in its **final sorted position** (great for Quickselect algorithm).
        
		- **Cons:**
    
		    - **Inefficient:** High number of swaps (even if the array is already sorted).
        
		    - **Worst Case:** Degrades to $O(N^2)$ when the array contains **all duplicate elements**.
    
	2. Hoare Partition Scheme

		- **Mechanism:** **Bi-directional**. Two pointers start at ends and move inward.
    
		- **Pros:**
    
		    - **Efficiency:** Performs **3x fewer swaps** on average compared to Lomuto.
        
		    - **Robustness:** Handles **duplicate elements** perfectly (keeps $O(Nlog⁡N)$ by splitting the array in half).
			    - actually if we always choose the first element as pivot, the time complexity also degrade to $O(N^2)$ ,we can choose the pivot from the middle to avoid this case.
        
		- **Cons:**
	
		    - **Pivot Position:** The pivot does **not** necessarily end up in its final sorted position (it just splits the array).
	
	- notice that we can also optimize Lomuto partitioning scheme by choosing pivot from the middle. We just need to swap the elements whose indices are `(l+r)/2` and `r` at first, and then use the identical code. But this can only solve the problem that the time complexity degrades to $O(N^2)$ when the array is already sorted, if the array has too many duplicate elements, it is also a bad choice, and anyway it is always slower than Hoare because of its uni-directional mechanism.