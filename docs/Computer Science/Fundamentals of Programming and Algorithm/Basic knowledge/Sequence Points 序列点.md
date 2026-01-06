## 1. Definition of a Sequence Point
A **Sequence Point** is a specific point in the program's execution where:
*   All **side effects** of previous evaluations must be complete.
*   No **side effects** of subsequent evaluations may have started.

It acts as a "synchronization barrier" for memory visibility.

## 2. The Golden Rule
The C Standard states:
> **"Between two sequence points, the value of a scalar object shall be modified only once by the evaluation of an expression."**

## 3. List of Standard Sequence Points
1.  **Statement termination:** The semicolon `;`.
2.  **Logical Operators:** `&&` and `||`.
    *   *Note:* These enforce **Short-Circuit Evaluation**. The left side is fully evaluated (including side effects) before the right side is touched.
3.  **Comma Operator:** `,` (e.g., `func(), do_something()`).
    *   *Trap:* The comma used to separate function arguments (`func(a, b)`) is a **separator**, NOT a sequence point.
4.  **Ternary Operator:** `? :` (The condition is fully evaluated before the branch，which means the `?` is a sequence point).
5.  **Function Call:** Before the execution of the function body begins (after all arguments are evaluated).

## 4. The "Unsequenced" Hazards
If there is no sequence point between two operations on the same variable, the behavior is **Undefined**.

*   **Example 1:** `i = i++ + 1;`
    *   *Conflict:* The side effect of `i++` (increment) and the assignment `=` happen in the same window without a sequence point.
*   **Example 2:** `func(i++, i++);`
    *   *Conflict:* Function arguments are **unsequenced** relative to each other. The compiler may increment the first `i`, the second `i`, or both in any order.
*   **Example 3:** `a[i] = i++;`
    *   *Conflict:* The read of `i` (for array indexing) and the write to `i` (post-increment) are unsequenced. The index could be the old `i` or the new `i`.

## 5. C11 Standard Update
The C11 standard officially deprecated the term "Sequence Point" in favor of more precise relationships to handle multi-threading and complex expressions:
*   **Sequenced Before:** Strict ordering (A happens before B).
*   **Unsequenced:** Two actions can happen in any order or arguably simultaneously (interleaved instructions). **This causes UB if data races occur.**
*   **Indeterminately Sequenced:** One must finish before the other starts, but the choice of which goes first is up to the compiler (e.g., function arguments `func(a(), b())`).