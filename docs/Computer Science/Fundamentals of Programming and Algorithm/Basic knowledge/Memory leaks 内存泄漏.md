## 1. Origin of the Term (Literal Meaning)

The term "Leak" describes the **gradual reduction of available system resources**.  
From the Operating System's perspective, memory is a finite pool of resources given to a process. When a program allocates memory but fails to return it, that specific block of memory becomes permanently unavailable for reuse. To the system, the total capacity of usable memory appears to slowly "drain away" or vanish, even though the hardware is intact.

## 2. Technical Definition in C

A memory leak occurs when memory allocated on the **Heap** (dynamic memory) is not explicitly deallocated.

- **Mechanism:** The programmer manually requests memory (e.g., via malloc) but fails to call free before the pointer to that memory is lost or destroyed.
    
- **Result:** The memory remains marked as "in use" by the OS, but the program no longer has the address (pointer) to access or free it.
    

## 3. Common Causes in C

### A. Missing free()

Allocating memory but forgetting to write the corresponding release command.

```c
void case1() {
    char *ptr = malloc(100); 
    // Function ends, stack variable 'ptr' is destroyed.
    // The 100 bytes on the Heap remain allocated (LEAK).
}
```

### B. Pointer Overwriting (Orphaned Memory)

Assigning a new address to a pointer without freeing the old address first.

```c
void case2() {
    char *ptr = malloc(100); // Address A allocated
    ptr = malloc(50);        // Address B assigned to ptr
    // Address A is now lost forever. It cannot be freed (LEAK).
    free(ptr); // Only Address B is freed.
}
```

### C. Improper Error Handling

Returning early from a function due to an error, skipping the cleanup code at the end.

```c
int case3() {
    char *ptr = malloc(100);
    if (error_condition) {
        return -1; // LEAK: Returns without calling free(ptr)
    }
    free(ptr);
    return 0;
}
```

## 4. Detection Tools

Since C has no Garbage Collector, tools are essential:

1. **Valgrind (Memcheck):** The gold standard for Linux. Runs the program in a virtual environment to track every byte allocated and freed.
    
2. **AddressSanitizer (ASan):** A compiler feature (GCC/Clang). Use flag -fsanitize=address to detect leaks at runtime with low overhead.
    

## 5. Prevention Strategies

1. **Ownership Logic:** Clearly define which function or struct is responsible for freeing a pointer.
    
2. **"One Malloc, One Free":** Ensure every allocation has a matching deallocation path.
    
3. **goto for Cleanup:** A common C pattern to handle errors without duplicating free calls.
 
    ```c
    char *ptr = malloc(100);
    if (error) goto cleanup;
    // ... work ...
    cleanup:
        free(ptr);
    ```
    
4. **Set to NULL:** After calling free(ptr), immediately set ptr = NULL to prevent "Double Free" errors or accidental reuse.