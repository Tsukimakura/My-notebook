### 1. Overview
The `<stdbool.h>` header file is part of the **C Standard Library**, introduced in the **ISO/IEC 9899:1999 standard (C99)**.

Prior to C99, C did not have a native boolean data type. Programmers used `int` to represent logic (where 0 is false and non-zero is true). This header standardizes boolean logic, improving code readability and intent.

### 2. Core Macro Definitions
The primary function of this header is to define four macros. When preprocessed, they translate as follows:

| Macro | Expands To | Description |
| :--- | :--- | :--- |
| **`bool`** | `_Bool` | Expands to the intrinsic integer type `_Bool` introduced in C99. |
| **`true`** | `1` | Integer constant representing logical truth. |
| **`false`** | `0` | Integer constant representing logical falsehood. |
| **`__bool_true_false_are_defined`**| `1` | A signal to the compiler/preprocessor that boolean logic is available. |

### 3. Internal Mechanism
It is important to understand that `bool` in C is **not** a new primitive type in the same way `int` or `char` are. It is a macro wrapper around **`_Bool`**.

*   **`_Bool`**: This is an unsigned integer type large enough to hold the values 0 and 1.
*   **Assignment Behavior**: If a value is assigned to a `_Bool` variable, it is converted to `1` if the value is non-zero, and `0` if the value is zero.
    *   *Example:* `bool b = 100;` results in `b` storing `1`.

### 4. Code Example
The following example demonstrates standard usage:

```c
#include <stdio.h>
#include <stdbool.h> // Required to use bool, true, false

// Function returning a boolean value
bool is_even(int num) {
    if (num % 2 == 0) {
        return true;  // Returns 1
    } else {
        return false; // Returns 0
    }
}

int main(void) {
    bool flag = true;
    int number = 42;

    if (flag) {
        if (is_even(number)) {
            printf("%d is an even number.\n", number);
        }
    }

    // Demonstrating the underlying integer nature
    printf("Value of true: %d\n", true);   // Output: 1
    printf("Value of false: %d\n", false); // Output: 0
    
    return 0;
}
```

### 5. Historical Context & C++ Compatibility

*   **C89 / C90 (Legacy)**:
    *   `<stdbool.h>` does not exist.
    *   Developers often manually defined types: `typedef int bool;` or `#define TRUE 1`.
*   **C++**:
    *   `bool`, `true`, and `false` are **keywords** in C++. They are built into the language.
    *   While you *can* include `<stdbool.h>` in C++ for backward compatibility, it is unnecessary and typically deprecated in modern C++ code.

### 6. Best Practices

1.  **Use for Readability**: Using `bool` makes function signatures self-documenting (e.g., `bool is_valid()` is clearer than `int is_valid()`).
2.  **Avoid Explicit Comparison**:
    *   **Bad**: `if (my_bool == true)`
    *   **Good**: `if (my_bool)`
3.  **Standard Compliance**: Always include this header if you use `bool` in C. Do not rely on compiler extensions that might support it without the include.