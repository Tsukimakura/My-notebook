#### 1. Standard Input/Output

Functions for console input and output operations.

| Function                              | Description                                       | Example                                                      |
| :------------------------------------ | :------------------------------------------------ | :----------------------------------------------------------- |
| `int printf(const char *format, ...)` | Print formatted data to standard output (stdout). | `printf("Age: %d", 25);`<br>`// Output: Age: 25`             |
| `int scanf(const char *format, ...)`  | Read formatted input from standard input (stdin). | `scanf("%d", &age);`<br>`// Reads integer into variable age` |
| `int putchar(int char)`               | Write a character to standard output.             | `putchar('A');`<br>`// Output: A`                            |
| `int getchar(void)`                   | Read a character from standard input.             | `char c = getchar();`<br>`// Waits for user input`           |

<br>

#### 2. File Operations

Functions to open, close, and manipulate files.

| Function | Description | Example |
| :--- | :--- | :--- |
| `FILE *fopen(const char *filename, const char *mode)` | Open a file. Modes include "r" (read), "w" (write), "a" (append). | `FILE *fp = fopen("data.txt", "r");`<br>`// Opens file for reading` |
| `int fclose(FILE *stream)` | Close an open file stream. | `fclose(fp);`<br>`// Closes the file pointer fp` |
| `int fprintf(FILE *stream, const char *format, ...)` | Write formatted output to a specific file stream. | `fprintf(fp, "ID: %d", 42);`<br>`// Writes "ID: 42" to file` |
| `char *fgets(char *str, int n, FILE *stream)` | Read a string (line) from a file stream. | `fgets(buff, 100, fp);`<br>`// Reads a line into buff` |

<br>

#### 3. String Formatting

Functions for formatting data into strings or parsing data from strings.

| Function | Description | Example |
| :--- | :--- | :--- |
| `int sprintf(char *str, const char *format, ...)` | Write formatted data to a string buffer instead of stdout. | `sprintf(buf, "Hi %s", "Bob");`<br>`// buf becomes "Hi Bob"` |
| `int sscanf(const char *str, const char *format, ...)` | Read formatted data from a string. | `sscanf("Year 2025", "%*s %d", &y);`<br>`// Parses 2025 into variable y` |