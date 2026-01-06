## 1. Definition and Fundamental Nature

In the ISO C Standard, an **Expression** is defined as a sequence of operators and operands that performs one or more of the following operations:
1.  Computes a **value**.
2.  Designates an **object** or a **function**.
3.  Generates a **side effect**.

### The Recursive Definition
Expressions are defined recursively. The concept relies on the distinction between atomic units and composite structures:

*   **Primary Expressions (Atoms):** These are the simplest forms of expressions. They do not contain operators (except for parentheses).
    *   **Identifiers:** `x`, `count`, `buffer` (Variables/Functions).
    *   **Constants/Literals:** `42`, `3.14f`, `'c'`.
    *   **String Literals:** `"Hello World"`.
    *   **Parenthesized Expressions:** `(a + b)`.
*   **Compound Expressions:** Built by combining expressions (operands) with operators.
    *   Since operands must themselves be expressions, a structure like `a + b * c` is a tree of sub-expressions.

## 2. Core Attributes of an Expression

Every expression possesses two static (compile-time) attributes and one dynamic (runtime) attribute:

### A. Type
C is a statically typed language. Every expression has a type determined at compile time.
*   **Implicit Conversion:** Operands may undergo *Integer Promotion* or *Arithmetic Conversion* within an expression.
    *   *Example:* In `3 + 2.5`, the integer `3` is promoted to `double`, and the resulting expression has the type `double`.

### B. Value
Unless the type is `void` (e.g., a call to a void function), every expression evaluates to a mathematical or logical result.
*   *Note:* Even assignment expressions have a value. The expression `x = 5` evaluates to `5`.

### C. Value Category (Lvalue vs. Rvalue)
This is the most critical structural distinction in C expressions.

1.  **Lvalue (Locator Value):**
    *   **Definition:** An expression that designates a specific object in memory (it has an address).
    *   **Capability:** You can take its address using the `&` operator.
    *   **Context:** historically appeared on the **L**eft side of an assignment.
    *   *Examples:* `var`, `*ptr`, `arr[index]`, `struct.member`.
2.  **Rvalue (Value of an Expression):**
    *   **Definition:** The computed value of an expression. It does not necessarily occupy a persistent memory location.
    *   **Capability:** You **cannot** take its address.
    *   **Context:** historically appeared on the **R**ight side of an assignment.
    *   *Examples:* `100` (integer constant), `x + y` (result of addition), `func()` (return value).

## 3. Evaluation Semantics

How the compiler interprets an expression depends on three rules. It is vital to distinguish between them.

### A. Precedence
**Definition:** Determines how operators are grouped when there are no parentheses.
*   *Rule:* Operators with higher precedence bind tighter to their arguments.
*   *Example:* In `a + b * c`, multiplication (`*`) has higher precedence than addition (`+`). The expression is parsed as `a + (b * c)`.

### B. Associativity
**Definition:** Determines the grouping direction when operators of the **same** precedence appear consecutively.
*   **Left-to-Right:** Common for arithmetic. `a - b - c` $\rightarrow$ `(a - b) - c`.
*   **Right-to-Left:** Used for assignment and unary operators. `a = b = c` $\rightarrow$ `a = (b = c)`.

### C. Order of Evaluation
**Definition:** The order in which the CPU computes the distinct operands within an expression.
*   *Rule:* Generally **unspecified** by the standard.
*   *Example:* In `f1() + f2()`, the precedence rules dictates that the *results* of the functions are added. However, the standard does **not** specify whether `f1` runs before `f2` or vice versa.

## 4. Classification by Operator

Expressions are often categorized by the arity (number of operands) of the top-level operator.

### A. Unary Expressions
Operate on a single operand.
*   `!a` (Logical NOT)
*   `-a` (Negation)
*   `&a` (Address-of)
*   `*p` (Dereference)
*   `sizeof(type)`

### B. Binary Expressions
Operate on two operands.
*   **Arithmetic:** `+`, `-`, `*`, `/`, `%`
*   **Relational:** `<`, `>`, `<=`, `>=`
*   **Logical:** `&&`, `||`
    *   *Note:* These feature **Short-Circuit Evaluation**. If the first operand determines the result, the second operand is *not evaluated*.
*   **Bitwise:** `&`, `|`, `^`, `<<`, `>>`
*   **Assignment:** `=`, `+=`, `-=`, etc.

### C. Ternary Expressions (Conditional)
The only operator taking three operands: `condition ? expr_true : expr_false`.
*   Only one of the result expressions (`expr_true` or `expr_false`) is evaluated.

### D. Comma Expressions
Format: `expr1, expr2`
*   Evaluates `expr1`, discards its result, then evaluates `expr2`.
*   The value and type of the entire expression are those of `expr2`.

## 5. Expression Statements

In C, an expression becomes a statement simply by appending a semicolon `;`.

*   **Syntax:** `expression;`
*   **Behavior:** The expression is evaluated for its **side effects** (e.g., modifying a variable, calling a function).
*   **Discarded Value:** If the expression yields a value (e.g., `3 + 4`), that value is discarded.

**Examples:**
```c
x = 0;      // Assignment expression used as a statement.
printf(""); // Function call expression used as a statement.
i++;        // Post-increment expression used as a statement.
3 + 4;      // Legal, but useless (calculates 7, discards it).
;           // Null statement (empty expression).
```


## 6. Operators
Operators are special symbols that perform operations on operands(操作数) (variables, constants).

### Basic Operator Types

##### 1. Arithmetic Operators 算术运算符

```c
int a = 10, b = 3;
a + b   // 13  (Addition)
a - b   // 7   (Subtraction)  
a * b   // 30  (Multiplication)
a / b   // 3   (Division - integer)
a % b   // 1   (Modulo - remainder)
```

##### 2. Relational Operators 关系运算符

```c
a == b  // 0 (Equal to)
a != b  // 1 (Not equal to)
a > b   // 1 (Greater than)
a < b   // 0 (Less than)
a >= b  // 1 (Greater than or equal to)
a <= b  // 0 (Less than or equal to)
```

##### 3. Logical Operators 逻辑运算符

```c
int x = 5, y = 10;
(x > 0) && (y < 20)  // 1 (AND - both must be true)
(x > 10) || (y == 10) // 1 (OR - at least one true)
!(x == 5)             // 0 (NOT - reverses truth)
```
##### 4. Assignment Operators 赋值运算符

```c
int num = 10;
num += 5;   // num = num + 5  → 15
num -= 3;   // num = num - 3  → 12
num *= 2;   // num = num * 2  → 24
num /= 4;   // num = num / 4  → 6
```

##### 5. Increment/Decrement Operators 自增/自减运算符

```c
int count = 5;
count++;    // Post-increment: use then increase → 5 (then count becomes 6)
++count;    // Pre-increment: increase then use → 7 (count becomes 7)
count--;    // Post-decrement → 7 (then becomes 6)
--count;    // Pre-decrement → 5 (count becomes 5)
```

##### 6. Conditional (Ternary) Operator 条件（三元）运算符

```c
int age = 20;
char* status = (age >= 18) ? "Adult" : "Minor";
// If age >= 18, status = "Adult", else "Minor"
```

##### 7. Comma Operator 逗号运算符

```c
int a, b, c;
a = (b = 5, c = 10, b + c);  // a = 15, b = 5, c = 10
```


