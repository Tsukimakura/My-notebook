#### A. Data Types & Type Specifiers
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

#### B. Storage Class Specifiers
These keywords determine the lifetime, visibility (scope), and linkage of variables.

| Keyword | Std | Description |
| :--- | :--- | :--- |
| **`auto`** | C89 | Default storage class for local variables (automatic duration). *Rarely used explicitly.* |
| **`extern`** | C89 | Declares a variable/function is defined in another translation unit (file). |
| **`register`** | C89 | Suggests the variable be stored in a CPU register for speed (hint only). |
| **`static`** | C89 | **Internal linkage** (global) or **Static duration** (local). Preserves value between function calls. |
| **`typedef`** | C89 | Creates an alias name for an existing type. |
| **`_Thread_local`**| C11 | Specifies a variable has thread storage duration (unique per thread). |

#### C. Type Qualifiers
These keywords modify *how* the memory associated with a type is accessed.

| Keyword | Std | Description |
| :--- | :--- | :--- |
| **`const`** | C89 | **Read-only**. The program cannot modify the variable after initialization. |
| **`volatile`** | C89 | Prevents compiler optimization. Indicates value may change unexpectedly (e.g., hardware register). |
| **`restrict`** | C99 | Optimization hint. Assumes this pointer is the *only* way to access the underlying memory in that scope. |
| **`_Atomic`** | C11 | Specifies that access to the variable is atomic (thread-safe without locks). |

#### D. Control Flow
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

#### E. Operators & Language Intrinsics
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
