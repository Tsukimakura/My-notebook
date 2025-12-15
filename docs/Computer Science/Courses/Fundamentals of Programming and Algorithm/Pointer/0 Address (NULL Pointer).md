### 1. What is "Address 0"?

- **Definition:** In C, address 0 is a special memory address reserved by the system.
    
- **Meaning:** It represents **"Nowhere"** or **"Invalid Location."**
    
- **The Macro:** In code, it is usually represented by the macro NULL.
    
    - NULL is essentially defined as (void *)0 or simply 0.
        

### 2. Key Characteristics

- **Reserved Area:** The Operating System typically reserves the lowest segment of memory (including address 0) so programs cannot use it.
    
- **No Access:** You **cannot** read from or write to address 0.
    
- **The Consequence:** If you try to access data at address 0 (dereferencing a NULL pointer), the program will crash.
    
    - **Error Message:** usually "Segmentation Fault" (Segfault) on Linux/Unix or "Access Violation" on Windows.
        

### 3. Usage Patterns

We use address 0 (NULL) intentionally to mark pointers as "empty" or "safe".

- **Initialization:** Always initialize pointers to NULL if they don't point to a valid object yet.

    ```c
    int *ptr = NULL; // Good practice
    ```
    
- **Error Checking:** Functions often return NULL to indicate failure.
    
    ```c
    FILE *fp = fopen("file.txt", "r");
    if (fp == NULL) {
        printf("Failed to open file.\n");
    }
    ```
    
- **Sentinel Value:** It marks the end of data structures (like Linked Lists).