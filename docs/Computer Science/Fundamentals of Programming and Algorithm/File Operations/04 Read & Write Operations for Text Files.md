## 1. Characteristics of Text Files

Text files are physically identical to binary files (sequences of bytes) but are logically interpreted through specific conventions. They are designed for human readability and portability.

### The ASCII "Scale"
*   **Printable Range:** Text files primarily utilize a specific subset of byte values, typically the printable ASCII characters (Values **32–126**, such as `A-Z`, `0-9`, punctuation).
*   **Control Characters:** With the exception of formatting controls like Newline (`\n`, 10), Carriage Return (`\r`, 13), and Tab (`\t`, 9), text files rarely contain bytes in the 0–31 range (e.g., NULL bytes).
*   **Implication:** This restriction limits data density but ensures the file can be displayed correctly on any standard terminal or text editor.

### The Logic of "Lines"
*   **Logical Separation:** Hardware has no concept of "lines"; memory is a continuous tape. Text files artificially create structure using a **Sentinel Character**: the Newline (`\n`).
*   **Variable Length:** Because line length varies (Line 1 might be 5 bytes, Line 2 might be 100 bytes), text files effectively store **Variable Length Records**.
*   **Sequential Access:** Due to variable lengths, random access (jumping to "Line 50") is inefficient. To find Line 50, the program must sequentially read and count newlines starting from Line 1.

---

## 2. Character-Level Operations

These are the most atomic operations, handling one byte at a time.

### Input: `fgetc`
*   **Prototype:** `int fgetc(FILE *stream);`
*   **Function:** Reads the next unsigned character from the stream and advances the position indicator.
*   **Return Type (`int`):** A critical design choice.
    *   It must be able to return all valid character values (0–255).
    *   It must also return a unique error/end-of-file indicator (**EOF**, typically -1).
    *   Using `char` would cause a collision (e.g., byte 0xFF could be interpreted as -1). Using `int` provides a larger range to distinguish valid data from flags.

### Output: `fputc`
*   **Prototype:** `int fputc(int c, FILE *stream);`
*   **Function:** Writes a single character to the stream.
*   **Usage:** Often used in loops to copy files byte-by-byte.

---

## 3. Line-Level Operations

These functions are designed specifically to handle the newline-delimited structure of text files.

### Input: `fgets` (The Safer Choice)
*   **Prototype:** `char *fgets(char *str, int n, FILE *stream);`
*   **Behavior:** Reads until one of the following occurs:
    1.  A newline (`\n`) is encountered (The newline is **included** in the buffer).
    2.  `n-1` characters are read (preventing buffer overflow).
    3.  EOF is reached.
*   **Safety:** Unlike the deprecated `gets()` function, `fgets` forces the programmer to specify the buffer size, preventing memory corruption vulnerabilities.

### Output: `fputs`
*   **Prototype:** `int fputs(const char *str, FILE *stream);`
*   **Behavior:** Writes a string to the stream.
*   **Note:** Unlike `puts()` (which operates on stdout), `fputs` **does not** automatically append a newline character. The programmer must explicitly include `\n` if needed.

---

## 4. Formatted Operations

These functions bridge the gap between human-readable text and internal C data types (integers, floats).

### The "f" Series Pattern
The logic follows a simple formula: **Standard Function + Stream Pointer**.

*   **`fprintf(FILE *stream, ...)`**:
    *   Works exactly like `printf`, but directs output to a specific file.
    *   *Example:* `fprintf(fp, "ID: %d, Score: %.2f\n", id, score);`
*   **`fscanf(FILE *stream, ...)`**:
    *   Works exactly like `scanf`, but reads from a specific file.
    *   **Whitespace Skipping:** It automatically skips leading spaces, tabs, and newlines to find the next matching data token.

---

## 5. Common Pitfalls & Best Practices

### The `getchar` Return Type Trap
**Mistake:** `char c = getchar();`
**Consequence:** On systems where `char` is unsigned, `c` (0 to 255) can never equal `EOF` (-1). The loop will never terminate.
**Correction:** Always use `int c = getchar();`.

### The "Ghost Newline" Issue
When mixing `scanf`/`fscanf` with character/line input, buffering issues often arise.

**Scenario:**
1.  `scanf("%d", &num);` reads an integer (e.g., "100") but stops at the newline, **leaving the `\n` in the input buffer**.
2.  A subsequent call to `getchar()` or `fgets()` immediately sees the leftover `\n` and consumes it, appearing to "skip" user input.

**Solution:** Explicitly consume the buffer after `scanf`.
```c
scanf("%d", &num);
while (getchar() != '\n'); // Clear buffer until newline
fgets(buffer, size, stdin); // Now works correctly
```

### Text vs. Binary Mode on Windows
*   **Issue:** Windows treats `\n` (LF) in C memory as `\r\n` (CRLF) on disk.
*   **Text Mode:** This conversion is automatic.
*   **Risk:** If you use text functions to read non-text data (like an image containing byte `0x0A`), the system might corrupt the data by altering the byte. Always ensure the correct mode is selected in `fopen`.