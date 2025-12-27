## 1. Fundamentals of Macros
Macros are handled by the **C Preprocessor** before the code is compiled. They perform **pure text substitution**.

### 1.1 Object-like Macros
Used to define constants or configuration flags.
*   **Convention:** Use all uppercase letters.
*   **Syntax:** `#define NAME value`
*   **Example:**
    ```c
    #define BUFFER_SIZE 1024
    #define PI 3.14159
    char buffer[BUFFER_SIZE]; // Becomes: char buffer[1024];
    ```

### 1.2 Function-like Macros
Macros that look like functions but work by expanding arguments into the code.
*   **Syntax:** `#define MACRO_NAME(params) replacement`
*   **Example:**
    ```c
    #define MAX(a, b) ((a) > (b) ? (a) : (b))
    ```

---

## 2. Advanced Operators ("Macro Magic")

### 2.1 Stringification Operator (`#`)
Converts a macro argument into a **string literal** (enclosed in double quotes).
*   **Usage:** Debugging, logging variable names.
*   **Example:**
    ```c
    #define TO_STR(x) #x
    // TO_STR(Hello) -> "Hello"
    ```

### 2.2 Token Concatenation Operator (`##`)
Joins two tokens into a single token.
*   **Usage:** Generating variable names, function names, or types dynamically.
*   **Example:**
    ```c
    #define DECLARE_VAR(type, name) type type_##name
    DECLARE_VAR(int, myVar); 
    // Expands to: int type_myVar;
    ```

### 2.3 Variadic Macros (... & __VA_ARGS__)
Allows a macro to accept a variable number of arguments (C99 Standard).
- **Example:**
    ```c
    #define LOG(fmt, ...) printf("[LOG] " fmt "\n", __VA_ARGS__)
    ```

---

Here is a **concise** section on Predefined Macros that fits perfectly into the previous study notes (ideally place it after "2. Advanced Operators" and before "3. Best Practices").

---

## 3. Predefined Macros (Compiler Built-ins)
[[Predefined Macros 预定义的宏 | cheat sheet of predefined macros]]
The compiler automatically defines certain macros that are essential for **debugging** and **environment detection**. You do not need to define them yourself.

### Common Standard Macros
*   **`__FILE__`**: The name of the current source file (string).
*   **`__LINE__`**: The current line number (integer).
*   **`__DATE__` / `__TIME__`**: The date and time when the compilation started.
*   **`__func__`**: The name of the current function (C99 standard).

### Example: Instant Debug Trace
```c
void check_error(int status) {
    if (status != 0) {
        // Output: "Error in check_error at main.c:42"
        printf("Error in %s at %s:%d\n", __func__, __FILE__, __LINE__);
    }
}
```

### Feature Detection
*   **`__STDC_VERSION__`**: Checks the C standard version (e.g., `199901L` for C99).
*   **`__cplusplus`**: Defined if the code is being compiled by a C++ compiler (useful for `extern "C"` blocks).

---
## 4. Best Practices & Safety Techniques
Writing macros is error-prone. Follow these patterns to ensure robustness.

### 4.1 Parentheses Protection
Since macros are text replacements, operator precedence can cause logic errors.
*   **Rule:** Wrap every parameter and the entire macro body in parentheses.
*   **Bad:** `#define ADD(a, b) a + b` -> `ADD(1, 2) * 3` becomes `1 + 2 * 3` (7).
*   **Good:** `#define ADD(a, b) ((a) + (b))` -> Becomes `((1) + (2)) * 3` (9).

### 4.2 The `do { ... } while(0)` Idiom
Used for multi-statement macros to ensure they behave like a single statement (swallowing the semicolon correctly in `if-else` blocks).
*   **Pattern:**
    ```c
    #define SWAP(a, b) \
        do { \
            int t = (a); (a) = (b); (b) = t; \
        } while(0)
    ```

### 4.3 Beware of Side Effects
Macros evaluate arguments every time they appear in the definition.
*   **The Trap:** `#define SQUARE(x) ((x) * (x))`
*   **The Error:** `SQUARE(i++)` expands to `((i++) * (i++))`.
*   **Result:** `i` is incremented twice, leading to **Undefined Behavior**.
*   **Solution:** Use `static inline` functions [[Inline functions]] for complex logic instead of macros.

---

## 5. Header Files & Include Guards

### 5.1 Why can't we duplicate headers?
*   **Declarations** (e.g., `void func(int x);`) **can** be repeated.
*   **Definitions** (specifically `struct`, `union`, `enum`) **cannot** be repeated. (Actually these "type definitions" are "declarations" [[Declarations vs Definitions 声明和定义]], and we should only do declarations instead of definitions in our headers)
*   If a header file containing `struct User { ... };` is included twice, the compiler sees it as a **Redefinition Error**.

### 5.2 Include Guards
The standard solution to prevent double inclusion.
```c
#ifndef MY_HEADER_H   // 1. Check if NOT defined
#define MY_HEADER_H   // 2. Define it

// ... Struct definitions and declarations ...

#endif                // 3. End check
```

---

## 6. Conditional Compilation
Controlling which code gets compiled based on conditions (Platform, Debug/Release).

### 6.1 Basic Directives
*   `#if`, `#elif`, `#else`, `#endif`: Used for numeric/logic comparison.
    ```c
    #define VERSION 2
    #if VERSION >= 2
       // New code
    #endif
    ```

### 6.2 Existence Check
*   `#ifdef NAME`: Executes if `NAME` is defined.
*   `#ifndef NAME`: Executes if `NAME` is NOT defined.

### 6.3 Complex Logic (`defined()`)
Used for checking multiple conditions simultaneously.
*   **Example:**
    ```c
    #if defined(_WIN32) || defined(__linux__)
        // Cross-platform code
    #endif
    ```

### 6.4 The "Ultimate Comment" (`#if 0`)
The best way to temporarily disable large blocks of code, especially those containing standard comments (`/* */`).
```c
#if 0
   /* This code is disabled efficiently */
   void legacy_function() { ... }
#endif
```

### 6.5 The `#error` Directive
This directive forces the compiler to **abort compilation immediately** and print a custom error message. It is the ultimate safeguard for ensuring valid build configurations.

*   **Usage:** Validating macro definitions, architecture checks, or feature requirements.
*   **Example:**
    ```c
    #if defined(DEMO_VERSION) && defined(PAID_FEATURE)
        // Stop the build if conflicting flags are set
        #error "Cannot compile: Demo version cannot contain Paid features!"
    #endif
    ```

---

## 7. Advanced Pattern: X-Macros
[[X-Macros | More about X-Macros]]
A technique to maintain lists of data in one place and generate different code (enums, string arrays) automatically.

1.  **Define List:** Create a file (or macro) with data items wrapped in `X(...)`.
2.  **Define X:** Define what `X` does (e.g., generate an enum case).
3.  **Include List:** Run the list.
4.  **Undefine X:** Clean up.
5.  **Redefine X:** Define `X` differently (e.g., generate a string) and include the list again.

---

Here is the extension note on **Command-Line Macro Definitions**.

This section fits best in **Chapter 2: The Basic Unit of Compilation & Preprocessing Logic**, specifically **after "2. Preprocessing & Macros (Brief Overview)"** and **before "3. Header File Management"**.

---

##  8. Command-Line Macro Definitions
You don't always have to write `#define` inside your source code. You can inject macros directly from the compiler command line. This is extremely powerful for **controlling build variants** (e.g., Debug vs. Release, or Demo vs. Full Version) without changing a single line of code.

#### 1. Defining Macros (`-D`)
The `-D` flag allows you to define a macro as if you wrote `#define` at the very top of your file.

*   **Define as "1" (Flag):**
    ```bash
    gcc -DDEBUG main.c
    ```
    *   **Equivalent to:** `#define DEBUG 1`
    *   **Usage:** Great for `#ifdef DEBUG` switches.

*   **Define with Value:**
    ```bash
    gcc -DVERSION=3 main.c
    ```
    *   **Equivalent to:** `#define VERSION 3`

*   **Define String Literals (Tricky!):**
    You must escape quotes so the shell doesn't eat them.
    ```bash
    # We want: #define OS_NAME "Linux"
    gcc -DOS_NAME=\"Linux\" main.c
    ```

#### 2. Undefining Macros (`-U`)
The `-U` flag cancels a macro definition.
*   **Usage:** `gcc -U__linux__ main.c`
*   **Purpose:** Usually used to disable built-in system macros or override a definition made by a previous `-D` flag in a complex Makefile.

#### 3. Practical Example: Debug Build
**Code (`main.c`):**
```c
#include <stdio.h>

int main() {
#ifdef DEBUG
    printf("[Debug] Variable x = %d\n", 10);
#endif
    printf("Program running...\n");
    return 0;
}
```

**Build Commands:**
*   **Release Build:** `gcc main.c -o app`
    *   Output: `Program running...`
*   **Debug Build:** `gcc -DDEBUG main.c -o app_debug`
    *   Output:
        ```text
        [Debug] Variable x = 10
        Program running...
        ```

#### 4. Interaction with Code
*   **Precedence:** Command-line definitions (`-D`) happen **before** the file is read.
*   **Conflict:** If your code has a hardcoded `#define VER 1` and you run `gcc -DVER=2`, the compiler will emit a **"Redefinition Warning"**, and the code's definition will usually win (since it comes "later" in the stream).
    *   **Fix:** In your code, use `#ifndef`:
        ```c
        #ifndef VER
        #define VER 1  // Default value if not provided by -D
        #endif
        ```

---
## Summary
*   **Macros** are powerful for performance and configuration but lack type safety.
*   **Always** protect macro arguments with parentheses `()`.
*   **Never** use arguments with side effects (like `i++`) in macros.
*   **Always** use Include Guards in header files to avoid struct redefinition errors.
*   Use **Conditional Compilation** for cross-platform compatibility and debugging.
*   Use the Command line to create temporary macros for debugging or anything else.