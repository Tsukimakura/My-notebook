## 1. Definition of a Statement
In C, a **statement** is the smallest standalone element of an imperative programming language that expresses an action to be carried out.
*   **Concept:** If identifiers are "words" and expressions are "phrases," a statement is a complete "sentence."
*   **Syntax:** Most statements end with a **semicolon (`;`)**, which acts as the terminator.
*   **Purpose:** It instructs the CPU to perform an action at runtime (e.g., calculation, control flow, function call).

## 2. Categories of Statements
Standard C classifies statements into five main types:

1.  **Expression Statements**
    An expression followed by a semicolon. It is typically executed for its **side effects** (modifying the state).
    *   `a = 10;` (Assignment)
    *   `func();` (Function call)
    *   `;` (Null statement)

2.  **Compound Statements (Blocks)**
    A group of statements enclosed in braces `{ }`. Syntactically, the entire block is treated as a **single statement**.

3.  **Selection Statements**
    Used to select a path of execution.
    *   Keywords: `if`, `switch`.

4.  **Iteration Statements (Loops)**
    Used to execute code repeatedly.
    *   Keywords: `while`, `do...while`, `for`.

5.  **Jump Statements**
    Used to unconditionally transfer control.
    *   Keywords: `break`, `continue`, `return`, `goto`.

## 3. Scope and Boundaries of Statements
A crucial concept in C is that control flow statements (like `if`, `while`, `for`) encompass their bodies.

### The "Whole Unit" Rule
A selection or iteration statement is not just the line with the keyword (e.g., `if (x>0)`). It is defined as the keyword, the condition, **plus** the sub-statement (body) that follows it.

*   **Syntax:** `if ( expression ) statement`
*   **Implication:** The "statement" at the end can be a single line (ending in `;`) or a compound block (`{...}`). In both cases, they are legally part of the `if` statement itself.

### Example: Nested Logic without Braces
The following code is valid because the entire `if...else` structure is considered **one single statement** by the `while` loop.
```c
while (1)           // Controls the ONE statement immediately following it
    if (x > 5)      // Start of the nested statement
        print("A");
    else            // Still part of the same nested statement
        print("B");
```

## 4. What is NOT a Statement?
It is vital to distinguish executable statements from directives and declarations.

### Preprocessor Directives
Lines beginning with `#` (e.g., `#define`, `#include`) are **not** statements.
*   **Reason:** They are processed by the **Preprocessor** at compile-time (text replacement), not by the CPU at runtime.

### Declarations (`int a;` is NOT a statement)
Although `int a;` ends with a semicolon and appears inside functions, it is grammatically a **Declaration**, not a Statement.

*   **The Difference:**
    *   **Declaration (`int a;`):** Tells the compiler **"what exists"**. It introduces an identifier and reserves memory (stack/global) for it.
    *   **Statement (`a = 10;`):** Tells the CPU **"what to do"**. It executes an instruction to move data into that memory.
*   **Evidence (C89 Standard):**
    In the original C89 standard, declarations *had* to be placed at the very top of a block, before any statements.
    ```c
    void func() {
        int a;      // Declaration
        a = 10;     // Statement
        int b;      // Error in C89! (Declaration cannot follow a statement)
    }
    ```
    If `int a;` were a statement, the code above would have been valid in C89 (statement following statement). The fact that it was forbidden proves they are distinct syntactic categories.

## 5. Common Pitfalls

### The Null Statement Trap
Accidentally placing a semicolon after a control structure terminates the statement immediately.
```c
if (x > 0);  // The 'if' statement ends here with an empty action.
{
    // This block is no longer controlled by the 'if'.
    // It will execute unconditionally.
    printf("Bug");
}
```

### Assignment vs. Equality
Using `=` instead of `==` inside a condition.
```c
if (x = 5)  // Assigns 5 to x. Expression evaluates to 5 (True).
```
*   **Result:** The condition is always true, and `x` is silently modified.

### The `do...while` Semicolon
This is the unique loop that requires a semicolon at the end.
*   `while (...) { ... }` (No semicolon)
*   `do { ... } while (...);` (**Required semicolon**)
    *   Here, the semicolon marks the end of the entire iteration statement.