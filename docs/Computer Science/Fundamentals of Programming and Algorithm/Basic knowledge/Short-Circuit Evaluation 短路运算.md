### 1. Definition
**Short-Circuit Evaluation** means that the compiler stops evaluating an expression as soon as the result is determined.
*   If the **Left Operand** decides the result, the **Right Operand** is **completely skipped (not executed)**.

---

### 2. The `&&` (AND) Rule
**Rule:** Stop if **False**.
For the expression `A && B`:
*   If **A is False (0)**: The entire result is definitely False.
    *   **B is NOT executed.**
*   If **A is True (non-zero)**: The result depends on B.
    *   **B IS executed.**

**Example:**
```c
int a = 0;
// Since 'a' is 0 (False), the computer ignores (5 > 2).
if (a && 5 > 2) {
    // This block is not entered
}
```

---

### 3. The `||` (OR) Rule
**Rule:** Stop if **True**.
For the expression `A || B`:
*   If **A is True**: The entire result is definitely True.
    *   **B is NOT executed.**
*   If **A is False**: The result depends on B.
    *   **B IS executed.**

---

### 4.  Important Warning: Side Effects
This is the most common bug caused by short-circuiting. If the right side contains **increment (`++`)**, **decrement (`--`)**, or **function calls**, they might not happen.

**Code Example:**
```c
int a = 0;
int b = 10;

// 'a' is 0 (False), so '&&' short-circuits.
// The code 'b++' is NEVER executed.
if (a == 1 && b++ > 5) {
    // ...
}

printf("%d", b); // Output is still 10, NOT 11.
```

---

### 5. Practical Use Cases (Why is it useful?)
Programmers use short-circuiting to write **safe code** and prevent crashes.

#### A. Protecting Pointers (Most Common)
Check if a pointer is valid before using it.
```c
// If ptr is NULL (False), 'ptr->value' is skipped.
// This prevents a "Segmentation Fault" crash.
if (ptr != NULL && ptr->value == 10) {
    // Safe to run
}
```

#### B. Preventing Division by Zero
```c
// If x is 0, the division 'y / x' is skipped.
if (x != 0 && y / x > 1) {
    // Safe to run
}
```

---

### Summary Table

| Operator | Left Operand  | Right Operand? | Result           |
| :------- | :------------ | :------------- | :--------------- |
| `&&`     | **False** (0) | **Skipped**    | 0 (False)        |
| `&&`     | **True** (1)  | Executed       | Depends on Right |
| `\|\|`   | **True** (1)  | **Skipped**    | 1 (True)         |
| `\|\|`   | **False** (0) | Executed       | Depends on Right |
