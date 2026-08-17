# stdio reference

## 1. Standard Input/Output

Functions for console input and output operations.

| Function                              | Description                                       | Example                                                      |
| :------------------------------------ | :------------------------------------------------ | :----------------------------------------------------------- |
| `int printf(const char *format, ...)` | Print formatted data to standard output (stdout). | `printf("Age: %d", 25);`<br>`// Output: Age: 25`             |
| `int scanf(const char *format, ...)`  | Read formatted input from standard input (stdin). | `scanf("%d", &age);`<br>`// Reads integer into variable age` |
| `int putchar(int char)`               | Write a character to standard output.             | `putchar('A');`<br>`// Output: A`                            |
| `int getchar(void)`                   | Read a character from standard input.             | `char c = getchar();`<br>`// Waits for user input`           |

<br>

## 2. File Operations (Expanded)

### Basic & Formatted I/O

| Function                                              | Description                                                                                                       | Example                                                                  |
| :---------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| `FILE *fopen(const char *filename, const char *mode)` | **Opens a file.** Modes include `"r"` (read), `"w"` (write/overwrite), `"a"` (append), `"rb"` (read binary), etc. | `FILE *fp = fopen("data.txt", "r");`<br>`// Opens file for reading`      |
| `int fclose(FILE *stream)`                            | **Closes a file.** Flushes buffers and releases the file pointer resource.                                        | `fclose(fp);`<br>`// Closes the file pointer fp`                         |
| `int fprintf(FILE *stream, const char *format, ...)`  | **Formatted write.** Writes data to a file stream based on a format string.                                       | `fprintf(fp, "ID: %d\n", 42);`<br>`// Writes "ID: 42" to file`           |
| `int fscanf(FILE *stream, const char *format, ...)`   | **Formatted read.** Reads data from a file stream into variables according to a format.                           | `int id;`<br>`fscanf(fp, "%d", &id);`<br>`// Reads an integer from file` |

### Character & String I/O (Text Mode)

| Function | Description | Example |
| :--- | :--- | :--- |
| `char *fgets(char *str, int n, FILE *stream)` | **Read line.** Reads a string from the file until a newline or `n-1` characters are read. | `char buf[100];`<br>`fgets(buf, 100, fp);`<br>`// Reads a line into buf` |
| `int fputs(const char *str, FILE *stream)` | **Write string.** Writes a string to the file (does not automatically append a newline). | `fputs("Hello World\n", fp);`<br>`// Writes string to file` |
| `int fgetc(FILE *stream)` | **Read character.** Reads the next character from the stream (returns `EOF` on end). | `int ch = fgetc(fp);`<br>`// Reads a single char` |
| `int fputc(int char, FILE *stream)` | **Write character.** Writes a single character to the stream. | `fputc('A', fp);`<br>`// Writes char 'A'` |

### Binary / Block I/O

| Function | Description | Example |
| :--- | :--- | :--- |
| `size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream)` | **Block read.** Reads an array of `nmemb` elements, each of `size` bytes, from the stream. | `int nums[5];`<br>`fread(nums, sizeof(int), 5, fp);`<br>`// Reads raw binary into array` |
| `size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream)` | **Block write.** Writes an array of `nmemb` elements, each of `size` bytes, to the stream. | `double d = 3.14;`<br>`fwrite(&d, sizeof(double), 1, fp);`<br>`// Writes binary data` |

### File Positioning

| Function | Description | Example |
| :--- | :--- | :--- |
| `int fseek(FILE *stream, long int offset, int whence)` | **Move cursor.** Moves the file pointer. `whence`: `SEEK_SET` (start), `SEEK_CUR` (current), `SEEK_END` (end). | `fseek(fp, 0, SEEK_END);`<br>`// Moves to end of file` |
| `long int ftell(FILE *stream)` | **Get position.** Returns the current value (byte offset) of the file position indicator. | `long pos = ftell(fp);`<br>`// Gets current byte offset` |
| `void rewind(FILE *stream)` | **Reset cursor.** Sets the file position indicator to the beginning of the file. | `rewind(fp);`<br>`// Same as fseek(fp, 0, SEEK_SET)` |

### Status & Management

| Function | Description | Example |
| :--- | :--- | :--- |
| `int feof(FILE *stream)` | **Check End-Of-File.** Returns a non-zero value if the End-Of-File indicator is set. | `if(feof(fp)) break;`<br>`// Stop loop if at EOF` |
| `int fflush(FILE *stream)` | **Flush buffer.** Forces any buffered output data to be written to the physical file. | `fflush(fp);`<br>`// Ensures data is saved now` |
| `int remove(const char *filename)` | **Delete file.** Deletes the file with the given name from the file system. | `remove("data.txt");`<br>`// Deletes the file` |
| `int rename(const char *old, const char *new)` | **Rename file.** Changes the name of a file from `old` to `new`. | `rename("old.txt", "new.txt");`<br>`// Renames the file` |
<br><br>

## 3. String Formatting

Functions for formatting data into strings or parsing data from strings.

| Function                                               | Description                                                | Example                                                                  |
| :----------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------- |
| `int sprintf(char *str, const char *format, ...)`      | Write formatted data to a string buffer instead of stdout. | `sprintf(buf, "Hi %s", "Bob");`<br>`// buf becomes "Hi Bob"`             |
| `int sscanf(const char *str, const char *format, ...)` | Read formatted data from a string.                         | `sscanf("Year 2025", "%*s %d", &y);`<br>`// Parses 2025 into variable y` |
