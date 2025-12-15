**Definition:** In the C programming language, a **literal** is a fixed, constant value written directly in the source code. Literals represent values that **do not change during program execution**, and they are used to initialize variables, pass arguments, and express constant data.

C provides several types of literals, each corresponding to a specific data type.

---

## **1. Integer Literals**

Integer literals represent whole numbers without a fractional part.

Examples:

```c
10 -3 0 255U     // unsigned
123L     // long
0xFF     // hexadecimal
017      // octal
0b1010   // binary (C23 and some compilers)
```

---

## **2. Floating-Point Literals**

Floating-point literals represent real numbers with decimals or exponent notation.

Examples:

```c
3.14 -0.5 2.0e3     // exponential notation
4.5f      // float
6.02E-23  // scientific notation
```

---

## **3. Character Literals**

Character literals represent single characters enclosed in single quotes.

Examples:

```c
'a' '0' '\n'   // newline escape character
'\x41' // hexadecimal character code (A)
```

---

## **4. String Literals**

String literals represent sequences of characters enclosed in double quotes.  
They are stored as arrays of `char` terminated by a null character `\0`.

Examples:

```c
"Hello" "" "Line1\nLine2"
```

---

## **5. Enumeration Constants**

When using `enum`, each named constant in the enumeration also behaves like an integer literal.

Example:

```c
enum Color { RED = 1, GREEN = 2, BLUE = 3 };
```

---

## **Key Properties of Literals**

- Their values are **known at compile time**.
    
- They have specific **types** (e.g., `int`, `double`, `char`).
    
- They **cannot be modified** during runtime.
    
- String literals have **static storage duration** and should not be changed.
    

Example:

```c
const int x = 10;   // 10 is a literal
printf("%s", "Hi"); // "Hi" is a string literal
```