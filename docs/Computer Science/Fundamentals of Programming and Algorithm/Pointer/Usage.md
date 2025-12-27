### 1. To indirectly manipulate the arguments
[[Arguments vs Parameters 实参与形参]]
```c
void swap(int *a, int *b){
	int p = *a;
	*a = *b;
	*b = p;
}
```

### 2. To return more than one value by a function
```c
void findmaxmin(int[] a, int len, int *pmax, int *pmin);
```

```text
// this part is from Wengkai's courseware

Let the function returns status of operation but result of the operation is passed backvia pointer parameters

e.g. the return value of scanf()

A more common way is to make the function return a special value that is not in thevalid range to indicate an error status:

e.g. -1 or 0 (Weʼll see a lot in file operation)

But when all values are possible result, the value and the status have to be returned to the caller in separated ways:

e.g. A function to calculate division of two integers.
```

### 3. To pass large parameters
1. C uses pass-by-value

All function arguments are passed by value, meaning the argument is **copied** when the function is called.

2. Large objects cause expensive copying

Passing a large struct or array **by value** means:

- The entire object is duplicated
- Time cost increases
- Large stack memory is consumed
- Risk of stack overflow

Example:  
A struct with a 4 MB array would copy all 4 MB when passed by value.


3. Pointers avoid copying

Passing a pointer only copies an **8-byte address**, regardless of how large the original object is.

Benefits:

- **High efficiency**
- **Zero extra memory cost**
- **No unnecessary data copying**
- **Allows function to modify the original object**

4. Use const pointers when no modification is needed

Example:

`void print_data(const HugeStruct *data);`

This prevents copying while ensuring the function cannot change the data.

### 4.manipulate array elements as parameters in functions

### 5. Allocate memories dynamically
**1. `malloc` — Allocate Memory**

**Purpose:** Allocate a block of memory with a given size.

`void *malloc(size_t size);`

Features:

- Does **not** initialize memory (content is garbage)
    
- Returns a **pointer** to the allocated block
    
- Returns `NULL` if allocation fails
    

Example:

`int *p = malloc(5 * sizeof(int));  // allocate space for 5 ints`

**2. `calloc` — Allocate and Clear Memory**

**Purpose:** Allocate memory for an array and initialize all bytes to **0**.

`void *calloc(size_t num, size_t size);`

Features:

- Allocates `num * size` bytes
    
- Memory is automatically **zero-initialized**
    
- Useful for arrays
    

Example:

`int *p = calloc(5, sizeof(int));  // 5 ints, all initialized to 0`

**3. `realloc` — Resize Previously Allocated Memory**

**Purpose:** Change the size of a memory block obtained by `malloc` or `calloc`.

`void *realloc(void *ptr, size_t new_size);`

Features:

- Attempts to resize the existing memory block
    
- May move the block to a new location
    
- **Returns a new pointer** (old pointer becomes invalid)
    
- Can be used to grow or shrink arrays
    

Example:

`p = realloc(p, 10 * sizeof(int));  // resize to 10 ints`

**4. Always Free Allocated Memory**

Memory allocated by these functions must be released:

`free(p);`