#### **1. String Conversion**

Functions to convert strings into numerical types.

| Function                                                | Description                                        | Example                          |
| ------------------------------------------------------- | -------------------------------------------------- | -------------------------------- |
| int <br> atoi(const char *str)                          | Convert string to integer                          | atoi("1024") <br>//1024          |
| double <br> atof(const char *str)                       | Convert string to double                           | atof("3.14") <br>//3.14          |
| long <br> strtol(const char *str, char **end, int base) | Convert string to long integer with base selection | strtol("1A", NULL, 16) <br>// 26 |

#### **2. Memory Management**

Functions for dynamic memory allocation and deallocation.

| Function                                      | Description                                  | Example                          |
| --------------------------------------------- | -------------------------------------------- | -------------------------------- |
| void* <br> malloc(size_t size)                | Allocate a block of uninitialized memory     | int *p = malloc(sizeof(int)*5);  |
| void* <br> calloc(size_t nitems, size_t size) | Allocate memory and initialize bytes to zero | int *p = calloc(5, sizeof(int)); |
| void* <br> realloc(void *ptr, size_t size)    | Resize a previously allocated memory block   | p = realloc(p, sizeof(int)*10);  |
| void <br> free(void *ptr)                     | Deallocate/Free memory                       | free(p);                         |

#### **3. Random Numbers & Arithmetic**

Basic integer math and random number generation.

| Function                           | Description                      | Example                |
| ---------------------------------- | -------------------------------- | ---------------------- |
| int <br> abs(int x)                | Absolute value of an integer     | abs(-10) <br> //10     |
| void <br> srand(unsigned int seed) | Seed the random number generator | srand(time(0));        |
| int <br> rand(void)                | Generate a pseudo-random integer | rand() % 100 <br>// 42 |

#### **4. Sorting & System Control**

Process control and algorithm utilities.

| Function                                                            | Description                    | Example                          |
| ------------------------------------------------------------------- | ------------------------------ | -------------------------------- |
| void <br> exit(int status)                                          | Terminate the program normally | exit(0);                         |
| int <br> system(const char *command)                                | Execute a shell command        | system("ls -l");                 |
| void <br> qsort(void *base, size_t n, size_t size, int (*cmp)(...)) | Sort an array (Quicksort)      | qsort(arr, 5, sizeof(int), cmp); |
