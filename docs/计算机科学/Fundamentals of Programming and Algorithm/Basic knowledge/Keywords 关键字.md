# Keywords 关键字

Here is a comprehensive, professional engineering reference for **C Language Keywords**.

This list covers keywords defined in **ISO/IEC 9899** (the C Standard), spanning from **C89/C90** (ANSI C) through **C99**, **C11**, and referencing the latest **C23** updates.

---

## 1. Overview of Standards

*   **C89/C90:** The original 32 keywords.
*   **C99:** Added 5 new keywords (`inline`, `restrict`, `_Bool`, `_Complex`, `_Imaginary`).
*   **C11:** Added 7 new keywords starting with `_` to avoid naming collisions (`_Alignas`, `_Atomic`, etc.).
*   **C23:** Promoted many C11 keywords to "proper" keywords (e.g., `true`, `false`, `alignof` became keywords rather than macros).

---

## 2. Complete Keyword Table (Categorized)

### A. Data Types & Type Specifiers

These keywords define the type of data a variable holds.

| Keyword | Std | Description |
| :--- | :--- | :--- |
| **`void`** | C89 | Represents an empty set of values (e.g., function returning nothing) or a generic pointer (`void*`). |
| **`char`** | C89 | Smallest addressable unit (usually 1 byte); stores characters. |
| **`short`** | C89 | Short signed integer type. |
| **`int`** | C89 | Basic signed integer type. |
| **`long`** | C89 | Long signed integer type (at least 32 bits). |
| **`float`** | C89 | Single-precision floating-point. |
| **`double`** | C89 | Double-precision floating-point. |
| **`signed`** | C89 | Explicitly specifies a signed integer. |
| **`unsigned`** | C89 | Specifies a non-negative integer. |
| **`_Bool`** | C99 | Boolean type (0 or 1). *Note: `bool` is a macro in `<stdbool.h>` prior to C23.* |
| **`_Complex`** | C99 | Complex number type. |
| **`_Imaginary`**| C99 | Imaginary number type (optional support in implementations). |
| **`struct`** | C89 | Defines a complex data structure grouping variables under one name. |
| **`union`** | C89 | Defines a data structure where all members share the same memory location. |
| **`enum`** | C89 | Defines a set of named integer constants. |

### B. Storage Class Specifiers

These keywords determine the lifetime, visibility (scope), and linkage of variables.

| Keyword | Std | Description |
| :--- | :--- | :--- |
| **`auto`** | C89 | Default storage class for local variables (automatic duration). *Rarely used explicitly.* |
| **`extern`** | C89 | Declares a variable/function is defined in another translation unit (file). |
| **`register`** | C89 | Suggests the variable be stored in a CPU register for speed (hint only). |
| **`static`** | C89 | **Internal linkage** (global) or **Static duration** (local). Preserves value between function calls. |
| **`typedef`** | C89 | Creates an alias name for an existing type. |
| **`_Thread_local`**| C11 | Specifies a variable has thread storage duration (unique per thread). |

### C. Type Qualifiers

These keywords modify *how* the memory associated with a type is accessed.

| Keyword | Std | Description |
| :--- | :--- | :--- |
| **`const`** | C89 | **Read-only**. The program cannot modify the variable after initialization. |
| **`volatile`** | C89 | Prevents compiler optimization. Indicates value may change unexpectedly (e.g., hardware register). |
| **`restrict`** | C99 | Optimization hint. Assumes this pointer is the *only* way to access the underlying memory in that scope. |
| **`_Atomic`** | C11 | Specifies that access to the variable is atomic (thread-safe without locks). |

### D. Control Flow

Keywords that control the execution path of the program.

| Keyword | Std | Description |
| :--- | :--- | :--- |
| **`if`** | C89 | Conditional branching statement. |
| **`else`** | C89 | The alternative branch of an `if` statement. |
| **`switch`** | C89 | Multi-way branch based on an integer value. |
| **`case`** | C89 | A specific label within a `switch` block. |
| **`default`** | C89 | The fallback label within a `switch` block. |
| **`while`** | C89 | Loop that checks condition *before* execution. |
| **`do`** | C89 | Loop that checks condition *after* execution (guarantees one run). |
| **`for`** | C89 | Loop with initialization, condition, and increment expressions. |
| **`goto`** | C89 | Unconditional jump to a labeled statement. |
| **`continue`** | C89 | Skips the rest of the current loop iteration. |
| **`break`** | C89 | Exits the current loop or `switch` statement immediately. |
| **`return`** | C89 | Terminates a function and optionally returns a value. |

### E. Operators & Language Intrinsics

Keywords that act like operators or compiler directives.

| Keyword | Std | Description |
| :--- | :--- | :--- |
| **`sizeof`** | C89 | Compile-time operator returning the size of a type or variable in bytes. |
| **`inline`** | C99 | Suggests the compiler substitute the function code directly (inlining) to reduce call overhead. |
| **`_Alignas`** | C11 | Specifies the memory alignment requirement for a variable/type. |
| **`_Alignof`** | C11 | Returns the alignment requirement of a type. |
| **`_Generic`** | C11 | Enables compile-time generic selection (C-style polymorphism). |
| **`_Noreturn`** | C11 | Specifies that a function never returns to the caller (e.g., `exit()`). |
| **`_Static_assert`**| C11| Performs a compile-time assertion check. |

---

## 3. Critical Concepts: The "Tricky" Keywords

Here are detailed notes on the keywords that often confuse engineers:

### 1. `static` (The Context Chameleon)

*   **Inside a function:** The variable stays in memory for the life of the program. It is initialized only once.
*   **Outside a function (Global):** The variable/function is **private** to that source file (Internal Linkage). It cannot be accessed by other files using `extern`.

### 2. `volatile` (The Hardware/OS Bridge)

*   Tells the compiler: "Do not cache this variable in a register; always read it from RAM."
*   **Use cases:** Memory-mapped hardware registers (embedded systems), variables modified by Interrupt Service Routines (ISRs), or signal handlers.

### 3. `restrict` (The Optimization Promise)

*   A promise from the programmer to the compiler: "For the lifetime of this pointer, no other pointer will access this same chunk of memory."
*   Allows the compiler to perform aggressive optimizations (like vectorization) that would otherwise be unsafe due to potential pointer aliasing.

---

## 4. Evolution Note: C23 Standard

The **C23** standard (the newest iteration) made significant changes to modernize keywords. It introduced standard lowercase keywords that were previously macros or underscored keywords.

If you are using a C23-compliant compiler:
1. **`true`** and **`false`** are now actual keywords (previously macros in `stdbool.h`).
2. **`bool`** is a keyword (replaces `_Bool`).
3. **`alignas`**, **`alignof`**, **`static_assert`**, **`thread_local`** are keywords (replacing the `_Capitalized` versions).
4. **`typeof`** and **`typeof_unqual`** are new keywords for type inference.
5. **`nullptr`** is a new keyword representing a null pointer with a specific type (similar to C++).
