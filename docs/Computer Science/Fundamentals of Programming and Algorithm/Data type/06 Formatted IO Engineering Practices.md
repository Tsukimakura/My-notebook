## 1. Introduction to Formatted I/O
The `printf` and `scanf` functions are the primary interface between a C program's internal binary memory and the external text-based world. They act as **translators** governed by a precise "protocol": the **Format Specifier String**.

## 2. Anatomy of the Format Specifier
The specifier defines the rules for this translation.

`% [flags] [width] [.precision] [length] type`

### A. The Core: `type` Specifier
Defines the **interpretation** of the binary data.
*   `d`, `i`: Signed Decimal Integer.
*   `u`: Unsigned Decimal Integer.
*   `x`, `X`: Hexadecimal Integer.
*   `f`, `e`, `g`: Floating Point.
*   `c`, `s`: Character, String.
*   `p`: Pointer Address.
*   `%`: A literal '%' character.

### B. `length` Modifier (The Memory Ruler)
This is critical for matching the size of the data type in memory. A mismatch leads to incorrect data representation or memory corruption.
*   **`hh`:** For `signed/unsigned char`.
*   **`h`:** For `signed/unsigned short`.
*   **`l`:** For `long` or `double` (in `scanf`).
*   **`ll`:** For `long long`.
*   **`L`:** For `long double`.

### C. Formatting Options (Primarily `printf`)
*   **`flags`:** Controls alignment and appearance.
    *   `-`: Left-justify.
    *   `+`: Force sign display (`+` or `-`).
    *   `0`: Pad with leading zeros instead of spaces.
*   **`width`:** Minimum field width.
*   **`.precision`:**
    *   For floats: Number of decimal places.
    *   For strings: Maximum characters to print.

### D. Special Modifiers
*   **`*` (Asterisk):** Dynamic Width/Precision. The value for width/precision is taken from an extra `int` argument.
*   **`n`:** **Writeback Counter**. Stores the number of characters processed so far into an `int*` argument.
*   **`[]` (Scanset):** `scanf` only. Matches a set of characters.
    *   `%[abc]`: Matches `a`, `b`, or `c`.
    *   `%[^abc]`: Matches any character *except* `a`, `b`, or `c`.

---

## 3. `printf`: The Output Composer

### A. Core Function
Converts binary data from memory into a human-readable string representation for display.
*   **Safety:** It is a **read-only** operation on variables, so it is generally safe.

### B. Usage of `*` (Dynamic Formatting)
Used for creating aligned tables where column widths are determined at runtime.
```c
printf("%*d", 10, 123); // Prints "       123" (width 10)
printf("%.*f", 2, 3.14159); // Prints "3.14" (precision 2)
```

### C. Usage of `%n` (Writeback)
Used to capture the number of characters printed to assist in further formatting.
```c
int count;
printf("Hello%n", &count); // After this call, count == 5
```

### D. Return Value
*   **Success:** Returns the total number of characters successfully printed.
*   **Failure:** Returns a **negative value** if an output error occurs (e.g., broken pipe, disk full).
*   **Engineering Use:** In system-level programming, checking for a negative return value is crucial for verifying I/O device health.

---

## 4. `scanf`: The Input Parser

### A. Core Function
Converts a sequence of text characters into their binary representation and stores them at specified memory addresses.
*   **Safety:** It is a **write operation**, making it inherently dangerous. Incorrect usage can lead to **memory corruption** and **security vulnerabilities**.

### B. Mandatory Address Operator (`&`)
`scanf` requires the **memory address** of variables to store results. Passing a value instead of an address (`&`) is a common and critical bug.

### C. Strict Length Modifier Matching (The Critical Trap)
`scanf` does **not** perform argument promotion. The `length` modifier must precisely match the variable's type.
*   `double d; scanf("%lf", &d);` // Correct
*   `double d; scanf("%f", &d);` // **INCORRECT.** Writes 4 bytes into an 8-byte space, corrupting memory.

### D. The `*` Modifier (Assignment Suppression)
Used to read and discard data from the input stream.
```c
// Input: "ID: 1001"
int id;
scanf("%*s %d", &id); // Reads and discards "ID:", then reads 1001.
```

### E. The Scanset (`%[^,]`) for CSV Parsing
Used to read a string until a specific delimiter is found.
```c
char data[100];
scanf("%[^,]", data); // Reads all characters up to the first comma.
```
*   **Risk:** Like `%s`, this can cause a buffer overflow if the input is longer than the buffer. Use a width specifier (e.g., `%99[^,]`) for safety.

### F. Return Value
*   **Success:** Returns the number of **items successfully matched and assigned**. This is the **only reliable way** to check if the input was valid.
*   **Failure:**
    *   Returns `0` if the first item fails to match (e.g., user enters "abc" for `%d`).
    *   Returns `EOF` (End Of File) if the input stream ends before any match.
*   **Engineering Use:** **Always** check the return value of `scanf` to validate user input. Assuming success is a primary source of bugs.
    ```c
    if (scanf("%d %d", &a, &b) != 2) {
        // Handle input error
    }
    ```