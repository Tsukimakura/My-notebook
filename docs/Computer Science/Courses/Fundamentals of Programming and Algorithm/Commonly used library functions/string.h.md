#### **1. Basic String Operations**

Functions for length, copying, and concatenation.

| Function                                               | Description                                            | Example                                              |
| ------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| `size_t strlen(const char *str)`                       | Get the length of a string (excluding null terminator) | strlen("Code") <br> //4                              |
| `char* strcpy(char *dest, const char *src)`            | Copy one string to another                             | strcpy(buff, "Hi"); <br> //buff becomes "Hi"         |
| `char* strncpy(char *dest, const char *src, size_t n)` | Copy at most n characters                              | strncpy(buff, "Hello", 3); <br> //buff becomes "Hel" |
| `char* strcat(char *dest, const char *src)`            | Concatenate (append) source to destination             | strcat(buff, " World");                              |

#### **2. String Comparison**

Functions to compare two strings lexicographically.

| Function                                                | Description                | Example                                                              |
| ------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------- |
| `int strcmp(const char *s1, const char *s2)`            | Compare two strings        | strcmp("A", "B") <br>// -1 (Negative) <br> strcmp("A", "A") <br>// 0 |
| `int strncmp(const char *s1, const char *s2, size_t n)` | Compare up to n characters | strncmp("apple", "apply", 4) <br>// 0 (First 4 chars match)          |

#### **3. Search & Tokenization**

Functions for finding characters or substrings.

| Function                                                 | Description                                | Example                                  |
| -------------------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `char* strchr(const char *str, int c)`                   | Locate first occurrence of a character     | strchr("hello", 'e') <br>                |
| `char* strstr(const char *haystack, const char *needle)` | Locate the first occurrence of a substring | strstr("banana", "nan") <br>             |
| `char* strtok(char *str, const char *delim)`             | Split string into tokens                   | strtok(str, ",") <br> Returns next token |

#### **4. Memory Block Operations**

Functions that operate on raw memory buffers (not just strings).

| Function                                               | Description                                          | Example                                     |
| ------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------- |
| `void* memset(void *str, int c, size_t n)`             | Fill memory with a constant byte                     | memset(buff, 0, 10); <br> (Zero out buffer) |
| `void* memcpy(void *dest, const void *src, size_t n)`  | Copy memory block (regions must not overlap)         | memcpy(d, s, sizeof(int)*5);                |
| `void* memmove(void *dest, const void *src, size_t n)` | Copy memory block (handles overlapping regions safe) | memmove(&arr[1], &arr[0], n);               |
