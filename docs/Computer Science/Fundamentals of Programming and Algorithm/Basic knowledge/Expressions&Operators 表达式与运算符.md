### Expressions

Expressions are combinations of variables, constants, and operators that produce a single value.
- **Expressions produce values**

### Operators
Operators are special symbols that perform operations on operands(操作数) (variables, constants).

#### Basic Operator Types

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


#### C Operator Precedence & Associativity Table

| Precedence (High→Low) | Operators                                                                                                                                                                            | Description                                   | Associativity    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ---------------- |
| **1**                 | `()` `[]` `->` `.`                                                                                                                                                                   | Function call, array subscript, struct member | **Left → Right** |
| **2**                 | `++` `--` _(postfix)_       `++` `--` _(prefix)_  <br>`+` `-` _(unary)_  <br>`!` `~`  <br>`*` _(dereference)_  <br>`&` _(address-of)_  <br>`sizeof` `_Alignof`<br>type cast `(type)` | Unary operators                               | **Right → Left** |
| **3**                 | `*` `/` `%`                                                                                                                                                                          | Multiplicative                                | **Left → Right** |
| **4**                 | `+` `-`                                                                                                                                                                              | Additive                                      | **Left → Right** |
| **5**                 | `<<` `>>`                                                                                                                                                                            | Bitwise shift                                 | **Left → Right** |
| **6**                 | `<` `<=` `>` `>=`                                                                                                                                                                    | Relational                                    | **Left → Right** |
| **7**                 | `==` `!=`                                                                                                                                                                            | Equality                                      | **Left → Right** |
| **8**                 | `&`                                                                                                                                                                                  | Bitwise AND                                   | **Left → Right** |
| **9**                 | `^`                                                                                                                                                                                  | Bitwise XOR                                   | **Left → Right** |
| **10**                | `\|`                                                                                                                                                                                 | Bitwise OR                                    | **Left → Right** |
| **11**                | `&&`                                                                                                                                                                                 | Logical AND                                   | **Left → Right** |
| **12**                | `\|\|`                                                                                                                                                                               | Logical OR                                    | **Left → Right** |
| **13**                | `?:`                                                                                                                                                                                 | Conditional (ternary)                         | **Right → Left** |
| **14**                | `=` `+=` `-=` `*=` `/=`  <br>`%=` `<<=` `>>=` `&=` `^=` `\|=`                                                                                                                        | Assignment operators                          | **Right → Left** |
| **15**                | `,`                                                                                                                                                                                  | Comma operator                                | **Left → Right** |