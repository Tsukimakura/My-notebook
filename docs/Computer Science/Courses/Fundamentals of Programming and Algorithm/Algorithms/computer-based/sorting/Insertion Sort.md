#### Key idea
Insertion sort works like sorting **playing cards in your hand**:

1. You take one card at a time.
    
2. Insert it into the correct position among already sorted cards.
    

#### Process for an array:

- Treat `arr[0]` as sorted.
    
- Take `arr[1]`, insert it into the sorted part.
    
- Take `arr[2]`, insert it into the sorted part.
    
- …
    
- After `n-1` insertions, the entire array is sorted.
    

#### Complexity

- **Worst/Average:** O(n²)
   
- **Space:** O(1)

#### Implementation

- recursion

```c
void insertion(int arr[], int n, int key){
	int i;
	for(i = n-1; i > 0; i--){
		if(arr[i-1] > k){
			arr[i] = arr[i-1];
		}else{
			break;
		}
	}
	arr[i] = key;
}

void sort(int arr[], int n){
	if(n > 0){
		sort(arr, n-1);
		int k = a[n-1];
		insertion(arr, n, k);
	}
}
```

- iteration

```c
void insertion(int arr[], int n, int key){
	int i;
	for(i = n-1; i > 0; i--){
		if(arr[i-1] > k){
			arr[i] = arr[i-1];
		}else{
			break;
		}
	}
	arr[i] = key;
}

void sort(int arr[], int n){
	for(int i = 1; i < n; i++){
		int k = a[i];
		insertion(arr, i+1, k);
	}
}
```