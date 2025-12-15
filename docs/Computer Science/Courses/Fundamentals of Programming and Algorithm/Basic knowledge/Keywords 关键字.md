## **1. Introduction**

- **Definition:** Keywords are reserved words that have special meaning to the compiler.
    
- **Rule:** You cannot use keywords as variable names, function names, or identifiers.
    
- **Count:**
    
    - **C89/C90 (Standard):** 32 Keywords.
        
    - **C99:** Added 5 keywords (e.g., inline, restrict).
        
    - **C11:** Added 7 keywords (e.g., _Atomic, _Generic).
        

---

## **2. Categorization of Keywords (Standard 32)**

### **A. Primary Data Types (9)**

Used to declare variables and function return types.

1. **void**: Represents the absence of type (no return value, or generic pointer void*).
    
2. **char**: Character type (1 byte).
    
3. **short**: Short integer.
    
4. **int**: Standard integer.
    
5. **long**: Long integer.
    
6. **float**: Single-precision floating point.
    
7. **double**: Double-precision floating point.
    
8. **signed**: Explicitly states a variable can hold negative numbers.
    
9. **unsigned**: States a variable can only hold positive numbers (doubles the positive range).
    

### **B. User-Defined Types & Structures (4)**

Used to create complex data organizations.  
10. **struct**: Defines a structure (group of variables).  
11. **union**: Defines a union (variables share the same memory).  
12. **enum**: Defines a set of named integer constants.  
13. **typedef**: Creates an alias (nickname) for an existing type.

### **C. Storage Classes (4)**

Defines the scope, lifetime, and storage location of variables.  
14. **auto**: Default storage class for local variables (stored on Stack). rarely written explicitly.  
15. **extern**: Declares a variable/function defined in another file (Global scope).  
16. **register**: Hints to the compiler to store the variable in a CPU register for speed.  
17. **static**:  
* Inside function: Persists value between calls.  
* Global: Limits visibility to the current file (private).

### **D. Type Qualifiers (2)**

Modifies the properties of a variable.  
18. **const**: The variable becomes read-only (value cannot be changed).  
19. **volatile**: Tells the compiler **not** to optimize this variable because its value may change unexpectedly (e.g., by hardware interrupt).

### **E. Flow Control (12)**

Controls the execution path of the program.

- **Looping:**  
    20. **for**: For loops.  
    21. **while**: While loops.  
    22. **do**: Used in do-while loops.
    
- **Branching:**  
    23. **if**: Conditional statement.  
    24. **else**: Alternative conditional path.  
    25. **switch**: Multi-way selection statement.  
    26. **case**: Labels inside a switch.  
    27. **default**: Default label inside a switch.
    
- **Jumping:**  
    28. **break**: Exits a loop or switch immediately.  
    29. **continue**: Skips the rest of the current loop iteration.  
    30. **goto**: Jumps to a labeled part of the code (use sparingly).  
    31. **return**: Returns from a function (with or without a value).
    

### **F. Operators (1)**

1. **sizeof**: Returns the size (in bytes) of a data type or variable.
    
    - Note: It looks like a function, but it is a **compile-time operator**.
        

---

## **3. Modern C Keywords (C99 & C11)**

Standard C has evolved. Here are key additions:

### **C99 Additions**

- **inline**: Suggests the compiler embed the function code directly at the call site to save function-call overhead.
    
- **restrict**: (Pointer only) Promises the compiler that this pointer is the only way to access the memory object (enables aggressive optimization).
    
- **_Bool**: True boolean type (0 or 1). Usually accessed via <stdbool.h> as bool.
    
- **_Complex**: For complex number arithmetic.
    

### **C11 Additions**

- **_Atomic**: Thread-safe variables (operations cannot be interrupted).
    
- **_Generic**: Enables type-generic programming (similar to C++ function overloading but using macros).
    
- **_Static_assert**: Performs an assertion check at compile-time (e.g., checking if int is 4 bytes).
    
- **_Noreturn**: Tells compiler a function never returns (e.g., exit()).
    

---

## **4. Deep Dive: The Tricky Ones**

### **volatile vs. const**

- **const**: "I promise not to change this."
    
- **volatile**: "I warn you that something else (hardware, OS) might change this."
    
- Can they be used together?
    
    - **Yes!** const volatile int *ptr;
        
    - Meaning: The program cannot change it (read-only), but hardware might update it (status register).
        

### **sizeof**

- It is **not** a function.
    
    codeC
    
    ```
    int x;
    sizeof(int); // Parentheses required for Types
    sizeof x;    // Parentheses OPTIONAL for Variables
    ```
    

### **static**

Always remember the dual meaning:

1. **Privacy:** Hides global variables/functions from other files.
    
2. **Persistence:** Remembers local variables between function calls.
    

---

## **5. Summary Table**

|                |                                                                      |
| -------------- | -------------------------------------------------------------------- |
| Category       | Keywords                                                             |
| **Types**      | int, char, float, double, void, short, long, signed, unsigned, _Bool |
| **Control**    | if, else, switch, case, default, for, do, while                      |
| **Jumps**      | break, continue, return, goto                                        |
| **Storage**    | auto, extern, register, static, typedef                              |
| **Structs**    | struct, union, enum                                                  |
| **Qualifiers** | const, volatile, restrict, _Atomic                                   |
| **Other**      | sizeof, inline                                                       |