![[merge_sort(wk).png| 翁恺2025程算授课PPT]]
- 图片来源与翁恺2025程算授课课件

#### Core idea

1. **Divide**  
    Split the array into two halves.

2. **Conquer**  
    Recursively sort the left half and the right half.

3. **Combine**  
    Merge the two sorted halves into one sorted array.

#### Implementation

- **recursion (Top-Down)**

```c
#difine MAX_N 10000
int tmp[MAX_N];

void Merge(int arr[],int tmp[], int low,int m,int high){
    int i=low, j=m+1;
    for(int k = low; k <= high; k++){
        if(i <= m && (j > high || arr[i] <= arr[j])){
            tmp[k] = arr[i++];
        }else{
            tmp[k] = arr[j++];
        }
    }
    for(int k = low; k <= high; k++){
        arr[k] = tmp[k];
    }
}

void merge_sort(int arr[], int low, int high) {
    if(low < high){
	    int mid = (low + high) / 2;
	    merge_sort(arr, low, mid);
	    merge_sort(arr, mid+1, high);
	    Merge(arr, tmp, low, mid, high);
    }
}
```

#### Complexity Analysis

- the length of the array each time we process:
```text
1 → 2 → 4 → 8 → … → n
```

- **iteration (Bottom-Up)**
```c
void merge_sort(int arr[], int n) {
    int sz;
    for (sz = 1; sz < n; sz *= 2) {       // 每次子区间大小翻倍
        int i;
        for (i = 0; i + sz < n; i += 2*sz) {  // 每次合并两个大小为 sz 的区间
            int mid = i + sz;
            int right = (i + 2*sz < n) ? i + 2*sz : n;
            merge(arr, i, mid, right);   // 使用你之前的 merge 函数
        }
    }
}
```

**Time complexity**
- the outer loop executes `log(2)n` times
- the inner loop iterate through the entire array`(n)` each time
- the final time complexity is `nlogn`

**Space complexity**
- recursion depth O(log n)
- temp -> O(n)
- final space complexity:
	`O(n) + O(logn) = O(n)`