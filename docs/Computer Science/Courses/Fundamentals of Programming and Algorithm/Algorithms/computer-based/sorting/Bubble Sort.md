Bubble sort repeatedly scans the array, comparing each pair of adjacent elements and swapping them if they are in the wrong order.

#### Process

- Compare `arr[0]` and `arr[1]`, swap if needed
    
- Compare `arr[1]` and `arr[2]`, swap if needed
    
- …
    
- After one full pass, the **largest element moves to the end** (like a bubble rising)
    

Repeat this process `n-1` times.

#### Time complexity

- Worst / average: **O(n²)**

#### Space complexity

- **O(1)**

#### Implementation

- recursion

```c
void sort_bubble(int a[], int size)
{
	if ( size>1 ) {
		for ( int j=0; j<size; j++ ) {
			if ( a[j] > a[j+1] ) {
				int t = a[j];
				a[j] = a[j+1];
				a[j+1] = t;
			}
		}
		sort_bubble(a, size-1);
	}
}
```

- Iteration

```c
void sort_bubble(int a[], int size)
{
	for ( int i=size-1; i>0; i-- ) {
		for ( int j=0; j<i; j++ ) {
			if ( a[j] > a[j+1] ) {
				int t = a[j];
				a[j] = a[j+1];
				a[j+1] = t;
			}
		}
	}
}
```

- optimized

```c
void sort_bubble(int a[], int size){
	for ( int i=size-1; i>0; i-- ) {
		int loc = -1;
		for ( int j=0; j<i; j++ ) {
			if ( a[j] > a[j+1] ) {
				int t = a[j];
				a[j] = a[j+1];
				a[j+1] = t;
				loc = j;//loc memorize the first index of the sorted part
			}
		}
		i = loc+1;// because of i-- at the bottom of 'for' loop
	}
}
```