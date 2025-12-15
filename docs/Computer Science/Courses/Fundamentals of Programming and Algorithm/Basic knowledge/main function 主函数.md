# **The `main` Function in C**

In C programming, the **`main` function** is the entry point of every program. When a C program starts running, **execution always begins from `main`**, regardless of how many other functions the program contains.

---

## **1. Function Signature**

C allows two standard and portable forms of `main`:

### **Recommended (with arguments)**

`int main(int argc, char *argv[]);`

or equivalently:

`int main(int argc, char **argv);`

### **Simplest form**

`int main(void);`

### Non-standard

Some compilers allow:

`void main();`

but this is **not valid in standard C** and should be avoided.

---

## **2. Meaning of Parameters**

### **`argc`**

- Stands for **argument count**.
    
- Represents the number of command-line arguments.
    
- Always ≥ 1 (the first argument is the program name).
    

### **`argv`**

- Stands for **argument vector**.
    
- An array of C strings containing command-line arguments.
    
- `argv[0]` = program name
    
- `argv[1]` ~ `argv[argc-1]` = user-provided arguments
    

---

## **3. Return Type (`int`)**

The return type of `main` must be:

`int`

Returning a value from `main` reports the program’s execution status to the operating system.

### Common return values:

- `return 0;` — program finished successfully
    
- `return 1;` — program ended with an error (custom meaning)
    

If you omit `return 0;` in C99 or later, the compiler **automatically inserts it**.

---

## **4. Example 1: Basic Program**

`#include <stdio.h>  int main(void) {     printf("Hello, world!\n");     return 0; }`

---

## **5. Example 2: Program with Arguments**

`#include <stdio.h>  int main(int argc, char *argv[]) {     printf("Number of arguments: %d\n", argc);     for (int i = 0; i < argc; i++) {         printf("argv[%d] = %s\n", i, argv[i]);     }     return 0; }`

---

## **6. Key Characteristics of `main`**

- It is **required** in every C program.
    
- There can be only **one** `main` function.
    
- Program execution always begins at the first statement inside `main`.
    
- Returning an integer communicates status to the operating system.
    

---

## **7. Special Notes**

- The C standard only guarantees two valid signatures:
    
    - `int main(void)`
        
    - `int main(int argc, char *argv[])`
        
- `main` can also be declared with additional implementation-defined arguments:
    
    `int main(int argc, char *argv[], char *envp[]);`
    
    but this is compiler-specific and not portable.

[[Command Line Arguments 命令行参数 | Learn more about Command Line Arguments]]